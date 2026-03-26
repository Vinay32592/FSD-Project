
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Guide from './pages/Guide';
import { User, Roadmap } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from the ship's log (localStorage)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('pirate_user');
      const savedRoadmaps = localStorage.getItem('pirate_roadmaps');
      
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      if (savedRoadmaps) {
        setRoadmaps(JSON.parse(savedRoadmaps));
      }
    } catch (e) {
      console.error("Failed to load logs from storage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        if (user) {
          localStorage.setItem('pirate_user', JSON.stringify(user));
        } else {
          localStorage.removeItem('pirate_user');
        }
        localStorage.setItem('pirate_roadmaps', JSON.stringify(roadmaps));
      } catch (e) {
        console.error("Failed to save logs to storage", e);
      }
    }
  }, [user, roadmaps, isLoaded]);

  const navigate = useCallback((page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogin = (name: string, email?: string) => {
    // Default avatar now resembles the provided 'Cute Jack Sparrow' seed
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      name: name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@tortuga.sea`,
      role: 'Captain',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=JackCustom${name}&backgroundColor=b6e3f4&hair=long01&eyes=variant04&mouth=variant01&baseColor=e0a483`,
      signature: "Master of the Misty Code and Navigator of the React Seas"
    };
    setUser(newUser);
    navigate('dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleLogout = useCallback(() => {
    // Clear storage keys
    localStorage.removeItem('pirate_user');
    localStorage.removeItem('pirate_roadmaps');
    
    // Reset state
    setUser(null);
    setRoadmaps([]);
    
    // Force immediate navigation to home
    navigate('home');
  }, [navigate]);

  if (!isLoaded) return null;

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'guide':
        return <Guide onNavigate={navigate} />;
      case 'login':
        return <Login mode="login" onLogin={handleLogin} onNavigate={navigate} />;
      case 'signup':
        return <Login mode="signup" onLogin={handleLogin} onNavigate={navigate} />; 
      case 'dashboard':
        return user ? (
          <Dashboard 
            roadmaps={roadmaps} 
            setRoadmaps={setRoadmaps} 
          />
        ) : <Login mode="login" onLogin={handleLogin} onNavigate={navigate} />;
      case 'profile':
        return user ? (
          <Profile 
            user={user} 
            onUpdateUser={handleUpdateUser} 
            roadmapsCount={roadmaps.length}
            completedRoadmapsCount={roadmaps.filter(r => r.status === 'Completed').length}
            onViewRoadmaps={() => navigate('dashboard')}
          />
        ) : <Login mode="login" onLogin={handleLogin} onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <Layout>
      <Navbar user={user} onNavigate={navigate} onLogout={handleLogout} />
      <main className="flex-grow flex flex-col relative z-10">
        {renderPage()}
      </main>
      <footer className="p-4 bg-black/60 border-t border-yellow-900/20 text-center text-xs text-yellow-900 font-medieval tracking-widest uppercase backdrop-blur-sm">
        &copy; {new Date().getFullYear()} The Black Pearl Digital Academy • Persisted in Browser Log
      </footer>
    </Layout>
  );
};

export default App;
