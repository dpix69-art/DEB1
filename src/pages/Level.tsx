import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { getModule } from '../lib/data';
import { CaseTag } from '../components/CaseTag';

export function Level() {
  const { moduleId } = useParams<{ moduleId: string }>();
  
  if (!moduleId) {
    return <Navigate to="/" replace />;
  }
  
  const module = getModule(moduleId);
  
  if (!module) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded">
              <ArrowLeft size={24} style={{ color: '#111' }} />
            </Link>
            <h1 className="text-2xl font-bold" style={{ color: '#111' }}>
  {module.title ?? module.id}
</h1>
          </div>
          <Link to="/" className="p-2 hover:bg-gray-100 rounded">
            <Home size={24} style={{ color: '#666' }} />
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-4">
            {module.cards.map(card => (
              <Link
                key={card.id}
                to={`/card/${moduleId}/${card.id}`}
                className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-xl font-semibold" style={{ color: '#111' }}>
                        {card.expression}
                      </h2>
                      <CaseTag case={card.case} />
                    </div>
                    {card.translation && (
                      <p style={{ color: '#666' }} className="text-sm">
                        {card.translation}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}