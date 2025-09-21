import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getDictionaryIndex } from '../lib/data';

type BucketKey = 'nouns' | 'verbs' | 'adjectives' | 'advs' | 'phrases';

const BUCKET_META: Record<BucketKey, { title: string; pos: string }> = {
  nouns: { title: 'Nouns', pos: 'NOUN' },
  verbs: { title: 'Verbs', pos: 'VERB' },
  adjectives: { title: 'Adjectives', pos: 'ADJ' },
  advs: { title: 'Adverbs', pos: 'ADV' },
  phrases: { title: 'Phrases', pos: 'PHR' },
};

export function DictionaryCategory() {
  const { bucket } = useParams<{ bucket: BucketKey }>();
  const meta = bucket ? BUCKET_META[bucket] : undefined;
  const all = getDictionaryIndex() ?? [];
  const [q, setQ] = useState('');

  const items = useMemo(() => {
    const base = meta ? all.filter((e: any) => e?.pos === meta.pos) : [];
    const query = q.trim().toLowerCase();
    if (!query) return base;
    return base.filter((e: any) => {
      const hay = [e?.headword, e?.preview, e?.translation_ru].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(query);
    });
  }, [all, meta, q]);

  if (!meta) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Dictionary</h1>
        <p className="text-gray-600 mb-6">Категория не найдена.</p>
        <Link to="/dictionary" className="text-blue-600 underline">← Назад к словарю</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{meta.title}</h1>
        <Link to="/dictionary" className="text-sm text-blue-600 underline">← Все категории</Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Suche / Поиск…"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <div className="text-sm text-gray-600 mb-3">
        Записей: {items.length}
      </div>

      <ul className="space-y-2">
        {items.map((e: any) => (
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
  );
}
