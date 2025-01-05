import { AIResponse } from '../types';

export async function generatePerplexityResponse(prompt: string, apiKey: string): Promise<AIResponse> {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // Make sure key starts with 'pplx-'
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-instruct',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      loading: false
    };
  } catch (error) {
    console.error('Perplexity API Error:', error);
    return {
      content: '',
      loading: false,
      error: error instanceof Error 
        ? `Perplexity API Error: ${error.message}` 
        : 'Failed to generate response from Perplexity'
    };
  }
}