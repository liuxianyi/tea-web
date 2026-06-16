# Agent.md

## 项目定位

这是一个茶叶与山野农产品宣传展示网站，品牌名为「山野本味」。网站核心目标不是在线交易，而是通过产品展示、产地故事、联系方式和表单收集客户咨询线索。

主要宣传点：

- 做茶四十余年，强调经验、产地、春茶鲜爽回甘。
- 种植椴木黑木耳四十余年，强调春耳、冬耳、泡发率和口感。
- 原产地直供，突出可信赖、短链路、适合自饮、家庭采购与礼赠。
- 电话、微信、留言、询盘是主要转化路径；当前没有真实支付流程。

## 技术栈

- 构建工具：Vite
- 前端框架：React 19
- 路由：react-router-dom 7
- 样式：原生 CSS，主要在 `src/index.css`
- 数据：静态 JS 数据，主要在 `src/siteData.js`
- 演示存储：浏览器 `localStorage`，封装在 `src/storage.js`
- 部署兼容：`public/_redirects` 用于 SPA 路由回退

## 常用命令

```bash
npm run dev       # 本地开发
npm run build     # 生产构建
npm run preview   # 预览构建结果
npm run lint      # ESLint 检查
```

修改完成后优先运行：

```bash
npm run lint
npm run build
```

## 目录与关键文件

```text
.
├── public/
│   ├── _redirects
│   └── images/                 # 产品图、包装图、二维码等静态资源
├── docs/
│   ├── 网站修改指南.md           # 给站点维护者看的修改说明
│   └── superpowers/specs/       # 早期需求/设计文档
├── src/
│   ├── App.jsx                  # 页面、路由和大部分组件
│   ├── main.jsx                 # React 入口
│   ├── siteData.js              # 品牌、轮播、分类、产品、故事、演示留言数据
│   ├── storage.js               # localStorage 读写逻辑
│   └── index.css                # 全站样式
├── package.json
├── vite.config.js
└── eslint.config.js
```

## 页面结构与路由

路由集中在 `src/App.jsx`：

- `/`：首页
  - 顶部导航
  - Hero 轮播
  - 分类导航
  - 3 到 5 款热门产品
  - 店铺/产地介绍
  - 包装展示
  - 联系方式与留言表单
- `/products`：产品中心
  - 按分类筛选
  - 绿茶支持按 `清明前 / 清明 / 谷雨` 筛选
  - 椴木黑木耳支持按 `春耳 / 冬耳` 筛选
- `/products/:slug`：产品详情页
  - 产品图库
  - 大图预览 lightbox
  - 规格、卖点、参考价格/咨询提示
  - 立即咨询入口
- `/about`：关于我们/产地故事
- `/contact`：联系方式、询盘表单、留言表单
- `/messages`：前端演示版留言与询盘管理页
- `*`：404 页面

## 核心组件说明

主要组件都在 `src/App.jsx`：

- `App`：顶层路由与布局。
- `SiteHeader`：顶部品牌和导航。
- `HeroCarousel`：首页轮播，使用 `heroSlides`。
- `CategoryNav`：分类入口，使用 `categories`。
- `ProductCard`：产品卡片。
- `ProductGallery`：详情页图库和预览。
- `ContactActions`：电话、微信复制、二维码展示。
- `InquiryForm`：询盘表单，保存到 localStorage。
- `MessageForm`：留言表单，保存到 localStorage。
- `MessageAdminPanel`：留言/询盘演示管理面板。
- `HomePage`、`ProductsPage`、`ProductDetailPage`、`AboutPage`、`ContactPage`、`MessageAdminPage`、`NotFoundPage`：各页面组件。

## 数据模型与维护方式

站点内容主要维护 `src/siteData.js`。

### `siteConfig`

包含品牌与联系方式：

- `brandName`：品牌名。
- `tagline`：品牌标语。
- `phone`：电话。
- `wechat`：微信号。
- `wechatQr`：二维码图片路径。
- `features.showPrices`：是否全站显示价格。

当前 `showPrices` 为 `false`，所以默认展示「欢迎咨询获取报价」。如果希望全站直接显示价格，改为：

```js
features: {
  showPrices: true,
}
```

也可以在单个产品里设置 `showPrice: true`，只显示该产品价格。

### `products`

产品字段：

```js
{
  id: '唯一 ID',
  slug: '产品详情页 URL 标识',
  name: '产品名',
  category: '分类名',
  subcategory: '子分类，可为空',
  summary: '卡片摘要',
  description: '详情页介绍',
  specifications: ['规格说明'],
  sellingPoints: ['产品卖点'],
  price: '参考价格',
  showPrice: false,
  featured: true,
  hero: true,
  images: ['/images/...'],
  packageImages: ['/images/...'],
}
```

注意：

