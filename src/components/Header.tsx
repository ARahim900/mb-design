import { Menu, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { copy, formatNumber, localize } from '../data/content';
import { useModalScrollLock } from '../hooks/useModalScrollLock';
import { useScrollDirection } from '../hooks/usePremiumMotion';
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
  // Never retract while the mobile menu is open — it hangs off the header.
  const hidden = useScrollDirection(menuOpen);

  // The panel covers the page, so the page behind it must not scroll — otherwise a swipe
  // aimed at the menu drags the storefront underneath and the reader loses their place.
  useModalScrollLock(menuOpen);

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

  // Rotating to a tablet width hides the panel through `md:hidden` but would leave its scroll
  // lock applied, freezing the page. Close it with the breakpoint instead.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    desktop.addEventListener('change', handleChange);
    return () => desktop.removeEventListener('change', handleChange);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b pt-[env(safe-area-inset-top)] text-pearl transition-[background-color,border-color,transform] duration-300 ease-quiet motion-reduce:transition-none ${solid ? 'border-copper/50 bg-date/95 backdrop-blur-md' : 'border-copper/40 bg-date/5 backdrop-blur-[2px]'} ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:border focus:border-copper focus:bg-date focus:px-4 focus:py-3 focus:text-sm focus:text-pearl"
      >
        {localize(copy.header.skip, locale)}
      </a>

      <div className="mx-auto grid h-[76px] max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-safe [--gutter:0.75rem] sm:h-[82px] sm:[--gutter:1.5rem] lg:h-[98px] lg:[--gutter:2.5rem]">
        <div className="flex items-center justify-self-start">
          <button
            type="button"
            className={`flex h-12 w-12 items-center justify-center border shadow-[0_8px_24px_rgba(28,20,23,0.2)] backdrop-blur-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper md:hidden ${menuOpen ? 'border-copper bg-date text-copper' : 'border-pearl/45 bg-date/55 text-pearl hover:border-copper hover:text-copper'}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={localize(menuOpen ? copy.header.menuClose : copy.header.menuOpen, locale)}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            {menuOpen ? <X aria-hidden="true" size={24} strokeWidth={1.7} /> : <Menu aria-hidden="true" size={25} strokeWidth={1.7} />}
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
          aria-label="MB Design"
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
              <span aria-hidden="true" className="absolute end-0 top-0 flex h-5 min-w-5 items-center justify-center bg-copper px-1 text-xs leading-none text-date lg:text-[10px]">
                {formatNumber(cartCount, locale)}
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <>
          {/* Absolute, not fixed: the header is already the fixed element, so `top-full` anchors
              the scrim to the bottom of the bar. A fixed child would resolve `top-full` against
              the viewport and land off-screen. Painted before the nav, so the nav sits above it. */}
          <div
            className="absolute inset-x-0 top-full h-[100dvh] touch-none bg-date/55 backdrop-blur-[2px] md:hidden"
            aria-hidden="true"
            onClick={closeMenu}
          />
          <nav
            id="mobile-navigation"
            className="absolute inset-x-0 top-full max-h-[calc(100svh-76px-env(safe-area-inset-top))] overflow-y-auto overscroll-contain border-y border-copper/60 bg-date px-safe py-3 shadow-[0_22px_50px_rgba(28,20,23,0.45)] [--gutter:1.25rem] md:hidden"
            aria-label={navLabel}
          >
            <div className="flex flex-col divide-y divide-copper/30 text-xl font-medium">
              <a className="flex min-h-16 items-center justify-between gap-5 py-4 text-pearl transition-colors hover:text-copper focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper" href="#collection" onClick={closeMenu}>
                <span>{localize(copy.nav.collection, locale)}</span>
                <span aria-hidden="true" className="text-[10px] tracking-editorial text-copper">01</span>
              </a>
              <a className="flex min-h-16 items-center justify-between gap-5 py-4 text-pearl transition-colors hover:text-copper focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper" href="#craft" onClick={closeMenu}>
                <span>{localize(copy.nav.craft, locale)}</span>
                <span aria-hidden="true" className="text-[10px] tracking-editorial text-copper">02</span>
              </a>
              <a className="flex min-h-16 items-center justify-between gap-5 py-4 text-pearl transition-colors hover:text-copper focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper" href="#story" onClick={closeMenu}>
                <span>{localize(copy.nav.about, locale)}</span>
                <span aria-hidden="true" className="text-[10px] tracking-editorial text-copper">03</span>
              </a>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
