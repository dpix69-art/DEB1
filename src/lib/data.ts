// src/lib/data.ts
type AnyRecord = Record<string, any>;

export type LevelModule = {
  id: string;              // "level1", "level2", ...
  title?: string;
  description?: string;
  cards: AnyRecord[];      // структура карточек уровня
};

// ───────────────────────────────────────────────────────────
// УРОВНИ: автозагрузка всех /data/level*.json + сортировка 1..19
// ───────────────────────────────────────────────────────────

const levelModulesRaw = import.meta.glob('../data/level*.json', {
  eager: true,
  import: 'default'
}) as Record<string, any>;

const parseIndexFromString = (s: string): number => {
  const m = s.toLowerCase().match(/(\d+)/);
  return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
};

const parseIndexFromPath = (p: string): number => {
  // например: ../data/level12.json  -> 12
  const m = p.toLowerCase().match(/level(\d+)\.json$/);
  return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
};

const normalizeModule = (path: string, mod: any): LevelModule => {
  const pathIdx = parseIndexFromPath(path);
  const fallbackId = `level${Number.isFinite(pathIdx) ? pathIdx : ''}`;
  return {
    id: (typeof mod?.id === 'string' && mod.id.length) ? mod.id : fallbackId,
    title: mod?.title,
    description: mod?.description,
    cards: Array.isArray(mod?.cards) ? mod.cards : []
  };
};

const levelModules: LevelModule[] = Object.entries(levelModulesRaw)
  .map(([path, mod]) => normalizeModule(path, mod))
  .sort((a, b) => {
    // сортируем по числу из id; если нет — по числу из пути
    const ia = Number.isFinite(parseIndexFromString(a.id))
      ? parseIndexFromString(a.id)
      : parseIndexFromPath(a.id);
    const ib = Number.isFinite(parseIndexFromString(b.id))
      ? parseIndexFromString(b.id)
      : parseIndexFromPath(b.id);
    return ia - ib;
  });

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
// Если файлов нет — просто пустые массивы.
// ───────────────────────────────────────────────────────────

const dictGlob = import.meta.glob('../data/dictionary.json', {
  eager: true,
  import: 'default'
}) as Record<string, any>;
const rawDict = Object.values(dictGlob)[0];
const dictionaryIndex: AnyRecord[] = Array.isArray(rawDict) ? rawDict : [];

export const getDictionaryIndex = () => dictionaryIndex;
export const getDictionaryEntry = (id: string) =>
  dictionaryIndex.find(e => e?.id === id) ?? null;

const emailsGlob = import.meta.glob('../data/emails.json', {
  eager: true,
  import: 'default'
}) as Record<string, any>;
const rawEmails = Object.values(emailsGlob)[0];
const emailsIndex: AnyRecord[] = Array.isArray(rawEmails) ? rawEmails : [];

export const getEmailsIndex = () => emailsIndex;
export const getEmail = (id: string) =>
  emailsIndex.find(e => e?.id === id) ?? null;
