import { MessageCircle, Ruler, Truck } from 'lucide-react';
import { copy, localize } from '../data/content';
import type { Locale } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface ServicesProps {
  readonly locale: Locale;
}

const icons = {
  delivery: Truck,
  alterations: Ruler,
  whatsapp: MessageCircle,
} as const;

export function Services({ locale }: ServicesProps) {
  return (
    <section id="service" className="scroll-mt-8 border-y border-copper/55 bg-pearl px-safe py-12 [--gutter:1rem] sm:[--gutter:1.5rem] lg:py-16 lg:[--gutter:2.5rem]">
      <h2 className="sr-only">{localize(copy.nav.service, locale)}</h2>
      <div className="mx-auto grid max-w-[1320px] divide-y divide-copper/35 md:grid-cols-3 md:divide-x md:divide-y-0 rtl:md:divide-x-reverse">
        {copy.services.map((service, index) => {
          const Icon = icons[service.id];
          return (
            <ScrollReveal key={service.id} delayMs={index * 70} className="flex items-center gap-5 px-2 py-6 md:px-7 md:py-4">
              <Icon aria-hidden="true" size={34} strokeWidth={1.1} className="shrink-0 text-copper" />
              <div>
                <h3 className="font-display text-2xl font-normal leading-tight text-date">{localize(service.title, locale)}</h3>
                <p className="mt-1.5 text-xs leading-6 text-shade">{localize(service.body, locale)}</p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
