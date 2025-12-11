
import React from 'react';
import { ViewState } from '../types';
import { Icon } from './Icons';

interface TopNavProps {
  viewState: ViewState;
  setViewState: (view: ViewState) => void;
  isProcessing: boolean;
  processingStage: string;
  theme: 'nebula' | 'deep-space';
  onToggleTheme: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ 
  viewState, 
  setViewState, 
  isProcessing, 
  processingStage,
  theme,
  onToggleTheme
}) => {
  return (
    <header className="flex justify-between items-center h-14 shrink-0 px-2 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewState(ViewState.DASHBOARD)}>
        <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center hover:border-cyan-500 transition-colors">
          <Icon name="atom" className="text-cyan-400" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold font-tech tracking-wider text-slate-100">AETHER LABS</h1>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">Research Control Room</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
         {/* Navigation Links */}
         <nav className="hidden md:flex items-center gap-6 text-xs font-bold font-tech tracking-wider">
            <button 
              onClick={() => setViewState(ViewState.DASHBOARD)}
              className={`${viewState === ViewState.DASHBOARD ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'} transition-colors`}
            >
              CONTROL ROOM
            </button>
            <button 
               onClick={() => setViewState(ViewState.VISION)}
               className={`${viewState === ViewState.VISION ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'} transition-colors`}
            >
              STRATEGIC VISION
            </button>
         </nav>

         <div className="h-6 w-px bg-slate-800 hidden md:block"></div>

         <div className="flex items-center gap-4 text-sm text-slate-400 font-mono">
            {/* Theme Toggle */}
            <button
               onClick={onToggleTheme}
               className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-400 hover:text-cyan-400 transition-all"
               title={`Switch to ${theme === 'nebula' ? 'Deep Space' : 'Nebula'} Theme`}
            >
               <Icon name={theme === 'nebula' ? 'moon' : 'sun'} size={14} />
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
                <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-xs uppercase">{isProcessing ? processingStage : 'System Idle'}</span>
            </div>
         </div>
      </div>
    </header>
  );
};
