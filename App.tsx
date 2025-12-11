
import React, { useState, useEffect, useMemo } from 'react';
import { AGENTS, INITIAL_GREETING } from './constants';
import { Agent, Message, ViewState } from './types';
import { collaborateOnResearch, synthesizeDiscovery, evaluateAgentEvolution, runDemoScenario } from './services/geminiService';
import { TopNav } from './components/TopNav';
import { DashboardView } from './components/DashboardView';
import { LabView } from './components/LabView';
import { VisionView } from './components/VisionView';
import { ParallaxBackground } from './components/ParallaxBackground';
import { jsPDF } from "jspdf";

const App: React.FC = () => {
  // State
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [viewState, setViewState] = useState<ViewState>(ViewState.DASHBOARD);
  const [currentDiscovery, setCurrentDiscovery] = useState<any>(null);
  const [currentTask, setCurrentTask] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [simArtifacts, setSimArtifacts] = useState<number>(0);
  const [theme, setTheme] = useState<'nebula' | 'deep-space'>('nebula');

  // Initial Welcome Message
  useEffect(() => {
    setMessages([{
      id: 'init',
      senderId: 'system',
      senderName: 'Aether Core',
      content: INITIAL_GREETING,
      timestamp: Date.now(),
      type: 'text'
    }]);
  }, []);

  const activeTeam = useMemo(() => agents.filter(a => selectedAgents.includes(a.id)), [agents, selectedAgents]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'nebula' ? 'deep-space' : 'nebula');
  };

  // Handlers
  const toggleAgent = (id: string) => {
    setSelectedAgents(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (ids: string[]) => {
    setSelectedAgents(prev => {
      const set = new Set([...prev, ...ids]);
      return Array.from(set);
    });
  };

  const handleDeselectAll = (ids: string[]) => {
    setSelectedAgents(prev => prev.filter(id => !ids.includes(id)));
  };

  const handleLaunchResearch = (task: string) => {
    if (!task.trim()) {
      alert("Please define a research protocol.");
      return;
    }
    if (selectedAgents.length === 0) {
      alert("Summon at least one agent to the team.");
      return;
    }
    
    setCurrentTask(task);
    setViewState(ViewState.LAB);
    
    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'Director',
      content: task,
      timestamp: Date.now(),
      type: 'text'
    };
    setMessages(prev => [...prev, userMsg]);
    
    // Trigger Research
    runResearchProtocol(task, userMsg);
  };

  const handleLaunchDemo = () => {
    const task = "Explore low-energy wormhole topologies";
    setCurrentTask(task);
    
    // Auto-select a few agents if none
    if (selectedAgents.length === 0) {
      setSelectedAgents(['agent-002', 'agent-005', 'agent-006']);
    }
    
    setViewState(ViewState.LAB);
    setIsProcessing(true);
    setProcessingStage('Initializing Demo Simulation...');
    
    runDemoScenario((msg) => {
       setMessages(prev => [...prev, msg]);
    }).then(() => {
       setIsProcessing(false);
       setProcessingStage('Demo Complete');
    });
  };

  const handleSendMessage = (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'Director',
      content: text,
      timestamp: Date.now(),
      type: 'text'
    };
    setMessages(prev => [...prev, userMsg]);
    
    // If we are already in a task, this is a follow-up
    runResearchProtocol(text, userMsg);
  };

  const handleRequestSim = () => {
    setSimArtifacts(prev => prev + 1);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      senderId: 'system',
      senderName: 'SimRunner',
      content: `Simulation Job #${Date.now().toString().slice(-4)} queued. Artifact generating...`,
      timestamp: Date.now(),
      type: 'alert'
    }]);
  };

  const handleExport = () => {
    if (!currentDiscovery) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(34, 211, 238); // Cyan
    doc.text("AETHER LABS - RESEARCH SYNTHESIS", margin, 20);

    doc.setDrawColor(34, 211, 238);
    doc.line(margin, 25, pageWidth - margin, 25);

    // Title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0); // Black
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(currentDiscovery.title.toUpperCase(), contentWidth);
    doc.text(titleLines, margin, 40);
    const titleHeight = titleLines.length * 8;

    // Summary
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text("ABSTRACT:", margin, 40 + titleHeight + 10);
    
    doc.setFont("times", "italic");
    const summaryLines = doc.splitTextToSize(currentDiscovery.summary, contentWidth);
    doc.text(summaryLines, margin, 40 + titleHeight + 18);
    const summaryHeight = summaryLines.length * 6;

    // Key Findings
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text("KEY FINDINGS:", margin, 40 + titleHeight + 18 + summaryHeight + 15);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    let yPos = 40 + titleHeight + 18 + summaryHeight + 25;
    
    currentDiscovery.keyFindings.forEach((finding: string, i: number) => {
      const line = `• ${finding}`;
      const lines = doc.splitTextToSize(line, contentWidth - 5);
      doc.text(lines, margin + 5, yPos);
      yPos += lines.length * 7;
    });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by Aether Core v2.5 | Confidential Research Artifact", margin, 280);

    doc.save("Aether_Discovery_Report.pdf");
  };

  const runResearchProtocol = async (task: string, userMsg: Message) => {
    setIsProcessing(true);
    setProgress(10);

    try {
      // 1. Collaboration
      setProcessingStage('Initiating Neural Link...');
      const script = await collaborateOnResearch(task, selectedAgents, agents, messages);
      
      setProcessingStage('Collaborating...');
      setProgress(40);
      for (const line of script) {
        if (isPaused) await new Promise(r => setTimeout(r, 1000)); // Simple pause check
        await new Promise(r => setTimeout(r, 1500));
        const agent = agents.find(a => a.id === line.agentId);
        const agentMsg: Message = {
          id: Date.now().toString() + Math.random(),
          senderId: line.agentId,
          senderName: agent ? agent.name : 'Unknown',
          content: line.content,
          timestamp: Date.now(),
          type: line.type || 'text'
        };
        setMessages(prev => [...prev, agentMsg]);
      }
      setProgress(70);

      // 2. Synthesis
      setProcessingStage('Synthesizing Discovery...');
      const discussionLog = script.map(s => `${s.agentId}: ${s.content}`).join('\n');
      const discovery = await synthesizeDiscovery(task, discussionLog);
      setCurrentDiscovery(discovery);
      
      setMessages(prev => [...prev, {
        id: 'discovery-' + Date.now(),
        senderId: 'system',
        senderName: 'System',
        content: `Breakthrough synthesized: ${discovery.title}`,
        timestamp: Date.now(),
        type: 'discovery'
      }]);
      setProgress(90);

      // 3. Evolution
      setProcessingStage('Running Meta-Learning Loop...');
      const evolutionResults = await evaluateAgentEvolution(task, discussionLog, activeTeam);
      
      setAgents(prevAgents => prevAgents.map(agent => {
        const update = evolutionResults.find(u => u.agentId === agent.id);
        if (!update) return agent;

        let newXp = agent.xp + update.xpGain;
        let newLevel = agent.level;
        let newMaxXp = agent.maxXp;

        if (newXp >= agent.maxXp) {
          newLevel += 1;
          newXp = newXp - agent.maxXp;
          newMaxXp = Math.floor(agent.maxXp * 1.2);
        }

        const newStats = { ...agent.stats };
        if (update.statBoost) {
           // @ts-ignore
           newStats[update.statBoost] = Math.min(100, (newStats[update.statBoost] || 0) + 1);
        }

        const newExpertise = [...agent.expertise];
        if (update.newSkill && !newExpertise.includes(update.newSkill)) {
          newExpertise.unshift(update.newSkill);
        }

        return {
          ...agent,
          level: newLevel,
          xp: newXp,
          maxXp: newMaxXp,
          expertise: newExpertise,
          stats: newStats,
          currentPolicy: update.policyUpdate || agent.currentPolicy
        };
      }));

      // Notify Evolution
      for (const res of evolutionResults) {
        const agentName = agents.find(a => a.id === res.agentId)?.name;
        setMessages(prev => [...prev, {
          id: 'evo-policy-' + res.agentId + Date.now(),
          senderId: 'system',
          senderName: 'Meta-Optimizer',
          content: `${agentName} Policy Updated: "${res.policyUpdate}". Reward: +${res.xpGain}XP.`,
          timestamp: Date.now(),
          type: 'evolution'
        }]);
        await new Promise(r => setTimeout(r, 600));
      }
      setProgress(100);

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: 'err-' + Date.now(),
        senderId: 'system',
        senderName: 'System',
        content: "Neural Link disruption during cycle.",
        timestamp: Date.now(),
        type: 'alert'
      }]);
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-cyan-500/30 overflow-x-hidden relative bg-slate-950 text-slate-100 ${theme}`}>
      
      {/* --- PARALLAX BACKGROUND SYSTEM --- */}
      <ParallaxBackground />

      {/* --- FOREGROUND CONTENT --- */}
      <div className="relative z-10 max-w-[1600px] mx-auto p-4 min-h-screen flex flex-col gap-4">
        
        <TopNav 
          viewState={viewState} 
          setViewState={setViewState} 
          isProcessing={isProcessing} 
          processingStage={processingStage} 
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {viewState === ViewState.DASHBOARD ? (
          <DashboardView 
            agents={agents}
            selectedAgents={selectedAgents}
            toggleAgent={toggleAgent}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onLaunch={handleLaunchResearch}
            onLaunchDemo={handleLaunchDemo}
          />
        ) : viewState === ViewState.LAB ? (
          <LabView 
            setViewState={setViewState}
            activeTeam={activeTeam}
            messages={messages}
            agents={agents}
            isProcessing={isProcessing}
            currentTask={currentTask}
            onSendMessage={handleSendMessage}
            currentDiscovery={currentDiscovery}
            progress={progress}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            onRequestSim={handleRequestSim}
            onExport={handleExport}
          />
        ) : (
          <VisionView />
        )}

      </div>
    </div>
  );
};

export default App;
