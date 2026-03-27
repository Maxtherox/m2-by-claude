exports.up = function(knex) {
  return knex.schema
    // --- Quest system ---
    .createTable('quests', (t) => {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.text('description');
      t.string('type').defaultTo('main'); // main, side, daily, repeatable
      t.integer('level_required').defaultTo(1);
      t.integer('honor_required').defaultTo(0);
      t.string('prerequisite_quest_ids'); // JSON array of quest IDs
      t.integer('giver_npc_id').references('id').inTable('npcs');
      t.integer('turnin_npc_id').references('id').inTable('npcs');
      t.integer('reward_exp').defaultTo(0);
      t.integer('reward_gold').defaultTo(0);
      t.integer('reward_honor').defaultTo(0);
      t.text('reward_items'); // JSON [{item_id, quantity}]
      t.boolean('repeatable').defaultTo(false);
      t.integer('chain_next_quest_id');
    })
    .createTable('quest_objectives', (t) => {
      t.increments('id').primary();
      t.integer('quest_id').references('id').inTable('quests').onDelete('CASCADE');
      t.string('type').notNullable(); // kill, collect, talk, visit_area, use_item, reach_level
      t.integer('target_id'); // mob_id, item_id, npc_id, area_id depending on type
      t.string('target_name');
      t.integer('required_amount').defaultTo(1);
      t.text('description');
      t.integer('order_index').defaultTo(0);
    })
    .createTable('character_quests', (t) => {
      t.increments('id').primary();
      t.integer('character_id').references('id').inTable('characters').onDelete('CASCADE');
      t.integer('quest_id').references('id').inTable('quests');
      t.string('status').defaultTo('available'); // available, active, completed, turned_in, failed
      t.text('objectives_progress'); // JSON {objective_id: current_count}
      t.timestamp('accepted_at');
      t.timestamp('completed_at');
      t.unique(['character_id', 'quest_id']);
    })

    // --- Dialog system ---
    .createTable('dialogs', (t) => {
      t.increments('id').primary();
      t.integer('npc_id').references('id').inTable('npcs');
      t.string('trigger').defaultTo('interact'); // interact, quest_available, quest_complete, condition
      t.integer('trigger_quest_id'); // optional: show only when this quest is active/available
      t.string('trigger_quest_status'); // optional: available, active, completed
      t.integer('priority').defaultTo(0); // higher priority shown first
    })
    .createTable('dialog_nodes', (t) => {
      t.increments('id').primary();
      t.integer('dialog_id').references('id').inTable('dialogs').onDelete('CASCADE');
      t.integer('node_index').defaultTo(0);
      t.string('speaker'); // npc name or 'player'
      t.text('text').notNullable();
      t.text('options'); // JSON [{text, next_node, action}]
      t.string('action'); // accept_quest, complete_quest, open_shop, open_storage, heal, null
      t.integer('action_param'); // quest_id, shop_npc_id, etc.
      t.boolean('is_end').defaultTo(false);
    })

    // --- Status effects ---
    .createTable('status_effect_definitions', (t) => {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.string('type').notNullable(); // buff_stat, debuff_stat, dot, hot, stun, slow, shield, regen
      t.string('stat_affected'); // attack, defense, speed, etc.
      t.integer('value').defaultTo(0);
      t.boolean('is_percentage').defaultTo(false);
      t.integer('default_duration').defaultTo(3); // turns
      t.boolean('stackable').defaultTo(false);
      t.integer('max_stacks').defaultTo(1);
      t.string('icon');
      t.text('description');
    })
    .createTable('character_active_effects', (t) => {
      t.increments('id').primary();
      t.integer('character_id').references('id').inTable('characters').onDelete('CASCADE');
      t.integer('effect_id').references('id').inTable('status_effect_definitions');
      t.integer('remaining_turns').defaultTo(3);
      t.integer('stacks').defaultTo(1);
      t.string('source'); // skill, item, boss, environment
      t.integer('source_id');
      t.timestamp('applied_at').defaultTo(knex.fn.now());
    })

    // --- Hotbar ---
    .createTable('character_hotbar', (t) => {
      t.increments('id').primary();
      t.integer('character_id').references('id').inTable('characters').onDelete('CASCADE');
      t.integer('slot_index').notNullable(); // 0-7 (8 slots)
      t.string('type'); // skill, item, empty
      t.integer('reference_id'); // skill_id or item_id
      t.string('keybind'); // 1-8, F1-F8, etc.
      t.unique(['character_id', 'slot_index']);
    })

    // --- Dungeons ---
    .createTable('dungeons', (t) => {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.text('description');
      t.integer('level_required').defaultTo(1);
      t.integer('total_floors').defaultTo(5);
      t.integer('time_limit').defaultTo(1800); // seconds
      t.integer('entry_cost_gold').defaultTo(0);
      t.integer('area_id').references('id').inTable('areas');
      t.text('reward_pool'); // JSON
    })
    .createTable('dungeon_floors', (t) => {
      t.increments('id').primary();
      t.integer('dungeon_id').references('id').inTable('dungeons').onDelete('CASCADE');
      t.integer('floor_number').notNullable();
      t.text('mobs'); // JSON [{mob_id, quantity}]
      t.integer('boss_mob_id');
      t.string('objective_type').defaultTo('kill_all'); // kill_all, kill_boss, survive
      t.text('reward_items'); // JSON
    })
    .createTable('character_dungeon_runs', (t) => {
      t.increments('id').primary();
      t.integer('character_id').references('id').inTable('characters').onDelete('CASCADE');
      t.integer('dungeon_id').references('id').inTable('dungeons');
      t.integer('current_floor').defaultTo(1);
      t.string('status').defaultTo('active'); // active, completed, failed, abandoned
      t.timestamp('started_at').defaultTo(knex.fn.now());
      t.timestamp('ended_at');
      t.text('results'); // JSON
    })

    // --- Elements ---
    .alterTable('mobs', (t) => {
      t.string('element').defaultTo('neutral');
    })
    .alterTable('items', (t) => {
      t.string('element').defaultTo('neutral');
      t.integer('element_damage').defaultTo(0);
    })
    .alterTable('characters', (t) => {
      t.text('element_resistances'); // JSON {fire: 0, water: 0, wind: 0, earth: 0, dark: 0, light: 0}
    })

    // --- Save system ---
    .createTable('save_slots', (t) => {
      t.increments('id').primary();
      t.integer('character_id').references('id').inTable('characters').onDelete('CASCADE');
      t.integer('slot_number').defaultTo(1);
      t.text('snapshot'); // JSON full state
      t.string('label');
      t.timestamp('saved_at').defaultTo(knex.fn.now());
      t.unique(['character_id', 'slot_number']);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('save_slots')
    .dropTableIfExists('character_dungeon_runs')
    .dropTableIfExists('dungeon_floors')
    .dropTableIfExists('dungeons')
    .dropTableIfExists('character_hotbar')
    .dropTableIfExists('character_active_effects')
    .dropTableIfExists('status_effect_definitions')
    .dropTableIfExists('dialog_nodes')
    .dropTableIfExists('dialogs')
    .dropTableIfExists('character_quests')
    .dropTableIfExists('quest_objectives')
    .dropTableIfExists('quests')
    .alterTable('mobs', (t) => { t.dropColumn('element'); })
    .alterTable('items', (t) => { t.dropColumn('element'); t.dropColumn('element_damage'); })
    .alterTable('characters', (t) => { t.dropColumn('element_resistances'); });
};
