import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/router'

export default function Header(){
  const router = useRouter()
  const isActive = (p:string) => router.pathname === p || router.asPath.startsWith(p)
  return (
    <header className="header container" role="banner">
      <div className="brand">
        <Link href="/" aria-label="DovyDive home"><div className="logo">DD</div></Link>
        <div>
          <div style={{fontWeight:700}}>DovyDive</div>
          <div style={{fontSize:12,color:'var(--muted)'}}>Multi-location dive assistant</div>
        </div>
      </div>
      <nav className="nav" role="navigation" aria-label="Main navigation">
        <Link href="/" className={isActive('/')? 'active':''}>Home</Link>
        <Link href="/location" className={isActive('/location')? 'active':''}>Locations</Link>
        <Link href="/chat" className={isActive('/chat')? 'active':''}>AI Chat</Link>
      </nav>
    </header>
  )
}