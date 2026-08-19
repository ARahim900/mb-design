interface BrandWordmarkProps {
  readonly tone?: 'light' | 'dark';
  readonly compact?: boolean;
}

export function BrandWordmark({ tone = 'dark', compact = false }: BrandWordmarkProps) {
  const source = tone === 'light' ? '/brand/rizza-primary-light.svg' : '/brand/rizza-primary-dark.svg';
  const sizeClass = compact ? 'w-12' : 'w-[3.7rem]';

  return (
    <img src={source} alt="رزّة — RIZZA" className={`block h-auto ${sizeClass}`} />
  );
}
