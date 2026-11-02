import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { ChevronDown, ChevronUp, LockKeyhole, Pause, Play, Repeat2, Volume2, VolumeX } from 'lucide-react';
import HeroVideoBackground from './HeroVideoBackground';
import VideoTemplate, { SCENE_DURATIONS } from './VideoTemplate';
import { useSceneControls } from './useSceneControls';

const SCENE_DETAILS: Record<string, { title: string; filePath: string }> = {
  opening: { title: 'A little more life outside', filePath: 'src/components/video/scenes/Scene01.tsx' },
  detail: { title: 'Every detail', filePath: 'src/components/video/scenes/Scene02.tsx' },
  trust: { title: 'Close to home', filePath: 'src/components/video/scenes/Scene03.tsx' },
  close: { title: 'Say hello', filePath: 'src/components/video/scenes/Scene04.tsx' },
};

function announceSceneSelection(index: number, sceneKeys: string[]) {
  const key = sceneKeys[index];
  const details = SCENE_DETAILS[key];
  if (!details?.filePath) return;
  window.parent.postMessage({
    type: 'REPLIT_VIDEO_SCENE_SELECTED',
    payload: {
      sceneIndex: index,
      sceneCount: sceneKeys.length,
      sceneTitle: details.title,
      filePath: details.filePath,
      lineNumber: 1,
    },
  }, '*');
}

function formatTime(durationMs: number) {
  const seconds = Math.max(0, Math.floor(durationMs / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function PlaybackStatus({
  sceneKeys, activeIndex, activeDuration, activeStartTime, totalDuration, tick, paused, onJumpTo,
}: {
  sceneKeys: string[];
  activeIndex: number;
  activeDuration: number;
  activeStartTime: number;
  totalDuration: number;
  tick: number;
  paused: boolean;
  onJumpTo: (index: number) => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const elapsedBase = useRef(0);

  useEffect(() => {
    setElapsed(0);
    elapsedBase.current = 0;
  }, [tick]);

  useEffect(() => {
    if (paused) return;
    const start = performance.now();
    const interval = window.setInterval(() => {
      setElapsed(elapsedBase.current + performance.now() - start);
    }, 60);
    return () => {
      window.clearInterval(interval);
      elapsedBase.current += performance.now() - start;
    };
  }, [tick, paused]);

  const totalElapsed = Math.min(totalDuration, activeStartTime + Math.min(elapsed, activeDuration));
  const progress = activeDuration ? Math.min(100, elapsed / activeDuration * 100) : 0;
  return (
    <>
      <div className="film-progress">
        {sceneKeys.map((key, index) => (
          <button
            type="button"
            key={key}
            aria-label={`Jump to scene ${index + 1}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => onJumpTo(index)}
          >
            <span className="film-progress-fill" style={{ width: `${index === activeIndex ? progress : index < activeIndex ? 100 : 0}%` }} />
          </button>
        ))}
      </div>
      <span className="film-readout">{activeIndex + 1}/{sceneKeys.length}</span>
      <span className="film-readout" role="timer" aria-label={`Playback time ${formatTime(totalElapsed)} of ${formatTime(totalDuration)}`}>
        {formatTime(totalElapsed)} / {formatTime(totalDuration)}
      </span>
    </>
  );
}

export default function VideoWithControls() {
  const isHeroEmbed = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('embed') === 'hero';
  const isIframed = typeof window !== 'undefined' && window.self !== window.top;
  const {
    sceneKeys, activeIndex, locked, paused, mountKey, tick, durations,
    activeDuration, activeStartTime, totalDuration, onSceneChange,
    jumpTo, toggleLock, togglePause,
  } = useSceneControls(SCENE_DURATIONS);
  const [muted, setMuted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [tapPinned, setTapPinned] = useState(false);
  const sensorRef = useRef<HTMLDivElement | null>(null);

  const handleJumpTo = useCallback((index: number) => {
    jumpTo(index);
    announceSceneSelection(index, sceneKeys);
  }, [jumpTo, sceneKeys]);
  const onPointerEnter = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') setHovering(true);
  }, []);
  const onPointerLeave = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') setHovering(false);
  }, []);
  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' && collapsed) setTapPinned(true);
  }, [collapsed]);
  const toggleCollapsed = useCallback(() => {
    setCollapsed((value) => {
      if (!value) {
        setHovering(false);
        setTapPinned(false);
      }
      return !value;
    });
  }, []);

  useEffect(() => {
    if (!(collapsed && tapPinned)) return;
    const onDocumentPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      if (sensorRef.current && !sensorRef.current.contains(event.target as Node)) setTapPinned(false);
    };
    document.addEventListener('pointerdown', onDocumentPointerDown);
    return () => document.removeEventListener('pointerdown', onDocumentPointerDown);
  }, [collapsed, tapPinned]);

  useEffect(() => {
    if (!paused) return;
    const animations = document.getAnimations().filter((animation) => animation.playState === 'running');
    animations.forEach((animation) => animation.pause());
    return () => animations.forEach((animation) => animation.play());
  }, [paused]);

  if (isHeroEmbed) return <HeroVideoBackground />;
  if (!isIframed) return <VideoTemplate />;

  const visible = !collapsed || hovering || tapPinned;
  return (
    <div className="relative w-full h-screen">
      <VideoTemplate
        key={mountKey}
        durations={durations}
        loop
        paused={paused}
        muted={muted}
        onSceneChange={onSceneChange}
      />
      <div
        ref={sensorRef}
        className="film-control-sensor"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
      >
        <div style={{ flex: 1 }} aria-hidden="true" />
        <div className={`film-controls${visible ? '' : ' is-hidden'}`} aria-hidden={!visible}>
          <button className="film-control-button" type="button" onClick={togglePause} aria-label={paused ? 'Play' : 'Pause'} title={paused ? 'Play' : 'Pause'}>
            {paused ? <Play size={18} /> : <Pause size={18} />}
          </button>
          <button className="film-control-button" type="button" onClick={toggleLock} aria-pressed={locked} aria-label={locked ? 'Loop current scene: on' : 'Loop current scene: off'} title={locked ? 'Loop current scene: on' : 'Loop current scene: off'}>
            {locked ? <LockKeyhole size={17} /> : <Repeat2 size={17} />}
          </button>
          <button className="film-control-button" type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? 'Unmute' : 'Mute'} title={muted ? 'Unmute' : 'Mute'}>
            {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
          <PlaybackStatus
            sceneKeys={sceneKeys}
            activeIndex={activeIndex}
            activeDuration={activeDuration}
            activeStartTime={activeStartTime}
            totalDuration={totalDuration}
            tick={tick}
            paused={paused}
            onJumpTo={handleJumpTo}
          />
          <button className="film-control-button" type="button" onClick={toggleCollapsed} aria-label={collapsed ? 'Show controls' : 'Hide controls'} aria-expanded={!collapsed}>
            {collapsed ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
