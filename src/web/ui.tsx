import { useState, type ReactNode, type ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import photos from '@/data/photos.json'
import { Mark } from '@/components/Logo'

type PhotoEntry = { name: string; alt: string; ext: string }
const byName = new Map((photos as PhotoEntry[]).map((p) => [p.name, p]))

/** Path to one of the church's own photos (downloaded by scripts/fetch-church-photos.mjs). */
export const photoSrc = (name: string) => { const p = byName.get(name); return p ? `/images/church/${p.name}.${p.ext}` : '' }
export const photoAlt = (name: string) => byName.get(name)?.alt ?? ''
/** Generated art (Kie.ai), optimized to WebP. */
export const art = (name: string, small = false) => `/images/art/${name}${small ? '-sm' : ''}.webp`

/**
 * The church's real photo, with a branded fallback if the file has not been downloaded yet
 * (so layouts never break). Lazy by default.
 */
/** Wrapper position: a caller that passes absolute/fixed/sticky must win. Both `relative` and `absolute` in one class list resolves by stylesheet order (relative wins), which collapsed the box to zero height. */
const anchored = (cls: string) => (/(^|\s)(absolute|fixed|sticky)(\s|$)/.test(cls) ? '' : 'relative')

export function Photo({ name, className = '', imgClassName = '', alt, eager = false, sizes }: { name: string; className?: string; imgClassName?: string; alt?: string; eager?: boolean; sizes?: string }) {
  const [failed, setFailed] = useState(false)
  const src = photoSrc(name)
  return (
    <div className={`${anchored(className)} overflow-hidden bg-gradient-to-br from-plum via-midnight-2 to-midnight ${className}`}>
      {(!src || failed) ? (
        <div className="absolute inset-0 flex items-center justify-center" role="img" aria-label={alt ?? photoAlt(name)}>
          <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(60% 50% at 50% 40%, rgba(201,162,75,0.28), transparent 70%)' }} />
          <Mark size={56} light className="relative opacity-70" />
        </div>
      ) : (
        <img src={src} alt={alt ?? photoAlt(name)} loading={eager ? 'eager' : 'lazy'} decoding="async" sizes={sizes} onError={() => setFailed(true)} className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`} />
      )}
    </div>
  )
}

/** Generated art image, responsive (small + large WebP). */
export function Art({ name, alt, className = '', imgClassName = '', eager = false }: { name: string; alt: string; className?: string; imgClassName?: string; eager?: boolean }) {
  return (
    <div className={`${anchored(className)} overflow-hidden bg-midnight ${className}`}>
      <img src={art(name)} srcSet={`${art(name, true)} 800w, ${art(name)} 2000w`} sizes="(max-width: 768px) 100vw, 60vw" alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`} />
    </div>
  )
}

export function Eyebrow({ children, light = false, className = '' }: { children: ReactNode; light?: boolean; className?: string }) {
  return (
    <p className={`inline-flex items-center gap-3 font-caps text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.28em] ${light ? 'text-gold-light' : 'text-gold'} ${className}`}>
      <span aria-hidden="true" className={`h-px w-8 ${light ? 'bg-gold-light/70' : 'bg-gold/60'}`} />
      {children}
    </p>
  )
}

/**
 * Word-by-word rise for headlines. Words stay readable to screen readers as one string.
 * The heading itself is observed (not each word): each word starts clipped by its mask, so observing
 * the words would never report them as visible.
 */
const motionTags = { span: motion.span, h1: motion.h1, h2: motion.h2, p: motion.p }
export function SplitWords({ text, className = '', delay = 0, stagger = 0.06, as: Tag = 'span' }: { text: string; className?: string; delay?: number; stagger?: number; as?: 'span' | 'h1' | 'h2' | 'p' }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  if (reduce) return <Tag className={className}>{text}</Tag>
  const M = motionTags[Tag]
  return (
    <M className={className} aria-label={text} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, show: { transition: { delayChildren: delay, staggerChildren: stagger } } }}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
          <motion.span className="inline-block" variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } }}>
            {w}{i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </M>
  )
}

