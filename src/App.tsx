import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import {
  BOOSTER_PACKS,
  HERO_REGISTRY,
  INITIAL_CATALOG,
  STARTER_CARD_IDS,
} from './data/catalog';
import {
  AppSection,
  NarrativeCard,
  StorySnapshot,
  WorkbenchAssembly,
} from './types/card';
import { AtlasView } from './components/AtlasView';
import { CardDetailModal } from './components/CardDetailModal';
import { CustomCardModal } from './components/CustomCardModal';
import { PackShelfView } from './components/PackShelfView';
import { SnapshotsExportView } from './components/SnapshotsExportView';
import { WorkbenchView } from './components/WorkbenchView';

const STORAGE_KEY = 'loredeck_local_state_v1';

const DEFAULT_ASSEMBLY: WorkbenchAssembly = {
  title: '雨夜天台的试音时刻',
  heroLoadouts: [
    {
      heroId: 'mili',
      outfitCardId: 'outfit_mili_lavender_r',
      itemCardIds: ['item_transparent_umbrella_c'],
      photoCardId: null,
      voiceCardId: null,
    },
  ],
  motionCardId: 'motion_solo_railing_c',
  relationCardId: null,
  sceneCardId: 'scene_stardust_rooftop_r',
  bgmCardId: null,
  scriptBlocks: [
    {
      id: 'starter_blk_1',
      kind: 'card',
      cardId: 'story_mili_monologue_u',
    },
  ],
  narrativeFormat: 'chapter',
};

const DEFAULT_SNAPSHOTS: StorySnapshot[] = [
  {
    id: 'snap_starter_01',
    title: '雨夜天台的试音时刻',
    chapter_label: '序幕 01',
    note: '蜜梨独自在雨夜露台哼唱的初始设定，等待抽到苍渊与「跨频共振」关系包后展开第二幕。',
    saved_at: '2026-11-19T10:00:00.000Z',
    assembly: DEFAULT_ASSEMBLY,
  },
];

interface PersistedState {
  ownedIds: string[];
  customCards: NarrativeCard[];
  assembly: WorkbenchAssembly;
  snapshots: StorySnapshot[];
}

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ownedIds: Array.isArray(parsed.ownedIds) ? parsed.ownedIds : STARTER_CARD_IDS,
        customCards: Array.isArray(parsed.customCards) ? parsed.customCards : [],
        assembly: parsed.assembly || DEFAULT_ASSEMBLY,
        snapshots: Array.isArray(parsed.snapshots) ? parsed.snapshots : DEFAULT_SNAPSHOTS,
      };
    }
  } catch {
    // Fallback to clean starter state
  }
  return {
    ownedIds: STARTER_CARD_IDS,
    customCards: [],
    assembly: DEFAULT_ASSEMBLY,
    snapshots: DEFAULT_SNAPSHOTS,
  };
}

