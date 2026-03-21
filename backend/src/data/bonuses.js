const NORMAL_BONUSES = [
  { type: 'strength', label: '+Força', min: 1, max: 15 },
  { type: 'intelligence', label: '+Inteligência', min: 1, max: 15 },
  { type: 'vitality', label: '+Vitalidade', min: 1, max: 15 },
  { type: 'dexterity', label: '+Destreza', min: 1, max: 15 },
  { type: 'max_hp', label: '+HP Máximo', min: 50, max: 500 },
  { type: 'max_mp', label: '+MP Máximo', min: 30, max: 300 },
  { type: 'max_stamina', label: '+Stamina Máxima', min: 10, max: 100 },
  { type: 'attack', label: '+Ataque Físico', min: 5, max: 50 },
  { type: 'magic_attack', label: '+Ataque Mágico', min: 5, max: 50 },
  { type: 'defense', label: '+Defesa', min: 3, max: 30 },
  { type: 'critical', label: '+Crítico %', min: 1, max: 10 },
  { type: 'dodge', label: '+Esquiva %', min: 1, max: 10 },
  { type: 'accuracy', label: '+Acerto', min: 5, max: 30 },
  { type: 'speed', label: '+Velocidade', min: 1, max: 5 },
  { type: 'damage_vs_monster', label: '+Dano vs Monstros %', min: 1, max: 15 },
  { type: 'damage_vs_boss', label: '+Dano vs Chefes %', min: 1, max: 20 },
  { type: 'drop_rate', label: '+Taxa de Drop %', min: 1, max: 10 },
  { type: 'exp_bonus', label: '+EXP Bônus %', min: 1, max: 10 },
  { type: 'magic_defense', label: '+Resistência Mágica', min: 3, max: 30 },
  { type: 'penetration', label: '+Perfuração', min: 3, max: 20 }
];

const SPECIAL_BONUSES = [
  { type: 'stun_immunity', label: 'Imunidade a Stun %', min: 5, max: 30 },
  { type: 'reflect', label: 'Refletir Dano %', min: 3, max: 15 },
  { type: 'hp_absorb', label: 'Absorção de HP %', min: 3, max: 12 },
  { type: 'mp_absorb', label: 'Absorção de MP %', min: 3, max: 10 },
  { type: 'crit_resist', label: 'Resistência a Crítico %', min: 5, max: 25 },
  { type: 'regen_per_turn', label: 'Regeneração por Turno', min: 10, max: 100 },
  { type: 'counter_attack', label: 'Chance de Contra-Ataque %', min: 3, max: 15 },
  { type: 'bonus_damage_chance', label: 'Chance de Dano Extra %', min: 5, max: 20 },
  { type: 'poison_resist', label: 'Resistência a Veneno %', min: 10, max: 50 },
  { type: 'bleed_resist', label: 'Resistência a Sangramento %', min: 10, max: 50 }
];

const BONUS_POOLS = {
  weapon: {
    normal: ['strength', 'intelligence', 'dexterity', 'attack', 'magic_attack', 'critical', 'penetration', 'damage_vs_monster', 'damage_vs_boss', 'speed', 'accuracy'],
    special: ['hp_absorb', 'mp_absorb', 'counter_attack', 'bonus_damage_chance']
  },
  armor: {
    normal: ['vitality', 'max_hp', 'max_mp', 'defense', 'magic_defense', 'dodge', 'max_stamina', 'damage_vs_monster'],
    special: ['reflect', 'stun_immunity', 'crit_resist', 'regen_per_turn', 'poison_resist', 'bleed_resist']
  },
  helmet: {
    normal: ['intelligence', 'vitality', 'max_hp', 'max_mp', 'defense', 'magic_defense', 'exp_bonus'],
    special: ['stun_immunity', 'crit_resist', 'poison_resist']
  },
  shield: {
    normal: ['vitality', 'defense', 'magic_defense', 'dodge', 'max_hp'],
    special: ['reflect', 'crit_resist', 'stun_immunity']
  },
  boots: {
    normal: ['dexterity', 'speed', 'dodge', 'max_hp', 'defense'],
    special: ['stun_immunity', 'poison_resist']
  },
  earring: {
    normal: ['intelligence', 'magic_attack', 'magic_defense', 'critical', 'max_mp'],
    special: ['mp_absorb', 'crit_resist']
  },
  necklace: {
    normal: ['strength', 'attack', 'critical', 'penetration', 'max_hp', 'drop_rate'],
    special: ['hp_absorb', 'counter_attack', 'bonus_damage_chance']
  },
  bracelet: {
    normal: ['dexterity', 'accuracy', 'speed', 'attack', 'defense', 'max_stamina'],
    special: ['counter_attack', 'reflect']
  }
};

module.exports = { NORMAL_BONUSES, SPECIAL_BONUSES, BONUS_POOLS };
