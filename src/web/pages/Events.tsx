import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarPlus, Clock, MapPin, X, Users, CheckCircle2 } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { useDemo } from '@/data/store'
import { uid } from '@/data/ids'
import { todayIso } from '@/data/dates'
import type { ChurchEvent } from '@/data/types'
import { church, weekly } from '@/config/site'
import { PageHero, Container, SectionHeading } from '../ui'
import { Stagger, item } from '../motion'
import { postNetlify } from '../forms'

const fmt = (iso: string) => new Date(iso + 'T12:00:00')
const time12 = (t: string) => { const [h, m] = t.split(':').map(Number); const ap = h >= 12 ? 'PM' : 'AM'; return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${ap}` }

function ics(e: ChurchEvent) {
  const d = e.date.replace(/-/g, '')
  const s = e.start.replace(':', '') + '00'; const en = e.end.replace(':', '') + '00'
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//New Life Deliverance Tabernacle//Events//EN', 'BEGIN:VEVENT', `UID:${e.id}@newlife`, `DTSTAMP:${d}T000000`, `DTSTART:${d}T${s}`, `DTEND:${d}T${en}`, `SUMMARY:${e.title}`, `LOCATION:${church.address}, ${church.city}, ${church.state} ${church.zip}`, `DESCRIPTION:${e.description.replace(/\n/g, ' ')}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' })); a.download = `${e.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

export default function Events() {
  useDocumentMeta('Events | New Life Deliverance Tabernacle, Richmond VA', 'Worship, Bible study, food distribution, after-school, Community Conversations and special events at New Life Deliverance Tabernacle, 900 Decatur St, Richmond.')
  const { state, upsert, log } = useDemo()
  const [sel, setSel] = useState<ChurchEvent | null>(null)
  const [done, setDone] = useState(false)
  const upcoming = useMemo(() => state.events.filter((e) => e.isPublic && e.date >= todayIso() && e.stage !== 'proposed').sort((a, b) => a.date.localeCompare(b.date)), [state.events])
  async function register(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!sel) return
    const fd = new FormData(e.currentTarget); const name = String(fd.get('name') ?? ''); const email = String(fd.get('email') ?? ''); const qty = Number(fd.get('qty') ?? 1)
    await postNetlify(church.formNames.contact, { name, email, message: `Registration: ${sel.title} on ${sel.date} (${qty})` })
    upsert('registrations', { id: uid('rg'), eventId: sel.id, name, email, qty, date: todayIso() }); log(name || 'Website visitor', 'Registered on the website', sel.title); setDone(true)
  }
  return (
    <>
      <PageHero eyebrow="Events" title="Something for every day of the week." image="radiance-wide" text="Join us for worship, the Word, fellowship and service. Everyone is welcome." />
      <section className="bg-linen py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Coming up" title="Special events" />
          {upcoming.length === 0 && <p className="mt-8 text-slate">New events are posted regularly. Check back soon.</p>}
          <Stagger className="mt-10 grid gap-4">
            {upcoming.map((e) => {
              const d = fmt(e.date)
              return (
                <motion.button variants={item} key={e.id} type="button" onClick={() => { setSel(e); setDone(false) }} className="group grid w-full grid-cols-[84px_1fr] sm:grid-cols-[110px_1fr_auto] items-center gap-5 rounded-[28px] border border-line bg-paper p-4 sm:p-5 text-left shadow-card hover:shadow-lift hover:border-plum/30 transition">
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-midnight text-white py-3">
                    <span className="font-caps text-[11px] tracking-[0.2em] text-gold-light">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="font-display text-4xl leading-none mt-1">{d.getDate()}</span>
                    <span className="text-[11px] text-white/60 mt-1">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold leading-tight group-hover:text-plum">{e.title}</h3>
                    <p className="mt-1 text-sm text-slate flex flex-wrap gap-x-4 gap-y-1"><span className="inline-flex items-center gap-1"><Clock size={14} /> {time12(e.start)} to {time12(e.end)}</span><span className="inline-flex items-center gap-1"><MapPin size={14} /> {state.rooms.find((r) => r.id === e.roomId)?.name}</span></p>
                    <p className="mt-2 text-slate line-clamp-2">{e.description}</p>
                  </div>
                  <span className="hidden sm:inline-flex rounded-full bg-gold-50 border border-gold-bright/40 px-4 py-2 text-sm font-semibold text-gold">{e.registrationOpen ? 'Register' : 'Details'}</span>
                </motion.button>
              )
            })}
          </Stagger>
        </Container>
      </section>
      <section className="bg-paper py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Every week" title="Our weekly rhythm" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {weekly.map((w) => (
              <div key={w.day + w.title} className="rounded-3xl border border-line bg-linen p-6">
                <p className="font-caps text-xs tracking-[0.22em] text-gold">{w.day}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold">{w.title}</h3>
                <p className="text-plum font-semibold text-sm mt-1">{w.time}</p>
                <p className="mt-2 text-slate text-sm leading-relaxed">{w.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <AnimatePresence>
        {sel && (
          <motion.div className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center bg-midnight/60 backdrop-blur-sm p-0 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSel(null)}>
            <motion.div role="dialog" aria-modal="true" aria-label={sel.title} initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onClick={(e) => e.stopPropagation()} className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] bg-paper p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4"><div><p className="font-caps text-xs tracking-[0.22em] text-gold">{fmt(sel.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p><h2 className="font-display text-3xl font-semibold mt-1">{sel.title}</h2></div><button type="button" onClick={() => setSel(null)} className="tap inline-flex items-center justify-center rounded-full hover:bg-midnight/5" aria-label="Close"><X size={22} /></button></div>
              <p className="mt-3 text-slate leading-relaxed">{sel.description}</p>
              <p className="mt-4 text-sm flex flex-wrap gap-4"><span className="inline-flex items-center gap-1.5"><Clock size={15} className="text-gold" /> {time12(sel.start)} to {time12(sel.end)}</span><span className="inline-flex items-center gap-1.5"><MapPin size={15} className="text-gold" /> {church.street}</span></p>
              <button type="button" onClick={() => ics(sel)} className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-plum/20 px-5 min-h-[44px] font-semibold text-plum hover:bg-plum hover:text-white"><CalendarPlus size={16} /> Add to calendar</button>
              {sel.registrationOpen && (done ? (
                <div className="mt-6 rounded-2xl bg-gold-50 p-5 text-center" role="status"><CheckCircle2 className="mx-auto text-gold" size={36} /><p className="mt-2 font-display text-2xl">You are registered.</p></div>
              ) : (
                <form onSubmit={register} className="mt-6 grid gap-3 border-t border-line pt-6">
                  <p className="font-semibold flex items-center gap-2"><Users size={16} /> Save your seat</p>
                  <input name="name" required placeholder="Your name" aria-label="Your name" autoComplete="name" className="rounded-2xl border border-line px-4 min-h-[52px]" />
                  <input name="email" type="email" required placeholder="Email" aria-label="Email" autoComplete="email" className="rounded-2xl border border-line px-4 min-h-[52px]" />
                  <select name="qty" aria-label="Number of people" className="rounded-2xl border border-line px-4 min-h-[52px]" defaultValue="1">{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>)}</select>
                  <button type="submit" className="rounded-full bg-plum text-white font-semibold min-h-[52px] hover:bg-plum-2">Register</button>
                </form>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
