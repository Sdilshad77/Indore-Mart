import { MapPin, Phone, Clock, Package, X } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { getProducts, getProductShops } from "../features/product/productSlice"
import LoadingScreen from "../components/LoadingScreen"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"

export default function AllShops() {
    const { productShops, productLoading, productError, productErrorMessage } = useSelector(state => state.product)
    const dispatch = useDispatch()
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("")
    const [visibleShops, setVisibleShops] = useState(6)
    const [searchParams, setSearchParams] = useSearchParams()
    const locationParam = searchParams.get('location') || ''

    // Fetch only once on mount
    useEffect(() => {
        dispatch(getProductShops())
        dispatch(getProducts())
    }, [])

    // Handle errors separately
    useEffect(() => {
        if (productError && productErrorMessage) toast.error(productErrorMessage)
    }, [productError, productErrorMessage])

    // Only show full LoadingScreen on first load
    if (productLoading && !productShops?.length) return <LoadingScreen />

    const filtered = [...(productShops || [])]
        .filter(s => search ? s.name?.toLowerCase().includes(search.toLowerCase()) : true)
        .sort((a, b) => sortBy === "products" ? (b.productCount ?? 0) - (a.productCount ?? 0) : 0)

    const visibleFiltered = filtered.slice(0, visibleShops)
    const hasMoreShops = visibleShops < filtered.length

    return (
        <div style={styles.wrap}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
                @keyframes blobFloat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
                @keyframes cardIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                .shop-card { background:#111; border:0.5px solid #1e1e1e; border-radius:20px; overflow:hidden; display:flex; flex-direction:column; transition:border-color 0.25s, transform 0.25s, box-shadow 0.25s; animation:cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
                .shop-card:hover { border-color:#00e87b; transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,232,123,0.1); }
                .visit-btn { display:block; width:100%; text-align:center; padding:12px; background:linear-gradient(135deg,#00e87b,#00c9a0); border:none; border-radius:12px; color:#000; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; cursor:pointer; text-decoration:none; transition:transform 0.2s, box-shadow 0.3s; margin-top:auto; }
                .visit-btn:hover { transform:translateY(-1px); box-shadow:0 8px 20px rgba(0,232,123,0.25); }
                .filter-select { background:#111; border:0.5px solid #222; border-radius:10px; padding:10px 32px 10px 14px; color:#888; font-family:'DM Sans',sans-serif; font-size:13px; outline:none; cursor:pointer; transition:border-color 0.2s; appearance:none; -webkit-appearance:none; }
                .filter-select:focus { border-color:#00e87b; color:#ccc; }
                .filter-select option { background:#111; }
                .search-input { background:#111; border:0.5px solid #222; border-radius:10px; padding:10px 16px; color:#ccc; font-family:'DM Sans',sans-serif; font-size:13px; outline:none; transition:border-color 0.25s, box-shadow 0.25s; width:220px; }
                .search-input::placeholder { color:#444; }
                .search-input:focus { border-color:#00e87b; box-shadow:0 0 0 3px rgba(0,232,123,0.08); }
                .load-btn { padding:12px 32px; background:transparent; border:0.5px solid #222; border-radius:12px; color:#888; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:border-color 0.2s, color 0.2s; }
                .load-btn:hover { border-color:#00e87b; color:#00e87b; }
                .shops-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:16px; }
                .footer-link { color:#444; font-size:13px; text-decoration:none; transition:color 0.2s; display:block; padding:3px 0; }
                .footer-link:hover { color:#00e87b; }
                @media(max-width:600px){ .shops-grid{grid-template-columns:1fr;} .filter-row{flex-direction:column !important;} .search-input{width:100%;} }
                @media(max-width:400px){ .shops-grid{grid-template-columns:1fr;gap:12px;} }
            `}</style>

            {/* BG Blobs */}
            <div style={{ ...styles.blob, width: 500, height: 500, background: '#00e87b', top: -150, right: -150, animation: 'blobFloat 10s ease-in-out infinite' }} />
            <div style={{ ...styles.blob, width: 300, height: 300, background: '#00c9a0', bottom: 200, left: -100, animation: 'blobFloat 13s ease-in-out infinite reverse' }} />

            <div style={styles.container}>
                {/* Header */}
                <header style={{ animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both', marginBottom: 36 }}>
                    <div style={styles.badge}>
                        <span style={styles.badgeDot} />
                        LOCAL STORES
                    </div>
                    <h1 style={styles.pageTitle}>
                        All{' '}
                        <span style={{ background: 'linear-gradient(135deg,#00e87b,#00c9a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Shops.
                        </span>
                    </h1>
                    <p style={{ color: '#555', fontSize: 14 }}>Browse trusted partner stores near u 🏪</p>

                    {/* Location banner */}
                    {locationParam && (
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            marginTop: 14, padding: '7px 14px', borderRadius: 30,
                            background: 'rgba(0,232,123,0.08)', border: '0.5px solid rgba(0,232,123,0.25)',
                            fontSize: 13, color: '#00e87b', fontWeight: 500,
                        }}>
                            <MapPin size={13} color="#00e87b" />
                            Showing stores near: <strong style={{ color: '#fff' }}>{locationParam}</strong>
                            <button
                                onClick={() => setSearchParams({})}
                                title="Clear location filter"
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#555', display: 'flex', alignItems: 'center',
                                    padding: 0, marginLeft: 4,
                                }}
                            >
                                <X size={13} />
                            </button>
                        </div>
                    )}
                </header>

                {/* Filters */}
                <div className="filter-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, gap: 12, flexWrap: 'wrap', animation: 'slideUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.05s both' }}>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="">Sort by</option>
                                <option value="rating">Highest Rating</option>
                                <option value="delivery">Fastest Delivery</option>
                                <option value="newest">Newest</option>
                                <option value="products">Most Products</option>
                            </select>
                            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#444', pointerEvents: 'none', fontSize: 10 }}>▼</span>
                        </div>
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Search shops..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {(search || sortBy) && (
                            <button
                                onClick={() => { setSearch(''); setSortBy(''); setVisibleShops(6) }}
                                style={{ background: 'rgba(0,232,123,0.08)', border: '0.5px solid rgba(0,232,123,0.25)', borderRadius: 8, padding: '8px 12px', color: '#00e87b', fontSize: 12, cursor: 'pointer' }}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    <span style={{ fontSize: 11, color: '#444', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
                        {filtered.length} shops
                    </span>
                </div>

                {/* Empty State */}
                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#333' }}>
                        <Package size={44} color="#1e1e1e" style={{ margin: '0 auto 16px' }} />
                        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1 }}>No shops found bestie 😭</p>
                    </div>
                )}

                {/* Shops Grid */}
                <div className="shops-grid">
                    {visibleFiltered.map((shop, idx) => (
                        <div key={shop._id} className="shop-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                            {/* Card Top Banner */}
                            <div style={{ height: 72, background: 'linear-gradient(135deg,rgba(0,232,123,0.08),rgba(0,201,160,0.04))', borderBottom: '0.5px solid #1a1a1a', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14 }}>
                                <div style={styles.shopIcon}>
                                    <Package size={18} color="#000" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 15, fontWeight: 500, color: '#ddd', lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {shop.name}
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                                        <span style={{ color: '#ffaa00', fontSize: 12 }}>★</span>
                                        <span style={{ fontSize: 11, fontWeight: 600, color: '#ccc' }}>5.0</span>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                                {shop.description && (
                                    <p style={{ fontSize: 12, color: '#444', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {shop.description}
                                    </p>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <div style={styles.infoRow}>
                                        <MapPin size={13} color="#00c9a0" style={{ flexShrink: 0 }} />
                                        <span style={styles.infoText}>{shop.address}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <Phone size={13} color="#00c9a0" style={{ flexShrink: 0 }} />
                                        <span style={styles.infoText}>{shop.shopPhone}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <Clock size={13} color="#00c9a0" style={{ flexShrink: 0 }} />
                                        <span style={styles.infoText}>24/7 Available</span>
                                    </div>
                                </div>

                                <Link to={`/marketplace/${shop._id}`} className="visit-btn" style={{ marginTop: 8 }}>
                                    Visit Shop →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 40 }}>
                    {hasMoreShops && (
                        <button
                            className="load-btn"
                            onClick={() => setVisibleShops(prev => prev + 6)}
                        >
                            Load More Shops ({filtered.length - visibleShops} remaining)
                        </button>
                    )}
                    {!hasMoreShops && filtered.length > 0 && (
                        <p style={{ fontSize: 12, color: '#333', letterSpacing: '1px' }}>✓ All {filtered.length} shops shown</p>
                    )}
                </div>
            </div>

        
        </div>
    )
}

const styles = {
    wrap: {
        minHeight: '100vh', background: '#0a0a0a',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative', overflow: 'hidden',
    },
    blob: {
        position: 'fixed', borderRadius: '50%',
        filter: 'blur(100px)', opacity: 0.1, pointerEvents: 'none', zIndex: 0,
    },
    container: {
        maxWidth: 1200, margin: '0 auto',
        padding: '2.5rem 2rem',
        position: 'relative', zIndex: 1,
        paddingBottom: '3rem',
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
    badgeDotSmall: {
        width: 5, height: 5, background: '#00e87b', borderRadius: '50%',
        display: 'inline-block', animation: 'pulse 2s infinite',
    },
    pageTitle: {
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 'clamp(2rem, 7vw, 3.25rem)', color: '#fff', lineHeight: 1, letterSpacing: 1, marginBottom: 6,
    },
    shopIcon: {
        width: 40, height: 40, flexShrink: 0,
        background: 'linear-gradient(135deg,#00e87b,#00c9a0)',
        borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    infoRow: { display: 'flex', alignItems: 'flex-start', gap: 8 },
    infoText: { fontSize: 12, color: '#555', lineHeight: 1.4 },
    footer: {
        background: '#080808', borderTop: '0.5px solid #1a1a1a',
        marginTop: 0, position: 'relative', zIndex: 1,
    },
    footerInner: {
        maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem 2rem',
    },
    footerHeading: {
        fontSize: 11, fontWeight: 600, letterSpacing: '1.5px',
        textTransform: 'uppercase', color: '#555', marginBottom: 14,
    },
}