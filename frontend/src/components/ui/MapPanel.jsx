import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAreas, fetchAreaDetails } from '../../store/slices/gameSlice';
import { closePanel, addNotification, setActiveNpc, setActivePanel } from '../../store/slices/uiSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import * as api from '../../services/api';

export default function MapPanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const { areas, areaDetails } = useSelector((s) => s.game);

  useEffect(() => {
    dispatch(fetchAreas());
    if (character?.current_area_id) {
      dispatch(fetchAreaDetails(character.current_area_id));
    }
  }, [dispatch, character?.current_area_id]);

  const handleTravel = async (areaId) => {
    if (!character) return;
    try {
      await api.saveCharacter(character.id, { current_area_id: areaId });
      dispatch(loadCharacter(character.id));
      dispatch(fetchAreaDetails(areaId));
      dispatch(addNotification({ type: 'info', message: 'Viajou para nova area' }));
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: 'Erro ao viajar' }));
    }
  };

  const handleNpc = (npc) => {
    dispatch(setActiveNpc(npc));
  };

  const handleCombat = () => {
    dispatch(setActivePanel('combat'));
  };

  const currentArea = (Array.isArray(areas) ? areas : (areas?.data || [])).find(
    (a) => a.id === character?.current_area_id
  );

  return (
    <div className="metin-panel-gold p-4 w-[450px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="panel-title !mb-0 !pb-0 !border-0">Mapa</h2>
        <button onClick={() => dispatch(closePanel())} className="text-gray-500 hover:text-metin-gold">X</button>
      </div>
      <div className="divider-gold" />

      {/* Current area info */}
      {currentArea && (
        <div className="metin-panel p-3 mb-3">
          <div className="text-metin-gold font-medieval">{currentArea.name}</div>
          <div className="text-xs text-gray-400">{currentArea.description}</div>
          <div className="text-xs text-gray-500 mt-1">
            Nivel: {currentArea.level_min}-{currentArea.level_max} | Tipo: {currentArea.type}
          </div>
        </div>
      )}

      {/* Area NPCs & Mobs */}
      {areaDetails && (
        <div className="mb-3">
          {areaDetails.npcs?.length > 0 && (
            <div className="mb-2">
              <h3 className="text-xs text-metin-gold font-medieval mb-1">NPCs</h3>
              <div className="flex gap-1 flex-wrap">
                {areaDetails.npcs.map((npc) => (
                  <button key={npc.id} onClick={() => handleNpc(npc)}
                    className="metin-btn metin-btn-sm text-xs">
                    {npc.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {areaDetails.mobs?.length > 0 && (
            <div>
              <h3 className="text-xs text-metin-gold font-medieval mb-1">Monstros ({areaDetails.mobs.length})</h3>
              <button onClick={handleCombat} className="metin-btn metin-btn-sm text-xs">
                Entrar em Combate
              </button>
            </div>
          )}
        </div>
      )}

      <div className="divider" />
      <h3 className="text-xs text-metin-gold font-medieval mb-2">Areas Disponiveis</h3>

      <div className="grid grid-cols-2 gap-2 max-h-[40vh] overflow-y-auto">
        {(Array.isArray(areas) ? areas : (areas?.data || [])).map((area) => {
          const isCurrent = area.id === character?.current_area_id;
          return (
            <button key={area.id}
              onClick={() => !isCurrent && handleTravel(area.id)}
              disabled={isCurrent}
              className={`metin-panel p-2 text-left text-xs border rounded-sm transition-colors
                ${isCurrent ? 'border-metin-gold bg-metin-gold/10' : 'border-metin-border hover:border-metin-border-gold'}`}>
              <div className="font-medieval text-sm text-gray-200">{area.name}</div>
              <div className="text-gray-500">
                Lv.{area.level_min}-{area.level_max}
              </div>
              <div className={`text-xs ${area.type === 'village' ? 'text-metin-green' : 'text-metin-red'}`}>
                {area.type === 'village' ? 'Vila' : 'Aventura'}
              </div>
              {isCurrent && <div className="text-metin-gold text-xs mt-1">Voce esta aqui</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
