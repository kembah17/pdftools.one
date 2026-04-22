interface AdSlotProps {
  slot: string;
  className?: string;
}

export function AdSlot({ slot, className = '' }: AdSlotProps) {
  return (
    <div className={`ad-slot my-6 ${className}`} data-ad-slot={slot}>
      <div className="bg-[var(--ad-bg)] border border-dashed border-[var(--ad-border)] rounded-lg p-4 text-center text-sm text-text-light">
        Advertisement
      </div>
    </div>
  );
}
