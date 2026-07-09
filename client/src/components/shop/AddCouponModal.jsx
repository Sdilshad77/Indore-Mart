import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCoupon, getMyShopDetails } from "../../features/shop/shopSlice";

/* ─── Gen-Z AddCouponModal ──────────────────────────────────────────────────
   Dark glass · emerald neon · spring animations · consistent IndoreMart
   ─────────────────────────────────────────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .acm-overlay {
    position: fixed; inset: 0; z-index: 50;
    display: flex; align-items: center; justify-content: center;
    padding: 1rem; overflow-y: auto;
    background: rgba(4, 9, 6, 0.8);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    animation: acm-overlay-in 0.22s ease both;
    font-family: 'DM Sans', sans-serif;
  }
  @keyframes acm-overlay-in { from{opacity:0} to{opacity:1} }

  .acm-modal {
    position: relative;
    width: 100%; max-width: 460px;
    border-radius: 22px;
    background: rgba(8, 16, 10, 0.95);
    border: 1px solid rgba(52,211,153,0.12);
    box-shadow:
      0 0 0 1px rgba(52,211,153,0.07),
      0 28px 70px rgba(0,0,0,0.65),
      inset 0 1px 0 rgba(255,255,255,0.05);
    overflow: hidden;
    animation: acm-modal-in 0.38s cubic-bezier(0.34,1.56,0.64,1) both;
    margin: auto;
  }
  @keyframes acm-modal-in {
    from { opacity:0; transform:scale(0.88) translateY(22px); }
    to   { opacity:1; transform:scale(1)    translateY(0);    }
  }

  /* noise */
  .acm-modal::before {
    content:''; position:absolute; inset:0; border-radius:inherit;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events:none; z-index:0; opacity:0.5;
  }
  /* glow blob */
  .acm-modal::after {
    content:''; position:absolute;
    width:280px; height:280px; border-radius:50%;
    background:radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%);
    top:-90px; right:-70px; pointer-events:none; z-index:0;
  }

  .acm-inner { position:relative; z-index:1; }

  /* ── HEAD ── */
  .acm-head {
    padding: 1.6rem 1.8rem 1.2rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
  }

  .acm-head-label {
    font-size:0.63rem; font-weight:700; letter-spacing:0.11em;
    text-transform:uppercase; color:#34d399; margin-bottom:0.3rem;
  }
  .acm-head-title {
    font-family:'Syne',sans-serif; font-weight:800;
    font-size:1.15rem; letter-spacing:-0.02em; color:#f0f0f5; margin-bottom:0.18rem;
  }
  .acm-head-sub { font-size:0.77rem; color:rgba(180,220,200,0.38); }

  .acm-close {
    width:30px; height:30px; border-radius:8px; flex-shrink:0;
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; color:rgba(180,220,200,0.4);
    transition: background 0.22s, color 0.22s, transform 0.28s cubic-bezier(0.34,1.56,0.64,1);
  }
  .acm-close:hover { background:rgba(255,60,80,0.12); color:#ff6b7a; transform:scale(1.1) rotate(90deg); }

  /* ── BODY ── */
  .acm-body { padding:1.5rem 1.8rem; display:flex; flex-direction:column; gap:1.2rem; }

  .acm-field { display:flex; flex-direction:column; gap:0.4rem; }

  .acm-label {
    font-size:0.68rem; font-weight:700; letter-spacing:0.09em;
    text-transform:uppercase; color:rgba(180,220,200,0.38);
  }

  .acm-input {
    width:100%; padding:0.65rem 0.95rem;
    border-radius:11px; background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.09); color:#f0f0f5;
    font-family:'DM Sans',sans-serif; font-size:0.9rem; outline:none;
    transition: border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
  }
  .acm-input::placeholder { color:rgba(180,220,200,0.22); }
  .acm-input:focus {
    border-color:rgba(52,211,153,0.38);
    background:rgba(52,211,153,0.04);
    box-shadow:0 0 0 3px rgba(52,211,153,0.08);
  }
  /* code input — monospace + uppercase feel */
  .acm-input.code {
    font-family:'Syne',sans-serif; font-weight:700;
    font-size:1rem; letter-spacing:0.08em; text-transform:uppercase; color:#34d399;
  }
  .acm-input.code::placeholder { font-family:'DM Sans',sans-serif; font-weight:400; font-size:0.9rem; text-transform:none; color:rgba(180,220,200,0.22); letter-spacing:normal; }

  /* hide number spinners */
  .acm-input[type=number]::-webkit-inner-spin-button,
  .acm-input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; }
  .acm-input[type=number] { -moz-appearance:textfield; }

  /* live preview pill */
  .acm-preview {
    display:inline-flex; align-items:center; gap:0.4rem;
    padding:0.3rem 0.8rem; border-radius:999px; width:fit-content;
    background:rgba(52,211,153,0.08); border:1px solid rgba(52,211,153,0.18);
    font-size:0.75rem; font-weight:700; color:#34d399;
    transition: opacity 0.22s ease;
  }
  .acm-preview.hidden { opacity:0; pointer-events:none; }

  /* discount slider feel — % indicator */
  .acm-discount-wrap { position:relative; }
  .acm-pct {
    position:absolute; right:0.9rem; top:50%; transform:translateY(-50%);
    font-family:'Syne',sans-serif; font-weight:700; font-size:0.9rem;
    color:rgba(52,211,153,0.6); pointer-events:none;
  }

  /* ── FOOTER ── */
  .acm-footer {
    padding:1rem 1.8rem 1.6rem;
    border-top:1px solid rgba(255,255,255,0.06);
    display:flex; align-items:center; justify-content:flex-end; gap:0.6rem;
  }

  .acm-btn-cancel {
    padding:0.5rem 1.1rem; border-radius:10px;
    background:transparent; border:1px solid rgba(255,255,255,0.09);
    color:rgba(180,220,200,0.5); font-family:'DM Sans',sans-serif;
    font-weight:600; font-size:0.85rem; cursor:pointer;
    transition: background 0.22s, color 0.22s, transform 0.28s cubic-bezier(0.34,1.56,0.64,1);
  }
  .acm-btn-cancel:hover { background:rgba(255,255,255,0.06); color:#e8e8f0; transform:scale(1.04); }

  .acm-btn-submit {
    display:inline-flex; align-items:center; gap:0.4rem;
    padding:0.5rem 1.4rem; border-radius:10px;
    background:linear-gradient(135deg,#34d399 0%,#059669 100%);
    color:#030f07; font-family:'DM Sans',sans-serif;
    font-weight:700; font-size:0.85rem; border:none; cursor:pointer;
    transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.32s ease;
  }
  .acm-btn-submit:hover {
    transform:scale(1.07) translateY(-1px);
    box-shadow:0 0 22px rgba(52,211,153,0.4);
  }
  .acm-btn-submit:disabled {
    background:rgba(255,255,255,0.07); color:rgba(180,220,200,0.3);
    cursor:not-allowed; transform:none; box-shadow:none;
  }
`

const AddCouponModal = ({ showModal, handleModal }) => {
  const dispatch = useDispatch()
  const { shop } = useSelector(state => state.shop)

  const [formData, setFormData] = useState({
    couponCode: '',
    couponDiscount: '',
    isActive: true,
    shopId: '',
  })

  const { couponCode, couponDiscount } = formData

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!couponCode || !couponDiscount) return
    dispatch(createCoupon({ ...formData, couponDiscount: Number(couponDiscount) }))
    handleModal()
    setFormData({ couponCode: '', couponDiscount: '', isActive: true, shopId: shop?._id || '' })
  }

  // Only fetch shop details if not already loaded
  useEffect(() => { 
    if (!shop?._id) dispatch(getMyShopDetails()) 
  }, [])

  useEffect(() => {
    if (shop?._id) setFormData(prev => ({ ...prev, shopId: shop._id }))
  }, [shop])

  if (!showModal) return null

  const discountNum = Number(couponDiscount)
  const validDiscount = discountNum >= 1 && discountNum <= 100

  return (
    <>
      <style>{css}</style>
      <div
        className="acm-overlay"
        onClick={e => { if (e.target === e.currentTarget) handleModal() }}
      >
        <div className="acm-modal">
          <div className="acm-inner">

            {/* HEAD */}
            <div className="acm-head">
              <div>
                <div className="acm-head-label">Shop Management</div>
                <div className="acm-head-title">Add New Coupon</div>
                <div className="acm-head-sub">Create a discount coupon for your shop</div>
              </div>
              <button type="button" className="acm-close" onClick={handleModal}>
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="shopId" value={formData.shopId} />

              <div className="acm-body">

                {/* coupon code */}
                <div className="acm-field">
                  <div className="acm-label">Coupon Code</div>
                  <input
                    className="acm-input code"
                    name="couponCode"
                    value={couponCode}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. SAVE50"
                    autoFocus
                    autoComplete="off"
                  />
                  {/* live preview */}
                  <div className={`acm-preview${!couponCode ? ' hidden' : ''}`}>
                    🎟 {couponCode.toUpperCase()}
                  </div>
                </div>

                {/* discount */}
                <div className="acm-field">
                  <div className="acm-label">Discount (%)</div>
                  <div className="acm-discount-wrap">
                    <input
                      className="acm-input"
                      style={{ paddingRight: '2.8rem' }}
                      name="couponDiscount"
                      value={couponDiscount}
                      onChange={handleChange}
                      type="number"
                      min="1"
                      max="100"
                      placeholder="10"
                    />
                    {couponDiscount && <span className="acm-pct">%</span>}
                  </div>
                  {/* live preview */}
                  {couponCode && couponDiscount && (
                    <div className="acm-preview">
                      ✨ {couponCode.toUpperCase()} → {couponDiscount}% off
                    </div>
                  )}
                </div>

              </div>

              {/* FOOTER */}
              <div className="acm-footer">
                <button type="button" className="acm-btn-cancel" onClick={handleModal}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="acm-btn-submit"
                  disabled={!couponCode || !couponDiscount || !validDiscount}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Coupon
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  )
}

export default AddCouponModal