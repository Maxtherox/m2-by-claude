const db = require('../database/connection');
const constants = require('../utils/constants');
const skillService = require('./skillService');

module.exports = {
  async getInventory(charId) {
    const inventory = await db('character_inventory')
      .join('items', 'character_inventory.item_id', 'items.id')
      .where({ character_id: charId })
      .select(
        'character_inventory.*',
        'items.name',
        'items.type',
        'items.subtype',
        'items.description',
        'items.rarity',
        'items.level_required',
        'items.class_required',
        'items.attack as base_attack',
        'items.magic_attack as base_magic_attack',
        'items.defense as base_defense',
        'items.magic_defense as base_magic_defense',
        'items.speed as base_speed',
        'items.hp_bonus',
        'items.mp_bonus',
        'items.buy_price',
        'items.sell_price',
        'items.stackable',
        'items.max_stack',
        'items.refineable',
        'items.equippable',
        'items.equipment_slot',
        'items.effect_type',
        'items.effect_value'
      )
      .orderBy('character_inventory.slot', 'asc');

    return inventory;
  },

  async addItem(charId, itemId, qty, options = {}) {
    const item = await db('items').where({ id: itemId }).first();
    if (!item) {
      throw new Error('Item não encontrado');
    }

    qty = qty || 1;

    if (item.stackable) {
      const existing = await db('character_inventory')
        .where({ character_id: charId, item_id: itemId, equipped: false })
        .first();

      if (existing) {
        const newQty = Math.min(existing.quantity + qty, item.max_stack);
        await db('character_inventory')
          .where({ id: existing.id })
          .update({ quantity: newQty });
        return db('character_inventory').where({ id: existing.id }).first();
      }
    }

    const inventory = await db('character_inventory')
      .where({ character_id: charId })
      .select('slot');

    const usedSlots = new Set(inventory.map(i => i.slot));
    let emptySlot = -1;
    for (let i = 0; i < constants.INVENTORY_SIZE; i++) {
      if (!usedSlots.has(i)) {
        emptySlot = i;
        break;
      }
    }

    if (emptySlot === -1) {
      throw new Error('Inventário cheio');
    }

    const insertData = {
      character_id: charId,
      item_id: itemId,
      slot: emptySlot,
      quantity: qty,
      refinement: options.refinement || 0,
      equipped: false,
      equipment_slot: item.equipment_slot || null,
      bonus_1_type: options.bonus_1_type || null,
      bonus_1_value: options.bonus_1_value || 0,
      bonus_2_type: options.bonus_2_type || null,
      bonus_2_value: options.bonus_2_value || 0,
      bonus_3_type: options.bonus_3_type || null,
      bonus_3_value: options.bonus_3_value || 0,
      bonus_4_type: options.bonus_4_type || null,
      bonus_4_value: options.bonus_4_value || 0,
      bonus_5_type: options.bonus_5_type || null,
      bonus_5_value: options.bonus_5_value || 0,
      special_bonus_1_type: options.special_bonus_1_type || null,
      special_bonus_1_value: options.special_bonus_1_value || 0,
      special_bonus_2_type: options.special_bonus_2_type || null,
      special_bonus_2_value: options.special_bonus_2_value || 0
    };

    const [id] = await db('character_inventory').insert(insertData);
    return db('character_inventory').where({ id }).first();
  },

  async removeItem(charId, invId, qty) {
    const invItem = await db('character_inventory')
      .where({ id: invId, character_id: charId })
      .first();

    if (!invItem) {
      throw new Error('Item não encontrado no inventário');
    }

    qty = qty || invItem.quantity;

    if (qty >= invItem.quantity) {
      await db('character_inventory').where({ id: invId }).delete();
      return null;
    }

    await db('character_inventory')
      .where({ id: invId })
      .update({ quantity: invItem.quantity - qty });

    return db('character_inventory').where({ id: invId }).first();
  },

  async equipItem(charId, invId) {
    const invItem = await db('character_inventory')
      .join('items', 'character_inventory.item_id', 'items.id')
      .where({ 'character_inventory.id': invId, character_id: charId })
      .select('character_inventory.*', 'items.*', 'character_inventory.id as inv_id')
      .first();

    if (!invItem) {
      throw new Error('Item não encontrado no inventário');
    }

    if (!invItem.equippable) {
      throw new Error('Este item não pode ser equipado');
    }

    const character = await db('characters').where({ id: charId }).first();

    if (invItem.class_required && invItem.class_required !== character.class_id) {
      throw new Error('Classe incompatível para este item');
    }

    if (invItem.level_required > character.level) {
      throw new Error('Nível insuficiente para equipar este item');
    }

    const slot = invItem.equipment_slot;

    // Unequip current item in slot if any
    const currentEquipped = await db('character_inventory')
      .where({ character_id: charId, equipment_slot: slot, equipped: true })
      .first();

    if (currentEquipped) {
      await db('character_inventory')
        .where({ id: currentEquipped.id })
        .update({ equipped: false });
    }

    await db('character_inventory')
      .where({ id: invId })
      .update({ equipped: true, equipment_slot: slot });

    return this.getEquipment(charId);
  },

  async unequipItem(charId, invId) {
    const invItem = await db('character_inventory')
      .where({ id: invId, character_id: charId, equipped: true })
      .first();

    if (!invItem) {
      throw new Error('Item não está equipado');
    }

    await db('character_inventory')
      .where({ id: invId })
      .update({ equipped: false });

    return this.getEquipment(charId);
  },

  async getEquipment(charId) {
    const equippedItems = await db('character_inventory')
      .join('items', 'character_inventory.item_id', 'items.id')
      .where({ character_id: charId, equipped: true })
      .select('character_inventory.*', 'items.*', 'character_inventory.id as inv_id');

    const equipment = {};
    for (const item of equippedItems) {
      equipment[item.equipment_slot] = item;
    }
    return equipment;
  },

  async sellItem(charId, invId, qty) {
    const invItem = await db('character_inventory')
      .join('items', 'character_inventory.item_id', 'items.id')
      .where({ 'character_inventory.id': invId, character_id: charId })
      .select('character_inventory.*', 'items.sell_price', 'items.name')
      .first();

    if (!invItem) {
      throw new Error('Item não encontrado no inventário');
    }

    if (invItem.equipped) {
      throw new Error('Desequipe o item antes de vendê-lo');
    }

    qty = qty || invItem.quantity;
    if (qty > invItem.quantity) {
      throw new Error('Quantidade insuficiente');
    }

    const totalPrice = invItem.sell_price * qty;

    await db('characters')
      .where({ id: charId })
      .increment('gold', totalPrice);

    if (qty >= invItem.quantity) {
      await db('character_inventory').where({ id: invId }).delete();
    } else {
      await db('character_inventory')
        .where({ id: invId })
        .update({ quantity: invItem.quantity - qty });
    }

    const character = await db('characters').where({ id: charId }).first();
    return { gold_earned: totalPrice, new_gold: character.gold, item_name: invItem.name, quantity_sold: qty };
  },

  async useItem(charId, invId, options = {}) {
    const invItem = await db('character_inventory')
      .join('items', 'character_inventory.item_id', 'items.id')
      .where({ 'character_inventory.id': invId, character_id: charId })
      .select('character_inventory.*', 'items.*', 'character_inventory.id as inv_id')
      .first();

    if (!invItem) {
      throw new Error('Item não encontrado no inventário');
    }

    if (invItem.type !== 'consumable' && invItem.type !== 'scroll') {
      throw new Error('Este item não pode ser usado');
    }

    // Skill progression items
    if (invItem.effect_type === 'skill_book' || invItem.effect_type === 'spirit_stone') {
      const skillId = options.skill_id;
      if (!skillId) {
        throw new Error('Skill ID necessario para usar este item');
      }

      let result;
      if (invItem.effect_type === 'skill_book') {
        result = await skillService.readBook(charId, skillId);
      } else {
        result = await skillService.useSpiritStone(charId, skillId);
      }

      // Consume 1 from stack (item is always consumed on valid attempt)
      if (invItem.quantity <= 1) {
        await db('character_inventory').where({ id: invId }).delete();
      } else {
        await db('character_inventory')
          .where({ id: invId })
          .update({ quantity: invItem.quantity - 1 });
      }

      return {
        message: result.success
          ? `${invItem.name} usado com sucesso!`
          : `${invItem.name} falhou: ${result.failure_reason}`,
        skill_result: result,
        item_consumed: true,
      };
    }

    const character = await db('characters').where({ id: charId }).first();
    const updates = {};
    let message = '';

    switch (invItem.effect_type) {
      case 'heal_hp':
        updates.hp = Math.min(character.hp + invItem.effect_value, character.max_hp);
        message = `Recuperou ${updates.hp - character.hp} HP`;
        break;
      case 'heal_mp':
        updates.mp = Math.min(character.mp + invItem.effect_value, character.max_mp);
        message = `Recuperou ${updates.mp - character.mp} MP`;
        break;
      case 'heal_stamina':
        updates.stamina = Math.min(character.stamina + invItem.effect_value, character.max_stamina);
        message = `Recuperou ${updates.stamina - character.stamina} Stamina`;
        break;
      case 'heal_hp_percent':
        const hpRestore = Math.floor(character.max_hp * invItem.effect_value / 100);
        updates.hp = Math.min(character.hp + hpRestore, character.max_hp);
        message = `Recuperou ${updates.hp - character.hp} HP`;
        break;
      case 'heal_mp_percent':
        const mpRestore = Math.floor(character.max_mp * invItem.effect_value / 100);
        updates.mp = Math.min(character.mp + mpRestore, character.max_mp);
        message = `Recuperou ${updates.mp - character.mp} MP`;
        break;
      case 'heal_all':
        updates.hp = Math.min(character.hp + invItem.effect_value, character.max_hp);
        updates.mp = Math.min(character.mp + Math.floor(invItem.effect_value * 0.5), character.max_mp);
        message = `Recuperou HP e MP`;
        break;
      default:
        message = `Usou ${invItem.name}`;
        break;
    }

    if (Object.keys(updates).length > 0) {
      await db('characters').where({ id: charId }).update(updates);
    }

    // Remove 1 from stack
    if (invItem.quantity <= 1) {
      await db('character_inventory').where({ id: invId }).delete();
    } else {
      await db('character_inventory')
        .where({ id: invId })
        .update({ quantity: invItem.quantity - 1 });
    }

    const updatedCharacter = await db('characters').where({ id: charId }).first();
    return { message, character: updatedCharacter };
  }
};
