import { Plus, Search, Edit, Package, Trash2 } from 'lucide-react';
import ShopOwnerLayout from '../../components/shop/ShopOwnerLayout';
import { getAllProducts, productEdit, getMyShopDetails, resetEdit, deleteProduct } from '../../features/shop/shopSlice';
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
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const handleModal = () => setShowModal(v => !v)

    const handleProductEdit = (product) => {
        dispatch(productEdit(product))
        setShowModal(true)
    }

    const handleOpenAddModal = () => {
        dispatch(resetEdit())
        setShowModal(true)
    }

    const handleDeleteClick = (product) => setDeleteConfirm(product)

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm) return
        const result = await dispatch(deleteProduct(deleteConfirm._id))
        if (deleteProduct.fulfilled.match(result)) {
            toast.success(`"${deleteConfirm.name}" deleted!`, { position: 'top-center' })
        } else {
            toast.error(result.payload || 'Failed to delete', { position: 'top-center' })
        }
        setDeleteConfirm(null)
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
                .del-btn:hover { background: rgba(240,149,149,0.12) !important; color: #f09595 !important; border-color: rgba(240,149,149,0.3) !important; }
                @keyframes del-pop { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
                .del-modal-box { animation: del-pop 0.2s cubic-bezier(0.34,1.56,0.64,1) both; }
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
                    onClick={handleOpenAddModal}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg,#34d399,#059669)', color: '#030f07', fontWeight: 700, fontSize: '14px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'transform 0.2s, box-shadow 0.2s' }}
                >
                    <Plus style={{ width: '16px', height: '16px' }} />
                    Add Product
                </button>
            </div>

            {showModal && <AddProductModal showModal={showModal} handleModal={handleModal} />}

            {/* Delete Confirm Modal */}
            {deleteConfirm && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <div className="del-modal-box" style={{ background: '#0f1c16', border: '1px solid rgba(240,149,149,0.22)', borderRadius: '18px', padding: '32px 24px', maxWidth: '360px', width: '100%', textAlign: 'center' }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(240,149,149,0.1)', border: '1px solid rgba(240,149,149,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                            <Trash2 style={{ width: 24, height: 24, color: '#f09595' }} />
                        </div>
                        <h3 style={{ fontFamily: "'Syne',sans-serif", color: '#e7f6ee', fontSize: 20, fontWeight: 800, margin: '0 0 10px' }}>Delete Product?</h3>
                        <p style={{ color: '#7fa593', fontSize: 14, margin: '0 0 26px', lineHeight: 1.6 }}>
                            <strong style={{ color: '#e7f6ee' }}>"{deleteConfirm.name}"</strong> permanently delete ho jayega. Yeh undo nahi hoga!
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setDeleteConfirm(null)}
                                style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: '1px solid rgba(52,211,153,0.18)', background: 'transparent', color: '#7fa593', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
                            >Cancel</button>
                            <button onClick={handleDeleteConfirm}
                                style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#f09595,#e24b4a)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
                            >Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}

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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleProductEdit(product)}
                                                style={{ padding: '8px', borderRadius: '10px', border: `1px solid ${c.border}`, background: 'transparent', cursor: 'pointer', color: c.textMuted, display: 'flex', alignItems: 'center', transition: 'background 0.2s, color 0.2s' }}
                                            >
                                                <Edit style={{ width: '15px', height: '15px' }} />
                                            </button>
                                            <button
                                                className="del-btn"
                                                onClick={() => handleDeleteClick(product)}
                                                style={{ padding: '8px', borderRadius: '10px', border: `1px solid ${c.border}`, background: 'transparent', cursor: 'pointer', color: c.textMuted, display: 'flex', alignItems: 'center', transition: 'background 0.2s, color 0.2s, border-color 0.2s' }}
                                            >
                                                <Trash2 style={{ width: '15px', height: '15px' }} />
                                            </button>
                                        </div>
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
