import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closePanel, addNotification } from '../../store/slices/uiSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import { formatNumber } from '../../utils/helpers';
import { Metin2Window, Metin2Button } from '../metin2ui';
import * as api from '../../services/api';

export default function HealerPanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  if (!character) return null;

  const ds = character.derived_stats || {};
  const cost = character.level * 10;
  const needsHeal = character.hp < (ds.max_hp || character.max_hp) ||
    character.mp < (ds.max_mp || character.max_mp) ||
    character.stamina < (ds.max_stamina || character.max_stamina);

  const handleHeal = async () => {
    try {
      const res = await api.healCharacter(character.id);
      if (res.success) {
        dispatch(addNotification({ type: 'success', message: res.data.message }));
        dispatch(loadCharacter(character.id));
      }
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: e.response?.data?.error || 'Erro ao curar' }));
    }
  };

  return (
    <Metin2Window title="Curandeiro" onClose={() => dispatch(closePanel())} variant="gold" style={{ width: 320 }}>
      <div className="metin-panel p-3 mb-3 text-sm text-gray-300 italic text-center">
        "Deixe-me restaurar suas energias, guerreiro."
      </div>

      <div className="space-y-1 mb-3 text-sm">
        <div className="stat-row">
          <span className="stat-label">HP</span>
          <span className="text-metin-red">{character.hp}/{ds.max_hp || character.max_hp}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">MP</span>
          <span className="text-metin-blue">{character.mp}/{ds.max_mp || character.max_mp}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Stamina</span>
          <span className="text-metin-stamina">{character.stamina}/{ds.max_stamina || character.max_stamina}</span>
        </div>
        <div className="divider" />
        <div className="stat-row">
          <span className="stat-label">Custo</span>
          <span className="m2-text-gold">{formatNumber(cost)} ouro</span>
        </div>
      </div>

      <Metin2Button onClick={handleHeal} disabled={!needsHeal || character.gold < cost} style={{ width: '100%' }}>
        {!needsHeal ? 'Ja esta curado' : 'Curar Completamente'}
      </Metin2Button>
    </Metin2Window>
  );
}
