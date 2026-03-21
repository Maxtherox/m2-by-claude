import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadCharacter, clearError } from '../store/slices/characterSlice';

export default function CharacterSelectPage() {
  const [charId, setCharId] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.character);

  const handleLoad = async (e) => {
    e.preventDefault();
    if (!charId.trim()) return;
    dispatch(clearError());
    const result = await dispatch(loadCharacter(charId.trim()));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/game');
    }
  };

  const handleCreate = () => {
    dispatch(clearError());
    navigate('/create');
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-metin-darker">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #d4a832 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 metin-panel-gold p-8 w-full max-w-md animate-fade-in">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-medieval text-metin-gold mb-2"
            style={{ textShadow: '0 0 20px rgba(212, 168, 50, 0.5), 0 2px 4px rgba(0,0,0,0.8)' }}>
            METIN2 RPG
          </h1>
          <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-metin-gold to-transparent mx-auto" />
          <p className="text-gray-500 text-sm mt-2 font-medieval">Reino das Sombras</p>
        </div>

        {/* Load character form */}
        <form onSubmit={handleLoad} className="space-y-4">
          <div>
            <label className="block text-metin-gold text-sm font-medieval mb-1">
              ID do Personagem
            </label>
            <input
              type="text"
              value={charId}
              onChange={(e) => setCharId(e.target.value)}
              placeholder="Digite o ID..."
              className="metin-input"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-metin-red-dark/30 border border-metin-red/50 rounded-sm p-3 text-red-300 text-sm font-medieval">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !charId.trim()}
            className="metin-btn-gold w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Carregando...' : 'Carregar'}
          </button>
        </form>

        <div className="divider-gold my-6" />

        {/* Create new */}
        <button
          onClick={handleCreate}
          className="metin-btn w-full text-center"
          disabled={loading}
        >
          Criar Novo Personagem
        </button>

        {/* Decorative footer */}
        <div className="text-center mt-6">
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-metin-border to-transparent mx-auto mb-2" />
          <p className="text-gray-600 text-xs font-pixel">v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
