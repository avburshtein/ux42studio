import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-[600px]',
  md: 'max-w-[900px]',
  lg: 'max-w-[1200px]',
  xl: 'max-w-[1400px]',
  full: 'max-w-full',
};

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxWidth = 'xl', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full ${maxWidthClasses[maxWidth]} mx-auto px-[20px] md:px-[40px] lg:px-[80px] ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Container.displayName = 'Container';

export { Container };
