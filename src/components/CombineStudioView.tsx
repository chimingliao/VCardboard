import React, { useMemo, useState } from 'react';
import {
  BookmarkPlus,
  Camera,
  Check,
  Copy,
  Film,
  Layers,
  Share2,
  Shuffle,
  Sparkles,
  Wand2,
} from 'lucide-react';
import {
  CARD_TYPE_META,
  CARD_TYPE_ORDER,
  DEFAULT_RECIPE,
  MONO_ASSETS,
  resolveCompositePreviewUrl,
} from '../data/catalog';
import {
  CardType,
  CombineRecipe,
  EffectVisualKind,
  OutputMedium,
  StyleCard,
} from '../types/card';
import { buildEcosystemOutput, copyToClipboard } from '../utils/promptBuilder';
import { tactileAudio } from '../utils/sound';
import { CardVisual } from './CardVisual';

interface CombineStudioViewProps {
  catalog: StyleCard[];
  ownedIds: Set<string>;
  recipe: CombineRecipe;
  onChangeRecipe: (next: CombineRecipe) => void;
  onSaveCreation: (previewUrl: string, summaryLine: string) => void;
  onInspectCard: (card: StyleCard) => void;
  onGoToPacks: () => void;
}

const SLOT_KEY_BY_TYPE: Record<CardType, keyof CombineRecipe> = {
  character: 'characterId',
  costume: 'costumeId',
  hairstyle: 'hairstyleId',
  makeup: 'makeupId',
  pose: 'poseId',
  scene: 'sceneId',
  prop: 'propId',
  effect: 'effectId',
};

function OpticalEffectLayer({ kind }: { kind?: EffectVisualKind }) {
  if (!kind) return null;

  if (kind === 'butterfly') {
    return (
      <img
        src={MONO_ASSETS.effectButterfly}
        alt=""
        aria-hidden="true"
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-50"
      />
    );
  }
  if (kind === 'golden_bokeh') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 24%, rgba(243,217,159,0.28) 0%, transparent 32%), radial-gradient(circle at 82% 30%, rgba(226,189,117,0.22) 0%, transparent 28%), radial-gradient(circle at 75% 78%, rgba(243,217,159,0.18) 0%, transparent 30%)',
        }}
      />
    );
  }
  if (kind === 'sakura_mist') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 18% 18%, rgba(248,198,216,0.26) 0%, transparent 38%), radial-gradient(circle at 84% 22%, rgba(255,241,199,0.22) 0%, transparent 35%)',
        }}
      />
    );
  }
  if (kind === 'gothic_rays') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(128deg, rgba(243,217,159,0.32) 0%, transparent 38%, rgba(226,189,117,0.18) 52%, transparent 72%)',
        }}
      />
    );
  }
  if (kind === 'cyber_rim') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(121,210,230,0.24) 0%, transparent 45%, rgba(169,156,240,0.26) 100%)',
        }}
      />
    );
  }
  if (kind === 'film_grain') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 film-grain-overlay opacity-45"
      />
    );
  }
  return null;
}

