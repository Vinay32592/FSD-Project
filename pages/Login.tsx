
import React, { useState } from 'react';

interface AuthProps {
  mode: 'login' | 'signup';
  onLogin: (name: string, email?: string) => void;
  onNavigate: (page: string) => void;
}

const Login: React.FC<AuthProps> = ({ mode, onLogin, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const isSignup = mode === 'signup';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name, email);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
      <div className="bg-[#1a2c3d]/90 backdrop-blur-xl border-2 border-yellow-700/50 p-10 rounded-3xl w-full max-w-md shadow-2xl relative group">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-6xl animate-bounce">
          {isSignup ? '📜' : '🗝️'}
        </div>
        
        <h2 className="text-4xl font-pirate text-yellow-500 text-center mb-2">
          {isSignup ? 'Enlist in the Crew' : 'Welcome, Captain!'}
        </h2>
        <p className="text-gray-400 font-medieval text-center mb-8 text-sm uppercase tracking-widest">
          {isSignup ? 'Sign the articles of the Pearl' : 'Enter your secret pirate code'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-xs font-medieval text-yellow-600 mb-1 uppercase tracking-widest">Captain's Alias</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jack Sparrow"
              className="w-full bg-black/40 border border-yellow-900/50 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-600 text-yellow-100 placeholder-yellow-900/50 transition-all"
            />
          </div>

          {isSignup && (
            <div className="space-y-1 animate-in slide-in-from-top-2">
              <label className="block text-xs font-medieval text-yellow-600 mb-1 uppercase tracking-widest">Message Raven (Email)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jack@tortuga.sea"
                className="w-full bg-black/40 border border-yellow-900/50 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-600 text-yellow-100 placeholder-yellow-900/50 transition-all"
              />
            </div>
          )}
          
          <div className="space-y-1">
            <label className="block text-xs font-medieval text-yellow-600 mb-1 uppercase tracking-widest">Secret Vault Key</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full bg-black/40 border border-yellow-900/50 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-600 text-yellow-100 placeholder-yellow-900/50 transition-all"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-pirate text-2xl py-4 rounded-xl transition-all shadow-xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 hover-shine"
          >
            {isSignup ? 'ENLIST NOW ⚓' : 'LOG IN 💰'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm border-t border-yellow-900/20 pt-6">
          <span className="text-gray-400 font-medieval uppercase tracking-wider">
            {isSignup ? "Already part of the crew?" : "New to these waters?"}
          </span>
          <button 
            onClick={() => onNavigate(isSignup ? 'login' : 'signup')}
            className="ml-2 text-yellow-500 hover:text-yellow-400 font-bold font-pirate text-xl transition-colors"
          >
            {isSignup ? 'LOG IN 🗝️' : 'SIGN UP 📜'}
          </button>
        </div>

        {/* Decorative corner */}
        <div className="absolute bottom-2 right-2 opacity-10 text-4xl pointer-events-none group-hover:rotate-12 transition-transform duration-500">⚓</div>
      </div>
    </div>
  );
};

export default Login;
