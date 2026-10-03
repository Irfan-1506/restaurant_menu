import React, { useState } from 'react';
import { CartItem, Dish } from '../../types/restaurant';
import { formatPrice } from '../../utils/formatters';

interface ItemDetailProps {
  dish: Dish;
  onBack: () => void;
  onAddToCart: (item: CartItem) => void;
  onGoToCart: () => void;
  onOpenVideo?: (title: string, poster: string) => void;
  language: 'bn' | 'en';
}

export const ItemDetail: React.FC<ItemDetailProps> = ({
  dish,
  onBack,
  onAddToCart,
  onGoToCart,
  onOpenVideo,
  language,
}) => {
  const portions = dish.portions && dish.portions.length > 0
    ? dish.portions
    : [
        { id: 'regular', nameEn: 'Regular', nameBn: 'রেগুলার', servesEn: '1 Person', servesBn: '১ জন', price: dish.basePrice },
        { id: 'large', nameEn: 'Large', nameBn: 'লার্জ', servesEn: '2 Persons', servesBn: '২ জন', price: Math.round(dish.basePrice * 1.45) },
      ];

  const defaultAddons = dish.addons && dish.addons.length > 0
    ? dish.addons
    : [
        { id: 'addon-1', nameEn: 'Extra Golden Fried Potato', nameBn: 'এক্সট্রা জাফরানি ভাজা আলু', price: 50 },
        { id: 'addon-2', nameEn: 'Shahi Burhani (250ml)', nameBn: 'শাহী বোরহানি (২৫০ মিলি)', price: 90 },
        { id: 'addon-3', nameEn: 'Kachumber Onion Salad', nameBn: 'কাচুম্বার পেঁয়াজ সালাদ ও লেবু', price: 30 },
      ];

  const [selectedPortion, setSelectedPortion] = useState(portions[portions.length > 1 ? 1 : 0]);
  const [selectedSpice, setSelectedSpice] = useState<'Mild' | 'Medium' | 'Spicy'>(dish.spiceLevel || 'Medium');
  const [selectedAddons, setSelectedAddons] = useState<{ [id: string]: { name: string; price: number } }>({});
  const [includeCutlery, setIncludeCutlery] = useState(true);
  const [giftPackaging, setGiftPackaging] = useState(false);
  const [specialNote, setSpecialNote] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  const toggleAddon = (addon: { id: string; nameEn: string; price: number }) => {
    setSelectedAddons((prev) => {
      const next = { ...prev };
      if (next[addon.id]) {
        delete next[addon.id];
      } else {
        next[addon.id] = { name: addon.nameEn, price: addon.price };
      }
      return next;
    });
  };

  const giftPrice = giftPackaging ? 40 : 0;
  const addonsTotal = Object.values(selectedAddons).reduce((sum, item) => sum + item.price, 0) + giftPrice;
  const singleUnitPrice = selectedPortion.price + addonsTotal;
  const grandTotal = singleUnitPrice * quantity;

  const handleAdd = () => {
    const addonsList = Object.entries(selectedAddons).map(([id, item]) => ({
      id,
      name: item.name,
      price: item.price,
    }));

    const detailsArray = [
      selectedPortion.nameEn,
      `${selectedSpice} Spice`,
      ...addonsList.map((a) => a.name),
    ];
    if (giftPackaging) detailsArray.push('Royal Velvet Gift Box (+৳40)');
    if (!includeCutlery) detailsArray.push('No Cutlery (Eco)');

    const cartItem: CartItem = {
      id: `cart-${Date.now()}-${dish.id}`,
      dishId: dish.id,
      nameEn: dish.nameEn,
      nameBn: dish.nameBn,
      basePrice: dish.basePrice,
      unitPrice: singleUnitPrice,
      quantity,
      image: dish.image,
      portion: selectedPortion.nameEn,
      portionBn: selectedPortion.nameBn,
      spiceLevel: selectedSpice,
      addons: addonsList,
      details: detailsArray.join(' • '),
      specialNote: specialNote.trim() || undefined,
    };

    onAddToCart(cartItem);
    setIsAddedFeedback(true);
    setTimeout(() => {
      setIsAddedFeedback(false);
    }, 1800);
  };

  return (
    <div className="flex flex-col w-full pb-36 relative">
      {/* Full-Width 16:9 Food-Video Hero Card */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#0f0e0d] -mx-4 sm:-mx-5 -mt-4 mb-4">
        <img
          src={dish.image}
          alt={dish.nameEn}
          className="w-full h-full object-cover select-none pointer-events-none transform scale-105 transition-transform duration-700 hover:scale-100"
        />

        {/* Gradient Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141312] via-[#141312]/30 to-black/60 pointer-events-none"></div>

        {/* Top Controls Bar */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go Back to Menu"
            className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-black/60 backdrop-blur-md text-[#e6e1df] hover:text-[#F3C669] flex items-center justify-center active:scale-95 transition-all shadow-lg border border-white/10"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Share dish"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: dish.nameEn, url: window.location.href }).catch(() => {});
                }
              }}
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-black/60 backdrop-blur-md text-[#e6e1df] hover:text-[#F3C669] flex items-center justify-center active:scale-95 transition-all shadow-lg border border-white/10"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>

            <button
              type="button"
              aria-label="Save to favorites"
              onClick={() => setIsFavorite(!isFavorite)}
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-black/60 backdrop-blur-md text-[#e6e1df] flex items-center justify-center active:scale-95 transition-all shadow-lg border border-white/10"
            >
              <span
                className={`material-symbols-outlined text-[20px] transition-colors ${
                  isFavorite ? 'text-[#ffb4a8]' : ''
                }`}
                style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                favorite
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Video Badges */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onOpenVideo && onOpenVideo(`${dish.nameEn} (4K Master Prep)`, dish.image)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-[#e6e1df] shadow-md border border-[#E5A93C]/50 hover:border-[#F3C669] min-h-[44px] cursor-pointer active:scale-95 transition-all"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5A93C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E5A93C]"></span>
            </span>
            <span className="text-[11px] tracking-wider uppercase text-[#F3C669] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">play_circle</span>
              4K Cinematic Prep
            </span>
          </button>

          <button
            type="button"
            onClick={() => onOpenVideo && onOpenVideo(`${dish.nameEn} (4K Master Prep)`, dish.image)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[#d4c4b0] hover:text-[#F3C669] text-[11px] min-h-[44px] border border-white/10"
          >
            <span className="material-symbols-outlined text-[16px] text-[#E5A93C]">
              videocam
            </span>
            <span>Muted Autoplay</span>
          </button>
        </div>
      </div>

      {/* Dish Header Narrative */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#2b2a28] text-[#F3C669] text-[11px] tracking-wider font-semibold border border-[#504535]/50">
            {dish.code}
          </span>
          <span className="inline-flex items-center gap-1 text-[#F3C669] text-[12px] bg-[#E5A93C]/10 border border-[#E5A93C]/30 px-2.5 py-0.5 rounded-full font-bold">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            {dish.rating} ({dish.reviewCount.toLocaleString()}+)
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-2 mt-1">
          <h1 className="font-['Playfair_Display'] text-[24px] sm:text-[28px] font-bold text-[#e6e1df] leading-tight">
            {dish.nameEn}
          </h1>
          <span className="font-['Playfair_Display'] text-[24px] font-bold text-[#F3C669] flex-shrink-0">
            {formatPrice(selectedPortion.price)}
          </span>
        </div>

        <p className="text-[14px] font-medium text-[#E5A93C]">
          {dish.nameBn}
        </p>

        <p className="text-[13px] text-[#d4c4b0] leading-relaxed mt-0.5">
          {dish.descriptionEn}
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#211f1e] text-[#e6e1df] text-[11px] font-semibold border border-[#363433]">
            <span className="material-symbols-outlined text-[15px] text-[#f6c96c]">
              restaurant
            </span>
            <span>Signature Mughal</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#211f1e] text-[#e6e1df] text-[11px] font-semibold border border-[#363433]">
            <span className="material-symbols-outlined text-[15px] text-[#E5A93C]">
              local_fire_department
            </span>
            <span>Ghee Dum</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8e1309]/80 text-[#ffb4a8] text-[11px] font-bold border border-[#8e1309]">
            <span className="material-symbols-outlined text-[15px]">whatshot</span>
            <span>{selectedSpice} Spice</span>
          </div>
        </div>
      </div>

      {/* Portion Size Modifier (Required) */}
      <div className="mt-5 flex flex-col gap-2.5 bg-[#1d1b1a] p-4 rounded-xl border border-[#363433] shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-[#e6e1df]">Portion Size</span>
          <span className="text-[11px] text-[#F3C669] font-bold uppercase tracking-wider">
            Required
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Portion size">
          {portions.map((portion) => {
            const isSelected = selectedPortion.id === portion.id;
            return (
              <button
                key={portion.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedPortion(portion)}
                className={`min-h-[56px] flex flex-col items-start p-3 rounded-lg text-left transition-all active:scale-[0.98] border ${
                  isSelected
                    ? 'bg-[#E5A93C] text-[#432c00] border-[#E5A93C] shadow-md'
                    : 'bg-[#211f1e] text-[#e6e1df] border-[#363433] hover:border-[#504535]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-[14px]">
                    {portion.nameEn}
                  </span>
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#432c00] text-[#E5A93C]'
                        : 'bg-[#363433]'
                    }`}
                  >
                    {isSelected && (
                      <span className="material-symbols-outlined text-[12px] font-black">
                        check
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between w-full mt-1">
                  <span className={`text-[11px] ${isSelected ? 'text-[#432c00]/80 font-medium' : 'text-[#9d8f7c]'}`}>
                    {portion.servesEn}
                  </span>
                  <span className="font-bold text-[14px]">
                    {formatPrice(portion.price)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spice Level Modifier */}
      <div className="mt-4 flex flex-col gap-2.5 bg-[#1d1b1a] p-4 rounded-xl border border-[#363433] shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-[#e6e1df]">Spice Level</span>
          <span className="text-[11px] text-[#d4c4b0]">Chef Recommended</span>
        </div>

        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Spice level">
          {(['Mild', 'Medium', 'Spicy'] as const).map((spice) => {
            const isSelected = selectedSpice === spice;
            return (
              <button
                key={spice}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedSpice(spice)}
                className={`min-h-[48px] py-2.5 px-2 rounded-lg flex flex-col items-center justify-center transition-all active:scale-95 border ${
                  isSelected
                    ? 'bg-[#8e1309] text-[#ffb4a8] border-[#ffb4a8]/50 shadow-sm font-bold'
                    : 'bg-[#211f1e] text-[#d4c4b0] border-[#363433] hover:text-[#e6e1df]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {spice === 'Mild' ? 'eco' : spice === 'Medium' ? 'local_fire_department' : 'whatshot'}
                </span>
                <span className="text-[12px] mt-0.5">{spice}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sultani Add-ons Modifier (Checkboxes) */}
      <div className="mt-4 flex flex-col gap-2.5 bg-[#1d1b1a] p-4 rounded-xl border border-[#363433] shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-[#e6e1df]">Sultani Add-ons</span>
          <span className="text-[11px] text-[#9d8f7c]">Optional</span>
        </div>

        <div className="flex flex-col gap-2">
          {defaultAddons.map((addon) => {
            const isChecked = !!selectedAddons[addon.id];
            return (
              <label
                key={addon.id}
                onClick={() => toggleAddon(addon)}
                className={`min-h-[48px] cursor-pointer flex items-center justify-between p-3 rounded-lg border transition-all ${
                  isChecked
                    ? 'bg-[#2b2a28] border-[#E5A93C]/60 text-[#e6e1df]'
                    : 'bg-[#211f1e] border-[#363433] text-[#d4c4b0] hover:bg-[#282625]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-5 h-5 rounded accent-[#E5A93C] cursor-pointer"
                  />
                  <span className="text-[13px] font-semibold text-[#e6e1df]">
                    {addon.nameEn}
                  </span>
                </div>
                <span className="text-[13px] font-bold text-[#F3C669]">
                  +{formatPrice(addon.price)}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Dining & Packaging Switches */}
      <div className="mt-4 flex flex-col gap-3 bg-[#1d1b1a] p-4 rounded-xl border border-[#363433] shadow-sm">
        <span className="text-[14px] font-bold text-[#e6e1df]">Dining & Cutlery Preferences</span>

        {/* Switch 1: Include Cutlery & Wet Napkins */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="material-symbols-outlined text-[20px] text-[#E5A93C]">flatware</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold text-[#e6e1df]">
                {language === 'bn' ? 'চামচ ও ওয়েট টিস্যু' : 'Eco Cutlery & Wet Napkins'}
              </span>
              <span className="text-[11px] text-[#9d8f7c]">
                {includeCutlery ? 'Included with feast' : 'No cutlery needed (Green)'}
              </span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={includeCutlery}
            aria-label="Toggle Cutlery & Napkins"
            onClick={() => setIncludeCutlery(!includeCutlery)}
            className="min-h-[44px] min-w-[50px] flex items-center justify-center p-1 cursor-pointer"
          >
            <div
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                includeCutlery ? 'bg-[#E5A93C]' : 'bg-[#363433]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#141312] shadow-md transition duration-200 ease-in-out ${
                  includeCutlery ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Switch 2: Royal Velvet Gift Box Packaging */}
        <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-[#363433]">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="material-symbols-outlined text-[20px] text-[#f6c96c]">featured_seasonal_and_gifts</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold text-[#e6e1df]">
                {language === 'bn' ? 'রাজকীয় মখমল গিফট বক্স' : 'Royal Velvet Dawat Packaging'}
              </span>
              <span className="text-[11px] text-[#F3C669] font-medium">
                +৳40 • Golden seal & ribbon
              </span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={giftPackaging}
            aria-label="Toggle Velvet Gift Box"
            onClick={() => setGiftPackaging(!giftPackaging)}
            className="min-h-[44px] min-w-[50px] flex items-center justify-center p-1 cursor-pointer"
          >
            <div
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                giftPackaging ? 'bg-[#E5A93C]' : 'bg-[#363433]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#141312] shadow-md transition duration-200 ease-in-out ${
                  giftPackaging ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Special Kitchen Notes */}
      <div className="mt-4 flex flex-col gap-2 bg-[#1d1b1a] p-4 rounded-xl border border-[#363433]">
        <label className="text-[13px] font-bold text-[#e6e1df] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[17px] text-[#E5A93C]">edit_note</span>
          <span>Special Kitchen Instructions</span>
        </label>
        <input
          type="text"
          value={specialNote}
          onChange={(e) => setSpecialNote(e.target.value)}
          placeholder="e.g. less oil, extra crispy beresta on top, serve hot..."
          className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#211f1e] border border-[#363433] text-[13px] text-[#e6e1df] placeholder:text-[#9d8f7c] focus:outline-none focus:border-[#E5A93C]"
        />
      </div>

      {/* Live Selection Total Breakdown Pill */}
      <div className="mt-4 flex items-center justify-between px-4 py-3 rounded-xl bg-[#2b2a28] border border-[#504535]/50 shadow-md">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#E5A93C] text-[20px]">
            calculate
          </span>
          <span className="text-[12px] text-[#d4c4b0] font-medium">
            Live Selection Total:
          </span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-[11px] text-[#9d8f7c] mr-1">
            ({selectedPortion.nameEn} {addonsTotal > 0 ? '+ Add-ons' : ''})
          </span>
          <span className="font-['Playfair_Display'] text-[18px] font-bold text-[#F3C669]">
            {formatPrice(singleUnitPrice)}
          </span>
        </div>
      </div>

      {/* Guaranteed Fixed Bottom Order Tray */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0f0e0d]/95 backdrop-blur-2xl p-4 border-t border-[#504535]/40 shadow-[0_-8px_30px_rgba(0,0,0,0.7)] flex flex-col gap-2 pb-[env(safe-area-inset-bottom,16px)]">
        <div className="max-w-md mx-auto w-full flex items-center gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center justify-between bg-[#2b2a28] rounded-full px-2 py-1 min-w-[110px] min-h-[48px] border border-[#504535]/50 shadow-inner flex-shrink-0">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="min-w-[44px] min-h-[44px] w-9 h-9 rounded-full bg-[#211f1e] text-[#e6e1df] flex items-center justify-center active:scale-90 transition-transform font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>

            <span className="font-bold text-[16px] text-[#e6e1df] px-2">
              {quantity}
            </span>

            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity(Math.min(20, quantity + 1))}
              className="min-w-[44px] min-h-[44px] w-9 h-9 rounded-full bg-[#211f1e] text-[#e6e1df] flex items-center justify-center active:scale-90 transition-transform font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>

          {/* Primary CTA */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 min-h-[48px] px-5 rounded-full bg-gradient-to-r from-[#F3C669] to-[#E5A93C] text-[#432c00] font-bold text-[15px] flex items-center justify-between shadow-[0_4px_20px_rgba(229,169,60,0.35)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isAddedFeedback ? 'check_circle' : 'shopping_bag'}
              </span>
              <span>{isAddedFeedback ? 'Added to Feast!' : 'Add to Cart'}</span>
            </span>
            <span className="font-extrabold tracking-tight">
              {formatPrice(grandTotal)}
            </span>
          </button>
        </div>

        {/* View preparation video button */}
        <button
          type="button"
          onClick={() => onOpenVideo && onOpenVideo(`Preparation: ${dish.nameEn}`, dish.image)}
          className="min-h-[44px] w-full flex items-center justify-center gap-1.5 py-1 text-[#F3C669] hover:text-[#E5A93C] active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">play_circle</span>
          <span className="text-[12px] font-semibold tracking-wide underline underline-offset-4">
            View preparation video (0:45)
          </span>
        </button>

        {/* Continue / View Cart link */}
        <div className="max-w-md mx-auto w-full flex items-center justify-between px-2 pt-0.5 text-[12px]">
          <button
            type="button"
            onClick={onBack}
            className="text-[#d4c4b0] hover:text-[#F3C669] transition-colors py-1 min-h-[36px]"
          >
            ← Continue browsing menu
          </button>

          <button
            type="button"
            onClick={onGoToCart}
            className="text-[#F3C669] font-bold hover:underline py-1 min-h-[36px]"
          >
            View Cart & Checkout →
          </button>
        </div>
      </div>
    </div>
  );
};
