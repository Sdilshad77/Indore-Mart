import { Home, Package, ShoppingBag, Tag, Store, Bell, User, ArrowLeft, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .sol-wrap {
    min-height: 100vh;
    background: #060c09;
    font-family: 'DM Sans', sans-serif;
    display: flex;
  }

  /* ── SIDEBAR ── */
  .sol-sidebar {
    width: 240px;
    flex-shrink: 0;
    background: #080f0b;
    border-right: 1px solid rgba(52,211,153,0.12);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 40;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .sol-sidebar.mobile-hidden {
    transform: translateX(-100%);
  }

  .sol-logo {
    display: flex; align-items: center; gap: 10px;
    padding: 20px 20px 16px;
    border-bottom: 1px solid rgba(52,211,153,0.1);
  }
  .sol-logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, #34d399, #059669);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .sol-logo-text {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 1rem; color: #e7f6ee; letter-spacing: -0.02em;
  }
  .sol-logo-sub { font-size: 0.65rem; color: rgba(52,211,153,0.5); margin-top: 1px; letter-spacing: 0.08em; text-transform: uppercase; }

  .sol-nav { flex: 1; padding: 12px 10px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }

  .sol-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 12px;
    font-size: 0.875rem; font-weight: 500; color: rgba(180,220,200,0.45);
    text-decoration: none; transition: all 0.2s ease;
    position: relative; cursor: pointer;
  }
  .sol-nav-item:hover {
    background: rgba(52,211,153,0.07);
    color: rgba(180,220,200,0.8);
  }
  .sol-nav-item.active {
    background: rgba(52,211,153,0.12);
    color: #34d399;
    border: 1px solid rgba(52,211,153,0.2);
  }
  .sol-nav-item.active::before {
    content: '';
    position: absolute; left: 0; top: 20%; bottom: 20%;
    width: 3px; border-radius: 0 4px 4px 0; left: -10px;
    background: #34d399;
  }
  .sol-nav-icon { width: 17px; height: 17px; flex-shrink: 0; }
  .sol-nav-label { flex: 1; }

  .sol-divider { height: 1px; background: rgba(52,211,153,0.07); margin: 6px 12px; }

  .sol-back-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 12px;
    font-size: 0.875rem; font-weight: 500; color: rgba(180,220,200,0.3);
    text-decoration: none; transition: all 0.2s;
    margin-bottom: 8px;
  }
  .sol-back-item:hover { color: rgba(180,220,200,0.6); background: rgba(255,255,255,0.03); }

  /* ── MAIN ── */
  .sol-main {
    flex: 1;
    margin-left: 240px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* ── HEADER ── */
  .sol-header {
    position: sticky; top: 0; z-index: 30;
    height: 60px;
    background: rgba(6,12,9,0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(52,211,153,0.1);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px;
    gap: 16px;
  }

  .sol-header-left { display: flex; align-items: center; gap: 12px; }
  .sol-breadcrumb {
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 1.1rem; color: #e7f6ee; letter-spacing: -0.02em;
  }
  .sol-breadcrumb-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(52,211,153,0.4); }

  .sol-header-right { display: flex; align-items: center; gap: 10px; }

  .sol-shop-badge {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 12px; border-radius: 20px;
    background: rgba(52,211,153,0.08);
    border: 1px solid rgba(52,211,153,0.18);
    font-size: 0.78rem; font-weight: 600; color: #34d399;
  }

  .sol-bell-btn {
    position: relative; width: 36px; height: 36px;
    border-radius: 10px; border: 1px solid rgba(52,211,153,0.12);
    background: rgba(52,211,153,0.05);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: rgba(180,220,200,0.5);
    transition: background 0.2s, color 0.2s;
  }
  .sol-bell-btn:hover { background: rgba(52,211,153,0.1); color: #34d399; }
  .sol-bell-dot {
    position: absolute; top: 6px; right: 6px;
    width: 7px; height: 7px; border-radius: 50%;
    background: #f09595;
    border: 1.5px solid #060c09;
    animation: sol-pulse 2s infinite;
  }
  @keyframes sol-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

  .sol-user-pill {
    display: flex; align-items: center; gap: 8px;
    padding: 5px 12px 5px 5px; border-radius: 24px;
    background: rgba(52,211,153,0.06);
    border: 1px solid rgba(52,211,153,0.12);
    cursor: default;
  }
  .sol-user-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, #34d399, #059669);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 0.75rem; color: #030f07; flex-shrink: 0;
  }
  .sol-user-info { display: flex; flex-direction: column; }
  .sol-user-name { font-size: 0.8rem; font-weight: 600; color: #e7f6ee; line-height: 1.2; }
  .sol-user-role { font-size: 0.65rem; color: #34d399; letter-spacing: 0.05em; text-transform: uppercase; }

  /* ── CONTENT ── */
  .sol-content {
    flex: 1; padding: 28px 28px;
    background: #060c09;
  }

  /* ── MOBILE ── */
  .sol-menu-btn {
    display: none; width: 36px; height: 36px;
    border-radius: 10px; border: 1px solid rgba(52,211,153,0.15);
    background: rgba(52,211,153,0.05);
    align-items: center; justify-content: center;
    cursor: pointer; color: rgba(180,220,200,0.6);
  }
  .sol-overlay {
    display: none; position: fixed; inset: 0;
    background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
    z-index: 35;
  }
  @media (max-width: 900px) {
    .sol-sidebar { transform: translateX(-100%); }
    .sol-sidebar.mobile-open { transform: translateX(0); }
    .sol-main { margin-left: 0; }
    .sol-menu-btn { display: flex; }
    .sol-overlay.visible { display: block; }
    .sol-shop-badge { display: none; }
    .sol-content { padding: 20px 16px; }
  }

  /* ── SCROLLBAR ── */
  .sol-nav::-webkit-scrollbar { width: 3px; }
  .sol-nav::-webkit-scrollbar-track { background: transparent; }
  .sol-nav::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.2); border-radius: 999px; }
`;

const navItems = [
  { to: '/shop/dashboard', label: 'Dashboard', icon: Home, page: 'Dashboard' },
  { to: '/shop/products', label: 'My Products', icon: Package, page: 'Products' },
  { to: '/shop/orders', label: 'Orders', icon: ShoppingBag, page: 'Orders' },
  { to: '/shop/coupons', label: 'Coupons', icon: Tag, page: 'Coupons' },
  { to: '/shop/profile', label: 'Shop Profile', icon: Store, page: 'Shop Profile' },
];

function ShopOwnerLayout({ children, activePage = 'Dashboard' }) {
  const { user } = useSelector(state => state.auth);
  const { shop } = useSelector(state => state.shop);
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'S';

  return (
    <>
      <style>{css}</style>

      <div className="sol-wrap">

        {/* Mobile Overlay */}
        <div
          className={`sol-overlay${mobileOpen ? ' visible' : ''}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* ── SIDEBAR ── */}
        <aside className={`sol-sidebar${mobileOpen ? ' mobile-open' : ''}`}>

          {/* Logo */}
          <div className="sol-logo">
            <div className="sol-logo-icon">
              <Store style={{ width: 18, height: 18, color: '#030f07' }} />
            </div>
            <div>
              <div className="sol-logo-text">Indore Bazar</div>
              <div className="sol-logo-sub">Shop Panel</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="sol-nav">
            {navItems.map(({ to, label, icon: Icon, page }) => (
              <Link
                key={to}
                to={to}
                className={`sol-nav-item${activePage === page ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="sol-nav-icon" />
                <span className="sol-nav-label">{label}</span>
              </Link>
            ))}

            <div className="sol-divider" />

            <Link to="/" className="sol-back-item" onClick={() => setMobileOpen(false)}>
              <ArrowLeft style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span>Back to Site</span>
            </Link>
          </nav>
        </aside>

        {/* ── MAIN ── */}
        <div className="sol-main">

          {/* Header */}
          <header className="sol-header">
            <div className="sol-header-left">
              <button
                className="sol-menu-btn"
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen
                  ? <X style={{ width: 18, height: 18 }} />
                  : <Menu style={{ width: 18, height: 18 }} />
                }
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="sol-breadcrumb-dot" />
                <span className="sol-breadcrumb">{activePage}</span>
              </div>
            </div>

            <div className="sol-header-right">
              {/* Shop badge */}
              {shop?.name && (
                <div className="sol-shop-badge">
                  <Store style={{ width: 13, height: 13 }} />
                  <span>{shop.name}</span>
                </div>
              )}

              {/* Bell */}
              <button className="sol-bell-btn" aria-label="Notifications">
                <Bell style={{ width: 16, height: 16 }} />
                <span className="sol-bell-dot" />
              </button>

              {/* User pill */}
              <div className="sol-user-pill">
                <div className="sol-user-avatar">{initials}</div>
                <div className="sol-user-info">
                  <span className="sol-user-name">{user?.name || 'Shop Owner'}</span>
                  <span className="sol-user-role">Shop Owner</span>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="sol-content">
            {children}
          </main>

        </div>
      </div>
    </>
  );
}

export default ShopOwnerLayout;
