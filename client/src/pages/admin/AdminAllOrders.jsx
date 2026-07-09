import { toast } from "react-toastify"
import { getAllOrders, orderUpdate } from "../../features/admin/adminSlice"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import AdminSidebar from "../../components/admin/AdminSidebar"
import AdminHeader from "../../components/admin/AdminHeader"
import { PackageSearch, CalendarDays, Filter } from "lucide-react"

/* ─── Admin Orders · Dark glass · emerald neon ───────────────────────────
   Matches the IndoreMart home theme: Syne headings, DM Sans body,
   glass cards, emerald accent, subtle motion.
   ─────────────────────────────────────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .ao-shell {
    font-family: 'DM Sans', sans-serif;
    background: #09090d;
    color: #e8e8f0;
    height: 100vh;
    display: flex;
    overflow: hidden;
  }

  .ao-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; }

  /* faint bg grid, same language as hero */
  .ao-main::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(52,211,153,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(52,211,153,0.035) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: radial-gradient(ellipse 70% 60% at 30% 0%, black 20%, transparent 85%);
  }

  .ao-content { position: relative; z-index: 1; overflow-y: auto; flex: 1; padding: 2.25rem 2.5rem 3rem; }

  /* ── header row ── */
  .ao-head {
    display: flex; align-items: flex-end; justify-content: space-between;
    flex-wrap: wrap; gap: 1rem; margin-bottom: 1.75rem;
    animation: ao-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both;
    position: relative; z-index: 10;
  }
  .ao-eyebrow {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: #34d399; margin-bottom: 0.4rem;
    display: flex; align-items: center; gap: 0.4rem;
  }
  .ao-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #34d399;
    box-shadow: 0 0 8px #34d399; animation: ao-blink 1.8s ease-in-out infinite;
  }
  @keyframes ao-blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

  .ao-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(1.5rem, 2.6vw, 2rem); letter-spacing: -0.03em; color: #f0f0f5;
  }
  .ao-title em {
    font-style: normal;
    background: linear-gradient(90deg, #34d399, #6ee7b7);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .ao-sub { font-size: 0.85rem; color: rgba(200,220,210,0.42); margin-top: 0.3rem; }

  /* ── filters ── */
  .ao-filters { display: flex; gap: 0.7rem; flex-wrap: wrap; }
  .ao-filter-field {
    position: relative; display: flex; align-items: center;
  }
  .ao-filter-icon {
    position: absolute; left: 0.75rem; color: rgba(52,211,153,0.55); pointer-events: none;
  }
  .ao-select, .ao-date {
    appearance: none;
    padding: 0.62rem 0.9rem 0.62rem 2.35rem;
    border-radius: 11px; background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09); color: #e8e8f0;
    font-family: 'DM Sans', sans-serif; font-size: 0.83rem; font-weight: 500;
    outline: none; cursor: pointer;
    transition: border-color 0.22s ease, background 0.22s ease;
  }
  .ao-select:hover, .ao-date:hover { border-color: rgba(52,211,153,0.3); }
  .ao-select:focus, .ao-date:focus { border-color: rgba(52,211,153,0.4); background: rgba(52,211,153,0.05); }
  .ao-date::-webkit-calendar-picker-indicator { filter: invert(0.6) sepia(1) saturate(4) hue-rotate(100deg); cursor: pointer; }

  /* custom dropdown */
  .ao-custom-dropdown { position: relative; }
  .ao-dropdown-btn {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.62rem 0.9rem 0.62rem 2.35rem;
    border-radius: 11px; background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09); color: #e8e8f0;
    font-family: 'DM Sans', sans-serif; font-size: 0.83rem; font-weight: 500;
    outline: none; cursor: pointer; transition: border-color 0.22s ease, background 0.22s ease;
    white-space: nowrap; min-width: 130px; justify-content: space-between;
  }
  .ao-dropdown-btn:hover, .ao-dropdown-btn.open { border-color: rgba(52,211,153,0.4); background: rgba(52,211,153,0.05); }
  .ao-dropdown-chevron { transition: transform 0.2s ease; }
  .ao-dropdown-chevron.open { transform: rotate(180deg); }
  .ao-dropdown-menu {
    position: absolute; top: calc(100% + 6px); left: 0; min-width: 100%;
    background: #0d1a13; border: 1px solid rgba(52,211,153,0.2);
    border-radius: 12px; overflow: hidden;
    box-shadow: 0 12px 32px rgba(0,0,0,0.5); z-index: 100;
    animation: ao-drop-in 0.18s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes ao-drop-in { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  .ao-dropdown-item {
    padding: 0.55rem 1rem; font-size: 0.83rem; font-family: 'DM Sans', sans-serif;
    color: rgba(200,240,220,0.75); cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .ao-dropdown-item:hover { background: rgba(52,211,153,0.1); color: #34d399; }
  .ao-dropdown-item.selected { background: rgba(52,211,153,0.15); color: #34d399; font-weight: 600; }
  .ao-dropdown-item.selected::after { content: '✓'; margin-left: auto; font-size: 0.75rem; }

  /* ── stat strip ── */
  .ao-stats {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.9rem;
    margin-bottom: 1.75rem;
    animation: ao-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.08s both;
  }
  @media(max-width: 900px){ .ao-stats{ grid-template-columns: repeat(2,1fr); } }
  .ao-stat-card {
    padding: 1.05rem 1.15rem; border-radius: 14px;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    transition: border-color 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .ao-stat-card:hover { border-color: rgba(52,211,153,0.2); transform: translateY(-3px); }
  .ao-stat-num { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.4rem; color: #f0f0f5; letter-spacing: -0.02em; }
  .ao-stat-lbl { font-size: 0.73rem; color: rgba(200,220,210,0.42); margin-top: 0.2rem; }
  .ao-stat-card.accent .ao-stat-num { color: #34d399; }

  /* ── table card ── */
  .ao-table-card {
    border-radius: 18px; overflow: hidden;
    background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
    animation: ao-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s both;
  }
  .ao-table-scroll { overflow-x: auto; }
  table.ao-table { width: 100%; border-collapse: collapse; }

  .ao-table thead th {
    text-align: left; padding: 0.9rem 1.3rem;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase;
    color: rgba(180,220,200,0.45);
    background: rgba(255,255,255,0.025);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    white-space: nowrap;
  }

  .ao-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.045);
    transition: background 0.2s ease;
  }
  .ao-table tbody tr:last-child { border-bottom: none; }
  .ao-table tbody tr:hover { background: rgba(52,211,153,0.035); }

  .ao-table td { padding: 1rem 1.3rem; font-size: 0.85rem; color: #d8dce4; white-space: nowrap; }

  .ao-order-id {
    font-family: 'JetBrains Mono', monospace; font-weight: 500;
    color: #34d399; letter-spacing: 0.02em;
  }
  .ao-customer { color: #f0f0f5; font-weight: 600; }
  .ao-shop { color: rgba(200,220,210,0.6); }
  .ao-amount { font-family: 'Syne', sans-serif; font-weight: 800; color: #f0f0f5; }

  .ao-pill {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.28rem 0.7rem; border-radius: 999px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.03em;
  }
  .ao-pill-dot { width: 5px; height: 5px; border-radius: 50%; }
  .ao-pill.paid { background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.22); }
  .ao-pill.paid .ao-pill-dot { background: #34d399; }
  .ao-pill.unpaid { background: rgba(245,158,11,0.1); color: #fbbf24; border: 1px solid rgba(245,158,11,0.22); }
  .ao-pill.unpaid .ao-pill-dot { background: #fbbf24; }
  .ao-pill.cancelled { background: rgba(244,63,94,0.1); color: #fb7185; border: 1px solid rgba(244,63,94,0.22); }
  .ao-pill.cancelled .ao-pill-dot { background: #fb7185; }
  .ao-pill.active { background: rgba(96,165,250,0.1); color: #60a5fa; border: 1px solid rgba(96,165,250,0.22); }
  .ao-pill.active .ao-pill-dot { background: #60a5fa; }

  .ao-date-cell { color: rgba(200,220,210,0.45); font-size: 0.82rem; }

  /* ── empty state ── */
  .ao-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 0.9rem; padding: 4.5rem 2rem; text-align: center;
  }
  .ao-empty-icon {
    width: 56px; height: 56px; border-radius: 16px;
    background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.18);
    display: flex; align-items: center; justify-content: center;
  }
  .ao-empty-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.1rem; color: #f0f0f5; }
  .ao-empty-sub { font-size: 0.85rem; color: rgba(200,220,210,0.4); max-width: 320px; }

  /* ── loading ── */
  .ao-loading-wrap {
    height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center;
    background: #09090d;
  }
  .ao-loading-ring {
    width: 42px; height: 42px; border-radius: 50%;
    border: 3px solid rgba(52,211,153,0.15); border-top-color: #34d399;
    animation: ao-spin 0.85s linear infinite;
  }
  @keyframes ao-spin { to { transform: rotate(360deg); } }

  @keyframes ao-fade-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
`

const STATUS_OPTIONS = ["All Status", "placed", "delivered", "dispatched", "cancelled"]

function statusPillClass(status) {
  if (status === "delivered") return "paid"
  if (status === "cancelled") return "cancelled"
  if (status === "dispatched") return "active"
  return "unpaid"
}

function shortId(id) {
  if (!id) return ""
  return id[0] + id[id.length - 3] + id[id.length - 2] + id[id.length - 1]
}

function AdminAllOrders() {
  const { user } = useSelector(state => state.auth)
  const { adminLoading, adminError, adminErrorMessage, allOrders } = useSelector(state => state.admin)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleOrderStatusChange = (orderId, newStatus) => {
    dispatch(orderUpdate({ orderId, status: newStatus }))
      .unwrap()
      .then(() => {
        toast.success('Order status updated!')
        setStatusFilter('All Status')   // reset filter so updated order stays visible
      })
      .catch((err) => toast.error(err || 'Failed to update order'))
  }

  const [statusFilter, setStatusFilter] = useState("All Status")
  const [dateFilter, setDateFilter] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (user?.isAdmin) {
      dispatch(getAllOrders())
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
      <div className="ao-loading-wrap">
        <style>{css}</style>
        <div className="ao-loading-ring" />
      </div>
    )
  }

  const orders = allOrders ?? []
  const filteredOrders = orders.filter(order => {
    const statusOk = statusFilter === "All Status" || order.status === statusFilter
    const dateOk = !dateFilter || (() => {
      const d = new Date(order?.createdAt)
      return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === dateFilter
    })()
    return statusOk && dateOk
  })

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalBillAmount || 0), 0)
  const deliveredCount = orders.filter(o => o.status === "delivered").length
  const cancelledCount = orders.filter(o => o.status === "cancelled").length

  return (
    <div className="ao-shell">
      <style>{css}</style>
      <AdminSidebar />

      <div className="ao-main">
        <AdminHeader />

        <div className="ao-content">
          <div className="ao-head">
            <div>
              <div className="ao-eyebrow"><span className="ao-eyebrow-dot" />Live orders</div>
              <div className="ao-title">All <em>Orders</em></div>
              <div className="ao-sub">{orders.length} total orders across every shop</div>
            </div>

            <div className="ao-filters">
              <div className="ao-filter-field ao-custom-dropdown" ref={dropdownRef}>
                <Filter size={14} className="ao-filter-icon" />
                <button
                  className={`ao-dropdown-btn${dropdownOpen ? ' open' : ''}`}
                  onClick={() => setDropdownOpen(o => !o)}
                  type="button"
                >
                  <span>{statusFilter === "All Status" ? statusFilter : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
                  <svg className={`ao-dropdown-chevron${dropdownOpen ? ' open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                {dropdownOpen && (
                  <div className="ao-dropdown-menu">
                    {STATUS_OPTIONS.map(opt => (
                      <div
                        key={opt}
                        className={`ao-dropdown-item${statusFilter === opt ? ' selected' : ''}`}
                        onClick={() => { setStatusFilter(opt); setDropdownOpen(false) }}
                      >
                        {opt === "All Status" ? opt : opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="ao-filter-field">
                <CalendarDays size={14} className="ao-filter-icon" />
                <input
                  type="date"
                  className="ao-date"
                  value={dateFilter}
                  onChange={e => setDateFilter(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="ao-stats">
            <div className="ao-stat-card">
              <div className="ao-stat-num">{orders.length}</div>
              <div className="ao-stat-lbl">Total orders</div>
            </div>
            <div className="ao-stat-card accent">
              <div className="ao-stat-num">₹{totalRevenue.toLocaleString('en-IN')}</div>
              <div className="ao-stat-lbl">Total revenue</div>
            </div>
            <div className="ao-stat-card">
              <div className="ao-stat-num">{deliveredCount}</div>
              <div className="ao-stat-lbl">Delivered</div>
            </div>
            <div className="ao-stat-card">
              <div className="ao-stat-num">{cancelledCount}</div>
              <div className="ao-stat-lbl">Cancelled</div>
            </div>
          </div>

          <div className="ao-table-card">
            {filteredOrders.length === 0 ? (
              <div className="ao-empty">
                <div className="ao-empty-icon">
                  <PackageSearch size={24} color="#34d399" />
                </div>
                <div className="ao-empty-title">No orders found</div>
                <div className="ao-empty-sub">Try adjusting the status or date filter to see more results.</div>
              </div>
            ) : (
              <div className="ao-table-scroll">
                <table className="ao-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Name</th>
                      <th>Shop Name</th>
                      <th>Order Amount</th>
                      <th>Payment Status</th>
                      <th>Order Status</th>
                      <th>Date</th>
                      <th>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order._id}>
                        <td className="ao-order-id">#{shortId(order._id)}</td>
                        <td className="ao-customer">{order?.user?.name}</td>
                        <td className="ao-shop">{order?.shop?.name}</td>
                        <td className="ao-amount">₹{order.totalBillAmount}</td>
                        <td>
                          <span className={`ao-pill ${order.status === "delivered" ? "paid" : "unpaid"}`}>
                            <span className="ao-pill-dot" />
                            {order.status === "delivered" ? "Paid" : "Not Paid"}
                          </span>
                        </td>
                        <td>
                          <span className={`ao-pill ${statusPillClass(order.status)}`}>
                            <span className="ao-pill-dot" />
                            {order.status?.toUpperCase()}
                          </span>
                        </td>
                        <td className="ao-date-cell">
                          {order.createdAt && !isNaN(new Date(order.createdAt).getTime())
                            ? new Date(order.createdAt).toLocaleDateString('en-IN')
                            : '—'}
                        </td>
                        <td>
                          <select
                            value={order.status}
                            onChange={e => handleOrderStatusChange(order._id, e.target.value)}
                            style={{
                              background: 'rgba(52,211,153,0.06)',
                              border: '1px solid rgba(52,211,153,0.2)',
                              borderRadius: 8,
                              color: '#34d399',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              padding: '4px 8px',
                              cursor: 'pointer',
                              outline: 'none'
                            }}
                          >
                            <option value="placed" style={{background:'#0d1a13'}}>Placed</option>
                            <option value="dispatched" style={{background:'#0d1a13'}}>Dispatched</option>
                            <option value="delivered" style={{background:'#0d1a13'}}>Delivered</option>
                            <option value="cancelled" style={{background:'#0d1a13'}}>Cancelled</option>
                          </select>
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
  )
}

export default AdminAllOrders