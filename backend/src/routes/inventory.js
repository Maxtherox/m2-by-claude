const router = require('express').Router();
const inventoryService = require('../services/inventoryService');

// GET /:characterId - Get full inventory
router.get('/:characterId', async (req, res) => {
  try {
    const inventory = await inventoryService.getInventory(parseInt(req.params.characterId));
    res.json({ success: true, data: inventory });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /equip - Equip an item
router.post('/equip', async (req, res) => {
  try {
    const { character_id, inv_id } = req.body;
    const equipment = await inventoryService.equipItem(character_id, inv_id);
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /unequip - Unequip an item
router.post('/unequip', async (req, res) => {
  try {
    const { character_id, inv_id } = req.body;
    const equipment = await inventoryService.unequipItem(character_id, inv_id);
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /use - Use a consumable item
router.post('/use', async (req, res) => {
  try {
    const { character_id, inv_id } = req.body;
    const result = await inventoryService.useItem(character_id, inv_id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /sell - Sell an item
router.post('/sell', async (req, res) => {
  try {
    const { character_id, inv_id, quantity } = req.body;
    const result = await inventoryService.sellItem(character_id, inv_id, quantity);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
