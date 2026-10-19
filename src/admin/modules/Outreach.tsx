import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShoppingBasket, GraduationCap, Bus, HandHeart, Plus, Download, Users, Scale, Baby, UserRound, Check, Clock } from 'lucide-react'
import { useDemo } from '@/data/store'
import { personName, sum } from '@/data/selectors'
import { fmtShort, fmtLong, relDays, todayIso, monthKey, monthLabel } from '@/data/dates'
import type { ServiceRequest, ServiceProgram, PantryDay, AfterSchoolDay } from '@/data/types'
import { uid } from '@/data/ids'
import { accountById } from '@/config/accounts'
import { church } from '@/config/site'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Input, Select, Textarea } from '@/components/Field'
import { Tabs } from '@/components/Tabs'
import { Modal } from '@/components/Modal'
import { BarChart } from '@/components/charts/BarChart'
import { PageHeader, Kpi, Panel } from '../layout/shared'

type Tab = 'pantry' | 'afterschool' | 'rides' | 'requests'
const programLabel: Record<ServiceProgram, string> = { food: 'Groceries', housing: 'Housing', employment: 'Jobs & training', transportation: 'Ride', senior: 'Senior & counseling', emergency: 'Emergency' }
const tone = { new: 'gold', assigned: 'royal', 'in-progress': 'neutral', fulfilled: 'success', referred: 'success' } as const
const n = (v: number) => v.toLocaleString('en-US')

function monthly<T extends { date: string }>(rows: T[], pick: (r: T) => number, months = 4) {
  const keys: string[] = []
  for (let i = months - 1; i >= 0; i--) { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i); keys.push(d.toISOString().slice(0, 7)) }
  return keys.map((k) => ({ label: monthLabel(k), value: sum(rows.filter((r) => monthKey(r.date) === k).map(pick)) }))
}

