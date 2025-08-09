import React from 'react';
import { ButtonProps } from '../types/calculator';

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  className = '', 
  children, 
  disabled = false 
}) => {
  const baseClasses = `
    h-12 rounded-lg font-medium transition-all duration-200 
    flex items-center justify-center text-sm
    hover:scale-105 active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    shadow-sm hover:shadow-md
  `;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;