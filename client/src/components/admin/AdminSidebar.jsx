import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { ArrowBigLeftDash, LayoutDashboard, Users, PackageSearch, Store } from 'lucide-react'

/* ─── Admin Sidebar · Dark glass · emerald neon ──────────────────────────
   Matches AdminAllOrders / AdminAllShops theme: Syne headings, DM Sans body,
   glass surface, emerald active state with glow.
   ─────────────────────────────────────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .asb-aside {
    width: 16rem; flex-shrink: 0;
    background: #0c0c12;
    border-right: 1px solid rgba(255,255,255,0.07);
    font-family: 'DM Sans', sans-serif;
    display: none;
  }
  @media(min-width: 768px){ .asb-aside { display: flex; flex-direction: column; } }

  /* ── brand ── */
  .asb-brand {
    padding: 1.5rem 1.5rem 1.35rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    position: relative; overflow: hidden;
  }
  .asb-brand::before {
    content: ''; position: absolute; top: -40px; left: -40px;
    width: 140px; height: 140px; border-radius: 50%;
    background: rgba(52,211,153,0.1); filter: blur(50px); pointer-events: none;
  }
  .asb-brand-title {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.15rem;
    letter-spacing: -0.02em; color: #f0f0f5; position: relative; z-index: 1;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .asb-brand-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #34d399;
    box-shadow: 0 0 8px #34d399; animation: asb-blink 1.8s ease-in-out infinite;
  }
  @keyframes asb-blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
  .asb-brand-sub {
    font-size: 0.72rem; color: rgba(200,220,210,0.4); margin-top: 0.3rem;
    position: relative; z-index: 1;
  }

  /* ── nav ── */
  .asb-nav { padding: 1.1rem 0.85rem; display: flex; flex-direction: column; gap: 0.3rem; flex: 1; }

  .asb-link {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.68rem 0.9rem; border-radius: 11px;
    font-size: 0.87rem; font-weight: 600; text-decoration: none;
    color: rgba(200,220,210,0.5);
    border: 1px solid transparent;
    transition: background 0.22s ease, color 0.22s ease, border-color 0.22s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .asb-link:hover {
    color: #e8e8f0; background: rgba(255,255,255,0.04);
    transform: translateX(2px);
  }
  .asb-link.active {
    color: #030f07;
    background: linear-gradient(135deg, #34d399 0%, #059669 100%);
    box-shadow: 0 0 18px rgba(52,211,153,0.28);
    font-weight: 700;
  }
  .asb-link.active:hover { transform: none; }
  .asb-link-icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

  .asb-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 0.9rem 0.3rem; }

  .asb-link.back {
    color: rgba(200,220,210,0.42); margin-top: auto;
  }
  .asb-link.back:hover { color: #34d399; background: rgba(52,211,153,0.06); }
`

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, match: 'dashboard' },
  { to: '/admin/users', label: 'Users', icon: Users, match: 'users' },
  { to: '/admin/orders', label: 'Orders', icon: PackageSearch, match: 'orders' },
  { to: '/admin/shops', label: 'Shops', icon: Store, match: 'shops' },
]

const AdminSidebar = () => {
  const location = useLocation()

  return (
    <aside className="asb-aside">
      <style>{css}</style>

      <div className="asb-brand">
        <div className="asb-brand-title">
          <span className="asb-brand-dot" />
          SuperAdmin
        </div>
        <div className="asb-brand-sub">Grocery Platform</div>
      </div>

      <nav className="asb-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon, match }) => {
          const isActive = location.pathname.includes(match)
          return (
            <Link
              key={to}
              to={to}
              className={`asb-link ${isActive ? 'active' : ''}`}
            >
              <span className="asb-link-icon"><Icon size={18} /></span>
              <span>{label}</span>
            </Link>
          )
        })}

        <div className="asb-divider" />

        <Link to="/" className="asb-link back">
          <span className="asb-link-icon"><ArrowBigLeftDash size={18} /></span>
          <span>Back To Home</span>
        </Link>
      </nav>
    </aside>
  )
}

export default AdminSidebar