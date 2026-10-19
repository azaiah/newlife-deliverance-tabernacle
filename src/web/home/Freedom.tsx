import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { church } from '@/config/site'
import { art, Eyebrow, GoldButton } from '../ui'

const bonds = ['Bound by addiction.', 'Bound by grief.', 'Bound by a record.', 'Bound by the past.']

/** One iron chain link, drawn as a thick rounded loop with a metallic gradient. */
function Link({ x, side = false }: { x: number; side?: boolean }) {
  return side ? (
    <rect x={x - 34} y={88} width={68} height={24} rx={12} fill="none" stroke="url(#iron)" strokeWidth={11} />
  ) : (
    <rect x={x - 38} y={66} width={76} height={68} rx={34} fill="none" stroke="url(#iron)" strokeWidth={11} />
  )
}

function Spark({ burst, dx, dy, r }: { burst: MotionValue<number>; dx: number; dy: number; r: number }) {
  const cx = useTransform(burst, [0, 1], [500, 500 + dx])
  const cy = useTransform(burst, [0, 1], [100, 100 + dy])
  return <motion.circle cx={cx} cy={cy} r={r} fill="#F3DE9E" style={{ filter: 'drop-shadow(0 0 6px #E2C072)' }} />
}

function Chain({ p }: { p: MotionValue<number> }) {
  const jitter = useTransform(p, [0.4, 0.5, 0.52, 0.54, 0.56, 0.58, 0.6], [0, 0, -3, 3, -4, 4, 0])
  const leftX = useTransform(p, [0.6, 0.74], [0, -260])
  const rightX = useTransform(p, [0.6, 0.74], [0, 260])
  const leftR = useTransform(p, [0.6, 0.74], [0, -14])
  const rightR = useTransform(p, [0.6, 0.74], [0, 16])
  const leftY = useTransform(p, [0.6, 0.74], [0, 60])
  const rightY = useTransform(p, [0.6, 0.74], [0, 80])
  const chainOpacity = useTransform(p, [0.72, 0.82], [1, 0])
  const burst = useTransform(p, [0.6, 0.75], [0, 1])
  const burstOpacity = useTransform(p, [0.6, 0.66, 0.8], [0, 1, 0])
  const flash = useTransform(p, [0.58, 0.62, 0.72], [0, 1, 0])
  const sparks = Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; const r = 120 + (i % 5) * 46; return { dx: Math.cos(a) * r, dy: Math.sin(a) * r * 0.7, s: 3 + (i % 4) * 1.6 } })
  return (
    <motion.svg viewBox="0 0 1000 200" className="w-[170%] sm:w-full max-w-none sm:max-w-5xl -mx-[35%] sm:mx-auto overflow-visible" style={{ opacity: chainOpacity }} aria-hidden="true">
      <defs>
        <linearGradient id="iron" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9b95a6" /><stop offset="0.35" stopColor="#4a4456" /><stop offset="0.6" stopColor="#2a2433" /><stop offset="1" stopColor="#6b6478" /></linearGradient>
        <radialGradient id="flash" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#FFF3CF" /><stop offset="0.4" stopColor="#E2C072" stopOpacity="0.7" /><stop offset="1" stopColor="#C9A24B" stopOpacity="0" /></radialGradient>
      </defs>
      <motion.circle cx={500} cy={100} r={180} fill="url(#flash)" style={{ opacity: flash }} />
      <motion.g style={{ x: leftX, y: leftY, rotate: leftR, originX: '500px', originY: '100px' }}>
        <motion.g style={{ x: jitter }}>
          {[80, 170, 260, 350].map((x, i) => <Link key={x} x={x} side={i % 2 === 1} />)}
          <path d="M408 66 h20 a34 34 0 0 1 0 68 h-20" fill="none" stroke="url(#iron)" strokeWidth={11} strokeLinecap="round" />
        </motion.g>
      </motion.g>
      <motion.g style={{ x: rightX, y: rightY, rotate: rightR }}>
        {[650, 740, 830, 920].map((x, i) => <Link key={x} x={x} side={i % 2 === 0} />)}
        <path d="M592 66 h-20 a34 34 0 0 0 0 68 h20" fill="none" stroke="url(#iron)" strokeWidth={11} strokeLinecap="round" />
      </motion.g>
      <motion.g style={{ opacity: burstOpacity }}>
        {sparks.map((s, i) => (
          <Spark key={i} burst={burst} dx={s.dx} dy={s.dy} r={s.s} />
        ))}
      </motion.g>
    </motion.svg>
  )
}

