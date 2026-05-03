'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const NAV_LINKS = [
  { label: 'Documentation', href: 'https://docs.getelyra.xyz/' },
  { label: 'Twitter', href: 'https://x.com/getelyra' },
  {
    label: 'White Paper',
    href: 'https://docs.google.com/document/d/10vgg3cK0_kyERzIFd9kajhBCMFrH5nRkD8tFJpXahtQ/edit?usp=sharing',
  },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      /* x: '-50%' keeps the pill centered — inline transform is overwritten by Motion's translateY */
      initial={{ x: '-50%', y: -18, opacity: 0 }}
      animate={{ x: '-50%', y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      style={{
        position: 'fixed',
        top: '1.25rem',
        left: '50%',
        zIndex: 50,
        width: 'max-content',
        maxWidth: 'calc(100vw - 2rem)',
      }}
    >
      <div
        className="liquid-glass elyra-nav-pill"
        style={{
          borderRadius: '9999px',
          height: '3.25rem',
          display: 'grid',
          /* Equal-width outer columns keep links optically centred */
          gridTemplateColumns: '9rem auto 9rem',
          alignItems: 'center',
          padding: '0 1rem',
          gap: '0.5rem',
          boxShadow: scrolled
            ? '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.10)'
            : 'inset 0 1px 1px rgba(255,255,255,0.10)',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        {/* Column 1: Logo (left-aligned) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Image src="/logo.png" alt="Elyra" width={26} height={26} priority style={{ borderRadius: '6px', objectFit: 'contain' }} />
          <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: '1.05rem', color: 'white', whiteSpace: 'nowrap' }}>
            Elyra
          </span>
        </div>

        {/* Column 2: Nav links (centred) */}
        <div className="elyra-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', justifyContent: 'center' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 400,
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.72)',
                textDecoration: 'none',
                transition: 'color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.72)')}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Column 3: CTA (right-aligned) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <a
            href="https://try.getelyra.xyz"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '9999px',
              background: 'white',
              color: 'black',
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 500,
              fontSize: '0.78rem',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'opacity 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Get Started <ArrowUpRight size={13} />
          </a>
        </div>
      </div>

      {/* Hide links on very small screens */}
      <style>{`
        @media (max-width: 600px) {
          .elyra-nav-pill { grid-template-columns: auto auto !important; }
          .elyra-nav-links { display: none !important; }
        }
      `}</style>
    </motion.nav>
  );
}
