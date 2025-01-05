import { AIResponse } from '../types';
import { extractTextContent } from '../utils/apiHelpers';

export async function generateClaudeResponse(prompt: string, apiKey: string): Promise<AIResponse> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey, // Don't add 'Bearer' prefix
        'anthropic-version': '2024-01-01'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        model: 'claude-3-opus-20240229',
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.content[0].text,
      loading: false
    };
  } catch (error) {
    console.error('Claude API Error:', error);
    return {
      content: '',
      loading: false,
      error: error instanceof Error 
        ? `Claude API Error: ${error.message}` 
        : 'Failed to generate response from Claude'
    };
  }
}