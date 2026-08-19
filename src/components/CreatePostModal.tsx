import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Modal, Button, Input, Select } from '@/components/ui';
import { categorizePost } from '@/lib/ai';
import type { PostCategory } from '@/types';
import { Sparkles, Tag as TagIcon } from 'lucide-react';

const CATEGORIES: PostCategory[] = [
  'Looking for Teammate',
  'Project Collaboration',
  'Sharing Opportunity',
  'Event Information',
  'Workshop',
  'Achievement',
  'Announcement',
];

export function CreatePostModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { currentUser, createPost } = useApp();
  const [category, setCategory] = useState<PostCategory>('Looking for Teammate');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [aiCategorization, setAiCategorization] = useState<{ category: string; branch: string; tags: string[] } | null>(null);

  const handleAnalyze = () => {
    if (content.trim()) {
      const result = categorizePost(content);
      setAiCategorization({ category: result.category, branch: result.branch, tags: result.tags });
      setCategory(result.category as PostCategory);
      setTags(result.tags);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    createPost({
      category,
      title: title.trim(),
      content: content.trim(),
      tags,
      branch: currentUser?.branch || 'All',
      lookingFor: lookingFor.trim() || undefined,
    });
    setTitle('');
    setContent('');
    setTags([]);
    setLookingFor('');
    setAiCategorization(null);
    onClose();
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Post" maxWidth="max-w-xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
          <Select value={category} onChange={(e) => setCategory(e.target.value as PostCategory)} className="w-full">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
          <Input type="text" placeholder="Give your post a title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Content</label>
          <textarea
            placeholder="Share details about what you're looking for or what you want to share..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
          />
        </div>
        <button
          onClick={handleAnalyze}
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <Sparkles size={14} /> AI Auto-Categorize
        </button>
        {aiCategorization && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-xs font-medium text-blue-700 mb-1">AI Analysis:</p>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">Category: {aiCategorization.category}</span>
              <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-700 text-xs font-medium">Branch: {aiCategorization.branch}</span>
              {aiCategorization.tags.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">#{t}</span>
              ))}
            </div>
          </div>
        )}
        {category === 'Looking for Teammate' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Looking For</label>
            <Input type="text" placeholder="e.g. Frontend developer with React experience" value={lookingFor} onChange={(e) => setLookingFor(e.target.value)} />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Tags <span className="text-slate-400 font-normal">(press Enter to add)</span></label>
          <Input type="text" placeholder="Add tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} icon={<TagIcon size={18} />} />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((t) => (
                <button key={t} type="button" onClick={() => setTags(tags.filter((x) => x !== t))} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200">
                  #{t} ×
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || !content.trim()}>Post</Button>
        </div>
      </div>
    </Modal>
  );
}
