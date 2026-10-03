/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { Header } from './components/common/Header';
import { SessionSimulator } from './components/common/SessionSimulator';
import { TableSwitcherModal } from './components/common/TableSwitcherModal';
import { VideoPlayerModal } from './components/common/VideoPlayerModal';
import { ProfileModal } from './components/common/ProfileModal';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { MenuHome } from './components/menu/MenuHome';
import { ItemDetail } from './components/item/ItemDetail';
import { LiveTracking } from './components/tracking/LiveTracking';
import { StaffPOS } from './components/pos/StaffPOS';
import { OwnerAnalytics } from './components/analytics/OwnerAnalytics';
import {
  ALL_MENU_DISHES,
  INITIAL_CART_ITEMS,
  INITIAL_TABLE_INFO,
  PAYMENT_RAILS,
  TIP_OPTIONS,
} from './data/mockData';
import {
  createNewOrder,
  getActiveCustomerOrder,
  subscribeToOrders,
} from './store/orderStore';
import { ActiveOrder, CartItem, Dish, OrderType, TableInfo } from './types/restaurant';

export default function App() {
  // Navigation Route State (App Router-style supporting /pos, /order-status, /checkout, etc.)
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path === '/pos' || path.startsWith('/pos/')) return 'management';
      if (path === '/order-status' || path === '/tracking' || path.startsWith('/order-status/')) return 'tracking';
      if (path === '/checkout' || path === '/cart') return 'checkout';
      if (path === '/analytics' || path === '/insights') return 'analytics';
      const searchTab = new URLSearchParams(window.location.search).get('tab');
      if (searchTab === 'pos') return 'management';
      if (searchTab === 'tracking' || searchTab === 'order-status') return 'tracking';
    }
    return 'menu';
  });

  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  // Language state
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');

  // Modals state
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [videoModalData, setVideoModalData] = useState<{
    isOpen: boolean;
    title: string;
    poster: string;
  }>({
    isOpen: false,
    title: '',
    poster: '',
  });

  // Session & QR state (persisted in localStorage)
  const [orderType, setOrderType] = useState<OrderType>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('type') === 'takeaway') return 'takeaway';
      if (params.get('table')) return 'dinein';
      const saved = localStorage.getItem('sultans_session_mode');
      if (saved === 'takeaway' || saved === 'dinein' || saved === 'delivery') return saved as OrderType;
    }
    return 'dinein';
  });

  const [tableInfo, setTableInfo] = useState<TableInfo>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get('table');
      if (tableParam) {
        return {
          ...INITIAL_TABLE_INFO,
          number: tableParam,
          numberBn:
            tableParam === '08'
              ? '০৮'
              : tableParam === '14'
              ? '১৪'
              : tableParam === '02'
              ? '০২'
              : tableParam === '21'
              ? '২১'
              : tableParam,
        };
      }
      const savedTable = localStorage.getItem('sultans_table_number');
      if (savedTable) {
        return {
          ...INITIAL_TABLE_INFO,
          number: savedTable,
          numberBn:
            savedTable === '08'
              ? '০৮'
              : savedTable === '14'
              ? '১৪'
              : savedTable === '02'
              ? '০২'
              : savedTable === '21'
              ? '২১'
              : savedTable,
        };
      }
    }
    return INITIAL_TABLE_INFO;
  });

  // Cart state (persisted in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sultans_cart');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {
        console.error('Failed to load cart from localStorage:', e);
      }
    }
    return INITIAL_CART_ITEMS;
  });

  // Active Order tracking state (synchronized with orderStore)
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(() => {
    return getActiveCustomerOrder();
  });

  // Subscribe to live order updates (syncs if POS expediter updates customer's order)
  useEffect(() => {
    const syncActiveOrder = () => {
      const live = getActiveCustomerOrder();
      setActiveOrder(live);
    };
    const unsubscribe = subscribeToOrders(syncActiveOrder);
    return () => unsubscribe();
  }, []);

  // Handle URL navigation and browser back/forward buttons (supporting /pos, /order-status, etc.)
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get('type');
      const tableParam = params.get('table');
      const tabParam = params.get('tab');

      if (path === '/pos' || path.startsWith('/pos/') || tabParam === 'pos') {
        setActiveTab('management');
      } else if (
        path === '/order-status' ||
        path === '/tracking' ||
        path.startsWith('/order-status/') ||
        tabParam === 'tracking'
      ) {
        setActiveTab('tracking');
      } else if (path === '/checkout' || path === '/cart' || tabParam === 'checkout') {
        setActiveTab('checkout');
      } else if (path === '/analytics' || tabParam === 'analytics') {
        setActiveTab('analytics');
      } else if (path === '/' || path === '/menu') {
        setActiveTab('menu');
      }

      if (typeParam === 'takeaway') {
        setOrderType('takeaway');
        localStorage.setItem('sultans_session_mode', 'takeaway');
      } else if (tableParam) {
        setOrderType('dinein');
        setTableInfo((prev) => ({
          ...prev,
          number: tableParam,
          numberBn:
            tableParam === '08'
              ? '০৮'
              : tableParam === '14'
              ? '১৪'
              : tableParam === '02'
              ? '০২'
              : tableParam === '21'
              ? '২১'
              : tableParam,
        }));
        localStorage.setItem('sultans_session_mode', 'dinein');
        localStorage.setItem('sultans_table_number', tableParam);
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  // Navigation tab switcher that updates URL route seamlessly
  const handleSelectTab = (tab: NavTab) => {
    setSelectedDish(null);
    setActiveTab(tab);

    const query = window.location.search;
    let targetPath = '/';
    if (tab === 'management') targetPath = '/pos';
    else if (tab === 'tracking') targetPath = '/order-status';
    else if (tab === 'checkout') targetPath = '/checkout';
    else if (tab === 'analytics') targetPath = '/analytics';
    else targetPath = '/';

    window.history.pushState({}, '', `${targetPath}${query}`);
  };

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('sultans_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  // Sync session mode to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sultans_session_mode', orderType);
      localStorage.setItem('sultans_table_number', tableInfo.number);
    } catch (e) {
      console.error('Failed to save session mode to localStorage:', e);
    }
  }, [orderType, tableInfo.number]);

  // Mode simulator function
  const handleSimulateMode = (mode: OrderType, tableNum = '08') => {
    setOrderType(mode);
    if (mode === 'dinein') {
      setTableInfo((prev) => ({
        ...prev,
        number: tableNum,
        numberBn:
          tableNum === '08'
            ? '০৮'
            : tableNum === '14'
            ? '১৪'
            : tableNum === '02'
            ? '০২'
            : tableNum === '21'
            ? '২১'
            : tableNum,
      }));
      window.history.pushState({}, '', `?table=${tableNum}`);
    } else if (mode === 'takeaway') {
      window.history.pushState({}, '', '?type=takeaway');
    }
  };

  // Cart operations
  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleQuickAddDish = (dish: Dish) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.dishId === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dishId === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${dish.id}`,
        dishId: dish.id,
        nameEn: dish.nameEn,
        nameBn: dish.nameBn,
        basePrice: dish.basePrice,
        unitPrice: dish.basePrice,
        quantity: 1,
        image: dish.image,
        portion: 'Regular',
        portionBn: 'রেগুলার',
        spiceLevel: dish.spiceLevel,
        addons: [],
        details: `${dish.category} • ${dish.spiceLevel} Spice`,
      };
      return [...prev, newItem];
    });
  };

  const handleAddCustomizedItem = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  // Video trigger
  const handleOpenVideo = (title: string, poster: string) => {
    setVideoModalData({
      isOpen: true,
      title,
      poster,
    });
  };

  /**
   * Order submission using mock order engine
   * Requirements:
   * - order id
   * - table number or takeaway mode
   * - items and selected modifiers
   * - subtotal and total in BDT
   * - payment method
   * - payment status: pending
   * - order status: placed
   * - created timestamp
   * - stored in localStorage
   * - redirect to order-status page
   */
  const handleOrderSubmit = async (payload: {
    items: CartItem[];
    orderType: OrderType;
    paymentMethod: any;
    tipAmount: number;
    notes: string;
    grandTotal: number;
    discountAmount?: number;
  }) => {
    // 1. Create order object via mock order engine
    const created = createNewOrder({
      orderType: payload.orderType,
      tableNumber: payload.orderType === 'takeaway' ? 'Takeaway' : tableInfo.number,
      items: payload.items,
      subtotal: payload.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
      vatAmount: Math.round(payload.grandTotal * 0.047),
      serviceChargeAmount:
        payload.orderType === 'dinein' ? Math.round(payload.grandTotal * 0.047) : 0,
      tipAmount: payload.tipAmount,
      discountAmount: payload.discountAmount,
      grandTotal: payload.grandTotal,
      paymentMethod: payload.paymentMethod,
      specialNotes: payload.notes,
    });

    setActiveOrder(created);

    // 2. Clear cart
    setCartItems([]);
    try {
      localStorage.removeItem('sultans_cart');
    } catch (e) {}

    // 3. Redirect to order-status page
    setActiveTab('tracking');
    window.history.pushState({}, '', '/order-status');
  };

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalCartPrice = cartItems.reduce((acc, curr) => acc + curr.unitPrice * curr.quantity, 0);

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col antialiased selection:bg-[#E5A93C] selection:text-[#432c00]">
      {/* 1. Header (Sticky on Scroll) */}
      <Header
        tableInfo={tableInfo}
        orderType={orderType}
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'))}
        onOpenTableSelect={() => setIsTableModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onNavigateHome={() => handleSelectTab('menu')}
      />

      {/* Main Content Viewport (Mobile-First responsive container) */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 sm:px-5 pt-3 pb-8 relative">
        {/* Development QR Mode Simulator Bar */}
        <SessionSimulator
          currentMode={orderType}
          tableNumber={tableInfo.number}
          onSelectMode={handleSimulateMode}
          language={language}
        />

        {/* SEQUENCE STEP 1: Menu Home */}
        {activeTab === 'menu' && !selectedDish && (
          <MenuHome
            dishes={ALL_MENU_DISHES}
            tableInfo={tableInfo}
            orderType={orderType}
            cartItemCount={totalCartCount}
            cartTotal={totalCartPrice}
            onOpenDishDetail={(dish) => setSelectedDish(dish)}
            onQuickAdd={handleQuickAddDish}
            onGoToCart={() => handleSelectTab('checkout')}
            onOpenVideo={handleOpenVideo}
            onOpenTableSelect={() => setIsTableModalOpen(true)}
            language={language}
          />
        )}

        {/* SEQUENCE STEP 2: Item Detail with Modifiers */}
        {selectedDish && (
          <ItemDetail
            dish={selectedDish}
            onBack={() => setSelectedDish(null)}
            onAddToCart={handleAddCustomizedItem}
            onGoToCart={() => handleSelectTab('checkout')}
            onOpenVideo={handleOpenVideo}
            language={language}
          />
        )}

        {/* SEQUENCE STEP 3: Cart and Checkout UI */}
        {activeTab === 'checkout' && !selectedDish && (
          <CheckoutPage
            cartItems={cartItems}
            tableInfo={tableInfo}
            orderType={orderType}
            tipOptions={TIP_OPTIONS}
            paymentRails={PAYMENT_RAILS}
            language={language}
            onSetOrderType={setOrderType}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onNavigateToMenu={() => handleSelectTab('menu')}
            onNavigateToTracking={() => handleSelectTab('tracking')}
            onOrderSubmit={handleOrderSubmit}
          />
        )}

        {/* SEQUENCE STEP 4: Order Status / Tracking */}
        {activeTab === 'tracking' && !selectedDish && (
          <LiveTracking
            tableInfo={tableInfo}
            orderNumber={activeOrder?.orderId || 'SK-2481'}
            activeOrder={activeOrder}
            onBackToMenu={() => handleSelectTab('menu')}
            onOpenVideo={handleOpenVideo}
            language={language}
          />
        )}

        {/* SEQUENCE STEP 5: Staff POS Prototype (/pos) */}
        {activeTab === 'management' && !selectedDish && (
          <StaffPOS language={language} />
        )}

        {/* SEQUENCE STEP 6: Owner Analytics */}
        {activeTab === 'analytics' && !selectedDish && (
          <OwnerAnalytics language={language} />
        )}
      </main>

      {/* Shared Bottom Navigation Shell */}
      <BottomNav
        activeTab={selectedDish ? 'menu' : activeTab}
        onSelectTab={handleSelectTab}
        cartItemCount={totalCartCount}
        language={language}
      />

      {/* Table Switcher Dialog Modal */}
      <TableSwitcherModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        currentTable={tableInfo.number}
        currentMode={orderType}
        onSelectTable={(tableNum, mode) => {
          handleSimulateMode(mode, tableNum);
        }}
        language={language}
      />

      {/* Patron Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        tableNumber={tableInfo.number}
        onOpenReceipts={() => handleSelectTab('tracking')}
        language={language}
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={videoModalData.isOpen}
        onClose={() => setVideoModalData((prev) => ({ ...prev, isOpen: false }))}
        title={videoModalData.title}
        posterUrl={videoModalData.poster}
        language={language}
      />
    </div>
  );
}
