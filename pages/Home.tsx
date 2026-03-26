
import React from 'react';

const Home: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center p-6 bg-transparent">
      <div className="max-w-4xl space-y-12">
        <div className="relative inline-block animate-in zoom-in duration-1000">
           <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
           <div className="relative p-6 bg-yellow-600/10 border border-yellow-600/30 rounded-full hover:scale-110 transition-transform duration-500">
             <span className="text-8xl block hover-wobble cursor-default">🧑‍✈️</span>
           </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-7xl md:text-9xl font-pirate text-yellow-500 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)] animate-in slide-in-from-top-16 duration-1000 treasure-glow">
            Your Goal Treasure Awaits!
          </h2>
          <p className="text-2xl md:text-3xl font-medieval text-gray-300 leading-relaxed max-w-2xl mx-auto animate-in fade-in duration-1000 delay-500 opacity-80">
            Chart a path through the misty seas of your future with our AI navigator.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 animate-in slide-in-from-bottom-12 duration-1000 delay-700">
          <button 
            onClick={() => onNavigate('signup')}
            className="px-14 py-6 bg-yellow-600 hover:bg-yellow-500 text-black text-3xl font-pirate tracking-widest rounded-2xl transform transition-all duration-300 shadow-[0_15px_45px_rgba(202,138,4,0.4)] hover:scale-110 hover:-rotate-2 active:scale-95 hover-shine"
          >
            START QUEST ⚔️
          </button>
          <button 
            onClick={() => onNavigate('guide')}
            className="px-14 py-6 border-2 border-yellow-600 text-yellow-500 text-3xl font-pirate tracking-widest rounded-2xl hover:bg-yellow-600/10 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl"
          >
            THE GUIDE 📖
          </button>
        </div>
        
        <div className="pt-20 grid grid-cols-3 gap-8 md:gap-16 text-gray-500 animate-in fade-in duration-1000 delay-1000">
          {[
            { icon: '💎', label: 'Pick Goals' },
            { icon: '⚔️', label: 'Conquer Steps' },
            { icon: '🏝️', label: 'Claim Victory' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center group cursor-default">
              <span className="text-5xl mb-3 transition-all duration-500 group-hover:scale-150 group-hover:-translate-y-4 group-hover:rotate-12 treasure-glow">{item.icon}</span>
              <p className="text-xs font-medieval uppercase tracking-[0.3em] group-hover:text-yellow-600 transition-colors">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
