import { Package, ShoppingBag, Tag, TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import ShopOwnerLayout from '../../components/shop/ShopOwnerLayout';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import LoadingScreen from '../../components/LoadingScreen';
import { getAllCoupons, getAllProducts, getMyShopDetails, getMyShopOrders } from '../../features/shop/shopSlice';

function ShopDashboard() {

    const { user } = useSelector(state => state.auth)
    const { shop, shopLoading, shopSuccess, shopError, shopErrorMessage, shopProducts, shopOrders, shopCoupons } = useSelector(state => state.shop)

    const dispatch = useDispatch()

    // Revenue
    const totalRevenue = shopOrders.reduce((acc, order) => acc + order.totalBillAmount, 0)

    // Step 1: fetch shop details once on mount
    useEffect(() => {
        dispatch(getMyShopDetails())
    }, [])

    // Step 2: fetch dependent data ONLY after shop._id is available
    // This prevents getAllProducts from firing before shopId exists
    useEffect(() => {
        if (!shop?._id) return
        dispatch(getAllProducts())
        dispatch(getMyShopOrders())
        dispatch(getAllCoupons())
    }, [shop?._id])

    // ── separate effect: show error toast with dedup id to prevent spam ──
    useEffect(() => {
        if (shopError && shopErrorMessage) {
            toast.error(shopErrorMessage, { position: "top-center", toastId: 'shop-err' })
        }
    }, [shopError, shopErrorMessage])

    const colors = {
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
        blue: '#85b7eb',
        blueBg: 'rgba(133,183,235,0.12)',
        amber: '#fac775',
        amberBg: 'rgba(250,199,117,0.12)',
        red: '#f09595',
        redBg: 'rgba(226,75,74,0.12)',
    };

    const statCardStyle = {
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        padding: '22px',
    };

    // Only show full loading screen on very first load
    if (shopLoading && !shop) {
        return <LoadingScreen loadingMessage='Shop Profile Loading...' />
    }

    return (
        <ShopOwnerLayout activePage="Dashboard">
            <div style={{ background: colors.pageBg, padding: '24px', borderRadius: '20px', fontFamily: "'DM Sans', sans-serif" }}>

                {/* STAT CARDS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>

                    <div style={statCardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                            <div style={{ padding: '10px', background: colors.emeraldBg, borderRadius: '10px' }}>
                                <Package style={{ width: '22px', height: '22px', color: colors.emerald }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: colors.emerald }}>
                                <TrendingUp style={{ width: '14px', height: '14px' }} />
                                <span>12%</span>
                            </div>
                        </div>
                        <div style={{ fontSize: '30px', fontWeight: 800, color: colors.text, fontFamily: "'Syne', sans-serif" }}>{shopProducts.length}</div>
                        <div style={{ fontSize: '13px', color: colors.textMuted, marginTop: '4px' }}>Total Products</div>
                    </div>

                    <div style={statCardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                            <div style={{ padding: '10px', background: colors.blueBg, borderRadius: '10px' }}>
                                <ShoppingBag style={{ width: '22px', height: '22px', color: colors.blue }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: colors.emerald }}>
                                <TrendingUp style={{ width: '14px', height: '14px' }} />
                                <span>8%</span>
                            </div>
                        </div>
                        <div style={{ fontSize: '30px', fontWeight: 800, color: colors.text, fontFamily: "'Syne', sans-serif" }}>{shopOrders.length}</div>
                        <div style={{ fontSize: '13px', color: colors.textMuted, marginTop: '4px' }}>Total Orders</div>
                    </div>

                    <div style={statCardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                            <div style={{ padding: '10px', background: colors.emeraldBg, borderRadius: '10px' }}>
                                <IndianRupee style={{ width: '22px', height: '22px', color: colors.emerald }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: colors.red }}>
                                <TrendingDown style={{ width: '14px', height: '14px' }} />
                                <span>3%</span>
                            </div>
                        </div>
                        <div style={{ fontSize: '30px', fontWeight: 800, color: colors.text, fontFamily: "'Syne', sans-serif" }}>₹{totalRevenue}</div>
                        <div style={{ fontSize: '13px', color: colors.textMuted, marginTop: '4px' }}>Today's Revenue</div>
                    </div>

                    <div style={statCardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                            <div style={{ padding: '10px', background: colors.amberBg, borderRadius: '10px' }}>
                                <Tag style={{ width: '22px', height: '22px', color: colors.amber }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: colors.emerald }}>
                                <TrendingUp style={{ width: '14px', height: '14px' }} />
                                <span>5%</span>
                            </div>
                        </div>
                        <div style={{ fontSize: '30px', fontWeight: 800, color: colors.text, fontFamily: "'Syne', sans-serif" }}>{shopCoupons.length}</div>
                        <div style={{ fontSize: '13px', color: colors.textMuted, marginTop: '4px' }}>Active Coupons</div>
                    </div>
                </div>

                {/* RECENT ORDERS + TOP PRODUCTS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>

                    {/* RECENT ORDERS */}
                    <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ background: colors.cardHeadBg, borderBottom: `1px solid ${colors.border}`, padding: '16px 20px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: colors.text }}>Recent Orders</h3>
                        </div>
                        <div style={{ padding: '8px 20px 4px' }}>
                            {shopOrders.length === 0 && (
                                <p style={{ color: colors.textFaint, fontSize: '14px', padding: '20px 0', textAlign: 'center' }}>No orders yet</p>
                            )}
                            {
                                shopOrders.map((order, idx) => (
                                    <div
                                        key={order._id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '14px 0',
                                            borderTop: idx === 0 ? 'none' : `1px solid ${colors.borderSoft}`,
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '14px', color: colors.text }}>
                                                #ORD-{order._id[0] + order._id[1] + order._id[2] + order._id[3]}
                                            </div>
                                            <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '2px' }}>{order.user.name}</div>
                                            <div style={{ fontSize: '12px', color: colors.textFaint }}>{order.user.email}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 700, fontSize: '14px', color: colors.emerald, fontFamily: "'Syne', sans-serif" }}>₹{order.totalBillAmount}</div>
                                            <div style={{ display: 'inline-block', padding: '4px 10px', fontSize: '11px', fontWeight: 600, background: colors.emeraldBg, color: colors.emerald, borderRadius: '999px', marginTop: '6px' }}>
                                                {order.status}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div style={{ height: '16px' }} />
                    </div>

                    {/* TOP SELLING PRODUCTS */}
                    <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ background: colors.cardHeadBg, borderBottom: `1px solid ${colors.border}`, padding: '16px 20px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: colors.text }}>Top Selling Products</h3>
                        </div>
                        <div style={{ padding: '8px 20px 4px' }}>
                            {shopProducts.length === 0 && (
                                <p style={{ color: colors.textFaint, fontSize: '14px', padding: '20px 0', textAlign: 'center' }}>No products yet</p>
                            )}
                            {shopProducts.slice(0, 5).map((product, idx) => (
                                <div
                                    key={product._id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        padding: '14px 0',
                                        borderTop: idx === 0 ? 'none' : `1px solid ${colors.borderSoft}`,
                                    }}
                                >
                                    <div style={{ width: '52px', height: '52px', background: colors.emeraldBg, borderRadius: '12px', flexShrink: 0, overflow: 'hidden' }}>
                                        {product.productImage
                                            ? <img src={product.productImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package style={{ width: '22px', height: '22px', color: colors.emerald }} /></div>
                                        }
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 500, fontSize: '14px', color: colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                                        <div style={{ fontSize: '12px', color: colors.textFaint, marginTop: '2px' }}>{product.category} · {product.stock} in stock</div>
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: '14px', color: colors.emerald, fontFamily: "'Syne', sans-serif", flexShrink: 0 }}>₹{product.price}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ height: '4px' }} />
                    </div>
                </div>
            </div>
        </ShopOwnerLayout>
    );
}

export default ShopDashboard;