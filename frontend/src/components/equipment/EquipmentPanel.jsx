import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInventory, unequipItem } from '../../store/slices/inventorySlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import { closePanel, addNotification } from '../../store/slices/uiSlice';
import { getRarityColor, getEquipmentSlotLabel, getItemIcon } from '../../utils/helpers';

const EQUIP_SLOTS = ['weapon', 'armor', 'helmet', 'shield', 'boots', 'earring', 'necklace', 'bracelet'];

export default function EquipmentPanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const { items } = useSelector((s) => s.inventory);
  const equipment = character?.equipment || {};

  const handleUnequip = async (invId) => {
    if (!character) return;
    try {
      await dispatch(unequipItem({ charId: character.id, slot: invId })).unwrap();
      dispatch(fetchInventory(character.id));
      dispatch(loadCharacter(character.id));
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: e || 'Erro' }));
    }
  };

  return (
    <div className="metin-panel-gold p-4 w-[350px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="panel-title !mb-0 !pb-0 !border-0">Equipamento</h2>
        <button onClick={() => dispatch(closePanel())} className="text-gray-500 hover:text-metin-gold">X</button>
      </div>
      <div className="divider-gold" />

      <div className="space-y-2">
        {EQUIP_SLOTS.map((slot) => {
          const item = equipment[slot];
          return (
            <div key={slot} className="flex items-center gap-3 p-2 metin-panel rounded-sm">
              <div className={`item-slot ${item ? `rarity-${item.rarity || 'common'}` : ''}`}>
                {item ? <span className="text-lg">{getItemIcon(item)}</span> : <span className="text-gray-600 text-xs">-</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 font-medieval">{getEquipmentSlotLabel(slot)}</div>
                {item ? (
                  <div className="text-sm font-medieval truncate" style={{ color: getRarityColor(item.rarity) }}>
                    {item.refinement > 0 && `+${item.refinement} `}{item.name}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">Vazio</div>
                )}
              </div>
              {item && (
                <button onClick={() => handleUnequip(item.inv_id)} className="metin-btn metin-btn-sm text-xs">
                  Tirar
                </button>
              )}
            </div>
          );
        })}
      </div>

      {character?.equipment_bonuses && (
        <>
          <div className="divider mt-3" />
          <h3 className="text-metin-gold text-xs font-medieval mb-1">Bonus do Equipamento</h3>
          <div className="text-xs space-y-0.5">
            {Object.entries(character.equipment_bonuses).filter(([, v]) => v > 0).map(([k, v]) => (
              <div key={k} className="stat-row">
                <span className="text-gray-500">{k.replace(/_/g, ' ')}</span>
                <span className="text-metin-green">+{v}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
