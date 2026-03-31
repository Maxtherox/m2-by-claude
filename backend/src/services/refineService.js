const db = require('../database/connection');
const formulas = require('../utils/formulas');
const constants = require('../utils/constants');

// Chance de QUEBRAR o item ao falhar (sem pergaminho de proteção)
// Escala com o nível de refinamento atual
function calcBreakChance(currentRefinement) {
  // +0~+5: baixo risco, +6+: punitivo
  const chances = [0, 1, 2, 3, 4, 5, 15, 25, 40];
  return chances[currentRefinement] ?? 50;
}

module.exports = {
  async refineItem(charId, invId) {
    const invItem = await db('character_inventory')
      .join('items', 'character_inventory.item_id', 'items.id')
      .where({ 'character_inventory.id': invId, character_id: charId })
      .select('character_inventory.*', 'items.*', 'character_inventory.id as inv_id')
      .first();

    if (!invItem) {
      throw new Error('Item não encontrado no inventário');
    }

    if (!invItem.refineable) {
      throw new Error('Este item não pode ser refinado');
    }

    if (invItem.refinement >= constants.MAX_REFINE) {
      throw new Error('Item já está no refinamento máximo');
    }

    // Buscar pergaminhos (OPCIONAIS)
    const normalScroll = await db('character_inventory')
      .where({ character_id: charId, item_id: 93, equipped: false })
      .first();

    const blessedScroll = await db('character_inventory')
      .where({ character_id: charId, item_id: 94, equipped: false })
      .first();

    // Proteção de refino (item 96) — previne QUEBRA do item
    const protectionScroll = await db('character_inventory')
      .where({ character_id: charId, item_id: 96, equipped: false })
      .first();

    // Pergaminho é opcional — determinar qual usar (se houver)
    const useBlessed = !!blessedScroll;
    const hasScroll = !!(normalScroll || blessedScroll);
    const scrollToUse = useBlessed ? blessedScroll : normalScroll;

    // Custo em ouro
    const cost = formulas.calcRefineCost(invItem.refinement, invItem.level_required);
    const character = await db('characters').where({ id: charId }).first();
    if (character.gold < cost) {
      throw new Error('Ouro insuficiente para refinamento');
    }

    // Deduzir ouro
    await db('characters')
      .where({ id: charId })
      .update({ gold: character.gold - cost });

    // Consumir pergaminho (se tiver)
    if (scrollToUse) {
      if (scrollToUse.quantity <= 1) {
        await db('character_inventory').where({ id: scrollToUse.id }).delete();
      } else {
        await db('character_inventory')
          .where({ id: scrollToUse.id })
          .update({ quantity: scrollToUse.quantity - 1 });
      }
    }

    // Consumir proteção (se tiver)
    let hasProtection = false;
    if (protectionScroll) {
      hasProtection = true;
      if (protectionScroll.quantity <= 1) {
        await db('character_inventory').where({ id: protectionScroll.id }).delete();
      } else {
        await db('character_inventory')
          .where({ id: protectionScroll.id })
          .update({ quantity: protectionScroll.quantity - 1 });
      }
    }

    // Calcular chance de sucesso
    let chance = formulas.calcRefineChance(invItem.refinement);
    if (useBlessed) {
      chance = Math.min(100, chance + 15);
    }

    const roll = Math.random() * 100;
    const success = roll < chance;

    if (success) {
      const newRefinement = invItem.refinement + 1;
      await db('character_inventory')
        .where({ id: invId })
        .update({ refinement: newRefinement });

      return {
        success: true,
        refinement: newRefinement,
        chance,
        blessed: useBlessed,
        hadScroll: hasScroll,
        protected: hasProtection,
        broken: false,
        cost,
        message: `Refinamento +${newRefinement} com sucesso!`,
      };
    }

    // === FALHA ===
    const breakChance = calcBreakChance(invItem.refinement);

    // Com pergaminho: item nunca quebra, apenas perde 1 nível
    // Sem pergaminho: chance de quebrar (destruir item)
    // Proteção: previne a quebra mesmo sem pergaminho

    if (hasScroll) {
      // Pergaminho protege contra quebra, mas perde 1 nível
      if (hasProtection) {
        // Proteção + Pergaminho: mantém nível
        return {
          success: false,
          refinement: invItem.refinement,
          chance,
          blessed: useBlessed,
          hadScroll: true,
          protected: true,
          broken: false,
          cost,
          message: 'Falha! Proteção consumida, refinamento mantido.',
        };
      }

      // Só pergaminho: perde 1 nível mas não quebra
      const newRefinement = Math.max(0, invItem.refinement - 1);
      await db('character_inventory')
        .where({ id: invId })
        .update({ refinement: newRefinement });

      return {
        success: false,
        refinement: newRefinement,
        chance,
        blessed: useBlessed,
        hadScroll: true,
        protected: false,
        broken: false,
        cost,
        message: `Falha! Refinamento caiu para +${newRefinement}.`,
      };
    }

    // SEM pergaminho — risco de quebra
    const breakRoll = Math.random() * 100;
    const itemBreaks = breakRoll < breakChance;

    if (itemBreaks && !hasProtection) {
      // Item QUEBRA (é destruído)
      await db('character_inventory').where({ id: invId }).delete();

      return {
        success: false,
        refinement: 0,
        chance,
        blessed: false,
        hadScroll: false,
        protected: false,
        broken: true,
        breakChance,
        cost,
        message: `Falha! O item ${invItem.name} +${invItem.refinement} QUEBROU e foi destruído!`,
      };
    }

    if (hasProtection) {
      // Proteção salvou da quebra, mantém nível
      return {
        success: false,
        refinement: invItem.refinement,
        chance,
        blessed: false,
        hadScroll: false,
        protected: true,
        broken: false,
        breakChance,
        cost,
        message: 'Falha! Proteção evitou a quebra, refinamento mantido.',
      };
    }

    // Falhou mas não quebrou (sorte) — perde 1 nível
    const newRefinement = Math.max(0, invItem.refinement - 1);
    await db('character_inventory')
      .where({ id: invId })
      .update({ refinement: newRefinement });

    return {
      success: false,
      refinement: newRefinement,
      chance,
      blessed: false,
      hadScroll: false,
      protected: false,
      broken: false,
      breakChance,
      cost,
      message: `Falha! Refinamento caiu para +${newRefinement}. (Chance de quebra era ${breakChance}%)`,
    };
  },
};
