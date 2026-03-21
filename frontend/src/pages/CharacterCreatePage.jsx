import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createCharacter, clearError, clearCreated } from '../store/slices/characterSlice';
import { fetchKingdoms, fetchClasses } from '../store/slices/gameSlice';

const DEFAULT_KINGDOMS = [
  { id: 'shinsoo', name: 'Shinsoo', color: 'kingdom-shinsoo', description: 'O reino da sabedoria e harmonia. Governado pela rainha, seus guerreiros buscam equilibrio entre forca e espirito.' },
  { id: 'chunjo', name: 'Chunjo', color: 'kingdom-chunjo', description: 'O reino da honra e disciplina. Seus guerreiros sao leais e implacaveis, treinados nas artes marciais desde a infancia.' },
  { id: 'jinno', name: 'Jinno', color: 'kingdom-jinno', description: 'O reino da forca e conquista. Seus guerreiros sao ferozes e determinados, buscando poder acima de tudo.' },
];

const DEFAULT_CLASSES = [
  { id: 'warrior', name: 'Guerreiro', icon: '\u2694\uFE0F', description: 'Mestre das armas corpo a corpo. Alta resistencia e dano fisico.', stats: { str: 6, int: 2, vit: 5, dex: 3 } },
  { id: 'ninja', name: 'Ninja', icon: '\u{1F5E1}\uFE0F', description: 'Assassino agil e furtivo. Alto dano critico e evasao.', stats: { str: 3, int: 3, vit: 3, dex: 7 } },
  { id: 'sura', name: 'Sura', icon: '\u{1F52E}', description: 'Guerreiro sombrio que combina magia negra com espada.', stats: { str: 5, int: 5, vit: 3, dex: 3 } },
  { id: 'shaman', name: 'Shama', icon: '\u{1FA84}', description: 'Mistica curandeira e invocadora de poderes elementais.', stats: { str: 2, int: 7, vit: 4, dex: 3 } },
];

