import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closePanel, addNotification } from '../../store/slices/uiSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import { fetchInventory } from '../../store/slices/inventorySlice';
import { getRarityColor, formatNumber } from '../../utils/helpers';
import * as api from '../../services/api';

export default function ShopPanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const npc = useSelector((s) => s.ui.activeNpc);
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (npc?.id) {
      api.getShopItems(npc.id).then((res) => {
        if (res.success) setShopData(res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [npc?.id]);

  const handleBuy = async (item) => {
    if (!character) return;
    try {
      const res = await api.buyItem(character.id, npc.id, item.id, 1);
      if (res.success) {
        dispatch(addNotification({ type: 'loot', message: `Comprou ${item.name}` }));
        dispatch(loadCharacter(character.id));
        dispatch(fetchInventory(character.id));
      }
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: e.response?.data?.error || 'Erro ao comprar' }));
    }
  };

  return (
    <div className="metin-panel-gold p-4 w-[400px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="panel-title !mb-0 !pb-0 !border-0">Loja - {npc?.name}</h2>
        <button onClick={() => dispatch(closePanel())} className="text-gray-500 hover:text-metin-gold">X</button>
      </div>
      <div className="divider-gold" />

      <div className="text-xs text-metin-gold mb-2">Ouro: {formatNumber(character?.gold || 0)}</div>

      {loading ? (
        <div className="text-gray-500 text-sm text-center py-4">Carregando...</div>
      ) : (
        <div className="space-y-1 max-h-[60vh] overflow-y-auto">
          {(shopData?.items || []).map((item) => (
            <div key={item.id} className="metin-panel p-2 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medieval truncate" style={{ color: getRarityColor(item.rarity) }}>
                  {item.name}
                </div>
                <div className="text-xs text-gray-500">Lv.{item.level_required} | {item.type}</div>
              </div>
              <div className="text-right">
                <div className="text-metin-gold text-xs">{formatNumber(item.buy_price)}</div>
                <button onClick={() => handleBuy(item)}
                  disabled={character?.gold < item.buy_price}
                  className="metin-btn metin-btn-sm text-xs disabled:opacity-50 mt-1">
                  Comprar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
