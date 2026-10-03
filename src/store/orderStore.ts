/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActiveOrder, OrderStatus, PaymentStatus } from '../types/restaurant';

const ORDERS_STORAGE_KEY = 'sultans_orders_db';
const ACTIVE_ORDER_ID_KEY = 'sultans_active_order_id';
const ORDER_UPDATED_EVENT = 'sultans_order_state_change';

// Initial pre-populated mock orders for staff POS & customer prototype
const INITIAL_MOCK_ORDERS: ActiveOrder[] = [
  {
    orderId: 'SK-2481',
    orderType: 'dinein',
    tableNumber: '08',
    items: [
      {
        id: 'item-2481-1',
        dishId: 'dish-kacchi-1',
        nameEn: 'Shahi Mutton Kacchi Biryani',
        nameBn: 'শাহী মাটন কাচ্চি বিরিয়ানি',
        basePrice: 580,
        unitPrice: 580,
        quantity: 2,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQqA8bQ3z6x2g-mZz6X1B3j6aWzFv9t0oJz9y6p2v8rT_bKwG9k4f0_8qj1vM3bZt3eK7jMv9x8c_0wL2g4h6k8m0o2q4s6u8w0y2',
        portion: 'Regular',
        portionBn: 'রেগুলার',
        spiceLevel: 'Medium',
        addons: [{ id: 'a1', name: 'Extra Fried Potato', price: 50 }],
        details: 'Regular • Medium Spice • Extra Potato',
      },
      {
        id: 'item-2481-2',
        dishId: 'dish-borhani',
        nameEn: 'Special Shahi Borhani',
        nameBn: 'স্পেশাল শাহী বোরহানি',
        basePrice: 90,
        unitPrice: 90,
        quantity: 2,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEu84e-eRjX2a4q8h6t0v2w4y6A8bQ3z6x2g-mZz6X1B3j6aWzFv9t0oJz9y6p2v8rT_bKwG9k4f0_8qj1vM3bZt3eK7jMv9x8c_0wL2',
        portion: '250ml',
        portionBn: '২৫০ মিলি',
        spiceLevel: 'Mild',
        addons: [],
        details: '250ml Chilled',
      },
    ],
    subtotal: 1340,
    vatAmount: 67,
    serviceChargeAmount: 67,
    tipAmount: 50,
    grandTotal: 1524,
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    orderStatus: 'preparing',
    specialNotes: 'Extra beresta on top of kacchi pot',
    placedAt: '6m ago',
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    createdTimestamp: Date.now() - 6 * 60 * 1000,
    estimatedMinutes: 12,
    currentStageIndex: 2,
  },
  {
    orderId: 'SK-3920',
    orderType: 'dinein',
    tableNumber: '02',
    items: [
      {
        id: 'item-3920-1',
        dishId: 'dish-polao',
        nameEn: 'Rajbarir Morog Polao',
        nameBn: 'রাজবাড়ীর মোরগ পোলাও',
        basePrice: 450,
        unitPrice: 450,
        quantity: 2,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt8eG2X_wV8u0j4k6m8o2q4s6u8w0y2A4bC6dE8fG0h2j4k6m8o2q4s6u8w0y2A4bC6dE8fG0h2j4k6m8o2q4s6u8w0y2',
        portion: 'Regular',
        portionBn: 'রেগুলার',
        spiceLevel: 'Mild',
        addons: [],
        details: 'Tender desi chicken roast with ghee bhat',
      },
      {
        id: 'item-3920-2',
        dishId: 'dish-kebab-1',
        nameEn: 'Sultani Reshmi Kebab',
        nameBn: 'সুলতানি রেশমি কাবাব',
        basePrice: 380,
        unitPrice: 380,
        quantity: 2,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE7yG4p2v8rT_bKwG9k4f0_8qj1vM3bZt3eK7jMv9x8c_0wL2g4h6k8m0o2q4s6u8w0y2A4bC6dE8fG0h2j4k6m8o2q4',
        portion: '4 Pcs',
        spiceLevel: 'Medium',
        addons: [],
        details: 'Charcoal grilled with mint curd chutney',
      },
    ],
    subtotal: 1660,
    vatAmount: 83,
    serviceChargeAmount: 83,
    tipAmount: 100,
    grandTotal: 1926,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    orderStatus: 'placed',
    specialNotes: 'Cash collection at counter after meal',
    placedAt: '1m ago',
    createdAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    createdTimestamp: Date.now() - 1 * 60 * 1000,
    estimatedMinutes: 20,
    currentStageIndex: 0,
  },
  {
    orderId: 'SK-1845',
    orderType: 'takeaway',
    tableNumber: 'Takeaway #3',
    items: [
      {
        id: 'item-1845-1',
        dishId: 'dish-tehari',
        nameEn: 'Old Dhaka Beef Tehari',
        nameBn: 'পুরান ঢাকার বিফ তেহারি',
        basePrice: 420,
        unitPrice: 420,
        quantity: 2,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHJzoYYGxuHfzXxhVrYJteUeDkiv259XQ2VKWJl2M51QMOIAx1kWiPUwR1YfDZ1ssBtYra5jnXWlLg7iAoGpsf_Ku7SqJsM3pY90rPwknRIO_27URJ2jeTb4z6k6Kqqb3x36dq3R0f9LmawyBLdD3Up3lUUsIeK-eGvvCzdeWKF8sBIrT4XlCG42_0IRZIGv3T0NftnkNc3zLEKSTpUZBFxQgnWBPZpJtT3OuIyRjSeJJE-48fg96FBw',
        portion: 'Regular',
        portionBn: 'রেগুলার',
        spiceLevel: 'Spicy',
        addons: [],
        details: 'Mustard oil infused chinigura rice',
      },
      {
        id: 'item-1845-2',
        dishId: 'dish-borhani',
        nameEn: 'Special Shahi Borhani',
        nameBn: 'স্পেশাল শাহী বোরহানি',
        basePrice: 90,
        unitPrice: 90,
        quantity: 2,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEu84e-eRjX2a4q8h6t0v2w4y6A8bQ3z6x2g-mZz6X1B3j6aWzFv9t0oJz9y6p2v8rT_bKwG9k4f0_8qj1vM3bZt3eK7jMv9x8c_0wL2',
        portion: '250ml',
        spiceLevel: 'Mild',
        addons: [],
        details: 'Chilled bottle',
      },
    ],
    subtotal: 1020,
    vatAmount: 51,
    serviceChargeAmount: 0,
    tipAmount: 0,
    grandTotal: 1071,
    paymentMethod: 'nagad',
    paymentStatus: 'paid',
    orderStatus: 'ready',
    specialNotes: 'Pack plastic cutlery and wet wipes',
    placedAt: '14m ago',
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    createdTimestamp: Date.now() - 14 * 60 * 1000,
    estimatedMinutes: 0,
    currentStageIndex: 3,
  },
  {
    orderId: 'SK-7120',
    orderType: 'dinein',
    tableNumber: '14',
    items: [
      {
        id: 'item-7120-1',
        dishId: 'dish-kacchi-1',
        nameEn: 'Shahi Mutton Kacchi Biryani',
        nameBn: 'শাহী মাটন কাচ্চি বিরিয়ানি',
        basePrice: 580,
        unitPrice: 580,
        quantity: 4,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQqA8bQ3z6x2g-mZz6X1B3j6aWzFv9t0oJz9y6p2v8rT_bKwG9k4f0_8qj1vM3bZt3eK7jMv9x8c_0wL2g4h6k8m0o2q4s6u8w0y2',
        portion: 'Royal Platter',
        portionBn: 'প্ল্যাটার',
        spiceLevel: 'Medium',
        addons: [],
        details: 'Royal Balcony Party',
      },
    ],
    subtotal: 2320,
    vatAmount: 116,
    serviceChargeAmount: 116,
    tipAmount: 200,
    grandTotal: 2752,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'served',
    specialNotes: 'VIP Balcony guest',
    placedAt: '25m ago',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    createdTimestamp: Date.now() - 25 * 60 * 1000,
    estimatedMinutes: 0,
    currentStageIndex: 4,
  },
];

