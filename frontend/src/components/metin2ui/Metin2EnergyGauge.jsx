import React from 'react';

// Energy gauge uses a semicircular meter with 3 states:
// - gauge_empty: empty/depleted
// - gauge_hungry: low energy (below 30%)
// - gauge_full: normal/full energy
export default function Metin2EnergyGauge({ current = 0, max = 100 }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (current / max) * 100)) : 0;

  let stateImg;
  if (pct <= 5) {
    stateImg = '/ui/pattern/energygauge/gauge_empty.png';
  } else if (pct <= 30) {
    stateImg = '/ui/pattern/energygauge/gauge_hungry.png';
  } else {
    stateImg = '/ui/pattern/energygauge/gauge_full.png';
  }

  return (
    <div
      className="m2-energy-gauge"
      style={{
        position: 'relative',
        width: 68,
        height: 40,
      }}
    >
      {/* Base frame */}
      <img
        src="/ui/pattern/energygauge/energygauge_base.png"
        alt="energy gauge base"
        style={{
          width: 68,
          height: 40,
          display: 'block',
          imageRendering: 'pixelated',
        }}
        draggable={false}
      />
      {/* State overlay */}
      <img
        src={stateImg}
        alt="energy state"
        style={{
          position: 'absolute',
          top: 4,
          left: 11,
          width: 46,
          height: 17,
          imageRendering: 'pixelated',
        }}
        draggable={false}
      />
      {/* Percentage text */}
      <span
        style={{
          position: 'absolute',
          bottom: 2,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 11,
          color: '#ccc',
          textShadow: '0 1px 2px rgba(0,0,0,0.95)',
          lineHeight: 1,
        }}
      >
        {Math.floor(pct)}%
      </span>
    </div>
  );
}
