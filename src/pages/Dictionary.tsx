import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDictionaryIndex } from '../lib/data';

type DictItem = {
  id: string;
  headword: string;
  pos: 'N' | 'V' | 'ADJ' | 'ADV' | 'PHRASE' | string;
  preview?: string;
  translation_ru?: string;
  gender?: 'm' | 'f' | 'n' | null;
  forms?: Record<string, string | null | undefined>;
  examples?: { de: string; ru: string }[];
  notes?: {
    synonyms?: string[];
    antonyms?: string[];
    usage?: string;
    collocations?: string[];
  };
  topics?: string[];
  register?: 'neutral' | 'formell' | 'ugs.' | string;
  b1_verified?: boolean;
};

const latinize = (s: string) =>
  (s || '')
    .toLowerCase()
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss');

const byAlpha = (a: DictItem, b: DictItem) =>
  latinize(a.headword).localeCompare(latinize(b.headword));

const POS_LABEL = (pos?: string) => {
  switch (pos) {
    case 'N': return 'N';
    case 'V': return 'V';
    case 'ADJ': return 'ADJ';
    case 'ADV': return 'ADV';
    case 'PHRASE': return 'PHR';
    default: return pos || '';
  }
};

const GenderLabel = ({ gender }: { gender?: string | null }) => {
  if (!gender) return null;
  const map: Record<string, string> = { m: 'm', f: 'f', n: 'n' };
  const text = map[gender] || gender;
  return (
    <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-xs"
      style={{ borderColor: '#E5E7EB', color: '#374151', background: '#F9FAFB' }}>
      {text}
    </span>
  );
};

const TopicBadge = ({ text }: { text: string }) => (
  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs mr-1 mb-1"
    style={{ borderColor: '#E5E7EB', color: '#374151', background: '#F9FAFB' }}>
    {text}
  </span>
);

const RegisterBadge = ({ text }: { text?: string }) => {
  if (!text) return null;
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs"
      style={{ borderColor: '#E5E7EB', color: '#6B7280', background: '#F3F4F6' }}>
      {text}
    </span>
  );
};

const FormsLine: React.FC<{ item: DictItem }> = ({ item }) => {
  const f = item.forms || {};
  if (item.pos === 'N') {
    const article = f.article || '';
    const genitiv = f.genitiv || '';
    const plural = f.plural || '';
    if (!article && !genitiv && !plural) return null;
    return (
      <div className="text-sm" style={{ color: '#374151' }}>
        {article ? <span className="mr-4"><b>Art.:</b> {article}</span> : null}
        {genitiv ? <span className="mr-4"><b>Gen.:</b> {genitiv}</span> : null}
        {plural ? <span className="mr-4"><b>Pl.:</b> {plural}</span> : null}
      </div>
    );
  }
  if (item.pos === 'V') {
    const inf = f.infinitive || '';
    const praet = f.praeteritum_3sg || '';
    const p2 = f.partizip_ii || '';
    const perf = f.perfekt_3sg || '';
    if (!inf && !praet && !p2 && !perf) return null;
    return (
      <div className="text-sm" style={{ color: '#374151' }}>
        {inf ? <span className="mr-4"><b>Inf.:</b> {inf}</span> : null}
        {praet ? <span className="mr-4"><b>Prät.:</b> {praet}</span> : null}
        {p2 ? <span className="mr-4"><b>Part. II:</b> {p2}</span> : null}
        {perf ? <span className="mr-4"><b>Perf.:</b> {perf}</span> : null}
      </div>
    );
  }
  if (item.pos === 'ADJ') {
    const comp = f.comparative || '';
    const sup = f.superlative || '';
    if (!comp && !sup) return null;
    return (
      <div className="text-sm" style={{ color: '#374151' }}>
        {comp ? <span className="mr-4"><b>Komparativ:</b> {comp}</span> : null}
        {sup ? <span className="mr-4"><b>Superlativ:</b> {sup}</span> : null}
      </div>
    );
  }
  return null;
};

