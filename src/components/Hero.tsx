import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { copy, localize } from '../data/content';
import type { Locale } from '../types';

interface HeroProps {
  readonly locale: Locale;
}

export function Hero({ locale }: HeroProps) {
  const DirectionArrow = locale === 'ar' ? ArrowLeft : ArrowRight;
  // English sets on three lines at the Arabic size and climbs over the embroidered sleeve, so
  // on phones it takes a smaller scale that keeps it to two lines under the hands.
  const titleSize = locale === 'ar' ? 'text-[clamp(3.8rem,17vw,8.5rem)]' : 'text-[clamp(3rem,12.5vw,8.5rem)]';
  // On a phone on its side the model stands on the left. English already sets on the right;
  // Arabic would land on her too, so it moves to its own start side, the open wall.
  const landscapeSide = locale === 'ar' ? 'short:justify-self-start short:text-start' : '';

  // The hero is the page's first section, so it owns the tab title for the active language.
  useEffect(() => {
    document.title = localize(copy.hero.documentTitle, locale);
  }, [locale]);

  return (
    <section id="top" className="relative min-h-svh overflow-hidden bg-date text-pearl sm:max-lg:[@media(min-height:700px)]:min-h-[820px] lg:h-svh lg:min-h-[720px]">
      <img
        src="/assets/collection-v2/hero-plum.webp"
        alt={localize(copy.hero.imageAlt, locale)}
        className="absolute inset-0 h-full w-full object-cover object-[35%_center] sm:object-[42%_center] short:top-[calc(82px+env(safe-area-inset-top))] short:h-[calc(100%-82px-env(safe-area-inset-top))] short:object-[40%_0%] lg:object-center"
        decoding="async"
      />
      <div className="hero-wash absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-svh max-w-[1600px] px-safe pb-[calc(2rem+env(safe-area-inset-bottom))] pt-28 [--gutter:1.25rem] sm:pb-[calc(4rem+env(safe-area-inset-bottom))] sm:[--gutter:2rem] sm:max-lg:[@media(min-height:700px)]:min-h-[820px] sm:max-lg:[@media(min-height:700px)]:pt-36 short:pb-[calc(2rem+env(safe-area-inset-bottom))] short:pt-20 lg:h-full lg:min-h-[720px] lg:grid-cols-2 lg:pb-16 lg:pt-28 lg:[--gutter:2.5rem] lg:[direction:ltr]">
        <div
          className={`mt-auto w-full max-w-[350px] justify-self-end text-end sm:max-w-[430px] ${landscapeSide} lg:col-start-2 lg:mb-10 lg:mt-0 lg:max-w-[560px] lg:self-center lg:justify-self-center`}
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          <h1 className={`display-heading ${titleSize} leading-[0.98] text-pearl [text-shadow:0_3px_24px_rgba(28,20,23,0.42)] sm:text-[clamp(4.2rem,8vw,8.5rem)]`}>
            {localize(copy.hero.title, locale)}
          </h1>
          <span className="my-5 block h-px w-16 bg-copper lg:my-8" aria-hidden="true" />
          <a className="hero-cta group min-h-14 w-full max-w-[320px] px-6 py-3.5 sm:w-auto sm:min-w-[240px]" href="#collection">
            <span>{localize(copy.hero.action, locale)}</span>
            <DirectionArrow aria-hidden="true" size={18} strokeWidth={1.35} className="transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 motion-reduce:transition-none" />
          </a>
        </div>

        <a
          href="#collection"
          className="absolute bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 hidden h-11 w-11 -translate-x-1/2 items-center justify-center text-copper transition-colors hover:text-pearl focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper sm:flex short:hidden"
          aria-label={localize(copy.hero.action, locale)}
        >
          <ArrowDown aria-hidden="true" size={22} strokeWidth={1.2} />
        </a>
      </div>
    </section>
  );
}
