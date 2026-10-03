import React from 'react';
import { Logo } from './Logo';
import { OrderType, TableInfo } from '../../types/restaurant';

interface HeaderProps {
  tableInfo: TableInfo;
  orderType: OrderType;
  language: 'bn' | 'en';
  onToggleLanguage: () => void;
  onOpenTableSelect?: () => void;
  onNavigateHome?: () => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tableInfo,
  orderType,
  language,
  onToggleLanguage,
  onOpenTableSelect,
  onNavigateHome,
  onOpenProfile,
}) => {
  return (
    <header className="sticky top-0 left-0 right-0 w-full z-50 pt-[env(safe-area-inset-top,0px)] bg-[#141312]/92 backdrop-blur-xl border-b border-[#504535]/30 shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-all">
      <div className="max-w-md mx-auto h-20 px-4 sm:px-5 flex items-center justify-between gap-2">
        {/* Left: Brand Crest & Table Sync Status */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onNavigateHome}
            aria-label="Return to Menu Home"
            className="flex items-center min-w-[44px] min-h-[44px] -ml-1 text-left active:scale-95 transition-transform"
          >
            <Logo size={42} className="flex-shrink-0" />
          </button>

          <div className="flex flex-col min-w-0">
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-left font-['Playfair_Display'] text-[17px] font-bold text-[#F3C669] hover:text-[#E5A93C] tracking-tight truncate flex items-center gap-1.5"
            >
              <span>{language === 'bn' ? 'সুলতানস কিচেন' : "Sultan's Kitchen"}</span>
              <span className="flex h-2 w-2 relative flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5A93C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E5A93C]"></span>
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenTableSelect}
              className="flex items-center gap-1.5 text-left text-[11px] text-[#d4c4b0] hover:text-[#F3C669] transition-colors py-0.5 min-h-[24px]"
            >
              <span className="truncate font-medium">
                {orderType === 'takeaway'
                  ? language === 'bn'
                    ? 'পার্সেল • Takeaway'
                    : 'Takeaway • Parcel'
                  : language === 'bn'
                  ? `Table ${tableInfo.number} • Dine-In`
                  : `Table ${tableInfo.number} • Dine-In`}
              </span>
              <span className="text-[#504535]">•</span>
              <span className="text-[#F3C669] flex items-center gap-0.5 text-[11px] font-medium">
                <span className="material-symbols-outlined text-[13px]">cloud_done</span>
                {language === 'bn' ? 'Synced' : 'Synced'}
              </span>
            </button>
          </div>
        </div>

        {/* Right: Language Switcher & Profile Avatar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onToggleLanguage}
            aria-label="Switch Language between English and Bengali"
            className="min-h-[44px] min-w-[58px] px-3 rounded-full bg-[#2b2a28] text-[#e6e1df] flex items-center justify-center text-[12px] font-bold border border-[#504535]/50 hover:bg-[#3b3937] active:scale-95 transition-all shadow-sm"
          >
            <span className={language === 'en' ? 'text-[#F3C669] font-extrabold' : 'text-[#d4c4b0]'}>EN</span>
            <span className="text-[#9d8f7c] mx-1">/</span>
            <span className={language === 'bn' ? 'text-[#F3C669] font-extrabold' : 'text-[#d4c4b0]'}>বাং</span>
          </button>

          <button
            type="button"
            onClick={onOpenProfile}
            aria-label="View Profile and Loyalty Rewards"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center -mr-1 active:scale-95 transition-transform cursor-pointer"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKFr5EE_NjCT8VM1Gn_nD-l-4kRPomsTAxgRyFaVNachC3P0K5DiBrsBh_52bBLrpCLtXAR2tFPJpFf0Vra2W2JZyGNOdtssibfAk6Ik_p5_XI2eICFRjXxiALrU8MYJ0-w1MCI6BovMJlHYIqd1yeaq9POTyjAicB3rncD8Id5rhPsBgO09kIoUli0vrFvWnY3hEd_qJwxMKea1VLqlUmKKZw5jLHcEDZPgCQQt_tWxNZ-7ustVyU1g"
              alt="Patron Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-[#E5A93C]/70 shadow-sm"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
