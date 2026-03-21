import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetCombat } from '../../store/slices/combatSlice';
import { closePanel } from '../../store/slices/uiSlice';

export default function CombatResultModal() {
  const dispatch = useDispatch();
  const result = useSelector((s) => s.combat.result);
  if (!result) return null;

  const isVictory = result.winner === 'character';

  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/60">
      <div className={`metin-panel-gold p-6 w-[350px] animate-slide-in border-2 ${isVictory ? 'border-metin-green' : 'border-metin-red'}`}>
        <h2 className={`text-2xl font-medieval text-center mb-4 ${isVictory ? 'text-metin-green' : 'text-metin-red'}`}
          style={{ textShadow: `0 0 15px ${isVictory ? 'rgba(48,168,48,0.5)' : 'rgba(200,48,48,0.5)'}` }}>
          {isVictory ? 'Vitoria!' : 'Derrota!'}
        </h2>

        {isVictory && (
          <div className="space-y-2 mb-4">
            <div className="stat-row">
              <span className="stat-label">EXP ganho</span>
              <span className="text-metin-gold">+{result.exp_reward}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Ouro ganho</span>
              <span className="text-yellow-400">+{result.gold_reward}</span>
            </div>
            {result.leveled_up && (
              <div className="text-center text-metin-green font-medieval text-lg animate-glow">
                Level Up! Lv.{result.new_level}
              </div>
            )}
            {result.drops?.length > 0 && (
              <>
                <div className="divider" />
                <div className="text-xs text-gray-400 font-medieval">Itens obtidos:</div>
                {result.drops.map((d, i) => (
                  <div key={i} className="text-sm text-metin-cyan">{d.name} x{d.quantity}</div>
                ))}
              </>
            )}
          </div>
        )}

        {!isVictory && (
          <div className="text-center text-gray-400 text-sm mb-4">
            <p>Voce foi derrotado e perdeu {result.gold_penalty || 0} de ouro.</p>
          </div>
        )}

        <button onClick={() => { dispatch(resetCombat()); dispatch(closePanel()); }}
          className="metin-btn-gold w-full">
          Continuar
        </button>
      </div>
    </div>
  );
}
