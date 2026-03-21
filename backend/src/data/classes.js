module.exports = [
  {
    id: 1,
    name: 'Guerreiro',
    description: 'Mestre do combate corpo a corpo. Possui grande resistência e força devastadora, sendo a linha de frente em qualquer batalha.',
    base_str: 12, base_int: 4, base_vit: 10, base_dex: 6,
    str_per_level: 3, int_per_level: 1, vit_per_level: 2, dex_per_level: 1,
    preferred_weapons: JSON.stringify(['sword', 'two_handed_sword']),
    builds: JSON.stringify([
      { name: 'Corpo a Corpo', description: 'Foco em dano físico devastador e resistência bruta', focus: 'str' },
      { name: 'Mental', description: 'Guerreiro tático com habilidades de controle e buff', focus: 'int' }
    ])
  },
  {
    id: 2,
    name: 'Ninja',
    description: 'Assassino ágil e letal. Domina adagas e arcos, atacando com velocidade e precisão antes que o inimigo possa reagir.',
    base_str: 8, base_int: 5, base_vit: 6, base_dex: 13,
    str_per_level: 1, int_per_level: 1, vit_per_level: 1, dex_per_level: 4,
    preferred_weapons: JSON.stringify(['dagger', 'bow']),
    builds: JSON.stringify([
      { name: 'Adaga', description: 'Combate aproximado com crítico devastador e veneno', focus: 'dex' },
      { name: 'Arco', description: 'Combate à distância com precisão mortal', focus: 'dex' }
    ])
  },
  {
    id: 3,
    name: 'Sura',
    description: 'Guerreiro sombrio que canaliza magia negra. Híbrido entre combatente físico e mago, capaz de drenar vida e amaldiçoar inimigos.',
    base_str: 9, base_int: 9, base_vit: 8, base_dex: 6,
    str_per_level: 2, int_per_level: 2, vit_per_level: 2, dex_per_level: 1,
    preferred_weapons: JSON.stringify(['sword', 'magic_sword']),
    builds: JSON.stringify([
      { name: 'Armas Mágicas', description: 'Combate físico potencializado por magia negra', focus: 'str' },
      { name: 'Magia Negra', description: 'Foco em feitiços destrutivos e debuffs sombrios', focus: 'int' }
    ])
  },
  {
    id: 4,
    name: 'Shamã',
    description: 'Mística capaz de curar aliados e destruir inimigos com poderes elementais. Domina o equilíbrio entre ataque mágico e suporte.',
    base_str: 4, base_int: 14, base_vit: 7, base_dex: 7,
    str_per_level: 1, int_per_level: 4, vit_per_level: 1, dex_per_level: 1,
    preferred_weapons: JSON.stringify(['fan', 'bell']),
    builds: JSON.stringify([
      { name: 'Dragão', description: 'Foco em dano mágico ofensivo devastador', focus: 'int' },
      { name: 'Cura', description: 'Foco em suporte, regeneração e buffs defensivos', focus: 'vit' }
    ])
  }
];