export default function App() {
  const initial = useMemo(() => loadInitialState(), []);
  const [section, setSection] = useState<AppSection>('shelf');
  const [ownedIdsList, setOwnedIdsList] = useState<string[]>(initial.ownedIds);
  const [customCards, setCustomCards] = useState<NarrativeCard[]>(initial.customCards);
  const [assembly, setAssembly] = useState<WorkbenchAssembly>(initial.assembly);
  const [snapshots, setSnapshots] = useState<StorySnapshot[]>(initial.snapshots);
  const [inspectCard, setInspectCard] = useState<NarrativeCard | null>(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const catalog = useMemo(
    () => [...INITIAL_CATALOG, ...customCards],
    [customCards]
  );

  const ownedIds = useMemo(() => new Set(ownedIdsList), [ownedIdsList]);

  useEffect(() => {
    try {
      const state: PersistedState = {
        ownedIds: ownedIdsList,
        customCards,
        assembly,
        snapshots,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota issues gracefully
    }
  }, [ownedIdsList, customCards, assembly, snapshots]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 3400);
  };

  /** Checks series milestones and automatically grants hidden narrative cards (new content, never stats) */
  const applyMilestoneUnlocks = (nextOwnedSet: Set<string>): string[] => {
    const newlyUnlockedHidden: string[] = [];
    const seen = new Set<string>();

    BOOSTER_PACKS.forEach((pack) => {
      if (seen.has(pack.series_id) || !pack.hidden_reward_card_id) return;
      seen.add(pack.series_id);
      if (nextOwnedSet.has(pack.hidden_reward_card_id)) return;

      const seriesRegular = catalog.filter(
        (c) => c.series_id === pack.series_id && !c.hidden_unlock
      );
      const count = seriesRegular.filter((c) => nextOwnedSet.has(c.card_id)).length;
      const threshold = Math.min(pack.milestone_threshold, seriesRegular.length);
      if (count >= threshold) {
        nextOwnedSet.add(pack.hidden_reward_card_id);
        const hiddenCard = catalog.find((c) => c.card_id === pack.hidden_reward_card_id);
        if (hiddenCard) newlyUnlockedHidden.push(hiddenCard.name);
      }
    });

    return newlyUnlockedHidden;
  };

  const handleCardsAcquired = (cards: NarrativeCard[]) => {
    const next = new Set(ownedIdsList);
    let newlyAdded = 0;
    cards.forEach((c) => {
      if (!next.has(c.card_id)) {
        next.add(c.card_id);
        newlyAdded += 1;
      }
    });

    const unlockedHidden = applyMilestoneUnlocks(next);
    setOwnedIdsList(Array.from(next));

    if (unlockedHidden.length > 0) {
      showToast(`达成系列补全里程碑！已解锁隐藏内容：${unlockedHidden.join('、')}`);
    } else if (newlyAdded > 0) {
      showToast(`宇宙新补全 +${newlyAdded} 个模块，已永久入库`);
    }
  };

  const mountCardIntoAssembly = (
    base: WorkbenchAssembly,
    card: NarrativeCard
  ): WorkbenchAssembly => {
    const next: WorkbenchAssembly = {
      ...base,
      heroLoadouts: base.heroLoadouts.map((h) => ({
        ...h,
        itemCardIds: [...h.itemCardIds],
      })),
      scriptBlocks: [...base.scriptBlocks],
    };

    const ensureHeroSlot = (heroId: string) => {
      if (!HERO_REGISTRY[heroId]) return;
      const hasHeroCard = catalog.some(
        (c) => c.card_type === 'hero' && c.bind_hero.includes(heroId) && ownedIds.has(c.card_id)
      );
      if (!hasHeroCard) return;
      if (!next.heroLoadouts.some((s) => s.heroId === heroId)) {
        next.heroLoadouts.push({
          heroId,
          outfitCardId: null,
          itemCardIds: [],
          photoCardId: null,
          voiceCardId: null,
        });
      }
    };

    switch (card.card_type) {
      case 'hero':
        card.bind_hero.forEach((hid) => {
          if (!next.heroLoadouts.some((s) => s.heroId === hid)) {
            next.heroLoadouts.push({
              heroId: hid,
              outfitCardId: null,
              itemCardIds: [],
              photoCardId: null,
              voiceCardId: null,
            });
          }
        });
        break;
      case 'outfit': {
        const targetHero = card.bind_hero[0];
        if (targetHero) {
          ensureHeroSlot(targetHero);
          next.heroLoadouts = next.heroLoadouts.map((s) =>
            s.heroId === targetHero ? { ...s, outfitCardId: card.card_id } : s
          );
        }
        break;
      }
      case 'photo': {
        const targetHero = card.bind_hero[0];
        if (targetHero) {
          ensureHeroSlot(targetHero);
          next.heroLoadouts = next.heroLoadouts.map((s) =>
            s.heroId === targetHero ? { ...s, photoCardId: card.card_id } : s
          );
        }
        break;
      }
      case 'voice': {
        const targetHero = card.bind_hero[0];
        if (targetHero) {
          ensureHeroSlot(targetHero);
          next.heroLoadouts = next.heroLoadouts.map((s) =>
            s.heroId === targetHero ? { ...s, voiceCardId: card.card_id } : s
          );
        }
        break;
      }
      case 'item': {
        const targetHero = card.bind_hero[0] || next.heroLoadouts[0]?.heroId;
        if (targetHero) {
          ensureHeroSlot(targetHero);
          next.heroLoadouts = next.heroLoadouts.map((s) =>
            s.heroId === targetHero && !s.itemCardIds.includes(card.card_id)
              ? { ...s, itemCardIds: [...s.itemCardIds, card.card_id] }
              : s
          );
        }
        break;
      }
      case 'motion':
        next.motionCardId = card.card_id;
        break;
      case 'scene':
        next.sceneCardId = card.card_id;
        break;
      case 'bgm':
        next.bgmCardId = card.card_id;
        break;
      case 'relation':
        card.relation_targets.forEach(ensureHeroSlot);
        next.relationCardId = card.card_id;
        next.title = card.name;
        break;
      case 'story':
        if (!next.scriptBlocks.some((b) => b.cardId === card.card_id)) {
          next.scriptBlocks.push({
            id: `blk_${card.card_id}_${Date.now().toString(36)}`,
            kind: 'card',
            cardId: card.card_id,
          });
        }
        break;
    }

    return next;
  };

  const handleMountSingleCard = (card: NarrativeCard) => {
    setAssembly((prev) => mountCardIntoAssembly(prev, card));
    setSection('workbench');
    showToast(`已将「${card.name}」装配至叙事工作台`);
  };

  const handleSendPackCardsToWorkbench = (cards: NarrativeCard[]) => {
    setAssembly((prev) => {
      let current = prev;
      cards.forEach((c) => {
        current = mountCardIntoAssembly(current, c);
      });
      return current;
    });
    setSection('workbench');
    showToast('已将本次开包素材自动拼装至工作台，可直接查看双轨 Prompt');
  };

  const handleSaveSnapshot = (title: string, chapterLabel: string, note: string) => {
    const snap: StorySnapshot = {
      id: `snap_${Date.now().toString(36)}`,
      title,
      chapter_label: chapterLabel,
      note,
      saved_at: new Date().toISOString(),
      assembly: JSON.parse(JSON.stringify(assembly)),
    };
    setSnapshots((prev) => [snap, ...prev]);
    showToast(`故事快照「${title}」已保存`);
  };

  const handleLoadSnapshot = (snap: StorySnapshot) => {
    setAssembly(JSON.parse(JSON.stringify(snap.assembly)));
    setSection('workbench');
    showToast(`已复现故事快照「${snap.title}」，可接着续写`);
  };

  const handleCreateCustomCard = (card: NarrativeCard) => {
    setCustomCards((prev) => [...prev, card]);
    setOwnedIdsList((prev) => Array.from(new Set([...prev, card.card_id])));
    showToast(`自制卡牌「${card.name}」已永久入库`);
  };

  const handleImportBackup = (jsonText: string): { ok: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed.owned_card_ids)) {
        return { ok: false, message: '存档文件格式无效，缺少 owned_card_ids 字段。' };
      }
      setOwnedIdsList(parsed.owned_card_ids);
      if (Array.isArray(parsed.custom_cards)) setCustomCards(parsed.custom_cards);
      if (Array.isArray(parsed.snapshots)) setSnapshots(parsed.snapshots);
      return {
        ok: true,
        message: `已成功恢复本地存档：${parsed.owned_card_ids.length} 枚收藏卡牌与 ${parsed.snapshots?.length ?? 0} 份故事快照。`,
      };
    } catch {
      return { ok: false, message: 'JSON 解析失败，请确认导入的是有效的织界卡匣备份文件。' };
    }
  };

  const NAV_ITEMS: { id: AppSection; label: string }[] = [
    { id: 'shelf', label: '卡包货架' },
    { id: 'workbench', label: '叙事工作台' },
    { id: 'atlas', label: '图鉴与图谱' },
    { id: 'snapshots', label: '快照与导出' },
  ];

  return (
    <div className="min-h-screen bg-[#0D0F14] text-[#ECE9E1] flex flex-col">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="no-print sticky top-0 z-40 bg-[#0D0F14]/92 backdrop-blur-md border-b border-white/8">
        <div className="max-w-[1360px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => setSection('shelf')}
            className="font-editorial text-xl font-semibold tracking-wide text-[#FAF8F2] hover:text-[#E9CF90] transition-colors whitespace-nowrap shrink-0"
          >
            织界卡匣
          </button>

          {/* Zone 2: 4 Clean Single-Line Nav Links */}
          <nav
            aria-label="主导航"
            className="flex items-center gap-6 md:gap-8 overflow-x-auto"
          >
            {NAV_ITEMS.map((item) => {
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={`relative py-1 text-sm transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'text-[#FAF8F2] font-medium'
                      : 'text-[#9A9892] hover:text-[#ECE9E1]'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-[21px] h-[2px] bg-[#D8B467]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setCustomModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D8B467] text-[#111318] text-xs font-semibold hover:bg-[#E9CF90] transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              自制卡牌
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container (Desktop 1360px atelier presence) */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-6 py-8 md:py-10">
        {section === 'shelf' && (
          <PackShelfView
            catalog={catalog}
            ownedIds={ownedIds}
            onCardsAcquired={handleCardsAcquired}
            onInspectCard={(card) => setInspectCard(card)}
            onSendCardsToWorkbench={handleSendPackCardsToWorkbench}
          />
        )}

        {section === 'workbench' && (
          <WorkbenchView
            catalog={catalog}
            ownedIds={ownedIds}
            assembly={assembly}
            onChangeAssembly={setAssembly}
            onSaveSnapshot={handleSaveSnapshot}
            onInspectCard={(card) => setInspectCard(card)}
            onGoToShelf={() => setSection('shelf')}
          />
        )}

        {section === 'atlas' && (
          <AtlasView
            catalog={catalog}
            ownedIds={ownedIds}
            onInspectCard={(card) => setInspectCard(card)}
            onMountRelationPair={handleMountSingleCard}
            onGoToShelf={() => setSection('shelf')}
          />
        )}

        {section === 'snapshots' && (
          <SnapshotsExportView
            catalog={catalog}
            ownedIds={ownedIds}
            snapshots={snapshots}
            onLoadSnapshot={handleLoadSnapshot}
            onDeleteSnapshot={(id) =>
              setSnapshots((prev) => prev.filter((s) => s.id !== id))
            }
            onUnlockDemoAll={() => {
              setOwnedIdsList(catalog.map((c) => c.card_id));
              showToast('已解锁全图鉴全部模块，可前往工作台与羁绊图谱体验完整群像编组');
            }}
            onResetStarter={() => {
              setOwnedIdsList(STARTER_CARD_IDS);
              setAssembly(DEFAULT_ASSEMBLY);
              setSnapshots(DEFAULT_SNAPSHOTS);
              showToast('已重置为初始体验包');
            }}
            onImportBackup={handleImportBackup}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="no-print border-t border-white/8 mt-12">
        <div className="max-w-[1360px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#807E78]">
          <span>织界卡匣 · 以叙事积木为核心的虚拟角色素材卡包工作台</span>
          <span>无对战 · 无强度数值 · 收藏即创作资产</span>
        </div>
      </footer>

      {/* Card Detail Inspection Lightbox */}
      <CardDetailModal
        card={inspectCard}
        owned={inspectCard ? ownedIds.has(inspectCard.card_id) : false}
        onClose={() => setInspectCard(null)}
        onMountToWorkbench={handleMountSingleCard}
      />

      {/* Custom Card Authoring & JSON Import Modal */}
      <CustomCardModal
        open={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        onCreateCard={handleCreateCustomCard}
      />

      {/* Subtle Toast Feedback */}
      {toastMsg && (
        <div className="no-print fixed bottom-6 right-6 z-50 max-w-sm px-4 py-3 rounded-xl bg-[#191D28] border border-[#D8B467]/50 text-xs text-[#FAF8F2] shadow-xl">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
