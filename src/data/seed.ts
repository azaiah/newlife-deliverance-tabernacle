import type { DemoState, Member, Household, Gift, ChurchEvent, Registration, Reservation, Staff, Shift, Expense, BudgetLine, CareRequest, ServiceRequest, Attendance, AgentDraft, Approval, Task, Maintenance, Announcement, PantryDay, AfterSchoolDay, Ministry } from './types'
import { daysFromNow } from './dates'
import { opportunities, readiness } from './funding'

/**
 * Seed data for the New Life Deliverance Tabernacle demo.
 * Real: church name, address, schedule, ministries, leaders' public names and titles, programs, partners, history.
 * Sample (fictional): congregation members, households, gifts, care requests, service requests, finances.
 * Real leaders never receive invented giving, care or personal records.
 */

function rng(seed: number) { let s = seed; return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296 } }
const rand = rng(19970316)
const pick = <T,>(a: readonly T[]) => a[Math.floor(rand() * a.length)]
const between = (a: number, b: number) => Math.floor(a + rand() * (b - a + 1))

const firsts = ['Marcus', 'Danielle', 'Jerome', 'Keisha', 'Darnell', 'Alicia', 'Terrence', 'Monique', 'Andre', 'Tamika', 'Reginald', 'Vanessa', 'Calvin', 'Felicia', 'Maurice', 'Gwendolyn', 'Dwayne', 'Patrice', 'Lamar', 'Simone', 'Bernard', 'Brenda', 'Rodney', 'Loretta', 'Cedric', 'Mae', 'Samuel', 'Grace', 'Isaiah', 'Ruth', 'Daniel', 'Esther', 'Joshua', 'Naomi', 'Elijah', 'Hannah', 'Caleb', 'Deborah', 'Micah', 'Lydia', 'Nathan', 'Priscilla', 'Jonathan', 'Abigail', 'Thomas', 'Miriam', 'Peter', 'Rebekah', 'Ernestine', 'Clarence', 'Odessa', 'Willie', 'Shirley', 'Otis']
const lasts = ['Carter', 'Robinson', 'Mitchell', 'Harris', 'Washington', 'Coleman', 'Brooks', 'Price', 'Bryant', 'Griffin', 'Hayes', 'Freeman', 'Ford', 'Simmons', 'Butler', 'Henderson', 'Patterson', 'Powell', 'Bailey', 'Chambers', 'Tucker', 'Lewis', 'Gaines', 'Booker', 'Talley', 'Spruill', 'Branch', 'Jeter', 'Cousins', 'Pleasants']
const streets = ['Hull St', 'Decatur St', 'Bainbridge St', 'Perry St', 'Stockton St', 'Clopton St', 'Midlothian Tpke', 'Broad Rock Blvd', 'Jefferson Davis Hwy', 'Belt Blvd', 'Cowardin Ave', 'Commerce Rd', 'E 9th St', 'Maury St', 'Ruffin Rd']

export const ministryIds = {
  worship: 'min_worship', music: 'min_music', deacons: 'min_deacons', ushers: 'min_ushers', security: 'min_security', culinary: 'min_culinary',
  bereavement: 'min_bereavement', media: 'min_media', grounds: 'min_grounds', transport: 'min_transport', decorating: 'min_decorating', gals: 'min_gals',
  armor: 'min_armor', women: 'min_women', men: 'min_men', youth: 'min_youth', center: 'min_center', outreach: 'min_outreach', care: 'min_care',
} as const

function nextSunday(offsetWeeks: number) { const d = new Date(); d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7) + offsetWeeks * 7); return d.toISOString().slice(0, 10) }
function nextWeekday(wd: number, offsetWeeks = 0) { const d = new Date(); d.setDate(d.getDate() + ((wd - d.getDay() + 7) % 7 || 7) + offsetWeeks * 7); return d.toISOString().slice(0, 10) }
/** The Nth weekday of the month containing (today + monthsAhead). */
function nthWeekday(n: number, wd: number, monthsAhead = 0) {
  const t = new Date(); const d = new Date(t.getFullYear(), t.getMonth() + monthsAhead, 1)
  d.setDate(1 + ((wd - d.getDay() + 7) % 7) + (n - 1) * 7)
  if (d < t && monthsAhead === 0) return nthWeekday(n, wd, 1)
  return d.toISOString().slice(0, 10)
}
function pastWeekday(wd: number, weeksAgo: number) { const d = new Date(); d.setDate(d.getDate() - ((d.getDay() - wd + 7) % 7 || 7) - (weeksAgo - 1) * 7); return d.toISOString().slice(0, 10) }

/** Public leaders (names and titles as listed by the church). Demo emails only. */
const leaders: { first: string; last: string; tags: string[]; ministryIds: string[]; email: string }[] = [
  { first: 'Robert A.', last: 'Winfree', tags: ['Founder & Senior Pastor', 'Leader'], ministryIds: [], email: 'pastor.winfree@newlife.example' },
  { first: 'Michael L.', last: 'Winfree', tags: ['Pastor', 'Leader'], ministryIds: [ministryIds.worship, ministryIds.men], email: 'pastor.michael@newlife.example' },
  { first: 'Phyllis D.', last: 'Alexander', tags: ['Church Administrator', 'Associate Pastor', 'Leader'], ministryIds: [ministryIds.care, ministryIds.worship], email: 'administrator@newlife.example' },
  { first: 'Shelby', last: 'Vincent', tags: ['Deacon', 'Leader'], ministryIds: [ministryIds.deacons], email: 'deacons@newlife.example' },
  { first: 'Kevin', last: 'Dixon', tags: ['Minister', 'Music Director', 'Leader'], ministryIds: [ministryIds.music], email: 'music@newlife.example' },
  { first: 'Landis', last: 'Mathews', tags: ['Deacon', 'Leader'], ministryIds: [ministryIds.transport, ministryIds.deacons], email: 'transportation@newlife.example' },
  { first: 'Tashabe', last: 'Jackson', tags: ['Deacon', 'Leader'], ministryIds: [ministryIds.outreach, ministryIds.deacons], email: 'outreach@newlife.example' },
  { first: 'Robin', last: 'Chaney', tags: ['Leader'], ministryIds: [ministryIds.bereavement], email: 'bereavement@newlife.example' },
  { first: 'Yolanda', last: 'Jacobus', tags: ['Leader'], ministryIds: [ministryIds.ushers], email: 'ushers@newlife.example' },
  { first: 'Evone', last: 'Woodley', tags: ['Deacon', 'Leader'], ministryIds: [ministryIds.decorating, ministryIds.deacons], email: 'decorating@newlife.example' },
  { first: 'Tyrone', last: 'Edmonds', tags: ['Deacon', 'Leader'], ministryIds: [ministryIds.armor, ministryIds.deacons], email: 'armorbearers@newlife.example' },
  { first: 'Cheryl', last: 'Jennings', tags: ['Leader'], ministryIds: [ministryIds.gals], email: 'gals@newlife.example' },
  { first: 'Walter', last: 'Fenner', tags: ['Leader'], ministryIds: [ministryIds.culinary], email: 'culinary@newlife.example' },
  { first: 'Sandra', last: 'Sykes', tags: ['Director of Extended Programs', 'Leader'], ministryIds: [ministryIds.youth, ministryIds.center], email: 'programs@newlife.example' },
]
export const REAL_LEADER_COUNT = leaders.length

