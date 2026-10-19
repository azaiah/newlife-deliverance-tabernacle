import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Clock, Check, Mail } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { useDemo } from '@/data/store'
import { uid } from '@/data/ids'
import { daysFromNow } from '@/data/dates'
import { church } from '@/config/site'
import { PageHero, Container, Photo, GoldButton, Eyebrow } from '../ui'
import { SiteForm, F } from '../forms'

type Cat = 'Worship & Word' | 'Serving teams' | 'Care & family' | 'Outreach' | 'Youth'
type Min = { id: string; name: string; cat: Cat; photo: string; meets: string; blurb: string; duties: string[]; leader?: string }

/** Duties are the church's own descriptions from its current website. */
const list: Min[] = [
  { id: 'min_worship', name: 'Ministers', cat: 'Worship & Word', photo: 'pastors-robes-1', meets: 'Sundays and as assigned', blurb: 'Associate pastors united in purpose, serving together with one heart and one vision.', duties: ['Support the Senior Pastor in shepherding the congregation', 'Preach and teach as assigned', 'Provide pastoral care, counseling and intercessory prayer', 'Oversee assigned ministries and community outreach', 'Assist with worship planning and leadership'] },
  { id: 'min_music', name: 'Music Ministry & Choir', cat: 'Worship & Word', photo: 'choir-1', meets: 'Choir rehearsal Fridays 7:00 PM', leader: 'Min. Kevin Dixon', blurb: 'Lead the congregation in worship through song. Seasoned singers and newcomers welcome.', duties: ['Select and arrange worship music aligned with the message', 'Direct choirs and musicians; organize rehearsals', 'Train and develop musical talent', 'Minister at special events and outreach'] },
  { id: 'min_worship', name: 'Bible Study', cat: 'Worship & Word', photo: 'bible-hands', meets: 'Tuesdays 7:00 to 8:00 PM', blurb: 'Dive deep into the Word with open dialogue that resonates with daily life.', duties: ['Scripture study and discussion', 'Fellowship with other believers', 'A great next step after Sunday'] },
  { id: 'min_deacons', name: 'Diaconate · Deacons on a Mission', cat: 'Care & family', photo: 'pastors-robes-2', meets: 'Monthly and on call', leader: 'Deacon Shelby Vincent', blurb: 'Deacons in action, serving beyond the walls of the church and into the heart of the community.', duties: ['Serve through prayer, care and spiritual support', 'Assist the Pastor in sacraments and ministry', 'Visit the sick and bereaved', 'Lead benevolence efforts and counsel members', 'Engage in evangelism, outreach and community events'] },
  { id: 'min_ushers', name: 'Ushers', cat: 'Serving teams', photo: 'fellowship-1', meets: 'Sundays from 9:15 AM', leader: 'Yolanda Jacobus', blurb: 'The first point of contact, ensuring a welcoming and orderly atmosphere.', duties: ['Greet and seat worshippers', 'Distribute bulletins and offering envelopes', 'Assist with tithes, offerings and communion', 'Support people with special needs and respond to emergencies'] },
  { id: 'min_security', name: 'Security', cat: 'Serving teams', photo: 'police-partners', meets: 'Every service', blurb: 'Safeguarding the pastor, congregation and church property.', duties: ['Monitor entrances, parking and facilities', 'Respond to emergencies with calm and discretion', 'Coordinate with ushers and greeters', 'Develop safety procedures with law enforcement'] },
  { id: 'min_culinary', name: 'Culinary Arts', cat: 'Serving teams', photo: 'community-meal', meets: 'As scheduled', leader: 'Walter Fenner', blurb: 'Hospitality and excellence in food service for every gathering.', duties: ['Prepare and serve meals for functions, funerals and events', 'Maintain kitchen cleanliness and safety', 'Manage food inventory and budget', 'Collaborate with other ministries'] },
  { id: 'min_bereavement', name: 'Bereavement', cat: 'Care & family', photo: 'altar-flowers', meets: 'Whenever a family needs us', leader: 'Robin Chaney', blurb: 'Compassionate care and support for grieving families.', duties: ['Prayer, follow-up and emotional guidance after loss', 'Coordinate with ushers, culinary and leadership for funerals', 'Uphold confidentiality and grace'] },
  { id: 'min_media', name: 'Sound & Media', cat: 'Serving teams', photo: 'musician-keys', meets: 'Sundays from 9:00 AM', blurb: 'Oversee the digital and visual parts of worship.', duties: ['Operate livestreams, projection and displays', 'Manage the website and social media', 'Record and archive sermons and events', 'Maintain media equipment'] },
  { id: 'min_grounds', name: 'Building & Grounds', cat: 'Serving teams', photo: 'exterior', meets: 'Saturdays as scheduled', blurb: 'Keeping the church building and grounds clean, safe and presentable.', duties: ['Care for the inside of the building', 'Care for the grounds and parking areas'] },
  { id: 'min_transport', name: 'Transportation', cat: 'Outreach', photo: 'group-outside', meets: 'Sunday routes and on request', leader: 'Deacon Landis Mathews', blurb: 'Safe and timely transportation for members and guests.', duties: ['Operate church vehicles with care', 'Maintain vehicle safety and cleanliness', 'Ensure passenger safety and comfort'] },
  { id: 'min_decorating', name: 'Decorating', cat: 'Serving teams', photo: 'altar-flowers', meets: 'Before special services', leader: 'Deacon Evone Woodley', blurb: 'Enhancing the church atmosphere through thoughtful, thematic decor.', duties: ['Plan seasonal and special-event decor', 'Maintain floral arrangements and banners', 'Coordinate aesthetics with ministry teams'] },
  { id: 'min_gals', name: 'GALS · God’s Anointed Leaders', cat: 'Serving teams', photo: 'women-fellowship', meets: 'As needed', leader: 'Cheryl Jennings', blurb: 'A select group of anointed leaders available to assist and support all ministries.', duties: ['Support every ministry as needed'] },
  { id: 'min_armor', name: 'Armor Bearers', cat: 'Serving teams', photo: 'pastor-blue-suit', meets: 'Every service', leader: 'Deacon Tyrone Edmonds', blurb: 'Supporting the Pastor in spiritual and practical matters.', duties: ['Offer consistent prayer and encouragement', 'Manage service logistics', 'Provide assistance during travel and engagements'] },
  { id: 'min_women', name: 'Women’s Ministry', cat: 'Care & family', photo: 'women-ministry', meets: '3rd Saturdays 1:30 to 3:00 PM', blurb: 'Programs that nurture personal growth and meaningful fellowship for women.', duties: ['Encouragement and fellowship', 'Spiritual and social support', 'Service in the community, including Belt Atlantic'] },
  { id: 'min_men', name: 'Men’s Ministry', cat: 'Care & family', photo: 'men-fellowship', meets: 'Monthly', blurb: 'Purpose-driven fellowship, accountability and brotherhood, plus an ongoing mentoring program.', duties: ['Fellowship and accountability', 'Leadership development', 'Mentoring young men'] },
  { id: 'min_care', name: 'Spiritual Guidance & Counseling', cat: 'Care & family', photo: 'bible-hands', meets: 'Tuesdays 5:00 to 7:00 PM', blurb: 'Confidential, personalized support grounded in biblical principles: grief, family, marriage and mental wellness.', duties: ['One-on-one spiritual guidance', 'Grief and family support', 'Premarital and marriage counseling', 'Referrals for mental health resources'] },
  { id: 'min_outreach', name: 'Community Outreach & Food Pantry', cat: 'Outreach', photo: 'pantry-outdoor', meets: 'Wed 1 to 3 PM · Sat 11 AM to 1 PM', leader: 'Deacon Tashabe Jackson', blurb: 'Groceries, clothing, neighborhood events and Community Conversations.', duties: ['FeedMore food distribution twice a week', 'Clothing and emergency assistance', 'Community Conversations on the 2nd and 4th Tuesdays', 'Neighborhood events in Hillside and Belt Atlantic'] },
  { id: 'min_youth', name: 'Youth & Children', cat: 'Youth', photo: 'youth-group', meets: 'Sundays and trips', blurb: 'Inspiring young people to discover their potential through mentorship, faith and fun.', duties: ['Youth outings and educational trips', 'Leadership and character development', 'Faith-based activities and friendships'] },
  { id: 'min_center', name: 'After-School Program', cat: 'Youth', photo: 'youth-class', meets: 'Mon & Wed 5:00 to 7:00 PM', leader: 'Sandra Sykes', blurb: 'Homework help, tutoring and mentorship in a safe, encouraging environment.', duties: ['Homework help and tutoring', 'Mentorship and positive guidance', 'Activities that spark curiosity'] },
]
const cats: ('All' | Cat)[] = ['All', 'Worship & Word', 'Serving teams', 'Care & family', 'Outreach', 'Youth']

