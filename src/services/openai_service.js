import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function callOpenAI({ 
  prompt, 
  promptTemplate, 
  model = "gpt-4o-mini", 
  maxTokens = 2000, 
  temperature = 0.7,
  onProgress
}) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: promptTemplate
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: parseInt(maxTokens),
        temperature: parseFloat(temperature),
        stream: true
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to call OpenAI API');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedResponse = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.trim() === 'data: [DONE]') continue;
        
        try {
          const cleanedLine = line.replace(/^data: /, '');
          const parsed = JSON.parse(cleanedLine);
          const content = parsed.choices[0]?.delta?.content || '';
          
          accumulatedResponse += content;
          if (onProgress) {
            onProgress(accumulatedResponse);
          }
        } catch (e) {
          console.error('Error parsing line:', e);
        }
      }
    }

    return accumulatedResponse;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
} 