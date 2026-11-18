export type Locale = 'ar' | 'en';

export type LocalizedText = Readonly<Record<Locale, string>>;

export type GalleryShot = 'front' | 'back' | 'detail' | 'lining' | 'movement';

export interface GalleryImage {
  readonly src: string;
  readonly alt: LocalizedText;
  readonly shot: GalleryShot;
  readonly position?: string;
}

export interface LookbookLook {
  readonly id: string;
  /** Instagram reel shortcode; the card links to the reel. */
  readonly reel: string;
  readonly src: string;
  readonly srcSmall: string;
  readonly width: number;
  readonly height: number;
  readonly alt: LocalizedText;
}

export interface Product {
  readonly id: string;
  readonly name: LocalizedText;
  readonly priceOmr: number;
  readonly image: string;
  readonly imageAlt: LocalizedText;
  readonly imagePosition: string;
  /** Full gallery, front shot first. Falls back to `image` alone when absent. */
  readonly gallery?: readonly GalleryImage[];
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
