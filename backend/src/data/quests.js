// ============================================================
// QUESTS DATABASE - Metin2 RPG Homenagem
// Total: 10 starter quests
// ============================================================

module.exports = [
  // ==================== MAIN STORY CHAIN (3 quests) ====================
  {
    id: 1,
    name: 'O Chamado do Mestre',
    description: 'O Mestre Wu percebeu seu potencial e deseja testá-lo. Prove seu valor eliminando as criaturas que ameaçam os arredores da vila.',
    type: 'main',
    level_required: 1,
    honor_required: 0,
    prerequisite_quest_ids: '[]',
    giver_npc_id: 4,    // Mestre Wu
    turnin_npc_id: 4,    // Mestre Wu
    reward_exp: 120,
    reward_gold: 200,
    reward_honor: 5,
    reward_items: JSON.stringify([{ item_id: 58, quantity: 10 }]), // 10x Poção de HP Pequena
    repeatable: false,
    chain_next_quest_id: 2,
    objectives: [
      { type: 'kill', target_id: 1, target_name: 'Lobo Selvagem', required_amount: 5, description: 'Eliminar 5 Lobos Selvagens', order_index: 0 },
      { type: 'kill', target_id: 3, target_name: 'Javali', required_amount: 3, description: 'Eliminar 3 Javalis', order_index: 1 }
    ]
  },
  {
    id: 2,
    name: 'A Ameaça dos Bandidos',
    description: 'Bandidos têm atacado viajantes nos campos de batalha. O Mestre Wu precisa que você derrote seu líder e traga paz à região.',
    type: 'main',
    level_required: 5,
    honor_required: 0,
    prerequisite_quest_ids: JSON.stringify([1]),
    giver_npc_id: 4,    // Mestre Wu
    turnin_npc_id: 4,    // Mestre Wu
    reward_exp: 350,
    reward_gold: 500,
    reward_honor: 10,
    reward_items: JSON.stringify([{ item_id: 24, quantity: 1 }]), // Armadura de Couro
    repeatable: false,
    chain_next_quest_id: 3,
    objectives: [
      { type: 'kill', target_id: 7, target_name: 'Bandido', required_amount: 8, description: 'Eliminar 8 Bandidos', order_index: 0 },
      { type: 'kill', target_id: 8, target_name: 'Capitão Bandido', required_amount: 1, description: 'Derrotar o Capitão Bandido', order_index: 1 }
    ]
  },
  {
    id: 3,
    name: 'O Rei dos Lobos',
    description: 'Uma criatura terrível domina os campos - o Rei dos Lobos. Derrote-o e leve a notícia ao Mestre Wu para provar que está pronto para desafios maiores.',
    type: 'main',
    level_required: 8,
    honor_required: 0,
    prerequisite_quest_ids: JSON.stringify([2]),
    giver_npc_id: 4,    // Mestre Wu
    turnin_npc_id: 4,    // Mestre Wu
    reward_exp: 800,
    reward_gold: 1000,
    reward_honor: 25,
    reward_items: JSON.stringify([{ item_id: 2, quantity: 1 }, { item_id: 58, quantity: 20 }]), // Espada do Guerreiro + 20x HP Pot
    repeatable: false,
    chain_next_quest_id: null,
    objectives: [
      { type: 'kill', target_id: 9, target_name: 'Rei dos Lobos', required_amount: 1, description: 'Derrotar o Rei dos Lobos', order_index: 0 },
      { type: 'talk', target_id: 4, target_name: 'Mestre Wu', required_amount: 1, description: 'Reportar ao Mestre Wu', order_index: 1 }
    ]
  },

  // ==================== KILL QUESTS (3 quests) ====================
  {
    id: 4,
    name: 'Caçada Selvagem',
    description: 'Os lobos estão se multiplicando e ameaçam os rebanhos da vila. A Curandeira Mei precisa de presas de lobo para seus remédios.',
    type: 'side',
    level_required: 1,
    honor_required: 0,
    prerequisite_quest_ids: '[]',
    giver_npc_id: 5,    // Curandeira Mei
    turnin_npc_id: 5,    // Curandeira Mei
    reward_exp: 80,
    reward_gold: 100,
    reward_honor: 0,
    reward_items: JSON.stringify([{ item_id: 58, quantity: 5 }]), // 5x Poção de HP Pequena
    repeatable: true,
    chain_next_quest_id: null,
    objectives: [
      { type: 'kill', target_id: 1, target_name: 'Lobo Selvagem', required_amount: 10, description: 'Eliminar 10 Lobos Selvagens', order_index: 0 },
      { type: 'kill', target_id: 2, target_name: 'Lobo Cinzento', required_amount: 5, description: 'Eliminar 5 Lobos Cinzentos', order_index: 1 }
    ]
  },
  {
    id: 5,
    name: 'Perigo nos Campos',
    description: 'Ursos e raposas estão atacando coletores nas proximidades. O Comerciante Lee pede ajuda para garantir a segurança das rotas comerciais.',
    type: 'side',
    level_required: 3,
    honor_required: 0,
    prerequisite_quest_ids: '[]',
    giver_npc_id: 1,    // Comerciante Lee
    turnin_npc_id: 1,    // Comerciante Lee
    reward_exp: 150,
    reward_gold: 250,
    reward_honor: 3,
    reward_items: JSON.stringify([{ item_id: 42, quantity: 1 }]), // Botas de Pano
    repeatable: false,
    chain_next_quest_id: null,
    objectives: [
      { type: 'kill', target_id: 5, target_name: 'Urso Pardo', required_amount: 5, description: 'Eliminar 5 Ursos Pardos', order_index: 0 },
      { type: 'kill', target_id: 4, target_name: 'Raposa Selvagem', required_amount: 5, description: 'Eliminar 5 Raposas Selvagens', order_index: 1 }
    ]
  },
  {
    id: 6,
    name: 'Ameaça Tigre',
    description: 'Tigres jovens foram avistados perto da vila. São criaturas perigosas que precisam ser contidas antes que ataquem os moradores.',
    type: 'side',
    level_required: 4,
    honor_required: 0,
    prerequisite_quest_ids: '[]',
    giver_npc_id: 7,    // Guardião do Cofre
    turnin_npc_id: 7,    // Guardião do Cofre
    reward_exp: 200,
    reward_gold: 300,
    reward_honor: 5,
    reward_items: JSON.stringify([{ item_id: 31, quantity: 1 }]), // Elmo de Couro
    repeatable: false,
    chain_next_quest_id: null,
    objectives: [
      { type: 'kill', target_id: 6, target_name: 'Tigre Jovem', required_amount: 8, description: 'Eliminar 8 Tigres Jovens', order_index: 0 }
    ]
  },

  // ==================== COLLECT QUESTS (2 quests) ====================
  {
    id: 7,
    name: 'Suprimentos para a Vila',
    description: 'O Ferreiro Han precisa de minério de ferro para manter sua forja funcionando. Colete minério nas proximidades e traga a ele.',
    type: 'side',
    level_required: 1,
    honor_required: 0,
    prerequisite_quest_ids: '[]',
    giver_npc_id: 2,    // Ferreiro Han
    turnin_npc_id: 2,    // Ferreiro Han
    reward_exp: 60,
    reward_gold: 150,
    reward_honor: 0,
    reward_items: JSON.stringify([{ item_id: 37, quantity: 1 }]), // Escudo de Madeira
    repeatable: true,
    chain_next_quest_id: null,
    objectives: [
      { type: 'collect', target_id: 64, target_name: 'Minério de Ferro', required_amount: 10, description: 'Coletar 10 Minérios de Ferro', order_index: 0 }
    ]
  },
  {
    id: 8,
    name: 'Ervas Curativas',
    description: 'A Curandeira Mei está ficando sem ervas medicinais. Ela precisa que você colete ervas nos campos para preparar seus remédios.',
    type: 'side',
    level_required: 2,
    honor_required: 0,
    prerequisite_quest_ids: '[]',
    giver_npc_id: 5,    // Curandeira Mei
    turnin_npc_id: 5,    // Curandeira Mei
    reward_exp: 90,
    reward_gold: 120,
    reward_honor: 0,
    reward_items: JSON.stringify([{ item_id: 58, quantity: 8 }, { item_id: 61, quantity: 5 }]), // 8x HP pot + 5x MP pot
    repeatable: true,
    chain_next_quest_id: null,
    objectives: [
      { type: 'collect', target_id: 77, target_name: 'Erva Medicinal', required_amount: 8, description: 'Coletar 8 Ervas Medicinais', order_index: 0 }
    ]
  },

  // ==================== TALK QUEST (1 quest) ====================
  {
    id: 9,
    name: 'Conselho do Mestre de Ofícios',
    description: 'O Mestre Wu recomenda que você visite o Mestre de Ofícios Tao para aprender sobre coleta de recursos. Fale com Tao e depois retorne ao Mestre Wu.',
    type: 'side',
    level_required: 1,
    honor_required: 0,
    prerequisite_quest_ids: '[]',
    giver_npc_id: 4,    // Mestre Wu
    turnin_npc_id: 4,    // Mestre Wu
    reward_exp: 40,
    reward_gold: 50,
    reward_honor: 0,
    reward_items: JSON.stringify([{ item_id: 64, quantity: 5 }]), // 5x Minério de Ferro
    repeatable: false,
    chain_next_quest_id: null,
    objectives: [
      { type: 'talk', target_id: 6, target_name: 'Mestre de Ofícios Tao', required_amount: 1, description: 'Falar com o Mestre de Ofícios Tao', order_index: 0 },
      { type: 'talk', target_id: 4, target_name: 'Mestre Wu', required_amount: 1, description: 'Retornar ao Mestre Wu', order_index: 1 }
    ]
  },

  // ==================== VISIT AREA QUEST (1 quest) ====================
  {
    id: 10,
    name: 'Explorando o Desconhecido',
    description: 'O Comerciante Lee precisa saber se as rotas para o Campo de Batalha e a Floresta Sombria estão seguras. Explore essas áreas e retorne com informações.',
    type: 'side',
    level_required: 3,
    honor_required: 0,
    prerequisite_quest_ids: '[]',
    giver_npc_id: 1,    // Comerciante Lee
    turnin_npc_id: 1,    // Comerciante Lee
    reward_exp: 100,
    reward_gold: 180,
    reward_honor: 2,
    reward_items: JSON.stringify([{ item_id: 58, quantity: 5 }]), // 5x HP pot
    repeatable: false,
    chain_next_quest_id: null,
    objectives: [
      { type: 'visit_area', target_id: 4, target_name: 'Campo de Batalha', required_amount: 1, description: 'Visitar o Campo de Batalha', order_index: 0 },
      { type: 'visit_area', target_id: 5, target_name: 'Floresta Sombria', required_amount: 1, description: 'Visitar a Floresta Sombria', order_index: 1 }
    ]
  }
];
