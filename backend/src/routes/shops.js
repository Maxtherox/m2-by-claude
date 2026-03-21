const router = require('express').Router();
const shopService = require('../services/shopService');

router.get('/:npcId', async (req, res) => {
  try {
    const shop = await shopService.getShopItems(parseInt(req.params.npcId));
    res.json({ success: true, data: shop });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/buy', async (req, res) => {
  try {
    const { character_id, npc_id, item_id, quantity } = req.body;
    const result = await shopService.buyItem(character_id, npc_id, item_id, quantity);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
