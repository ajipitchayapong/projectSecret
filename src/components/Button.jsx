import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const baseStyle = {
    padding: '12px 24px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: variant === 'primary' 
      ? 'rgba(99, 102, 241, 0.2)' 
      : 'rgba(255, 255, 255, 0.05)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: variant === 'primary' 
      ? '0 4px 14px 0 rgba(99, 102, 241, 0.39)' 
      : '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: 'var(--font-main)',
  };

  const hoverStyle = {
    transform: 'translateY(-2px)',
    background: variant === 'primary' 
      ? 'rgba(99, 102, 241, 0.4)' 
      : 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    boxShadow: variant === 'primary'
      ? '0 6px 20px rgba(99, 102, 241, 0.23)'
      : '0 6px 12px rgba(0,0,0,0.1)'
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...baseStyle,
        ...(isHovered ? hoverStyle : {}),
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
