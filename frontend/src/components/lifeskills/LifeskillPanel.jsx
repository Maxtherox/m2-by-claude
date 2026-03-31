import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closePanel, addNotification } from '../../store/slices/uiSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import { fetchInventory } from '../../store/slices/inventorySlice';
import ProgressBar from '../common/ProgressBar';
import * as api from '../../services/api';
import { GiMineWagon, GiWoodAxe, GiWheat } from 'react-icons/gi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { Metin2Window } from '../metin2ui';

const SKILL_DEFS = [
  { key: 'mining',      label: 'Mineração',   Icon: GiMineWagon, resourceType: 'mining' },
  { key: 'woodcutting', label: 'Lenhador',    Icon: GiWoodAxe,  resourceType: 'woodcutting' },
  { key: 'farming',     label: 'Agricultura', Icon: GiWheat,    resourceType: 'farming' },
];

export default function LifeskillPanel() {
  const dispatch = useDispatch();
  const character  = useSelector((s) => s.character.data);
  const areaDetails = useSelector((s) => s.game.areaDetails);
  const [lifeskills, setLifeskills] = useState(null);
  const [gathering, setGathering] = useState(false);

  // Tipos de recursos disponíveis na área atual
  const areaResources = areaDetails?.resources || [];
  const availableTypes = new Set(areaResources.map((r) => r.resource_type || r.type));

  const loadLS = () => {
    if (character?.id) {
      api.getLifeskills(character.id)
        .then((res) => { if (res.success) setLifeskills(res.data); })
        .catch(() => {});
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

  const areaName = areaDetails?.name || 'esta área';

  return (
    <Metin2Window title="Profissões" onClose={() => dispatch(closePanel())} variant="board" style={{ width: 350 }}>

      {/* Área atual */}
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
        <FaMapMarkerAlt className="text-metin-gold" />
        <span>{areaName}</span>
        {availableTypes.size > 0 ? (
          <span className="text-metin-green ml-1">
            ({[...availableTypes].join(', ')})
          </span>
        ) : (
          <span className="text-red-500 ml-1">(sem recursos)</span>
        )}
      </div>

      <div className="space-y-3">
        {SKILL_DEFS.map((sk) => {
          const data = lifeskills?.[sk.key];
          const hasResource = availableTypes.has(sk.resourceType);
          const lowStamina = (character?.stamina || 0) < 3;

          return (
            <div key={sk.key} className={`metin-panel p-3 ${!hasResource ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <sk.Icon className="text-metin-gold text-lg" />
                  <span className="font-medieval text-metin-gold text-sm">{sk.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-400">Lv.{data?.level || 1}</span>
                  {!hasResource && (
                    <div className="text-sm text-red-500">Indisponível</div>
                  )}
                </div>
              </div>
              {data && (
                <ProgressBar type="exp" current={data.exp} max={data.exp_for_next || 100} small />
              )}
              <button
                onClick={() => handleGather(sk.key)}
                disabled={gathering || lowStamina || !hasResource}
                title={!hasResource ? `Sem ${sk.label} em ${areaName}` : lowStamina ? 'Stamina insuficiente' : ''}
                className="metin-btn metin-btn-sm w-full mt-2 disabled:opacity-40"
              >
                {gathering ? 'Coletando...' : `Coletar (-3 ⚡)`}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-sm text-gray-600 text-center">
        Stamina: {character?.stamina ?? 0} / {character?.max_stamina ?? 100}
      </div>
    </Metin2Window>
  );
}
