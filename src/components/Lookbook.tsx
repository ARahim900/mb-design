import { ArrowUpRight, Play } from 'lucide-react';
import { brand } from '../data/brand';
import { copy, localize, lookbook } from '../data/content';
import type { Locale } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface LookbookProps {
  readonly locale: Locale;
}

export function Lookbook({ locale }: LookbookProps) {
  const handle = brand.instagramHandle.replace(/^@/, '');
  const opensInstagram = localize(copy.lookbook.opensInstagram, locale);

  return (
    <section
      id="lookbook"
      aria-labelledby="lookbook-title"
      className="scroll-mt-8 bg-date px-safe py-20 text-pearl [--gutter:1rem] sm:py-28 sm:[--gutter:1.5rem] lg:py-32 lg:[--gutter:2.5rem]"
    >
      <div className="mx-auto max-w-[1500px]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <ScrollReveal className="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-14">
          <div className="max-w-xl">
            <h2 id="lookbook-title" className="display-heading text-[clamp(3.4rem,5vw,5.4rem)] leading-[1.05]">
              {localize(copy.lookbook.title, locale)}
            </h2>
            <span className="my-6 block h-px w-14 bg-copper" aria-hidden="true" />
            <p className="text-base leading-8 text-pearl/80">{localize(copy.lookbook.body, locale)}</p>
          </div>
          {handle && (
            <a
              className="inline-flex min-h-11 items-center gap-2 border-b border-copper pb-2 text-sm transition-colors hover:text-copper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper"
              href={`https://www.instagram.com/${handle}/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{localize(copy.lookbook.follow, locale)}</span>
              <span className="font-latin" dir="ltr">@{handle}</span>
              <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.4} className="rtl:-scale-x-100" />
              <span className="sr-only">{opensInstagram}</span>
            </a>
          )}
        </ScrollReveal>

        {/* Reel covers keep their native 9:16 frame so every look shows head to hem. A swipe
            rail on phones and tablets; one six-across row from desktop up. */}
        <ul className="collection-rail rail-bleed flex snap-x snap-mandatory gap-3 overflow-x-auto pb-6 sm:gap-4 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0">
          {lookbook.map((look, index) => (
            <li key={look.id} className="w-[62vw] max-w-[300px] shrink-0 snap-start sm:w-[38vw] lg:w-auto lg:max-w-none">
              <ScrollReveal delayMs={index * 60} className="h-full">
                <a
                  className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper"
                  href={`https://www.instagram.com/reel/${look.reel}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="relative block aspect-[9/16] overflow-hidden bg-ink">
                    <img
                      src={look.src}
                      srcSet={`${look.srcSmall} 360w, ${look.src} ${look.width}w`}
                      sizes="(min-width: 1024px) 16vw, (min-width: 640px) 38vw, 62vw"
                      width={look.width}
                      height={look.height}
                      alt={localize(look.alt, locale)}
                      className="h-full w-full object-cover transition-transform duration-700 ease-quiet group-hover:scale-[1.03] motion-reduce:transition-none"
                      loading="lazy"
                      decoding="async"
                    />
                    <span
                      className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/45 text-pearl backdrop-blur-sm"
                      aria-hidden="true"
                    >
                      <Play size={14} strokeWidth={1.6} className="translate-x-px fill-current" />
                    </span>
                  </span>
                  <span className="flex min-h-11 items-center justify-between gap-3 border-b border-pearl/20 py-3 text-sm text-pearl/85 transition-colors group-hover:text-copper">
                    <span>{localize(copy.lookbook.watch, locale)}</span>
                    <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.4} className="rtl:-scale-x-100" />
                    <span className="sr-only">{opensInstagram}</span>
                  </span>
                </a>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
