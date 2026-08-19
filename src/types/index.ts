export type Branch =
  | 'CSE'
  | 'ECE'
  | 'Mechanical'
  | 'Civil'
  | 'Commerce'
  | 'Management'
  | 'Architecture'
  | 'Biotechnology';

export type Year = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';

export type VerificationBadge = 'official' | 'branch' | 'student';

export type EventCategory =
  | 'Cultural'
  | 'Technical'
  | 'Competition'
  | 'Sports'
  | 'Music'
  | 'Dance'
  | 'Workshop'
  | 'Hackathon'
  | 'Academic';

export type OpportunityCategory =
  | 'Internship'
  | 'Scholarship'
  | 'Hackathon'
  | 'Competition'
  | 'Research'
  | 'Workshop'
  | 'Startup'
  | 'Certification';

export type PostCategory =
  | 'Looking for Teammate'
  | 'Project Collaboration'
  | 'Sharing Opportunity'
  | 'Event Information'
  | 'Workshop'
  | 'Achievement'
  | 'Announcement';

export interface Student {
  usn: string;
  name: string;
  email: string;
  password: string;
  branch: Branch;
  year: Year;
  skills: string[];
  interests: string[];
  projects: Project[];
  experience: string[];
  lookingFor: string;
  achievements: string[];
  eventsJoined: string[];
  savedOpportunities: string[];
  savedEvents: string[];
  connections: string[];
  bio: string;
  avatarColor: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
}

export interface UniversityEvent {
  id: string;
  name: string;
  category: EventCategory;
  organizer: string;
  branch: Branch | 'All';
  date: string;
  time: string;
  location: string;
  description: string;
  verification: VerificationBadge;
  capacity: number;
  registered: number;
}

export interface Opportunity {
  id: string;
  title: string;
  category: OpportunityCategory;
  provider: string;
  branch: Branch | 'All';
  deadline: string;
  description: string;
  requiredSkills: string[];
  eligibility: string;
  documents: string[];
  type: 'event' | 'opportunity';
}

export interface BranchData {
  name: Branch;
  fullName: string;
  icon: string;
  color: string;
  announcements: Announcement[];
  events: string[];
  memberCount: number;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  verification: VerificationBadge;
  branch: Branch | 'All';
}

export interface Post {
  id: string;
  authorUsn: string;
  authorName: string;
  authorBranch: Branch;
  category: PostCategory;
  title: string;
  content: string;
  tags: string[];
  date: string;
  verification: VerificationBadge;
  branch: Branch | 'All';
  lookingFor?: string;
}

export interface AppNotification {
  id: string;
  type: 'event' | 'match' | 'branch' | 'scholarship' | 'connection' | 'registration';
  title: string;
  description: string;
  date: string;
  read: boolean;
}

export interface TeamSuggestion {
  student: Student;
  role: string;
  matchScore: number;
  reason: string;
}

export interface TeamMatchResult {
  members: TeamSuggestion[];
  compatibility: number;
  explanation: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  results?: SearchResult[];
  timestamp: number;
}

export interface SearchResult {
  type: 'student' | 'event' | 'opportunity' | 'post';
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  matchScore?: number;
}
