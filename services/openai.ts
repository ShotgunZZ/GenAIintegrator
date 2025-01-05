import { AIResponse } from '../types';

export async function generateChatGPTResponse(prompt: string, apiKey: string): Promise<AIResponse> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      loading: false
    };
  } catch (error) {
    return {
      content: '',
      loading: false,
      error: error instanceof Error ? error.message : 'Failed to generate response'
    };
  }
}