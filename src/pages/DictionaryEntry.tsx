import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { getDictionaryEntry } from '../lib/data';

export function DictionaryEntry() {
  const { entryId } = useParams<{ entryId: string }>();
  const [searchParams] = useSearchParams();
  const entry = entryId ? getDictionaryEntry(entryId) : null;

  // ссылка «назад» — возвращаемся в dictionary с сохранением pos/q, если они были
  const backHref = (() => {
    const qp = searchParams.toString();
    return qp ? `/dictionary?${qp}` : '/dictionary';
  })();

  if (!entry) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link to="/dictionary" className="p-2 hover:bg-gray-100 rounded">
                <ArrowLeft size={24} style={{ color: '#111' }} />
              </Link>
              <h1 className="text-2xl font-bold" style={{ color: '#111' }}>
                Eintrag nicht gefunden
              </h1>
            </div>
            <Link to="/" className="p-2 hover:bg-gray-100 rounded">
              <Home size={24} style={{ color: '#666' }} />
            </Link>
          </div>

          <div className="max-w-3xl mx-auto">
            <Link
              to="/dictionary"
              className="text-sm px-3 py-2 rounded border bg-white hover:bg-gray-50 inline-block"
            >
              ← Zurück zum Wörterbuch
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const topics: string[] = Array.isArray(entry.topics) ? entry.topics : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header как на Level */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to={backHref} className="p-2 hover:bg-gray-100 rounded">
              <ArrowLeft size={24} style={{ color: '#111' }} />
            </Link>
            <h1 className="text-2xl font-bold" style={{ color: '#111' }}>
              {entry.headword}
            </h1>
          </div>
          <Link to="/" className="p-2 hover:bg-gray-100 rounded">
            <Home size={24} style={{ color: '#666' }} />
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Карточка записи */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500 mb-4">
              {entry.pos}{entry.register ? ` · ${entry.register}` : ''}
            </div>

            {entry.preview && (
              <div className="mb-3">
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
                        {entry.notes.collocations.slice(0, 6).map((c: string, i: number) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {topics.length > 0 && (
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Topics:</div>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded border bg-white">{t}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500">
              ID: <span className="font-mono">{entry.id}</span>
            </div>
          </div>

          {/* Навигация внизу, как на карточках/уровнях (кнопка назад) */}
          <div className="mt-6">
            <Link
              to={backHref}
              className="text-sm px-3 py-2 rounded border bg-white hover:bg-gray-50 inline-block"
            >
              ← Zurück
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
