const db = require('../database/connection');

module.exports = {
  async getAreas() {
    const areas = await db('areas').select('*').orderBy('level_min', 'asc');
    return areas;
  },

  async getAreaDetails(areaId) {
    const area = await db('areas').where({ id: areaId }).first();
    if (!area) {
      throw new Error('Área não encontrada');
    }

    const mobs = await db('mobs')
      .where({ area_id: areaId })
      .select('id', 'name', 'level', 'hp', 'attack', 'defense', 'type', 'behavior', 'exp_reward', 'gold_min', 'gold_max');

    const npcs = await db('npcs')
      .where({ area_id: areaId })
      .select('id', 'name', 'type', 'description', 'dialog');

    const resources = await db('area_resources')
      .join('items', 'area_resources.item_id', 'items.id')
      .where({ area_id: areaId })
      .select('area_resources.*', 'items.name as item_name');

    return {
      ...area,
      mobs,
      npcs,
      resources
    };
  }
};
