import { MapPin, Phone, Package, ArrowLeft, Clock, Star } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"
import LoadingScreen from "../components/LoadingScreen"
import { getProducts, getProductShop } from "../features/product/productSlice"
import { toast } from "react-toastify"

/* ─── Gen-Z ShopDetailsPage ─────────────────────────────────────────────────
   Dark glass · emerald neon · spring hovers · consistent with IndoreMart
   ─────────────────────────────────────────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sd-root {
    font-family: 'DM Sans', sans-serif;
    background: #09090d;
    color: #e8e8f0;
    min-height: 100svh;
  }

  /* fixed ambient grid */
  .sd-bg-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 90% 60% at 50% 0%, black 20%, transparent 100%);
    animation: sd-grid 22s linear infinite;
  }
  @keyframes sd-grid { from{background-position:0 0} to{background-position:48px 48px} }

  .sd-inner {
    position: relative; z-index: 1;
    max-width: 1200px; margin: 0 auto;
    padding: 2.5rem 1.5rem 5rem;
  }

  /* ── BACK ── */
  .sd-back {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.8rem; font-weight: 600; color: rgba(180,220,200,0.45);
    text-decoration: none; margin-bottom: 2rem;
    transition: color 0.22s ease, gap 0.28s cubic-bezier(0.34,1.56,0.64,1);
  }
  .sd-back:hover { color: #34d399; gap: 0.65rem; }

  /* ════════════ SHOP HERO ════════════ */
  .sd-hero {
    position: relative; overflow: hidden;
    border-radius: 22px; padding: 2.2rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(52,211,153,0.12);
    margin-bottom: 2.5rem;
    animation: sd-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.05s both;
  }
  /* hero top glow blob */
  .sd-hero::before {
    content: ''; position: absolute;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%);
    top: -150px; right: -100px; pointer-events: none;
    animation: sd-float 9s ease-in-out infinite;
  }
  @keyframes sd-float { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-16px,18px)} }
  @keyframes sd-fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  .sd-hero-top {
    display: flex; align-items: flex-start; gap: 1.3rem;
    margin-bottom: 2rem; position: relative; z-index: 1;
    flex-wrap: wrap;
  }

  .sd-shop-icon {
    width: 60px; height: 60px; border-radius: 16px; flex-shrink: 0;
    background: linear-gradient(135deg, #34d399 0%, #059669 100%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 22px rgba(52,211,153,0.3);
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
  }
  .sd-hero:hover .sd-shop-icon {
    transform: scale(1.08) rotate(-4deg);
    box-shadow: 0 0 34px rgba(52,211,153,0.5);
  }

  .sd-shop-name {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(1.7rem, 4vw, 2.5rem); letter-spacing: -0.03em;
    color: #f0f0f5; line-height: 1.1; margin-bottom: 0.4rem;
  }
  .sd-shop-desc {
    font-size: 0.9rem; color: rgba(200,220,210,0.48); line-height: 1.6;
  }

  /* stat cards */
  .sd-stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 0.8rem; margin-bottom: 1.4rem; position: relative; z-index: 1;
  }
  @media (max-width: 640px) { .sd-stats { grid-template-columns: repeat(2, 1fr); } }

  .sd-stat {
    padding: 1rem; border-radius: 14px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
    transition: border-color 0.25s ease, transform 0.32s cubic-bezier(0.34,1.56,0.64,1);
  }
  .sd-stat:hover { border-color: rgba(52,211,153,0.2); transform: translateY(-3px); }

  .sd-stat-val {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 1.4rem; letter-spacing: -0.03em; color: #f0f0f5;
    margin-bottom: 0.2rem;
  }
  .sd-stat-val.green { color: #34d399; }
  .sd-stat-label { font-size: 0.72rem; color: rgba(200,220,210,0.35); letter-spacing: 0.04em; }

  /* contact row */
  .sd-contact {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;
    position: relative; z-index: 1;
  }
  @media (max-width: 540px) { .sd-contact { grid-template-columns: 1fr; } }

  .sd-contact-card {
    display: flex; align-items: flex-start; gap: 0.75rem;
    padding: 0.9rem 1rem; border-radius: 12px;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
    transition: border-color 0.25s ease;
  }
  .sd-contact-card:hover { border-color: rgba(52,211,153,0.15); }

  .sd-contact-icon {
    width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
    background: rgba(52,211,153,0.09); border: 1px solid rgba(52,211,153,0.15);
    display: flex; align-items: center; justify-content: center;
  }
  .sd-contact-label {
    font-size: 0.62rem; font-weight: 700; letter-spacing: 0.09em;
    text-transform: uppercase; color: rgba(200,220,210,0.3); margin-bottom: 0.2rem;
  }
  .sd-contact-val { font-size: 0.82rem; color: rgba(200,220,210,0.62); line-height: 1.45; }

  /* ════════════ PRODUCTS SECTION ════════════ */
  .sd-products { animation: sd-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.18s both; }

  .sd-prod-head {
    display: flex; align-items: flex-end; justify-content: space-between;
    flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.8rem;
  }
  .sd-prod-sec-label {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: #34d399; margin-bottom: 0.4rem;
  }
  .sd-prod-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(1.3rem, 3vw, 1.9rem); letter-spacing: -0.03em; color: #f0f0f5;
  }
  .sd-prod-title em {
    font-style: normal;
    background: linear-gradient(90deg, #34d399, #6ee7b7);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .sd-prod-count {
    font-size: 0.78rem; color: rgba(200,220,210,0.35);
    padding: 0.25rem 0.7rem; border-radius: 999px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  }

  /* grid */
  .sd-prod-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;
  }
  @media (max-width: 900px)  { .sd-prod-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 640px)  { .sd-prod-grid { grid-template-columns: repeat(2, 1fr); } }

  /* product card */
  .sd-prod-card {
    border-radius: 16px; overflow: hidden;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    transition:
      transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
      border-color 0.28s ease,
      box-shadow 0.35s ease;
    animation: sd-card-in 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes sd-card-in { from{opacity:0;transform:translateY(18px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

  .sd-prod-card:hover {
    transform: translateY(-7px) scale(1.02);
    border-color: rgba(52,211,153,0.22);
    box-shadow: 0 16px 40px rgba(0,0,0,0.4);
  }

  .sd-prod-img-wrap {
    position: relative; aspect-ratio: 1; overflow: hidden;
    background: rgba(255,255,255,0.03);
  }
  .sd-prod-img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.4s ease;
  }
  .sd-prod-card:hover .sd-prod-img { transform: scale(1.07); }

  .sd-low-stock {
    position: absolute; top: 0.5rem; right: 0.5rem;
    padding: 0.18rem 0.55rem; border-radius: 6px;
    font-size: 0.62rem; font-weight: 700; letter-spacing: 0.05em;
    text-transform: uppercase;
    background: rgba(255,60,80,0.15); color: #ff6b7a;
    border: 1px solid rgba(255,60,80,0.25);
  }

  .sd-prod-body { padding: 0.9rem; }

  .sd-prod-cat {
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.07em;
    text-transform: uppercase; color: #34d399; margin-bottom: 0.35rem;
  }
  .sd-prod-name {
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 0.88rem; color: #f0f0f5;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden; line-height: 1.35; margin-bottom: 0.3rem;
    transition: color 0.22s ease;
  }
  .sd-prod-card:hover .sd-prod-name { color: #34d399; }

  .sd-prod-desc {
    font-size: 0.72rem; color: rgba(200,220,210,0.35); line-height: 1.5;
    margin-bottom: 0.8rem;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }

  .sd-prod-foot { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.75rem; }
  .sd-prod-price {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.05rem; color: #34d399;
  }
  .sd-prod-stock { font-size: 0.68rem; color: rgba(200,220,210,0.3); }

  .sd-view-btn {
    display: flex; align-items: center; justify-content: center; gap: 0.35rem;
    width: 100%; padding: 0.5rem;
    border-radius: 9px;
    background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.18);
    color: #34d399; font-weight: 700; font-size: 0.78rem;
    text-decoration: none;
    transition: background 0.22s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1);
  }
  .sd-view-btn:hover { background: rgba(52,211,153,0.18); transform: scale(1.04); }

  /* empty state */
  .sd-empty {
    grid-column: 1 / -1;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 0.8rem; padding: 5rem 1rem; text-align: center;
  }
  .sd-empty-icon { color: rgba(52,211,153,0.25); animation: sd-float 4s ease-in-out infinite; }
  .sd-empty-title { font-family:'Syne',sans-serif; font-weight:700; font-size:1.1rem; color:#f0f0f5; }
  .sd-empty-sub   { font-size:0.82rem; color:rgba(200,220,210,0.35); }

  /* not found */
  .sd-notfound {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 60vh; gap: 1rem; text-align: center;
  }
  .sd-notfound-title { font-family:'Syne',sans-serif; font-weight:800; font-size:1.5rem; color:#f0f0f5; }
  .sd-notfound-sub   { font-size:0.88rem; color:rgba(200,220,210,0.38); }
`

export default function ShopDetailsPage() {
  const { sid } = useParams()
  const { products, productShop, productLoading, productError, productErrorMessage } =
    useSelector(state => state.product)
  const dispatch = useDispatch()
  const [localLoading, setLocalLoading] = useState(true)

  const shopProducts = products?.filter(p => p.shop?._id === productShop?._id) ?? []

  // stable delivery time — avoid re-render flickering from Math.random()
  const deliveryMin = useRef(Math.floor(Math.random() * 20 + 10)).current

  useEffect(() => {
    setLocalLoading(true)
    dispatch(getProductShop(sid))
    dispatch(getProducts())
  }, [sid])

  // Once productShop is loaded and matches the current sid, stop loading
  useEffect(() => {
    if (!productLoading) {
      setLocalLoading(false)
    }
  }, [productLoading, productShop])

  useEffect(() => {
    if (productError && productErrorMessage) toast.error(productErrorMessage)
  }, [productError, productErrorMessage])

  if (localLoading || productLoading) return <LoadingScreen />

  if (!productShop) {
    return (
      <div className="sd-root">
        <style>{css}</style>
        <div className="sd-bg-grid" />
        <div className="sd-inner">
          <Link to="/marketplace" className="sd-back"><ArrowLeft size={14} /> Back to Shops</Link>
          <div className="sd-notfound">
            <Package size={48} style={{ color: 'rgba(52,211,153,0.25)' }} />
            <div className="sd-notfound-title">Shop not found</div>
            <div className="sd-notfound-sub">This shop may have been removed or the link is incorrect.</div>
            <Link to="/marketplace" className="sd-back" style={{ marginBottom: 0 }}>← Browse all shops</Link>
          </div>
        </div>
      </div>
    )
  }

  const STATS = [
    { val: '★ 5.0', label: 'Rating',    green: true  },
    { val: shopProducts.length,           label: 'Products'  },
    { val: `${deliveryMin} Min`,          label: 'Delivery'  },
    { val: '24/7',                        label: 'Available' },
  ]

  return (
    <div className="sd-root">
      <style>{css}</style>
      <div className="sd-bg-grid" />

      <main className="sd-inner">

        {/* back */}
        <Link to="/marketplace" className="sd-back">
          <ArrowLeft size={14} /> Back to Shops
        </Link>

        {/* ── HERO ── */}
        <div className="sd-hero">
          <div className="sd-hero-top">
            <div className="sd-shop-icon">
              <Package size={26} color="#030f07" strokeWidth={2.5} />
            </div>
            <div>
              <div className="sd-shop-name">{productShop.name}</div>
              {productShop.description && (
                <div className="sd-shop-desc">{productShop.description}</div>
              )}
            </div>
          </div>

          {/* stats */}
          <div className="sd-stats">
            {STATS.map(({ val, label, green }) => (
              <div key={label} className="sd-stat">
                <div className={`sd-stat-val${green ? ' green' : ''}`}>{val}</div>
                <div className="sd-stat-label">{label}</div>
              </div>
            ))}
          </div>

          {/* contact */}
          <div className="sd-contact">
            {productShop.address && (
              <div className="sd-contact-card">
                <div className="sd-contact-icon"><MapPin size={13} color="#34d399" /></div>
                <div>
                  <div className="sd-contact-label">Address</div>
                  <div className="sd-contact-val">{productShop.address}</div>
                </div>
              </div>
            )}
            {productShop.shopPhone && (
              <div className="sd-contact-card">
                <div className="sd-contact-icon"><Phone size={13} color="#34d399" /></div>
                <div>
                  <div className="sd-contact-label">Phone</div>
                  <div className="sd-contact-val">{productShop.shopPhone}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── PRODUCTS ── */}
        <div className="sd-products">
          <div className="sd-prod-head">
            <div>
              <div className="sd-prod-sec-label">Catalogue</div>
              <div className="sd-prod-title">
                Products from <em>{productShop.name}</em>
              </div>
            </div>
            <span className="sd-prod-count">{shopProducts.length} products</span>
          </div>

          <div className="sd-prod-grid">
            {shopProducts.length > 0 ? shopProducts.map((product, i) => (
              <div
                key={product._id}
                className="sd-prod-card"
                style={{ animationDelay: `${i * 55}ms` }}
              >
                <div className="sd-prod-img-wrap">
                  <img
                    src={product.productImage || '/placeholder.svg'}
                    alt={product.name}
                    className="sd-prod-img"
                  />
                  {product.stock <= 5 && (
                    <span className="sd-low-stock">Low Stock</span>
                  )}
                </div>
                <div className="sd-prod-body">
                  <div className="sd-prod-cat">{product.category}</div>
                  <div className="sd-prod-name">{product.name}</div>
                  {product.description && (
                    <div className="sd-prod-desc">{product.description}</div>
                  )}
                  <div className="sd-prod-foot">
                    <span className="sd-prod-price">₹{product.price}</span>
                    <span className="sd-prod-stock">{product.stock} in stock</span>
                  </div>
                  <Link to={`/products/${product._id}`} className="sd-view-btn">
                    View Product →
                  </Link>
                </div>
              </div>
            )) : (
              <div className="sd-empty">
                <Package size={44} className="sd-empty-icon" />
                <div className="sd-empty-title">No products yet</div>
                <div className="sd-empty-sub">This shop hasn't listed any products. Check back soon!</div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}