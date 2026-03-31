import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closePanel, setActivePanel } from '../../store/slices/uiSlice';
import { useNavigate } from 'react-router-dom';
import { Metin2Window, Metin2Button, Metin2Separator, Metin2Box } from '../metin2ui';

function getWorldScene() {
  const game = window.__PHASER_GAME__;
  return game?.scene?.getScene?.('WorldScene') || null;
}

export default function GameMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const character = useSelector((s) => s.character.data);
  const areaDetails = useSelector((s) => s.game.areaDetails);
  const [timeLabel, setTimeLabel] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const ws = getWorldScene();
      if (ws) setTimeLabel(ws.getDayNightLabel?.() || '');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    dispatch(closePanel());
    navigate('/');
  };

  const handleSave = () => {
    dispatch(setActivePanel('saves'));
  };

  const setTime = (t) => {
    const ws = getWorldScene();
    if (ws) {
      ws.dayNightTime = t;
      setTimeLabel(ws.getDayNightLabel());
    }
  };

  return (
    <Metin2Window title="Menu" onClose={() => dispatch(closePanel())} variant="board" style={{ width: 300 }}>
      <Metin2Box title="Informacoes">
        <div className="text-center mb-2">
          <div className="m2-text-name text-lg">{character?.name}</div>
          <div className="text-gray-500 text-sm">
            {character?.class_name} - Lv.{character?.level} | {character?.kingdom_name}
          </div>
        </div>
        <div className="space-y-1">
          <div className="stat-row text-sm">
            <span className="stat-label">ID</span>
            <span className="m2-text-gold">{character?.id}</span>
          </div>
          <div className="stat-row text-sm">
            <span className="stat-label">Area</span>
            <span className="m2-text-gold">{areaDetails?.name || 'Desconhecida'}</span>
          </div>
          <div className="stat-row text-sm">
            <span className="stat-label">Horario</span>
            <span className="m2-text-gold">{timeLabel || '...'}</span>
          </div>
        </div>
        <div className="text-sm text-gray-600 text-center italic mt-2">
          Anote seu ID para carregar depois
        </div>
      </Metin2Box>

      <Metin2Separator />

      <Metin2Box title="Dia / Noite">
        <div className="grid grid-cols-2 gap-2">
          <Metin2Button onClick={() => setTime(0.5)} style={{ width: '100%' }}>
            Meio-dia
          </Metin2Button>
          <Metin2Button onClick={() => setTime(0.0)} style={{ width: '100%' }}>
            Meia-noite
          </Metin2Button>
          <Metin2Button onClick={() => setTime(0.25)} style={{ width: '100%' }}>
            Amanhecer
          </Metin2Button>
          <Metin2Button onClick={() => setTime(0.75)} style={{ width: '100%' }}>
            Entardecer
          </Metin2Button>
        </div>
      </Metin2Box>

      <Metin2Separator />

      <Metin2Box title="Opcoes">
        <div className="space-y-2">
          <Metin2Button onClick={handleSave} style={{ width: '100%' }}>
            Salvar Jogo
          </Metin2Button>
          <Metin2Button onClick={handleLogout} style={{ width: '100%' }}>
            Trocar Personagem
          </Metin2Button>
        </div>
      </Metin2Box>

      <div className="text-center mt-4 text-[13px] text-gray-600">
        Metin2 RPG v1.0.0
      </div>
    </Metin2Window>
  );
}
