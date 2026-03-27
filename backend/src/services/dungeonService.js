const db = require('../database/connection');

module.exports = {
  async getDungeons() {
    const dungeons = await db('dungeons').select('*');
    return dungeons;
  },

  async getDungeonDetails(dungeonId) {
    const dungeon = await db('dungeons').where({ id: dungeonId }).first();
    if (!dungeon) {
      throw new Error('Dungeon não encontrada');
    }

    const floors = await db('dungeon_floors')
      .where({ dungeon_id: dungeonId })
      .orderBy('floor_number', 'asc');

    return {
      ...dungeon,
      floors
    };
  },

  async startRun(charId, dungeonId) {
    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    const dungeon = await db('dungeons').where({ id: dungeonId }).first();
    if (!dungeon) {
      throw new Error('Dungeon não encontrada');
    }

    // Check for active run
    const activeRun = await db('character_dungeon_runs')
      .where({ character_id: charId, status: 'active' })
      .first();

    if (activeRun) {
      throw new Error('Personagem já possui uma dungeon ativa');
    }

    // Validate level requirement
    if (character.level < dungeon.level_required) {
      throw new Error(`Nível mínimo necessário: ${dungeon.level_required}`);
    }

    // Validate gold
    const entryCost = dungeon.entry_cost_gold || 0;
    if (character.gold < entryCost) {
      throw new Error(`Ouro insuficiente. Necessário: ${entryCost}`);
    }

    // Deduct entry cost
    if (entryCost > 0) {
      await db('characters').where({ id: charId }).update({
        gold: character.gold - entryCost
      });
    }

    // Get first floor info
    const firstFloor = await db('dungeon_floors')
      .where({ dungeon_id: dungeonId, floor_number: 1 })
      .first();

    // Create the run
    const [runId] = await db('character_dungeon_runs').insert({
      character_id: charId,
      dungeon_id: dungeonId,
      current_floor: 1,
      status: 'active',
      started_at: new Date().toISOString(),
      ended_at: null,
      results: JSON.stringify({ floors_cleared: 0, loot: [], total_exp: 0 })
    });

    const run = await db('character_dungeon_runs').where({ id: runId }).first();

    return {
      ...run,
      results: typeof run.results === 'string' ? JSON.parse(run.results) : run.results,
      floor: firstFloor
    };
  },

  async getCurrentRun(charId) {
    const run = await db('character_dungeon_runs')
      .where({ character_id: charId, status: 'active' })
      .first();

    if (!run) {
      return null;
    }

    const dungeon = await db('dungeons').where({ id: run.dungeon_id }).first();
    const currentFloor = await db('dungeon_floors')
      .where({ dungeon_id: run.dungeon_id, floor_number: run.current_floor })
      .first();

    return {
      ...run,
      results: typeof run.results === 'string' ? JSON.parse(run.results) : run.results,
      dungeon,
      floor: currentFloor
    };
  },

  async advanceFloor(charId) {
    const run = await db('character_dungeon_runs')
      .where({ character_id: charId, status: 'active' })
      .first();

    if (!run) {
      throw new Error('Nenhuma dungeon ativa');
    }

    const dungeon = await db('dungeons').where({ id: run.dungeon_id }).first();
    const results = typeof run.results === 'string' ? JSON.parse(run.results) : (run.results || {});
    const nextFloorNumber = run.current_floor + 1;

    // Check if this was the last floor
    if (nextFloorNumber > dungeon.total_floors) {
      // Complete the run
      const rewardPool = dungeon.reward_pool
        ? (typeof dungeon.reward_pool === 'string' ? JSON.parse(dungeon.reward_pool) : dungeon.reward_pool)
        : [];

      results.completed = true;
      results.rewards = rewardPool;

      await db('character_dungeon_runs').where({ id: run.id }).update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        results: JSON.stringify(results)
      });

      const completedRun = await db('character_dungeon_runs').where({ id: run.id }).first();

      return {
        ...completedRun,
        results: typeof completedRun.results === 'string' ? JSON.parse(completedRun.results) : completedRun.results,
        dungeon,
        completed: true,
        rewards: rewardPool
      };
    }

    // Advance to next floor
    await db('character_dungeon_runs').where({ id: run.id }).update({
      current_floor: nextFloorNumber
    });

    const nextFloor = await db('dungeon_floors')
      .where({ dungeon_id: run.dungeon_id, floor_number: nextFloorNumber })
      .first();

    const updatedRun = await db('character_dungeon_runs').where({ id: run.id }).first();

    return {
      ...updatedRun,
      results: typeof updatedRun.results === 'string' ? JSON.parse(updatedRun.results) : updatedRun.results,
      dungeon,
      floor: nextFloor,
      completed: false
    };
  },

  async completeFloor(charId, floorResults) {
    const run = await db('character_dungeon_runs')
      .where({ character_id: charId, status: 'active' })
      .first();

    if (!run) {
      throw new Error('Nenhuma dungeon ativa');
    }

    const results = typeof run.results === 'string' ? JSON.parse(run.results) : (run.results || {});

    results.floors_cleared = (results.floors_cleared || 0) + 1;

    if (!results.floor_details) {
      results.floor_details = [];
    }
    results.floor_details.push({
      floor: run.current_floor,
      ...floorResults
    });

    // Accumulate loot and exp from floor results
    if (floorResults.loot) {
      if (!results.loot) results.loot = [];
      results.loot = results.loot.concat(floorResults.loot);
    }
    if (floorResults.exp) {
      results.total_exp = (results.total_exp || 0) + floorResults.exp;
    }

    await db('character_dungeon_runs').where({ id: run.id }).update({
      results: JSON.stringify(results)
    });

    const updatedRun = await db('character_dungeon_runs').where({ id: run.id }).first();

    return {
      ...updatedRun,
      results: typeof updatedRun.results === 'string' ? JSON.parse(updatedRun.results) : updatedRun.results
    };
  },

  async abandonRun(charId) {
    const run = await db('character_dungeon_runs')
      .where({ character_id: charId, status: 'active' })
      .first();

    if (!run) {
      throw new Error('Nenhuma dungeon ativa');
    }

    await db('character_dungeon_runs').where({ id: run.id }).update({
      status: 'abandoned',
      ended_at: new Date().toISOString()
    });

    const updatedRun = await db('character_dungeon_runs').where({ id: run.id }).first();

    return {
      ...updatedRun,
      results: typeof updatedRun.results === 'string' ? JSON.parse(updatedRun.results) : updatedRun.results
    };
  },

  async getRunResults(runId) {
    const run = await db('character_dungeon_runs').where({ id: runId }).first();
    if (!run) {
      throw new Error('Run não encontrada');
    }

    const dungeon = await db('dungeons').where({ id: run.dungeon_id }).first();

    return {
      ...run,
      results: typeof run.results === 'string' ? JSON.parse(run.results) : run.results,
      dungeon
    };
  }
};
