'use client'

import { useState } from 'react'

// ─── Colors ───────────────────────────────────────────────────────────────────
const RED = '#FF2D20'
const BLUE = '#0066FF'
const YELLOW = '#FFD60A'
const DARK = '#0a0a0a'

// ─── Platform brand colors ────────────────────────────────────────────────────
const BRANDS: Record<string, { color: string; bg: string; border: string }> = {
  'X.com': {
    color: '#000000',
    bg: 'rgba(0,0,0,0.05)',
    border: 'rgba(0,0,0,0.14)',
  },
  TikTok: {
    color: '#FF0050',
    bg: 'rgba(255,0,80,0.06)',
    border: 'rgba(255,0,80,0.2)',
  },
  Shopee: {
    color: '#EE4D2D',
    bg: 'rgba(238,77,45,0.07)',
    border: 'rgba(238,77,45,0.22)',
  },
  Instagram: {
    color: '#E4405F',
    bg: 'rgba(228,64,95,0.06)',
    border: 'rgba(228,64,95,0.2)',
  },
  Facebook: {
    color: '#1877F2',
    bg: 'rgba(24,119,242,0.06)',
    border: 'rgba(24,119,242,0.2)',
  },
  YouTube: {
    color: '#FF0000',
    bg: 'rgba(255,0,0,0.06)',
    border: 'rgba(255,0,0,0.2)',
  },
  Threads: {
    color: '#000000',
    bg: 'rgba(0,0,0,0.05)',
    border: 'rgba(0,0,0,0.14)',
  },
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
    >
      <path
        d='M3 8h10M9 4l4 4-4 4'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

function IconX() {
  return (
    <svg width='20' height='20' viewBox='0 0 24 24' fill='#000000'>
      <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
    </svg>
  )
}

function IconTikTok() {
  return (
    <svg width='20' height='20' viewBox='0 0 24 24'>
      {/* TikTok cyan shadow */}
      <path
        fill='#69C9D0'
        d='M20.09 6.19a5.33 5.33 0 01-4.17-4.7V.5h-3.82v15.14a3.2 3.2 0 01-3.19 2.77 3.2 3.2 0 01-3.2-3.2 3.2 3.2 0 013.2-3.19c.3 0 .6.04.87.11V8.29a7.02 7.02 0 00-.87-.06 7.02 7.02 0 00-7.01 7.01 7.02 7.02 0 007.01 7.01 7.02 7.02 0 007-7.01V9.62a9.06 9.06 0 005.3 1.68V7.48a5.36 5.36 0 01-1.12-.08l-.01-.01z'
        opacity='0.5'
      />
      {/* TikTok red shadow */}
      <path
        fill='#FF0050'
        d='M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z'
        opacity='0.7'
      />
      {/* TikTok main black */}
      <path
        fill='#010101'
        d='M18.59 5.69a4.83 4.83 0 01-3.77-4.25V1h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V8.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V7.69a8.18 8.18 0 004.78 1.52V5.76a4.85 4.85 0 01-1.01-.07z'
      />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width='20' height='20' viewBox='0 0 24 24' fill='#1877F2'>
      <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg width='20' height='20' viewBox='0 0 24 24'>
      <defs>
        <linearGradient id='ig-grad' x1='0' y1='1' x2='1' y2='0'>
          <stop offset='0%' stopColor='#FFDC80' />
          <stop offset='25%' stopColor='#F77737' />
          <stop offset='60%' stopColor='#E1306C' />
          <stop offset='100%' stopColor='#833AB4' />
        </linearGradient>
      </defs>
      <path
        fill='url(#ig-grad)'
        d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'
      />
    </svg>
  )
}

function IconYouTube() {
  return (
    <svg width='20' height='20' viewBox='0 0 24 24'>
      <path
        fill='#FF0000'
        d='M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805z'
      />
      <path fill='#ffffff' d='M9.609 15.601V8.408l6.264 3.602z' />
    </svg>
  )
}

function IconBolt() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <polygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2' />
    </svg>
  )
}

function IconBrain() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.44 2.5 2.5 0 01-2.96-3.08 3 3 0 01-.34-5.58 2.5 2.5 0 013.72-3.38A2.5 2.5 0 019.5 2z' />
      <path d='M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.44 2.5 2.5 0 002.96-3.08 3 3 0 00.34-5.58 2.5 2.5 0 00-3.72-3.38A2.5 2.5 0 0014.5 2z' />
    </svg>
  )
}

function IconClock() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='12' cy='12' r='10' />
      <polyline points='12 6 12 12 16 14' />
    </svg>
  )
}

function IconBarChart() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <line x1='18' y1='20' x2='18' y2='10' />
      <line x1='12' y1='20' x2='12' y2='4' />
      <line x1='6' y1='20' x2='6' y2='14' />
    </svg>
  )
}

function IconTrendingUp() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <polyline points='23 6 13.5 15.5 8.5 10.5 1 18' />
      <polyline points='17 6 23 6 23 12' />
    </svg>
  )
}

