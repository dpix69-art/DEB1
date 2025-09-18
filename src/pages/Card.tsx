import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { getCard } from '../lib/data';
import { CaseTag } from '../components/CaseTag';
import { ExampleList } from '../components/ExampleList';
import { Order } from '../components/exercises/Order';
import { Gap } from '../components/exercises/Gap';
import { Reading } from '../components/exercises/Reading';
import { DaWo } from '../components/exercises/DaWo';

export function Card() {
  const { moduleId, cardId } = useParams<{ moduleId: string; cardId: string }>();
  
  if (!moduleId || !cardId) {
    return <Navigate to="/" replace />;
  }
  
  const result = getCard(moduleId, cardId);
  
  if (!result) {
    return <Navigate to="/" replace />;
  }
  
  const { module, card } = result;
  
  const renderExercise = (exercise: any, index: number) => {
    const key = `${exercise.type}-${index}`;
    
    switch (exercise.type) {
      case 'order':
        return <Order key={key} exercise={exercise} />;
      case 'gap':
        return <Gap key={key} exercise={exercise} />;
      case 'reading':
        return <Reading key={key} exercise={exercise} />;
      case 'da_wo':
        return <DaWo key={key} exercise={exercise} />;
      default:
        return (
          <div key={key} className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            Unknown exercise type: {exercise.type}
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            to={`/level/${moduleId}`} 
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
          >
            <ArrowLeft size={24} style={{ color: '#111' }} />
            <span style={{ color: '#111' }}>Back</span>
          </Link>
          <Link to="/" className="p-2 hover:bg-gray-100 rounded">
            <Home size={24} style={{ color: '#666' }} />
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4 mb-4">
              <h1 className="text-3xl font-bold" style={{ color: '#111' }}>
                {card.expression}
              </h1>
              <CaseTag case={card.case} />
            </div>
            {card.translation && (
              <p style={{ color: '#666' }} className="text-lg italic mb-4">
                {card.translation}
              </p>
            )}
            
            {/* Articles */}
            {card.articles && (
              <div className="space-y-2">
                <h3 className="font-semibold" style={{ color: '#111' }}>Articles</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                  {card.articles.m && (
                    <span><strong>m:</strong> {card.articles.m}</span>
                  )}
                  {card.articles.f && (
                    <span><strong>f:</strong> {card.articles.f}</span>
                  )}
                  {card.articles.n && (
                    <span><strong>n:</strong> {card.articles.n}</span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Examples */}
          {card.examples && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <ExampleList examples={card.examples} />
            </div>
          )}
          
          {/* Exercises */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold" style={{ color: '#111' }}>Exercises</h2>
            {card.exercises.map((exercise, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {renderExercise(exercise, index)}
              </div>
            ))}
          </div>
          
          {/* Vocabulary */}
          {card.vocab && card.vocab.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#111' }}>Vocabulary</h3>
              <div className="grid gap-2">
                {card.vocab.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span style={{ color: '#111' }}>{item.de}</span>
                    <span style={{ color: '#666' }} className="italic">{item.ru}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}