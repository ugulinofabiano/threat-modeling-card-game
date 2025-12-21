
export enum StrideCategory {
  SPOOFING = 'Spoofing',
  TAMPERING = 'Tampering',
  REPUDIATION = 'Repudiation',
  INFORMATION_DISCLOSURE = 'Information Disclosure',
  DENIAL_OF_SERVICE = 'Denial of Service',
  ELEVATION_OF_PRIVILEGE = 'Elevation of Privilege'
}

export enum RiskLevel {
  LOW = 'Baixo',
  MEDIUM = 'Médio',
  HIGH = 'Alto'
}

export interface SecurityCard {
  id: string;
  title: string;
  category: StrideCategory;
  impact: RiskLevel;
  probability: RiskLevel;
  description: string;
  image?: string;
  imagePrompt?: string;
  mitigation: string;
  gameHint?: string;
  riskDomain?: string;
  reference?: string;
  referenceUrl?: string;
}

export interface Deck {
  id: string;
  name: string;
  icon: string;
  description: string;
  cards: SecurityCard[];
}

export interface BacklogItem extends SecurityCard {
  acceptedAt: Date;
  status: 'pending' | 'mitigated';
}

export type GameState = 'LOBBY' | 'PLAYING' | 'SUMMARY';
