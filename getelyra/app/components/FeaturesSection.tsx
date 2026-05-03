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

const lifecycleSteps = [
  { num: '01', title: 'Set the goal' },
  { num: '02', title: '24/7 Monitoring' },
  { num: '03', title: 'Condition Triggered' },
  { num: '04', title: 'Elyra HIL Reviews' },
  { num: '05', title: 'Strategy Selected' },
  { num: '06', title: 'Trade Goes Live On-chain' },
  { num: '07', title: 'TP/SL Active' },
  { num: '08', title: 'Alert Delivered' },
  { num: '09', title: 'Capital Starts working while you sleep' },
];

const differentiators = [
  { label: 'Agentic natural language interface', aside: 'not button menus' },
  { label: 'Full perpetuals via Jupiter & HyperLiquid', aside: 'not just spot swaps' },
  { label: 'Prediction markets via Polymarket', aside: 'real-world probability signals' },
  { label: 'Built-in TA, macro intelligence, whale tracking', aside: 'signal convergence' },
  { label: 'Intent-based AI-routed execution', aside: 'not rule-based sniping' },
  { label: 'Privy HSM key custody', aside: 'not embedded wallet' },
  { label: 'DSEA strategy automation loop', aside: 'autonomous lifecycle' },
  { label: 'Human-in-the-Loop on every trade', aside: 'you stay in control' },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      style={{ background: 'black', padding: '7rem 1.5rem 9rem', position: 'relative', overflow: 'hidden' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/image4..jpg"
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none', opacity: 0.55 }}
      />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, black 0%, transparent 18%, transparent 82%, black 100%)',
      }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(0,0,0,0.28)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '60rem', margin: '0 auto', textAlign: 'center' }}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <span className="section-badge">Capabilities</span>
        </motion.div>

        <motion.h2
          custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            letterSpacing: '-0.04em', lineHeight: 0.92,
            color: 'white', margin: '0 0 2.5rem',
          }}
        >
          Built with precision<br />and performance in balance.
        </motion.h2>

        <motion.p
          custom={2} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            fontFamily: "'Barlow', sans-serif", fontWeight: 300,
            fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '36rem', margin: '0 auto 2.5rem', lineHeight: 1.65,
          }}
        >
          From intent to on-chain execution — every stage of the Elyra lifecycle, in order.
        </motion.p>

        {/* Numbered lifecycle grid — no icon glyphs */}
        <div
          className="caps-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            textAlign: 'left',
          }}
        >
          {lifecycleSteps.map((step, i) => (
            <motion.div
              key={step.num}
              custom={i + 3} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 320, damping: 22 } }}
              className="glass-card"
              style={{ borderRadius: '1.25rem', padding: '1.35rem 1.35rem 1.35rem 1.25rem', cursor: 'default' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  minHeight: '2.75rem',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 500,
                    fontSize: '0.72rem',
                    letterSpacing: '0.14em',
                    color: 'rgba(255,255,255,0.28)',
                    fontVariantNumeric: 'tabular-nums',
                    width: '1.75rem',
                    flexShrink: 0,
                    lineHeight: 1,
                    paddingTop: '0.12em',
                  }}
                >
                  {step.num}
                </span>
                <div
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: 'italic',
                    fontSize: 'clamp(0.95rem, 1.35vw, 1.08rem)',
                    color: i === lifecycleSteps.length - 1 ? 'rgba(255,250,235,0.96)' : 'rgba(255,255,255,0.9)',
                    lineHeight: 1.25,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {step.title}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Where Elyra differs */}
        <motion.div
          custom={13} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ marginTop: '5rem', textAlign: 'left' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="section-badge">Where Elyra differs</span>
          </div>

          <div
            className="diff-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 0,
            }}
          >
            {differentiators.map((d, i) => (
              <motion.div
                key={d.label}
                custom={i + 14} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                style={{
                  padding: '0.875rem 1.25rem',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.35rem 0.5rem' }}>
                  <span style={{
                    fontFamily: "'Barlow', sans-serif", fontWeight: 500,
                    fontSize: '0.88rem', color: 'rgba(255,255,255,0.88)',
                  }}>
                    {d.label}
                  </span>
                  <span style={{
                    fontFamily: "'Barlow', sans-serif", fontWeight: 300,
                    fontSize: '0.82rem', color: 'rgba(255,255,255,0.38)',
                  }}>
                    ({d.aside})
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            custom={23} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="glass-card"
            style={{
              marginTop: '1.5rem', borderRadius: '0.875rem',
              padding: '1rem 1.5rem',
              display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
              borderColor: 'rgba(245,200,66,0.15)',
            }}
          >
            <span style={{
              fontFamily: "'Barlow', sans-serif", fontWeight: 600,
              fontSize: '0.65rem', letterSpacing: '0.1em',
              color: 'rgba(245,200,66,0.8)',
              marginTop: '0.15rem', flexShrink: 0,
              textTransform: 'uppercase',
            }}>Disclosure</span>
            <p style={{
              fontFamily: "'Barlow', sans-serif", fontWeight: 300,
              fontSize: '0.82rem', color: 'rgba(255,255,255,0.48)',
              lineHeight: 1.6, margin: 0,
            }}>
              Less than 5% of portfolio exposure is allocated to fully autonomous AI agents.
              All significant positions require explicit human confirmation before execution.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .caps-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .caps-grid { grid-template-columns: 1fr !important; }
          .diff-grid { grid-template-columns: 1fr !important; }
          .diff-grid > div { border-right: none !important; }
        }
      `}</style>
    </section>
  );
}
