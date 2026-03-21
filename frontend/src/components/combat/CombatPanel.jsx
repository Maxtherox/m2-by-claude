import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closePanel, addNotification, clearActiveMob } from '../../store/slices/uiSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import { fetchInventory } from '../../store/slices/inventorySlice';
import ProgressBar from '../common/ProgressBar';
import * as api from '../../services/api';

export default function CombatPanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const areaDetails = useSelector((s) => s.game.areaDetails);
  const charSkills = useSelector((s) => s.skills.characterSkills);
  const activeMob = useSelector((s) => s.ui.activeMob);

  const [combatState, setCombatState] = useState(null);
  const [log, setLog] = useState([]);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [acting, setActing] = useState(false);
  const [selectedMob, setSelectedMob] = useState(null);
  const logRef = useRef(null);
  const autoStartedMobRef = useRef(null);

  const mobs = areaDetails?.mobs || [];

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  useEffect(() => {
    if (!activeMob?.id) {
      autoStartedMobRef.current = null;
      return;
    }

    if (combatState || acting || autoStartedMobRef.current === activeMob.id) {
      return;
    }

    autoStartedMobRef.current = activeMob.id;
    startFight(activeMob);
  }, [activeMob, combatState, acting]);

  const startFight = async (mob) => {
    if (!character) return;
    try {
      const res = await api.startCombat(character.id, mob.id);
      if (res.success) {
        setCombatState(res.data);
        setLog([]);
        setFinished(false);
        setResult(null);
        setSelectedMob(mob);
      }
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: 'Erro ao iniciar combate' }));
      dispatch(clearActiveMob());
      autoStartedMobRef.current = null;
    }
  };

  const doAction = async (action) => {
    if (!combatState || finished || acting) return;
    setActing(true);
    try {
      const res = await api.combatTurn(character.id, combatState, action);
      if (res.success) {
        const d = res.data;
        setCombatState(d.state);
        setLog((prev) => [...prev, ...(d.log || [])]);
        if (d.finished) {
          setFinished(true);
          setResult(d.result);
          dispatch(loadCharacter(character.id));
          dispatch(fetchInventory(character.id));
        }
      }
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: 'Erro no combate' }));
    }
    setActing(false);
  };

  const getLogColor = (entry) => {
    if (entry.actor === 'character') return entry.critical ? 'text-orange-400' : 'text-metin-green';
    if (entry.actor === 'mob') return 'text-metin-red';
    if (entry.actor === 'dot') return 'text-metin-purple';
    return 'text-metin-gold';
  };

  const formatLog = (entry) => {
    if (entry.action === 'victory' || entry.action === 'defeat') return entry.message;
    const actor = entry.actor === 'character' ? character.name : (selectedMob?.name || 'Mob');
    if (entry.dodged) return `${actor} errou o ataque!`;
    const crit = entry.critical ? ' (CRITICO!)' : '';
    const actionName = entry.action === 'skill' ? entry.skill_name : (entry.action === 'counter' ? 'Contra-ataque' : 'Ataque');
    if (entry.damage < 0) return `${actor} usou ${actionName}: curou ${Math.abs(entry.damage)} HP`;
    return `${actor} usou ${actionName}: ${entry.damage} de dano${crit}`;
  };

  if (!combatState) {
    return (
      <div className="metin-panel-gold p-4 w-[400px]">
        <div className="flex justify-between items-center mb-3">
          <h2 className="panel-title !mb-0 !pb-0 !border-0">Combate</h2>
          <button onClick={() => dispatch(closePanel())} className="text-gray-500 hover:text-metin-gold">X</button>
        </div>
        <div className="divider-gold" />
        {mobs.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum monstro nesta area. Viaje pelo mapa.</p>
        ) : (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {mobs.map((mob) => (
              <button key={mob.id} onClick={() => startFight(mob)}
                className="w-full metin-panel p-3 text-left hover:border-metin-border-gold border border-metin-border rounded-sm transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-gray-200 font-medieval">{mob.name}</span>
                  <span className="text-xs text-gray-500">Lv.{mob.level}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  HP: {mob.hp} | EXP: {mob.exp_reward} | Gold: {mob.gold_min}-{mob.gold_max}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const ch = combatState.character;
  const mob = combatState.mob;

  return (
    <div className="metin-panel-gold p-4 w-[450px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="panel-title !mb-0 !pb-0 !border-0">Combate - Turno {combatState.turn}</h2>
        {finished && <button onClick={() => {
          setCombatState(null);
          setResult(null);
          setSelectedMob(null);
          autoStartedMobRef.current = null;
          dispatch(clearActiveMob());
        }} className="metin-btn metin-btn-sm">Voltar</button>}
      </div>
      <div className="divider-gold" />

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="metin-panel p-3">
          <div className="text-metin-gold text-sm font-medieval mb-1">{ch.name}</div>
          <ProgressBar type="hp" current={ch.hp} max={ch.maxHp} showText />
          <ProgressBar type="mp" current={ch.mp} max={ch.maxMp} showText />
        </div>
        <div className="metin-panel p-3">
          <div className="text-metin-red text-sm font-medieval mb-1">{mob.name}</div>
          <ProgressBar type="hp" current={mob.hp} max={mob.maxHp} showText />
        </div>
      </div>

      <div ref={logRef} className="metin-panel p-2 h-32 overflow-y-auto mb-3 text-xs space-y-0.5">
        {log.map((entry, i) => (
          <div key={i} className={getLogColor(entry)}>{formatLog(entry)}</div>
        ))}
        {log.length === 0 && <div className="text-gray-600">Combate iniciado...</div>}
      </div>

      {finished && result && (
        <div className={`metin-panel p-3 mb-3 animate-slide-in border ${result.winner === 'character' ? 'border-metin-green' : 'border-metin-red'}`}>
          <h3 className={`font-medieval text-sm mb-1 ${result.winner === 'character' ? 'text-metin-green' : 'text-metin-red'}`}>
            {result.winner === 'character' ? 'Vitoria!' : 'Derrota!'}
          </h3>
          {result.winner === 'character' && (
            <div className="text-xs space-y-0.5">
              <div className="text-metin-gold">+{result.exp_reward} EXP</div>
              <div className="text-yellow-400">+{result.gold_reward} Ouro</div>
              {result.leveled_up && <div className="text-metin-green font-bold">Level Up! Lv.{result.new_level}</div>}
              {result.drops?.length > 0 && result.drops.map((d, i) => (
                <div key={i} className="text-metin-cyan">Loot: {d.name} x{d.quantity}</div>
              ))}
            </div>
          )}
          {result.winner === 'mob' && (
            <div className="text-xs text-gray-400">Voce perdeu {result.gold_penalty} de ouro.</div>
          )}
        </div>
      )}

      {!finished && (
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => doAction({ type: 'attack' })} disabled={acting} className="metin-btn metin-btn-sm disabled:opacity-50">
            Atacar
          </button>
          {(Array.isArray(charSkills) ? charSkills : []).filter(s => s.type === 'active').map((skill) => (
            <button key={skill.skill_id || skill.id}
              onClick={() => doAction({ type: 'skill', skill_id: skill.skill_id || skill.id })}
              disabled={acting}
              className="metin-btn metin-btn-sm disabled:opacity-50">
              {skill.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
