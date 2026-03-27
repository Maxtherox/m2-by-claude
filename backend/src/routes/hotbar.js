const router = require('express').Router();
const hotbarService = require('../services/hotbarService');

// GET /:charId - Get full hotbar for character
router.get('/:charId', async (req, res) => {
  try {
    const hotbar = await hotbarService.getHotbar(parseInt(req.params.charId));
    res.json({ success: true, data: hotbar });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /set - Set a hotbar slot
router.post('/set', async (req, res) => {
  try {
    const { character_id, slot_index, type, reference_id } = req.body;

    if (character_id === undefined || slot_index === undefined || !type) {
      return res.status(400).json({ success: false, error: 'character_id, slot_index e type são obrigatórios' });
    }

    const hotbar = await hotbarService.setSlot(
      parseInt(character_id),
      parseInt(slot_index),
      type,
      reference_id ? parseInt(reference_id) : null
    );
    res.json({ success: true, data: hotbar });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /clear - Clear a hotbar slot
router.post('/clear', async (req, res) => {
  try {
    const { character_id, slot_index } = req.body;

    if (character_id === undefined || slot_index === undefined) {
      return res.status(400).json({ success: false, error: 'character_id e slot_index são obrigatórios' });
    }

    const hotbar = await hotbarService.clearSlot(
      parseInt(character_id),
      parseInt(slot_index)
    );
    res.json({ success: true, data: hotbar });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /swap - Swap two hotbar slots
router.post('/swap', async (req, res) => {
  try {
    const { character_id, slot_a, slot_b } = req.body;

    if (character_id === undefined || slot_a === undefined || slot_b === undefined) {
      return res.status(400).json({ success: false, error: 'character_id, slot_a e slot_b são obrigatórios' });
    }

    const hotbar = await hotbarService.swapSlots(
      parseInt(character_id),
      parseInt(slot_a),
      parseInt(slot_b)
    );
    res.json({ success: true, data: hotbar });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
