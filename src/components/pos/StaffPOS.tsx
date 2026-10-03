/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  advanceOrderStatus,
  getAllOrders,
  getElapsedTime,
  subscribeToOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from '../../store/orderStore';
import { ActiveOrder, OrderStatus, PaymentStatus } from '../../types/restaurant';
import { formatPrice } from '../../utils/formatters';

interface StaffPOSProps {
  language: 'bn' | 'en';
}

type FilterType = 'all' | 'new' | 'preparing' | 'ready' | 'takeaway' | 'unpaid';

export const StaffPOS: React.FC<StaffPOSProps> = ({ language }) => {
  const [orders, setOrders] = useState<ActiveOrder[]>(() => getAllOrders());
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Subscribe to live order updates from the shared store
  useEffect(() => {
    const unsubscribe = subscribeToOrders(() => {
      setOrders(getAllOrders());
    });
    return () => unsubscribe();
  }, []);

  // Periodic elapsed time refresher (every 10s)
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders([...getAllOrders()]);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    // TODO: Send WebSocket packet to backend (e.g. wss://api.sultanskitchen.com/pos/status-update)
    updateOrderStatus(orderId, newStatus);
    triggerToast(
      language === 'bn'
        ? `অর্ডার #${orderId} স্ট্যাটাস: ${newStatus.toUpperCase()}`
        : `Order #${orderId} updated to ${newStatus.toUpperCase()}`
    );
  };

  const handleTogglePayment = (orderId: string, currentStatus: PaymentStatus) => {
    // TODO: Update merchant settlement ledger in database
    const newStatus: PaymentStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    updatePaymentStatus(orderId, newStatus);
    triggerToast(
      newStatus === 'paid'
        ? `Order #${orderId} marked as PAID`
        : `Order #${orderId} marked as PENDING payment`
    );
  };

  // Filter orders based on selected tab
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'new') return order.orderStatus === 'placed';
    if (activeFilter === 'preparing') return order.orderStatus === 'preparing';
    if (activeFilter === 'ready') return order.orderStatus === 'ready';
    if (activeFilter === 'takeaway') return order.orderType === 'takeaway';
    if (activeFilter === 'unpaid') return order.paymentStatus === 'pending';
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return {
          label: 'NEW • PLACED',
          labelBn: 'নতুন অর্ডার',
          bg: 'bg-[#E5A93C]/20',
          text: 'text-[#F3C669]',
          border: 'border-[#E5A93C]/50',
          icon: 'receipt',
        };
      case 'preparing':
        return {
          label: 'IN DUM • PREPARING',
          labelBn: 'আঁচে দম চলছে',
          bg: 'bg-[#8e1309]/30',
          text: 'text-[#ffb4a8]',
          border: 'border-[#8e1309]/60',
          icon: 'local_fire_department',
        };
      case 'ready':
        return {
          label: 'READY FOR SERVING',
          labelBn: 'পরিবেশনের জন্য প্রস্তুত',
          bg: 'bg-[#2b2a28]',
          text: 'text-[#F3C669]',
          border: 'border-[#504535]',
          icon: 'outdoor_grill',
        };
      case 'served':
        return {
          label: 'SERVED & CLOSED',
          labelBn: 'সম্পন্ন',
          bg: 'bg-[#141312]',
          text: 'text-[#9d8f7c]',
          border: 'border-[#363433]',
          icon: 'check_circle',
        };
      default:
        return {
          label: status.toUpperCase(),
          labelBn: status,
          bg: 'bg-[#211f1e]',
          text: 'text-[#d4c4b0]',
          border: 'border-[#363433]',
          icon: 'info',
        };
    }
  };

  return (
    <div className="flex flex-col w-full pb-32 space-y-4">
      {/* 1. Offline-mode Banner (Static UI for resilience) */}
      <div className="rounded-xl bg-[#211f1e] p-3 border border-[#E5A93C]/40 shadow-sm flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5A93C] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E5A93C]"></span>
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-bold text-[#e6e1df] truncate">
              {language === 'bn' ? 'অফলাইন বাফার মোড সক্রিয়' : 'Offline Mode Buffer Active'}
            </span>
            <span className="text-[11px] text-[#d4c4b0] truncate">
              {language === 'bn'
                ? 'লোকাল স্টোরেজে লাইভ সিঙ্ক চলছে • কোনো অর্ডার হারাবে না'
                : 'Local client store active • Zero order drops • Instant customer sync'}
            </span>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded bg-[#141312] border border-[#504535]/50 text-[#F3C669] text-[10px] font-bold whitespace-nowrap">
          LOCAL SYNC
        </span>
      </div>

      {/* 2. Staff Header & Actions Ribbon */}
      <div className="rounded-2xl bg-[#1d1b1a] border border-[#504535]/50 p-4 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-[#141312] ring-2 ring-[#E5A93C]/70 flex-shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTqetP0eSZ2aagyvlKMChhirEmITEQhJrlMVE_3nmIqZEbwkDe_GD1tImjCeuu_aM00RpbmZZvwXRDkHYpPiK9Hfhy5OyRhdCYBe7GjIjac64Bfuu2sSrXcIgi6dlT7fuzqaod9n-TnuhWX6znWuG45VdDjVutXxsOCAho3_B0D1uo_qQtS02eYpieRW96bxrqxBjQKSF9fnYv_VXcKqM0Vxt9l77TgqOnCpV5_Eo-46QjwAlVLhQIKw"
                alt="Chef Tariq"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-[#e6e1df] truncate">
                  {language === 'bn' ? 'শেফ তারিক হাসান' : 'Chef Tariq Hasan'}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#E5A93C]/20 text-[#F3C669] text-[9px] font-bold">
                  KOT CONSOLE
                </span>
              </div>
              <span className="text-[11px] text-[#d4c4b0] truncate">
                {language === 'bn' ? 'লাইভ কিচেন অর্ডার স্ক্রিন' : 'Kitchen Expediter Line • Live'}
              </span>
            </div>
          </div>

          {/* Manual Order Entry Button */}
          <button
            type="button"
            onClick={() => setIsManualModalOpen(true)}
            className="min-h-[44px] px-3.5 rounded-xl bg-gradient-to-r from-[#F3C669] to-[#E5A93C] text-[#432c00] font-bold text-[12px] flex items-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>{language === 'bn' ? '+ নতুন টিকেট' : '+ Manual Entry'}</span>
          </button>
        </div>

        {/* Live Filter Bar: All, New, Preparing, Ready, Takeaway, Unpaid */}
        <div className="overflow-x-auto no-scrollbar -mx-1 px-1 pt-1 border-t border-[#363433]">
          <div className="flex items-center gap-1.5 w-max">
            {[
              { id: 'all', label: 'All Orders', count: orders.length },
              {
                id: 'new',
                label: 'New',
                count: orders.filter((o) => o.orderStatus === 'placed').length,
              },
              {
                id: 'preparing',
                label: 'Preparing',
                count: orders.filter((o) => o.orderStatus === 'preparing').length,
              },
              {
                id: 'ready',
                label: 'Ready',
                count: orders.filter((o) => o.orderStatus === 'ready').length,
              },
              {
                id: 'takeaway',
                label: 'Takeaway',
                count: orders.filter((o) => o.orderType === 'takeaway').length,
              },
              {
                id: 'unpaid',
                label: 'Unpaid',
                count: orders.filter((o) => o.paymentStatus === 'pending').length,
              },
            ].map((f) => {
              const isSelected = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id as FilterType)}
                  className={`min-h-[44px] px-3.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#E5A93C] text-[#432c00] border-[#E5A93C] shadow-md'
                      : 'bg-[#211f1e] text-[#d4c4b0] hover:text-[#e6e1df] border-[#363433]'
                  }`}
                >
                  <span>{f.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected
                        ? 'bg-[#432c00] text-[#E5A93C]'
                        : 'bg-[#2b2a28] text-[#F3C669]'
                    }`}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Live Order Cards Container (Single-column on phones, Two-column grid on tablets/wider screens) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-['Playfair_Display'] text-[17px] font-bold text-[#e6e1df]">
            {language === 'bn' ? 'সক্রিয় কিচেন টিকেটসমূহ' : 'Live Kitchen Orders'}{' '}
            <span className="text-[#F3C669]">({filteredOrders.length})</span>
          </h2>
          <span className="text-[11px] text-[#9d8f7c]">
            Auto-syncs customer tracking
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center bg-[#211f1e] rounded-2xl border border-[#363433] space-y-2">
            <span className="material-symbols-outlined text-[36px] text-[#9d8f7c]">
              task_alt
            </span>
            <p className="text-[14px] font-semibold text-[#e6e1df]">
              No orders matching "{activeFilter.toUpperCase()}" filter
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className="min-h-[44px] px-4 rounded-full bg-[#E5A93C] text-[#432c00] text-[12px] font-bold cursor-pointer"
            >
              View All Orders
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredOrders.map((order) => {
              const badge = getStatusBadge(order.orderStatus);
              const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
              const elapsedStr = getElapsedTime(order.createdTimestamp);

              return (
                <div
                  key={order.orderId}
                  className="rounded-2xl bg-[#1d1b1a] border border-[#504535]/50 p-4 shadow-md flex flex-col justify-between space-y-3 transition-all hover:border-[#E5A93C]/60"
                >
                  {/* Card Header: Order ID, Table/Takeaway, Status badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-['Playfair_Display'] text-[17px] font-bold text-[#F3C669]">
                            #{order.orderId}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#2b2a28] text-[#e6e1df] text-[11px] font-bold border border-[#504535]/40">
                            {order.orderType === 'takeaway'
                              ? 'Takeaway'
                              : `Table ${order.tableNumber || '08'}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#9d8f7c]">
                          <span>{elapsedStr}</span>
                          <span>•</span>
                          <span>{itemCount} items</span>
                          <span>•</span>
                          <span className="capitalize">{order.orderType}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {badge.icon}
                        </span>
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    {/* Itemized Food List */}
                    <div className="mt-3 p-2.5 rounded-xl bg-[#141312] text-[12px] space-y-1.5 text-[#d4c4b0] border border-[#363433]/70">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <span className="font-semibold text-[#e6e1df]">
                              {item.quantity}x {item.nameEn}
                            </span>
                            {item.details && (
                              <p className="text-[10px] text-[#9d8f7c] truncate">
                                {item.details}
                              </p>
                            )}
                          </div>
                          <span className="font-semibold text-[#F3C669] flex-shrink-0">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      ))}

                      {order.specialNotes && (
                        <div className="pt-1 mt-1 border-t border-[#363433] text-[11px] text-[#ffb4a8] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">
                            edit_note
                          </span>
                          <span className="truncate">{order.specialNotes}</span>
                        </div>
                      )}
                    </div>

                    {/* Total & Payment Rail Status Pill */}
                    <div className="mt-3 flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-[#d4c4b0]">Total:</span>
                        <span className="font-['Playfair_Display'] text-[18px] font-bold text-[#F3C669]">
                          {formatPrice(order.grandTotal)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleTogglePayment(order.orderId, order.paymentStatus)
                        }
                        className={`min-h-[36px] px-2.5 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all border ${
                          order.paymentStatus === 'paid'
                            ? 'bg-[#E5A93C]/15 text-[#F3C669] border-[#E5A93C]/40'
                            : 'bg-[#8e1309]/30 text-[#ffb4a8] border-[#8e1309]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {order.paymentStatus === 'paid' ? 'verified' : 'pending'}
                        </span>
                        <span>
                          {order.paymentStatus === 'paid' ? 'PAID' : 'PAYMENT PENDING'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* 4. Staff Interactive Buttons (Accept, Mark Preparing, Food Ready, Complete) */}
                  <div className="pt-2 border-t border-[#363433] flex flex-wrap gap-2">
                    {order.orderStatus === 'placed' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.orderId, 'preparing')}
                          className="min-h-[44px] flex-1 rounded-xl bg-gradient-to-r from-[#F3C669] to-[#E5A93C] text-[#432c00] font-bold text-[12px] flex items-center justify-center gap-1 shadow-md active:scale-95 transition-transform cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            thumb_up
                          </span>
                          <span>Accept & Start Dum</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            triggerToast(`Reprinted KOT #${order.orderId} slip`)
                          }
                          className="min-h-[44px] px-3 rounded-xl bg-[#2b2a28] hover:bg-[#3b3937] text-[#d4c4b0] text-[12px] font-semibold border border-[#504535]/50 flex items-center justify-center active:scale-95 cursor-pointer"
                        >
                          Print KOT
                        </button>
                      </>
                    )}

                    {order.orderStatus === 'preparing' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.orderId, 'ready')}
                          className="min-h-[44px] flex-1 rounded-xl bg-[#E5A93C] text-[#432c00] font-bold text-[12px] flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            outdoor_grill
                          </span>
                          <span>Food Ready</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.orderId, 'served')}
                          className="min-h-[44px] px-3.5 rounded-xl bg-[#2b2a28] text-[#F3C669] text-[12px] font-bold border border-[#504535]/50 active:scale-95 cursor-pointer"
                        >
                          Direct Complete
                        </button>
                      </>
                    )}

                    {order.orderStatus === 'ready' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(order.orderId, 'served')}
                        className="min-h-[44px] w-full rounded-xl bg-gradient-to-r from-[#F3C669] to-[#E5A93C] text-[#432c00] font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          check_circle
                        </span>
                        <span>Complete & Hand to Runner</span>
                      </button>
                    )}

                    {order.orderStatus === 'served' && (
                      <div className="w-full flex items-center justify-between text-[11px] text-[#9d8f7c] px-1">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-[#E5A93C]">
                            check
                          </span>
                          <span>Completed</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.orderId, 'preparing')}
                          className="text-[#F3C669] hover:underline cursor-pointer"
                        >
                          Reopen Ticket
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Manual Order Entry Modal (Static UI prototype) */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-[#1d1b1a] border border-[#504535]/60 p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#363433]">
              <span className="font-['Playfair_Display'] text-[17px] font-bold text-[#F3C669]">
                Manual KOT Entry
              </span>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#2b2a28] flex items-center justify-center text-[#d4c4b0] hover:text-[#e6e1df] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-[12px] text-[#d4c4b0]">
              Create an urgent manual KOT ticket for walk-in or telephone orders:
            </p>
            <input
              type="text"
              defaultValue="Table 04 (Walk-in)"
              placeholder="Table or Guest Name"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#211f1e] border border-[#363433] text-[13px] text-[#e6e1df] focus:outline-none focus:border-[#E5A93C]"
            />
            <input
              type="text"
              defaultValue="1x Mutton Kacchi, 1x Borhani"
              placeholder="Items list"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#211f1e] border border-[#363433] text-[13px] text-[#e6e1df] focus:outline-none focus:border-[#E5A93C]"
            />
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerToast('Manual KOT #SK-9988 dispatched to kitchen line!');
                  setIsManualModalOpen(false);
                }}
                className="flex-1 min-h-[44px] rounded-xl bg-gradient-to-r from-[#F3C669] to-[#E5A93C] text-[#432c00] font-bold text-[13px] cursor-pointer shadow-md"
              >
                Dispatch to Kitchen
              </button>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="min-h-[44px] px-4 rounded-xl bg-[#2b2a28] text-[#d4c4b0] text-[13px] font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full bg-[#E5A93C] text-[#432c00] text-[12px] font-bold shadow-2xl z-50 animate-fadeIn">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default StaffPOS;