type CtaProps = { to?: string; href?: string; children: ReactNode; icon?: ReactNode; className?: string; size?: 'md' | 'lg' } & Omit<ComponentProps<'button'>, 'children'>
const base = 'group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 select-none text-center leading-tight max-w-full focus-visible:outline-none focus-visible:ring-4'
const sizes = { md: 'min-h-[48px] px-6 text-[15px]', lg: 'min-h-[56px] px-8 text-base' }

function CtaInner({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return <><span className="relative z-10 inline-flex items-center gap-2">{children}{icon && <span className="transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>}</span></>
}

function make(variant: string) {
  return function Cta({ to, href, children, icon, className = '', size = 'md', ...rest }: CtaProps) {
    const cls = `${base} ${sizes[size]} ${variant} ${className}`
    if (to) return <Link to={to} className={cls}><CtaInner icon={icon}>{children}</CtaInner></Link>
    if (href) return <a href={href} className={cls} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}><CtaInner icon={icon}>{children}</CtaInner></a>
    return <button type="button" className={cls} {...rest}><CtaInner icon={icon}>{children}</CtaInner></button>
  }
}
/** Bright anointing-gold pill with dark text (7.6:1). */
export const GoldButton = make('bg-gradient-to-b from-[#E8CC85] to-gold-bright text-midnight glow-gold hover:from-[#F3DE9E] hover:to-[#D6B05A] focus-visible:ring-gold-light/50 overflow-hidden after:absolute after:inset-0 after:-translate-x-full after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent group-hover:after:translate-x-full after:transition-transform after:duration-700')
/** Frosted glass pill for dark backgrounds. */
export const GlassButton = make('bg-white/10 text-white backdrop-blur-md border border-white/25 hover:bg-white/20 hover:border-white/50 focus-visible:ring-white/30')
/** Royal purple pill for light backgrounds. */
export const RoyalButton = make('bg-plum text-white hover:bg-plum-2 shadow-lift focus-visible:ring-amethyst/40')
/** Outlined pill for light backgrounds. */
export const OutlineButton = make('border-2 border-plum/25 text-plum hover:border-plum hover:bg-plum hover:text-white focus-visible:ring-amethyst/30')

export function SectionHeading({ eyebrow, title, text, light = false, center = false, className = '' }: { eyebrow?: string; title: string; text?: ReactNode; light?: boolean; center?: boolean; className?: string }) {
  return (
    <div className={`${center ? 'text-center mx-auto' : ''} max-w-3xl ${className}`}>
      {eyebrow && <Eyebrow light={light} className={center ? 'justify-center' : ''}>{eyebrow}</Eyebrow>}
      <SplitWords as="h2" text={title} className={`display text-[2.6rem] sm:text-6xl mt-4 text-balance ${light ? 'text-white' : 'text-midnight'}`} />
      {text && <div className={`mt-5 text-lg leading-relaxed ${light ? 'text-white/75' : 'text-slate'}`}>{text}</div>}
    </div>
  )
}

/** Inner-page hero: cinematic image, royal gradient, breadcrumb, title. */
export function PageHero({ eyebrow, title, text, image, photo, children }: { eyebrow: string; title: string; text?: ReactNode; image?: string; photo?: string; children?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-midnight text-white grain">
      <div className="absolute inset-0 -z-10">
        {image ? <img src={art(image)} srcSet={`${art(image, true)} 800w, ${art(image)} 2000w`} sizes="100vw" alt="" className="h-full w-full object-cover opacity-60" /> : photo ? <Photo name={photo} className="h-full w-full opacity-60" alt="" eager /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/70 to-midnight/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight/80 via-midnight/30 to-transparent" />
        <div className="light-leaks" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-36 sm:pt-44 pb-16 sm:pb-24">
        <Eyebrow light>{eyebrow}</Eyebrow>
        <SplitWords as="h1" text={title} className="display text-[2.9rem] sm:text-7xl lg:text-8xl mt-5 max-w-4xl text-balance" />
        {text && <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="mt-6 max-w-2xl text-lg sm:text-xl text-white/80 leading-relaxed">{text}</motion.div>}
        {children && <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }} className="mt-8 flex flex-wrap gap-3">{children}</motion.div>}
      </div>
    </section>
  )
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>
}
