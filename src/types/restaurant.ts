export type OrderType = 'dinein' | 'takeaway' | 'delivery';

export type PaymentMethodId = 'bkash' | 'nagad' | 'card' | 'cash';

export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'served' | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface CartItemOption {
  name: string;
  value: string;
  extraPrice?: number;
}

export interface CartItem {
  id: string;
  dishId: string;
  nameEn: string;
  nameBn: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  image: string;
  portion: string;
  portionBn?: string;
  spiceLevel: 'Mild' | 'Medium' | 'Spicy';
  riceGrain?: string;
  cutPreference?: string;
  addons: { id: string; name: string; price: number }[];
  details: string;
  specialNote?: string;
}

export interface DishPortionOption {
  id: string;
  nameEn: string;
  nameBn: string;
  servesEn: string;
  servesBn: string;
  price: number;
}

export interface DishAddonOption {
  id: string;
  nameEn: string;
  nameBn: string;
  price: number;
}

export interface Dish {
  id: string;
  code: string;
  nameEn: string;
  nameBn: string;
  basePrice: number;
  category: string;
  rating: number;
  reviewCount: number;
  prepTimeMinutes: number;
  descriptionEn: string;
  descriptionBn: string;
  image: string;
  videoUrl?: string;
  isHalal: boolean;
  isChefPick?: boolean;
  isAwardWinning?: boolean;
  spiceLevel: 'Mild' | 'Medium' | 'Spicy';
  spiceLevelBn: string;
  portions?: DishPortionOption[];
  addons?: DishAddonOption[];
}

export interface PaymentRail {
  id: PaymentMethodId;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  badge?: string;
  badgeBn?: string;
  brandColor: string;
  iconType: 'bkash' | 'nagad' | 'card' | 'cash';
}

export interface TipOption {
  amount: number;
  labelEn: string;
  labelBn: string;
}

export interface TableInfo {
  number: string;
  numberBn: string;
  section: string;
  sectionBn: string;
  guestCount: number;
  isSynced: boolean;
}

export interface BillSummary {
  subtotal: number;
  vatRate: number; // e.g. 0.05
  vatAmount: number;
  serviceChargeRate: number; // e.g. 0.05 for dine-in, 0 for takeaway
  serviceChargeAmount: number;
  tipAmount: number;
  grandTotal: number;
}

export type OrderStageStatus = 'completed' | 'current' | 'upcoming';

export interface TrackingStage {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  timeEstimate: string;
  status: OrderStageStatus;
}

export interface ActiveOrder {
  orderId: string;
  orderType: OrderType;
  tableNumber: string;
  items: CartItem[];
  subtotal: number;
  vatAmount: number;
  serviceChargeAmount: number;
  tipAmount: number;
  discountAmount?: number;
  grandTotal: number;
  paymentMethod: PaymentMethodId;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  specialNotes?: string;
  placedAt: string;
  createdAt: string;
  createdTimestamp: number;
  estimatedMinutes: number;
  currentStageIndex: number;
}
