import React from 'react';
import { Metin2Window } from '../metin2ui';

export default function Modal({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="animate-slide-in"
        style={{ minWidth: 300, maxWidth: 500, maxHeight: '80vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <Metin2Window title={title} onClose={onClose} variant="gold">
          <div style={{ maxHeight: 'calc(80vh - 80px)', overflowY: 'auto' }}>
            {children}
          </div>
          {footer && (
            <>
              <div className="divider-gold" />
              <div className="flex justify-end gap-2">{footer}</div>
            </>
          )}
        </Metin2Window>
      </div>
    </div>
  );
}
