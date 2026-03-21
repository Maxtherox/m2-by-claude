const kingdoms = require('../../data/kingdoms');
const classes = require('../../data/classes');
const items = require('../../data/items');
const skills = require('../../data/skills');
const mobs = require('../../data/mobs');
const mobDrops = require('../../data/mob_drops');
const areas = require('../../data/areas');
const npcs = require('../../data/npcs');
const npcShops = require('../../data/npc_shops');
const recipes = require('../../data/recipes');
const areaResources = require('../../data/area_resources');

exports.seed = async function(knex) {
  // Clear all tables in reverse dependency order
  await knex('character_storage').del();
  await knex('idle_sessions').del();
  await knex('area_resources').del();
  await knex('character_lifeskills').del();
  await knex('recipe_materials').del();
  await knex('recipes').del();
  await knex('npc_shops').del();
  await knex('npcs').del();
  await knex('mob_drops').del();
  await knex('mobs').del();
  await knex('character_skills').del();
  await knex('skills').del();
  await knex('character_inventory').del();
  await knex('items').del();
  await knex('characters').del();
  await knex('classes').del();
  await knex('kingdoms').del();
  await knex('areas').del();

  // Seed areas first (referenced by kingdoms and mobs)
  await knex('areas').insert(areas);

  // Seed kingdoms
  await knex('kingdoms').insert(kingdoms);

  // Seed classes
  await knex('classes').insert(classes);

  // Seed items in batches (SQLite has variable limit)
  const itemBatchSize = 20;
  for (let i = 0; i < items.length; i += itemBatchSize) {
    await knex('items').insert(items.slice(i, i + itemBatchSize));
  }

  // Seed skills
  await knex('skills').insert(skills);

  // Seed mobs
  await knex('mobs').insert(mobs);

  // Seed mob drops in batches
  for (let i = 0; i < mobDrops.length; i += itemBatchSize) {
    await knex('mob_drops').insert(mobDrops.slice(i, i + itemBatchSize));
  }

  // Seed NPCs
  await knex('npcs').insert(npcs);

  // Seed NPC shops in batches
  for (let i = 0; i < npcShops.length; i += itemBatchSize) {
    await knex('npc_shops').insert(npcShops.slice(i, i + itemBatchSize));
  }

  // Seed recipes
  for (const recipe of recipes) {
    const { materials, ...recipeData } = recipe;
    await knex('recipes').insert(recipeData);
    if (materials && materials.length > 0) {
      await knex('recipe_materials').insert(
        materials.map(m => ({ recipe_id: recipe.id, item_id: m.item_id, quantity: m.quantity }))
      );
    }
  }

  // Seed area resources
  await knex('area_resources').insert(areaResources);

  console.log('[Seed] Todos os dados foram inseridos com sucesso!');
  console.log(`[Seed] ${items.length} itens, ${mobs.length} mobs, ${mobDrops.length} drops, ${skills.length} skills, ${npcs.length} NPCs, ${recipes.length} receitas`);
};
