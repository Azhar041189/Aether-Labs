
import React, { useState, useMemo, useEffect } from 'react';
import { Agent, Message, ViewState, Concept } from '../types';
import { AgentCard } from './AgentCard';
import { ChatInterface } from './ChatInterface';
import { Icon } from './Icons';
import { Visualizer } from './Visualizer';
import { ArtifactCard, TimelineSlider, VotingWidget, PlaybackControls } from './LabControls';
import { Scriptorium } from './Scriptorium';

interface LabViewProps {
  setViewState: (view: ViewState) => void;
  activeTeam: Agent[];
  messages: Message[];
  agents: Agent[];
  isProcessing: boolean;
  currentTask: string;
  onSendMessage: (text: string) => void;
  currentDiscovery: any;
  progress: number;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  onRequestSim: () => void;
  onExport: () => void;
}

const quickActions = [
  { label: "Inject Anomaly", icon: "zap", prompt: "Inject a random anomaly into the simulation data that contradicts current findings." },
  { label: "Demand Proof", icon: "fileText", prompt: "Stop speculation. Provide mathematical proof or citation for the last claim." },
  { label: "Expand Scope", icon: "nova", prompt: "Broaden the scope to include interdisciplinary impacts (Ethics, Economics, etc)." },
  { label: "Optimize", icon: "sliders", prompt: "Optimize the current proposed solution for efficiency and cost." }
];

