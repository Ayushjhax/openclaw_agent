'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ParticleCanvas from './ParticleCanvas';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const lifecycleSteps = [
  'Set the goal',
  '24/7 Monitoring',
  'Condition Triggered',
  'Elyra HIL Reviews',
  'Strategy Selected',
  'Trade Goes Live On-chain',
  'TP/SL Active',
  'Alert Delivered',
  'Capital Starts working while you sleep',
];

export default function IntroSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      style={{ background: 'black', padding: '10rem 1.5rem 14rem', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/image3.jpg"
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none', opacity: 0.38 }}
      />

      {/* Strong top/bottom gradient for legibility */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.55) 20%, rgba(0,0,0,0.45) 80%, black 100%)',
      }} />
      {/* Dark wash */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(0,0,0,0.52)', pointerEvents: 'none' }} />

      {/* Floating dust */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        <ParticleCanvas />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3, maxWidth: '52rem', margin: '0 auto', textAlign: 'center' }}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <span className="section-badge">How Elyra runs your capital</span>
        </motion.div>

        <motion.h2
          custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            letterSpacing: '-0.04em', lineHeight: 0.92,
            color: 'white', margin: '0 0 1.5rem',
          }}
        >
          Dismantling Information Asymmetry<br />through Agentic Intelligence.
        </motion.h2>

        <motion.p
          custom={2} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            fontFamily: "'Barlow', sans-serif", fontWeight: 300,
            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            color: 'rgba(255,255,255,0.65)', lineHeight: 1.7,
            margin: '0 0 3.5rem',
          }}
        >
          We build sovereign capital infrastructure that captures structural alpha —<br />
          adaptive, precise, and vertically integrated across every market domain.
        </motion.p>

        {/* Lifecycle pipeline — horizontal scroll on mobile */}
        <motion.div
          custom={3} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ position: 'relative' }}
        >
          {/* Left fade edge */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '3.5rem', zIndex: 2, pointerEvents: 'none',
            background: 'linear-gradient(to right, rgba(0,0,0,0.9), transparent)',
          }} />
          {/* Right fade edge */}
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '3.5rem', zIndex: 2, pointerEvents: 'none',
            background: 'linear-gradient(to left, rgba(0,0,0,0.9), transparent)',
          }} />

          {/* Thin accent progress line behind chips */}
          <div style={{
            position: 'absolute', top: '50%', left: '3.5rem', right: '3.5rem',
            height: '1px', zIndex: 0,
            background: 'linear-gradient(to right, rgba(245,200,66,0.12), rgba(45,212,191,0.12), rgba(245,200,66,0.12))',
            transform: 'translateY(-50%)',
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            padding: '1.25rem 3.5rem',
            gap: 0,
            position: 'relative',
            zIndex: 1,
          }}>
            {lifecycleSteps.flatMap((step, i) => [
              <motion.div
                key={`step-${i}`}
                custom={i + 4}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                style={{ flexShrink: 0, scrollSnapAlign: 'center' }}
              >
                <div
                  className="liquid-glass"
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '9999px',
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: i === lifecycleSteps.length - 1 ? 500 : 400,
                    fontSize: '0.8rem',
                    color: i === lifecycleSteps.length - 1 ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.78)',
                    whiteSpace: 'nowrap',
                    borderColor: i === lifecycleSteps.length - 1 ? 'rgba(245,200,66,0.3)' : undefined,
                  }}
                >
                  {step}
                </div>
              </motion.div>,
              i < lifecycleSteps.length - 1 ? (
                <div
                  key={`sep-${i}`}
                  style={{
                    flexShrink: 0,
                    width: '1.25rem',
                    height: '1px',
                    alignSelf: 'center',
                    margin: '0 0.15rem',
                    background: 'linear-gradient(to right, transparent, rgba(245,200,66,0.4), transparent)',
                    opacity: 0.9,
                  }}
                  aria-hidden
                />
              ) : null,
            ])}
          </div>
        </motion.div>
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
