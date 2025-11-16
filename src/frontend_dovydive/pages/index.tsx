import Link from 'next/link'
import React from 'react'

export default function Home(){
  return (
    <div className="container">
      <div className="hero">
        <section>
          <h1>DovyDive — Your AI Dive Assistant</h1>
          <p style={{color:'var(--muted)'}}>Explore dive locations, identify species, and get local tips — powered by a demo AI assistant and curated content.</p>

          <div style={{marginTop:16}} className="card">
            <h3 style={{margin:'0 0 .5rem 0'}}>Highlights</h3>
            <ul style={{margin:'0',color:'var(--muted)'}}>
              <li>Multi-location content (Tioman, Perhentian)</li>
              <li>AI Chat for dive planning and species guidance</li>
              <li>Location pages with photos and top spots</li>
            </ul>
          </div>

          <div style={{marginTop:12}}>
            <Link href="/location"><button className="btn">Browse Locations</button></Link>
            <Link href="/chat"><button className="btn" style={{marginLeft:8}}>Open AI Chat</button></Link>
          </div>
        </section>

        <aside className="card">
          <h4 style={{marginTop:0}}>Featured Spots</h4>
          <div className="locations">
            <div className="loc-card card">
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=60&auto=format&fit=crop" alt="Tioman" />
              <div style={{padding:8}}>
                <strong>Tioman</strong>
                <div style={{color:'var(--muted)',fontSize:13}}>Coral gardens & gentle slopes</div>
              </div>
            </div>
            <div className="loc-card card">
              <img src="https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=900&q=60&auto=format&fit=crop" alt="Perhentian" />
              <div style={{padding:8}}>
                <strong>Perhentian</strong>
                <div style={{color:'var(--muted)',fontSize:13}}>Turtles & lively reefs</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
