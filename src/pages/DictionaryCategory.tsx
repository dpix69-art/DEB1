// src/pages/DictionaryCategory.tsx
import React, { useMemo, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getDictionaryIndex } from '../lib/data';

type DictItem = {
  id: string;
  headword: string;
  pos: string;
  preview?: string;
  translation_ru?: string;
  gender?: 'm' | 'f' | 'n' | null;
  forms?: Record<string, string | null | undefined>;
  topics?: string[];
  register?: 'neutral' | 'formell' | 'ugs.' | string;
  b1_verified?: boolean;
  notes?: { usage?: string; collocations?: string[] };
};

const latinize = (s: string) =>
  (s || '')
    .toLowerCase()
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss');

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

const TitleByPos = (pos: string) => {
  switch (pos.toUpperCase()) {
    case 'N': return 'Nouns';
    case 'V': return 'Verbs';
    case 'ADJ': return 'Adjectives';
    case 'ADV': return 'Adverbs';
    case 'PHR':
    case 'PHRASE': return 'Phrases';
    default: return pos;
  }
};

export function DictionaryCategory() {
  const { pos } = useParams<{ pos: string }>();
  if (!pos) return <Navigate to="/dictionary" replace />;

  const items = getDictionaryIndex() as DictItem[];
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const normPos = pos.toUpperCase();
    const list = (Array.isArray(items) ? items : [])
      .filter(it => {
        const p = (it.pos || '').toUpperCase();
        return p === normPos || (normPos === 'PHR' && p === 'PHRASE');
      })
      .sort(byAlpha);

    if (!q.trim()) return list;
    const needle = q.trim().toLowerCase();
    return list.filter(it =>
      it.headword?.toLowerCase().includes(needle) ||
      it.translation_ru?.toLowerCase().includes(needle)
    );
  }, [items, pos, q]);

  const title = TitleByPos(pos);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">

        <div className="flex items-center justify-between mb-6">
          <Link to="/dictionary" className="p-2 hover:bg-gray-100 rounded" style={{ color: '#111' }}>
            ← Back to dictionary
          </Link>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold" style={{ color: '#111' }}>{title}</h1>
          <div className="text-sm" style={{ color: '#666' }}>
            {filtered.length} {filtered.length === 1 ? 'Eintrag' : 'Einträge'}
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

        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-sm" style={{ color: '#666' }}>
            Ничего не найдено. Попробуй изменить запрос.
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it) => (
              <Link
                key={it.id}
                to={`/dictionary/${it.id}`}
                className="group block"
              >
                <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <div className="text-lg font-semibold truncate" style={{ color: '#111', maxWidth: '18rem' }}>
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

                      <div className="text-sm">
                        {it.translation_ru ? (
                          <span style={{ color: '#111' }}>{it.translation_ru}</span>
                        ) : null}
                        {it.preview && it.preview !== it.translation_ru ? (
                          <span style={{ color: '#6B7280' }}> — {it.preview}</span>
                        ) : null}
                      </div>
                    </div>

                    <div className="self-start">
                      <span className="text-sm group-hover:underline" style={{ color: '#111' }}>
                        Открыть →
                      </span>
                    </div>
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
