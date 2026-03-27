// Modulo centralizado de recalculo de atributos derivados.
// Nenhum outro arquivo deve recalcular stats — tudo passa por aqui.

const cfg = require('./statusConfig');

/**
 * Calcula HP maximo.
 * vit: vitalidade total (base + bonus)
 * level: nivel do personagem
 * classVit: base_vit da classe (para bonus de classe)
 * levelBonusHp: bonus permanente acumulado do level up
 */
function calcMaxHP(vit, level, classVit, levelBonusHp) {
  return Math.floor(
    cfg.HP_BASE + vit * cfg.HP_PER_VIT + level * cfg.HP_PER_LEVEL +
    (classVit || 0) * cfg.HP_CLASS_VIT_FACTOR + (levelBonusHp || 0)
  );
}

function calcMaxMP(int, level, classInt) {
  return Math.floor(
    cfg.MP_BASE + int * cfg.MP_PER_INT + level * cfg.MP_PER_LEVEL +
    (classInt || 0) * cfg.MP_CLASS_INT_FACTOR
  );
}

function calcMaxStamina(vit, dex, level) {
  return Math.floor(
    cfg.STAMINA_BASE + vit * cfg.STAMINA_PER_VIT + dex * cfg.STAMINA_PER_DEX +
    level * cfg.STAMINA_PER_LEVEL
  );
}

function calcAttack(str, level, classStr, levelBonusPhysical) {
  return Math.floor(
    str * cfg.ATTACK_PER_STR + level * cfg.ATTACK_PER_LEVEL +
    (classStr || 0) * cfg.ATTACK_CLASS_STR_FACTOR + (levelBonusPhysical || 0)
  );
}

function calcMagicAttack(int, level, classInt, levelBonusMagic) {
  return Math.floor(
    int * cfg.MAGIC_ATTACK_PER_INT + level * cfg.MAGIC_ATTACK_PER_LEVEL +
    (classInt || 0) * cfg.MAGIC_ATTACK_CLASS_INT_FACTOR + (levelBonusMagic || 0)
  );
}

function calcDefense(vit, level, levelBonusDefense) {
  return Math.floor(
    vit * cfg.DEFENSE_PER_VIT + level * cfg.DEFENSE_PER_LEVEL +
    (levelBonusDefense || 0)
  );
}

function calcMagicDefense(int, vit, level) {
  return Math.floor(
    int * cfg.MAGIC_DEFENSE_PER_INT + vit * cfg.MAGIC_DEFENSE_PER_VIT +
    level * cfg.MAGIC_DEFENSE_PER_LEVEL
  );
}

function calcCritical(dex, level) {
  const raw = cfg.CRIT_BASE + dex * cfg.CRIT_PER_DEX + level * cfg.CRIT_PER_LEVEL;
  return Math.min(Math.max(Math.floor(raw * 100) / 100, cfg.CRIT_MIN), cfg.CRIT_MAX);
}

function calcDodge(dex, level) {
  const raw = cfg.DODGE_BASE + dex * cfg.DODGE_PER_DEX + level * cfg.DODGE_PER_LEVEL;
  return Math.min(Math.floor(raw * 100) / 100, cfg.DODGE_MAX);
}

function calcAccuracy(dex, level) {
  return Math.floor(cfg.ACCURACY_BASE + dex * cfg.ACCURACY_PER_DEX + level * cfg.ACCURACY_PER_LEVEL);
}

function calcSpeed(dex, level) {
  return Math.floor((cfg.SPEED_BASE + dex * cfg.SPEED_PER_DEX + level * cfg.SPEED_PER_LEVEL) * 100) / 100;
}

function calcAttackSpeed(dex) {
  const raw = cfg.ATTACK_SPEED_BASE + dex * cfg.ATTACK_SPEED_PER_DEX;
  return Math.min(Math.floor(raw * 100) / 100, cfg.ATTACK_SPEED_MAX);
}

