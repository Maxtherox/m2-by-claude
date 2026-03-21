import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closePanel, addNotification } from '../../store/slices/uiSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import { fetchInventory } from '../../store/slices/inventorySlice';
import { getRarityColor, formatNumber } from '../../utils/helpers';
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
        dispatch(addNotification({
          type: d.success ? 'success' : 'error',
          message: d.message,
        }));
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
    <div className="metin-panel-gold p-4 w-[420px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="panel-title !mb-0 !pb-0 !border-0">Ferreiro</h2>
        <button onClick={() => dispatch(closePanel())} className="text-gray-500 hover:text-metin-gold">X</button>
      </div>
      <div className="divider-gold" />

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
          <p className="text-gray-400 text-xs mb-2">Selecione um item para refinar (requer pergaminho de refino):</p>
          <div className="space-y-1 max-h-[40vh] overflow-y-auto mb-3">
            {refineableItems.map((item) => (
              <button key={item.id} onClick={() => setSelectedItem(item)}
                className={`w-full metin-panel p-2 text-left text-sm border ${selectedItem?.id === item.id ? 'border-metin-gold' : 'border-metin-border'}`}>
                <span style={{ color: getRarityColor(item.rarity) }}>
                  {item.refinement > 0 && `+${item.refinement} `}{item.name}
                </span>
              </button>
            ))}
            {refineableItems.length === 0 && <p className="text-gray-600 text-xs">Nenhum item refinavel.</p>}
          </div>
          {selectedItem && (
            <button onClick={handleRefine} className="metin-btn-gold w-full">
              Refinar +{(selectedItem.refinement || 0) + 1}
            </button>
          )}
        </div>
      )}

      {tab === 'bonus' && (
        <div>
          <p className="text-gray-400 text-xs mb-2">Selecione um equipamento para adicionar bonus:</p>
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
                <div className="text-xs mb-1" style={{ color: getRarityColor(recipe.result_item.rarity) }}>
                  Resultado: {recipe.result_item.name} x{recipe.result_quantity}
                </div>
              )}
              <div className="text-xs text-gray-500 mb-2">
                {recipe.materials?.map((m) => `${m.item_name} x${m.quantity}`).join(', ')}
              </div>
              <button onClick={() => handleCraft(recipe.id)} className="metin-btn metin-btn-sm">Craftar</button>
            </div>
          ))}
          {recipes.length === 0 && <p className="text-gray-600 text-xs">Nenhuma receita disponivel.</p>}
        </div>
      )}
    </div>
  );
}
