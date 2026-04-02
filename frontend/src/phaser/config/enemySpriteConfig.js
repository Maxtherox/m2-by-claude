const enemyFrameModules = import.meta.glob('../../Assets/Inimigos/**/*.png', {
  eager: true,
  import: 'default',
});

const COMBAT_AREAS = ['field', 'forest', 'mine', 'cave', 'ruins', 'desert', 'temple'];

const EXCLUDED_FILE_PATTERNS = [
  /preview/i,
  /spritesheet/i,
  /sheet/i,
  /get-more/i,
  /fire-ball/i,
  /breath/i,
  /rock\.png$/i,
  /\.ds_store$/i,
];

const extractOrder = (value) => {
  const match = value.match(/(\d+)(?=\.png$)/i);
  return match ? Number.parseInt(match[1], 10) : 0;
};

const toTitleCase = (value) =>
  value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const pickFrames = (files, includeKeywords) => {
  const matches = files.filter((file) => includeKeywords.some((keyword) => file.matchPath.includes(keyword)));
  return matches.length > 0 ? matches : [];
};

const pickLargestGroup = (files) => {
  const grouped = new Map();

  files.forEach((file) => {
    const groupKey = file.relativeDir || '__root__';
    if (!grouped.has(groupKey)) grouped.set(groupKey, []);
    grouped.get(groupKey).push(file);
  });

  return [...grouped.values()]
    .sort((left, right) => {
      if (right.length !== left.length) return right.length - left.length;
      return left[0].relativeDir.localeCompare(right[0].relativeDir);
    })[0] || [];
};

const allEnemyFiles = Object.entries(enemyFrameModules).reduce((accumulator, [filePath, url]) => {
  const relativePath = filePath.split('/Inimigos/')[1];
  if (!relativePath) return accumulator;

  const lowerPath = relativePath.toLowerCase();
  if (EXCLUDED_FILE_PATTERNS.some((pattern) => pattern.test(lowerPath))) {
    return accumulator;
  }

  const [folder, ...rest] = relativePath.split('/');
  if (!folder || rest.length === 0) return accumulator;

  const filename = rest[rest.length - 1];
  const relativeDir = rest.slice(0, -1).join('/');
  const key = folder.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

  if (!accumulator[key]) {
    accumulator[key] = {
      key,
      folder,
      name: toTitleCase(folder),
      files: [],
    };
  }

  accumulator[key].files.push({
    url,
    filePath,
    filename,
    relativeDir,
    order: extractOrder(filename),
    matchPath: `${relativeDir}/${filename}`.toLowerCase(),
  });

  return accumulator;
}, {});

const enemyDefinitions = Object.values(allEnemyFiles)
  .map((enemy) => {
    const files = enemy.files.sort((left, right) => {
      if (left.relativeDir !== right.relativeDir) {
        return left.relativeDir.localeCompare(right.relativeDir);
      }

      if (left.order !== right.order) {
        return left.order - right.order;
      }

      return left.filename.localeCompare(right.filename);
    });

    const rootFrames = files.filter((file) => file.relativeDir === '');
    const idleFrames = pickFrames(files, ['idle', 'hang']);
    const moveFrames = pickFrames(files, ['walk', 'run', 'running', 'galloping', 'move', 'upward', 'flying', 'jump']);
    const attackFrames = pickFrames(files, ['attack', 'throw', 'fire']);
    const fallbackFrames = rootFrames.length > 0 ? rootFrames : pickLargestGroup(files);

    const idle = idleFrames.length > 0 ? idleFrames : fallbackFrames;
    const move = moveFrames.length > 0 ? moveFrames : idle;
    const attack = attackFrames.length > 0 ? attackFrames : [];

    return {
      key: enemy.key,
      folder: enemy.folder,
      name: enemy.name,
      texturePrefix: `enemy_${enemy.key}`,
      animations: {
        idle: idle.map((frame) => frame.url),
        move: move.map((frame) => frame.url),
        attack: attack.map((frame) => frame.url),
      },
    };
  })
  .filter((enemy) => enemy.animations.idle.length > 0)
  .sort((left, right) => left.name.localeCompare(right.name));

enemyDefinitions.forEach((enemy) => {
  enemy.animationKeys = {
    idle: `${enemy.texturePrefix}_idle`,
    move: `${enemy.texturePrefix}_move`,
    attack: `${enemy.texturePrefix}_attack`,
  };
  enemy.defaultTextureKey = `${enemy.texturePrefix}_idle_0`;
});

const enemyMap = Object.fromEntries(enemyDefinitions.map((enemy) => [enemy.key, enemy]));

const areaEnemyMap = COMBAT_AREAS.reduce((accumulator, area) => {
  accumulator[area] = [];
  return accumulator;
}, {});

enemyDefinitions.forEach((enemy, index) => {
  const area = COMBAT_AREAS[index % COMBAT_AREAS.length];
  areaEnemyMap[area].push(enemy.key);
});

export const ENEMY_SPRITE_DEFINITIONS = enemyDefinitions;
export const ENEMY_SPRITES_BY_KEY = enemyMap;
export const ENEMY_KEYS_BY_AREA = areaEnemyMap;

export function getEnemyDefinition(enemyKey) {
  return ENEMY_SPRITES_BY_KEY[enemyKey] || null;
}

export function getEnemyKeysForArea(areaType) {
  return ENEMY_KEYS_BY_AREA[(areaType || '').toLowerCase()] || [];
}
