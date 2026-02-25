import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import axios from 'axios';

interface LoginScreenProps {
    onLogin: (name: string) => Promise<void>;
    onRegister: (name: string) => Promise<void>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister }) => {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAction = async (action: 'login' | 'register') => {
        if (!name.trim()) {
            setError("Identification identifier cannot be empty.");
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            if (action === 'login') {
                await onLogin(name.trim());
            } else {
                await onRegister(name.trim());
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.detail || "Connection failed. Database link severed.");
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

            <div className="glass-panel p-8 md:p-12 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col items-center w-full max-w-md relative z-10 border-stitch-blue/30 backdrop-blur-xl">

                <div className="w-16 h-16 rounded-full bg-stitch-blue/20 border border-stitch-cyan/50 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    <Terminal size={32} className="text-stitch-cyan text-glow" />
                </div>

                <h1 className="text-3xl font-bold tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-stitch-cyan to-stitch-lightBlue uppercase mb-2 text-center drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                    <span className="text-white drop-shadow-md">Mystic Explorers</span>
                </h1>
                <p className="text-slate-400 font-mono text-xs uppercase tracking-widest mb-8 text-center">
                    Authentication Protocol v3.0
                </p>

                <div className="w-full space-y-6">
                    <div>
                        <label className="block text-stitch-cyan text-xs font-bold uppercase tracking-widest mb-2 px-1">
                            Operator Alias
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAction('login'); }}
                            className="w-full bg-black/40 border border-stitch-blue/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-stitch-cyan focus:ring-1 focus:ring-stitch-cyan transition-all shadow-inner"
                            placeholder="Enter callsign..."
                            autoComplete="off"
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <div className="text-stitch-orange text-xs font-mono bg-stitch-orange/10 p-3 rounded-lg border border-stitch-orange/30 animate-pulse">
                            [ERROR]: {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            onClick={() => handleAction('login')}
                            disabled={isLoading}
                            className="w-full relative group overflow-hidden bg-stitch-cyan/10 hover:bg-stitch-cyan/20 text-stitch-cyan hover:text-white border border-stitch-cyan/50 py-3 rounded-lg font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] disabled:opacity-50"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? 'Authenticating...' : 'Resume Journey'}
                            </span>
                        </button>

                        <button
                            onClick={() => handleAction('register')}
                            disabled={isLoading}
                            className="w-full text-slate-400 hover:text-white py-2 font-mono text-xs tracking-widest uppercase hover:underline underline-offset-4 decoration-stitch-blue/50 transition-colors disabled:opacity-50 mt-2"
                        >
                            Or Start New Journey
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
