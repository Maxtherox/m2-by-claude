import React from 'react';

export default function Metin2TitleBar({ title, onClose, children }) {
  return (
    <div
      className="m2-titlebar"
      style={{
        display: 'grid',
        gridTemplateColumns: '32px 1fr 32px',
        height: 32,
        minHeight: 32,
      }}
    >
      <div style={{ backgroundImage: 'url(/ui/pattern/titlebar_left.png)', backgroundSize: 'cover' }} />
      <div
        style={{
          backgroundImage: 'url(/ui/pattern/titlebar_center.png)',
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {title && (
          <span
            style={{
              color: '#c8b06a',
              fontSize: 15,
              fontWeight: 'bold',
              textShadow: '0 1px 3px rgba(0,0,0,0.9)',
              letterSpacing: '0.5px',
            }}
          >
            {title}
          </span>
        )}
        {children}
      </div>
      <div
        style={{
          backgroundImage: 'url(/ui/pattern/titlebar_right.png)',
          backgroundSize: 'cover',
          cursor: onClose ? 'pointer' : 'default',
        }}
        onClick={onClose}
        title={onClose ? 'Fechar' : undefined}
      />
    </div>
  );
}
