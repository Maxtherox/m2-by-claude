import React, { useState } from 'react';

export default function Metin2Button({ children, onClick, disabled = false, className = '', style = {} }) {
  const [state, setState] = useState('normal');

  const imgs = {
    normal: '/ui/pattern/largeb_button_01.png',
    hover: '/ui/pattern/largeb_button_02.png',
    active: '/ui/pattern/largeb_button_03.png',
  };

  const current = disabled ? imgs.normal : imgs[state];

  return (
    <button
      className={`m2-btn ${className}`}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setState('hover')}
      onMouseLeave={() => !disabled && setState('normal')}
      onMouseDown={() => !disabled && setState('active')}
      onMouseUp={() => !disabled && setState('hover')}
      disabled={disabled}
      style={{
        backgroundImage: `url(${current})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        border: 'none',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? '#666' : '#c8b06a',
        fontSize: 14,
        fontWeight: 'bold',
        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
        padding: '6px 20px',
        minHeight: 28,
        textAlign: 'center',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.15s',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
