import React from 'react';
import { AIResponse } from '../types';
import { Loader2 } from 'lucide-react';

interface AIOutputProps {
  modelName: string;
  response: AIResponse;
}

export function AIOutput({ modelName, response }: AIOutputProps) {
  return (
    <div className="flex-1 min-w-0 p-6">
      <h2 className="text-xl font-semibold mb-4">{modelName}</h2>
      <div className="bg-white rounded-lg p-4 min-h-[200px] shadow-sm">
        {response.loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : response.error ? (
          <p className="text-red-500">{response.error}</p>
        ) : (
          <p className="whitespace-pre-wrap">{response.content}</p>
        )}
      </div>
    </div>
  );
}