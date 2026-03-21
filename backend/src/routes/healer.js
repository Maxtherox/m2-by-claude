const router = require('express').Router();
const healerService = require('../services/healerService');

router.post('/heal', async (req, res) => {
  try {
    const { character_id } = req.body;
    const result = await healerService.heal(character_id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
