
import { GoogleGenAI } from "@google/genai";
import { BacklogItem, SecurityCard } from '../types';

// Cache keys for persistence
const INTEL_CACHE_KEY = 'tmm_intel_cache';

const getCache = (key: string) => {
  const cached = localStorage.getItem(key);
  return cached ? JSON.parse(cached) : {};
};

const setCache = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const generateSecuritySummary = async (backlog: BacklogItem[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const riskContext = backlog.map(item => 
    `- Risco: ${item.title} (${item.category})\n  Impacto: ${item.impact}\n  Cenário: ${item.description}`
  ).join('\n');

  const prompt = `
    Aja como um Arquiteto de Segurança Sênior. Abaixo está uma lista de riscos de segurança identificados por uma equipe de desenvolvimento durante um jogo de Threat Modeling:

    ${riskContext}

    Por favor, forneça um breve resumo executivo (em Português) destacando:
    1. A maior prioridade de correção.
    2. Uma recomendação estratégica para a cultura de segurança da equipe.
    3. Três passos acionáveis para o próximo sprint.
    
    Mantenha o tom encorajador e prático.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar resumo Gemini:", error);
    
    return `
      **Relatório de Contingência do Escriba**
      
      O Mago Real está indisponível no momento, mas os registros mostram que você identificou **${backlog.length} ameaças**.
      
      **Prioridade Imediata:** Revisar as ameaças de Impacto ALTO na Cidadela.
      **Conselho do Reino:** Não deixe que as sombras se acumulem no backlog.
      **Próximos Passos:** 
      1. Triar os itens aceitos com a equipe técnica.
      2. Validar as mitigações sugeridas em cada pergaminho.
      3. Agendar uma nova expedição para os decks restantes.
    `.trim();
  }
};

export const generateThreatIntelligence = async (card: SecurityCard): Promise<string> => {
  const cache = getCache(INTEL_CACHE_KEY);
  if (cache[card.id]) return cache[card.id];

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Como um Mago da Segurança, forneça um pergaminho de sabedoria detalhado sobre a ameaça "${card.title}" (${card.category}).
    A descrição da ameaça é: "${card.description}".
    
    Inclua:
    1. Uma explicação técnica de como este ataque ocorre no mundo real moderno.
    2. Um exemplo histórico ou famoso de incidente similar (se houver).
    3. Conselhos arcanos (técnicos) de como os desenvolvedores podem forjar defesas impenetráveis contra isso.
    
    Use um tom medieval, mas com termos técnicos precisos. Responda em Português.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    const text = response.text || "O pergaminho está em branco... tente novamente mais tarde.";
    
    cache[card.id] = text;
    setCache(INTEL_CACHE_KEY, cache);
    
    return text;
  } catch (error) {
    console.error("Erro ao gerar inteligência:", error);
    
    return `
      **Pergaminho de Emergência Arcano**
      
      O Mago Real está exausto e não pode consultar os astros agora. No entanto, os arquivos do reino dizem o seguinte sobre **${card.title}**:
      
      **Natureza da Maldição:** 
      ${card.description}
      
      **Como Forjar as Defesas:**
      ${card.mitigation}
      
      **Dica do Sábio:**
      ${card.gameHint || "Fique atento aos sinais e não ignore os alertas das sentinelas."}
    `.trim();
  }
};
