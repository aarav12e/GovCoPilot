import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { StatCard, Card, Button, Badge, PageHeader, Spinner, ProgressBar, showToast } from '../ui/index'
import { constituencyAPI } from '../../services/api'

const TIP=({active,payload,label})=>{if(!active||!payload?.length)return null;return<div className="bg-card2 border border-border2 rounded-lg p-3 text-xs"><p className="text-text1 font-semibold mb-1">{label}</p>{payload.map((p,i)=><p key={i} style={{color:p.color}}>{p.name}: {p.value}{p.name==='Coverage'?'%':''}</p>)}</div>}

export default function Constituency() {
  const [overview, setOverview] = useState(null)
  const [wards, setWards] = useState([])
  const [schemes, setSchemes] = useState([])
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    constituencyAPI.overview().then(r => { setOverview(r.data); setWards(r.data.wards||[]) }).catch(()=>{})
    constituencyAPI.schemes().then(r => setSchemes(r.data)).catch(()=>{})
  }, [])

  const runQuery = async () => {
    if (!query.trim()) return
    setLoading(true); setAnswer('')
    try {
      const res = await constituencyAPI.query(query)
      setAnswer(res.data.answer)
    } catch { showToast('Query failed','error') } finally { setLoading(false) }
  }

  const schemeData = schemes.map(s=>({name:s.name.split(' ')[0],coverage:s.coverage}))

  return (
    <div className="page-enter space-y-5">
      <PageHeader title="🗺️ Constituency Intelligence" subtitle="Real-time ward data, scheme coverage, and complaint tracking for North Delhi."/>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Population" value={overview?`${(overview.total_population/100000).toFixed(1)}L`:'4.5L'} sub="10 Wards" icon="👥" accent="blue"/>
        <StatCard label="Avg Coverage" value={overview?`${overview.avg_coverage_pct}%`:'72.5%'} sub={<span className="text-green2">▲ This month</span>} icon="📊" accent="green"/>
        <StatCard label="Open Complaints" value={overview?.total_complaints||148} sub={<span className="text-rose-400">Ward 6: critical</span>} icon="🚨" accent="rose"/>
        <StatCard label="Active Schemes" value={schemes.length||5} sub="Govt programs" icon="📋" accent="saffron"/>
      </div>

      <Card>
        <div className="font-display font-bold text-sm text-text1 mb-3">🤖 Ask About Your Constituency</div>
        <div className="flex gap-2.5">
          <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&runQuery()}
            placeholder='"Which ward has lowest coverage?" or "Show wards with 20+ complaints"'
            className="flex-1 bg-surface border border-border1 rounded-xl px-4 py-2.5 text-text1 text-sm font-mono focus:outline-none focus:border-saffron transition-colors"/>
          <Button onClick={runQuery} disabled={loading}>{loading?<Spinner size="sm"/>:'Ask AI'}</Button>
        </div>
        {answer && <div className="mt-4 p-4 bg-saffron/5 border border-saffron/20 rounded-xl text-sm text-text2 leading-relaxed" dangerouslySetInnerHTML={{__html:answer.replace(/\*\*(.*?)\*\*/g,'<strong class="text-text1">$1</strong>')}}/>}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <div className="font-display font-bold text-sm text-text1 mb-4">📊 Scheme Coverage (%)</div>
          {schemeData.length>0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={schemeData} layout="vertical" barSize={20}>
                <XAxis type="number" domain={[0,100]} tick={{fill:'#4a5878',fontSize:10}} tickFormatter={v=>v+'%'} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="name" tick={{fill:'#94a3c8',fontSize:11,fontFamily:'Geist Mono'}} axisLine={false} tickLine={false} width={60}/>
                <Tooltip content={<TIP/>} cursor={{fill:'rgba(255,255,255,0.03)'}}/>
                <Bar dataKey="coverage" radius={[0,4,4,0]} name="Coverage">
                  {schemeData.map((d,i)=><Cell key={i} fill={d.coverage>80?'#1aab0a':d.coverage>60?'#f59e0b':'#f43f5e'}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-48"><Spinner/></div>}
        </Card>

        <Card>
          <div className="font-display font-bold text-sm text-text1 mb-4">🏘️ Ward Summary</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-border1">
                {['Ward','Pop.','Coverage','Complaints','Status'].map(h=><th key={h} className="text-left py-2.5 px-3 text-[10px] tracking-widest uppercase text-text3 font-medium">{h}</th>)}
              </tr></thead>
              <tbody>
                {wards.map(w=>(
                  <tr key={w.id} className="border-b border-border1 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-text1">{w.name.split(' ').slice(0,2).join(' ')}</td>
                    <td className="py-2.5 px-3 text-text3">{(w.pop/1000).toFixed(0)}K</td>
                    <td className="py-2.5 px-3"><Badge variant={w.coverage<50?'rose':w.coverage<70?'amber':'green'}>{w.coverage}%</Badge></td>
                    <td className="py-2.5 px-3"><Badge variant={w.complaints>20?'rose':w.complaints>10?'amber':'blue'}>{w.complaints}</Badge></td>
                    <td className="py-2.5 px-3">{w.coverage<50?'🔴':w.coverage<70?'🟡':'🟢'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card>
        <div className="font-display font-bold text-sm text-text1 mb-4">🔥 Issues by Ward</div>
        <div className="flex flex-wrap gap-3">
          {wards.map(w=>{
            const c=w.complaints>20?'#f43f5e':w.complaints>10?'#f59e0b':'#1aab0a'
            return(
              <div key={w.id} className="p-3 bg-card2 border border-border1 rounded-xl min-w-40" style={{borderLeftColor:c,borderLeftWidth:3}}>
                <div className="font-display font-bold text-xs text-text1 mb-2">{w.name}</div>
                {(w.issues||[]).map(issue=><div key={issue} className="text-[11px] text-text3 mb-0.5">• {issue}</div>)}
                <ProgressBar value={w.coverage} color={c}/>
                <div className="text-[10px] text-text3 mt-1">{w.coverage}% coverage</div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
