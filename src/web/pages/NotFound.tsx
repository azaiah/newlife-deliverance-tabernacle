import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Mark } from '@/components/Logo'
import { GoldButton, GlassButton, Art } from '../ui'

export default function NotFound() {
  useDocumentMeta('Page not found | New Life Deliverance Tabernacle', 'This page could not be found.')
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-midnight text-white grid place-items-center px-4 text-center grain">
      <Art name="radiance-wide" alt="" className="absolute inset-0 -z-10 opacity-50" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-midnight/40 via-midnight/70 to-midnight" />
      <div className="max-w-xl">
        <Mark size={64} light className="mx-auto" />
        <p className="mt-6 font-caps text-xs tracking-[0.3em] text-gold-light">Luke 15:24</p>
        <h1 className="display text-5xl sm:text-7xl mt-3">Lost, but never too far to be found.</h1>
        <p className="mt-5 text-lg text-white/75">The page you were looking for is not here. Let us help you find your way home.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><GoldButton to="/">Go home</GoldButton><GlassButton to="/visit">Plan a visit</GlassButton></div>
      </div>
    </section>
  )
}
