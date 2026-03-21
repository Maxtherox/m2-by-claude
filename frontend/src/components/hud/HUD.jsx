import React from 'react';
import { useSelector } from 'react-redux';
import ProgressBar from '../common/ProgressBar';
import { formatNumber, getKingdomColor, calcExpPercent } from '../../utils/helpers';

export default function HUD() {
  const character = useSelector((state) => state.character.data);
  if (!character) return null;

  const hp = character.currentHp ?? character.hp ?? 0;
  const maxHp = character.maxHp ?? character.stats?.maxHp ?? 100;
  const mp = character.currentMp ?? character.mp ?? 0;
  const maxMp = character.maxMp ?? character.stats?.maxMp ?? 50;
  const stamina = character.currentStamina ?? character.stamina ?? 0;
  const maxStamina = character.maxStamina ?? character.stats?.maxStamina ?? 100;
  const exp = character.experience ?? character.exp ?? 0;
  const expReq = character.experienceRequired ?? character.expRequired ?? 100;

  return (
    <div className="bg-metin-panel border-b border-metin-border px-4 py-2 flex items-center gap-4 z-30 relative"
      style={{ backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)' }}>
      {/* Character info */}
      <div className="flex items-center gap-2 min-w-[150px]">
        <div className={`w-8 h-8 rounded-sm border border-metin-border-gold flex items-center justify-center text-sm font-bold bg-metin-dark ${getKingdomColor(character.kingdom)}`}>
          {character.level || 1}
        </div>
        <div>
          <div className="text-metin-gold font-medieval text-sm leading-tight" style={{ textShadow: '0 0 5px rgba(212,168,50,0.3)' }}>
            {character.name}
          </div>
          <div className="text-gray-500 text-xs font-medieval">
            {character.className || character.class}
          </div>
        </div>
      </div>

      {/* Bars */}
      <div className="flex-1 space-y-1 max-w-md">
        <ProgressBar type="hp" current={hp} max={maxHp} showText />
        <ProgressBar type="mp" current={mp} max={maxMp} showText />
        <div className="flex gap-2">
          <div className="flex-1">
            <ProgressBar type="stamina" current={stamina} max={maxStamina} small />
          </div>
          <div className="flex-1">
            <ProgressBar type="exp" current={exp} max={expReq} small />
          </div>
        </div>
      </div>

      {/* Gold */}
      <div className="flex items-center gap-1 min-w-[100px] justify-end">
        <span className="text-yellow-500 text-sm">$</span>
        <span className="text-metin-gold font-medieval text-sm">
          {formatNumber(character.gold ?? 0)}
        </span>
      </div>

      {/* Kingdom badge */}
      <div className={`px-2 py-1 rounded-sm border text-xs font-medieval
        ${character.kingdom === 'shinsoo' ? 'border-kingdom-shinsoo/50 text-kingdom-shinsoo bg-kingdom-shinsoo/10' :
          character.kingdom === 'chunjo' ? 'border-kingdom-chunjo/50 text-kingdom-chunjo bg-kingdom-chunjo/10' :
          'border-kingdom-jinno/50 text-kingdom-jinno bg-kingdom-jinno/10'}`}>
        {character.kingdom?.charAt(0).toUpperCase() + character.kingdom?.slice(1)}
      </div>
    </div>
  );
}
