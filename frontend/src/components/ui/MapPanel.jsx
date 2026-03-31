import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAreas, fetchAreaDetails } from '../../store/slices/gameSlice';
import { closePanel, addNotification, setActiveNpc, setActivePanel } from '../../store/slices/uiSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import * as api from '../../services/api';
import { Metin2Window, Metin2Box } from '../metin2ui';

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
    <Metin2Window title="Mapa" onClose={() => dispatch(closePanel())} variant="board" style={{ width: 450 }}>

      {/* Current area info */}
      {currentArea && (
        <Metin2Box variant="a" style={{ marginBottom: 12 }}>
          <div className="text-metin-gold font-medieval">{currentArea.name}</div>
          <div className="text-sm text-gray-400">{currentArea.description}</div>
          <div className="text-sm text-gray-500 mt-1">
            Nivel: {currentArea.level_min}-{currentArea.level_max} | Tipo: {currentArea.type}
          </div>
        </Metin2Box>
      )}

      {/* Area NPCs & Mobs */}
      {areaDetails && (
        <Metin2Box variant="a" style={{ marginBottom: 12 }}>
          {areaDetails.npcs?.length > 0 && (
            <div className="mb-2">
              <h3 className="text-sm text-metin-gold font-medieval mb-1">NPCs</h3>
              <div className="flex gap-1 flex-wrap">
                {areaDetails.npcs.map((npc) => (
                  <button key={npc.id} onClick={() => handleNpc(npc)}
                    className="metin-btn metin-btn-sm text-sm">
                    {npc.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {areaDetails.mobs?.length > 0 && (
            <div>
              <h3 className="text-sm text-metin-gold font-medieval mb-1">Monstros ({areaDetails.mobs.length})</h3>
              <button onClick={handleCombat} className="metin-btn metin-btn-sm text-sm">
                Entrar em Combate
              </button>
            </div>
          )}
        </Metin2Box>
      )}

      <h3 className="text-sm text-metin-gold font-medieval mb-2">Areas Disponiveis</h3>

      <div className="grid grid-cols-2 gap-2 max-h-[40vh] overflow-y-auto">
        {(Array.isArray(areas) ? areas : (areas?.data || [])).map((area) => {
          const isCurrent = area.id === character?.current_area_id;
          return (
            <Metin2Box key={area.id} variant="a">
              <button
                onClick={() => !isCurrent && handleTravel(area.id)}
                disabled={isCurrent}
                className="w-full text-left text-sm transition-colors">
                <div className="font-medieval text-sm text-gray-200">{area.name}</div>
                <div className="text-gray-500">
                  Lv.{area.level_min}-{area.level_max}
                </div>
                <div className={`text-sm ${area.type === 'village' ? 'text-metin-green' : 'text-metin-red'}`}>
                  {area.type === 'village' ? 'Vila' : 'Aventura'}
                </div>
                {isCurrent && <div className="text-metin-gold text-sm mt-1">Voce esta aqui</div>}
              </button>
            </Metin2Box>
          );
        })}
      </div>
    </Metin2Window>
  );
}
