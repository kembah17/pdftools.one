export function AdSlot({ slot }: { slot: string }) {
  return (
    <div
      className="my-6 rounded-lg flex items-center justify-center text-sm ad-slot-container"
      style={{
        backgroundColor: 'var(--color-ad-bg)',
        border: '1px dashed var(--color-ad-border)',
        color: 'var(--color-ad-text)',
        minHeight: '90px',
        padding: '1rem',
      }}
    >
      <span>Ad Space — {slot}</span>
    </div>
  );
}

export default AdSlot;
