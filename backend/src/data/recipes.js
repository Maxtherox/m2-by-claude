// Item IDs reference: Ores 70-74, Ingots 75-79, Wood 80-82, Herbs 83-84
// Equipment: Swords 1-6, Armors 22-29, etc.
// Consumables: HP potions 58-60, MP 61-63, Stamina 64

module.exports = [
  // ==================== FUNDIÇÃO (ore -> ingot) ====================
  { id: 1, name: 'Fundir Ferro', result_item_id: 75, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 70, quantity: 3 }] },
  { id: 2, name: 'Fundir Cobre', result_item_id: 76, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 71, quantity: 3 }] },
  { id: 3, name: 'Fundir Prata', result_item_id: 77, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 72, quantity: 3 }] },
  { id: 4, name: 'Fundir Ouro', result_item_id: 78, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 73, quantity: 3 }] },
  { id: 5, name: 'Fundir Diamante', result_item_id: 79, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 74, quantity: 3 }] },

  // ==================== EQUIPAMENTOS CRAFTÁVEIS ====================
  { id: 6, name: 'Forjar Espada do Cavaleiro', result_item_id: 3, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 75, quantity: 5 }, { item_id: 76, quantity: 3 }, { item_id: 80, quantity: 2 }] },
  { id: 7, name: 'Forjar Espada Flamejante', result_item_id: 4, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 77, quantity: 5 }, { item_id: 75, quantity: 8 }, { item_id: 84, quantity: 3 }] },
  { id: 8, name: 'Forjar Armadura de Malha', result_item_id: 24, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 75, quantity: 8 }, { item_id: 76, quantity: 5 }] },
  { id: 9, name: 'Forjar Armadura de Placas', result_item_id: 25, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 75, quantity: 12 }, { item_id: 77, quantity: 4 }, { item_id: 81, quantity: 3 }] },
  { id: 10, name: 'Forjar Elmo do Guerreiro', result_item_id: 32, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 75, quantity: 4 }, { item_id: 76, quantity: 3 }] },
  { id: 11, name: 'Forjar Escudo do Cavaleiro', result_item_id: 38, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 75, quantity: 6 }, { item_id: 81, quantity: 4 }] },
  { id: 12, name: 'Forjar Botas de Ferro', result_item_id: 43, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 75, quantity: 4 }, { item_id: 76, quantity: 2 }] },
  { id: 13, name: 'Forjar Adaga do Vento', result_item_id: 9, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 77, quantity: 3 }, { item_id: 75, quantity: 5 }, { item_id: 84, quantity: 2 }] },
  { id: 14, name: 'Forjar Arco do Caçador', result_item_id: 13, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 81, quantity: 6 }, { item_id: 82, quantity: 2 }, { item_id: 77, quantity: 2 }] },
  { id: 15, name: 'Forjar Bracelete de Jade', result_item_id: 56, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 77, quantity: 3 }, { item_id: 84, quantity: 3 }] },

  // ==================== POÇÕES (lifeskill_master) ====================
  { id: 16, name: 'Preparar Poção de HP Média', result_item_id: 59, result_quantity: 3, npc_type: 'lifeskill_master', materials: [{ item_id: 83, quantity: 5 }] },
  { id: 17, name: 'Preparar Poção de HP Grande', result_item_id: 60, result_quantity: 2, npc_type: 'lifeskill_master', materials: [{ item_id: 83, quantity: 8 }, { item_id: 84, quantity: 2 }] },
  { id: 18, name: 'Preparar Poção de MP Média', result_item_id: 62, result_quantity: 3, npc_type: 'lifeskill_master', materials: [{ item_id: 84, quantity: 3 }] },
  { id: 19, name: 'Preparar Poção de MP Grande', result_item_id: 63, result_quantity: 2, npc_type: 'lifeskill_master', materials: [{ item_id: 84, quantity: 5 }, { item_id: 83, quantity: 3 }] },
  { id: 20, name: 'Preparar Poção de Stamina', result_item_id: 64, result_quantity: 3, npc_type: 'lifeskill_master', materials: [{ item_id: 83, quantity: 3 }] },

  // ==================== PEDRAS (blacksmith) ====================
  { id: 21, name: 'Criar Pedra do Ataque', result_item_id: 89, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 85, quantity: 2 }, { item_id: 88, quantity: 1 }, { item_id: 78, quantity: 1 }] },
  { id: 22, name: 'Criar Pedra da Defesa', result_item_id: 90, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 87, quantity: 2 }, { item_id: 85, quantity: 1 }, { item_id: 78, quantity: 1 }] },
  { id: 23, name: 'Criar Pedra do Crítico', result_item_id: 91, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 88, quantity: 3 }, { item_id: 78, quantity: 2 }] },
  { id: 24, name: 'Criar Pedra da Velocidade', result_item_id: 92, result_quantity: 1, npc_type: 'blacksmith', materials: [{ item_id: 88, quantity: 2 }, { item_id: 86, quantity: 1 }, { item_id: 78, quantity: 2 }] },
];
