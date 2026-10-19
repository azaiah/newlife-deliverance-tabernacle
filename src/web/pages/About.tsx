import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Quote, HeartHandshake, Flame, Sprout, Users, ShieldCheck } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { church } from '@/config/site'
import { PageHero, Container, SectionHeading, Eyebrow, Photo, GoldButton, RoyalButton, SplitWords } from '../ui'
import { Stagger, item, Parallax } from '../motion'
import { milestones } from '../home/Sections'

type Bio = { name: string; title: string; initials: string; lead: string; paras: string[] }
const pastors: Bio[] = [
  {
    name: 'Rev. Dr. Robert A. Winfree', title: 'Founder & Senior Pastor', initials: 'RW',
    lead: 'A teacher, counselor and shepherd whose ministry has always reached past the church walls into the schools, streets and families of South Richmond.',
    paras: [
      'Pastor Robert Alfonza Winfree is a graduate of Armstrong High School. He completed Kittrell Junior College in Kittrell, North Carolina, and earned a Bachelor of Science degree from Delaware State College. He taught in the Richmond Public Schools for many years before becoming a drug counselor for the City of Richmond Human Resources Department.',
      'He received his call from God in 1985 to preach and teach the Good News, studied at Virginia Union University School of Theology, and was mentored by the Honorable Dr. Dwight C. Jones, pastor of the First Baptist Church of South Richmond. He is the founder and pastor of New Life Deliverance Tabernacle and chairs the board of New Life Community Center.',
      'Under his leadership the church has hosted Praise in the Park, fed the community, transported voters to the polls, distributed masks and sanitizer during COVID-19, and adopted George Wythe High, River City Middle and Oak Grove-Bellemeade Elementary schools. New Life created tutoring programs that awarded computers for perfect attendance, offered free preschool and low-cost summer camps, launched a men’s mentoring program and a cable wiring program, brought Bible study into the Belt Atlantic neighborhood, and adopted children who lost parents to violence. In 2025 the City of Richmond honored his service with the designation of the 900 block of Decatur Street as Rev Robert A Winfree St.',
    ],
  },
  {
    name: 'Rev. Michael L. Winfree', title: 'Pastor', initials: 'MW',
    lead: 'A minister, trainer and former funeral service owner who brings compassion, steadiness and care for families to the pulpit.',
    paras: [
      'Michael L. Winfree is the fifth of six children born to Cornelius Winfree Sr. and Dorothea H. Winfree, and is married to Vanessa Napper-Winfree. He was educated in the Richmond Public Schools and earned an associate degree in funeral service from John Tyler Community College, then owned and operated Winfree-Wright Funeral Service in Amherst, Virginia, for sixteen years.',
      'Answering the call to preach, he studied at Virginia Union University School of Theology, now the Samuel DeWitt Proctor School of Theology. He preached his initial sermon on October 5, 1997, at First Baptist Church of South Richmond, was licensed by Pastor Dwight C. Jones, and was ordained by Eastern Theological Seminary of Lynchburg on July 15, 2001.',
      'He has served as Secretary of the Western District Funeral Directors Association of Virginia and works as a facilitator and trainer at UPS. At New Life he serves alongside Pastor Robert A. Winfree, contributing to the spiritual growth and well-being of the congregation.',
    ],
  },
]
const administrator: Bio = {
  name: 'Rev. Phyllis D. Alexander', title: 'Church Administrator & Associate Pastor', initials: 'PA',
  lead: 'Equipping God’s people for growth, healing and purposeful living.',
  paras: [
    'Reverend Phyllis Denise Alexander oversees ministry operations while supporting leadership development, congregational care and organizational excellence. Her ministry reflects Romans 12:2, transformation through the renewing of the mind, and Ephesians 4:12, equipping the saints for the work of ministry.',
    'Beyond the church, she serves as a Chaplain with the Richmond Police Department, offering spiritual care, crisis support and encouragement to first responders and families. Her background in healthcare management, security auditing and leadership development strengthens her service.',
    'A licensed wedding officiant, certified grief coach and trained mental health and psychological first aid responder, she carries a compassionate anointing for those navigating life transitions, loss and restoration, trusting Philippians 1:6: He who began a good work will carry it on to completion.',
  ],
}

