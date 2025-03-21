import { CharButton } from './CharButton';

interface CharDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function CharDialog({ open, onOpenChange, children }: CharDialogProps) {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div
        className='relative bg-white rounded-2xl shadow-lg max-w-md w-full overflow-hidden'
        style={{ animation: 'dialogAppear 0.3s ease-out forwards' }}
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
          <CharButton
            variant='ghost'
            size='icon'
            onClick={() => onOpenChange(false)}
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          </CharButton>
        </div>
      </div>
    </div>
  );
}

export function CharDialogContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function CharDialogHeader({ children }: { children: React.ReactNode }) {
  return <div className='mb-4'>{children}</div>;
}

export function CharDialogTitle({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
}
