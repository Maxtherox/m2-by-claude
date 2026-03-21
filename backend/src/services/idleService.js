const db = require('../database/connection');
const formulas = require('../utils/formulas');
const constants = require('../utils/constants');
const characterService = require('./characterService');
const inventoryService = require('./inventoryService');
const combatService = require('./combatService');

module.exports = {
  async startIdleSession(charId, type, areaId, mobId, duration) {
    if (!['combat', 'mining', 'woodcutting', 'farming'].includes(type)) {
      throw new Error('Tipo de sessão inválido');
    }

    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    // Check for existing active session
    const activeSession = await db('idle_sessions')
      .where({ character_id: charId, completed: false })
      .first();

    if (activeSession) {
      throw new Error('Já existe uma sessão ativa');
    }

    // Validate area
    const area = await db('areas').where({ id: areaId }).first();
    if (!area) {
      throw new Error('Área não encontrada');
    }

    if (type === 'combat') {
      if (!mobId) {
        throw new Error('Monstro deve ser especificado para sessão de combate');
      }
      const mob = await db('mobs').where({ id: mobId, area_id: areaId }).first();
      if (!mob) {
        throw new Error('Monstro não encontrado nesta área');
      }
    } else {
      // Validate resources exist for this lifeskill type
      const resources = await db('area_resources')
        .where({ area_id: areaId, resource_type: type })
        .first();
      if (!resources) {
        throw new Error('Nenhum recurso deste tipo nesta área');
      }
    }

    // Validate stamina for at least one cycle
    const staminaPerCycle = constants.IDLE_STAMINA_COST_PER_CYCLE;
    if (character.stamina < staminaPerCycle) {
      throw new Error('Stamina insuficiente para iniciar sessão');
    }

    // Duration in seconds, min 30s, max 3600s (1 hour)
    const validDuration = Math.max(constants.IDLE_CYCLE_DURATION, Math.min(duration || 300, 3600));

    const [id] = await db('idle_sessions').insert({
      character_id: charId,
      type,
      area_id: areaId,
      mob_id: mobId || null,
      duration: validDuration,
      completed: false,
      results: null
    });

    return {
      session_id: id,
      type,
      area_id: areaId,
      mob_id: mobId,
      duration: validDuration,
      started: true,
      message: `Sessão idle iniciada: ${type} por ${validDuration}s`
    };
  },

  async checkIdleSession(charId) {
    const session = await db('idle_sessions')
      .where({ character_id: charId, completed: false })
      .first();

    if (!session) {
      return { active: false, message: 'Nenhuma sessão ativa' };
    }

    const startTime = new Date(session.start_time).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    const remaining = Math.max(0, session.duration - elapsed);
    const totalCycles = Math.floor(elapsed / constants.IDLE_CYCLE_DURATION);
    const isComplete = elapsed >= session.duration;

    return {
      active: true,
      session_id: session.id,
      type: session.type,
      area_id: session.area_id,
      mob_id: session.mob_id,
      elapsed,
      remaining,
      total_cycles: totalCycles,
      is_complete: isComplete,
      duration: session.duration
    };
  },

  async collectIdleResults(charId) {
    const session = await db('idle_sessions')
      .where({ character_id: charId, completed: false })
      .first();

    if (!session) {
      throw new Error('Nenhuma sessão ativa para coletar');
    }

    const startTime = new Date(session.start_time).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    const totalCycles = Math.floor(elapsed / constants.IDLE_CYCLE_DURATION);

    if (totalCycles < 1) {
      throw new Error('Sessão ainda não completou nenhum ciclo');
    }

    const character = await db('characters').where({ id: charId }).first();

    // Calculate stamina cost
    const maxCyclesByStamina = Math.floor(character.stamina / constants.IDLE_STAMINA_COST_PER_CYCLE);
    const effectiveCycles = Math.min(totalCycles, maxCyclesByStamina);
    const staminaCost = effectiveCycles * constants.IDLE_STAMINA_COST_PER_CYCLE;

    let results = {
      cycles_completed: effectiveCycles,
      stamina_spent: staminaCost,
      items: [],
      exp_gained: 0,
      gold_gained: 0,
      kills: 0
    };

    if (session.type === 'combat') {
      // Simulate combat results
      const mob = await db('mobs').where({ id: session.mob_id }).first();
      if (mob) {
        const charData = await characterService.getCharacter(charId);
        const stats = charData.derived_stats;

        // Estimate kill rate based on stats vs mob
        const playerDps = stats.attack + stats.magic_attack * 0.5;
        const mobEffectiveHp = mob.hp * (1 + mob.defense / 200);
        const turnsToKill = Math.max(1, Math.ceil(mobEffectiveHp / Math.max(1, playerDps * 0.5)));
        const killsPerCycle = Math.max(1, Math.floor(10 / turnsToKill));

        const totalKills = killsPerCycle * effectiveCycles;
        results.kills = totalKills;
        results.exp_gained = totalKills * mob.exp_reward;
        results.gold_gained = totalKills * formulas.rollQuantity(mob.gold_min, mob.gold_max);

        // Roll drops per kill
        const mobDrops = await db('mob_drops')
          .join('items', 'mob_drops.item_id', 'items.id')
          .where({ mob_id: session.mob_id })
          .select('mob_drops.*', 'items.name', 'items.stackable');

        const droppedItems = {};
        for (let i = 0; i < totalKills; i++) {
          for (const drop of mobDrops) {
            if (formulas.rollDrop(drop.drop_chance)) {
              const qty = formulas.rollQuantity(drop.min_quantity, drop.max_quantity);
              if (droppedItems[drop.item_id]) {
                droppedItems[drop.item_id].quantity += qty;
              } else {
                droppedItems[drop.item_id] = {
                  item_id: drop.item_id,
                  name: drop.name,
                  quantity: qty
                };
              }
            }
          }
        }
        results.items = Object.values(droppedItems);
      }
    } else {
      // Gathering results
      const resources = await db('area_resources')
        .join('items', 'area_resources.item_id', 'items.id')
        .where({ area_id: session.area_id, resource_type: session.type })
        .select('area_resources.*', 'items.name');

      const lifeskills = await db('character_lifeskills')
        .where({ character_id: charId })
        .first();

      const levelField = `${session.type}_level`;
      const currentLevel = lifeskills[levelField];

      const availableResources = resources.filter(r => r.level_required <= currentLevel);

      if (availableResources.length > 0) {
        let totalLifeskillExp = 0;
        const gatheredItems = {};

        for (let i = 0; i < effectiveCycles; i++) {
          const numItems = formulas.rollQuantity(1, 3);
          for (let j = 0; j < numItems; j++) {
            const resource = availableResources[Math.floor(Math.random() * availableResources.length)];
            const qty = formulas.rollQuantity(1, 2);

            if (gatheredItems[resource.item_id]) {
              gatheredItems[resource.item_id].quantity += qty;
            } else {
              gatheredItems[resource.item_id] = {
                item_id: resource.item_id,
                name: resource.name,
                quantity: qty
              };
            }
            totalLifeskillExp += resource.exp_reward;
          }
        }

        results.items = Object.values(gatheredItems);
        results.lifeskill_exp = totalLifeskillExp;

        // Update lifeskill exp
        const expField = `${session.type}_exp`;
        let newExp = lifeskills[expField] + totalLifeskillExp;
        let newLevel = currentLevel;
        let expNeeded = formulas.calcLifeskillExpForLevel(newLevel);

        while (newExp >= expNeeded) {
          newExp -= expNeeded;
          newLevel++;
          expNeeded = formulas.calcLifeskillExpForLevel(newLevel);
        }

        const lsUpdate = {};
        lsUpdate[levelField] = newLevel;
        lsUpdate[expField] = newExp;

        await db('character_lifeskills')
          .where({ character_id: charId })
          .update(lsUpdate);

        results.lifeskill_level = newLevel;
        results.lifeskill_level_up = newLevel > currentLevel;
      }
    }

    // Apply results to character
    const updates = {
      stamina: Math.max(0, character.stamina - staminaCost)
    };

    if (results.gold_gained > 0) {
      updates.gold = character.gold + results.gold_gained;
    }

    await db('characters').where({ id: charId }).update(updates);

    // Add items to inventory
    for (const item of results.items) {
      try {
        await inventoryService.addItem(charId, item.item_id, item.quantity);
      } catch (e) {
        // Inventory full, skip remaining
        results.inventory_full = true;
        break;
      }
    }

    // Add exp if combat
    if (results.exp_gained > 0) {
      await characterService.addExperience(charId, results.exp_gained);
    }

    // Mark session completed
    await db('idle_sessions')
      .where({ id: session.id })
      .update({
        completed: true,
        results: JSON.stringify(results)
      });

    return results;
  }
};
