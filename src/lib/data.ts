// src/lib/data.ts

// ───────────────────────────────────────────────────────────
// СЛОВАРЬ: автосборка из нескольких файлов
// ───────────────────────────────────────────────────────────

// 1) Пытаемся собрать всё из src/data/dictionary/*.json (кроме manifest.json и _черновиков)
const dictPartsGlob = import.meta.glob('../data/dictionary/*.json', {
  eager: true,
  import: 'default'
}) as Record<string, any>;

type AnyRecord = Record<string, any>;
let dictionaryIndex: AnyRecord[] = [];

// 2) Совместимость: если старый файл src/data/dictionary.json существует
const dictSingleGlob = import.meta.glob('../data/dictionary.json', {
  eager: true,
  import: 'default'
}) as Record<string, any>;
const dictSingle = Object.values(dictSingleGlob)[0];

// Ключи возможных «bundle-объектов» { nouns:[], verbs:[], ... }
const BUCKET_KEYS = ['nouns', 'verbs', 'adjectives', 'advs', 'adverbs', 'phrases'] as const;

// 3) Сборка:
//  - если есть папка /dictionary/*.json → берём все массивы (кроме manifest.json и _draft-файлов) и склеиваем
//  - если нет → берём старый dictionary.json (если он массив)
//  - если вместо массива пришёл "bundle-объект" { nouns:[], verbs:[], ... } → склеиваем поля
(() => {
  const entries = Object.entries(dictPartsGlob);
  const hasFolder = entries.length > 0;

  if (hasFolder) {
    const parts = entries
      .filter(([path]) => !/manifest\.json$/i.test(path) && !/(^|\/)_.+\.json$/i.test(path)) // игнорим manifest и _черновики
      .map(([, mod]) => mod);

    // каждый файл либо массив, либо bundle-объект
    const flattened: AnyRecord[] = [];
    for (const part of parts) {
      if (Array.isArray(part)) {
        flattened.push(...part);
      } else if (part && typeof part === 'object') {
        for (const key of BUCKET_KEYS) {
          const arr = (part as AnyRecord)[key];
          if (Array.isArray(arr)) flattened.push(...arr);
        }
      }
    }
    dictionaryIndex = flattened;
  } else if (Array.isArray(dictSingle)) {
    dictionaryIndex = dictSingle;
  } else if (dictSingle && typeof dictSingle === 'object') {
    for (const k of BUCKET_KEYS) {
      const arr = (dictSingle as AnyRecord)[k];
      if (Array.isArray(arr)) dictionaryIndex.push(...arr);
    }
  }

  // 4) Фильтр мусора + дедуп по id
  const seen = new Set<string>();
  dictionaryIndex = dictionaryIndex
    .filter(
      (e) =>
        e &&
        typeof e === 'object' &&
        typeof (e as AnyRecord).id === 'string' &&
        (e as AnyRecord).id.trim() !== ''
    )
    .filter((e) => {
      const id = (e as AnyRecord).id as string;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

  // 5) Лёгкая валидация схемы (только в dev)
  if ((import.meta as any).env?.DEV) {
    const bad = dictionaryIndex.filter(
      (e) => typeof e.id !== 'string' || typeof e.headword !== 'string' || typeof e.pos !== 'string'
    );
    if (bad.length) {
      // ограничим вывод, чтобы не засорять консоль
      const sample = bad.slice(0, 3);
      console.warn('[dictionary] invalid entries:', sample, `+${bad.length - sample.length} more`);
    }
  }
})();

// 6) Индекс по id для быстрых выборок + защита от мутаций
const dictById = new Map<string, AnyRecord>();
for (const e of dictionaryIndex) dictById.set(e.id, e);
Object.freeze(dictionaryIndex);

// Публичные API
export const getDictionaryIndex = () => dictionaryIndex;
export const getDictionaryEntry = (id: string) => dictById.get(id) ?? null;
