
import React, { useState, useEffect } from 'react';
import { SecurityCard, RiskLevel } from '../types';
import { generateCardImage, generateThreatIntelligence } from '../services/geminiService';

interface Props {
  card: SecurityCard;
  onAccept: () => void;
  onPass: () => void;
  onSkip: () => void;
  onExit: () => void; // Nova prop para voltar ao lobby
  isFirst: boolean;
}

const SecurityCardComp: React.FC<Props> = ({ card, onAccept, onPass, onSkip, onExit, isFirst }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showIntel, setShowIntel] = useState(false);
  const [intelContent, setIntelContent] = useState<string | null>(null);
  const [isIntelLoading, setIsIntelLoading] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
    setGeneratedImg(null);
    setIntelContent(null);
    
    const fetchImage = async () => {
      setIsGenerating(true);
      try {
        const img = await generateCardImage(card.id, card.imagePrompt || card.title);
        setGeneratedImg(img);
      } catch (error) {
        console.error("Falha ao carregar imagem:", error);
      } finally {
        setIsGenerating(false);
      }
    };
    
    if (!card.image) {
      fetchImage();
    }
  }, [card.id, card.image, card.imagePrompt]);

  const handleMageClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowIntel(true);
    if (!intelContent) {
      setIsIntelLoading(true);
      const intel = await generateThreatIntelligence(card);
      setIntelContent(intel);
      setIsIntelLoading(false);
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

  const displayImage = card.image || generatedImg;

  // Botão comum de saída para reuso
  const ExitButton = () => (
    <button 
      onClick={(e) => { e.stopPropagation(); onExit(); }}
      className="absolute top-4 left-4 z-50 w-8 h-8 rounded-full bg-black/40 border border-[#b7950b]/30 text-[#b7950b] flex items-center justify-center hover:bg-[#b7950b] hover:text-black transition-all shadow-lg backdrop-blur-sm group/exit"
      title="Voltar ao Castelo (Lobby)"
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
          {/* LADO FRONTAL: ARTEFATO DE PEDRA E OURO */}
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
                {isGenerating ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <i className="fas fa-magic text-[#b7950b] text-3xl animate-spin"></i>
                    <span className="text-[9px] text-[#b7950b] font-bold uppercase tracking-widest">Invocando Imagem...</span>
                  </div>
                ) : displayImage ? (
                  <img 
                    src={displayImage} 
                    alt={card.title} 
                    className="w-full h-full object-cover brightness-[0.7] contrast-[1.2] grayscale-[0.2]" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#2c1810] opacity-30">
                    <i className="fas fa-mountain-city text-6xl"></i>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
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

          {/* LADO TRASEIRO: PERGAMINHO ANTIGO COM BOTÃO DE MAGO */}
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
                {/* BOTÃO DO MAGO */}
                <button 
                  onClick={handleMageClick}
                  className="w-10 h-10 rounded-full bg-[#1a0f0a] text-[#b7950b] flex items-center justify-center hover:scale-110 transition-transform shadow-lg group/mage"
                  title="Consultar o Sábio Arcano"
                >
                  <i className="fas fa-hat-wizard group-hover/mage:animate-bounce"></i>
                </button>
              </div>
              
              <div className="flex-grow space-y-4 text-left overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-sm text-[#1a0f0a] leading-relaxed italic font-serif font-bold">
                  "{card.description}"
                </p>

                {card.gameHint && (
                  <div className="bg-black/5 p-4 rounded-xl border-l-4 border-[#b7950b] shadow-inner">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-[#8d6e63] mb-1 flex items-center gap-2">
                      <i className="fas fa-eye text-[#b7950b]"></i> Revelação do Sábio
                    </div>
                    <p className="text-xs text-[#2c1810] leading-relaxed">
                      {card.gameHint}
                    </p>
                  </div>
                )}

                {card.reference && (
                  <div className="pt-4 border-t border-[#1a0f0a]/5">
                     <div className="text-[8px] font-bold text-[#8d6e63] uppercase tracking-[0.2em] mb-1">Tratado de Segurança:</div>
                     <a 
                      href={card.referenceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-blue-900 font-bold underline flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                     >
                       {card.reference} <i className="fas fa-external-link-alt text-[8px]"></i>
                     </a>
                  </div>
                )}
              </div>

              {/* BOTÕES DE AÇÃO: IGNORAR, PULAR, COMBATER */}
              <div className="mt-8 grid grid-cols-3 gap-2 pt-4 border-t border-[#1a0f0a]/5">
                 <button 
                   onClick={(e) => { e.stopPropagation(); onPass(); }}
                   className="py-4 bg-[#8d6e63] hover:bg-[#5d4037] text-white rounded-xl text-[9px] font-bold uppercase tracking-[0.1em] transition-all shadow-md active:scale-95"
                   title="Descartar esta ameaça"
                 >
                   Ignorar
                 </button>
                 <button 
                   onClick={(e) => { e.stopPropagation(); onSkip(); }}
                   className="py-4 bg-[#455a64] hover:bg-[#263238] text-white rounded-xl text-[9px] font-bold uppercase tracking-[0.1em] transition-all shadow-md active:scale-95 flex items-center justify-center gap-1"
                   title="Ver mais tarde"
                 >
                   <i className="fas fa-rotate text-[10px]"></i> Pular
                 </button>
                 <button 
                   onClick={(e) => { e.stopPropagation(); onAccept(); }}
                   className="py-4 bg-[#b7950b] hover:bg-[#9a7d0a] text-black rounded-xl text-[9px] font-bold uppercase tracking-[0.1em] transition-all shadow-lg active:scale-95"
                   title="Adicionar ao backlog"
                 >
                   Combater
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DO PERGAMINHO DE INTELIGÊNCIA */}
      {showIntel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative parchment max-w-2xl w-full max-h-[80vh] overflow-hidden rounded-[2rem] border-[12px] border-[#1a0f0a] shadow-2xl flex flex-col">
            <button 
              onClick={() => setShowIntel(false)}
              className="absolute top-4 right-4 text-[#1a0f0a] hover:scale-125 transition-transform"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>
            
            <div className="p-12 overflow-y-auto custom-scrollbar">
              <div className="text-center mb-8">
                <i className="fas fa-scroll text-4xl text-[#1a0f0a] mb-4"></i>
                <h3 className="text-2xl font-bold medieval-font uppercase tracking-widest border-b-2 border-[#1a0f0a]/20 pb-4">
                  Inteligência Arcana: {card.title}
                </h3>
              </div>
              
              <div className="space-y-6 text-[#1a0f0a] font-serif leading-relaxed text-base italic">
                {isIntelLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <i className="fas fa-hat-wizard text-5xl animate-bounce"></i>
                    <p className="medieval-font uppercase tracking-widest text-sm">O Mago está consultando os cosmos...</p>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">
                    {intelContent}
                  </div>
                )}
              </div>
              
              <div className="mt-12 pt-8 border-t border-[#1a0f0a]/20 text-center">
                <button 
                  onClick={() => setShowIntel(false)}
                  className="px-8 py-3 bg-[#1a0f0a] text-[#d4c3a1] rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors"
                >
                  Fechar Pergaminho
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SecurityCardComp;
