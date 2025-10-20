import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'ghost' | 'default';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded transition';
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-green-500 text-gray-700 hover:bg-gray-100',
    ghost: 'text-gray-700 hover:bg-gray-100',
  };
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
    icon: 'p-2',
  };

  const combinedClass =
    baseStyles +
    ' ' +
    variantStyles[variant] +
    ' ' +
    sizeStyles[size] +
    (className ? ` ${className}` : '');

  return (
    <button
      className={combinedClass}
      {...props}
    >
      {children}
    </button>
  );
};