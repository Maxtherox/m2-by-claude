const router = require('express').Router();
const statusEffectService = require('../services/statusEffectService');

// GET /:charId - Get all active effects for a character
router.get('/:charId', async (req, res) => {
  try {
    const effects = await statusEffectService.getActiveEffects(parseInt(req.params.charId));
    res.json({ success: true, data: effects });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /apply - Apply an effect to a character
router.post('/apply', async (req, res) => {
  try {
    const { character_id, effect_id, source, source_id } = req.body;

    if (!character_id || !effect_id) {
      return res.status(400).json({ success: false, error: 'character_id e effect_id são obrigatórios' });
    }

    const effects = await statusEffectService.applyEffectToCharacter(
      parseInt(character_id),
      parseInt(effect_id),
      source || null,
      source_id ? parseInt(source_id) : null
    );
    res.json({ success: true, data: effects });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /remove - Remove an effect from a character
router.post('/remove', async (req, res) => {
  try {
    const { character_id, effect_id } = req.body;

    if (!character_id || !effect_id) {
      return res.status(400).json({ success: false, error: 'character_id e effect_id são obrigatórios' });
    }

    const effects = await statusEffectService.removeEffectFromCharacter(
      parseInt(character_id),
      parseInt(effect_id)
    );
    res.json({ success: true, data: effects });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /tick - Tick all effects for a character (advance one turn)
router.post('/tick', async (req, res) => {
  try {
    const { character_id } = req.body;

    if (!character_id) {
      return res.status(400).json({ success: false, error: 'character_id é obrigatório' });
    }

    const result = await statusEffectService.tickCharacterEffects(parseInt(character_id));
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
