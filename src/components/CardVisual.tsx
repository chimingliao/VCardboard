import React, { useState } from 'react';
import { CARD_TYPE_META, RARITY_META } from '../data/catalog';
import { StyleCard } from '../types/card';

export type CardRevealStage = 'back' | 'header' | 'art' | 'complete';

interface CardVisualProps {
  card: StyleCard;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  owned?: boolean;
  isNew?: boolean;
  selected?: boolean;
  revealStage?: CardRevealStage;
  onClick?: () => void;
  className?: string;
}

function FallbackArtPanel({ card }: { card: StyleCard }) {
  const accent = card.accent_hex || '#E2BD75';
  return (
    <svg viewBox="0 0 240 300" className="w-full h-full object-cover" aria-hidden="true">
      <defs>
        <radialGradient id={`g_${card.card_id}`} cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
          <stop offset="100%" stopColor="#0E1018" stopOpacity="1" />
        </radialGradient>
      </defs>
      <rect width="240" height="300" fill={`url(#g_${card.card_id})`} />
      <g stroke={accent} fill="none">
        <rect x="22" y="22" width="196" height="256" rx="10" strokeOpacity="0.24" strokeWidth="0.9" />
        <polygon points="120,66 172,134 120,202 68,134" strokeOpacity="0.45" strokeWidth="1.2" />
        <circle cx="120" cy="134" r="30" strokeOpacity="0.3" strokeDasharray="3 4" />
        <circle cx="120" cy="134" r="7" fill={accent} fillOpacity="0.45" />
      </g>
      <text
        x="120"
        y="246"
        textAnchor="middle"
        fill={accent}
        fillOpacity="0.8"
        fontSize="10"
        fontFamily="JetBrains Mono, monospace"
      >
        {CARD_TYPE_META[card.card_type].en.toUpperCase()}
      </text>
    </svg>
  );
}

export const CardVisual: React.FC<CardVisualProps> = ({
  card,
  size = 'md',
  owned = true,
  isNew = false,
  selected = false,
  revealStage = 'complete',
  onClick,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const rarityInfo = RARITY_META[card.rarity];
  const isHighRarity = card.rarity === 'SR' || card.rarity === 'SSR' || card.rarity === 'UR';
  const isUR = card.rarity === 'UR';
  const hasPhoto = Boolean(card.artwork_url && !imgError);

  const aspectClass = size === 'xs' ? 'aspect-[3/3.6]' : 'aspect-[3/4]';

  if (revealStage === 'back') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`group relative w-full ${aspectClass} rounded-2xl bg-[#13151F] border border-[#E2BD75]/35 overflow-hidden text-left transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2BD75] ${className}`}
      >
        <div className="absolute inset-2.5 rounded-xl border border-[#E2BD75]/25 flex flex-col items-center justify-center p-4">
          <svg viewBox="0 0 100 100" className="w-14 h-14 text-[#E2BD75]/75 group-hover:scale-105 transition-transform duration-300" aria-hidden="true">
            <polygon points="50,12 86,50 50,88 14,50" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <polygon points="50,24 74,50 50,76 26,50" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="0.9" />
            <circle cx="50" cy="50" r="6" fill="currentColor" />
          </svg>
          <span className="mt-3 font-editorial text-sm tracking-widest text-[#F3D99F]">
            MONO ARCHIVE
          </span>
          <span className="mt-1 text-[11px] text-[#9E9BA3]">点击翻开素材</span>
        </div>
      </button>
    );
  }

  const showArt = revealStage === 'art' || revealStage === 'complete';
  const showRarity = revealStage === 'complete';

  const borderClass = selected
    ? 'border-[#E2BD75] ring-2 ring-[#E2BD75]/50'
    : card.rarity === 'UR'
      ? 'border-[#F3D99F]/80'
      : card.rarity === 'SSR'
        ? 'border-[#E59BB7]/65'
        : card.rarity === 'SR'
          ? 'border-[#E2BD75]/65'
          : card.rarity === 'R'
            ? 'border-[#8BB6F8]/50'
            : 'border-white/15';

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      style={{
        boxShadow:
          owned && showArt
            ? `0 0 24px -8px ${rarityInfo.glow}`
            : undefined,
      }}
      className={`group relative w-full ${aspectClass} rounded-2xl bg-[#13151E] border ${borderClass} overflow-hidden flex flex-col justify-between transition-transform duration-200 ${
        onClick
          ? 'cursor-pointer hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2BD75]'
          : ''
      } ${!owned ? 'opacity-50 grayscale-[0.65]' : ''} ${
        isUR && showArt ? 'foil-sheen' : ''
      } ${className}`}
    >
      {/* Artwork Surface */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showArt ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {hasPhoto ? (
          <img
            src={card.artwork_url}
            alt={card.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            style={{ objectPosition: card.artwork_focal || '50% 30%' }}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              onClick ? 'group-hover:scale-[1.04]' : ''
            }`}
          />
        ) : (
          <FallbackArtPanel card={card} />
        )}

        {/* Measured contrast scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F]/92 via-[#090A0F]/20 to-[#090A0F]/45" />

        {/* Subtle inner rim for SR/SSR/UR */}
        {isHighRarity && (
          <div className="pointer-events-none absolute inset-1.5 rounded-xl border border-white/15" />
        )}
      </div>

      {/* Top Row: Signature Italic Serif Rarity Mark (left) + NEW indicator (right) */}
      <div className="relative z-10 flex items-start justify-between px-3 pt-2.5">
        <span
          style={{ color: rarityInfo.textColor }}
          className={`font-editorial italic font-bold tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] transition-opacity duration-300 ${
            size === 'xs' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'
          } ${showRarity ? 'opacity-100' : 'opacity-0'}`}
        >
          {card.rarity}
        </span>

        {isNew && showRarity && (
          <span className="font-mono-data text-[10px] tracking-wider text-[#FFF1C7] drop-shadow">
            NEW
          </span>
        )}
      </div>

      {/* Unowned subtle marker */}
      {!owned && showArt && (
        <div className="relative z-10 self-center text-[11px] font-mono-data text-[#F1EEE8]/80 bg-[#0B0C11]/80 px-2.5 py-1 rounded-md">
          待收集素材
        </div>
      )}

      {/* Bottom Clean Metadata & Title */}
      <div className={`relative z-10 ${size === 'xs' ? 'px-2.5 pb-2.5 pt-4' : 'px-3.5 pb-3.5 pt-6'}`}>
        <div className="text-[10px] text-[#D8D4CC] truncate">
          {CARD_TYPE_META[card.card_type].label} · {card.theme_name}
        </div>
        <h4
          className={`mt-0.5 font-medium leading-snug text-[#FFFDF8] truncate ${
            size === 'xs' ? 'text-xs' : size === 'lg' ? 'text-lg font-editorial font-semibold' : 'text-sm'
          }`}
        >
          {card.name}
        </h4>
      </div>
    </div>
  );
};
