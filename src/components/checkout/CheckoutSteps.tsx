import { Check } from 'lucide-react';
import { copy, formatNumber, localize } from '../../data/content';
import type { Locale } from '../../types';
import type { CheckoutStep } from './order';

interface CheckoutStepsProps {
  readonly locale: Locale;
  readonly current: CheckoutStep;
}

const steps: readonly CheckoutStep[] = ['bag', 'details', 'confirm'];

export function CheckoutSteps({ locale, current }: CheckoutStepsProps) {
  const currentIndex = steps.indexOf(current);
  const stepCopy = copy.cart.steps;

  return (
    <nav
      aria-label={localize(stepCopy.label, locale)}
      className="shrink-0 border-b border-hair bg-pearl px-safe py-3 [--gutter:1rem] sm:ps-[var(--gutter)] sm:[--gutter:1.75rem] short:py-2"
    >
      <ol className="flex items-center gap-2 text-xs">
        {steps.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <li key={step} className="flex min-w-0 flex-1 items-center gap-2" aria-current={active ? 'step' : undefined}>
              <span
                aria-hidden="true"
                className={`flex h-6 w-6 shrink-0 items-center justify-center border tabular-nums ${
                  active
                    ? 'border-date bg-date text-pearl'
                    : done
                      ? 'border-copper text-copper-deep'
                      : 'border-hair text-shade'
                }`}
              >
                {done ? <Check size={13} strokeWidth={2} /> : formatNumber(index + 1, locale)}
              </span>
              <span className={`truncate ${active ? 'font-medium text-date' : 'text-shade'}`}>
                {localize(stepCopy[step], locale)}
              </span>
              {index < steps.length - 1 && <span aria-hidden="true" className="h-px min-w-3 flex-1 bg-hair" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
