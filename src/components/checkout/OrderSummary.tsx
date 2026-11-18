import { brand } from '../../data/brand';
import { copy, formatNumber, formatOmr, localize } from '../../data/content';
import type { CartLine, Locale } from '../../types';
import { getCustomFitSummary, getDeliveryLabel, getOrderTotals, getTotalLabel } from './order';

interface OrderSummaryProps {
  readonly locale: Locale;
  readonly cart: readonly CartLine[];
}

export function OrderSummary({ locale, cart }: OrderSummaryProps) {
  const { subtotal, deliveryFee, total } = getOrderTotals(cart);

  return (
    <section aria-labelledby="order-summary-title" className="border border-hair bg-sand/40 p-4 sm:p-5">
      <h3 id="order-summary-title" className="text-xs font-medium uppercase tracking-editorial text-copper-deep">
        {localize(copy.checkout.summary, locale)}
      </h3>
      <ul className="mt-3 divide-y divide-hair">
        {cart.map((line) => {
          const fit = getCustomFitSummary(line, locale);
          return (
            <li key={line.id} className="grid grid-cols-[48px_minmax(0,1fr)_auto] gap-3 py-3 first:pt-1">
              <div className="aspect-[4/5] overflow-hidden bg-sand">
                <img
                  src={line.product.image}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ objectPosition: line.product.imagePosition }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="min-w-0 text-xs leading-5 text-shade">
                <p className="font-display text-lg leading-6 text-ink">{localize(line.product.name, locale)}</p>
                <p>
                  {localize(copy.product.size, locale)}: {line.size}
                  <span aria-hidden="true"> · </span>
                  {localize(copy.cart.quantity, locale)}: <span className="tabular-nums">{formatNumber(line.quantity, locale)}</span>
                </p>
                {fit && (
                  <p className="text-copper-deep">
                    {localize(copy.product.customFit.cartLabel, locale)}: {fit}
                  </p>
                )}
              </div>
              <p className="pt-1 text-sm tabular-nums text-ink">
                {formatOmr(line.product.priceOmr * line.quantity, locale)}
              </p>
            </li>
          );
        })}
      </ul>
      <dl className="mt-1 space-y-2 border-t border-hair pt-3 text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-shade">{localize(copy.checkout.subtotal, locale)}</dt>
          <dd className="tabular-nums">{formatOmr(subtotal, locale)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-shade">{localize(copy.checkout.delivery, locale)}</dt>
          <dd className="text-end">
            <span className={deliveryFee === null ? 'text-xs text-shade' : 'tabular-nums'}>
              {getDeliveryLabel(deliveryFee, locale)}
            </span>
            {brand.deliveryTime && (
              <span className="block text-xs text-shade">{localize(brand.deliveryTime, locale)}</span>
            )}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-t border-hair pt-2 font-medium text-date">
          <dt>{getTotalLabel(deliveryFee, locale)}</dt>
          <dd className="tabular-nums">{formatOmr(total, locale)}</dd>
        </div>
      </dl>
    </section>
  );
}
