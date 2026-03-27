const db = require('../database/connection');
const characterService = require('./characterService');
const inventoryService = require('./inventoryService');

module.exports = {
  async getAvailableQuests(charId) {
    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    // Get all character quest records
    const characterQuests = await db('character_quests').where({ character_id: charId });

    // Build sets for fast lookups
    const activeQuestIds = new Set();
    const turnedInQuestIds = new Set();
    const completedNonRepeatableIds = new Set();

    for (const cq of characterQuests) {
      if (cq.status === 'active') {
        activeQuestIds.add(cq.quest_id);
      }
      if (cq.status === 'turned_in') {
        turnedInQuestIds.add(cq.quest_id);
      }
    }

    // Get all quests
    const allQuests = await db('quests').select('*');

    const available = [];

    for (const quest of allQuests) {
      // Skip if already active
      if (activeQuestIds.has(quest.id)) continue;

      // Skip if turned_in and not repeatable
      if (turnedInQuestIds.has(quest.id) && !quest.repeatable) continue;

      // Check level requirement
      if (character.level < quest.level_required) continue;

      // Check honor requirement
      if ((character.honor || 0) < quest.honor_required) continue;

      // Check prerequisites
      const prereqs = typeof quest.prerequisite_quest_ids === 'string'
        ? JSON.parse(quest.prerequisite_quest_ids)
        : quest.prerequisite_quest_ids || [];

      if (prereqs.length > 0) {
        const allPrereqsMet = prereqs.every(pqId => turnedInQuestIds.has(pqId));
        if (!allPrereqsMet) continue;
      }

      // Fetch objectives for this quest
      const objectives = await db('quest_objectives')
        .where({ quest_id: quest.id })
        .orderBy('order_index', 'asc');

      available.push({ ...quest, objectives });
    }

    return available;
  },

  async getActiveQuests(charId) {
    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    const activeRecords = await db('character_quests')
      .where({ character_id: charId, status: 'active' });

    const result = [];

    for (const record of activeRecords) {
      const quest = await db('quests').where({ id: record.quest_id }).first();
      if (!quest) continue;

      const objectives = await db('quest_objectives')
        .where({ quest_id: quest.id })
        .orderBy('order_index', 'asc');

      const progress = typeof record.objectives_progress === 'string'
        ? JSON.parse(record.objectives_progress)
        : record.objectives_progress || {};

      result.push({
        ...quest,
        character_quest_id: record.id,
        status: record.status,
        objectives_progress: progress,
        accepted_at: record.accepted_at,
        completed_at: record.completed_at,
        objectives: objectives.map(obj => ({
          ...obj,
          current_amount: progress[obj.id] || 0,
          is_complete: (progress[obj.id] || 0) >= obj.required_amount
        }))
      });
    }

    return result;
  },

  async getCompletedQuests(charId) {
    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    const turnedInRecords = await db('character_quests')
      .where({ character_id: charId, status: 'turned_in' });

    const result = [];

    for (const record of turnedInRecords) {
      const quest = await db('quests').where({ id: record.quest_id }).first();
      if (!quest) continue;

      result.push({
        ...quest,
        character_quest_id: record.id,
        status: record.status,
        accepted_at: record.accepted_at,
        completed_at: record.completed_at
      });
    }

    return result;
  },

  async acceptQuest(charId, questId) {
    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    const quest = await db('quests').where({ id: questId }).first();
    if (!quest) {
      throw new Error('Quest não encontrada');
    }

    // Check level requirement
    if (character.level < quest.level_required) {
      throw new Error('Nível insuficiente para aceitar esta quest');
    }

    // Check honor requirement
    if ((character.honor || 0) < quest.honor_required) {
      throw new Error('Honra insuficiente para aceitar esta quest');
    }

    // Check prerequisites
    const prereqs = typeof quest.prerequisite_quest_ids === 'string'
      ? JSON.parse(quest.prerequisite_quest_ids)
      : quest.prerequisite_quest_ids || [];

    if (prereqs.length > 0) {
      const turnedIn = await db('character_quests')
        .where({ character_id: charId, status: 'turned_in' })
        .whereIn('quest_id', prereqs);

      if (turnedIn.length < prereqs.length) {
        throw new Error('Pré-requisitos não cumpridos');
      }
    }

    // Check if already active
    const existing = await db('character_quests')
      .where({ character_id: charId, quest_id: questId, status: 'active' })
      .first();

    if (existing) {
      throw new Error('Quest já está ativa');
    }

    // Check if turned_in and not repeatable
    if (!quest.repeatable) {
      const turnedIn = await db('character_quests')
        .where({ character_id: charId, quest_id: questId, status: 'turned_in' })
        .first();

      if (turnedIn) {
        throw new Error('Quest já foi completada e não é repetível');
      }
    }

    // Initialize objectives progress
    const objectives = await db('quest_objectives')
      .where({ quest_id: questId })
      .orderBy('order_index', 'asc');

    const objectivesProgress = {};
    for (const obj of objectives) {
      objectivesProgress[obj.id] = 0;
    }

    const [id] = await db('character_quests').insert({
      character_id: charId,
      quest_id: questId,
      status: 'active',
      objectives_progress: JSON.stringify(objectivesProgress),
      accepted_at: new Date().toISOString(),
      completed_at: null
    });

    const record = await db('character_quests').where({ id }).first();

    return {
      ...quest,
      character_quest_id: record.id,
      status: record.status,
      objectives_progress: objectivesProgress,
      accepted_at: record.accepted_at,
      objectives: objectives.map(obj => ({
        ...obj,
        current_amount: 0,
        is_complete: false
      }))
    };
  },

  async updateObjectiveProgress(charId, objectiveType, targetId, amount) {
    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    amount = amount || 1;

    // Get all active quests for the character
    const activeRecords = await db('character_quests')
      .where({ character_id: charId, status: 'active' });

    if (activeRecords.length === 0) {
      return { updated_quests: [], completed_quests: [] };
    }

    const questIds = activeRecords.map(r => r.quest_id);

    // Find matching objectives across all active quests
    const matchingObjectives = await db('quest_objectives')
      .whereIn('quest_id', questIds)
      .where({ type: objectiveType, target_id: targetId });

    if (matchingObjectives.length === 0) {
      return { updated_quests: [], completed_quests: [] };
    }

    const updatedQuests = [];
    const completedQuests = [];

    for (const objective of matchingObjectives) {
      const record = activeRecords.find(r => r.quest_id === objective.quest_id);
      if (!record) continue;

      const progress = typeof record.objectives_progress === 'string'
        ? JSON.parse(record.objectives_progress)
        : record.objectives_progress || {};

      const currentAmount = progress[objective.id] || 0;
      const newAmount = Math.min(currentAmount + amount, objective.required_amount);

      // Only update if there's actual progress to make
      if (newAmount <= currentAmount) continue;

      progress[objective.id] = newAmount;

      // Check if all objectives for this quest are complete
      const allObjectives = await db('quest_objectives')
        .where({ quest_id: objective.quest_id });

      const allComplete = allObjectives.every(
        obj => (progress[obj.id] || 0) >= obj.required_amount
      );

      const updateData = {
        objectives_progress: JSON.stringify(progress)
      };

      if (allComplete) {
        updateData.status = 'completed';
        updateData.completed_at = new Date().toISOString();
      }

      await db('character_quests')
        .where({ id: record.id })
        .update(updateData);

      const quest = await db('quests').where({ id: objective.quest_id }).first();

      const questInfo = {
        quest_id: objective.quest_id,
        quest_name: quest ? quest.name : null,
        objective_id: objective.id,
        objective_description: objective.description,
        previous_amount: currentAmount,
        new_amount: newAmount,
        required_amount: objective.required_amount,
        objective_complete: newAmount >= objective.required_amount,
        quest_complete: allComplete
      };

      updatedQuests.push(questInfo);

      if (allComplete) {
        completedQuests.push({
          quest_id: objective.quest_id,
          quest_name: quest ? quest.name : null
        });
      }
    }

    return { updated_quests: updatedQuests, completed_quests: completedQuests };
  },

  async turnInQuest(charId, questId) {
    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    const record = await db('character_quests')
      .where({ character_id: charId, quest_id: questId, status: 'completed' })
      .first();

    if (!record) {
      throw new Error('Quest não está completa ou não foi encontrada');
    }

    const quest = await db('quests').where({ id: questId }).first();
    if (!quest) {
      throw new Error('Quest não encontrada');
    }

    // Give rewards
    const rewards = { exp: 0, gold: 0, honor: 0, items: [] };

    // Experience
    if (quest.reward_exp > 0) {
      await characterService.addExperience(charId, quest.reward_exp, 'quest');
      rewards.exp = quest.reward_exp;
    }

    // Gold
    if (quest.reward_gold > 0) {
      await db('characters').where({ id: charId }).increment('gold', quest.reward_gold);
      rewards.gold = quest.reward_gold;
    }

    // Honor
    if (quest.reward_honor > 0) {
      await characterService.addHonor(charId, quest.reward_honor, 'quest');
      rewards.honor = quest.reward_honor;
    }

    // Items
    const rewardItems = typeof quest.reward_items === 'string'
      ? JSON.parse(quest.reward_items)
      : quest.reward_items || [];

    for (const rewardItem of rewardItems) {
      await inventoryService.addItem(charId, rewardItem.item_id, rewardItem.quantity);
      const item = await db('items').where({ id: rewardItem.item_id }).first();
      rewards.items.push({
        item_id: rewardItem.item_id,
        item_name: item ? item.name : null,
        quantity: rewardItem.quantity
      });
    }

    // Mark as turned_in
    await db('character_quests')
      .where({ id: record.id })
      .update({ status: 'turned_in' });

    // Start chain quest if any
    let chainQuest = null;
    if (quest.chain_next_quest_id) {
      const nextQuest = await db('quests').where({ id: quest.chain_next_quest_id }).first();
      if (nextQuest) {
        chainQuest = {
          id: nextQuest.id,
          name: nextQuest.name,
          description: nextQuest.description,
          level_required: nextQuest.level_required
        };
      }
    }

    return {
      quest_id: questId,
      quest_name: quest.name,
      rewards,
      chain_quest: chainQuest
    };
  },

  async abandonQuest(charId, questId) {
    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    const record = await db('character_quests')
      .where({ character_id: charId, quest_id: questId })
      .whereIn('status', ['active', 'completed'])
      .first();

    if (!record) {
      throw new Error('Quest ativa não encontrada');
    }

    await db('character_quests').where({ id: record.id }).del();

    return { quest_id: questId, abandoned: true };
  }
};
