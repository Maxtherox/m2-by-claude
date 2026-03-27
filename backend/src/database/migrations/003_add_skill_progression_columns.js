exports.up = function(knex) {
  return knex.schema.alterTable('character_skills', (t) => {
    // Estagio de progressao: NORMAL, MASTER, GRAND_MASTER, PERFECT_MASTER
    t.string('progress_stage').defaultTo('NORMAL');

    // Nivel dentro de cada estagio avancado
    t.integer('master_stage_level').defaultTo(0);
    t.integer('grand_stage_level').defaultTo(0);
    t.integer('perfect_stage_level').defaultTo(0);

    // Controle de leitura de livros
    t.integer('master_book_reads').defaultTo(0);

    // Tracking
    t.integer('times_used').defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('character_skills', (t) => {
    t.dropColumn('progress_stage');
    t.dropColumn('master_stage_level');
    t.dropColumn('grand_stage_level');
    t.dropColumn('perfect_stage_level');
    t.dropColumn('master_book_reads');
    t.dropColumn('times_used');
  });
};
