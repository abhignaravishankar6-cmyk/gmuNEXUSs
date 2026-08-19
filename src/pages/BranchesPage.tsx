import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button, Avatar, VerificationBadge, Tag, PageHeader, EmptyState } from '@/components/ui';
import { BRANCHES } from '@/data/mockData';
import { Building2, Users, Calendar, Megaphone, ArrowLeft, MessageSquare } from 'lucide-react';
import type { Branch } from '@/types';

export function BranchesPage() {
  const { currentUser, events, posts, students } = useApp();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [tab, setTab] = useState<'my-branch' | 'all-gmu'>('my-branch');

  if (!currentUser) return null;

  // Branch view
  if (selectedBranch) {
    const branchData = BRANCHES.find((b) => b.name === selectedBranch)!;
    const branchEvents = events.filter((e) => e.branch === selectedBranch || e.branch === 'All');
    const branchPosts = posts.filter((p) => p.branch === selectedBranch || p.branch === 'All');
    const branchStudents = students.filter((s) => s.branch === selectedBranch);

    return (
      <div>
        <button onClick={() => setSelectedBranch(null)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-4">
          <ArrowLeft size={16} /> Back to Branches
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
            {branchData.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{branchData.name}</h1>
            <p className="text-sm text-slate-500">{branchData.fullName}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 p-1 bg-slate-100 rounded-lg w-fit">
          <button
            onClick={() => setTab('my-branch')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'my-branch' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            My Branch
          </button>
          <button
            onClick={() => setTab('all-gmu')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'all-gmu' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            All GMU
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-4 text-center">
            <Users size={18} className="mx-auto text-blue-600 mb-1" />
            <p className="text-xl font-bold text-slate-900">{branchStudents.length}</p>
            <p className="text-xs text-slate-500">Students</p>
          </Card>
          <Card className="p-4 text-center">
            <Calendar size={18} className="mx-auto text-amber-600 mb-1" />
            <p className="text-xl font-bold text-slate-900">{branchEvents.length}</p>
            <p className="text-xs text-slate-500">Events</p>
          </Card>
          <Card className="p-4 text-center">
            <Megaphone size={18} className="mx-auto text-emerald-600 mb-1" />
            <p className="text-xl font-bold text-slate-900">{branchData.announcements.length}</p>
            <p className="text-xs text-slate-500">Announcements</p>
          </Card>
        </div>

        {/* Announcements */}
        <div className="mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">Announcements</h3>
          <div className="space-y-2">
            {branchData.announcements.map((ann) => (
              <Card key={ann.id} className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-semibold text-slate-900">{ann.title}</p>
                  <VerificationBadge type={ann.verification} />
                </div>
                <p className="text-sm text-slate-600">{ann.description}</p>
                <p className="text-xs text-slate-400 mt-1">{ann.date}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Events */}
        <div className="mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {branchEvents.map((e) => (
              <Card key={e.id} className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-semibold text-slate-900">{e.name}</p>
                  <VerificationBadge type={e.verification} />
                </div>
                <p className="text-xs text-slate-500 mb-1">{e.category} · {e.date}</p>
                <p className="text-xs text-slate-500">{e.location}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className="mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">Student Posts</h3>
          <div className="space-y-2">
            {branchPosts.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No posts yet.</p>
            ) : (
              branchPosts.map((p) => (
                <Card key={p.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar name={p.authorName} color="bg-slate-500" size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-slate-900">{p.authorName}</p>
                        <span className="text-xs text-slate-400">{p.authorBranch}</span>
                        <VerificationBadge type={p.verification} />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{p.title}</p>
                      <p className="text-sm text-slate-600 mt-0.5">{p.content}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.tags.map((t) => <Tag key={t} color="blue">#{t}</Tag>)}
                      </div>
                      {p.lookingFor && (
                        <div className="mt-2 p-2 rounded-lg bg-blue-50 border border-blue-100">
                          <p className="text-xs font-medium text-blue-700">Looking for: {p.lookingFor}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Students */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Students in {selectedBranch}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {branchStudents.map((s) => (
              <Card key={s.usn} className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar name={s.name} color={s.avatarColor} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.year}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {s.skills.slice(0, 3).map((sk) => <Tag key={sk} color="blue">{sk}</Tag>)}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Branch list view
  return (
    <div>
      <PageHeader title="Branch Connect" subtitle="Explore ecosystems across all GMU branches" icon={<Building2 size={20} />} />

      {/* Inter-Branch Collaboration Banner */}
      <Card className="p-5 mb-6 bg-gradient-to-br from-blue-50 to-teal-50 border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare size={18} className="text-blue-600" />
          <h3 className="font-semibold text-slate-900">Inter-Branch Collaboration</h3>
        </div>
        <p className="text-sm text-slate-600 mb-3">
          GMU Nexus connects students across branches. Post a collaboration request and AI will find students from other branches with the skills you need.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          {['CSE → ECE', 'ECE → Mechanical', 'Mechanical → CSE', 'Commerce → CSE', 'All → All GMU'].map((flow) => (
            <span key={flow} className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 font-medium">
              {flow}
            </span>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BRANCHES.map((branch) => {
          const branchStudents = students.filter((s) => s.branch === branch.name);
          const isMyBranch = currentUser.branch === branch.name;
          return (
            <Card
              key={branch.name}
              className={`p-5 cursor-pointer hover:border-blue-300 transition-colors ${isMyBranch ? 'border-blue-300 bg-blue-50/30' : ''}`}
              onClick={() => setSelectedBranch(branch.name)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl">
                  {branch.icon}
                </div>
                {isMyBranch && <Tag color="blue">Your Branch</Tag>}
              </div>
              <h3 className="font-bold text-slate-900">{branch.name}</h3>
              <p className="text-xs text-slate-500 mb-3">{branch.fullName}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Users size={12} /> {branchStudents.length} students</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> {branch.events.length} events</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
