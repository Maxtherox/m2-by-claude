// Sistema de honra completo com suporte a clamp, honra negativa e source tracking.

const config = require('./statusConfig');

/**
 * Retorna o titulo textual de honra para o valor numerico fornecido.
 */
function resolveHonorRank(honorValue) {
  const ranks = config.HONOR_RANKS;
  for (const entry of ranks) {
    if (honorValue >= entry.min && honorValue < entry.max) {
      return entry.rank;
    }
  }
  return 'Neutra';
}

/**
 * Aplica clamp no valor de honra conforme regras do sistema.
 * Se honra negativa estiver desativada, impede queda abaixo do floor configurado.
 */
function clampHonor(value) {
  const max = config.HONOR_MAX_VALUE;
  let min;

  if (config.HONOR_NEGATIVE_ENABLED) {
    min = config.HONOR_MIN_VALUE;
  } else {
    min = config.HONOR_FLOOR_WHEN_NEGATIVE_DISABLED;
  }

  return Math.max(min, Math.min(max, value));
}

/**
 * Adiciona honra ao personagem.
 * @param {number} currentHonor - valor atual de honra
 * @param {number} amount - quantidade a adicionar (positiva)
 * @param {string} source - origem do ganho (quest_reward, boss_kill, etc.)
 * @returns {{ honor: number, honor_rank: string, source: string, delta: number }}
 */
function addHonor(currentHonor, amount, source) {
  const newValue = clampHonor(currentHonor + Math.abs(amount));
  const delta = newValue - currentHonor;
  return {
    honor: newValue,
    honor_rank: resolveHonorRank(newValue),
    source: source || 'unknown',
    delta,
  };
}

/**
 * Remove honra do personagem com clamp.
 * @param {number} currentHonor - valor atual
 * @param {number} amount - quantidade a remover (positiva)
 * @param {string} source - origem da perda (spirit_stone, crime, etc.)
 * @returns {{ honor: number, honor_rank: string, source: string, delta: number }}
 */
function removeHonor(currentHonor, amount, source) {
  const newValue = clampHonor(currentHonor - Math.abs(amount));
  const delta = newValue - currentHonor;
  return {
    honor: newValue,
    honor_rank: resolveHonorRank(newValue),
    source: source || 'unknown',
    delta,
  };
}

/**
 * Define honra para um valor exato com clamp.
 */
function setHonor(value) {
  const clamped = clampHonor(value);
  return {
    honor: clamped,
    honor_rank: resolveHonorRank(clamped),
  };
}

module.exports = {
  resolveHonorRank,
  clampHonor,
  addHonor,
  removeHonor,
  setHonor,
};
