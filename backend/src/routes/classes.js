const router = require('express').Router();
const db = require('../database/connection');

router.get('/', async (req, res) => {
  try {
    const classes = await db('classes').select('*');
    res.json({ success: true, data: classes });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