function BondLine({ p, i, text }: { p: MotionValue<number>; i: number; text: string }) {
  const start = 0.08 + i * 0.12
  const opacity = useTransform(p, [start, start + 0.06, 0.56, 0.62], [0, 1, 1, 0])
  const y = useTransform(p, [start, start + 0.08], [24, 0])
  const dim = useTransform(p, [start + 0.12, start + 0.2], [1, 0.38])
  return (
    <motion.p style={{ opacity, y }} className="font-display text-[2.1rem] sm:text-6xl leading-[1.05] text-white/90">
      <motion.span style={{ opacity: dim }}>{text}</motion.span>
    </motion.p>
  )
}

export function Freedom() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const bg = useTransform(p, [0.55, 0.85], [0, 1])
  const finalOpacity = useTransform(p, [0.74, 0.84], [0, 1])
  const finalY = useTransform(p, [0.74, 0.86], [40, 0])
  const imgScale = useTransform(p, [0.7, 1], [1.15, 1])

  if (reduce) {
    return (
      <section className="relative bg-midnight text-white overflow-hidden py-24" aria-label="Freedom">
        <img src={art('chains-to-light')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          {bonds.map((b) => <p key={b} className="font-display text-4xl sm:text-5xl text-white/60">{b}</p>)}
          <h2 className="display text-5xl sm:text-7xl mt-10 gold-leaf">{church.scripture}</h2>
          <p className="mt-3 font-caps tracking-[0.24em] text-gold-light">{church.scriptureRef}</p>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative h-[330vh] bg-midnight" aria-label="Freedom">
      <div className="sticky top-0 h-[100svh] overflow-hidden text-white grain">
        <motion.div className="absolute inset-0" style={{ opacity: bg }}>
          <motion.img src={art('chains-to-light')} srcSet={`${art('chains-to-light-vertical')} 800w, ${art('chains-to-light')} 2200w`} sizes="100vw" alt="" style={{ scale: imgScale }} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-midnight/60" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 50% at 50% 55%, rgba(226,192,114,0.25), transparent 70%)' }} />
        </motion.div>
        <div className="relative h-full mx-auto max-w-6xl px-4 sm:px-6 flex flex-col justify-center">
          <div className="absolute top-24 sm:top-28 left-4 sm:left-6"><Eyebrow light>Deliverance</Eyebrow></div>
          <div className="relative min-h-[16rem] sm:min-h-[18rem]">
            <div className="absolute inset-x-0 top-0 grid gap-1 sm:gap-2">
              {bonds.map((b, i) => <BondLine key={b} p={p} i={i} text={b} />)}
            </div>
            <motion.div style={{ opacity: finalOpacity, y: finalY }} className="absolute inset-x-0 top-0">
              <h2 className="font-display font-semibold text-[3rem] sm:text-8xl leading-[0.95] tracking-[-0.02em] max-w-4xl">Who the Son sets free <span className="italic gold-leaf">is free indeed.</span></h2>
              <p className="mt-4 font-caps tracking-[0.28em] text-gold-light">{church.scriptureRef}</p>
              <p className="mt-6 max-w-2xl text-lg sm:text-xl text-white/80 leading-relaxed">New Life began as a dream to minister to people coming home from prison and an after-care group for people in recovery. For nearly three decades this church has walked with people out of bondage and into the liberty of Christ.</p>
              <div className="mt-8"><GoldButton to="/about" icon={<ArrowRight size={18} />}>Read our story</GoldButton></div>
            </motion.div>
          </div>
          <div className="mt-10 sm:mt-14"><Chain p={p} /></div>
        </div>
      </div>
    </section>
  )
}
