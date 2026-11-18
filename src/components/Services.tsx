import { type LucideIcon, MessageCircle, Ruler, ShoppingBag, Truck } from 'lucide-react';
import { brand, hasWhatsApp } from '../data/brand';
import { copy, localize } from '../data/content';
import type { Locale, LocalizedText } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface ServicesProps {
  readonly locale: Locale;
}

interface ServiceCard {
  readonly id: string;
  readonly Icon: LucideIcon;
  readonly title: LocalizedText;
  readonly body: LocalizedText;
  readonly note?: LocalizedText;
  readonly link?: { readonly href: string; readonly label: LocalizedText };
}

// Each card states only what the storefront already does or what MB Design has confirmed in
// `brand`: the delivery window appears once it is set, and the WhatsApp card replaces the
// bag card only when there is a number to reach.
function buildCards(): readonly ServiceCard[] {
  const { delivery, alterations, whatsapp, pace } = copy.services;
  const personal: ServiceCard = hasWhatsApp
    ? {
        id: 'whatsapp',
        Icon: MessageCircle,
        title: whatsapp.title,
        body: whatsapp.body,
        link: { href: `https://wa.me/${brand.whatsappNumber}`, label: whatsapp.action },
      }
    : { id: 'pace', Icon: ShoppingBag, title: pace.title, body: pace.body };

  return [
    { id: 'delivery', Icon: Truck, title: delivery.title, body: delivery.body, ...(brand.deliveryTime ? { note: brand.deliveryTime } : {}) },
    { id: 'alterations', Icon: Ruler, title: alterations.title, body: alterations.body },
    personal,
  ];
}

export function Services({ locale }: ServicesProps) {
  const cards = buildCards();

  return (
    <section id="service" className="scroll-mt-8 border-y border-copper/55 bg-pearl px-safe py-12 [--gutter:1rem] sm:[--gutter:1.5rem] lg:py-16 lg:[--gutter:2.5rem]">
      <h2 className="sr-only">{localize(copy.nav.service, locale)}</h2>
      <div className="mx-auto grid max-w-[1320px] divide-y divide-copper/35 md:grid-cols-3 md:divide-x md:divide-y-0 rtl:md:divide-x-reverse">
        {cards.map(({ id, Icon, title, body, note, link }, index) => (
          <ScrollReveal key={id} delayMs={index * 70} className="flex items-center gap-5 px-2 py-6 md:px-7 md:py-4">
            <Icon aria-hidden="true" size={34} strokeWidth={1.1} className="shrink-0 text-copper" />
            <div>
              <h3 className="font-display text-2xl font-normal leading-tight text-date">{localize(title, locale)}</h3>
              <p className="mt-1.5 text-sm leading-6 text-ink/75">{localize(body, locale)}</p>
              {note && <p className="mt-1 text-sm leading-6 text-copper-deep">{localize(note, locale)}</p>}
              {link && (
                <a
                  className="mt-2 inline-flex min-h-11 items-center border-b border-copper text-sm text-date transition-colors hover:text-copper-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {localize(link.label, locale)}
                  <span className="sr-only"> {localize(copy.services.newTab, locale)}</span>
                </a>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
