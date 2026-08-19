import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button, Input, Card, Avatar } from '@/components/ui';
import { GraduationCap, Lock, User, Mail, Eye, EyeOff, Sparkles, ArrowRight, Users, Target, Calendar, Bot } from 'lucide-react';
import type { Student } from '@/types';
import { ALL_BRANCHES } from '@/data/mockData';

type AuthMode = 'landing' | 'login' | 'signup';

interface AuthScreenProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

export function AuthScreen({ mode, onModeChange }: AuthScreenProps) {
  const { login, loginDemo, signup } = useApp();
  const [usn, setUsn] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Signup fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [branch, setBranch] = useState<Student['branch']>('CSE');
  const [year, setYear] = useState<Student['year']>('2nd Year');
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = login(usn, password);
    if (!result.success) setError(result.error || 'Login failed');
  };

  const handleDemo = () => {
    setError('');
    loginDemo();
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !usn.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const result = signup({ name, usn, email, password, branch, year, skills, interests });
    if (!result.success) setError(result.error || 'Signup failed');
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput('');
    }
  };

  const addInterest = () => {
    const i = interestInput.trim();
    if (i && !interests.includes(i)) {
      setInterests([...interests, i]);
      setInterestInput('');
    }
  };

  if (mode === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-teal-500/5" />
          <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6">
              <Sparkles size={14} /> AI-Powered University Ecosystem
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-4">
              GMU <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">NEXUS</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-medium mb-3">
              One University. One Network. Every Opportunity.
            </p>
            <p className="text-base text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">
              Connect with talented students across GMU, discover events and opportunities, build teams, and stay updated with everything happening across the university — powered by AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" onClick={() => onModeChange('login')} className="gap-2">
                Explore GMU Nexus <ArrowRight size={18} />
              </Button>
              <Button size="lg" variant="outline" onClick={() => onModeChange('login')}>
                Discover Opportunities
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Users size={24} />, title: 'Student Connections', desc: 'Find and connect with students across all branches with complementary skills.', color: 'blue' },
              { icon: <Target size={24} />, title: 'Opportunities', desc: 'Discover internships, scholarships, hackathons, and research programs matched to you.', color: 'emerald' },
              { icon: <Calendar size={24} />, title: 'Events', desc: 'Stay updated on cultural fests, workshops, competitions, and university events.', color: 'amber' },
              { icon: <Bot size={24} />, title: 'AI Matching', desc: 'AI-powered team builder and personalized recommendations for every student.', color: 'purple' },
            ].map((f) => (
              <Card key={f.title} className="p-5 hover:border-blue-200 transition-colors">
                <div className={`w-12 h-12 rounded-xl bg-${f.color}-50 text-${f.color}-600 flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Students', value: '5,240+' },
              { label: 'Active Events', value: '24' },
              { label: 'Opportunities', value: '68' },
              { label: 'Branches', value: '8' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 py-6 text-center">
          <p className="text-sm text-slate-500">GMU Nexus — Connect. Discover. Collaborate.</p>
        </div>
      </div>
    );
  }

  if (mode === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold">N</div>
              <span className="text-2xl font-bold text-slate-900">GMU NEXUS</span>
            </div>
            <p className="text-slate-500">Connect. Discover. Collaborate.</p>
          </div>

          <Card className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Welcome Back</h2>
            <p className="text-sm text-slate-500 mb-6">Sign in with your USN to continue</p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">USN</label>
                <Input
                  type="text"
                  placeholder="e.g. 1GM24CS001"
                  value={usn}
                  onChange={(e) => setUsn(e.target.value)}
                  icon={<GraduationCap size={18} />}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock size={18} />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                  Forgot Password?
                </button>
              </div>
              <Button type="submit" size="lg" className="w-full">Login</Button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-slate-400">or</span></div>
            </div>

            <Button variant="outline" size="lg" className="w-full" onClick={handleDemo}>
              <Sparkles size={16} /> Continue as Demo User
            </Button>

            <p className="text-center text-sm text-slate-500 mt-5">
              Don't have an account?{' '}
              <button onClick={() => { setError(''); onModeChange('signup'); }} className="text-blue-600 hover:text-blue-700 font-medium">
                Create Account
              </button>
            </p>
          </Card>

          <p className="text-center text-xs text-slate-400 mt-4">
            Try: USN <span className="font-mono font-medium">1GM24CS001</span>, password <span className="font-mono font-medium">password123</span>
          </p>
        </div>
      </div>
    );
  }

  // Signup
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold">N</div>
            <span className="text-2xl font-bold text-slate-900">GMU NEXUS</span>
          </div>
          <p className="text-slate-500">Create your student account</p>
        </div>

        <Card className="p-6 md:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <Input type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} icon={<User size={18} />} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">USN</label>
                <Input type="text" placeholder="e.g. 1GM24CS001" value={usn} onChange={(e) => setUsn(e.target.value)} icon={<GraduationCap size={18} />} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">University Email</label>
              <Input type="email" placeholder="your.name@gmu.edu.in" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail size={18} />} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <Input type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock size={18} />} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                <Input type={showPassword ? 'text' : 'password'} placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} icon={<Lock size={18} />} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Branch</label>
                <select value={branch} onChange={(e) => setBranch(e.target.value as Student['branch'])} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none">
                  {ALL_BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Year</label>
                <select value={year} onChange={(e) => setYear(e.target.value as Student['year'])} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none">
                  {(['1st Year', '2nd Year', '3rd Year', '4th Year'] as const).map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Skills <span className="text-slate-400 font-normal">(press Enter to add)</span></label>
              <Input type="text" placeholder="e.g. Python, React, UI/UX" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {skills.map((s) => (
                    <button key={s} type="button" onClick={() => setSkills(skills.filter((x) => x !== s))} className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100">
                      {s} ×
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Interests <span className="text-slate-400 font-normal">(press Enter to add)</span></label>
              <Input type="text" placeholder="e.g. AI, Hackathons, Robotics" value={interestInput} onChange={(e) => setInterestInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addInterest(); } }} />
              {interests.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {interests.map((i) => (
                    <button key={i} type="button" onClick={() => setInterests(interests.filter((x) => x !== i))} className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-medium hover:bg-teal-100">
                      {i} ×
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" size="lg" className="w-full">Create Account</Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <button onClick={() => { setError(''); onModeChange('login'); }} className="text-blue-600 hover:text-blue-700 font-medium">
              Login
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}
