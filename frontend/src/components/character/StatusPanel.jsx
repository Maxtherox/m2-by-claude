import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { allocatePoints } from '../../store/slices/characterSlice';
import { closePanel } from '../../store/slices/uiSlice';
import ProgressBar from '../common/ProgressBar';
import { formatNumber } from '../../utils/helpers';
import { Metin2Panel, Metin2TitleBar, Metin2Button, Metin2Box } from '../metin2ui';

const STATS = [
  { key: 'strength', label: 'Forca', abbr: 'FOR', color: 'text-red-400', icon: '⚔' },
  { key: 'intelligence', label: 'Inteligencia', abbr: 'INT', color: 'text-blue-400', icon: '✦' },
  { key: 'vitality', label: 'Vitalidade', abbr: 'VIT', color: 'text-green-400', icon: '♥' },
  { key: 'dexterity', label: 'Destreza', abbr: 'DEX', color: 'text-yellow-400', icon: '◇' },
];

export default function StatusPanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const [tempAlloc, setTempAlloc] = useState({ strength: 0, intelligence: 0, vitality: 0, dexterity: 0 });

  const resetAlloc = useCallback(() => {
    setTempAlloc({ strength: 0, intelligence: 0, vitality: 0, dexterity: 0 });
  }, []);

  if (!character) return null;

  const ch = character;
  const ds = ch.derived_stats || {};
  const sp = ch.status_points || 0;
  const totalUsed = tempAlloc.strength + tempAlloc.intelligence + tempAlloc.vitality + tempAlloc.dexterity;
  const remaining = sp - totalUsed;
  const hasPending = totalUsed > 0;

  const addPoint = (stat) => {
    if (remaining > 0) {
      setTempAlloc((prev) => ({ ...prev, [stat]: prev[stat] + 1 }));
    }
  };

  const removePoint = (stat) => {
    if (tempAlloc[stat] > 0) {
      setTempAlloc((prev) => ({ ...prev, [stat]: prev[stat] - 1 }));
    }
  };

  const handleConfirm = () => {
    if (hasPending) {
      dispatch(allocatePoints({ id: ch.id, points: tempAlloc }));
      resetAlloc();
    }
  };

  const handleCancel = () => {
    resetAlloc();
  };

  const handleClose = () => {
    resetAlloc();
    dispatch(closePanel());
  };

  // Honra
  const honorValue = ch.honor || 0;
  const honorRank = ch.honor_rank || 'Neutra';

  return (
    <Metin2Panel variant="board" className="select-none" style={{ width: 400 }}>
      <Metin2TitleBar title={ch.name} onClose={handleClose} />

      {/* Subtitle */}
      <div className="px-4 py-1 flex items-center gap-2">
        <span className="text-gray-400 text-sm">Lv. {ch.level}</span>
        <span className="text-gray-600 text-sm">{ch.class_name}</span>
        <span className="text-gray-600 text-sm">·</span>
        <span className="text-amber-600/80 text-sm">{honorRank}</span>
      </div>

      <div className="divider-gold mx-4" />

      {/* Resource bars */}
      <Metin2Box title="Recursos" style={{ margin: '0 8px 8px' }}>
        <div className="space-y-1">
          <ProgressBar type="hp" current={ch.hp} max={ds.max_hp || ch.max_hp} showText />
          <ProgressBar type="mp" current={ch.mp} max={ds.max_mp || ch.max_mp} showText />
          <ProgressBar type="stamina" current={ch.stamina} max={ds.max_stamina || ch.max_stamina} showText />
          <ProgressBar type="exp" current={ch.exp} max={ds.exp_for_next_level || 100} showText />
          <div className="flex justify-between text-[13px] text-gray-600 px-0.5">
            <span>EXP {formatNumber(ch.exp)} / {formatNumber(ds.exp_for_next_level)}</span>
            <span>Total: {formatNumber(ch.exp_total || 0)}</span>
          </div>
        </div>
      </Metin2Box>

      {/* Base attributes with allocation */}
      <Metin2Box title="Atributos" style={{ margin: '0 8px 8px' }}>
        <div>
          {sp > 0 && (
            <div className="flex justify-end mb-2">
              <span className="text-metin-gold text-sm">
                Pontos: <span className={remaining === 0 ? 'text-gray-500' : 'text-metin-green'}>{remaining}</span>
                <span className="text-gray-600">/{sp}</span>
              </span>
            </div>
          )}

          {STATS.map(({ key, label, abbr, color, icon }) => (
            <div key={key} className="flex items-center justify-between py-[3px]">
              <div className="flex items-center gap-1.5 min-w-[110px]">
                <span className={`${color} text-sm opacity-60`}>{icon}</span>
                <span className="stat-label text-sm">{label}</span>
              </div>
              <div className="flex items-center gap-1">
                {sp > 0 && (
                  <button
                    onClick={() => removePoint(key)}
                    disabled={tempAlloc[key] === 0}
                    className="w-5 h-5 flex items-center justify-center text-sm text-gray-500 hover:text-metin-red disabled:opacity-20 disabled:cursor-default transition-colors"
                  >
                    −
                  </button>
                )}
                <span className={`${color} w-10 text-center text-sm font-mono`}>
                  {ch[key]}
                  {tempAlloc[key] > 0 && (
                    <span className="text-metin-green text-sm">+{tempAlloc[key]}</span>
                  )}
                </span>
                {sp > 0 && (
                  <button
                    onClick={() => addPoint(key)}
                    disabled={remaining === 0}
                    className="w-5 h-5 flex items-center justify-center text-sm text-gray-500 hover:text-metin-green disabled:opacity-20 disabled:cursor-default transition-colors"
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Confirm / Cancel */}
          {sp > 0 && (
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={handleCancel}
                disabled={!hasPending}
                className="metin-btn metin-btn-sm !bg-gray-800 !text-gray-400 hover:!text-white disabled:opacity-30"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={!hasPending}
                className="metin-btn metin-btn-sm disabled:opacity-30"
              >
                Confirmar
              </button>
            </div>
          )}
        </div>
      </Metin2Box>

      {/* Derived stats */}
      <Metin2Box title="Combate" style={{ margin: '0 8px 8px' }}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-[2px] text-sm">
          <StatLine label="Ataque" value={ds.attack} color="text-red-300" />
          <StatLine label="Atq. Magico" value={ds.magic_attack} color="text-blue-300" />
          <StatLine label="Defesa" value={ds.defense} color="text-green-300" />
          <StatLine label="Def. Magica" value={ds.magic_defense} color="text-cyan-300" />
          <StatLine label="Critico" value={ds.critical != null ? ds.critical.toFixed(1) + '%' : null} color="text-orange-300" />
          <StatLine label="Esquiva" value={ds.dodge != null ? ds.dodge.toFixed(1) + '%' : null} color="text-yellow-300" />
          <StatLine label="Precisao" value={ds.accuracy} color="text-gray-300" />
          <StatLine label="Velocidade" value={ds.speed != null ? ds.speed.toFixed(1) : null} color="text-purple-300" />
          <StatLine label="Penetracao" value={ds.penetration} color="text-red-200" />
          <StatLine label="Vel. Ataque" value={ds.attack_speed != null ? ds.attack_speed.toFixed(2) : null} color="text-amber-300" />
          <StatLine label="Vel. Movim." value={ds.move_speed != null ? ds.move_speed.toFixed(2) : null} color="text-teal-300" />
        </div>
      </Metin2Box>

      {/* Regen and resources */}
      <Metin2Box title="Regeneração" style={{ margin: '0 8px 8px' }}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-[2px] text-sm">
          <StatLine label="HP Regen" value={ds.hp_regen != null ? ds.hp_regen.toFixed(1) : null} color="text-green-400" suffix="/turno" />
          <StatLine label="MP Regen" value={ds.mp_regen != null ? ds.mp_regen.toFixed(1) : null} color="text-blue-400" suffix="/turno" />
        </div>
      </Metin2Box>

      {/* Footer info */}
      <div className="px-4 py-2 pb-3 flex justify-between text-sm">
        <div>
          <span className="text-gray-600">Ouro</span>{' '}
          <span className="text-metin-gold">{formatNumber(ch.gold)}</span>
        </div>
        <div>
          <span className="text-gray-600">Skill Pts</span>{' '}
          <span className="text-metin-cyan">{ch.skill_points}</span>
        </div>
        <div>
          <span className="text-gray-600">Honra</span>{' '}
          <span className="text-amber-500">{honorValue}</span>
        </div>
      </div>
    </Metin2Panel>
  );
}

function StatLine({ label, value, color, suffix }) {
  const display = value != null && value !== undefined ? value : '—';
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={color}>
        {display}{suffix && display !== '—' && <span className="text-gray-600 text-[13px]"> {suffix}</span>}
      </span>
    </div>
  );
}
