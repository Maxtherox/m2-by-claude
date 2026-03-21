import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closePanel, addNotification } from '../../store/slices/uiSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import { fetchInventory } from '../../store/slices/inventorySlice';
import * as api from '../../services/api';

export default function IdlePanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const areaDetails = useSelector((s) => s.game.areaDetails);
  const [session, setSession] = useState(null);
  const [type, setType] = useState('combat');
  const [mobId, setMobId] = useState('');
  const [duration, setDuration] = useState(300);
  const [checking, setChecking] = useState(false);

  const mobs = areaDetails?.mobs || [];

  const checkSession = () => {
    if (character?.id) {
      api.checkIdleSession(character.id).then((res) => {
        if (res.success) setSession(res.data);
      }).catch(() => {});
    }
  };

  useEffect(() => { checkSession(); }, [character?.id]);

  const handleStart = async () => {
    if (!character) return;
    try {
      const data = { type, area_id: character.current_area_id, mob_id: type === 'combat' ? parseInt(mobId) : null, duration };
      const res = await api.startIdleSession(character.id, data);
      if (res.success) {
        dispatch(addNotification({ type: 'success', message: res.data.message }));
        checkSession();
      }
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: e.response?.data?.error || 'Erro' }));
    }
  };

  const handleCollect = async () => {
    if (!character) return;
    setChecking(true);
    try {
      const res = await api.collectIdleResults(character.id);
      if (res.success) {
        const d = res.data;
        let msg = `Idle concluido! Ciclos: ${d.cycles_completed}`;
        if (d.exp_gained) msg += ` | +${d.exp_gained} EXP`;
        if (d.gold_gained) msg += ` | +${d.gold_gained} Gold`;
        if (d.kills) msg += ` | ${d.kills} kills`;
        dispatch(addNotification({ type: 'loot', message: msg }));
        dispatch(loadCharacter(character.id));
        dispatch(fetchInventory(character.id));
        setSession(null);
      }
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: e.response?.data?.error || 'Erro' }));
    }
    setChecking(false);
  };

  return (
    <div className="metin-panel-gold p-4 w-[380px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="panel-title !mb-0 !pb-0 !border-0">Farm Idle</h2>
        <button onClick={() => dispatch(closePanel())} className="text-gray-500 hover:text-metin-gold">X</button>
      </div>
      <div className="divider-gold" />

      {session?.active ? (
        <div>
          <div className="metin-panel p-3 mb-3">
            <div className="text-sm font-medieval text-metin-gold mb-1">Sessao Ativa</div>
            <div className="text-xs space-y-1">
              <div className="stat-row"><span className="stat-label">Tipo</span><span className="stat-value">{session.type}</span></div>
              <div className="stat-row"><span className="stat-label">Ciclos</span><span className="stat-value">{session.total_cycles}</span></div>
              <div className="stat-row"><span className="stat-label">Tempo restante</span><span className="stat-value">{session.remaining}s</span></div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={checkSession} className="metin-btn flex-1">Atualizar</button>
            <button onClick={handleCollect} disabled={checking || session.total_cycles < 1}
              className="metin-btn-gold flex-1 disabled:opacity-50">
              {checking ? 'Coletando...' : 'Coletar'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="space-y-3 mb-3">
            <div>
              <label className="text-xs text-gray-400 font-medieval">Tipo</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="metin-input text-sm">
                <option value="combat">Combate</option>
                <option value="mining">Mineracao</option>
                <option value="woodcutting">Lenhador</option>
                <option value="farming">Agricultura</option>
              </select>
            </div>

            {type === 'combat' && (
              <div>
                <label className="text-xs text-gray-400 font-medieval">Monstro</label>
                <select value={mobId} onChange={(e) => setMobId(e.target.value)} className="metin-input text-sm">
                  <option value="">Selecione...</option>
                  {mobs.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} (Lv.{m.level})</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-xs text-gray-400 font-medieval">Duracao (segundos)</label>
              <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value) || 300)}
                min={30} max={3600} className="metin-input text-sm" />
              <div className="text-xs text-gray-600 mt-1">{Math.floor(duration / 60)} min</div>
            </div>
          </div>

          <button onClick={handleStart}
            disabled={(type === 'combat' && !mobId) || (character?.stamina || 0) < 5}
            className="metin-btn-gold w-full disabled:opacity-50">
            Iniciar Sessao Idle
          </button>
        </div>
      )}
    </div>
  );
}
