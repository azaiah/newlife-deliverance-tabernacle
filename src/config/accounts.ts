import type { Role } from '@/data/types'

/**
 * Demo sign-in accounts. Leaders are the people New Life Deliverance Tabernacle lists publicly on its own website,
 * with the titles the church uses. No personal data about them is invented beyond their public role:
 * no giving history, no care notes. Emails are demo addresses on a non-routable domain.
 * The member account is a clearly labeled sample person.
 */
export type DemoAccount = {
  id: string
  memberId: string
  name: string
  title: string
  role: Role
  /** Ministries this person leads or serves in; scopes Ministry Leader and Volunteer views. */
  ministryIds: string[]
  email: string
  /** Where this account lands after sign-in. */
  home: string
  group: 'Pastoral leadership' | 'Church administration' | 'Ministry leaders' | 'Volunteers' | 'Members' | 'Support'
  sample?: boolean
  blurb: string
}

export const demoAccounts: DemoAccount[] = [
  { id: 'acc_robert', memberId: 'm_1', name: 'Rev. Dr. Robert A. Winfree', title: 'Founder & Senior Pastor', role: 'pastor', ministryIds: [], email: 'pastor.winfree@newlife.example', home: '/admin', group: 'Pastoral leadership', blurb: 'Executive dashboard, ministry oversight, approvals and leadership reports.' },
  { id: 'acc_michael', memberId: 'm_2', name: 'Rev. Michael L. Winfree', title: 'Pastor', role: 'pastor', ministryIds: ['min_worship', 'min_men'], email: 'pastor.michael@newlife.example', home: '/admin', group: 'Pastoral leadership', blurb: 'Shared pastoral view: care queue, worship planning and ministry health.' },
  { id: 'acc_phyllis', memberId: 'm_3', name: 'Rev. Phyllis D. Alexander', title: 'Church Administrator & Associate Pastor', role: 'admin', ministryIds: ['min_care'], email: 'administrator@newlife.example', home: '/admin/action-center', group: 'Church administration', blurb: 'Operations, staff workflows, facilities, approvals and grant readiness.' },
  { id: 'acc_finance', memberId: 'm_15', name: 'Finance Office', title: 'Finance Officer (sample account)', role: 'finance', ministryIds: [], email: 'finance@newlife.example', home: '/admin/finance', group: 'Church administration', sample: true, blurb: 'Giving, reconciliation, budgets, expenses and giving statements.' },
  { id: 'acc_office', memberId: 'm_16', name: 'Church Office', title: 'Church Secretary (sample account)', role: 'secretary', ministryIds: [], email: 'office@newlife.example', home: '/admin/office', group: 'Church administration', sample: true, blurb: 'Bulletins, announcements, scheduling, letters and incoming requests.' },
  { id: 'acc_shelby', memberId: 'm_4', name: 'Deacon Shelby Vincent', title: 'Diaconate', role: 'ministry', ministryIds: ['min_deacons'], email: 'deacons@newlife.example', home: '/admin/ministries', group: 'Ministry leaders', blurb: 'Deacon care visits, benevolence follow-up and the diaconate roster.' },
  { id: 'acc_tashabe', memberId: 'm_7', name: 'Deacon Tashabe Jackson', title: 'Community Conversations & Outreach', role: 'ministry', ministryIds: ['min_outreach'], email: 'outreach@newlife.example', home: '/admin/outreach', group: 'Ministry leaders', blurb: 'Food pantry days, community requests and Community Conversations.' },
  { id: 'acc_landis', memberId: 'm_6', name: 'Deacon Landis Mathews', title: 'Transportation Ministry', role: 'ministry', ministryIds: ['min_transport'], email: 'transportation@newlife.example', home: '/admin/outreach?tab=rides', group: 'Ministry leaders', blurb: 'Ride requests, driver schedule and van maintenance.' },
  { id: 'acc_kevin', memberId: 'm_5', name: 'Min. Kevin Dixon', title: 'Music Ministry Director', role: 'ministry', ministryIds: ['min_music'], email: 'music@newlife.example', home: '/admin/ministries', group: 'Ministry leaders', blurb: 'Choir rehearsals, musicians, worship sets and the music budget.' },
  { id: 'acc_walter', memberId: 'm_13', name: 'Walter Fenner', title: 'Culinary Arts Ministry', role: 'ministry', ministryIds: ['min_culinary'], email: 'culinary@newlife.example', home: '/admin/ministries', group: 'Ministry leaders', blurb: 'Repasts, fellowship meals, kitchen schedule and food budget.' },
  { id: 'acc_robin', memberId: 'm_8', name: 'Robin Chaney', title: 'Bereavement Ministry', role: 'ministry', ministryIds: ['min_bereavement'], email: 'bereavement@newlife.example', home: '/admin/ministries', group: 'Ministry leaders', blurb: 'Comfort for grieving families, repast coordination and follow-up.' },
  { id: 'acc_sandra', memberId: 'm_14', name: 'Sandra Sykes', title: 'Director of Extended Programs', role: 'ministry', ministryIds: ['min_youth', 'min_center'], email: 'programs@newlife.example', home: '/admin/outreach?tab=afterschool', group: 'Ministry leaders', blurb: 'After-school attendance, tutoring hours, youth trips and the Community Center.' },
  { id: 'acc_yolanda', memberId: 'm_9', name: 'Yolanda Jacobus', title: 'Ushers Ministry', role: 'volunteer', ministryIds: ['min_ushers'], email: 'ushers@newlife.example', home: '/admin/people?tab=schedule', group: 'Volunteers', blurb: 'Sunday serving schedule, assignments and team contacts.' },
  { id: 'acc_member', memberId: 'm_20', name: 'Angela Brooks', title: 'Member (sample person)', role: 'member', ministryIds: [], email: 'angela.brooks@example.com', home: '/portal', group: 'Members', sample: true, blurb: 'Member portal: giving, statements, events, ministries and prayer requests.' },
  { id: 'acc_support', memberId: 'm_15', name: 'DataIsData Support', title: 'Platform support (limited)', role: 'support', ministryIds: [], email: 'support@dataisdata.example', home: '/admin/settings', group: 'Support', blurb: 'Technical settings only, under an authorized support arrangement.' },
]

export const accountById = (id?: string) => demoAccounts.find((a) => a.id === id)
export const defaultAccountForRole = (role: Role) => demoAccounts.find((a) => a.role === role) ?? demoAccounts[0]
