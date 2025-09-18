import React, { useState } from 'react';
import { Exercise } from '../../types';
import { compareExact } from '../../lib/compare';
import { ResultBadge } from '../ResultBadge';

interface ReadingProps {
  exercise: Exercise & { type: 'reading' };
}

export function Reading({ exercise }: ReadingProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [hasChecked, setHasChecked] = useState(false);
  
  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };
  
  const check = () => {
    const newResults: Record<number, boolean> = {};
    
    exercise.questions.forEach((question, index) => {
      const userAnswer = answers[index] || '';
      const isCorrect = compareExact(userAnswer, question.solution);
      newResults[index] = isCorrect;
    });
    
    setResults(newResults);
    setHasChecked(true);
  };
  
  const reset = () => {
    setAnswers({});
    setResults({});
    setHasChecked(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="font-medium" style={{ color: '#111' }}>{exercise.task}</div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <div style={{ color: '#111' }} className="whitespace-pre-wrap">{exercise.text}</div>
      </div>
      
      <div className="space-y-4">
        {exercise.questions.map((question, questionIndex) => (
          <div key={questionIndex} className="p-4 border border-gray-200 rounded-lg">
            <div className="font-medium mb-3" style={{ color: '#111' }}>{question.q}</div>
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${questionIndex}`}
                    value={option}
                    checked={answers[questionIndex] === option}
                    onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                    disabled={hasChecked}
                    className="disabled:cursor-not-allowed"
                  />
                  <span style={{ color: '#111' }}>{option}</span>
                </label>
              ))}
            </div>
            
            {hasChecked && (
              <ResultBadge
                isCorrect={results[questionIndex]}
                correctAnswer={results[questionIndex] ? undefined : question.solution}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={check}
          disabled={hasChecked || exercise.questions.some((_, idx) => !answers[idx])}
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