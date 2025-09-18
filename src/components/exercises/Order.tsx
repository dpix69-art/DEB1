import React, { useMemo, useState } from 'react';

type ExOrderItem = { words: string[]; solution: string };
type OrderExercise = {
  type: 'order';
  task: string;
  content: ExOrderItem[];
};

type Props = {
  exercise: OrderExercise;
};

type Result = 'correct' | 'incorrect' | null;

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(s: string): string {
  return s.trim().replace(/\s+/g, ' ');
}

export function Order({ exercise }: Props) {
  const items = exercise.content;

  // фиксируем случайный порядок слов для каждого задания на время жизни компонента
  const initialPools = useMemo(
    () => items.map(({ words }) => shuffle(words)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(items)]
  );

  const [available, setAvailable] = useState<string[][]>(initialPools);
  const [selected, setSelected] = useState<string[][]>(items.map(() => []));
  const [result, setResult] = useState<Result[]>(items.map(() => null));

  const handleChoose = (idx: number, word: string) => {
    setAvailable(prev => {
      const copy = prev.map(a => a.slice());
      // снимаем только первое вхождение (если слова повторяются)
      const pos = copy[idx].indexOf(word);
      if (pos >= 0) copy[idx].splice(pos, 1);
      return copy;
    });
    setSelected(prev => {
      const copy = prev.map(a => a.slice());
      copy[idx].push(word); // важное: кладем в порядке кликов пользователя
      return copy;
    });
    setResult(prev => {
      const copy = prev.slice();
      copy[idx] = null;
      return copy;
    });
  };

  const handleUnchoose = (idx: number, word: string) => {
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
    setResult(prev => {
      const copy = prev.slice();
      copy[idx] = null;
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
      copy[idx] = shuffle(items[idx].words); // пересобираем пул случайно
      return copy;
    });
    setResult(prev => {
      const copy = prev.slice();
      copy[idx] = null;
      return copy;
    });
  };

  const handleCheck = (idx: number) => {
    const user = normalize(selected[idx].join(' '));
    const sol = normalize(items[idx].solution);
    setResult(prev => {
      const copy = prev.slice();
      copy[idx] = user === sol ? 'correct' : 'incorrect';
      return copy;
    });
  };

  return (
    <section className="mt-6">
      <h3 className="text-base font-medium text-[var(--ink)] mb-3">{exercise.task}</h3>

      {items.map((it, idx) => {
        const status = result[idx];

        return (
          <div
            key={idx}
            className="mb-6 rounded-2xl border border-black/10 p-4 bg-[var(--paper)]"
          >
            {/* Пул доступных слов */}
            <div className="mb-4">
              <div className="text-sm text-[var(--muted)] mb-1">Tap words to build a sentence</div>
              <div className="flex flex-wrap gap-2">
                {available[idx].map((w, i) => (
                  <button
                    key={`${w}-${i}`}
                    type="button"
                    onClick={() => handleChoose(idx, w)}
                    className="px-3 py-2 rounded-full border border-black/10 text-sm hover:bg-black/5 transition"
                  >
                    {w}
                  </button>
                ))}
                {available[idx].length === 0 && (
                  <span className="text-sm text-[var(--muted)]">No more words</span>
                )}
              </div>
            </div>

            {/* «Поле ввода»: собранное пользователем предложение (выглядит как input-area) */}
            <div className="mb-4">
              <div className="text-sm text-[var(--muted)] mb-1">Your sentence (tap a word to remove)</div>
              <div className="min-h-[44px] w-full rounded-xl border border-black/10 bg-white px-3 py-2 flex flex-wrap items-center gap-2">
                {selected[idx].length === 0 ? (
                  <span className="text-sm text-[var(--muted)]">—</span>
                ) : (
                  selected[idx].map((w, i) => (
                    <button
                      key={`sel-${w}-${i}`}
                      type="button"
                      onClick={() => handleUnchoose(idx, w)}
                      className="px-3 py-1.5 rounded-full border border-black/10 text-sm bg-black/5 hover:bg-black/10 transition"
                      title="Remove word"
                    >
                      {w}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Кнопки действий (слева), статус и правильный ответ — под ними, тоже слева */}
            <div className="flex items-center gap-3 mb-2">
              <button
                type="button"
                onClick={() => handleCheck(idx)}
                className="px-4 py-2 rounded-xl border border-black/10 text-sm font-medium hover:bg-black/5 transition"
              >
                Check
              </button>
              <button
                type="button"
                onClick={() => handleReset(idx)}
                className="px-4 py-2 rounded-xl border border-black/10 text-sm hover:bg-black/5 transition"
                title="Reset this item"
              >
                Reset
              </button>
            </div>

            {/* Результат слева, без вытеснения вправо */}
            {status && (
              <div aria-live="polite" className="text-sm font-medium mt-1">
                <span className={status === 'correct' ? 'text-[var(--good)]' : 'text-[var(--bad)]'}>
                  {status === 'correct' ? 'Correct' : 'Incorrect'}
                </span>
              </div>
            )}

            {/* Показ правильного ответа при ошибке — тоже слева */}
            {status === 'incorrect' && (
              <div className="mt-1 text-sm">
                <span className="text-[var(--muted)] mr-2">Correct answer:</span>
                <span className="font-medium">{it.solution}</span>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

// Оставляю и именованный, и default-экспорт — совместимо с любым импортом
export default Order;
