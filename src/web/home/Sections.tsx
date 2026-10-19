import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ShoppingBasket, HeartHandshake, Bus, HandHeart, Phone, Clock, MapPin, Navigation, Play, Heart, X, ChevronLeft, ChevronRight, BookOpen, Music, Users, Sparkles, Church, Utensils } from 'lucide-react'
import { church, weekly, type WeeklyItem } from '@/config/site'
import { Stagger, item, CountUp, Parallax } from '../motion'
import { Photo, Art, art, Eyebrow, SectionHeading, SplitWords, GoldButton, GlassButton, RoyalButton, OutlineButton, Container, photoAlt } from '../ui'
import { Rays } from './Hero'

/* ------------------------------------------------------------------ Marquee */
export function Marquee() {
  const words = ['Healing', 'Deliverance', 'Empowerment', 'Community', 'Since 1997', '900 Decatur Street', 'Free indeed']
  const row = [...words, ...words]
  return (
    <div className="relative overflow-hidden bg-plum text-gold-light py-4 border-y border-gold-bright/30" aria-hidden="true">
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap font-caps text-sm sm:text-base tracking-[0.3em]">
        {[...row, ...row].map((w, i) => <span key={i} className="inline-flex items-center gap-10">{w}<span aria-hidden="true" className="inline-block h-2 w-2 rotate-45 bg-gold-light/50" /></span>)}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ Weekly rhythm */
const kindStyle: Record<WeeklyItem['kind'], { icon: typeof Church; chip: string }> = {
  worship: { icon: Church, chip: 'bg-plum text-white' },
  study: { icon: BookOpen, chip: 'bg-royal-50 text-plum' },
  care: { icon: HeartHandshake, chip: 'bg-[#F6E8F1] text-[#8A1F5C]' },
  outreach: { icon: ShoppingBasket, chip: 'bg-[#E6F3EC] text-[#155E3A]' },
  youth: { icon: Sparkles, chip: 'bg-gold-50 text-gold' },
  music: { icon: Music, chip: 'bg-royal-50 text-plum' },
  fellowship: { icon: Users, chip: 'bg-[#F6E8F1] text-[#8A1F5C]' },
}
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function Rhythm() {
  const today = new Date().getDay()
  const [day, setDay] = useState(() => (weekly.some((w) => w.dayIndex === today) ? today : weekly.find((w) => w.dayIndex > today)?.dayIndex ?? 0))
  const list = weekly.filter((w) => w.dayIndex === day)
  return (
    <section id="rhythm" className="relative bg-linen py-24 sm:py-32 overflow-hidden scroll-mt-20">
      <div aria-hidden="true" className="absolute inset-0 opacity-70" style={{ backgroundImage: `url(${art('stained-light-texture', true)})`, backgroundSize: 'cover', backgroundPosition: 'center', maskImage: 'linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)' }} />
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHeading eyebrow="Every week at New Life" title="There is something happening almost every day." text="Worship, the Word, groceries for neighbors, tutoring for students and a place to talk about what matters on our block. Pick a day." />
          <div role="tablist" aria-label="Day of the week" className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {days.map((d, i) => {
              const has = weekly.some((w) => w.dayIndex === i)
              const active = day === i
              return (
                <button key={d} role="tab" aria-selected={active} disabled={!has} onClick={() => setDay(i)} className={`relative shrink-0 flex flex-col items-center justify-center rounded-2xl min-w-[64px] h-[84px] px-3 border transition-all ${active ? 'bg-midnight text-white border-midnight shadow-lift' : has ? 'bg-paper border-line hover:border-plum text-midnight' : 'bg-transparent border-dashed border-line text-slate/50 cursor-not-allowed'}`}>
                  <span className="font-caps text-[11px] tracking-[0.2em]">{d.slice(0, 3)}</span>
                  <span className="mt-1 font-display text-2xl leading-none">{weekly.filter((w) => w.dayIndex === i).length || '·'}</span>
                  {i === today && <span className={`absolute -top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? 'bg-gold-bright text-midnight' : 'bg-plum text-white'}`}>Today</span>}
                </button>
              )
            })}
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((w, i) => {
              const K = kindStyle[w.kind]
              return (
                <motion.article key={`${day}-${w.title}`} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.08 } }} exit={{ opacity: 0, scale: 0.97 }} className="group relative rounded-3xl bg-paper border border-line p-6 sm:p-7 shadow-card hover:shadow-lift transition-shadow overflow-hidden">
                  <div aria-hidden="true" className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold-bright/10 blur-2xl group-hover:bg-gold-bright/20 transition-colors" />
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${K.chip}`}><K.icon size={14} /> {w.where}</span>
                  <h3 className="mt-4 font-display text-[1.9rem] font-semibold leading-tight">{w.title}</h3>
                  <p className="mt-1 flex items-center gap-2 font-semibold text-plum"><Clock size={16} /> {w.day} · {w.time}</p>
                  <p className="mt-3 text-slate leading-relaxed">{w.detail}</p>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </div>
        <div className="mt-10 flex flex-wrap gap-3"><RoyalButton to="/events" icon={<ArrowRight size={16} />}>Full calendar</RoyalButton><OutlineButton to="/visit">First time? Start here</OutlineButton></div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ Welcome from the pastors */
export function Welcome() {
  return (
    <section className="relative bg-paper py-24 sm:py-32 overflow-hidden" id="welcome">
      <Container className="grid gap-14 lg:grid-cols-2 lg:items-center">
        <div className="relative">
          <Parallax speed={0.15}>
            <div className="relative mx-auto max-w-md">
              <div aria-hidden="true" className="absolute -inset-6 rounded-[999px_999px_28px_28px/520px_520px_28px_28px] border border-gold-bright/40" />
              <Photo name="pastors-portrait" className="arch aspect-[4/5] shadow-lift" alt="The pastors of New Life Deliverance Tabernacle" />
              <div className="absolute -bottom-8 -left-6 sm:-left-12 rounded-2xl bg-midnight text-white px-5 py-4 shadow-lift max-w-[15rem]">
                <p className="font-caps text-[10px] tracking-[0.24em] text-gold-light">Serving together</p>
                <p className="font-display text-xl leading-snug mt-1">Two pastors, called to the same house, standing side by side.</p>
              </div>
            </div>
          </Parallax>
        </div>
        <div>
          <Eyebrow>Welcome home</Eyebrow>
          <SplitWords as="h2" text="Every person deserves to be welcomed with warmth." className="display text-[2.6rem] sm:text-6xl mt-4 text-balance" />
          <div className="mt-6 space-y-4 text-lg text-slate leading-relaxed">
            <p>Our mission centers on healing, empowerment and genuine connection. Whether you need prayer, a meal, counseling or community, you will find people here who will walk with you.</p>
            <p>For nearly three decades we have shown that spiritual fulfillment and practical help go hand in hand. Come as you are. You do not have to have it all together to belong here.</p>
          </div>
          <div className="mt-8 flex items-center gap-5">
            <div className="h-px flex-1 bg-gradient-to-r from-gold-bright/60 to-transparent" />
          </div>
          <p className="mt-4 font-display text-2xl italic text-midnight">Rev. Dr. Robert A. Winfree <span className="text-slate not-italic text-lg">&amp;</span> Rev. Michael L. Winfree</p>
          <p className="font-caps text-[11px] tracking-[0.24em] text-gold mt-1">Founder &amp; Senior Pastor · Pastor</p>
          <div className="mt-8 flex flex-wrap gap-3"><RoyalButton to="/about#pastors" icon={<ArrowRight size={16} />}>Meet our pastors</RoyalButton><OutlineButton to="/about">Our story</OutlineButton></div>
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ Help today */
export function HelpBand() {
  const items = [
    { icon: ShoppingBasket, t: 'Groceries', d: 'Free FeedMore distribution. No eligibility requirement.', when: 'Wed 1 to 3 PM · Sat 11 AM to 1 PM', to: '/community#help' },
    { icon: HeartHandshake, t: 'Counseling & grief support', d: 'Confidential spiritual guidance, family and grief support.', when: 'Tuesdays 5 to 7 PM', to: '/prayer' },
    { icon: Bus, t: 'A ride', d: 'Transportation to worship and programs for seniors and neighbors.', when: 'Request by Friday', to: '/visit#ride' },
    { icon: HandHeart, t: 'Prayer', d: 'Our pastors and prayer team will pray with you. Keep it confidential if you like.', when: 'Anytime', to: '/prayer' },
  ]
  return (
    <section className="relative isolate bg-midnight text-white py-24 sm:py-32 overflow-hidden grain">
      <Art name="pantry-abundance" alt="" className="absolute inset-0 -z-10 opacity-35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-midnight via-midnight/85 to-plum/70" />
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading light eyebrow="Need help today?" title="You do not have to carry it alone." text="Meeting basic needs is part of how we love our neighbors in Blackwell, Hillside, Manchester and across the Southside." />
          <a href={church.phoneHref} className="group inline-flex items-center gap-4 rounded-3xl border border-white/15 bg-white/[0.06] px-6 py-5 hover:border-gold-light/60 backdrop-blur">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-bright text-midnight"><Phone size={22} /></span>
            <span><span className="block font-caps text-[11px] tracking-[0.24em] text-gold-light">Call the church office</span><span className="block font-display text-3xl">{church.phone}</span><span className="block text-sm text-white/60">Mon to Fri, 11 AM to 4 PM</span></span>
          </a>
        </div>
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((x) => (
            <motion.div key={x.t} variants={item}>
              <Link to={x.to} className="group flex h-full flex-col rounded-3xl border border-white/12 bg-white/[0.05] p-6 backdrop-blur-md hover:bg-white/[0.1] hover:border-gold-light/50 transition-colors">
                <x.icon size={30} className="text-gold-light" />
                <h3 className="mt-5 font-display text-2xl font-semibold">{x.t}</h3>
                <p className="mt-2 text-white/70 leading-relaxed flex-1">{x.d}</p>
                <p className="mt-5 text-sm font-semibold text-gold-light">{x.when}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white">Get started <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></span>
              </Link>
            </motion.div>
          ))}
        </Stagger>
        <p className="mt-8 text-sm text-white/55">In a crisis right now? Call or text 988 any time for the Suicide &amp; Crisis Lifeline. In an emergency, call 911.</p>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ Theme 2026 */
export function Theme() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1])
  const glow = useTransform(scrollYProgress, [0.2, 0.55], [0, 1])
  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-midnight text-white py-28 sm:py-40 grain" aria-label="Theme for 2026">
      <motion.div style={reduce ? undefined : { scale }} className="absolute inset-0 -z-10"><Art name="seed-of-faith" alt="" className="h-full w-full opacity-70" /></motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight via-midnight/75 to-midnight/30" />
      <motion.div style={reduce ? undefined : { opacity: glow }} className="absolute inset-0 -z-10" aria-hidden="true"><Rays className="absolute right-[-20%] top-1/2 -translate-y-1/2 w-[90%] opacity-50" /></motion.div>
      <Container>
        <Eyebrow light>Theme for 2026</Eyebrow>
        <blockquote className="mt-6 max-w-5xl">
          <SplitWords as="p" text={church.theme2026.line1} className="font-display text-[2.5rem] sm:text-7xl lg:text-8xl leading-[1] font-semibold" stagger={0.05} />
          <SplitWords as="p" text={church.theme2026.line2} className="font-display text-[2.5rem] sm:text-7xl lg:text-8xl leading-[1] font-semibold italic gold-leaf" stagger={0.05} delay={0.3} />
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 0.8 }} className="mt-8 max-w-2xl text-xl sm:text-2xl text-white/80 leading-relaxed">{church.theme2026.line3}</motion.p>
        </blockquote>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ Story timeline (horizontal scroll) */
export const milestones = [
  { y: '1985', t: 'A dream for returning citizens', d: 'Rev. Berkley Jones, chaplain of the Pocahontas Correctional Field Unit #13, dreams of a church that ministers to the whole person: faith, recovery, family, work. Before he goes home to be with the Lord, he shares the dream with Robert A. Winfree and Randolph Burt, Sr.', photo: 'bible-hands' },
  { y: '1991', t: 'Ordained to preach', d: 'Called to preach in 1986, Robert A. Winfree is ordained in 1991. Working with drug rehabilitation centers, he builds an after-care group called Relapse Prevention, later New Life Maintenance.', photo: 'pulpit-1' },
  { y: '1997', t: 'New Life is born', d: 'In March 1997 the maintenance group becomes a church. New Life Deliverance Tabernacle holds its first service at the Richmond Marriott.', photo: 'worship-full-1' },
  { y: '1998', t: 'A home on Midlothian Turnpike', d: 'With support from area pastors, New Life moves to 5450 Midlothian Turnpike and births a nonprofit education center, the Strive to Stay Alive program and the Mighty Mentor program.', photo: 'youth-group' },
  { y: '2007', t: '900 Decatur Street', d: 'God blesses the church with a move to its present home in South Richmond, where after-school programs, food distribution and family counseling grow.', photo: 'exterior' },
  { y: '2022', t: 'New Life Community Center', d: 'The community center receives 501(c)(3) status to expand equal access to programs and services for at-risk youth.', photo: 'youth-class' },
  { y: '2025', t: 'Rev Robert A Winfree St', d: 'Richmond City Council honors Pastor Winfree with an honorary designation of the 900 block of Decatur Street, celebrated with neighbors and city officials.', photo: 'street-sign' },
  { y: '2026', t: 'Believe it to receive it', d: 'A new season of faith, community conversations and expanded programs, with the same calling: to set the captives free.', photo: 'congregation-praise' },
]

export function Timeline() {
  const ref = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [dist, setDist] = useState(0)
  useEffect(() => {
    const measure = () => { if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 48)) }
    measure(); window.addEventListener('resize', measure); return () => window.removeEventListener('resize', measure)
  }, [])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -dist])
  const bar = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%'])
  const cards = milestones.map((m, i) => (
    <article key={m.y} className="relative w-[82vw] sm:w-[440px] shrink-0">
      <Photo name={m.photo} className="aspect-[4/3] rounded-[28px]" />
      <div className="absolute top-4 left-4 rounded-full bg-midnight/80 backdrop-blur px-4 py-1.5 font-caps text-sm tracking-[0.2em] text-gold-light">{m.y}</div>
      <h3 className="mt-6 font-display text-3xl font-semibold leading-tight">{m.t}</h3>
      <p className="mt-3 text-slate leading-relaxed">{m.d}</p>
      <span className="absolute -top-3 right-4 font-display text-[7rem] leading-none text-plum/[0.06] select-none" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
    </article>
  ))
  if (reduce) {
    return (
      <section className="bg-parchment py-24"><Container><SectionHeading eyebrow="Our story" title="From a dream behind prison walls to a home on Decatur Street." /><div className="mt-12 grid gap-10 md:grid-cols-2">{cards}</div></Container></section>
    )
  }
  return (
    <section ref={ref} className="relative h-[420vh] bg-parchment" aria-label="Our story">
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-center">
        <Container className="w-full">
          <div className="flex items-end justify-between gap-6">
            <div className="max-w-2xl"><Eyebrow>Our story</Eyebrow><h2 className="display text-[2.3rem] sm:text-6xl mt-3 text-balance">From a dream behind prison walls to a home on Decatur Street.</h2></div>
            <Link to="/about" className="hidden md:inline-flex shrink-0 items-center gap-2 font-semibold text-plum hover:text-amethyst min-h-[44px]">Full history <ArrowRight size={16} /></Link>
          </div>
          <div className="mt-6 h-[3px] w-full rounded bg-line overflow-hidden"><motion.div style={{ width: bar }} className="h-full bg-gradient-to-r from-amethyst to-gold-bright" /></div>
        </Container>
        <motion.div ref={track} style={{ x }} className="mt-10 flex gap-8 sm:gap-12 pl-4 sm:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pr-10">{cards}</motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ Real facts (no invented statistics) */
export function Facts() {
  const facts = [
    { n: new Date().getFullYear() - 1997, s: '', l: 'years of ministry', d: 'Since the first service at the Richmond Marriott in March 1997.' },
    { n: 2, s: '', l: 'food distribution days every week', d: 'Wednesdays and Saturdays with FeedMore. No eligibility requirement.' },
    { n: 3, s: '', l: 'schools adopted', d: 'George Wythe High, River City Middle and Oak Grove-Bellemeade Elementary.' },
    { n: 14, s: '+', l: 'ministries serving', d: 'From ushers and culinary arts to transportation, security and the GALS.' },
  ]
  return (
    <section className="bg-paper py-24 sm:py-28 border-y border-line">
      <Container>
        <SectionHeading eyebrow="Faith in action" title="Faith is not just expressed in prayers. It is practiced." center />
        <Stagger className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f) => (
            <motion.div key={f.l} variants={item} className="bg-paper p-8">
              <p className="font-display text-7xl font-semibold text-plum leading-none"><CountUp to={f.n} suffix={f.s} /></p>
              <p className="mt-3 font-semibold text-midnight">{f.l}</p>
              <p className="mt-2 text-sm text-slate leading-relaxed">{f.d}</p>
            </motion.div>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ Ministries mosaic */
export function MinistriesTeaser() {
  const tiles = [
    { t: 'Worship & Music', d: 'Choir, musicians and Spirit-filled praise.', photo: 'choir-1', icon: Music, span: 'lg:col-span-2 lg:row-span-2' },
    { t: 'Youth & Community Center', d: 'Tutoring, mentoring, trips and summer programs.', photo: 'youth-grads', icon: Sparkles, span: '' },
    { t: 'Outreach & Food Pantry', d: 'Groceries, clothing and neighborhood events.', photo: 'pantry-outdoor', icon: ShoppingBasket, span: '' },
    { t: 'Culinary Arts', d: 'Repasts, fellowship meals and Good Friday fish dinners.', photo: 'community-meal', icon: Utensils, span: '' },
    { t: 'Deacons on a Mission', d: 'Prayer, care and service beyond the walls.', photo: 'pastors-robes-2', icon: HandHeart, span: '' },
  ]
  return (
    <section className="relative bg-linen py-24 sm:py-32 overflow-hidden">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading eyebrow="There is a place for you" title="Serving with purpose. Growing in faith." text="Media, transportation, decorating, choir, mentoring, youth: every gift has a home at New Life." />
          <GoldButton to="/ministries" icon={<ArrowRight size={16} />}>Find your ministry</GoldButton>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[260px]">
          {tiles.map((x) => (
            <Link key={x.t} to="/ministries" className={`group relative min-h-[260px] overflow-hidden rounded-[28px] ${x.span}`}>
              <Photo name={x.photo} className="absolute inset-0" imgClassName="transition-transform duration-[1.2s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <x.icon size={22} className="text-gold-light" />
                <h3 className="mt-3 font-display text-2xl sm:text-3xl font-semibold">{x.t}</h3>
                <p className="mt-1 text-white/75 max-w-sm">{x.d}</p>
              </div>
              <span className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition-opacity touch-reveal"><ArrowRight size={18} /></span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ Gallery with lightbox */
const galleryNames = ['worship-full-2', 'praise-dance-1', 'youth-trip', 'teachers-donuts', 'street-naming-2', 'baptism', 'women-ministry', 'firefighters-2', 'community-2', 'musician-keys', 'african-attire-2', 'outreach-team', 'kids-crafts', 'wedding', 'group-outside', 'youth-violin']

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null)
  const names = useMemo(() => galleryNames, [])
  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); if (e.key === 'ArrowRight') setOpen((o) => (o === null ? o : (o + 1) % names.length)); if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? o : (o - 1 + names.length) % names.length)) }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [open, names.length])
  return (
    <section className="bg-paper py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Life at New Life" title="This is what family looks like." center />
        <div className="mt-12 columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4">
          {names.map((n, i) => (
            <button key={n} type="button" onClick={() => setOpen(i)} className="group mb-3 sm:mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl focus-visible:ring-4 focus-visible:ring-gold-bright/40" aria-label={`Open photo: ${photoAlt(n)}`}>
              <Photo name={n} className={`${i % 3 === 0 ? 'aspect-[3/4]' : i % 3 === 1 ? 'aspect-square' : 'aspect-[4/3]'} w-full`} imgClassName="transition-transform duration-700 group-hover:scale-105" />
            </button>
          ))}
        </div>
      </Container>
      <AnimatePresence>
        {open !== null && (
          <motion.div role="dialog" aria-modal="true" aria-label="Photo viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[95] bg-midnight/95 backdrop-blur flex items-center justify-center p-4" onClick={() => setOpen(null)}>
            <button type="button" className="absolute top-4 right-4 tap inline-flex items-center justify-center rounded-full text-white hover:bg-white/10" aria-label="Close" onClick={() => setOpen(null)}><X size={26} /></button>
            <button type="button" className="absolute left-2 sm:left-6 tap inline-flex items-center justify-center rounded-full text-white hover:bg-white/10" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + names.length) % names.length) }}><ChevronLeft size={30} /></button>
            <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <Photo name={names[open]} className="aspect-[4/3] w-full rounded-2xl" imgClassName="!object-contain" eager />
              <figcaption className="mt-3 text-center text-white/80">{photoAlt(names[open])}</figcaption>
            </figure>
            <button type="button" className="absolute right-2 sm:right-6 tap inline-flex items-center justify-center rounded-full text-white hover:bg-white/10" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % names.length) }}><ChevronRight size={30} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* ------------------------------------------------------------------ Watch + Give */
export function WatchGive() {
  return (
    <section className="bg-linen py-24 sm:py-32">
      <Container className="grid gap-6 lg:grid-cols-2">
        <article className="relative isolate overflow-hidden rounded-[32px] bg-midnight text-white min-h-[460px] flex flex-col justify-end p-8 sm:p-10 grain">
          <Art name="worship-light" alt="" className="absolute inset-0 -z-10 opacity-70" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-midnight via-midnight/50 to-transparent" />
          <span className="absolute top-8 left-8 inline-flex items-center gap-2 rounded-full bg-[#C2253D] px-3 py-1 text-xs font-bold tracking-wider">LIVE SUNDAYS 9:45 AM</span>
          <Eyebrow light>Watch</Eyebrow>
          <h3 className="display text-5xl mt-3">Worship with us from anywhere.</h3>
          <p className="mt-3 text-white/75 max-w-md">Services stream on Facebook. Follow New Life so you never miss a message.</p>
          <div className="mt-6 flex flex-wrap gap-3"><GoldButton to="/watch" icon={<Play size={16} />}>Watch</GoldButton><GlassButton href={church.facebook}>Follow on Facebook</GlassButton></div>
        </article>
        <article className="relative isolate overflow-hidden rounded-[32px] bg-plum text-white min-h-[460px] flex flex-col justify-end p-8 sm:p-10 grain">
          <Art name="seed-of-faith" alt="" className="absolute inset-0 -z-10 opacity-60" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-plum via-plum/60 to-transparent" />
          <Eyebrow light>Give</Eyebrow>
          <h3 className="display text-5xl mt-3">Sow into what God is doing on Decatur Street.</h3>
          <p className="mt-3 text-white/75 max-w-md">Give in under a minute, once or monthly: tithes and offerings, the food pantry, the building fund or New Life Community Center.</p>
          <div className="mt-6 flex flex-wrap gap-3"><GoldButton to="/give" icon={<Heart size={16} />}>Give online</GoldButton><GlassButton to="/give#ways">Other ways to give</GlassButton></div>
        </article>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ Visit band with map */
export function VisitBand() {
  return (
    <section className="relative isolate overflow-hidden bg-midnight text-white grain" id="visit">
      <Art name="exterior-twilight" alt="" className="absolute inset-0 -z-10 opacity-55" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight via-midnight/80 to-midnight/30" />
      <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] py-24 sm:py-32 lg:items-center">
        <div>
          <SectionHeading light eyebrow="Plan your visit" title="We saved you a seat." text="Sunday Worship begins at 9:45 AM. Ushers will greet you at the door and help you find a seat. Come as you are." />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 text-white/85">
            <li className="flex gap-3"><Clock className="text-gold-light shrink-0" size={22} /><span><b className="block text-white">Sundays 9:45 AM</b>Building open until 2 PM</span></li>
            <li className="flex gap-3"><MapPin className="text-gold-light shrink-0" size={22} /><span><b className="block text-white">{church.address}</b>{church.city}, {church.state} {church.zip}</span></li>
          </ul>
          <div className="mt-10 flex flex-wrap gap-3"><GoldButton to="/visit" size="lg" icon={<ArrowRight size={18} />}>Plan your visit</GoldButton><GlassButton href={church.directionsUrl} size="lg" icon={<Navigation size={16} />}>Directions</GlassButton></div>
        </div>
        <div className="relative rounded-[28px] overflow-hidden border border-white/15 shadow-lift aspect-[4/3] bg-midnight-2">
          <iframe title="Map to New Life Deliverance Tabernacle, 900 Decatur St, Richmond" src="https://www.google.com/maps?q=900+Decatur+St,+Richmond,+VA+23224&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full grayscale-[35%] contrast-[1.05]" />
        </div>
      </Container>
    </section>
  )
}
