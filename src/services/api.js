const API_URL = 'https://api.openai.com/v1/chat/completions';

export const generateMindMap = async (prompt, model = 'gpt-3.5-turbo', temperature = 0.7) => {
  const openaiKey = process.env.REACT_APP_OPENAI_API_KEY;
  if (!openaiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert at creating mind maps. Generate a mind map structure for the given topic.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: temperature,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      mindmapText: data.choices[0].message.content,
      visualization: data.choices[0].message.content
    };
  } catch (error) {
    console.error('Error generating mind map:', error);
    throw error;
  }
}; 