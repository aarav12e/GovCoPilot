import { useState } from 'react'
import { Card, Button, Select, Input, Textarea, PageHeader, Spinner, showToast } from '../ui/index'
import { docsAPI } from '../../services/api'

const TYPES = [{id:'speech',label:'🎤 Speech'},{id:'letter',label:'📨 Official Letter'},{id:'press_release',label:'📰 Press Release'},{id:'report',label:'📊 Report'},{id:'order',label:'🔖 Govt Order'}]

export default function DraftGenerator() {
  const [type,setType]=[useState('speech'),null][0]
  const [docType,setDocType]=useState('speech')
  const [topic,setTopic]=useState('')
  const [context,setContext]=useState('')
  const [lang,setLang]=useState('english')
  const [length,setLength]=useState('medium')
  const [tone,setTone]=useState('formal')
  const [recipient,setRecipient]=useState('')
  const [loading,setLoading]=useState(false)
  const [output,setOutput]=useState('')

  const generate = async () => {
    if (!topic.trim()) { showToast('Please enter a topic','error'); return }
    setLoading(true); setOutput('')
    try {
      const res = await docsAPI.draft({doc_type:docType,topic,context:context||undefined,tone,language:lang,length,recipient:recipient||undefined})
      setOutput(res.data.content)
      showToast('Draft generated!')
    } catch(e) {
      showToast(e.response?.data?.detail||'Draft generation failed','error')
    } finally { setLoading(false) }
  }

  return (
    <div className="page-enter space-y-5">
      <PageHeader title="✍️ Draft Generator" subtitle="Generate speeches, letters, press releases, and reports with AI."/>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <div className="font-display font-bold text-sm text-text1 mb-4">Configure Draft</div>
          <div className="mb-4">
            <p className="text-[10px] tracking-widest uppercase text-text3 mb-2">Document Type</p>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map(d=>(
                <button key={d.id} onClick={()=>setDocType(d.id)}
                  className={`px-3 py-2.5 rounded-lg border font-display font-semibold text-[13px] transition-all ${docType===d.id?'bg-saffron/10 border-saffron/40 text-saffron':'bg-card2 border-border1 text-text2 hover:border-saffron/30'}`}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Input label="Topic / Subject *" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Inauguration of new school in Rohini Sector 1"/>
            <Textarea label="Additional Context" value={context} onChange={e=>setContext(e.target.value)} placeholder="Key facts, data, names to include..." className="min-h-20"/>
            <div className="grid grid-cols-2 gap-3">
              <Select label="Language" value={lang} onChange={e=>setLang(e.target.value)}><option value="english">English</option><option value="hindi">Hindi</option></Select>
              <Select label="Length" value={length} onChange={e=>setLength(e.target.value)}><option value="short">Short</option><option value="medium">Medium</option><option value="long">Long</option></Select>
            </div>
            <Select label="Tone" value={tone} onChange={e=>setTone(e.target.value)}>
              <option value="formal">Formal & Official</option>
              <option value="conversational">Conversational & Warm</option>
              <option value="assertive">Assertive & Decisive</option>
            </Select>
            <Input label="Recipient / Audience" value={recipient} onChange={e=>setRecipient(e.target.value)} placeholder="e.g. District residents, Ministry of Finance..."/>
            <Button className="w-full justify-center mt-1" onClick={generate} disabled={loading}>
              {loading?<><Spinner size="sm"/>Drafting...</>:'✍️ Generate with AI'}
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-bold text-sm text-text1 flex items-center gap-2"><span className="w-7 h-7 bg-blue-500/10 rounded-lg flex items-center justify-center">📝</span>Generated Draft</div>
            {output && (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={()=>{navigator.clipboard.writeText(output);showToast('Copied!')}}>📋 Copy</Button>
                <Button variant="ghost" size="sm" onClick={()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([output]));a.download=`draft_${docType}.txt`;a.click();showToast('Downloaded!')}}>⬇️ Download</Button>
              </div>
            )}
          </div>
          {!loading && !output && <div className="flex flex-col items-center justify-center flex-1 min-h-64 gap-3 text-center"><div className="text-5xl">✍️</div><div className="font-display font-bold text-base text-text2">Ready to Draft</div><div className="text-xs text-text3">Fill the form and generate your document</div></div>}
          {loading && <div className="flex flex-col items-center justify-center flex-1 min-h-64 gap-4"><Spinner size="lg"/><div className="font-display font-bold text-text2">Drafting your document...</div></div>}
          {output && <textarea value={output} onChange={e=>setOutput(e.target.value)} className="flex-1 bg-surface border border-border1 rounded-xl p-4 text-text2 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:border-saffron min-h-96 w-full"/>}
        </Card>
      </div>
    </div>
  )
}
