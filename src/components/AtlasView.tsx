import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Lock, Search, Unlock } from 'lucide-react';
import {
  ALL_WORLD_TAGS,
  BOOSTER_PACKS,
  CARD_TYPE_META,
  HERO_REGISTRY,
  RARITY_META,
} from '../data/catalog';
import { CardType, NarrativeCard, SeriesId } from '../types/card';
import { CardVisual } from './CardVisual';

interface AtlasViewProps {
  catalog: NarrativeCard[];
  ownedIds: Set<string>;
  onInspectCard: (card: NarrativeCard) => void;
  onMountRelationPair: (relationCard: NarrativeCard) => void;
  onGoToShelf: () => void;
}

type AtlasSubTab = 'binder' | 'bonds' | 'timeline' | 'milestones';

const HERO_NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  mili: { x: 210, y: 120 },
  cangyuan: { x: 510, y: 120 },
  xiyin: { x: 510, y: 310 },
  jinyu: { x: 210, y: 310 },
};

export const AtlasView: React.FC<AtlasViewProps> = ({
  catalog,
  ownedIds,
  onInspectCard,
  onMountRelationPair,
  onGoToShelf,
}) => {
  const [subTab, setSubTab] = useState<AtlasSubTab>('binder');
  const [query, setQuery] = useState('');
  const [seriesFilter, setSeriesFilter] = useState<'all' | SeriesId>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | CardType>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [rarityGroupFilter, setRarityGroupFilter] = useState<'all' | 'base' | 'chase'>('all');
  const [ownershipFilter, setOwnershipFilter] = useState<'all' | 'owned' | 'missing'>('all');
  const [selectedBondId, setSelectedBondId] = useState<string | null>(null);

  const filteredCards = useMemo(() => {
    return catalog.filter((card) => {
      if (seriesFilter !== 'all' && card.series_id !== seriesFilter) return false;
      if (typeFilter !== 'all' && card.card_type !== typeFilter) return false;
      if (tagFilter !== 'all' && !card.world_tags.includes(tagFilter)) return false;
      if (
        rarityGroupFilter !== 'all' &&
        RARITY_META[card.rarity].group !== rarityGroupFilter
      ) {
        return false;
      }
      const isOwned = ownedIds.has(card.card_id);
      if (ownershipFilter === 'owned' && !isOwned) return false;
      if (ownershipFilter === 'missing' && isOwned) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const hay = `${card.name} ${card.series} ${card.content.summary} ${card.world_tags.join(' ')} ${card.rarity}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [
    catalog,
    seriesFilter,
    typeFilter,
    tagFilter,
    rarityGroupFilter,
    ownershipFilter,
    ownedIds,
    query,
  ]);

  const relationCards = useMemo(
    () => catalog.filter((c) => c.card_type === 'relation'),
    [catalog]
  );

  // Pairwise edges for Bond Graph
  const pairEdges = useMemo(() => {
    const pairs: {
      key: string;
      from: string;
      to: string;
      cards: NarrativeCard[];
      unlockedCard?: NarrativeCard;
    }[] = [];

    const pairDefs: [string, string][] = [
      ['mili', 'cangyuan'],
      ['cangyuan', 'xiyin'],
      ['mili', 'jinyu'],
    ];

    pairDefs.forEach(([a, b]) => {
      const matching = relationCards.filter(
        (r) =>
          r.relation_targets.length === 2 &&
          r.relation_targets.includes(a) &&
          r.relation_targets.includes(b)
      );
      const unlocked = matching.find((m) => ownedIds.has(m.card_id));
      pairs.push({
        key: `${a}_${b}`,
        from: a,
        to: b,
        cards: matching,
        unlockedCard: unlocked,
      });
    });

    return pairs;
  }, [relationCards, ownedIds]);

  // Identify isolated Hero nodes (owned or unowned heroes with zero unlocked bonds)
  const isolatedHeroes = useMemo(() => {
    return Object.keys(HERO_REGISTRY).filter((heroId) => {
      return !relationCards.some(
        (r) => ownedIds.has(r.card_id) && r.relation_targets.includes(heroId)
      );
    });
  }, [relationCards, ownedIds]);

  const timelineNodes = useMemo(() => {
    return catalog
      .filter((c) => c.card_type === 'story' && c.story_kind === 'node')
      .sort((a, b) => (a.timeline_order ?? 99) - (b.timeline_order ?? 99));
  }, [catalog]);

  const seriesMilestones = useMemo(() => {
    const seenSeries = new Set<SeriesId>();
    const list: {
      seriesId: SeriesId;
      seriesName: string;
      ownedCount: number;
      totalCount: number;
      threshold: number;
      hiddenCard?: NarrativeCard;
      unlocked: boolean;
    }[] = [];

    BOOSTER_PACKS.forEach((pack) => {
      if (seenSeries.has(pack.series_id)) return;
      seenSeries.add(pack.series_id);
      const seriesCards = catalog.filter(
        (c) => c.series_id === pack.series_id && !c.hidden_unlock
      );
      const ownedCount = seriesCards.filter((c) => ownedIds.has(c.card_id)).length;
      const hiddenCard = pack.hidden_reward_card_id
        ? catalog.find((c) => c.card_id === pack.hidden_reward_card_id)
        : undefined;
      list.push({
        seriesId: pack.series_id,
        seriesName: pack.series_name,
        ownedCount,
        totalCount: seriesCards.length,
        threshold: Math.min(pack.milestone_threshold, seriesCards.length),
        hiddenCard,
        unlocked: hiddenCard ? ownedIds.has(hiddenCard.card_id) : false,
      });
    });

    return list;
  }, [catalog, ownedIds]);

  const activeBondCard =
    relationCards.find((r) => r.card_id === selectedBondId) ||
    relationCards.find((r) => ownedIds.has(r.card_id)) ||
    relationCards[0];

  const SUB_TABS: { id: AtlasSubTab; label: string }[] = [
    { id: 'binder', label: '全卡图鉴' },
    { id: 'bonds', label: '羁绊图谱' },
    { id: 'timeline', label: '故事时间线' },
    { id: 'milestones', label: '系列企划与隐藏解锁' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/8 pb-5">
        <div>
          <div className="text-xs text-[#D8B467]">宇宙编织 · 收藏即世界观资产</div>
          <h1 className="mt-1 font-editorial text-3xl sm:text-4xl font-semibold text-[#FAF8F2]">
            图鉴与宇宙图谱
          </h1>
          <p className="mt-1.5 text-sm text-[#9A9892]">
            图鉴的重点不是战力陈列，而是看清角色如何互相关联、哪些节点仍悬而未决，以及故事时间线已延伸到何处。
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#141720] rounded-lg border border-white/8 overflow-x-auto">
          {SUB_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubTab(t.id)}
              className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                subTab === t.id
                  ? 'bg-[#222736] text-[#FAF8F2]'
                  : 'text-[#9A9892] hover:text-[#ECE9E1]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: 全卡图鉴 */}
      {subTab === 'binder' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="rounded-xl bg-[#141720] border border-white/8 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4 relative">
                <Search className="w-4 h-4 text-[#9A9892] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索卡牌名、设定关键词或规格……"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0D0F14] border border-white/10 text-xs text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                />
              </div>

              <select
                value={seriesFilter}
                onChange={(e) => setSeriesFilter(e.target.value as 'all' | SeriesId)}
                aria-label="按系列筛选"
                className="md:col-span-2 px-3 py-2 rounded-lg bg-[#0D0F14] border border-white/10 text-xs text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
              >
                <option value="all">全部系列</option>
                <option value="stardust_prelude">星尘序章</option>
                <option value="deepsea_echo">深海回响</option>
                <option value="wasteland_era">荒野纪元</option>
                <option value="bond_resonance">羁绊回响篇</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'all' | CardType)}
                aria-label="按卡牌类型筛选"
                className="md:col-span-2 px-3 py-2 rounded-lg bg-[#0D0F14] border border-white/10 text-xs text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
              >
                <option value="all">全部十类卡牌</option>
                {(Object.keys(CARD_TYPE_META) as CardType[]).map((t) => (
                  <option key={t} value={t}>
                    {CARD_TYPE_META[t].label}
                  </option>
                ))}
              </select>

              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                aria-label="按世界观标签筛选"
                className="md:col-span-2 px-3 py-2 rounded-lg bg-[#0D0F14] border border-white/10 text-xs text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
              >
                <option value="all">全部世界观标签</option>
                {ALL_WORLD_TAGS.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>

              <select
                value={ownershipFilter}
                onChange={(e) =>
                  setOwnershipFilter(e.target.value as 'all' | 'owned' | 'missing')
                }
                aria-label="按收藏状态筛选"
                className="md:col-span-2 px-3 py-2 rounded-lg bg-[#0D0F14] border border-white/10 text-xs text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
              >
                <option value="all">全部收藏状态</option>
                <option value="owned">仅看已入库</option>
                <option value="missing">仅看未发现</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1 p-1 bg-[#0D0F14] rounded-lg">
                {(
                  [
                    { id: 'all', label: '全部规格' },
                    { id: 'base', label: '基础组 (C/U/R/RR)' },
                    { id: 'chase', label: '追逐组 (AR/SR/SAR/UR/CHR/CSR)' },
                  ] as const
                ).map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setRarityGroupFilter(g.id)}
                    className={`px-3 py-1.5 rounded-md text-xs transition-colors whitespace-nowrap ${
                      rarityGroupFilter === g.id
                        ? 'bg-[#1F2433] text-[#FAF8F2]'
                        : 'text-[#9A9892] hover:text-[#ECE9E1]'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              <div className="text-[#9A9892] font-mono-data">
                匹配 {filteredCards.length} 张 · 已收藏 {ownedIds.size} / {catalog.length}
              </div>
            </div>
          </div>

          {filteredCards.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 p-12 text-center text-sm text-[#9A9892]">
              当前筛选条件下暂无匹配卡牌，可重置筛选或前往卡包货架继续探索。
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredCards.map((card) => (
                <CardVisual
                  key={card.card_id}
                  card={card}
                  size="md"
                  owned={ownedIds.has(card.card_id)}
                  onClick={() => onInspectCard(card)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 羁绊图谱 (Interactive SVG Bond Network) */}
      {subTab === 'bonds' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 rounded-2xl bg-[#13161F] border border-white/10 p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-editorial text-2xl font-semibold text-[#FAF8F2]">
                  全宇宙人物羁绊网络
                </h2>
                <p className="text-xs text-[#9A9892] mt-0.5">
                  实线代表已解锁的关系包，虚线代表尚未发现的潜在羁绊。点击连线或角色节点查看详情。
                </p>
              </div>
              <div className="text-xs font-mono-data text-[#D8B467]">
                孤立节点：{isolatedHeroes.length} 名
              </div>
            </div>

            <div className="rounded-xl bg-[#0B0D12] border border-white/8 overflow-hidden">
              <svg viewBox="0 0 720 430" className="w-full h-auto block">
                {/* Subtle archival constellation background grid */}
                <defs>
                  <pattern id="atlasGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="rgba(236,233,225,0.035)"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="720" height="430" fill="url(#atlasGrid)" />

                {/* Ensemble center orbit */}
                <circle
                  cx="360"
                  cy="215"
                  r="95"
                  fill="none"
                  stroke="#D8B467"
                  strokeOpacity={
                    ownedIds.has('relation_ensemble_csr') ||
                    ownedIds.has('relation_hidden_quartet_csr')
                      ? 0.45
                      : 0.14
                  }
                  strokeDasharray="4 6"
                />

                {/* Pairwise Bond Edges */}
                {pairEdges.map((edge) => {
                  const p1 = HERO_NODE_POSITIONS[edge.from];
                  const p2 = HERO_NODE_POSITIONS[edge.to];
                  const midX = (p1.x + p2.x) / 2;
                  const midY = (p1.y + p2.y) / 2;
                  const unlocked = Boolean(edge.unlockedCard);
                  const repCard = edge.unlockedCard || edge.cards[0];
                  const isSelected = activeBondCard?.card_id === repCard?.card_id;

                  return (
                    <g
                      key={edge.key}
                      className="cursor-pointer"
                      onClick={() => repCard && setSelectedBondId(repCard.card_id)}
                    >
                      <line
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke={unlocked ? '#D8B467' : '#686A73'}
                        strokeWidth={isSelected ? 3 : unlocked ? 2 : 1.25}
                        strokeDasharray={unlocked ? undefined : '5 5'}
                        strokeOpacity={unlocked ? 0.9 : 0.45}
                      />
                      <rect
                        x={midX - 66}
                        y={midY - 14}
                        width="132"
                        height="28"
                        rx="6"
                        fill="#141822"
                        stroke={isSelected ? '#E9CF90' : unlocked ? '#D8B467' : 'rgba(255,255,255,0.14)'}
                        strokeWidth="1"
                      />
                      <text
                        x={midX}
                        y={midY + 4}
                        textAnchor="middle"
                        fill={unlocked ? '#FAF8F2' : '#9A9892'}
                        fontSize="11"
                      >
                        {unlocked
                          ? repCard.name.split(' · ')[0]
                          : `待发现 · ${repCard?.rarity ?? 'CHR'}`}
                      </text>
                    </g>
                  );
                })}

                {/* Center Ensemble CSR Node */}
                {(() => {
                  const csr = relationCards.find((r) => r.card_id === 'relation_ensemble_csr');
                  if (!csr) return null;
                  const unlocked = ownedIds.has(csr.card_id);
                  return (
                    <g
                      className="cursor-pointer"
                      onClick={() => setSelectedBondId(csr.card_id)}
                    >
                      <circle
                        cx="360"
                        cy="215"
                        r="30"
                        fill="#161A24"
                        stroke={unlocked ? '#E9CF90' : 'rgba(255,255,255,0.18)'}
                        strokeWidth={selectedBondId === csr.card_id ? 2.2 : 1.2}
                        strokeDasharray={unlocked ? undefined : '3 3'}
                      />
                      <text
                        x="360"
                        y="212"
                        textAnchor="middle"
                        fill={unlocked ? '#E9CF90' : '#9A9892'}
                        fontSize="10"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        CSR
                      </text>
                      <text
                        x="360"
                        y="226"
                        textAnchor="middle"
                        fill={unlocked ? '#FAF8F2' : '#787670'}
                        fontSize="10"
                      >
                        四重奏
                      </text>
                    </g>
                  );
                })()}

                {/* Hero Nodes */}
                {Object.values(HERO_REGISTRY).map((hero) => {
                  const pos = HERO_NODE_POSITIONS[hero.id];
                  const heroCard = catalog.find(
                    (c) => c.card_type === 'hero' && c.bind_hero.includes(hero.id)
                  );
                  const isOwned = heroCard ? ownedIds.has(heroCard.card_id) : false;
                  const isIsolated = isolatedHeroes.includes(hero.id);

                  return (
                    <g
                      key={hero.id}
                      className="cursor-pointer"
                      onClick={() => heroCard && onInspectCard(heroCard)}
                    >
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="40"
                        fill="#141822"
                        stroke={isOwned ? hero.color : 'rgba(255,255,255,0.16)'}
                        strokeWidth={isOwned ? 2.2 : 1.2}
                        strokeDasharray={isIsolated ? '4 3' : undefined}
                      />
                      <text
                        x={pos.x}
                        y={pos.y - 2}
                        textAnchor="middle"
                        fill={isOwned ? '#FAF8F2' : '#8D8B85'}
                        fontSize="15"
                        fontWeight="600"
                      >
                        {hero.name}
                      </text>
                      <text
                        x={pos.x}
                        y={pos.y + 16}
                        textAnchor="middle"
                        fill={isOwned ? '#D8B467' : '#6B6A66'}
                        fontSize="10"
                      >
                        {!isOwned ? '未持有本体' : isIsolated ? '孤立节点' : '已缔结羁绊'}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {isolatedHeroes.length > 0 && (
              <div className="p-4 rounded-xl bg-[#181B25] border border-white/8 text-xs text-[#C6C2B8] leading-relaxed">
                当前仍有{' '}
                <span className="text-[#E9CF90] font-medium">
                  {isolatedHeroes.map((id) => HERO_REGISTRY[id]?.name).join('、')}
                </span>{' '}
                处于孤立节点（尚无已解锁的关系包）。前往「卡包货架」开启「羁绊回响篇」或对应系列配件池，即可织就角色之间的故事连接。
              </div>
            )}
          </div>

          {/* Right: Selected Bond Inspector */}
          <div className="lg:col-span-4 rounded-2xl bg-[#13161F] border border-white/10 p-6 space-y-5">
            {activeBondCard && (
              <>
                <div className="text-xs text-[#D8B467]">
                  关系包详情 · {activeBondCard.rarity}（{RARITY_META[activeBondCard.rarity].cnName}）
                </div>
                <h3 className="font-editorial text-2xl font-semibold text-[#FAF8F2]">
                  {activeBondCard.name}
                </h3>
                <div className="text-xs text-[#9A9892]">
                  关联主体：
                  {activeBondCard.relation_targets
                    .map((id) => HERO_REGISTRY[id]?.name ?? id)
                    .join(' × ')}
                </div>

                <CardVisual
                  card={activeBondCard}
                  size="md"
                  owned={ownedIds.has(activeBondCard.card_id)}
                  onClick={() => onInspectCard(activeBondCard)}
                />

                <p className="text-xs leading-relaxed text-[#C6C2B8]">
                  {activeBondCard.content.summary}
                </p>
                {activeBondCard.content.tension_note && (
                  <p className="text-xs text-[#D8B467]/90 leading-relaxed">
                    羁绊张力：{activeBondCard.content.tension_note}
                  </p>
                )}

                {ownedIds.has(activeBondCard.card_id) ? (
                  <button
                    type="button"
                    onClick={() => onMountRelationPair(activeBondCard)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#D8B467] text-[#111318] text-xs font-semibold hover:bg-[#E9CF90] transition-colors whitespace-nowrap"
                  >
                    载入这对羁绊至工作台
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onGoToShelf}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#1D2230] border border-white/10 text-xs text-[#FAF8F2] hover:border-[#D8B467]/50 transition-colors whitespace-nowrap"
                  >
                    前往卡包货架寻找此关系包
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: 故事时间线 */}
      {subTab === 'timeline' && (
        <div className="rounded-2xl bg-[#13161F] border border-white/10 p-6 md:p-8 space-y-6">
          <div>
            <h2 className="font-editorial text-2xl font-semibold text-[#FAF8F2]">
              宇宙编年史 · 剧情节点时间轴
            </h2>
            <p className="mt-1 text-xs text-[#9A9892]">
              所有已收集的节点碎片自动按时间顺序排列，可直接导入叙事工作台顺着时间线续写长篇。
            </p>
          </div>

          <div className="space-y-4">
            {timelineNodes.map((node) => {
              const isOwned = ownedIds.has(node.card_id);
              return (
                <div
                  key={node.card_id}
                  className={`p-5 rounded-xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isOwned
                      ? 'bg-[#171B26] border-white/10 hover:border-[#D8B467]/45'
                      : 'bg-[#10131A] border-white/6 opacity-60'
                  }`}
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono-data text-[#D8B467]">
                        NODE {String(node.timeline_order ?? 0).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true" className="text-[#6E6C66]">·</span>
                      <span className="text-[#ECE9E1]">{node.node_phase}</span>
                      <span aria-hidden="true" className="text-[#6E6C66]">·</span>
                      <span className="text-[#9A9892]">{node.series}</span>
                      <span aria-hidden="true" className="text-[#6E6C66]">·</span>
                      <span className="font-mono-data text-[#E9CF90]">{node.rarity}</span>
                    </div>
                    <h3 className="font-editorial text-xl font-semibold text-[#FAF8F2]">
                      {node.name}
                    </h3>
                    <p className="text-xs text-[#B6B2A8] leading-relaxed max-w-3xl">
                      {isOwned
                        ? node.content.summary
                        : '尚未解锁此时间线节点。在对应系列卡包中收集，或达成系列企划里程碑后展开。'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onInspectCard(node)}
                    className="shrink-0 px-4 py-2 rounded-lg bg-[#1E2331] border border-white/10 text-xs text-[#FAF8F2] hover:border-[#D8B467]/50 transition-colors whitespace-nowrap"
                  >
                    {isOwned ? '检视节点设定' : '查看获取途径'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: 系列企划与隐藏解锁 */}
      {subTab === 'milestones' && (
        <div className="space-y-5">
          <div className="p-5 rounded-xl bg-[#141720] border border-white/8 text-xs text-[#C6C2B8] leading-relaxed">
            设计原则：系列集齐解锁的是<span className="text-[#E9CF90]">「新增叙事内容」</span>（隐藏终章剧情、隐藏秘境场景、全宇宙群像关系），绝不提供任何战力或数值强化奖励。
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seriesMilestones.map((m) => {
              const pct = Math.min(100, Math.round((m.ownedCount / Math.max(1, m.threshold)) * 100));
              return (
                <div
                  key={m.seriesId}
                  className="rounded-xl bg-[#141821] border border-white/10 p-6 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs text-[#D8B467]">系列企划里程碑</div>
                      <h3 className="mt-1 font-editorial text-2xl font-semibold text-[#FAF8F2]">
                        {m.seriesName}
                      </h3>
                    </div>
                    <div className="text-right font-mono-data">
                      <div className="text-lg text-[#FAF8F2]">
                        {m.ownedCount} / {m.threshold}
                      </div>
                      <div className="text-[11px] text-[#9A9892]">解锁阈值</div>
                    </div>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
                    <div
                      className="h-full bg-[#D8B467] transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {m.hiddenCard && (
                    <div className="pt-3 border-t border-white/8 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs">
                          {m.unlocked ? (
                            <Unlock className="w-3.5 h-3.5 text-[#D8B467]" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-[#9A9892]" />
                          )}
                          <span className={m.unlocked ? 'text-[#E9CF90]' : 'text-[#9A9892]'}>
                            {m.unlocked ? '已自动解锁隐藏内容' : `还差 ${Math.max(0, m.threshold - m.ownedCount)} 枚解锁`}
                          </span>
                        </div>
                        <div className="mt-1 text-sm font-medium text-[#FAF8F2] truncate">
                          {m.hiddenCard.name}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => m.hiddenCard && onInspectCard(m.hiddenCard)}
                        className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1D2230] border border-white/10 text-xs text-[#FAF8F2] hover:border-[#D8B467]/50 whitespace-nowrap"
                      >
                        {m.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-[#D8B467]" />}
                        查看隐藏卡
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
