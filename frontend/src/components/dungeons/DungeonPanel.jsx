import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closePanel } from '../../store/slices/uiSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import {
  fetchDungeons,
  fetchDungeonDetails,
  startDungeonRun,
  fetchCurrentRun,
  advanceFloor,
  abandonRun,
  clearDungeonError,
  clearSelectedDungeon,
} from '../../store/slices/dungeonSlice';
import { formatNumber } from '../../utils/helpers';

export default function DungeonPanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const { list, selectedDungeon, currentRun, loading, error } = useSelector((s) => s.dungeons);
  const [viewingRewards, setViewingRewards] = useState(false);

  useEffect(() => {
    dispatch(fetchDungeons());
    if (character?.id) {
      dispatch(fetchCurrentRun(character.id));
    }
  }, [dispatch, character?.id]);

  useEffect(() => {
    if (currentRun?.completed) {
      setViewingRewards(true);
    }
  }, [currentRun?.completed]);

  const handleClose = () => {
    dispatch(clearDungeonError());
    dispatch(clearSelectedDungeon());
    dispatch(closePanel());
  };

  const handleSelectDungeon = (dungeonId) => {
    dispatch(fetchDungeonDetails(dungeonId));
  };

  const handleBack = () => {
    dispatch(clearDungeonError());
    dispatch(clearSelectedDungeon());
  };

  const handleEnter = () => {
    if (!character || !selectedDungeon) return;
    dispatch(startDungeonRun({ characterId: character.id, dungeonId: selectedDungeon.id })).then((res) => {
      if (!res.error) {
        dispatch(loadCharacter(character.id));
      }
    });
  };

  const handleAdvance = () => {
    if (!currentRun) return;
    dispatch(advanceFloor({ characterId: character.id })).then((res) => {
      if (!res.error) {
        dispatch(loadCharacter(character.id));
      }
    });
  };

  const handleAbandon = () => {
    if (!currentRun) return;
    dispatch(abandonRun({ characterId: character.id })).then((res) => {
      if (!res.error) {
        dispatch(loadCharacter(character.id));
        setViewingRewards(false);
      }
    });
  };

  const handleCloseRewards = () => {
    setViewingRewards(false);
    dispatch(fetchCurrentRun(character.id));
  };

  if (!character) return null;

  const canEnter =
    selectedDungeon &&
    character.level >= selectedDungeon.level_required &&
    character.gold >= selectedDungeon.entry_cost_gold;

  // Active run view
  if (currentRun && currentRun.status !== 'abandoned') {
    const run = currentRun;
    const dungeon = run.dungeon || {};
    const floor = run.floor || {};
    const totalFloors = dungeon.total_floors || 1;
    const currentFloor = run.current_floor || 1;
    const progress = ((currentFloor - 1) / totalFloors) * 100;
    const results = run.results || {};

    return (
      <div className="metin-panel-gold p-0 w-[460px] select-none">
        {/* Header */}
        <div className="px-4 pt-3 pb-2 flex justify-between items-start">
          <div>
            <h2 className="text-metin-gold font-medieval text-lg tracking-wide">Masmorras</h2>
            <span className="text-gray-400 text-xs">{dungeon.name || 'Masmorra'}</span>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-metin-gold transition-colors text-sm mt-1"
            title="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="divider-gold mx-4" />

        {/* Rewards summary */}
        {run.completed && viewingRewards && (
          <div className="px-4 py-3">
            <h3 className="text-metin-gold font-medieval text-sm tracking-wider uppercase mb-3 text-center">
              Masmorra Concluida!
            </h3>
            <div className="metin-panel p-3 space-y-2">
              <div className="stat-row">
                <span className="stat-label text-xs">Andares Limpos</span>
                <span className="stat-value text-xs text-green-400">{results.floors_cleared || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label text-xs">EXP Total</span>
                <span className="stat-value text-xs text-blue-400">{formatNumber(results.total_exp || 0)}</span>
              </div>
              {run.rewards && (
                <>
                  {run.rewards.gold > 0 && (
                    <div className="stat-row">
                      <span className="stat-label text-xs">Ouro</span>
                      <span className="stat-value text-xs text-metin-gold">{formatNumber(run.rewards.gold)}</span>
                    </div>
                  )}
                  {run.rewards.exp > 0 && (
                    <div className="stat-row">
                      <span className="stat-label text-xs">EXP Bonus</span>
                      <span className="stat-value text-xs text-blue-300">{formatNumber(run.rewards.exp)}</span>
                    </div>
                  )}
                </>
              )}
              {results.loot && results.loot.length > 0 && (
                <div className="mt-2">
                  <span className="text-gray-500 text-xs">Itens:</span>
                  <div className="mt-1 space-y-1">
                    {results.loot.map((item, idx) => (
                      <div key={idx} className="text-xs text-gray-300 pl-2">
                        • {item.name || item} {item.quantity > 1 && <span className="text-gray-500">x{item.quantity}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3 flex justify-center">
              <button onClick={handleCloseRewards} className="metin-btn metin-btn-sm">
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Active floor view */}
        {(!run.completed || !viewingRewards) && (
          <div className="px-4 py-3 space-y-3">
            {/* Floor progress */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-400 text-xs">Andar</span>
                <span className="text-metin-gold text-xs font-mono">
                  {currentFloor} / {totalFloors}
                </span>
              </div>
              <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-gray-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-700 to-metin-gold transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="divider mx-0" />

            {/* Floor info */}
            <div className="metin-panel p-3">
              <h4 className="text-metin-gold font-medieval text-xs tracking-wider uppercase mb-2">
                Andar {currentFloor}
              </h4>
              {floor.objective_type && (
                <div className="stat-row">
                  <span className="stat-label text-xs">Objetivo</span>
                  <span className="stat-value text-xs text-gray-300">{floor.objective_type}</span>
                </div>
              )}
              {floor.mobs && (
                <div className="stat-row">
                  <span className="stat-label text-xs">Monstros</span>
                  <span className="stat-value text-xs text-red-400">{floor.mobs}</span>
                </div>
              )}
              {floor.boss_mob_id && (
                <div className="stat-row">
                  <span className="stat-label text-xs">Boss</span>
                  <span className="stat-value text-xs text-orange-400">#{floor.boss_mob_id}</span>
                </div>
              )}
            </div>

            {/* Run stats */}
            {results.floors_cleared > 0 && (
              <div className="text-xs text-gray-500 text-center">
                {results.floors_cleared} andar(es) limpo(s) · {formatNumber(results.total_exp || 0)} EXP
              </div>
            )}

            {error && (
              <div className="text-xs text-red-400 text-center bg-red-900/20 rounded px-2 py-1">{error}</div>
            )}

            {/* Actions */}
            <div className="flex justify-between gap-2 pt-1">
              <button
                onClick={handleAbandon}
                disabled={loading}
                className="metin-btn metin-btn-sm !bg-red-900/60 !border-red-700 !text-red-300 hover:!bg-red-800/80 disabled:opacity-40"
              >
                Abandonar
              </button>
              <button
                onClick={handleAdvance}
                disabled={loading}
                className="metin-btn metin-btn-sm disabled:opacity-40"
              >
                {loading ? 'Avancando...' : 'Avancar Andar'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dungeon list / detail view
  return (
    <div className="metin-panel-gold p-0 w-[460px] select-none">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex justify-between items-start">
        <div>
          <h2 className="text-metin-gold font-medieval text-lg tracking-wide">Masmorras</h2>
          {selectedDungeon && (
            <button onClick={handleBack} className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
              ← Voltar
            </button>
          )}
        </div>
        <button
          onClick={handleClose}
          className="text-gray-600 hover:text-metin-gold transition-colors text-sm mt-1"
          title="Fechar"
        >
          ✕
        </button>
      </div>

      <div className="divider-gold mx-4" />

      {error && (
        <div className="mx-4 mt-2 text-xs text-red-400 text-center bg-red-900/20 rounded px-2 py-1">{error}</div>
      )}

      {/* Dungeon detail */}
      {selectedDungeon ? (
        <div className="px-4 py-3 space-y-3">
          <div>
            <h3 className="text-metin-gold font-medieval text-sm">{selectedDungeon.name}</h3>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">{selectedDungeon.description}</p>
          </div>

          <div className="metin-panel p-3 space-y-1">
            <div className="stat-row">
              <span className="stat-label text-xs">Nivel Necessario</span>
              <span
                className={`stat-value text-xs ${
                  character.level >= selectedDungeon.level_required ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {selectedDungeon.level_required}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label text-xs">Total de Andares</span>
              <span className="stat-value text-xs text-gray-300">{selectedDungeon.total_floors}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label text-xs">Custo de Entrada</span>
              <span
                className={`stat-value text-xs ${
                  character.gold >= selectedDungeon.entry_cost_gold ? 'text-yellow-400' : 'text-red-400'
                }`}
              >
                {formatNumber(selectedDungeon.entry_cost_gold)} ouro
              </span>
            </div>
          </div>

          {/* Floors preview */}
          {selectedDungeon.floors && selectedDungeon.floors.length > 0 && (
            <div>
              <h4 className="text-metin-gold font-medieval text-xs tracking-wider uppercase mb-2">Andares</h4>
              <div className="space-y-1 max-h-[25vh] overflow-y-auto pr-1 scrollbar-thin">
                {selectedDungeon.floors.map((f) => (
                  <div key={f.floor_number} className="metin-panel px-3 py-2 flex items-center justify-between">
                    <span className="text-gray-400 text-xs font-mono">#{f.floor_number}</span>
                    <div className="flex items-center gap-3 text-xs">
                      {f.mobs && <span className="text-gray-500">{f.mobs} mobs</span>}
                      {f.boss_mob_id && <span className="text-orange-400">Boss</span>}
                      {f.objective_type && <span className="text-gray-600">{f.objective_type}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              onClick={handleEnter}
              disabled={!canEnter || loading}
              className="metin-btn metin-btn-sm disabled:opacity-40"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </div>
      ) : (
        /* Dungeon list */
        <div className="px-4 py-2">
          {loading && list.length === 0 && (
            <div className="text-gray-500 text-xs text-center py-6">Carregando masmorras...</div>
          )}

          {!loading && list.length === 0 && (
            <div className="text-gray-500 text-xs text-center py-6">Nenhuma masmorra disponivel.</div>
          )}

          <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin">
            {list.map((dungeon) => {
              const levelOk = character.level >= dungeon.level_required;
              return (
                <button
                  key={dungeon.id}
                  onClick={() => handleSelectDungeon(dungeon.id)}
                  className="w-full text-left metin-panel px-3 py-2.5 hover:border-amber-700/60 transition-colors group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-200 text-sm group-hover:text-metin-gold transition-colors truncate">
                          {dungeon.name}
                        </span>
                        <span className={`text-[10px] ${levelOk ? 'text-gray-600' : 'text-red-500'}`}>
                          Lv.{dungeon.level_required}
                        </span>
                      </div>
                      {dungeon.description && (
                        <p className="text-gray-600 text-[10px] mt-0.5 truncate">{dungeon.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end ml-3 shrink-0">
                      <span className="text-gray-500 text-[10px]">{dungeon.total_floors} andares</span>
                      <span className="text-yellow-400 text-[10px]">{formatNumber(dungeon.entry_cost_gold)} ouro</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
