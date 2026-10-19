import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Mail, ShieldCheck, Loader2, Info, ChevronRight, LogIn } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Mark, PoweredBy } from '@/components/Logo'
import { useDemo } from '@/data/store'
import { demoAccounts, accountById, type DemoAccount } from '@/config/accounts'
import { church } from '@/config/site'
import { art } from '@/web/ui'

type Provider = 'Google' | 'Microsoft' | 'Apple' | 'Email'

function GoogleMark() {
  return <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z" /><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z" /><path fill="#FBBC05" d="M10.6 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l8-6.1z" /><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.2 0-11.5-4.1-13.4-9.8l-8 6.1C6.6 42.6 14.6 48 24 48z" /></svg>
}
function MicrosoftMark() {
  return <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path fill="#F25022" d="M0 0h9.5v9.5H0z" /><path fill="#7FBA00" d="M10.5 0H20v9.5h-9.5z" /><path fill="#00A4EF" d="M0 10.5h9.5V20H0z" /><path fill="#FFB900" d="M10.5 10.5H20V20h-9.5z" /></svg>
}
function AppleMark() {
  return <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1zM13.9 4.9c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.1.1 2.3-.6 3-1.5z" /></svg>
}

const providers: { p: Provider; label: string; icon: JSX.Element; cls: string }[] = [
  { p: 'Google', label: 'Continue with Google', icon: <GoogleMark />, cls: 'bg-paper text-midnight border border-line hover:border-midnight/30' },
  { p: 'Microsoft', label: 'Continue with Microsoft', icon: <MicrosoftMark />, cls: 'bg-paper text-midnight border border-line hover:border-midnight/30' },
  { p: 'Apple', label: 'Continue with Apple', icon: <AppleMark />, cls: 'bg-midnight text-white hover:bg-black' },
  { p: 'Email', label: 'Continue with email link', icon: <Mail size={18} />, cls: 'bg-royal-50 text-plum border border-plum/15 hover:border-plum/40' },
]

const groups: DemoAccount['group'][] = ['Pastoral leadership', 'Church administration', 'Ministry leaders', 'Volunteers', 'Members', 'Support']
const initials = (n: string) => n.replace(/^(Rev\.|Dr\.|Deacon|Min\.)\s*/g, '').replace(/^(Rev\.|Dr\.)\s*/g, '').split(/\s+/).filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).slice(0, 2).join('')

