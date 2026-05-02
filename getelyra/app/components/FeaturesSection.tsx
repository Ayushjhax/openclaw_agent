'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Eye, Sparkles, Zap, Package } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const cards = [
  {
    icon: Eye,
    iconBg: 'linear-gradient(135deg, rgba(120,180,255,0.3), rgba(80,120,220,0.15))',
    num: '01',
    title: 'Cinematic Market Vision',
    desc: 'Immersive analysis across macro, micro, and sentiment — every signal observed with intent. Our agents never miss a beat.',
  },
  {
    icon: Sparkles,
    iconBg: 'linear-gradient(135deg, rgba(255,200,100,0.3), rgba(220,140,50,0.15))',
    num: '02',
    title: 'AI-Led Alpha Generation',
    desc: 'We turn market signals, quantitative models, and macro narratives into cohesive strategies that feel unmistakably precise.',
  },
  {
    icon: Zap,
    iconBg: 'linear-gradient(135deg, rgba(180,255,180,0.3), rgba(100,200,100,0.15))',
    num: '03',
    title: 'Rapid Adaptation',
    desc: 'Explore ambitious positions quickly without losing discipline. Fast regime-detection, high-conviction execution, always.',
  },
  {
    icon: Package,
    iconBg: 'linear-gradient(135deg, rgba(255,160,200,0.3), rgba(200,100,160,0.15))',
    num: '04',
    title: 'Production-Grade Infrastructure',
    desc: 'Institutional-quality risk systems, low-latency execution, and transparency-first reporting. No black boxes.',
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      style={{ background: 'black', padding: '7rem 1.5rem 9rem', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/image4..jpg"
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none', opacity: 0.6 }}
      />

      {/* Top/bottom gradient */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, black 0%, transparent 18%, transparent 82%, black 100%)',
      }} />
      {/* Dark wash */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(0,0,0,0.30)', pointerEvents: 'none' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '56rem', margin: '0 auto', textAlign: 'center' }}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <span className="section-badge">Capabilities</span>
        </motion.div>

        <motion.h2
          custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            letterSpacing: '-0.04em', lineHeight: 0.92,
            color: 'white', margin: '0 0 3.5rem',
          }}
        >
          Built with precision<br />and performance in balance.
        </motion.h2>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          maxWidth: '48rem',
          margin: '0 auto',
          textAlign: 'left',
        }}>
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.num}
                custom={i + 2} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  borderRadius: '1.5rem', padding: '1.75rem',
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                  backdropFilter: 'blur(40px)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 20px 60px rgba(0,0,0,0.5)',
                  position: 'relative', overflow: 'hidden', cursor: 'default',
                }}
              >
                {/* Top shimmer line */}
                <div style={{
                  position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
                  background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)',
                }} />

                {/* Number */}
                <div style={{
                  position: 'absolute', top: '1.25rem', right: '1.25rem',
                  fontFamily: "'Barlow', sans-serif", fontWeight: 300,
                  fontSize: '0.8rem', color: 'rgba(255,255,255,0.20)',
                }}>
                  {card.num}
                </div>

                {/* Icon */}
                <div style={{
                  width: '2.75rem', height: '2.75rem',
                  borderRadius: '0.75rem',
                  background: card.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1rem',
                }}>
                  <Icon size={18} color="white" />
                </div>

                <div style={{
                  fontFamily: "'Barlow', sans-serif", fontWeight: 500,
                  fontSize: '0.95rem', color: 'white', marginBottom: '0.5rem',
                }}>
                  {card.title}
                </div>
                <p style={{
                  fontFamily: "'Barlow', sans-serif", fontWeight: 300,
                  fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.6, margin: 0,
                }}>
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
