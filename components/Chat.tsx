import React from 'react'

export default function Chat({messages}:{messages:any[]}){
  return (
    <div>
      {messages.map((m:any)=> (
        <div key={m.id} className={`msg ${m.role}`}>
          <strong>{m.role}</strong>
          <p>{m.text}</p>
        </div>
      ))}
    </div>
  )
}
