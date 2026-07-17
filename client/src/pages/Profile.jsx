import { User, Mail, Phone, MapPin, Package, Store, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMyOrders } from "../features/auth/authSlice"
import OrderDetailsModal from "../components/shop/OrderDetailsModal"
import RequestShopOwner from "../components/RequestShopOwner"

export default function ProfilePage() {
    const { user, orders, shopStatus } = useSelector(state => state.auth)
    const [showModal, setShowModal] = useState(false)
    const [orderDetails, setOrderDetails] = useState(null)
    const dispatch = useDispatch()

    const handleOrderDetails = (order) => {
        setOrderDetails(order)
        setShowModal(prev => !prev)
    }

    useEffect(() => {
        dispatch(getMyOrders())
    }, [])

    // Guard: user not yet loaded (brief null on page reload)
    if (!user) return null

    return (
        <div style={styles.wrap}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'DM Sans', sans-serif; background: #0a0a0a; }
                @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
                @keyframes blobFloat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
                @keyframes fadeIn { from{opacity:0} to{opacity:1} }
                .info-card { background:#111; border:0.5px solid #222; border-radius:20px; overflow:hidden; animation:slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
                .info-card:hover { border-color:#2a2a2a; }
                .order-row { border-bottom:0.5px solid #1a1a1a; cursor:pointer; transition:background 0.2s; }
                .order-row:hover { background:#161616; }
                .order-row:last-child { border-bottom:none; }
                .shop-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:8px; padding:13px; background:linear-gradient(135deg,#00e87b,#00c9a0); border:none; border-radius:12px; color:#000; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; cursor:pointer; transition:transform 0.2s, box-shadow 0.3s; }
                .shop-btn:hover { transform:translateY(-2px); box-shadow:0 10px 25px rgba(0,232,123,0.3); }
                .shop-btn:active { transform:scale(0.98); }
                @media(max-width:768px){ .profile-grid{ grid-template-columns:1fr !important; } .info-grid{ grid-template-columns:1fr !important; } }
                @media(max-width:480px){ .profile-header{ flex-direction:column-reverse !important; align-items:flex-start !important; } }
            `}</style>

            {showModal && <OrderDetailsModal orderDetails={orderDetails} handleOrderDetails={handleOrderDetails} />}

            {/* BG Blobs */}
            <div style={{ ...styles.blob, width: 500, height: 500, background: '#00e87b', top: -150, right: -150, animation: 'blobFloat 10s ease-in-out infinite' }} />
            <div style={{ ...styles.blob, width: 300, height: 300, background: '#00c9a0', bottom: 0, left: -80, animation: 'blobFloat 12s ease-in-out infinite reverse' }} />

            <div style={styles.container}>
                {/* Header */}
                <header style={styles.header} className="profile-header">
                    <div>
                        <div style={styles.badge}>
                            <span style={styles.badgeDot} />
                            MY PROFILE
                        </div>
                        <h1 style={styles.pageTitle}>
                            Hey,{' '}
                            <span style={{ background: 'linear-gradient(135deg,#00e87b,#00c9a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                {user.name.split(' ')[0]}.
                            </span>
                        </h1>
                        <p style={{ color: '#555', fontSize: 14 }}>Manage ur vibe & orders 🛒</p>
                    </div>
                    <div style={styles.avatar}>{user.name[0]}</div>
                </header>

                {/* Main Grid */}
                <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Personal Info Card */}
                        <div className="info-card">
                            <div style={styles.cardHeader}>
                                <User size={14} color="#00e87b" />
                                <span style={styles.cardHeaderText}>Personal Information</span>
                            </div>
                            <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                                {[
                                    { label: 'Full Name', value: user.name, icon: null },
                                    { label: 'Email Address', value: user.email, icon: <Mail size={13} color="#444" /> },
                                    { label: 'Phone Number', value: user.phone, icon: <Phone size={13} color="#444" /> },
                                    { label: 'Default Address', value: user.address, icon: <MapPin size={13} color="#444" /> },
                                ].map((item, i) => (
                                    <div key={i} style={{ padding: '20px 24px', borderRight: i % 2 === 0 ? '0.5px solid #1a1a1a' : 'none', borderBottom: i < 2 ? '0.5px solid #1a1a1a' : 'none' }}>
                                        <p style={styles.infoLabel}>{item.label}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                            {item.icon}
                                            <span style={styles.infoValue}>{item.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Orders Section */}
                        <div style={{ animation: 'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <Package size={18} color="#00e87b" />
                                <h2 style={styles.sectionTitle}>My Orders</h2>
                            </div>

                            <div className="info-card" style={{ overflow: 'hidden' }}>
                                {/* Table Header */}
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '14px 24px', borderBottom: '0.5px solid #1a1a1a', background: '#0d0d0d' }}>
                                    {['Order ID', 'Date', 'Amount', 'Status'].map((h, i) => (
                                        <span key={i} style={{ ...styles.tableHead, textAlign: i === 3 ? 'right' : 'left' }}>{h}</span>
                                    ))}
                                </div>

                                {/* Rows */}
                                {orders && orders.length > 0 ? orders.map((order) => (
                                    <div
                                        key={order._id}
                                        className="order-row"
                                        onClick={() => handleOrderDetails(order)}
                                        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '16px 24px', alignItems: 'center' }}
                                    >
                                        <span style={{ fontSize: 13, color: '#00e87b', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>
                                            #{order._id.slice(-8)}
                                        </span>
                                        <span style={{ fontSize: 13, color: '#666' }}>
                                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                        </span>
                                        <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>
                                            ₹{order.totalBillAmount}
                                        </span>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '3px 10px',
                                                borderRadius: 20,
                                                fontSize: 11,
                                                fontWeight: 600,
                                                letterSpacing: '0.5px',
                                                textTransform: 'uppercase',
                                                background: order.status === 'delivered' ? 'rgba(0,232,123,0.12)' : 'rgba(255,170,0,0.12)',
                                                color: order.status === 'delivered' ? '#00e87b' : '#ffaa00',
                                                border: `0.5px solid ${order.status === 'delivered' ? 'rgba(0,232,123,0.3)' : 'rgba(255,170,0,0.3)'}`,
                                            }}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ padding: '3rem', textAlign: 'center', color: '#444' }}>
                                        <Package size={32} color="#222" style={{ margin: '0 auto 12px' }} />
                                        <p style={{ fontSize: 14 }}>No orders yet bestie 😭</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both' }}>
                        {/* Shop Owner CTA */}
                        <div style={styles.shopCard}>
                            {/* Decorative Circle */}
                            <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(0,232,123,0.06)', top: -30, right: -30, pointerEvents: 'none' }} />
                            <div style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,232,123,0.04)', bottom: 20, left: -20, pointerEvents: 'none' }} />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={styles.shopIcon}>
                                    <Store size={20} color="#000" />
                                </div>
                                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#fff', letterSpacing: 1, margin: '16px 0 8px' }}>
                                    Sell on<br />
                                    <span style={{ background: 'linear-gradient(135deg,#00e87b,#00c9a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                        IndoreMart.
                                    </span>
                                </h3>
                                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, marginBottom: 20 }}>
                                    Reach thousands of local customers. Start ur store today, no cap 🏪
                                </p>
                                {user.isShopOwner ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'rgba(0,232,123,0.1)', borderRadius: 12, border: '0.5px solid rgba(0,232,123,0.25)' }}>
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e87b', animation: 'pulse 2s infinite', flexShrink: 0 }} />
                                            <span style={{ fontSize: 13, color: '#00e87b', fontWeight: 500 }}>Your shop is active ✅</span>
                                        </div>
                                        <a
                                            href="/shop/dashboard"
                                            className="shop-btn"
                                            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                                        >
                                            <Store size={16} />
                                            Go to My Dashboard
                                        </a>
                                    </div>
                                ) : shopStatus ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'rgba(0,232,123,0.1)', borderRadius: 12, border: '0.5px solid rgba(0,232,123,0.25)' }}>
                                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e87b', animation: 'pulse 2s infinite', flexShrink: 0 }} />
                                        <span style={{ fontSize: 13, color: '#00e87b', fontWeight: 500 }}>Request sent! We'll hmu soon 🔥</span>
                                    </div>
                                ) : (
                                    <button
                                        className="shop-btn"
                                        onClick={() => {
                                            const modal = document.getElementById("shop-owner-modal")
                                            if (modal) modal.style.display = "flex"
                                        }}
                                    >
                                        Become a Shop Owner
                                        <ChevronRight size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="info-card" style={{ padding: 20 }}>
                            <p style={styles.infoLabel}>Quick Stats</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
                                {[
                                    { label: 'Total Orders', value: orders?.length ?? 0 },
                                    { label: 'Delivered', value: orders?.filter(o => o.status === 'delivered').length ?? 0 },
                                    { label: 'Pending', value: orders?.filter(o => o.status !== 'delivered').length ?? 0 },
                                ].map((stat, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: 13, color: '#666' }}>{stat.label}</span>
                                        <span style={{ fontSize: 16, fontWeight: 600, color: i === 0 ? '#fff' : i === 1 ? '#00e87b' : '#ffaa00' }}>{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <RequestShopOwner />
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
        display: 'flex', flexDirection: 'column', gap: 32,
    },
    header: {
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between',
        animation: 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
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
        fontSize: 'clamp(2rem, 8vw, 3.25rem)', color: '#fff', lineHeight: 1, letterSpacing: 1,
    },
    avatar: {
        width: 52, height: 52,
        background: 'linear-gradient(135deg,#00e87b,#00c9a0)',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, fontWeight: 600, color: '#000',
        flexShrink: 0,
    },
    cardHeader: {
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '14px 24px', borderBottom: '0.5px solid #1a1a1a', background: '#0d0d0d',
    },
    cardHeaderText: {
        fontSize: 12, fontWeight: 600, letterSpacing: '1px',
        textTransform: 'uppercase', color: '#666',
    },
    infoLabel: {
        fontSize: 10, fontWeight: 600, letterSpacing: '1.5px',
        textTransform: 'uppercase', color: '#444',
    },
    infoValue: { fontSize: 14, color: '#ccc', fontWeight: 400 },
    sectionTitle: {
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 26, color: '#fff', letterSpacing: 1,
    },
    tableHead: {
        fontSize: 10, fontWeight: 600, letterSpacing: '1.5px',
        textTransform: 'uppercase', color: '#444',
    },
    shopCard: {
        background: '#111', border: '0.5px solid #222',
        borderRadius: 20, padding: 24, position: 'relative', overflow: 'hidden',
    },
    shopIcon: {
        width: 44, height: 44,
        background: 'linear-gradient(135deg,#00e87b,#00c9a0)',
        borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
}