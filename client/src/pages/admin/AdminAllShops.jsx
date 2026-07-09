import { toast } from "react-toastify";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { getAllShops, shopUpdate } from "../../features/admin/adminSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Store, MapPin, Filter, StoreIcon, Power, PowerOff } from "lucide-react";

/* ─── Admin Shops · Dark glass · emerald neon ────────────────────────────
   Matches the IndoreMart theme: Syne headings, DM Sans body,
   glass cards, emerald accent, subtle motion.
   ─────────────────────────────────────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .as-shell {
    font-family: 'DM Sans', sans-serif;
    background: #09090d;
    color: #e8e8f0;
    height: 100vh;
    display: flex;
    overflow: hidden;
  }

  .as-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; }

  .as-main::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(52,211,153,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(52,211,153,0.035) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: radial-gradient(ellipse 70% 60% at 30% 0%, black 20%, transparent 85%);
  }

  .as-content { position: relative; z-index: 1; overflow-y: auto; flex: 1; padding: 2.25rem 2.5rem 3rem; }

  /* ── header row ── */
  .as-head {
    display: flex; align-items: flex-end; justify-content: space-between;
    flex-wrap: wrap; gap: 1rem; margin-bottom: 1.75rem;
    animation: as-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
  .as-eyebrow {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: #34d399; margin-bottom: 0.4rem;
    display: flex; align-items: center; gap: 0.4rem;
  }
  .as-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #34d399;
    box-shadow: 0 0 8px #34d399; animation: as-blink 1.8s ease-in-out infinite;
  }
  @keyframes as-blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

  .as-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(1.5rem, 2.6vw, 2rem); letter-spacing: -0.03em; color: #f0f0f5;
  }
  .as-title em {
    font-style: normal;
    background: linear-gradient(90deg, #34d399, #6ee7b7);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .as-sub { font-size: 0.85rem; color: rgba(200,220,210,0.42); margin-top: 0.3rem; }

  /* ── filter ── */
  .as-filter-field { position: relative; display: flex; align-items: center; }
  .as-filter-icon { position: absolute; left: 0.75rem; color: rgba(52,211,153,0.55); pointer-events: none; }
  .as-select {
    appearance: none;
    padding: 0.62rem 0.9rem 0.62rem 2.35rem;
    border-radius: 11px; background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09); color: #e8e8f0;
    font-family: 'DM Sans', sans-serif; font-size: 0.83rem; font-weight: 500;
    outline: none; cursor: pointer;
    transition: border-color 0.22s ease, background 0.22s ease;
  }
  .as-select:hover { border-color: rgba(52,211,153,0.3); }
  .as-select:focus { border-color: rgba(52,211,153,0.4); background: rgba(52,211,153,0.05); }

  /* ── stat strip ── */
  .as-stats {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.9rem;
    margin-bottom: 1.75rem;
    animation: as-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.08s both;
  }
  @media(max-width: 900px){ .as-stats{ grid-template-columns: repeat(2,1fr); } }
  .as-stat-card {
    padding: 1.05rem 1.15rem; border-radius: 14px;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    transition: border-color 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .as-stat-card:hover { border-color: rgba(52,211,153,0.2); transform: translateY(-3px); }
  .as-stat-num { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.4rem; color: #f0f0f5; letter-spacing: -0.02em; }
  .as-stat-lbl { font-size: 0.73rem; color: rgba(200,220,210,0.42); margin-top: 0.2rem; }
  .as-stat-card.accent .as-stat-num { color: #34d399; }

  /* ── table card ── */
  .as-table-card {
    border-radius: 18px; overflow: hidden;
    background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
    animation: as-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s both;
  }
  .as-table-scroll { overflow-x: auto; }
  table.as-table { width: 100%; border-collapse: collapse; }

  .as-table thead th {
    text-align: left; padding: 0.9rem 1.3rem;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase;
    color: rgba(180,220,200,0.45);
    background: rgba(255,255,255,0.025);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    white-space: nowrap;
  }

  .as-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.045);
    transition: background 0.2s ease;
  }
  .as-table tbody tr:last-child { border-bottom: none; }
  .as-table tbody tr:hover { background: rgba(52,211,153,0.035); }

  .as-table td { padding: 1rem 1.3rem; font-size: 0.85rem; color: #d8dce4; white-space: nowrap; }

  .as-shop-cell { display: flex; align-items: center; gap: 0.6rem; }
  .as-shop-icon {
    width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
    background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.2);
    display: flex; align-items: center; justify-content: center;
  }
  .as-shop-name { color: #f0f0f5; font-weight: 700; font-family: 'Syne', sans-serif; font-size: 0.87rem; }
  .as-owner { color: rgba(200,220,210,0.6); }
  .as-location { display: flex; align-items: center; gap: 0.35rem; color: rgba(200,220,210,0.5); }

  .as-pill {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.28rem 0.7rem; border-radius: 999px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.03em;
  }
  .as-pill-dot { width: 5px; height: 5px; border-radius: 50%; }
  .as-pill.accepted { background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.22); }
  .as-pill.accepted .as-pill-dot { background: #34d399; }
  .as-pill.rejected { background: rgba(244,63,94,0.1); color: #fb7185; border: 1px solid rgba(244,63,94,0.22); }
  .as-pill.rejected .as-pill-dot { background: #fb7185; }
  .as-pill.pending { background: rgba(245,158,11,0.1); color: #fbbf24; border: 1px solid rgba(245,158,11,0.22); }
  .as-pill.pending .as-pill-dot { background: #fbbf24; }

  .as-date-cell { color: rgba(200,220,210,0.45); font-size: 0.82rem; }

  .as-action-btn {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.42rem 0.85rem; border-radius: 9px;
    font-size: 0.75rem; font-weight: 700; cursor: pointer;
    border: 1px solid transparent; background: none;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.2s ease, border-color 0.2s ease;
  }
  .as-action-btn:hover { transform: scale(1.05); }
  .as-action-btn.disable { color: #fb7185; background: rgba(244,63,94,0.08); border-color: rgba(244,63,94,0.2); }
  .as-action-btn.disable:hover { background: rgba(244,63,94,0.16); }
  .as-action-btn.activate { color: #34d399; background: rgba(52,211,153,0.08); border-color: rgba(52,211,153,0.2); }
  .as-action-btn.activate:hover { background: rgba(52,211,153,0.16); }

  /* ── empty state ── */
  .as-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 0.9rem; padding: 4.5rem 2rem; text-align: center;
  }
  .as-empty-icon {
    width: 56px; height: 56px; border-radius: 16px;
    background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.18);
    display: flex; align-items: center; justify-content: center;
  }
  .as-empty-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.1rem; color: #f0f0f5; }
  .as-empty-sub { font-size: 0.85rem; color: rgba(200,220,210,0.4); max-width: 320px; }

  /* ── loading ── */
  .as-loading-wrap {
    height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center;
    background: #09090d;
  }
  .as-loading-ring {
    width: 42px; height: 42px; border-radius: 50%;
    border: 3px solid rgba(52,211,153,0.15); border-top-color: #34d399;
    animation: as-spin 0.85s linear infinite;
  }
  @keyframes as-spin { to { transform: rotate(360deg); } }

  @keyframes as-fade-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
`

const STATUS_OPTIONS = ["All Status", "pending", "accepted", "rejected"]

function AdminAllShops() {

    const { user } = useSelector(state => state.auth)
    const { adminLoading, adminError, adminErrorMessage, allShops } = useSelector(state => state.admin)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [statusFilter, setStatusFilter] = useState("All Status")

    const handleShopUpdate = (shopDetails) => {
        dispatch(shopUpdate(shopDetails))
    }

    useEffect(() => {

        if (user?.isAdmin) {
            dispatch(getAllShops())
        }

        if (!user?.isAdmin || !user) {
            navigate("/login")
        }

        if (adminError && adminErrorMessage) {
            toast.error(adminErrorMessage, { position: "top-center" })
        }

    }, [user, adminError, adminErrorMessage])

    if (adminLoading) {
        return (
            <div className="as-loading-wrap">
                <style>{css}</style>
                <div className="as-loading-ring" />
            </div>
        )
    }

    const shops = allShops ?? []
    const filteredShops = statusFilter === "All Status"
        ? shops
        : shops.filter(shop => shop.status === statusFilter)

    const acceptedCount = shops.filter(s => s.status === "accepted").length
    const pendingCount = shops.filter(s => s.status === "pending").length
    const rejectedCount = shops.filter(s => s.status === "rejected").length

    return (
        <div className="as-shell">
            <style>{css}</style>
            <AdminSidebar />

            <div className="as-main">
                <AdminHeader />

                <div className="as-content">
                    <div className="as-head">
                        <div>
                            <div className="as-eyebrow"><span className="as-eyebrow-dot" />Marketplace</div>
                            <div className="as-title">All <em>Shops</em></div>
                            <div className="as-sub">{shops.length} registered shops on the platform</div>
                        </div>

                        <div className="as-filter-field">
                            <Filter size={14} className="as-filter-icon" />
                            <select
                                className="as-select"
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                            >
                                {STATUS_OPTIONS.map(opt => (
                                    <option key={opt} value={opt} style={{ background: "#0d0d13" }}>
                                        {opt === "All Status" ? opt : opt.charAt(0).toUpperCase() + opt.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="as-stats">
                        <div className="as-stat-card">
                            <div className="as-stat-num">{shops.length}</div>
                            <div className="as-stat-lbl">Total shops</div>
                        </div>
                        <div className="as-stat-card accent">
                            <div className="as-stat-num">{acceptedCount}</div>
                            <div className="as-stat-lbl">Active</div>
                        </div>
                        <div className="as-stat-card">
                            <div className="as-stat-num">{pendingCount}</div>
                            <div className="as-stat-lbl">Pending</div>
                        </div>
                        <div className="as-stat-card">
                            <div className="as-stat-num">{rejectedCount}</div>
                            <div className="as-stat-lbl">Rejected</div>
                        </div>
                    </div>

                    <div className="as-table-card">
                        {filteredShops.length === 0 ? (
                            <div className="as-empty">
                                <div className="as-empty-icon">
                                    <StoreIcon size={24} color="#34d399" />
                                </div>
                                <div className="as-empty-title">No shops found</div>
                                <div className="as-empty-sub">Try a different status filter to see more results.</div>
                            </div>
                        ) : (
                            <div className="as-table-scroll">
                                <table className="as-table">
                                    <thead>
                                        <tr>
                                            <th>Shop Name</th>
                                            <th>Owner Name</th>
                                            <th>Location</th>
                                            <th>Status</th>
                                            <th>Created Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredShops.map(shop => (
                                            <tr key={shop._id}>
                                                <td>
                                                    <div className="as-shop-cell">
                                                        <div className="as-shop-icon">
                                                            <Store size={15} color="#34d399" />
                                                        </div>
                                                        <span className="as-shop-name">{shop.name}</span>
                                                    </div>
                                                </td>
                                                <td className="as-owner">{shop?.user?.name}</td>
                                                <td>
                                                    <div className="as-location">
                                                        <MapPin size={13} />
                                                        {shop?.address}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`as-pill ${shop.status}`}>
                                                        <span className="as-pill-dot" />
                                                        {shop.status?.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="as-date-cell">{new Date(shop.createdAt).toLocaleDateString('en-IN')}</td>
                                                <td>
                                                    <button
                                                        onClick={() => handleShopUpdate({ shopId: shop._id, status: shop.status === "accepted" ? "rejected" : "accepted" })}
                                                        className={`as-action-btn ${shop.status === "accepted" ? "disable" : "activate"}`}
                                                    >
                                                        {shop.status === "accepted" ? <PowerOff size={13} /> : <Power size={13} />}
                                                        {shop.status === "accepted" ? "Disable" : "Activate"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminAllShops;