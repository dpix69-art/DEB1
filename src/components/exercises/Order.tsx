import React, { useState } from 'react';
import { Exercise } from '../../types';
import { compareOrder } from '../../lib/compare';
import { ResultBadge } from '../ResultBadge';

interface OrderProps {
  exercise: Exercise & { type: 'order' };
}

export function Order({ exercise }: OrderProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [results, setResults] = useState<boolean[]>([]);
  const [hasChecked, setHasChecked] = useState(false);
  
  const addWord = (word: string, itemIndex: number, wordIndex: number) => {
    const key = `${itemIndex}-${wordIndex}`;
    if (selectedWords.includes(key)) return;
    setSelectedWords([...selectedWords, key]);
  };
  
  const removeWord = (keyToRemove: string) => {
    setSelectedWords(selectedWords.filter(key => key !== keyToRemove));
  };
  
  const reset = () => {
    setSelectedWords([]);
    setResults([]);
    setHasChecked(false);
  };
  
  const check = () => {
    const newResults: boolean[] = [];
    
    exercise.content.forEach((item, idx) => {
      const wordsForThisItem = selectedWords
        .filter(key => key.startsWith(`${idx}-`))
        .sort()
        .map(key => {
          const [, wordIdx] = key.split('-');
          return item.words[parseInt(wordIdx)];
        });
      
      const isCorrect = compareOrder(wordsForThisItem, item.solution);
      newResults.push(isCorrect);
    });
    
    setResults(newResults);
    setHasChecked(true);
  };
  
  return (
    <div className="space-y-4">
      <div className="font-medium" style={{ color: '#111' }}>{exercise.task}</div>
      
      {exercise.content.map((item, itemIndex) => (
        <div key={itemIndex} className="space-y-3 p-4 border border-gray-200 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {item.words.map((word, wordIndex) => {
              const key = `${itemIndex}-${wordIndex}`;
              const isSelected = selectedWords.includes(key);
              
              return (
                <button
                  key={wordIndex}
                  onClick={() => isSelected ? removeWord(key) : addWord(word, itemIndex, wordIndex)}
                  disabled={hasChecked}
                  className={`px-3 py-2 rounded border transition-colors ${
                    isSelected 
                      ? 'bg-blue-100 border-blue-300 text-blue-800' 
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  } ${hasChecked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {word}
                </button>
              );
            })}
          </div>
          
          <div className="min-h-[2rem] p-2 border-2 border-dashed border-gray-300 rounded">
            {selectedWords
              .filter(key => key.startsWith(`${itemIndex}-`))
              .sort()
              .map(key => {
                const [, wordIdx] = key.split('-');
                const word = item.words[parseInt(wordIdx)];
                return (
                  <span key={key} className="inline-block mr-2" style={{ color: '#111' }}>
                    {word}
                  </span>
                );
              })}
          </div>
          
          {hasChecked && (
            <ResultBadge
              isCorrect={results[itemIndex]}
              correctAnswer={results[itemIndex] ? undefined : item.solution}
            />
          )}
        </div>
      ))}
      
      <div className="flex gap-2">
        <button
          onClick={check}
          disabled={hasChecked || selectedWords.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Check
        </button>
        <button
          onClick={reset}
          disabled={selectedWords.length === 0 && !hasChecked}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>
    </div>
  );
}