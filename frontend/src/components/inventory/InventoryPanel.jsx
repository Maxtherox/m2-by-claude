import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchInventory, equipItem, unequipItem, sellItem, useItem,
  selectItem, clearSelectedItem,
} from '../../store/slices/inventorySlice';
import { closePanel, addNotification } from '../../store/slices/uiSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import { getRarityColor, getRarityLabel, formatNumber } from '../../utils/helpers';
import {
  GiSwordman, GiCrossedSwords, GiBowArrow,
  GiBreastplate, GiVisoredHelm, GiShield, GiBootKick,
  GiBracer, GiNecklace, GiEarrings,
  GiHealthPotion, GiMagicPotion, GiRunningNinja,
  GiScrollUnfurled, GiStoneBlock, GiWoodAxe,
  GiFlowers, GiGoldBar, GiGems,
  GiAnvil,
} from 'react-icons/gi';
import { FaBoxOpen, FaStore } from 'react-icons/fa';
import { Metin2Panel, Metin2TitleBar, Metin2Button } from '../metin2ui';

function getItemIcon(item) {
  if (!item) return <FaBoxOpen className="text-gray-500" />;
  const sub = item.subtype || item.subType || '';
  const type = item.type || '';
  const effect = item.effect_type || '';
  const iconClass = 'w-full h-full';
  if (sub === 'potion' || type === 'consumable') {
    if (effect === 'heal_hp') return <GiHealthPotion className={iconClass} />;
    if (effect === 'heal_mp') return <GiMagicPotion className={iconClass} />;
    if (effect === 'heal_stamina') return <GiRunningNinja className={iconClass} />;
    return <GiHealthPotion className={iconClass} />;
  }
  const map = {
    sword: <GiCrossedSwords className={iconClass} />, blade: <GiSwordman className={iconClass} />,
    bow: <GiBowArrow className={iconClass} />, staff: <GiScrollUnfurled className={iconClass} />,
    fan: <GiScrollUnfurled className={iconClass} />, armor: <GiBreastplate className={iconClass} />,
    helmet: <GiVisoredHelm className={iconClass} />, shield: <GiShield className={iconClass} />,
    boots: <GiBootKick className={iconClass} />, bracelet: <GiBracer className={iconClass} />,
    necklace: <GiNecklace className={iconClass} />, earring: <GiEarrings className={iconClass} />,
    scroll: <GiScrollUnfurled className={iconClass} />, ore: <GiStoneBlock className={iconClass} />,
    wood: <GiWoodAxe className={iconClass} />, herb: <GiFlowers className={iconClass} />,
    material: <GiGoldBar className={iconClass} />, gem: <GiGems className={iconClass} />,
  };
  return map[sub] || map[type] || <FaBoxOpen className={iconClass} />;
}

const ROWS = 9;
const COLS = 5;
const SLOTS = ROWS * COLS;
const SLOT_SIZE = 40;

