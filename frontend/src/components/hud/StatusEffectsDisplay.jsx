import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getActiveEffects } from '../../services/api';

const BUFF_TYPES = ['buff_stat', 'regen', 'shield', 'hot'];
const DEBUFF_TYPES = ['debuff_stat', 'dot', 'stun', 'slow'];

function isBuff(type) {
  return BUFF_TYPES.includes(type);
}

function getEffectColors(type) {
  if (isBuff(type)) {
    return {
      border: 'border-green-500/30',
      text: 'text-green-400',
      bg: 'bg-green-900/20',
    };
  }
  return {
    border: 'border-red-500/30',
    text: 'text-red-400',
    bg: 'bg-red-900/20',
  };
}

function EffectTooltip({ effect }) {
  const colors = getEffectColors(effect.type);
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none">
      <div className={`bg-metin-dark border ${colors.border} rounded px-2 py-1.5 text-sm whitespace-nowrap shadow-lg`}>
        <div className={`font-bold ${colors.text} mb-0.5`}>{effect.name}</div>
        {effect.description && (
          <div className="text-gray-400 mb-0.5">{effect.description}</div>
        )}
        <div className="text-gray-500 space-y-0.5">
          <div>Turns remaining: {effect.remaining_turns}</div>
          {effect.stacks > 1 && <div>Stacks: {effect.stacks}</div>}
          {effect.stat_affected && (
            <div>
              {effect.stat_affected}: {effect.is_percentage ? '' : ''}
              {effect.value > 0 ? '+' : ''}{effect.value}
              {effect.is_percentage ? '%' : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EffectBadge({ effect }) {
  const [hovered, setHovered] = useState(false);
  const colors = getEffectColors(effect.type);

  const label = effect.icon || (effect.name ? effect.name.charAt(0).toUpperCase() : '?');

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`
          flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border text-[13px] leading-none
          cursor-default select-none
          ${colors.border} ${colors.bg} ${colors.text}
        `}
      >
        <span className="font-bold">{label}</span>
        <span className="text-[13px] opacity-70">{effect.remaining_turns}t</span>
        {effect.stacks > 1 && (
          <span className="text-[13px] opacity-60">x{effect.stacks}</span>
        )}
      </div>
      {hovered && <EffectTooltip effect={effect} />}
    </div>
  );
}

export default function StatusEffectsDisplay() {
  const character = useSelector((s) => s.character.data);
  const [effects, setEffects] = useState([]);

  useEffect(() => {
    if (!character?.id) return;

    let cancelled = false;

    function fetchEffects() {
      getActiveEffects(character.id)
        .then((data) => {
          if (!cancelled) {
            setEffects(Array.isArray(data) ? data : data.effects || []);
          }
        })
        .catch(() => {});
    }

    fetchEffects();
    const interval = setInterval(fetchEffects, 10000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [character?.id]);

  if (!effects.length) return null;

  return (
    <div className="flex gap-1 items-center">
      {effects.map((effect) => (
        <EffectBadge key={effect.id} effect={effect} />
      ))}
    </div>
  );
}
