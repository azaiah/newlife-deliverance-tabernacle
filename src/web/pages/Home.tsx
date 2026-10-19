import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Hero } from '../home/Hero'
import { Freedom } from '../home/Freedom'
import { Marquee, Rhythm, Welcome, HelpBand, Theme, Timeline, Facts, MinistriesTeaser, Gallery, WatchGive, VisitBand } from '../home/Sections'

export default function Home() {
  useDocumentMeta('New Life Deliverance Tabernacle | Spirit-filled church in South Richmond, VA', 'New Life Deliverance Tabernacle at 900 Decatur St, Richmond VA. Sunday Worship 9:45 AM, Bible Study Tuesdays 7 PM, free FeedMore groceries Wednesdays and Saturdays, after-school tutoring and community programs.')
  return (
    <>
      <Hero />
      <Marquee />
      <Rhythm />
      <Freedom />
      <Welcome />
      <HelpBand />
      <Timeline />
      <Theme />
      <Facts />
      <MinistriesTeaser />
      <Gallery />
      <WatchGive />
      <VisitBand />
    </>
  )
}
