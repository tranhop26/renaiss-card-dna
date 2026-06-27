"""
Renaiss Card DNA - Backend API
AI-powered card personality & matching engine
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import json
from pathlib import Path
from ai_engine import CardDNAAnalyzer

app = FastAPI(
    title="Renaiss Card DNA API",
    description="AI-powered card personality analysis and collector matching",
    version="1.0.0"
)

# Initialize AI analyzer globally
def get_analyzer():
    """Load data and initialize analyzer"""
    cards = load_mock_data()
    return CardDNAAnalyzer(cards)

analyzer = None  # Will be initialized on first request

# CORS middleware - cho phép frontend gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production nên specific hơn
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# PYDANTIC MODELS - Define data structure
# ============================================

class VisualDNA(BaseModel):
    """Visual characteristics của card"""
    color_palette: List[str]
    style: str
    complexity_score: float
    dominant_colors: List[str]

class BehavioralDNA(BaseModel):
    """Trading behavior patterns"""
    avg_hold_time: str
    trading_velocity: str
    collector_type: str
    activity_score: float

class MarketDNA(BaseModel):
    """Market & rarity characteristics"""
    volatility: float
    rarity_tier: str
    collection_synergy: List[str]
    price_momentum: str

class CardDNA(BaseModel):
    """Complete DNA profile của một card"""
    card_id: str
    card_name: str
    visual_dna: VisualDNA
    behavioral_dna: BehavioralDNA
    market_dna: MarketDNA
    overall_score: float
    personality_summary: str

class MatchResult(BaseModel):
    """Kết quả matching giữa collector và card"""
    card_id: str
    card_name: str
    match_score: float
    match_reasons: List[str]
    recommendation_strength: str  # "strong", "moderate", "weak"

# ============================================
# HELPER FUNCTIONS
# ============================================

def load_mock_data() -> List[Dict]:
    """Load mock card data từ JSON file"""
    data_path = Path(__file__).parent.parent / "data" / "mock_cards.json"

    # Nếu file chưa tồn tại, return sample data
    if not data_path.exists():
        return [
            {
                "card_id": "card_001",
                "card_name": "Cyber Samurai",
                "image_url": "https://placeholder.com/400x600",
                "rarity": "rare",
                "metadata": {}
            }
        ]

    with open(data_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# ============================================
# API ENDPOINTS
# ============================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "active",
        "service": "Renaiss Card DNA API",
        "version": "1.0.0",
        "endpoints": [
            "/api/card/{card_id}/dna",
            "/api/collector/{wallet}/profile",
            "/api/match/{wallet}/recommendations",
            "/api/portfolio/{wallet}/analytics"
        ]
    }

@app.get("/api/cards")
async def list_cards():
    """Lấy danh sách tất cả cards"""
    cards = load_mock_data()
    return {
        "total": len(cards),
        "cards": cards
    }

@app.get("/api/card/{card_id}/dna", response_model=CardDNA)
async def analyze_card_dna(card_id: str):
    """
    Phân tích DNA của một card cụ thể

    Args:
        card_id: ID của card cần phân tích

    Returns:
        CardDNA object chứa full DNA profile
    """
    global analyzer
    if analyzer is None:
        analyzer = get_analyzer()

    try:
        dna = analyzer.calculate_card_dna(card_id)

        # Convert to Pydantic models
        return CardDNA(
            card_id=dna["card_id"],
            card_name=dna["card_name"],
            visual_dna=VisualDNA(**dna["visual_dna"]),
            behavioral_dna=BehavioralDNA(**dna["behavioral_dna"]),
            market_dna=MarketDNA(**dna["market_dna"]),
            overall_score=dna["overall_score"],
            personality_summary=dna["personality_summary"]
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/api/collector/{wallet}/profile")
async def get_collector_profile(wallet: str):
    """
    Phân tích profile của collector dựa trên collection history

    Args:
        wallet: Wallet address của collector

    Returns:
        Collector DNA profile
    """
    global analyzer
    if analyzer is None:
        analyzer = get_analyzer()

    profile = analyzer.analyze_collector_profile(wallet)
    return profile

@app.get("/api/match/{wallet}/recommendations", response_model=List[MatchResult])
async def get_card_recommendations(wallet: str, limit: int = 5):
    """
    Gợi ý cards phù hợp với collector

    Args:
        wallet: Wallet address
        limit: Số lượng recommendations tối đa

    Returns:
        List of matched cards với scores
    """
    global analyzer
    if analyzer is None:
        analyzer = get_analyzer()

    # Get collector profile để determine preferences
    profile = analyzer.analyze_collector_profile(wallet)
    primary_style = profile["collection_dna"]["primary_style"].lower().replace(" ", "_")

    # Create preferences based on profile
    preferences = {
        "preferred_styles": [primary_style, "tech", "fantasy"],
        "max_price": 5.0,
        "trading_velocity": "any"
    }

    matches = analyzer.match_cards_for_collector(preferences, limit=limit)

    # Convert to MatchResult models
    results = []
    for card_id, card_name, score, reasons in matches:
        strength = "strong" if score > 0.7 else "moderate" if score > 0.4 else "weak"
        results.append(
            MatchResult(
                card_id=card_id,
                card_name=card_name,
                match_score=score,
                match_reasons=reasons,
                recommendation_strength=strength
            )
        )

    return results

@app.get("/api/portfolio/{wallet}/analytics")
async def get_portfolio_analytics(wallet: str):
    """
    Portfolio analytics với data for charts

    Args:
        wallet: Wallet address

    Returns:
        Portfolio analytics data for visualization
    """
    global analyzer
    if analyzer is None:
        analyzer = get_analyzer()

    # Get collector profile
    profile = analyzer.analyze_collector_profile(wallet)

    # Get all cards in collection (mock: random sample based on wallet)
    import hashlib
    wallet_hash = int(hashlib.md5(wallet.encode()).hexdigest()[:8], 16)
    import random
    random.seed(wallet_hash)

    cards = load_mock_data()
    collection_size = profile["collection_dna"]["total_cards"]
    collection_cards = random.sample(cards, min(collection_size, len(cards)))

    # Analyze collection
    style_distribution = {}
    rarity_distribution = {}
    complexity_scores = []
    total_value = 0
    avg_score = 0

    for card in collection_cards:
        # Get card DNA
        dna = analyzer.calculate_card_dna(card["card_id"])

        # Style distribution
        style = dna["visual_dna"]["style"]
        style_distribution[style] = style_distribution.get(style, 0) + 1

        # Rarity distribution
        rarity = dna["market_dna"]["rarity_tier"]
        rarity_distribution[rarity] = rarity_distribution.get(rarity, 0) + 1

        # Complexity scores
        complexity_scores.append({
            "card_name": dna["card_name"],
            "complexity": dna["visual_dna"]["complexity_score"]
        })

        # Total value and scores
        total_value += dna["market_dna"].get("current_price", 0)
        avg_score += dna["overall_score"]

    avg_score = avg_score / len(collection_cards) if collection_cards else 0

    return {
        "wallet": wallet,
        "collection_size": collection_size,
        "total_value": round(total_value, 2),
        "average_score": round(avg_score, 1),
        "style_distribution": [
            {"style": style, "count": count}
            for style, count in style_distribution.items()
        ],
        "rarity_distribution": [
            {"rarity": rarity, "count": count}
            for rarity, count in rarity_distribution.items()
        ],
        "complexity_scores": sorted(complexity_scores, key=lambda x: x["complexity"], reverse=True)[:10],
        "primary_style": profile["collection_dna"]["primary_style"],
        "collector_type": profile["collection_dna"]["collector_type"]
    }

# ============================================
# RUN SERVER
# ============================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
