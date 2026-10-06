/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from './lib/firebase';
import { 
  seedInitialProductsIfEmpty, 
  subscribeToProducts, 
  subscribeToOrders, 
  subscribeToCustomers, 
  subscribeToNotifications 
} from './lib/db';
import { Product, CartItem, Order, Customer, StoreNotification, ProductCategory } from './types';
import { Header } from './components/Header';
import { Banner } from './components/Banner';
import { ProductCard } from './components/ProductCard';
import { ProductQuickView } from './components/ProductQuickView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { NotificationCenter } from './components/NotificationCenter';
import { Footer } from './components/Footer';

export default function App() {
  // Real-time Database Collections State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [notifications, setNotifications] = useState<StoreNotification[]>([]);
  const [dbLoading, setDbLoading] = useState<boolean>(true);

  // Shopping Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  // Navigation & Category Filter State
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'Semua'>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers Visibility
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutShippingMethod, setCheckoutShippingMethod] = useState<string>('JNE Reguler');
  const [checkoutShippingCost, setCheckoutShippingCost] = useState<number>(15000);
  const [checkoutPromoCode, setCheckoutPromoCode] = useState<string>('');
  const [checkoutPromoDiscount, setCheckoutPromoDiscount] = useState<number>(0);

  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // 1. Validate Connection & Seed Initial Products on boot
  useEffect(() => {
    async function initDb() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection')).catch(() => {});
        await seedInitialProductsIfEmpty();
      } catch (err) {
        console.error('Database connection test failed:', err);
      } finally {
        setDbLoading(false);
      }
    }
    initDb();
  }, []);

  // 2. Real-time Subscriptions to Firestore Collections
  useEffect(() => {
    const unsubProducts = subscribeToProducts(setProducts);
    const unsubOrders = subscribeToOrders(setOrders);
    const unsubCustomers = subscribeToCustomers(setCustomers);
    const unsubNotifs = subscribeToNotifications(setNotifications);

    return () => {
      unsubProducts();
      unsubOrders();
      unsubCustomers();
      unsubNotifs();
    };
  }, []);

  // Cart Operations
  const handleAddToCart = (product: Product, selectedSize: string, quantity: number = 1) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === selectedSize
      );
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      } else {
        return [...prev, { product, selectedSize, quantity }];
      }
    });
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
    } else {
      setCart(prev => {
        const next = [...prev];
        next[index].quantity = newQty;
        return next;
      });
    }
  };

  const handleRemoveCartItem = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // Proceed from Cart to Checkout
  const handleProceedToCheckout = (
    shippingMethod: string, 
    shippingCost: number, 
    promoCode: string, 
    promoDiscount: number
  ) => {
    setCheckoutShippingMethod(shippingMethod);
    setCheckoutShippingCost(shippingCost);
    setCheckoutPromoCode(promoCode);
    setCheckoutPromoDiscount(promoDiscount);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Order Completed Handler
  const handleOrderSuccess = (_newOrder: Order) => {
    setCart([]); // Clear cart
  };

  // Admin Access Toggle
  const handleOpenAdminTrigger = () => {
    if (isAdminAuthenticated) {
      setIsAdminPanelOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // Filter Products by Category & Search Query
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotalCount = cart.reduce((s, i) => s + i.quantity, 0);
  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col antialiased">
      
      {/* Header Navigation Bar */}
      <Header
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={handleOpenAdminTrigger}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenNotifications={() => setIsNotifOpen(!isNotifOpen)}
        unreadNotifCount={unreadNotifs}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Promotional Hero Banner */}
      <Banner onShopNow={() => {
        const catalogEl = document.getElementById('nevada-catalog');
        if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
      }} />

      {/* Main Catalog View */}
      <main id="nevada-catalog" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-xs font-black uppercase text-red-600 tracking-wider">
                KATALOG NEVADA 2026
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {selectedCategory === 'Semua' ? 'Semua Produk Pilihan Nevada' : `Kategori: ${selectedCategory}`}
            </h2>
          </div>

          <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            Menampilkan <strong className="text-slate-900">{filteredProducts.length}</strong> dari {products.length} produk
          </div>
        </div>

        {/* Loading Spinner or Grid */}
        {dbLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-600">Menghubungkan ke Real-time Database Nevada Store...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200 p-8">
            <div className="text-4xl">🔍</div>
            <h3 className="font-bold text-slate-800 text-sm">Produk Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tidak ada produk Nevada yang sesuai dengan kata kunci "{searchQuery}". Coba gunakan kata kunci lain.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('Semua'); }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(prod, sz) => handleAddToCart(prod, sz, 1)}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Drawers & Modals */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        shippingMethod={checkoutShippingMethod}
        shippingCost={checkoutShippingCost}
        promoCode={checkoutPromoCode}
        promoDiscount={checkoutPromoDiscount}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
      />

      <NotificationCenter
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminAuthenticated(true);
          setIsAdminPanelOpen(true);
        }}
      />

      {isAdminPanelOpen && (
        <AdminPanel
          products={products}
          orders={orders}
          customers={customers}
          onClose={() => setIsAdminPanelOpen(false)}
        />
      )}

    </div>
  );
}
