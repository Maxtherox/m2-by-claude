import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeNpc, setActivePanel } from '../../store/slices/uiSlice';
import { Metin2Window, Metin2Button } from '../metin2ui';

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
    <Metin2Window title={npc.name} onClose={() => dispatch(closeNpc())} variant="gold" style={{ width: 350 }}>
      {npc.description && <p className="text-gray-400 text-sm mb-3">{npc.description}</p>}
      {npc.dialog && (
        <div className="metin-panel p-3 mb-3 text-sm text-gray-300 italic">
          "{npc.dialog}"
        </div>
      )}

      <div className="space-y-2">
        {action && (
          <Metin2Button onClick={() => dispatch(setActivePanel(action.panel))} style={{ width: '100%' }}>
            {action.label}
          </Metin2Button>
        )}
        <Metin2Button onClick={() => dispatch(closeNpc())} style={{ width: '100%' }}>
          Sair
        </Metin2Button>
      </div>
    </Metin2Window>
  );
}
