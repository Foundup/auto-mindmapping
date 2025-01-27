export const AI_MODELS = {
  GPT4: {
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'Most capable GPT model for complex tasks',
    maxTokens: 8192,
    temperature: 0.7,
    apiEndpoint: '/api/generate/gpt4'
  },
  GPT35: {
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Fast and efficient for most tasks',
    maxTokens: 4096,
    temperature: 0.7,
    apiEndpoint: '/api/generate/gpt35'
  },
  CLAUDE2: {
    name: 'Claude 2',
    provider: 'Anthropic',
    description: 'Advanced reasoning and analysis',
    maxTokens: 100000,
    temperature: 0.7,
    apiEndpoint: '/api/generate/claude2'
  },
  CLAUDE3: {
    name: 'Claude 3',
    provider: 'Anthropic',
    description: 'Latest Claude model with enhanced capabilities',
    maxTokens: 200000,
    temperature: 0.7,
    apiEndpoint: '/api/generate/claude3'
  },
  DEEPSEEK: {
    name: 'DeepSeek Coder',
    provider: 'DeepSeek',
    description: 'Specialized in code understanding and generation',
    maxTokens: 8192,
    temperature: 0.7,
    apiEndpoint: '/api/generate/deepseek'
  },
  LLAMA2: {
    name: 'LLaMA 2 70B',
    provider: 'Meta',
    description: 'Open source large language model',
    maxTokens: 4096,
    temperature: 0.7,
    apiEndpoint: '/api/generate/llama2'
  },
  MIXTRAL: {
    name: 'Mixtral 8x7B',
    provider: 'Mistral AI',
    description: 'Powerful mixture-of-experts model',
    maxTokens: 32768,
    temperature: 0.7,
    apiEndpoint: '/api/generate/mixtral'
  },
  GEMINI_PRO: {
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Google\'s most capable general-purpose model',
    maxTokens: 32768,
    temperature: 0.7,
    apiEndpoint: '/api/generate/gemini'
  },
  GROK1: {
    name: 'Grok-1',
    provider: 'xAI',
    description: 'Real-time knowledge and witty responses',
    maxTokens: 8192,
    temperature: 0.7,
    apiEndpoint: '/api/generate/grok'
  },
  COHERE_COMMAND: {
    name: 'Command-R',
    provider: 'Cohere',
    description: 'Specialized in understanding and generation',
    maxTokens: 4096,
    temperature: 0.7,
    apiEndpoint: '/api/generate/cohere'
  },
  PALM2: {
    name: 'PaLM 2',
    provider: 'Google',
    description: 'Advanced language understanding and generation',
    maxTokens: 8192,
    temperature: 0.7,
    apiEndpoint: '/api/generate/palm2'
  },
  YI: {
    name: 'Yi-34B',
    provider: '01.AI',
    description: 'High-performance bilingual model',
    maxTokens: 4096,
    temperature: 0.7,
    apiEndpoint: '/api/generate/yi'
  },
  QWEN: {
    name: 'Qwen 72B',
    provider: 'Alibaba',
    description: 'Advanced multilingual capabilities',
    maxTokens: 8192,
    temperature: 0.7,
    apiEndpoint: '/api/generate/qwen'
  }
}; 