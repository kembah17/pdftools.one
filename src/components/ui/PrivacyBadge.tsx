interface PrivacyBadgeProps {
  className?: string;
}

export function PrivacyBadge({ className = '' }: PrivacyBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full shadow-sm text-sm text-text-light ${className}`}>
      <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <span>Files never leave your browser</span>
    </div>
  );
}