function IconSpark() {
  return (
    <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor'>
      <path d='M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z' />
    </svg>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false)
  const links = [
    { label: 'Features', id: 'features' },
    { label: 'Integrations', id: 'integrations' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'Blog', id: null },
  ]

  function scrollTo(id: string | null) {
    if (!id) return
    const el = document.getElementById(id)
    if (!el) return
    const navHeight = 88
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <header className='fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4'>
      <nav
        className='flex items-center justify-between w-full max-w-5xl rounded-2xl px-5 py-3'
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
        <div className='flex items-center gap-2'>
          <div
            className='w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold'
            style={{ background: RED }}
          >
            ✦
          </div>
          <span className='font-bold text-toy-dark text-base'>ContentClaw</span>
        </div>

        <div className='hidden md:flex items-center gap-6'>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.id ? `#${l.id}` : '#'}
              className='text-sm font-medium transition-colors'
              style={{ color: `${DARK}99` }}
              onMouseEnter={(e) => (e.currentTarget.style.color = RED)}
              onMouseLeave={(e) => (e.currentTarget.style.color = `${DARK}99`)}
              onClick={(e) => {
                if (l.id) {
                  e.preventDefault()
                  scrollTo(l.id)
                }
              }}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className='hidden md:flex items-center gap-3'>
          <a
            href='#'
            className='text-sm font-medium transition-colors'
            style={{ color: `${DARK}99` }}
            onMouseEnter={(e) => (e.currentTarget.style.color = RED)}
            onMouseLeave={(e) => (e.currentTarget.style.color = `${DARK}99`)}
          >
            Sign in
          </a>
          <a
            href='#'
            className='flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2 rounded-xl hover:opacity-85 transition-opacity'
            style={{ background: RED, boxShadow: `0 4px 14px ${RED}40` }}
          >
            Start Free Trial <ArrowRight />
          </a>
        </div>

        <button
          className='md:hidden'
          style={{ color: RED }}
          onClick={() => setOpen(!open)}
        >
          <svg width='22' height='22' viewBox='0 0 22 22' fill='none'>
            {open ? (
              <path
                d='M4 4l14 14M18 4L4 18'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
            ) : (
              <path
                d='M3 6h16M3 11h16M3 16h16'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div
          className='absolute top-20 left-4 right-4 rounded-2xl p-5 flex flex-col gap-3 md:hidden'
          style={{
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,0,0,0.07)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.id ? `#${l.id}` : '#'}
              className='text-sm font-medium py-1'
              style={{ color: `${DARK}80` }}
              onClick={(e) => {
                if (l.id) {
                  e.preventDefault()
                  setOpen(false)
                  scrollTo(l.id)
                }
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href='#'
            className='flex items-center justify-center gap-1.5 text-sm font-semibold text-white px-4 py-2.5 rounded-xl mt-2'
            style={{ background: RED }}
          >
            Start Free Trial <ArrowRight />
          </a>
        </div>
      )}
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const sources = [
    { label: 'X.com', icon: <IconX /> },
  ]
  const outputs = [
    { label: 'TikTok', icon: <IconTikTok /> },
  ]

  return (
    <section className='relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-28 pb-16'>
      {/* BG blobs */}
      <div className='absolute inset-0 pointer-events-none'>
        <div
          className='absolute top-[-10%] left-[5%] w-125 h-125 rounded-full opacity-20'
          style={{
            background: `radial-gradient(circle, ${BLUE}, transparent 70%)`,
            filter: 'blur(80px)',
          }}
        />
        <div
          className='absolute top-[20%] right-[0%] w-100 h-100 rounded-full opacity-20'
          style={{
            background: `radial-gradient(circle, ${RED}, transparent 70%)`,
            filter: 'blur(80px)',
          }}
        />
        <div
          className='absolute bottom-[5%] left-[30%] w-100 h-100 rounded-full opacity-25'
          style={{
            background: `radial-gradient(circle, ${YELLOW}, transparent 70%)`,
            filter: 'blur(70px)',
          }}
        />
      </div>

      <div className='relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto'>
        {/* Badge */}
        <div
          className='relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-6 text-xs font-semibold overflow-hidden'
          style={{
            background:
              'linear-gradient(135deg, #FFF6CC 0%, #FFD700 40%, #D4AF37 70%, #B8860B 100%)',
            color: '#7A5C00',
            boxShadow:
              '0 0 12px rgba(255, 215, 0, 0.35), inset 0 1px 2px rgba(255,255,255,0.6)',
          }}
        >
          {/* Shine overlay */}
          <span
            className='absolute inset-0 opacity-40'
            style={{
              background:
                'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)',
              transform: 'translateX(-100%)',
              animation: 'shine 3s infinite',
            }}
          />

          <span
            className='w-1 h-1 rounded-full inline-block animate-pulse'
            style={{ background: '#FFF4B0' }}
          />

          <span className='relative z-10'>
            AI TikTok Bot · Powered by Local X Trends
          </span>

          <style jsx>{`
            @keyframes shine {
              to {
                transform: translateX(100%);
              }
            }
          `}</style>
        </div>

        <h1
          className='text-5xl md:text-7xl font-extrabold leading-[1.06] tracking-tight mb-6'
          style={{ color: DARK, letterSpacing: '-0.03em' }}
        >
          Spot local trends.
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${RED} 0%, ${BLUE} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Generate scripts.
          </span>
          <br />
          Post to TikTok daily.
        </h1>

        <p
          className='text-lg md:text-xl leading-relaxed max-w-2xl mb-10'
          style={{ color: DARK, opacity: 0.6 }}
        >
          ContentClaw scrapes the most-viewed local content on X, uses AI to
          generate TikTok-ready video scripts and captions, then auto-posts to
          your TikTok once a day — fully hands-free.
        </p>

        <div className='flex flex-col sm:flex-row items-center gap-3 mb-14'>
          <a
            href='#'
            className='flex items-center gap-2 font-semibold text-white px-7 py-3.5 rounded-2xl transition-all hover:opacity-85 text-base'
            style={{ background: DARK, boxShadow: `0 8px 24px ${DARK}40` }}
          >
            Start Free — No Credit Card <ArrowRight />
          </a>
          <a
            href='#'
            className='flex items-center gap-2 font-semibold px-7 py-3.5 rounded-2xl hover:opacity-80 transition-all text-base'
            style={{
              color: BLUE,
              border: `1.5px solid ${BLUE}40`,
              background: `${BLUE}08`,
            }}
          >
            Watch Demo <ArrowRight />
          </a>
        </div>

        {/* Flow diagram */}
        <div className='w-full max-w-3xl'>
          <div
            className='rounded-3xl p-6 md:p-8'
            style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.07)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.08)',
            }}
          >
            <div className='flex items-center justify-between gap-2 flex-wrap md:flex-nowrap'>
              {/* Sources */}
              <div className='flex flex-col gap-3 shrink-0'>
                <p
                  className='text-xs font-semibold uppercase tracking-widest mb-1'
                  style={{ color: DARK, opacity: 0.4 }}
                >
                  Trend Source
                </p>
                {sources.map((s) => {
                  const b = BRANDS[s.label]
                  return (
                    <div
                      key={s.label}
                      className='flex items-center gap-3 px-4 py-2.5 rounded-xl'
                      style={{
                        background: b.bg,
                        border: `1px solid ${b.border}`,
                      }}
                    >
                      {s.icon}
                      <span className='text-sm font-semibold text-toy-dark'>
                        {s.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Arrow: Sources → AI Engine */}
              <div className='hidden md:flex flex-col items-center justify-center shrink-0 gap-1'>
                <span
                  className='text-[10px] font-bold uppercase tracking-widest'
                  style={{ color: DARK, opacity: 0.75 }}
                >
                  scrape
                </span>
                <svg width='60' height='18' viewBox='0 0 60 18' fill='none'>
                  <line
                    x1='0'
                    y1='9'
                    x2='50'
                    y2='9'
                    stroke={DARK}
                    strokeWidth='2'
                    strokeDasharray='5 3'
                  />
                  <polygon points='50,4 60,9 50,14' fill={DARK} />
                </svg>
              </div>

              {/* AI brain */}
              <div className='flex flex-col items-center gap-2 shrink-0'>
                <div
                  className='w-14 h-14 rounded-2xl flex items-center justify-center animate-float'
                  style={{
                    background: YELLOW,
                    color: DARK,
                    boxShadow: `0 8px 24px ${YELLOW}60`,
                  }}
                >
                  <IconBrain />
                </div>
                <span
                  className='text-xs font-bold tracking-wide'
                  style={{ color: DARK, opacity: 0.45 }}
                >
                  AI ENGINE
                </span>
                <div className='flex gap-1 mt-1'>
                  {[RED, BLUE, YELLOW].map((c, i) => (
                    <div
                      key={i}
                      className='w-1.5 h-1.5 rounded-full'
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Arrow: AI Engine → Outputs */}
              <div className='hidden md:flex flex-col items-center justify-center shrink-0 gap-1'>
                <span
                  className='text-[10px] font-bold uppercase tracking-widest'
                  style={{ color: DARK, opacity: 0.75 }}
                >
                  publish
                </span>
                <svg width='60' height='18' viewBox='0 0 60 18' fill='none'>
                  <line
                    x1='0'
                    y1='9'
                    x2='50'
                    y2='9'
                    stroke={DARK}
                    strokeWidth='2'
                    strokeDasharray='5 3'
                  />
                  <polygon points='50,4 60,9 50,14' fill={DARK} />
                </svg>
              </div>

              {/* Outputs */}
              <div className='flex flex-col gap-3 shrink-0'>
                <p
                  className='text-xs font-semibold uppercase tracking-widest mb-1'
                  style={{ color: DARK, opacity: 0.4 }}
                >
                  Auto-Post To
                </p>
                {outputs.map((o) => {
                  const b = BRANDS[o.label]
                  return (
                    <div
                      key={o.label}
                      className='flex items-center gap-3 px-4 py-2.5 rounded-xl'
                      style={{
                        background: b.bg,
                        border: `1px solid ${b.border}`,
                      }}
                    >
                      {o.icon}
                      <span className='text-sm font-semibold text-toy-dark'>
                        {o.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Status bar */}
            <div
              className='mt-6 rounded-xl px-4 py-3 flex items-center justify-between'
              style={{
                background: `${YELLOW}15`,
                border: `1px solid ${YELLOW}50`,
              }}
            >
              <div className='flex items-center gap-2'>
                <span
                  className='w-2 h-2 rounded-full inline-block animate-pulse'
                  style={{ background: RED }}
                />
                <span className='text-xs font-semibold text-toy-dark'>
                  Next auto-post in
                </span>
              </div>
              <span
                className='text-xs font-mono font-bold'
                style={{ color: RED }}
              >
                08:42:17
              </span>
              <span
                className='text-xs font-semibold px-2.5 py-1 rounded-full'
                style={{ background: `${BLUE}15`, color: BLUE }}
              >
                TikTok ready
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          className='flex flex-wrap justify-center gap-8 mt-12 pt-10 w-full max-w-3xl'
          style={{ borderTop: `2px dashed rgba(0,0,0,0.08)` }}
        >
          {[
            { stat: '8K+', label: 'TikTok Creators', color: '#000000' },
            { stat: '1.2M+', label: 'TikTok Views Generated', color: '#000000' },
            { stat: '5×', label: 'Avg. TikTok Reach Lift', color: '#000000' },
            { stat: '100%', label: 'Hands-Free', color: '#000000' },
          ].map(({ stat, label, color }) => (
            <div key={label} className='flex flex-col items-center gap-1'>
              <span className='text-3xl font-extrabold' style={{ color }}>
                {stat}
              </span>
              <span
                className='text-sm font-medium'
                style={{ color: DARK, opacity: 0.45 }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Platforms() {
  return (
    <section
      id='integrations'
      className='py-14 overflow-hidden'
      style={{
        borderTop: `2px dashed rgba(0,0,0,0.07)`,
        borderBottom: `2px dashed rgba(0,0,0,0.07)`,
      }}
    >
      <p
        className='text-center text-xs font-semibold uppercase tracking-widest mb-10'
        style={{ color: DARK, opacity: 0.35 }}
      >
        One source. One destination. Fully automated.
      </p>
      <div className='flex justify-center items-center gap-4 md:gap-8 px-4 flex-wrap'>
        {/* X.com source */}
        <div
          className='flex items-center gap-3 px-6 py-4 rounded-2xl'
          style={{ background: BRANDS['X.com'].bg, border: `1.5px solid ${BRANDS['X.com'].border}` }}
        >
          <IconX />
          <div>
            <span className='block text-sm font-bold' style={{ color: BRANDS['X.com'].color }}>X.com</span>
            <span className='text-[10px] font-bold uppercase' style={{ color: BRANDS['X.com'].color, opacity: 0.55 }}>Scrape local trends</span>
          </div>
        </div>

        {/* Arrow with label */}
        <div className='flex flex-col items-center gap-1'>
          <span className='text-[10px] font-bold uppercase tracking-widest' style={{ color: DARK, opacity: 0.4 }}>AI engine</span>
          <svg width='60' height='18' viewBox='0 0 60 18' fill='none'>
            <line x1='0' y1='9' x2='50' y2='9' stroke={DARK} strokeWidth='2' strokeDasharray='5 3' />
            <polygon points='50,4 60,9 50,14' fill={DARK} />
          </svg>
        </div>

        {/* TikTok output */}
        <div
          className='flex items-center gap-3 px-6 py-4 rounded-2xl'
          style={{ background: BRANDS['TikTok'].bg, border: `1.5px solid ${BRANDS['TikTok'].border}` }}
        >
          <IconTikTok />
          <div>
            <span className='block text-sm font-bold' style={{ color: BRANDS['TikTok'].color }}>TikTok</span>
            <span className='text-[10px] font-bold uppercase' style={{ color: BRANDS['TikTok'].color, opacity: 0.55 }}>Auto-post daily</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  const iconColors = [RED, BLUE, YELLOW, RED, BLUE]
  const features = [
    {
      icon: <IconBolt />,
      title: 'Local X Trend Scraping',
      description:
        'ContentClaw monitors the most-viewed local posts, hashtags, and viral threads on X in your region — updated continuously, so you never miss a rising trend.',
      tags: ['X.com', 'Local Trends', 'Real-Time'],
    },
    {
      icon: <IconBrain />,
      title: 'AI TikTok Script Writer',
      description:
        'Our AI transforms scraped X trends into TikTok-native captions, video hooks, and hashtag sets — engineered for the For You Page algorithm.',
      tags: ['GPT-4o', 'Video Scripts', 'Hashtags'],
    },
    {
      icon: <IconClock />,
      title: '1 TikTok Post Per Day, Automated',
      description:
        "Set it once. ContentClaw picks your audience's peak hour on TikTok and posts automatically every day — no scheduling, no manual work.",
      tags: ['Smart Timing', 'Daily Schedule', 'Zero Effort'],
    },
    {
      icon: <IconBarChart />,
      title: 'Local Content Intelligence',
      description:
        'Not every X trend is relevant. ContentClaw filters by region, engagement rate, and your niche before generating content — so every post feels native.',
      tags: ['Location Filter', 'Niche Fit', 'Relevance Score'],
    },
    {
      icon: <IconTrendingUp />,
      title: 'TikTok Performance Insights',
      description:
        'After every post, ContentClaw tracks views, likes, saves and shares. The AI reads those results and rewrites its own strategy — so every next video performs better.',
      tags: ['Analytics', 'AI Learning', 'Auto-Optimise'],
    },
  ]

  return (
    <section id='features' className='py-24 px-4'>
      <div className='max-w-5xl mx-auto'>
        <div className='text-center mb-16'>
          <span
            className='inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full'
            style={{
              background: `${BLUE}12`,
              color: BLUE,
              border: `1.5px solid ${BLUE}30`,
            }}
          >
            Features
          </span>
          <h2
            className='text-4xl md:text-5xl font-extrabold tracking-tight'
            style={{ color: DARK, letterSpacing: '-0.03em' }}
          >
            Everything automated,
            <br />
            nothing left to do
          </h2>
        </div>

        <div className='grid md:grid-cols-2 gap-5'>
          {features.map((f, idx) => {
            const c = iconColors[idx]
            return (
              <div
                key={f.title}
                className='rounded-3xl p-7 hover:shadow-xl transition-all duration-300 cursor-pointer'
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: `1.5px solid ${c}20`,
                  boxShadow: `0 2px 16px ${c}10`,
                }}
              >
                <div
                  className='w-11 h-11 rounded-2xl flex items-center justify-center mb-5'
                  style={{ background: `${c}15`, color: c }}
                >
                  {f.icon}
                </div>
                <h3 className='text-xl font-bold mb-3 text-toy-dark'>
                  {f.title}
                </h3>
                <p
                  className='text-sm leading-relaxed mb-5'
                  style={{ color: DARK, opacity: 0.55 }}
                >
                  {f.description}
                </p>
                <div className='flex flex-wrap gap-2'>
                  {f.tags.map((tag) => (
                    <span
                      key={tag}
                      className='text-xs font-semibold px-3 py-1 rounded-full'
                      style={{ background: `${c}12`, color: c }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Connect X.com & TikTok',
      description:
        'Link your X.com account to read trends and your TikTok account to post. Takes under two minutes — ContentClaw starts monitoring local X content immediately.',
    },
    {
      number: '02',
      title: 'AI Finds Top Local Trends',
      description:
        "Our AI scans X for the highest-engagement local posts daily — filtering by your region, relevance to your niche, and viral potential.",
    },
    {
      number: '03',
      title: 'TikTok Script Is Generated',
      description:
        "AI rewrites the trend as a TikTok-native caption, short-form video hook, and hashtag set — optimised for the For You Page algorithm.",
    },
    {
      number: '04',
      title: 'Auto-Posted to TikTok',
      description:
        "At your audience's peak hour, ContentClaw posts directly to TikTok. Once a day, every day — zero manual work, zero scheduling.",
    },
  ]

  return (
    <section className='py-24 px-4'>
      <div
        className='max-w-5xl mx-auto rounded-3xl p-10 md:p-16 relative overflow-hidden'
        style={{ background: BLUE }}
      >
        <div
          className='absolute -top-15 -right-20 w-96 h-96 rounded-full opacity-15'
          style={{
            background: `radial-gradient(circle, ${YELLOW}, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />
        <div
          className='absolute -bottom-10 -left-10 w-64 h-64 rounded-full opacity-10'
          style={{
            background: `radial-gradient(circle, ${RED}, transparent 70%)`,
            filter: 'blur(50px)',
          }}
        />

        <div className='relative z-10'>
          <span
            className='inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full'
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            How It Works
          </span>
          <h2
            className='text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-14'
            style={{ letterSpacing: '-0.03em' }}
          >
            From X trend to TikTok
            <br />
            in four automated steps
          </h2>

          <div className='grid md:grid-cols-2 gap-6'>
            {steps.map((step, i) => (
              <div
                key={step.number}
                className='rounded-2xl p-6'
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <span
                  className='text-4xl font-extrabold block mb-4'
                  style={{
                    color:
                      i % 2 === 0 ? `${YELLOW}60` : 'rgba(255,255,255,0.2)',
                  }}
                >
                  {step.number}
                </span>
                <h3 className='text-lg font-bold text-white mb-2'>
                  {step.title}
                </h3>
                <p className='text-sm leading-relaxed text-white/60'>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function LivePreview() {
  const posts = [
    {
      platform: 'TikTok',
      icon: <IconTikTok />,
      source: 'Top local X trend · 2.1M views',
      content:
        'POV: This local street food spot blew up on X and nobody knew why — until I found the actual reason 👀 #fyp',
      tags: ['#localfood', '#fyp', '#trending'],
      status: 'Posted',
    },
    {
      platform: 'TikTok',
      icon: <IconTikTok />,
      source: 'Viral local X thread · 890K views',
      content:
        "Everyone in KL is talking about this new spot and I finally went. Here's my honest take 🧵→TikTok edition.",
      tags: ['#kualalumpur', '#localguide', '#viral'],
      status: 'Scheduled',
    },
    {
      platform: 'TikTok',
      icon: <IconTikTok />,
      source: 'Trending X hashtag · 3.4M views',
      content:
        'AI just wrote my TikTok script from the #1 trending X post in my city today. The engagement was insane.',
      tags: ['#aitools', '#tiktokmarketing', '#localtokens'],
      status: 'Generating',
    },
  ]

  const statusStyle: Record<string, { bg: string; color: string }> = {
    Posted: { bg: `${RED}15`, color: RED },
    Scheduled: { bg: `${BLUE}12`, color: BLUE },
    Generating: { bg: `${YELLOW}30`, color: '#8B6F00' },
  }

  return (
    <section className='py-24 px-4'>
      <div className='max-w-5xl mx-auto'>
        <div className='text-center mb-16'>
          <span
            className='inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full'
            style={{
              background: `${RED}12`,
              color: RED,
              border: `1.5px solid ${RED}30`,
            }}
          >
            Live Dashboard
          </span>
          <h2
            className='text-4xl md:text-5xl font-extrabold tracking-tight'
            style={{ color: DARK, letterSpacing: '-0.03em' }}
          >
            Today's X trend,
            <br />
            tomorrow's TikTok viral
          </h2>
        </div>

        <div
          className='rounded-3xl overflow-hidden'
          style={{
            border: '1.5px solid rgba(0,0,0,0.07)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.08)',
          }}
        >
          <div
            className='flex items-center gap-2 px-5 py-3.5 border-b'
            style={{
              background: 'rgba(0,0,0,0.02)',
              borderColor: 'rgba(0,0,0,0.06)',
            }}
          >
            <div className='w-3 h-3 rounded-full' style={{ background: RED }} />
            <div
              className='w-3 h-3 rounded-full'
              style={{ background: YELLOW }}
            />
            <div
              className='w-3 h-3 rounded-full'
              style={{ background: '#30D158' }}
            />
            <div className='flex-1 mx-4 rounded-lg h-6 bg-black/5 flex items-center px-3'>
              <span className='text-xs' style={{ color: `${DARK}40` }}>
                app.contentclaw.ai/feed
              </span>
            </div>
          </div>

          <div
            className='p-5 flex flex-col gap-4'
            style={{ background: 'rgba(255,255,255,0.6)' }}
          >
            {posts.map((post, i) => {
              const b = BRANDS[post.platform]
              return (
                <div
                  key={i}
                  className='rounded-2xl p-5'
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <div className='flex items-start justify-between gap-4 mb-3'>
                    <div className='flex items-center gap-2.5'>
                      <div
                        className='w-9 h-9 rounded-xl flex items-center justify-center'
                        style={{
                          background: b.bg,
                          border: `1px solid ${b.border}`,
                        }}
                      >
                        {post.icon}
                      </div>
                      <div>
                        <p className='text-sm font-bold text-toy-dark'>
                          {post.platform}
                        </p>
                        <p className='text-xs' style={{ color: `${DARK}45` }}>
                          {post.source}
                        </p>
                      </div>
                    </div>
                    <span
                      className='text-xs font-bold px-3 py-1 rounded-full shrink-0'
                      style={statusStyle[post.status]}
                    >
                      {post.status === 'Generating' && '⟳ '}
                      {post.status}
                    </span>
                  </div>
                  <p
                    className='text-sm leading-relaxed mb-3'
                    style={{ color: `${DARK}75` }}
                  >
                    {post.content}
                  </p>
                  <div className='flex flex-wrap gap-1.5'>
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className='text-xs font-medium'
                        style={{ color: b.color }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function Insights() {
  const metrics = [
    { label: 'Total Reach', value: '284K', delta: '+24%', color: '#000000' },
    {
      label: 'Avg. Engagement',
      value: '6.8%',
      delta: '+11%',
      color: '#000000',
    },
    {
      label: 'Saves / Shares',
      value: '9,402',
      delta: '+38%',
      color: '#000000',
    },
    { label: 'Watch Time', value: '4.1 min', delta: '+19%', color: '#000000' },
  ]

  const aiInsights = [
    {
      label: 'Hook length',
      insight:
        'Posts opening with a question under 8 words get 3.2× more comments on TikTok.',
      action: 'Applied to next post',
      color: RED,
    },
    {
      label: 'Best post time',
      insight:
        'Your audience is most active between 7–9 PM. Rescheduling all future posts to this window.',
      action: 'Schedule updated',
      color: BLUE,
    },
    {
      label: 'Caption length',
      insight:
        'Captions under 50 characters on Instagram drive 40% higher saves than longer ones.',
      action: 'Applied to next post',
      color: RED,
    },
    {
      label: 'Top hashtag cluster',
      insight:
        '#shopeehaul + #trending performed 2× better than your previous hashtag set this week.',
      action: 'Set as default',
      color: BLUE,
    },
  ]

  const chartBars = [22, 35, 28, 50, 42, 68, 58, 75, 62, 84, 79, 100]
  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const barColors = [
    YELLOW,
    YELLOW,
    YELLOW,
    YELLOW,
    RED,
    RED,
    RED,
    RED,
    RED,
    BLUE,
    BLUE,
    BLUE,
  ]

  return (
    <section className='py-24 px-4'>
      <div className='max-w-5xl mx-auto'>
        <div className='text-center mb-16'>
          <span
            className='inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full'
            style={{
              background: `${YELLOW}30`,
              color: '#8B6F00',
              border: `1.5px solid ${YELLOW}`,
            }}
          >
            AI Insights
          </span>
          <h2
            className='text-4xl md:text-5xl font-extrabold tracking-tight'
            style={{ color: DARK, letterSpacing: '-0.03em' }}
          >
            Your AI gets smarter
            <br />
            after every single post
          </h2>
          <p
            className='text-base mt-4 max-w-xl mx-auto'
            style={{ color: DARK, opacity: 0.5 }}
          >
            ContentClaw analyses your TikTok performance after each post, then
            automatically adjusts its scraping filters and script style — no
            manual tweaking needed.
          </p>
        </div>

        {/* Metrics row */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          {metrics.map((m) => (
            <div
              key={m.label}
              className='rounded-2xl p-5'
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: `1.5px solid ${m.color}20`,
                boxShadow: `0 2px 12px ${m.color}10`,
              }}
            >
              <p
                className='text-xs font-medium mb-2'
                style={{ color: DARK, opacity: 0.45 }}
              >
                {m.label}
              </p>
              <p className='text-2xl font-extrabold' style={{ color: m.color }}>
                {m.value}
              </p>
              <div className='flex items-center gap-1.5 mt-1'>
                <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                  <path
                    d='M2 9l3.5-4L7.5 7 10 3'
                    stroke={m.color}
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <span className='text-xs font-bold' style={{ color: m.color }}>
                  {m.delta}
                </span>
                <span className='text-xs' style={{ color: DARK, opacity: 0.4 }}>
                  vs last week
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart + AI Insights */}
        <div className='grid md:grid-cols-2 gap-5'>
          {/* Chart */}
          <div
            className='rounded-3xl p-6'
            style={{
              background: 'rgba(255,255,255,0.9)',
              border: '1.5px solid rgba(0,0,0,0.07)',
              boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
            }}
          >
            <div className='flex items-start justify-between mb-6'>
              <div>
                <p className='text-sm font-bold text-toy-dark'>
                  Engagement over time
                </p>
                <p
                  className='text-xs mt-0.5'
                  style={{ color: DARK, opacity: 0.4 }}
                >
                  All platforms · last 12 posts
                </p>
              </div>
              <span
                className='text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1'
                style={{ background: `${YELLOW}30`, color: '#8B6F00' }}
              >
                <IconSpark /> AI optimising
              </span>
            </div>

            <div className='flex items-end gap-2 h-28 mb-3'>
              {chartBars.map((h, i) => (
                <div
                  key={i}
                  className='flex-1 rounded-sm'
                  style={{ height: `${h}%`, background: barColors[i] }}
                />
              ))}
            </div>
            <div className='flex justify-between'>
              {weekLabels.map((d) => (
                <span
                  key={d}
                  className='text-[10px] font-medium'
                  style={{ color: DARK, opacity: 0.3 }}
                >
                  {d}
                </span>
              ))}
            </div>

            <div
              className='mt-4 rounded-xl px-3 py-2 flex items-center gap-2'
              style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}20` }}
            >
              <span style={{ color: BLUE }}>
                <IconTrendingUp />
              </span>
              <p className='text-xs font-medium text-toy-dark'>
                Engagement up{' '}
                <span className='font-bold' style={{ color: BLUE }}>
                  +62%
                </span>{' '}
                since AI insights activated
              </p>
            </div>
          </div>

          {/* AI insight cards */}
          <div className='flex flex-col gap-3'>
            <p
              className='text-xs font-semibold uppercase tracking-widest px-1'
              style={{ color: DARK, opacity: 0.4 }}
            >
              What AI changed this week
            </p>
            {aiInsights.map((ins) => (
              <div
                key={ins.label}
                className='rounded-2xl p-4 flex items-start gap-3'
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: `1.5px solid ${ins.color}18`,
                  boxShadow: `0 2px 10px ${ins.color}08`,
                }}
              >
                <div
                  className='w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5'
                  style={{ background: `${ins.color}15`, color: ins.color }}
                >
                  <IconSpark />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between gap-2 mb-1'>
                    <p className='text-xs font-bold uppercase tracking-wide text-toy-dark'>
                      {ins.label}
                    </p>
                    <span
                      className='text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0'
                      style={{ background: `${ins.color}12`, color: ins.color }}
                    >
                      ✓ {ins.action}
                    </span>
                  </div>
                  <p
                    className='text-xs leading-relaxed'
                    style={{ color: DARK, opacity: 0.6 }}
                  >
                    {ins.insight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback loop */}
        <div
          className='mt-6 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6'
          style={{
            background: `linear-gradient(135deg, ${BLUE} 0%, #0044CC 100%)`,
          }}
        >
          <div>
            <p className='text-white font-bold text-lg mb-1'>
              The compounding content loop
            </p>
            <p className='text-sm text-white/60'>
              Post → Analyse → AI learns → Better post → Repeat. Every day your
              content gets sharper, your reach grows, and your effort stays at
              zero.
            </p>
          </div>
          <div className='flex items-center gap-3 shrink-0'>
            {['Post', 'Analyse', 'Learn', 'Improve'].map((step, i) => {
              const stepColors = [RED, YELLOW, YELLOW, RED]
              return (
                <div key={step} className='flex items-center gap-3'>
                  <div className='flex flex-col items-center gap-1'>
                    <div
                      className='w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold'
                      style={{
                        background: stepColors[i],
                        color: i === 1 || i === 2 ? DARK : 'white',
                        boxShadow: `0 4px 12px ${stepColors[i]}60`,
                      }}
                    >
                      {i + 1}
                    </div>
                    <span className='text-[10px] font-semibold text-white/60'>
                      {step}
                    </span>
                  </div>
                  {i < 3 && (
                    <svg
                      width='12'
                      height='12'
                      viewBox='0 0 12 12'
                      fill='none'
                      className='mb-3'
                    >
                      <path
                        d='M2 6h8M7 3l3 3-3 3'
                        stroke='rgba(255,255,255,0.35)'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const reviews = [
    {
      quote:
        'I connected ContentClaw on a Monday. By Wednesday it had already scraped a local X trend, turned it into a TikTok script, and posted it. The video hit 80K views.',
      name: 'Aisha Tan',
      role: 'TikTok Creator',
      company: '@aishavibes',
    },
    {
      quote:
        "I had no idea what to post. ContentClaw found a local X thread blowing up in my city, wrote the TikTok caption, and posted while I was asleep. 200K views in two days.",
      name: 'Marcus Rivera',
      role: 'Content Creator',
      company: '@marcusmakes',
    },
    {
      quote:
        "The local X scraping is the killer feature. It catches trends before they hit TikTok organically — so by the time others post, ContentClaw already has me ranking.",
      name: 'Lily Nguyen',
      role: 'Digital Marketer',
      company: 'BrandBoost Agency',
    },
  ]

  return (
    <section className='py-24 px-4'>
      <div className='max-w-5xl mx-auto'>
        <div className='text-center mb-16'>
          <span
            className='inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full'
            style={{
              background: `${YELLOW}30`,
              color: '#8B6F00',
              border: `1.5px solid ${YELLOW}`,
            }}
          >
            Testimonials
          </span>
          <h2
            className='text-4xl md:text-5xl font-extrabold tracking-tight'
            style={{ color: DARK, letterSpacing: '-0.03em' }}
          >
            Creators who stopped
            <br />
            doing it manually
          </h2>
        </div>

        <div className='grid md:grid-cols-3 gap-5'>
          {reviews.map((r, i) => (
            <div
              key={r.name}
              className='rounded-3xl p-7 flex flex-col justify-between'
              style={{
                background: i === 1 ? DARK : 'rgba(255,255,255,0.9)',
                border: i === 1 ? 'none' : `1.5px solid ${RED}18`,
                boxShadow:
                  i === 1 ? `0 20px 60px ${RED}35` : `0 2px 16px ${RED}06`,
              }}
            >
              <div>
                <div className='flex gap-0.5 mb-4'>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg
                      key={j}
                      width='14'
                      height='14'
                      viewBox='0 0 14 14'
                      fill={YELLOW}
                    >
                      <path d='M7 1l1.6 4.4H13l-3.8 2.8 1.5 4.4L7 9.8l-3.7 2.8 1.5-4.4L1 5.4h4.4z' />
                    </svg>
                  ))}
                </div>
                <p
                  className='text-sm leading-relaxed mb-6'
                  style={{
                    color: i === 1 ? 'rgba(255,255,255,0.85)' : `${DARK}B0`,
                  }}
                >
                  &ldquo;{r.quote}&rdquo;
                </p>
              </div>
              <div className='flex items-center gap-3'>
                <div
                  className='w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold'
                  style={{
                    background: i === 1 ? 'rgba(255,255,255,0.2)' : `${RED}15`,
                    color: i === 1 ? 'white' : RED,
                  }}
                >
                  {r.name[0]}
                </div>
                <div>
                  <p
                    className='text-sm font-semibold'
                    style={{ color: i === 1 ? 'white' : DARK }}
                  >
                    {r.name}
                  </p>
                  <p
                    className='text-xs'
                    style={{
                      color: i === 1 ? 'rgba(255,255,255,0.5)' : `${DARK}60`,
                    }}
                  >
                    {r.role} · {r.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/mo',
      description: 'Try ContentClaw risk-free forever.',
      features: [
        '1 source platform',
        '1 output channel',
        '5 AI posts/month',
        'Basic trend scraping',
        'Community support',
      ],
      cta: 'Start Free',
    },
    {
      name: 'Creator',
      price: '$29',
      period: '/mo',
      description: 'For solo creators scaling their content.',
      features: [
        'All 3 source platforms',
        'All 4 output channels',
        'Unlimited AI posts',
        'Daily auto-scheduling',
        'Advanced trend analysis',
        'Custom AI voice & tone',
        'Priority support',
      ],
      cta: 'Start Free Trial',
      featured: true,
    },
    {
      name: 'Agency',
      price: '$99',
      period: '/mo',
      description: 'For teams managing multiple brands.',
      features: [
        'Everything in Creator',
        'Up to 10 brand accounts',
        'White-label dashboard',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
      ],
      cta: 'Contact Us',
    },
  ]

  return (
    <section id='pricing' className='py-24 px-4'>
      <div className='max-w-5xl mx-auto'>
        <div className='text-center mb-16'>
          <span
            className='inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full'
            style={{
              background: `${BLUE}12`,
              color: BLUE,
              border: `1.5px solid ${BLUE}30`,
            }}
          >
            Pricing
          </span>
          <h2
            className='text-4xl md:text-5xl font-extrabold tracking-tight'
            style={{ color: DARK, letterSpacing: '-0.03em' }}
          >
            Post every day
            <br />
            for less than a coffee
          </h2>
        </div>

        <div className='grid md:grid-cols-3 gap-5 items-center'>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-7 flex flex-col ${plan.featured ? 'md:-my-4' : ''}`}
              style={{
                background: plan.featured ? BLUE : 'rgba(255,255,255,0.9)',
                border: plan.featured ? 'none' : `1.5px solid ${BLUE}18`,
                boxShadow: plan.featured
                  ? `0 24px 64px ${BLUE}40`
                  : `0 2px 16px ${BLUE}06`,
              }}
            >
              {plan.featured && (
                <span
                  className='text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full self-start mb-4'
                  style={{ background: `${YELLOW}25`, color: YELLOW }}
                >
                  Most Popular
                </span>
              )}
              <h3
                className='text-lg font-bold mb-1'
                style={{ color: plan.featured ? 'white' : DARK }}
              >
                {plan.name}
              </h3>
              <p
                className='text-xs mb-5'
                style={{
                  color: plan.featured ? 'rgba(255,255,255,0.55)' : `${DARK}70`,
                }}
              >
                {plan.description}
              </p>
              <div className='flex items-baseline gap-1 mb-6'>
                <span
                  className='text-4xl font-extrabold'
                  style={{ color: plan.featured ? 'white' : DARK }}
                >
                  {plan.price}
                </span>
                <span
                  className='text-sm'
                  style={{
                    color: plan.featured
                      ? 'rgba(255,255,255,0.45)'
                      : `${DARK}55`,
                  }}
                >
                  {plan.period}
                </span>
              </div>

              <div className='flex flex-col gap-2.5 mb-8 flex-1'>
                {plan.features.map((f) => (
                  <div key={f} className='flex items-start gap-2.5'>
                    <div
                      className='w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5'
                      style={{
                        background: plan.featured ? `${YELLOW}25` : `${BLUE}12`,
                      }}
                    >
                      <svg
                        width='10'
                        height='10'
                        viewBox='0 0 10 10'
                        fill='none'
                      >
                        <path
                          d='M2 5l2 2 4-4'
                          stroke={plan.featured ? YELLOW : BLUE}
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </div>
                    <span
                      className='text-sm leading-snug'
                      style={{
                        color: plan.featured
                          ? 'rgba(255,255,255,0.75)'
                          : `${DARK}B0`,
                      }}
                    >
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href='#'
                className='flex items-center justify-center gap-1.5 font-semibold px-5 py-3 rounded-xl text-sm hover:opacity-85 transition-opacity'
                style={{
                  background: plan.featured ? YELLOW : BLUE,
                  color: plan.featured ? DARK : 'white',
                  boxShadow: plan.featured
                    ? `0 4px 16px ${YELLOW}50`
                    : `0 4px 16px ${BLUE}30`,
                }}
              >
                {plan.cta} <ArrowRight />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className='py-16 px-4'>
      <div className='max-w-5xl mx-auto'>
        <div
          className='rounded-3xl p-12 md:p-20 text-center relative overflow-hidden'
          style={{
            background: `linear-gradient(135deg, ${YELLOW}40 0%, ${YELLOW}20 50%, ${RED}15 100%)`,
            border: `1.5px solid ${YELLOW}60`,
          }}
        >
          <div
            className='absolute -top-15 left-[20%] w-80 h-80 rounded-full opacity-30'
            style={{
              background: `radial-gradient(circle, ${YELLOW}, transparent 70%)`,
              filter: 'blur(60px)',
            }}
          />
          <div
            className='absolute -bottom-10 right-[10%] w-64 h-64 rounded-full opacity-20'
            style={{
              background: `radial-gradient(circle, ${RED}, transparent 70%)`,
              filter: 'blur(50px)',
            }}
          />
          <div className='relative z-10'>
            <h2
              className='text-4xl md:text-6xl font-extrabold tracking-tight mb-5'
              style={{ color: DARK, letterSpacing: '-0.03em' }}
            >
              Stop chasing trends.
              <br />
              Let AI post for you.
            </h2>
            <p
              className='text-lg max-w-lg mx-auto mb-8'
              style={{ color: DARK, opacity: 0.6 }}
            >
              Join 8,000+ TikTok creators who post every day from local X trends
              — without writing a single word. Set up in 5 minutes. Free forever plan.
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
              <a
                href='#'
                className='inline-flex items-center gap-2 font-semibold text-white px-8 py-4 rounded-2xl hover:opacity-85 transition-opacity text-base'
                style={{ background: DARK, boxShadow: `0 12px 32px ${RED}40` }}
              >
                Start Free — No Credit Card <ArrowRight />
              </a>
              <a
                href='#'
                className='inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-2xl hover:opacity-80 transition-all text-base'
                style={{
                  color: BLUE,
                  border: `1.5px solid ${BLUE}35`,
                  background: `${BLUE}08`,
                }}
              >
                Watch Demo <ArrowRight />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const cols = [
    {
      heading: 'Product',
      links: ['Features', 'Integrations', 'Pricing', 'Changelog'],
      color: RED,
    },
    {
      heading: 'Use Cases',
      links: ['E-commerce', 'Content Creators', 'Agencies', 'Brands'],
      color: BLUE,
    },
    {
      heading: 'Company',
      links: ['About', 'Blog', 'Careers', 'Contact'],
      color: YELLOW,
    },
  ]

  return (
    <footer
      className='py-16 px-4'
      style={{
        borderTop: `2px dashed rgba(0,0,0,0.07)`,
        background: 'rgba(0,0,0,0.01)',
      }}
    >
      <div className='max-w-5xl mx-auto'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-10 mb-12'>
          <div className='col-span-2 md:col-span-1'>
            <div className='flex items-center gap-2 mb-4'>
              <div
                className='w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold'
                style={{ background: RED }}
              >
                ✦
              </div>
              <span className='font-bold text-toy-dark'>ContentClaw</span>
            </div>
            <p
              className='text-sm leading-relaxed'
              style={{ color: DARK, opacity: 0.45 }}
            >
              Scrape X trends. Generate TikTok scripts. Post daily. On autopilot.
            </p>
            <div className='flex gap-3 mt-4'>
              {[
                { icon: <IconTikTok />, brand: BRANDS['TikTok'] },
                { icon: <IconInstagram />, brand: BRANDS['Instagram'] },
                { icon: <IconFacebook />, brand: BRANDS['Facebook'] },
                { icon: <IconYouTube />, brand: BRANDS['YouTube'] },
              ].map((s, i) => (
                <a
                  key={i}
                  href='#'
                  className='w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70'
                  style={{
                    background: s.brand.bg,
                    border: `1.5px solid ${s.brand.border}`,
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.heading}>
              <p
                className='text-xs font-semibold uppercase tracking-widest mb-4'
                style={{ color: col.color }}
              >
                {col.heading}
              </p>
              <ul className='flex flex-col gap-2.5'>
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href='#'
                      className='text-sm hover:opacity-100 transition-opacity'
                      style={{ color: DARK, opacity: 0.5 }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className='flex flex-col md:flex-row items-center justify-between gap-4 pt-8'
          style={{ borderTop: `1.5px dashed rgba(0,0,0,0.07)` }}
        >
          <p className='text-xs' style={{ color: `${DARK}50` }}>
            © 2025 ContentClaw. All rights reserved.
          </p>
          <div className='flex gap-5'>
            {['Privacy', 'Terms', 'Support'].map((s, i) => (
              <a
                key={s}
                href='#'
                className='text-xs font-medium hover:opacity-100 transition-opacity'
                style={{ color: [RED, BLUE, YELLOW][i], opacity: 0.7 }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <main
      style={{ fontFamily: 'var(--font-jakarta), -apple-system, sans-serif' }}
      className='mx-auto'
    >
      <Navbar />
      <Hero />
      <Platforms />
      <Features />
      <HowItWorks />
      <LivePreview />
      <Insights />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  )
}
