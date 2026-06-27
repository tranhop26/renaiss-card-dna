"""
AI Engine - Card DNA Analyzer
Phân tích visual, behavioral, và market DNA của cards
"""

import json
import random
import statistics
from typing import Dict, List, Tuple
from pathlib import Path
import hashlib


class CardDNAAnalyzer:
    """
    Core AI engine để phân tích DNA của cards
    Sử dụng clustering và scoring algorithms
    """

    def __init__(self, cards_data: List[Dict]):
        self.cards = cards_data

    def analyze_visual_dna(self, card: Dict) -> Dict:
        """
        Phân tích visual characteristics

        Args:
            card: Card data dictionary

        Returns:
            Visual DNA profile
        """
        traits = card.get("visual_traits", {})

        # Calculate complexity score từ colors và style
        complexity = traits.get("complexity", 5.0)
        num_colors = len(traits.get("primary_colors", []))

        # Style mapping
        style_complexity = {
            "cyberpunk": 8.0,
            "fantasy": 9.0,
            "urban": 6.0,
            "nature": 7.0,
            "tech": 8.5,
            "mythical": 9.5,
            "dark_fantasy": 8.8,
            "futuristic": 8.2,
            "industrial": 7.5,
            "cosmic": 9.8,
            "aquatic": 6.8,
            "abstract": 9.9,
            "organic": 7.2,
            "neon": 8.3,
            "ethereal": 9.0,
            "elemental": 9.2,
            "retro": 5.5,
            "celestial": 8.5,
            "weathered": 6.5,
            "digital": 9.5
        }

        style = traits.get("style", "unknown")
        adjusted_complexity = (complexity + style_complexity.get(style, 7.0)) / 2

        return {
            "color_palette": traits.get("primary_colors", []),
            "style": style,
            "complexity_score": round(adjusted_complexity, 1),
            "dominant_colors": self._extract_dominant_colors(traits.get("primary_colors", [])),
            "mood": traits.get("mood", "neutral"),
            "color_richness": num_colors
        }

    def analyze_behavioral_dna(self, card: Dict) -> Dict:
        """
        Phân tích trading behavior patterns

        Args:
            card: Card data dictionary

        Returns:
            Behavioral DNA profile
        """
        history = card.get("trading_history", {})

        avg_hold = history.get("avg_hold_days", 30)
        velocity = history.get("velocity", "medium")
        total_trades = history.get("total_trades", 0)

        # Determine collector type based on hold time
        if avg_hold > 150:
            collector_type = "long-term investor"
            activity_score = 0.3
        elif avg_hold > 60:
            collector_type = "strategic holder"
            activity_score = 0.5
        elif avg_hold > 20:
            collector_type = "active trader"
            activity_score = 0.7
        else:
            collector_type = "day trader"
            activity_score = 0.9

        # Adjust activity score based on total trades
        if total_trades > 100:
            activity_score = min(0.95, activity_score + 0.2)
        elif total_trades > 50:
            activity_score = min(0.9, activity_score + 0.1)

        return {
            "avg_hold_time": f"{avg_hold} days",
            "trading_velocity": velocity,
            "collector_type": collector_type,
            "activity_score": round(activity_score, 2),
            "total_trades": total_trades,
            "liquidity_rating": self._calculate_liquidity(velocity, total_trades)
        }

    def analyze_market_dna(self, card: Dict) -> Dict:
        """
        Phân tích market & rarity characteristics

        Args:
            card: Card data dictionary

        Returns:
            Market DNA profile
        """
        price_history = card.get("price_history", [])
        rarity = card.get("rarity", "common")

        # Calculate volatility (standard deviation of returns)
        if len(price_history) > 1:
            # Calculate returns manually
            returns = []
            for i in range(1, len(price_history)):
                if price_history[i-1] != 0:
                    ret = (price_history[i] - price_history[i-1]) / price_history[i-1]
                    returns.append(ret)

            # Calculate standard deviation manually
            if returns:
                volatility = statistics.stdev(returns) if len(returns) > 1 else 0.1
            else:
                volatility = 0.1
        else:
            volatility = 0.1

        # Calculate price momentum
        if len(price_history) >= 2:
            momentum = (price_history[-1] - price_history[0]) / price_history[0]
            if momentum > 0.3:
                price_momentum = "bullish"
            elif momentum < -0.1:
                price_momentum = "bearish"
            else:
                price_momentum = "stable"
        else:
            price_momentum = "stable"

        # Collection synergy based on style
        visual_traits = card.get("visual_traits", {})
        style = visual_traits.get("style", "")
        synergy = self._get_collection_synergy(style)

        return {
            "volatility": round(volatility, 3),
            "rarity_tier": rarity,
            "collection_synergy": synergy,
            "price_momentum": price_momentum,
            "total_supply": card.get("total_supply", 0),
            "current_price": card.get("current_price", 0)
        }

    def calculate_card_dna(self, card_id: str) -> Dict:
        """
        Tính toán complete DNA profile cho một card

        Args:
            card_id: ID của card

        Returns:
            Complete DNA profile
        """
        card = next((c for c in self.cards if c["card_id"] == card_id), None)

        if not card:
            raise ValueError(f"Card {card_id} not found")

        visual_dna = self.analyze_visual_dna(card)
        behavioral_dna = self.analyze_behavioral_dna(card)
        market_dna = self.analyze_market_dna(card)

        # Calculate overall score
        overall_score = self._calculate_overall_score(
            visual_dna, behavioral_dna, market_dna
        )

        # Generate personality summary
        personality = self._generate_personality_summary(
            visual_dna, behavioral_dna, market_dna
        )

        return {
            "card_id": card_id,
            "card_name": card.get("card_name", "Unknown"),
            "visual_dna": visual_dna,
            "behavioral_dna": behavioral_dna,
            "market_dna": market_dna,
            "overall_score": round(overall_score, 1),
            "personality_summary": personality,
            "rarity": card.get("rarity", "common"),
            "artist": card.get("artist", "Unknown")
        }

    def match_cards_for_collector(
        self,
        collector_preferences: Dict,
        limit: int = 5
    ) -> List[Tuple[str, float, List[str]]]:
        """
        Match cards với collector dựa trên preferences

        Args:
            collector_preferences: Dict chứa style preferences, budget, etc.
            limit: Số lượng recommendations

        Returns:
            List of (card_id, match_score, reasons)
        """
        matches = []

        preferred_styles = collector_preferences.get("preferred_styles", [])
        max_price = collector_preferences.get("max_price", 10.0)
        preferred_velocity = collector_preferences.get("trading_velocity", "any")

        for card in self.cards:
            # Skip nếu quá budget
            if card.get("current_price", 0) > max_price:
                continue

            dna = self.calculate_card_dna(card["card_id"])

            # Calculate match score
            score = 0.0
            reasons = []

            # Style match (40% weight)
            card_style = dna["visual_dna"]["style"]
            if card_style in preferred_styles:
                score += 0.4
                reasons.append(f"Matches your {card_style} preference")

            # Complexity preference (20% weight)
            complexity = dna["visual_dna"]["complexity_score"]
            if complexity >= 7.5:
                score += 0.2
                reasons.append("High visual complexity")

            # Trading velocity match (20% weight)
            card_velocity = dna["behavioral_dna"]["trading_velocity"]
            if preferred_velocity == "any" or card_velocity == preferred_velocity:
                score += 0.2
                reasons.append(f"Matches {card_velocity} trading velocity")

            # Rarity bonus (10% weight)
            if dna["rarity"] in ["legendary", "epic"]:
                score += 0.1
                reasons.append(f"Rare {dna['rarity']} tier")

            # Price momentum (10% weight)
            if dna["market_dna"]["price_momentum"] == "bullish":
                score += 0.1
                reasons.append("Bullish price momentum")

            matches.append((
                card["card_id"],
                card["card_name"],
                round(score, 2),
                reasons
            ))

        # Sort by score và return top N
        matches.sort(key=lambda x: x[2], reverse=True)
        return matches[:limit]

    def analyze_collector_profile(self, wallet_address: str) -> Dict:
        """
        Phân tích profile của collector (mock implementation)
        Trong production sẽ query blockchain data

        Args:
            wallet_address: Wallet address của collector

        Returns:
            Collector DNA profile
        """
        # Mock implementation - hash wallet để tạo deterministic profile
        wallet_hash = int(hashlib.md5(wallet_address.encode()).hexdigest()[:8], 16)

        # Use wallet_hash as seed for random
        random.seed(wallet_hash % 10000)

        # Random style distribution using Dirichlet-like distribution
        styles = ["cyberpunk", "fantasy", "dark_fantasy", "cosmic", "tech"]

        # Generate random weights and normalize
        raw_weights = [random.random() for _ in range(5)]
        total = sum(raw_weights)
        weights = [w / total for w in raw_weights]

        # Find primary style (max weight)
        max_weight_index = weights.index(max(weights))
        primary_style = styles[max_weight_index]

        # Mock collection
        num_cards = random.randint(5, 30)
        avg_hold = random.randint(20, 150)

        return {
            "wallet": wallet_address,
            "collection_dna": {
                "primary_style": primary_style.replace("_", " ").title(),
                "style_distribution": {
                    style: round(weight, 2)
                    for style, weight in zip(styles, weights)
                },
                "collector_type": "Strategic Trader" if avg_hold > 60 else "Active Trader",
                "total_cards": num_cards,
                "avg_hold_time": f"{avg_hold} days"
            },
            "portfolio_gaps": self._identify_portfolio_gaps(primary_style),
            "personality_traits": self._generate_collector_traits(primary_style, avg_hold)
        }

    # ===== HELPER METHODS =====

    def _extract_dominant_colors(self, color_palette: List[str]) -> List[str]:
        """Extract color names từ hex codes"""
        color_map = {
            "#FF6B6B": "red", "#4ECDC4": "cyan", "#1A1A2E": "dark",
            "#9B59B6": "purple", "#3498DB": "blue", "#E8DAEF": "lavender",
            "#F39C12": "orange", "#E74C3C": "crimson", "#000000": "black",
            "#27AE60": "green", "#16A085": "teal"
        }

        return [color_map.get(c, "unknown") for c in color_palette[:3]]

    def _calculate_liquidity(self, velocity: str, total_trades: int) -> str:
        """Calculate liquidity rating"""
        if total_trades > 100 or velocity == "very_high":
            return "high"
        elif total_trades > 30 or velocity == "high":
            return "medium"
        else:
            return "low"

    def _get_collection_synergy(self, style: str) -> List[str]:
        """Get related collection categories"""
        synergy_map = {
            "cyberpunk": ["tech", "neon", "futuristic"],
            "fantasy": ["mythical", "ethereal", "cosmic"],
            "dark_fantasy": ["dark", "gothic", "ominous"],
            "tech": ["cyberpunk", "digital", "futuristic"],
            "cosmic": ["celestial", "ethereal", "fantasy"],
            "urban": ["neon", "street", "contemporary"],
            "nature": ["organic", "aquatic", "elemental"],
            "retro": ["pixel", "nostalgia", "vintage"]
        }

        return synergy_map.get(style, ["general"])

    def _calculate_overall_score(
        self,
        visual: Dict,
        behavioral: Dict,
        market: Dict
    ) -> float:
        """Calculate weighted overall DNA score"""
        # Visual score (40%)
        visual_score = visual["complexity_score"] / 10 * 0.4

        # Behavioral score (30%)
        behavioral_score = behavioral["activity_score"] * 0.3

        # Market score (30%)
        rarity_scores = {
            "common": 0.2, "rare": 0.5,
            "epic": 0.7, "legendary": 1.0
        }
        market_score = rarity_scores.get(market["rarity_tier"], 0.3) * 0.3

        return (visual_score + behavioral_score + market_score) * 10

    def _generate_personality_summary(
        self,
        visual: Dict,
        behavioral: Dict,
        market: Dict
    ) -> str:
        """Generate human-readable personality summary"""
        style = visual["style"].replace("_", " ").title()
        mood = visual["mood"].title()
        collector = behavioral["collector_type"]
        momentum = market["price_momentum"]

        return (
            f"{mood} {style} aesthetic with {behavioral['trading_velocity']} "
            f"trading activity. Appeals to {collector}s. "
            f"Currently {momentum} momentum."
        )

    def _identify_portfolio_gaps(self, primary_style: str) -> List[str]:
        """Identify missing categories in collection"""
        gaps = [
            "Missing vintage/retro cards",
            "Under-exposed to cosmic themes",
            "No legendary tier cards"
        ]

        if primary_style == "cyberpunk":
            gaps.append("Could diversify into nature themes")
        elif primary_style == "fantasy":
            gaps.append("Missing tech/futuristic balance")

        return gaps

    def _generate_collector_traits(self, style: str, hold_time: int) -> List[str]:
        """Generate collector personality traits"""
        traits = []

        style_traits = {
            "cyberpunk": "Drawn to futuristic aesthetics",
            "fantasy": "Appreciates storytelling & lore",
            "dark_fantasy": "Prefers dark, moody atmospheres",
            "cosmic": "Fascinated by space & mysticism",
            "tech": "Values innovation & complexity"
        }

        traits.append(style_traits.get(style, "Diverse tastes"))

        if hold_time > 100:
            traits.append("Long-term portfolio builder")
            traits.append("Patient accumulator")
        else:
            traits.append("Active market participant")
            traits.append("Opportunistic trader")

        return traits


# ===== TESTING =====
if __name__ == "__main__":
    # Load mock data
    data_path = Path(__file__).parent.parent / "data" / "mock_cards.json"
    with open(data_path, 'r') as f:
        cards = json.load(f)

    # Initialize analyzer
    analyzer = CardDNAAnalyzer(cards)

    # Test card DNA analysis
    print("=== Card DNA Analysis ===")
    dna = analyzer.calculate_card_dna("RNS001")
    print(json.dumps(dna, indent=2))

    # Test collector matching
    print("\n=== Collector Matching ===")
    preferences = {
        "preferred_styles": ["cyberpunk", "tech", "neon"],
        "max_price": 3.0,
        "trading_velocity": "medium"
    }
    matches = analyzer.match_cards_for_collector(preferences, limit=3)
    for card_id, name, score, reasons in matches:
        print(f"\n{name} ({card_id})")
        print(f"Match Score: {score}")
        print(f"Reasons: {', '.join(reasons)}")