export const LabView: React.FC<LabViewProps> = ({
  setViewState,
  activeTeam,
  messages,
  agents,
  isProcessing,
  currentTask,
  onSendMessage,
  currentDiscovery,
  progress,
  isPaused,
  setIsPaused,
  onRequestSim,
  onExport
}) => {
  const [activeTab, setActiveTab] = useState<'DISCOVERY' | 'TEAM' | 'LOGS'>('DISCOVERY');
  const [inputText, setInputText] = useState('');
  const [highlightedAgentId, setHighlightedAgentId] = useState<string | null>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleAgentListClick = (id: string) => {
    // Toggle highlight for roster list
    setHighlightedAgentId(prev => prev === id ? null : id);
  };

  const handleGraphNodeClick = (node: { id: string; type: string; name: string }) => {
    if (node.type === 'agent') {
      setHighlightedAgentId(prev => prev === node.id ? null : node.id);
    } else if (node.type === 'concept') {
      setInputText(`Analyze the concept of "${node.name}" in the context of the current research.`);
    }
  };

  // Dynamic Concept Extraction
  const concepts: Concept[] = useMemo(() => {
    const extracted: Concept[] = [];
    const seen = new Set<string>();

    // Process messages in reverse to find recent concepts, but limiting scan
    [...messages].reverse().forEach(msg => {
       if (msg.type !== 'text' && msg.type !== 'thought') return;
       // Heuristic: Capitalized words > 4 chars, or words in quotes/backticks
       // Exclude common starting words (The, This, etc) by checking internal context or just length
       const regex = /\b[A-Z][a-zA-Z]{4,}\b/g; 
       const matches = msg.content.match(regex) || [];
       
       matches.forEach(word => {
          if (!seen.has(word) && extracted.length < 15) {
             // Basic stop-word filter simulation
             if (['There', 'Where', 'Which', 'Could', 'Would', 'Should', 'These', 'Those', 'About'].includes(word)) return;
             
             seen.add(word);
             extracted.push({
                id: `c-${word}-${msg.timestamp}`,
                name: word,
                sourceAgentId: msg.senderId,
                timestamp: msg.timestamp,
                type: 'concept'
             });
          }
       });
    });
    return extracted;
  }, [messages]);

  return (
    <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
      {/* Left Panel: Roster (Collapsed/Filtered) */}
      <div className="col-span-12 md:col-span-3 lg:col-span-2 flex flex-col bg-slate-900/30 border border-slate-800/50 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/50">
          <button onClick={() => setViewState(ViewState.DASHBOARD)} className="text-slate-400 hover:text-cyan-400 transition-colors">
            <Icon name="chronos" size={16} />
          </button>
          <h2 className="font-tech text-xs text-slate-400 uppercase tracking-wider">Active Team</h2>
          <span className="text-[10px] bg-cyan-900/30 text-cyan-400 px-1.5 rounded border border-cyan-800">{activeTeam.length}</span>
        </div>
        
        <div className="overflow-y-auto p-2 space-y-2 custom-scrollbar flex-1">
          {activeTeam.map(agent => (
            <div key={agent.id} onMouseEnter={() => setHighlightedAgentId(agent.id)} onMouseLeave={() => setHighlightedAgentId(null)}>
              <AgentCard 
                agent={agent} 
                selected={true} // Always selected in this view
                isHighlighted={highlightedAgentId === agent.id}
                onSelect={handleAgentListClick} 
              />
            </div>
          ))}
          {activeTeam.length === 0 && (
             <div className="p-4 text-center text-xs text-slate-600">No agents active. Return to Dashboard to summon.</div>
          )}
        </div>
      </div>

      {/* Center Panel: Lab Canvas */}
      <div className="col-span-12 md:col-span-6 lg:col-span-7 flex flex-col gap-3 min-h-[500px]">
        <div className="flex-1 min-h-0 relative shadow-2xl">
          <ChatInterface 
            messages={messages} 
            activeAgents={agents}
            isProcessing={isProcessing}
            currentTask={currentTask}
            onRequestSim={onRequestSim}
          />
        </div>
        
        {/* Director Input & Quick Actions */}
        <div className="bg-slate-900/80 border border-slate-700/50 p-4 rounded-xl flex flex-col gap-3 shadow-lg backdrop-blur-sm">
          {/* Quick Actions Bar */}
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
             {quickActions.map(action => (
                <button
                  key={action.label}
                  onClick={() => onSendMessage(action.prompt)}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 rounded text-[10px] font-bold text-slate-300 hover:text-white transition-all whitespace-nowrap"
                >
                   <Icon name={action.icon} size={10} className="text-cyan-500" />
                   {action.label}
                </button>
             ))}
          </div>

          <div className="flex gap-3 items-start">
            <div className="mt-2 text-cyan-500/50">
              <Icon name="code" size={18} />
            </div>
            <div className="flex-1">
                <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Inject new parameters, query concepts, or steer the debate..."
                className="w-full bg-transparent border-none outline-none text-slate-200 placeholder-slate-600 resize-none h-14 py-2 text-sm font-mono leading-relaxed"
              />
            </div>
            <button 
              onClick={handleSend}
              disabled={isProcessing || !inputText.trim()}
              className={`p-3 rounded-lg transition-all self-end ${
                isProcessing || !inputText.trim() 
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                  : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-900/20'
              }`}
            >
              <Icon name="send" size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Context & Viz */}
      <div className="col-span-12 md:col-span-3 flex flex-col bg-slate-900/30 border border-slate-800/50 rounded-xl overflow-hidden">
        <div className="flex border-b border-slate-800/50">
          {(['DISCOVERY', 'TEAM', 'LOGS'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-[10px] font-bold tracking-wider hover:bg-slate-800/30 transition-colors ${activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/20' : 'text-slate-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-0 custom-scrollbar bg-slate-950/30">
          {activeTab === 'DISCOVERY' && (
            <div className="p-4 space-y-4 flex flex-col h-full">
              {/* Visualizer */}
              <div className="h-40 w-full rounded-lg overflow-hidden border border-slate-800 shrink-0">
                <Visualizer 
                   agents={activeTeam} 
                   concepts={concepts}
                   active={isProcessing} 
                   highlightedAgentId={highlightedAgentId}
                   onNodeClick={handleGraphNodeClick}
                />
              </div>
              
              {/* Artifacts */}
              <div className="space-y-2 shrink-0">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Artifacts</span>
                <ArtifactCard title="Sim-Log-001" type="sim" status="ready" />
                <ArtifactCard title="Discovery-Draft" type="doc" status={currentDiscovery ? 'ready' : 'processing'} />
              </div>

              {/* Scriptorium */}
              <div className="flex-1 min-h-[200px]">
                 <Scriptorium 
                   discovery={currentDiscovery} 
                   onExport={onExport} 
                 />
              </div>
            </div>
          )}

          {activeTab === 'TEAM' && (
            <div className="p-3 space-y-4">
              {/* Timeline */}
              <div className="flex items-center gap-2">
                 <PlaybackControls isPaused={isPaused} onTogglePause={() => setIsPaused(!isPaused)} />
                 <div className="flex-1">
                   <TimelineSlider progress={progress} />
                 </div>
              </div>

              {/* Voting */}
              <VotingWidget />

              <div className="space-y-3">
                 <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Agent Stats</span>
                {activeTeam.length === 0 ? (
                  <div className="text-center py-6 text-slate-600">
                    <p className="text-xs">No agents summoned.</p>
                  </div>
                ) : (
                  activeTeam.map(agent => (
                    <div 
                      key={agent.id} 
                      className={`
                        border rounded-lg p-3 transition-all
                        ${highlightedAgentId === agent.id ? 'bg-slate-800 border-cyan-500 shadow-md' : 'bg-slate-900/80 border-slate-800'}
                      `}
                      onMouseEnter={() => setHighlightedAgentId(agent.id)}
                      onMouseLeave={() => setHighlightedAgentId(null)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${agent.avatarColor.replace('text-', 'bg-')}`}></div>
                          <span className={`text-xs font-bold ${highlightedAgentId === agent.id ? 'text-white' : 'text-slate-200'}`}>{agent.name}</span>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(agent.stats).map(([stat, val]) => (
                          <div key={stat}>
                            <div className="flex justify-between text-[9px] text-slate-500 mb-0.5 uppercase">
                              <span>{stat}</span>
                              <span>{val}</span>
                            </div>
                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${stat === 'logic' ? 'bg-cyan-500' : stat === 'creativity' ? 'bg-purple-500' : 'bg-emerald-500'}`} 
                                style={{ width: `${val}%` }} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'LOGS' && (
            <div className="p-3 font-mono text-[10px] text-slate-500 space-y-1">
                {messages.map((m, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-slate-700">{new Date(m.timestamp).toLocaleTimeString()}</span>
                    <span className={m.senderId === 'system' ? 'text-cyan-700' : 'text-slate-400'}>
                      [{m.senderName.toUpperCase()}] {m.type.toUpperCase()}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
