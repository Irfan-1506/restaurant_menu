import React from 'react';

export type NavTab = 'menu' | 'checkout' | 'tracking' | 'management' | 'analytics';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  cartItemCount: number;
  language: 'bn' | 'en';
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  cartItemCount,
  language,
}) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom,0px)] bg-[#0f0e0d]/95 backdrop-blur-2xl border-t border-[#504535]/30 shadow-[0_-8px_32px_rgba(0,0,0,0.6)]"
      aria-label="Main PWA Navigation"
    >
      <div className="max-w-md mx-auto flex justify-around items-center h-20 px-1 sm:px-2">
        {/* Tab 1: Menu */}
        <button
          type="button"
          onClick={() => onSelectTab('menu')}
          aria-current={activeTab === 'menu' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] min-h-[48px] py-1 transition-all cursor-pointer ${
            activeTab === 'menu' ? 'text-[#F3C669] font-bold' : 'text-[#d4c4b0] hover:text-[#e6e1df]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={activeTab === 'menu' ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            restaurant_menu
          </span>
          <span className="text-[11px] font-semibold mt-0.5">
            {language === 'bn' ? 'মেনু' : 'Menu'}
          </span>
        </button>

        {/* Tab 2: Checkout / Table Order */}
        <button
          type="button"
          onClick={() => onSelectTab('checkout')}
          aria-current={activeTab === 'checkout' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] min-h-[48px] py-1 relative transition-all cursor-pointer ${
            activeTab === 'checkout' ? 'text-[#F3C669] font-bold' : 'text-[#d4c4b0] hover:text-[#e6e1df]'
          }`}
        >
          <span className="relative flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[24px]"
              style={activeTab === 'checkout' ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              room_service
            </span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 min-w-[18px] text-center bg-[#E5A93C] text-[#432c00] text-[10px] font-black rounded-full shadow-sm">
                {cartItemCount}
              </span>
            )}
          </span>
          <span className="text-[11px] font-semibold mt-0.5">
            {language === 'bn' ? 'অর্ডার' : 'Order'}
          </span>
        </button>

        {/* Tab 3: Tracking */}
        <button
          type="button"
          onClick={() => onSelectTab('tracking')}
          aria-current={activeTab === 'tracking' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] min-h-[48px] py-1 relative transition-all cursor-pointer ${
            activeTab === 'tracking' ? 'text-[#F3C669] font-bold' : 'text-[#d4c4b0] hover:text-[#e6e1df]'
          }`}
        >
          <span className="relative flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[24px]"
              style={activeTab === 'tracking' ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              timer
            </span>
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#ffb4a8] ring-2 ring-[#0f0e0d]"></span>
          </span>
          <span className="text-[11px] font-semibold mt-0.5">
            {language === 'bn' ? 'ট্র্যাকিং' : 'Tracking'}
          </span>
        </button>

        {/* Tab 4: Staff POS */}
        <button
          type="button"
          onClick={() => onSelectTab('management')}
          aria-current={activeTab === 'management' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] min-h-[48px] py-1 transition-all cursor-pointer ${
            activeTab === 'management' ? 'text-[#F3C669] font-bold' : 'text-[#d4c4b0] hover:text-[#e6e1df]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={activeTab === 'management' ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            point_of_sale
          </span>
          <span className="text-[11px] font-semibold mt-0.5">
            {language === 'bn' ? 'POS' : 'Staff POS'}
          </span>
        </button>

        {/* Tab 5: Owner Analytics */}
        <button
          type="button"
          onClick={() => onSelectTab('analytics')}
          aria-current={activeTab === 'analytics' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] min-h-[48px] py-1 transition-all cursor-pointer ${
            activeTab === 'analytics' ? 'text-[#F3C669] font-bold' : 'text-[#d4c4b0] hover:text-[#e6e1df]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={activeTab === 'analytics' ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            analytics
          </span>
          <span className="text-[11px] font-semibold mt-0.5">
            {language === 'bn' ? 'ইনসাইটস' : 'Insights'}
          </span>
        </button>
      </div>
    </nav>
  );
};
