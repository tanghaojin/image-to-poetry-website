# 见景寻诗后端 API 协议

版本：v1  
日期：2026-09-12

## 1. 主接口

```http
POST /api/v1/poetry/match
Content-Type: multipart/form-data
```

一个请求完成：图片校验、图片理解、意境标准化、诗词召回、真实性门禁、评分和最高分结果返回。

### 1.1 当前已落地的诗词匹配子接口

图片理解供应商接入前，后端先提供归一化结果到诗词库的确定性匹配接口：

```http
POST /api/v1/poems/match
Content-Type: application/json
```

请求体使用 `subjects`、`season`、`time`、`weather`、`mood`、`sceneSummary`、`confidence`。
该接口只返回本地 `verified` 诗词，不接受客户端传入诗词正文。完整图片接口落地后在服务端内部复用同一匹配服务。

### 请求字段

| 字段 | 类型 | 必填 | 规则 |
|---|---|---:|---|
| `image` | File | 是 | JPG、PNG、WebP，最大 10 MB |

请求头必须包含：

```http
X-Device-Fingerprint: <browser-fingerprint>
```

不接受客户端传入作者、诗句、意境或模型名称，防止绕过后端统一流程。

### 成功响应

```json
{
  "requestId": "req_01K...",
  "understanding": {
    "subjects": ["孤舟", "江河", "雪景"],
    "season": "冬",
    "time": "白昼",
    "weather": "雪",
    "mood": "孤寂",
    "moods": [
      {"tag": "孤寂", "confidence": 0.94},
      {"tag": "宁静", "confidence": 0.72}
    ],
    "sceneSummary": "寒江之上，一叶孤舟独行",
    "confidence": 0.94
  },
  "poem": {
    "id": "tang-liuzongyuan-jiangxue",
    "title": "江雪",
    "author": "柳宗元",
    "dynasty": "唐",
    "genre": "绝句",
    "lines": [
      "千山鸟飞绝",
      "万径人踪灭",
      "孤舟蓑笠翁",
      "独钓寒江雪"
    ],
    "selectedLineIndexes": [2, 3]
  },
  "match": {
    "score": 0.93,
    "matchedTags": ["孤舟", "江河", "冬", "雪", "孤寂"],
    "reason": "孤舟、寒江和冬雪意象与画面高度相合。",
    "algorithmVersion": "tag-score-v2"
  },
  "meta": {
    "processingMs": 2860
  }
}
```

约束：

- `subjects` 最多 5 个；
- `moods` 按置信度从高到低返回 1～3 个不同意境，匹配器按各自置信度参与评分；
- `mood` 保留为 `moods[0].tag`，兼容旧客户端；
- `confidence`、`score` 范围为 0–1；
- `poem` 必须来自 `verification_status = verified` 的本地数据；
- 相同输入及相同识别结果使用稳定排序，只返回最高分一首；
- 不向前端暴露模型密钥和供应商原始响应。

## 2. 错误响应

统一格式：

```json
{
  "requestId": "req_01K...",
  "error": {
    "code": "SERVER_BUSY",
    "message": "服务器繁忙，请稍后再试。",
    "retryable": false,
    "details": null
  }
}
```

| HTTP | code | 场景 | 是否重试 |
|---:|---|---|---:|
| 400 | `IMAGE_MISSING` | 缺少图片 | 否 |
| 400 | `DEVICE_FINGERPRINT_MISSING` | 缺少或无效的浏览器指纹 | 否 |
| 413 | `IMAGE_TOO_LARGE` | 超过 10 MB | 否 |
| 415 | `IMAGE_TYPE_UNSUPPORTED` | 非 JPG/PNG/WebP | 否 |
| 422 | `IMAGE_DECODE_FAILED` | 文件扩展名正常但内容损坏 | 否 |
| 429 | `SERVER_BUSY` | 当前浏览器指纹当日请求超过 100 次 | 次日 |
| 502 | `VISION_PROVIDER_UNAVAILABLE` | 所有图片模型均失败 | 是 |
| 503 | `POETRY_CORPUS_UNAVAILABLE` | 诗词库未就绪 | 是 |
| 503 | `SERVER_BUSY` | Redis 不可用，暂时停止新模型请求 | 是 |
| 504 | `VISION_TIMEOUT` | 图片理解超过 45 秒 | 是 |
| 500 | `INTERNAL_ERROR` | 未分类服务错误 | 是 |

