import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface VisualDNA {
  color_palette: string[];
  style: string;
  complexity_score: number;
  dominant_colors: string[];
  mood?: string;
  color_richness?: number;
}

export interface BehavioralDNA {
  avg_hold_time: string;
  trading_velocity: string;
  collector_type: string;
  activity_score: number;
  total_trades?: number;
  liquidity_rating?: string;
}

export interface MarketDNA {
  volatility: number;
  rarity_tier: string;
  collection_synergy: string[];
  price_momentum: string;
  total_supply?: number;
  current_price?: number;
}

export interface CardDNA {
  card_id: string;
  card_name: string;
  visual_dna: VisualDNA;
  behavioral_dna: BehavioralDNA;
  market_dna: MarketDNA;
  overall_score: number;
  personality_summary: string;
  rarity?: string;
  artist?: string;
}

export interface Card {
  card_id: string;
  card_name: string;
  image_url: string;
  rarity: string;
  artist: string;
  current_price: number;
}

export interface MatchResult {
  card_id: string;
  card_name: string;
  match_score: number;
  match_reasons: string[];
  recommendation_strength: string;
}

export interface CollectorProfile {
  wallet: string;
  collection_dna: {
    primary_style: string;
    style_distribution: Record<string, number>;
    collector_type: string;
    total_cards: number;
    avg_hold_time: string;
  };
  portfolio_gaps: string[];
  personality_traits: string[];
}

export interface PortfolioAnalytics {
  wallet: string;
  collection_size: number;
  total_value: number;
  average_score: number;
  style_distribution: { style: string; count: number }[];
  rarity_distribution: { rarity: string; count: number }[];
  complexity_scores: { card_name: string; complexity: number }[];
  primary_style: string;
  collector_type: string;
}

// API Functions
export const getCards = async (): Promise<{ total: number; cards: Card[] }> => {
  const response = await api.get('/api/cards');
  return response.data;
};

export const getCardDNA = async (cardId: string): Promise<CardDNA> => {
  const response = await api.get(`/api/card/${cardId}/dna`);
  return response.data;
};

export const getCollectorProfile = async (wallet: string): Promise<CollectorProfile> => {
  const response = await api.get(`/api/collector/${wallet}/profile`);
  return response.data;
};

export const getRecommendations = async (
  wallet: string,
  limit: number = 5
): Promise<MatchResult[]> => {
  const response = await api.get(`/api/match/${wallet}/recommendations`, {
    params: { limit },
  });
  return response.data;
};

export const getPortfolioAnalytics = async (wallet: string): Promise<PortfolioAnalytics> => {
  const response = await api.get(`/api/portfolio/${wallet}/analytics`);
  return response.data;
};

export interface ChatResponse {
  response: string;
  card_referenced: string | null;
}

export const sendChatMessage = async (
  message: string,
  cardId?: string,
  context?: Record<string, any>
): Promise<ChatResponse> => {
  const response = await api.post('/api/chat', {
    message,
    card_id: cardId,
    context
  });
  return response.data;
};

export default api;
