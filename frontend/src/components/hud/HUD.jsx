import React from 'react';
import { useSelector } from 'react-redux';
import { Metin2GaugeBar, Metin2EnergyGauge } from '../metin2ui';
import { formatNumber, getKingdomColor } from '../../utils/helpers';
import { GiTwoCoins } from 'react-icons/gi';

export default function HUD() {
  const character = useSelector((state) => state.character.data);
  if (!character) return null;

  const ds         = character.derived_stats || {};
  const hp         = character.hp ?? 0;
  const maxHp      = ds.max_hp ?? character.max_hp ?? 100;
  const mp         = character.mp ?? 0;
  const maxMp      = ds.max_mp ?? character.max_mp ?? 50;
  const stamina    = character.stamina ?? 0;
  const maxStamina = ds.max_stamina ?? character.max_stamina ?? 100;
  const exp        = character.exp ?? 0;
  const expReq     = ds.exp_for_next_level ?? character.max_exp ?? 100;
  const kingdom    = character.kingdom_name ?? character.kingdom ?? '';
  const className  = character.class_name ?? character.className ?? character.class ?? '';

  return (
    <div
      className="m2-taskbar flex items-center gap-3 px-3 z-30 relative"
      style={{ height: 52, minHeight: 52 }}
    >
      {/* Character info */}
      <div className="flex items-center gap-2 min-w-[120px]">
        <div
          className={`w-8 h-8 flex items-center justify-center text-sm font-bold ${getKingdomColor(kingdom)}`}
          style={{
            backgroundImage: 'url(/ui/pattern/board_base.png)',
            backgroundRepeat: 'repeat',
            border: '1px solid #8b7332',
          }}
        >
          {character.level || 1}
        </div>
        <div>
          <div className="m2-text-name text-sm leading-tight">
            {character.name}
          </div>
          <div className="text-gray-500" style={{ fontSize: 13 }}>
            {className}
          </div>
        </div>
      </div>

      {/* HP / MP gauges using real sprites */}
      <div className="flex-1 space-y-1 max-w-sm">
        <div className="flex items-center gap-1">
          <span style={{ fontSize: 14, color: '#c83030', width: 16, textAlign: 'center', fontWeight: 'bold' }}>HP</span>
          <Metin2GaugeBar type="hp" current={hp} max={maxHp} showText />
        </div>
        <div className="flex items-center gap-1">
          <span style={{ fontSize: 14, color: '#3060c8', width: 16, textAlign: 'center', fontWeight: 'bold' }}>MP</span>
          <Metin2GaugeBar type="mp" current={mp} max={maxMp} showText />
        </div>
        <div className="flex items-center gap-1">
          <span style={{ fontSize: 14, color: '#c8a030', width: 16, textAlign: 'center', fontWeight: 'bold' }}>ST</span>
          <Metin2GaugeBar type="st" current={stamina} max={maxStamina} />
        </div>
      </div>

      {/* EXP bar (uses fallback gauge_slot style) */}
      <div style={{ width: 120 }}>
        <div className="flex items-center gap-1">
          <span style={{ fontSize: 14, color: '#e080a0', width: 20, textAlign: 'center' }}>EXP</span>
          <Metin2GaugeBar type="exp" current={exp} max={expReq} showText />
        </div>
      </div>

      {/* Energy gauge (semicircular meter) */}
      <Metin2EnergyGauge current={stamina} max={maxStamina} />

      {/* Gold */}
      <div className="flex items-center gap-1 min-w-[80px] justify-end">
        <GiTwoCoins className="text-yellow-500" style={{ fontSize: 14 }} />
        <span className="m2-text-gold" style={{ fontSize: 14 }}>
          {formatNumber(character.gold ?? 0)}
        </span>
      </div>

      {/* Kingdom badge */}
      <div
        className={`px-2 py-1
          ${kingdom.toLowerCase() === 'shinsoo' ? 'text-kingdom-shinsoo' :
            kingdom.toLowerCase() === 'chunjo'  ? 'text-kingdom-chunjo' :
            'text-kingdom-jinno'}`}
        style={{
          backgroundImage: 'url(/ui/pattern/board_base.png)',
          backgroundRepeat: 'repeat',
          border: '1px solid #5a4a1a',
          fontSize: 13,
          fontWeight: 'bold',
        }}
      >
        {kingdom ? kingdom.charAt(0).toUpperCase() + kingdom.slice(1) : '—'}
      </div>
    </div>
  );
}
