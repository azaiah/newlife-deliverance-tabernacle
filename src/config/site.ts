/**
 * New Life Deliverance Tabernacle: public facts used across the website.
 * Source: the church's current website (newlifedeliverancetabernacle.us), its Facebook page and
 * the City of Richmond FeedMore pantry list, verified October 2026.
 * Search "TODO: confirm with church" before launch.
 */
export const church = {
  name: 'New Life Deliverance Tabernacle',
  short: 'New Life',
  initials: 'NLDT',
  scripture: 'Who the Son sets free is free indeed.',
  scriptureRef: 'John 8:36',
  founded: 1997,
  address: '900 Decatur Street',
  street: '900 Decatur St',
  city: 'Richmond',
  state: 'VA',
  zip: '23224',
  neighborhood: 'South Richmond',
  phone: '(804) 233-2730',
  phoneHref: 'tel:+18042332730',
  email: '900newlife@gmail.com',
  centerEmail: 'newlifecomcenter@gmail.com',
  facebook: 'https://www.facebook.com/newlifenldt',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=900+Decatur+St+Richmond+VA+23224',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=900+Decatur+St+Richmond+VA+23224',
  centerName: 'New Life Community Center',
  centerEin: '83-4614645',
  theme2026: {
    line1: 'Just because God hasn’t done it',
    line2: 'doesn’t mean He won’t do it.',
    line3: 'He’s waiting for you to believe it, so that you can receive it.',
  },
  mission:
    'The Spirit of the Lord God is upon the people of New Life Deliverance Tabernacle. The Lord God has anointed the people of New Life Deliverance Tabernacle to preach the “Good News” to the poor in spirit. The Lord God is sending the people of God called New Life Deliverance Tabernacle to heal the broken hearted, to lead His people out of bondage, to open prison doors and to set the captives free. To empower all of God’s people both spiritually and physically through feeding the hungry, clothing the naked, visiting the sick and widowed. Above all to win souls for Christ as we are led by the Holy Spirit of God.',
  vision:
    'To build a loving, faith-driven community where every individual experiences spiritual growth and profound connection. By fostering unity and nurturing resilience, we aim to break chains of adversity and transform lives.',
  centerMission: 'To provide equal access to programs and services for at-risk youth as they strive to discover, develop, and become the best version of themselves.',
  formNames: { contact: 'nldt-contact', prayer: 'nldt-prayer', help: 'nldt-help', visit: 'nldt-visit', volunteer: 'nldt-volunteer' },
} as const

export type WeeklyItem = { day: string; short: string; dayIndex: number; time: string; title: string; detail: string; kind: 'worship' | 'study' | 'care' | 'outreach' | 'youth' | 'music' | 'fellowship'; where: string }

/** The weekly rhythm at New Life (from the church's published schedule). */
export const weekly: WeeklyItem[] = [
  { day: 'Sunday', short: 'Sun', dayIndex: 0, time: '9:45 AM', title: 'Sunday Worship', detail: 'Spirit-filled praise, the preached Word and fellowship. The building is open until 2:00 PM.', kind: 'worship', where: 'Sanctuary' },
  { day: 'Monday', short: 'Mon', dayIndex: 1, time: '5:00 to 7:00 PM', title: 'After-School Program', detail: 'Homework help, tutoring, mentorship and a safe, encouraging place to grow.', kind: 'youth', where: 'Community Center' },
  { day: 'Tuesday', short: 'Tue', dayIndex: 2, time: '5:00 to 7:00 PM', title: 'Spiritual Guidance & Counseling', detail: 'Confidential one-on-one support grounded in biblical principles.', kind: 'care', where: 'Pastoral office' },
  { day: 'Tuesday', short: 'Tue', dayIndex: 2, time: '5:45 to 6:45 PM', title: 'Community Conversation', detail: '2nd and 4th Tuesdays. Your voice matters: discuss concerns, share solutions, connect with neighbors and business owners.', kind: 'outreach', where: 'Fellowship Hall' },
  { day: 'Tuesday', short: 'Tue', dayIndex: 2, time: '7:00 to 8:00 PM', title: 'Bible Study', detail: 'Dive deep into the Word with open discussion and fellowship.', kind: 'study', where: 'Bible Study Room' },
  { day: 'Wednesday', short: 'Wed', dayIndex: 3, time: '1:00 to 3:00 PM', title: 'FeedMore Food Distribution', detail: 'Free groceries for neighbors. No eligibility requirement.', kind: 'outreach', where: 'Fellowship Hall' },
  { day: 'Wednesday', short: 'Wed', dayIndex: 3, time: '5:00 to 7:00 PM', title: 'After-School Program', detail: 'Homework help, tutoring and mentoring for students.', kind: 'youth', where: 'Community Center' },
  { day: 'Friday', short: 'Fri', dayIndex: 5, time: '7:00 PM', title: 'Choir Rehearsal', detail: 'Lift your voice. Seasoned singers and newcomers welcome.', kind: 'music', where: 'Sanctuary' },
  { day: 'Saturday', short: 'Sat', dayIndex: 6, time: '11:00 AM to 1:00 PM', title: 'FeedMore Food Distribution', detail: 'Free groceries for neighbors. No eligibility requirement.', kind: 'outreach', where: 'Fellowship Hall' },
  { day: 'Saturday', short: 'Sat', dayIndex: 6, time: '1:30 to 3:00 PM', title: 'Women’s Ministry', detail: 'Every 3rd Saturday. Fellowship, the Word and encouragement.', kind: 'fellowship', where: 'Fellowship Hall' },
]

export const officeHours = [
  { d: 'Monday to Friday', h: '11:00 AM to 4:00 PM' },
  { d: 'Saturday', h: '11:00 AM to 1:00 PM' },
  { d: 'Sunday', h: '9:45 AM to 2:00 PM' },
]

/** Kept for the staff Help page */
export const site = { email: church.email, phone: church.phone }
