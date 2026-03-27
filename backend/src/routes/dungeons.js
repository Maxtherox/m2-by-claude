const router = require('express').Router();
const dungeonService = require('../services/dungeonService');

// GET / - List all dungeons
router.get('/', async (req, res) => {
  try {
    const dungeons = await dungeonService.getDungeons();
    res.json({ success: true, data: dungeons });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /run/:charId - Get current active run
router.get('/run/:charId', async (req, res) => {
  try {
    const run = await dungeonService.getCurrentRun(parseInt(req.params.charId));
    res.json({ success: true, data: run });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /:id - Get dungeon details with floors
router.get('/:id', async (req, res) => {
  try {
    const dungeon = await dungeonService.getDungeonDetails(parseInt(req.params.id));
    res.json({ success: true, data: dungeon });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

// POST /start - Start a dungeon run
router.post('/start', async (req, res) => {
  try {
    const { character_id, dungeon_id } = req.body;
    if (!character_id || !dungeon_id) {
      return res.status(400).json({ success: false, error: 'character_id e dungeon_id são obrigatórios' });
    }
    const run = await dungeonService.startRun(character_id, dungeon_id);
    res.status(201).json({ success: true, data: run });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /advance - Advance to next floor
router.post('/advance', async (req, res) => {
  try {
    const { character_id } = req.body;
    if (!character_id) {
      return res.status(400).json({ success: false, error: 'character_id é obrigatório' });
    }
    const run = await dungeonService.advanceFloor(character_id);
    res.json({ success: true, data: run });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /complete-floor - Complete current floor
router.post('/complete-floor', async (req, res) => {
  try {
    const { character_id, results } = req.body;
    if (!character_id) {
      return res.status(400).json({ success: false, error: 'character_id é obrigatório' });
    }
    const run = await dungeonService.completeFloor(character_id, results || {});
    res.json({ success: true, data: run });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /abandon - Abandon current run
router.post('/abandon', async (req, res) => {
  try {
    const { character_id } = req.body;
    if (!character_id) {
      return res.status(400).json({ success: false, error: 'character_id é obrigatório' });
    }
    const run = await dungeonService.abandonRun(character_id);
    res.json({ success: true, data: run });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
