import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDictionaryIndex } from '../lib/data';

type BucketKey = 'nouns' | 'verbs' | 'adjectives' | 'advs' | 'phrases';

const BUCKET_META: Record<BucketKey, { title: string; pos: string }> = {
  nouns: { title: 'Nouns', pos: 'NOUN' },
  verbs: { title: 'Verbs', pos: 'VERB' },
  adjectives: { title: 'Adjectives', pos: 'ADJ' },
  advs: { title: 'Adverbs', pos: 'ADV' },
  phrases: { title: 'Phrases', pos: 'PHR' },
};

export function Dictionary() {
  const all = getDictionaryIndex() ?? [];
  const [q, setQ] = useState('');

  // подсчёты по категориям
  const counts = useMemo(() => {
    const c: Record<BucketKey, number> = { nouns:0, verbs:0, adjectives:0, advs:0, phrases:0 };
    for (const e of all) {
      const p = String(e?.pos || '');
      if (p === 'NOUN') c.nouns++;
      else if (p === 'VERB') c.verbs++;
      else if (p === 'ADJ') c.adjectives++;
      else if (p === 'ADV') c.advs++;
      else if (p === 'PHR') c.phrases++;
    }
    return c;
  }, [all]);

  // поиск по всем
  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return all.filter((e: any) => {
      const hay = [
        e?.headword,
        e?.preview,
        e?.translation_ru,
        e?.id
      ].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(query);
    });
  }, [all, q]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Dictionary</h1>
        <p className="text-sm text-gray-600">
          Категории слов и быстрый поиск по всему словарю.
        </p>
      </header>

      {/* Поиск */}
      <div className="mb-6">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Suche / Поиск…"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      {/* Если есть запрос — показываем результаты */}
      {q.trim() ? (
        <div>
          <div className="text-sm text-gray-600 mb-3">
            Найдено: {results.length}
          </div>
          <ul className="space-y-2">
            {results.map((e: any) => (
              <li key={e.id} className="border rounded-md p-3 bg-white">
                <Link to={`/dictionary/${encodeURIComponent(e.id)}`} className="block">
                  <div className="flex items-baseline justify-between">
                    <div className="font-medium">{e.headword}</div>
                    <div className="text-xs text-gray-500">{e.pos}</div>
                  </div>
                  {e.preview && (
                    <div className="text-sm text-gray-700">{e.preview}</div>
                  )}
                  {e.translation_ru && (
                    <div className="text-sm text-gray-500">{e.translation_ru}</div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        // иначе — сетка категорий как «карточки» (визуально ближе к Levels)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(BUCKET_META) as BucketKey[]).map((k) => (
            <Link
              key={k}
              to={`/dictionary/category/${k}`}
              className="block border rounded-lg p-4 bg-white hover:bg-gray-50"
            >
              <div className="text-lg font-medium mb-1">{BUCKET_META[k].title}</div>
              <div className="text-sm text-gray-600">{counts[k]} entries</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
