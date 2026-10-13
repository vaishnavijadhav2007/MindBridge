import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: React.ElementType;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  padding = 'md',
  as: Component = 'div',
  ...props
}) => {
  const paddingMap = {
    none: '',
    sm: 'p-4 sm:p-5',
    md: 'p-5 sm:p-6 lg:p-7',
    lg: 'p-7 sm:p-8 lg:p-10',
  };

  return (
    <Component
      className={`
        bg-[#FFFCF6]
        border border-[#E4DACA]
        rounded-2xl sm:rounded-3xl
        shadow-soft-sm
        ${hoverEffect ? 'hover:shadow-soft-md hover:border-[#829675]/40 transition-all duration-300 transform hover:-translate-y-0.5' : 'transition-shadow duration-200'}
        ${paddingMap[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
};
