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

    // Setup camera
    this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);

    // Setup keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

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
      const prop = this.add.image(propData.x, propData.y, propData.key);
      prop.setScale(propData.scale || 1);
      prop.setDepth((propData.depth ?? propData.y) || 2);
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

    // Distribute mobs across spawn zones
    const mobsPerZone = Math.max(1, Math.ceil(6 / spawnZones.length));

    for (const zone of spawnZones) {
      for (let i = 0; i < mobsPerZone; i++) {
        const template = mobTemplates[Phaser.Math.Between(0, mobTemplates.length - 1)];
        const x = Phaser.Math.Between(zone.xMin, zone.xMax);
        const y = Phaser.Math.Between(zone.yMin, zone.yMax);

        const mobData = {
          id: template.id || Phaser.Math.Between(1, 99999),
          template_id: template.id || template.template_id,
          name: template.name || 'Monstro',
          level: template.level || template.min_level || Phaser.Math.Between(1, 5),
          min_level: template.min_level,
          max_level: template.max_level,
          mob_type: template.mob_type || template.type || 'normal',
          type: template.mob_type || template.type || 'normal',
          hp: template.hp || 100,
          max_hp: template.max_hp || template.hp || 100,
          attack: template.attack || 10,
          defense: template.defense || 5,
          exp_reward: template.exp_reward || 20,
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
  }
}
