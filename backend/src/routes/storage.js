const router = require('express').Router();
const storageService = require('../services/storageService');

router.get('/:charId', async (req, res) => {
  try {
    const storage = await storageService.getStorage(parseInt(req.params.charId));
    res.json({ success: true, data: storage });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/deposit', async (req, res) => {
  try {
    const { character_id, inv_id, quantity } = req.body;
    const result = await storageService.depositItem(character_id, inv_id, quantity);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/withdraw', async (req, res) => {
  try {
    const { character_id, storage_id, quantity } = req.body;
    const result = await storageService.withdrawItem(character_id, storage_id, quantity);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
