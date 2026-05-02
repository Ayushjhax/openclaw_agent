'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      style={{
        position: 'fixed',
        top: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        width: 'calc(100% - 2rem)',
        maxWidth: '56rem',
      }}
    >
      <div
        className="liquid-glass"
        style={{
          borderRadius: '9999px',
          height: '3.5rem',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.25rem',
          gap: '1.5rem',
          boxShadow: scrolled
            ? '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.10)'
            : 'inset 0 1px 1px rgba(255,255,255,0.10)',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <Image src="/logo.png" alt="Elyra" width={28} height={28} style={{ borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: '1.1rem', color: 'white' }}>
            Elyra
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, justifyContent: 'center' }}>
          {['Strategies', 'Performance', 'Process', 'Investors'].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 400,
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.75)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            background: 'white',
            color: 'black',
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 500,
            fontSize: '0.8rem',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Get Started <ArrowUpRight size={14} />
        </button>
      </div>
    </motion.nav>
  );
}
