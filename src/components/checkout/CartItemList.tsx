import React from 'react';
import { CartItem } from '../../types/restaurant';
import { formatPrice } from '../../utils/formatters';

interface CartItemListProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart?: () => void;
  onAddMoreItems: () => void;
  language: 'bn' | 'en';
}

export const CartItemList: React.FC<CartItemListProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onAddMoreItems,
  language,
}) => {
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-[#e6e1df] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#E5A93C] text-[20px]">
            receipt_long
          </span>
          <span>
            {language === 'bn'
              ? `নির্বাচিত খাবারসমূহ (${totalItemCount})`
              : `Selected Items (${totalItemCount})`}
          </span>
        </h2>

        <div className="flex items-center gap-2">
          {items.length > 0 && onClearCart && (
            <button
              type="button"
              onClick={onClearCart}
              className="min-h-[44px] px-2.5 text-[12px] font-medium text-[#ffb4ab] hover:text-[#ff9a8a] active:opacity-75 flex items-center transition-colors"
            >
              {language === 'bn' ? 'খালি করুন' : 'Clear Cart'}
            </button>
          )}

          <button
            type="button"
            onClick={onAddMoreItems}
            className="min-h-[44px] px-2 text-[12px] font-bold text-[#F3C669] hover:text-[#E5A93C] flex items-center gap-0.5 hover:underline transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>{language === 'bn' ? 'আরও যোগ করুন' : 'Add Items'}</span>
          </button>
        </div>
      </div>

      {/* Cart Items List */}
      {items.length === 0 ? (
        <div className="p-8 text-center bg-[#211f1e] rounded-xl border border-[#363433] flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-[44px] text-[#9d8f7c]">
            remove_shopping_cart
          </span>
          <span className="text-[16px] font-semibold text-[#e6e1df]">
            {language === 'bn' ? 'আপনার পাত্র খালি রয়েছে' : 'Your Feast Tray is Empty'}
          </span>
          <p className="text-[13px] text-[#d4c4b0]">
            {language === 'bn'
              ? 'রাজকীয় মেনু থেকে আপনার পছন্দের খাবার বেছে নিন'
              : 'Explore the royal culinary creations from our heritage menu'}
          </p>
          <button
            type="button"
            onClick={onAddMoreItems}
            className="mt-2 min-h-[44px] px-6 rounded-full bg-[#E5A93C] text-[#432c00] font-bold text-[13px] shadow-md hover:bg-[#F3C669] active:scale-95 transition-all cursor-pointer"
          >
            {language === 'bn' ? 'মেনু দেখুন' : 'Explore Menu'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col space-y-2.5">
          {items.map((item) => {
            const itemTotalPrice = item.unitPrice * item.quantity;
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-[#211f1e] border border-[#363433]/70 shadow-md hover:border-[#504535] transition-all"
              >
                {/* Food Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#0f0e0d] relative shadow-inner">
                  <img
                    src={item.image}
                    alt={item.nameEn}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-[15px] font-semibold text-[#e6e1df] truncate">
                      {language === 'bn' ? item.nameBn : item.nameEn}
                    </h3>
                    <span className="font-['Playfair_Display'] text-[15px] font-bold text-[#F3C669] flex-shrink-0 ml-1">
                      {formatPrice(itemTotalPrice)}
                    </span>
                  </div>

                  <p className="text-[12px] text-[#d4c4b0] truncate mt-0.5">
                    {item.details}
                  </p>

                  {/* Quantity & Serving size row */}
                  <div className="flex items-center justify-between mt-2 pt-0.5">
                    <span className="text-[11px] text-[#9d8f7c]">
                      {language === 'bn'
                        ? `পরিমাণ: ${item.portionBn || item.portion}`
                        : `Portion: ${item.portion}`}
                    </span>

                    {/* Quantity Selector with 44px touch targets */}
                    <div className="flex items-center gap-1 bg-[#2b2a28] rounded-full border border-[#504535]/50 px-1 py-0.5 shadow-inner">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.quantity <= 1) {
                            onRemoveItem(item.id);
                          } else {
                            onUpdateQuantity(item.id, item.quantity - 1);
                          }
                        }}
                        aria-label="Decrease quantity"
                        className="min-w-[44px] min-h-[44px] w-8 h-8 rounded-full flex items-center justify-center text-[#d4c4b0] hover:text-[#F3C669] active:scale-90 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {item.quantity === 1 ? 'delete' : 'remove'}
                        </span>
                      </button>

                      <span className="font-bold text-[14px] text-[#e6e1df] px-1 min-w-[20px] text-center">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="min-w-[44px] min-h-[44px] w-8 h-8 rounded-full flex items-center justify-center text-[#d4c4b0] hover:text-[#F3C669] active:scale-90 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          add
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
