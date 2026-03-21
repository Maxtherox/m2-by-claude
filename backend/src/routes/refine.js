const router = require('express').Router();
const refineService = require('../services/refineService');

router.post('/', async (req, res) => {
  try {
    const { character_id, inv_id } = req.body;
    const result = await refineService.refineItem(character_id, inv_id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
