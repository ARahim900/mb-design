import { ArrowLeft, ArrowRight } from 'lucide-react';
import { copy, localize } from '../data/content';
import type { Locale } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface CraftsmanshipProps {
  readonly locale: Locale;
}

export function Craftsmanship({ locale }: CraftsmanshipProps) {
  const DirectionArrow = locale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section id="craft" className="scroll-mt-8 bg-jade text-pearl lg:grid lg:grid-cols-[0.75fr_1.25fr] lg:[direction:ltr]">
      <div className="flex items-center px-safe py-16 [--gutter:1.5rem] sm:py-20 sm:[--gutter:2.5rem] lg:py-24 lg:[--gutter:3.5rem] xl:[--gutter:5rem]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <ScrollReveal className="mx-auto max-w-lg lg:mx-0">
          <h2 className="display-heading max-w-md text-[clamp(3.5rem,5vw,5.5rem)] leading-[1.2]">
            {localize(copy.craft.title, locale)}
          </h2>
          <span className="my-7 block h-px w-16 bg-copper" aria-hidden="true" />
          <p className="max-w-md text-base leading-8 text-pearl/80 sm:text-lg sm:leading-9">
            {localize(copy.craft.body, locale)}
          </p>
          <a className="mt-8 inline-flex min-h-11 items-center gap-3 border-b border-copper pb-2 text-sm transition-colors hover:text-copper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper" href="#story">
            {localize(copy.story.action, locale)}
            <DirectionArrow aria-hidden="true" size={17} strokeWidth={1.25} />
          </a>
        </ScrollReveal>
      </div>
      <ScrollReveal className="aspect-[4/3] overflow-hidden bg-date lg:aspect-auto lg:min-h-[650px]" delayMs={80}>
        <img
          src="/assets/collection-v2/craft-embroidery.webp"
          alt={localize(copy.craft.imageAlt, locale)}
          className="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
      </ScrollReveal>
    </section>
  );
}
