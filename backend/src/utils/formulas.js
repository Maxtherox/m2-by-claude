module.exports = {
  calcMaxHP(vit, level, classData) {
    return Math.floor(100 + vit * 10 + level * 15 + (classData.base_vit || 0) * 5);
  },

  calcMaxMP(int, level, classData) {
    return Math.floor(50 + int * 8 + level * 10 + (classData.base_int || 0) * 4);
  },

  calcMaxStamina(vit, dex, level) {
    return Math.floor(100 + vit * 3 + dex * 2 + level * 5);
  },

  calcAttack(str, level, classData) {
    return Math.floor(str * 2 + level * 1.5 + (classData.base_str || 0) * 1.5);
  },

  calcMagicAttack(int, level, classData) {
    return Math.floor(int * 2.5 + level * 1.2 + (classData.base_int || 0) * 1.5);
  },

  calcDefense(vit, level) {
    return Math.floor(vit * 1.5 + level * 1);
  },

  calcMagicDefense(int, vit, level) {
    return Math.floor(int * 1 + vit * 0.5 + level * 0.8);
  },

  calcCritical(dex, level) {
    return Math.min(Math.floor((5 + dex * 0.3 + level * 0.1) * 100) / 100, 75);
  },

  calcDodge(dex, level) {
    return Math.min(Math.floor((3 + dex * 0.25 + level * 0.08) * 100) / 100, 50);
  },

  calcAccuracy(dex, level) {
    return Math.floor(80 + dex * 0.4 + level * 0.2);
  },

  calcSpeed(dex, level) {
    return Math.floor((10 + dex * 0.3 + level * 0.15) * 100) / 100;
  },

  calcPenetration(str, dex) {
    return Math.floor(str * 0.2 + dex * 0.3);
  },

  calcExpForLevel(level) {
    return Math.floor(100 * Math.pow(level, 1.8));
  },

  calcPhysicalDamage(attack, defense, penetration, skillMultiplier) {
    skillMultiplier = skillMultiplier || 1;
    const effectiveDefense = Math.max(1, defense - (penetration || 0));
    const reduction = effectiveDefense / (effectiveDefense + 100);
    const variance = 0.9 + Math.random() * 0.2;
    return Math.max(1, Math.floor(attack * skillMultiplier * (1 - reduction) * variance));
  },

  calcMagicDamage(magicAttack, magicDefense, skillMultiplier) {
    skillMultiplier = skillMultiplier || 1;
    const reduction = magicDefense / (magicDefense + 80);
    const variance = 0.9 + Math.random() * 0.2;
    return Math.max(1, Math.floor(magicAttack * skillMultiplier * (1 - reduction) * variance));
  },

  calcHybridDamage(attack, magicAttack, defense, magicDefense, penetration, skillMultiplier) {
    const phys = this.calcPhysicalDamage(attack * 0.6, defense, penetration, skillMultiplier);
    const mag = this.calcMagicDamage(magicAttack * 0.6, magicDefense, skillMultiplier);
    return phys + mag;
  },

  calcRefineChance(currentLevel) {
    const chances = [100, 90, 80, 65, 50, 35, 25, 15, 8];
    return chances[currentLevel] || 0;
  },

  calcRefineCost(currentLevel, itemLevel) {
    return Math.floor((currentLevel + 1) * 1000 * (1 + (itemLevel || 1) * 0.1));
  },

  calcRefineBonus(baseValue, refineLevel) {
    return Math.floor(baseValue * refineLevel * 0.08);
  },

  calcLifeskillExpForLevel(level) {
    return Math.floor(50 * Math.pow(level, 1.5));
  },

  generateBonusValue(min, max, rarity) {
    const rarityMultiplier = { common: 0.5, uncommon: 0.65, rare: 0.8, epic: 0.9, legendary: 1.0 };
    const mult = rarityMultiplier[rarity] || 0.5;
    const range = max - min;
    return Math.floor(min + range * mult * Math.random());
  },

  calcSkillDamage(skill, characterStats, skillLevel) {
    const baseDmg = skill.base_damage + (skill.per_level_damage * (skillLevel - 1));
    const scalingAttr = characterStats[skill.scaling_attribute] || 0;
    const scaledDmg = baseDmg + scalingAttr * skill.scaling_factor;
    return Math.floor(scaledDmg);
  },

  calcHealAmount(skill, characterStats, skillLevel) {
    const baseHeal = skill.effect_value + (skill.per_level_effect * (skillLevel - 1));
    const intBonus = (characterStats.intelligence || 0) * skill.scaling_factor;
    return Math.floor(baseHeal + intBonus);
  },

  rollDrop(dropChance) {
    return Math.random() < dropChance;
  },

  rollQuantity(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  rollCritical(critChance) {
    return Math.random() * 100 < critChance;
  },

  rollDodge(dodgeChance) {
    return Math.random() * 100 < dodgeChance;
  },

  rollEffect(effectChance) {
    return Math.random() * 100 < effectChance;
  }
};
