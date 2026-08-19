import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button, Input, Select, PageHeader, VerificationBadge, Tag } from '@/components/ui';
import { categorizePost } from '@/lib/ai';
import { Plus, Megaphone, Calendar, Sparkles, Check } from 'lucide-react';
import type { EventCategory, Branch } from '@/types';
import { ALL_BRANCHES } from '@/data/mockData';

const EVENT_CATEGORIES: EventCategory[] = [
  'Cultural', 'Technical', 'Competition', 'Sports', 'Music', 'Dance', 'Workshop', 'Hackathon', 'Academic',
];

export function OrganizerPage() {
  const { currentUser, addNotification } = useApp();
  const [mode, setMode] = useState<'event' | 'announcement'>('event');

  // Event form
  const [evtName, setEvtName] = useState('');
  const [evtCategory, setEvtCategory] = useState<EventCategory>('Technical');
  const [evtBranch, setEvtBranch] = useState<Branch | 'All'>('All');
  const [evtDate, setEvtDate] = useState('');
  const [evtTime, setEvtTime] = useState('');
  const [evtLocation, setEvtLocation] = useState('');
  const [evtDesc, setEvtDesc] = useState('');
  const [evtLink, setEvtLink] = useState('');
  const [evtCreated, setEvtCreated] = useState(false);

  // Announcement form
  const [annTitle, setAnnTitle] = useState('');
  const [annDesc, setAnnDesc] = useState('');
  const [annBranch, setAnnBranch] = useState<Branch | 'All'>('All');
  const [annCategory, setAnnCategory] = useState('General');
  const [annDate, setAnnDate] = useState('');
  const [annCreated, setAnnCreated] = useState(false);

  if (!currentUser) return null;

  const handleCreateEvent = () => {
    if (!evtName.trim() || !evtDate.trim()) return;
    setEvtCreated(true);
    addNotification({
      type: 'event',
      title: `Event created: ${evtName}`,
      description: `Your event "${evtName}" has been created with Branch Verified status.`,
    });
    setTimeout(() => {
      setEvtCreated(false);
      setEvtName(''); setEvtDate(''); setEvtTime(''); setEvtLocation(''); setEvtDesc(''); setEvtLink('');
    }, 3000);
  };

  const handleCreateAnnouncement = () => {
    if (!annTitle.trim()) return;
    setAnnCreated(true);
    addNotification({
      type: 'branch',
      title: `Announcement posted: ${annTitle}`,
      description: `Your announcement "${annTitle}" has been posted with Branch Verified status.`,
    });
    setTimeout(() => {
      setAnnCreated(false);
      setAnnTitle(''); setAnnDesc(''); setAnnDate('');
    }, 3000);
  };

  // AI categorization for announcement
  const aiCats = annDesc.trim() ? categorizePost(annDesc) : null;

  return (
    <div>
      <PageHeader title="Organizer Mode" subtitle="Create events and announcements for your branch" icon={<Plus size={20} />} />

      {/* Mode Toggle */}
      <div className="flex gap-1 mb-4 p-1 bg-slate-100 rounded-lg w-fit">
        <button
          onClick={() => setMode('event')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'event' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          <Calendar size={14} className="inline mr-1" /> Create Event
        </button>
        <button
          onClick={() => setMode('announcement')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'announcement' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          <Megaphone size={14} className="inline mr-1" /> Create Announcement
        </button>
      </div>

      {mode === 'event' ? (
        <Card className="p-6 max-w-2xl">
          <h3 className="font-semibold text-slate-900 mb-4">Create New Event</h3>
          {evtCreated && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
              <Check size={16} /> Event created successfully! It will appear with a Branch Verified badge.
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Event Name</label>
              <Input type="text" placeholder="e.g. AI Workshop" value={evtName} onChange={(e) => setEvtName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <Select value={evtCategory} onChange={(e) => setEvtCategory(e.target.value as EventCategory)} className="w-full">
                  {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Branch</label>
                <Select value={evtBranch} onChange={(e) => setEvtBranch(e.target.value as Branch | 'All')} className="w-full">
                  <option value="All">All Branches</option>
                  {ALL_BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
                <Input type="text" placeholder="e.g. 2026-09-15" value={evtDate} onChange={(e) => setEvtDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Time</label>
                <Input type="text" placeholder="e.g. 10:00 AM" value={evtTime} onChange={(e) => setEvtTime(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
              <Input type="text" placeholder="e.g. Seminar Hall, Block A" value={evtLocation} onChange={(e) => setEvtLocation(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea
                placeholder="Describe your event..."
                value={evtDesc}
                onChange={(e) => setEvtDesc(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Registration Link (optional)</label>
              <Input type="text" placeholder="https://..." value={evtLink} onChange={(e) => setEvtLink(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <VerificationBadge type="branch" />
              <span>Your event will be marked as Branch Verified</span>
            </div>
            <Button onClick={handleCreateEvent} disabled={!evtName.trim() || !evtDate.trim()} className="w-full">
              Create Event
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6 max-w-2xl">
          <h3 className="font-semibold text-slate-900 mb-4">Create New Announcement</h3>
          {annCreated && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
              <Check size={16} /> Announcement posted successfully! It will appear with a Branch Verified badge.
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
              <Input type="text" placeholder="Announcement title" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea
                placeholder="Write your announcement..."
                value={annDesc}
                onChange={(e) => setAnnDesc(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
              />
            </div>
            {aiCats && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                <p className="text-xs font-medium text-blue-700 mb-1 flex items-center gap-1"><Sparkles size={12} /> AI Auto-Categorization</p>
                <div className="flex flex-wrap gap-1.5">
                  <Tag color="blue">Category: {aiCats.category}</Tag>
                  <Tag color="teal">Branch: {aiCats.branch}</Tag>
                  {aiCats.tags.map((t) => <Tag key={t}>#{t}</Tag>)}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Branch</label>
                <Select value={annBranch} onChange={(e) => setAnnBranch(e.target.value as Branch | 'All')} className="w-full">
                  <option value="All">All Branches</option>
                  {ALL_BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
                <Input type="text" placeholder="e.g. 2026-08-19" value={annDate} onChange={(e) => setAnnDate(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <VerificationBadge type="branch" />
              <span>Your announcement will be marked as Branch Verified</span>
            </div>
            <Button onClick={handleCreateAnnouncement} disabled={!annTitle.trim()} className="w-full">
              Post Announcement
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
