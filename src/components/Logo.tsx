import { Link } from 'react-router-dom'
import { useId } from 'react'

/**
 * New Life Deliverance Tabernacle emblem, drawn in SVG from the church's own badge:
 * a gold cross radiating light, rising chevrons beneath, inside a ring.
 */
export function Mark({ size = 32, light = false, className = '' }: { size?: number; light?: boolean; className?: string }) {
  const id = useId().replace(/:/g, '')
  const ring = light ? 'rgba(255,255,255,0.22)' : 'rgba(26,15,43,0.14)'
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`g${id}`} x1="10" y1="6" x2="54" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F3DE9E" />
          <stop offset="0.45" stopColor="#C9A24B" />
          <stop offset="1" stopColor="#8A6620" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" stroke={`url(#g${id})`} strokeWidth="2.2" />
      <circle cx="32" cy="32" r="26" stroke={ring} strokeWidth="1" />
      <g stroke={`url(#g${id})`} strokeWidth="1.1" strokeLinecap="round" opacity="0.75">
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2
          const r1 = 10, r2 = i % 2 ? 17 : 21
          return <line key={i} x1={32 + Math.cos(a) * r1} y1={27 + Math.sin(a) * r1} x2={32 + Math.cos(a) * r2} y2={27 + Math.sin(a) * r2} />
        })}
      </g>
      <path d="M30 13h4v9.5h8.5v4H34V40h-4V26.5h-8.5v-4H30z" fill={`url(#g${id})`} />
      <path d="M17 47.5 32 40l15 7.5M20 52.5 32 46.5l12 6" stroke={`url(#g${id})`} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Website lockup: New Life Deliverance Tabernacle */
export function SiteLogo({ light = false, compact = false, to = '/' }: { light?: boolean; compact?: boolean; to?: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-3 min-h-[44px] group" aria-label="New Life Deliverance Tabernacle home">
      <Mark size={compact ? 38 : 44} light={light} className="shrink-0 transition-transform duration-700 group-hover:rotate-[8deg]" />
      <span className="leading-none">
        <span className={`block font-display font-semibold text-[1.32rem] sm:text-2xl tracking-tight ${light ? 'text-white' : 'text-midnight'}`}>New Life</span>
        <span className={`block font-caps text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.26em] mt-1 ${light ? 'text-gold-light' : 'text-gold'}`}>Deliverance Tabernacle</span>
      </span>
    </Link>
  )
}

/** Portal and staff hub lockup: New Life Connect */
export function Logo({ light = false, size = 'md', compact = false, to = '/admin' }: { light?: boolean; size?: 'sm' | 'md'; compact?: boolean; to?: string }) {
  const text = light ? 'text-white' : 'text-midnight'
  const sub = light ? 'text-gold-light' : 'text-gold'
  return (
    <Link to={to} className="inline-flex items-center gap-2.5 min-h-[44px]" aria-label="New Life Connect home">
      <Mark size={size === 'sm' ? 30 : 36} light={light} />
      {!compact && (
        <span className="leading-none">
          <span className={`block font-display font-semibold ${size === 'sm' ? 'text-xl' : 'text-2xl'} ${text}`}>New Life Connect</span>
          <span className={`block font-caps text-[9px] uppercase tracking-[0.24em] mt-1 ${sub}`}>Church &amp; Community Hub</span>
        </span>
      )}
    </Link>
  )
}

export function PoweredBy({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] ${light ? 'text-white/60' : 'text-slate'} ${className}`}>
      <img src="/dataisdata-icon.png" alt="" width={16} height={16} className="rounded-sm" />
      ChurchConnect by DataIsData
    </span>
  )
}
