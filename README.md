# 见景寻诗（前端）

上传一张照片，根据画面中可信度最高的意境匹配一条真实古典诗词，并按原图比例生成诗意海报。

## 当前进度

- 已完成 Nuxt 4、Vue 3、TypeScript、Tailwind CSS 4 项目骨架。
- 已完成中文响应式首页：首页首屏、示例作品、使用流程、诗词可信说明、隐私说明、常见问题与页尾引导。
- 已完成上传区的 JPG / PNG / WebP 类型与 10 MB 大小限制。
- 已完成真实流程：浏览器一次上传图片，后端完成图片预处理、大模型理解、真实诗词匹配与指纹限流，再返回唯一诗句结果。
- 已完成浏览器 Canvas 海报合成，保持原图像素尺寸并导出 JPEG。
- 已接入三张真实示例照片，来源记录见 `public/images/examples/SOURCES.md`。

## 本地运行

```powershell
pnpm install
pnpm dev
```

当前开发端口访问 `http://localhost:3100`，诗词接口默认使用 `http://127.0.0.1:8000`。

部署时通过环境变量配置后端地址：

```dotenv
NUXT_PUBLIC_API_BASE=https://api.example.com
```

## 质量检查

```powershell
pnpm typecheck
pnpm build
```

## 当前接口

前端使用 `multipart/form-data` 调用 `POST /api/v1/poetry/match`，并通过 `X-Device-Fingerprint` 传递浏览器指纹。模型密钥只配置在后端，浏览器和前端构建产物中均不包含模型密钥。

接口一次完成图片理解与真实诗词匹配。编辑器、Canvas 海报、署名和下载文件名均使用接口返回结果，不使用固定诗词数据。

## 目录

- `app/components/PoetryCreator.vue`：上传、分析与匹配、编辑、生成与下载主流程。
- `app/composables/useImagePoetry.ts`：设备指纹与统一图片配诗请求。
- `app/types/poetry.ts`：图片理解和诗词匹配响应类型。
- `app/components/*Section.vue`：首页各内容区块。
- `app/assets/css/main.css`：全局设计令牌与基础样式。
- `public/images/examples`：真实示例图片及来源记录。
- `docs/design`：桌面端、状态页与移动端设计稿。
