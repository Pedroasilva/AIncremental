import type { ReactNode } from 'react';

interface Props {
  onClick: () => void;
  disabled?: boolean;
  accent?: string;
  icon?: ReactNode;
  title: string;
  subtitle?: ReactNode;
  className?: string;
}

export function ActionButton({ onClick, disabled, accent, icon, title, subtitle, className }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group flex w-full items-center gap-3 rounded-lg border border-border bg-surface-2 px-3 py-2 text-left transition
        enabled:hover:border-accent enabled:hover:bg-surface enabled:active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-40 ${className ?? ''}`}
      style={accent ? { boxShadow: disabled ? undefined : `inset 3px 0 0 ${accent}` } : undefined}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{title}</span>
        {subtitle && <span className="block truncate text-xs text-muted">{subtitle}</span>}
      </span>
    </button>
  );
}
