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
  tipsSections,
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

function getImageFallbackSrc(src) {
  if (typeof src !== 'string') return null
  if (src.endsWith('.avif') || src.endsWith('.webp')) {
    return src.replace(/\.(avif|webp)$/u, '.jpg')
  }
  return null
}

function SmartImage({ src, alt, onError, ...props }) {
  const [currentSrc, setCurrentSrc] = useState(src)

  useEffect(() => {
    setCurrentSrc(src)
  }, [src])

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      onError={(event) => {
        const fallbackSrc = getImageFallbackSrc(currentSrc)

        if (fallbackSrc && fallbackSrc !== currentSrc) {
          setCurrentSrc(fallbackSrc)
          return
        }

        onError?.(event)
      }}
    />
  )
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
          <Route path="tips" element={<TipsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route
            path="messages"
            element={
              siteConfig.features.showMessagesPage ? (
                <MessageAdminPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
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
    { to: '/tips', label: '使用 Tips' },
    { to: '/about', label: '关于我们' },
    { to: '/contact', label: '联系我们' },
  ]
  const visibleNavItems = siteConfig.features.showMessagesPage
    ? [...navItems, { to: '/messages', label: '留言管理' }]
    : navItems

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-row">
          <NavLink className="brand" to="/" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark">山</span>
            <div className="brand-copy">
              <strong>{siteConfig.brandName}</strong>
              <span>伏山乡产地直连</span>
            </div>
          </NavLink>

          <nav
            id="main-navigation"
            className={menuOpen ? 'main-nav main-nav-open' : 'main-nav'}
            aria-label="主导航"
          >
            {visibleNavItems.map((item) => (
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
        <div className="container footer-shell">
          <div className="footer-lead">
            <p className="footer-kicker">山里现货，按需搭配</p>
            <h3>{siteConfig.brandName}</h3>
            <p>{siteConfig.tagline}，家用自饮、送礼和包装咨询都可以直接联系。</p>
          </div>
          <div className="footer-grid">
            <div>
              <h3>联系咨询</h3>
              <div className="footer-contact-row">
                <div className="footer-contact-text">
                  <p>电话：{siteConfig.phone}</p>
                  <p>微信：{siteConfig.wechat}</p>
                </div>
                <SmartImage className="footer-qr" src={siteConfig.wechatQr} alt="微信二维码" />
              </div>
            </div>
            <div>
              <h3>到店地址</h3>
              <p>{siteConfig.address}</p>
              <a href={siteConfig.mapLink} target="_blank" rel="noreferrer">
                点击导航
              </a>
            </div>
            <div>
              <h3>联系咨询</h3>
              <div className="footer-actions">
                <a className="button-primary" href={`tel:${siteConfig.phone}`}>
                  电话咨询
                </a>
                <Link className="button-secondary" to="/contact">
                  留言咨询
                </Link>
              </div>
            </div>
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
  const featuredCopy = [
    '产地现货直接看图咨询',
    '绿茶、黑木耳与副产可灵活组合',
    '袋装、铁盒、礼盒都能按需求搭配',
  ]

  return (
    <section className="hero-carousel section-block">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">伏山乡山货直连</span>
          <h1>{activeSlide.title}</h1>
          <p>{activeSlide.description}</p>
          <ul className="hero-feature-list">
            {featuredCopy.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
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
          <SmartImage src={activeSlide.image} alt={activeSlide.title} />
          <div className="hero-visual-card">
            <span>现货咨询</span>
            <strong>支持按斤、按盒、按礼赠场景搭配</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

function HomeTrustStrip() {
  const trustItems = [
    ['产地', '河南信阳商城县伏山乡'],
    ['现货', '绿茶、黑木耳、副产可直接问'],
    ['包装', '袋装、铁盒、礼盒都可配'],
    ['联系', '电话与微信都能直接找到人'],
  ]

  return (
    <section className="trust-strip">
      <div className="container trust-grid">
        {trustItems.map(([label, value]) => (
          <article className="trust-item" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}

function CategoryNav() {
  return (
    <section className="section-block section-soft">
      <div className="container">
        <div className="section-heading">
          <h2>先按想看的品类进</h2>
          <p>茶叶按采摘时间分，黑木耳按春耳冬耳分，包装和副产也都能单独查看。</p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <article className="category-card card-clickable" key={category.id}>
              <Link
                className="card-overlay"
                to={`/products?category=${category.name}`}
                aria-label={`查看${category.name}分类`}
              />
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

function FeaturedShowcase({ products: featuredProducts }) {
  const [leadProduct, ...otherProducts] = featuredProducts

  if (!leadProduct) return null

  return (
    <section className="section-block featured-showcase">
      <div className="container featured-grid">
        <article className="featured-lead-card card-clickable">
          <Link
            className="card-overlay"
            to={`/products/${leadProduct.slug}`}
            aria-label={`查看${leadProduct.name}详情`}
          />
          <div className="featured-lead-image">
            <SmartImage src={leadProduct.images[0]} alt={leadProduct.name} />
          </div>
          <div className="featured-lead-body">
            <p className="section-kicker">当季主推</p>
            <h2>{leadProduct.name}</h2>
            <p>{leadProduct.description}</p>
            <div className="tag-row">
              {leadProduct.sellingPoints.map((item) => (
                <span key={item} className="tag">
                  {item}
                </span>
              ))}
            </div>
            <div className="featured-detail-list">
              {leadProduct.specifications.map((item) => (
                <div key={item}>
                  <span />
                  <p>{item}</p>
                </div>
              ))}
            </div>
            <div className="hero-actions">
              <Link className="button-primary" to={`/products/${leadProduct.slug}`}>
                看这款
              </Link>
              <Link className="button-link" to="/products">
                查看全部产品
              </Link>
            </div>
          </div>
        </article>

        <div className="featured-side-grid">
          {otherProducts.map((product) => (
            <article className="featured-mini-card card-clickable" key={product.id}>
              <Link
                className="card-overlay"
                to={`/products/${product.slug}`}
                aria-label={`查看${product.name}详情`}
              />
              <SmartImage src={product.images[0]} alt={product.name} />
              <div>
                <span>{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.summary}</p>
                <Link className="text-link" to={`/products/${product.slug}`}>
                  查看详情
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function OriginShowcase() {
  const [leadStory] = originStories

  return (
    <section className="section-block origin-showcase">
      <div className="container origin-showcase-grid">
        <div className="origin-copy-panel">
          <h2>从山场到家里，买的是看得见的本味</h2>
          <p>
            现在的网站先把产地、现货、包装和联系方式说清楚，后续也可以继续补采茶、制茶和发货过程图。
          </p>
          <div className="origin-points">
            {storyHighlights.map((item) => (
              <article className="origin-point" key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <div className="hero-actions">
            <Link className="button-primary" to="/about">
              看产地介绍
            </Link>
            <Link className="button-secondary" to="/contact">
              联系咨询
            </Link>
          </div>
        </div>

        <article className="origin-visual-panel">
          <SmartImage src={leadStory.image} alt={leadStory.title} />
          <div className="origin-visual-copy">
            <p className="section-kicker">山场与采收</p>
            <h3>{leadStory.title}</h3>
            <p>{leadStory.description}</p>
          </div>
        </article>
      </div>
    </section>
  )
}

function PackagingSpotlight() {
  return (
    <section className="section-block muted-section">
      <div className="container">
        <div className="section-heading left-align narrow-heading">
          <span className="eyebrow">包装与送礼</span>
          <h2>不只是卖货，也把家用和送礼场景一起考虑好</h2>
          <p>袋装适合日常走货，铁盒更体面，礼盒适合节日和走亲访友，具体都可以按实际数量来配。</p>
        </div>

        <div className="packaging-spotlight-grid">
          <div className="packaging-hero-card card-clickable">
            <Link
              className="card-overlay"
              to="/products?category=包装"
              aria-label="查看全部包装"
            />
            <SmartImage src={packagingShowcase[2].image} alt={packagingShowcase[2].title} />
            <div>
              <h3>{packagingShowcase[2].title}</h3>
              <p>{packagingShowcase[2].description}</p>
              <Link className="text-link" to="/products?category=包装">
                查看全部包装
              </Link>
            </div>
          </div>

          <div className="packaging-side-column">
            {packagingShowcase.slice(0, 2).map((pack) => (
              <article className="pack-card compact-pack-card card-clickable" key={pack.title}>
                <Link
                  className="card-overlay"
                  to="/products?category=包装"
                  aria-label={`查看${pack.title}`}
                />
                <SmartImage src={pack.image} alt={pack.title} />
                <h3>{pack.title}</h3>
                <p>{pack.description}</p>
              </article>
            ))}

            <article className="contact-promo-card">
              <p className="section-kicker">直接联系</p>
              <h3>想问哪款、几斤、配什么包装，直接说就行</h3>
              <p>网站先把信息铺开，成交还是尽量走电话或微信，沟通会更快。</p>
              <div className="hero-actions">
                <a className="button-primary" href={`tel:${siteConfig.phone}`}>
                  电话咨询
                </a>
                <Link className="button-secondary" to="/contact">
                  留言咨询
                </Link>
              </div>
            </article>
          </div>
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
    <article className="product-card card-clickable">
      <Link
        className="card-overlay"
        to={`/products/${product.slug}`}
        aria-label={`查看${product.name}详情`}
      />
      <div className="product-image-wrap">
        <SmartImage src={product.images[0]} alt={product.name} className="product-image" />
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
        <SmartImage src={siteConfig.wechatQr} alt="微信二维码示意图" />
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
        <span className="eyebrow">咨询表单</span>
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
        提交咨询
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
          <SmartImage src={activeImage} alt={product.name} className="gallery-main-image" />
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
            <SmartImage src={image} alt={`${product.name} 图 ${index + 1}`} />
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
          <SmartImage src={activeImage} alt={product.name} className="lightbox-image" />
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
          <span className="eyebrow">咨询记录</span>
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
      <HomeTrustStrip />
      <CategoryNav />
      <FeaturedShowcase products={featuredProducts} />
      <OriginShowcase />
      <PackagingSpotlight />
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
      <div className="container">
        <PageHero
          eyebrow={product.category}
          title={product.name}
          description={product.description}
          compact
          actions={
            <>
              <Link className="button-primary" to={`/contact?product=${product.name}`}>
                {packaging ? '咨询包装' : '立即咨询'}
              </Link>
              <Link className="button-secondary" to="/products">
                返回产品列表
              </Link>
            </>
          }
        />

        <div className="product-detail-grid">
          <ProductGallery product={product} />
          <div className="detail-panel">
            <div className="detail-topbar">
              <div className="product-meta">
                <span>{product.category}</span>
                {product.subcategory ? <span>{product.subcategory}</span> : null}
                {product.capacity ? <span>{product.capacity}</span> : null}
              </div>
              <p className="detail-summary">
                {packaging ? '适合按容量和礼赠场景搭配。' : '可先看图，再按规格和包装需求咨询。'}
              </p>
            </div>
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
              <a className="button-secondary" href={`tel:${siteConfig.phone}`}>
                电话咨询
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ item }) {
  return (
    <article className="related-card card-clickable">
      <Link
        className="card-overlay"
        to={`/products/${item.slug}`}
        aria-label={`查看${item.name}详情`}
      />
      <SmartImage src={item.images[0]} alt={item.name} className="related-card-image" />
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

function PageHero({ eyebrow, title, description, actions, compact = false }) {
  return (
    <div className={compact ? 'page-hero intro-compact' : 'page-hero'}>
      <div className="page-hero-copy">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1 className="page-title">{title}</h1>
        <p>{description}</p>
      </div>
      {actions ? <div className="page-hero-actions">{actions}</div> : null}
    </div>
  )
}

function AboutPage() {
  return (
    <section className="section-block page-hero-block">
      <div className="container">
        <PageHero
          eyebrow="关于我们"
          title="知道山从哪来，也知道人怎么联系"
          description="这里把产地位置、现货方向和目前能提供的山货内容集中放在一起，方便先了解再咨询。"
          actions={
            <>
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
            </>
          }
        />

        <div className="about-overview-grid">
          <div className="address-panel">
            <p className="section-kicker">到店地址</p>
            <h2>{siteConfig.address}</h2>
            <p>如果要看现货、确认包装或线下自提，可以先电话或微信联系，沟通起来会更快。</p>
          </div>

          <div className="story-grid large-story-grid">
            {storyHighlights.map((item) => (
              <article className="story-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="origin-grid">
          {originStories.map((story) => (
            <article className="origin-card" key={story.title}>
              <SmartImage src={story.image} alt={story.title} />
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
  const showMessages = siteConfig.features.showMessagesPage

  return (
    <section className="section-block page-hero-block">
      <div className="container">
        <PageHero
          eyebrow="联系我们"
          title="问产品、问包装、问现货，都能直接找到人"
          description="如果已经有明确需求，建议直接打电话或加微信；如果还在比较，也可以先把意向产品和数量留言。"
        />

        <div className="contact-intro-grid">
          <article className="contact-intro-card">
            <span>电话</span>
            <strong>{siteConfig.phone}</strong>
            <p>适合直接问现货、规格、送礼搭配和发货方式。</p>
          </article>
          <article className="contact-intro-card">
            <span>微信</span>
            <strong>{siteConfig.wechat}</strong>
            <p>方便发图片、确认包装细节，也方便后续继续沟通。</p>
          </article>
          <article className="contact-intro-card">
            <span>地址</span>
            <strong>伏山乡杨桥村</strong>
            <p>到店前建议先联系，确认人在不在、现货齐不齐。</p>
          </article>
        </div>

        <div className={showMessages ? 'contact-page-grid' : 'contact-page-grid compact-contact-grid'}>
          <ContactActions />
          <InquiryForm />
          {showMessages ? <MessageForm /> : null}
        </div>
      </div>
    </section>
  )
}

function TipsPage() {
  return (
    <section className="section-block page-hero-block">
      <div className="container">
        <div className="section-heading narrow-heading">
          <span className="eyebrow">使用 Tips</span>
          <h1 className="page-title">茶叶冲泡、葛根粉和橡子粉使用说明</h1>
          <p>这里整理了日常使用中最常见的冲泡、冲制和搭配方法，方便直接查看。</p>
        </div>

        <div className="tips-grid">
          {tipsSections.map((section) => (
            <article className="tips-card" key={section.id}>
              <div className="section-heading left-align">
                <span className="eyebrow">使用说明</span>
                <h2>{section.title}</h2>
                <p>{section.summary}</p>
              </div>

              <ol className="tips-list">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>

              <div className="tips-notes">
                {section.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            </article>
          ))}
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
