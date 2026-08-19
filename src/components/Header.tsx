import { Menu, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { copy, localize } from '../data/content';
import type { Locale } from '../types';
import { BrandWordmark } from './BrandWordmark';

interface HeaderProps {
  readonly locale: Locale;
  readonly cartCount: number;
  readonly onLocaleChange: (locale: Locale) => void;
  readonly onCartOpen: () => void;
}

export function Header({ locale, cartCount, onLocaleChange, onCartOpen }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const alternateLocale: Locale = locale === 'ar' ? 'en' : 'ar';
  const navLabel = localize(copy.nav.label, locale);
  const bagLabel = localize(copy.header.bag, locale);
  const solid = scrolled || menuOpen;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b pt-[env(safe-area-inset-top)] text-pearl transition-colors duration-300 motion-reduce:transition-none ${solid ? 'border-copper/50 bg-date/95 backdrop-blur-md' : 'border-copper/40 bg-date/5 backdrop-blur-[2px]'}`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:border focus:border-copper focus:bg-date focus:px-4 focus:py-3 focus:text-sm focus:text-pearl"
      >
        {localize(copy.header.skip, locale)}
      </a>

      <div className="mx-auto grid h-[76px] max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-3 sm:h-[82px] sm:px-6 lg:h-[98px] lg:px-10">
        <div className="flex items-center justify-self-start">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center text-pearl transition-colors hover:text-copper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={localize(menuOpen ? copy.header.menuClose : copy.header.menuOpen, locale)}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            {menuOpen ? <X aria-hidden="true" size={25} strokeWidth={1.3} /> : <Menu aria-hidden="true" size={26} strokeWidth={1.3} />}
          </button>

          <nav className="hidden items-center gap-8 text-[13px] md:flex lg:gap-11" aria-label={navLabel}>
            <a className="nav-link hover:text-copper" href="#collection">{localize(copy.nav.collection, locale)}</a>
            <a className="nav-link hover:text-copper" href="#craft">{localize(copy.nav.craft, locale)}</a>
            <a className="nav-link hover:text-copper" href="#story">{localize(copy.nav.about, locale)}</a>
          </nav>
        </div>

        <a
          href="#top"
          className="justify-self-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper"
          aria-label="RIZZA"
        >
          <BrandWordmark tone="light" />
        </a>

        <div className="flex items-center justify-self-end gap-1 sm:gap-3">
          <button
            type="button"
            className="h-11 min-w-11 px-2 text-[13px] tracking-[0.06em] text-pearl transition-colors hover:text-copper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper"
            onClick={() => onLocaleChange(alternateLocale)}
            aria-label={localize(copy.header.language, locale)}
            lang={alternateLocale}
          >
            {alternateLocale === 'ar' ? 'عربي' : 'EN'}
          </button>
          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center text-pearl transition-colors hover:text-copper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper"
            onClick={onCartOpen}
            aria-label={cartCount > 0 ? `${bagLabel} (${cartCount})` : bagLabel}
          >
            <ShoppingBag aria-hidden="true" size={23} strokeWidth={1.3} />
            {cartCount > 0 && (
              <span aria-hidden="true" className="absolute end-0 top-0 flex h-5 min-w-5 items-center justify-center bg-copper px-1 text-[10px] leading-none text-date">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="absolute inset-x-0 top-full border-b border-copper/50 bg-date/98 px-6 py-8 shadow-[0_22px_50px_rgba(28,20,23,0.35)] backdrop-blur-md md:hidden"
          aria-label={navLabel}
        >
          <div className="flex flex-col divide-y divide-copper/25 font-display text-3xl">
            <a className="py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper" href="#collection" onClick={closeMenu}>
              {localize(copy.nav.collection, locale)}
            </a>
            <a className="py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper" href="#craft" onClick={closeMenu}>
              {localize(copy.nav.craft, locale)}
            </a>
            <a className="py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper" href="#story" onClick={closeMenu}>
              {localize(copy.nav.about, locale)}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
