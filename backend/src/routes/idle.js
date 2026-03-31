const router = require('express').Router();
const idleService = require('../services/idleService');

router.post('/start', async (req, res) => {
  try {
    const { character_id, type, area_id, mob_id, duration } = req.body;
    if (!character_id || !type || !area_id) {
      return res.status(400).json({ success: false, error: 'character_id, type e area_id são obrigatórios' });
    }
    const result = await idleService.startIdleSession(character_id, type, area_id, mob_id, duration);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /check/:characterId — rota que o cliente usa
router.get('/check/:characterId', async (req, res) => {
  try {
    const id = parseInt(req.params.characterId);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'ID inválido' });
    const result = await idleService.checkIdleSession(id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /collect — rota que o cliente usa (character_id no body)
router.post('/collect', async (req, res) => {
  try {
    const { character_id } = req.body;
    if (!character_id) return res.status(400).json({ success: false, error: 'character_id é obrigatório' });
    const result = await idleService.collectIdleResults(parseInt(character_id));
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
