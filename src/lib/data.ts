// src/lib/data.ts
type AnyRecord = Record<string, any>;

export type LevelModule = {
  id: string;              // "level1", "level2", ...
  title?: string;
  description?: string;
  cards: AnyRecord[];      // массив карточек
};

// ───────────────────────────────────────────────────────────
// СЛОВАРЬ: автосборка из нескольких файлов
// ───────────────────────────────────────────────────────────

// 1) Пытаемся собрать всё из src/data/dictionary/*.json (кроме manifest.json)
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

// 3) Сборка:
//  - если есть папка /dictionary/*.json → берём все массивы кроме manifest.json и склеиваем
//  - если нет → берём старый dictionary.json (если он массив)
//  - если вместо массива пришёл "bundle-объект" { nouns:[], verbs:[], ... } → склеиваем поля
(() => {
  const entries = Object.entries(dictPartsGlob);
  const hasFolder = entries.length > 0;

  if (hasFolder) {
    const parts = entries
      .filter(([path]) => !/manifest\.json$/i.test(path))
      .map(([, mod]) => mod);

    // каждый файл либо массив, либо bundle-объект (на всякий)
    const flattened: AnyRecord[] = [];
    for (const part of parts) {
      if (Array.isArray(part)) {
        flattened.push(...part);
      } else if (part && typeof part === 'object') {
        for (const key of ['nouns', 'verbs', 'adjectives', 'advs', 'phrases']) {
          if (Array.isArray(part[key])) flattened.push(...part[key]);
        }
      }
    }
    dictionaryIndex = flattened;
  } else if (Array.isArray(dictSingle)) {
    dictionaryIndex = dictSingle;
  } else if (dictSingle && typeof dictSingle === 'object') {
    const bucketKeys = ['nouns', 'verbs', 'adjectives', 'advs', 'phrases'];
    for (const k of bucketKeys) {
      if (Array.isArray(dictSingle[k])) dictionaryIndex.push(...dictSingle[k]);
    }
  }
})();

export const getDictionaryIndex = () => dictionaryIndex;
export const getDictionaryEntry = (id: string) =>
  dictionaryIndex.find(e => e?.id === id) ?? null;

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
  const cards = Array.isArray(mod?.cards) ? mod.cards : [];
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
// ДОП. РАЗДЕЛЫ (опционально): словарь и письма
// ───────────────────────────────────────────────────────────

const dictGlob = Object.assign(
  {},
  import.meta.glob('../data/dictionary.json', { eager: true, import: 'default' }),
  import.meta.glob('/src/data/dictionary.json', { eager: true, import: 'default' }),
  import.meta.glob('./data/dictionary.json', { eager: true, import: 'default' }),
  import.meta.glob('../../data/dictionary.json', { eager: true, import: 'default' }),
) as Record<string, any>;
const rawDict = Object.values(dictGlob)[0];
const dictionaryIndex: AnyRecord[] = Array.isArray(rawDict) ? rawDict : [];
export const getDictionaryIndex = () => dictionaryIndex;
export const getDictionaryEntry = (id: string) =>
  dictionaryIndex.find(e => e?.id === id) ?? null;

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
