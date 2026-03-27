import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Ground tilesets (spritesheets with 16x16 frame size)
    this.load.spritesheet('ts_ground', '/tileset/Tileset_Ground.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('ts_road', '/tileset/Tileset_Road.png', { frameWidth: 16, frameHeight: 16 });

    // Buildings
    this.load.image('bld_house1', '/tileset/House_Hay_1.png');
    this.load.image('bld_house2', '/tileset/House_Hay_2.png');
    this.load.image('bld_house3', '/tileset/House_Hay_3.png');
    this.load.image('bld_well', '/tileset/Well_Hay_1.png');
    this.load.image('bld_gate', '/tileset/CityWall_Gate_1.png');

    // Trees
    this.load.image('tree1', '/tileset/Tree_Emerald_1.png');
    this.load.image('tree2', '/tileset/Tree_Emerald_2.png');
    this.load.image('tree3', '/tileset/Tree_Emerald_3.png');
    this.load.image('tree4', '/tileset/Tree_Emerald_4.png');

    // Bushes
    this.load.image('bush1', '/tileset/Bush_Emerald_1.png');
    this.load.image('bush2', '/tileset/Bush_Emerald_2.png');
    this.load.image('bush3', '/tileset/Bush_Emerald_3.png');

    // Rocks
    this.load.image('rock1', '/tileset/Rock_Brown_1.png');
    this.load.image('rock2', '/tileset/Rock_Brown_2.png');
    this.load.image('rock3', '/tileset/Rock_Brown_4.png');

    // Props
    this.load.image('prop_bench', '/tileset/Bench_1.png');
    this.load.image('prop_barrel', '/tileset/Barrel_Small_Empty.png');
    this.load.image('prop_sign1', '/tileset/Sign_1.png');
    this.load.image('prop_sign2', '/tileset/Sign_2.png');
    this.load.image('prop_lamp', '/tileset/LampPost_3.png');
    this.load.image('prop_board', '/tileset/BulletinBoard_1.png');
    this.load.image('prop_haystack', '/tileset/HayStack_2.png');
    this.load.image('prop_crate', '/tileset/Crate_Medium_Closed.png');
    this.load.image('prop_sack', '/tileset/Sack_3.png');
    this.load.image('prop_plant', '/tileset/Plant_2.png');
    this.load.image('prop_stump', '/tileset/Chopped_Tree_1.png');
    this.load.image('prop_fireplace', '/tileset/Fireplace_1.png');
    this.load.image('prop_banner', '/tileset/Banner_Stick_1_Purple.png');

    // Missing building
    this.load.image('bld_house4', '/tileset/House_Hay_4_Purple.png');

    // Missing bushes
    this.load.image('bush4', '/tileset/Bush_Emerald_4.png');
    this.load.image('bush5', '/tileset/Bush_Emerald_5.png');
    this.load.image('bush6', '/tileset/Bush_Emerald_6.png');
    this.load.image('bush7', '/tileset/Bush_Emerald_7.png');

    // Missing rocks
    this.load.image('rock4', '/tileset/Rock_Brown_6.png');
    this.load.image('rock5', '/tileset/Rock_Brown_9.png');

    // Missing props
    this.load.image('prop_bench2', '/tileset/Bench_3.png');
    this.load.image('prop_basket', '/tileset/Basket_Empty.png');
    this.load.image('prop_crate_large', '/tileset/Crate_Large_Empty.png');
    this.load.image('prop_crate_water', '/tileset/Crate_Water_1.png');
    this.load.image('prop_table', '/tileset/Table_Medium_1.png');

    // Animated spritesheets
    this.load.spritesheet('anim_campfire', '/tileset/Campfire.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('anim_flowers_red', '/tileset/Flowers_Red.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('anim_flowers_white', '/tileset/Flowers_White.png', { frameWidth: 32, frameHeight: 32 });
  }

  extractTileFromSheet(newKey, sheetKey, frameCol, frameRow, colsInSheet) {
    const source = this.textures.get(sheetKey).getSourceImage();
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false; // keep pixel art crisp
    ctx.drawImage(source, frameCol * 16, frameRow * 16, 16, 16, 0, 0, 32, 32);
    this.textures.addCanvas(newKey, canvas);
  }

  create() {
    // Extract grass tiles from Tileset_Ground.png (12 cols x 14 rows)
    // Rows 8-9 cols 0-5 are solid grass, rows 0-7 cols 6-11 are auto-tile solid fills
    this.extractTileFromSheet('tsg_grass1', 'ts_ground', 0, 8, 12);
    this.extractTileFromSheet('tsg_grass2', 'ts_ground', 1, 8, 12);
    this.extractTileFromSheet('tsg_grass3', 'ts_ground', 2, 8, 12);
    this.extractTileFromSheet('tsg_grass4', 'ts_ground', 0, 9, 12);
    this.extractTileFromSheet('tsg_grass5', 'ts_ground', 1, 9, 12);

    // Extract road/dirt tiles from Tileset_Road.png (6 cols x 14 rows)
    // Rows 8-9 cols 0-2 are solid road, rows 10-11 are variants
    this.extractTileFromSheet('tsg_road1', 'ts_road', 0, 8, 6);
    this.extractTileFromSheet('tsg_road2', 'ts_road', 1, 8, 6);
    this.extractTileFromSheet('tsg_road3', 'ts_road', 2, 8, 6);
    this.extractTileFromSheet('tsg_road4', 'ts_road', 0, 10, 6);

    this.generatePlayerSprites();
    this.generateNpcSprites();
    this.generateMobSprites();
    this.generateResourceSprites();
    this.generateTileSprites();
    this.generatePropSprites();
    this.generateMiscSprites();

    // Create animations for tileset spritesheets
    this.anims.create({ key: 'campfire_burn', frames: this.anims.generateFrameNumbers('anim_campfire', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'flowers_red_sway', frames: this.anims.generateFrameNumbers('anim_flowers_red', { start: 0, end: 23 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'flowers_white_sway', frames: this.anims.generateFrameNumbers('anim_flowers_white', { start: 0, end: 23 }), frameRate: 8, repeat: -1 });

    this.scene.start('WorldScene');
  }

  createPixelTexture(key, width, height, scale, painter) {
    const gfx = this.make.graphics({ x: 0, y: 0, add: false });
    const px = (x, y, w, h, color, alpha = 1) => {
      gfx.fillStyle(color, alpha);
      gfx.fillRect(x * scale, y * scale, w * scale, h * scale);
    };

    painter(px, width, height);
    gfx.generateTexture(key, width * scale, height * scale);
    gfx.destroy();
  }

  createSpritesheet(key, frameWidth, frameHeight, scale, frameCount, painter) {
    const totalWidth = frameWidth * frameCount * scale;
    const totalHeight = frameHeight * scale;
    const gfx = this.make.graphics({ x: 0, y: 0, add: false });

    for (let f = 0; f < frameCount; f++) {
      const offsetX = f * frameWidth * scale;
      const px = (x, y, w, h, color, alpha = 1) => {
        gfx.fillStyle(color, alpha);
        gfx.fillRect(offsetX + x * scale, y * scale, w * scale, h * scale);
      };
      painter(px, f, frameWidth, frameHeight);
    }

    gfx.generateTexture(key, totalWidth, totalHeight);
    gfx.destroy();

    // Add frame data to the texture
    const tex = this.textures.get(key);
    for (let f = 0; f < frameCount; f++) {
      tex.add(f, 0, f * frameWidth * scale, 0, frameWidth * scale, frameHeight * scale);
    }
  }

  // --- Seeded random for deterministic dithering ---
  _seed(s) {
    this._rngState = s;
  }
  _rand() {
    this._rngState = (this._rngState * 16807 + 0) % 2147483647;
    return (this._rngState & 0x7fffffff) / 2147483647;
  }

  // --- Color utilities ---
  _lerpColor(a, b, t) {
    const ar = (a >> 16) & 0xff, ag = (a >> 8) & 0xff, ab = a & 0xff;
    const br = (b >> 16) & 0xff, bg = (b >> 8) & 0xff, bb = b & 0xff;
    const r = Math.round(ar + (br - ar) * t);
    const g = Math.round(ag + (bg - ag) * t);
    const bl = Math.round(ab + (bb - ab) * t);
    return (r << 16) | (g << 8) | bl;
  }

  _darken(color, amt) {
    const r = Math.max(0, ((color >> 16) & 0xff) - amt);
    const g = Math.max(0, ((color >> 8) & 0xff) - amt);
    const b = Math.max(0, (color & 0xff) - amt);
    return (r << 16) | (g << 8) | b;
  }

  _lighten(color, amt) {
    const r = Math.min(255, ((color >> 16) & 0xff) + amt);
    const g = Math.min(255, ((color >> 8) & 0xff) + amt);
    const b = Math.min(255, (color & 0xff) + amt);
    return (r << 16) | (g << 8) | b;
  }

  // Dithered fill: alternates between two colors in checkerboard
  _dither(px, x, y, w, h, c1, c2) {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        px(x + dx, y + dy, 1, 1, (dx + dy) % 2 === 0 ? c1 : c2);
      }
    }
  }

  // Noise fill for tiles
  _noiseFill(px, x, y, w, h, colors, seed) {
    this._seed(seed || 42);
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const idx = Math.floor(this._rand() * colors.length);
        px(x + dx, y + dy, 1, 1, colors[idx]);
      }
    }
  }

  // ================================================================
  //  HUMANOID DRAWING - High detail version
  // ================================================================
  drawDetailedHumanoid(px, p) {
    // Shadow on ground
    px(5, 46, 22, 2, 0x000000, 0.2);
    px(3, 47, 26, 1, 0x000000, 0.1);

    // --- HEAD (rows 1-12) ---
    // Hair top / outline
    px(10, 1, 12, 1, p.hair);
    px(9, 2, 14, 1, p.hair);
    px(8, 3, 16, 2, p.hair);
    px(8, 5, 2, 2, p.hairDark);
    px(22, 5, 2, 2, p.hairDark);

    // Face
    px(10, 5, 12, 8, p.skin);
    px(10, 5, 3, 3, p.skinLight);
    px(19, 5, 3, 3, p.skin);
    // Forehead shadow
    px(10, 5, 12, 1, p.skinDark, 0.3);

    // Eyes
    px(12, 7, 2, 2, 0xffffff);
    px(18, 7, 2, 2, 0xffffff);
    px(13, 7, 1, 2, p.eye);
    px(19, 7, 1, 2, p.eye);
    // Eye shine
    px(12, 7, 1, 1, 0xffffff, 0.9);
    px(18, 7, 1, 1, 0xffffff, 0.9);

    // Eyebrows
    px(11, 6, 3, 1, p.hairDark);
    px(18, 6, 3, 1, p.hairDark);

    // Nose
    px(15, 9, 2, 2, p.skinDark);
    px(15, 9, 1, 1, p.skinLight, 0.5);

    // Mouth
    px(14, 12, 4, 1, p.skinDark);
    px(15, 12, 2, 1, this._darken(p.skinDark, 20));

    // Ears
    px(9, 7, 1, 3, p.skinDark);
    px(22, 7, 1, 3, p.skinDark);

    // Chin / jawline
    px(10, 13, 12, 1, p.skinDark, 0.4);

    // Neck
    px(13, 13, 6, 2, p.skin);
    px(13, 13, 2, 2, p.skinDark, 0.3);

    // --- TORSO (rows 15-32) ---
    // Shoulders
    px(5, 15, 22, 2, p.torso);
    px(5, 15, 6, 2, p.torsoLight);
    px(21, 15, 6, 2, p.torsoShadow);

    // Main torso body
    px(7, 17, 18, 14, p.torso);
    // Light side
    px(7, 17, 5, 12, p.torsoLight);
    // Shadow side
    px(20, 17, 5, 12, p.torsoShadow);
    // Center chest highlight
    px(13, 18, 6, 4, this._lighten(p.torsoLight, 15));

    // Torso bottom / belt area
    px(7, 29, 18, 2, p.belt);
    px(7, 29, 4, 2, this._lighten(p.belt, 20));
    px(14, 30, 4, 1, p.beltBuckle);
    px(15, 29, 2, 2, this._lighten(p.beltBuckle, 30));

    // --- ARMS (rows 15-32) ---
    // Left arm
    px(3, 17, 4, 10, p.sleeve);
    px(3, 17, 2, 8, p.sleeveLight);
    px(5, 17, 2, 8, this._darken(p.sleeve, 15));
    // Left hand
    px(3, 27, 4, 3, p.skin);
    px(3, 27, 2, 2, p.skinLight);
    px(5, 28, 2, 2, p.skinDark);
    // Left fingers
    px(4, 30, 2, 1, p.skinDark);

    // Right arm
    px(25, 17, 4, 10, p.sleeve);
    px(25, 17, 2, 8, this._darken(p.sleeve, 15));
    px(27, 17, 2, 8, p.sleeveLight);
    // Right hand
    px(25, 27, 4, 3, p.skin);
    px(25, 27, 2, 2, p.skinDark);
    px(27, 28, 2, 2, p.skinLight);
    // Right fingers
    px(26, 30, 2, 1, p.skinDark);

    // --- LEGS (rows 32-44) ---
    // Left leg
    px(8, 31, 7, 10, p.legs);
    px(8, 31, 3, 8, p.legsLight);
    px(12, 31, 3, 8, this._darken(p.legs, 15));
    // Gap between legs
    px(15, 33, 2, 8, p.torsoShadow, 0.3);

    // Right leg
    px(17, 31, 7, 10, p.legs);
    px(17, 31, 3, 8, this._darken(p.legs, 15));
    px(21, 31, 3, 8, p.legsLight);

    // --- BOOTS (rows 41-46) ---
    px(7, 41, 8, 5, p.boots);
    px(7, 41, 3, 4, this._lighten(p.boots, 25));
    px(12, 41, 3, 4, this._darken(p.boots, 10));
    px(7, 45, 9, 1, p.bootsSole);

    px(17, 41, 8, 5, p.boots);
    px(17, 41, 3, 4, this._darken(p.boots, 10));
    px(22, 41, 3, 4, this._lighten(p.boots, 25));
    px(16, 45, 9, 1, p.bootsSole);

    // Boot cuff detail
    px(7, 41, 8, 1, this._lighten(p.boots, 35));
    px(17, 41, 8, 1, this._lighten(p.boots, 35));
  }

  drawPlayerVariant(px, type) {
    const basePalettes = {
      warrior: {
        hair: 0x5c3a1e, hairDark: 0x3d2410,
        skin: 0xe8bd8e, skinLight: 0xf5d4a8, skinDark: 0xc49568, eye: 0x3b2820,
        torso: 0x8a8e93, torsoShadow: 0x5e6268, torsoLight: 0xb0b5bb,
        sleeve: 0x8a8e93, sleeveLight: 0xb0b5bb,
        belt: 0x6b4a2a, beltBuckle: 0xd4a63a,
        legs: 0x5a6070, legsLight: 0x78809a,
        boots: 0x4a3020, bootsSole: 0x2a1a10,
        accent: 0xc4302a,
      },
      ninja: {
        hair: 0x1a1025, hairDark: 0x0f0818,
        skin: 0xdec8b0, skinLight: 0xf0dcc8, skinDark: 0xb8987a, eye: 0xe0e8ff,
        torso: 0x2a2040, torsoShadow: 0x1a1230, torsoLight: 0x3d3058,
        sleeve: 0x2a2040, sleeveLight: 0x3d3058,
        belt: 0x8a7030, beltBuckle: 0xc4a64f,
        legs: 0x22203a, legsLight: 0x3a3858,
        boots: 0x18121e, bootsSole: 0x0a0810,
        accent: 0x8a1a28,
      },
      sura: {
        hair: 0x1a0810, hairDark: 0x100508,
        skin: 0xd8a888, skinLight: 0xecc0a0, skinDark: 0xb08060, eye: 0xf0e0d0,
        torso: 0x501828, torsoShadow: 0x380e18, torsoLight: 0x6a2838,
        sleeve: 0x441020, sleeveLight: 0x681830,
        belt: 0x705828, beltBuckle: 0xa08038,
        legs: 0x301828, legsLight: 0x482840,
        boots: 0x200e18, bootsSole: 0x100510,
        accent: 0x50ccff,
      },
      shaman: {
        hair: 0x8a8a9a, hairDark: 0x606070,
        skin: 0xeacea8, skinLight: 0xf8e0c0, skinDark: 0xc8a880, eye: 0x2a2838,
        torso: 0x285580, torsoShadow: 0x183858, torsoLight: 0x3878a8,
        sleeve: 0x285580, sleeveLight: 0x3878a8,
        belt: 0xc89838, beltBuckle: 0xe8c050,
        legs: 0x483870, legsLight: 0x685898,
        boots: 0x2a1838, bootsSole: 0x180e20,
        accent: 0xf0d870,
      },
    };

    const p = basePalettes[type];
    this.drawDetailedHumanoid(px, p);

    // --- CLASS-SPECIFIC OVERLAYS ---
    if (type === 'warrior') {
      // Steel helmet with visor
      px(9, 1, 14, 1, 0xa0a0a8);
      px(8, 2, 16, 3, 0x8a8e95);
      px(9, 2, 14, 2, 0xa8aab0);
      px(10, 4, 12, 1, 0x787c85);
      // Visor slit
      px(11, 5, 10, 1, 0x282830);
      // Helmet shine
      px(11, 2, 4, 1, 0xd0d4da);

      // Chest plate detail - layered armor
      px(9, 18, 14, 8, 0x909498);
      px(10, 19, 12, 6, 0xa8acb2);
      px(11, 20, 4, 4, 0xc0c4ca); // left plate highlight
      px(17, 20, 4, 4, 0x808488); // right plate shadow
      // Armor rivets
      px(10, 19, 1, 1, 0xd8dce0);
      px(21, 19, 1, 1, 0xd8dce0);
      px(10, 25, 1, 1, 0xd8dce0);
      px(21, 25, 1, 1, 0xd8dce0);

      // Shoulder pauldrons
      px(3, 15, 5, 3, 0x909498);
      px(3, 15, 3, 2, 0xb8bcc2);
      px(24, 15, 5, 3, 0x909498);
      px(26, 15, 3, 2, 0xb8bcc2);

      // Red cape on back
      px(8, 16, 1, 18, p.accent);
      px(24, 16, 1, 18, p.accent);
      px(9, 32, 14, 10, p.accent);
      px(10, 33, 12, 8, this._lighten(p.accent, 20));
      px(10, 33, 4, 6, this._lighten(p.accent, 35));
      px(18, 33, 4, 6, this._darken(p.accent, 15));
      // Cape bottom frays
      px(9, 42, 2, 2, this._darken(p.accent, 20));
      px(21, 42, 2, 2, this._darken(p.accent, 20));

      // Great sword on back (diagonal hint)
      px(6, 4, 2, 2, 0xd0d4da);
      px(6, 6, 2, 28, 0x909498);
      px(6, 6, 1, 28, 0xb0b4ba);
      px(5, 4, 1, 3, 0xd4a63a); // hilt
      px(4, 5, 4, 1, 0xc49838); // crossguard
    }

    if (type === 'ninja') {
      // Face mask (covers lower face)
      px(10, 10, 12, 4, 0x1a1028);
      px(11, 10, 10, 3, 0x282040);
      // Eyes visible through mask
      px(12, 7, 2, 2, 0xffffff);
      px(18, 7, 2, 2, 0xffffff);
      px(13, 7, 1, 2, 0xe0e8ff);
      px(19, 7, 1, 2, 0xe0e8ff);

      // Headband
      px(8, 5, 16, 1, 0x8a1a28);
      px(24, 5, 2, 4, 0x8a1a28); // trailing tail
      px(25, 6, 2, 3, 0x701520);

      // Fitted chest wrap / light armor
      px(10, 18, 12, 3, 0x1a1028);
      px(11, 19, 10, 1, 0x282040);
      // Cross-chest strap
      px(10, 18, 2, 10, 0x483060);
      px(20, 18, 2, 10, 0x483060);

      // Arm wraps
      px(3, 22, 4, 4, 0x1a1028);
      px(25, 22, 4, 4, 0x1a1028);

      // Twin daggers at belt
      px(6, 28, 1, 6, 0xb0b8c0);
      px(6, 28, 1, 2, 0x705830);
      px(25, 28, 1, 6, 0xb0b8c0);
      px(25, 28, 1, 2, 0x705830);

      // Leg wraps
      px(8, 38, 7, 2, 0x1a1028);
      px(17, 38, 7, 2, 0x1a1028);

      // Throwing stars on belt
      px(14, 30, 1, 1, 0xc0c8d0);
      px(17, 30, 1, 1, 0xc0c8d0);
    }

    if (type === 'sura') {
      // Dark hood
      px(8, 1, 16, 3, 0x200810);
      px(7, 3, 18, 3, 0x2a0e18);
      px(8, 4, 16, 2, 0x381420);
      // Hood shadow on face
      px(10, 5, 12, 1, 0x180810, 0.5);

      // Magical rune lines on robe (cyan glow)
      px(10, 20, 1, 1, 0x50ccff);
      px(12, 22, 1, 1, 0x50ccff);
      px(14, 20, 1, 1, 0x50ccff);
      px(16, 24, 1, 1, 0x50ccff);
      px(18, 21, 1, 1, 0x50ccff);
      px(20, 23, 1, 1, 0x50ccff);
      // Glow around runes
      px(9, 19, 3, 3, 0x50ccff, 0.15);
      px(11, 21, 3, 3, 0x50ccff, 0.15);
      px(13, 19, 3, 3, 0x50ccff, 0.15);
      px(17, 20, 3, 3, 0x50ccff, 0.15);
      px(19, 22, 3, 3, 0x50ccff, 0.15);

      // Purple energy in rune lines
      px(11, 21, 1, 1, 0xa050e0);
      px(15, 23, 1, 1, 0xa050e0);
      px(19, 20, 1, 1, 0xa050e0);

      // Staff in right hand
      px(27, 8, 2, 24, 0x483028);
      px(27, 8, 1, 24, 0x604838);
      // Staff orb top
      px(26, 5, 4, 4, 0x50ccff);
      px(27, 6, 2, 2, 0xa0e8ff);
      // Staff orb glow
      px(25, 4, 6, 6, 0x50ccff, 0.15);

      // Long robe skirt
      px(8, 31, 16, 12, 0x501828);
      px(9, 32, 14, 10, 0x5a2030);
      px(9, 32, 5, 8, 0x6a2838);
      px(18, 32, 5, 8, 0x481020);
      // Robe bottom glow runes
      px(11, 40, 1, 1, 0x50ccff);
      px(15, 39, 1, 1, 0x50ccff);
      px(19, 41, 1, 1, 0x50ccff);
    }

    if (type === 'shaman') {
      // Ornate golden headpiece
      px(9, 1, 14, 2, 0xd8a838);
      px(10, 1, 12, 1, 0xf0c850);
      px(8, 3, 16, 1, 0xc09030);
      // Center jewel
      px(15, 1, 2, 2, 0x50b0f0);
      px(15, 1, 1, 1, 0xa0d8ff);
      // Side decorations
      px(8, 2, 2, 2, 0xd8a838);
      px(22, 2, 2, 2, 0xd8a838);

      // Long flowing blue/gold robes
      px(7, 17, 18, 14, 0x285580);
      px(8, 18, 16, 12, 0x306898);
      px(8, 18, 6, 10, 0x3878a8);
      px(18, 18, 6, 10, 0x204870);
      // Gold trim on robe
      px(7, 17, 18, 1, 0xd8a838);
      px(7, 30, 18, 1, 0xd8a838);
      // Center robe pattern
      px(14, 19, 4, 8, 0xd8a838);
      px(15, 20, 2, 6, 0xf0c850);

      // Robe skirt
      px(7, 31, 18, 12, 0x285580);
      px(8, 32, 16, 10, 0x306898);
      px(8, 32, 6, 8, 0x3878a8);
      px(18, 32, 6, 8, 0x204870);
      // Gold hem
      px(7, 42, 18, 1, 0xd8a838);

      // Glowing orb in left hand
      px(1, 25, 4, 4, 0xf0d870);
      px(2, 26, 2, 2, 0xfff0a0);
      // Orb glow
      px(0, 24, 6, 6, 0xf0d870, 0.2);

      // Staff in right hand (bone/wood staff)
      px(27, 10, 2, 22, 0x8a6a38);
      px(27, 10, 1, 22, 0xa88848);
      // Staff head ornament
      px(26, 7, 4, 4, 0xd8a838);
      px(27, 8, 2, 2, 0xf0c850);
    }
  }

  drawNpcVariant(px, type) {
    const basePalettes = {
      shop: {
        hair: 0x7a4a20, hairDark: 0x4a2a10,
        skin: 0xe0c098, skinLight: 0xf0d0a8, skinDark: 0xc09870, eye: 0x302818,
        torso: 0x4a7830, torsoShadow: 0x2e5018, torsoLight: 0x68a848,
        sleeve: 0x4a7830, sleeveLight: 0x68a848,
        belt: 0xb89848, beltBuckle: 0xd8b858,
        legs: 0x6a5038, legsLight: 0x8a7058,
        boots: 0x3a2818, bootsSole: 0x201408,
        accent: 0x8a5020,
      },
      blacksmith: {
        hair: 0x2a2020, hairDark: 0x181010,
        skin: 0xd8b088, skinLight: 0xe8c8a0, skinDark: 0xb88860, eye: 0x282018,
        torso: 0x606468, torsoShadow: 0x404448, torsoLight: 0x808488,
        sleeve: 0x505458, sleeveLight: 0x707478,
        belt: 0xa87838, beltBuckle: 0xc89848,
        legs: 0x3a3840, legsLight: 0x585860,
        boots: 0x282018, bootsSole: 0x181010,
        accent: 0xff9030,
      },
      healer: {
        hair: 0xd8a860, hairDark: 0xa87838,
        skin: 0xe8c8a8, skinLight: 0xf8dcc0, skinDark: 0xc8a080, eye: 0x302030,
        torso: 0xe8e0ea, torsoShadow: 0xc0b8c2, torsoLight: 0xf8f0f8,
        sleeve: 0xe0d8e2, sleeveLight: 0xf8f0f8,
        belt: 0xc89838, beltBuckle: 0xe0b850,
        legs: 0xd0c0d4, legsLight: 0xf0e0f0,
        boots: 0x584860, bootsSole: 0x302838,
        accent: 0xd84860,
      },
      trainer: {
        hair: 0x181818, hairDark: 0x080808,
        skin: 0xdab490, skinLight: 0xecc8a8, skinDark: 0xb08860, eye: 0x281810,
        torso: 0x908040, torsoShadow: 0x605828, torsoLight: 0xb0a060,
        sleeve: 0x908040, sleeveLight: 0xb0a060,
        belt: 0x302020, beltBuckle: 0x604030,
        legs: 0x485060, legsLight: 0x687888,
        boots: 0x281810, bootsSole: 0x180808,
        accent: 0xb83028,
      },
      material: {
        hair: 0x604028, hairDark: 0x382010,
        skin: 0xdcb898, skinLight: 0xf0d0b0, skinDark: 0xb89068, eye: 0x282018,
        torso: 0x805838, torsoShadow: 0x584020, torsoLight: 0xa87850,
        sleeve: 0x705030, sleeveLight: 0x987048,
        belt: 0xb89848, beltBuckle: 0xd0b058,
        legs: 0x685040, legsLight: 0x887058,
        boots: 0x382818, bootsSole: 0x201008,
        accent: 0x489050,
      },
      lifeskill: {
        hair: 0x584020, hairDark: 0x302010,
        skin: 0xe4c8a0, skinLight: 0xf0d8b8, skinDark: 0xc0a070, eye: 0x202818,
        torso: 0x308068, torsoShadow: 0x185848, torsoLight: 0x48a880,
        sleeve: 0x288860, sleeveLight: 0x48a880,
        belt: 0xb89848, beltBuckle: 0xd0b058,
        legs: 0x506048, legsLight: 0x708068,
        boots: 0x283020, bootsSole: 0x181810,
        accent: 0x80c048,
      },
      storage: {
        hair: 0x484850, hairDark: 0x282830,
        skin: 0xdcc098, skinLight: 0xecd8b0, skinDark: 0xb89868, eye: 0x282830,
        torso: 0x708090, torsoShadow: 0x506070, torsoLight: 0x90a0b0,
        sleeve: 0x607080, sleeveLight: 0x8898a8,
        belt: 0xa08838, beltBuckle: 0xc8a848,
        legs: 0x485058, legsLight: 0x687880,
        boots: 0x202830, bootsSole: 0x101418,
        accent: 0xb0c0d0,
      },
    };

    const p = basePalettes[type];
    this.drawDetailedHumanoid(px, p);

    // --- NPC-SPECIFIC OVERLAYS ---
    if (type === 'shop') {
      // Merchant hat
      px(8, 1, 16, 2, 0x8a5020);
      px(6, 3, 20, 1, 0x704018);
      px(9, 1, 14, 1, 0xa86830);
      // Hat band
      px(8, 2, 16, 1, 0xd8b858);

      // Apron
      px(9, 20, 14, 10, 0xd8c898);
      px(10, 21, 12, 8, 0xe8d8a8);
      px(10, 21, 4, 6, 0xf0e0b8);
      // Apron pocket
      px(17, 23, 4, 4, 0xc8b888);
      px(18, 24, 2, 2, 0xb8a878);

      // Coin pouch on belt
      px(22, 28, 3, 4, 0xc89030);
      px(23, 29, 1, 2, 0xe0a840);
      // Gold coins visible
      px(22, 28, 2, 1, 0xf0d060);
    }

    if (type === 'blacksmith') {
      // Bald / short hair, soot on face
      px(10, 3, 12, 2, 0x2a2020);
      px(14, 10, 4, 1, 0x484040, 0.4); // soot

      // Leather apron
      px(9, 18, 14, 12, 0x6a4828);
      px(10, 19, 12, 10, 0x805838);
      px(10, 19, 4, 8, 0x907048);
      // Apron straps
      px(10, 15, 2, 4, 0x6a4828);
      px(20, 15, 2, 4, 0x6a4828);
      // Forge glow on skin (warm tint on chest/arms)
      px(7, 17, 4, 6, 0xff8040, 0.1);
      px(25, 17, 4, 6, 0xff8040, 0.1);

      // Hammer in right hand
      px(27, 20, 2, 12, 0x604020);
      px(27, 20, 1, 12, 0x785030);
      px(25, 18, 6, 3, 0x808890);
      px(26, 18, 4, 2, 0xa0a8b0);

      // Muscular arm detail
      px(4, 18, 2, 2, this._lighten(p.skin, 15));
      px(26, 18, 2, 2, this._lighten(p.skin, 15));
    }

    if (type === 'healer') {
      // Gentle flowing hair
      px(8, 2, 16, 4, 0xd8a860);
      px(7, 4, 2, 6, 0xc89848);
      px(23, 4, 2, 6, 0xc89848);
      px(9, 2, 14, 2, 0xe8c070);

      // White/pink robe overlay with cross symbol
      px(12, 20, 8, 6, 0xf0e8f0);
      px(14, 21, 4, 1, 0xd84860);
      px(15, 20, 2, 4, 0xd84860);

      // Soft glow effect around body
      px(6, 16, 20, 16, 0xffd0e0, 0.08);
      px(4, 20, 2, 8, 0xffd0e0, 0.12);
      px(26, 20, 2, 8, 0xffd0e0, 0.12);

      // Long flowing robe
      px(7, 31, 18, 12, 0xe8e0ea);
      px(8, 32, 16, 10, 0xf0e8f0);
      px(8, 32, 6, 8, 0xf8f0f8);
      px(18, 32, 6, 8, 0xd8d0da);
      px(7, 42, 18, 1, 0xd84860);

      // Healing staff (thin, with crystal)
      px(1, 12, 2, 22, 0xc8b898);
      px(1, 12, 1, 22, 0xd8c8a8);
      px(0, 9, 4, 4, 0xff90b0);
      px(1, 10, 2, 2, 0xffc0d0);
    }

    if (type === 'trainer') {
      // Headband
      px(8, 4, 16, 2, 0xb83028);
      px(24, 4, 3, 4, 0xb83028);
      px(25, 5, 3, 3, 0x901820);

      // Battle scar on face
      px(18, 8, 1, 4, 0xb88880);

      // Martial arts gi
      px(8, 17, 16, 12, 0xf0e8d8);
      px(9, 18, 14, 10, 0xf8f0e0);
      // Gi overlap
      px(12, 18, 2, 8, p.torso);
      // Black belt
      px(7, 29, 18, 2, 0x181818);
      px(14, 28, 4, 1, 0x282828);
      px(14, 31, 4, 4, 0x181818); // belt knot hanging

      // Muscular build hints
      px(4, 18, 3, 4, this._lighten(p.skin, 10));
      px(25, 18, 3, 4, this._lighten(p.skin, 10));

      // Wrapped fists
      px(3, 27, 4, 3, 0xf0e8d8);
      px(25, 27, 4, 3, 0xf0e8d8);
    }

    if (type === 'material') {
      // Rugged hat
      px(8, 1, 16, 2, 0x5a3820);
      px(7, 3, 18, 1, 0x483018);
      px(10, 1, 12, 1, 0x704828);

      // Backpack visible from front (straps)
      px(8, 15, 2, 10, 0x604020);
      px(22, 15, 2, 10, 0x604020);
      // Backpack top peeking over shoulders
      px(5, 13, 4, 4, 0x805838);
      px(23, 13, 4, 4, 0x805838);
      px(6, 14, 2, 2, 0x906848);

      // Pouches on belt
      px(5, 28, 3, 3, 0x6a5030);
      px(24, 28, 3, 3, 0x6a5030);
      px(6, 29, 1, 1, 0x489050);

      // Rope coil
      px(22, 20, 3, 3, 0xc8b080);
      px(23, 21, 1, 1, 0xd8c090);
    }

    if (type === 'lifeskill') {
      // Craftsman cap
      px(9, 1, 14, 2, 0xb89040);
      px(8, 3, 16, 1, 0x907028);
      px(10, 1, 12, 1, 0xd0a850);

      // Tool belt with various tools
      px(7, 29, 18, 2, 0x6a5030);
      px(5, 28, 3, 4, 0x808890); // wrench
      px(6, 28, 1, 3, 0xa0a8b0);
      px(24, 28, 3, 4, 0x604020); // hammer handle
      px(24, 27, 3, 2, 0x808890); // hammer head

      // Work gloves
      px(3, 27, 4, 3, 0x906838);
      px(25, 27, 4, 3, 0x906838);

      // Green patch on shirt
      px(13, 22, 6, 4, 0x80c048);
      px(14, 23, 4, 2, 0x90d058);
    }

    if (type === 'storage') {
      // Guard helmet
      px(9, 1, 14, 3, 0x808890);
      px(10, 1, 12, 2, 0xa0a8b0);
      px(14, 0, 4, 1, 0xb0b8c0);
      // Helmet plume
      px(14, 0, 4, 1, 0xb0c0d0);

      // Sturdy chain mail hints
      px(9, 18, 14, 8, 0x707880);
      this._dither(px, 10, 19, 12, 6, 0x808890, 0x687078);

      // Key ring on belt
      px(22, 29, 3, 4, 0xc8a848);
      px(23, 30, 1, 1, 0xe0c060);
      px(22, 32, 1, 1, 0xd0b050);
      px(24, 31, 1, 1, 0xd0b050);

      // Shield on back
      px(4, 16, 4, 8, 0x6080a0);
      px(5, 17, 2, 6, 0x7898b8);
      px(5, 19, 2, 2, 0xb0c0d0);
    }
  }

  drawPlayerWalkFrame(px, type, frameIndex) {
    // Frame 0 & 2: standing pose (default)
    // Frame 1: left leg forward, right arm forward
    // Frame 3: right leg forward, left arm forward
    const basePalettes = {
      warrior: {
        skin: 0xe8bd8e, skinLight: 0xf5d4a8, skinDark: 0xc49568,
        sleeve: 0x8a8e93, sleeveLight: 0xb0b5bb,
        legs: 0x5a6070, legsLight: 0x78809a,
        boots: 0x4a3020, bootsSole: 0x2a1a10,
        torsoShadow: 0x5e6268,
      },
      ninja: {
        skin: 0xdec8b0, skinLight: 0xf0dcc8, skinDark: 0xb8987a,
        sleeve: 0x2a2040, sleeveLight: 0x3d3058,
        legs: 0x22203a, legsLight: 0x3a3858,
        boots: 0x18121e, bootsSole: 0x0a0810,
        torsoShadow: 0x1a1230,
      },
      sura: {
        skin: 0xd8a888, skinLight: 0xecc0a0, skinDark: 0xb08060,
        sleeve: 0x441020, sleeveLight: 0x681830,
        legs: 0x301828, legsLight: 0x482840,
        boots: 0x200e18, bootsSole: 0x100510,
        torsoShadow: 0x380e18,
      },
      shaman: {
        skin: 0xeacea8, skinLight: 0xf8e0c0, skinDark: 0xc8a880,
        sleeve: 0x285580, sleeveLight: 0x3878a8,
        legs: 0x483870, legsLight: 0x685898,
        boots: 0x2a1838, bootsSole: 0x180e20,
        torsoShadow: 0x183858,
      },
    };

    // Draw the base standing sprite first
    this.drawPlayerVariant(px, type);

    // For frames 1 and 3, overdraw the legs and arms with shifted positions
    if (frameIndex === 1 || frameIndex === 3) {
      const p = basePalettes[type];
      const leftForward = (frameIndex === 1);

      // Clear legs area by overpainting with torso shadow (gap area)
      // then redraw legs at shifted positions
      const legClearColor = p.torsoShadow;

      // Overdraw the leg region to "erase" original legs
      // Original left leg: x=8..14, y=31..40
      // Original right leg: x=17..23, y=31..40
      // Original boots: left x=7..14,y=41..46  right x=17..24,y=41..46
      // We clear the full leg+boot area first
      px(7, 31, 18, 16, 0x000000, 0); // transparent won't work, so we overdraw

      // We need to redraw with offsets. Since we can't erase pixels with
      // the graphics API, we'll overdraw the leg area with background color.
      // Actually, the simplest approach: overdraw a dark rectangle then redraw legs.

      // Dark background for leg area (simulates clearing)
      // Shadow on ground
      px(5, 46, 22, 2, 0x000000, 0.2);
      px(3, 47, 26, 1, 0x000000, 0.1);

      const fwdOff = 2;  // forward offset in pixels
      const bkOff = 2;   // backward offset in pixels

      // Determine offsets per leg
      const leftLegOff = leftForward ? -fwdOff : bkOff;
      const rightLegOff = leftForward ? bkOff : -fwdOff;
      const leftArmOff = leftForward ? bkOff : -fwdOff;
      const rightArmOff = leftForward ? -fwdOff : bkOff;

      // --- Redraw LEFT LEG with Y offset ---
      const lly = 31 + leftLegOff;
      px(8, lly, 7, 10, p.legs);
      px(8, lly, 3, 8, p.legsLight);
      px(12, lly, 3, 8, this._darken(p.legs, 15));
      // Left boot
      const lby = 41 + leftLegOff;
      px(7, lby, 8, 5, p.boots);
      px(7, lby, 3, 4, this._lighten(p.boots, 25));
      px(12, lby, 3, 4, this._darken(p.boots, 10));
      px(7, lby + 4, 9, 1, p.bootsSole);
      px(7, lby, 8, 1, this._lighten(p.boots, 35));

      // --- Redraw RIGHT LEG with Y offset ---
      const rly = 31 + rightLegOff;
      px(17, rly, 7, 10, p.legs);
      px(17, rly, 3, 8, this._darken(p.legs, 15));
      px(21, rly, 3, 8, p.legsLight);
      // Right boot
      const rby = 41 + rightLegOff;
      px(17, rby, 8, 5, p.boots);
      px(17, rby, 3, 4, this._darken(p.boots, 10));
      px(22, rby, 3, 4, this._lighten(p.boots, 25));
      px(16, rby + 4, 9, 1, p.bootsSole);
      px(17, rby, 8, 1, this._lighten(p.boots, 35));

      // Gap between legs
      px(15, Math.min(lly, rly) + 2, 2, 8, p.torsoShadow, 0.3);

      // --- Redraw LEFT ARM with Y offset ---
      const lay = 17 + leftArmOff;
      px(3, lay, 4, 10, p.sleeve);
      px(3, lay, 2, 8, p.sleeveLight);
      px(5, lay, 2, 8, this._darken(p.sleeve, 15));
      px(3, lay + 10, 4, 3, p.skin);
      px(3, lay + 10, 2, 2, p.skinLight);
      px(5, lay + 11, 2, 2, p.skinDark);
      px(4, lay + 13, 2, 1, p.skinDark);

      // --- Redraw RIGHT ARM with Y offset ---
      const ray = 17 + rightArmOff;
      px(25, ray, 4, 10, p.sleeve);
      px(25, ray, 2, 8, this._darken(p.sleeve, 15));
      px(27, ray, 2, 8, p.sleeveLight);
      px(25, ray + 10, 4, 3, p.skin);
      px(25, ray + 10, 2, 2, p.skinDark);
      px(27, ray + 11, 2, 2, p.skinLight);
      px(26, ray + 13, 2, 1, p.skinDark);
    }
  }

  generatePlayerSprites() {
    const variants = ['warrior', 'ninja', 'sura', 'shaman'];
    const frameCount = 4;

    variants.forEach((variant) => {
      const key = `player_${variant}`;

      this.createSpritesheet(key, 32, 48, 1, frameCount, (px, frameIndex) => {
        this.drawPlayerWalkFrame(px, variant, frameIndex);
      });

      // Create walk animation (frames 0-1-2-3 looping)
      this.anims.create({
        key: `${key}_walk`,
        frames: this.anims.generateFrameNumbers(key, { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      });

      // Create idle animation (single frame 0)
      this.anims.create({
        key: `${key}_idle`,
        frames: [{ key: key, frame: 0 }],
        frameRate: 1,
        repeat: 0
      });
    });
  }

  generateNpcSprites() {
    const variants = [
      { key: 'npc_shop', type: 'shop' },
      { key: 'npc_blacksmith', type: 'blacksmith' },
      { key: 'npc_healer', type: 'healer' },
      { key: 'npc_trainer', type: 'trainer' },
      { key: 'npc_material', type: 'material' },
      { key: 'npc_lifeskill', type: 'lifeskill' },
      { key: 'npc_storage', type: 'storage' },
    ];

    variants.forEach((variant) => {
      this.createPixelTexture(variant.key, 32, 48, 1, (px) => {
        this.drawNpcVariant(px, variant.type);
      });
    });
  }

  _drawMobNormal(px, legOff) {
    // Ground shadow
    px(3, 18, 14, 2, 0x000000, 0.2);

    // Tail
    px(1, 6, 2, 2, 0x6a5848);
    px(0, 5, 2, 2, 0x7a6858);
    px(0, 4, 1, 2, 0x8a7868);

    // Body - main fur
    px(4, 8, 12, 6, 0x7a6858);
    px(5, 9, 10, 4, 0x8a7868);
    // Light belly
    px(7, 12, 6, 2, 0xa89888);
    // Dark back
    px(5, 8, 10, 2, 0x5a4838);
    // Fur texture dithering
    this._dither(px, 6, 9, 8, 2, 0x8a7868, 0x7a6858);

    // Head
    px(14, 5, 5, 5, 0x7a6858);
    px(15, 6, 3, 3, 0x8a7868);
    // Snout
    px(18, 8, 2, 2, 0x9a8878);
    px(19, 8, 1, 1, 0x3a2818); // nose
    // Eyes
    px(16, 6, 1, 1, 0xffe040);
    px(17, 6, 1, 1, 0xff4040);
    // Ears
    px(14, 4, 2, 2, 0x6a5848);
    px(17, 4, 2, 2, 0x6a5848);
    px(14, 4, 1, 1, 0x8a6858);
    px(18, 4, 1, 1, 0x8a6858);

    // Mouth / teeth
    px(18, 10, 2, 1, 0x4a2818);
    px(19, 9, 1, 1, 0xf0f0f0); // fang

    // Front legs (with offset for walk frame)
    const flOff = legOff;     // front legs offset
    const hlOff = -legOff;    // hind legs opposite offset
    px(13, 13 + flOff, 2, 5, 0x6a5848);
    px(13, 13 + flOff, 1, 4, 0x7a6858);
    px(11, 13 - flOff, 2, 5, 0x5a4838);
    px(12, 13 - flOff, 1, 4, 0x6a5848);
    // Paws
    px(13, 17 + flOff, 2, 1, 0x4a3828);
    px(11, 17 - flOff, 2, 1, 0x4a3828);

    // Hind legs
    px(5, 13 + hlOff, 2, 5, 0x6a5848);
    px(6, 13 + hlOff, 1, 4, 0x7a6858);
    px(7, 13 - hlOff, 2, 5, 0x5a4838);
    px(7, 13 - hlOff, 1, 4, 0x6a5848);
    // Paws
    px(5, 17 + hlOff, 2, 1, 0x4a3828);
    px(7, 17 - hlOff, 2, 1, 0x4a3828);
  }

  _drawMobAggressive(px, legOff) {
    px(4, 22, 16, 2, 0x000000, 0.25);

    // Body mass
    px(7, 8, 10, 10, 0x801818);
    px(8, 9, 8, 8, 0xa02828);
    // Light/shadow on body
    px(8, 9, 3, 6, 0xb03838);
    px(13, 9, 3, 6, 0x881818);

    // Head
    px(8, 3, 8, 6, 0x801818);
    px(9, 4, 6, 4, 0xa02828);
    px(9, 4, 2, 2, 0xb83838);

    // Horns
    px(7, 1, 2, 4, 0xd8c060);
    px(6, 0, 1, 2, 0xe8d070);
    px(15, 1, 2, 4, 0xd8c060);
    px(17, 0, 1, 2, 0xe8d070);

    // Glowing eyes
    px(10, 5, 2, 1, 0xffee50);
    px(14, 5, 2, 1, 0xffee50);
    px(10, 5, 1, 1, 0xffffff);
    px(14, 5, 1, 1, 0xffffff);
    // Eye glow
    px(9, 4, 4, 3, 0xffee50, 0.12);
    px(13, 4, 4, 3, 0xffee50, 0.12);

    // Jaw / teeth
    px(9, 7, 6, 2, 0x601010);
    px(10, 7, 1, 1, 0xf0f0f0);
    px(13, 7, 1, 1, 0xf0f0f0);
    px(11, 8, 2, 1, 0xf0f0f0);

    // Arms
    px(4, 9, 3, 8, 0x881818);
    px(5, 10, 2, 6, 0xa02828);
    px(17, 9, 3, 8, 0x881818);
    px(17, 10, 2, 6, 0xa02828);

    // Weapon (axe) in right hand
    px(19, 6, 2, 12, 0x604020);
    px(20, 4, 3, 4, 0x808890);
    px(21, 4, 2, 3, 0xa0a8b0);
    px(20, 5, 1, 1, 0xc0c8d0);

    // Legs (with walk offset)
    px(8, 17 + legOff, 3, 5, 0x701010);
    px(9, 17 + legOff, 2, 4, 0x881818);
    px(13, 17 - legOff, 3, 5, 0x701010);
    px(13, 17 - legOff, 2, 4, 0x881818);

    // Feet / claws
    px(7, 21 + legOff, 4, 1, 0x501010);
    px(13, 21 - legOff, 4, 1, 0x501010);

    // Shoulder spikes
    px(5, 8, 2, 2, 0x808890);
    px(17, 8, 2, 2, 0x808890);
  }

  _drawMobElite(px, legOff) {
    px(5, 26, 18, 2, 0x000000, 0.25);

    // Body - large armored
    px(8, 8, 12, 14, 0x283850);
    px(9, 9, 10, 12, 0x3a5070);
    px(9, 9, 4, 10, 0x486088);
    px(15, 9, 4, 10, 0x2a4060);

    // Armor plate detail
    px(10, 10, 8, 4, 0x506888);
    px(11, 11, 6, 2, 0x6080a0);
    // Center gem
    px(13, 12, 2, 2, 0x50e8ff);
    px(13, 12, 1, 1, 0xa0f8ff);

    // Head with helmet/crown
    px(9, 2, 10, 7, 0x283850);
    px(10, 3, 8, 5, 0x3a5070);
    px(10, 3, 3, 3, 0x486088);

    // Crown / horns
    px(8, 0, 3, 4, 0xd8c060);
    px(7, 0, 1, 2, 0xe8d070);
    px(17, 0, 3, 4, 0xd8c060);
    px(20, 0, 1, 2, 0xe8d070);
    // Center crown spike
    px(12, 0, 4, 3, 0xd8c060);
    px(13, 0, 2, 2, 0xf0e080);

    // Glowing eyes
    px(11, 5, 2, 1, 0x80e8ff);
    px(15, 5, 2, 1, 0x80e8ff);
    px(11, 5, 1, 1, 0xc0f8ff);
    px(15, 5, 1, 1, 0xc0f8ff);
    // Eye glow aura
    px(10, 4, 4, 3, 0x80e8ff, 0.1);
    px(14, 4, 4, 3, 0x80e8ff, 0.1);

    // Shoulder pauldrons
    px(5, 8, 4, 4, 0x3a5070);
    px(5, 8, 3, 3, 0x506888);
    px(6, 9, 1, 1, 0x6888a8);
    px(19, 8, 4, 4, 0x3a5070);
    px(20, 8, 3, 3, 0x506888);
    px(21, 9, 1, 1, 0x6888a8);
    // Pauldron spikes
    px(5, 7, 1, 2, 0xd8c060);
    px(22, 7, 1, 2, 0xd8c060);

    // Arms
    px(4, 11, 4, 8, 0x283850);
    px(5, 12, 2, 6, 0x3a5070);
    px(20, 11, 4, 8, 0x283850);
    px(21, 12, 2, 6, 0x3a5070);

    // Magical aura pixels around body
    px(7, 6, 1, 1, 0x80e8ff, 0.5);
    px(20, 10, 1, 1, 0x80e8ff, 0.5);
    px(6, 14, 1, 1, 0x80e8ff, 0.4);
    px(21, 18, 1, 1, 0x80e8ff, 0.4);
    px(12, 1, 1, 1, 0x80e8ff, 0.6);
    px(16, 2, 1, 1, 0x80e8ff, 0.5);
    px(3, 12, 1, 1, 0x80e8ff, 0.3);
    px(24, 15, 1, 1, 0x80e8ff, 0.3);

    // Legs - armored (with walk offset)
    px(9, 21 + legOff, 4, 5, 0x283850);
    px(10, 21 + legOff, 2, 4, 0x3a5070);
    px(15, 21 - legOff, 4, 5, 0x283850);
    px(16, 21 - legOff, 2, 4, 0x3a5070);

    // Armored boots
    px(8, 24 + legOff, 5, 2, 0x2a3848);
    px(15, 24 - legOff, 5, 2, 0x2a3848);

    // Sword
    px(2, 2, 1, 18, 0xa0a8b0);
    px(2, 2, 1, 1, 0xd0d8e0);
    px(1, 18, 3, 2, 0xd8c060);
    px(1, 20, 3, 1, 0x604020);
  }

  _drawMobBoss(px, legOff) {
    px(8, 38, 24, 2, 0x000000, 0.3);

    // --- Wings (behind body) ---
    // Left wing
    px(0, 8, 8, 12, 0x601020);
    px(1, 9, 6, 10, 0x802030);
    px(2, 10, 4, 8, 0xa03040);
    // Wing membrane lines
    px(1, 10, 1, 8, 0x501018);
    px(3, 9, 1, 10, 0x501018);
    px(5, 10, 1, 8, 0x501018);
    // Wing tip
    px(0, 6, 2, 3, 0x501018);

    // Right wing
    px(32, 8, 8, 12, 0x601020);
    px(33, 9, 6, 10, 0x802030);
    px(34, 10, 4, 8, 0xa03040);
    px(33, 10, 1, 8, 0x501018);
    px(35, 9, 1, 10, 0x501018);
    px(37, 10, 1, 8, 0x501018);
    px(38, 6, 2, 3, 0x501018);

    // --- Main body ---
    px(12, 12, 16, 18, 0x8a1818);
    px(13, 13, 14, 16, 0xa82828);
    // Body shading
    px(13, 13, 5, 14, 0xb83838);
    px(22, 13, 5, 14, 0x881818);
    // Center chest plate scales
    px(16, 15, 8, 8, 0xc84040);
    px(17, 16, 6, 6, 0xd85050);
    px(18, 17, 4, 4, 0xe06060);
    // Belly scales (lighter)
    px(15, 24, 10, 4, 0xc8a070);
    px(16, 25, 8, 2, 0xd8b080);

    // --- Head ---
    px(13, 4, 14, 9, 0x8a1818);
    px(14, 5, 12, 7, 0xa82828);
    px(14, 5, 5, 5, 0xb83838);
    // Snout / jaw
    px(15, 10, 10, 3, 0x8a1818);
    px(16, 11, 8, 2, 0xa02020);
    // Nostrils
    px(17, 10, 1, 1, 0x601010);
    px(22, 10, 1, 1, 0x601010);
    // Fire/smoke from nostrils
    px(16, 9, 1, 1, 0xff8040, 0.6);
    px(23, 9, 1, 1, 0xff8040, 0.6);

    // Eyes - menacing glow
    px(16, 6, 3, 2, 0xffee50);
    px(22, 6, 3, 2, 0xffee50);
    px(16, 6, 2, 1, 0xffffff);
    px(22, 6, 2, 1, 0xffffff);
    px(18, 7, 1, 1, 0xff2020); // pupil
    px(24, 7, 1, 1, 0xff2020);
    // Eye glow
    px(15, 5, 5, 4, 0xffee50, 0.1);
    px(21, 5, 5, 4, 0xffee50, 0.1);

    // --- Multiple horn sets ---
    // Main horns (large, curved)
    px(12, 2, 3, 5, 0xd8c060);
    px(11, 0, 2, 3, 0xe8d070);
    px(10, 0, 1, 1, 0xf0e080);
    px(25, 2, 3, 5, 0xd8c060);
    px(27, 0, 2, 3, 0xe8d070);
    px(29, 0, 1, 1, 0xf0e080);

    // Secondary horns (smaller, behind)
    px(14, 1, 2, 3, 0xc0a850);
    px(14, 0, 1, 1, 0xd0b860);
    px(24, 1, 2, 3, 0xc0a850);
    px(25, 0, 1, 1, 0xd0b860);

    // Small jaw horns
    px(14, 11, 1, 2, 0xd8c060);
    px(25, 11, 1, 2, 0xd8c060);

    // --- Teeth ---
    px(17, 12, 1, 1, 0xf0f0f0);
    px(19, 12, 1, 1, 0xf0f0f0);
    px(21, 12, 1, 1, 0xf0f0f0);
    px(23, 12, 1, 1, 0xf0f0f0);

    // --- Arms with claws ---
    px(8, 14, 5, 10, 0x881818);
    px(9, 15, 3, 8, 0xa02828);
    px(9, 15, 1, 6, 0xb03030);
    px(27, 14, 5, 10, 0x881818);
    px(28, 15, 3, 8, 0xa02828);
    px(30, 15, 1, 6, 0xb03030);
    // Claws
    px(7, 23, 2, 2, 0xd8c060);
    px(6, 24, 1, 1, 0xe8d070);
    px(31, 23, 2, 2, 0xd8c060);
    px(33, 24, 1, 1, 0xe8d070);

    // --- Legs (with walk offset) ---
    px(13, 29 + legOff, 5, 8, 0x781010);
    px(14, 30 + legOff, 3, 6, 0x8a1818);
    px(14, 30 + legOff, 1, 5, 0x982020);
    px(22, 29 - legOff, 5, 8, 0x781010);
    px(23, 30 - legOff, 3, 6, 0x8a1818);
    px(24, 30 - legOff, 1, 5, 0x982020);

    // Feet with claws
    px(12, 36 + legOff, 6, 2, 0x601010);
    px(11, 37 + legOff, 2, 1, 0xd8c060);
    px(17, 37 + legOff, 1, 1, 0xd8c060);
    px(22, 36 - legOff, 6, 2, 0x601010);
    px(21, 37 - legOff, 2, 1, 0xd8c060);
    px(27, 37 - legOff, 1, 1, 0xd8c060);

    // --- Tail ---
    px(18, 30, 4, 2, 0x8a1818);
    px(20, 32, 4, 2, 0x801818);
    px(23, 34, 4, 2, 0x701010);
    px(26, 35, 3, 2, 0x601010);
    px(28, 36, 2, 1, 0xd8c060); // tail spike

    // --- Magical energy effects ---
    // Floating magical particles
    px(6, 4, 1, 1, 0xff5050, 0.7);
    px(33, 5, 1, 1, 0xff5050, 0.7);
    px(10, 28, 1, 1, 0xff8040, 0.6);
    px(29, 26, 1, 1, 0xff8040, 0.6);
    px(20, 2, 1, 1, 0xffee50, 0.8);
    px(5, 20, 1, 1, 0xff5050, 0.5);
    px(34, 18, 1, 1, 0xff5050, 0.5);
    px(18, 0, 1, 1, 0xffee50, 0.6);

    // Fire/magic breath hint
    px(15, 8, 2, 2, 0xff6030, 0.5);
    px(24, 8, 2, 2, 0xff6030, 0.5);

    // Golden belt / waist armor
    px(12, 28, 16, 2, 0xd8c060);
    px(13, 28, 14, 1, 0xe8d070);
    px(18, 28, 4, 2, 0xf0e080);
  }

  generateMobSprites() {
    const mobDefs = [
      { key: 'mob_normal', w: 20, h: 20, draw: (px, off) => this._drawMobNormal(px, off) },
      { key: 'mob_aggressive', w: 24, h: 24, draw: (px, off) => this._drawMobAggressive(px, off) },
      { key: 'mob_elite', w: 28, h: 28, draw: (px, off) => this._drawMobElite(px, off) },
      { key: 'mob_boss', w: 40, h: 40, draw: (px, off) => this._drawMobBoss(px, off) },
    ];

    const frameCount = 2;

    mobDefs.forEach(({ key, w, h, draw }) => {
      this.createSpritesheet(key, w, h, 1, frameCount, (px, frameIndex) => {
        const legOff = (frameIndex === 0) ? 0 : 1;
        draw(px, legOff);
      });

      // Create walk animation (alternates between frames 0 and 1)
      this.anims.create({
        key: `${key}_walk`,
        frames: this.anims.generateFrameNumbers(key, { start: 0, end: 1 }),
        frameRate: 6,
        repeat: -1
      });

      // Create idle animation (single frame 0)
      this.anims.create({
        key: `${key}_idle`,
        frames: [{ key: key, frame: 0 }],
        frameRate: 1,
        repeat: 0
      });
    });
  }

  generateResourceSprites() {
    // Mining node - crystal-studded rock
    this.createPixelTexture('resource_mining', 12, 12, 1, (px) => {
      px(2, 11, 8, 1, 0x000000, 0.2);

      // Rock base
      px(1, 5, 10, 5, 0x585858);
      px(2, 4, 8, 1, 0x686868);
      px(2, 10, 8, 1, 0x484848);
      // Rock shading
      px(2, 5, 4, 4, 0x707070);
      px(6, 6, 4, 4, 0x505050);
      // Rock texture
      px(3, 6, 2, 2, 0x888888);
      px(7, 8, 2, 1, 0x404040);

      // Crystal formations
      px(3, 2, 2, 4, 0x40c8ff);
      px(3, 2, 1, 3, 0x70e0ff);
      px(4, 3, 1, 1, 0xa0f0ff);

      px(7, 3, 2, 3, 0x40c8ff);
      px(8, 3, 1, 2, 0x70e0ff);

      px(5, 4, 1, 2, 0xb0f8ff);

      // Crystal glow
      px(2, 2, 4, 4, 0x40c8ff, 0.12);
      px(6, 3, 4, 3, 0x40c8ff, 0.1);
    });

    // Woodcutting tree - detailed tree stump/harvestable
    this.createPixelTexture('resource_woodcutting', 12, 16, 1, (px) => {
      px(3, 15, 6, 1, 0x000000, 0.2);

      // Trunk
      px(4, 9, 4, 6, 0x5e3820);
      px(4, 9, 2, 6, 0x704828);
      px(6, 9, 2, 6, 0x4a2818);
      // Bark texture
      px(5, 10, 1, 1, 0x805838);
      px(4, 12, 1, 1, 0x483018);
      px(6, 11, 1, 1, 0x805838);
      px(5, 14, 1, 1, 0x483018);
      // Roots
      px(3, 14, 1, 2, 0x5e3820);
      px(8, 14, 1, 2, 0x5e3820);

      // Canopy - layered
      px(1, 6, 10, 4, 0x1a3818);
      px(2, 4, 8, 3, 0x1a3818);
      px(3, 3, 6, 2, 0x284828);
      // Canopy highlights
      px(2, 5, 4, 2, 0x489040);
      px(6, 4, 3, 2, 0x387030);
      px(4, 3, 3, 1, 0x58a848);
      // Light leaves
      px(3, 4, 2, 1, 0x68c058);
      px(7, 5, 2, 1, 0x306828);
    });

    // Farming resource - harvestable plants
    this.createPixelTexture('resource_farming', 10, 8, 1, (px) => {
      px(1, 7, 8, 1, 0x000000, 0.15);

      // Soil
      px(1, 6, 8, 2, 0x6a4820);
      px(2, 6, 6, 1, 0x7a5830);

      // Stems and leaves
      px(3, 2, 1, 5, 0x286020);
      px(6, 3, 1, 4, 0x286020);
      px(2, 3, 2, 2, 0x389030);
      px(5, 2, 2, 2, 0x48a840);
      px(7, 4, 2, 1, 0x389030);

      // Fruits/crops
      px(2, 2, 1, 1, 0xe04040); // tomato
      px(7, 3, 1, 1, 0xf0d040); // corn
      px(4, 1, 2, 2, 0xe88030); // pumpkin
      px(5, 1, 1, 1, 0xf09040);
    });
  }

  generateTileSprites() {
    // --- GRASS: Multiple green shades with tiny flowers ---
    this.createPixelTexture('tile_grass', 16, 16, 2, (px) => {
      // Base noise fill
      this._noiseFill(px, 0, 0, 16, 16, [
        0x4a9040, 0x4a9040, 0x4a9040,
        0x489038, 0x509848, 0x448838,
        0x3c8030, 0x58a050, 0x4a9040,
      ], 101);
      // Grass blade highlights
      px(2, 1, 1, 1, 0x68b858);
      px(7, 3, 1, 1, 0x68b858);
      px(12, 2, 1, 1, 0x60b050);
      px(4, 8, 1, 1, 0x68b858);
      px(10, 6, 1, 1, 0x68b858);
      px(14, 10, 1, 1, 0x60b050);
      px(1, 12, 1, 1, 0x68b858);
      px(9, 13, 1, 1, 0x68b858);
      // Dark grass patches
      px(5, 5, 2, 2, 0x307028);
      px(11, 11, 2, 2, 0x307028);
      // Tiny flowers
      px(3, 10, 1, 1, 0xe8d850);
      px(13, 4, 1, 1, 0xe06080);
      px(8, 14, 1, 1, 0xe8e8f0);
    });

    // --- DIRT: Cracked earth with pebbles ---
    this.createPixelTexture('tile_dirt', 16, 16, 2, (px) => {
      this._noiseFill(px, 0, 0, 16, 16, [
        0x987030, 0x987030, 0x907028,
        0xa08038, 0x886828, 0x987030,
        0x907028, 0xa88840,
      ], 202);
      // Crack lines
      px(3, 2, 1, 4, 0x685020, 0.6);
      px(4, 5, 4, 1, 0x685020, 0.6);
      px(8, 5, 1, 3, 0x685020, 0.6);
      px(10, 8, 4, 1, 0x685020, 0.5);
      px(11, 9, 1, 3, 0x685020, 0.5);
      px(2, 10, 3, 1, 0x685020, 0.5);
      px(6, 12, 1, 3, 0x685020, 0.4);
      // Pebbles
      px(1, 3, 1, 1, 0xb09848);
      px(12, 2, 1, 1, 0x786028);
      px(5, 9, 1, 1, 0xb09848);
      px(14, 11, 1, 1, 0x786028);
      px(9, 14, 1, 1, 0xb09848);
      // Highlight patches
      px(7, 1, 3, 2, 0xb89040);
      px(1, 7, 2, 3, 0xb89040);
    });

    // --- STONE: Brick/flagstone with mortar ---
    this.createPixelTexture('tile_stone', 16, 16, 2, (px) => {
      // Mortar base
      px(0, 0, 16, 16, 0x585858);
      // Bricks/stones
      px(0, 0, 7, 3, 0x808890);
      px(1, 0, 5, 2, 0x909aa0);
      px(8, 0, 8, 3, 0x707880);
      px(9, 0, 6, 2, 0x808890);

      px(0, 4, 5, 3, 0x707880);
      px(1, 4, 3, 2, 0x808890);
      px(6, 4, 5, 3, 0x888e98);
      px(7, 4, 3, 2, 0x98a0a8);
      px(12, 4, 4, 3, 0x788088);
      px(13, 4, 2, 2, 0x889098);

      px(0, 8, 7, 3, 0x889098);
      px(1, 8, 5, 2, 0x98a0a8);
      px(8, 8, 8, 3, 0x788088);
      px(9, 8, 6, 2, 0x889098);

      px(0, 12, 4, 4, 0x788088);
      px(1, 12, 2, 3, 0x889098);
      px(5, 12, 6, 4, 0x808890);
      px(6, 12, 4, 3, 0x909aa0);
      px(12, 12, 4, 4, 0x707880);
      px(13, 12, 2, 3, 0x808890);
    });

    // --- SAND: Dune patterns ---
    this.createPixelTexture('tile_sand', 16, 16, 2, (px) => {
      this._noiseFill(px, 0, 0, 16, 16, [
        0xd8b878, 0xd8b878, 0xd0b070,
        0xe0c080, 0xd8b878, 0xccaa68,
        0xe0c888, 0xd8b878,
      ], 303);
      // Wind lines
      px(2, 3, 5, 1, 0xe8d090, 0.5);
      px(8, 5, 6, 1, 0xccaa68, 0.5);
      px(1, 9, 4, 1, 0xe8d090, 0.4);
      px(9, 11, 5, 1, 0xccaa68, 0.4);
      px(3, 14, 6, 1, 0xe8d090, 0.3);
      // Small dune shadows
      px(6, 4, 3, 1, 0xc0a060, 0.3);
      px(11, 10, 3, 1, 0xc0a060, 0.3);
      // Specks
      px(4, 7, 1, 1, 0xf0e0a0);
      px(12, 8, 1, 1, 0xc8a060);
      px(7, 13, 1, 1, 0xf0e0a0);
    });

    // --- DARK: Corrupted ground with purple veins ---
    this.createPixelTexture('tile_dark', 16, 16, 2, (px) => {
      this._noiseFill(px, 0, 0, 16, 16, [
        0x382850, 0x382850, 0x302048,
        0x402860, 0x2a1838, 0x382850,
        0x342450, 0x3c2c58,
      ], 404);
      // Purple vein lines
      px(2, 1, 1, 3, 0x8050a0, 0.7);
      px(3, 3, 3, 1, 0x8050a0, 0.7);
      px(6, 3, 1, 4, 0x8050a0, 0.6);
      px(6, 7, 3, 1, 0x7048a0, 0.6);
      px(9, 6, 1, 5, 0x8050a0, 0.5);
      px(10, 10, 4, 1, 0x7048a0, 0.5);
      px(13, 8, 1, 4, 0x8050a0, 0.6);
      px(3, 9, 1, 3, 0x8050a0, 0.5);
      px(3, 12, 2, 1, 0x7048a0, 0.5);
      px(11, 12, 1, 3, 0x8050a0, 0.4);
      // Vein glow
      px(5, 2, 3, 3, 0xa060d0, 0.08);
      px(8, 6, 3, 3, 0xa060d0, 0.08);
      px(12, 9, 3, 3, 0xa060d0, 0.08);
      // Dark corruption spots
      px(0, 5, 2, 2, 0x1a1028);
      px(14, 13, 2, 2, 0x1a1028);
    });

    // --- CAVE: Uneven stone with stalactite shadows ---
    this.createPixelTexture('tile_cave', 16, 16, 2, (px) => {
      this._noiseFill(px, 0, 0, 16, 16, [
        0x484848, 0x484848, 0x505050,
        0x404040, 0x484848, 0x585858,
        0x383838, 0x484848,
      ], 505);
      // Stalactite shadows from above
      px(2, 0, 2, 3, 0x282828, 0.5);
      px(8, 0, 3, 4, 0x282828, 0.4);
      px(13, 0, 2, 2, 0x282828, 0.5);
      // Rocky texture variation
      px(1, 5, 3, 3, 0x606060);
      px(5, 8, 4, 3, 0x383838);
      px(10, 5, 3, 4, 0x606060);
      px(12, 10, 3, 3, 0x383838);
      // Moisture drops
      px(4, 3, 1, 1, 0x6898b8, 0.5);
      px(11, 7, 1, 1, 0x6898b8, 0.4);
      px(7, 12, 1, 1, 0x6898b8, 0.4);
      // Mineral glints
      px(3, 9, 1, 1, 0x909898);
      px(14, 3, 1, 1, 0x909898);
    });

    // --- TEMPLE: Ornate floor tiles ---
    this.createPixelTexture('tile_temple', 16, 16, 2, (px) => {
      // Base tile
      px(0, 0, 16, 16, 0x8a7868);
      // Border pattern
      px(0, 0, 16, 1, 0x706050);
      px(0, 15, 16, 1, 0x706050);
      px(0, 0, 1, 16, 0x706050);
      px(15, 0, 1, 16, 0x706050);
      // Inner border
      px(1, 1, 14, 1, 0x9a8878);
      px(1, 14, 14, 1, 0x9a8878);
      px(1, 1, 1, 14, 0x9a8878);
      px(14, 1, 1, 14, 0x9a8878);
      // Center diamond pattern
      px(7, 3, 2, 1, 0xb8a080);
      px(6, 4, 4, 1, 0xb8a080);
      px(5, 5, 6, 1, 0xb8a080);
      px(4, 6, 8, 1, 0xb8a080);
      px(4, 7, 8, 2, 0xc8b090);
      px(4, 9, 8, 1, 0xb8a080);
      px(5, 10, 6, 1, 0xb8a080);
      px(6, 11, 4, 1, 0xb8a080);
      px(7, 12, 2, 1, 0xb8a080);
      // Center gem
      px(7, 7, 2, 2, 0xc03030);
      px(7, 7, 1, 1, 0xe05050);
      // Corner accents
      px(2, 2, 2, 2, 0xc8a050);
      px(12, 2, 2, 2, 0xc8a050);
      px(2, 12, 2, 2, 0xc8a050);
      px(12, 12, 2, 2, 0xc8a050);
    });

    // --- WATER: Waves with depth ---
    this.createPixelTexture('tile_water', 16, 16, 2, (px) => {
      // Depth gradient
      px(0, 0, 16, 4, 0x2870b0);
      px(0, 4, 16, 4, 0x3080c0);
      px(0, 8, 16, 4, 0x2870b0);
      px(0, 12, 16, 4, 0x2060a0);
      // Wave crests
      px(1, 2, 4, 1, 0x60b0e8);
      px(8, 3, 5, 1, 0x60b0e8);
      px(3, 6, 5, 1, 0x68b8f0);
      px(10, 7, 4, 1, 0x68b8f0);
      px(0, 10, 4, 1, 0x60b0e8);
      px(7, 11, 6, 1, 0x60b0e8);
      px(2, 14, 5, 1, 0x5098d0);
      px(10, 15, 4, 1, 0x5098d0);
      // Sparkle reflections
      px(2, 2, 1, 1, 0xa0d8ff);
      px(10, 3, 1, 1, 0xc0e8ff);
      px(5, 6, 1, 1, 0xa0d8ff);
      px(12, 7, 1, 1, 0xc0e8ff);
      px(1, 10, 1, 1, 0xa0d8ff);
      px(9, 11, 1, 1, 0xc0e8ff);
      // Deep water shadows
      px(4, 4, 2, 1, 0x1858a0, 0.4);
      px(12, 9, 2, 1, 0x1858a0, 0.4);
      px(6, 13, 2, 1, 0x185098, 0.4);
    });
  }

  generatePropSprites() {
    // --- HOUSE: Medieval house with windows, door, chimney ---
    this.createPixelTexture('prop_house', 32, 32, 2, (px) => {
      px(4, 30, 24, 2, 0x000000, 0.18);

      // Chimney
      px(22, 4, 4, 8, 0x885040);
      px(23, 4, 2, 7, 0x986048);
      px(22, 4, 4, 1, 0x704030);
      // Smoke
      px(23, 2, 2, 2, 0xc0c0c0, 0.3);
      px(24, 1, 2, 2, 0xc0c0c0, 0.2);
      px(25, 0, 1, 1, 0xd0d0d0, 0.15);

      // Roof
      px(2, 8, 28, 3, 0x803020);
      px(4, 6, 24, 2, 0x984028);
      px(7, 4, 18, 2, 0xa84830);
      px(10, 3, 12, 1, 0xb85038);
      // Roof shading
      px(2, 8, 14, 3, 0x984028);
      px(16, 8, 14, 3, 0x702818);
      // Roof tiles hint
      px(5, 7, 2, 1, 0xb85038);
      px(9, 6, 2, 1, 0xb85038);
      px(15, 7, 2, 1, 0xb85038);
      px(20, 6, 2, 1, 0xb85038);
      px(25, 7, 2, 1, 0xb85038);

      // Walls
      px(4, 11, 24, 18, 0xd8c898);
      // Wall shading
      px(4, 11, 10, 16, 0xe0d0a8);
      px(18, 11, 10, 16, 0xc8b888);
      // Wall texture
      px(6, 13, 2, 1, 0xc0b088);
      px(12, 15, 2, 1, 0xc0b088);
      px(22, 17, 2, 1, 0xc0b088);
      px(8, 21, 2, 1, 0xc0b088);
      px(18, 23, 2, 1, 0xc0b088);

      // Door
      px(13, 20, 6, 9, 0x6a4020);
      px(14, 21, 4, 7, 0x805030);
      px(14, 21, 2, 6, 0x906040);
      // Door handle
      px(17, 24, 1, 1, 0xd8c060);
      // Door frame
      px(12, 19, 8, 1, 0x8a6838);
      px(12, 20, 1, 9, 0x8a6838);
      px(19, 20, 1, 9, 0x8a6838);
      // Doorstep
      px(12, 29, 8, 1, 0x908878);

      // Left window
      px(6, 14, 4, 4, 0x80b8e0);
      px(7, 15, 2, 2, 0xa0d0f0);
      px(6, 14, 4, 1, 0x705030); // frame top
      px(6, 18, 4, 1, 0x705030); // frame bottom
      px(6, 14, 1, 5, 0x705030); // frame left
      px(9, 14, 1, 5, 0x705030); // frame right
      px(8, 14, 1, 4, 0x605038); // center bar

      // Right window
      px(22, 14, 4, 4, 0x80b8e0);
      px(23, 15, 2, 2, 0xa0d0f0);
      px(22, 14, 4, 1, 0x705030);
      px(22, 18, 4, 1, 0x705030);
      px(22, 14, 1, 5, 0x705030);
      px(25, 14, 1, 5, 0x705030);
      px(24, 14, 1, 4, 0x605038);

      // Foundation
      px(3, 29, 26, 1, 0x707870);
    });

    // --- FORGE: Blacksmith workshop ---
    this.createPixelTexture('prop_forge', 32, 32, 2, (px) => {
      px(4, 30, 24, 2, 0x000000, 0.18);

      // Chimney/smokestack
      px(20, 2, 5, 10, 0x505860);
      px(21, 2, 3, 9, 0x606870);
      // Smoke
      px(21, 0, 3, 2, 0xa0a0a0, 0.25);
      px(22, 0, 2, 1, 0xc0c0c0, 0.18);

      // Roof - metal/slate
      px(2, 8, 28, 3, 0x505860);
      px(4, 6, 24, 2, 0x607080);
      px(7, 5, 18, 1, 0x708090);
      // Roof shading
      px(2, 8, 12, 3, 0x607080);

      // Walls - stone/dark
      px(4, 11, 24, 18, 0x787880);
      px(4, 11, 10, 16, 0x888890);
      px(18, 11, 10, 16, 0x686870);
      // Brick pattern
      px(6, 13, 4, 2, 0x6a6a72);
      px(14, 12, 4, 2, 0x6a6a72);
      px(10, 16, 4, 2, 0x6a6a72);
      px(20, 15, 4, 2, 0x6a6a72);

      // Forge opening with fire glow
      px(14, 18, 8, 8, 0x302020);
      px(15, 19, 6, 6, 0x401810);
      // Fire inside
      px(16, 21, 4, 4, 0xff6020);
      px(17, 21, 2, 3, 0xff9040);
      px(17, 22, 2, 1, 0xffcc60);
      // Fire glow on walls
      px(12, 18, 2, 8, 0xff6020, 0.12);
      px(22, 18, 2, 8, 0xff6020, 0.12);
      px(14, 16, 8, 2, 0xff6020, 0.08);

      // Anvil in front
      px(6, 24, 6, 4, 0x585860);
      px(7, 23, 4, 1, 0x686870);
      px(8, 22, 2, 1, 0x787880);
      px(6, 27, 2, 2, 0x484850);
      px(10, 27, 2, 2, 0x484850);

      // Bellows
      px(24, 20, 4, 6, 0x704828);
      px(25, 21, 2, 4, 0x805838);

      // Foundation
      px(3, 29, 26, 1, 0x484848);
    });

    // --- STORAGE: Warehouse/chest building ---
    this.createPixelTexture('prop_storage', 20, 20, 2, (px) => {
      px(2, 18, 16, 2, 0x000000, 0.18);

      // Large chest/storage crate
      px(2, 8, 16, 9, 0x7a5830);
      px(3, 9, 14, 7, 0x906838);
      // Wood grain
      px(3, 9, 6, 7, 0xa07848);
      px(11, 9, 6, 7, 0x805028);
      // Lid
      px(1, 7, 18, 2, 0x8a6838);
      px(2, 7, 16, 1, 0xa08048);
      // Metal bands
      px(2, 10, 16, 1, 0x606868);
      px(2, 14, 16, 1, 0x606868);
      // Lock
      px(9, 11, 2, 2, 0xd8b050);
      px(9, 11, 1, 1, 0xe8c060);
      // Corner rivets
      px(3, 9, 1, 1, 0x707878);
      px(16, 9, 1, 1, 0x707878);
      px(3, 15, 1, 1, 0x707878);
      px(16, 15, 1, 1, 0x707878);
      // Handles
      px(1, 12, 1, 2, 0x606868);
      px(18, 12, 1, 2, 0x606868);
    });

    // --- OAK TREE: Lush canopy with depth ---
    this.createPixelTexture('prop_tree_oak', 24, 32, 2, (px) => {
      px(6, 30, 12, 2, 0x000000, 0.18);

      // Trunk with bark detail
      px(10, 18, 4, 12, 0x5a3820);
      px(10, 18, 2, 12, 0x6a4828);
      px(12, 18, 2, 12, 0x4a2818);
      // Bark texture
      px(11, 20, 1, 1, 0x7a5838);
      px(10, 23, 1, 1, 0x483018);
      px(12, 22, 1, 1, 0x7a5838);
      px(11, 25, 1, 1, 0x483018);
      px(12, 27, 1, 1, 0x7a5838);
      // Roots
      px(9, 29, 2, 1, 0x5a3820);
      px(13, 29, 2, 1, 0x5a3820);
      // Branch stub
      px(8, 18, 2, 1, 0x5a3820);
      px(14, 19, 2, 1, 0x5a3820);

      // Canopy - multiple layers for depth
      // Back layer (darker)
      px(3, 10, 18, 10, 0x1c4018);
      // Mid layer
      px(2, 8, 20, 10, 0x286828);
      px(4, 6, 16, 4, 0x286828);
      // Front layer (lighter)
      px(4, 7, 16, 10, 0x389838);
      px(6, 5, 12, 4, 0x389838);
      // Highlight clusters
      px(5, 8, 4, 3, 0x48b048);
      px(12, 7, 5, 3, 0x48b048);
      px(8, 5, 4, 2, 0x58c058);
      px(15, 10, 3, 3, 0x48b048);
      px(4, 13, 3, 3, 0x48b048);
      // Deep shadow holes
      px(9, 10, 3, 2, 0x1c4018);
      px(6, 12, 2, 2, 0x1c4018);
      px(14, 13, 2, 2, 0x1c4018);
      // Light leaf tips
      px(5, 6, 1, 1, 0x68d060);
      px(10, 5, 1, 1, 0x68d060);
      px(16, 7, 1, 1, 0x68d060);
      px(3, 11, 1, 1, 0x68d060);
      px(19, 12, 1, 1, 0x68d060);
    });

    // --- PINE TREE: Layered branches ---
    this.createPixelTexture('prop_tree_pine', 20, 32, 2, (px) => {
      px(5, 30, 10, 2, 0x000000, 0.18);

      // Trunk
      px(9, 20, 2, 10, 0x5a3820);
      px(9, 20, 1, 10, 0x6a4828);
      px(10, 20, 1, 10, 0x4a2818);

      // Layer 1 (bottom, widest)
      px(2, 18, 16, 4, 0x1a4020);
      px(3, 18, 14, 3, 0x286028);
      px(4, 18, 5, 2, 0x348030);
      px(11, 19, 4, 2, 0x1a3818);

      // Layer 2
      px(3, 14, 14, 4, 0x1c4820);
      px(4, 14, 12, 3, 0x286828);
      px(5, 14, 4, 2, 0x388830);
      px(12, 15, 3, 2, 0x1c4018);

      // Layer 3
      px(4, 10, 12, 4, 0x1e5022);
      px(5, 10, 10, 3, 0x2a7028);
      px(6, 10, 3, 2, 0x389838);
      px(11, 11, 3, 2, 0x1e4818);

      // Layer 4
      px(5, 6, 10, 4, 0x205824);
      px(6, 6, 8, 3, 0x2c7830);
      px(7, 6, 3, 2, 0x38a038);

      // Layer 5 (top)
      px(7, 3, 6, 4, 0x226028);
      px(8, 3, 4, 3, 0x2e8030);
      px(9, 2, 2, 2, 0x38a038);

      // Top point
      px(9, 1, 2, 1, 0x389838);
      px(10, 0, 1, 1, 0x48b048);

      // Snow or light tips (optional bright accents)
      px(3, 18, 1, 1, 0x48b048);
      px(8, 14, 1, 1, 0x48b048);
      px(6, 10, 1, 1, 0x48b048);
      px(10, 6, 1, 1, 0x48b048);
    });

    // --- ROCK CLUSTER: Detailed boulders ---
    this.createPixelTexture('prop_rock_cluster', 16, 13, 2, (px) => {
      px(2, 12, 12, 1, 0x000000, 0.18);

      // Large rock
      px(4, 3, 8, 7, 0x687078);
      px(5, 3, 6, 6, 0x788088);
      px(5, 4, 3, 3, 0x909aa0);
      px(9, 5, 2, 3, 0x606870);
      // Rock texture
      px(6, 5, 1, 1, 0xa0a8b0);
      px(8, 7, 1, 1, 0x586068);

      // Medium rock (left)
      px(1, 6, 5, 5, 0x606870);
      px(2, 6, 3, 4, 0x708078);
      px(2, 7, 2, 2, 0x889088);

      // Small rock (right)
      px(11, 7, 4, 4, 0x586068);
      px(12, 7, 2, 3, 0x687078);
      px(12, 8, 1, 1, 0x808888);

      // Moss patches
      px(3, 9, 2, 1, 0x488040);
      px(7, 8, 1, 1, 0x488040);
      px(12, 10, 1, 1, 0x488040);
    });

    // --- CRYSTAL: Glowing crystal formation ---
    this.createPixelTexture('prop_crystal', 12, 16, 2, (px) => {
      px(2, 15, 8, 1, 0x000000, 0.18);

      // Crystal base rock
      px(3, 12, 6, 3, 0x505058);
      px(4, 12, 4, 2, 0x606068);

      // Main crystal shard (tall)
      px(5, 2, 3, 11, 0x30c8f0);
      px(5, 3, 2, 9, 0x50d8ff);
      px(5, 4, 1, 7, 0x80e8ff);
      // Crystal tip
      px(6, 1, 1, 2, 0xa0f0ff);

      // Secondary shard (left, shorter)
      px(3, 6, 2, 7, 0x28b0d8);
      px(3, 7, 1, 5, 0x48c8f0);

      // Secondary shard (right, medium)
      px(8, 4, 2, 9, 0x28b0d8);
      px(8, 5, 1, 7, 0x48c8f0);
      px(8, 4, 1, 2, 0x70e0ff);

      // Internal light refractions
      px(6, 6, 1, 1, 0xffffff, 0.7);
      px(5, 9, 1, 1, 0xffffff, 0.5);
      px(8, 7, 1, 1, 0xffffff, 0.5);

      // Ground glow
      px(2, 13, 8, 2, 0x30c8f0, 0.12);
      px(4, 12, 4, 1, 0x30c8f0, 0.15);
    });

    // --- RUIN PILLAR: Ancient crumbling column ---
    this.createPixelTexture('prop_ruin_pillar', 12, 20, 2, (px) => {
      px(2, 19, 8, 1, 0x000000, 0.18);

      // Base platform
      px(1, 17, 10, 2, 0x787880);
      px(2, 17, 8, 1, 0x888890);

      // Column shaft
      px(3, 4, 6, 13, 0x8a8e92);
      px(4, 4, 2, 13, 0xa0a4a8);
      px(6, 4, 2, 13, 0x787c82);
      // Column fluting
      px(3, 5, 1, 11, 0x707478);
      px(8, 5, 1, 11, 0x707478);
      // Weathering/cracks
      px(5, 8, 1, 3, 0x686c70);
      px(4, 12, 2, 1, 0x686c70);
      px(6, 6, 1, 2, 0x686c70);

      // Capital (top piece)
      px(2, 2, 8, 3, 0x909498);
      px(3, 2, 6, 2, 0xa8acb0);
      px(2, 1, 8, 1, 0x989ca0);
      // Capital scrollwork hint
      px(2, 3, 1, 1, 0xb0b4b8);
      px(9, 3, 1, 1, 0xb0b4b8);

      // Broken top (crumbled)
      px(7, 1, 2, 2, 0x787c82, 0.5);
      px(9, 2, 1, 1, 0x787c82, 0.3);

      // Moss/ivy
      px(3, 10, 1, 1, 0x488040);
      px(8, 7, 1, 2, 0x488040);
      px(4, 14, 1, 1, 0x488040);

      // Rubble at base
      px(0, 18, 2, 1, 0x787c82);
      px(10, 18, 2, 1, 0x707478);
      px(1, 18, 1, 1, 0x888c90);
    });

    // --- CACTUS: Desert cactus ---
    this.createPixelTexture('prop_cactus', 12, 16, 2, (px) => {
      px(2, 15, 8, 1, 0x000000, 0.15);

      // Main body
      px(4, 3, 4, 11, 0x2a7830);
      px(5, 3, 2, 11, 0x389838);
      px(4, 3, 1, 10, 0x1e6020);
      px(7, 3, 1, 10, 0x1e6020);
      // Highlight stripe
      px(5, 4, 1, 8, 0x48b048);

      // Left arm
      px(2, 6, 2, 2, 0x2a7830);
      px(1, 5, 2, 4, 0x2a7830);
      px(1, 5, 1, 3, 0x389838);
      px(1, 4, 1, 1, 0x2a7830);

      // Right arm
      px(8, 8, 2, 2, 0x2a7830);
      px(9, 7, 2, 4, 0x2a7830);
      px(10, 7, 1, 3, 0x389838);
      px(10, 6, 1, 1, 0x2a7830);

      // Spines (small dots)
      px(4, 4, 1, 1, 0x88c880, 0.6);
      px(7, 5, 1, 1, 0x88c880, 0.6);
      px(4, 7, 1, 1, 0x88c880, 0.6);
      px(7, 9, 1, 1, 0x88c880, 0.6);
      px(4, 11, 1, 1, 0x88c880, 0.6);
      px(7, 12, 1, 1, 0x88c880, 0.6);
      px(1, 6, 1, 1, 0x88c880, 0.6);
      px(10, 8, 1, 1, 0x88c880, 0.6);

      // Small flower on top
      px(5, 2, 2, 1, 0xe85080);
      px(5, 2, 1, 1, 0xf080a0);
      px(6, 1, 1, 1, 0xf8a0c0);
    });

    // --- BRAZIER: Fire brazier ---
    this.createPixelTexture('prop_brazier', 10, 14, 2, (px) => {
      px(1, 13, 8, 1, 0x000000, 0.18);

      // Stand / legs
      px(2, 10, 1, 3, 0x685030);
      px(7, 10, 1, 3, 0x685030);
      px(3, 12, 4, 1, 0x584020);

      // Bowl
      px(1, 7, 8, 4, 0x6a4828);
      px(2, 7, 6, 3, 0x805838);
      px(2, 7, 3, 2, 0x906848);
      // Bowl rim
      px(1, 6, 8, 1, 0x907048);
      px(0, 7, 1, 1, 0x805838);
      px(9, 7, 1, 1, 0x805838);

      // Fire - multiple layers
      px(2, 3, 6, 4, 0xe06020);
      px(3, 2, 4, 4, 0xf08030);
      px(3, 3, 4, 2, 0xff9840);
      px(4, 1, 2, 3, 0xffc060);
      px(4, 2, 2, 1, 0xffe890);
      // Fire tips
      px(3, 1, 1, 1, 0xf09040, 0.8);
      px(6, 0, 1, 1, 0xff9840, 0.7);
      px(5, 0, 1, 1, 0xffe080, 0.6);
      // Sparks
      px(2, 0, 1, 1, 0xffc060, 0.5);
      px(7, 1, 1, 1, 0xffc060, 0.4);

      // Fire glow on bowl
      px(2, 6, 6, 2, 0xff6020, 0.15);
    });

    // --- CART: Wooden cart ---
    this.createPixelTexture('prop_cart', 14, 15, 2, (px) => {
      px(2, 14, 10, 1, 0x000000, 0.18);

      // Cart bed
      px(2, 6, 10, 4, 0x8a6838);
      px(3, 6, 8, 3, 0x9a7848);
      // Left side
      px(3, 6, 3, 3, 0xa88850);
      // Right side dark
      px(8, 7, 3, 2, 0x7a5828);

      // Cart walls
      px(2, 4, 1, 6, 0x7a5828);
      px(11, 4, 1, 6, 0x7a5828);
      px(2, 4, 10, 2, 0x8a6838);
      px(3, 4, 8, 1, 0x9a7848);

      // Goods in cart (visible above sides)
      px(4, 3, 3, 2, 0xb89848); // sack
      px(5, 3, 1, 1, 0xc8a858);
      px(8, 3, 2, 2, 0x606868); // metal
      px(8, 3, 1, 1, 0x788088);

      // Handles/shafts
      px(0, 8, 3, 1, 0x6a4828);
      px(11, 8, 3, 1, 0x6a4828);

      // Wheels
      px(1, 10, 3, 3, 0x4a3018);
      px(2, 10, 1, 3, 0x5a3820);
      px(1, 11, 3, 1, 0x5a3820);
      px(2, 11, 1, 1, 0x706048); // hub

      px(10, 10, 3, 3, 0x4a3018);
      px(11, 10, 1, 3, 0x5a3820);
      px(10, 11, 3, 1, 0x5a3820);
      px(11, 11, 1, 1, 0x706048); // hub

      // Metal reinforcement
      px(2, 9, 10, 1, 0x606868);
      px(2, 9, 2, 1, 0x788088);
    });
  }

  generateMiscSprites() {
    // --- PORTAL: Swirling energy with sparkles ---
    this.createPixelTexture('portal', 16, 16, 1, (px) => {
      // Outer glow
      px(2, 1, 12, 14, 0x1090c0, 0.15);

      // Outer ring
      px(5, 0, 6, 1, 0x40b0e0);
      px(3, 1, 10, 1, 0x30a0d0);
      px(2, 2, 2, 2, 0x2890c0);
      px(12, 2, 2, 2, 0x2890c0);
      px(1, 4, 2, 8, 0x2890c0);
      px(13, 4, 2, 8, 0x2890c0);
      px(2, 12, 2, 2, 0x2890c0);
      px(12, 12, 2, 2, 0x2890c0);
      px(3, 14, 10, 1, 0x30a0d0);
      px(5, 15, 6, 1, 0x40b0e0);

      // Mid ring
      px(4, 2, 8, 1, 0x50c0f0);
      px(3, 3, 2, 2, 0x48b8e8);
      px(11, 3, 2, 2, 0x48b8e8);
      px(3, 11, 2, 2, 0x48b8e8);
      px(11, 11, 2, 2, 0x48b8e8);
      px(4, 13, 8, 1, 0x50c0f0);

      // Inner vortex
      px(5, 4, 6, 8, 0x68d8ff);
      px(6, 5, 4, 6, 0x90e8ff);
      px(7, 6, 2, 4, 0xc8f8ff);

      // Swirl pattern
      px(5, 5, 2, 1, 0x40b0e0);
      px(9, 4, 2, 1, 0x40b0e0);
      px(10, 6, 1, 2, 0x40b0e0);
      px(9, 10, 2, 1, 0x40b0e0);
      px(5, 11, 2, 1, 0x40b0e0);
      px(4, 8, 1, 2, 0x40b0e0);

      // Center bright spot
      px(7, 7, 2, 2, 0xffffff, 0.8);

      // Sparkle pixels
      px(4, 1, 1, 1, 0xffffff, 0.9);
      px(11, 2, 1, 1, 0xffffff, 0.8);
      px(2, 6, 1, 1, 0xffffff, 0.7);
      px(13, 9, 1, 1, 0xffffff, 0.8);
      px(4, 13, 1, 1, 0xffffff, 0.7);
      px(11, 14, 1, 1, 0xffffff, 0.6);
      px(1, 3, 1, 1, 0xa0e0ff, 0.5);
      px(14, 12, 1, 1, 0xa0e0ff, 0.5);
    });

    // --- INTERACT ICON: Exclamation mark ---
    this.createPixelTexture('interact_icon', 8, 8, 1, (px) => {
      // Glow behind
      px(2, 0, 4, 8, 0xffd060, 0.15);

      // Exclamation body
      px(3, 0, 2, 5, 0xffd060);
      px(3, 1, 2, 3, 0xffe890);
      px(3, 0, 1, 4, 0xffefb0);

      // Exclamation dot
      px(3, 6, 2, 1, 0xffd060);
      px(3, 6, 1, 1, 0xffe890);

      // Top highlight
      px(3, 0, 2, 1, 0xfffff0);
    });
  }
}
