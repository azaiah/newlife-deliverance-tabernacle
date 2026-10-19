import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Send, Sparkles } from 'lucide-react'
import { Mark } from '@/components/Logo'
import { church } from '@/config/site'

type Msg = { from: 'bot' | 'you'; text: string; links?: { label: string; to: string }[] }

const rules: { k: RegExp; a: Msg }[] = [
  { k: /time|when|service|sunday|worship|start/i, a: { from: 'bot', text: 'Sunday Worship begins at 9:45 AM at 900 Decatur Street. Bible Study is Tuesdays 7:00 to 8:00 PM. First time? We would love to know you are coming so an usher can greet you.', links: [{ label: 'Plan a visit', to: '/visit' }, { label: 'This week', to: '/events' }] } },
  { k: /food|pantry|grocer|hungry|feedmore|eat/i, a: { from: 'bot', text: 'Free groceries every Wednesday 1:00 to 3:00 PM and Saturday 11:00 AM to 1:00 PM in partnership with FeedMore. There is no eligibility requirement. Just come.', links: [{ label: 'Get help', to: '/community#help' }] } },
  { k: /after.?school|tutor|homework|kids|children|youth|teen|camp/i, a: { from: 'bot', text: 'The After-School Program meets Mondays and Wednesdays 5:00 to 7:00 PM with homework help, tutoring and mentoring through New Life Community Center.', links: [{ label: 'Community Center', to: '/community' }] } },
  { k: /counsel|therapy|grief|mental|struggl|depress|anxi|marriage/i, a: { from: 'bot', text: 'Spiritual Guidance & Counseling is available Tuesdays 5:00 to 7:00 PM, including grief, family and marriage support. It is confidential. If you are in crisis right now, call or text 988 any time.', links: [{ label: 'Request care', to: '/prayer' }] } },
  { k: /pray|prayer/i, a: { from: 'bot', text: 'We would be honored to pray with you. Share a request and our pastors and prayer team will lift it up. You can keep it confidential.', links: [{ label: 'Prayer request', to: '/prayer' }] } },
  { k: /give|giving|tithe|offering|donat/i, a: { from: 'bot', text: 'You can give online in a minute, one time or monthly, to Tithes & Offerings, the Building Fund, the Food Pantry or New Life Community Center.', links: [{ label: 'Give now', to: '/give' }] } },
  { k: /ride|transport|van|pick ?up/i, a: { from: 'bot', text: 'The Transportation ministry offers rides to worship and programs. Request a ride by Friday for Sunday pickup.', links: [{ label: 'Request a ride', to: '/visit#ride' }] } },
  { k: /funeral|repast|bereave|passed|died|loss/i, a: { from: 'bot', text: 'We are so sorry for your loss. Our pastors, Bereavement and Culinary Arts ministries walk with families through homegoing services and repasts.', links: [{ label: 'Life events', to: '/life-events' }] } },
  { k: /baptis|wedding|marri|dedicat|baby/i, a: { from: 'bot', text: 'We celebrate baptisms, weddings (with premarital counseling) and baby dedications. Tell us about your moment and the church office will follow up.', links: [{ label: 'Life events', to: '/life-events' }] } },
  { k: /address|where|park|direction|locat/i, a: { from: 'bot', text: `We are at ${church.address}, ${church.city}, ${church.state} ${church.zip}, on the block honored as Rev Robert A Winfree St. Parking is on site and on Decatur Street.`, links: [{ label: 'Directions', to: '/visit#directions' }] } },
  { k: /volunteer|serve|help out|join/i, a: { from: 'bot', text: 'There is a place for you: ushers, media, transportation, culinary, decorating, choir, mentoring and the food pantry.', links: [{ label: 'Find your ministry', to: '/ministries' }] } },
  { k: /pastor|winfree|alexander|leader/i, a: { from: 'bot', text: 'New Life is led by Founder & Senior Pastor Rev. Dr. Robert A. Winfree and Pastor Michael L. Winfree, with Rev. Phyllis Alexander as Church Administrator and Associate Pastor.', links: [{ label: 'Our pastors', to: '/about#pastors' }] } },
  { k: /conversation|community meeting|business/i, a: { from: 'bot', text: 'Community Conversations meet the 2nd and 4th Tuesdays, 5:45 to 6:45 PM. Bring your voice, your concerns and your ideas. Business owners are welcome.', links: [{ label: 'Events', to: '/events' }] } },
  { k: /watch|live|stream|online|sermon/i, a: { from: 'bot', text: 'Worship streams live on Facebook on Sundays. Follow New Life on Facebook so you never miss a service.', links: [{ label: 'Watch', to: '/watch' }] } },
]
const suggestions = ['Service times', 'I need food', 'After-school', 'Prayer request', 'How do I give?']

