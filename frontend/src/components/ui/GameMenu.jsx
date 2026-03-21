import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closePanel } from '../../store/slices/uiSlice';
import { useNavigate } from 'react-router-dom';

export default function GameMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const character = useSelector((s) => s.character.data);

  const handleLogout = () => {
    dispatch(closePanel());
    navigate('/');
  };

  return (
    <div className="metin-panel-gold p-4 w-[300px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="panel-title !mb-0 !pb-0 !border-0">Menu</h2>
        <button onClick={() => dispatch(closePanel())} className="text-gray-500 hover:text-metin-gold">X</button>
      </div>
      <div className="divider-gold" />

      <div className="metin-panel p-3 mb-3 text-center">
        <div className="text-metin-gold font-medieval text-lg">{character?.name}</div>
        <div className="text-gray-500 text-xs">
          {character?.class_name} - Lv.{character?.level} | {character?.kingdom_name}
        </div>
      </div>

      <div className="space-y-2">
        <div className="stat-row text-sm">
          <span className="stat-label">ID do Personagem</span>
          <span className="stat-value text-metin-gold">{character?.id}</span>
        </div>
        <div className="text-xs text-gray-600 text-center">
          Anote seu ID para carregar o personagem depois
        </div>
      </div>

      <div className="divider mt-3" />

      <div className="space-y-2">
        <button onClick={handleLogout} className="metin-btn w-full">
          Sair do Jogo
        </button>
      </div>

      <div className="text-center mt-4 text-xs text-gray-600">
        Metin2 RPG v1.0.0
      </div>
    </div>
  );
}
