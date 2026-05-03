'use client';
import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
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

function FAQItem({ question, answer, defaultOpen = false }: { question: string; answer: string; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className="glass-card"
      style={{
        borderRadius: '0.875rem',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%', padding: '1.25rem 1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
          background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
          fontWeight: 400, fontSize: '1.05rem', color: 'white', lineHeight: 1.35,
        }}>
          {question}
        </span>
        <div style={{
          flexShrink: 0, width: 24, height: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg
            style={{
              width: 18, height: 18,
              transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s ease',
              color: 'rgba(255,255,255,0.5)',
            }}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" />
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" />
          </svg>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 1.5rem 1.25rem',
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
              <p style={{
                fontFamily: "'Barlow', sans-serif", fontWeight: 300,
                fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.75, margin: '1rem 0 0',
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
        padding: '7rem 1.5rem 8rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '0.5rem 1.25rem', marginBottom: '2rem',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '9999px',
            }}>
              <span style={{
                fontFamily: "'Barlow', sans-serif", fontWeight: 500,
                fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)',
                letterSpacing: '0.03em',
              }}>
                Frequently Asked Questions
              </span>
            </div>
          </motion.div>

          <motion.h2
            custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{ margin: '0 0 1.25rem' }}
          >
            <span style={{
              fontFamily: "'Space Grotesk', 'Barlow', sans-serif", fontWeight: 700,
              fontSize: 'clamp(2.75rem, 7vw, 5rem)',
              color: 'white', letterSpacing: '-0.04em', lineHeight: 0.9,
            }}>
              Command your capital{' '}
            </span>
            <span style={{
              fontFamily: "'Great Vibes', 'Instrument Serif', serif", fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(3.25rem, 8vw, 6rem)',
              color: 'white', lineHeight: 0.9,
            }}>
              Swarm
            </span>
          </motion.h2>

          <motion.p
            custom={2} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{
              fontFamily: "'Barlow', sans-serif", fontWeight: 300,
              fontSize: 'clamp(1rem, 2vw, 1.1rem)',
              color: 'rgba(255,255,255,0.5)', lineHeight: 1.75,
              maxWidth: '38rem', margin: '0 auto',
            }}
          >
            The autonomous stack for high-frequency financial sovereignty — learn how{' '}
            <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 400 }}>Elyra</span>{' '}
            makes trading smooth, smart, and seriously powerful.
          </motion.p>
        </div>

        {/* FAQ accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              custom={i + 3} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            >
              <FAQItem question={faq.q} answer={faq.a} defaultOpen={i === 0} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
