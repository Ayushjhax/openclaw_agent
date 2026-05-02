'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

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
      <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <span className="section-badge">Begin</span>
        </motion.div>

        <motion.h2
          custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
            fontSize: 'clamp(2.75rem, 7vw, 4.75rem)',
            letterSpacing: '-0.04em', lineHeight: 0.92,
            color: 'white', margin: '0 0 1.5rem',
          }}
        >
          Your next portfolio<br />starts here.
        </motion.h2>

        <motion.p
          custom={2} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            fontFamily: "'Barlow', sans-serif", fontWeight: 300,
            fontSize: 'clamp(1rem, 2vw, 1.1rem)',
            color: 'rgba(255,255,255,0.62)', lineHeight: 1.7,
            margin: '0 0 2.5rem',
          }}
        >
          Book a free discovery call and explore what multi-agentic intelligence can become.
        </motion.p>

        <motion.div
          custom={3} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <button
            className="liquid-glass-strong"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.875rem 2rem', borderRadius: '9999px',
              fontFamily: "'Barlow', sans-serif", fontWeight: 500, fontSize: '0.9rem',
              color: 'white', border: 'none', cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Book a Call <ArrowUpRight size={16} />
          </button>

          <button
            className="liquid-glass"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.875rem 2rem', borderRadius: '9999px',
              fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.8)', border: 'none', cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            View Strategy <ChevronRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
