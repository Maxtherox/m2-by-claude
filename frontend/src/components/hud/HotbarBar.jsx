import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHotbar, clearHotbarSlot } from '../../store/slices/hotbarSlice';

const SLOT_COUNT = 8;

const TYPE_ICONS = {
  skill: '\u2694\uFE0F',
  item: '\u{1F9EA}',
};

export default function HotbarBar() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const { slots, loading } = useSelector((s) => s.hotbar);

  useEffect(() => {
    if (character?.id) {
      dispatch(fetchHotbar(character.id));
    }
  }, [dispatch, character?.id]);

  const handleRightClick = (e, slot) => {
    e.preventDefault();
    if (slot.type && slot.type !== 'empty') {
      dispatch(clearHotbarSlot({ charId: character.id, slotIndex: slot.slot_index }));
    }
  };

  const getSlot = (index) => {
    return slots.find((s) => s.slot_index === index) || { slot_index: index, type: 'empty' };
  };

  return (
    <div className="bg-metin-panel/80 border-t border-metin-border px-4 py-1 flex justify-center gap-1 z-30 relative">
      {Array.from({ length: SLOT_COUNT }, (_, i) => {
        const slot = getSlot(i);
        const filled = slot.type && slot.type !== 'empty';

        return (
          <div
            key={i}
            onContextMenu={(e) => handleRightClick(e, slot)}
            className={`w-10 h-10 rounded-sm border relative flex items-center justify-center select-none cursor-pointer transition-all duration-150
              ${filled
                ? 'border-metin-border-gold/50 bg-metin-dark hover:border-metin-gold hover:bg-metin-dark/80'
                : 'border-metin-border/30 bg-metin-dark/50 hover:border-metin-border/60'
              }`}
            title={
              filled
                ? `${slot.type} #${slot.reference_id} [${slot.keybind || i + 1}]`
                : `Slot ${i + 1} (vazio)`
            }
          >
            {/* Keybind number */}
            <span className="absolute top-0 left-0.5 text-[9px] leading-none text-gray-500 font-mono">
              {slot.keybind || i + 1}
            </span>

            {/* Slot content */}
            {filled ? (
              <div className="flex flex-col items-center">
                <span className="text-base leading-none">{TYPE_ICONS[slot.type] || '?'}</span>
                {slot.reference_id && (
                  <span className="text-[8px] text-metin-gold/70 leading-none mt-0.5">
                    #{slot.reference_id}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[10px] text-gray-600">-</span>
            )}
          </div>
        );
      })}

      {loading && (
        <div className="absolute inset-0 bg-metin-dark/40 flex items-center justify-center">
          <span className="text-[10px] text-gray-400 animate-pulse">...</span>
        </div>
      )}
    </div>
  );
}
