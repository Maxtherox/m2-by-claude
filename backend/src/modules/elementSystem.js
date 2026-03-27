const ELEMENTS = ['fire', 'water', 'wind', 'earth', 'dark', 'light', 'neutral'];

const WEAKNESS_TABLE = {
  fire: { weak_to: 'water', strong_against: 'wind' },
  water: { weak_to: 'earth', strong_against: 'fire' },
  wind: { weak_to: 'fire', strong_against: 'earth' },
  earth: { weak_to: 'wind', strong_against: 'water' },
  dark: { weak_to: 'light', strong_against: 'light' },
  light: { weak_to: 'dark', strong_against: 'dark' },
  neutral: { weak_to: null, strong_against: null }
};

const MULTIPLIERS = {
  strong: 1.3,
  weak: 0.7,
  same: 0.8,
  neutral: 1.0
};

module.exports = {
  ELEMENTS,

  getElementWeakness(element) {
    const entry = WEAKNESS_TABLE[element];
    if (!entry) {
      throw new Error(`Elemento inválido: ${element}`);
    }
    return entry.weak_to;
  },

  getElementStrength(element) {
    const entry = WEAKNESS_TABLE[element];
    if (!entry) {
      throw new Error(`Elemento inválido: ${element}`);
    }
    return entry.strong_against;
  },

  calculateElementalMultiplier(attackerElement, defenderElement) {
    if (!WEAKNESS_TABLE[attackerElement]) {
      throw new Error(`Elemento do atacante inválido: ${attackerElement}`);
    }
    if (!WEAKNESS_TABLE[defenderElement]) {
      throw new Error(`Elemento do defensor inválido: ${defenderElement}`);
    }

    // Neutral attacker or defender always results in 1.0
    if (attackerElement === 'neutral' || defenderElement === 'neutral') {
      return MULTIPLIERS.neutral;
    }

    // Same element
    if (attackerElement === defenderElement) {
      return MULTIPLIERS.same;
    }

    const attackerEntry = WEAKNESS_TABLE[attackerElement];

    // Attacker is strong against defender
    if (attackerEntry.strong_against === defenderElement) {
      return MULTIPLIERS.strong;
    }

    // Attacker is weak to defender
    if (attackerEntry.weak_to === defenderElement) {
      return MULTIPLIERS.weak;
    }

    // No direct relationship
    return MULTIPLIERS.neutral;
  },

  applyElementalResistance(damage, element, resistances) {
    if (!resistances || !element || element === 'neutral') {
      return damage;
    }

    const resistPercent = resistances[element] || 0;
    const clampedResist = Math.min(Math.max(resistPercent, 0), 100);
    const reducedDamage = damage * (1 - clampedResist / 100);

    return Math.max(Math.round(reducedDamage), 0);
  },

  getEffectiveElementalDamage(baseDamage, attackerElement, defenderElement, defenderResistances) {
    const multiplier = this.calculateElementalMultiplier(attackerElement, defenderElement);
    const multipliedDamage = baseDamage * multiplier;
    const finalDamage = this.applyElementalResistance(
      multipliedDamage,
      attackerElement,
      defenderResistances || {}
    );

    return Math.max(Math.round(finalDamage), 0);
  }
};
