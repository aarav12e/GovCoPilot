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
        <WarpBackground>
            <div className="card w-full bg-base-300 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 border border-border1/50 backdrop-blur-xl">
                <div className="card-body">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(99,102,241,0.5)] mb-4">
                            🏛️
                        </div>
                        <h2 className="text-3xl font-display font-black text-white">Gov<span className="text-indigo-400">CoPilot</span></h2>
                        <p className="text-sm text-base-content/60 mt-1 uppercase tracking-widest font-semibold">Leadership Portal</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-base-content/80">Username</span>
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="input input-bordered input-primary w-full bg-base-200/50 focus:bg-base-200 focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-base-content/80">Password</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="input input-bordered input-primary w-full bg-base-200/50 focus:bg-base-200 focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                                required
                            />
                        </div>

                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className={`btn btn-primary w-full shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all hover:scale-[1.02] border-0 bg-indigo-600 hover:bg-indigo-500 text-white ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Authenticating...' : 'Secure Login'}
                            </button>
                        </div>
                    </form>

                    <div className="divider text-base-content/40 text-sm">Demo Mode</div>
                    <p className="text-center text-xs text-base-content/50">
                        Use <b className="text-indigo-400">leader</b> / <b className="text-indigo-400">password123</b> to access the portal.
                    </p>
                </div>
            </div>
        </WarpBackground>
    )
}
