import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    this.generatePlayerSprites();
    this.generateNpcSprites();
    this.generateMobSprites();
    this.generateResourceSprites();
    this.generateTileSprites();
    this.generatePropSprites();
    this.generateMiscSprites();

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

  drawHumanoidBase(px, palette) {
    const p = palette;

    px(4, 23, 8, 1, 0x000000, 0.25);

    px(4, 1, 8, 1, p.outline);
    px(3, 2, 10, 4, p.outline);
    px(4, 6, 8, 2, p.outline);
    px(5, 2, 6, 5, p.skin);
    px(6, 4, 1, 1, p.eye);
    px(9, 4, 1, 1, p.eye);
    px(7, 6, 2, 1, p.skinDark);

    px(7, 8, 2, 1, p.skinDark);

    px(2, 9, 12, 1, p.outline);
    px(1, 10, 2, 6, p.outline);
    px(13, 10, 2, 6, p.outline);
    px(3, 10, 10, 8, p.outline);

    px(4, 10, 8, 7, p.torso);
    px(4, 11, 3, 5, p.torsoShadow);
    px(8, 11, 3, 5, p.torsoLight);
    px(4, 15, 8, 1, p.belt);
    px(5, 16, 6, 1, p.accent);

    px(2, 10, 1, 4, p.sleeve);
    px(2, 14, 1, 2, p.skinDark);
    px(12, 10, 1, 4, p.sleeveLight);
    px(12, 14, 1, 2, p.skinDark);

    px(4, 18, 3, 1, p.outline);
    px(9, 18, 3, 1, p.outline);
    px(4, 19, 3, 4, p.outline);
    px(9, 19, 3, 4, p.outline);
    px(5, 19, 1, 3, p.legs);
    px(10, 19, 1, 3, p.legsLight);
    px(5, 22, 2, 1, p.boots);
    px(9, 22, 2, 1, p.boots);
  }

  drawPlayerVariant(px, type) {
    const palettes = {
      warrior: {
        outline: 0x1b1110,
        skin: 0xe2b48a,
        skinDark: 0xb88760,
        eye: 0x2d1f1b,
        torso: 0x6f3f2c,
        torsoShadow: 0x4d281b,
        torsoLight: 0x92614c,
        sleeve: 0x7d4b34,
        sleeveLight: 0xa06a50,
        belt: 0xc29b3c,
        accent: 0xb33a2b,
        legs: 0x445166,
        legsLight: 0x60718d,
        boots: 0x352319,
      },
      ninja: {
        outline: 0x110d17,
        skin: 0xd8c0aa,
        skinDark: 0xa4846a,
        eye: 0xe4e9ff,
        torso: 0x322545,
        torsoShadow: 0x21172f,
        torsoLight: 0x4d3b67,
        sleeve: 0x2b213c,
        sleeveLight: 0x564576,
        belt: 0xc4a64f,
        accent: 0x7a1f2a,
        legs: 0x2c2b3f,
        legsLight: 0x505072,
        boots: 0x16131e,
      },
      sura: {
        outline: 0x160b12,
        skin: 0xcc9a84,
        skinDark: 0x9c6a56,
        eye: 0xefe2da,
        torso: 0x50212a,
        torsoShadow: 0x331017,
        torsoLight: 0x723540,
        sleeve: 0x431a23,
        sleeveLight: 0x7b2e3b,
        belt: 0x9b7b33,
        accent: 0x4ec4ff,
        legs: 0x2f2230,
        legsLight: 0x564057,
        boots: 0x201219,
      },
      shaman: {
        outline: 0x10161e,
        skin: 0xe5c1a1,
        skinDark: 0xb68e74,
        eye: 0x2b2b35,
        torso: 0x285578,
        torsoShadow: 0x17384f,
        torsoLight: 0x3e7299,
        sleeve: 0x245273,
        sleeveLight: 0x5690b8,
        belt: 0xcf9e48,
        accent: 0xebd97b,
        legs: 0x4b3c73,
        legsLight: 0x70619b,
        boots: 0x2b203a,
      },
    };

    const variant = palettes[type];
    this.drawHumanoidBase(px, variant);

    if (type === 'warrior') {
      px(4, 1, 8, 2, 0x8f8b89);
      px(3, 3, 2, 2, 0x8f8b89);
      px(11, 3, 2, 2, 0x8f8b89);
      px(3, 9, 2, 2, 0xc7c2bc);
      px(11, 9, 2, 2, 0xc7c2bc);
      px(6, 11, 4, 2, 0xb8b2ae);
      px(9, 7, 2, 3, 0xb33a2b);
      px(2, 16, 1, 5, 0x8f8b89);
      px(2, 18, 1, 1, 0xd8a94d);
    } else if (type === 'ninja') {
      px(4, 1, 8, 3, 0x20172d);
      px(3, 3, 10, 2, 0x20172d);
      px(5, 5, 6, 2, 0x16111f);
      px(5, 6, 6, 1, 0x7a1f2a);
      px(4, 9, 8, 1, 0x7a1f2a);
      px(3, 16, 10, 1, 0x20172d);
      px(11, 12, 2, 5, 0xc4a64f);
    } else if (type === 'sura') {
      px(4, 1, 8, 2, 0x2b0c14);
      px(3, 9, 10, 1, 0x2b0c14);
      px(3, 10, 1, 8, 0x18283c);
      px(12, 10, 2, 4, 0x4ec4ff);
      px(10, 11, 2, 3, 0x4ec4ff);
      px(5, 13, 2, 1, 0x9ddfff);
      px(8, 13, 2, 1, 0x9ddfff);
    } else if (type === 'shaman') {
      px(4, 1, 8, 2, 0xc7a15b);
      px(3, 3, 10, 1, 0x8a5d29);
      px(4, 17, 8, 4, 0x285578);
      px(5, 18, 6, 2, 0x3e7299);
      px(12, 10, 1, 8, 0x8a5d29);
      px(12, 10, 1, 2, 0xead37a);
      px(7, 12, 2, 2, 0xebd97b);
    }
  }

  drawNpcVariant(px, type) {
    const palettes = {
      shop: {
        outline: 0x17120f,
        skin: 0xdfb88f,
        skinDark: 0xaf845d,
        eye: 0x251d18,
        torso: 0x476b30,
        torsoShadow: 0x2d451e,
        torsoLight: 0x6f934d,
        sleeve: 0x3f5f2a,
        sleeveLight: 0x7ea85c,
        belt: 0xd6b25e,
        accent: 0x8a4d22,
        legs: 0x6b513b,
        legsLight: 0x917159,
        boots: 0x332419,
      },
      blacksmith: {
        outline: 0x13100d,
        skin: 0xd8af8a,
        skinDark: 0xac7f5d,
        eye: 0x241d18,
        torso: 0x5e5f64,
        torsoShadow: 0x3b3d41,
        torsoLight: 0x7f8288,
        sleeve: 0x4b4e53,
        sleeveLight: 0x8d8f94,
        belt: 0xbd8d3f,
        accent: 0xff9a35,
        legs: 0x3c3b43,
        legsLight: 0x5f5c67,
        boots: 0x231d18,
      },
      healer: {
        outline: 0x17121a,
        skin: 0xe3c0a2,
        skinDark: 0xb98d74,
        eye: 0x2d2230,
        torso: 0xe5dfe8,
        torsoShadow: 0xb7afbc,
        torsoLight: 0xf7f1f9,
        sleeve: 0xdad1de,
        sleeveLight: 0xf7f1f9,
        belt: 0xd2a14a,
        accent: 0xd54b63,
        legs: 0xcabfd1,
        legsLight: 0xf1e7f4,
        boots: 0x5b4e65,
      },
      trainer: {
        outline: 0x16120f,
        skin: 0xdab48c,
        skinDark: 0xa57c57,
        eye: 0x231b16,
        torso: 0x887530,
        torsoShadow: 0x5c4d1d,
        torsoLight: 0xb29a4d,
        sleeve: 0x6f5e24,
        sleeveLight: 0xb59b46,
        belt: 0xd5bf63,
        accent: 0xb2362c,
        legs: 0x4a4f5e,
        legsLight: 0x6b748a,
        boots: 0x291d16,
      },
      material: {
        outline: 0x17130f,
        skin: 0xdcb893,
        skinDark: 0xac8361,
        eye: 0x251d17,
        torso: 0x7d5735,
        torsoShadow: 0x5c3c22,
        torsoLight: 0xa97d55,
        sleeve: 0x6d4b2d,
        sleeveLight: 0xb08560,
        belt: 0xd2b365,
        accent: 0x4b8b51,
        legs: 0x6a523d,
        legsLight: 0x947458,
        boots: 0x322218,
      },
      lifeskill: {
        outline: 0x12140c,
        skin: 0xe2bf99,
        skinDark: 0xb48c69,
        eye: 0x212218,
        torso: 0x2f7a66,
        torsoShadow: 0x1c5546,
        torsoLight: 0x4c9b84,
        sleeve: 0x296a57,
        sleeveLight: 0x5cad92,
        belt: 0xd6b25f,
        accent: 0x7bbd47,
        legs: 0x535f48,
        legsLight: 0x7f8f70,
        boots: 0x262b20,
      },
      storage: {
        outline: 0x101112,
        skin: 0xdcbc95,
        skinDark: 0xae855f,
        eye: 0x252628,
        torso: 0x73808a,
        torsoShadow: 0x4d5760,
        torsoLight: 0x98a3ab,
        sleeve: 0x657078,
        sleeveLight: 0xa7b0b7,
        belt: 0xd5b45f,
        accent: 0xbcc7d1,
        legs: 0x48515a,
        legsLight: 0x6f7881,
        boots: 0x202329,
      },
    };

    const variant = palettes[type];
    this.drawHumanoidBase(px, variant);

    if (type === 'shop') {
      px(4, 1, 8, 2, 0x8a4d22);
      px(5, 17, 6, 2, 0xd6b25e);
      px(11, 12, 2, 4, 0x8a4d22);
    } else if (type === 'blacksmith') {
      px(4, 1, 8, 2, 0x3f3f45);
      px(3, 9, 10, 2, 0x8d8f94);
      px(12, 12, 1, 5, 0x8f8b89);
      px(11, 12, 2, 2, 0xff9a35);
    } else if (type === 'healer') {
      px(4, 1, 8, 2, 0xd54b63);
      px(6, 11, 1, 4, 0xd54b63);
      px(8, 12, 3, 1, 0xd54b63);
    } else if (type === 'trainer') {
      px(4, 1, 8, 2, 0x6b1d19);
      px(3, 9, 2, 2, 0xcfc8bb);
      px(11, 9, 2, 2, 0xcfc8bb);
      px(12, 10, 1, 8, 0xb2362c);
    } else if (type === 'material') {
      px(4, 1, 8, 3, 0x5c3c22);
      px(12, 10, 1, 6, 0x4b8b51);
      px(10, 15, 3, 2, 0x7d5735);
    } else if (type === 'lifeskill') {
      px(3, 1, 10, 2, 0xcaa25c);
      px(4, 3, 8, 1, 0x8a6a33);
      px(5, 17, 6, 1, 0x7bbd47);
      px(12, 10, 1, 8, 0x8a6a33);
    } else if (type === 'storage') {
      px(4, 1, 8, 2, 0xbcc7d1);
      px(11, 11, 2, 4, 0xd5b45f);
      px(11, 15, 2, 1, 0xeee2b6);
    }
  }

  generatePlayerSprites() {
    const variants = ['warrior', 'ninja', 'sura', 'shaman'];

    variants.forEach((variant) => {
      this.createPixelTexture(`player_${variant}`, 16, 24, 2, (px) => {
        this.drawPlayerVariant(px, variant);
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
      this.createPixelTexture(variant.key, 16, 24, 2, (px) => {
        this.drawNpcVariant(px, variant.type);
      });
    });
  }

  generateMobSprites() {
    this.createPixelTexture('mob_normal', 12, 12, 2, (px) => {
      px(2, 11, 8, 1, 0x000000, 0.25);
      px(2, 4, 8, 1, 0x1f1511);
      px(1, 5, 10, 4, 0x1f1511);
      px(2, 9, 8, 1, 0x1f1511);
      px(3, 4, 6, 5, 0x8c7b6d);
      px(3, 5, 2, 2, 0xa89a8f);
      px(7, 5, 2, 2, 0x706255);
      px(2, 3, 2, 2, 0x5d5147);
      px(8, 3, 2, 2, 0x5d5147);
      px(4, 6, 1, 1, 0xff5c5c);
      px(7, 6, 1, 1, 0xff5c5c);
      px(5, 8, 2, 1, 0x5d5147);
      px(2, 9, 1, 2, 0x3f3129);
      px(9, 9, 1, 2, 0x3f3129);
    });

    this.createPixelTexture('mob_aggressive', 14, 14, 2, (px) => {
      px(2, 13, 10, 1, 0x000000, 0.25);
      px(3, 3, 8, 1, 0x24090a);
      px(2, 4, 10, 6, 0x24090a);
      px(3, 10, 8, 2, 0x24090a);
      px(4, 4, 6, 7, 0xb53333);
      px(4, 5, 2, 2, 0xd86161);
      px(8, 5, 2, 2, 0x8f2020);
      px(4, 1, 2, 3, 0xffd46b);
      px(8, 1, 2, 3, 0xffd46b);
      px(5, 6, 1, 1, 0xfff0d6);
      px(8, 6, 1, 1, 0xfff0d6);
      px(5, 8, 4, 1, 0x601416);
      px(2, 10, 2, 2, 0x5c1616);
      px(10, 10, 2, 2, 0x5c1616);
    });

    this.createPixelTexture('mob_elite', 16, 16, 2, (px) => {
      px(3, 15, 10, 1, 0x000000, 0.25);
      px(4, 1, 8, 2, 0x1a2330);
      px(3, 3, 10, 8, 0x1a2330);
      px(4, 11, 8, 2, 0x1a2330);
      px(5, 3, 6, 9, 0x5a6b83);
      px(5, 4, 2, 3, 0x7f94b2);
      px(8, 4, 2, 3, 0x42526a);
      px(4, 0, 2, 2, 0xd5c46d);
      px(7, 0, 2, 2, 0xd5c46d);
      px(10, 0, 2, 2, 0xd5c46d);
      px(6, 6, 1, 1, 0x9ee7ff);
      px(9, 6, 1, 1, 0x9ee7ff);
      px(6, 9, 4, 1, 0x243447);
      px(3, 12, 2, 2, 0x314150);
      px(11, 12, 2, 2, 0x314150);
    });

    this.createPixelTexture('mob_boss', 24, 24, 2, (px) => {
      px(5, 23, 14, 1, 0x000000, 0.3);
      px(7, 2, 10, 2, 0x2b0a0a);
      px(5, 4, 14, 10, 0x2b0a0a);
      px(6, 14, 12, 4, 0x2b0a0a);
      px(7, 4, 10, 13, 0x7e1d1d);
      px(7, 5, 4, 4, 0xb93b2f);
      px(12, 5, 4, 4, 0x591313);
      px(4, 5, 2, 6, 0x4d0d0d);
      px(18, 5, 2, 6, 0x4d0d0d);
      px(7, 0, 3, 4, 0xffd46b);
      px(10, 1, 4, 3, 0xffe7a3);
      px(14, 0, 3, 4, 0xffd46b);
      px(9, 8, 2, 2, 0xfff2d9);
      px(13, 8, 2, 2, 0xfff2d9);
      px(10, 12, 4, 2, 0x420909);
      px(9, 16, 2, 4, 0x3d1111);
      px(13, 16, 2, 4, 0x3d1111);
      px(7, 18, 10, 2, 0xd3b754);
    });
  }

  generateResourceSprites() {
    this.createPixelTexture('resource_mining', 12, 12, 2, (px) => {
      px(2, 11, 8, 1, 0x000000, 0.2);
      px(2, 4, 8, 1, 0x2a2a2a);
      px(1, 5, 10, 5, 0x2a2a2a);
      px(2, 10, 8, 1, 0x2a2a2a);
      px(3, 5, 6, 5, 0x6f747b);
      px(3, 6, 2, 2, 0x969ea8);
      px(7, 6, 2, 2, 0x515962);
      px(4, 4, 2, 2, 0x5fd1ff);
      px(7, 4, 1, 2, 0xbaf2ff);
      px(5, 8, 2, 1, 0xcad2da);
    });

    this.createPixelTexture('resource_woodcutting', 12, 16, 2, (px) => {
      px(3, 15, 6, 1, 0x000000, 0.2);
      px(5, 9, 2, 6, 0x5e3d24);
      px(4, 10, 1, 4, 0x7b5435);
      px(7, 10, 1, 4, 0x3e2717);
      px(3, 3, 6, 2, 0x1a3115);
      px(2, 5, 8, 2, 0x1a3115);
      px(1, 7, 10, 3, 0x1a3115);
      px(2, 8, 8, 3, 0x3f7e34);
      px(3, 5, 2, 2, 0x5faa4b);
      px(7, 6, 2, 2, 0x2d6126);
      px(5, 4, 2, 2, 0x78c764);
    });

    this.createPixelTexture('resource_farming', 10, 8, 2, (px) => {
      px(1, 7, 8, 1, 0x000000, 0.2);
      px(2, 4, 6, 1, 0x365a1f);
      px(1, 5, 8, 2, 0x365a1f);
      px(2, 5, 2, 1, 0x58a33f);
      px(5, 4, 2, 2, 0x7ecb58);
      px(3, 3, 1, 2, 0xe34b4b);
      px(6, 3, 1, 2, 0xffd66b);
    });
  }

  generateTileSprites() {
    const makeTile = (key, base, painter) => {
      this.createPixelTexture(key, 16, 16, 2, (px) => {
        px(0, 0, 16, 16, base);
        painter(px);
      });
    };

    makeTile('tile_grass', 0x4b9147, (px) => {
      px(1, 2, 3, 2, 0x63ac5d);
      px(5, 5, 2, 4, 0x2f6b33);
      px(10, 3, 3, 2, 0x63ac5d);
      px(12, 9, 2, 3, 0x2f6b33);
      px(3, 12, 2, 2, 0xdcc95d);
      px(9, 11, 2, 2, 0x63ac5d);
      px(0, 0, 16, 1, 0x2c5e2c, 0.35);
      px(0, 15, 16, 1, 0x7bc975, 0.25);
    });

    makeTile('tile_dirt', 0x9a7331, (px) => {
      px(1, 3, 6, 2, 0xb98b43);
      px(8, 5, 6, 2, 0x7b5822);
      px(4, 10, 8, 2, 0xb98b43);
      px(2, 12, 3, 2, 0x6c4c1d);
      px(11, 12, 3, 1, 0xc49a54);
      px(0, 0, 16, 1, 0x6c4c1d, 0.35);
    });

    makeTile('tile_stone', 0x7f858b, (px) => {
      px(1, 1, 6, 5, 0xa0a7ad);
      px(8, 2, 7, 4, 0x6a7178);
      px(2, 7, 5, 6, 0x6a7178);
      px(8, 8, 6, 5, 0x98a0a8);
      px(1, 6, 14, 1, 0x495057);
      px(7, 1, 1, 12, 0x495057);
    });

    makeTile('tile_sand', 0xd9bb81, (px) => {
      px(2, 3, 6, 2, 0xebcf95);
      px(9, 5, 5, 2, 0xcda86a);
      px(4, 10, 8, 2, 0xebcf95);
      px(1, 13, 5, 1, 0xcda86a);
      px(10, 12, 4, 1, 0xbe9a60);
    });

    makeTile('tile_dark', 0x3c2c57, (px) => {
      px(1, 2, 4, 2, 0x52406f);
      px(6, 4, 2, 6, 0x24173a);
      px(10, 3, 4, 2, 0x6a5a86);
      px(11, 9, 2, 4, 0x24173a);
      px(3, 12, 3, 2, 0x5d4f79);
    });

    makeTile('tile_cave', 0x4a4a4a, (px) => {
      px(2, 2, 4, 3, 0x5f5f5f);
      px(9, 3, 5, 3, 0x343434);
      px(4, 8, 8, 4, 0x656565);
      px(2, 12, 5, 2, 0x2a2a2a);
      px(10, 11, 4, 2, 0x3b3b3b);
      px(1, 6, 14, 1, 0x232323);
    });

    makeTile('tile_temple', 0x6d2a2a, (px) => {
      px(2, 1, 12, 2, 0x938b80);
      px(2, 4, 3, 8, 0x8b8379);
      px(6, 4, 4, 8, 0x726b63);
      px(11, 4, 3, 8, 0x8b8379);
      px(2, 13, 12, 2, 0x938b80);
    });

    makeTile('tile_water', 0x347fb7, (px) => {
      px(1, 3, 5, 1, 0x63b7f3);
      px(7, 4, 6, 1, 0x63b7f3);
      px(2, 8, 5, 1, 0x1d5d90);
      px(8, 9, 5, 1, 0x63b7f3);
      px(1, 12, 6, 1, 0x63b7f3);
      px(9, 13, 4, 1, 0x1d5d90);
    });
  }

  generatePropSprites() {
    this.createPixelTexture('prop_house', 24, 24, 4, (px) => {
      px(4, 22, 16, 1, 0x000000, 0.2);
      px(3, 8, 18, 2, 0x5d2a19);
      px(5, 6, 14, 2, 0x7a3c21);
      px(8, 4, 8, 2, 0x9b5b33);
      px(5, 10, 14, 9, 0xd4c29c);
      px(6, 11, 5, 7, 0xe6d6b0);
      px(14, 11, 4, 7, 0xc7b48f);
      px(10, 13, 4, 6, 0x6a3b21);
      px(7, 13, 2, 3, 0x87c2ef);
      px(15, 13, 2, 3, 0x87c2ef);
      px(9, 18, 6, 1, 0x8d6d40);
    });

    this.createPixelTexture('prop_forge', 24, 24, 4, (px) => {
      px(4, 22, 16, 1, 0x000000, 0.2);
      px(4, 9, 16, 2, 0x4f5964);
      px(6, 7, 12, 2, 0x6f7882);
      px(8, 5, 8, 2, 0x8f96a0);
      px(6, 11, 12, 8, 0x7d848b);
      px(7, 12, 4, 6, 0xa3abb3);
      px(12, 12, 4, 6, 0x626b74);
      px(2, 6, 3, 12, 0x30343a);
      px(13, 13, 3, 4, 0xff9a35);
      px(12, 14, 5, 2, 0xffc161);
    });

    this.createPixelTexture('prop_storage', 20, 20, 4, (px) => {
      px(2, 18, 16, 1, 0x000000, 0.2);
      px(2, 8, 16, 8, 0x7b5533);
      px(3, 9, 14, 6, 0x9d7144);
      px(4, 6, 12, 2, 0xc49a54);
      px(8, 10, 4, 5, 0x4a2e19);
      px(6, 12, 1, 2, 0xe7d48a);
      px(13, 12, 1, 2, 0xe7d48a);
    });

    this.createPixelTexture('prop_tree_oak', 18, 24, 4, (px) => {
      px(4, 23, 10, 1, 0x000000, 0.2);
      px(5, 14, 8, 8, 0x356d2f);
      px(3, 10, 12, 6, 0x2c5b28);
      px(4, 7, 10, 5, 0x478d3d);
      px(6, 5, 6, 3, 0x6eb45e);
      px(8, 15, 2, 7, 0x6d4628);
      px(7, 16, 1, 5, 0x8b5b36);
    });

    this.createPixelTexture('prop_tree_pine', 16, 24, 4, (px) => {
      px(4, 23, 8, 1, 0x000000, 0.2);
      px(7, 17, 2, 5, 0x6b4328);
      px(4, 14, 8, 4, 0x1d4c1d);
      px(3, 10, 10, 5, 0x276126);
      px(2, 6, 12, 5, 0x348034);
      px(4, 2, 8, 5, 0x4fa34f);
    });

    this.createPixelTexture('prop_rock_cluster', 16, 13, 4, (px) => {
      px(2, 12, 12, 1, 0x000000, 0.18);
      px(1, 6, 5, 4, 0x5b6670);
      px(4, 4, 4, 5, 0x7e8a95);
      px(8, 5, 6, 4, 0x6b7680);
      px(5, 6, 2, 2, 0xb7c0c7);
      px(10, 6, 2, 1, 0x9099a3);
    });

    this.createPixelTexture('prop_crystal', 12, 16, 4, (px) => {
      px(2, 15, 8, 1, 0x000000, 0.18);
      px(5, 2, 2, 10, 0x35d9ff);
      px(4, 4, 1, 7, 0x00b7ff);
      px(7, 4, 2, 8, 0x69eaff);
      px(6, 3, 1, 4, 0xbaf7ff);
      px(4, 12, 4, 2, 0x0aa0ce);
    });

    this.createPixelTexture('prop_ruin_pillar', 12, 20, 4, (px) => {
      px(2, 19, 8, 1, 0x000000, 0.18);
      px(3, 2, 6, 14, 0x8a8d92);
      px(4, 3, 2, 12, 0xb3b8bf);
      px(2, 1, 8, 2, 0xa2a7ae);
      px(2, 16, 8, 2, 0x777c83);
      px(5, 8, 1, 2, 0x62666d);
    });

    this.createPixelTexture('prop_cactus', 12, 16, 4, (px) => {
      px(2, 15, 8, 1, 0x000000, 0.18);
      px(5, 2, 2, 11, 0x348c3a);
      px(3, 6, 2, 2, 0x348c3a);
      px(2, 7, 1, 4, 0x348c3a);
      px(7, 8, 2, 2, 0x348c3a);
      px(9, 6, 1, 5, 0x348c3a);
      px(6, 3, 1, 8, 0x63b768);
      px(4, 8, 1, 1, 0x63b768);
      px(8, 9, 1, 1, 0x63b768);
    });

    this.createPixelTexture('prop_brazier', 10, 14, 4, (px) => {
      px(1, 13, 8, 1, 0x000000, 0.18);
      px(3, 6, 4, 5, 0x5b412b);
      px(2, 5, 6, 1, 0x8b6948);
      px(4, 4, 2, 1, 0xffd46b);
      px(3, 2, 4, 3, 0xff9a35);
      px(4, 1, 2, 2, 0xfff1a6);
      px(3, 10, 1, 2, 0x8b6948);
      px(6, 10, 1, 2, 0x8b6948);
    });

    this.createPixelTexture('prop_cart', 14, 15, 4, (px) => {
      px(2, 14, 10, 1, 0x000000, 0.18);
      px(2, 7, 10, 4, 0x8b6a40);
      px(3, 8, 8, 2, 0xb28a56);
      px(3, 5, 2, 2, 0x9d7747);
      px(9, 5, 2, 2, 0x9d7747);
      px(1, 11, 2, 2, 0x4a331b);
      px(11, 11, 2, 2, 0x4a331b);
      px(4, 10, 1, 2, 0x4a331b);
      px(9, 10, 1, 2, 0x4a331b);
    });
  }

  generateMiscSprites() {
    this.createPixelTexture('portal', 16, 16, 2, (px) => {
      px(5, 1, 6, 1, 0x8df7ff);
      px(3, 3, 10, 2, 0x3ad9ff);
      px(2, 5, 12, 6, 0x0aa8d9);
      px(3, 11, 10, 2, 0x3ad9ff);
      px(5, 13, 6, 1, 0x8df7ff);
      px(6, 5, 4, 6, 0xcafcff);
      px(4, 4, 1, 8, 0x79f0ff);
      px(11, 4, 1, 8, 0x79f0ff);
    });

    this.createPixelTexture('interact_icon', 8, 8, 2, (px) => {
      px(3, 1, 2, 4, 0xffd86b);
      px(3, 6, 2, 1, 0xffd86b);
      px(2, 0, 4, 1, 0xffefae);
    });
  }
}
