import React from 'react';

interface SpecialNotesInputProps {
  notes: string;
  onChangeNotes: (notes: string) => void;
  language: 'bn' | 'en';
}

export const SpecialNotesInput: React.FC<SpecialNotesInputProps> = ({
  notes,
  onChangeNotes,
  language,
}) => {
  return (
    <div className="p-4 rounded-xl bg-[#211f1e] border border-[#363433]/70 space-y-2.5 shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-semibold text-[#e6e1df] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#f6c96c] text-[20px]">
            edit_note
          </span>
          <span>
            {language === 'bn'
              ? 'বিশেষ রন্ধন নির্দেশ বা নোট'
              : 'Kitchen Preparation Notes'}
          </span>
        </span>
        <span className="text-[11px] text-[#9d8f7c] font-medium">
          {language === 'bn' ? 'ঐচ্ছিক' : 'Optional'}
        </span>
      </div>

      <input
        type="text"
        value={notes}
        onChange={(e) => onChangeNotes(e.target.value)}
        placeholder={
          language === 'bn'
            ? 'যেমন: ঝাল কম, অতিরিক্ত পেঁয়াজ সালাদ ও লেবু দিন...'
            : 'e.g. less spice, extra sliced lemon and fried beresta...'
        }
        className="w-full px-3.5 py-2.5 rounded-lg bg-[#2b2a28] border border-[#504535]/40 text-[#e6e1df] placeholder:text-[#9d8f7c] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#ffc665] transition-all"
      />
    </div>
  );
};
