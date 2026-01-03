import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import { saveToStorage, loadFromStorage } from '../lib/storage'

type Message = { id: string; role: 'user'|'assistant'; text: string; attachments?: string[] }

export default function ChatPage(){
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(()=>{
    const loaded = loadFromStorage<Message[]>('chat_history') || []
    setMessages(loaded)
  },[])

  useEffect(()=>{
    saveToStorage('chat_history', messages)
  },[messages])

  useEffect(()=>{
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const r = new SpeechRecognition()
      r.continuous = false
      r.interimResults = false
      r.lang = 'en-US'
      r.onresult = (e: any) => {
        const text = e.results[0][0].transcript
        setInput(prev => prev + ' ' + text)
        setIsListening(false)
      }
      r.onend = ()=> setIsListening(false)
      recognitionRef.current = r
    }
  },[])

  const sendMessage = async ()=>{
    if(!input.trim()) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input }
    setMessages(m=>[...m, userMsg])
    setInput('')

    try{
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ type: 'text', payload: { prompt: userMsg.text } })
      })
      const data = await res.json()
      const assistantText = data?.output || data?.choices?.[0]?.text || JSON.stringify(data)
      const assistantMsg: Message = { id: Date.now().toString()+"-a", role:'assistant', text: assistantText }
      setMessages(m=>[...m, assistantMsg])
    }catch(err){
      const assistantMsg: Message = { id: Date.now().toString()+"-err", role:'assistant', text: 'Error contacting generation API. See console.' }
      setMessages(m=>[...m, assistantMsg])
    }
  }

  const toggleListen = ()=>{
    if(!recognitionRef.current) return
    if(isListening){
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const clearHistory = ()=>{
    setMessages([])
    saveToStorage('chat_history', [])
  }

  const onFile = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const files = e.target.files
    if(!files) return
    const reader = new FileReader()
    reader.onload = ()=>{
      const dataUrl = reader.result as string
      const attachMsg: Message = { id: Date.now().toString(), role:'user', text:'[attachment]', attachments:[dataUrl] }
      setMessages(m=>[...m, attachMsg])
    }
    reader.readAsDataURL(files[0])
  }

  return (
    <div className="page">
      <Head><title>Chat - The Author</title></Head>
      <h1>Chat</h1>
      <div className="chat">
        {messages.map(m=> (
          <div key={m.id} className={`msg ${m.role}`}>
            <div className="meta">{m.role}</div>
            <div className="text">{m.text}</div>
            {m.attachments?.map((a,i)=>(<img key={i} src={a} alt={`attachment-${i}`} style={{maxWidth:200}}/>))}
          </div>
        ))}
      </div>

      <div className="controls">
        <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Type a message" />
        <button onClick={sendMessage}>Send</button>
        <button onClick={toggleListen}>{isListening ? 'Stop' : 'Voice'}</button>
        <input type="file" accept="image/*" onChange={onFile} />
        <button onClick={clearHistory}>Clear</button>
      </div>

      <style jsx>{`
        .chat { max-height:60vh; overflow:auto; border:1px solid #ddd; padding:8px }
        .msg { margin:8px 0 }
        .msg.user { text-align:right }
        .meta { font-size:12px; color:#666 }
      `}</style>
    </div>
  )
}
