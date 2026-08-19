# GMU NEXUS

**Connect. Discover. Collaborate.**

One University. One Network. Every Opportunity.

GMU Nexus is an AI-powered university-wide student ecosystem that connects students across branches, departments, and organizers with events, hackathons, opportunities, scholarships, and teams — all powered by an intelligent recommendation engine.

## Features

### Core
- **USN-Based Authentication** — Students log in with their unique USN; names and profiles load dynamically from student records
- **Personalized Dashboard** — Recommendations, events, and opportunities tailored to each student's skills, interests, branch, and year
- **AI Quick Assistant** — Ask questions about events, opportunities, teammates, and more
- **AI Team Builder** — Describe your team needs and AI finds the best teammates with complementary skills
- **Smart Search (Discover)** — Search across students, events, opportunities, and posts with categorized results
- **Connect** — Browse and connect with students across all branches; AI-recommended matches
- **Events Hub** — 15+ events with registration, saving, and verification badges
- **Opportunity Hunter** — Internships, scholarships, hackathons, research programs with match scores
- **Branch Connect** — Explore each branch's announcements, events, and students with inter-branch collaboration
- **Student Posts** — Create posts with AI auto-categorization (category, branch, tags)
- **Verified Information System** — Official GMU, Branch Verified, and Student Shared badges
- **Notifications** — Real-time notification center with mark-as-read
- **Profile** — Editable profile with skills, interests, projects, and achievements that affect recommendations
- **Organizer Mode** — Create events and announcements with Branch Verified status
- **Admin Dashboard** — University-wide statistics, popular skills, inter-branch connections, and event analytics

### AI Capabilities
1. **AI Q&A** — Ask questions about GMU events, opportunities, and more
2. **Smart Information Search** — Natural language search across all content types
3. **Student Assistance** — Personalized recommendations and guidance
4. **Skill Matching** — Match students based on complementary skills
5. **Team Building** — AI-powered team builder with compatibility scores
6. **Opportunity Recommendations** — Match opportunities to student profiles
7. **Event Recommendations** — Personalized event suggestions
8. **Information Categorization** — Auto-categorize posts by content analysis

## Tech Stack
- **React 18** + **TypeScript**
- **Vite** — Build tool and dev server
- **Tailwind CSS** — Styling
- **Lucide React** — Icons
- **LocalStorage** — Data persistence (no backend required)

## Setup Instructions

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Demo Login

**Continue as Demo User** — Click the "Continue as Demo User" button on the login page for instant access.

**Or use a mock account:**
- USN: `1GM24CS001` · Password: `password123` (Rahul Sharma, CSE)
- USN: `1GM24EC015` · Password: `password123` (Ananya Reddy, ECE)
- USN: `1GM23ME023` · Password: `password123` (Aarav Patel, Mechanical)

All 20 mock students use the password `password123`.

## Demo Data
- **20 students** across 8 branches with unique skills, interests, and projects
- **15 events** across 9 categories
- **10 opportunities** (internships, scholarships, hackathons, research, startups, certifications)
- **8 branches** with announcements and events
- **5+ student posts** with cross-branch collaboration requests

## AI Functionality

The AI layer operates without external API calls, using predefined intents, keyword matching, and scoring algorithms:

- **Match Scoring** — Skills, interests, branch, and year are weighted to produce percentage match scores
- **Team Builder** — Analyzes natural language requests to identify needed roles, then finds best-fit students
- **Recommendations** — Event and opportunity recommendations adapt to the logged-in student's profile
- **Auto-Categorization** — Post content is analyzed for category, branch, and topic tags

## Future Improvements
- Real backend with Supabase authentication and database
- Real AI API integration (OpenAI/Gemini) for natural language processing
- Real-time messaging between connected students
- File uploads for project portfolios
- Push notifications
- Mobile app (React Native)
