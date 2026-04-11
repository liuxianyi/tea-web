import { useEffect, useMemo, useState } from 'react'
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import {
  categories,
  heroSlides,
  originStories,
  packagingShowcase,
  products,
  siteConfig,
  storyHighlights,
} from './siteData.js'
import {
  getInquiries,
  getMessages,
  saveInquiry,
  saveMessage,
  updateMessageStatus,
} from './storage.js'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:slug" element={<ProductDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="messages" element={<MessageAdminPage />} />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname, search])

  return null
}

function Layout() {
  const navItems = [
    { to: '/', label: '首页' },
    { to: '/products', label: '产品中心' },
    { to: '/about', label: '关于我们' },
    { to: '/contact', label: '联系我们' },
    { to: '/messages', label: '留言管理' },
  ]

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-row">
          <NavLink className="brand" to="/">
            <span className="brand-mark">茶</span>
            <div>
              <strong>{siteConfig.brandName}</strong>
              <span>{siteConfig.tagline}</span>
            </div>
          </NavLink>

          <nav className="main-nav" aria-label="主导航">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'nav-link nav-link-active' : 'nav-link'
                }
                end={item.to === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <a className="header-contact" href={`tel:${siteConfig.phone}`}>
            电话咨询
          </a>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <h3>{siteConfig.brandName}</h3>
            <p>{siteConfig.tagline}</p>
          </div>
          <div>
            <h3>联系咨询</h3>
            <p>电话：{siteConfig.phone}</p>
            <p>微信：{siteConfig.wechat}</p>
          </div>
          <div>
            <h3>网站定位</h3>
            <p>产品展示、品牌背书、客户留言与询盘演示闭环。</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length)
    }, 4500)

    return () => window.clearInterval(timer)
  }, [])

  const activeSlide = heroSlides[activeIndex]

  return (
    <section className="hero-carousel section-block">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">产地直供 · 支持灵活咨询</span>
          <h1>{activeSlide.title}</h1>
          <p>{activeSlide.description}</p>
          <div className="hero-actions">
            <Link className="button-primary" to={`/products/${activeSlide.productSlug}`}>
              查看产品
            </Link>
            <Link className="button-secondary" to="/contact">
              立即咨询
            </Link>
          </div>
          <div className="hero-dots" aria-label="轮播切换">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={index === activeIndex ? 'hero-dot active' : 'hero-dot'}
                onClick={() => setActiveIndex(index)}
                aria-label={`切换到${slide.title}`}
              />
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <img src={activeSlide.image} alt={activeSlide.title} />
        </div>
      </div>
    </section>
  )
}

function CategoryNav() {
  return (
    <section className="section-block muted-section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">产品分类</span>
          <h2>按品类快速找到感兴趣的产品</h2>
          <p>支持从首页直达对应分类，绿茶和黑木耳还可继续按子类筛选。</p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <article className="category-card" key={category.id}>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <div className="tag-row">
                {category.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <Link className="text-link" to={`/products?category=${category.name}`}>
                进入分类
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, showPrice }) {
  const shouldShowPrice = showPrice || product.showPrice

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.images[0]} alt={product.name} className="product-image" />
      </div>
      <div className="product-body">
        <div className="product-meta">
          <span>{product.category}</span>
          {product.subcategory ? <span>{product.subcategory}</span> : null}
        </div>
        <h3>{product.name}</h3>
        <p>{product.summary}</p>
        <ul className="bullet-list compact-list">
          {product.specifications.slice(0, 2).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="price-box">
          <span>参考价格</span>
          <strong>{shouldShowPrice ? product.price : '欢迎咨询获取报价'}</strong>
        </div>
        <div className="product-actions">
          <Link className="button-secondary" to={`/products/${product.slug}`}>
            查看详情
          </Link>
          <Link className="button-link" to={`/contact?product=${product.name}`}>
            快速联系
          </Link>
        </div>
      </div>
    </article>
  )
}

