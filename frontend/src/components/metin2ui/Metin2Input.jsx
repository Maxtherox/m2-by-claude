import React from 'react';

export default function Metin2Input({ value, onChange, placeholder, disabled, type = 'text', style = {}, ...props }) {
  return (
    <div
      className="m2-chatbar"
      style={{ height: 28, gridTemplateColumns: '28px 1fr 28px' }}
    >
      <div style={{
        backgroundImage: 'url(/ui/pattern/chat_bar_left.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }} />
      <div style={{
        backgroundImage: 'url(/ui/pattern/chat_bar_middle.png)',
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'auto 28px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#d4c8a0',
            fontSize: 14,
            width: '100%',
            padding: '0 4px',
            ...style,
          }}
          {...props}
        />
      </div>
      <div style={{
        backgroundImage: 'url(/ui/pattern/chat_bar_right.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }} />
    </div>
  );
}
