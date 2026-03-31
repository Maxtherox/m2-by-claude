import React from 'react';

// Reusable inner border box using border_a or border_b pattern
// Mirrors the parent board's ornamental style
const VARIANTS = {
  a: {
    c: 16,
    tl: '/ui/pattern/border_a_left_top.png',
    t: '/ui/pattern/border_a_top.png',
    tr: '/ui/pattern/border_a_right_top.png',
    l: '/ui/pattern/border_a_left.png',
    center: '/ui/pattern/border_a_center.png',
    r: '/ui/pattern/border_a_right.png',
    bl: '/ui/pattern/border_a_left_bottom.png',
    b: '/ui/pattern/border_a_bottom.png',
    br: '/ui/pattern/border_a_right_bottom.png',
  },
  b: {
    c: 16,
    tl: '/ui/pattern/border_b_left_top.png',
    t: '/ui/pattern/border_b_top.png',
    tr: '/ui/pattern/border_b_right_top.png',
    l: '/ui/pattern/border_b_left.png',
    center: '/ui/pattern/border_b_center.png',
    r: '/ui/pattern/border_b_right.png',
    bl: '/ui/pattern/border_b_left_bottom.png',
    b: '/ui/pattern/border_b_bottom.png',
    br: '/ui/pattern/border_b_right_bottom.png',
  },
};

export default function Metin2Box({ variant = 'a', children, style = {}, title }) {
  const v = VARIANTS[variant] || VARIANTS.a;
  const c = v.c;

  return (
    <div style={style}>
      {title && (
        <div style={{ color: '#c8b06a', fontSize: 13, fontWeight: 'bold', marginBottom: 4, textShadow: '0 1px 2px #000' }}>
          {title}
        </div>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `${c}px 1fr ${c}px`,
        gridTemplateRows: `${c}px 1fr ${c}px`,
      }}>
        <div style={{ backgroundImage: `url(${v.tl})`, backgroundSize: 'cover' }} />
        <div style={{ backgroundImage: `url(${v.t})`, backgroundRepeat: 'repeat-x', backgroundSize: `auto ${c}px` }} />
        <div style={{ backgroundImage: `url(${v.tr})`, backgroundSize: 'cover' }} />

        <div style={{ backgroundImage: `url(${v.l})`, backgroundRepeat: 'repeat-y', backgroundSize: `${c}px auto` }} />
        <div style={{
          backgroundImage: `url(${v.center})`,
          backgroundRepeat: 'repeat',
          padding: 6,
        }}>
          {children}
        </div>
        <div style={{ backgroundImage: `url(${v.r})`, backgroundRepeat: 'repeat-y', backgroundSize: `${c}px auto` }} />

        <div style={{ backgroundImage: `url(${v.bl})`, backgroundSize: 'cover' }} />
        <div style={{ backgroundImage: `url(${v.b})`, backgroundRepeat: 'repeat-x', backgroundSize: `auto ${c}px` }} />
        <div style={{ backgroundImage: `url(${v.br})`, backgroundSize: 'cover' }} />
      </div>
    </div>
  );
}
