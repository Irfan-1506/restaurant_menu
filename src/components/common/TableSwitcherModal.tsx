import React, { useState } from 'react';
import { OrderType } from '../../types/restaurant';

interface TableSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTable: string;
  currentMode: OrderType;
  onSelectTable: (tableNum: string, mode: OrderType) => void;
  language: 'bn' | 'en';
}

export const TableSwitcherModal: React.FC<TableSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentTable,
  currentMode,
  onSelectTable,
  language,
}) => {
  const [selectedSection, setSelectedSection] = useState<'all' | 'lounge' | 'balcony' | 'terrace'>('all');

  if (!isOpen) return null;

  const tables = [
    { number: '08', section: 'Royal Lounge', sectionBn: 'রয়্যাল লাউঞ্জ', sectionType: 'lounge', status: 'Active (You)', occupied: true },
    { number: '14', section: 'Mughal Balcony', sectionBn: 'মুঘল ব্যালকনি', sectionType: 'balcony', status: 'Available', occupied: false },
    { number: '02', section: 'Family Diwan', sectionBn: 'ফ্যামিলি দিওয়ান', sectionType: 'lounge', status: 'Occupied', occupied: true },
    { number: '04', section: 'Royal Lounge', sectionBn: 'রয়্যাল লাউঞ্জ', sectionType: 'lounge', status: 'Available', occupied: false },
    { number: '12', section: 'Mughal Balcony', sectionBn: 'মুঘল ব্যালকনি', sectionType: 'balcony', status: 'Available', occupied: false },
    { number: '21', section: 'Terrace Garden', sectionBn: 'টেরেস গার্ডেন', sectionType: 'terrace', status: 'Available', occupied: false },
  ];

  const filteredTables = tables.filter((t) => {
    if (selectedSection === 'all') return true;
    return t.sectionType === selectedSection;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-[#1d1b1a] border border-[#504535]/60 p-5 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#363433]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#E5A93C] text-[22px]">
              table_restaurant
            </span>
            <h3 className="font-['Playfair_Display'] text-[17px] font-bold text-[#e6e1df]">
              {language === 'bn' ? 'টেবিল বা ডাইনিং মোড পরিবর্তন' : 'Switch Table or Dining Mode'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Table Switcher"
            className="min-w-[44px] min-h-[44px] -mr-2 rounded-full flex items-center justify-center text-[#d4c4b0] hover:text-[#F3C669] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Quick Mode Toggle */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={currentMode === 'dinein'}
            onClick={() => {
              onSelectTable(currentTable || '08', 'dinein');
              onClose();
            }}
            className={`min-h-[48px] px-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-[13px] transition-all cursor-pointer ${
              currentMode === 'dinein'
                ? 'bg-[#E5A93C] text-[#432c00] border-[#E5A93C] shadow-md'
                : 'bg-[#211f1e] text-[#e6e1df] border-[#363433] hover:bg-[#2b2a28]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">restaurant</span>
            <span>Dine-In</span>
          </button>

          <button
            type="button"
            role="switch"
            aria-checked={currentMode === 'takeaway'}
            onClick={() => {
              onSelectTable('', 'takeaway');
              onClose();
            }}
            className={`min-h-[48px] px-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-[13px] transition-all cursor-pointer ${
              currentMode === 'takeaway'
                ? 'bg-[#E5A93C] text-[#432c00] border-[#E5A93C] shadow-md'
                : 'bg-[#211f1e] text-[#e6e1df] border-[#363433] hover:bg-[#2b2a28]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">takeout_dining</span>
            <span>Takeaway (পার্সেল)</span>
          </button>
        </div>

        {/* Section Filter Switch Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: 'All Tables' },
            { id: 'lounge', label: 'Lounge' },
            { id: 'balcony', label: 'Balcony' },
            { id: 'terrace', label: 'Terrace' },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setSelectedSection(sec.id as any)}
              className={`min-h-[36px] px-3 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
                selectedSection === sec.id
                  ? 'bg-[#E5A93C] text-[#432c00] border-[#E5A93C]'
                  : 'bg-[#211f1e] text-[#d4c4b0] border-[#363433]'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Tables Grid */}
        <div className="space-y-2">
          <span className="text-[12px] font-semibold text-[#9d8f7c] uppercase tracking-wider block">
            {language === 'bn' ? 'উপলব্ধ ডাইনিং টেবিলসমূহ' : 'Available Dining Tables'}
          </span>

          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {filteredTables.map((t) => {
              const isCurrent = currentMode === 'dinein' && currentTable === t.number;
              return (
                <button
                  key={t.number}
                  type="button"
                  onClick={() => {
                    onSelectTable(t.number, 'dinein');
                    onClose();
                  }}
                  className={`min-h-[64px] p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer active:scale-95 ${
                    isCurrent
                      ? 'bg-[#2b2a28] border-[#E5A93C] shadow-md'
                      : 'bg-[#211f1e] border-[#363433] hover:border-[#504535]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-[14px] text-[#e6e1df]">
                      Table {t.number}
                    </span>
                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-[#E5A93C]"></span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#9d8f7c] truncate">
                    {language === 'bn' ? t.sectionBn : t.section}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
