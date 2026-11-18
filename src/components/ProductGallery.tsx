import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type KeyboardEvent, type RefObject, useCallback, useRef, useState } from 'react';
import { copy, fillTemplate, localize } from '../data/content';
import type { GalleryImage, Locale, Product } from '../types';

interface ProductGalleryProps {
  readonly locale: Locale;
  readonly product: Product;
}

interface GallerySlideProps {
  readonly locale: Locale;
  readonly image: GalleryImage;
  readonly index: number;
  readonly count: number;
}

const ARROW_CLASS =
  'absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-copper/70 bg-pearl/95 text-date transition-colors hover:bg-date hover:text-pearl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper disabled:pointer-events-none disabled:opacity-0 sm:flex';

function galleryImages(product: Product): readonly GalleryImage[] {
  if (product.gallery && product.gallery.length > 0) return product.gallery;
  return [{ src: product.image, alt: product.imageAlt, shot: 'front', position: product.imagePosition }];
}

function useActiveSlide(trackRef: RefObject<HTMLDivElement>, count: number) {
  const [active, setActive] = useState(0);

  // scrollLeft runs negative in a right-to-left track, so distances use its absolute value. The
  // last slide is matched at the end of the track, where a slide narrower than the track (a
  // tablet shows the next photo peeking in) can never reach the start edge.
  const syncActive = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return;
    const distance = Math.abs(track.scrollLeft);
    if (track.scrollWidth - track.clientWidth - distance < 2) {
      setActive(count - 1);
      return;
    }
    const first = track.children[0].getBoundingClientRect();
    const second = track.children[1].getBoundingClientRect();
    const step = Math.abs(second.left - first.left) || first.width;
    setActive(Math.min(count - 1, Math.round(distance / step)));
  }, [trackRef, count]);

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const slide = track?.children[index];
      if (!track || !slide) return;
      const trackRect = track.getBoundingClientRect();
      const slideRect = slide.getBoundingClientRect();
      const rtl = getComputedStyle(track).direction === 'rtl';
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollBy({
        left: rtl ? slideRect.right - trackRect.right : slideRect.left - trackRect.left,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    },
    [trackRef],
  );

  return { active, syncActive, goTo };
}

function GallerySlide({ locale, image, index, count }: GallerySlideProps) {
  const label = fillTemplate(localize(copy.product.gallery.slide, locale), {
    index: String(index + 1),
    count: String(count),
  });

  return (
    <div
      className="relative aspect-[4/5] w-[min(100%,calc(78svh*0.8))] shrink-0 snap-start overflow-hidden short:aspect-auto short:h-full short:w-full lg:aspect-auto lg:h-full lg:w-full"
      role={count > 1 ? 'group' : undefined}
      aria-roledescription={count > 1 ? localize(copy.product.gallery.slideRole, locale) : undefined}
      aria-label={count > 1 ? label : undefined}
    >
      {/* The box holds the 4:5 shape before the photo arrives, so nothing shifts as it loads.
          Beside the copy the column is wider than the photo, so it is shown whole there. */}
      <img
        src={image.src}
        alt={localize(image.alt, locale)}
        className="absolute inset-0 h-full w-full object-cover short:object-contain lg:object-contain"
        style={{ objectPosition: image.position ?? '50% 40%' }}
        loading={index === 0 ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
      />
    </div>
  );
}

export function ProductGallery({ locale, product }: ProductGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const images = galleryImages(product);
  const count = images.length;
  const { active, syncActive, goTo } = useActiveSlide(trackRef, count);
  const rtl = locale === 'ar';
  const galleryCopy = copy.product.gallery;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const forward = (event.key === 'ArrowRight') !== rtl;
    goTo(Math.max(0, Math.min(count - 1, active + (forward ? 1 : -1))));
  };

  return (
    <div
      className="relative z-20 bg-sand short:flex short:min-h-0 short:flex-col lg:flex lg:min-h-0 lg:flex-col"
      dir={rtl ? 'rtl' : 'ltr'}
      role={count > 1 ? 'region' : undefined}
      aria-roledescription={count > 1 ? localize(copy.product.gallery.carouselRole, locale) : undefined}
      aria-label={count > 1 ? localize(galleryCopy.label, locale) : undefined}
    >
      <div className="relative short:min-h-0 short:flex-1 lg:min-h-0 lg:flex-1">
        <div
          ref={trackRef}
          className={`flex snap-x snap-mandatory gap-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-copper short:h-full lg:h-full [&::-webkit-scrollbar]:hidden ${count > 1 ? '' : 'justify-center'}`}
          tabIndex={count > 1 ? 0 : undefined}
          onScroll={count > 1 ? syncActive : undefined}
          onKeyDown={count > 1 ? handleKeyDown : undefined}
        >
          {images.map((image, index) => (
            <GallerySlide key={image.src} locale={locale} image={image} index={index} count={count} />
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              className={`${ARROW_CLASS} start-3`}
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label={localize(galleryCopy.previous, locale)}
            >
              <ChevronLeft aria-hidden="true" size={22} strokeWidth={1.25} className="rtl:rotate-180" />
            </button>
            <button
              type="button"
              className={`${ARROW_CLASS} end-3`}
              onClick={() => goTo(active + 1)}
              disabled={active === count - 1}
              aria-label={localize(galleryCopy.next, locale)}
            >
              <ChevronRight aria-hidden="true" size={22} strokeWidth={1.25} className="rtl:rotate-180" />
            </button>
            <p
              className="pointer-events-none absolute inset-x-0 bottom-3 mx-auto w-fit border border-copper/45 bg-pearl/95 px-3 py-1 text-xs tabular-nums text-date"
              dir="ltr"
              aria-hidden="true"
            >
              {active + 1} / {count}
            </p>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="hidden shrink-0 justify-center gap-2 px-4 py-3 lg:flex">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              className={`relative h-20 w-16 overflow-hidden border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${active === index ? 'border-date' : 'border-transparent hover:border-copper'}`}
              onClick={() => goTo(index)}
              aria-current={active === index || undefined}
              aria-label={fillTemplate(localize(galleryCopy.show, locale), { index: String(index + 1) })}
            >
              <img
                src={image.src}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: image.position ?? '50% 40%' }}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
