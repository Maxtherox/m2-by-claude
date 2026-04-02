const playerFrameModules = import.meta.glob('../../Assets/Jogador/01_Maxine/**/*.png', {
  eager: true,
  import: 'default',
});

const animationDefinitions = [
  { key: 'idle', folder: 'idle', frameRate: 6, repeat: -1 },
  { key: 'walk', folder: 'Walk', frameRate: 12, repeat: -1 },
  { key: 'run', folder: 'run', frameRate: 14, repeat: -1 },
  { key: 'attack', folder: 'player-attack', frameRate: 14, repeat: 0 },
  { key: 'block', folder: 'block', frameRate: 10, repeat: 0 },
  { key: 'back_flip', folder: 'Back Flip', frameRate: 12, repeat: 0 },
  { key: 'charged_attack', folder: 'Charged Attack', frameRate: 12, repeat: 0 },
  { key: 'climb', folder: 'climb', frameRate: 10, repeat: -1 },
  { key: 'crouch', folder: 'crouch', frameRate: 8, repeat: -1 },
  { key: 'crouch_attack', folder: 'crouch-attack', frameRate: 12, repeat: 0 },
  { key: 'dash', folder: 'dash-sprites', frameRate: 16, repeat: 0 },
  { key: 'dash_attack', folder: 'dash-attack-sprites', frameRate: 16, repeat: 0 },
  { key: 'dive_kick', folder: 'Dive Kick', frameRate: 12, repeat: 0 },
  { key: 'dizzy', folder: 'dizzy', frameRate: 8, repeat: -1 },
  { key: 'fall_attack', folder: 'fall-attack', frameRate: 12, repeat: 0 },
  { key: 'hurt', folder: 'hurt', frameRate: 10, repeat: 0 },
  { key: 'jump', folder: 'jump', frameRate: 10, repeat: 0 },
  { key: 'jump_attack', folder: 'jump-attack', frameRate: 12, repeat: 0 },
  { key: 'ladder', folder: 'ladder', frameRate: 10, repeat: -1 },
  { key: 'magic_attack', folder: 'magic-attack-1', frameRate: 12, repeat: 0 },
  { key: 'magic_missile', folder: 'magic-misile', frameRate: 14, repeat: 0 },
  { key: 'piercing', folder: 'piercing', frameRate: 14, repeat: 0 },
  { key: 'slide', folder: 'Slide', frameRate: 14, repeat: 0 },
  { key: 'special', folder: 'special', frameRate: 12, repeat: 0 },
  { key: 'special_attack', folder: 'Special attack', frameRate: 12, repeat: 0 },
  { key: 'up_attack', folder: 'up-attack', frameRate: 12, repeat: 0 },
];

const extractOrder = (filePath) => {
  const match = filePath.match(/(\d+)(?=\.png$)/i);
  return match ? Number.parseInt(match[1], 10) : 0;
};

const buildFrameUrls = (folder) =>
  Object.entries(playerFrameModules)
    .filter(([filePath]) => filePath.includes(`/01_Maxine/${folder}/`))
    .sort(([left], [right]) => extractOrder(left) - extractOrder(right))
    .map(([, url]) => url);

export const PLAYER_BODY_BOUNDS = {
  width: 16,
  height: 41,
  offsetX: 56,
  offsetY: 23,
  scale: 1.2,
};

export const PLAYER_SPRITE_ANIMATIONS = animationDefinitions
  .map((definition) => ({
    ...definition,
    texturePrefix: `player_maxine_${definition.key}`,
    animationKey: `player_maxine_${definition.key}`,
    frames: buildFrameUrls(definition.folder),
  }))
  .filter((definition) => definition.frames.length > 0);

export const PLAYER_DEFAULT_TEXTURE_KEY = `${PLAYER_SPRITE_ANIMATIONS.find((definition) => definition.key === 'idle')?.texturePrefix || 'player_maxine_idle'}_0`;
