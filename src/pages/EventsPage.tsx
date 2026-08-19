import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button, VerificationBadge, ProgressBar, PageHeader, Select, EmptyState, Modal } from '@/components/ui';
import { calculateEventMatch } from '@/lib/ai';
import { Calendar, MapPin, Clock, Bookmark, Check, Users } from 'lucide-react';
import type { UniversityEvent, EventCategory } from '@/types';

const CATEGORIES: (EventCategory | 'All')[] = [
  'All', 'Cultural', 'Technical', 'Competition', 'Sports', 'Music', 'Dance', 'Workshop', 'Hackathon', 'Academic',
];

const CATEGORY_ICONS: Record<EventCategory, string> = {
  Cultural: '🎭', Technical: '💻', Competition: '🏆', Sports: '🏏', Music: '🎤',
  Dance: '💃', Workshop: '📚', Hackathon: '🚀', Academic: '🎓',
};

export function EventsPage() {
  const { currentUser, events, registeredEvents, savedEvents, registerForEvent, saveEvent } = useApp();
  const [category, setCategory] = useState<EventCategory | 'All'>('All');
  const [selectedEvent, setSelectedEvent] = useState<UniversityEvent | null>(null);

  const filteredEvents = useMemo(() => {
    if (category === 'All') return events;
    return events.filter((e) => e.category === category);
  }, [events, category]);

  if (!currentUser) return null;

  return (
    <div>
      <PageHeader title="GMU Events Hub" subtitle="Discover and register for events across all branches" icon={<Calendar size={20} />} />

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
            {cat === 'All' ? 'All Events' : `${CATEGORY_ICONS[cat as EventCategory]} ${cat}`}
          </button>
        ))}
      </div>

      {filteredEvents.length === 0 ? (
        <EmptyState icon={<Calendar size={28} />} title="No events found" description="No events in this category yet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => {
            const isRegistered = registeredEvents.includes(event.id);
            const isSaved = savedEvents.includes(event.id);
            const match = calculateEventMatch(currentUser, event);
            return (
              <Card key={event.id} className="p-4 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{CATEGORY_ICONS[event.category]}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{event.name}</p>
                      <p className="text-xs text-slate-500">{event.organizer}</p>
                    </div>
                  </div>
                  <VerificationBadge type={event.verification} />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {event.time}</span>
                </div>
                <p className="text-xs text-slate-500 mb-2 flex items-center gap-1"><MapPin size={12} /> {event.location}</p>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2 flex-1">{event.description}</p>
                <div className="mb-3">
                  <ProgressBar value={event.registered} max={event.capacity} label="Capacity" />
                </div>
                {match >= 60 && (
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {match}% Match
                    </span>
                  </div>
                )}
                <div className="flex gap-2">
                  {isRegistered ? (
                    <Button size="sm" variant="secondary" disabled className="flex-1 gap-1"><Check size={14} /> Registered</Button>
                  ) : (
                    <Button size="sm" onClick={() => registerForEvent(event.id)} className="flex-1">Register</Button>
                  )}
                  <Button size="sm" variant={isSaved ? 'primary' : 'outline'} onClick={() => saveEvent(event.id)} className="gap-1">
                    <Bookmark size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedEvent(event)}>Details</Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <Modal open={!!selectedEvent} onClose={() => setSelectedEvent(null)} title={selectedEvent.name} maxWidth="max-w-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{CATEGORY_ICONS[selectedEvent.category]}</span>
              <VerificationBadge type={selectedEvent.verification} />
            </div>
            <p className="text-sm text-slate-600">{selectedEvent.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs text-slate-400 mb-0.5">Date</p>
                <p className="font-medium text-slate-900 flex items-center gap-1.5"><Calendar size={14} /> {selectedEvent.date}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs text-slate-400 mb-0.5">Time</p>
                <p className="font-medium text-slate-900 flex items-center gap-1.5"><Clock size={14} /> {selectedEvent.time}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs text-slate-400 mb-0.5">Location</p>
                <p className="font-medium text-slate-900 flex items-center gap-1.5"><MapPin size={14} /> {selectedEvent.location}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs text-slate-400 mb-0.5">Organizer</p>
                <p className="font-medium text-slate-900 flex items-center gap-1.5"><Users size={14} /> {selectedEvent.organizer}</p>
              </div>
            </div>
            <div>
              <ProgressBar value={selectedEvent.registered} max={selectedEvent.capacity} label="Registration" />
            </div>
            <div className="flex gap-2 pt-2">
              {registeredEvents.includes(selectedEvent.id) ? (
                <Button variant="secondary" disabled className="flex-1 gap-2"><Check size={16} /> Already Registered</Button>
              ) : (
                <Button onClick={() => { registerForEvent(selectedEvent.id); setSelectedEvent(null); }} className="flex-1">Register Now</Button>
              )}
              <Button variant={savedEvents.includes(selectedEvent.id) ? 'primary' : 'outline'} onClick={() => saveEvent(selectedEvent.id)} className="gap-2">
                <Bookmark size={16} /> {savedEvents.includes(selectedEvent.id) ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
