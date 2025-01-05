import React, { useState } from 'react';
import { AIModelConfig } from '../types';
import { Key } from 'lucide-react';

interface ModelSettingsProps {
  config: AIModelConfig;
  onUpdateConfig: (name: string, apiKey: string) => void;
}

export function ModelSettings({ config, onUpdateConfig }: ModelSettingsProps) {
  const [apiKey, setApiKey] = useState(config.apiKey || '');

  return (
    <div className="p-4 border-b">
      <div className="flex items-center gap-2">
        <Key className="w-4 h-4 text-gray-500" />
        <input
          type="password"
          value={apiKey}
          placeholder={`${config.name} API Key`}
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setApiKey(e.target.value)}
          onBlur={() => onUpdateConfig(config.name, apiKey)}
        />
      </div>
    </div>
  );
}