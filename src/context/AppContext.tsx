import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type {
  Student,
  UniversityEvent,
  Opportunity,
  Post,
  AppNotification,
} from '@/types';
import {
  MOCK_STUDENTS,
  MOCK_EVENTS,
  MOCK_OPPORTUNITIES,
  MOCK_POSTS,
  DEMO_STUDENT,
} from '@/data/mockData';

interface AppState {
  currentUser: Student | null;
  students: Student[];
  events: UniversityEvent[];
  opportunities: Opportunity[];
  posts: Post[];
  notifications: AppNotification[];
  pendingConnections: string[];
  savedEvents: string[];
  savedOpportunities: string[];
  registeredEvents: string[];
  login: (usn: string, password: string) => { success: boolean; error?: string };
  loginDemo: () => void;
  signup: (data: SignupData) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<Student>) => void;
  connectWithStudent: (usn: string) => void;
  registerForEvent: (eventId: string) => void;
  saveEvent: (eventId: string) => void;
  saveOpportunity: (oppId: string) => void;
  createPost: (post: Omit<Post, 'id' | 'date' | 'verification' | 'authorUsn' | 'authorName' | 'authorBranch'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'date' | 'read'>) => void;
}

interface SignupData {
  name: string;
  usn: string;
  email: string;
  password: string;
  branch: Student['branch'];
  year: Student['year'];
  skills: string[];
  interests: string[];
}

const AppContext = createContext<AppState | undefined>(undefined);

const STORAGE_KEY = 'gmu-nexus-state';

interface PersistedState {
  currentUserUsn: string | null;
  students: Student[];
  posts: Post[];
  notifications: AppNotification[];
  pendingConnections: string[];
  savedEvents: string[];
  savedOpportunities: string[];
  registeredEvents: string[];
}

function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

