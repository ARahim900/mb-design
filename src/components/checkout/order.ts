import { brand } from '../../data/brand';
import { copy, formatNumber, formatOmr, localize } from '../../data/content';
import { findGovernorate, findWilayat } from '../../data/oman';
import type { CartLine, Locale, LocalizedText } from '../../types';

export type CheckoutStep = 'bag' | 'details' | 'confirm';

export interface CheckoutDetails {
  readonly name: string;
  readonly mobile: string;
  readonly governorate: string;
  readonly wilayat: string;
  readonly area: string;
  readonly street: string;
  readonly house: string;
}

export type CheckoutField = keyof CheckoutDetails;

export type CheckoutErrors = Partial<Record<CheckoutField, LocalizedText>>;

export interface OrderTotals {
  readonly subtotal: number;
  /** null while the fee is not confirmed, so it is never added to the total. */
  readonly deliveryFee: number | null;
  readonly total: number;
}

export const emptyDetails: CheckoutDetails = {
  name: '',
  mobile: '',
  governorate: '',
  wilayat: '',
  area: '',
  street: '',
  house: '',
};

/** Field order on screen, so the first invalid one can take focus. */
export const fieldOrder: readonly CheckoutField[] = [
  'name',
  'mobile',
  'governorate',
  'wilayat',
  'area',
  'street',
  'house',
];

export function getCustomFitSummary(line: CartLine, locale: Locale): string {
  if (!line.customFit) return '';

  const customCopy = copy.product.customFit;
  const unit = localize(customCopy.unit, locale);
  const details = [
    line.customFit.lengthCm
      ? `${localize(customCopy.length, locale)}: ${line.customFit.lengthCm} ${unit}`
      : null,
    line.customFit.sleeveCm
      ? `${localize(customCopy.sleeve, locale)}: ${line.customFit.sleeveCm} ${unit}`
      : null,
    line.customFit.fit === 'relaxed' ? localize(customCopy.relaxed, locale) : null,
  ];

  return details.filter((detail): detail is string => detail !== null).join(' · ');
}

export function getOrderTotals(cart: readonly CartLine[]): OrderTotals {
  const subtotal = cart.reduce((sum, line) => sum + line.product.priceOmr * line.quantity, 0);
  const deliveryFee = typeof brand.deliveryFeeOmr === 'number' ? brand.deliveryFeeOmr : null;
  return { subtotal, deliveryFee, total: subtotal + (deliveryFee ?? 0) };
}

export function getDeliveryLabel(deliveryFee: number | null, locale: Locale): string {
  if (deliveryFee === null) return localize(copy.checkout.deliveryPending, locale);
  if (deliveryFee === 0) return localize(copy.checkout.deliveryFree, locale);
  return formatOmr(deliveryFee, locale);
}

export function getTotalLabel(deliveryFee: number | null, locale: Locale): string {
  return localize(deliveryFee === null ? copy.checkout.totalBeforeDelivery : copy.checkout.total, locale);
}

/**
 * Keeps only the 8 local digits. Arabic keyboards type Arabic-Indic digits, and a pasted
 * "+968 9123 4567" or "00968…" carries the country code that the field already shows.
 */
export function normaliseMobile(input: string): string {
  const digits = input
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/\D/g, '');
  const local = digits.length > 8 ? digits.replace(/^(00)?968/, '') : digits;
  return local.slice(0, 8);
}

export function validateField(field: CheckoutField, details: CheckoutDetails): LocalizedText | undefined {
  const errors = copy.checkout.errors;
  switch (field) {
    case 'name':
      return details.name.trim() ? undefined : errors.name;
    case 'mobile':
      if (!details.mobile) return errors.mobileRequired;
      return /^[79]\d{7}$/.test(details.mobile) ? undefined : errors.mobileInvalid;
    case 'governorate':
      return findGovernorate(details.governorate) ? undefined : errors.governorate;
    case 'wilayat':
      return findWilayat(details.governorate, details.wilayat) ? undefined : errors.wilayat;
    case 'area':
      return details.area.trim() ? undefined : errors.area;
    case 'house':
      return details.house.trim() ? undefined : errors.house;
    case 'street':
      return undefined;
  }
}

export function validateDetails(details: CheckoutDetails): CheckoutErrors {
  const errors: Partial<Record<CheckoutField, LocalizedText>> = {};
  for (const field of fieldOrder) {
    const error = validateField(field, details);
    if (error) errors[field] = error;
  }
  return errors;
}

export function formatMobile(mobile: string): string {
  return `+968 ${mobile}`;
}

export function getAddressLines(details: CheckoutDetails, locale: Locale): readonly string[] {
  const governorate = findGovernorate(details.governorate);
  const wilayat = findWilayat(details.governorate, details.wilayat);
  const separator = locale === 'ar' ? '، ' : ', ';
  return [
    [details.house.trim(), details.street.trim(), details.area.trim()],
    [wilayat ? localize(wilayat.name, locale) : '', governorate ? localize(governorate.name, locale) : ''],
  ].map((parts) => parts.filter(Boolean).join(separator));
}

function buildOrderMessage(cart: readonly CartLine[], details: CheckoutDetails, locale: Locale): string {
  const checkoutCopy = copy.checkout;
  const { subtotal, deliveryFee, total } = getOrderTotals(cart);
  const governorate = findGovernorate(details.governorate);
  const wilayat = findWilayat(details.governorate, details.wilayat);

  const items = cart.flatMap((line, index) => {
    const summary = [
      `${formatNumber(index + 1, locale)}. ${localize(line.product.name, locale)}`,
      `${localize(copy.product.size, locale)} ${line.size}`,
      `${localize(copy.cart.quantity, locale)} ${formatNumber(line.quantity, locale)}`,
      formatOmr(line.product.priceOmr * line.quantity, locale),
    ].join(' — ');
    const fit = getCustomFitSummary(line, locale);
    return fit ? [summary, `   ${localize(copy.product.customFit.cartLabel, locale)}: ${fit}`] : [summary];
  });

  const labelled = (label: LocalizedText, value: string) => `${localize(label, locale)}: ${value}`;

  return [
    localize(checkoutCopy.message.greeting, locale),
    '',
    ...items,
    '',
    labelled(checkoutCopy.subtotal, formatOmr(subtotal, locale)),
    labelled(checkoutCopy.delivery, getDeliveryLabel(deliveryFee, locale)),
    `${getTotalLabel(deliveryFee, locale)}: ${formatOmr(total, locale)}`,
    '',
    `${localize(checkoutCopy.message.customer, locale)}:`,
    labelled(checkoutCopy.name, details.name.trim()),
    labelled(checkoutCopy.mobile, formatMobile(details.mobile)),
    labelled(checkoutCopy.governorate, governorate ? localize(governorate.name, locale) : ''),
    labelled(checkoutCopy.wilayat, wilayat ? localize(wilayat.name, locale) : ''),
    labelled(checkoutCopy.area, details.area.trim()),
    ...(details.street.trim() ? [labelled(checkoutCopy.street, details.street.trim())] : []),
    labelled(checkoutCopy.house, details.house.trim()),
  ].join('\n');
}

export function buildWhatsAppUrl(cart: readonly CartLine[], details: CheckoutDetails, locale: Locale): string {
  const text = encodeURIComponent(buildOrderMessage(cart, details, locale));
  return `https://wa.me/${brand.whatsappNumber}?text=${text}`;
}
