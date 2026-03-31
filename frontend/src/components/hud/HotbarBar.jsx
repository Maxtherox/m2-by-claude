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
    <div
      className="m2-taskbar px-4 py-1 flex justify-center gap-1 z-30 relative"
      style={{ borderTop: '1px solid #5a4a1a' }}
    >
      {Array.from({ length: SLOT_COUNT }, (_, i) => {
        const slot = getSlot(i);
        const filled = slot.type && slot.type !== 'empty';

        return (
          <div
            key={i}
            onContextMenu={(e) => handleRightClick(e, slot)}
            className="w-10 h-10 relative flex items-center justify-center select-none cursor-pointer transition-all duration-150"
            style={{
              backgroundImage: 'url(/ui/pattern/board_base.png)',
              backgroundRepeat: 'repeat',
              border: filled ? '1px solid #8b7332' : '1px solid #2a2a1e',
              boxShadow: filled ? 'inset 0 0 4px rgba(212,168,50,0.15)' : 'none',
            }}
            title={
              filled
                ? `${slot.type} #${slot.reference_id} [${slot.keybind || i + 1}]`
                : `Slot ${i + 1} (vazio)`
            }
          >
            {/* Keybind number */}
            <span className="absolute top-0 left-0.5 text-[12px] leading-none text-gray-500 font-mono">
              {slot.keybind || i + 1}
            </span>

            {/* Slot content */}
            {filled ? (
              <div className="flex flex-col items-center">
                <span className="text-base leading-none">{TYPE_ICONS[slot.type] || '?'}</span>
                {slot.reference_id && (
                  <span className="text-[11px] text-yellow-600/70 leading-none mt-0.5">
                    #{slot.reference_id}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[13px] text-gray-600">-</span>
            )}
          </div>
        );
      })}

      {loading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <span className="text-[13px] text-gray-400 animate-pulse">...</span>
        </div>
      )}
    </div>
  );
}
