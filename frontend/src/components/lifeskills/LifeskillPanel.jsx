import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closePanel, addNotification } from '../../store/slices/uiSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import { fetchInventory } from '../../store/slices/inventorySlice';
import ProgressBar from '../common/ProgressBar';
import * as api from '../../services/api';

export default function LifeskillPanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const [lifeskills, setLifeskills] = useState(null);
  const [gathering, setGathering] = useState(false);

  const loadLS = () => {
    if (character?.id) {
      api.getLifeskills(character.id).then((res) => {
        if (res.success) setLifeskills(res.data);
      }).catch(() => {});
    }
  };

  useEffect(() => { loadLS(); }, [character?.id]);

  const handleGather = async (type) => {
    if (!character || gathering) return;
    setGathering(true);
    try {
      const res = await api.performLifeskill(character.id, type, character.current_area_id);
      if (res.success) {
        const d = res.data;
        let msg = `${type}: `;
        if (d.items_gathered?.length > 0) {
          msg += d.items_gathered.map((i) => `${i.name} x${i.quantity}`).join(', ');
        }
        if (d.leveled_up) msg += ` | Level Up! Lv.${d.new_level}`;
        dispatch(addNotification({ type: 'loot', message: msg }));
        dispatch(loadCharacter(character.id));
        dispatch(fetchInventory(character.id));
        loadLS();
      }
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: e.response?.data?.error || 'Erro' }));
    }
    setGathering(false);
  };

  const skills = [
    { key: 'mining', label: 'Mineracao', icon: '\u26CF\uFE0F' },
    { key: 'woodcutting', label: 'Lenhador', icon: '\uD83E\uDEB5' },
    { key: 'farming', label: 'Agricultura', icon: '\uD83C\uDF3E' },
  ];

  return (
    <div className="metin-panel-gold p-4 w-[350px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="panel-title !mb-0 !pb-0 !border-0">Profissoes</h2>
        <button onClick={() => dispatch(closePanel())} className="text-gray-500 hover:text-metin-gold">X</button>
      </div>
      <div className="divider-gold" />

      <div className="space-y-3">
        {skills.map((sk) => {
          const data = lifeskills?.[sk.key];
          return (
            <div key={sk.key} className="metin-panel p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{sk.icon}</span>
                  <span className="font-medieval text-metin-gold text-sm">{sk.label}</span>
                </div>
                <span className="text-xs text-gray-400">Lv.{data?.level || 1}</span>
              </div>
              {data && (
                <ProgressBar type="exp" current={data.exp} max={data.exp_for_next} small />
              )}
              <button onClick={() => handleGather(sk.key)}
                disabled={gathering || (character?.stamina || 0) < 3}
                className="metin-btn metin-btn-sm w-full mt-2 disabled:opacity-50">
                {gathering ? 'Coletando...' : 'Coletar (-3 Stamina)'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
