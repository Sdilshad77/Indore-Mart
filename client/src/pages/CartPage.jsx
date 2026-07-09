import { Trash2, Plus, Minus, ShoppingCart, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createOrder, deleteItemFromCart, getCart, updateCart } from "../features/cart/cartSlice"
import LoadingScreen from "../components/LoadingScreen"
import { toast } from "react-toastify"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function CartPage() {
    const { cartItems, cartLoading, cartError, cartErrorMessage } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }
    }, [user, navigate])

    // Extract shopId from first cart item - shop field is an ObjectId reference
    const shopId = cartItems?.products?.length > 0
        ? (cartItems.products[0]?.product?.shop?._id?.toString() || cartItems.products[0]?.product?.shop?.toString())
        : null

    const [coupon, setCoupon] = useState("")
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [couponCode, setCouponCode] = useState("")
    const [couponApplied, setCouponApplied] = useState(false)
    const [couponError, setCouponError] = useState("")
    // Optimistic local quantities — updated instantly on +/- click
    const [localQtys, setLocalQtys] = useState({})

    // Sync local qtys whenever server responds with updated cart
    useEffect(() => {
        if (cartItems?.products) {
            const init = {}
            cartItems.products.forEach(p => { init[p.product._id] = p.qty })
            setLocalQtys(init)
        }
    }, [cartItems])

    const subtotal = cartItems?.products?.reduce((acc, p) => p.product.price * (localQtys[p.product._id] ?? p.qty) + acc, 0)
    const discount = couponApplied ? coupon.couponDiscount * subtotal / 100 : 0
    const total = subtotal - discount

    const handleRemoveItemFromCart = (pid) => dispatch(deleteItemFromCart(pid))

    // Optimistic update: change local qty immediately, then hit the API
    const handleUpdateCart = (cartDetails) => {
        const { productId, qty } = cartDetails
        if (qty < 1) return // don't go below 1
        setLocalQtys(prev => ({ ...prev, [productId]: qty }))
        dispatch(updateCart(cartDetails))
    }

    const handleApplyCoupon = async () => {
        if (!cartItems?.products?.length) {
            toast.error("Please Add Items In Your Cart")
            return
        }
        if (!shopId) {
            toast.error("Unable to determine shop. Please refresh and try again.")
            return
        }
        if (!couponCode.trim()) {
            toast.error("Please enter a coupon code")
            return
        }
        try {
            const response = await axios.post("/api/coupons/apply", { couponCode, shopId })
            setCoupon(response.data)
            setCouponApplied(true)
            setCouponError("")
            toast.success("Coupon applied successfully! 🎉")
        } catch (error) {
            setCouponError(error.response?.data?.message || "Invalid coupon code")
        }
    }

    const handleRemoveCoupon = () => setCouponApplied(false)
    const handlePlaceOrder = (coupon) => dispatch(createOrder(coupon))

    // Fetch cart only once on mount
    useEffect(() => {
        if (!user) return
        dispatch(getCart())
    }, [user])

    // Handle cart errors separately
    useEffect(() => {
        if (cartError && cartErrorMessage) {
            if (cartErrorMessage.toLowerCase().includes('authoris') || cartErrorMessage.toLowerCase().includes('token')) {
                navigate('/login')
            } else {
                toast.error(cartErrorMessage)
            }
        }
    }, [cartError, cartErrorMessage])

    // Only show full LoadingScreen on very first load (before cart data arrives)
    if (cartLoading && !cartItems) return <LoadingScreen />

    return (
        <div style={styles.wrap}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
                @keyframes fadeIn { from{opacity:0} to{opacity:1} }
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
                @keyframes blobFloat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
                @keyframes modalIn { from{opacity:0;transform:scale(0.95) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
                .cart-row { border-bottom:0.5px solid #1a1a1a; transition:background 0.2s; }
                .cart-row:hover { background:#141414; }
                .cart-row:last-child { border-bottom:none; }
                .qty-btn { background:none; border:none; cursor:pointer; color:#666; display:flex; align-items:center; justify-content:center; padding:4px; border-radius:6px; transition:color 0.2s, background 0.2s; }
                .qty-btn:hover { color:#00e87b; background:rgba(0,232,123,0.08); }
                .del-btn { background:none; border:none; cursor:pointer; color:#444; padding:8px; border-radius:8px; display:flex; align-items:center; transition:color 0.2s, background 0.2s; }
                .del-btn:hover { color:#ff4444; background:rgba(255,68,68,0.08); }
                .pay-btn { width:100%; padding:15px; background:linear-gradient(135deg,#00e87b,#00c9a0); border:none; border-radius:14px; color:#000; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:transform 0.2s, box-shadow 0.3s; }
                .pay-btn:hover { transform:translateY(-2px); box-shadow:0 12px 30px rgba(0,232,123,0.3); }
                .pay-btn:active { transform:scale(0.98); }
                .continue-btn { padding:12px 24px; background:transparent; border:0.5px solid #222; border-radius:12px; color:#888; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:border-color 0.2s, color 0.2s; }
                .continue-btn:hover { border-color:#00e87b; color:#00e87b; }
                .coupon-input { width:100%; background:#1a1a1a; border:0.5px solid #222; border-radius:12px; padding:12px 16px; color:#fff; font-size:13px; font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.25s, box-shadow 0.25s; }
                .coupon-input::placeholder { color:#444; }
                .coupon-input:focus { border-color:#00e87b; box-shadow:0 0 0 3px rgba(0,232,123,0.1); }
                .apply-btn { width:100%; padding:12px; background:#1a1a1a; border:0.5px solid #222; border-radius:12px; color:#00e87b; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; cursor:pointer; transition:border-color 0.2s, background 0.2s; }
                .apply-btn:hover { border-color:#00e87b; background:rgba(0,232,123,0.06); }
                .modal-input { width:100%; background:#1a1a1a; border:0.5px solid #222; border-radius:12px; padding:13px 16px; color:#fff; font-size:14px; font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.25s, box-shadow 0.25s; }
                .modal-input::placeholder { color:#444; }
                .modal-input:focus { border-color:#00e87b; box-shadow:0 0 0 3px rgba(0,232,123,0.1); }
                .cancel-btn { width:100%; padding:14px; background:transparent; border:0.5px solid #222; border-radius:12px; color:#888; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; cursor:pointer; transition:border-color 0.2s, color 0.2s; }
                .cancel-btn:hover { border-color:#444; color:#ccc; }
                @media(max-width:900px){ .cart-grid{grid-template-columns:1fr !important;} }
                @media(max-width:640px){
                  .cart-table-wrap{ overflow-x:auto; -webkit-overflow-scrolling:touch; }
                  .cart-table-inner{ min-width:480px; }
                  .cart-container{ padding: 1rem !important; }
                }
            `}</style>

            {/* BG Blobs */}
            <div style={{ ...styles.blob, width: 400, height: 400, background: '#00e87b', top: -120, right: -120, animation: 'blobFloat 10s ease-in-out infinite' }} />
            <div style={{ ...styles.blob, width: 250, height: 250, background: '#00c9a0', bottom: 0, left: -80, animation: 'blobFloat 12s ease-in-out infinite reverse' }} />

            <div style={styles.container}>
                {/* Header */}
                <header style={{ animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both', marginBottom: 32 }}>
                    <div style={styles.badge}>
                        <span style={styles.badgeDot} />
                        YOUR CART
                    </div>
                    <h1 style={styles.pageTitle}>
                        Shopping{' '}
                        <span style={{ background: 'linear-gradient(135deg,#00e87b,#00c9a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Cart.
                        </span>
                    </h1>
                    <p style={{ color: '#555', fontSize: 14 }}>
                        {cartItems?.products?.length ?? 0} items ready to drop 🛒
                    </p>
                </header>

                {/* Empty State */}
                {(!cartItems || cartItems?.products.length === 0) ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', animation: 'fadeIn 0.5s ease both' }}>
                        <ShoppingCart size={48} color="#222" style={{ margin: '0 auto 16px' }} />
                        <p style={{ fontSize: 18, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1, color: '#444' }}>Your cart is empty bestie 😭</p>
                        <p style={{ fontSize: 13, color: '#333', marginTop: 8 }}>Add some items and come back fr</p>
                    </div>
                ) : (
                    <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
                        {/* Left — Cart Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={styles.card}>
                                {/* Table Head */}
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 40px', padding: '14px 24px', borderBottom: '0.5px solid #1a1a1a', background: '#0d0d0d' }}>
                                    {['Product', 'Price', 'Qty', 'Total', ''].map((h, i) => (
                                        <span key={i} style={styles.tableHead}>{h}</span>
                                    ))}
                                </div>

                                {cartItems?.products?.map((item) => (
                                    <div key={item.product._id} className="cart-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 40px', padding: '16px 24px', alignItems: 'center', gap: 8 }}>
                                        {/* Product */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <img
                                                src={item.product.productImage || "/placeholder.svg"}
                                                alt={item.product.name}
                                                style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 10, border: '0.5px solid #1a1a1a', flexShrink: 0 }}
                                            />
                                            <div>
                                                <p style={{ fontSize: 13, fontWeight: 500, color: '#ddd', lineHeight: 1.3 }}>{item.product.name}</p>
                                                <p style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{item.product.shop}</p>
                                            </div>
                                        </div>
                                        {/* Price */}
                                        <span style={{ fontSize: 13, color: '#888' }}>₹{item.product.price}</span>
                                        {/* Qty */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1a1a1a', border: '0.5px solid #222', borderRadius: 10, padding: '4px 8px', width: 'fit-content' }}>
                                            <button className="qty-btn" onClick={() => handleUpdateCart({ cid: cartItems._id, productId: item.product._id, qty: (localQtys[item.product._id] ?? item.qty) - 1 })}>
                                                <Minus size={13} />
                                            </button>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', minWidth: 20, textAlign: 'center' }}>{localQtys[item.product._id] ?? item.qty}</span>
                                            <button className="qty-btn" onClick={() => handleUpdateCart({ cid: cartItems._id, productId: item.product._id, qty: (localQtys[item.product._id] ?? item.qty) + 1 })}>
                                                <Plus size={13} />
                                            </button>
                                        </div>
                                        {/* Total */}
                                        <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>₹{item.product.price * (localQtys[item.product._id] ?? item.qty)}</span>
                                        {/* Delete */}
                                        <button className="del-btn" onClick={() => handleRemoveItemFromCart(item.product._id)}>
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button className="continue-btn" onClick={() => navigate('/')}>
                                ← Continue Shopping
                            </button>
                        </div>

                        {/* Right — Summary */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
                            {/* Coupon */}
                            <div style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.tableHead}>Apply Coupon</span>
                                </div>
                                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {!couponApplied ? (
                                        <>
                                            <input
                                                className="coupon-input"
                                                type="text"
                                                placeholder="Enter coupon code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                            />
                                            <button className="apply-btn" onClick={handleApplyCoupon}>Apply Coupon</button>
                                            {couponError && <p style={{ fontSize: 11, color: '#ff4444' }}>{couponError}</p>}
                                            <p style={{ fontSize: 11, color: '#444' }}>Try code: SAVE10</p>
                                        </>
                                    ) : (
                                        <div style={{ background: 'rgba(0,232,123,0.08)', border: '0.5px solid rgba(0,232,123,0.25)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                                            <div>
                                                <p style={{ fontSize: 13, fontWeight: 600, color: '#00e87b' }}>Coupon Applied! 🎉</p>
                                                <p style={{ fontSize: 12, color: '#00c9a0', marginTop: 3 }}>Code: {couponCode.toUpperCase()}</p>
                                                <p style={{ fontSize: 11, color: '#555', marginTop: 2 }}>You saved ₹{discount.toFixed(0)}</p>
                                            </div>
                                            <button onClick={handleRemoveCoupon} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', flexShrink: 0, padding: 2 }}>
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.tableHead}>Order Summary</span>
                                </div>
                                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={styles.summaryRow}>
                                        <span style={{ fontSize: 13, color: '#666' }}>Subtotal</span>
                                        <span style={{ fontSize: 13, color: '#ccc', fontWeight: 500 }}>₹{subtotal}</span>
                                    </div>
                                    <div style={styles.summaryRow}>
                                        <span style={{ fontSize: 13, color: '#666' }}>Discount</span>
                                        <span style={{ fontSize: 13, color: discount > 0 ? '#00e87b' : '#444', fontWeight: 500 }}>
                                            {discount > 0 ? `-₹${discount.toFixed(0)}` : '—'}
                                        </span>
                                    </div>
                                    <div style={{ height: '0.5px', background: '#1a1a1a', margin: '4px 0' }} />
                                    <div style={styles.summaryRow}>
                                        <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Total</span>
                                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, background: 'linear-gradient(135deg,#00e87b,#00c9a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: 1 }}>
                                            ₹{total.toFixed(0)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button className="pay-btn" onClick={() => setIsPaymentOpen(true)}>
                                <ShoppingCart size={18} />
                                Proceed to Pay
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Payment Modal */}
            {isPaymentOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalCard}>
                        {/* Modal Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                            <div>
                                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#fff', letterSpacing: 1 }}>
                                    Pay <span style={{ background: 'linear-gradient(135deg,#00e87b,#00c9a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Secure.</span>
                                </h2>
                                <p style={{ fontSize: 12, color: '#555', marginTop: 2 }}>🔒 Encrypted & safe fr</p>
                            </div>
                            <button onClick={() => setIsPaymentOpen(false)} style={{ background: '#1a1a1a', border: '0.5px solid #222', borderRadius: 10, padding: 8, cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}>
                                <X size={18} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={styles.modalLabel}>Card Number</label>
                                <input className="modal-input" type="text" placeholder="1234 5678 9012 3456" />
                            </div>
                            <div>
                                <label style={styles.modalLabel}>Cardholder Name</label>
                                <input className="modal-input" type="text" placeholder="Your Name" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={styles.modalLabel}>Expiry Date</label>
                                    <input className="modal-input" type="text" placeholder="MM/YY" />
                                </div>
                                <div>
                                    <label style={styles.modalLabel}>CVV</label>
                                    <input className="modal-input" type="text" placeholder="123" />
                                </div>
                            </div>

                            {/* Total in modal */}
                            <div style={{ background: '#0d0d0d', border: '0.5px solid #1a1a1a', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 13, color: '#666' }}>Order Total</span>
                                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, background: 'linear-gradient(135deg,#00e87b,#00c9a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: 1 }}>
                                    ₹{total?.toFixed(0)}
                                </span>
                            </div>

                            <button className="pay-btn" onClick={() => handlePlaceOrder(couponCode)}>
                                Pay ₹{total?.toFixed(0)} ✦
                            </button>
                            <button className="cancel-btn" onClick={() => setIsPaymentOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const styles = {
    wrap: {
        minHeight: '100vh', background: '#0a0a0a',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative', overflow: 'hidden',
        paddingBottom: '4rem',
    },
    blob: {
        position: 'fixed', borderRadius: '50%',
        filter: 'blur(100px)', opacity: 0.1, pointerEvents: 'none', zIndex: 0,
    },
    container: {
        maxWidth: 1100, margin: '0 auto',
        padding: '2.5rem 2rem',
        position: 'relative', zIndex: 1,
    },
    badge: {
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: 'rgba(0,232,123,0.1)', border: '0.5px solid rgba(0,232,123,0.25)',
        color: '#00e87b', fontSize: 10, fontWeight: 600, letterSpacing: 1,
        textTransform: 'uppercase', padding: '4px 10px', borderRadius: 20, marginBottom: 8,
    },
    badgeDot: {
        width: 6, height: 6, background: '#00e87b', borderRadius: '50%',
        display: 'inline-block', animation: 'pulse 2s infinite',
    },
    pageTitle: {
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 52, color: '#fff', lineHeight: 1, letterSpacing: 1, marginBottom: 6,
    },
    card: {
        background: '#111', border: '0.5px solid #222', borderRadius: 20, overflow: 'hidden',
        animation: 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
    },
    cardHeader: {
        padding: '14px 20px', borderBottom: '0.5px solid #1a1a1a', background: '#0d0d0d',
    },
    tableHead: {
        fontSize: 10, fontWeight: 600, letterSpacing: '1.5px',
        textTransform: 'uppercase', color: '#444',
    },
    summaryRow: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    modalOverlay: {
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50, padding: '1rem',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease both',
    },
    modalCard: {
        background: '#111', border: '0.5px solid #222', borderRadius: 24,
        padding: '2rem', width: '100%', maxWidth: 420,
        maxHeight: '90vh', overflowY: 'auto',
        animation: 'modalIn 0.35s cubic-bezier(0.16,1,0.3,1) both',
    },
    modalLabel: {
        display: 'block', fontSize: 11, fontWeight: 600,
        letterSpacing: '1.5px', color: '#555', textTransform: 'uppercase', marginBottom: 6,
    },
}