// src/pages/DictionaryEntry.tsx
import React, { useEffect, useMemo } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getDictionaryEntry, getDictionaryIndex } from '../lib/data';

type DictItem = {
  id: string;
  headword: string;
  pos: 'N' | 'V' | 'ADJ' | 'ADV' | 'PHRASE' | string;
  preview?: string;
  translation_ru?: string;
  gender?: 'm' | 'f' | 'n' | null;
  forms?: Record<string, string | null | undefined>;
  examples?: { de: string; ru: string }[];
  notes?: {
    synonyms?: string[];
    antonyms?: string[];
    usage?: string;
    collocations?: string[];
  };
  topics?: string[];
  register?: 'neutral' | 'formell' | 'ugs.' | string;
  b1_verified?: boolean;
};

const latinize = (s: string) =>
  (s || '')
    .toLowerCase()
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss');

const POS_LABEL = (pos?: string) => {
  switch (pos) {
    case 'N': return 'N';
    case 'V': return 'V';
    case 'ADJ': return 'ADJ';
    case 'ADV': return 'ADV';
    case 'PHRASE': return 'PHR';
    default: return pos || '';
  }
};

const TopicBadge = ({ text }: { text: string }) => (
  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs mr-1 mb-1"
    style={{ borderColor: '#E5E7EB', color: '#374151', background: '#F9FAFB' }}>
    {text}
  </span>
);

const FormsBlock: React.FC<{ item: DictItem }> = ({ item }) => {
  const f = item.forms || {};
  if (item.pos === 'N') {
    const article = f.article || '';
    const genitiv = f.genitiv || '';
    const plural = f.plural || '';
    if (!article && !genitiv && !plural) return null;
    return (
      <div className="text-sm space-x-4" style={{ color: '#374151' }}>
        {article ? <span><b>Artikel:</b> {article}</span> : null}
        {genitiv ? <span><b>Genitiv:</b> {genitiv}</span> : null}
        {plural ? <span><b>Plural:</b> {plural}</span> : null}
      </div>
    );
  }
  if (item.pos === 'V') {
    const inf = f.infinitive || '';
    const praet = f.praeteritum_3sg || '';
    const p2 = f.partizip_ii || '';
    const perf = f.perfekt_3sg || '';
    if (!inf && !praet && !p2 && !perf) return null;
    return (
      <div className="text-sm space-x-4" style={{ color: '#374151' }}>
        {inf ? <span><b>Inf.:</b> {inf}</span> : null}
        {praet ? <span><b>Prät.:</b> {praet}</span> : null}
        {p2 ? <span><b>Part. II:</b> {p2}</span> : null}
        {perf ? <span><b>Perf.:</b> {perf}</span> : null}
      </div>
    );
  }
  if (item.pos === 'ADJ') {
    const comp = f.comparative || '';
    const sup = f.superlative || '';
    if (!comp && !sup) return null;
    return (
      <div className="text-sm space-x-4" style={{ color: '#374151' }}>
        {comp ? <span><b>Komparativ:</b> {comp}</span> : null}
        {sup ? <span><b>Superlativ:</b> {sup}</span> : null}
      </div>
    );
  }
  return null;
};

