import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, Clock, X } from 'lucide-react'
import { useDemo } from '@/data/store'
import { registrationsFor, roomById, upcomingEvents } from '@/data/selectors'
import { fmtLong, fmtTime } from '@/data/dates'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button, LinkButton } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { useMe, PageTitle } from './shared'

export function PortalEvents() {
  const { state, remove, log } = useDemo()
  const me = useMe()
  useDocumentMeta(`My events | ${state.church.name}`)
  const mine = state.registrations.filter((r) => r.memberId === me.id)
  const upcoming = upcomingEvents(state).filter((e) => mine.some((r) => r.eventId === e.id))
  const suggestions = upcomingEvents(state, true).filter((e) => e.registrationOpen && !mine.some((r) => r.eventId === e.id)).slice(0, 3)
  return (
    <>
      <PageTitle title="My events" text="Everything you have registered for, plus a few you might like." action={<LinkButton to="/events" variant="outline" icon={<CalendarDays size={16} />}>Browse all events</LinkButton>} />
      <section className="grid gap-3">
        {upcoming.map((e) => {
          const reg = mine.find((r) => r.eventId === e.id)!
          const seats = registrationsFor(state, e.id).reduce((s, r) => s + r.qty, 0)
          return (
            <article key={e.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-midnight text-white flex flex-col items-center justify-center shrink-0"><span className="font-mono text-[10px] uppercase">{fmtLong(e.date).split(',')[1]?.trim().split(' ')[0]?.slice(0, 3)}</span><span className="font-display text-xl font-semibold leading-none">{e.date.slice(8, 10)}</span></div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-lg">{e.title}</h2>
                <p className="text-sm text-slate flex flex-wrap gap-x-4 gap-y-1 mt-1"><span className="inline-flex items-center gap-1"><Clock size={14} /> {fmtTime(e.start)}</span><span className="inline-flex items-center gap-1"><MapPin size={14} /> {roomById(state, e.roomId)?.name}</span><span>{seats} of {e.capacity} seats reserved</span></p>
              </div>
              <div className="flex items-center gap-2 shrink-0"><Badge tone="gold">{reg.qty} {reg.qty === 1 ? 'seat' : 'seats'}</Badge><Button variant="ghost" size="sm" icon={<X size={14} />} onClick={() => { remove('registrations', reg.id); log(`${me.first} ${me.last}`, 'Cancelled registration', e.title) }}>Cancel</Button></div>
            </article>
          )
        })}
        {upcoming.length === 0 && <p className="card p-6 text-slate">You have no upcoming registrations.</p>}
      </section>
      {suggestions.length > 0 && (
        <section className="mt-10">
          <h2 className="font-semibold">You might like</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {suggestions.map((e) => <Link key={e.id} to={`/events`} className="card p-4 hover:border-slate"><p className="stamp">{fmtLong(e.date)}</p><p className="font-semibold mt-1">{e.title}</p><p className="text-sm text-slate mt-1 line-clamp-2">{e.description}</p></Link>)}
          </div>
        </section>
      )}
    </>
  )
}
