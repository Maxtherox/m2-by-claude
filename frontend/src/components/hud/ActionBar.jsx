import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActivePanel } from '../../store/slices/uiSlice';

const ACTIONS = [
  { id: 'status', label: 'Status', icon: '\u{1F4CA}', key: 'C' },
  { id: 'inventory', label: 'Inventario', icon: '\u{1F392}', key: 'I' },
  { id: 'equipment', label: 'Equip', icon: '\u{1F6E1}\uFE0F', key: 'O' },
  { id: 'skills', label: 'Skills', icon: '\u{1F4D6}', key: 'K' },
  { id: 'map', label: 'Mapa', icon: '\u{1F5FA}\uFE0F', key: 'M' },
  { id: 'lifeskills', label: 'Profissoes', icon: '\u{1F528}', key: 'P' },
  { id: 'idle', label: 'Idle', icon: '\u{1F55B}', key: 'L' },
  { id: 'menu', label: 'Menu', icon: '\u2699\uFE0F', key: 'ESC' },
];

export default function ActionBar() {
  const dispatch = useDispatch();
  const { activePanel } = useSelector((state) => state.ui);

  return (
    <div className="bg-metin-panel border-t border-metin-border px-4 py-2 z-30 relative"
      style={{ backgroundImage: 'linear-gradient(0deg, rgba(255,255,255,0.02) 0%, transparent 100%)' }}>
      <div className="flex justify-center gap-1">
        {ACTIONS.map((action) => {
          const isActive = activePanel === action.id;
          return (
            <button
              key={action.id}
              onClick={() => dispatch(setActivePanel(action.id))}
              className={`flex flex-col items-center px-3 py-1.5 rounded-sm border transition-all duration-150 min-w-[60px]
                ${isActive
                  ? 'border-metin-gold bg-metin-gold/10 text-metin-gold shadow-metin-gold'
                  : 'border-metin-border bg-metin-dark hover:border-metin-border-gold hover:bg-metin-panel-light text-gray-400 hover:text-metin-gold'
                }`}
              title={`${action.label} (${action.key})`}
            >
              <span className="text-lg leading-none">{action.icon}</span>
              <span className="text-[9px] font-medieval mt-0.5">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
