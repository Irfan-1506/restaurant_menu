import React from 'react';

interface SplitBillCardProps {
  onOpenSplitModal: () => void;
  language: 'bn' | 'en';
}

export const SplitBillCard: React.FC<SplitBillCardProps> = ({
  onOpenSplitModal,
  language,
}) => {
  return (
    <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-r from-[#2b2a28] to-[#211f1e] border border-[#504535]/40 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3 min-w-0 pr-2">
        <div className="w-10 h-10 rounded-full bg-[#ffc665]/15 flex items-center justify-center text-[#ffc665] flex-shrink-0 shadow-inner">
          <span className="material-symbols-outlined text-[22px]">group</span>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold text-[#e6e1df] truncate">
              {language === 'bn' ? 'টেবিল স্প্লিট বিল' : 'Table Bill Split'}
            </span>
            <span className="px-1.5 py-0.5 bg-[#e5a93c] text-[#5e4000] text-[10px] font-bold rounded">
              {language === 'bn' ? 'সহজ ভাগাভাগি' : 'Easy Split'}
            </span>
          </div>
          <p className="text-[12px] text-[#d4c4b0] truncate mt-0.5">
            {language === 'bn'
              ? 'সাথের অতিথিরা স্ক্যান করে নিজস্ব অংশ পরিশোধ করুন'
              : 'Guests can scan QR to pay their respective share'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenSplitModal}
        className="px-3 py-2 rounded-lg bg-[#3b3937] hover:bg-[#ffc665] text-[#ffc665] hover:text-[#432c00] text-[12px] font-semibold flex items-center gap-1 transition-all active:scale-95 shadow-sm flex-shrink-0"
      >
        <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
        <span>{language === 'bn' ? 'QR শেয়ার' : 'Share QR'}</span>
      </button>
    </div>
  );
};
