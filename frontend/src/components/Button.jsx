import React from 'react';

export function Button({ variant = 'primary', children, className = '', ...props }) {
  const baseStyle = "inline-flex items-center justify-center px-6 py-2.5 transition-all duration-500 ease-in-out font-sans font-medium text-sm disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary-radial text-on-primary rounded-md hover:shadow-ambient active:scale-95",
    secondary: "bg-surface-container-high text-on-surface rounded-md hover:bg-surface-container-highest active:scale-95",
    tertiary: "bg-transparent text-secondary hover:text-secondary-container active:scale-95 !px-2",
    waxSeal: "bg-secondary text-on-secondary rounded-full w-12 h-12 p-0 shadow-inner hover:shadow-ambient active:scale-95 flex items-center justify-center",
  };

  return (
    <button className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}
