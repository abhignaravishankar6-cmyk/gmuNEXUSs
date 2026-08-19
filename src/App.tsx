import { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Layout, type PageId } from '@/components/Layout';
import { AuthScreen } from '@/components/AuthScreen';
import { CreatePostModal } from '@/components/CreatePostModal';
import { HomePage } from '@/pages/HomePage';
import { DiscoverPage } from '@/pages/DiscoverPage';
import { ConnectPage } from '@/pages/ConnectPage';
import { EventsPage } from '@/pages/EventsPage';
import { OpportunitiesPage } from '@/pages/OpportunitiesPage';
import { BranchesPage } from '@/pages/BranchesPage';
import { AssistantPage } from '@/pages/AssistantPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { OrganizerPage } from '@/pages/OrganizerPage';
import { AdminPage } from '@/pages/AdminPage';

function AppContent() {
  const { currentUser } = useApp();
  const [authMode, setAuthMode] = useState<'landing' | 'login' | 'signup'>('landing');
  const [page, setPage] = useState<PageId>('home');
  const [createPostOpen, setCreatePostOpen] = useState(false);

  if (!currentUser) {
    return <AuthScreen mode={authMode} onModeChange={setAuthMode} />;
  }

  return (
    <>
      <Layout currentPage={page} onNavigate={setPage} onCreatePost={() => setCreatePostOpen(true)}>
        {page === 'home' && <HomePage onNavigate={setPage} />}
        {page === 'discover' && <DiscoverPage />}
        {page === 'connect' && <ConnectPage />}
        {page === 'events' && <EventsPage />}
        {page === 'opportunities' && <OpportunitiesPage />}
        {page === 'branches' && <BranchesPage />}
        {page === 'assistant' && <AssistantPage />}
        {page === 'profile' && <ProfilePage />}
        {page === 'organizer' && <OrganizerPage />}
        {page === 'admin' && <AdminPage />}
      </Layout>
      <CreatePostModal open={createPostOpen} onClose={() => setCreatePostOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
