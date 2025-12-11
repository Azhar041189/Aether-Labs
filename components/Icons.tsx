
import React from 'react';
import { 
  Atom, 
  Brain, 
  Clock, 
  Code, 
  Dna, 
  Globe, 
  Cpu, 
  Zap, 
  MessageSquare,
  Activity,
  Database,
  Send,
  Sparkles,
  Layers,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Download,
  Play,
  Pause,
  Sliders,
  Map,
  Rocket,
  Flag,
  TrendingUp,
  Monitor,
  Image,
  Film,
  Copy,
  Sun,
  Moon
} from 'lucide-react';

export const IconMap: Record<string, React.FC<any>> = {
  chronos: Clock,
  xenon: Dna,
  nova: Globe,
  cipher: Cpu,
  aura: Activity,
  system: Database,
  atom: Atom,
  brain: Brain,
  code: Code,
  zap: Zap,
  chat: MessageSquare,
  send: Send,
  sparkles: Sparkles,
  layers: Layers,
  thumbsUp: ThumbsUp,
  thumbsDown: ThumbsDown,
  fileText: FileText,
  download: Download,
  play: Play,
  pause: Pause,
  sliders: Sliders,
  map: Map,
  rocket: Rocket,
  flag: Flag,
  trendingUp: TrendingUp,
  monitor: Monitor,
  image: Image,
  film: Film,
  copy: Copy,
  sun: Sun,
  moon: Moon
};

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className, size = 24 }) => {
  const LucideIcon = IconMap[name] || IconMap['system'];
  return <LucideIcon className={className} size={size} />;
};
