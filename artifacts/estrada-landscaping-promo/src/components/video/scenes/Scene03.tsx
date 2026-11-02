import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';

const EASE = [0.22, 1, 0.36, 1] as const;
const PROOFS = [
  { n: '01', text: 'Licensed & insured' },
  { n: '02', text: 'Free estimates within 30 miles of Coatesville' },
];

export function Scene03() {
  const [proofIndex, setProofIndex] = useState(-1);
  const [handoff, setHandoff] = useState(false);
  useSceneTimer([
    { time: 2850, callback: () => setProofIndex(0) },
    { time: 4450, callback: () => setProofIndex(1) },
    { time: 6250, callback: () => setHandoff(true) },
  ]);
  return (
    <motion.section
      className="film-stage film-grain"
      initial={{ clipPath: 'circle(5% at 87% 72%)', scale: 1.05 }}
      animate={{ clipPath: 'circle(150% at 87% 72%)', scale: 1 }}
      exit={{ scale: 1.14, opacity: 0, clipPath: 'circle(9% at 54% 48%)', transition: { duration: .58, ease: EASE } }}
      transition={{ duration: .62, ease: EASE }}
      style={{ background: '#294b37', color: '#f5f2e8' }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg,#294b37 0%,#294b37 34%,#375c43 100%)' }} />
      <motion.div
        initial={{ scale: .55, rotate: -7 }} animate={handoff ? { scale: 2.35, rotate: 0 } : { scale: [1.12, .94, 1], rotate: 0 }}
        transition={handoff ? { duration: 1.18, ease: EASE } : { duration: 1.35, ease: EASE }}
        style={{
          position: 'absolute', top: '8%', right: '7%', width: '73vmin', height: '73vmin',
          borderRadius: '50%', overflow: 'hidden', border: '1.15vmin solid #d18b60',
          boxShadow: '0 0 0 1.7vmin rgba(245,242,232,.12), 0 2vmin 8vmin rgba(16,31,22,.24)',
        }}
      >
        <motion.img
          src={`${import.meta.env.BASE_URL}images/patio-yard.jpg`} alt=""
          initial={{ scale: 1.16 }} animate={{ scale: [1.16, 1.04, 1.01] }}
          transition={{ duration: 6.8, ease: 'linear' }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg,rgba(30,57,43,.16),transparent 68%)' }} />
      </motion.div>
      <div style={{ position: 'absolute', zIndex: 3, left: '7.2%', top: '16%', width: '41%' }}>
        <motion.div
          className="film-kicker"
          initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: .18, duration: .42, ease: EASE }}
          style={{ color: '#d18b60', marginBottom: '3vmin' }}
        >
          Rooted in Coatesville
        </motion.div>
        <motion.div
          className="film-serif"
          initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: .35, duration: .62, ease: EASE }}
          style={{ fontSize: '9.6vmin', lineHeight: .86 }}
        >
          Good work,
        </motion.div>
        <motion.div
          className="film-serif"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: .66, duration: .62, ease: EASE }}
          style={{ color: '#c8d2bd', fontSize: '8vmin', lineHeight: .92, fontStyle: 'italic' }}
        >
          close to home.
        </motion.div>
        <div style={{ position: 'relative', marginTop: '5vmin', minHeight: '12vmin' }}>
          <AnimatePresence mode="sync">
            {proofIndex >= 0 && (
              <motion.div
                key={proofIndex}
                initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16, transition: { duration: .18 } }}
                transition={{ duration: .42, ease: EASE }}
                style={{ position: 'absolute', left: 0, right: 0, top: 0, display: 'flex', alignItems: 'center', gap: '1.8vmin' }}
              >
                <span className="film-micro" style={{ color: '#d18b60' }}>{PROOFS[proofIndex].n}</span>
                <span style={{ height: 1, width: '4vmin', background: 'rgba(245,242,232,.55)' }} />
                <span style={{ fontSize: '2.25vmin', lineHeight: 1.25, maxWidth: '32vmin', color: 'rgba(245,242,232,.9)' }}>{PROOFS[proofIndex].text}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <motion.div
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: .84 }}
        transition={{ delay: 1.7, duration: 1.05, ease: EASE }}
        style={{ position: 'absolute', zIndex: 3, right: '11.7%', top: '10.6%', width: '70vmin', height: '70vmin', pointerEvents: 'none' }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
          <motion.circle cx="50" cy="50" r="48.2" fill="none" stroke="#f0eadd" strokeWidth=".35" strokeDasharray="1 2.8" pathLength={1} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.4, duration: .85 }} />
          {[0, 1, 2].map((i) => <motion.line key={i} x1="50" y1="0" x2="50" y2="5" stroke="#f0eadd" strokeWidth=".65" transform={`rotate(${i * 32 - 30} 50 50)`} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 3.75 + i * .16, duration: .28 }} />)}
        </svg>
      </motion.div>
      <span className="film-micro" style={{ position: 'absolute', left: '7.2%', bottom: '7%', color: 'rgba(245,242,232,.66)' }}>Illustrative landscape imagery</span>
      <span className="film-micro" style={{ position: 'absolute', right: '7%', top: '7%', color: 'rgba(245,242,232,.68)' }}>Estrada Landscaping · 03</span>
    </motion.section>
  );
}
