import React from 'react';
import { OrderType } from '../../types/restaurant';

interface OrderTypeSelectorProps {
  selectedType: OrderType;
  tableNumberBn: string;
  tableNumberEn: string;
  onSelectType: (type: OrderType) => void;
  language: 'bn' | 'en';
}

export const OrderTypeSelector: React.FC<OrderTypeSelectorProps> = ({
  selectedType,
  tableNumberBn,
  tableNumberEn,
  onSelectType,
  language,
}) => {
  const options = [
    {
      id: 'dinein' as OrderType,
      icon: 'table_restaurant',
      labelBn: `ডাইন-ইন (${tableNumberBn})`,
      labelEn: `Dine-in (${tableNumberEn})`,
    },
    {
      id: 'takeaway' as OrderType,
      icon: 'takeout_dining',
      labelBn: 'পার্সেল',
      labelEn: 'Takeaway',
    },
    {
      id: 'delivery' as OrderType,
      icon: 'delivery_dining',
      labelBn: 'হোম ডেলিভারি',
      labelEn: 'Delivery',
    },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Order Type Selector"
      className="grid grid-cols-3 gap-1 p-1 bg-[#0f0e0d] rounded-xl border border-[#363433]/50 shadow-inner"
    >
      {options.map((option) => {
        const isSelected = selectedType === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelectType(option.id)}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg transition-all duration-200 min-h-[52px] ${
              isSelected
                ? 'bg-[#2b2a28] text-[#ffc665] shadow-md border border-[#504535]/50'
                : 'text-[#d4c4b0] hover:text-[#e6e1df] hover:bg-[#1d1b1a]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[19px]"
              style={isSelected ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {option.icon}
            </span>
            <span className="text-[12px] font-semibold mt-0.5 truncate max-w-full">
              {language === 'bn' ? option.labelBn : option.labelEn}
            </span>
          </button>
        );
      })}
    </div>
  );
};
