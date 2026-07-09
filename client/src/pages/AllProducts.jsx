import { ShoppingCart } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { getProducts } from "../features/product/productSlice"
import { toast } from "react-toastify"
import LoadingScreen from "../components/LoadingScreen"
import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"

export default function ProductsPage() {
    const { products, productLoading, productError, productErrorMessage } = useSelector(state => state.product)
    const dispatch = useDispatch()

    const [searchParams, setSearchParams] = useSearchParams()
    const [category, setCategory] = useState(searchParams.get('category') || '')
    const [sortBy, setSortBy] = useState('')
    const [visibleCount, setVisibleCount] = useState(8)

    // Sync category state when URL param changes (e.g. from Home category cards)
    useEffect(() => {
        const urlCat = searchParams.get('category') || ''
        setCategory(urlCat)
        setVisibleCount(8) // reset pagination on filter change
    }, [searchParams])

    // Reset pagination on sort/category change
    useEffect(() => {
        setVisibleCount(8)
    }, [sortBy, category])

    // Fetch only once on mount
    useEffect(() => {
        dispatch(getProducts())
    }, [])

    // Handle errors separately
    useEffect(() => {
        if (productError && productErrorMessage) toast.error(productErrorMessage)
    }, [productError, productErrorMessage])

    // Only show full LoadingScreen on first load
    if (productLoading && !products?.length) return <LoadingScreen />

    const filtered = [...(products || [])]
        .filter(p => category ? p.category?.toLowerCase() === category.toLowerCase() : true)
        .sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price
            if (sortBy === "price-high") return b.price - a.price
            return 0
        })

    const visible = filtered.slice(0, visibleCount)
    const hasMore = visibleCount < filtered.length

    return (
        <div style={styles.wrap}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
                @keyframes blobFloat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
                @keyframes cardIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                .product-card { background:#111; border:0.5px solid #1e1e1e; border-radius:18px; overflow:hidden; text-decoration:none; display:flex; flex-direction:column; transition:border-color 0.25s, transform 0.25s, box-shadow 0.25s; animation:cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
                .product-card:hover { border-color:#00e87b; transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,232,123,0.12); }
                .product-img { width:100%; aspect-ratio:1; object-fit:cover; transition:transform 0.4s; }
                .product-card:hover .product-img { transform:scale(1.06); }
                .view-btn { width:100%; padding:11px; background:transparent; border:0.5px solid #222; border-radius:10px; color:#888; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; text-align:center; text-decoration:none; display:block; transition:border-color 0.2s, color 0.2s, background 0.2s; }
                .view-btn:hover { border-color:#00e87b; color:#00e87b; background:rgba(0,232,123,0.05); }
                .filter-select { background:#111; border:0.5px solid #222; border-radius:10px; padding:10px 14px; color:#888; font-family:'DM Sans',sans-serif; font-size:13px; outline:none; cursor:pointer; transition:border-color 0.2s, color 0.2s; appearance:none; -webkit-appearance:none; padding-right:32px; }
                .filter-select:focus { border-color:#00e87b; color:#ccc; }
                .filter-select option { background:#111; }
                .load-btn { padding:12px 32px; background:transparent; border:0.5px solid #222; border-radius:12px; color:#888; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:border-color 0.2s, color 0.2s; }
                .load-btn:hover { border-color:#00e87b; color:#00e87b; }
                .products-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:16px; }
                @media(max-width:600px){ .products-grid{grid-template-columns:repeat(2,1fr);gap:10px;} .filter-row{flex-direction:column !important;align-items:flex-start !important;} }
            `}</style>

            {/* BG Blobs */}
            <div style={{ ...styles.blob, width: 500, height: 500, background: '#00e87b', top: -180, right: -180, animation: 'blobFloat 10s ease-in-out infinite' }} />
            <div style={{ ...styles.blob, width: 300, height: 300, background: '#00c9a0', bottom: 100, left: -100, animation: 'blobFloat 13s ease-in-out infinite reverse' }} />

            <div style={styles.container}>
                {/* Header */}
                <header style={{ animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both', marginBottom: 36 }}>
                    <div style={styles.badge}>
                        <span style={styles.badgeDot} />
                        FRESH DROPS
                    </div>
                    <h1 style={styles.pageTitle}>
                        All{' '}
                        <span style={{ background: 'linear-gradient(135deg,#00e87b,#00c9a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Products.
                        </span>
                    </h1>
                    <p style={{ color: '#555', fontSize: 14 }}>Fresh drops from trusted local shops 🏪</p>
                </header>

                {/* Filters Row */}
                <div className="filter-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, gap: 12, flexWrap: 'wrap', animation: 'slideUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.05s both' }}>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', position: 'relative' }}>
                        <div style={{ position: 'relative' }}>
                            <select
                                className="filter-select"
                                value={category}
                                onChange={e => {
                                    const val = e.target.value
                                    setCategory(val)
                                    if (val) setSearchParams({ category: val })
                                    else setSearchParams({})
                                }}
                            >
                                <option value="">All Categories</option>
                                <option value="fruits">Fruits</option>
                                <option value="vegetables">Vegetables</option>
                                <option value="dairy">Dairy &amp; Eggs</option>
                                <option value="bakery">Bakery</option>
                                <option value="cloths">Cloths</option>
                                <option value="other">Other</option>
                            </select>
                            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#444', pointerEvents: 'none', fontSize: 10 }}>▼</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="">Sort by</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="newest">Newest</option>
                            </select>
                            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#444', pointerEvents: 'none', fontSize: 10 }}>▼</span>
                        </div>
                    </div>
                    <span style={{ fontSize: 11, color: '#444', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
                        {filtered.length} products
                    </span>
                </div>

                {/* Empty State */}
                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#333' }}>
                        <ShoppingCart size={44} color="#1e1e1e" style={{ margin: '0 auto 16px' }} />
                        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1 }}>No products found bestie 😭</p>
                    </div>
                )}

                {/* Products Grid */}
                <div className="products-grid">
                    {visible.map((product, idx) => (
                        <Link
                            to={`/products/${product._id}`}
                            key={product._id}
                            className="product-card"
                            style={{ animationDelay: `${idx * 0.04}s` }}
                        >
                            {/* Image */}
                            <div style={{ position: 'relative', overflow: 'hidden', background: '#0d0d0d' }}>
                                <img
                                    className="product-img"
                                    src={product.productImage || "/placeholder.svg"}
                                    alt={product.name}
                                />
                                {product.stock <= 5 && (
                                    <div style={styles.lowStockBadge}>Low Stock</div>
                                )}
                            </div>

                            {/* Info */}
                            <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: '#00c9a0' }}>
                                    {product.shop?.name}
                                </p>
                                <h3 style={{ fontSize: 14, fontWeight: 500, color: '#ddd', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {product.name}
                                </h3>
                                <p style={{ fontSize: 11, color: '#444' }}>{product.category}</p>

                                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 12 }}>
                                    <div>
                                        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#fff', letterSpacing: 0.5 }}>₹{product.price}</p>
                                        <p style={{ fontSize: 10, color: '#444', marginTop: 1 }}>{product.stock} in stock</p>
                                    </div>
                                </div>

                                <span className="view-btn" style={{ marginTop: 12 }}>
                                    View Product →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Load More */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 40 }}>
                    {hasMore && (
                        <button
                            className="load-btn"
                            onClick={() => setVisibleCount(prev => prev + 8)}
                        >
                            Load More Products ({filtered.length - visibleCount} remaining)
                        </button>
                    )}
                    {!hasMore && filtered.length > 0 && (
                        <p style={{ fontSize: 12, color: '#333', letterSpacing: '1px' }}>✓ All {filtered.length} products loaded</p>
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
        paddingBottom: '4rem',
    },
    blob: {
        position: 'fixed', borderRadius: '50%',
        filter: 'blur(100px)', opacity: 0.1, pointerEvents: 'none', zIndex: 0,
    },
    container: {
        maxWidth: 1200, margin: '0 auto',
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
    lowStockBadge: {
        position: 'absolute', top: 10, right: 10,
        background: 'rgba(255,68,68,0.15)', border: '0.5px solid rgba(255,68,68,0.3)',
        color: '#ff4444', fontSize: 10, fontWeight: 600, letterSpacing: '0.5px',
        padding: '3px 8px', borderRadius: 20,
    },
}