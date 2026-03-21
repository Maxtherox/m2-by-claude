import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closePanel, addNotification } from '../../store/slices/uiSlice';
import { fetchInventory } from '../../store/slices/inventorySlice';
import { getRarityColor } from '../../utils/helpers';
import * as api from '../../services/api';

export default function StoragePanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const { items } = useSelector((s) => s.inventory);
  const [storage, setStorage] = useState([]);
  const [tab, setTab] = useState('storage');

  const loadStorage = () => {
    if (character?.id) {
      api.getStorage(character.id).then((res) => {
        if (res.success) setStorage(res.data);
      }).catch(() => {});
    }
  };

  useEffect(() => { loadStorage(); }, [character?.id]);

  const handleDeposit = async (item) => {
    try {
      await api.depositItem(character.id, item.id, 1);
      dispatch(addNotification({ type: 'success', message: 'Item depositado' }));
      dispatch(fetchInventory(character.id));
      loadStorage();
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: e.response?.data?.error || 'Erro' }));
    }
  };

  const handleWithdraw = async (storageItem) => {
    try {
      await api.withdrawItem(character.id, storageItem.id, 1);
      dispatch(addNotification({ type: 'success', message: 'Item retirado' }));
      dispatch(fetchInventory(character.id));
      loadStorage();
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: e.response?.data?.error || 'Erro' }));
    }
  };

  const inventoryItems = items.filter((i) => !i.equipped);

  return (
    <div className="metin-panel-gold p-4 w-[400px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="panel-title !mb-0 !pb-0 !border-0">Armazem</h2>
        <button onClick={() => dispatch(closePanel())} className="text-gray-500 hover:text-metin-gold">X</button>
      </div>
      <div className="divider-gold" />

      <div className="flex gap-1 mb-3">
        <button onClick={() => setTab('storage')}
          className={`metin-btn metin-btn-sm flex-1 ${tab === 'storage' ? '!bg-metin-gold/20 !border-metin-gold' : ''}`}>
          Armazem ({storage.length})
        </button>
        <button onClick={() => setTab('deposit')}
          className={`metin-btn metin-btn-sm flex-1 ${tab === 'deposit' ? '!bg-metin-gold/20 !border-metin-gold' : ''}`}>
          Depositar
        </button>
      </div>

      <div className="space-y-1 max-h-[50vh] overflow-y-auto">
        {tab === 'storage' && storage.map((item) => (
          <div key={item.id} className="metin-panel p-2 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medieval truncate" style={{ color: getRarityColor(item.rarity) }}>
                {item.refinement > 0 && `+${item.refinement} `}{item.name}
              </div>
              <div className="text-xs text-gray-500">x{item.quantity}</div>
            </div>
            <button onClick={() => handleWithdraw(item)} className="metin-btn metin-btn-sm text-xs">Retirar</button>
          </div>
        ))}
        {tab === 'storage' && storage.length === 0 && <p className="text-gray-600 text-xs text-center py-2">Armazem vazio.</p>}

        {tab === 'deposit' && inventoryItems.map((item) => (
          <div key={item.id} className="metin-panel p-2 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medieval truncate" style={{ color: getRarityColor(item.rarity) }}>
                {item.refinement > 0 && `+${item.refinement} `}{item.name}
              </div>
              <div className="text-xs text-gray-500">x{item.quantity}</div>
            </div>
            <button onClick={() => handleDeposit(item)} className="metin-btn metin-btn-sm text-xs">Depositar</button>
          </div>
        ))}
        {tab === 'deposit' && inventoryItems.length === 0 && <p className="text-gray-600 text-xs text-center py-2">Inventario vazio.</p>}
      </div>
    </div>
  );
}
