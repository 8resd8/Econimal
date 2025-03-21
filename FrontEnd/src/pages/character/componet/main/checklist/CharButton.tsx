// components/ui/char-button.tsx
interface CharButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function CharButton({
  variant = 'default',
  size = 'default',
  className = '',
  children,
  ...props
}: CharButtonProps) {
  const baseStyles = 'font-medium transition-colors rounded-md';
  const variantStyles = {
    default: 'bg-purple-500 text-white hover:bg-purple-600',
    outline: 'border border-gray-300 hover:bg-gray-100',
    ghost: 'hover:bg-gray-100',
    link: 'text-purple-500 hover:underline',
  };
  const sizeStyles = {
    default: 'px-4 py-2',
    sm: 'px-3 py-1 text-sm',
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
