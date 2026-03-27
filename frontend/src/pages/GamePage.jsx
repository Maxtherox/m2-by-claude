import React, { useEffect } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { fetchInventory } from '../store/slices/inventorySlice';
import { fetchAreas, fetchAreaDetails } from '../store/slices/gameSlice';
import { fetchCharacterSkills } from '../store/slices/skillSlice';
import { fetchHotbar } from '../store/slices/hotbarSlice';
import { removeNotification } from '../store/slices/uiSlice';
import HUD from '../components/hud/HUD';
import ActionBar from '../components/hud/ActionBar';
import HotbarBar from '../components/hud/HotbarBar';
import StatusEffectsDisplay from '../components/hud/StatusEffectsDisplay';
import StatusPanel from '../components/character/StatusPanel';
import InventoryPanel from '../components/inventory/InventoryPanel';
import EquipmentPanel from '../components/equipment/EquipmentPanel';
import CombatPanel from '../components/combat/CombatPanel';
import CombatResultModal from '../components/combat/CombatResultModal';
import NPCPanel from '../components/npcs/NPCPanel';
import ShopPanel from '../components/npcs/ShopPanel';
import BlacksmithPanel from '../components/npcs/BlacksmithPanel';
import HealerPanel from '../components/npcs/HealerPanel';
import SkillTrainerPanel from '../components/npcs/SkillTrainerPanel';
import StoragePanel from '../components/npcs/StoragePanel';
import SkillPanel from '../components/skills/SkillPanel';
import LifeskillPanel from '../components/lifeskills/LifeskillPanel';
import IdlePanel from '../components/lifeskills/IdlePanel';
import MapPanel from '../components/ui/MapPanel';
import GameMenu from '../components/ui/GameMenu';
import QuestPanel from '../components/quests/QuestPanel';
import DungeonPanel from '../components/dungeons/DungeonPanel';
import DialogPanel from '../components/dialogs/DialogPanel';
import SaveLoadPanel from '../components/saves/SaveLoadPanel';
import Notification from '../components/common/Notification';
import { createGame, destroyGame } from '../phaser/GameBoot';

export default function GamePage() {
  const dispatch = useDispatch();
  const store = useStore();
  const character = useSelector((state) => state.character.data);
  const { activePanel, notifications } = useSelector((state) => state.ui);
  const combatResult = useSelector((state) => state.combat.result);

  useEffect(() => {
    let cancelled = false;

    const initGame = async () => {
      if (!character?.id) return;

      const requests = [
        dispatch(fetchInventory(character.id)),
        dispatch(fetchAreas()),
        dispatch(fetchCharacterSkills(character.id)),
        dispatch(fetchHotbar(character.id)),
      ];

      if (character.current_area_id) {
        requests.push(dispatch(fetchAreaDetails(character.current_area_id)));
      }

      await Promise.allSettled(requests);

      if (!cancelled) {
        createGame('phaser-game', store);
      }
    };

    initGame();

    return () => {
      cancelled = true;
      destroyGame();
    };
  }, [dispatch, character?.id, store]);

  const handleDismissNotification = (id) => {
    dispatch(removeNotification(id));
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'status': return <StatusPanel />;
      case 'inventory': return <InventoryPanel />;
      case 'equipment': return <EquipmentPanel />;
      case 'skills': return <SkillPanel />;
      case 'map': return <MapPanel />;
      case 'lifeskills': return <LifeskillPanel />;
      case 'idle': return <IdlePanel />;
      case 'menu': return <GameMenu />;
      case 'combat': return <CombatPanel />;
      case 'npc': return <NPCPanel />;
      case 'shop': return <ShopPanel />;
      case 'blacksmith': return <BlacksmithPanel />;
      case 'healer': return <HealerPanel />;
      case 'trainer': return <SkillTrainerPanel />;
      case 'storage': return <StoragePanel />;
      case 'quests': return <QuestPanel />;
      case 'dungeons': return <DungeonPanel />;
      case 'dialog': return <DialogPanel />;
      case 'saves': return <SaveLoadPanel />;
      default: return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-metin-darker relative">
      {/* Top HUD */}
      <HUD />
      <div className="px-4 py-1 flex items-center gap-2 bg-metin-panel/50">
        <StatusEffectsDisplay />
      </div>

      {/* Center area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Phaser canvas */}
        <div id="phaser-game" className="absolute inset-0" />

        {/* Active panel overlay */}
        {activePanel && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40">
            <div className="animate-slide-in max-h-[80vh] overflow-y-auto">
              {renderPanel()}
            </div>
          </div>
        )}

        {/* Combat result modal */}
        {combatResult && <CombatResultModal />}
      </div>

      {/* Hotbar */}
      <HotbarBar />
      {/* Bottom Action Bar */}
      <ActionBar />

      {/* Notifications */}
      <div className="absolute top-16 right-4 z-50 space-y-2">
        {notifications.map((notif) => (
          <Notification
            key={notif.id}
            notification={notif}
            onDismiss={handleDismissNotification}
          />
        ))}
      </div>
    </div>
  );
}
