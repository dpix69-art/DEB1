import React, { useState } from "react";
import { Exercise } from "../../types";
import { compareDaWo } from "../../lib/compare";
import { ResultBadge } from "../ResultBadge";

interface DaWoProps {
  exercise: Extract<Exercise, { type: "da_wo" }>;
}

// Нормализация: приводим к массиву элементов (и поддерживаем legacy)
function toItems(ex: Extract<Exercise, { type: "da_wo" }>) {
  if (Array.isArray((ex as any).content) && (ex as any).content.length > 0) {
    return (ex as any).content as Array<{ sentence: string; solution: string }>;
  }
  if ((ex as any).sentence && (ex as any).solution) {
    return [{ sentence: (ex as any).sentence, solution: (ex as any).solution }];
  }
  return [];
}

export function DaWo({ exercise }: DaWoProps) {
  const items = toItems(exercise);
  // по одному состоянию на каждый пункт
  const [answers, setAnswers] = useState<string[]>(Array(items.length).fill(""));
  const [checked, setChecked] = useState<boolean[]>(Array(items.length).fill(false));
  const [results, setResults] = useState<(boolean | null)[]>(Array(items.length).fill(null));

  const checkOne = (idx: number) => {
    const ok = compareDaWo(answers[idx], items[idx].solution);
    setResults(prev => prev.map((v, i) => (i === idx ? ok : v)));
    setChecked(prev => prev.map((v, i) => (i === idx ? true : v)));
  };

  const resetOne = (idx: number) => {
    setAnswers(prev => prev.map((v, i) => (i === idx ? "" : v)));
    setChecked(prev => prev.map((v, i) => (i === idx ? false : v)));
    setResults(prev => prev.map((v, i) => (i === idx ? null : v)));
  };

  const onChange = (idx: number, val: string) => {
    setAnswers(prev => prev.map((v, i) => (i === idx ? val : v)));
  };

  return (
    <div className="space-y-4">
      <div className="font-medium" style={{ color: "#111" }}>
        {exercise.task}
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg space-y-4">
            <div className="p-3 bg-gray-50 rounded">
              <div style={{ color: "#111" }}>{item.sentence}</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#666" }}>
                Your answer:
              </label>
              <input
                type="text"
                value={answers[i]}
                onChange={(e) => onChange(i, e.target.value)}
                disabled={checked[i]}
                autoCorrect="off"
                autoCapitalize="off"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="W-Frage mit wo- (z. B. Woran ...?)"
              />
            </div>

            {checked[i] && results[i] !== null && (
              <ResultBadge
                isCorrect={!!results[i]}
                correctAnswer={results[i] ? undefined : item.solution}
              />
            )}

            <div className="flex gap-2">
              <button
                onClick={() => checkOne(i)}
                disabled={checked[i] || !answers[i].trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Check
              </button>
              <button
                onClick={() => resetOne(i)}
                disabled={!answers[i] && !checked[i]}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Reset
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
