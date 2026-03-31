import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closePanel } from '../../store/slices/uiSlice';
import { loadCharacter } from '../../store/slices/characterSlice';
import {
  fetchSaveSlots,
  saveGame,
  loadGame,
  deleteSave,
  clearLastAction,
} from '../../store/slices/saveSlice';
import { Metin2Panel, Metin2TitleBar } from '../metin2ui';

export default function SaveLoadPanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const { slots, loading, lastAction } = useSelector((s) => s.saves);

  const [mode, setMode] = useState('save'); // 'save' | 'load'
  const [confirmSlot, setConfirmSlot] = useState(null);
  const [labelInput, setLabelInput] = useState('');
  const [editingSlot, setEditingSlot] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (character?.id) {
      dispatch(fetchSaveSlots(character.id));
    }
  }, [dispatch, character?.id]);

  useEffect(() => {
    if (!lastAction) return;

    if (lastAction.type === 'saved') {
      setFeedback({ type: 'success', message: 'Jogo salvo com sucesso!' });
    } else if (lastAction.type === 'loaded') {
      setFeedback({ type: 'success', message: 'Jogo carregado com sucesso!' });
      dispatch(loadCharacter(character.id));
    } else if (lastAction.type === 'deleted') {
      setFeedback({ type: 'success', message: 'Save removido.' });
    }

    setConfirmSlot(null);
    setEditingSlot(null);
    setLabelInput('');

    const timer = setTimeout(() => {
      setFeedback(null);
      dispatch(clearLastAction());
    }, 3000);

    return () => clearTimeout(timer);
  }, [lastAction, dispatch, character?.id]);

  const getSlotData = (slotNumber) => {
    return slots.find((s) => s.slot_number === slotNumber) || null;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSlotClick = (slotNumber) => {
    const slot = getSlotData(slotNumber);

    if (mode === 'save') {
      if (slot && confirmSlot !== slotNumber) {
        setConfirmSlot(slotNumber);
        setEditingSlot(slotNumber);
        setLabelInput(slot.label || '');
        return;
      }

      if (!slot) {
        setEditingSlot(slotNumber);
        setLabelInput('');
        setConfirmSlot(slotNumber);
        return;
      }

      const label = labelInput.trim() || `Save ${slotNumber}`;
      dispatch(saveGame({ charId: character.id, slotNumber, label }));
    }

    if (mode === 'load') {
      if (!slot) return;

      if (confirmSlot !== slotNumber) {
        setConfirmSlot(slotNumber);
        return;
      }

      dispatch(loadGame({ charId: character.id, slotNumber }));
    }
  };

  const handleConfirmSave = (slotNumber) => {
    const label = labelInput.trim() || `Save ${slotNumber}`;
    dispatch(saveGame({ charId: character.id, slotNumber, label }));
  };

  const handleDelete = (e, slotNumber) => {
    e.stopPropagation();
    dispatch(deleteSave({ charId: character.id, slotNumber }));
  };

  const handleCancel = () => {
    setConfirmSlot(null);
    setEditingSlot(null);
    setLabelInput('');
  };

  return (
    <Metin2Panel variant="board" className="select-none" style={{ width: 400 }}>
      <Metin2TitleBar title="Salvar / Carregar" onClose={() => dispatch(closePanel())} />

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`mx-4 mt-2 px-3 py-1.5 text-sm text-center rounded ${
            feedback.type === 'success'
              ? 'bg-green-900/40 text-green-300 border border-green-700/50'
              : 'bg-red-900/40 text-red-300 border border-red-700/50'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Mode tabs */}
      <div className="flex px-4 mt-3 gap-2">
        <button
          onClick={() => { setMode('save'); handleCancel(); }}
          className={`flex-1 py-1.5 text-sm font-medieval rounded-t transition-colors ${
            mode === 'save'
              ? 'text-metin-gold border-b-2 border-metin-gold'
              : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          Salvar
        </button>
        <button
          onClick={() => { setMode('load'); handleCancel(); }}
          className={`flex-1 py-1.5 text-sm font-medieval rounded-t transition-colors ${
            mode === 'load'
              ? 'text-metin-gold border-b-2 border-metin-gold'
              : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          Carregar
        </button>
      </div>

      {/* Slot list */}
      <div className="px-4 py-3 space-y-2">
        {loading && (
          <div className="text-gray-500 text-sm text-center py-4">Carregando...</div>
        )}

        {!loading &&
          [1, 2, 3, 4, 5].map((slotNumber) => {
            const slot = getSlotData(slotNumber);
            const isConfirming = confirmSlot === slotNumber;
            const isEditing = editingSlot === slotNumber && mode === 'save';

            return (
              <div key={slotNumber}>
                <div
                  onClick={() => handleSlotClick(slotNumber)}
                  className={`metin-panel p-3 cursor-pointer transition-colors hover:brightness-125 ${
                    isConfirming ? 'ring-1 ring-metin-gold/50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-metin-gold font-medieval text-sm w-5 text-center">
                        {slotNumber}
                      </span>
                      <div className="flex-1 min-w-0">
                        {slot ? (
                          <>
                            <div className="text-sm text-metin-gold font-medieval truncate">
                              {slot.label || `Save ${slotNumber}`}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(slot.saved_at)}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-600 italic">Vazio</div>
                        )}
                      </div>
                    </div>

                    {slot && (
                      <button
                        onClick={(e) => handleDelete(e, slotNumber)}
                        className="text-gray-600 hover:text-red-400 text-sm ml-2 px-1"
                        title="Excluir save"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Confirm prompt for load mode */}
                  {isConfirming && mode === 'load' && slot && (
                    <div className="mt-2 pt-2 border-t border-gray-700/50 flex items-center justify-between">
                      <span className="text-sm text-gray-400">Confirmar carregamento?</span>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                          className="metin-btn metin-btn-sm text-sm"
                        >
                          Não
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(loadGame({ charId: character.id, slotNumber }));
                          }}
                          className="metin-btn metin-btn-sm text-sm"
                        >
                          Sim
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Save label input + confirm (below the slot) */}
                {isEditing && isConfirming && mode === 'save' && (
                  <div className="mt-1 px-2 py-2 metin-panel">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={labelInput}
                        onChange={(e) => setLabelInput(e.target.value)}
                        placeholder={`Save ${slotNumber}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-black/40 border border-gray-700 text-sm text-gray-300 px-2 py-1 rounded focus:outline-none focus:border-metin-gold"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        {slot ? 'Sobrescrever save?' : 'Salvar neste slot?'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCancel}
                          className="metin-btn metin-btn-sm text-sm"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleConfirmSave(slotNumber)}
                          className="metin-btn metin-btn-sm text-sm"
                        >
                          Confirmar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </Metin2Panel>
  );
}
