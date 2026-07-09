import { ShoppingBag } from 'lucide-react'

/* ─── Gen-Z LoadingScreen ───────────────────────────────────────────────────
   Dark glass · emerald neon · animated grid · spring pulse · dum wala feel
   ─────────────────────────────────────────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

  .ls-root {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #060c08;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
  }

  /* drifting grid */
  .ls-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(52,211,153,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(52,211,153,0.05) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%);
    animation: ls-grid 18s linear infinite;
  }
  @keyframes ls-grid {
    from { background-position: 0 0; }
    to   { background-position: 48px 48px; }
  }

  /* ambient blobs */
  .ls-blob-1 {
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    animation: ls-pulse-blob 3.5s ease-in-out infinite;
    pointer-events: none;
  }
  .ls-blob-2 {
    position: absolute;
    width: 280px; height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%);
    top: 30%; left: 60%;
    animation: ls-float 7s ease-in-out infinite;
    pointer-events: none;
    filter: blur(20px);
  }
  @keyframes ls-pulse-blob {
    0%,100% { transform: translate(-50%,-50%) scale(1);   opacity: 0.6; }
    50%      { transform: translate(-50%,-50%) scale(1.18); opacity: 1;   }
  }
  @keyframes ls-float {
    0%,100% { transform: translate(0,0); }
    50%     { transform: translate(-20px,-28px); }
  }

  /* ── CENTER CONTENT ── */
  .ls-center {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.4rem;
    animation: ls-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes ls-fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* icon ring */
  .ls-icon-ring {
    position: relative;
    width: 96px; height: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* spinning ring */
  .ls-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: #34d399;
    border-right-color: rgba(52,211,153,0.3);
    animation: ls-spin 1.1s linear infinite;
  }
  .ls-ring-2 {
    position: absolute;
    inset: 8px;
    border-radius: 50%;
    border: 1.5px solid transparent;
    border-bottom-color: rgba(52,211,153,0.5);
    animation: ls-spin 1.8s linear infinite reverse;
  }
  @keyframes ls-spin { to { transform: rotate(360deg); } }

  /* icon box */
  .ls-icon-box {
    position: relative;
    width: 64px; height: 64px;
    border-radius: 18px;
    background: linear-gradient(135deg, #34d399 0%, #059669 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 32px rgba(52,211,153,0.45), 0 0 0 1px rgba(52,211,153,0.2);
    animation: ls-icon-pulse 2.4s ease-in-out infinite;
  }
  @keyframes ls-icon-pulse {
    0%,100% { box-shadow: 0 0 32px rgba(52,211,153,0.45), 0 0 0 1px rgba(52,211,153,0.2); transform: scale(1); }
    50%      { box-shadow: 0 0 52px rgba(52,211,153,0.7), 0 0 0 1px rgba(52,211,153,0.4); transform: scale(1.06); }
  }

  /* text */
  .ls-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.9rem;
    letter-spacing: -0.04em;
    background: linear-gradient(90deg, #34d399 0%, #6ee7b7 60%, #a7f3d0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.3rem;
    text-align: center;
  }

  .ls-msg {
    font-size: 0.82rem;
    font-weight: 500;
    color: rgba(180,220,200,0.5);
    text-align: center;
    letter-spacing: 0.02em;
  }

  /* dot loader */
  .ls-dots {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .ls-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #34d399;
    animation: ls-dot-bounce 1.3s ease-in-out infinite both;
  }
  .ls-dot:nth-child(1) { animation-delay: 0s; }
  .ls-dot:nth-child(2) { animation-delay: 0.18s; }
  .ls-dot:nth-child(3) { animation-delay: 0.36s; }
  @keyframes ls-dot-bounce {
    0%,80%,100% { transform: scale(0.6); opacity: 0.4; }
    40%          { transform: scale(1.2); opacity: 1;   }
  }

  /* sub hint */
  .ls-hint {
    font-size: 0.7rem;
    color: rgba(150,200,175,0.28);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-top: -1rem;
  }
`

function LoadingScreen({ loadingMessage = 'Preparing your experience' }) {
  return (
    <div className="ls-root">
      <style>{css}</style>

      <div className="ls-grid" />
      <div className="ls-blob-1" />
      <div className="ls-blob-2" />

      <div className="ls-center">

        {/* icon with spinning rings */}
        <div className="ls-icon-ring">
          <div className="ls-ring" />
          <div className="ls-ring-2" />
          <div className="ls-icon-box">
            <ShoppingBag size={28} color="#030f07" strokeWidth={2.5} />
          </div>
        </div>

        {/* text */}
        <div style={{ textAlign: 'center' }}>
          <div className="ls-title">IndoreMart</div>
          <div className="ls-msg">{loadingMessage}</div>
        </div>

        {/* dots */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem' }}>
          <div className="ls-dots">
            <div className="ls-dot" />
            <div className="ls-dot" />
            <div className="ls-dot" />
          </div>
          <div className="ls-hint">This may take a moment</div>
        </div>

      </div>
    </div>
  )
}

export default LoadingScreen