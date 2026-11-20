import React, { useEffect, useMemo, useState } from 'react';
import {
  Camera,
  Check,
  Image as ImageIcon,
  Layers,
  Lock,
  PackageOpen,
  Scissors,
  Search,
  Shirt,
  Sparkles,
  User,
  Wand2,
  X,
} from 'lucide-react';
import {
  CARD_TYPE_META,
  CARD_TYPE_ORDER,
  RARITY_META,
  THEME_PACKS,
} from '../data/catalog';
import { CardType, Rarity, StyleCard, ThemePackId } from '../types/card';
import { CardVisual } from './CardVisual';

interface LibraryAtlasViewProps {
  catalog: StyleCard[];
  ownedIds: Set<string>;
  initialTypeFilter?: CardType | 'all';
  onClearInitialTypeFilter?: () => void;
  onInspectCard: (card: StyleCard) => void;
  onGoToPacks: () => void;
  onOpenCustomCard: () => void;
}

const TYPE_ICONS: Record<CardType, React.ReactNode> = {
  character: <User className="w-3.5 h-3.5" />,
  costume: <Shirt className="w-3.5 h-3.5" />,
  hairstyle: <Scissors className="w-3.5 h-3.5" />,
  makeup: <Wand2 className="w-3.5 h-3.5" />,
  pose: <Layers className="w-3.5 h-3.5" />,
  scene: <ImageIcon className="w-3.5 h-3.5" />,
  prop: <Camera className="w-3.5 h-3.5" />,
  effect: <Sparkles className="w-3.5 h-3.5" />,
};

const RARITY_ORDER: Rarity[] = ['N', 'R', 'SR', 'SSR', 'UR'];

