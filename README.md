# Frank 分享经管知识合集

一个适合手机和桌面浏览的公众号文章导航站，收录 36 篇关于经营分析、管理认知与 AI 转型的精选文章。

## 功能

- 三个知识专题与 36 篇文章
- 分类筛选与标题搜索
- 跳转微信公众号原文
- 展示每篇公众号文章的原始封面
- 原生分享与复制链接
- 响应式页面与 GitHub Pages 托管

## 本地开发

需要 Node.js 22 或更高版本。

```bash
pnpm install
pnpm run dev
```

## 构建 GitHub Pages

```bash
pnpm run build:pages
```

生成的纯静态站点位于 `docs/`，不需要服务器或登录系统。

需要刷新文章封面时，可运行 `pnpm run covers:sync` 后重新构建。