function ContactActions() {
  const [copied, setCopied] = useState(false)

  async function handleCopyWechat() {
    try {
      await navigator.clipboard.writeText(siteConfig.wechat)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="contact-actions-card">
      <div className="section-heading left-align">
        <span className="eyebrow">联系方式</span>
        <h2>欢迎直接电话或微信咨询</h2>
        <p>
          当前网站以展示产品和收集线索为主，不做在线支付，便于灵活沟通规格、
          包装和报价。
        </p>
      </div>
      <div className="contact-action-list">
        <a className="button-primary" href={`tel:${siteConfig.phone}`}>
          一键拨打 {siteConfig.phone}
        </a>
        <button type="button" className="button-secondary" onClick={handleCopyWechat}>
          {copied ? '微信号已复制' : `复制微信号：${siteConfig.wechat}`}
        </button>
      </div>
      <div className="wechat-panel">
        <img src={siteConfig.wechatQr} alt="微信二维码示意图" />
        <p>支持展示二维码和微信号，当前为前端演示版，可直接替换成真实信息。</p>
      </div>
    </div>
  )
}

function InquiryForm() {
  const [searchParams] = useSearchParams()
  const selectedProduct = searchParams.get('product') || ''
  const [form, setForm] = useState({
    name: '',
    contact: '',
    product: selectedProduct,
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    saveInquiry({
      id: `inq-${Date.now()}`,
      ...form,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    })

    setSubmitted(true)
    setForm({
      name: '',
      contact: '',
      product: selectedProduct,
      message: '',
    })
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="section-heading left-align">
        <span className="eyebrow">询盘表单</span>
        <h2>留下需求，我们会主动联系你</h2>
      </div>
      <label>
        姓名
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        联系方式
        <input
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="电话或微信"
          required
        />
      </label>
      <label>
        意向产品
        <input name="product" value={form.product} onChange={handleChange} />
      </label>
      <label>
        需求说明
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows="4"
          placeholder="例如规格、数量、包装方式、是否送礼等"
          required
        />
      </label>
      <button type="submit" className="button-primary full-width">
        提交询盘
      </button>
      {submitted ? (
        <p className="form-success">提交成功，演示数据已保存在浏览器本地。</p>
      ) : null}
    </form>
  )
}

function MessageForm() {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    saveMessage({
      id: `msg-${Date.now()}`,
      ...form,
      status: '未回复',
      reply: '',
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    })

    setSubmitted(true)
    setForm({
      name: '',
      contact: '',
      message: '',
    })
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="section-heading left-align">
        <span className="eyebrow">留言表单</span>
        <h2>有问题可先留言，我们稍后统一回复</h2>
      </div>
      <label>
        姓名
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        联系方式
        <input
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="电话或微信"
          required
        />
      </label>
      <label>
        留言内容
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows="5"
          placeholder="请填写想咨询的产品、数量或其他问题"
          required
        />
      </label>
      <button type="submit" className="button-secondary full-width">
        提交留言
      </button>
      {submitted ? (
        <p className="form-success">留言成功，当前为前端演示版，内容已保存。</p>
      ) : null}
    </form>
  )
}

function ProductGallery({ product }) {
  const gallery = [...product.images, ...product.packageImages]
  const [activeImage, setActiveImage] = useState(gallery[0])
  const [previewOpen, setPreviewOpen] = useState(false)

  return (
    <div>
      <div className="gallery-stage">
        <button
          type="button"
          className="gallery-preview-button"
          onClick={() => setPreviewOpen(true)}
        >
          <img src={activeImage} alt={product.name} className="gallery-main-image" />
        </button>
      </div>

      <div className="gallery-thumbs">
        {gallery.map((image, index) => (
          <button
            type="button"
            key={`${image}-${index}`}
            className={activeImage === image ? 'thumb-button active' : 'thumb-button'}
            onClick={() => setActiveImage(image)}
          >
            <img src={image} alt={`${product.name} 图 ${index + 1}`} />
          </button>
        ))}
      </div>

      {previewOpen ? (
        <div className="lightbox" role="dialog" aria-modal="true">
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setPreviewOpen(false)}
          >
            关闭
          </button>
          <img src={activeImage} alt={product.name} className="lightbox-image" />
        </div>
      ) : null}
    </div>
  )
}

