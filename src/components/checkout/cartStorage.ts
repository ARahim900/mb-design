import { products } from '../../data/content';
import type { CartLine, CustomFit, Locale } from '../../types';

export const CART_STORAGE_KEY = 'mbd.cart.v1';
export const LOCALE_STORAGE_KEY = 'mbd.locale';

interface StoredCartLine {
  readonly productId: string;
  readonly size: string;
  readonly customFit?: CustomFit;
  readonly quantity: number;
}

const MAX_QUANTITY = 99;

export function getLineId(productId: string, size: string, customFit?: CustomFit): string {
  return [productId, size, customFit?.lengthCm ?? '', customFit?.sleeveCm ?? '', customFit?.fit ?? ''].join(':');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function decodeCustomFit(value: unknown): CustomFit | undefined | null {
  if (value === undefined) return undefined;
  if (!isRecord(value)) return null;
  const { fit, lengthCm, sleeveCm } = value;
  if (fit !== 'standard' && fit !== 'relaxed') return null;
  if (lengthCm !== undefined && typeof lengthCm !== 'string') return null;
  if (sleeveCm !== undefined && typeof sleeveCm !== 'string') return null;
  return {
    fit,
    ...(lengthCm ? { lengthCm } : {}),
    ...(sleeveCm ? { sleeveCm } : {}),
  };
}

function decodeLine(value: unknown): CartLine | null {
  if (!isRecord(value)) return null;
  const { productId, size, quantity } = value;
  const product = products.find((candidate) => candidate.id === productId);
  if (!product || typeof size !== 'string' || !product.sizes.includes(size)) return null;
  if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) return null;
  const customFit = decodeCustomFit(value.customFit);
  if (customFit === null) return null;

  return {
    id: getLineId(product.id, size, customFit),
    product,
    size,
    ...(customFit ? { customFit } : {}),
    quantity: Math.min(quantity, MAX_QUANTITY),
  };
}

/** Rebuilds the bag from the current catalogue, dropping lines whose product or size is gone. */
export function decodeCart(stored: unknown): CartLine[] | null {
  if (!Array.isArray(stored)) return null;
  const lines = new Map<string, CartLine>();
  for (const value of stored) {
    const line = decodeLine(value);
    if (!line) continue;
    const existing = lines.get(line.id);
    lines.set(
      line.id,
      existing ? { ...existing, quantity: Math.min(existing.quantity + line.quantity, MAX_QUANTITY) } : line,
    );
  }
  return [...lines.values()];
}

/** Stores references, not product copies, so price or name changes apply on the next visit. */
export function encodeCart(cart: CartLine[]): StoredCartLine[] {
  return cart.map((line) => ({
    productId: line.product.id,
    size: line.size,
    ...(line.customFit ? { customFit: line.customFit } : {}),
    quantity: line.quantity,
  }));
}

export function decodeLocale(stored: unknown): Locale | null {
  return stored === 'ar' || stored === 'en' ? stored : null;
}
