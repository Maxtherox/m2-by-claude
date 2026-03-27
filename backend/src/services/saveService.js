const db = require('../database/connection');

module.exports = {
  async saveGame(charId, slotNumber, label) {
    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    // Collect all character data
    const inventory = await db('character_inventory')
      .where({ character_id: charId })
      .select('*');

    const skills = await db('character_skills')
      .where({ character_id: charId })
      .select('*');

    const lifeskills = await db('character_lifeskills')
      .where({ character_id: charId })
      .select('*');

    const quests = await db('character_quests')
      .where({ character_id: charId })
      .select('*');

    const hotbar = await db('character_hotbar')
      .where({ character_id: charId })
      .select('*');

    const activeEffects = await db('character_active_effects')
      .where({ character_id: charId })
      .select('*');

    const dungeonRun = await db('character_dungeon_runs')
      .where({ character_id: charId, status: 'active' })
      .first();

    const snapshot = {
      character,
      inventory,
      skills,
      lifeskills,
      quests,
      hotbar,
      active_effects: activeEffects,
      dungeon_run: dungeonRun || null,
      saved_at: new Date().toISOString()
    };

    // Check if slot already exists
    const existingSlot = await db('save_slots')
      .where({ character_id: charId, slot_number: slotNumber })
      .first();

    if (existingSlot) {
      await db('save_slots')
        .where({ character_id: charId, slot_number: slotNumber })
        .update({
          snapshot: JSON.stringify(snapshot),
          label: label || existingSlot.label,
          saved_at: new Date().toISOString()
        });
    } else {
      await db('save_slots').insert({
        character_id: charId,
        slot_number: slotNumber,
        snapshot: JSON.stringify(snapshot),
        label: label || `Save ${slotNumber}`,
        saved_at: new Date().toISOString()
      });
    }

    const saveSlot = await db('save_slots')
      .where({ character_id: charId, slot_number: slotNumber })
      .first();

    return {
      id: saveSlot.id,
      character_id: saveSlot.character_id,
      slot_number: saveSlot.slot_number,
      label: saveSlot.label,
      saved_at: saveSlot.saved_at
    };
  },

  async loadGame(charId, slotNumber) {
    const saveSlot = await db('save_slots')
      .where({ character_id: charId, slot_number: slotNumber })
      .first();

    if (!saveSlot) {
      throw new Error('Save não encontrado');
    }

    const snapshot = typeof saveSlot.snapshot === 'string'
      ? JSON.parse(saveSlot.snapshot)
      : saveSlot.snapshot;

    await db.transaction(async (trx) => {
      // Restore character row
      const { id, created_at, ...charData } = snapshot.character;
      await trx('characters').where({ id: charId }).update(charData);

      // Clear and re-insert inventory
      await trx('character_inventory').where({ character_id: charId }).del();
      if (snapshot.inventory && snapshot.inventory.length > 0) {
        const inventoryRows = snapshot.inventory.map(row => {
          const { id, ...rest } = row;
          return { ...rest, character_id: charId };
        });
        await trx('character_inventory').insert(inventoryRows);
      }

      // Clear and re-insert skills
      await trx('character_skills').where({ character_id: charId }).del();
      if (snapshot.skills && snapshot.skills.length > 0) {
        const skillRows = snapshot.skills.map(row => {
          const { id, ...rest } = row;
          return { ...rest, character_id: charId };
        });
        await trx('character_skills').insert(skillRows);
      }

      // Clear and re-insert lifeskills
      await trx('character_lifeskills').where({ character_id: charId }).del();
      if (snapshot.lifeskills && snapshot.lifeskills.length > 0) {
        const lifeskillRows = snapshot.lifeskills.map(row => {
          const { id, ...rest } = row;
          return { ...rest, character_id: charId };
        });
        await trx('character_lifeskills').insert(lifeskillRows);
      }

      // Clear and re-insert quests
      await trx('character_quests').where({ character_id: charId }).del();
      if (snapshot.quests && snapshot.quests.length > 0) {
        const questRows = snapshot.quests.map(row => {
          const { id, ...rest } = row;
          return { ...rest, character_id: charId };
        });
        await trx('character_quests').insert(questRows);
      }

      // Clear and re-insert hotbar
      await trx('character_hotbar').where({ character_id: charId }).del();
      if (snapshot.hotbar && snapshot.hotbar.length > 0) {
        const hotbarRows = snapshot.hotbar.map(row => {
          const { id, ...rest } = row;
          return { ...rest, character_id: charId };
        });
        await trx('character_hotbar').insert(hotbarRows);
      }

      // Clear and re-insert active effects
      await trx('character_active_effects').where({ character_id: charId }).del();
      if (snapshot.active_effects && snapshot.active_effects.length > 0) {
        const effectRows = snapshot.active_effects.map(row => {
          const { id, ...rest } = row;
          return { ...rest, character_id: charId };
        });
        await trx('character_active_effects').insert(effectRows);
      }
    });

    const loadedCharacter = await db('characters').where({ id: charId }).first();
    return loadedCharacter;
  },

  async getSaveSlots(charId) {
    const slots = await db('save_slots')
      .where({ character_id: charId })
      .select('id', 'character_id', 'slot_number', 'label', 'saved_at')
      .orderBy('slot_number', 'asc');

    return slots;
  },

  async deleteSave(charId, slotNumber) {
    const slot = await db('save_slots')
      .where({ character_id: charId, slot_number: slotNumber })
      .first();

    if (!slot) {
      throw new Error('Save não encontrado');
    }

    await db('save_slots')
      .where({ character_id: charId, slot_number: slotNumber })
      .del();

    return { deleted: true, slot_number: slotNumber };
  }
};
