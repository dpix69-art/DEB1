import { useParams, Link } from 'react-router-dom';
import { getDictionaryEntry } from '../lib/data';

export default function DictionaryEntry() {
  const { entryId } = useParams<{ entryId: string }>();
  const entry = entryId ? getDictionaryEntry(entryId) : null;

  if (!entry) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4"><Link to="/dictionary" className="text-blue-600 hover:underline">← Назад к словарю</Link></div>
        <div className="text-gray-500">Запись не найдена.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4"><Link to="/dictionary" className="text-blue-600 hover:underline">← Назад к словарю</Link></div>

      <h1 className="text-2xl font-semibold">{entry.headword}</h1>
      <div className="text-sm text-gray-500 mt-1">{entry.pos}</div>

      <div className="mt-4">
        <div className="text-lg">{entry.preview}</div>
        {entry.translation_ru && (
          <div className="text-gray-700 mt-1">{entry.translation_ru}</div>
        )}
      </div>

      {Array.isArray(entry.examples) && entry.examples.length > 0 && (
        <div className="mt-6">
          <h2 className="font-medium mb-2">Beispiel</h2>
          <div className="border rounded p-3">
            <div className="mb-1">DE: {entry.examples[0]?.de}</div>
            <div className="text-gray-600">RU: {entry.examples[0]?.ru}</div>
          </div>
        </div>
      )}

      {entry.notes && (
        <div className="mt-6">
          <h2 className="font-medium mb-2">Hinweise</h2>
          {entry.notes.usage && <div className="mb-2">• {entry.notes.usage}</div>}
          {Array.isArray(entry.notes.collocations) && entry.notes.collocations.length > 0 && (
            <div className="mb-2">
              <div className="font-medium">Kollokationen</div>
              <ul className="list-disc list-inside text-gray-700">
                {entry.notes.collocations.map((c: string, i: number) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {Array.isArray(entry.topics) && entry.topics.length > 0 && (
        <div className="mt-6">
          <h2 className="font-medium mb-2">Themen</h2>
          <div className="flex flex-wrap gap-2">
            {entry.topics.map((t: string, i: number) => (
              <span key={i} className="text-xs px-2 py-1 border rounded">{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
