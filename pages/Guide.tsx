
import React from 'react';

const Guide: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const guideSteps = [
    {
      title: "1. Join the Crew",
      icon: "📜",
      description: "Sign your name in the articles. This secures your spot on the Black Pearl and saves your progress in the ship's log.",
      animation: "hover:rotate-2"
    },
    {
      title: "2. Plot Your Course",
      icon: "🧭",
      description: "Tell the AI Navigator your goal. Whether it's 'Mastering Python' or 'Building a Ship', we'll chart the steps.",
      animation: "hover:-rotate-2"
    },
    {
      title: "3. Conquer Milestones",
      icon: "⚔️",
      description: "Check off milestones as you achieve them. Your ship sails closer to Treasure Island with every task secured.",
      animation: "hover:scale-105"
    },
    {
      title: "4. Consult the Parrot",
      icon: "🦜",
      description: "Click the floating parrot for voice guidance. Speak your mind, and the Oracle will help refine your strategy.",
      animation: "hover:-translate-y-2 hover:rotate-1"
    },
    {
      title: "5. Claim the Gold",
      icon: "💰",
      description: "Complete all steps to finish your voyage. Your accomplishments are recorded forever in your Captain's Profile.",
      animation: "hover:rotate-3"
    }
  ];

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-16 pb-24 relative">
      {/* Decorative Title Section */}
      <div className="text-center space-y-6 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-8xl opacity-10 blur-sm select-none">🏴‍☠️</div>
        <h2 className="text-6xl md:text-8xl font-pirate text-yellow-500 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-10 duration-1000">Captain's Codex</h2>
        <p className="text-xl md:text-2xl font-medieval text-yellow-700/80 max-w-2xl mx-auto uppercase tracking-widest italic">
          Master the AI Navigator & Conquer Your Goals
        </p>
      </div>

      {/* Simplified Step Path */}
      <div className="relative space-y-12 md:space-y-0 md:flex md:flex-wrap md:justify-center md:gap-8">
        {/* Visual Path for Desktop */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 border-t-4 border-dashed border-yellow-900/20 -translate-y-1/2 -z-10"></div>

        {guideSteps.map((step, idx) => (
          <div 
            key={idx} 
            className={`md:w-[30%] bg-[#1a2c3d]/90 border-2 border-yellow-700/30 p-8 rounded-[2rem] pirate-card-tilt group animate-unroll shadow-2xl relative transition-all duration-500 hover:border-yellow-500/50 ${step.animation}`}
            style={{ animationDelay: `${idx * 0.15}s` }}
          >
            {/* Step Number Badge */}
            <div className="absolute -top-5 -left-5 w-12 h-12 bg-yellow-600 text-black font-pirate text-2xl flex items-center justify-center rounded-full border-4 border-[#0b1a2a] shadow-lg group-hover:scale-110 group-hover:bg-yellow-400 transition-all">
              {idx + 1}
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`text-7xl transition-all duration-500 drop-shadow-md cursor-default group-hover:scale-125 group-hover:rotate-12 ${step.icon === '🦜' ? 'animate-[float_3s_ease-in-out_infinite]' : ''}`}>
                {step.icon}
              </div>
              <h3 className="text-3xl font-pirate text-yellow-500 tracking-wide">{step.title}</h3>
              <p className="text-sm font-medieval text-gray-400 leading-relaxed opacity-90">
                {step.description}
              </p>
            </div>

            {/* Subtle Texture/Emoji Overlay */}
            <div className="absolute bottom-4 right-4 text-xl opacity-0 group-hover:opacity-20 transition-opacity">⚓</div>
          </div>
        ))}
      </div>

      {/* Call to Action Final Step */}
      <div className="bg-yellow-900/10 border-4 border-dashed border-yellow-600/20 p-12 rounded-[4rem] text-center space-y-10 mt-16 animate-in slide-in-from-bottom-10 duration-1000 hover:bg-yellow-900/20 transition-colors group relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none"></div>
        <div className="text-8xl mb-4 group-hover:animate-bounce transition-transform inline-block">🏝️</div>
        <div className="space-y-4">
          <h3 className="text-5xl font-pirate text-yellow-500 treasure-glow">The Treasure is Yours for the Taking!</h3>
          <p className="text-xl font-medieval text-gray-500 max-w-2xl mx-auto italic">
            "Not all treasure is silver and gold, mate. Some is the legacy ye leave behind with yer completed maps."
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
          <button 
            onClick={() => onNavigate('signup')}
            className="px-16 py-6 bg-yellow-600 hover:bg-yellow-500 text-black text-3xl font-pirate tracking-widest rounded-2xl transition-all shadow-2xl hover:scale-110 active:scale-95 hover-shine border-b-4 border-yellow-800"
          >
            JOIN THE CREW ⚔️
          </button>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="px-16 py-6 border-2 border-yellow-600 text-yellow-500 text-3xl font-pirate tracking-widest rounded-2xl hover:bg-yellow-600/10 transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            MY MAP 🗺️
          </button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-yellow-900/40 animate-pulse pointer-events-none group">
        <span className="text-[10px] font-medieval uppercase tracking-[0.8em] mb-3 group-hover:text-yellow-600 transition-colors">Steady As She Goes</span>
        <div className="w-0.5 h-16 bg-gradient-to-b from-yellow-900/20 via-yellow-700/50 to-transparent rounded-full"></div>
      </div>

      {/* Small floating ship on the guide page specifically */}
      <div className="absolute top-20 right-10 text-4xl animate-[float_6s_ease-in-out_infinite] opacity-30 select-none pointer-events-none">⛵</div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default Guide;
