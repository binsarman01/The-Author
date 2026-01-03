import { useState } from 'react'
import Head from 'next/head'

const templates = [
  { id: 'short_story', name: 'Short story', prompt: 'Write a short story about {topic} in {style}' },
  { id: 'chapter', name: 'Chapter starter', prompt: 'Write a chapter starter about {topic} with hooks' }
]

export default function Writer(){
  const [templateId, setTemplateId] = useState(templates[0].id)
  const [topic, setTopic] = useState('a wandering poet')
  const [style, setStyle] = useState('lyrical')
  const [output, setOutput] = useState('')

  const generate = async (humanize = false)=>{
    const t = templates.find(t=>t.id===templateId)!
    const prompt = t.prompt.replace('{topic}', topic).replace('{style}', style)
    try{
      const res = await fetch('/api/gemini', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ type: 'text', payload: { prompt, humanize } })
      })
      const data = await res.json()
      const text = data?.output || data?.choices?.[0]?.text || JSON.stringify(data)
      setOutput(text)
    }catch(err){
      setOutput('Error generating')
    }
  }

  const grammarCheck = async ()=>{
    if(!output) return
    // Simple grammar check proxying to API (stub)
    const res = await fetch('/api/gemini', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type:'text', payload:{ prompt: 'Fix grammar: ' + output } }) })
    const data = await res.json()
    setOutput(data?.output || JSON.stringify(data))
  }

  return (
    <div className="page">
      <Head><title>Writer - The Author</title></Head>
      <h1>Writer</h1>
      <div>
        <label>Template</label>
        <select value={templateId} onChange={(e)=>setTemplateId(e.target.value)}>
          {templates.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div>
        <label>Topic</label>
        <input value={topic} onChange={(e)=>setTopic(e.target.value)} />
      </div>
      <div>
        <label>Style</label>
        <input value={style} onChange={(e)=>setStyle(e.target.value)} />
      </div>
      <div>
        <button onClick={()=>generate(false)}>Generate</button>
        <button onClick={()=>generate(true)}>Generate (Humanize)</button>
        <button onClick={grammarCheck} disabled={!output}>Grammar Check</button>
      </div>

      <section>
        <h2>Output</h2>
        <pre style={{whiteSpace:'pre-wrap'}}>{output}</pre>
      </section>

      <section>
        <h3>Notes</h3>
        <p>Advanced features like book export, multi-chapter generation and large-document chunking are UI stubs. See README for notes on chunking & costs.</p>
      </section>
    </div>
  )
}
