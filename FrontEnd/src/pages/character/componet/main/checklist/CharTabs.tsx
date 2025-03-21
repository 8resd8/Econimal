import { createContext, useContext, useState } from 'react';
import { CharButton } from './CharButton';

interface CharTabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

interface CharTabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const CharTabsContext = createContext<CharTabsContextType | undefined>(
  undefined,
);

export function CharTabs({ defaultValue, className, children }: CharTabsProps) {
  const [value, setValue] = useState(defaultValue);
  return (
    <CharTabsContext.Provider value={{ value, onValueChange: setValue }}>
      <div className={className}>{children}</div>
    </CharTabsContext.Provider>
  );
}

export function CharTabsList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`flex ${className}`}>{children}</div>;
}

export function CharTabsTrigger({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const context = useContext(CharTabsContext);
  if (!context) throw new Error('CharTabsTrigger must be used within CharTabs');

  return (
    <CharButton
      variant={context.value === value ? 'default' : 'ghost'}
      className={className}
      onClick={() => context.onValueChange(value)}
    >
      {children}
    </CharButton>
  );
}

export function CharTabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const context = useContext(CharTabsContext);
  if (!context) throw new Error('CharTabsContent must be used within CharTabs');

  return context.value === value ? (
    <div className={className}>{children}</div>
  ) : null;
}

export default CharTabs;
