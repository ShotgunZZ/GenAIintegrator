import React, { useState, useEffect } from 'react';
import { AIOutput } from './components/AIOutput';
import { SettingsPanel } from './components/SettingsPanel';
import { AIResponse, AIModelConfig } from './types';
import { MessageSquare, Settings } from 'lucide-react';
import { loadModelConfigs } from './utils/storage';
import { generateChatGPTResponse } from './services/openai';
import { generateClaudeResponse } from './services/anthropic';
import { generatePerplexityResponse } from './services/perplexity';

function App() {
  const [prompt, setPrompt] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [responses, setResponses] = useState<Record<string, AIResponse>>({
    'ChatGPT': { content: '', loading: false },
    'Claude': { content: '', loading: false },
    'Perplexity': { content: '', loading: false },
  });
  const [modelConfigs, setModelConfigs] = useState<AIModelConfig[]>([
    { name: 'ChatGPT', isAuthenticated: false },
    { name: 'Claude', isAuthenticated: false },
    { name: 'Perplexity', isAuthenticated: false },
  ]);

  useEffect(() => {
    const savedConfigs = loadModelConfigs();
    if (savedConfigs.length > 0) {
      setModelConfigs(prev => prev.map(config => {
        const savedConfig = savedConfigs.find(sc => sc.name === config.name);
        return savedConfig 
          ? { ...config, apiKey: savedConfig.apiKey, isAuthenticated: !!savedConfig.apiKey }
          : config;
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Set loading state for all models
    setResponses(prev => {
      const newResponses = { ...prev };
      Object.keys(newResponses).forEach(model => {
        newResponses[model] = { content: '', loading: true };
      });
      return newResponses;
    });

    // Generate responses from all configured models
    const config = modelConfigs.reduce((acc, curr) => {
      acc[curr.name] = curr;
      return acc;
    }, {} as Record<string, AIModelConfig>);

    // ChatGPT
    if (config.ChatGPT.apiKey) {
      const chatGPTResponse = await generateChatGPTResponse(prompt, config.ChatGPT.apiKey);
      setResponses(prev => ({ ...prev, ChatGPT: chatGPTResponse }));
    } else {
      setResponses(prev => ({
        ...prev,
        ChatGPT: { content: '', loading: false, error: 'API key not configured' }
      }));
    }

    // Claude
    if (config.Claude.apiKey) {
      const claudeResponse = await generateClaudeResponse(prompt, config.Claude.apiKey);
      setResponses(prev => ({ ...prev, Claude: claudeResponse }));
    } else {
      setResponses(prev => ({
        ...prev,
        Claude: { content: '', loading: false, error: 'API key not configured' }
      }));
    }

    // Perplexity
    if (config.Perplexity.apiKey) {
      const perplexityResponse = await generatePerplexityResponse(prompt, config.Perplexity.apiKey);
      setResponses(prev => ({ ...prev, Perplexity: perplexityResponse }));
    } else {
      setResponses(prev => ({
        ...prev,
        Perplexity: { content: '', loading: false, error: 'API key not configured' }
      }));
    }
  };

  const updateModelConfig = (name: string, apiKey: string) => {
    setModelConfigs(prev =>
      prev.map(config =>
        config.name === name
          ? { ...config, apiKey, isAuthenticated: !!apiKey }
          : config
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Model Comparison</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {showSettings && (
          <SettingsPanel
            configs={modelConfigs}
            onUpdateConfig={updateModelConfig}
          />
        )}

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <MessageSquare className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Generate
            </button>
          </div>
        </form>

        <div className="grid grid-cols-3 gap-6">
          {Object.entries(responses).map(([model, response]) => (
            <AIOutput key={model} modelName={model} response={response} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;