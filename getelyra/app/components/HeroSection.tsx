'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Play } from 'lucide-react';
import SwayCanvas from './SwayCanvas';
import AtmosphereCanvas from './AtmosphereCanvas';
import ParticleCanvas from './ParticleCanvas';
import ParticleTitle from './ParticleTitle';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 0.6], [0, 45]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={sectionRef} style={{ height: '100vh', background: 'black', overflow: 'hidden', position: 'relative' }}>
      {/* Background layer */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        {/* WebGL animated meadow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <SwayCanvas />
        </motion.div>

        {/* Top gradient */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.20) 28%, transparent 52%)',
        }} />

        {/* Ambient orb 1 — Sun, warm golden */}
        <motion.div
          animate={{ x: [0, 38, -18, 30, 0], y: [0, -22, 14, -10, 0], opacity: [0.75, 1, 0.8, 1, 0.75] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-8%', right: '4%',
            width: 560, height: 560, zIndex: 1,
            background: 'radial-gradient(circle, rgba(255,215,90,0.42) 0%, rgba(255,150,30,0.14) 50%, transparent 100%)',
            filter: 'blur(60px)',
            mixBlendMode: 'screen',
          }}
        />
        {/* Ambient orb 2 — Sky, cool blue */}
        <motion.div
          animate={{ x: [0, 70, -40, 50, 0], y: [0, 18, -12, 8, 0], opacity: [0.55, 0.9, 0.6, 0.88, 0.55] }}
          transition={{ duration: 14, delay: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-6%', left: '10%',
            width: 750, height: 280, zIndex: 1,
            background: 'radial-gradient(ellipse, rgba(120,200,255,0.22) 0%, transparent 100%)',
            filter: 'blur(55px)',
            mixBlendMode: 'screen',
          }}
        />
        {/* Ambient orb 3 — Meadow, green-gold */}
        <motion.div
          animate={{ x: [-20, 30, -10, 40, -20], y: [0, -28, 10, -18, 0], opacity: [0.5, 0.88, 0.55, 0.9, 0.5] }}
          transition={{ duration: 12, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: '-12%', left: '15%',
            width: 680, height: 420, zIndex: 1,
            background: 'radial-gradient(ellipse, rgba(155,215,100,0.22) 0%, rgba(200,235,80,0.06) 60%, transparent 100%)',
            filter: 'blur(65px)',
            mixBlendMode: 'screen',
          }}
        />
        {/* Ambient orb 4 — Left warm rim */}
        <motion.div
          animate={{ x: [0, 22, -14, 18, 0], y: [0, -35, 20, -25, 0], opacity: [0.4, 0.72, 0.45, 0.68, 0.4] }}
          transition={{ duration: 16, delay: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '20%', left: '-6%',
            width: 380, height: 560, zIndex: 1,
            background: 'radial-gradient(ellipse, rgba(255,195,100,0.18) 0%, transparent 100%)',
            filter: 'blur(55px)',
            mixBlendMode: 'screen',
          }}
        />

        {/* Edge vignette */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'radial-gradient(ellipse 82% 82% at 50% 50%, transparent 32%, rgba(0,0,0,0.32) 66%, rgba(0,0,0,0.70) 100%)',
        }} />
        {/* Global legibility wash */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'rgba(0,0,0,0.32)' }} />
        {/* Dark halo behind title */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3,
          background: 'radial-gradient(ellipse 55% 35% at 50% 40%, rgba(0,0,0,0.48) 0%, transparent 75%)',
        }} />
      </div>

      {/* Atmosphere + pollen */}
      <AtmosphereCanvas />
      <ParticleCanvas />

      {/* Hero content */}
      <motion.div
        style={{
          y, opacity,
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center',
          padding: '170px 1.5rem 0',
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <div
            className="liquid-glass"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.35rem 1rem', borderRadius: '9999px', marginBottom: '2rem',
            }}
          >
            <span style={{
              background: 'white', color: 'black',
              fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: '0.7rem',
              padding: '0.15rem 0.5rem', borderRadius: '9999px',
            }}>New</span>
            <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>
              Introducing multi-agentic hedge fund intelligence.
            </span>
          </div>
        </motion.div>

        {/* Particle title */}
        <div style={{ width: '100%', maxWidth: '960px' }}>
          <ParticleTitle />
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ delay: 1.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          style={{
            fontFamily: "'Barlow', sans-serif", fontWeight: 300,
            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            color: 'rgba(255,255,255,0.72)',
            maxWidth: '36rem',
            lineHeight: 1.7,
            margin: '1.5rem auto 2.5rem',
          }}
        >
          Precision intelligence. Adaptive strategies. AI agents that read markets,
          sense shifts, and act with conviction — around the clock.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button
            className="liquid-glass-strong"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.75rem', borderRadius: '9999px',
              fontFamily: "'Barlow', sans-serif", fontWeight: 500, fontSize: '0.9rem',
              color: 'white', border: 'none', cursor: 'pointer',
            }}
          >
            Request Access <ArrowUpRight size={16} />
          </button>
          <button
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.75rem', borderRadius: '9999px',
              fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.75)',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'transparent', cursor: 'pointer',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
          >
            <Play size={14} /> Watch Overview
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '360px', zIndex: 5, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.85) 75%, black 100%)',
      }} />
    </section>
  );
}
