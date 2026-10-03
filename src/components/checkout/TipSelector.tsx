import React, { useState } from 'react';
import { TipOption } from '../../types/restaurant';
import { formatPrice } from '../../utils/formatters';

interface TipSelectorProps {
  selectedTip: number;
  options: TipOption[];
  onSelectTip: (amount: number) => void;
  language: 'bn' | 'en';
}

export const TipSelector: React.FC<TipSelectorProps> = ({
  selectedTip,
  options,
  onSelectTip,
  language,
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const handleCustomTipSubmit = () => {
    const parsed = parseInt(customAmount, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onSelectTip(parsed);
      setShowCustomInput(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Title & Selected Tip readout */}
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-semibold text-[#e6e1df] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#ffb4a8] text-[20px]">
            volunteer_activism
          </span>
          <span>
            {language === 'bn'
              ? 'বাবুর্চি ও পরিবেশকদের বকশিশ (টিপস)'
              : 'Kitchen Brigade & Server Gratuity'}
          </span>
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[12px] font-bold text-[#F3C669]">
            {selectedTip > 0
              ? `${formatPrice(selectedTip)} ${language === 'bn' ? 'নির্বাচিত' : 'Selected'}`
              : language === 'bn'
              ? 'কোনো টিপস নেই'
              : 'No tip'}
          </span>
          <button
            type="button"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="text-[11px] text-[#E5A93C] hover:underline font-semibold ml-1 cursor-pointer"
          >
            {showCustomInput ? 'Close' : 'Custom'}
          </button>
        </div>
      </div>

      {/* Button Grid with Custom Tip Switch */}
      <div className="grid grid-cols-4 gap-2">
        {options.map((option) => {
          const isSelected = selectedTip === option.amount && !showCustomInput;
          return (
            <button
              key={option.amount}
              type="button"
              onClick={() => {
                setShowCustomInput(false);
                onSelectTip(option.amount);
              }}
              className={`min-h-[44px] py-2.5 rounded-lg text-center transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#F3C669] to-[#E5A93C] text-[#432c00] font-bold text-[14px] shadow-[0_4px_16px_rgba(229,169,60,0.35)] scale-[1.02]'
                  : 'bg-[#211f1e] text-[#e6e1df] hover:bg-[#2b2a28] font-medium text-[13px] border border-[#363433]/70 active:scale-95'
              }`}
            >
              {option.amount === 0 ? (language === 'bn' ? 'পরে দেব' : 'None') : formatPrice(option.amount)}
            </button>
          );
        })}
      </div>

      {/* Custom Tip Input Switch Drawer */}
      {showCustomInput && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-[#211f1e] border border-[#E5A93C]/50 animate-fadeIn">
          <span className="text-[13px] text-[#d4c4b0] pl-1">৳</span>
          <input
            type="number"
            min="0"
            step="10"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="Custom Tip (e.g. 150)"
            className="flex-1 bg-transparent text-[#e6e1df] placeholder:text-[#9d8f7c] text-[13px] focus:outline-none py-1"
          />
          <button
            type="button"
            onClick={handleCustomTipSubmit}
            className="min-h-[36px] px-3.5 rounded-lg bg-[#E5A93C] text-[#432c00] font-bold text-[12px] active:scale-95 transition-transform cursor-pointer"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};
