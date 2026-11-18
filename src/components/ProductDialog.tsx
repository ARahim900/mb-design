import { ChevronDown, Scissors, X } from 'lucide-react';
import { type MouseEvent, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { brand } from '../data/brand';
import { copy, fillTemplate, formatOmr, localize } from '../data/content';
import { useModalScrollLock } from '../hooks/useModalScrollLock';
import type { CustomFit, Locale, Product } from '../types';
import { CustomFitPanel, type CustomFitDraft, firstInvalidMeasurement, toCustomFit } from './CustomFitPanel';
import { ProductGallery } from './ProductGallery';
import { SizeGuide, SizeGuideToggle, hasSizeGuide } from './SizeGuide';

const EMPTY_CUSTOM_FIT: CustomFitDraft = {
  lengthCm: '',
  sleeveCm: '',
  fit: 'standard',
};

interface ProductDialogProps {
  readonly locale: Locale;
  readonly product: Product | null;
  readonly onClose: () => void;
  readonly onAddToCart: (product: Product, size: string, customFit?: CustomFit) => void;
}

interface DetailRowProps {
  readonly title: string;
  readonly body: string;
}

interface OrderBarProps {
  readonly locale: Locale;
  readonly priceOmr: number;
  readonly status: string;
  readonly sizeChosen: boolean;
  readonly deliveryLine: string;
  readonly onAdd: () => void;
}

/** Short delivery and returns facts, each present only once MB Design has confirmed it. */
function deliveryFacts(locale: Locale): string[] {
  const facts: string[] = [];
  if (brand.deliveryTime) {
    facts.push(fillTemplate(localize(copy.product.deliveryTime, locale), { time: localize(brand.deliveryTime, locale) }));
  }
  if (brand.deliveryFeeOmr === 0) {
    facts.push(localize(copy.product.freeDelivery, locale));
  } else if (brand.deliveryFeeOmr !== null) {
    facts.push(fillTemplate(localize(copy.product.deliveryFee, locale), { fee: formatOmr(brand.deliveryFeeOmr, locale) }));
  }
  if (brand.returnsSummary) facts.push(localize(brand.returnsSummary, locale));
  return facts;
}

/** The full delivery and returns text: the policy pages when supplied, else the short facts. */
function deliveryDetails(locale: Locale, facts: readonly string[]): string {
  const policies = brand.policies
    .filter((policy) => policy.id === 'delivery' || policy.id === 'returns')
    .map((policy) => localize(policy.body, locale));
  return policies.length > 0 ? policies.join('\n\n') : facts.join(' · ');
}

function DetailRow({ title, body }: DetailRowProps) {
  return (
    <details className="group border-t border-copper/45 py-4 last:border-b">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper">
        <span>{title}</span>
        <ChevronDown aria-hidden="true" size={17} strokeWidth={1.3} className="transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none" />
      </summary>
      <p className="whitespace-pre-line pb-3 pt-2 text-sm leading-relaxed text-shade">{body}</p>
    </details>
  );
}

// In the copy column's flow, pinned to the bottom of whichever box scrolls: the whole sheet on a
// portrait phone, the copy column beside the photo everywhere else. Being in flow, it never covers
// the last accordion, and nothing opened above it can push it out of view.
function OrderBar({ locale, priceOmr, status, sizeChosen, deliveryLine, onAdd }: OrderBarProps) {
  return (
    <div className="sticky bottom-0 z-20 -mx-5 mt-auto border-t border-copper/45 bg-pearl/95 px-5 pb-[calc(0.9rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-16px_40px_rgba(39,19,29,0.12)] backdrop-blur-md sm:-mx-10 sm:px-10 sm:pb-[0.9rem] short:-mx-8 short:px-8 lg:-mx-12 lg:px-12 lg:pb-5 xl:-mx-16 xl:px-16">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-2 flex items-center justify-between gap-4">
          <p className={`min-w-0 text-xs ${sizeChosen ? 'text-shade' : 'text-copper-deep'}`} aria-live="polite">
            {status}
          </p>
          <p className="shrink-0 text-sm tabular-nums text-date">{formatOmr(priceOmr, locale)}</p>
        </div>
        {deliveryLine && <p className="mb-2 text-xs leading-5 text-shade">{deliveryLine}</p>}
        <button type="button" className="button-primary min-h-14 w-full px-6 py-3 shadow-button" onClick={onAdd}>
          {localize(copy.product.add, locale)}
        </button>
      </div>
    </div>
  );
}

export function ProductDialog({ locale, product, onClose, onAddToCart }: ProductDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRegionRef = useRef<HTMLDivElement>(null);
  const sizeGroupRef = useRef<HTMLDivElement>(null);
  const customFitRef = useRef<HTMLDivElement>(null);
  const sizeLabelId = useId();
  const sizeGuideId = useId();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [customFitEnabled, setCustomFitEnabled] = useState(false);
  const [customFit, setCustomFit] = useState<CustomFitDraft>(EMPTY_CUSTOM_FIT);
  const [showFitErrors, setShowFitErrors] = useState(false);

  useModalScrollLock(product !== null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (product && !dialog.open) {
      if (scrollRegionRef.current) scrollRegionRef.current.scrollTop = 0;
      dialog.showModal();
      if (scrollRegionRef.current) scrollRegionRef.current.scrollTop = 0;
      setSelectedSize(null);
      setSizeError(false);
      setSizeGuideOpen(false);
      setCustomFitEnabled(false);
      setCustomFit(EMPTY_CUSTOM_FIT);
      setShowFitErrors(false);
    } else if (!product && dialog.open) {
      dialog.close();
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const previousTitle = document.title;
    document.title = `${localize(product.name, locale)} | MB Design`;
    return () => {
      document.title = previousTitle;
    };
  }, [product, locale]);

  const handleAdd = () => {
    if (!product) return;
    if (!selectedSize) {
      setSizeError(true);
      sizeGroupRef.current?.scrollIntoView({ block: 'center' });
      sizeGroupRef.current?.querySelector('button')?.focus();
      return;
    }

    if (!customFitEnabled) {
      onAddToCart(product, selectedSize);
      return;
    }

    const invalidField = firstInvalidMeasurement(customFit);
    if (invalidField) {
      setShowFitErrors(true);
      const input = customFitRef.current?.querySelector<HTMLInputElement>(`[data-fit-field="${invalidField}"]`);
      input?.focus({ preventScroll: true });
      input?.scrollIntoView({ block: 'center' });
      return;
    }

    onAddToCart(product, selectedSize, toCustomFit(customFit));
  };

  const handleCustomFitToggle = () => {
    if (customFitEnabled) {
      setCustomFitEnabled(false);
      setCustomFit(EMPTY_CUSTOM_FIT);
      setShowFitErrors(false);
      return;
    }

    setCustomFitEnabled(true);
    requestAnimationFrame(() => customFitRef.current?.scrollIntoView({ block: 'nearest' }));
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) onClose();
  };

  const specifications = product
    ? [
        { label: localize(copy.product.fabric, locale), value: localize(product.fabric, locale) },
        { label: localize(copy.product.availableSizes, locale), value: product.sizes.join(' · ') },
        { label: localize(copy.product.cut, locale), value: localize(product.cut, locale) },
        { label: localize(copy.product.signature, locale), value: localize(product.signature, locale) },
      ]
    : [];
  const hasAdjustments = customFitEnabled && toCustomFit(customFit) !== undefined;
  const orderStatus = selectedSize
    ? `${localize(copy.product.size, locale)} · ${selectedSize}${hasAdjustments ? ` · ${localize(copy.product.customFit.title, locale)}` : ''}`
    : localize(copy.product.chooseSize, locale);
  const facts = deliveryFacts(locale);
  const deliveryBody = deliveryDetails(locale, facts);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // Rendered into <body> rather than inside the app shell: a `transform`, `filter` or
  // `contain` on any ancestor makes that ancestor the containing block for fixed-position
  // descendants, which drops the sheet at the top of the document and leaves it scrolling
  // with the page instead of pinned to the viewport.
  return createPortal(
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none overflow-hidden bg-pearl p-0 text-ink shadow-[0_24px_90px_rgba(28,20,23,0.35)] backdrop:bg-date/80 sm:m-auto sm:h-[min(92svh,920px)] sm:w-[min(94vw,1420px,calc(100vw-2*max(env(safe-area-inset-left),env(safe-area-inset-right))-16px))]"
      aria-label={product ? localize(product.name, locale) : undefined}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      {product && (
        <>
          <button
            type="button"
            className="absolute end-4 top-[calc(1rem+env(safe-area-inset-top))] z-30 flex h-11 w-11 items-center justify-center border border-copper/70 bg-pearl/95 text-date shadow-[0_8px_24px_rgba(28,20,23,0.18)] backdrop-blur-sm transition-colors hover:bg-date hover:text-pearl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper sm:end-5 sm:top-5 short:right-auto short:left-5"
            onClick={onClose}
            aria-label={localize(copy.product.close, locale)}
          >
            <X aria-hidden="true" size={23} strokeWidth={1.25} />
          </button>
          {/* The scroll padding matches the sticky band at the top and the order bar at the
              bottom, so a control that takes focus or is scrolled into view lands between them
              rather than behind either. Sideways, the copy column scrolls and carries it instead. */}
          <div ref={scrollRegionRef} className="grid h-full scroll-pt-[calc(env(safe-area-inset-top)+4.25rem)] scroll-pb-[calc(env(safe-area-inset-bottom)+8.5rem)] overflow-y-auto overscroll-contain sm:scroll-pt-[4.5rem] sm:scroll-pb-[8.5rem] short:grid-cols-[2fr_3fr] short:overflow-hidden short:scroll-p-0 short:[direction:ltr] lg:grid-cols-[1.25fr_0.75fr] lg:overflow-hidden lg:scroll-p-0 lg:[direction:ltr]">
          <ProductGallery key={product.id} locale={locale} product={product} />

          <div
            className="relative flex flex-col justify-start px-5 sm:px-10 short:min-h-full short:scroll-pb-[8.5rem] short:overflow-y-auto short:px-8 short:pt-8 lg:min-h-full lg:scroll-pb-[8.5rem] lg:overflow-y-auto lg:px-12 lg:pt-16 xl:px-16"
            dir={dir}
          >
            {/* The column's top padding, made sticky so the copy scrolls under it rather than
                under the close button. The pearl above it sits behind the photo, so it shows only
                once the photo has scrolled away. On a phone held sideways the copy scrolls beside
                the photo instead, and the close button moves onto the photo. */}
            <div
              aria-hidden="true"
              className="sticky top-[calc(env(safe-area-inset-top)+2rem)] z-10 -mx-5 h-9 shrink-0 bg-pearl before:absolute before:inset-x-0 before:bottom-full before:h-[100dvh] before:bg-pearl sm:top-6 sm:-mx-10 sm:h-12 short:hidden lg:hidden"
            />
            {/* Auto margins centre the copy when it fits; justify-center would clip the top of a
                column taller than the sheet, out of reach of scrolling. */}
            <div className="mx-auto w-full max-w-lg pb-10 lg:my-auto">
              <h2 className="font-display text-4xl font-normal leading-tight sm:text-6xl">{localize(product.name, locale)}</h2>
              <p className="mt-1 text-sm uppercase tracking-[0.1em] text-shade" lang={locale === 'ar' ? 'en' : 'ar'}>
                {localize(product.name, locale === 'ar' ? 'en' : 'ar')}
              </p>
              <span className="my-5 block h-px w-16 bg-copper sm:my-7" aria-hidden="true" />
              <p className="text-lg tabular-nums">{formatOmr(product.priceOmr, locale)}</p>
              <p className="mt-4 max-w-md text-sm leading-7 text-shade sm:mt-5">{localize(product.description, locale)}</p>

              <div
                ref={sizeGroupRef}
                role="group"
                className="mt-7 scroll-mt-6"
                aria-labelledby={sizeLabelId}
                aria-describedby={sizeError ? 'product-size-error' : undefined}
              >
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span id={sizeLabelId} className="text-sm text-shade">
                    {localize(copy.product.size, locale)}
                  </span>
                  {hasSizeGuide && (
                    <SizeGuideToggle
                      locale={locale}
                      open={sizeGuideOpen}
                      controls={sizeGuideId}
                      onToggle={() => setSizeGuideOpen((open) => !open)}
                    />
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`min-h-12 border text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${selectedSize === size ? 'border-date bg-date text-pearl' : 'border-hair bg-transparent text-ink hover:border-copper'}`}
                      aria-pressed={selectedSize === size}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p id="product-size-error" className="mt-3 text-sm text-pomegranate" role="alert">
                    {localize(copy.product.chooseSize, locale)}
                  </p>
                )}
                {hasSizeGuide && sizeGuideOpen && <SizeGuide locale={locale} id={sizeGuideId} />}
              </div>

              <button
                type="button"
                className="mt-4 flex min-h-12 w-full items-center justify-between gap-4 border border-copper/55 bg-transparent px-4 text-sm text-date transition-colors hover:border-copper-deep hover:bg-sand/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
                aria-expanded={customFitEnabled}
                onClick={handleCustomFitToggle}
              >
                <span className="flex items-center gap-3">
                  <Scissors aria-hidden="true" size={18} strokeWidth={1.25} className="text-copper-deep" />
                  {localize(
                    customFitEnabled ? copy.product.customFit.remove : copy.product.customFit.action,
                    locale,
                  )}
                </span>
                <span aria-hidden="true" className="font-display text-xl text-copper-deep">
                  {customFitEnabled ? '−' : '+'}
                </span>
              </button>

              {customFitEnabled && (
                <div ref={customFitRef} className="mt-3 scroll-mt-6">
                  <CustomFitPanel locale={locale} value={customFit} showErrors={showFitErrors} onChange={setCustomFit} />
                </div>
              )}

              <section className="mt-8" aria-labelledby="product-specifications">
                <h3 id="product-specifications" className="text-xs font-medium uppercase tracking-[0.12em] text-copper-deep">
                  {localize(copy.product.specifications, locale)}
                </h3>
                <dl className="mt-3 grid grid-cols-2 border-y border-copper/35">
                  {specifications.map((specification, index) => (
                    <div
                      key={specification.label}
                      className={`min-w-0 py-3 ${index % 2 === 0 ? 'pe-3' : 'border-s border-copper/30 ps-3'} ${index > 1 ? 'border-t border-copper/30' : ''}`}
                    >
                      <dt className="text-xs leading-5 text-shade lg:text-[11px]">{specification.label}</dt>
                      <dd className="mt-1 text-sm leading-6 text-date">{specification.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <div className="mt-8 lg:mt-10">
                <DetailRow title={localize(copy.product.details, locale)} body={localize(product.details, locale)} />
                <DetailRow title={localize(copy.product.fit, locale)} body={localize(copy.product.fitBody, locale)} />
                {deliveryBody && <DetailRow title={localize(copy.product.delivery, locale)} body={deliveryBody} />}
              </div>
            </div>

            <OrderBar
              locale={locale}
              priceOmr={product.priceOmr}
              status={orderStatus}
              sizeChosen={selectedSize !== null}
              deliveryLine={facts.join(' · ')}
              onAdd={handleAdd}
            />
          </div>
          </div>
        </>
      )}
    </dialog>,
    document.body,
  );
}
