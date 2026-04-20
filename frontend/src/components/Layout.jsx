import React from 'react';

// Container enforces max-width and generous horizontal padding
export function Container({ children, className = '' }) {
  return (
    <div className={`max-w-4xl mx-auto px-6 sm:px-12 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}

// Section provides vertical rhythm and tonal layering transitions
export function Section({ children, background = 'base', className = '' }) {
  const bgStyles = {
    base: 'bg-surface',
    low: 'bg-surface-container-low',
    highest: 'bg-surface-container-highest',
  };
  
  return (
    <section className={`py-16 md:py-32 ${bgStyles[background] || bgStyles.base} ${className}`}>
      {children}
    </section>
  );
}
