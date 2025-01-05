export function extractTextContent(data: any, source: 'claude' | 'perplexity'): string {
  switch (source) {
    case 'claude':
      return data.content?.[0]?.text || '';
    case 'perplexity':
      return data.choices?.[0]?.message?.content || '';
    default:
      return '';
  }
}