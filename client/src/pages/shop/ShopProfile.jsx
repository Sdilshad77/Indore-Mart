import { MapPin, Phone, Mail, Store, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from "react-toastify"
import ShopOwnerLayout from '../../components/shop/ShopOwnerLayout';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getMyShopDetails } from '../../features/shop/shopSlice';

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
    amber: '#fac775',
    amberBg: 'rgba(250,199,117,0.1)',
    amberBorder: 'rgba(250,199,117,0.3)',
    red: '#f09595',
    redBg: 'rgba(226,75,74,0.1)',
    redBorder: 'rgba(226,75,74,0.3)',
    inputBg: 'rgba(255,255,255,0.03)',
}

const statusConfig = {
    approved: { color: c.emerald, bg: c.emeraldBg, border: c.greenBorder, icon: CheckCircle, label: 'Approved' },
    pending:  { color: c.amber,  bg: c.amberBg,   border: c.amberBorder,  icon: Clock,       label: 'Pending Approval' },
    rejected: { color: c.red,    bg: c.redBg,     border: c.redBorder,    icon: XCircle,     label: 'Rejected' },
}

function ShopProfile() {
    const { user } = useSelector(state => state.auth)
    const { shop, shopLoading, shopError, shopErrorMessage } = useSelector(state => state.shop)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getMyShopDetails())
    }, [])

    useEffect(() => {
        if (shopError && shopErrorMessage) {
            toast.error(shopErrorMessage, { position: "top-center", toastId: 'shop-err' })
        }
    }, [shopError, shopErrorMessage])

    const labelStyle = {
        display: 'block',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: c.textFaint,
        marginBottom: '8px',
    }

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        background: c.inputBg,
        border: `1px solid ${c.border}`,
        borderRadius: '12px',
        color: c.text,
        fontSize: '14px',
        fontFamily: "'DM Sans', sans-serif",
        outline: 'none',
        boxSizing: 'border-box',
        cursor: 'default',
    }

    const fieldRow = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
    }

    if (shopLoading || !shop?._id) return (
        <ShopOwnerLayout activePage="Shop Profile">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                <div style={{ textAlign: 'center', color: c.textFaint }}>
                    <Store style={{ width: '40px', height: '40px', margin: '0 auto 12px', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontSize: '15px' }}>Loading shop details...</p>
                </div>
            </div>
        </ShopOwnerLayout>
    )

    const status = shop.status?.toLowerCase() || 'pending'
    const sConf = statusConfig[status] || statusConfig.pending
    const StatusIcon = sConf.icon

    return (
        <ShopOwnerLayout activePage="Shop Profile">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
            `}</style>

            <div style={{ maxWidth: '720px' }}>

                {/* Status Banner */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', background: sConf.bg, border: `1px solid ${sConf.border}`, borderRadius: '14px', marginBottom: '24px' }}>
                    <StatusIcon style={{ width: '20px', height: '20px', color: sConf.color, flexShrink: 0 }} />
                    <div>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: sConf.color }}>{sConf.label}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: c.textFaint, marginTop: '2px' }}>
                            {status === 'approved' ? 'Your shop is live and visible to customers.' :
                             status === 'pending'  ? 'Your shop is under review by the admin.' :
                             'Your shop application was rejected. Please contact support.'}
                        </p>
                    </div>
                </div>

                {/* Shop Info Card */}
                <div style={{ background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: '20px', overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: `1px solid ${c.border}`, background: c.cardHeadBg, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Store style={{ width: '18px', height: '18px', color: c.emerald }} />
                        <div>
                            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: c.text }}>Shop Information</h2>
                            <p style={{ margin: 0, fontSize: '12px', color: c.textFaint, marginTop: '2px' }}>Your shop details (read-only)</p>
                        </div>
                    </div>

                    <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Shop Name */}
                        <div>
                            <label style={labelStyle}>Shop Name</label>
                            <input
                                type="text"
                                value={shop.name || ''}
                                readOnly
                                style={inputStyle}
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <MapPin style={{ width: '12px', height: '12px' }} />
                                Address
                            </label>
                            <input
                                type="text"
                                value={shop.address || ''}
                                readOnly
                                style={inputStyle}
                            />
                        </div>

                        {/* Phone + Email */}
                        <div style={fieldRow}>
                            <div>
                                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Phone style={{ width: '12px', height: '12px' }} />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={shop.shopPhone || ''}
                                    readOnly
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Mail style={{ width: '12px', height: '12px' }} />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    readOnly
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label style={labelStyle}>Description</label>
                            <textarea
                                rows={4}
                                readOnly
                                defaultValue={shop.description || ''}
                                style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
                                placeholder="No description provided."
                            />
                        </div>

                    </div>
                </div>
            </div>
        </ShopOwnerLayout>
    );
}

export default ShopProfile;
