export function ForkBranch({ className = "fork-branch" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 88" fill="none" aria-hidden="true">
      <path d="M2 0 V14 C2 50 20 70 56 76" pathLength={100} />
      <circle cx="59" cy="76.5" r="4" />
    </svg>
  );
}
