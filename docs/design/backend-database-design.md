# 见景寻诗后端数据库设计

版本：v1  
日期：2026-09-12

## 1. 设计目标

数据库承担四类职责：

1. 保存经过校验的真实古典诗词；
2. 保存诗词与意象、季节、天气、意境等标签的关系；
3. 保存项目选定的标准版本和最小来源信息；
4. 为图片识别结果提供确定性的候选召回与评分数据。

线上接口返回的候选只在请求内存中使用。只有完成本地校验并经过人工确认的数据，才进入正式诗词表。

## 2. 数据关系

```text
authors 1 ─── N poems
poems   1 ─── N poem_lines
poems   N ─── N tags          via poem_tags
tags    1 ─── N tag_aliases
poems   1 ─── N match_results（可选、仅保存脱敏结果）
```

## 3. PostgreSQL 枚举

```sql
CREATE TYPE poem_genre AS ENUM (
  '古体诗', '绝句', '律诗', '词', '曲', '乐府', '其他'
);

CREATE TYPE verification_status AS ENUM (
  'pending', 'verified', 'rejected'
);

CREATE TYPE tag_dimension AS ENUM (
  'subject',
  'season',
  'time',
  'weather',
  'mood',
  'theme',
  'atmosphere'
);

```

朝代首版使用受控字符串而不是 PostgreSQL ENUM，便于后续增加“先秦、汉、魏晋、南北朝、金”等边界分类。

## 4. 核心表

### 4.1 authors 作者表

```sql
CREATE TABLE authors (
  id              BIGSERIAL PRIMARY KEY,
  slug            VARCHAR(100) NOT NULL UNIQUE,
  name            VARCHAR(50) NOT NULL,
  normalized_name VARCHAR(50) NOT NULL,
  dynasty         VARCHAR(20) NOT NULL,
  aliases         JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (dynasty, normalized_name)
);
```

示例 `slug`：`tang-liuzongyuan`。

### 4.2 poems 诗词主表

```sql
CREATE TABLE poems (
  id                   BIGSERIAL PRIMARY KEY,
  slug                 VARCHAR(160) NOT NULL UNIQUE,
  title                VARCHAR(120) NOT NULL,
  normalized_title     VARCHAR(120) NOT NULL,
  author_id            BIGINT NOT NULL REFERENCES authors(id),
  dynasty              VARCHAR(20) NOT NULL,
  genre                poem_genre NOT NULL,
  tune                 VARCHAR(120),
  canonical_text       TEXT NOT NULL,
  normalized_text      TEXT NOT NULL,
  aliases              JSONB NOT NULL DEFAULT '[]'::jsonb,
  popularity           NUMERIC(4,3) NOT NULL DEFAULT 0.500,
  verification_status  verification_status NOT NULL DEFAULT 'pending',
  source_name          VARCHAR(200),
  source_url           TEXT,
  verified_at          TIMESTAMPTZ,
  schema_version       SMALLINT NOT NULL DEFAULT 1,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ck_poems_popularity CHECK (
    popularity >= 0 AND popularity <= 1
  )
);

CREATE INDEX idx_poems_verified
  ON poems (verification_status, dynasty, genre);

CREATE INDEX idx_poems_author
  ON poems (author_id);
```

说明：

- `canonical_text` 保存带标准标点的展示正文；
- `normalized_text` 去除标点、空格并统一异体字，仅用于检索和去重；
- `popularity` 是名篇优先级，不代表艺术价值；
- 只有 `verification_status = 'verified'` 的记录可以返回给前端。

### 4.3 poem_lines 诗句表

```sql
CREATE TABLE poem_lines (
  id              BIGSERIAL PRIMARY KEY,
  poem_id         BIGINT NOT NULL REFERENCES poems(id) ON DELETE CASCADE,
  line_no         SMALLINT NOT NULL,
  text            TEXT NOT NULL,
  normalized_text TEXT NOT NULL,
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (poem_id, line_no)
);

CREATE INDEX idx_poem_lines_poem
  ON poem_lines (poem_id, line_no);
```

诗句单独存储，避免运行时按逗号错误切分，也方便选择最适合海报的诗句。

