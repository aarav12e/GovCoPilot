import { useState, useEffect } from 'react'
import { setToastFn } from './index'

export default function Toast() {
  const [toasts, setToasts] = useState([])
  useEffect(() => {
    setToastFn((msg, type='success') => {
      const id = Date.now()
      setToasts(p => [...p, { id, msg, type }])
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
    })
  }, [])
  const icons = { success:'✅', error:'❌', info:'ℹ️' }
  const borders = { success:'border-green2/40', error:'border-rose-500/40', info:'border-blue-500/40' }
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-3 bg-card border ${borders[t.type]} rounded-xl px-4 py-3 shadow-2xl max-w-xs`}
          style={{animation:'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) both'}}>
          <span className="text-lg">{icons[t.type]}</span>
          <span className="text-sm text-text1">{t.msg}</span>
        </div>
      ))}
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(20px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </div>
  )
}
