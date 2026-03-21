import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClassSkills, fetchCharacterSkills, learnSkill, upgradeSkill } from '../../store/slices/skillSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import { closePanel, addNotification } from '../../store/slices/uiSlice';

export default function SkillTrainerPanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const { classSkills, characterSkills } = useSelector((s) => s.skills);

  useEffect(() => {
    if (character?.class_id) dispatch(fetchClassSkills(character.class_id));
    if (character?.id) dispatch(fetchCharacterSkills(character.id));
  }, [dispatch, character?.class_id, character?.id]);

  const learnedMap = {};
  (Array.isArray(characterSkills) ? characterSkills : []).forEach((s) => {
    learnedMap[s.skill_id] = s;
  });

  const handleLearn = async (skillId) => {
    try {
      await dispatch(learnSkill({ charId: character.id, skillId })).unwrap();
      dispatch(addNotification({ type: 'success', message: 'Habilidade aprendida!' }));
      dispatch(loadCharacter(character.id));
      dispatch(fetchCharacterSkills(character.id));
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: e || 'Erro' }));
    }
  };

  const handleUpgrade = async (skillId) => {
    try {
      await dispatch(upgradeSkill({ charId: character.id, skillId })).unwrap();
      dispatch(addNotification({ type: 'success', message: 'Habilidade evoluida!' }));
      dispatch(loadCharacter(character.id));
      dispatch(fetchCharacterSkills(character.id));
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: e || 'Erro' }));
    }
  };

  return (
    <div className="metin-panel-gold p-4 w-[400px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="panel-title !mb-0 !pb-0 !border-0">Treinador</h2>
        <button onClick={() => dispatch(closePanel())} className="text-gray-500 hover:text-metin-gold">X</button>
      </div>
      <div className="divider-gold" />

      <div className="text-xs text-metin-gold mb-2">Skill Points: {character?.skill_points || 0}</div>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {(Array.isArray(classSkills) ? classSkills : []).map((skill) => {
          const learned = learnedMap[skill.id];
          const canLearn = !learned && character.level >= skill.level_required && character.skill_points > 0;
          const canUpgrade = learned && learned.level < skill.max_level && character.skill_points > 0;

          return (
            <div key={skill.id} className="metin-panel p-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medieval text-metin-gold">{skill.name}</div>
                  <div className="text-xs text-gray-500">
                    {skill.type} | {skill.damage_type} | Lv.Req: {skill.level_required}
                  </div>
                </div>
                {learned && <span className="text-xs text-metin-green">Lv.{learned.level || learned.skill_level}/{skill.max_level}</span>}
              </div>
              <p className="text-xs text-gray-400 mt-1">{skill.description}</p>
              <div className="text-xs text-gray-500 mt-1">
                MP: {skill.mp_cost} | Dano: {skill.base_damage} | CD: {skill.cooldown}
              </div>

              <div className="mt-2">
                {!learned && (
                  <button onClick={() => handleLearn(skill.id)} disabled={!canLearn}
                    className="metin-btn metin-btn-sm disabled:opacity-50">
                    Aprender (1 SP)
                  </button>
                )}
                {learned && (
                  <button onClick={() => handleUpgrade(skill.id)} disabled={!canUpgrade}
                    className="metin-btn metin-btn-sm disabled:opacity-50">
                    Evoluir (1 SP)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
