import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
  full?: boolean;
  children: ReactNode;
};

export function Button({ variant = 'ghost', full = false, className = '', children, ...props }: ButtonProps) {
  const classes = ['btn', variant === 'primary' ? 'btn-primary' : 'btn-ghost', full ? 'btn-full' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
