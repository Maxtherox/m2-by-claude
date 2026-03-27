import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAvailableQuests,
  fetchActiveQuests,
  fetchCompletedQuests,
  acceptQuest,
  turnInQuest,
  abandonQuest,
  clearLastReward,
} from '../../store/slices/questSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import { closePanel } from '../../store/slices/uiSlice';

const QUEST_TYPE_STYLES = {
  main: { label: 'Principal', color: 'text-amber-400' },
  side: { label: 'Secundaria', color: 'text-blue-400' },
  daily: { label: 'Diaria', color: 'text-green-400' },
  repeatable: { label: 'Repetivel', color: 'text-purple-400' },
};

const TABS = [
  { key: 'available', label: 'Disponiveis' },
  { key: 'active', label: 'Ativas' },
  { key: 'completed', label: 'Completadas' },
];

export default function QuestPanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const { available, active, completed, loading, lastReward } = useSelector((s) => s.quests);

  const [activeTab, setActiveTab] = useState('available');
  const [selectedQuestId, setSelectedQuestId] = useState(null);

  useEffect(() => {
    if (character?.id) {
      dispatch(fetchAvailableQuests(character.id));
      dispatch(fetchActiveQuests(character.id));
      dispatch(fetchCompletedQuests(character.id));
    }
  }, [dispatch, character?.id]);

  // Reset selection when switching tabs
  useEffect(() => {
    setSelectedQuestId(null);
  }, [activeTab]);

  const questList =
    activeTab === 'available'
      ? Array.isArray(available) ? available : []
      : activeTab === 'active'
      ? Array.isArray(active) ? active : []
      : Array.isArray(completed) ? completed : [];

  const selectedQuest = selectedQuestId
    ? questList.find((q) => q.id === selectedQuestId)
    : null;

  const handleAccept = async () => {
    if (!selectedQuest || !character?.id) return;
    try {
      await dispatch(acceptQuest({ charId: character.id, questId: selectedQuest.id })).unwrap();
      setSelectedQuestId(null);
      setActiveTab('active');
    } catch (_) { /* error handled by slice */ }
  };

  const handleTurnIn = async () => {
    if (!selectedQuest || !character?.id) return;
    try {
      await dispatch(turnInQuest({ charId: character.id, questId: selectedQuest.id })).unwrap();
      dispatch(loadCharacter(character.id));
      dispatch(fetchActiveQuests(character.id));
      dispatch(fetchCompletedQuests(character.id));
      dispatch(fetchAvailableQuests(character.id));
      setSelectedQuestId(null);
    } catch (_) { /* error handled by slice */ }
  };

  const handleAbandon = async () => {
    if (!selectedQuest || !character?.id) return;
    try {
      await dispatch(abandonQuest({ charId: character.id, questId: selectedQuest.id })).unwrap();
      dispatch(fetchAvailableQuests(character.id));
      setSelectedQuestId(null);
    } catch (_) { /* error handled by slice */ }
  };

  const handleCloseReward = () => {
    dispatch(clearLastReward());
  };

  const typeStyle = (type) => QUEST_TYPE_STYLES[type] || { label: type, color: 'text-gray-400' };

  return (
    <div className="metin-panel-gold p-0 w-[500px] select-none">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex justify-between items-start">
        <h2 className="text-metin-gold font-medieval text-lg tracking-wide">Missoes</h2>
        <button onClick={() => dispatch(closePanel())} className="text-gray-600 hover:text-metin-gold text-sm mt-1">✕</button>
      </div>

      <div className="divider-gold mx-4" />

      {/* Tabs */}
      <div className="px-4 pt-2 pb-1 flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`metin-btn metin-btn-sm text-xs ${
              activeTab === tab.key
                ? 'bg-metin-gold/20 border-metin-border-gold text-metin-gold'
                : ''
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="divider-gold mx-4" />

      {/* Reward overlay */}
      {lastReward && (
        <div className="mx-4 mt-2 mb-2 p-3 bg-amber-900/30 border border-metin-border-gold rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-metin-gold font-medieval text-sm">Recompensas Recebidas!</span>
            <button onClick={handleCloseReward} className="text-gray-500 hover:text-metin-gold text-xs">✕</button>
          </div>
          <div className="space-y-1 text-xs">
            {lastReward.exp > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Experiencia</span>
                <span className="text-metin-cyan">+{lastReward.exp} EXP</span>
              </div>
            )}
            {lastReward.gold > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Ouro</span>
                <span className="text-metin-gold">+{lastReward.gold} Gold</span>
              </div>
            )}
            {lastReward.honor > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Honra</span>
                <span className="text-amber-500">+{lastReward.honor} Honra</span>
              </div>
            )}
            {lastReward.items && lastReward.items.length > 0 && (
              <div className="pt-1">
                <span className="text-gray-500 text-[10px]">Itens:</span>
                {lastReward.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between pl-2">
                    <span className="text-gray-300">{item.item_name}</span>
                    <span className="text-gray-400">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500 text-xs py-4">Carregando...</div>
      )}

      {/* Content */}
      <div className="flex" style={{ minHeight: '320px' }}>
        {/* Quest list */}
        <div className="w-[200px] border-r border-metin-border/30 overflow-y-auto max-h-[50vh] p-2 space-y-1">
          {questList.length === 0 && !loading && (
            <div className="text-gray-600 text-xs text-center mt-8">Nenhuma missao</div>
          )}
          {questList.map((quest) => {
            const ts = typeStyle(quest.type);
            const isSelected = selectedQuestId === quest.id;
            const canTurnIn = activeTab === 'active' && quest.status === 'completed';

            return (
              <button
                key={quest.id}
                onClick={() => setSelectedQuestId(quest.id)}
                className={`w-full text-left px-2 py-1.5 rounded transition-all text-xs ${
                  isSelected
                    ? 'bg-metin-gold/10 border border-metin-border-gold'
                    : 'hover:bg-metin-dark-lighter border border-transparent'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-medieval ${isSelected ? 'text-metin-gold' : 'text-gray-300'}`}>
                    {quest.name}
                  </span>
                  {canTurnIn && (
                    <span className="text-[10px] text-green-400">!</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] ${ts.color}`}>{ts.label}</span>
                  {quest.level_required > 0 && (
                    <span className="text-[10px] text-gray-600">Lv.{quest.level_required}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="flex-1 p-3 overflow-y-auto max-h-[50vh]">
          {!selectedQuest ? (
            <div className="text-gray-600 text-xs text-center mt-10">Selecione uma missao</div>
          ) : (
            <div className="space-y-3">
              {/* Quest header */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-metin-gold font-medieval text-sm">{selectedQuest.name}</span>
                  <span className={`text-[10px] ${typeStyle(selectedQuest.type).color}`}>
                    [{typeStyle(selectedQuest.type).label}]
                  </span>
                </div>
                {selectedQuest.level_required > 0 && (
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    Nivel requerido: {selectedQuest.level_required}
                    {selectedQuest.honor_required > 0 && ` | Honra requerida: ${selectedQuest.honor_required}`}
                  </div>
                )}
                <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">{selectedQuest.description}</p>
              </div>

              <div className="divider-gold" />

              {/* Objectives */}
              {selectedQuest.objectives && selectedQuest.objectives.length > 0 && (
                <div>
                  <span className="text-gray-500 text-[10px] uppercase tracking-wider">Objetivos</span>
                  <div className="mt-1 space-y-1">
                    {selectedQuest.objectives.map((obj) => {
                      const isActive = activeTab === 'active';
                      const current = isActive ? (obj.current_amount || 0) : 0;
                      const required = obj.required_amount || 1;
                      const complete = isActive ? obj.is_complete : false;

                      return (
                        <div key={obj.id} className="text-[11px]">
                          <div className="flex justify-between items-center">
                            <span className={complete ? 'text-green-400 line-through' : 'text-gray-300'}>
                              {obj.description || `${obj.type}: ${obj.target_name}`}
                            </span>
                            {isActive && (
                              <span className={`text-[10px] font-mono ${complete ? 'text-green-400' : 'text-gray-500'}`}>
                                {current}/{required}
                              </span>
                            )}
                          </div>
                          {isActive && !complete && (
                            <div className="w-full h-1 bg-metin-dark-lighter rounded mt-0.5 overflow-hidden">
                              <div
                                className="h-full bg-metin-gold/60 rounded"
                                style={{ width: `${Math.min((current / required) * 100, 100)}%` }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="divider-gold" />

              {/* Rewards info */}
              <div>
                <span className="text-gray-500 text-[10px] uppercase tracking-wider">Recompensas</span>
                <div className="mt-1 grid grid-cols-2 gap-1 text-[11px]">
                  {selectedQuest.reward_exp > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">EXP</span>
                      <span className="text-metin-cyan">{selectedQuest.reward_exp}</span>
                    </div>
                  )}
                  {selectedQuest.reward_gold > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ouro</span>
                      <span className="text-metin-gold">{selectedQuest.reward_gold}</span>
                    </div>
                  )}
                  {selectedQuest.reward_honor > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Honra</span>
                      <span className="text-amber-500">{selectedQuest.reward_honor}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="divider-gold" />

              {/* Action buttons */}
              <div className="pt-1 space-y-1.5">
                {activeTab === 'available' && (
                  <button
                    onClick={handleAccept}
                    disabled={loading || (character?.level < selectedQuest.level_required)}
                    className="metin-btn metin-btn-sm w-full text-xs disabled:opacity-40"
                  >
                    Aceitar
                  </button>
                )}

                {activeTab === 'active' && selectedQuest.status === 'completed' && (
                  <button
                    onClick={handleTurnIn}
                    disabled={loading}
                    className="metin-btn metin-btn-sm w-full text-xs !bg-green-900/50 !border-green-700/50 hover:!bg-green-800/50 disabled:opacity-40"
                  >
                    Entregar
                  </button>
                )}

                {activeTab === 'active' && (
                  <button
                    onClick={handleAbandon}
                    disabled={loading}
                    className="metin-btn metin-btn-sm w-full text-xs !bg-red-900/30 !border-red-700/40 hover:!bg-red-800/40 text-red-400 disabled:opacity-40"
                  >
                    Abandonar
                  </button>
                )}

                {activeTab === 'available' && character?.level < selectedQuest.level_required && (
                  <div className="text-[10px] text-red-400 text-center">
                    Requer nivel {selectedQuest.level_required}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
