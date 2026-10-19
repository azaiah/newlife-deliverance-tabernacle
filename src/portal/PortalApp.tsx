import { useState } from 'react'
import { Routes, Route, NavLink, Link, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Heart, CalendarDays, Users, Bell, UserCircle, LogOut, HandHeart, BookOpen, Globe, LayoutGrid } from 'lucide-react'
import { useDemo } from '@/data/store'
import { PoweredBy, Mark } from '@/components/Logo'
import { accountById } from '@/config/accounts'
import { church } from '@/config/site'
import { art } from '@/web/ui'
import { PortalHome } from './PortalHome'
import { PortalGiving } from './PortalGiving'
import { PortalEvents } from './PortalEvents'
import { PortalGroups } from './PortalGroups'
import { PortalProfile } from './PortalProfile'
import { PortalCare } from './PortalCare'

const portalTips: Record<string, { title: string; text: string }> = {
  '/portal': { title: 'Your overview', text: 'One screen with your giving this year, events you registered for, your ministries and any prayer requests you have shared. Everything here is yours alone.' },
  '/portal/giving': { title: 'Giving history', text: 'Every gift by month and by fund. Download your annual statement for tax time with one click. Only you and the finance team can see these numbers.' },
  '/portal/events': { title: 'My events', text: 'Everything you registered for on the church website. Cancel a seat here if plans change; the church office sees the update immediately.' },
  '/portal/groups': { title: 'My ministries', text: 'The ministries you serve with, when they meet and open serving spots. Join or leave here and the leader is notified.' },
  '/portal/care': { title: 'Prayer and care', text: 'Requests you have shared and where they stand. Private requests are seen only by the pastors.' },
  '/portal/profile': { title: 'Profile and permissions', text: 'Keep your contact details current and choose whether the church may email or text you. Changes apply right away.' },
}
const TIP_KEY = 'nldt-portal-guide'

