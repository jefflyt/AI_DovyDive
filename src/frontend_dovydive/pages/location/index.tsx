import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import Card from '../../components/Card'

type Loc = { slug: string; name: string; desc?: string }

export default function LocationList(){
  const all: Loc[] = [
    {slug: 'tioman', name: 'Tioman', desc: 'Coral gardens, pelagic sightings'},
    {slug: 'perhentian', name: 'Perhentian', desc: 'Turtle cleaning stations & reefs'}
  ]
  const [q, setQ] = useState('')
  const sample = useMemo(()=> all.filter(l=> l.name.toLowerCase().includes(q.toLowerCase())),[q])
  return (
    <div className="container">
      <h1>Locations</h1>
      <p style={{color:'var(--muted)'}}>Browse curated dive sites and local highlights.</p>

      <div style={{display:'flex',gap:8,marginTop:12,alignItems:'center'}}>
        <input className="input" placeholder="Search locations" value={q} onChange={e=>setQ(e.target.value)} aria-label="Search locations" />
        <div style={{color:'var(--muted)'}}>{sample.length} results</div>
      </div>

      <div style={{marginTop:12,display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:12}}>
        {sample.map(l => (
          <Link key={l.slug} href={`/location/${l.slug}`} style={{textDecoration:'none',color:'inherit'}} aria-label={`View ${l.name}`}>
            <Card className="loc-card" style={{padding:0}}>
              <img src={`https://source.unsplash.com/collection/190727/400x300?${l.slug}`} alt={l.name} />
              <div style={{padding:10}}>
                <strong>{l.name}</strong>
                <div style={{color:'var(--muted)',fontSize:13}}>{l.desc}</div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