export function DictionaryEntry() {
  const { entryId } = useParams<{ entryId: string }>();

  useEffect(() => {
    // при каждой записи начинаем с верха
    window.scrollTo(0, 0);
  }, [entryId]);

  if (!entryId) return <Navigate to="/dictionary" replace />;

  const item = getDictionaryEntry(entryId) as DictItem | null;
  const index = getDictionaryIndex() as DictItem[];

  // соседние записи (A→Z), чтобы можно было листать
  const { prev, next } = useMemo(() => {
    const sorted = [...index].sort((a, b) => latinize(a.headword).localeCompare(latinize(b.headword)));
    const i = sorted.findIndex(e => e.id === entryId);
    return {
      prev: i > 0 ? sorted[i - 1] : null,
      next: i >= 0 && i < sorted.length - 1 ? sorted[i + 1] : null
    };
  }, [index, entryId]);

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4">
            <Link to="/dictionary" className="p-2 hover:bg-gray-100 rounded" style={{ color: '#111' }}>← Back to dictionary</Link>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm" style={{ color: '#666' }}>Запись не найдена.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Верхняя навигация */}
        {/* <div className="flex items-center justify-between mb-6">
          <Link to="/dictionary" className="p-2 hover:bg-gray-100 rounded" style={{ color: '#111' }}>← Back</Link>
          <div className="flex items-center gap-2">
            {prev && (
              <Link to={`/dictionary/${prev.id}`} className="px-3 py-1.5 rounded border text-sm hover:bg-gray-50"
                style={{ borderColor: '#E5E7EB', color: '#111' }}>
                ← {prev.headword}
              </Link>
            )}
            {next && (
              <Link to={`/dictionary/${next.id}`} className="px-3 py-1.5 rounded border text-sm hover:bg-gray-50"
                style={{ borderColor: '#E5E7EB', color: '#111' }}>
                {next.headword} →
              </Link>
            )}
          </div>
        </div> */}

        {/* Карточка записи */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold" style={{ color: '#111' }}>{item.headword}</h1>
            <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-xs"
              style={{ borderColor: '#E5E7EB', color: '#374151', background: '#F9FAFB' }}>
              {POS_LABEL(item.pos)}
            </span>
            {item.register ? (
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs"
                style={{ borderColor: '#E5E7EB', color: '#6B7280', background: '#F3F4F6' }}>
                {item.register}
              </span>
            ) : null}
            {item.b1_verified ? (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs"
                style={{ background: '#ECFDF5', color: '#065F46' }}>
                B1
              </span>
            ) : null}
          </div>

          {/* Переводы */}
          {(item.translation_ru || item.preview) && (
            <div className="text-base mb-3">
              {item.translation_ru ? (
                <span style={{ color: '#111' }}>{item.translation_ru}</span>
              ) : null}
              {item.preview && item.preview !== item.translation_ru ? (
                <span style={{ color: '#6B7280' }}> — {item.preview}</span>
              ) : null}
            </div>
          )}

          {/* Формы */}
          <FormsBlock item={item} />

          {/* Usage / темы */}
          {(item.notes?.usage || (item.topics && item.topics.length)) && (
            <div className="mt-3">
              {item.notes?.usage ? (
                <div className="text-sm italic mb-2" style={{ color: '#6B7280' }}>{item.notes.usage}</div>
              ) : null}
              {Array.isArray(item.topics) && item.topics.length > 0 && (
                <div className="flex flex-wrap">
                  {item.topics.map(t => <TopicBadge key={t} text={t} />)}
                </div>
              )}
            </div>
          )}

          {/* Коллокации / синонимы / антонимы */}
          {(item.notes?.collocations?.length || item.notes?.synonyms?.length || item.notes?.antonyms?.length) ? (
            <div className="mt-4 grid gap-2 text-sm" style={{ color: '#374151' }}>
              {item.notes?.collocations?.length ? (
                <div><b>Collocations:</b> {item.notes.collocations.join(', ')}</div>
              ) : null}
              {item.notes?.synonyms?.length ? (
                <div><b>Synonyme:</b> {item.notes.synonyms.join(', ')}</div>
              ) : null}
              {item.notes?.antonyms?.length ? (
                <div><b>Antonyme:</b> {item.notes.antonyms.join(', ')}</div>
              ) : null}
            </div>
          ) : null}

          {/* Примеры */}
          {Array.isArray(item.examples) && item.examples.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2" style={{ color: '#111' }}>Beispiele</h2>
              <div className="grid gap-2">
                {item.examples.map((ex, idx) => (
                  <div key={idx} className="text-sm">
                    <div style={{ color: '#111' }}>{ex.de}</div>
                    <div className="italic" style={{ color: '#6B7280' }}>{ex.ru}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Нижняя навигация */}
        <div className="flex items-center justify-between mt-4">
          <Link to="/dictionary" className="px-3 py-1.5 rounded border text-sm hover:bg-gray-50"
            style={{ borderColor: '#E5E7EB', color: '#111' }}>
            ← Back to dictionary
          </Link>
          <div className="flex items-center gap-2">
            {prev && (
              <Link to={`/dictionary/${prev.id}`} className="px-3 py-1.5 rounded border text-sm hover:bg-gray-50"
                style={{ borderColor: '#E5E7EB', color: '#111' }}>
                ← {prev.headword}
              </Link>
            )}
            {next && (
              <Link to={`/dictionary/${next.id}`} className="px-3 py-1.5 rounded border text-sm hover:bg-gray-50"
                style={{ borderColor: '#E5E7EB', color: '#111' }}>
                {next.headword} →
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
