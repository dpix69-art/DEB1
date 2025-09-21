// src/pages/Emails.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { getEmailsIndex } from '../lib/data';

export function Emails() {
  const emails = getEmailsIndex();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded">← Back</Link>
        </div>

        <h1 className="text-3xl font-bold mb-4" style={{ color: '#111' }}>Emails Lesen</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {emails.length === 0 ? (
            <div className="text-sm" style={{ color: '#666' }}>Пока пусто. Добавь /data/emails.json</div>
          ) : (
            <div className="grid gap-3">
              {emails.map((e: any) => (
                <div key={e.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-semibold">{e.title}</div>
                    <div className="text-sm" style={{ color: '#666' }}>
                      Level: {e.level} • {e.length} Wörter
                    </div>
                  </div>
                  {/* позже добавим детали: /emails/:id */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
