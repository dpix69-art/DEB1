import React, { useState } from 'react';
import { Exercise } from '../../types';
import { compareDaWo } from '../../lib/compare';
import { ResultBadge } from '../ResultBadge';

interface DaWoProps {
  exercise: Exercise & { type: 'da_wo' };
}

export function DaWo({ exercise }: DaWoProps) {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  
  const check = () => {
    const isCorrect = compareDaWo(answer, exercise.solution);
    setResult(isCorrect);
    setHasChecked(true);
  };
  
  const reset = () => {
    setAnswer('');
    setResult(null);
    setHasChecked(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="font-medium" style={{ color: '#111' }}>{exercise.task}</div>
      
      <div className="p-4 border border-gray-200 rounded-lg space-y-4">
        <div className="p-3 bg-gray-50 rounded">
          <div style={{ color: '#111' }}>{exercise.sentence}</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#666' }}>
            Your answer:
          </label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={hasChecked}
            autoCorrect="off"
            autoCapitalize="off"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            placeholder="Enter your rephrased sentence..."
          />
        </div>
        
        {hasChecked && result !== null && (
          <ResultBadge
            isCorrect={result}
            correctAnswer={result ? undefined : exercise.solution}
          />
        )}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={check}
          disabled={hasChecked || !answer.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Check
        </button>
        <button
          onClick={reset}
          disabled={!answer && !hasChecked}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>
    </div>
  );
}