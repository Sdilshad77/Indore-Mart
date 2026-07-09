import { Leaf, ShoppingCart, Menu, X } from 'lucide-react'
import { Link, useLocation, useNavigate } from "react-router-dom"
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../features/auth/authSlice'

/* ─── Gen-Z IndoreMart Header ───────────────────────────────────────────────
   Emerald neon + dark glass · spring scale buttons · scroll shrink
   animated underline links · mobile slide-down menu
   ─────────────────────────────────────────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .im-root { font-family: 'DM Sans', sans-serif; }

  /* ── BAR ── */
  .im-bar {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(6, 12, 8, 0.82);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(52, 211, 153, 0.1);
    box-shadow: 0 1px 0 rgba(52,211,153,0.07), 0 4px 24px rgba(0,0,0,0.4);
    transition: padding 0.35s cubic-bezier(0.22,1,0.36,1);
    animation: im-drop 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes im-drop {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .im-bar.scrolled { background: rgba(4, 9, 6, 0.95); }

  .im-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0.85rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    transition: padding 0.35s cubic-bezier(0.22,1,0.36,1);
  }
  .im-bar.scrolled .im-inner { padding-top: 0.5rem; padding-bottom: 0.5rem; }

  /* ── LOGO ── */
  .im-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
  }
  .im-logo:hover { transform: scale(1.05); }

  .im-logo-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #34d399 0%, #059669 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 16px rgba(52,211,153,0.3);
    transition: box-shadow 0.35s ease;
    flex-shrink: 0;
  }
  .im-logo:hover .im-logo-icon { box-shadow: 0 0 28px rgba(52,211,153,0.55); }

  .im-logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.25rem;
    letter-spacing: -0.03em;
    background: linear-gradient(90deg, #34d399 0%, #6ee7b7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── NAV LINKS ── */
  .im-nav {
    display: flex;
    align-items: center;
    gap: 0.1rem;
  }
  @media (max-width: 768px) { .im-nav { display: none; } }

  .im-link {
    position: relative;
    padding: 0.4rem 0.8rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: rgba(180,220,200,0.6);
    text-decoration: none;
    border-radius: 8px;
    transition: color 0.22s ease, background 0.22s ease;
  }
  .im-link::after {
    content: '';
    position: absolute;
    bottom: 3px; left: 50%; right: 50%;
    height: 2px;
    border-radius: 2px;
    background: #34d399;
    transition: left 0.28s cubic-bezier(0.34,1.56,0.64,1),
                right 0.28s cubic-bezier(0.34,1.56,0.64,1);
  }
  .im-link:hover, .im-link.active {
    color: #34d399;
    background: rgba(52,211,153,0.06);
  }
  .im-link:hover::after, .im-link.active::after {
    left: 0.8rem; right: 0.8rem;
  }
  .im-link.active { font-weight: 700; }

  /* cart icon link */
  .im-cart-link {
    position: relative;
    padding: 0.4rem 0.65rem;
    border-radius: 9px;
    color: rgba(180,220,200,0.6);
    text-decoration: none;
    display: flex;
    align-items: center;
    transition:
      color 0.22s ease,
      background 0.22s ease,
      transform 0.32s cubic-bezier(0.34,1.56,0.64,1);
  }
  .im-cart-link:hover {
    color: #34d399;
    background: rgba(52,211,153,0.06);
    transform: scale(1.1);
  }

  /* ── AUTH AREA ── */
  .im-auth { display: flex; align-items: center; gap: 0.5rem; }
  @media (max-width: 768px) { .im-auth { display: none; } }

  .im-welcome {
    font-size: 0.82rem;
    font-weight: 600;
    color: rgba(180,220,200,0.65);
    text-decoration: none;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    border: 1px solid rgba(52,211,153,0.15);
    background: rgba(52,211,153,0.05);
    white-space: nowrap;
    transition:
      color 0.22s ease,
      background 0.22s ease,
      transform 0.32s cubic-bezier(0.34,1.56,0.64,1);
  }
  .im-welcome:hover {
    color: #34d399;
    background: rgba(52,211,153,0.1);
    transform: scale(1.04);
  }

  .im-btn {
    padding: 0.42rem 1rem;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 0.82rem;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    transition:
      transform 0.32s cubic-bezier(0.34,1.56,0.64,1),
      box-shadow 0.32s ease;
  }

  .im-btn-login {
    background: rgba(255,255,255,0.05);
    color: rgba(200,230,215,0.75);
    border: 1px solid rgba(255,255,255,0.09);
  }
  .im-btn-login:hover {
    transform: scale(1.06);
    background: rgba(255,255,255,0.09);
    color: #fff;
  }

  .im-btn-signup {
    background: linear-gradient(135deg, #34d399 0%, #059669 100%);
    color: #030f07;
    box-shadow: 0 0 0 0 rgba(52,211,153,0);
  }
  .im-btn-signup:hover {
    transform: scale(1.08) translateY(-1px);
    box-shadow: 0 0 22px rgba(52,211,153,0.45);
  }

  .im-btn-logout {
    background: rgba(255,60,80,0.1);
    color: #ff6b7a;
    border: 1px solid rgba(255,60,80,0.2);
  }
  .im-btn-logout:hover {
    transform: scale(1.07) translateY(-1px);
    background: rgba(255,60,80,0.2);
    box-shadow: 0 0 16px rgba(255,60,80,0.22);
  }

  /* ── BURGER ── */
  .im-burger {
    display: none;
    flex-direction: column;
    gap: 5px;
    padding: 0.4rem;
    background: transparent;
    border: none;
    cursor: pointer;
  }
  @media (max-width: 768px) { .im-burger { display: flex; } }

  .im-burger span {
    display: block;
    width: 22px; height: 2px;
    border-radius: 2px;
    background: rgba(180,220,200,0.65);
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease;
  }
  .im-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .im-burger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .im-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* ── MOBILE MENU ── */
  .im-mobile {
    display: none;
    flex-direction: column;
    gap: 0.3rem;
    padding: 0 1.5rem;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.42s cubic-bezier(0.22,1,0.36,1), padding 0.3s ease;
  }
  @media (max-width: 768px) { .im-mobile { display: flex; } }
  .im-mobile.open { max-height: 420px; padding-bottom: 1.2rem; }

  .im-mobile .im-link  { font-size: 0.95rem; padding: 0.6rem 0.8rem; }
  .im-mobile .im-btn   { width: 100%; justify-content: center; padding: 0.65rem; margin-top: 0.2rem; }
  .im-mobile .im-welcome { margin-bottom: 0.2rem; text-align: center; }
`

export default function Header() {
  const { user }   = useSelector(state => state.auth)
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const location   = useLocation()

  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  const isHidden =
    location.pathname.includes('/admin') ||
    location.pathname.includes('/shop')

  if (isHidden) return null

  const isActive = seg => location.pathname.includes(seg)

  const profileTo = user?.isAdmin
    ? '/admin/dashboard'
    : user?.isShopOwner
    ? '/shop/dashboard'
    : '/auth/profile'

  const navLinks = (
    <>
      <Link to="/products"    className={`im-link${isActive('products')    ? ' active' : ''}`}>Products</Link>
      <Link to="/marketplace" className={`im-link${isActive('marketplace') ? ' active' : ''}`}>Shops</Link>
      <Link to="/auth/cart"   className={`im-link${isActive('cart')        ? ' active' : ''}`}>Cart</Link>
    </>
  )

  const authLinks = user ? (
    <>
      <Link to={profileTo} className="im-welcome">👋 {user?.name}</Link>
      <button className="im-btn im-btn-logout" onClick={handleLogout}>Logout</button>
    </>
  ) : (
    <>
      <Link to="/login"    className="im-btn im-btn-login">Login</Link>
      <Link to="/register" className="im-btn im-btn-signup">Sign Up</Link>
    </>
  )

  return (
    <div className="im-root">
      <style>{css}</style>
      <header className={`im-bar${scrolled ? ' scrolled' : ''}`}>
        <div className="im-inner">

          {/* logo */}
          <Link to="/" className="im-logo">
            <div className="im-logo-icon">
              <Leaf size={18} color="#030f07" strokeWidth={2.5} />
            </div>
            <span className="im-logo-text">IndoreMart</span>
          </Link>

          {/* desktop nav */}
          <nav className="im-nav">{navLinks}</nav>

          {/* desktop auth */}
          <div className="im-auth">{authLinks}</div>

          {/* burger */}
          <button
            className={`im-burger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* mobile dropdown */}
        <nav className={`im-mobile${menuOpen ? ' open' : ''}`}>
          {navLinks}
          {authLinks}
        </nav>
      </header>
    </div>
  )
}