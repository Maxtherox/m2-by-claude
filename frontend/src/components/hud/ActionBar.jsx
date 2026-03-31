import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActivePanel } from '../../store/slices/uiSlice';
import { fetchHotbar, clearHotbarSlot } from '../../store/slices/hotbarSlice';
import {
  GiCharacter,
  GiKnapsack,
  GiArmorVest,
  GiSpellBook,
  GiScrollUnfurled,
  GiDungeonGate,
  GiAnvil,
  GiSandsOfTime,
} from 'react-icons/gi';
import { FaMap, FaSave, FaCog } from 'react-icons/fa';

const LEFT_ACTIONS = [
  { id: 'status', label: 'Status', icon: GiCharacter, key: 'C' },
  { id: 'inventory', label: 'Inventario', icon: GiKnapsack, key: 'I' },
  { id: 'equipment', label: 'Equip', icon: GiArmorVest, key: 'O' },
  { id: 'skills', label: 'Skills', icon: GiSpellBook, key: 'K' },
  { id: 'quests', label: 'Missoes', icon: GiScrollUnfurled, key: 'Q' },
];

const RIGHT_ACTIONS = [
  { id: 'dungeons', label: 'Masmorras', icon: GiDungeonGate, key: 'D' },
  { id: 'map', label: 'Mapa', icon: FaMap, key: 'M' },
  { id: 'lifeskills', label: 'Profissoes', icon: GiAnvil, key: 'P' },
  { id: 'idle', label: 'Idle', icon: GiSandsOfTime, key: 'L' },
  { id: 'saves', label: 'Save', icon: FaSave, key: 'F5' },
  { id: 'menu', label: 'Menu', icon: FaCog, key: 'ESC' },
];

const HOTBAR_SLOT_COUNT = 8;

const TYPE_ICONS = {
  skill: '\u2694\uFE0F',
  item: '\u{1F9EA}',
};

function ActionButton({ action, isActive, onClick }) {
  const Icon = action.icon;
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center transition-all duration-150"
      style={{
        width: 36,
        height: 36,
        backgroundImage: isActive
          ? 'url(/ui/pattern/thinboardgold/thinboard_bg_gold.png)'
          : 'url(/ui/pattern/board_base.png)',
        backgroundRepeat: 'repeat',
        border: isActive ? '1px solid #8b7332' : '1px solid #3a3a2e',
        color: isActive ? '#c8b06a' : '#888',
        boxShadow: isActive ? '0 0 6px rgba(212,168,50,0.3)' : 'none',
      }}
      title={`${action.label} (${action.key})`}
    >
      <Icon size={16} />
      <span className="text-[9px] leading-none mt-0.5">{action.label}</span>
    </button>
  );
}

function HotbarSlot({ slot, index, onRightClick }) {
  const filled = slot.type && slot.type !== 'empty';
  return (
    <div
      onContextMenu={(e) => onRightClick(e, slot)}
      className="w-9 h-9 relative flex items-center justify-center select-none cursor-pointer transition-all duration-150"
      style={{
        backgroundImage: 'url(/ui/pattern/board_base.png)',
        backgroundRepeat: 'repeat',
        border: filled ? '1px solid #8b7332' : '1px solid #2a2a1e',
        boxShadow: filled ? 'inset 0 0 4px rgba(212,168,50,0.15)' : 'none',
      }}
      title={
        filled
          ? `${slot.type} #${slot.reference_id} [${slot.keybind || index + 1}]`
          : `Slot ${index + 1} (vazio)`
      }
    >
      <span className="absolute top-0 left-0.5 text-[10px] leading-none text-gray-500 font-mono">
        {slot.keybind || index + 1}
      </span>
      {filled ? (
        <div className="flex flex-col items-center">
          <span className="text-sm leading-none">{TYPE_ICONS[slot.type] || '?'}</span>
          {slot.reference_id && (
            <span className="text-[9px] text-yellow-600/70 leading-none mt-0.5">
              #{slot.reference_id}
            </span>
          )}
        </div>
      ) : (
        <span className="text-[11px] text-gray-600">-</span>
      )}
    </div>
  );
}

export default function ActionBar() {
  const dispatch = useDispatch();
  const { activePanel } = useSelector((state) => state.ui);
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
      className="m2-taskbar px-2 py-1 z-30 relative"
      style={{ borderTop: '1px solid #5a4a1a' }}
    >
      <div className="flex items-center justify-center gap-1">
        {/* Left action buttons */}
        {LEFT_ACTIONS.map((action) => (
          <ActionButton
            key={action.id}
            action={action}
            isActive={activePanel === action.id}
            onClick={() => dispatch(setActivePanel(action.id))}
          />
        ))}

        {/* Separator */}
        <div className="w-px h-8 bg-gray-600/40 mx-1" />

        {/* Hotbar slots */}
        <div className="flex items-center gap-0.5 relative">
          {Array.from({ length: HOTBAR_SLOT_COUNT }, (_, i) => (
            <HotbarSlot
              key={i}
              slot={getSlot(i)}
              index={i}
              onRightClick={handleRightClick}
            />
          ))}
          {loading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-[11px] text-gray-400 animate-pulse">...</span>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="w-px h-8 bg-gray-600/40 mx-1" />

        {/* Right action buttons */}
        {RIGHT_ACTIONS.map((action) => (
          <ActionButton
            key={action.id}
            action={action}
            isActive={activePanel === action.id}
            onClick={() => dispatch(setActivePanel(action.id))}
          />
        ))}
      </div>
    </div>
  );
}
