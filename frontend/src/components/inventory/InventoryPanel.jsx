import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInventory, equipItem, unequipItem, sellItem, useItem, selectItem, clearSelectedItem } from '../../store/slices/inventorySlice';
import { closePanel, addNotification } from '../../store/slices/uiSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import { getRarityColor, getRarityLabel, getItemIcon, formatNumber } from '../../utils/helpers';

export default function InventoryPanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const { items, selectedItem, loading } = useSelector((s) => s.inventory);

  useEffect(() => {
    if (character?.id) dispatch(fetchInventory(character.id));
  }, [dispatch, character?.id]);

  const handleAction = async (action) => {
    if (!selectedItem || !character) return;
    const charId = character.id;
    const invId = selectedItem.id;
    try {
      if (action === 'equip') await dispatch(equipItem({ charId, itemId: invId })).unwrap();
      else if (action === 'unequip') await dispatch(unequipItem({ charId, slot: invId })).unwrap();
      else if (action === 'sell') await dispatch(sellItem({ charId, itemId: invId, quantity: 1 })).unwrap();
      else if (action === 'use') await dispatch(useItem({ charId, itemId: invId })).unwrap();
      dispatch(fetchInventory(charId));
      dispatch(loadCharacter(charId));
      dispatch(addNotification({ type: 'success', message: `${action} realizado com sucesso` }));
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: e || 'Erro' }));
    }
  };

  const SLOTS = 45;
  const grid = Array(SLOTS).fill(null);
  items.forEach((item) => {
    if (item.slot >= 0 && item.slot < SLOTS) grid[item.slot] = item;
  });

  return (
    <div className="metin-panel-gold p-4 w-[420px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="panel-title !mb-0 !pb-0 !border-0">Inventario</h2>
        <button onClick={() => dispatch(closePanel())} className="text-gray-500 hover:text-metin-gold">X</button>
      </div>
      <div className="divider-gold" />

      <div className="grid grid-cols-9 gap-1 mb-3">
        {grid.map((item, i) => (
          <div
            key={i}
            onClick={() => item && dispatch(selectItem(item))}
            className={`item-slot ${item ? `rarity-${item.rarity || 'common'}` : ''} ${selectedItem?.id === item?.id ? 'ring-1 ring-metin-gold' : ''}`}
            title={item?.name || ''}
          >
            {item && (
              <>
                <span className="text-lg">{getItemIcon(item)}</span>
                {item.quantity > 1 && (
                  <span className="absolute bottom-0 right-0 text-[8px] text-white bg-black/70 px-0.5 rounded-sm">
                    {item.quantity}
                  </span>
                )}
                {item.refinement > 0 && (
                  <span className="absolute top-0 left-0 text-[8px] text-metin-gold bg-black/70 px-0.5 rounded-sm">
                    +{item.refinement}
                  </span>
                )}
                {item.equipped && (
                  <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-metin-green" />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="metin-panel p-3 animate-slide-in">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medieval" style={{ color: getRarityColor(selectedItem.rarity) }}>
                {selectedItem.refinement > 0 && `+${selectedItem.refinement} `}{selectedItem.name}
              </h4>
              <span className="text-xs text-gray-500">{getRarityLabel(selectedItem.rarity)} - Lv.{selectedItem.level_required || 1}</span>
            </div>
            <button onClick={() => dispatch(clearSelectedItem())} className="text-gray-500 text-xs">X</button>
          </div>

          {selectedItem.description && <p className="text-gray-400 text-xs mb-2">{selectedItem.description}</p>}

          <div className="text-xs space-y-0.5 mb-2">
            {selectedItem.base_attack > 0 && <div className="text-red-300">Ataque: {selectedItem.base_attack}</div>}
            {selectedItem.base_magic_attack > 0 && <div className="text-blue-300">Atq. Magico: {selectedItem.base_magic_attack}</div>}
            {selectedItem.base_defense > 0 && <div className="text-green-300">Defesa: {selectedItem.base_defense}</div>}
            {selectedItem.base_magic_defense > 0 && <div className="text-cyan-300">Def. Magica: {selectedItem.base_magic_defense}</div>}
            {[1,2,3,4,5].map(i => {
              const t = selectedItem[`bonus_${i}_type`];
              const v = selectedItem[`bonus_${i}_value`];
              return t ? <div key={i} className="text-metin-green">+ {t}: {v}</div> : null;
            })}
            {[1,2].map(i => {
              const t = selectedItem[`special_bonus_${i}_type`];
              const v = selectedItem[`special_bonus_${i}_value`];
              return t ? <div key={`s${i}`} className="text-metin-purple">* {t}: {v}</div> : null;
            })}
          </div>

          <div className="flex gap-1 flex-wrap">
            {selectedItem.equippable && !selectedItem.equipped && (
              <button onClick={() => handleAction('equip')} className="metin-btn metin-btn-sm">Equipar</button>
            )}
            {selectedItem.equipped && (
              <button onClick={() => handleAction('unequip')} className="metin-btn metin-btn-sm">Desequipar</button>
            )}
            {selectedItem.type === 'consumable' && (
              <button onClick={() => handleAction('use')} className="metin-btn metin-btn-sm">Usar</button>
            )}
            {!selectedItem.equipped && selectedItem.sell_price > 0 && (
              <button onClick={() => handleAction('sell')} className="metin-btn-danger metin-btn-sm">
                Vender ({formatNumber(selectedItem.sell_price)})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
