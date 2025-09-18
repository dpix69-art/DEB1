import React, { useState } from 'react';
import { Exercise } from '../../types';
import { compareExact } from '../../lib/compare';
import { ResultBadge } from '../ResultBadge';

interface GapProps {
  exercise: Exercise & { type: 'gap' };
}

export function Gap({ exercise }: GapProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [hasChecked, setHasChecked] = useState(false);
  
  const handleAnswerChange = (gapId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [gapId]: answer }));
  };
  
  const check = () => {
    const newResults: Record<number, boolean> = {};
    
    exercise.gaps.forEach(gap => {
      const userAnswer = answers[gap.id] || '';
      const isCorrect = compareExact(userAnswer, gap.solution);
      newResults[gap.id] = isCorrect;
    });
    
    setResults(newResults);
    setHasChecked(true);
  };
  
  const reset = () => {
    setAnswers({});
    setResults({});
    setHasChecked(false);
  };
  
  const renderTextWithGaps = () => {
    let text = exercise.text;
    const gaps = [...exercise.gaps].sort((a, b) => b.id - a.id); // Sort descending to avoid index issues
    
    gaps.forEach(gap => {
      const placeholder = `___ (${gap.id})`;
      const gapElement = `<select data-gap-id="${gap.id}">${gap.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}</select>`;
      text = text.replace(placeholder, `[GAP_${gap.id}]`);
    });
    
    return text;
  };
  
  return (
    <div className="space-y-4">
      <div className="font-medium" style={{ color: '#111' }}>{exercise.task}</div>
      
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="space-y-4">
          <div style={{ color: '#111' }}>
            {exercise.text.split(/___\s*\(\d+\)/).map((part, index) => {
              const gap = exercise.gaps[index];
              return (
                <span key={index}>
                  {part}
                  {gap && (
                    <select
                      value={answers[gap.id] || ''}
                      onChange={(e) => handleAnswerChange(gap.id, e.target.value)}
                      disabled={hasChecked}
                      className="mx-1 px-2 py-1 border border-gray-300 rounded disabled:bg-gray-100"
                    >
                      <option value="">Select...</option>
                      {gap.options.map((option, optIdx) => (
                        <option key={optIdx} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                </span>
              );
            })}
          </div>
          
          {hasChecked && (
            <div className="space-y-2">
              {exercise.gaps.map(gap => (
                <ResultBadge
                  key={gap.id}
                  isCorrect={results[gap.id]}
                  correctAnswer={results[gap.id] ? undefined : `Gap ${gap.id}: ${gap.solution}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={check}
          disabled={hasChecked || exercise.gaps.some(gap => !answers[gap.id])}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Check
        </button>
        <button
          onClick={reset}
          disabled={Object.keys(answers).length === 0 && !hasChecked}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>
    </div>
  );
}