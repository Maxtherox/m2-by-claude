import React from 'react';
import Metin2Panel from './Metin2Panel';
import Metin2TitleBar from './Metin2TitleBar';

export default function Metin2Window({
  title,
  onClose,
  variant = 'board',
  children,
  className = '',
  style = {},
  contentStyle = {},
}) {
  return (
    <Metin2Panel variant={variant} className={className} style={style}>
      {title && <Metin2TitleBar title={title} onClose={onClose} />}
      <div className="m2-window-content" style={{ padding: 8, ...contentStyle }}>
        {children}
      </div>
    </Metin2Panel>
  );
}
