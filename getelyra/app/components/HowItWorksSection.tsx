'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, SlidersHorizontal, Zap, Link2, ShieldCheck, BarChart3 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const steps = [
  {
    num: '01',
    label: 'Discovery',
    icon: Search,
    accent: 'rgba(245,200,66,1)',
    hex: '#F5C842',
    accentBg: 'linear-gradient(135deg, rgba(245,200,66,0.32) 0%, rgba(245,200,66,0.08) 100%)',
    title: 'Autonomous Signal Synthesis',
    desc: 'Agents scan whale movements, liquidity shifts, and social sentiment across 10+ exchanges in real-time to surface what matters.',
  },
  {
    num: '02',
    label: 'Strategy',
    icon: SlidersHorizontal,
    accent: 'rgba(139,124,246,1)',
    hex: '#8B7CF6',
    accentBg: 'linear-gradient(135deg, rgba(139,124,246,0.32) 0%, rgba(139,124,246,0.08) 100%)',
    title: 'Programmable Rules of Engagement',
    desc: 'Define your boundaries — asset selection, exposure limits, and drawdown — and let agents operate 24/7 with zero emotional bias.',
  },
  {
    num: '03',
    label: 'Execution',
    icon: Zap,
    accent: 'rgba(59,130,246,1)',
    hex: '#3B82F6',
    accentBg: 'linear-gradient(135deg, rgba(59,130,246,0.32) 0%, rgba(59,130,246,0.08) 100%)',
    title: 'Intent-Based Venue Routing',
    desc: 'Orders are routed for optimal outcomes via Jupiter or HyperLiquid, ensuring sub-400ms latency and high-velocity settlement.',
  },
  {
    num: '04',
    label: 'Attribution',
    icon: Link2,
    accent: 'rgba(45,212,191,1)',
    hex: '#2DD4BF',
    accentBg: 'linear-gradient(135deg, rgba(45,212,191,0.32) 0%, rgba(45,212,191,0.08) 100%)',
    title: 'Total Recursive Transparency',
    desc: 'Every action is logged with its justification. Trace every decision back to the specific data stream and intent that triggered it.',
  },
  {
    num: '05',
    label: 'Verification',
    icon: ShieldCheck,
    accent: 'rgba(249,115,22,1)',
    hex: '#F97316',
    accentBg: 'linear-gradient(135deg, rgba(249,115,22,0.32) 0%, rgba(249,115,22,0.08) 100%)',
    title: 'Institutional Live-Paper Parity',
    desc: 'Rigorous cross-validation of strategy code against historical regimes, slippage modeling, and adversarial market scenarios.',
  },
  {
    num: '06',
    label: 'Post-Trade',
    icon: BarChart3,
    accent: 'rgba(244,63,94,1)',
    hex: '#F43F5E',
    accentBg: 'linear-gradient(135deg, rgba(244,63,94,0.32) 0%, rgba(244,63,94,0.08) 100%)',
    title: 'Automated Capital Management',
    desc: 'Real-time reconciliation and PnL attribution to ensure absolute sovereign control over every basis point moved.',
  },
];

export default function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      style={{ background: 'black', padding: '8rem 1.5rem 10rem', position: 'relative', overflow: 'hidden' }}
    >
      {/* Ken Burns background image */}
      <motion.img
        src="/image2.jpg"
        alt=""
        animate={{ scale: [1.06, 1.12, 1.06], x: ['0%', '-2%', '0%'], y: ['0%', '-1.5%', '0%'] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center center',
          transformOrigin: 'center center', zIndex: 0,
        }}
      />

      {/* Gradient overlays */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.75) 10%, rgba(0,0,0,0.4) 20%, transparent 38%, transparent 72%, rgba(0,0,0,0.6) 88%, black 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to right, black 0%, transparent 18%, transparent 82%, black 100%)',
      }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(0,0,0,0.42)', pointerEvents: 'none' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '72rem', margin: '0 auto', textAlign: 'center' }}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <span className="section-badge">DSEA Engine</span>
        </motion.div>

        <motion.h2
          custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            letterSpacing: '-0.04em', lineHeight: 0.92,
            color: 'white', margin: '0 0 1.25rem',
          }}
        >
          You imagine it.<br />We shape it.
        </motion.h2>

        <motion.p
          custom={2} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            fontFamily: "'Barlow', sans-serif", fontWeight: 300,
            fontSize: 'clamp(1rem, 2vw, 1.1rem)',
            color: 'rgba(255,255,255,0.55)', lineHeight: 1.7,
            margin: '0 auto 4rem', maxWidth: '42rem',
          }}
        >
          From concept to execution, our AI-guided process turns direction into a portfolio
          that feels precise, adaptive, and alive.
        </motion.p>

        {/* 6-box 3-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          textAlign: 'left',
        }}
          className="dsea-grid"
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            const a = (opacity: number) => step.accent.replace('1)', `${opacity})`);
            return (
              <motion.div
                key={step.num}
                custom={i + 3} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="glass-card"
                style={{
                  borderRadius: '1.25rem',
                  padding: '1.6rem',
                  cursor: 'default',
                  border: `1px solid ${a(0.22)}`,
                  transition: 'border-color 0.3s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = a(0.42); }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = a(0.22); }}
              >
                {/* Top accent shimmer */}
                <div style={{
                  position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
                  background: `linear-gradient(to right, transparent, ${a(0.65)}, transparent)`,
                  pointerEvents: 'none',
                }} />

                {/* Header: label pill + number */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', position: 'relative' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '0.22rem 0.7rem', borderRadius: '9999px',
                    background: 'rgba(0,0,0,0.72)',
                    border: `1px solid ${a(0.55)}`,
                    backdropFilter: 'blur(8px)',
                  }}>
                    <span style={{
                      fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: '0.6rem',
                      letterSpacing: '0.16em', textTransform: 'uppercase',
                      color: step.accent,
                      textShadow: `0 0 8px ${a(0.5)}`,
                    }}>{step.label}</span>
                  </div>
                  <span style={{
                    fontFamily: "'Barlow', sans-serif", fontWeight: 300,
                    fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.04em',
                  }}>{step.num}</span>
                </div>

                {/* Icon box */}
                <div style={{
                  width: '2.6rem', height: '2.6rem',
                  borderRadius: '0.75rem',
                  background: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)`,
                  border: `1px solid ${a(0.4)}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.1rem',
                  boxShadow: `inset 0 1px 0 ${a(0.25)}, 0 2px 12px ${a(0.2)}`,
                }}>
                  <Icon size={16} color={step.accent} strokeWidth={2.2} />
                </div>

                {/* Title */}
                <div style={{
                  fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
                  fontSize: '1.05rem', color: 'rgba(255,255,255,0.95)',
                  marginBottom: '0.55rem', lineHeight: 1.25,
                }}>
                  {step.title}
                </div>

                {/* Description */}
                <p style={{
                  fontFamily: "'Barlow', sans-serif", fontWeight: 300,
                  fontSize: '0.82rem', color: 'rgba(255,255,255,0.58)',
                  lineHeight: 1.65, margin: 0,
                }}>
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dsea-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          .dsea-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
