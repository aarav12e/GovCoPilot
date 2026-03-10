import { useState, useRef, useEffect } from 'react'
import { Card, Button, Badge, PageHeader, Spinner, showToast } from '../ui/index'
import { chatAPI } from '../../services/api'

const SUGGESTIONS = [
  {icon:'🗺️',text:'Which ward has the most open complaints?'},
  {icon:'📋',text:'What is Ayushman Bharat and who is eligible?'},
  {icon:'⚡',text:'What should I prioritize this week as an MLA?'},
  {icon:'📊',text:'Which ward has the lowest scheme coverage?'},
  {icon:'🐦',text:'Draft a tweet about road repair completed in my constituency'},
]

function Msg({ m }) {
  const isUser = m.role === 'user'
  const html = m.content.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br/>')
  return (
    <div className={`flex gap-2.5 ${isUser?'flex-row-reverse':''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${isUser?'bg-gradient-to-br from-blue-700 to-blue-500':'bg-gradient-to-br from-saffron to-orange-700'}`}>{isUser?'👤':'🏛️'}</div>
      <div className="max-w-[78%]">
        <div className={`px-3.5 py-2.5 text-sm leading-relaxed text-text1 ${isUser?'bubble-user':'bubble-ai'}`} dangerouslySetInnerHTML={{__html:html}}/>
        <div className="text-[9px] text-text3 mt-1">{m.time}</div>
      </div>
    </div>
  )
}

export default function AiChat() {
  const [messages,setMessages]=useState([{id:0,role:'assistant',time:'Now',content:'Namaste! I am your AI Co-Pilot. Ask me about:\n\n📄 **Documents** — Summarize reports\n🗺️ **Constituency** — Ward data, schemes\n✍️ **Drafting** — Speeches, letters\n📋 **Policy** — Government schemes\n\nWhat would you like help with?'}])
  const [input,setInput]=useState('')
  const [loading,setLoading]=useState(false)
  const [lang,setLang]=useState('english')
  const [showSuggest,setShowSuggest]=useState(true)
  const bottomRef=useRef()

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[messages])

  const send = async (text) => {
    const msg=(text||input).trim(); if(!msg||loading) return
    setInput(''); setShowSuggest(false)
    const t=new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})
    const userMsg={id:Date.now(),role:'user',content:msg,time:t}
    setMessages(p=>[...p,userMsg]); setLoading(true)
    try {
      const history=messages.slice(-6).map(m=>({role:m.role,content:m.content}))
      const res=await chatAPI.send({message:msg,history,language:lang})
      setMessages(p=>[...p,{id:Date.now()+1,role:'assistant',content:res.data.reply,time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}])
    } catch(e) {
      showToast(e.response?.data?.detail||'AI response failed','error')
    } finally { setLoading(false) }
  }

  return (
    <div className="page-enter space-y-5">
      <PageHeader title="💬 AI Co-Pilot Chat" subtitle="Ask anything about governance, policy, constituency data, or drafting."/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <Card className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[460px] pr-1">
            {messages.map(m=><Msg key={m.id} m={m}/>)}
            {loading && <div className="flex gap-2.5"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron to-orange-700 flex items-center justify-center">🏛️</div><div className="bubble-ai px-4 py-3 flex items-center gap-2"><Spinner size="sm"/><span className="text-xs text-text3">Thinking...</span></div></div>}
            <div ref={bottomRef}/>
          </div>
          {showSuggest && (
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s,i)=>(
                <button key={i} onClick={()=>send(s.text)} className="flex items-center gap-1.5 px-3 py-1.5 bg-card2 border border-border1 rounded-full text-xs text-text2 hover:border-saffron/40 hover:text-saffron transition-colors font-mono">
                  <span>{s.icon}</span>{s.text.slice(0,28)}...
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2.5 items-end">
            <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}
              placeholder="Ask anything... (Enter to send)" rows={1}
              className="flex-1 bg-surface border border-border1 rounded-xl px-4 py-2.5 text-text1 text-sm font-mono focus:outline-none focus:border-saffron resize-none min-h-11 max-h-28"/>
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <select value={lang} onChange={e=>setLang(e.target.value)} className="bg-surface border border-border1 rounded-lg px-2 py-1.5 text-text2 text-xs font-mono focus:outline-none focus:border-saffron">
                <option value="english">EN</option><option value="hindi">HI</option>
              </select>
              <button onClick={()=>send()} className="bg-saffron text-black rounded-lg px-3 py-2 font-bold text-base hover:bg-saffron2 transition-colors">➤</button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="font-display font-bold text-sm text-text1 mb-3">🧠 AI Capabilities</div>
            {[{icon:'📄',t:'Document Analysis',d:'Summarize docs in the chat'},{icon:'🇮🇳',t:'Hindi Support',d:'Switch to HI for Hindi responses'},{icon:'📊',t:'Constituency Data',d:'Ward & scheme queries'}].map((c,i)=>(
              <div key={i} className="flex items-center gap-3 p-2.5 bg-card2 rounded-lg mb-2"><span className="text-xl">{c.icon}</span><div><div className="text-xs font-semibold text-text1">{c.t}</div><div className="text-[11px] text-text3">{c.d}</div></div></div>
            ))}
          </Card>
          <Card>
            <div className="font-display font-bold text-sm text-text1 mb-3">⚡ Powered By</div>
            {[{l:'Primary AI',b:'Gemini 1.5 Pro',v:'orange'},{l:'Fallback',b:'Claude Sonnet',v:'teal'},{l:'Languages',b:'Sarvam AI',v:'green'},{l:'Transcription',b:'Whisper',v:'blue'}].map((p,i)=>(
              <div key={i} className="flex justify-between items-center py-2 border-b border-border1 last:border-0 text-xs"><span className="text-text2">{p.l}</span><Badge variant={p.v}>{p.b}</Badge></div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}
