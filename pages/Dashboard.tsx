
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { generateRoadmapSteps, generateQuizForStep } from '../geminiService';
import { Roadmap, Step, QuizQuestion } from '../types';

// Audio Utilities for Live API (Manually implemented)
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

type SortOption = 'newest' | 'oldest' | 'alpha-asc' | 'alpha-desc';

interface DashboardProps {
  roadmaps: Roadmap[];
  setRoadmaps: React.Dispatch<React.SetStateAction<Roadmap[]>>;
}

const RoadmapFlowchart: React.FC<{ steps: Step[] }> = ({ steps }) => {
  return (
    <div className="w-full p-8 md:p-16 bg-[#fcf5e5] rounded-[4rem] border-8 border-double border-yellow-900/30 shadow-2xl relative overflow-visible animate-in fade-in zoom-in duration-1000 mt-12 mb-32">
      {/* Ancient Map Textures */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] rounded-[3.5rem]"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-yellow-900/5 to-transparent pointer-events-none rounded-[3.5rem]"></div>

      <h3 className="text-4xl font-pirate text-yellow-900 text-center mb-24 relative">
        <span className="absolute -left-12 top-1/2 -translate-y-1/2 text-2xl hidden lg:block">🧭</span>
        The Captain's Trajectory
        <span className="absolute -right-12 top-1/2 -translate-y-1/2 text-2xl rotate-180 hidden lg:block">🧭</span>
      </h3>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-32 md:gap-4 px-4 md:px-0 min-h-[220px]">
        {/* The Dotted Path Line - Robust Alignment */}
        <div className="hidden md:block absolute top-[60px] left-[10%] w-[80%] h-1 border-t-4 border-dashed border-yellow-900/40 z-0"></div>
        <div className="md:hidden absolute left-1/2 top-0 h-full w-1 border-l-4 border-dashed border-yellow-900/40 -translate-x-1/2 z-0"></div>

        {steps.map((step, idx) => (
          <div key={idx} className="relative z-10 flex flex-col items-center group flex-1">
            {/* Icon Anchor - Permanently visible and centered */}
            <div className="absolute -top-14 text-4xl transition-all duration-500 group-hover:scale-125 group-hover:-translate-y-2 pointer-events-none drop-shadow-lg">
              {step.completed ? '🏆' : (idx === 0 ? '⛵' : (idx === steps.length - 1 ? '🏝️' : '⚔️'))}
            </div>

            {/* Step Circle - Now strictly numeric (1-5) */}
            <div className={`w-16 h-16 rounded-full border-4 shadow-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 relative z-10
              ${step.completed ? 'bg-green-700 border-green-400 text-white shadow-green-900/50' : 'bg-yellow-900 border-yellow-600 text-yellow-400'}`}>
              <span className="font-pirate text-3xl">{idx + 1}</span>
            </div>
            
            {/* Step Title & Badge */}
            <div className="mt-8 text-center max-w-[200px] relative">
              <p className={`font-pirate text-xl md:text-2xl leading-tight transition-all duration-300 px-2 min-h-[3rem] flex items-center justify-center
                ${step.completed ? 'text-green-800 line-through opacity-60' : 'text-yellow-950 group-hover:text-yellow-700'}`}>
                {step.title}
              </p>
              
              {/* Enhanced Step Details */}
              <div className="mt-4 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                {/* Duration Badge */}
                <div className="bg-yellow-900/10 border border-yellow-900/20 rounded-full px-3 py-1">
                  <span className="text-xs font-medieval text-yellow-800 uppercase tracking-wider">
                    ⏱️ {step.duration}
                  </span>
                </div>
                
                {/* Description */}
                <div className="bg-black/5 border border-yellow-900/10 rounded-lg p-3 max-w-[180px]">
                  <p className="text-xs font-medieval text-yellow-900 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Milestone */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 max-w-[180px]">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs">🎯</span>
                    <span className="text-xs font-medieval font-bold text-green-800 uppercase tracking-wider">Milestone</span>
                  </div>
                  <p className="text-xs font-medieval text-green-700 leading-tight">
                    {step.milestone}
                  </p>
                </div>
                
                {/* Learning Process Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 max-w-[180px] mt-2">
                  <div className="text-xs font-medieval font-bold text-blue-800 uppercase tracking-wider mb-1">
                    📚 Learning Focus
                  </div>
                  <div className="space-y-1 text-xs text-blue-700">
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                      <span>Hands-on practice</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                      <span>Build real projects</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                      <span>Master key concepts</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Treasure Awaits Badge */}
              {idx === steps.length - 1 && (
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-max z-20 pointer-events-none">
                  <span className="text-[11px] font-medieval text-red-900 uppercase tracking-[0.25em] font-black bg-yellow-500/95 px-6 py-2 rounded-full border-2 border-red-900/40 shadow-2xl animate-treasure-sparkle whitespace-nowrap ring-4 ring-yellow-500/20">
                     TREASURE AWAITS
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Map Decorations */}
      <div className="absolute bottom-6 right-6 text-7xl opacity-10 rotate-12 pointer-events-none select-none transition-transform group-hover:rotate-45">⚓</div>
      <div className="absolute top-6 left-6 text-7xl opacity-10 -rotate-12 pointer-events-none select-none transition-transform group-hover:rotate-[-45deg]">🐚</div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ roadmaps, setRoadmaps }) => {
  const [goal, setGoal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [isListeningSTT, setIsListeningSTT] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const liveSessionRef = useRef<any>(null);
  const audioContextsRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  // Quiz state - Single final quiz for entire roadmap
  const [finalQuizData, setFinalQuizData] = useState<QuizQuestion[]>([]);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finalQuizScore, setFinalQuizScore] = useState(0);
  const [finalQuizTotal, setFinalQuizTotal] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState<{ [key: string]: boolean }>({});
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListeningSTT(true);
    recognition.onend = () => setIsListeningSTT(false);
    recognition.onresult = (e: any) => setGoal(prev => prev + e.results[0][0].transcript);
    recognition.start();
  };

  const startLiveAssistant = async () => {
    if (isLiveActive) { stopLiveAssistant(); return; }
    try {
      setIsLiveActive(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextsRef.current = { input: inputCtx, output: outputCtx };
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              sessionPromise.then(session => session.sendRealtimeInput({ media: createBlob(inputData) }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg) => {
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const buf = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const src = outputCtx.createBufferSource();
              src.buffer = buf;
              src.connect(outputCtx.destination);
              src.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buf.duration;
              sourcesRef.current.add(src);
            }
          }
        },
        config: { responseModalities: [Modality.AUDIO], systemInstruction: "You are the Captain of the Black Pearl. Help refine pirate goals." }
      });
      liveSessionRef.current = await sessionPromise;
    } catch (e) { setIsLiveActive(false); }
  };

  const stopLiveAssistant = () => {
    liveSessionRef.current?.close();
    audioContextsRef.current?.input.close();
    audioContextsRef.current?.output.close();
    setIsLiveActive(false);
  };

  const calculateProgress = (steps: Step[]) => {
    if (!steps || steps.length === 0) return 0;
    const completedCount = steps.filter(s => s.completed).length;
    return Math.round((completedCount / steps.length) * 100);
  };

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    try {
      const steps = await generateRoadmapSteps(goal);
      const newMap: Roadmap = {
        id: Math.random().toString(36).substring(7),
        goal,
        steps: steps.map(s => ({ ...s, completed: false })),
        createdAt: new Date().toLocaleDateString(),
        timestamp: Date.now(),
        status: 'In Progress'
      };
      setRoadmaps(prev => [newMap, ...prev]);
      setSelectedRoadmap(newMap);
      setGoal('');
    } catch (e) {
      console.error("Error generating roadmap:", e);
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      if (errorMessage.includes('API key not configured')) {
        alert('No API key configured - using sample roadmap. For AI-generated content, set GEMINI_API_KEY in .env.local file.');
      } else {
        alert(`Could not create roadmap. Please check your internet connection and try again. Error: ${errorMessage}`);
      }
    }
    finally { setLoading(false); }
  };

  const sortedAndFilteredRoadmaps = useMemo(() => {
    let filtered = roadmaps;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(rm => rm.goal.toLowerCase().includes(q));
    }
    return [...filtered].sort((a, b) => {
      if (sortOption === 'newest') return b.timestamp - a.timestamp;
      if (sortOption === 'oldest') return a.timestamp - b.timestamp;
      if (sortOption === 'alpha-asc') return a.goal.localeCompare(b.goal);
      if (sortOption === 'alpha-desc') return b.goal.localeCompare(a.goal);
      return 0;
    });
  }, [roadmaps, sortOption, searchQuery]);

  const toggleStep = (idx: number) => {
    if (!selectedRoadmap) return;
    const steps = selectedRoadmap.steps.map((s, i) => i === idx ? { ...s, completed: !s.completed } : s);
    const isCompleted = steps.every(s => s.completed);
    const updated = { ...selectedRoadmap, steps, status: isCompleted ? 'Completed' : 'In Progress' as any };
    setSelectedRoadmap(updated);
    setRoadmaps(prev => prev.map(r => r.id === updated.id ? updated : r));
    
    if (isCompleted && !selectedRoadmap.steps.every(s => s.completed)) {
      setShowCelebration(true);
    }
  };

  const handleNoteChange = (stepIdx: number, newNote: string) => {
    if (!selectedRoadmap) return;
    const steps = selectedRoadmap.steps.map((s, i) => i === stepIdx ? { ...s, notes: newNote } : s);
    const updated = { ...selectedRoadmap, steps };
    setSelectedRoadmap(updated);
    setRoadmaps(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const handleManualSave = async () => {
    if (!selectedRoadmap) return;
    if (!window.confirm("Do ye wish to stamp this map into the ship's logbook? 🖋️")) return;
    
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setRoadmaps(prev => prev.map(r => r.id === selectedRoadmap.id ? selectedRoadmap : r));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDeleteRoadmap = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const confirmed = window.confirm("Are ye sure ye want to scuttle this map? It'll be lost to the locker forever! 💣");
    if (confirmed) {
      setRoadmaps(prev => prev.filter(rm => rm.id !== id));
      if (selectedRoadmap?.id === id) {
        setSelectedRoadmap(null);
      }
    }
  };
  // Quiz functions - Single final quiz for entire roadmap
  const startFinalQuiz = async () => {
    if (!selectedRoadmap) return;

    setLoadingQuiz(true);
    setIsQuizActive(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowHint(false);
    setShowExplanation(false);
    setFinalQuizScore(0);

    try {
      const questions = await generateFinalQuizForRoadmap(selectedRoadmap.steps, selectedRoadmap.goal);
      setFinalQuizData(questions);
      setFinalQuizTotal(questions.length);
    } catch (error) {
      console.error("Failed to generate final quiz:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      if (errorMessage.includes('API key not configured')) {
        alert('No API key configured - using sample quiz questions. For AI-generated content, set GEMINI_API_KEY in .env.local file.');
      } else {
        alert("Could not generate quiz questions. Please try again.");
      }
      setIsQuizActive(false);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const closeQuiz = () => {
    setIsQuizActive(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowHint(false);
    setShowExplanation(false);
  };

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    if (finalQuizData[currentQuestionIndex]) {
      const currentQuestion = finalQuizData[currentQuestionIndex];
      if (answerIndex === currentQuestion.correctAnswer) {
        setFinalQuizScore(prev => prev + 1);
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < finalQuizData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowHint(false);
      setShowExplanation(false);
    } else {
      // Final quiz completed
      setQuizCompleted(prev => ({ ...prev, 'final': true }));
      setTimeout(() => closeQuiz(), 2000);
    }
  };

  const toggleHint = () => {
    setShowHint(prev => !prev);
  };
  const handleClaimBooty = () => {
    setShowCelebration(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-12">
      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] bg-yellow-600 text-black px-8 py-3 rounded-full font-pirate text-xl shadow-2xl animate-in slide-in-from-top-12 duration-500 border-2 border-yellow-800 flex items-center gap-3">
          <span>📜</span> BOUNTY RECORDED IN LOG! <span>⚓</span>
        </div>
      )}

      {/* Booty Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
           <div className="bg-[#1a2c3d] border-4 border-yellow-500 p-10 rounded-[3rem] text-center space-y-8 max-w-lg shadow-[0_0_100px_rgba(234,179,8,0.4)] animate-in zoom-in duration-500 relative overflow-hidden">
              <div className="absolute -top-10 -left-10 text-9xl opacity-10 rotate-[-20deg]">💰</div>
              <div className="absolute -bottom-10 -right-10 text-9xl opacity-10 rotate-[20deg]">🏝️</div>
              
              <span className="text-8xl block animate-bounce">🏆</span>
              <h2 className="text-5xl font-pirate text-yellow-500">Voyage Complete!</h2>
              <p className="text-xl font-medieval text-gray-300">
                 The horizon is bright, Captain! Ye've conquered every milestone and the treasure is within yer grasp.
              </p>
              <button 
                onClick={handleClaimBooty}
                className="w-full py-5 bg-yellow-600 hover:bg-yellow-500 text-black text-3xl font-pirate tracking-widest rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95 hover-shine"
              >
                CLAIM THE VIRTUAL BOOTY 💰
              </button>
           </div>
        </div>
      )}

      {/* Floating Pirate Oracle */}
      <div className="fixed bottom-24 left-6 z-[100] print:hidden">
        <button 
          onClick={startLiveAssistant}
          className={`w-16 h-16 rounded-full border-4 shadow-2xl flex items-center justify-center text-4xl transition-all duration-500 hover:scale-110 active:scale-90 relative treasure-glow
            ${isLiveActive ? 'bg-red-600 border-red-400 animate-pulse' : 'bg-green-700/80 border-green-400'}`}
        >
          🦜
          {isLiveActive && <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-[10px] px-2 py-1 rounded-full text-white animate-bounce">LISTENING</span>}
        </button>
      </div>

      {/* Jump to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 right-6 z-[100] w-14 h-14 bg-yellow-600/90 hover:bg-yellow-500 text-black border-4 border-yellow-800 rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center text-2xl hover:scale-110 active:scale-95 group print:hidden
          ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}`}
        title="Return to Harbor"
      >
        <span className="group-hover:-translate-y-1 transition-transform">⚓</span>
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-[10px] text-yellow-500 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medieval tracking-widest uppercase">To Harbor</div>
      </button>

      {/* Input Section */}
      <div className="bg-yellow-900/10 p-6 md:p-10 rounded-[2.5rem] border border-yellow-700/30 shadow-2xl relative overflow-hidden group hover:border-yellow-600/50 transition-all duration-500 print:hidden">
        <div className="absolute -top-12 -right-12 text-9xl opacity-[0.03] group-hover:rotate-12 transition-transform duration-700 pointer-events-none">⚓</div>
        <h2 className="text-3xl font-pirate text-yellow-500 mb-8 flex items-center gap-4 transition-transform group-hover:translate-x-1">
          <span className="text-4xl">📜</span> Plot Your Voyage
        </h2>
        <div className="flex flex-col md:flex-row gap-5 relative z-10">
          <div className="relative flex-grow">
            <input 
              ref={inputRef}
              type="text" 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Where shall we sail? (e.g. Master the Blade of React)"
              className="w-full bg-black/40 border-2 border-yellow-800/30 rounded-2xl py-5 pl-8 pr-16 focus:outline-none focus:border-yellow-500 text-xl font-medieval text-yellow-50 placeholder-yellow-900/40 transition-all shadow-inner"
            />
            <button 
              onClick={startVoiceInput}
              className={`absolute right-5 top-1/2 -translate-y-1/2 text-3xl transition-all ${isListeningSTT ? 'text-cyan-400 animate-pulse' : 'text-yellow-700 hover:text-yellow-500'}`}
            >
              🐚
            </button>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={loading || !goal.trim()}
            className="px-12 py-5 bg-yellow-600 hover:bg-yellow-500 text-black text-2xl font-pirate tracking-widest rounded-2xl transition-all shadow-xl hover:scale-105 hover-ship-roll active:scale-95 disabled:opacity-50 hover-shine"
          >
            {loading ? 'CHARTING...' : 'CHART PATH'}
          </button>
        </div>
      </div>

      {/* Roadmap View */}
      <div className="min-h-[400px]">
        {selectedRoadmap ? (
          <div className="space-y-16 animate-unroll">
            <div className="flex flex-col items-center text-center space-y-6">
              <button onClick={() => setSelectedRoadmap(null)} className="text-yellow-700 hover:text-yellow-500 font-medieval flex items-center gap-2 transition-all hover:translate-x-[-10px] print:hidden group">
                <span className="group-hover:opacity-100 opacity-70">⬅️</span> RETURN TO HARBOR
              </button>
              <h2 className="text-5xl md:text-7xl font-pirate text-yellow-500 drop-shadow-xl treasure-glow hover-ship-roll transition-all">{selectedRoadmap.goal}</h2>
              <div className="w-full max-w-lg">
                <div className="flex justify-between text-[10px] font-medieval text-yellow-800 uppercase mb-2 tracking-widest">
                  <span>Voyage Progress</span>
                  <span>{calculateProgress(selectedRoadmap.steps)}% towards the treasure</span>
                </div>
                <div className="h-6 bg-black/40 rounded-full border-2 border-yellow-900/50 overflow-visible shadow-inner relative">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out rounded-full animate-liquid shadow-[0_0_15px_rgba(251,191,36,0.6)] ${selectedRoadmap.status === 'Completed' ? 'bg-green-500 shadow-green-500/50' : 'bg-gradient-to-r from-yellow-900 via-yellow-400 to-yellow-600'}`} 
                    style={{ width: `${calculateProgress(selectedRoadmap.steps)}%` }}
                  >
                    {/* Moving Ship Indicator */}
                    <div 
                       className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-2xl drop-shadow-lg transition-transform hover:scale-125 cursor-default z-20 animate-ship-roll"
                       style={{ display: calculateProgress(selectedRoadmap.steps) > 0 ? 'block' : 'none' }}
                    >
                      {selectedRoadmap.status === 'Completed' ? '🏝️' : '⛵'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 [perspective:1000px]">
              {selectedRoadmap.steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className="relative group animate-unroll hover:z-30 hover-ship-roll" 
                  style={{ animationDelay: `${idx * 0.15}s` }}
                >
                  <div className={`p-8 rounded-xl border-t-8 border-yellow-900/40 relative shadow-2xl pirate-card-tilt h-full flex flex-col transition-all duration-500
                    ${step.completed ? 'bg-slate-800/50 opacity-60' : 'bg-[#fcf5e5] text-slate-900 group-hover:shadow-yellow-500/10'}`}
                  >
                    <div className="absolute -top-6 left-6 w-12 h-12 bg-yellow-900 text-yellow-400 rounded-full flex items-center justify-center font-pirate text-2xl shadow-lg border-4 border-[#fcf5e5] transition-transform group-hover:scale-110">
                      {step.completed ? '✓' : idx + 1}
                    </div>
                    <div className="pt-4 space-y-4 flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className={`text-2xl font-pirate ${step.completed ? 'line-through' : ''}`}>{step.title}</h4>
                        <span className="text-3xl group-hover:scale-125 transition-transform group-hover:rotate-[-20deg]">⚓</span>
                      </div>
                      <p className="font-medieval text-sm leading-relaxed opacity-80">{step.description}</p>
                      <p className="text-[10px] font-medieval text-yellow-800 uppercase font-bold bg-yellow-900/5 px-2 py-1 rounded inline-block transition-all group-hover:bg-yellow-500/20 group-hover:text-yellow-900 group-hover:shadow-lg animate-treasure-sparkle">Achievement: {step.milestone}</p>
                      
                      {/* Captain's Log (Private Notes) */}
                      <div className="mt-4 pt-4 border-t border-black/5 space-y-2">
                        <label className="text-[10px] font-medieval text-yellow-900/60 uppercase tracking-widest flex items-center gap-2 group-hover:text-yellow-700 transition-colors">
                          <span className="transition-transform group-hover:rotate-[-10deg]">🖋️</span> Captain's Log
                        </label>
                        <textarea 
                          value={step.notes || ''}
                          onChange={(e) => handleNoteChange(idx, e.target.value)}
                          placeholder="Scribble your secret observations..."
                          className={`w-full bg-black/5 border border-yellow-900/10 rounded-lg p-3 text-sm font-medieval focus:outline-none focus:border-yellow-600 focus:bg-white/40 transition-all resize-none min-h-[80px]
                            ${step.completed ? 'pointer-events-none opacity-40' : ''}`}
                        />
                      </div>

                      <div className="pt-6 border-t border-black/10 flex flex-col gap-3 text-[11px] font-bold uppercase mt-auto">
                        <div className="flex justify-between items-center">
                          <span className="bg-black/5 px-2 py-1 rounded transition-colors group-hover:bg-yellow-900/10">⏳ {step.duration}</span>
                          <button 
                            onClick={() => toggleStep(idx)}
                            className={`px-3 py-1 rounded-lg border font-medieval transition-all hover-shine print:hidden active:scale-90 text-xs
                              ${step.completed ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-900/10 text-yellow-900 border-yellow-900/20 hover:bg-yellow-900/20 hover:scale-105'}`}
                          >
                            {step.completed ? 'REOPEN' : 'SECURE'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Final Quiz Section */}
            <div className="mt-16 mb-8 text-center">
              <div className="inline-block bg-gradient-to-r from-yellow-900 via-yellow-800 to-yellow-900 p-8 rounded-3xl border-4 border-yellow-600 shadow-2xl">
                <div className="text-6xl mb-4 animate-bounce">🏆</div>
                <h3 className="text-3xl font-pirate text-yellow-100 mb-4 drop-shadow-lg">
                  Captain's Final Challenge
                </h3>
                <p className="text-yellow-200 font-medieval mb-6 max-w-md mx-auto">
                  Test your knowledge across all {selectedRoadmap.steps.length} steps of your journey!
                </p>
                <button
                  onClick={startFinalQuiz}
                  disabled={loadingQuiz}
                  className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black text-xl font-pirate tracking-wider rounded-2xl transition-all shadow-xl hover:scale-105 hover-ship-roll active:scale-95 disabled:opacity-50 border-4 border-yellow-600"
                >
                  {loadingQuiz ? '⏳ PREPARING CHALLENGE...' : '🧠 TAKE FINAL QUIZ'}
                </button>
                {quizCompleted['final'] && (
                  <div className="mt-4 text-green-300 font-medieval text-lg bg-green-900/30 px-4 py-2 rounded-xl border border-green-500/50">
                    🏆 Challenge Completed! Final Score: {finalQuizScore}/{finalQuizTotal}
                  </div>
                )}
              </div>
            </div>

            {/* Ancient Flowchart Map */}
            <RoadmapFlowchart steps={selectedRoadmap.steps} />

            {/* Quiz Modal */}
            {isQuizActive && finalQuizData.length > 0 && (
              <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                <div className="bg-gradient-to-br from-[#fcf5e5] via-[#fef8e7] to-[#fdf4e3] rounded-3xl border-8 border-double border-yellow-900/60 max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 relative">
                  {/* Decorative corners */}
                  <div className="absolute top-4 left-4 text-2xl opacity-20">🏴‍☠️</div>
                  <div className="absolute top-4 right-4 text-2xl opacity-20 rotate-90">🏴‍☠️</div>
                  <div className="absolute bottom-4 left-4 text-2xl opacity-20 -rotate-90">🏴‍☠️</div>
                  <div className="absolute bottom-4 right-4 text-2xl opacity-20 rotate-180">🏴‍☠️</div>

                  <div className="p-8 md:p-12 overflow-y-auto max-h-[95vh]">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl animate-bounce">🏆</div>
                        <div>
                          <h3 className="text-4xl font-pirate text-yellow-900 drop-shadow-lg">
                            Captain's Final Challenge
                          </h3>
                          <p className="text-lg font-medieval text-yellow-800">
                            Testing knowledge across your entire {selectedRoadmap?.goal} journey!
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={closeQuiz}
                        className="text-4xl hover:scale-125 transition-all duration-300 text-yellow-900 hover:text-red-600 hover:rotate-90 p-2 rounded-full hover:bg-red-50"
                      >
                        ✕
                      </button>
                    </div>

                    {finalQuizData[currentQuestionIndex] && (
                      <div className="space-y-8">
                        {/* Progress Section */}
                        <div className="text-center bg-yellow-900/10 p-6 rounded-2xl border-2 border-yellow-900/20">
                          <div className="text-xl font-medieval text-yellow-800 mb-4">
                            Question {currentQuestionIndex + 1} of {finalQuizData.length}
                          </div>
                          <div className="w-full bg-yellow-900/20 rounded-full h-4 border-2 border-yellow-900/30 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-yellow-600 to-yellow-500 h-full rounded-full transition-all duration-1000 shadow-lg relative"
                              style={{ width: `${((currentQuestionIndex + 1) / finalQuizData.length) * 100}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm font-medieval text-yellow-700">
                            {Math.round(((currentQuestionIndex + 1) / finalQuizData.length) * 100)}% Complete • Score: {finalQuizScore}/{currentQuestionIndex + (selectedAnswer !== null ? 1 : 0)}
                          </div>
                        </div>

                        {/* Question Section */}
                        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-8 rounded-2xl border-4 border-yellow-900/30 shadow-xl">
                          <div className="flex items-start gap-4 mb-6">
                            <div className="text-3xl">❓</div>
                            <h4 className="text-2xl font-pirate text-yellow-900 leading-relaxed flex-1">
                              {finalQuizData[currentQuestionIndex].question}
                            </h4>
                          </div>

                          <div className="grid gap-4">
                            {finalQuizData[currentQuestionIndex].options.map((option, optionIdx) => (
                              <button
                                key={optionIdx}
                                onClick={() => selectAnswer(optionIdx)}
                                disabled={selectedAnswer !== null}
                                className={`w-full text-left p-6 rounded-xl border-3 transition-all duration-300 font-medieval text-lg relative overflow-hidden group
                                  ${selectedAnswer === null
                                    ? 'border-yellow-900/30 hover:border-yellow-600 hover:bg-yellow-100 hover:scale-105 hover:shadow-lg bg-white'
                                    : selectedAnswer === optionIdx
                                      ? optionIdx === finalQuizData[currentQuestionIndex].correctAnswer
                                        ? 'border-green-500 bg-gradient-to-r from-green-100 to-green-50 text-green-800 shadow-lg scale-105 animate-pulse'
                                        : 'border-red-500 bg-gradient-to-r from-red-100 to-red-50 text-red-800 shadow-lg'
                                      : optionIdx === finalQuizData[currentQuestionIndex].correctAnswer
                                        ? 'border-green-500 bg-gradient-to-r from-green-100 to-green-50 text-green-800 shadow-lg scale-105'
                                        : 'border-gray-300 bg-gray-50 opacity-60'
                                  }`}
                              >
                                <div className="flex items-center gap-4">
                                  <span className={`font-bold text-xl px-3 py-1 rounded-full border-2 min-w-[40px] text-center transition-all
                                    ${selectedAnswer === null
                                      ? 'border-yellow-600 text-yellow-600 bg-yellow-50'
                                      : selectedAnswer === optionIdx
                                        ? optionIdx === finalQuizData[currentQuestionIndex].correctAnswer
                                          ? 'border-green-600 text-green-600 bg-green-100'
                                          : 'border-red-600 text-red-600 bg-red-100'
                                        : optionIdx === finalQuizData[currentQuestionIndex].correctAnswer
                                          ? 'border-green-600 text-green-600 bg-green-100'
                                          : 'border-gray-400 text-gray-400 bg-gray-100'
                                    }`}>
                                    {String.fromCharCode(65 + optionIdx)}
                                  </span>
                                  <span className="flex-1">{option}</span>
                                  {selectedAnswer !== null && optionIdx === finalQuizData[currentQuestionIndex].correctAnswer && (
                                    <span className="text-2xl animate-bounce">✅</span>
                                  )}
                                  {selectedAnswer !== null && selectedAnswer === optionIdx && optionIdx !== finalQuizData[currentQuestionIndex].correctAnswer && (
                                    <span className="text-2xl animate-bounce">❌</span>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>

                          {/* Hint Section */}
                          {showHint && (
                            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl animate-in slide-in-from-top-4 duration-500">
                              <div className="flex items-center gap-3 text-blue-800 font-medieval font-bold text-lg mb-3">
                                <span className="text-2xl animate-pulse">💡</span>
                                <span>Captain's Hint</span>
                              </div>
                              <p className="text-blue-700 text-base leading-relaxed font-medieval">
                                {finalQuizData[currentQuestionIndex].hint}
                              </p>
                            </div>
                          )}

                          {/* Explanation Section */}
                          {showExplanation && (
                            <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl animate-in slide-in-from-bottom-4 duration-500">
                              <div className="flex items-center gap-3 text-green-800 font-medieval font-bold text-lg mb-3">
                                <span className="text-2xl animate-bounce">✅</span>
                                <span>Ahoy! Here's Why</span>
                              </div>
                              <p className="text-green-700 text-base leading-relaxed font-medieval">
                                {finalQuizData[currentQuestionIndex].explanation}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                          <button
                            onClick={toggleHint}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-medieval font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
                          >
                            <span className="text-xl">{showHint ? '🙈' : '💡'}</span>
                            {showHint ? 'Hide Hint' : 'Show Hint'}
                          </button>

                          {showExplanation && (
                            <button
                              onClick={nextQuestion}
                              className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black rounded-xl font-pirate font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 animate-pulse"
                            >
                              <span className="text-xl">
                                {currentQuestionIndex < quizData[currentQuizStep].length - 1 ? '⏭️' : '🏆'}
                              </span>
                              {currentQuestionIndex < quizData[currentQuizStep].length - 1 ? 'Next Question' : 'Complete Quest!'}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Finalize/Save CTA Section */}
            <div className="max-w-3xl mx-auto p-12 bg-yellow-900/10 rounded-[3rem] border border-yellow-700/20 text-center space-y-8 relative overflow-hidden group print:hidden hover:bg-yellow-900/20 transition-all duration-500 animate-in slide-in-from-bottom-20 delay-500 pirate-card-tilt">
              <div className="absolute -left-10 -bottom-10 opacity-5 text-9xl group-hover:opacity-20 transition-all duration-700 group-hover:scale-125 group-hover:rotate-12">💰</div>
              <div className="relative z-10">
                <span className="text-5xl block mb-4 animate-bounce hover-wobble inline-block cursor-default group-hover:scale-150 transition-transform">🏁</span>
                <h3 className="text-4xl font-pirate text-yellow-500 mb-2">Voyage Plan Detailed!</h3>
                <p className="text-gray-400 font-medieval text-lg mb-10 px-4">
                  Captain, the winds are in our favor. Shall we secure your progress and return to the harbor to continue your quest later?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={handleManualSave}
                    disabled={isSaving}
                    className="px-10 py-5 bg-yellow-600 hover:bg-yellow-500 text-black text-2xl font-pirate tracking-widest rounded-xl transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3 hover-shine hover-ship-roll disabled:opacity-50"
                  >
                    <span>{isSaving ? '🖋️' : '🏴‍☠️'}</span> {isSaving ? 'SIGNING LOG...' : 'SECURE CURRENT PROGRESS'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
             <div className="flex flex-col lg:flex-row justify-between items-center border-b border-yellow-900/20 pb-6 gap-6">
                <h3 className="text-3xl font-pirate text-yellow-600 whitespace-nowrap transition-transform hover:translate-x-2">⚓ Your Logbook</h3>
                
                <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
                  {/* Real-time Search Input */}
                  <div className="relative w-full md:w-64 group">
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search yer logs..."
                      className="w-full bg-black/40 border border-yellow-900/30 rounded-xl py-2 pl-10 pr-10 text-sm font-medieval text-yellow-50 focus:outline-none focus:border-yellow-600 transition-all placeholder-yellow-900/40 focus:bg-black/60 shadow-inner"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-700 group-focus-within:text-yellow-500 transition-all group-focus-within:rotate-[-20deg]">🔍</span>
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-900 hover:text-yellow-500 transition-all hover:rotate-90"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Sort Filter */}
                  <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-yellow-900/30 w-full md:w-auto hover:border-yellow-700 transition-colors">
                    <label className="text-xs font-medieval text-yellow-800 uppercase tracking-widest whitespace-nowrap">Sort:</label>
                    <select 
                      value={sortOption} 
                      onChange={(e) => setSortOption(e.target.value as SortOption)}
                      className="bg-transparent text-yellow-500 font-medieval focus:outline-none cursor-pointer text-sm w-full"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="alpha-asc">Name (A-Z)</option>
                      <option value="alpha-desc">Name (Z-A)</option>
                    </select>
                  </div>
                </div>
             </div>

             {roadmaps.length === 0 ? (
               <div className="text-center py-20 bg-black/20 rounded-[3rem] border-4 border-dashed border-yellow-900/10 animate-pulse">
                  <span className="text-8xl block mb-6 grayscale opacity-20">🗺️</span>
                  <p className="font-medieval text-yellow-900/40 uppercase tracking-widest text-xl">The horizon is currently empty, Captain.</p>
               </div>
             ) : sortedAndFilteredRoadmaps.length === 0 ? (
               <div className="text-center py-20 bg-black/20 rounded-[3rem] border-4 border-dashed border-yellow-900/10 animate-in fade-in duration-500">
                  <span className="text-6xl block mb-6 grayscale opacity-30 animate-pulse">🔭</span>
                  <p className="font-medieval text-yellow-700 uppercase tracking-widest text-lg">No logs found matching "{searchQuery}"</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-yellow-500 hover:underline font-medieval text-sm transition-all hover:scale-105"
                  >
                    Clear Search
                  </button>
               </div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 [perspective:1000px]">
                 {sortedAndFilteredRoadmaps.map((rm, idx) => (
                   <div key={rm.id} className="animate-unroll hover:z-30 hover-ship-roll" style={{ animationDelay: `${idx * 0.1}s` }}>
                     <div className="relative group pirate-card-tilt h-full">
                       <button 
                         onClick={() => setSelectedRoadmap(rm)}
                         className="w-full bg-[#1a2c3d]/60 group-hover:bg-[#1a2c3d]/90 border-2 border-yellow-900/30 p-8 rounded-[2rem] text-left transition-all duration-300 shadow-xl h-full flex flex-col group/card"
                       >
                         <h4 className="text-2xl font-pirate text-yellow-500 mb-6 truncate transition-all group-hover:text-yellow-400 pr-16 group-hover:translate-x-1">{rm.goal}</h4>
                         <div className="mt-auto space-y-4 w-full">
                           <div className="relative pt-2">
                             <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-yellow-900/30">
                               <div 
                                 className={`h-full transition-all duration-1000 ease-in-out animate-liquid shadow-[0_0_8px_rgba(251,191,36,0.4)] ${rm.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-600'}`} 
                                 style={{ width: `${calculateProgress(rm.steps)}%` }}
                               ></div>
                             </div>
                             <div 
                               className="absolute -top-3 transition-all duration-1000 ease-in-out group-hover:scale-125"
                               style={{ left: `calc(${calculateProgress(rm.steps)}% - 8px)` }}
                             >
                               <span className="text-sm grayscale-[0.5] group-hover/card:grayscale-0 transition-all">
                                 {rm.status === 'Completed' ? '🏝️' : '⛵'}
                               </span>
                             </div>
                           </div>
                           <div className="flex justify-between text-[10px] font-medieval text-yellow-900 uppercase tracking-tighter transition-colors group-hover:text-yellow-700">
                              <span>{rm.steps.length} Milestones • {rm.status}</span>
                              <span className={`group-hover:text-yellow-500 transition-colors ${rm.status === 'Completed' ? 'text-green-500 font-bold' : ''}`}>{calculateProgress(rm.steps)}% Conquered</span>
                           </div>
                         </div>
                       </button>

                       {/* Delete Button */}
                       <button 
                         onClick={(e) => handleDeleteRoadmap(e, rm.id)}
                         className="absolute top-4 right-4 text-red-900/40 hover:text-red-500 transition-all z-20 p-2 rounded-full hover:bg-black/40 hover:scale-125 hover:rotate-12 group/bomb"
                         title="Scuttle Map"
                       >
                         <span className="text-2xl transition-all group-hover/bomb:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">💣</span>
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
