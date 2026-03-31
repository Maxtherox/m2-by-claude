import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInventory, unequipItem } from '../../store/slices/inventorySlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import { closePanel, addNotification } from '../../store/slices/uiSlice';
import { getRarityColor } from '../../utils/helpers';
import {
  GiCrossedSwords, GiBreastplate, GiVisoredHelm,
  GiShield, GiBootKick, GiBracer, GiNecklace, GiEarrings,
} from 'react-icons/gi';
import { Metin2Panel, Metin2TitleBar, Metin2Box } from '../metin2ui';

const SLOT_SIZE = 36;

// Layout: left column (head, armor, weapon), center (character silhouette), right column (shield, boots, accessories)
const LEFT_SLOTS = [
  { key: 'helmet', label: 'Elmo', Icon: GiVisoredHelm },
  { key: 'armor', label: 'Armadura', Icon: GiBreastplate },
  { key: 'weapon', label: 'Arma', Icon: GiCrossedSwords },
];
const RIGHT_SLOTS = [
  { key: 'shield', label: 'Escudo', Icon: GiShield },
  { key: 'boots', label: 'Botas', Icon: GiBootKick },
  { key: 'earring', label: 'Brinco', Icon: GiEarrings },
];
const BOTTOM_SLOTS = [
  { key: 'necklace', label: 'Colar', Icon: GiNecklace },
  { key: 'bracelet', label: 'Bracelete', Icon: GiBracer },
];

function EquipSlot({ slotDef, item, onUnequip }) {
  const { label, Icon } = slotDef;
  const color = item ? getRarityColor(item.rarity) : '#3a2a08';

  return (
    <div
      title={item ? `${item.name} (clique para desequipar)` : label}
      onClick={() => item && onUnequip(item.inv_id)}
      style={{
        width: SLOT_SIZE,
        height: SLOT_SIZE,
        backgroundImage: 'url(/ui/pattern/board_base.png)',
        backgroundRepeat: 'repeat',
        border: `2px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: item ? 'pointer' : 'default',
        position: 'relative',
        boxShadow: item ? `inset 0 0 6px ${color}33` : 'none',
      }}
    >
      <div style={{ color, fontSize: item ? 20 : 16, opacity: item ? 1 : 0.3 }}>
        <Icon />
      </div>
      {item?.refinement > 0 && (
        <span style={{ position: 'absolute', top: 0, left: 1, fontSize: 9, color: '#f0d060', fontWeight: 'bold', textShadow: '0 1px 2px #000', lineHeight: 1 }}>
          +{item.refinement}
        </span>
      )}
    </div>
  );
}

export default function EquipmentPanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const equipment = character?.equipment || {};

  const handleUnequip = async (invId) => {
    if (!character) return;
    try {
      await dispatch(unequipItem({ charId: character.id, invId })).unwrap();
      dispatch(fetchInventory(character.id));
      dispatch(loadCharacter(character.id));
    } catch (e) {
      dispatch(addNotification({ type: 'error', message: e || 'Erro ao desequipar' }));
    }
  };

  return (
    <Metin2Panel variant="board" style={{ width: 260 }}>
      <Metin2TitleBar title="Equipamento" onClose={() => dispatch(closePanel())} />

      <div style={{ padding: 8 }}>
        {/* Inner border_b frame */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '16px 1fr 16px',
          gridTemplateRows: '16px 1fr 16px',
        }}>
          <div style={{ backgroundImage: 'url(/ui/pattern/border_b_left_top.png)', backgroundSize: 'cover' }} />
          <div style={{ backgroundImage: 'url(/ui/pattern/border_b_top.png)', backgroundRepeat: 'repeat-x', backgroundSize: 'auto 16px' }} />
          <div style={{ backgroundImage: 'url(/ui/pattern/border_b_right_top.png)', backgroundSize: 'cover' }} />

          <div style={{ backgroundImage: 'url(/ui/pattern/border_b_left.png)', backgroundRepeat: 'repeat-y', backgroundSize: '16px auto' }} />
          <div style={{
            backgroundImage: 'url(/ui/pattern/border_b_center.png)',
            backgroundRepeat: 'repeat',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            padding: 8,
          }}>
            {/* Top row: left slots - silhouette - right slots */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {LEFT_SLOTS.map(s => (
                  <EquipSlot key={s.key} slotDef={s} item={equipment[s.key]} onUnequip={handleUnequip} />
                ))}
              </div>

              {/* Character info box */}
              <Metin2Box variant="a">
                <div style={{ textAlign: 'center', padding: '4px 2px', minHeight: 90 }}>
                  <div style={{ color: '#c8b06a', fontSize: 13, fontWeight: 'bold' }}>{character?.name}</div>
                  <div style={{ color: '#888', fontSize: 12 }}>Lv.{character?.level}</div>
                  <div style={{ color: '#666', fontSize: 11, marginTop: 4 }}>{character?.class_name}</div>
                </div>
              </Metin2Box>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {RIGHT_SLOTS.map(s => (
                  <EquipSlot key={s.key} slotDef={s} item={equipment[s.key]} onUnequip={handleUnequip} />
                ))}
              </div>
            </div>

            {/* Bottom row: necklace, bracelet */}
            <div style={{ display: 'flex', gap: 4 }}>
              {BOTTOM_SLOTS.map(s => (
                <EquipSlot key={s.key} slotDef={s} item={equipment[s.key]} onUnequip={handleUnequip} />
              ))}
            </div>
          </div>
          <div style={{ backgroundImage: 'url(/ui/pattern/border_b_right.png)', backgroundRepeat: 'repeat-y', backgroundSize: '16px auto' }} />

          <div style={{ backgroundImage: 'url(/ui/pattern/border_b_left_bottom.png)', backgroundSize: 'cover' }} />
          <div style={{ backgroundImage: 'url(/ui/pattern/border_b_bottom.png)', backgroundRepeat: 'repeat-x', backgroundSize: 'auto 16px' }} />
          <div style={{ backgroundImage: 'url(/ui/pattern/border_b_right_bottom.png)', backgroundSize: 'cover' }} />
        </div>
      </div>

      {/* Equipment bonuses */}
      {character?.equipment_bonuses && Object.values(character.equipment_bonuses).some((v) => v > 0) && (
        <div className="px-3 pb-2" style={{ paddingTop: 6 }}>
          <Metin2Box title="Bonus">
            <div className="text-[13px] space-y-0.5" style={{ padding: '4px 6px' }}>
              {Object.entries(character.equipment_bonuses)
                .filter(([, v]) => v > 0)
                .map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-1">
                    <span className="text-gray-500 truncate">{k.replace(/_/g, ' ')}</span>
                    <span className="text-emerald-400 shrink-0">+{v}</span>
                  </div>
                ))}
            </div>
          </Metin2Box>
        </div>
      )}
    </Metin2Panel>
  );
}
