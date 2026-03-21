const db = require('../database/connection');
const formulas = require('../utils/formulas');
const constants = require('../utils/constants');
const { NORMAL_BONUSES, SPECIAL_BONUSES, BONUS_POOLS } = require('../data/bonuses');

module.exports = {
  async addBonus(charId, invId, scrollType) {
    const invItem = await db('character_inventory')
      .join('items', 'character_inventory.item_id', 'items.id')
      .where({ 'character_inventory.id': invId, character_id: charId })
      .select('character_inventory.*', 'items.*', 'character_inventory.id as inv_id')
      .first();

    if (!invItem) {
      throw new Error('Item não encontrado no inventário');
    }

    if (!invItem.equippable || !invItem.equipment_slot) {
      throw new Error('Apenas equipamentos podem receber bônus');
    }

    const pool = BONUS_POOLS[invItem.equipment_slot];
    if (!pool) {
      throw new Error('Tipo de equipamento inválido para bônus');
    }

    if (scrollType === 'normal') {
      // Find next empty normal bonus slot
      let emptySlot = 0;
      for (let i = 1; i <= constants.MAX_NORMAL_BONUSES; i++) {
        if (!invItem[`bonus_${i}_type`]) {
          emptySlot = i;
          break;
        }
      }

      if (emptySlot === 0) {
        throw new Error('Todos os slots de bônus normais estão ocupados');
      }

      // Consume scroll: 97 = normal bonus scroll, 98 = superior bonus scroll
      const scroll97 = await db('character_inventory')
        .where({ character_id: charId, item_id: 97, equipped: false })
        .first();
      const scroll98 = await db('character_inventory')
        .where({ character_id: charId, item_id: 98, equipped: false })
        .first();

      if (!scroll97 && !scroll98) {
        throw new Error('Pergaminho de bônus necessário (item 97 ou 98)');
      }

      const useSuperior = !!scroll98;
      const scrollToUse = useSuperior ? scroll98 : scroll97;

      // Consume
      if (scrollToUse.quantity <= 1) {
        await db('character_inventory').where({ id: scrollToUse.id }).delete();
      } else {
        await db('character_inventory')
          .where({ id: scrollToUse.id })
          .update({ quantity: scrollToUse.quantity - 1 });
      }

      // Roll bonus from pool
      const availableBonuses = pool.normal;
      const bonusType = availableBonuses[Math.floor(Math.random() * availableBonuses.length)];
      const bonusDef = NORMAL_BONUSES.find(b => b.type === bonusType);
      const rarity = useSuperior ? 'rare' : 'common';
      const value = formulas.generateBonusValue(bonusDef.min, bonusDef.max, rarity);

      const updateData = {};
      updateData[`bonus_${emptySlot}_type`] = bonusType;
      updateData[`bonus_${emptySlot}_value`] = value;

      await db('character_inventory').where({ id: invId }).update(updateData);

      return {
        slot: emptySlot,
        type: bonusType,
        value,
        label: bonusDef.label,
        superior: useSuperior,
        message: `Bônus adicionado: ${bonusDef.label} +${value}`
      };

    } else if (scrollType === 'special') {
      // Find next empty special bonus slot
      let emptySlot = 0;
      for (let i = 1; i <= constants.MAX_SPECIAL_BONUSES; i++) {
        if (!invItem[`special_bonus_${i}_type`]) {
          emptySlot = i;
          break;
        }
      }

      if (emptySlot === 0) {
        throw new Error('Todos os slots de bônus especiais estão ocupados');
      }

      // Consume scroll: 99 = special bonus scroll, 100 = superior special bonus scroll
      const scroll99 = await db('character_inventory')
        .where({ character_id: charId, item_id: 99, equipped: false })
        .first();
      const scroll100 = await db('character_inventory')
        .where({ character_id: charId, item_id: 100, equipped: false })
        .first();

      if (!scroll99 && !scroll100) {
        throw new Error('Pergaminho de bônus especial necessário (item 99 ou 100)');
      }

      const useSuperior = !!scroll100;
      const scrollToUse = useSuperior ? scroll100 : scroll99;

      if (scrollToUse.quantity <= 1) {
        await db('character_inventory').where({ id: scrollToUse.id }).delete();
      } else {
        await db('character_inventory')
          .where({ id: scrollToUse.id })
          .update({ quantity: scrollToUse.quantity - 1 });
      }

      const availableBonuses = pool.special;
      const bonusType = availableBonuses[Math.floor(Math.random() * availableBonuses.length)];
      const bonusDef = SPECIAL_BONUSES.find(b => b.type === bonusType);
      const rarity = useSuperior ? 'epic' : 'uncommon';
      const value = formulas.generateBonusValue(bonusDef.min, bonusDef.max, rarity);

      const updateData = {};
      updateData[`special_bonus_${emptySlot}_type`] = bonusType;
      updateData[`special_bonus_${emptySlot}_value`] = value;

      await db('character_inventory').where({ id: invId }).update(updateData);

      return {
        slot: emptySlot,
        type: bonusType,
        value,
        label: bonusDef.label,
        superior: useSuperior,
        special: true,
        message: `Bônus especial adicionado: ${bonusDef.label} +${value}`
      };

    } else {
      throw new Error('Tipo de pergaminho inválido: use "normal" ou "special"');
    }
  },

  async rerollBonus(charId, invId, bonusSlot, scrollType) {
    const invItem = await db('character_inventory')
      .join('items', 'character_inventory.item_id', 'items.id')
      .where({ 'character_inventory.id': invId, character_id: charId })
      .select('character_inventory.*', 'items.*', 'character_inventory.id as inv_id')
      .first();

    if (!invItem) {
      throw new Error('Item não encontrado no inventário');
    }

    if (!invItem.equippable || !invItem.equipment_slot) {
      throw new Error('Apenas equipamentos podem ter bônus rerolados');
    }

    const pool = BONUS_POOLS[invItem.equipment_slot];
    if (!pool) {
      throw new Error('Tipo de equipamento inválido');
    }

    if (scrollType === 'normal') {
      if (bonusSlot < 1 || bonusSlot > constants.MAX_NORMAL_BONUSES) {
        throw new Error('Slot de bônus inválido');
      }

      if (!invItem[`bonus_${bonusSlot}_type`]) {
        throw new Error('Este slot não possui bônus para rerollar');
      }

      // Consume scroll
      const scroll97 = await db('character_inventory')
        .where({ character_id: charId, item_id: 97, equipped: false })
        .first();
      const scroll98 = await db('character_inventory')
        .where({ character_id: charId, item_id: 98, equipped: false })
        .first();

      if (!scroll97 && !scroll98) {
        throw new Error('Pergaminho de bônus necessário');
      }

      const useSuperior = !!scroll98;
      const scrollToUse = useSuperior ? scroll98 : scroll97;

      if (scrollToUse.quantity <= 1) {
        await db('character_inventory').where({ id: scrollToUse.id }).delete();
      } else {
        await db('character_inventory')
          .where({ id: scrollToUse.id })
          .update({ quantity: scrollToUse.quantity - 1 });
      }

      const availableBonuses = pool.normal;
      const newBonusType = availableBonuses[Math.floor(Math.random() * availableBonuses.length)];
      const bonusDef = NORMAL_BONUSES.find(b => b.type === newBonusType);
      const rarity = useSuperior ? 'rare' : 'common';
      const value = formulas.generateBonusValue(bonusDef.min, bonusDef.max, rarity);

      const updateData = {};
      updateData[`bonus_${bonusSlot}_type`] = newBonusType;
      updateData[`bonus_${bonusSlot}_value`] = value;

      await db('character_inventory').where({ id: invId }).update(updateData);

      return {
        slot: bonusSlot,
        old_type: invItem[`bonus_${bonusSlot}_type`],
        new_type: newBonusType,
        value,
        label: bonusDef.label,
        message: `Bônus rerolado: ${bonusDef.label} +${value}`
      };

    } else if (scrollType === 'special') {
      if (bonusSlot < 1 || bonusSlot > constants.MAX_SPECIAL_BONUSES) {
        throw new Error('Slot de bônus especial inválido');
      }

      if (!invItem[`special_bonus_${bonusSlot}_type`]) {
        throw new Error('Este slot não possui bônus especial para rerollar');
      }

      const scroll99 = await db('character_inventory')
        .where({ character_id: charId, item_id: 99, equipped: false })
        .first();
      const scroll100 = await db('character_inventory')
        .where({ character_id: charId, item_id: 100, equipped: false })
        .first();

      if (!scroll99 && !scroll100) {
        throw new Error('Pergaminho de bônus especial necessário');
      }

      const useSuperior = !!scroll100;
      const scrollToUse = useSuperior ? scroll100 : scroll99;

      if (scrollToUse.quantity <= 1) {
        await db('character_inventory').where({ id: scrollToUse.id }).delete();
      } else {
        await db('character_inventory')
          .where({ id: scrollToUse.id })
          .update({ quantity: scrollToUse.quantity - 1 });
      }

      const availableBonuses = pool.special;
      const newBonusType = availableBonuses[Math.floor(Math.random() * availableBonuses.length)];
      const bonusDef = SPECIAL_BONUSES.find(b => b.type === newBonusType);
      const rarity = useSuperior ? 'epic' : 'uncommon';
      const value = formulas.generateBonusValue(bonusDef.min, bonusDef.max, rarity);

      const updateData = {};
      updateData[`special_bonus_${bonusSlot}_type`] = newBonusType;
      updateData[`special_bonus_${bonusSlot}_value`] = value;

      await db('character_inventory').where({ id: invId }).update(updateData);

      return {
        slot: bonusSlot,
        old_type: invItem[`special_bonus_${bonusSlot}_type`],
        new_type: newBonusType,
        value,
        label: bonusDef.label,
        special: true,
        message: `Bônus especial rerolado: ${bonusDef.label} +${value}`
      };

    } else {
      throw new Error('Tipo de pergaminho inválido');
    }
  }
};
