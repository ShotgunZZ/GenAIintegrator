const STORAGE_KEY = 'ai-model-configs';

export function saveModelConfigs(configs: Array<{ name: string; apiKey?: string }>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
}

export function loadModelConfigs(): Array<{ name: string; apiKey?: string }> {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}