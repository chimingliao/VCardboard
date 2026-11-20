/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Diamond, Plus } from 'lucide-react';
import { CardDetailModal } from './components/CardDetailModal';
import { CombineStudioView } from './components/CombineStudioView';
import { CreationsExportView } from './components/CreationsExportView';
import { CustomCardModal } from './components/CustomCardModal';
import { LibraryAtlasView } from './components/LibraryAtlasView';
import { PackShelfView } from './components/PackShelfView';
import {
  DEFAULT_RECIPE,
  INITIAL_CATALOG,
  MONO_ASSETS,
  STARTER_CARD_IDS,
} from './data/catalog';
import {
  AppSection,
  CardType,
  CombineRecipe,
  SavedCreation,
  StyleCard,
} from './types/card';

const STORAGE_KEY = 'mono_style_archive_v2';

interface PersistedArchiveState {
  ownedIds: string[];
  customCards: StyleCard[];
  recipe: CombineRecipe;
  creations: SavedCreation[];
}

const STARTER_CREATIONS: SavedCreation[] = [
  {
    id: 'creation_starter_school_linxi',
    title: DEFAULT_RECIPE.title,
    created_at: '2026-04-12T10:30:00.000Z',
    recipe: DEFAULT_RECIPE,
    preview_url: MONO_ASSETS.resultSchoolLinxi,
    summary_line:
      '林溪 · 暖光暮色人像 · 樱粉学院西装制服 · 栗棕红丝带双麻花编发 · 樱花富士山湖畔晨景',
  },
];

const SLOT_FIELD_BY_TYPE: Record<CardType, keyof CombineRecipe> = {
  character: 'characterId',
  costume: 'costumeId',
  hairstyle: 'hairstyleId',
  makeup: 'makeupId',
  pose: 'poseId',
  scene: 'sceneId',
  prop: 'propId',
  effect: 'effectId',
};

function loadInitialState(): PersistedArchiveState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedArchiveState>;
      return {
        ownedIds:
          Array.isArray(parsed.ownedIds) && parsed.ownedIds.length > 0
            ? parsed.ownedIds
            : STARTER_CARD_IDS,
        customCards: Array.isArray(parsed.customCards) ? parsed.customCards : [],
        recipe:
          parsed.recipe && typeof parsed.recipe === 'object'
            ? { ...DEFAULT_RECIPE, ...parsed.recipe }
            : DEFAULT_RECIPE,
        creations: Array.isArray(parsed.creations)
          ? parsed.creations
          : STARTER_CREATIONS,
      };
    }
  } catch {
    // Fallback cleanly to starter archive state if storage is inaccessible or corrupted
  }
  return {
    ownedIds: STARTER_CARD_IDS,
    customCards: [],
    recipe: DEFAULT_RECIPE,
    creations: STARTER_CREATIONS,
  };
}

const NAV_ITEMS: { id: AppSection; label: string }[] = [
  { id: 'packs', label: '主题卡包' },
  { id: 'combine', label: '自由组合' },
  { id: 'library', label: '素材图鉴' },
  { id: 'creations', label: '作品与导出' },
];

