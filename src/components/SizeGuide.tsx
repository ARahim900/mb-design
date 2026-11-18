import { brand } from '../data/brand';
import { copy, localize } from '../data/content';
import type { Locale } from '../types';

interface SizeGuideToggleProps {
  readonly locale: Locale;
  readonly open: boolean;
  readonly controls: string;
  readonly onToggle: () => void;
}

interface SizeGuideProps {
  readonly locale: Locale;
  readonly id: string;
}

/** The guide exists only once MB Design has supplied a size chart. */
export const hasSizeGuide = brand.sizeChart.length > 0;

export function SizeGuideToggle({ locale, open, controls, onToggle }: SizeGuideToggleProps) {
  return (
    <button
      type="button"
      className="-my-3 inline-flex min-h-11 items-center px-1 text-sm text-date underline decoration-copper underline-offset-4 transition-colors hover:text-copper-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
      aria-expanded={open}
      aria-controls={controls}
      onClick={onToggle}
    >
      {localize(copy.product.sizeGuide.open, locale)}
    </button>
  );
}

export function SizeGuide({ locale, id }: SizeGuideProps) {
  const guideCopy = copy.product.sizeGuide;

  return (
    <div id={id} className="mt-4 border border-copper/45 bg-sand/35 px-4 py-4 sm:px-5">
      <table className="w-full text-sm tabular-nums">
        <caption className="pb-3 text-start font-display text-xl text-date">{localize(guideCopy.title, locale)}</caption>
        <thead>
          <tr className="border-b border-copper/40 text-xs text-shade">
            <th scope="col" className="py-2 pe-3 text-start font-normal">{localize(guideCopy.size, locale)}</th>
            <th scope="col" className="py-2 pe-3 text-start font-normal">{localize(guideCopy.height, locale)}</th>
            <th scope="col" className="py-2 text-start font-normal">{localize(guideCopy.length, locale)}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-copper/25">
          {brand.sizeChart.map((row) => (
            <tr key={row.size}>
              <th scope="row" className="py-2 pe-3 text-start font-normal text-date">{row.size}</th>
              {/* Isolated left to right, or a range such as "155–160" reads backwards in Arabic. */}
              <td className="py-2 pe-3 text-ink">
                <bdi dir="ltr">{row.heightCm}</bdi>
              </td>
              <td className="py-2 text-ink">
                <bdi dir="ltr">{row.lengthCm}</bdi>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs leading-5 text-shade">{localize(guideCopy.howTo, locale)}</p>
    </div>
  );
}
