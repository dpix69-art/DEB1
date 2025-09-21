// src/pages/Dictionary.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { getDictionaryIndex } from '../lib/data';

export function Dictionary() {
  const items = getDictionaryIndex();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded">← Back</Link>
        </div>

        <h1 className="text-3xl font-bold mb-4" style={{ color: '#111' }}>Dictionary</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {items.length === 0 ? (
            <div className="text-sm" style={{ color: '#666' }}>Пока пусто. Добавь /data/dictionary.json</div>
          ) : (
            <div className="grid gap-3">
              {items.map((it: any) => (
                <div key={it.id} className="flex items-start justify-between py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-semibold">
                      {it.headword} <span className="text-sm" style={{ color: '#666' }}>{it.pos}</span>
                    </div>
                    {it.preview && <div className="text-sm" style={{ color: '#666' }}>{it.preview}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
