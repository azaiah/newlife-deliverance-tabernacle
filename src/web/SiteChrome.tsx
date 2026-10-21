import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { createPortal } from 'react-dom'
import { Menu, X, Phone, MapPin, Clock, Facebook, ArrowUpRight, LogIn, Heart, Navigation } from 'lucide-react'
import { SiteLogo, Mark, PoweredBy } from '@/components/Logo'
import { useFocusTrap } from '@/components/useFocusTrap'
import { church, officeHours } from '@/config/site'
import { GoldButton } from './ui'
import { Assistant } from './Assistant'

export const siteNav = [
  { to: '/visit', label: 'Visit' },
  { to: '/about', label: 'About' },
  { to: '/ministries', label: 'Ministries' },
  { to: '/community', label: 'Community' },
  { to: '/events', label: 'Events' },
  { to: '/watch', label: 'Watch' },
]

function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  return <motion.div aria-hidden="true" style={{ scaleX: x }} className="fixed top-0 inset-x-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-amethyst via-gold-bright to-gold-light" />
}

export function SiteHeader() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, open, () => setOpen(false))
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  // Steady menu: pin the page in place while it is open (iOS ignores overflow:hidden on html), then restore the exact scroll position.
  useEffect(() => {
    if (!open) return
    const y = window.scrollY
    const b = document.body.style
    const prev = { position: b.position, top: b.top, left: b.left, right: b.right, width: b.width }
    b.position = 'fixed'; b.top = `-${y}px`; b.left = '0'; b.right = '0'; b.width = '100%'
    return () => {
      b.position = prev.position; b.top = prev.top; b.left = prev.left; b.right = prev.right; b.width = prev.width
      window.scrollTo(0, y)
    }
  }, [open])
  const light = !scrolled
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-linen/85 backdrop-blur-xl shadow-[0_1px_0_rgba(26,15,43,0.08)]' : 'bg-gradient-to-b from-midnight/70 to-transparent'}`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 transition-all duration-500 ${scrolled ? 'h-[68px]' : 'h-20 sm:h-24'}`}>
        <SiteLogo light={light} compact={scrolled} />
        <nav aria-label="Primary" className="hidden xl:flex items-center gap-1">
          {siteNav.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `relative px-3.5 py-2 text-[15px] font-semibold rounded-full min-h-[44px] inline-flex items-center transition-colors ${light ? (isActive ? 'text-white' : 'text-white/80 hover:text-white') : (isActive ? 'text-plum' : 'text-midnight/75 hover:text-plum')}`}>
              {({ isActive }) => <>{l.label}{isActive && <motion.span layoutId="navdot" className="absolute left-1/2 -translate-x-1/2 bottom-1 h-1 w-1 rounded-full bg-gold-bright" />}</>}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 min-h-[44px] text-sm font-semibold ${light ? 'text-white/85 hover:text-white' : 'text-midnight/75 hover:text-plum'}`}><LogIn size={16} /> Sign in</Link>
          <GoldButton to="/give" className="hidden sm:inline-flex !min-h-[44px] !px-5 text-sm" icon={<Heart size={15} />}>Give</GoldButton>
          <button type="button" onClick={() => setOpen(true)} className={`xl:hidden tap inline-flex items-center justify-center rounded-full ${light ? 'text-white hover:bg-white/10' : 'text-midnight hover:bg-midnight/5'}`} aria-label="Open menu" aria-expanded={open}><Menu size={26} /></button>
        </div>
      </div>
      {createPortal(<AnimatePresence>
        {open && (
          <motion.div ref={ref} role="dialog" aria-modal="true" aria-label="Menu" tabIndex={-1} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-[90] bg-midnight text-white overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y grain" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden"><div className="light-leaks" /></div>
            <div className="relative flex items-center justify-between px-4 sm:px-6 h-20">
              <SiteLogo light />
              <button type="button" onClick={() => setOpen(false)} className="tap inline-flex items-center justify-center rounded-full hover:bg-white/10" aria-label="Close menu"><X size={26} /></button>
            </div>
            <nav aria-label="Mobile" className="relative px-6 pt-6">
              <ul>
                {[{ to: '/', label: 'Home' }, ...siteNav, { to: '/give', label: 'Give' }, { to: '/prayer', label: 'Prayer' }, { to: '/contact', label: 'Contact' }].map((l, i) => (
                  <motion.li key={l.to} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.045, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                    <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => `flex items-baseline gap-4 py-2.5 font-display text-[2.4rem] leading-tight ${isActive ? 'text-gold-light' : 'text-white hover:text-gold-light'}`}>
                      <span className="font-mono text-xs text-white/35 w-6">{String(i + 1).padStart(2, '0')}</span>{l.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="relative px-6 py-8 mt-4 border-t border-white/10 grid gap-3 text-white/75">
              <p className="flex items-center gap-2"><Clock size={16} className="text-gold-light" /> Sundays 9:45 AM · Bible Study Tuesdays 7 PM</p>
              <a href={church.directionsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white min-h-[44px]"><MapPin size={16} className="text-gold-light" /> {church.street}, Richmond</a>
              <a href={church.phoneHref} className="flex items-center gap-2 hover:text-white min-h-[44px]"><Phone size={16} className="text-gold-light" /> {church.phone}</a>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <GoldButton to="/give" icon={<Heart size={16} />}>Give</GoldButton>
                <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 min-h-[48px] font-semibold hover:bg-white/10"><LogIn size={16} /> Sign in</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </header>
  )
}

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative overflow-hidden bg-midnight text-white grain">
      <div aria-hidden="true" className="absolute -right-40 -top-40 opacity-[0.06]"><Mark size={620} light /></div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <SiteLogo light />
            <p className="mt-6 font-display text-3xl leading-tight text-white/90 max-w-sm">&ldquo;{church.scripture}&rdquo;</p>
            <p className="mt-2 font-caps text-xs tracking-[0.24em] text-gold-light">{church.scriptureRef}</p>
            <div className="mt-8 flex gap-2">
              <a href={church.facebook} target="_blank" rel="noopener noreferrer" className="tap inline-flex items-center justify-center rounded-full border border-white/20 hover:border-gold-light hover:text-gold-light" aria-label="New Life on Facebook"><Facebook size={18} /></a>
              <a href={church.directionsUrl} target="_blank" rel="noopener noreferrer" className="tap inline-flex items-center justify-center rounded-full border border-white/20 hover:border-gold-light hover:text-gold-light" aria-label="Directions to 900 Decatur St"><Navigation size={18} /></a>
              <a href={church.phoneHref} className="tap inline-flex items-center justify-center rounded-full border border-white/20 hover:border-gold-light hover:text-gold-light" aria-label={`Call ${church.phone}`}><Phone size={18} /></a>
            </div>
          </div>
          <div>
            <p className="font-caps text-xs tracking-[0.24em] text-gold-light">Gather</p>
            <ul className="mt-4 space-y-3 text-white/80">
              <li><span className="block text-white font-semibold">Sunday Worship</span>9:45 AM</li>
              <li><span className="block text-white font-semibold">Bible Study</span>Tuesdays 7:00 PM</li>
              <li><span className="block text-white font-semibold">Food Distribution</span>Wed 1 to 3 PM · Sat 11 AM to 1 PM</li>
              <li><span className="block text-white font-semibold">After-School</span>Mon &amp; Wed 5 to 7 PM</li>
            </ul>
          </div>
          <div>
            <p className="font-caps text-xs tracking-[0.24em] text-gold-light">Find us</p>
            <address className="mt-4 not-italic text-white/80 space-y-3">
              <a href={church.directionsUrl} target="_blank" rel="noopener noreferrer" className="block hover:text-white">{church.address}<br />{church.city}, {church.state} {church.zip}</a>
              <a href={church.phoneHref} className="flex items-center min-h-[44px] hover:text-white">{church.phone}</a>
              <a href={`mailto:${church.email}`} className="flex items-center min-h-[44px] hover:text-white break-all">{church.email}</a>
            </address>
            <p className="mt-4 text-sm text-white/60">Office: {officeHours[0].d}, {officeHours[0].h}</p>
          </div>
          <div>
            <p className="font-caps text-xs tracking-[0.24em] text-gold-light">Explore</p>
            <ul className="mt-4 grid grid-cols-2 lg:grid-cols-1 gap-x-4">
              {[['/visit', 'Plan a visit'], ['/about', 'Our story'], ['/ministries', 'Ministries'], ['/community', 'Community Center'], ['/events', 'Events'], ['/watch', 'Watch'], ['/give', 'Give'], ['/prayer', 'Prayer request'], ['/life-events', 'Life events'], ['/contact', 'Contact']].map(([to, l]) => (
                <li key={to}><Link to={to} className="hit text-white/80 hover:text-gold-light">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-14 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <p className="font-display text-2xl">Members and leaders</p>
            <p className="text-white/65 mt-1">Giving history, events, ministries and the staff hub, all in New Life Connect.</p>
          </div>
          <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-midnight font-semibold px-6 min-h-[48px] hover:bg-gold-light">Sign in to New Life Connect <ArrowUpRight size={16} /></Link>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row gap-4 md:items-center justify-between text-sm text-white/55">
          <p>&copy; {year} {church.name}. {church.centerName} is a 501(c)(3) nonprofit.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link to="/privacy" className="hit hover:text-white">Privacy</Link>
            <Link to="/terms" className="hit hover:text-white">Terms</Link>
            <a href="https://church-connect-dataisdata.netlify.app/" target="_blank" rel="noopener noreferrer" className="hit"><PoweredBy light /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-linen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-gold-bright focus:px-5 focus:py-3 focus:text-midnight focus:font-semibold">Skip to content</a>
      <ScrollBar />
      <SiteHeader />
      <main id="main" className="flex-1"><Outlet /></main>
      <SiteFooter />
      <Assistant />
    </div>
  )
}
