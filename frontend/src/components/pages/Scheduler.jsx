import { useState, useEffect } from 'react'
import { Card, Button, Input, Select, Textarea, Badge, PageHeader, EmptyState, showToast } from '../ui/index'
import { schedulerAPI } from '../../services/api'

const today = new Date().toISOString().split('T')[0]
const pBorder={normal:'border-l-blue-500',high:'border-l-amber-500',urgent:'border-l-rose-500'}
const pBadge={normal:'blue',high:'amber',urgent:'rose'}

export default function Scheduler() {
  const [events,setEvents]=useState([])
  const [tasks,setTasks]=useState([])
  const [addingEv,setAddingEv]=useState(false)
  const [evTitle,setEvTitle]=useState('')
  const [evDate,setEvDate]=useState(today)
  const [evTime,setEvTime]=useState('09:00')
  const [evLoc,setEvLoc]=useState('')
  const [evDesc,setEvDesc]=useState('')
  const [evPri,setEvPri]=useState('normal')
  const [taskTitle,setTaskTitle]=useState('')
  const [taskDue,setTaskDue]=useState(today)
  const [taskPri,setTaskPri]=useState('normal')

  useEffect(()=>{
    schedulerAPI.getEvents().then(r=>setEvents(r.data)).catch(()=>{})
    schedulerAPI.getTasks().then(r=>setTasks(r.data)).catch(()=>{})
  },[])

  const addEvent=async()=>{
    if(!evTitle.trim()){showToast('Event title required','error');return}
    setAddingEv(true)
    try {
      const res=await schedulerAPI.addEvent({title:evTitle,date:evDate,time:evTime,location:evLoc,description:evDesc,priority:evPri,duration_minutes:60})
      setEvents(p=>[...p,res.data])
      setEvTitle('');setEvLoc('');setEvDesc('')
      showToast('Event added with AI brief!')
    } catch(e){showToast(e.response?.data?.detail||'Failed','error')} finally{setAddingEv(false)}
  }

  const removeEvent=async(id)=>{
    await schedulerAPI.deleteEvent(id).catch(()=>{})
    setEvents(p=>p.filter(e=>e.event_id!==id))
    showToast('Event removed')
  }

  const addTask=async()=>{
    if(!taskTitle.trim()){showToast('Task title required','error');return}
    try {
      const res=await schedulerAPI.addTask({title:taskTitle,due_date:taskDue,priority:taskPri})
      setTasks(p=>[...p,res.data])
      setTaskTitle('')
      showToast('Task added!')
    } catch(e){showToast(e.response?.data?.detail||'Failed','error')}
  }

  const toggleTask=async(task)=>{
    const newStatus=task.status==='done'?'pending':'done'
    await schedulerAPI.updateTask(task.task_id,newStatus).catch(()=>{})
    setTasks(p=>p.map(t=>t.task_id===task.task_id?{...t,status:newStatus}:t))
  }

  return (
    <div className="page-enter space-y-5">
      <PageHeader title="📅 Schedule & Tasks" subtitle="Manage your calendar, create events with AI-generated briefs, and track tasks."/>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <Card>
            <div className="font-display font-bold text-sm text-text1 mb-4">➕ New Event</div>
            <div className="space-y-3">
              <Input label="Event Title *" value={evTitle} onChange={e=>setEvTitle(e.target.value)} placeholder="e.g. District review meeting"/>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Date" type="date" value={evDate} onChange={e=>setEvDate(e.target.value)}/>
                <Input label="Time" type="time" value={evTime} onChange={e=>setEvTime(e.target.value)}/>
              </div>
              <Input label="Location" value={evLoc} onChange={e=>setEvLoc(e.target.value)} placeholder="e.g. Collectorate, New Delhi"/>
              <Textarea label="Description" value={evDesc} onChange={e=>setEvDesc(e.target.value)} placeholder="Brief about the event..." className="min-h-16"/>
              <Select label="Priority" value={evPri} onChange={e=>setEvPri(e.target.value)}>
                <option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option>
              </Select>
              <Button className="w-full justify-center" onClick={addEvent} disabled={addingEv}>
                {addingEv?'🤖 Generating AI Brief...':'📅 Add Event + AI Brief'}
              </Button>
            </div>
          </Card>
          <Card>
            <div className="font-display font-bold text-sm text-text1 mb-4">✅ New Task</div>
            <div className="space-y-3">
              <Input label="Task" value={taskTitle} onChange={e=>setTaskTitle(e.target.value)} placeholder="e.g. Review flood report for Ward 3"/>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Due Date" type="date" value={taskDue} onChange={e=>setTaskDue(e.target.value)}/>
                <Select label="Priority" value={taskPri} onChange={e=>setTaskPri(e.target.value)}>
                  <option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option>
                </Select>
              </div>
              <Button variant="secondary" className="w-full justify-center" onClick={addTask}>➕ Add Task</Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="font-display font-bold text-sm text-text1">📅 Upcoming Events</div>
              <Badge variant="orange">{events.length}</Badge>
            </div>
            {events.length===0?<EmptyState icon="📅" title="No events yet" desc="Add your first event above!"/>:(
              <div className="space-y-2.5">
                {events.map(ev=>(
                  <div key={ev.event_id} className={`flex gap-3 p-3 bg-card2 border border-border1 rounded-xl border-l-2 ${pBorder[ev.priority]||'border-l-blue-500'}`}>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold text-[13px] text-text1">{ev.title}</div>
                      <div className="text-[11px] text-text3 mt-0.5">{ev.date} {ev.time}{ev.location?` · ${ev.location}`:''}</div>
                      {ev.ai_brief&&<div className="mt-2 text-[11px] text-text3 bg-surface rounded-lg p-2 border-l-2 border-saffron leading-relaxed whitespace-pre-line">🤖 {ev.ai_brief}</div>}
                    </div>
                    <Button variant="danger" size="sm" onClick={()=>removeEvent(ev.event_id)}>✕</Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="font-display font-bold text-sm text-text1">✅ Tasks</div>
              <Badge variant="rose">{tasks.filter(t=>t.status!=='done').length} pending</Badge>
            </div>
            {tasks.length===0?<EmptyState icon="✅" title="No tasks yet" desc="Add your first task above!"/>:(
              <div className="space-y-2">
                {tasks.map(t=>(
                  <div key={t.task_id} onClick={()=>toggleTask(t)} className={`flex items-center gap-3 p-3 bg-card2 border border-border1 rounded-xl cursor-pointer hover:border-green2/30 transition-all ${t.status==='done'?'opacity-50':''}`}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${t.status==='done'?'bg-green2 border-green2':'border-border2'}`}>{t.status==='done'&&<span className="text-white text-[10px] font-bold">✓</span>}</div>
                    <div className={`flex-1 text-xs text-text1 ${t.status==='done'?'line-through':''}`}>{t.title}</div>
                    {t.due_date&&<span className="text-[10px] text-text3">📅 {t.due_date}</span>}
                    <Badge variant={pBadge[t.priority]||'grey'}>{t.priority}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
