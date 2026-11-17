import { useId } from 'react';
import { copy, localize } from '../data/content';
import type { FitPreference, Locale } from '../types';

export interface CustomFitDraft {
  readonly lengthCm: string;
  readonly sleeveCm: string;
  readonly fit: FitPreference;
}

interface CustomFitPanelProps {
  readonly locale: Locale;
  readonly value: CustomFitDraft;
  readonly hasError: boolean;
  readonly onChange: (value: CustomFitDraft) => void;
}

interface MeasurementGuideProps {
  readonly kind: 'length' | 'sleeve' | 'fit';
}

// A text field rather than type="number": the iOS decimal pad follows the device region, so an
// Arabic-region phone types Arabic-Indic digits and "٫" or ",", which a number input reports as
// an empty value. Fold them back to ASCII digits and a single "." here instead.
function normaliseDecimal(raw: string): string {
  const ascii = raw
    .replace(/[\u0660-\u0669]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[\u066B,]/g, '.')
    .replace(/[^0-9.]/g, '');
  const [whole, ...fraction] = ascii.split('.');
  return fraction.length > 0 ? `${whole}.${fraction.join('')}` : whole;
}

function MeasurementGuide({ kind }: MeasurementGuideProps) {
  return (
    <svg viewBox="0 0 76 100" className="h-24 w-[72px] text-date" aria-hidden="true">
      <path
        d="M31 13c0-5 3-8 7-8s7 3 7 8c0 3-2 6-4 7l8 5 16 25-8 5-8-13 5 49H22l5-49-8 13-8-5 16-25 8-5c-2-1-4-4-4-7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      {kind === 'length' && (
        <g className="text-copper-deep" fill="currentColor" stroke="currentColor">
          <path d="M57 21v67" strokeWidth="1.5" />
          <path d="m54 25 3-5 3 5M54 84l3 5 3-5" fill="none" strokeWidth="1.5" />
        </g>
      )}
      {kind === 'sleeve' && (
        <g className="text-copper-deep" fill="currentColor" stroke="currentColor">
          <path d="m29 27-16 24" strokeWidth="1.5" />
          <path d="m26 28 4-2-1 5M13 47l-1 5 5-2" fill="none" strokeWidth="1.5" />
        </g>
      )}
      {kind === 'fit' && (
        <g className="text-copper-deep" fill="currentColor" stroke="currentColor">
          <path d="M26 57h24" strokeWidth="1.5" />
          <path d="m30 54-5 3 5 3M46 54l5 3-5 3" fill="none" strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
}

export function CustomFitPanel({ locale, value, hasError, onChange }: CustomFitPanelProps) {
  const lengthId = useId();
  const sleeveId = useId();
  const fitName = useId();
  const customCopy = copy.product.customFit;

  return (
    <div className="border border-copper/55 bg-sand/35 px-4 py-5 sm:px-5">
      <h3 className="font-display text-2xl text-date">{localize(customCopy.title, locale)}</h3>
      <p className="mt-2 text-sm leading-6 text-shade">{localize(customCopy.intro, locale)}</p>

      <div className="mt-5 divide-y divide-copper/30 border-y border-copper/30">
        <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4 py-4">
          <MeasurementGuide kind="length" />
          <div className="min-w-0">
            <label htmlFor={lengthId} className="text-sm text-date">
              {localize(customCopy.length, locale)}
            </label>
            <p className="mt-1 text-xs leading-5 text-shade">{localize(customCopy.lengthHelp, locale)}</p>
            <div className="mt-3 flex max-w-[180px] items-stretch border border-hair bg-pearl focus-within:border-copper-deep">
              <input
                id={lengthId}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={value.lengthCm}
                onChange={(event) => onChange({ ...value, lengthCm: normaliseDecimal(event.target.value) })}
                className="min-h-11 min-w-0 flex-1 appearance-none bg-transparent px-3 text-base tabular-nums lg:text-sm outline-none"
                aria-describedby={`${lengthId}-help`}
              />
              <span id={`${lengthId}-help`} className="flex items-center border-s border-hair px-3 text-xs text-shade">
                {localize(customCopy.unit, locale)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4 py-4">
          <MeasurementGuide kind="sleeve" />
          <div className="min-w-0">
            <label htmlFor={sleeveId} className="text-sm text-date">
              {localize(customCopy.sleeve, locale)}
            </label>
            <p className="mt-1 text-xs leading-5 text-shade">{localize(customCopy.sleeveHelp, locale)}</p>
            <div className="mt-3 flex max-w-[180px] items-stretch border border-hair bg-pearl focus-within:border-copper-deep">
              <input
                id={sleeveId}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={value.sleeveCm}
                onChange={(event) => onChange({ ...value, sleeveCm: normaliseDecimal(event.target.value) })}
                className="min-h-11 min-w-0 flex-1 appearance-none bg-transparent px-3 text-base tabular-nums lg:text-sm outline-none"
                aria-describedby={`${sleeveId}-help`}
              />
              <span id={`${sleeveId}-help`} className="flex items-center border-s border-hair px-3 text-xs text-shade">
                {localize(customCopy.unit, locale)}
              </span>
            </div>
          </div>
        </div>

        <fieldset className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4 py-4">
          <MeasurementGuide kind="fit" />
          <div className="min-w-0">
            <legend className="text-sm text-date">{localize(customCopy.bodyFit, locale)}</legend>
            <p className="mt-1 text-xs leading-5 text-shade">{localize(customCopy.bodyFitHelp, locale)}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(['standard', 'relaxed'] as const).map((fit) => (
                <label
                  key={fit}
                  className={`flex min-h-11 cursor-pointer items-center justify-center border px-3 text-center text-sm transition-colors ${value.fit === fit ? 'border-date bg-date text-pearl' : 'border-hair bg-pearl text-date hover:border-copper'}`}
                >
                  <input
                    type="radio"
                    name={fitName}
                    value={fit}
                    checked={value.fit === fit}
                    onChange={() => onChange({ ...value, fit })}
                    className="sr-only"
                  />
                  {localize(customCopy[fit], locale)}
                </label>
              ))}
            </div>
          </div>
        </fieldset>
      </div>

      {hasError && (
        <p id="custom-fit-error" className="mt-4 text-sm text-pomegranate" role="alert">
          {localize(customCopy.addOne, locale)}
        </p>
      )}
    </div>
  );
}
