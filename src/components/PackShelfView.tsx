import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Eye,
  Info,
  PackageOpen,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  BOOSTER_PACKS,
  CARD_TYPE_META,
  getPackDrawablePool,
  openBoosterPack,
  PackOpenSpec,
  RARITY_META,
} from '../data/catalog';
import { BoosterPackDef, NarrativeCard } from '../types/card';
import { tactileAudio } from '../utils/sound';
import { CardRevealStage, CardVisual } from './CardVisual';

interface PackShelfViewProps {
  catalog: NarrativeCard[];
  ownedIds: Set<string>;
  onCardsAcquired: (cards: NarrativeCard[]) => void;
  onInspectCard: (card: NarrativeCard) => void;
  onSendCardsToWorkbench: (cards: NarrativeCard[]) => void;
}

type OpeningPhase = 'sealed' | 'tearing' | 'flipping';

interface DrawnSlot {
  uid: string;
  card: NarrativeCard;
  isNew: boolean;
  stage: CardRevealStage;
}

export const PackShelfView: React.FC<PackShelfViewProps> = ({
  catalog,
  ownedIds,
  onCardsAcquired,
  onInspectCard,
  onSendCardsToWorkbench,
}) => {
  const [disclosurePack, setDisclosurePack] = useState<BoosterPackDef | null>(null);
  const [activePack, setActivePack] = useState<BoosterPackDef | null>(null);
  const [activeSpec, setActiveSpec] = useState<PackOpenSpec>('single');
  const [openingPhase, setOpeningPhase] = useState<OpeningPhase>('sealed');
  const [drawnSlots, setDrawnSlots] = useState<DrawnSlot[]>([]);
  const [muted, setMuted] = useState(false);
  const [sealCountdown, setSealCountdown] = useState(0);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const totalNonHidden = useMemo(
    () => catalog.filter((c) => !c.hidden_unlock).length,
    [catalog]
  );
  const ownedNonHidden = useMemo(
    () => catalog.filter((c) => !c.hidden_unlock && ownedIds.has(c.card_id)).length,
    [catalog, ownedIds]
  );

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    tactileAudio.muted = next;
  };

  const startPackSession = (pack: BoosterPackDef, spec: PackOpenSpec) => {
    clearTimers();
    const drawn = openBoosterPack(pack, spec, catalog, ownedIds);
    const seenInSession = new Set(ownedIds);
    const slots: DrawnSlot[] = drawn.map((card, idx) => {
      const isNew = !seenInSession.has(card.card_id);
      seenInSession.add(card.card_id);
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
    setSealCountdown(3);

    // 3-second psychological restraint feel (user can still tear immediately if they prefer)
    const t1 = window.setTimeout(() => setSealCountdown(2), 900);
    const t2 = window.setTimeout(() => setSealCountdown(1), 1800);
    const t3 = window.setTimeout(() => setSealCountdown(0), 2600);
    timersRef.current.push(t1, t2, t3);
  };

  const handleTearPack = () => {
    if (openingPhase !== 'sealed') return;
    tactileAudio.playFoilTear();
    setOpeningPhase('tearing');
    onCardsAcquired(drawnSlots.map((s) => s.card));

    const t = window.setTimeout(() => {
      setOpeningPhase('flipping');
    }, 620);
    timersRef.current.push(t);
  };

  // Three-beat psychological reveal cadence: Type/Name -> Artwork -> Rarity Mark
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
    }, 240);

    const tComplete = window.setTimeout(() => {
      if (RARITY_META[slot.card.rarity].group === 'chase') {
        tactileAudio.playChaseReveal();
      }
      setDrawnSlots((prev) =>
        prev.map((item, i) => (i === index ? { ...item, stage: 'complete' } : item))
      );
    }, 560);

    timersRef.current.push(tArt, tComplete);
  };

  const flipNextUnopened = () => {
    const idx = drawnSlots.findIndex((s) => s.stage === 'back');
    if (idx !== -1) flipSingleSlot(idx);
  };

  const revealAll = () => {
    drawnSlots.forEach((slot, idx) => {
      if (slot.stage === 'back') {
        const delay = idx * 120;
        const t = window.setTimeout(() => flipSingleSlot(idx), delay);
        timersRef.current.push(t);
      }
    });
  };

  const closeOpeningStage = () => {
    clearTimers();
    setActivePack(null);
    setDrawnSlots([]);
  };

  const allRevealed =
    drawnSlots.length > 0 && drawnSlots.every((s) => s.stage === 'complete');
  const newCount = drawnSlots.filter((s) => s.isNew).length;

  return (
    <div className="space-y-12">
      {/* Editorial Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between py-2">
          <div>
            <div className="text-xs text-[#D8B467] tracking-wide">
              叙事积木系统 · 本地单机创作版
            </div>
            <h1 className="mt-3 font-editorial text-4xl sm:text-5xl font-semibold leading-[1.14] tracking-tight text-[#FAF8F2] [text-wrap:balance]">
              收集世界观的碎片，拼装可生长的故事宇宙
            </h1>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#B6B2A8] max-w-2xl">
              这里没有战力数值、没有对战结算，也没有消耗型养成。每一张卡都是一枚永久入库的结构化提示词容器——稀有度只代表插画规格与叙事分量，开出的每一套服饰、场景、剧情与关系，都能立即进入工作台生成画面与剧本。
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => startPackSession(BOOSTER_PACKS[0], 'single')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#D8B467] text-[#111318] text-sm font-semibold hover:bg-[#E9CF90] transition-colors whitespace-nowrap"
            >
              <PackageOpen className="w-4 h-4" />
              拆封首包「星尘序章」
            </button>
            <button
              type="button"
              onClick={() => setDisclosurePack(BOOSTER_PACKS[1])}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-[#171B24] border border-white/10 text-sm text-[#ECE9E1] hover:border-white/25 transition-colors whitespace-nowrap"
            >
              <Info className="w-4 h-4" />
              查看解耦稀有度与概率公示
            </button>
          </div>
        </div>

        {/* Right Showcase Visual Frame matching height */}
        <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-white/10 bg-[#151821] min-h-[260px]">
          <img
            src={BOOSTER_PACKS[4].cover_art}
            alt="羁绊回响篇双人叙事插画"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top lg:h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F14]/92 via-[#0D0F14]/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <div className="text-xs font-mono-data text-[#E9CF90]">
              CHR 角色联动稀有 · 关系包核心创新
            </div>
            <div className="mt-1.5 font-editorial text-xl font-semibold text-[#FAF8F2]">
              跨频共振 · 玻璃穹顶的雨夜
            </div>
            <p className="mt-1 text-xs text-[#C6C2B8] leading-relaxed">
              关系本身即独立藏品。当你同时拥有蜜梨与苍渊，再抽中羁绊卡，便立刻拥有一段可续写的故事起点。
            </p>
          </div>
        </div>
      </section>

      {/* Full-width Universe Completion Row (Strict anti-slop metric strip below hero split) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 rounded-xl overflow-hidden border border-white/8">
        <div className="bg-[#13161F] p-5">
          <div className="text-xs text-[#9A9892]">全宇宙补全进度</div>
          <div className="mt-2 font-mono-data text-2xl font-medium text-[#FAF8F2]">
            {ownedNonHidden} / {totalNonHidden}
          </div>
          <div className="mt-1 text-xs text-[#D8B467]">
            该宇宙已补全 {Math.round((ownedNonHidden / Math.max(1, totalNonHidden)) * 100)}% 模块
          </div>
        </div>

        {(['stardust_prelude', 'deepsea_echo', 'wasteland_era'] as const).map((sid) => {
          const seriesCards = catalog.filter((c) => c.series_id === sid && !c.hidden_unlock);
          const ownedSeries = seriesCards.filter((c) => ownedIds.has(c.card_id)).length;
          const label =
            sid === 'stardust_prelude'
              ? '星尘序章'
              : sid === 'deepsea_echo'
                ? '深海回响'
                : '荒野纪元';
          const pct = Math.round((ownedSeries / Math.max(1, seriesCards.length)) * 100);
          return (
            <div key={sid} className="bg-[#13161F] p-5">
              <div className="flex items-center justify-between text-xs text-[#9A9892]">
                <span>系列 · {label}</span>
                <span className="font-mono-data">{pct}%</span>
              </div>
              <div className="mt-2 font-mono-data text-2xl font-medium text-[#FAF8F2]">
                {ownedSeries} / {seriesCards.length}
              </div>
              <div className="mt-3 h-1 w-full rounded-full bg-white/8 overflow-hidden">
                <div
                  className="h-full bg-[#D8B467] transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </section>

      {/* Series Booster Pack Shelf */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/8 pb-4">
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#FAF8F2]">
              卡包货架
            </h2>
            <p className="mt-1 text-sm text-[#9A9892]">
              角色本体池与叙事配件池严格分离，避免抽满配件却无角色可挂载。所有系列池均免费本地开启。
            </p>
          </div>
          <div className="text-xs text-[#9A9892] whitespace-nowrap">
            单包 5 张 · 十连 10 张（含追逐保底）· 整盒 18 张
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {BOOSTER_PACKS.map((pack) => {
            const pool = getPackDrawablePool(pack, catalog);
            const ownedInPool = pool.filter((c) => ownedIds.has(c.card_id)).length;
            const poolPct = Math.round((ownedInPool / Math.max(1, pool.length)) * 100);

            return (
              <article
                key={pack.pack_id}
                className="group rounded-xl bg-[#141821] border border-white/10 overflow-hidden flex flex-col justify-between transition-colors hover:border-[#D8B467]/45"
              >
                <div>
                  {/* Booster Foil Art Header */}
                  <div className="relative h-52 overflow-hidden bg-[#0E1118]">
                    <img
                      src={pack.cover_art}
                      alt={pack.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141821] via-[#141821]/40 to-black/35" />

                    {/* Top subtle embossed foil line */}
                    <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between text-[11px] text-[#ECE9E1]/85">
                      <span>{pack.series_name}</span>
                      <span className="font-mono-data text-[#E9CF90]">
                        已补全 {ownedInPool}/{pool.length}
                      </span>
                    </div>

                    <div className="absolute bottom-3.5 left-4 right-4">
                      <div className="text-xs text-[#D8B467]">{pack.subtitle}</div>
                      <h3 className="mt-0.5 font-editorial text-xl font-semibold text-[#FAF8F2]">
                        {pack.title}
                      </h3>
                    </div>
                  </div>

                  {/* Pack Details */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs leading-relaxed text-[#B6B2A8]">
                      {pack.description}
                    </p>
                    <div className="text-xs text-[#9A9892]">
                      世界观标签：{pack.world_tags.join(' · ')}
                    </div>
                    <div className="pt-2 border-t border-white/6 flex items-center justify-between text-xs">
                      <span className="text-[#C6C2B8]">{pack.guaranteed_note}</span>
                      <button
                        type="button"
                        onClick={() => setDisclosurePack(pack)}
                        className="ml-3 shrink-0 text-[#D8B467] hover:text-[#E9CF90] underline underline-offset-4 whitespace-nowrap"
                      >
                        卡池公示
                      </button>
                    </div>
                    <div className="h-1 w-full rounded-full bg-white/8 overflow-hidden">
                      <div
                        className="h-full bg-[#D8B467]/85 transition-all duration-300"
                        style={{ width: `${poolPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Three Opening Specs */}
                <div className="px-5 pb-5 pt-1 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => startPackSession(pack, 'single')}
                    className="py-2.5 px-2 rounded-lg bg-[#D8B467] text-[#111318] text-xs font-semibold hover:bg-[#E9CF90] transition-colors whitespace-nowrap"
                  >
                    单包开启
                  </button>
                  <button
                    type="button"
                    onClick={() => startPackSession(pack, 'ten')}
                    className="py-2.5 px-2 rounded-lg bg-[#1D2230] border border-white/10 text-xs font-medium text-[#FAF8F2] hover:border-[#D8B467]/60 transition-colors whitespace-nowrap"
                  >
                    十连拆封
                  </button>
                  <button
                    type="button"
                    onClick={() => startPackSession(pack, 'box')}
                    className="py-2.5 px-2 rounded-lg bg-[#1D2230] border border-white/10 text-xs font-medium text-[#E9CF90] hover:border-[#D8B467]/60 transition-colors whitespace-nowrap"
                  >
                    整盒收藏
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Pool & Probability Disclosure Modal */}
      {disclosurePack && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setDisclosurePack(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl bg-[#141720] border border-white/10 p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/8">
              <div>
                <div className="text-xs text-[#D8B467]">
                  概率公示与产出池明细 · 稀有度代表叙事规格而非强弱
                </div>
                <h3 className="mt-1 font-editorial text-2xl font-semibold text-[#FAF8F2]">
                  {disclosurePack.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDisclosurePack(null)}
                aria-label="关闭公示"
                className="w-10 h-10 rounded-lg flex items-center justify-center text-[#9A9892] hover:text-[#ECE9E1] hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-semibold text-[#FAF8F2] mb-3">
                  基础组规格（填充卡包基底）
                </h4>
                <div className="space-y-2 text-xs">
                  {(['C', 'U', 'R', 'RR'] as const).map((r) => (
                    <div
                      key={r}
                      className="flex items-center justify-between py-2 border-b border-white/6"
                    >
                      <div>
                        <span className="font-mono-data font-medium text-[#FAF8F2] mr-2">
                          {r}
                        </span>
                        <span className="text-[#9A9892]">{RARITY_META[r].spec}</span>
                      </div>
                      <span className="font-mono-data text-[#C6C2B8]">
                        {RARITY_META[r].rateLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#E9CF90] mb-3">
                  追逐组规格（收藏与高光叙事位）
                </h4>
                <div className="space-y-2 text-xs">
                  {(['AR', 'SR', 'SAR', 'UR', 'CHR', 'CSR'] as const).map((r) => (
                    <div
                      key={r}
                      className="flex items-center justify-between py-2 border-b border-white/6"
                    >
                      <div>
                        <span className="font-mono-data font-medium text-[#E9CF90] mr-2">
                          {r}
                        </span>
                        <span className="text-[#9A9892]">{RARITY_META[r].spec}</span>
                      </div>
                      <span className="font-mono-data text-[#E9CF90]">
                        {RARITY_META[r].rateLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/8">
              <div className="text-xs font-semibold text-[#FAF8F2] mb-3">
                本池收录卡牌（共 {getPackDrawablePool(disclosurePack, catalog).length} 枚固定模块）
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {getPackDrawablePool(disclosurePack, catalog).map((c) => {
                  const isOwned = ownedIds.has(c.card_id);
                  return (
                    <button
                      key={c.card_id}
                      type="button"
                      onClick={() => {
                        setDisclosurePack(null);
                        onInspectCard(c);
                      }}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#0D0F14] border border-white/8 hover:border-[#D8B467]/40 text-left text-xs transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-[#FAF8F2] truncate">{c.name}</div>
                        <div className="text-[11px] text-[#9A9892]">
                          {CARD_TYPE_META[c.card_type].short} · {isOwned ? '已入库' : '未发现'}
                        </div>
                      </div>
                      <span
                        className={`font-mono-data shrink-0 ${
                          RARITY_META[c.rarity].group === 'chase'
                            ? 'text-[#E9CF90]'
                            : 'text-[#9A9892]'
                        }`}
                      >
                        {c.rarity}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Tactile Pack Opening Stage (撕开 — 展开 — 翻牌) */}
      {activePack && (
        <div className="fixed inset-0 z-50 bg-[#0A0C11]/96 backdrop-blur-md flex flex-col">
          {/* Top Stage Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-editorial text-lg font-semibold text-[#FAF8F2] truncate">
                {activePack.title}
              </span>
              <span className="text-xs text-[#9A9892] whitespace-nowrap">
                · {activeSpec === 'single' ? '单包 5 张' : activeSpec === 'ten' ? '十连 10 张' : '整盒 18 张'}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? '开启拆包音效' : '静音拆包音效'}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#9A9892] hover:text-[#FAF8F2] hover:bg-white/5 transition-colors"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={closeOpeningStage}
                className="px-3.5 py-2 rounded-lg text-xs text-[#C6C2B8] hover:text-[#FAF8F2] bg-white/5 hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                返回货架
              </button>
            </div>
          </div>

          {/* Stage Center */}
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center justify-center">
            {openingPhase !== 'flipping' ? (
              <div className="flex flex-col items-center max-w-md w-full">
                <div className="text-xs text-[#9A9892] mb-6 text-center">
                  {openingPhase === 'sealed'
                    ? sealCountdown > 0
                      ? `静候封皮质感呈现（${sealCountdown}s），或直接沿上方撕口拆封`
                      : '封皮已就绪 · 点击沿虚线撕开卡包'
                    : '正在缓缓展开卡包……'}
                </div>

                {/* Physical Matte Foil Booster Pack */}
                <button
                  type="button"
                  onClick={handleTearPack}
                  className="group relative w-[270px] sm:w-[296px] aspect-[3/4.6] rounded-2xl overflow-hidden border border-[#D8B467]/45 bg-[#151822] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] transition-transform duration-300 hover:-translate-y-1"
                >
                  {/* Tear Strip Top */}
                  <div
                    className={`relative z-20 h-14 px-4 flex items-center justify-between bg-[#1B1F2C] border-b border-dashed border-[#D8B467]/65 transition-all duration-500 ${
                      openingPhase === 'tearing'
                        ? '-translate-y-12 translate-x-10 -rotate-6 opacity-0'
                        : 'group-hover:bg-[#222838]'
                    }`}
                  >
                    <span className="font-mono-data text-[10px] tracking-widest text-[#E9CF90]">
                      TEAR ALONG LINE
                    </span>
                    <span className="text-[11px] text-[#ECE9E1]/80">点击撕开 ▸</span>
                  </div>

                  {/* Pack Cover Body */}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D13] via-[#0B0D13]/45 to-black/30" />
                    <div className="absolute inset-3 border border-[#D8B467]/30 rounded-xl pointer-events-none" />

                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="text-[11px] font-mono-data text-[#E9CF90]">
                        {activePack.series_name} · ARCHIVE PACK
                      </div>
                      <div className="mt-1.5 font-editorial text-2xl font-semibold text-[#FAF8F2]">
                        {activePack.title}
                      </div>
                      <div className="mt-2 text-xs text-[#C6C2B8]">
                        {activePack.world_tags.join(' · ')}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              <div className="w-full max-w-6xl space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-[#D8B467]">
                      {allRevealed
                        ? `本轮已全部翻开 · 宇宙新补全 +${newCount} 个模块`
                        : '点击任意卡背逐张翻开：先显类型与名称 → 再展画面 → 最终浮出规格标记'}
                    </div>
                    <h3 className="mt-1 font-editorial text-2xl font-semibold text-[#FAF8F2]">
                      {allRevealed ? '收获总览（已永久入库）' : '翻牌发现时刻'}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {!allRevealed ? (
                      <>
                        <button
                          type="button"
                          onClick={flipNextUnopened}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D8B467] text-[#111318] text-xs font-semibold hover:bg-[#E9CF90] transition-colors whitespace-nowrap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          翻开下一张
                        </button>
                        <button
                          type="button"
                          onClick={revealAll}
                          className="px-4 py-2 rounded-lg bg-[#1A1F2B] border border-white/10 text-xs text-[#ECE9E1] hover:border-white/25 transition-colors whitespace-nowrap"
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
                            closeOpeningStage();
                            onSendCardsToWorkbench(cards);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D8B467] text-[#111318] text-xs font-semibold hover:bg-[#E9CF90] transition-colors whitespace-nowrap"
                        >
                          带入叙事工作台拼装
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => startPackSession(activePack, activeSpec)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1A1F2B] border border-white/10 text-xs text-[#ECE9E1] hover:border-[#D8B467]/50 transition-colors whitespace-nowrap"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          再拆一包
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Card Grid */}
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
