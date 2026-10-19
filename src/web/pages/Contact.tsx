import { Phone, Mail, MapPin, Clock, Facebook, Navigation } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { useDemo } from '@/data/store'
import { uid } from '@/data/ids'
import { todayIso } from '@/data/dates'
import { church, officeHours } from '@/config/site'
import { PageHero, GoldButton, GlassButton } from '../ui'
import { SiteForm, F, Check } from '../forms'

export default function Contact() {
  useDocumentMeta('Contact | New Life Deliverance Tabernacle, 900 Decatur St, Richmond VA', 'Call (804) 233-2730, email or visit New Life Deliverance Tabernacle at 900 Decatur Street, Richmond, VA 23224. Office hours and directions.')
  const { upsert, log } = useDemo()
  const rows = [
    { i: Phone, l: 'Call', v: church.phone, href: church.phoneHref },
    { i: Mail, l: 'Email the church', v: church.email, href: `mailto:${church.email}` },
    { i: Mail, l: 'Email the Community Center', v: church.centerEmail, href: `mailto:${church.centerEmail}` },
    { i: MapPin, l: 'Visit', v: `${church.address}, ${church.city}, ${church.state} ${church.zip}`, href: church.mapsUrl },
    { i: Facebook, l: 'Facebook', v: 'facebook.com/newlifenldt', href: church.facebook },
  ]
  return (
    <>
      <PageHero eyebrow="Contact" title="We would love to hear from you." image="exterior-twilight" text={`${church.address} in ${church.neighborhood}. Doors open Sundays at 9:45 AM.`}>
        <GoldButton href={church.phoneHref} icon={<Phone size={16} />}>Call {church.phone}</GoldButton>
        <GlassButton href={church.directionsUrl} icon={<Navigation size={16} />}>Get directions</GlassButton>
      </PageHero>
      <section className="bg-linen py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-6 content-start">
            <ul className="grid gap-3">
              {rows.map((r) => (
                <li key={r.l}><a href={r.href} target={r.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="flex items-center gap-4 rounded-3xl border border-line bg-paper p-4 sm:p-5 hover:border-plum/40 hover:shadow-card transition">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-midnight text-gold-light"><r.i size={20} /></span>
                  <span className="min-w-0"><span className="block text-sm text-slate">{r.l}</span><span className="block font-semibold break-words">{r.v}</span></span>
                </a></li>
              ))}
            </ul>
            <div className="rounded-3xl border border-line bg-paper p-6">
              <p className="font-semibold flex items-center gap-2"><Clock size={18} className="text-gold" /> Building hours</p>
              <dl className="mt-3 grid gap-2 text-sm">{officeHours.map((o) => <div key={o.d} className="flex justify-between gap-4 border-b border-line/70 pb-2 last:border-0"><dt className="text-slate">{o.d}</dt><dd className="font-semibold text-right">{o.h}</dd></div>)}</dl>
            </div>
            <div className="overflow-hidden rounded-3xl border border-line aspect-[4/3] bg-parchment">
              <iframe title="Map to New Life Deliverance Tabernacle" src="https://www.google.com/maps?q=900+Decatur+St,+Richmond,+VA+23224&output=embed" className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
          <div className="rounded-[32px] bg-paper border border-line shadow-lift p-6 sm:p-9 h-fit">
            <h2 className="font-display text-4xl font-semibold">Send a message</h2>
            <p className="mt-2 mb-6 text-slate">The church office replies within two business days.</p>
            <SiteForm name={church.formNames.contact} submitLabel="Send message" success={{ title: 'Message sent.', text: 'Thank you for reaching out. The church office will reply within two business days.' }}
              onSubmitted={(d) => { upsert('tasks', { id: uid('t'), title: `Reply to ${d.name}: ${d.subject || 'website message'}`, assigneeId: 'm_3', due: todayIso(), status: 'todo', module: 'office', priority: 'normal' }); log(d.name || 'Website visitor', 'Sent a message from the website', d.subject || 'General') }}>
              <div className="grid gap-4 sm:grid-cols-2">
                <F label="Your name" name="name" required autoComplete="name" />
                <F label="Email" name="email" type="email" required autoComplete="email" />
                <F label="Phone" name="phone" type="tel" autoComplete="tel" hint="(optional)" />
                <F label="Subject" name="subject" as="select" required options={['General question', 'Planning a visit', 'Volunteering', 'Community Center programs', 'Partnership or sponsorship', 'Media or press', 'Something else']} />
                <F label="Message" name="message" as="textarea" required rows={5} className="sm:col-span-2" />
              </div>
              <Check name="updates" label="Send me occasional news and event updates from New Life." />
            </SiteForm>
          </div>
        </div>
      </section>
    </>
  )
}
