import React, { useState } from 'react'

type Msg = { from: 'user' | 'assistant'; text: string }

export default function Chat(): JSX.Element {
  const [input, setInput] = useState<string>('')
  const [msgs, setMsgs] = useState<Msg[]>([])
  function send(){
    if(!input) return
    setMsgs(m=>[...m, {from:'user', text:input}])
    setMsgs(m=>[...m, {from:'assistant', text:`(stub) reply to: ${input}`}])
    setInput('')
  }
  return (
    <div style={{maxWidth:900, margin:'2rem auto', padding:'0 1rem'}}>
      <h1>AI Dive Assistant (Telegram & Web)</h1>
      <div style={{marginBottom: '1rem'}}>
        {msgs.map((m,i)=>(<div key={i}><strong>{m.from}:</strong> {m.text}</div>))}
      </div>
      <div style={{display:'flex', gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} style={{flex:1}} />
        <button onClick={send}>Send</button>
      </div>
    </div>
  )
}
