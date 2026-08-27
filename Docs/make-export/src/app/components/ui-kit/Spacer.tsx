import React from 'react';

export interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  axis?: 'horizontal' | 'vertical' | 'both';
}

const sizeMap = {
  xs: '8px',
  sm: '16px',
  md: '24px',
  lg: '32px',
  xl: '48px',
  '2xl': '64px',
  '3xl': '96px',
};

const Spacer: React.FC<SpacerProps> = ({ size = 'md', axis = 'vertical' }) => {
  const spacing = sizeMap[size];

  const style: React.CSSProperties = {
    width: axis === 'horizontal' || axis === 'both' ? spacing : undefined,
    height: axis === 'vertical' || axis === 'both' ? spacing : undefined,
    flexShrink: 0,
  };

  return <div style={style} aria-hidden="true" />;
};

export { Spacer };
