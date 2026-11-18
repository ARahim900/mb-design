import { ArrowLeft, ArrowRight, ShoppingBag, X } from 'lucide-react';
import { type FocusEvent, type FormEvent, type MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { hasWhatsApp } from '../data/brand';
import { copy, formatOmr, localize } from '../data/content';
import { useModalScrollLock } from '../hooks/useModalScrollLock';
import type { CartLine, Locale } from '../types';
import { BagLineItem } from './checkout/BagLineItem';
import { CheckoutSteps } from './checkout/CheckoutSteps';
import { ConfirmReview } from './checkout/ConfirmReview';
import { DetailsForm } from './checkout/DetailsForm';
import { OrderSent } from './checkout/OrderSent';
import { OrderSummary } from './checkout/OrderSummary';
import { SendOrderBar } from './checkout/SendOrderBar';
import { useKeyboardInset } from './checkout/useKeyboardInset';
import {
  type CheckoutDetails,
  type CheckoutErrors,
  type CheckoutField,
  type CheckoutStep,
  buildWhatsAppUrl,
  emptyDetails,
  fieldOrder,
  getOrderTotals,
  normaliseMobile,
  validateDetails,
} from './checkout/order';

interface CartDrawerProps {
  readonly locale: Locale;
  readonly open: boolean;
  readonly cart: readonly CartLine[];
  readonly onClose: () => void;
  readonly onQuantityChange: (lineId: string, quantity: number) => void;
  readonly onClearCart: () => void;
}

// From `sm` the drawer is at most 500px wide and only its outer edge meets the screen edge, so
// `sm:ps-[var(--gutter)]` keeps the notch inset off the inner edge.
const scrollRegionClass =
  'min-h-0 flex-1 overflow-y-auto overscroll-contain px-safe py-6 [--gutter:1rem] sm:py-7 sm:ps-[var(--gutter)] sm:[--gutter:1.75rem] short:py-3';
const footerClass =
  'shrink-0 border-t border-copper/55 bg-pearl px-safe pb-[calc(1rem+env(safe-area-inset-bottom))] pt-5 shadow-[0_-14px_36px_rgba(39,19,29,0.1)] [--gutter:1rem] sm:ps-[var(--gutter)] sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pt-6 sm:[--gutter:1.75rem] short:pb-[max(0.75rem,env(safe-area-inset-bottom))] short:pt-3';

const titles = {
  bag: copy.cart.title,
  details: copy.checkout.title,
  confirm: copy.checkout.confirmTitle,
} as const;

export function CartDrawer({ locale, open, cart, onClose, onQuantityChange, onClearCart }: CartDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRegionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState<CheckoutStep>('bag');
  const [sent, setSent] = useState(false);
  // Frozen when the order is sent: the reopen link must resend that order, not the bag as it
  // is later (empty once the reader clears it).
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const [details, setDetails] = useState<CheckoutDetails>(emptyDetails);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [validated, setValidated] = useState(false);
  const BackArrow = locale === 'ar' ? ArrowRight : ArrowLeft;
  // A bag emptied elsewhere (another tab, the last line removed) cannot stay mid-checkout.
  const currentStep: CheckoutStep = cart.length === 0 ? 'bag' : step;

  useModalScrollLock(open);
  useKeyboardInset(dialogRef, open && currentStep === 'details' && !sent);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      if (scrollRegionRef.current) scrollRegionRef.current.scrollTop = 0;
      setStep('bag');
      setSent(false);
      setSentUrl(null);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const totals = useMemo(() => getOrderTotals(cart), [cart]);
  const whatsAppUrl = useMemo(
    () => (hasWhatsApp ? buildWhatsAppUrl(cart, details, locale) : null),
    [cart, details, locale],
  );

  const goTo = (next: CheckoutStep) => {
    setStep(next);
    // After the new step renders: start it from the top and move focus to its title, so a
    // screen reader announces where the reader now is.
    requestAnimationFrame(() => {
      if (scrollRegionRef.current) scrollRegionRef.current.scrollTop = 0;
      titleRef.current?.focus();
    });
  };

  const handleDetailChange = (field: CheckoutField, value: string) => {
    const next: CheckoutDetails = {
      ...details,
      [field]: field === 'mobile' ? normaliseMobile(value) : value,
      ...(field === 'governorate' ? { wilayat: '' } : {}),
    };
    setDetails(next);
    if (validated) setErrors(validateDetails(next));
  };

  const handleDetailsSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateDetails(details);
    setErrors(nextErrors);
    setValidated(true);

    const firstInvalid = fieldOrder.find((field) => nextErrors[field]);
    if (firstInvalid) {
      const element = event.currentTarget.elements.namedItem(firstInvalid);
      if (element instanceof HTMLElement) element.focus();
      return;
    }
    goTo('confirm');
  };

  const handleFieldFocus = (event: FocusEvent<HTMLElement>) => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement)) return;
    if (!window.matchMedia('(pointer: coarse)').matches) return;
    // The keyboard finishes rising after focus; scrolling once it has keeps the field in view.
    window.setTimeout(() => field.scrollIntoView({ block: 'nearest' }), 350);
  };

  const handleSent = () => {
    setSentUrl(whatsAppUrl);
    setSent(true);
    requestAnimationFrame(() => titleRef.current?.focus());
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) onClose();
  };

  const handleBrowse = () => {
    onClose();
    // Deferred by a frame: the drawer's scroll lock is released in an effect cleanup, and
    // scrolling a document that is still locked does nothing at all.
    requestAnimationFrame(() => {
      document.getElementById('collection')?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  };

  const previousStep: Record<CheckoutStep, CheckoutStep | null> = { bag: null, details: 'bag', confirm: 'details' };
  const backTarget = sent ? null : previousStep[currentStep];

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
        <div className="flex min-h-[calc(70px+env(safe-area-inset-top))] shrink-0 items-center justify-between gap-2 border-b border-hair bg-pearl px-safe pt-[env(safe-area-inset-top)] [--gutter:1rem] sm:min-h-[76px] sm:ps-[var(--gutter)] sm:pt-0 sm:[--gutter:1.75rem] short:min-h-[calc(56px+env(safe-area-inset-top))]">
          <div className="flex min-w-0 items-center gap-2">
            {backTarget && (
              <button
                type="button"
                className="-ms-2 flex h-11 w-11 shrink-0 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper"
                onClick={() => goTo(backTarget)}
                aria-label={`${localize(copy.cart.back, locale)}: ${localize(titles[backTarget], locale)}`}
              >
                <BackArrow aria-hidden="true" size={21} strokeWidth={1.3} />
              </button>
            )}
            <h2
              ref={titleRef}
              id="cart-title"
              tabIndex={-1}
              className="min-w-0 truncate py-2 font-display text-3xl font-normal outline-none lg:py-0 short:text-2xl"
            >
              {localize(sent ? copy.checkout.confirmTitle : titles[currentStep], locale)}
            </h2>
          </div>
          <button
            type="button"
            className="-me-2 flex h-11 w-11 shrink-0 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper"
            onClick={onClose}
            aria-label={localize(copy.cart.close, locale)}
          >
            <X aria-hidden="true" size={23} strokeWidth={1.25} />
          </button>
        </div>

        {cart.length > 0 && !sent && <CheckoutSteps locale={locale} current={currentStep} />}

        {sent && (
          <OrderSent
            locale={locale}
            whatsAppUrl={sentUrl}
            canClearBag={cart.length > 0}
            onClearBag={onClearCart}
            onClose={onClose}
          />
        )}

        {!sent && currentStep === 'bag' && (
          <>
            <div ref={scrollRegionRef} className={scrollRegionClass}>
              {cart.length === 0 ? (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center px-2 text-center short:min-h-fit">
                  <span aria-hidden="true" className="flex h-20 w-20 items-center justify-center rounded-full bg-sand text-copper-deep short:h-14 short:w-14">
                    <ShoppingBag size={30} strokeWidth={1.1} />
                  </span>
                  <p className="mt-6 font-display text-3xl text-date short:mt-3">{localize(copy.cart.empty, locale)}</p>
                  <p className="mt-3 max-w-[17rem] text-sm leading-7 text-shade">{localize(copy.cart.emptyBody, locale)}</p>
                  <button
                    type="button"
                    className="button-primary mt-8 min-h-12 w-full max-w-[17rem] px-6 py-3 shadow-button short:mt-4"
                    onClick={handleBrowse}
                  >
                    {localize(copy.collection.all, locale)}
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-hair">
                  {cart.map((line) => (
                    <BagLineItem key={line.id} locale={locale} line={line} onQuantityChange={onQuantityChange} />
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className={footerClass}>
                <div className="flex items-center justify-between text-sm">
                  <span>{localize(copy.cart.total, locale)}</span>
                  <span className="tabular-nums">{formatOmr(totals.subtotal, locale)}</span>
                </div>
                <button
                  type="button"
                  className="button-primary mt-5 min-h-14 w-full px-6 py-3 shadow-button short:mt-3 short:min-h-12"
                  onClick={() => goTo('details')}
                >
                  {localize(copy.cart.checkout, locale)}
                </button>
              </div>
            )}
          </>
        )}

        {!sent && currentStep === 'details' && (
          <form className="flex min-h-0 flex-1 flex-col" noValidate onSubmit={handleDetailsSubmit}>
            <div
              ref={scrollRegionRef}
              className={`${scrollRegionClass} space-y-8 [scroll-padding-bottom:calc(1.5rem+var(--keyboard-inset,0px))]`}
              onFocus={handleFieldFocus}
            >
              <OrderSummary locale={locale} cart={cart} />
              <DetailsForm locale={locale} details={details} errors={errors} onChange={handleDetailChange} />
              {/* Room to scroll the last field above an on-screen keyboard that overlays the drawer. */}
              <div aria-hidden="true" className="h-[var(--keyboard-inset,0px)]" />
            </div>
            <div className={footerClass}>
              <button type="submit" className="button-primary min-h-14 w-full px-6 py-3 shadow-button short:min-h-12">
                {localize(copy.checkout.review, locale)}
              </button>
            </div>
          </form>
        )}

        {!sent && currentStep === 'confirm' && (
          <>
            <div ref={scrollRegionRef} className={scrollRegionClass}>
              <ConfirmReview locale={locale} cart={cart} details={details} onEditDetails={() => goTo('details')} />
            </div>
            <div className={footerClass}>
              <SendOrderBar
                locale={locale}
                total={totals.total}
                deliveryFee={totals.deliveryFee}
                whatsAppUrl={whatsAppUrl}
                onSent={handleSent}
              />
            </div>
          </>
        )}
      </div>
    </dialog>,
    document.body,
  );
}
