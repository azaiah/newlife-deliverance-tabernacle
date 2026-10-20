import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { church } from '@/config/site'
import { art, Eyebrow, GoldButton } from '../ui'
import { useFits } from '../useFits'

const bonds = ['Bound by addiction.', 'Bound by grief.', 'Bound by a record.', 'Bound by the past.']
const FRAMES = 72

/**
 * A real chain-breaking film, played by the scroll. 72 pre-rendered frames (desktop and a tighter
 * portrait crop for phones) are drawn to a canvas: scroll down and the chain strains and snaps,
 * scroll up and it closes again. Frames stream in the background; a still poster shows first.
 */
function ScrubCanvas({ frame }: { frame: MotionValue<number> }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const frames = useRef<(HTMLImageElement | undefined)[]>([])
  const set = useRef<'d' | 'm'>('d')
  const want = useRef(0)
  const raf = useRef(0)
  const [ready, setReady] = useState(false)

  const draw = () => {
    raf.current = 0
    const c = canvas.current
    if (!c) return
    const f = frames.current
    const target = Math.round(Math.min(1, Math.max(0, want.current)) * (FRAMES - 1))
    let img: HTMLImageElement | undefined
    for (let d = 0; d < FRAMES && !img; d++) img = f[target - d] ?? f[target + d]
    if (!img) return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
    const w = Math.round(c.clientWidth * dpr)
    const h = Math.round(c.clientHeight * dpr)
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h }
    const ctx = c.getContext('2d')
    if (!ctx) return
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight)
    const dw = img.naturalWidth * s
    const dh = img.naturalHeight * s
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
    setReady(true)
  }
  const schedule = () => { if (!raf.current) raf.current = requestAnimationFrame(draw) }

  useMotionValueEvent(frame, 'change', (v) => { want.current = v; schedule() })

  useEffect(() => {
    let cancelled = false
    const choose = () => (window.innerWidth / window.innerHeight < 0.95 ? 'm' : 'd')
    const load = () => {
      const kind = choose()
      set.current = kind
      frames.current = []
      // Load order: first, last, then a coarse pass, then the rest, so scrubbing works early.
      const order: number[] = [0, FRAMES - 1]
      for (let step = 12; step >= 1; step = Math.floor(step / 2)) for (let i = 0; i < FRAMES; i += step) if (!order.includes(i)) order.push(i)
      let k = 0
      const next = () => {
        if (cancelled || kind !== set.current) return
        const i = order[k++]
        if (i === undefined) return
        const im = new Image()
        im.decoding = 'async'
        im.onload = () => { frames.current[i] = im; schedule(); next() }
        im.onerror = () => next()
        im.src = `/video/chain/${kind}${String(i).padStart(2, '0')}.webp`
      }
      next(); next(); next()
    }
    load()
    let last = choose()
    const onResize = () => { const k = choose(); if (k !== last) { last = k; load() } else schedule() }
    window.addEventListener('resize', onResize)
    return () => { cancelled = true; window.removeEventListener('resize', onResize); cancelAnimationFrame(raf.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <canvas ref={canvas} aria-hidden="true" className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`} />
}

function BondLine({ p, i, text }: { p: MotionValue<number>; i: number; text: string }) {
  const a = 0.03 + i * 0.115
  const opacity = useTransform(p, [a, a + 0.045, a + 0.095, a + 0.12], [0, 1, 1, 0])
  const y = useTransform(p, [a, a + 0.05], [18, 0])
  return (
    <motion.p style={{ opacity, y, fontSize: 'clamp(1.75rem, calc(4vh + 1.1rem), 4rem)' }} className="absolute inset-x-0 top-0 font-display font-semibold leading-[1.05] text-white drop-shadow-[0_2px_18px_rgba(10,5,20,0.9)]">
      {text}
    </motion.p>
  )
}

/** Static version for reduced motion and very short windows: full image, everything readable, nothing pinned. */
function StaticFreedom() {
  return (
    <section className="relative isolate overflow-hidden bg-midnight text-white py-24 sm:py-32" aria-label="Freedom">
      <img src={art('chain-free')} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-midnight/80 via-midnight/50 to-midnight" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Eyebrow light>Deliverance</Eyebrow>
        <div className="mt-6 space-y-1">{bonds.map((b) => <p key={b} className="font-display text-3xl sm:text-5xl text-white/70">{b}</p>)}</div>
        <h2 className="mt-12 font-display font-semibold text-5xl sm:text-7xl leading-[0.98] tracking-[-0.02em] max-w-4xl">Who the Son sets free <span className="italic gold-leaf">is free indeed.</span></h2>
        <p className="mt-4 font-caps tracking-[0.28em] text-gold-light">{church.scriptureRef}</p>
        <StoryCopy />
      </div>
    </section>
  )
}

function StoryCopy() {
  return (
    <div className="mt-8 max-w-2xl">
      <p className="text-lg sm:text-xl text-white/80 leading-relaxed">New Life began as a dream to minister to people coming home from prison and an after-care group for people in recovery. For nearly three decades this church has walked with people out of bondage and into the liberty of Christ.</p>
      <div className="mt-8"><GoldButton to="/about" icon={<ArrowRight size={18} />}>Read our story</GoldButton></div>
    </div>
  )
}

export function Freedom() {
  const reduce = useReducedMotion()
  const fits = useFits(520)
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // Film progress: a pause on the intact chain, the long strain, then the break and the light.
  const film = useTransform(p, [0, 0.08, 0.56, 0.84], [0, 0, 0.5, 1])
  const smooth = useSpring(film, { stiffness: 170, damping: 30, mass: 0.35 })
  const flash = useTransform(p, [0.52, 0.58, 0.7], [0, 0.55, 0])
  const finalOpacity = useTransform(p, [0.76, 0.86], [0, 1])
  const finalY = useTransform(p, [0.76, 0.88], [28, 0])
  const hintOpacity = useTransform(p, [0, 0.06], [1, 0])
  const scale = useTransform(p, [0, 1], [1, 1.07])

  if (reduce || !fits) return <StaticFreedom />

  return (
    <>
      <section ref={ref} className="relative h-[320vh] bg-midnight" aria-label="Freedom">
        <div className="sticky top-0 h-[100svh] overflow-hidden bg-midnight text-white">
          <motion.div className="absolute inset-0" style={{ scale }}>
            <img src={art('chain-intact')} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <ScrubCanvas frame={smooth} />
          </motion.div>
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,10,36,0.82)_0%,rgba(20,10,36,0.35)_30%,rgba(20,10,36,0)_44%,rgba(20,10,36,0)_58%,rgba(20,10,36,0.78)_100%)]" />
          <motion.div aria-hidden="true" style={{ opacity: flash }} className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_50%,rgba(255,236,190,0.9),rgba(226,192,114,0.25)_55%,transparent_75%)] mix-blend-screen" />

          <div className="absolute inset-x-0 top-[max(5.5rem,14vh)]">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <Eyebrow light>Deliverance</Eyebrow>
              <div className="relative mt-3 min-h-[calc(2*clamp(1.75rem,calc(4vh+1.1rem),4rem)*1.08)]" role="list" aria-label="What holds people back">
                {bonds.map((b, i) => <BondLine key={b} p={p} i={i} text={b} />)}
              </div>
            </div>
          </div>

          <motion.div style={{ opacity: finalOpacity, y: finalY }} className="absolute inset-x-0 bottom-[max(2.25rem,6vh)]">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2 style={{ fontSize: 'clamp(2rem, calc(4.4vh + 1rem), 5rem)' }} className="font-display font-semibold leading-[1] tracking-[-0.02em] max-w-4xl text-white drop-shadow-[0_2px_22px_rgba(10,5,20,0.95)]">Who the Son sets free <span className="italic gold-leaf">is free indeed.</span></h2>
              <p className="mt-3 font-caps text-sm tracking-[0.28em] text-gold-light">{church.scriptureRef}</p>
            </div>
          </motion.div>

          <motion.div style={{ opacity: hintOpacity }} aria-hidden="true" className="absolute left-1/2 -translate-x-1/2 bottom-5 font-caps text-[11px] tracking-[0.3em] text-white/60">SCROLL</motion.div>
        </div>
      </section>
      <section className="relative bg-midnight pb-20 sm:pb-28 -mt-px">
        <div className="mx-auto max-w-6xl px-4 sm:px-6"><StoryCopy /></div>
      </section>
    </>
  )
}
