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
  packagingProducts,
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

const catalogItems = [...products, ...packagingProducts]

function isPackagingItem(item) {
  return item?.kind === 'packaging' || item?.category === '包装'
}

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
  const [menuOpen, setMenuOpen] = useState(false)
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
          <NavLink className="brand" to="/" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark">茶</span>
            <div>
              <strong>{siteConfig.brandName}</strong>
              <span>{siteConfig.tagline}</span>
            </div>
          </NavLink>

          <nav
            id="main-navigation"
            className={menuOpen ? 'main-nav main-nav-open' : 'main-nav'}
            aria-label="主导航"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'nav-link nav-link-active' : 'nav-link'
                }
                end={item.to === '/'}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <a className="header-contact" href={`tel:${siteConfig.phone}`}>
              <span className="desktop-only">电话咨询</span>
              <span className="mobile-only">咨询</span>
            </a>
            <button
              type="button"
              className={menuOpen ? 'menu-toggle menu-toggle-open' : 'menu-toggle'}
              onClick={() => setMenuOpen((current) => !current)}
              aria-expanded={menuOpen}
              aria-controls="main-navigation"
              aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
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
            <h3>到店地址</h3>
            <p>{siteConfig.address}</p>
            <a href={siteConfig.mapLink} target="_blank" rel="noreferrer">
              点击导航
            </a>
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
          <span className="eyebrow">伏山乡产地 · 可选包装</span>
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
          <h2>绿茶、黑木耳、副产和包装都可单独查看</h2>
          <p>绿茶按采摘时间看，黑木耳按季节看，包装可单独查看袋装、铁盒和礼盒。</p>
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
  const packaging = isPackagingItem(product)
  const shouldShowPrice = showPrice || product.showPrice
  const priceLabel = packaging ? '包装说明' : '参考价格'
  const priceText = shouldShowPrice
    ? product.price
    : packaging
      ? '可按需求搭配'
      : '欢迎咨询获取报价'

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.images[0]} alt={product.name} className="product-image" />
      </div>
      <div className="product-body">
        <div className="product-meta">
          <span>{product.category}</span>
          {product.subcategory ? <span>{product.subcategory}</span> : null}
          {product.capacity ? <span>{product.capacity}</span> : null}
        </div>
        <h3>{product.name}</h3>
        <p>{product.summary}</p>
        <ul className="bullet-list compact-list">
          {product.specifications.slice(0, 2).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="price-box">
          <span>{priceLabel}</span>
          <strong>{priceText}</strong>
        </div>
        <div className="product-actions">
          <Link className="button-secondary" to={`/products/${product.slug}`}>
            {packaging ? '查看包装' : '查看详情'}
          </Link>
          <Link className="button-link" to={`/contact?product=${product.name}`}>
            {packaging ? '咨询搭配' : '快速联系'}
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
        <h2>电话、微信、地址都可以直接查看</h2>
        <p>{siteConfig.address}</p>
      </div>
      <div className="contact-action-list">
        <a className="button-primary" href={`tel:${siteConfig.phone}`}>
          一键拨打 {siteConfig.phone}
        </a>
        <button type="button" className="button-secondary" onClick={handleCopyWechat}>
          {copied ? '微信号已复制' : `复制微信号：${siteConfig.wechat}`}
        </button>
        <a
          className="button-secondary"
          href={siteConfig.mapLink}
          target="_blank"
          rel="noreferrer"
        >
          点击导航
        </a>
      </div>
      <div className="wechat-panel">
        <img src={siteConfig.wechatQr} alt="微信二维码示意图" />
        <p>地址：{siteConfig.address}</p>
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
        <h2>留下想买的产品和包装需求</h2>
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
          placeholder="例如想要哪款茶、几斤、配什么包装、是否送礼"
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
        <h2>有问题可以留言</h2>
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
          placeholder="请填写想咨询的产品、包装或其他问题"
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
  const gallery = [...new Set([...(product.images || []), ...(product.packageImages || [])])]
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
            <span className="eyebrow">当季主推</span>
            <h2>先看热门茶叶和黑木耳</h2>
            <p>绿茶、黑木耳和副产都支持直接咨询，可按实际需求配包装。</p>
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
              <span className="eyebrow">地址与现货</span>
              <h2>到店地址、现货和包装方式都能直接看到</h2>
              <p>{siteConfig.address}</p>
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
              <h2>袋装、铁盒、礼盒都可查看</h2>
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
    if (activeCategory === '包装') return ['全部', '袋装', '铁盒', '礼盒']
    return ['全部']
  }, [activeCategory])

  const filteredProducts = useMemo(
    () =>
      catalogItems.filter((product) => {
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
          <p>绿茶按采摘时间看，黑木耳按季节看，包装可按袋装、铁盒、礼盒查看。</p>
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
  const product = catalogItems.find((item) => item.slug === slug)

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

  const packaging = isPackagingItem(product)
  const shouldShowPrice = siteConfig.features.showPrices || product.showPrice
  const relatedPackaging = packaging
    ? []
    : packagingProducts.filter((item) => product.availablePackaging?.includes(item.slug))
  const applicableProducts = packaging
    ? products.filter((item) => product.applicableProducts?.includes(item.slug))
    : []

  return (
    <section className="section-block page-hero-block">
      <div className="container product-detail-grid">
        <ProductGallery product={product} />
        <div className="detail-panel">
          <span className="eyebrow">{product.category}</span>
          <h1 className="page-title detail-title">{product.name}</h1>
          <p className="detail-summary">{product.description}</p>
          <div className="price-box large-price">
            <span>{packaging ? '包装说明' : '参考价格'}</span>
            <strong>
              {shouldShowPrice
                ? product.price
                : packaging
                  ? '可按需求搭配'
                  : '欢迎咨询获取报价'}
            </strong>
          </div>

          <section>
            <h3>{packaging ? '包装说明' : '规格说明'}</h3>
            <ul className="bullet-list">
              {product.specifications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3>{packaging ? '适合用途' : '产品卖点'}</h3>
            <ul className="bullet-list">
              {product.sellingPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {packaging && product.capacity ? (
            <section className="detail-section">
              <h3>容量</h3>
              <p className="detail-text">{product.capacity}</p>
            </section>
          ) : null}

          {!packaging && relatedPackaging.length ? (
            <section className="detail-section">
              <h3>可选包装</h3>
              <div className="related-grid">
                {relatedPackaging.map((item) => (
                  <RelatedCard key={item.slug} item={item} />
                ))}
              </div>
            </section>
          ) : null}

          {packaging && applicableProducts.length ? (
            <section className="detail-section">
              <h3>适配产品</h3>
              <div className="related-grid">
                {applicableProducts.map((item) => (
                  <RelatedCard key={item.slug} item={item} />
                ))}
              </div>
            </section>
          ) : null}

          <div className="detail-actions">
            <Link className="button-primary" to={`/contact?product=${product.name}`}>
              {packaging ? '咨询包装' : '立即咨询'}
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

function RelatedCard({ item }) {
  return (
    <article className="related-card">
      <img src={item.images[0]} alt={item.name} className="related-card-image" />
      <div className="related-card-body">
        <div className="product-meta">
          <span>{item.category}</span>
          {item.subcategory ? <span>{item.subcategory}</span> : null}
          {item.capacity ? <span>{item.capacity}</span> : null}
        </div>
        <h4>{item.name}</h4>
        <p>{item.summary}</p>
        <Link className="text-link" to={`/products/${item.slug}`}>
          查看详情
        </Link>
      </div>
    </article>
  )
}

function AboutPage() {
  return (
    <section className="section-block page-hero-block">
      <div className="container">
        <div className="section-heading narrow-heading">
          <span className="eyebrow">关于我们</span>
          <h1 className="page-title">地址、产地和现货都能直接查看</h1>
          <p>{siteConfig.address}</p>
        </div>

        <div className="address-panel">
          <h2>到店地址</h2>
          <p>{siteConfig.address}</p>
          <div className="contact-action-list">
            <a className="button-primary" href={`tel:${siteConfig.phone}`}>
              电话联系
            </a>
            <a
              className="button-secondary"
              href={siteConfig.mapLink}
              target="_blank"
              rel="noreferrer"
            >
              点击导航
            </a>
          </div>
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
          <h1 className="page-title">电话、微信、地址都在这里</h1>
          <p>{siteConfig.address}</p>
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
          <h1 className="page-title">留言查看与回复状态管理</h1>
          <p>当前页面仍为前端演示版。</p>
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
