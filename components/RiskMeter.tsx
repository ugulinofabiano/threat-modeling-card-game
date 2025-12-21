
import React from 'react';
import { RiskLevel, BacklogItem } from '../types';

interface Props {
  backlog: BacklogItem[];
}

const RiskMeter: React.FC<Props> = ({ backlog }) => {
  const calculateScore = () => {
    return backlog.reduce((acc, item) => {
      let impactScore = item.impact === RiskLevel.HIGH ? 3 : item.impact === RiskLevel.MEDIUM ? 2 : 1;
      let probScore = item.probability === RiskLevel.HIGH ? 3 : item.probability === RiskLevel.MEDIUM ? 2 : 1;
      return acc + (impactScore * probScore);
    }, 0);
  };

  const score = calculateScore();
  const maxSuggested = 40;
  const percentage = Math.min((score / maxSuggested) * 100, 100);

  const getFireColor = () => {
    if (percentage < 25) return 'from-emerald-600 to-emerald-400';
    if (percentage < 60) return 'from-orange-600 to-yellow-400';
    return 'from-red-700 to-orange-500';
  };

  return (
    <div className="w-full max-w-sm bg-[#1a0f0a] rounded-2xl p-5 border-2 border-[#b7950b]/40 shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-3 relative z-10">
        <div className="flex items-center gap-2">
           <i className={`fas fa-chess-rook ${percentage > 70 ? 'text-red-500 animate-bounce' : 'text-[#b7950b]'}`}></i>
           <span className="text-[10px] font-black text-[#b7950b] uppercase tracking-widest medieval-font">Vulnerabilidade do Castelo</span>
        </div>
        <span className={`text-sm font-black medieval-font ${percentage > 70 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
          {score} PODER
        </span>
      </div>
      
      <div className="w-full h-4 bg-black rounded-full p-0.5 border border-[#b7950b]/20 relative">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${getFireColor()} ${percentage > 60 ? 'flame-effect' : ''}`}
          style={{ width: `${percentage}%` }}
        />
        {/* Detalhe de ameias de castelo */}
        <div className="absolute inset-0 flex justify-around pointer-events-none opacity-20">
            {[...Array(6)].map((_, i) => <div key={i} className="w-1 h-full border-x border-[#b7950b]"></div>)}
        </div>
      </div>
    </div>
  );
};

export default RiskMeter;
