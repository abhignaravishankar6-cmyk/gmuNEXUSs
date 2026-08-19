import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button, Avatar, MatchScore, VerificationBadge, Tag, PageHeader, EmptyState, Select } from '@/components/ui';
import { searchAll } from '@/lib/ai';
import { Search, Users, Calendar, Target, MessageSquare, Filter } from 'lucide-react';
import type { SearchResult } from '@/types';

const TYPE_LABELS: Record<SearchResult['type'], { label: string; icon: React.ReactNode; color: string }> = {
  student: { label: 'Students', icon: <Users size={16} />, color: 'blue' },
  event: { label: 'Events', icon: <Calendar size={16} />, color: 'amber' },
  opportunity: { label: 'Opportunities', icon: <Target size={16} />, color: 'emerald' },
  post: { label: 'Posts', icon: <MessageSquare size={16} />, color: 'purple' },
};

export function DiscoverPage() {
  const { currentUser, students, events, opportunities, posts } = useApp();
  const [query, setQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const results = useMemo(() => {
    if (!currentUser) return [];
    let r = searchAll(query, currentUser, students, events, opportunities, posts);
    if (typeFilter !== 'all') r = r.filter((x) => x.type === typeFilter);
    return r;
  }, [query, currentUser, students, events, opportunities, posts, typeFilter]);

  const grouped = useMemo(() => {
    const g: Record<string, SearchResult[]> = {};
    results.forEach((r) => {
      if (!g[r.type]) g[r.type] = [];
      g[r.type].push(r);
    });
    return g;
  }, [results]);

  if (!currentUser) return null;

  const handleResultClick = (r: SearchResult) => {
    // Navigation could be added here
  };

  return (
    <div>
      <PageHeader title="Discover" subtitle="Search across students, events, opportunities, and posts at GMU" icon={<Search size={20} />} />

      <Card className="p-4 mb-4">
        <div className="relative mb-3">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search for students, events, opportunities, skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="student">Students</option>
            <option value="event">Events</option>
            <option value="opportunity">Opportunities</option>
            <option value="post">Posts</option>
          </Select>
          <Select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
            <option value="all">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
            <option value="Commerce">Commerce</option>
            <option value="Management">Management</option>
            <option value="Architecture">Architecture</option>
            <option value="Biotechnology">Biotechnology</option>
          </Select>
        </div>
      </Card>

      {!query.trim() && (
        <EmptyState
          icon={<Search size={28} />}
          title="Start searching"
          description="Try searching for 'AI', 'React', 'hackathon', 'scholarship', or any student name."
        />
      )}

      {query.trim() && results.length === 0 && (
        <EmptyState
          icon={<Search size={28} />}
          title="No results found"
          description={`No matches for "${query}". Try a different search term.`}
        />
      )}

      {Object.entries(grouped).map(([type, items]) => {
        const info = TYPE_LABELS[type as SearchResult['type']];
        return (
          <div key={type} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-${info.color}-600`}>{info.icon}</span>
              <h3 className="font-semibold text-slate-900">{info.label}</h3>
              <span className="text-sm text-slate-400">({items.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((r) => (
                <Card key={`${r.type}-${r.id}`} className="p-4" onClick={() => handleResultClick(r)}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">{r.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{r.subtitle}</p>
                      <p className="text-xs text-slate-400 mt-1 truncate">{r.meta}</p>
                    </div>
                    {r.matchScore && <MatchScore score={r.matchScore} size="sm" />}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
