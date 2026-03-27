exports.up = function(knex) {
  return knex.schema.alterTable('characters', (t) => {
    // Honor system
    t.integer('honor').defaultTo(0);

    // Total accumulated XP
    t.integer('exp_total').defaultTo(0);

    // Permanent level-up bonuses (auto-growth for high levels)
    t.integer('level_bonus_attack_physical').defaultTo(0);
    t.integer('level_bonus_attack_magic').defaultTo(0);
    t.integer('level_bonus_defense').defaultTo(0);
    t.integer('level_bonus_hp').defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('characters', (t) => {
    t.dropColumn('honor');
    t.dropColumn('exp_total');
    t.dropColumn('level_bonus_attack_physical');
    t.dropColumn('level_bonus_attack_magic');
    t.dropColumn('level_bonus_defense');
    t.dropColumn('level_bonus_hp');
  });
};
