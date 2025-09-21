import { Link, useParams } from 'react-router-dom';
import { getDictionaryIndex } from '../lib/data';

function belongsToBucket(item: any, bucket: string) {
  if (!item) return false;
  const pos = (item.pos ?? '').toUpperCase();
  if (bucket === 'nouns') return pos === 'NOUN';
  if (bucket === 'verbs') return pos === 'VERB';
  if (bucket === 'adjectives') return pos === 'ADJ';
  if (bucket === 'advs') return pos === 'ADV';
  if (bucket === 'phrases') return pos === 'PHR';

  // fallback — ничего
  return false;
}

export default function DictionaryCategory() {
  const { bucket } = useParams<{ bucket: string }>();
  const all = getDictionaryIndex();

  const list = (all ?? []).filter(it => belongsToBucket(it, bucket ?? ''));

  // Заголовок
  const titleMap: Record<string, string> = {
    nouns: 'Nouns',
    verbs: 'Verbs',
    adjectives: 'Adjectives',
    advs: 'Adverbs',
    phrases: 'Phrases',
  };
  const pageTitle = titleMap[bucket ?? ''] ?? 'Dictionary';

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">{pageTitle}</h1>

      {list.length === 0 ? (
        <div className="text-gray-500">В этой категории пока нет записей.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((e) => (
            <Link
              key={e.id}
              to={`/dictionary/entry/${encodeURIComponent(e.id)}`}
              className="block border rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="text-lg font-medium">{e.headword}</div>
              <div className="text-sm text-gray-500 mt-1">{e.preview}</div>
              {/* Можно показать темы или POS */}
              <div className="text-xs text-gray-400 mt-2 uppercase tracking-wide">{e.pos}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
