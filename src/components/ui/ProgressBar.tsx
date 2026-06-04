'use client';

interface ProgressBarProps {
  progress: number;
  label?: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
          <span className="text-sm font-medium" style={{ color: 'var(--color-brand)' }}>{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border-light)' }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: 'var(--color-brand)', color: '#FFFFFF' }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
