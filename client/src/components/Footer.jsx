import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'

/* ─── Gen-Z IndoreMart Footer ───────────────────────────────────────────────
   Dark glass · emerald neon · hover slide links · consistent with Header
   ─────────────────────────────────────────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .imf-root { font-family: 'DM Sans', sans-serif; }

  .imf-footer {
    position: relative;
    background: rgba(4, 9, 6, 0.97);
    border-top: 1px solid rgba(52, 211, 153, 0.1);
    overflow: hidden;
  }

  /* subtle grid bg */
  .imf-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: linear-gradient(to top, black 0%, transparent 100%);
  }

  /* ambient glow */
  .imf-glow {
    position: absolute; pointer-events: none;
    width: 500px; height: 200px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(52,211,153,0.05) 0%, transparent 70%);
    bottom: -60px; left: 50%; transform: translateX(-50%);
    filter: blur(30px);
  }

  .imf-inner {
    position: relative; z-index: 1;
    max-width: 1280px; margin: 0 auto;
    padding: 4rem 1.5rem 2rem;
  }

  /* ── TOP GRID ── */
  .imf-top {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 3rem;
    margin-bottom: 3.5rem;
  }
  @media (max-width: 900px) { .imf-top { grid-template-columns: 1fr 1fr; gap: 2rem; } }
  @media (max-width: 540px) { .imf-top { grid-template-columns: 1fr; } }

  /* brand col */
  .imf-brand { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; text-decoration: none; }
  .imf-brand-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: linear-gradient(135deg, #34d399 0%, #059669 100%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 14px rgba(52,211,153,0.28);
    transition: box-shadow 0.3s ease, transform 0.32s cubic-bezier(0.34,1.56,0.64,1);
  }
  .imf-brand:hover .imf-brand-icon { box-shadow: 0 0 24px rgba(52,211,153,0.5); transform: scale(1.08); }
  .imf-brand-name {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.1rem;
    letter-spacing: -0.03em;
    background: linear-gradient(90deg, #34d399, #6ee7b7);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .imf-tagline {
    font-size: 0.82rem; color: rgba(180,220,200,0.38);
    line-height: 1.65; max-width: 220px;
  }

  /* col headings */
  .imf-col-title {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.82rem;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: rgba(200,220,210,0.55); margin-bottom: 1.1rem;
  }

  /* links */
  .imf-links { display: flex; flex-direction: column; gap: 0.55rem; }
  .imf-link {
    font-size: 0.82rem; color: rgba(180,220,200,0.38);
    text-decoration: none; display: inline-block;
    transition: color 0.22s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1);
  }
  .imf-link:hover { color: #34d399; transform: translateX(5px); }

  /* ── BOTTOM BAR ── */
  .imf-bottom {
    border-top: 1px solid rgba(255,255,255,0.05);
    padding-top: 1.8rem;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 0.75rem;
  }

  .imf-copy { font-size: 0.75rem; color: rgba(180,220,200,0.25); }

  .imf-socials { display: flex; gap: 0.5rem; }
  .imf-social {
    width: 32px; height: 32px; border-radius: 8px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 700; color: rgba(180,220,200,0.4);
    text-decoration: none; letter-spacing: 0.02em;
    transition: background 0.22s ease, color 0.22s ease, transform 0.32s cubic-bezier(0.34,1.56,0.64,1), border-color 0.22s ease;
  }
  .imf-social:hover {
    background: rgba(52,211,153,0.1); color: #34d399;
    border-color: rgba(52,211,153,0.25); transform: scale(1.12) translateY(-2px);
  }

  /* made with badge */
  .imf-made {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-size: 0.7rem; color: rgba(180,220,200,0.22);
  }
  .imf-heart { color: #34d399; animation: imf-beat 1.6s ease-in-out infinite; }
  @keyframes imf-beat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }
`

const COLS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/' },
      { label: 'Careers', to: '/' },
      { label: 'Blog', to: '/' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: '/' },
      { label: 'Contact Us', to: '/' },
      { label: 'Terms of Service', to: '/' },
    ],
  },
  {
    title: 'Partner With Us',
    links: [
      { label: 'Become a Store', to: '/request-shop' },
      { label: 'Delivery Partner', to: '/' },
    ],
  },
]

const Footer = () => {
  const { pathname } = useLocation()

  if (
    pathname.includes('chat') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/shop')
  ) return null

  return (
    <div className="imf-root">
      <style>{css}</style>
      <footer className="imf-footer">
        <div className="imf-grid" />
        <div className="imf-glow" />

        <div className="imf-inner">
          <div className="imf-top">

            {/* brand */}
            <div>
              <Link to="/" className="imf-brand">
                <div className="imf-brand-icon">
                  <Leaf size={16} color="#030f07" strokeWidth={2.5} />
                </div>
                <span className="imf-brand-name">IndoreMart</span>
              </Link>
              <p className="imf-tagline">
                Your trusted multi-shop grocery delivery platform. Fresh products in minutes.
              </p>
            </div>

            {/* link cols */}
            {COLS.map(col => (
              <div key={col.title}>
                <div className="imf-col-title">{col.title}</div>
                <div className="imf-links">
                  {col.links.map(l => (
                    <Link key={l.label} to={l.to} className="imf-link">{l.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* bottom bar */}
          <div className="imf-bottom">
            <span className="imf-copy">© 2026 IndoreMart. All rights reserved.</span>

            <div className="imf-made">
              Made with <span className="imf-heart">♥</span> in Indore
            </div>

            <div className="imf-socials">
              {['tw', 'ig', 'in'].map(s => (
                <a key={s} href="#" className="imf-social">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer