
import React from 'react';
import { Icon } from './Icons';
import { motion } from 'framer-motion';

export const VotingWidget: React.FC = () => {
  return (
    <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg backdrop-blur-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consensus Vote</span>
        <span className="text-[10px] text-slate-600 font-mono">Live Session</span>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 bg-emerald-900/20 hover:bg-emerald-900/40 border border-emerald-900/50 text-emerald-400 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-2 transition-all">
          <Icon name="thumbsUp" size={12} /> SUPPORT
        </button>
        <button className="flex-1 bg-rose-900/20 hover:bg-rose-900/40 border border-rose-900/50 text-rose-400 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-2 transition-all">
          <Icon name="thumbsDown" size={12} /> REJECT
        </button>
      </div>
    </div>
  );
};

export const TimelineSlider: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg backdrop-blur-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Debate Timeline</span>
        <span className="text-[10px] text-cyan-500 font-mono">{progress}%</span>
      </div>
      <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-cyan-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-[9px] text-slate-600 font-mono">
        <span>T-00:00</span>
        <span>LIVE</span>
      </div>
    </div>
  );
};

interface PlaybackControlsProps {
  isPaused: boolean;
  onTogglePause: () => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({ isPaused, onTogglePause }) => {
  return (
    <button 
      onClick={onTogglePause}
      className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 hover:border-cyan-500 hover:text-cyan-400 text-slate-400 flex items-center justify-center transition-all"
    >
      <Icon name={isPaused ? "play" : "pause"} size={14} />
    </button>
  );
};

interface ArtifactProps {
  title: string;
  type: string;
  status: 'ready' | 'processing';
}

export const ArtifactCard: React.FC<ArtifactProps> = ({ title, type, status }) => {
  return (
    <div className="flex items-center gap-3 p-2 bg-slate-900/80 border border-slate-800 rounded hover:border-slate-600 transition-colors cursor-pointer group">
      <div className={`w-8 h-8 rounded flex items-center justify-center ${status === 'ready' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-amber-900/30 text-amber-400'}`}>
        <Icon name={type === 'sim' ? 'code' : 'fileText'} size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-slate-300 truncate">{title}</h4>
        <p className="text-[10px] text-slate-500 uppercase">{type} • {status}</p>
      </div>
      <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-800 rounded text-slate-400 transition-opacity">
        <Icon name="download" size={12} />
      </button>
    </div>
  );
};