export type Locale = 'ar' | 'en';

export type LocalizedText = Readonly<Record<Locale, string>>;

export interface Product {
  readonly id: string;
  readonly name: LocalizedText;
  readonly priceOmr: number;
  readonly image: string;
  readonly imageAlt: LocalizedText;
  readonly imagePosition: string;
  readonly description: LocalizedText;
  readonly details: LocalizedText;
  readonly fabric: LocalizedText;
  readonly cut: LocalizedText;
  readonly signature: LocalizedText;
  readonly colorHex: string;
  readonly sizes: readonly string[];
}

export type FitPreference = 'standard' | 'relaxed';

export interface CustomFit {
  readonly lengthCm?: string;
  readonly sleeveCm?: string;
  readonly fit: FitPreference;
}

export interface CartLine {
  readonly id: string;
  readonly product: Product;
  readonly size: string;
  readonly customFit?: CustomFit;
  readonly quantity: number;
}
