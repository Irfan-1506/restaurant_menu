import React, { useState } from 'react';
import { Dish, OrderType, TableInfo } from '../../types/restaurant';
import { formatPrice } from '../../utils/formatters';

interface MenuHomeProps {
  dishes: Dish[];
  tableInfo: TableInfo;
  orderType: OrderType;
  cartItemCount: number;
  cartTotal: number;
  onOpenDishDetail: (dish: Dish) => void;
  onQuickAdd: (dish: Dish) => void;
  onGoToCart: () => void;
  onOpenVideo?: (title: string, poster: string) => void;
  onOpenTableSelect?: () => void;
  language: 'bn' | 'en';
}

export const MenuHome: React.FC<MenuHomeProps> = ({
  dishes,
  tableInfo,
  orderType,
  cartItemCount,
  cartTotal,
  onOpenDishDetail,
  onQuickAdd,
  onGoToCart,
  onOpenVideo,
  onOpenTableSelect,
  language,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Switch Filters
  const [chefPickOnly, setChefPickOnly] = useState(false);
  const [spicyOnly, setSpicyOnly] = useState(false);
  const [topRatedOnly, setTopRatedOnly] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      triggerToast(language === 'bn' ? 'মাইক্রোফোন শুনছে... পছন্দের পদ বলুন' : 'Listening... Say dish name');
    }
  };

  const voiceSuggestions = [
    { labelBn: 'খাসির কাচ্চি', labelEn: 'Mutton Kacchi', query: 'Kacchi' },
    { labelBn: 'মোরগ পোলাও', labelEn: 'Morog Polao', query: 'Polao' },
    { labelBn: 'শাহী বোরহানি', labelEn: 'Shahi Borhani', query: 'Borhani' },
    { labelBn: 'বিফ তেহারি', labelEn: 'Beef Tehari', query: 'Tehari' },
  ];

  const categories = [
    { id: 'all', nameBn: 'সকল পদ (All Items)', nameEn: 'All Items' },
    { id: 'kacchi', nameBn: 'পোলাও ও কাচ্চি (Rice & Biryani)', nameEn: 'Rice & Biryani' },
    { id: 'kebab', nameBn: 'কাবাব ও গ্রিল (Kebab & Grills)', nameEn: 'Kebab & Grills' },
    { id: 'curry', nameBn: 'রয়্যাল কারি ও ডাল (Royal Curry)', nameEn: 'Royal Curry & Daal' },
    { id: 'beverage', nameBn: 'পানীয় ও বোরহানি (Drinks)', nameEn: 'Drinks & Borhani' },
  ];

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch =
      dish.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.nameBn.includes(searchQuery) ||
      dish.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Filter switches
    if (chefPickOnly && !dish.isChefPick) return false;
    if (spicyOnly && dish.spiceLevel !== 'Spicy') return false;
    if (topRatedOnly && dish.rating < 4.9) return false;

    // Category filter
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'kacchi') return dish.category.includes('Kacchi') || dish.category.includes('Polao');
    if (selectedCategory === 'kebab') return dish.category.includes('Kebab');
    if (selectedCategory === 'curry') return dish.id === 'dish-dal' || dish.category.includes('Curry');
    if (selectedCategory === 'beverage') return dish.category.includes('Beverage');
    return true;
  });

  const heroDish = dishes.find((d) => d.id === 'dish-dal') || dishes[0];

  return (
    <div className="flex flex-col w-full pb-28 space-y-5">
      {/* Dining Mode Header Status */}
      {orderType === 'takeaway' ? (
        <div className="rounded-xl bg-[#211f1e] p-3.5 border border-[#8e1309]/50 shadow-md flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#8e1309] text-[#ffb4a8] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">takeout_dining</span>
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-[#e6e1df]">
                {language === 'bn' ? 'পার্সেল ও টেকঅ্যাওয়ে মোড' : 'Takeaway Mode Active'}
              </span>
              <button
                type="button"
                onClick={onOpenTableSelect}
                className="text-[11px] text-[#F3C669] hover:underline font-bold"
              >
                Switch
              </button>
            </div>
            <p className="text-[12px] text-[#d4c4b0] mt-0.5 leading-relaxed">
              {language === 'bn'
                ? 'কাউন্টার থেকে গরম পার্সেল নেওয়ার জন্য অগ্রিম অর্ডার কনফার্ম করুন।'
                : 'Takeaway orders require upfront payment confirmation before charcoal dum-cooking begins.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={onOpenTableSelect}
            className="flex items-center gap-2 bg-[#2b2a28] hover:bg-[#3b3937] px-3.5 py-2 rounded-full border border-[#504535]/40 shadow-sm min-h-[44px] cursor-pointer active:scale-95 transition-all text-left"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5A93C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E5A93C]"></span>
            </span>
            <span className="text-[13px] font-semibold text-[#e6e1df]">
              Table {tableInfo.number} • Dine-In
            </span>
            <span className="text-[10px] text-[#F3C669] bg-[#141312] px-1.5 py-0.5 rounded font-bold">
              ইন-ডাইন
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#E5A93C] ml-1">
              swap_horiz
            </span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => triggerToast(`টেবিল ${tableInfo.number}-তে পানি চাওয়া হয়েছে`)}
              aria-label="Request water"
              className="min-h-[44px] px-2.5 rounded-full bg-[#211f1e] hover:bg-[#2b2a28] text-[#F3C669] border border-[#504535]/40 flex items-center gap-1 text-[11px] font-semibold transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">water_drop</span>
              <span>পানি</span>
            </button>

            <button
              type="button"
              onClick={() => triggerToast(`ক্যাপ্টেনকে কল করা হয়েছে`)}
              aria-label="Call waiter"
              className="min-h-[44px] px-2.5 rounded-full bg-[#211f1e] hover:bg-[#2b2a28] text-[#E5A93C] border border-[#504535]/40 flex items-center gap-1 text-[11px] font-semibold transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">room_service</span>
              <span>ওয়েটার</span>
            </button>
          </div>
        </div>
      )}

      {/* Search Bar with Voice Switch and Clear Button */}
      <div className="flex flex-col gap-2">
        <div className="relative flex items-center w-full bg-[#211f1e] rounded-full px-4 py-1.5 border border-[#363433] shadow-inner focus-within:border-[#E5A93C] transition-colors">
          <span className="material-symbols-outlined text-[#9d8f7c] mr-2.5 text-[22px]">
            search
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'bn'
                ? 'কাচ্চি, মোরগ পোলাও, বোরহানি খুঁজুন...'
                : 'Search biryani, kebab, dessert, borhani...'
            }
            className="w-full bg-transparent text-[#e6e1df] placeholder:text-[#9d8f7c] text-[14px] focus:outline-none py-2"
          />

          {searchQuery && (
            <button
              type="button"
              aria-label="Clear Search"
              onClick={() => setSearchQuery('')}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#9d8f7c] hover:text-[#e6e1df] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}

          {/* Voice Search Toggle Button */}
          <button
            type="button"
            aria-label="Voice Search"
            onClick={handleVoiceToggle}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all cursor-pointer ${
              isVoiceActive
                ? 'text-[#432c00] bg-[#E5A93C] shadow-[0_0_12px_rgba(229,169,60,0.6)] animate-pulse'
                : 'text-[#E5A93C] hover:text-[#F3C669]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isVoiceActive ? 'mic_active' : 'mic'}
            </span>
          </button>
        </div>

        {/* Voice Chips Bar when Voice is active */}
        {isVoiceActive && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 animate-fadeIn">
            <span className="text-[11px] font-bold text-[#E5A93C] flex items-center gap-1 pl-1">
              <span className="w-2 h-2 rounded-full bg-[#E5A93C] animate-ping"></span>
              Say or tap:
            </span>
            {voiceSuggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSearchQuery(item.query);
                  setIsVoiceActive(false);
                  triggerToast(`Selected: "${item.labelEn}"`);
                }}
                className="px-3 py-1 rounded-full bg-[#2b2a28] hover:bg-[#3b3937] text-[#e6e1df] border border-[#504535]/50 text-[11px] font-semibold whitespace-nowrap active:scale-95 transition-all cursor-pointer"
              >
                {language === 'bn' ? item.labelBn : item.labelEn}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Switch Filter Buttons Row */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
        {/* Switch 1: Chef Pick */}
        <button
          type="button"
          role="switch"
          aria-checked={chefPickOnly}
          onClick={() => setChefPickOnly(!chefPickOnly)}
          className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
            chefPickOnly
              ? 'bg-[#E5A93C] text-[#432c00] border-[#E5A93C] shadow-md'
              : 'bg-[#211f1e] text-[#d4c4b0] hover:text-[#e6e1df] border-[#363433]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">stars</span>
          <span>{language === 'bn' ? 'শেফ স্পেশাল' : "Chef's Picks"}</span>
          {chefPickOnly && <span className="material-symbols-outlined text-[14px]">check</span>}
        </button>

        {/* Switch 2: Top Rated 4.8+ */}
        <button
          type="button"
          role="switch"
          aria-checked={topRatedOnly}
          onClick={() => setTopRatedOnly(!topRatedOnly)}
          className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
            topRatedOnly
              ? 'bg-[#E5A93C] text-[#432c00] border-[#E5A93C] shadow-md'
              : 'bg-[#211f1e] text-[#d4c4b0] hover:text-[#e6e1df] border-[#363433]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">grade</span>
          <span>{language === 'bn' ? '৪.৮+ রেটিং' : 'Top Rated 4.8+'}</span>
          {topRatedOnly && <span className="material-symbols-outlined text-[14px]">check</span>}
        </button>

        {/* Switch 3: Spicy Only */}
        <button
          type="button"
          role="switch"
          aria-checked={spicyOnly}
          onClick={() => setSpicyOnly(!spicyOnly)}
          className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
            spicyOnly
              ? 'bg-[#8e1309] text-[#ffb4a8] border-[#8e1309] shadow-md'
              : 'bg-[#211f1e] text-[#d4c4b0] hover:text-[#e6e1df] border-[#363433]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">whatshot</span>
          <span>{language === 'bn' ? 'ঝাল পদ' : 'Spicy Delicacies'}</span>
          {spicyOnly && <span className="material-symbols-outlined text-[14px]">check</span>}
        </button>

        {(chefPickOnly || spicyOnly || topRatedOnly) && (
          <button
            type="button"
            onClick={() => {
              setChefPickOnly(false);
              setSpicyOnly(false);
              setTopRatedOnly(false);
            }}
            className="min-h-[44px] px-2 text-[11px] text-[#ff9a8a] hover:underline whitespace-nowrap cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {/* Full-Width 16:9 Food-Video Hero Feature Card */}
      <div className="w-full rounded-2xl overflow-hidden bg-[#1d1b1a] border border-[#504535]/50 shadow-2xl relative group">
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#0f0e0d]">
          <img
            src={heroDish.image}
            alt={heroDish.nameEn}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Deep Scrim for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141312] via-[#141312]/60 to-black/40"></div>

          {/* Top Overlay Badges */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
            <span className="text-[11px] font-semibold text-[#d4c4b0] bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md tracking-wider border border-white/10">
              SOP: {heroDish.code}
            </span>

            <button
              type="button"
              onClick={() => onOpenVideo && onOpenVideo(heroDish.nameEn, heroDish.image)}
              className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E5A93C]/60 shadow-lg min-h-[44px] hover:border-[#F3C669] active:scale-95 transition-all cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5A93C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E5A93C]"></span>
              </span>
              <span className="material-symbols-outlined text-[#E5A93C] text-[18px]">
                play_arrow
              </span>
              <span className="text-[11px] font-bold text-[#F3C669] tracking-wide">
                4K Cinematic Preview
              </span>
            </button>
          </div>

          {/* Hero Content Over Scrim */}
          <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col gap-1.5 z-10">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-['Playfair_Display'] text-[22px] font-bold text-[#F3C669] leading-tight">
                    {heroDish.nameEn}
                  </h2>
                  <span className="text-[13px] text-[#d4c4b0] font-medium hidden sm:inline">
                    ({heroDish.nameBn})
                  </span>
                </div>
                <p className="text-[11px] text-[#ffb4a8] flex items-center gap-1 mt-0.5 font-semibold">
                  <span
                    className="material-symbols-outlined text-[13px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    local_fire_department
                  </span>
                  12-Hour Slow Smoked Dum Lentil
                </p>
              </div>

              <span className="font-['Playfair_Display'] text-[24px] font-bold text-[#F3C669] flex-shrink-0">
                {formatPrice(heroDish.basePrice)}
              </span>
            </div>

            <p className="text-[12px] text-[#d4c4b0] line-clamp-2 leading-relaxed">
              {heroDish.descriptionEn}
            </p>

            <div className="mt-2 flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 bg-[#2b2a28] rounded text-[#d4c4b0] font-medium">
                  Signature Recipe
                </span>
                <span className="text-[11px] text-[#ffb4a8] font-medium">
                  {heroDish.spiceLevel} Spice
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenDishDetail(heroDish)}
                  className="min-h-[44px] px-3.5 rounded-xl bg-[#2b2a28] hover:bg-[#3b3937] text-[#e6e1df] border border-[#504535]/50 text-[12px] font-semibold flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                >
                  Customize
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onQuickAdd(heroDish);
                    triggerToast(`Added ${heroDish.nameEn} to Cart!`);
                  }}
                  className="min-h-[44px] px-4 rounded-xl bg-gradient-to-r from-[#F3C669] to-[#E5A93C] text-[#432c00] font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Category Bar (min-h-[44px]) */}
      <div className="w-full">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[44px] px-4 rounded-full text-[12px] font-bold flex-shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#E5A93C] text-[#432c00] shadow-[0_4px_16px_rgba(229,169,60,0.3)]'
                    : 'bg-[#211f1e] text-[#d4c4b0] hover:text-[#e6e1df] hover:bg-[#2b2a28] border border-[#363433]'
                }`}
              >
                {language === 'bn' ? cat.nameBn : cat.nameEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chef's Cinematic Picks (4K Preview Reels) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#E5A93C] text-[20px]">
              stars
            </span>
            <h3 className="font-['Playfair_Display'] text-[17px] font-bold text-[#e6e1df]">
              Chef's Cinematic Picks
            </h3>
          </div>
          <span className="text-[11px] font-bold tracking-wider text-[#F3C669] uppercase">
            4K Previews
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
          {dishes.slice(0, 3).map((dish) => (
            <div
              key={dish.id}
              className="flex-shrink-0 w-64 rounded-2xl bg-[#1d1b1a] border border-[#504535]/40 overflow-hidden shadow-lg flex flex-col"
            >
              <div
                className="relative h-44 w-full bg-[#0f0e0d] cursor-pointer"
                onClick={() => onOpenDishDetail(dish)}
              >
                <img
                  src={dish.image}
                  alt={dish.nameEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-sm px-2 py-0.5 rounded text-[#d4c4b0] text-[10px] font-semibold border border-white/10">
                  {dish.code}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenVideo) onOpenVideo(dish.nameEn, dish.image);
                  }}
                  className="absolute top-2.5 right-2.5 bg-[#8e1309]/90 hover:bg-[#8e1309] text-[#ffb4a8] px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[13px]">videocam</span> 4K
                </button>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[#F3C669] font-bold text-[14px]">
                    {formatPrice(dish.basePrice)}
                  </span>
                </div>
              </div>

              <div className="p-3.5 flex flex-col justify-between flex-grow">
                <div>
                  <h4 className="text-[14px] font-bold text-[#e6e1df] line-clamp-1">
                    {dish.nameEn}
                  </h4>
                  <span className="text-[11px] text-[#9d8f7c] line-clamp-1 mt-0.5">
                    {dish.nameBn}
                  </span>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenDishDetail(dish)}
                    className="min-h-[44px] flex-1 rounded-xl bg-[#2b2a28] hover:bg-[#3b3937] text-[#e6e1df] text-[12px] font-semibold border border-[#504535]/50 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                  >
                    Customize
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onQuickAdd(dish);
                      triggerToast(`Added ${dish.nameEn}!`);
                    }}
                    className="min-h-[44px] px-4 rounded-xl bg-gradient-to-r from-[#F3C669] to-[#E5A93C] text-[#432c00] font-bold text-[12px] flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signature Dishes List */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between pb-1">
          <h3 className="font-['Playfair_Display'] text-[17px] font-bold text-[#e6e1df]">
            Signature Mughal Menu
          </h3>
          <span className="text-[11px] text-[#9d8f7c]">
            {filteredDishes.length} Curated Dishes
          </span>
        </div>

        <div className="space-y-3">
          {filteredDishes.length === 0 ? (
            <div className="text-center p-8 bg-[#211f1e] rounded-2xl border border-[#363433] space-y-2">
              <span className="material-symbols-outlined text-[36px] text-[#9d8f7c]">
                search_off
              </span>
              <p className="text-[14px] font-semibold text-[#e6e1df]">
                {language === 'bn' ? 'কোনো পদ পাওয়া যায়নি' : 'No dishes matched your criteria'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setChefPickOnly(false);
                  setSpicyOnly(false);
                  setTopRatedOnly(false);
                }}
                className="mt-2 min-h-[44px] px-4 rounded-full bg-[#E5A93C] text-[#432c00] text-[12px] font-bold shadow-md cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-[#211f1e] hover:bg-[#282625] border border-[#363433] rounded-2xl p-3.5 flex gap-3 shadow-md transition-all active:scale-[0.99]"
              >
                <div
                  className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#0f0e0d] cursor-pointer relative"
                  onClick={() => onOpenDishDetail(dish)}
                >
                  <img
                    src={dish.image}
                    alt={dish.nameEn}
                    className="w-full h-full object-cover"
                  />
                  {dish.isChefPick && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded-full bg-black/85 text-[#F3C669] text-[9px] font-bold">
                      Chef Pick
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-between flex-grow min-w-0">
                  <div onClick={() => onOpenDishDetail(dish)} className="cursor-pointer">
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <h4 className="text-[14px] font-bold text-[#e6e1df] truncate">
                          {dish.nameEn}
                        </h4>
                        <p className="text-[11px] text-[#E5A93C] truncate">
                          {dish.nameBn}
                        </p>
                      </div>
                      <span className="text-[10px] text-[#9d8f7c] px-1.5 py-0.5 rounded bg-[#141312] border border-[#363433] flex-shrink-0">
                        {dish.code}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#d4c4b0] line-clamp-2 mt-1 leading-snug">
                      {dish.descriptionEn}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#363433]/60">
                    <div className="flex items-center gap-2">
                      <span className="font-['Playfair_Display'] text-[16px] font-bold text-[#F3C669]">
                        {formatPrice(dish.basePrice)}
                      </span>
                      <span className="text-[11px] text-[#ffb4a8] flex items-center gap-0.5">
                        <span
                          className="material-symbols-outlined text-[13px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          local_fire_department
                        </span>
                        <span>{dish.spiceLevel}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenDishDetail(dish)}
                        className="min-h-[44px] min-w-[44px] px-2.5 rounded-lg bg-[#2b2a28] hover:bg-[#3b3937] text-[#d4c4b0] hover:text-[#F3C669] text-[11px] font-semibold border border-[#504535]/50 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                      >
                        Detail
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onQuickAdd(dish);
                          triggerToast(`Added ${dish.nameEn}!`);
                        }}
                        aria-label={`Add ${dish.nameEn} to Cart`}
                        className="min-h-[44px] min-w-[44px] w-11 h-11 rounded-lg bg-gradient-to-r from-[#F3C669] to-[#E5A93C] text-[#432c00] flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Active Order / View Cart Bar */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-24 left-0 right-0 z-40 px-4 sm:px-5 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto bg-[#0f0e0d]/95 backdrop-blur-xl border border-[#E5A93C]/50 p-3 rounded-2xl shadow-[0_8px_32px_-4px_rgba(229,169,60,0.35)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#E5A93C] text-[#432c00] font-bold flex items-center justify-center text-[16px] shadow-sm">
                {cartItemCount}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-[#d4c4b0] uppercase tracking-wider font-semibold">
                  Cart Total • {cartItemCount} items
                </span>
                <span className="font-['Playfair_Display'] text-[18px] font-bold text-[#F3C669]">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onGoToCart}
              className="min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-[#F3C669] to-[#E5A93C] text-[#432c00] font-bold text-[14px] flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform cursor-pointer"
            >
              <span>View Cart</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full bg-[#E5A93C] text-[#432c00] text-[12px] font-bold shadow-2xl flex items-center gap-2 z-50 animate-fadeIn">
          <span className="material-symbols-outlined text-[18px]">done_all</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
