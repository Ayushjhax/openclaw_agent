'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      style={{ background: 'black', padding: '7rem 1.5rem 10rem' }}
    >
      <div style={{ maxWidth: '52rem', margin: '0 auto', textAlign: 'center' }}>
        {/* Badge */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <span className="section-badge">Begin</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ margin: '0 0 1.5rem' }}
        >
          <span style={{
            fontFamily: "'Space Grotesk', 'Barlow', sans-serif", fontWeight: 700,
            fontSize: 'clamp(2.75rem, 7vw, 5rem)',
            color: 'white', letterSpacing: '-0.04em', lineHeight: 0.9,
            display: 'block',
          }}>
            Ready for agentic{' '}
          </span>
          <span style={{
            fontFamily: "'Great Vibes', 'Instrument Serif', serif", fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(3.25rem, 8vw, 6rem)',
            color: 'white', lineHeight: 0.95,
          }}>
            precision?
          </span>
        </motion.h2>

        {/* Description */}
        <motion.div
          custom={2} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ marginBottom: '2.5rem' }}
        >
          <p style={{
            fontFamily: "'Barlow', sans-serif", fontWeight: 300,
            fontSize: 'clamp(1rem, 2vw, 1.1rem)',
            color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, margin: '0 0 0.5rem',
          }}>
            We&apos;re opening early access to a small group of testers.
          </p>
          <p style={{
            fontFamily: "'Barlow', sans-serif", fontWeight: 400,
            fontSize: 'clamp(1rem, 2vw, 1.1rem)',
            color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, margin: 0,
          }}>
            Experience how <span style={{ color: 'white', fontWeight: 500 }}>Elyra</span>&apos;s AI-powered intelligence transforms every hedge.
          </p>
        </motion.div>

        {/* Article button */}
        <motion.div
          custom={3} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ marginBottom: '1.5rem' }}
        >
          <a
            href="https://medium.com/@ayushkmrjha/how-personal-ai-trading-agents-will-shatter-human-limits-and-redefine-alpha-in-the-agentic-economy-da49d8a22929"
            target="_blank"
            rel="noopener noreferrer"
            className="waitlist-hardware"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.875rem 2rem', borderRadius: '9999px',
              fontFamily: "'Barlow', sans-serif", fontWeight: 500, fontSize: '0.95rem',
              color: 'white', textDecoration: 'none',
            }}
          >
            <span>Read the latest Article</span>
            <ArrowRight size={16} style={{ transition: 'transform 0.2s' }} />
          </a>
        </motion.div>

        <motion.p
          custom={4} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            fontFamily: "'Barlow', sans-serif", fontWeight: 300,
            fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)',
            margin: 0,
          }}
        >
          Get early access and future perks.
        </motion.p>
      </div>
    </section>
  );
}