后端日志保留详细内部错误，前端只接收稳定错误码，不显示供应商密钥、响应正文或调用栈。

## 3. 浏览器指纹限流

### 前端指纹

Nuxt 前端使用 `@fingerprintjs/fingerprintjs` 生成 `visitorId`，并在同一浏览器会话中缓存。FingerprintJS 加载失败时生成并持久化一个随机 UUID 作为降级设备标识。

```http
X-Device-Fingerprint: <visitorId-or-fallback-uuid>
```

浏览器中的任何密钥都可以被访问者读取，因此前端不生成带共享密钥的 HMAC 签名。后端只校验字段长度和字符格式，然后使用服务端专用密钥对指纹做 HMAC-SHA256，Redis 只保存摘要。

### Redis 计数

```text
接收浏览器指纹
→ 格式校验
→ 服务端 HMAC-SHA256
→ img2poetry:quota:{hash}:{YYYYMMDD}
→ Redis Lua 原子递增
→ 1～100 放行
→ 第 101 次起返回 HTTP 429 / SERVER_BUSY
```

- 按 `Asia/Hong_Kong` 自然日重置；
- Key 的 TTL 设置到下一个香港零点后自动删除；
- 图片通过类型、大小和解码检查后才计数；
- 一次请求内模型自动降级只计一次；
- 不限制 IP，不保存原始 IP；
- 不在响应中暴露每日额度、已使用次数和重置时间；
- 前端收到 `SERVER_BUSY` 后统一显示“服务器繁忙，请稍后再试”。

浏览器指纹属于轻量防滥用措施，清理浏览器数据、更换浏览器或伪造请求头均可能产生新指纹。当前产品采用该限制强度，不叠加 IP 额度。

Redis 连接异常时采用 fail-closed：不继续消耗模型服务，返回 HTTP 503 和相同的“服务器繁忙，请稍后再试”提示。

### 环境变量

```dotenv
REDIS_URL=redis://redis:6379/0
RATE_LIMIT_ENABLED=true
RATE_LIMIT_DAILY=100
RATE_LIMIT_TIMEZONE=Asia/Hong_Kong
FINGERPRINT_HASH_SECRET=<server-only-secret>
```

## 4. 模型路由

部署区域选择香港。后端按照配置顺序调用模型，而不是根据用户 IP 决定：

```text
Gemini 3.7 Flash
→ Gemini 3.6 Flash
→ GLM-4.6V-Flash
→ GLM-4.1V-Thinking-Flash
```

以下情况进入下一候选模型：

- 认证或模型不可用；
- 供应商限流；
- 网络连接失败；
- 响应结构不完整；
- 单模型超时。

模型顺序通过环境变量配置。香港生产服务器上线前分别执行一次真实图片调用，以服务器实测结果确定最终顺序。

## 5. 超时

```text
单模型连接超时：5 秒
单模型响应超时：20 秒
整条请求总超时：45 秒
Nginx proxy_read_timeout：50 秒
```

达到总超时后取消未完成的供应商请求并返回 `VISION_TIMEOUT`，旧请求结果不再写入当前响应。

## 6. 图片隐私

- 图片只在请求内存和模型调用期间存在；
- 不写本地磁盘；
- 不上传对象存储；
- 不记录 Base64；
- 不记录完整供应商响应；
- 请求结束后释放图片和分析副本；
- 前端继续展示“图片仅用于意境分析，本站不保存”。

## 7. 辅助接口

```http
GET /healthz
GET /readyz
GET /api/v1/poems/{poem_slug}
```

- `/healthz`：进程存活检查；
- `/readyz`：检查数据库连接和诗词库是否已导入；
- `/api/v1/poems/{poem_slug}`：读取已经校验的标准诗词详情。

首版不提供随机换诗、人工调整意境、图片保存和作品历史接口。