// Helper to calculate stage index from OrderStatus
export const getStageIndexFromStatus = (status: OrderStatus): number => {
  switch (status) {
    case 'placed':
      return 0;
    case 'preparing':
      return 2;
    case 'ready':
      return 3;
    case 'served':
      return 4;
    case 'cancelled':
      return 0;
    default:
      return 1;
  }
};

// Calculate elapsed human-readable time
export const getElapsedTime = (createdTimestamp: number): string => {
  const elapsedMs = Date.now() - createdTimestamp;
  const elapsedMins = Math.floor(elapsedMs / (60 * 1000));
  if (elapsedMins < 1) return 'Just now';
  if (elapsedMins === 1) return '1m ago';
  if (elapsedMins < 60) return `${elapsedMins}m ago`;
  const hours = Math.floor(elapsedMins / 60);
  return `${hours}h ${elapsedMins % 60}m ago`;
};

// Dispatch change event to keep all components in sync
const notifyOrderChange = (order?: ActiveOrder) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(ORDER_UPDATED_EVENT, { detail: order })
    );
  }
};

/**
 * Retrieve all orders from store
 */
export const getAllOrders = (): ActiveOrder[] => {
  if (typeof window === 'undefined') return INITIAL_MOCK_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to read orders from localStorage:', e);
  }
  // Initialize with mock orders if empty
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ORDERS));
  } catch (e) {}
  return INITIAL_MOCK_ORDERS;
};