export function Assistant() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: 'Welcome to New Life. Ask me anything about worship, food assistance, our programs or how to get connected.' }])
  const [input, setInput] = useState('')
  const nav = useNavigate()
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [msgs, open])
  function send(q?: string) {
    const text = (q ?? input).trim(); if (!text) return
    setInput('')
    setMsgs((m) => [...m, { from: 'you', text }])
    const hit = rules.find((r) => r.k.test(text))
    setTimeout(() => setMsgs((m) => [...m, hit ? hit.a : { from: 'bot', text: `Great question. The church office can help: call ${church.phone} (Mon to Fri, 11 AM to 4 PM) or send a message.`, links: [{ label: 'Contact', to: '/contact' }] }]), 420)
  }
  return (
    <div className="fixed bottom-5 right-5 z-[60] no-print">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.96 }} transition={{ duration: 0.25 }} className="assistant-panel mb-3 w-[calc(100vw-2.5rem)] sm:w-[400px] rounded-3xl border border-gold-bright/30 bg-paper shadow-lift flex flex-col overflow-hidden" role="dialog" aria-label="Ask New Life">
            <div className="shrink-0 relative flex items-center justify-between px-5 py-4 bg-midnight text-white overflow-hidden">
              <div className="light-leaks" />
              <div className="relative flex items-center gap-3"><Mark size={34} light /><div><p className="font-display text-xl leading-none">Ask New Life</p><p className="text-[11px] text-white/60 mt-1 inline-flex items-center gap-1"><Sparkles size={11} /> Instant answers · church office follows up</p></div></div>
              <button type="button" onClick={() => setOpen(false)} className="relative tap inline-flex items-center justify-center rounded-full hover:bg-white/10" aria-label="Close assistant"><X size={18} /></button>
            </div>
            <div className="h-80 min-h-[5rem] flex-1 overflow-y-auto overscroll-contain p-4 space-y-3 bg-linen" aria-live="polite">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'you' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] ${m.from === 'you' ? 'bg-plum text-white rounded-br-md' : 'bg-paper border border-line rounded-bl-md'}`}>
                    <p className="leading-relaxed">{m.text}</p>
                    {m.links && <div className="mt-2 flex flex-wrap gap-1.5">{m.links.map((l) => <button key={l.to} type="button" onClick={() => { nav(l.to); setOpen(false) }} className="rounded-full bg-gold-50 text-gold border border-gold-bright/40 px-3 py-1.5 text-xs font-semibold hover:bg-gold-bright hover:text-midnight min-h-[32px]">{l.label}</button>)}</div>}
                  </div>
                </div>
              ))}
              <div ref={end} />
            </div>
            <div className="shrink-0 p-2.5 border-t border-line bg-paper">
              <div className="flex flex-wrap gap-1.5 px-1 pb-2 [@media(max-height:520px)]:hidden">{suggestions.map((s) => <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:border-plum hover:text-plum min-h-[32px]">{s}</button>)}</div>
              <form onSubmit={(e: FormEvent) => { e.preventDefault(); send() }} className="flex gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question" aria-label="Ask New Life a question" className="flex-1 rounded-full border border-line px-4 py-2 text-sm focus:border-plum focus:outline-none focus:ring-2 focus:ring-amethyst/20 min-h-[44px]" />
                <button type="submit" className="tap inline-flex items-center justify-center rounded-full bg-plum text-white hover:bg-plum-2" aria-label="Send"><Send size={16} /></button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button type="button" onClick={() => setOpen((o) => !o)} className="relative ml-auto flex h-16 w-16 items-center justify-center rounded-full bg-midnight shadow-lift ring-2 ring-gold-bright/60 hover:ring-gold-light transition" aria-label={open ? 'Close Ask New Life' : 'Open Ask New Life'} aria-expanded={open}>
        {!open && <span aria-hidden="true" className="absolute inset-0 rounded-full animate-ping bg-gold-bright/20" style={{ animationDuration: '3s' }} />}
        {open ? <X size={24} className="text-white" /> : <Mark size={40} light />}
      </button>
    </div>
  )
}
