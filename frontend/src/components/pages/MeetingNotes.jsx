import { useState, useRef } from 'react'
import { Card, Button, Select, PageHeader, Spinner, ActionItem, EmptyState, showToast } from '../ui/index'
import { speechAPI } from '../../services/api'

export default function MeetingNotes() {
  const [file,setFile]=useState(null)
  const [loading,setLoading]=useState(false)
  const [result,setResult]=useState(null)
  const [langCode,setLangCode]=useState('')
  const fileRef=useRef()

  const handleFile=(f)=>{ setFile(f); setResult(null); showToast('Audio ready: '+f.name) }

  const transcribe=async()=>{
    if(!file){showToast('Please upload an audio file','error');return}
    setLoading(true);setResult(null)
    try {
      const res=await speechAPI.transcribe(file,langCode||undefined,true)
      setResult(res.data)
      showToast('Meeting transcribed!')
    } catch(e){showToast(e.response?.data?.detail||'Transcription failed','error')} finally{setLoading(false)}
  }

  return (
    <div className="page-enter space-y-5">
      <PageHeader title="🎙️ Meeting Notes" subtitle="Upload any meeting recording — get transcript, decisions, and action items automatically."/>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <Card>
            <div className="font-display font-bold text-sm text-text1 mb-4">Upload Meeting Audio</div>
            <div className="upload-zone rounded-xl p-10 text-center cursor-pointer" onClick={()=>fileRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();handleFile(e.dataTransfer.files[0])}}>
              <div className="text-4xl mb-3">🎙️</div>
              <div className="font-display font-bold text-sm text-text1 mb-1">Upload Meeting Recording</div>
              <div className="text-xs text-text3">MP3, WAV, M4A, OGG · Max 25 MB</div>
              <input ref={fileRef} type="file" className="hidden" accept=".mp3,.wav,.m4a,.ogg,.webm,.flac" onChange={e=>handleFile(e.target.files[0])}/>
            </div>
            {file&&<div className="mt-3 flex items-center gap-3 p-3 bg-teal-500/7 border border-teal-500/20 rounded-xl"><span className="text-xl">🎙️</span><div><div className="text-[13px] font-semibold text-text1">{file.name}</div><div className="text-[11px] text-text3">{(file.size/1024/1024).toFixed(2)} MB · Ready</div></div></div>}
          </Card>
          <Card>
            <div className="font-display font-bold text-sm text-text1 mb-4">Options</div>
            <div className="space-y-3">
              <Select label="Meeting Language" value={langCode} onChange={e=>setLangCode(e.target.value)}>
                <option value="">Auto Detect</option><option value="en">English</option><option value="hi">Hindi</option><option value="ta">Tamil</option><option value="te">Telugu</option>
              </Select>
              <Button className="w-full justify-center" onClick={transcribe} disabled={loading}>
                {loading?<><Spinner size="sm"/>Transcribing...</>:'🎙️ Transcribe Meeting'}
              </Button>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-5">
            <div className="font-display font-bold text-sm text-text1 flex items-center gap-2"><span className="w-7 h-7 bg-teal-500/10 rounded-lg flex items-center justify-center">📋</span>Meeting Intelligence</div>
            {result&&<Button variant="ghost" size="sm" onClick={()=>{navigator.clipboard.writeText(result.transcript);showToast('Copied!')}}>📋 Copy</Button>}
          </div>
          {!loading&&!result&&<EmptyState icon="🎙️" title="Upload Audio to Begin" desc="Your meeting will be transcribed, summarized, and action items extracted automatically"/>}
          {loading&&<div className="flex flex-col items-center justify-center min-h-64 gap-4"><Spinner size="lg"/><div className="font-display font-bold text-text2">Transcribing...</div><div className="text-xs text-text3">Whisper AI is processing your audio</div></div>}
          {result&&(
            <div className="space-y-5">
              {result.summary&&<div><div className="text-[10px] tracking-widest uppercase text-text3 mb-2">Meeting Summary</div><p className="text-sm text-text2 leading-relaxed bg-surface border border-border1 rounded-xl p-4">{result.summary}</p></div>}
              {result.action_items?.length>0&&<div><div className="text-[10px] tracking-widest uppercase text-text3 mb-2">Action Items</div>{result.action_items.map((a,i)=><ActionItem key={i} number={i+1}>{typeof a==='object'?JSON.stringify(a):a}</ActionItem>)}</div>}
              <div><div className="text-[10px] tracking-widest uppercase text-text3 mb-2">Full Transcript</div><pre className="text-xs text-text3 leading-relaxed bg-surface border border-border1 rounded-xl p-4 max-h-52 overflow-y-auto whitespace-pre-wrap font-mono">{result.transcript}</pre></div>
              {result.duration_seconds>0&&<div className="text-[10px] text-text3">Duration: {Math.round(result.duration_seconds)}s · Language: {result.language_detected}</div>}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
