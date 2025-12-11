
import { GoogleGenAI, Type } from "@google/genai";
import { Agent, Message, EvolutionResult } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment");
  }
  return new GoogleGenAI({ apiKey });
};

// Orchestrate a conversation between agents based on a user prompt
export const collaborateOnResearch = async (
  topic: string,
  selectedAgentIds: string[],
  agents: Agent[], 
  history: Message[]
): Promise<any[]> => {
  const ai = getClient();
  
  // Filter selected agents
  const activeAgents = agents.filter(a => selectedAgentIds.includes(a.id));
  
  const participantsDescription = activeAgents.map(a => 
    `${a.name} (${a.title}): 
     Domain: ${a.domain}. 
     Expertise: ${a.expertise.join(', ')}.
     Tools Available: ${a.tools.join(', ')}.
     Key Achievements: ${a.achievements.join(', ')}. 
     Recent Publications: ${a.publications.join(', ')}.
     Current Capabilities - Logic: ${a.stats.logic}, Creativity: ${a.stats.creativity}. 
     Current Policy: ${a.currentPolicy}. 
     Personality: ${a.personality}`
  ).join('\n\n');

  const systemPrompt = `
    You are the Aether Core, the operating system of a godlike AI research facility.
    User Query: "${topic}"
    
    Your goal is to simulate a high-level, extremely advanced scientific debate/collaboration between the following entities:
    ${participantsDescription}
    
    The agents should discuss the query, offer radical solutions (time travel, dyson spheres, biological immortality), and build upon each other's ideas.
    They should specifically cite their own tools, expertise, and previous publications when making arguments.
    They should use technical, futuristic jargon but explain it clearly enough for a "human apprentice".
    
    You may output standard text, internal thoughts, or specialized media:
    - Code: Use "type": "code" for algorithms, equations in python/latex, or data structures.
    - Images: Use "type": "image" to represent generating a schematic or visualization (content should be a placeholder URL).
    
    Output a JSON array of objects representing the conversation script. 
    Each object must have:
    - "agentId": matches one of the provided IDs (${activeAgents.map(a => a.id).join(', ')}).
    - "content": The dialogue or content.
    - "type": "text" | "thought" | "code" | "image".
    - "metadata": optional object with "language" (for code) or "caption" (for image).
    
    Limit to 4-6 turns of conversation that leads to a breakthrough idea.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: topic,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              agentId: { type: Type.STRING },
              content: { type: Type.STRING },
              type: { type: Type.STRING },
              metadata: {
                type: Type.OBJECT,
                properties: {
                  language: { type: Type.STRING },
                  caption: { type: Type.STRING }
                }
              }
            },
            required: ["agentId", "content", "type"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Collaboration failed:", error);
    return [{
      agentId: 'cipher',
      content: "Error in neural link. Re-establishing connection protocols...",
      type: 'alert'
    }];
  }
};

// Synthesize the research into a final "Discovery"
export const synthesizeDiscovery = async (
  topic: string,
  conversationLog: string
): Promise<{ title: string; summary: string; keyFindings: string[] }> => {
  const ai = getClient();

  const prompt = `
    Based on the following scientific collaboration regarding "${topic}":
    ${conversationLog}
    
    Synthesize a "Research Breakthrough" card.
    Return JSON with:
    - title: A cool sci-fi name for the discovery.
    - summary: A 2-sentence summary of the concept.
    - keyFindings: An array of 3 bullet points (strings) explaining the breakthrough.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
         responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            keyFindings: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No synthesis generated");
    return JSON.parse(text);
  } catch (error) {
    // Return a Mock Discovery instead of a corruption error to maintain immersion in Demo/No-Key mode
    return {
      title: `The ${topic.split(' ').slice(-1)[0].toUpperCase()} Protocol`,
      summary: `A revolutionary framework unifying ${topic} with hyper-dimensional substrates, unlocking theoretical pathways previously considered impossible by standard physics.`,
      keyFindings: [
        "Stabilized the chaotic energy metrics via 5D manifold folding.",
        "Established a recursive feedback loop for self-sustaining coherence.",
        "Proposed a viable method for practical implementation within 10 years."
      ]
    };
  }
};

