import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Check,
  Copy,
  Download,
  FolderArchive,
  Play,
  Printer,
  RotateCcw,
  Trash2,
  Unlock,
  Upload,
} from 'lucide-react';
import { CARD_TYPE_META, HERO_REGISTRY } from '../data/catalog';
import { NarrativeCard, StorySnapshot } from '../types/card';
import {
  buildObsidianVaultMarkdown,
  copyToClipboard,
  downloadTextFile,
} from '../utils/promptBuilder';

interface SnapshotsExportViewProps {
  catalog: NarrativeCard[];
  ownedIds: Set<string>;
  snapshots: StorySnapshot[];
  onLoadSnapshot: (snapshot: StorySnapshot) => void;
  onDeleteSnapshot: (id: string) => void;
  onUnlockDemoAll: () => void;
  onResetStarter: () => void;
  onImportBackup: (jsonText: string) => { ok: boolean; message: string };
}

export const SnapshotsExportView: React.FC<SnapshotsExportViewProps> = ({
  catalog,
  ownedIds,
  snapshots,
  onLoadSnapshot,
  onDeleteSnapshot,
  onUnlockDemoAll,
  onResetStarter,
  onImportBackup,
}) => {
  const [selectedObsidianIdx, setSelectedObsidianIdx] = useState(0);
  const [copiedObsidian, setCopiedObsidian] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const ownedCards = useMemo(
    () => catalog.filter((c) => ownedIds.has(c.card_id)),
    [catalog, ownedIds]
  );

  const obsidianNotes = useMemo(
    () => buildObsidianVaultMarkdown(ownedCards, snapshots),
    [ownedCards, snapshots]
  );

  const activeNote = obsidianNotes[selectedObsidianIdx] || obsidianNotes[0];

  const handleDownloadAllObsidianMarkdown = () => {
    const combined = obsidianNotes
      .map(
        (n) =>
          `<!-- FILE: ${n.filename} -->\n\n${n.content}\n\n---\n`
      )
      .join('\n');
    downloadTextFile(
      `loredeck_obsidian_vault_${new Date().toISOString().slice(0, 10)}.md`,
      combined,
      'text/markdown;charset=utf-8'
    );
  };

  const handleExportLocalBackup = () => {
    const payload = JSON.stringify(
      {
        schema: 'loredeck_local_archive_v1',
        exported_at: new Date().toISOString(),
        owned_card_ids: Array.from(ownedIds),
        custom_cards: catalog.filter((c) => c.is_custom),
        snapshots,
      },
      null,
      2
    );
    downloadTextFile(
      `loredeck_backup_${new Date().toISOString().slice(0, 10)}.json`,
      payload,
      'application/json;charset=utf-8'
    );
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = onImportBackup(String(reader.result || ''));
      setImportStatus(result.message);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-white/8 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs text-[#D8B467]">
            图鉴的终点不是「看」，而是「接着写」与长期资产沉淀
          </div>
          <h1 className="mt-1 font-editorial text-3xl sm:text-4xl font-semibold text-[#FAF8F2]">
            故事快照与世界观资产导出
          </h1>
          <p className="mt-1.5 text-sm text-[#9A9892]">
            复现过往连载章节的完整卡牌编组，或将整座虚拟宇宙打包为 Obsidian 双向链接知识库与可印刷设定集。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportLocalBackup}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1A1E2A] border border-white/10 text-xs text-[#FAF8F2] hover:border-[#D8B467]/50 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            导出本地 JSON 存档
          </button>

          <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1A1E2A] border border-white/10 text-xs text-[#FAF8F2] hover:border-[#D8B467]/50 transition-colors cursor-pointer whitespace-nowrap">
            <Upload className="w-3.5 h-3.5" />
            恢复 JSON 存档
            <input
              type="file"
              accept="application/json"
              onChange={handleFileImport}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {importStatus && (
        <div className="p-3.5 rounded-xl bg-[#191E29] border border-[#D8B467]/40 text-xs text-[#E9CF90]">
          {importStatus}
        </div>
      )}

      {/* Section 1: Story Snapshots Serialization */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-editorial text-2xl font-semibold text-[#FAF8F2]">
              01. 故事快照连载册
            </h2>
            <p className="text-xs text-[#9A9892] mt-0.5">
              任意编组均可冻结为快照；数月后想续写下一章，点击即可完整复现当时的角色、服装、动作、关系与场景。
            </p>
          </div>
          <span className="font-mono-data text-xs text-[#9A9892]">
            共 {snapshots.length} 份快照
          </span>
        </div>

        {snapshots.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-sm text-[#9A9892]">
            尚未保存故事快照。前往「叙事工作台」完成一套拼装后，点击右上角「保存故事快照」即可记录章节节点。
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {snapshots.map((snap) => {
              const heroNames = snap.assembly.heroLoadouts
                .map((h) => HERO_REGISTRY[h.heroId]?.name ?? h.heroId)
                .join(' × ');
              return (
                <div
                  key={snap.id}
                  className="rounded-xl bg-[#141720] border border-white/10 p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#D8B467] font-medium">{snap.chapter_label}</span>
                      <span className="font-mono-data text-[#9A9892]">
                        {new Date(snap.saved_at).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <h3 className="font-editorial text-xl font-semibold text-[#FAF8F2]">
                      {snap.title}
                    </h3>
                    <div className="text-xs text-[#C6C2B8]">
                      出场角色：{heroNames || '空镜'} · 剧情块 {snap.assembly.scriptBlocks.length} 段
                    </div>
                    {snap.note && (
                      <p className="text-xs text-[#9A9892] leading-relaxed">{snap.note}</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/8 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onLoadSnapshot(snap)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D8B467] text-[#111318] text-xs font-semibold hover:bg-[#E9CF90] transition-colors whitespace-nowrap"
                    >
                      <Play className="w-3.5 h-3.5" />
                      复现至工作台续写
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSnapshot(snap.id)}
                      aria-label="删除快照"
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-[#9A9892] hover:text-rose-300 hover:bg-white/5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Section 2: Obsidian Vault Export */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-editorial text-2xl font-semibold text-[#FAF8F2]">
              02. Obsidian 双向链接知识库导出
            </h2>
            <p className="text-xs text-[#9A9892] mt-0.5">
              每张已收藏卡牌自动生成带 YAML Frontmatter 与 [[双向链接]] 的标准 Markdown 笔记，便于长期维护虚拟宇宙。
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadAllObsidianMarkdown}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D8B467] text-[#111318] text-xs font-semibold hover:bg-[#E9CF90] transition-colors whitespace-nowrap"
          >
            <FolderArchive className="w-4 h-4" />
            导出全套 Markdown 知识库（{obsidianNotes.length} 篇）
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 rounded-2xl bg-[#13161F] border border-white/10 overflow-hidden">
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/8 max-h-80 lg:max-h-[420px] overflow-y-auto p-3 space-y-1">
            {obsidianNotes.map((note, idx) => (
              <button
                key={note.filename}
                type="button"
                onClick={() => setSelectedObsidianIdx(idx)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono-data truncate transition-colors ${
                  idx === selectedObsidianIdx
                    ? 'bg-[#212636] text-[#E9CF90]'
                    : 'text-[#9A9892] hover:text-[#FAF8F2] hover:bg-white/4'
                }`}
              >
                {note.filename}
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 p-5 flex flex-col">
            {activeNote && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono-data text-xs text-[#D8B467]">
                    {activeNote.filename}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      void copyToClipboard(activeNote.content);
                      setCopiedObsidian(true);
                      setTimeout(() => setCopiedObsidian(false), 1800);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-[#C6C2B8] hover:text-[#FAF8F2]"
                  >
                    {copiedObsidian ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#D8B467]" />
                        已复制单篇
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        复制当前笔记
                      </>
                    )}
                  </button>
                </div>
                <pre className="flex-1 p-4 rounded-xl bg-[#0B0D12] border border-white/8 text-xs font-mono-data text-[#DCD8CE] whitespace-pre-wrap overflow-y-auto max-h-[340px] leading-relaxed">
                  {activeNote.content}
                </pre>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Section 3: Printable Setting Book & Demo Sandbox Controls */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-[#141720] border border-white/10 p-6 flex flex-col justify-between gap-4">
          <div>
            <h3 className="font-editorial text-xl font-semibold text-[#FAF8F2]">
              03. 设定集印刷排版视图（PDF 导出）
            </h3>
            <p className="mt-1.5 text-xs text-[#9A9892] leading-relaxed">
              将已收藏的角色档案、关系羁绊、场景氛围与编年史自动排版为适合打印或另存为 PDF 的虚拟 IP 设定集。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowPrintPreview((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1D2230] border border-white/10 text-xs text-[#FAF8F2] hover:border-[#D8B467]/50 whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5" />
              {showPrintPreview ? '收起设定集预览' : '预览设定集排版'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPrintPreview(true);
                setTimeout(() => {
                  try {
                    window.print();
                  } catch {
                    // Fallback: preview remains open for manual export
                  }
                }, 120);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D8B467] text-[#111318] text-xs font-semibold hover:bg-[#E9CF90] whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              打印 / 导出 PDF 设定集
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-[#141720] border border-white/10 p-6 flex flex-col justify-between gap-4">
          <div>
            <h3 className="font-editorial text-xl font-semibold text-[#FAF8F2]">
              04. 原型体验快捷控制（路线 A 本地存档）
            </h3>
            <p className="mt-1.5 text-xs text-[#9A9892] leading-relaxed">
              所有数据完全保存在本地浏览器存储中。你可以一键体验全图鉴满藏状态以测试群像编组，或随时重置回初始新手包。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onUnlockDemoAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1D2230] border border-white/10 text-xs text-[#E9CF90] hover:border-[#D8B467]/60 whitespace-nowrap"
            >
              <Unlock className="w-3.5 h-3.5" />
              一键解锁全图鉴体验
            </button>
            <button
              type="button"
              onClick={onResetStarter}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1D2230] border border-white/10 text-xs text-[#C6C2B8] hover:text-[#FAF8F2] whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              重置为初始体验包
            </button>
          </div>
        </div>
      </section>

      {/* Printable Monograph Preview */}
      {showPrintPreview && (
        <section className="rounded-2xl bg-[#FAF8F2] text-[#181B22] p-8 md:p-12 space-y-8 border border-white/15">
          <div className="border-b border-[#181B22]/15 pb-6">
            <div className="text-xs tracking-widest text-[#8C6E31]">
              LORE DECK ARCHIVE MONOGRAPH
            </div>
            <h2 className="mt-2 font-editorial text-3xl font-bold text-[#141720]">
              织界卡匣 · 虚拟宇宙设定集
            </h2>
            <div className="mt-2 text-xs text-[#575A63]">
              收录已解锁模块共 {ownedCards.length} 枚 · 故事快照 {snapshots.length} 份 · 导出日期{' '}
              {new Date().toLocaleDateString('zh-CN')}
            </div>
          </div>

          <div className="space-y-6">
            {ownedCards.map((c) => (
              <div
                key={c.card_id}
                className="pb-5 border-b border-[#181B22]/10 space-y-1.5 break-inside-avoid"
              >
                <div className="text-xs text-[#8C6E31]">
                  {CARD_TYPE_META[c.card_type].label} · {c.series} · 规格 {c.rarity}
                </div>
                <h3 className="font-editorial text-xl font-bold text-[#141720]">{c.name}</h3>
                <p className="text-sm leading-relaxed text-[#2C303A]">{c.content.summary}</p>
                {c.content.dialogue_or_excerpt && (
                  <p className="text-xs italic text-[#575A63]">{c.content.dialogue_or_excerpt}</p>
                )}
                <div className="text-[11px] font-mono-data text-[#6B707C]">
                  Visual Prompt: {c.prompt_hint.visual}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
