import { useEffect, useMemo, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { Craftsmanship } from './components/Craftsmanship';
import { Collection } from './components/Collection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductDialog } from './components/ProductDialog';
import { Services } from './components/Services';
import { Story } from './components/Story';
import type { CartLine, Locale, Product } from './types';

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

  const handleAddToCart = (product: Product, size: string) => {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id && line.size === size);
      if (!existing) {
        return [...current, { product, size, quantity: 1 }];
      }

      return current.map((line) =>
        line.product.id === product.id && line.size === size
          ? { ...line, quantity: line.quantity + 1 }
          : line,
      );
    });
    setSelectedProduct(null);
    setCartOpen(true);
  };

  const handleQuantityChange = (productId: string, size: string, quantity: number) => {
    setCart((current) =>
      quantity <= 0
        ? current.filter((line) => !(line.product.id === productId && line.size === size))
        : current.map((line) =>
            line.product.id === productId && line.size === size ? { ...line, quantity } : line,
          ),
    );
  };

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
      />
    </div>
  );
}

export default App;
