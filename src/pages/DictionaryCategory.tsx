import { Link } from 'react-router-dom';
import { getDictionaryIndex } from '../lib/data';

function groupByBucket(items: any[]) {
  const buckets: Record<string, number> = {};
  for (const it of items) {
    let bucket = 'other';
    const pos = (it?.pos ?? '').toUpperCase();
    if (pos === 'NOUN') bucket = 'nouns';
    else if (pos === 'VERB') bucket = 'verbs';
    else if (pos === 'ADJ') bucket = 'adjectives';
    else if (pos === 'ADV') bucket = 'advs';
    else if (pos === 'PHR') bucket = 'phrases';
    buckets[bucket] = (buckets[bucket] ?? 0) + 1;
  }
  return buckets;
}

type BucketMeta = { key: string; title: string; description: string; count: number };

export default function Dictionary() {
  const all = getDictionaryIndex();
  const grouped = groupByBucket(all);

  const bucketList: BucketMeta[] = [
    { key: 'nouns',       title: 'Nouns',       description: 'Существительные',   count: grouped['nouns'] ?? 0 },
    { key: 'verbs',       title: 'Verbs',       description: 'Глаголы',           count: grouped['verbs'] ?? 0 },
    { key: 'adjectives',  title: 'Adjectives',  description: 'Прилагательные',    count: grouped['adjectives'] ?? 0 },
    { key: 'advs',        title: 'Adverbs',     description: 'Наречия',           count: grouped['advs'] ?? 0 },
    { key: 'phrases',     title: 'Phrases',     description: 'Фразы B1',          count: grouped['phrases'] ?? 0 },
  ].filter(b => b.count > 0);

  return (
    <div>
      <h1>Dictionary</h1>

      <div>
        {bucketList.map((b) => (
          <Link key={b.key} to={`/dictionary/bucket/${b.key}`}>
            <div>
              <div>{b.title}</div>
              <div>{b.description}</div>
              <div>Всего: {b.count}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
