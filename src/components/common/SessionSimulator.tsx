import React, { useState } from 'react';
import { OrderType } from '../../types/restaurant';

interface SessionSimulatorProps {
  currentMode: OrderType;
  tableNumber: string;
  onSelectMode: (mode: OrderType, tableNum?: string) => void;
  language: 'bn' | 'en';
}

export const SessionSimulator: React.FC<SessionSimulatorProps> = ({
  currentMode,
  tableNumber,
  onSelectMode,
  language,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full mb-3 rounded-xl bg-[#1d1b1a] border border-[#504535]/50 overflow-hidden shadow-sm transition-all">
      <div className="px-3.5 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#E5A93C]">
            qr_code_scanner
          </span>
          <span className="text-[12px] text-[#d4c4b0] font-medium">
            {currentMode === 'takeaway' ? (
              <span className="text-[#FF85B3] font-semibold">Takeaway Mode</span>
            ) : (
              <span className="text-[#F3C669] font-semibold">Table {tableNumber} • Dine-In</span>
            )}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="min-h-[44px] px-2 flex items-center gap-1 text-[11px] font-semibold text-[#E5A93C] hover:text-[#F3C669] transition-colors"
        >
          <span>{isExpanded ? (language === 'bn' ? 'লুকান' : 'Hide') : (language === 'bn' ? 'সিমুলেট QR' : 'Simulate QR')}</span>
          <span
            className={`material-symbols-outlined text-[16px] transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          >
            expand_more
          </span>
        </button>
      </div>

      {isExpanded && (
        <div className="px-3.5 pb-3 pt-1 border-t border-[#363433] bg-[#141312]/60 flex flex-col gap-2">
          <p className="text-[11px] text-[#9d8f7c]">
            {language === 'bn'
              ? 'ডাইনিং টেবিল কিউআর কোড স্ক্যান বা পার্সেল মোড টেস্ট করুন:'
              : 'Test QR session scan parameter (?table=08 vs ?type=takeaway):'}
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSelectMode('dinein', '08')}
              className={`min-h-[44px] px-3 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                currentMode === 'dinein' && tableNumber === '08'
                  ? 'bg-[#E5A93C] text-[#432c00] border-[#E5A93C] font-bold shadow-md'
                  : 'bg-[#2b2a28] text-[#e6e1df] border-[#504535]/50 hover:bg-[#3b3937]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">restaurant</span>
              <span>?table=08 (Dine-In)</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMode('takeaway')}
              className={`min-h-[44px] px-3 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                currentMode === 'takeaway'
                  ? 'bg-[#E5A93C] text-[#432c00] border-[#E5A93C] font-bold shadow-md'
                  : 'bg-[#2b2a28] text-[#e6e1df] border-[#504535]/50 hover:bg-[#3b3937]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">takeout_dining</span>
              <span>?type=takeaway</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
