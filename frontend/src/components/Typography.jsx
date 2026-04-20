import React from 'react';

export function Typography({ variant = 'body', children, className = '' }) {
  const styles = {
    headline: 'font-serif text-3xl md:text-5xl font-medium tracking-tight text-on-surface',
    body: 'font-sans text-base md:text-lg leading-relaxed text-on-surface',
    label: 'font-sans text-xs md:text-sm font-medium uppercase tracking-wider text-on-surface-variant',
  };
  
  const tags = {
    headline: 'h2',
    body: 'p',
    label: 'span',
  };
  
  const Tag = tags[variant] || 'p';
  
  return (
    <Tag className={`${styles[variant] || styles.body} ${className}`}>
      {children}
    </Tag>
  );
}
