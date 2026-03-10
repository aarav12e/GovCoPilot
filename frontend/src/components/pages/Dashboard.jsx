import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { StatCard, Card, Button, Badge } from '../ui/index'
import { constituencyAPI } from '../../services/api'

const TIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return <div className="bg-card2 border border-border2 rounded-lg p-3 text-xs"><p className="text-text1 font-semibold mb-1">{label}</p>{payload.map((p,i)=><p key={i} style={{color:p.color}}>{p.name}: {p.value}{p.name==='coverage'?'%':''}</p>)}</div>
}

const SCHEDULE = [
  {time:'09:00',title:'District Collector Meeting',desc:'Flood preparedness review · Collectorate',color:'#ff9933'},
  {time:'11:30',title:'Ayushman Bharat Camp — Ward 3',desc:'Inauguration + beneficiary review',color:'#1aab0a'},
  {time:'15:00',title:'Press Conference',desc:'Infrastructure project announcement · PWD',color:'#3b82f6'},
  {time:'17:30',title:'Constituency Grievance Day',desc:'Public interaction · Party office',color:'#06b6d4'},
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [wards, setWards] = useState([])

  useEffect(() => {
    constituencyAPI.overview().then(r => {
      setStats(r.data)
      setWards((r.data.wards || []).map(w => ({ name: w.name.split(' ')[0], coverage: w.coverage, complaints: w.complaints })))
    }).catch(() => {
      setWards([
        {name:'Rohini',coverage:82,complaints:12},{name:'Pitampura',coverage:91,complaints:5},
        {name:'Shalimar',coverage:67,complaints:18},{name:'Ashok',coverage:88,complaints:9},
        {name:'Model',coverage:59,complaints:22},{name:'Azadpur',coverage:45,complaints:31},
        {name:'Mukherjee',coverage:85,complaints:7},{name:'Shakti',coverage:38,complaints:27},
        {name:'Kamla',coverage:74,complaints:14},{name:'Civil',coverage:96,complaints:3},
      ])
    })
  }, [])

  const totalComplaints = stats?.total_complaints || 148
  const avgCoverage = stats ? `${stats.avg_coverage_pct}%` : '72%'

  return (
    <div className="page-enter space-y-5">
      <div className="rounded-xl p-5 border border-saffron/20 flex flex-wrap items-center justify-between gap-5"
        style={{background:'linear-gradient(135deg,rgba(255,153,51,0.07) 0%,rgba(19,136,8,0.04) 100%)'}}>
        <div>
          <h2 className="font-display font-black text-xl text-text1 mb-1">Namaste, <span className="font-serif italic text-saffron">Arjun Kumar</span> 🙏</h2>
          <p className="text-xs text-text3 leading-relaxed">You have <strong className="text-saffron">3 pending action items</strong>, 2 events today, and Ward 6 has critical open complaints.</p>
        </div>
        <div className="flex gap-2.5">
          <Button onClick={() => navigate('/documents')}>📄 Summarize Doc</Button>
          <Button variant="ghost" onClick={() => navigate('/constituency')}>🗺️ View Constituency</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open Complaints" value={totalComplaints} sub={<span className="text-rose-400">▲ 12 since last week</span>} icon="📢" accent="rose"/>
        <StatCard label="Avg Coverage" value={avgCoverage} sub={<span className="text-green2">▲ 3% this month</span>} icon="📊" accent="green"/>
        <StatCard label="Total Population" value="4.5L" sub="10 wards · North Delhi" icon="👥" accent="blue"/>
        <StatCard label="Active Wards" value={stats?.total_wards || 10} sub="All operational" icon="🏘️" accent="saffron"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-bold text-sm text-text1 flex items-center gap-2"><span className="w-7 h-7 rounded-lg bg-saffron/10 flex items-center justify-center">📊</span>Ward Coverage</div>
            <Badge variant="orange">Live</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={wards} barSize={16}>
              <XAxis dataKey="name" tick={{fill:'#4a5878',fontSize:9,fontFamily:'Geist Mono'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#4a5878',fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v+'%'}/>
              <Tooltip content={<TIP/>} cursor={{fill:'rgba(255,255,255,0.03)'}}/>
              <Bar dataKey="coverage" radius={[4,4,0,0]} name="coverage">
                {wards.map((d,i)=><Cell key={i} fill={d.coverage<50?'#f43f5e':d.coverage<70?'#f59e0b':'#1aab0a'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-bold text-sm text-text1 flex items-center gap-2"><span className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center">🚨</span>Open Complaints</div>
            <Button variant="ghost" size="sm" onClick={()=>navigate('/constituency')}>View All</Button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={wards} barSize={16}>
              <XAxis dataKey="name" tick={{fill:'#4a5878',fontSize:9,fontFamily:'Geist Mono'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#4a5878',fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip content={<TIP/>} cursor={{fill:'rgba(255,255,255,0.03)'}}/>
              <Bar dataKey="complaints" radius={[4,4,0,0]} name="complaints">
                {wards.map((d,i)=><Cell key={i} fill={d.complaints>20?'#f43f5e':d.complaints>10?'#f59e0b':'#3b82f6'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <div className="font-display font-bold text-sm text-text1 mb-4">⚡ Quick Actions</div>
          <div className="space-y-2.5">
            {[
              {icon:'📄',bg:'bg-saffron/10',title:'Summarize Document',desc:'Upload govt PDF → AI extracts key points',to:'/documents'},
              {icon:'✍️',bg:'bg-blue-500/10',title:'Generate Speech / Letter',desc:'AI drafts official content in English or Hindi',to:'/draft'},
              {icon:'🎙️',bg:'bg-teal-500/10',title:'Transcribe Meeting',desc:'Upload audio → transcript + action items',to:'/meeting'},
            ].map(q=>(
              <div key={q.to} className="flex items-center gap-3 p-3 bg-card2 border border-border1 rounded-xl cursor-pointer hover:border-saffron/30 hover:-translate-y-px transition-all" onClick={()=>navigate(q.to)}>
                <div className={`w-10 h-10 ${q.bg} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>{q.icon}</div>
                <div><div className="font-display font-bold text-[13px] text-text1">{q.title}</div><div className="text-[11px] text-text3 mt-0.5">{q.desc}</div></div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-bold text-sm text-text1">📅 Today's Schedule</div>
            <Button variant="ghost" size="sm" onClick={()=>navigate('/scheduler')}>Manage</Button>
          </div>
          {SCHEDULE.map((ev,i)=>(
            <div key={i} className="flex gap-3 pb-4">
              <div className="text-[11px] text-text3 w-12 text-right pt-0.5 flex-shrink-0">{ev.time}</div>
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full border-2 mt-0.5 flex-shrink-0" style={{borderColor:ev.color}}/>
                {i<SCHEDULE.length-1&&<div className="w-px flex-1 bg-border1 mt-1" style={{minHeight:28}}/>}
              </div>
              <div className="pb-1">
                <div className="font-display font-bold text-[13px] text-text1">{ev.title}</div>
                <div className="text-[11px] text-text3 mt-0.5">{ev.desc}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
