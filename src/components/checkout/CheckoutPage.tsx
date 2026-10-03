import React, { useState } from 'react';
import {
  CartItem,
  OrderType,
  PaymentMethodId,
  PaymentRail,
  TableInfo,
  TipOption,
} from '../../types/restaurant';
import { calculateBill, formatPrice } from '../../utils/formatters';
import { BillBreakdownCard } from './BillBreakdownCard';
import { CartItemList } from './CartItemList';
import { OrderSuccessModal } from './OrderSuccessModal';
import { OrderTypeSelector } from './OrderTypeSelector';
import { PaymentRailSelector } from './PaymentRailSelector';
import { SpecialNotesInput } from './SpecialNotesInput';
import { SplitBillCard } from './SplitBillCard';
import { SplitBillModal } from './SplitBillModal';
import { StickyOrderCTA } from './StickyOrderCTA';
import { TipSelector } from './TipSelector';

export interface CheckoutPageProps {
  cartItems: CartItem[];
  tableInfo: TableInfo;
  orderType: OrderType;
  tipOptions: TipOption[];
  paymentRails: PaymentRail[];
  language?: 'bn' | 'en';
  onSetOrderType: (type: OrderType) => void;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onNavigateToMenu?: () => void;
  onNavigateToTracking?: (orderId: string) => void;
  onOrderSubmit?: (orderPayload: {
    items: CartItem[];
    orderType: OrderType;
    paymentMethod: PaymentMethodId;
    tipAmount: number;
    notes: string;
    grandTotal: number;
    discountAmount?: number;
  }) => Promise<void>;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  tableInfo,
  orderType,
  tipOptions,
  paymentRails,
  language = 'bn',
  onSetOrderType,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigateToMenu,
  onNavigateToTracking,
  onOrderSubmit,
}) => {
  const [selectedTip, setSelectedTip] = useState<number>(50); // Default ৳50 tip
  const [selectedPaymentRail, setSelectedPaymentRail] = useState<PaymentMethodId>('bkash');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [completedOrderRef, setCompletedOrderRef] = useState<string>('SK-2481');

  // Checkout Switches
  const [needCutlery, setNeedCutlery] = useState(true);
  const [contactlessServing, setContactlessServing] = useState(false);

  // Delivery details state
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');

  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'SULTAN10') {
      const discountVal = Math.round(subtotal * 0.1);
      setAppliedDiscount(discountVal);
      setPromoMessage('Promo "SULTAN10" Applied: 10% Royal Discount!');
    } else if (promoCode.trim().toUpperCase() === 'ROYAL50') {
      setAppliedDiscount(50);
      setPromoMessage('Promo "ROYAL50" Applied: ৳50 Off!');
    } else {
      setPromoMessage('Invalid voucher code. Try "SULTAN10"');
    }
  };

  const handleRemovePromo = () => {
    setAppliedDiscount(0);
    setPromoCode('');
    setPromoMessage(null);
  };

  // Compute bill breakdown (Service charge is 5% for dinein, 0% for takeaway)
  const serviceRate = orderType === 'dinein' ? 0.05 : 0;
  const rawSubtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const subtotal = Math.max(0, rawSubtotal - appliedDiscount);
  const billSummary = calculateBill(subtotal, selectedTip, 0.05, serviceRate);

  const activePaymentRail =
    paymentRails.find((r) => r.id === selectedPaymentRail) || paymentRails[0];

  // Trigger checkout handler
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsProcessing(true);

    try {
      const generatedOrderId = `SK-${Math.floor(2000 + Math.random() * 8000)}`;
      setCompletedOrderRef(generatedOrderId);

      const combinedNotes = [
        specialNotes.trim(),
        needCutlery ? 'Need cutlery' : 'No cutlery',
        contactlessServing ? 'Contactless table drop' : '',
        orderType === 'delivery' && deliveryAddress ? `Delivery to: ${deliveryAddress} (${deliveryPhone})` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      if (onOrderSubmit) {
        await onOrderSubmit({
          items: cartItems,
          orderType,
          paymentMethod: selectedPaymentRail,
          tipAmount: selectedTip,
          notes: combinedNotes,
          grandTotal: billSummary.grandTotal,
          discountAmount: appliedDiscount,
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 900));
      }

      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-10 space-y-5">
      {/* Top Greeting & Dining Context */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#E5A93C] block">
            {language === 'bn' ? 'দাওয়াত ও রাজকীয় ভোজ' : 'Table-Side Feast'}
          </span>
          <h1 className="font-['Playfair_Display'] text-[26px] sm:text-[28px] font-bold text-[#e6e1df] leading-tight">
            {language === 'bn' ? 'অর্ডার ও চেকআউট' : 'Your Order (অর্ডার)'}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2b2a28] border border-[#504535]/50 text-[#F3C669] text-[13px] font-semibold shadow-sm">
          <span
            className="material-symbols-outlined text-[16px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            restaurant
          </span>
          <span>
            {orderType === 'takeaway'
              ? language === 'bn'
                ? 'পার্সেল'
                : 'Takeaway'
              : orderType === 'delivery'
              ? language === 'bn'
                ? 'ডেলিভারি'
                : 'Delivery'
              : language === 'bn'
              ? `টেবিল ${tableInfo.numberBn}`
              : `Table ${tableInfo.number} • Dine-In`}
          </span>
        </div>
      </div>

      {/* Upfront Payment Notice for Takeaway Mode */}
      {orderType === 'takeaway' && (
        <div className="bg-[#211f1e] rounded-xl p-3.5 border border-[#8e1309]/60 flex gap-3 items-start shadow-sm animate-fadeIn">
          <div className="w-8 h-8 rounded-full bg-[#8e1309] text-[#ffb4a8] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">info</span>
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[13px] font-bold text-[#e6e1df]">
              Kitchen Timing Protocol
            </span>
            <p className="text-[12px] text-[#d4c4b0] mt-0.5 leading-relaxed">
              Takeaway and table orders require upfront payment confirmation before charcoal dum-cooking begins.
            </p>
          </div>
        </div>
      )}

      {/* Order Type Segment Switcher (Dine-in / Parcel / Delivery) */}
      <OrderTypeSelector
        selectedType={orderType}
        tableNumberBn={tableInfo.numberBn}
        tableNumberEn={tableInfo.number}
        onSelectType={onSetOrderType}
        language={language}
      />

      {/* If Delivery is selected, show address input */}
      {orderType === 'delivery' && (
        <div className="p-4 rounded-xl bg-[#211f1e] border border-[#E5A93C]/60 space-y-3 shadow-md animate-fadeIn">
          <span className="text-[14px] font-bold text-[#e6e1df] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#E5A93C] text-[18px]">location_on</span>
            <span>Delivery Address & Phone</span>
          </span>
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="House, Road, Area (e.g. House 42, Road 11, Banani, Dhaka)"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#2b2a28] border border-[#504535]/50 text-[#e6e1df] placeholder:text-[#9d8f7c] text-[13px] focus:outline-none focus:border-[#E5A93C]"
          />
          <input
            type="tel"
            value={deliveryPhone}
            onChange={(e) => setDeliveryPhone(e.target.value)}
            placeholder="Contact Number (e.g. 01712-345678)"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#2b2a28] border border-[#504535]/50 text-[#e6e1df] placeholder:text-[#9d8f7c] text-[13px] focus:outline-none focus:border-[#E5A93C]"
          />
        </div>
      )}

      {/* Selected Items Detail List */}
      <CartItemList
        items={cartItems}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onClearCart={onClearCart}
        onAddMoreItems={onNavigateToMenu || (() => {})}
        language={language}
      />

      {/* Collaborative Dine-in Bill Split Card */}
      {orderType === 'dinein' && (
        <SplitBillCard
          onOpenSplitModal={() => setIsSplitModalOpen(true)}
          language={language}
        />
      )}

      {/* Dining Preference Switches */}
      <div className="p-4 rounded-xl bg-[#211f1e] border border-[#363433] space-y-3 shadow-sm">
        <span className="text-[14px] font-bold text-[#e6e1df] block">
          Dining Service Preferences
        </span>

        {/* Switch 1: Cutlery */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-[#E5A93C]">flatware</span>
            <span className="text-[13px] text-[#e6e1df]">
              {language === 'bn' ? 'চামচ ও ওয়েট ন্যাপকিন প্রয়োজন' : 'Eco Cutlery & Wet Napkins'}
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={needCutlery}
            aria-label="Toggle Cutlery"
            onClick={() => setNeedCutlery(!needCutlery)}
            className="min-h-[44px] min-w-[50px] flex items-center justify-center p-1 cursor-pointer"
          >
            <div
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                needCutlery ? 'bg-[#E5A93C]' : 'bg-[#363433]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#141312] shadow-md transition duration-200 ease-in-out ${
                  needCutlery ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Switch 2: Contactless Table Serving */}
        <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-[#363433]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-[#f6c96c]">room_service</span>
            <span className="text-[13px] text-[#e6e1df]">
              {language === 'bn' ? 'স্পর্শহীন পরিবেশন (সরাসরি টেবিলে রাখুন)' : 'Contactless Table Drop'}
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={contactlessServing}
            aria-label="Toggle Contactless Serving"
            onClick={() => setContactlessServing(!contactlessServing)}
            className="min-h-[44px] min-w-[50px] flex items-center justify-center p-1 cursor-pointer"
          >
            <div
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                contactlessServing ? 'bg-[#E5A93C]' : 'bg-[#363433]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#141312] shadow-md transition duration-200 ease-in-out ${
                  contactlessServing ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Royal Promo Voucher Card with Apply Button */}
      <div className="p-4 rounded-xl bg-[#211f1e] border border-[#363433] space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-[#e6e1df] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#E5A93C] text-[18px]">confirmation_number</span>
            <span>{language === 'bn' ? 'ভাউচার বা প্রোমো কোড' : 'Royal Feast Voucher'}</span>
          </span>
          <button
            type="button"
            onClick={() => setPromoCode('SULTAN10')}
            className="text-[11px] text-[#F3C669] hover:underline font-bold"
          >
            Try "SULTAN10"
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter promo code (e.g. SULTAN10)"
            className="flex-1 min-h-[44px] px-3.5 rounded-lg bg-[#2b2a28] border border-[#504535]/50 text-[#e6e1df] placeholder:text-[#9d8f7c] text-[13px] uppercase focus:outline-none focus:border-[#E5A93C]"
          />
          {appliedDiscount > 0 ? (
            <button
              type="button"
              onClick={handleRemovePromo}
              className="min-h-[44px] px-4 rounded-lg bg-[#8e1309] text-[#ffb4a8] font-bold text-[12px] active:scale-95 transition-all cursor-pointer"
            >
              Remove
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApplyPromo}
              className="min-h-[44px] px-5 rounded-lg bg-[#E5A93C] text-[#432c00] font-bold text-[13px] active:scale-95 transition-all cursor-pointer shadow-md"
            >
              Apply
            </button>
          )}
        </div>

        {promoMessage && (
          <div className={`text-[12px] font-semibold mt-1 ${appliedDiscount > 0 ? 'text-[#F3C669]' : 'text-[#ffb4a8]'}`}>
            {promoMessage}
          </div>
        )}
      </div>

      {/* Kitchen Brigade Tip Quick Selector */}
      <TipSelector
        selectedTip={selectedTip}
        options={tipOptions}
        onSelectTip={setSelectedTip}
        language={language}
      />

      {/* Billing Calculation Breakdown */}
      <BillBreakdownCard summary={billSummary} language={language} />

      {/* Seamless Payment Rail Selector */}
      <PaymentRailSelector
        selectedRail={selectedPaymentRail}
        rails={paymentRails}
        onSelectRail={setSelectedPaymentRail}
        language={language}
      />

      {/* Dining Notes & Cutlery Preferences */}
      <SpecialNotesInput
        notes={specialNotes}
        onChangeNotes={setSpecialNotes}
        language={language}
      />

      {/* Guaranteed Sticky Primary Order CTA Box */}
      <StickyOrderCTA
        grandTotal={billSummary.grandTotal}
        paymentRailName={
          language === 'bn' ? activePaymentRail.nameBn : activePaymentRail.name
        }
        isProcessing={isProcessing}
        onCheckout={handleCheckout}
        disabled={cartItems.length === 0}
        language={language}
      />

      {/* Table QR Split Modal */}
      <SplitBillModal
        isOpen={isSplitModalOpen}
        onClose={() => setIsSplitModalOpen(false)}
        totalAmount={billSummary.grandTotal}
        tableNumber={language === 'bn' ? tableInfo.numberBn : tableInfo.number}
        language={language}
      />

      {/* Order Confirmation Success Modal */}
      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          if (onNavigateToTracking) onNavigateToTracking(completedOrderRef);
        }}
        onGoToTracking={() => {
          setIsSuccessModalOpen(false);
          if (onNavigateToTracking) onNavigateToTracking(completedOrderRef);
        }}
        orderNumber={completedOrderRef}
        tableNumber={language === 'bn' ? tableInfo.numberBn : tableInfo.number}
        totalAmount={billSummary.grandTotal}
        paymentRailName={
          language === 'bn' ? activePaymentRail.nameBn : activePaymentRail.name
        }
        language={language}
      />
    </div>
  );
};

export default CheckoutPage;
