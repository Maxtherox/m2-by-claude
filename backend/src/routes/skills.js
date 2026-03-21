const router = require('express').Router();
const skillService = require('../services/skillService');

router.get('/class/:classId', async (req, res) => {
  try {
    const skills = await skillService.getClassSkills(parseInt(req.params.classId));
    res.json({ success: true, data: skills });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/character/:charId', async (req, res) => {
  try {
    const skills = await skillService.getCharacterSkills(parseInt(req.params.charId));
    res.json({ success: true, data: skills });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/learn', async (req, res) => {
  try {
    const { character_id, skill_id } = req.body;
    const skill = await skillService.learnSkill(character_id, skill_id);
    res.json({ success: true, data: skill });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/upgrade', async (req, res) => {
  try {
    const { character_id, skill_id } = req.body;
    const skill = await skillService.upgradeSkill(character_id, skill_id);
    res.json({ success: true, data: skill });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
