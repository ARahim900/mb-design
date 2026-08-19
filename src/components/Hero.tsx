import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { copy, localize } from '../data/content';
import type { Locale } from '../types';

interface HeroProps {
  readonly locale: Locale;
}

export function Hero({ locale }: HeroProps) {
  const DirectionArrow = locale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section id="top" className="relative min-h-svh overflow-hidden bg-date text-pearl sm:min-h-[820px] lg:h-svh lg:min-h-[720px]">
      <img
        src="/assets/collection-v2/hero-plum.webp"
        alt={localize(copy.hero.imageAlt, locale)}
        className="absolute inset-0 h-full w-full object-cover object-[35%_center] sm:object-[42%_center] lg:object-center"
        decoding="async"
      />
      <div className="hero-wash absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-svh max-w-[1600px] px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-28 sm:min-h-[820px] sm:px-8 sm:pb-16 sm:pt-36 lg:h-full lg:min-h-[720px] lg:grid-cols-2 lg:px-10 lg:pb-16 lg:pt-28 lg:[direction:ltr]">
        <div
          className="mt-auto w-full max-w-[350px] justify-self-end text-end sm:max-w-[430px] lg:col-start-2 lg:mb-10 lg:mt-0 lg:max-w-[560px] lg:self-center lg:justify-self-center"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          <h1 className="display-heading text-[clamp(3.8rem,17vw,8.5rem)] leading-[0.98] text-pearl [text-shadow:0_3px_24px_rgba(28,20,23,0.42)] sm:text-[clamp(4.2rem,8vw,8.5rem)]">
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
          className="absolute bottom-5 start-1/2 hidden h-11 w-11 -translate-x-1/2 items-center justify-center text-copper transition-colors hover:text-pearl focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper sm:flex"
          aria-label={localize(copy.hero.action, locale)}
        >
          <ArrowDown aria-hidden="true" size={22} strokeWidth={1.2} />
        </a>
      </div>
    </section>
  );
}
