import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClassSkills, fetchCharacterSkills } from '../../store/slices/skillSlice';
import { closePanel } from '../../store/slices/uiSlice';

export default function SkillPanel() {
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

  const dmgTypeColor = {
    physical: 'text-red-400',
    magical: 'text-blue-400',
    hybrid: 'text-purple-400',
    heal: 'text-green-400',
    buff: 'text-yellow-400',
    debuff: 'text-orange-400',
  };

  return (
    <div className="metin-panel-gold p-4 w-[400px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="panel-title !mb-0 !pb-0 !border-0">Habilidades</h2>
        <button onClick={() => dispatch(closePanel())} className="text-gray-500 hover:text-metin-gold">X</button>
      </div>
      <div className="divider-gold" />

      <div className="text-xs text-gray-400 mb-2">Skill Points: {character?.skill_points || 0}</div>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {(Array.isArray(classSkills) ? classSkills : []).map((skill) => {
          const learned = learnedMap[skill.id];
          return (
            <div key={skill.id} className={`metin-panel p-3 border ${learned ? 'border-metin-border-gold' : 'border-metin-border opacity-60'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm font-medieval text-metin-gold">{skill.name}</span>
                  <span className={`ml-2 text-xs ${dmgTypeColor[skill.damage_type] || 'text-gray-400'}`}>
                    [{skill.damage_type}]
                  </span>
                </div>
                {learned && <span className="text-xs text-metin-green">Lv.{learned.level || learned.skill_level}</span>}
                {!learned && <span className="text-xs text-gray-600">Nao aprendida</span>}
              </div>
              <p className="text-xs text-gray-400 mt-1">{skill.description}</p>
              <div className="flex gap-3 text-xs text-gray-500 mt-1">
                <span>MP: {skill.mp_cost}</span>
                <span>Dano: {skill.base_damage}</span>
                <span>CD: {skill.cooldown}</span>
                <span>Lv.Req: {skill.level_required}</span>
              </div>
              {skill.effect_type && (
                <div className="text-xs text-metin-orange mt-1">
                  Efeito: {skill.effect_type} ({skill.effect_chance}% chance, {skill.effect_duration} turnos)
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
