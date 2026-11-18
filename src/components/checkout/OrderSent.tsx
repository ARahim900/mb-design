import { copy, localize } from '../../data/content';
import type { Locale } from '../../types';
import { BrandWordmark } from '../BrandWordmark';

interface OrderSentProps {
  readonly locale: Locale;
  readonly whatsAppUrl: string | null;
  readonly canClearBag: boolean;
  readonly onClearBag: () => void;
  readonly onClose: () => void;
}

export function OrderSent({ locale, whatsAppUrl, canClearBag, onClearBag, onClose }: OrderSentProps) {
  const checkoutCopy = copy.checkout;

  return (
    <div className="flex min-h-0 flex-1 overflow-y-auto overscroll-contain px-safe pb-[calc(2rem+env(safe-area-inset-bottom))] pt-10 text-center [--gutter:2rem] short:pt-6">
      {/* Auto margins rather than `items-center`: they centre the block when it fits and let it
          scroll from the top when it does not (landscape). */}
      <div className="m-auto w-full max-w-sm">
        <div className="flex justify-center">
          <BrandWordmark />
        </div>
        <h3 className="mt-9 font-display text-4xl leading-tight short:mt-5 short:text-3xl" role="status">
          {localize(checkoutCopy.sentTitle, locale)}
        </h3>
        <span className="mx-auto my-6 block h-px w-14 bg-copper short:my-4" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-shade">{localize(checkoutCopy.sentBody, locale)}</p>
        {whatsAppUrl && (
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 items-center px-2 text-sm text-date underline decoration-copper underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper"
          >
            {localize(checkoutCopy.reopen, locale)}
            <span className="sr-only"> {localize(checkoutCopy.newTab, locale)}</span>
          </a>
        )}
        <div className="mt-8 flex flex-col gap-3 short:mt-5">
          <button type="button" className="button-primary min-h-12 w-full px-6 py-3 shadow-button" onClick={onClose}>
            {localize(checkoutCopy.continueShopping, locale)}
          </button>
          {canClearBag && (
            <button
              type="button"
              className="min-h-12 w-full border border-hair px-6 py-3 text-sm text-date transition-colors hover:border-copper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper"
              onClick={onClearBag}
            >
              {localize(checkoutCopy.clearBag, locale)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