export function Outreach() {
  const { state, upsert, patch, log } = useDemo()
  useDocumentMeta('Outreach & Community Center | New Life Connect')
  const [params, setParams] = useSearchParams()
  const acct = accountById(state.accountId)
  const mine = acct?.ministryIds ?? []
  const leaderOnly = state.role === 'ministry'
  const allowed: Tab[] = leaderOnly
    ? (['pantry', 'afterschool', 'rides', 'requests'] as Tab[]).filter((t) => (t === 'pantry' || t === 'requests') ? mine.includes('min_outreach') : t === 'afterschool' ? mine.some((m) => m === 'min_youth' || m === 'min_center') : mine.includes('min_transport'))
    : ['pantry', 'afterschool', 'rides', 'requests']
  const tabs: Tab[] = allowed.length ? allowed : ['pantry']
  const tab = (tabs.includes(params.get('tab') as Tab) ? params.get('tab') : tabs[0]) as Tab
  const who = acct?.name ?? personName(state, state.currentMemberId)

  const [logging, setLogging] = useState<'pantry' | 'afterschool' | 'ride' | null>(null)
  const [closing, setClosing] = useState<ServiceRequest | null>(null)
  const [outcome, setOutcome] = useState('')

  const pantry = state.pantry
  const as = state.afterSchool
  const rides = useMemo(() => state.services.filter((s) => s.program === 'transportation').sort((a, b) => b.date.localeCompare(a.date)), [state.services])
  const requests = useMemo(() => state.services.filter((s) => s.program !== 'transportation').sort((a, b) => (a.status === 'new' ? -1 : 0) - (b.status === 'new' ? -1 : 0) || b.date.localeCompare(a.date)), [state.services])
  const ytd = (rows: { date: string }[]) => rows.filter((r) => r.date.slice(0, 4) === todayIso().slice(0, 4))
  const pYtd = ytd(pantry) as PantryDay[]
  const aYtd = ytd(as) as AfterSchoolDay[]

  function savePantry(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget); const num = (k: string) => Number(f.get(k)) || 0
    const date = String(f.get('date') || todayIso()); const day = new Date(date + 'T12:00:00').getDay() === 6 ? 'Saturday' : 'Wednesday'
    upsert('pantry', { id: uid('pd'), date, day, households: num('households'), individuals: num('individuals'), seniors: num('seniors'), children: num('children'), pounds: num('pounds'), volunteers: num('volunteers'), newHouseholds: num('newHouseholds') })
    log(who, 'Logged food distribution', `${num('households')} households, ${fmtShort(date)}`); setLogging(null)
  }
  function saveSession(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget); const students = Number(f.get('students')) || 0
    const date = String(f.get('date') || todayIso())
    upsert('afterSchool', { id: uid('as'), date, students, tutoringHours: Number(f.get('hours')) || 0, meals: Number(f.get('meals')) || 0, mentors: Number(f.get('mentors')) || 0, activity: String(f.get('activity') || 'Homework help') })
    log(who, 'Logged after-school session', `${students} students, ${fmtShort(date)}`); setLogging(null)
  }
  function saveRide(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget)
    upsert('services', { id: uid('sv'), program: 'transportation', name: String(f.get('name')), contact: String(f.get('contact') ?? ''), text: `${f.get('when')}: ${f.get('where')}`, status: 'assigned', coordinatorId: 'm_6', date: todayIso() })
    log(who, 'Scheduled a ride', String(f.get('name'))); setLogging(null)
  }
  function impactSummary() {
    const lines = [
      `${church.centerName} and ${church.name}`, `Community impact summary, ${todayIso().slice(0, 4)} year to date (prepared ${fmtLong(todayIso())})`, '',
      'FOOD DISTRIBUTION (FeedMore partner site, Wednesdays and Saturdays)',
      `Distribution days: ${pYtd.length}`, `Household visits: ${n(sum(pYtd.map((p) => p.households)))}`, `People served: ${n(sum(pYtd.map((p) => p.individuals)))} (seniors ${n(sum(pYtd.map((p) => p.seniors)))}, children ${n(sum(pYtd.map((p) => p.children)))})`, `Pounds distributed: ${n(sum(pYtd.map((p) => p.pounds)))}`, `Volunteer shifts: ${n(sum(pYtd.map((p) => p.volunteers)))}`, '',
      'AFTER-SCHOOL PROGRAM (Mondays and Wednesdays, 5 to 7 PM)',
      `Sessions: ${aYtd.length}`, `Average attendance: ${aYtd.length ? Math.round(sum(aYtd.map((a) => a.students)) / aYtd.length) : 0} students`, `Tutoring hours: ${n(sum(aYtd.map((a) => a.tutoringHours)))}`, `Meals served: ${n(sum(aYtd.map((a) => a.meals)))}`, '',
      'TRANSPORTATION AND HELP REQUESTS',
      `Rides arranged: ${rides.length}`, `Help requests received: ${requests.length}; fulfilled or referred: ${requests.filter((r) => r.status === 'fulfilled' || r.status === 'referred').length}`, '',
      'Sample data in this demo. In production these figures come from the counts logged at each program.',
    ]
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' })); a.download = `new-life-impact-${todayIso()}.txt`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    upsert('documents', { id: uid('d'), title: `Community impact summary (${fmtShort(todayIso())})`, category: 'report', updated: todayIso(), ownerId: state.currentMemberId, size: '4 KB' })
    log(who, 'Downloaded impact summary', 'Outreach')
  }

  const tabItems = [
    { id: 'pantry' as Tab, label: 'Food distribution', count: pantry.filter((p) => p.date >= todayIso().slice(0, 7) + '-01').length },
    { id: 'afterschool' as Tab, label: 'After-school' },
    { id: 'rides' as Tab, label: 'Rides', count: rides.filter((r) => r.status !== 'fulfilled').length },
    { id: 'requests' as Tab, label: 'Help requests', count: requests.filter((r) => r.status === 'new').length },
  ].filter((t) => tabs.includes(t.id))

  return (
    <>
      <PageHeader eyebrow="Outreach & Community Center" title="Serving South Richmond, measured." text="FeedMore distributions, after-school, rides and help requests in one place. Every count logged here flows into grant narratives and the impact report." actions={<><Button variant="outline" icon={<Download size={16} />} onClick={impactSummary}>Impact summary</Button>{tab !== 'requests' && <Button icon={<Plus size={16} />} onClick={() => setLogging(tab === 'pantry' ? 'pantry' : tab === 'afterschool' ? 'afterschool' : 'ride')}>{tab === 'pantry' ? 'Log a distribution' : tab === 'afterschool' ? 'Log a session' : 'Schedule a ride'}</Button>}</>} />
      {leaderOnly && <p className="mb-4 text-sm text-slate">Signed in as {acct?.name}. You see the programs your ministry runs.</p>}
      <Tabs value={tab} onChange={(t) => setParams({ tab: t })} items={tabItems} />

      {tab === 'pantry' && (
        <div className="mt-5 grid gap-4">
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <Kpi label="Household visits this year" value={n(sum(pYtd.map((p) => p.households)))} icon={ShoppingBasket} tone="midnight" />
            <Kpi label="People served" value={n(sum(pYtd.map((p) => p.individuals)))} sub={`${n(sum(pYtd.map((p) => p.children)))} children · ${n(sum(pYtd.map((p) => p.seniors)))} seniors`} icon={Users} />
            <Kpi label="Pounds distributed" value={n(sum(pYtd.map((p) => p.pounds)))} icon={Scale} />
            <Kpi label="New households" value={n(sum(pYtd.map((p) => p.newHouseholds)))} sub="First visit this year" tone="gold" />
          </div>
          <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
            <Panel title="Households by month" subtitle="Wednesdays and Saturdays combined"><BarChart data={monthly(pantry, (p) => p.households)} height={150} color="#4B2A7B" /></Panel>
            <Panel title="Recent distribution days">
              <div className="overflow-x-auto -mx-1"><table className="w-full text-sm min-w-[520px]"><thead><tr className="text-left text-xs text-slate"><th className="py-2 px-1 font-medium">Date</th><th className="px-1 font-medium">Households</th><th className="px-1 font-medium">People</th><th className="px-1 font-medium">Pounds</th><th className="px-1 font-medium">Volunteers</th></tr></thead>
                <tbody>{[...pantry].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10).map((p) => <tr key={p.id} className="border-t border-line"><td className="py-2 px-1">{p.day.slice(0, 3)} {fmtShort(p.date)}</td><td className="px-1 font-semibold">{p.households}</td><td className="px-1">{p.individuals}</td><td className="px-1">{n(p.pounds)}</td><td className="px-1">{p.volunteers}</td></tr>)}</tbody></table></div>
            </Panel>
          </div>
        </div>
      )}

      {tab === 'afterschool' && (
        <div className="mt-5 grid gap-4">
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <Kpi label="Sessions this year" value={aYtd.length} icon={GraduationCap} tone="midnight" />
            <Kpi label="Average attendance" value={aYtd.length ? Math.round(sum(aYtd.map((a) => a.students)) / aYtd.length) : 0} sub="students per session" icon={Baby} />
            <Kpi label="Tutoring hours" value={n(sum(aYtd.map((a) => a.tutoringHours)))} icon={Clock} />
            <Kpi label="Meals served" value={n(sum(aYtd.map((a) => a.meals)))} sub="Reimbursable with CACFP" tone="gold" />
          </div>
          <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
            <Panel title="Tutoring hours by month"><BarChart data={monthly(as, (a) => a.tutoringHours)} height={150} color="#C9A24B" /></Panel>
            <Panel title="Recent sessions">
              <ul className="divide-y divide-line">{[...as].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8).map((a) => <li key={a.id} className="py-2.5 flex flex-wrap items-center justify-between gap-2 text-sm"><span><span className="font-semibold">{fmtShort(a.date)}</span> · {a.activity}</span><span className="text-slate">{a.students} students · {a.tutoringHours} hrs · {a.mentors} mentors</span></li>)}</ul>
            </Panel>
          </div>
        </div>
      )}

      {tab === 'rides' && (
        <Panel className="mt-5" title="Ride requests" subtitle="From the website’s Plan a Visit page and phone calls. Every ride logged strengthens the Section 5310 van application.">
          {rides.length === 0 && <p className="text-sm text-slate">No ride requests yet.</p>}
          <ul className="divide-y divide-line">{rides.map((r) => (
            <li key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0"><p className="font-semibold flex items-center gap-2"><Bus size={16} className="text-gold" /> {r.name} <Badge tone={tone[r.status]}>{r.status}</Badge></p><p className="text-sm text-slate mt-0.5">{r.text}</p><p className="text-xs text-slate mt-0.5">{relDays(r.date)}{r.coordinatorId ? ` · Driver lead: ${personName(state, r.coordinatorId)}` : ''}</p></div>
              <div className="flex gap-2 shrink-0">
                {r.status === 'new' && <Button size="sm" variant="outline" onClick={() => { patch('services', r.id, { status: 'assigned', coordinatorId: 'm_6' }); log(who, 'Assigned ride', r.name) }}>Assign driver</Button>}
                {r.status !== 'fulfilled' && <Button size="sm" icon={<Check size={14} />} onClick={() => { patch('services', r.id, { status: 'fulfilled', outcome: 'Ride completed' }); log(who, 'Completed ride', r.name) }}>Completed</Button>}
              </div>
            </li>
          ))}</ul>
        </Panel>
      )}

      {tab === 'requests' && (
        <Panel className="mt-5" title="Help requests" subtitle="From the Community Center’s Get Help form. Names are visible only to the outreach team; reports show totals.">
          {requests.length === 0 && <p className="text-sm text-slate">No requests yet.</p>}
          <ul className="divide-y divide-line">{requests.map((r) => (
            <li key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold flex flex-wrap items-center gap-2"><HandHeart size={16} className="text-gold" /> {r.name} <Badge tone="royal">{programLabel[r.program]}</Badge><Badge tone={tone[r.status]}>{r.status}</Badge></p>
                <p className="text-sm mt-1">{r.text}</p>
                <p className="text-xs text-slate mt-1">{relDays(r.date)}{r.householdSize ? ` · household of ${r.householdSize}` : ''}{r.contact ? ` · ${r.contact}` : ''}{r.coordinatorId ? ` · ${personName(state, r.coordinatorId)}` : ''}{r.outcome ? ` · Outcome: ${r.outcome}` : ''}</p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                {r.status === 'new' && <Button size="sm" variant="outline" icon={<UserRound size={14} />} onClick={() => { patch('services', r.id, { status: 'assigned', coordinatorId: 'm_7' }); log(who, 'Took help request', r.name) }}>Take it</Button>}
                {r.status !== 'fulfilled' && r.status !== 'referred' && <Button size="sm" onClick={() => { setClosing(r); setOutcome('') }}>Close with outcome</Button>}
              </div>
            </li>
          ))}</ul>
        </Panel>
      )}

      <Modal open={logging === 'pantry'} onClose={() => setLogging(null)} title="Log a food distribution">
        <form id="pantry-form" onSubmit={savePantry} className="grid gap-3 sm:grid-cols-2">
          <Input name="date" type="date" label="Date" defaultValue={todayIso()} required className="sm:col-span-2" />
          <Input name="households" type="number" min={0} label="Households" required />
          <Input name="individuals" type="number" min={0} label="People" required />
          <Input name="seniors" type="number" min={0} label="Seniors (60+)" />
          <Input name="children" type="number" min={0} label="Children (under 18)" />
          <Input name="pounds" type="number" min={0} label="Pounds distributed" />
          <Input name="volunteers" type="number" min={0} label="Volunteers" />
          <Input name="newHouseholds" type="number" min={0} label="New households" className="sm:col-span-2" />
          <div className="sm:col-span-2 flex justify-end gap-2"><Button variant="ghost" onClick={() => setLogging(null)}>Cancel</Button><Button type="submit">Save</Button></div>
        </form>
      </Modal>
      <Modal open={logging === 'afterschool'} onClose={() => setLogging(null)} title="Log an after-school session">
        <form onSubmit={saveSession} className="grid gap-3 sm:grid-cols-2">
          <Input name="date" type="date" label="Date" defaultValue={todayIso()} required />
          <Input name="students" type="number" min={0} label="Students" required />
          <Input name="hours" type="number" min={0} step="0.5" label="Tutoring hours" />
          <Input name="meals" type="number" min={0} label="Meals or snacks served" />
          <Input name="mentors" type="number" min={0} label="Tutors and mentors" />
          <Select name="activity" label="Main activity" defaultValue="Homework help">{['Homework help', 'Reading circle', 'Math lab', 'STEM project', 'Art class', 'Financial literacy', 'Mentoring circle', 'Fitness'].map((a) => <option key={a}>{a}</option>)}</Select>
          <div className="sm:col-span-2 flex justify-end gap-2"><Button variant="ghost" onClick={() => setLogging(null)}>Cancel</Button><Button type="submit">Save</Button></div>
        </form>
      </Modal>
      <Modal open={logging === 'ride'} onClose={() => setLogging(null)} title="Schedule a ride">
        <form onSubmit={saveRide} className="grid gap-3">
          <Input name="name" label="Rider" required />
          <Input name="contact" label="Phone" type="tel" />
          <Input name="when" label="When" placeholder="Sunday 9:15 AM pickup" required />
          <Textarea name="where" label="Pickup address and notes" required />
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setLogging(null)}>Cancel</Button><Button type="submit">Schedule</Button></div>
        </form>
      </Modal>
      <Modal open={!!closing} onClose={() => setClosing(null)} title={`Close request: ${closing?.name ?? ''}`}>
        <div className="grid gap-3">
          <Textarea label="Outcome" value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder="Groceries provided; referred to RBHA for counseling" />
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => { if (closing) { patch('services', closing.id, { status: 'referred', outcome: outcome || 'Referred to a partner' }); log(who, 'Referred request', closing.name) } setClosing(null) }}>Referred</Button>
            <Button onClick={() => { if (closing) { patch('services', closing.id, { status: 'fulfilled', outcome: outcome || 'Fulfilled' }); log(who, 'Fulfilled request', closing.name) } setClosing(null) }}>Fulfilled</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
