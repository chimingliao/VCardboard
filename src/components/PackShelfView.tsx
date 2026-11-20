import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Box,
  Camera,
  Eye,
  Film,
  Image as ImageIcon,
  Info,
  Layers,
  PackageOpen,
  RotateCcw,
  Scissors,
  Share2,
  Shirt,
  Sparkles,
  User,
  Volume2,
  VolumeX,
  Wand2,
  X,
} from 'lucide-react';
import {
  CARD_TYPE_META,
  CARD_TYPE_ORDER,
  getPackPool,
  MONO_ASSETS,
  openThemePack,
  PackOpenSpec,
  RARITY_META,
  THEME_PACKS,
} from '../data/catalog';
import { CardType, StyleCard, ThemePackDef } from '../types/card';
import { tactileAudio } from '../utils/sound';
import { CardRevealStage, CardVisual } from './CardVisual';

interface PackShelfViewProps {
  catalog: StyleCard[];
  ownedIds: Set<string>;
  onCardsAcquired: (cards: StyleCard[]) => void;
  onInspectCard: (card: StyleCard) => void;
  onGoToCombine: (presetCards?: StyleCard[]) => void;
  onFilterLibraryByType: (type: CardType) => void;
  onGoToCreations: () => void;
}

type OpeningPhase = 'sealed' | 'tearing' | 'flipping';

interface DrawnSlot {
  uid: string;
  card: StyleCard;
  isNew: boolean;
  stage: CardRevealStage;
}

const TYPE_ICONS: Record<CardType, React.ReactNode> = {
  character: <User className="w-4 h-4" />,
  costume: <Shirt className="w-4 h-4" />,
  hairstyle: <Scissors className="w-4 h-4" />,
  makeup: <Wand2 className="w-4 h-4" />,
  pose: <Layers className="w-4 h-4" />,
  scene: <ImageIcon className="w-4 h-4" />,
  prop: <Camera className="w-4 h-4" />,
  effect: <Sparkles className="w-4 h-4" />,
};

