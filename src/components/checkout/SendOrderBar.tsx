import { copy, formatOmr, localize } from '../../data/content';
import type { Locale } from '../../types';
import { getTotalLabel } from './order';

interface SendOrderBarProps {
  readonly locale: Locale;
  readonly total: number;
  readonly deliveryFee: number | null;
  /** null while WhatsApp ordering is not available. */
  readonly whatsAppUrl: string | null;
  readonly onSent: () => void;
}

export function SendOrderBar({ locale, total, deliveryFee, whatsAppUrl, onSent }: SendOrderBarProps) {
  return (
    <>
      <div className="flex items-baseline justify-between gap-4 text-sm font-medium text-date">
        <span>{getTotalLabel(deliveryFee, locale)}</span>
        <span className="tabular-nums">{formatOmr(total, locale)}</span>
      </div>
      {whatsAppUrl ? (
        <>
          {/* A real link rather than window.open: browsers never block a new tab the reader
              opened themselves. */}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="button-primary mt-4 min-h-14 w-full px-6 py-3 shadow-button short:mt-3 short:min-h-12"
            aria-describedby="send-order-hint"
            onClick={onSent}
          >
            {localize(copy.checkout.send, locale)}
            <span className="sr-only"> {localize(copy.checkout.newTab, locale)}</span>
          </a>
          <p id="send-order-hint" className="mt-3 text-xs leading-relaxed text-shade short:mt-2">
            {localize(copy.checkout.sendHint, locale)}
          </p>
        </>
      ) : (
        <>
          <button
            type="button"
            disabled
            aria-describedby="send-order-hint"
            className="button-primary mt-4 min-h-14 w-full cursor-not-allowed px-6 py-3 opacity-60 hover:translate-y-0 hover:bg-date short:mt-3 short:min-h-12"
          >
            {localize(copy.checkout.send, locale)}
          </button>
          <p id="send-order-hint" className="mt-3 text-xs leading-relaxed text-shade short:mt-2">
            {localize(copy.checkout.unavailable, locale)}
          </p>
        </>
      )}
    </>
  );
}
