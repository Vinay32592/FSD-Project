
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  roadmapsCount: number;
  completedRoadmapsCount: number;
  onViewRoadmaps: () => void;
}

const AVATARS = [
  { 
    id: 'jack-sparrow-legendary', 
    name: 'Captain Jack 🦜', 
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=JackCustom&backgroundColor=b6e3f4&hair=long01&eyes=variant04&mouth=variant01&baseColor=e0a483', 
    legendary: true,
    bio: "The legendary trickster of the seven seas."
  },
  { 
    id: 'davy-jones-legendary', 
    name: 'Davy Jones 🐙', 
    url: 'https://api.dicebear.com/7.x/miniavs/svg?seed=DavyCustom&backgroundColor=0b1a2a', 
    legendary: true,
    bio: "Ruler of the depths and collector of souls."
  },
  { id: 'elizabeth-swann', name: 'Governor Lizzie 👑', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Elizabeth&backgroundColor=c0aede&hair=long05&eyes=variant10&mouth=variant05' },
  { id: 'will-turner', name: 'Blacksmith Will ⚔️', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Will&backgroundColor=d1d4f9&hair=short05&eyes=variant01&mouth=variant02' },
  { id: 'hector-barbossa', name: 'Hector Barbossa 🍎', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Barbossa&backgroundColor=ffd5dc&hair=short01&eyes=variant02&mouth=variant03' },
  { id: 'tia-dalma', name: 'Tia Dalma 🔮', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tia&backgroundColor=ffdfbf&hair=long01&eyes=surprised' },
  { id: 'joshamee-gibbs', name: 'Old Man Gibbs 🍺', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Gibbs&backgroundColor=f1f4f9&hair=short01&eyes=variant05' },
  { id: 'james-norrington', name: 'James Norrington ⚓', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=James&backgroundColor=c0aede&hair=short01&eyes=variant01' },
];

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, roadmapsCount, completedRoadmapsCount, onViewRoadmaps }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('BOUNTY SECURED!');

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSave = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
    setSuccessMessage('BOUNTY SECURED!');
    setShowSuccess(true);
  };

  const selectAvatar = (url: string) => {
    setEditedUser({ ...editedUser, avatar: url });
    setShowAvatarSelector(false);
    setSuccessMessage('NEW RECRUIT FOUND!');
    setShowSuccess(true);
  };

  const isLegendary = AVATARS.find(a => a.url === user.avatar)?.legendary;

  return (
    <div className="p-4 md:p-10 max-w-5xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative pb-32">
      {/* Save Success Banner */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] bg-yellow-600 text-black px-8 py-3 rounded-full font-pirate text-xl shadow-2xl animate-in slide-in-from-top-12 duration-500 border-2 border-yellow-800 flex items-center gap-3">
          <span>📜</span> {successMessage} <span>⚓</span>
        </div>
      )}

      <div className="bg-[#1a2c3d]/90 backdrop-blur-xl border-2 border-yellow-700/50 p-6 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden transition-all duration-500 hover:shadow-yellow-900/20 group">
        <div className="absolute top-0 right-0 p-4 opacity-5 text-[150px] rotate-12 pointer-events-none group-hover:opacity-10 group-hover:rotate-45 group-hover:scale-125 transition-all duration-1000">🏴‍☠️</div>
        
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
          <div 
            className={`relative group/avatar transition-all duration-500 ${isEditing ? 'cursor-pointer hover:scale-110' : ''}`} 
            onClick={() => isEditing && setShowAvatarSelector(true)}
          >
            {/* Main Avatar Display */}
            <div className={`w-48 h-48 rounded-full border-4 overflow-hidden transition-all duration-700 relative
              ${isEditing ? 'border-yellow-400 ring-8 ring-yellow-400/10' : 'border-yellow-600 shadow-2xl bg-slate-800'}
              ${isLegendary ? 'treasure-glow shadow-[0_0_30px_rgba(234,179,8,0.5)]' : ''}`}>
              <img 
                src={editedUser.avatar} 
                alt="captain profile" 
                className={`w-full h-full object-cover transition-all duration-700 ${showSuccess ? 'scale-110 rotate-6' : 'scale-100'}`}
              />
              {isLegendary && !isEditing && (
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-yellow-600/20 to-transparent pointer-events-none"></div>
              )}
            </div>

            {/* Interaction Overlays */}
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
                <span className="text-yellow-400 font-pirate text-xl text-center px-4 animate-pulse">Pick Your Recruit 🏴‍☠️</span>
              </div>
            )}
            
            {/* Rank Badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-600 text-black text-sm px-6 py-1.5 rounded-full shadow-xl font-pirate border-2 border-yellow-800 whitespace-nowrap transition-all duration-500 group-hover/avatar:scale-110">
              {isLegendary ? 'LEGENDARY CAPTAIN' : user.role}
            </div>
          </div>

          <div className="flex-grow space-y-6 w-full">
            <div className="space-y-2 w-full">
              {isEditing ? (
                <div className="space-y-1">
                  <p className="text-yellow-600 text-[10px] font-medieval uppercase tracking-[0.3em]">Captain's Alias</p>
                  <input 
                    className="text-4xl font-pirate text-yellow-500 bg-black/40 border-b-2 border-yellow-500 w-full outline-none px-2 py-1 focus:bg-black/60 transition-all rounded-t-lg"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <h2 className="text-4xl md:text-5xl font-pirate text-yellow-500 hover:text-yellow-400 transition-colors cursor-default">
                    {user.name}
                  </h2>
                  {isLegendary && <span className="text-3xl animate-bounce">👑</span>}
                </div>
              )}
              
              {!isEditing && (
                <p className="text-gray-400 font-medieval flex items-center gap-2 hover:text-yellow-600 transition-colors cursor-default">
                  <span className="text-yellow-700">📜</span> {user.email}
                </p>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={onViewRoadmaps} className="bg-black/40 hover:bg-black/60 p-4 rounded-2xl border border-yellow-900/30 text-center group/stat transition-all duration-300 hover:scale-105 hover:border-yellow-600/50">
                <p className="text-yellow-700 text-[10px] font-medieval uppercase mb-1 tracking-widest group-hover/stat:text-yellow-500 transition-colors">Saved Roadmaps</p>
                <p className="text-2xl font-pirate text-yellow-400 group-hover/stat:scale-125 transition-transform">{roadmapsCount} 🗺️</p>
              </button>
              <div className="bg-black/40 p-4 rounded-2xl border border-yellow-900/30 text-center hover:scale-105 transition-transform duration-300">
                <p className="text-yellow-700 text-[10px] font-medieval uppercase mb-1 tracking-widest">Maps Completed</p>
                <p className="text-2xl font-pirate text-yellow-400">{completedRoadmapsCount} 🏆</p>
              </div>
            </div>

            {/* Signature Area */}
            <div className="pt-4 border-t border-yellow-900/20">
              <div className={`p-6 rounded-2xl border border-dashed border-yellow-900/40 relative group/sig transition-all duration-500 ${isEditing ? 'bg-black/40 border-yellow-500' : 'bg-black/20'}`}>
                 <div className="absolute -top-3 -left-3 text-2xl rotate-[-15deg] group-hover/sig:rotate-0 transition-transform">🖋️</div>
                 <h3 className="text-yellow-600 text-[10px] font-medieval uppercase mb-2 tracking-widest">Captain's Signature Skill</h3>
                 {isEditing ? (
                   <input 
                     className="w-full font-pirate text-2xl text-yellow-100 bg-transparent border-b border-yellow-500/30 outline-none py-1 focus:border-yellow-400 transition-all"
                     value={editedUser.signature || ''}
                     onChange={(e) => setEditedUser({ ...editedUser, signature: e.target.value })}
                     placeholder="e.g. Master of the Misty Code..."
                   />
                 ) : (
                   <p className="font-pirate text-2xl text-yellow-100 italic opacity-80 group-hover/sig:opacity-100 transition-opacity">
                      "{user.signature || "A silent navigator of the seven seas..."}"
                   </p>
                 )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="flex-grow bg-green-600 hover:bg-green-500 text-white font-pirate text-xl py-3 px-8 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 hover-shine"><span>⚓</span> SAVE CHANGES</button>
                  <button onClick={() => { setIsEditing(false); setEditedUser({ ...user }); }} className="bg-red-900/40 hover:bg-red-900/60 text-red-200 font-pirate text-xl py-3 px-8 rounded-xl border border-red-700/30 transition-all">CANCEL</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-pirate text-2xl py-3 px-8 rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 hover-shine"><span>🧑‍✈️</span> EDIT CAPTAIN PROFILE</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Recruitment Modal */}
      {showAvatarSelector && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0b1a2a] border-4 border-yellow-600 p-8 rounded-[3rem] max-w-5xl w-full relative animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <h2 className="text-4xl font-pirate text-yellow-500 text-center mb-10 tracking-widest">LEGENDARY RECRUITMENT 🏴‍☠️</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
              {AVATARS.map((ava, idx) => (
                <button 
                  key={ava.id}
                  onClick={() => selectAvatar(ava.url)}
                  className="flex flex-col items-center gap-4 group outline-none animate-in slide-in-from-bottom-4 duration-500 relative"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Legendary Indicator */}
                  {ava.legendary && (
                    <div className="absolute -top-3 -right-3 z-30 flex flex-col items-end gap-1">
                      <span className="bg-yellow-500 text-black text-[9px] font-black px-3 py-1 rounded-full border-2 border-black animate-treasure-sparkle shadow-xl">LEGENDARY</span>
                    </div>
                  )}
                  
                  <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 bg-slate-800 shadow-2xl relative
                    ${editedUser.avatar === ava.url ? 'border-yellow-400 ring-4 ring-yellow-400/50 shadow-yellow-500/50 scale-105' : 'border-yellow-900/50 group-hover:border-yellow-400'}
                    ${ava.legendary ? 'treasure-glow' : ''}`}>
                    <img src={ava.url} alt={ava.name} className="w-full h-full object-cover" />
                    {ava.legendary && <div className="absolute inset-0 bg-yellow-400/10 mix-blend-overlay"></div>}
                  </div>
                  
                  <div className="text-center space-y-1">
                    <span className={`text-sm font-pirate transition-colors duration-300 block tracking-wider
                      ${editedUser.avatar === ava.url ? 'text-yellow-400 text-lg' : 'text-yellow-600 group-hover:text-yellow-400'}`}>
                      {ava.name}
                    </span>
                    {ava.legendary && <span className="text-[9px] font-medieval text-yellow-900/60 uppercase tracking-tighter block">Unique Speciality</span>}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <button 
                onClick={() => setShowAvatarSelector(false)} 
                className="text-gray-500 font-medieval hover:text-white transition-colors uppercase tracking-[0.4em] text-xs py-2 px-10 border border-transparent hover:border-yellow-900/30 rounded-full"
              >
                Close the recruitment log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
