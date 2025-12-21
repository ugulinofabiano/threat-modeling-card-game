
import { GoogleGenAI } from "@google/genai";
import { BacklogItem, SecurityCard } from '../types';

// Cache keys for persistence
const IMAGE_CACHE_KEY = 'tmm_image_cache';
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
    return "Não foi possível gerar o resumo inteligente no momento, mas seu backlog está salvo!";
  }
};

export const generateCardImage = async (cardId: string, prompt: string): Promise<string | null> => {
  // Check Cache First
  const cache = getCache(IMAGE_CACHE_KEY);
  if (cache[cardId]) return cache[cardId];

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const fullPrompt = `Antique medieval manuscript illumination, woodcut style, depicting ${prompt}, aged parchment background, golden ink details, highly detailed historical fantasy art, dark and mysterious atmosphere.`;

  try {
    // Corrected to use string prompt directly for simplicity and to follow documentation best practices
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: fullPrompt,
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64 = `data:image/png;base64,${part.inlineData.data}`;
        // Save to cache
        cache[cardId] = base64;
        setCache(IMAGE_CACHE_KEY, cache);
        return base64;
      }
    }
    return null;
  } catch (error) {
    console.error("Erro ao gerar imagem medieval:", error);
    return null;
  }
};

export const generateThreatIntelligence = async (card: SecurityCard): Promise<string> => {
  // Check Cache First
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
    
    // Save to cache
    cache[card.id] = text;
    setCache(INTEL_CACHE_KEY, cache);
    
    return text;
  } catch (error) {
    console.error("Erro ao gerar inteligência:", error);
    return "As estrelas não estão alinhadas para esta revelação agora.";
  }
};
