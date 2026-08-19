import type {
  Student,
  UniversityEvent,
  Opportunity,
  TeamMatchResult,
  TeamSuggestion,
  SearchResult,
  Post,
  Branch,
} from '@/types';
import { MOCK_STUDENTS, MOCK_EVENTS, MOCK_OPPORTUNITIES, MOCK_POSTS } from '@/data/mockData';

const ALL_SKILL_KEYWORDS: Record<string, string[]> = {
  ai: ['AI', 'AI/ML', 'Machine Learning', 'ML', 'TensorFlow', 'NLP', 'Deep Learning'],
  python: ['Python'],
  react: ['React', 'JavaScript', 'TypeScript'],
  ui: ['UI/UX', 'Figma', 'Design', '3D Modeling', 'SketchUp'],
  iot: ['IoT', 'Embedded Systems', 'Arduino', 'Sensors'],
  robotics: ['Robotics', 'CAD', 'SolidWorks', 'Arduino'],
  web: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Node.js', 'Web Development'],
  data: ['Data Analytics', 'Python', 'Data Science'],
  cloud: ['Docker', 'Cloud Computing', 'DevOps', 'Linux'],
  security: ['Cybersecurity', 'Security', 'Networking', 'Linux'],
  design: ['UI/UX', 'Figma', 'Design', 'AutoCAD', '3D Modeling'],
  frontend: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
  backend: ['Java', 'Spring Boot', 'Python', 'PostgreSQL', 'Node.js'],
  presentation: ['Presentation', 'Content Writing', 'Public Speaking', 'Marketing'],
  ml: ['Machine Learning', 'TensorFlow', 'AI/ML', 'Python'],
  hardware: ['VLSI', 'Verilog', 'Embedded Systems', 'Signal Processing'],
  finance: ['Financial Analysis', 'Accounting', 'Finance', 'Excel'],
  marketing: ['Marketing', 'SEO', 'Digital Marketing', 'Content Strategy'],
};

function skillMatch(userSkills: string[], requiredSkills: string[]): number {
  if (requiredSkills.length === 0) return 50;
  const userLower = userSkills.map((s) => s.toLowerCase());
  const matched = requiredSkills.filter((rs) =>
    userLower.some((us) => us.includes(rs.toLowerCase()) || rs.toLowerCase().includes(us))
  );
  return Math.round((matched.length / requiredSkills.length) * 100);
}

export function calculateOpportunityMatch(student: Student, opp: Opportunity): number {
  let score = 0;

  if (opp.requiredSkills.length > 0) {
    score += skillMatch(student.skills, opp.requiredSkills) * 0.5;
  } else {
    score += 40;
  }

  if (opp.branch === 'All' || opp.branch === student.branch) {
    score += 20;
  }

  const interestOverlap = opp.requiredSkills.filter((rs) =>
    student.interests.some((i) => i.toLowerCase().includes(rs.toLowerCase()) || rs.toLowerCase().includes(i.toLowerCase()))
  );
  score += Math.min(interestOverlap.length * 8, 20);

  if (student.year === '1st Year') score -= 5;
  if (student.year === '4th Year') score += 5;

  return Math.min(Math.round(score), 99);
}

export function calculateEventMatch(student: Student, event: UniversityEvent): number {
  let score = 50;

  const eventKeywords = event.name.toLowerCase().split(' ');
  const studentKeywords = [
    ...student.skills.map((s) => s.toLowerCase()),
    ...student.interests.map((i) => i.toLowerCase()),
  ];

  eventKeywords.forEach((kw) => {
    if (kw.length > 2) {
      studentKeywords.forEach((sk) => {
        if (sk.includes(kw) || kw.includes(sk)) {
          score += 15;
        }
      });
    }
  });

  if (event.branch === 'All' || event.branch === student.branch) {
    score += 15;
  }

  if (event.category === 'Hackathon' && student.interests.some((i) => i.toLowerCase().includes('hackathon'))) {
    score += 20;
  }
  if (event.category === 'Cultural' && student.interests.some((i) => i.toLowerCase().includes('cultural'))) {
    score += 15;
  }
  if (event.category === 'Workshop' && student.interests.some((i) => i.toLowerCase().includes('research'))) {
    score += 10;
  }

  return Math.min(Math.round(score), 99);
}