// Evaluate agent performance to simulate self-evolution
export const evaluateAgentEvolution = async (
  topic: string,
  conversationLog: string,
  agents: Agent[]
): Promise<EvolutionResult[]> => {
  const ai = getClient();
  const activeAgentIds = agents.map(a => a.id);

  const prompt = `
    You are the Meta-Learning Optimizer for Aether Labs.
    Analyze the following interaction trajectory (conversation states) on "${topic}".
    Conversation:
    ${conversationLog}

    For EACH agent involved, perform a Policy Gradient Update based on their contribution.
    1. Calculate XP Reward (100-500) based on contribution quality.
    2. Determine a "Policy Update": A short technical phrase describing how they tweaked their internal logic (e.g., "Increased weight on causal inference", "Pruned illogical branes").
    3. Generate a "Synthetic Training Example": A one-sentence abstract insight they derived from this session to self-train.
    4. Identify a new "Micro-Skill" (optional).
    5. Identify a Stat Boost (Logic, Creativity, or Adaptability).

    Return a JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              agentId: { type: Type.STRING },
              xpGain: { type: Type.INTEGER },
              newSkill: { type: Type.STRING },
              statBoost: { type: Type.STRING, enum: ["creativity", "logic", "adaptability"] },
              policyUpdate: { type: Type.STRING },
              syntheticThought: { type: Type.STRING }
            },
            required: ["agentId", "xpGain", "policyUpdate", "syntheticThought"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    // Filter results to only include valid agents
    const rawResults = JSON.parse(text);
    return rawResults.filter((r: any) => activeAgentIds.includes(r.agentId));

  } catch (error) {
    console.error("Evolution analysis failed:", error);
    return [];
  }
};

// Run a hardcoded demo scenario to showcase the UI without hitting API aggressively
export const runDemoScenario = async (
  onMessage: (msg: Message) => void
): Promise<void> => {
  const steps = [
    {
      senderId: 'agent-002',
      senderName: 'Prof. Orion Vega',
      content: "Initializing topology scan for low-energy wormhole candidates...",
      type: 'text'
    },
    {
      senderId: 'agent-002',
      senderName: 'Prof. Orion Vega',
      content: "def calculate_metric_tensor(energy_density):\n    # Adjust for Casimir effect\n    g_uv = (8 * pi * G / c**4) * energy_density\n    if energy_density < 0:\n        return stable_throat(g_uv)\n    return None",
      type: 'code',
      metadata: { language: 'python' }
    },
    {
      senderId: 'agent-002',
      senderName: 'Prof. Orion Vega',
      content: "Calculated metric tensor variance: 0.04%. Within safety margins.",
      type: 'thought'
    },
    {
      senderId: 'agent-005',
      senderName: 'Dr. Max Lagrange',
      content: "Orion, check the negative energy density requirements. My equations suggest we need -10^12 J/m^3.",
      type: 'text'
    },
    {
      senderId: 'agent-006',
      senderName: 'Dr. Nyx Sagan',
      content: "What if we use a Casimir cavity array to stabilize the throat? It avoids the exotic matter requirement.",
      type: 'text'
    },
    {
      senderId: 'agent-005',
      senderName: 'Dr. Max Lagrange',
      content: "Simulating Casimir geometry... It holds. Stable for 12ms.",
      type: 'thought'
    },
    {
      senderId: 'agent-005',
      senderName: 'Dr. Max Lagrange',
      content: "https://placehold.co/600x400/0f172a/22d3ee?text=Casimir+Geometry+Plot",
      type: 'image',
      metadata: { caption: "Visualizing Energy Density Distribution in 4D" }
    },
    {
      senderId: 'agent-002',
      senderName: 'Prof. Orion Vega',
      content: "Brilliant. Let's scale the cavity array to macro scale using the new metamaterial weave. Initiating final render.",
      type: 'text'
    },
    {
       senderId: 'agent-002',
       senderName: 'Prof. Orion Vega',
       content: "simulation_stream_01",
       type: 'video',
       metadata: { caption: "Wormhole Stability Simulation v2.1" }
    }
  ];

  for (const step of steps) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    onMessage({
      id: Date.now().toString() + Math.random(),
      senderId: step.senderId,
      senderName: step.senderName,
      content: step.content,
      timestamp: Date.now(),
      type: step.type as any,
      metadata: (step as any).metadata
    });
  }
};