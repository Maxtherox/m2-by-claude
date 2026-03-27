const router = require('express').Router();
const dialogService = require('../services/dialogService');

// GET /npc/:npcId/character/:charId - Get dialog for NPC based on character state
router.get('/npc/:npcId/character/:charId', async (req, res) => {
  try {
    const result = await dialogService.getDialogForNPC(
      parseInt(req.params.npcId),
      parseInt(req.params.charId)
    );
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /node/:dialogId/:nodeIndex - Get a specific dialog node
router.get('/node/:dialogId/:nodeIndex', async (req, res) => {
  try {
    const node = await dialogService.getDialogNode(
      parseInt(req.params.dialogId),
      parseInt(req.params.nodeIndex)
    );
    res.json({ success: true, data: node });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /action - Execute a dialog action
router.post('/action', async (req, res) => {
  try {
    const { character_id, action, action_param } = req.body;

    if (!character_id || !action) {
      return res.status(400).json({ success: false, error: 'character_id e action são obrigatórios' });
    }

    const result = await dialogService.executeDialogAction(
      parseInt(character_id),
      action,
      action_param
    );
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
