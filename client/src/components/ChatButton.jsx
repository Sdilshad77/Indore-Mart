import { useLocation, Link } from 'react-router-dom';

const css = `
  .cfab-btn {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 40;
    width: 56px; height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #34d399, #059669);
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 24px rgba(52,211,153,0.35);
    transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
    text-decoration: none;
  }
  .cfab-btn:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 8px 32px rgba(52,211,153,0.55);
  }
  .cfab-pulse {
    position: absolute; inset: 0; border-radius: 50%;
    background: rgba(52,211,153,0.3);
    animation: cfab-pulse 2s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes cfab-pulse {
    0%, 100% { transform: scale(1); opacity: 0.4; }
    50%       { transform: scale(1.18); opacity: 0; }
  }
  .cfab-tooltip {
    position: absolute;
    bottom: calc(100% + 10px); right: 0;
    background: rgba(6,12,9,0.95);
    border: 1px solid rgba(52,211,153,0.2);
    color: #e7f6ee;
    font-size: 0.78rem; font-weight: 600;
    padding: 0.4rem 0.75rem;
    border-radius: 10px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }
  .cfab-btn:hover .cfab-tooltip { opacity: 1; }
`;

export default function ChatFab() {
    const { pathname } = useLocation();

    // Hide on admin, shop, and chat pages
    if (
        pathname.startsWith('/admin') ||
        pathname.startsWith('/shop') ||
        pathname.includes('/chat')
    ) return null;

    return (
        <>
            <style>{css}</style>
            <Link to="/chat" className="cfab-btn" aria-label="Chat with AI">
                <span className="cfab-pulse" />
                <svg
                    width="24" height="24"
                    fill="none" stroke="#030f07" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    style={{ position: 'relative', zIndex: 1 }}
                >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="cfab-tooltip">Chat with AI 🤖</span>
            </Link>
        </>
    );
}
