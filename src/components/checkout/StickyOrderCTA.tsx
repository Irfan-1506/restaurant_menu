import React from 'react';
import { formatPrice } from '../../utils/formatters';

interface StickyOrderCTAProps {
  grandTotal: number;
  paymentRailName: string;
  isProcessing: boolean;
  onCheckout: () => void;
  language: 'bn' | 'en';
  disabled?: boolean;
}

export const StickyOrderCTA: React.FC<StickyOrderCTAProps> = ({
  grandTotal,
  paymentRailName,
  isProcessing,
  onCheckout,
  language,
  disabled = false,
}) => {
  return (
    <div className="sticky bottom-20 left-0 right-0 z-40 pt-2 pb-2 bg-gradient-to-t from-[#141312] via-[#141312]/95 to-transparent">
      <div className="p-3 rounded-2xl bg-[#2b2a28]/95 border border-[#504535]/50 backdrop-blur-xl shadow-[0_8px_32px_-4px_rgba(229,169,60,0.28)] flex flex-col gap-2">
        <button
          type="button"
          disabled={disabled || isProcessing}
          onClick={onCheckout}
          className="w-full h-14 rounded-xl bg-gradient-to-r from-[#F3C669] via-[#E5A93C] to-[#fabc4d] text-[#432c00] font-bold text-[16px] sm:text-[17px] flex items-center justify-between px-4 sm:px-5 shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center w-full gap-2">
              <span className="animate-spin material-symbols-outlined text-[20px]">
                progress_activity
              </span>
              <span>
                {language === 'bn' ? 'কিচেন প্রিন্ট হচ্ছে...' : 'Printing to Kitchen...'}
              </span>
            </span>
          ) : (
            <>
              <span className="flex items-center gap-2 truncate pr-2">
                <span className="material-symbols-outlined text-[22px]">lock</span>
                <span className="truncate">
                  {language === 'bn'
                    ? `অর্ডার নিশ্চিত করুন (${paymentRailName})`
                    : `Confirm Order (${paymentRailName})`}
                </span>
              </span>
              <span className="font-extrabold text-[17px] flex-shrink-0">
                {formatPrice(grandTotal)}
              </span>
            </>
          )}
        </button>

        {/* Security and kitchen print reassurance markers */}
        <div className="flex items-center justify-center gap-3 text-[#9d8f7c] text-[11px] font-medium">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-[#E5A93C]">
              security
            </span>
            <span>
              {language === 'bn' ? 'SSL ২০৪৮-বিট এনক্রিপশন' : '2048-bit SSL Encryption'}
            </span>
          </span>
          <span className="text-[#504535]">•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-[#F3C669]">
              bolt
            </span>
            <span>
              {language === 'bn' ? 'সরাসরি কিচেনে প্রিন্ট হবে' : 'Direct Kitchen KOT Print'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