export default function InventoryPanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const { items, selectedItem } = useSelector((s) => s.inventory);
  const activeNpc = useSelector((s) => s.ui.activeNpc);
  const canSell = activeNpc?.type === 'shop' || activeNpc?.npc_type === 'shop';
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (character?.id) dispatch(fetchInventory(character.id));
  }, [dispatch, character?.id]);

  const handleAction = async (action) => {
    if (!selectedItem || !character) return;
    const charId = character.id;
    const invId = selectedItem.id;
    try {
      if (action === 'equip') await dispatch(equipItem({ charId, invId })).unwrap();
      else if (action === 'unequip') await dispatch(unequipItem({ charId, invId })).unwrap();
      else if (action === 'sell') await dispatch(sellItem({ charId, invId, quantity: 1 })).unwrap();
      else if (action === 'use') await dispatch(useItem({ charId, invId })).unwrap();
      dispatch(fetchInventory(charId));
      dispatch(loadCharacter(charId));
      const labels = { equip: 'equipado', unequip: 'desequipado', sell: 'vendido', use: 'usado' };
      dispatch(addNotification({ type: 'success', message: `Item ${labels[action]}` }));
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: e || 'Erro' }));
    }
  };

  const filteredItems = items.filter((it) => {
    if (filter === 'all') return true;
    if (filter === 'equip') return it.equippable;
    if (filter === 'consumable') return it.type === 'consumable';
    if (filter === 'material') return it.type === 'material' || it.type === 'etc';
    return true;
  });

  const grid = Array(SLOTS).fill(null);
  filteredItems.forEach((item) => {
    if (item.slot >= 0 && item.slot < SLOTS) grid[item.slot] = item;
  });

  const goldText = formatNumber(character?.gold ?? 0);

  return (
    <div className="flex gap-0">
      {/* Main inventory */}
      <Metin2Panel variant="board" style={{ width: 310 }}>
        <Metin2TitleBar title="Inventário" onClose={() => dispatch(closePanel())} />

        {/* Gold bar */}
        <div className="flex items-center justify-center gap-2 py-1" style={{ borderBottom: '1px solid #3a2a08' }}>
          <GiGoldBar className="text-yellow-500" style={{ fontSize: 14 }} />
          <span className="text-yellow-400 text-sm font-bold">{goldText}</span>
        </div>

        {/* Tab filters using border_c */}
        <div className="flex" style={{ borderBottom: '1px solid #3a2a08' }}>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'equip', label: 'Equip' },
            { id: 'consumable', label: 'Poção' },
            { id: 'material', label: 'Mat' },
          ].map((f) => (
            <div
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`m2-tab flex-1 ${filter === f.id ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              <div className="m2-tab-left" />
              <div className="m2-tab-mid">{f.label}</div>
              <div className="m2-tab-right" />
            </div>
          ))}
        </div>

        {/* Slot grid - NO overflow, fixed size, uses border_a inner frame */}
        <div style={{ padding: 6 }}>
          {/* Inner border frame */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '16px 1fr 16px',
              gridTemplateRows: '16px 1fr 16px',
            }}
          >
            <div style={{ backgroundImage: 'url(/ui/pattern/border_a_left_top.png)', backgroundSize: 'cover' }} />
            <div style={{ backgroundImage: 'url(/ui/pattern/border_a_top.png)', backgroundRepeat: 'repeat-x', backgroundSize: 'auto 16px' }} />
            <div style={{ backgroundImage: 'url(/ui/pattern/border_a_right_top.png)', backgroundSize: 'cover' }} />

            <div style={{ backgroundImage: 'url(/ui/pattern/border_a_left.png)', backgroundRepeat: 'repeat-y', backgroundSize: '16px auto' }} />
            <div
              style={{
                backgroundImage: 'url(/ui/pattern/border_a_center.png)',
                backgroundRepeat: 'repeat',
                display: 'grid',
                gridTemplateColumns: `repeat(${COLS}, ${SLOT_SIZE}px)`,
                gridTemplateRows: `repeat(${ROWS}, ${SLOT_SIZE}px)`,
                gap: 1,
                padding: 2,
              }}
            >
              {grid.map((item, i) => {
                const isSelected = selectedItem?.id === item?.id;
                const borderColor = item ? getRarityColor(item.rarity) + '99' : '#1a1a14';
                return (
                  <div
                    key={i}
                    onClick={() => item ? dispatch(selectItem(item)) : dispatch(clearSelectedItem())}
                    style={{
                      width: SLOT_SIZE,
                      height: SLOT_SIZE,
                      backgroundImage: 'url(/ui/pattern/board_base.png)',
                      backgroundRepeat: 'repeat',
                      border: isSelected ? '2px solid #c8b06a' : `1px solid ${borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      boxShadow: isSelected ? '0 0 6px rgba(212,168,50,0.5)' : 'none',
                    }}
                  >
                    {item ? (
                      <>
                        <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', color: getRarityColor(item.rarity) }}>
                          {getItemIcon(item)}
                        </div>
                        {item.refinement > 0 && (
                          <span style={{ position: 'absolute', top: 0, left: 1, fontSize: 10, color: '#f0d060', fontWeight: 'bold', textShadow: '0 1px 2px #000', lineHeight: 1 }}>
                            +{item.refinement}
                          </span>
                        )}
                        {item.quantity > 1 && (
                          <span style={{ position: 'absolute', bottom: 0, right: 1, fontSize: 10, color: '#fff', textShadow: '0 1px 2px #000', lineHeight: 1 }}>
                            {item.quantity}
                          </span>
                        )}
                        {item.equipped && (
                          <span style={{ position: 'absolute', top: 1, right: 1, width: 5, height: 5, borderRadius: '50%', background: '#30e030' }} />
                        )}
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div style={{ backgroundImage: 'url(/ui/pattern/border_a_right.png)', backgroundRepeat: 'repeat-y', backgroundSize: '16px auto' }} />

            <div style={{ backgroundImage: 'url(/ui/pattern/border_a_left_bottom.png)', backgroundSize: 'cover' }} />
            <div style={{ backgroundImage: 'url(/ui/pattern/border_a_bottom.png)', backgroundRepeat: 'repeat-x', backgroundSize: 'auto 16px' }} />
            <div style={{ backgroundImage: 'url(/ui/pattern/border_a_right_bottom.png)', backgroundSize: 'cover' }} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[13px] text-gray-500 py-1" style={{ borderTop: '1px solid #2a1e06' }}>
          {items.length} / {SLOTS}
        </div>
      </Metin2Panel>

      {/* Detail panel */}
      {selectedItem && (
        <Metin2Panel variant="board" style={{ width: 220, marginLeft: -2 }}>
          <div className="px-3 py-2" style={{ borderBottom: '1px solid #3a2a08' }}>
            <div className="text-sm font-bold" style={{ color: getRarityColor(selectedItem.rarity) }}>
              {selectedItem.refinement > 0 && <span style={{ color: '#f0d060' }}>+{selectedItem.refinement} </span>}
              {selectedItem.name}
            </div>
            <div className="text-[13px] text-gray-500">
              {getRarityLabel(selectedItem.rarity)}
              {selectedItem.level_required > 1 && ` · Lv.${selectedItem.level_required}`}
            </div>
          </div>

          <div className="flex justify-center py-2">
            <div style={{
              width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundImage: 'url(/ui/pattern/board_base.png)', backgroundRepeat: 'repeat',
              border: `2px solid ${getRarityColor(selectedItem.rarity)}`,
              color: getRarityColor(selectedItem.rarity), fontSize: 28,
            }}>
              {getItemIcon(selectedItem)}
            </div>
          </div>

          <div className="px-3 text-[13px] space-y-1">
            {selectedItem.description && <p className="m2-text-desc mb-2">{selectedItem.description}</p>}
            {selectedItem.base_attack > 0 && <div className="flex justify-between"><span className="m2-text-label">Ataque</span><span className="text-red-300">{selectedItem.base_attack}</span></div>}
            {selectedItem.base_magic_attack > 0 && <div className="flex justify-between"><span className="m2-text-label">Atq. Mágico</span><span className="text-blue-300">{selectedItem.base_magic_attack}</span></div>}
            {selectedItem.base_defense > 0 && <div className="flex justify-between"><span className="m2-text-label">Defesa</span><span className="text-green-300">{selectedItem.base_defense}</span></div>}
            {selectedItem.base_magic_defense > 0 && <div className="flex justify-between"><span className="m2-text-label">Def. Mágica</span><span className="text-cyan-300">{selectedItem.base_magic_defense}</span></div>}
            {selectedItem.hp_bonus > 0 && <div className="flex justify-between"><span className="m2-text-label">+HP</span><span className="text-pink-300">{selectedItem.hp_bonus}</span></div>}
            {selectedItem.mp_bonus > 0 && <div className="flex justify-between"><span className="m2-text-label">+MP</span><span className="text-blue-300">{selectedItem.mp_bonus}</span></div>}
            {[1,2,3,4,5].map(i => { const t=selectedItem[`bonus_${i}_type`], v=selectedItem[`bonus_${i}_value`]; return t ? <div key={i} className="flex justify-between"><span className="text-emerald-600">+{t.replace(/_/g,' ')}</span><span className="text-emerald-400">{v}</span></div> : null; })}
            {[1,2].map(i => { const t=selectedItem[`special_bonus_${i}_type`], v=selectedItem[`special_bonus_${i}_value`]; return t ? <div key={`s${i}`} className="flex justify-between"><span className="text-purple-500">★{t.replace(/_/g,' ')}</span><span className="text-purple-300">{v}</span></div> : null; })}
          </div>

          <div className="px-2 py-2 space-y-1" style={{ borderTop: '1px solid #3a2a08', marginTop: 4 }}>
            {selectedItem.equippable && !selectedItem.equipped && <Metin2Button onClick={() => handleAction('equip')} style={{ width: '100%' }}>Equipar</Metin2Button>}
            {selectedItem.equipped && <Metin2Button onClick={() => handleAction('unequip')} style={{ width: '100%' }}>Desequipar</Metin2Button>}
            {selectedItem.type === 'consumable' && <Metin2Button onClick={() => handleAction('use')} style={{ width: '100%' }}>Usar</Metin2Button>}
            {!selectedItem.equipped && selectedItem.sell_price > 0 && canSell && <Metin2Button onClick={() => handleAction('sell')} style={{ width: '100%', color: '#ff6666' }}>Vender ({formatNumber(selectedItem.sell_price)})</Metin2Button>}
          </div>
        </Metin2Panel>
      )}
    </div>
  );
}
