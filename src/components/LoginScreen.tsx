import React, { useState } from 'react';
import { Terminal, Sparkles, Sword, Crosshair, Compass } from 'lucide-react';
import axios from 'axios';

interface LoginScreenProps {
    onLogin: (name: string) => Promise<void>;
    onRegister: (name: string, characterClass?: string) => Promise<void>;
}

const CLASSES = [
    { id: 'adventurer', name: 'Adventurer', icon: Compass, desc: 'Versatile explorer', color: 'border-cyan-500/50 text-cyan-400 bg-cyan-950/30' },
    { id: 'fighter', name: 'Fighter', icon: Sword, desc: 'High STR & Vitality', color: 'border-red-500/50 text-red-400 bg-red-950/30' },
    { id: 'marksman', name: 'Marksman', icon: Crosshair, desc: 'High AGI & Precision', color: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/30' },
    { id: 'mage', name: 'Mage', icon: Sparkles, desc: 'High MP & Spells', color: 'border-purple-500/50 text-purple-400 bg-purple-950/30' }
];

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister }) => {
    const [name, setName] = useState('');
    const [selectedClass, setSelectedClass] = useState('adventurer');
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAction = async () => {
        if (!name.trim()) {
            setError("Identification identifier cannot be empty.");
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            if (!isRegisterMode) {
                await onLogin(name.trim());
            } else {
                await onRegister(name.trim(), selectedClass);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const detail = err.response?.data?.detail;
                if (detail && detail.message) {
                    setError(detail.message);
                } else if (typeof detail === 'string') {
                    setError(detail);
                } else {
                    setError("Connection failed. Server unreachable.");
                }
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[100dvh] w-full bg-space-gradient flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-stitch-blue/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-stitch-cyan/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="glass-panel p-6 sm:p-8 md:p-10 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col items-center w-full max-w-md relative z-10 border-stitch-blue/30 backdrop-blur-xl">

                <div className="w-14 h-14 rounded-full bg-stitch-blue/20 border border-stitch-cyan/50 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    <Terminal size={28} className="text-stitch-cyan text-glow" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-stitch-cyan to-stitch-lightBlue uppercase mb-1 text-center drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                    <span className="text-white drop-shadow-md">Mystic Explorers</span>
                </h1>
                <p className="text-slate-400 font-mono text-[11px] uppercase tracking-widest mb-6 text-center">
                    {isRegisterMode ? 'New Operator Enlistment' : 'Authentication Protocol v3.0'}
                </p>

                <div className="w-full space-y-4">
                    <div>
                        <label className="block text-stitch-cyan text-xs font-bold uppercase tracking-widest mb-1.5 px-1">
                            Operator Callsign
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAction(); }}
                            className="w-full bg-black/40 border border-stitch-blue/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-stitch-cyan focus:ring-1 focus:ring-stitch-cyan transition-all shadow-inner text-sm"
                            placeholder="Enter callsign..."
                            autoComplete="off"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Class Selector (Visible in Register Mode) */}
                    {isRegisterMode && (
                        <div className="space-y-2 animate-in fade-in duration-300">
                            <label className="block text-stitch-cyan text-xs font-bold uppercase tracking-widest px-1">
                                Starting Archetype
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {CLASSES.map((cls) => {
                                    const Icon = cls.icon;
                                    const isSelected = selectedClass === cls.id;
                                    return (
                                        <button
                                            key={cls.id}
                                            type="button"
                                            onClick={() => setSelectedClass(cls.id)}
                                            className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all ${isSelected ? `${cls.color} ring-1 ring-white/60 shadow-md` : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/30'}`}
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <Icon size={14} />
                                                <span className="font-bold text-xs">{cls.name}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-sans">{cls.desc}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="text-stitch-orange text-xs font-mono bg-stitch-orange/10 p-3 rounded-lg border border-stitch-orange/30 animate-pulse">
                            [ERROR]: {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-2 pt-2">
                        <button
                            onClick={handleAction}
                            disabled={isLoading}
                            className="w-full bg-stitch-cyan/10 hover:bg-stitch-cyan/20 text-stitch-cyan hover:text-white border border-stitch-cyan/50 py-3 rounded-lg font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] disabled:opacity-50 text-xs sm:text-sm"
                        >
                            <span className="flex items-center justify-center gap-2">
                                {isLoading ? 'Processing...' : isRegisterMode ? 'Enlist & Start Journey' : 'Resume Journey'}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setIsRegisterMode(!isRegisterMode);
                                setError('');
                            }}
                            disabled={isLoading}
                            className="w-full text-slate-400 hover:text-white py-1.5 font-mono text-xs tracking-widest uppercase hover:underline underline-offset-4 decoration-stitch-blue/50 transition-colors disabled:opacity-50"
                        >
                            {isRegisterMode ? '← Back to Login' : 'Or Start New Journey'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
