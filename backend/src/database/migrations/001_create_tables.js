exports.up = function(knex) {
  return knex.schema
    .createTable('kingdoms', (t) => {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.text('description');
      t.string('color');
      t.string('emblem');
      t.integer('start_area_id');
    })
    .createTable('classes', (t) => {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.text('description');
      t.integer('base_str').defaultTo(5);
      t.integer('base_int').defaultTo(5);
      t.integer('base_vit').defaultTo(5);
      t.integer('base_dex').defaultTo(5);
      t.integer('str_per_level').defaultTo(1);
      t.integer('int_per_level').defaultTo(1);
      t.integer('vit_per_level').defaultTo(1);
      t.integer('dex_per_level').defaultTo(1);
      t.text('preferred_weapons'); // JSON
      t.text('builds'); // JSON
    })
    .createTable('characters', (t) => {
      t.increments('id').primary();
      t.string('name').notNullable().unique();
      t.integer('kingdom_id').references('id').inTable('kingdoms');
      t.integer('class_id').references('id').inTable('classes');
      t.integer('level').defaultTo(1);
      t.integer('exp').defaultTo(0);
      t.integer('gold').defaultTo(1000);
      t.integer('hp');
      t.integer('max_hp');
      t.integer('mp');
      t.integer('max_mp');
      t.integer('stamina');
      t.integer('max_stamina');
      t.integer('strength');
      t.integer('intelligence');
      t.integer('vitality');
      t.integer('dexterity');
      t.integer('status_points').defaultTo(0);
      t.integer('skill_points').defaultTo(0);
      t.integer('current_area_id').defaultTo(1);
      t.text('appearance'); // JSON
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('items', (t) => {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.string('type').notNullable();
      t.string('subtype');
      t.text('description');
      t.string('rarity').defaultTo('common');
      t.integer('level_required').defaultTo(1);
      t.integer('class_required');
      t.integer('attack').defaultTo(0);
      t.integer('magic_attack').defaultTo(0);
      t.integer('defense').defaultTo(0);
      t.integer('magic_defense').defaultTo(0);
      t.integer('speed').defaultTo(0);
      t.integer('hp_bonus').defaultTo(0);
      t.integer('mp_bonus').defaultTo(0);
      t.integer('buy_price').defaultTo(0);
      t.integer('sell_price').defaultTo(0);
      t.boolean('stackable').defaultTo(false);
      t.integer('max_stack').defaultTo(1);
      t.boolean('refineable').defaultTo(false);
      t.boolean('equippable').defaultTo(false);
      t.string('equipment_slot');
      t.string('effect_type');
      t.integer('effect_value').defaultTo(0);
    })
    .createTable('character_inventory', (t) => {
      t.increments('id').primary();
      t.integer('character_id').references('id').inTable('characters').onDelete('CASCADE');
      t.integer('item_id').references('id').inTable('items');
      t.integer('slot').defaultTo(0);
      t.integer('quantity').defaultTo(1);
      t.integer('refinement').defaultTo(0);
      t.string('bonus_1_type'); t.integer('bonus_1_value').defaultTo(0);
      t.string('bonus_2_type'); t.integer('bonus_2_value').defaultTo(0);
      t.string('bonus_3_type'); t.integer('bonus_3_value').defaultTo(0);
      t.string('bonus_4_type'); t.integer('bonus_4_value').defaultTo(0);
      t.string('bonus_5_type'); t.integer('bonus_5_value').defaultTo(0);
      t.string('special_bonus_1_type'); t.integer('special_bonus_1_value').defaultTo(0);
      t.string('special_bonus_2_type'); t.integer('special_bonus_2_value').defaultTo(0);
      t.boolean('equipped').defaultTo(false);
      t.string('equipment_slot');
    })
    .createTable('skills', (t) => {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.integer('class_id').references('id').inTable('classes');
      t.string('type'); // active, passive
      t.string('damage_type'); // physical, magical, hybrid, heal, buff, debuff
      t.text('description');
      t.integer('mp_cost').defaultTo(0);
      t.integer('stamina_cost').defaultTo(0);
      t.integer('base_damage').defaultTo(0);
      t.string('scaling_attribute');
      t.float('scaling_factor').defaultTo(1.0);
      t.string('effect_type');
      t.integer('effect_chance').defaultTo(0);
      t.integer('effect_value').defaultTo(0);
      t.integer('effect_duration').defaultTo(0);
      t.integer('cooldown').defaultTo(0);
      t.integer('level_required').defaultTo(1);
      t.integer('max_level').defaultTo(10);
      t.integer('per_level_damage').defaultTo(0);
      t.integer('per_level_effect').defaultTo(0);
    })
    .createTable('character_skills', (t) => {
      t.increments('id').primary();
      t.integer('character_id').references('id').inTable('characters').onDelete('CASCADE');
      t.integer('skill_id').references('id').inTable('skills');
      t.integer('level').defaultTo(1);
      t.integer('cooldown_remaining').defaultTo(0);
    })
    .createTable('mobs', (t) => {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.integer('level').defaultTo(1);
      t.integer('hp');
      t.integer('mp').defaultTo(0);
      t.integer('attack');
      t.integer('magic_attack').defaultTo(0);
      t.integer('defense');
      t.integer('magic_defense').defaultTo(0);
      t.integer('speed').defaultTo(5);
      t.integer('exp_reward');
      t.integer('gold_min');
      t.integer('gold_max');
      t.integer('area_id').references('id').inTable('areas');
      t.string('type').defaultTo('normal');
      t.string('behavior').defaultTo('passive');
      t.text('skills'); // JSON
    })
    .createTable('mob_drops', (t) => {
      t.increments('id').primary();
      t.integer('mob_id').references('id').inTable('mobs');
      t.integer('item_id').references('id').inTable('items');
      t.float('drop_chance');
      t.integer('min_quantity').defaultTo(1);
      t.integer('max_quantity').defaultTo(1);
    })
    .createTable('areas', (t) => {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.text('description');
      t.integer('level_min');
      t.integer('level_max');
      t.integer('kingdom_id');
      t.string('type');
      t.boolean('has_resources').defaultTo(false);
    })
    .createTable('npcs', (t) => {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.string('type');
      t.integer('area_id').references('id').inTable('areas');
      t.integer('kingdom_id');
      t.text('description');
      t.text('dialog');
    })
    .createTable('npc_shops', (t) => {
      t.increments('id').primary();
      t.integer('npc_id').references('id').inTable('npcs');
      t.integer('item_id').references('id').inTable('items');
      t.integer('stock').defaultTo(-1);
    })
    .createTable('recipes', (t) => {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.integer('result_item_id').references('id').inTable('items');
      t.integer('result_quantity').defaultTo(1);
      t.string('npc_type');
    })
    .createTable('recipe_materials', (t) => {
      t.increments('id').primary();
      t.integer('recipe_id').references('id').inTable('recipes');
      t.integer('item_id').references('id').inTable('items');
      t.integer('quantity').defaultTo(1);
    })
    .createTable('character_lifeskills', (t) => {
      t.increments('id').primary();
      t.integer('character_id').references('id').inTable('characters').onDelete('CASCADE').unique();
      t.integer('mining_level').defaultTo(1);
      t.integer('mining_exp').defaultTo(0);
      t.integer('woodcutting_level').defaultTo(1);
      t.integer('woodcutting_exp').defaultTo(0);
      t.integer('farming_level').defaultTo(1);
      t.integer('farming_exp').defaultTo(0);
    })
    .createTable('area_resources', (t) => {
      t.increments('id').primary();
      t.integer('area_id').references('id').inTable('areas');
      t.string('resource_type');
      t.integer('item_id').references('id').inTable('items');
      t.integer('level_required').defaultTo(1);
      t.integer('exp_reward').defaultTo(10);
    })
    .createTable('idle_sessions', (t) => {
      t.increments('id').primary();
      t.integer('character_id').references('id').inTable('characters').onDelete('CASCADE');
      t.string('type'); // combat, mining, woodcutting, farming
      t.integer('area_id');
      t.integer('mob_id');
      t.timestamp('start_time').defaultTo(knex.fn.now());
      t.integer('duration'); // seconds
      t.boolean('completed').defaultTo(false);
      t.text('results'); // JSON
    })
    .createTable('character_storage', (t) => {
      t.increments('id').primary();
      t.integer('character_id').references('id').inTable('characters').onDelete('CASCADE');
      t.integer('item_id').references('id').inTable('items');
      t.integer('quantity').defaultTo(1);
      t.integer('refinement').defaultTo(0);
      t.string('bonus_1_type'); t.integer('bonus_1_value').defaultTo(0);
      t.string('bonus_2_type'); t.integer('bonus_2_value').defaultTo(0);
      t.string('bonus_3_type'); t.integer('bonus_3_value').defaultTo(0);
      t.string('bonus_4_type'); t.integer('bonus_4_value').defaultTo(0);
      t.string('bonus_5_type'); t.integer('bonus_5_value').defaultTo(0);
      t.string('special_bonus_1_type'); t.integer('special_bonus_1_value').defaultTo(0);
      t.string('special_bonus_2_type'); t.integer('special_bonus_2_value').defaultTo(0);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('character_storage')
    .dropTableIfExists('idle_sessions')
    .dropTableIfExists('area_resources')
    .dropTableIfExists('character_lifeskills')
    .dropTableIfExists('recipe_materials')
    .dropTableIfExists('recipes')
    .dropTableIfExists('npc_shops')
    .dropTableIfExists('npcs')
    .dropTableIfExists('mob_drops')
    .dropTableIfExists('mobs')
    .dropTableIfExists('character_skills')
    .dropTableIfExists('skills')
    .dropTableIfExists('character_inventory')
    .dropTableIfExists('items')
    .dropTableIfExists('characters')
    .dropTableIfExists('classes')
    .dropTableIfExists('kingdoms')
    .dropTableIfExists('areas');
};
