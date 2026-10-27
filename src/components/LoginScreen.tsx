import React, { useState, useEffect } from 'react';
import { 
    Terminal, 
    Sparkles, 
    Sword, 
    Crosshair, 
    Compass, 
    Eye, 
    EyeOff, 
    Server, 
    Wifi, 
    CheckCircle2, 
    AlertCircle, 
    RotateCcw,
    Save,
    ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import { getApiUrl, setApiUrl, resetApiUrl, testServerConnection, DEFAULT_API_URL } from '../api';

interface LoginScreenProps {
    onLogin: (name: string, password?: string) => Promise<void>;
    onRegister: (name: string, characterClass?: string, password?: string) => Promise<void>;
}

const CLASSES = [
    { id: 'adventurer', name: 'Adventurer', icon: Compass, desc: 'Versatile explorer', color: 'border-cyan-500/50 text-cyan-400 bg-cyan-950/30' },
    { id: 'fighter', name: 'Fighter', icon: Sword, desc: 'High STR & Vitality', color: 'border-red-500/50 text-red-400 bg-red-950/30' },
    { id: 'marksman', name: 'Marksman', icon: Crosshair, desc: 'High AGI & Precision', color: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/30' },
    { id: 'mage', name: 'Mage', icon: Sparkles, desc: 'High MP & Spells', color: 'border-purple-500/50 text-purple-400 bg-purple-950/30' }
];

const parseUrlComponents = (rawUrl: string) => {
    try {
        const clean = rawUrl.startsWith('http') ? rawUrl : `http://${rawUrl}`;
        const u = new URL(clean);
        return {
            protocol: (u.protocol.replace(':', '') || 'http') as 'http' | 'https',
            host: u.hostname || 'localhost',
            port: u.port || '8001',
            path: u.pathname || '/api/v1'
        };
    } catch {
        return {
            protocol: 'http' as const,
            host: 'localhost',
            port: '8001',
            path: '/api/v1'
        };
    }
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister }) => {
    // Tab state
    const [activeTab, setActiveTab] = useState<'auth' | 'server'>('auth');

    // Auth states
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedClass, setSelectedClass] = useState('adventurer');
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Server configuration states
    const initialUrl = getApiUrl();
    const initialParsed = parseUrlComponents(initialUrl);
    const [serverProtocol, setServerProtocol] = useState<'http' | 'https'>(initialParsed.protocol);
    const [serverHost, setServerHost] = useState(initialParsed.host);
    const [serverPort, setServerPort] = useState(initialParsed.port);
    const [serverPath, setServerPath] = useState(initialParsed.path);
    const [serverSaveSuccess, setServerSaveSuccess] = useState(false);
    const [isTestingServer, setIsTestingServer] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    // Active full URL computed
    const composedUrl = `${serverProtocol}://${serverHost.trim() || 'localhost'}${serverPort.trim() ? `:${serverPort.trim()}` : ''}${serverPath.startsWith('/') ? serverPath : `/${serverPath}`}`;

    useEffect(() => {
        const cur = parseUrlComponents(getApiUrl());
        setServerProtocol(cur.protocol);
        setServerHost(cur.host);
        setServerPort(cur.port);
        setServerPath(cur.path);
    }, [activeTab]);

    const handleAction = async () => {
        if (!name.trim()) {
            setError("Identification identifier cannot be empty.");
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            if (!isRegisterMode) {
                await onLogin(name.trim(), password || undefined);
            } else {
                await onRegister(name.trim(), selectedClass, password || undefined);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const detail = err.response?.data?.detail;
                if (detail && detail.message) {
                    setError(detail.message);
                } else if (typeof detail === 'string') {
                    setError(detail);
                } else {
                    setError(`Connection failed with ${getApiUrl()}. Server unreachable.`);
                }
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleTestConnection = async () => {
        setIsTestingServer(true);
        setTestResult(null);
        try {
            const res = await testServerConnection(composedUrl);
            setTestResult(res);
        } catch {
            setTestResult({ success: false, message: 'Error inesperado al probar conexión.' });
        } finally {
            setIsTestingServer(false);
        }
    };

    const handleSaveServerConfig = () => {
        setApiUrl(composedUrl);
        setServerSaveSuccess(true);
        setTimeout(() => setServerSaveSuccess(false), 2500);
    };

    const handleResetDefaultServer = () => {
        resetApiUrl();
        const def = parseUrlComponents(DEFAULT_API_URL);
        setServerProtocol(def.protocol);
        setServerHost(def.host);
        setServerPort(def.port);
        setServerPath(def.path);
        setTestResult(null);
        setServerSaveSuccess(true);
        setTimeout(() => setServerSaveSuccess(false), 2500);
    };

    const applyPreset = (host: string, port: string) => {
        setServerHost(host);
        setServerPort(port);
        setTestResult(null);
    };

    return (
        <div className="h-[100dvh] w-full bg-space-gradient flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-stitch-blue/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-stitch-cyan/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="glass-panel p-5 sm:p-7 md:p-8 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col items-center w-full max-w-md relative z-10 border-stitch-blue/30 backdrop-blur-xl">

                <div className="w-12 h-12 rounded-full bg-stitch-blue/20 border border-stitch-cyan/50 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    <Terminal size={24} className="text-stitch-cyan text-glow" />
                </div>

                <h1 className="text-xl sm:text-2xl font-bold tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-stitch-cyan to-stitch-lightBlue uppercase mb-1 text-center drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                    <span className="text-white drop-shadow-md">Mystic Explorers</span>
                </h1>
                <p className="text-slate-400 font-mono text-[11px] uppercase tracking-widest mb-4 text-center">
                    {activeTab === 'server' ? 'Configuración de Servidor' : isRegisterMode ? 'New Operator Enlistment' : 'Authentication Protocol v3.0'}
                </p>

                {/* Navigation Tabs */}
                <div className="flex w-full mb-5 bg-black/40 p-1 rounded-xl border border-stitch-blue/30">
                    <button
                        type="button"
                        onClick={() => { setActiveTab('auth'); setError(''); }}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                            activeTab === 'auth'
                                ? 'bg-stitch-cyan/20 text-stitch-cyan border border-stitch-cyan/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Terminal size={14} />
                        {isRegisterMode ? 'Registro' : 'Ingreso'}
                    </button>
                    <button
                        type="button"
                        onClick={() => { setActiveTab('server'); setError(''); }}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                            activeTab === 'server'
                                ? 'bg-stitch-cyan/20 text-stitch-cyan border border-stitch-cyan/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Server size={14} />
                        Servidor
                    </button>
                </div>

                {/* TAB 1: AUTHENTICATION */}
                {activeTab === 'auth' && (
                    <div className="w-full space-y-4 animate-in fade-in duration-200">
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

                        <div>
                            <div className="flex items-center justify-between mb-1.5 px-1">
                                <label className="block text-stitch-cyan text-xs font-bold uppercase tracking-widest">
                                    Security Cipher
                                </label>
                                <span className="text-[10px] font-mono text-slate-500 uppercase">
                                    (Optional)
                                </span>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleAction(); }}
                                    className="w-full bg-black/40 border border-stitch-blue/50 rounded-lg pl-4 pr-10 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-stitch-cyan focus:ring-1 focus:ring-stitch-cyan transition-all shadow-inner text-sm"
                                    placeholder="Enter password / passkey..."
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-stitch-cyan transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
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

                        {/* Target Server Indicator */}
                        <div className="flex items-center justify-between text-[11px] font-mono px-1 text-slate-400 bg-black/20 p-2 rounded-lg border border-white/5">
                            <span className="truncate max-w-[240px]">
                                Servidor: <span className="text-stitch-cyan font-bold">{getApiUrl()}</span>
                            </span>
                            <button
                                type="button"
                                onClick={() => setActiveTab('server')}
                                className="text-stitch-cyan hover:underline text-[10px] uppercase font-bold shrink-0 ml-2"
                            >
                                Cambiar
                            </button>
                        </div>

                        <div className="flex flex-col gap-2 pt-1">
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
                )}

                {/* TAB 2: SERVER CONFIGURATION */}
                {activeTab === 'server' && (
                    <div className="w-full space-y-3.5 animate-in fade-in duration-200">
                        {/* URL Protocol & Host */}
                        <div>
                            <label className="block text-stitch-cyan text-xs font-bold uppercase tracking-widest mb-1 px-1">
                                Dirección IP / Host
                            </label>
                            <div className="flex gap-2">
                                <select
                                    value={serverProtocol}
                                    onChange={(e) => setServerProtocol(e.target.value as 'http' | 'https')}
                                    className="bg-black/40 border border-stitch-blue/50 rounded-lg px-2 py-2 text-white text-xs font-mono focus:outline-none focus:border-stitch-cyan"
                                >
                                    <option value="http">http://</option>
                                    <option value="https">https://</option>
                                </select>
                                <input
                                    type="text"
                                    value={serverHost}
                                    onChange={(e) => setServerHost(e.target.value)}
                                    placeholder="Ej: 192.168.1.15 o localhost"
                                    className="flex-1 bg-black/40 border border-stitch-blue/50 rounded-lg px-3 py-2 text-white font-mono text-xs placeholder-slate-600 focus:outline-none focus:border-stitch-cyan"
                                />
                            </div>
                        </div>

                        {/* Port and API Path */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-stitch-cyan text-xs font-bold uppercase tracking-widest mb-1 px-1">
                                    Puerto
                                </label>
                                <input
                                    type="text"
                                    value={serverPort}
                                    onChange={(e) => setServerPort(e.target.value)}
                                    placeholder="8001"
                                    className="w-full bg-black/40 border border-stitch-blue/50 rounded-lg px-3 py-2 text-white font-mono text-xs placeholder-slate-600 focus:outline-none focus:border-stitch-cyan"
                                />
                            </div>
                            <div>
                                <label className="block text-stitch-cyan text-xs font-bold uppercase tracking-widest mb-1 px-1">
                                    Ruta API
                                </label>
                                <input
                                    type="text"
                                    value={serverPath}
                                    onChange={(e) => setServerPath(e.target.value)}
                                    placeholder="/api/v1"
                                    className="w-full bg-black/40 border border-stitch-blue/50 rounded-lg px-3 py-2 text-white font-mono text-xs placeholder-slate-600 focus:outline-none focus:border-stitch-cyan"
                                />
                            </div>
                        </div>

                        {/* Quick Presets */}
                        <div>
                            <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 px-1">
                                Atajos rápidos:
                            </span>
                            <div className="grid grid-cols-3 gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => applyPreset('localhost', '8001')}
                                    className="px-2 py-1.5 rounded bg-black/30 border border-white/10 hover:border-stitch-cyan text-[10px] font-mono text-slate-300 transition-colors truncate"
                                    title="localhost:8001"
                                >
                                    Localhost
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyPreset('10.0.2.2', '8001')}
                                    className="px-2 py-1.5 rounded bg-black/30 border border-white/10 hover:border-stitch-cyan text-[10px] font-mono text-slate-300 transition-colors truncate"
                                    title="10.0.2.2:8001 (Emulador Android)"
                                >
                                    Emulador
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyPreset('192.168.1.', '8001')}
                                    className="px-2 py-1.5 rounded bg-black/30 border border-white/10 hover:border-stitch-cyan text-[10px] font-mono text-slate-300 transition-colors truncate"
                                    title="Red Wi-Fi Local (192.168.1.x)"
                                >
                                    Wi-Fi Local
                                </button>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="p-2.5 rounded-lg bg-black/40 border border-stitch-blue/40 font-mono text-[11px] text-slate-300 break-all">
                            <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-widest mb-0.5">URL Resultante:</span>
                            <span className="text-stitch-cyan font-bold">{composedUrl}</span>
                        </div>

                        {/* Connection Test Result */}
                        {testResult && (
                            <div className={`p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
                                testResult.success 
                                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' 
                                    : 'bg-stitch-orange/20 border-stitch-orange/50 text-stitch-orange'
                            }`}>
                                {testResult.success ? <CheckCircle2 size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}
                                <span>{testResult.message}</span>
                            </div>
                        )}

                        {serverSaveSuccess && (
                            <div className="p-2.5 rounded-lg border bg-emerald-950/40 border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
                                <CheckCircle2 size={16} className="shrink-0" />
                                <span>¡Configuración del servidor guardada exitosamente!</span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col gap-2 pt-1">
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={handleTestConnection}
                                    disabled={isTestingServer}
                                    className="bg-black/40 hover:bg-black/60 border border-stitch-blue/60 hover:border-stitch-cyan text-white py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                                >
                                    <Wifi size={14} className={isTestingServer ? 'animate-pulse text-stitch-cyan' : ''} />
                                    {isTestingServer ? 'Probando...' : 'Probar'}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSaveServerConfig}
                                    className="bg-stitch-cyan/20 hover:bg-stitch-cyan/30 border border-stitch-cyan text-stitch-cyan hover:text-white py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                                >
                                    <Save size={14} />
                                    Guardar
                                </button>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <button
                                    type="button"
                                    onClick={handleResetDefaultServer}
                                    className="text-slate-500 hover:text-slate-300 text-[10px] font-mono uppercase flex items-center gap-1 transition-colors"
                                >
                                    <RotateCcw size={12} />
                                    Restablecer
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveTab('auth')}
                                    className="text-stitch-cyan hover:underline text-xs font-bold uppercase flex items-center gap-1 transition-colors"
                                >
                                    <ArrowLeft size={13} />
                                    Volver al Ingreso
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginScreen;
