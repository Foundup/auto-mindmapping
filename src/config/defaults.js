export const DEFAULT_MODEL = 'GPT4';
export const DEFAULT_MAX_TOKENS = 4096;
export const DEFAULT_TEMPERATURE = 0.7;
export const DEFAULT_PROMPT_TEMPLATE = 'BRAINSTORM';

export const API_ENDPOINTS = {
  GPT4: '/api/generate/gpt4',
  GPT35: '/api/generate/gpt35',
  CLAUDE2: '/api/generate/claude2',
  CLAUDE3: '/api/generate/claude3',
  DEEPSEEK: '/api/generate/deepseek',
  LLAMA2: '/api/generate/llama2',
  MIXTRAL: '/api/generate/mixtral',
  GEMINI_PRO: '/api/generate/gemini',
  GROK1: '/api/generate/grok',
  COHERE_COMMAND: '/api/generate/cohere',
  PALM2: '/api/generate/palm2',
  YI: '/api/generate/yi',
  QWEN: '/api/generate/qwen'
};

export const DEFAULT_PROMPT_TEMPLATE_TEXT = `You are an expert MVP (Minimum Viable Product) planner. Generate a mindmap structure and corresponding React Flow code.

INPUT:
- A product or feature idea that needs MVP planning
- The idea may be technical or non-technical

OUTPUT:
First, show the mindmap structure as text:

[Project Name] (center)
    |
    +--[Frontend]-----|
    |                 +--[UI]--|--<React.js>
    |                 |        +--[Complete]
    |                 |
    |                 +--[Display]--|--<Flow>
    |                              +--[Working]
    |
    +--[Backend]------|
                      +--[API]--|--<OpenAI>
                               +--[Connected]

Then, generate the React Flow code that implements this structure.

RULES:
1. Node Types & Structure:
   Level 0 (Center):
   {
     id: 'center',
     type: 'mindmap',
     data: { label: 'Project Name' },
     position: { x: 0, y: 0 },
     style: { backgroundColor: '#2563eb', color: 'white' }
   }
   
   Level 1 (Main Categories):
   {
     id: 'category-1',
     type: 'mindmap',
     data: { 
       label: 'Category Name',
       icon: 'folder'
     },
     position: { x: -200, y: -100 }
   }
   
   Level 2 (Features):
   {
     id: 'feature-1',
     type: 'mindmap',
     data: { 
       label: 'Feature Name',
       icon: 'puzzle-piece'
     },
     position: { x: -300, y: -150 }
   }
   
   Level 3 (Implementation):
   Resource: {
     id: 'resource-1',
     type: 'mindmap',
     data: { 
       label: 'Resource Name',
       icon: 'cube'
     }
   }
   Milestone: {
     id: 'milestone-1',
     type: 'mindmap',
     data: { 
       label: 'Milestone',
       icon: 'flag'
     }
   }

2. Edge Structure:
   {
     id: 'edge-1',
     source: 'center',
     target: 'category-1',
     type: 'smoothstep',
     animated: true
   }

Remember: First show the visual text structure of connections, then generate the React Flow code that implements it. Each node must have a unique ID and proper connections. The visual structure should match the code exactly.`; 