## 5. 标签体系

### 5.1 tags 标签表

```sql
CREATE TABLE tags (
  id              BIGSERIAL PRIMARY KEY,
  dimension       tag_dimension NOT NULL,
  name            VARCHAR(40) NOT NULL,
  normalized_name VARCHAR(40) NOT NULL,
  description     VARCHAR(200),
  enabled         BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (dimension, normalized_name)
);
```

### 5.2 tag_aliases 标签同义词

```sql
CREATE TABLE tag_aliases (
  id               BIGSERIAL PRIMARY KEY,
  tag_id           BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  alias            VARCHAR(40) NOT NULL,
  normalized_alias VARCHAR(40) NOT NULL UNIQUE
);
```

示例：

| 标准标签 | 同义词 |
|---|---|
| 江河 | 江、江水、河流、水面 |
| 孤舟 | 小舟、扁舟、一叶舟、渔舟 |
| 黄昏 | 傍晚、日暮、夕照、落日时分 |
| 孤寂 | 寂寥、清寂、孤独、寂静 |

模型返回的自由文本必须先经过同义词表归一化，再参与查询。

### 5.3 poem_tags 诗词标签权重

```sql
CREATE TABLE poem_tags (
  poem_id          BIGINT NOT NULL REFERENCES poems(id) ON DELETE CASCADE,
  tag_id           BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  weight           NUMERIC(4,3) NOT NULL,
  evidence_lines   SMALLINT[] NOT NULL DEFAULT '{}',
  source           VARCHAR(20) NOT NULL DEFAULT 'manual',
  reviewed         BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (poem_id, tag_id),
  CONSTRAINT ck_poem_tags_weight CHECK (
    weight > 0 AND weight <= 1
  ),
  CONSTRAINT ck_poem_tags_source CHECK (
    source IN ('manual', 'rule', 'model')
  )
);

CREATE INDEX idx_poem_tags_lookup
  ON poem_tags (tag_id, weight DESC, poem_id);
```

`source = 'model'` 的标签只有在 `reviewed = true` 后才进入正式匹配。

## 6. 标准版本与最小来源信息

首版只在 `poems` 保存项目选定的标准正文：

- `canonical_text`：带标准标点的展示正文；
- `normalized_text`：仅用于检索和去重；
- `source_name`：标准版本的来源名称；
- `source_url`：可选的来源链接；
- `verified_at`：确认标准版本的时间。

不建立异文表，不记录异文说明，也不建立独立来源表。线上候选若与标准正文不一致，直接以本地 `canonical_text` 为准。

## 7. 匹配结果记录

首版可以不保存每次匹配。如果需要统计质量，只保存脱敏结果：

```sql
CREATE TABLE match_results (
  id                  UUID PRIMARY KEY,
  poem_id             BIGINT REFERENCES poems(id),
  subjects            JSONB NOT NULL DEFAULT '[]'::jsonb,
  season               VARCHAR(20),
  time_of_day          VARCHAR(20),
  weather              VARCHAR(20),
  mood                 VARCHAR(40),
  confidence           NUMERIC(4,3),
  total_score          NUMERIC(5,4),
  score_breakdown      JSONB NOT NULL,
  matched_tags         JSONB NOT NULL DEFAULT '[]'::jsonb,
  algorithm_version    VARCHAR(30) NOT NULL,
  vision_provider      VARCHAR(30),
  vision_model         VARCHAR(80),
  duration_ms          INTEGER,
  status               VARCHAR(20) NOT NULL,
  error_code           VARCHAR(50),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_match_results_created
  ON match_results (created_at DESC);
```

不保存：

- 原始图片；
- 图片 Base64；
- 精确 IP；
- API Key；
- 模型的完整原始响应。

建议匹配记录保留 30 天后自动清理。若不需要产品分析，可以完全关闭该表的写入。

## 8. 浏览器指纹与 Redis 限流

首版不限制 IP。Nuxt 前端使用 FingerprintJS 生成浏览器指纹，并通过 `X-Device-Fingerprint` 请求头发送。后端校验指纹格式后，使用仅存于服务端的密钥执行 HMAC-SHA256，再将摘要用于 Redis Key；Redis 和日志均不保存浏览器原始指纹。

