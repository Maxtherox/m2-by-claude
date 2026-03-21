const db = require('../database/connection');
const inventoryService = require('./inventoryService');

module.exports = {
  async getStorage(charId) {
    const storage = await db('character_storage')
      .join('items', 'character_storage.item_id', 'items.id')
      .where({ character_id: charId })
      .select(
        'character_storage.*',
        'items.name',
        'items.type',
        'items.subtype',
        'items.description',
        'items.rarity',
        'items.level_required',
        'items.attack as base_attack',
        'items.magic_attack as base_magic_attack',
        'items.defense as base_defense',
        'items.magic_defense as base_magic_defense',
        'items.equippable',
        'items.equipment_slot',
        'items.stackable',
        'items.sell_price'
      );

    return storage;
  },

  async depositItem(charId, invId, qty) {
    const invItem = await db('character_inventory')
      .join('items', 'character_inventory.item_id', 'items.id')
      .where({ 'character_inventory.id': invId, character_id: charId })
      .select('character_inventory.*', 'items.stackable', 'items.name')
      .first();

    if (!invItem) {
      throw new Error('Item não encontrado no inventário');
    }

    if (invItem.equipped) {
      throw new Error('Desequipe o item antes de depositar');
    }

    qty = qty || invItem.quantity;
    if (qty > invItem.quantity) {
      throw new Error('Quantidade insuficiente');
    }

    // Check if stackable item already in storage
    if (invItem.stackable) {
      const existingStorage = await db('character_storage')
        .where({ character_id: charId, item_id: invItem.item_id })
        .first();

      if (existingStorage) {
        await db('character_storage')
          .where({ id: existingStorage.id })
          .update({ quantity: existingStorage.quantity + qty });
      } else {
        await db('character_storage').insert({
          character_id: charId,
          item_id: invItem.item_id,
          quantity: qty,
          refinement: invItem.refinement,
          bonus_1_type: invItem.bonus_1_type,
          bonus_1_value: invItem.bonus_1_value,
          bonus_2_type: invItem.bonus_2_type,
          bonus_2_value: invItem.bonus_2_value,
          bonus_3_type: invItem.bonus_3_type,
          bonus_3_value: invItem.bonus_3_value,
          bonus_4_type: invItem.bonus_4_type,
          bonus_4_value: invItem.bonus_4_value,
          bonus_5_type: invItem.bonus_5_type,
          bonus_5_value: invItem.bonus_5_value,
          special_bonus_1_type: invItem.special_bonus_1_type,
          special_bonus_1_value: invItem.special_bonus_1_value,
          special_bonus_2_type: invItem.special_bonus_2_type,
          special_bonus_2_value: invItem.special_bonus_2_value
        });
      }
    } else {
      await db('character_storage').insert({
        character_id: charId,
        item_id: invItem.item_id,
        quantity: qty,
        refinement: invItem.refinement,
        bonus_1_type: invItem.bonus_1_type,
        bonus_1_value: invItem.bonus_1_value,
        bonus_2_type: invItem.bonus_2_type,
        bonus_2_value: invItem.bonus_2_value,
        bonus_3_type: invItem.bonus_3_type,
        bonus_3_value: invItem.bonus_3_value,
        bonus_4_type: invItem.bonus_4_type,
        bonus_4_value: invItem.bonus_4_value,
        bonus_5_type: invItem.bonus_5_type,
        bonus_5_value: invItem.bonus_5_value,
        special_bonus_1_type: invItem.special_bonus_1_type,
        special_bonus_1_value: invItem.special_bonus_1_value,
        special_bonus_2_type: invItem.special_bonus_2_type,
        special_bonus_2_value: invItem.special_bonus_2_value
      });
    }

    // Remove from inventory
    await inventoryService.removeItem(charId, invId, qty);

    return { message: `${invItem.name} x${qty} depositado no armazém` };
  },

  async withdrawItem(charId, storageId, qty) {
    const storageItem = await db('character_storage')
      .join('items', 'character_storage.item_id', 'items.id')
      .where({ 'character_storage.id': storageId, character_id: charId })
      .select('character_storage.*', 'items.name', 'items.stackable')
      .first();

    if (!storageItem) {
      throw new Error('Item não encontrado no armazém');
    }

    qty = qty || storageItem.quantity;
    if (qty > storageItem.quantity) {
      throw new Error('Quantidade insuficiente no armazém');
    }

    // Add to inventory with bonuses preserved
    const options = {
      refinement: storageItem.refinement,
      bonus_1_type: storageItem.bonus_1_type,
      bonus_1_value: storageItem.bonus_1_value,
      bonus_2_type: storageItem.bonus_2_type,
      bonus_2_value: storageItem.bonus_2_value,
      bonus_3_type: storageItem.bonus_3_type,
      bonus_3_value: storageItem.bonus_3_value,
      bonus_4_type: storageItem.bonus_4_type,
      bonus_4_value: storageItem.bonus_4_value,
      bonus_5_type: storageItem.bonus_5_type,
      bonus_5_value: storageItem.bonus_5_value,
      special_bonus_1_type: storageItem.special_bonus_1_type,
      special_bonus_1_value: storageItem.special_bonus_1_value,
      special_bonus_2_type: storageItem.special_bonus_2_type,
      special_bonus_2_value: storageItem.special_bonus_2_value
    };

    await inventoryService.addItem(charId, storageItem.item_id, qty, options);

    // Remove from storage
    if (qty >= storageItem.quantity) {
      await db('character_storage').where({ id: storageId }).delete();
    } else {
      await db('character_storage')
        .where({ id: storageId })
        .update({ quantity: storageItem.quantity - qty });
    }

    return { message: `${storageItem.name} x${qty} retirado do armazém` };
  }
};
