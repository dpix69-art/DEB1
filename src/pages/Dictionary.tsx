import { Link } from 'react-router-dom';
import { getDictionaryIndex } from '../lib/data';

// Простая группировка по bucket
function groupByBucket(items: any[]) {
  const buckets: Record<string, number> = {};
  for (const it of items) {
    // эвристика по id/headword для ведёрка
    // если есть ключ type/bucket в данных — можно заменить
    let bucket = 'other';
    const hw: string = (it?.headword ?? '').toLowerCase();
    const id: string = (it?.id ?? '').toLowerCase();

    // очень грубо: по POS-подобным полям
    if (it?.pos === 'NOUN') bucket = 'nouns';
    else if (it?.pos === 'VERB') bucket = 'verbs';
    else if (it?.pos === 'ADJ') bucket = 'adjectives';
    else if (it?.pos === 'ADV') bucket = 'advs';
    else if (it?.pos === 'PHR') bucket = 'phrases';
    else {
      // fallback по id/headword
      if (id.includes('phr') || hw.includes(' ') || it?.examples?.[0]?.de?.includes(' ')) bucket = 'phrases';
    }

    buckets[bucket] = (buckets[bucket] ?? 0) + 1;
  }
  return buckets;
}

type BucketMeta = { key: string; title: string; description: string; count: number };

export default function Dictionary() {
  const all = getDictionaryIndex();
  const grouped = groupByBucket(all);

  const bucketList: BucketMeta[] = [
    { key: 'nouns', title: 'Nouns', description: 'Существительные с примерами', count: grouped['nouns'] ?? 0 },
    { key: 'verbs', title: 'Verbs', description: 'Глаголы и словоформы', count: grouped['verbs'] ?? 0 },
    { key: 'adjectives', title: 'Adjectives', description: 'Прилагательные в деловом/учебном контексте', count: grouped['adjectives'] ?? 0 },
    { key: 'advs', title: 'Adverbs', description: 'Наречия и их употребление', count: grouped['advs'] ?? 0 },
    { key: 'phrases', title: 'Phrases', description: 'Шаблонные фразы B1', count: grouped['phrases'] ?? 0 },
  ].filter(b => b.count > 0);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Dictionary</h1>

      {/* grid карточек как в levels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bucketList.map((b) => (
          <Link
            key={b.key}
            to={`/dictionary/bucket/${b.key}`}
            className="block border rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="text-lg font-medium">{b.title}</div>
            <div className="text-sm text-gray-500 mt-1">{b.description}</div>
            <div className="text-sm mt-2">Всего: {b.count}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
