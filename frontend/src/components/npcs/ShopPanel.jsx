import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closePanel, addNotification } from '../../store/slices/uiSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import { fetchInventory } from '../../store/slices/inventorySlice';
import { getRarityColor, formatNumber } from '../../utils/helpers';
import { Metin2Window, Metin2Button } from '../metin2ui';
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
    <Metin2Window title={`Loja - ${npc?.name || ''}`} onClose={() => dispatch(closePanel())} variant="gold" style={{ width: 400 }}>
      <div className="text-sm m2-text-gold mb-2">Ouro: {formatNumber(character?.gold || 0)}</div>

      {loading ? (
        <div className="text-gray-500 text-sm text-center py-4">Carregando...</div>
      ) : (
        <div className="space-y-1 max-h-[60vh] overflow-y-auto">
          {(shopData?.items || []).map((item) => (
            <div key={item.id} className="metin-panel p-2 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate" style={{ color: getRarityColor(item.rarity) }}>
                  {item.name}
                </div>
                <div className="text-sm text-gray-500">Lv.{item.level_required} | {item.type}</div>
              </div>
              <div className="text-right">
                <div className="m2-text-gold text-sm">{formatNumber(item.buy_price)}</div>
                <Metin2Button onClick={() => handleBuy(item)} disabled={character?.gold < item.buy_price} style={{ fontSize: 13, padding: '2px 8px', marginTop: 4 }}>
                  Comprar
                </Metin2Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Metin2Window>
  );
}
