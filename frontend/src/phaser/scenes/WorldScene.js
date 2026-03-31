import Phaser from 'phaser';
import * as api from '../../services/api';
import { loadCharacter } from '../../store/slices/characterSlice';
import { fetchAreaDetails } from '../../store/slices/gameSlice';
import { addNotification, setActivePanel } from '../../store/slices/uiSlice';
import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';
import { Mob } from '../entities/Mob';
import { Resource } from '../entities/Resource';
import {
  TILE_SIZE, MAP_COLS, MAP_ROWS, MAP_WIDTH, MAP_HEIGHT,
  getAreaLayout, getAreaTypeFromName
} from '../config/areaLayouts';
import { normalizeNpcType, resolveAreaContext, resolvePortalDestination } from '../utils/worldState';

export class WorldScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WorldScene' });

    this.player = null;
    this.npcs = [];
    this.mobs = [];
    this.resources = [];
    this.portals = [];
    this.tileSprites = [];
    this.props = [];
    this.currentAreaId = null;
    this.currentAreaType = 'field';
    this.currentAreaName = '';
    this.currentAreaDataRef = null;
    this.storeUnsubscribe = null;

    // Atmospheric visual effects state
    this.ambientParticles = [];
    this.lightingOverlay = null;
    this.waterTweens = [];
    this.fireflyTimer = null;
    this.crystalTimer = null;

    // Dynamic lighting system
    this.darknessTex = null;
    this.darknessImage = null;
    this.lightSources = [];
    this.lightFlickerTimers = [];
    this.fogSprites = [];

    // Day/night cycle: 10 min total (5 min day, 5 min night)
    // 0.0 = midnight, 0.25 = sunrise, 0.5 = noon, 0.75 = sunset, 1.0 = midnight
    this.dayNightCycleDuration = 10 * 60 * 1000; // 10 minutes in ms
    this.dayNightTime = 0.35; // start at morning

    // Camera zoom state
    this.zoomLevel = 1.5;
    this.targetZoom = 1.5;
    this.minZoom = 0.5;
    this.maxZoom = 3.0;
    this.zoomStep = 0.1;
    this.zoomLerpSpeed = 0.1;
  }

  create() {
    // Set world bounds
    this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);

    // Get character data from Redux
    const store = window.__GAME_STORE__;
    const state = store ? store.getState() : null;
    const characterData = state?.character?.data || null;

    this.currentAreaId = characterData?.current_area_id || state?.game?.areaDetails?.id || 1;

    const areaContext = resolveAreaContext(state, this.currentAreaId, characterData?.area_name);
    this.currentAreaType = areaContext.areaType || 'village';
    this.currentAreaName = areaContext.areaName || 'Vila Inicial';
    this.currentAreaDataRef = areaContext.areaDetails;

    // Generate shared textures for atmospheric effects
    this.createEffectTextures();

    // Build the map
    const layout = getAreaLayout(this.currentAreaType);
    this.generateTilemap(layout);
    this.placeScenery(layout);

    // Place player
    const classType = characterData ? (characterData.class_type || characterData.character_class || 1) : 1;
    const spawnX = layout.playerSpawn.x;
    const spawnY = layout.playerSpawn.y;

    this.player = new Player(this, spawnX, spawnY, classType);
    this.player.setName(characterData ? (characterData.name || 'Jogador') : 'Jogador');

    // Place NPCs
    this.placeNPCs(layout, store);

    // Place mobs
    this.placeMobs(layout, store);

    // Place resources
    this.placeResources(layout, store);

    // Place portals
    this.placePortals(layout);

    // Setup atmospheric visual effects
    this.createAmbientParticles(this.currentAreaType);
    this.createLightingSystem(layout, this.currentAreaType);
    this.createWaterShimmer();

    // Setup camera
    this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);
    this.cameras.main.setZoom(this.zoomLevel);

    // Camera zoom controls - mouse wheel (throttled)
    this._lastWheelTime = 0;
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      const now = Date.now();
      if (now - this._lastWheelTime < 80) return; // throttle rapid scroll
      this._lastWheelTime = now;

      if (deltaY < 0) {
        this.targetZoom = Math.min(this.targetZoom + this.zoomStep, this.maxZoom);
      } else if (deltaY > 0) {
        this.targetZoom = Math.max(this.targetZoom - this.zoomStep, this.minZoom);
      }
    });

    // Setup keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    // Prevent browser from capturing game keys (fixes arrow keys scrolling the page)
    this.input.keyboard.addCapture([
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
      Phaser.Input.Keyboard.KeyCodes.W,
      Phaser.Input.Keyboard.KeyCodes.A,
      Phaser.Input.Keyboard.KeyCodes.S,
      Phaser.Input.Keyboard.KeyCodes.D,
      Phaser.Input.Keyboard.KeyCodes.SPACE,
      Phaser.Input.Keyboard.KeyCodes.E,
    ]);

    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    this.keyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
    this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    this.keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Key bindings for UI panels
    this.keyI.on('down', () => store?.dispatch(setActivePanel('inventory')));
    this.keyO.on('down', () => store?.dispatch(setActivePanel('equipment')));
    this.keyP.on('down', () => store?.dispatch(setActivePanel('lifeskills')));
    this.keyL.on('down', () => store?.dispatch(setActivePanel('idle')));
    this.keyM.on('down', () => store?.dispatch(setActivePanel('map')));
    this.keyEsc.on('down', () => store?.dispatch(setActivePanel('menu')));
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K).on('down', () => {
      store?.dispatch(setActivePanel('skills'));
    });
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C).on('down', () => {
      store?.dispatch(setActivePanel('status'));
    });

    // Camera zoom keyboard shortcuts
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PLUS).on('down', () => {
      this.targetZoom = Math.min(this.targetZoom + this.zoomStep, this.maxZoom);
    });
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.MINUS).on('down', () => {
      this.targetZoom = Math.max(this.targetZoom - this.zoomStep, this.minZoom);
    });
    // Numpad +/- as well
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ADD).on('down', () => {
      this.targetZoom = Math.min(this.targetZoom + this.zoomStep, this.maxZoom);
    });
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SUBTRACT).on('down', () => {
      this.targetZoom = Math.max(this.targetZoom - this.zoomStep, this.minZoom);
    });
    // Reset zoom with 0
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO).on('down', () => {
      this.targetZoom = 1.5;
    });

    // Launch UI overlay
    if (!this.scene.isActive('UIOverlayScene')) {
      this.scene.launch('UIOverlayScene');
    }

    // Show area name on entry
    this.time.delayedCall(300, () => {
      this.events.emit('show-area-name', this.currentAreaName || 'Area Desconhecida');
    });

    // Subscribe to Redux state changes for area transitions
    if (store) {
      this.storeUnsubscribe = store.subscribe(() => {
        const nextState = store.getState();
        const charData = nextState.character ? nextState.character.data : null;
        const nextAreaId = charData?.current_area_id || this.currentAreaId;
        const nextAreaDetails = nextState.game?.areaDetails || null;

        if (nextAreaId && nextAreaId !== this.currentAreaId) {
          this.handleAreaTransition(nextAreaId, nextState);
          return;
        }

        if (nextAreaDetails?.id === this.currentAreaId && nextAreaDetails !== this.currentAreaDataRef) {
          this.currentAreaDataRef = nextAreaDetails;
          const currentLayout = getAreaLayout(this.currentAreaType);
          this.placeNPCs(currentLayout, store);
          this.placeMobs(currentLayout, store);
          this.placeResources(currentLayout, store);
        }

        // Kill mob when combat ends with victory
        const killedId = nextState.ui?.killedMobInstanceId;
        if (killedId) {
          const mob = this.mobs.find((m) => m.instanceId === killedId && m.isAlive);
          if (mob) mob.kill();
          store.dispatch({ type: 'ui/clearKilledMobInstanceId' });
        }
      });
    }
  }

  generateTilemap(layout) {
    // Clear existing tiles
    for (const ts of this.tileSprites) {
      ts.destroy();
    }
    this.tileSprites = [];

    const baseTile = layout.baseTile;
    const decorTiles = layout.decorTiles || [];

    // Build a 2D grid
    const grid = [];
    for (let row = 0; row < MAP_ROWS; row++) {
      grid[row] = [];
      for (let col = 0; col < MAP_COLS; col++) {
        grid[row][col] = baseTile;
      }
    }

    // Apply decor tiles
    for (const decor of decorTiles) {
      for (let row = decor.yStart; row < decor.yEnd && row < MAP_ROWS; row++) {
        for (let col = decor.xStart; col < decor.xEnd && col < MAP_COLS; col++) {
          grid[row][col] = decor.tile;
        }
      }
    }

    // Add some random variation
    const secondaryTile = layout.secondaryTile;
    for (let i = 0; i < 15; i++) {
      const rx = Phaser.Math.Between(0, MAP_COLS - 1);
      const ry = Phaser.Math.Between(0, MAP_ROWS - 1);
      if (grid[ry][rx] === baseTile && Math.random() < 0.3) {
        grid[ry][rx] = secondaryTile;
      }
    }

    // Extra grass variety for areas using tileset ground
    const grassVariants = ['tsg_grass2', 'tsg_grass3', 'tsg_grass4', 'tsg_grass5'];
    if (baseTile.startsWith('tsg_')) {
      for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
          if (grid[row][col] === baseTile && Math.random() < 0.3) {
            grid[row][col] = grassVariants[Math.floor(Math.random() * grassVariants.length)];
          }
        }
      }
    }

    // Render tiles
    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        const tileKey = grid[row][col];
        const x = col * TILE_SIZE + TILE_SIZE / 2;
        const y = row * TILE_SIZE + TILE_SIZE / 2;
        const tile = this.add.sprite(x, y, tileKey);
        tile.setDepth(0);
        this.tileSprites.push(tile);
      }
    }
  }

  placeScenery(layout) {
    for (const prop of this.props) {
      prop.destroy();
    }
    this.props = [];

    for (const propData of (layout.props || [])) {
      const key = propData.key || propData.type;
      let prop;

      if (propData.anim) {
        prop = this.add.sprite(propData.x, propData.y, key);
        prop.play(propData.anim);
      } else {
        prop = this.add.image(propData.x, propData.y, key);
      }

      prop.setScale(propData.scale || 1);
      prop.setDepth(propData.depth ?? 2);
      prop.setAlpha(propData.alpha ?? 1);

      if (propData.flipX) {
        prop.setFlipX(true);
      }

      this.props.push(prop);
    }
  }

  placeNPCs(layout, store) {
    // Clear existing NPCs
    for (const npc of this.npcs) {
      npc.destroy();
    }
    this.npcs = [];

    let npcDataList = layout.npcPositions || [];

    if (store) {
      const state = store.getState();
      const areaNpcs = state.game?.areaDetails?.id === this.currentAreaId
        ? state.game.areaDetails.npcs
        : null;

      if (areaNpcs?.length > 0) {
        npcDataList = areaNpcs.map((npc, idx) => {
          const layoutPos = layout.npcPositions[idx] || {};
          const type = normalizeNpcType(npc.npc_type || npc.type || layoutPos.type || 'shop');

          return {
            x: layoutPos.x || 200 + idx * 120,
            y: layoutPos.y || 160,
            type,
            name: npc.name || layoutPos.name || 'NPC',
            id: npc.id || idx + 1,
            description: npc.description,
            dialog: npc.dialog,
          };
        });
      }
    }

    for (const npcData of npcDataList) {
      const npc = new NPC(this, npcData.x, npcData.y, npcData);
      this.npcs.push(npc);
    }
  }

  placeMobs(layout, store) {
    // Clear existing mobs
    for (const mob of this.mobs) {
      mob.destroy();
    }
    this.mobs = [];

    const spawnZones = layout.mobSpawnZones || [];
    if (spawnZones.length === 0) return;

    let mobTemplates = [];
    if (store) {
      const state = store.getState();
      const areaMobs = state.game?.areaDetails?.id === this.currentAreaId
        ? state.game.areaDetails.mobs
        : null;

      if (areaMobs && areaMobs.length > 0) {
        mobTemplates = areaMobs;
      }
    }

    // If no Redux data, generate placeholder mobs
    if (mobTemplates.length === 0) {
      mobTemplates = this.generatePlaceholderMobs();
    }

    // Area level range for randomization
    let areaLevelMin = 1, areaLevelMax = 5;
    if (store) {
      const ad = store.getState().game?.areaDetails;
      if (ad) {
        areaLevelMin = ad.level_min || 1;
        areaLevelMax = ad.level_max || areaLevelMin + 5;
      }
    }

    // Distribute mobs across spawn zones
    const mobsPerZone = Math.max(1, Math.ceil(6 / spawnZones.length));

    for (const zone of spawnZones) {
      for (let i = 0; i < mobsPerZone; i++) {
        const template = mobTemplates[Phaser.Math.Between(0, mobTemplates.length - 1)];
        const x = Phaser.Math.Between(zone.xMin, zone.xMax);
        const y = Phaser.Math.Between(zone.yMin, zone.yMax);

        // Randomize level within area range (±2 from template level, clamped to area range)
        const baseLevel = template.level || areaLevelMin;
        const randLevel = Phaser.Math.Clamp(
          baseLevel + Phaser.Math.Between(-2, 2),
          areaLevelMin,
          areaLevelMax
        );
        // Scale stats based on level difference from template
        const levelDiff = randLevel - baseLevel;
        const scaleFactor = 1 + levelDiff * 0.1;

        const mobData = {
          id: template.id || Phaser.Math.Between(1, 99999),
          template_id: template.id || template.template_id,
          name: template.name || 'Monstro',
          level: randLevel,
          min_level: template.min_level,
          max_level: template.max_level,
          mob_type: template.mob_type || template.type || 'normal',
          type: template.mob_type || template.type || 'normal',
          hp: Math.floor((template.hp || 100) * scaleFactor),
          max_hp: Math.floor((template.max_hp || template.hp || 100) * scaleFactor),
          attack: Math.floor((template.attack || 10) * scaleFactor),
          defense: Math.floor((template.defense || 5) * scaleFactor),
          exp_reward: Math.floor((template.exp_reward || 20) * scaleFactor),
          gold_min: template.gold_min || template.gold_reward || 10,
          gold_max: template.gold_max || template.gold_reward || 10,
        };

        const mob = new Mob(this, x, y, mobData);
        this.mobs.push(mob);
      }
    }
  }

  generatePlaceholderMobs() {
    const areaTypeToMobs = {
      field: [
        { name: 'Lobo Selvagem', mob_type: 'normal', level: 1, hp: 80, attack: 8, defense: 3, exp_reward: 15, gold_reward: 5 },
        { name: 'Javali', mob_type: 'normal', level: 2, hp: 100, attack: 10, defense: 5, exp_reward: 20, gold_reward: 8 },
        { name: 'Bandido', mob_type: 'aggressive', level: 3, hp: 120, attack: 15, defense: 6, exp_reward: 30, gold_reward: 15 }
      ],
      forest: [
        { name: 'Urso Negro', mob_type: 'normal', level: 5, hp: 200, attack: 20, defense: 10, exp_reward: 50, gold_reward: 20 },
        { name: 'Aranha Gigante', mob_type: 'aggressive', level: 6, hp: 150, attack: 25, defense: 8, exp_reward: 60, gold_reward: 25 },
        { name: 'Treant', mob_type: 'elite', level: 8, hp: 400, attack: 30, defense: 20, exp_reward: 120, gold_reward: 50 }
      ],
      mine: [
        { name: 'Golem de Pedra', mob_type: 'normal', level: 10, hp: 300, attack: 25, defense: 25, exp_reward: 80, gold_reward: 30 },
        { name: 'Morcego das Cavernas', mob_type: 'aggressive', level: 9, hp: 150, attack: 30, defense: 10, exp_reward: 70, gold_reward: 25 },
        { name: 'Elemental de Terra', mob_type: 'elite', level: 12, hp: 500, attack: 35, defense: 30, exp_reward: 150, gold_reward: 60 }
      ],
      cave: [
        { name: 'Esqueleto Guerreiro', mob_type: 'normal', level: 15, hp: 400, attack: 35, defense: 20, exp_reward: 100, gold_reward: 40 },
        { name: 'Espectro', mob_type: 'aggressive', level: 16, hp: 350, attack: 45, defense: 15, exp_reward: 120, gold_reward: 50 },
        { name: 'Dragão das Sombras', mob_type: 'boss', level: 20, hp: 2000, attack: 80, defense: 50, exp_reward: 500, gold_reward: 200 }
      ],
      ruins: [
        { name: 'Guerreiro Morto-Vivo', mob_type: 'normal', level: 12, hp: 350, attack: 30, defense: 18, exp_reward: 90, gold_reward: 35 },
        { name: 'Mago Corrompido', mob_type: 'elite', level: 14, hp: 300, attack: 50, defense: 15, exp_reward: 130, gold_reward: 55 },
        { name: 'Cavaleiro Negro', mob_type: 'aggressive', level: 13, hp: 400, attack: 40, defense: 25, exp_reward: 110, gold_reward: 45 }
      ],
      desert: [
        { name: 'Escorpião Gigante', mob_type: 'normal', level: 8, hp: 180, attack: 22, defense: 12, exp_reward: 55, gold_reward: 20 },
        { name: 'Serpente do Deserto', mob_type: 'aggressive', level: 9, hp: 160, attack: 28, defense: 8, exp_reward: 65, gold_reward: 25 },
        { name: 'Múmia Anciã', mob_type: 'elite', level: 11, hp: 450, attack: 32, defense: 22, exp_reward: 140, gold_reward: 55 }
      ],
      temple: [
        { name: 'Guardião do Templo', mob_type: 'elite', level: 18, hp: 600, attack: 50, defense: 35, exp_reward: 200, gold_reward: 80 },
        { name: 'Sacerdote Sombrio', mob_type: 'aggressive', level: 17, hp: 400, attack: 60, defense: 20, exp_reward: 180, gold_reward: 70 },
        { name: 'Demônio Menor', mob_type: 'boss', level: 25, hp: 3000, attack: 100, defense: 60, exp_reward: 800, gold_reward: 350 }
      ]
    };

    return areaTypeToMobs[this.currentAreaType] || areaTypeToMobs.field;
  }

  placeResources(layout, store) {
    // Clear existing resources
    for (const res of this.resources) {
      res.destroy();
    }
    this.resources = [];

    let resourceData = layout.resourceZones || [];

    if (store) {
      const state = store.getState();
      const areaResources = state.game?.areaDetails?.id === this.currentAreaId
        ? state.game.areaDetails.resources
        : null;

      if (areaResources && areaResources.length > 0) {
        resourceData = areaResources.map((res, idx) => {
          const layoutRes = layout.resourceZones[idx] || {};
          return {
            x: layoutRes.x || 150 + idx * 150,
            y: layoutRes.y || 300,
            type: res.resource_type || res.type || layoutRes.type || 'mining',
            name: res.item_name || res.name,
            id: res.id,
            area_id: this.currentAreaId
          };
        });
      }
    }

    for (const resData of resourceData) {
      const resource = new Resource(this, resData.x, resData.y, {
        ...resData,
        area_id: this.currentAreaId
      });
      this.resources.push(resource);
    }
  }

  placePortals(layout) {
    // Clear existing portals
    for (const portal of this.portals) {
      portal.sprite.destroy();
      portal.label.destroy();
    }
    this.portals = [];

    const portalPositions = layout.portalPositions || [];

    for (const portalData of portalPositions) {
      const sprite = this.physics.add.sprite(portalData.x, portalData.y, 'portal');
      sprite.setImmovable(true);
      sprite.body.setAllowGravity(false);
      sprite.setDepth(3);

      // Pulsing glow animation
      this.tweens.add({
        targets: sprite,
        alpha: 0.5,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      const label = this.add.text(portalData.x, portalData.y - 24, portalData.label || 'Portal', {
        fontSize: '8px',
        color: '#00ffff',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5).setDepth(20);

      // Setup overlap detection with player
      const portalObj = {
        sprite: sprite,
        label: label,
        data: portalData,
        cooldown: false
      };

      this.portals.push(portalObj);
    }
  }

  handleAreaTransition(newAreaId, state) {
    this.currentAreaId = newAreaId;
    const areaContext = resolveAreaContext(state, newAreaId, state?.character?.data?.area_name);
    const areaName = areaContext.areaName || 'Area Desconhecida';
    const areaType = areaContext.areaType || getAreaTypeFromName(areaName);

    this.currentAreaType = areaType;
    this.currentAreaName = areaName;
    this.currentAreaDataRef = areaContext.areaDetails;

    // Rebuild the entire scene
    const layout = getAreaLayout(areaType);
    this.generateTilemap(layout);
    this.placeScenery(layout);

    // Re-place entities
    const store = window.__GAME_STORE__;
    this.placeNPCs(layout, store);
    this.placeMobs(layout, store);
    this.placeResources(layout, store);
    this.placePortals(layout);

    // Recreate atmospheric effects for new area
    this.cleanupAtmosphericEffects();
    this.createAmbientParticles(areaType);
    this.createLightingSystem(layout, areaType);
    this.createWaterShimmer();

    // Move player to spawn
    this.player.setPosition(layout.playerSpawn.x, layout.playerSpawn.y);

    // Show area name
    this.events.emit('show-area-name', areaName || 'Area Desconhecida');
  }

  async triggerPortalTransition(portalData) {
    const store = window.__GAME_STORE__;
    if (!store) return;

    const state = store.getState();
    const charId = state.character?.data?.id;
    const destination = resolvePortalDestination(state, portalData.targetType, this.currentAreaId);

    if (!charId || !destination) {
      store.dispatch(addNotification({ type: 'error', message: 'Nao foi possivel encontrar o destino deste portal.' }));
      return;
    }

    try {
      await api.saveCharacter(charId, { current_area_id: destination.id });
      await Promise.allSettled([
        store.dispatch(loadCharacter(charId)),
        store.dispatch(fetchAreaDetails(destination.id)),
      ]);
      store.dispatch(addNotification({ type: 'info', message: `Viajou para ${destination.name}` }));
    } catch (error) {
      store.dispatch(addNotification({
        type: 'error',
        message: error.response?.data?.error || 'Falha ao atravessar o portal',
      }));
    }
  }

  update(time, delta) {
    if (!this.player) return;

    // Update dynamic lighting (player light follows character)
    this.updateLighting(time);

    // Smooth camera zoom interpolation
    if (Math.abs(this.zoomLevel - this.targetZoom) > 0.005) {
      this.zoomLevel += (this.targetZoom - this.zoomLevel) * this.zoomLerpSpeed;
      this.cameras.main.setZoom(this.zoomLevel);
    } else if (this.zoomLevel !== this.targetZoom) {
      this.zoomLevel = this.targetZoom;
      this.cameras.main.setZoom(this.zoomLevel);
    }

    const store = window.__GAME_STORE__;
    const activePanel = store?.getState()?.ui?.activePanel || null;

    if (activePanel) {
      this.player.sprite.setVelocity(0, 0);
      this.player.isMoving = false;
    } else {
      // Update player movement
      this.player.update(this.cursors, this.wasd);

      // Check NPC proximity and interactions
      let nearAnyNpc = false;
      for (const npc of this.npcs) {
        const isNear = npc.checkProximity(this.player.sprite);
        if (isNear) {
          nearAnyNpc = true;

          if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
            npc.interact();
          }
        }
      }

      // Check resource proximity and interactions
      for (const resource of this.resources) {
        const isNear = resource.checkProximity(this.player.sprite);
        if (isNear && !nearAnyNpc) {
          if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
            resource.gather();
          }
        }
      }

      if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
        this.attackNearestMob();
      }

      // Check portal proximity
      for (const portal of this.portals) {
        if (portal.cooldown) continue;

        const dist = Phaser.Math.Distance.Between(
          this.player.sprite.x, this.player.sprite.y,
          portal.sprite.x, portal.sprite.y
        );

        if (dist < 32) {
          portal.cooldown = true;
          this.triggerPortalTransition(portal.data);

          this.time.delayedCall(2000, () => {
            portal.cooldown = false;
          });
        }
      }
    }

    // Update mobs
    for (const mob of this.mobs) {
      mob.update(delta, this.player.sprite);
    }

    // Emit coordinate update for UI overlay
    const pos = this.player.getPosition();
    this.events.emit('update-coords', { x: pos.x, y: pos.y });
  }

  attackNearestMob() {
    if (!this.player) return;

    let nearestMob = null;
    let nearestDist = Infinity;

    for (const mob of this.mobs) {
      if (!mob.isAlive) continue;

      const dist = Phaser.Math.Distance.Between(
        this.player.sprite.x, this.player.sprite.y,
        mob.sprite.x, mob.sprite.y
      );

      if (dist < 80 && dist < nearestDist) {
        nearestDist = dist;
        nearestMob = mob;
      }
    }

    if (nearestMob) {
      nearestMob.triggerCombat();

      // Visual feedback - flash mob
      this.tweens.add({
        targets: nearestMob.sprite,
        alpha: 0.5,
        duration: 100,
        yoyo: true,
        repeat: 1
      });

      // Show floating damage text
      this.events.emit('show-floating-text', {
        x: nearestMob.sprite.x,
        y: nearestMob.sprite.y - 20,
        text: 'Atacar!',
        color: '#ff4444'
      });
    }
  }

  shutdown() {
    // Cleanup on scene shutdown
    if (this.storeUnsubscribe) {
      this.storeUnsubscribe();
      this.storeUnsubscribe = null;
    }

    if (this.player) {
      this.player.destroy();
      this.player = null;
    }

    for (const npc of this.npcs) npc.destroy();
    this.npcs = [];

    for (const mob of this.mobs) mob.destroy();
    this.mobs = [];

    for (const res of this.resources) res.destroy();
    this.resources = [];

    for (const portal of this.portals) {
      portal.sprite.destroy();
      portal.label.destroy();
    }
    this.portals = [];

    for (const ts of this.tileSprites) ts.destroy();
    this.tileSprites = [];

    // Cleanup atmospheric effects
    this.cleanupAtmosphericEffects();
  }

  // ===== ATMOSPHERIC VISUAL EFFECTS =====

  createEffectTextures() {
    // Particle dot texture (white circle, tinted per-use)
    if (!this.textures.exists('particle_dot')) {
      const particleGfx = this.make.graphics({ add: false });
      particleGfx.fillStyle(0xffffff);
      particleGfx.fillCircle(4, 4, 4);
      particleGfx.generateTexture('particle_dot', 8, 8);
      particleGfx.destroy();
    }

  }

  createAmbientParticles(areaType) {
    const configs = {
      village: [{
        x: { min: 0, max: MAP_WIDTH },
        y: { min: 0, max: MAP_HEIGHT },
        emitZone: undefined,
        speed: { min: 5, max: 15 },
        angle: { min: 250, max: 290 },
        scale: { start: 0.3, end: 0.1 },
        alpha: { start: 0.4, end: 0 },
        lifespan: 6000,
        frequency: 300,
        tint: [0xf5deb3, 0xffffff],
        quantity: 1,
        blendMode: 'NORMAL'
      }],
      field: [{
        x: { min: 0, max: MAP_WIDTH },
        y: { min: MAP_HEIGHT * 0.3, max: MAP_HEIGHT },
        speed: { min: 20, max: 50 },
        angle: { min: 170, max: 190 },
        scale: { start: 0.25, end: 0.1 },
        alpha: { start: 0.5, end: 0 },
        lifespan: 4000,
        frequency: 200,
        tint: [0x66cc66, 0x88dd44, 0x44aa22],
        quantity: 1,
        blendMode: 'NORMAL'
      }],
      forest: [
        // Falling leaves
        {
          x: { min: 0, max: MAP_WIDTH },
          y: { min: -10, max: 0 },
          speed: { min: 10, max: 30 },
          angle: { min: 80, max: 100 },
          scale: { start: 0.4, end: 0.2 },
          alpha: { start: 0.7, end: 0.1 },
          lifespan: 8000,
          frequency: 400,
          tint: [0xdd8833, 0xcc6622, 0x66aa44, 0x88cc33],
          quantity: 1,
          blendMode: 'NORMAL',
          rotate: { min: -180, max: 180 },
          gravityY: 8
        }
      ],
      mine: [
        // Dust falling from ceiling
        {
          x: { min: 0, max: MAP_WIDTH },
          y: { min: -5, max: 0 },
          speed: { min: 5, max: 20 },
          angle: { min: 85, max: 95 },
          scale: { start: 0.2, end: 0.05 },
          alpha: { start: 0.35, end: 0 },
          lifespan: 5000,
          frequency: 250,
          tint: [0x888888, 0x999999, 0xaaaaaa],
          quantity: 1,
          blendMode: 'NORMAL',
          gravityY: 10
        }
      ],
      cave: [
        // Dust falling from ceiling (same as mine)
        {
          x: { min: 0, max: MAP_WIDTH },
          y: { min: -5, max: 0 },
          speed: { min: 5, max: 20 },
          angle: { min: 85, max: 95 },
          scale: { start: 0.2, end: 0.05 },
          alpha: { start: 0.35, end: 0 },
          lifespan: 5000,
          frequency: 250,
          tint: [0x888888, 0x999999, 0xaaaaaa],
          quantity: 1,
          blendMode: 'NORMAL',
          gravityY: 10
        }
      ],
      desert: [{
        x: { min: 0, max: MAP_WIDTH },
        y: { min: 0, max: MAP_HEIGHT },
        speed: { min: 60, max: 120 },
        angle: { min: 170, max: 185 },
        scale: { start: 0.2, end: 0.05 },
        alpha: { start: 0.5, end: 0 },
        lifespan: 3000,
        frequency: 80,
        tint: [0xdec58f, 0xc8a96e, 0xe8d5a0],
        quantity: 2,
        blendMode: 'NORMAL'
      }],
      temple: [{
        x: { min: 0, max: MAP_WIDTH },
        y: { min: 0, max: MAP_HEIGHT },
        speed: { min: 8, max: 20 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.35, end: 0.1 },
        alpha: { start: 0.5, end: 0 },
        lifespan: 5000,
        frequency: 250,
        tint: [0x9966ff, 0x6644cc, 0x4488ff, 0x7755dd],
        quantity: 1,
        blendMode: 'ADD'
      }],
      ruins: [{
        x: { min: 0, max: MAP_WIDTH },
        y: { min: MAP_HEIGHT * 0.5, max: MAP_HEIGHT },
        speed: { min: 5, max: 18 },
        angle: { min: 250, max: 290 },
        scale: { start: 0.3, end: 0.05 },
        alpha: { start: 0.6, end: 0 },
        lifespan: 6000,
        frequency: 300,
        tint: [0xff6633, 0xcc4422, 0xff8844],
        quantity: 1,
        blendMode: 'ADD'
      }]
    };

    const emitterConfigs = configs[areaType] || configs.field;

    for (const cfg of emitterConfigs) {
      const emitter = this.add.particles(0, 0, 'particle_dot', {
        x: cfg.x,
        y: cfg.y,
        speed: cfg.speed,
        angle: cfg.angle,
        scale: cfg.scale,
        alpha: cfg.alpha,
        lifespan: cfg.lifespan,
        frequency: cfg.frequency,
        tint: cfg.tint,
        quantity: cfg.quantity || 1,
        blendMode: cfg.blendMode || 'NORMAL',
        rotate: cfg.rotate || undefined,
        gravityY: cfg.gravityY || 0
      });
      emitter.setDepth(50);
      this.ambientParticles.push(emitter);
    }

    // Forest fireflies - random sparkles via timer
    if (areaType === 'forest') {
      this.fireflyTimer = this.time.addEvent({
        delay: 800,
        loop: true,
        callback: () => {
          const fx = Phaser.Math.Between(0, MAP_WIDTH);
          const fy = Phaser.Math.Between(0, MAP_HEIGHT);
          const sparkle = this.add.image(fx, fy, 'particle_dot');
          sparkle.setScale(0.3);
          sparkle.setTint(0xeeff66);
          sparkle.setAlpha(0);
          sparkle.setDepth(50);
          sparkle.setBlendMode(Phaser.BlendModes.ADD);
          this.tweens.add({
            targets: sparkle,
            alpha: { from: 0, to: 0.8 },
            scale: { from: 0.2, to: 0.4 },
            duration: 600,
            yoyo: true,
            onComplete: () => sparkle.destroy()
          });
        }
      });
    }

    // Mine/cave crystal sparkle
    if (areaType === 'mine' || areaType === 'cave') {
      this.crystalTimer = this.time.addEvent({
        delay: 1200,
        loop: true,
        callback: () => {
          const cx = Phaser.Math.Between(0, MAP_WIDTH);
          const cy = Phaser.Math.Between(0, MAP_HEIGHT);
          const sparkle = this.add.image(cx, cy, 'particle_dot');
          sparkle.setScale(0.25);
          sparkle.setTint(0x66ddff);
          sparkle.setAlpha(0);
          sparkle.setDepth(50);
          sparkle.setBlendMode(Phaser.BlendModes.ADD);
          this.tweens.add({
            targets: sparkle,
            alpha: { from: 0, to: 0.9 },
            scale: { from: 0.15, to: 0.35 },
            duration: 400,
            yoyo: true,
            onComplete: () => sparkle.destroy()
          });
        }
      });
    }
  }

  // ── DAY/NIGHT CYCLE + DYNAMIC LIGHTING ──
  // 10 min cycle: 0=midnight, 0.25=sunrise, 0.5=noon, 0.75=sunset

  getDayNightFactor() {
    // Returns 0.0 (full night) to 1.0 (full day)
    const t = this.dayNightTime;
    // Smooth sinusoidal: noon=1, midnight=0
    return Math.max(0, Math.sin(t * Math.PI));
  }

  getDayNightLabel() {
    const t = this.dayNightTime;
    if (t < 0.2 || t > 0.8) return 'Noite';
    if (t < 0.3) return 'Amanhecer';
    if (t < 0.7) return 'Dia';
    return 'Entardecer';
  }

  createLightingSystem(layout, areaType) {
    // Cleanup previous
    if (this.lightingOverlay) { this.lightingOverlay.destroy(); this.lightingOverlay = null; }
    if (this.darknessTex) { this.darknessTex.destroy(); this.darknessTex = null; }
    for (const ls of this.lightSources) { if (ls.sprite) ls.sprite.destroy(); }
    this.lightSources = [];
    for (const t of this.lightFlickerTimers) t.remove(false);
    this.lightFlickerTimers = [];
    for (const f of this.fogSprites) f.destroy();
    this.fogSprites = [];

    // Base darkness per area (added on top of day/night)
    this._areaDarknessBase = {
      village: 0.0, field: 0.0, forest: 0.12,
      mine: 0.40, cave: 0.50, ruins: 0.10,
      desert: 0.0, temple: 0.30,
    }[areaType] || 0.0;

    // Indoor areas ignore day/night
    this._isIndoor = ['mine', 'cave', 'temple'].includes(areaType);

    // Darkness overlay: pure black for max contrast
    this._darknessColor = 0x000000;

    // Create light texture: tight concentrated glow, falls off fast
    if (this.textures.exists('light_radial')) this.textures.remove('light_radial');
    const lSize = 512;
    const lCanvas = document.createElement('canvas');
    lCanvas.width = lSize; lCanvas.height = lSize;
    const lCtx = lCanvas.getContext('2d');
    const lGrad = lCtx.createRadialGradient(lSize/2, lSize/2, 0, lSize/2, lSize/2, lSize/2);
    lGrad.addColorStop(0, 'rgba(255,255,255,1.0)');
    lGrad.addColorStop(0.08, 'rgba(255,255,255,0.85)');
    lGrad.addColorStop(0.2, 'rgba(255,255,255,0.45)');
    lGrad.addColorStop(0.4, 'rgba(255,255,255,0.12)');
    lGrad.addColorStop(0.65, 'rgba(255,255,255,0.02)');
    lGrad.addColorStop(1, 'rgba(255,255,255,0)');
    lCtx.fillStyle = lGrad;
    lCtx.fillRect(0, 0, lSize, lSize);
    this.textures.addCanvas('light_radial', lCanvas);

    // Create thin fog texture
    if (!this.textures.exists('fog_cloud')) {
      const fSize = 256;
      const fCanvas = document.createElement('canvas');
      fCanvas.width = fSize; fCanvas.height = fSize;
      const fCtx = fCanvas.getContext('2d');
      const fGrad = fCtx.createRadialGradient(fSize/2, fSize/2, 0, fSize/2, fSize/2, fSize/2);
      fGrad.addColorStop(0, 'rgba(140,140,160,0.07)');
      fGrad.addColorStop(0.5, 'rgba(120,120,140,0.03)');
      fGrad.addColorStop(1, 'rgba(100,100,120,0)');
      fCtx.fillStyle = fGrad;
      fCtx.fillRect(0, 0, fSize, fSize);
      this.textures.addCanvas('fog_cloud', fCanvas);
    }

    // Dark overlay (fixed to camera, alpha updated each frame)
    const cam = this.cameras.main;
    this.lightingOverlay = this.add.rectangle(
      cam.width / 2, cam.height / 2,
      cam.width * 3, cam.height * 3,
      this._darknessColor, 0
    );
    this.lightingOverlay.setScrollFactor(0);
    this.lightingOverlay.setDepth(80);

    // Collect light definitions
    const lightDefs = [];

    // Player light (only at night, subtle)
    lightDefs.push({
      type: 'player', x: layout.playerSpawn.x, y: layout.playerSpawn.y,
      radius: 100, color: 0xddeeff, nightOnly: true,
      intensityDay: 0.0, intensityNight: 0.7, flicker: false,
    });

    // Light sources - need to be STRONG to actually illuminate through dark overlay
    for (const prop of (layout.props || [])) {
      const k = prop.key || '';
      if (k.includes('campfire') || k.includes('fireplace')) {
        lightDefs.push({ type: 'fire', x: prop.x, y: prop.y, radius: 180, color: 0xff8833, intensityDay: 0.15, intensityNight: 1.0, flicker: true });
      } else if (k.includes('lamp')) {
        lightDefs.push({ type: 'lamp', x: prop.x, y: prop.y, radius: 120, color: 0xffcc55, intensityDay: 0.08, intensityNight: 0.85, flicker: true });
      } else if (k.includes('brazier')) {
        lightDefs.push({ type: 'fire', x: prop.x, y: prop.y, radius: 150, color: 0xff6622, intensityDay: 0.10, intensityNight: 0.95, flicker: true });
      } else if (k.includes('crystal')) {
        lightDefs.push({ type: 'crystal', x: prop.x, y: prop.y, radius: 80, color: 0x44ccff, intensityDay: 0.12, intensityNight: 0.7, flicker: false });
      }
    }

    // NPC glow
    for (const npc of (layout.npcPositions || [])) {
      lightDefs.push({ type: 'npc', x: npc.x, y: npc.y, radius: 80, color: 0xeedd99, intensityDay: 0.05, intensityNight: 0.6, flicker: false });
    }

    // Portal glow
    for (const portal of (layout.portalPositions || [])) {
      lightDefs.push({ type: 'portal', x: portal.x, y: portal.y, radius: 90, color: 0x5577ff, intensityDay: 0.08, intensityNight: 0.7, flicker: false });
    }

    // Create light sprites
    for (const def of lightDefs) {
      const sprite = this.add.image(def.x, def.y, 'light_radial');
      const scale = (def.radius * 2) / 512;
      sprite.setScale(scale);
      sprite.setAlpha(0);
      sprite.setTint(def.color);
      sprite.setBlendMode(Phaser.BlendModes.ADD);
      sprite.setDepth(81);
      def.sprite = sprite;
      def._scale = scale;

      // Flicker timer
      if (def.flicker) {
        def._flickerValue = 1.0;
        const timer = this.time.addEvent({
          delay: 60 + Math.random() * 80,
          loop: true,
          callback: () => { def._flickerValue = 0.75 + Math.random() * 0.5; },
        });
        this.lightFlickerTimers.push(timer);
      }

      this.lightSources.push(def);
    }

    // Create fog clouds (scattered across map, drift slowly)
    const fogCount = { village: 6, field: 5, forest: 10, mine: 3, cave: 4, ruins: 7, desert: 3, temple: 5 }[areaType] || 5;
    for (let i = 0; i < fogCount; i++) {
      const fog = this.add.image(
        Phaser.Math.Between(0, MAP_WIDTH),
        Phaser.Math.Between(0, MAP_HEIGHT),
        'fog_cloud'
      );
      fog.setScale(Phaser.Math.FloatBetween(3, 8));
      fog.setAlpha(0);
      fog.setDepth(82);
      fog.setBlendMode(Phaser.BlendModes.SCREEN);
      fog._driftSpeed = Phaser.Math.FloatBetween(3, 10);
      fog._driftAngle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      this.fogSprites.push(fog);
    }

    // Store layout ref for area type
    this._lightAreaType = areaType;
  }

  updateLighting(time) {
    if (!this.lightingOverlay) return;

    // Advance day/night cycle
    const delta = this.game.loop.delta || 16;
    this.dayNightTime += delta / this.dayNightCycleDuration;
    if (this.dayNightTime >= 1.0) this.dayNightTime -= 1.0;

    const dayFactor = this.getDayNightFactor(); // 0=night, 1=day
    const nightFactor = 1.0 - dayFactor;

    // Calculate overlay darkness
    // Day: base area darkness only. Night: nearly pitch black
    const nightDarkness = this._isIndoor ? 0 : nightFactor * 0.93;
    const totalDarkness = Math.min(0.96, this._areaDarknessBase + nightDarkness);
    this.lightingOverlay.setAlpha(totalDarkness);

    // Tint overlay: warm at sunset/sunrise, blue at night, neutral at day
    const t = this.dayNightTime;
    let overlayColor = this._darknessColor;
    if (!this._isIndoor) {
      if (t > 0.65 && t < 0.8) overlayColor = 0x1a0a05; // sunset warm
      else if (t > 0.2 && t < 0.35) overlayColor = 0x0a0510; // sunrise cool
      else if (nightFactor > 0.5) overlayColor = 0x050818; // deep night blue
    }
    this.lightingOverlay.setFillStyle(overlayColor, totalDarkness);

    // Update player light position
    const playerLS = this.lightSources.find(ls => ls.type === 'player');
    if (playerLS?.sprite && this.player?.sprite) {
      playerLS.sprite.setPosition(this.player.sprite.x, this.player.sprite.y);
    }

    // Update all light intensities based on day/night
    for (const ls of this.lightSources) {
      const iDay = ls.intensityDay ?? 0;
      const iNight = ls.intensityNight ?? 0;
      let intensity = iDay * dayFactor + iNight * nightFactor;

      // Indoor areas always use night intensity
      if (this._isIndoor) intensity = iNight;

      const flick = ls._flickerValue || 1.0;
      ls.sprite.setAlpha(intensity * flick);
      ls.sprite.setScale(ls._scale * (ls.flicker ? (0.92 + flick * 0.16) : 1.0));
    }

    // Update fog (more visible at night, drift slowly)
    const fogAlpha = this._isIndoor ? 0.02 : nightFactor * 0.06;
    for (const fog of this.fogSprites) {
      fog.setAlpha(fogAlpha);
      fog.x += Math.cos(fog._driftAngle) * fog._driftSpeed * (delta / 1000);
      fog.y += Math.sin(fog._driftAngle) * fog._driftSpeed * (delta / 1000);
      // Wrap around
      if (fog.x > MAP_WIDTH + 200) fog.x = -200;
      if (fog.x < -200) fog.x = MAP_WIDTH + 200;
      if (fog.y > MAP_HEIGHT + 200) fog.y = -200;
      if (fog.y < -200) fog.y = MAP_HEIGHT + 200;
    }
  }

  createWaterShimmer() {
    this.waterTweens = [];
    for (const tile of this.tileSprites) {
      if (tile.texture && tile.texture.key && tile.texture.key.toLowerCase().includes('water')) {
        const tw = this.tweens.add({
          targets: tile,
          alpha: { from: 1.0, to: 0.85 },
          duration: 1500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
        this.waterTweens.push(tw);
      }
    }
  }

  cleanupAtmosphericEffects() {
    // Destroy ambient particle emitters
    for (const emitter of this.ambientParticles) {
      emitter.destroy();
    }
    this.ambientParticles = [];

    // Destroy lighting system
    for (const ls of this.lightSources) { if (ls.sprite) ls.sprite.destroy(); }
    this.lightSources = [];
    for (const t of this.lightFlickerTimers) t.remove(false);
    this.lightFlickerTimers = [];
    if (this.darknessTex) { this.darknessTex.destroy(); this.darknessTex = null; }
    if (this.lightingOverlay) { this.lightingOverlay.destroy(); this.lightingOverlay = null; }
    for (const f of this.fogSprites) f.destroy();
    this.fogSprites = [];

    // Stop water shimmer tweens
    for (const tw of this.waterTweens) {
      tw.stop();
    }
    this.waterTweens = [];

    // Stop timers
    if (this.fireflyTimer) {
      this.fireflyTimer.remove(false);
      this.fireflyTimer = null;
    }
    if (this.crystalTimer) {
      this.crystalTimer.remove(false);
      this.crystalTimer = null;
    }
  }
}
