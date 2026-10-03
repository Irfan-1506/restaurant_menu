import React, { useState } from 'react';
import { BillSummary } from '../../types/restaurant';
import { formatPrice } from '../../utils/formatters';

interface BillBreakdownCardProps {
  summary: BillSummary;
  language: 'bn' | 'en';
}

export const BillBreakdownCard: React.FC<BillBreakdownCardProps> = ({
  summary,
  language,
}) => {
  const [showVatInfo, setShowVatInfo] = useState(false);

  return (
    <div className="p-4 rounded-xl bg-[#1d1b1a] border border-[#363433]/70 space-y-2.5 shadow-md">
      {/* Subtotal */}
      <div className="flex justify-between items-center text-[#d4c4b0] text-[14px]">
        <span>{language === 'bn' ? 'মোট সাবটোটাল' : 'Item Subtotal'}</span>
        <span className="font-semibold text-[#e6e1df]">
          {formatPrice(summary.subtotal)}
        </span>
      </div>

      {/* VAT */}
      <div className="flex justify-between items-center text-[#d4c4b0] text-[14px]">
        <button
          type="button"
          onClick={() => setShowVatInfo(!showVatInfo)}
          className="flex items-center gap-1 hover:text-[#F3C669] transition-colors"
        >
          <span>
            {language === 'bn'
              ? `ভ্যাট (${Math.round(summary.vatRate * 100)}%)`
              : `Govt VAT (${Math.round(summary.vatRate * 100)}%)`}
          </span>
          <span className="material-symbols-outlined text-[15px] text-[#9d8f7c]">
            info
          </span>
        </button>
        <span className="text-[#e6e1df]">
          {formatPrice(summary.vatAmount)}
        </span>
      </div>

      {showVatInfo && (
        <div className="px-2.5 py-1.5 rounded-lg bg-[#2b2a28] text-[11px] text-[#d4c4b0] border border-[#504535]/40 leading-relaxed">
          {language === 'bn'
            ? 'বাংলাদেশ সরকারের জাতীয় রাজস্ব বোর্ড (NBR) নির্ধারিত মানসম্মত ৫% রেস্তোরাঁ মূল্য সংযোজন কর।'
            : 'Statutory 5% restaurant value-added tax under National Board of Revenue (NBR).'}
        </div>
      )}

      {/* Dine-in Service Charge */}
      <div className="flex justify-between items-center text-[#d4c4b0] text-[14px]">
        <span className="flex items-center gap-1">
          {language === 'bn'
            ? `ডাইন-ইন সার্ভিস চার্জ (${Math.round(summary.serviceChargeRate * 100)}%)`
            : `Dine-in Hospitality Charge (${Math.round(summary.serviceChargeRate * 100)}%)`}
        </span>
        <span className="text-[#e6e1df]">
          {formatPrice(summary.serviceChargeAmount)}
        </span>
      </div>

      {/* Kitchen Brigade Tip */}
      <div className="flex justify-between items-center text-[#d4c4b0] text-[14px]">
        <span>
          {language === 'bn' ? 'বাবুর্চি দল টিপস' : 'Kitchen Brigade Gratuity'}
        </span>
        <span className="text-[#F3C669] font-medium">
          {formatPrice(summary.tipAmount)}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#363433] my-2"></div>

      {/* Final Grand Total */}
      <div className="flex justify-between items-center pt-1">
        <span className="text-[17px] font-bold text-[#e6e1df]">
          {language === 'bn' ? 'সর্বমোট প্রদেয়' : 'Total Payable'}
        </span>
        <div className="text-right">
          <span className="font-['Playfair_Display'] text-[24px] font-bold text-[#F3C669] tracking-tight block leading-tight">
            {formatPrice(summary.grandTotal)}
          </span>
          <p className="text-[11px] text-[#9d8f7c] font-medium mt-0.5">
            {language === 'bn' ? 'সর্বমোট অন্তর্ভুক্ত মূল্য' : 'All taxes & service inclusive'}
          </p>
        </div>
      </div>
    </div>
  );
};
