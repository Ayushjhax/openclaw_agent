'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const steps = [
  { num: '01', title: 'Signal Acquisition', desc: 'Our agents continuously ingest market data, news, sentiment, and cross-asset correlations — building a living map of opportunity.' },
  { num: '02', title: 'Pattern Recognition', desc: 'Deep learning models identify non-obvious patterns across timescales, filtering noise with surgical precision.' },
  { num: '03', title: 'Strategy Formation', desc: 'Multi-agent deliberation synthesizes signals into trade theses, stress-tested against thousands of historical regimes.' },
  { num: '04', title: 'Execution & Adaptation', desc: 'Positions are executed with optimal timing and continuously monitored. Agents adapt in real-time as conditions shift.' },
];

export default function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      style={{ background: 'black', padding: '10rem 1.5rem 14rem', position: 'relative', overflow: 'hidden' }}
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

      {/* 7-stop gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.75) 10%, rgba(0,0,0,0.4) 20%, transparent 38%, transparent 72%, rgba(0,0,0,0.6) 88%, black 100%)',
      }} />
      {/* Side vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to right, black 0%, transparent 18%, transparent 82%, black 100%)',
      }} />
      {/* Dark wash */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(0,0,0,0.38)', pointerEvents: 'none' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '64rem', margin: '0 auto', textAlign: 'center' }}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <span className="section-badge">How It Works</span>
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
            color: 'rgba(255,255,255,0.62)', lineHeight: 1.7,
            margin: '0 auto 4rem', maxWidth: '42rem',
          }}
        >
          From concept to execution, our AI-guided process turns direction into a portfolio
          that feels precise, adaptive, and alive.
        </motion.p>

        {/* Steps grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          maxWidth: '56rem',
          margin: '0 auto',
          textAlign: 'left',
        }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              custom={i + 3} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              style={{
                borderRadius: '1.5rem', padding: '2rem',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 20px 60px rgba(0,0,0,0.5)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Shimmer line */}
              <div style={{
                position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)',
              }} />
              <div style={{
                fontFamily: "'Barlow', sans-serif", fontWeight: 300,
                fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)',
                marginBottom: '1rem', letterSpacing: '0.05em',
              }}>
                {step.num}
              </div>
              <div style={{
                fontFamily: "'Barlow', sans-serif", fontWeight: 500,
                fontSize: '0.95rem', color: 'white', marginBottom: '0.75rem',
              }}>
                {step.title}
              </div>
              <p style={{
                fontFamily: "'Barlow', sans-serif", fontWeight: 300,
                fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.6, margin: 0,
              }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
