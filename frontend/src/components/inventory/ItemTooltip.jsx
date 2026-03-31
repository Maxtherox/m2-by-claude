import React from 'react';
import { useSelector } from 'react-redux';
import { getRarityColor, getRarityLabel, formatNumber, getEquipmentSlotLabel } from '../../utils/helpers';

export default function ItemTooltip({ item }) {
  if (!item) return null;

  const equipment = useSelector((state) => state.inventory.equipment);
  const rarityColor = getRarityColor(item.rarity);

  // Find currently equipped item in same slot for comparison
  const equippedItem = item.equipSlot ? equipment[item.equipSlot] : null;

  const renderStatComparison = (label, itemVal, equippedVal) => {
    if (itemVal == null && equippedVal == null) return null;
    const iv = itemVal ?? 0;
    const ev = equippedVal ?? 0;
    const diff = iv - ev;
    return (
      <div key={label} className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-200">
          {iv}
          {equippedItem && diff !== 0 && (
            <span className={diff > 0 ? 'text-metin-green ml-1' : 'text-metin-red ml-1'}>
              ({diff > 0 ? '+' : ''}{diff})
            </span>
          )}
        </span>
      </div>
    );
  };

  return (
    <div className="tooltip">
      {/* Name */}
      <div className="font-medieval text-base mb-1" style={{ color: rarityColor, textShadow: `0 0 5px ${rarityColor}40` }}>
        {item.name}
        {item.refinement > 0 && <span className="text-metin-gold"> +{item.refinement}</span>}
      </div>

      {/* Rarity + Type */}
      <div className="text-sm text-gray-500 mb-1">
        <span style={{ color: rarityColor }}>{getRarityLabel(item.rarity)}</span>
        {item.equipSlot && <span> - {getEquipmentSlotLabel(item.equipSlot)}</span>}
        {item.type && !item.equipSlot && <span> - {item.type}</span>}
      </div>

      {/* Level requirement */}
      {item.levelRequired > 0 && (
        <div className="text-sm text-yellow-600 mb-1">
          Nivel requerido: {item.levelRequired}
        </div>
      )}

      <div className="divider" />

      {/* Stats */}
      {item.stats && (
        <div className="space-y-0.5 mb-2">
          {renderStatComparison('Ataque', item.stats.attack, equippedItem?.stats?.attack)}
          {renderStatComparison('Ataque Magico', item.stats.magicAttack, equippedItem?.stats?.magicAttack)}
          {renderStatComparison('Defesa', item.stats.defense, equippedItem?.stats?.defense)}
          {renderStatComparison('Defesa Magica', item.stats.magicDefense, equippedItem?.stats?.magicDefense)}
          {renderStatComparison('HP', item.stats.hp, equippedItem?.stats?.hp)}
          {renderStatComparison('MP', item.stats.mp, equippedItem?.stats?.mp)}
          {renderStatComparison('Vel. Ataque', item.stats.attackSpeed, equippedItem?.stats?.attackSpeed)}
          {renderStatComparison('Critico', item.stats.critChance, equippedItem?.stats?.critChance)}
        </div>
      )}

      {/* Bonuses */}
      {item.bonuses && item.bonuses.length > 0 && (
        <div className="space-y-0.5 mb-2">
          {item.bonuses.map((bonus, i) => (
            <div key={i} className={`text-sm ${bonus.type === 'special' ? 'text-metin-purple' : 'text-metin-blue'}`}>
              {bonus.name}: +{bonus.value}{bonus.isPercent ? '%' : ''}
            </div>
          ))}
        </div>
      )}

      {/* Effects for consumables */}
      {item.effects && (
        <div className="space-y-0.5 mb-2">
          {item.effects.map((effect, i) => (
            <div key={i} className="text-sm text-metin-green">
              {effect.description || `${effect.type}: +${effect.value}`}
            </div>
          ))}
        </div>
      )}

      {/* Description */}
      {item.description && (
        <div className="text-sm text-gray-500 italic mt-1 mb-1">{item.description}</div>
      )}

      <div className="divider" />

      {/* Sell price */}
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Preco de venda</span>
        <span className="text-metin-gold">{formatNumber(item.sellPrice ?? Math.floor((item.price ?? 0) / 2))} ouro</span>
      </div>

      {/* Comparison indicator */}
      {equippedItem && (
        <div className="text-sm text-gray-600 mt-1 text-center italic">
          Comparando com item equipado
        </div>
      )}
    </div>
  );
}
