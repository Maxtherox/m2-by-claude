const router = require('express').Router();
const lifeskillService = require('../services/lifeskillService');

async function handlePerform(req, res) {
  try {
    const { character_id, type, area_id } = req.body;
    const result = await lifeskillService.performLifeskill(character_id, type, area_id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

router.get('/:charId', async (req, res) => {
  try {
    const lifeskills = await lifeskillService.getLifeskills(parseInt(req.params.charId));
    res.json({ success: true, data: lifeskills });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/perform', handlePerform);
router.post('/gather', handlePerform);

module.exports = router;
