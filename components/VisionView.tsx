
import React, { useState } from 'react';
import { Icon } from './Icons';
import { motion } from 'framer-motion';

export const VisionView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('JOURNEY');

  const tabs = [
    { id: 'JOURNEY', label: 'User Journey', icon: 'map' },
    { id: 'PITCH', label: 'Pitch Deck', icon: 'monitor' },
    { id: 'MARKETING', label: 'One-Pager', icon: 'rocket' },
    { id: 'ROADMAP', label: 'Roadmap', icon: 'flag' },
    { id: 'INVESTORS', label: 'Investor Value', icon: 'trendingUp' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950/50 rounded-xl overflow-hidden border border-slate-800 relative z-10">
      {/* Header */}
      <div className="p-8 pb-4 text-center">
         <h1 className="text-3xl md:text-5xl font-black font-tech text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
           STRATEGIC VISION PROTOCOL
         </h1>
         <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">
           Aether Labs Organizational Blueprint
         </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 p-4 border-b border-slate-800/50 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all
              ${activeTab === tab.id 
                ? 'bg-purple-900/20 text-purple-400 border border-purple-500/50 shadow-lg shadow-purple-900/20' 
                : 'bg-slate-900/50 text-slate-500 border border-slate-800 hover:bg-slate-800 hover:text-slate-300'}
            `}
          >
            <Icon name={tab.icon} size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 max-w-5xl mx-auto w-full">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm mb-20"
        >
          {activeTab === 'JOURNEY' && <UserJourney />}
          {activeTab === 'PITCH' && <PitchDeck />}
          {activeTab === 'MARKETING' && <MarketingOnePager />}
          {activeTab === 'ROADMAP' && <FeatureRoadmap />}
          {activeTab === 'INVESTORS' && <InvestorValue />}
        </motion.div>
      </div>
    </div>
  );
};

// --- Sections ---

const UserJourney = () => (
  <div className="space-y-8">
    <SectionHeader title="User Journey Diagram" subtitle="From Awareness to Evolution" icon="map" />
    
    <div className="relative border-l-2 border-purple-900/50 ml-6 space-y-8 py-4">
      <JourneyStep 
        step="1" title="Awareness" 
        desc="User sees app demo or marketing site and understands the concept of multi-agent research." 
      />
      <JourneyStep 
        step="2" title="Entry" 
        desc="User signs in and lands in the Research Control Room dashboard." 
      />
      <JourneyStep 
        step="3" title="Division Selection" 
        desc="Browses expert divisions (Quantum, Temporal, AI Synthesis, etc.)" 
      />
      <JourneyStep 
        step="4" title="Project Setup" 
        desc="Defines research goal, constraints, and output type." 
      />
      <JourneyStep 
        step="5" title="Live Collaboration" 
        desc="AI agents debate, model, and refine ideas in real time." highlight
      />
      <JourneyStep 
        step="6" title="Iteration" 
        desc="User adds prompts, adjusts constraints, and reruns simulations." 
      />
      <JourneyStep 
        step="7" title="Output Delivery" 
        desc="Receives reports, theories, blueprints, models, or visualizations." 
      />
      <JourneyStep 
        step="8" title="Evolution" 
        desc="Agents update their internal knowledge. Future projects improve from learned patterns." 
      />
    </div>
  </div>
);

const PitchDeck = () => (
  <div className="space-y-8">
    <SectionHeader title="Pitch Deck" subtitle="The Future of Research" icon="monitor" />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Slide number="01" title="Title">
        <div className="text-xl font-bold text-white">AI Research Organization</div>
        <div className="text-cyan-400">A Virtual Lab of Evolving Expert Agents</div>
      </Slide>
      
      <Slide number="02" title="Problem">
        Innovation is slow, fragmented, and limited by human time and domain silos.
      </Slide>
      
      <Slide number="03" title="Solution">
        A virtual institution of expert AI agents collaborating across domains to generate extraordinary research.
      </Slide>
      
      <Slide number="04" title="Technology">
        <ul className="list-disc list-inside text-slate-300 space-y-1">
          <li>Multi-agent debate engine</li>
          <li>Knowledge graph memory</li>
          <li>Cross-domain reasoning</li>
          <li>Simulation layers</li>
          <li>Agent evolution models</li>
        </ul>
      </Slide>
      
      <Slide number="05" title="Use Cases">
        Scientific exploration, Concept prototyping, Fiction/Worldbuilding, Education, Gaming, Ideation.
      </Slide>
      
      <Slide number="06" title="Competitive Edge">
        Multi-agent intelligence that improves over time and performs interdisciplinary breakthroughs.
      </Slide>
      
      <Slide number="07" title="Business Model">
        Subscription tiers, Credits for simulations, Enterprise API access.
      </Slide>
      
      <Slide number="08" title="Vision">
        Create the first self-evolving research civilization.
      </Slide>
    </div>
  </div>
);

const MarketingOnePager = () => (
  <div className="space-y-8">
    <SectionHeader title="Marketing One-Pager" subtitle="Galaxy of Minds" icon="rocket" />
    
    <div className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 p-6 rounded-xl border border-white/5 text-center mb-8">
      <h3 className="text-2xl font-bold text-white mb-2">"A research lab powered by a galaxy of expert AI minds."</h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <MarketingBlock title="What It Is">
          A platform where dozens of specialized AI agents collaborate to explore theories, build simulations, and generate advanced or speculative research.
        </MarketingBlock>
        <MarketingBlock title="Who It's For">
          Students, Writers, Developers, Scientists, Innovators, Sci-fi creators.
        </MarketingBlock>
        <MarketingBlock title="Why It's Different">
          It doesn’t just generate answers. It simulates <span className="text-cyan-400">intelligent collaboration</span>.
        </MarketingBlock>
      </div>

      <div className="space-y-6">
         <MarketingBlock title="Core Features">
           <ul className="space-y-2">
             <li className="flex items-center gap-2"><Icon name="chat" size={14} className="text-cyan-400"/> Live agent debates</li>
             <li className="flex items-center gap-2"><Icon name="layers" size={14} className="text-cyan-400"/> Multi-division teams</li>
             <li className="flex items-center gap-2"><Icon name="zap" size={14} className="text-cyan-400"/> Simulation engines</li>
             <li className="flex items-center gap-2"><Icon name="brain" size={14} className="text-cyan-400"/> Auto-evolving knowledge</li>
             <li className="flex items-center gap-2"><Icon name="fileText" size={14} className="text-cyan-400"/> Exportable artifacts</li>
           </ul>
         </MarketingBlock>
         <MarketingBlock title="Outcome">
           Users produce groundbreaking ideas quickly and explore concepts beyond current scientific constraints.
         </MarketingBlock>
      </div>
    </div>
  </div>
);

const FeatureRoadmap = () => (
  <div className="space-y-8">
    <SectionHeader title="Feature Roadmap" subtitle="Evolutionary Trajectory" icon="flag" />
    
    <div className="space-y-6">
       <RoadmapPhase phase="1" title="Core" items={["Dashboard", "Divisions and agents", "Project creator", "Live debate canvas", "Export basic reports"]} done />
       <RoadmapPhase phase="2" title="Collaboration" items={["Multi-agent simulation engine", "Knowledge graph memory", "User-driven iteration tools", "Advanced exports"]} current />
       <RoadmapPhase phase="3" title="Evolution" items={["Adaptive agent intelligence", "Cross-project memory", "Skill expansion modules"]} />
       <RoadmapPhase phase="4" title="Social & Sharing" items={["Shared research rooms", "Public simulations", "Marketplace for models"]} />
       <RoadmapPhase phase="5" title="Enterprise" items={["API access", "Custom private agents", "Compliance and governance features"]} />
    </div>
  </div>
);

const InvestorValue = () => (
  <div className="space-y-8">
    <SectionHeader title="Value Proposition" subtitle="For Investors" icon="trendingUp" />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <ValueCard title="Market Fit" desc="A rising wave of multi-agent AI platforms combined with growing appetite for scientific, educational, and creative tools." />
       <ValueCard title="Scalability" desc="Agents improve over time, making the system more valuable with increased usage." />
       <ValueCard title="Unique Moat" desc="A self-evolving research ecosystem that competitors cannot easily replicate." />
       <ValueCard title="Revenue Potential" desc="Subscriptions, enterprise APIs, research licenses, and educational plans." />
       <ValueCard title="Long-Term Vision" desc="A platform capable of generating multi-domain advancements, speculative models, and entirely new intellectual frameworks." highlight />
    </div>

    <div className="mt-8 p-4 bg-slate-800/50 rounded-lg text-center text-sm text-slate-400 italic">
      "The app positions itself not just as a tool but as an ever-growing civilization of intelligence."
    </div>
  </div>
);

// --- Helper Components ---

const SectionHeader = ({ title, subtitle, icon }: any) => (
  <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-6">
    <div className="p-3 bg-slate-800 rounded-lg text-purple-400">
      <Icon name={icon} size={32} />
    </div>
    <div>
      <h2 className="text-2xl font-bold font-tech text-white">{title}</h2>
      <p className="text-slate-500 font-mono text-xs uppercase tracking-wider">{subtitle}</p>
    </div>
  </div>
);

const JourneyStep = ({ step, title, desc, highlight }: any) => (
  <div className="relative pl-8">
    <div className={`
      absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 
      ${highlight ? 'bg-purple-500 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-slate-900 border-slate-600'}
    `}></div>
    <div className={`p-4 rounded-lg border ${highlight ? 'bg-purple-900/10 border-purple-500/50' : 'bg-slate-900/50 border-slate-800'}`}>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Step {step}</span>
      <h3 className={`text-lg font-bold mb-1 ${highlight ? 'text-purple-300' : 'text-slate-200'}`}>{title}</h3>
      <p className="text-sm text-slate-400">{desc}</p>
    </div>
  </div>
);

const Slide = ({ number, title, children }: any) => (
  <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl aspect-[16/9] flex flex-col hover:border-cyan-500/50 transition-colors group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-2 text-[100px] font-black text-slate-800/20 leading-none -mt-4 -mr-4 select-none group-hover:text-slate-800/30 transition-colors">
      {number}
    </div>
    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">{title}</div>
    <div className="relative z-10 text-slate-300 font-medium">
      {children}
    </div>
  </div>
);

const MarketingBlock = ({ title, children }: any) => (
  <div>
    <h4 className="text-sm font-bold font-tech text-slate-200 uppercase mb-2 border-l-2 border-cyan-500 pl-3">{title}</h4>
    <div className="text-sm text-slate-400 leading-relaxed pl-3.5">{children}</div>
  </div>
);

const RoadmapPhase = ({ phase, title, items, done, current }: any) => (
  <div className={`flex gap-4 items-start ${current ? 'opacity-100' : 'opacity-70'}`}>
    <div className={`
       shrink-0 w-24 py-1 text-center rounded text-xs font-bold font-mono border
       ${done ? 'bg-emerald-900/20 text-emerald-400 border-emerald-900' : 
         current ? 'bg-cyan-900/20 text-cyan-400 border-cyan-500 shadow-lg shadow-cyan-500/20' : 
         'bg-slate-900 text-slate-600 border-slate-800'}
    `}>
      PHASE {phase}
    </div>
    <div className="flex-1 pt-0.5">
      <h4 className={`text-sm font-bold mb-1 ${current ? 'text-white' : 'text-slate-400'}`}>{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item: string) => (
          <span key={item} className="text-[10px] px-2 py-0.5 bg-slate-900 rounded text-slate-500 border border-slate-800">
            {item}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const ValueCard = ({ title, desc, highlight }: any) => (
  <div className={`p-4 rounded-lg border ${highlight ? 'bg-gradient-to-br from-purple-900/20 to-slate-900 border-purple-500/30' : 'bg-slate-900/30 border-slate-800'}`}>
    <h3 className="text-sm font-bold font-tech text-slate-200 mb-2">{title}</h3>
    <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
  </div>
);