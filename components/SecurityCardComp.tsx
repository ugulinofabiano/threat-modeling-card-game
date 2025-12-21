
import React, { useState, useEffect } from 'react';
import { SecurityCard, RiskLevel } from '../types';
import { generateThreatIntelligence } from '../services/geminiService';

interface Props {
  card: SecurityCard;
  onAccept: () => void;
  onPass: () => void;
  onSkip: () => void;
  onExit: () => void;
  isFirst: boolean;
}

const THEMATIC_FALLBACKS: Record<string, string> = {
  'AUTH': 'https://images.unsplash.com/photo-1590076215667-875d45087e02?q=80&w=600&fit=crop',
  'API': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&fit=crop',
  'VAULT': 'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=600&fit=crop',
  'INFRA': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&fit=crop',
};

const SecurityCardComp: React.FC<Props> = ({ card, onAccept, onPass, onSkip, onExit, isFirst }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showIntel, setShowIntel] = useState(false);
  const [intelContent, setIntelContent] = useState<string | null>(null);
  const [isIntelLoading, setIsIntelLoading] = useState(false);
  const [imgErrorCount, setImgErrorCount] = useState(0);

  useEffect(() => {
    setIsFlipped(false);
    setIntelContent(null);
    setImgErrorCount(0);
  }, [card.id]);

  const handleMageClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowIntel(true);
    if (!intelContent) {
      setIsIntelLoading(true);
      try {
        const intel = await generateThreatIntelligence(card);
        setIntelContent(intel);
      } catch (error) {
        setIntelContent("As estrelas estão nubladas. Consulte os arquivos locais na descrição da carta.");
      } finally {
        setIsIntelLoading(false);
      }
    }
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.HIGH: return 'text-red-500 border-red-500/40 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
      case RiskLevel.MEDIUM: return 'text-orange-500 border-orange-500/40 bg-orange-500/5 shadow-[0_0_15px_rgba(249,115,22,0.2)]';
      case RiskLevel.LOW: return 'text-emerald-500 border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
      default: return 'text-slate-400 border-slate-400/40';
    }
  };

  // Lógica de resolução de imagem incremental
  let displayImage = card.image || `images/${card.id}.png`;
  
  if (imgErrorCount === 1) {
    // Tentativa 2: Com barra inicial (raiz absoluta)
    displayImage = `/${card.image || `images/${card.id}.png`}`;
  } else if (imgErrorCount >= 2) {
    // Fallback Final
    const prefix = card.id.split('-')[0];
    displayImage = THEMATIC_FALLBACKS[prefix] || THEMATIC_FALLBACKS['INFRA'];
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const currentSrc = (e.target as HTMLImageElement).src;
    console.warn(`[Grimório] Falha ao carregar: ${currentSrc}. Tentando rota alternativa...`);
    setImgErrorCount(prev => prev + 1);
  };

  const ExitButton = () => (
    <button 
      onClick={(e) => { e.stopPropagation(); onExit(); }}
      className="absolute top-4 left-4 z-50 w-8 h-8 rounded-full bg-black/40 border border-[#b7950b]/30 text-[#b7950b] flex items-center justify-center hover:bg-[#b7950b] hover:text-black transition-all shadow-lg backdrop-blur-sm group/exit"
    >
      <i className="fas fa-fort-awesome text-xs group-hover/exit:scale-110"></i>
    </button>
  );

  return (
    <>
      <div 
        className="relative w-[360px] h-[560px] perspective-1000 group cursor-pointer"
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <div 
          className={`flip-card-inner relative w-full h-full transition-transform duration-700 ease-out ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* LADO FRONTAL */}
          <div 
            style={{ backfaceVisibility: 'hidden', zIndex: isFlipped ? 0 : 20 }}
            className="absolute inset-0 bg-black border-[12px] border-[#1a0f0a] rounded-[2.5rem] shadow-2xl p-6 flex flex-col justify-between overflow-hidden ring-1 ring-[#b7950b]/30"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]"></div>
            <ExitButton />

            <div className="relative z-10 flex flex-col h-full pointer-events-none">
              <div className="flex justify-between items-center mb-6 pl-8">
                 <span className="text-[10px] font-bold text-[#b7950b] uppercase tracking-[0.4em] medieval-font">Grimório Real</span>
                 <div className="w-8 h-8 rounded-full border border-[#b7950b]/40 flex items-center justify-center bg-black">
                    <span className="text-[8px] text-[#b7950b] font-bold">#</span>
                 </div>
              </div>

              <h3 className="text-2xl font-bold text-[#f4e4bc] medieval-font tracking-widest text-center mb-6 uppercase gold-glow">
                {card.title}
              </h3>
              
              <div className="flex-grow rounded-2xl overflow-hidden border border-[#b7950b]/20 shadow-inner relative bg-[#050505]">
                <img 
                  key={displayImage}
                  src={displayImage} 
                  alt={card.title} 
                  className="w-full h-full object-cover transition-opacity duration-300 opacity-100"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30"></div>
                {imgErrorCount > 0 && imgErrorCount < 2 && (
                   <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded text-[6px] text-[#b7950b] uppercase">Recuperando Arte...</div>
                )}
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className={`py-3 rounded-xl border text-center ${getRiskColor(card.impact)}`}>
                  <div className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">Impacto</div>
                  <div className="text-xs font-bold medieval-font uppercase">{card.impact}</div>
                </div>
                <div className={`py-3 rounded-xl border text-center ${getRiskColor(card.probability)}`}>
                  <div className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">Astúcia</div>
                  <div className="text-xs font-bold medieval-font uppercase">{card.probability}</div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <span className="text-[9px] font-bold text-[#b7950b] animate-pulse uppercase tracking-[0.4em] medieval-font">
                  Toque para Decifrar
                </span>
              </div>
            </div>
          </div>

          {/* LADO TRASEIRO */}
          <div 
            style={{ 
              backfaceVisibility: 'hidden', 
              transform: 'rotateY(180deg)',
              zIndex: isFlipped ? 20 : 0 
            }}
            className="absolute inset-0 parchment border-[10px] border-[#1a0f0a] rounded-[2.5rem] shadow-2xl p-10 flex flex-col"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
            <ExitButton />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1a0f0a]/10 pl-8">
                <h4 className="text-lg font-bold uppercase text-[#1a0f0a] medieval-font tracking-widest">O Manuscrito</h4>
                <button 
                  onClick={handleMageClick}
                  className="w-10 h-10 rounded-full bg-[#1a0f0a] text-[#b7950b] flex items-center justify-center hover:scale-110 transition-transform shadow-lg group/mage"
                >
                  <i className="fas fa-hat-wizard"></i>
                </button>
              </div>
              
              <div className="flex-grow space-y-4 text-left overflow-y-auto pr-2 custom-scrollbar text-[#1a0f0a]">
                <p className="text-sm leading-relaxed italic font-serif font-bold">"{card.description}"</p>
                {card.gameHint && (
                  <div className="bg-black/5 p-4 rounded-xl border-l-4 border-[#b7950b]">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-[#8d6e63] mb-1">Revelação</div>
                    <p className="text-xs">{card.gameHint}</p>
                  </div>
                )}
                {card.reference && (
                  <div className="pt-4 border-t border-[#1a0f0a]/5">
                     <a href={card.referenceUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-900 font-bold underline">
                       {card.reference}
                     </a>
                  </div>
                )}
              </div>

              <div className="mt-8 grid grid-cols-3 gap-2 pt-4 border-t border-[#1a0f0a]/5">
                 <button onClick={(e) => { e.stopPropagation(); onPass(); }} className="py-4 bg-[#8d6e63] text-white rounded-xl text-[9px] font-bold uppercase">Ignorar</button>
                 <button onClick={(e) => { e.stopPropagation(); onSkip(); }} className="py-4 bg-[#455a64] text-white rounded-xl text-[9px] font-bold uppercase">Pular</button>
                 <button onClick={(e) => { e.stopPropagation(); onAccept(); }} className="py-4 bg-[#b7950b] text-black rounded-xl text-[9px] font-bold uppercase">Combater</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showIntel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative parchment max-w-2xl w-full max-h-[80vh] overflow-hidden rounded-[2rem] border-[12px] border-[#1a0f0a] shadow-2xl flex flex-col">
            <button onClick={() => setShowIntel(false)} className="absolute top-4 right-4 text-[#1a0f0a] hover:scale-125"><i className="fas fa-times text-2xl"></i></button>
            <div className="p-12 overflow-y-auto custom-scrollbar">
              <div className="text-center mb-8">
                <i className="fas fa-scroll text-4xl text-[#1a0f0a] mb-4"></i>
                <h3 className="text-2xl font-bold medieval-font uppercase tracking-widest">Inteligência Arcana</h3>
              </div>
              <div className="space-y-6 text-[#1a0f0a] font-serif leading-relaxed italic">
                {isIntelLoading ? <div className="text-center py-20 animate-pulse">Consultando os cosmos...</div> : <div className="whitespace-pre-wrap">{intelContent}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SecurityCardComp;
