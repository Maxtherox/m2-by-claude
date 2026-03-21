const db = require('../database/connection');

module.exports = {
  async heal(charId) {
    const character = await db('characters').where({ id: charId }).first();
    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    const cost = character.level * 10;

    if (character.gold < cost) {
      throw new Error('Ouro insuficiente para curar');
    }

    const hpRestored = character.max_hp - character.hp;
    const mpRestored = character.max_mp - character.mp;
    const staminaRestored = character.max_stamina - character.stamina;

    await db('characters')
      .where({ id: charId })
      .update({
        hp: character.max_hp,
        mp: character.max_mp,
        stamina: character.max_stamina,
        gold: character.gold - cost
      });

    return {
      cost,
      hp_restored: hpRestored,
      mp_restored: mpRestored,
      stamina_restored: staminaRestored,
      new_gold: character.gold - cost,
      message: `Curado completamente por ${cost} de ouro`
    };
  }
};
