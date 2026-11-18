import { Minus, Plus, Trash2 } from 'lucide-react';
import { copy, formatNumber, formatOmr, localize } from '../../data/content';
import type { CartLine, Locale } from '../../types';
import { getCustomFitSummary } from './order';

interface BagLineItemProps {
  readonly locale: Locale;
  readonly line: CartLine;
  readonly onQuantityChange: (lineId: string, quantity: number) => void;
}

export function BagLineItem({ locale, line, onQuantityChange }: BagLineItemProps) {
  const productName = localize(line.product.name, locale);

  return (
    <article className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 py-5 first:pt-0 sm:grid-cols-[104px_1fr] sm:gap-5 sm:py-6">
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
      <div className="flex min-w-0 flex-col justify-between py-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-2xl">{productName}</h3>
            <p className="mt-1 text-xs text-shade">{localize(copy.product.size, locale)}: {line.size}</p>
            {line.customFit && (
              <div className="mt-2 border-s border-copper/70 ps-2 text-xs leading-5 text-shade lg:text-[11px]">
                <p className="font-medium text-copper-deep">{localize(copy.product.customFit.cartLabel, locale)}</p>
                <p>{getCustomFitSummary(line, locale)}</p>
              </div>
            )}
            {/* The line total, not the unit price: showing "OMR 165" against a quantity of
                three left the reader doing the sum themselves to understand the bag total. */}
            <p className="mt-3 text-sm tabular-nums">{formatOmr(line.product.priceOmr * line.quantity, locale)}</p>
            {line.quantity > 1 && (
              <p className="mt-1 text-[12px] tabular-nums text-shade lg:text-[11px]">
                {formatNumber(line.quantity, locale)} × {formatOmr(line.product.priceOmr, locale)}
              </p>
            )}
          </div>
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center text-shade transition-colors hover:text-date focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper"
            onClick={() => onQuantityChange(line.id, 0)}
            aria-label={`${localize(copy.cart.remove, locale)} ${productName}`}
          >
            <Trash2 aria-hidden="true" size={17} strokeWidth={1.25} />
          </button>
        </div>
        <div className="mt-4 flex w-fit items-center border border-hair sm:mt-5">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper"
            onClick={() => onQuantityChange(line.id, line.quantity - 1)}
            aria-label={`${localize(copy.cart.decrease, locale)}: ${productName}`}
          >
            <Minus aria-hidden="true" size={15} />
          </button>
          <span className="min-w-10 text-center text-sm tabular-nums" aria-live="polite">
            {formatNumber(line.quantity, locale)}
          </span>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper"
            onClick={() => onQuantityChange(line.id, line.quantity + 1)}
            aria-label={`${localize(copy.cart.increase, locale)}: ${productName}`}
          >
            <Plus aria-hidden="true" size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
