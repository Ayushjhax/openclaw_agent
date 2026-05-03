'use client';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer style={{
      background: 'black',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '3rem 1.5rem',
      textAlign: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Image src="/logo.png" alt="Elyra" width={22} height={22} style={{ borderRadius: '6px', objectFit: 'contain' }} />
        <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: '1.1rem', color: 'white' }}>
          Elyra
        </span>
      </div>
      <p style={{
        fontFamily: "'Barlow', sans-serif", fontWeight: 300,
        fontSize: '0.85rem', color: 'rgba(255,255,255,0.38)',
        margin: '0 0 0.5rem',
      }}>
        Multi-agentic intelligence for the extraordinary.
      </p>
      <p style={{
        fontFamily: "'Barlow', sans-serif", fontWeight: 300,
        fontSize: '0.75rem', color: 'rgba(255,255,255,0.22)',
        margin: 0,
      }}>
        © 2025 Elyra. All rights reserved.
      </p>
    </footer>
  );
}
