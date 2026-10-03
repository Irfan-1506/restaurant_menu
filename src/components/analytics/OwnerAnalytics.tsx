import React, { useState } from 'react';

interface OwnerAnalyticsProps {
  language: 'bn' | 'en';
}

export const OwnerAnalytics: React.FC<OwnerAnalyticsProps> = ({ language }) => {
  const [period, setPeriod] = useState<'today' | 'yesterday' | 'week' | 'month'>('today');
  const [branch, setBranch] = useState('Dhanmondi');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Switch toggles
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [includeTipsInMargin, setIncludeTipsInMargin] = useState(true);

  // Settlement modal state
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);

  const branches = ['Dhanmondi', 'Gulshan-2', 'Uttara Sector 3'];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const cycleBranch = () => {
    const currentIdx = branches.indexOf(branch);
    const nextBranch = branches[(currentIdx + 1) % branches.length];
    setBranch(nextBranch);
    triggerToast(`Switched telemetry to ${nextBranch} outlet`);
  };

  // Dynamic metrics per period
  const metrics = {
    today: {
      revenue: '৳184,520',
      targetPct: 82,
      orders: 218,
      dine: 142,
      take: 76,
      avg: '৳846',
      lift: '+৳62 ticket lift',
      margin: '68.4%',
      foodCost: '31.6%',
    },
    yesterday: {
      revenue: '৳212,840',
      targetPct: 96,
      orders: 244,
      dine: 168,
      take: 76,
      avg: '৳872',
      lift: '+৳48 ticket lift',
      margin: '69.1%',
      foodCost: '30.9%',
    },
    week: {
      revenue: '৳1,248,600',
      targetPct: 91,
      orders: 1482,
      dine: 994,
      take: 488,
      avg: '৳842',
      lift: '+৳55 weekly trend',
      margin: '67.8%',
      foodCost: '32.2%',
    },
    month: {
      revenue: '৳5,420,000',
      targetPct: 104,
      orders: 6310,
      dine: 4220,
      take: 2090,
      avg: '৳858',
      lift: '+৳74 MoM lift',
      margin: '68.7%',
      foodCost: '31.3%',
    },
  }[period];

  return (
    <div className="flex flex-col w-full pb-32 space-y-5">
      {/* Executive Header Sub-bar with Branch Switcher Button */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#E5A93C] animate-ping"></span>
            <span className="text-[11px] font-bold text-[#F3C669] uppercase tracking-wider">
              {branch} Flagship • Live
            </span>
          </div>
          <h1 className="font-['Playfair_Display'] text-[24px] font-bold text-[#e6e1df]">
            Business Insights
          </h1>
        </div>

        <button
          type="button"
          onClick={cycleBranch}
          className="min-h-[44px] px-3.5 py-1.5 rounded-full bg-[#2b2a28] hover:bg-[#3b3937] text-[#e6e1df] border border-[#504535]/50 flex items-center gap-1.5 text-[12px] font-semibold active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px] text-[#E5A93C]">
            store
          </span>
          <span>{branch}</span>
          <span className="material-symbols-outlined text-[15px] text-[#9d8f7c]">
            expand_more
          </span>
        </button>
      </div>

      {/* Time Period Filter Switch Buttons */}
      <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[#0f0e0d] border border-[#363433] w-max">
          {(
            [
              { id: 'today', labelBn: 'আজ • লাইভ', labelEn: 'Today • Live' },
              { id: 'yesterday', labelBn: 'গতকাল', labelEn: 'Yesterday' },
              { id: 'week', labelBn: 'এই সপ্তাহ', labelEn: 'This Week' },
              { id: 'month', labelBn: 'এই মাস', labelEn: 'This Month' },
            ] as const
          ).map((p) => {
            const isSelected = period === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="switch"
                aria-checked={isSelected}
                onClick={() => setPeriod(p.id)}
                className={`min-h-[44px] px-4 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#E5A93C] text-[#432c00] shadow-md'
                    : 'text-[#d4c4b0] hover:text-[#e6e1df]'
                }`}
              >
                {language === 'bn' ? p.labelBn : p.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Executive KPI Bento Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Gross Revenue */}
        <div className="col-span-2 rounded-2xl bg-[#1d1b1a] border border-[#504535]/50 p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-start justify-between mb-1">
            <span className="text-[11px] uppercase tracking-wider text-[#9d8f7c] font-semibold">
              Gross {period.toUpperCase()} Revenue
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E5A93C]/15 text-[#F3C669] text-[11px] font-bold">
              <span className="material-symbols-outlined text-[13px]">trending_up</span>
              +14.2%
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-['Playfair_Display'] text-[30px] font-bold text-[#F3C669] tracking-tight">
              {metrics.revenue}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <div className="h-2 flex-1 rounded-full bg-[#363433] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F3C669] to-[#E5A93C] rounded-full transition-all duration-500"
                style={{ width: `${metrics.targetPct}%` }}
              ></div>
            </div>
            <span className="text-[11px] font-bold text-[#F3C669]">{metrics.targetPct}% of Target</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-xl bg-[#211f1e] border border-[#363433] p-3.5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] text-[#d4c4b0]">Total Orders</span>
            <span className="material-symbols-outlined text-[#E5A93C] text-[18px]">
              receipt_long
            </span>
          </div>
          <p className="font-['Playfair_Display'] text-[24px] font-bold text-[#e6e1df]">
            {metrics.orders}
          </p>
          <div className="mt-2 text-[11px] text-[#9d8f7c] flex items-center justify-between">
            <span className="text-[#F3C669]">Dine: {metrics.dine}</span>
            <span>•</span>
            <span className="text-[#ffb4a8]">Take: {metrics.take}</span>
          </div>
        </div>

        {/* Avg Order */}
        <div className="rounded-xl bg-[#211f1e] border border-[#363433] p-3.5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] text-[#d4c4b0]">Average Order</span>
            <span className="material-symbols-outlined text-[#f6c96c] text-[18px]">
              payments
            </span>
          </div>
          <p className="font-['Playfair_Display'] text-[24px] font-bold text-[#F3C669]">
            {metrics.avg}
          </p>
          <div className="mt-2 text-[11px] text-[#F3C669] flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[13px]">arrow_upward</span>
            <span>{metrics.lift}</span>
          </div>
        </div>

        {/* Culinary Margin */}
        <div className="col-span-2 rounded-xl bg-[#211f1e] border border-[#363433] p-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2b2a28] flex items-center justify-center text-[#E5A93C]">
              <span className="material-symbols-outlined text-[22px]">pie_chart</span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#9d8f7c] block">
                Culinary Margin
              </span>
              <span className="text-[16px] font-bold text-[#e6e1df]">{metrics.margin} Net Profit</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#9d8f7c] block">Food Cost</span>
            <span className="text-[14px] font-bold text-[#ffb4ab]">{metrics.foodCost}</span>
          </div>
        </div>
      </div>

      {/* Analytics Interactive Switch Controls Card */}
      <div className="rounded-xl bg-[#211f1e] border border-[#363433] p-4 flex flex-col gap-3 shadow-md">
        <span className="text-[14px] font-bold text-[#e6e1df]">Telemetry & Alert Switches</span>

        {/* Switch 1: Auto Refresh */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="material-symbols-outlined text-[18px] text-[#E5A93C]">sync</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold text-[#e6e1df]">Auto-Refresh (15s)</span>
              <span className="text-[11px] text-[#9d8f7c]">
                {autoRefresh ? 'Live cloud sync running' : 'Paused'}
              </span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={autoRefresh}
            aria-label="Toggle Auto Refresh"
            onClick={() => {
              setAutoRefresh(!autoRefresh);
              triggerToast(
                !autoRefresh
                  ? 'লাইভ অটো-রিফ্রেশ চালু হয়েছে'
                  : 'অটো-রিফ্রেশ থামানো হয়েছে'
              );
            }}
            className="min-h-[44px] min-w-[50px] flex items-center justify-center p-1 cursor-pointer"
          >
            <div
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                autoRefresh ? 'bg-[#E5A93C]' : 'bg-[#363433]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#141312] shadow-md transition duration-200 ease-in-out ${
                  autoRefresh ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Switch 2: Sound Alerts */}
        <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-[#363433]">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="material-symbols-outlined text-[18px] text-[#f6c96c]">volume_up</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold text-[#e6e1df]">High Ticket Audio Chime</span>
              <span className="text-[11px] text-[#9d8f7c]">
                {soundAlerts ? 'Alerts for orders > ৳2,000' : 'Muted'}
              </span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={soundAlerts}
            aria-label="Toggle High Ticket Chime"
            onClick={() => {
              setSoundAlerts(!soundAlerts);
              triggerToast(
                !soundAlerts
                  ? 'হাই-টিকেট অডিও কাইম চালু করা হয়েছে'
                  : 'অডিও মিউট করা হয়েছে'
              );
            }}
            className="min-h-[44px] min-w-[50px] flex items-center justify-center p-1 cursor-pointer"
          >
            <div
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                soundAlerts ? 'bg-[#E5A93C]' : 'bg-[#363433]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#141312] shadow-md transition duration-200 ease-in-out ${
                  soundAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Switch 3: Tips in Margin */}
        <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-[#363433]">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="material-symbols-outlined text-[18px] text-[#ffb4a8]">volunteer_activism</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold text-[#e6e1df]">Include Brigade Gratuity</span>
              <span className="text-[11px] text-[#9d8f7c]">
                {includeTipsInMargin ? 'Included in gross ledger' : 'Isolated to brigade pool'}
              </span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={includeTipsInMargin}
            aria-label="Toggle Gratuity in Margin"
            onClick={() => {
              setIncludeTipsInMargin(!includeTipsInMargin);
              triggerToast('টিপস হিসাবের পলিসি আপডেট হয়েছে');
            }}
            className="min-h-[44px] min-w-[50px] flex items-center justify-center p-1 cursor-pointer"
          >
            <div
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                includeTipsInMargin ? 'bg-[#E5A93C]' : 'bg-[#363433]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#141312] shadow-md transition duration-200 ease-in-out ${
                  includeTipsInMargin ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Hourly Revenue Curve */}
      <div className="p-4 rounded-2xl bg-[#1d1b1a] border border-[#504535]/40 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-['Playfair_Display'] text-[17px] font-bold text-[#e6e1df]">
              Hourly Revenue Curve
            </h2>
            <p className="text-[11px] text-[#d4c4b0]">
              Dhaka Rush Peaks: 2:00 PM & 9:00 PM
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#E5A93C]/15 text-[#F3C669] text-[10px] font-bold">
            LIVE FEED
          </span>
        </div>

        {/* Bar Visualizer */}
        <div className="w-full h-32 flex items-end justify-between gap-1.5 pt-3">
          {[
            { hour: '12P', height: 28, count: 18 },
            { hour: '1P', height: 50, count: 32 },
            { hour: '2P', height: 86, count: 48, peak: true },
            { hour: '3P', height: 55, count: 28 },
            { hour: '4P', height: 20, count: 12 },
            { hour: '5P', height: 26, count: 16 },
            { hour: '6P', height: 42, count: 24 },
            { hour: '7P', height: 60, count: 38 },
            { hour: '8P', height: 82, count: 46 },
            { hour: '9P', height: 100, count: 54, peak: true },
            { hour: '10P', height: 68, count: 36 },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end relative">
              {bar.peak && (
                <span className="absolute -top-5 px-1 py-0.2 rounded bg-[#E5A93C] text-[#432c00] text-[9px] font-black shadow-sm">
                  {bar.count}
                </span>
              )}
              <div
                className={`w-full rounded-t-sm transition-all ${
                  bar.peak
                    ? 'bg-gradient-to-t from-[#E5A93C] to-[#F3C669] shadow-[0_0_10px_rgba(229,169,60,0.5)]'
                    : 'bg-[#363433] hover:bg-[#504535]'
                }`}
                style={{ height: `${bar.height}%` }}
              ></div>
              <span className={`text-[10px] font-semibold ${bar.peak ? 'text-[#F3C669]' : 'text-[#9d8f7c]'}`}>
                {bar.hour}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Actions */}
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={() => setIsSettlementModalOpen(true)}
          className="flex-1 min-h-[48px] rounded-xl bg-gradient-to-r from-[#F3C669] to-[#E5A93C] text-[#432c00] font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">print</span>
          <span>Close & Print Register</span>
        </button>

        <button
          type="button"
          onClick={() => triggerToast('Audit summary exported as PDF report')}
          className="min-h-[48px] min-w-[48px] px-3.5 rounded-xl bg-[#2b2a28] hover:bg-[#3b3937] text-[#e6e1df] border border-[#504535]/50 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          aria-label="Export audit report"
        >
          <span className="material-symbols-outlined text-[20px]">download</span>
        </button>
      </div>

      {/* Register Settlement Summary Modal */}
      {isSettlementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-[#1d1b1a] border border-[#504535]/60 p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#363433]">
              <span className="font-['Playfair_Display'] text-[17px] font-bold text-[#F3C669]">
                Daily Register Settlement
              </span>
              <button
                type="button"
                onClick={() => setIsSettlementModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#2b2a28] flex items-center justify-center text-[#d4c4b0] hover:text-[#e6e1df]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2 text-[13px] bg-[#211f1e] p-3 rounded-xl border border-[#363433]">
              <div className="flex justify-between">
                <span className="text-[#d4c4b0]">bKash Collections:</span>
                <span className="font-bold text-[#e6e1df]">৳88,520</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#d4c4b0]">SSL / Cards:</span>
                <span className="font-bold text-[#e6e1df]">৳48,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#d4c4b0]">Counter Cash Drawer:</span>
                <span className="font-bold text-[#e6e1df]">৳29,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#d4c4b0]">Nagad Collections:</span>
                <span className="font-bold text-[#e6e1df]">৳18,500</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#363433]">
                <span className="font-bold text-[#F3C669]">Total Gross:</span>
                <span className="font-['Playfair_Display'] font-bold text-[#F3C669] text-[16px]">৳184,520</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerToast('Official register locked and thermal report dispatched!');
                  setIsSettlementModalOpen(false);
                }}
                className="flex-1 min-h-[44px] rounded-xl bg-[#E5A93C] text-[#432c00] font-bold text-[13px] cursor-pointer shadow-md"
              >
                Lock & Print
              </button>
              <button
                type="button"
                onClick={() => setIsSettlementModalOpen(false)}
                className="min-h-[44px] px-4 rounded-xl bg-[#2b2a28] text-[#d4c4b0] text-[13px] font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full bg-[#E5A93C] text-[#432c00] text-[12px] font-bold shadow-2xl z-50 animate-fadeIn">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default OwnerAnalytics;
