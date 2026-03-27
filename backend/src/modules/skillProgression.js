// Sistema de progressao avancada de skills estilo Metin2.
// Estagios: NORMAL -> MASTER (M1-M10) -> GRAND_MASTER (G1-G10) -> PERFECT_MASTER (P)
// Leitura de livros progride MASTER, Pedra Espiritual progride GRAND_MASTER.

const cfg = require('./statusConfig');
const honorSystem = require('./honorSystem');

const STAGES = cfg.SKILL_PROGRESS_STAGES;

/**
 * Verifica se a skill atingiu o limiar de transicao para MASTER.
 */
function isMasterTransitionReached(playerSkill) {
  return (
    playerSkill.progress_stage === STAGES.NORMAL &&
    playerSkill.level >= cfg.MASTER_TRANSITION_LEVEL
  );
}

/**
 * Verifica se a skill ainda pode progredir com pontos normais.
 */
function canProgressWithNormalPoint(playerSkill) {
  return (
    playerSkill.progress_stage === STAGES.NORMAL &&
    playerSkill.level < cfg.MASTER_TRANSITION_LEVEL
  );
}

/**
 * Promove a skill para MASTER.
 * Retorna as mutacoes a aplicar.
 */
function promoteToMaster(playerSkill) {
  if (!isMasterTransitionReached(playerSkill)) {
    return { success: false, reason: 'Skill nao atingiu o nivel de transicao para Mestre' };
  }
  return {
    success: true,
    mutations: {
      progress_stage: STAGES.MASTER,
      master_stage_level: 1,
    },
  };
}

/**
 * Verifica se um livro pode ser lido para esta skill.
 */
function canReadBook(playerSkill) {
  return (
    playerSkill.progress_stage === STAGES.MASTER &&
    playerSkill.master_stage_level < cfg.SKILL_MASTER_MAX_LEVEL
  );
}

/**
 * Tenta progredir a skill lendo um livro.
 * Retorna resultado estruturado.
 */
function readBook(playerSkill) {
  if (!canReadBook(playerSkill)) {
    return {
      success: false,
      skill_id: playerSkill.skill_id,
      previous_stage: playerSkill.progress_stage,
      previous_progress: playerSkill.master_stage_level,
      new_stage: playerSkill.progress_stage,
      new_progress: playerSkill.master_stage_level,
      honor_spent: 0,
      consumed_item_type: 'SKILL_BOOK',
      failure_reason: playerSkill.progress_stage !== STAGES.MASTER
        ? 'Skill nao esta no estagio Mestre'
        : 'Skill ja atingiu o maximo do estagio Mestre',
    };
  }

  const prevLevel = playerSkill.master_stage_level;
  const roll = Math.random();
  const succeeded = roll < cfg.BOOK_SUCCESS_CHANCE_MASTER;

  const newLevel = succeeded ? prevLevel + 1 : prevLevel;
  let newStage = STAGES.MASTER;

  // Check se atingiu o maximo e promove para GRAND_MASTER
  const mutations = {
    master_book_reads: (playerSkill.master_book_reads || 0) + 1,
    master_stage_level: newLevel,
  };

  if (succeeded && newLevel >= cfg.SKILL_MASTER_MAX_LEVEL) {
    newStage = STAGES.GRAND_MASTER;
    mutations.progress_stage = STAGES.GRAND_MASTER;
    mutations.grand_stage_level = 1;
  } else if (succeeded) {
    mutations.master_stage_level = newLevel;
  }

  return {
    success: succeeded,
    skill_id: playerSkill.skill_id,
    previous_stage: STAGES.MASTER,
    previous_progress: prevLevel,
    new_stage: newStage,
    new_progress: succeeded ? newLevel : prevLevel,
    honor_spent: 0,
    consumed_item_type: 'SKILL_BOOK',
    failure_reason: succeeded ? null : 'Leitura falhou',
    mutations,
  };
}

/**
 * Verifica se Pedra Espiritual pode ser usada nesta skill.
 */
function canUseSpiritStone(playerSkill) {
  return (
    playerSkill.progress_stage === STAGES.GRAND_MASTER &&
    playerSkill.grand_stage_level < cfg.SKILL_GRAND_MASTER_MAX_LEVEL
  );
}

/**
 * Tenta progredir a skill com Pedra Espiritual.
 * Retorna resultado estruturado incluindo custo de honra.
 */
