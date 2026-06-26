# 🧬 Renaiss Card DNA

**AI-Powered Card Personality & Matching Engine**

> Built for Renaiss Tech Hackathon Season 1

Every card has a soul. Discover yours.

---

## 🎯 What is Card DNA?

Renaiss Card DNA is an AI-powered platform that analyzes collectible cards across three dimensions:

- **Visual DNA**: Color palettes, artistic style, complexity, and mood
- **Behavioral DNA**: Trading patterns, hold times, and collector archetypes  
- **Market DNA**: Volatility, rarity, price momentum, and collection synergy

Unlike traditional tools that only show raw stats, Card DNA reveals the **personality** of each card and matches collectors with cards that fit their vibe.

---

## ✨ Features

### 🔬 Card Analyzer
Analyze any card to see its complete DNA profile:
- Multi-dimensional personality scoring
- Visual style classification
- Trading behavior patterns
- Market momentum indicators

### 👤 Collector Profiler
Understand your collection's DNA:
- Primary style preferences
- Collector type classification
- Portfolio gap analysis
- Personality traits

### 🎯 Smart Matching
Get personalized card recommendations:
- Match score based on your collection DNA
- Reason-based recommendations
- Strength ratings (strong/moderate/weak)

---

## 🚀 Quick Start

### Prerequisites
- **Backend**: Python 3.9+
- **Frontend**: Node.js 18+

### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt --break-system-packages

# Run server
python main.py

# Server runs on http://localhost:8000
# API docs: http://localhost:8000/docs
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# App runs on http://localhost:3000
```

---

## 📊 API Endpoints

### Get All Cards
```http
GET /api/cards
```

### Analyze Card DNA
```http
GET /api/card/{card_id}/dna
```

**Response:**
```json
{
  "card_id": "RNS001",
  "card_name": "Cyber Samurai",
  "visual_dna": {
    "color_palette": ["#FF6B6B", "#4ECDC4"],
    "style": "cyberpunk",
    "complexity_score": 8.5,
    "mood": "intense"
  },
  "behavioral_dna": {
    "collector_type": "long-term investor",
    "trading_velocity": "medium",
    "activity_score": 0.72
  },
  "market_dna": {
    "rarity_tier": "legendary",
    "price_momentum": "bullish",
    "volatility": 0.23
  },
  "overall_score": 8.5,
  "personality_summary": "Intense Cyberpunk aesthetic..."
}
```

### Get Collector Profile
```http
GET /api/collector/{wallet}/profile
```

### Get Recommendations
```http
GET /api/match/{wallet}/recommendations?limit=5
```

---

## 🧠 How It Works

### Visual Analysis
- Extracts color palettes from card metadata
- Classifies artistic style (cyberpunk, fantasy, etc.)
- Calculates complexity based on visual traits

### Behavioral Clustering
- Analyzes trading patterns (hold time, velocity)
- Groups into collector archetypes
- Scores activity levels

### Matching Algorithm
```python
match_score = (
    0.4 * visual_similarity +
    0.3 * behavioral_fit +
    0.2 * market_alignment +
    0.1 * social_signals
)
```

---

## ⚠️ Important Disclaimers

### Data Sources
- **Cards**: Mock dataset (20 sample cards for demo purposes)
- **Transactions**: Synthetic trading history generated for prototype
- **Collector Profiles**: Deterministic generation based on wallet hash

### AI Predictions
- DNA scores are **illustrative** and for exploration only
- Not financial advice or investment recommendations
- Models are prototypes - not production-ready

### Privacy & Safety
- No real wallet data collected
- No blockchain queries performed
- All data is mock/synthetic for demo purposes

**⚠️ DO NOT use this tool for real trading decisions**

---

## 🏗️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **scikit-learn**: Machine learning (clustering, scaling)
- **Pydantic**: Data validation
- **NumPy/Pandas**: Data processing

### Frontend
- **Next.js 14**: React framework (App Router)
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client
- **Lucide Icons**: Icon library

### Design System
- Warm paper palette (#F6F1E8, #C8853F)
- DM Serif Display + Inter fonts
- Punchy, collector-focused aesthetic

---

## 📁 Project Structure

```
renaiss-card-dna/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── ai_engine.py         # Core DNA analysis logic
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Home page
│   │   ├── analyzer/        # Card analyzer
│   │   ├── profiler/        # Collector profiler
│   │   └── layout.tsx
│   ├── lib/
│   │   └── api.ts           # API client
│   └── package.json
└── data/
    └── mock_cards.json      # Sample card data
```

---

## 🎨 Design Philosophy

**"Build tools, not decks"** — This is a working demo, not a pitch presentation.

- **Usability First**: Clean, intuitive interfaces
- **Real Functionality**: All features work end-to-end
- **Safety-Conscious**: Clear disclaimers and data labeling
- **Ecosystem Relevant**: Built specifically for Renaiss collector economy

---

## 🔮 Future Enhancements

### Phase 1 (Post-Hackathon)
- [ ] Real blockchain integration (Renaiss Protocol)
- [ ] More sophisticated ML models (image embeddings via CLIP)
- [ ] Social discovery features (find similar collectors)
- [ ] Card comparison tool

### Phase 2 (Production)
- [ ] Historical price chart integration
- [ ] Portfolio tracking & alerts
- [ ] Community-driven tagging system
- [ ] Mobile app (React Native)

### Phase 3 (Advanced)
- [ ] Predictive analytics (price forecasting)
- [ ] Sentiment analysis from community discussions
- [ ] Automated trading suggestions
- [ ] DAO governance for model parameters

---

## 🤝 Contributing

This is a hackathon prototype. Feedback welcome!

**Areas for improvement:**
- More diverse card styles in training data
- Better clustering algorithms for collector types
- Enhanced visual complexity scoring
- Real-time data pipeline integration

---

## 📜 License

MIT License - Built for Renaiss Tech Hackathon S1

---

## 🏆 Hackathon Context

**Renaiss Tech Hackathon Season 1: AI, Game & Tool Sprint**

- **Track**: AI
- **Theme**: Tools for the taste-driven collector economy
- **Duration**: June 28 - July 11, 2026
- **Judging Criteria**:
  - ✅ Usability: Working demo with clear UX
  - ✅ Innovation: First personality-based matching for collectibles
  - ✅ Ecosystem Relevance: Built specifically for Renaiss
  - ✅ Clarity: Well-documented, easy to understand
  - ✅ Safety: Transparent data sources & AI disclaimers

---

## 👨‍💻 Author

Built with ❤️ by **TRAN DANG HOP**

**Contact:**
- X: [@bella_summerss](https://x.com/bella_summerss)
- Discord: tdh8386
- Email: trandanghop2006@gmail.com

---

## 🙏 Acknowledgments

- **Renaiss Team** for organizing the hackathon
- **Benjamin Tong (CTO)** for coaching sessions
- The collector economy community for inspiration

---

**Remember**: This is a prototype for exploration. Always do your own research before making any investment decisions.

🧬 *Every card has a soul. What's yours?*
