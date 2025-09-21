// src/pages/Dictionary.tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getDictionaryIndex } from '../lib/data';
import { BookOpen } from 'lucide-react';

type DictItem = {
  id: string;
  headword: string;
  pos: string;
};

const normPOS = (pos?: string) => {
  const p = (pos || '').toUpperCase();
  if (p === 'PHRASE') return 'PHR';
  return p;
};

const POS_TITLE: Record<string, string> = {
  N: 'Nouns',
  V: 'Verbs',
  ADJ: 'Adjectives',
  ADV: 'Adverbs',
  PHR: 'Phrases',
};

const POS_ROUTE: Record<string, string> = {
  N: 'N',
  V: 'V',
  ADJ: 'ADJ',
  ADV: 'ADV',
  PHR: 'PHR',
};

const ORDER = ['N', 'V', 'ADJ', 'ADV', 'PHR'];

export default function Dictionary() {
  const items = (getDictionaryIndex() as DictItem[]) || [];

  const buckets = useMemo(() => {
    const map = new Map<string, number>();
    for (const it of items) {
      const key = normPOS(it.pos);
      if (!key) continue;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return ORDER
      .filter(k => map.get(k))
      .map(k => ({ pos: k, title: POS_TITLE[k] || k, count: map.get(k) || 0 }));
  }, [items]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold" style={{ color: '#111' }}>Dictionary</h1>
          <div className="text-sm" style={{ color: '#666' }}>
            {items.length} {items.length === 1 ? 'Eintrag' : 'Einträge'}
          </div>
        </div>

        {buckets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-sm" style={{ color: '#666' }}>
            Похоже, словарь пуст. Убедись, что файлы лежат в <code className="px-1 py-0.5 rounded bg-gray-100">/src/data/dictionary/*.json</code>
            или в <code className="px-1 py-0.5 rounded bg-gray-100">/src/data/dictionary.json</code>.
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {buckets.map(({ pos, title, count }) => (
              <Link
                key={pos}
                to={`/dictionary/${POS_ROUTE[pos]}`}
                className="group block"
              >
                <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg p-2 border" style={{ borderColor: '#E5E7EB', background: '#F9FAFB' }}>
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold leading-tight" style={{ color: '#111' }}>
                          {title}
                        </h2>
                        <div className="text-sm" style={{ color: '#6B7280' }}>
                          {count} {count === 1 ? 'Eintrag' : 'Einträge'}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm rounded-full px-2 py-0.5 border"
                      style={{ borderColor: '#E5E7EB', color: '#374151', background: '#F9FAFB' }}>
                      {pos}
                    </span>
                  </div>

                  <div className="mt-4 text-sm" style={{ color: '#6B7280' }}>
                    Открой, чтобы посмотреть список и поискать по заголовку или переводу.
                  </div>

                  <div className="mt-4 text-right">
                    <span className="text-sm group-hover:underline" style={{ color: '#111' }}>
                      Открыть →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
