import { type ReactNode, useState } from 'react';
import { brand, hasWhatsApp, type PolicyPage } from '../data/brand';
import { copy, localize } from '../data/content';
import type { Locale, LocalizedText } from '../types';
import { BrandWordmark } from './BrandWordmark';
import { PolicyDialog } from './PolicyDialog';

interface FooterProps {
  readonly locale: Locale;
}

interface ContactChannel {
  readonly id: string;
  readonly label: LocalizedText;
  readonly value: string;
  readonly href: string;
  readonly external: boolean;
  readonly icon: ReactNode;
}

const iconProps = {
  'aria-hidden': true,
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'shrink-0 text-copper',
} as const;

// Lucide outlines drawn inline: the brand marks for these services are no longer shipped in
// lucide-react, and the footer only needs three.
const icons = {
  whatsapp: (
    <svg {...iconProps}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  ),
  instagram: (
    <svg {...iconProps}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  ),
  email: (
    <svg {...iconProps}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
};

// Only channels MB Design has confirmed in `brand` appear; with none set, the column is omitted.
function buildChannels(): readonly ContactChannel[] {
  const channels: ContactChannel[] = [];
  const instagram = brand.instagramHandle.replace(/^@/, '');

  if (hasWhatsApp) {
    channels.push({ id: 'whatsapp', label: copy.footer.whatsapp, value: `+${brand.whatsappNumber}`, href: `https://wa.me/${brand.whatsappNumber}`, external: true, icon: icons.whatsapp });
  }
  if (instagram) {
    channels.push({ id: 'instagram', label: copy.footer.instagram, value: `@${instagram}`, href: `https://www.instagram.com/${instagram}/`, external: true, icon: icons.instagram });
  }
  if (brand.email) {
    channels.push({ id: 'email', label: copy.footer.email, value: brand.email, href: `mailto:${brand.email}`, external: false, icon: icons.email });
  }
  return channels;
}

export function Footer({ locale }: FooterProps) {
  const [openPolicy, setOpenPolicy] = useState<PolicyPage | null>(null);
  const channels = buildChannels();

  return (
    <footer className="bg-date px-safe py-14 text-pearl [--gutter:1rem] sm:[--gutter:1.5rem] lg:py-20 lg:[--gutter:2.5rem]">
      <div className="mx-auto grid max-w-[1320px] gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
        <div>
          <BrandWordmark tone="light" />
          <p className="mt-6 max-w-sm text-sm leading-7 text-pearl/75">{localize(copy.footer.statement, locale)}</p>
          {channels.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xs uppercase tracking-editorial text-copper">{localize(copy.footer.contactLabel, locale)}</h2>
              <ul className="mt-3 flex flex-col">
                {channels.map((channel) => (
                  <li key={channel.id}>
                    <a
                      className="footer-link inline-flex items-center gap-3 text-sm text-pearl/82 hover:text-copper"
                      href={channel.href}
                      {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {channel.icon}
                      <span className="sr-only">{localize(channel.label, locale)}: </span>
                      <span dir="ltr">{channel.value}</span>
                      {channel.external && <span className="sr-only"> {localize(copy.services.newTab, locale)}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <nav className="grid grid-cols-1 content-start gap-4 text-sm sm:grid-cols-2" aria-label={localize(copy.footer.navLabel, locale)}>
          <a className="footer-link text-pearl/82 hover:text-copper" href="#collection">{localize(copy.nav.collection, locale)}</a>
          <a className="footer-link text-pearl/82 hover:text-copper" href="#craft">{localize(copy.nav.craft, locale)}</a>
          <a className="footer-link text-pearl/82 hover:text-copper" href="#story">{localize(copy.nav.about, locale)}</a>
          <a className="footer-link text-pearl/82 hover:text-copper" href="#service">{localize(copy.nav.service, locale)}</a>
        </nav>
      </div>

      {brand.policies.length > 0 && (
        <nav className="mx-auto mt-12 flex max-w-[1320px] flex-wrap gap-x-8 gap-y-1 text-sm" aria-label={localize(copy.footer.policiesLabel, locale)}>
          {brand.policies.map((policy) => (
            <button
              key={policy.id}
              type="button"
              className="footer-link text-start text-pearl/82 hover:text-copper"
              onClick={() => setOpenPolicy(policy)}
            >
              {localize(policy.title, locale)}
            </button>
          ))}
        </nav>
      )}

      <div className="mx-auto mt-14 flex max-w-[1320px] flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-copper/35 pt-6 text-[12px] uppercase tracking-[0.08em] text-pearl/65 lg:text-[11px]">
        <span className="flex flex-wrap gap-x-6 gap-y-2">
          <span>© 2026 MB Design</span>
          {brand.crNumber && <span>{localize(copy.footer.cr, locale)} <span dir="ltr">{brand.crNumber}</span></span>}
        </span>
        <span>{localize(copy.footer.rights, locale)}</span>
      </div>

      <PolicyDialog locale={locale} policy={openPolicy} onClose={() => setOpenPolicy(null)} />
    </footer>
  );
}
