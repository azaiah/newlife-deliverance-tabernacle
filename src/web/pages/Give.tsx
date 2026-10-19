import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Repeat, Lock, CheckCircle2, Smartphone, Mail, Building, HandCoins, Loader2, Info } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { useDemo } from '@/data/store'
import { uid } from '@/data/ids'
import { todayIso } from '@/data/dates'
import { church } from '@/config/site'
import { PageHero, Container, SectionHeading, Art, Eyebrow } from '../ui'
import { Stagger, item } from '../motion'

const presets = [25, 50, 100, 250, 500]
const money = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: n % 1 ? 2 : 0 })

export default function Give() {
  useDocumentMeta('Give | New Life Deliverance Tabernacle', 'Give securely to New Life Deliverance Tabernacle and New Life Community Center: tithes and offerings, building fund, food pantry, after-school programs and benevolence.')
  const { state, upsert, log } = useDemo()
  const [params] = useSearchParams()
  const funds = state.funds
  const initialFund = funds.some((f) => f.id === params.get('fund')) ? params.get('fund')! : 'f_general'
  const [fundId, setFundId] = useState(initialFund)
  const [amount, setAmount] = useState(50)
  const [custom, setCustom] = useState('')
  const [recurring, setRecurring] = useState(false)
  const [freq, setFreq] = useState<'weekly' | 'monthly'>('monthly')
  const [cover, setCover] = useState(true)
  const [step, setStep] = useState<'form' | 'paying' | 'done'>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const value = custom ? Math.max(0, Number(custom)) : amount
  const fee = cover ? Math.round((value * 0.029 + 0.3) * 100) / 100 : 0
  const total = value + fee
  const fund = funds.find((f) => f.id === fundId)
  const raised = useMemo(() => state.gifts.filter((g) => g.fundId === fundId).reduce((s, g) => s + g.amount, 0), [state.gifts, fundId])

  function submit(e: React.FormEvent) {
    e.preventDefault(); if (value < 1) return
    setStep('paying')
    window.setTimeout(() => {
      upsert('gifts', { id: uid('g'), donorName: name || 'Online donor', amount: total, fundId, method: 'online', date: todayIso(), status: 'recorded', recurring })
      log(name || 'Online donor', `Gave online${recurring ? ` (${freq})` : ''}`, `${money(total)} to ${fund?.name}`)
      setStep('done')
    }, 1400)
  }

  return (
    <>
      <PageHero eyebrow="Give" title="Sow a seed. Watch what God grows." image="seed-of-faith" text="Every gift feeds families, mentors young people and keeps the doors open at 900 Decatur Street." />
      <section className="relative bg-linen py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
          <div className="order-2 lg:order-1">
            <SectionHeading eyebrow="Where your gift goes" title="Choose what you want to grow." />
            <Stagger className="mt-8 grid gap-3 sm:grid-cols-2">
              {funds.map((f) => {
                const sum = state.gifts.filter((g) => g.fundId === f.id).reduce((s, g) => s + g.amount, 0)
                const pct = f.goal ? Math.min(100, Math.round((sum / f.goal) * 100)) : null
                const on = f.id === fundId
                return (
                  <motion.button variants={item} type="button" key={f.id} onClick={() => setFundId(f.id)} aria-pressed={on} className={`text-left rounded-3xl border-2 p-5 transition ${on ? 'border-plum bg-paper shadow-lift' : 'border-line bg-paper/70 hover:border-plum/40'}`}>
                    <div className="flex items-start justify-between gap-3"><h3 className="font-display text-2xl font-semibold leading-tight">{f.name}</h3>{on && <CheckCircle2 className="text-plum shrink-0" size={22} />}</div>
                    <p className="mt-2 text-sm text-slate leading-relaxed">{f.description}</p>
                    {pct !== null && <div className="mt-4"><div className="h-2 rounded-full bg-line overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-gold-bright to-plum" style={{ width: `${pct}%` }} /></div><p className="mt-1.5 text-xs text-slate">{pct}% of {money(f.goal!)} goal</p></div>}
                  </motion.button>
                )
              })}
            </Stagger>
          </div>

          <div className="order-1 lg:order-2 lg:sticky lg:top-24 rounded-[32px] bg-paper border border-line shadow-lift overflow-hidden">
            <div className="relative isolate bg-midnight text-white px-6 py-5 grain">
              <Art name="radiance-wide" alt="" className="absolute inset-0 -z-10 opacity-40" />
              <p className="font-caps text-xs tracking-[0.22em] text-gold-light">Giving to</p>
              <p className="font-display text-2xl font-semibold mt-1">{fund?.name}</p>
              {fund?.goal && <p className="text-xs text-white/60 mt-1">{money(raised)} given online so far</p>}
            </div>
            <AnimatePresence mode="wait">
              {step === 'done' ? (
                <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center" role="status">
                  <CheckCircle2 size={52} className="mx-auto text-gold" />
                  <h3 className="mt-4 font-display text-3xl font-semibold">Thank you{name ? `, ${name.split(' ')[0]}` : ''}.</h3>
                  <p className="mt-2 text-slate">Your {recurring ? `${freq} ` : ''}gift of {money(total)} to {fund?.name} was received. A receipt is on its way{email ? ` to ${email}` : ''}.</p>
                  <p className="mt-4 text-xs text-slate rounded-2xl bg-linen p-3">Demo: no card was charged. The gift now appears in the staff hub under Giving.</p>
                  <button type="button" onClick={() => { setStep('form'); setCustom('') }} className="mt-6 font-semibold text-plum underline underline-offset-4 min-h-[44px]">Give again</button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} className="p-6 grid gap-5">
                  <div className="grid grid-cols-2 gap-1 rounded-full bg-linen p-1" role="group" aria-label="Gift frequency">
                    <button type="button" aria-pressed={!recurring} onClick={() => setRecurring(false)} className={`rounded-full min-h-[44px] font-semibold text-sm ${!recurring ? 'bg-paper shadow-card text-plum' : 'text-slate'}`}>One time</button>
                    <button type="button" aria-pressed={recurring} onClick={() => setRecurring(true)} className={`rounded-full min-h-[44px] font-semibold text-sm inline-flex items-center justify-center gap-1.5 ${recurring ? 'bg-paper shadow-card text-plum' : 'text-slate'}`}><Repeat size={14} /> Recurring</button>
                  </div>
                  {recurring && <div className="flex gap-2">{(['weekly', 'monthly'] as const).map((f) => <button type="button" key={f} aria-pressed={freq === f} onClick={() => setFreq(f)} className={`flex-1 rounded-2xl border min-h-[44px] text-sm font-semibold capitalize ${freq === f ? 'border-plum text-plum bg-royal-50' : 'border-line text-slate'}`}>{f}</button>)}</div>}
                  <div>
                    <p className="text-sm font-semibold mb-2">Amount</p>
                    <div className="grid grid-cols-3 gap-2">
                      {presets.map((p) => <button type="button" key={p} aria-pressed={!custom && amount === p} onClick={() => { setAmount(p); setCustom('') }} className={`rounded-2xl border-2 min-h-[52px] font-semibold ${!custom && amount === p ? 'border-plum bg-plum text-white' : 'border-line hover:border-plum/40'}`}>${p}</button>)}
                      <label className="relative"><span className="sr-only">Other amount</span><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate">$</span><input inputMode="decimal" value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^0-9.]/g, ''))} placeholder="Other" className={`w-full rounded-2xl border-2 min-h-[52px] pl-7 pr-2 font-semibold ${custom ? 'border-plum' : 'border-line'}`} /></label>
                    </div>
                  </div>
                  <label className="flex items-start gap-3 text-sm text-slate cursor-pointer"><input type="checkbox" checked={cover} onChange={(e) => setCover(e.target.checked)} className="mt-0.5 h-5 w-5 accent-[#4B2A7B]" /><span>Add {money(fee || Math.round((value * 0.029 + 0.3) * 100) / 100)} so 100% of my gift reaches the ministry.</span></label>
                  <div className="grid gap-3">
                    <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name" aria-label="Full name" autoComplete="name" className="rounded-2xl border border-line px-4 min-h-[52px]" />
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email for your receipt" aria-label="Email for your receipt" autoComplete="email" className="rounded-2xl border border-line px-4 min-h-[52px]" />
                  </div>
                  <button type="submit" disabled={value < 1 || step === 'paying'} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#E8CC85] to-gold-bright text-midnight font-bold min-h-[56px] glow-gold disabled:opacity-50">
                    {step === 'paying' ? <><Loader2 size={18} className="animate-spin" /> Processing</> : <><Lock size={16} /> Give {money(total)}{recurring ? ` ${freq}` : ''}</>}
                  </button>
                  <p className="text-xs text-slate flex gap-2"><Info size={14} className="shrink-0 mt-0.5" /> Demo checkout: card entry happens on the payment processor’s secure page once the church connects one. Nothing is charged here.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Container>
      </section>

      <section id="ways" className="bg-paper py-20 sm:py-24 scroll-mt-20">
        <Container>
          <SectionHeading eyebrow="Other ways to give" title="However you give, thank you." center />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: HandCoins, t: 'In person', d: 'During Sunday worship at 9:45 AM. Offering envelopes are at every door.' },
              { i: Mail, t: 'By mail', d: <>Mail a check to {church.name}, {church.address}, {church.city}, {church.state} {church.zip}.</> },
              { i: Smartphone, t: 'Text to give', d: 'Coming soon: give from your phone with a simple text.' },
              { i: Building, t: 'Businesses & foundations', d: <>Sponsor a program at the Community Center (501(c)(3), EIN {church.centerEin}).</> },
            ].map((w) => (
              <div key={w.t} className="rounded-3xl border border-line bg-linen p-6"><w.i className="text-gold" size={26} /><h3 className="mt-3 font-display text-2xl font-semibold">{w.t}</h3><p className="mt-2 text-sm text-slate leading-relaxed">{w.d}</p></div>
            ))}
          </div>
          <div className="mt-12 rounded-[28px] bg-midnight text-white p-8 sm:p-10 text-center">
            <Eyebrow light className="justify-center">Malachi 3:10</Eyebrow>
            <p className="mt-4 font-display text-3xl sm:text-4xl leading-snug max-w-3xl mx-auto">“Bring ye all the tithes into the storehouse… and prove me now herewith, saith the Lord of hosts.”</p>
          </div>
          <p className="mt-6 text-center text-xs text-slate">Gifts to the church and to New Life Community Center are tax-deductible to the extent allowed by law. Year-end statements are available from the church office.</p>
        </Container>
      </section>
    </>
  )
}
