import { useApp } from '@/context/AppContext';
import { Card, PageHeader, ProgressBar } from '@/components/ui';
import { BRANCHES } from '@/data/mockData';
import { Users, Calendar, Target, Building2, Link2, TrendingUp, Award } from 'lucide-react';

export function AdminPage() {
  const { students, events, opportunities, posts } = useApp();

  const totalStudents = 5240;
  const activeEvents = events.length;
  const totalOpportunities = opportunities.length;
  const totalBranches = BRANCHES.length;
  const totalConnections = students.reduce((sum, s) => sum + s.connections.length, 0);

  // Popular skills
  const skillCount: Record<string, number> = {};
  students.forEach((s) => s.skills.forEach((sk) => { skillCount[sk] = (skillCount[sk] || 0) + 1; }));
  const popularSkills = Object.entries(skillCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxSkillCount = popularSkills[0]?.[1] || 1;

  // Connections by branch
  const connectionsByBranch: Record<string, number> = {};
  students.forEach((s) => {
    s.connections.forEach((usn) => {
      const conn = students.find((x) => x.usn === usn);
      if (conn) {
        const key = `${s.branch} → ${conn.branch}`;
        connectionsByBranch[key] = (connectionsByBranch[key] || 0) + 1;
      }
    });
  });
  const topConnections = Object.entries(connectionsByBranch).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Popular events (by registration)
  const popularEvents = [...events].sort((a, b) => b.registered - a.registered).slice(0, 5);

  return (
    <div>
      <PageHeader title="University Admin Dashboard" subtitle="Overview of GMU Nexus ecosystem" icon={<TrendingUp size={20} />} />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total Students', value: totalStudents.toLocaleString(), icon: <Users size={18} />, color: 'blue' },
          { label: 'Active Events', value: activeEvents, icon: <Calendar size={18} />, color: 'amber' },
          { label: 'Opportunities', value: totalOpportunities, icon: <Target size={18} />, color: 'emerald' },
          { label: 'Branches', value: totalBranches, icon: <Building2 size={18} />, color: 'purple' },
          { label: 'Connections', value: totalConnections, icon: <Link2 size={18} />, color: 'rose' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Popular Skills */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Popular Skills</h3>
          <div className="space-y-3">
            {popularSkills.map(([skill, count]) => (
              <div key={skill}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{skill}</span>
                  <span className="text-slate-400">{count} students</span>
                </div>
                <ProgressBar value={count} max={maxSkillCount} />
              </div>
            ))}
          </div>
        </Card>

        {/* Connections by Branch */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Inter-Branch Connections</h3>
          <div className="space-y-3">
            {topConnections.length > 0 ? topConnections.map(([pair, count]) => (
              <div key={pair}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{pair}</span>
                  <span className="text-slate-400">{count} connections</span>
                </div>
                <ProgressBar value={count} max={topConnections[0][1]} />
              </div>
            )) : (
              <p className="text-sm text-slate-500">No inter-branch connections yet.</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Popular Events */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Popular Events</h3>
          <div className="space-y-3">
            {popularEvents.map((e) => (
              <div key={e.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">{e.name}</p>
                  <p className="text-xs text-slate-500">{e.category} · {e.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{e.registered}/{e.capacity}</p>
                  <p className="text-xs text-slate-400">{Math.round((e.registered / e.capacity) * 100)}% full</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Posts */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Recent Student Posts</h3>
          <div className="space-y-3">
            {posts.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{p.title}</p>
                  <p className="text-xs text-slate-500">By {p.authorName} · {p.authorBranch}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Branch Overview */}
      <Card className="p-5 mt-4">
        <h3 className="font-semibold text-slate-900 mb-4">Branch Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BRANCHES.map((b) => {
            const branchStudents = students.filter((s) => s.branch === b.name);
            return (
              <div key={b.name} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{b.icon}</span>
                  <span className="text-sm font-semibold text-slate-900">{b.name}</span>
                </div>
                <p className="text-xs text-slate-500">{branchStudents.length} active students</p>
                <p className="text-xs text-slate-400">{b.memberCount.toLocaleString()} total</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
