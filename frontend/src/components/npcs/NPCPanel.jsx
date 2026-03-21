import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeNpc, setActivePanel } from '../../store/slices/uiSlice';

export default function NPCPanel() {
  const dispatch = useDispatch();
  const npc = useSelector((s) => s.ui.activeNpc);
  if (!npc) return null;

  const npcActions = {
    shop: { label: 'Loja', panel: 'shop' },
    blacksmith: { label: 'Ferreiro', panel: 'blacksmith' },
    material: { label: 'Loja de Materiais', panel: 'shop' },
    material_shop: { label: 'Loja de Materiais', panel: 'shop' },
    trainer: { label: 'Treinar Habilidades', panel: 'trainer' },
    skill_trainer: { label: 'Treinar Habilidades', panel: 'trainer' },
    healer: { label: 'Curar', panel: 'healer' },
    lifeskill: { label: 'Profissoes', panel: 'lifeskills' },
    lifeskill_master: { label: 'Profissoes', panel: 'lifeskills' },
    storage: { label: 'Armazem', panel: 'storage' },
  };

  const action = npcActions[npc.type];

  return (
    <div className="metin-panel-gold p-4 w-[350px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="panel-title !mb-0 !pb-0 !border-0">{npc.name}</h2>
        <button onClick={() => dispatch(closeNpc())} className="text-gray-500 hover:text-metin-gold">X</button>
      </div>
      <div className="divider-gold" />

      {npc.description && <p className="text-gray-400 text-sm mb-3">{npc.description}</p>}
      {npc.dialog && (
        <div className="metin-panel p-3 mb-3 text-sm text-gray-300 italic">
          "{npc.dialog}"
        </div>
      )}

      <div className="space-y-2">
        {action && (
          <button onClick={() => dispatch(setActivePanel(action.panel))}
            className="metin-btn-gold w-full">
            {action.label}
          </button>
        )}
        <button onClick={() => dispatch(closeNpc())} className="metin-btn w-full">
          Sair
        </button>
      </div>
    </div>
  );
}
