export function getRarityColor(rarity) {
  const map = {
    common: '#b0b0b0',
    uncommon: '#30c830',
    rare: '#3080f0',
    epic: '#a030f0',
    legendary: '#f0a030',
    mythic: '#f03030',
  };
  return map[rarity] || map.common;
}

export function getRarityBorder(rarity) {
  return `rarity-${rarity || 'common'}`;
}

export function getRarityLabel(rarity) {
  const map = {
    common: 'Comum',
    uncommon: 'Incomum',
    rare: 'Raro',
    epic: 'Epico',
    legendary: 'Lendario',
    mythic: 'Mitico',
  };
  return map[rarity] || 'Comum';
}

export function formatNumber(num) {
  if (num == null || isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return Math.floor(num).toString();
}

export function getKingdomColor(kingdom) {
  const map = {
    shinsoo: 'text-kingdom-shinsoo',
    chunjo: 'text-kingdom-chunjo',
    jinno: 'text-kingdom-jinno',
  };
  return map[kingdom?.toLowerCase()] || 'text-gray-400';
}

export function getKingdomBg(kingdom) {
  const map = {
    shinsoo: 'bg-kingdom-shinsoo/20 border-kingdom-shinsoo/50',
    chunjo: 'bg-kingdom-chunjo/20 border-kingdom-chunjo/50',
    jinno: 'bg-kingdom-jinno/20 border-kingdom-jinno/50',
  };
  return map[kingdom?.toLowerCase()] || '';
}

export function getEquipmentSlotLabel(slot) {
  const map = {
    weapon: 'Arma',
    armor: 'Armadura',
    helmet: 'Elmo',
    shield: 'Escudo',
    boots: 'Botas',
    bracelet: 'Bracelete',
    necklace: 'Colar',
    earring: 'Brinco',
  };
  return map[slot] || slot;
}

export function getItemIcon(item) {
  if (!item) return '';
  const typeMap = {
    sword: '\u2694\uFE0F',
    blade: '\u{1F5E1}\uFE0F',
    bow: '\u{1F3F9}',
    staff: '\u{1FA84}',
    fan: '\u{1FA78}',
    armor: '\u{1F6E1}\uFE0F',
    helmet: '\u{1FA96}',
    shield: '\u{1F6E1}\uFE0F',
    boots: '\u{1F462}',
    bracelet: '\u{1F4FF}',
    necklace: '\u{1F4FF}',
    earring: '\u{1F48E}',
    potion_hp: '\u2764\uFE0F',
    potion_mp: '\u{1F499}',
    potion_stamina: '\u{1F49B}',
    scroll: '\u{1F4DC}',
    ore: '\u{1FAA8}',
    wood: '\u{1FAB5}',
    herb: '\u{1F33F}',
    food: '\u{1F356}',
    gem: '\u{1F48E}',
    key: '\u{1F511}',
    material: '\u{1F9F1}',
  };
  return typeMap[item.subType] || typeMap[item.type] || '\u{1F4E6}';
}

export function calcExpPercent(currentExp, requiredExp) {
  if (!requiredExp || requiredExp <= 0) return 0;
  return Math.min(100, Math.max(0, (currentExp / requiredExp) * 100));
}

export function getClassIcon(className) {
  const map = {
    warrior: '\u2694\uFE0F',
    guerreiro: '\u2694\uFE0F',
    ninja: '\u{1F5E1}\uFE0F',
    sura: '\u{1F52E}',
    shaman: '\u{1FA84}',
    'sham\u00E3': '\u{1FA84}',
  };
  return map[className?.toLowerCase()] || '\u2694\uFE0F';
}