export default function App() {
  const [section, setSection] = useState<AppSection>('packs');
  const [state, setState] = useState<PersistedArchiveState>(() => loadInitialState());
  const [inspectedCard, setInspectedCard] = useState<StyleCard | null>(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [libraryTypeJump, setLibraryTypeJump] = useState<CardType | 'all'>('all');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors in restricted iframe environments
    }
  }, [state]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const fullCatalog = useMemo<StyleCard[]>(
    () => [...state.customCards, ...INITIAL_CATALOG],
    [state.customCards]
  );

  const ownedSet = useMemo(() => new Set(state.ownedIds), [state.ownedIds]);

  const handleCardsAcquired = (cards: StyleCard[]) => {
    setState((prev) => {
      const nextOwned = new Set(prev.ownedIds);
      cards.forEach((c) => nextOwned.add(c.card_id));
      return { ...prev, ownedIds: Array.from(nextOwned) };
    });
  };

  const handleEquipCardsToCombine = (cards: StyleCard[]) => {
    setState((prev) => {
      const nextRecipe: CombineRecipe = { ...prev.recipe };
      const nextOwned = new Set(prev.ownedIds);
      cards.forEach((card) => {
        const field = SLOT_FIELD_BY_TYPE[card.card_type];
        (nextRecipe as unknown as Record<string, string | null>)[field] = card.card_id;
        nextOwned.add(card.card_id);
      });
      return {
        ...prev,
        ownedIds: Array.from(nextOwned),
        recipe: nextRecipe,
      };
    });
    setInspectedCard(null);
    setSection('combine');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (cards.length === 1) {
      showToast(`已将「${cards[0].name}」装入自由组合台`);
    } else if (cards.length > 1) {
      showToast(`已将 ${cards.length} 张抽中素材装入自由组合台`);
    }
  };

  const handleGoToCombine = (presetCards?: StyleCard[]) => {
    if (presetCards && presetCards.length > 0) {
      handleEquipCardsToCombine(presetCards);
      return;
    }
    setSection('combine');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterLibraryByType = (type: CardType) => {
    setLibraryTypeJump(type);
    setSection('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveCreation = (previewUrl: string, summaryLine: string) => {
    const newItem: SavedCreation = {
      id: `creation_${Date.now().toString(36)}`,
      title: state.recipe.title.trim() || '未命名角色组合',
      created_at: new Date().toISOString(),
      recipe: { ...state.recipe },
      preview_url: previewUrl,
      summary_line: summaryLine || '8 槽自由组合角色企划',
    };
    setState((prev) => ({
      ...prev,
      creations: [newItem, ...prev.creations],
    }));
    showToast(`已保存作品「${newItem.title}」至作品与导出`);
  };

  const handleLoadCreation = (creation: SavedCreation) => {
    setState((prev) => ({
      ...prev,
      recipe: { ...creation.recipe },
    }));
    setSection('combine');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`已载入作品「${creation.title}」`);
  };

  const handleDeleteCreation = (id: string) => {
    setState((prev) => ({
      ...prev,
      creations: prev.creations.filter((c) => c.id !== id),
    }));
    showToast('已删除该组合作品');
  };

  const handleCreateCustomCard = (card: StyleCard) => {
    setState((prev) => ({
      ...prev,
      customCards: [card, ...prev.customCards],
      ownedIds: Array.from(new Set([card.card_id, ...prev.ownedIds])),
    }));
    showToast(`自制素材卡「${card.name}」已收录至图鉴`);
  };

  const handleUnlockAll = () => {
    setState((prev) => ({
      ...prev,
      ownedIds: Array.from(new Set(fullCatalog.map((c) => c.card_id))),
    }));
    showToast(`已解锁全部 ${fullCatalog.length} 张创作素材卡`);
  };

  const handleResetProgress = () => {
    setState({
      ownedIds: STARTER_CARD_IDS,
      customCards: [],
      recipe: DEFAULT_RECIPE,
      creations: STARTER_CREATIONS,
    });
    showToast('已重置为初始素材包状态');
  };

  const handleExportBackupJson = () => {
    return JSON.stringify(
      {
        format: 'mono-style-archive-backup-v2',
        exported_at: new Date().toISOString(),
        data: state,
      },
      null,
      2
    );
  };

  const handleImportBackup = (jsonText: string): { ok: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonText);
      const data = parsed?.data ?? parsed;
      if (!data || !Array.isArray(data.ownedIds)) {
        return { ok: false, message: '备份文件格式不匹配，缺少 ownedIds 字段。' };
      }
      setState({
        ownedIds: data.ownedIds,
        customCards: Array.isArray(data.customCards) ? data.customCards : [],
        recipe:
          data.recipe && typeof data.recipe === 'object'
            ? { ...DEFAULT_RECIPE, ...data.recipe }
            : DEFAULT_RECIPE,
        creations: Array.isArray(data.creations) ? data.creations : STARTER_CREATIONS,
      });
      return {
        ok: true,
        message: `备份恢复成功，共恢复 ${data.ownedIds.length} 张素材收录记录。`,
      };
    } catch {
      return { ok: false, message: 'JSON 解析失败，请确认选择了有效的 MONO 备份文件。' };
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C11] text-[#F1EEE8] flex flex-col">
      {/* Strict 3-Zone Editorial Top Bar */}
      <header className="sticky top-0 z-40 h-16 bg-[#0B0C11]/88 backdrop-blur-md border-b border-white/8 print:hidden">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => setSection('packs')}
            className="inline-flex items-center gap-2.5 text-left shrink-0 whitespace-nowrap group"
          >
            <span className="w-7 h-7 rounded-md bg-gradient-to-br from-[#F3D99F] to-[#B88B44] flex items-center justify-center text-[#0B0C11] shadow-[0_0_16px_rgba(226,189,117,0.3)]">
              <Diamond className="w-4 h-4 fill-current" />
            </span>
            <span className="font-editorial text-lg font-semibold tracking-wide text-[#FFFDF8] group-hover:text-[#F3D99F] transition-colors">
              MONO Style Archive
            </span>
          </button>

          {/* Zone 2: Primary Navigation (4 Single-Line Links) */}
          <nav
            aria-label="主导航"
            className="hidden md:flex items-center gap-1"
          >
            {NAV_ITEMS.map((item) => {
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSection(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'text-[#FFFDF8]'
                      : 'text-[#9E9BA3] hover:text-[#F1EEE8]'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-4 -bottom-[17px] h-[2px] bg-[#E2BD75]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <button
            type="button"
            onClick={() => setCustomModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E2BD75] text-[#0D0E14] text-xs font-semibold hover:bg-[#F3D99F] transition-colors shrink-0 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            自制素材卡
          </button>
        </div>
      </header>

      {/* Mobile Compact Navigation Bar */}
      <nav
        aria-label="移动端导航"
        className="md:hidden sticky top-16 z-30 bg-[#0E1017]/95 backdrop-blur-md border-b border-white/8 px-3 py-2 flex items-center justify-between gap-1 overflow-x-auto print:hidden"
      >
        {NAV_ITEMS.map((item) => {
          const active = section === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSection(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-center whitespace-nowrap transition-colors ${
                active
                  ? 'bg-[#E2BD75]/18 text-[#F3D99F]'
                  : 'text-[#9E9BA3] hover:text-[#FFFDF8]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-7 sm:py-9">
        {section === 'packs' && (
          <PackShelfView
            catalog={fullCatalog}
            ownedIds={ownedSet}
            onCardsAcquired={handleCardsAcquired}
            onInspectCard={setInspectedCard}
            onGoToCombine={handleGoToCombine}
            onFilterLibraryByType={handleFilterLibraryByType}
            onGoToCreations={() => {
              setSection('creations');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {section === 'combine' && (
          <CombineStudioView
            catalog={fullCatalog}
            ownedIds={ownedSet}
            recipe={state.recipe}
            onChangeRecipe={(next) =>
              setState((prev) => ({ ...prev, recipe: next }))
            }
            onSaveCreation={handleSaveCreation}
            onInspectCard={setInspectedCard}
            onGoToPacks={() => {
              setSection('packs');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {section === 'library' && (
          <LibraryAtlasView
            catalog={fullCatalog}
            ownedIds={ownedSet}
            initialTypeFilter={libraryTypeJump}
            onClearInitialTypeFilter={() => setLibraryTypeJump('all')}
            onInspectCard={setInspectedCard}
            onGoToPacks={() => {
              setSection('packs');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCustomCard={() => setCustomModalOpen(true)}
          />
        )}

        {section === 'creations' && (
          <CreationsExportView
            catalog={fullCatalog}
            ownedIds={ownedSet}
            creations={state.creations}
            onLoadCreation={handleLoadCreation}
            onDeleteCreation={handleDeleteCreation}
            onUnlockAll={handleUnlockAll}
            onResetProgress={handleResetProgress}
            onImportBackup={handleImportBackup}
            onExportBackupJson={handleExportBackupJson}
            onGoToCombine={() => handleGoToCombine()}
          />
        )}
      </main>

      {/* Minimal Editorial Footer */}
      <footer className="border-t border-white/8 py-6 mt-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#7E7B86]">
          <span>MONO Style Archive · 角色创作的卡牌素材库</span>
          <span>抽卡收藏 · 自由组合 · 生成影像 · 制作内容 · 发布经营</span>
        </div>
      </footer>

      {/* Card Detail Inspection Modal */}
      <CardDetailModal
        card={inspectedCard}
        owned={inspectedCard ? ownedSet.has(inspectedCard.card_id) : false}
        onClose={() => setInspectedCard(null)}
        onEquipToCombine={(card) => handleEquipCardsToCombine([card])}
      />

      {/* Custom Card Creator Modal */}
      <CustomCardModal
        open={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        onCreateCard={handleCreateCustomCard}
      />

      {/* Subtle Toast Feedback */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#181B28]/95 border border-[#E2BD75]/55 text-xs text-[#FFFDF8] shadow-[0_12px_36px_rgba(0,0,0,0.65)] backdrop-blur-md whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  );
}