export default function MinistriesPage() {
  useDocumentMeta('Ministries | New Life Deliverance Tabernacle', 'Find your place at New Life: music and choir, ushers, culinary arts, transportation, deacons, women’s and men’s ministries, youth, after-school and outreach.')
  const { state, upsert, log } = useDemo()
  const [cat, setCat] = useState<'All' | Cat>('All')
  const [open, setOpen] = useState<Min | null>(null)
  const shown = useMemo(() => list.filter((m) => cat === 'All' || m.cat === cat), [cat])
  return (
    <>
      <PageHero eyebrow="Ministries" title="There is a place for you." photo="praise-dance-1" text="Serving with purpose. Growing in faith. Making an impact together. Find the ministry where your gifts fit." />
      <section className="bg-linen py-16 sm:py-24">
        <Container>
          <div role="tablist" aria-label="Ministry categories" className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {cats.map((c) => (
              <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-5 min-h-[44px] text-sm font-semibold border transition-colors ${cat === c ? 'bg-midnight text-white border-midnight' : 'bg-paper border-line text-midnight hover:border-plum'}`}>{c}</button>
            ))}
          </div>
          <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((m) => (
                <motion.article layout key={m.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} className="group flex flex-col overflow-hidden rounded-[28px] border border-line bg-paper shadow-card hover:shadow-lift transition-shadow">
                  <div className="relative">
                    <Photo name={m.photo} className="aspect-[16/10]" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute left-4 top-4 rounded-full bg-midnight/80 backdrop-blur px-3 py-1 text-xs font-semibold text-gold-light">{m.cat}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-[1.9rem] font-semibold leading-tight">{m.name}</h2>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-plum"><Clock size={14} /> {m.meets}</p>
                    <p className="mt-3 text-slate leading-relaxed">{m.blurb}</p>
                    <ul className="mt-4 space-y-1.5 text-sm text-slate flex-1">{m.duties.slice(0, 3).map((d) => <li key={d} className="flex gap-2"><Check size={16} className="text-gold mt-0.5 shrink-0" /> {d}</li>)}</ul>
                    {m.leader && <p className="mt-4 text-sm"><span className="text-slate">Leader:</span> <b>{m.leader}</b></p>}
                    <button type="button" onClick={() => setOpen(m)} className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border-2 border-plum/20 px-5 min-h-[48px] font-semibold text-plum hover:bg-plum hover:text-white hover:border-plum transition-colors"><Mail size={16} /> Contact this ministry</button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </Container>
      </section>
      <section className="relative isolate overflow-hidden bg-midnight text-white py-20 sm:py-24 grain">
        <div className="light-leaks" />
        <Container className="relative text-center">
          <Eyebrow light className="justify-center">We need your help</Eyebrow>
          <h2 className="display text-5xl sm:text-7xl mt-4">Together, we can make a difference.</h2>
          <p className="mt-5 text-lg text-white/75 max-w-2xl mx-auto">Media, transportation, decorating, choir, mentoring and youth all need willing hearts. Contact a ministry leader or the church office to get involved today.</p>
          <div className="mt-8 flex justify-center"><GoldButton href={church.phoneHref}>Call {church.phone}</GoldButton></div>
        </Container>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center bg-midnight/60 backdrop-blur-sm p-0 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.div role="dialog" aria-modal="true" aria-label={`Contact ${open.name}`} initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onClick={(e) => e.stopPropagation()} className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] bg-paper p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4"><div><p className="font-caps text-xs tracking-[0.22em] text-gold">Get involved</p><h2 className="font-display text-3xl font-semibold mt-1">{open.name}</h2></div><button type="button" onClick={() => setOpen(null)} className="tap inline-flex items-center justify-center rounded-full hover:bg-midnight/5" aria-label="Close"><X size={22} /></button></div>
              <p className="mt-2 text-slate">Your message goes to the church office and the ministry leader.</p>
              <div className="mt-6">
                <SiteForm name={church.formNames.volunteer} submitLabel="Send" success={{ title: 'Message sent.', text: 'A ministry leader will reach out soon. Thank you for wanting to serve.' }}
                  onSubmitted={(d) => { const min = state.ministries.find((x) => x.id === open.id); upsert('tasks', { id: uid('t'), title: `Website: ${d.name || 'Someone'} wants to connect with ${open.name}`, assigneeId: min?.leaderId ?? 'm_3', due: daysFromNow(3), status: 'todo', module: 'ministries', priority: 'normal' }); log(d.name || 'Website visitor', 'Asked to join a ministry', open.name) }}>
                  <input type="hidden" name="ministry" value={open.name} />
                  <F label="Your name" name="name" required autoComplete="name" />
                  <div className="grid gap-4 sm:grid-cols-2"><F label="Email" name="email" type="email" autoComplete="email" /><F label="Phone" name="phone" type="tel" autoComplete="tel" /></div>
                  <F label="Message" name="message" as="textarea" rows={3} placeholder="Tell us a little about yourself and how you would like to serve" />
                </SiteForm>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
