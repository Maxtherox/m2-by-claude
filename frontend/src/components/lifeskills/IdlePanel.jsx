import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closePanel, addNotification } from '../../store/slices/uiSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import { fetchInventory } from '../../store/slices/inventorySlice';
import * as api from '../../services/api';
import { GiSwordman, GiMineWagon, GiWoodAxe, GiWheat } from 'react-icons/gi';
import { FaMapMarkerAlt, FaClock, FaSync } from 'react-icons/fa';
import { Metin2Window, Metin2Box } from '../metin2ui';

const TYPE_DEFS = [
  { value: 'combat',      label: 'Combate',     Icon: GiSwordman,  resourceType: null },
  { value: 'mining',      label: 'Mineração',   Icon: GiMineWagon, resourceType: 'mining' },
  { value: 'woodcutting', label: 'Lenhador',    Icon: GiWoodAxe,   resourceType: 'woodcutting' },
  { value: 'farming',     label: 'Agricultura', Icon: GiWheat,     resourceType: 'farming' },
];

export default function IdlePanel() {
  const dispatch   = useDispatch();
  const character  = useSelector((s) => s.character.data);
  const areaDetails = useSelector((s) => s.game.areaDetails);
  const [session, setSession]   = useState(null);
  const [type, setType]         = useState('combat');
  const [mobId, setMobId]       = useState('');
  const [duration, setDuration] = useState(300);
  const [checking, setChecking] = useState(false);

  const mobs = areaDetails?.mobs || [];
  const areaResources = areaDetails?.resources || [];
  const availableTypes = new Set(areaResources.map((r) => r.resource_type || r.type));
  const hasMobs = mobs.length > 0;
  const areaName = areaDetails?.name || 'área atual';

  const isTypeAvailable = (t) => {
    if (t === 'combat') return hasMobs;
    return availableTypes.has(t);
  };

  const checkSession = () => {
    if (character?.id) {
      api.checkIdleSession(character.id)
        .then((res) => { if (res.success) setSession(res.data); })
        .catch(() => {});
    }
  };

  useEffect(() => { checkSession(); }, [character?.id]);

  const handleStart = async () => {
    if (!character) return;
    try {
      const data = {
        type,
        area_id: character.current_area_id,
        mob_id: type === 'combat' ? parseInt(mobId) || null : null,
        duration,
      };
      const res = await api.startIdleSession(character.id, data);
      if (res.success) {
        dispatch(addNotification({ type: 'success', message: res.data.message }));
        checkSession();
      }
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: e.response?.data?.error || 'Erro ao iniciar sessão' }));
    }
  };

  const handleCollect = async () => {
    if (!character) return;
    setChecking(true);
    try {
      const res = await api.collectIdleResults(character.id);
      if (res.success) {
        const d = res.data;
        let msg = `Idle concluído! Ciclos: ${d.cycles_completed}`;
        if (d.exp_gained)  msg += ` | +${d.exp_gained} EXP`;
        if (d.gold_gained) msg += ` | +${d.gold_gained} Ouro`;
        if (d.kills)       msg += ` | ${d.kills} kills`;
        if (d.inventory_full) msg += ' | Inventário cheio!';
        dispatch(addNotification({ type: 'loot', message: msg }));
        dispatch(loadCharacter(character.id));
        dispatch(fetchInventory(character.id));
        setSession(null);
      }
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: e.response?.data?.error || 'Erro ao coletar' }));
    }
    setChecking(false);
  };

  const selectedTypeDef = TYPE_DEFS.find((t) => t.value === type);
  const canStart = isTypeAvailable(type) &&
    (type !== 'combat' || mobId) &&
    (character?.stamina || 0) >= 5;

  return (
    <Metin2Window title="Farm Idle" onClose={() => dispatch(closePanel())} variant="board" style={{ width: 380 }}>

      {/* Área atual */}
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
        <FaMapMarkerAlt className="text-metin-gold" />
        <span>{areaName}</span>
      </div>

      {session?.active ? (
        <div>
          <Metin2Box variant="a" style={{ marginBottom: 12 }}>
            <div className="text-sm font-medieval text-metin-gold mb-2">Sessão Ativa</div>
            <div className="text-sm space-y-1">
              <div className="stat-row">
                <span className="stat-label">Tipo</span>
                <span className="stat-value capitalize">{session.type}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Ciclos</span>
                <span className="stat-value">{session.total_cycles}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label flex items-center gap-1"><FaClock className="text-metin-gold" /> Restante</span>
                <span className="stat-value">{Math.floor(session.remaining / 60)}m {session.remaining % 60}s</span>
              </div>
            </div>
          </Metin2Box>
          <div className="flex gap-2">
            <button onClick={checkSession} className="metin-btn flex-1 flex items-center justify-center gap-1">
              <FaSync className="text-sm" /> Atualizar
            </button>
            <button
              onClick={handleCollect}
              disabled={checking || session.total_cycles < 1}
              className="metin-btn-gold flex-1 disabled:opacity-50"
            >
              {checking ? 'Coletando...' : `Coletar (${session.total_cycles} ciclo${session.total_cycles !== 1 ? 's' : ''})`}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Tipo de atividade */}
          <Metin2Box title="Tipo de Atividade" style={{ marginBottom: 8 }}>
            <div className="grid grid-cols-2 gap-2">
              {TYPE_DEFS.map((td) => {
                const available = isTypeAvailable(td.value);
                const isActive = type === td.value;
                return (
                  <button
                    key={td.value}
                    onClick={() => available && setType(td.value)}
                    disabled={!available}
                    title={!available ? `Sem ${td.label} em ${areaName}` : ''}
                    style={{
                      backgroundImage: 'url(/ui/pattern/board_base.png)',
                      backgroundRepeat: 'repeat',
                      border: isActive ? '2px solid #8b7332' : '1px solid #2a2a1e',
                      padding: '6px 8px',
                      cursor: available ? 'pointer' : 'not-allowed',
                      opacity: available ? 1 : 0.4,
                    }}
                    className={`flex items-center gap-2 text-sm transition-all
                      ${isActive ? 'text-metin-gold' : available ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    <td.Icon className="text-base" />
                    <span>{td.label}</span>
                  </button>
                );
              })}
            </div>
          </Metin2Box>

          {/* Configuracao */}
          <Metin2Box title="Configuração" style={{ marginBottom: 8 }}>
            {type === 'combat' && (
              <div className="mb-3">
                <label className="text-sm text-gray-400 mb-1 block">Monstro</label>
                {mobs.length === 0 ? (
                  <div className="text-sm text-red-500">Nenhum monstro nesta área</div>
                ) : (
                  <select value={mobId} onChange={(e) => setMobId(e.target.value)} className="metin-input text-sm">
                    <option value="">Selecione...</option>
                    {mobs.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} (Lv.{m.level})</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                Duração: {Math.floor(duration / 60)}m {duration % 60}s
              </label>
              <input
                type="range"
                min={30} max={3600} step={30}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full accent-metin-gold"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>30s</span><span>30min</span><span>1h</span>
              </div>
            </div>

            <div className="text-sm text-gray-500 text-center mt-2">
              Stamina: <span className={character?.stamina < 5 ? 'text-red-500' : 'text-metin-green'}>
                {character?.stamina ?? 0}
              </span> / {character?.max_stamina ?? 100}
            </div>

            <button
              onClick={handleStart}
              disabled={!canStart}
              className="metin-btn-gold w-full disabled:opacity-40 mt-3"
            >
              Iniciar Sessão Idle
            </button>

            {!isTypeAvailable(type) && (
              <div className="text-sm text-red-500 text-center mt-1">
                Sem {selectedTypeDef?.label} disponível em {areaName}
              </div>
            )}
          </Metin2Box>
        </div>
      )}
    </Metin2Window>
  );
}
