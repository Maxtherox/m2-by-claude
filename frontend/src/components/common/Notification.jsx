import React, { useEffect } from 'react';

export default function Notification({ notification, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(notification.id), 4000);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  const typeStyles = {
    success: 'border-metin-green bg-metin-green/10 text-green-300',
    error: 'border-metin-red bg-metin-red/10 text-red-300',
    warning: 'border-metin-orange bg-metin-orange/10 text-orange-300',
    info: 'border-metin-blue bg-metin-blue/10 text-blue-300',
    loot: 'border-metin-gold bg-metin-gold/10 text-metin-gold',
  };

  return (
    <div className={`metin-panel border px-4 py-2 rounded-sm text-sm font-medieval animate-slide-in cursor-pointer
      ${typeStyles[notification.type] || typeStyles.info}`}
      onClick={() => onDismiss(notification.id)}
    >
      {notification.message}
    </div>
  );
}
