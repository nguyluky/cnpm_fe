import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'secondary'; // Thêm "secondary"
  className?: string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', className, children }) => {
  const variantStyles: Record<string, string> = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    secondary: 'bg-purple-100 text-purple-800', // Định nghĩa kiểu "secondary"
  };

  const baseClass =
    'inline-flex items-center px-2 py-1 rounded text-xs font-medium';
  const variantClass = variantStyles[variant] || variantStyles.default;
  const combinedClass =
    baseClass +
    ' ' +
    variantClass +
    (className ? ` ${className}` : '');

  return (
    <span className={combinedClass}>
      {children}
    </span>
  );
};