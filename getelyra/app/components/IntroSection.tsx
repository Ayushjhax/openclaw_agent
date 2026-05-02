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

const partners = ['Luminary', 'Celestia', 'Vaulted', 'Prism', 'Aura', 'Nocturne'];

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
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none', opacity: 0.5 }}
      />

      {/* Top/bottom gradient */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, black 0%, transparent 18%, transparent 82%, black 100%)',
      }} />
      {/* Dark wash */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(0,0,0,0.28)', pointerEvents: 'none' }} />

      {/* Floating dust */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        <ParticleCanvas />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3, maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <span className="section-badge">Trusted by modern funds</span>
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
          Intelligence that feels like a force,{' '}
          <br />not a formula.
        </motion.h2>

        <motion.p
          custom={2} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            fontFamily: "'Barlow', sans-serif", fontWeight: 300,
            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            color: 'rgba(255,255,255,0.62)', lineHeight: 1.7,
            margin: '0 0 3rem',
          }}
        >
          We build financial intelligence that transcends the ordinary —<br />
          adaptive, precise, and unmistakably yours.
        </motion.p>

        <motion.div
          custom={3} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem' }}
        >
          {partners.map((p) => (
            <span
              key={p}
              style={{
                fontFamily: "'Barlow', sans-serif", fontWeight: 300,
                fontSize: '0.875rem', letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.42)',
              }}
            >
              {p}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
