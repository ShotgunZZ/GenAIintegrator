import React from 'react';
import { ModelSettings } from './ModelSettings';
import { AIModelConfig } from '../types';
import { saveModelConfigs } from '../utils/storage';

interface SettingsPanelProps {
  configs: AIModelConfig[];
  onUpdateConfig: (name: string, apiKey: string) => void;
}

export function SettingsPanel({ configs, onUpdateConfig }: SettingsPanelProps) {
  const handleSave = () => {
    saveModelConfigs(configs);
    alert('API keys saved successfully!');
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h2 className="font-semibold">API Configuration</h2>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Keys
        </button>
      </div>
      {configs.map(config => (
        <ModelSettings
          key={config.name}
          config={config}
          onUpdateConfig={onUpdateConfig}
        />
      ))}
    </div>
  );
}