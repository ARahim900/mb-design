import { useId, useState } from 'react';
import { copy, fillTemplate, localize } from '../data/content';
import type { CustomFit, FitPreference, Locale } from '../types';

export interface CustomFitDraft {
  readonly lengthCm: string;
  readonly sleeveCm: string;
  readonly fit: FitPreference;
}

export type MeasurementField = 'length' | 'sleeve';

interface CustomFitPanelProps {
  readonly locale: Locale;
  readonly value: CustomFitDraft;
  /** Set after a failed Add to bag, so untouched fields with a bad value also show their error. */
  readonly showErrors: boolean;
  readonly onChange: (value: CustomFitDraft) => void;
}

interface MeasurementGuideProps {
  readonly kind: 'length' | 'sleeve' | 'fit';
}

interface MeasurementInputProps {
  readonly locale: Locale;
  readonly field: MeasurementField;
  readonly value: string;
  readonly showError: boolean;
  readonly onChange: (value: string) => void;
  readonly onBlur: () => void;
}

// Sanity bounds for a typed measurement, so a slip such as "15" for "150" is caught before the
// order. They are not a size promise: the atelier still confirms every adjustment.
const MEASUREMENT_LIMITS: Readonly<Record<MeasurementField, { readonly min: number; readonly max: number }>> = {
  length: { min: 100, max: 175 },
  sleeve: { min: 40, max: 90 },
};

const MEASUREMENT_KEY: Readonly<Record<MeasurementField, 'lengthCm' | 'sleeveCm'>> = {
  length: 'lengthCm',
  sleeve: 'sleeveCm',
};

// A text field rather than type="number": the iOS decimal pad follows the device region, so an
// Arabic-region phone types Arabic-Indic digits and "٫" or ",", which a number input reports as
// an empty value. Fold them back to ASCII digits and a single "." here instead.
function normaliseDecimal(raw: string): string {
  const ascii = raw
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[٫,]/g, '.')
    .replace(/[^0-9.]/g, '');
  const [whole, ...fraction] = ascii.split('.');
  return fraction.length > 0 ? `${whole}.${fraction.join('')}` : whole;
}

function isMeasurementInvalid(field: MeasurementField, raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  const value = Number(trimmed);
  const { min, max } = MEASUREMENT_LIMITS[field];
  return !Number.isFinite(value) || value < min || value > max;
}

/** The first field holding a value that cannot be ordered, or null when the draft is fine. */
export function firstInvalidMeasurement(draft: CustomFitDraft): MeasurementField | null {
  if (isMeasurementInvalid('length', draft.lengthCm)) return 'length';
  if (isMeasurementInvalid('sleeve', draft.sleeveCm)) return 'sleeve';
  return null;
}

/** The adjustments to order, or undefined when the panel is open but left at its defaults. */
export function toCustomFit(draft: CustomFitDraft): CustomFit | undefined {
  const lengthCm = draft.lengthCm.trim();
  const sleeveCm = draft.sleeveCm.trim();
  if (!lengthCm && !sleeveCm && draft.fit === 'standard') return undefined;

  return {
    ...(lengthCm ? { lengthCm } : {}),
    ...(sleeveCm ? { sleeveCm } : {}),
    fit: draft.fit,
  };
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

function MeasurementInput({ locale, field, value, showError, onChange, onBlur }: MeasurementInputProps) {
  const inputId = useId();
  const customCopy = copy.product.customFit;
  const invalid = showError && isMeasurementInvalid(field, value);
  const unitId = `${inputId}-unit`;
  const errorId = `${inputId}-error`;
  const { min, max } = MEASUREMENT_LIMITS[field];

  return (
    <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4 py-4">
      <MeasurementGuide kind={field} />
      <div className="min-w-0">
        <label htmlFor={inputId} className="text-sm text-date">
          {localize(field === 'length' ? customCopy.length : customCopy.sleeve, locale)}
        </label>
        <p className="mt-1 text-xs leading-5 text-shade">
          {localize(field === 'length' ? customCopy.lengthHelp : customCopy.sleeveHelp, locale)}
        </p>
        <div
          className={`mt-3 flex max-w-[180px] items-stretch border bg-pearl ${invalid ? 'border-pomegranate' : 'border-hair focus-within:border-copper-deep'}`}
        >
          <input
            id={inputId}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            data-fit-field={field}
            value={value}
            onChange={(event) => onChange(normaliseDecimal(event.target.value))}
            onBlur={onBlur}
            className="min-h-11 min-w-0 flex-1 appearance-none bg-transparent px-3 text-base tabular-nums outline-none lg:text-sm"
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? `${unitId} ${errorId}` : unitId}
          />
          <span id={unitId} className="flex items-center border-s border-hair px-3 text-xs text-shade">
            {localize(customCopy.unit, locale)}
          </span>
        </div>
        {invalid && (
          <p id={errorId} className="mt-2 text-xs leading-5 text-pomegranate" role="alert">
            {fillTemplate(localize(customCopy.outOfRange, locale), { min: String(min), max: String(max) })}
          </p>
        )}
      </div>
    </div>
  );
}

export function CustomFitPanel({ locale, value, showErrors, onChange }: CustomFitPanelProps) {
  const fitName = useId();
  const [blurred, setBlurred] = useState<Readonly<Record<MeasurementField, boolean>>>({ length: false, sleeve: false });
  const customCopy = copy.product.customFit;

  // A field is only judged once the customer has typed in it and moved on, so an empty panel or a
  // half-typed number never shows an error.
  const handleBlur = (field: MeasurementField) => {
    if (value[MEASUREMENT_KEY[field]].trim()) setBlurred((current) => ({ ...current, [field]: true }));
  };

  return (
    <div className="border border-copper/55 bg-sand/35 px-4 py-5 sm:px-5">
      <h3 className="font-display text-2xl text-date">{localize(customCopy.title, locale)}</h3>
      <p className="mt-2 text-sm leading-6 text-shade">{localize(customCopy.intro, locale)}</p>

      <div className="mt-5 divide-y divide-copper/30 border-y border-copper/30">
        {(['length', 'sleeve'] as const).map((field) => (
          <MeasurementInput
            key={field}
            locale={locale}
            field={field}
            value={value[MEASUREMENT_KEY[field]]}
            showError={showErrors || blurred[field]}
            onChange={(next) => onChange({ ...value, [MEASUREMENT_KEY[field]]: next })}
            onBlur={() => handleBlur(field)}
          />
        ))}

        <fieldset className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4 py-4">
          <MeasurementGuide kind="fit" />
          <div className="min-w-0">
            <legend className="text-sm text-date">{localize(customCopy.bodyFit, locale)}</legend>
            <p className="mt-1 text-xs leading-5 text-shade">{localize(customCopy.bodyFitHelp, locale)}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(['standard', 'relaxed'] as const).map((fit) => (
                <label
                  key={fit}
                  className={`flex min-h-11 cursor-pointer items-center justify-center border px-3 text-center text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-copper ${value.fit === fit ? 'border-date bg-date text-pearl' : 'border-hair bg-pearl text-date hover:border-copper'}`}
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
    </div>
  );
}
