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
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Renaiss Card DNA API",
    description="AI-powered card personality analysis and collector matching",
    version="1.0.0"
)

# Initialize OpenAI client
openai_client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url="https://cheapkeyai.shop/v1"
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

class ChatMessage(BaseModel):
    """Chat message request"""
    message: str
    card_id: Optional[str] = None
    context: Optional[Dict] = None

class ChatResponse(BaseModel):
    """Chat message response"""
    response: str
    card_referenced: Optional[str] = None

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

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_advisor(chat_message: ChatMessage):
    """
    AI Chat Advisor - tư vấn về cards và collection

    Args:
        chat_message: Message từ user, optional card_id và context

    Returns:
        AI response
    """
    global analyzer
    if analyzer is None:
        analyzer = get_analyzer()

    # Build context for AI
    context_text = "You are a Renaiss Card DNA Advisor - an expert AI assistant specializing in digital trading cards.\n\n"

    # If card_id provided, get card DNA
    card_info = ""
    if chat_message.card_id:
        try:
            dna = analyzer.calculate_card_dna(chat_message.card_id)
            card_info = f"""
**Card Context:**
- Card: {dna['card_name']} ({dna['card_id']})
- Rarity: {dna['rarity']}
- Overall Score: {dna['overall_score']}/10
- Style: {dna['visual_dna']['style']}
- Complexity: {dna['visual_dna']['complexity_score']}/10
- Collector Type: {dna['behavioral_dna']['collector_type']}
- Price Momentum: {dna['market_dna']['price_momentum']}
- Personality: {dna['personality_summary']}
"""
            context_text += card_info
        except:
            pass

    # Add user's additional context
    if chat_message.context:
        context_text += f"\n**Additional Context:** {json.dumps(chat_message.context)}\n"

    # System prompt
    system_prompt = f"""{context_text}

Your role:
- Provide insights about card DNA, trading patterns, and collection strategy
- Be concise but informative (2-4 sentences)
- Use warm, friendly tone
- Reference specific DNA metrics when relevant
- Give actionable advice

Guidelines:
- This is demo data (20 mock cards)
- Not financial advice - illustrative prototype only
- Focus on card personality and collector fit
"""

    # Call OpenAI
    try:
        response = openai_client.chat.completions.create(
            model="gpt-5.5",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": chat_message.message}
            ],
            temperature=0.7,
            max_tokens=200
        )

        ai_response = response.choices[0].message.content

        return ChatResponse(
            response=ai_response,
            card_referenced=chat_message.card_id
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI chat error: {str(e)}")


class CompareRequest(BaseModel):
    card_id_1: str
    card_id_2: str
    collector_context: Optional[Dict] = None


class CompareResponse(BaseModel):
    card_1: Dict
    card_2: Dict
    comparison: Dict
    ai_recommendation: str
    winner: str  # "card_1", "card_2", or "tie"


@app.post("/api/compare", response_model=CompareResponse)
async def compare_cards(compare_request: CompareRequest):
    """
    So sánh 2 cards side-by-side với AI analysis

    Args:
        compare_request: 2 card IDs và optional collector context

    Returns:
        DNA comparison + AI recommendation
    """
    global analyzer
    if analyzer is None:
        analyzer = get_analyzer()

    try:
        # Get DNA for both cards
        dna_1 = analyzer.calculate_card_dna(compare_request.card_id_1)
        dna_2 = analyzer.calculate_card_dna(compare_request.card_id_2)

        # Calculate differences
        comparison = {
            "visual": {
                "complexity_diff": round(dna_1['visual_dna']['complexity_score'] - dna_2['visual_dna']['complexity_score'], 1),
                "style_match": dna_1['visual_dna']['style'] == dna_2['visual_dna']['style']
            },
            "behavioral": {
                "hold_time_diff": dna_1['behavioral_dna'].get('avg_hold_days', 0) - dna_2['behavioral_dna'].get('avg_hold_days', 0),
                "collector_type_match": dna_1['behavioral_dna']['collector_type'] == dna_2['behavioral_dna']['collector_type']
            },
            "market": {
                "price_momentum": {
                    "card_1": dna_1['market_dna']['price_momentum'],
                    "card_2": dna_2['market_dna']['price_momentum']
                },
                "volatility_diff": round(dna_1['market_dna']['volatility'] - dna_2['market_dna']['volatility'], 3)
            },
            "overall_score_diff": round(dna_1['overall_score'] - dna_2['overall_score'], 1)
        }

        # Build AI prompt
        context = f"""
Compare these two cards:

**Card 1: {dna_1['card_name']}**
- Rarity: {dna_1['rarity']}
- Overall Score: {dna_1['overall_score']}/10
- Style: {dna_1['visual_dna']['style']}
- Complexity: {dna_1['visual_dna']['complexity_score']}/10
- Collector Type: {dna_1['behavioral_dna']['collector_type']}
- Price Momentum: {dna_1['market_dna']['price_momentum']}

**Card 2: {dna_2['card_name']}**
- Rarity: {dna_2['rarity']}
- Overall Score: {dna_2['overall_score']}/10
- Style: {dna_2['visual_dna']['style']}
- Complexity: {dna_2['visual_dna']['complexity_score']}/10
- Collector Type: {dna_2['behavioral_dna']['collector_type']}
- Price Momentum: {dna_2['market_dna']['price_momentum']}
"""

        if compare_request.collector_context:
            context += f"\n**Collector Context:** {json.dumps(compare_request.collector_context)}\n"

        system_prompt = f"""{context}

Your task: Compare these cards and recommend which one is better.

Analyze:
- Visual appeal and complexity
- Trading behavior and collector fit
- Market performance and momentum

Provide a 3-4 sentence recommendation explaining:
1. Key differences
2. Which card fits better and why
3. Specific advice

Be concise and actionable."""

        # Call OpenAI
        response = openai_client.chat.completions.create(
            model="gpt-5.5",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Which card should I choose?"}
            ],
            temperature=0.7,
            max_tokens=250
        )

        ai_recommendation = response.choices[0].message.content

        # Determine winner based on overall score
        if comparison['overall_score_diff'] > 0.5:
            winner = "card_1"
        elif comparison['overall_score_diff'] < -0.5:
            winner = "card_2"
        else:
            winner = "tie"

        return CompareResponse(
            card_1=dna_1,
            card_2=dna_2,
            comparison=comparison,
            ai_recommendation=ai_recommendation,
            winner=winner
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison error: {str(e)}")

# ============================================
# RUN SERVER
# ============================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
