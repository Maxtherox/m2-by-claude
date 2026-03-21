// Drop tables for all mobs
// item IDs reference items.js - calculated based on order
// Weapons: 1-21, Armors: 22-29, Helmets: 30-35, Shields: 36-40, Boots: 41-45
// Earrings: 46-49, Necklaces: 50-53, Bracelets: 54-57
// Consumables: 58-69, Materials: 70-84, Stones: 85-92
// Refine: 93-96, Bonus: 97-100, Vendor trash: 101-108

module.exports = [
  // ==================== CAMPO DE BATALHA ====================
  // Lobo Selvagem (1)
  { mob_id: 1, item_id: 101, drop_chance: 0.60, min_quantity: 1, max_quantity: 2 }, // Presa de Lobo
  { mob_id: 1, item_id: 58, drop_chance: 0.25, min_quantity: 1, max_quantity: 1 }, // Poção HP Peq
  { mob_id: 1, item_id: 70, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Minério Ferro
  // Lobo Cinzento (2)
  { mob_id: 2, item_id: 101, drop_chance: 0.65, min_quantity: 1, max_quantity: 2 },
  { mob_id: 2, item_id: 58, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 2, item_id: 70, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 },
  { mob_id: 2, item_id: 1, drop_chance: 0.03, min_quantity: 1, max_quantity: 1 }, // Espada Longa
  // Javali (3)
  { mob_id: 3, item_id: 105, drop_chance: 0.55, min_quantity: 1, max_quantity: 2 }, // Garra de Urso
  { mob_id: 3, item_id: 58, drop_chance: 0.30, min_quantity: 1, max_quantity: 1 },
  { mob_id: 3, item_id: 80, drop_chance: 0.15, min_quantity: 1, max_quantity: 2 }, // Madeira Simples
  // Raposa (4)
  { mob_id: 4, item_id: 101, drop_chance: 0.50, min_quantity: 1, max_quantity: 1 },
  { mob_id: 4, item_id: 58, drop_chance: 0.25, min_quantity: 1, max_quantity: 1 },
  { mob_id: 4, item_id: 83, drop_chance: 0.15, min_quantity: 1, max_quantity: 2 }, // Erva Medicinal
  // Urso Pardo (5)
  { mob_id: 5, item_id: 105, drop_chance: 0.60, min_quantity: 1, max_quantity: 2 },
  { mob_id: 5, item_id: 58, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 5, item_id: 22, drop_chance: 0.04, min_quantity: 1, max_quantity: 1 }, // Armadura de Pano
  { mob_id: 5, item_id: 41, drop_chance: 0.04, min_quantity: 1, max_quantity: 1 }, // Botas de Pano
  // Tigre Jovem (6)
  { mob_id: 6, item_id: 101, drop_chance: 0.55, min_quantity: 1, max_quantity: 2 },
  { mob_id: 6, item_id: 58, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 6, item_id: 61, drop_chance: 0.20, min_quantity: 1, max_quantity: 1 }, // Poção MP Peq
  { mob_id: 6, item_id: 7, drop_chance: 0.04, min_quantity: 1, max_quantity: 1 }, // Adaga Simples
  { mob_id: 6, item_id: 36, drop_chance: 0.04, min_quantity: 1, max_quantity: 1 }, // Escudo Madeira
  // Bandido (7)
  { mob_id: 7, item_id: 106, drop_chance: 0.50, min_quantity: 1, max_quantity: 2 }, // Osso Antigo
  { mob_id: 7, item_id: 58, drop_chance: 0.35, min_quantity: 1, max_quantity: 2 },
  { mob_id: 7, item_id: 70, drop_chance: 0.15, min_quantity: 1, max_quantity: 2 },
  { mob_id: 7, item_id: 93, drop_chance: 0.05, min_quantity: 1, max_quantity: 1 }, // Pergaminho Refino
  { mob_id: 7, item_id: 30, drop_chance: 0.03, min_quantity: 1, max_quantity: 1 }, // Elmo Couro
  // Capitão Bandido (8, elite)
  { mob_id: 8, item_id: 106, drop_chance: 0.70, min_quantity: 1, max_quantity: 3 },
  { mob_id: 8, item_id: 58, drop_chance: 0.50, min_quantity: 2, max_quantity: 3 },
  { mob_id: 8, item_id: 61, drop_chance: 0.40, min_quantity: 1, max_quantity: 2 },
  { mob_id: 8, item_id: 93, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 },
  { mob_id: 8, item_id: 2, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Espada do Guerreiro
  { mob_id: 8, item_id: 23, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Armadura Couro
  { mob_id: 8, item_id: 85, drop_chance: 0.08, min_quantity: 1, max_quantity: 1 }, // Pedra da Força
  { mob_id: 8, item_id: 97, drop_chance: 0.05, min_quantity: 1, max_quantity: 1 }, // Pergaminho Bônus
  // Rei dos Lobos (9, boss)
  { mob_id: 9, item_id: 101, drop_chance: 0.80, min_quantity: 2, max_quantity: 5 },
  { mob_id: 9, item_id: 58, drop_chance: 0.70, min_quantity: 3, max_quantity: 5 },
  { mob_id: 9, item_id: 59, drop_chance: 0.50, min_quantity: 1, max_quantity: 3 }, // Poção HP Média
  { mob_id: 9, item_id: 93, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 9, item_id: 8, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 }, // Adaga Assassino
  { mob_id: 9, item_id: 23, drop_chance: 0.20, min_quantity: 1, max_quantity: 1 },
  { mob_id: 9, item_id: 31, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 }, // Elmo Ferro
  { mob_id: 9, item_id: 37, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 }, // Escudo Ferro
  { mob_id: 9, item_id: 85, drop_chance: 0.20, min_quantity: 1, max_quantity: 1 },
  { mob_id: 9, item_id: 86, drop_chance: 0.20, min_quantity: 1, max_quantity: 1 }, // Pedra Intel
  { mob_id: 9, item_id: 97, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 },

  // ==================== FLORESTA SOMBRIA ====================
  // Orc Guerreiro (10)
  { mob_id: 10, item_id: 106, drop_chance: 0.55, min_quantity: 1, max_quantity: 2 },
  { mob_id: 10, item_id: 58, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 10, item_id: 71, drop_chance: 0.15, min_quantity: 1, max_quantity: 2 }, // Minério Cobre
  { mob_id: 10, item_id: 81, drop_chance: 0.12, min_quantity: 1, max_quantity: 2 }, // Madeira Carvalho
  // Orc Arqueiro (11)
  { mob_id: 11, item_id: 106, drop_chance: 0.55, min_quantity: 1, max_quantity: 2 },
  { mob_id: 11, item_id: 58, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 11, item_id: 12, drop_chance: 0.04, min_quantity: 1, max_quantity: 1 }, // Arco Longo
  { mob_id: 11, item_id: 81, drop_chance: 0.15, min_quantity: 1, max_quantity: 2 },
  // Orc Shamã (12)
  { mob_id: 12, item_id: 106, drop_chance: 0.55, min_quantity: 1, max_quantity: 2 },
  { mob_id: 12, item_id: 61, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 12, item_id: 83, drop_chance: 0.20, min_quantity: 1, max_quantity: 3 },
  { mob_id: 12, item_id: 46, drop_chance: 0.05, min_quantity: 1, max_quantity: 1 }, // Brinco Simples
  // Aranha Gigante (13)
  { mob_id: 13, item_id: 102, drop_chance: 0.60, min_quantity: 1, max_quantity: 3 }, // Olho Aranha
  { mob_id: 13, item_id: 58, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 13, item_id: 83, drop_chance: 0.18, min_quantity: 1, max_quantity: 2 },
  { mob_id: 13, item_id: 50, drop_chance: 0.04, min_quantity: 1, max_quantity: 1 }, // Colar Simples
  // Espírito da Floresta (14, elite)
  { mob_id: 14, item_id: 103, drop_chance: 0.60, min_quantity: 1, max_quantity: 2 }, // Pena Flamejante
  { mob_id: 14, item_id: 59, drop_chance: 0.40, min_quantity: 1, max_quantity: 2 },
  { mob_id: 14, item_id: 62, drop_chance: 0.40, min_quantity: 1, max_quantity: 2 }, // Poção MP Média
  { mob_id: 14, item_id: 93, drop_chance: 0.20, min_quantity: 1, max_quantity: 1 },
  { mob_id: 14, item_id: 3, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Espada Cavaleiro
  { mob_id: 14, item_id: 24, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Armadura Malha
  { mob_id: 14, item_id: 87, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Pedra Vitalidade
  { mob_id: 14, item_id: 88, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Pedra Destreza
  { mob_id: 14, item_id: 97, drop_chance: 0.08, min_quantity: 1, max_quantity: 1 },
  // Líder Orc (15, boss)
  { mob_id: 15, item_id: 106, drop_chance: 0.80, min_quantity: 2, max_quantity: 5 },
  { mob_id: 15, item_id: 59, drop_chance: 0.60, min_quantity: 2, max_quantity: 4 },
  { mob_id: 15, item_id: 62, drop_chance: 0.50, min_quantity: 1, max_quantity: 3 },
  { mob_id: 15, item_id: 93, drop_chance: 0.35, min_quantity: 1, max_quantity: 2 },
  { mob_id: 15, item_id: 19, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 }, // Espada Amaldiçoada
  { mob_id: 15, item_id: 28, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 }, // Manto Ninja
  { mob_id: 15, item_id: 32, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 }, // Elmo Guerreiro
  { mob_id: 15, item_id: 38, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 }, // Escudo Cavaleiro
  { mob_id: 15, item_id: 43, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 }, // Botas Ferro
  { mob_id: 15, item_id: 47, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Brinco Rubi
  { mob_id: 15, item_id: 89, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 }, // Pedra Ataque
  { mob_id: 15, item_id: 90, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 }, // Pedra Defesa
  { mob_id: 15, item_id: 97, drop_chance: 0.20, min_quantity: 1, max_quantity: 1 },
  { mob_id: 15, item_id: 98, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Pergaminho Bônus Raro

  // ==================== MINA ABANDONADA ====================
  // Golem de Pedra (16)
  { mob_id: 16, item_id: 70, drop_chance: 0.40, min_quantity: 1, max_quantity: 3 },
  { mob_id: 16, item_id: 72, drop_chance: 0.20, min_quantity: 1, max_quantity: 2 }, // Minério Prata
  { mob_id: 16, item_id: 59, drop_chance: 0.25, min_quantity: 1, max_quantity: 1 },
  { mob_id: 16, item_id: 106, drop_chance: 0.45, min_quantity: 1, max_quantity: 2 },
  // Morcego (17)
  { mob_id: 17, item_id: 102, drop_chance: 0.50, min_quantity: 1, max_quantity: 2 },
  { mob_id: 17, item_id: 59, drop_chance: 0.25, min_quantity: 1, max_quantity: 1 },
  { mob_id: 17, item_id: 83, drop_chance: 0.15, min_quantity: 1, max_quantity: 2 },
  // Mineiro Morto-Vivo (18)
  { mob_id: 18, item_id: 106, drop_chance: 0.50, min_quantity: 1, max_quantity: 2 },
  { mob_id: 18, item_id: 70, drop_chance: 0.30, min_quantity: 1, max_quantity: 3 },
  { mob_id: 18, item_id: 72, drop_chance: 0.15, min_quantity: 1, max_quantity: 2 },
  { mob_id: 18, item_id: 93, drop_chance: 0.08, min_quantity: 1, max_quantity: 1 },
  // Escorpião (19)
  { mob_id: 19, item_id: 102, drop_chance: 0.55, min_quantity: 1, max_quantity: 2 },
  { mob_id: 19, item_id: 59, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 19, item_id: 83, drop_chance: 0.20, min_quantity: 1, max_quantity: 2 },
  // Golem de Ferro (20, elite)
  { mob_id: 20, item_id: 70, drop_chance: 0.50, min_quantity: 2, max_quantity: 5 },
  { mob_id: 20, item_id: 72, drop_chance: 0.30, min_quantity: 1, max_quantity: 3 },
  { mob_id: 20, item_id: 93, drop_chance: 0.20, min_quantity: 1, max_quantity: 1 },
  { mob_id: 20, item_id: 4, drop_chance: 0.08, min_quantity: 1, max_quantity: 1 }, // Espada Flamejante
  { mob_id: 20, item_id: 25, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Armadura Placas
  { mob_id: 20, item_id: 89, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 },
  { mob_id: 20, item_id: 97, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 },
  // Rei Golem (21, boss)
  { mob_id: 21, item_id: 70, drop_chance: 0.80, min_quantity: 3, max_quantity: 8 },
  { mob_id: 21, item_id: 72, drop_chance: 0.60, min_quantity: 2, max_quantity: 5 },
  { mob_id: 21, item_id: 73, drop_chance: 0.30, min_quantity: 1, max_quantity: 3 }, // Minério Ouro
  { mob_id: 21, item_id: 93, drop_chance: 0.40, min_quantity: 1, max_quantity: 2 },
  { mob_id: 21, item_id: 94, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 }, // Pergaminho Abençoado
  { mob_id: 21, item_id: 4, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 },
  { mob_id: 21, item_id: 25, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 },
  { mob_id: 21, item_id: 33, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 }, // Elmo Comandante
  { mob_id: 21, item_id: 89, drop_chance: 0.20, min_quantity: 1, max_quantity: 1 },
  { mob_id: 21, item_id: 91, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Pedra Crítico
  { mob_id: 21, item_id: 98, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 },
  { mob_id: 21, item_id: 99, drop_chance: 0.08, min_quantity: 1, max_quantity: 1 }, // Perg Bônus Especial

  // ==================== RUÍNAS ANCESTRAIS ====================
  // Esqueleto Guerreiro (22)
  { mob_id: 22, item_id: 106, drop_chance: 0.50, min_quantity: 1, max_quantity: 2 },
  { mob_id: 22, item_id: 59, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 22, item_id: 93, drop_chance: 0.08, min_quantity: 1, max_quantity: 1 },
  // Esqueleto Mago (23)
  { mob_id: 23, item_id: 107, drop_chance: 0.50, min_quantity: 1, max_quantity: 2 }, // Cristal Sombrio
  { mob_id: 23, item_id: 62, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 23, item_id: 84, drop_chance: 0.15, min_quantity: 1, max_quantity: 2 }, // Flor Mística
  // Zumbi (24)
  { mob_id: 24, item_id: 106, drop_chance: 0.55, min_quantity: 1, max_quantity: 3 },
  { mob_id: 24, item_id: 59, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 24, item_id: 83, drop_chance: 0.20, min_quantity: 1, max_quantity: 3 },
  // Cavaleiro Negro (25)
  { mob_id: 25, item_id: 107, drop_chance: 0.50, min_quantity: 1, max_quantity: 2 },
  { mob_id: 25, item_id: 59, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 25, item_id: 6, drop_chance: 0.04, min_quantity: 1, max_quantity: 1 }, // Grande Espada
  { mob_id: 25, item_id: 93, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 },
  // Lich (26, elite)
  { mob_id: 26, item_id: 107, drop_chance: 0.60, min_quantity: 1, max_quantity: 3 },
  { mob_id: 26, item_id: 60, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 }, // Poção HP Grande
  { mob_id: 26, item_id: 63, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 }, // Poção MP Grande
  { mob_id: 26, item_id: 93, drop_chance: 0.25, min_quantity: 1, max_quantity: 1 },
  { mob_id: 26, item_id: 20, drop_chance: 0.08, min_quantity: 1, max_quantity: 1 }, // Lâmina Trevas
  { mob_id: 26, item_id: 48, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Brinco Safira
  { mob_id: 26, item_id: 91, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 },
  { mob_id: 26, item_id: 92, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 }, // Pedra Velocidade
  { mob_id: 26, item_id: 99, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 },
  // Senhor das Trevas (27, boss)
  { mob_id: 27, item_id: 107, drop_chance: 0.80, min_quantity: 2, max_quantity: 5 },
  { mob_id: 27, item_id: 60, drop_chance: 0.60, min_quantity: 2, max_quantity: 4 },
  { mob_id: 27, item_id: 63, drop_chance: 0.50, min_quantity: 1, max_quantity: 3 },
  { mob_id: 27, item_id: 94, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 27, item_id: 95, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Pedra de Refino
  { mob_id: 27, item_id: 5, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Espada Dragão
  { mob_id: 27, item_id: 26, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 }, // Armadura General
  { mob_id: 27, item_id: 34, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Coroa Espinhos
  { mob_id: 27, item_id: 39, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Escudo Dragão
  { mob_id: 27, item_id: 44, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 }, // Botas Rápidas
  { mob_id: 27, item_id: 52, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Colar Ouro
  { mob_id: 27, item_id: 91, drop_chance: 0.20, min_quantity: 1, max_quantity: 1 },
  { mob_id: 27, item_id: 92, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 },
  { mob_id: 27, item_id: 98, drop_chance: 0.20, min_quantity: 1, max_quantity: 1 },
  { mob_id: 27, item_id: 99, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 },

  // ==================== DESERTO VERMELHO ====================
  // Escorpião do Deserto (28)
  { mob_id: 28, item_id: 103, drop_chance: 0.50, min_quantity: 1, max_quantity: 2 },
  { mob_id: 28, item_id: 59, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 28, item_id: 73, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 },
  // Naga (29)
  { mob_id: 29, item_id: 103, drop_chance: 0.50, min_quantity: 1, max_quantity: 2 },
  { mob_id: 29, item_id: 59, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 29, item_id: 93, drop_chance: 0.08, min_quantity: 1, max_quantity: 1 },
  // Múmia (30)
  { mob_id: 30, item_id: 107, drop_chance: 0.50, min_quantity: 1, max_quantity: 2 },
  { mob_id: 30, item_id: 60, drop_chance: 0.20, min_quantity: 1, max_quantity: 1 },
  { mob_id: 30, item_id: 84, drop_chance: 0.15, min_quantity: 1, max_quantity: 2 },
  // Serpente (31)
  { mob_id: 31, item_id: 103, drop_chance: 0.55, min_quantity: 1, max_quantity: 2 },
  { mob_id: 31, item_id: 59, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 31, item_id: 83, drop_chance: 0.18, min_quantity: 1, max_quantity: 2 },
  // Esfinge (32, elite)
  { mob_id: 32, item_id: 107, drop_chance: 0.55, min_quantity: 1, max_quantity: 3 },
  { mob_id: 32, item_id: 60, drop_chance: 0.35, min_quantity: 1, max_quantity: 2 },
  { mob_id: 32, item_id: 63, drop_chance: 0.35, min_quantity: 1, max_quantity: 2 },
  { mob_id: 32, item_id: 94, drop_chance: 0.20, min_quantity: 1, max_quantity: 1 },
  { mob_id: 32, item_id: 5, drop_chance: 0.08, min_quantity: 1, max_quantity: 1 },
  { mob_id: 32, item_id: 10, drop_chance: 0.08, min_quantity: 1, max_quantity: 1 }, // Adaga Sombria
  { mob_id: 32, item_id: 14, drop_chance: 0.08, min_quantity: 1, max_quantity: 1 }, // Arco Celestial
  { mob_id: 32, item_id: 91, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 },
  { mob_id: 32, item_id: 99, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 },
  // Imperador (33, boss)
  { mob_id: 33, item_id: 104, drop_chance: 0.80, min_quantity: 2, max_quantity: 5 }, // Escama Dragão
  { mob_id: 33, item_id: 60, drop_chance: 0.70, min_quantity: 2, max_quantity: 5 },
  { mob_id: 33, item_id: 63, drop_chance: 0.60, min_quantity: 2, max_quantity: 4 },
  { mob_id: 33, item_id: 94, drop_chance: 0.40, min_quantity: 1, max_quantity: 2 },
  { mob_id: 33, item_id: 95, drop_chance: 0.20, min_quantity: 1, max_quantity: 1 },
  { mob_id: 33, item_id: 96, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Proteção Refino
  { mob_id: 33, item_id: 5, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 },
  { mob_id: 33, item_id: 26, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 },
  { mob_id: 33, item_id: 34, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 },
  { mob_id: 33, item_id: 45, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 }, // Botas Dragão
  { mob_id: 33, item_id: 49, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Brinco Dragão
  { mob_id: 33, item_id: 53, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Colar Dragão
  { mob_id: 33, item_id: 91, drop_chance: 0.25, min_quantity: 1, max_quantity: 1 },
  { mob_id: 33, item_id: 92, drop_chance: 0.20, min_quantity: 1, max_quantity: 1 },
  { mob_id: 33, item_id: 99, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 },
  { mob_id: 33, item_id: 100, drop_chance: 0.08, min_quantity: 1, max_quantity: 1 }, // Perg Bônus Especial Raro

  // ==================== TEMPLO DO DEMÔNIO ====================
  // Guardião Templo (34)
  { mob_id: 34, item_id: 107, drop_chance: 0.50, min_quantity: 1, max_quantity: 2 },
  { mob_id: 34, item_id: 60, drop_chance: 0.25, min_quantity: 1, max_quantity: 1 },
  { mob_id: 34, item_id: 93, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 },
  // Monge Corrompido (35)
  { mob_id: 35, item_id: 107, drop_chance: 0.50, min_quantity: 1, max_quantity: 2 },
  { mob_id: 35, item_id: 63, drop_chance: 0.25, min_quantity: 1, max_quantity: 1 },
  { mob_id: 35, item_id: 84, drop_chance: 0.15, min_quantity: 1, max_quantity: 2 },
  // Demônio Menor (36)
  { mob_id: 36, item_id: 108, drop_chance: 0.40, min_quantity: 1, max_quantity: 2 }, // Essência Demoníaca
  { mob_id: 36, item_id: 60, drop_chance: 0.28, min_quantity: 1, max_quantity: 2 },
  { mob_id: 36, item_id: 74, drop_chance: 0.08, min_quantity: 1, max_quantity: 1 }, // Minério Diamante
  // Espírito Ancestral (37)
  { mob_id: 37, item_id: 107, drop_chance: 0.50, min_quantity: 1, max_quantity: 2 },
  { mob_id: 37, item_id: 63, drop_chance: 0.28, min_quantity: 1, max_quantity: 2 },
  { mob_id: 37, item_id: 84, drop_chance: 0.18, min_quantity: 1, max_quantity: 2 },
  // Demônio de Fogo (38, elite)
  { mob_id: 38, item_id: 108, drop_chance: 0.55, min_quantity: 1, max_quantity: 3 },
  { mob_id: 38, item_id: 60, drop_chance: 0.40, min_quantity: 2, max_quantity: 3 },
  { mob_id: 38, item_id: 63, drop_chance: 0.40, min_quantity: 1, max_quantity: 2 },
  { mob_id: 38, item_id: 95, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 },
  { mob_id: 38, item_id: 27, drop_chance: 0.08, min_quantity: 1, max_quantity: 1 }, // Armadura Dragão
  { mob_id: 38, item_id: 21, drop_chance: 0.06, min_quantity: 1, max_quantity: 1 }, // Espada Demoníaca
  { mob_id: 38, item_id: 91, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 },
  { mob_id: 38, item_id: 99, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 },
  // Sumo Sacerdote (39, boss)
  { mob_id: 39, item_id: 108, drop_chance: 0.80, min_quantity: 2, max_quantity: 5 },
  { mob_id: 39, item_id: 60, drop_chance: 0.70, min_quantity: 3, max_quantity: 5 },
  { mob_id: 39, item_id: 63, drop_chance: 0.60, min_quantity: 2, max_quantity: 4 },
  { mob_id: 39, item_id: 95, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 39, item_id: 96, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 },
  { mob_id: 39, item_id: 21, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 },
  { mob_id: 39, item_id: 27, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 },
  { mob_id: 39, item_id: 40, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Escudo Sagrado
  { mob_id: 39, item_id: 45, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 },
  { mob_id: 39, item_id: 57, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 }, // Bracelete Dragão
  { mob_id: 39, item_id: 91, drop_chance: 0.25, min_quantity: 1, max_quantity: 1 },
  { mob_id: 39, item_id: 92, drop_chance: 0.20, min_quantity: 1, max_quantity: 1 },
  { mob_id: 39, item_id: 100, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 },

  // ==================== CAVERNA DO DRAGÃO ====================
  // Dragão Jovem (40)
  { mob_id: 40, item_id: 104, drop_chance: 0.50, min_quantity: 1, max_quantity: 2 },
  { mob_id: 40, item_id: 60, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 40, item_id: 74, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 },
  { mob_id: 40, item_id: 93, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 },
  // Guerreiro Dragão (41)
  { mob_id: 41, item_id: 104, drop_chance: 0.50, min_quantity: 1, max_quantity: 2 },
  { mob_id: 41, item_id: 60, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 41, item_id: 94, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 },
  // Demônio Superior (42)
  { mob_id: 42, item_id: 108, drop_chance: 0.50, min_quantity: 1, max_quantity: 2 },
  { mob_id: 42, item_id: 63, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 42, item_id: 74, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 },
  // Guardião Ancestral (43)
  { mob_id: 43, item_id: 107, drop_chance: 0.50, min_quantity: 1, max_quantity: 2 },
  { mob_id: 43, item_id: 60, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 43, item_id: 95, drop_chance: 0.08, min_quantity: 1, max_quantity: 1 },
  // Hidra (44, elite)
  { mob_id: 44, item_id: 104, drop_chance: 0.60, min_quantity: 2, max_quantity: 4 },
  { mob_id: 44, item_id: 60, drop_chance: 0.50, min_quantity: 2, max_quantity: 3 },
  { mob_id: 44, item_id: 63, drop_chance: 0.45, min_quantity: 1, max_quantity: 3 },
  { mob_id: 44, item_id: 95, drop_chance: 0.20, min_quantity: 1, max_quantity: 1 },
  { mob_id: 44, item_id: 96, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 },
  { mob_id: 44, item_id: 21, drop_chance: 0.08, min_quantity: 1, max_quantity: 1 },
  { mob_id: 44, item_id: 27, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 },
  { mob_id: 44, item_id: 91, drop_chance: 0.18, min_quantity: 1, max_quantity: 1 },
  { mob_id: 44, item_id: 92, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 },
  { mob_id: 44, item_id: 100, drop_chance: 0.10, min_quantity: 1, max_quantity: 1 },
  // Metin (45, BOSS FINAL)
  { mob_id: 45, item_id: 104, drop_chance: 0.90, min_quantity: 3, max_quantity: 8 },
  { mob_id: 45, item_id: 108, drop_chance: 0.80, min_quantity: 2, max_quantity: 5 },
  { mob_id: 45, item_id: 60, drop_chance: 0.80, min_quantity: 3, max_quantity: 5 },
  { mob_id: 45, item_id: 63, drop_chance: 0.70, min_quantity: 2, max_quantity: 5 },
  { mob_id: 45, item_id: 95, drop_chance: 0.40, min_quantity: 1, max_quantity: 2 },
  { mob_id: 45, item_id: 96, drop_chance: 0.25, min_quantity: 1, max_quantity: 1 },
  { mob_id: 45, item_id: 21, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 },
  { mob_id: 45, item_id: 27, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 },
  { mob_id: 45, item_id: 40, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 },
  { mob_id: 45, item_id: 45, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 },
  { mob_id: 45, item_id: 49, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 },
  { mob_id: 45, item_id: 53, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 },
  { mob_id: 45, item_id: 57, drop_chance: 0.12, min_quantity: 1, max_quantity: 1 },
  { mob_id: 45, item_id: 91, drop_chance: 0.30, min_quantity: 1, max_quantity: 2 },
  { mob_id: 45, item_id: 92, drop_chance: 0.25, min_quantity: 1, max_quantity: 2 },
  { mob_id: 45, item_id: 99, drop_chance: 0.20, min_quantity: 1, max_quantity: 1 },
  { mob_id: 45, item_id: 100, drop_chance: 0.15, min_quantity: 1, max_quantity: 1 },
];
