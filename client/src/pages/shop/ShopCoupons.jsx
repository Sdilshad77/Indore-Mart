import { Plus, Search, Tag } from 'lucide-react';
import ShopOwnerLayout from '../../components/shop/ShopOwnerLayout';
import LoadingScreen from '../../components/LoadingScreen';
import { toast } from 'react-toastify';
import { getAllCoupons, getMyShopDetails } from '../../features/shop/shopSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import AddCouponModal from '../../components/shop/AddCouponModal';

const c = {
    cardBg: '#0f1c16',
    cardHeadBg: '#13241c',
    border: 'rgba(52,211,153,0.18)',
    borderSoft: 'rgba(52,211,153,0.1)',
    text: '#e7f6ee',
    textMuted: '#7fa593',
    textFaint: '#5a7a6a',
    emerald: '#34d399',
    emeraldBg: 'rgba(52,211,153,0.12)',
    greenBorder: 'rgba(52,211,153,0.3)',
    red: '#f09595',
    redBg: 'rgba(226,75,74,0.1)',
    redBorder: 'rgba(226,75,74,0.3)',
    inputBg: 'rgba(255,255,255,0.04)',
}

function ShopCoupons() {
    const [showModal, setShowModal] = useState(false)
    const [search, setSearch] = useState('')

    const { shop, shopLoading, shopError, shopErrorMessage, shopCoupons } = useSelector(state => state.shop)
    const dispatch = useDispatch()

    const handleModal = () => setShowModal(v => !v)

    // Step 1: ensure shop is loaded
    useEffect(() => {
        dispatch(getMyShopDetails())
    }, [])

    // Step 2: fetch coupons only after shop._id is available
    useEffect(() => {
        if (!shop?._id) return
        dispatch(getAllCoupons())
    }, [shop?._id])

    useEffect(() => {
        if (shopError && shopErrorMessage) {
            toast.error(shopErrorMessage, { position: "top-center", toastId: 'shop-err' })
        }
    }, [shopError, shopErrorMessage])

    if (shopLoading && !shopCoupons?.length) {
        return <LoadingScreen loadingMessage='Loading Coupons...' />
    }

    const filtered = shopCoupons.filter(cp =>
        cp.couponCode?.toLowerCase().includes(search.toLowerCase())
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
        <ShopOwnerLayout activePage="Coupons">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
                .coup-row:hover { background: rgba(52,211,153,0.04) !important; }
                .coup-search:focus { outline: none; border-color: rgba(52,211,153,0.5) !important; box-shadow: 0 0 0 3px rgba(52,211,153,0.08); }
                .coup-search::placeholder { color: ${c.textFaint}; }
                .add-coup-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(52,211,153,0.3); }
            `}</style>

            {showModal && <AddCouponModal showModal={showModal} handleModal={handleModal} />}

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
                    <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: c.textFaint }} />
                    <input
                        className="coup-search"
                        type="text"
                        placeholder="Search coupons..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', paddingLeft: '42px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', background: c.inputBg, border: `1px solid ${c.border}`, borderRadius: '12px', color: c.text, fontSize: '14px', fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.2s, box-shadow 0.2s' }}
                    />
                </div>
                <button
                    className="add-coup-btn"
                    onClick={handleModal}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg,#34d399,#059669)', color: '#030f07', fontWeight: 700, fontSize: '14px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'transform 0.2s, box-shadow 0.2s' }}
                >
                    <Plus style={{ width: '16px', height: '16px' }} />
                    Create Coupon
                </button>
            </div>

            {/* Table */}
            <div style={{ background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Coupon Code</th>
                                <th style={thStyle}>Discount</th>
                                <th style={thStyle}>Created At</th>
                                <th style={thStyle}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ ...tdStyle, textAlign: 'center', color: c.textFaint, padding: '40px 20px', borderBottom: 'none' }}>
                                        <Tag style={{ width: '32px', height: '32px', margin: '0 auto 8px', color: c.textFaint }} />
                                        <p style={{ margin: 0 }}>{search ? 'No coupons match your search' : 'No coupons yet — create your first one!'}</p>
                                    </td>
                                </tr>
                            )}
                            {filtered.map((coupon, idx) => {
                                const isLast = idx === filtered.length - 1
                                return (
                                    <tr key={coupon._id} className="coup-row" style={{ background: 'transparent', transition: 'background 0.15s' }}>
                                        <td style={{ ...tdStyle, borderBottom: isLast ? 'none' : tdStyle.borderBottom }}>
                                            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: c.emerald, fontSize: '15px', letterSpacing: '0.05em' }}>
                                                {coupon.couponCode}
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, borderBottom: isLast ? 'none' : tdStyle.borderBottom }}>
                                            <span style={{ fontWeight: 700, fontSize: '16px', color: c.emerald, fontFamily: "'Syne', sans-serif" }}>
                                                {coupon.couponDiscount}%
                                            </span>
                                            <span style={{ fontSize: '12px', color: c.textFaint, marginLeft: '6px' }}>off</span>
                                        </td>
                                        <td style={{ ...tdStyle, borderBottom: isLast ? 'none' : tdStyle.borderBottom }}>
                                            <span style={{ color: c.textMuted }}>
                                                {new Date(coupon.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, borderBottom: isLast ? 'none' : tdStyle.borderBottom }}>
                                            <span style={{
                                                display: 'inline-block', padding: '4px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                                                ...(coupon.isActive
                                                    ? { color: c.emerald, background: c.emeraldBg, border: `1px solid ${c.greenBorder}` }
                                                    : { color: c.red, background: c.redBg, border: `1px solid ${c.redBorder}` }
                                                )
                                            }}>
                                                {coupon.isActive ? 'Active' : 'Disabled'}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div style={{ padding: '14px 20px', borderTop: `1px solid ${c.borderSoft}` }}>
                    <span style={{ fontSize: '13px', color: c.textFaint }}>
                        <strong style={{ color: c.textMuted }}>{shopCoupons.length}</strong> coupon{shopCoupons.length !== 1 ? 's' : ''} total
                    </span>
                </div>
            </div>
        </ShopOwnerLayout>
    );
}

export default ShopCoupons;
