import type { ReactNode } from 'react';

type IconBoxVariant = 'primary' | 'emerald' | 'slate';

interface IconBoxProps {
  children: ReactNode;
  variant?: IconBoxVariant;
  size?: 'sm' | 'md';
}

const variantClasses: Record<IconBoxVariant, string> = {
  primary: 'from-primary-500/20 to-emerald-500/20 text-primary-200',
  emerald: 'from-emerald-500/20 to-primary-500/20 text-emerald-200',
  slate: 'from-slate-700/30 to-slate-600/20 text-slate-200',
};

export function IconBox({ children, variant = 'primary', size = 'md' }: IconBoxProps) {
  const sizeClasses =
    size === 'sm'
      ? 'h-10 w-10 md:h-11 md:w-11'
      : 'h-12 w-12 md:h-14 md:w-14';

  return (
    <div
      className={`flex ${sizeClasses} items-center justify-center rounded-2xl bg-gradient-to-br ${variantClasses[variant]} shadow-[0_0_0_1px_rgba(15,23,42,0.6)]`}
    >
      {children}
    </div>
  );
}

/* Simple line icons that pick up currentColor */

export function BriefcaseIcon() {
  return (
    <svg
      className="h-6 w-6 md:h-7 md:w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </svg>
  );
}

export function ShieldIcon() {
  return (
    <svg
      className="h-6 w-6 md:h-7 md:w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 5 6v6c0 3.5 2.4 6.7 7 9 4.6-2.3 7-5.5 7-9V6l-7-3Z" />
      <path d="M9.5 12.5 11 14l3.5-3.5" />
    </svg>
  );
}

export function ChartIcon() {
  return (
    <svg
      className="h-6 w-6 md:h-7 md:w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19V5" />
      <path d="M20 19H4" />
      <rect x="7" y="9" width="3" height="6" rx="1" />
      <rect x="12" y="7" width="3" height="8" rx="1" />
      <rect x="17" y="5" width="3" height="10" rx="1" />
    </svg>
  );
}

export function FlaskIcon() {
  return (
    <svg
      className="h-6 w-6 md:h-7 md:w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 2h4" />
      <path d="M11 2v6.5L6.2 18a2 2 0 0 0 1.8 3h8a2 2 0 0 0 1.8-3L13 8.5V2" />
      <path d="M8 11h8" />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg
      className="h-6 w-6 md:h-7 md:w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14v2" />
    </svg>
  );
}

export function BookIcon() {
  return (
    <svg
      className="h-6 w-6 md:h-7 md:w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 4h9a3 3 0 0 1 3 3v13" />
      <path d="M5 4v16a2 2 0 0 0 2 2h10" />
      <path d="M9 8h5" />
      <path d="M9 12h3" />
    </svg>
  );
}

export function BrainIcon() {
  return (
    <svg
      className="h-6 w-6 md:h-7 md:w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 4A3.5 3.5 0 0 0 5 7.5v1A3.5 3.5 0 0 0 8.5 12 3.5 3.5 0 0 0 5 15.5V17a3 3 0 0 0 3 3h1" />
      <path d="M15.5 4A3.5 3.5 0 0 1 19 7.5v1A3.5 3.5 0 0 1 15.5 12 3.5 3.5 0 0 1 19 15.5V17a3 3 0 0 1-3 3h-1" />
      <path d="M12 3v18" />
    </svg>
  );
}

export function NetworkIcon() {
  return (
    <svg
      className="h-6 w-6 md:h-7 md:w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="5" cy="19" r="2.5" />
      <circle cx="19" cy="19" r="2.5" />
      <path d="M11 7.4 7 16.6" />
      <path d="M13 7.4 17 16.6" />
      <path d="M7.5 19h9" />
    </svg>
  );
}

export function CloudIcon() {
  return (
    <svg
      className="h-6 w-6 md:h-7 md:w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 18a4 4 0 1 1 .4-7.98A5 5 0 0 1 19 11a3 3 0 1 1 0 6H7Z" />
    </svg>
  );
}

export function ClipboardIcon() {
  return (
    <svg
      className="h-6 w-6 md:h-7 md:w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="7" y="4" width="10" height="16" rx="2" />
      <path d="M9 4.5h6" />
      <path d="M9 9h6" />
      <path d="M9 13h4" />
    </svg>
  );
}

export function GearIcon() {
  return (
    <svg
      className="h-6 w-6 md:h-7 md:w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.8 1.8 0 0 0 .35 1.98l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.8 1.8 0 0 0 15 19.4a1.8 1.8 0 0 0-1 .33 1.8 1.8 0 0 0-.8 1.52V22a2 2 0 0 1-4 0v-.75A1.8 1.8 0 0 0 8 19.4a1.8 1.8 0 0 0-1.92.35l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-.33-1 1.8 1.8 0 0 0-1.52-.8H2a2 2 0 0 1 0-4h.75A1.8 1.8 0 0 0 4.6 8a1.8 1.8 0 0 0-.35-1.98l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.8 1.8 0 0 0 9 4.6a1.8 1.8 0 0 0 1-.33 1.8 1.8 0 0 0 .8-1.52V2a2 2 0 1 1 4 0v.75A1.8 1.8 0 0 0 16 4.6a1.8 1.8 0 0 0 1.92-.35l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.8 1.8 0 0 0 19.4 9c.22.3.35.67.35 1.06V11a1.8 1.8 0 0 0 1.52.8H22a2 2 0 0 1 0 4h-.75a1.8 1.8 0 0 0-1.52.8 1.8 1.8 0 0 0-.33 1Z" />
    </svg>
  );
}

export function RocketIcon() {
  return (
    <svg
      className="h-6 w-6 md:h-7 md:w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15c2-1 4-1 6 1s2 4 1 6" />
      <path d="M9 9l6 6" />
      <path d="M15 3a8 8 0 0 1 6 6l-6 6-6-6a8 8 0 0 1 6-6Z" />
      <circle cx="15" cy="9" r="1.5" />
    </svg>
  );
}


