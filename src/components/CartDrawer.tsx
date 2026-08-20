import { ArrowLeft, ArrowRight, Minus, Plus, Trash2, X } from 'lucide-react';
import { type FormEvent, type MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { copy, formatOmr, localize } from '../data/content';
import { useModalScrollLock } from '../hooks/useModalScrollLock';
import type { CartLine, Locale } from '../types';
import { BrandWordmark } from './BrandWordmark';

interface CartDrawerProps {
  readonly locale: Locale;
  readonly open: boolean;
  readonly cart: readonly CartLine[];
  readonly onClose: () => void;
  readonly onQuantityChange: (lineId: string, quantity: number) => void;
}

type CartView = 'bag' | 'checkout' | 'confirmed';

function getCustomFitSummary(line: CartLine, locale: Locale): string {
  if (!line.customFit) return '';

  const customCopy = copy.product.customFit;
  const unit = localize(customCopy.unit, locale);
  const details = [
    line.customFit.lengthCm
      ? `${localize(customCopy.length, locale)}: ${line.customFit.lengthCm} ${unit}`
      : null,
    line.customFit.sleeveCm
      ? `${localize(customCopy.sleeve, locale)}: ${line.customFit.sleeveCm} ${unit}`
      : null,
    line.customFit.fit === 'relaxed' ? localize(customCopy.relaxed, locale) : null,
  ];

  return details.filter((detail): detail is string => detail !== null).join(' · ');
}

export function CartDrawer({ locale, open, cart, onClose, onQuantityChange }: CartDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRegionRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<CartView>('bag');
  const BackArrow = locale === 'ar' ? ArrowRight : ArrowLeft;

  useModalScrollLock(open);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      if (scrollRegionRef.current) scrollRegionRef.current.scrollTop = 0;
      setView('bag');
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const total = useMemo(
    () => cart.reduce((sum, line) => sum + line.product.priceOmr * line.quantity, 0),
    [cart],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setView('confirmed');
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) onClose();
  };

  // Portalled into <body> for the same reason as the product sheet: no app-shell ancestor can
  // then become the containing block for this fixed-position drawer.
  return createPortal(
    <dialog
      ref={dialogRef}
      className="fixed inset-0 my-0 ms-auto me-0 h-[100dvh] max-h-none w-full max-w-none overflow-hidden bg-pearl p-0 text-ink shadow-[0_0_70px_rgba(28,20,23,0.3)] backdrop:bg-date/80 sm:max-w-[500px]"
      aria-labelledby="cart-title"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <div className="flex h-full flex-col">
        <div className="flex min-h-[calc(70px+env(safe-area-inset-top))] shrink-0 items-center justify-between border-b border-hair bg-pearl px-4 pt-[env(safe-area-inset-top)] sm:min-h-[76px] sm:px-7 sm:pt-0">
          <div className="flex items-center gap-2">
            {view === 'checkout' && (
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper"
                onClick={() => setView('bag')}
                aria-label={localize(copy.cart.back, locale)}
              >
                <BackArrow aria-hidden="true" size={21} strokeWidth={1.3} />
              </button>
            )}
            <h2 id="cart-title" className="font-display text-3xl font-normal">
              {view === 'bag' ? localize(copy.cart.title, locale) : localize(copy.checkout.title, locale)}
            </h2>
          </div>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper"
            onClick={onClose}
            aria-label={localize(copy.cart.close, locale)}
          >
            <X aria-hidden="true" size={23} strokeWidth={1.25} />
          </button>
        </div>

        {view === 'bag' && (
          <>
            <div ref={scrollRegionRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-7 sm:py-7">
              {cart.length === 0 ? (
                <div className="flex h-full min-h-[300px] items-center justify-center text-center">
                  <p className="font-display text-2xl text-shade">{localize(copy.cart.empty, locale)}</p>
                </div>
              ) : (
                <div className="divide-y divide-hair">
                  {cart.map((line) => (
                    <article key={line.id} className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 py-5 first:pt-0 sm:grid-cols-[104px_1fr] sm:gap-5 sm:py-6">
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
                          <div>
                            <h3 className="font-display text-2xl">{localize(line.product.name, locale)}</h3>
                            <p className="mt-1 text-xs text-shade">{localize(copy.product.size, locale)}: {line.size}</p>
                            {line.customFit && (
                              <div className="mt-2 border-s border-copper/70 ps-2 text-[11px] leading-5 text-shade">
                                <p className="font-medium text-copper-deep">
                                  {localize(copy.product.customFit.cartLabel, locale)}
                                </p>
                                <p>{getCustomFitSummary(line, locale)}</p>
                              </div>
                            )}
                            <p className="mt-3 text-sm tabular-nums">{formatOmr(line.product.priceOmr, locale)}</p>
                          </div>
                          <button
                            type="button"
                            className="flex h-11 w-11 shrink-0 items-center justify-center text-shade transition-colors hover:text-pomegranate focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper"
                            onClick={() => onQuantityChange(line.id, 0)}
                            aria-label={`${localize(copy.cart.remove, locale)} ${localize(line.product.name, locale)}`}
                          >
                            <Trash2 aria-hidden="true" size={17} strokeWidth={1.25} />
                          </button>
                        </div>
                        <div className="mt-4 flex w-fit items-center border border-hair sm:mt-5">
                          <button
                            type="button"
                            className="flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper"
                            onClick={() => onQuantityChange(line.id, line.quantity - 1)}
                            aria-label={localize(copy.cart.decrease, locale)}
                          >
                            <Minus aria-hidden="true" size={15} />
                          </button>
                          <span className="min-w-10 text-center text-sm tabular-nums" aria-live="polite">{line.quantity}</span>
                          <button
                            type="button"
                            className="flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper"
                            onClick={() => onQuantityChange(line.id, line.quantity + 1)}
                            aria-label={localize(copy.cart.increase, locale)}
                          >
                            <Plus aria-hidden="true" size={15} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="shrink-0 border-t border-copper/55 bg-pearl px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-5 shadow-[0_-14px_36px_rgba(39,19,29,0.1)] sm:px-7 sm:py-6">
                <div className="flex items-center justify-between text-sm">
                  <span>{localize(copy.cart.total, locale)}</span>
                  <span className="tabular-nums">{formatOmr(total, locale)}</span>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-shade">{localize(copy.cart.previewNote, locale)}</p>
                <button type="button" className="button-primary mt-5 min-h-14 w-full px-6 py-3 shadow-button" onClick={() => setView('checkout')}>
                  {localize(copy.cart.checkout, locale)}
                </button>
              </div>
            )}
          </>
        )}

        {view === 'checkout' && (
          <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-6 sm:px-7 sm:py-7">
              <label className="form-field">
                <span>{localize(copy.checkout.name, locale)}</span>
                <input name="name" autoComplete="name" required />
              </label>
              <label className="form-field">
                <span>{localize(copy.checkout.mobile, locale)}</span>
                <input name="mobile" type="tel" inputMode="tel" autoComplete="tel" required />
              </label>
              <label className="form-field">
                <span>{localize(copy.checkout.area, locale)}</span>
                <input name="area" autoComplete="address-level2" required />
              </label>
              <label className="form-field">
                <span>{localize(copy.checkout.address, locale)}</span>
                <textarea name="address" rows={3} autoComplete="street-address" required />
              </label>
              <p className="text-xs leading-relaxed text-shade">{localize(copy.cart.previewNote, locale)}</p>
            </div>
            <div className="shrink-0 border-t border-copper/45 bg-pearl px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 shadow-[0_-14px_36px_rgba(39,19,29,0.1)] sm:px-7 sm:py-6">
              <button type="submit" className="button-primary min-h-14 w-full px-6 py-3 shadow-button">
                {localize(copy.checkout.submit, locale)}
              </button>
            </div>
          </form>
        )}

        {view === 'confirmed' && (
          <div className="flex flex-1 items-center px-8 py-14 text-center">
            <div className="mx-auto max-w-sm">
              <BrandWordmark />
              <h3 className="mt-9 font-display text-4xl leading-tight">{localize(copy.checkout.confirmedTitle, locale)}</h3>
              <span className="mx-auto my-6 block h-px w-14 bg-copper" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-shade">{localize(copy.checkout.confirmedBody, locale)}</p>
              <button type="button" className="button-primary mt-9 min-h-12 px-10 py-3 shadow-button" onClick={onClose}>
                {localize(copy.cart.close, locale)}
              </button>
            </div>
          </div>
        )}
      </div>
    </dialog>,
    document.body,
  );
}
