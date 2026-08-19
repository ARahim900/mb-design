import { ChevronDown, Scissors, X } from 'lucide-react';
import { type MouseEvent, useEffect, useRef, useState } from 'react';
import { copy, formatOmr, localize } from '../data/content';
import type { CustomFit, Locale, Product } from '../types';
import { CustomFitPanel, type CustomFitDraft } from './CustomFitPanel';

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

function DetailRow({ title, body }: DetailRowProps) {
  return (
    <details className="group border-t border-copper/45 py-4 last:border-b">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper">
        <span>{title}</span>
        <ChevronDown aria-hidden="true" size={17} strokeWidth={1.3} className="transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none" />
      </summary>
      <p className="pb-3 pt-2 text-sm leading-relaxed text-shade">{body}</p>
    </details>
  );
}

export function ProductDialog({ locale, product, onClose, onAddToCart }: ProductDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRegionRef = useRef<HTMLDivElement>(null);
  const sizeGroupRef = useRef<HTMLFieldSetElement>(null);
  const customFitRef = useRef<HTMLDivElement>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [customFitEnabled, setCustomFitEnabled] = useState(false);
  const [customFit, setCustomFit] = useState<CustomFitDraft>(EMPTY_CUSTOM_FIT);
  const [customFitError, setCustomFitError] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (product && !dialog.open) {
      if (scrollRegionRef.current) scrollRegionRef.current.scrollTop = 0;
      dialog.showModal();
      if (scrollRegionRef.current) scrollRegionRef.current.scrollTop = 0;
      setSelectedSize(null);
      setSizeError(false);
      setCustomFitEnabled(false);
      setCustomFit(EMPTY_CUSTOM_FIT);
      setCustomFitError(false);
    } else if (!product && dialog.open) {
      dialog.close();
    }
  }, [product]);

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

    const lengthCm = customFit.lengthCm.trim();
    const sleeveCm = customFit.sleeveCm.trim();
    if (!lengthCm && !sleeveCm && customFit.fit === 'standard') {
      setCustomFitError(true);
      customFitRef.current?.scrollIntoView({ block: 'center' });
      customFitRef.current?.querySelector('input')?.focus();
      return;
    }

    onAddToCart(product, selectedSize, {
      ...(lengthCm ? { lengthCm } : {}),
      ...(sleeveCm ? { sleeveCm } : {}),
      fit: customFit.fit,
    });
  };

  const handleCustomFitToggle = () => {
    if (customFitEnabled) {
      setCustomFitEnabled(false);
      setCustomFit(EMPTY_CUSTOM_FIT);
      setCustomFitError(false);
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

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-svh max-h-none w-full max-w-none overflow-hidden bg-pearl p-0 text-ink shadow-[0_24px_90px_rgba(28,20,23,0.35)] backdrop:bg-date/80 sm:h-[min(92svh,920px)] sm:w-[min(94vw,1420px)]"
      aria-label={product ? localize(product.name, locale) : undefined}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      {product && (
        <>
          <button
            type="button"
            className="absolute end-4 top-[calc(1rem+env(safe-area-inset-top))] z-30 flex h-11 w-11 items-center justify-center border border-copper/70 bg-pearl/95 text-date shadow-[0_8px_24px_rgba(28,20,23,0.18)] backdrop-blur-sm transition-colors hover:bg-date hover:text-pearl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper sm:end-5 sm:top-5"
            onClick={onClose}
            aria-label={localize(copy.product.close, locale)}
          >
            <X aria-hidden="true" size={23} strokeWidth={1.25} />
          </button>
          <div ref={scrollRegionRef} className="grid h-full overflow-y-auto overscroll-contain lg:grid-cols-[1.25fr_0.75fr] lg:overflow-hidden lg:[direction:ltr]">
          <div className="relative h-[40svh] min-h-[280px] max-h-[430px] overflow-hidden bg-sand lg:h-auto lg:min-h-0 lg:max-h-none">
            <img
              src={product.image}
              alt={localize(product.imageAlt, locale)}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: product.imagePosition }}
              decoding="async"
            />
          </div>

          <div
            className="relative flex flex-col justify-start px-5 pb-[calc(7.5rem+env(safe-area-inset-bottom))] pt-9 sm:px-10 sm:pt-12 lg:min-h-full lg:justify-center lg:overflow-y-auto lg:px-12 lg:py-16 xl:px-16"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="mx-auto w-full max-w-lg">
              <h2 className="font-display text-4xl font-normal leading-tight sm:text-6xl">{localize(product.name, locale)}</h2>
              <p className="mt-1 text-sm uppercase tracking-[0.1em] text-shade" lang={locale === 'ar' ? 'en' : 'ar'}>
                {localize(product.name, locale === 'ar' ? 'en' : 'ar')}
              </p>
              <span className="my-5 block h-px w-16 bg-copper sm:my-7" aria-hidden="true" />
              <p className="text-lg tabular-nums">{formatOmr(product.priceOmr, locale)}</p>
              <p className="mt-4 max-w-md text-sm leading-7 text-shade sm:mt-5">{localize(product.description, locale)}</p>

              <fieldset ref={sizeGroupRef} className="mt-7 scroll-mt-6" aria-describedby={sizeError ? 'product-size-error' : undefined}>
                <legend className="mb-3 text-sm text-shade">{localize(copy.product.size, locale)}</legend>
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
              </fieldset>

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
                  <CustomFitPanel
                    locale={locale}
                    value={customFit}
                    hasError={customFitError}
                    onChange={(value) => {
                      setCustomFit(value);
                      setCustomFitError(false);
                    }}
                  />
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
                      <dt className="text-[11px] leading-5 text-shade">{specification.label}</dt>
                      <dd className="mt-1 text-sm leading-6 text-date">{specification.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <button type="button" className="button-primary mt-7 hidden min-h-14 w-full px-6 py-3 shadow-button lg:inline-flex" onClick={handleAdd}>
                {localize(copy.product.add, locale)}
              </button>

              <div className="mt-8 lg:mt-10">
                <DetailRow title={localize(copy.product.details, locale)} body={localize(product.details, locale)} />
                <DetailRow title={localize(copy.product.fit, locale)} body={localize(copy.product.fitBody, locale)} />
                <DetailRow title={localize(copy.product.delivery, locale)} body={localize(copy.product.deliveryBody, locale)} />
              </div>
            </div>
          </div>
          </div>
          <div
            className="absolute inset-x-0 bottom-0 z-20 border-t border-copper/45 bg-pearl/95 px-5 pb-[calc(0.9rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-16px_40px_rgba(39,19,29,0.12)] backdrop-blur-md lg:hidden"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          >
            <p className={`mb-2 text-xs ${selectedSize ? 'text-shade' : 'text-copper-deep'}`}>
              {selectedSize
                ? `${localize(copy.product.size, locale)} · ${selectedSize}${customFitEnabled ? ` · ${localize(copy.product.customFit.title, locale)}` : ''}`
                : localize(copy.product.chooseSize, locale)}
            </p>
            <button type="button" className="button-primary min-h-14 w-full px-6 py-3 shadow-button" onClick={handleAdd}>
              {localize(copy.product.add, locale)}
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
