
import React from 'react';
import { Agent } from '../types';
import { Icon } from './Icons';
import { motion } from 'framer-motion';

interface AgentCardProps {
  agent: Agent;
  selected: boolean;
  onSelect: (id: string) => void;
  isHighlighted?: boolean; // New prop for visual emphasis without full selection logic change
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, selected, onSelect, isHighlighted }) => {
  const xpPercentage = Math.min((agent.xp / agent.maxXp) * 100, 100);

  return (
    <div className="card-3d-wrapper h-full">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect(agent.id)}
        className={`
          card-3d-inner relative p-4 rounded-xl cursor-pointer transition-all duration-300 h-full border
          ${isHighlighted
             ? 'bg-slate-800 border-white ring-2 ring-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.4)] z-10'
             : selected 
               ? 'bg-slate-900/90 border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.2)]' 
               : 'bg-slate-900/40 border-slate-800 hover:border-slate-600 hover:bg-slate-800/60'
          }
          group overflow-hidden backdrop-blur-sm
        `}
      >
        {/* Dynamic Sheen Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>

        <div className="flex items-start gap-3 relative z-10">
          {/* Avatar Container with Glow */}
          <div className={`
             w-10 h-10 rounded-lg bg-slate-950 border border-slate-700 
             flex items-center justify-center shrink-0 shadow-lg
             ${selected || isHighlighted ? 'ring-2 ring-cyan-500/50 shadow-[0_0_10px_var(--primary-glow)]' : ''}
          `}>
            <Icon name={agent.id} size={20} className={`${agent.avatarColor} drop-shadow-md`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className={`text-sm font-bold font-tech truncate pr-2 ${selected || isHighlighted ? 'text-cyan-100 neon-text' : 'text-slate-200'}`}>
                {agent.name}
              </h3>
              <span className="text-[10px] font-mono text-cyan-500 bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/50">
                LVL {agent.level}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate mb-2">{agent.title}</p>
            
            {/* Stats Mini-Grid */}
            <div className="grid grid-cols-3 gap-1 mb-2">
               <div className="bg-slate-950/50 rounded px-1 py-0.5 text-[8px] text-center border border-slate-800">
                  <span className="text-purple-400 block">CRE</span> {agent.stats.creativity}
               </div>
               <div className="bg-slate-950/50 rounded px-1 py-0.5 text-[8px] text-center border border-slate-800">
                  <span className="text-blue-400 block">LOG</span> {agent.stats.logic}
               </div>
               <div className="bg-slate-950/50 rounded px-1 py-0.5 text-[8px] text-center border border-slate-800">
                  <span className="text-emerald-400 block">ADP</span> {agent.stats.adaptability}
               </div>
            </div>

            {/* XP Bar */}
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%`, opacity: [0.8, 1, 0.8] }}
                transition={{ opacity: { duration: 2, repeat: Infinity } }}
                className={`h-full ${selected || isHighlighted ? 'bg-cyan-500 shadow-[0_0_5px_var(--primary-glow)]' : 'bg-slate-600'}`}
              />
            </div>
          </div>
        </div>

        {(selected || isHighlighted) && (
          <div className="absolute top-0 right-0 p-1.5">
             <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_5px_cyan]" />
          </div>
        )}

        {/* Expanded Details on Hover/Highlight */}
        <div className={`
           grid grid-rows-[0fr] group-hover:grid-rows-[1fr] ${isHighlighted ? 'grid-rows-[1fr]' : ''} transition-all duration-300
        `}>
           <div className="overflow-hidden">
              <div className="pt-3 mt-2 border-t border-slate-800 space-y-2">
                 <div className="text-[9px]">
                    <span className="text-purple-400 font-bold uppercase">Personality:</span>
                    <p className="text-slate-400 leading-tight">{agent.personality}</p>
                 </div>
                 <div className="text-[9px]">
                    <span className="text-emerald-400 font-bold uppercase">Policy:</span>
                    <p className="text-slate-400 leading-tight">{agent.currentPolicy}</p>
                 </div>
                 <div className="text-[9px]">
                    <span className="text-cyan-400 font-bold uppercase">Prompt:</span>
                    <p className="text-slate-500 italic truncate leading-tight">"{agent.basePrompt?.slice(0, 50)}..."</p>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};