function useSpiritStone(playerSkill, currentHonor) {
  if (!canUseSpiritStone(playerSkill)) {
    return {
      success: false,
      skill_id: playerSkill.skill_id,
      previous_stage: playerSkill.progress_stage,
      previous_progress: playerSkill.grand_stage_level,
      new_stage: playerSkill.progress_stage,
      new_progress: playerSkill.grand_stage_level,
      honor_spent: 0,
      consumed_item_type: 'SPIRIT_STONE',
      failure_reason: playerSkill.progress_stage !== STAGES.GRAND_MASTER
        ? 'Skill nao esta no estagio Grand Master'
        : 'Skill ja atingiu o maximo do estagio Grand Master',
    };
  }

  const honorCost = cfg.SPIRIT_STONE_HONOR_COST;
  const prevLevel = playerSkill.grand_stage_level;
  const roll = Math.random();
  const succeeded = roll < cfg.SPIRIT_STONE_SUCCESS_CHANCE;

  // Honra e consumida mesmo em falha (se configurado assim)
  const shouldConsumeHonor = succeeded || cfg.SPIRIT_STONE_CONSUMES_HONOR_ON_FAIL;
  const actualHonorSpent = shouldConsumeHonor ? honorCost : 0;

  let honorResult = null;
  if (actualHonorSpent > 0) {
    honorResult = honorSystem.removeHonor(currentHonor, actualHonorSpent, 'spirit_stone');
  }

  const newLevel = succeeded ? prevLevel + 1 : prevLevel;
  let newStage = STAGES.GRAND_MASTER;

  const mutations = {
    grand_stage_level: newLevel,
  };

  // Check se atingiu o maximo e promove para PERFECT_MASTER
  if (succeeded && newLevel >= cfg.SKILL_GRAND_MASTER_MAX_LEVEL && cfg.SKILL_PERFECT_MASTER_ENABLED) {
    newStage = STAGES.PERFECT_MASTER;
    mutations.progress_stage = STAGES.PERFECT_MASTER;
    mutations.perfect_stage_level = 1;
  }

  return {
    success: succeeded,
    skill_id: playerSkill.skill_id,
    previous_stage: STAGES.GRAND_MASTER,
    previous_progress: prevLevel,
    new_stage: newStage,
    new_progress: succeeded ? newLevel : prevLevel,
    honor_spent: actualHonorSpent,
    honor_result: honorResult,
    consumed_item_type: 'SPIRIT_STONE',
    failure_reason: succeeded ? null : 'Tentativa falhou',
    mutations,
  };
}

/**
 * Verifica se a skill pode ser promovida para Perfect Master.
 */
function canPromoteToPerfectMaster(playerSkill) {
  return (
    cfg.SKILL_PERFECT_MASTER_ENABLED &&
    playerSkill.progress_stage === STAGES.GRAND_MASTER &&
    playerSkill.grand_stage_level >= cfg.SKILL_GRAND_MASTER_MAX_LEVEL
  );
}

/**
 * Retorna a label textual da progressao da skill.
 * Ex: "5", "17", "M1", "M10", "G1", "G10", "P"
 */
function getProgressionLabel(playerSkill) {
  const stage = playerSkill.progress_stage || STAGES.NORMAL;

  switch (stage) {
    case STAGES.NORMAL:
      return String(playerSkill.level || 1);
    case STAGES.MASTER:
      return `M${playerSkill.master_stage_level || 1}`;
    case STAGES.GRAND_MASTER:
      return `G${playerSkill.grand_stage_level || 1}`;
    case STAGES.PERFECT_MASTER:
      return 'P';
    default:
      return String(playerSkill.level || 1);
  }
}

/**
 * Retorna um valor numerico efetivo para o poder da skill
 * considerando todos os estagios de progressao.
 * Usado para calculo de dano/efeito.
 */
function getEffectiveProgressValue(playerSkill) {
  const baseLevel = playerSkill.level || 1;
  const stage = playerSkill.progress_stage || STAGES.NORMAL;

  switch (stage) {
    case STAGES.NORMAL:
      return baseLevel;
    case STAGES.MASTER:
      return baseLevel + (playerSkill.master_stage_level || 0) * 2;
    case STAGES.GRAND_MASTER:
      return baseLevel + cfg.SKILL_MASTER_MAX_LEVEL * 2 + (playerSkill.grand_stage_level || 0) * 3;
    case STAGES.PERFECT_MASTER:
      return baseLevel + cfg.SKILL_MASTER_MAX_LEVEL * 2 + cfg.SKILL_GRAND_MASTER_MAX_LEVEL * 3 + 10;
    default:
      return baseLevel;
  }
}

module.exports = {
  STAGES,
  isMasterTransitionReached,
  canProgressWithNormalPoint,
  promoteToMaster,
  canReadBook,
  readBook,
  canUseSpiritStone,
  useSpiritStone,
  canPromoteToPerfectMaster,
  getProgressionLabel,
  getEffectiveProgressValue,
};
