const db = require('../database/connection');
const formulas = require('../utils/formulas');
const characterService = require('./characterService');
const inventoryService = require('./inventoryService');

module.exports = {
  async startCombat(charId, mobId) {
    const charData = await characterService.getCharacter(charId);
    const mob = await db('mobs').where({ id: mobId }).first();

    if (!mob) {
      throw new Error('Monstro não encontrado');
    }

    const stats = charData.derived_stats;
    const mobSkills = mob.skills ? JSON.parse(mob.skills) : [];

    const state = {
      character: {
        id: charId,
        name: charData.name,
        hp: charData.hp,
        mp: charData.mp,
        maxHp: stats.max_hp,
        maxMp: stats.max_mp,
        attack: stats.attack,
        magic_attack: stats.magic_attack,
        defense: stats.defense,
        magic_defense: stats.magic_defense,
        speed: stats.speed,
        critical: stats.critical,
        dodge: stats.dodge,
        accuracy: stats.accuracy,
        penetration: stats.penetration,
        level: charData.level,
        buffs: [],
        debuffs: [],
        equipment_bonuses: charData.equipment_bonuses
      },
      mob: {
        id: mobId,
        name: mob.name,
        hp: mob.hp,
        maxHp: mob.hp,
        mp: mob.mp || 0,
        attack: mob.attack,
        magic_attack: mob.magic_attack || 0,
        defense: mob.defense,
        magic_defense: mob.magic_defense || 0,
        speed: mob.speed || 5,
        exp_reward: mob.exp_reward,
        gold_min: mob.gold_min,
        gold_max: mob.gold_max,
        type: mob.type,
        level: mob.level,
        skills: mobSkills,
        buffs: [],
        debuffs: []
      },
      turn: 1,
      log: [],
      finished: false,
      result: null
    };

    return state;
  },

  async executeTurn(combatState, action, charId) {
    if (combatState.finished) {
      throw new Error('Combate já finalizado');
    }

    const state = JSON.parse(JSON.stringify(combatState));
    const char = state.character;
    const mob = state.mob;
    const turnLog = [];

    // Determine order by speed
    const charFirst = char.speed >= mob.speed;
    const first = charFirst ? 'character' : 'mob';
    const second = charFirst ? 'mob' : 'character';

    const executeAction = async (actor, target, actorAction) => {
      if (state.finished) return;

      if (actor === 'character') {
        return this._executePlayerAction(state, actorAction, turnLog, charId);
      } else {
        return this._executeMobAction(state, turnLog);
      }
    };

    if (first === 'character') {
      await executeAction('character', 'mob', action);
      if (!state.finished) {
        await executeAction('mob', 'character', null);
      }
    } else {
      await executeAction('mob', 'character', null);
      if (!state.finished) {
        await executeAction('character', 'mob', action);
      }
    }

    // Process DOTs on character
    if (!state.finished) {
      this._processDOTs(char, 'character', turnLog, state);
    }

    // Process DOTs on mob
    if (!state.finished) {
      this._processDOTs(mob, 'mob', turnLog, state);
    }

    // Tick down buff/debuff durations
    this._tickEffects(char);
    this._tickEffects(mob);

    // Check deaths after DOTs
    if (!state.finished) {
      if (mob.hp <= 0) {
        state.finished = true;
        const goldReward = formulas.rollQuantity(mob.gold_min, mob.gold_max);
        const drops = await this.rollDrops(mob.id);
        state.result = {
          winner: 'character',
          exp_reward: mob.exp_reward,
          gold_reward: goldReward,
          drops
        };
        turnLog.push({ turn: state.turn, actor: 'system', action: 'victory', message: `${mob.name} foi derrotado!` });
      } else if (char.hp <= 0) {
        state.finished = true;
        state.result = { winner: 'mob', exp_reward: 0, gold_reward: 0, drops: [] };
        turnLog.push({ turn: state.turn, actor: 'system', action: 'defeat', message: `${char.name} foi derrotado!` });
      }
    }

    state.log.push(...turnLog);
    state.turn++;

    return { state, log: turnLog, finished: state.finished, result: state.result };
  },

  async _executePlayerAction(state, action, turnLog, charId) {
    const char = state.character;
    const mob = state.mob;

    if (action.type === 'attack') {
      const accuracyRoll = Math.random() * 100;
      const hitChance = Math.min(char.accuracy - (mob.speed * 2), 95);

      if (accuracyRoll > hitChance) {
        turnLog.push({ turn: state.turn, actor: 'character', action: 'attack', damage: 0, critical: false, dodged: true, effects: [], hp_remaining: mob.hp });
        return;
      }

      if (formulas.rollDodge(mob.speed * 0.5)) {
        turnLog.push({ turn: state.turn, actor: 'character', action: 'attack', damage: 0, critical: false, dodged: true, effects: [], hp_remaining: mob.hp });
        return;
      }

      let damage = formulas.calcPhysicalDamage(char.attack, mob.defense, char.penetration, 1);
      let isCrit = false;

      if (formulas.rollCritical(char.critical)) {
        damage = Math.floor(damage * 1.5);
        isCrit = true;
      }

      // Damage vs monster bonus
      if (char.equipment_bonuses && char.equipment_bonuses.damage_vs_monster) {
        damage = Math.floor(damage * (1 + char.equipment_bonuses.damage_vs_monster / 100));
      }
      if (char.equipment_bonuses && char.equipment_bonuses.damage_vs_boss && mob.type === 'boss') {
        damage = Math.floor(damage * (1 + char.equipment_bonuses.damage_vs_boss / 100));
      }

      mob.hp = Math.max(0, mob.hp - damage);

      // HP absorb
      if (char.equipment_bonuses && char.equipment_bonuses.hp_absorb > 0) {
        const absorbed = Math.floor(damage * char.equipment_bonuses.hp_absorb / 100);
        char.hp = Math.min(char.maxHp, char.hp + absorbed);
      }

      turnLog.push({ turn: state.turn, actor: 'character', action: 'attack', damage, critical: isCrit, dodged: false, effects: [], hp_remaining: mob.hp });

      if (mob.hp <= 0) {
        state.finished = true;
        const goldReward = formulas.rollQuantity(mob.gold_min, mob.gold_max);
        const drops = await this.rollDrops(mob.id);
        state.result = { winner: 'character', exp_reward: mob.exp_reward, gold_reward: goldReward, drops };
        turnLog.push({ turn: state.turn, actor: 'system', action: 'victory', message: `${mob.name} foi derrotado!` });
      }

    } else if (action.type === 'skill') {
      const skillId = action.skill_id;
      const charSkill = await db('character_skills')
        .where({ character_id: charId, skill_id: skillId })
        .first();

      if (!charSkill) {
        throw new Error('Habilidade não aprendida');
      }

      const skill = await db('skills').where({ id: skillId }).first();
      if (!skill) {
        throw new Error('Habilidade não encontrada');
      }

      if (charSkill.cooldown_remaining > 0) {
        throw new Error('Habilidade em cooldown');
      }

      if (skill.mp_cost > char.mp) {
        throw new Error('MP insuficiente');
      }

      char.mp -= skill.mp_cost;

      const effects = [];

      if (skill.damage_type === 'heal') {
        const healAmount = formulas.calcHealAmount(skill, { intelligence: char.magic_attack }, charSkill.level);
        char.hp = Math.min(char.maxHp, char.hp + healAmount);
        turnLog.push({ turn: state.turn, actor: 'character', action: 'skill', skill_name: skill.name, damage: -healAmount, critical: false, dodged: false, effects: ['heal'], hp_remaining: char.hp });
      } else if (skill.damage_type === 'buff') {
        const buff = {
          type: skill.effect_type,
          value: skill.effect_value + (skill.per_level_effect * (charSkill.level - 1)),
          duration: skill.effect_duration,
          source: skill.name
        };
        char.buffs.push(buff);
        this._applyBuff(char, buff);
        effects.push(skill.effect_type);
        turnLog.push({ turn: state.turn, actor: 'character', action: 'skill', skill_name: skill.name, damage: 0, critical: false, dodged: false, effects, hp_remaining: mob.hp });
      } else {
        const skillDmg = formulas.calcSkillDamage(skill, { strength: char.attack, intelligence: char.magic_attack, dexterity: char.speed, vitality: char.defense }, charSkill.level);
        let damage = 0;

        if (skill.damage_type === 'physical') {
          damage = formulas.calcPhysicalDamage(skillDmg, mob.defense, char.penetration, 1);
        } else if (skill.damage_type === 'magical') {
          damage = formulas.calcMagicDamage(skillDmg, mob.magic_defense, 1);
        } else if (skill.damage_type === 'hybrid') {
          damage = formulas.calcPhysicalDamage(skillDmg * 0.6, mob.defense, char.penetration, 1) +
                   formulas.calcMagicDamage(skillDmg * 0.6, mob.magic_defense, 1);
        }

        let isCrit = false;
        if (formulas.rollCritical(char.critical)) {
          damage = Math.floor(damage * 1.5);
          isCrit = true;
        }

        // Apply effect
        if (skill.effect_type && skill.effect_chance > 0 && formulas.rollEffect(skill.effect_chance)) {
          const debuff = {
            type: skill.effect_type,
            value: skill.effect_value + (skill.per_level_effect * (charSkill.level - 1)),
            duration: skill.effect_duration,
            source: skill.name
          };
          mob.debuffs.push(debuff);
          effects.push(skill.effect_type);
        }

        mob.hp = Math.max(0, mob.hp - damage);
        turnLog.push({ turn: state.turn, actor: 'character', action: 'skill', skill_name: skill.name, damage, critical: isCrit, dodged: false, effects, hp_remaining: mob.hp });

        if (mob.hp <= 0) {
          state.finished = true;
          const goldReward = formulas.rollQuantity(mob.gold_min, mob.gold_max);
          const drops = await this.rollDrops(mob.id);
          state.result = { winner: 'character', exp_reward: mob.exp_reward, gold_reward: goldReward, drops };
          turnLog.push({ turn: state.turn, actor: 'system', action: 'victory', message: `${mob.name} foi derrotado!` });
        }
      }

      // Set cooldown
      if (skill.cooldown > 0) {
        await db('character_skills')
          .where({ character_id: charId, skill_id: skillId })
          .update({ cooldown_remaining: skill.cooldown });
      }

    } else if (action.type === 'item') {
      const invId = action.inv_id;
      const result = await inventoryService.useItem(charId, invId);
      const updatedChar = result.character;
      char.hp = updatedChar.hp;
      char.mp = updatedChar.mp;
      turnLog.push({ turn: state.turn, actor: 'character', action: 'item', damage: 0, critical: false, dodged: false, effects: [result.message], hp_remaining: mob.hp });
    }
  },

  _executeMobAction(state, turnLog) {
    const char = state.character;
    const mob = state.mob;

    // Berserker mode below 30% HP
    const isBerserk = mob.hp < mob.maxHp * 0.3;
    let usedSkill = false;

    // Try to use a skill
    if (mob.skills && mob.skills.length > 0 && Math.random() < (isBerserk ? 0.6 : 0.3)) {
      const skill = mob.skills[Math.floor(Math.random() * mob.skills.length)];
      const mpCost = skill.mp_cost || 0;

      if (mob.mp >= mpCost) {
        mob.mp -= mpCost;
        let damage = 0;
        const effects = [];

        if (skill.damage_type === 'physical') {
          const atkMult = isBerserk ? 1.3 : 1.0;
          damage = formulas.calcPhysicalDamage(mob.attack * atkMult, char.defense, 0, skill.multiplier || 1.5);
        } else if (skill.damage_type === 'magical') {
          damage = formulas.calcMagicDamage(mob.magic_attack, char.magic_defense, skill.multiplier || 1.5);
        } else {
          damage = formulas.calcPhysicalDamage(mob.attack, char.defense, 0, skill.multiplier || 1.2);
        }

        // Apply skill effect
        if (skill.effect_type && Math.random() * 100 < (skill.effect_chance || 20)) {
          const debuff = {
            type: skill.effect_type,
            value: skill.effect_value || 5,
            duration: skill.effect_duration || 3,
            source: skill.name || 'Mob Skill'
          };
          char.debuffs.push(debuff);
          effects.push(skill.effect_type);
        }

        // Check dodge
        if (formulas.rollDodge(char.dodge)) {
          turnLog.push({ turn: state.turn, actor: 'mob', action: 'skill', skill_name: skill.name || 'Habilidade', damage: 0, critical: false, dodged: true, effects: [], hp_remaining: char.hp });
          usedSkill = true;
        } else {
          // Reflect damage
          if (char.equipment_bonuses && char.equipment_bonuses.reflect > 0) {
            const reflected = Math.floor(damage * char.equipment_bonuses.reflect / 100);
            mob.hp = Math.max(0, mob.hp - reflected);
          }

          // Crit resist
          let isCrit = Math.random() < 0.1;
          if (isCrit && char.equipment_bonuses && char.equipment_bonuses.crit_resist > 0) {
            if (Math.random() * 100 < char.equipment_bonuses.crit_resist) {
              isCrit = false;
            }
          }
          if (isCrit) damage = Math.floor(damage * 1.5);

          char.hp = Math.max(0, char.hp - damage);
          turnLog.push({ turn: state.turn, actor: 'mob', action: 'skill', skill_name: skill.name || 'Habilidade', damage, critical: isCrit, dodged: false, effects, hp_remaining: char.hp });
          usedSkill = true;
        }
      }
    }

    // Basic attack if no skill used
    if (!usedSkill) {
      const atkMult = isBerserk ? 1.3 : 1.0;

      if (formulas.rollDodge(char.dodge)) {
        turnLog.push({ turn: state.turn, actor: 'mob', action: 'attack', damage: 0, critical: false, dodged: true, effects: [], hp_remaining: char.hp });
        return;
      }

      let damage = formulas.calcPhysicalDamage(mob.attack * atkMult, char.defense, 0, 1);
      let isCrit = Math.random() < 0.08;

      if (isCrit && char.equipment_bonuses && char.equipment_bonuses.crit_resist > 0) {
        if (Math.random() * 100 < char.equipment_bonuses.crit_resist) {
          isCrit = false;
        }
      }
      if (isCrit) damage = Math.floor(damage * 1.5);

      // Reflect
      if (char.equipment_bonuses && char.equipment_bonuses.reflect > 0) {
        const reflected = Math.floor(damage * char.equipment_bonuses.reflect / 100);
        mob.hp = Math.max(0, mob.hp - reflected);
      }

      // Counter attack
      if (char.equipment_bonuses && char.equipment_bonuses.counter_attack > 0) {
        if (Math.random() * 100 < char.equipment_bonuses.counter_attack) {
          const counterDmg = Math.floor(char.attack * 0.3);
          mob.hp = Math.max(0, mob.hp - counterDmg);
          turnLog.push({ turn: state.turn, actor: 'character', action: 'counter', damage: counterDmg, critical: false, dodged: false, effects: ['counter_attack'], hp_remaining: mob.hp });
        }
      }

      char.hp = Math.max(0, char.hp - damage);
      turnLog.push({ turn: state.turn, actor: 'mob', action: 'attack', damage, critical: isCrit, dodged: false, effects: isBerserk ? ['berserk'] : [], hp_remaining: char.hp });
    }

    if (char.hp <= 0) {
      state.finished = true;
      state.result = { winner: 'mob', exp_reward: 0, gold_reward: 0, drops: [] };
      turnLog.push({ turn: state.turn, actor: 'system', action: 'defeat', message: `${char.name} foi derrotado!` });
    }
  },

  _processDOTs(entity, entityType, turnLog, state) {
    for (const debuff of entity.debuffs) {
      if (debuff.duration <= 0) continue;

      let dotDamage = 0;
      if (debuff.type === 'poison') {
        dotDamage = Math.floor(debuff.value);
      } else if (debuff.type === 'bleed') {
        dotDamage = Math.floor(debuff.value * 1.2);
      } else if (debuff.type === 'burn') {
        dotDamage = Math.floor(debuff.value * 1.5);
      }

      if (dotDamage > 0) {
        entity.hp = Math.max(0, entity.hp - dotDamage);
        turnLog.push({
          turn: state.turn,
          actor: 'dot',
          action: debuff.type,
          target: entityType,
          damage: dotDamage,
          critical: false,
          dodged: false,
          effects: [debuff.type],
          hp_remaining: entity.hp
        });

        if (entity.hp <= 0) {
          state.finished = true;
          if (entityType === 'mob') {
            const goldReward = formulas.rollQuantity(state.mob.gold_min, state.mob.gold_max);
            state.result = { winner: 'character', exp_reward: state.mob.exp_reward, gold_reward: goldReward, drops: [] };
            turnLog.push({ turn: state.turn, actor: 'system', action: 'victory', message: `${state.mob.name} morreu por ${debuff.type}!` });
          } else {
            state.result = { winner: 'mob', exp_reward: 0, gold_reward: 0, drops: [] };
            turnLog.push({ turn: state.turn, actor: 'system', action: 'defeat', message: `${state.character.name} morreu por ${debuff.type}!` });
          }
          return;
        }
      }
    }

    // Regen per turn (only for character)
    if (entityType === 'character' && entity.equipment_bonuses && entity.equipment_bonuses.regen_per_turn > 0) {
      const regen = entity.equipment_bonuses.regen_per_turn;
      entity.hp = Math.min(entity.maxHp, entity.hp + regen);
    }
  },

  _tickEffects(entity) {
    entity.buffs = entity.buffs.filter(b => {
      b.duration--;
      return b.duration > 0;
    });
    entity.debuffs = entity.debuffs.filter(d => {
      d.duration--;
      return d.duration > 0;
    });
  },

  _applyBuff(entity, buff) {
    switch (buff.type) {
      case 'atk_up':
        entity.attack += buff.value;
        break;
      case 'dodge_up':
        entity.dodge += buff.value;
        break;
      case 'all_stats_up':
        entity.attack += buff.value;
        entity.defense += buff.value;
        entity.magic_attack += buff.value;
        entity.magic_defense += buff.value;
        break;
      case 'shield':
        entity.defense += buff.value;
        break;
      case 'crit_up':
        entity.critical += buff.value;
        break;
    }
  },

  async rollDrops(mobId) {
    const mobDrops = await db('mob_drops')
      .join('items', 'mob_drops.item_id', 'items.id')
      .where({ mob_id: mobId })
      .select('mob_drops.*', 'items.name', 'items.type', 'items.subtype', 'items.rarity', 'items.equipment_slot', 'items.equippable');

    const drops = [];

    for (const drop of mobDrops) {
      if (formulas.rollDrop(drop.drop_chance)) {
        const qty = formulas.rollQuantity(drop.min_quantity, drop.max_quantity);
        const dropEntry = {
          item_id: drop.item_id,
          name: drop.name,
          quantity: qty,
          rarity: drop.rarity
        };

        // Generate bonuses for equipment drops
        if (drop.equippable && drop.equipment_slot) {
          const { NORMAL_BONUSES, SPECIAL_BONUSES, BONUS_POOLS } = require('../data/bonuses');
          const pool = BONUS_POOLS[drop.equipment_slot];

          if (pool) {
            const numBonuses = Math.floor(Math.random() * 3) + 1; // 1-3 random bonuses
            for (let i = 0; i < numBonuses && i < 5; i++) {
              const bonusType = pool.normal[Math.floor(Math.random() * pool.normal.length)];
              const bonusDef = NORMAL_BONUSES.find(b => b.type === bonusType);
              if (bonusDef) {
                const value = formulas.generateBonusValue(bonusDef.min, bonusDef.max, drop.rarity);
                dropEntry[`bonus_${i + 1}_type`] = bonusType;
                dropEntry[`bonus_${i + 1}_value`] = value;
              }
            }

            // Small chance for special bonus on rare+ drops
            if (['rare', 'epic', 'legendary'].includes(drop.rarity) && Math.random() < 0.2) {
              const specialType = pool.special[Math.floor(Math.random() * pool.special.length)];
              const specialDef = SPECIAL_BONUSES.find(b => b.type === specialType);
              if (specialDef) {
                dropEntry.special_bonus_1_type = specialType;
                dropEntry.special_bonus_1_value = formulas.generateBonusValue(specialDef.min, specialDef.max, drop.rarity);
              }
            }
          }
        }

        drops.push(dropEntry);
      }
    }

    return drops;
  }
};
