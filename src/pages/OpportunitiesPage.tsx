import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button, MatchScore, PageHeader, EmptyState, Modal, Tag } from '@/components/ui';
import { getRecommendedOpportunities, calculateOpportunityMatch } from '@/lib/ai';
import { Target, Clock, Bookmark, Check, FileText, Award, Briefcase, Rocket, BookOpen, Code } from 'lucide-react';
import type { Opportunity, OpportunityCategory } from '@/types';

const CATEGORIES: (OpportunityCategory | 'All')[] = [
  'All', 'Internship', 'Scholarship', 'Hackathon', 'Competition', 'Research', 'Workshop', 'Startup', 'Certification',
];

const CATEGORY_ICONS: Record<OpportunityCategory, React.ReactNode> = {
  Internship: <Briefcase size={18} />,
  Scholarship: <Award size={18} />,
  Hackathon: <Code size={18} />,
  Competition: <Target size={18} />,
  Research: <BookOpen size={18} />,
  Workshop: <BookOpen size={18} />,
  Startup: <Rocket size={18} />,
  Certification: <Award size={18} />,
};

export function OpportunitiesPage() {
  const { currentUser, opportunities, savedOpportunities, saveOpportunity } = useApp();
  const [category, setCategory] = useState<OpportunityCategory | 'All'>('All');
  const [selected, setSelected] = useState<Opportunity | null>(null);

  const recommended = useMemo(() => {
    if (!currentUser) return [];
    return getRecommendedOpportunities(currentUser, opportunities);
  }, [currentUser, opportunities]);

  const filtered = useMemo(() => {
    if (category === 'All') return opportunities;
    return opportunities.filter((o) => o.category === category);
  }, [opportunities, category]);

  if (!currentUser) return null;

  return (
    <div>
      <PageHeader title="Opportunity Hunter" subtitle="Internships, scholarships, hackathons, and more — matched to your profile" icon={<Target size={20} />} />

      {/* AI Recommended */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold text-slate-900">Recommended for You</span>
          <span className="text-xs text-slate-400">Based on your skills & interests</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recommended.slice(0, 3).map(({ opportunity, match }) => (
            <OppCard
              key={opportunity.id}
              opp={opportunity}
              match={match}
              isSaved={savedOpportunities.includes(opportunity.id)}
              onSave={() => saveOpportunity(opportunity.id)}
              onView={() => setSelected(opportunity)}
            />
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
            }`}
          >
            {cat === 'All' ? 'All Opportunities' : cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Target size={28} />} title="No opportunities found" description="No opportunities in this category." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((opp) => (
            <OppCard
              key={opp.id}
              opp={opp}
              match={calculateOpportunityMatch(currentUser, opp)}
              isSaved={savedOpportunities.includes(opp.id)}
              onSave={() => saveOpportunity(opp.id)}
              onView={() => setSelected(opp)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title={selected.title} maxWidth="max-w-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                {CATEGORY_ICONS[selected.category]}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{selected.provider}</p>
                <p className="text-xs text-slate-500">{selected.category}</p>
              </div>
              <div className="ml-auto">
                <MatchScore score={calculateOpportunityMatch(currentUser, selected)} size="md" />
              </div>
            </div>
            <p className="text-sm text-slate-600">{selected.description}</p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs text-slate-400 mb-0.5">Deadline</p>
                <p className="font-medium text-slate-900 flex items-center gap-1.5"><Clock size={14} /> {selected.deadline}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs text-slate-400 mb-0.5">Eligibility</p>
                <p className="font-medium text-slate-900">{selected.eligibility}</p>
              </div>
            </div>

            {selected.requiredSkills.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-1.5">Required Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.requiredSkills.map((s) => {
                    const has = currentUser.skills.some((us) => us.toLowerCase().includes(s.toLowerCase()));
                    return <Tag key={s} color={has ? 'emerald' : 'amber'}>{has ? '✓' : '⚠'} {s}</Tag>;
                  })}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1.5">Required Documents</p>
              <div className="space-y-1">
                {selected.documents.map((d) => (
                  <p key={d} className="text-sm text-slate-600 flex items-center gap-2">
                    <FileText size={14} className="text-slate-400" /> {d}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button className="flex-1">Apply Now</Button>
              <Button variant="outline" className="gap-2"><Clock size={16} /> Remind Me</Button>
              <Button
                variant={savedOpportunities.includes(selected.id) ? 'primary' : 'outline'}
                onClick={() => saveOpportunity(selected.id)}
                className="gap-2"
              >
                <Bookmark size={16} /> {savedOpportunities.includes(selected.id) ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function OppCard({
  opp, match, isSaved, onSave, onView,
}: {
  opp: Opportunity;
  match: number;
  isSaved: boolean;
  onSave: () => void;
  onView: () => void;
}) {
  return (
    <Card className="p-4 flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            {CATEGORY_ICONS[opp.category]}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{opp.title}</p>
            <p className="text-xs text-slate-500">{opp.provider}</p>
          </div>
        </div>
      </div>
      {match >= 50 && <div className="mb-2"><MatchScore score={match} size="sm" /></div>}
      <p className="text-sm text-slate-600 mb-3 line-clamp-2 flex-1">{opp.description}</p>
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
        <Clock size={12} /> Deadline: {opp.deadline}
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={onView} className="flex-1">View Details</Button>
        <Button size="sm" variant={isSaved ? 'primary' : 'outline'} onClick={onSave} className="gap-1">
          <Bookmark size={14} />
        </Button>
      </div>
    </Card>
  );
}