export const CombineStudioView: React.FC<CombineStudioViewProps> = ({
  catalog,
  ownedIds,
  recipe,
  onChangeRecipe,
  onSaveCreation,
  onInspectCard,
  onGoToPacks,
}) => {
  const [activeSlot, setActiveSlot] = useState<CardType>('costume');
  const [outputTab, setOutputTab] = useState<'image' | 'video' | 'social'>('image');
  const [imageFormat, setImageFormat] = useState<'prompt' | 'comfy'>('prompt');
  const [synthesizing, setSynthesizing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const cardMap = useMemo(() => {
    const m = new Map<string, StyleCard>();
    catalog.forEach((c) => m.set(c.card_id, c));
    return m;
  }, [catalog]);

  const preview = useMemo(
    () => resolveCompositePreviewUrl(recipe, cardMap),
    [recipe, cardMap]
  );

  const output = useMemo(
    () => buildEcosystemOutput(recipe, cardMap),
    [recipe, cardMap]
  );

  const effectCard = recipe.effectId ? cardMap.get(recipe.effectId) : undefined;
  const sceneCard = recipe.sceneId ? cardMap.get(recipe.sceneId) : undefined;

  const equippedList = useMemo(() => {
    return CARD_TYPE_ORDER.map((type) => {
      const id = recipe[SLOT_KEY_BY_TYPE[type]] as string | null;
      return {
        type,
        card: id ? cardMap.get(id) ?? null : null,
      };
    });
  }, [recipe, cardMap]);

  const equippedCount = equippedList.filter((item) => item.card !== null).length;

  const cardsForActiveSlot = useMemo(() => {
    const allOfType = catalog.filter((c) => c.card_type === activeSlot);
    return [
      ...allOfType.filter((c) => ownedIds.has(c.card_id)),
      ...allOfType.filter((c) => !ownedIds.has(c.card_id)),
    ];
  }, [catalog, activeSlot, ownedIds]);

  const setSlotCard = (type: CardType, cardId: string | null) => {
    const key = SLOT_KEY_BY_TYPE[type];
    onChangeRecipe({
      ...recipe,
      [key]: cardId,
    });
  };

  const handleShuffleOwned = () => {
    const pickOwned = (type: CardType): string | null => {
      const pool = catalog.filter(
        (c) => c.card_type === type && ownedIds.has(c.card_id)
      );
      if (pool.length === 0) return null;
      return pool[Math.floor(Math.random() * pool.length)].card_id;
    };
    tactileAudio.playCardFlip();
    onChangeRecipe({
      ...recipe,
      title: '随机灵感造型企划',
      characterId: pickOwned('character'),
      costumeId: pickOwned('costume'),
      hairstyleId: pickOwned('hairstyle'),
      makeupId: pickOwned('makeup'),
      poseId: pickOwned('pose'),
      sceneId: pickOwned('scene'),
      propId: pickOwned('prop'),
      effectId: pickOwned('effect'),
    });
  };

  const handleSynthesizePreview = () => {
    tactileAudio.playChaseReveal();
    setSynthesizing(true);
    window.setTimeout(() => setSynthesizing(false), 650);
  };

  const handleCopy = (key: string, text: string) => {
    void copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const buildSummaryLine = () => {
    return equippedList
      .filter((i) => i.card)
      .map((i) => i.card!.name.split(' · ')[0])
      .join(' + ');
  };

  return (
    <div className="space-y-7">
      {/* Top Bar: Title + Quick Presets */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-mono-data tracking-wider text-[#E2BD75]">
            COMBINE &amp; CREATE · 8 槽位视觉自由组合工坊
          </div>
          <input
            type="text"
            value={recipe.title}
            onChange={(e) => onChangeRecipe({ ...recipe, title: e.target.value })}
            aria-label="角色组合企划标题"
            placeholder="为本次新角色造型企划命名……"
            className="mt-1.5 w-full max-w-xl bg-transparent font-editorial text-2xl sm:text-3xl font-semibold text-[#FFFDF8] focus:outline-none border-b border-transparent focus:border-[#E2BD75]/60 pb-0.5"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onChangeRecipe(DEFAULT_RECIPE)}
            className="px-3.5 py-2 rounded-lg bg-[#171A26] border border-white/10 text-xs text-[#C6C2BA] hover:text-[#FFFDF8] hover:border-[#E2BD75]/50 transition-colors whitespace-nowrap"
          >
            经典校园组合预设
          </button>
          <button
            type="button"
            onClick={handleShuffleOwned}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#171A26] border border-white/10 text-xs text-[#F1EEE8] hover:border-[#E2BD75]/50 transition-colors whitespace-nowrap"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#E2BD75]" />
            随机灵感组合
          </button>
          <button
            type="button"
            onClick={() => onSaveCreation(preview.primaryUrl, buildSummaryLine())}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E2BD75] text-[#0D0E14] text-xs font-semibold hover:bg-[#F3D99F] transition-colors whitespace-nowrap"
          >
            <BookmarkPlus className="w-4 h-4" />
            保存至角色作品库
          </button>
        </div>
      </section>

      {/* 8-Slot Visual Equation Strip */}
      <section className="rounded-2xl bg-[#11131C] border border-white/10 p-4 md:p-5 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#C6C2BA]">
            点击任意槽位切换下方素材盘（已装配 <span className="font-mono-data text-[#E2BD75]">{equippedCount}/8</span> 张卡牌）
          </span>
          <button
            type="button"
            onClick={onGoToPacks}
            className="text-[#E2BD75] hover:text-[#F3D99F] whitespace-nowrap"
          >
            缺少心仪造型？去开主题卡包 →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {equippedList.map(({ type, card }) => {
            const isSelectedSlot = activeSlot === type;
            const meta = CARD_TYPE_META[type];
            return (
              <button
                key={type}
                type="button"
                onClick={() => setActiveSlot(type)}
                className={`relative rounded-xl p-2 text-left border transition-all ${
                  isSelectedSlot
                    ? 'bg-[#1D2130] border-[#E2BD75] ring-1 ring-[#E2BD75]/45'
                    : 'bg-[#151824] border-white/8 hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1.5">
                  <span className={isSelectedSlot ? 'text-[#F3D99F] font-semibold' : 'text-[#9E9BA3]'}>
                    {meta.label}
                  </span>
                  {card && (
                    <span className="font-editorial italic text-xs text-[#E2BD75]">
                      {card.rarity}
                    </span>
                  )}
                </div>

                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#0C0E14] border border-white/8 flex items-center justify-center">
                  {card?.artwork_url ? (
                    <img
                      src={card.artwork_url}
                      alt={card.name}
                      referrerPolicy="no-referrer"
                      style={{ objectPosition: card.artwork_focal || '50% 30%' }}
                      className="w-full h-full object-cover"
                    />
                  ) : card ? (
                    <span className="text-[10px] font-mono-data text-[#E2BD75] px-1 text-center">
                      {meta.en}
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#68666F]">+ 未选</span>
                  )}
                </div>

                <div className="mt-1.5 text-[11px] text-[#F1EEE8] truncate">
                  {card ? card.name.split(' · ')[0] : '点击挑选'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Slot Material Picker Tray */}
        <div className="pt-4 border-t border-white/8 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="font-semibold text-[#FFFDF8]">
                正在挑选：{CARD_TYPE_META[activeSlot].label}（{CARD_TYPE_META[activeSlot].en}）
              </span>
              <span className="ml-2 text-[#9E9BA3]">· {CARD_TYPE_META[activeSlot].slotHint}</span>
            </div>
            {recipe[SLOT_KEY_BY_TYPE[activeSlot]] && (
              <button
                type="button"
                onClick={() => setSlotCard(activeSlot, null)}
                className="text-xs text-[#9E9BA3] hover:text-[#FFFDF8]"
              >
                清空此槽位
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {cardsForActiveSlot.map((card) => {
              const isOwned = ownedIds.has(card.card_id);
              const isEquipped = recipe[SLOT_KEY_BY_TYPE[activeSlot]] === card.card_id;
              return (
                <CardVisual
                  key={card.card_id}
                  card={card}
                  size="xs"
                  owned={isOwned}
                  selected={isEquipped}
                  onClick={() => {
                    if (isOwned) {
                      tactileAudio.playCardFlip();
                      setSlotCard(activeSlot, isEquipped ? null : card.card_id);
                    } else {
                      onInspectCard(card);
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Split: Left 5-col Synthesized Character Preview + Right 7-col Ecosystem Output */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-7 items-start">
        {/* Left: Live Synthesized Lookbook Stage */}
        <section className="xl:col-span-5 rounded-2xl bg-[#11131C] border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-xl font-semibold text-[#FFFDF8]">
                新角色视觉合成预览
              </h2>
              <p className="text-xs text-[#9E9BA3]">
                {preview.isMatchedComposite
                  ? '已触发高匹配度校园联动成片预览'
                  : '实时叠加所选角色、场景光晕与光学特效层'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSynthesizePreview}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E2BD75] text-[#0D0E14] text-xs font-semibold hover:bg-[#F3D99F] transition-colors whitespace-nowrap"
            >
              <Wand2 className="w-3.5 h-3.5" />
              合成影像预览
            </button>
          </div>

          {/* Layered Preview Frame */}
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#E2BD75]/45 bg-[#0B0C11]">
            {/* Ambient Scene Back-Glow */}
            {preview.sceneBackdropUrl && (
              <img
                src={preview.sceneBackdropUrl}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105 blur-md"
              />
            )}

            {/* Main Character / Matched Composite Portrait */}
            <img
              src={preview.primaryUrl}
              alt={recipe.title}
              referrerPolicy="no-referrer"
              className={`relative z-10 w-full h-full object-cover object-top transition-all duration-500 ${
                synthesizing ? 'scale-105 brightness-125' : 'scale-100 brightness-100'
              } ${
                recipe.medium === 'illustration'
                  ? 'saturate-[1.15] contrast-[1.06]'
                  : recipe.medium === 'animation'
                    ? 'saturate-[1.25] contrast-[1.1]'
                    : ''
              }`}
            />

            {/* Optical Effect Overlay */}
            <div className="pointer-events-none absolute inset-0 z-20">
              <OpticalEffectLayer kind={effectCard?.effect_kind} />
            </div>

            {/* Top Medium Indicator */}
            <div className="absolute z-30 top-3.5 left-3.5 right-3.5 flex items-center justify-between text-[11px]">
              <span className="font-mono-data px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[#F3D99F]">
                {recipe.medium === 'photography'
                  ? 'PHOTOGRAPHY · 写真'
                  : recipe.medium === 'illustration'
                    ? 'ILLUSTRATION · 插画'
                    : 'ANIMATION · 动画'}
              </span>
              {sceneCard && (
                <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[#F1EEE8] truncate max-w-[160px]">
                  {sceneCard.name.split(' · ')[0]}
                </span>
              )}
            </div>

            {/* Bottom Measured Scrim + Active Recipe Summary */}
            <div className="absolute z-30 inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#08090E]/95 via-[#08090E]/65 to-transparent">
              <div className="font-editorial text-xl font-semibold text-[#FFFDF8]">
                {recipe.title || '新角色组合作品'}
              </div>
              <div className="mt-1.5 text-xs text-[#D8D4CC] line-clamp-2 leading-relaxed">
                {buildSummaryLine() || '在上方挑选卡牌开始自由搭配'}
              </div>
            </div>
          </div>

          {/* Medium Switcher: 写真 / 插画 / 动画 */}
          <div className="space-y-2">
            <div className="text-xs text-[#9E9BA3]">输出视觉介质（影响生成影像风格锚点）</div>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'photography', label: '写真摄影' },
                  { id: 'illustration', label: '精品插画' },
                  { id: 'animation', label: '电影动画' },
                ] as { id: OutputMedium; label: string }[]
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangeRecipe({ ...recipe, medium: m.id })}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                    recipe.medium === m.id
                      ? 'bg-[#E2BD75]/20 border-[#E2BD75] text-[#FFFDF8]'
                      : 'bg-[#0D0F16] border-white/10 text-[#9E9BA3] hover:text-[#F1EEE8]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Right: Full Ecosystem Output Panel (生成影像 / 制作内容 / 发布经营) */}
        <section className="xl:col-span-7 rounded-2xl bg-[#11131C] border border-white/10 overflow-hidden">
          <div className="p-5 border-b border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-editorial text-xl font-semibold text-[#FFFDF8]">
                生态内容一键输出
              </h2>
              <p className="text-xs text-[#9E9BA3] mt-0.5">
                基于上方 8 张组合卡牌自动同步生成：影像提示词、短影音脚本与社媒发布文案。
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#0B0C11] rounded-lg border border-white/8">
              <button
                type="button"
                onClick={() => setOutputTab('image')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  outputTab === 'image'
                    ? 'bg-[#202434] text-[#FFFDF8]'
                    : 'text-[#9E9BA3] hover:text-[#F1EEE8]'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-[#E2BD75]" />
                生成影像
              </button>
              <button
                type="button"
                onClick={() => setOutputTab('video')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  outputTab === 'video'
                    ? 'bg-[#202434] text-[#FFFDF8]'
                    : 'text-[#9E9BA3] hover:text-[#F1EEE8]'
                }`}
              >
                <Film className="w-3.5 h-3.5 text-[#E2BD75]" />
                短影音脚本
              </button>
              <button
                type="button"
                onClick={() => setOutputTab('social')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  outputTab === 'social'
                    ? 'bg-[#202434] text-[#FFFDF8]'
                    : 'text-[#9E9BA3] hover:text-[#F1EEE8]'
                }`}
              >
                <Share2 className="w-3.5 h-3.5 text-[#E2BD75]" />
                发布文案
              </button>
            </div>
          </div>

          {outputTab === 'image' && (
            <div className="p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setImageFormat('prompt')}
                    className={`underline-offset-4 ${
                      imageFormat === 'prompt'
                        ? 'text-[#E2BD75] underline font-medium'
                        : 'text-[#9E9BA3] hover:text-[#FFFDF8]'
                    }`}
                  >
                    分模块 Prompt（Midjourney / Flux）
                  </button>
                  <span className="text-[#55545B]">/</span>
                  <button
                    type="button"
                    onClick={() => setImageFormat('comfy')}
                    className={`underline-offset-4 ${
                      imageFormat === 'comfy'
                        ? 'text-[#E2BD75] underline font-medium'
                        : 'text-[#9E9BA3] hover:text-[#FFFDF8]'
                    }`}
                  >
                    ComfyUI JSON 载荷
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      'image',
                      imageFormat === 'prompt' ? output.imagePrompt : output.comfyJson
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E2BD75] text-[#0D0E14] text-xs font-semibold hover:bg-[#F3D99F] transition-colors whitespace-nowrap"
                >
                  {copiedKey === 'image' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      一键复制完整 Prompt
                    </>
                  )}
                </button>
              </div>

              {imageFormat === 'prompt' ? (
                <div className="space-y-2.5 text-xs font-mono-data">
                  <div className="p-3.5 rounded-xl bg-[#0B0C11] border border-[#E2BD75]/35">
                    <div className="text-[11px] text-[#E2BD75] mb-1">
                      合并直出提示词（可直接粘贴至文生图引擎）
                    </div>
                    <div className="text-[#FFFDF8] leading-relaxed break-words">
                      {output.imagePrompt}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {output.imagePromptModules.map((mod) => (
                      <div
                        key={mod.label}
                        className="p-3 rounded-lg bg-[#0B0C11] border border-white/8"
                      >
                        <div className="text-[11px] text-[#E2BD75] mb-1">{mod.label}</div>
                        <div className="text-[#D4D0C8] leading-relaxed break-words">
                          {mod.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <pre className="p-4 rounded-xl bg-[#090A0F] border border-white/8 text-[11px] font-mono-data text-[#D4D0C8] overflow-x-auto max-h-[460px] leading-relaxed">
                  {output.comfyJson}
                </pre>
              )}
            </div>
          )}

          {outputTab === 'video' && (
            <div className="p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-[#9E9BA3]">
                  适合 15–25 秒竖屏短影音（Reels / 抖音 / 小红书 / B站动态）
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('video', output.videoScript)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E2BD75] text-[#0D0E14] text-xs font-semibold hover:bg-[#F3D99F] whitespace-nowrap"
                >
                  {copiedKey === 'video' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      已复制脚本
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      复制短影音脚本
                    </>
                  )}
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-[#9E9BA3] mb-1.5">
                  创作者企划备注（自动写入脚本底部）
                </label>
                <input
                  type="text"
                  value={recipe.customNote}
                  onChange={(e) => onChangeRecipe({ ...recipe, customNote: e.target.value })}
                  placeholder="补充你想强调的故事氛围或镜头节奏……"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0B0C11] border border-white/10 text-xs text-[#FFFDF8] focus:outline-none focus:border-[#E2BD75]"
                />
              </div>

              <pre className="p-4 rounded-xl bg-[#0B0C11] border border-white/8 text-xs font-mono-data text-[#E6E2DA] whitespace-pre-wrap overflow-y-auto max-h-[380px] leading-relaxed">
                {output.videoScript}
              </pre>
            </div>
          )}

          {outputTab === 'social' && (
            <div className="p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-[#9E9BA3]">
                  自动匹配角色名、穿搭关键词与主题标签，便于直接发布经营
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('social', output.socialPost)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E2BD75] text-[#0D0E14] text-xs font-semibold hover:bg-[#F3D99F] whitespace-nowrap"
                >
                  {copiedKey === 'social' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      已复制文案
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      复制社媒文案
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#0B0C11] border border-white/8 text-xs font-mono-data text-[#E6E2DA] whitespace-pre-wrap overflow-y-auto max-h-[420px] leading-relaxed">
                {output.socialPost}
              </pre>
            </div>
          )}

          <div className="px-5 py-3 border-t border-white/8 bg-[#0E1017] flex items-center justify-between text-[11px] text-[#9E9BA3]">
            <span className="inline-flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#E2BD75]" />
              8 大素材槽位共享底层配方，画面与文案保持一致
            </span>
            <span className="inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#E2BD75]" />
              MONO Ecosystem
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};
