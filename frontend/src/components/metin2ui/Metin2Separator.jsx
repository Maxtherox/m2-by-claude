import React from 'react';

export default function Metin2Separator({ type = 'horizontal' }) {
  if (type === 'separator') {
    return (
      <div
        className="m2-separator"
        style={{
          backgroundImage: 'url(/ui/pattern/seperator.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          height: 16,
          width: '100%',
          margin: '4px 0',
        }}
      />
    );
  }

  return (
    <div
      className="m2-horizontal-bar"
      style={{
        display: 'grid',
        gridTemplateColumns: '32px 1fr 32px',
        height: 16,
        margin: '2px 0',
      }}
    >
      <div style={{ backgroundImage: 'url(/ui/pattern/horizontalbar_left.png)', backgroundSize: 'cover' }} />
      <div style={{ backgroundImage: 'url(/ui/pattern/horizontalbar_center.png)', backgroundRepeat: 'repeat-x', backgroundSize: 'auto 16px' }} />
      <div style={{ backgroundImage: 'url(/ui/pattern/horizontalbar_right.png)', backgroundSize: 'cover' }} />
    </div>
  );
}
