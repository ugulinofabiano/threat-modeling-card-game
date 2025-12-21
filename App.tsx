
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Deck, SecurityCard, BacklogItem, StrideCategory, RiskLevel } from './types';
import { DECKS } from './constants';
import SecurityCardComp from './components/SecurityCardComp';
import RiskMeter from './components/RiskMeter';
import { generateSecuritySummary } from './services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('LOBBY');
  const [allDecks] = useState<Deck[]>(DECKS);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [currentCards, setCurrentCards] = useState<SecurityCard[]>([]);
  const [backlog, setBacklog] = useState<BacklogItem[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const startGame = (deck: Deck) => {
    setSelectedDeck(deck);
    const shuffled = [...deck.cards].sort(() => Math.random() - 0.5);
    setCurrentCards(shuffled);
    setGameState('PLAYING');
    setBacklog([]);
    setAiSummary(null);
  };

  const handleHiddenThreats = () => {
    // Coleta todas as cartas de todos os decks
    const allCards = allDecks.flatMap(deck => deck.cards);
    // Embaralha e pega apenas 3
    const randomThree = [...allCards]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    setSelectedDeck({
      id: 'hidden-threats',
      name: 'Ameaças Ocultas',
      icon: 'fa-skull',
      description: 'Uma incursão perigosa pelas sombras do reino, revelando segredos que nunca deveriam ter sido encontrados.',
      cards: randomThree
    });
    
    setCurrentCards(randomThree);
    setGameState('PLAYING');
    setBacklog([]);
    setAiSummary(null);
  };

  const handleAccept = useCallback((card: SecurityCard) => {
    setBacklog(prev => [...prev, { 
      ...card, 
      acceptedAt: new Date(), 
      status: 'pending' 
    }]);
    setCurrentCards(prev => prev.filter(c => c.id !== card.id));
  }, []);

  const handlePass = useCallback((card: SecurityCard) => {
    setCurrentCards(prev => prev.filter(c => c.id !== card.id));
  }, []);

  const handleSkip = useCallback((card: SecurityCard) => {
    setCurrentCards(prev => {
      const remaining = prev.filter(c => c.id !== card.id);
      return [...remaining, card];
    });
  }, []);

  useEffect(() => {
    if (gameState === 'PLAYING' && currentCards.length === 0 && selectedDeck !== null) {
      setGameState('SUMMARY');
    }
  }, [currentCards.length, gameState, selectedDeck]);

  useEffect(() => {
    if (gameState === 'SUMMARY' && backlog.length > 0 && !aiSummary) {
      const getSummary = async () => {
        setIsSummarizing(true);
        const summary = await generateSecuritySummary(backlog);
        setAiSummary(summary);
        setIsSummarizing(false);
      };
      getSummary();
    }
  }, [gameState, backlog.length, aiSummary]);

  const strideData = Object.values(StrideCategory).map(cat => ({
    name: cat,
    value: backlog.filter(item => item.category === cat).length
  })).filter(item => item.value > 0);

  const COLORS = ['#b7950b', '#8d6e63', '#d4c3a1', '#9a7d0a', '#5d4037', '#795548'];

  return (
    <div className="min-h-screen flex flex-col relative z-20">
      <header className="px-12 py-6 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#b7950b] to-[#7d6608] rounded-full flex items-center justify-center shadow-lg border border-white/10">
            <i className="fas fa-shield-halved text-black text-xl"></i>
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-wider text-[#f4e4bc] uppercase medieval-font gold-glow">Threat Modeling Master</h1>
            <p className="text-[8px] text-[#b7950b] font-black uppercase tracking-[0.4em]">Guardião do Reino Seguro</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <button className="flex items-center gap-2 px-6 py-2 bg-black/60 border border-[#b7950b]/30 rounded-full transition-all hover:bg-[#b7950b]/10 group">
             <i className="fas fa-book-skull text-[#b7950b] text-xs"></i>
             <span className="text-[10px] font-bold text-white uppercase tracking-widest medieval-font">Sabedoria Antiga & Pergaminhos</span>
           </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center p-8 lg:p-12">
        {gameState === 'LOBBY' && (
          <div className="max-w-7xl w-full text-center space-y-12 py-12 animate-fadeIn">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-bold text-[#f4e4bc] medieval-font tracking-tight gold-glow uppercase">
                O Grande Arquivo de Ameaças
              </h2>
              <p className="text-[#b7950b] max-w-2xl mx-auto text-xl italic font-serif opacity-80">
                "Nenhum reino cai sem antes ser corroído pelas sombras ocultas."
              </p>
            </div>

            {/* SEÇÃO: AMEAÇAS OCULTAS (CAVEIRA) */}
            <div className="flex flex-col items-center py-8">
               <button 
                 onClick={handleHiddenThreats}
                 className="group relative flex flex-col items-center focus:outline-none"
               >
                 <div className="absolute -inset-8 bg-red-900/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                 <div className="relative w-40 h-40 bg-gradient-to-b from-[#1a0f0a] to-[#050505] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(183,149,11,0.2)] border-2 border-[#b7950b]/40 transform group-hover:scale-110 group-active:scale-95 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-20"></div>
                    <i className="fas fa-skull-crossbones text-[#b7950b] text-7xl group-hover:hidden transition-all"></i>
                    <i className="fas fa-skull text-red-600 text-7xl hidden group-hover:block transition-all animate-pulse"></i>
                    {/* Partículas de sombras */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-60"></div>
                    <div className="absolute bottom-4 left-6 w-1 h-1 bg-red-500 rounded-full animate-ping opacity-40 delay-300"></div>
                 </div>
                 <div className="mt-6 space-y-2">
                    <h3 className="text-2xl font-bold text-[#b7950b] medieval-font gold-glow uppercase tracking-widest">Ameaças Ocultas</h3>
                    <p className="text-[10px] font-bold text-[#f4e4bc]/60 uppercase tracking-[0.3em]">3 Desafios Aleatórios das Sombras</p>
                 </div>
               </button>
            </div>

            <div className="divider-gold w-3/4 mx-auto opacity-20"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-12 px-4">
              {allDecks.map((deck) => (
                <div key={deck.id} className="flex flex-col items-center">
                  <button 
                    onClick={() => startGame(deck)}
                    className="card-pedestal w-full aspect-[3/4] rounded-[0.5rem] p-1 border-stone-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col items-center group relative overflow-hidden ring-1 ring-[#b7950b]/10"
                  >
                    <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
                       <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a] via-transparent to-black/80"></div>
                       <img src={`https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&h=600&fit=crop`} className="w-full h-full object-cover" alt="" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full w-full p-8 items-center justify-between">
                      <div className="text-center">
                        <h3 className="text-3xl font-bold text-[#f4e4bc] medieval-font tracking-widest mb-2 uppercase group-hover:text-white transition-colors leading-tight">
                          {deck.name}
                        </h3>
                        <div className="divider-gold opacity-30 w-1/2 mx-auto"></div>
                      </div>

                      <div className="w-24 h-24 bg-black/60 border border-[#b7950b]/30 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                         <i className={`fas ${deck.icon} text-[#b7950b] text-4xl`}></i>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[11px] text-[#f4e4bc]/60 font-serif leading-relaxed italic px-4">
                          "{deck.description}"
                        </p>
                        <div className="divider-gold opacity-20"></div>
                        <div className="flex items-center justify-center gap-4 text-[#b7950b]">
                          <i className="fas fa-file-contract text-xs"></i>
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] medieval-font">
                            {deck.cards.length} Pergaminhos
                          </span>
                          <i className="fas fa-dragon opacity-30"></i>
                        </div>
                      </div>
                    </div>
                  </button>
                  <div className="w-[90%] h-4 bg-stone-900 border-x-4 border-stone-800 shadow-xl rounded-b-lg"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="flex flex-col items-center w-full max-w-6xl gap-16 animate-fadeIn">
            <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-8 bg-black/40 p-8 rounded-3xl border border-white/5 backdrop-blur-xl">
              <div className="space-y-2 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <i className="fas fa-fire text-orange-600 animate-pulse text-xs"></i>
                  <span className="text-[10px] font-bold text-[#b7950b] uppercase tracking-[0.3em] medieval-font">Capítulo Atual</span>
                </div>
                <h2 className="text-3xl font-bold text-[#f4e4bc] medieval-font tracking-wider uppercase">{selectedDeck?.name}</h2>
              </div>
              <RiskMeter backlog={backlog} />
              <div className="flex gap-4">
                 <div className="px-6 py-3 bg-black/60 border border-[#b7950b]/30 rounded-2xl text-center">
                    <div className="text-[8px] text-[#b7950b] font-bold uppercase tracking-widest mb-1">Restantes</div>
                    <div className="text-2xl font-bold text-white medieval-font">{currentCards.length}</div>
                 </div>
                 <button 
                  onClick={() => setGameState('LOBBY')}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-bold text-[#8d6e63] uppercase tracking-widest medieval-font self-center"
                 >
                   Abandonar
                 </button>
              </div>
            </div>

            <div className="relative h-[600px] w-full flex justify-center items-center perspective-1000">
              {currentCards.length > 0 ? (
                <div key={currentCards[0].id} className="animate-cardEnter">
                  <SecurityCardComp 
                    card={currentCards[0]} 
                    isFirst={true}
                    onAccept={() => handleAccept(currentCards[0])}
                    onPass={() => handlePass(currentCards[0])}
                    onSkip={() => handleSkip(currentCards[0])}
                    onExit={() => setGameState('LOBBY')}
                  />
                </div>
              ) : (
                <div className="text-center space-y-8 animate-fadeIn">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#b7950b] to-[#7d6608] rounded-full flex items-center justify-center mx-auto shadow-gold">
                    <i className="fas fa-crown text-black text-4xl"></i>
                  </div>
                  <h3 className="text-4xl font-bold text-[#f4e4bc] medieval-font uppercase tracking-tighter">Crônica Finalizada</h3>
                  <button onClick={() => setGameState('SUMMARY')} className="px-8 py-4 bg-[#b7950b] text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-colors medieval-font">Ver Resultado Final</button>
                </div>
              )}
            </div>
          </div>
        )}

        {gameState === 'SUMMARY' && (
          <div className="w-full max-w-7xl space-y-12 py-12 animate-fadeIn">
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-bold text-[#f4e4bc] medieval-font gold-glow uppercase">Relatório de Fortificação</h2>
              <p className="text-[#8d6e63] uppercase tracking-[0.2em] text-[10px] font-bold">Capítulo: {selectedDeck?.name}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="stone-panel p-10 rounded-3xl">
                    <h3 className="text-[10px] font-bold text-[#b7950b] mb-8 uppercase tracking-[0.3em] medieval-font">Distribuição de Maldições</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={strideData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={85}
                            paddingAngle={8}
                            dataKey="value"
                          >
                            {strideData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0d0d0d', border: '1px solid #b7950b', borderRadius: '12px', color: '#f4e4bc', fontSize: '12px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="stone-panel p-10 rounded-3xl flex flex-col justify-center items-center text-center">
                    <div className="w-20 h-20 bg-[#b7950b]/10 rounded-full flex items-center justify-center mb-8 border border-[#b7950b]/20">
                      <i className="fas fa-file-invoice text-[#b7950b] text-3xl"></i>
                    </div>
                    <div className="text-7xl font-bold text-white mb-2 medieval-font tracking-tighter">{backlog.length}</div>
                    <div className="text-[10px] font-bold text-[#b7950b] uppercase tracking-[0.4em]">Riscos Aceitos</div>
                    <div className="divider-gold w-full my-8"></div>
                    <p className="text-[11px] text-[#8d6e63] leading-relaxed italic font-serif">
                      "Para cada brecha revelada, um novo tijolo deve ser posto na muralha."
                    </p>
                  </div>
                </div>

                <div className="stone-panel rounded-3xl overflow-hidden">
                   <div className="p-8 border-b border-white/5 bg-white/5">
                      <h3 className="text-[10px] font-bold text-[#b7950b] uppercase tracking-[0.3em] medieval-font">Livro de Backlog</h3>
                   </div>
                   <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-black/40 text-[#b7950b] text-[9px] font-bold uppercase tracking-[0.2em]">
                          <th className="py-5 px-8">Ameaça</th>
                          <th className="py-5 px-8">Referência</th>
                          <th className="py-5 px-8 text-right">Gravidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {backlog.map((item, idx) => (
                          <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                            <td className="py-6 px-8">
                              <div className="font-bold text-[#f4e4bc] medieval-font text-lg">{item.title}</div>
                              <div className="text-[9px] text-[#8d6e63] mt-1 uppercase tracking-wider">{item.category}</div>
                            </td>
                            <td className="py-6 px-8">
                              <a href={item.referenceUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-2">
                                <i className="fas fa-link text-[8px]"></i> {item.reference}
                              </a>
                            </td>
                            <td className="py-6 px-8 text-right">
                              <span className={`px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                                item.impact === RiskLevel.HIGH ? 'bg-red-900/40 text-red-400 border border-red-500/20' : 
                                item.impact === RiskLevel.MEDIUM ? 'bg-amber-900/40 text-amber-400 border border-amber-500/20' : 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {item.impact}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                   </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="parchment p-10 rounded-[2rem] sticky top-28 space-y-8">
                  <div className="text-center">
                    <i className="fas fa-feather-pointed text-[#2c1810] text-3xl mb-4 opacity-40"></i>
                    <h3 className="font-bold text-xl text-[#2c1810] medieval-font uppercase tracking-widest">Sábio Arquiteto</h3>
                  </div>
                  <div className="divider-gold opacity-100 bg-[#2c1810]/20"></div>
                  <div className="text-[13px] text-[#3e2723] font-serif leading-relaxed italic whitespace-pre-wrap min-h-[200px]">
                    {isSummarizing ? (
                      <div className="space-y-3 animate-pulse">
                        <div className="h-3 bg-[#1a0f0a]/10 rounded w-full"></div>
                        <div className="h-3 bg-[#1a0f0a]/10 rounded w-full"></div>
                        <div className="h-3 bg-[#1a0f0a]/10 rounded w-3/4"></div>
                      </div>
                    ) : aiSummary || "Consultando os astros e logs..."}
                  </div>
                  <button 
                    onClick={() => setGameState('LOBBY')}
                    className="w-full py-5 bg-[#2c1810] hover:bg-black text-[#d4c3a1] rounded-2xl font-bold text-[10px] tracking-[0.3em] uppercase transition-all shadow-xl"
                  >
                    Nova Expedição
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
