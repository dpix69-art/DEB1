import React, { useMemo, useState } from 'react';
import { Exercise } from '../../types';
import { ResultBadge } from '../ResultBadge';
import { compareExact } from '../../lib/compare';

type ExOrderItem = { words: string[]; solution: string };
interface OrderProps {
  exercise: Exercise & { type: 'order'; content: ExOrderItem[] };
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Order({ exercise }: OrderProps) {
  const items = exercise.content;

  // фиксируем случайный порядок слов для каждого пункта на время жизни компонента
  const initialPools = useMemo(
    () => items.map(({ words }) => shuffle(words)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(items)]
  );

  // состояние по каждому пункту
  const [available, setAvailable] = useState<string[][]>(initialPools);
  const [selected, setSelected] = useState<string[][]>(items.map(() => []));
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const [isCorrect, setIsCorrect] = useState<boolean[]>(items.map(() => false));

  const handleChoose = (idx: number, word: string) => {
    if (checked[idx]) return; // нельзя менять после проверки (как в Gap)
    setAvailable(prev => {
      const copy = prev.map(a => a.slice());
      const pos = copy[idx].indexOf(word);
      if (pos >= 0) copy[idx].splice(pos, 1);
      return copy;
    });
    setSelected(prev => {
      const copy = prev.map(a => a.slice());
      copy[idx].push(word); // порядок по кликам пользователя
      return copy;
    });
  };

  const handleUnchoose = (idx: number, word: string) => {
    if (checked[idx]) return;
    setSelected(prev => {
      const copy = prev.map(a => a.slice());
      const pos = copy[idx].indexOf(word);
      if (pos >= 0) copy[idx].splice(pos, 1);
      return copy;
    });
    setAvailable(prev => {
      const copy = prev.map(a => a.slice());
      copy[idx].push(word);
      return copy;
    });
  };

  const handleReset = (idx: number) => {
    setSelected(prev => {
      const copy = prev.map(a => a.slice());
      copy[idx] = [];
      return copy;
    });
    setAvailable(prev => {
      const copy = prev.map(a => a.slice());
      copy[idx] = shuffle(items[idx].words);
      return copy;
    });
    setChecked(prev => {
      const copy = prev.slice();
      copy[idx] = false;
      return copy;
    });
    setIsCorrect(prev => {
      const copy = prev.slice();
      copy[idx] = false;
      return copy;
    });
  };

  const handleCheck = (idx: number) => {
    const userSentence = selected[idx].join(' ').trim().replace(/\s+/g, ' ');
    const solution = items[idx].solution.trim().replace(/\s+/g, ' ');
    const ok = compareExact(userSentence, solution);
    setIsCorrect(prev => {
      const copy = prev.slice();
      copy[idx] = ok;
      return copy;
    });
    setChecked(prev => {
      const copy = prev.slice();
      copy[idx] = true;
      return copy;
    });
  };

  return (
    <div className="space-y-4">
      <div className="font-medium" style={{ color: '#111' }}>{exercise.task}</div>

      {items.map((it, idx) => (
        <div key={idx} className="p-4 border border-gray-200 rounded-lg space-y-4">
          {/* пул доступных слов */}
          <div>
            <div className="text-sm mb-2" style={{ color: '#111' }}>
              Tap words to build a sentence
            </div>
            <div className="flex flex-wrap gap-2">
              {available[idx].map((w, i) => (
                <button
                  key={`${w}-${i}`}
                  type="button"
                  onClick={() => handleChoose(idx, w)}
                  disabled={checked[idx]}
                  className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                >
                  {w}
                </button>
              ))}
              {available[idx].length === 0 && (
                <span className="text-sm text-gray-500">No more words</span>
              )}
            </div>
          </div>

          {/* собранное пользователем предложение (как input-area) */}
          <div>
            <div className="text-sm mb-2" style={{ color: '#111' }}>
              Your sentence (tap a word to remove)
            </div>
            <div className="min-h-[44px] w-full rounded border border-gray-300 bg-white px-3 py-2 flex flex-wrap items-center gap-2">
              {selected[idx].length === 0 ? (
                <span className="text-sm text-gray-500">—</span>
              ) : (
                selected[idx].map((w, i) => (
                  <button
                    key={`sel-${w}-${i}`}
                    type="button"
                    onClick={() => handleUnchoose(idx, w)}
                    disabled={checked[idx]}
                    className="px-3 py-1.5 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                    title="Remove word"
                  >
                    {w}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* кнопки действий + результат */}
          <div className="flex gap-2">
            <button
              onClick={() => handleCheck(idx)}
              disabled={checked[idx] || selected[idx].length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Check
            </button>
            <button
              onClick={() => handleReset(idx)}
              disabled={!checked[idx] && selected[idx].length === 0 && available[idx].length === it.words.length}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>

          {/* итог как в Gap — через ResultBadge */}
          {checked[idx] && (
            <ResultBadge
              isCorrect={isCorrect[idx]}
              correctAnswer={isCorrect[idx] ? undefined : it.solution}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default Order;
