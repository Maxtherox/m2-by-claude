const db = require('../database/connection');
const formulas = require('../utils/formulas');
const constants = require('../utils/constants');
const derivedStatsModule = require('../modules/derivedStats');
const xpSystem = require('../modules/xpSystem');
const honorSystem = require('../modules/honorSystem');

module.exports = {
  async createCharacter(data) {
    const { name, kingdom_id, class_id, appearance } = data;

    if (!name || !kingdom_id || !class_id) {
      throw new Error('Nome, reino e classe são obrigatórios');
    }

    if (name.length < 3 || name.length > 20) {
      throw new Error('Nome deve ter entre 3 e 20 caracteres');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      throw new Error('Nome pode conter apenas letras, números e underscores');
    }

    const existing = await db('characters').where({ name }).first();
    if (existing) {
      throw new Error('Nome já está em uso');
    }

    const kingdom = await db('kingdoms').where({ id: kingdom_id }).first();
    if (!kingdom) {
      throw new Error('Reino inválido');
    }

    const classData = await db('classes').where({ id: class_id }).first();
    if (!classData) {
      throw new Error('Classe inválida');
    }

    const str = classData.base_str;
    const int = classData.base_int;
    const vit = classData.base_vit;
    const dex = classData.base_dex;

    const maxHP = derivedStatsModule.calcMaxHP(vit, 1, classData.base_vit, 0);
    const maxMP = derivedStatsModule.calcMaxMP(int, 1, classData.base_int);
    const maxStamina = derivedStatsModule.calcMaxStamina(vit, dex, 1);

    const [id] = await db('characters').insert({
      name,
      kingdom_id,
      class_id,
      level: 1,
      exp: 0,
      exp_total: 0,
      gold: constants.STARTING_GOLD,
      hp: maxHP,
      max_hp: maxHP,
      mp: maxMP,
      max_mp: maxMP,
      stamina: maxStamina,
      max_stamina: maxStamina,
      strength: str,
      intelligence: int,
      vitality: vit,
      dexterity: dex,
      status_points: 0,
      skill_points: 0,
      honor: 0,
      level_bonus_attack_physical: 0,
      level_bonus_attack_magic: 0,
      level_bonus_defense: 0,
      level_bonus_hp: 0,
      current_area_id: kingdom.start_area_id || 1,
      appearance: appearance ? JSON.stringify(appearance) : null
    });

    await db('character_lifeskills').insert({
      character_id: id,
      mining_level: 1,
      mining_exp: 0,
      woodcutting_level: 1,
      woodcutting_exp: 0,
      farming_level: 1,
      farming_exp: 0
    });

    // Add starting HP potions (item_id 58)
    let slot = 0;
    await db('character_inventory').insert({
      character_id: id,
      item_id: 58,
      slot: slot++,
      quantity: 5,
      refinement: 0,
      equipped: false
    });

    // Add starting MP potions (item_id 61)
    await db('character_inventory').insert({
      character_id: id,
      item_id: 61,
      slot: slot++,
      quantity: 3,
      refinement: 0,
      equipped: false
    });

    const character = await db('characters').where({ id }).first();
    return character;
  },

  async getCharacter(id) {
    const character = await db('characters')
      .join('kingdoms', 'characters.kingdom_id', 'kingdoms.id')
      .join('classes', 'characters.class_id', 'classes.id')
      .select(
        'characters.*',
        'kingdoms.name as kingdom_name',
        'kingdoms.color as kingdom_color',
        'kingdoms.emblem as kingdom_emblem',
        'classes.name as class_name',
        'classes.base_str',
        'classes.base_int',
        'classes.base_vit',
        'classes.base_dex',
        'classes.str_per_level',
        'classes.int_per_level',
        'classes.vit_per_level',
        'classes.dex_per_level'
      )
      .where('characters.id', id)
      .first();

    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    // Coleta bonus de equipamento
    const equippedItems = await db('character_inventory')
      .join('items', 'character_inventory.item_id', 'items.id')
      .where({ character_id: id, equipped: true })
      .select('character_inventory.*', 'items.*', 'character_inventory.id as inv_id');

    let equipBonuses = {
      attack: 0, magic_attack: 0, defense: 0, magic_defense: 0,
      speed: 0, hp_bonus: 0, mp_bonus: 0, critical: 0, dodge: 0,
      accuracy: 0, penetration: 0, max_hp: 0, max_mp: 0, max_stamina: 0,
      strength: 0, intelligence: 0, vitality: 0, dexterity: 0,
      damage_vs_monster: 0, damage_vs_boss: 0, drop_rate: 0, exp_bonus: 0,
      stun_immunity: 0, reflect: 0, hp_absorb: 0, mp_absorb: 0,
      crit_resist: 0, regen_per_turn: 0, counter_attack: 0,
      bonus_damage_chance: 0, poison_resist: 0, bleed_resist: 0
    };

    const equipment = {};

    for (const item of equippedItems) {
      const slot = item.equipment_slot;
      equipment[slot] = item;

      equipBonuses.attack += item.attack || 0;
      equipBonuses.magic_attack += item.magic_attack || 0;
      equipBonuses.defense += item.defense || 0;
      equipBonuses.magic_defense += item.magic_defense || 0;
      equipBonuses.speed += item.speed || 0;
      equipBonuses.hp_bonus += item.hp_bonus || 0;
      equipBonuses.mp_bonus += item.mp_bonus || 0;

      if (item.refinement > 0) {
        equipBonuses.attack += formulas.calcRefineBonus(item.attack || 0, item.refinement);
        equipBonuses.magic_attack += formulas.calcRefineBonus(item.magic_attack || 0, item.refinement);
        equipBonuses.defense += formulas.calcRefineBonus(item.defense || 0, item.refinement);
        equipBonuses.magic_defense += formulas.calcRefineBonus(item.magic_defense || 0, item.refinement);
      }

      for (let i = 1; i <= 5; i++) {
        const bType = item[`bonus_${i}_type`];
        const bValue = item[`bonus_${i}_value`] || 0;
        if (bType && equipBonuses[bType] !== undefined) {
          equipBonuses[bType] += bValue;
        }
      }

      for (let i = 1; i <= 2; i++) {
        const bType = item[`special_bonus_${i}_type`];
        const bValue = item[`special_bonus_${i}_value`] || 0;
        if (bType && equipBonuses[bType] !== undefined) {
          equipBonuses[bType] += bValue;
        }
      }
    }

    // Recalculo centralizado via derivedStats module
    const classData = {
      base_str: character.base_str,
      base_int: character.base_int,
      base_vit: character.base_vit,
      base_dex: character.base_dex
    };

    const derived = derivedStatsModule.recalculateAll(character, classData, equipBonuses);

    // Honra
    const honor_rank = honorSystem.resolveHonorRank(character.honor || 0);

    return {
      ...character,
      honor_rank,
      equipment,
      equipment_bonuses: equipBonuses,
      derived_stats: derived
    };
  },

  async allocateStatusPoints(charId, points) {
    const { strength, intelligence, vitality, dexterity } = points;
    const total = (strength || 0) + (intelligence || 0) + (vitality || 0) + (dexterity || 0);

    if (total <= 0) {
      throw new Error('Deve alocar pelo menos 1 ponto');
    }

    // Validacao: nenhum valor negativo
    if ((strength || 0) < 0 || (intelligence || 0) < 0 || (vitality || 0) < 0 || (dexterity || 0) < 0) {
      throw new Error('Não é permitido alocar pontos negativos');
    }

    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    if (total > character.status_points) {
      throw new Error('Pontos insuficientes');
    }

    const newStr = character.strength + (strength || 0);
    const newInt = character.intelligence + (intelligence || 0);
    const newVit = character.vitality + (vitality || 0);
    const newDex = character.dexterity + (dexterity || 0);

    const classData = await db('classes').where({ id: character.class_id }).first();

    const maxHP = derivedStatsModule.calcMaxHP(newVit, character.level, classData.base_vit, character.level_bonus_hp || 0);
    const maxMP = derivedStatsModule.calcMaxMP(newInt, character.level, classData.base_int);
    const maxStamina = derivedStatsModule.calcMaxStamina(newVit, newDex, character.level);

    await db('characters').where({ id: charId }).update({
      strength: newStr,
      intelligence: newInt,
      vitality: newVit,
      dexterity: newDex,
      status_points: character.status_points - total,
      max_hp: maxHP,
      max_mp: maxMP,
      max_stamina: maxStamina,
      hp: Math.min(character.hp, maxHP),
      mp: Math.min(character.mp, maxMP),
      stamina: Math.min(character.stamina, maxStamina)
    });

    return this.getCharacter(charId);
  },

  async addExperience(charId, amount, source) {
    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    if (character.level >= constants.MAX_LEVEL) {
      return { leveled_up: false, new_level: character.level, milestones: [], character };
    }

    const classData = await db('classes').where({ id: character.class_id }).first();

    // Usa o modulo de XP centralizado
    const result = xpSystem.addExperience(character, amount, source || 'unknown');

    if (!result.leveledUp && Object.keys(result.mutations).length === 0) {
      // Mesmo sem level up, atualiza exp e exp_total
      await db('characters').where({ id: charId }).update({
        exp: character.exp + amount,
        exp_total: (character.exp_total || 0) + amount,
      });

      const updatedCharacter = await this.getCharacter(charId);
      return {
        leveled_up: false,
        new_level: character.level,
        milestones: [],
        character: updatedCharacter,
      };
    }

    // Calcula stats derivados com os novos niveis e bonus
    const mutations = result.mutations;

    // Soma do crescimento de stats por classe nos level ups
    let str = character.strength + (classData.str_per_level * result.levelsGained);
    let int = character.intelligence + (classData.int_per_level * result.levelsGained);
    let vit = character.vitality + (classData.vit_per_level * result.levelsGained);
    let dex = character.dexterity + (classData.dex_per_level * result.levelsGained);

    const maxHP = derivedStatsModule.calcMaxHP(vit, mutations.level, classData.base_vit, mutations.level_bonus_hp);
    const maxMP = derivedStatsModule.calcMaxMP(int, mutations.level, classData.base_int);
    const maxStamina = derivedStatsModule.calcMaxStamina(vit, dex, mutations.level);

    await db('characters').where({ id: charId }).update({
      ...mutations,
      strength: str,
      intelligence: int,
      vitality: vit,
      dexterity: dex,
      max_hp: maxHP,
      max_mp: maxMP,
      max_stamina: maxStamina,
      // Restaura HP/MP/Stamina no level up
      hp: result.leveledUp ? maxHP : character.hp,
      mp: result.leveledUp ? maxMP : character.mp,
      stamina: result.leveledUp ? maxStamina : character.stamina,
    });

    const updatedCharacter = await this.getCharacter(charId);

    return {
      leveled_up: result.leveledUp,
      levels_gained: result.levelsGained,
      new_level: mutations.level,
      milestones: result.milestones,
      character: updatedCharacter,
    };
  },

  async addHonor(charId, amount, source) {
    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    const result = amount >= 0
      ? honorSystem.addHonor(character.honor || 0, amount, source)
      : honorSystem.removeHonor(character.honor || 0, Math.abs(amount), source);

    await db('characters').where({ id: charId }).update({ honor: result.honor });

    return this.getCharacter(charId);
  },
};
