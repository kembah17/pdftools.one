interface AdSlotProps {
  slot: "leaderboard" | "below-results" | "in-content" | "footer";
  className?: string;
}

const slotSizes: Record<string, string> = {
  leaderboard: "max-w-[728px] h-[90px]",
  "below-results": "max-w-[728px] h-[90px]",
  "in-content": "max-w-[336px] h-[280px] mx-auto",
  footer: "max-w-[728px] h-[90px]",
};

export function AdSlot({ slot, className = "" }: AdSlotProps) {
  return (
    <div
      className={`ad-slot w-full mx-auto my-6 ${slotSizes[slot]} ${className}`}
      data-ad-slot={slot}
      aria-hidden="true"
    >
      {/* Ad placeholder - replace with actual ad code */}
      <span className="text-xs opacity-50">Advertisement</span>
    </div>
  );
}
