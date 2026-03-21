import React from 'react';

export default function Modal({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="metin-panel-gold p-4 min-w-[300px] max-w-[500px] max-h-[80vh] overflow-y-auto animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          {title && (
            <h2 className="panel-title mb-0 pb-0 border-b-0">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-metin-gold text-xl leading-none ml-auto"
          >
            &times;
          </button>
        </div>
        <div className="divider-gold" />

        {/* Content */}
        <div>{children}</div>

        {/* Footer */}
        {footer && (
          <>
            <div className="divider" />
            <div className="flex justify-end gap-2">{footer}</div>
          </>
        )}
      </div>
    </div>
  );
}
