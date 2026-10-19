import { motion } from 'framer-motion'
import { Droplets, Gem, Baby, Flower2, HandHeart, Building2 } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { useDemo } from '@/data/store'
import { uid } from '@/data/ids'
import { todayIso } from '@/data/dates'
import { church } from '@/config/site'
import { PageHero, Container, SectionHeading, Photo } from '../ui'
import { Stagger, item } from '../motion'
import { SiteForm, F, Check } from '../forms'

const moments = [
  { icon: Droplets, t: 'Baptism', d: 'Take the step of faith. Pastors meet with you beforehand to talk through what baptism means.', photo: 'baptism' },
  { icon: Gem, t: 'Weddings', d: 'Celebrate your covenant in the sanctuary, with pre-marital counseling from the pastors.', photo: 'wedding' },
  { icon: Baby, t: 'Baby dedications', d: 'Dedicate your child to the Lord with your church family standing with you.', photo: 'altar-flowers' },
  { icon: Flower2, t: 'Homegoing services', d: 'The Bereavement Ministry walks with families through planning, the repast and the weeks after.', photo: 'sanctuary-2' },
  { icon: HandHeart, t: 'Membership', d: 'Ready to call New Life home? Start with a conversation with a pastor after Sunday worship.', photo: 'congregation-praise' },
  { icon: Building2, t: 'Facility use', d: 'The sanctuary, fellowship hall and kitchen are available for community events by request.', photo: 'banquet' },
]

export default function LifeEvents() {
  useDocumentMeta('Baptisms, Weddings, Dedications & Homegoing Services | New Life Deliverance Tabernacle', 'Request a baptism, wedding, baby dedication, homegoing service or facility use at New Life Deliverance Tabernacle, 900 Decatur St, Richmond VA.')
  const { upsert, log } = useDemo()
  return (
    <>
      <PageHero eyebrow="Life events" title="For the moments that matter most." image="sanctuary-morning" text="From the first step of faith to the final farewell, your church family is here." />
      <section className="bg-linen py-20 sm:py-28">
        <Container>
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {moments.map((m) => (
              <motion.article variants={item} key={m.t} className="group overflow-hidden rounded-[28px] border border-line bg-paper shadow-card">
                <Photo name={m.photo} className="aspect-[4/3]" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                <div className="p-6"><m.icon className="text-gold" size={24} /><h3 className="mt-3 font-display text-3xl font-semibold">{m.t}</h3><p className="mt-2 text-slate leading-relaxed">{m.d}</p></div>
              </motion.article>
            ))}
          </Stagger>
        </Container>
      </section>
      <section id="request" className="bg-paper py-20 sm:py-28 scroll-mt-20">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Make a request" title="Tell us what you are planning." text={<>The church office will follow up within two business days. Need help sooner? Call <a href={church.phoneHref} className="font-semibold text-plum underline">{church.phone}</a>.</>} />
          <div className="rounded-[32px] bg-linen border border-line p-6 sm:p-9">
            <SiteForm name={church.formNames.contact} submitLabel="Send request" success={{ title: 'Request received.', text: 'The church office will be in touch within two business days.' }}
              onSubmitted={(d) => {
                if (d.kind === 'Facility use') upsert('reservations', { id: uid('rs'), roomId: 'r_hall', requester: d.name, date: d.date || todayIso(), start: '12:00', end: '16:00', status: 'requested', purpose: d.details || 'Facility request', external: true })
                else upsert('tasks', { id: uid('t'), title: `${d.kind}: follow up with ${d.name}${d.date ? ` (${d.date})` : ''}`, assigneeId: 'm_3', due: todayIso(), status: 'todo', module: 'office', priority: d.kind === 'Homegoing service' ? 'high' : 'normal' })
                log(d.name || 'Website visitor', 'Requested a life event', d.kind || 'Request')
              }}>
              <input type="hidden" name="subject" value="Life event request" />
              <div className="grid gap-4 sm:grid-cols-2">
                <F label="What are you requesting?" name="kind" as="select" required options={['Baptism', 'Wedding', 'Baby dedication', 'Homegoing service', 'Membership', 'Facility use']} className="sm:col-span-2" />
                <F label="Your name" name="name" required autoComplete="name" />
                <F label="Phone" name="phone" type="tel" required autoComplete="tel" />
                <F label="Email" name="email" type="email" autoComplete="email" />
                <F label="Preferred date" name="date" type="date" />
                <F label="Details" name="details" as="textarea" rows={4} className="sm:col-span-2" />
              </div>
              <Check name="consent" label="The church office may contact me about this request." defaultChecked />
            </SiteForm>
          </div>
        </Container>
      </section>
    </>
  )
}
