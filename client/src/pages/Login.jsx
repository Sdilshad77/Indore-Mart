import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../features/auth/authSlice';

function Login() {
    const { user, isLoading, isError, message } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPwd, setShowPwd] = useState(false);
    const [remember, setRemember] = useState(false);

    const { email, password } = formData;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    useEffect(() => {
        if (user) navigate('/');
        if (isError && message) toast.error(message, { position: 'top-center' });
    }, [user, isError, message]);

    if (isLoading) {
        return (
            <div style={styles.loadingWrap}>
                <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
                {[0, 0.15, 0.3].map((d, i) => (
                    <div key={i} style={{ ...styles.loadingDot, animationDelay: `${d}s` }} />
                ))}
            </div>
        );
    }

    return (
        <div style={styles.wrap}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
                @keyframes blobFloat { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
                .lg-input { width:100%; background:#1a1a1a; border:0.5px solid #222; border-radius:12px; padding:13px 44px 13px 16px; color:#fff; font-size:14px; font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.25s, box-shadow 0.25s, transform 0.2s; }
                .lg-input::placeholder { color:#444; }
                .lg-input:focus { border-color:#00e87b; box-shadow:0 0 0 3px rgba(0,232,123,0.12); transform:translateY(-1px); }
                .lg-input:hover:not(:focus) { border-color:#333; }
                .submit-btn { width:100%; padding:15px; background:linear-gradient(135deg,#00e87b,#00c9a0); border:none; border-radius:14px; color:#000; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600; cursor:pointer; transition:transform 0.2s, box-shadow 0.3s; }
                .submit-btn:hover { transform:translateY(-2px); box-shadow:0 12px 30px rgba(0,232,123,0.35); }
                .submit-btn:active { transform:scale(0.98); }
                .eye-btn { position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#888; padding:4px; display:flex; align-items:center; transition:color 0.2s; }
                .eye-btn:hover { color:#00e87b; }
                .social-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:8px; padding:12px; background:#1a1a1a; border:0.5px solid #222; border-radius:12px; color:#ccc; font-size:13px; font-weight:500; font-family:'DM Sans',sans-serif; cursor:pointer; transition:border-color 0.2s, background 0.2s, transform 0.15s; }
                .social-btn:hover { border-color:#333; background:#222; transform:translateY(-1px); }
                .social-btn:active { transform:scale(0.98); }
                .nav-link { color:#00e87b; font-weight:600; cursor:pointer; text-decoration:none; transition:color 0.2s; }
                .nav-link:hover { color:#fff; }
                .forgot-link { color:#888; font-size:12px; cursor:pointer; text-decoration:none; transition:color 0.2s; }
                .forgot-link:hover { color:#00e87b; }
                .checkbox-custom { width:16px; height:16px; border:0.5px solid #444; border-radius:4px; background:#1a1a1a; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:border-color 0.2s, background 0.2s; }
                .checkbox-custom.checked { background:#00e87b; border-color:#00e87b; }
            `}</style>

            {/* BG Blobs */}
            <div style={{ ...styles.blob, width: 400, height: 400, background: '#00e87b', top: -100, right: -100, animation: 'blobFloat 8s ease-in-out infinite' }} />
            <div style={{ ...styles.blob, width: 300, height: 300, background: '#00c9a0', bottom: -80, left: -80, animation: 'blobFloat 10s ease-in-out infinite reverse' }} />
            <div style={{ ...styles.blob, width: 200, height: 200, background: '#1aff8c', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'blobFloat 12s ease-in-out infinite' }} />

            <div style={styles.card}>
                {/* Logo */}
                <div style={styles.logoRow}>
                    <div style={styles.logoBox}>
                        <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                    </div>
                    <span style={styles.logoText}>Indore<span style={{ color: '#00e87b' }}>Mart</span></span>
                </div>

                {/* Badge */}
                <div style={styles.badge}>
                    <span style={styles.badgeDot} />
                    NOW IN INDORE
                </div>

                {/* Heading */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={styles.heading}>
                        Welcome{' '}
                        <span style={{ background: 'linear-gradient(135deg,#00e87b,#00c9a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Back.
                        </span>
                    </h1>
                    <p style={styles.subtext}>ur groceries missed u ngl 🛒</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Email */}
                    <div>
                        <label style={styles.label}>Email or Phone</label>
                        <input
                            className="lg-input"
                            type="text"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="ur@email.com or +91 XXXXX"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label style={styles.label}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="lg-input"
                                type={showPwd ? 'text' : 'password'}
                                name="password"
                                value={password}
                                onChange={handleChange}
                                placeholder="shhh... 🤫"
                            />
                            <button type="button" className="eye-btn" onClick={() => setShowPwd(!showPwd)}>
                                {showPwd ? (
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember + Forgot */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div
                            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                            onClick={() => setRemember(!remember)}
                        >
                            <div className={`checkbox-custom${remember ? ' checked' : ''}`}>
                                {remember && (
                                    <svg width="10" height="10" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>
                            <span style={{ fontSize: 12, color: '#888' }}>Remember me</span>
                        </div>
                        <a className="forgot-link">Forgot password?</a>
                    </div>

                    <button type="submit" className="submit-btn" style={{ marginTop: '0.5rem' }}>
                        Let me in ✦
                    </button>
                </form>

                {/* Divider */}
                <div style={styles.divider}>
                    <div style={styles.dividerLine} />
                    <span style={styles.dividerText}>or vibe with</span>
                    <div style={styles.dividerLine} />
                </div>

                {/* Social Buttons */}
                <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem' }}>
                    <button className="social-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                    <button className="social-btn">
                        <svg width="18" height="18" fill="#1877F2" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                    </button>
                </div>

                <div style={{ paddingTop: '1.5rem', borderTop: '0.5px solid #222', textAlign: 'center', fontSize: 13, color: '#888' }}>
                    No account yet?{' '}
                    <a className="nav-link" onClick={() => navigate('/register')}>Sign up →</a>
                </div>
            </div>
        </div>
    );
}

const styles = {
    wrap: {
        minHeight: '100vh', background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem', fontFamily: "'DM Sans', sans-serif",
        position: 'relative', overflow: 'hidden',
    },
    blob: {
        position: 'absolute', borderRadius: '50%',
        filter: 'blur(80px)', opacity: 0.15, pointerEvents: 'none',
    },
    card: {
        background: '#111', border: '0.5px solid #222', borderRadius: 24,
        padding: '2.5rem 2rem', width: '100%', maxWidth: 420,
        position: 'relative', animation: 'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
    },
    logoRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2rem' },
    logoBox: {
        width: 40, height: 40,
        background: 'linear-gradient(135deg,#00e87b,#00c9a0)',
        borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    logoText: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#fff', letterSpacing: 1 },
    badge: {
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: 'rgba(0,232,123,0.1)', border: '0.5px solid rgba(0,232,123,0.25)',
        color: '#00e87b', fontSize: 10, fontWeight: 600, letterSpacing: 1,
        textTransform: 'uppercase', padding: '4px 10px', borderRadius: 20, marginBottom: '1rem',
    },
    badgeDot: {
        width: 6, height: 6, background: '#00e87b', borderRadius: '50%',
        display: 'inline-block', animation: 'pulse 2s infinite',
    },
    heading: {
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 42, color: '#fff', lineHeight: 1, letterSpacing: 1,
    },
    subtext: { color: '#888', fontSize: 13, marginTop: 6, fontWeight: 300 },
    label: { display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', color: '#888', textTransform: 'uppercase', marginBottom: 6 },
    divider: { display: 'flex', alignItems: 'center', gap: 12, margin: '1.5rem 0 1rem' },
    dividerLine: { flex: 1, height: '0.5px', background: '#222' },
    dividerText: { fontSize: 11, color: '#555', whiteSpace: 'nowrap' },
    loadingWrap: {
        minHeight: '100vh', background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    },
    loadingDot: {
        width: 12, height: 12, borderRadius: '50%',
        background: 'linear-gradient(135deg,#00e87b,#00c9a0)',
        animation: 'bounce 0.6s ease-in-out infinite',
    },
};

export default Login;