function makePeople() {
  const households: Household[] = []
  const members: Member[] = []
  // Real leaders first (m_1 .. m_14), then sample office accounts (m_15, m_16), then fictional congregation.
  leaders.forEach((l, i) => {
    households.push({ id: `hh_l${i + 1}`, name: `${l.last} Household`, address: 'On file with the church office' })
    members.push({ id: `m_${i + 1}`, first: l.first, last: l.last, email: l.email, phone: '(804) 233-2730', householdId: `hh_l${i + 1}`, status: 'member', joinedAt: '1997-03-16', firstVisit: '1997-03-16', ministryIds: l.ministryIds, tags: l.tags, consent: { email: true, sms: false }, lastContact: daysFromNow(-between(0, 6)), address: 'On file with the church office', notes: '', volunteerInterests: [] })
  })
  households.push({ id: 'hh_office', name: 'Church Office', address: '900 Decatur St, Richmond, VA 23224' })
  households.push({ id: 'hh_web', name: 'Website guests', address: 'Submitted on the website' })
  members.push({ id: 'm_15', first: 'Finance', last: 'Office', email: 'finance@newlife.example', phone: '(804) 233-2730', householdId: 'hh_office', status: 'member', joinedAt: '2010-01-01', firstVisit: '2010-01-01', ministryIds: [], tags: ['Sample account'], consent: { email: true, sms: false }, lastContact: daysFromNow(0), address: '900 Decatur St, Richmond, VA 23224', notes: '', volunteerInterests: [] })
  members.push({ id: 'm_16', first: 'Church', last: 'Office', email: 'office@newlife.example', phone: '(804) 233-2730', householdId: 'hh_office', status: 'member', joinedAt: '2010-01-01', firstVisit: '2010-01-01', ministryIds: [], tags: ['Sample account'], consent: { email: true, sms: false }, lastContact: daysFromNow(0), address: '900 Decatur St, Richmond, VA 23224', notes: '', volunteerInterests: [] })

  const congregationMinistries = [ministryIds.music, ministryIds.ushers, ministryIds.culinary, ministryIds.women, ministryIds.men, ministryIds.youth, ministryIds.outreach, ministryIds.transport, ministryIds.media, ministryIds.decorating, ministryIds.bereavement, ministryIds.security, ministryIds.grounds]
  const statuses: Member['status'][] = ['member', 'member', 'member', 'member', 'member', 'attendee', 'attendee', 'visitor', 'inactive']
  let hh = 0
  const total = 74
  for (let i = 0; i < total; i++) {
    const id = `m_${i + 17}`
    if (i === 0 || rand() < 0.6) {
      hh += 1
      households.push({ id: `hh_${hh}`, name: `${pick(lasts)} Household`, address: `${between(100, 3400)} ${pick(streets)}, Richmond, VA 2322${pick(['4', '4', '4', '5', '0'])}` })
    }
    const h = households[households.length - 1]
    const last = h.name.replace(' Household', '')
    const first = firsts[i % firsts.length]
    const status = pick(statuses)
    const joined = status === 'visitor' ? '' : `${between(1997, 2025)}-${String(between(1, 12)).padStart(2, '0')}-${String(between(1, 28)).padStart(2, '0')}`
    const mins = status === 'inactive' || status === 'visitor' || rand() < 0.25 ? [] : Array.from(new Set([pick(congregationMinistries), ...(rand() < 0.35 ? [pick(congregationMinistries)] : [])]))
    members.push({
      id, first, last, email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`, phone: `(804) 555-0${String(between(100, 199))}`,
      householdId: h.id, status, joinedAt: joined, firstVisit: status === 'visitor' ? daysFromNow(-between(1, 21)) : joined || daysFromNow(-400),
      ministryIds: mins, tags: rand() < 0.25 ? ['New this year'] : rand() < 0.15 ? ['Mother of the church'] : [],
      consent: { email: rand() < 0.8, sms: rand() < 0.7 }, lastContact: daysFromNow(-between(0, 150)),
      address: h.address, birthday: `19${between(40, 99)}-${String(between(1, 12)).padStart(2, '0')}-${String(between(1, 28)).padStart(2, '0')}`,
      notes: '', volunteerInterests: rand() < 0.5 ? [pick(['Ushering', 'Sound & media', 'Food pantry', 'Transportation', 'Tutoring', 'Choir', 'Culinary', 'Decorating'])] : [],
    })
  }
  // Recent first-time visitors
  for (let i = 0; i < 7; i++) {
    const m = members[members.length - 1 - i]
    m.status = 'visitor'; m.joinedAt = ''; m.firstVisit = daysFromNow(-(i * 2 + 1)); m.ministryIds = []; m.tags = ['First-time visitor']; m.lastContact = i < 3 ? '' : daysFromNow(-i)
  }
  // The sample member used by the member portal
  const sample = members.find((m) => m.id === 'm_20')!
  Object.assign(sample, { first: 'Angela', last: 'Brooks', status: 'member', email: 'angela.brooks@example.com', ministryIds: [ministryIds.women, ministryIds.ushers], tags: ['Sample person'], consent: { email: true, sms: true }, volunteerInterests: ['Food pantry'], joinedAt: '2016-04-10', lastContact: daysFromNow(-3), notes: '' })
  return { households, members }
}

export function createSeedState(): DemoState {
  const { households, members } = makePeople()
  const L = { robert: 'm_1', michael: 'm_2', phyllis: 'm_3', shelby: 'm_4', kevin: 'm_5', landis: 'm_6', tashabe: 'm_7', robin: 'm_8', yolanda: 'm_9', evone: 'm_10', tyrone: 'm_11', cheryl: 'm_12', walter: 'm_13', sandra: 'm_14', finance: 'm_15', office: 'm_16' }

  const funds = [
    { id: 'f_general', name: 'Tithes & Offerings', type: 'general' as const, description: 'Supports worship, pastoral care and day-to-day ministry at 900 Decatur St.' },
    { id: 'f_building', name: 'Building Fund', type: 'restricted' as const, goal: 150000, description: 'Roof, HVAC and sanctuary improvements so the building keeps serving the neighborhood.' },
    { id: 'f_center', name: 'New Life Community Center', type: 'designated' as const, goal: 60000, description: 'After-school tutoring, mentoring, summer camp and programs for at-risk youth (501(c)(3)).' },
    { id: 'f_pantry', name: 'Food Pantry & Outreach', type: 'designated' as const, goal: 25000, description: 'FeedMore distribution every Wednesday and Saturday, plus clothing and emergency help.' },
    { id: 'f_benevolence', name: 'Benevolence', type: 'designated' as const, description: 'Emergency help for families in the church and community: utilities, rent gaps, funerals.' },
    { id: 'f_transport', name: 'Transportation Ministry', type: 'designated' as const, goal: 12000, description: 'Fuel, insurance and maintenance so no one misses church or an appointment for lack of a ride.' },
  ]

  const realLeaderIds = new Set(Object.values(L))
  const gifts: Gift[] = []
  const givers = members.filter((m) => (m.status === 'member' || m.status === 'attendee') && !realLeaderIds.has(m.id))
  for (let d = 0; d < 200; d += 1) {
    const date = daysFromNow(-d)
    const isSunday = new Date(date + 'T12:00:00').getDay() === 0
    const n = isSunday ? between(12, 22) : between(0, 2)
    for (let i = 0; i < n; i++) {
      const m = pick(givers)
      const roll = rand()
      const fundId = roll < 0.7 ? 'f_general' : roll < 0.8 ? 'f_building' : roll < 0.87 ? 'f_center' : roll < 0.93 ? 'f_pantry' : roll < 0.97 ? 'f_benevolence' : 'f_transport'
      gifts.push({ id: `g_${gifts.length + 1}`, memberId: m.id, amount: pick([10, 20, 25, 40, 50, 50, 75, 100, 100, 120, 150, 200, 250]), fundId, method: isSunday ? pick(['cash', 'cash', 'check', 'check', 'card', 'online', 'text']) : pick(['online', 'online', 'text', 'ach']), date, status: d > 6 ? 'reconciled' : 'recorded', recurring: rand() < 0.18 })
    }
  }
  ;[7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98].forEach((d, i) => gifts.push({ id: `g_s_${i}`, memberId: 'm_20', amount: i % 4 === 3 ? 25 : 100, fundId: i % 4 === 3 ? 'f_center' : 'f_general', method: 'online', date: daysFromNow(-d), status: 'reconciled', recurring: true }))

  const ministries: Ministry[] = [
    { id: ministryIds.worship, name: 'Worship & Ministers', leaderId: L.michael, description: 'Associate pastors and ministers who support the pastors in preaching, teaching, pastoral care and intercessory prayer.', annualBudget: 18000, color: '#4B2A7B', meets: 'Sundays 9:45 AM' },
    { id: ministryIds.music, name: 'Music Ministry & Choir', leaderId: L.kevin, description: 'Leads the congregation in worship through song. Rehearsals, musicians and special events.', annualBudget: 14000, color: '#8A6620', meets: 'Choir rehearsal Fridays 7:00 PM' },
    { id: ministryIds.deacons, name: 'Diaconate (Deacons on a Mission)', leaderId: L.shelby, description: 'Prayer, care and spiritual support; visiting the sick and bereaved; benevolence; evangelism beyond the walls.', annualBudget: 9000, color: '#3A1F5E', meets: 'Monthly deacons meeting' },
    { id: ministryIds.ushers, name: 'Ushers', leaderId: L.yolanda, description: 'The first point of contact: a welcoming, orderly atmosphere, seating, bulletins, offering and communion.', annualBudget: 2500, color: '#6E44A8', meets: 'Sundays 9:15 AM' },
    { id: ministryIds.security, name: 'Security', leaderId: L.tyrone, description: 'Safeguards the pastor, congregation and property; monitors entrances and parking; coordinates with law enforcement.', annualBudget: 6000, color: '#2A1844', meets: 'Every service' },
    { id: ministryIds.culinary, name: 'Culinary Arts', leaderId: L.walter, description: 'Meals for church functions, repasts and events; kitchen safety; hospitality and excellence in food service.', annualBudget: 16000, color: '#B7791F', meets: 'As scheduled' },
    { id: ministryIds.bereavement, name: 'Bereavement', leaderId: L.robin, description: 'Compassionate care for grieving families: prayer, follow-up and coordinating funeral support with ushers and culinary.', annualBudget: 4000, color: '#5E566A', meets: 'As needed' },
    { id: ministryIds.media, name: 'Sound & Media', leaderId: L.phyllis, description: 'Livestreams, projection, recordings, the church website and social media.', annualBudget: 7000, color: '#4338CA', meets: 'Sundays 9:00 AM' },
    { id: ministryIds.grounds, name: 'Building & Grounds', leaderId: L.shelby, description: 'Keeps the church building, inside and out, clean, safe and presentable.', annualBudget: 12000, color: '#1E7A4C', meets: 'Saturdays as scheduled' },
    { id: ministryIds.transport, name: 'Transportation', leaderId: L.landis, description: 'Safe, timely rides for members and neighbors to worship, programs and appointments.', annualBudget: 11000, color: '#B45309', meets: 'Sunday routes and on request' },
    { id: ministryIds.decorating, name: 'Decorating', leaderId: L.evone, description: 'Seasonal and special-event decor, floral arrangements and banners.', annualBudget: 3000, color: '#BE185D', meets: 'Before special services' },
    { id: ministryIds.gals, name: 'GALS (God\'s Anointed Leaders)', leaderId: L.cheryl, description: 'A select group of anointed leaders ready to assist and support every ministry as needed.', annualBudget: 1500, color: '#9D174D', meets: 'As needed' },
    { id: ministryIds.armor, name: 'Armor Bearers', leaderId: L.tyrone, description: 'Support the pastor in spiritual and practical matters, service logistics and travel.', annualBudget: 1000, color: '#374151', meets: 'Every service' },
    { id: ministryIds.women, name: 'Women\'s Ministry', leaderId: L.phyllis, description: 'Fellowship, growth and support for women of every season.', annualBudget: 4000, color: '#A21CAF', meets: '3rd Saturdays 1:30 PM' },
    { id: ministryIds.men, name: 'Men\'s Ministry & Mentoring', leaderId: L.michael, description: 'Brotherhood, accountability and the ongoing mentoring program for young men.', annualBudget: 4000, color: '#1F2937', meets: 'Monthly' },
    { id: ministryIds.youth, name: 'Youth & Children', leaderId: L.sandra, description: 'Junior church, youth outings, trips and character development.', annualBudget: 9000, color: '#0E7490', meets: 'Sundays and trips' },
    { id: ministryIds.center, name: 'New Life Community Center', leaderId: L.sandra, description: 'After-school tutoring (Mon & Wed), mentoring, summer camp and programs for at-risk youth. 501(c)(3).', annualBudget: 48000, color: '#C9A24B', meets: 'Mon & Wed 5:00 PM' },
    { id: ministryIds.outreach, name: 'Community Outreach & Food Pantry', leaderId: L.tashabe, description: 'FeedMore distribution, clothing help, Community Conversations and neighborhood events in Blackwell, Hillside and Belt Atlantic.', annualBudget: 22000, color: '#15803D', meets: 'Wed 1:00 PM & Sat 11:00 AM' },
    { id: ministryIds.care, name: 'Counseling & Pastoral Care', leaderId: L.phyllis, description: 'Spiritual guidance, grief and family counseling, prayer support and referrals. Confidential.', annualBudget: 5000, color: '#7C3AED', meets: 'Tuesdays 5:00 PM' },
  ]

  const rooms = [
    { id: 'r_sanctuary', name: 'Sanctuary', capacity: 220, kind: 'sanctuary' as const, rentalRate: 400 },
    { id: 'r_hall', name: 'Fellowship Hall', capacity: 120, kind: 'hall' as const, rentalRate: 250 },
    { id: 'r_kitchen', name: 'Kitchen', capacity: 10, kind: 'kitchen' as const, rentalRate: 100 },
    { id: 'r_center', name: 'Community Center Classroom', capacity: 40, kind: 'classroom' as const, rentalRate: 80 },
    { id: 'r_class', name: 'Bible Study Room', capacity: 30, kind: 'classroom' as const, rentalRate: 50 },
    { id: 'r_office', name: 'Pastor\'s Conference Room', capacity: 10, kind: 'office' as const, rentalRate: 0 },
    { id: 'r_lot', name: 'Parking Lot & Lawn', capacity: 200, kind: 'outdoor' as const, rentalRate: 150 },
    { id: 'r_van', name: 'Church Van', capacity: 14, kind: 'vehicle' as const, rentalRate: 0 },
  ]

  const events: ChurchEvent[] = [
    { id: 'e_1', title: 'Sunday Worship', ministryId: ministryIds.worship, date: nextSunday(0), start: '09:45', end: '12:30', roomId: 'r_sanctuary', description: 'Spirit-filled praise, the preached Word and fellowship. Everyone welcome.', stage: 'promoted', budget: 0, spent: 0, capacity: 220, isPublic: true, category: 'worship', registrationOpen: false, ownerId: L.michael },
    { id: 'e_2', title: 'Tuesday Bible Study', ministryId: ministryIds.worship, date: nextWeekday(2), start: '19:00', end: '20:00', roomId: 'r_class', description: 'Dive deep into the Word with open discussion. Bring a friend and a Bible.', stage: 'promoted', budget: 0, spent: 0, capacity: 30, isPublic: true, category: 'class', registrationOpen: false, ownerId: L.phyllis },
    { id: 'e_3', title: 'Community Conversation', ministryId: ministryIds.outreach, date: nthWeekday(2, 2), start: '17:45', end: '18:45', roomId: 'r_hall', description: 'Your voice matters. Discuss community concerns, share ideas and solutions, and help build and strengthen our community. Business owners welcome.', stage: 'promoted', budget: 150, spent: 40, capacity: 80, isPublic: true, category: 'community', registrationOpen: true, ownerId: L.tashabe },
    { id: 'e_4', title: 'FeedMore Food Distribution', ministryId: ministryIds.outreach, date: nextWeekday(3), start: '13:00', end: '15:00', roomId: 'r_hall', description: 'Free groceries for neighbors. No eligibility requirement. Every Wednesday 1 to 3 PM and Saturday 11 AM to 1 PM.', stage: 'staffed', budget: 0, spent: 0, capacity: 120, isPublic: true, category: 'outreach', registrationOpen: false, ownerId: L.tashabe },
    { id: 'e_5', title: 'Women\'s Ministry Fellowship', ministryId: ministryIds.women, date: nthWeekday(3, 6), start: '13:30', end: '15:00', roomId: 'r_hall', description: 'Every third Saturday. Fellowship, the Word and encouragement.', stage: 'promoted', budget: 200, spent: 0, capacity: 60, isPublic: true, category: 'community', registrationOpen: true, ownerId: L.phyllis },
    { id: 'e_6', title: 'Thanksgiving Community Dinner', ministryId: ministryIds.culinary, date: daysFromNow(36), start: '13:00', end: '16:00', roomId: 'r_hall', description: 'A free dinner for neighbors in Blackwell, Hillside and Manchester. Volunteers needed for cooking, serving and cleanup.', stage: 'proposed', budget: 2600, spent: 0, capacity: 120, isPublic: true, category: 'community', registrationOpen: false, ownerId: L.walter },
    { id: 'e_7', title: 'Fall Youth Field Trip', ministryId: ministryIds.youth, date: daysFromNow(13), start: '09:00', end: '16:00', roomId: 'r_van', description: 'An educational trip for after-school students. Permission slips required.', stage: 'approved', budget: 900, spent: 300, capacity: 28, isPublic: false, category: 'youth', registrationOpen: true, ownerId: L.sandra },
    { id: 'e_8', title: 'Deacons Meeting', ministryId: ministryIds.deacons, date: daysFromNow(2), start: '19:00', end: '20:30', roomId: 'r_office', description: 'Monthly meeting. Agenda prepared by the Office Agent.', stage: 'staffed', budget: 0, spent: 0, capacity: 14, isPublic: false, category: 'meeting', registrationOpen: false, ownerId: L.shelby },
    { id: 'e_9', title: 'Back to School Giveaway', ministryId: ministryIds.outreach, date: daysFromNow(-58), start: '10:00', end: '13:00', roomId: 'r_lot', description: 'Backpacks and school supplies for neighborhood students.', stage: 'reported', budget: 1800, spent: 1710, capacity: 200, isPublic: true, category: 'outreach', registrationOpen: false, attendance: 186, ownerId: L.tashabe },
    { id: 'e_10', title: 'Choir Rehearsal', ministryId: ministryIds.music, date: nextWeekday(5), start: '19:00', end: '20:30', roomId: 'r_sanctuary', description: 'Weekly rehearsal. New voices welcome.', stage: 'promoted', budget: 0, spent: 0, capacity: 40, isPublic: true, category: 'meeting', registrationOpen: false, ownerId: L.kevin },
    { id: 'e_11', title: 'Watch Night Service', ministryId: ministryIds.worship, date: (() => { const d = new Date(); return `${d.getFullYear()}-12-31` })(), start: '22:00', end: '00:30', roomId: 'r_sanctuary', description: 'Pray the old year out and the new year in together.', stage: 'approved', budget: 600, spent: 0, capacity: 220, isPublic: true, category: 'worship', registrationOpen: false, ownerId: L.robert },
    { id: 'e_12', title: 'Pastor Winfree Street Naming Anniversary', ministryId: ministryIds.outreach, date: (() => { const d = new Date(); return `${d.getFullYear() + 1}-03-14` })(), start: '13:00', end: '15:00', roomId: 'r_lot', description: 'Celebrating the honorary designation of the 900 block of Decatur Street with neighbors and city friends.', stage: 'proposed', budget: 1200, spent: 0, capacity: 200, isPublic: true, category: 'community', registrationOpen: true, ownerId: L.phyllis },
    { id: 'e_13', title: 'After-School Program', ministryId: ministryIds.center, date: nextWeekday(1), start: '17:00', end: '19:00', roomId: 'r_center', description: 'Homework help, tutoring, mentoring and a safe, encouraging place to grow. Mondays and Wednesdays.', stage: 'staffed', budget: 0, spent: 0, capacity: 40, isPublic: true, category: 'youth', registrationOpen: true, ownerId: L.sandra },
  ]

  const registrations: Registration[] = []
  events.filter((e) => e.registrationOpen).forEach((e) => {
    const n = e.id === 'e_13' ? 27 : e.id === 'e_7' ? 22 : between(6, 20)
    for (let i = 0; i < n; i++) {
      const m = i % 3 === 0 ? undefined : pick(members.slice(16))
      registrations.push({ id: `rg_${registrations.length + 1}`, eventId: e.id, memberId: m?.id, name: m ? `${m.first} ${m.last}` : `${pick(firsts)} ${pick(lasts)}`, email: m?.email ?? 'neighbor@example.com', qty: e.id === 'e_13' ? 1 : between(1, 3), date: daysFromNow(-between(0, 20)) })
    }
  })
  registrations.push({ id: 'rg_s_1', eventId: 'e_5', memberId: 'm_20', name: 'Angela Brooks', email: 'angela.brooks@example.com', qty: 1, date: daysFromNow(-4) })
  registrations.push({ id: 'rg_s_2', eventId: 'e_3', memberId: 'm_20', name: 'Angela Brooks', email: 'angela.brooks@example.com', qty: 2, date: daysFromNow(-2) })

  const reservations: Reservation[] = [
    { id: 'rs_1', roomId: 'r_hall', requester: 'Blackwell Civic Association', date: daysFromNow(11), start: '18:00', end: '20:00', status: 'requested', purpose: 'Neighborhood association meeting', external: true, fee: 150, deposit: 50, paid: false },
    { id: 'rs_2', roomId: 'r_hall', requester: 'Family repast (member family)', date: daysFromNow(4), start: '13:00', end: '16:00', status: 'requested', purpose: 'Repast after a homegoing service; Culinary Arts to serve', external: false, fee: 0, deposit: 0, paid: true },
    { id: 'rs_3', roomId: 'r_center', requester: 'Richmond Behavioral Health Authority', date: daysFromNow(9), start: '17:00', end: '19:00', status: 'requested', purpose: 'Community prevention workshop', external: true, fee: 0, deposit: 0, paid: true },
    { id: 'rs_4', roomId: 'r_van', requester: 'Transportation Ministry', date: nextSunday(0), start: '08:30', end: '13:30', status: 'approved', purpose: 'Sunday pickup route (Hillside, Blackwell, Bellemeade)', external: false },
    { id: 'rs_5', roomId: 'r_sanctuary', requester: 'Wedding (member couple)', date: daysFromNow(27), start: '14:00', end: '17:00', status: 'requested', purpose: 'Wedding ceremony; premarital counseling completed', external: false, fee: 0, deposit: 0, paid: true },
    { id: 'rs_6', roomId: 'r_kitchen', requester: 'Culinary Arts: Good Friday fish dinners', date: daysFromNow(-200), start: '15:00', end: '21:00', status: 'approved', purpose: '$10 dinners after service', external: false },
  ]

  const maintenance: Maintenance[] = [
    { id: 'mt_1', area: 'Sanctuary', title: 'Stained glass window caulking (east side)', priority: 'high', status: 'assigned', vendor: 'Commonwealth Glass & Glazing', reportedBy: 'Building & Grounds', date: daysFromNow(-4), cost: 1850 },
    { id: 'mt_2', area: 'Fellowship Hall', title: 'HVAC unit short-cycling before pantry days', priority: 'high', status: 'scheduled', vendor: 'James River Mechanical', reportedBy: 'Deacon Tashabe Jackson', date: daysFromNow(-8), cost: 1240 },
    { id: 'mt_3', area: 'Parking lot', title: 'Repaint accessible spaces and crosswalk', priority: 'normal', status: 'open', reportedBy: 'Security ministry', date: daysFromNow(-15) },
    { id: 'mt_4', area: 'Church Van', title: 'Brake inspection and tire rotation', priority: 'urgent', status: 'open', reportedBy: 'Deacon Landis Mathews', date: daysFromNow(-2) },
    { id: 'mt_5', area: 'Community Center Classroom', title: 'Replace two classroom laptops', priority: 'normal', status: 'open', reportedBy: 'Sandra Sykes', date: daysFromNow(-10), cost: 900 },
    { id: 'mt_6', area: 'Kitchen', title: 'Annual hood and fire suppression inspection', priority: 'normal', status: 'scheduled', vendor: 'Virginia Fire Protection', reportedBy: 'Facilities Agent', date: daysFromNow(-1), cost: 325 },
    { id: 'mt_7', area: 'Sanctuary', title: 'Livestream camera mount loose', priority: 'low', status: 'done', reportedBy: 'Sound & Media', date: daysFromNow(-21), cost: 60 },
  ]

  const assets = [
    { id: 'a_1', name: 'Sanctuary sound system', category: 'Audio/Visual', location: 'Sanctuary', serviceDue: daysFromNow(70), value: 14000 },
    { id: 'a_2', name: 'Church van (14-passenger)', category: 'Vehicle', location: 'Parking lot', serviceDue: daysFromNow(-2), insuranceRenewal: daysFromNow(38), value: 26000 },
    { id: 'a_3', name: 'Kitchen equipment', category: 'Kitchen', location: 'Kitchen', serviceDue: daysFromNow(110), value: 21000 },
    { id: 'a_4', name: 'Livestream camera and encoder', category: 'Audio/Visual', location: 'Sanctuary', serviceDue: daysFromNow(180), value: 3800 },
    { id: 'a_5', name: 'Property insurance policy', category: 'Insurance', location: 'Office', serviceDue: daysFromNow(64), insuranceRenewal: daysFromNow(64), value: 0 },
    { id: 'a_6', name: 'Community Center laptops (12)', category: 'Technology', location: 'Community Center Classroom', serviceDue: daysFromNow(30), value: 7200 },
    { id: 'a_7', name: 'Walk-in pantry freezer', category: 'Pantry', location: 'Fellowship Hall', serviceDue: daysFromNow(45), value: 5400 },
  ]

  const staff: Staff[] = [
    { id: 's_1', name: 'Rev. Dr. Robert A. Winfree', title: 'Founder & Senior Pastor', type: 'employee', ministryIds: [], bgCheck: 'n/a', trainings: [], hoursThisMonth: 0, email: 'pastor.winfree@newlife.example', startDate: '1997-03-16' },
    { id: 's_2', name: 'Rev. Michael L. Winfree', title: 'Pastor', type: 'employee', ministryIds: [ministryIds.worship, ministryIds.men], bgCheck: 'n/a', trainings: [], hoursThisMonth: 0, email: 'pastor.michael@newlife.example', startDate: '2001-07-15' },
    { id: 's_3', name: 'Rev. Phyllis D. Alexander', title: 'Church Administrator & Associate Pastor', type: 'employee', ministryIds: [ministryIds.care], bgCheck: 'n/a', trainings: ['Psychological First Aid', 'Grief Coaching'], hoursThisMonth: 0, email: 'administrator@newlife.example', startDate: '2015-01-01' },
    { id: 's_4', name: 'Sandra Sykes', title: 'Director of Extended Programs', type: 'part-time', ministryIds: [ministryIds.center, ministryIds.youth], bgCheck: 'n/a', trainings: [], hoursThisMonth: 0, email: 'programs@newlife.example', startDate: '2012-09-01' },
    { id: 's_5', name: 'Sample tutor A', title: 'After-school tutor', type: 'volunteer', ministryIds: [ministryIds.center], bgCheck: 'clear', bgCheckDate: '2026-01-20', trainings: ['Youth Protection'], hoursThisMonth: 16, email: 'tutor.a@example.com', startDate: '2024-09-04' },
    { id: 's_6', name: 'Sample tutor B', title: 'After-school tutor', type: 'volunteer', ministryIds: [ministryIds.center], bgCheck: 'pending', trainings: [], hoursThisMonth: 6, email: 'tutor.b@example.com', startDate: daysFromNow(-14) },
    { id: 's_7', name: 'Sample driver', title: 'Van driver', type: 'volunteer', ministryIds: [ministryIds.transport], bgCheck: 'expired', bgCheckDate: '2024-03-01', trainings: ['Defensive Driving'], hoursThisMonth: 18, email: 'driver@example.com', startDate: '2019-05-12' },
    { id: 's_8', name: 'Sample pantry volunteer A', title: 'Pantry intake', type: 'volunteer', ministryIds: [ministryIds.outreach], bgCheck: 'n/a', trainings: ['Food Safety'], hoursThisMonth: 24, email: 'pantry.a@example.com', startDate: '2020-02-01' },
    { id: 's_9', name: 'Sample pantry volunteer B', title: 'Pantry distribution', type: 'volunteer', ministryIds: [ministryIds.outreach], bgCheck: 'n/a', trainings: ['Food Safety'], hoursThisMonth: 20, email: 'pantry.b@example.com', startDate: '2021-06-01' },
    { id: 's_10', name: 'Sample usher', title: 'Usher', type: 'volunteer', ministryIds: [ministryIds.ushers], bgCheck: 'n/a', trainings: [], hoursThisMonth: 10, email: 'usher@example.com', startDate: '2018-03-01' },
    { id: 's_11', name: 'Sample media volunteer', title: 'Livestream operator', type: 'volunteer', ministryIds: [ministryIds.media], bgCheck: 'n/a', trainings: [], hoursThisMonth: 12, email: 'media@example.com', startDate: '2022-01-09' },
    { id: 's_12', name: 'Sample security volunteer', title: 'Security team', type: 'volunteer', ministryIds: [ministryIds.security], bgCheck: 'clear', bgCheckDate: '2025-08-01', trainings: ['De-escalation'], hoursThisMonth: 14, email: 'security@example.com', startDate: '2021-10-03' },
  ]

  const shifts: Shift[] = []
  const shiftRoles: Record<string, string[]> = { [ministryIds.ushers]: ['Front door usher', 'Center aisle usher'], [ministryIds.media]: ['Livestream', 'Sound board'], [ministryIds.transport]: ['Van driver'], [ministryIds.security]: ['Parking lot', 'Sanctuary door'], [ministryIds.outreach]: ['Pantry intake', 'Pantry distribution'], [ministryIds.center]: ['Tutor'] }
  for (let w = 0; w < 4; w++) {
    Object.entries(shiftRoles).forEach(([min, roles]) => roles.forEach((role) => {
      const date = min === ministryIds.outreach ? nextWeekday(3, w) : min === ministryIds.center ? nextWeekday(1, w) : nextSunday(w)
      const filled = rand() < 0.65
      const s = staff.filter((x) => x.ministryIds.includes(min) && (x.bgCheck === 'clear' || x.bgCheck === 'n/a'))
      shifts.push({ id: `sh_${shifts.length + 1}`, ministryId: min, date, role, staffId: filled && s.length ? pick(s).id : undefined, status: filled && s.length ? (rand() < 0.6 ? 'confirmed' : 'filled') : 'open' })
    }))
  }

  const expenses: Expense[] = [
    { id: 'x_1', ministryId: ministryIds.outreach, vendor: 'Restaurant Depot', amount: 420, category: 'Supplies', status: 'paid', requestedById: L.tashabe, date: daysFromNow(-6), note: 'Bags, gloves and table covers for pantry days' },
    { id: 'x_2', ministryId: ministryIds.music, vendor: 'Sweetwater', amount: 980, category: 'Equipment', status: 'requested', requestedById: L.kevin, date: daysFromNow(-1), note: 'Two wireless microphones for the choir' },
    { id: 'x_3', ministryId: ministryIds.center, vendor: 'Science Museum of Virginia', amount: 540, category: 'Events', status: 'requested', requestedById: L.sandra, date: daysFromNow(-2), note: 'Group admission for the fall youth field trip' },
    { id: 'x_4', ministryId: ministryIds.culinary, vendor: 'Sysco', amount: 2600, category: 'Food', status: 'requested', requestedById: L.walter, date: daysFromNow(0), note: 'Thanksgiving Community Dinner food order' },
    { id: 'x_5', ministryId: ministryIds.transport, vendor: 'Southside Auto Service', amount: 610, category: 'Vehicle', status: 'approved', requestedById: L.landis, date: daysFromNow(-3), note: 'Van brakes and tire rotation' },
    { id: 'x_6', ministryId: ministryIds.media, vendor: 'Restream', amount: 228, category: 'Software', status: 'paid', requestedById: L.phyllis, date: daysFromNow(-30), note: 'Livestream to Facebook and YouTube (annual)' },
    { id: 'x_7', ministryId: ministryIds.center, vendor: 'Scholastic', amount: 310, category: 'Curriculum', status: 'paid', requestedById: L.sandra, date: daysFromNow(-24), note: 'Reading books for after-school students' },
    { id: 'x_8', ministryId: ministryIds.bereavement, vendor: 'Florist on Hull St', amount: 160, category: 'Care', status: 'approved', requestedById: L.robin, date: daysFromNow(-5), note: 'Sympathy arrangements for two families' },
  ]

  const budgets: BudgetLine[] = []
  ministries.forEach((m) => {
    ;['Programs', 'Supplies', 'Events', 'Equipment'].forEach((c, i) => {
      const planned = Math.round((m.annualBudget / 12) * [0.5, 0.2, 0.2, 0.1][i])
      budgets.push({ id: `b_${budgets.length + 1}`, ministryId: m.id, category: c, planned, actual: Math.round(planned * (0.55 + rand() * 0.75)) })
    })
  })

  const care: CareRequest[] = [
    { id: 'c_1', kind: 'prayer', memberId: 'm_20', name: 'Angela Brooks', contact: 'angela.brooks@example.com', text: 'Please pray for my son as he starts a new job next week.', confidential: false, assigneeId: L.michael, status: 'assigned', date: daysFromNow(-1), updates: [] },
    { id: 'c_2', kind: 'pastoral', memberId: 'm_24', name: 'Sample member', contact: '(804) 555-0144', text: 'Would like to speak with a pastor about a family matter. Evenings are best.', confidential: true, assigneeId: L.robert, status: 'new', date: daysFromNow(0), updates: [] },
    { id: 'c_3', kind: 'assistance', name: 'Walk-in neighbor', contact: '(804) 555-0177', text: 'Behind on the electric bill after losing hours at work. Shutoff notice dated next Friday.', confidential: true, assigneeId: L.tashabe, status: 'in-progress', date: daysFromNow(-2), updates: [{ date: daysFromNow(-1), note: 'Benevolence request for $280 submitted. Awaiting Finance approval.' }] },
    { id: 'c_4', kind: 'prayer', memberId: 'm_33', name: 'Sample member', contact: 'sample@example.com', text: 'Praise report: surgery went well. Thank you, church family.', confidential: false, status: 'closed', date: daysFromNow(-6), updates: [{ date: daysFromNow(-5), note: 'Shared at Tuesday Bible Study with permission.' }] },
    { id: 'c_5', kind: 'pastoral', memberId: 'm_41', name: 'Sample member', contact: 'sample2@example.com', text: 'Grief support after losing her mother last month.', confidential: true, assigneeId: L.phyllis, status: 'in-progress', date: daysFromNow(-12), updates: [{ date: daysFromNow(-10), note: 'Bereavement ministry visited; grief coaching session scheduled for Tuesday 5 PM.' }] },
  ]

  const services: ServiceRequest[] = [
    { id: 'sv_1', program: 'food', name: 'Neighbor (Hillside)', contact: '(804) 555-0161', text: 'Family of five, need groceries this week.', status: 'fulfilled', coordinatorId: L.tashabe, date: daysFromNow(-3), householdSize: 5, outcome: 'Groceries provided at Saturday distribution' },
    { id: 'sv_2', program: 'housing', name: 'Neighbor (Blackwell)', contact: 'neighbor@example.com', text: 'Facing eviction; needs a safe place for two weeks and help finding housing.', status: 'in-progress', coordinatorId: L.phyllis, date: daysFromNow(-4), householdSize: 1, outcome: 'Placed in the church home; referral to Homeward' },
    { id: 'sv_3', program: 'employment', name: 'Neighbor (re-entry)', contact: '(804) 555-0188', text: 'Recently home and looking for work; interested in the cable wiring apprenticeship.', status: 'in-progress', coordinatorId: L.michael, date: daysFromNow(-6) },
    { id: 'sv_4', program: 'transportation', name: 'Senior member', contact: '(804) 555-0122', text: 'Needs a ride to dialysis Tuesday and Thursday mornings.', status: 'assigned', coordinatorId: L.landis, date: daysFromNow(-1) },
    { id: 'sv_5', program: 'transportation', name: 'Senior neighbor', contact: '(804) 555-0131', text: 'Ride to Sunday worship from Bellemeade.', status: 'new', date: daysFromNow(0) },
    { id: 'sv_6', program: 'senior', name: 'Neighbor', contact: '(804) 555-0133', text: 'Wellness check requested; lives alone on Bainbridge St.', status: 'new', date: daysFromNow(0) },
    { id: 'sv_7', program: 'emergency', name: 'Family (Belt Atlantic)', contact: 'family@example.com', text: 'House fire; needs clothing for two children (sizes 8 and 12).', status: 'in-progress', coordinatorId: L.tashabe, date: daysFromNow(-2), householdSize: 3 },
    { id: 'sv_8', program: 'food', name: 'Neighbor (Mosby)', contact: '(804) 555-0109', text: 'First visit to the pantry; senior on a fixed income.', status: 'fulfilled', coordinatorId: L.tashabe, date: daysFromNow(-10), householdSize: 1, outcome: 'Groceries provided; added to Wednesday reminder list' },
    { id: 'sv_9', program: 'transportation', name: 'After-school parent', contact: '(804) 555-0140', text: 'Ride home for two students after Wednesday program.', status: 'assigned', coordinatorId: L.landis, date: daysFromNow(-3) },
  ]

  const announcements: Announcement[] = [
    { id: 'an_1', title: 'Community Conversation this Tuesday', body: 'Your voice matters. Join us 5:45 to 6:45 PM in the Fellowship Hall to discuss community concerns and solutions. Business owners, come share and connect.', channels: ['bulletin', 'website', 'sms'], status: 'approved', date: daysFromNow(2), audience: 'All members and community list', authorId: L.office },
    { id: 'an_2', title: 'Thanksgiving Dinner volunteers needed', body: 'Culinary Arts needs 25 volunteers to cook, serve and clean up. Sign up in the member portal.', channels: ['bulletin', 'sms'], status: 'draft', date: daysFromNow(5), audience: 'Members with volunteer interests', authorId: L.office },
    { id: 'an_3', title: 'We need YOUR help in all ministries', body: 'Media, transportation, decorating, choir, mentoring and youth. There is a place for you. See a ministry leader or the church office.', channels: ['website', 'bulletin'], status: 'scheduled', date: daysFromNow(6), audience: 'All members', authorId: L.phyllis },
    { id: 'an_4', title: 'Theme for 2026', body: 'Just because God hasn\'t done it doesn\'t mean He won\'t do it. He\'s waiting for you to believe it, so that you can receive it.', channels: ['bulletin', 'website'], status: 'sent', date: daysFromNow(-40), audience: 'All members', authorId: L.robert },
  ]
  const campaigns = [
    { id: 'cp_1', name: 'October church family update', channel: 'email' as const, segment: 'All contacts with email consent', recipients: 214, status: 'sent' as const, sentAt: daysFromNow(-12), opens: 131, clicks: 44 },
    { id: 'cp_2', name: 'Pantry day reminder (Wednesday)', channel: 'sms' as const, segment: 'Pantry reminder list (consented)', recipients: 168, status: 'approved' as const },
    { id: 'cp_3', name: 'Thanksgiving dinner invitation', channel: 'sms' as const, segment: 'Neighbors on the community list', recipients: 390, status: 'draft' as const },
    { id: 'cp_4', name: 'First-time guest welcome (automated)', channel: 'email' as const, segment: 'First-time visitors, last 30 days', recipients: 7, status: 'sent' as const, sentAt: daysFromNow(-1), opens: 6, clicks: 3 },
  ]
  const documents = [
    { id: 'd_1', title: 'Facility Use & Rental Policy (2026)', category: 'policy' as const, updated: daysFromNow(-40), ownerId: L.phyllis, size: '210 KB' },
    { id: 'd_2', title: 'Deacons Meeting Minutes, September', category: 'minutes' as const, updated: daysFromNow(-20), ownerId: L.office, size: '84 KB' },
    { id: 'd_3', title: 'Volunteer Application & Background Check Consent', category: 'form' as const, updated: daysFromNow(-120), ownerId: L.phyllis, size: '118 KB' },
    { id: 'd_4', title: 'After-School Permission Slip & Emergency Card', category: 'form' as const, updated: daysFromNow(-50), ownerId: L.sandra, size: '96 KB' },
    { id: 'd_5', title: 'Benevolence Guidelines', category: 'policy' as const, updated: daysFromNow(-210), ownerId: L.finance, size: '62 KB' },
    { id: 'd_6', title: 'Community Center Form 990-EZ (FYE July 2025)', category: 'report' as const, updated: daysFromNow(-320), ownerId: L.finance, size: '1.2 MB' },
    { id: 'd_7', title: 'Bereavement Care Letter Template', category: 'letter' as const, updated: daysFromNow(-60), ownerId: L.robin, size: '30 KB' },
    { id: 'd_8', title: 'Child & Youth Safeguarding Policy', category: 'policy' as const, updated: daysFromNow(-95), ownerId: L.phyllis, size: '190 KB' },
    { id: 'd_9', title: 'Certificate of Liability Insurance', category: 'agreement' as const, updated: daysFromNow(-70), ownerId: L.phyllis, size: '140 KB' },
  ]
  const meetings = [
    { id: 'mg_1', title: 'Deacons Meeting', date: daysFromNow(2), attendees: ['Pastor Robert A. Winfree', 'Pastor Michael Winfree', 'Rev. Phyllis Alexander', 'Deacon Shelby Vincent', 'Deacon Landis Mathews', 'Deacon Tashabe Jackson'], agenda: ['Van brake repair (urgent)', 'Thanksgiving dinner budget', 'Grant readiness: SAM.gov registration for the Community Center', 'Security assessment request'], notes: '', actions: [{ text: 'Get two quotes for van brakes', ownerId: L.landis, done: true }, { text: 'Start SAM.gov registration', ownerId: L.phyllis, done: false }] },
    { id: 'mg_2', title: 'Ministry Leaders Huddle', date: daysFromNow(-5), attendees: ['Rev. Phyllis Alexander', 'All ministry leaders'], agenda: ['Fall calendar', 'Volunteer needs in every ministry', 'Bulletin deadline'], notes: 'Bulletin content due Wednesdays at noon. Media and transportation need volunteers most.', actions: [{ text: 'Post open volunteer shifts', ownerId: L.phyllis, done: true }, { text: 'Confirm fellowship hall for Women\'s Ministry', ownerId: L.office, done: true }] },
  ]

  const partners = [
    { id: 'p_1', name: 'FeedMore', type: 'nonprofit' as const, contact: 'Agency relations', status: 'active' as const, notes: 'Pantry partner agency. Distribution Wednesdays 1 to 3 PM and Saturdays 11 AM to 1 PM. Listed on the City of Richmond food pantry list.' },
    { id: 'p_2', name: 'Richmond Police Department', type: 'agency' as const, contact: 'Community engagement', status: 'active' as const, notes: 'Rev. Alexander serves as a chaplain. Partner for the September 2026 gun violence forum; potential security assessment.' },
    { id: 'p_3', name: 'Richmond Behavioral Health Authority', type: 'agency' as const, contact: 'Prevention services', status: 'active' as const, notes: 'Ongoing relationship; prevention workshops in the Community Center.' },
    { id: 'p_4', name: 'Blackwell Elementary School', type: 'agency' as const, contact: 'Family engagement', status: 'active' as const, notes: 'After-school tutoring partner school.' },
    { id: 'p_5', name: 'River City Middle School', type: 'agency' as const, contact: 'Family engagement', status: 'active' as const, notes: 'Adopted school; tutoring and mentoring.' },
    { id: 'p_6', name: 'Richmond Fire Department', type: 'agency' as const, contact: 'Station visit', status: 'active' as const, notes: 'Youth station visits and first-responder appreciation.' },
    { id: 'p_7', name: 'City of Richmond, 6th District', type: 'agency' as const, contact: 'Council office', status: 'active' as const, notes: 'Sponsored the 2025 honorary street designation for the 900 block of Decatur St.' },
    { id: 'p_8', name: 'Hull Street business owners', type: 'sponsor' as const, contact: 'Community Conversation attendees', status: 'prospect' as const, notes: 'Prospects for NAP-credited sponsorships (up to 65% Virginia tax credit).' },
  ]
  const businesses = [
    { id: 'bz_1', name: 'Sample member business: catering', ownerMemberId: 'm_31', category: 'Catering', phone: '(804) 555-0150', website: '', approved: true },
    { id: 'bz_2', name: 'Sample member business: barbershop', ownerMemberId: 'm_37', category: 'Grooming', phone: '(804) 555-0151', website: '', approved: true },
    { id: 'bz_3', name: 'Sample member business: tax preparation', ownerMemberId: 'm_42', category: 'Professional services', phone: '(804) 555-0152', website: '', approved: false },
  ]
  const grants = [
    { id: 'gr_1', name: 'At-Risk Afterschool Meals sponsor application', funder: 'VDOE School & Community Nutrition', amount: 8300, deadline: daysFromNow(30), status: 'applying' as const, ownerId: L.sandra, opportunityId: 'op_cacfp', entity: 'center' as const },
    { id: 'gr_2', name: 'Section 5310 accessible van', funder: 'Virginia DRPT', amount: 85000, deadline: '2027-02-01', status: 'identified' as const, ownerId: L.landis, opportunityId: 'op_5310', entity: 'center' as const },
    { id: 'gr_3', name: 'Ujima Legacy Fund: After-School Excellence', funder: 'Community Foundation for a greater Richmond', amount: 20000, deadline: '2027-09-25', status: 'identified' as const, ownerId: L.sandra, opportunityId: 'op_ujima', entity: 'center' as const },
    { id: 'gr_4', name: 'Dominion Energy pantry request', funder: 'Dominion Energy Charitable Foundation', amount: 10000, deadline: daysFromNow(-38), status: 'submitted' as const, ownerId: L.phyllis, opportunityId: 'op_dominion', entity: 'center' as const },
  ]
  const programs = [
    { id: 'pg_1', name: 'After-School Tutoring (Mon & Wed)', kind: 'education' as const, enrolled: 27, completed: 19, nextCohort: nextWeekday(1) },
    { id: 'pg_2', name: 'Mighty Mentor', kind: 'youth' as const, enrolled: 14, completed: 9, nextCohort: daysFromNow(21) },
    { id: 'pg_3', name: 'Cable Wiring Apprenticeship', kind: 'workforce' as const, enrolled: 8, completed: 6, placed: 4, nextCohort: daysFromNow(60) },
    { id: 'pg_4', name: 'Financial Literacy for Teens', kind: 'financial' as const, enrolled: 18, completed: 15, nextCohort: daysFromNow(35) },
  ]

  const drafts: AgentDraft[] = [
    { id: 'dr_1', agentId: 'office', title: 'Sunday bulletin', kind: 'Bulletin', module: 'office', reviewerRole: 'secretary', status: 'pending', createdAt: daysFromNow(0), body: 'NEW LIFE DELIVERANCE TABERNACLE\n900 Decatur Street · Richmond, Virginia\n"Who the Son sets free is free indeed." John 8:36\n\nWELCOME\nWe are glad you are here. First-time guests, please stop by the usher at the door for a welcome card.\n\nTHIS WEEK\n- Monday: After-School Program, 5:00 PM\n- Tuesday: Spiritual Guidance & Counseling 5:00 PM · Bible Study 7:00 PM\n- Tuesday: Community Conversation, 5:45 PM (2nd & 4th Tuesdays)\n- Wednesday: FeedMore Food Distribution 1:00 PM · After-School Program 5:00 PM\n- Friday: Choir Rehearsal, 7:00 PM\n- Saturday: FeedMore Food Distribution, 11:00 AM\n\nTHEME FOR 2026\nJust because God hasn\'t done it doesn\'t mean He won\'t do it.\n\nGIVING\nGive online at the church website or in the member portal.' },
    { id: 'dr_2', agentId: 'finance', title: 'Weekly giving summary', kind: 'Report', module: 'finance', reviewerRole: 'finance', status: 'pending', createdAt: daysFromNow(0), body: 'Giving summary for the week ending Sunday.\n\nTithes & Offerings: about 70% of gifts\nCommunity Center: about 7%\n\nFlags for review:\n- Benevolence request of $280 pending (care request c_3)\n- Thanksgiving food order of $2,600 exceeds the Culinary Arts monthly line\n- 4 first-time online givers this month: send a thank-you note' },
    { id: 'dr_3', agentId: 'member', title: 'Welcome letters for 7 first-time guests', kind: 'Letters', module: 'members', reviewerRole: 'admin', status: 'pending', createdAt: daysFromNow(0), body: 'Dear {first name},\n\nThank you for worshiping with us at New Life Deliverance Tabernacle. We pray you felt the warmth of this church family. Whatever you are carrying, you do not have to carry it alone. If we can pray with you, or help in any way, simply reply to this letter or call the church office at (804) 233-2730.\n\nJoin us again Sunday at 9:45 AM, or for Bible Study on Tuesday at 7:00 PM.\n\nWho the Son sets free is free indeed.\n\nThe Pastors of New Life Deliverance Tabernacle' },
    { id: 'dr_4', agentId: 'event', title: 'Thanksgiving dinner logistics checklist', kind: 'Checklist', module: 'events', reviewerRole: 'admin', status: 'pending', createdAt: daysFromNow(-1), body: 'Thanksgiving Community Dinner\n\nReserved: Fellowship Hall and Kitchen\nOpen items:\n- 25 volunteer shifts still open (cooking, serving, cleanup)\n- Food order of $2,600 awaiting Finance approval\n- Transportation ministry: plan two pickup loops for seniors\n- Invitation SMS to the community list needs approval' },
    { id: 'dr_5', agentId: 'outreach', title: 'Pantry day social post', kind: 'Social post', module: 'comms', reviewerRole: 'secretary', status: 'pending', createdAt: daysFromNow(-1), body: 'Free groceries for our neighbors.\nEvery Wednesday 1 to 3 PM and Saturday 11 AM to 1 PM at 900 Decatur Street.\nNo paperwork, no eligibility requirement. Just come.\nIn partnership with FeedMore.\n#SouthRichmond #Blackwell #Manchester' },
    { id: 'dr_6', agentId: 'facilities', title: 'Work order: van brakes (urgent)', kind: 'Work order', module: 'facilities', reviewerRole: 'admin', status: 'pending', createdAt: daysFromNow(-1), body: 'Vehicle: Church van (14-passenger)\nIssue: Brake noise reported by Deacon Mathews\nAction: Remove from service until inspected. Quote from Southside Auto Service: $610.\nImpact: Sunday route and after-school rides need a backup plan this week.' },
    { id: 'dr_7', agentId: 'grants', title: 'Funding brief: 3 deadlines in the next 120 days', kind: 'Funding brief', module: 'grants', reviewerRole: 'admin', status: 'pending', createdAt: daysFromNow(0), body: 'Grant Advisor weekly brief\n\n1. Section 5310 accessible van: application window opens December 1, closes February 1. Fit: 86. Next step: start logging every ride now to show demand.\n2. Project Safe Neighborhoods: 2027 round expected around January 15. Fit: 89. Next step: request an RPD support letter.\n3. City of Richmond opioid settlement funds: next request for applications expected in the first quarter. Fit: 88. Next step: partner with RBHA on an evidence-based curriculum.\n\nReadiness blocker: SAM.gov registration for New Life Community Center is not done. It is required for most federal pass-through funds and can take weeks. Recommend starting this week.\n\nOutside the box: Launch recurring online giving with the new website. It is the fastest dollar available and needs no application.' },
    { id: 'dr_8', agentId: 'member', title: 'Members with no contact in 90+ days', kind: 'List', module: 'members', reviewerRole: 'admin', status: 'pending', createdAt: daysFromNow(0), body: 'Active members have had no recorded contact in more than 90 days. Suggested: assign to the deacons for a check-in call this week. The list is in Members under "Needs follow-up".' },
  ]

  const approvals: Approval[] = [
    { id: 'ap_1', kind: 'expense', title: 'Two wireless choir microphones', requester: 'Min. Kevin Dixon', amount: 980, status: 'pending', createdAt: daysFromNow(-1), relatedId: 'x_2', relatedModule: 'finance' },
    { id: 'ap_2', kind: 'expense', title: 'Fall youth field trip admission', requester: 'Sandra Sykes', amount: 540, status: 'pending', createdAt: daysFromNow(-2), relatedId: 'x_3', relatedModule: 'finance' },
    { id: 'ap_3', kind: 'expense', title: 'Thanksgiving dinner food order', requester: 'Walter Fenner', amount: 2600, status: 'pending', createdAt: daysFromNow(0), relatedId: 'x_4', relatedModule: 'finance' },
    { id: 'ap_4', kind: 'event', title: 'Thanksgiving Community Dinner (proposal)', requester: 'Culinary Arts', amount: 2600, status: 'pending', createdAt: daysFromNow(-1), relatedId: 'e_6', relatedModule: 'events' },
    { id: 'ap_5', kind: 'reservation', title: 'Fellowship Hall: Blackwell Civic Association', requester: 'External', amount: 150, status: 'pending', createdAt: daysFromNow(-2), relatedId: 'rs_1', relatedModule: 'facilities' },
    { id: 'ap_6', kind: 'reservation', title: 'Fellowship Hall: family repast', requester: 'Bereavement ministry', status: 'pending', createdAt: daysFromNow(-1), relatedId: 'rs_2', relatedModule: 'facilities' },
    { id: 'ap_7', kind: 'reservation', title: 'Community Center: RBHA prevention workshop', requester: 'External partner', status: 'pending', createdAt: daysFromNow(0), relatedId: 'rs_3', relatedModule: 'facilities' },
    { id: 'ap_8', kind: 'communication', title: 'Thanksgiving volunteers SMS', requester: 'Church Office', status: 'pending', createdAt: daysFromNow(0), relatedId: 'an_2', relatedModule: 'comms' },
    { id: 'ap_9', kind: 'hire', title: 'After-school tutor (background check pending)', requester: 'Community Center', status: 'pending', createdAt: daysFromNow(-4), relatedId: 's_6', relatedModule: 'people' },
  ]

  const tasks: Task[] = [
    { id: 't_1', title: 'Call 7 first-time guests from Sunday', assigneeId: L.shelby, due: daysFromNow(2), status: 'todo', module: 'members', priority: 'high' },
    { id: 't_2', title: 'Reconcile Sunday deposit with the bank', assigneeId: L.finance, due: daysFromNow(1), status: 'doing', module: 'finance', priority: 'high' },
    { id: 't_3', title: 'Start SAM.gov registration for the Community Center', assigneeId: L.phyllis, due: daysFromNow(7), status: 'todo', module: 'grants', priority: 'high' },
    { id: 't_4', title: 'Get van brake repair scheduled', assigneeId: L.landis, due: daysFromNow(1), status: 'doing', module: 'facilities', priority: 'high' },
    { id: 't_5', title: 'Renew the van driver\'s background check', assigneeId: L.phyllis, due: daysFromNow(5), status: 'todo', module: 'people', priority: 'high' },
    { id: 't_6', title: 'Request a security vulnerability assessment', assigneeId: L.phyllis, due: daysFromNow(21), status: 'todo', module: 'grants', priority: 'normal' },
    { id: 't_7', title: 'Submit CACFP meal sponsor application', assigneeId: L.sandra, due: daysFromNow(30), status: 'todo', module: 'grants', priority: 'normal' },
    { id: 't_8', title: 'Order bags for Saturday pantry', assigneeId: L.tashabe, due: daysFromNow(3), status: 'done', module: 'outreach', priority: 'low' },
    { id: 't_9', title: 'Post open volunteer shifts', assigneeId: L.phyllis, due: daysFromNow(-1), status: 'done', module: 'people', priority: 'normal' },
    { id: 't_10', title: 'Restock welcome cards at the doors', assigneeId: L.yolanda, due: daysFromNow(6), status: 'todo', module: 'office', priority: 'low' },
  ]

  const sermons = [
    { id: 'sm_1', title: 'Believe It to Receive It', speaker: 'Pastor Robert A. Winfree', date: daysFromNow(-7), series: 'Theme for 2026', scripture: 'Mark 11:22-24', duration: '44:10', description: 'Just because God hasn\'t done it doesn\'t mean He won\'t do it.', views: 312 },
    { id: 'sm_2', title: 'Free Indeed', speaker: 'Pastor Michael L. Winfree', date: daysFromNow(-14), series: 'Deliverance', scripture: 'John 8:31-36', duration: '39:25', description: 'Freedom is not a feeling; it is a fact for everyone the Son sets free.', views: 268 },
    { id: 'sm_3', title: 'The Spirit of the Lord Is Upon Us', speaker: 'Rev. Phyllis D. Alexander', date: daysFromNow(-21), series: 'Our Mission', scripture: 'Luke 4:18-19', duration: '36:48', description: 'Good news to the poor, healing for the brokenhearted, liberty for the captives.', views: 241 },
    { id: 'sm_4', title: 'Renewed in Your Mind', speaker: 'Rev. Phyllis D. Alexander', date: daysFromNow(-28), series: 'Transformed', scripture: 'Romans 12:1-2', duration: '35:02', description: 'Transformation begins where the battle is fought: the mind.', views: 199 },
    { id: 'sm_5', title: 'He Who Began a Good Work', speaker: 'Pastor Robert A. Winfree', date: daysFromNow(-35), series: 'Theme for 2026', scripture: 'Philippians 1:6', duration: '42:30', description: 'God finishes what He starts in you.', views: 287 },
    { id: 'sm_6', title: 'Feed My Sheep', speaker: 'Pastor Michael L. Winfree', date: daysFromNow(-42), series: 'Building the Body Together', scripture: 'John 21:15-17', duration: '38:16', description: 'Shepherding as service: why New Life feeds bodies and souls.', views: 230 },
  ]

  const attendance: Attendance[] = []
  for (let w = 1; w <= 26; w++) {
    const d = new Date(); d.setDate(d.getDate() - (d.getDay() + 7 * w))
    attendance.push({ id: `at_${w}`, date: d.toISOString().slice(0, 10), service: '9:45 AM', count: between(118, 168), firstTime: between(0, 6) })
  }

  const pantry: PantryDay[] = []
  for (let w = 1; w <= 16; w++) {
    ;([[3, 'Wednesday'], [6, 'Saturday']] as const).forEach(([wd, day]) => {
      const households = day === 'Saturday' ? between(52, 78) : between(38, 62)
      const individuals = Math.round(households * (2.4 + rand() * 0.6))
      pantry.push({ id: `pd_${w}_${wd}`, date: pastWeekday(wd, w), day, households, individuals, seniors: Math.round(individuals * (0.24 + rand() * 0.1)), children: Math.round(individuals * (0.3 + rand() * 0.1)), pounds: Math.round(households * (22 + rand() * 8)), volunteers: between(7, 14), newHouseholds: between(1, 7) })
    })
  }
  pantry.sort((a, b) => b.date.localeCompare(a.date))

  const afterSchool: AfterSchoolDay[] = []
  const activities = ['Homework help & reading', 'Math circles', 'STEM night', 'Financial literacy', 'Art & expression', 'Fitness & self-defense', 'Career talk with a first responder', 'Field trip prep']
  for (let w = 1; w <= 16; w++) {
    ;[1, 3].forEach((wd) => {
      const students = between(19, 31)
      afterSchool.push({ id: `as_${w}_${wd}`, date: pastWeekday(wd, w), students, tutoringHours: Math.round(students * 1.6), meals: students, mentors: between(4, 7), activity: pick(activities) })
    })
  }
  afterSchool.sort((a, b) => b.date.localeCompare(a.date))

  const audit = [
    { id: 'au_1', at: `${daysFromNow(0)} 07:14`, who: 'Grant Advisor', action: 'Drafted funding brief', target: '3 deadlines in the next 120 days' },
    { id: 'au_2', at: `${daysFromNow(0)} 07:12`, who: 'Facilities Agent', action: 'Opened work order', target: 'Van brakes (urgent)' },
    { id: 'au_3', at: `${daysFromNow(0)} 07:10`, who: 'Finance Agent', action: 'Drafted report', target: 'Weekly giving summary' },
    { id: 'au_4', at: `${daysFromNow(0)} 07:09`, who: 'Member Agent', action: 'Drafted letters', target: '7 first-time guests' },
    { id: 'au_5', at: `${daysFromNow(-1)} 16:40`, who: 'Rev. Phyllis D. Alexander', action: 'Approved announcement', target: 'Community Conversation this Tuesday' },
    { id: 'au_6', at: `${daysFromNow(-3)} 15:05`, who: 'Deacon Tashabe Jackson', action: 'Logged pantry day', target: 'Saturday distribution' },
  ]

  return {
    version: 1,
    entered: false,
    role: 'pastor',
    accountId: 'acc_robert',
    currentMemberId: 'm_1',
    church: {
      name: 'New Life Deliverance Tabernacle', shortName: 'New Life', tagline: 'Who the Son sets free is free indeed.',
      pastor: 'Rev. Dr. Robert A. Winfree', pastorTitle: 'Founder & Senior Pastor', address: '900 Decatur Street', city: 'Richmond, VA 23224', phone: '(804) 233-2730', email: '900newlife@gmail.com',
      services: [{ day: 'Sunday', time: '9:45 AM', label: 'Sunday Worship' }, { day: 'Tuesday', time: '7:00 PM', label: 'Bible Study' }, { day: 'Wednesday & Saturday', time: '1:00 PM / 11:00 AM', label: 'FeedMore Food Distribution' }],
      founded: '1997', denomination: 'Non-denominational, Spirit-filled', website: 'newlifedeliverancetabernacle.us',
    },
    settings: {
      tourDone: false, agentsEnabled: true, mfa: true, guideOn: true,
      integrations: [
        { id: 'stripe', name: 'Stripe (online & recurring giving)', status: 'connected' }, { id: 'qbo', name: 'QuickBooks Online', status: 'available' }, { id: 'twilio', name: 'Twilio SMS (pantry reminders)', status: 'connected' },
        { id: 'facebook', name: 'Facebook Live', status: 'connected' }, { id: 'youtube', name: 'YouTube', status: 'available' }, { id: 'gcal', name: 'Google Calendar', status: 'available' },
        { id: 'checkr', name: 'Background checks', status: 'connected' }, { id: 'feedmore', name: 'FeedMore agency reporting export', status: 'planned' }, { id: 'sam', name: 'SAM.gov / Grants.gov tracking', status: 'planned' },
      ],
      tenants: [
        { id: 'tn_1', name: 'New Life Deliverance Tabernacle', plan: 'Church Operations Pro', members: members.length, status: 'Demo' },
        { id: 'tn_2', name: 'New Life Community Center (501(c)(3))', plan: 'Linked nonprofit workspace', members: 0, status: 'Demo' },
      ],
    },
    members, households, funds, gifts, budgets, expenses, ministries, events, registrations, rooms, reservations, maintenance, assets, staff, shifts, care, services,
    announcements, campaigns, documents, meetings, partners, businesses, grants, programs, drafts, approvals, tasks, sermons, attendance, audit,
    opportunities: opportunities.map((o) => ({ ...o })), readiness: readiness.map((r) => ({ ...r })), pantry, afterSchool,
  }
}
