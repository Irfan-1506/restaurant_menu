import React, { useState } from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
  onOpenReceipts: () => void;
  language: 'bn' | 'en';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  tableNumber,
  onOpenReceipts,
  language,
}) => {
  const [smsReceipts, setSmsReceipts] = useState(true);
  const [bengaliAudio, setBengaliAudio] = useState(true);
  const [coinsRedeemed, setCoinsRedeemed] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-[#1d1b1a] border border-[#504535]/60 p-5 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#363433]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#E5A93C] text-[20px]">
              account_circle
            </span>
            <h3 className="font-['Playfair_Display'] text-[17px] font-bold text-[#e6e1df]">
              {language === 'bn' ? 'রাজকীয় মেহমান প্রোফাইল' : 'Patron Profile'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Profile"
            className="min-w-[44px] min-h-[44px] -mr-2 rounded-full flex items-center justify-center text-[#d4c4b0] hover:text-[#F3C669] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 bg-[#211f1e] p-3.5 rounded-xl border border-[#363433]">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKFr5EE_NjCT8VM1Gn_nD-l-4kRPomsTAxgRyFaVNachC3P0K5DiBrsBh_52bBLrpCLtXAR2tFPJpFf0Vra2W2JZyGNOdtssibfAk6Ik_p5_XI2eICFRjXxiALrU8MYJ0-w1MCI6BovMJlHYIqd1yeaq9POTyjAicB3rncD8Id5rhPsBgO09kIoUli0vrFvWnY3hEd_qJwxMKea1VLqlUmKKZw5jLHcEDZPgCQQt_tWxNZ-7ustVyU1g"
            alt="Patron"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E5A93C]"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] font-bold text-[#e6e1df]">
              Adeeb Irfanul
            </span>
            <span className="text-[11px] text-[#F3C669] font-semibold">
              VIP Royal Patron • Level 4
            </span>
            <span className="text-[11px] text-[#9d8f7c]">
              Active on Table {tableNumber}
            </span>
          </div>
        </div>

        {/* Shahi Rewards Balance with Redeem Button */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#2b2a28] to-[#211f1e] border border-[#504535]/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#9d8f7c] uppercase font-semibold">
              Shahi Coins (লয়্যালটি পয়েন্ট)
            </span>
            <span className="font-['Playfair_Display'] text-[20px] font-bold text-[#F3C669]">
              {coinsRedeemed ? '0 Pts (৳0)' : '850 Pts (৳850)'}
            </span>
          </div>
          <button
            type="button"
            disabled={coinsRedeemed}
            onClick={() => {
              setCoinsRedeemed(true);
              showToast('৮৫০ শাহী কয়েন রিডিম করা হয়েছে!');
            }}
            className="min-h-[44px] px-3.5 rounded-full bg-[#E5A93C] text-[#432c00] text-[12px] font-bold active:scale-95 transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            {coinsRedeemed ? 'Redeemed' : 'Redeem'}
          </button>
        </div>

        {/* Interactive Preferences Switch Group */}
        <div className="space-y-2.5 p-3 rounded-xl bg-[#211f1e] border border-[#363433]">
          <span className="text-[12px] font-bold text-[#e6e1df] block">
            Patron Preferences
          </span>

          {/* Switch 1: SMS Receipts */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#E5A93C]">sms</span>
              <span className="text-[12px] text-[#d4c4b0]">SMS Digital Receipt</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={smsReceipts}
              onClick={() => setSmsReceipts(!smsReceipts)}
              className="min-h-[44px] min-w-[50px] flex items-center justify-center p-1 cursor-pointer"
            >
              <div
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                  smsReceipts ? 'bg-[#E5A93C]' : 'bg-[#363433]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#141312] shadow-md transition duration-200 ease-in-out ${
                    smsReceipts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Switch 2: Bengali Audio Announcements */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#363433]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#F3C669]">volume_up</span>
              <span className="text-[12px] text-[#d4c4b0]">বাংলা ভয়েস নোটিফিকেশন</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={bengaliAudio}
              onClick={() => setBengaliAudio(!bengaliAudio)}
              className="min-h-[44px] min-w-[50px] flex items-center justify-center p-1 cursor-pointer"
            >
              <div
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                  bengaliAudio ? 'bg-[#E5A93C]' : 'bg-[#363433]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#141312] shadow-md transition duration-200 ease-in-out ${
                    bengaliAudio ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenReceipts();
            }}
            className="min-h-[44px] w-full px-4 rounded-xl bg-[#2b2a28] hover:bg-[#3b3937] text-[#e6e1df] border border-[#504535]/50 text-[13px] font-semibold flex items-center justify-between transition-colors active:scale-95 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#E5A93C]">receipt_long</span>
              <span>{language === 'bn' ? 'বর্তমান অর্ডার ও রসিদ' : 'Active Order Receipt'}</span>
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#9d8f7c]">chevron_right</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F3C669] to-[#E5A93C] text-[#432c00] font-bold text-[13px] flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-md"
          >
            {language === 'bn' ? 'ঠিক আছে' : 'Close'}
          </button>
        </div>

        {toastMsg && (
          <div className="text-[11px] text-[#F3C669] text-center font-bold animate-fadeIn">
            {toastMsg}
          </div>
        )}
      </div>
    </div>
  );
};
