// Resources available in each area for lifeskills
// Item IDs: Ores 70-74, Wood 80-82, Herbs 83-84
module.exports = [
  // Campo de Batalha (area 4)
  { area_id: 4, resource_type: 'mining', item_id: 70, level_required: 1, exp_reward: 10 },    // Minério Ferro
  { area_id: 4, resource_type: 'woodcutting', item_id: 80, level_required: 1, exp_reward: 10 }, // Madeira Simples
  { area_id: 4, resource_type: 'farming', item_id: 83, level_required: 1, exp_reward: 10 },     // Erva Medicinal

  // Floresta Sombria (area 5)
  { area_id: 5, resource_type: 'mining', item_id: 70, level_required: 1, exp_reward: 12 },
  { area_id: 5, resource_type: 'mining', item_id: 71, level_required: 5, exp_reward: 18 },     // Minério Cobre
  { area_id: 5, resource_type: 'woodcutting', item_id: 80, level_required: 1, exp_reward: 12 },
  { area_id: 5, resource_type: 'woodcutting', item_id: 81, level_required: 5, exp_reward: 20 }, // Madeira Carvalho
  { area_id: 5, resource_type: 'farming', item_id: 83, level_required: 1, exp_reward: 12 },

  // Mina Abandonada (area 6)
  { area_id: 6, resource_type: 'mining', item_id: 70, level_required: 1, exp_reward: 14 },
  { area_id: 6, resource_type: 'mining', item_id: 71, level_required: 5, exp_reward: 20 },
  { area_id: 6, resource_type: 'mining', item_id: 72, level_required: 10, exp_reward: 30 },    // Minério Prata
  { area_id: 6, resource_type: 'woodcutting', item_id: 80, level_required: 1, exp_reward: 14 },

  // Ruínas Ancestrais (area 7)
  { area_id: 7, resource_type: 'mining', item_id: 72, level_required: 10, exp_reward: 32 },
  { area_id: 7, resource_type: 'mining', item_id: 73, level_required: 15, exp_reward: 45 },    // Minério Ouro
  { area_id: 7, resource_type: 'farming', item_id: 83, level_required: 1, exp_reward: 16 },
  { area_id: 7, resource_type: 'farming', item_id: 84, level_required: 10, exp_reward: 35 },   // Flor Mística

  // Deserto Vermelho (area 8)
  { area_id: 8, resource_type: 'mining', item_id: 73, level_required: 15, exp_reward: 48 },
  { area_id: 8, resource_type: 'farming', item_id: 84, level_required: 10, exp_reward: 38 },

  // Templo do Demônio (area 9)
  { area_id: 9, resource_type: 'mining', item_id: 73, level_required: 15, exp_reward: 50 },
  { area_id: 9, resource_type: 'mining', item_id: 74, level_required: 20, exp_reward: 65 },    // Minério Diamante
  { area_id: 9, resource_type: 'farming', item_id: 84, level_required: 10, exp_reward: 40 },

  // Caverna do Dragão (area 10)
  { area_id: 10, resource_type: 'mining', item_id: 74, level_required: 20, exp_reward: 70 },
  { area_id: 10, resource_type: 'woodcutting', item_id: 82, level_required: 15, exp_reward: 55 }, // Madeira Rara
];
