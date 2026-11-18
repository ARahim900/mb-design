import { X } from 'lucide-react';
import { type MouseEvent, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { PolicyPage } from '../data/brand';
import { copy, localize } from '../data/content';
import { useModalScrollLock } from '../hooks/useModalScrollLock';
import type { Locale } from '../types';

interface PolicyDialogProps {
  readonly locale: Locale;
  readonly policy: PolicyPage | null;
  readonly onClose: () => void;
}

export function PolicyDialog({ locale, policy, onClose }: PolicyDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = 'policy-dialog-title';

  useModalScrollLock(policy !== null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (policy && !dialog.open) dialog.showModal();
    else if (!policy && dialog.open) dialog.close();
  }, [policy]);

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) onClose();
  };

  const paragraphs = policy ? localize(policy.body, locale).split(/\n{2,}/) : [];

  // Portalled to <body> for the same reason as the product dialog: a transformed ancestor
  // would otherwise become the containing block and unpin the sheet from the viewport.
  return createPortal(
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none overflow-hidden bg-pearl p-0 text-ink shadow-[0_24px_90px_rgba(28,20,23,0.35)] backdrop:bg-date/80 sm:m-auto sm:h-auto sm:max-h-[min(85svh,760px)] sm:w-[min(92vw,640px)]"
      aria-labelledby={policy ? titleId : undefined}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      {policy && (
        <div className="flex h-full max-h-[inherit] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-hair px-safe pb-4 pt-[calc(1rem+env(safe-area-inset-top))] [--gutter:1.25rem] sm:pt-4 sm:[--gutter:2rem]">
            <h2 id={titleId} className="font-display text-3xl font-normal leading-tight text-date">
              {localize(policy.title, locale)}
            </h2>
            <button
              type="button"
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-copper/70 text-date transition-colors hover:bg-date hover:text-pearl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
              onClick={onClose}
              aria-label={localize(copy.footer.closePolicy, locale)}
            >
              <X aria-hidden="true" size={22} strokeWidth={1.25} />
            </button>
          </div>
          <div className="overflow-y-auto overscroll-contain px-safe pb-[calc(2rem+env(safe-area-inset-bottom))] pt-6 [--gutter:1.25rem] sm:pb-8 sm:[--gutter:2rem]">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-4 max-w-prose text-base leading-8 text-ink/80 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </dialog>,
    document.body,
  );
}
