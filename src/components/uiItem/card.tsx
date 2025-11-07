import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children, ...p }) => {
    return (
        <div
            className={
                'rounded-lg shadow overflow-hidden border border-gray-200' +
                (className ? ` ${className}` : '') + (className && className.includes('bg-') ? '' : ' bg-white')
            }

            {...p}
        >
            {children}
        </div >
    );
};

interface CardHeaderProps {
    className?: string;
    children?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ className, children }) => {
    return (
        <div
            className={
                'px-4 py-3 border-b border-gray-200' +
                (className ? ` ${className}` : '')
            }
        >
            {children}
        </div>
    );
};

interface CardContentProps {
    className?: string;
    children?: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ className, children }) => {
    return (
        <div
            className={
                'px-4 py-3' +
                (className ? ` ${className}` : '')
            }
        >
            {children}
        </div>
    );
};

interface CardFooterProps {
    className?: string;
    children?: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ className, children }) => {
    return (
        <div
            className={
                'px-4 py-3 border-t border-gray-200' +
                (className ? ` ${className}` : '')
            }
        >
            {children}
        </div>
    );
};