export const LibraryAtlasView: React.FC<LibraryAtlasViewProps> = ({
  catalog,
  ownedIds,
  initialTypeFilter = 'all',
  onClearInitialTypeFilter,
  onInspectCard,
  onGoToPacks,
  onOpenCustomCard,
}) => {
  const [typeFilter, setTypeFilter] = useState<CardType | 'all'>(initialTypeFilter);
  const [themeFilter, setThemeFilter] = useState<ThemePackId | 'all'>('all');
  const [rarityFilter, setRarityFilter] = useState<Rarity | 'all'>('all');
  const [ownershipFilter, setOwnershipFilter] = useState<'all' | 'owned' | 'missing'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialTypeFilter !== 'all') {
      setTypeFilter(initialTypeFilter);
      onClearInitialTypeFilter?.();
    }
  }, [initialTypeFilter, onClearInitialTypeFilter]);

  const ownedCount = useMemo(
    () => catalog.filter((c) => ownedIds.has(c.card_id)).length,
    [catalog, ownedIds]
  );

  const completionPct = catalog.length > 0 ? Math.round((ownedCount / catalog.length) * 100) : 0;

  const themeProgress = useMemo(() => {
    return THEME_PACKS.map((pack) => {
      const pool = catalog.filter((c) => c.theme_id === pack.pack_id);
      const owned = pool.filter((c) => ownedIds.has(c.card_id)).length;
      return {
        pack,
        total: pool.length,
        owned,
        pct: pool.length > 0 ? Math.round((owned / pool.length) * 100) : 0,
      };
    });
  }, [catalog, ownedIds]);

  const typeCounts = useMemo(() => {
    const map: Record<CardType, { owned: number; total: number }> = {
      character: { owned: 0, total: 0 },
      costume: { owned: 0, total: 0 },
      hairstyle: { owned: 0, total: 0 },
      makeup: { owned: 0, total: 0 },
      pose: { owned: 0, total: 0 },
      scene: { owned: 0, total: 0 },
      prop: { owned: 0, total: 0 },
      effect: { owned: 0, total: 0 },
    };
    catalog.forEach((c) => {
      map[c.card_type].total += 1;
      if (ownedIds.has(c.card_id)) map[c.card_type].owned += 1;
    });
    return map;
  }, [catalog, ownedIds]);

  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return catalog.filter((card) => {
      if (typeFilter !== 'all' && card.card_type !== typeFilter) return false;
      if (themeFilter !== 'all' && card.theme_id !== themeFilter) return false;
      if (rarityFilter !== 'all' && card.rarity !== rarityFilter) return false;
      const isOwned = ownedIds.has(card.card_id);
      if (ownershipFilter === 'owned' && !isOwned) return false;
      if (ownershipFilter === 'missing' && isOwned) return false;
      if (q) {
        const hay = [
          card.name,
          card.en_name,
          card.theme_name,
          card.description,
          ...card.style_tags,
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [catalog, ownedIds, typeFilter, themeFilter, rarityFilter, ownershipFilter, searchQuery]);

  const hasActiveFilter =
    typeFilter !== 'all' ||
    themeFilter !== 'all' ||
    rarityFilter !== 'all' ||
    ownershipFilter !== 'all' ||
    searchQuery.trim().length > 0;

  const resetFilters = () => {
    setTypeFilter('all');
    setThemeFilter('all');
    setRarityFilter('all');
    setOwnershipFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-8">
      {/* Header + Overall Collection Progress */}
      <section className="rounded-2xl bg-[#11131C] border border-white/10 p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs tracking-[0.2em] uppercase text-[#E2BD75]">
              STYLE ARCHIVE BINDER
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#FFFDF8]">
              素材图鉴 · 全量 8 类角色创作卡库
            </h1>
            <p className="text-sm text-[#A9A6AF] leading-relaxed">
              收录全部 6 大主题系列的角色、服装、发型、妆容、动作、场景、道具与风格特效卡。点击任意已收集卡牌可检视 Prompt 锚点并直接装入自由组合台。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-[#0B0C11] border border-white/8 text-right">
              <div className="text-[11px] text-[#9E9BA3]">图鉴收集进度</div>
              <div className="font-mono-data text-lg font-semibold text-[#FFFDF8] tabular-nums">
                {ownedCount}
                <span className="text-[#6F6C77] font-normal"> / {catalog.length}</span>
                <span className="ml-2 text-xs text-[#E2BD75]">{completionPct}%</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onGoToPacks}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E2BD75] text-[#0D0E14] text-xs font-semibold hover:bg-[#F3D99F] transition-colors whitespace-nowrap"
            >
              <PackageOpen className="w-4 h-4" />
              去开启主题卡包
            </button>
          </div>
        </div>

        {/* 6 Theme Pack Progress Strip */}
        <div className="mt-6 pt-5 border-t border-white/8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {themeProgress.map(({ pack, owned, total, pct }) => {
            const active = themeFilter === pack.pack_id;
            return (
              <button
                key={pack.pack_id}
                type="button"
                onClick={() =>
                  setThemeFilter((prev) => (prev === pack.pack_id ? 'all' : pack.pack_id))
                }
                className={`text-left p-3 rounded-xl border transition-all ${
                  active
                    ? 'bg-[#1A1D2B] border-[#E2BD75] shadow-[0_0_20px_rgba(226,189,117,0.16)]'
                    : 'bg-[#0C0E15] border-white/8 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[#FFFDF8] truncate">
                    {pack.title}
                  </span>
                  <span className="font-mono-data text-[11px] text-[#9E9BA3] tabular-nums">
                    {owned}/{total}
                  </span>
                </div>
                <div className="mt-2 h-1 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: pack.foil_edge,
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filter Bar */}
      <section className="rounded-2xl bg-[#11131C] border border-white/10 p-4 sm:p-5 space-y-4">
        {/* Row 1: 8 Card Types Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
              typeFilter === 'all'
                ? 'bg-[#E2BD75] text-[#0D0E14] border-[#E2BD75]'
                : 'bg-[#0C0E15] text-[#B8B4BD] border-white/10 hover:text-[#FFFDF8]'
            }`}
          >
            全部 8 类
            <span className="ml-1.5 font-mono-data opacity-75 tabular-nums">
              {catalog.length}
            </span>
          </button>

          {CARD_TYPE_ORDER.map((t) => {
            const active = typeFilter === t;
            const info = CARD_TYPE_META[t];
            const stat = typeCounts[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#E2BD75]/18 text-[#FFFDF8] border-[#E2BD75]'
                    : 'bg-[#0C0E15] text-[#A9A6AF] border-white/8 hover:text-[#FFFDF8] hover:border-white/20'
                }`}
              >
                <span className={active ? 'text-[#E2BD75]' : 'text-[#84818D]'}>
                  {TYPE_ICONS[t]}
                </span>
                {info.label}
                <span className="font-mono-data text-[10px] text-[#84818D] tabular-nums">
                  {stat.owned}/{stat.total}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Search + Rarity + Ownership */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-white/8">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#7E7B86] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索卡牌名称、标签、风格或场景关键词……"
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#0B0C11] border border-white/10 text-xs text-[#FFFDF8] placeholder-[#6E6B76] focus:outline-none focus:border-[#E2BD75]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7E7B86] hover:text-[#FFFDF8]"
                aria-label="清空搜索"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Rarity Filter */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0B0C11] border border-white/8">
              <button
                type="button"
                onClick={() => setRarityFilter('all')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
                  rarityFilter === 'all'
                    ? 'bg-[#202434] text-[#FFFDF8]'
                    : 'text-[#8F8C96] hover:text-[#FFFDF8]'
                }`}
              >
                全稀有度
              </button>
              {RARITY_ORDER.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRarityFilter(r)}
                  className={`px-2 py-1 rounded text-[11px] font-mono-data transition-colors whitespace-nowrap ${
                    rarityFilter === r
                      ? 'bg-[#202434] text-[#E2BD75]'
                      : 'text-[#8F8C96] hover:text-[#FFFDF8]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Ownership Filter */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0B0C11] border border-white/8">
              {(
                [
                  { id: 'all', label: '全部' },
                  { id: 'owned', label: '已收集' },
                  { id: 'missing', label: '未解锁' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOwnershipFilter(item.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
                    ownershipFilter === item.id
                      ? 'bg-[#202434] text-[#FFFDF8]'
                      : 'text-[#8F8C96] hover:text-[#FFFDF8]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {hasActiveFilter && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-[#E2BD75] hover:text-[#F3D99F] px-2 py-1 whitespace-nowrap"
              >
                重置筛选
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Card Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#9E9BA3]">
          <div className="tabular-nums">
            当前显示 <span className="text-[#FFFDF8] font-medium">{filteredCards.length}</span> 张素材卡
            {themeFilter !== 'all' && (
              <>
                {' · '}
                主题：{THEME_PACKS.find((p) => p.pack_id === themeFilter)?.title}
              </>
            )}
            {typeFilter !== 'all' && (
              <>
                {' · '}
                分类：{CARD_TYPE_META[typeFilter].label}
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onOpenCustomCard}
            className="text-[#E2BD75] hover:text-[#F3D99F] transition-colors whitespace-nowrap"
          >
            + 自制扩展素材卡
          </button>
        </div>

        {filteredCards.length === 0 ? (
          <div className="rounded-2xl bg-[#11131C] border border-white/10 p-12 text-center space-y-3">
            <div className="font-editorial text-lg text-[#FFFDF8]">没有匹配当前筛选条件的素材卡</div>
            <p className="text-xs text-[#9E9BA3]">
              可以清空关键词或切换主题分类，也可以前往卡包架开启对应主题卡包。
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 rounded-lg bg-[#1C1F2D] text-xs text-[#FFFDF8] hover:bg-[#262A3C]"
              >
                清空所有筛选
              </button>
              <button
                type="button"
                onClick={onGoToPacks}
                className="px-4 py-2 rounded-lg bg-[#E2BD75] text-xs font-semibold text-[#0D0E14] hover:bg-[#F3D99F]"
              >
                前往抽卡补齐
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {filteredCards.map((card) => {
              const owned = ownedIds.has(card.card_id);
              const rarityInfo = RARITY_META[card.rarity];
              return (
                <div key={card.card_id} className="group flex flex-col gap-2">
                  <div className="relative">
                    <CardVisual
                      card={card}
                      size="md"
                      owned={owned}
                      onClick={() => onInspectCard(card)}
                    />
                    <div className="pointer-events-none absolute top-2.5 right-2.5 z-20">
                      {owned ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/65 backdrop-blur-sm text-[10px] text-[#E2BD75]">
                          <Check className="w-2.5 h-2.5" />
                          已收录
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] text-[#9E9BA3]">
                          <Lock className="w-2.5 h-2.5" />
                          未解锁
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-0.5 flex items-center justify-between text-[11px] text-[#9E9BA3]">
                    <span className="truncate">
                      {CARD_TYPE_META[card.card_type].label} · {card.theme_name}
                    </span>
                    <span
                      className="font-mono-data shrink-0 ml-2"
                      style={{ color: rarityInfo.textColor }}
                    >
                      {card.rarity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
