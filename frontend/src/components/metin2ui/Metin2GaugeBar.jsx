import React from 'react';

const GAUGE_FILL = {
  hp: '/ui/pattern/gauge_red.png',
  mp: '/ui/pattern/gauge_blue.png',
  st: '/ui/pattern/gauge_purple.png',
  exp: '/ui/pattern/gauge_pink.png',
};

export default function Metin2GaugeBar({ type = 'hp', current = 0, max = 100, showText = false }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (current / max) * 100)) : 0;
  const fillImg = GAUGE_FILL[type] || GAUGE_FILL.hp;
  const h = type === 'st' || type === 'exp' ? 14 : 20;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '8px 1fr 8px',
      height: h,
      position: 'relative',
      width: '100%',
    }}>
      {/* Left cap */}
      <div style={{
        backgroundImage: 'url(/ui/pattern/gauge_slot_left.png)',
        backgroundSize: '100% 100%',
      }} />

      {/* Center - black bg + colored fill */}
      <div style={{
        backgroundImage: 'url(/ui/pattern/gauge_slot_center.png)',
        backgroundSize: '100% 100%',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Black empty background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#0a0a0a',
        }} />
        {/* Colored fill - width = percentage */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: `${pct}%`,
          backgroundImage: `url(${fillImg})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: `auto ${h}px`,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Right cap */}
      <div style={{
        backgroundImage: 'url(/ui/pattern/gauge_slot_right.png)',
        backgroundSize: '100% 100%',
      }} />

      {/* Text overlay */}
      {showText && (
        <span style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          color: '#fff',
          textShadow: '0 1px 2px #000, 0 0 3px #000',
          zIndex: 1,
          pointerEvents: 'none',
        }}>
          {Math.floor(current)}/{Math.floor(max)}
        </span>
      )}
    </div>
  );
}
