
import React, { useEffect, useRef, useState } from 'react';
import { Message, Agent } from '../types';
import { Icon } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInterfaceProps {
  messages: Message[];
  activeAgents: Agent[];
  isProcessing: boolean;
  currentTask?: string;
  onRequestSim?: () => void;
}

const TypingIndicator = () => (
  <div className="flex items-center gap-1">
    <motion.div 
      className="w-1.5 h-1.5 bg-cyan-400 rounded-full" 
      animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }} 
      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0 }} 
    />
    <motion.div 
      className="w-1.5 h-1.5 bg-cyan-400 rounded-full" 
      animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }} 
      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }} 
    />
    <motion.div 
      className="w-1.5 h-1.5 bg-cyan-400 rounded-full" 
      animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }} 
      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} 
    />
  </div>
);

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, activeAgents, isProcessing, currentTask, onRequestSim }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const getAgent = (id: string) => activeAgents.find(a => a.id === id);
  const getAgentColor = (id: string) => {
    const agent = getAgent(id);
    return agent ? agent.avatarColor : 'text-slate-400';
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderContent = (msg: Message) => {
    switch (msg.type) {
      case 'code':
        return (
          <div className="mt-2 rounded-lg overflow-hidden border border-slate-700 bg-[#0d1117]">
            <div className="flex justify-between items-center px-3 py-1.5 bg-slate-800/50 border-b border-slate-700">
              <span className="text-[10px] font-mono text-cyan-400 uppercase">{msg.metadata?.language || 'Code'}</span>
              <button 
                onClick={() => handleCopy(msg.content, msg.id)}
                className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors"
              >
                <Icon name="copy" size={10} />
                {copiedId === msg.id ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="p-3 overflow-x-auto text-xs font-mono text-slate-300 custom-scrollbar">
              <code>{msg.content}</code>
            </pre>
          </div>
        );
      case 'image':
        return (
          <div className="mt-2 rounded-xl overflow-hidden border border-slate-700 bg-black relative group">
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[10px] text-white font-mono flex items-center gap-1">
              <Icon name="image" size={10} /> GENERATED ARTIFACT
            </div>
            <img src={msg.content} alt="Generated Artifact" className="w-full h-auto object-cover max-h-64 opacity-90 group-hover:opacity-100 transition-opacity" />
            {msg.metadata?.caption && (
               <div className="bg-slate-900/80 p-2 text-[10px] text-slate-300 italic border-t border-slate-700">
                 {msg.metadata.caption}
               </div>
            )}
          </div>
        );
      case 'video':
        return (
           <div className="mt-2 rounded-xl overflow-hidden border border-slate-700 bg-black relative group">
             <div className="absolute top-2 left-2 bg-red-900/80 backdrop-blur px-2 py-0.5 rounded text-[10px] text-white font-mono flex items-center gap-1 z-10">
               <Icon name="film" size={10} /> SIMULATION STREAM
             </div>
             {/* Mock Video Player UI */}
             <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://placehold.co/600x400/0f172a/1e293b?text=Render...')] bg-cover opacity-50"></div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center backdrop-blur hover:scale-110 transition-transform cursor-pointer z-10">
                   <Icon name="play" size={20} className="text-cyan-400 ml-1" />
                </div>
                <div className="absolute bottom-0 w-full h-1 bg-slate-800">
                   <div className="w-1/3 h-full bg-cyan-500"></div>
                </div>
             </div>
             {msg.metadata?.caption && (
               <div className="bg-slate-900/80 p-2 text-[10px] text-slate-300 italic border-t border-slate-700">
                 {msg.metadata.caption}
               </div>
             )}
           </div>
        );
      default:
        // Basic text with simple markdown-like code block detection
        const parts = msg.content.split(/(```[\s\S]*?```)/g);
        return (
          <>
            {parts.map((part, i) => {
              if (part.startsWith('```')) {
                const codeContent = part.replace(/```[a-z]*\n?|```$/g, '');
                return (
                   <pre key={i} className="my-2 p-2 rounded bg-[#0d1117] border border-slate-700 text-xs font-mono text-slate-300 overflow-x-auto">
                     <code>{codeContent}</code>
                   </pre>
                );
              }
              return <span key={i} className="whitespace-pre-wrap">{part}</span>;
            })}
          </>
        );
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative glass-panel rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-xl shadow-2xl">
      {/* Task Header - Context Awareness */}
      {currentTask && (
        <div className="absolute top-0 left-0 w-full z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_cyan]"></div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Protocol Active</span>
          </div>
          <span className="text-xs text-slate-300 font-medium truncate max-w-[70%] font-mono bg-slate-900/50 px-3 py-1 rounded border border-slate-800">{currentTask}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-6 mt-10 custom-scrollbar scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-60">
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
               <Icon name="atom" size={80} className="mb-4 text-slate-800 drop-shadow-2xl" />
            </motion.div>
            <p className="font-tech text-2xl text-slate-500 neon-text">Aether Core Online</p>
            <p className="text-sm font-mono mt-2 text-cyan-900">Awaiting input stream...</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isUser = msg.senderId === 'user';
            const isSystem = msg.senderId === 'system';
            const isEvolution = msg.type === 'evolution';
            const isSynthetic = msg.type === 'synthetic_data';
            const isDiscovery = msg.type === 'discovery';
            
            // Generate a pseudo-random confidence score for the "Live Debate" feel
            const confidence = isUser || isSystem ? 0 : 0.85 + (Math.random() * 0.14);

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
                  
                  {/* Sender Info */}
                  {!isUser && !isSystem && (
                    <div className="flex items-center gap-2 mb-1 ml-1">
                      <span className={`text-[10px] font-bold ${getAgentColor(msg.senderId)} uppercase tracking-wider font-tech`}>
                        {msg.senderName}
                      </span>
                      <span className="text-[9px] text-slate-600 font-mono">
                         {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                      </span>
                      {msg.type === 'thought' && (
                        <span className="text-[9px] text-slate-500 italic flex items-center gap-1 bg-slate-900/50 border border-slate-800 px-1.5 rounded">
                          <Icon name="brain" size={8} className="text-cyan-500 animate-pulse" /> internal
                        </span>
                      )}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`
                    relative p-4 text-sm leading-relaxed border group transition-all duration-300 shadow-md backdrop-blur-sm
                    ${isUser 
                      ? 'bg-cyan-950/40 border-cyan-800/50 text-cyan-50 rounded-2xl rounded-tr-sm hover:bg-cyan-900/30' 
                      : msg.type === 'thought'
                        ? 'bg-slate-900/30 border-slate-800/50 text-slate-400 italic rounded-2xl rounded-tl-sm'
                        : isEvolution
                          ? 'bg-purple-950/20 border-purple-500/30 text-purple-200 font-mono text-xs rounded-xl shadow-[0_0_10px_rgba(168,85,247,0.1)]'
                          : isSynthetic
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200 italic rounded-xl'
                            : isDiscovery
                              ? 'bg-amber-950/30 border-amber-500/30 text-amber-100 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                              : 'bg-slate-800/80 border-slate-700 text-slate-200 rounded-2xl rounded-tl-sm shadow-sm'
                    }
                    ${msg.type === 'alert' ? 'border-red-500/50 bg-red-950/30 text-red-200 animate-pulse' : ''}
                  `}>
                    
                    {renderContent(msg)}

                    {/* Action Bar */}
                    {!isUser && !isSystem && !isEvolution && !isSynthetic && (
                      <div className="absolute -bottom-3 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-y-2 group-hover:translate-y-0 z-10">
                        <button 
                          onClick={onRequestSim}
                          className="bg-slate-950 border border-slate-700 text-[9px] text-cyan-400 px-2 py-0.5 rounded hover:bg-cyan-900/30 flex items-center gap-1 cursor-pointer hover:border-cyan-500 transition-colors shadow-lg"
                        >
                          <Icon name="zap" size={8} /> SIM
                        </button>
                        <button className="bg-slate-950 border border-slate-700 text-[9px] text-slate-400 px-2 py-0.5 rounded hover:bg-slate-800 flex items-center gap-1 cursor-pointer transition-colors shadow-lg">
                          <Icon name="layers" size={8} /> CITE
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Confidence Metric */}
                  {!isUser && !isSystem && !isEvolution && (
                    <div className="flex items-center gap-2 mt-1 ml-1 opacity-70">
                       <div className="h-0.5 w-12 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                          <div 
                            className="h-full bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.5)]" 
                            style={{ width: `${confidence * 100}%` }}
                          />
                       </div>
                       <span className="text-[8px] text-slate-500 font-mono">CONF: {Math.floor(confidence * 100)}%</span>
                    </div>
                  )}

                </div>
                
                {/* Avatar */}
                {!isUser && (
                   <div className={`
                     w-9 h-9 rounded-lg flex items-center justify-center mr-3 order-1 
                     bg-slate-950 border border-slate-800 shadow-xl mt-1 group-hover:border-slate-600 transition-colors
                     relative z-10
                   `}>
                      <Icon name={msg.senderId} size={18} className={getAgentColor(msg.senderId)} />
                      {/* Active Dot */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-slate-900 rounded-full flex items-center justify-center">
                         <div className={`w-1.5 h-1.5 rounded-full ${isSystem ? 'bg-cyan-500' : 'bg-green-500'}`}></div>
                      </div>
                   </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex flex-col gap-1 ml-10 mb-2"
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/50 rounded-2xl rounded-tl-sm border border-slate-800/50 backdrop-blur w-fit">
              <TypingIndicator />
              <span className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-widest animate-pulse">Calculating...</span>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
