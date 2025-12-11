
import React from 'react';
import { Icon } from './Icons';

interface ScriptoriumProps {
  discovery: any;
  onExport: () => void;
}

export const Scriptorium: React.FC<ScriptoriumProps> = ({ discovery, onExport }) => {
  if (!discovery) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-600 p-6 border border-dashed border-slate-800 rounded-xl">
        <Icon name="fileText" size={32} className="mb-3 opacity-50" />
        <p className="text-xs font-mono uppercase tracking-widest">Waiting for synthesis...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden shadow-xl">
      <div className="p-3 bg-slate-950/50 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon name="sparkles" className="text-purple-400" size={14} />
          <h3 className="text-xs font-bold font-tech text-slate-200">SCRIPTORIUS DRAFT v1.0</h3>
        </div>
        <button 
          onClick={onExport}
          className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors"
        >
          <Icon name="download" size={10} /> PDF
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
        <div className="space-y-1">
          <label className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Title</label>
          <input 
            type="text" 
            defaultValue={discovery.title}
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm font-bold text-cyan-100 focus:border-cyan-500 outline-none transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Abstract</label>
          <textarea 
            defaultValue={discovery.summary}
            className="w-full h-24 bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300 leading-relaxed focus:border-cyan-500 outline-none transition-colors resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Key Findings</label>
          <div className="space-y-2">
            {discovery.keyFindings.map((finding: string, i: number) => (
              <div key={i} className="flex gap-2 items-start bg-slate-950/50 p-2 rounded border border-slate-800/50">
                <span className="text-[9px] text-indigo-400 font-mono mt-0.5">{i+1}.</span>
                <p className="text-[11px] text-slate-400">{finding}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-2 border-t border-slate-800 bg-slate-950/30 flex justify-between items-center">
        <span className="text-[9px] text-slate-600">Auto-saved 2s ago</span>
        <div className="flex gap-1">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
           <span className="text-[9px] text-emerald-500 font-bold">READY FOR REVIEW</span>
        </div>
      </div>
    </div>
  );
};