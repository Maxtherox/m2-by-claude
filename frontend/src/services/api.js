import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Character
export const createCharacter = (data) => client.post('/characters', data).then((r) => r.data);
export const getCharacter = (id) => client.get(`/characters/${id}`).then((r) => r.data);
export const saveCharacter = (id, data) => client.put(`/characters/${id}`, data).then((r) => r.data);
export const allocatePoints = (id, points) => client.post(`/characters/${id}/allocate-points`, points).then((r) => r.data);

// Game data
export const getKingdoms = () => client.get('/kingdoms').then((r) => r.data);
export const getClasses = () => client.get('/classes').then((r) => r.data);

// Inventory
export const getInventory = (charId) => client.get(`/inventory/${charId}`).then((r) => r.data);
export const getEquipment = (charId) => client.get(`/inventory/${charId}/equipment`).then((r) => r.data);
export const equipItem = (charId, invId) => client.post('/inventory/equip', { character_id: charId, inv_id: invId }).then((r) => r.data);
export const unequipItem = (charId, invId) => client.post('/inventory/unequip', { character_id: charId, inv_id: invId }).then((r) => r.data);
export const sellItem = (charId, invId, quantity) => client.post('/inventory/sell', { character_id: charId, inv_id: invId, quantity }).then((r) => r.data);
export const useItem = (charId, invId) => client.post('/inventory/use', { character_id: charId, inv_id: invId }).then((r) => r.data);

// Combat
export const startCombat = (charId, mobId) => client.post('/combat/start', { character_id: charId, mob_id: mobId }).then((r) => r.data);
export const combatTurn = (charId, combatState, action) => client.post('/combat/turn', { character_id: charId, combat_state: combatState, action }).then((r) => r.data);

// Areas
export const getAreas = () => client.get('/areas').then((r) => r.data);
export const getAreaDetails = (areaId) => client.get(`/areas/${areaId}`).then((r) => r.data);

// NPCs
export const getAreaNPCs = (areaId) => client.get(`/npcs/area/${areaId}`).then((r) => r.data);

// Skills
export const getClassSkills = (classId) => client.get(`/skills/class/${classId}`).then((r) => r.data);
export const getCharacterSkills = (charId) => client.get(`/skills/character/${charId}`).then((r) => r.data);
export const learnSkill = (charId, skillId) => client.post('/skills/learn', { character_id: charId, skill_id: skillId }).then((r) => r.data);
export const upgradeSkill = (charId, skillId) => client.post('/skills/upgrade', { character_id: charId, skill_id: skillId }).then((r) => r.data);

// Shop / NPC
export const getShopItems = (npcId) => client.get(`/shops/${npcId}`).then((r) => r.data);
export const buyItem = (charId, npcId, itemId, quantity) => client.post('/shops/buy', { character_id: charId, npc_id: npcId, item_id: itemId, quantity }).then((r) => r.data);

// Refine & Bonus
export const refineItem = (charId, invId) => client.post('/refine', { character_id: charId, inv_id: invId }).then((r) => r.data);
export const addBonus = (charId, invId, scrollType) => client.post('/bonuses/add', { character_id: charId, inv_id: invId, scroll_type: scrollType }).then((r) => r.data);
export const rerollBonus = (charId, invId, bonusSlot, scrollType) => client.post('/bonuses/reroll', { character_id: charId, inv_id: invId, bonus_slot: bonusSlot, scroll_type: scrollType }).then((r) => r.data);

// Crafting
export const getRecipes = (npcType) => client.get(`/crafting/recipes/${npcType}`).then((r) => r.data);
export const craft = (charId, recipeId) => client.post('/crafting/craft', { character_id: charId, recipe_id: recipeId }).then((r) => r.data);

// Lifeskills
export const getLifeskills = (charId) => client.get(`/lifeskills/${charId}`).then((r) => r.data);
export const performLifeskill = (charId, type, areaId) => client.post('/lifeskills/perform', { character_id: charId, type, area_id: areaId }).then((r) => r.data);

// Idle
export const startIdleSession = (charId, data) => client.post('/idle/start', { character_id: charId, ...data }).then((r) => r.data);
export const checkIdleSession = (charId) => client.get(`/idle/check/${charId}`).then((r) => r.data);
export const collectIdleResults = (charId) => client.post('/idle/collect', { character_id: charId }).then((r) => r.data);

// Healer
export const healCharacter = (charId) => client.post('/healer', { character_id: charId }).then((r) => r.data);

// Storage
export const getStorage = (charId) => client.get(`/storage/${charId}`).then((r) => r.data);
export const depositItem = (charId, invId, quantity) => client.post('/storage/deposit', { character_id: charId, inv_id: invId, quantity }).then((r) => r.data);
export const withdrawItem = (charId, storageId, quantity) => client.post('/storage/withdraw', { character_id: charId, storage_id: storageId, quantity }).then((r) => r.data);

export default client;
