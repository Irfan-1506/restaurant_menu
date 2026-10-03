import React, { useState } from 'react';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  posterUrl: string;
  language: 'bn' | 'en';
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  title,
  posterUrl,
  language,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-[#141312] border border-[#504535]/60 overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-3.5 bg-[#1d1b1a] border-b border-[#363433] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="w-2 h-2 rounded-full bg-[#E5A93C] animate-ping"></span>
            <span className="text-[14px] font-bold text-[#e6e1df] truncate">
              {title}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Video Player"
            className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-[#d4c4b0] hover:text-[#F3C669] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Video Screen Area */}
        <div className="relative w-full aspect-[16/9] bg-black overflow-hidden flex items-center justify-center">
          <img
            src={posterUrl}
            alt={title}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isPlaying ? 'opacity-90 scale-105 transition-transform duration-1000' : 'opacity-70'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

          {/* Central Play/Pause Watermark */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            className="min-w-[56px] min-h-[56px] w-14 h-14 rounded-full bg-[#E5A93C] text-[#432c00] flex items-center justify-center shadow-2xl active:scale-95 transition-transform cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Steam / Dum effect badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#F3C669] text-[11px] font-bold border border-[#E5A93C]/40">
              4K Ultra-HD Dum Master Prep
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="min-w-[44px] min-h-[44px] absolute bottom-2 right-2 rounded-full bg-black/70 backdrop-blur-md text-[#e6e1df] hover:text-[#F3C669] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>
        </div>

        {/* Progress scrub bar */}
        <div className="w-full bg-[#211f1e] px-4 py-3 flex flex-col gap-2">
          <div className="w-full h-1.5 rounded-full bg-[#363433] overflow-hidden cursor-pointer">
            <div className="h-full bg-gradient-to-r from-[#F3C669] to-[#E5A93C] w-2/3 rounded-full"></div>
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#9d8f7c]">
            <span>0:32</span>
            <span>0:45</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#1d1b1a] text-center border-t border-[#363433]">
          <p className="text-[12px] text-[#d4c4b0]">
            {language === 'bn'
              ? 'সুলতানস কিচেনের প্রধান বাবুর্চির ঐতিহ্যবাহী কয়লা দমের সরাসরি দৃশ্য'
              : 'Authentic live charcoal dum cooking captured at Sultan’s Kitchen flagship.'}
          </p>
        </div>
      </div>
    </div>
  );
};
