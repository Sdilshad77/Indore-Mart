import { ShoppingBag, MapPin, Clock, Store, Leaf, Zap, TrendingUp, Apple, Coffee, Candy, UtensilsCrossed, Cake, ArrowRight, Navigation, Loader2 } from 'lucide-react'
import Hero from "../assets/hero.jpg"
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState, useCallback } from 'react'
import { getProducts, getProductShops } from '../features/product/productSlice'
import LoadingScreen from '../components/LoadingScreen'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getCart } from '../features/cart/cartSlice'

/* ─── Gen-Z IndoreMart Home ─────────────────────────────────────────────────
   Dark glass · emerald neon · spring hovers · scroll reveal · consistent theme
   ─────────────────────────────────────────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .im-home {
    font-family: 'DM Sans', sans-serif;
    background: #09090d;
    color: #e8e8f0;
    min-height: 100svh;
    overflow-x: hidden;
  }

  /* ── shared ── */
  .im-section { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; }
  .im-sec-label {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: #34d399; margin-bottom: 0.5rem;
  }
  .im-sec-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(1.7rem, 4vw, 2.6rem); letter-spacing: -0.03em;
    color: #f0f0f5; line-height: 1.1;
  }
  .im-sec-title em {
    font-style: normal;
    background: linear-gradient(90deg, #34d399, #6ee7b7);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .im-view-all {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-size: 0.82rem; font-weight: 700; color: rgba(52,211,153,0.7);
    text-decoration: none;
    transition: color 0.22s ease, gap 0.28s cubic-bezier(0.34,1.56,0.64,1);
  }
  .im-view-all:hover { color: #34d399; gap: 0.55rem; }

  /* scroll reveal */
  .im-reveal {
    opacity: 0; transform: translateY(22px);
    transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1);
  }
  .im-reveal.on { opacity: 1; transform: translateY(0); }

  /* ════════════════════════════════════
     HERO
  ════════════════════════════════════ */
  .im-hero {
    position: relative; overflow: hidden;
    min-height: 100svh; display: flex; align-items: center;
    padding: 7rem 0 5rem;
  }

  /* grid bg */
  .im-hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(52,211,153,0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(52,211,153,0.045) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%);
    animation: im-grid 22s linear infinite;
  }
  @keyframes im-grid { from { background-position:0 0; } to { background-position:48px 48px; } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  /* noise */
  .im-hero::after {
    content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 1;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  }

  /* blobs */
  .im-hero-blob { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(80px); }
  .im-hero-blob-1 { width:380px;height:380px; background:rgba(52,211,153,0.09); top:-100px;left:-80px; animation:im-float 10s ease-in-out infinite; }
  .im-hero-blob-2 { width:300px;height:300px; background:rgba(16,185,129,0.07); bottom:-60px;right:-60px; animation:im-float 13s ease-in-out infinite reverse; }
  @keyframes im-float { 0%,100%{transform:translate(0,0)} 50%{transform:translate(14px,-20px)} }

  .im-hero-inner {
    position: relative; z-index: 2;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4rem; align-items: center;
  }
  @media(max-width:900px){ .im-hero-inner{grid-template-columns:1fr} .im-hero-img-wrap{display:none} }

  /* badge */
  .im-badge {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.28rem 0.85rem; border-radius: 999px;
    border: 1px solid rgba(52,211,153,0.25); background: rgba(52,211,153,0.07);
    font-size: 0.73rem; font-weight: 700; letter-spacing: 0.07em;
    text-transform: uppercase; color: #34d399;
    margin-bottom: 1.4rem;
    animation: im-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both;
  }
  .im-badge-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #34d399;
    box-shadow: 0 0 8px #34d399; animation: im-blink 1.8s ease-in-out infinite;
  }
  @keyframes im-blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

  .im-hero-h1 {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(2.4rem, 5.5vw, 4.2rem);
    letter-spacing: -0.04em; line-height: 1.05; color: #f0f0f5;
    margin-bottom: 1.2rem;
    animation: im-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.18s both;
  }
  .im-hero-h1 em {
    font-style: normal;
    background: linear-gradient(90deg, #34d399 0%, #6ee7b7 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .im-hero-sub {
    font-size: 1rem; color: rgba(200,220,210,0.58); line-height: 1.7;
    max-width: 460px; margin-bottom: 2rem;
    animation: im-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.28s both;
  }

  /* search row */
  .im-search-row {
    display: flex; gap: 0.7rem; flex-wrap: wrap; margin-bottom: 2rem;
    animation: im-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.36s both;
  }
  .im-search-wrap { position: relative; flex: 1; min-width: 200px; }
  .im-search-icon {
    position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%);
    color: rgba(180,220,200,0.35); pointer-events: none;
  }
  .im-search-input {
    width: 100%; padding: 0.72rem 0.9rem 0.72rem 2.6rem;
    border-radius: 12px; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09); color: #e8e8f0;
    font-family: 'DM Sans',sans-serif; font-size: 0.9rem; outline: none;
    transition: border-color 0.22s ease, background 0.22s ease;
  }
  .im-search-input::placeholder { color: rgba(200,220,210,0.3); }
  .im-search-input:focus {
    border-color: rgba(52,211,153,0.35); background: rgba(52,211,153,0.04);
  }

  .im-find-btn {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.72rem 1.5rem; border-radius: 12px;
    background: linear-gradient(135deg, #34d399 0%, #059669 100%);
    color: #030f07; font-weight: 700; font-size: 0.9rem;
    border: none; cursor: pointer; white-space: nowrap;
    box-shadow: 0 0 0 0 rgba(52,211,153,0);
    transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.32s ease;
  }
  .im-find-btn:hover {
    transform: scale(1.07) translateY(-2px);
    box-shadow: 0 0 24px rgba(52,211,153,0.45);
  }

  /* feature pills */
  .im-features {
    display: flex; flex-wrap: wrap; gap: 0.9rem;
    animation: im-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.44s both;
  }
  .im-feature {
    display: flex; align-items: center; gap: 0.55rem;
    padding: 0.4rem 0.9rem; border-radius: 999px;
    background: rgba(52,211,153,0.06); border: 1px solid rgba(52,211,153,0.14);
    font-size: 0.8rem; color: rgba(180,220,200,0.65);
  }
  .im-feature-icon {
    width: 28px; height: 28px; border-radius: 50%;
    background: rgba(52,211,153,0.12); display: flex; align-items: center;
    justify-content: center; flex-shrink: 0;
  }

  /* hero image */
  .im-hero-img-wrap {
    position: relative;
    animation: im-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s both;
  }
  .im-hero-img-frame {
    border-radius: 24px; padding: 2px;
    background: linear-gradient(135deg, rgba(52,211,153,0.35), rgba(16,185,129,0.15), transparent 60%);
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  .im-hero-img-frame:hover { transform: scale(1.02) rotate(-0.5deg); }
  .im-hero-img {
    width: 100%; height: 480px; object-fit: cover;
    border-radius: 22px; display: block;
    filter: brightness(0.88) saturate(1.15);
  }
  /* overlay stats card */
  .im-hero-stat-card {
    position: absolute; bottom: 1.5rem; left: -1.5rem;
    padding: 0.9rem 1.2rem; border-radius: 14px;
    background: rgba(10,16,12,0.88); backdrop-filter: blur(16px);
    border: 1px solid rgba(52,211,153,0.18);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    display: flex; flex-direction: column; gap: 0.15rem;
    animation: im-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s both;
  }
  .im-stat-num {
    font-family: 'Syne',sans-serif; font-weight: 800;
    font-size: 1.5rem; color: #34d399; letter-spacing: -0.03em;
  }
  .im-stat-lbl { font-size: 0.72rem; color: rgba(180,220,200,0.45); }

  @keyframes im-fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  /* ════════════════════════════════════
     PROMO TICKER
  ════════════════════════════════════ */
  .im-ticker {
    background: #34d399; color: #030f07;
    padding: 0.6rem 0; overflow: hidden; white-space: nowrap;
  }
  .im-ticker-track {
    display: inline-flex; gap: 2.5rem;
    animation: im-ticker 26s linear infinite;
  }
  @keyframes im-ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  .im-ticker-item {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-family: 'Syne',sans-serif; font-weight: 700;
    font-size: 0.8rem; letter-spacing: 0.04em; text-transform: uppercase;
    flex-shrink: 0;
  }
  .im-ticker-sep { width: 5px; height: 5px; border-radius: 50%; background: rgba(3,15,7,0.35); }

  /* ════════════════════════════════════
     CATEGORIES
  ════════════════════════════════════ */
  .im-cats-sec { padding: 6rem 0; }
  .im-cats-head { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:2.2rem; flex-wrap:wrap; gap:1rem; }

  .im-cats-scroll {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1rem;
  }
  @media(max-width:900px){ .im-cats-scroll{grid-template-columns:repeat(3,1fr)} }
  @media(max-width:540px){ .im-cats-scroll{grid-template-columns:repeat(2,1fr)} }

  .im-cat {
    display: flex; flex-direction: column; align-items: center;
    gap: 0.75rem; padding: 1.4rem 0.8rem;
    border-radius: 16px; cursor: pointer; text-decoration: none;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
    transition:
      transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
      border-color 0.28s ease, background 0.28s ease;
  }
  .im-cat:hover {
    transform: translateY(-7px) scale(1.03);
    border-color: rgba(52,211,153,0.25); background: rgba(52,211,153,0.04);
  }
  .im-cat-icon {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
  }
  .im-cat:hover .im-cat-icon { transform: scale(1.14) rotate(-5deg); }
  .im-cat-name {
    font-size: 0.78rem; font-weight: 600; color: rgba(200,220,210,0.65);
    text-align: center; line-height: 1.35;
    transition: color 0.22s ease;
  }
  .im-cat:hover .im-cat-name { color: #34d399; }

  /* ════════════════════════════════════
     PRODUCTS
  ════════════════════════════════════ */
  .im-prod-sec { padding: 6rem 0; background: rgba(255,255,255,0.015); }
  .im-prod-head { display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2.2rem;flex-wrap:wrap;gap:1rem; }

  .im-prod-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
  }
  @media(max-width:1024px){ .im-prod-grid{grid-template-columns:repeat(3,1fr)} }
  @media(max-width:640px){ .im-prod-grid{grid-template-columns:repeat(2,1fr)} }

  .im-prod-card {
    border-radius: 16px; overflow: hidden;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    transition:
      transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
      border-color 0.28s ease,
      box-shadow 0.35s ease;
    cursor: pointer;
  }
  .im-prod-card:hover {
    transform: translateY(-7px) scale(1.02);
    border-color: rgba(52,211,153,0.2);
    box-shadow: 0 16px 40px rgba(0,0,0,0.4);
  }

  .im-prod-img {
    aspect-ratio: 1; background-size: cover; background-position: center;
    transition: transform 0.4s ease;
  }
  .im-prod-card:hover .im-prod-img { transform: scale(1.06); }

  .im-prod-body { padding: 0.9rem; }
  .im-prod-shop {
    display: inline-block; padding: 0.15rem 0.5rem;
    border-radius: 5px; font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.05em; text-transform: uppercase;
    background: rgba(52,211,153,0.1); color: #34d399;
    border: 1px solid rgba(52,211,153,0.2); margin-bottom: 0.5rem;
  }
  .im-prod-name {
    font-family: 'Syne',sans-serif; font-weight: 700; font-size: 0.9rem;
    color: #f0f0f5; margin-bottom: 0.2rem;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .im-prod-cat { font-size: 0.75rem; color: rgba(200,220,210,0.4); margin-bottom: 0.7rem; }
  .im-prod-row { display:flex; align-items:center; justify-content:space-between; gap:0.5rem; }
  .im-prod-price {
    font-family: 'Syne',sans-serif; font-weight: 800; font-size: 1.05rem; color: #34d399;
  }
  .im-prod-btn {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.35rem 0.75rem; border-radius: 8px;
    background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.2);
    color: #34d399; font-size: 0.72rem; font-weight: 700;
    text-decoration: none; white-space: nowrap;
    transition: background 0.22s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1);
  }
  .im-prod-btn:hover { background: rgba(52,211,153,0.2); transform: scale(1.06); }

  /* ════════════════════════════════════
     SHOPS
  ════════════════════════════════════ */
  .im-shops-sec { padding: 6rem 0; }
  .im-shops-head { display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2.2rem;flex-wrap:wrap;gap:1rem; }

  .im-shops-grid {
    display: grid; grid-template-columns: repeat(4,1fr); gap: 1.1rem;
  }
  @media(max-width:900px){ .im-shops-grid{grid-template-columns:repeat(2,1fr)} }
  @media(max-width:540px){ .im-shops-grid{grid-template-columns:1fr} }

  .im-shop-card {
    display: block; text-decoration: none;
    padding: 1.6rem; border-radius: 18px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    transition:
      transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
      border-color 0.28s ease, background 0.28s ease;
    position: relative; overflow: hidden;
  }
  .im-shop-card::before {
    content: ''; position: absolute; inset: 0; border-radius: inherit;
    background: radial-gradient(circle at top left, rgba(52,211,153,0.07), transparent 60%);
    opacity: 0; transition: opacity 0.3s ease;
  }
  .im-shop-card:hover {
    transform: translateY(-7px) scale(1.01);
    border-color: rgba(52,211,153,0.22); background: rgba(52,211,153,0.03);
  }
  .im-shop-card:hover::before { opacity: 1; }

  .im-shop-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: linear-gradient(135deg, #34d399, #059669);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1rem; box-shadow: 0 0 18px rgba(52,211,153,0.25);
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
    position: relative; z-index: 1;
  }
  .im-shop-card:hover .im-shop-icon {
    transform: scale(1.1) rotate(-4deg);
    box-shadow: 0 0 28px rgba(52,211,153,0.45);
  }

  .im-shop-name {
    font-family: 'Syne',sans-serif; font-weight: 800;
    font-size: 1rem; color: #f0f0f5; margin-bottom: 0.4rem;
    position: relative; z-index: 1; transition: color 0.22s ease;
  }
  .im-shop-card:hover .im-shop-name { color: #34d399; }

  .im-shop-desc {
    font-size: 0.8rem; color: rgba(200,220,210,0.42);
    line-height: 1.55; margin-bottom: 1rem;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    position: relative; z-index: 1;
  }

  .im-shop-meta {
    display: flex; align-items: center; gap: 0.6rem;
    font-size: 0.75rem; color: rgba(200,220,210,0.38);
    position: relative; z-index: 1;
  }
  .im-shop-rating { color: #f59e0b; font-weight: 700; }
  .im-shop-sep { width: 3px; height: 3px; border-radius: 50%; background: rgba(200,220,210,0.2); }
`

/* ── scroll reveal hook ── */
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('on'); io.disconnect() } },
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

const Rev = ({ children, delay = 0 }) => {
  const ref = useReveal()
  return (
    <div ref={ref} className="im-reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

const CATS = [
  { icon: Apple,          label: 'Fruits',           bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b', slug: 'fruits'     },
  { icon: Leaf,           label: 'Vegetables',        bg: 'rgba(52,211,153,0.1)',   color: '#34d399', slug: 'vegetables' },
  { icon: Coffee,         label: 'Dairy & Eggs',      bg: 'rgba(59,130,246,0.1)',   color: '#60a5fa', slug: 'dairy'      },
  { icon: Cake,           label: 'Bakery',            bg: 'rgba(251,191,36,0.1)',   color: '#fbbf24', slug: 'bakery'     },
  { icon: UtensilsCrossed,label: 'Cloths',            bg: 'rgba(99,102,241,0.1)',   color: '#818cf8', slug: 'cloths'     },
  { icon: Candy,          label: 'Other',             bg: 'rgba(244,63,94,0.1)',    color: '#fb7185', slug: 'other'      },
]

const PROMOS = [
  { icon: TrendingUp, text: '50% OFF on Fresh Vegetables' },
  { icon: Zap,        text: 'Free Delivery Above ₹499'    },
  { icon: ShoppingBag,text: 'Buy 2 Get 1 Free on Dairy'   },
  { icon: TrendingUp, text: 'Flat ₹100 OFF First Order'   },
]

function Home() {
  const { user } = useSelector(state => state.auth)
  const { products, productShops, productLoading, productError, productErrorMessage } =
    useSelector(state => state.product)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // ── Location state ──────────────────────────────────────────────
  const [locationValue, setLocationValue] = useState('')
  const [geoLoading, setGeoLoading]       = useState(false)

  /** Reverse geocode lat/lng → human address via OpenStreetMap Nominatim */
  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      const addr = data?.display_name ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      // Shorten to city-level: "Area, City, State"
      const parts = data?.address ?? {}
      const short = [
        parts.suburb || parts.neighbourhood || parts.village || parts.town,
        parts.city   || parts.county,
        parts.state,
      ].filter(Boolean).join(', ')
      setLocationValue(short || addr)
    } catch {
      setLocationValue(`${lat.toFixed(4)}, ${lng.toFixed(4)}`)
    } finally {
      setGeoLoading(false)
    }
  }, [])

  /** Trigger browser GPS → reverse geocode */
  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => reverseGeocode(coords.latitude, coords.longitude),
      (err) => {
        setGeoLoading(false)
        if (err.code === err.PERMISSION_DENIED)
          toast.error('Location permission denied. Please allow access in browser settings.')
        else
          toast.error('Unable to detect your location. Please type it manually.')
      },
      { timeout: 10000 }
    )
  }, [reverseGeocode])

  /** Find Stores button handler */
  const handleFindStores = useCallback(() => {
    if (!locationValue.trim()) {
      toast.info('Please enter or detect your delivery location first')
      return
    }
    navigate(`/marketplace?location=${encodeURIComponent(locationValue.trim())}`)
  }, [locationValue, navigate])
  // ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!productError) {
      dispatch(getProducts())
      dispatch(getProductShops())
    }
    if (user) dispatch(getCart())
  }, [])

  useEffect(() => {
    if (productError && productErrorMessage) toast.error(productErrorMessage)
  }, [productError, productErrorMessage])

  if (productLoading) return <LoadingScreen />

  const topProducts = products?.slice(0, 5) ?? []
  const topShops    = productShops?.slice(0, 4) ?? []

  return (
    <div className="im-home">
      <style>{css}</style>

      {/* ── HERO ── */}
      <section className="im-hero">
        <div className="im-hero-grid" />
        <div className="im-hero-blob im-hero-blob-1" />
        <div className="im-hero-blob im-hero-blob-2" />

        <div className="im-section im-hero-inner">
          {/* left */}
          <div>
            <div className="im-badge">
              <span className="im-badge-dot" />
              Now in Indore
            </div>

            <h1 className="im-hero-h1">
              Groceries in<br />
              <em>10 minutes,</em><br />
              seriously.
            </h1>

            <p className="im-hero-sub">
              Shop from multiple local stores. Fresh produce, daily essentials,
              and everything you need — delivered to your door instantly.
            </p>

            <div className="im-search-row">
              <div className="im-search-wrap">
                {/* Pin icon → auto-detect GPS */}
                <button
                  className="im-search-icon"
                  onClick={detectLocation}
                  disabled={geoLoading}
                  title="Auto-detect my location"
                  style={{
                    background: 'none', border: 'none', cursor: geoLoading ? 'wait' : 'pointer',
                    padding: 0, display: 'flex', alignItems: 'center',
                    position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)'
                  }}
                >
                  {geoLoading
                    ? <Loader2 size={16} color="#34d399" style={{ animation: 'spin 1s linear infinite' }} />
                    : <Navigation size={16} color="rgba(52,211,153,0.7)" />
                  }
                </button>
                <input
                  id="delivery-location-input"
                  type="text"
                  placeholder="Enter or detect your delivery location"
                  className="im-search-input"
                  value={locationValue}
                  onChange={e => setLocationValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleFindStores()}
                />
              </div>
              <button className="im-find-btn" onClick={handleFindStores}>
                <Zap size={15} /> Find Stores
              </button>
            </div>

            <div className="im-features">
              {[
                { icon: Clock,  label: '10-min delivery' },
                { icon: Store,  label: 'Multiple stores'  },
                { icon: Leaf,   label: 'Fresh products'   },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="im-feature">
                  <div className="im-feature-icon">
                    <Icon size={14} color="#34d399" />
                  </div>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* right — image */}
          <div className="im-hero-img-wrap">
            <div className="im-hero-img-frame">
              <img src={Hero} alt="Fresh groceries" className="im-hero-img" />
            </div>
            <div className="im-hero-stat-card">
              <div className="im-stat-num">10K+</div>
              <div className="im-stat-lbl">Orders delivered today</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROMO TICKER ── */}
      <div className="im-ticker" aria-hidden="true">
        <div className="im-ticker-track">
          {[...PROMOS, ...PROMOS].map(({ icon: Icon, text }, i) => (
            <span key={i} className="im-ticker-item">
              <Icon size={13} />
              {text}
              <span className="im-ticker-sep" />
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="im-cats-sec">
        <div className="im-section">
          <Rev>
            <div className="im-cats-head">
              <div>
                <div className="im-sec-label">Browse</div>
                <div className="im-sec-title">Trending <em>Categories</em></div>
              </div>
              <Link to="/products" className="im-view-all">View All <ArrowRight size={13} /></Link>
            </div>
          </Rev>
          <div className="im-cats-scroll">
            {CATS.map(({ icon: Icon, label, bg, color, slug }, i) => (
              <Rev key={label} delay={i * 60}>
                <Link to={`/products?category=${slug}`} className="im-cat" style={{ textDecoration: 'none' }}>
                  <div className="im-cat-icon" style={{ background: bg }}>
                    <Icon size={22} color={color} />
                  </div>
                  <span className="im-cat-name">{label}</span>
                </Link>
              </Rev>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="im-prod-sec">
        <div className="im-section">
          <Rev>
            <div className="im-prod-head">
              <div>
                <div className="im-sec-label">Fresh picks</div>
                <div className="im-sec-title">Trending <em>Products</em></div>
              </div>
              <Link to="/products" className="im-view-all">View All <ArrowRight size={13} /></Link>
            </div>
          </Rev>
          <div className="im-prod-grid">
            {topProducts.map((product, i) => (
              <Rev key={product._id} delay={i * 65}>
                <div className="im-prod-card">
                  <div
                    className="im-prod-img"
                    style={{ backgroundImage: `url(${product.productImage})` }}
                  />
                  <div className="im-prod-body">
                    <span className="im-prod-shop">{product.shop?.name}</span>
                    <div className="im-prod-name">{product.name}</div>
                    <div className="im-prod-cat">{product.category}</div>
                    <div className="im-prod-row">
                      <span className="im-prod-price">₹{product.price}</span>
                      <Link to={`/products/${product._id}`} className="im-prod-btn">
                        View <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              </Rev>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOPS ── */}
      <section className="im-shops-sec">
        <div className="im-section">
          <Rev>
            <div className="im-shops-head">
              <div>
                <div className="im-sec-label">Near you</div>
                <div className="im-sec-title">Trending <em>Shops</em></div>
              </div>
              <Link to="/marketplace" className="im-view-all">View All <ArrowRight size={13} /></Link>
            </div>
          </Rev>
          <div className="im-shops-grid">
            {topShops.map((shop, i) => (
              <Rev key={shop._id} delay={i * 70}>
                <Link to={`/marketplace/${shop._id}`} className="im-shop-card">
                  <div className="im-shop-icon">
                    <ShoppingBag size={22} color="#030f07" strokeWidth={2.5} />
                  </div>
                  <div className="im-shop-name">{shop.name}</div>
                  <div className="im-shop-desc">{shop.description}</div>
                  <div className="im-shop-meta">
                    <span className="im-shop-rating">★ 4.5</span>
                    <span className="im-shop-sep" />
                    <span>10–15 min</span>
                  </div>
                </Link>
              </Rev>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home