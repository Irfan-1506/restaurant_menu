import React from 'react';
import { PaymentMethodId, PaymentRail } from '../../types/restaurant';

interface PaymentRailSelectorProps {
  selectedRail: PaymentMethodId;
  rails: PaymentRail[];
  onSelectRail: (id: PaymentMethodId) => void;
  language: 'bn' | 'en';
}

export const PaymentRailSelector: React.FC<PaymentRailSelectorProps> = ({
  selectedRail,
  rails,
  onSelectRail,
  language,
}) => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-[#e6e1df] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#E5A93C] text-[20px]">
            account_balance_wallet
          </span>
          <span>
            {language === 'bn' ? 'পেমেন্ট মাধ্যম বেছে নিন' : 'Select Payment Method'}
          </span>
        </h2>
        <span className="text-[11px] text-[#9d8f7c] flex items-center gap-1 font-medium">
          <span className="material-symbols-outlined text-[14px] text-[#E5A93C]">
            verified_user
          </span>
          <span>{language === 'bn' ? '১০০% নিরাপদ' : '100% Secured'}</span>
        </span>
      </div>

      {/* Rail Options */}
      <div className="space-y-2.5">
        {rails.map((rail) => {
          const isSelected = selectedRail === rail.id;

          return (
            <label
              key={rail.id}
              onClick={() => onSelectRail(rail.id)}
              className={`cursor-pointer relative flex items-center justify-between p-3.5 min-h-[60px] rounded-xl border transition-all duration-200 select-none ${
                isSelected
                  ? 'bg-[#2b2a28] border-[#E5A93C] shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
                  : 'bg-[#211f1e] border-[#363433]/70 hover:bg-[#282625] hover:border-[#504535]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <input
                  type="radio"
                  name="payment_rail"
                  value={rail.id}
                  checked={isSelected}
                  onChange={() => onSelectRail(rail.id)}
                  className="accent-[#E5A93C] w-4 h-4 flex-shrink-0 cursor-pointer"
                />

                {/* Brand Visual Tile */}
                {rail.iconType === 'bkash' && (
                  <div className="w-10 h-10 rounded-lg bg-[#D12053] flex items-center justify-center text-white font-bold text-[13px] shadow-sm flex-shrink-0">
                    বিকাশ
                  </div>
                )}
                {rail.iconType === 'nagad' && (
                  <div className="w-10 h-10 rounded-lg bg-[#F7941D] flex items-center justify-center text-white font-bold text-[13px] shadow-sm flex-shrink-0">
                    নগদ
                  </div>
                )}
                {rail.iconType === 'card' && (
                  <div className="w-10 h-10 rounded-lg bg-[#3b3937] flex items-center justify-center text-[#E5A93C] shadow-sm flex-shrink-0 border border-[#504535]/50">
                    <span className="material-symbols-outlined text-[20px]">credit_card</span>
                  </div>
                )}
                {rail.iconType === 'cash' && (
                  <div className="w-10 h-10 rounded-lg bg-[#3b3937] flex items-center justify-center text-[#E5A93C] shadow-sm flex-shrink-0 border border-[#504535]/50">
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                  </div>
                )}

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-bold text-[#e6e1df] truncate">
                      {language === 'bn' ? rail.nameBn : rail.name}
                    </span>
                    {rail.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-[#8e1309] text-[#ff9a8a] text-[10px] font-bold tracking-tight">
                        {language === 'bn' ? rail.badgeBn : rail.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#d4c4b0] truncate mt-0.5">
                    {language === 'bn' ? rail.descriptionBn : rail.description}
                  </p>
                </div>
              </div>

              {/* Right Selection Indicator */}
              <div className="flex-shrink-0">
                {isSelected ? (
                  <span
                    className="material-symbols-outlined text-[#E5A93C] text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[#9d8f7c] text-[20px]">
                    radio_button_unchecked
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};
