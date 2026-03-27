import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closePanel } from '../../store/slices/uiSlice';
import { getNPCDialog, getDialogNode, executeDialogAction } from '../../services/api';

export default function DialogPanel() {
  const dispatch = useDispatch();
  const character = useSelector((s) => s.character.data);
  const activeNpc = useSelector((s) => s.ui.activeNpc);

  const [currentNode, setCurrentNode] = useState(null);
  const [dialogId, setDialogId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeNpc?.id || !character?.id) return;

    setLoading(true);
    getNPCDialog(activeNpc.id, character.id)
      .then((res) => {
        if (res.success && res.data) {
          setDialogId(res.data.dialog_id);
          setCurrentNode(res.data.node);

          if (res.data.node?.action) {
            executeDialogAction(character.id, res.data.node.action, res.data.node.action_param).catch(() => {});
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeNpc?.id, character?.id]);

  const handleOption = useCallback(async (option) => {
    if (!character?.id) return;

    if (option.action) {
      try {
        await executeDialogAction(character.id, option.action, option.action_param);
      } catch {
        // silently continue dialog flow
      }
    }

    if (option.next_node == null) {
      dispatch(closePanel());
      return;
    }

    setLoading(true);
    try {
      const res = await getDialogNode(dialogId, option.next_node);
      if (res.success && res.data) {
        setCurrentNode(res.data);

        if (res.data.action) {
          await executeDialogAction(character.id, res.data.action, res.data.action_param).catch(() => {});
        }
      }
    } catch {
      // keep current node on error
    } finally {
      setLoading(false);
    }
  }, [character?.id, dialogId, dispatch]);

  const handleClose = () => {
    dispatch(closePanel());
  };

  if (!activeNpc) return null;

  return (
    <div className="metin-panel-gold p-0 w-[400px] select-none">
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-3 pb-2">
        <h2 className="text-metin-gold font-medieval text-lg tracking-wide">
          {activeNpc.name}
        </h2>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-metin-gold text-sm"
        >
          ✕
        </button>
      </div>
      <div className="divider-gold" />

      {/* Dialog body */}
      <div className="px-4 py-3">
        {loading ? (
          <div className="metin-panel p-4 text-center">
            <span className="text-gray-500 text-sm">...</span>
          </div>
        ) : !currentNode ? (
          <div className="metin-panel p-4 text-center">
            <p className="text-gray-400 text-sm">Este NPC nao tem nada a dizer.</p>
            <button onClick={handleClose} className="metin-btn metin-btn-sm mt-3">
              Fechar
            </button>
          </div>
        ) : (
          <>
            {/* Speaker & Text */}
            <div className="metin-panel p-4 mb-3">
              <span
                className={`text-xs font-medieval tracking-wide mb-1 block ${
                  currentNode.speaker === 'player' ? 'text-cyan-400' : 'text-metin-gold'
                }`}
              >
                {currentNode.speaker === 'player' ? character?.name || 'Jogador' : activeNpc.name}
              </span>
              <p className="text-gray-300 text-base leading-relaxed">
                {currentNode.text}
              </p>
            </div>

            {/* Options or End */}
            <div className="space-y-2">
              {currentNode.is_end ? (
                <button onClick={handleClose} className="metin-btn metin-btn-sm w-full">
                  Fechar
                </button>
              ) : currentNode.options && currentNode.options.length > 0 ? (
                currentNode.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOption(option)}
                    disabled={loading}
                    className="metin-btn metin-btn-sm w-full text-left"
                  >
                    {option.text}
                  </button>
                ))
              ) : (
                <button onClick={handleClose} className="metin-btn metin-btn-sm w-full">
                  Fechar
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
