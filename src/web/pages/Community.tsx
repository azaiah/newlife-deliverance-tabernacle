import { motion } from 'framer-motion'
import { ShoppingBasket, GraduationCap, MessagesSquare, HeartHandshake, Bus, Home as HomeIcon, Wrench, Compass, ShieldCheck, Sun, ArrowRight, School, Building2, Flame, Siren, Landmark, Utensils } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { useDemo } from '@/data/store'
import { uid } from '@/data/ids'
import { todayIso } from '@/data/dates'
import type { ServiceProgram } from '@/data/types'
import { church } from '@/config/site'
import { PageHero, Container, SectionHeading, Eyebrow, Photo, Art, GoldButton, GlassButton, RoyalButton } from '../ui'
import { Stagger, item } from '../motion'
import { SiteForm, F, Check } from '../forms'

const programs = [
  { icon: ShoppingBasket, t: 'FeedMore food distribution', when: 'Wed 1 to 3 PM · Sat 11 AM to 1 PM', d: 'Free groceries for neighbors in Blackwell, Southside and Mosby. No eligibility requirement, no paperwork to get started.', photo: 'pantry-outdoor' },
  { icon: GraduationCap, t: 'After-School Program', when: 'Mon & Wed 5 to 7 PM', d: 'Homework help, tutoring and mentorship in a safe, encouraging place focused on academic success and personal growth.', photo: 'youth-class' },
  { icon: MessagesSquare, t: 'Community Conversations', when: '2nd & 4th Tuesdays 5:45 PM', d: 'Neighbors, business owners and leaders talk honestly about community concerns and build solutions together, including violence prevention.', photo: 'community-conversations-stage' },
  { icon: HeartHandshake, t: 'Counseling & grief support', when: 'Tuesdays 5 to 7 PM', d: 'Spiritual guidance, family and marriage support, grief and loss wrap-around care and one-on-one trauma support.', photo: 'bible-hands' },
  { icon: Bus, t: 'Transportation', when: 'Sundays and programs', d: 'Rides for members and neighbors with transportation needs, including seniors and students.', photo: 'group-outside' },
  { icon: HomeIcon, t: 'Housing stability', when: 'As space allows', d: 'A separate church home where people facing housing instability can have a secure place to regain independence.', photo: 'exterior' },
  { icon: Compass, t: 'Youth trips & mentoring', when: 'Throughout the year', d: 'Educational and recreational trips for exposure and new experiences, and an ongoing men’s mentoring program.', photo: 'youth-trip' },
  { icon: Wrench, t: 'Workforce training', when: 'Cohorts', d: 'Apprenticeship-style programs such as cable wiring, with graduations celebrated by the whole church.', photo: 'youth-workshop' },
  { icon: ShieldCheck, t: 'Prevention education', when: 'Workshops', d: 'Sessions like “Fentanyl: Know the Facts” with community and health partners.', photo: 'fentanyl-talk' },
  { icon: Sun, t: 'Summer programs', when: 'Summer', d: 'Summer learning for elementary-age children and preparation for students moving up a grade.', photo: 'kids-crafts' },
]

const partners = [
  { icon: Utensils, n: 'FeedMore' }, { icon: School, n: 'Richmond Public Schools' }, { icon: Building2, n: 'Richmond Behavioral Health Authority' },
  { icon: Landmark, n: 'City of Richmond' }, { icon: Siren, n: 'Richmond Police Department' }, { icon: Flame, n: 'Richmond Fire Department' },
]

const needToProgram: Record<string, ServiceProgram> = { Groceries: 'food', 'Housing help': 'housing', 'Job or training': 'employment', 'A ride': 'transportation', 'Senior support': 'senior', 'Emergency (fire, loss, crisis)': 'emergency', 'Clothing': 'emergency', Counseling: 'senior' }

