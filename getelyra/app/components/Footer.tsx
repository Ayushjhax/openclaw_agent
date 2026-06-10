'use client';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer style={{
      background: 'black',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top gradient border */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.12) 70%, transparent 100%)',
      }} />

      {/* Ambient glow */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', left: '50%', top: '-20%',
          transform: 'translateX(-50%)',
          width: '60vw', height: '40vw', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.018) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '64rem', margin: '0 auto', padding: '3.5rem 1.5rem 0' }}>

        {/* Main row */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '2rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Image
                src="/logo.png" alt="Elyra"
                width={20} height={20}
                style={{ borderRadius: '5px', objectFit: 'contain' }}
              />
              <span style={{
                fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
                fontSize: '1.1rem', color: 'white',
              }}>
                Elyra
              </span>
            </div>
            <p style={{
              fontFamily: "'Barlow', sans-serif", fontWeight: 300,
              fontSize: '0.82rem', color: 'rgba(255,255,255,0.32)',
              margin: 0, maxWidth: '18rem', lineHeight: 1.6,
            }}>
              Multi-agentic intelligence for the extraordinary.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '0.75rem',
          padding: '1.25rem 0 2rem',
        }}>
          <p style={{
            fontFamily: "'Barlow', sans-serif", fontWeight: 300,
            fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)',
            margin: 0, letterSpacing: '0.02em',
          }}>
            © 2025 Elyra. All rights reserved.
          </p>
          <p style={{
            fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
            fontSize: '0.78rem', color: 'rgba(255,255,255,0.16)',
            margin: 0,
          }}>
            Built for the extraordinary.
          </p>
        </div>
      </div>
    </footer>
  );
}
