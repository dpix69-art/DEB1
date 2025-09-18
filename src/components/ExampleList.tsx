import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Examples } from '../types';

interface ExampleListProps {
  examples: Examples;
}

export function ExampleList({ examples }: ExampleListProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const sections = [
    { key: 'present', title: 'Present', items: examples.present },
    { key: 'past', title: 'Past', items: examples.past },
    { key: 'future', title: 'Future', items: examples.future },
  ].filter(section => section.items && section.items.length > 0);
  
  if (sections.length === 0) return null;
  
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold" style={{ color: '#111' }}>Examples</h3>
      {sections.map(section => (
        <div key={section.key} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection(section.key)}
            className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium" style={{ color: '#111' }}>{section.title}</span>
            {expandedSections[section.key] ? (
              <ChevronDown size={20} style={{ color: '#666' }} />
            ) : (
              <ChevronRight size={20} style={{ color: '#666' }} />
            )}
          </button>
          {expandedSections[section.key] && (
            <div className="p-4 space-y-3">
              {section.items?.map((example, idx) => (
                <div key={idx} className="space-y-1">
                  <div style={{ color: '#111' }}>{example.de}</div>
                  <div style={{ color: '#666' }} className="text-sm italic">{example.ru}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}