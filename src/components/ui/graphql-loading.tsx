'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GraphQLLoadingProps {
  isLoading: boolean;
  loadingText?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function GraphQLLoading({ 
  isLoading, 
  loadingText = 'Loading...', 
  className,
  size = 'md' 
}: GraphQLLoadingProps) {
  if (!isLoading) return null;

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      <span className="text-sm text-muted-foreground">{loadingText}</span>
    </div>
  );
}

interface GraphQLButtonProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export function GraphQLButton({ 
  isLoading, 
  loadingText = 'Loading...', 
  children, 
  className,
  disabled,
  onClick,
  type = 'button'
}: GraphQLButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {isLoading ? loadingText : children}
    </button>
  );
} 