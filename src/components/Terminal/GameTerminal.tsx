import React, { useEffect, useRef } from 'react';
import { Terminal, Send } from 'lucide-react';

interface GameTerminalProps {
    history: string[];
}

const GameTerminal: React.FC<GameTerminalProps> = ({ history }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [history]);

    return (
        <div className="flex-1 flex flex-col border border-green-700/50 rounded-lg p-6 bg-gray-900/95 shadow-[0_0_30px_rgba(0,255,0,0.1)] backdrop-blur-md overflow-hidden relative">
            <div className="flex items-center gap-3 border-b border-green-800/50 pb-3 mb-4 flex-shrink-0">
                <div className="bg-green-900/30 p-2 rounded-full border border-green-500/30 shadow-[0_0_10px_rgba(0,255,0,0.3)]">
                    <Terminal size={20} className="text-green-300" />
                </div>
                <h1 className="text-xl font-bold tracking-[0.2em] text-green-100 uppercase drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">
                    Terminal Link <span className="text-xs text-green-600 align-top ml-1">v3.0 (READ ONLY)</span>
                </h1>
                <div className="flex-1"></div>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50 border border-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50 border border-green-500/80 animate-pulse"></div>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 min-h-0 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent pr-2 pb-2">
                {history.map((line, i) => (
                    <div key={i} className={`whitespace-pre-wrap leading-relaxed ${line.startsWith('>') ? 'text-green-300 font-bold opacity-80' : 'text-green-100'}`}>
                        {line.startsWith('>') ? <span className="mr-2 opacity-50">$</span> : ''}
                        {line}
                    </div>
                ))}
            </div>

            {/* Status Indicator for Read Only Mode */}
            <div className="absolute bottom-4 right-6 pointer-events-none opacity-20">
                <Send size={100} className="text-green-900" />
            </div>
        </div>
    );
};

export default GameTerminal;
