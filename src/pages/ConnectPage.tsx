import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button, Avatar, MatchScore, Tag, PageHeader, Select, Modal, EmptyState } from '@/components/ui';
import { getRecommendedStudents, buildTeam } from '@/lib/ai';
import { Users, Bot, Sparkles, UserPlus, Check, Search, Plus, X } from 'lucide-react';
import type { Student, TeamMatchResult } from '@/types';

export function ConnectPage() {
  const { currentUser, students, pendingConnections, connectWithStudent } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [teamBuilderOpen, setTeamBuilderOpen] = useState(false);
  const [teamRequest, setTeamRequest] = useState('');
  const [teamResult, setTeamResult] = useState<TeamMatchResult | null>(null);

  const recommended = useMemo(() => {
    if (!currentUser) return [];
    return getRecommendedStudents(currentUser, students);
  }, [currentUser, students]);

  const filteredStudents = useMemo(() => {
    if (!currentUser) return [];
    let list = students.filter((s) => s.usn !== currentUser.usn);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.skills.some((sk) => sk.toLowerCase().includes(q)) ||
        s.interests.some((i) => i.toLowerCase().includes(q)) ||
        s.branch.toLowerCase().includes(q)
      );
    }
    if (branchFilter !== 'all') list = list.filter((s) => s.branch === branchFilter);
    if (skillFilter !== 'all') list = list.filter((s) => s.skills.some((sk) => sk.toLowerCase().includes(skillFilter.toLowerCase())));
    return list;
  }, [students, currentUser, searchQuery, branchFilter, skillFilter]);

  if (!currentUser) return null;

  const handleBuildTeam = () => {
    if (!teamRequest.trim() || !currentUser) return;
    const result = buildTeam(teamRequest, currentUser, students);
    setTeamResult(result);
  };

  const allSkills = Array.from(new Set(students.flatMap((s) => s.skills))).sort();

  return (
    <div>
      <PageHeader title="Connect with GMU" subtitle="Find the right people. Build something together." icon={<Users size={20} />} />

      {/* AI Team Builder */}
      <Card className="p-5 mb-6 border-blue-200 bg-gradient-to-br from-white to-blue-50/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <Bot size={18} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">AI Team Builder</h2>
        </div>
        <p className="text-sm text-slate-500 mb-3">Describe what you need and AI will find the best teammates for you.</p>
        <textarea
          placeholder="e.g. I want to participate in an AI hackathon. I know Python and need a frontend developer, UI/UX designer and presenter."
          value={teamRequest}
          onChange={(e) => setTeamRequest(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none mb-3"
        />
        <Button onClick={() => { setTeamBuilderOpen(true); handleBuildTeam(); }} disabled={!teamRequest.trim()} className="gap-2">
          <Sparkles size={16} /> Build My Team
        </Button>
      </Card>

      {/* Search & Filters */}
      <Card className="p-4 mb-4">
        <div className="relative mb-3">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, skill, or interest..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
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
          <Select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
            <option value="all">All Skills</option>
            {allSkills.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
      </Card>

      {/* AI Recommended */}
      {!searchQuery && branchFilter === 'all' && skillFilter === 'all' && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-blue-600" />
            <h3 className="font-semibold text-slate-900">AI Recommended for You</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recommended.map(({ student, match }) => (
              <StudentCard
                key={student.usn}
                student={student}
                match={match}
                isPending={pendingConnections.includes(student.usn)}
                isConnected={currentUser.connections.includes(student.usn)}
                onConnect={() => connectWithStudent(student.usn)}
                onView={() => setSelectedStudent(student)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Students */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-3">
          {searchQuery || branchFilter !== 'all' || skillFilter !== 'all' ? `Results (${filteredStudents.length})` : 'All Students'}
        </h3>
        {filteredStudents.length === 0 ? (
          <EmptyState icon={<Users size={28} />} title="No students found" description="Try adjusting your search or filters." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStudents.map((student) => {
              const match = recommended.find((r) => r.student.usn === student.usn)?.match || 0;
              return (
                <StudentCard
                  key={student.usn}
                  student={student}
                  match={match}
                  isPending={pendingConnections.includes(student.usn)}
                  isConnected={currentUser.connections.includes(student.usn)}
                  onConnect={() => connectWithStudent(student.usn)}
                  onView={() => setSelectedStudent(student)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <Modal open={!!selectedStudent} onClose={() => setSelectedStudent(null)} title="Student Profile" maxWidth="max-w-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={selectedStudent.name} color={selectedStudent.avatarColor} size="xl" />
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedStudent.name}</h3>
                <p className="text-sm text-slate-500">{selectedStudent.branch} · {selectedStudent.year}</p>
                <p className="text-xs text-slate-400 mt-0.5">{selectedStudent.usn}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600">{selectedStudent.bio}</p>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1.5">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudent.skills.map((s) => <Tag key={s} color="blue">{s}</Tag>)}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1.5">Interests</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudent.interests.map((i) => <Tag key={i} color="teal">{i}</Tag>)}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1.5">Projects</p>
              <div className="space-y-2">
                {selectedStudent.projects.map((p) => (
                  <div key={p.title} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-sm font-medium text-slate-900">{p.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {p.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1.5">Achievements</p>
              <ul className="space-y-1">
                {selectedStudent.achievements.map((a) => (
                  <li key={a} className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-sm font-medium text-blue-700">Looking For</p>
              <p className="text-sm text-slate-600 mt-0.5">{selectedStudent.lookingFor}</p>
            </div>
            <div className="flex gap-2 pt-2">
              {currentUser.connections.includes(selectedStudent.usn) ? (
                <Button variant="secondary" disabled className="w-full gap-2"><Check size={16} /> Already Connected</Button>
              ) : pendingConnections.includes(selectedStudent.usn) ? (
                <Button variant="secondary" disabled className="w-full gap-2"><Check size={16} /> Request Sent</Button>
              ) : (
                <Button onClick={() => { connectWithStudent(selectedStudent.usn); }} className="w-full gap-2">
                  <UserPlus size={16} /> Send Connection Request
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Team Builder Modal */}
      <Modal open={teamBuilderOpen} onClose={() => setTeamBuilderOpen(false)} title="AI Team Builder" maxWidth="max-w-2xl">
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
            <Bot size={18} className="text-blue-600" />
            <p className="text-sm text-slate-700">AI analyzed your request and found the best teammates based on skills, interests, and branch diversity.</p>
          </div>

          {teamResult && (
            <>
              {/* Current User */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <Avatar name={currentUser.name} color={currentUser.avatarColor} size="md" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{currentUser.name} (You)</p>
                  <p className="text-xs text-slate-500">{currentUser.skills.slice(0, 3).join(' · ')}</p>
                </div>
              </div>

              {teamResult.members.map((m) => (
                <div key={m.student.usn} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200">
                  <Avatar name={m.student.name} color={m.student.avatarColor} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{m.student.name}</p>
                      <Tag color="blue">{m.role}</Tag>
                    </div>
                    <p className="text-xs text-slate-500">{m.reason}</p>
                    <p className="text-xs text-slate-400">{m.student.branch} · {m.student.year}</p>
                  </div>
                  <MatchScore score={m.matchScore} size="sm" />
                </div>
              ))}

              {/* Compatibility */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-slate-900">Team Compatibility</p>
                  <span className="text-2xl font-bold text-blue-600">{teamResult.compatibility}%</span>
                </div>
                <div className="space-y-1">
                  {teamResult.explanation.map((e, i) => (
                    <p key={i} className="text-sm text-slate-600">{e}</p>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2"><Plus size={16} /> Create Team</Button>
                <Button variant="outline" className="flex-1 gap-2"><UserPlus size={16} /> Send Connection Requests</Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

function StudentCard({
  student, match, isPending, isConnected, onConnect, onView,
}: {
  student: Student;
  match: number;
  isPending: boolean;
  isConnected: boolean;
  onConnect: () => void;
  onView: () => void;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3 mb-3">
        <Avatar name={student.name} color={student.avatarColor} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{student.name}</p>
          <p className="text-xs text-slate-500">{student.branch} · {student.year}</p>
        </div>
        {match > 0 && <MatchScore score={match} size="sm" />}
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {student.skills.slice(0, 3).map((s) => <Tag key={s} color="blue">{s}</Tag>)}
        {student.skills.length > 3 && <Tag>+{student.skills.length - 3}</Tag>}
      </div>
      <p className="text-xs text-slate-500 mb-3 line-clamp-1">Looking for: {student.lookingFor}</p>
      <div className="flex gap-2">
        {isConnected ? (
          <Button size="sm" variant="secondary" disabled className="flex-1 gap-1"><Check size={14} /> Connected</Button>
        ) : isPending ? (
          <Button size="sm" variant="secondary" disabled className="flex-1 gap-1"><Check size={14} /> Request Sent</Button>
        ) : (
          <Button size="sm" onClick={onConnect} className="flex-1 gap-1"><UserPlus size={14} /> Connect</Button>
        )}
        <Button size="sm" variant="outline" onClick={onView}>View</Button>
      </div>
    </Card>
  );
}
