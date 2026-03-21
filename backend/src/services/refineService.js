const db = require('../database/connection');
const formulas = require('../utils/formulas');
const constants = require('../utils/constants');

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

    // Find refine scroll (item_id 93 = normal, 94 = blessed)
    const normalScroll = await db('character_inventory')
      .where({ character_id: charId, item_id: 93, equipped: false })
      .first();

    const blessedScroll = await db('character_inventory')
      .where({ character_id: charId, item_id: 94, equipped: false })
      .first();

    if (!normalScroll && !blessedScroll) {
      throw new Error('Pergaminho de refinamento necessário (item 93 ou 94)');
    }

    const useBlessed = !!blessedScroll;
    const scrollToUse = useBlessed ? blessedScroll : normalScroll;

    // Check for protection scroll (item_id 96) - prevents level loss on failure
    const protectionScroll = await db('character_inventory')
      .where({ character_id: charId, item_id: 96, equipped: false })
      .first();

    const cost = formulas.calcRefineCost(invItem.refinement, invItem.level_required);

    const character = await db('characters').where({ id: charId }).first();
    if (character.gold < cost) {
      throw new Error('Ouro insuficiente para refinamento');
    }

    // Deduct gold
    await db('characters')
      .where({ id: charId })
      .update({ gold: character.gold - cost });

    // Consume scroll
    if (scrollToUse.quantity <= 1) {
      await db('character_inventory').where({ id: scrollToUse.id }).delete();
    } else {
      await db('character_inventory')
        .where({ id: scrollToUse.id })
        .update({ quantity: scrollToUse.quantity - 1 });
    }

    // Consume protection scroll if present
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

    // Calculate chance
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
        protected: hasProtection,
        cost,
        message: `Refinamento +${newRefinement} com sucesso!`
      };
    } else {
      // Failure: lose a level unless protected
      if (!hasProtection && invItem.refinement > 0) {
        const newRefinement = invItem.refinement - 1;
        await db('character_inventory')
          .where({ id: invId })
          .update({ refinement: newRefinement });

        return {
          success: false,
          refinement: newRefinement,
          chance,
          blessed: useBlessed,
          protected: false,
          cost,
          message: `Falha! Refinamento caiu para +${newRefinement}`
        };
      }

      return {
        success: false,
        refinement: invItem.refinement,
        chance,
        blessed: useBlessed,
        protected: hasProtection,
        cost,
        message: hasProtection
          ? 'Falha! Proteção consumida, refinamento mantido.'
          : 'Falha! Refinamento mantido (já era +0).'
      };
    }
  }
};
