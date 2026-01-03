import { useRef, useState } from 'react'
import Head from 'next/head'
import Tesseract from 'tesseract.js'
import { saveAs } from 'file-saver'

export default function ImageTools(){
  const [prompt, setPrompt] = useState('A fantasy book cover of a lone traveler')
  const [preview, setPreview] = useState<string | null>(null)
  const [ocrText, setOcrText] = useState('')
  const fileRef = useRef<HTMLInputElement | null>(null)

  const generate = async ()=>{
    // Calls serverless API to generate image via Gemini proxy
    try{
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ type: 'image', payload: { prompt } })
      })
      const data = await res.json()
      // Expect data.image (base64) or similar. We try to handle a couple shapes.
      const imgData = data?.image || data?.output || (data?.choices?.[0]?.data?.[0]?.b64_json)
      if(typeof imgData === 'string'){
        // if it's raw base64 without data URI prefix, assume png
        const uri = imgData.startsWith('data:') ? imgData : `data:image/png;base64,${imgData}`
        setPreview(uri)
      } else {
        setPreview(null)
        alert('Unexpected image response shape. See console.')
        console.debug('image response', data)
      }
    }catch(err){
      console.error(err)
      alert('Generation failed')
    }
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0]
    if(!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)

    // OCR via Tesseract
    setOcrText('Processing...')
    try{
      const res = await Tesseract.recognize(file, 'eng')
      setOcrText(res.data.text)
    }catch(err){
      setOcrText('OCR failed')
    }
  }

  const downloadPreview = ()=>{
    if(!preview) return
    saveAs(preview, 'generated.png')
  }

  return (
    <div className="page">
      <Head><title>Image Tools - The Author</title></Head>
      <h1>Image Tools</h1>
      <section>
        <h2>Text to Image</h2>
        <textarea value={prompt} onChange={(e)=>setPrompt(e.target.value)} rows={3} />
        <div>
          <button onClick={generate}>Generate</button>
          <button onClick={downloadPreview} disabled={!preview}>Download</button>
        </div>
        {preview && <img src={preview} alt="preview" style={{maxWidth:'100%'}} />}
      </section>

      <section>
        <h2>OCR (Tesseract.js)</h2>
        <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} />
        <div>
          <h3>OCR Result</h3>
          <pre style={{whiteSpace:'pre-wrap'}}>{ocrText}</pre>
        </div>
      </section>

      <style jsx>{`
        textarea { width:100% }
      `}</style>
    </div>
  )
}
