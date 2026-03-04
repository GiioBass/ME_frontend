import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Send, ChevronRight, HelpCircle } from 'lucide-react';

interface GameTerminalProps {
    history: string[];
    onCommand?: (cmd: string) => void;
    onShowHelp?: () => void;
}

const GameTerminal: React.FC<GameTerminalProps> = ({ history, onCommand, onShowHelp }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [command, setCommand] = useState('');

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [history]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (command.trim() && onCommand) {
            onCommand(command.trim());
            setCommand('');
        }
    };

    // Auto-focus input on click anywhere in terminal
    const handleTerminalClick = () => {
        inputRef.current?.focus();
    };

    return (
        <div
            className="flex-1 flex flex-col border border-green-700/50 rounded-lg p-6 bg-gray-900/95 shadow-[0_0_30px_rgba(0,255,0,0.1)] backdrop-blur-md overflow-hidden relative cursor-text"
            onClick={handleTerminalClick}
        >
            <div className="flex items-center gap-3 border-b border-green-800/50 pb-3 mb-4 flex-shrink-0">
                <div className="bg-green-900/30 p-2 rounded-full border border-green-500/30 shadow-[0_0_10px_rgba(0,255,0,0.3)]">
                    <Terminal size={20} className="text-green-300" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold tracking-[0.2em] text-green-100 uppercase drop-shadow-[0_0_5px_rgba(0,255,0,0.5)] leading-tight">
                        Terminal Link
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-green-400 italic animate-pulse font-mono uppercase tracking-widest">Neural Status: Online</span>
                    </div>
                </div>
                <div className="flex-1"></div>
                <div className="flex items-center gap-4">
                    {onShowHelp && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onShowHelp();
                            }}
                            className="text-green-600 hover:text-green-300 transition-colors p-1 hover:bg-green-900/20 rounded"
                            title="Command Protocol Guide"
                        >
                            <HelpCircle size={18} />
                        </button>
                    )}
                    <div className="flex gap-1.5 px-2 py-1 bg-black/40 rounded-full border border-green-900/30">
                        <div className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500/60 border border-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)] animate-pulse"></div>
                    </div>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 min-h-0 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent pr-2 pb-4">
                {history.map((line, i) => {
                    let colorClass = 'text-green-100';
                    if (line.startsWith('>')) {
                        colorClass = 'text-green-400 font-mono font-bold opacity-90';
                    } else if (line.includes('[TRAP]')) {
                        colorClass = 'text-red-400 font-bold drop-shadow-[0_0_8px_rgba(244,63,94,0.4)] animate-pulse';
                    } else if (line.includes('[NIGHT]') || line.includes('[DARK]')) {
                        colorClass = 'text-indigo-300 opacity-90 italic';
                    } else if (line.includes('[SYSTEM]')) {
                        colorClass = 'text-blue-300 font-bold tracking-tight';
                    }

                    return (
                        <div key={i} className={`whitespace-pre-wrap leading-relaxed font-mono text-sm ${colorClass}`}>
                            {line.startsWith('>') ? <span className="mr-2 text-green-600">$</span> : ''}
                            {line.startsWith('>') ? line.substring(2) : line}
                        </div>
                    );
                })}
            </div>

            {/* Interactive Input Field */}
            <form onSubmit={handleSubmit} className="mt-4 pt-3 border-t border-green-900/30 flex items-center gap-2 group">
                <ChevronRight size={18} className="text-green-500 group-focus-within:translate-x-1 transition-transform" />
                <input
                    ref={inputRef}
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="Enter command (e.g. 'look', 'north', 'help')..."
                    className="flex-1 bg-transparent border-none outline-none text-green-300 font-mono text-sm placeholder:text-green-900/60"
                    autoFocus
                />
                <button
                    type="submit"
                    className="p-1.5 rounded bg-green-900/20 border border-green-700/30 text-green-500 hover:bg-green-800/40 hover:text-green-300 transition-all"
                >
                    <Send size={14} />
                </button>
            </form>
        </div>
    );
};

export default GameTerminal;
