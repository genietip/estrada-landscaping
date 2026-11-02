import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';

const EASE = [0.22, 1, 0.36, 1] as const;
const SERVICES = ['LAWN + GARDEN', 'PATIOS + STONE', 'CLEANUPS'];

export function Scene02() {
  const [serviceIndex, setServiceIndex] = useState(0);
  const [handoff, setHandoff] = useState(false);
  useSceneTimer([
    { time: 1650, callback: () => setServiceIndex(1) },
    { time: 2700, callback: () => setServiceIndex(2) },
    { time: 4100, callback: () => setHandoff(true) },
  ]);
  return (
    <motion.section
      className="film-stage"
      initial={{ clipPath: 'circle(7% at 86% 79%)', scale: 1.08 }}
      animate={{ clipPath: 'circle(150% at 86% 79%)', scale: 1 }}
      exit={{ scale: 1.08, opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)', transition: { duration: .46, ease: EASE } }}
      transition={{ duration: .7, ease: EASE }}
      style={{ background: '#e5e6d8', color: '#294b37' }}
    >
      <motion.div
        initial={{ scale: 1.12, y: '-2%' }} animate={{ scale: 1, x: '-1%', y: '2%' }}
        transition={{ duration: 4.8, ease: 'linear' }}
        style={{ position: 'absolute', left: 0, top: 0, width: '43%', height: '100%', overflow: 'hidden' }}
      >
        <img className="scene-photo" src={`${import.meta.env.BASE_URL}images/garden-detail.jpg`} alt="" />
        <div style={{ position: 'absolute', inset: '48% 0 0', background: 'linear-gradient(transparent,rgba(25,46,33,.65))' }} />
        <motion.div
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: .5, duration: .65, ease: EASE }}
          style={{ position: 'absolute', left: '12%', bottom: '12%', width: '64%', height: 2, background: '#d18b60', transformOrigin: 'left' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: .35 }}
          className="film-micro" style={{ position: 'absolute', left: '12%', bottom: '7%', color: '#f2eee2' }}
        >
          The small details matter
        </motion.div>
      </motion.div>
      <div style={{ position: 'absolute', left: '51%', top: '13%', width: '42%', zIndex: 2 }}>
        <motion.div
          className="film-kicker"
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .22, duration: .48, ease: EASE }}
          style={{ color: '#77836b', marginBottom: '2.2vmin' }}
        >
          Thoughtful, practical care
        </motion.div>
        <motion.div
          className="film-serif"
          initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: .36, duration: .58, ease: EASE }}
          style={{ fontSize: '8.2vmin', lineHeight: .9 }}
        >
          Every detail
        </motion.div>
        <motion.div
          className="film-serif"
          initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: .58, duration: .58, ease: EASE }}
          style={{ color: '#738267', fontSize: '8.2vmin', lineHeight: .94, fontStyle: 'italic' }}
        >
          in its place.
        </motion.div>
        <div style={{ position: 'relative', height: '22vmin', marginTop: '4vmin', borderTop: '1px solid rgba(41,75,55,.22)' }}>
          <AnimatePresence mode="sync">
            <motion.div
              key={serviceIndex}
              initial={{ opacity: 0, y: 27, skewY: 3 }}
              animate={{ opacity: 1, y: 0, skewY: 0 }}
              exit={{ opacity: 0, y: -24, skewY: -3, transition: { duration: .18 } }}
              transition={{ duration: .38, ease: EASE }}
              className="film-serif"
              style={{ position: 'absolute', inset: '2.3vmin auto auto 0', fontSize: '5.4vmin', lineHeight: 1, letterSpacing: '-.035em', whiteSpace: 'nowrap' }}
            >
              {SERVICES[serviceIndex]}
            </motion.div>
          </AnimatePresence>
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: .9, duration: .5, ease: EASE }}
            style={{ height: '1.2vmin', width: '70%', position: 'absolute', left: 0, bottom: '2vmin', background: '#cf8a5c', transformOrigin: 'left', opacity: .76 }}
          />
          <motion.span
            className="film-micro"
            initial={{ opacity: 0 }} animate={{ opacity: .7 }}
            transition={{ delay: 1.2, duration: .3 }}
            style={{ position: 'absolute', left: 0, bottom: '-2vmin', color: '#71806d' }}
          >
            {String(serviceIndex + 1).padStart(2, '0')} / 03
          </motion.span>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: .7 }} transition={{ delay: .3 }}
        className="film-micro" style={{ position: 'absolute', right: '7%', top: '8%', color: '#637365' }}
      >
        Estrada Landscaping · 02
      </motion.div>
      <span style={{ position: 'absolute', left: '46%', top: '7%', height: '86%', width: 1, background: 'rgba(41,75,55,.2)' }} />
      <span style={{ position: 'absolute', right: '7%', bottom: '5%', fontSize: '1.15vmin', color: '#71806d' }}>Illustrative landscape imagery</span>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={handoff ? { scale: 90, opacity: [0, 0, 1, 1] } : { scale: 0, opacity: 0 }}
        transition={{ duration: .78, ease: EASE, times: [0, .18, .5, 1] }}
        style={{
          position: 'absolute', zIndex: 5, right: '11%', bottom: '26%', width: '2.4vmin', height: '2.4vmin',
          borderRadius: '50%', background: '#cf8a5c', transformOrigin: 'center', pointerEvents: 'none',
        }}
      />
    </motion.section>
  );
}
