import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getDictionaryIndex } from '../lib/data';

type DictEntry = {
  id: string;
  headword: string;
  pos: 'NOUN' | 'VERB' | 'ADJ' | 'ADV' | 'PHR' | string;
  preview?: string | null;
  translation_ru?: string | null;
  register?: 'neutral' | 'formell' | 'ugs.' | string;
  topics?: string[];
};

const POS_ORDER: Array<DictEntry['pos']> = ['NOUN', 'VERB', 'ADJ', 'ADV', 'PHR'];

const POS_TITLES: Record<string, string> = {
  NOUN: 'Nouns',
  VERB: 'Verbs',
  ADJ: 'Adjectives',
  ADV: 'Adverbs',
  PHR: 'Phrases',
};

function bucketByPOS(items: DictEntry[]) {
  const buckets: Record<string, DictEntry[]> = {};
  for (const it of items) {
    const key = (it.pos || 'OTHER').toUpperCase();
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(it);
  }
  // сортируем внутри каждой группы по headword A→Z
  for (const key of Object.keys(buckets)) {
    buckets[key].sort((a, b) =>
      (a.headword || '').localeCompare(b.headword || '', 'de', { sensitivity: 'base' })
    );
  }
  return buckets;
}

export function Dictionary() {
  const all = useMemo(() => getDictionaryIndex() as DictEntry[], []);
  const buckets = useMemo(() => bucketByPOS(all), [all]);

  const orderedKeys = [
    ...POS_ORDER.filter(k => buckets[k]?.length),
    ...Object.keys(buckets).filter(k => !POS_ORDER.includes(k)),
  ];

  return (
    <div className="mx-auto max-w-4xl p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Dictionary</h1>
        <p className="text-sm text-gray-600">
          Автосборка из нескольких JSON-файлов. Кликните на запись, чтобы открыть карточку.
        </p>
      </header>

      {orderedKeys.map(key => (
        <section key={key} className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            {POS_TITLES[key] ?? key}
            <span className="ml-2 text-sm text-gray-500">({buckets[key].length})</span>
          </h2>

          <ul className="divide-y rounded-md border">
            {buckets[key].map(entry => (
              <li key={entry.id} className="p-3 hover:bg-gray-50">
                <Link to={`/dictionary/${encodeURIComponent(entry.id)}`} className="block">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="text-base font-medium">
                      {entry.headword}
                      {entry.preview ? (
                        <span className="ml-2 text-sm font-normal text-gray-600">
                          — {entry.preview}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                      {entry.register ? (
                        <span className="rounded-full border px-2 py-0.5 text-xs text-gray-700">
                          {entry.register}
                        </span>
                      ) : null}
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                        {entry.pos}
                      </span>
                    </div>
                  </div>
                  {entry.translation_ru ? (
                    <div className="mt-1 line-clamp-1 text-sm text-gray-700">
                      {entry.translation_ru}
                    </div>
                  ) : null}
                  {entry.topics && entry.topics.length ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {entry.topics.slice(0, 4).map(t => (
                        <span
                          key={t}
                          className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                        >
                          {t}
                        </span>
                      ))}
                      {entry.topics.length > 4 ? (
                        <span className="text-xs text-gray-500">
                          +{entry.topics.length - 4}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {all.length === 0 && (
        <p className="text-sm text-red-600">
          Словарь не найден. Проверьте файлы в <code>src/data/dictionary*</code>.
        </p>
      )}
    </div>
  );
}

export default Dictionary;
