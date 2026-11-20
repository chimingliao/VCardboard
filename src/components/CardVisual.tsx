import React, { useState } from 'react';
import { CARD_TYPE_META, HERO_REGISTRY, RARITY_META } from '../data/catalog';
import { NarrativeCard } from '../types/card';

export type CardRevealStage = 'back' | 'header' | 'art' | 'complete';

interface CardVisualProps {
  card: NarrativeCard;
  size?: 'sm' | 'md' | 'lg';
  owned?: boolean;
  isNew?: boolean;
  selected?: boolean;
  revealStage?: CardRevealStage;
  onClick?: () => void;
  className?: string;
}

function EditorialSpecimenSvg({ card }: { card: NarrativeCard }) {
  const accent = card.accent_hex || '#D8B467';

  if (card.card_type === 'motion') {
    const seats = card.motion_seats ?? 1;
    return (
      <svg
        viewBox="0 0 240 300"
        className="w-full h-full object-cover"
        aria-hidden="true"
      >
        <rect width="240" height="300" fill="#131720" />
        {/* Rule of thirds framing grid */}
        <g stroke={accent} strokeOpacity="0.18" strokeWidth="0.75">
          <line x1="80" y1="20" x2="80" y2="280" />
          <line x1="160" y1="20" x2="160" y2="280" />
          <line x1="20" y1="100" x2="220" y2="100" />
          <line x1="20" y1="200" x2="220" y2="200" />
          <rect x="20" y="20" width="200" height="260" fill="none" />
        </g>
        {/* Framing markers */}
        <circle cx="120" cy="140" r="62" fill="none" stroke={accent} strokeOpacity="0.3" strokeDasharray="3 4" />
        {seats === 1 && (
          <g stroke={accent} strokeWidth="1.5" fill="none">
            <circle cx="120" cy="96" r="14" fill={accent} fillOpacity="0.14" />
            <path d="M120 112 L120 176 M96 132 L144 126 M120 176 L104 232 M120 176 L138 232" strokeLinecap="round" />
            <path d="M150 96 Q178 104 192 92" strokeOpacity="0.55" strokeDasharray="2 3" />
          </g>
        )}
        {seats === 2 && (
          <g stroke={accent} strokeWidth="1.5" fill="none">
            <circle cx="90" cy="102" r="12" fill={accent} fillOpacity="0.14" />
            <path d="M90 116 L90 176 M70 134 L108 138 M90 176 L78 228 M90 176 L102 228" strokeLinecap="round" />
            <circle cx="150" cy="102" r="12" fill={accent} fillOpacity="0.14" />
            <path d="M150 116 L150 176 M132 138 L170 134 M150 176 L138 228 M150 176 L162 228" strokeLinecap="round" />
            <path d="M104 132 Q120 120 136 132" strokeOpacity="0.7" strokeDasharray="2 2" />
          </g>
        )}
        {seats >= 3 && (
          <g stroke={accent} strokeWidth="1.35" fill="none">
            <circle cx="120" cy="94" r="11" fill={accent} fillOpacity="0.18" />
            <path d="M120 107 L120 166 M102 126 L138 126 M120 166 L108 214 M120 166 L132 214" strokeLinecap="round" />
            <circle cx="64" cy="118" r="9" fill={accent} fillOpacity="0.12" />
            <path d="M64 129 L64 176 M50 144 L78 144 M64 176 L55 214 M64 176 L73 214" strokeLinecap="round" />
            <circle cx="176" cy="118" r="9" fill={accent} fillOpacity="0.12" />
            <path d="M176 129 L176 176 M162 144 L190 144 M176 176 L167 214 M176 176 L185 214" strokeLinecap="round" />
            <polygon points="120,66 196,216 44,216" strokeOpacity="0.22" />
          </g>
        )}
        <text
          x="120"
          y="264"
          textAnchor="middle"
          fill={accent}
          fillOpacity="0.7"
          fontSize="9"
          fontFamily="JetBrains Mono, monospace"
        >
          {seats === 1 ? 'SOLO FRAME · 50MM' : seats === 2 ? 'DUO COMPOSITION · 35MM' : 'ENSEMBLE · 24MM'}
        </text>
      </svg>
    );
  }

  if (card.card_type === 'voice' || card.card_type === 'bgm') {
    return (
      <svg viewBox="0 0 240 300" className="w-full h-full object-cover" aria-hidden="true">
        <rect width="240" height="300" fill="#12161E" />
        <g stroke={accent} fill="none">
          {[32, 54, 76, 98].map((r, i) => (
            <circle
              key={r}
              cx="120"
              cy="132"
              r={r}
              strokeOpacity={0.35 - i * 0.06}
              strokeWidth="0.9"
              strokeDasharray={i % 2 === 1 ? '4 4' : undefined}
            />
          ))}
          <path
            d="M36 132 Q54 96 72 132 T108 132 T144 132 T180 132 T204 132"
            strokeWidth="1.6"
            strokeOpacity="0.85"
          />
          <path
            d="M36 132 Q54 156 72 132 T108 132 T144 132 T180 132 T204 132"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
        </g>
        <text
          x="120"
          y="256"
          textAnchor="middle"
          fill={accent}
          fillOpacity="0.65"
          fontSize="9"
          fontFamily="JetBrains Mono, monospace"
        >
          {card.card_type === 'voice' ? 'VOCAL TIMBRE PROFILE' : 'AMBIENT SOUNDFIELD'}
        </text>
      </svg>
    );
  }

  if (card.card_type === 'story') {
    return (
      <svg viewBox="0 0 240 300" className="w-full h-full object-cover" aria-hidden="true">
        <rect width="240" height="300" fill="#141720" />
        <rect x="24" y="24" width="192" height="252" fill="none" stroke={accent} strokeOpacity="0.22" strokeWidth="0.9" />
        <line x1="42" y1="62" x2="198" y2="62" stroke={accent} strokeOpacity="0.35" strokeWidth="0.8" />
        <line x1="42" y1="88" x2="176" y2="88" stroke="#ECE9E1" strokeOpacity="0.16" strokeWidth="1" />
        <line x1="42" y1="106" x2="192" y2="106" stroke="#ECE9E1" strokeOpacity="0.16" strokeWidth="1" />
        <line x1="42" y1="124" x2="162" y2="124" stroke="#ECE9E1" strokeOpacity="0.16" strokeWidth="1" />
        <circle cx="120" cy="176" r="24" fill="none" stroke={accent} strokeOpacity="0.5" strokeWidth="1" />
        <line x1="66" y1="176" x2="174" y2="176" stroke={accent} strokeOpacity="0.35" strokeWidth="0.9" />
        <circle cx="120" cy="176" r="4" fill={accent} />
        <text
          x="120"
          y="236"
          textAnchor="middle"
          fill={accent}
          fillOpacity="0.72"
          fontSize="9"
          fontFamily="JetBrains Mono, monospace"
        >
          {card.story_kind === 'node' ? `CHRONICLE · ${card.node_phase ?? 'NODE'}` : 'RECURRING FRAGMENT'}
        </text>
      </svg>
    );
  }

  // Outfit / Item / Relation without photo fallback
  return (
    <svg viewBox="0 0 240 300" className="w-full h-full object-cover" aria-hidden="true">
      <rect width="240" height="300" fill="#141822" />
      <g stroke={accent} fill="none">
        <rect x="26" y="26" width="188" height="248" strokeOpacity="0.2" strokeWidth="0.8" />
        <polygon points="120,64 176,138 120,212 64,138" strokeOpacity="0.45" strokeWidth="1.2" />
        <polygon points="120,84 156,138 120,192 84,138" strokeOpacity="0.28" strokeWidth="0.9" />
        <circle cx="120" cy="138" r="14" fill={accent} fillOpacity="0.18" strokeOpacity="0.7" />
        {card.card_type === 'relation' && (
          <>
            <circle cx="86" cy="138" r="26" strokeOpacity="0.5" />
            <circle cx="154" cy="138" r="26" strokeOpacity="0.5" />
          </>
        )}
      </g>
      <text
        x="120"
        y="252"
        textAnchor="middle"
        fill={accent}
        fillOpacity="0.7"
        fontSize="9"
        fontFamily="JetBrains Mono, monospace"
      >
        {CARD_TYPE_META[card.card_type].short}
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

  const isChase = RARITY_META[card.rarity].group === 'chase';
  const isUR = card.rarity === 'UR';
  const isSAR = card.rarity === 'SAR';
  const isSR = card.rarity === 'SR';
  const isAR = card.rarity === 'AR';
  const isBondRarity = card.rarity === 'CHR' || card.rarity === 'CSR';

  const sizeClass =
    size === 'sm'
      ? 'w-full aspect-[3/4.2]'
      : size === 'lg'
        ? 'w-full max-w-[320px] aspect-[3/4.2]'
        : 'w-full aspect-[3/4.2]';

  // Face-down archival card back during pack opening
  if (revealStage === 'back') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`group relative ${sizeClass} rounded-xl bg-[#141720] border border-[#D8B467]/30 overflow-hidden text-left transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${className}`}
      >
        <div className="absolute inset-2.5 rounded-lg border border-[#D8B467]/25 flex flex-col items-center justify-center p-4">
          <svg viewBox="0 0 120 120" className="w-16 h-16 text-[#D8B467]/60 group-hover:scale-105 transition-transform duration-300" aria-hidden="true">
            <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 4" />
            <polygon points="60,18 96,60 60,102 24,60" fill="none" stroke="currentColor" strokeWidth="1.1" />
            <circle cx="60" cy="60" r="8" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
          </svg>
          <span className="mt-4 font-editorial text-sm tracking-widest text-[#D8B467]/85">织界卡匣</span>
          <span className="mt-1 text-[11px] text-[#9A9892]">点击翻开</span>
        </div>
      </button>
    );
  }

  const borderStyle = selected
    ? 'border-[#D8B467] ring-1 ring-[#D8B467]/60'
    : isUR
      ? 'border-[#E9CF90]/75'
      : isSAR || isBondRarity
        ? 'border-[#D8B467]/55'
        : isSR || isAR
          ? 'border-[#ECE9E1]/30'
          : 'border-white/10';

  const hasPhoto = Boolean(card.artwork_url && !imgError);
  const showArt = revealStage === 'art' || revealStage === 'complete';
  const showRarity = revealStage === 'complete';

  const boundNames = card.bind_hero
    .map((id) => HERO_REGISTRY[id]?.name ?? id)
    .join(' × ');

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
      className={`group relative ${sizeClass} rounded-xl bg-[#151821] border ${borderStyle} overflow-hidden flex flex-col justify-between transition-transform duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467]' : ''
      } ${!owned ? 'opacity-55 grayscale-[0.65]' : ''} ${isUR && showArt ? 'ur-foil-sheen' : ''} ${className}`}
    >
      {/* Artwork layer: full-bleed for SR / AR / SAR / CHR / CSR / UR, framed for C / U / R / RR */}
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
              onClick ? 'group-hover:scale-[1.03]' : ''
            } ${isSAR ? 'scale-[1.02]' : ''}`}
          />
        ) : (
          <EditorialSpecimenSvg card={card} />
        )}

        {/* Measured contrast scrim for legibility */}
        <div
          className={`absolute inset-0 ${
            isSR || isAR
              ? 'bg-gradient-to-t from-[#0B0D12]/92 via-[#0B0D12]/25 to-[#0B0D12]/45'
              : 'bg-gradient-to-t from-[#0D0F14]/95 via-[#0D0F14]/35 to-[#0D0F14]/65'
          }`}
        />

        {/* UR filigree inner frame */}
        {isUR && (
          <div className="pointer-events-none absolute inset-2 rounded-lg border border-[#E9CF90]/55" />
        )}

        {/* SAR cinematic letterbox framing bars */}
        {isSAR && (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-[#08090C]/90" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-[#08090C]/90" />
          </>
        )}
      </div>

      {/* Top Metadata Header — revealed FIRST in psychological cadence */}
      <div className="relative z-10 flex items-center justify-between gap-2 px-3.5 pt-3.5">
        <div className="flex items-center gap-1.5 text-[11px] text-[#ECE9E1]/85 min-w-0">
          <span className="truncate font-medium">{CARD_TYPE_META[card.card_type].short}</span>
          <span aria-hidden="true" className="text-[#9A9892]">·</span>
          <span className="truncate text-[#C6C2B8]">{card.series}</span>
        </div>

        {/* Rarity marker floats in LAST after artwork unfolds */}
        <div
          className={`shrink-0 flex items-center gap-1.5 transition-opacity duration-300 ${
            showRarity ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isNew && (
            <span className="text-[10px] font-mono-data tracking-wider text-[#E9CF90]">NEW</span>
          )}
          <span
            className={`font-mono-data text-xs font-medium tracking-wider ${
              isChase ? 'text-[#E9CF90]' : 'text-[#ECE9E1]/85'
            }`}
          >
            {card.rarity}
          </span>
        </div>
      </div>

      {/* Center subtle framing indicator for unowned cards */}
      {!owned && showArt && (
        <div className="relative z-10 self-center text-[11px] font-mono-data tracking-widest text-[#ECE9E1]/75 bg-[#0D0F14]/80 px-2.5 py-1 rounded">
          待发现模块
        </div>
      )}

      {/* Bottom Editorial Title & Quiet Metadata */}
      <div className="relative z-10 px-3.5 pb-3.5 pt-8">
        {isBondRarity && showRarity && (
          <div className="text-[10px] font-mono-data tracking-wider text-[#E9CF90]/90 mb-1">
            {card.rarity === 'CSR' ? '群像联动规格' : '双人羁绊插画'}
          </div>
        )}
        <h4
          className={`font-editorial font-semibold leading-snug text-[#FAF8F2] ${
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base'
          } line-clamp-2`}
        >
          {card.name}
        </h4>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#C6C2B8] truncate">
          {boundNames ? (
            <span className="truncate">{boundNames}</span>
          ) : (
            <span className="truncate">全局素材</span>
          )}
          <span aria-hidden="true" className="text-[#787670]">·</span>
          <span className="truncate text-[#9A9892]">
            {card.world_tags[0] || card.series}
          </span>
        </div>
        {size === 'lg' && (
          <p className="mt-2 text-xs leading-relaxed text-[#D8D4CA] line-clamp-3">
            {card.content.summary}
          </p>
        )}
      </div>
    </div>
  );
};
