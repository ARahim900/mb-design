import { useLayoutEffect, useMemo, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import {
  CART_STORAGE_KEY,
  LOCALE_STORAGE_KEY,
  decodeCart,
  decodeLocale,
  encodeCart,
  getLineId,
} from './components/checkout/cartStorage';
import { Craftsmanship } from './components/Craftsmanship';
import { Collection } from './components/Collection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Lookbook } from './components/Lookbook';
import { ProductDialog } from './components/ProductDialog';
import { Services } from './components/Services';
import { Story } from './components/Story';
import { usePersistentState } from './hooks/usePersistentState';
import type { CartLine, CustomFit, Locale, Product } from './types';

const emptyCart: CartLine[] = [];

function App() {
  const [locale, setLocale] = usePersistentState<Locale>(LOCALE_STORAGE_KEY, 'ar', decodeLocale);
  const [cart, setCart] = usePersistentState<CartLine[]>(CART_STORAGE_KEY, emptyCart, decodeCart, encodeCart);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  // A layout effect runs before the browser paints, so a stored English choice never shows a
  // right-to-left frame first.
  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const cartCount = useMemo(
    () => cart.reduce((total, line) => total + line.quantity, 0),
    [cart],
  );

  const handleAddToCart = (product: Product, size: string, customFit?: CustomFit) => {
    const lineId = getLineId(product.id, size, customFit);

    setCart((current) => {
      const existing = current.find((line) => line.id === lineId);
      if (!existing) {
        return [
          ...current,
          {
            id: lineId,
            product,
            size,
            ...(customFit ? { customFit } : {}),
            quantity: 1,
          },
        ];
      }

      return current.map((line) =>
        line.id === lineId
          ? { ...line, quantity: line.quantity + 1 }
          : line,
      );
    });
    setSelectedProduct(null);
    setCartOpen(true);
  };

  const handleQuantityChange = (lineId: string, quantity: number) => {
    setCart((current) =>
      quantity <= 0
        ? current.filter((line) => line.id !== lineId)
        : current.map((line) =>
            line.id === lineId ? { ...line, quantity } : line,
          ),
    );
  };

  const handleClearCart = () => setCart(emptyCart);

  return (
    <div className="min-h-screen overflow-x-clip bg-pearl text-ink">
      <Header
        locale={locale}
        cartCount={cartCount}
        onLocaleChange={setLocale}
        onCartOpen={() => setCartOpen(true)}
      />
      <main id="main" tabIndex={-1}>
        <Hero locale={locale} />
        <Collection locale={locale} onProductOpen={setSelectedProduct} />
        <Lookbook locale={locale} />
        <Craftsmanship locale={locale} />
        <Story locale={locale} />
        <Services locale={locale} />
      </main>
      <Footer locale={locale} />

      <ProductDialog
        locale={locale}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
      <CartDrawer
        locale={locale}
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onQuantityChange={handleQuantityChange}
        onClearCart={handleClearCart}
      />
    </div>
  );
}

export default App;
