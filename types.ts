export interface AIResponse {
  content: string;
  loading: boolean;
  error?: string;
}

export interface AIModelConfig {
  name: string;
  isAuthenticated: boolean;
  apiKey?: string;
}