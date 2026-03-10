import { useState, useRef } from 'react'
import { Card, Button, Select, Input, PageHeader, Spinner, ActionItem, showToast } from '../ui/index'
import { docsAPI } from '../../services/api'

export default function Documents() {
  const [file, setFile] = useState(null)
  const [docId, setDocId] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [lang, setLang] = useState('english')
  const [length, setLength] = useState('medium')
  const [focus, setFocus] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const fileRef = useRef()

  const handleFile = async (f) => {
    if (!f) return
    setFile(f); setResult(null); setDocId(null)
    setUploading(true)
    try {
      const res = await docsAPI.upload(f)
      setDocId(res.data.doc_id)
      showToast(`Uploaded: ${f.name}`)
    } catch (e) {
      showToast(e.response?.data?.detail || 'Upload failed', 'error')
    } finally { setUploading(false) }
  }

  const summarize = async () => {
    if (!docId) { showToast('Please upload a document first', 'error'); return }
    setLoading(true); setResult(null)
    try {
      const res = await docsAPI.summarize({ doc_id: docId, language: lang, summary_length: length, focus: focus || undefined })
      setResult(res.data)
      showToast('Document summarized!')
    } catch (e) {
      showToast(e.response?.data?.detail || 'Summarization failed', 'error')
    } finally { setLoading(false) }
  }

  return (
    <div className="page-enter space-y-5">
      <PageHeader title="📄 Document Intelligence" subtitle="Upload any government PDF, report, or circular — get an instant AI summary."/>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <Card>
            <div className="font-display font-bold text-sm text-text1 mb-4">Upload Document</div>
            <div className={`upload-zone rounded-xl p-10 text-center cursor-pointer ${dragging?'drag-over':''}`}
              onClick={()=>fileRef.current?.click()}
              onDragOver={e=>{e.preventDefault();setDragging(true)}}
              onDragLeave={()=>setDragging(false)}
              onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0])}}>
              <div className="text-4xl mb-3">{uploading?<span className="spinner"/>:'📤'}</div>
              <div className="font-display font-bold text-sm text-text1 mb-1">{uploading?'Uploading...':'Drop your document here'}</div>
              <div className="text-xs text-text3">PDF, DOCX, TXT, XLSX · Max 50 MB</div>
              <input ref={fileRef} type="file" className="hidden" accept=".pdf,.docx,.txt,.xlsx" onChange={e=>handleFile(e.target.files[0])}/>
            </div>
            {file && docId && (
              <div className="mt-3 flex items-center gap-3 p-3 bg-saffron/7 border border-saffron/20 rounded-xl">
                <span className="text-xl">📄</span>
                <div>
                  <div className="text-[13px] font-semibold text-text1">{file.name}</div>
                  <div className="text-[11px] text-green2">✓ Uploaded · Ready to summarize</div>
                </div>
              </div>
            )}
          </Card>
          <Card>
            <div className="font-display font-bold text-sm text-text1 mb-4">Options</div>
            <div className="space-y-3">
              <Select label="Summary Length" value={length} onChange={e=>setLength(e.target.value)}>
                <option value="short">Short (3–4 sentences)</option>
                <option value="medium">Medium (150–200 words)</option>
                <option value="detailed">Detailed (400–500 words)</option>
              </Select>
              <Select label="Language" value={lang} onChange={e=>setLang(e.target.value)}>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
              </Select>
              <Input label="Focus Area (optional)" value={focus} onChange={e=>setFocus(e.target.value)} placeholder="e.g. financial allocations, deadlines..."/>
              <Button className="w-full justify-center" onClick={summarize} disabled={loading||!docId}>
                {loading?<><Spinner size="sm"/>Analyzing...</>:'🤖 Summarize with AI'}
              </Button>
            </div>
          </Card>
        </div>

        <Card className="min-h-80">
          <div className="flex items-center justify-between mb-5">
            <div className="font-display font-bold text-sm text-text1 flex items-center gap-2"><span className="w-7 h-7 bg-saffron/10 rounded-lg flex items-center justify-center">📋</span>AI Summary</div>
            {result && <Button variant="ghost" size="sm" onClick={()=>{navigator.clipboard.writeText(result.summary);showToast('Copied!')}}>📋 Copy</Button>}
          </div>
          {!loading && !result && <div className="flex flex-col items-center justify-center min-h-64 text-center gap-3"><div className="text-5xl">🤖</div><div className="font-display font-bold text-base text-text2">Ready to Summarize</div><div className="text-xs text-text3">Upload a document and click Summarize</div></div>}
          {loading && <div className="flex flex-col items-center justify-center min-h-64 gap-4"><Spinner size="lg"/><div className="font-display font-bold text-text2">Analyzing document...</div><div className="text-xs text-text3">AI is reading your document</div></div>}
          {result && (
            <div className="space-y-5">
              <p className="text-sm text-text2 leading-relaxed">{result.summary}</p>
              {result.key_points?.length > 0 && (
                <div>
                  <div className="text-[10px] tracking-widest uppercase text-text3 mb-2">Key Points</div>
                  <ul className="space-y-0">{result.key_points.map((p,i)=>(
                    <li key={i} className="flex gap-2.5 py-2 border-b border-border1 last:border-0 text-xs text-text2 leading-relaxed">
                      <span className="text-saffron text-[8px] mt-1.5 flex-shrink-0">◆</span>{p}
                    </li>
                  ))}</ul>
                </div>
              )}
              {result.action_items?.length > 0 && (
                <div>
                  <div className="text-[10px] tracking-widest uppercase text-text3 mb-2">Action Items</div>
                  {result.action_items.map((a,i)=><ActionItem key={i} number={i+1}>{a}</ActionItem>)}
                </div>
              )}
              {result.processing_time_ms && <div className="text-[10px] text-text3">Processed in {result.processing_time_ms}ms · {result.word_count} words</div>}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
