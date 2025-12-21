
import { GoogleGenAI } from "@google/genai";
import { BacklogItem, SecurityCard } from '../types';

// Cache keys for persistence
const IMAGE_CACHE_KEY = 'tmm_image_cache';
const INTEL_CACHE_KEY = 'tmm_intel_cache';

const getCache = (key: string) => {
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : {};
  } catch (e) {
    return {};
  }
};

const setCache = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Cache quota exceeded");
  }
};

export const generateSecuritySummary = async (backlog: BacklogItem[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const riskContext = backlog.map(item => 
    `- **${item.title}** (${item.category}): Impacto ${item.impact}. Scenario: ${item.description}`
  ).join('\n');

  const prompt = `
    Aja como um Arquiteto de Segurança Sênior. Abaixo está uma lista de riscos identificados em um jogo de Threat Modeling:

    ${riskContext}

    Por favor, forneça um resumo executivo em Português usando formatação Markdown:
    1. **Maior Prioridade**: Qual o risco mais crítico?
    2. **Estratégia**: Uma recomendação para a cultura de segurança.
    3. **Próximos Passos**: 3 passos acionáveis em uma lista.
    
    Use negrito para termos importantes e mantenha um tom profissional e medieval.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return `
**Relatório de Contingência do Escriba**

O Mago Real está indisponível, mas você identificou **${backlog.length} ameaças**.

1. **Prioridade Imediata**: Revisar ameaças de Impacto ALTO.
2. **Conselho**: Não ignore os sinais das sombras.
3. **Passos**: Triar itens, validar mitigações e agendar nova expedição.
    `.trim();
  }
};

export const generateCardImage = async (cardId: string, prompt: string): Promise<string | null> => {
  const cache = getCache(IMAGE_CACHE_KEY);
  if (cache[cardId]) return cache[cardId];

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const fullPrompt = `Dark antique medieval manuscript illumination, woodcut style, depicting ${prompt}, aged parchment background, cinematic lighting, golden ink details, highly detailed.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: fullPrompt,
      config: { imageConfig: { aspectRatio: "3:4" } }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64 = `data:image/png;base64,${part.inlineData.data}`;
        cache[cardId] = base64;
        setCache(IMAGE_CACHE_KEY, cache);
        return base64;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const generateThreatIntelligence = async (card: SecurityCard): Promise<string> => {
  const cache = getCache(INTEL_CACHE_KEY);
  if (cache[card.id]) return cache[card.id];

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Como um Mago da Segurança, forneça sabedoria sobre a ameaça "${card.title}" (${card.category}).
    Cenário: "${card.description}".
    
    Use formatação Markdown estruturada (negrito, listas, títulos curtos).
    Inclua:
    1. **Natureza da Maldição**: Explicação técnica moderna.
    2. **Crônicas do Mundo**: Exemplo histórico real.
    3. **Defesa Arcana**: 3 conselhos técnicos em lista.
    
    Responda em Português com tom medieval realista.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    const text = response.text || "O pergaminho está em branco.";
    
    cache[card.id] = text;
    setCache(INTEL_CACHE_KEY, cache);
    
    return text;
  } catch (error) {
    return `
### Pergaminho de Emergência Arcano

A natureza de **${card.title}** é traiçoeira.

**Defesas Sugeridas:**
- ${card.mitigation}
- Validar perímetros constantemente.
- Consultar os arquivos do reino (documentação).
    `.trim();
  }
};
