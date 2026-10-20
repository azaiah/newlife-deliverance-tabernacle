# New Life Deliverance Tabernacle: website + New Life Connect

A full redesign of newlifedeliverancetabernacle.us plus **New Life Connect**, a custom member portal and staff hub built on ChurchConnect by DataIsData. It includes demo single sign-on with the church's real leaders, and an AI **Grant Advisor** that finds funding for the church and the New Life Community Center.

Stack: Vite 5, React 18, TypeScript (strict), Tailwind 3, framer-motion, lucide-react, react-router 6. Fonts are self-hosted (Cormorant Garamond, Cinzel, Plus Jakarta Sans). There are no external scripts.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then builds to dist/
```

`predev` and `prebuild` run `scripts/fetch-church-photos.mjs`. It downloads the church's own 95 photos from their current site's image host into `public/images/church/` so the new site hosts them itself. It skips files that already exist. If the network is unavailable it warns and the site shows branded emblem placeholders. Run `npm run photos` any time to retry.

**Commit the downloaded photos to GitHub** after the first successful `npm run dev`. The site then never depends on the old host.

## Responsive behavior and media notes

- **Chain-break scroll film.** `public/video/chain/` holds 72 pre-rendered WebP frames per set (`dNN` desktop, `mNN` portrait/phone). `src/web/home/Freedom.tsx` draws them to a canvas as the visitor scrolls. Reduced-motion users and windows shorter than 520px get a static version.
- **Pinned scenes fall back gracefully.** `src/web/useFits.ts` turns pinned scroll scenes off on short or narrow windows. The history timeline becomes a native swipe scroller and Freedom becomes a static section, so nothing is cut off at any size.
- **Photos.** Screenshot borders and phone UI baked into some originals were trimmed in `public/images/church/`. Commit the cleaned files; `npm run photos` skips files that already exist.
- **Link previews.** The public address lives only in `site.config.json` (`https://newlife-deliverance-tabernacle.netlify.app`). Every page's canonical tag, `og:url`, sitemap and preview image is built from it, and Netlify's hashed deploy addresses redirect to it.
- Audited at 320, 390, 768, 1008, 1024, 1280, 1512 and 1920 px wide for overlapping text, clipped text, broken images and horizontal overflow.

## Deploy (Netlify)

1. Put the real address in **`site.config.json`** (it is the only place it lives). It is currently `https://newlife-deliverance-tabernacle.netlify.app`. Change it to the actual Netlify name or the church's domain **before the first deploy**. Canonical tags, link-preview cards, `sitemap.xml`, `robots.txt` and the structured data all build from it.
2. Push to GitHub and connect the repo in Netlify. `netlify.toml` already sets the build command, publish folder, per-page preview rewrites and security headers.
3. Netlify Forms picks up these forms automatically: `nldt-contact`, `nldt-prayer`, `nldt-help`, `nldt-visit`, `nldt-volunteer`. In Netlify, set the form notification emails to the church office.

## What is where

| Route | What it is |
|---|---|
| `/` | Home. Sanctuary video hero, the weekly rhythm, the "chains to freedom" scroll story, the pastors, Theme 2026, a history timeline, ministries, gallery, Watch & Give, and the visit band with a map |
| `/visit` | First-time guest path. Plan-a-visit form, free ride request, FAQ, directions |
| `/about` | Mission and vision, pastors, full bios, history and leaders |
| `/ministries` | Finder for 20 ministries with a contact form for each leader |
| `/community` | New Life Community Center programs, the Get Help form, partners, and a "for grant makers" panel with the EIN |
| `/events`, `/watch`, `/give`, `/prayer`, `/life-events`, `/contact`, `/privacy`, `/terms` | Events (with register and add-to-calendar), Facebook Live, give (demo checkout), prayer, life events, contact |
| `/login` | Simulated single sign-on (Google, Microsoft, Apple, email link) followed by a clearly labeled demo account picker |
| `/portal` | Member portal. Sign in as **Angela Brooks** (a sample member) to see it fully populated |
| `/admin` | Staff hub with every ChurchConnect module, plus **Outreach & Center** and the **Grant Advisor** |

Everything shares one data store saved in the browser (`nldt-connect-demo-v1`). For example:
- A prayer request on the website shows up in the pastors' care queue.
- A gift lands in Finance.
- A help request reaches the outreach deacons.
- A pantry count feeds the grant letters.

## Demo sign-in accounts

The leaders are the people New Life lists publicly on its own site, shown with the church's own titles. To keep the demo honest:
- Leaders get **no invented giving or care records**.
- Leaders' personal emails from the old site are **not** republished. Demo addresses use a non-routable domain.
- The Finance Office, Church Office and Angela Brooks are labeled **Sample**.

| Account | Lands on |
|---|---|
| Rev. Dr. Robert A. Winfree, Founder & Senior Pastor | Dashboard |
| Rev. Michael L. Winfree, Pastor | Dashboard |
| Rev. Phyllis D. Alexander, Church Administrator | Action Center (and the Grant Advisor) |
| Deacon Shelby Vincent (Diaconate), Deacon Tashabe Jackson (Outreach), Deacon Landis Mathews (Transportation) | Their ministry or outreach tab |
| Min. Kevin Dixon (Music), Walter Fenner (Culinary Arts), Robin Chaney (Bereavement), Sandra Sykes (Extended Programs) | Their ministry or after-school |
| Yolanda Jacobus (Ushers) | Serving schedule |
| Angela Brooks (sample member) | Member portal |
| DataIsData Support | Settings only |

Ministry leaders and volunteers see only their own ministries. Members cannot open the staff hub.

## The Grant Advisor (`/admin/grants`)

- **19 researched opportunities**, verified against official sources on October 19, 2026 (`src/data/funding.ts`). Each one has:
  - a fit score and a plain-language "why it fits New Life"
  - the requirements and the next three steps
  - which entity applies (church or Community Center)
  - the official source link
  - A **Confirm details** badge on items that still need checking with the funder.
- **Outside the box**:
  - recurring online giving
  - Virginia Neighborhood Assistance tax credits (a business sponsor gets up to 65% back)
  - solar with IRS Elective Pay (deadline end of 2027)
  - facility rentals and catering
  - employer matching
  - a Winfree Legacy Fund tied to the street-naming anniversary
- **Deadlines calendar**, **funding stacks** (combinations that fully fund one program), a **readiness checklist** (SAM.gov comes first), a **pipeline** board and **Ask the advisor**.
- **Draft letter of inquiry** writes a first draft from New Life's mission and the live counts in Outreach. **Draft action plan** does the same for non-grant ideas. Drafts go to the Action Center for review. Nothing is ever sent to a funder automatically.
- In this demo the advisor answers from the researched list. In production it runs as a live AI agent with web search on a weekly schedule.

## Before launch

- [ ] Set `site.config.json` to the real address.
- [ ] Run `npm run dev` once on a networked machine so the photos download, then commit `public/images/church/`.
- [ ] Have the church confirm:
  - [ ] service times and office hours (`src/config/site.ts`)
  - [ ] leader titles (`src/config/accounts.ts`, `src/web/pages/About.tsx`)
  - [ ] the ministry list
- [ ] Have the church's counsel review Privacy and Terms (`src/web/pages/Legal.tsx`).
- [ ] Connect a real payment processor for Give. The demo checkout charges nothing.
- [ ] Re-verify every Grant Advisor deadline when each funder posts its next round. Dates marked "expected" are projections.
- [ ] Confirm the DataIsData contact address on the staff Help page.

Research notes (site audit, church facts, design direction, funding sources) are in `docs/`.
