import React from 'react';

export function Card({ elevation = 'high', children, className = '', noPadding = false }) {
  // We use Tonal Layering to indicate depth.
  // Elevation maps to semantic surface containers.
  const levelStyles = {
    lowest: "bg-surface-container-lowest",
    low: "bg-surface-container-low",
    normal: "bg-surface-container",
    high: "bg-surface-container-high",
    highest: "bg-surface-container-highest",
  };
  
  return (
    <div className={`
      ${levelStyles[elevation] || levelStyles.high} 
      ${!noPadding ? 'p-8 md:p-12' : ''} 
      rounded-2xl 
      shadow-ambient
      border border-outline-variant/15
      backdrop-blur-sm
      ${className}
    `}>
      {children}
    </div>
  );
}
