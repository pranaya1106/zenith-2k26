import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import About from './components/About'
import Domains from './components/Domains'
import Timeline from './components/Timeline'
import Speakers from './components/Speakers'
import Sponsors from './components/Sponsors'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { DialogProvider } from './components/ui/Dialog'
import { useEffect } from 'react'
import { useReveal } from './hooks/useReveal'
import { useSectionTransitions } from './hooks/useSectionTransitions'
import { startSmoothScroll } from './lib/smoothScroll'
import './App.css'

function Page() {
  useReveal()
  useSectionTransitions()
  useEffect(() => startSmoothScroll(), [])

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        <Hero />
        <Benefits />
        <About />
        <Domains />
        <Timeline />
        <Speakers />
        <Sponsors />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <DialogProvider>
      <Page />
    </DialogProvider>
  )
}
