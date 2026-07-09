import { Plus, Search, Edit, Package } from 'lucide-react';
import ShopOwnerLayout from '../../components/shop/ShopOwnerLayout';
import { getAllProducts, productEdit, getMyShopDetails } from '../../features/shop/shopSlice';
import { toast } from 'react-toastify';
import LoadingScreen from '../../components/LoadingScreen';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddProductModal from '../../components/shop/AddProductModal';

const c = {
    pageBg: '#070d09',
    cardBg: '#0f1c16',
    cardHeadBg: '#13241c',
    border: 'rgba(52,211,153,0.18)',
    borderSoft: 'rgba(52,211,153,0.1)',
    text: '#e7f6ee',
    textMuted: '#7fa593',
    textFaint: '#5a7a6a',
    emerald: '#34d399',
    emeraldBg: 'rgba(52,211,153,0.12)',
    inputBg: 'rgba(255,255,255,0.04)',
}

function ShopOwnerProducts() {
    const { shop, shopLoading, shopError, shopErrorMessage, shopProducts } = useSelector(state => state.shop)
    const dispatch = useDispatch()
    const [showModal, setShowModal] = useState(false)
    const [search, setSearch] = useState('')

    const handleModal = () => setShowModal(v => !v)

    const handleProductEdit = (product) => {
        dispatch(productEdit(product))
        setShowModal(true)
    }

    // Step 1: ensure shop details are loaded
    useEffect(() => {
        dispatch(getMyShopDetails())
    }, [])

    // Step 2: fetch products only after shop._id is available
    useEffect(() => {
        if (!shop?._id) return
        dispatch(getAllProducts())
    }, [shop?._id])

    useEffect(() => {
        if (shopError && shopErrorMessage) {
            toast.error(shopErrorMessage, { position: "top-center", toastId: 'shop-err' })
        }
    }, [shopError, shopErrorMessage])

    if (shopLoading && !shopProducts?.length) {
        return <LoadingScreen loadingMessage='Loading Products...' />
    }

    const filtered = shopProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    )

    const thStyle = {
        padding: '14px 20px',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: c.textFaint,
        textAlign: 'left',
        borderBottom: `1px solid ${c.border}`,
        background: c.cardHeadBg,
        whiteSpace: 'nowrap',
    }

    const tdStyle = {
        padding: '14px 20px',
        fontSize: '14px',
        color: c.text,
        borderBottom: `1px solid ${c.borderSoft}`,
        verticalAlign: 'middle',
    }

    return (
        <ShopOwnerLayout activePage="Products">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
                .prod-row:hover { background: rgba(52,211,153,0.04) !important; }
                .prod-search:focus { outline: none; border-color: rgba(52,211,153,0.5) !important; box-shadow: 0 0 0 3px rgba(52,211,153,0.08); }
                .prod-search::placeholder { color: ${c.textFaint}; }
                .add-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(52,211,153,0.3); }
                .edit-btn:hover { background: ${c.emeraldBg}; color: ${c.emerald}; }
            `}</style>

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
                    <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: c.textFaint }} />
                    <input
                        className="prod-search"
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', paddingLeft: '42px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', background: c.inputBg, border: `1px solid ${c.border}`, borderRadius: '12px', color: c.text, fontSize: '14px', fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.2s, box-shadow 0.2s' }}
                    />
                </div>
                <button
                    className="add-btn"
                    onClick={() => setShowModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg,#34d399,#059669)', color: '#030f07', fontWeight: 700, fontSize: '14px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'transform 0.2s, box-shadow 0.2s' }}
                >
                    <Plus style={{ width: '16px', height: '16px' }} />
                    Add Product
                </button>
            </div>

            {showModal && <AddProductModal showModal={showModal} handleModal={handleModal} />}

            {/* Table */}
            <div style={{ background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Image</th>
                                <th style={thStyle}>Product</th>
                                <th style={thStyle}>Category</th>
                                <th style={thStyle}>Price</th>
                                <th style={thStyle}>Stock</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', color: c.textFaint, padding: '40px 20px', borderBottom: 'none' }}>
                                        <Package style={{ width: '32px', height: '32px', margin: '0 auto 8px', color: c.textFaint }} />
                                        <p style={{ margin: 0 }}>{search ? 'No products match your search' : 'No products yet — add your first one!'}</p>
                                    </td>
                                </tr>
                            )}
                            {filtered.map((product, idx) => (
                                <tr key={product._id} className="prod-row" style={{ background: 'transparent', transition: 'background 0.15s' }}>
                                    <td style={{ ...tdStyle, borderBottom: idx === filtered.length - 1 ? 'none' : tdStyle.borderBottom }}>
                                        <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', background: c.emeraldBg, flexShrink: 0 }}>
                                            {product.productImage
                                                ? <img src={product.productImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package style={{ width: '22px', height: '22px', color: c.emerald }} /></div>
                                            }
                                        </div>
                                    </td>
                                    <td style={{ ...tdStyle, borderBottom: idx === filtered.length - 1 ? 'none' : tdStyle.borderBottom }}>
                                        <div style={{ fontWeight: 600, color: c.text }}>{product.name}</div>
                                        <div style={{ fontSize: '12px', color: c.textFaint, marginTop: '3px' }}>1 Pc</div>
                                    </td>
                                    <td style={{ ...tdStyle, borderBottom: idx === filtered.length - 1 ? 'none' : tdStyle.borderBottom }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '8px', background: c.emeraldBg, color: c.emerald, fontSize: '12px', fontWeight: 600 }}>
                                            {product.category}
                                        </span>
                                    </td>
                                    <td style={{ ...tdStyle, borderBottom: idx === filtered.length - 1 ? 'none' : tdStyle.borderBottom }}>
                                        <span style={{ fontWeight: 700, color: c.emerald, fontFamily: "'Syne', sans-serif" }}>₹{product.price}</span>
                                    </td>
                                    <td style={{ ...tdStyle, borderBottom: idx === filtered.length - 1 ? 'none' : tdStyle.borderBottom }}>
                                        <span style={{ color: product.stock < 5 ? '#fac775' : c.textMuted }}>{product.stock}</span>
                                    </td>
                                    <td style={{ ...tdStyle, borderBottom: idx === filtered.length - 1 ? 'none' : tdStyle.borderBottom }}>
                                        <span style={{
                                            display: 'inline-block', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                                            background: product.stock > 0 ? c.emeraldBg : 'rgba(226,75,74,0.1)',
                                            color: product.stock > 0 ? c.emerald : '#f09595',
                                            border: `1px solid ${product.stock > 0 ? 'rgba(52,211,153,0.3)' : 'rgba(226,75,74,0.3)'}`,
                                        }}>
                                            {product.stock > 0 ? 'Available' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td style={{ ...tdStyle, borderBottom: idx === filtered.length - 1 ? 'none' : tdStyle.borderBottom }}>
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleProductEdit(product)}
                                            style={{ padding: '8px', borderRadius: '10px', border: `1px solid ${c.border}`, background: 'transparent', cursor: 'pointer', color: c.textMuted, display: 'flex', alignItems: 'center', transition: 'background 0.2s, color 0.2s' }}
                                        >
                                            <Edit style={{ width: '15px', height: '15px' }} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer count */}
                <div style={{ padding: '14px 20px', borderTop: `1px solid ${c.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: c.textFaint }}>
                        Showing <strong style={{ color: c.textMuted }}>{filtered.length}</strong> of <strong style={{ color: c.textMuted }}>{shopProducts.length}</strong> products
                    </span>
                </div>
            </div>
        </ShopOwnerLayout>
    );
}

export default ShopOwnerProducts;
