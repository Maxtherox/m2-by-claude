const router = require('express').Router();
const areaService = require('../services/areaService');

router.get('/', async (req, res) => {
  try {
    const areas = await areaService.getAreas();
    res.json({ success: true, data: areas });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const area = await areaService.getAreaDetails(parseInt(req.params.id));
    res.json({ success: true, data: area });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/:id/mobs', async (req, res) => {
  try {
    const db = require('../database/connection');
    const mobs = await db('mobs').where({ area_id: parseInt(req.params.id) })
      .select('id', 'name', 'level', 'hp', 'type', 'behavior', 'exp_reward', 'gold_min', 'gold_max');
    res.json({ success: true, data: mobs });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/:id/npcs', async (req, res) => {
  try {
    const db = require('../database/connection');
    const npcs = await db('npcs').where({ area_id: parseInt(req.params.id) })
      .select('id', 'name', 'type', 'description', 'dialog');
    res.json({ success: true, data: npcs });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/:id/resources', async (req, res) => {
  try {
    const db = require('../database/connection');
    const resources = await db('area_resources')
      .join('items', 'area_resources.item_id', 'items.id')
      .where({ area_id: parseInt(req.params.id) })
      .select('area_resources.*', 'items.name as item_name');
    res.json({ success: true, data: resources });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