export function calculateStudentMatch(studentA: Student, studentB: Student): number {
  let score = 30;

  const sharedSkills = studentA.skills.filter((s) =>
    studentB.skills.some((bs) => bs.toLowerCase() === s.toLowerCase())
  );
  score += sharedSkills.length * 10;

  const complementarySkills = studentA.skills.filter((s) =>
    !studentB.skills.some((bs) => bs.toLowerCase() === s.toLowerCase())
  );
  score += Math.min(complementarySkills.length * 8, 30);

  const sharedInterests = studentA.interests.filter((i) =>
    studentB.interests.some((bi) => bi.toLowerCase() === i.toLowerCase())
  );
  score += sharedInterests.length * 8;

  if (studentA.branch !== studentB.branch) {
    score += 15;
  }

  return Math.min(Math.round(score), 99);
}

export function getRecommendedEvents(student: Student, events: UniversityEvent[]): UniversityEvent[] {
  return events
    .filter((e) => !student.eventsJoined.includes(e.id))
    .map((e) => ({ event: e, score: calculateEventMatch(student, e) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.event);
}

export function getRecommendedOpportunities(
  student: Student,
  opportunities: Opportunity[]
): { opportunity: Opportunity; match: number }[] {
  return opportunities
    .map((opp) => ({ opportunity: opp, match: calculateOpportunityMatch(student, opp) }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 5);
}

export function getRecommendedStudents(
  student: Student,
  students: Student[]
): { student: Student; match: number }[] {
  return students
    .filter((s) => s.usn !== student.usn && !student.connections.includes(s.usn))
    .map((s) => ({ student: s, match: calculateStudentMatch(student, s) }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 6);
}

export function buildTeam(
  request: string,
  currentUser: Student,
  allStudents: Student[]
): TeamMatchResult {
  const lowerRequest = request.toLowerCase();

  const roleKeywords: { role: string; keywords: string[]; skills: string[] }[] = [
    { role: 'Frontend Developer', keywords: ['frontend', 'react', 'web', 'ui'], skills: ['React', 'JavaScript', 'TypeScript', 'UI/UX'] },
    { role: 'Backend Developer', keywords: ['backend', 'server', 'api'], skills: ['Java', 'Spring Boot', 'Python', 'PostgreSQL', 'Node.js'] },
    { role: 'AI/ML Engineer', keywords: ['ai', 'ml', 'machine learning', 'data'], skills: ['AI/ML', 'Machine Learning', 'Python', 'TensorFlow'] },
    { role: 'UI/UX Designer', keywords: ['ui', 'ux', 'design', 'figma'], skills: ['UI/UX', 'Figma', 'Design'] },
    { role: 'IoT/Embedded Engineer', keywords: ['iot', 'embedded', 'hardware', 'sensor'], skills: ['IoT', 'Embedded Systems', 'Arduino', 'C'] },
    { role: 'Robotics Engineer', keywords: ['robot', 'robotics', 'mechanical'], skills: ['Robotics', 'CAD', 'SolidWorks', 'Arduino'] },
    { role: 'Presenter/Content', keywords: ['presentation', 'presenter', 'content', 'pitch'], skills: ['Presentation', 'Content Writing', 'Public Speaking', 'Marketing'] },
    { role: 'Data Analyst', keywords: ['data', 'analytics', 'analysis'], skills: ['Data Analytics', 'Python', 'Excel'] },
  ];

  const neededRoles = roleKeywords.filter((r) =>
    r.keywords.some((kw) => lowerRequest.includes(kw))
  );

  if (neededRoles.length === 0) {
    const fallback = roleKeywords.slice(0, 3);
    neededRoles.push(...fallback);
  }

  const members: TeamSuggestion[] = [];
  const usedUsns = new Set<string>([currentUser.usn]);
  const explanation: string[] = [];

  for (const role of neededRoles.slice(0, 4)) {
    const candidates = allStudents
      .filter((s) => !usedUsns.has(s.usn))
      .map((s) => ({
        student: s,
        match: skillMatch(s.skills, role.skills),
        sharedInterests: s.interests.filter((i) =>
          currentUser.interests.some((ci) => ci.toLowerCase() === i.toLowerCase())
        ).length,
      }))
      .sort((a, b) => b.match - a.match || b.sharedInterests - a.sharedInterests);

    if (candidates.length > 0 && candidates[0].match > 0) {
      const best = candidates[0];
      members.push({
        student: best.student,
        role: role.role,
        matchScore: best.match,
        reason: `${role.role} with ${best.student.skills.filter((sk) =>
          role.skills.some((rs) => sk.toLowerCase().includes(rs.toLowerCase()) || rs.toLowerCase().includes(sk.toLowerCase()))
        ).join(', ')}`,
      });
      usedUsns.add(best.student.usn);
      explanation.push(`✓ ${role.role} role covered by ${best.student.name}`);
      if (best.student.branch !== currentUser.branch) {
        explanation.push(`✓ ${best.student.name} brings ${best.student.branch} perspective`);
      }
    }
  }

  const avgScore =
    members.length > 0
      ? Math.round(members.reduce((sum, m) => sum + m.matchScore, 0) / members.length)
      : 0;

  const sharedInterestsCount = members.filter((m) =>
    m.student.interests.some((i) =>
      currentUser.interests.some((ci) => ci.toLowerCase() === i.toLowerCase())
    )
  ).length;

  if (sharedInterestsCount > 0) {
    explanation.push(`✓ Shared interests across ${sharedInterestsCount} team member(s)`);
  }

  const crossBranchCount = members.filter((m) => m.student.branch !== currentUser.branch).length;
  if (crossBranchCount > 0) {
    explanation.push(`✓ ${crossBranchCount} member(s) from different branches`);
  }

  const compatibility = Math.min(Math.round(avgScore * 0.7 + (members.length > 0 ? 25 : 0) + crossBranchCount * 3), 99);

  return {
    members,
    compatibility,
    explanation: explanation.length > 0 ? explanation : ['✓ Team assembled based on your request'],
  };
}

export function searchAll(
  query: string,
  student: Student,
  students: Student[],
  events: UniversityEvent[],
  opportunities: Opportunity[],
  posts: Post[]
): SearchResult[] {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  const results: SearchResult[] = [];

  students.forEach((s) => {
    if (
      s.name.toLowerCase().includes(lower) ||
      s.usn.toLowerCase().includes(lower) ||
      s.skills.some((sk) => sk.toLowerCase().includes(lower)) ||
      s.interests.some((i) => i.toLowerCase().includes(lower)) ||
      s.branch.toLowerCase().includes(lower)
    ) {
      results.push({
        type: 'student',
        id: s.usn,
        title: s.name,
        subtitle: `${s.branch} · ${s.year}`,
        meta: s.skills.join(' · '),
        matchScore: calculateStudentMatch(student, s),
      });
    }
  });

  events.forEach((e) => {
    if (
      e.name.toLowerCase().includes(lower) ||
      e.category.toLowerCase().includes(lower) ||
      e.description.toLowerCase().includes(lower) ||
      e.organizer.toLowerCase().includes(lower)
    ) {
      results.push({
        type: 'event',
        id: e.id,
        title: e.name,
        subtitle: e.category,
        meta: `${e.date} · ${e.location}`,
        matchScore: calculateEventMatch(student, e),
      });
    }
  });

  opportunities.forEach((o) => {
    if (
      o.title.toLowerCase().includes(lower) ||
      o.category.toLowerCase().includes(lower) ||
      o.description.toLowerCase().includes(lower) ||
      o.provider.toLowerCase().includes(lower) ||
      o.requiredSkills.some((sk) => sk.toLowerCase().includes(lower))
    ) {
      results.push({
        type: 'opportunity',
        id: o.id,
        title: o.title,
        subtitle: o.category,
        meta: `${o.provider} · Deadline: ${o.deadline}`,
        matchScore: calculateOpportunityMatch(student, o),
      });
    }
  });

  posts.forEach((p) => {
    if (
      p.title.toLowerCase().includes(lower) ||
      p.content.toLowerCase().includes(lower) ||
      p.tags.some((t) => t.toLowerCase().includes(lower))
    ) {
      results.push({
        type: 'post',
        id: p.id,
        title: p.title,
        subtitle: p.category,
        meta: `By ${p.authorName} · ${p.date}`,
      });
    }
  });

  return results;
}

export function processAIQuery(
  query: string,
  student: Student,
  students: Student[],
  events: UniversityEvent[],
  opportunities: Opportunity[]
): { content: string; results?: SearchResult[] } {
  const lower = query.toLowerCase();

  if (lower.includes('event') && (lower.includes('week') || lower.includes('happening') || lower.includes('this'))) {
    const recommended = getRecommendedEvents(student, events);
    const results: SearchResult[] = recommended.map((e) => ({
      type: 'event',
      id: e.id,
      title: e.name,
      subtitle: e.category,
      meta: `${e.date} · ${e.location}`,
      matchScore: calculateEventMatch(student, e),
    }));
    return {
      content: `Here are the events happening this week at GMU, personalized for your interests in ${student.interests.slice(0, 2).join(' and ')}:`,
      results,
    };
  }

  if (lower.includes('hackathon')) {
    const hackathons = events.filter((e) => e.category === 'Hackathon');
    const oppHackathons = opportunities.filter((o) => o.category === 'Hackathon');
    const results: SearchResult[] = [
      ...hackathons.map((e) => ({
        type: 'event' as const,
        id: e.id,
        title: e.name,
        subtitle: e.category,
        meta: `${e.date} · ${e.location}`,
        matchScore: calculateEventMatch(student, e),
      })),
      ...oppHackathons.map((o) => ({
        type: 'opportunity' as const,
        id: o.id,
        title: o.title,
        subtitle: o.category,
        meta: `${o.provider} · Deadline: ${o.deadline}`,
        matchScore: calculateOpportunityMatch(student, o),
      })),
    ];
    return {
      content: `I found ${results.length} hackathon(s) for you. Based on your skills in ${student.skills.slice(0, 2).join(' and ')}, these are great matches:`,
      results,
    };
  }

  if (lower.includes('scholarship')) {
    const scholarships = opportunities.filter((o) => o.category === 'Scholarship');
    const results: SearchResult[] = scholarships.map((o) => ({
      type: 'opportunity',
      id: o.id,
      title: o.title,
      subtitle: o.category,
      meta: `${o.provider} · Deadline: ${o.deadline}`,
      matchScore: calculateOpportunityMatch(student, o),
    }));
    return {
      content: `I found ${scholarships.length} scholarship(s) available for you. Here are the ones matching your profile:`,
      results,
    };
  }

  if (lower.includes('react') || lower.includes('student who know')) {
    const skillStudents = students.filter((s) =>
      s.skills.some((sk) => lower.includes(sk.toLowerCase()))
    );
    const results: SearchResult[] = skillStudents.map((s) => ({
      type: 'student',
      id: s.usn,
      title: s.name,
      subtitle: `${s.branch} · ${s.year}`,
      meta: s.skills.join(' · '),
      matchScore: calculateStudentMatch(student, s),
    }));
    return {
      content: `I found ${skillStudents.length} student(s) with relevant skills. These students could be great collaborators:`,
      results,
    };
  }

  if (lower.includes('opportunity') || lower.includes('match my skill') || lower.includes('available for me')) {
    const recommended = getRecommendedOpportunities(student, opportunities);
    const results: SearchResult[] = recommended.map(({ opportunity, match }) => ({
      type: 'opportunity',
      id: opportunity.id,
      title: opportunity.title,
      subtitle: opportunity.category,
      meta: `${opportunity.provider} · ${match}% Match`,
      matchScore: match,
    }));
    return {
      content: `Based on your skills in ${student.skills.slice(0, 3).join(', ')} and interests in ${student.interests.slice(0, 2).join(', ')}, here are ${recommended.length} opportunities for you:`,
      results,
    };
  }

  if (lower.includes('branch') || lower.includes('happening in') || lower.includes('my branch')) {
    const branchEvents = events.filter((e) => e.branch === student.branch || e.branch === 'All');
    const results: SearchResult[] = branchEvents.slice(0, 4).map((e) => ({
      type: 'event',
      id: e.id,
      title: e.name,
      subtitle: e.category,
      meta: `${e.date} · ${e.location}`,
      matchScore: calculateEventMatch(student, e),
    }));
    return {
      content: `Here's what's happening in ${student.branch} and across GMU:`,
      results,
    };
  }

  if (lower.includes('register') || lower.includes('mallika')) {
    const mallika = events.find((e) => e.name.toLowerCase().includes('mallika'));
    if (mallika) {
      return {
        content: `To register for ${mallika.name}, go to the Events page and click Register. The event is on ${mallika.date} at ${mallika.location}. Registration is currently open!`,
        results: [{
          type: 'event',
          id: mallika.id,
          title: mallika.name,
          subtitle: mallika.category,
          meta: `${mallika.date} · ${mallika.location}`,
          matchScore: calculateEventMatch(student, mallika),
        }],
      };
    }
  }

  if (lower.includes('team') || lower.includes('teammate') || lower.includes('collaborat')) {
    const recommended = getRecommendedStudents(student, students);
    const results: SearchResult[] = recommended.map(({ student: s, match }) => ({
      type: 'student',
      id: s.usn,
      title: s.name,
      subtitle: `${s.branch} · ${s.year}`,
      meta: s.skills.join(' · '),
      matchScore: match,
    }));
    return {
      content: `Based on your profile, I recommend these students for collaboration. They have complementary skills and shared interests:`,
      results,
    };
  }

  const allResults = searchAll(query, student, students, events, opportunities, MOCK_POSTS);
  if (allResults.length > 0) {
    return {
      content: `I found ${allResults.length} result(s) matching "${query}". Here's what I found across GMU:`,
      results: allResults.slice(0, 8),
    };
  }

  return {
    content: `I'm here to help you navigate GMU! You can ask me about events, hackathons, scholarships, opportunities, finding teammates, or what's happening in your branch. Try asking "What events are happening this week?" or "Find students who know React".`,
  };
}

export function categorizePost(content: string): { category: string; branch: Branch | 'All'; tags: string[] } {
  const lower = content.toLowerCase();
  const tags: string[] = [];

  if (lower.includes('hackathon')) tags.push('Hackathon');
  if (lower.includes('ai') || lower.includes('ml') || lower.includes('machine learning')) tags.push('AI');
  if (lower.includes('iot')) tags.push('IoT');
  if (lower.includes('robot')) tags.push('Robotics');
  if (lower.includes('web') || lower.includes('react')) tags.push('Web');
  if (lower.includes('ui') || lower.includes('ux') || lower.includes('figma')) tags.push('UI/UX');
  if (lower.includes('cross') || lower.includes('inter-branch')) tags.push('Cross-Branch');

  let category = 'Announcement';
  if (lower.includes('looking for') || lower.includes('need') || lower.includes('seeking')) {
    category = 'Looking for Teammate';
  } else if (lower.includes('collaborat')) {
    category = 'Project Collaboration';
  } else if (lower.includes('opportunity') || lower.includes('internship') || lower.includes('scholarship')) {
    category = 'Sharing Opportunity';
  } else if (lower.includes('workshop')) {
    category = 'Workshop';
  } else if (lower.includes('won') || lower.includes('achievement') || lower.includes('award')) {
    category = 'Achievement';
  } else if (lower.includes('event')) {
    category = 'Event Information';
  }

  let branch: Branch | 'All' = 'All';
  const branchKeywords: { name: Branch; keywords: string[] }[] = [
    { name: 'CSE', keywords: ['cse', 'computer science', 'coding', 'programming'] },
    { name: 'ECE', keywords: ['ece', 'electronics', 'iot', 'embedded'] },
    { name: 'Mechanical', keywords: ['mechanical', 'robot', 'cad', 'solidworks'] },
    { name: 'Civil', keywords: ['civil', 'structural', 'construction'] },
    { name: 'Commerce', keywords: ['commerce', 'business', 'finance', 'accounting'] },
    { name: 'Management', keywords: ['management', 'leadership', 'marketing'] },
    { name: 'Architecture', keywords: ['architecture', 'design', 'building'] },
    { name: 'Biotechnology', keywords: ['biotech', 'bio', 'genetic', 'cell'] },
  ];

  for (const b of branchKeywords) {
    if (b.keywords.some((kw) => lower.includes(kw))) {
      branch = b.name;
      break;
    }
  }

  return { category, branch, tags };
}