const items = [
  { to: '/portal', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/portal/giving', label: 'Giving', icon: Heart },
  { to: '/portal/events', label: 'My events', icon: CalendarDays },
  { to: '/portal/groups', label: 'My ministries', icon: Users },
  { to: '/portal/care', label: 'Prayer & care', icon: HandHeart },
  { to: '/portal/profile', label: 'Profile', icon: UserCircle },
]

function PortalShell() {
  const { state, signOut } = useDemo()
  const nav = useNavigate()
  const loc = useLocation()
  const me = state.members.find((m) => m.id === state.currentMemberId)
  const acct = accountById(state.accountId)
  const staff = state.role !== 'member'
  const [guide, setGuide] = useState(() => { try { return localStorage.getItem(TIP_KEY) !== '0' } catch { return true } })
  const toggleGuide = () => { const v = !guide; setGuide(v); try { localStorage.setItem(TIP_KEY, v ? '1' : '0') } catch { /* noop */ } }
  const tip = portalTips[loc.pathname] ?? portalTips['/portal']
  const first = me?.first ?? acct?.name.split(' ')[0] ?? 'friend'
  return (
    <div className="min-h-screen bg-linen flex flex-col">
      <header className="relative isolate overflow-hidden bg-midnight text-white grain">
        <img src={art('radiance-wide', true)} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight via-midnight/85 to-plum/60" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2.5 min-h-[44px]"><Mark size={32} light /><span className="leading-none"><span className="block font-display text-lg">New Life Connect</span><span className="block font-caps text-[9px] tracking-[0.24em] text-gold-light mt-1">Member portal</span></span></Link>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button type="button" onClick={toggleGuide} aria-pressed={guide} className={`tap inline-flex items-center gap-1.5 rounded-full border px-3 text-sm font-medium ${guide ? 'bg-gold-bright text-midnight border-gold-bright' : 'border-white/25 text-white/80'}`} title="Simple explanations on every page"><BookOpen size={16} /> <span className="hidden sm:inline">Guide {guide ? 'on' : 'off'}</span></button>
            {staff && <Link to={acct?.home.startsWith('/admin') ? acct.home : '/admin'} className="tap hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3 text-sm hover:bg-white/10"><LayoutGrid size={16} /> Staff hub</Link>}
            <Link to="/" className="tap hidden md:inline-flex items-center gap-1.5 rounded-full px-3 text-sm text-white/80 hover:bg-white/10"><Globe size={16} /> Website</Link>
            <button type="button" onClick={() => { signOut(); nav('/login') }} className="tap inline-flex items-center gap-1.5 rounded-full px-3 text-sm text-white/80 hover:bg-white/10"><LogOut size={16} /> <span className="hidden sm:inline">Sign out</span></button>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 pb-10 sm:pt-8 sm:pb-14 flex items-end justify-between gap-6">
          <div>
            <p className="font-caps text-[11px] tracking-[0.28em] text-gold-light">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <h1 className="display text-4xl sm:text-5xl mt-2">Welcome home, {first}.</h1>
            <p className="mt-2 text-white/70 max-w-xl text-sm sm:text-base">“{church.scripture}” {church.scriptureRef}</p>
          </div>
          <span className="hidden sm:grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-b from-[#E8CC85] to-gold-bright text-midnight font-display text-2xl font-semibold glow-gold">{me ? `${me.first[0]}${me.last[0]}` : 'NL'}</span>
        </div>
      </header>
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 -mt-6 pb-10 flex-1 grid gap-6 lg:gap-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Portal" className="lg:sticky lg:top-6 self-start rounded-3xl bg-paper border border-line shadow-card p-2">
          <ul className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
            {items.map((it) => (
              <li key={it.to} className="shrink-0"><NavLink to={it.to} end={it.end} className={({ isActive }) => `flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-medium min-h-[44px] whitespace-nowrap transition ${isActive ? 'bg-plum text-white shadow-lift' : 'text-slate hover:bg-linen hover:text-midnight'}`}><it.icon size={17} /> {it.label}</NavLink></li>
            ))}
          </ul>
          <div className="hidden lg:block mt-2 rounded-2xl bg-linen p-3 text-xs text-slate">
            <p className="flex items-center gap-1.5 font-medium text-midnight"><Bell size={13} className="text-gold" /> {state.announcements.filter((a) => a.status === 'sent' || a.status === 'approved').length} announcements</p>
            <p className="mt-1">Sample data stored in this browser.</p>
          </div>
        </nav>
        <main id="main" className="min-w-0 lg:pt-6">
          {staff && <p className="mb-4 rounded-2xl bg-royal-50 border border-plum/15 px-4 py-3 text-sm text-plum">You are viewing the member portal as {acct?.name}. Leaders’ giving and care records are never invented in this demo, so some lists may be empty. Sign in as the sample member, Angela Brooks, to see a full portal.</p>}
          {guide && <div className="mb-5 rounded-2xl border border-gold-bright/50 bg-gold-50 p-4 flex gap-3"><BookOpen size={18} className="text-gold shrink-0 mt-0.5" /><div><p className="font-semibold text-sm">{tip.title}</p><p className="text-sm text-slate mt-0.5 leading-relaxed">{tip.text}</p></div></div>}
          <Outlet />
        </main>
      </div>
      <footer className="border-t border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate">
          <span>{church.name} · {church.address}, {church.city}</span>
          <PoweredBy />
        </div>
      </footer>
    </div>
  )
}

function RequireSignIn() {
  const { state } = useDemo()
  const loc = useLocation()
  if (!state.entered) return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname)}`} replace />
  return <PortalShell />
}

export default function PortalApp() {
  return (
    <Routes>
      <Route element={<RequireSignIn />}>
        <Route index element={<PortalHome />} />
        <Route path="giving" element={<PortalGiving />} />
        <Route path="events" element={<PortalEvents />} />
        <Route path="groups" element={<PortalGroups />} />
        <Route path="care" element={<PortalCare />} />
        <Route path="profile" element={<PortalProfile />} />
        <Route path="*" element={<PortalHome />} />
      </Route>
    </Routes>
  )
}
