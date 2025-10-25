import React from 'react';

interface AvatarProps {
  className?: string;
  children?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({ className, children }) => {
  return (
    <div
      className={
        'relative inline-flex items-center justify-center rounded-full overflow-hidden bg-gray-200' +
        (className ? ` ${className}` : '')
      }
    >
      {children}
    </div>
  );
};

// Sử dụng `type` thay vì `interface` để tránh lỗi ESLint
type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export const AvatarImage: React.FC<AvatarImageProps> = ({ className, ...props }) => {
  return (
    <img
      className={'w-full h-full object-cover' + (className ? ` ${className}` : '')}
      {...props}
    />
  );
};

interface AvatarFallbackProps {
  className?: string;
  children?: React.ReactNode;
}

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ className, children }) => {
  return (
    <div
      className={
        'absolute inset-0 flex items-center justify-center text-gray-500' +
        (className ? ` ${className}` : '')
      }
    >
      {children}
    </div>
  );
};