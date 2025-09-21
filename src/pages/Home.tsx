import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { getModules } from '../lib/data';

export function Home() {
  // Получаем уровни
  const modules = getModules();

  // Парсим номер из id/slug/title — устойчиво к "level1.json", "level10.json" и т.д.
  const parseLevelIndex = (m: any) => {
    const src = (m?.id ?? m?.slug ?? m?.title ?? '').toString().toLowerCase();
    const match = src.match(/(\d+)/); // первое число в строке
    return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
  };

  // Сортируем по возрастанию номера
  const sorted = [...modules].sort((a, b) => parseLevelIndex(a) - parseLevelIndex(b));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen size={48} style={{ color: '#111' }} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#111' }}>
            B1 Trainer
          </h1>
          <p className="text-base" style={{ color: '#666' }}>
            Подготовка к telc Deutsch B1: выражения, примеры и упражнения.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
            to="/dictionary"
            className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
            <h2 className="text-xl font-semibold" style={{ color: '#111' }}>Dictionary</h2>
            <p className="text-sm mt-1" style={{ color: '#666' }}>
        Большой словарь B1: формы, примеры, поиск.
            </p>
          </Link>
        <Link
      to="/emails"
      className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <h2 className="text-xl font-semibold" style={{ color: '#111' }}>Emails Lesen</h2>
      <p className="text-sm mt-1" style={{ color: '#666' }}>
        Письма и задания на чтение формата telc.
      </p>
    </Link>
  </div>
        </div>

        {/* Список уровней */}
        <div className="max-w-5xl mx-auto">
          {sorted.length === 0 ? (
            <div className="text-center text-sm" style={{ color: '#666' }}>
              Пока нет уровней.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((module: any) => (
                <Link
                  key={module.id}
                  to={`/level/${module.id}`}
                  className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold" style={{ color: '#111' }}>
                        {module.title ?? module.id}
                      </h2>
                      {module.description && (
                        <p className="text-sm mt-1" style={{ color: '#666' }}>
                          {module.description}
                        </p>
                      )}
                      <p className="text-sm mt-1" style={{ color: '#666' }}>
                        {module.cards?.length ?? 0} expression
                        {(module.cards?.length ?? 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <BookOpen size={24} style={{ color: '#666' }} />
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