function MessageAdminPanel() {
  const [, setRefreshKey] = useState(0)
  const messages = getMessages()
  const inquiries = getInquiries()

  function handleReply(id) {
    updateMessageStatus(id, {
      status: '已回复',
      reply: '您好，已收到留言，稍后将由专人与您联系。',
    })

    setRefreshKey((value) => value + 1)
  }

  return (
    <div className="admin-grid">
      <section className="admin-card">
        <div className="section-heading left-align">
          <span className="eyebrow">留言管理</span>
          <h2>客户留言</h2>
        </div>
        <div className="record-list">
          {messages.map((message) => (
            <article className="record-item" key={message.id}>
              <div className="record-top">
                <strong>{message.name}</strong>
                <span className={message.status === '已回复' ? 'status done' : 'status'}>
                  {message.status}
                </span>
              </div>
              <p>{message.message}</p>
              <small>
                {message.contact} · {message.createdAt}
              </small>
              {message.reply ? <p className="reply-box">回复：{message.reply}</p> : null}
              {message.status !== '已回复' ? (
                <button
                  type="button"
                  className="button-link"
                  onClick={() => handleReply(message.id)}
                >
                  标记已回复
                </button>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="admin-card">
        <div className="section-heading left-align">
          <span className="eyebrow">询盘记录</span>
          <h2>客户意向</h2>
        </div>
        <div className="record-list">
          {inquiries.map((inquiry) => (
            <article className="record-item" key={inquiry.id}>
              <div className="record-top">
                <strong>{inquiry.name}</strong>
                <span className="status highlight">
                  {inquiry.product || '未指定产品'}
                </span>
              </div>
              <p>{inquiry.message}</p>
              <small>
                {inquiry.contact} · {inquiry.createdAt}
              </small>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function HomePage() {
  const featuredProducts = products.filter((product) => product.featured).slice(0, 5)

  return (
    <>
      <HeroCarousel />
      <CategoryNav />

      <section className="section-block">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">热门产品</span>
            <h2>3 到 5 款主打产品先建立兴趣</h2>
            <p>首页优先展示主推茶叶和黑木耳，并保留联系入口缩短咨询路径。</p>
          </div>
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showPrice={siteConfig.features.showPrices}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-block warm-section">
        <div className="container two-column-grid">
          <div>
            <div className="section-heading left-align">
              <span className="eyebrow">店铺介绍</span>
              <h2>经营多年，讲得清产地，也拿得出产品</h2>
              <p>用简洁但真实的内容传递经验、山场环境和原产地直供优势。</p>
            </div>
            <div className="story-grid">
              {storyHighlights.map((item) => (
                <article className="story-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
            <Link className="text-link" to="/about">
              查看更多产地故事
            </Link>
          </div>

          <div>
            <div className="section-heading left-align">
              <span className="eyebrow">包装展示</span>
              <h2>兼顾日常采购与礼赠场景</h2>
            </div>
            <div className="packaging-grid">
              {packagingShowcase.map((pack) => (
                <article className="pack-card" key={pack.title}>
                  <img src={pack.image} alt={pack.title} />
                  <h3>{pack.title}</h3>
                  <p>{pack.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="container split-contact">
          <ContactActions />
          <MessageForm />
        </div>
      </section>
    </>
  )
}

function ProductsPage() {
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || '全部'
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [activeSubcategory, setActiveSubcategory] = useState('全部')

  const availableSubcategories = useMemo(() => {
    if (activeCategory === '绿茶') return ['全部', '清明前', '清明', '谷雨']
    if (activeCategory === '椴木黑木耳') return ['全部', '春耳', '冬耳']
    return ['全部']
  }, [activeCategory])

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const categoryMatch = activeCategory === '全部' || product.category === activeCategory
        const subcategoryMatch =
          activeSubcategory === '全部' || product.subcategory === activeSubcategory

        return categoryMatch && subcategoryMatch
      }),
    [activeCategory, activeSubcategory],
  )

  function handleCategoryChange(categoryName) {
    setActiveCategory(categoryName)
    setActiveSubcategory('全部')
  }

  return (
    <section className="section-block page-hero-block">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">产品中心</span>
          <h1 className="page-title">按分类查看全部产品</h1>
          <p>绿茶支持按采摘时间筛选，黑木耳支持按季节筛选，其余品类按单品展示。</p>
        </div>

        <div className="filter-panel">
          <div className="tag-row wrap-row">
            <button
              type="button"
              className={activeCategory === '全部' ? 'filter-chip active' : 'filter-chip'}
              onClick={() => handleCategoryChange('全部')}
            >
              全部
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                className={activeCategory === category.name ? 'filter-chip active' : 'filter-chip'}
                onClick={() => handleCategoryChange(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {availableSubcategories.length > 1 ? (
            <div className="tag-row wrap-row sub-filter-row">
              {availableSubcategories.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={activeSubcategory === item ? 'filter-chip active' : 'filter-chip'}
                  onClick={() => setActiveSubcategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showPrice={siteConfig.features.showPrices}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductDetailPage() {
  const { slug } = useParams()
  const product = products.find((item) => item.slug === slug)

  if (!product) {
    return (
      <section className="section-block page-hero-block">
        <div className="container empty-state">
          <h1 className="page-title">未找到对应产品</h1>
          <Link className="button-primary" to="/products">
            返回产品中心
          </Link>
        </div>
      </section>
    )
  }

  const shouldShowPrice = siteConfig.features.showPrices || product.showPrice

  return (
    <section className="section-block page-hero-block">
      <div className="container product-detail-grid">
        <ProductGallery product={product} />
        <div className="detail-panel">
          <span className="eyebrow">{product.category}</span>
          <h1 className="page-title detail-title">{product.name}</h1>
          <p className="detail-summary">{product.description}</p>
          <div className="price-box large-price">
            <span>参考价格</span>
            <strong>{shouldShowPrice ? product.price : '欢迎咨询获取报价'}</strong>
          </div>

          <section>
            <h3>规格说明</h3>
            <ul className="bullet-list">
              {product.specifications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3>产品卖点</h3>
            <ul className="bullet-list">
              {product.sellingPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <div className="detail-actions">
            <Link className="button-primary" to={`/contact?product=${product.name}`}>
              立即咨询
            </Link>
            <Link className="button-secondary" to="/products">
              返回产品列表
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutPage() {
  return (
    <section className="section-block page-hero-block">
      <div className="container">
        <div className="section-heading narrow-heading">
          <span className="eyebrow">关于我们</span>
          <h1 className="page-title">用产地故事和长期经验建立第一层信任</h1>
          <p>
            网站重点突出做茶和种植木耳四十余年的积累，让客户不仅看到产品，也能了解背后的
            山场环境与生产过程。
          </p>
        </div>

        <div className="story-grid large-story-grid">
          {storyHighlights.map((item) => (
            <article className="story-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>

        <div className="origin-grid">
          {originStories.map((story) => (
            <article className="origin-card" key={story.title}>
              <img src={story.image} alt={story.title} />
              <div>
                <h2>{story.title}</h2>
                <p>{story.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactPage() {
  return (
    <section className="section-block page-hero-block">
      <div className="container">
        <div className="section-heading narrow-heading">
          <span className="eyebrow">联系我们</span>
          <h1 className="page-title">电话、微信和表单，三种方式都能快速触达</h1>
          <p>展示站以主动咨询为核心转化目标，支持客户先问规格、包装、价格与发货方式。</p>
        </div>

        <div className="contact-page-grid">
          <ContactActions />
          <InquiryForm />
          <MessageForm />
        </div>
      </div>
    </section>
  )
}

function MessageAdminPage() {
  return (
    <section className="section-block page-hero-block">
      <div className="container">
        <div className="section-heading narrow-heading">
          <span className="eyebrow">留言管理</span>
          <h1 className="page-title">前端演示版留言查看与回复状态管理</h1>
          <p>当前页面不依赖真实后端，使用浏览器本地存储模拟留言与询盘处理闭环。</p>
        </div>

        <MessageAdminPanel />
      </div>
    </section>
  )
}

function NotFoundPage() {
  return (
    <section className="section-block page-hero-block">
      <div className="container empty-state">
        <span className="eyebrow">404</span>
        <h1 className="page-title">页面不存在</h1>
        <p>你访问的内容可能已移动，建议返回首页继续浏览产品。</p>
        <Link className="button-primary" to="/">
          返回首页
        </Link>
      </div>
    </section>
  )
}

export default App
