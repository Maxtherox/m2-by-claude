const db = require('../database/connection');
const inventoryService = require('./inventoryService');

module.exports = {
  async getShopItems(npcId) {
    const npc = await db('npcs').where({ id: npcId }).first();
    if (!npc) {
      throw new Error('NPC não encontrado');
    }

    const shopItems = await db('npc_shops')
      .join('items', 'npc_shops.item_id', 'items.id')
      .where({ npc_id: npcId })
      .select(
        'npc_shops.id as shop_entry_id',
        'npc_shops.stock',
        'items.*'
      );

    return {
      npc: { id: npc.id, name: npc.name, type: npc.type, dialog: npc.dialog },
      items: shopItems
    };
  },

  async buyItem(charId, npcId, itemId, qty) {
    qty = qty || 1;

    const shopEntry = await db('npc_shops')
      .where({ npc_id: npcId, item_id: itemId })
      .first();

    if (!shopEntry) {
      throw new Error('Item não disponível nesta loja');
    }

    if (shopEntry.stock !== -1 && shopEntry.stock < qty) {
      throw new Error('Estoque insuficiente');
    }

    const item = await db('items').where({ id: itemId }).first();
    if (!item) {
      throw new Error('Item não encontrado');
    }

    const totalCost = item.buy_price * qty;

    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    if (character.gold < totalCost) {
      throw new Error('Ouro insuficiente');
    }

    // Deduct gold
    await db('characters')
      .where({ id: charId })
      .update({ gold: character.gold - totalCost });

    // Deduct stock if not unlimited
    if (shopEntry.stock !== -1) {
      await db('npc_shops')
        .where({ id: shopEntry.id })
        .update({ stock: shopEntry.stock - qty });
    }

    // Add to inventory
    const invItem = await inventoryService.addItem(charId, itemId, qty);

    return {
      item_name: item.name,
      quantity: qty,
      total_cost: totalCost,
      new_gold: character.gold - totalCost,
      inventory_item: invItem
    };
  }
};
