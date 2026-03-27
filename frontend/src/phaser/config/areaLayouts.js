export const TILE_SIZE = 32;
export const MAP_COLS = 60;
export const MAP_ROWS = 50;
export const MAP_WIDTH = MAP_COLS * TILE_SIZE;
export const MAP_HEIGHT = MAP_ROWS * TILE_SIZE;

export const AREA_LAYOUTS = {
  village: {
    baseTile: 'tsg_grass1',
    secondaryTile: 'tsg_grass3',
    playerSpawn: { x: 960, y: 820 },
    npcPositions: [
      { x: 480, y: 480, type: 'shop', name: 'Comerciante' },
      { x: 1050, y: 350, type: 'blacksmith', name: 'Ferreiro' },
      { x: 1500, y: 480, type: 'healer', name: 'Curandeira' },
      { x: 1750, y: 340, type: 'trainer', name: 'Mestre de Combate' },
      { x: 600, y: 1050, type: 'storage', name: 'Armazem' },
      { x: 1400, y: 1050, type: 'material', name: 'Mercador de Materiais' },
      { x: 960, y: 700, type: 'lifeskill', name: 'Artesao' },
    ],
    mobSpawnZones: [],
    resourceZones: [],
    portalPositions: [
      { x: 16, y: 800, direction: 'west', label: 'Campo Oeste', targetType: 'field' },
      { x: 1904, y: 800, direction: 'east', label: 'Campo Leste', targetType: 'field' },
      { x: 960, y: 16, direction: 'north', label: 'Floresta', targetType: 'forest' },
      { x: 960, y: 1584, direction: 'south', label: 'Deserto', targetType: 'desert' },
    ],
    props: [
      // ============================================================
      // TOP-LEFT: Loja do Comerciante - cluster denso com mercadorias
      // ============================================================
      { key: 'bld_house2', x: 400, y: 350 },           // loja grande
      { key: 'bld_house1', x: 200, y: 380 },            // casa ao lado
      { key: 'prop_barrel', x: 310, y: 420 },            // barril entre casas
      { key: 'prop_barrel', x: 330, y: 425 },
      { key: 'prop_crate', x: 350, y: 418 },
      { key: 'prop_crate_large', x: 475, y: 415 },       // caixa grande na frente da loja
      { key: 'prop_sack', x: 500, y: 420 },
      { key: 'prop_sack', x: 515, y: 418 },
      { key: 'prop_basket', x: 530, y: 422 },
      { key: 'prop_table', x: 440, y: 460 },             // mesa do comerciante
      { key: 'prop_lamp', x: 350, y: 460 },
      { key: 'prop_sign1', x: 480, y: 510 },             // placa "Loja"
      { key: 'bush1', x: 155, y: 430 },                  // arbusto decorativo
      { key: 'bush6', x: 530, y: 385 },
      { key: 'anim_flowers_red', x: 170, y: 445, anim: 'flowers_red_sway' },

      // ============================================================
      // TOP-CENTER: Ferreiro - forja com materiais ao redor
      // ============================================================
      { key: 'bld_house3', x: 920, y: 260 },             // casa do ferreiro (grande)
      { key: 'anim_campfire', x: 1050, y: 340, anim: 'campfire_burn' },  // forja
      { key: 'prop_barrel', x: 1010, y: 310 },
      { key: 'prop_barrel', x: 1030, y: 315 },
      { key: 'prop_crate', x: 1070, y: 308 },
      { key: 'prop_crate_large', x: 830, y: 330 },
      { key: 'prop_haystack', x: 850, y: 335 },
      { key: 'prop_bench', x: 1050, y: 380 },            // banco de trabalho
      { key: 'rock3', x: 1090, y: 300 },                 // pedras de minério
      { key: 'rock1', x: 1100, y: 320 },
      { key: 'prop_stump', x: 825, y: 370 },             // tronco cortado

      // ============================================================
      // TOP-RIGHT: Curandeira + Mestre de Combate
      // ============================================================
      { key: 'bld_house1', x: 1420, y: 370 },            // casa da curandeira
      { key: 'bld_house4', x: 1660, y: 260 },            // casa do mestre (2 andares)
      { key: 'bld_house1', x: 1820, y: 380 },            // casa auxiliar
      { key: 'prop_barrel', x: 1510, y: 410 },
      { key: 'prop_crate', x: 1530, y: 408 },
      { key: 'prop_sack', x: 1545, y: 412 },
      { key: 'prop_plant', x: 1400, y: 435 },
      { key: 'prop_plant', x: 1415, y: 432 },
      { key: 'prop_banner', x: 1750, y: 320 },           // banner do mestre
      { key: 'prop_banner', x: 1570, y: 320 },
      { key: 'prop_lamp', x: 1600, y: 400 },
      { key: 'prop_bench2', x: 1780, y: 420 },
      { key: 'anim_flowers_white', x: 1850, y: 440, anim: 'flowers_white_sway' },
      { key: 'bush3', x: 1380, y: 420 },
      { key: 'bush7', x: 1870, y: 400 },

      // ============================================================
      // PRAÇA CENTRAL - coração da vila
      // ============================================================
      { key: 'bld_well', x: 960, y: 680 },               // poço central
      { key: 'bld_gate', x: 960, y: 140 },               // portão norte da vila
      { key: 'prop_board', x: 880, y: 640 },              // quadro de avisos
      { key: 'prop_lamp', x: 860, y: 720 },               // postes ao redor da praça
      { key: 'prop_lamp', x: 1060, y: 720 },
      { key: 'prop_lamp', x: 860, y: 580 },
      { key: 'prop_lamp', x: 1060, y: 580 },
      { key: 'prop_sign2', x: 920, y: 600 },
      { key: 'prop_sign1', x: 1000, y: 600 },
      { key: 'prop_bench', x: 900, y: 750 },
      { key: 'prop_bench2', x: 1020, y: 750 },
      { key: 'anim_campfire', x: 960, y: 790, anim: 'campfire_burn' },
      { key: 'prop_barrel', x: 880, y: 770 },
      { key: 'prop_crate', x: 1040, y: 770 },
      { key: 'anim_flowers_red', x: 840, y: 650, anim: 'flowers_red_sway' },
      { key: 'anim_flowers_white', x: 1080, y: 650, anim: 'flowers_white_sway' },
      { key: 'rock5', x: 915, y: 665 },                  // pedrinha decorativa

      // ============================================================
      // MID-LEFT: Armazém + lago
      // ============================================================
      { key: 'bld_house2', x: 480, y: 940 },             // armazém
      { key: 'bld_house1', x: 250, y: 980 },             // casa ao lado do lago
      { key: 'prop_crate_large', x: 570, y: 1000 },
      { key: 'prop_crate', x: 595, y: 995 },
      { key: 'prop_barrel', x: 615, y: 998 },
      { key: 'prop_sack', x: 630, y: 1002 },
      { key: 'prop_basket', x: 580, y: 1020 },
      { key: 'prop_table', x: 540, y: 1040 },
      { key: 'prop_crate_water', x: 200, y: 1100 },      // caixote de pesca no lago
      { key: 'prop_crate_water', x: 230, y: 1110 },
      { key: 'prop_fireplace', x: 350, y: 1080 },
      { key: 'prop_bench', x: 310, y: 1060 },
      { key: 'prop_lamp', x: 450, y: 1050 },
      { key: 'bush2', x: 170, y: 1060 },
      { key: 'bush5', x: 320, y: 1120 },
      { key: 'anim_flowers_red', x: 140, y: 1020, anim: 'flowers_red_sway' },
      { key: 'rock2', x: 130, y: 1130 },

      // ============================================================
      // MID-RIGHT: Mercador de Materiais + oficinas
      // ============================================================
      { key: 'bld_house3', x: 1350, y: 940 },
      { key: 'bld_house1', x: 1570, y: 980 },
      { key: 'bld_house1', x: 1750, y: 960 },
      { key: 'prop_barrel', x: 1440, y: 1000 },
      { key: 'prop_barrel', x: 1460, y: 1005 },
      { key: 'prop_crate_large', x: 1480, y: 998 },
      { key: 'prop_sack', x: 1505, y: 1002 },
      { key: 'prop_haystack', x: 1550, y: 1050 },
      { key: 'prop_haystack', x: 1580, y: 1055 },
      { key: 'prop_stump', x: 1650, y: 1040 },
      { key: 'prop_bench2', x: 1700, y: 1030 },
      { key: 'prop_lamp', x: 1500, y: 1050 },
      { key: 'anim_campfire', x: 1620, y: 1080, anim: 'campfire_burn' },
      { key: 'bush4', x: 1320, y: 1010 },
      { key: 'bush1', x: 1790, y: 1000 },
      { key: 'anim_flowers_white', x: 1800, y: 1030, anim: 'flowers_white_sway' },

      // ============================================================
      // BOTTOM-CENTER: Área residencial sul
      // ============================================================
      { key: 'bld_house2', x: 750, y: 1200 },
      { key: 'bld_house4', x: 1000, y: 1170 },
      { key: 'bld_house1', x: 1200, y: 1210 },
      { key: 'prop_barrel', x: 850, y: 1260 },
      { key: 'prop_crate', x: 870, y: 1255 },
      { key: 'prop_bench', x: 940, y: 1270 },
      { key: 'prop_table', x: 1100, y: 1260 },
      { key: 'prop_basket', x: 1120, y: 1265 },
      { key: 'prop_sack', x: 1140, y: 1260 },
      { key: 'prop_lamp', x: 900, y: 1280 },
      { key: 'prop_lamp', x: 1100, y: 1280 },
      { key: 'anim_flowers_red', x: 700, y: 1270, anim: 'flowers_red_sway' },
      { key: 'anim_flowers_white', x: 1280, y: 1260, anim: 'flowers_white_sway' },
      { key: 'bush6', x: 720, y: 1250 },
      { key: 'bush7', x: 1240, y: 1250 },

      // ============================================================
      // FLORESTA DENSA - borda norte (árvores sobrepostas, denso)
      // ============================================================
      { key: 'tree1', x: 50, y: 60 },
      { key: 'tree3', x: 110, y: 40 },
      { key: 'tree2', x: 170, y: 70 },
      { key: 'tree4', x: 80, y: 100 },
      { key: 'tree1', x: 240, y: 50 },
      { key: 'tree3', x: 310, y: 80 },
      { key: 'tree2', x: 380, y: 45 },
      { key: 'tree4', x: 450, y: 75 },
      { key: 'tree1', x: 520, y: 55 },
      { key: 'tree3', x: 590, y: 85 },
      { key: 'tree2', x: 660, y: 50 },
      { key: 'tree4', x: 730, y: 80 },
      // gap para o portão norte (em torno de x:960)
      { key: 'tree1', x: 1190, y: 60 },
      { key: 'tree3', x: 1260, y: 85 },
      { key: 'tree2', x: 1330, y: 50 },
      { key: 'tree4', x: 1400, y: 75 },
      { key: 'tree1', x: 1470, y: 55 },
      { key: 'tree3', x: 1540, y: 80 },
      { key: 'tree2', x: 1610, y: 45 },
      { key: 'tree4', x: 1680, y: 70 },
      { key: 'tree1', x: 1750, y: 50 },
      { key: 'tree3', x: 1820, y: 80 },
      { key: 'tree2', x: 1880, y: 55 },
      // segunda fileira atrás (preenche gaps)
      { key: 'tree4', x: 30, y: 20 },
      { key: 'tree2', x: 140, y: 10 },
      { key: 'tree1', x: 280, y: 15 },
      { key: 'tree3', x: 420, y: 25 },
      { key: 'tree4', x: 560, y: 12 },
      { key: 'tree1', x: 700, y: 30 },
      { key: 'tree2', x: 1220, y: 20 },
      { key: 'tree3', x: 1370, y: 15 },
      { key: 'tree4', x: 1500, y: 25 },
      { key: 'tree1', x: 1650, y: 10 },
      { key: 'tree2', x: 1790, y: 22 },

      // Borda OESTE (densa, 2 fileiras)
      { key: 'tree3', x: 30, y: 180 },
      { key: 'tree1', x: 55, y: 280 },
      { key: 'tree4', x: 25, y: 380 },
      { key: 'tree2', x: 50, y: 500 },
      { key: 'tree3', x: 30, y: 620 },
      { key: 'tree1', x: 55, y: 750 },
      { key: 'tree4', x: 25, y: 880 },
      { key: 'tree2', x: 50, y: 1200 },
      { key: 'tree3', x: 30, y: 1320 },
      { key: 'tree1', x: 55, y: 1430 },
      { key: 'tree4', x: 25, y: 1520 },
      // segunda fileira
      { key: 'tree2', x: 90, y: 230 },
      { key: 'tree4', x: 85, y: 440 },
      { key: 'tree1', x: 95, y: 680 },
      { key: 'tree3', x: 80, y: 820 },
      { key: 'tree2', x: 90, y: 1260 },
      { key: 'tree4', x: 85, y: 1470 },

      // Borda LESTE (densa, 2 fileiras)
      { key: 'tree1', x: 1870, y: 180 },
      { key: 'tree3', x: 1895, y: 300 },
      { key: 'tree2', x: 1875, y: 430 },
      { key: 'tree4', x: 1890, y: 560 },
      { key: 'tree1', x: 1870, y: 700 },
      { key: 'tree3', x: 1895, y: 840 },
      { key: 'tree2', x: 1875, y: 960 },
      { key: 'tree4', x: 1890, y: 1100 },
      { key: 'tree1', x: 1870, y: 1230 },
      { key: 'tree3', x: 1895, y: 1360 },
      { key: 'tree2', x: 1875, y: 1480 },
      // segunda fileira
      { key: 'tree4', x: 1840, y: 240 },
      { key: 'tree1', x: 1850, y: 490 },
      { key: 'tree3', x: 1835, y: 770 },
      { key: 'tree2', x: 1845, y: 1030 },
      { key: 'tree4', x: 1840, y: 1300 },

      // Borda SUL (densa, 2 fileiras)
      { key: 'tree1', x: 50, y: 1480 },
      { key: 'tree3', x: 150, y: 1510 },
      { key: 'tree2', x: 260, y: 1485 },
      { key: 'tree4', x: 370, y: 1515 },
      { key: 'tree1', x: 480, y: 1490 },
      { key: 'tree3', x: 590, y: 1520 },
      { key: 'tree2', x: 700, y: 1485 },
      { key: 'tree4', x: 810, y: 1510 },
      // gap para portal sul (x:960)
      { key: 'tree1', x: 1110, y: 1490 },
      { key: 'tree3', x: 1220, y: 1520 },
      { key: 'tree2', x: 1330, y: 1485 },
      { key: 'tree4', x: 1440, y: 1515 },
      { key: 'tree1', x: 1550, y: 1490 },
      { key: 'tree3', x: 1660, y: 1520 },
      { key: 'tree2', x: 1770, y: 1485 },
      { key: 'tree4', x: 1880, y: 1510 },
      // segunda fileira
      { key: 'tree4', x: 100, y: 1545 },
      { key: 'tree1', x: 310, y: 1550 },
      { key: 'tree3', x: 530, y: 1555 },
      { key: 'tree2', x: 750, y: 1540 },
      { key: 'tree1', x: 1170, y: 1550 },
      { key: 'tree4', x: 1380, y: 1555 },
      { key: 'tree2', x: 1600, y: 1545 },
      { key: 'tree3', x: 1820, y: 1550 },

      // ============================================================
      // ÁRVORES INTERNAS (entre clusters, sombra)
      // ============================================================
      { key: 'tree1', x: 680, y: 580 },
      { key: 'tree3', x: 740, y: 300 },
      { key: 'tree4', x: 1200, y: 500 },
      { key: 'tree2', x: 350, y: 750 },
      { key: 'tree1', x: 1700, y: 700 },
      { key: 'tree3', x: 660, y: 1150 },
      { key: 'tree4', x: 1350, y: 1330 },

      // ============================================================
      // ARBUSTOS densos perto de casas e caminhos
      // ============================================================
      { key: 'bush2', x: 160, y: 510 },                  // cluster perto do lago
      { key: 'bush4', x: 120, y: 920 },
      { key: 'bush3', x: 280, y: 550 },
      { key: 'bush5', x: 750, y: 450 },                  // entre loja e ferreiro
      { key: 'bush1', x: 1150, y: 410 },
      { key: 'bush7', x: 690, y: 860 },                  // ao redor da praça
      { key: 'bush6', x: 1200, y: 860 },
      { key: 'bush4', x: 560, y: 1200 },                 // sul
      { key: 'bush2', x: 1420, y: 1200 },
      { key: 'bush3', x: 1820, y: 600 },
      { key: 'bush5', x: 810, y: 1130 },
      { key: 'bush1', x: 1150, y: 1130 },

      // ============================================================
      // ROCHAS espalhadas naturalmente
      // ============================================================
      { key: 'rock1', x: 130, y: 680 },
      { key: 'rock2', x: 1830, y: 500 },
      { key: 'rock3', x: 750, y: 1380 },
      { key: 'rock4', x: 1250, y: 180 },
      { key: 'rock5', x: 400, y: 1400 },
      { key: 'rock1', x: 1700, y: 1350 },

      // ============================================================
      // FLORES, PLANTAS extras preenchendo espaços
      // ============================================================
      { key: 'prop_plant', x: 780, y: 600 },
      { key: 'prop_plant', x: 1160, y: 700 },
      { key: 'prop_plant', x: 350, y: 880 },
      { key: 'prop_plant', x: 1650, y: 880 },
      { key: 'anim_flowers_red', x: 300, y: 700, anim: 'flowers_red_sway' },
      { key: 'anim_flowers_white', x: 1700, y: 450, anim: 'flowers_white_sway' },
      { key: 'anim_flowers_red', x: 1050, y: 1300, anim: 'flowers_red_sway' },
    ],
    decorTiles: [
      // Estrada horizontal principal (larga, cruza toda a vila)
      { xStart: 0, xEnd: 60, yStart: 23, yEnd: 27, tile: 'tsg_road1' },
      // Estrada vertical principal
      { xStart: 28, xEnd: 32, yStart: 5, yEnd: 50, tile: 'tsg_road1' },
      // Caminhos secundários para clusters de casas
      { xStart: 8, xEnd: 18, yStart: 20, yEnd: 23, tile: 'tsg_road2' },   // para loja NW
      { xStart: 25, xEnd: 35, yStart: 16, yEnd: 19, tile: 'tsg_road2' },  // para ferreiro
      { xStart: 40, xEnd: 50, yStart: 20, yEnd: 23, tile: 'tsg_road2' },  // para curandeira
      { xStart: 12, xEnd: 16, yStart: 14, yEnd: 20, tile: 'tsg_road2' },  // subida NW
      { xStart: 44, xEnd: 48, yStart: 14, yEnd: 20, tile: 'tsg_road2' },  // subida NE
      // Caminhos sul
      { xStart: 12, xEnd: 16, yStart: 27, yEnd: 36, tile: 'tsg_road2' },  // para armazém
      { xStart: 42, xEnd: 46, yStart: 27, yEnd: 36, tile: 'tsg_road2' },  // para mercador
      { xStart: 20, xEnd: 40, yStart: 37, yEnd: 40, tile: 'tsg_road2' },  // rua residencial sul
      // Fundações de pedra sob construções
      { xStart: 5, xEnd: 18, yStart: 9, yEnd: 15, tile: 'tsg_road1' },   // cluster NW
      { xStart: 25, xEnd: 37, yStart: 6, yEnd: 13, tile: 'tsg_road1' },  // ferreiro
      { xStart: 42, xEnd: 58, yStart: 8, yEnd: 15, tile: 'tsg_road1' },  // cluster NE
      { xStart: 25, xEnd: 35, yStart: 19, yEnd: 25, tile: 'tsg_road1' }, // praça central
      { xStart: 5, xEnd: 22, yStart: 28, yEnd: 35, tile: 'tsg_road1' },  // armazém
      { xStart: 38, xEnd: 55, yStart: 28, yEnd: 35, tile: 'tsg_road1' }, // mercador
      { xStart: 20, xEnd: 40, yStart: 36, yEnd: 42, tile: 'tsg_road1' }, // residencial sul
      // Lago (sudoeste)
      { xStart: 2, xEnd: 10, yStart: 32, yEnd: 38, tile: 'tile_water' },
    ],
  },

  field: {
    baseTile: 'tile_grass',
    secondaryTile: 'tile_dirt',
    playerSpawn: { x: 960, y: 640 },
    npcPositions: [],
    mobSpawnZones: [
      { xMin: 200, xMax: 800, yMin: 160, yMax: 500 },
      { xMin: 1000, xMax: 1720, yMin: 160, yMax: 500 },
      { xMin: 200, xMax: 800, yMin: 760, yMax: 1120 },
      { xMin: 1000, xMax: 1720, yMin: 760, yMax: 1120 },
      { xMin: 400, xMax: 1500, yMin: 500, yMax: 760 },
      { xMin: 100, xMax: 600, yMin: 1000, yMax: 1200 },
    ],
    resourceZones: [
      { x: 300, y: 600, type: 'farming' },
      { x: 1500, y: 700, type: 'farming' },
      { x: 900, y: 1000, type: 'farming' },
      { x: 600, y: 300, type: 'farming' },
    ],
    portalPositions: [
      { x: 16, y: 640, direction: 'west', label: 'Vila', targetType: 'village' },
      { x: 1904, y: 640, direction: 'east', label: 'Floresta', targetType: 'forest' },
      { x: 960, y: 16, direction: 'north', label: 'Montanhas', targetType: 'mine' },
    ],
    props: [
      { key: 'prop_tree_oak', x: 184, y: 232, scale: 0.85 },
      { key: 'prop_tree_oak', x: 376, y: 1040, scale: 0.95 },
      { key: 'prop_tree_oak', x: 1684, y: 248, scale: 0.9, flipX: true },
      { key: 'prop_tree_oak', x: 1544, y: 1040, scale: 0.95 },
      { key: 'prop_rock_cluster', x: 960, y: 236, scale: 1 },
      { key: 'prop_cart', x: 944, y: 840, scale: 0.9 },
      { key: 'prop_tree_oak', x: 1200, y: 200, scale: 0.9 },
      { key: 'prop_tree_oak', x: 600, y: 800, scale: 0.85 },
      { key: 'prop_rock_cluster', x: 1400, y: 900, scale: 1.05 },
      { key: 'prop_tree_oak', x: 200, y: 700, scale: 0.9 },
      { key: 'prop_tree_oak', x: 1750, y: 750, scale: 0.95, flipX: true },
      { key: 'prop_rock_cluster', x: 480, y: 400, scale: 0.9 },
    ],
    decorTiles: [
      { xStart: 12, xEnd: 20, yStart: 16, yEnd: 24, tile: 'tile_dirt' },
      { xStart: 40, xEnd: 48, yStart: 10, yEnd: 18, tile: 'tile_dirt' },
      { xStart: 24, xEnd: 36, yStart: 28, yEnd: 34, tile: 'tile_dirt' },
      { xStart: 4, xEnd: 12, yStart: 6, yEnd: 12, tile: 'tile_dirt' },
      { xStart: 48, xEnd: 56, yStart: 28, yEnd: 34, tile: 'tile_dirt' },
    ],
  },

  forest: {
    baseTile: 'tile_grass',
    secondaryTile: 'tile_dark',
    playerSpawn: { x: 960, y: 1120 },
    npcPositions: [],
    mobSpawnZones: [
      { xMin: 120, xMax: 600, yMin: 120, yMax: 560 },
      { xMin: 700, xMax: 1200, yMin: 200, yMax: 600 },
      { xMin: 1240, xMax: 1800, yMin: 120, yMax: 560 },
      { xMin: 400, xMax: 1500, yMin: 700, yMax: 1040 },
      { xMin: 100, xMax: 600, yMin: 800, yMax: 1100 },
      { xMin: 1300, xMax: 1800, yMin: 800, yMax: 1100 },
    ],
    resourceZones: [
      { x: 200, y: 900, type: 'woodcutting' },
      { x: 600, y: 400, type: 'woodcutting' },
      { x: 1400, y: 800, type: 'woodcutting' },
      { x: 1700, y: 300, type: 'woodcutting' },
      { x: 900, y: 600, type: 'woodcutting' },
      { x: 400, y: 1100, type: 'woodcutting' },
    ],
    portalPositions: [
      { x: 960, y: 1264, direction: 'south', label: 'Campo', targetType: 'field' },
      { x: 16, y: 640, direction: 'west', label: 'Ruinas', targetType: 'ruins' },
      { x: 1904, y: 640, direction: 'east', label: 'Mina', targetType: 'mine' },
    ],
    props: [
      { key: 'prop_tree_pine', x: 168, y: 204, scale: 1 },
      { key: 'prop_tree_pine', x: 328, y: 416, scale: 0.95 },
      { key: 'prop_tree_oak', x: 612, y: 308, scale: 0.9 },
      { key: 'prop_tree_pine', x: 1376, y: 724, scale: 1.05 },
      { key: 'prop_tree_oak', x: 1712, y: 264, scale: 0.92, flipX: true },
      { key: 'prop_rock_cluster', x: 1016, y: 1040, scale: 0.95 },
      { key: 'prop_tree_pine', x: 900, y: 200, scale: 1.0 },
      { key: 'prop_tree_pine', x: 1500, y: 400, scale: 0.95 },
      { key: 'prop_tree_oak', x: 250, y: 800, scale: 0.9 },
      { key: 'prop_tree_pine', x: 1100, y: 500, scale: 1.0 },
      { key: 'prop_tree_oak', x: 700, y: 900, scale: 0.95 },
      { key: 'prop_tree_pine', x: 1650, y: 900, scale: 1.05 },
    ],
    decorTiles: [
      { xStart: 4, xEnd: 12, yStart: 4, yEnd: 12, tile: 'tile_dark' },
      { xStart: 20, xEnd: 28, yStart: 8, yEnd: 16, tile: 'tile_dark' },
      { xStart: 36, xEnd: 44, yStart: 2, yEnd: 10, tile: 'tile_dark' },
      { xStart: 48, xEnd: 56, yStart: 12, yEnd: 20, tile: 'tile_dark' },
      { xStart: 10, xEnd: 18, yStart: 24, yEnd: 32, tile: 'tile_dark' },
      { xStart: 40, xEnd: 50, yStart: 26, yEnd: 34, tile: 'tile_dark' },
      { xStart: 24, xEnd: 32, yStart: 16, yEnd: 24, tile: 'tile_dark' },
      { xStart: 2, xEnd: 10, yStart: 32, yEnd: 38, tile: 'tile_dark' },
      { xStart: 50, xEnd: 58, yStart: 32, yEnd: 38, tile: 'tile_dark' },
    ],
  },

  mine: {
    baseTile: 'tile_cave',
    secondaryTile: 'tile_stone',
    playerSpawn: { x: 960, y: 1120 },
    npcPositions: [],
    mobSpawnZones: [
      { xMin: 160, xMax: 800, yMin: 120, yMax: 500 },
      { xMin: 1000, xMax: 1760, yMin: 200, yMax: 600 },
      { xMin: 400, xMax: 1400, yMin: 700, yMax: 1040 },
      { xMin: 100, xMax: 600, yMin: 800, yMax: 1100 },
      { xMin: 1300, xMax: 1800, yMin: 750, yMax: 1050 },
      { xMin: 700, xMax: 1200, yMin: 400, yMax: 700 },
    ],
    resourceZones: [
      { x: 240, y: 300, type: 'mining' },
      { x: 700, y: 800, type: 'mining' },
      { x: 1400, y: 400, type: 'mining' },
      { x: 1600, y: 900, type: 'mining' },
      { x: 500, y: 550, type: 'mining' },
      { x: 1100, y: 250, type: 'mining' },
    ],
    portalPositions: [
      { x: 960, y: 1264, direction: 'south', label: 'Floresta', targetType: 'forest' },
      { x: 1904, y: 640, direction: 'east', label: 'Caverna Profunda', targetType: 'cave' },
    ],
    props: [
      { key: 'prop_rock_cluster', x: 236, y: 284, scale: 1 },
      { key: 'prop_crystal', x: 472, y: 216, scale: 0.9 },
      { key: 'prop_rock_cluster', x: 688, y: 804, scale: 1.1 },
      { key: 'prop_crystal', x: 1396, y: 392, scale: 0.95 },
      { key: 'prop_rock_cluster', x: 1592, y: 892, scale: 1.15 },
      { key: 'prop_crystal', x: 960, y: 500, scale: 1.0 },
      { key: 'prop_rock_cluster', x: 300, y: 700, scale: 1.05 },
      { key: 'prop_crystal', x: 1700, y: 300, scale: 0.9 },
      { key: 'prop_rock_cluster', x: 1100, y: 900, scale: 1.1 },
      { key: 'prop_crystal', x: 500, y: 1000, scale: 0.95 },
      { key: 'prop_rock_cluster', x: 1500, y: 650, scale: 1.0 },
    ],
    decorTiles: [
      { xStart: 6, xEnd: 14, yStart: 6, yEnd: 14, tile: 'tile_stone' },
      { xStart: 30, xEnd: 40, yStart: 10, yEnd: 18, tile: 'tile_stone' },
      { xStart: 44, xEnd: 54, yStart: 24, yEnd: 32, tile: 'tile_stone' },
      { xStart: 16, xEnd: 24, yStart: 28, yEnd: 36, tile: 'tile_stone' },
      { xStart: 36, xEnd: 44, yStart: 2, yEnd: 8, tile: 'tile_stone' },
      { xStart: 8, xEnd: 16, yStart: 20, yEnd: 26, tile: 'tile_stone' },
    ],
  },

  cave: {
    baseTile: 'tile_cave',
    secondaryTile: 'tile_dark',
    playerSpawn: { x: 200, y: 640 },
    npcPositions: [],
    mobSpawnZones: [
      { xMin: 400, xMax: 1000, yMin: 160, yMax: 560 },
      { xMin: 1000, xMax: 1720, yMin: 400, yMax: 1000 },
      { xMin: 200, xMax: 900, yMin: 760, yMax: 1120 },
      { xMin: 600, xMax: 1400, yMin: 500, yMax: 800 },
      { xMin: 1200, xMax: 1800, yMin: 150, yMax: 450 },
      { xMin: 100, xMax: 500, yMin: 300, yMax: 600 },
    ],
    resourceZones: [
      { x: 1200, y: 240, type: 'mining' },
      { x: 500, y: 1000, type: 'mining' },
      { x: 1600, y: 700, type: 'mining' },
      { x: 800, y: 500, type: 'mining' },
    ],
    portalPositions: [
      { x: 16, y: 640, direction: 'west', label: 'Mina', targetType: 'mine' },
    ],
    props: [
      { key: 'prop_crystal', x: 1208, y: 244, scale: 1.1 },
      { key: 'prop_rock_cluster', x: 964, y: 492, scale: 1.2 },
      { key: 'prop_crystal', x: 496, y: 1000, scale: 1.05 },
      { key: 'prop_rock_cluster', x: 360, y: 364, scale: 1 },
      { key: 'prop_ruin_pillar', x: 1608, y: 908, scale: 0.9 },
      { key: 'prop_crystal', x: 700, y: 700, scale: 1.0 },
      { key: 'prop_rock_cluster', x: 1400, y: 400, scale: 1.1 },
      { key: 'prop_crystal', x: 300, y: 800, scale: 0.95 },
      { key: 'prop_rock_cluster', x: 1700, y: 300, scale: 1.0 },
      { key: 'prop_ruin_pillar', x: 1100, y: 1050, scale: 0.95 },
      { key: 'prop_crystal', x: 1500, y: 600, scale: 1.05 },
    ],
    decorTiles: [
      { xStart: 0, xEnd: 10, yStart: 0, yEnd: 8, tile: 'tile_dark' },
      { xStart: 50, xEnd: 60, yStart: 0, yEnd: 8, tile: 'tile_dark' },
      { xStart: 0, xEnd: 10, yStart: 32, yEnd: 40, tile: 'tile_dark' },
      { xStart: 50, xEnd: 60, yStart: 32, yEnd: 40, tile: 'tile_dark' },
      { xStart: 20, xEnd: 40, yStart: 16, yEnd: 24, tile: 'tile_stone' },
      { xStart: 10, xEnd: 20, yStart: 22, yEnd: 30, tile: 'tile_dark' },
      { xStart: 40, xEnd: 50, yStart: 22, yEnd: 30, tile: 'tile_dark' },
    ],
  },

  ruins: {
    baseTile: 'tile_stone',
    secondaryTile: 'tile_dark',
    playerSpawn: { x: 960, y: 640 },
    npcPositions: [],
    mobSpawnZones: [
      { xMin: 160, xMax: 700, yMin: 120, yMax: 500 },
      { xMin: 1100, xMax: 1760, yMin: 120, yMax: 500 },
      { xMin: 400, xMax: 1500, yMin: 760, yMax: 1120 },
      { xMin: 700, xMax: 1200, yMin: 450, yMax: 750 },
      { xMin: 100, xMax: 500, yMin: 600, yMax: 900 },
      { xMin: 1400, xMax: 1800, yMin: 600, yMax: 900 },
    ],
    resourceZones: [],
    portalPositions: [
      { x: 1904, y: 640, direction: 'east', label: 'Floresta', targetType: 'forest' },
      { x: 960, y: 16, direction: 'north', label: 'Templo', targetType: 'temple' },
      { x: 960, y: 1264, direction: 'south', label: 'Campo', targetType: 'field' },
    ],
    props: [
      { key: 'prop_ruin_pillar', x: 316, y: 264, scale: 1 },
      { key: 'prop_ruin_pillar', x: 1628, y: 264, scale: 1 },
      { key: 'prop_ruin_pillar', x: 496, y: 996, scale: 0.95 },
      { key: 'prop_ruin_pillar', x: 1436, y: 996, scale: 0.95 },
      { key: 'prop_brazier', x: 956, y: 348, scale: 1 },
      { key: 'prop_rock_cluster', x: 964, y: 828, scale: 1.1 },
      { key: 'prop_ruin_pillar', x: 200, y: 700, scale: 0.9 },
      { key: 'prop_ruin_pillar', x: 1720, y: 700, scale: 0.9 },
      { key: 'prop_brazier', x: 600, y: 600, scale: 0.95 },
      { key: 'prop_brazier', x: 1320, y: 600, scale: 0.95 },
      { key: 'prop_rock_cluster', x: 400, y: 1100, scale: 1.0 },
      { key: 'prop_rock_cluster', x: 1500, y: 1100, scale: 1.0 },
    ],
    decorTiles: [
      { xStart: 10, xEnd: 20, yStart: 6, yEnd: 16, tile: 'tile_dark' },
      { xStart: 40, xEnd: 50, yStart: 6, yEnd: 16, tile: 'tile_dark' },
      { xStart: 24, xEnd: 36, yStart: 20, yEnd: 28, tile: 'tile_dark' },
      { xStart: 6, xEnd: 16, yStart: 28, yEnd: 36, tile: 'tile_dark' },
      { xStart: 44, xEnd: 54, yStart: 28, yEnd: 36, tile: 'tile_dark' },
      { xStart: 20, xEnd: 30, yStart: 32, yEnd: 38, tile: 'tile_dark' },
    ],
  },

  desert: {
    baseTile: 'tile_sand',
    secondaryTile: 'tile_dirt',
    playerSpawn: { x: 960, y: 200 },
    npcPositions: [],
    mobSpawnZones: [
      { xMin: 120, xMax: 800, yMin: 300, yMax: 700 },
      { xMin: 1000, xMax: 1800, yMin: 300, yMax: 700 },
      { xMin: 400, xMax: 1500, yMin: 800, yMax: 1160 },
      { xMin: 100, xMax: 600, yMin: 700, yMax: 1000 },
      { xMin: 1300, xMax: 1800, yMin: 700, yMax: 1000 },
      { xMin: 600, xMax: 1300, yMin: 400, yMax: 800 },
    ],
    resourceZones: [
      { x: 400, y: 1000, type: 'mining' },
      { x: 1400, y: 960, type: 'mining' },
      { x: 900, y: 700, type: 'mining' },
      { x: 1600, y: 500, type: 'mining' },
    ],
    portalPositions: [
      { x: 960, y: 16, direction: 'north', label: 'Vila', targetType: 'village' },
      { x: 1904, y: 640, direction: 'east', label: 'Templo do Deserto', targetType: 'temple' },
    ],
    props: [
      { key: 'prop_cactus', x: 304, y: 368, scale: 1 },
      { key: 'prop_cactus', x: 572, y: 916, scale: 0.9 },
      { key: 'prop_cactus', x: 1432, y: 868, scale: 1.1 },
      { key: 'prop_rock_cluster', x: 412, y: 1004, scale: 0.95 },
      { key: 'prop_rock_cluster', x: 1404, y: 972, scale: 1 },
      { key: 'prop_ruin_pillar', x: 1664, y: 412, scale: 1 },
      { key: 'prop_cactus', x: 900, y: 500, scale: 0.95 },
      { key: 'prop_cactus', x: 1200, y: 350, scale: 1.0 },
      { key: 'prop_rock_cluster', x: 200, y: 700, scale: 1.05 },
      { key: 'prop_cactus', x: 1700, y: 800, scale: 0.9 },
      { key: 'prop_rock_cluster', x: 750, y: 1100, scale: 1.0 },
      { key: 'prop_ruin_pillar', x: 500, y: 500, scale: 0.95 },
    ],
    decorTiles: [
      { xStart: 10, xEnd: 18, yStart: 12, yEnd: 20, tile: 'tile_dirt' },
      { xStart: 36, xEnd: 44, yStart: 6, yEnd: 14, tile: 'tile_dirt' },
      { xStart: 24, xEnd: 32, yStart: 28, yEnd: 36, tile: 'tile_dirt' },
      { xStart: 4, xEnd: 12, yStart: 26, yEnd: 32, tile: 'tile_dirt' },
      { xStart: 48, xEnd: 56, yStart: 20, yEnd: 28, tile: 'tile_dirt' },
    ],
  },

  temple: {
    baseTile: 'tile_temple',
    secondaryTile: 'tile_stone',
    playerSpawn: { x: 960, y: 1120 },
    npcPositions: [],
    mobSpawnZones: [
      { xMin: 200, xMax: 800, yMin: 160, yMax: 560 },
      { xMin: 1000, xMax: 1720, yMin: 160, yMax: 560 },
      { xMin: 400, xMax: 1500, yMin: 700, yMax: 1040 },
      { xMin: 100, xMax: 600, yMin: 500, yMax: 800 },
      { xMin: 1300, xMax: 1800, yMin: 500, yMax: 800 },
      { xMin: 700, xMax: 1200, yMin: 350, yMax: 650 },
    ],
    resourceZones: [],
    portalPositions: [
      { x: 960, y: 1264, direction: 'south', label: 'Ruinas', targetType: 'ruins' },
    ],
    props: [
      { key: 'prop_ruin_pillar', x: 428, y: 280, scale: 1 },
      { key: 'prop_ruin_pillar', x: 1488, y: 280, scale: 1 },
      { key: 'prop_brazier', x: 712, y: 444, scale: 1 },
      { key: 'prop_brazier', x: 1208, y: 444, scale: 1 },
      { key: 'prop_storage', x: 960, y: 872, scale: 0.9 },
      { key: 'prop_ruin_pillar', x: 300, y: 600, scale: 0.95 },
      { key: 'prop_ruin_pillar', x: 1620, y: 600, scale: 0.95 },
      { key: 'prop_brazier', x: 500, y: 800, scale: 0.9 },
      { key: 'prop_brazier', x: 1420, y: 800, scale: 0.9 },
      { key: 'prop_ruin_pillar', x: 960, y: 300, scale: 1.1 },
      { key: 'prop_rock_cluster', x: 250, y: 1000, scale: 1.0 },
      { key: 'prop_rock_cluster', x: 1680, y: 1000, scale: 1.0 },
    ],
    decorTiles: [
      { xStart: 20, xEnd: 40, yStart: 4, yEnd: 16, tile: 'tile_stone' },
      { xStart: 26, xEnd: 34, yStart: 16, yEnd: 36, tile: 'tile_stone' },
      { xStart: 6, xEnd: 14, yStart: 10, yEnd: 18, tile: 'tile_stone' },
      { xStart: 46, xEnd: 54, yStart: 10, yEnd: 18, tile: 'tile_stone' },
      { xStart: 12, xEnd: 20, yStart: 24, yEnd: 32, tile: 'tile_stone' },
      { xStart: 40, xEnd: 48, yStart: 24, yEnd: 32, tile: 'tile_stone' },
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
