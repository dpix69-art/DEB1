import { Link, useParams } from 'react-router-dom';
import { getDictionaryEntry } from '../lib/data';

export function DictionaryEntry() {
  const { entryId } = useParams<{ entryId: string }>();
  const entry = entryId ? getDictionaryEntry(entryId) : null;

  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Eintrag nicht gefunden</h1>
        <Link to="/dictionary" className="text-blue-600 underline">← Zurück zum Wörterbuch</Link>
      </div>
    );
  }

  const topics: string[] = Array.isArray(entry.topics) ? entry.topics : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-4">
        <Link to="/dictionary" className="text-blue-600 underline text-sm">← Wörterbuch</Link>
      </div>

      <h1 className="text-2xl font-semibold mb-2">{entry.headword}</h1>
      <div className="text-sm text-gray-500 mb-4">
        {entry.pos}{entry.register ? ` · ${entry.register}` : ''}
      </div>

      {entry.preview && (
        <div className="mb-2">
          <div className="text-sm text-gray-600">Preview:</div>
          <div className="text-base">{entry.preview}</div>
        </div>
      )}

      {entry.translation_ru && (
        <div className="mb-4">
          <div className="text-sm text-gray-600">Перевод:</div>
          <div className="text-base">{entry.translation_ru}</div>
        </div>
      )}

      {Array.isArray(entry.examples) && entry.examples.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-1">Beispiel:</div>
          <div className="border rounded-md bg-white p-3">
            <div className="mb-1">{entry.examples[0]?.de}</div>
            <div className="text-sm text-gray-600">{entry.examples[0]?.ru}</div>
          </div>
        </div>
      )}

      {entry.notes && (
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-1">Hinweise:</div>
          <div className="border rounded-md bg-white p-3 space-y-2">
            {entry.notes.usage && (
              <div><span className="text-sm text-gray-600">Usage: </span>{entry.notes.usage}</div>
            )}
            {Array.isArray(entry.notes.collocations) && entry.notes.collocations.length > 0 && (
              <div>
                <div className="text-sm text-gray-600">Collocations:</div>
                <ul className="list-disc list-inside">
                  {entry.notes.collocations.slice(0, 4).map((c: string, i: number) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {topics.length > 0 && (
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-1">Topics:</div>
          <div className="flex flex-wrap gap-2">
            {topics.map((t, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded border bg-white">{t}</span>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500">
        ID: <span className="font-mono">{entry.id}</span>
      </div>
    </div>
  );
}
