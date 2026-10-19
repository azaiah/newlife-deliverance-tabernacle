import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, MapPin, Car, Users, Baby, Accessibility, Bus, Shirt, ChevronDown, Navigation, HandHeart, Music, BookOpen } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { useDemo } from '@/data/store'
import { uid } from '@/data/ids'
import { todayIso } from '@/data/dates'
import { church, weekly } from '@/config/site'
import { PageHero, Container, SectionHeading, GoldButton, GlassButton, Photo, Eyebrow } from '../ui'
import { Stagger, item } from '../motion'
import { SiteForm, F, Check } from '../forms'

const steps = [
  { icon: Car, t: 'Arrive around 9:30', d: 'Park in the lot or along Decatur Street. Look for the honorary Rev Robert A Winfree St sign; you are on the right block.' },
  { icon: Users, t: 'An usher will greet you', d: 'Our ushers are the first faces you will see. They will help you find a seat and answer any questions.' },
  { icon: Music, t: 'Spirit-filled worship', d: 'Expect heartfelt praise, the choir and musicians, prayer, the preached Word and a warm welcome for guests.' },
  { icon: HandHeart, t: 'Stay for fellowship', d: 'Meet the pastors and the church family after service. Nobody will pressure you; we are simply glad you came.' },
]

const faqs = [
  { q: 'What should I wear?', a: 'Come as you are. Some members dress up for Sunday and some come casual. What matters is that you are here.' },
  { q: 'How long is the service?', a: 'Sunday Worship begins at 9:45 AM. Plan for about two hours. The building is open until 2:00 PM for fellowship.' },
  { q: 'Is there something for my kids?', a: 'Yes. Children are welcome in worship, and the church family has a long history of junior church and youth programs. During the week, the After-School Program meets Mondays and Wednesdays.' },
  { q: 'Do I need to give?', a: 'No. Guests are never expected to give. If you want to, you can give in person or online.' },
  { q: 'Can I get a ride?', a: 'Yes. The Transportation ministry provides rides for members and neighbors. Request a ride below by Friday for Sunday pickup.' },
  { q: 'Is the building accessible?', a: 'Tell us what you need on the form below and an usher will meet you at the door and help you get settled.' },
]

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="divide-y divide-line rounded-3xl border border-line bg-paper">
      {faqs.map((f, i) => (
        <div key={f.q}>
          <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left min-h-[60px]">
            <span className="font-display text-2xl font-semibold">{f.q}</span>
            <ChevronDown size={22} className={`shrink-0 text-plum transition-transform ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="px-6 pb-6 -mt-1 text-slate leading-relaxed">{f.a}</motion.p>}
        </div>
      ))}
    </div>
  )
}

export default function Visit() {
  useDocumentMeta('Plan Your Visit | New Life Deliverance Tabernacle, Richmond VA', 'Sunday Worship at 9:45 AM at 900 Decatur St, Richmond VA 23224. What to expect, directions, parking, rides and kids at New Life Deliverance Tabernacle.')
  const { upsert, log } = useDemo()
  return (
    <>
      <PageHero eyebrow="Plan your visit" title="We saved you a seat." image="exterior-twilight" text={<>Sunday Worship begins at <b className="text-white">9:45 AM</b> at {church.address} in South Richmond. Here is everything you need for a first visit that feels like coming home.</>}>
        <GoldButton href="#plan" size="lg">Let us know you are coming</GoldButton>
        <GlassButton href={church.directionsUrl} size="lg" icon={<Navigation size={16} />}>Directions</GlassButton>
      </PageHero>

      <section className="bg-paper py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Your first Sunday" title="What to expect" />
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div key={s.t} variants={item} className="relative rounded-3xl border border-line bg-linen p-7">
                <span className="absolute right-6 top-5 font-display text-6xl text-plum/10" aria-hidden="true">{i + 1}</span>
                <s.icon size={30} className="text-gold" />
                <h3 className="mt-5 font-display text-2xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-slate leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="bg-linen py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="The week" title="More than Sunday" text="New Life is open most days of the week for worship, the Word, care and community." />
            <ul className="mt-8 divide-y divide-line rounded-3xl border border-line bg-paper">
              {weekly.map((w) => (
                <li key={w.day + w.title} className="flex gap-4 px-5 py-4">
                  <span className="w-12 shrink-0 font-caps text-xs tracking-[0.2em] text-gold pt-1">{w.short}</span>
                  <span><span className="block font-semibold text-midnight">{w.title}</span><span className="block text-sm text-slate">{w.time} · {w.where}</span></span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4 content-start">
            <div id="directions" className="scroll-mt-28 rounded-3xl overflow-hidden border border-line bg-paper">
              <div className="relative aspect-[16/10]">
                <iframe title="Map to 900 Decatur St, Richmond VA" src="https://www.google.com/maps?q=900+Decatur+St,+Richmond,+VA+23224&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full" />
              </div>
              <div className="p-6 grid gap-3">
                <p className="flex gap-3"><MapPin className="text-gold shrink-0" /><span><b>{church.address}</b><br />{church.city}, {church.state} {church.zip}</span></p>
                <p className="flex gap-3"><Car className="text-gold shrink-0" /><span>Parking is available on site and along Decatur Street. Ushers and the Security ministry watch the lot during services.</span></p>
                <GoldButton href={church.directionsUrl} icon={<Navigation size={16} />} className="justify-self-start">Open in Maps</GoldButton>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[{ i: Baby, t: 'Kids welcome', d: 'Children are welcome in worship.' }, { i: Accessibility, t: 'Accessibility', d: 'Tell us your needs; an usher will meet you.' }, { i: Shirt, t: 'Come as you are', d: 'Dress how you are comfortable.' }].map((x) => (
                <div key={x.t} className="rounded-3xl border border-line bg-paper p-5"><x.i className="text-plum" /><p className="mt-3 font-semibold">{x.t}</p><p className="text-sm text-slate mt-1">{x.d}</p></div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="relative bg-midnight text-white py-20 sm:py-28 overflow-hidden grain">
        <div className="light-leaks" />
        <Container className="relative grid gap-12 lg:grid-cols-2">
          <div id="plan" className="scroll-mt-28">
            <Eyebrow light>Plan ahead</Eyebrow>
            <h2 className="display text-5xl sm:text-6xl mt-4">Let us know you are coming.</h2>
            <p className="mt-4 text-white/75 text-lg">We will have a welcome waiting and an usher ready to greet you by name.</p>
            <div className="mt-8 rounded-3xl bg-paper text-midnight p-6 sm:p-8">
              <SiteForm name={church.formNames.visit} submitLabel="Plan my visit" success={{ title: 'We cannot wait to meet you.', text: 'An usher will be watching for you on Sunday at 9:45 AM. If anything comes up, call (804) 233-2730.' }}
                onSubmitted={(d) => { const [first, ...rest] = (d.name || 'Guest').split(' '); upsert('members', { id: uid('m'), first, last: rest.join(' ') || '(guest)', email: d.email ?? '', phone: d.phone ?? '', householdId: 'hh_web', status: 'visitor', joinedAt: '', firstVisit: d.date || todayIso(), ministryIds: [], tags: ['Planned visit (website)'], consent: { email: !!d.email, sms: false }, lastContact: '', address: '', notes: d.notes ?? '', volunteerInterests: [] }); log(d.name || 'Guest', 'Planned a visit on the website', d.date || 'Sunday') }}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <F label="Your name" name="name" required autoComplete="name" />
                  <F label="Phone" name="phone" type="tel" autoComplete="tel" />
                  <F label="Email" name="email" type="email" autoComplete="email" className="sm:col-span-2" />
                  <F label="Which Sunday?" name="date" type="date" />
                  <F label="How many are coming?" name="party" as="select" options={['Just me', '2', '3', '4', '5 or more']} />
                  <F label="Anything we should know?" name="notes" as="textarea" rows={3} className="sm:col-span-2" placeholder="Kids coming with you, accessibility needs, or a prayer request" />
                </div>
              </SiteForm>
            </div>
          </div>
          <div id="ride" className="scroll-mt-28">
            <Eyebrow light>Need a ride?</Eyebrow>
            <h2 className="display text-5xl sm:text-6xl mt-4">The van can come to you.</h2>
            <p className="mt-4 text-white/75 text-lg">The Transportation ministry offers rides to worship and church programs. Request by Friday for Sunday pickup.</p>
            <div className="mt-8 rounded-3xl bg-paper text-midnight p-6 sm:p-8">
              <SiteForm name={church.formNames.help} submitLabel="Request a ride" success={{ title: 'Your ride request is in.', text: 'The Transportation ministry will call to confirm your pickup time.' }}
                onSubmitted={(d) => { upsert('services', { id: uid('sv'), program: 'transportation', name: d.name || 'Neighbor', contact: d.phone || '', text: `Ride request: ${d.where ?? ''} for ${d.forwhat ?? 'Sunday Worship'}. ${d.notes ?? ''}`.trim(), status: 'new', date: todayIso() }); log(d.name || 'Neighbor', 'Requested a ride on the website', d.forwhat || 'Sunday Worship') }}>
                <input type="hidden" name="type" value="ride" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <F label="Your name" name="name" required autoComplete="name" />
                  <F label="Phone" name="phone" type="tel" required autoComplete="tel" />
                  <F label="Pickup address" name="where" required autoComplete="street-address" className="sm:col-span-2" />
                  <F label="Ride for" name="forwhat" as="select" options={['Sunday Worship', 'Bible Study (Tuesday)', 'After-School Program', 'Food distribution', 'Other']} className="sm:col-span-2" />
                  <F label="Notes" name="notes" as="textarea" rows={2} className="sm:col-span-2" placeholder="Wheelchair, walker, number of riders" />
                </div>
                <Check name="consent" label="The Transportation ministry may call or text me about this ride." defaultChecked />
              </SiteForm>
            </div>
            <div className="mt-8 flex items-center gap-4 text-white/70"><Bus className="text-gold-light" /><span>Transportation ministry led by Deacon Landis Mathews.</span></div>
          </div>
        </Container>
      </section>

      <section className="bg-linen py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="Questions" title="First-visit answers" />
            <Photo name="worship-full-3" className="mt-8 aspect-[4/3] rounded-3xl hidden lg:block" />
            <p className="mt-6 flex items-center gap-2 text-slate"><Clock size={16} className="text-gold" /> Office: Mon to Fri, 11 AM to 4 PM · {church.phone}</p>
            <p className="mt-2 flex items-center gap-2 text-slate"><BookOpen size={16} className="text-gold" /> Bible Study is a great second step: Tuesdays at 7 PM.</p>
          </div>
          <Faq />
        </Container>
      </section>
    </>
  )
}
