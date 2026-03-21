const router = require('express').Router();
const combatService = require('../services/combatService');
const characterService = require('../services/characterService');
const inventoryService = require('../services/inventoryService');

router.post('/start', async (req, res) => {
  try {
    const { character_id, mob_id } = req.body;
    const state = await combatService.startCombat(character_id, mob_id);
    res.json({ success: true, data: state });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/turn', async (req, res) => {
  try {
    const { character_id, combat_state, action } = req.body;
    const result = await combatService.executeTurn(combat_state, action, character_id);

    if (result.finished && result.result && result.result.winner === 'character') {
      const { exp_reward, gold_reward, drops } = result.result;

      const db = require('../database/connection');
      await db('characters').where({ id: character_id }).increment('gold', gold_reward);

      const expResult = await characterService.addExperience(character_id, exp_reward);

      for (const drop of drops) {
        try {
          await inventoryService.addItem(character_id, drop.item_id, drop.quantity, drop);
        } catch (e) {}
      }

      const character = await characterService.getCharacter(character_id);
      await db('characters').where({ id: character_id }).update({
        hp: result.state.character.hp,
        mp: result.state.character.mp
      });

      result.result.character = character;
      result.result.leveled_up = expResult.leveled_up;
      result.result.new_level = expResult.new_level;
    } else if (result.finished && result.result && result.result.winner === 'mob') {
      const db = require('../database/connection');
      const character = await db('characters').where({ id: character_id }).first();
      const goldPenalty = Math.floor(character.gold * 0.05);
      await db('characters').where({ id: character_id }).update({
        hp: Math.floor(character.max_hp * 0.1),
        mp: Math.floor(character.max_mp * 0.1),
        gold: Math.max(0, character.gold - goldPenalty)
      });
      result.result.gold_penalty = goldPenalty;
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
