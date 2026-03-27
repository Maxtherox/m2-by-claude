const db = require('../database/connection');

const HOTBAR_SIZE = 8;

module.exports = {
  /**
   * Returns all 8 hotbar slots for a character.
   * Fills missing slots with empty placeholders.
   */
  async getHotbar(charId) {
    const slots = await db('character_hotbar')
      .where({ character_id: charId })
      .orderBy('slot_index', 'asc');

    const slotMap = {};
    for (const slot of slots) {
      slotMap[slot.slot_index] = slot;
    }

    const hotbar = [];
    for (let i = 0; i < HOTBAR_SIZE; i++) {
      if (slotMap[i]) {
        hotbar.push(slotMap[i]);
      } else {
        hotbar.push({
          slot_index: i,
          type: 'empty',
          reference_id: null,
          keybind: null,
        });
      }
    }

    return hotbar;
  },

  /**
   * Sets a hotbar slot to a specific type and reference.
   * type can be: 'skill', 'item', 'empty'
   */
  async setSlot(charId, slotIndex, type, referenceId) {
    if (slotIndex < 0 || slotIndex >= HOTBAR_SIZE) {
      throw new Error(`Slot deve ser entre 0 e ${HOTBAR_SIZE - 1}`);
    }

    const validTypes = ['skill', 'item', 'empty'];
    if (!validTypes.includes(type)) {
      throw new Error('Tipo inválido. Use: skill, item ou empty');
    }

    const existing = await db('character_hotbar')
      .where({ character_id: charId, slot_index: slotIndex })
      .first();

    if (type === 'empty') {
      if (existing) {
        await db('character_hotbar')
          .where({ id: existing.id })
          .update({ type: 'empty', reference_id: null });
      }
      return this.getHotbar(charId);
    }

    if (existing) {
      await db('character_hotbar')
        .where({ id: existing.id })
        .update({ type, reference_id: referenceId });
    } else {
      await db('character_hotbar').insert({
        character_id: charId,
        slot_index: slotIndex,
        type,
        reference_id: referenceId,
        keybind: null,
      });
    }

    return this.getHotbar(charId);
  },

  /**
   * Clears a hotbar slot (sets it to empty).
   */
  async clearSlot(charId, slotIndex) {
    if (slotIndex < 0 || slotIndex >= HOTBAR_SIZE) {
      throw new Error(`Slot deve ser entre 0 e ${HOTBAR_SIZE - 1}`);
    }

    const existing = await db('character_hotbar')
      .where({ character_id: charId, slot_index: slotIndex })
      .first();

    if (existing) {
      await db('character_hotbar')
        .where({ id: existing.id })
        .update({ type: 'empty', reference_id: null });
    }

    return this.getHotbar(charId);
  },

  /**
   * Swaps two hotbar slots.
   */
  async swapSlots(charId, slotA, slotB) {
    if (slotA < 0 || slotA >= HOTBAR_SIZE || slotB < 0 || slotB >= HOTBAR_SIZE) {
      throw new Error(`Slots devem ser entre 0 e ${HOTBAR_SIZE - 1}`);
    }

    if (slotA === slotB) {
      return this.getHotbar(charId);
    }

    const recordA = await db('character_hotbar')
      .where({ character_id: charId, slot_index: slotA })
      .first();

    const recordB = await db('character_hotbar')
      .where({ character_id: charId, slot_index: slotB })
      .first();

    const typeA = recordA ? recordA.type : 'empty';
    const refA = recordA ? recordA.reference_id : null;
    const typeB = recordB ? recordB.type : 'empty';
    const refB = recordB ? recordB.reference_id : null;

    // Update or insert slot A with B's data
    if (recordA) {
      await db('character_hotbar')
        .where({ id: recordA.id })
        .update({ type: typeB, reference_id: refB });
    } else if (typeB !== 'empty') {
      await db('character_hotbar').insert({
        character_id: charId,
        slot_index: slotA,
        type: typeB,
        reference_id: refB,
        keybind: null,
      });
    }

    // Update or insert slot B with A's data
    if (recordB) {
      await db('character_hotbar')
        .where({ id: recordB.id })
        .update({ type: typeA, reference_id: refA });
    } else if (typeA !== 'empty') {
      await db('character_hotbar').insert({
        character_id: charId,
        slot_index: slotB,
        type: typeA,
        reference_id: refA,
        keybind: null,
      });
    }

    return this.getHotbar(charId);
  },

  /**
   * Initializes 8 empty hotbar slots for a new character.
   */
  async initializeHotbar(charId) {
    const existing = await db('character_hotbar')
      .where({ character_id: charId })
      .first();

    if (existing) {
      throw new Error('Hotbar já inicializada para este personagem');
    }

    const slots = [];
    for (let i = 0; i < HOTBAR_SIZE; i++) {
      slots.push({
        character_id: charId,
        slot_index: i,
        type: 'empty',
        reference_id: null,
        keybind: null,
      });
    }

    await db('character_hotbar').insert(slots);

    return this.getHotbar(charId);
  },
};
