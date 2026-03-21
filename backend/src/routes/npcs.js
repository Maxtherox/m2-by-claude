const router = require('express').Router();
const db = require('../database/connection');

router.get('/area/:areaId', async (req, res) => {
  try {
    const npcs = await db('npcs').where({ area_id: parseInt(req.params.areaId) });
    res.json({ success: true, data: npcs });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const npc = await db('npcs').where({ id: parseInt(req.params.id) }).first();
    if (!npc) {
      return res.status(404).json({ success: false, error: 'NPC não encontrado' });
    }
    res.json({ success: true, data: npc });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
