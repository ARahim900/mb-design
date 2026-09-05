import { ArrowLeft, ArrowRight } from 'lucide-react';
import { copy, formatOmr, localize, products } from '../data/content';
import { useActSequence, useReducedMotion } from '../hooks/usePremiumMotion';
import type { Locale, Product } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface CollectionProps {
  readonly locale: Locale;
  readonly onProductOpen: (product: Product) => void;
}

const INDEX_LABEL = ['٠١', '٠٢', '٠٣'] as const;

function ground(product: Product): string {
  return product.groundHex ?? product.colorHex;
}

/**
 * The collection, as a scroll-driven sequence.
 *
 * The hero promises «ألوانٌ لها حضور» — colour, with presence — so the page
 * makes good on it: each piece takes the whole ground as it comes forward,
 * jade to saffron to plum. The colour is the collection, not decoration
 * applied over it.
 *
 * Pinned with `position: sticky`, never by intercepting the wheel, so
 * momentum, rubber-banding and assistive paging all still drive it. Under
 * reduced motion the sequence collapses to a plain stack of the same panels,
 * which is why every piece stays reachable and shoppable either way.
 */
export function Collection({ locale, onProductOpen }: CollectionProps) {
  const DirectionArrow = locale === 'ar' ? ArrowLeft : ArrowRight;
  const reduced = useReducedMotion();
  const { ref, act } = useActSequence<HTMLDivElement>(products.length);
  const active = products[act] ?? products[0];

  return (
    <section id="collection" className="scroll-mt-8 bg-pearl">
      <div className="mx-auto max-w-[1500px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-36">
        <ScrollReveal>
          <div className="max-w-[46rem]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <h2 className="display-heading text-[clamp(3.6rem,5vw,5.8rem)] leading-[1.05] text-date">
              {localize(copy.collection.title, locale)}
            </h2>
            <span className="my-6 block h-px w-14 bg-copper" aria-hidden="true" />
            <p className="text-base leading-8 text-copper-deep">{localize(copy.collection.secondary, locale)}</p>
            <p className="mt-5 max-w-[38rem] text-sm leading-7 text-shade">{localize(copy.collection.body, locale)}</p>
          </div>
        </ScrollReveal>
      </div>

      {/* Reduced motion: no pinning, no sequence — the same three panels, stacked. */}
      {reduced ? (
        <div id="collection-grid">
          {products.map((product, index) => (
            <Panel
              key={product.id}
              product={product}
              index={index}
              locale={locale}
              onOpen={onProductOpen}
              DirectionArrow={DirectionArrow}
            />
          ))}
        </div>
      ) : (
        <div
          id="collection-grid"
          ref={ref}
          style={{ height: `${products.length * 100}svh` }}
        >
          <div
            className="act-stage sticky top-0 flex h-svh items-center overflow-hidden transition-colors duration-700 ease-quiet"
            style={{ backgroundColor: ground(active) }}
          >
            {/* No washed-out copy of the photograph behind the type. It would
                duplicate the image already shown beside it, and — the reason it
                came out — a 34% bright image over the ground lifts the backdrop
                far enough that pearl text drops under AA on saffron. The pure
                field is both safer and the stronger statement. */}
            <div className="relative mx-auto grid w-full max-w-[1500px] gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10">
              <figure className="order-2 m-0 lg:order-none">
                <span className="relative block aspect-[4/5] max-h-[52svh] overflow-hidden lg:max-h-[70svh]">
                  {products.map((product, index) => (
                    <img
                      key={product.id}
                      src={product.image}
                      alt={localize(product.imageAlt, locale)}
                      className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-quiet"
                      style={{
                        objectPosition: product.imagePosition,
                        opacity: index === act ? 1 : 0,
                        transform: index === act ? 'scale(1)' : 'scale(1.05)',
                      }}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  ))}
                </span>
              </figure>

              <div className="order-1 text-pearl lg:order-none" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                {/* Keyed on the act so the name re-runs its reveal each time. */}
                <div key={active.id}>
                  <p className="font-latin text-xs tracking-[0.24em] text-pearl/70">
                    {locale === 'ar' ? INDEX_LABEL[act] : `0${act + 1}`} <span className="px-2">/</span> {locale === 'ar' ? INDEX_LABEL[products.length - 1] : `0${products.length}`}
                  </p>

                  <h3 className="act-rise display-heading mt-4 text-[clamp(3.4rem,9vw,7rem)] leading-[0.95]">
                    {localize(active.name, locale)}
                  </h3>
                  <p
                    className="act-rise font-latin text-sm uppercase tracking-[0.3em] text-pearl/75"
                    style={{ animationDelay: '90ms' }}
                    lang={locale === 'ar' ? 'en' : 'ar'}
                  >
                    {localize(active.name, locale === 'ar' ? 'en' : 'ar')}
                  </p>

                  <p className="act-desc act-rise mt-6 max-w-[34rem] text-base leading-8 text-pearl/85" style={{ animationDelay: '150ms' }}>
                    {localize(active.description, locale)}
                  </p>

                  <p className="act-rise mt-6 text-lg tabular-nums" style={{ animationDelay: '210ms' }}>
                    {formatOmr(active.priceOmr, locale)}
                  </p>

                  <button
                    type="button"
                    className="act-rise button-outline-light mt-8 min-h-12 gap-4 px-7 py-3"
                    style={{ animationDelay: '270ms' }}
                    onClick={() => onProductOpen(active)}
                  >
                    <span>{localize(copy.collection.productAction, locale)}</span>
                    <DirectionArrow aria-hidden="true" size={17} strokeWidth={1.25} />
                  </button>
                </div>

                <ol className="mt-10 flex list-none gap-3 p-0" aria-hidden="true">
                  {products.map((product, index) => (
                    <li
                      key={product.id}
                      className="h-px flex-1 origin-left bg-pearl/25 transition-transform duration-700 ease-quiet"
                      style={{ transform: index <= act ? 'scaleY(3)' : 'scaleY(1)' }}
                    />
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Always present, never inside the pinned stage: the sequence is a way
          of showing the collection, not the only way to reach it. */}
      <div className="mx-auto max-w-[1500px] px-4 pb-20 pt-14 sm:px-6 lg:px-10">
        <ul className="m-0 flex list-none flex-wrap gap-x-8 gap-y-3 p-0" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          {products.map((product) => (
            <li key={product.id}>
              <button
                type="button"
                className="footer-link inline-flex items-center gap-3 text-sm text-date hover:text-pomegranate"
                onClick={() => onProductOpen(product)}
              >
                <span className="h-2 w-2 shrink-0" style={{ backgroundColor: product.colorHex }} aria-hidden="true" />
                {localize(product.name, locale)}
                <span className="tabular-nums text-shade">{formatOmr(product.priceOmr, locale)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

interface PanelProps {
  readonly product: Product;
  readonly index: number;
  readonly locale: Locale;
  readonly onOpen: (product: Product) => void;
  readonly DirectionArrow: typeof ArrowLeft;
}

/** The reduced-motion form of one act: the same panel, without the sequence. */
function Panel({ product, index, locale, onOpen, DirectionArrow }: PanelProps) {
  return (
    <div style={{ backgroundColor: ground(product) }}>
      <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10">
        <figure className="order-2 m-0 lg:order-none">
          <span className="relative block aspect-[4/5] overflow-hidden">
            <img
              src={product.image}
              alt={localize(product.imageAlt, locale)}
              className="h-full w-full object-cover"
              style={{ objectPosition: product.imagePosition }}
              loading="lazy"
              decoding="async"
            />
          </span>
        </figure>
        <div className="order-1 text-pearl lg:order-none" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <p className="font-latin text-xs tracking-[0.24em] text-pearl/70">{`0${index + 1}`}</p>
          <h3 className="display-heading mt-4 text-[clamp(3rem,7vw,5.5rem)] leading-[0.95]">
            {localize(product.name, locale)}
          </h3>
          <p className="mt-6 max-w-[34rem] text-base leading-8 text-pearl/85">{localize(product.description, locale)}</p>
          <p className="mt-6 text-lg tabular-nums">{formatOmr(product.priceOmr, locale)}</p>
          <button type="button" className="button-outline-light mt-8 min-h-12 gap-4 px-7 py-3" onClick={() => onOpen(product)}>
            <span>{localize(copy.collection.productAction, locale)}</span>
            <DirectionArrow aria-hidden="true" size={17} strokeWidth={1.25} />
          </button>
        </div>
      </div>
    </div>
  );
}
