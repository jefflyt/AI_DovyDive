import React from 'react'

export default function Footer(){
  return (
    <footer className="footer">
      <div className="container">
        <div className="card" style={{padding:'1rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
            <div>
              <strong>DovyDive</strong>
              <div style={{color:'var(--muted)'}}>Demo site — dummy content for presentations</div>
            </div>
            <div style={{color:'var(--muted)'}}>© {new Date().getFullYear()} DovyDive</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
