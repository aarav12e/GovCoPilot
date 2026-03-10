import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { WarpBackground } from '../ui/warp-background'

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('leader')
    const [password, setPassword] = useState('password123')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            if (username === 'leader' && password === 'password123') {
                toast.success("Welcome back, Leader!", { icon: "🏛️" })
                localStorage.setItem("is_logged_in", "true")
                onLogin(true)
                navigate('/dashboard')
            } else {
                toast.error("Invalid credentials. Use leader / password123.")
            }
            setLoading(false)
        }, 800)
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

                .lc-card {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 420px;
                    padding: 2.5rem;
                    border-radius: 20px;
                    background: rgba(13, 15, 23, 0.85);
                    border: 1px solid rgba(99,102,241,0.2);
                    backdrop-filter: blur(24px);
                    box-shadow:
                        0 0 0 1px rgba(255,255,255,0.04),
                        0 32px 80px rgba(0,0,0,0.6),
                        0 0 60px rgba(99,102,241,0.08);
                    animation: lcCardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                    transform: translateY(20px);
                    font-family: 'DM Mono', monospace;
                }

                .lc-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.8), rgba(139,92,246,0.6), transparent);
                    border-radius: 0 0 8px 8px;
                }

                @keyframes lcCardIn {
                    to { opacity: 1; transform: translateY(0); }
                }

                .lc-header { text-align: center; margin-bottom: 2rem; }

                .lc-icon {
                    width: 56px; height: 56px;
                    border-radius: 14px;
                    background: linear-gradient(135deg, #4f46e5, #7c3aed);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.5rem;
                    margin: 0 auto 0.75rem;
                    box-shadow: 0 0 30px rgba(99,102,241,0.45);
                }

                .lc-brand {
                    font-family: 'Syne', sans-serif;
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #fff;
                    letter-spacing: -0.02em;
                }

                .lc-brand span {
                    background: linear-gradient(135deg, #818cf8, #a78bfa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .lc-subtitle {
                    font-size: 0.65rem;
                    color: rgba(255,255,255,0.3);
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    margin-top: 4px;
                }

                .lc-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 3px 10px;
                    background: rgba(99,102,241,0.1);
                    border: 1px solid rgba(99,102,241,0.2);
                    border-radius: 100px;
                    font-size: 0.65rem;
                    color: rgba(129,140,248,0.7);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    margin-bottom: 0.75rem;
                    font-family: 'DM Mono', monospace;
                }

                .lc-badge::before {
                    content: '';
                    width: 5px; height: 5px;
                    border-radius: 50%;
                    background: #6366f1;
                    box-shadow: 0 0 6px #6366f1;
                    animation: lcPulse 2s ease-in-out infinite;
                }

                @keyframes lcPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }

                .lc-form { display: flex; flex-direction: column; gap: 1.25rem; }

                .lc-field { display: flex; flex-direction: column; gap: 6px; }

                .lc-label {
                    font-size: 0.68rem;
                    font-weight: 500;
                    color: rgba(255,255,255,0.4);
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                }

                .lc-input-wrap { position: relative; }

                .lc-input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: #e2e8f0;
                    font-family: 'DM Mono', monospace;
                    font-size: 0.875rem;
                    outline: none;
                    transition: all 0.2s ease;
                }

                .lc-input:focus {
                    background: rgba(99,102,241,0.06);
                    border-color: rgba(99,102,241,0.5);
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
                    color: #fff;
                }

                .lc-input-glow {
                    position: absolute;
                    inset: 0;
                    border-radius: 10px;
                    background: radial-gradient(ellipse at 50% 100%, rgba(99,102,241,0.15), transparent 60%);
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .lc-input:focus + .lc-input-glow { opacity: 1; }

                .lc-btn {
                    margin-top: 0.5rem;
                    width: 100%;
                    padding: 0.875rem;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #4f46e5, #6d28d9);
                    color: #fff;
                    font-family: 'Syne', sans-serif;
                    font-size: 0.875rem;
                    font-weight: 700;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 20px rgba(79,70,229,0.35);
                    position: relative;
                    overflow: hidden;
                }

                .lc-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
                }

                .lc-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 28px rgba(79,70,229,0.5);
                }

                .lc-btn:disabled { opacity: 0.7; cursor: not-allowed; }

                .lc-spinner {
                    display: inline-block;
                    width: 13px; height: 13px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: lcSpin 0.7s linear infinite;
                    margin-right: 8px;
                    vertical-align: middle;
                }

                @keyframes lcSpin { to { transform: rotate(360deg); } }

                .lc-divider {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin: 1.5rem 0 1rem;
                    color: rgba(255,255,255,0.2);
                    font-size: 0.65rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                }

                .lc-divider::before, .lc-divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: rgba(255,255,255,0.08);
                }

                .lc-hint {
                    text-align: center;
                    font-size: 0.75rem;
                    color: rgba(255,255,255,0.25);
                    line-height: 1.6;
                }

                .lc-hint b { color: rgba(129,140,248,0.8); font-weight: 500; }
            `}</style>

            <WarpBackground>
                <div className="lc-card">
                    <div className="lc-header">
                        <div className="lc-icon">🏛️</div>
                        <div className="lc-badge">Secure Portal</div>
                        <div className="lc-brand">Gov<span>CoPilot</span></div>
                        <div className="lc-subtitle">Leadership Command Center</div>
                    </div>

                    <form className="lc-form" onSubmit={handleLogin}>
                        <div className="lc-field">
                            <label className="lc-label">Username</label>
                            <div className="lc-input-wrap">
                                <input
                                    className="lc-input"
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    required
                                />
                                <div className="lc-input-glow" />
                            </div>
                        </div>

                        <div className="lc-field">
                            <label className="lc-label">Password</label>
                            <div className="lc-input-wrap">
                                <input
                                    className="lc-input"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                                <div className="lc-input-glow" />
                            </div>
                        </div>

                        <button className="lc-btn" type="submit" disabled={loading}>
                            {loading && <span className="lc-spinner" />}
                            {loading ? 'Authenticating...' : 'Secure Login'}
                        </button>
                    </form>

                    <div className="lc-divider">Demo Mode</div>
                    <p className="lc-hint">
                        Use <b>leader</b> / <b>password123</b> to access the portal
                    </p>
                </div>
            </WarpBackground>
        </>
    )
}