interface CharInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function CharInput({ className = '', ...props }: CharInputProps) {
  return (
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
      {...props}
    />
  );
}
