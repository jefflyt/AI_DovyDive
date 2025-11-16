import '../styles/global.css'
import type { AppProps } from 'next/app'
import Header from '../components/Header'
import Footer from '../components/Footer'
import React from 'react'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <main style={{minHeight:'70vh'}}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  )
}
