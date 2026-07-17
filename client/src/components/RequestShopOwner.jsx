import { X, Store, Tag, MapPin, Phone, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { becomeShopOwner } from '../features/auth/authSlice'
import { toast } from 'react-toastify'
import LoadingScreen from './LoadingScreen'

const RequestShopOwner = () => {

    const { shopStatus, isLoading, isError, isSuccess, message } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        address: "",
        shopPhone: ""
    })

    const { name, description, address, shopPhone } = formData

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await dispatch(becomeShopOwner(formData))
        if (becomeShopOwner.fulfilled.match(result)) {
            toast.success("Shop Approval Request Sent! We'll review it soon 🔥", { position: "top-center" })
            const modal = document.getElementById("shop-owner-modal")
            if (modal) modal.style.display = "none"
        } else {
            toast.error(result.payload || "Request failed. Try again.", { position: "top-center" })
        }
    }

    useEffect(() => {
        if (isError && message) {
            toast.error(message, { position: "top-center" })
        }
    }, [isError, message])

    if (isLoading) return <LoadingScreen />

    return (
        <div
            id="shop-owner-modal"
            style={{ display: 'none', position: 'fixed', inset: 0, zIndex: 50, alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(6px)" }}
        >
            {/* Modal */}
            <div
                className="relative w-full max-w-md overflow-hidden"
                style={{
                    background: "#0d1117",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "20px",
                    fontFamily: "'Space Grotesk', sans-serif",
                    animation: "popIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both"
                }}
            >
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
                    @keyframes popIn {
                        from { transform: scale(0.92); opacity: 0; }
                        to   { transform: scale(1);    opacity: 1; }
                    }
                    .shop-input {
                        width: 100%;
                        background: rgba(255,255,255,0.04);
                        border: 1px solid rgba(255,255,255,0.08);
                        border-radius: 12px;
                        padding: 10px 14px 10px 38px;
                        font-size: 14px;
                        font-family: 'Space Grotesk', sans-serif;
                        color: #e2e8f0;
                        outline: none;
                        transition: border-color 0.15s, background 0.15s;
                    }
                    .shop-input::placeholder { color: #334155; }
                    .shop-input:focus {
                        border-color: rgba(16, 185, 129, 0.5);
                        background: rgba(16, 185, 129, 0.04);
                    }
                    .shop-textarea {
                        width: 100%;
                        background: rgba(255,255,255,0.04);
                        border: 1px solid rgba(255,255,255,0.08);
                        border-radius: 12px;
                        padding: 10px 14px;
                        font-size: 14px;
                        font-family: 'Space Grotesk', sans-serif;
                        color: #e2e8f0;
                        outline: none;
                        resize: none;
                        height: 76px;
                        transition: border-color 0.15s, background 0.15s;
                    }
                    .shop-textarea::placeholder { color: #334155; }
                    .shop-textarea:focus {
                        border-color: rgba(16, 185, 129, 0.5);
                        background: rgba(16, 185, 129, 0.04);
                    }
                `}</style>

                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 22px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.07)"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                            background: "rgba(16, 185, 129, 0.15)",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            borderRadius: "10px",
                            padding: "7px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#10b981"
                        }}>
                            <Store size={18} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.3px" }}>
                                Apply for Shop Ownership
                            </h2>
                            <p style={{ fontSize: "12px", color: "#64748b", marginTop: "1px" }}>
                                fr tho, start ur store today 🛒
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            const modal = document.getElementById("shop-owner-modal")
                            if (modal) modal.style.display = "none"
                        }}
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "8px",
                            width: "30px",
                            height: "30px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#64748b",
                            transition: "background 0.15s, color 0.15s"
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.1)"
                            e.currentTarget.style.color = "#f1f5f9"
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                            e.currentTarget.style.color = "#64748b"
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "14px" }}>

                        {/* Shop Name */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.6px", textTransform: "uppercase" }}>
                                Shop Name
                            </label>
                            <div style={{ position: "relative" }}>
                                <Tag size={14} style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#334155", pointerEvents: "none" }} />
                                <input
                                    className="shop-input"
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={handleChange}
                                    placeholder="e.g. Indore Sweets & Snacks"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.6px", textTransform: "uppercase" }}>
                                About ur shop
                            </label>
                            <textarea
                                className="shop-textarea"
                                name="description"
                                value={description}
                                onChange={handleChange}
                                placeholder="Tell us abt ur business, no cap..."
                            />
                        </div>

                        {/* Address + Phone row */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.6px", textTransform: "uppercase" }}>
                                    Address
                                </label>
                                <div style={{ position: "relative" }}>
                                    <MapPin size={14} style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#334155", pointerEvents: "none" }} />
                                    <input
                                        className="shop-input"
                                        type="text"
                                        name="address"
                                        value={address}
                                        onChange={handleChange}
                                        placeholder="Full address"
                                    />
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.6px", textTransform: "uppercase" }}>
                                    Phone
                                </label>
                                <div style={{ position: "relative" }}>
                                    <Phone size={14} style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#334155", pointerEvents: "none" }} />
                                    <input
                                        className="shop-input"
                                        type="tel"
                                        name="shopPhone"
                                        value={shopPhone}
                                        onChange={handleChange}
                                        placeholder="+91 00000 00000"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div style={{
                        padding: "16px 22px 20px",
                        borderTop: "1px solid rgba(255,255,255,0.07)",
                        display: "flex",
                        gap: "10px"
                    }}>
                        <button
                            type="button"
                            onClick={() => {
                                const modal = document.getElementById("shop-owner-modal")
                                if (modal) modal.style.display = "none"
                            }}
                            style={{
                                flex: 1,
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "12px",
                                padding: "10px",
                                fontSize: "13px",
                                fontWeight: 600,
                                fontFamily: "'Space Grotesk', sans-serif",
                                color: "#64748b",
                                cursor: "pointer",
                                transition: "background 0.15s, color 0.15s"
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.09)"
                                e.currentTarget.style.color = "#94a3b8"
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                                e.currentTarget.style.color = "#64748b"
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            style={{
                                flex: 2,
                                background: "#10b981",
                                border: "none",
                                borderRadius: "12px",
                                padding: "10px",
                                fontSize: "13px",
                                fontWeight: 700,
                                fontFamily: "'Space Grotesk', sans-serif",
                                color: "#022c22",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                transition: "background 0.15s, transform 0.1s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#0ea371"}
                            onMouseLeave={e => e.currentTarget.style.background = "#10b981"}
                            onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
                            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                        >
                            <Send size={14} />
                            Request Approval
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RequestShopOwner