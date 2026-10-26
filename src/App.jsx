import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import Benefits from './components/Benefits'
import About from './components/About'
import Domains from './components/Domains'
import Timeline from './components/Timeline'
import Speakers from './components/Speakers'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import { DialogProvider } from './components/ui/Dialog'
import { useReveal } from './hooks/useReveal'
import './App.css'

function Page() {
  useReveal()

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        <Hero />
        <Ticker />
        <Benefits />
        <About />
        <Domains />
        <Timeline />
        <Speakers />
        <FAQ />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
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
