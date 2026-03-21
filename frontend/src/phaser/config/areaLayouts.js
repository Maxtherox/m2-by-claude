export const TILE_SIZE = 32;
export const MAP_COLS = 30;
export const MAP_ROWS = 20;
export const MAP_WIDTH = MAP_COLS * TILE_SIZE;
export const MAP_HEIGHT = MAP_ROWS * TILE_SIZE;

export const AREA_LAYOUTS = {
  village: {
    baseTile: 'tile_grass',
    secondaryTile: 'tile_dirt',
    playerSpawn: { x: 480, y: 400 },
    npcPositions: [
      { x: 200, y: 160, type: 'shop', name: 'Comerciante' },
      { x: 400, y: 120, type: 'blacksmith', name: 'Ferreiro' },
      { x: 600, y: 160, type: 'healer', name: 'Curandeira' },
      { x: 760, y: 120, type: 'trainer', name: 'Mestre de Combate' },
      { x: 300, y: 280, type: 'storage', name: 'Armazem' },
      { x: 600, y: 280, type: 'material', name: 'Mercador de Materiais' },
      { x: 480, y: 200, type: 'lifeskill', name: 'Artesao' },
    ],
    mobSpawnZones: [],
    resourceZones: [],
    portalPositions: [
      { x: 16, y: 320, direction: 'west', label: 'Campo Oeste', targetType: 'field' },
      { x: 944, y: 320, direction: 'east', label: 'Campo Leste', targetType: 'field' },
      { x: 480, y: 16, direction: 'north', label: 'Floresta', targetType: 'forest' },
      { x: 480, y: 624, direction: 'south', label: 'Deserto', targetType: 'desert' },
    ],
    props: [
      { key: 'prop_house', x: 195, y: 150, scale: 0.9 },
      { key: 'prop_forge', x: 392, y: 136, scale: 0.9 },
      { key: 'prop_house', x: 586, y: 150, scale: 0.9, flipX: true },
      { key: 'prop_storage', x: 300, y: 282, scale: 0.9 },
      { key: 'prop_cart', x: 602, y: 300, scale: 1 },
      { key: 'prop_tree_oak', x: 90, y: 122, scale: 0.9 },
      { key: 'prop_tree_oak', x: 865, y: 122, scale: 0.9, flipX: true },
      { key: 'prop_brazier', x: 480, y: 116, scale: 0.9 },
    ],
    decorTiles: [
      { xStart: 0, xEnd: 30, yStart: 9, yEnd: 11, tile: 'tile_dirt' },
      { xStart: 14, xEnd: 16, yStart: 0, yEnd: 20, tile: 'tile_dirt' },
      { xStart: 4, xEnd: 8, yStart: 3, yEnd: 6, tile: 'tile_stone' },
      { xStart: 11, xEnd: 15, yStart: 2, yEnd: 5, tile: 'tile_stone' },
      { xStart: 17, xEnd: 21, yStart: 3, yEnd: 6, tile: 'tile_stone' },
      { xStart: 22, xEnd: 26, yStart: 2, yEnd: 5, tile: 'tile_stone' },
    ],
  },

  field: {
    baseTile: 'tile_grass',
    secondaryTile: 'tile_dirt',
    playerSpawn: { x: 480, y: 320 },
    npcPositions: [],
    mobSpawnZones: [
      { xMin: 100, xMax: 400, yMin: 80, yMax: 250 },
      { xMin: 500, xMax: 860, yMin: 80, yMax: 250 },
      { xMin: 100, xMax: 400, yMin: 380, yMax: 560 },
      { xMin: 500, xMax: 860, yMin: 380, yMax: 560 },
    ],
    resourceZones: [
      { x: 150, y: 300, type: 'farming' },
      { x: 750, y: 350, type: 'farming' },
    ],
    portalPositions: [
      { x: 16, y: 320, direction: 'west', label: 'Vila', targetType: 'village' },
      { x: 944, y: 320, direction: 'east', label: 'Floresta', targetType: 'forest' },
      { x: 480, y: 16, direction: 'north', label: 'Montanhas', targetType: 'mine' },
    ],
    props: [
      { key: 'prop_tree_oak', x: 92, y: 116, scale: 0.85 },
      { key: 'prop_tree_oak', x: 188, y: 520, scale: 0.95 },
      { key: 'prop_tree_oak', x: 842, y: 124, scale: 0.9, flipX: true },
      { key: 'prop_tree_oak', x: 772, y: 520, scale: 0.95 },
      { key: 'prop_rock_cluster', x: 480, y: 118, scale: 1 },
      { key: 'prop_cart', x: 472, y: 420, scale: 0.9 },
    ],
    decorTiles: [
      { xStart: 6, xEnd: 10, yStart: 8, yEnd: 12, tile: 'tile_dirt' },
      { xStart: 20, xEnd: 24, yStart: 5, yEnd: 9, tile: 'tile_dirt' },
      { xStart: 12, xEnd: 18, yStart: 14, yEnd: 17, tile: 'tile_dirt' },
    ],
  },

  forest: {
    baseTile: 'tile_grass',
    secondaryTile: 'tile_dark',
    playerSpawn: { x: 480, y: 560 },
    npcPositions: [],
    mobSpawnZones: [
      { xMin: 60, xMax: 300, yMin: 60, yMax: 280 },
      { xMin: 350, xMax: 600, yMin: 100, yMax: 300 },
      { xMin: 620, xMax: 900, yMin: 60, yMax: 280 },
      { xMin: 200, xMax: 750, yMin: 350, yMax: 520 },
    ],
    resourceZones: [
      { x: 100, y: 450, type: 'woodcutting' },
      { x: 300, y: 200, type: 'woodcutting' },
      { x: 700, y: 400, type: 'woodcutting' },
      { x: 850, y: 150, type: 'woodcutting' },
    ],
    portalPositions: [
      { x: 480, y: 624, direction: 'south', label: 'Campo', targetType: 'field' },
      { x: 16, y: 320, direction: 'west', label: 'Ruinas', targetType: 'ruins' },
      { x: 944, y: 320, direction: 'east', label: 'Mina', targetType: 'mine' },
    ],
    props: [
      { key: 'prop_tree_pine', x: 84, y: 102, scale: 1 },
      { key: 'prop_tree_pine', x: 164, y: 208, scale: 0.95 },
      { key: 'prop_tree_oak', x: 306, y: 154, scale: 0.9 },
      { key: 'prop_tree_pine', x: 688, y: 362, scale: 1.05 },
      { key: 'prop_tree_oak', x: 856, y: 132, scale: 0.92, flipX: true },
      { key: 'prop_rock_cluster', x: 508, y: 520, scale: 0.95 },
    ],
    decorTiles: [
      { xStart: 2, xEnd: 6, yStart: 2, yEnd: 6, tile: 'tile_dark' },
      { xStart: 10, xEnd: 14, yStart: 4, yEnd: 8, tile: 'tile_dark' },
      { xStart: 18, xEnd: 22, yStart: 1, yEnd: 5, tile: 'tile_dark' },
      { xStart: 24, xEnd: 28, yStart: 6, yEnd: 10, tile: 'tile_dark' },
      { xStart: 5, xEnd: 9, yStart: 12, yEnd: 16, tile: 'tile_dark' },
      { xStart: 20, xEnd: 25, yStart: 13, yEnd: 17, tile: 'tile_dark' },
      { xStart: 12, xEnd: 16, yStart: 8, yEnd: 12, tile: 'tile_dark' },
    ],
  },

  mine: {
    baseTile: 'tile_cave',
    secondaryTile: 'tile_stone',
    playerSpawn: { x: 480, y: 560 },
    npcPositions: [],
    mobSpawnZones: [
      { xMin: 80, xMax: 400, yMin: 60, yMax: 250 },
      { xMin: 500, xMax: 880, yMin: 100, yMax: 300 },
      { xMin: 200, xMax: 700, yMin: 350, yMax: 520 },
    ],
    resourceZones: [
      { x: 120, y: 150, type: 'mining' },
      { x: 350, y: 400, type: 'mining' },
      { x: 700, y: 200, type: 'mining' },
      { x: 800, y: 450, type: 'mining' },
    ],
    portalPositions: [
      { x: 480, y: 624, direction: 'south', label: 'Floresta', targetType: 'forest' },
      { x: 944, y: 320, direction: 'east', label: 'Caverna Profunda', targetType: 'cave' },
    ],
    props: [
      { key: 'prop_rock_cluster', x: 118, y: 142, scale: 1 },
      { key: 'prop_crystal', x: 236, y: 108, scale: 0.9 },
      { key: 'prop_rock_cluster', x: 344, y: 402, scale: 1.1 },
      { key: 'prop_crystal', x: 698, y: 196, scale: 0.95 },
      { key: 'prop_rock_cluster', x: 796, y: 446, scale: 1.15 },
    ],
    decorTiles: [
      { xStart: 3, xEnd: 7, yStart: 3, yEnd: 7, tile: 'tile_stone' },
      { xStart: 15, xEnd: 20, yStart: 5, yEnd: 9, tile: 'tile_stone' },
      { xStart: 22, xEnd: 27, yStart: 12, yEnd: 16, tile: 'tile_stone' },
      { xStart: 8, xEnd: 12, yStart: 14, yEnd: 18, tile: 'tile_stone' },
    ],
  },

  cave: {
    baseTile: 'tile_cave',
    secondaryTile: 'tile_dark',
    playerSpawn: { x: 100, y: 320 },
    npcPositions: [],
    mobSpawnZones: [
      { xMin: 200, xMax: 500, yMin: 80, yMax: 280 },
      { xMin: 500, xMax: 860, yMin: 200, yMax: 500 },
      { xMin: 100, xMax: 450, yMin: 380, yMax: 560 },
    ],
    resourceZones: [
      { x: 600, y: 120, type: 'mining' },
      { x: 250, y: 500, type: 'mining' },
    ],
    portalPositions: [
      { x: 16, y: 320, direction: 'west', label: 'Mina', targetType: 'mine' },
    ],
    props: [
      { key: 'prop_crystal', x: 604, y: 122, scale: 1.1 },
      { key: 'prop_rock_cluster', x: 482, y: 246, scale: 1.2 },
      { key: 'prop_crystal', x: 248, y: 500, scale: 1.05 },
      { key: 'prop_rock_cluster', x: 180, y: 182, scale: 1 },
      { key: 'prop_ruin_pillar', x: 804, y: 454, scale: 0.9 },
    ],
    decorTiles: [
      { xStart: 0, xEnd: 5, yStart: 0, yEnd: 4, tile: 'tile_dark' },
      { xStart: 25, xEnd: 30, yStart: 0, yEnd: 4, tile: 'tile_dark' },
      { xStart: 0, xEnd: 5, yStart: 16, yEnd: 20, tile: 'tile_dark' },
      { xStart: 25, xEnd: 30, yStart: 16, yEnd: 20, tile: 'tile_dark' },
      { xStart: 10, xEnd: 20, yStart: 8, yEnd: 12, tile: 'tile_stone' },
    ],
  },

  ruins: {
    baseTile: 'tile_stone',
    secondaryTile: 'tile_dark',
    playerSpawn: { x: 480, y: 320 },
    npcPositions: [],
    mobSpawnZones: [
      { xMin: 80, xMax: 350, yMin: 60, yMax: 250 },
      { xMin: 550, xMax: 880, yMin: 60, yMax: 250 },
      { xMin: 200, xMax: 750, yMin: 380, yMax: 560 },
    ],
    resourceZones: [],
    portalPositions: [
      { x: 944, y: 320, direction: 'east', label: 'Floresta', targetType: 'forest' },
      { x: 480, y: 16, direction: 'north', label: 'Templo', targetType: 'temple' },
      { x: 480, y: 624, direction: 'south', label: 'Campo', targetType: 'field' },
    ],
    props: [
      { key: 'prop_ruin_pillar', x: 158, y: 132, scale: 1 },
      { key: 'prop_ruin_pillar', x: 814, y: 132, scale: 1 },
      { key: 'prop_ruin_pillar', x: 248, y: 498, scale: 0.95 },
      { key: 'prop_ruin_pillar', x: 718, y: 498, scale: 0.95 },
      { key: 'prop_brazier', x: 478, y: 174, scale: 1 },
      { key: 'prop_rock_cluster', x: 482, y: 414, scale: 1.1 },
    ],
    decorTiles: [
      { xStart: 5, xEnd: 10, yStart: 3, yEnd: 8, tile: 'tile_dark' },
      { xStart: 20, xEnd: 25, yStart: 3, yEnd: 8, tile: 'tile_dark' },
      { xStart: 12, xEnd: 18, yStart: 10, yEnd: 14, tile: 'tile_dark' },
      { xStart: 3, xEnd: 8, yStart: 14, yEnd: 18, tile: 'tile_dark' },
      { xStart: 22, xEnd: 27, yStart: 14, yEnd: 18, tile: 'tile_dark' },
    ],
  },

  desert: {
    baseTile: 'tile_sand',
    secondaryTile: 'tile_dirt',
    playerSpawn: { x: 480, y: 100 },
    npcPositions: [],
    mobSpawnZones: [
      { xMin: 60, xMax: 400, yMin: 150, yMax: 350 },
      { xMin: 500, xMax: 900, yMin: 150, yMax: 350 },
      { xMin: 200, xMax: 750, yMin: 400, yMax: 580 },
    ],
    resourceZones: [
      { x: 200, y: 500, type: 'mining' },
      { x: 700, y: 480, type: 'mining' },
    ],
    portalPositions: [
      { x: 480, y: 16, direction: 'north', label: 'Vila', targetType: 'village' },
      { x: 944, y: 320, direction: 'east', label: 'Templo do Deserto', targetType: 'temple' },
    ],
    props: [
      { key: 'prop_cactus', x: 152, y: 184, scale: 1 },
      { key: 'prop_cactus', x: 286, y: 458, scale: 0.9 },
      { key: 'prop_cactus', x: 716, y: 434, scale: 1.1 },
      { key: 'prop_rock_cluster', x: 206, y: 502, scale: 0.95 },
      { key: 'prop_rock_cluster', x: 702, y: 486, scale: 1 },
      { key: 'prop_ruin_pillar', x: 832, y: 206, scale: 1 },
    ],
    decorTiles: [
      { xStart: 5, xEnd: 9, yStart: 6, yEnd: 10, tile: 'tile_dirt' },
      { xStart: 18, xEnd: 22, yStart: 3, yEnd: 7, tile: 'tile_dirt' },
      { xStart: 12, xEnd: 16, yStart: 14, yEnd: 18, tile: 'tile_dirt' },
    ],
  },

  temple: {
    baseTile: 'tile_temple',
    secondaryTile: 'tile_stone',
    playerSpawn: { x: 480, y: 560 },
    npcPositions: [],
    mobSpawnZones: [
      { xMin: 100, xMax: 400, yMin: 80, yMax: 280 },
      { xMin: 500, xMax: 860, yMin: 80, yMax: 280 },
      { xMin: 200, xMax: 750, yMin: 350, yMax: 520 },
    ],
    resourceZones: [],
    portalPositions: [
      { x: 480, y: 624, direction: 'south', label: 'Ruinas', targetType: 'ruins' },
    ],
    props: [
      { key: 'prop_ruin_pillar', x: 214, y: 140, scale: 1 },
      { key: 'prop_ruin_pillar', x: 744, y: 140, scale: 1 },
      { key: 'prop_brazier', x: 356, y: 222, scale: 1 },
      { key: 'prop_brazier', x: 604, y: 222, scale: 1 },
      { key: 'prop_storage', x: 480, y: 436, scale: 0.9 },
    ],
    decorTiles: [
      { xStart: 10, xEnd: 20, yStart: 2, yEnd: 8, tile: 'tile_stone' },
      { xStart: 13, xEnd: 17, yStart: 8, yEnd: 18, tile: 'tile_stone' },
      { xStart: 3, xEnd: 7, yStart: 5, yEnd: 9, tile: 'tile_stone' },
      { xStart: 23, xEnd: 27, yStart: 5, yEnd: 9, tile: 'tile_stone' },
    ],
  },
};

export function getAreaLayout(areaType) {
  const type = (areaType || 'field').toLowerCase();
  return AREA_LAYOUTS[type] || AREA_LAYOUTS.field;
}

export function getAreaTypeFromName(areaName) {
  if (!areaName) return 'field';

  const name = areaName.toLowerCase();
  if (name.includes('vila') || name.includes('village') || name.includes('cidade')) return 'village';
  if (name.includes('floresta') || name.includes('forest')) return 'forest';
  if (name.includes('mina') || name.includes('mine')) return 'mine';
  if (name.includes('caverna') || name.includes('cave')) return 'cave';
  if (name.includes('ruina') || name.includes('ruinas') || name.includes('ruin')) return 'ruins';
  if (name.includes('deserto') || name.includes('desert')) return 'desert';
  if (name.includes('templo') || name.includes('temple')) return 'temple';
  if (name.includes('campo') || name.includes('field') || name.includes('planicie')) return 'field';
  return 'field';
}
