import { Search, Eye, ShoppingBag } from 'lucide-react';
import ShopOwnerLayout from '../../components/shop/ShopOwnerLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getMyShopOrders, getMyShopDetails } from '../../features/shop/shopSlice';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import OrderDetailsModal from '../../components/shop/OrderDetailsModal';

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
    amber: '#fac775',
    amberBg: 'rgba(250,199,117,0.1)',
    amberBorder: 'rgba(250,199,117,0.3)',
    blue: '#85b7eb',
    blueBg: 'rgba(133,183,235,0.1)',
    blueBorder: 'rgba(133,183,235,0.3)',
    red: '#f09595',
    redBg: 'rgba(226,75,74,0.1)',
    redBorder: 'rgba(226,75,74,0.3)',
    greenBorder: 'rgba(52,211,153,0.3)',
    inputBg: 'rgba(255,255,255,0.04)',
}

const statusStyle = {
    placed: { color: c.amber, background: c.amberBg, border: `1px solid ${c.amberBorder}` },
    dispatched: { color: c.blue, background: c.blueBg, border: `1px solid ${c.blueBorder}` },
    delivered: { color: c.emerald, background: c.emeraldBg, border: `1px solid ${c.greenBorder}` },
    cancelled: { color: c.red, background: c.redBg, border: `1px solid ${c.redBorder}` },
}

function ShopOrders() {
    const { shop, shopLoading, shopError, shopErrorMessage, shopOrders } = useSelector(state => state.shop)
    const dispatch = useDispatch()
    const [showOrderDetails, setShowOrderDetails] = useState(false)
    const [orderDetails, setOrderDetails] = useState(null)
    const [search, setSearch] = useState('')

    const handleOrderDetails = (order) => {
        setOrderDetails(order)
        setShowOrderDetails(v => !v)
    }

    // Step 1: ensure shop is loaded
    useEffect(() => {
        dispatch(getMyShopDetails())
    }, [])

    // Step 2: fetch orders only after shop._id is available
    useEffect(() => {
        if (!shop?._id) return
        dispatch(getMyShopOrders())
    }, [shop?._id])

    useEffect(() => {
        if (shopError && shopErrorMessage) {
            toast.error(shopErrorMessage, { position: "top-center", toastId: 'shop-err' })
        }
    }, [shopError, shopErrorMessage])

    if (shopLoading && !shopOrders?.length) {
        return <LoadingScreen loadingMessage='Loading Orders...' />
    }

    const filtered = shopOrders.filter(o =>
        o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o._id.toLowerCase().includes(search.toLowerCase())
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
        <ShopOwnerLayout activePage="Orders">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
                .ord-row:hover { background: rgba(52,211,153,0.04) !important; }
                .ord-search:focus { outline: none; border-color: rgba(52,211,153,0.5) !important; box-shadow: 0 0 0 3px rgba(52,211,153,0.08); }
                .ord-search::placeholder { color: ${c.textFaint}; }
                .view-btn:hover { background: ${c.emeraldBg}; color: ${c.emerald}; }
            `}</style>

            {showOrderDetails && <OrderDetailsModal handleOrderDetails={handleOrderDetails} orderDetails={orderDetails} />}

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
                    <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: c.textFaint }} />
                    <input
                        className="ord-search"
                        type="text"
                        placeholder="Search by customer or order ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', paddingLeft: '42px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', background: c.inputBg, border: `1px solid ${c.border}`, borderRadius: '12px', color: c.text, fontSize: '14px', fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.2s, box-shadow 0.2s' }}
                    />
                </div>
                <div style={{ fontSize: '13px', color: c.textFaint }}>
                    Total: <strong style={{ color: c.textMuted }}>{shopOrders.length}</strong> orders
                </div>
            </div>

            {/* Table */}
            <div style={{ background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Order ID</th>
                                <th style={thStyle}>Customer</th>
                                <th style={thStyle}>Items</th>
                                <th style={thStyle}>Total</th>
                                <th style={thStyle}>Payment</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', color: c.textFaint, padding: '40px 20px', borderBottom: 'none' }}>
                                        <ShoppingBag style={{ width: '32px', height: '32px', margin: '0 auto 8px', color: c.textFaint }} />
                                        <p style={{ margin: 0 }}>{search ? 'No orders match your search' : 'No orders yet'}</p>
                                    </td>
                                </tr>
                            )}
                            {filtered.map((order, idx) => {
                                const ss = statusStyle[order.status] || statusStyle.placed
                                const isLast = idx === filtered.length - 1
                                return (
                                    <tr key={order._id} className="ord-row" style={{ background: 'transparent', transition: 'background 0.15s' }}>
                                        <td style={{ ...tdStyle, borderBottom: isLast ? 'none' : tdStyle.borderBottom }}>
                                            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: c.emerald, fontSize: '13px' }}>
                                                #{order._id.slice(0, 8).toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, borderBottom: isLast ? 'none' : tdStyle.borderBottom }}>
                                            <div style={{ fontWeight: 600, color: c.text }}>{order.user?.name}</div>
                                            <div style={{ fontSize: '12px', color: c.textFaint, marginTop: '2px' }}>{order.user?.email}</div>
                                        </td>
                                        <td style={{ ...tdStyle, borderBottom: isLast ? 'none' : tdStyle.borderBottom }}>
                                            <span style={{ color: c.textMuted }}>{order.products.length} item{order.products.length !== 1 ? 's' : ''}</span>
                                        </td>
                                        <td style={{ ...tdStyle, borderBottom: isLast ? 'none' : tdStyle.borderBottom }}>
                                            <span style={{ fontWeight: 700, color: c.emerald, fontFamily: "'Syne', sans-serif" }}>₹{order.totalBillAmount}</span>
                                        </td>
                                        <td style={{ ...tdStyle, borderBottom: isLast ? 'none' : tdStyle.borderBottom }}>
                                            <span style={{
                                                display: 'inline-block', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                                                ...(order.status === 'cancelled' ? { color: c.red, background: c.redBg, border: `1px solid ${c.redBorder}` } : { color: c.emerald, background: c.emeraldBg, border: `1px solid ${c.greenBorder}` })
                                            }}>
                                                {order.status === 'cancelled' ? 'Cancelled' : 'Paid'}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, borderBottom: isLast ? 'none' : tdStyle.borderBottom }}>
                                            <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, ...ss }}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, borderBottom: isLast ? 'none' : tdStyle.borderBottom }}>
                                            <button
                                                className="view-btn"
                                                onClick={() => handleOrderDetails(order)}
                                                style={{ padding: '8px', borderRadius: '10px', border: `1px solid ${c.border}`, background: 'transparent', cursor: 'pointer', color: c.textMuted, display: 'flex', alignItems: 'center', transition: 'background 0.2s, color 0.2s' }}
                                            >
                                                <Eye style={{ width: '15px', height: '15px' }} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div style={{ padding: '14px 20px', borderTop: `1px solid ${c.borderSoft}` }}>
                    <span style={{ fontSize: '13px', color: c.textFaint }}>
                        Showing <strong style={{ color: c.textMuted }}>{filtered.length}</strong> of <strong style={{ color: c.textMuted }}>{shopOrders.length}</strong> orders
                    </span>
                </div>
            </div>
        </ShopOwnerLayout>
    );
}

export default ShopOrders;