function calcMoveSpeed(dex) {
  const raw = cfg.MOVE_SPEED_BASE + dex * cfg.MOVE_SPEED_PER_DEX;
  return Math.min(Math.floor(raw * 100) / 100, cfg.MOVE_SPEED_MAX);
}

function calcPenetration(str, dex) {
  return Math.floor(str * cfg.PENETRATION_PER_STR + dex * cfg.PENETRATION_PER_DEX);
}

function calcHPRegen(vit) {
  return Math.floor((cfg.HP_REGEN_BASE + vit * cfg.HP_REGEN_PER_VIT) * 10) / 10;
}

function calcMPRegen(int) {
  return Math.floor((cfg.MP_REGEN_BASE + int * cfg.MP_REGEN_PER_INT) * 10) / 10;
}

function calcExpForLevel(level) {
  return Math.floor(cfg.XP_BASE * Math.pow(level, cfg.XP_CURVE));
}

/**
 * Recalculo completo de todos os atributos derivados do personagem.
 *
 * @param {Object} char - dados do personagem (strength, intelligence, vitality, dexterity, level, etc.)
 * @param {Object} classData - dados da classe (base_str, base_int, base_vit, base_dex)
 * @param {Object} equipBonuses - bonus acumulados de equipamentos
 * @returns {Object} todos os stats derivados
 */
function recalculateAll(char, classData, equipBonuses) {
  const eb = equipBonuses || {};

  // Totais primarios (base + bonus de equipamento)
  const totalStr = char.strength + (eb.strength || 0);
  const totalInt = char.intelligence + (eb.intelligence || 0);
  const totalVit = char.vitality + (eb.vitality || 0);
  const totalDex = char.dexterity + (eb.dexterity || 0);

  const max_hp = calcMaxHP(totalVit, char.level, classData.base_vit, char.level_bonus_hp) + (eb.max_hp || 0) + (eb.hp_bonus || 0);
  const max_mp = calcMaxMP(totalInt, char.level, classData.base_int) + (eb.max_mp || 0) + (eb.mp_bonus || 0);
  const max_stamina = calcMaxStamina(totalVit, totalDex, char.level) + (eb.max_stamina || 0);

  return {
    // Totais primarios
    strength_total: totalStr,
    intelligence_total: totalInt,
    vitality_total: totalVit,
    dexterity_total: totalDex,

    // Recursos maximos
    max_hp,
    max_mp,
    max_stamina,

    // Combate
    attack: calcAttack(totalStr, char.level, classData.base_str, char.level_bonus_attack_physical) + (eb.attack || 0),
    magic_attack: calcMagicAttack(totalInt, char.level, classData.base_int, char.level_bonus_attack_magic) + (eb.magic_attack || 0),
    defense: calcDefense(totalVit, char.level, char.level_bonus_defense) + (eb.defense || 0),
    magic_defense: calcMagicDefense(totalInt, totalVit, char.level) + (eb.magic_defense || 0),
    critical: calcCritical(totalDex, char.level) + (eb.critical || 0),
    dodge: calcDodge(totalDex, char.level) + (eb.dodge || 0),
    accuracy: calcAccuracy(totalDex, char.level) + (eb.accuracy || 0),
    speed: calcSpeed(totalDex, char.level) + (eb.speed || 0),
    penetration: calcPenetration(totalStr, totalDex) + (eb.penetration || 0),

    // Novos stats derivados
    attack_speed: calcAttackSpeed(totalDex),
    move_speed: calcMoveSpeed(totalDex),
    hp_regen: calcHPRegen(totalVit),
    mp_regen: calcMPRegen(totalInt),

    // XP
    exp_for_next_level: calcExpForLevel(char.level),
  };
}

module.exports = {
  calcMaxHP,
  calcMaxMP,
  calcMaxStamina,
  calcAttack,
  calcMagicAttack,
  calcDefense,
  calcMagicDefense,
  calcCritical,
  calcDodge,
  calcAccuracy,
  calcSpeed,
  calcAttackSpeed,
  calcMoveSpeed,
  calcPenetration,
  calcHPRegen,
  calcMPRegen,
  calcExpForLevel,
  recalculateAll,
};
