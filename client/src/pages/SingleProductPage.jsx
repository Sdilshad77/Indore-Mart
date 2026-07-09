import { ShoppingCart, MapPin, Phone, Clock, ArrowLeft, Package } from "lucide-react"
import LoadingScreen from "../components/LoadingScreen"
import { useDispatch, useSelector } from "react-redux"
import { useParams, Link } from "react-router-dom"
import { getProduct } from "../features/product/productSlice"
import { toast } from "react-toastify"
import { useEffect } from "react"
import { addItemToCart, getCart } from "../features/cart/cartSlice"

/* ─── Gen-Z ProductDetails ──────────────────────────────────────────────────
   Dark glass · emerald neon · spring hovers · consistent with IndoreMart
   ─────────────────────────────────────────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pd-root {
    font-family: 'DM Sans', sans-serif;
    background: #09090d;
    color: #e8e8f0;
    min-height: 100svh;
  }

  /* ambient grid */
  .pd-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 20%, black 20%, transparent 100%);
  }

  /* ── INNER ── */
  .pd-inner {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto;
    padding: 2.5rem 1.5rem 5rem;
  }

  /* back link */
  .pd-back {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.8rem; font-weight: 600; color: rgba(180,220,200,0.45);
    text-decoration: none; margin-bottom: 2.2rem;
    transition: color 0.22s ease, gap 0.28s cubic-bezier(0.34,1.56,0.64,1);
  }
  .pd-back:hover { color: #34d399; gap: 0.6rem; }

  /* ── GRID ── */
  .pd-grid-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
  }
  @media (max-width: 768px) { .pd-grid-layout { grid-template-columns: 1fr; gap: 2rem; } }

  /* ── IMAGE PANEL ── */
  .pd-img-wrap {
    border-radius: 22px; overflow: hidden;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.03);
    width: 100%;
    max-height: 520px;
    animation: pd-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both;
  }
  .pd-img {
    width: 100%; height: 100%; max-height: 520px;
    object-fit: cover; display: block;
    transition: transform 0.5s cubic-bezier(0.34,1.56,0.64,1);
  }
  .pd-img-wrap:hover .pd-img { transform: scale(1.05); }

  /* image overlay glow */
  .pd-img-glow {
    position: relative;
  }
  .pd-img-glow::after {
    content: ''; position: absolute; inset: 0; border-radius: inherit;
    background: linear-gradient(to top, rgba(9,9,13,0.35) 0%, transparent 50%);
    pointer-events: none;
  }

  /* ── DETAIL PANEL ── */
  .pd-details {
    display: flex; flex-direction: column; gap: 1.6rem;
    animation: pd-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.12s both;
  }
  @keyframes pd-fade-up {
    from { opacity:0; transform:translateY(22px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* category + shop */
  .pd-meta-row { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
  .pd-cat-tag {
    display: inline-block; padding: 0.2rem 0.65rem; border-radius: 6px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.07em;
    text-transform: uppercase; background: rgba(52,211,153,0.1);
    color: #34d399; border: 1px solid rgba(52,211,153,0.2);
  }
  .pd-shop-tag {
    display: inline-block; padding: 0.2rem 0.65rem; border-radius: 6px;
    font-size: 0.68rem; font-weight: 600; letter-spacing: 0.04em;
    background: rgba(255,255,255,0.05); color: rgba(200,220,210,0.55);
    border: 1px solid rgba(255,255,255,0.08);
  }

  /* name + desc */
  .pd-name {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(1.8rem, 4vw, 2.6rem); letter-spacing: -0.03em;
    color: #f0f0f5; line-height: 1.1;
  }
  .pd-desc {
    font-size: 0.9rem; color: rgba(200,220,210,0.5); line-height: 1.7;
  }

  /* price row */
  .pd-price-row {
    padding: 1.2rem 0;
    border-top: 1px solid rgba(255,255,255,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;
  }
  .pd-price {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 2.2rem; letter-spacing: -0.04em; color: #34d399;
  }
  .pd-stock {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.28rem 0.75rem; border-radius: 999px;
    font-size: 0.72rem; font-weight: 700;
    background: rgba(52,211,153,0.08); color: #34d399;
    border: 1px solid rgba(52,211,153,0.18);
  }
  .pd-stock-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #34d399; box-shadow: 0 0 6px #34d399;
    animation: pd-blink 1.8s ease-in-out infinite;
  }
  @keyframes pd-blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

  /* CTA buttons */
  .pd-cart-btn {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    width: 100%; padding: 0.85rem;
    border-radius: 14px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.95rem;
    background: linear-gradient(135deg, #34d399 0%, #059669 100%);
    color: #030f07;
    box-shadow: 0 0 0 0 rgba(52,211,153,0);
    transition:
      transform 0.32s cubic-bezier(0.34,1.56,0.64,1),
      box-shadow 0.32s ease;
  }
  .pd-cart-btn:hover:not(:disabled) {
    transform: scale(1.04) translateY(-2px);
    box-shadow: 0 0 28px rgba(52,211,153,0.4);
  }
  .pd-cart-btn:disabled {
    background: rgba(255,255,255,0.07);
    color: rgba(200,220,210,0.35);
    border: 1px solid rgba(255,255,255,0.08);
    cursor: not-allowed;
  }

  .pd-login-msg {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    width: 100%; padding: 0.85rem; border-radius: 14px;
    background: rgba(52,211,153,0.05); border: 1px solid rgba(52,211,153,0.15);
    font-size: 0.88rem; font-weight: 600; color: #34d399; text-align: center;
  }

  /* ── SHOP CARD ── */
  .pd-shop-card {
    border-radius: 18px; overflow: hidden;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    transition: border-color 0.3s ease;
  }
  .pd-shop-card:hover { border-color: rgba(52,211,153,0.18); }

  .pd-shop-card-head {
    padding: 1.1rem 1.3rem 0.8rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .pd-shop-card-title {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: rgba(200,220,210,0.35);
    margin-bottom: 0.5rem;
  }
  .pd-shop-name {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 1rem; color: #f0f0f5; margin-bottom: 0.35rem;
  }
  .pd-shop-desc {
    font-size: 0.78rem; color: rgba(200,220,210,0.38); line-height: 1.55;
  }

  .pd-shop-rows { padding: 0.8rem 1.3rem; display: flex; flex-direction: column; gap: 0.8rem; }

  .pd-shop-row {
    display: flex; align-items: flex-start; gap: 0.75rem;
  }
  .pd-shop-row-icon {
    width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
    background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.15);
    display: flex; align-items: center; justify-content: center;
  }
  .pd-shop-row-label {
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: rgba(200,220,210,0.3); margin-bottom: 0.18rem;
  }
  .pd-shop-row-val { font-size: 0.82rem; color: rgba(200,220,210,0.65); line-height: 1.45; }

  .pd-shop-card-footer {
    padding: 0.8rem 1.3rem;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; gap: 0.6rem;
  }
  .pd-rating {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.22rem 0.65rem; border-radius: 6px;
    background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2);
    font-size: 0.72rem; font-weight: 700; color: #f59e0b;
  }
  .pd-delivery {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.22rem 0.65rem; border-radius: 6px;
    background: rgba(52,211,153,0.07); border: 1px solid rgba(52,211,153,0.15);
    font-size: 0.72rem; font-weight: 600; color: rgba(180,220,200,0.5);
  }
`

export default function ProductDetails() {
  const { user }    = useSelector(state => state.auth)
  const { product, productLoading, productError, productErrorMessage } = useSelector(state => state.product)
  const { cartItems } = useSelector(state => state.cart)

  const dispatch  = useDispatch()
  const { pid }   = useParams()

  const isEligibleForCart =
    cartItems?.products?.length === 0
      ? true
      : product?.shop?._id === cartItems?.products[0]?.product?.shop

  const handleAddToCart = async (productId) => {
    try {
      await dispatch(addItemToCart({ productId, qty: 1 })).unwrap()
      toast.success('Added to cart!')
    } catch (err) {
      toast.error(err || 'Failed to add to cart')
    }
  }

  useEffect(() => {
    dispatch(getProduct(pid))
    if (user) dispatch(getCart())
  }, [pid, user])

  useEffect(() => {
    if (productError && productErrorMessage) toast.error(productErrorMessage)
  }, [productError, productErrorMessage])

  if (productLoading || !product) return <LoadingScreen />

  return (
    <div className="pd-root">
      <style>{css}</style>
      <div className="pd-grid" />

      <main className="pd-inner">

        {/* back */}
        <Link to="/products" className="pd-back">
          <ArrowLeft size={14} /> Back to Products
        </Link>

        <div className="pd-grid-layout">

          {/* ── IMAGE ── */}
          <div className="pd-img-wrap">
            <img
              src={product.productImage || '/placeholder.svg'}
              alt={product.name}
              className="pd-img"
            />
          </div>

          {/* ── DETAILS ── */}
          <div className="pd-details">

            {/* category + shop */}
            <div className="pd-meta-row">
              <span className="pd-cat-tag">{product.category}</span>
              <span className="pd-shop-tag">{product.shop?.name}</span>
            </div>

            {/* name + desc */}
            <div>
              <h1 className="pd-name">{product.name}</h1>
              {product.description && (
                <p className="pd-desc" style={{ marginTop: '0.7rem' }}>{product.description}</p>
              )}
            </div>

            {/* price + stock */}
            <div className="pd-price-row">
              <span className="pd-price">₹{product.price}</span>
              <span className="pd-stock">
                <span className="pd-stock-dot" />
                {product.stock} {product.stock === 1 ? 'item' : 'items'} in stock
              </span>
            </div>

            {/* CTA */}
            {!user ? (
              <div className="pd-login-msg">
                🔒 You must login to purchase this product
              </div>
            ) : (
              <button
                disabled={!isEligibleForCart}
                onClick={() => handleAddToCart(product._id)}
                className="pd-cart-btn"
              >
                <ShoppingCart size={18} />
                {isEligibleForCart ? 'Add to Cart' : 'Remove other shop\'s items first'}
              </button>
            )}

            {/* ── SHOP CARD ── */}
            <div className="pd-shop-card">
              <div className="pd-shop-card-head">
                <div className="pd-shop-card-title">Shop Information</div>
                <div className="pd-shop-name">{product.shop?.name}</div>
                {product.shop?.description && (
                  <div className="pd-shop-desc">{product.shop.description}</div>
                )}
              </div>

              <div className="pd-shop-rows">
                {product.shop?.address && (
                  <div className="pd-shop-row">
                    <div className="pd-shop-row-icon">
                      <MapPin size={13} color="#34d399" />
                    </div>
                    <div>
                      <div className="pd-shop-row-label">Address</div>
                      <div className="pd-shop-row-val">{product.shop.address}</div>
                    </div>
                  </div>
                )}

                {product.shop?.shopPhone && (
                  <div className="pd-shop-row">
                    <div className="pd-shop-row-icon">
                      <Phone size={13} color="#34d399" />
                    </div>
                    <div>
                      <div className="pd-shop-row-label">Phone</div>
                      <div className="pd-shop-row-val">{product.shop.shopPhone}</div>
                    </div>
                  </div>
                )}

                <div className="pd-shop-row">
                  <div className="pd-shop-row-icon">
                    <Clock size={13} color="#34d399" />
                  </div>
                  <div>
                    <div className="pd-shop-row-label">Availability</div>
                    <div className="pd-shop-row-val">24/7 Available</div>
                  </div>
                </div>
              </div>

              <div className="pd-shop-card-footer">
                <span className="pd-rating">★ 4.5</span>
                <span className="pd-delivery"><Clock size={11} /> 10–15 min</span>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}