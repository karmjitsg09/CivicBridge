import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cobalt' | 'coral' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '0.45rem 0.9rem', fontSize: '0.85rem' },
    md: { padding: '0.75rem 1.4rem', fontSize: '0.95rem' },
    lg: { padding: '0.95rem 1.85rem', fontSize: '1.05rem' },
  };

  const variantClass = `stitch-btn stitch-btn-${variant}`;

  return (
    <button
      className={`${variantClass} ${className}`}
      style={{ ...sizeStyles[size], ...style }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : icon}
      <span>{children}</span>
    </button>
  );
};

export default Button;
