'use client';
import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.72, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const faqs = [
  {
    q: "What defines Elyra as an 'Agentic Sovereign Fund' vs. a traditional quant fund?",
    a: 'Traditional funds rely on human analysts to interpret data and "bots" to execute static code. Elyra replaces the human bottleneck with Autonomous Capital Swarms. Our agents perform research, monitor systemic risk in shadow banking, and self-correct their strategies in real-time within Trusted Execution Environments (TEEs). It is a "One-Person Civilization" stack where the AI is the researcher, the trader, and the risk manager.',
  },
  {
    q: 'What is "The Great Extraction," and how does Elyra solve it?',
    a: 'The current financial system systematically moves wealth from wage earners to asset owners through an opaque, $1.7T+ shadow banking blackbox. Elyra weaponizes transparency. By using our Shadow Map Agent to scrape SEC filings and reconstruct hidden debt graphs, we turn institutional opacity into a retail Alpha signal, allowing the public to front-run the insolvency of legacy financial engineering.',
  },
  {
    q: 'Why is the Elyra stack built on Solana?',
    a: 'Speed and capital formation. To compete with HFT firms, we need sub-second finality and minimal fees. Solana allows Elyra to initiate Dutch Auctions and Capital Swarms instantly, enabling a network of individuals to aggregate capital and move with the agility of a single institutional entity.',
  },
  {
    q: 'How does the "Open Claw" Intelligence Stack work?',
    a: 'Open Claw is our vertically integrated research layer. While legacy funds pay $50,000/year for data that is already months old, Open Claw agents scrape real-time event streams from DeFi liquidations to SEC EDGAR filings to create a "True Default Rate" oracle. This intelligence is then fed directly into our trading agents across Hyperliquid, Drift, and Jupiter.',
  },
  {
    q: 'How do you ensure the security of autonomous agents handling capital?',
    a: "We utilize TEEs (Trusted Execution Environments). The agent's logic and private keys are housed in encrypted, hardware-level containers. Even the developers cannot intervene or alter the strategy once it is live. This creates a trustless environment where the agent's sovereignty is mathematically guaranteed.",
  },
  {
    q: 'Is Elyra a trading bot or a software infrastructure?',
    a: 'It is a complete vertical stack. Most bots are tools that require constant human supervision. Elyra provides the eight core operational domains — from risk controls and post-trade ledgers to research pipelines — needed to run a hedge fund autonomously. We are not building a better tool; we are building an autonomous replacement for the firm itself.',
  },
  {
    q: "What is the 'Return Equation' used by the agents?",
    a: 'Our agents optimize for Net Value Realization. We define performance through a rigorous derivative formula:\n\nTotal Return = Σ (Win Rate × Profit − Loss Rate × Loss) × Frequency\n\nBy removing human emotional volatility and execution gaps, we maximize the Frequency and Win Rate components that typically degrade in biological traders during 24/7 market cycles.',
  },
];

function FAQItem({ question, answer, index, defaultOpen = false }: {
  question: string; answer: string; index: number; defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const num = String(index + 1).padStart(2, '0');

  return (
    <div
      style={{
        position: 'relative',
        background: isOpen ? 'rgba(255,255,255,0.038)' : 'transparent',
        backdropFilter: isOpen ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: isOpen ? 'blur(20px)' : 'none',
        borderRadius: '0.875rem',
        border: isOpen ? '1px solid rgba(255,255,255,0.11)' : '1px solid transparent',
        transition: 'background 0.35s ease, border-color 0.35s ease',
        overflow: 'hidden',
      }}
    >
      {/* shimmer line when open */}
      <div style={{
        position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 0.35s ease',
        pointerEvents: 'none',
      }} />

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '2rem 1fr 2rem',
          alignItems: 'flex-start',
          gap: '1rem',
          padding: '1.375rem 1.375rem',
          background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
          fontSize: '0.6rem', letterSpacing: '0.08em',
          color: isOpen ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)',
          paddingTop: '0.2rem',
          transition: 'color 0.3s',
        }}>
          {num}
        </span>

        <span style={{
          fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
          fontSize: 'clamp(0.975rem, 2vw, 1.08rem)',
          color: isOpen ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.75)',
          lineHeight: 1.4,
          transition: 'color 0.3s',
        }}>
          {question}
        </span>

        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isOpen ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          transition: 'background 0.3s',
          marginTop: '0.1rem',
          justifySelf: 'end',
        }}>
          <svg
            style={{
              width: 11, height: 11,
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.32s cubic-bezier(0.16,1,0.3,1)',
              color: isOpen ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
            }}
            fill="none" stroke="currentColor" strokeWidth={2.5}
            strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2rem 1fr 2rem',
              gap: '1rem',
              padding: '0 1.375rem 1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div />
              <p style={{
                fontFamily: "'Barlow', sans-serif", fontWeight: 300,
                fontSize: 'clamp(0.86rem, 1.8vw, 0.94rem)',
                color: 'rgba(255,255,255,0.48)',
                lineHeight: 1.82, margin: '1rem 0 0',
                whiteSpace: 'pre-line',
              }}>
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      style={{
        background: 'black',
        padding: '9rem 1.5rem 11rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient orbs */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', left: '-12%', top: '15%',
          width: '50vw', height: '50vw', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(245,200,66,0.038) 0%, transparent 68%)',
          filter: 'blur(50px)',
        }} />
        <div style={{
          position: 'absolute', right: '-10%', bottom: '10%',
          width: '42vw', height: '42vw', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(120,160,255,0.032) 0%, transparent 68%)',
          filter: 'blur(50px)',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '52rem', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '5.5rem' }}>
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{ marginBottom: '1.75rem' }}>
            <span className="section-badge">Frequently Asked Questions</span>
          </motion.div>

          <motion.div custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
            <h2 style={{ margin: '0', lineHeight: 1 }}>
              <span style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                fontSize: 'clamp(2.5rem, 6.5vw, 4.75rem)',
                color: 'white', letterSpacing: '-0.04em', lineHeight: 0.92,
              }}>
                Command your capital
              </span>
              <span style={{
                display: 'block',
                fontFamily: "'Great Vibes', serif",
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                color: 'white', lineHeight: 1.05,
              }}>
                Swarm
              </span>
            </h2>
          </motion.div>

          <motion.div custom={2} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{ margin: '1.75rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem' }}>
            <div style={{ width: '2.5rem', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18))' }} />
            <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.22)' }} />
            <div style={{ width: '2.5rem', height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.18), transparent)' }} />
          </motion.div>

          <motion.p custom={3} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{
              fontFamily: "'Barlow', sans-serif", fontWeight: 300,
              fontSize: 'clamp(0.925rem, 2vw, 1.025rem)',
              color: 'rgba(255,255,255,0.42)', lineHeight: 1.82,
              maxWidth: '34rem', margin: '0 auto',
            }}>
            The autonomous stack for high-frequency financial sovereignty — learn how{' '}
            <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 400 }}>Elyra</span>{' '}
            makes trading smooth, smart, and seriously powerful.
          </motion.p>
        </div>

        {/* Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {faqs.map((faq, i) => (
            <motion.div key={i} custom={i + 4} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
              <FAQItem question={faq.q} answer={faq.a} index={i} defaultOpen={i === 0} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
