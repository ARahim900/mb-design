import type { LocalizedText } from '../types';

/**
 * Brand facts the storefront shows to customers. Every value here must come from MB Design;
 * nothing is guessed. An empty value hides the element that uses it, so the live site never
 * shows placeholder text.
 */

export interface SizeRow {
  readonly size: string;
  /** Customer height range in cm, e.g. "155–160". */
  readonly heightCm: string;
  /** Finished garment length in cm, shoulder to hem. */
  readonly lengthCm: string;
}

export interface PolicyPage {
  readonly id: 'returns' | 'delivery' | 'terms' | 'privacy';
  readonly title: LocalizedText;
  readonly body: LocalizedText;
}

export interface BrandFacts {
  /** International format without "+" or spaces, e.g. "96890000000". Empty hides WhatsApp. */
  readonly whatsappNumber: string;
  readonly instagramHandle: string;
  readonly email: string;
  /** Commercial registration number. */
  readonly crNumber: string;
  readonly sizeChart: readonly SizeRow[];
  /** Delivery fee in OMR inside Oman. null = not confirmed. 0 = free. */
  readonly deliveryFeeOmr: number | null;
  /** Expected delivery window, e.g. { ar: '٢–٤ أيام عمل', en: '2–4 working days' }. */
  readonly deliveryTime: LocalizedText | null;
  /** One-line returns summary shown above Add to bag. */
  readonly returnsSummary: LocalizedText | null;
  readonly policies: readonly PolicyPage[];
}

export const brand: BrandFacts = {
  whatsappNumber: '',
  instagramHandle: '',
  email: '',
  crNumber: '',
  sizeChart: [],
  deliveryFeeOmr: null,
  deliveryTime: null,
  returnsSummary: null,
  policies: [],
};

export const hasWhatsApp = brand.whatsappNumber.length > 0;
