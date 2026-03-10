// Shared UI components

export function Card({ children, className = '' }) {
  return <div className={`bg-card border border-border1 rounded-xl p-5 ${className}`}>{children}</div>
}

export function StatCard({ label, value, sub, icon, accent = 'saffron' }) {
  const colors = { saffron:'from-saffron', green:'from-green2', blue:'from-blue-500', rose:'from-rose-500', teal:'from-teal-500' }
  return (
    <div className="bg-card border border-border1 rounded-xl p-5 relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r to-transparent ${colors[accent]}`}/>
      <div className="text-[10px] tracking-widest uppercase text-text3 mb-2">{label}</div>
      <div className="font-display font-black text-3xl text-text1 leading-none mb-1.5">{value}</div>
      <div className="text-xs text-text3">{sub}</div>
      <div className="absolute right-4 top-4 text-3xl opacity-10">{icon}</div>
    </div>
  )
}

export function Button({ children, variant='primary', size='md', className='', disabled=false, ...props }) {
  const base = 'inline-flex items-center gap-2 font-display font-bold rounded-lg transition-all cursor-pointer border-0 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed'
  const v = {
    primary:   'bg-saffron text-black hover:bg-saffron2 hover:-translate-y-px shadow-[0_0_20px_rgba(255,153,51,0.2)]',
    secondary: 'bg-card2 text-text2 border border-border1 hover:border-saffron hover:text-saffron',
    ghost:     'bg-transparent text-text2 border border-border1 hover:bg-card hover:text-text1',
    danger:    'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20',
  }
  const s = { sm:'px-3 py-1.5 text-xs', md:'px-4 py-2.5 text-sm', lg:'px-6 py-3 text-base' }
  return <button disabled={disabled} className={`${base} ${v[variant]} ${s[size]} ${className}`} {...props}>{children}</button>
}

export function Input({ label, className='', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[10px] tracking-widest uppercase text-text3">{label}</label>}
      <input className={`w-full bg-surface border border-border1 rounded-lg px-3.5 py-2.5 text-text1 font-mono text-sm focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/10 transition-colors ${className}`} {...props}/>
    </div>
  )
}

export function Select({ label, children, className='', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[10px] tracking-widest uppercase text-text3">{label}</label>}
      <select className={`w-full bg-surface border border-border1 rounded-lg px-3.5 py-2.5 text-text1 font-mono text-sm cursor-pointer focus:outline-none focus:border-saffron transition-colors ${className}`} {...props}>{children}</select>
    </div>
  )
}

export function Textarea({ label, className='', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[10px] tracking-widest uppercase text-text3">{label}</label>}
      <textarea className={`w-full bg-surface border border-border1 rounded-lg px-3.5 py-2.5 text-text1 font-mono text-sm resize-y focus:outline-none focus:border-saffron transition-colors ${className}`} {...props}/>
    </div>
  )
}

export function Badge({ children, variant='grey' }) {
  const v = {
    orange:'bg-saffron/15 text-saffron border border-saffron/25',
    green:'bg-green2/12 text-green2 border border-green2/20',
    blue:'bg-blue-500/12 text-blue-400 border border-blue-500/20',
    rose:'bg-rose-500/12 text-rose-400 border border-rose-500/20',
    teal:'bg-teal-500/12 text-teal-400 border border-teal-500/20',
    grey:'bg-text2/10 text-text2 border border-border1',
    amber:'bg-amber-500/12 text-amber-400 border border-amber-500/20',
  }
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${v[variant]}`}>{children}</span>
}

export function Spinner({ size='md' }) {
  const s = { sm:'w-4 h-4', md:'w-6 h-6', lg:'w-9 h-9' }
  return <div className={`spinner ${s[size]}`}/>
}

export function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="font-display font-black text-2xl text-text1 mb-1">{title}</h1>
      <p className="text-xs text-text3">{subtitle}</p>
    </div>
  )
}

export function ActionItem({ number, children }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-saffron/5 border border-saffron/15 rounded-lg mb-2">
      <div className="w-5 h-5 rounded-full bg-saffron text-black text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{number}</div>
      <div className="text-xs text-text2 leading-relaxed">{children}</div>
    </div>
  )
}

export function EmptyState({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center gap-3">
      <div className="text-5xl">{icon}</div>
      <div className="font-display font-bold text-base text-text2">{title}</div>
      {desc && <div className="text-xs text-text3 max-w-xs">{desc}</div>}
    </div>
  )
}

export function ProgressBar({ value, color='#ff9933' }) {
  return (
    <div className="h-1.5 bg-border1 rounded-full overflow-hidden mt-1.5">
      <div className="h-full rounded-full transition-all duration-1000" style={{ width:`${value}%`, background:color }}/>
    </div>
  )
}

// Global toast
let _toast = null
export const setToastFn = (fn) => { _toast = fn }
export const showToast = (msg, type='success') => _toast?.(msg, type)
