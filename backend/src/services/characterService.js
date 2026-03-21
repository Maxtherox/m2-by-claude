const db = require('../database/connection');
const formulas = require('../utils/formulas');
const constants = require('../utils/constants');

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

    const maxHP = formulas.calcMaxHP(vit, 1, classData);
    const maxMP = formulas.calcMaxMP(int, 1, classData);
    const maxStamina = formulas.calcMaxStamina(vit, dex, 1);

    const [id] = await db('characters').insert({
      name,
      kingdom_id,
      class_id,
      level: 1,
      exp: 0,
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

      // Base item stats
      equipBonuses.attack += item.attack || 0;
      equipBonuses.magic_attack += item.magic_attack || 0;
      equipBonuses.defense += item.defense || 0;
      equipBonuses.magic_defense += item.magic_defense || 0;
      equipBonuses.speed += item.speed || 0;
      equipBonuses.hp_bonus += item.hp_bonus || 0;
      equipBonuses.mp_bonus += item.mp_bonus || 0;

      // Refinement bonuses
      if (item.refinement > 0) {
        equipBonuses.attack += formulas.calcRefineBonus(item.attack || 0, item.refinement);
        equipBonuses.magic_attack += formulas.calcRefineBonus(item.magic_attack || 0, item.refinement);
        equipBonuses.defense += formulas.calcRefineBonus(item.defense || 0, item.refinement);
        equipBonuses.magic_defense += formulas.calcRefineBonus(item.magic_defense || 0, item.refinement);
      }

      // Normal bonuses (1-5)
      for (let i = 1; i <= 5; i++) {
        const bType = item[`bonus_${i}_type`];
        const bValue = item[`bonus_${i}_value`] || 0;
        if (bType && equipBonuses[bType] !== undefined) {
          equipBonuses[bType] += bValue;
        }
      }

      // Special bonuses (1-2)
      for (let i = 1; i <= 2; i++) {
        const bType = item[`special_bonus_${i}_type`];
        const bValue = item[`special_bonus_${i}_value`] || 0;
        if (bType && equipBonuses[bType] !== undefined) {
          equipBonuses[bType] += bValue;
        }
      }
    }

    const totalStr = character.strength + equipBonuses.strength;
    const totalInt = character.intelligence + equipBonuses.intelligence;
    const totalVit = character.vitality + equipBonuses.vitality;
    const totalDex = character.dexterity + equipBonuses.dexterity;

    const classData = {
      base_str: character.base_str,
      base_int: character.base_int,
      base_vit: character.base_vit,
      base_dex: character.base_dex
    };

    const derivedStats = {
      max_hp: formulas.calcMaxHP(totalVit, character.level, classData) + equipBonuses.max_hp + equipBonuses.hp_bonus,
      max_mp: formulas.calcMaxMP(totalInt, character.level, classData) + equipBonuses.max_mp + equipBonuses.mp_bonus,
      max_stamina: formulas.calcMaxStamina(totalVit, totalDex, character.level) + equipBonuses.max_stamina,
      attack: formulas.calcAttack(totalStr, character.level, classData) + equipBonuses.attack,
      magic_attack: formulas.calcMagicAttack(totalInt, character.level, classData) + equipBonuses.magic_attack,
      defense: formulas.calcDefense(totalVit, character.level) + equipBonuses.defense,
      magic_defense: formulas.calcMagicDefense(totalInt, totalVit, character.level) + equipBonuses.magic_defense,
      critical: formulas.calcCritical(totalDex, character.level) + equipBonuses.critical,
      dodge: formulas.calcDodge(totalDex, character.level) + equipBonuses.dodge,
      accuracy: formulas.calcAccuracy(totalDex, character.level) + equipBonuses.accuracy,
      speed: formulas.calcSpeed(totalDex, character.level) + equipBonuses.speed,
      penetration: formulas.calcPenetration(totalStr, totalDex) + equipBonuses.penetration,
      exp_for_next_level: formulas.calcExpForLevel(character.level)
    };

    return {
      ...character,
      equipment,
      equipment_bonuses: equipBonuses,
      derived_stats: derivedStats
    };
  },

  async allocateStatusPoints(charId, points) {
    const { strength, intelligence, vitality, dexterity } = points;
    const total = (strength || 0) + (intelligence || 0) + (vitality || 0) + (dexterity || 0);

    if (total <= 0) {
      throw new Error('Deve alocar pelo menos 1 ponto');
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

    const maxHP = formulas.calcMaxHP(newVit, character.level, classData);
    const maxMP = formulas.calcMaxMP(newInt, character.level, classData);
    const maxStamina = formulas.calcMaxStamina(newVit, newDex, character.level);

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

  async addExperience(charId, amount) {
    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    if (character.level >= constants.MAX_LEVEL) {
      return { leveled_up: false, new_level: character.level, character };
    }

    const classData = await db('classes').where({ id: character.class_id }).first();
    let exp = character.exp + amount;
    let level = character.level;
    let statusPoints = character.status_points;
    let skillPoints = character.skill_points;
    let str = character.strength;
    let int = character.intelligence;
    let vit = character.vitality;
    let dex = character.dexterity;
    let leveledUp = false;

    let expNeeded = formulas.calcExpForLevel(level);
    while (exp >= expNeeded && level < constants.MAX_LEVEL) {
      exp -= expNeeded;
      level++;
      leveledUp = true;

      str += classData.str_per_level;
      int += classData.int_per_level;
      vit += classData.vit_per_level;
      dex += classData.dex_per_level;
      statusPoints += constants.STATUS_POINTS_PER_LEVEL;
      skillPoints += constants.SKILL_POINTS_PER_LEVEL;

      expNeeded = formulas.calcExpForLevel(level);
    }

    const maxHP = formulas.calcMaxHP(vit, level, classData);
    const maxMP = formulas.calcMaxMP(int, level, classData);
    const maxStamina = formulas.calcMaxStamina(vit, dex, level);

    await db('characters').where({ id: charId }).update({
      exp,
      level,
      strength: str,
      intelligence: int,
      vitality: vit,
      dexterity: dex,
      status_points: statusPoints,
      skill_points: skillPoints,
      max_hp: maxHP,
      max_mp: maxMP,
      max_stamina: maxStamina,
      hp: leveledUp ? maxHP : character.hp,
      mp: leveledUp ? maxMP : character.mp,
      stamina: leveledUp ? maxStamina : character.stamina
    });

    const updatedCharacter = await this.getCharacter(charId);

    return {
      leveled_up: leveledUp,
      new_level: level,
      character: updatedCharacter
    };
  }
};
