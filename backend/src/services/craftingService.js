const db = require('../database/connection');
const inventoryService = require('./inventoryService');

module.exports = {
  async getRecipes(npcType) {
    const recipes = await db('recipes')
      .where({ npc_type: npcType })
      .select('recipes.*');

    const result = [];
    for (const recipe of recipes) {
      const materials = await db('recipe_materials')
        .join('items', 'recipe_materials.item_id', 'items.id')
        .where({ recipe_id: recipe.id })
        .select('recipe_materials.*', 'items.name as item_name', 'items.rarity');

      const resultItem = await db('items').where({ id: recipe.result_item_id }).first();

      result.push({
        ...recipe,
        result_item: resultItem,
        materials
      });
    }

    return result;
  },

  async craft(charId, recipeId) {
    const recipe = await db('recipes').where({ id: recipeId }).first();
    if (!recipe) {
      throw new Error('Receita não encontrada');
    }

    const materials = await db('recipe_materials')
      .where({ recipe_id: recipeId })
      .select('*');

    // Validate all materials are in inventory
    const inventory = await db('character_inventory')
      .where({ character_id: charId, equipped: false })
      .select('*');

    const materialsToConsume = [];

    for (const mat of materials) {
      let remaining = mat.quantity;
      const invEntries = inventory.filter(i => i.item_id === mat.item_id);

      let totalAvailable = 0;
      const entriesToUse = [];

      for (const entry of invEntries) {
        totalAvailable += entry.quantity;
        entriesToUse.push(entry);
      }

      if (totalAvailable < mat.quantity) {
        const item = await db('items').where({ id: mat.item_id }).first();
        throw new Error(`Material insuficiente: ${item ? item.name : 'item ' + mat.item_id} (necessário: ${mat.quantity}, disponível: ${totalAvailable})`);
      }

      for (const entry of entriesToUse) {
        if (remaining <= 0) break;
        const toRemove = Math.min(entry.quantity, remaining);
        materialsToConsume.push({ inv_id: entry.id, quantity: toRemove });
        remaining -= toRemove;
      }
    }

    // Consume materials
    for (const consume of materialsToConsume) {
      await inventoryService.removeItem(charId, consume.inv_id, consume.quantity);
    }

    // Create result item
    const resultItem = await inventoryService.addItem(charId, recipe.result_item_id, recipe.result_quantity);

    const item = await db('items').where({ id: recipe.result_item_id }).first();

    return {
      recipe_name: recipe.name,
      result_item: item,
      quantity: recipe.result_quantity,
      inventory_item: resultItem,
      message: `Crafting concluído: ${item.name} x${recipe.result_quantity}`
    };
  }
};
