import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button, Avatar, Tag, PageHeader, Modal, Input, Select } from '@/components/ui';
import { User as UserIcon, Edit, Plus, X, Check, Award, Briefcase, Calendar, Target, Users, Bookmark } from 'lucide-react';
import { SKILL_CATALOG, INTEREST_CATALOG, ALL_BRANCHES } from '@/data/mockData';
import type { Student, Year } from '@/types';

export function ProfilePage() {
  const { currentUser, events, opportunities, registeredEvents, savedEvents, savedOpportunities, updateProfile } = useApp();
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editBranch, setEditBranch] = useState<Student['branch']>(currentUser?.branch || 'CSE');
  const [editYear, setEditYear] = useState<Year>(currentUser?.year || '2nd Year');
  const [editSkills, setEditSkills] = useState<string[]>(currentUser?.skills || []);
  const [editInterests, setEditInterests] = useState<string[]>(currentUser?.interests || []);
  const [editLookingFor, setEditLookingFor] = useState(currentUser?.lookingFor || '');
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  if (!currentUser) return null;

  const myEvents = events.filter((e) => registeredEvents.includes(e.id));
  const mySavedEvents = events.filter((e) => savedEvents.includes(e.id));
  const mySavedOpps = opportunities.filter((o) => savedOpportunities.includes(o.id));
  const myConnections = currentUser.connections.length;

  const handleSave = () => {
    updateProfile({
      name: editName,
      bio: editBio,
      branch: editBranch,
      year: editYear,
      skills: editSkills,
      interests: editInterests,
      lookingFor: editLookingFor,
    });
    setEditOpen(false);
  };

  const addSkill = (skill?: string) => {
    const s = skill || skillInput.trim();
    if (s && !editSkills.includes(s)) {
      setEditSkills([...editSkills, s]);
      setSkillInput('');
    }
  };

  const addInterest = (interest?: string) => {
    const i = interest || interestInput.trim();
    if (i && !editInterests.includes(i)) {
      setEditInterests([...editInterests, i]);
      setInterestInput('');
    }
  };

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Your student identity at GMU" icon={<UserIcon size={20} />} />

      {/* Profile Header */}
      <Card className="p-6 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <Avatar name={currentUser.name} color={currentUser.avatarColor} size="xl" />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
            <p className="text-sm text-slate-500">{currentUser.usn} · {currentUser.branch} · {currentUser.year}</p>
            <p className="text-sm text-slate-400 mt-0.5">{currentUser.email}</p>
          </div>
          <Button variant="outline" onClick={() => {
            setEditName(currentUser.name);
            setEditBio(currentUser.bio);
            setEditBranch(currentUser.branch);
            setEditYear(currentUser.year);
            setEditSkills(currentUser.skills);
            setEditInterests(currentUser.interests);
            setEditLookingFor(currentUser.lookingFor);
            setEditOpen(true);
          }} className="gap-2">
            <Edit size={16} /> Edit Profile
          </Button>
        </div>
        <p className="text-sm text-slate-600">{currentUser.bio}</p>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Card className="p-4">
          <Calendar size={18} className="text-amber-600 mb-1" />
          <p className="text-xl font-bold text-slate-900">{myEvents.length}</p>
          <p className="text-xs text-slate-500">Events Joined</p>
        </Card>
        <Card className="p-4">
          <Users size={18} className="text-blue-600 mb-1" />
          <p className="text-xl font-bold text-slate-900">{myConnections}</p>
          <p className="text-xs text-slate-500">Connections</p>
        </Card>
        <Card className="p-4">
          <Bookmark size={18} className="text-emerald-600 mb-1" />
          <p className="text-xl font-bold text-slate-900">{mySavedEvents.length + mySavedOpps.length}</p>
          <p className="text-xs text-slate-500">Saved</p>
        </Card>
        <Card className="p-4">
          <Target size={18} className="text-rose-600 mb-1" />
          <p className="text-xl font-bold text-slate-900">{currentUser.achievements.length}</p>
          <p className="text-xs text-slate-500">Achievements</p>
        </Card>
      </div>

      {/* Skills & Interests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-1.5">
            {currentUser.skills.map((s) => <Tag key={s} color="blue">{s}</Tag>)}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 mb-3">Interests</h3>
          <div className="flex flex-wrap gap-1.5">
            {currentUser.interests.map((i) => <Tag key={i} color="teal">{i}</Tag>)}
          </div>
        </Card>
      </div>

      {/* Looking For */}
      <Card className="p-5 mb-4 bg-blue-50/50 border-blue-100">
        <p className="text-sm font-semibold text-blue-700 mb-1">Looking For</p>
        <p className="text-sm text-slate-600">{currentUser.lookingFor}</p>
      </Card>

      {/* Projects */}
      <Card className="p-5 mb-4">
        <h3 className="font-semibold text-slate-900 mb-3">Projects</h3>
        {currentUser.projects.length === 0 ? (
          <p className="text-sm text-slate-500">No projects yet. Add some from your profile edit.</p>
        ) : (
          <div className="space-y-3">
            {currentUser.projects.map((p) => (
              <div key={p.title} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-sm font-medium text-slate-900">{p.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {p.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Experience & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase size={18} className="text-slate-400" />
            <h3 className="font-semibold text-slate-900">Experience</h3>
          </div>
          {currentUser.experience.length === 0 ? (
            <p className="text-sm text-slate-500">No experience added yet.</p>
          ) : (
            <ul className="space-y-2">
              {currentUser.experience.map((e, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" /> {e}
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Award size={18} className="text-amber-500" />
            <h3 className="font-semibold text-slate-900">Achievements</h3>
          </div>
          {currentUser.achievements.length === 0 ? (
            <p className="text-sm text-slate-500">No achievements yet.</p>
          ) : (
            <ul className="space-y-2">
              {currentUser.achievements.map((a, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" /> {a}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Events Joined */}
      <Card className="p-5 mb-4">
        <h3 className="font-semibold text-slate-900 mb-3">Events Joined</h3>
        {myEvents.length === 0 ? (
          <p className="text-sm text-slate-500">No events joined yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {myEvents.map((e) => (
              <div key={e.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-sm font-medium text-slate-900">{e.name}</p>
                <p className="text-xs text-slate-500">{e.date} · {e.location}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Saved Items */}
      {(mySavedEvents.length > 0 || mySavedOpps.length > 0) && (
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 mb-3">Saved Items</h3>
          <div className="space-y-2">
            {mySavedEvents.map((e) => (
              <div key={e.id} className="p-3 rounded-lg bg-amber-50/50 border border-amber-100">
                <p className="text-sm font-medium text-slate-900">{e.name}</p>
                <p className="text-xs text-slate-500">Event · {e.date}</p>
              </div>
            ))}
            {mySavedOpps.map((o) => (
              <div key={o.id} className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                <p className="text-sm font-medium text-slate-900">{o.title}</p>
                <p className="text-xs text-slate-500">{o.category} · Deadline: {o.deadline}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile" maxWidth="max-w-xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
            <Input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Branch</label>
              <Select value={editBranch} onChange={(e) => setEditBranch(e.target.value as Student['branch'])} className="w-full">
                {ALL_BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Year</label>
              <Select value={editYear} onChange={(e) => setEditYear(e.target.value as Year)} className="w-full">
                {(['1st Year', '2nd Year', '3rd Year', '4th Year'] as const).map((y) => <option key={y} value={y}>{y}</option>)}
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Skills</label>
            <Input type="text" placeholder="Add a skill..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {editSkills.map((s) => (
                <button key={s} onClick={() => setEditSkills(editSkills.filter((x) => x !== s))} className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100">
                  {s} <X size={10} className="inline" />
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {SKILL_CATALOG.filter((s) => !editSkills.includes(s)).slice(0, 8).map((s) => (
                <button key={s} onClick={() => addSkill(s)} className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 text-xs hover:bg-slate-100">
                  + {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Interests</label>
            <Input type="text" placeholder="Add an interest..." value={interestInput} onChange={(e) => setInterestInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addInterest(); } }} />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {editInterests.map((i) => (
                <button key={i} onClick={() => setEditInterests(editInterests.filter((x) => x !== i))} className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-medium hover:bg-teal-100">
                  {i} <X size={10} className="inline" />
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {INTEREST_CATALOG.filter((i) => !editInterests.includes(i)).slice(0, 8).map((i) => (
                <button key={i} onClick={() => addInterest(i)} className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 text-xs hover:bg-slate-100">
                  + {i}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Looking For</label>
            <Input type="text" value={editLookingFor} onChange={(e) => setEditLookingFor(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="gap-2"><Check size={16} /> Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
