// src/lib/data.ts
type AnyRecord = Record<string, any>;

export type LevelModule = {
  id: string;              // "level1", "level2", ...
  title?: string;
  description?: string;
  cards: AnyRecord[];      // массив карточек
};

// ───────────────────────────────────────────────────────────
// УРОВНИ: автозагрузка всех /data/level*.json + сортировка 1..19
// ───────────────────────────────────────────────────────────

// Матчим сразу по нескольким вариантам путей (на случай иной структуры)
const levelsGlobs = [
  import.meta.glob('../data/level*.json', { eager: true, import: 'default' }),
  import.meta.glob('/src/data/level*.json', { eager: true, import: 'default' }),
  import.meta.glob('./data/level*.json', { eager: true, import: 'default' }),
  import.meta.glob('../../data/level*.json', { eager: true, import: 'default' }),
] as Array<Record<string, any>>;

// Сливаем все найденные файлы
const levelModulesRaw: Record<string, any> = Object.assign({}, ...levelsGlobs);

// Диагностика: посмотрим, что реально нашлось
// Откроется в DevTools (F12)
console.debug(
  '[data] level files matched:',
  Object.keys(levelModulesRaw).length,
  Object.keys(levelModulesRaw)
);

const numberFrom = (s: string): number => {
  const m = s?.toLowerCase().match(/(\d+)/);
  return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
};

const numberFromPath = (p: string): number => {
  const m = p?.toLowerCase().match(/level(\d+)\.json$/);
  return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
};

// Нормализация: поддерживаем и объект {cards:[...]} и «голый» массив [...]
const normalizeModule = (path: string, mod: any): LevelModule => {
  if (Array.isArray(mod)) {
    const idx = numberFromPath(path);
    return {
      id: `level${Number.isFinite(idx) ? idx : ''}`,
      title: undefined,
      description: undefined,
      cards: mod,
    };
  }
  const pathIdx = numberFromPath(path);
  const fallbackId = `level${Number.isFinite(pathIdx) ? pathIdx : ''}`;
  const cards = Array.isArray(mod?.cards) ? mod?.cards : [];
  return {
    id: (typeof mod?.id === 'string' && mod.id.length) ? mod.id : fallbackId,
    title: mod?.title,
    description: mod?.description,
    cards,
  };
};

const levelModules: LevelModule[] = Object.entries(levelModulesRaw)
  .map(([path, mod]) => normalizeModule(path, mod))
  .filter(m => Array.isArray(m.cards)) // на всякий случай
  .sort((a, b) => {
    const ia = Number.isFinite(numberFrom(a.id)) ? numberFrom(a.id) : numberFromPath(a.id);
    const ib = Number.isFinite(numberFrom(b.id)) ? numberFrom(b.id) : numberFromPath(b.id);
    return ia - ib;
  });

// Публичные API
export const getModules = (): LevelModule[] => levelModules;

export const getModule = (moduleId: string): LevelModule | null =>
  levelModules.find(m => m.id === moduleId) ?? null;

export const getCard = (moduleId: string, cardId: string) => {
  const module = getModule(moduleId);
  if (!module) return null;
  const card = module.cards.find((c: any) => c?.id === cardId);
  if (!card) return null;
  return { module, card };
};

// ───────────────────────────────────────────────────────────
// СЛОВАРЬ: автосборка из нескольких файлов
// ───────────────────────────────────────────────────────────

const BUCKET_KEYS = ['nouns', 'verbs', 'adjectives', 'advs', 'adverbs', 'phrases'] as const;

// Папка словаря: собираем из /data/dictionary/*.json (кроме manifest.json и файлов, начинающихся с "_")
const dictFolderGlobs = [
  import.meta.glob('../data/dictionary/*.json', { eager: true, import: 'default' }),
  import.meta.glob('/src/data/dictionary/*.json', { eager: true, import: 'default' }),
  import.meta.glob('./data/dictionary/*.json', { eager: true, import: 'default' }),
  import.meta.glob('../../data/dictionary/*.json', { eager: true, import: 'default' }),
] as Array<Record<string, any>>;
const dictPartsGlob: Record<string, any> = Object.assign({}, ...dictFolderGlobs);

