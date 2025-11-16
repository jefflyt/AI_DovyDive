import React, { useEffect, useRef, useState } from 'react'

type Msg = { from: 'user' | 'assistant'; text: string }

export default function Chat(){
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([
    {from:'assistant', text: 'Hi — I am your demo AI Dive Assistant. Ask me about dive tips, species or locations.'}
  ])
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(()=>{
    // scroll to bottom when msgs change
    if(listRef.current){
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  },[msgs])
  function send(){
    if(!input.trim()) return
    const text = input.trim()
    setMsgs(m=>[...m, {from:'user', text}])
    setTimeout(()=>{
      setMsgs(m=>[...m, {from:'assistant', text:`(demo reply) I have a stub answer for: "${text}"`}])
    },350)
    setInput('')
  }

  function onKey(e:React.KeyboardEvent<HTMLInputElement>){
    if(e.key === 'Enter'){
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="container">
      <h1>AI Dive Assistant</h1>
      <p style={{color:'var(--muted)'}}>Demo chat interface (no LLM attached). Use this to walk through conversation flows.</p>

      <div className="card" style={{marginTop:12}}>
        <div className="chat-window" ref={listRef} role="log" aria-live="polite">
          {msgs.map((m,i)=>(
            <div key={i} className={`msg ${m.from}`}><span style={{fontSize:13,opacity:.9}}>{m.text}</span></div>
          ))}
        </div>

        <div style={{display:'flex',gap:8,marginTop:8}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey} className="input" style={{flex:1}} placeholder="Ask about dive planning or species" aria-label="Message input" />
          <button className="btn" onClick={send} aria-label="Send message">Send</button>
        </div>
      </div>
    </div>
  )
}
