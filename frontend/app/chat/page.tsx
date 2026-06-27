'use client';

import { useState } from 'react';
import { sendChatMessage } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your Renaiss Card DNA Advisor. Ask me anything about cards, trading strategies, or your collection!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardId, setCardId] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await sendChatMessage(userMessage, cardId || undefined);
      setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error
        ? `Sorry, I encountered an error: ${error.message}. Please try again!`
        : 'Sorry, I encountered an error. Please check your connection and try again!';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1E8] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E2D9C8] p-4 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <a href="/" className="text-[#8A8A80] hover:text-[#1F2421] mb-2 inline-flex items-center text-sm">
                ← Back
              </a>
              <h1 className="text-2xl font-bold text-[#1F2421] font-serif">
                🤖 AI <span className="text-[#C8853F] italic">Advisor</span>
              </h1>
              <p className="text-sm text-[#8A8A80]">Powered by GPT-3.5</p>
            </div>
            <div className="text-right">
              <label className="text-xs text-[#8A8A80] block mb-1">Optional: Card ID</label>
              <input
                type="text"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                placeholder="e.g. RNS001"
                className="px-3 py-1 text-sm border border-[#E2D9C8] rounded bg-[#FBF7EF] w-32"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-[#FBF7EF] border-b border-[#E2D9C8] p-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm">
          <span>⚠️</span>
          <span className="text-[#8A8A80]">
            <strong className="text-[#C8853F]">Demo only:</strong> AI responses are illustrative - not financial advice.
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-[#C8853F] text-white'
                    : 'bg-white border border-[#E2D9C8] text-[#1F2421]'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="text-xs text-[#8A8A80] mb-1">🤖 AI Advisor</div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#E2D9C8] px-4 py-3 rounded-lg">
                <div className="text-xs text-[#8A8A80] mb-1">🤖 AI Advisor</div>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-[#8A8A80]">Thinking</p>
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-[#C8853F] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                    <span className="w-1 h-1 bg-[#C8853F] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                    <span className="w-1 h-1 bg-[#C8853F] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-[#E2D9C8] p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
              placeholder="Ask about cards, strategies, or your collection..."
              className="flex-1 px-4 py-3 border border-[#E2D9C8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8853F] bg-[#FBF7EF]"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-[#C8853F] text-white rounded-lg hover:bg-[#A86B2C] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Send
            </button>
          </div>
          <div className="mt-2 text-xs text-[#8A8A80]">
            💡 Try: "Tell me about RNS001" or "Should I buy legendary cards?"
          </div>
        </div>
      </div>
    </div>
  );
}
