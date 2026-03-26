
import React, { useState, useMemo } from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Generate some random positions for the floating motes
  const motes = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 15}s`,
      size: `${Math.random() * 4 + 2}px`,
      opacity: Math.random() * 0.5 + 0.2
    }));
  }, []);

  return (
    <div className={`min-h-screen relative flex flex-col overflow-hidden transition-colors duration-700 ${theme === 'light' ? 'light-theme' : ''}`}>
      <style>{`
        .light-theme {
          background-color: #f0f9ff;
          color: #1e293b;
        }
        .light-theme .bg-\\[#1a2c3d\\]\\/90, 
        .light-theme .bg-\\[#1a2c3d\\]\\/80,
        .light-theme .bg-\\[#1a2c3d\\]\\/40,
        .light-theme .bg-black\\/40,
        .light-theme .bg-black\\/20 {
          background-color: rgba(252, 245, 229, 0.95) !important;
          backdrop-blur: 8px;
          border-color: rgba(120, 53, 15, 0.2) !important;
          color: #2d1b0d !important;
        }
        .light-theme .text-yellow-500, .light-theme .text-yellow-600 { color: #854d0e !important; }
        .light-theme .text-gray-300, .light-theme .text-gray-400 { color: #475569 !important; }
      `}</style>

      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0b1a2a] transition-colors duration-1000">
        <div className={`absolute inset-0 transition-opacity duration-1000 ${theme === 'dark' ? 'bg-gradient-to-b from-blue-900/40 via-blue-900/20 to-black/60 opacity-100' : 'bg-gradient-to-b from-sky-300 via-sky-100 to-yellow-50 opacity-100'}`}></div>
        
        {/* Ambient Particles */}
        {theme === 'dark' && motes.map((m, i) => (
          <div key={i} className="mote" style={{ left: m.left, bottom: '-20px', width: m.size, height: m.size, animationDelay: m.animationDelay, opacity: m.opacity }} />
        ))}

        {/* Floating Ship */}
        <div className={`absolute top-1/4 left-10 md:left-20 text-6xl md:text-8xl transition-opacity duration-1000 float-animation pointer-events-none ${theme === 'dark' ? 'opacity-30' : 'opacity-60'}`}>
          🚢
        </div>
        
        {/* Waves Layers */}
        <div className={`waves transition-all duration-700 ${theme === 'dark' ? 'opacity-40' : 'opacity-70 brightness-150 saturate-150'}`}></div>
        <div className={`waves transition-all duration-700 ${theme === 'dark' ? 'opacity-20' : 'opacity-30 brightness-125'}`} style={{ bottom: '8px', animationDuration: '18s', animationDirection: 'reverse' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-grow flex flex-col">
        {children}
      </div>
      
      {/* Compass Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-yellow-600/90 hover:bg-yellow-500 rounded-full border-4 border-yellow-800 shadow-2xl flex items-center justify-center text-2xl transition-all duration-500 hover:rotate-[360deg] active:scale-90 group treasure-glow"
      >
        <span className="group-hover:scale-110 transition-transform">{theme === 'dark' ? '☀️' : '🌙'}</span>
        <div className="absolute inset-0 border-2 border-dashed border-black/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
      </button>

      {/* Ambient Emojis */}
      <div className="fixed bottom-32 right-12 text-4xl opacity-40 animate-bounce pointer-events-none hidden lg:block">🏴‍☠️</div>
      <div className="fixed bottom-20 left-12 text-4xl opacity-40 animate-pulse pointer-events-none hidden lg:block">🦜</div>
    </div>
  );
};

export default Layout;
