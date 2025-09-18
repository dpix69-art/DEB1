import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { getModules } from '../lib/data';

export function Home() {
  const modules = getModules();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen size={48} style={{ color: '#111' }} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#111' }}>B1 Trainer</h1>
          <p style={{ color: '#666' }}>German B1 Exam Preparation</p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          {modules.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: '#666' }}>No modules found. Please add JSON files to the /data directory.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {modules.map(module => (
                <Link
                  key={module.id}
                  to={`/level/${module.id}`}
                  className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold" style={{ color: '#111' }}>
                        {module.name}
                      </h2>
                      <p style={{ color: '#666' }} className="text-sm mt-1">
                        {module.cards.length} expression{module.cards.length !== 1 ? 's' : ''}
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