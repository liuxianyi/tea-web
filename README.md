# 山野本味产品展示站

一个基于 `React + Vite` 开发的响应式农产品展示网站，包含：

- 首页轮播与热门产品展示
- 产品分类页与产品详情页
- 关于我们与产地介绍
- 电话、微信、询盘表单与留言表单
- 前端演示版留言管理页

## 本地开发

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

构建生产版本：

```bash
npm run build
```

运行代码检查：

```bash
npm run lint
```

## Cloudflare Pages 部署

当前项目适合用 `Cloudflare Pages` 做静态托管，成本低、配置简单、支持自动 HTTPS。

### 1. 推送代码到 GitHub

先把本项目推送到 GitHub 仓库。

### 2. 在 Cloudflare 创建 Pages 项目

在 [Cloudflare Dashboard](https://dash.cloudflare.com/) 中：

1. 点击 `+`
2. 选择 `Pages`
3. 选择 `Connect to Git`
4. 授权 GitHub 并选择本仓库

### 3. 填写构建配置

- `Framework preset`: `Vite`
- `Build command`: `npm run build`
- `Build output directory`: `dist`

### 4. 部署单页应用路由

项目已包含 `public/_redirects`：

```txt
/* /index.html 200
```

这个文件会在 Cloudflare Pages 上为 React Router 提供单页应用回退，避免刷新 `/products`、`/about` 等页面时出现 404。

### 5. 绑定自定义域名

部署成功后，可在 Pages 项目的 `Custom domains` 中绑定自己的域名：

- 如果域名已接入 Cloudflare，通常可自动完成解析
- 如果域名在其他平台，按提示添加 `CNAME` 记录即可

### 6. 自动发布

后续只要向 GitHub 仓库推送新代码，Cloudflare Pages 会自动重新构建并发布。

## 线上注意事项

### 1. 当前留言和询盘是演示版

目前留言与询盘使用浏览器本地存储：

- 客户提交的数据只保存在他们自己的浏览器里
- 网站管理员无法统一接收到真实客户信息

如果要正式上线接单，建议下一步接入真实提交方式，例如：

- Cloudflare Workers
- 第三方表单服务
- 邮件通知服务

### 2. 替换占位素材

当前 `public/images` 下的图片为演示用 SVG 占位图，正式上线前建议替换为：

- 真实产品图
- 真实包装图
- 真实产地图片
- 真实微信二维码

### 3. 价格显示开关

如需线上直接显示价格，可修改 [siteData.js](file:///Users/bytedance/Desktop/worker/tea-web/src/siteData.js) 中的：

```js
features: {
  showPrices: true,
}
```

## 建议的下一步

- 替换真实图片与联系方式
- 接入真实询盘和留言提交
- 绑定正式域名并开启搜索引擎收录
