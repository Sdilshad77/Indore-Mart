import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, ShoppingBag, Package, Home } from 'lucide-react'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .os-root {
    min-height: 100vh;
    background: #080808;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    position: relative;
    overflow: hidden;
  }

  /* ambient radial glow */
  .os-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background: radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,232,123,0.12) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .os-card {
    position: relative; z-index: 1;
    background: #111;
    border: 0.5px solid #222;
    border-radius: 28px;
    padding: 2.5rem 2rem;
    width: 100%; max-width: 460px;
    text-align: center;
    animation: os-in 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes os-in { from{opacity:0;transform:translateY(32px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

  .os-icon-wrap {
    width: 90px; height: 90px;
    margin: 0 auto 1.5rem;
    background: rgba(0,232,123,0.08);
    border: 2px solid rgba(0,232,123,0.3);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    animation: os-pop 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
  }
  @keyframes os-pop { from{opacity:0;transform:scale(0)} to{opacity:1;transform:scale(1)} }

  .os-badge {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(0,232,123,0.08); border: 0.5px solid rgba(0,232,123,0.25);
    color: #00e87b; font-size: 10px; font-weight: 600; letter-spacing: 1px;
    text-transform: uppercase; padding: 4px 10px; border-radius: 20px; margin-bottom: 10px;
    animation: os-fade 0.5s ease 0.1s both;
  }
  @keyframes os-fade { from{opacity:0} to{opacity:1} }

  .os-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.2rem, 8vw, 3rem);
    color: #fff; letter-spacing: 1px; line-height: 1;
    margin-bottom: 8px;
    animation: os-fade 0.5s ease 0.25s both;
  }
  .os-title span {
    background: linear-gradient(135deg,#00e87b,#00c9a0);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .os-sub {
    font-size: 13px; color: #555; margin-bottom: 2rem;
    animation: os-fade 0.5s ease 0.35s both;
  }

  .os-details {
    background: #0d0d0d; border: 0.5px solid #1a1a1a; border-radius: 16px;
    padding: 1.2rem 1.4rem; margin-bottom: 1.5rem;
    display: flex; flex-direction: column; gap: 10px;
    animation: os-fade 0.5s ease 0.4s both;
    text-align: left;
  }
  .os-detail-row {
    display: flex; align-items: center; justify-content: space-between;
  }
  .os-detail-label { font-size: 11px; color: #444; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
  .os-detail-val { font-size: 13px; color: #ccc; font-weight: 500; }
  .os-detail-val.green { color: #00e87b; }
  .os-divider { height: 0.5px; background: #1a1a1a; }

  .os-btn-primary {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg,#00e87b,#00c9a0);
    border: none; border-radius: 14px;
    color: #000; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: transform 0.2s, box-shadow 0.3s;
    animation: os-fade 0.5s ease 0.5s both;
    margin-bottom: 10px;
  }
  .os-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,232,123,0.3); }
  .os-btn-primary:active { transform: scale(0.98); }

  .os-btn-secondary {
    width: 100%; padding: 13px;
    background: transparent; border: 0.5px solid #222; border-radius: 14px;
    color: #888; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: border-color 0.2s, color 0.2s;
    animation: os-fade 0.5s ease 0.55s both;
  }
  .os-btn-secondary:hover { border-color: #00e87b; color: #00e87b; }

  /* particles canvas */
  .os-canvas {
    position: fixed; inset: 0;
    pointer-events: none; z-index: 0;
  }

  @media(max-width:480px){
    .os-card { padding: 2rem 1.2rem; }
  }
`

// Simple confetti particle animation on canvas
function useConfetti(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const COLORS = ['#00e87b', '#00c9a0', '#fff', '#fac775', '#85b7eb']
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 5 + 3,
      d: Math.random() * 60 + 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltAngleInc: (Math.random() * 0.07) + 0.05,
    }))

    let angle = 0
    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      angle += 0.01
      particles.forEach(p => {
        p.tiltAngle += p.tiltAngleInc
        p.y += (Math.cos(angle + p.d) + 1.5) * 1.2
        p.tilt = Math.sin(p.tiltAngle) * 15
        if (p.y > canvas.height) {
          p.y = -10
          p.x = Math.random() * canvas.width
        }
        ctx.beginPath()
        ctx.lineWidth = p.r
        ctx.strokeStyle = p.color
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y)
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4)
        ctx.stroke()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    // Stop after 4s to save perf
    const timer = setTimeout(() => cancelAnimationFrame(raf), 4000)
    return () => { cancelAnimationFrame(raf); clearTimeout(timer) }
  }, [])
}

export default function OrderSuccess() {
  const navigate = useNavigate()
  const location = useLocation()
  const canvasRef = useRef(null)
  useConfetti(canvasRef)

  // Read order details passed via navigation state
  const state = location.state || {}
  const total = state.total ?? '—'
  const couponCode = state.couponCode || null
  const discount = state.discount ?? 0
  const orderId = state.orderId || ('ORD' + Math.random().toString(36).slice(2, 8).toUpperCase())

  return (
    <div className="os-root">
      <style>{css}</style>
      <canvas className="os-canvas" ref={canvasRef} />

      <div className="os-card">
        {/* Icon */}
        <div className="os-icon-wrap">
          <CheckCircle size={44} color="#00e87b" strokeWidth={1.5} />
        </div>

        {/* Badge */}
        <div className="os-badge">
          <span style={{ width: 6, height: 6, background: '#00e87b', borderRadius: '50%', display: 'inline-block' }} />
          Order Confirmed
        </div>

        {/* Title */}
        <h1 className="os-title">
          Payment{' '}
          <span>Success!</span>
        </h1>
        <p className="os-sub">
          Your order has been placed & is being prepared 🎉
        </p>

        {/* Details */}
        <div className="os-details">
          <div className="os-detail-row">
            <span className="os-detail-label">Order ID</span>
            <span className="os-detail-val">#{orderId}</span>
          </div>
          <div className="os-divider" />
          <div className="os-detail-row">
            <span className="os-detail-label">Amount Paid</span>
            <span className="os-detail-val green">₹{typeof total === 'number' ? total.toFixed(0) : total}</span>
          </div>
          {discount > 0 && (
            <>
              <div className="os-divider" />
              <div className="os-detail-row">
                <span className="os-detail-label">You Saved</span>
                <span className="os-detail-val green">₹{typeof discount === 'number' ? discount.toFixed(0) : discount}</span>
              </div>
            </>
          )}
          {couponCode && (
            <>
              <div className="os-divider" />
              <div className="os-detail-row">
                <span className="os-detail-label">Coupon Used</span>
                <span className="os-detail-val">{couponCode.toUpperCase()}</span>
              </div>
            </>
          )}
          <div className="os-divider" />
          <div className="os-detail-row">
            <span className="os-detail-label">Status</span>
            <span className="os-detail-val green">✓ Confirmed</span>
          </div>
        </div>

        {/* Actions */}
        <button className="os-btn-primary" onClick={() => navigate('/auth/profile')}>
          <Package size={16} />
          Track My Orders
        </button>
        <button className="os-btn-secondary" onClick={() => navigate('/')}>
          <Home size={16} />
          Back to Home
        </button>
      </div>
    </div>
  )
}
