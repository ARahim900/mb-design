import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { copy, formatOmr, localize, products } from '../data/content';
import type { Locale, Product } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface CollectionProps {
  readonly locale: Locale;
  readonly onProductOpen: (product: Product) => void;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function Collection({ locale, onProductOpen }: CollectionProps) {
  const DirectionArrow = locale === 'ar' ? ArrowLeft : ArrowRight;
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const handleScroll = () => {
      // Measured as a fraction of the total travel rather than by card width, so it stays
      // correct at every breakpoint. `scrollLeft` is a negative offset from the right edge
      // under RTL, which the absolute value folds back into the same 0..1 progress.
      const travel = rail.scrollWidth - rail.clientWidth;
      if (travel <= 0) {
        setActiveIndex(0);
        return;
      }

      const progress = Math.abs(rail.scrollLeft) / travel;
      setActiveIndex(Math.round(progress * (products.length - 1)));
    };

    handleScroll();
    rail.addEventListener('scroll', handleScroll, { passive: true });
    return () => rail.removeEventListener('scroll', handleScroll);
  }, []);

  // `scrollIntoView` on the card rather than a computed `scrollTo`: the browser works out the
  // offset itself, which is the only way this stays right in both reading directions.
  const scrollToProduct = (index: number) => {
    railRef.current?.children[index]?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  return (
    <section id="collection" className="content-auto scroll-mt-8 bg-pearl px-4 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1500px] lg:grid lg:grid-cols-[270px_1fr] lg:gap-14 lg:[direction:ltr] xl:grid-cols-[330px_1fr] xl:gap-20">
        <ScrollReveal className="mb-12 self-center lg:mb-0 lg:pb-16">
          <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <h2 className="display-heading text-[clamp(3.6rem,5vw,5.8rem)] leading-[1.05] text-date">
              {localize(copy.collection.title, locale)}
            </h2>
            <span className="my-6 block h-px w-14 bg-copper" aria-hidden="true" />
            <p className="text-base leading-8 text-copper-deep">{localize(copy.collection.secondary, locale)}</p>
            <p className="mt-5 text-sm leading-7 text-shade">{localize(copy.collection.body, locale)}</p>
            <a className="mt-8 inline-flex min-h-11 items-center gap-3 border-b border-copper pb-2 text-sm transition-colors hover:text-pomegranate focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper" href="#collection-grid">
              {localize(copy.collection.all, locale)}
              <DirectionArrow aria-hidden="true" size={17} strokeWidth={1.25} />
            </a>
          </div>
        </ScrollReveal>

        <div ref={railRef} id="collection-grid" className="collection-rail -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-8 sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0 lg:[direction:ltr]">
          {products.map((product, index) => (
            <ScrollReveal key={product.id} delayMs={index * 80} className="w-[84vw] max-w-[390px] shrink-0 snap-start lg:w-auto lg:max-w-none">
            <article className="h-full">
              <button
                type="button"
                className="shadow-card group block h-full w-full bg-pearl text-start transition duration-500 ease-quiet hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper motion-reduce:transition-none"
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
                onClick={() => onProductOpen(product)}
                aria-labelledby={`${product.id}-name ${product.id}-price`}
                aria-describedby={`${product.id}-description`}
              >
                <span className="relative block aspect-[4/5] overflow-hidden bg-sand">
                  <img
                    src={product.image}
                    alt={localize(product.imageAlt, locale)}
                    className="h-full w-full object-cover transition-transform duration-700 ease-quiet motion-reduce:transition-none group-hover:scale-[1.025]"
                    style={{ objectPosition: product.imagePosition }}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute bottom-0 start-0 h-1 w-20 transition-all duration-500 group-hover:w-full" style={{ backgroundColor: product.colorHex }} aria-hidden="true" />
                </span>
                <span className="block border-b border-hair py-5">
                  <span className="flex items-start justify-between gap-5">
                    <span>
                      <span id={`${product.id}-name`} className="block font-display text-3xl leading-tight text-date">{localize(product.name, locale)}</span>
                      <span aria-hidden="true" className="mt-1 block font-latin text-xs uppercase tracking-[0.12em] text-shade" lang={locale === 'ar' ? 'en' : 'ar'}>
                        {localize(product.name, locale === 'ar' ? 'en' : 'ar')}
                      </span>
                    </span>
                    <span id={`${product.id}-price`} className="pt-2 text-sm tabular-nums text-date">{formatOmr(product.priceOmr, locale)}</span>
                  </span>
                  <span id={`${product.id}-description`} className="mt-4 block text-sm leading-7 text-shade">{localize(product.description, locale)}</span>
                  <span className="mt-5 flex min-h-11 items-center justify-between gap-4 border-t border-copper/35 pt-4 text-sm font-medium text-date transition-colors group-hover:text-pomegranate">
                    <span>{localize(copy.collection.productAction, locale)}</span>
                    <DirectionArrow aria-hidden="true" size={17} strokeWidth={1.25} className="transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 motion-reduce:transition-none" />
                  </span>
                </span>
              </button>
            </article>
            </ScrollReveal>
          ))}
        </div>

        {/* The rail shows one card at a time on a phone with no sign of how many follow.
            These mark the position and jump between pieces; `lg:hidden` keeps them out of the
            desktop grid entirely, so they never take a cell. */}
        <div
          className="-mt-2 flex items-center justify-center gap-1 lg:hidden"
          role="group"
          aria-label={localize(copy.collection.title, locale)}
        >
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              className="flex h-11 w-8 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
              aria-label={`${localize(copy.collection.goTo, locale)} ${localize(product.name, locale)}`}
              aria-current={index === activeIndex || undefined}
              onClick={() => scrollToProduct(index)}
            >
              <span
                aria-hidden="true"
                className={`h-[3px] transition-all duration-300 ease-quiet motion-reduce:transition-none ${index === activeIndex ? 'w-7 bg-copper-deep' : 'w-3 bg-hair'}`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
