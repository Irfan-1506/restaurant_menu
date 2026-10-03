/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  advanceOrderStatus,
  getActiveCustomerOrder,
  getAllOrders,
  getStageIndexFromStatus,
  subscribeToOrders,
} from '../../store/orderStore';
import { ActiveOrder, OrderStatus, TableInfo } from '../../types/restaurant';
import { formatPrice } from '../../utils/formatters';

interface LiveTrackingProps {
  tableInfo: TableInfo;
  orderNumber?: string;
  activeOrder?: ActiveOrder | null;
  onBackToMenu?: () => void;
  onOpenVideo?: (title: string, poster: string) => void;
  language: 'bn' | 'en';
}

export const LiveTracking: React.FC<LiveTrackingProps> = ({
  tableInfo,
  orderNumber = 'SK-2481',
  activeOrder: initialActiveOrder,
  onBackToMenu,
  onOpenVideo,
  language,
}) => {
  // Read active order from store or fallback
  const [currentOrder, setCurrentOrder] = useState<ActiveOrder | null>(() => {
    return initialActiveOrder || getActiveCustomerOrder() || getAllOrders()[0] || null;
  });

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(false);
  const [audioDumEnabled, setAudioDumEnabled] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Subscribe to live order updates (syncs when Staff POS updates status!)
  useEffect(() => {
    const syncFromStore = () => {
      const live = getActiveCustomerOrder() || getAllOrders()[0];
      if (live) {
        setCurrentOrder(live);
      }
    };

    syncFromStore();
    const unsubscribe = subscribeToOrders(syncFromStore);
    return () => unsubscribe();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const displayOrderRef = currentOrder?.orderId || orderNumber;
  const currentStatus: OrderStatus = currentOrder?.orderStatus || 'preparing';
  const stageIndex = currentOrder
    ? getStageIndexFromStatus(currentOrder.orderStatus)
    : 2;

  // Next status preview for the kitchen update simulator control
  const getNextStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return 'preparing (রান্না শুরু)';
      case 'preparing':
        return 'ready (খাবার প্রস্তুত)';
      case 'ready':
        return 'served (টেবিলে পরিবেশন)';
      case 'served':
        return 'placed (রিসেট)';
      default:
        return 'preparing';
    }
  };

  // Temporary kitchen simulator control handler
  // Advances status: placed -> preparing -> ready -> served
  // TODO: Replace with live WebSocket push events from kitchen server
  const handleSimulateKitchenAdvance = () => {
    if (!currentOrder) return;
    const updated = advanceOrderStatus(currentOrder.orderId);
    if (updated) {
      setCurrentOrder(updated);
      triggerToast(
        language === 'bn'
          ? `কিচেন স্ট্যাটাস আপডেট: ${updated.orderStatus.toUpperCase()}!`
          : `Kitchen status updated to ${updated.orderStatus.toUpperCase()}!`
      );
    }
  };

  const stages = [
    {
      id: 0,
      statusKey: 'placed',
      titleEn: 'Order Placed',
      titleBn: 'অর্ডার গৃহীত হয়েছে',
      time: currentOrder?.placedAt || 'Just now',
      icon: 'receipt_long',
      detailEn: 'Transmitted securely to the Chef POS expediter line',
      detailBn: 'শেফ কনসোলে অর্ডার সফলভাবে পৌছেছে',
    },
    {
      id: 1,
      statusKey: 'placed',
      titleEn: 'Payment Verified',
      titleBn: 'পেমেন্ট স্ট্যাটাস',
      time: currentOrder?.paymentStatus === 'paid' ? 'Verified' : 'Pending',
      icon: 'verified_user',
      detailEn:
        currentOrder?.paymentStatus === 'paid'
          ? `Settled via ${currentOrder.paymentMethod.toUpperCase()}`
          : 'Cash / counter collection scheduled',
      detailBn:
        currentOrder?.paymentStatus === 'paid'
          ? 'ডিজিটাল পেমেন্ট সফলভাবে নিশ্চিত হয়েছে'
          : 'কাউন্টারে বিল পরিশোধ অপেক্ষমান',
    },
    {
      id: 2,
      statusKey: 'preparing',
      titleEn: 'Fragrant Dum Cooking',
      titleBn: 'আঁচে দম চলছে (রান্না হচ্ছে)',
      time: 'In Dum Chamber',
      icon: 'local_fire_department',
      detailEn: '145°C handi clay seal locked under glowing wood charcoal',
      detailBn: '১৪৫° সেলসিয়াসে মাটির হাড়িতে সুবাসিত দম চলছে',
    },
    {
      id: 3,
      statusKey: 'ready',
      titleEn: 'Plating & Garnishing',
      titleBn: 'পরিবেশন ও সাজসজ্জা',
      time: 'Food Ready',
      icon: 'outdoor_grill',
      detailEn: 'Fresh beresta, saffron drizzle and silver leaf garnishing',
      detailBn: 'জাফরান ও পেঁয়াজ বেরেস্তা দিয়ে সাজানো হচ্ছে',
    },
    {
      id: 4,
      statusKey: 'served',
      titleEn: 'Served at Table',
      titleBn: 'টেবিলে পরিবেশিত',
      time: 'Completed',
      icon: 'dinner_dining',
      detailEn: `Hand-carried to Table ${currentOrder?.tableNumber || tableInfo.number} by Captain`,
      detailBn: `টেবিলে ক্যাপ্টেন সফলভাবে পরিবেশন সম্পন্ন করেছেন`,
    },
  ];

  const orderItems = currentOrder?.items || [];
  const grandTotal = currentOrder?.grandTotal || 1524;
  const paymentMethodName =
    currentOrder?.paymentMethod === 'bkash'
      ? 'bKash (বিকাশ)'
      : currentOrder?.paymentMethod === 'nagad'
      ? 'Nagad (নগদ)'
      : currentOrder?.paymentMethod === 'card'
      ? 'Credit/Debit Card (SSL)'
      : 'Cash at Counter';

  const handleShareTracking = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      triggerToast(
        language === 'bn'
          ? 'ট্র্যাকিং লিংক কপি হয়েছে!'
          : 'Tracking link copied to clipboard!'
      );
    } else {
      triggerToast('Tracking link shared');
    }
  };

  // Status visual states
  const getStatusDisplay = () => {
    switch (currentStatus) {
      case 'placed':
        return {
          pillText: language === 'bn' ? 'অর্ডার গৃহীত • Awaiting Chef' : 'Placed • Awaiting Chef',
          minsRemaining: 20,
          gaugeOffset: 235,
          headline: language === 'bn' ? 'অর্ডার গৃহীত হয়েছে' : 'Order Placed with Kitchen',
          subhead: language === 'bn' ? 'বাবুর্চিখানায় KOT স্লিপ পৌঁছেছে' : 'Order transmitted to Chef Tariq',
          spinIcon: 'receipt',
        };
      case 'preparing':
        return {
          pillText: language === 'bn' ? 'রান্না চলছে • In Dum Chamber' : 'Preparing • In Dum Chamber',
          minsRemaining: 12,
          gaugeOffset: 110,
          headline: language === 'bn' ? '১২ মিনিট বাকি' : 'Ready in 12 minutes',
          subhead: language === 'bn' ? 'ধোঁয়া ওঠা খাঁটি গাওয়া ঘিয়ে দম চলছে' : 'Fragrant Dum Cooking over wood charcoal',
          spinIcon: 'local_fire_department',
        };
      case 'ready':
        return {
          pillText: language === 'bn' ? 'খাবার প্রস্তুত • Food Ready' : 'Food Ready • Plating Complete',
          minsRemaining: 2,
          gaugeOffset: 30,
          headline: language === 'bn' ? '২ মিনিট বাকি • প্রস্তুত' : 'Ready in 2 minutes',
          subhead: language === 'bn' ? 'বেরেস্তা ছিটানো হচ্ছে • রানার প্রস্তুত' : 'Garnished with beresta. Ready for runner',
          spinIcon: 'outdoor_grill',
        };
      case 'served':
        return {
          pillText: language === 'bn' ? 'পরিবেশিত • Served' : 'Served • Bon Appétit!',
          minsRemaining: 0,
          gaugeOffset: 0,
          headline: language === 'bn' ? 'টেবিলে পরিবেশিত হয়েছে' : 'Feast Served at Your Table',
          subhead: language === 'bn' ? 'রাজকীয় ভোজ উপভোগ করুন' : 'Enjoy your royal dining experience',
          spinIcon: 'check_circle',
        };
      default:
        return {
          pillText: 'Processing',
          minsRemaining: 10,
          gaugeOffset: 120,
          headline: 'In Progress',
          subhead: 'Kitchen expediter line active',
          spinIcon: 'skillet',
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="flex flex-col w-full pb-32 space-y-4">
      {/* ========================================================
          TEMPORARY CONTROL: Simulate Kitchen Update
          Advances status: placed → preparing → ready → served
          ======================================================== */}
      <div className="rounded-2xl bg-gradient-to-r from-[#2b2a28] to-[#211f1e] border-2 border-[#E5A93C]/70 p-3.5 shadow-[0_4px_20px_rgba(229,169,60,0.25)] flex items-center justify-between gap-3 animate-fadeIn">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/20 border border-[#E5A93C]/50 text-[#F3C669] flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[22px]">
              precision_manufacturing
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-bold text-[#e6e1df]">
                Simulate Kitchen Update
              </span>
              <span className="px-1.5 py-0.2 rounded bg-[#E5A93C] text-[#432c00] text-[9px] font-black uppercase">
                TEST
              </span>
            </div>
            <span className="text-[11px] text-[#F3C669] truncate">
              Next: {getNextStatusLabel(currentStatus)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSimulateKitchenAdvance}
          aria-label="Advance Kitchen Order Status"
          className="min-h-[44px] px-3.5 rounded-xl bg-gradient-to-r from-[#F3C669] to-[#E5A93C] text-[#432c00] font-bold text-[12px] flex items-center gap-1 shadow-md active:scale-95 transition-transform cursor-pointer flex-shrink-0"
        >
          <span>Advance Status</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      {/* Top Order Identity Bar with Expandable Switch Button */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-['Playfair_Display'] text-[20px] font-bold text-[#F3C669] tracking-wide">
              Order #{displayOrderRef}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5A93C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E5A93C]"></span>
            </span>
            <span className="text-[12px] text-[#d4c4b0] font-medium">
              {currentOrder?.orderType === 'takeaway'
                ? 'Takeaway • Parcel'
                : `Table ${currentOrder?.tableNumber || tableInfo.number} • Dine-In`}
            </span>
            <span className="text-[#504535]">•</span>
            <span className="text-[11px] text-[#F3C669] font-bold">
              {orderItems.reduce((acc, i) => acc + i.quantity, 0)} Items
            </span>
          </div>
        </div>

        {/* Clickable Switch to Expand/Collapse Receipt Accordion */}
        <button
          type="button"
          aria-expanded={isAccordionOpen}
          aria-label={isAccordionOpen ? 'Hide order details' : 'Show order details'}
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          className={`min-h-[44px] min-w-[44px] px-3 rounded-full border flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
            isAccordionOpen
              ? 'bg-[#E5A93C] text-[#432c00] border-[#E5A93C] shadow-md font-bold'
              : 'bg-[#2b2a28] text-[#d4c4b0] hover:text-[#F3C669] border-[#504535]/50'
          }`}
        >
          <span className="text-[12px] font-semibold hidden sm:inline">
            {isAccordionOpen
              ? language === 'bn'
                ? 'লুকান'
                : 'Hide'
              : language === 'bn'
              ? 'রসিদ'
              : 'Receipt'}
          </span>
          <span
            className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${
              isAccordionOpen ? 'rotate-180' : ''
            }`}
          >
            expand_more
          </span>
        </button>
      </div>

      {/* Expanded Order Items Receipt Accordion Body */}
      {isAccordionOpen && (
        <div className="rounded-2xl bg-[#1d1b1a] border border-[#E5A93C]/50 p-4 shadow-xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-[#363433]">
            <span className="text-[13px] font-bold text-[#e6e1df] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#E5A93C] text-[18px]">
                receipt
              </span>
              <span>
                {language === 'bn' ? 'অর্ডারকৃত পদের তালিকা' : 'Itemized Feast Breakdown'}
              </span>
            </span>
            <button
              type="button"
              onClick={handleShareTracking}
              className="text-[11px] text-[#F3C669] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">share</span>
              <span>Share</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#211f1e] border border-[#363433]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/20 text-[#F3C669] font-bold flex items-center justify-center text-xs flex-shrink-0">
                    {item.quantity}x
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-bold text-[#e6e1df] truncate">
                      {language === 'bn' ? item.nameBn : item.nameEn}
                    </span>
                    <span className="text-[11px] text-[#9d8f7c] truncate">
                      {item.details || `${item.portion} • ${item.spiceLevel}`}
                    </span>
                  </div>
                </div>
                <span className="font-['Playfair_Display'] text-[14px] font-bold text-[#F3C669] flex-shrink-0">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#363433] flex items-center justify-between text-[13px]">
            <span className="text-[#d4c4b0]">
              {language === 'bn' ? 'মোট বিল:' : 'Grand Total:'}
            </span>
            <span className="font-['Playfair_Display'] text-[18px] font-bold text-[#F3C669]">
              {formatPrice(grandTotal)}
            </span>
          </div>
        </div>
      )}

      {/* Status Hero Card: Saffron Glow & Circular Progress Gauge */}
      <div className="relative overflow-hidden rounded-2xl bg-[#1d1b1a] border border-[#504535]/50 p-6 shadow-xl flex flex-col items-center text-center">
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#E5A93C]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Active State Pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/40 text-[#F3C669]">
          <span className="material-symbols-outlined text-[16px] animate-spin">
            {statusDisplay.spinIcon}
          </span>
          <span className="text-[12px] font-bold tracking-wider uppercase">
            {statusDisplay.pillText}
          </span>
        </div>

        {/* Circular Progress & Dum Countdown */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#E5A93C]/15 blur-xl animate-pulse"></div>
          <svg className="w-40 h-40 -rotate-90 transform" viewBox="0 0 120 120">
            <circle
              className="text-[#363433]"
              cx="60"
              cy="60"
              fill="transparent"
              r="50"
              stroke="currentColor"
              strokeWidth="7"
            />
            <circle
              className="text-[#E5A93C] transition-all duration-700 ease-in-out"
              cx="60"
              cy="60"
              fill="transparent"
              r="50"
              stroke="currentColor"
              strokeDasharray="314.159"
              strokeDashoffset={statusDisplay.gaugeOffset}
              strokeLinecap="round"
              strokeWidth="7"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span
              className="material-symbols-outlined text-[#F3C669] text-[30px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              soup_kitchen
            </span>
            <span className="font-['Playfair_Display'] text-[28px] font-bold text-[#F3C669] leading-none mt-1">
              {statusDisplay.minsRemaining}
            </span>
            <span className="text-[10px] text-[#d4c4b0] uppercase tracking-wider font-semibold">
              Mins Remaining
            </span>
          </div>
        </div>

        <h2 className="font-['Playfair_Display'] text-[20px] font-bold text-[#e6e1df]">
          {statusDisplay.headline}
        </h2>
        <p className="text-[12px] text-[#d4c4b0] mt-1 max-w-xs leading-relaxed">
          {statusDisplay.subhead}
        </p>
      </div>

      {/* 16:9 Full-Width Cinematic Dum Video Card with interactive play button */}
      <div className="w-full rounded-2xl bg-[#1d1b1a] border border-[#504535]/50 overflow-hidden shadow-lg">
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#0f0e0d]">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHJzoYYGxuHfzXxhVrYJteUeDkiv259XQ2VKWJl2M51QMOIAx1kWiPUwR1YfDZ1ssBtYra5jnXWlLg7iAoGpsf_Ku7SqJsM3pY90rPwknRIO_27URJ2jeTb4z6k6Kqqb3x36dq3R0f9LmawyBLdD3Up3lUUsIeK-eGvvCzdeWKF8sBIrT4XlCG42_0IRZIGv3T0NftnkNc3zLEKSTpUZBFxQgnWBPZpJtT3OuIyRjSeJJE-48fg96FBw"
            alt="Handi Dum Steam"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d1b1a] via-[#1d1b1a]/40 to-transparent"></div>

          <button
            type="button"
            aria-label="Play 45s Dum Clip"
            onClick={() => {
              if (onOpenVideo) {
                onOpenVideo(
                  'দমের রহস্য উন্মোচন (Behind the Dum Chamber)',
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuAHJzoYYGxuHfzXxhVrYJteUeDkiv259XQ2VKWJl2M51QMOIAx1kWiPUwR1YfDZ1ssBtYra5jnXWlLg7iAoGpsf_Ku7SqJsM3pY90rPwknRIO_27URJ2jeTb4z6k6Kqqb3x36dq3R0f9LmawyBLdD3Up3lUUsIeK-eGvvCzdeWKF8sBIrT4XlCG42_0IRZIGv3T0NftnkNc3zLEKSTpUZBFxQgnWBPZpJtT3OuIyRjSeJJE-48fg96FBw'
                );
              }
            }}
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#E5A93C] text-[#432c00] flex items-center justify-center shadow-2xl active:scale-95 transition-transform cursor-pointer hover:bg-[#F3C669]"
          >
            <span
              className="material-symbols-outlined text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              play_arrow
            </span>
          </button>

          <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/80 text-[#e6e1df] text-[10px] font-bold border border-white/10">
            ৪৫ সেকেন্ড ক্লিপ
          </span>
        </div>

        <div className="p-3.5 flex items-center justify-between">
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-[14px] font-bold text-[#e6e1df] truncate">
              দমের রহস্য উন্মোচন (Behind the Dum)
            </span>
            <span className="text-[11px] text-[#d4c4b0] truncate">
              জাফরান, কাঁচা মরিচ ও গাওয়া ঘির সুবাসিত মেলবন্ধন
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onOpenVideo) {
                onOpenVideo(
                  'দমের রহস্য উন্মোচন (Behind the Dum Chamber)',
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuAHJzoYYGxuHfzXxhVrYJteUeDkiv259XQ2VKWJl2M51QMOIAx1kWiPUwR1YfDZ1ssBtYra5jnXWlLg7iAoGpsf_Ku7SqJsM3pY90rPwknRIO_27URJ2jeTb4z6k6Kqqb3x36dq3R0f9LmawyBLdD3Up3lUUsIeK-eGvvCzdeWKF8sBIrT4XlCG42_0IRZIGv3T0NftnkNc3zLEKSTpUZBFxQgnWBPZpJtT3OuIyRjSeJJE-48fg96FBw'
                );
              }
            }}
            className="min-h-[44px] px-3 rounded-lg bg-[#2b2a28] hover:bg-[#3b3937] text-[#F3C669] text-[12px] font-bold flex items-center gap-1 flex-shrink-0 cursor-pointer border border-[#504535]/50 active:scale-95 transition-all"
          >
            <span>দেখুন</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Real-time Vertical Culinary Milestone Stepper */}
      <div className="rounded-xl bg-[#211f1e] border border-[#363433] p-4 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-[#363433]">
          <h3 className="text-[15px] font-bold text-[#e6e1df] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#E5A93C] text-[20px]">
              room_service
            </span>
            <span>Preparation Journey</span>
          </h3>
          <span className="text-[11px] text-[#F3C669] font-medium">
            Status: {currentStatus.toUpperCase()}
          </span>
        </div>

        <div className="relative space-y-4 pl-1">
          <div className="absolute left-[17px] top-3 bottom-3 w-0.5 bg-[#363433]"></div>

          {stages.map((stage) => {
            const isCompleted = stage.id < stageIndex;
            const isCurrent = stage.id === stageIndex;

            return (
              <div
                key={stage.id}
                className={`relative flex items-start gap-3 p-2 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-[#2b2a28] border border-[#E5A93C]/50 shadow-md'
                    : ''
                }`}
              >
                {/* Milestone Icon Pill */}
                {isCompleted ? (
                  <div className="z-10 flex-shrink-0 w-8 h-8 rounded-full bg-[#E5A93C] flex items-center justify-center shadow-md text-[#432c00]">
                    <span className="material-symbols-outlined text-[18px] font-bold">
                      check
                    </span>
                  </div>
                ) : isCurrent ? (
                  <div className="z-10 flex-shrink-0 relative w-8 h-8 rounded-full bg-[#2b2a28] flex items-center justify-center">
                    <span className="absolute -inset-1 rounded-full bg-[#E5A93C]/30 animate-ping"></span>
                    <div className="w-8 h-8 rounded-full bg-[#E5A93C] flex items-center justify-center shadow-[0_0_12px_rgba(229,169,60,0.6)] text-[#432c00]">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {stage.icon}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="z-10 flex-shrink-0 w-8 h-8 rounded-full bg-[#363433] flex items-center justify-center text-[#9d8f7c]">
                    <span className="material-symbols-outlined text-[16px]">
                      {stage.icon}
                    </span>
                  </div>
                )}

                <div className="flex flex-col flex-1 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[14px] font-bold ${
                        isCurrent
                          ? 'text-[#F3C669]'
                          : isCompleted
                          ? 'text-[#e6e1df]'
                          : 'text-[#9d8f7c]'
                      }`}
                    >
                      {language === 'bn' ? stage.titleBn : stage.titleEn}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        isCurrent ? 'text-[#F3C669]' : 'text-[#9d8f7c]'
                      }`}
                    >
                      {stage.time}
                    </span>
                  </div>
                  <span className="text-[12px] text-[#d4c4b0] mt-0.5 leading-snug">
                    {language === 'bn' ? stage.detailBn : stage.detailEn}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Details Receipt Card */}
      <div className="rounded-xl bg-[#211f1e] border border-[#363433] p-4 shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#9d8f7c] uppercase tracking-wider font-semibold">
            Payment Receipt
          </span>
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
              currentOrder?.paymentStatus === 'paid'
                ? 'bg-[#E5A93C]/15 text-[#F3C669]'
                : 'bg-[#8e1309]/30 text-[#ffb4a8]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {currentOrder?.paymentStatus === 'paid' ? 'check_circle' : 'pending'}
            </span>
            <span className="text-[11px] font-bold">
              {currentOrder?.paymentStatus === 'paid' ? 'Paid • পরিশোধিত' : 'Pending Payment'}
            </span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D12053] text-white flex items-center justify-center shadow-sm font-bold text-xs tracking-tight flex-shrink-0">
              bKash
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-bold text-[#e6e1df]">
                {paymentMethodName}
              </span>
              <span className="text-[11px] text-[#d4c4b0]">
                ID: TXN-{displayOrderRef}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="font-['Playfair_Display'] text-[20px] font-bold text-[#F3C669]">
              {formatPrice(grandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Switch Buttons: Push Notifications & SMS */}
      <div className="rounded-xl bg-[#211f1e] border border-[#363433] p-4 flex flex-col gap-3">
        {/* Switch 1: Push Alerts */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#E5A93C]/15 text-[#E5A93C] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                notifications_active
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-bold text-[#e6e1df] leading-tight">
                {language === 'bn' ? 'পুশ নোটিফিকেশন' : 'Push Food Alerts'}
              </span>
              <span className="text-[11px] text-[#d4c4b0]">
                {language === 'bn'
                  ? 'খাবার রেডি হলে স্ক্রিনে বার্তা পান'
                  : 'Get notified when food is served'}
              </span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={alertsEnabled}
            aria-label="Toggle push food alerts"
            onClick={() => {
              setAlertsEnabled(!alertsEnabled);
              triggerToast(
                !alertsEnabled
                  ? 'খাবারের নোটিফিকেশন চালু করা হয়েছে'
                  : 'নোটিফিকেশন বন্ধ করা হয়েছে'
              );
            }}
            className="min-h-[44px] min-w-[50px] flex items-center justify-center p-1 cursor-pointer"
          >
            <div
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                alertsEnabled ? 'bg-[#E5A93C]' : 'bg-[#363433]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#141312] shadow-md transition duration-200 ease-in-out ${
                  alertsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Switch 2: SMS Updates Switch */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#363433]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#2b2a28] text-[#F3C669] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">sms</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-bold text-[#e6e1df] leading-tight">
                {language === 'bn' ? 'এসএমএস আপডেট' : 'SMS Order Updates'}
              </span>
              <span className="text-[11px] text-[#d4c4b0]">+880 1712-345678</span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={smsAlertsEnabled}
            aria-label="Toggle SMS alerts"
            onClick={() => {
              setSmsAlertsEnabled(!smsAlertsEnabled);
              triggerToast(
                !smsAlertsEnabled
                  ? 'SMS আপডেট চালু হয়েছে'
                  : 'SMS আপডেট বন্ধ করা হয়েছে'
              );
            }}
            className="min-h-[44px] min-w-[50px] flex items-center justify-center p-1 cursor-pointer"
          >
            <div
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                smsAlertsEnabled ? 'bg-[#E5A93C]' : 'bg-[#363433]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#141312] shadow-md transition duration-200 ease-in-out ${
                  smsAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Switch 3: Sizzling Dum Ambience Sound Switch */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#363433]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#2b2a28] text-[#F3C669] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                {audioDumEnabled ? 'volume_up' : 'volume_off'}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-bold text-[#e6e1df] leading-tight">
                {language === 'bn' ? 'দমের সুবাসিত শব্দ' : 'Dum Kitchen Ambience Sound'}
              </span>
              <span className="text-[11px] text-[#d4c4b0]">
                {audioDumEnabled ? 'Playing soft charcoal sizzle' : 'Muted'}
              </span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={audioDumEnabled}
            aria-label="Toggle kitchen ambience sound"
            onClick={() => {
              setAudioDumEnabled(!audioDumEnabled);
              triggerToast(
                !audioDumEnabled
                  ? 'দমের রান্নার সাউন্ড অন করা হয়েছে'
                  : 'সাউন্ড মিউট করা হয়েছে'
              );
            }}
            className="min-h-[44px] min-w-[50px] flex items-center justify-center p-1 cursor-pointer"
          >
            <div
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                audioDumEnabled ? 'bg-[#E5A93C]' : 'bg-[#363433]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#141312] shadow-md transition duration-200 ease-in-out ${
                  audioDumEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Action Service Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={() =>
            triggerToast(
              `টেবিল ${currentOrder?.tableNumber || tableInfo.number}-তে অতিরিক্ত পানি ও সালাদ চাওয়া হয়েছে!`
            )
          }
          className="min-h-[44px] rounded-xl bg-[#2b2a28] hover:bg-[#3b3937] text-[#e6e1df] border border-[#504535]/50 flex items-center justify-center gap-1.5 text-[12px] font-semibold active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px] text-[#F3C669]">
            water_drop
          </span>
          <span>পানি ও সালাদ চাই</span>
        </button>

        <button
          type="button"
          onClick={() =>
            triggerToast(
              `ক্যাপ্টেনকে টেবিল ${currentOrder?.tableNumber || tableInfo.number}-এ কল পাঠানো হয়েছে!`
            )
          }
          className="min-h-[44px] rounded-xl bg-[#2b2a28] hover:bg-[#3b3937] text-[#e6e1df] border border-[#504535]/50 flex items-center justify-center gap-1.5 text-[12px] font-semibold active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px] text-[#E5A93C]">
            notifications_active
          </span>
          <span>ওয়েটার ডাকুন</span>
        </button>
      </div>

      {/* Modify / Cancel Order Trigger Button */}
      <button
        type="button"
        onClick={() => setIsCancelModalOpen(true)}
        className="min-h-[44px] w-full text-center text-[12px] text-[#9d8f7c] hover:text-[#ffb4a8] transition-colors py-1 cursor-pointer"
      >
        {language === 'bn'
          ? 'অর্ডার পরিবর্তন বা বিশেষ অনুরোধ? এখানে চাপুন'
          : 'Need modification or assistance? Tap here'}
      </button>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-20 inset-x-0 z-40 px-4 sm:px-5 pointer-events-none">
        <div className="max-w-md mx-auto flex items-center gap-2.5 pointer-events-auto bg-[#0f0e0d]/92 backdrop-blur-xl p-2.5 rounded-xl border border-[#504535]/50 shadow-2xl">
          <button
            type="button"
            onClick={onBackToMenu}
            className="min-h-[48px] px-4 rounded-lg bg-[#211f1e] text-[#e6e1df] hover:text-[#F3C669] text-[13px] font-bold flex items-center justify-center border border-[#363433] flex-1 text-center active:scale-95 transition-all cursor-pointer"
          >
            Back to Menu
          </button>

          <button
            type="button"
            onClick={() =>
              triggerToast(
                `Captain has been summoned to Table ${currentOrder?.tableNumber || tableInfo.number}`
              )
            }
            className="min-h-[48px] px-5 rounded-lg bg-gradient-to-r from-[#F3C669] to-[#E5A93C] text-[#432c00] text-[13px] font-bold flex items-center justify-center gap-2 shadow-lg hover:brightness-105 active:scale-95 transition-all flex-[1.4] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px]">room_service</span>
            <span>Call Staff</span>
          </button>
        </div>
      </div>

      {/* Modification Request Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-[#1d1b1a] border border-[#504535]/60 p-5 shadow-2xl flex flex-col gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-[#E5A93C]/20 text-[#E5A93C] mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">
                support_agent
              </span>
            </div>
            <h3 className="font-['Playfair_Display'] text-[18px] font-bold text-[#e6e1df]">
              {language === 'bn' ? 'কিচেন সহায়তা' : 'Table Assistance'}
            </h3>
            <p className="text-[12px] text-[#d4c4b0] leading-relaxed">
              {language === 'bn'
                ? 'দম রান্না শুরু হয়ে গেছে। পদ পরিবর্তন বা অতিরিক্ত পদের জন্য ডাইনিং ক্যাপ্টেন সরাসরি আপনার টেবিলে উপস্থিত হচ্ছেন।'
                : 'Dum preparation is active. Captain is arriving at your table to assist with additions or special instructions.'}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCancelModalOpen(false);
                  triggerToast('ক্যাপ্টেনের কাছে মেসেজ পৌঁছে গেছে');
                }}
                className="flex-1 min-h-[44px] rounded-xl bg-gradient-to-r from-[#F3C669] to-[#E5A93C] text-[#432c00] font-bold text-[13px] flex items-center justify-center cursor-pointer shadow-md"
              >
                Send Captain
              </button>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="min-h-[44px] px-4 rounded-xl bg-[#2b2a28] text-[#d4c4b0] text-[13px] font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
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

export default LiveTracking;