export default function CharacterCreatePage() {
  const [step, setStep] = useState(1);
  const [selectedKingdom, setSelectedKingdom] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [charName, setCharName] = useState('');
  const [nameError, setNameError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, created, data } = useSelector((state) => state.character);
  const { kingdoms: apiKingdoms, classes: apiClasses } = useSelector((state) => state.game);

  const kingdoms = apiKingdoms.length > 0 ? apiKingdoms : DEFAULT_KINGDOMS;
  const classes = apiClasses.length > 0 ? apiClasses : DEFAULT_CLASSES;

  useEffect(() => {
    dispatch(fetchKingdoms());
    dispatch(fetchClasses());
    dispatch(clearCreated());
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (created && data) {
      navigate('/game');
    }
  }, [created, data, navigate]);

  const handleNext = () => {
    if (step === 1 && !selectedKingdom) return;
    if (step === 2 && !selectedClass) return;
    if (step === 3) {
      if (!charName.trim()) {
        setNameError('Digite um nome para o personagem');
        return;
      }
      if (charName.trim().length < 3) {
        setNameError('Nome deve ter no minimo 3 caracteres');
        return;
      }
      setNameError('');
    }
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = () => {
    dispatch(createCharacter({
      name: charName.trim(),
      kingdom_id: selectedKingdom.id || selectedKingdom,
      class_id: selectedClass.id || selectedClass,
    }));
  };

  const getKingdomColorClass = (kingdom) => {
    const id = kingdom.id || kingdom;
    if (id === 'shinsoo') return { border: 'border-kingdom-shinsoo', bg: 'bg-kingdom-shinsoo/10', text: 'text-kingdom-shinsoo', glow: 'shadow-[0_0_15px_rgba(64,128,208,0.3)]' };
    if (id === 'chunjo') return { border: 'border-kingdom-chunjo', bg: 'bg-kingdom-chunjo/10', text: 'text-kingdom-chunjo', glow: 'shadow-[0_0_15px_rgba(208,64,64,0.3)]' };
    if (id === 'jinno') return { border: 'border-kingdom-jinno', bg: 'bg-kingdom-jinno/10', text: 'text-kingdom-jinno', glow: 'shadow-[0_0_15px_rgba(208,160,64,0.3)]' };
    return { border: 'border-metin-border', bg: '', text: 'text-gray-400', glow: '' };
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-metin-darker overflow-y-auto py-4">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #4080d0 0%, transparent 40%), radial-gradient(circle at 70% 70%, #d04040 0%, transparent 40%)' }}
      />

      <div className="relative z-10 metin-panel-gold p-6 w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-medieval text-metin-gold" style={{ textShadow: '0 0 10px rgba(212,168,50,0.4)' }}>
            Criar Personagem
          </h1>
          {/* Step indicators */}
          <div className="flex justify-center gap-2 mt-3">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`w-8 h-1 rounded-full transition-colors duration-300 ${s <= step ? 'bg-metin-gold' : 'bg-metin-border'}`} />
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-2 font-medieval">
            {step === 1 && 'Escolha seu Reino'}
            {step === 2 && 'Escolha sua Classe'}
            {step === 3 && 'Nomeie seu Guerreiro'}
            {step === 4 && 'Confirme sua Criacao'}
          </p>
        </div>

        {/* Step 1: Kingdom */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {kingdoms.map((k) => {
              const colors = getKingdomColorClass(k);
              const isSelected = selectedKingdom?.id === k.id || selectedKingdom === k.id;
              return (
                <button
                  key={k.id}
                  onClick={() => setSelectedKingdom(k)}
                  className={`p-4 rounded-sm border-2 transition-all duration-300 text-left
                    ${isSelected ? `${colors.border} ${colors.bg} ${colors.glow}` : 'border-metin-border bg-metin-dark hover:border-metin-border-gold'}`}
                >
                  <h3 className={`text-lg font-medieval ${isSelected ? colors.text : 'text-gray-300'}`}>
                    {k.name}
                  </h3>
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                    {k.description}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Class */}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {classes.map((c) => {
              const isSelected = selectedClass?.id === c.id || selectedClass === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedClass(c)}
                  className={`p-4 rounded-sm border-2 transition-all duration-300 text-left
                    ${isSelected ? 'border-metin-gold bg-metin-gold/10 shadow-metin-gold' : 'border-metin-border bg-metin-dark hover:border-metin-border-gold'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{c.icon}</span>
                    <h3 className={`text-lg font-medieval ${isSelected ? 'text-metin-gold' : 'text-gray-300'}`}>
                      {c.name}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-xs mb-3">{c.description}</p>
                  {c.stats && (
                    <div className="grid grid-cols-4 gap-1 text-xs">
                      <div className="text-center">
                        <span className="text-red-400">FOR</span>
                        <div className="text-gray-300">{c.stats.str}</div>
                      </div>
                      <div className="text-center">
                        <span className="text-blue-400">INT</span>
                        <div className="text-gray-300">{c.stats.int}</div>
                      </div>
                      <div className="text-center">
                        <span className="text-green-400">VIT</span>
                        <div className="text-gray-300">{c.stats.vit}</div>
                      </div>
                      <div className="text-center">
                        <span className="text-yellow-400">DES</span>
                        <div className="text-gray-300">{c.stats.dex}</div>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Step 3: Name */}
        {step === 3 && (
          <div className="mb-6 max-w-sm mx-auto">
            <label className="block text-metin-gold text-sm font-medieval mb-2">Nome do Personagem</label>
            <input
              type="text"
              value={charName}
              onChange={(e) => { setCharName(e.target.value); setNameError(''); }}
              placeholder="Digite o nome..."
              className="metin-input text-lg text-center"
              maxLength={20}
            />
            {nameError && <p className="text-red-400 text-xs mt-2">{nameError}</p>}

            {/* Preview */}
            <div className="mt-6 metin-panel p-4">
              <h4 className="text-metin-gold text-sm font-medieval mb-2">Resumo</h4>
              <div className="stat-row">
                <span className="stat-label">Reino:</span>
                <span className={`stat-value ${getKingdomColorClass(selectedKingdom).text}`}>
                  {selectedKingdom?.name || selectedKingdom}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Classe:</span>
                <span className="stat-value text-metin-gold">
                  {selectedClass?.icon} {selectedClass?.name || selectedClass}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="mb-6 max-w-sm mx-auto">
            <div className="metin-panel-gold p-6 text-center">
              <h3 className="text-xl font-medieval text-metin-gold mb-4"
                style={{ textShadow: '0 0 10px rgba(212,168,50,0.3)' }}>
                {charName}
              </h3>
              <div className="divider-gold" />
              <div className="space-y-2 mt-3 text-sm">
                <div className="stat-row">
                  <span className="stat-label">Reino:</span>
                  <span className={`stat-value ${getKingdomColorClass(selectedKingdom).text}`}>
                    {selectedKingdom?.name || selectedKingdom}
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Classe:</span>
                  <span className="stat-value">{selectedClass?.icon} {selectedClass?.name || selectedClass}</span>
                </div>
                {selectedClass?.stats && (
                  <>
                    <div className="divider" />
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center"><span className="text-red-400">FOR</span><div>{selectedClass.stats.str}</div></div>
                      <div className="text-center"><span className="text-blue-400">INT</span><div>{selectedClass.stats.int}</div></div>
                      <div className="text-center"><span className="text-green-400">VIT</span><div>{selectedClass.stats.vit}</div></div>
                      <div className="text-center"><span className="text-yellow-400">DES</span><div>{selectedClass.stats.dex}</div></div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-metin-red-dark/30 border border-metin-red/50 rounded-sm p-3 text-red-300 text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={step === 1 ? () => navigate('/') : handleBack}
            className="metin-btn"
            disabled={loading}
          >
            {step === 1 ? 'Voltar' : 'Anterior'}
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="metin-btn-gold"
              disabled={(step === 1 && !selectedKingdom) || (step === 2 && !selectedClass)}
            >
              Proximo
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="metin-btn-gold"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Personagem'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
