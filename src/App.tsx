import { useEffect, useMemo, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { CursorRing } from './components/CursorRing';
import { Craftsmanship } from './components/Craftsmanship';
import { Collection } from './components/Collection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Preloader } from './components/Preloader';
import { ProductDialog } from './components/ProductDialog';
import { Services } from './components/Services';
import { Story } from './components/Story';
import type { CartLine, CustomFit, Locale, Product } from './types';

function App() {
  const [locale, setLocale] = useState<Locale>('ar');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.title = locale === 'ar' ? 'رزّة — RIZZA' : 'RIZZA — رزّة';
  }, [locale]);

  const cartCount = useMemo(
    () => cart.reduce((total, line) => total + line.quantity, 0),
    [cart],
  );

  const handleAddToCart = (product: Product, size: string, customFit?: CustomFit) => {
    const lineId = [
      product.id,
      size,
      customFit?.lengthCm ?? '',
      customFit?.sleeveCm ?? '',
      customFit?.fit ?? '',
    ].join(':');

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

  return (
    <div className="min-h-screen overflow-x-clip bg-pearl text-ink">
      <Preloader />
      <CursorRing />
      {/* Photographic grain over the whole page. Inert to the pointer, and the
          bag and product sheets are <dialog> elements in the top layer, so it
          can never sit over them. */}
      <div className="page-grain" aria-hidden="true" />
      <Header
        locale={locale}
        cartCount={cartCount}
        onLocaleChange={setLocale}
        onCartOpen={() => setCartOpen(true)}
      />
      <main id="main" tabIndex={-1}>
        <Hero locale={locale} />
        {/* The hero is sticky at z-0. Everything after it scrolls over the top
            on its own opaque layer — that overlap IS the transition. */}
        <div className="relative z-10 bg-pearl">
          <Collection locale={locale} onProductOpen={setSelectedProduct} />
          <Craftsmanship locale={locale} />
          <Story locale={locale} />
          <Services locale={locale} />
        </div>
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
      />
    </div>
  );
}

export default App;