// Совместимость: старый файл /data/dictionary.json
const dictSingleGlobs = [
  import.meta.glob('../data/dictionary.json', { eager: true, import: 'default' }),
  import.meta.glob('/src/data/dictionary.json', { eager: true, import: 'default' }),
  import.meta.glob('./data/dictionary.json', { eager: true, import: 'default' }),
  import.meta.glob('../../data/dictionary.json', { eager: true, import: 'default' }),
] as Array<Record<string, any>>;
const dictSingleGlob: Record<string, any> = Object.assign({}, ...dictSingleGlobs);
const dictSingle = Object.values(dictSingleGlob)[0];

let dictionaryIndex: AnyRecord[] = [];

// Сборка:
//  - если есть папка /dictionary → берём все массивы, кроме manifest.json и _draft-файлов, и склеиваем
//  - если нет → берём старый dictionary.json (если он массив)
//  - если вместо массива пришёл "bundle-объект" { nouns:[], verbs:[], ... } → склеиваем поля
(() => {
  const entries = Object.entries(dictPartsGlob);
  const hasFolder = entries.length > 0;

  if (hasFolder) {
    const parts = entries
      .filter(([path]) => !/manifest\.json$/i.test(path) && !/(^|\/)_.*\.json$/i.test(path))
      .map(([, mod]) => mod);

    const flattened: AnyRecord[] = [];
    for (const part of parts) {
      if (Array.isArray(part)) {
        flattened.push(...part);
      } else if (part && typeof part === 'object') {
        for (const key of BUCKET_KEYS) {
          const bucket = (part as AnyRecord)[key];
          if (Array.isArray(bucket)) flattened.push(...bucket);
        }
      }
    }
    dictionaryIndex = flattened;
  } else if (Array.isArray(dictSingle)) {
    dictionaryIndex = dictSingle;
  } else if (dictSingle && typeof dictSingle === 'object') {
    for (const k of BUCKET_KEYS) {
      const bucket = (dictSingle as AnyRecord)[k];
      if (Array.isArray(bucket)) dictionaryIndex.push(...bucket);
    }
  }

  // Дедуп по id + фильтр битых записей
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

  // Простая валидация схемы (только в DEV)
  if ((import.meta as any)?.env?.DEV) {
    const bad = dictionaryIndex.filter(
      (e) =>
        typeof (e as AnyRecord).id !== 'string' ||
        typeof (e as AnyRecord).headword !== 'string' ||
        typeof (e as AnyRecord).pos !== 'string'
    );
    if (bad.length) {
      console.warn(
        '[dictionary] invalid entries:',
        bad.slice(0, 3),
        bad.length > 3 ? `+${bad.length - 3} more` : ''
      );
    }
  }
})();

// Карта для O(1) доступа по id + иммутабельность массива
const dictById = new Map<string, AnyRecord>();
for (const e of dictionaryIndex) {
  dictById.set((e as AnyRecord).id as string, e);
}
Object.freeze(dictionaryIndex);

export const getDictionaryIndex = () => dictionaryIndex;
export const getDictionaryEntry = (id: string) => dictById.get(id) ?? null;

// ───────────────────────────────────────────────────────────
// ДОП. РАЗДЕЛ: письма (emails)
// ───────────────────────────────────────────────────────────

const emailsGlob = Object.assign(
  {},
  import.meta.glob('../data/emails.json', { eager: true, import: 'default' }),
  import.meta.glob('/src/data/emails.json', { eager: true, import: 'default' }),
  import.meta.glob('./data/emails.json', { eager: true, import: 'default' }),
  import.meta.glob('../../data/emails.json', { eager: true, import: 'default' }),
) as Record<string, any>;
const rawEmails = Object.values(emailsGlob)[0];
const emailsIndex: AnyRecord[] = Array.isArray(rawEmails) ? rawEmails : [];
export const getEmailsIndex = () => emailsIndex;
export const getEmail = (id: string) =>
  emailsIndex.find(e => e?.id === id) ?? null;
