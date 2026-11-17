import { ArrowLeft, ArrowRight } from 'lucide-react';
import { copy, localize } from '../data/content';
import type { Locale } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface StoryProps {
  readonly locale: Locale;
}

export function Story({ locale }: StoryProps) {
  const DirectionArrow = locale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section id="story" className="scroll-mt-8 bg-sand lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:[direction:ltr]">
      <ScrollReveal className="aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[650px]">
        <img
          src="/assets/collection-v2/story-cinnamon.webp"
          alt={localize(copy.story.imageAlt, locale)}
          className="h-full w-full object-cover object-[36%_center] lg:object-center"
          loading="lazy"
          decoding="async"
        />
      </ScrollReveal>
      <div className="flex items-center px-safe py-16 [--gutter:1.5rem] sm:py-20 sm:[--gutter:2.5rem] lg:py-24 lg:[--gutter:3.5rem] xl:[--gutter:5rem]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <ScrollReveal className="mx-auto max-w-lg" delayMs={80}>
          <h2 className="display-heading text-[clamp(3.5rem,5vw,5.5rem)] leading-[1.2] text-date">
            {localize(copy.story.title, locale)}
          </h2>
          <p className="mt-3 font-latin text-xl text-copper-deep" lang={locale === 'ar' ? 'en' : 'ar'}>
            {localize(copy.story.title, locale === 'ar' ? 'en' : 'ar')}
          </p>
          <span className="my-7 block h-px w-16 bg-copper" aria-hidden="true" />
          <p className="max-w-md text-base leading-8 text-shade sm:text-lg sm:leading-9">
            {localize(copy.story.body, locale)}
          </p>
          <a className="mt-8 inline-flex min-h-11 items-center gap-3 border-b border-copper pb-2 text-sm text-date transition-colors hover:text-pomegranate focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper" href="#collection">
            {localize(copy.collection.all, locale)}
            <DirectionArrow aria-hidden="true" size={17} strokeWidth={1.25} />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
