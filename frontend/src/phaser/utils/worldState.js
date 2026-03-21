import { getAreaTypeFromName } from '../config/areaLayouts';

export function normalizeNpcType(type) {
  const value = String(type || '').toLowerCase();

  if (value === 'material') return 'material_shop';
  if (value === 'trainer') return 'skill_trainer';
  if (value === 'lifeskill') return 'lifeskill_master';

  return value || 'shop';
}

export function getNpcSpriteType(type) {
  const normalized = normalizeNpcType(type);

  if (normalized === 'material_shop') return 'material';
  if (normalized === 'skill_trainer') return 'trainer';
  if (normalized === 'lifeskill_master') return 'lifeskill';

  return normalized;
}

export function getAreasFromState(state) {
  const areas = state?.game?.areas;
  if (Array.isArray(areas)) return areas;
  if (Array.isArray(areas?.data)) return areas.data;
  return [];
}

export function resolveAreaContext(state, areaId, fallbackAreaName = '') {
  const areas = getAreasFromState(state);
  const areaDetails = state?.game?.areaDetails;
  const currentDetails = areaDetails?.id === areaId ? areaDetails : null;
  const listedArea = areas.find((area) => area.id === areaId) || null;

  const areaName = currentDetails?.name
    || listedArea?.name
    || fallbackAreaName
    || 'Vila Inicial';

  const areaType = currentDetails?.type
    || currentDetails?.area_type
    || listedArea?.type
    || listedArea?.area_type
    || getAreaTypeFromName(areaName)
    || 'village';

  return {
    areaDetails: currentDetails,
    listedArea,
    areaName,
    areaType,
  };
}

export function resolvePortalDestination(state, targetType, currentAreaId) {
  const areas = getAreasFromState(state);
  const character = state?.character?.data;
  const currentArea = areas.find((area) => area.id === currentAreaId);

  if (!targetType) return null;

  const matches = areas.filter((area) => area.type === targetType || area.area_type === targetType);
  if (matches.length === 0) return null;

  if (targetType !== 'village') {
    return matches[0];
  }

  const kingdomId = character?.kingdom_id || currentArea?.kingdom_id || null;
  return matches.find((area) => area.kingdom_id === kingdomId) || matches[0];
}