const leaders = [
  ['Deacon Shelby Vincent', 'Diaconate'], ['Deacon Landis Mathews', 'Transportation'], ['Deacon Tashabe Jackson', 'Community Conversations'], ['Deacon Evone Woodley', 'Decorating'],
  ['Deacon Tyrone Edmonds', 'Armor Bearers'], ['Min. Kevin Dixon', 'Music Ministry'], ['Yolanda Jacobus', 'Ushers'], ['Walter Fenner', 'Culinary Arts'],
  ['Robin Chaney', 'Bereavement'], ['Cheryl Jennings', 'GALS (God’s Anointed Leaders)'], ['Sandra Sykes', 'Extended Programs'],
]

const values = [
  { icon: HeartHandshake, t: 'Healing', d: 'Binding up the brokenhearted through prayer, counseling and care.' },
  { icon: Flame, t: 'Deliverance', d: 'Leading people out of bondage into the liberty of Christ.' },
  { icon: Sprout, t: 'Empowerment', d: 'Equipping people spiritually and practically to thrive.' },
  { icon: Users, t: 'Connection', d: 'A family where everyone is welcomed with warmth.' },
  { icon: ShieldCheck, t: 'Service', d: 'Feeding the hungry, clothing the naked, visiting the sick and widowed.' },
]

function BioCard({ b }: { b: Bio }) {
  const [open, setOpen] = useState(false)
  return (
    <article className="relative rounded-[32px] border border-line bg-paper p-7 sm:p-10 shadow-card">
      <div className="flex items-center gap-5">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-midnight text-gold-light font-caps text-2xl tracking-wider ring-4 ring-gold-bright/30">{b.initials}</div>
        <div><h3 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">{b.name}</h3><p className="font-caps text-xs tracking-[0.22em] text-gold mt-1">{b.title}</p></div>
      </div>
      <p className="mt-6 font-display text-2xl italic leading-snug text-plum">{b.lead}</p>
      <div className="mt-4 space-y-4 text-slate leading-relaxed">
        <p>{b.paras[0]}</p>
        {open && b.paras.slice(1).map((p) => <motion.p key={p} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{p}</motion.p>)}
      </div>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="mt-5 inline-flex items-center gap-1.5 font-semibold text-plum hover:text-amethyst min-h-[44px]">{open ? 'Show less' : 'Read full biography'} <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} /></button>
    </article>
  )
}

