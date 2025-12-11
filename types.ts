
export interface AgentStats {
  creativity: number;
  logic: number;
  adaptability: number;
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  domain: string; // Mapped from 'division'
  avatarColor: string;
  expertise: string[];
  tools: string[]; // Mapped from 'allowed_tools'
  achievements: string[];
  publications: string[];
  personality: string; // Mapped from 'bio'
  level: number;
  description: string;
  xp: number;
  maxXp: number;
  stats: AgentStats;
  currentPolicy: string;
  basePrompt?: string; // New
  temperature?: number; // New
  evalRules?: Record<string, boolean>; // New
}

export interface Message {
  id: string;
  senderId: string; // 'user' | 'system' | agentId
  senderName: string;
  content: string; // For media, this can be the URL or the Code content
  timestamp: number;
  type: 'text' | 'thought' | 'alert' | 'discovery' | 'evolution' | 'synthetic_data' | 'code' | 'image' | 'video';
  metadata?: {
    language?: string; // For code
    caption?: string; // For images/video
  };
}

export interface ResearchProject {
  id: string;
  title: string;
  status: 'ideation' | 'collaboration' | 'synthesis' | 'complete';
  hypothesis: string;
  participants: string[];
  findings: string[];
  progress: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  LAB = 'LAB',
  VISION = 'VISION'
}

export interface EvolutionResult {
  agentId: string;
  xpGain: number;
  newSkill?: string;
  statBoost?: "creativity" | "logic" | "adaptability";
  policyUpdate: string;
  syntheticThought: string;
}

export interface Concept {
  id: string;
  name: string;
  sourceAgentId: string;
  timestamp: number;
  type: 'concept';
}
