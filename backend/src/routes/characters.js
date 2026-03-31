const router = require('express').Router();
const characterService = require('../services/characterService');

// POST / - Create character
router.post('/', async (req, res) => {
  try {
    const character = await characterService.createCharacter(req.body);
    res.status(201).json({ success: true, data: character });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /:id - Load character with full stats
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'ID inválido' });
    const character = await characterService.getCharacter(id);
    res.json({ success: true, data: character });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

// PUT /:id - Save/update character
router.put('/:id', async (req, res) => {
  try {
    const db = require('../database/connection');
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'ID inválido' });

    const character = await db('characters').where({ id }).first();
    if (!character) {
      return res.status(404).json({ success: false, error: 'Personagem não encontrado' });
    }

    const allowedFields = ['hp', 'mp', 'stamina', 'current_area_id', 'appearance'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = field === 'appearance' ? JSON.stringify(req.body[field]) : req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'Nenhum campo válido para atualizar' });
    }

    updates.updated_at = new Date();
    await db('characters').where({ id }).update(updates);

    const updated = await characterService.getCharacter(id);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /:id/allocate-points
router.post('/:id/allocate-points', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'ID inválido' });
    const character = await characterService.allocateStatusPoints(id, req.body);
    res.json({ success: true, data: character });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /:id/add-honor
router.post('/:id/add-honor', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'ID inválido' });
    const { amount } = req.body;
    if (amount === undefined || amount === null) {
      return res.status(400).json({ success: false, error: 'amount é obrigatório' });
    }
    const character = await characterService.addHonor(id, amount);
    res.json({ success: true, data: character });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
