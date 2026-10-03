import React from 'react';
import { formatPrice } from '../../utils/formatters';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToTracking: () => void;
  orderNumber: string;
  tableNumber: string;
  totalAmount: number;
  paymentRailName: string;
  language: 'bn' | 'en';
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  onGoToTracking,
  orderNumber,
  tableNumber,
  totalAmount,
  paymentRailName,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-[#1d1b1a] border border-[#ffc665]/40 p-6 shadow-2xl flex flex-col items-center text-center gap-4">
        {/* Animated Celebration Icon */}
        <div className="w-16 h-16 rounded-full bg-[#ffc665]/20 border border-[#ffc665] flex items-center justify-center text-[#ffc665] shadow-[0_0_24px_rgba(255,198,101,0.4)] animate-bounce">
          <span
            className="material-symbols-outlined text-[36px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>

        {/* Title */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#ffc665] block mb-1">
            {language === 'bn' ? 'রাজকীয় ভোজের অর্ডার গৃহীত' : 'Feast Order Received'}
          </span>
          <h2 className="font-['Playfair_Display'] text-[22px] font-bold text-[#e6e1df]">
            {language === 'bn' ? 'ধন্যবাদ ও মোবারকবাদ!' : 'Thank you for your order!'}
          </h2>
          <p className="text-[13px] text-[#d4c4b0] mt-1">
            {language === 'bn'
              ? `টেবিল ${tableNumber}-এর অর্ডার সফলভাবে বাবুর্চিখানায় প্রিন্ট হয়েছে।`
              : `Order for Table ${tableNumber} has been sent to the royal kitchen.`}
          </p>
        </div>

        {/* Order Details Badge */}
        <div className="w-full bg-[#211f1e] p-3.5 rounded-xl border border-[#363433] space-y-1.5 text-[13px]">
          <div className="flex justify-between text-[#d4c4b0]">
            <span>{language === 'bn' ? 'অর্ডার নম্বর:' : 'Order Ref:'}</span>
            <span className="font-bold text-[#ffc665]">{orderNumber}</span>
          </div>
          <div className="flex justify-between text-[#d4c4b0]">
            <span>{language === 'bn' ? 'পেমেন্ট মাধ্যম:' : 'Payment Rail:'}</span>
            <span className="text-[#e6e1df] font-semibold">{paymentRailName}</span>
          </div>
          <div className="flex justify-between text-[#d4c4b0] pt-1 border-t border-[#363433]">
            <span>{language === 'bn' ? 'সর্বমোট পরিশোধিত:' : 'Total Amount:'}</span>
            <span className="font-bold text-[#F3C669] text-[15px]">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={onGoToTracking}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F3C669] to-[#E5A93C] text-[#432c00] font-bold text-[14px] shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">timer</span>
            <span>
              {language === 'bn' ? 'কিচেন দম ট্র্যাকিং দেখুন' : 'Track Dum Cooking'}
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-[13px] text-[#d4c4b0] hover:text-[#ffc665] transition-colors"
          >
            {language === 'bn' ? 'ডাইনিং ডেস্কে ফিরুন' : 'Back to Dining Desk'}
          </button>
        </div>
      </div>
    </div>
  );
};
