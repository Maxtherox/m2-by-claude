// Configuracao centralizada de todos os coeficientes do sistema de status.
// Nenhuma formula ou servico deve ter numeros magicos — tudo vem daqui.

module.exports = {
  // --- Nivel e progressao ---
  MAX_LEVEL: 99,
  STATUS_POINTS_PER_LEVEL: 3,
  SKILL_POINTS_PER_LEVEL: 1,

  // Curva de XP: floor(xp_base * level^xp_curve)
  XP_BASE: 100,
  XP_CURVE: 1.8,

  // Auto-growth: a partir deste nivel, level up da bonus automaticos em vez de status_points
  LEVEL_THRESHOLD_AUTO_GROWTH: 70,
  AUTO_GAIN_PHYSICAL_ATTACK_PER_LEVEL: 3,
  AUTO_GAIN_MAGIC_ATTACK_PER_LEVEL: 2,
  AUTO_GAIN_DEFENSE_PER_LEVEL: 2,
  AUTO_GAIN_HP_PER_LEVEL: 15,

  // Milestones: recompensa especial a cada N niveis
  LEVEL_MILESTONE_INTERVAL: 10,

  // --- HP ---
  HP_BASE: 100,
  HP_PER_VIT: 10,
  HP_PER_LEVEL: 15,
  HP_CLASS_VIT_FACTOR: 5,

  // --- MP ---
  MP_BASE: 50,
  MP_PER_INT: 8,
  MP_PER_LEVEL: 10,
  MP_CLASS_INT_FACTOR: 4,

  // --- Stamina ---
  STAMINA_BASE: 100,
  STAMINA_PER_VIT: 3,
  STAMINA_PER_DEX: 2,
  STAMINA_PER_LEVEL: 5,

  // --- Ataque fisico ---
  ATTACK_PER_STR: 2,
  ATTACK_PER_LEVEL: 1.5,
  ATTACK_CLASS_STR_FACTOR: 1.5,

  // --- Ataque magico ---
  MAGIC_ATTACK_PER_INT: 2.5,
  MAGIC_ATTACK_PER_LEVEL: 1.2,
  MAGIC_ATTACK_CLASS_INT_FACTOR: 1.5,

  // --- Defesa ---
  DEFENSE_PER_VIT: 1.5,
  DEFENSE_PER_LEVEL: 1,

  // --- Defesa magica ---
  MAGIC_DEFENSE_PER_INT: 1,
  MAGIC_DEFENSE_PER_VIT: 0.5,
  MAGIC_DEFENSE_PER_LEVEL: 0.8,

  // --- Critico ---
  CRIT_BASE: 5,
  CRIT_PER_DEX: 0.3,
  CRIT_PER_LEVEL: 0.1,
  CRIT_MIN: 0,
  CRIT_MAX: 75,

  // --- Esquiva ---
  DODGE_BASE: 3,
  DODGE_PER_DEX: 0.25,
  DODGE_PER_LEVEL: 0.08,
  DODGE_MAX: 50,

  // --- Precisao ---
  ACCURACY_BASE: 80,
  ACCURACY_PER_DEX: 0.4,
  ACCURACY_PER_LEVEL: 0.2,

  // --- Velocidade (genérica / combate) ---
  SPEED_BASE: 10,
  SPEED_PER_DEX: 0.3,
  SPEED_PER_LEVEL: 0.15,

  // --- Velocidade de ataque ---
  ATTACK_SPEED_BASE: 1.0,
  ATTACK_SPEED_PER_DEX: 0.01,
  ATTACK_SPEED_MAX: 2.5,

  // --- Velocidade de movimento ---
  MOVE_SPEED_BASE: 3.0,
  MOVE_SPEED_PER_DEX: 0.02,
  MOVE_SPEED_MAX: 6.0,

  // --- Penetracao ---
  PENETRATION_PER_STR: 0.2,
  PENETRATION_PER_DEX: 0.3,

  // --- Regeneracao ---
  HP_REGEN_BASE: 1,
  HP_REGEN_PER_VIT: 0.3,
  MP_REGEN_BASE: 1,
  MP_REGEN_PER_INT: 0.25,

  // --- Honra ---
  HONOR_START_VALUE: 0,
  HONOR_MIN_VALUE: -10000,
  HONOR_MAX_VALUE: 10000,
  HONOR_NEGATIVE_ENABLED: false,
  HONOR_FLOOR_WHEN_NEGATIVE_DISABLED: 0,
  SPIRIT_STONE_HONOR_COST: 50,

  HONOR_RANKS: [
    { min: -Infinity, max: -500, rank: 'Infame' },
    { min: -500, max: -100, rank: 'Desonrada' },
    { min: -100, max: 100, rank: 'Neutra' },
    { min: 100, max: 500, rank: 'Honrada' },
    { min: 500, max: 1000, rank: 'Respeitada' },
    { min: 1000, max: 5000, rank: 'Nobre' },
    { min: 5000, max: Infinity, rank: 'Lendaria' },
  ],

  // --- Progressao de skills ---
  SKILL_NORMAL_MAX_LEVEL: 17,
  SKILL_MASTER_MAX_LEVEL: 10,
  SKILL_GRAND_MASTER_MAX_LEVEL: 10,
  SKILL_PERFECT_MASTER_ENABLED: true,
  BOOK_SUCCESS_CHANCE_MASTER: 0.6,
  SPIRIT_STONE_SUCCESS_CHANCE: 0.3,
  SPIRIT_STONE_CONSUMES_HONOR_ON_FAIL: true,
  MASTER_TRANSITION_LEVEL: 17,

  SKILL_PROGRESS_STAGES: {
    NORMAL: 'NORMAL',
    MASTER: 'MASTER',
    GRAND_MASTER: 'GRAND_MASTER',
    PERFECT_MASTER: 'PERFECT_MASTER',
  },
};