/**
 * Retrieve active customer order
 */
export const getActiveCustomerOrder = (): ActiveOrder | null => {
  if (typeof window === 'undefined') return null;
  const orders = getAllOrders();
  const activeId = localStorage.getItem(ACTIVE_ORDER_ID_KEY);
  if (activeId) {
    const found = orders.find((o) => o.orderId === activeId);
    if (found) return found;
  }
  // Default to first non-served order or the first order
  return orders[0] || null;
};

/**
 * Set active customer order ID
 */
export const setActiveCustomerOrderId = (orderId: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACTIVE_ORDER_ID_KEY, orderId);
    notifyOrderChange();
  }
};

/**
 * Create a new customer order on checkout submission
 * TODO: Integrate backend dispatch (POST /api/orders/checkout -> MongoDB / PostgreSQL)
 */
export const createNewOrder = (params: {
  orderType: 'dinein' | 'takeaway' | 'delivery';
  tableNumber: string;
  items: ActiveOrder['items'];
  subtotal: number;
  vatAmount: number;
  serviceChargeAmount: number;
  tipAmount: number;
  discountAmount?: number;
  grandTotal: number;
  paymentMethod: ActiveOrder['paymentMethod'];
  specialNotes?: string;
}): ActiveOrder => {
  const generatedId = `SK-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = Date.now();

  const newOrder: ActiveOrder = {
    orderId: generatedId,
    orderType: params.orderType,
    tableNumber: params.tableNumber,
    items: params.items,
    subtotal: params.subtotal,
    vatAmount: params.vatAmount,
    serviceChargeAmount: params.serviceChargeAmount,
    tipAmount: params.tipAmount,
    discountAmount: params.discountAmount || 0,
    grandTotal: params.grandTotal,
    paymentMethod: params.paymentMethod,
    // As per user spec: payment status: pending, order status: placed
    paymentStatus: 'pending',
    orderStatus: 'placed',
    specialNotes: params.specialNotes,
    placedAt: 'Just now',
    createdAt: new Date(now).toISOString(),
    createdTimestamp: now,
    estimatedMinutes: 20,
    currentStageIndex: 0,
  };

  const currentOrders = getAllOrders();
  const updatedOrders = [newOrder, ...currentOrders];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
      localStorage.setItem(ACTIVE_ORDER_ID_KEY, generatedId);
      localStorage.setItem('sultans_active_order', JSON.stringify(newOrder));
    } catch (e) {
      console.error('Failed to save new order to localStorage:', e);
    }
  }

  notifyOrderChange(newOrder);
  return newOrder;
};

/**
 * Update order status (used by Staff POS & Kitchen Simulator)
 * Transitions: placed -> preparing -> ready -> served
 * TODO: Integrate WebSocket broadcast (wss://api.sultanskitchen.com/orders/:id/status)
 */
export const updateOrderStatus = (
  orderId: string,
  newStatus: OrderStatus
): ActiveOrder | null => {
  const currentOrders = getAllOrders();
  let updatedOrder: ActiveOrder | null = null;

  const newOrders = currentOrders.map((order) => {
    if (order.orderId === orderId) {
      const stageIdx = getStageIndexFromStatus(newStatus);
      const estMins =
        newStatus === 'placed'
          ? 20
          : newStatus === 'preparing'
          ? 12
          : newStatus === 'ready'
          ? 2
          : 0;

      updatedOrder = {
        ...order,
        orderStatus: newStatus,
        currentStageIndex: stageIdx,
        estimatedMinutes: estMins,
      };
      return updatedOrder;
    }
    return order;
  });

  if (updatedOrder && typeof window !== 'undefined') {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(newOrders));
      const activeId = localStorage.getItem(ACTIVE_ORDER_ID_KEY);
      if (activeId === orderId) {
        localStorage.setItem('sultans_active_order', JSON.stringify(updatedOrder));
      }
    } catch (e) {
      console.error('Failed to update order status in localStorage:', e);
    }
    notifyOrderChange(updatedOrder);
  }

  return updatedOrder;
};

/**
 * Step forward order status: placed -> preparing -> ready -> served
 */
export const advanceOrderStatus = (orderId: string): ActiveOrder | null => {
  const currentOrders = getAllOrders();
  const target = currentOrders.find((o) => o.orderId === orderId);
  if (!target) return null;

  let nextStatus: OrderStatus = 'placed';
  if (target.orderStatus === 'placed') {
    nextStatus = 'preparing';
  } else if (target.orderStatus === 'preparing') {
    nextStatus = 'ready';
  } else if (target.orderStatus === 'ready') {
    nextStatus = 'served';
  } else {
    // Loop back for simulation testing
    nextStatus = 'placed';
  }

  return updateOrderStatus(orderId, nextStatus);
};

/**
 * Update payment status (e.g. pending -> paid)
 * TODO: Integrate SSLCommerz / bKash merchant IPN webhook callback
 */
export const updatePaymentStatus = (
  orderId: string,
  paymentStatus: PaymentStatus
): ActiveOrder | null => {
  const currentOrders = getAllOrders();
  let updatedOrder: ActiveOrder | null = null;

  const newOrders = currentOrders.map((order) => {
    if (order.orderId === orderId) {
      updatedOrder = { ...order, paymentStatus };
      return updatedOrder;
    }
    return order;
  });

  if (updatedOrder && typeof window !== 'undefined') {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(newOrders));
      const activeId = localStorage.getItem(ACTIVE_ORDER_ID_KEY);
      if (activeId === orderId) {
        localStorage.setItem('sultans_active_order', JSON.stringify(updatedOrder));
      }
    } catch (e) {
      console.error('Failed to update payment status in localStorage:', e);
    }
    notifyOrderChange(updatedOrder);
  }

  return updatedOrder;
};

/**
 * React hook or listener to subscribe to order updates across tabs and components
 */
export const subscribeToOrders = (callback: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = () => callback();
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === ORDERS_STORAGE_KEY || e.key === ACTIVE_ORDER_ID_KEY) {
      callback();
    }
  };

  window.addEventListener(ORDER_UPDATED_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(ORDER_UPDATED_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
};
