// Pure module for status effect logic - no DB calls.
// Works on data arrays passed in.

/**
 * Applies an effect to the active effects list.
 * If stackable, increments stacks up to max_stacks.
 * Returns a new array (does not mutate input).
 */
function applyEffect(activeEffects, effectDef, source, sourceId) {
  const list = [...activeEffects];

  const existingIndex = list.findIndex(
    (e) => e.effect_id === effectDef.id && e.source === source && e.source_id === sourceId
  );

  if (existingIndex !== -1 && effectDef.stackable) {
    const existing = { ...list[existingIndex] };
    if (existing.stacks < (effectDef.max_stacks || 1)) {
      existing.stacks += 1;
    }
    // Refresh duration on reapply
    existing.remaining_turns = effectDef.default_duration;
    list[existingIndex] = existing;
    return list;
  }

  if (existingIndex !== -1 && !effectDef.stackable) {
    // Refresh duration for non-stackable effects
    const existing = { ...list[existingIndex] };
    existing.remaining_turns = effectDef.default_duration;
    list[existingIndex] = existing;
    return list;
  }

  // New effect
  list.push({
    effect_id: effectDef.id,
    remaining_turns: effectDef.default_duration,
    stacks: 1,
    source: source,
    source_id: sourceId,
    applied_at: new Date().toISOString(),
  });

  return list;
}

/**
 * Removes an effect by effect_id.
 * Returns a new array.
 */
function removeEffect(activeEffects, effectId) {
  return activeEffects.filter((e) => e.effect_id !== effectId);
}

/**
 * Ticks all active effects: decrements remaining_turns, removes expired.
 * Calculates DOT damage and HOT healing from effects with type 'dot' or 'hot'.
 * Returns { updated, expired, dotDamage, hotHeal }.
 */
function tickEffects(activeEffects, effectDefinitions) {
  const defMap = {};
  for (const def of effectDefinitions) {
    defMap[def.id] = def;
  }

  const updated = [];
  const expired = [];
  let dotDamage = 0;
  let hotHeal = 0;

  for (const effect of activeEffects) {
    const def = defMap[effect.effect_id];
    const ticked = { ...effect, remaining_turns: effect.remaining_turns - 1 };

    // Apply DOT/HOT per tick
    if (def) {
      const stacks = ticked.stacks || 1;
      if (def.type === 'dot') {
        dotDamage += (def.value || 0) * stacks;
      } else if (def.type === 'hot') {
        hotHeal += (def.value || 0) * stacks;
      }
    }

    if (ticked.remaining_turns <= 0) {
      expired.push(ticked);
    } else {
      updated.push(ticked);
    }
  }

  return { updated, expired, dotDamage, hotHeal };
}

/**
 * Calculates aggregate stat modifiers from all active buff/debuff effects.
 * Returns an object like { attack: +X, defense: +Y, speed: -Z, ... }
 */
function calculateStatModifiers(activeEffects, effectDefinitions) {
  const defMap = {};
  for (const def of effectDefinitions) {
    defMap[def.id] = def;
  }

  const modifiers = {};

  for (const effect of activeEffects) {
    const def = defMap[effect.effect_id];
    if (!def || !def.stat_affected) continue;
    if (def.type !== 'buff' && def.type !== 'debuff') continue;

    const stat = def.stat_affected;
    const stacks = effect.stacks || 1;
    let value = (def.value || 0) * stacks;

    if (def.type === 'debuff') {
      value = -Math.abs(value);
    }

    if (!modifiers[stat]) {
      modifiers[stat] = 0;
    }
    modifiers[stat] += value;
  }

  return modifiers;
}

/**
 * Returns true if the character has any active stun effect.
 */
function isStunned(activeEffects, effectDefinitions) {
  const defMap = {};
  for (const def of effectDefinitions) {
    defMap[def.id] = def;
  }

  return activeEffects.some((e) => {
    const def = defMap[e.effect_id];
    return def && def.type === 'stun';
  });
}

/**
 * Returns true if the character has any active slow effect.
 */
function isSlowed(activeEffects, effectDefinitions) {
  const defMap = {};
  for (const def of effectDefinitions) {
    defMap[def.id] = def;
  }

  return activeEffects.some((e) => {
    const def = defMap[e.effect_id];
    return def && def.type === 'slow';
  });
}

module.exports = {
  applyEffect,
  removeEffect,
  tickEffects,
  calculateStatModifiers,
  isStunned,
  isSlowed,
};
