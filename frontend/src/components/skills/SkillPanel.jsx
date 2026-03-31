import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchClassSkills,
  fetchCharacterSkills,
  learnSkill,
  upgradeSkill,
  readSkillBook,
  useSpiritStone,
  clearProgressionResult,
} from '../../store/slices/skillSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import { closePanel } from '../../store/slices/uiSlice';
import { Metin2Panel, Metin2TitleBar, Metin2Button, Metin2Box } from '../metin2ui';

const DMG_TYPE_LABELS = {
  physical: { label: 'Fisico', color: 'text-red-400' },
  magical: { label: 'Magico', color: 'text-blue-400' },
  hybrid: { label: 'Hibrido', color: 'text-purple-400' },
  heal: { label: 'Cura', color: 'text-green-400' },
  buff: { label: 'Buff', color: 'text-yellow-400' },
  debuff: { label: 'Debuff', color: 'text-orange-400' },
};

const STAGE_COLORS = {
  NORMAL: 'text-gray-300',
  MASTER: 'text-metin-cyan',
  GRAND_MASTER: 'text-metin-gold',
  PERFECT_MASTER: 'text-amber-300',
};

export default function SkillPanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const { classSkills, characterSkills, lastProgressionResult } = useSelector((s) => s.skills);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (character?.class_id) dispatch(fetchClassSkills(character.class_id));
    if (character?.id) dispatch(fetchCharacterSkills(character.id));
  }, [dispatch, character?.class_id, character?.id]);

  // Handle progression result feedback
  useEffect(() => {
    if (lastProgressionResult) {
      const r = lastProgressionResult;
      const msg = r.success
        ? `Sucesso! ${r.consumed_item_type === 'SKILL_BOOK' ? 'Livro lido' : 'Pedra Espiritual usada'} - ${r.new_stage} ${r.new_progress}`
        : `Falhou: ${r.failure_reason || 'Tentativa sem sucesso'}`;
      setFeedback({ text: msg, type: r.success ? 'success' : 'fail' });
      dispatch(clearProgressionResult());
      // Refresh data
      if (character?.id) {
        dispatch(fetchCharacterSkills(character.id));
        dispatch(loadCharacter(character.id));
      }
      setTimeout(() => setFeedback(null), 4000);
    }
  }, [lastProgressionResult, dispatch, character?.id]);

  const learnedMap = {};
  (Array.isArray(characterSkills) ? characterSkills : []).forEach((s) => {
    learnedMap[s.skill_id] = s;
  });

  const selectedSkill = selectedSkillId
    ? (Array.isArray(classSkills) ? classSkills : []).find((s) => s.id === selectedSkillId)
    : null;
  const selectedLearned = selectedSkillId ? learnedMap[selectedSkillId] : null;

  const refreshAfterAction = useCallback(() => {
    if (character?.id) {
      dispatch(fetchCharacterSkills(character.id));
      dispatch(loadCharacter(character.id));
    }
  }, [dispatch, character?.id]);

  const handleLearn = async () => {
    if (!selectedSkillId || !character?.id) return;
    try {
      await dispatch(learnSkill({ charId: character.id, skillId: selectedSkillId })).unwrap();
      setFeedback({ text: 'Habilidade aprendida!', type: 'success' });
      refreshAfterAction();
    } catch (e) {
      setFeedback({ text: e || 'Erro ao aprender', type: 'fail' });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleUpgrade = async () => {
    if (!selectedSkillId || !character?.id) return;
    try {
      await dispatch(upgradeSkill({ charId: character.id, skillId: selectedSkillId })).unwrap();
      setFeedback({ text: 'Habilidade evoluida!', type: 'success' });
      refreshAfterAction();
    } catch (e) {
      setFeedback({ text: e || 'Erro ao evoluir', type: 'fail' });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleReadBook = () => {
    if (!selectedSkillId || !character?.id) return;
    dispatch(readSkillBook({ charId: character.id, skillId: selectedSkillId }));
  };

  const handleSpiritStone = () => {
    if (!selectedSkillId || !character?.id) return;
    dispatch(useSpiritStone({ charId: character.id, skillId: selectedSkillId }));
  };

  const sp = character?.skill_points || 0;
  const honor = character?.honor || 0;
  const honorRank = character?.honor_rank || 'Neutra';

  return (
    <Metin2Panel variant="board" className="select-none" style={{ width: 440 }}>
      <Metin2TitleBar title="Habilidades" onClose={() => dispatch(closePanel())} />

      {/* Resources bar */}
      <div className="px-4 py-2 flex gap-4 text-sm">
        <span className="text-gray-500">Skill Pts: <span className="text-metin-cyan">{sp}</span></span>
        <span className="text-gray-500">Honra: <span className="text-amber-500">{honor}</span></span>
        <span className="text-gray-500 text-[13px]">({honorRank})</span>
      </div>

      <div className="divider-gold mx-4" />

      {/* Feedback banner */}
      {feedback && (
        <div className={`mx-4 mt-2 px-3 py-1.5 text-sm rounded ${
          feedback.type === 'success' ? 'bg-green-900/40 text-green-300 border border-green-700/50' : 'bg-red-900/40 text-red-300 border border-red-700/50'
        }`}>
          {feedback.text}
        </div>
      )}

      <div className="flex" style={{ minHeight: '350px' }}>
        {/* Skills list */}
        <div className="w-[200px] p-2">
          <Metin2Box variant="a">
            <div className="overflow-y-auto max-h-[55vh] space-y-1">
              {(Array.isArray(classSkills) ? classSkills : []).map((skill) => {
                const learned = learnedMap[skill.id];
                const isSelected = selectedSkillId === skill.id;
                const stage = learned?.progress_stage || 'NORMAL';

                return (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedSkillId(skill.id)}
                    className={`w-full text-left px-2 py-1.5 rounded transition-all text-sm ${
                      isSelected
                        ? 'bg-metin-gold/10 border border-metin-border-gold'
                        : learned
                        ? 'hover:bg-metin-dark-lighter border border-transparent'
                        : 'opacity-50 hover:opacity-70 border border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`font-medieval ${learned ? 'text-metin-gold' : 'text-gray-600'}`}>
                        {skill.name}
                      </span>
                      {learned && (
                        <span className={`text-[13px] font-mono ${STAGE_COLORS[stage] || 'text-gray-400'}`}>
                          {learned.progression_label || `Lv.${learned.level}`}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`text-[13px] ${DMG_TYPE_LABELS[skill.damage_type]?.color || 'text-gray-500'}`}>
                        {DMG_TYPE_LABELS[skill.damage_type]?.label || skill.damage_type}
                      </span>
                      {learned?.cooldown_remaining > 0 && (
                        <span className="text-[13px] text-red-400 ml-auto">CD: {learned.cooldown_remaining}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Metin2Box>
        </div>

        {/* Detail panel */}
        <div className="flex-1 p-3">
          <Metin2Box variant="a">
            {!selectedSkill ? (
              <div className="text-gray-600 text-sm text-center mt-10">Selecione uma habilidade</div>
            ) : (
              <div className="space-y-3">
                {/* Skill header */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-metin-gold font-medieval text-sm">{selectedSkill.name}</span>
                    <span className={`text-[13px] ${DMG_TYPE_LABELS[selectedSkill.damage_type]?.color || 'text-gray-400'}`}>
                      [{DMG_TYPE_LABELS[selectedSkill.damage_type]?.label || selectedSkill.damage_type}]
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-400 mt-1 leading-relaxed">{selectedSkill.description}</p>
                </div>

                {/* Stats */}
                <Metin2Box variant="a" title="Dados" style={{ marginBottom: 8 }}>
                  <div className="grid grid-cols-2 gap-1 text-[13px]">
                    <DetailLine label="Dano Base" value={selectedSkill.base_damage} />
                    <DetailLine label="Custo MP" value={selectedSkill.mp_cost} />
                    <DetailLine label="Cooldown" value={`${selectedSkill.cooldown}t`} />
                    <DetailLine label="Lv. Req." value={selectedSkill.level_required} />
                    <DetailLine label="Escala" value={selectedSkill.scaling_attribute || '—'} />
                    <DetailLine label="Max Level" value={selectedSkill.max_level} />
                  </div>

                  {selectedSkill.effect_type && (
                    <div className="text-[13px] text-metin-orange mt-1">
                      Efeito: {selectedSkill.effect_type} ({selectedSkill.effect_chance}%, {selectedSkill.effect_duration}t)
                    </div>
                  )}
                </Metin2Box>

                {/* Progression info */}
                <Metin2Box variant="a" title="Progressão" style={{ marginBottom: 8 }}>
                  {selectedLearned ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Progressao</span>
                        <span className={`font-mono ${STAGE_COLORS[selectedLearned.progress_stage] || 'text-gray-300'}`}>
                          {selectedLearned.progression_label || `Lv.${selectedLearned.level}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Estagio</span>
                        <span className="text-gray-300">{formatStage(selectedLearned.progress_stage)}</span>
                      </div>
                      {selectedLearned.times_used > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Usos</span>
                          <span className="text-gray-400">{selectedLearned.times_used}</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="pt-2 space-y-1.5">
                        {/* Normal upgrade */}
                        {selectedLearned.can_normal_upgrade && sp > 0 && (
                          <button onClick={handleUpgrade} className="metin-btn metin-btn-sm w-full text-sm">
                            Evoluir (1 Skill Pt)
                          </button>
                        )}
                        {selectedLearned.can_normal_upgrade && sp === 0 && (
                          <div className="text-[13px] text-gray-600 text-center">Sem skill points</div>
                        )}

                        {/* Master transition notice */}
                        {selectedLearned.is_master_transition && (
                          <div className="text-[13px] text-metin-cyan text-center">
                            Atingiu Mestre! Use livros para progredir.
                          </div>
                        )}

                        {/* Read book */}
                        {selectedLearned.can_read_book && (
                          <button onClick={handleReadBook} className="metin-btn metin-btn-sm w-full text-sm !bg-cyan-900/50 !border-cyan-700/50 hover:!bg-cyan-800/50">
                            Ler Livro ({Math.round(60)}% chance)
                          </button>
                        )}

                        {/* Spirit stone */}
                        {selectedLearned.can_use_spirit_stone && (
                          <button onClick={handleSpiritStone} className="metin-btn metin-btn-sm w-full text-sm !bg-amber-900/50 !border-amber-700/50 hover:!bg-amber-800/50">
                            Pedra Espiritual ({Math.round(30)}% · -50 Honra)
                          </button>
                        )}

                        {/* Perfect master badge */}
                        {selectedLearned.progress_stage === 'PERFECT_MASTER' && (
                          <div className="text-center text-sm text-amber-300 font-medieval">
                            Perfect Master
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600 text-center">Nao aprendida</div>
                      {character?.level >= selectedSkill.level_required && sp > 0 ? (
                        <button onClick={handleLearn} className="metin-btn metin-btn-sm w-full text-sm">
                          Aprender (1 Skill Pt)
                        </button>
                      ) : (
                        <div className="text-[13px] text-gray-600 text-center">
                          {character?.level < selectedSkill.level_required
                            ? `Requer nivel ${selectedSkill.level_required}`
                            : 'Sem skill points'}
                        </div>
                      )}
                    </div>
                  )}
                </Metin2Box>
              </div>
            )}
          </Metin2Box>
        </div>
      </div>
    </Metin2Panel>
  );
}

function DetailLine({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-300">{value}</span>
    </div>
  );
}

function formatStage(stage) {
  const map = {
    NORMAL: 'Normal',
    MASTER: 'Mestre',
    GRAND_MASTER: 'Grand Master',
    PERFECT_MASTER: 'Perfect Master',
  };
  return map[stage] || stage;
}
