import React from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Search, X } from 'lucide-react';
import { getDictionaryIndex } from '../lib/data';

type DictEntry = {
  id: string;
  headword: string;
  pos: 'NOUN' | 'VERB' | 'ADJ' | 'ADV' | 'PHR' | string;
  preview?: string | null;
  translation_ru?: string | null;
  register?: string | null;
  topics?: string[];
};

const BUCKETS: Array<{ key: 'NOUN'|'VERB'|'ADJ'|'ADV'|'PHR'; label: string }> = [
  { key: 'NOUN', label: 'Nouns' },
  { key: 'VERB', label: 'Verbs' },
  { key: 'ADJ',  label: 'Adjectives' },
  { key: 'ADV',  label: 'Adverbs' },
  { key: 'PHR',  label: 'Phrases' },
];

export default function Dictionary() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const all: DictEntry[] = Array.isArray(getDictionaryIndex()) ? (getDictionaryIndex() as DictEntry[]) : [];

  // query params
  const activePos = (searchParams.get('pos') || '').toUpperCase();
  const q = (searchParams.get('q') || '').trim();

  // counts per POS
  const counts = BUCKETS.reduce<Record<string, number>>((acc, b) => {
    acc[b.key] = all.filter(e => (e?.pos || '').toUpperCase() === b.key).length;
    return acc;
  }, {});

  // filtering
  const filtered = all.filter(e => {
    const matchPos = activePos ? (e?.pos || '').toUpperCase() === activePos : true;
    if (!matchPos) return false;
    if (!q) return true;
    const hay = `${e.headword ?? ''} ${e.preview ?? ''} ${e.translation_ru ?? ''}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const onSearchChange = (val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set('q', val);
    else next.delete('q');
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('pos');
    next.delete('q');
    setSearchParams(next, { replace: true });
  };

  const title = activePos
    ? `Wörterbuch — ${BUCKETS.find(b => b.key === activePos)?.label ?? activePos}`
    : 'Wörterbuch';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header (как на Level) */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded">
              <ArrowLeft size={24} style={{ color: '#111' }} />
            </Link>
            <h1 className="text-2xl font-bold" style={{ color: '#111' }}>
              {title}
            </h1>
          </div>
          <Link to="/" className="p-2 hover:bg-gray-100 rounded">
            <Home size={24} style={{ color: '#666' }} />
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Поиск */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} />
              </div>
              <input
                value={q}
                onChange={(e) => onSearchChange(e.target.value)}
                type="text"
                placeholder="Suchen… (z.B. Kopf, schreiben, allerdings)"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md bg-white focus:outline-none"
              />
              {q && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-80"
                  aria-label="Clear"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {(activePos || q) && (
              <div className="mt-3 flex items-center gap-3">
                {activePos && (
                  <span className="text-xs px-2 py-1 rounded border bg-white">
                    POS: {BUCKETS.find(b => b.key === activePos)?.label ?? activePos}
                  </span>
                )}
                {q && (
                  <span className="text-xs px-2 py-1 rounded border bg-white">
                    Suche: „{q}“
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm px-3 py-1 rounded border bg-white hover:bg-gray-50"
                >
                  Filter zurücksetzen
                </button>
              </div>
            )}
          </div>

          {/* Если нет активной категории и пустой поиск — показываем карточки категорий */}
          {!activePos && !q && (
            <div className="grid gap-4">
              {BUCKETS.map(b => (
                <button
                  key={b.key}
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.set('pos', b.key);
                    setSearchParams(next, { replace: true });
                  }}
                  className="block text-left p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold" style={{ color: '#111' }}>
                        {b.label}
                      </h2>
                      <p className="text-sm" style={{ color: '#666' }}>
                        {counts[b.key] ?? 0} Einträge
                      </p>
                    </div>
                    <div className="text-sm px-2 py-1 rounded border bg-white">
                      POS: {b.key}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Иначе — список найденных слов */}
          {(activePos || q) && (
            <div className="grid gap-4">
              {filtered.map(e => (
                <Link
                  key={e.id}
                  to={`/dictionary/${e.id}`}
                  className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-xl font-semibold" style={{ color: '#111' }}>
                          {e.headword}
                        </h2>
                        <span className="text-xs px-2 py-1 rounded border bg-white">
                          {e.pos}{e.register ? ` · ${e.register}` : ''}
                        </span>
                      </div>
                      {e.translation_ru && (
                        <p style={{ color: '#666' }} className="text-sm">
                          {e.translation_ru}
                        </p>
                      )}
                      {!e.translation_ru && e.preview && (
                        <p style={{ color: '#666' }} className="text-sm">
                          {e.preview}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}

              {filtered.length === 0 && (
                <div className="p-6 bg-white rounded-lg border text-sm" style={{ color: '#666' }}>
                  Ничего не найдено. Измените фильтры или запрос.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
