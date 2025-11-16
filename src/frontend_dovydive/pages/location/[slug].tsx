import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function LocationDetail({ slug: slugProp }:{ slug?: string }){
  const router = useRouter()
  const slug = typeof slugProp === 'string' && slugProp.length > 0 ? slugProp : router.query.slug

  const name = typeof slug === 'string' ? (slug === 'perhentian' ? 'Perhentian' : 'Tioman') : 'Location'
  const spots = ['Coral Garden', 'Shark Point', 'Wreck Alley']
  const species = ['Clownfish', 'Green Turtle', 'Moray Eel', 'Shark (rare)']

  return (
    <div className="container">
      <div style={{display:'flex',gap:16,alignItems:'flex-start',flexWrap:'wrap'}}>
        <div style={{flex:1,minWidth:280}}>
          <h1>{name}</h1>
          <p style={{color:'var(--muted)'}}>Demo location page for <strong>{slug}</strong>. Photos and descriptions are placeholders.</p>

          <div className="card" style={{marginTop:12}}>
            <img src={`https://source.unsplash.com/800x300/?underwater,${name}`} alt={name} style={{width:'100%',height:220,objectFit:'cover',borderRadius:8}} />
            <div style={{padding:12}}>
              <h3 style={{marginTop:0}}>Top Dive Spots</h3>
              <ul style={{color:'var(--muted)'}}>
                {spots.map(s=>(<li key={s}>{s}</li>))}
              </ul>
            </div>
          </div>

          <div className="card" style={{marginTop:12}}>
            <h3 style={{margin:0}}>Common Species</h3>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:8}}>
              {species.map(s => (
                <div key={s} className="card" style={{padding:8}}>{s}</div>
              ))}
            </div>
          </div>
        </div>

        <aside style={{width:300,minWidth:220}}>
          <div className="card">
            <h4 style={{marginTop:0}}>Quick Info</h4>
            <div style={{color:'var(--muted)'}}>Best months: Apr - Oct</div>
            <div style={{color:'var(--muted)',marginTop:8}}>Visibility: 10-30m</div>
            <Link href="/location" className="btn" style={{marginTop:12}}>Back to Locations</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

  export async function getServerSideProps(context:any) {
    const { slug } = context.params || {}
    return {
      props: {
        slug: typeof slug === 'string' ? slug : null,
      },
    }
  }