export default function Community() {
  useDocumentMeta('New Life Community Center | Food, After-School and Community Programs in South Richmond', 'Free FeedMore groceries Wednesdays and Saturdays, after-school tutoring Mondays and Wednesdays, counseling, transportation and Community Conversations at 900 Decatur St, Richmond VA.')
  const { upsert, log } = useDemo()
  return (
    <>
      <PageHero eyebrow="New Life Community Center" title="Connecting families to programs, resources and support." image="youth-study" text={<>{church.centerMission} <span className="block mt-3 text-base text-white/60">A 501(c)(3) nonprofit, EIN {church.centerEin}.</span></>}>
        <GoldButton href="#help" size="lg">Get help</GoldButton>
        <GlassButton href="#support" size="lg">Support the Center</GlassButton>
      </PageHero>

      <section className="bg-linen py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Programs" title="Faith expressed in action, every week." text="A three-part approach the church has practiced for decades: education, information and spiritualization." />
          <Stagger className="mt-12 grid gap-5 md:grid-cols-2">
            {programs.map((p, i) => (
              <motion.article key={p.t} variants={item} className={`group grid overflow-hidden rounded-[28px] border border-line bg-paper shadow-card sm:grid-cols-[200px_1fr] ${i === 0 ? 'md:col-span-2 sm:grid-cols-[320px_1fr]' : ''}`}>
                <Photo name={p.photo} className={`${i === 0 ? 'aspect-[16/10] sm:aspect-auto' : 'aspect-[16/9] sm:aspect-auto'} sm:min-h-full`} imgClassName="transition-transform duration-700 group-hover:scale-105" />
                <div className="p-6 sm:p-7">
                  <p.icon size={26} className="text-gold" />
                  <h3 className="mt-3 font-display text-[1.8rem] font-semibold leading-tight">{p.t}</h3>
                  <p className="mt-1 text-sm font-semibold text-plum">{p.when}</p>
                  <p className="mt-3 text-slate leading-relaxed">{p.d}</p>
                </div>
              </motion.article>
            ))}
          </Stagger>
        </Container>
      </section>

      <section id="help" className="relative isolate overflow-hidden bg-midnight text-white py-20 sm:py-28 scroll-mt-20 grain">
        <Art name="pantry-abundance" alt="" className="absolute inset-0 -z-10 opacity-25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-midnight via-midnight/90 to-plum/70" />
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow light>Get help</Eyebrow>
            <h2 className="display text-5xl sm:text-6xl mt-4">Tell us what you need. We will follow up.</h2>
            <p className="mt-5 text-lg text-white/75 leading-relaxed">For groceries, just come to a distribution: Wednesdays 1 to 3 PM or Saturdays 11 AM to 1 PM at {church.street}. For anything else, send this form or call {church.phone}.</p>
            <ul className="mt-8 space-y-3 text-white/80">
              <li className="flex gap-3"><ShoppingBasket className="text-gold-light shrink-0" /> No eligibility requirement for groceries.</li>
              <li className="flex gap-3"><ShieldCheck className="text-gold-light shrink-0" /> Requests are confidential and handled with dignity.</li>
              <li className="flex gap-3"><HeartHandshake className="text-gold-light shrink-0" /> In crisis? Call or text 988 any time. In an emergency, call 911.</li>
            </ul>
          </div>
          <div className="rounded-[28px] bg-paper text-midnight p-6 sm:p-8">
            <SiteForm name={church.formNames.help} submitLabel="Send my request" success={{ title: 'We received your request.', text: 'Someone from the outreach team will contact you within two business days. For groceries, come Wednesday or Saturday.' }}
              onSubmitted={(d) => { upsert('services', { id: uid('sv'), program: needToProgram[d.need] ?? 'emergency', name: d.name || 'Neighbor', contact: d.phone || d.email || '', text: `${d.need ?? 'Help'}: ${d.details ?? ''}`.trim(), status: 'new', date: todayIso(), householdSize: Number(d.household) || undefined }); log(d.name || 'Neighbor', 'Requested help on the website', d.need || 'Help') }}>
              <input type="hidden" name="type" value="help" />
              <div className="grid gap-4 sm:grid-cols-2">
                <F label="Your name" name="name" required autoComplete="name" />
                <F label="Phone" name="phone" type="tel" autoComplete="tel" />
                <F label="Email" name="email" type="email" autoComplete="email" />
                <F label="People in your household" name="household" type="number" />
                <F label="What do you need?" name="need" as="select" required options={Object.keys(needToProgram)} className="sm:col-span-2" />
                <F label="Tell us a little more" name="details" as="textarea" rows={3} className="sm:col-span-2" />
              </div>
              <Check name="consent" label="The outreach team may contact me about this request." defaultChecked />
            </SiteForm>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Partners" title="We do this together." center />
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {partners.map((p) => <li key={p.n} className="flex flex-col items-center gap-3 rounded-3xl border border-line bg-linen p-6 text-center"><p.icon size={28} className="text-plum" /><span className="text-sm font-semibold">{p.n}</span></li>)}
          </ul>
          <p className="mt-8 text-center text-slate max-w-3xl mx-auto">New Life has adopted George Wythe High, River City Middle and Oak Grove-Bellemeade Elementary, and partners with Richmond School of the Arts, Blackwell Elementary and Westover Hills Elementary.</p>
        </Container>
      </section>

      <section id="support" className="relative isolate overflow-hidden bg-plum text-white py-20 sm:py-28 scroll-mt-20 grain">
        <Art name="radiance-wide" alt="" className="absolute inset-0 -z-10 opacity-40" />
        <Container className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <Eyebrow light>Support the Center</Eyebrow>
            <h2 className="display text-5xl sm:text-6xl mt-4">Invest in the next generation of South Richmond.</h2>
            <p className="mt-5 text-lg text-white/80 leading-relaxed">Gifts to New Life Community Center are tax-deductible to the extent allowed by law. Businesses, foundations and civic partners: we would love to talk about sponsoring after-school, the food pantry or summer programs.</p>
            <div className="mt-8 flex flex-wrap gap-3"><GoldButton to="/give?fund=f_center" icon={<ArrowRight size={16} />}>Give to the Center</GoldButton><GlassButton to="/contact">Partner with us</GlassButton></div>
          </div>
          <div className="rounded-[28px] border border-white/15 bg-white/[0.06] p-7 backdrop-blur">
            <p className="font-caps text-xs tracking-[0.24em] text-gold-light">For grant makers</p>
            <dl className="mt-4 grid gap-3 text-white/85">
              <div><dt className="text-sm text-white/60">Legal name</dt><dd className="font-semibold">New Life Community Center Nonprofit Organization</dd></div>
              <div><dt className="text-sm text-white/60">EIN</dt><dd className="font-semibold">{church.centerEin}</dd></div>
              <div><dt className="text-sm text-white/60">Address</dt><dd className="font-semibold">{church.address}, {church.city}, {church.state} {church.zip}</dd></div>
              <div><dt className="text-sm text-white/60">Contact</dt><dd className="font-semibold break-all">{church.centerEmail}</dd></div>
            </dl>
            <RoyalButton to="/contact" className="mt-6 w-full !bg-white !text-plum hover:!bg-gold-light">Request our impact report</RoyalButton>
          </div>
        </Container>
      </section>
    </>
  )
}
