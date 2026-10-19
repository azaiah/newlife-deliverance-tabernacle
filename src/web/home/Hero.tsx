import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, PlayCircle, MapPin, CalendarClock, ChevronDown } from 'lucide-react'
import { church, weekly } from '@/config/site'
import { Eyebrow, GoldButton, GlassButton } from '../ui'

/** Parses "7:00 PM" / "5:00 to 7:00 PM" / "11:00 AM to 1:00 PM" into minutes after midnight (start time). */
function startMinutes(t: string) {
  const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
  if (!m) return 0
  let h = Number(m[1]) % 12
  const ampm = (m[3] ?? (t.match(/(AM|PM)/i)?.[1] ?? 'AM')).toUpperCase()
  if (ampm === 'PM') h += 12
  return h * 60 + Number(m[2])
}

export function nextGathering(now = new Date()) {
  const nowMin = now.getDay() * 1440 + now.getHours() * 60 + now.getMinutes()
  const items = weekly.filter((w) => !/3rd|2nd/.test(w.detail) || true).map((w) => ({ w, at: w.dayIndex * 1440 + startMinutes(w.time) }))
  const sorted = items.map((x) => ({ ...x, delta: (x.at - nowMin + 7 * 1440) % (7 * 1440) })).sort((a, b) => a.delta - b.delta)
  const n = sorted[0]
  const label = n.delta < 1440 && n.w.dayIndex === now.getDay() ? 'Today' : n.delta < 2 * 1440 && n.w.dayIndex === (now.getDay() + 1) % 7 ? 'Tomorrow' : n.w.day
  return { ...n.w, label, delta: n.delta }
}

function Embers() {
  const reduce = useReducedMotion()
  const dots = useMemo(() => Array.from({ length: 22 }, (_, i) => ({ left: (i * 37) % 100, size: 2 + ((i * 7) % 4), delay: (i * 1.7) % 14, dur: 12 + ((i * 5) % 10), o: 0.35 + ((i * 13) % 50) / 100 })), [])
  if (reduce) return null
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <span key={i} className="absolute bottom-[-10px] rounded-full bg-gold-light" style={{ left: `${d.left}%`, width: d.size, height: d.size, opacity: d.o, boxShadow: '0 0 10px 2px rgba(226,192,114,0.55)', animation: `floatUp ${d.dur}s linear ${d.delay}s infinite` }} />
      ))}
    </div>
  )
}

export function Rays({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 800 800" className={`pointer-events-none ${className}`}>
      <defs>
        <radialGradient id="rayfade" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#F3DE9E" stopOpacity="0.55" /><stop offset="0.6" stopColor="#C9A24B" stopOpacity="0.12" /><stop offset="1" stopColor="#C9A24B" stopOpacity="0" /></radialGradient>
      </defs>
      <g className="origin-center animate-rays" style={{ transformBox: 'fill-box' }}>
        {Array.from({ length: 36 }).map((_, i) => (
          <path key={i} d="M400 400 L392 0 L408 0 Z" fill="url(#rayfade)" transform={`rotate(${i * 10} 400 400)`} opacity={i % 3 === 0 ? 0.9 : 0.45} />
        ))}
      </g>
    </svg>
  )
}

export function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const [next, setNext] = useState(() => nextGathering())
  useEffect(() => { const t = setInterval(() => setNext(nextGathering()), 60000); return () => clearInterval(t) }, [])
  const line = (text: string, d: number, cls = '') => (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span className={`block ${cls}`} initial={reduce ? false : { y: '105%' }} animate={{ y: '0%' }} transition={{ duration: 1.1, delay: d, ease: [0.16, 1, 0.3, 1] }}>{text}</motion.span>
    </span>
  )
  return (
    <section ref={ref} className="relative isolate min-h-[100svh] overflow-hidden bg-midnight text-white grain" aria-label="Welcome">
      <motion.div style={reduce ? undefined : { y }} className="absolute inset-0 -z-20">
        {reduce ? (
          <img src="/images/art/hero-sanctuary-light.webp" alt="" className="h-full w-full object-cover" />
        ) : (
          <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="auto" poster="/video/hero-sanctuary-poster.jpg" aria-hidden="true">
            <source src="/video/hero-sanctuary.webm" type="video/webm" />
            <source src="/video/hero-sanctuary.mp4" type="video/mp4" />
          </video>
        )}
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-midnight via-midnight/55 to-midnight/20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight/90 via-midnight/45 to-transparent" />
      <div className="light-leaks -z-10" />
      <Rays className="absolute -z-10 left-[-30%] top-[-35%] w-[160%] sm:left-[-10%] sm:w-[110%] lg:left-[-25%] lg:w-[90%] opacity-50" />
      <Embers />

      <motion.div style={reduce ? undefined : { opacity: fade }} className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 sm:px-6 pb-14 sm:pb-20 pt-32">
        <motion.div initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
          <Eyebrow light>South Richmond · Since 1997</Eyebrow>
        </motion.div>
        <h1 className="mt-5 font-display font-semibold leading-[0.9] tracking-[-0.02em] text-[3.3rem] min-[400px]:text-[3.9rem] sm:text-[6.2rem] lg:text-[8rem] max-w-5xl" aria-label="Who the Son sets free is free indeed.">
          <span aria-hidden="true">
            {line('Who the Son', 0.3)}
            {line('sets free', 0.45)}
            {line('is free indeed.', 0.6, 'italic gold-leaf pr-2')}
          </span>
        </h1>
        <motion.div initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.9 }} className="mt-7 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="max-w-xl text-lg sm:text-xl text-white/85 leading-relaxed">A Spirit-filled church family on Decatur Street where everyone is welcomed with warmth, supported with compassion and equipped with biblical truth.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GoldButton to="/visit" size="lg" icon={<ArrowRight size={18} />}>Plan your visit</GoldButton>
              <GlassButton to="/watch" size="lg" icon={<PlayCircle size={18} />}>Watch live</GlassButton>
            </div>
          </div>
          <a href={next.title.includes('Food') ? '/community#help' : '/events'} className="group block w-full max-w-sm rounded-3xl border border-white/15 bg-white/[0.07] p-5 backdrop-blur-xl hover:border-gold-light/60 transition-colors">
            <p className="flex items-center gap-2 font-caps text-[11px] tracking-[0.24em] text-gold-light"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-gold-light opacity-70 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-gold-light" /></span> Next at New Life</p>
            <p className="mt-3 font-display text-3xl leading-tight">{next.title}</p>
            <p className="mt-1 text-white/75 flex items-center gap-2"><CalendarClock size={16} className="text-gold-light" /> {next.label} · {next.time}</p>
            <p className="mt-1 text-white/60 text-sm flex items-center gap-2"><MapPin size={14} /> {next.where}, {church.street}</p>
          </a>
        </motion.div>
        <motion.a href="#rhythm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="absolute left-1/2 -translate-x-1/2 bottom-4 hidden sm:flex flex-col items-center gap-1 text-white/60 hover:text-white text-xs font-caps tracking-[0.3em]" aria-label="Scroll to this week at New Life">
          Scroll <ChevronDown size={16} className="animate-bounce" />
        </motion.a>
      </motion.div>
    </section>
  )
}
