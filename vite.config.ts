/// <reference types="vitest" />
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

/**
 * Public address. Lives in ONE place: site.config.json.
 * Every canonical tag, link-preview tag, sitemap entry and robots.txt line is built from it,
 * so a link texted or posted anywhere always shows and opens this exact address.
 */
const SITE_URL: string = JSON.parse(readFileSync(new URL('./site.config.json', import.meta.url), 'utf8')).url.replace(/\/+$/, '')
const SITE_HOST = new URL(SITE_URL).host

type PageMeta = {
  /** Route path, no trailing slash except root */
  path: string
  /** Output HTML file in dist ('index.html' for root) */
  file: string
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  image: string
  imageAlt: string
  index: boolean
  sitemapPriority?: number
}

const siteImage = '/og-image.png'
const centerImage = '/og-center.png'
const connectImage = '/og-connect.png'

/** Link previews per shareable page. Deep links fall back to their section's page. */
const pages: PageMeta[] = [
  { path: '/', file: 'index.html', title: 'New Life Deliverance Tabernacle | Spirit-filled church in South Richmond, VA', description: 'Worship with New Life Deliverance Tabernacle at 900 Decatur St, Richmond VA. Sunday worship 9:45 AM, Tuesday Bible study, free FeedMore groceries, after-school tutoring and community programs.', ogTitle: 'New Life Deliverance Tabernacle | Who the Son sets free is free indeed', ogDescription: 'Sunday worship 9:45 AM at 900 Decatur St, South Richmond. Bible study, free groceries, after-school tutoring and a church family that will know your name.', image: siteImage, imageAlt: 'New Life Deliverance Tabernacle, 900 Decatur Street, Richmond, Virginia. Who the Son sets free is free indeed.', index: true, sitemapPriority: 1.0 },
  { path: '/visit', file: 'visit.html', title: 'Plan Your Visit | New Life Deliverance Tabernacle', description: 'Your first Sunday at New Life: service times, parking, what to expect, kids and youth, directions to 900 Decatur St and free rides.', ogTitle: 'Plan your first visit to New Life', ogDescription: 'Sunday worship 9:45 AM at 900 Decatur St. Here is what to expect, where to park and how to get a free ride.', image: siteImage, imageAlt: 'New Life Deliverance Tabernacle, 900 Decatur Street, Richmond, Virginia. Who the Son sets free is free indeed.', index: true, sitemapPriority: 0.9 },
  { path: '/about', file: 'about.html', title: 'About Us, Our Pastors and History | New Life Deliverance Tabernacle', description: 'Founded in 1997 out of a recovery support group, New Life Deliverance Tabernacle has served South Richmond for decades under Rev. Dr. Robert A. Winfree.', ogTitle: 'About New Life Deliverance Tabernacle', ogDescription: 'From a recovery support group to a church and community center serving South Richmond. Meet the pastors and leaders.', image: siteImage, imageAlt: 'New Life Deliverance Tabernacle, 900 Decatur Street, Richmond, Virginia. Who the Son sets free is free indeed.', index: true, sitemapPriority: 0.8 },
  { path: '/ministries', file: 'ministries.html', title: 'Ministries | New Life Deliverance Tabernacle', description: 'Music, deacons, ushers, culinary arts, bereavement, media, transportation, men, women, youth and more. Find your place to serve at New Life.', ogTitle: 'Find your place at New Life', ogDescription: 'Twenty ministries, one church family. Music, ushers, culinary arts, youth, outreach and more.', image: siteImage, imageAlt: 'New Life Deliverance Tabernacle, 900 Decatur Street, Richmond, Virginia. Who the Son sets free is free indeed.', index: true, sitemapPriority: 0.8 },
  { path: '/community', file: 'community.html', title: 'New Life Community Center | Food, After-School and Programs in South Richmond', description: 'Free FeedMore groceries Wednesdays and Saturdays, after-school tutoring Mondays and Wednesdays, counseling, rides and Community Conversations at 900 Decatur St.', ogTitle: 'New Life Community Center', ogDescription: 'Free groceries Wed and Sat, after-school tutoring Mon and Wed, counseling and Community Conversations in South Richmond.', image: centerImage, imageAlt: 'New Life Community Center: food distribution, after-school and community programs in South Richmond.', index: true, sitemapPriority: 0.9 },
  { path: '/events', file: 'events.html', title: 'Events | New Life Deliverance Tabernacle', description: 'Worship, Bible study, food distribution, after-school, Community Conversations and special events at New Life Deliverance Tabernacle.', ogTitle: 'What is happening at New Life', ogDescription: 'Worship, Bible study, Community Conversations, food distribution and special events.', image: siteImage, imageAlt: 'New Life Deliverance Tabernacle, 900 Decatur Street, Richmond, Virginia. Who the Son sets free is free indeed.', index: true, sitemapPriority: 0.7 },
  { path: '/watch', file: 'watch.html', title: 'Watch Live | New Life Deliverance Tabernacle', description: 'Worship with New Life live on Facebook every Sunday at 9:45 AM.', ogTitle: 'Watch New Life live on Sunday', ogDescription: 'Sunday worship streams live at 9:45 AM.', image: siteImage, imageAlt: 'New Life Deliverance Tabernacle, 900 Decatur Street, Richmond, Virginia. Who the Son sets free is free indeed.', index: true, sitemapPriority: 0.6 },
  { path: '/give', file: 'give.html', title: 'Give | New Life Deliverance Tabernacle', description: 'Give securely to New Life Deliverance Tabernacle and New Life Community Center: tithes, building fund, food pantry, after-school and benevolence.', ogTitle: 'Give to New Life', ogDescription: 'Every gift feeds families, mentors young people and keeps the doors open at 900 Decatur St.', image: siteImage, imageAlt: 'New Life Deliverance Tabernacle, 900 Decatur Street, Richmond, Virginia. Who the Son sets free is free indeed.', index: true, sitemapPriority: 0.7 },
  { path: '/prayer', file: 'prayer.html', title: 'Prayer Requests | New Life Deliverance Tabernacle', description: 'Send a confidential prayer request to the pastors and prayer team at New Life.', ogTitle: 'Send a prayer request', ogDescription: 'You do not have to carry it alone. The pastors and prayer team will pray with you.', image: siteImage, imageAlt: 'New Life Deliverance Tabernacle, 900 Decatur Street, Richmond, Virginia. Who the Son sets free is free indeed.', index: true, sitemapPriority: 0.6 },
  { path: '/life-events', file: 'life-events.html', title: 'Baptisms, Weddings, Dedications and Homegoing Services | New Life Deliverance Tabernacle', description: 'Request a baptism, wedding, baby dedication, homegoing service or facility use at New Life.', ogTitle: 'Life events at New Life', ogDescription: 'Baptisms, weddings, baby dedications and homegoing services.', image: siteImage, imageAlt: 'New Life Deliverance Tabernacle, 900 Decatur Street, Richmond, Virginia. Who the Son sets free is free indeed.', index: true, sitemapPriority: 0.5 },
  { path: '/contact', file: 'contact.html', title: 'Contact | New Life Deliverance Tabernacle, 900 Decatur St, Richmond VA', description: 'Call (804) 233-2730, email or visit New Life at 900 Decatur Street, Richmond, VA 23224.', ogTitle: 'Contact New Life', ogDescription: '900 Decatur St, Richmond VA 23224 · (804) 233-2730', image: siteImage, imageAlt: 'New Life Deliverance Tabernacle, 900 Decatur Street, Richmond, Virginia. Who the Son sets free is free indeed.', index: true, sitemapPriority: 0.6 },
  { path: '/privacy', file: 'privacy.html', title: 'Privacy Policy | New Life Deliverance Tabernacle', description: 'How New Life Deliverance Tabernacle and New Life Community Center collect, use and protect your information.', ogTitle: 'Privacy Policy | New Life Deliverance Tabernacle', ogDescription: 'How we collect, use and protect your information.', image: siteImage, imageAlt: 'New Life Deliverance Tabernacle, 900 Decatur Street, Richmond, Virginia. Who the Son sets free is free indeed.', index: true, sitemapPriority: 0.2 },
  { path: '/terms', file: 'terms.html', title: 'Terms of Use | New Life Deliverance Tabernacle', description: 'Terms of use for the New Life Deliverance Tabernacle website and New Life Connect.', ogTitle: 'Terms of Use | New Life Deliverance Tabernacle', ogDescription: 'Terms of use for this website and New Life Connect.', image: siteImage, imageAlt: 'New Life Deliverance Tabernacle, 900 Decatur Street, Richmond, Virginia. Who the Son sets free is free indeed.', index: true, sitemapPriority: 0.2 },
  { path: '/login', file: 'login.html', title: 'Sign in | New Life Connect', description: 'Sign in to New Life Connect, the member portal and staff hub of New Life Deliverance Tabernacle.', ogTitle: 'New Life Connect', ogDescription: 'The member portal and staff hub of New Life Deliverance Tabernacle.', image: connectImage, imageAlt: 'New Life Connect: member portal and staff hub. Powered by ChurchConnect by DataIsData.', index: false },
  { path: '/portal', file: 'portal.html', title: 'Member Portal | New Life Connect', description: 'Giving history and statements, event registrations, ministries and prayer requests for members of New Life Deliverance Tabernacle.', ogTitle: 'New Life Connect member portal', ogDescription: 'Giving, statements, events, ministries and prayer requests in one place.', image: connectImage, imageAlt: 'New Life Connect member portal.', index: false },
  { path: '/admin', file: 'admin.html', title: 'Staff Hub | New Life Connect', description: 'Members, giving, ministries, outreach, the Grant Advisor and AI agents for the leaders of New Life Deliverance Tabernacle.', ogTitle: 'New Life Connect staff hub', ogDescription: 'Members, giving, ministries, outreach, the Grant Advisor and AI agents in one place.', image: connectImage, imageAlt: 'New Life Connect staff hub with the Grant Advisor.', index: false },
]

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function render(template: string, p: PageMeta): string {
  const url = p.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${p.path}`
  const map: Record<string, string> = {
    '__PAGE_TITLE__': esc(p.title),
    '__PAGE_DESC__': esc(p.description),
    '__PAGE_ROBOTS__': p.index ? 'index, follow' : 'noindex, follow',
    '__PAGE_URL__': url,
    '__PAGE_OG_TITLE__': esc(p.ogTitle),
    '__PAGE_OG_DESC__': esc(p.ogDescription),
    '__PAGE_IMAGE__': `${SITE_URL}${p.image}`,
    '__PAGE_IMAGE_ALT__': esc(p.imageAlt),
    '__SITE_HOST__': SITE_HOST,
  }
  let out = template
  for (const [k, v] of Object.entries(map)) out = out.split(k).join(v)
  const left = out.match(/__(?:PAGE_[A-Z_]+|SITE_HOST)__/)
  if (left) throw new Error(`site-meta: unreplaced token ${left[0]}`)
  return out
}

function siteMeta(): Plugin {
  let template = ''
  let outDir = 'dist'
  return {
    name: 'site-meta',
    configResolved(c) { outDir = resolve(c.root, c.build.outDir) },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        template = html
        return render(html, pages[0])
      },
    },
    closeBundle() {
      if (!template) return
      for (const p of pages.slice(1)) {
        const f = resolve(outDir, p.file)
        mkdirSync(dirname(f), { recursive: true })
        writeFileSync(f, render(template, p))
      }
      const today = new Date().toISOString().slice(0, 10)
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
        .filter((p) => p.index)
        .map((p) => `  <url><loc>${p.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${p.path}`}</loc><lastmod>${today}</lastmod><priority>${(p.sitemapPriority ?? 0.5).toFixed(1)}</priority></url>`)
        .join('\n')}\n</urlset>\n`
      writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap)
      writeFileSync(resolve(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
    },
  }
}

export default defineConfig({
  plugins: [react(), siteMeta()],
  define: {
    __SITE_URL__: JSON.stringify(SITE_URL),
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
