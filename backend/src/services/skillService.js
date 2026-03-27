const db = require('../database/connection');
const skillProgression = require('../modules/skillProgression');
const cfg = require('../modules/statusConfig');

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

    // Enriquece com dados de progressao
    return skills.map(s => ({
      ...s,
      progression_label: skillProgression.getProgressionLabel(s),
      effective_progress: skillProgression.getEffectiveProgressValue(s),
      can_normal_upgrade: skillProgression.canProgressWithNormalPoint(s),
      can_read_book: skillProgression.canReadBook(s),
      can_use_spirit_stone: skillProgression.canUseSpiritStone(s),
      is_master_transition: skillProgression.isMasterTransitionReached(s),
    }));
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
      cooldown_remaining: 0,
      progress_stage: 'NORMAL',
      master_stage_level: 0,
      grand_stage_level: 0,
      perfect_stage_level: 0,
      master_book_reads: 0,
      times_used: 0,
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

    // Verifica se pode progredir com ponto normal
    if (!skillProgression.canProgressWithNormalPoint(charSkill)) {
      if (skillProgression.isMasterTransitionReached(charSkill)) {
        throw new Error('Habilidade atingiu o limiar. Use livros para progredir.');
      }
      throw new Error('Habilidade não pode ser evoluída com pontos normais neste estágio');
    }

    if (character.skill_points < 1) {
      throw new Error('Pontos de habilidade insuficientes');
    }

    await db('characters')
      .where({ id: charId })
      .update({ skill_points: character.skill_points - 1 });

    const newLevel = charSkill.level + 1;
    const updates = { level: newLevel };

    // Auto-promote para MASTER ao atingir o limiar
    if (newLevel >= cfg.MASTER_TRANSITION_LEVEL) {
      updates.progress_stage = 'MASTER';
      updates.master_stage_level = 1;
    }

    await db('character_skills')
      .where({ id: charSkill.id })
      .update(updates);

    const updated = await db('character_skills')
      .join('skills', 'character_skills.skill_id', 'skills.id')
      .where({ 'character_skills.id': charSkill.id })
      .select('character_skills.*', 'skills.*', 'character_skills.id as cs_id', 'character_skills.level as skill_level')
      .first();

    return updated;
  },

  /**
   * Tenta progredir a skill lendo um livro.
   * So funciona no estagio MASTER.
   */
  async readBook(charId, skillId) {
    const charSkill = await db('character_skills')
      .where({ character_id: charId, skill_id: skillId })
      .first();

    if (!charSkill) {
      throw new Error('Habilidade não aprendida');
    }

    const result = skillProgression.readBook(charSkill);

    if (result.mutations) {
      await db('character_skills')
        .where({ id: charSkill.id })
        .update(result.mutations);
    }

    return result;
  },

  /**
   * Tenta progredir a skill com Pedra Espiritual.
   * So funciona no estagio GRAND_MASTER. Consome honra.
   */
  async useSpiritStone(charId, skillId) {
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

    const result = skillProgression.useSpiritStone(charSkill, character.honor || 0);

    // Aplica mutacoes na skill
    if (result.mutations) {
      await db('character_skills')
        .where({ id: charSkill.id })
        .update(result.mutations);
    }

    // Aplica perda de honra
    if (result.honor_result) {
      await db('characters')
        .where({ id: charId })
        .update({ honor: result.honor_result.honor });
    }

    return result;
  },

  /**
   * Retorna informacao de progressao de uma skill especifica.
   */
  async getSkillProgression(charId, skillId) {
    const charSkill = await db('character_skills')
      .where({ character_id: charId, skill_id: skillId })
      .first();

    if (!charSkill) {
      return null;
    }

    return {
      ...charSkill,
      progression_label: skillProgression.getProgressionLabel(charSkill),
      effective_progress: skillProgression.getEffectiveProgressValue(charSkill),
      can_normal_upgrade: skillProgression.canProgressWithNormalPoint(charSkill),
      can_read_book: skillProgression.canReadBook(charSkill),
      can_use_spirit_stone: skillProgression.canUseSpiritStone(charSkill),
      is_master_transition: skillProgression.isMasterTransitionReached(charSkill),
    };
  },
};
