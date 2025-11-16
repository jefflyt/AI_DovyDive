import React from 'react'
import Link from 'next/link'

export default function Tioman(){
  return (
    <div className="container">
      <h1>Tioman — Demo Location</h1>
      <p style={{color:'var(--muted)'}}>Tioman demo page. This is a static fallback to ensure the route works.</p>

      <div className="card">
        <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=60&auto=format&fit=crop" alt="Tioman" style={{width:'100%',height:320,objectFit:'cover',borderRadius:8}} />
        <div style={{padding:12}}>
          <h3>Top Spots</h3>
          <ul style={{color:'var(--muted)'}}>
            <li>Coral Garden</li>
            <li>Shark Point</li>
            <li>Wreck Alley</li>
          </ul>
          <Link href="/location"><button className="btn">Back to Locations</button></Link>
        </div>
      </div>
    </div>
  )
}
