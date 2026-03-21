const db = require('../database/connection');
const formulas = require('../utils/formulas');
const constants = require('../utils/constants');
const inventoryService = require('./inventoryService');

module.exports = {
  async getLifeskills(charId) {
    const lifeskills = await db('character_lifeskills')
      .where({ character_id: charId })
      .first();

    if (!lifeskills) {
      throw new Error('Lifeskills não encontradas para este personagem');
    }

    return {
      mining: {
        level: lifeskills.mining_level,
        exp: lifeskills.mining_exp,
        exp_for_next: formulas.calcLifeskillExpForLevel(lifeskills.mining_level)
      },
      woodcutting: {
        level: lifeskills.woodcutting_level,
        exp: lifeskills.woodcutting_exp,
        exp_for_next: formulas.calcLifeskillExpForLevel(lifeskills.woodcutting_level)
      },
      farming: {
        level: lifeskills.farming_level,
        exp: lifeskills.farming_exp,
        exp_for_next: formulas.calcLifeskillExpForLevel(lifeskills.farming_level)
      }
    };
  },

  async performLifeskill(charId, type, areaId) {
    if (!['mining', 'woodcutting', 'farming'].includes(type)) {
      throw new Error('Tipo de lifeskill inválido');
    }

    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    if (character.stamina < constants.LIFESKILL_STAMINA_COST) {
      throw new Error('Stamina insuficiente');
    }

    // Validate area resources
    const resources = await db('area_resources')
      .where({ area_id: areaId, resource_type: type })
      .select('area_resources.*');

    if (resources.length === 0) {
      throw new Error('Nenhum recurso deste tipo nesta área');
    }

    const lifeskills = await db('character_lifeskills')
      .where({ character_id: charId })
      .first();

    const levelField = `${type}_level`;
    const expField = `${type}_exp`;
    const currentLevel = lifeskills[levelField];

    // Filter resources by level requirement
    const availableResources = resources.filter(r => r.level_required <= currentLevel);
    if (availableResources.length === 0) {
      throw new Error('Nível de lifeskill insuficiente para recursos nesta área');
    }

    // Deduct stamina
    await db('characters')
      .where({ id: charId })
      .update({ stamina: character.stamina - constants.LIFESKILL_STAMINA_COST });

    // Roll items (1-3 random resources)
    const numItems = formulas.rollQuantity(1, 3);
    const gatheredItems = [];
    let totalExp = 0;

    for (let i = 0; i < numItems; i++) {
      const resource = availableResources[Math.floor(Math.random() * availableResources.length)];
      const qty = formulas.rollQuantity(1, 2);

      try {
        await inventoryService.addItem(charId, resource.item_id, qty);
        const item = await db('items').where({ id: resource.item_id }).first();
        gatheredItems.push({ item_id: resource.item_id, name: item ? item.name : 'Unknown', quantity: qty });
        totalExp += resource.exp_reward;
      } catch (e) {
        // Inventory full, skip
        break;
      }
    }

    // Add exp and check level up
    let newExp = lifeskills[expField] + totalExp;
    let newLevel = currentLevel;
    let leveledUp = false;
    let expNeeded = formulas.calcLifeskillExpForLevel(newLevel);

    while (newExp >= expNeeded) {
      newExp -= expNeeded;
      newLevel++;
      leveledUp = true;
      expNeeded = formulas.calcLifeskillExpForLevel(newLevel);
    }

    const updateData = {};
    updateData[levelField] = newLevel;
    updateData[expField] = newExp;

    await db('character_lifeskills')
      .where({ character_id: charId })
      .update(updateData);

    return {
      type,
      items_gathered: gatheredItems,
      exp_gained: totalExp,
      leveled_up: leveledUp,
      new_level: newLevel,
      current_exp: newExp,
      exp_for_next: formulas.calcLifeskillExpForLevel(newLevel),
      stamina_remaining: character.stamina - constants.LIFESKILL_STAMINA_COST
    };
  }
};