```text
img2poetry:quota:{fingerprint_hash}:{YYYYMMDD}
```

计数时区使用香港时间 `Asia/Hong_Kong`。Redis Lua 脚本在一次原子操作内完成 `INCR`、首次设置过期时间、计算剩余额度和判断是否放行，避免并发超发。

```text
1～100 次：放行
第 101 次起：HTTP 429，前端显示“服务器繁忙，请稍后再试”
```

图片通过格式、大小和解码检查后才占用一次额度；一次用户请求内部发生模型降级仍只计一次。Key 在次日零点后自动过期。

## 9. 第二阶段向量表

首版 30–2000 首诗词不启用向量检索。数据规模扩大后增加：

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE poem_embeddings (
  poem_id           BIGINT NOT NULL REFERENCES poems(id) ON DELETE CASCADE,
  embedding_model   VARCHAR(100) NOT NULL,
  embedding_version VARCHAR(30) NOT NULL,
  embedding         vector(1024) NOT NULL,
  embedded_text     TEXT NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (poem_id, embedding_model, embedding_version)
);
```

向量维度必须跟随最终选择的 embedding 模型确定，迁移文件中不应提前写死为未知维度。

## 10. 候选查询规则

首版召回查询只接受已校验诗词和已审核标签：

```sql
SELECT
  p.id,
  p.slug,
  p.title,
  p.popularity,
  SUM(pt.weight * input_tag.input_weight) AS tag_score
FROM poems p
JOIN poem_tags pt
  ON pt.poem_id = p.id
 AND pt.reviewed = true
JOIN input_tag
  ON input_tag.tag_id = pt.tag_id
WHERE p.verification_status = 'verified'
GROUP BY p.id
ORDER BY tag_score DESC, p.popularity DESC, p.id ASC
LIMIT 20;
```

最后的 `p.id ASC` 用于保证同分结果稳定，避免同一张图片多次请求得到不同诗词。

## 11. 数据导入门禁

诗词进入正式库必须经过：

```text
原始候选
→ 标题、作者、朝代规范化
→ 正文切句
→ 重复检测
→ 来源校验
→ 确认项目标准正文
→ 标签审核
→ verification_status = verified
```

硬性约束：

1. 未校验记录不参与匹配；
2. 正文不由模型改写；
3. 线上接口字段不直接覆盖本地标准正文；
4. 作者朝代与作品朝代必须一致；
5. 同一首诗只保存一个标准展示版本；
6. 标签权重范围为 0–1；
7. 所有匹配结果记录算法版本。

## 12. SQLAlchemy 模块划分

```text
app/
├─ poetry/
│  ├─ models/
│  │  ├─ author.py
│  │  ├─ poem.py
│  │  ├─ tag.py
│  │  └─ match_result.py
│  ├─ schemas/
│  ├─ repositories/
│  ├─ services/
│  └─ router.py
├─ db/
│  ├─ base.py
│  ├─ session.py
│  └─ migrations/
└─ scripts/
   ├─ import_poems.py
   ├─ validate_poems.py
   └─ build_tag_aliases.py
```

## 13. 初始数据来源

首批数据从 `chinese-poetry/chinese-poetry` 仓库的唐诗数据中选择 50 首。选择原则：

- 只选择唐诗；
- 优先绝句、律诗及适合图片排版的名篇；
- 覆盖山水、江河、落日、月夜、春花、秋景、冬雪、田园、思乡、离别等主要画面；
- 导入后只保存项目确认的标准正文；
- 记录上游仓库、文件路径和固定 commit SHA，保证数据版本可复现；
- 在进入 `verified` 状态前检查作者、标题、正文、重复项和异常字符。

## 14. 首版实际创建范围

第一批迁移创建：

- `authors`
- `poems`
- `poem_lines`
- `tags`
- `tag_aliases`
- `poem_tags`

限流计数存储在 Redis，不创建 PostgreSQL 限流表。`match_results` 根据是否需要质量统计决定是否启用；`poem_embeddings` 延后到语料规模和实际召回效果证明有必要时再创建。
