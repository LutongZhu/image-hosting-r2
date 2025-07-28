# 📷 Image Hosting with Next.js + Cloudflare R2

## 🧪 开发

```bash
cp .env.example .env.local
npm install
npm run dev
```

## 🌐 Cloudflare R2 设置

- 获取 Access Key / Secret
- 设置 bucket 为 public-read
- 配置自定义域名绑定 CDN 并启用 HTTPS

## 🛰️ 部署

建议部署在 Vercel，设置以下环境变量：

- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_ENDPOINT`
- `R2_PUBLIC_URL`