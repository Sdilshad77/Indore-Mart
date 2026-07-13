import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../features/auth/authSlice';

function Register() {
    const { user, isLoading, isError, message } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', confirmPassword: '', address: ''
    });
    const [showPwd, setShowPwd] = useState(false);
    const [showCPwd, setShowCPwd] = useState(false);
    const [strength, setStrength] = useState(0);

    const { name, email, phone, password, confirmPassword, address } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'password') calcStrength(e.target.value);
    };

    const calcStrength = (val) => {
        let s = 0;
        if (val.length >= 8) s += 25;
        if (/[A-Z]/.test(val)) s += 25;
        if (/[0-9]/.test(val)) s += 25;
        if (/[^A-Za-z0-9]/.test(val)) s += 25;
        setStrength(s);
    };

    const strengthColor = strength <= 25 ? '#ff4444' : strength <= 50 ? '#ffaa00' : strength <= 75 ? '#00c9a0' : '#00e87b';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords Not Match!', { position: 'top-center' });
        } else {
            dispatch(registerUser(formData));
        }
    };

    useEffect(() => {
        if (user) navigate('/');
        if (isError && message) toast.error(message, { position: 'top-center' });
    }, [user, isError, message]);

    if (isLoading) {
        return (
            <div style={styles.loadingWrap}>
                <div style={styles.loadingDot} />
                <div style={{ ...styles.loadingDot, animationDelay: '0.15s' }} />
                <div style={{ ...styles.loadingDot, animationDelay: '0.3s' }} />
                <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
            </div>
        );
    }

    return (
        <div style={styles.wrap}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'DM Sans', sans-serif; }
                @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
                @keyframes blobFloat { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
                .reg-input { width:100%; background:#1a1a1a; border:0.5px solid #222; border-radius:12px; padding:13px 44px 13px 16px; color:#fff; font-size:14px; font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.25s, box-shadow 0.25s, transform 0.2s; }
                .reg-input::placeholder { color:#444; }
                .reg-input:focus { border-color:#00e87b; box-shadow:0 0 0 3px rgba(0,232,123,0.12); transform:translateY(-1px); }
                .reg-input:hover:not(:focus) { border-color:#333; }
                .submit-btn { width:100%; padding:15px; background:linear-gradient(135deg,#00e87b,#00c9a0); border:none; border-radius:14px; color:#000; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600; cursor:pointer; letter-spacing:0.3px; transition:transform 0.2s, box-shadow 0.3s, opacity 0.2s; position:relative; overflow:hidden; }
                .submit-btn:hover { transform:translateY(-2px); box-shadow:0 12px 30px rgba(0,232,123,0.35); }
                .submit-btn:active { transform:scale(0.98); }
                .eye-btn { position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#888; padding:4px; display:flex; align-items:center; justify-content:center; transition:color 0.2s; }
                .eye-btn:hover { color:#00e87b; }
                .login-link { color:#00e87b; font-weight:600; cursor:pointer; transition:color 0.2s; text-decoration:none; }
                .login-link:hover { color:#fff; }
                .terms-link { color:#00e87b; text-decoration:none; }
                .terms-link:hover { color:#fff; }
                .two-col-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
                @media(max-width:480px){ .two-col-grid{ grid-template-columns:1fr; } }
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
                        Join the{' '}
                        <span style={{ background: 'linear-gradient(135deg,#00e87b,#00c9a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Drop.
                        </span>
                    </h1>
                    <p style={styles.subtext}>Groceries in 10 mins — seriously fr fr 🛒</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Name */}
                    <Field label="Full Name">
                        <input className="reg-input" type="text" name="name" value={name} onChange={handleChange} placeholder="What do ur friends call u?" />
                    </Field>

                    {/* Email + Phone */}
                    <div className="two-col-grid">
                        <Field label="Email">
                            <input className="reg-input" type="email" name="email" value={email} onChange={handleChange} placeholder="ur@email.com" />
                        </Field>
                        <Field label="Phone">
                            <input className="reg-input" type="tel" name="phone" value={phone} onChange={handleChange} placeholder="+91 XXXXX" />
                        </Field>
                    </div>

                    {/* Address */}
                    <Field label="Address">
                        <input className="reg-input" type="text" name="address" value={address} onChange={handleChange} placeholder="Where should we drop the goods?" />
                    </Field>

                    {/* Password */}
                    <Field label="Password">
                        <div style={{ position: 'relative' }}>
                            <input className="reg-input" type={showPwd ? 'text' : 'password'} name="password" value={password} onChange={handleChange} placeholder="Make it spicy 🌶️" />
                            <button type="button" className="eye-btn" onClick={() => setShowPwd(!showPwd)}>
                                <EyeIcon open={showPwd} />
                            </button>
                        </div>
                        {/* Strength Bar */}
                        <div style={{ height: 3, borderRadius: 2, background: '#222', marginTop: 6, overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 2, width: strength + '%', background: strengthColor, transition: 'width 0.4s, background 0.4s' }} />
                        </div>
                    </Field>

                    {/* Confirm Password */}
                    <Field label="Confirm Password">
                        <div style={{ position: 'relative' }}>
                            <input className="reg-input" type={showCPwd ? 'text' : 'password'} name="confirmPassword" value={confirmPassword} onChange={handleChange} placeholder="Say it again bestie" />
                            <button type="button" className="eye-btn" onClick={() => setShowCPwd(!showCPwd)}>
                                <EyeIcon open={showCPwd} />
                            </button>
                        </div>
                    </Field>

                    <button type="submit" className="submit-btn" style={{ marginTop: '0.5rem' }}>
                        Create Account ✦
                    </button>

                    <p style={{ fontSize: 11, color: '#888', textAlign: 'center', lineHeight: 1.7 }}>
                        By signing up, u agree to our{' '}
                        <a className="terms-link">Terms</a> and{' '}
                        <a className="terms-link">Privacy Policy</a> no cap.
                    </p>
                </form>

                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '0.5px solid #222', textAlign: 'center', fontSize: 13, color: '#888' }}>
                    Already got an account?{' '}
                    <a className="login-link" onClick={() => navigate('/login')}>Log in →</a>
                </div>
            </div>
        </div>
    );
}

// Helper Components
function Field({ label, children }) {
    return (
        <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>
                {label}
            </label>
            {children}
        </div>
    );
}

function EyeIcon({ open }) {
    return open ? (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    ) : (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
    );
}

// Styles
const styles = {
    wrap: {
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        overflow: 'hidden',
    },
    blob: {
        position: 'absolute',
        borderRadius: '50%',
        filter: 'blur(80px)',
        opacity: 0.15,
        pointerEvents: 'none',
    },
    card: {
        background: '#111',
        border: '0.5px solid #222',
        borderRadius: 24,
        padding: '2.5rem 2rem',
        width: '100%',
        maxWidth: 460,
        position: 'relative',
        animation: 'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
    },
    logoRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2rem' },
    logoBox: {
        width: 40, height: 40,
        background: 'linear-gradient(135deg,#00e87b,#00c9a0)',
        borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    logoText: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#fff', letterSpacing: 1 },
    badge: {
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: 'rgba(0,232,123,0.1)',
        border: '0.5px solid rgba(0,232,123,0.25)',
        color: '#00e87b', fontSize: 10, fontWeight: 600, letterSpacing: 1,
        textTransform: 'uppercase', padding: '4px 10px', borderRadius: 20, marginBottom: '1rem',
    },
    badgeDot: {
        width: 6, height: 6, background: '#00e87b', borderRadius: '50%',
        display: 'inline-block', animation: 'pulse 2s infinite',
    },
    heading: {
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 'clamp(1.8rem, 8vw, 2.6rem)', color: '#fff', lineHeight: 1, letterSpacing: 1,
    },
    subtext: { color: '#888', fontSize: 13, marginTop: 6, fontWeight: 300 },
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

export default Register;