const router = require('express').Router();
const db = require('../database/connection');
const combatService = require('../services/combatService');
const characterService = require('../services/characterService');
const inventoryService = require('../services/inventoryService');

router.post('/start', async (req, res) => {
  try {
    const { character_id, mob_id } = req.body;
    if (!character_id || !mob_id) {
      return res.status(400).json({ success: false, error: 'character_id e mob_id são obrigatórios' });
    }
    const state = await combatService.startCombat(character_id, mob_id);
    res.json({ success: true, data: state });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/turn', async (req, res) => {
  try {
    const { character_id, combat_state, action } = req.body;
    if (!character_id || !combat_state || !action) {
      return res.status(400).json({ success: false, error: 'character_id, combat_state e action são obrigatórios' });
    }

    // Flee action — handled separately
    if (action.type === 'flee') {
      const character = await db('characters').where({ id: character_id }).first();
      const fleeChance = 50 + (character.dexterity || 0) * 0.5; // 50% base + DEX bonus
      const roll = Math.random() * 100;

      if (roll < fleeChance) {
        // Flee success — lose 3% gold
        const goldLoss = Math.floor(character.gold * 0.03);
        await db('characters').where({ id: character_id }).update({
          gold: Math.max(0, character.gold - goldLoss),
        });
        return res.json({
          success: true,
          data: {
            state: combat_state,
            log: [{ turn: combat_state.turn, actor: 'system', action: 'flee', message: `Fugiu do combate! Perdeu ${goldLoss} de ouro.` }],
            finished: true,
            result: { winner: 'flee', gold_penalty: goldLoss },
          },
        });
      } else {
        // Flee failed — mob gets a free attack
        const result = await combatService.executeTurn(combat_state, { type: 'flee_fail' }, character_id);
        return res.json({ success: true, data: result });
      }
    }

    const result = await combatService.executeTurn(combat_state, action, character_id);

    if (result.finished && result.result && result.result.winner === 'character') {
      const { exp_reward, gold_reward, drops } = result.result;

      await db('characters').where({ id: character_id }).increment('gold', gold_reward);

      const expResult = await characterService.addExperience(character_id, exp_reward);

      for (const drop of drops) {
        try {
          await inventoryService.addItem(character_id, drop.item_id, drop.quantity, drop);
        } catch (e) {
          console.error(`[Combat] Falha ao adicionar drop item_id=${drop.item_id} para char=${character_id}:`, e.message);
        }
      }

      await db('characters').where({ id: character_id }).update({
        hp: result.state.character.hp,
        mp: result.state.character.mp,
      });

      const character = await characterService.getCharacter(character_id);
      result.result.character = character;
      result.result.leveled_up = expResult.leveled_up;
      result.result.new_level = expResult.new_level;
    } else if (result.finished && result.result && result.result.winner === 'mob') {
      // Player died — respawn at kingdom start area
      const character = await db('characters')
        .join('kingdoms', 'characters.kingdom_id', 'kingdoms.id')
        .where('characters.id', character_id)
        .select('characters.*', 'kingdoms.start_area_id')
        .first();

      const goldPenalty = Math.floor(character.gold * 0.05);
      const respawnAreaId = character.start_area_id || 1;

      await db('characters').where({ id: character_id }).update({
        hp: Math.floor(character.max_hp * 0.1),
        mp: Math.floor(character.max_mp * 0.1),
        gold: Math.max(0, character.gold - goldPenalty),
        current_area_id: respawnAreaId,
      });

      result.result.gold_penalty = goldPenalty;
      result.result.respawn_area_id = respawnAreaId;
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
