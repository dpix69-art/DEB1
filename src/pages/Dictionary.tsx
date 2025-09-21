// src/pages/Dictionary.tsx
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDictionaryIndex } from '../lib/data';

type DictItem = {
  id: string;
  headword: string;
  pos: string;
  preview?: string;
  translation_ru?: string;
  register?: string;
  b1_verified?: boolean;
};

const latinize = (s: string) =>
  (s || '')
    .toLowerCase()
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss');

const POS_KEY = (pos?: string) => {
  const p = (pos || '').toUpperCase();
  if (p === 'PHRASE') return 'PHR';
  return p;
};

const CATEGORY_LABEL: Record<string, string> = {
  N: 'Nouns',
  V: 'Verbs',
  ADJ: 'Adjectives',
  ADV: 'Adverbs',
  PHR: 'Phrases',
};

const categoryOrder = ['N', 'V', 'ADJ', 'ADV', 'PHR'] as const;

const POS_LABEL = (pos?: string) => {
  switch ((pos || '').toUpperCase()) {
    case 'N': return 'N';
    case 'V': return 'V';
    case 'ADJ': return 'ADJ';
    case 'ADV': return 'ADV';
    case 'PHR':
    case 'PHRASE': return 'PHR';
    default: return pos || '';
  }
};

const byAlpha = (a: DictItem, b: DictItem) =>
  latinize(a.headword).localeCompare(latinize(b.headword));

export function Dictionary() {
  const items = (getDictionaryIndex() || []) as DictItem[];
  const [q, setQ] = useState('');

  const byPosCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const it of items) {
      const k = POS_KEY(it.pos);
      if (!k) continue;
      m.set(k, (m.get(k) || 0) + 1);
    }
    return m;
  }, [items]);

  const filtered = useMemo(() => {
    if (!q.trim()) return [...items].sort(byAlpha);
    const needle = q.trim().toLowerCase();
    return items
      .filter(it =>
        (it.headword || '').toLowerCase().includes(needle) ||
        (it.translation_ru || '').toLowerCase().includes(needle)
      )
      .sort(byAlpha);
  }, [items, q]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold" style={{ color: '#111' }}>Dictionary</h1>
          <div className="text-sm" style={{ color: '#666' }}>
            {items.length} {items.length === 1 ? 'Eintrag' : 'Einträge'}
          </div>
        </div>

        <div className="mb-4">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Suche / Поиск… (DE/RU)"
            className="w-full rounded-lg border px-4 py-2"
            style={{ borderColor: '#E5E7EB', background: '#FFF', color: '#111' }}
          />
        </div>

        {/* Категории (видны, если по ним есть записи) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          {categoryOrder.map(k => {
            const count = byPosCounts.get(k) || 0;
            if (count === 0) return null;
            return (
              <Link
                key={k}
                to={`/dictionary/category/${k}`}
                className="rounded-lg border p-4 hover:bg-gray-50"
                style={{ borderColor: '#E5E7EB' }}
              >
                <div className="text-sm" style={{ color: '#6B7280' }}>{CATEGORY_LABEL[k]}</div>
                <div className="text-2xl font-semibold" style={{ color: '#111' }}>{count}</div>
              </Link>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0">
          {filtered.length === 0 ? (
            <div className="p-6 text-sm" style={{ color: '#666' }}>
              Ничего не найдено. Попробуйте изменить запрос.
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#E5E7EB' }}>
              {filtered.map((it) => (
                <Link
                  key={it.id}
                  to={`/dictionary/${it.id}`}
                  className="block p-4 sm:p-5 hover:bg-gray-50 focus:bg-gray-50"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <div className="text-lg font-semibold" style={{ color: '#111' }}>
                      {it.headword}
                    </div>
                    <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-xs"
                      style={{ borderColor: '#E5E7EB', color: '#374151', background: '#F9FAFB' }}>
                      {POS_LABEL(it.pos)}
                    </span>
                    {it.register ? (
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs"
                        style={{ borderColor: '#E5E7EB', color: '#6B7280', background: '#F3F4F6' }}>
                        {it.register}
                      </span>
                    ) : null}
                    {it.b1_verified ? (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs"
                        style={{ background: '#ECFDF5', color: '#065F46' }}>
                        B1
                      </span>
                    ) : null}
                  </div>

                  <div className="text-sm mb-2">
                    {it.translation_ru ? (
                      <span style={{ color: '#111' }}>{it.translation_ru}</span>
                    ) : null}
                    {it.preview && it.preview !== it.translation_ru ? (
                      <span style={{ color: '#6B7280' }}> — {it.preview}</span>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
