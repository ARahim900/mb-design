interface BrandWordmarkProps {
  readonly tone?: 'light' | 'dark';
  readonly compact?: boolean;
}

export function BrandWordmark({ tone = 'dark', compact = false }: BrandWordmarkProps) {
  const source = tone === 'light' ? '/brand/mb-design-logo-light.svg' : '/brand/mb-design-logo-dark.svg';
  // The lockup is about 4:3, so width also sets height; these keep it inside the 76/82/98px header rows.
  const sizeClass = compact ? 'w-[4.5rem]' : 'w-[5.25rem] sm:w-[5.75rem] lg:w-[7rem]';

  return (
    <img src={source} alt="MB Design" width={597} height={445} className={`block h-auto ${sizeClass}`} />
  );
}
