const router = require('express').Router();
const saveService = require('../services/saveService');

// GET /:charId - List save slots for character
router.get('/:charId', async (req, res) => {
  try {
    const slots = await saveService.getSaveSlots(parseInt(req.params.charId));
    res.json({ success: true, data: slots });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /save - Save game
router.post('/save', async (req, res) => {
  try {
    const { character_id, slot_number, label } = req.body;
    if (!character_id || slot_number === undefined || slot_number === null) {
      return res.status(400).json({ success: false, error: 'character_id e slot_number são obrigatórios' });
    }
    const result = await saveService.saveGame(character_id, slot_number, label);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /load - Load game
router.post('/load', async (req, res) => {
  try {
    const { character_id, slot_number } = req.body;
    if (!character_id || slot_number === undefined || slot_number === null) {
      return res.status(400).json({ success: false, error: 'character_id e slot_number são obrigatórios' });
    }
    const character = await saveService.loadGame(character_id, slot_number);
    res.json({ success: true, data: character });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /:charId/:slotNumber - Delete save slot
router.delete('/:charId/:slotNumber', async (req, res) => {
  try {
    const result = await saveService.deleteSave(
      parseInt(req.params.charId),
      parseInt(req.params.slotNumber)
    );
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
