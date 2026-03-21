const db = require('../database/connection');

module.exports = {
  async getClassSkills(classId) {
    const skills = await db('skills').where({ class_id: classId }).orderBy('level_required', 'asc');
    return skills;
  },

  async getCharacterSkills(charId) {
    const skills = await db('character_skills')
      .join('skills', 'character_skills.skill_id', 'skills.id')
      .where({ character_id: charId })
      .select(
        'character_skills.*',
        'skills.name',
        'skills.type',
        'skills.damage_type',
        'skills.description',
        'skills.mp_cost',
        'skills.stamina_cost',
        'skills.base_damage',
        'skills.scaling_attribute',
        'skills.scaling_factor',
        'skills.effect_type',
        'skills.effect_chance',
        'skills.effect_value',
        'skills.effect_duration',
        'skills.cooldown',
        'skills.level_required',
        'skills.max_level',
        'skills.per_level_damage',
        'skills.per_level_effect',
        'skills.class_id'
      );

    return skills;
  },

  async learnSkill(charId, skillId) {
    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    const skill = await db('skills').where({ id: skillId }).first();
    if (!skill) {
      throw new Error('Habilidade não encontrada');
    }

    if (skill.class_id !== character.class_id) {
      throw new Error('Habilidade não disponível para sua classe');
    }

    if (character.level < skill.level_required) {
      throw new Error('Nível insuficiente para aprender esta habilidade');
    }

    if (character.skill_points < 1) {
      throw new Error('Pontos de habilidade insuficientes');
    }

    const existing = await db('character_skills')
      .where({ character_id: charId, skill_id: skillId })
      .first();

    if (existing) {
      throw new Error('Habilidade já aprendida');
    }

    await db('characters')
      .where({ id: charId })
      .update({ skill_points: character.skill_points - 1 });

    const [id] = await db('character_skills').insert({
      character_id: charId,
      skill_id: skillId,
      level: 1,
      cooldown_remaining: 0
    });

    const learned = await db('character_skills')
      .join('skills', 'character_skills.skill_id', 'skills.id')
      .where({ 'character_skills.id': id })
      .select('character_skills.*', 'skills.*', 'character_skills.id as cs_id', 'character_skills.level as skill_level')
      .first();

    return learned;
  },

  async upgradeSkill(charId, skillId) {
    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    const charSkill = await db('character_skills')
      .where({ character_id: charId, skill_id: skillId })
      .first();

    if (!charSkill) {
      throw new Error('Habilidade não aprendida');
    }

    const skill = await db('skills').where({ id: skillId }).first();

    if (charSkill.level >= skill.max_level) {
      throw new Error('Habilidade já está no nível máximo');
    }

    if (character.skill_points < 1) {
      throw new Error('Pontos de habilidade insuficientes');
    }

    await db('characters')
      .where({ id: charId })
      .update({ skill_points: character.skill_points - 1 });

    await db('character_skills')
      .where({ id: charSkill.id })
      .update({ level: charSkill.level + 1 });

    const updated = await db('character_skills')
      .join('skills', 'character_skills.skill_id', 'skills.id')
      .where({ 'character_skills.id': charSkill.id })
      .select('character_skills.*', 'skills.*', 'character_skills.id as cs_id', 'character_skills.level as skill_level')
      .first();

    return updated;
  }
};
