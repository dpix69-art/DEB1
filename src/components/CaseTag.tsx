import React from 'react';

interface CaseTagProps {
  case: string;
  className?: string;
}

export function CaseTag({ case: caseType, className = '' }: CaseTagProps) {
  const isAkk = caseType === 'Akk';
  const isDat = caseType === 'Dat';
  
  let bgStyle = {};
  if (isAkk) {
    bgStyle = { backgroundColor: 'rgba(0, 188, 212, 0.1)' };
  } else if (isDat) {
    bgStyle = { backgroundColor: 'rgba(136, 84, 208, 0.1)' };
  }
  
  return (
    <span 
      className={`inline-block px-2 py-1 rounded text-sm font-medium ${className}`}
      style={{ color: '#111', ...bgStyle }}
    >
      {caseType}
    </span>
  );
}