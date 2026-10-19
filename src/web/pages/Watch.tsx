import { motion } from 'framer-motion'
import { Radio, Facebook, CalendarClock, MessageCircleHeart, ArrowRight } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { church } from '@/config/site'
import { PageHero, Container, SectionHeading, GoldButton, GlassButton, OutlineButton, Photo, Eyebrow } from '../ui'
import { Stagger, item } from '../motion'

/** Minutes until the next Sunday 9:45 AM (Richmond time is assumed to match the visitor's clock). */
function nextSunday() {
  const now = new Date(); const d = new Date(now); d.setHours(9, 45, 0, 0)
  const add = (7 - now.getDay()) % 7; d.setDate(now.getDate() + add)
  if (d.getTime() + 2 * 3600e3 < now.getTime()) d.setDate(d.getDate() + 7)
  const live = now >= d && now.getTime() < d.getTime() + 2 * 3600e3
  return { d, live }
}

export default function Watch() {
  useDocumentMeta('Watch Live | New Life Deliverance Tabernacle', 'Worship with New Life Deliverance Tabernacle live on Facebook every Sunday at 9:45 AM, from 900 Decatur St in South Richmond.')
  const { d, live } = nextSunday()
  return (
    <>
      <PageHero eyebrow="Watch" title="Worship with us from wherever you are." image="worship-light" text="Sunday worship streams on the church’s Facebook page. Join live at 9:45 AM, or watch later.">
        <GoldButton href={church.facebook} icon={<Facebook size={16} />} size="lg">Open on Facebook</GoldButton>
        <GlassButton to="/visit" size="lg">Visit in person</GlassButton>
      </PageHero>

      <section className="bg-linen py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <a href={church.facebook} target="_blank" rel="noreferrer" className="group relative block overflow-hidden rounded-[32px] shadow-lift aspect-video bg-midnight" aria-label="Watch New Life worship on Facebook (opens in a new tab)">
            <Photo name="worship-full-2" className="absolute inset-0 opacity-70" imgClassName="transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/30 to-transparent" />
            <div className="absolute inset-0 grid place-items-center">
              <motion.span className="grid h-24 w-24 place-items-center rounded-full bg-gold-bright text-midnight glow-gold" whileHover={{ scale: 1.08 }}>
                <svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
              </motion.span>
            </div>
            <div className="absolute left-5 bottom-5 right-5 flex flex-wrap items-center gap-3 text-white">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold tracking-wider ${live ? 'bg-red-600' : 'bg-white/15 backdrop-blur'}`}><Radio size={14} /> {live ? 'LIVE NOW' : 'NEXT STREAM'}</span>
              <span className="text-sm text-white/85">{d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at 9:45 AM</span>
            </div>
          </a>
          <div>
            <SectionHeading eyebrow="How to watch" title="Three easy ways." />
            <Stagger className="mt-8 grid gap-4">
              {[
                { i: Facebook, t: 'Follow the page', d: 'Follow New Life on Facebook and turn on notifications so you know the moment worship goes live.' },
                { i: CalendarClock, t: 'Set a reminder', d: 'Sundays at 9:45 AM Eastern. Services usually run about two hours.' },
                { i: MessageCircleHeart, t: 'Say hello in the comments', d: 'Tell us you are watching and where from. Share a prayer request and we will pray with you.' },
              ].map((s) => (
                <motion.div variants={item} key={s.t} className="flex gap-4 rounded-3xl border border-line bg-paper p-5">
                  <s.i className="text-gold shrink-0" size={24} />
                  <div><h3 className="font-semibold text-lg">{s.t}</h3><p className="text-slate text-sm leading-relaxed mt-1">{s.d}</p></div>
                </motion.div>
              ))}
            </Stagger>
          </div>
        </Container>
      </section>

      <section className="relative isolate overflow-hidden bg-midnight text-white py-20 sm:py-24 grain">
        <Container className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <Eyebrow light>Watching from home?</Eyebrow>
            <h2 className="display text-4xl sm:text-5xl mt-3 max-w-3xl">You are part of this family too. Let us pray with you and stay in touch.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <GoldButton to="/prayer" icon={<ArrowRight size={16} />}>Send a prayer request</GoldButton>
            <OutlineButton to="/give" className="!border-white/30 !text-white hover:!bg-white hover:!text-plum">Give online</OutlineButton>
          </div>
        </Container>
      </section>
    </>
  )
}
