import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadCharacter, clearError } from '../store/slices/characterSlice';
import { Metin2Panel, Metin2Button, Metin2Separator } from '../components/metin2ui';

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

      <div className="relative z-10 animate-fade-in" style={{ width: '100%', maxWidth: 440 }}>
        <Metin2Panel variant="board" style={{ padding: 0 }}>
          <div style={{ padding: 32 }}>
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl mb-2"
                style={{
                  color: '#c8b06a',
                  textShadow: '0 0 20px rgba(212, 168, 50, 0.5), 0 2px 4px rgba(0,0,0,0.8)',
                }}>
                METIN2 RPG
              </h1>
              <div
                style={{
                  backgroundImage: 'url(/ui/pattern/seperator.png)',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundSize: 'contain',
                  height: 20,
                  width: 200,
                  margin: '0 auto',
                }}
              />
              <p className="text-gray-500 text-sm mt-2">
                Reino das Sombras
              </p>
            </div>

            {/* Load character form */}
            <form onSubmit={handleLoad} className="space-y-4">
              <div>
                <label className="block m2-text-gold text-sm mb-1">
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
                <div style={{ background: 'rgba(139,26,26,0.3)', border: '1px solid rgba(200,48,48,0.5)', padding: 12 }}
                  className="text-red-300 text-sm">
                  {error}
                </div>
              )}

              <Metin2Button
                onClick={handleLoad}
                disabled={loading || !charId.trim()}
                style={{ width: '100%', fontSize: 16, padding: '8px 16px' }}
              >
                {loading ? 'Carregando...' : 'Carregar'}
              </Metin2Button>
            </form>

            <Metin2Separator type="separator" />

            {/* Create new */}
            <Metin2Button
              onClick={handleCreate}
              disabled={loading}
              style={{ width: '100%' }}
            >
              Criar Novo Personagem
            </Metin2Button>

            {/* Decorative footer */}
            <div className="text-center mt-6">
              <Metin2Separator />
              <p className="text-gray-600 text-sm font-pixel mt-2">v1.0.0</p>
            </div>
          </div>
        </Metin2Panel>
      </div>
    </div>
  );
}