export const PackShelfView: React.FC<PackShelfViewProps> = ({
  catalog,
  ownedIds,
  onCardsAcquired,
  onInspectCard,
  onGoToCombine,
  onFilterLibraryByType,
  onGoToCreations,
}) => {
  const [disclosurePack, setDisclosurePack] = useState<ThemePackDef | null>(null);
  const [activePack, setActivePack] = useState<ThemePackDef | null>(null);
  const [activeSpec, setActiveSpec] = useState<PackOpenSpec>('single');
  const [openingPhase, setOpeningPhase] = useState<OpeningPhase>('sealed');
  const [drawnSlots, setDrawnSlots] = useState<DrawnSlot[]>([]);
  const [muted, setMuted] = useState(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const cardMap = useMemo(() => {
    const map = new Map<string, StyleCard>();
    catalog.forEach((c) => map.set(c.card_id, c));
    return map;
  }, [catalog]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    tactileAudio.muted = next;
  };

  const startPackSession = (pack: ThemePackDef, spec: PackOpenSpec) => {
    clearTimers();
    const drawn = openThemePack(pack.pack_id, spec, catalog, ownedIds);
    const seen = new Set(ownedIds);
    const slots: DrawnSlot[] = drawn.map((card, idx) => {
      const isNew = !seen.has(card.card_id);
      seen.add(card.card_id);
      return {
        uid: `${card.card_id}_${idx}_${Date.now()}`,
        card,
        isNew,
        stage: 'back',
      };
    });

    setActivePack(pack);
    setActiveSpec(spec);
    setDrawnSlots(slots);
    setOpeningPhase('sealed');
  };

  const handleTearPack = () => {
    if (openingPhase !== 'sealed') return;
    tactileAudio.playFoilTear();
    setOpeningPhase('tearing');
    onCardsAcquired(drawnSlots.map((s) => s.card));

    const t = window.setTimeout(() => {
      setOpeningPhase('flipping');
    }, 560);
    timersRef.current.push(t);
  };

  const flipSingleSlot = (index: number) => {
    const slot = drawnSlots[index];
    if (!slot) return;
    if (slot.stage === 'complete') {
      onInspectCard(slot.card);
      return;
    }
    if (slot.stage !== 'back') return;

    tactileAudio.playCardFlip();
    setDrawnSlots((prev) =>
      prev.map((item, i) => (i === index ? { ...item, stage: 'header' } : item))
    );

    const tArt = window.setTimeout(() => {
      setDrawnSlots((prev) =>
        prev.map((item, i) => (i === index ? { ...item, stage: 'art' } : item))
      );
    }, 200);

    const tComplete = window.setTimeout(() => {
      if (slot.card.rarity === 'SR' || slot.card.rarity === 'SSR' || slot.card.rarity === 'UR') {
        tactileAudio.playChaseReveal();
      }
      setDrawnSlots((prev) =>
        prev.map((item, i) => (i === index ? { ...item, stage: 'complete' } : item))
      );
    }, 460);

    timersRef.current.push(tArt, tComplete);
  };

  const flipNextUnopened = () => {
    const idx = drawnSlots.findIndex((s) => s.stage === 'back');
    if (idx !== -1) flipSingleSlot(idx);
  };

  const revealAll = () => {
    drawnSlots.forEach((slot, idx) => {
      if (slot.stage === 'back') {
        const t = window.setTimeout(() => flipSingleSlot(idx), idx * 105);
        timersRef.current.push(t);
      }
    });
  };

  const closeStage = () => {
    clearTimers();
    setActivePack(null);
    setDrawnSlots([]);
  };

  const allRevealed =
    drawnSlots.length > 0 && drawnSlots.every((s) => s.stage === 'complete');
  const newCount = drawnSlots.filter((s) => s.isNew).length;

  const heroFoilPacks = [
    THEME_PACKS[0],
    THEME_PACKS[1],
    THEME_PACKS[2],
    THEME_PACKS[3],
    THEME_PACKS[5],
  ];

  const sampleChar = cardMap.get('char_linxi_sr');
  const sampleCostume = cardMap.get('costume_school_blazer_r');
  const sampleHair = cardMap.get('hair_twin_braids_r');

  return (
    <div className="space-y-12">
      {/* 1. Cinematic Showcase Hero Banner (Directly echoing the MONO Style Archive Infographic) */}
      <section className="relative rounded-3xl overflow-hidden border border-white/12 bg-[#11131C]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[380px]">
          {/* Left: Warm Twilight Portrait Visual */}
          <div className="lg:col-span-4 relative min-h-[260px] lg:min-h-full overflow-hidden">
            <img
              src={MONO_ASSETS.charLinxi}
              alt="林溪暖光暮色角色主视觉"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top lg:h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#11131C]/35 to-[#11131C]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#11131C] via-transparent to-transparent lg:hidden" />
          </div>

          {/* Center: Editorial Title & Value Proposition */}
          <div className="lg:col-span-4 relative z-10 px-6 py-8 lg:py-10 flex flex-col justify-center">
            <div className="text-[11px] font-mono-data tracking-[0.22em] text-[#E2BD75]">
              COLLECT / COMBINE / CREATE
            </div>
            <h1 className="mt-2 font-editorial italic text-4xl sm:text-[42px] font-semibold leading-[1.08] tracking-tight text-[#FFFDF8]">
              CARD COLLECTION
            </h1>
            <div className="mt-2 font-editorial text-2xl sm:text-3xl font-semibold text-[#F5EFE2]">
              角色创作的卡牌素材库
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#C4C0B8]">
              多元卡牌 × 主题卡包 × 自由组合，打造属于你的虚拟角色。抽卡即收集视觉素材，自由搭配生成写真、插画与短影音内容。
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => startPackSession(THEME_PACKS[1], 'single')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E2BD75] text-[#0D0E14] text-sm font-semibold hover:bg-[#F3D99F] transition-colors whitespace-nowrap"
              >
                <PackageOpen className="w-4 h-4" />
                立即拆封主题卡包
              </button>
              <button
                type="button"
                onClick={() => onGoToCombine()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#1A1D29] border border-white/12 text-sm text-[#F1EEE8] hover:border-[#E2BD75]/60 transition-colors whitespace-nowrap"
              >
                自由组合工坊
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: 5 Glowing Metallic Foil Booster Packs Lineup */}
          <div className="lg:col-span-4 relative px-5 pb-8 lg:py-8 flex items-center justify-center">
            <div className="grid grid-cols-5 gap-2 w-full max-w-[420px]">
              {heroFoilPacks.map((pack, idx) => (
                <button
                  key={pack.pack_id}
                  type="button"
                  onClick={() => startPackSession(pack, 'single')}
                  title={`点击拆封：${pack.title}`}
                  style={{
                    borderColor: `${pack.foil_edge}80`,
                    boxShadow: `0 12px 28px -10px ${pack.foil_edge}55`,
                    transform: `translateY(${idx % 2 === 1 ? '-6px' : '4px'})`,
                  }}
                  className="group relative aspect-[2/4.4] rounded-xl overflow-hidden border bg-[#141722] flex flex-col justify-between transition-transform duration-200 hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2BD75]"
                >
                  <img
                    src={pack.cover_art}
                    alt={pack.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-75 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, ${pack.foil_from}CC 0%, rgba(11,12,17,0.35) 45%, ${pack.foil_to}F2 100%)`,
                    }}
                  />
                  <div className="relative z-10 pt-2.5 px-1 text-center">
                    <div className="text-[8px] font-mono-data tracking-widest text-white/80">
                      MONO
                    </div>
                  </div>
                  <div className="relative z-10 pb-2.5 px-1 text-center">
                    <div
                      className="font-mono-data text-[9px] font-semibold tracking-wider"
                      style={{ color: pack.foil_edge }}
                    >
                      {pack.code}
                    </div>
                    <div className="text-[9px] text-[#FFFDF8] truncate mt-0.5">
                      {pack.title}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. 8 大卡牌类型总览 (Card Types) */}
      <section className="rounded-3xl bg-[#11131C] border border-white/10 p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/8 pb-4">
          <div className="flex items-baseline gap-3">
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#FFFDF8]">
              卡牌类型
            </h2>
            <span className="font-editorial italic text-lg text-[#E2BD75]">Card Types</span>
          </div>
          <p className="text-xs sm:text-sm text-[#B4B0A8]">
            从角色到场景，完整的 8 类创作素材，让每一次组合都有新的故事。
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4">
          {CARD_TYPE_ORDER.map((type) => {
            const meta = CARD_TYPE_META[type];
            const sample = cardMap.get(meta.sampleCardId);
            const totalOfType = catalog.filter((c) => c.card_type === type).length;
            const ownedOfType = catalog.filter(
              (c) => c.card_type === type && ownedIds.has(c.card_id)
            ).length;

            return (
              <div key={type} className="flex flex-col items-center text-center group">
                {sample && (
                  <CardVisual
                    card={sample}
                    size="xs"
                    owned={ownedIds.has(sample.card_id)}
                    onClick={() => onFilterLibraryByType(type)}
                  />
                )}
                <button
                  type="button"
                  onClick={() => onFilterLibraryByType(type)}
                  className="mt-3 flex flex-col items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2BD75] rounded-lg px-1 py-0.5"
                >
                  <span className="text-[#E2BD75] group-hover:scale-110 transition-transform">
                    {TYPE_ICONS[type]}
                  </span>
                  <span className="text-sm font-semibold text-[#FFFDF8] group-hover:text-[#F3D99F] transition-colors">
                    {meta.label}
                  </span>
                  <span className="text-[11px] font-mono-data text-[#9E9BA3]">{meta.en}</span>
                  <span className="text-[11px] leading-snug text-[#8D8A92] line-clamp-2 mt-0.5">
                    {meta.desc}
                  </span>
                  <span className="text-[10px] font-mono-data text-[#E2BD75]/85 mt-1">
                    已收 {ownedOfType}/{totalOfType}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Theme Card Packs + Interactive Combine & Create Spotlight */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* Left 7-col: 主题卡包 Card Packs */}
        <div className="xl:col-span-7 rounded-3xl bg-[#11131C] border border-white/10 p-6 md:p-7 flex flex-col justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/8 pb-4">
            <div className="flex items-baseline gap-3">
              <h2 className="font-editorial text-2xl font-semibold text-[#FFFDF8]">主题卡包</h2>
              <span className="font-editorial italic text-base text-[#E2BD75]">Card Packs</span>
            </div>
            <span className="text-xs text-[#9E9BA3]">
              持续推出多元主题卡包，扩充你的创作素材库 · 已收 {ownedIds.size}/{catalog.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {THEME_PACKS.map((pack) => {
              const themedCards = catalog.filter((c) => c.theme_id === pack.pack_id);
              const ownedThemed = themedCards.filter((c) => ownedIds.has(c.card_id)).length;
              const pct = Math.round((ownedThemed / Math.max(1, themedCards.length)) * 100);

              return (
                <div
                  key={pack.pack_id}
                  className="rounded-2xl bg-[#161924] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#E2BD75]/50 transition-colors"
                >
                  <div>
                    <div className="relative h-28 overflow-hidden bg-[#0D0F16]">
                      <img
                        src={pack.cover_art}
                        alt={pack.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161924] via-[#161924]/30 to-black/25" />
                      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono-data">
                        <span style={{ color: pack.foil_edge }}>{pack.code}</span>
                        <span className="text-[#FFFDF8]/90">
                          {ownedThemed}/{themedCards.length}
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-3 right-3">
                        <div className="text-sm font-semibold text-[#FFFDF8]">{pack.title}</div>
                        <div className="text-[11px] text-[#B4B0A8]">{pack.en_title}</div>
                      </div>
                    </div>

                    <div className="px-3.5 pt-2.5 pb-3 space-y-2">
                      <p className="text-[11px] text-[#9E9BA3] leading-relaxed line-clamp-2">
                        {pack.tagline}
                      </p>
                      <div className="h-1 w-full rounded-full bg-white/8 overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{ width: `${pct}%`, backgroundColor: pack.foil_edge }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-3.5 pb-3.5 space-y-1.5">
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => startPackSession(pack, 'single')}
                        className="py-1.5 px-2 rounded-lg bg-[#E2BD75] text-[#0D0E14] text-[11px] font-semibold hover:bg-[#F3D99F] transition-colors whitespace-nowrap"
                      >
                        单包 (5张)
                      </button>
                      <button
                        type="button"
                        onClick={() => startPackSession(pack, 'multi')}
                        className="py-1.5 px-2 rounded-lg bg-[#202535] border border-white/10 text-[11px] text-[#F1EEE8] hover:border-[#E2BD75]/50 transition-colors whitespace-nowrap"
                      >
                        十连拆封
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDisclosurePack(pack)}
                      className="w-full py-1 text-[11px] text-[#9E9BA3] hover:text-[#E2BD75] transition-colors"
                    >
                      查看池内素材与概率
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5-col: 自由组合 · 生成新角色 (Combine & Create visual formula) */}
        <div className="xl:col-span-5 rounded-3xl bg-[#11131C] border border-[#E2BD75]/25 p-6 md:p-7 flex flex-col justify-between gap-6">
          <div className="border-b border-white/8 pb-4">
            <div className="flex items-baseline gap-2.5">
              <h2 className="font-editorial text-2xl font-semibold text-[#FFFDF8]">
                自由组合 · 生成新角色
              </h2>
              <span className="font-editorial italic text-base text-[#E2BD75]">
                Combine &amp; Create
              </span>
            </div>
            <p className="mt-1.5 text-xs text-[#9E9BA3] leading-relaxed">
              任选角色卡、服装卡、发型卡并叠加妆容、动作、场景与风格特效，实时合成全新视觉形象并导出影像与社媒脚本。
            </p>
          </div>

          {/* Iconic Equation Visual: Character + Costume + Hairstyle -> Combined Portrait */}
          <div className="grid grid-cols-11 items-center gap-1.5 sm:gap-2">
            <div className="col-span-2">
              {sampleChar && (
                <CardVisual
                  card={sampleChar}
                  size="xs"
                  onClick={() => onInspectCard(sampleChar)}
                />
              )}
            </div>
            <div className="col-span-1 text-center font-editorial text-xl text-[#E2BD75]">+</div>
            <div className="col-span-2">
              {sampleCostume && (
                <CardVisual
                  card={sampleCostume}
                  size="xs"
                  onClick={() => onInspectCard(sampleCostume)}
                />
              )}
            </div>
            <div className="col-span-1 text-center font-editorial text-xl text-[#E2BD75]">+</div>
            <div className="col-span-2">
              {sampleHair && (
                <CardVisual
                  card={sampleHair}
                  size="xs"
                  onClick={() => onInspectCard(sampleHair)}
                />
              )}
            </div>
            <div className="col-span-1 flex justify-center text-[#E2BD75]">
              <ArrowRight className="w-5 h-5" />
            </div>
            <div className="col-span-2">
              <button
                type="button"
                onClick={() => onGoToCombine()}
                className="group relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#E2BD75] shadow-[0_0_26px_-6px_rgba(226,189,117,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2BD75]"
              >
                <img
                  src={MONO_ASSETS.resultSchoolLinxi}
                  alt="组合生成的校园林溪新角色影像"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 inset-x-1 text-center text-[10px] font-medium text-[#FFF1C7]">
                  新角色影像
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#171A26] border border-white/8 text-xs text-[#C6C2BA] leading-relaxed">
              示例配方：林溪（SR） + 樱粉学院西装（R） + 红丝带双麻花编发（R） + 樱花富士山湖畔 → 一键输出写真 Prompt、短影音分镜与小红书/IG 文案。
            </div>

            <button
              type="button"
              onClick={() => onGoToCombine()}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#E2BD75] text-[#0D0E14] text-sm font-semibold hover:bg-[#F3D99F] transition-colors whitespace-nowrap"
            >
              进入自由组合工坊开始创作
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. 生态应用 (Ecosystem Use) 5-Step Interactive Pipeline */}
      <section className="rounded-3xl bg-[#11131C] border border-white/10 p-6 md:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="shrink-0">
            <div className="font-editorial text-xl font-semibold text-[#FFFDF8]">生态应用</div>
            <div className="font-editorial italic text-sm text-[#E2BD75]">Ecosystem Use</div>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                icon: <Box className="w-4 h-4" />,
                title: '抽卡收藏',
                sub: '获得创作素材',
                action: () => startPackSession(THEME_PACKS[0], 'single'),
              },
              {
                icon: <Layers className="w-4 h-4" />,
                title: '自由组合',
                sub: '搭配角色与造型',
                action: () => onGoToCombine(),
              },
              {
                icon: <Camera className="w-4 h-4" />,
                title: '生成影像',
                sub: '写真 / 插画 / 动画',
                action: () => onGoToCombine(),
              },
              {
                icon: <Film className="w-4 h-4" />,
                title: '制作内容',
                sub: '短影音 / 故事脚本',
                action: () => onGoToCombine(),
              },
              {
                icon: <Share2 className="w-4 h-4" />,
                title: '发布经营',
                sub: '各大社交平台',
                action: () => onGoToCreations(),
              },
            ].map((step, idx) => (
              <button
                key={step.title}
                type="button"
                onClick={step.action}
                className="group flex items-center gap-3 p-3.5 rounded-xl bg-[#171A26] border border-white/8 hover:border-[#E2BD75]/50 text-left transition-colors"
              >
                <span className="w-9 h-9 rounded-lg bg-[#0E1018] border border-white/10 flex items-center justify-center text-[#E2BD75] shrink-0 group-hover:border-[#E2BD75]/50">
                  {step.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#FFFDF8] truncate">
                    0{idx + 1}. {step.title}
                  </div>
                  <div className="text-[11px] text-[#9E9BA3] truncate">{step.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Probability & Pool Disclosure Modal */}
      {disclosurePack && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 backdrop-blur-sm p-4"
          onClick={() => setDisclosurePack(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl bg-[#12141D] border border-white/12 p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/8">
              <div>
                <div className="text-xs text-[#E2BD75]">
                  主题卡包素材池与稀有度公示 · 所有卡牌均为永久创作素材
                </div>
                <h3 className="mt-1 font-editorial text-2xl font-semibold text-[#FFFDF8]">
                  {disclosurePack.title}（{disclosurePack.en_title}）
                </h3>
                <p className="mt-1 text-xs text-[#9E9BA3]">{disclosurePack.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setDisclosurePack(null)}
                aria-label="关闭公示"
                className="w-10 h-10 rounded-lg flex items-center justify-center text-[#9E9BA3] hover:text-[#F1EEE8] hover:bg-white/6"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
              {(['N', 'R', 'SR', 'SSR', 'UR'] as const).map((r) => (
                <div key={r} className="p-3 rounded-xl bg-[#0B0C11] border border-white/8">
                  <div className="flex items-center justify-between">
                    <span
                      className="font-editorial italic text-base font-bold"
                      style={{ color: RARITY_META[r].textColor }}
                    >
                      {r}
                    </span>
                    <span className="font-mono-data text-[#C6C2BA]">{RARITY_META[r].rate}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-[#9E9BA3]">{RARITY_META[r].cn}</div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-semibold text-[#FFFDF8]">本主题重点收录素材</span>
                <button
                  type="button"
                  onClick={() => {
                    const p = disclosurePack;
                    setDisclosurePack(null);
                    startPackSession(p, 'single');
                  }}
                  className="text-[#E2BD75] hover:text-[#F3D99F] inline-flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  立即拆封此主题包 →
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {getPackPool(disclosurePack.pack_id, catalog).map((c) => (
                  <CardVisual
                    key={c.card_id}
                    card={c}
                    size="xs"
                    owned={ownedIds.has(c.card_id)}
                    onClick={() => {
                      setDisclosurePack(null);
                      onInspectCard(c);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Tactile Foil Booster Pack Opening Stage */}
      {activePack && (
        <div className="fixed inset-0 z-50 bg-[#090A0F]/96 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-editorial text-lg font-semibold text-[#FFFDF8] truncate">
                {activePack.title} · {activePack.en_title}
              </span>
              <span className="text-xs text-[#9E9BA3] whitespace-nowrap">
                · {activeSpec === 'single' ? '单包 5 张' : activeSpec === 'multi' ? '十连 10 张' : '整盒 18 张'}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? '开启拆包音效' : '静音拆包音效'}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#9E9BA3] hover:text-[#FFFDF8] hover:bg-white/6"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={closeStage}
                className="px-3.5 py-2 rounded-lg text-xs text-[#C6C2BA] hover:text-[#FFFDF8] bg-white/6 hover:bg-white/12 transition-colors whitespace-nowrap"
              >
                返回主题卡包
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center justify-center">
            {openingPhase !== 'flipping' ? (
              <div className="flex flex-col items-center max-w-md w-full">
                <div className="text-xs text-[#B4B0A8] mb-6 text-center">
                  {openingPhase === 'sealed'
                    ? '点击卡包顶部的银箔撕口，拆封获取本主题创作素材'
                    : '正在缓缓展开素材卡……'}
                </div>

                <button
                  type="button"
                  onClick={handleTearPack}
                  style={{
                    borderColor: `${activePack.foil_edge}99`,
                    boxShadow: `0 20px 60px -15px ${activePack.foil_edge}55`,
                  }}
                  className="group relative w-[268px] sm:w-[294px] aspect-[3/4.6] rounded-2xl overflow-hidden border bg-[#141722] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2BD75] transition-transform duration-300 hover:-translate-y-1"
                >
                  {/* Metallic Tear Strip */}
                  <div
                    className={`relative z-20 h-14 px-4 flex items-center justify-between bg-[#1B1F2E] border-b border-dashed border-[#E2BD75]/75 transition-all duration-500 ${
                      openingPhase === 'tearing'
                        ? '-translate-y-12 translate-x-10 -rotate-6 opacity-0'
                        : 'group-hover:bg-[#242A3E]'
                    }`}
                  >
                    <span className="font-mono-data text-[10px] tracking-widest text-[#F3D99F]">
                      MONO STYLE ARCHIVE
                    </span>
                    <span className="text-[11px] text-[#FFFDF8]">撕开封口 ▸</span>
                  </div>

                  <div
                    className={`relative h-[calc(100%-3.5rem)] transition-all duration-500 ${
                      openingPhase === 'tearing' ? 'scale-105 opacity-0' : 'opacity-100'
                    }`}
                  >
                    <img
                      src={activePack.cover_art}
                      alt={activePack.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(180deg, ${activePack.foil_from}88 0%, rgba(11,12,17,0.35) 45%, ${activePack.foil_to}F5 100%)`,
                      }}
                    />
                    <div className="absolute inset-3 border border-white/20 rounded-xl pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div
                        className="font-mono-data text-xs tracking-widest"
                        style={{ color: activePack.foil_edge }}
                      >
                        {activePack.code} PACK
                      </div>
                      <div className="mt-1 font-editorial text-2xl font-semibold text-[#FFFDF8]">
                        {activePack.title}
                      </div>
                      <div className="mt-1.5 text-xs text-[#C6C2BA]">
                        {activePack.featured_tags.join(' · ')}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              <div className="w-full max-w-6xl space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-[#E2BD75]">
                      {allRevealed
                        ? `本轮拆封完成 · 新解锁 +${newCount} 枚创作素材`
                        : '点击任意卡背逐张揭晓，或点击「全部展开」'}
                    </div>
                    <h3 className="mt-1 font-editorial text-2xl font-semibold text-[#FFFDF8]">
                      {allRevealed ? '素材已永久收入素材库' : '翻牌时刻'}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {!allRevealed ? (
                      <>
                        <button
                          type="button"
                          onClick={flipNextUnopened}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E2BD75] text-[#0D0E14] text-xs font-semibold hover:bg-[#F3D99F] transition-colors whitespace-nowrap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          翻开下一张
                        </button>
                        <button
                          type="button"
                          onClick={revealAll}
                          className="px-4 py-2 rounded-lg bg-[#1A1D29] border border-white/12 text-xs text-[#F1EEE8] hover:border-white/25 whitespace-nowrap"
                        >
                          全部展开
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            const cards = drawnSlots.map((s) => s.card);
                            closeStage();
                            onGoToCombine(cards);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E2BD75] text-[#0D0E14] text-xs font-semibold hover:bg-[#F3D99F] transition-colors whitespace-nowrap"
                        >
                          带入自由组合生成新角色
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => startPackSession(activePack, activeSpec)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1A1D29] border border-white/12 text-xs text-[#F1EEE8] hover:border-[#E2BD75]/50 whitespace-nowrap"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          再拆一包
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div
                  className={`grid gap-4 ${
                    drawnSlots.length <= 5
                      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
                      : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-6'
                  }`}
                >
                  {drawnSlots.map((slot, idx) => (
                    <CardVisual
                      key={slot.uid}
                      card={slot.card}
                      size="sm"
                      owned={true}
                      isNew={slot.isNew}
                      revealStage={slot.stage}
                      onClick={() => flipSingleSlot(idx)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