export function Dictionary() {
  const items = getDictionaryIndex() as DictItem[];
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const list = Array.isArray(items) ? [...items] : [];
    const sorted = list.sort(byAlpha);
    if (!q.trim()) return sorted;
    const needle = q.trim().toLowerCase();
    return sorted.filter(it =>
      it.headword?.toLowerCase().includes(needle) ||
      it.translation_ru?.toLowerCase().includes(needle)
    );
  }, [items, q]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Верхняя навигация */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded" style={{ color: '#111' }}>← Back</Link>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold" style={{ color: '#111' }}>Dictionary</h1>
          <div className="text-sm" style={{ color: '#666' }}>
            {filtered.length} {filtered.length === 1 ? 'Eintrag' : 'Einträge'}
          </div>
        </div>

        {/* Поиск */}
        <div className="mb-4">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Suche / Поиск… (DE/RU)"
            className="w-full rounded-lg border px-4 py-2"
            style={{ borderColor: '#E5E7EB', background: '#FFF', color: '#111' }}
          />
        </div>

        {/* Список */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0">
          {filtered.length === 0 ? (
            <div className="p-6 text-sm" style={{ color: '#666' }}>
              Ничего не найдено. Попробуй изменить запрос.
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#E5E7EB' }}>
              {filtered.map((it) => (
                <Link
                  key={it.id}
                  to={`/dictionary/${it.id}`}
                  className="block p-4 sm:p-5 hover:bg-gray-50"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {/* Заголовок: слово + POS + род (для N) + register */}
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <div className="text-lg font-semibold" style={{ color: '#111' }}>
                      {it.headword}
                    </div>
                    <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-xs"
                      style={{ borderColor: '#E5E7EB', color: '#374151', background: '#F9FAFB' }}>
                      {POS_LABEL(it.pos)}
                    </span>
                    {it.pos === 'N' ? <GenderLabel gender={it.gender} /> : null}
                    <RegisterBadge text={it.register} />
                    {it.b1_verified ? (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs"
                        style={{ background: '#ECFDF5', color: '#065F46' }}>
                        B1
                      </span>
                    ) : null}
                  </div>

                  {/* Перевод + краткий превью */}
                  <div className="text-sm mb-2">
                    {it.translation_ru ? (
                      <span style={{ color: '#111' }}>{it.translation_ru}</span>
                    ) : null}
                    {it.preview && it.preview !== it.translation_ru ? (
                      <span style={{ color: '#6B7280' }}> — {it.preview}</span>
                    ) : null}
                  </div>

                  {/* Формы по POS */}
                  <FormsLine item={it} />

                  {/* Usage (если есть) */}
                  {it?.notes?.usage ? (
                    <div className="mt-1 text-sm italic" style={{ color: '#6B7280' }}>
                      {it.notes.usage}
                    </div>
                  ) : null}

                  {/* Примеры (первые 1–2 строки) */}
                  {Array.isArray(it.examples) && it.examples.length > 0 && (
                    <div className="mt-3 grid gap-2">
                      {it.examples.slice(0, 2).map((ex, idx) => (
                        <div key={idx} className="text-sm">
                          <div style={{ color: '#111' }}>{ex.de}</div>
                          <div className="italic" style={{ color: '#6B7280' }}>{ex.ru}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Теги тем / коллокации (коротко) */}
                  <div className="mt-3 flex flex-wrap">
                    {Array.isArray(it.topics) && it.topics.slice(0, 3).map(t => (
                      <TopicBadge key={t} text={t} />
                    ))}
                    {Array.isArray(it?.notes?.collocations) && it.notes!.collocations!.length > 0 && (
                      <span className="ml-1 text-xs" style={{ color: '#6B7280' }}>
                        • {it.notes!.collocations!.slice(0, 2).join(', ')}
                        {it.notes!.collocations!.length > 2 ? ' …' : ''}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