- `slug` 不能重复，详情页按 `slug` 查找产品。
- `category` 要和 `categories` 中的 `name` 对应，否则筛选可能不符合预期。
- 绿茶子分类建议使用：`清明前`、`清明`、`谷雨`。
- 椴木黑木耳子分类建议使用：`春耳`、`冬耳`。
- 首页热门产品来自 `featured: true` 的产品，并截取前 5 个。
- 详情页图库来自 `images` 与 `packageImages` 合并。

### 其他内容

- `heroSlides`：首页轮播图。
- `categories`：产品分类导航与筛选。
- `storyHighlights`：经验/产地/直供亮点。
- `originStories`：关于页产地故事卡片。
- `packagingShowcase`：首页包装展示。
- `defaultInquiries`、`defaultMessages`：留言管理页的演示初始数据。

## 表单与留言管理

当前表单为纯前端演示，不会发送到真实服务器。

- 询盘：`InquiryForm` 调用 `saveInquiry`。
- 留言：`MessageForm` 调用 `saveMessage`。
- 留言状态更新：`MessageAdminPanel` 调用 `updateMessageStatus`。
- 存储逻辑在 `src/storage.js`。

localStorage key：

- `tea-web-messages`
- `tea-web-inquiries`

如果需要接入真实后端，优先替换 `src/storage.js` 或在表单提交处改为 API 请求，同时保留原有字段结构，避免管理页和展示逻辑大改。

## 图片资源规范

静态图片放在 `public/images/` 下，代码中使用绝对路径：

```js
'/images/products/green-tea/example.avif'
```

当前站点已经新增 `public/images/showcase/`，用于存放产品级展示 SVG 图。这类图适合放在：首页轮播、产品卡片首图、包装展示、关于页故事图等需要统一质感的位置。原始实拍图仍可作为详情页补充图库。

建议：

- 产品级展示图优先放在 `public/images/showcase/`。
- 产品实拍图放在 `public/images/products/对应分类/`。
- 包装实拍图放在 `public/images/packaging/`。
- 二维码可替换 `public/images/wechat-qr.svg` 或修改 `siteConfig.wechatQr`。
- 产品卡片首图建议使用产品级图，详情页后续图片可以保留实拍细节图。
- 优先使用压缩后的 `.avif` / `.webp`，SVG 展示图也可直接使用，兼顾清晰度和加载速度。

## 视觉与文案风格

网站整体风格应保持：

- 自然、质朴、可信赖。
- 强调山场、原产地、长期经验和家庭/礼赠场景。
- 不要过度电商化，不要引入复杂购物车或支付文案，除非用户明确要求。
- CTA 优先是「立即咨询」「快速联系」「复制微信号」「一键拨打」。
- 价格默认偏咨询制，避免在没有确认时强制显示价格。

文案修改建议：

- 茶叶突出：高山、春茶、鲜爽、回甘、清香、头采、礼盒。
- 黑木耳突出：椴木、春耳/冬耳、肉厚、脆嫩、泡发率、家常烹饪。
- 副产品突出：山野、原产地、家庭常备、伴手礼。

## 开发注意事项

1. 修改产品、轮播、分类和联系方式时，优先改 `src/siteData.js`。
2. 修改布局和交互时，主要看 `src/App.jsx`。
3. 修改颜色、间距、卡片、响应式样式时，主要看 `src/index.css`。
4. 不要随意改变产品对象字段名，页面依赖这些字段渲染。
5. `ProductCard` 默认读取 `product.images[0]`，新增产品必须至少提供一张图片。
6. `ProductGallery` 会合并 `images` 和 `packageImages`，确保数组存在。
7. `/contact?product=产品名` 会预填询盘表单的意向产品。
8. 当前 `/messages` 没有登录权限控制，只适合演示；上线前如果保留管理页，需要加鉴权或移除公开入口。
9. SPA 部署需要保留 `public/_redirects`，否则刷新详情页可能 404。
10. 修改后建议同时检查桌面端和移动端展示效果。

## 已知可改进点

- `App.jsx` 组件较集中，后续可以拆分为 `components/` 与 `pages/`。
- 表单目前只保存到 localStorage，生产环境需要接后端或表单服务。
- `/messages` 是演示管理页，上线前要考虑权限。
- SEO 目前较基础，可补充页面 title、meta description、结构化数据。
- 部分副产品使用占位 SVG 图片，可继续补充真实产品图。
- 分类子分类逻辑目前硬编码在 `ProductsPage`，分类变多时可下沉到数据配置。

## 给后续 Agent 的工作准则

- 先理解这是宣传获客网站，不是完整电商系统。
- 优先维护静态数据和展示体验，避免引入不必要复杂依赖。
- 如果用户说“改产品/价格/联系方式/图片”，通常先改 `src/siteData.js` 或 `public/images/`。
- 如果用户说“改页面样式/移动端/视觉”，通常先改 `src/index.css`。
- 如果用户说“留言要真实收到”，需要说明当前是 localStorage 演示，再设计后端/API/表单服务方案。
- 保持中文内容自然、朴实，不要夸大功效，不要写医疗或保健承诺。
