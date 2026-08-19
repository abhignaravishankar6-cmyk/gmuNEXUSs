import { useState, useRef, useEffect, type ReactNode } from 'react';
import {
  Home, Search, Users, Target, Calendar, Building2, Bot, User as UserIcon,
  Bell, LogOut, Menu, X, Plus, Check, Settings, ChevronDown,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Avatar } from '@/components/ui';

export type PageId =
  | 'home' | 'discover' | 'connect' | 'opportunities' | 'events'
  | 'branches' | 'assistant' | 'profile' | 'organizer' | 'admin';

const NAV_ITEMS: { id: PageId; label: string; icon: ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home size={20} /> },
  { id: 'discover', label: 'Discover', icon: <Search size={20} /> },
  { id: 'connect', label: 'Connect', icon: <Users size={20} /> },
  { id: 'opportunities', label: 'Opportunities', icon: <Target size={20} /> },
  { id: 'events', label: 'Events', icon: <Calendar size={20} /> },
  { id: 'branches', label: 'Branches', icon: <Building2 size={20} /> },
  { id: 'assistant', label: 'AI Assistant', icon: <Bot size={20} /> },
  { id: 'profile', label: 'Profile', icon: <UserIcon size={20} /> },
];

interface LayoutProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  children: ReactNode;
  onCreatePost: () => void;
}

export function Layout({ currentPage, onNavigate, children, onCreatePost }: LayoutProps) {
  const { currentUser, notifications, logout, markNotificationRead, markAllNotificationsRead } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!currentUser) return null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-white border-r border-slate-200 z-30">
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
              N
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg leading-tight">GMU NEXUS</h1>
              <p className="text-[10px] text-slate-500 leading-tight">Connect. Discover. Collaborate.</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className={currentPage === item.id ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="pt-3 mt-3 border-t border-slate-100 space-y-1">
            <button
              onClick={() => onNavigate('organizer')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'organizer' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Plus size={20} className={currentPage === 'organizer' ? 'text-blue-600' : 'text-slate-400'} />
              Organizer Mode
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'admin' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Settings size={20} className={currentPage === 'admin' ? 'text-blue-600' : 'text-slate-400'} />
              Admin Dashboard
            </button>
          </div>
        </nav>
        <div className="p-3 border-t border-slate-200">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar name={currentUser.name} color={currentUser.avatarColor} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser.usn}</p>
            </div>
            <button onClick={logout} className="text-slate-400 hover:text-rose-500 transition-colors" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-30 flex items-center justify-around px-1 py-1.5">
        {NAV_ITEMS.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
              currentPage === item.id ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
        <button
          onClick={() => setMobileSearch(!mobileSearch)}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium text-slate-400"
        >
          <Menu size={20} />
          More
        </button>
      </nav>

      {/* Mobile More Menu */}
      {mobileSearch && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setMobileSearch(false)}>
          <div className="absolute bottom-16 inset-x-0 bg-white rounded-t-2xl p-4 space-y-1" onClick={(e) => e.stopPropagation()}>
            {NAV_ITEMS.slice(5).map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileSearch(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  currentPage === item.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { onNavigate('organizer'); setMobileSearch(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600"
            >
              <Plus size={20} /> Organizer Mode
            </button>
            <button
              onClick={() => { onNavigate('admin'); setMobileSearch(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600"
            >
              <Settings size={20} /> Admin Dashboard
            </button>
            <button
              onClick={() => { logout(); setMobileSearch(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs">N</div>
            <span className="font-bold text-slate-900">GMU NEXUS</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm text-slate-500">{greeting}, <span className="font-semibold text-slate-900">{currentUser.name}</span> 👋</p>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={onCreatePost}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Create Post</span>
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-slate-200 max-h-96 overflow-y-auto z-50">
                  <div className="flex items-center justify-between p-3 border-b border-slate-100 sticky top-0 bg-white">
                    <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllNotificationsRead} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Mark all read
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-sm text-slate-500">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`w-full text-left p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-slate-300' : 'bg-blue-500'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900">{n.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{n.description}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{n.date}</p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Account Menu */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Avatar name={currentUser.name} color={currentUser.avatarColor} size="sm" />
                <ChevronDown size={16} className="text-slate-400 hidden md:block" />
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
                    <p className="text-xs text-slate-500">{currentUser.email}</p>
                  </div>
                  <button onClick={() => { onNavigate('profile'); setAccountOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <UserIcon size={16} /> Profile
                  </button>
                  <button onClick={() => { onNavigate('organizer'); setAccountOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <Plus size={16} /> Organizer Mode
                  </button>
                  <button onClick={() => { onNavigate('admin'); setAccountOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <Settings size={16} /> Admin Dashboard
                  </button>
                  <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 border-t border-slate-100">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 md:px-6 py-6 pb-20 md:pb-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
