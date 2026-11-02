import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSceneTimer } from '@/lib/video';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Scene01() {
  const [handoff, setHandoff] = useState(false);
  useSceneTimer([{ time: 4200, callback: () => setHandoff(true) }]);
  return (
    <motion.section
      className="film-stage film-grain"
      initial={{ clipPath: 'inset(0 0 0 0 round 0%)', scale: 1.04 }}
      animate={{ clipPath: 'inset(0 0 0 0 round 0%)', scale: 1 }}
      exit={{ scale: 1.12, opacity: 0, clipPath: 'circle(6% at 86% 79%)', transition: { duration: .52, ease: EASE } }}
      transition={{ duration: .9, ease: EASE }}
      style={{ background: '#294b37', color: '#f5f2e8' }}
    >
      <motion.img
        className="scene-photo"
        src={`${import.meta.env.BASE_URL}images/neighborhood-garden.jpg`}
        alt=""
        initial={{ scale: 1.13, x: '-1.5%' }}
        animate={{ scale: [1.13, 1.04, 1.01], x: ['-1.5%', '0%', '1%'] }}
        transition={{ duration: 5, ease: 'linear' }}
      />
      <div className="scene-photo-grain" />
      <div style={{ position: 'absolute', zIndex: 2, left: '7.2%', top: '15%', width: '46%' }}>
        <motion.div
          className="film-kicker"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .52, delay: .16, ease: EASE }}
          style={{ color: '#dfb18b', marginBottom: '3.5vmin' }}
        >
          Your neighborhood landscape crew
        </motion.div>
        <motion.h1
          className="film-serif"
          initial={{ opacity: 0, y: 18, clipPath: 'inset(0 0 100% 0)' }}
          animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: .68, delay: .35, ease: EASE }}
          style={{ fontSize: '10vmin', lineHeight: .88, color: '#f5f2e8', margin: 0 }}
        >
          A little more
        </motion.h1>
        <motion.div
          className="film-serif"
          initial={{ opacity: 0, x: -14, skewX: -5 }}
          animate={{ opacity: 1, x: 0, skewX: 0 }}
          transition={{ duration: .65, delay: .78, ease: EASE }}
          style={{ color: '#c6d0b9', fontSize: '12.5vmin', lineHeight: .92, fontStyle: 'italic', marginLeft: '-.3vmin' }}
        >
          life outside.
        </motion.div>
        <motion.div
          className="film-rule"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: .6, delay: 1.35, ease: EASE }}
          style={{ width: '45%', margin: '3vmin 0 2vmin', color: '#d18b60' }}
        />
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .45, delay: 1.55, ease: EASE }}
          style={{ fontSize: '2.25vmin', lineHeight: 1.45, color: 'rgba(245,242,232,.85)', margin: 0, maxWidth: '34vmin' }}
        >
          Thoughtful lawn and garden care, right here in Coatesville.
        </motion.p>
      </div>
      <motion.div
        initial={{ scale: .35, rotate: -12, opacity: 0 }}
        animate={handoff ? { scale: [1, 14, 0], rotate: 8, opacity: [1, 1, 0] } : { scale: [.35, 1.12, 1], rotate: [-12, 3, 8], opacity: 1 }}
        transition={handoff ? { duration: .76, ease: EASE, times: [0, .58, 1] } : { duration: .72, delay: 2.18, ease: EASE }}
        style={{
          position: 'absolute', zIndex: 3, right: '9%', bottom: '11%', width: '17vmin', height: '17vmin',
          borderRadius: '50%', background: '#cf8a5c', color: '#213b2c', display: 'grid', placeContent: 'center',
          textAlign: 'center', transformOrigin: 'center', boxShadow: '0 1.4vmin 4vmin rgba(18,35,25,.24)',
        }}
      >
        <span className="film-serif" style={{ fontSize: '3.8vmin', lineHeight: .9, textTransform: 'uppercase' }}>Local</span>
        <span className="film-micro" style={{ fontSize: '1.05vmin', marginTop: '.9vmin' }}>Roots</span>
        <span className="film-micro" style={{ fontSize: '.82vmin', marginTop: '.55vmin', letterSpacing: '.12em' }}>Coatesville, PA</span>
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }} animate={{ opacity: .75 }} transition={{ delay: 2.6, duration: .4 }}
        className="film-micro"
        style={{ position: 'absolute', zIndex: 3, right: '7.2%', top: '8%', color: 'rgba(245,242,232,.82)' }}
      >
        Estrada Landscaping · 01
      </motion.span>
      <motion.span
        initial={{ opacity: 0 }} animate={{ opacity: .68 }} transition={{ delay: 3.2, duration: .4 }}
        style={{ position: 'absolute', zIndex: 3, left: '7.2%', bottom: '7%', fontSize: '1.25vmin', letterSpacing: '.06em', color: '#f5f2e8' }}
      >
        Illustrative landscape imagery
      </motion.span>
    </motion.section>
  );
}