function saveState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [events] = useState<UniversityEvent[]>(MOCK_EVENTS);
  const [opportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'n1',
      type: 'event',
      title: 'New AI Hackathon announced',
      description: 'AI Hackathon 2026 is now open for registration. 48 hours of innovation!',
      date: '2026-08-19',
      read: false,
    },
    {
      id: 'n2',
      type: 'match',
      title: 'You have a 94% team match',
      description: 'AI found 3 students with complementary skills for your hackathon team.',
      date: '2026-08-19',
      read: false,
    },
    {
      id: 'n3',
      type: 'scholarship',
      title: 'Scholarship deadline in 3 days',
      description: 'GMU Merit Scholarship application closes on September 30th.',
      date: '2026-08-18',
      read: false,
    },
    {
      id: 'n4',
      type: 'registration',
      title: 'Mallika registration is open',
      description: 'Register now for the biggest cultural fest of the year!',
      date: '2026-08-17',
      read: true,
    },
  ]);
  const [pendingConnections, setPendingConnections] = useState<string[]>([]);
  const [savedEvents, setSavedEvents] = useState<string[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  useEffect(() => {
    const persisted = loadState();
    if (persisted) {
      if (persisted.students) setStudents(persisted.students);
      if (persisted.posts) setPosts(persisted.posts);
      if (persisted.notifications) setNotifications(persisted.notifications);
      if (persisted.pendingConnections) setPendingConnections(persisted.pendingConnections);
      if (persisted.savedEvents) setSavedEvents(persisted.savedEvents);
      if (persisted.savedOpportunities) setSavedOpportunities(persisted.savedOpportunities);
      if (persisted.registeredEvents) setRegisteredEvents(persisted.registeredEvents);
      if (persisted.currentUserUsn) {
        if (persisted.currentUserUsn === 'DEMO001') {
          setCurrentUser(DEMO_STUDENT);
        } else {
          const student = (persisted.students || MOCK_STUDENTS).find(
            (s) => s.usn === persisted.currentUserUsn
          );
          if (student) setCurrentUser(student);
        }
      }
    }
  }, []);

  const persistState = useCallback(
    (overrides: Partial<PersistedState> = {}) => {
      const state: PersistedState = {
        currentUserUsn: currentUser?.usn || null,
        students,
        posts,
        notifications,
        pendingConnections,
        savedEvents,
        savedOpportunities,
        registeredEvents,
        ...overrides,
      };
      saveState(state);
    },
    [currentUser, students, posts, notifications, pendingConnections, savedEvents, savedOpportunities, registeredEvents]
  );

  const login = (usn: string, password: string) => {
    const upperUsn = usn.trim().toUpperCase();
    const student = students.find((s) => s.usn.toUpperCase() === upperUsn);
    if (!student) {
      return { success: false, error: 'USN not found. Please check your USN or create a new account.' };
    }
    if (student.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }
    setCurrentUser(student);
    setRegisteredEvents(student.eventsJoined);
    setSavedEvents(student.savedEvents);
    setSavedOpportunities(student.savedOpportunities);
    setPendingConnections([]);
    persistState({ currentUserUsn: student.usn });
    return { success: true };
  };

  const loginDemo = () => {
    setCurrentUser(DEMO_STUDENT);
    setRegisteredEvents(DEMO_STUDENT.eventsJoined);
    setSavedEvents([]);
    setSavedOpportunities([]);
    setPendingConnections([]);
    persistState({ currentUserUsn: 'DEMO001' });
  };

  const signup = (data: SignupData) => {
    const upperUsn = data.usn.trim().toUpperCase();
    if (students.some((s) => s.usn.toUpperCase() === upperUsn)) {
      return { success: false, error: 'A student with this USN already exists.' };
    }
    const newStudent: Student = {
      usn: upperUsn,
      name: data.name,
      email: data.email,
      password: data.password,
      branch: data.branch,
      year: data.year,
      skills: data.skills,
      interests: data.interests,
      projects: [],
      experience: [],
      lookingFor: 'Open to collaboration',
      achievements: [],
      eventsJoined: [],
      savedOpportunities: [],
      savedEvents: [],
      connections: [],
      bio: `New GMU Nexus member from ${data.branch}. Excited to connect and collaborate!`,
      avatarColor: 'bg-gradient-to-br from-blue-500 to-teal-500',
    };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    setCurrentUser(newStudent);
    persistState({ students: updatedStudents, currentUserUsn: newStudent.usn });
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setRegisteredEvents([]);
    setSavedEvents([]);
    setSavedOpportunities([]);
    setPendingConnections([]);
    persistState({ currentUserUsn: null });
  };

  const updateProfile = (updates: Partial<Student>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    const updatedStudents = students.map((s) =>
      s.usn === currentUser.usn ? updated : s
    );
    setStudents(updatedStudents);
    persistState({ students: updatedStudents, currentUserUsn: updated.usn });
  };

  const connectWithStudent = (usn: string) => {
    if (!currentUser || pendingConnections.includes(usn)) return;
    setPendingConnections([...pendingConnections, usn]);
    const target = students.find((s) => s.usn === usn);
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        type: 'connection',
        title: `Connection request sent to ${target?.name || 'student'}`,
        description: `You sent a connection request to ${target?.name}. You'll be notified when they accept.`,
        date: new Date().toISOString().split('T')[0],
        read: false,
      },
      ...prev,
    ]);
    persistState({ pendingConnections: [...pendingConnections, usn] });
  };

  const registerForEvent = (eventId: string) => {
    if (!currentUser || registeredEvents.includes(eventId)) return;
    setRegisteredEvents([...registeredEvents, eventId]);
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setNotifications((prev) => [
        {
          id: `n-${Date.now()}`,
          type: 'registration',
          title: `Registered for ${event.name}`,
          description: `You've successfully registered for ${event.name} on ${event.date}. See you there!`,
          date: new Date().toISOString().split('T')[0],
          read: false,
        },
        ...prev,
      ]);
    }
    persistState({ registeredEvents: [...registeredEvents, eventId] });
  };

  const saveEvent = (eventId: string) => {
    if (savedEvents.includes(eventId)) {
      setSavedEvents(savedEvents.filter((id) => id !== eventId));
      persistState({ savedEvents: savedEvents.filter((id) => id !== eventId) });
    } else {
      setSavedEvents([...savedEvents, eventId]);
      persistState({ savedEvents: [...savedEvents, eventId] });
    }
  };

  const saveOpportunity = (oppId: string) => {
    if (savedOpportunities.includes(oppId)) {
      setSavedOpportunities(savedOpportunities.filter((id) => id !== oppId));
      persistState({ savedOpportunities: savedOpportunities.filter((id) => id !== oppId) });
    } else {
      setSavedOpportunities([...savedOpportunities, oppId]);
      persistState({ savedOpportunities: [...savedOpportunities, oppId] });
    }
  };

  const createPost = (
    postData: Omit<Post, 'id' | 'date' | 'verification' | 'authorUsn' | 'authorName' | 'authorBranch'>
  ) => {
    if (!currentUser) return;
    const newPost: Post = {
      ...postData,
      id: `post-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      verification: 'student',
      authorUsn: currentUser.usn,
      authorName: currentUser.name,
      authorBranch: currentUser.branch,
    };
    setPosts([newPost, ...posts]);
    persistState({ posts: [newPost, ...posts] });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    persistState({ notifications: notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) });
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    persistState({ notifications: notifications.map((n) => ({ ...n, read: true })) });
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'date' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `n-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      read: false,
    };
    setNotifications([newNotif, ...notifications]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        students,
        events,
        opportunities,
        posts,
        notifications,
        pendingConnections,
        savedEvents,
        savedOpportunities,
        registeredEvents,
        login,
        loginDemo,
        signup,
        logout,
        updateProfile,
        connectWithStudent,
        registerForEvent,
        saveEvent,
        saveOpportunity,
        createPost,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
