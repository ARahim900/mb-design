import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { copy, localize } from '../../data/content';
import type { Locale, LocalizedText } from '../../types';

const controlClass =
  'mt-2 min-h-12 w-full border bg-transparent px-4 py-3 text-base text-ink outline-none transition-colors focus:border-copper focus:shadow-[inset_0_0_0_1px_theme(colors.copper)]';

function borderClass(error: LocalizedText | undefined) {
  return error ? 'border-pomegranate' : 'border-hair';
}

interface FieldShellProps {
  readonly id: string;
  readonly label: string;
  readonly locale: Locale;
  readonly error?: LocalizedText;
  readonly hint?: string;
  readonly optional?: boolean;
  readonly children: ReactNode;
}

function FieldShell({ id, label, locale, error, hint, optional, children }: FieldShellProps) {
  return (
    <div className="text-sm text-shade">
      <label htmlFor={id} className="block">
        {label}
        {optional && <span className="ms-1 text-xs">{localize(copy.checkout.optional, locale)}</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-pomegranate">
          {localize(error, locale)}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, error: LocalizedText | undefined, hint: string | undefined) {
  if (error) return `${id}-error`;
  return hint ? `${id}-hint` : undefined;
}

interface TextFieldProps {
  readonly id: string;
  readonly name: string;
  readonly label: string;
  readonly locale: Locale;
  readonly value: string;
  readonly autoComplete: string;
  readonly error?: LocalizedText;
  readonly optional?: boolean;
  readonly onChange: (value: string) => void;
}

export function TextField({ id, name, label, locale, value, autoComplete, error, optional, onChange }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} locale={locale} error={error} optional={optional}>
      <input
        id={id}
        name={name}
        value={value}
        autoComplete={autoComplete}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, undefined)}
        className={`${controlClass} ${borderClass(error)}`}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  );
}

interface SelectOption {
  readonly value: string;
  readonly label: string;
}

interface SelectFieldProps {
  readonly id: string;
  readonly name: string;
  readonly label: string;
  readonly locale: Locale;
  readonly value: string;
  readonly placeholder: string;
  readonly options: readonly SelectOption[];
  readonly autoComplete: string;
  readonly error?: LocalizedText;
  readonly disabled?: boolean;
  readonly onChange: (value: string) => void;
}

export function SelectField({
  id,
  name,
  label,
  locale,
  value,
  placeholder,
  options,
  autoComplete,
  error,
  disabled,
  onChange,
}: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} locale={locale} error={error}>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          autoComplete={autoComplete}
          required
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, undefined)}
          className={`${controlClass} ${borderClass(error)} cursor-pointer appearance-none rounded-none pe-11 disabled:cursor-not-allowed disabled:bg-sand/40 disabled:text-shade`}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          size={17}
          strokeWidth={1.4}
          className="pointer-events-none absolute end-4 top-1/2 mt-1 -translate-y-1/2 text-shade"
        />
      </div>
    </FieldShell>
  );
}

interface MobileFieldProps {
  readonly id: string;
  readonly label: string;
  readonly hint: string;
  readonly locale: Locale;
  readonly value: string;
  readonly error?: LocalizedText;
  readonly onChange: (value: string) => void;
}

export function MobileField({ id, label, hint, locale, value, error, onChange }: MobileFieldProps) {
  return (
    <FieldShell id={id} label={label} locale={locale} error={error} hint={hint}>
      {/* Always left-to-right: a phone number reads the same in Arabic, and the fixed prefix
          must sit before the digits. */}
      <div
        dir="ltr"
        className={`mt-2 flex min-h-12 items-stretch border transition-colors focus-within:border-copper focus-within:shadow-[inset_0_0_0_1px_theme(colors.copper)] ${borderClass(error)}`}
      >
        <span aria-hidden="true" className="flex items-center border-e border-hair px-3 text-base tabular-nums text-shade">
          +968
        </span>
        <input
          id={id}
          name="mobile"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={14}
          value={value}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base tabular-nums tracking-wide text-ink outline-none"
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </FieldShell>
  );
}
