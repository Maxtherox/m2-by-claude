const router = require('express').Router();
const questService = require('../services/questService');

// GET /available/:charId - List available quests
router.get('/available/:charId', async (req, res) => {
  try {
    const quests = await questService.getAvailableQuests(parseInt(req.params.charId));
    res.json({ success: true, data: quests });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /active/:charId - List active quests with progress
router.get('/active/:charId', async (req, res) => {
  try {
    const quests = await questService.getActiveQuests(parseInt(req.params.charId));
    res.json({ success: true, data: quests });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /completed/:charId - List turned-in quests
router.get('/completed/:charId', async (req, res) => {
  try {
    const quests = await questService.getCompletedQuests(parseInt(req.params.charId));
    res.json({ success: true, data: quests });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /accept - Accept a quest
router.post('/accept', async (req, res) => {
  try {
    const { character_id, quest_id } = req.body;
    if (!character_id || !quest_id) {
      return res.status(400).json({ success: false, error: 'character_id e quest_id são obrigatórios' });
    }
    const result = await questService.acceptQuest(parseInt(character_id), parseInt(quest_id));
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /turn-in - Turn in a completed quest
router.post('/turn-in', async (req, res) => {
  try {
    const { character_id, quest_id } = req.body;
    if (!character_id || !quest_id) {
      return res.status(400).json({ success: false, error: 'character_id e quest_id são obrigatórios' });
    }
    const result = await questService.turnInQuest(parseInt(character_id), parseInt(quest_id));
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /abandon - Abandon an active quest
router.post('/abandon', async (req, res) => {
  try {
    const { character_id, quest_id } = req.body;
    if (!character_id || !quest_id) {
      return res.status(400).json({ success: false, error: 'character_id e quest_id são obrigatórios' });
    }
    const result = await questService.abandonQuest(parseInt(character_id), parseInt(quest_id));
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /progress - Update objective progress
router.post('/progress', async (req, res) => {
  try {
    const { character_id, objective_type, target_id, amount } = req.body;
    if (!character_id || !objective_type || !target_id) {
      return res.status(400).json({ success: false, error: 'character_id, objective_type e target_id são obrigatórios' });
    }
    const result = await questService.updateObjectiveProgress(
      parseInt(character_id),
      objective_type,
      parseInt(target_id),
      amount ? parseInt(amount) : 1
    );
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
