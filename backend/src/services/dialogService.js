const db = require('../database/connection');

module.exports = {
  /**
   * Finds the highest-priority dialog for an NPC that the character qualifies for.
   * Checks quest status triggers and returns the first node of the matching dialog.
   */
  async getDialogForNPC(npcId, charId) {
    // Fetch all dialogs for this NPC ordered by priority (highest first)
    const dialogs = await db('dialogs')
      .where({ npc_id: npcId })
      .orderBy('priority', 'desc');

    if (!dialogs.length) {
      throw new Error('Nenhum diálogo encontrado para este NPC');
    }

    // Fetch character quest progress for trigger checks
    const characterQuests = await db('character_quests')
      .where({ character_id: charId });

    const questMap = {};
    for (const cq of characterQuests) {
      questMap[cq.quest_id] = cq.status;
    }

    // Find the first dialog the character qualifies for
    let matchedDialog = null;

    for (const dialog of dialogs) {
      if (dialog.trigger === 'default') {
        // Default dialogs always qualify but are lowest priority fallback
        if (!matchedDialog) {
          matchedDialog = dialog;
        }
        continue;
      }

      if (dialog.trigger === 'quest_status' && dialog.trigger_quest_id) {
        const currentStatus = questMap[dialog.trigger_quest_id] || null;

        if (dialog.trigger_quest_status === 'not_started' && currentStatus === null) {
          matchedDialog = dialog;
          break;
        }

        if (currentStatus === dialog.trigger_quest_status) {
          matchedDialog = dialog;
          break;
        }
      }

      if (dialog.trigger === 'quest_available' && dialog.trigger_quest_id) {
        const currentStatus = questMap[dialog.trigger_quest_id] || null;
        if (currentStatus === null) {
          matchedDialog = dialog;
          break;
        }
      }

      if (dialog.trigger === 'quest_complete' && dialog.trigger_quest_id) {
        const currentStatus = questMap[dialog.trigger_quest_id] || null;
        if (currentStatus === 'completed') {
          matchedDialog = dialog;
          break;
        }
      }
    }

    if (!matchedDialog) {
      // Fallback: pick the lowest priority dialog as default
      matchedDialog = dialogs[dialogs.length - 1];
    }

    // Return the first node of the matched dialog
    const firstNode = await db('dialog_nodes')
      .where({ dialog_id: matchedDialog.id, node_index: 0 })
      .first();

    if (!firstNode) {
      throw new Error('Diálogo encontrado mas sem nós configurados');
    }

    firstNode.options = firstNode.options ? JSON.parse(firstNode.options) : [];

    return {
      dialog_id: matchedDialog.id,
      npc_id: npcId,
      node: firstNode,
    };
  },

  /**
   * Returns a specific dialog node. Parses options from JSON.
   */
  async getDialogNode(dialogId, nodeIndex) {
    const node = await db('dialog_nodes')
      .where({ dialog_id: dialogId, node_index: nodeIndex })
      .first();

    if (!node) {
      throw new Error('Nó de diálogo não encontrado');
    }

    node.options = node.options ? JSON.parse(node.options) : [];

    return node;
  },

  /**
   * Executes a dialog action such as accept_quest, complete_quest, open_shop, open_storage, heal.
   * Delegates to appropriate services.
   */
  async executeDialogAction(charId, action, actionParam) {
    switch (action) {
      case 'accept_quest': {
        const questId = parseInt(actionParam);
        const quest = await db('quests').where({ id: questId }).first();
        if (!quest) {
          throw new Error('Quest não encontrada');
        }

        const existing = await db('character_quests')
          .where({ character_id: charId, quest_id: questId })
          .first();

        if (existing) {
          throw new Error('Quest já aceita ou completada');
        }

        await db('character_quests').insert({
          character_id: charId,
          quest_id: questId,
          status: 'in_progress',
          progress: JSON.stringify({}),
          accepted_at: new Date(),
        });

        return { action: 'accept_quest', quest_id: questId, status: 'in_progress' };
      }

      case 'complete_quest': {
        const questId = parseInt(actionParam);
        const charQuest = await db('character_quests')
          .where({ character_id: charId, quest_id: questId, status: 'in_progress' })
          .first();

        if (!charQuest) {
          throw new Error('Quest não está em progresso');
        }

        const quest = await db('quests').where({ id: questId }).first();

        await db('character_quests')
          .where({ id: charQuest.id })
          .update({ status: 'completed', completed_at: new Date() });

        // Grant rewards
        const rewards = {};
        if (quest.reward_exp) {
          await db('characters').where({ id: charId }).increment('exp', quest.reward_exp);
          rewards.exp = quest.reward_exp;
        }
        if (quest.reward_gold) {
          await db('characters').where({ id: charId }).increment('gold', quest.reward_gold);
          rewards.gold = quest.reward_gold;
        }
        if (quest.reward_honor) {
          await db('characters').where({ id: charId }).increment('honor', quest.reward_honor);
          rewards.honor = quest.reward_honor;
        }

        return { action: 'complete_quest', quest_id: questId, status: 'completed', rewards };
      }

      case 'open_shop': {
        const shopId = parseInt(actionParam);
        const shopService = require('./shopService');
        const shop = await shopService.getShop(shopId);
        return { action: 'open_shop', shop };
      }

      case 'open_storage': {
        const storageService = require('./storageService');
        const storage = await storageService.getStorage(charId);
        return { action: 'open_storage', storage };
      }

      case 'heal': {
        const healerService = require('./healerService');
        const result = await healerService.heal(charId);
        return { action: 'heal', ...result };
      }

      default:
        throw new Error(`Ação de diálogo desconhecida: ${action}`);
    }
  },
};
