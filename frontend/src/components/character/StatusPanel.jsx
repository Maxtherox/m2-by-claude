import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { allocatePoints } from '../../store/slices/characterSlice';
import { closePanel } from '../../store/slices/uiSlice';
import ProgressBar from '../common/ProgressBar';
import { formatNumber, getEquipmentSlotLabel } from '../../utils/helpers';

export default function StatusPanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const [points, setPoints] = useState({ strength: 0, intelligence: 0, vitality: 0, dexterity: 0 });

  if (!character) return null;

  const ch = character;
  const ds = ch.derived_stats || {};
  const sp = ch.status_points || 0;
  const used = points.strength + points.intelligence + points.vitality + points.dexterity;

  const addPoint = (stat) => {
    if (used < sp) setPoints({ ...points, [stat]: points[stat] + 1 });
  };
  const removePoint = (stat) => {
    if (points[stat] > 0) setPoints({ ...points, [stat]: points[stat] - 1 });
  };

  const handleAllocate = () => {
    if (used > 0) {
      dispatch(allocatePoints({ id: ch.id, points }));
      setPoints({ strength: 0, intelligence: 0, vitality: 0, dexterity: 0 });
    }
  };

  const statRow = (label, base, bonus, color) => (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <span className={`stat-value ${color}`}>
        {base}{bonus > 0 && <span className="text-metin-green text-xs"> +{bonus}</span>}
      </span>
    </div>
  );

  return (
    <div className="metin-panel-gold p-4 w-[380px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="panel-title !mb-0 !pb-0 !border-0">Status</h2>
        <button onClick={() => dispatch(closePanel())} className="text-gray-500 hover:text-metin-gold">X</button>
      </div>
      <div className="divider-gold" />

      <div className="flex items-center gap-3 mb-3">
        <div className="text-metin-gold font-medieval text-lg">{ch.name}</div>
        <span className="text-gray-500 text-sm">Lv.{ch.level}</span>
        <span className="text-gray-600 text-xs">{ch.class_name}</span>
      </div>

      <div className="space-y-1 mb-3">
        <ProgressBar type="hp" current={ch.hp} max={ds.max_hp || ch.max_hp} showText />
        <ProgressBar type="mp" current={ch.mp} max={ds.max_mp || ch.max_mp} showText />
        <ProgressBar type="stamina" current={ch.stamina} max={ds.max_stamina || ch.max_stamina} showText />
        <ProgressBar type="exp" current={ch.exp} max={ds.exp_for_next_level || 100} showText />
      </div>

      <div className="divider" />
      <h3 className="text-metin-gold text-sm font-medieval mb-2">Atributos Base</h3>

      {[
        ['Forca', 'strength', 'text-red-400'],
        ['Inteligencia', 'intelligence', 'text-blue-400'],
        ['Vitalidade', 'vitality', 'text-green-400'],
        ['Destreza', 'dexterity', 'text-yellow-400'],
      ].map(([label, key, color]) => (
        <div key={key} className="flex items-center justify-between py-0.5">
          <span className="stat-label">{label}</span>
          <div className="flex items-center gap-1">
            {sp > 0 && <button onClick={() => removePoint(key)} className="text-xs text-gray-500 hover:text-metin-red w-4">-</button>}
            <span className={`stat-value ${color} w-8 text-center`}>
              {ch[key]}{points[key] > 0 && <span className="text-metin-green">+{points[key]}</span>}
            </span>
            {sp > 0 && <button onClick={() => addPoint(key)} className="text-xs text-gray-500 hover:text-metin-green w-4">+</button>}
          </div>
        </div>
      ))}

      {sp > 0 && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-metin-gold text-xs">Pontos: {sp - used}</span>
          <button onClick={handleAllocate} disabled={used === 0} className="metin-btn metin-btn-sm disabled:opacity-50">
            Aplicar
          </button>
        </div>
      )}

      <div className="divider" />
      <h3 className="text-metin-gold text-sm font-medieval mb-2">Stats Derivados</h3>
      {statRow('Ataque', ds.attack, 0, 'text-red-300')}
      {statRow('Ataque Magico', ds.magic_attack, 0, 'text-blue-300')}
      {statRow('Defesa', ds.defense, 0, 'text-green-300')}
      {statRow('Defesa Magica', ds.magic_defense, 0, 'text-cyan-300')}
      {statRow('Critico', ds.critical?.toFixed(1) + '%', 0, 'text-orange-300')}
      {statRow('Esquiva', ds.dodge?.toFixed(1) + '%', 0, 'text-yellow-300')}
      {statRow('Precisao', ds.accuracy, 0, 'text-gray-300')}
      {statRow('Velocidade', ds.speed?.toFixed(1), 0, 'text-purple-300')}
      {statRow('Penetracao', ds.penetration, 0, 'text-red-200')}

      <div className="divider" />
      <div className="stat-row">
        <span className="stat-label">Ouro</span>
        <span className="text-metin-gold">{formatNumber(ch.gold)}</span>
      </div>
      <div className="stat-row">
        <span className="stat-label">Skill Points</span>
        <span className="text-metin-cyan">{ch.skill_points}</span>
      </div>
    </div>
  );
}
