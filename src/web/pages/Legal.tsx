import type { ReactNode } from 'react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { church } from '@/config/site'
import { Container } from '../ui'

// TODO: confirm with church — have the church's counsel review both policies before launch.
const UPDATED = 'October 19, 2026'

function Policy({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <section className="bg-midnight text-white pt-36 pb-14 grain"><Container><p className="font-caps text-xs tracking-[0.28em] text-gold-light">Last updated {UPDATED}</p><h1 className="display text-5xl sm:text-6xl mt-4">{title}</h1></Container></section>
      <section className="bg-linen py-16"><Container><div className="max-w-3xl space-y-6 text-[17px] leading-relaxed text-midnight [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:mt-10 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:text-plum [&_a]:underline">{children}</div></Container></section>
    </>
  )
}

export function Privacy() {
  useDocumentMeta('Privacy Policy | New Life Deliverance Tabernacle', 'How New Life Deliverance Tabernacle and New Life Community Center collect, use and protect your information.')
  return (
    <Policy title="Privacy Policy">
      <p>{church.name} and {church.centerName} (“we”) respect your privacy. This policy explains what we collect through this website and the New Life Connect member and staff hub, and how we use it.</p>
      <h2>What we collect</h2>
      <ul><li>Information you send us in forms: your name, phone, email, prayer requests, help requests, event registrations and visit plans.</li><li>Giving records: amount, fund and date. Card and bank details are handled by our payment processor and never stored by us.</li><li>Basic, anonymous site usage to improve the website.</li></ul>
      <h2>How we use it</h2>
      <ul><li>To respond to you, follow up on requests and provide pastoral care.</li><li>To send giving receipts and year-end statements.</li><li>To share church news, only if you ask us to.</li></ul>
      <h2>Prayer and care requests</h2>
      <p>Requests marked private are visible only to the pastors. Care and help requests are seen only by the leaders assigned to follow up.</p>
      <h2>Sharing</h2>
      <p>We do not sell or rent your information. We share it only with service providers who help us run the website, giving and communications, or when required by law.</p>
      <h2>Your choices</h2>
      <p>You may ask us to update or delete your information or stop sending messages at any time: call {church.phone} or email <a href={`mailto:${church.email}`}>{church.email}</a>.</p>
      <h2>Children</h2>
      <p>This website is not directed to children under 13. Youth program registrations are completed by a parent or guardian.</p>
    </Policy>
  )
}

export function Terms() {
  useDocumentMeta('Terms of Use | New Life Deliverance Tabernacle', 'Terms of use for the New Life Deliverance Tabernacle website and New Life Connect.')
  return (
    <Policy title="Terms of Use">
      <p>By using this website you agree to these terms. If you do not agree, please do not use the site.</p>
      <h2>Use of the site</h2>
      <p>Use the site and New Life Connect only for lawful purposes and in a way that respects others. Do not try to access accounts or information that are not yours.</p>
      <h2>Gifts</h2>
      <p>Gifts are voluntary contributions to {church.name} or {church.centerName} and are generally not refundable. If you believe a gift was made in error, contact the church office within 30 days.</p>
      <h2>Content</h2>
      <p>Photos, text and media on this site belong to {church.name} or are used with permission. Please ask before reusing them.</p>
      <h2>Links</h2>
      <p>We link to other sites, such as Facebook and Google Maps, for convenience. We are not responsible for their content or policies.</p>
      <h2>Contact</h2>
      <p>{church.name}, {church.address}, {church.city}, {church.state} {church.zip}. {church.phone}.</p>
    </Policy>
  )
}
