import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button, Avatar, MatchScore, VerificationBadge, Tag, ProgressBar } from '@/components/ui';
import { getRecommendedEvents, getRecommendedOpportunities, getRecommendedStudents, processAIQuery } from '@/lib/ai';
import { Bot, Send, Sparkles, ArrowRight, Calendar, Target, Users, Bookmark, Check, MapPin, Clock } from 'lucide-react';
import type { PageId } from '@/components/Layout';
import type { SearchResult } from '@/types';

const QUICK_PROMPTS = [
  'What events are happening this week?',
  'Find AI hackathons',
  'Find students who know React',
  'Show scholarships',
  'Find opportunities matching my skills',
  'What is happening in my branch?',
];

export function HomePage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  const { currentUser, students, events, opportunities, registeredEvents, saveEvent, registerForEvent, savedEvents } = useApp();
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState<{ content: string; results?: SearchResult[] } | null>(null);

  if (!currentUser) return null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const recommendedEvents = getRecommendedEvents(currentUser, events);
  const recommendedOpps = getRecommendedOpportunities(currentUser, opportunities);
  const recommendedStudents = getRecommendedStudents(currentUser, students);

  const handleAsk = (prompt?: string) => {
    const q = prompt || aiInput;
    if (!q.trim()) return;
    const result = processAIQuery(q, currentUser, students, events, opportunities);
    setAiResponse(result);
    setAiInput('');
  };

  return (
    <div className="space-y-6">
      {/* Hero Greeting */}
      <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {greeting}, {currentUser.name} 👋
        </h1>
        <p className="text-blue-50 text-sm md:text-base">Everything happening across GMU, in one place.</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur-sm text-sm">
            <span className="font-semibold">{currentUser.branch}</span> · {currentUser.year}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur-sm text-sm">
            <span className="font-semibold">{currentUser.skills.length}</span> skills
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur-sm text-sm">
            <span className="font-semibold">{currentUser.connections.length}</span> connections
          </div>
        </div>
      </div>

      {/* AI Quick Assistant */}
      <Card className="p-5 md:p-6 border-blue-200 bg-gradient-to-br from-white to-blue-50/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <Bot size={18} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">AI Quick Assistant</h2>
        </div>
        <p className="text-sm text-slate-500 mb-4">What are you looking for today?</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask anything about GMU..."
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAsk(); }}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
          <Button onClick={() => handleAsk()} className="gap-2">
            <Send size={16} /> Ask
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => handleAsk(p)}
              className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
        {aiResponse && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="flex items-start gap-2 mb-3">
              <Sparkles size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-700">{aiResponse.content}</p>
            </div>
            {aiResponse.results && aiResponse.results.length > 0 && (
              <div className="space-y-2 mt-3">
                {aiResponse.results.slice(0, 4).map((r) => (
                  <div key={`${r.type}-${r.id}`} className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-100">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">{r.title}</p>
                      <p className="text-xs text-slate-500 truncate">{r.meta}</p>
                    </div>
                    {r.matchScore && <MatchScore score={r.matchScore} size="sm" />}
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={() => onNavigate('assistant')} className="gap-1">
                  See full results <ArrowRight size={14} />
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Recommended For You */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900">Recommended for You</h2>
          <button onClick={() => onNavigate('opportunities')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendedOpps.slice(0, 4).map(({ opportunity, match }) => (
            <Card key={opportunity.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Target size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{opportunity.title}</p>
                    <p className="text-xs text-slate-500">{opportunity.provider}</p>
                  </div>
                </div>
                <MatchScore score={match} size="sm" />
              </div>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">{opportunity.description}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock size={12} /> Deadline: {opportunity.deadline}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Today at GMU */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900">Today at GMU</h2>
          <button onClick={() => onNavigate('events')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            All events →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendedEvents.slice(0, 4).map((event) => {
            const isRegistered = registeredEvents.includes(event.id);
            const isSaved = savedEvents.includes(event.id);
            return (
              <Card key={event.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{event.name}</p>
                      <p className="text-xs text-slate-500">{event.category}</p>
                    </div>
                  </div>
                  <VerificationBadge type={event.verification} />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                </div>
                <div className="flex gap-2">
                  {isRegistered ? (
                    <Button size="sm" variant="secondary" disabled className="gap-1">
                      <Check size={14} /> Registered
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => registerForEvent(event.id)}>Register</Button>
                  )}
                  <Button size="sm" variant={isSaved ? 'primary' : 'outline'} onClick={() => saveEvent(event.id)} className="gap-1">
                    <Bookmark size={14} /> {isSaved ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Student Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900">Students You Should Meet</h2>
          <button onClick={() => onNavigate('connect')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recommendedStudents.slice(0, 3).map(({ student, match }) => (
            <Card key={student.usn} className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <Avatar name={student.name} color={student.avatarColor} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{student.name}</p>
                  <p className="text-xs text-slate-500">{student.branch} · {student.year}</p>
                </div>
                <MatchScore score={match} size="sm" />
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {student.skills.slice(0, 3).map((s) => (
                  <Tag key={s} color="blue">{s}</Tag>
                ))}
              </div>
              <p className="text-xs text-slate-500 mb-3 line-clamp-1">Looking for: {student.lookingFor}</p>
              <Button size="sm" variant="outline" onClick={() => onNavigate('connect')} className="w-full">
                View Profile
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Events Joined', value: registeredEvents.length, icon: <Calendar size={18} />, color: 'amber' },
          { label: 'Connections', value: currentUser.connections.length, icon: <Users size={18} />, color: 'blue' },
          { label: 'Saved Events', value: savedEvents.length, icon: <Bookmark size={18} />, color: 'emerald' },
          { label: 'Opportunities', value: recommendedOpps.length, icon: <Target size={18} />, color: 'rose' },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <div className={`w-9 h-9 rounded-lg bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center mb-2`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
