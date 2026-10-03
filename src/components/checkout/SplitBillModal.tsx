import React, { useState } from 'react';
import { formatPrice, toBanglaDigits } from '../../utils/formatters';

interface SplitBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  tableNumber: string;
  language: 'bn' | 'en';
}

export const SplitBillModal: React.FC<SplitBillModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  tableNumber,
  language,
}) => {
  const [splitCount, setSplitCount] = useState(4);
  const [splitMode, setSplitMode] = useState<'equal' | 'itemized'>('equal');
  const [copied, setCopied] = useState(false);
  const [paidShareFeedback, setPaidShareFeedback] = useState(false);

  if (!isOpen) return null;

  const perPersonAmount = Math.ceil(totalAmount / splitCount);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/?table=${tableNumber}&split=${perPersonAmount}`
      );
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayMyShare = () => {
    setPaidShareFeedback(true);
    setTimeout(() => {
      setPaidShareFeedback(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-[#1d1b1a] border border-[#504535]/60 p-5 shadow-2xl flex flex-col gap-4 text-center">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#363433]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffc665] text-[22px]">
              group
            </span>
            <span className="font-['Playfair_Display'] text-[17px] font-bold text-[#e6e1df]">
              {language === 'bn' ? `টেবিল ${tableNumber} স্প্লিট বিল` : `Table ${tableNumber} Bill Split`}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Split Bill Modal"
            className="w-8 h-8 rounded-full bg-[#2b2a28] text-[#d4c4b0] hover:text-[#ffc665] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Split Mode Segmented Switch Buttons */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#0f0e0d] rounded-xl border border-[#363433]">
          <button
            type="button"
            role="switch"
            aria-checked={splitMode === 'equal'}
            onClick={() => setSplitMode('equal')}
            className={`py-2 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
              splitMode === 'equal'
                ? 'bg-[#2b2a28] text-[#F3C669] shadow-sm border border-[#504535]/50'
                : 'text-[#d4c4b0] hover:text-[#e6e1df]'
            }`}
          >
            {language === 'bn' ? 'সমান ভাগ (Equal)' : 'Equal Split'}
          </button>

          <button
            type="button"
            role="switch"
            aria-checked={splitMode === 'itemized'}
            onClick={() => setSplitMode('itemized')}
            className={`py-2 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
              splitMode === 'itemized'
                ? 'bg-[#2b2a28] text-[#F3C669] shadow-sm border border-[#504535]/50'
                : 'text-[#d4c4b0] hover:text-[#e6e1df]'
            }`}
          >
            {language === 'bn' ? 'পদ অনুসারে (Items)' : 'Itemized Split'}
          </button>
        </div>

        {/* QR Code Container */}
        <div className="mx-auto p-4 rounded-xl bg-white flex flex-col items-center justify-center shadow-lg">
          <div className="w-36 h-36 bg-[#141312] p-2 rounded-lg relative flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="w-10 h-10 border-4 border-[#ffc665] p-1 flex items-center justify-center">
                <div className="w-4 h-4 bg-[#ffc665]"></div>
              </div>
              <div className="w-10 h-10 border-4 border-[#ffc665] p-1 flex items-center justify-center">
                <div className="w-4 h-4 bg-[#ffc665]"></div>
              </div>
            </div>
            {/* Center Brand Icon */}
            <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[#e5a93c] flex items-center justify-center text-[#432c00] font-bold text-[10px] shadow-md border-2 border-white">
              T-{tableNumber}
            </div>
            <div className="flex justify-between">
              <div className="w-10 h-10 border-4 border-[#ffc665] p-1 flex items-center justify-center">
                <div className="w-4 h-4 bg-[#ffc665]"></div>
              </div>
              <div className="w-10 h-10 flex flex-wrap gap-1 p-1">
                <div className="w-3 h-3 bg-[#ffc665]"></div>
                <div className="w-3 h-3 bg-[#ffc665]"></div>
              </div>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#141312] mt-2 tracking-wide uppercase">
            Scan to Pay via bKash / Nagad
          </span>
        </div>

        {/* Split count controls */}
        <div className="bg-[#211f1e] p-3 rounded-xl border border-[#363433] space-y-2">
          <div className="flex justify-between items-center text-[13px] text-[#d4c4b0]">
            <span>{language === 'bn' ? 'অতিথি সংখ্যা (ভাগ)' : 'Number of Guests'}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease guest count"
                onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                className="w-8 h-8 rounded-full bg-[#2b2a28] text-[#e6e1df] hover:text-[#ffc665] flex items-center justify-center text-sm font-bold active:scale-90 cursor-pointer"
              >
                -
              </button>
              <span className="font-bold text-[#ffc665] text-[15px] min-w-[20px] text-center">
                {language === 'bn' ? toBanglaDigits(splitCount) : splitCount}
              </span>
              <button
                type="button"
                aria-label="Increase guest count"
                onClick={() => setSplitCount(Math.min(12, splitCount + 1))}
                className="w-8 h-8 rounded-full bg-[#2b2a28] text-[#e6e1df] hover:text-[#ffc665] flex items-center justify-center text-sm font-bold active:scale-90 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Touch Slider */}
          <input
            type="range"
            min="2"
            max="12"
            value={splitCount}
            onChange={(e) => setSplitCount(parseInt(e.target.value, 10))}
            className="w-full accent-[#E5A93C] cursor-pointer"
          />

          <div className="pt-1 flex justify-between items-center text-[14px]">
            <span className="text-[#e6e1df] font-medium">
              {language === 'bn' ? 'জনপ্রতি প্রদেয়:' : 'Each Guest Pays:'}
            </span>
            <span className="font-['Playfair_Display'] text-[18px] font-bold text-[#F3C669]">
              {formatPrice(perPersonAmount)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handlePayMyShare}
            className="w-full min-h-[44px] rounded-xl bg-gradient-to-r from-[#F3C669] to-[#E5A93C] text-[#432c00] font-bold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">payments</span>
            <span>
              {paidShareFeedback
                ? 'Your Share Paid via bKash!'
                : `Pay My Share (${formatPrice(perPersonAmount)})`}
            </span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full min-h-[44px] rounded-xl bg-[#2b2a28] hover:bg-[#3b3937] text-[#ffc665] border border-[#504535] text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>
              {copied
                ? language === 'bn' ? 'লিংক কপি করা হয়েছে!' : 'Payment Link Copied!'
                : language === 'bn' ? 'পেমেন্ট লিংক কপি করুন' : 'Copy Payment Link'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
