import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button, Avatar, MatchScore, Tag, PageHeader } from '@/components/ui';
import { processAIQuery } from '@/lib/ai';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import type { ChatMessage, SearchResult } from '@/types';

const SUGGESTED_PROMPTS = [
  'What events are happening this week?',
  'Find AI hackathons',
  'Find scholarships for me',
  'Find students who know React',
  'What opportunities match my skills?',
  'What is happening in my branch?',
  'How do I register for Mallika?',
];

export function AssistantPage() {
  const { currentUser, students, events, opportunities } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content: `Hi ${currentUser?.name || 'there'}! I'm your AI Campus Assistant. I can help you find events, opportunities, teammates, scholarships, and more. What would you like to know?`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!currentUser) return null;

  const handleSend = (prompt?: string) => {
    const q = prompt || input;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: Date.now(),
    };

    const result = processAIQuery(q, currentUser, students, events, opportunities);

    const assistantMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: result.content,
      results: result.results,
      timestamp: Date.now() + 1,
    };

    setMessages([...messages, userMsg, assistantMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]">
      <PageHeader title="AI Campus Assistant" subtitle="Your intelligent guide to everything at GMU" icon={<Bot size={20} />} />

      <Card className="flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'assistant' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'
              }`}>
                {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className={`rounded-2xl px-4 py-2.5 ${
                  msg.role === 'assistant'
                    ? 'bg-slate-50 text-slate-700'
                    : 'bg-blue-600 text-white'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
                {msg.results && msg.results.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.results.map((r: SearchResult) => (
                      <div key={`${r.type}-${r.id}`} className="p-3 rounded-lg bg-white border border-slate-200">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{r.title}</p>
                            <p className="text-xs text-slate-500 truncate">{r.subtitle}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{r.meta}</p>
                          </div>
                          {r.matchScore && <MatchScore score={r.matchScore} size="sm" />}
                        </div>
                        <div className="flex gap-1.5 mt-2">
                          {r.type === 'event' && <Button size="sm" variant="outline">Register</Button>}
                          {r.type === 'opportunity' && <Button size="sm" variant="outline">Apply</Button>}
                          {r.type === 'student' && <Button size="sm" variant="outline">Connect</Button>}
                          <Button size="sm" variant="ghost">Save</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Prompts */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask anything about GMU..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
            <Button onClick={() => handleSend()} className="gap-2">
              <Send size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
