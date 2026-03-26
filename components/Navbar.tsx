
import React from 'react';

interface NavbarProps {
  user: any;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onNavigate, onLogout }) => {
  return (
    <nav className="p-4 bg-black/40 backdrop-blur-md border-b border-yellow-700/30 flex justify-between items-center sticky top-0 z-50">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => onNavigate('home')}
      >
        <div className="text-3xl rotate-[-10deg] group-hover:rotate-0 transition-transform">🧭</div>
        <h1 className="text-2xl font-pirate text-yellow-500 tracking-wider">Captain's Quest</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          type="button"
          onClick={() => onNavigate('guide')}
          className="hover:text-yellow-400 transition-colors font-medieval text-sm"
        >
          The Guide 📖
        </button>
        {user ? (
          <>
            <button 
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="hidden md:block hover:text-yellow-400 transition-colors font-medieval"
            >
              My Map 🗺️
            </button>
            <button 
              type="button"
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 p-1 px-3 bg-yellow-700/20 border border-yellow-700/50 rounded-full hover:bg-yellow-700/40 transition-all group"
            >
              <span className="text-sm font-semibold group-hover:text-yellow-400 transition-colors">{user.name}</span>
              <img src={user.avatar} className="w-8 h-8 rounded-full border border-yellow-500 shadow-sm transition-transform group-hover:scale-110" alt="avatar" />
            </button>
            <button 
              type="button"
              onClick={onLogout}
              className="text-red-400 hover:text-red-300 text-sm font-semibold flex items-center gap-1 transition-all hover:scale-105 active:scale-95 group ml-2"
            >
              <span className="group-hover:translate-x-[-2px] transition-transform">Desert Ship</span>
              <span className="text-lg">⚓</span>
            </button>
          </>
        ) : (
          <div className="flex gap-4">
            <button type="button" onClick={() => onNavigate('login')} className="hover:text-yellow-500 font-semibold transition-colors">Login</button>
            <button 
              type="button"
              onClick={() => onNavigate('signup')} 
              className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-1 px-4 rounded-md transition-all shadow-lg active:scale-95"
            >
              Enlist Now!
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
