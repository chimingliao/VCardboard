import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BookmarkPlus,
  Check,
  Copy,
  FileCode2,
  Film,
  Info,
  Plus,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { CARD_TYPE_META, HERO_REGISTRY, RARITY_META } from '../data/catalog';
import {
  HeroSlotLoadout,
  NarrativeCard,
  ScriptBlock,
  WorkbenchAssembly,
} from '../types/card';
import {
  buildNarrativePromptPack,
  buildVisualPromptPack,
  validateAssembly,
} from '../utils/promptBuilder';
import { CardVisual } from './CardVisual';

interface WorkbenchViewProps {
  catalog: NarrativeCard[];
  ownedIds: Set<string>;
  assembly: WorkbenchAssembly;
  onChangeAssembly: (next: WorkbenchAssembly) => void;
  onSaveSnapshot: (title: string, chapterLabel: string, note: string) => void;
  onInspectCard: (card: NarrativeCard) => void;
  onGoToShelf: () => void;
}

type WorkbenchSubTab = 'assembler' | 'dossier' | 'motions' | 'script' | 'scenes';

export const WorkbenchView: React.FC<WorkbenchViewProps> = ({
  catalog,
  ownedIds,
  assembly,
  onChangeAssembly,
  onSaveSnapshot,
  onInspectCard,
  onGoToShelf,
}) => {
  const [subTab, setSubTab] = useState<WorkbenchSubTab>('assembler');
  const [promptTab, setPromptTab] = useState<'visual' | 'narrative'>('visual');
  const [visualMode, setVisualMode] = useState<'modular' | 'comfy'>('modular');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [dossierHeroId, setDossierHeroId] = useState<string>('mili');
  const [motionSeatFilter, setMotionSeatFilter] = useState<'all' | 1 | 2 | 3>('all');
  const [narrationDraft, setNarrationDraft] = useState('');
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [snapTitle, setSnapTitle] = useState('');
  const [snapChapter, setSnapChapter] = useState('第一章');
  const [snapNote, setSnapNote] = useState('');

  const cardMap = useMemo(() => {
    const map = new Map<string, NarrativeCard>();
    catalog.forEach((c) => map.set(c.card_id, c));
    return map;
  }, [catalog]);

  const ownedCards = useMemo(
    () => catalog.filter((c) => ownedIds.has(c.card_id)),
    [catalog, ownedIds]
  );

  const ownedHeroCards = useMemo(
    () => ownedCards.filter((c) => c.card_type === 'hero'),
    [ownedCards]
  );
  const ownedRelations = useMemo(
    () => ownedCards.filter((c) => c.card_type === 'relation'),
    [ownedCards]
  );
  const ownedMotions = useMemo(
    () => ownedCards.filter((c) => c.card_type === 'motion'),
    [ownedCards]
  );
  const ownedScenes = useMemo(
    () => ownedCards.filter((c) => c.card_type === 'scene'),
    [ownedCards]
  );
  const ownedStories = useMemo(
    () => ownedCards.filter((c) => c.card_type === 'story'),
    [ownedCards]
  );
  const ownedBgms = useMemo(
    () => ownedCards.filter((c) => c.card_type === 'bgm'),
    [ownedCards]
  );

  const validationIssues = useMemo(
    () => validateAssembly(assembly, cardMap),
    [assembly, cardMap]
  );

  const visualPrompt = useMemo(
    () => buildVisualPromptPack(assembly, cardMap),
    [assembly, cardMap]
  );

  const narrativePrompt = useMemo(
    () => buildNarrativePromptPack(assembly, cardMap),
    [assembly, cardMap]
  );

  const activeScene = assembly.sceneCardId ? cardMap.get(assembly.sceneCardId) : undefined;

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const toggleHeroInAssembly = (heroId: string) => {
    const exists = assembly.heroLoadouts.some((h) => h.heroId === heroId);
    if (exists) {
      onChangeAssembly({
        ...assembly,
        heroLoadouts: assembly.heroLoadouts.filter((h) => h.heroId !== heroId),
      });
      return;
    }
    const defaultOutfit = ownedCards.find(
      (c) => c.card_type === 'outfit' && c.bind_hero.includes(heroId)
    );
    const nextSlot: HeroSlotLoadout = {
      heroId,
      outfitCardId: defaultOutfit?.card_id ?? null,
      itemCardIds: [],
      photoCardId: null,
      voiceCardId: null,
    };
    onChangeAssembly({
      ...assembly,
      heroLoadouts: [...assembly.heroLoadouts, nextSlot],
    });
  };

  const updateHeroSlot = (heroId: string, patch: Partial<HeroSlotLoadout>) => {
    onChangeAssembly({
      ...assembly,
      heroLoadouts: assembly.heroLoadouts.map((slot) =>
        slot.heroId === heroId ? { ...slot, ...patch } : slot
      ),
    });
  };

  const toggleHeroItem = (heroId: string, itemCardId: string) => {
    const slot = assembly.heroLoadouts.find((h) => h.heroId === heroId);
    if (!slot) return;
    const has = slot.itemCardIds.includes(itemCardId);
    updateHeroSlot(heroId, {
      itemCardIds: has
        ? slot.itemCardIds.filter((id) => id !== itemCardId)
        : [...slot.itemCardIds, itemCardId],
    });
  };

  const addStoryCardToScript = (cardId: string) => {
    const block: ScriptBlock = {
      id: `blk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      kind: 'card',
      cardId,
    };
    onChangeAssembly({
      ...assembly,
      scriptBlocks: [...assembly.scriptBlocks, block],
    });
  };

  const addCustomNarration = () => {
    if (!narrationDraft.trim()) return;
    const block: ScriptBlock = {
      id: `nar_${Date.now().toString(36)}`,
      kind: 'narration',
      text: narrationDraft.trim(),
    };
    onChangeAssembly({
      ...assembly,
      scriptBlocks: [...assembly.scriptBlocks, block],
    });
    setNarrationDraft('');
  };

  const moveScriptBlock = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= assembly.scriptBlocks.length) return;
    const copy = [...assembly.scriptBlocks];
    const [item] = copy.splice(idx, 1);
    copy.splice(target, 0, item);
    onChangeAssembly({ ...assembly, scriptBlocks: copy });
  };

  const removeScriptBlock = (id: string) => {
    onChangeAssembly({
      ...assembly,
      scriptBlocks: assembly.scriptBlocks.filter((b) => b.id !== id),
    });
  };

  const handleConfirmSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSnapshot(
      snapTitle.trim() || assembly.title || '未命名故事快照',
      snapChapter.trim() || '番外篇',
      snapNote.trim()
    );
    setSnapshotOpen(false);
    setSnapTitle('');
    setSnapNote('');
  };

  const SUB_TABS: { id: WorkbenchSubTab; label: string }[] = [
    { id: 'assembler', label: '编组拼装台' },
    { id: 'dossier', label: '角色档案' },
    { id: 'motions', label: '动作库' },
    { id: 'script', label: '剧本编辑器' },
    { id: 'scenes', label: '场景画廊' },
  ];

  return (
    <div className="space-y-6">
      {/* Live Scene Atmosphere Banner & Workbench Title */}
      <section className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#141720]">
        {activeScene?.artwork_url && (
          <img
            src={activeScene.artwork_url}
            alt={activeScene.name}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1016]/95 via-[#0E1016]/80 to-[#0E1016]/65" />

        <div className="relative z-10 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="min-w-0 flex-1">
            <div className="text-xs text-[#D8B467]">
              叙事工作台 · 当前场景：{activeScene ? `${activeScene.name}（${activeScene.rarity}）` : '未指定场景'}
            </div>
            <input
              type="text"
              value={assembly.title}
              onChange={(e) => onChangeAssembly({ ...assembly, title: e.target.value })}
              aria-label="编组标题"
              placeholder="输入本次创作编组标题……"
              className="mt-1.5 w-full max-w-xl bg-transparent font-editorial text-2xl sm:text-3xl font-semibold text-[#FAF8F2] focus:outline-none border-b border-transparent focus:border-[#D8B467]/60 pb-0.5"
            />
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#C6C2B8]">
              <span>出场角色：{assembly.heroLoadouts.length} 名</span>
              <span aria-hidden="true">·</span>
              <span>剧情节点：{assembly.scriptBlocks.length} 段</span>
              <span aria-hidden="true">·</span>
              <span>
                关系羁绊：
                {assembly.relationCardId
                  ? cardMap.get(assembly.relationCardId)?.name
                  : '未挂载'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSnapTitle(assembly.title);
                setSnapshotOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D8B467] text-[#111318] text-xs font-semibold hover:bg-[#E9CF90] transition-colors whitespace-nowrap"
            >
              <BookmarkPlus className="w-4 h-4" />
              保存故事快照
            </button>
          </div>
        </div>
      </section>

      {/* Sub-module Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-3">
        <div className="flex items-center gap-1 p-1 bg-[#141720] rounded-lg border border-white/8 overflow-x-auto">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                subTab === tab.id
                  ? 'bg-[#222736] text-[#FAF8F2]'
                  : 'text-[#9A9892] hover:text-[#ECE9E1]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="text-xs text-[#9A9892]">
          已收藏可用素材：<span className="font-mono-data text-[#FAF8F2]">{ownedCards.length}</span> 张
        </div>
      </div>

      {/* Main Split: Left 7-col Creative Modules + Right 5-col Dual Prompt Pack Exporter */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-7 space-y-6">
          {/* Validation Messages (Explicit text + icon, never hue-only) */}
          {validationIssues.length > 0 && (
            <div className="space-y-2">
              {validationIssues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-xs leading-relaxed ${
                    issue.level === 'warning'
                      ? 'bg-[#211C14] border-[#D8B467]/40 text-[#F2DFB4]'
                      : 'bg-[#141822] border-white/10 text-[#C6C2B8]'
                  }`}
                >
                  {issue.level === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-[#D8B467] shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 text-[#9A9892] shrink-0 mt-0.5" />
                  )}
                  <span>{issue.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* SUB-TAB 1: 编组拼装台 */}
          {subTab === 'assembler' && (
            <div className="space-y-6">
              {/* Step 1: Select Heroes */}
              <div className="rounded-xl bg-[#141720] border border-white/8 p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-editorial text-lg font-semibold text-[#FAF8F2]">
                      01. 挂载 Hero 人物主体
                    </h3>
                    <p className="text-xs text-[#9A9892]">
                      选中 1 名或多名已持有 Hero，随后为每位角色独立配置服装、道具与参考写真。
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onGoToShelf}
                    className="text-xs text-[#D8B467] hover:text-[#E9CF90] whitespace-nowrap"
                  >
                    去获取更多角色 →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.values(HERO_REGISTRY).map((hero) => {
                    const heroCard = ownedHeroCards.find((c) => c.bind_hero.includes(hero.id));
                    const active = assembly.heroLoadouts.some((s) => s.heroId === hero.id);

                    return (
                      <button
                        key={hero.id}
                        type="button"
                        disabled={!heroCard}
                        onClick={() => toggleHeroInAssembly(hero.id)}
                        className={`relative rounded-xl overflow-hidden border text-left transition-all ${
                          !heroCard
                            ? 'border-white/6 opacity-45 cursor-not-allowed'
                            : active
                              ? 'border-[#D8B467] ring-1 ring-[#D8B467]/50'
                              : 'border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="aspect-[4/3] bg-[#0D0F14] relative">
                          <img
                            src={hero.portrait}
                            alt={hero.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#12151E] via-transparent to-transparent" />
                        </div>
                        <div className="p-2.5 bg-[#12151E]">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-[#FAF8F2]">{hero.name}</span>
                            <span className="text-[10px] font-mono-data text-[#D8B467]">
                              {!heroCard ? '未持有' : active ? '已出场' : '点击挂载'}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#9A9892] truncate">{hero.series}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Per-Hero Loadout Controls */}
                {assembly.heroLoadouts.length > 0 && (
                  <div className="pt-4 border-t border-white/8 space-y-4">
                    {assembly.heroLoadouts.map((slot) => {
                      const reg = HERO_REGISTRY[slot.heroId];
                      const heroOutfits = ownedCards.filter(
                        (c) => c.card_type === 'outfit' && c.bind_hero.includes(slot.heroId)
                      );
                      const heroItems = ownedCards.filter(
                        (c) =>
                          c.card_type === 'item' &&
                          (c.bind_hero.length === 0 || c.bind_hero.includes(slot.heroId))
                      );
                      const heroPhotos = ownedCards.filter(
                        (c) => c.card_type === 'photo' && c.bind_hero.includes(slot.heroId)
                      );
                      const heroVoices = ownedCards.filter(
                        (c) => c.card_type === 'voice' && c.bind_hero.includes(slot.heroId)
                      );

                      return (
                        <div
                          key={slot.heroId}
                          className="rounded-xl bg-[#0F1219] border border-white/8 p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-[#FAF8F2]">
                              {reg?.name ?? slot.heroId}{' '}
                              <span className="text-xs font-normal text-[#9A9892]">
                                · 专属模组槽位（服装单选 / 道具可多挂）
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleHeroInAssembly(slot.heroId)}
                              className="text-xs text-[#9A9892] hover:text-[#FAF8F2]"
                            >
                              移出编组
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] text-[#9A9892] mb-1">
                                服装包（单选）
                              </label>
                              <select
                                value={slot.outfitCardId ?? ''}
                                onChange={(e) =>
                                  updateHeroSlot(slot.heroId, {
                                    outfitCardId: e.target.value || null,
                                  })
                                }
                                className="w-full px-2.5 py-2 rounded-lg bg-[#161A24] border border-white/10 text-xs text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                              >
                                <option value="">默认基础造型</option>
                                {heroOutfits.map((o) => (
                                  <option key={o.card_id} value={o.card_id}>
                                    {o.name}（{o.rarity}）
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] text-[#9A9892] mb-1">
                                写真光影参考（可选）
                              </label>
                              <select
                                value={slot.photoCardId ?? ''}
                                onChange={(e) =>
                                  updateHeroSlot(slot.heroId, {
                                    photoCardId: e.target.value || null,
                                  })
                                }
                                className="w-full px-2.5 py-2 rounded-lg bg-[#161A24] border border-white/10 text-xs text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                              >
                                <option value="">不指定参考写真</option>
                                {heroPhotos.map((p) => (
                                  <option key={p.card_id} value={p.card_id}>
                                    {p.name}（{p.rarity}）
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] text-[#9A9892] mb-1">
                                语音音色参考（扩展）
                              </label>
                              <select
                                value={slot.voiceCardId ?? ''}
                                onChange={(e) =>
                                  updateHeroSlot(slot.heroId, {
                                    voiceCardId: e.target.value || null,
                                  })
                                }
                                className="w-full px-2.5 py-2 rounded-lg bg-[#161A24] border border-white/10 text-xs text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                              >
                                <option value="">未挂载语音包</option>
                                {heroVoices.map((v) => (
                                  <option key={v.card_id} value={v.card_id}>
                                    {v.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Multi-mount Items */}
                          <div>
                            <div className="text-[11px] text-[#9A9892] mb-1.5">
                              道具包（专属 + 通用，可多件同时挂载）
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {heroItems.length === 0 ? (
                                <span className="text-xs text-[#787670]">
                                  暂无可用道具卡，可在货架开包收集
                                </span>
                              ) : (
                                heroItems.map((item) => {
                                  const mounted = slot.itemCardIds.includes(item.card_id);
                                  return (
                                    <button
                                      key={item.card_id}
                                      type="button"
                                      onClick={() => toggleHeroItem(slot.heroId, item.card_id)}
                                      className={`px-3 py-1.5 rounded-lg text-xs border transition-colors whitespace-nowrap ${
                                        mounted
                                          ? 'bg-[#D8B467]/20 border-[#D8B467] text-[#FAF8F2]'
                                          : 'bg-[#161A24] border-white/10 text-[#9A9892] hover:text-[#ECE9E1]'
                                      }`}
                                    >
                                      {mounted ? '✓ ' : '+ '}
                                      {item.name}
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Step 2: Relation, Motion, Scene & BGM */}
              <div className="rounded-xl bg-[#141720] border border-white/8 p-5 space-y-5">
                <div>
                  <h3 className="font-editorial text-lg font-semibold text-[#FAF8F2]">
                    02. 装配关系羁绊、姿态构图与场景氛围
                  </h3>
                  <p className="text-xs text-[#9A9892]">
                    关系包与多人动作会自动校验当前编组的角色数量与对应主体。
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#9A9892] mb-1.5">
                      关系包（本项目独创 · 羁绊模组）
                    </label>
                    <select
                      value={assembly.relationCardId ?? ''}
                      onChange={(e) =>
                        onChangeAssembly({
                          ...assembly,
                          relationCardId: e.target.value || null,
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-lg bg-[#0D0F14] border border-white/10 text-xs text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                    >
                      <option value="">不启用关系包</option>
                      {ownedRelations.map((r) => (
                        <option key={r.card_id} value={r.card_id}>
                          [{r.rarity}] {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-[#9A9892] mb-1.5">
                      动作包（姿态与镜头构图）
                    </label>
                    <select
                      value={assembly.motionCardId ?? ''}
                      onChange={(e) =>
                        onChangeAssembly({
                          ...assembly,
                          motionCardId: e.target.value || null,
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-lg bg-[#0D0F14] border border-white/10 text-xs text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                    >
                      <option value="">默认自然站姿</option>
                      {ownedMotions.map((m) => (
                        <option key={m.card_id} value={m.card_id}>
                          [{m.motion_seats ?? 1}人·{m.rarity}] {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-[#9A9892] mb-1.5">
                      场景包（全局环境与光影）
                    </label>
                    <select
                      value={assembly.sceneCardId ?? ''}
                      onChange={(e) =>
                        onChangeAssembly({
                          ...assembly,
                          sceneCardId: e.target.value || null,
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-lg bg-[#0D0F14] border border-white/10 text-xs text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                    >
                      <option value="">未选择场景</option>
                      {ownedScenes.map((s) => (
                        <option key={s.card_id} value={s.card_id}>
                          [{s.rarity}] {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-[#9A9892] mb-1.5">
                      BGM 氛围包（扩展听觉情绪）
                    </label>
                    <select
                      value={assembly.bgmCardId ?? ''}
                      onChange={(e) =>
                        onChangeAssembly({
                          ...assembly,
                          bgmCardId: e.target.value || null,
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-lg bg-[#0D0F14] border border-white/10 text-xs text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                    >
                      <option value="">未挂载听觉氛围</option>
                      {ownedBgms.map((b) => (
                        <option key={b.card_id} value={b.card_id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 2: 角色档案 */}
          {subTab === 'dossier' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                {Object.values(HERO_REGISTRY).map((h) => {
                  const ownedHero = ownedHeroCards.some((c) => c.bind_hero.includes(h.id));
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setDossierHeroId(h.id)}
                      className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                        dossierHeroId === h.id
                          ? 'bg-[#D8B467] text-[#111318] border-[#D8B467]'
                          : 'bg-[#141720] border-white/10 text-[#C6C2B8] hover:text-[#FAF8F2]'
                      }`}
                    >
                      {h.name} · {ownedHero ? '已入库' : '未持有本体'}
                    </button>
                  );
                })}
              </div>

              {(() => {
                const heroCardsAll = catalog.filter(
                  (c) => c.bind_hero.includes(dossierHeroId) || c.relation_targets.includes(dossierHeroId)
                );
                const heroOwned = heroCardsAll.filter((c) => ownedIds.has(c.card_id));
                const reg = HERO_REGISTRY[dossierHeroId];
                const mainCard = heroCardsAll.find((c) => c.card_type === 'hero');

                return (
                  <div className="rounded-xl bg-[#141720] border border-white/8 p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                      <img
                        src={reg.portrait}
                        alt={reg.name}
                        referrerPolicy="no-referrer"
                        className="w-24 h-32 rounded-xl object-cover object-top border border-white/10 shrink-0"
                      />
                      <div className="space-y-2">
                        <div className="text-xs text-[#D8B467]">
                          {reg.series} · 已收集相关模组 {heroOwned.length} / {heroCardsAll.length}
                        </div>
                        <h3 className="font-editorial text-2xl font-semibold text-[#FAF8F2]">
                          {reg.name} — {reg.title}
                        </h3>
                        <p className="text-xs leading-relaxed text-[#C6C2B8]">
                          {mainCard?.content.profile || mainCard?.content.summary}
                        </p>
                        {mainCard?.content.catchphrase && (
                          <p className="text-xs italic text-[#E9CF90]">
                            {mainCard.content.catchphrase}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/8">
                      {heroCardsAll.map((card) => (
                        <CardVisual
                          key={card.card_id}
                          card={card}
                          size="sm"
                          owned={ownedIds.has(card.card_id)}
                          onClick={() => onInspectCard(card)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SUB-TAB 3: 动作库 */}
          {subTab === 'motions' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1 p-1 bg-[#141720] rounded-lg border border-white/8">
                  {(
                    [
                      { v: 'all', l: '全部姿态' },
                      { v: 1, l: '单人动作' },
                      { v: 2, l: '双人动作' },
                      { v: 3, l: '多人 / 群像' },
                    ] as const
                  ).map((f) => (
                    <button
                      key={String(f.v)}
                      type="button"
                      onClick={() => setMotionSeatFilter(f.v)}
                      className={`px-3 py-1.5 rounded-md text-xs transition-colors whitespace-nowrap ${
                        motionSeatFilter === f.v
                          ? 'bg-[#222736] text-[#FAF8F2]'
                          : 'text-[#9A9892] hover:text-[#ECE9E1]'
                      }`}
                    >
                      {f.l}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-[#9A9892] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#D8B467]" />
                  当前编组已选 {assembly.heroLoadouts.length} 名 Hero
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {catalog
                  .filter((c) => c.card_type === 'motion')
                  .filter((c) =>
                    motionSeatFilter === 'all' ? true : (c.motion_seats ?? 1) === motionSeatFilter
                  )
                  .map((motion) => {
                    const isOwned = ownedIds.has(motion.card_id);
                    const seats = motion.motion_seats ?? 1;
                    const satisfied = assembly.heroLoadouts.length >= seats;
                    const active = assembly.motionCardId === motion.card_id;

                    return (
                      <div
                        key={motion.card_id}
                        className={`rounded-xl bg-[#141720] border p-4 flex gap-4 items-start ${
                          active ? 'border-[#D8B467]' : 'border-white/10'
                        }`}
                      >
                        <div className="w-24 shrink-0">
                          <CardVisual
                            card={motion}
                            size="sm"
                            owned={isOwned}
                            onClick={() => onInspectCard(motion)}
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="text-[11px] font-mono-data text-[#D8B467]">
                            需要 {seats} 名 Hero · {motion.rarity}
                          </div>
                          <h4 className="font-editorial text-base font-semibold text-[#FAF8F2]">
                            {motion.name}
                          </h4>
                          <p className="text-xs text-[#B6B2A8] leading-relaxed">
                            {motion.content.pose_camera || motion.content.summary}
                          </p>
                          <div className="pt-1 flex items-center gap-2">
                            {isOwned ? (
                              <button
                                type="button"
                                onClick={() =>
                                  onChangeAssembly({
                                    ...assembly,
                                    motionCardId: active ? null : motion.card_id,
                                  })
                                }
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                                  active
                                    ? 'bg-[#D8B467] text-[#111318]'
                                    : 'bg-[#1D2230] text-[#FAF8F2] hover:border-[#D8B467]/50 border border-white/10'
                                }`}
                              >
                                {active ? '已装配此姿态' : '装配此动作'}
                              </button>
                            ) : (
                              <span className="text-[11px] text-[#9A9892]">未收集</span>
                            )}
                            {!satisfied && (
                              <span className="text-[11px] text-[#E9CF90]">
                                需再添 {seats - assembly.heroLoadouts.length} 名角色
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* SUB-TAB 4: 剧本编辑器 */}
          {subTab === 'script' && (
            <div className="space-y-5">
              <div className="rounded-xl bg-[#141720] border border-white/8 p-5 space-y-4">
                <div>
                  <h3 className="font-editorial text-lg font-semibold text-[#FAF8F2]">
                    故事编排时间线（永久碎片可重复调用）
                  </h3>
                  <p className="text-xs text-[#9A9892]">
                    将已收集的剧情碎片排序拼接，并随时插入创作者自定义旁白，直接同步到右侧叙事 Prompt 包。
                  </p>
                </div>

                {/* Current Script Sequence */}
                {assembly.scriptBlocks.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-white/15 text-center text-xs text-[#9A9892]">
                    当前剧本为空。点击下方已收藏剧情碎片加入，或在下方输入自定义旁白。
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {assembly.scriptBlocks.map((block, idx) => {
                      const storyCard = block.cardId ? cardMap.get(block.cardId) : undefined;
                      return (
                        <div
                          key={block.id}
                          className="p-3.5 rounded-xl bg-[#0F1219] border border-white/8 flex items-start justify-between gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-mono-data text-[#D8B467]">
                              {String(idx + 1).padStart(2, '0')} ·{' '}
                              {block.kind === 'narration'
                                ? '创作者自定义旁白'
                                : storyCard?.story_kind === 'node'
                                  ? `时间线节点 · ${storyCard.node_phase}`
                                  : '常驻剧情片段'}
                            </div>
                            <div className="mt-1 text-sm font-medium text-[#FAF8F2]">
                              {block.kind === 'narration' ? block.text : storyCard?.name}
                            </div>
                            {storyCard && (
                              <p className="mt-1 text-xs text-[#9A9892] leading-relaxed">
                                {storyCard.content.summary}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              aria-label="上移"
                              onClick={() => moveScriptBlock(idx, -1)}
                              disabled={idx === 0}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9A9892] hover:text-[#FAF8F2] hover:bg-white/5 disabled:opacity-30"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              aria-label="下移"
                              onClick={() => moveScriptBlock(idx, 1)}
                              disabled={idx === assembly.scriptBlocks.length - 1}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9A9892] hover:text-[#FAF8F2] hover:bg-white/5 disabled:opacity-30"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              aria-label="移除"
                              onClick={() => removeScriptBlock(block.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9A9892] hover:text-rose-300 hover:bg-white/5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Insert Custom Narration */}
                <div className="pt-3 border-t border-white/8 flex gap-2">
                  <input
                    type="text"
                    value={narrationDraft}
                    onChange={(e) => setNarrationDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomNarration();
                      }
                    }}
                    placeholder="插入一句自定义旁白或转场描写，例如：雨势在午夜一点零三分骤然停歇……"
                    className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#0D0F14] border border-white/10 text-xs text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                  />
                  <button
                    type="button"
                    onClick={addCustomNarration}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#1D2230] border border-white/10 text-xs font-medium text-[#FAF8F2] hover:border-[#D8B467]/60 whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    插入旁白
                  </button>
                </div>
              </div>

              {/* Owned Story Cards Picker */}
              <div className="rounded-xl bg-[#141720] border border-white/8 p-5 space-y-3">
                <div className="text-xs font-semibold text-[#FAF8F2]">
                  已收藏剧情包（点击加入当前剧本）
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ownedStories.map((st) => (
                    <button
                      key={st.card_id}
                      type="button"
                      onClick={() => addStoryCardToScript(st.card_id)}
                      className="p-3.5 rounded-xl bg-[#0F1219] border border-white/8 hover:border-[#D8B467]/50 text-left transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#D8B467]">
                        <span>
                          {st.story_kind === 'node' ? `节点 · ${st.node_phase}` : '常驻片段'}
                        </span>
                        <span className="font-mono-data">{st.rarity}</span>
                      </div>
                      <div className="mt-1 text-sm font-medium text-[#FAF8F2]">{st.name}</div>
                      <p className="mt-1 text-xs text-[#9A9892] line-clamp-2">
                        {st.content.summary}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 5: 场景画廊 */}
          {subTab === 'scenes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {catalog
                .filter((c) => c.card_type === 'scene')
                .map((sc) => {
                  const isOwned = ownedIds.has(sc.card_id);
                  const active = assembly.sceneCardId === sc.card_id;
                  return (
                    <div
                      key={sc.card_id}
                      className={`rounded-xl overflow-hidden bg-[#141720] border transition-colors ${
                        active ? 'border-[#D8B467]' : 'border-white/10'
                      } ${!isOwned ? 'opacity-55' : ''}`}
                    >
                      <div className="relative aspect-[16/9] bg-[#0D0F14]">
                        {sc.artwork_url && (
                          <img
                            src={sc.artwork_url}
                            alt={sc.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141720] via-transparent to-black/30" />
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] text-[#FAF8F2]">
                          <span>{sc.series}</span>
                          <span className="font-mono-data text-[#E9CF90]">{sc.rarity}</span>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-editorial text-lg font-semibold text-[#FAF8F2]">
                          {sc.name}
                        </h4>
                        <p className="text-xs text-[#9A9892] leading-relaxed">
                          {sc.content.summary}
                        </p>
                        <div className="pt-2 flex items-center justify-between">
                          {isOwned ? (
                            <button
                              type="button"
                              onClick={() =>
                                onChangeAssembly({ ...assembly, sceneCardId: sc.card_id })
                              }
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                                active
                                  ? 'bg-[#D8B467] text-[#111318]'
                                  : 'bg-[#1D2230] text-[#FAF8F2] border border-white/10 hover:border-[#D8B467]/50'
                              }`}
                            >
                              {active ? '当前启用场景' : '切换至此场景'}
                            </button>
                          ) : (
                            <span className="text-xs text-[#9A9892]">待开包解锁</span>
                          )}
                          <button
                            type="button"
                            onClick={() => onInspectCard(sc)}
                            className="text-xs text-[#C6C2B8] hover:text-[#FAF8F2]"
                          >
                            查看设定
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Right Sticky Panel: Dual Prompt Pack Exporter (视觉 + 叙事共享同一份底层设定) */}
        <aside className="xl:col-span-5 xl:sticky xl:top-20 rounded-2xl bg-[#13161F] border border-white/10 overflow-hidden">
          <div className="p-5 border-b border-white/8 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-editorial text-xl font-semibold text-[#FAF8F2]">
                一键导出 · 双轨 Prompt 包
              </h3>
              <p className="text-xs text-[#9A9892] mt-0.5">
                画面与文字共享同一份底层卡牌设定，彼此严格自洽。
              </p>
            </div>
          </div>

          {/* Prompt Direction Switch */}
          <div className="px-5 pt-4 flex items-center gap-1">
            <div className="flex items-center gap-1 p-1 bg-[#0D0F14] rounded-lg w-full">
              <button
                type="button"
                onClick={() => setPromptTab('visual')}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  promptTab === 'visual'
                    ? 'bg-[#1F2433] text-[#FAF8F2]'
                    : 'text-[#9A9892] hover:text-[#ECE9E1]'
                }`}
              >
                视觉 Prompt 包（ComfyUI）
              </button>
              <button
                type="button"
                onClick={() => setPromptTab('narrative')}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  promptTab === 'narrative'
                    ? 'bg-[#1F2433] text-[#FAF8F2]'
                    : 'text-[#9A9892] hover:text-[#ECE9E1]'
                }`}
              >
                叙事 Prompt 包（LLM 续写）
              </button>
            </div>
          </div>

          {promptTab === 'visual' ? (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVisualMode('modular')}
                    className={`underline-offset-4 ${
                      visualMode === 'modular'
                        ? 'text-[#D8B467] underline font-medium'
                        : 'text-[#9A9892] hover:text-[#FAF8F2]'
                    }`}
                  >
                    分模块视图
                  </button>
                  <span className="text-[#5E5D58]">/</span>
                  <button
                    type="button"
                    onClick={() => setVisualMode('comfy')}
                    className={`underline-offset-4 ${
                      visualMode === 'comfy'
                        ? 'text-[#D8B467] underline font-medium'
                        : 'text-[#9A9892] hover:text-[#FAF8F2]'
                    }`}
                  >
                    ComfyUI JSON 载荷
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    copyText(
                      'visual',
                      visualMode === 'modular' ? visualPrompt.combined : visualPrompt.comfyPayload
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D8B467] text-[#111318] font-semibold hover:bg-[#E9CF90] transition-colors whitespace-nowrap"
                >
                  {copiedKey === 'visual' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      复制视觉 Prompt
                    </>
                  )}
                </button>
              </div>

              {visualMode === 'modular' ? (
                <div className="space-y-3 text-xs font-mono-data">
                  {[
                    { label: '角色外貌 Subject', value: visualPrompt.subject },
                    { label: '服装与道具 Outfit & Props', value: visualPrompt.outfitAndItems },
                    { label: '姿态与构图 Pose & Camera', value: visualPrompt.poseAndCamera },
                    { label: '场景与光影 Scene & Lighting', value: visualPrompt.sceneAndLighting },
                    { label: '风格锚点 Style Anchor', value: visualPrompt.styleAnchor },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="p-3 rounded-lg bg-[#0D0F14] border border-white/8"
                    >
                      <div className="text-[11px] text-[#D8B467] mb-1">{item.label}</div>
                      <div className="text-[#DCD8CE] leading-relaxed break-words">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <pre className="p-3.5 rounded-lg bg-[#0B0D12] border border-white/8 text-[11px] font-mono-data text-[#C6C2B8] overflow-x-auto max-h-[420px] leading-relaxed">
                  {visualPrompt.comfyPayload}
                </pre>
              )}
            </div>
          ) : (
            <div className="p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs">
                  {(
                    [
                      { id: 'chapter', label: '小说章回' },
                      { id: 'storyboard', label: '短片分镜' },
                      { id: 'social', label: '社媒图文' },
                    ] as const
                  ).map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() =>
                        onChangeAssembly({ ...assembly, narrativeFormat: fmt.id })
                      }
                      className={`px-2.5 py-1.5 rounded-md text-xs border transition-colors whitespace-nowrap ${
                        assembly.narrativeFormat === fmt.id
                          ? 'bg-[#D8B467]/20 border-[#D8B467] text-[#FAF8F2]'
                          : 'bg-[#0D0F14] border-white/10 text-[#9A9892] hover:text-[#ECE9E1]'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => copyText('narrative', narrativePrompt)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D8B467] text-[#111318] text-xs font-semibold hover:bg-[#E9CF90] transition-colors whitespace-nowrap"
                >
                  {copiedKey === 'narrative' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      复制叙事 Prompt
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-lg bg-[#0B0D12] border border-white/8 text-xs font-mono-data text-[#DCD8CE] whitespace-pre-wrap overflow-y-auto max-h-[440px] leading-relaxed">
                {narrativePrompt}
              </pre>
            </div>
          )}

          <div className="px-5 py-3.5 border-t border-white/8 bg-[#10131B] flex items-center justify-between text-[11px] text-[#9A9892]">
            <span className="inline-flex items-center gap-1.5">
              <FileCode2 className="w-3.5 h-3.5 text-[#D8B467]" />
              可直接投喂本地 ComfyUI 与 LLM Studio
            </span>
            <span className="inline-flex items-center gap-1">
              <Film className="w-3.5 h-3.5" />
              {CARD_TYPE_META.story.short}实时同步
            </span>
          </div>
        </aside>
      </div>

      {/* Save Story Snapshot Modal */}
      {snapshotOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSnapshotOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#141720] border border-white/10 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/8">
              <h3 className="font-editorial text-xl font-semibold text-[#FAF8F2]">
                保存故事快照
              </h3>
              <button
                type="button"
                onClick={() => setSnapshotOpen(false)}
                aria-label="关闭"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#9A9892] hover:text-[#FAF8F2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmSnapshot} className="mt-4 space-y-4">
              <p className="text-xs text-[#9A9892] leading-relaxed">
                记录当前的角色、服装、动作、关系、剧情与场景选择。三个月后想接着写下一章时，打开快照即可完整复现。
              </p>
              <div>
                <label className="block text-xs text-[#9A9892] mb-1.5">连载章节编号</label>
                <input
                  type="text"
                  value={snapChapter}
                  onChange={(e) => setSnapChapter(e.target.value)}
                  placeholder="例如：第一章 / 幕间 02"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0D0F14] border border-white/10 text-sm text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9A9892] mb-1.5">快照名称</label>
                <input
                  type="text"
                  value={snapTitle}
                  onChange={(e) => setSnapTitle(e.target.value)}
                  placeholder="例如：雨夜天台的初次共振"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0D0F14] border border-white/10 text-sm text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9A9892] mb-1.5">创作备注（可选）</label>
                <textarea
                  rows={3}
                  value={snapNote}
                  onChange={(e) => setSnapNote(e.target.value)}
                  placeholder="记录本场戏的伏笔、留白或待续写方向……"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0D0F14] border border-white/10 text-xs text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSnapshotOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-[#9A9892] hover:text-[#FAF8F2]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#D8B467] text-[#111318] text-xs font-semibold hover:bg-[#E9CF90] whitespace-nowrap"
                >
                  保存快照
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
