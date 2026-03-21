const router = require('express').Router();
const db = require('../database/connection');

router.get('/', async (req, res) => {
  try {
    const kingdoms = await db('kingdoms').select('*');
    res.json({ success: true, data: kingdoms });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
