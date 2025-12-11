
import React, { useState, useMemo } from 'react';
import { Agent } from '../types';
import { AgentCard } from './AgentCard';
import { Icon } from './Icons';
import { motion } from 'framer-motion';
import { MAJOR_DIVISIONS } from '../constants';

interface DashboardViewProps {
  agents: Agent[];
  selectedAgents: string[];
  toggleAgent: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onDeselectAll: (ids: string[]) => void;
  onLaunch: (task: string) => void;
  onLaunchDemo: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  agents, 
  selectedAgents, 
  toggleAgent, 
  onSelectAll,
  onDeselectAll,
  onLaunch,
  onLaunchDemo
}) => {
  const [currentTask, setCurrentTask] = useState('');
  const [filterDomain, setFilterDomain] = useState('All');

  const domains = useMemo(() => ['All', ...Array.from(new Set(agents.map(a => a.domain))).sort()], [agents]);
  
  const filteredAgents = useMemo(() => {
    if (filterDomain === 'All') return agents;
    return agents.filter(a => a.domain === filterDomain);
  }, [agents, filterDomain]);

  const handleSelectDivision = (divisionName: string) => {
    const divisionAgents = agents.filter(a => a.domain === divisionName);
    const ids = divisionAgents.map(a => a.id);
    onSelectAll(ids);
    setFilterDomain(divisionName);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero / Command Center */}
      <div className="flex-none p-6 md:p-8 text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-block relative"
        >
          <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full"></div>
          <div className="w-20 h-20 bg-gradient-to-tr from-cyan-600 to-purple-700 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-2xl relative z-10 border border-white/10">
            <Icon name="atom" size={48} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-tech text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-white to-purple-200 tracking-tight neon-text">
            AETHER LABS
          </h1>
          <p className="text-sm md:text-base text-cyan-400 font-mono mt-2 tracking-[0.3em] uppercase opacity-80 animate-pulse">
            // Virtual Research Institute //
          </p>
        </motion.div>

        {/* Task Composer */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="max-w-2xl mx-auto w-full relative group z-20"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-1000 animate-gradient-xy"></div>
          <div className="relative bg-slate-950 border border-slate-700 rounded-xl p-2 flex items-center shadow-2xl backdrop-blur-xl">
            <input
              type="text"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              placeholder="Enter Research Protocol (e.g., 'Analyze quantum entanglement in bio-systems')..."
              className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 h-12 px-4 text-base font-medium font-mono"
              onKeyDown={(e) => e.key === 'Enter' && onLaunch(currentTask)}
            />
            <button
              onClick={() => onLaunch(currentTask)}
              disabled={!currentTask.trim() || selectedAgents.length === 0}
              className={`
                h-10 px-6 rounded-lg font-bold font-tech tracking-wider transition-all border border-transparent
                ${!currentTask.trim() || selectedAgents.length === 0 
                  ? 'bg-slate-900 text-slate-600 cursor-not-allowed border-slate-800' 
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)] border-cyan-400'
                }
              `}
            >
              INITIALIZE
            </button>
          </div>
          <div className="flex justify-between mt-3 px-2 items-center">
            <div className="text-[10px] font-mono text-cyan-500/70 flex gap-4">
               <span className="flex items-center gap-1"><div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"/> SYSTEM ONLINE</span>
               <span>NODES: {agents.length}</span>
               <span className={selectedAgents.length > 0 ? "text-cyan-400 font-bold" : ""}>SELECTED: {selectedAgents.length}</span>
            </div>
            <button 
              onClick={onLaunchDemo}
              className="text-[10px] font-mono font-bold text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:bg-amber-500/10 px-3 py-1 rounded transition-all hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]"
            >
              RUN DEMO_SIM.EXE
            </button>
          </div>
        </motion.div>
      </div>

      {/* Division Gallery */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex-none px-4 md:px-12 mb-6"
      >
        <div className="flex items-center gap-4 mb-3">
           <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1"></div>
           <h2 className="text-xs font-bold font-tech text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Icon name="sparkles" size={12} className="text-purple-400"/> Divisions
           </h2>
           <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
           {MAJOR_DIVISIONS.map((div, i) => (
             <motion.button
               key={div.name}
               whileHover={{ scale: 1.05, y: -2 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => handleSelectDivision(div.name)}
               className="bg-slate-900/40 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 rounded-lg p-3 cursor-pointer group flex flex-col items-center text-center gap-2 transition-all backdrop-blur-sm"
             >
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-cyan-500 group-hover:text-cyan-400 text-slate-500 transition-all shadow-inner">
                   <Icon name={div.icon} size={16} />
                </div>
                <div className="text-[9px] font-bold text-slate-400 group-hover:text-cyan-100 leading-tight uppercase tracking-wider">{div.name}</div>
             </motion.button>
           ))}
        </div>
      </motion.div>

      {/* Pantheon Grid */}
      <div className="flex-1 overflow-hidden flex flex-col px-4 md:px-12 pb-8">
         <div className="flex justify-between items-center mb-4 shrink-0 bg-slate-900/50 p-2 rounded-lg border border-slate-800 backdrop-blur-md">
            <h2 className="text-sm font-bold font-tech text-slate-200 uppercase tracking-widest flex items-center gap-2 pl-2">
              <Icon name="layers" size={14} className="text-cyan-500" /> Active Roster
            </h2>
            <div className="flex gap-2 items-center">
               <button 
                 onClick={() => onSelectAll(filteredAgents.map(a => a.id))}
                 className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono font-bold px-3 py-1 rounded hover:bg-cyan-900/30 transition-colors"
               >
                 SELECT ALL
               </button>
               <button 
                 onClick={() => onDeselectAll(filteredAgents.map(a => a.id))}
                 className="text-[10px] text-slate-400 hover:text-white font-mono font-bold px-3 py-1 rounded hover:bg-slate-800 transition-colors"
               >
                 RESET
               </button>
               <div className="h-4 w-px bg-slate-700 mx-1"></div>
               <select 
                 className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded px-3 py-1 focus:border-cyan-500 outline-none hover:bg-slate-900 cursor-pointer font-mono"
                 value={filterDomain}
                 onChange={(e) => setFilterDomain(e.target.value)}
               >
                 {domains.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
               </select>
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-20">
            <motion.div 
               variants={containerVariants}
               initial="hidden"
               animate="show"
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filteredAgents.map(agent => (
                <motion.div key={agent.id} variants={itemVariants}>
                  <AgentCard 
                    agent={agent} 
                    selected={selectedAgents.includes(agent.id)}
                    onSelect={toggleAgent} 
                  />
                </motion.div>
              ))}
            </motion.div>
         </div>
      </div>
    </div>
  );
};