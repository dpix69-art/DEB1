import React from 'react';

interface ResultBadgeProps {
  isCorrect: boolean;
  correctAnswer?: string;
}

export function ResultBadge({ isCorrect, correctAnswer }: ResultBadgeProps) {
  return (
    <div className="mt-4 space-y-2">
      <div
        className={`inline-block px-3 py-1 rounded text-sm font-medium ${
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        {isCorrect ? 'Correct' : 'Incorrect'}
      </div>
      {!isCorrect && correctAnswer && (
        <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
          <div className="text-sm font-medium" style={{ color: '#111' }}>Correct answer:</div>
          <div className="text-sm" style={{ color: '#666' }}>{correctAnswer}</div>
        </div>
      )}
    </div>
  );
}