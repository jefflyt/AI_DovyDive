import Link from 'next/link'
import React from 'react'

type Loc = { slug: string; name: string }

export default function LocationList(): JSX.Element {
  const sample: Loc[] = [ {slug: 'tioman', name: 'Tioman'}, {slug: 'perhentian', name: 'Perhentian'} ]
  return (
    <div style={{maxWidth:900, margin:'2rem auto', padding:'0 1rem'}}>
      <h1>Locations</h1>
      <ul>
        {sample.map(l => (
          <li key={l.slug}><Link href={`/location/${l.slug}`}>{l.name}</Link></li>
        ))}
      </ul>
    </div>
  )
}
