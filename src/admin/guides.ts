/**
 * Plain-language walkthrough guides for non-technical church staff.
 * Each module: what it is for, who usually owns it, what you can hand off, and a step-by-step tour.
 */
export type GuideStep = { title: string; text: string; to?: string; cta?: string }
export type Guide = {
  path: string; title: string; plain: string; owner: string; handoff: string[]; steps: GuideStep[]
}

export const guides: Guide[] = [
  { path: '/admin', title: 'Dashboard', owner: 'Pastor and Church Administrator',
    plain: 'Think of this as the one-page report you used to have to ask five people for. It pulls numbers from every other tool so leadership can see how the church is doing without calling the office.',
    handoff: ['Nothing to assign here. This page only reads what the other tools already know.', 'Use "What needs my attention" as the Monday huddle agenda.'],
    steps: [
      { title: 'Read the four big numbers', text: 'Active members, this month’s giving, open requests and upcoming events. Each one is a button. Click it to go to the tool that owns the number.' },
      { title: 'Scan "What needs my attention"', text: 'These are exceptions, not routine work: visitors nobody has called, approvals waiting, urgent repairs. Each line takes you straight to the fix.', to: '/admin', cta: 'Show me' },
      { title: 'Answer the leadership questions', text: 'Are we growing? Which ministries need support? What impact are we making? The small panels answer these from live records, and "Open" takes you to the detail.' },
      { title: 'Check the Monday Morning Package', text: 'The AI agents prepare a bundle of drafts after Sunday. Nothing in it is sent until a person approves it. Open AI Agents to review.', to: '/admin/agents', cta: 'Open AI Agents' },
    ] },
  { path: '/admin/action-center', title: 'Action Center', owner: 'Church Administrator (with Finance Officer and Church Secretary for their areas)',
    plain: 'This is the church’s inbox for decisions. Anything that needs a yes or no from a person lands here: expense requests, event proposals, room bookings, messages waiting to go out, and drafts the AI agents prepared.',
    handoff: ['Expense approvals go to the Finance Officer.', 'Communications approvals go to the Church Secretary.', 'Events, facilities and new volunteers go to the Church Administrator.', 'Tasks can be checked off by whoever owns them.'],
    steps: [
      { title: 'Approvals tab', text: 'Each card says what is being asked, who asked, and how much. Approve or Reject. The decision flows back to the right tool automatically: an approved expense shows as approved in Finance, an approved booking turns green in Facilities.', to: '/admin/action-center?tab=approvals', cta: 'Open approvals' },
      { title: 'Agent drafts tab', text: 'The AI agents wrote these: a bulletin, a welcome letter, a giving summary. Click Review to read and edit the words before approving. Approving a bulletin moves it to the Office; approving a report files it in Documents.', to: '/admin/action-center?tab=drafts', cta: 'Open drafts' },
      { title: 'Tasks tab', text: 'Everyday to-dos with an owner and a due date. Check the box when done. Overdue tasks are counted at the top.', to: '/admin/action-center?tab=tasks', cta: 'Open tasks' },
      { title: 'Why some buttons are missing', text: 'If you see "Requires Finance Officer", your role is not allowed to make that decision. That is deliberate: the system enforces who can approve what.' },
    ] },
  { path: '/admin/members', title: 'Members', owner: 'Church Secretary and Hospitality team (visitors); Pastor (pastoral care)',
    plain: 'The church directory, upgraded. Every member, family, visitor and attendee has one record with contact details, ministries, event history and notes. Visitors move through a pipeline so nobody is forgotten.',
    handoff: ['Welcome calls to first-time visitors: Hospitality team.', 'Updating addresses and household changes: Church Secretary.', 'Pastoral care requests: Pastor or care coordinator only.', 'Monthly "needs follow-up" list: deacons.'],
    steps: [
      { title: 'Search the directory', text: 'Type a name, email or phone. Use the filter to show only visitors, members, or people with no contact in 90+ days.', to: '/admin/members?tab=directory', cta: 'Open directory' },
      { title: 'Open a person', text: 'Click any row. You see their household, ministries, events and a place to log a call. Giving and pastoral care sections only appear if your role is allowed to see them.' },
      { title: 'Work the visitor pipeline', text: 'Visitors appear here the moment they fill out a form on the church website. "Log welcome call" moves them forward. When they register for orientation they move again.', to: '/admin/members?tab=visitors', cta: 'Open pipeline' },
      { title: 'Pastoral care queue', text: 'Prayer and care requests from the website land here. Assign to the pastor or outreach, add updates, close when resolved. Confidential requests are hidden from roles that should not see them.', to: '/admin/members?tab=care', cta: 'Open care queue' },
      { title: 'Add someone by hand', text: 'Use "Add person" for walk-ins or phone calls. The system checks for duplicate emails and creates a welcome-call task for a new visitor.' },
    ] },
  { path: '/admin/finance', title: 'Finance', owner: 'Finance Officer (detail); Pastor and Church Administrator (summary)',
    plain: 'Where the money is tracked: every gift, every fund, every ministry budget and every expense request. QuickBooks keeps doing the accounting; this is the view everyone can understand, with approvals built in.',
    handoff: ['Weekly reconciliation of Sunday deposits: Finance Officer.', 'Approving expense requests: Finance Officer (board for anything over $2,500).', 'Marking approved expenses as paid: Finance Officer.', 'Year-end giving statements: Finance Officer each January.'],
    steps: [
      { title: 'Overview', text: 'Six months of giving, a breakdown by fund, and a simple month view of money in versus money out.', to: '/admin/finance?tab=overview', cta: 'Open overview' },
      { title: 'Giving', text: 'Every gift. Online gifts from the website arrive as "recorded". After you match them to the bank deposit, click Reconcile (or Reconcile all).', to: '/admin/finance?tab=giving', cta: 'Open giving' },
      { title: 'Funds and budgets', text: 'Funds show what is restricted (building) versus general. Budgets show each ministry’s planned versus actual for the month; red means over.', to: '/admin/finance?tab=budgets', cta: 'Open budgets' },
      { title: 'Expenses', text: 'Ministry leaders request, Finance approves, then marks paid. Paying an expense updates the ministry’s budget line automatically.', to: '/admin/finance?tab=expenses', cta: 'Open expenses' },
      { title: 'Statements', text: 'Pick a donor and download their annual statement. In January this runs for everyone and posts to each member’s portal.', to: '/admin/finance?tab=statements', cta: 'Open statements' },
    ] },
  { path: '/admin/office', title: 'Office', owner: 'Church Secretary',
    plain: 'The secretary’s desk. Announcements, the Sunday bulletin, letters, the document cabinet, meeting agendas, and the inbox of requests that came in through the website, each already routed to the right person.',
    handoff: ['Writing and sending announcements: Church Secretary (pastor approves).', 'Wednesday bulletin: Church Secretary reviews the agent’s draft.', 'Letters and thank-you notes: Church Secretary.', 'Meeting agendas and action items: Church Administrator.'],
    steps: [
      { title: 'Announcements', text: 'Draft, approve, schedule, send. Pick the channels: bulletin, website, email, text. Sending creates a campaign record automatically.', to: '/admin/office?tab=announcements', cta: 'Open announcements' },
      { title: 'Bulletin', text: 'Generated from the calendar and approved announcements. Download or print. The Office Agent prepares it every Wednesday.', to: '/admin/office?tab=bulletin', cta: 'Open bulletin' },
      { title: 'Letters', text: 'Choose a template and a person. The letter fills itself in. "Mark as sent" updates their last-contact date.', to: '/admin/office?tab=letters', cta: 'Open letters' },
      { title: 'Documents and meetings', text: 'Policies, minutes, forms and agreements in one searchable list. Meetings keep an agenda and action items you can tick off.', to: '/admin/office?tab=documents', cta: 'Open documents' },
      { title: 'Incoming', text: 'Every website form that arrived today and where it went. Nothing waits in a personal email inbox.', to: '/admin/office?tab=requests', cta: 'Open incoming' },
    ] },
  { path: '/admin/ministries', title: 'Ministries', owner: 'Each ministry leader for their own ministry; Church Administrator across all',
    plain: 'A private workspace for each ministry: its people, calendar, budget lines, volunteer shifts and monthly report. Leaders see only their own ministry. Leadership sees all of them.',
    handoff: ['Event requests: the ministry leader submits, the Church Administrator approves.', 'Keeping the roster current: the ministry leader.', 'Monthly activity report: prepared automatically, confirmed by the leader.'],
    steps: [
      { title: 'Pick a ministry', text: 'The colored pills switch workspaces. A ministry leader only sees one.', to: '/admin/ministries', cta: 'Open ministries' },
      { title: 'Check budget and volunteers', text: 'Budget lines turn red when over plan. Open volunteer shifts show as gold "Open" badges.' },
      { title: 'Request an event', text: 'Fill in the form. The Event Agent checks the room calendar for conflicts and an approval goes to the Church Administrator. On approval the room is reserved and the registration page goes live.', to: '/admin/ministries', cta: 'Try a request' },
    ] },
  { path: '/admin/agents', title: 'AI Agents', owner: 'Church Administrator (pause/resume); each agent’s drafts go to the role named on its card',
    plain: 'Six assistants that do the repetitive paperwork: draft the bulletin, write welcome letters, summarize giving, check calendars, plan logistics, open work orders. They never send, pay or publish anything. A person always approves first.',
    handoff: ['Office Agent drafts: Church Secretary.', 'Finance Agent reports: Finance Officer.', 'Member, Event and Facilities Agent items: Church Administrator.', 'Outreach Agent campaigns: Church Secretary.'],
    steps: [
      { title: 'Read the Monday Morning Package', text: 'Six items assembled after Sunday: giving and attendance, visitor follow-ups, events, volunteer gaps, maintenance, newsletter draft.', to: '/admin/agents', cta: 'Open agents' },
      { title: 'Review a draft', text: 'Click Review. Edit the text if you like, then Approve or Reject. Approved items move to the tool that uses them.' },
      { title: 'Run the package yourself', text: '"Run Monday package now" creates fresh drafts from today’s data so you can see the cycle.' },
      { title: 'Pause everything', text: 'Leadership can pause all agents with one switch. The guardrails panel explains what agents can and cannot see.' },
    ] },
  { path: '/admin/events', title: 'Events', owner: 'Church Administrator (approvals); the owning ministry leader (details)',
    plain: 'Every event walks through the same eight steps, from idea to impact report, so everyone knows what stage it is in and who is responsible next. Public events appear on the church website automatically.',
    handoff: ['Approving a proposed event and its budget: Church Administrator.', 'Confirming the room: Facilities.', 'Publishing registration and promoting: Church Secretary.', 'Recording attendance afterwards: the ministry leader.'],
    steps: [
      { title: 'The lifecycle board', text: 'Columns are stages. Cards are events. "Advance" moves an event to the next stage and does the work for that stage (reserving the room, opening registration, asking the Event Agent for an impact report).', to: '/admin/events?view=board', cta: 'Open board' },
      { title: 'Open an event', text: 'Click a card for owner, budget, registrations and the export list. Record attendance once it has happened.' },
      { title: 'List view', text: 'The same events as a simple dated list with registration counts.', to: '/admin/events?view=list', cta: 'Open list' },
    ] },
  { path: '/admin/facilities', title: 'Facilities', owner: 'Church Administrator; facilities contractor for repairs',
    plain: 'The building book. Who has which room and when, requests to use the hall (including paid rentals from outside groups), repairs that need doing, and the equipment and insurance dates you must not miss.',
    handoff: ['Approving room requests and rentals: Church Administrator.', 'Doing the repairs: facilities contractor or vendor.', 'Recording rental payments: Finance Officer.', 'Insurance and service renewals: Church Administrator (reminded by the Facilities Agent).'],
    steps: [
      { title: 'Rooms this week', text: 'A grid of every room by day. Blue is a church event, green an approved booking, gold still waiting.', to: '/admin/facilities?tab=rooms', cta: 'Open rooms' },
      { title: 'Reservations', text: 'Approve or decline requests. Conflicts are flagged. For rentals, record the payment; it posts to the Building Fund.', to: '/admin/facilities?tab=reservations', cta: 'Open reservations' },
      { title: 'Maintenance', text: 'Report an issue and the Facilities Agent drafts a work order with a suggested vendor. Move items from open to assigned to scheduled to done.', to: '/admin/facilities?tab=maintenance', cta: 'Open maintenance' },
      { title: 'Assets', text: 'The van, sound system, kitchen, piano, insurance policy. Service and renewal dates with warnings as they approach.', to: '/admin/facilities?tab=assets', cta: 'Open assets' },
    ] },
  { path: '/admin/people', title: 'People & Volunteers', owner: 'Church Administrator; ministry leaders for their own schedules',
    plain: 'Staff, contractors and volunteers in one roster, with the two things churches must get right: background checks and schedules. Nobody can be put on a youth shift until their check is clear.',
    handoff: ['Adding new volunteers and requesting background checks: Church Administrator.', 'Filling Sunday shifts: ministry leaders.', 'Recording trainings: Church Administrator.', 'Hours for payroll: Finance Officer.'],
    steps: [
      { title: 'Directory', text: 'Everyone on the roster with their type and background-check status.', to: '/admin/people?tab=directory', cta: 'Open directory' },
      { title: 'Schedule', text: 'Four Sundays of shifts. Assign only shows people who are cleared for that ministry. Confirm once they say yes.', to: '/admin/people?tab=schedule', cta: 'Open schedule' },
      { title: 'Compliance', text: 'Pending and expired checks at the top. Mark cleared when the result comes back; record safeguarding training.', to: '/admin/people?tab=compliance', cta: 'Open compliance' },
      { title: 'Hours', text: 'Volunteer hours for the impact report; staff hours for payroll.', to: '/admin/people?tab=hours', cta: 'Open hours' },
    ] },
  { path: '/admin/outreach', title: 'Outreach & Community Center', owner: 'Deacon Tashabe Jackson (food distribution and requests), Deacon Landis Mathews (rides), Sandra Sykes (after-school)',
    plain: 'Everything New Life does for the neighborhood in one place: the Wednesday and Saturday FeedMore distributions, the Monday and Wednesday after-school program, ride requests and help requests from the website. The numbers you log here become the proof funders ask for.',
    handoff: ['Pantry day counts (households, people, pounds): the intake volunteer at the end of each distribution.', 'After-school attendance and tutoring hours: the program director or lead tutor.', 'Ride requests: the Transportation ministry.', 'Help requests from the website: the outreach deacon on duty.'],
    steps: [
      { title: 'Log a food distribution', text: 'Tap "Log today" after a Wednesday or Saturday distribution and enter households, people, seniors, children and pounds. Totals for the month, quarter and year update instantly.', to: '/admin/outreach?tab=pantry', cta: 'Open food distribution' },
      { title: 'Track after-school', text: 'Enter students, tutoring hours and meals for each session. These are exactly the numbers the Ujima Legacy Fund and the afterschool meal program require.', to: '/admin/outreach?tab=afterschool', cta: 'Open after-school' },
      { title: 'Schedule rides', text: 'Ride requests from the website land here. Assign a driver, mark the ride complete, and the log builds the case for an accessible van grant.', to: '/admin/outreach?tab=rides', cta: 'Open rides' },
      { title: 'Answer help requests', text: 'Groceries, housing, jobs, counseling and emergencies. Assign, follow up and close with an outcome. Personal details stay private; reports only show totals.', to: '/admin/outreach?tab=requests', cta: 'Open requests' },
      { title: 'Download the impact summary', text: 'One click gives a plain-language impact summary for the pastor, the board or a funder.' },
    ] },
  { path: '/admin/grants', title: 'Grant Advisor', owner: 'Rev. Phyllis D. Alexander (Church Administrator) with Sandra Sykes for Community Center programs',
    plain: 'An AI funding advisor that knows New Life. It searches federal, state, city, foundation and corporate funding, scores how well each one fits the church or the Community Center, explains why, and drafts the first letter. It also looks past grants: tax credits, earned income, matching gifts and recurring giving.',
    handoff: ['Weekly review of new matches: Church Administrator.', 'Readiness items (SAM.gov, 990, board list): Church Administrator and treasurer.', 'Program data and narratives: Sandra Sykes for youth, Deacon Jackson for food.', 'Final approval before anything is submitted: Pastor.'],
    steps: [
      { title: 'Read the matches', text: 'Every opportunity has a fit score, the dollar range, the deadline and whether the church or the Community Center should apply. Filter by category or by entity.', to: '/admin/grants?tab=matches', cta: 'Open matches' },
      { title: 'Open one to see why it fits', text: 'The advisor explains the fit in plain words, lists requirements and the next three steps. Every fact links to the official source.' },
      { title: 'Draft a letter of inquiry', text: 'One click writes a first draft using New Life’s real mission, programs and the numbers logged in Outreach. Edit it, then send it to the pipeline.', to: '/admin/grants?tab=matches', cta: 'Try it' },
      { title: 'Work the readiness checklist', text: 'Most grants are lost before they start because of paperwork. The checklist shows what is missing and which grants each item unlocks.', to: '/admin/grants?tab=readiness', cta: 'Open readiness' },
      { title: 'Ask the advisor', text: 'Ask questions like "How do we pay for a van?" or "What can we apply for this quarter?" and get an answer built from the opportunity list.', to: '/admin/grants?tab=ask', cta: 'Ask now' },
    ] },
  { path: '/admin/community', title: 'Community', owner: 'Outreach coordinator (food pantry, employment, housing); Transportation and Senior ministry leaders',
    plain: 'The church as a help desk for the neighborhood. Requests for food, housing help, jobs, rides, senior support and emergencies come in from the website and are routed to a coordinator. Leadership sees totals, never names.',
    handoff: ['Assigning new requests: Outreach coordinator.', 'Fulfilling or referring: the assigned coordinator.', 'Impact numbers for grants and the board: Church Administrator.'],
    steps: [
      { title: 'Service requests', text: 'New requests at the top. Assign, start, then record the outcome: fulfilled or referred to a partner. Names are hidden from roles that do not need them.', to: '/admin/community?tab=requests', cta: 'Open requests' },
      { title: 'Programs', text: 'Each program with its coordinator, partners and how many requests were resolved.', to: '/admin/community?tab=programs', cta: 'Open programs' },
      { title: 'Impact', text: 'The totals you give funders and the congregation: households served, people reached, referrals, volunteer hours.', to: '/admin/community?tab=impact', cta: 'Open impact' },
    ] },
  { path: '/admin/communications', title: 'Communications', owner: 'Church Secretary (pastor approves)',
    plain: 'Email newsletters and text messages to the right groups of people, with permission tracked for every person. Segments are built from the directory, so "first-time visitors" or "members with volunteer interests" are always current.',
    handoff: ['Writing the brief and approving copy: Church Secretary.', 'Final approval and sending: Church Secretary or pastor.', 'Unsubscribe requests: handled automatically; questions go to the Church Secretary.'],
    steps: [
      { title: 'Campaigns', text: 'Create a campaign with a brief. The Outreach Agent drafts the copy; you approve it in the Action Center; then Send.', to: '/admin/communications?tab=campaigns', cta: 'Open campaigns' },
      { title: 'Segments', text: 'Live counts of who would receive what. No spreadsheets.', to: '/admin/communications?tab=segments', cta: 'Open segments' },
      { title: 'Consent', text: 'Who has said yes to email and text. Members change this themselves in the portal.', to: '/admin/communications?tab=consent', cta: 'Open consent' },
    ] },
  { path: '/admin/partners', title: 'Partnerships', owner: 'Church Administrator and Pastor',
    plain: 'The newer side of church business: employers and nonprofits you work with, member-owned businesses listed on the website, grants you are chasing, training programs and income from renting the building.',
    handoff: ['Partner relationships: Church Administrator.', 'Approving business directory listings: Pastor or Church Administrator.', 'Grant applications and deadlines: Church Administrator (tasks are created automatically).', 'Program outcomes: the program lead.'],
    steps: [
      { title: 'Partner CRM', text: 'Prospect, active or paused. Notes on what each partner does with you.', to: '/admin/partners?tab=partners', cta: 'Open partners' },
      { title: 'Business directory', text: 'Member businesses waiting for approval appear with an Approve button. Approved listings show on the church website.', to: '/admin/partners?tab=directory', cta: 'Open directory' },
      { title: 'Grants', text: 'A board from identified to awarded. Adding a grant creates a deadline task.', to: '/admin/partners?tab=grants', cta: 'Open grants' },
      { title: 'Programs and rentals', text: 'Enrolled, completed and placed for each program; income and payment status for each rental.', to: '/admin/partners?tab=programs', cta: 'Open programs' },
    ] },
  { path: '/admin/reports', title: 'Reports', owner: 'Pastor, Church Administrator, Finance Officer',
    plain: 'Six questions leadership always asks, answered automatically from the same records every tool uses. Export the weekly summary for the board. The audit trail at the bottom shows who did what and when.',
    handoff: ['Nothing to assign. Reports are prepared automatically.', 'Reviewing the weekly summary before the board meeting: Church Administrator.'],
    steps: [
      { title: 'Read the six answers', text: 'Finances, growth, ministries needing support, facilities, impact, attention. Each has a small chart or list behind it.', to: '/admin/reports', cta: 'Open reports' },
      { title: 'Export', text: '"Export weekly summary" downloads a text summary and files a copy in Documents.' },
      { title: 'Audit trail', text: 'Every approval, reconciliation, draft and change, with the person or agent responsible.' },
    ] },
  { path: '/admin/settings', title: 'Settings', owner: 'Church Administrator; DataIsData support',
    plain: 'Church details that appear on the website and letters, the roles and permissions table, security switches, connected services, and the list of churches on the platform.',
    handoff: ['Church profile changes: Church Administrator.', 'Role changes and integrations: DataIsData support with the Church Administrator.'],
    steps: [
      { title: 'Roles and permissions', text: 'The table shows exactly what each role can see and approve. Switch accounts from the menu at the top right to see it in action.', to: '/admin/settings?tab=roles', cta: 'Open roles' },
      { title: 'Integrations', text: 'Giving processor, accounting, text messaging, background checks, livestream. Existing systems stay; this connects them.', to: '/admin/settings?tab=integrations', cta: 'Open integrations' },
      { title: 'Reset the demo', text: 'Security tab. Puts every sample record back the way it started.', to: '/admin/settings?tab=security', cta: 'Open security' },
    ] },
  { path: '/admin/help', title: 'Help', owner: 'Everyone', plain: 'Short tours of the demo and a map of the three surfaces and twelve modules.', handoff: [], steps: [{ title: 'Pick a tour', text: 'Each card is a two-minute walkthrough that proves one idea: one database, giving to reconciliation, the Monday package, role-scoped access.', to: '/admin/help', cta: 'Open help' }] },
]

export function guideFor(pathname: string) {
  const exact = guides.find((g) => g.path === pathname)
  if (exact) return exact
  return guides.filter((g) => g.path !== '/admin' && pathname.startsWith(g.path)).sort((a, b) => b.path.length - a.path.length)[0] ?? guides[0]
}
