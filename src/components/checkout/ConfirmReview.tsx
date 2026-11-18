import { copy, localize } from '../../data/content';
import type { CartLine, Locale } from '../../types';
import { OrderSummary } from './OrderSummary';
import { type CheckoutDetails, formatMobile, getAddressLines } from './order';

interface ConfirmReviewProps {
  readonly locale: Locale;
  readonly cart: readonly CartLine[];
  readonly details: CheckoutDetails;
  readonly onEditDetails: () => void;
}

export function ConfirmReview({ locale, cart, details, onEditDetails }: ConfirmReviewProps) {
  return (
    <div className="space-y-6">
      <OrderSummary locale={locale} cart={cart} />
      <section aria-labelledby="deliver-to-title" className="border border-hair p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 id="deliver-to-title" className="text-xs font-medium uppercase tracking-editorial text-copper-deep">
            {localize(copy.checkout.deliverTo, locale)}
          </h3>
          <button
            type="button"
            className="-me-2 min-h-11 px-2 text-sm text-date underline decoration-copper underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper"
            onClick={onEditDetails}
          >
            {localize(copy.checkout.editDetails, locale)}
          </button>
        </div>
        <div className="mt-2 space-y-1 text-sm leading-6">
          <p className="font-medium text-ink">{details.name.trim()}</p>
          <p className="tabular-nums text-shade">
            <span dir="ltr">{formatMobile(details.mobile)}</span>
          </p>
          {getAddressLines(details, locale).map((line) => (
            <p key={line} className="text-shade">
              {line}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
