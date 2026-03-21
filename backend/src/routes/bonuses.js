const router = require('express').Router();
const bonusService = require('../services/bonusService');

router.post('/add', async (req, res) => {
  try {
    const { character_id, inv_id, scroll_type } = req.body;
    const result = await bonusService.addBonus(character_id, inv_id, scroll_type);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/reroll', async (req, res) => {
  try {
    const { character_id, inv_id, bonus_slot, scroll_type } = req.body;
    const result = await bonusService.rerollBonus(character_id, inv_id, bonus_slot, scroll_type);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/special', async (req, res) => {
  try {
    const { character_id, inv_id } = req.body;
    const result = await bonusService.addBonus(character_id, inv_id, 'special');
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
