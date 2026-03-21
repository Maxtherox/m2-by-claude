const router = require('express').Router();
const idleService = require('../services/idleService');

router.post('/start', async (req, res) => {
  try {
    const { character_id, type, area_id, mob_id, duration } = req.body;
    const result = await idleService.startIdleSession(character_id, type, area_id, mob_id, duration);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/status/:characterId', async (req, res) => {
  try {
    const result = await idleService.checkIdleSession(parseInt(req.params.characterId));
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/collect/:characterId', async (req, res) => {
  try {
    const result = await idleService.collectIdleResults(parseInt(req.params.characterId));
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
