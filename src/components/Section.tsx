import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export function Section({ children, className }: SectionProps) {
  return <section className={`section-padding ${className ?? ''}`.trim()}>{children}</section>;
}
