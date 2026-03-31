import React from 'react';

const VARIANTS = {
  board: {
    corner: 32,
    base: '/ui/pattern/board_base.png',
    tl: '/ui/pattern/board_corner_lefttop.png',
    tr: '/ui/pattern/board_corner_righttop.png',
    bl: '/ui/pattern/board_corner_leftbottom.png',
    br: '/ui/pattern/board_corner_rightbottom.png',
    top: '/ui/pattern/board_line_top.png',
    bottom: '/ui/pattern/board_line_bottom.png',
    left: '/ui/pattern/board_line_left.png',
    right: '/ui/pattern/board_line_right.png',
  },
  thin: {
    corner: 16,
    base: '/ui/pattern/board_base.png',
    tl: '/ui/pattern/thinboard_corner_lefttop.png',
    tr: '/ui/pattern/thinboard_corner_righttop.png',
    bl: '/ui/pattern/thinboard_corner_leftbottom.png',
    br: '/ui/pattern/thinboard_corner_rightbottom.png',
    top: '/ui/pattern/thinboard_line_top.png',
    bottom: '/ui/pattern/thinboard_line_bottom.png',
    left: '/ui/pattern/thinboard_line_left.png',
    right: '/ui/pattern/thinboard_line_right.png',
  },
  gold: {
    corner: 16,
    base: '/ui/pattern/thinboardgold/thinboard_bg_gold.png',
    tl: '/ui/pattern/thinboardgold/thinboard_corner_lefttop_gold.png',
    tr: '/ui/pattern/thinboardgold/thinboard_corner_righttop_gold.png',
    bl: '/ui/pattern/thinboardgold/thinboard_corner_leftbottom_gold.png',
    br: '/ui/pattern/thinboardgold/thinboard_corner_rightbottom_gold.png',
    top: '/ui/pattern/thinboardgold/thinboard_line_top_gold.png',
    bottom: '/ui/pattern/thinboardgold/thinboard_line_bottom_gold.png',
    left: '/ui/pattern/thinboardgold/thinboard_line_left_gold.png',
    right: '/ui/pattern/thinboardgold/thinboard_line_right_gold.png',
  },
  circle: {
    corner: 16,
    base: '/ui/pattern/board_base.png',
    tl: '/ui/pattern/thinboardcircle/thinboard_corner_lefttop_circle.png',
    tr: '/ui/pattern/thinboardcircle/thinboard_corner_righttop_circle.png',
    bl: '/ui/pattern/thinboardcircle/thinboard_corner_leftbottom_circle.png',
    br: '/ui/pattern/thinboardcircle/thinboard_corner_rightbottom_circle.png',
    top: '/ui/pattern/thinboardcircle/thinboard_line_top_circle.png',
    bottom: '/ui/pattern/thinboardcircle/thinboard_line_bottom_circle.png',
    left: '/ui/pattern/thinboardcircle/thinboard_line_left_circle.png',
    right: '/ui/pattern/thinboardcircle/thinboard_line_right_circle.png',
  },
};

export default function Metin2Panel({ variant = 'board', children, className = '', style = {}, onClick }) {
  const v = VARIANTS[variant] || VARIANTS.board;
  const c = v.corner;

  return (
    <div
      className={`m2-panel ${className}`}
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: `${c}px 1fr ${c}px`,
        gridTemplateRows: `${c}px 1fr ${c}px`,
        ...style,
      }}
    >
      {/* Top row */}
      <div style={{ backgroundImage: `url(${v.tl})`, backgroundSize: 'cover' }} />
      <div style={{ backgroundImage: `url(${v.top})`, backgroundRepeat: 'repeat-x', backgroundSize: `auto ${c}px` }} />
      <div style={{ backgroundImage: `url(${v.tr})`, backgroundSize: 'cover' }} />

      {/* Middle row */}
      <div style={{ backgroundImage: `url(${v.left})`, backgroundRepeat: 'repeat-y', backgroundSize: `${c}px auto` }} />
      <div
        className="m2-panel-content"
        style={{
          backgroundImage: `url(${v.base})`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
      <div style={{ backgroundImage: `url(${v.right})`, backgroundRepeat: 'repeat-y', backgroundSize: `${c}px auto` }} />

      {/* Bottom row */}
      <div style={{ backgroundImage: `url(${v.bl})`, backgroundSize: 'cover' }} />
      <div style={{ backgroundImage: `url(${v.bottom})`, backgroundRepeat: 'repeat-x', backgroundSize: `auto ${c}px` }} />
      <div style={{ backgroundImage: `url(${v.br})`, backgroundSize: 'cover' }} />
    </div>
  );
}