export default function Login() {
  useDocumentMeta('Sign in | New Life Connect', 'Sign in to New Life Connect, the member portal and staff hub of New Life Deliverance Tabernacle.')
  const { state, signIn } = useDemo()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next')
  const [provider, setProvider] = useState<Provider | null>(null)
  const [signing, setSigning] = useState<DemoAccount | null>(null)
  const current = state.entered ? accountById(state.accountId) : undefined
  const grouped = useMemo(() => groups.map((g) => ({ g, list: demoAccounts.filter((a) => a.group === g) })), [])

  function choose(a: DemoAccount) {
    setSigning(a)
    window.setTimeout(() => {
      signIn(a.id)
      const dest = next && next.startsWith('/') && !next.startsWith('//') ? next : a.home
      nav(a.role === 'member' && dest.startsWith('/admin') ? a.home : dest, { replace: true })
    }, 1100)
  }

  return (
    <div className="min-h-[100svh] grid lg:grid-cols-[1fr_1.05fr] bg-linen">
      <aside className="relative isolate hidden lg:flex flex-col justify-between overflow-hidden bg-midnight text-white p-12 grain">
        <img src={art('radiance-vertical')} srcSet={`${art('radiance-vertical', true)} 800w, ${art('radiance-vertical')} 1600w`} sizes="50vw" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-midnight via-midnight/50 to-midnight/20" />
        <Link to="/" className="inline-flex items-center gap-3 w-fit"><Mark size={44} light /><span className="font-display text-2xl leading-none">New Life<span className="block font-caps text-[10px] tracking-[0.3em] text-gold-light mt-1">Deliverance Tabernacle</span></span></Link>
        <div>
          <p className="font-caps text-xs tracking-[0.3em] text-gold-light">{church.scriptureRef}</p>
          <p className="display text-6xl xl:text-7xl mt-4 max-w-lg">{church.scripture}</p>
          <p className="mt-8 max-w-md text-white/70 leading-relaxed">New Life Connect brings the whole church together: members, ministry leaders, deacons, volunteers and the church office, all in one place.</p>
        </div>
        <PoweredBy light />
      </aside>

      <main className="flex flex-col px-4 sm:px-10 py-8 sm:py-12">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-plum min-h-[44px]"><ArrowLeft size={16} /> Back to website</Link>
          <span className="lg:hidden"><Mark size={36} /></span>
        </div>
        <div className="w-full max-w-xl mx-auto my-auto py-8">
          <AnimatePresence mode="wait">
            {signing ? (
              <motion.div key="signing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16" role="status" aria-live="polite">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-midnight text-gold-light font-display text-3xl">{initials(signing.name)}</div>
                <p className="mt-6 font-display text-3xl">Welcome, {signing.name.split(' ').filter((w) => !/\./.test(w) && w !== 'Deacon').slice(0, 1).join(' ') || signing.name}</p>
                <p className="mt-2 text-slate inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Verifying with {provider ?? 'single sign-on'} (simulated)</p>
              </motion.div>
            ) : !provider ? (
              <motion.div key="providers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <p className="font-caps text-xs tracking-[0.28em] text-gold">New Life Connect</p>
                <h1 className="display text-5xl sm:text-6xl mt-3">Sign in</h1>
                <p className="mt-3 text-slate text-lg">Members, leaders and staff use the same door. What you see depends on your role.</p>
                {current && (
                  <button type="button" onClick={() => nav(next ?? current.home)} className="mt-8 w-full flex items-center gap-4 rounded-3xl border-2 border-plum/30 bg-paper p-4 text-left hover:border-plum">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-plum text-white font-semibold">{initials(current.name)}</span>
                    <span className="min-w-0 flex-1"><span className="block font-semibold">Continue as {current.name}</span><span className="block text-sm text-slate truncate">{current.title}</span></span>
                    <ChevronRight className="text-plum" />
                  </button>
                )}
                <div className="mt-8 grid gap-3">
                  {providers.map((x) => (
                    <button key={x.p} type="button" onClick={() => setProvider(x.p)} className={`flex items-center justify-center gap-3 rounded-full min-h-[56px] px-6 font-semibold transition ${x.cls}`}>{x.icon}{x.label}</button>
                  ))}
                </div>
                <p className="mt-6 text-xs text-slate flex gap-2 rounded-2xl bg-paper border border-line p-4"><Info size={14} className="shrink-0 mt-0.5" /><span><strong className="text-midnight">Demo sign-in.</strong> These buttons simulate single sign-on. No password is requested and nothing leaves this page. In the live version, each person signs in with their own account.</span></p>
              </motion.div>
            ) : (
              <motion.div key="picker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <button type="button" onClick={() => setProvider(null)} className="inline-flex items-center gap-2 text-sm font-semibold text-plum min-h-[44px]"><ArrowLeft size={16} /> Other sign-in options</button>
                <div className="mt-2 flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-plum"><ShieldCheck size={14} /> Demo: {provider} sign-in simulated</div>
                <h1 className="display text-4xl sm:text-5xl mt-2">Choose who to sign in as</h1>
                <p className="mt-2 text-slate">Each account shows exactly what that person would see. Leaders are the people New Life lists publicly; sample accounts are marked.</p>
                <div className="mt-6 grid gap-6">
                  {grouped.map(({ g, list }) => list.length > 0 && (
                    <section key={g} aria-label={g}>
                      <h2 className="font-caps text-[11px] tracking-[0.24em] text-gold mb-2">{g}</h2>
                      <ul className="grid gap-2">
                        {list.map((a) => (
                          <li key={a.id}>
                            <button type="button" onClick={() => choose(a)} className="group w-full flex items-center gap-4 rounded-2xl border border-line bg-paper p-3 sm:p-4 text-left hover:border-plum/40 hover:shadow-card transition">
                              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-semibold text-sm ${a.sample ? 'bg-parchment text-slate' : 'bg-midnight text-gold-light'}`}>{initials(a.name) || 'NL'}</span>
                              <span className="min-w-0 flex-1">
                                <span className="flex flex-wrap items-center gap-2"><span className="font-semibold">{a.name}</span>{a.sample && <span className="rounded-full bg-parchment px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate">Sample</span>}</span>
                                <span className="block text-sm text-plum">{a.title}</span>
                                <span className="block text-xs text-slate mt-0.5 line-clamp-2">{a.blurb}</span>
                              </span>
                              <LogIn size={18} className="text-plum opacity-40 group-hover:opacity-100 shrink-0" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="lg:hidden flex justify-center"><PoweredBy /></div>
      </main>
    </div>
  )
}
