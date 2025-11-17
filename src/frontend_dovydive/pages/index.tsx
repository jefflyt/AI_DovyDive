import Link from 'next/link'
import React from 'react'

export default function Home(){
  return (
    <div className="container">
      <div className="hero">
        <section>
          <div className="hero-badge">AI-Powered Dive Assistant</div>
          <h1>Discover Your Next Dive Adventure</h1>
          <p className="hero-subtitle">Explore stunning dive locations, identify marine species, and get expert local tips — all powered by AI technology and curated dive content.</p>

          <div className="cta-buttons">
            <Link href="/location"><button className="btn btn-primary">Explore Locations</button></Link>
            <Link href="/chat"><button className="btn btn-secondary">Chat with AI</button></Link>
          </div>

          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🗺️</div>
              <div className="feature-content">
                <h3>Multi-Location</h3>
                <p>Discover Tioman, Perhentian & more</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🤖</div>
              <div className="feature-content">
                <h3>AI Assistant</h3>
                <p>Get dive planning & species guidance</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📸</div>
              <div className="feature-content">
                <h3>Rich Content</h3>
                <p>Photos, spots & detailed information</p>
              </div>
            </div>
          </div>
        </section>

        <aside className="featured-spots">
          <h2 className="featured-title">Featured Dive Spots</h2>
          <div className="locations">
            <Link href="/location" className="loc-card">
              <div className="loc-card-image">
                <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=60&auto=format&fit=crop" alt="Tioman Island" />
                <div className="loc-card-overlay"></div>
              </div>
              <div className="loc-card-content">
                <strong>Tioman Island</strong>
                <div className="loc-card-description">Coral gardens & gentle slopes</div>
              </div>
            </Link>
            <Link href="/location" className="loc-card">
              <div className="loc-card-image">
                <img src="https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=900&q=60&auto=format&fit=crop" alt="Perhentian Islands" />
                <div className="loc-card-overlay"></div>
              </div>
              <div className="loc-card-content">
                <strong>Perhentian Islands</strong>
                <div className="loc-card-description">Turtles & lively reefs</div>
              </div>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
