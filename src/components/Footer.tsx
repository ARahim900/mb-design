import { copy, localize } from '../data/content';
import type { Locale } from '../types';
import { BrandWordmark } from './BrandWordmark';

interface FooterProps {
  readonly locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  return (
    <footer className="bg-date px-4 py-14 text-pearl sm:px-6 lg:px-10 lg:py-20">
      <div className="mx-auto grid max-w-[1320px] gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
        <div>
          <BrandWordmark tone="light" />
          <p className="mt-6 max-w-sm text-sm leading-7 text-pearl/68">{localize(copy.footer.statement, locale)}</p>
        </div>
        <nav className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2" aria-label={localize(copy.footer.navLabel, locale)}>
          <a className="footer-link text-pearl/82 hover:text-copper" href="#collection">{localize(copy.nav.collection, locale)}</a>
          <a className="footer-link text-pearl/82 hover:text-copper" href="#craft">{localize(copy.nav.craft, locale)}</a>
          <a className="footer-link text-pearl/82 hover:text-copper" href="#story">{localize(copy.nav.about, locale)}</a>
          <a className="footer-link text-pearl/82 hover:text-copper" href="#service">{localize(copy.nav.service, locale)}</a>
        </nav>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1320px] items-center justify-between border-t border-copper/35 pt-6 text-[11px] uppercase tracking-[0.08em] text-pearl/50">
        <span>© 2026 RIZZA</span>
        <span>{localize(copy.footer.rights, locale)}</span>
      </div>
    </footer>
  );
}
