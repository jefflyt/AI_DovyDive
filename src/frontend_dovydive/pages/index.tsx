import Link from 'next/link'
import React from 'react'

export default function Home() {
  return (
    <div style={{maxWidth: 900, margin: '2rem auto', padding: '0 1rem'}}>
      <h1>DovyDive</h1>
      <p>Welcome to DovyDive — multi-location dive assistant.</p>

      <nav style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
        <Link href="/location">Locations</Link>
        <Link href="/chat">AI Chat</Link>
      </nav>
    </div>
  )
}
