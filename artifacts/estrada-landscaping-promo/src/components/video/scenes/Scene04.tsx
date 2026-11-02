import { motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';
import { useState } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Scene04() {
  const [loopPunch, setLoopPunch] = useState(false);
  useSceneTimer([{ time: 5750, callback: () => setLoopPunch(true) }]);
  return (
    <motion.section
      className="film-stage"
      initial={{ clipPath: 'circle(130% at 54% 48%)', scale: 1.04 }}
      animate={{ clipPath: 'circle(150% at 54% 48%)', scale: 1 }}
      exit={{ scale: 1.06, opacity: 0, clipPath: 'circle(5% at 86% 79%)', transition: { duration: .55, ease: EASE } }}
      transition={{ duration: .62, ease: EASE }}
      style={{ background: '#efeee3', color: '#294b37' }}
    >
      <motion.div
        initial={{ opacity: 0, x: -18, clipPath: 'inset(0 100% 0 0)' }}
        animate={{ opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: .4, delay: .12, ease: EASE }}
        style={{ position: 'absolute', zIndex: 2, left: '7.2%', top: '24%', width: '37%' }}
      >
        <div className="film-kicker" style={{ color: '#9a795d', marginBottom: '2.1vmin' }}>Coatesville, Pennsylvania</div>
        <div className="film-serif" style={{ fontSize: '5.1vmin', lineHeight: .93, letterSpacing: '-.04em' }}>Estrada<br />Landscaping</div>
        <div style={{ marginTop: '1.4vmin', font: '600 1.45vmin/1.2 var(--font-body)', letterSpacing: '.19em', textTransform: 'uppercase', color: '#72806e' }}>Professional Inc.</div>
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .95, duration: .55, ease: EASE }}
          style={{ width: '40%', height: 1, background: '#c78860', margin: '3vmin 0 2vmin', transformOrigin: 'left' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.55, duration: .42, ease: EASE }}
          style={{ fontSize: '2.05vmin', lineHeight: 1.3, color: '#566958' }}
        >
          Call Norberto
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.45, duration: .42, ease: EASE }}
          style={{ fontSize: '1.65vmin', lineHeight: 1.5, color: '#7b8577', marginTop: '.7vmin' }}
        >
          Free estimates · within 30 miles
        </motion.div>
      </motion.div>
      <motion.div
        className="film-serif"
        initial={{ opacity: 0, scale: .84, x: 18 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: .78, delay: 1.55, ease: EASE }}
        style={{
          position: 'absolute', zIndex: 1, right: '6%', top: '34%', width: '55%',
          fontSize: '10.8vmin', lineHeight: .92, letterSpacing: '-.055em', whiteSpace: 'nowrap',
          color: '#294b37', fontVariantNumeric: 'lining-nums',
        }}
      >
        <span>484 </span><span style={{ color: '#c98055' }}>·</span><span> 510</span><br />
        <span style={{ marginLeft: '9%' }}><span style={{ color: '#c98055' }}>·</span> 6701</span>
      </motion.div>
      <motion.div
        initial={{ scale: .65, rotate: -12, opacity: 0 }}
        animate={{ scale: 1, rotate: 8, opacity: 1 }}
        transition={{ delay: 4.05, duration: .6, ease: EASE }}
        style={{
          position: 'absolute', zIndex: 4, top: '10%', right: '12%', width: '13vmin', height: '13vmin',
          borderRadius: '50%', background: '#cf8a5c', color: '#213b2c', display: 'grid', placeContent: 'center',
          textAlign: 'center', boxShadow: '0 1vmin 2.4vmin rgba(34,55,39,.12)',
        }}
      >
        <span className="film-serif" style={{ fontSize: '2.9vmin', lineHeight: .9 }}>Local</span>
        <span className="film-micro" style={{ fontSize: '.82vmin', marginTop: '.75vmin' }}>Coatesville, PA</span>
      </motion.div>
      <motion.span
        className="film-micro"
        initial={{ opacity: 0 }} animate={{ opacity: .55 }} transition={{ delay: 1.2 }}
        style={{ position: 'absolute', left: '7.2%', bottom: '7%', color: '#71806d' }}
      >
        A local point of contact
      </motion.span>
      <motion.span
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: .6 }}
        transition={{ delay: 1.4, duration: .48, type: 'spring', stiffness: 260, damping: 18 }}
        style={{ position: 'absolute', right: '7.5%', bottom: '8%', width: '1.3vmin', height: '1.3vmin', borderRadius: '50%', background: '#cf8a5c' }}
      />
      <motion.div
        initial={{ scale: 1, opacity: .84 }}
        animate={loopPunch ? { scale: 72, opacity: [1, 1, 0] } : { scale: 1, opacity: .84 }}
        transition={{ duration: .72, ease: EASE, times: [0, .58, 1] }}
        style={{
          position: 'absolute', zIndex: 6, right: '13.2%', bottom: '19%', width: '2.8vmin', height: '2.8vmin',
          borderRadius: '50%', background: '#cf8a5c', transformOrigin: 'center', pointerEvents: 'none',
        }}
      />
    </motion.section>
  );
}