export default function About() {
  useDocumentMeta('About New Life Deliverance Tabernacle | Our Story, Pastors and Mission', 'Founded in 1997 from a vision to minister to returning citizens and people in recovery, New Life Deliverance Tabernacle has served South Richmond from 900 Decatur Street since 2007.')
  return (
    <>
      <PageHero eyebrow="Our story" title="Called to heal hearts and set captives free." image="sanctuary-morning" text="Join our journey of genuine faith, communal harmony and transformative spiritual experiences in Richmond." />

      <section className="bg-paper py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <Eyebrow>Mission</Eyebrow>
            <div className="relative mt-6">
              <Quote aria-hidden="true" size={64} className="absolute -left-2 -top-6 text-gold-bright/25" />
              <p className="relative font-display text-2xl sm:text-3xl leading-snug text-midnight">{church.mission}</p>
            </div>
          </div>
          <div className="grid gap-4">
            <Parallax speed={0.12}><Photo name="congregation-praise" className="aspect-[16/11] rounded-[32px] shadow-lift" /></Parallax>
            <div className="rounded-[28px] bg-midnight text-white p-7">
              <p className="font-caps text-xs tracking-[0.24em] text-gold-light">Vision</p>
              <p className="mt-3 text-lg leading-relaxed text-white/85">{church.vision}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-linen py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="What shapes us" title="Faith that is practiced, not only professed." center />
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((v) => (
              <motion.div key={v.t} variants={item} className="rounded-3xl border border-line bg-paper p-6 text-center">
                <v.icon size={30} className="mx-auto text-gold" />
                <h3 className="mt-4 font-display text-2xl font-semibold">{v.t}</h3>
                <p className="mt-2 text-sm text-slate leading-relaxed">{v.d}</p>
              </motion.div>
            ))}
          </Stagger>
        </Container>
      </section>

      <section id="pastors" className="relative bg-midnight text-white py-20 sm:py-28 overflow-hidden scroll-mt-20 grain">
        <div className="light-leaks" />
        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <Eyebrow light>Our pastors</Eyebrow>
              <SplitWords as="h2" text="Called to lead, equipped to serve, anointed to care." className="display text-[2.6rem] sm:text-6xl mt-4 text-balance" />
              <p className="mt-5 text-lg text-white/75 leading-relaxed">Two pastors, called to the same house, standing side by side. Each brings unique gifts, yet they move in harmony, modeling humility, unity and servant leadership.</p>
            </div>
            <Photo name="pastors-portrait" className="aspect-[16/10] rounded-[32px] gold-frame" alt="The pastors of New Life Deliverance Tabernacle" />
          </div>
        </Container>
      </section>
      <section className="bg-linen py-16 sm:py-24">
        <Container className="grid gap-6 lg:grid-cols-2">
          {pastors.map((p) => <BioCard key={p.name} b={p} />)}
          <div className="lg:col-span-2"><BioCard b={administrator} /></div>
        </Container>
      </section>

      <section className="bg-paper py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="History" title="A legacy of faith, service and God's unfailing grace." />
          <ol className="relative mt-14 border-l-2 border-gold-bright/40 ml-3 sm:ml-6 space-y-14">
            {milestones.map((m) => (
              <li key={m.y} className="relative pl-8 sm:pl-12">
                <span className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-gold-bright ring-4 ring-gold-50" aria-hidden="true" />
                <div className="grid gap-6 md:grid-cols-[1fr_320px] md:items-start">
                  <div>
                    <p className="font-caps text-sm tracking-[0.24em] text-gold">{m.y}</p>
                    <h3 className="mt-2 font-display text-3xl sm:text-4xl font-semibold">{m.t}</h3>
                    <p className="mt-3 text-slate leading-relaxed max-w-2xl">{m.d}</p>
                  </div>
                  <Photo name={m.photo} className="aspect-[4/3] rounded-3xl" />
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-16 rounded-[32px] bg-parchment border border-line p-8 sm:p-10">
            <p className="font-caps text-xs tracking-[0.24em] text-gold">Partners in the journey</p>
            <p className="mt-3 text-lg text-slate leading-relaxed">Over the years New Life has been blessed by Pastor Joe Ellison of Essex Village Community Church, Pastor John Hershman, Pastor Bob Laughlin of Westend Assembly of God and Dr. Dwight C. Jones. Today the church partners with Richmond Public Schools, Richmond Behavioral Health Authority, the City of Richmond, FeedMore, the Richmond Police Department and the Richmond Fire Department.</p>
          </div>
        </Container>
      </section>

      <section className="relative isolate bg-midnight text-white py-20 sm:py-28 overflow-hidden grain">
        <Photo name="street-naming-2" className="absolute inset-0 -z-10 opacity-35" alt="" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight via-midnight/85 to-midnight/40" />
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Eyebrow light>Milestone · 2025</Eyebrow>
            <h2 className="display text-5xl sm:text-6xl mt-4">Rev Robert A Winfree St</h2>
            <p className="mt-5 text-lg text-white/80 leading-relaxed">In 2025 Richmond City Council designated the 900 block of Decatur Street in honor of Pastor Winfree. City officials, neighbors and the church family gathered to honor a shepherd whose life has been marked by faithful service, compassionate leadership and devotion to God and His people.</p>
            <div className="mt-8"><GoldButton to="/events">Celebrate with us</GoldButton></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Photo name="street-sign" className="aspect-[3/4] rounded-3xl" />
            <div className="grid gap-3"><Photo name="street-naming-3" className="aspect-square rounded-3xl" /><Photo name="street-naming-5" className="aspect-square rounded-3xl" /></div>
          </div>
        </Container>
      </section>

      <section className="bg-linen py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Leadership" title="Ministry leaders" text="Servant leaders who keep every ministry moving. Reach any of them through the church office." />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map(([n, m]) => (
              <li key={n} className="flex items-center gap-4 rounded-2xl border border-line bg-paper px-5 py-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-royal-50 font-caps text-sm text-plum">{n.replace(/^(Deacon|Min\.)\s/, '').split(' ').map((x) => x[0]).join('').slice(0, 2)}</span>
                <span><span className="block font-semibold">{n}</span><span className="block text-sm text-slate">{m}</span></span>
              </li>
            ))}
          </ul>
          <div className="mt-10"><RoyalButton to="/ministries">Explore ministries</RoyalButton></div>
        </Container>
      </section>
    </>
  )
}
