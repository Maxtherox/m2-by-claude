// Sistema de XP, level up, auto-growth e milestones.
// Funciona sobre o estado do personagem sem depender de DB diretamente.

const cfg = require('./statusConfig');
const derivedStats = require('./derivedStats');

/**
 * Retorna o XP necessario para subir do nivel informado.
 */
function getExpForLevel(level) {
  return derivedStats.calcExpForLevel(level);
}

/**
 * Processa ganho de XP com possibilidade de multiplos level ups.
 * Retorna as mutacoes que devem ser aplicadas ao personagem.
 *
 * @param {Object} char - dados atuais do personagem
 * @param {number} amount - quantidade de XP
 * @param {string} source - fonte do XP (combat, quest, item, etc.)
 * @returns {Object} { leveledUp, levelsGained, mutations, milestones }
 */
function addExperience(char, amount, source) {
  if (amount <= 0 || char.level >= cfg.MAX_LEVEL) {
    return { leveledUp: false, levelsGained: 0, mutations: {}, milestones: [] };
  }

  let exp = char.exp + amount;
  let expTotal = (char.exp_total || 0) + amount;
  let level = char.level;
  let statusPoints = char.status_points;
  let skillPoints = char.skill_points;
  let levelBonusPhysical = char.level_bonus_attack_physical || 0;
  let levelBonusMagic = char.level_bonus_attack_magic || 0;
  let levelBonusDefense = char.level_bonus_defense || 0;
  let levelBonusHp = char.level_bonus_hp || 0;
  let levelsGained = 0;
  const milestones = [];

  let expNeeded = getExpForLevel(level);
  while (exp >= expNeeded && level < cfg.MAX_LEVEL) {
    exp -= expNeeded;
    level++;
    levelsGained++;

    // Recompensas por level up
    if (level < cfg.LEVEL_THRESHOLD_AUTO_GROWTH) {
      // Abaixo do limiar: ganha pontos manuais
      statusPoints += cfg.STATUS_POINTS_PER_LEVEL;
    } else {
      // A partir do limiar: auto-growth
      levelBonusPhysical += cfg.AUTO_GAIN_PHYSICAL_ATTACK_PER_LEVEL;
      levelBonusMagic += cfg.AUTO_GAIN_MAGIC_ATTACK_PER_LEVEL;
      levelBonusDefense += cfg.AUTO_GAIN_DEFENSE_PER_LEVEL;
      levelBonusHp += cfg.AUTO_GAIN_HP_PER_LEVEL;
    }

    skillPoints += cfg.SKILL_POINTS_PER_LEVEL;

    // Milestone check
    if (level % cfg.LEVEL_MILESTONE_INTERVAL === 0) {
      milestones.push({ level, type: 'milestone' });
    }

    expNeeded = getExpForLevel(level);
  }

  const mutations = {
    exp,
    exp_total: expTotal,
    level,
    status_points: statusPoints,
    skill_points: skillPoints,
    level_bonus_attack_physical: levelBonusPhysical,
    level_bonus_attack_magic: levelBonusMagic,
    level_bonus_defense: levelBonusDefense,
    level_bonus_hp: levelBonusHp,
  };

  return {
    leveledUp: levelsGained > 0,
    levelsGained,
    mutations,
    milestones,
  };
}

module.exports = {
  getExpForLevel,
  addExperience,
};
