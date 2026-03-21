const router = require('express').Router();
const craftingService = require('../services/craftingService');

router.get('/recipes/:npcType', async (req, res) => {
  try {
    const recipes = await craftingService.getRecipes(req.params.npcType);
    res.json({ success: true, data: recipes });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/recipe/:recipeId', async (req, res) => {
  try {
    const db = require('../database/connection');
    const recipe = await db('recipes').where({ id: parseInt(req.params.recipeId) }).first();
    if (!recipe) {
      return res.status(404).json({ success: false, error: 'Receita não encontrada' });
    }
    const materials = await db('recipe_materials')
      .join('items', 'recipe_materials.item_id', 'items.id')
      .where({ recipe_id: recipe.id })
      .select('recipe_materials.*', 'items.name as item_name', 'items.rarity');
    const resultItem = await db('items').where({ id: recipe.result_item_id }).first();
    res.json({ success: true, data: { ...recipe, result_item: resultItem, materials } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/craft', async (req, res) => {
  try {
    const { character_id, recipe_id } = req.body;
    const result = await craftingService.craft(character_id, recipe_id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
