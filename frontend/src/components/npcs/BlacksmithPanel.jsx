import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closePanel, addNotification } from '../../store/slices/uiSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import { fetchInventory } from '../../store/slices/inventorySlice';
import { getRarityColor, formatNumber } from '../../utils/helpers';
import { Metin2Window, Metin2Button } from '../metin2ui';
import * as api from '../../services/api';

export default function BlacksmithPanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const { items } = useSelector((s) => s.inventory);
  const [tab, setTab] = useState('refine');
  const [recipes, setRecipes] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const refineableItems = items.filter((i) => i.refineable && !i.equipped);
  const equipItems = items.filter((i) => i.equippable && !i.equipped);

  useEffect(() => {
    api.getRecipes('blacksmith').then((res) => {
      if (res.success) setRecipes(res.data);
    }).catch(() => {});
  }, []);

  const handleRefine = async () => {
    if (!selectedItem || !character) return;
    try {
      const res = await api.refineItem(character.id, selectedItem.id);
      if (res.success) {
        const d = res.data;
        const notifType = d.success ? 'success' : d.broken ? 'error' : 'error';
        dispatch(addNotification({ type: notifType, message: d.message }));
        dispatch(loadCharacter(character.id));
        dispatch(fetchInventory(character.id));
        setSelectedItem(null);
      }
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: e.response?.data?.error || 'Erro' }));
    }
  };

  const handleAddBonus = async (scrollType) => {
    if (!selectedItem || !character) return;
    try {
      const res = await api.addBonus(character.id, selectedItem.id, scrollType);
      if (res.success) {
        dispatch(addNotification({ type: 'loot', message: res.data.message }));
        dispatch(fetchInventory(character.id));
        setSelectedItem(null);
      }
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: e.response?.data?.error || 'Erro' }));
    }
  };

  const handleCraft = async (recipeId) => {
    if (!character) return;
    try {
      const res = await api.craft(character.id, recipeId);
      if (res.success) {
        dispatch(addNotification({ type: 'loot', message: res.data.message }));
        dispatch(loadCharacter(character.id));
        dispatch(fetchInventory(character.id));
      }
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: e.response?.data?.error || 'Erro' }));
    }
  };

  return (
    <Metin2Window title="Ferreiro" onClose={() => dispatch(closePanel())} variant="gold" style={{ width: 420 }}>

      <div className="flex gap-1 mb-3">
        {['refine', 'bonus', 'craft'].map((t) => (
          <button key={t} onClick={() => { setTab(t); setSelectedItem(null); }}
            className={`metin-btn metin-btn-sm flex-1 ${tab === t ? '!bg-metin-gold/20 !border-metin-gold' : ''}`}>
            {t === 'refine' ? 'Refinar' : t === 'bonus' ? 'Bonus' : 'Crafting'}
          </button>
        ))}
      </div>

      {tab === 'refine' && (
        <div>
          <p className="text-gray-400 text-sm mb-2">
            Selecione um item para refinar. Pergaminho é opcional mas protege contra quebra.
          </p>
          <div className="space-y-1 max-h-[40vh] overflow-y-auto mb-3">
            {refineableItems.map((item) => {
              const ref = item.refinement ?? 0;
              const chances = [100, 90, 80, 65, 50, 35, 25, 15, 8];
              const successChance = chances[ref] ?? 0;
              return (
                <button key={item.id} onClick={() => setSelectedItem(item)}
                  className={`w-full metin-panel p-2 text-left text-sm border ${selectedItem?.id === item.id ? 'border-metin-gold' : 'border-metin-border'}`}>
                  <div className="flex justify-between items-center">
                    <span style={{ color: getRarityColor(item.rarity) }}>
                      {ref > 0 && `+${ref} `}{item.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {successChance}% sucesso
                    </span>
                  </div>
                </button>
              );
            })}
            {refineableItems.length === 0 && <p className="text-gray-600 text-sm">Nenhum item refinavel.</p>}
          </div>
          {selectedItem && (() => {
            const ref = selectedItem.refinement ?? 0;
            const chances = [100, 90, 80, 65, 50, 35, 25, 15, 8];
            const breakChances = [0, 1, 2, 3, 4, 5, 15, 25, 40];
            const successChance = chances[ref] ?? 0;
            const breakChance = breakChances[ref] ?? 50;
            const hasScroll = items.some((i) => !i.equipped && (i.item_id === 93 || i.item_id === 94));
            const hasProtection = items.some((i) => !i.equipped && i.item_id === 96);
            const lvl = selectedItem.level_required || 1;
            const cost = ref <= 5
              ? Math.floor((ref + 1) * 500 * (1 + lvl * 0.05))
              : Math.floor(Math.pow(ref, 2.5) * 1000 * (1 + lvl * 0.1));
            return (
              <div className="space-y-2">
                <div className="metin-panel p-2 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Custo:</span>
                    <span className="text-yellow-400">{formatNumber(cost)} ouro</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Chance de sucesso:</span>
                    <span className="text-metin-green">{successChance}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Chance de quebra (sem pergaminho):</span>
                    <span className={breakChance > 0 ? 'text-red-400' : 'text-gray-500'}>{breakChance}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pergaminho:</span>
                    <span className={hasScroll ? 'text-metin-green' : 'text-yellow-500'}>
                      {hasScroll ? 'Sim (protege contra quebra)' : 'Sem (item pode quebrar!)'}
                    </span>
                  </div>
                  {hasProtection && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Proteção:</span>
                      <span className="text-metin-green">Sim (evita perda de nível)</span>
                    </div>
                  )}
                </div>
                {!hasScroll && breakChance > 0 && (
                  <div className="text-sm text-red-400 text-center font-medieval">
                    Sem pergaminho: {breakChance}% de chance do item QUEBRAR!
                  </div>
                )}
                <button onClick={handleRefine} className="metin-btn-gold w-full">
                  Refinar +{ref + 1} ({formatNumber(cost)} ouro)
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {tab === 'bonus' && (
        <div>
          <p className="text-gray-400 text-sm mb-2">Selecione um equipamento para adicionar bonus:</p>
          <div className="space-y-1 max-h-[40vh] overflow-y-auto mb-3">
            {equipItems.map((item) => (
              <button key={item.id} onClick={() => setSelectedItem(item)}
                className={`w-full metin-panel p-2 text-left text-sm border ${selectedItem?.id === item.id ? 'border-metin-gold' : 'border-metin-border'}`}>
                <span style={{ color: getRarityColor(item.rarity) }}>{item.name}</span>
              </button>
            ))}
          </div>
          {selectedItem && (
            <div className="flex gap-2">
              <button onClick={() => handleAddBonus('normal')} className="metin-btn flex-1">Bonus Normal</button>
              <button onClick={() => handleAddBonus('special')} className="metin-btn flex-1">Bonus Especial</button>
            </div>
          )}
        </div>
      )}

      {tab === 'craft' && (
        <div className="space-y-2 max-h-[50vh] overflow-y-auto">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="metin-panel p-3">
              <div className="text-sm font-medieval text-metin-gold mb-1">{recipe.name}</div>
              {recipe.result_item && (
                <div className="text-sm mb-1" style={{ color: getRarityColor(recipe.result_item.rarity) }}>
                  Resultado: {recipe.result_item.name} x{recipe.result_quantity}
                </div>
              )}
              <div className="text-sm text-gray-500 mb-2">
                {recipe.materials?.map((m) => `${m.item_name} x${m.quantity}`).join(', ')}
              </div>
              <button onClick={() => handleCraft(recipe.id)} className="metin-btn metin-btn-sm">Craftar</button>
            </div>
          ))}
          {recipes.length === 0 && <p className="text-gray-600 text-sm">Nenhuma receita disponivel.</p>}
        </div>
      )}
    </Metin2Window>
  );
}
