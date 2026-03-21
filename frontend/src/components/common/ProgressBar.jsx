import React from 'react';

export default function ProgressBar({ type = 'hp', current = 0, max = 100, showText = false, small = false }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (current / max) * 100)) : 0;

  const barClass = {
    hp: 'hp-bar',
    mp: 'mp-bar',
    stamina: 'stamina-bar',
    exp: 'exp-bar',
  }[type] || 'hp-bar';

  return (
    <div className={`${barClass} ${small ? '!h-3' : ''} relative`}>
      <div className="fill" style={{ width: `${pct}%` }} />
      {showText && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-medieval"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
          {Math.floor(current)}/{Math.floor(max)}
        </span>
      )}
    </div>
  );
}
