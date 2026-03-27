const db = require('../database/connection');
const statusEffects = require('../modules/statusEffects');

module.exports = {
  /**
   * Gets all active effects for a character, joined with their definitions.
   */
  async getActiveEffects(charId) {
    const effects = await db('character_active_effects')
      .join('status_effect_definitions', 'character_active_effects.effect_id', 'status_effect_definitions.id')
      .where({ 'character_active_effects.character_id': charId })
      .select(
        'character_active_effects.*',
        'status_effect_definitions.name',
        'status_effect_definitions.type',
        'status_effect_definitions.stat_affected',
        'status_effect_definitions.value',
        'status_effect_definitions.is_percentage',
        'status_effect_definitions.default_duration',
        'status_effect_definitions.stackable',
        'status_effect_definitions.max_stacks',
        'status_effect_definitions.icon',
        'status_effect_definitions.description'
      );

    return effects;
  },

  /**
   * Applies an effect to a character and persists it to the database.
   */
  async applyEffectToCharacter(charId, effectId, source, sourceId) {
    const effectDef = await db('status_effect_definitions')
      .where({ id: effectId })
      .first();

    if (!effectDef) {
      throw new Error('Efeito de status não encontrado');
    }

    // Get current active effects for this character
    const currentEffects = await db('character_active_effects')
      .where({ character_id: charId });

    // Use pure module to calculate new state
    const newEffects = statusEffects.applyEffect(currentEffects, effectDef, source, sourceId);

    // Determine what changed
    const existingRecord = currentEffects.find(
      (e) => e.effect_id === effectId && e.source === source && e.source_id === sourceId
    );

    if (existingRecord) {
      // Update existing record (refreshed duration or added stack)
      const updated = newEffects.find(
        (e) => e.effect_id === effectId && e.source === source && e.source_id === sourceId
      );

      await db('character_active_effects')
        .where({ id: existingRecord.id })
        .update({
          remaining_turns: updated.remaining_turns,
          stacks: updated.stacks,
        });
    } else {
      // Insert new record
      const newEffect = newEffects.find(
        (e) => e.effect_id === effectId && e.source === source && e.source_id === sourceId && !e.id
      );

      await db('character_active_effects').insert({
        character_id: charId,
        effect_id: effectId,
        remaining_turns: newEffect.remaining_turns,
        stacks: newEffect.stacks,
        source: newEffect.source,
        source_id: newEffect.source_id,
        applied_at: newEffect.applied_at,
      });
    }

    return this.getActiveEffects(charId);
  },

  /**
   * Removes an effect from a character and persists the change.
   */
  async removeEffectFromCharacter(charId, effectId) {
    const deleted = await db('character_active_effects')
      .where({ character_id: charId, effect_id: effectId })
      .del();

    if (deleted === 0) {
      throw new Error('Efeito não encontrado no personagem');
    }

    return this.getActiveEffects(charId);
  },

  /**
   * Ticks all active effects for a character: decrements turns, removes expired,
   * calculates DOT/HOT. Persists changes and returns results.
   */
  async tickCharacterEffects(charId) {
    const currentEffects = await db('character_active_effects')
      .where({ character_id: charId });

    const effectDefinitions = await db('status_effect_definitions').select('*');

    const result = statusEffects.tickEffects(currentEffects, effectDefinitions);

    // Remove expired effects
    if (result.expired.length > 0) {
      const expiredIds = result.expired.map((e) => e.id).filter(Boolean);
      if (expiredIds.length > 0) {
        await db('character_active_effects')
          .whereIn('id', expiredIds)
          .del();
      }
    }

    // Update remaining effects
    for (const effect of result.updated) {
      if (effect.id) {
        await db('character_active_effects')
          .where({ id: effect.id })
          .update({ remaining_turns: effect.remaining_turns });
      }
    }

    // Apply DOT damage and HOT heal to character
    if (result.dotDamage > 0 || result.hotHeal > 0) {
      const character = await db('characters').where({ id: charId }).first();
      if (character) {
        let newHp = character.hp - result.dotDamage + result.hotHeal;
        newHp = Math.max(0, Math.min(newHp, character.max_hp));

        await db('characters').where({ id: charId }).update({ hp: newHp });
      }
    }

    return {
      active: result.updated,
      expired: result.expired,
      dot_damage: result.dotDamage,
      hot_heal: result.hotHeal,
    };
  },

  /**
   * Returns aggregate stat modifiers from all active effects.
   */
  async getStatModifiers(charId) {
    const currentEffects = await db('character_active_effects')
      .where({ character_id: charId });

    const effectDefinitions = await db('status_effect_definitions').select('*');

    return statusEffects.calculateStatModifiers(currentEffects, effectDefinitions);
  },
};
