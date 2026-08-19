import { copy, localize } from '../data/content';
import type { Locale } from '../types';

interface PreviewNoticeProps {
  readonly locale: Locale;
}

export function PreviewNotice({ locale }: PreviewNoticeProps) {
  return (
    <section id="brand-preview" className="bg-sand px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-3 border-s border-copper ps-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
        <h2 className="shrink-0 text-xs font-medium uppercase tracking-[0.15em] text-copper-deep">
          {localize(copy.preview.title, locale)}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-shade">{localize(copy.preview.body, locale)}</p>
      </div>
    </section>
  );
}
