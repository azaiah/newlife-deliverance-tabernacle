import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { DemoProvider } from '@/data/store'
import { SiteLayout } from './web/SiteChrome'
import Home from './web/pages/Home'
import { Mark } from './components/Logo'

const Visit = lazy(() => import('./web/pages/Visit'))
const About = lazy(() => import('./web/pages/About'))
const Ministries = lazy(() => import('./web/pages/MinistriesPage'))
const Community = lazy(() => import('./web/pages/Community'))
const Events = lazy(() => import('./web/pages/Events'))
const Watch = lazy(() => import('./web/pages/Watch'))
const Give = lazy(() => import('./web/pages/Give'))
const Prayer = lazy(() => import('./web/pages/Prayer'))
const LifeEvents = lazy(() => import('./web/pages/LifeEvents'))
const Contact = lazy(() => import('./web/pages/Contact'))
const Privacy = lazy(() => import('./web/pages/Legal').then((m) => ({ default: m.Privacy })))
const Terms = lazy(() => import('./web/pages/Legal').then((m) => ({ default: m.Terms })))
const NotFound = lazy(() => import('./web/pages/NotFound'))
const Login = lazy(() => import('./auth/Login'))
const PortalApp = lazy(() => import('./portal/PortalApp'))
const AdminApp = lazy(() => import('./admin/AdminApp'))

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Pages load lazily, so wait (up to ~2s) for the anchor to exist before scrolling to it.
      let tries = 0
      let t = 0
      const seek = () => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        else if (tries++ < 25) t = window.setTimeout(seek, 80)
      }
      t = window.setTimeout(seek, 60)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, hash])
  return null
}

function Loading() {
  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center" role="status" aria-live="polite">
      <div className="text-center">
        <Mark size={64} light className="mx-auto animate-pulse" />
        <p className="mt-4 font-caps text-[11px] tracking-[0.3em] text-gold-light">Loading</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <DemoProvider>
      <ScrollToTop />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="/about" element={<About />} />
            <Route path="/ministries" element={<Ministries />} />
            <Route path="/community" element={<Community />} />
            <Route path="/events" element={<Events />} />
            <Route path="/watch" element={<Watch />} />
            <Route path="/give" element={<Give />} />
            <Route path="/prayer" element={<Prayer />} />
            <Route path="/life-events" element={<LifeEvents />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/portal/*" element={<PortalApp />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Suspense>
    </DemoProvider>
  )
}
