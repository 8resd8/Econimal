interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
} //주석

export const ChecklistDialog = ({
  open,
  onOpenChange,
  children,
}: DialogProps) => {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div
        className='relative bg-white rounded-2xl shadow-lg max-w-md w-full overflow-hidden'
        style={{
          animation: 'dialogAppear 0.3s ease-out forwards',
        }}
      >
        <style>{`
          @keyframes dialogAppear {
            from {
              transform: scale(0.9);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
        {children}
        <div className='absolute top-4 right-4'>
          <button
            onClick={() => onOpenChange(false)}
            className='text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100'
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
//??

export function DialogContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className='mb-4'>{children}</div>;
}

export function DialogTitle({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
}

export default ChecklistDialog;
