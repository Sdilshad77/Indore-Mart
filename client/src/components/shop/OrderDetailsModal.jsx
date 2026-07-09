import { X, Package, CreditCard, MapPin, Phone, Mail, User, IdCard, Truck, Ban, CheckCircle2 } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux"
import { updateOrder } from '../../features/shop/shopSlice';
import LoadingScreen from '../LoadingScreen';
import { cancelOrder } from '../../features/auth/authSlice';
import { useEffect } from 'react';

function OrderDetailsModal({ handleOrderDetails, orderDetails }) {

    const { user } = useSelector(state => state.auth)

    const dispatch = useDispatch()

    // Lock background scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    const handleOrderUpdate = (orderDetails) => {

        if (user.isShopOwner) {
            dispatch(updateOrder(orderDetails))
        } else {
            dispatch(cancelOrder(orderDetails))
        }

        handleOrderDetails(null)
    }

    const orderData = {
        orderId: orderDetails?._id,
        orderDate: new Date(orderDetails?.createdAt).toLocaleDateString('en-IN'),
        status: orderDetails?.status,
        paymentStatus: orderDetails?.status === "cancelled" ? "Cancelled" : 'paid',
        customer: {
            name: orderDetails?.user.name,
            email: orderDetails?.user.email,
            phone: orderDetails?.user.phone,
            address: orderDetails?.user.address
        },
        items: orderDetails?.products,
        subtotal: orderDetails?.products.reduce((acc, product) => acc + product.purchasedPrice * product.qty, 0),
        discount: orderDetails?.products.reduce((acc, product) => acc + product.purchasedPrice * product.qty, 0) - orderDetails?.totalBillAmount
    };




    // ── inline style tokens (do NOT depend on Tailwind config / purge) ──
    const colors = {
        modalBg: '#070d09',
        headerBg: '#0a1410',
        cardBg: '#0f1c16',
        cardHeadBg: '#13241c',
        border: 'rgba(52,211,153,0.22)',
        borderSoft: 'rgba(52,211,153,0.12)',
        text: '#e7f6ee',
        textMuted: '#7fa593',
        textFaint: '#5a7a6a',
        emerald: '#34d399',
        emeraldDark: '#0d1f17',
        amber: '#fac775',
        amberBg: 'rgba(250,199,117,0.1)',
        amberBorder: 'rgba(250,199,117,0.35)',
        blue: '#85b7eb',
        blueBg: 'rgba(133,183,235,0.1)',
        blueBorder: 'rgba(133,183,235,0.3)',
        red: '#f09595',
        redBg: 'rgba(226,75,74,0.1)',
        redBorder: 'rgba(226,75,74,0.3)',
        greenBg: 'rgba(52,211,153,0.1)',
        greenBorder: 'rgba(52,211,153,0.35)',
    };

    const statusStyles = {
        pending: { color: colors.amber, background: colors.amberBg, borderColor: colors.amberBorder },
        dispatched: { color: colors.blue, background: colors.blueBg, borderColor: colors.blueBorder },
        cancelled: { color: colors.red, background: colors.redBg, borderColor: colors.redBorder },
        delivered: { color: colors.emerald, background: colors.greenBg, borderColor: colors.greenBorder },
    };

    const getStatusBadgeStyle = (status) => statusStyles[status] || statusStyles.pending;

    const getPaymentBadgeStyle = (status) =>
        status === 'paid'
            ? { color: colors.emerald, background: colors.greenBg, borderColor: colors.greenBorder }
            : { color: colors.red, background: colors.redBg, borderColor: colors.redBorder };

    const cardStyle = {
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: '14px',
        overflow: 'hidden',
        marginBottom: '20px',
    };

    const cardHeadStyle = {
        background: colors.cardHeadBg,
        borderBottom: `1px solid ${colors.border}`,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    };

    const badgeBase = {
        padding: '5px 14px',
        borderRadius: '999px',
        fontSize: '13px',
        fontWeight: 600,
        border: '1px solid',
        display: 'inline-block',
    };

    if (!orderDetails) {
        return (
            <LoadingScreen />
        )
    }

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '880px', maxHeight: '90vh', background: colors.modalBg, border: `1px solid ${colors.border}`, borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                {/* HEADER */}
                <div style={{ flexShrink: 0, background: colors.headerBg, borderBottom: `1px solid ${colors.border}`, padding: '20px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: colors.emerald, fontFamily: "'Syne', sans-serif" }}>
                            Order Details
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: colors.emerald }}>{orderData.orderId}</span>
                            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: colors.textFaint }}></span>
                            <span style={{ fontSize: '13px', color: colors.textMuted }}>{orderData.orderDate}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleOrderDetails}
                        aria-label="Close modal"
                        style={{ width: '36px', height: '36px', borderRadius: '10px', border: `1px solid ${colors.border}`, background: colors.emeraldDark, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <X style={{ width: '18px', height: '18px', color: colors.emerald }} />
                    </button>
                </div>

                {/* BODY */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: colors.modalBg, overscrollBehavior: 'contain' }}>

                    {/* CUSTOMER DETAILS */}
                    <div style={cardStyle}>
                        <div style={cardHeadStyle}>
                            <User style={{ width: '16px', height: '16px', color: colors.emerald }} />
                            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: colors.text }}>Customer Details</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <IdCard style={{ width: '15px', height: '15px', color: colors.textMuted, marginTop: '2px', flexShrink: 0 }} />
                                    <div>
                                        <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: colors.textFaint, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Full Name</p>
                                        <p style={{ margin: 0, fontSize: '14px', color: colors.text }}>{orderData.customer.name}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Mail style={{ width: '15px', height: '15px', color: colors.textMuted, marginTop: '2px', flexShrink: 0 }} />
                                    <div>
                                        <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: colors.textFaint, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Email</p>
                                        <p style={{ margin: 0, fontSize: '14px', color: colors.text }}>{orderData.customer.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Phone style={{ width: '15px', height: '15px', color: colors.textMuted, marginTop: '2px', flexShrink: 0 }} />
                                    <div>
                                        <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: colors.textFaint, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Phone</p>
                                        <p style={{ margin: 0, fontSize: '14px', color: colors.text }}>{orderData.customer.phone}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <MapPin style={{ width: '15px', height: '15px', color: colors.textMuted, marginTop: '2px', flexShrink: 0 }} />
                                    <div>
                                        <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: colors.textFaint, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Delivery Address</p>
                                        <p style={{ margin: 0, fontSize: '14px', color: colors.text, lineHeight: 1.5 }}>{orderData.customer.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ORDER ITEMS */}
                    <div style={cardStyle}>
                        <div style={cardHeadStyle}>
                            <Package style={{ width: '16px', height: '16px', color: colors.emerald }} />
                            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: colors.text }}>Order Items</h3>
                        </div>
                        <div>
                            {orderData?.items.map((item, idx) => (
                                <div
                                    key={item.product._id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '16px',
                                        padding: '14px 20px',
                                        borderTop: idx === 0 ? 'none' : `1px solid ${colors.borderSoft}`,
                                    }}
                                >
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</p>
                                        <p style={{ margin: 0, fontSize: '12px', color: colors.textFaint, marginTop: '4px' }}>Quantity: {item.qty}</p>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: colors.emerald, fontFamily: "'Syne', sans-serif" }}>₹{item.product.price * item.qty}</p>
                                        <p style={{ margin: 0, fontSize: '11px', color: colors.textFaint, marginTop: '4px' }}>₹{item.product.price} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PAYMENT SUMMARY */}
                    <div style={cardStyle}>
                        <div style={cardHeadStyle}>
                            <CreditCard style={{ width: '16px', height: '16px', color: colors.emerald }} />
                            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: colors.text }}>Payment Summary</h3>
                        </div>
                        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: colors.textMuted }}>Subtotal</span>
                                <span style={{ fontWeight: 500, color: colors.text }}>₹{orderData.subtotal}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: colors.emerald }}>Discount</span>
                                <span style={{ fontWeight: 500, color: colors.emerald }}>−₹{orderData.discount}</span>
                            </div>
                            <div style={{ paddingTop: '12px', borderTop: `1px solid ${colors.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '15px', fontWeight: 600, color: colors.text }}>Total Amount</span>
                                <span style={{ fontSize: '22px', fontWeight: 800, color: colors.emerald, fontFamily: "'Syne', sans-serif" }}>
                                    ₹{orderData.subtotal - orderData.discount}
                                </span>
                            </div>
                            <div style={{ paddingTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '14px', color: colors.textMuted }}>Payment Status</span>
                                <span style={{ ...badgeBase, ...getPaymentBadgeStyle(orderData.paymentStatus) }}>
                                    {orderData.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ORDER STATUS */}
                    <div style={{ ...cardStyle, marginBottom: 0 }}>
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: colors.text }}>Order Status</h3>
                                <span style={{ ...badgeBase, padding: '7px 18px', fontSize: '14px', ...getStatusBadgeStyle(orderData.status) }}>
                                    {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                                </span>
                            </div>

                            {orderData.status === 'placed' && (
                                <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                                    {
                                        user.isShopOwner && (
                                            <button
                                                onClick={() => handleOrderUpdate({ id: orderData.orderId, status: "dispatched" })}
                                                style={{ flex: 1, minWidth: '160px', padding: '13px 24px', background: colors.emerald, color: '#030f07', fontWeight: 600, fontSize: '14px', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
                                            >
                                                Dispatch Order
                                            </button>
                                        )
                                    }
                                    <button
                                        onClick={() => handleOrderUpdate({ id: orderData.orderId, status: "cancelled" })}
                                        style={{ flex: 1, minWidth: '160px', padding: '13px 24px', background: colors.redBg, color: colors.red, fontWeight: 600, fontSize: '14px', border: `1px solid ${colors.redBorder}`, borderRadius: '12px', cursor: 'pointer' }}
                                    >
                                        Cancel Order
                                    </button>
                                </div>
                            )}

                            {
                                user.isShopOwner && orderData.status === 'dispatched' && (
                                    <div style={{ marginTop: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: colors.blueBg, border: `1px solid ${colors.blueBorder}`, borderRadius: '12px', marginBottom: '12px' }}>
                                            <Truck style={{ width: '20px', height: '20px', color: colors.blue, flexShrink: 0 }} />
                                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: colors.blue }}>Order already dispatched</p>
                                        </div>
                                        <button
                                            onClick={() => handleOrderUpdate({ id: orderData.orderId, status: "delivered" })}
                                            style={{ width: '100%', padding: '13px 24px', background: colors.emerald, color: '#030f07', fontWeight: 600, fontSize: '14px', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
                                        >
                                            Mark As Delivered
                                        </button>
                                    </div>
                                )
                            }

                            {orderData.status === 'cancelled' && (
                                <div style={{ marginTop: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: colors.redBg, border: `1px solid ${colors.redBorder}`, borderRadius: '12px' }}>
                                        <Ban style={{ width: '20px', height: '20px', color: colors.red, flexShrink: 0 }} />
                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: colors.red }}>Order cancelled</p>
                                    </div>
                                </div>
                            )}

                            {orderData.status === 'delivered' && (
                                <div style={{ marginTop: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: colors.greenBg, border: `1px solid ${colors.greenBorder}`, borderRadius: '12px' }}>
                                        <CheckCircle2 style={{ width: '20px', height: '20px', color: colors.emerald, flexShrink: 0 }} />
                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: colors.emerald }}>Order successfully delivered</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetailsModal;