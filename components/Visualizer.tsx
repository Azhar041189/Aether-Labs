
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Agent, Concept } from '../types';

interface VisualizerProps {
  agents: Agent[]; 
  concepts?: Concept[]; // New prop for dynamic concepts
  active: boolean;
  highlightedAgentId?: string | null;
  onNodeClick?: (node: { id: string; type: string; name: string }) => void;
}

export const Visualizer: React.FC<VisualizerProps> = ({ agents, concepts = [], active, highlightedAgentId, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Tooltip Container
    const tooltip = d3.select(svgRef.current.parentElement)
      .append("div")
      .attr("class", "absolute z-50 px-2 py-1 text-[10px] font-bold text-white bg-slate-900 border border-slate-700 rounded shadow-lg pointer-events-none opacity-0 transition-opacity")
      .style("top", "0")
      .style("left", "0");

    let nodes: any[] = [];
    let links: any[] = [];

    if (agents.length > 0) {
       // 1. Agent Nodes
       const agentNodes = agents.map(a => ({
         id: a.id,
         name: a.name,
         domain: a.domain,
         r: 8 + (a.stats.creativity / 20),
         color: a.avatarColor.replace('text-', '#').replace('-400', '').replace('-500', '').replace('-300', '').replace('-600', '').replace('-200', '').replace('-700', ''), 
         group: 'agent',
         type: 'agent'
       }));

       // 2. Concept Nodes (Limit to recent/important ones to avoid clutter)
       const conceptNodes = concepts.slice(-20).map(c => ({
         id: c.id,
         name: c.name,
         domain: 'Concept',
         r: 4,
         color: '#94a3b8', // Slate 400
         group: 'concept',
         type: 'concept'
       }));

       nodes = [...agentNodes, ...conceptNodes];

       // 3. Links
       // Agent-to-Agent (Random connections for "Collaboration" visualization)
       const agentLinks = d3.range(Math.max(agentNodes.length, 5)).map(() => ({
          source: agentNodes[Math.floor(Math.random() * agentNodes.length)].id,
          target: agentNodes[Math.floor(Math.random() * agentNodes.length)].id,
          type: 'collaboration'
       }));

       // Agent-to-Concept (Provenance)
       const conceptLinks = concepts.slice(-20).map(c => {
          // Verify agent exists in active set
          const agentExists = agents.find(a => a.id === c.sourceAgentId);
          if (agentExists) {
             return { source: c.sourceAgentId, target: c.id, type: 'provenance' };
          }
          return null;
       }).filter(l => l !== null);

       links = [...agentLinks, ...conceptLinks];

    } else {
       // Fallback State
       nodes = d3.range(20).map(i => ({
        id: `thought-${i}`,
        name: 'Idle Process',
        domain: 'System',
        r: Math.random() * 5 + 2,
        group: 'thought',
        color: '#334155'
      }));
       
       links = d3.range(15).map(() => ({
         source: nodes[Math.floor(Math.random() * nodes.length)].id,
         target: nodes[Math.floor(Math.random() * nodes.length)].id
       }));
    }

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance((d: any) => d.type === 'provenance' ? 30 : 80))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide((d: any) => d.r + 5));

    const link = svg.append("g")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d: any) => d.type === 'provenance' ? "#22d3ee" : "#334155")
      .attr("stroke-width", (d: any) => d.type === 'provenance' ? 0.5 : 1)
      .attr("stroke-dasharray", (d: any) => d.type === 'provenance' ? "2,2" : "none");

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d: any) => d.r)
      .attr("fill", (d: any) => {
         if (d.type === 'concept') return '#0f172a'; // Dark fill for concepts
         
         // Simplified hex mapping fallback for Agents
         const twColor = d.color; 
         const colors: Record<string, string> = {
            'rose': '#fb7185', 'violet': '#a78bfa', 'cyan': '#22d3ee', 'fuchsia': '#e879f9',
            'indigo': '#818cf8', 'purple': '#c084fc', 'emerald': '#34d399', 'amber': '#fbbf24',
            'slate': '#cbd5e1', 'teal': '#2dd4bf', 'blue': '#60a5fa', 'pink': '#f472b6',
            'orange': '#fb923c', 'green': '#4ade80', 'red': '#f87171', 'yellow': '#facc15',
            'gray': '#9ca3af', 'lime': '#a3e635', 'stone': '#a8a29e', 'sky': '#38bdf8'
         };
         const key = Object.keys(colors).find(k => twColor && twColor.includes(k));
         return key ? colors[key] : "#6366f1";
      })
      .attr("stroke", (d: any) => {
         if (d.id === highlightedAgentId) return "#ffffff";
         if (d.type === 'concept') return "#94a3b8";
         return "#0f172a";
      })
      .attr("stroke-width", (d: any) => d.id === highlightedAgentId ? 3 : d.type === 'concept' ? 1 : 2)
      .attr("cursor", "pointer")
      .call(drag(simulation) as any)
      .on("click", (event, d: any) => {
        event.stopPropagation();
        if (onNodeClick) {
          onNodeClick({ id: d.id, type: d.type, name: d.name });
        }
      })
      .on("mouseover", (event, d: any) => {
         tooltip.transition().duration(200).style("opacity", 1);
         tooltip.html(
            `<div class="text-center">
               <span class="block text-xs text-white">${d.name}</span>
               <span class="text-[9px] text-cyan-400 font-normal uppercase tracking-wider">${d.domain}</span>
             </div>`
           )
           .style("left", (event.pageX + 10) + "px")
           .style("top", (event.pageY - 28) + "px");
         
         d3.select(event.currentTarget).attr("stroke", "#ffffff").attr("stroke-width", 3);
      })
      .on("mouseout", (event, d: any) => {
         tooltip.transition().duration(500).style("opacity", 0);
         if (d.id !== highlightedAgentId) {
            d3.select(event.currentTarget)
               .attr("stroke", d.type === 'concept' ? "#94a3b8" : "#0f172a")
               .attr("stroke-width", d.type === 'concept' ? 1 : 2);
         }
      });

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    });

    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    return () => {
      simulation.stop();
      tooltip.remove();
    };

  }, [active, agents, concepts, highlightedAgentId, onNodeClick]);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="absolute top-2 left-2 z-10 text-[10px] font-mono text-cyan-600 uppercase pointer-events-none flex flex-col">
        <span className="font-bold">Neural Knowledge Graph</span>
        <span className="text-[8px] opacity-70">Nodes: {agents.length + concepts.length} | Links: Active</span>
      </div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
