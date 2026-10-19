import { Lock, HeartHandshake, Phone, Flame } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { useDemo } from '@/data/store'
import { uid } from '@/data/ids'
import { todayIso } from '@/data/dates'
import { church } from '@/config/site'
import { PageHero, Container, Eyebrow, Art } from '../ui'
import { SiteForm, F, Check } from '../forms'

export default function Prayer() {
  useDocumentMeta('Prayer Requests | New Life Deliverance Tabernacle', 'Send a confidential prayer request to the pastors and prayer team of New Life Deliverance Tabernacle in Richmond, VA.')
  const { upsert, log } = useDemo()
  return (
    <>
      <PageHero eyebrow="Prayer" title="You do not have to carry it alone." image="open-bible-light" text="Share what is on your heart. The pastors and prayer team will lift you up by name." />
      <section className="bg-linen py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Eyebrow>Philippians 4:6</Eyebrow>
            <p className="mt-4 font-display text-3xl sm:text-4xl leading-snug">“Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.”</p>
            <ul className="mt-10 space-y-5">
              <li className="flex gap-4"><Lock className="text-gold shrink-0" /><div><p className="font-semibold">Confidential when you need it</p><p className="text-sm text-slate">Mark your request private and only the pastors will see it.</p></div></li>
              <li className="flex gap-4"><HeartHandshake className="text-gold shrink-0" /><div><p className="font-semibold">Pastoral follow-up</p><p className="text-sm text-slate">Ask for a call and a pastor or deacon will reach out. Counseling is available Tuesdays 5 to 7 PM.</p></div></li>
              <li className="flex gap-4"><Phone className="text-gold shrink-0" /><div><p className="font-semibold">Prefer to talk?</p><p className="text-sm text-slate">Call the church office at <a className="font-semibold text-plum underline" href={church.phoneHref}>{church.phone}</a>.</p></div></li>
            </ul>
            <div className="mt-10 rounded-3xl border border-plum/15 bg-royal-50 p-5 text-sm text-midnight">
              <p className="font-semibold flex items-center gap-2"><Flame size={16} className="text-plum" /> If you are in crisis right now</p>
              <p className="mt-1 text-slate">Call or text <strong className="text-midnight">988</strong> (Suicide & Crisis Lifeline) any time, day or night. In an emergency, call <strong className="text-midnight">911</strong>.</p>
            </div>
          </div>
          <div className="relative">
            <Art name="stained-light-texture" alt="" className="absolute -inset-4 rounded-[40px] opacity-30 hidden lg:block" />
            <div className="relative rounded-[32px] bg-paper border border-line shadow-lift p-6 sm:p-9">
              <h2 className="font-display text-4xl font-semibold">Send a prayer request</h2>
              <p className="mt-2 text-slate mb-6">Only your first name is required.</p>
              <SiteForm name={church.formNames.prayer} submitLabel="Send my request" success={{ title: 'We are praying with you.', text: 'Your request reached the prayer team. If you asked for a call, expect one within two business days.' }}
                onSubmitted={(d) => { upsert('care', { id: uid('cr'), kind: d.call === 'yes' ? 'pastoral' : 'prayer', name: d.name || 'Friend', contact: d.phone || d.email || '', text: d.request || '', confidential: d.private === 'yes', status: 'new', date: todayIso(), updates: [] }); log(d.name || 'Website visitor', 'Sent a prayer request', d.private === 'yes' ? 'Confidential' : 'Prayer team') }}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <F label="First name" name="name" required autoComplete="given-name" />
                  <F label="Phone" name="phone" type="tel" autoComplete="tel" hint="(optional)" />
                  <F label="Email" name="email" type="email" autoComplete="email" hint="(optional)" className="sm:col-span-2" />
                  <F label="How can we pray for you?" name="request" as="textarea" required rows={5} className="sm:col-span-2" />
                </div>
                <Check name="private" label="Keep this private: pastors only." />
                <Check name="call" label="Please call me. I would like to talk with a pastor." />
              </SiteForm>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
