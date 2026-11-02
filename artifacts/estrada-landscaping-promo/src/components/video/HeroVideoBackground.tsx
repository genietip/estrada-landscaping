import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const FRAMES = [
  'neighborhood-garden.jpg',
  'garden-detail.jpg',
  'patio-yard.jpg',
];

export default function HeroVideoBackground() {
  const [activeFrame, setActiveFrame] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveFrame((current) => (current + 1) % FRAMES.length);
    }, 6200);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#213d2c',
      }}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.img
          key={activeFrame}
          src={`${import.meta.env.BASE_URL}images/${FRAMES[activeFrame]}`}
          alt=""
          initial={reducedMotion ? false : { opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.01 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: reducedMotion ? 0.01 : 1.15, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </AnimatePresence>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(23,47,34,.38), rgba(23,47,34,.04) 70%), linear-gradient(0deg, rgba(20,38,29,.22), transparent 52%)',
        }}
      />
    </div>
  );
}
