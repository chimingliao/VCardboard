import React, { useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Check,
  Copy,
  Download,
  FileText,
  FolderArchive,
  Layers,
  Printer,
  RotateCcw,
  Trash2,
  Unlock,
  Upload,
} from 'lucide-react';
import { CARD_TYPE_META, CARD_TYPE_ORDER } from '../data/catalog';
import { SavedCreation, StyleCard } from '../types/card';
import {
  buildObsidianVaultMarkdown,
  copyToClipboard,
  downloadTextFile,
} from '../utils/promptBuilder';

interface CreationsExportViewProps {
  catalog: StyleCard[];
  ownedIds: Set<string>;
  creations: SavedCreation[];
  onLoadCreation: (creation: SavedCreation) => void;
  onDeleteCreation: (id: string) => void;
  onUnlockAll: () => void;
  onResetProgress: () => void;
  onImportBackup: (jsonText: string) => { ok: boolean; message: string };
  onExportBackupJson: () => string;
  onGoToCombine: () => void;
}

const MEDIUM_LABEL: Record<string, string> = {
  photography: '写真摄影',
  illustration: '精品插画',
  animation: '电影动画',
};

export const CreationsExportView: React.FC<CreationsExportViewProps> = ({
  catalog,
  ownedIds,
  creations,
  onLoadCreation,
  onDeleteCreation,
  onUnlockAll,
  onResetProgress,
  onImportBackup,
  onExportBackupJson,
  onGoToCombine,
}) => {
  const [selectedMdIndex, setSelectedMdIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [importFeedback, setImportFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const ownedCards = useMemo(
    () => catalog.filter((c) => ownedIds.has(c.card_id)),
    [catalog, ownedIds]
  );

  const vaultFiles = useMemo(
    () => buildObsidianVaultMarkdown(ownedCards, creations),
    [ownedCards, creations]
  );

  const activeMdFile = vaultFiles[selectedMdIndex] || vaultFiles[0];

  const handleCopy = (key: string, text: string) => {
    void copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleDownloadAllMarkdown = () => {
    const combined = vaultFiles
      .map((f) => `<!-- FILE: ${f.filename} -->\n\n${f.content}`)
      .join('\n\n---\n\n');
    downloadTextFile(
      `mono-style-archive-vault-${new Date().toISOString().slice(0, 10)}.md`,
      combined,
      'text/markdown;charset=utf-8'
    );
  };

  const handleDownloadBackup = () => {
    downloadTextFile(
      `mono-style-archive-backup-${new Date().toISOString().slice(0, 10)}.json`,
      onExportBackupJson(),
      'application/json;charset=utf-8'
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const res = onImportBackup(text);
      setImportFeedback(res);
      setTimeout(() => setImportFeedback(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      setImportFeedback({
        ok: false,
        message: '当前预览环境限制打印弹窗，请使用 Markdown 或 JSON 导出。',
      });
    }
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(
        d.getMinutes()
      ).padStart(2, '0')}`;
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Saved Creations Gallery */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-xs tracking-[0.2em] uppercase text-[#E2BD75]">
              SAVED LOOKBOOKS & CREATIONS
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#FFFDF8]">
              作品与导出 · 已保存的角色视觉配方
            </h1>
            <p className="text-sm text-[#A9A6AF]">
              所有在「自由组合」中保存的新角色组合都将留存于此，支持随时载入二次精修，或打包导出为 Obsidian 知识库与可打印设定画册。
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToCombine}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E2BD75] text-[#0D0E14] text-xs font-semibold hover:bg-[#F3D99F] transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Layers className="w-4 h-4" />
            新建角色组合
          </button>
        </div>

        {creations.length === 0 ? (
          <div className="rounded-2xl bg-[#11131C] border border-white/10 p-12 text-center space-y-3">
            <div className="font-editorial text-lg text-[#FFFDF8]">
              尚未保存角色组合作品
            </div>
            <p className="text-xs text-[#9E9BA3]">
              前往「自由组合」选好角色、服装、发型与场景卡后，点击「保存组合作品」即可沉淀你的视觉企划。
            </p>
            <button
              type="button"
              onClick={onGoToCombine}
              className="mt-2 px-4 py-2 rounded-lg bg-[#E2BD75] text-xs font-semibold text-[#0D0E14] hover:bg-[#F3D99F]"
            >
              前往自由组合台
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {creations.map((item) => {
              const slotCount = CARD_TYPE_ORDER.reduce((acc, t) => {
                const key = `${t}Id` as keyof typeof item.recipe;
                return acc + (item.recipe[key] ? 1 : 0);
              }, 0);

              return (
                <article
                  key={item.id}
                  className="rounded-2xl bg-[#11131C] border border-white/10 overflow-hidden flex flex-col hover:border-[#E2BD75]/45 transition-colors"
                >
                  <div className="relative aspect-[4/3] bg-[#0B0C11] overflow-hidden">
                    <img
                      src={item.preview_url}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C11] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-black/65 backdrop-blur-sm text-[#F3D99F]">
                        {MEDIUM_LABEL[item.recipe.medium] || item.recipe.medium}
                      </span>
                      <span className="font-mono-data px-2 py-0.5 rounded bg-black/65 backdrop-blur-sm text-[#D8D4CC] tabular-nums">
                        {slotCount}/8 卡槽
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      <h3 className="font-editorial text-lg font-semibold text-[#FFFDF8] line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#B8B4BD] line-clamp-2 leading-relaxed">
                        {item.summary_line}
                      </p>
                      <div className="font-mono-data text-[11px] text-[#7E7B86] pt-1">
                        保存于 {formatDate(item.created_at)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-white/8">
                      <button
                        type="button"
                        onClick={() => onLoadCreation(item)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#E2BD75]/15 border border-[#E2BD75]/45 text-xs font-medium text-[#F3D99F] hover:bg-[#E2BD75]/25 transition-colors whitespace-nowrap"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        载入回自由组合
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteCreation(item.id)}
                        className="p-2 rounded-lg bg-[#0B0C11] border border-white/10 text-[#8F8C96] hover:text-[#F4A6A6] hover:border-[#F4A6A6]/40 transition-colors"
                        title="删除此作品"
                        aria-label="删除此作品"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Section 2: Obsidian Vault Markdown Export & Preview */}
      <section className="rounded-2xl bg-[#11131C] border border-white/10 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-white/8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs text-[#E2BD75]">
              <BookOpen className="w-4 h-4" />
              <span>Obsidian / Markdown 双向链接知识库导出</span>
            </div>
            <h2 className="font-editorial text-xl font-semibold text-[#FFFDF8]">
              个人角色素材库 Vault 归档
            </h2>
            <p className="text-xs text-[#9E9BA3]">
              已收录 {ownedCards.length} 张素材卡与 {creations.length} 套角色组合，自动生成含 YAML Frontmatter 与双向链接的标准 Markdown 笔记。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {activeMdFile && (
              <button
                type="button"
                onClick={() => handleCopy('md', activeMdFile.content)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1A1D2B] border border-white/12 text-xs text-[#F1EEE8] hover:border-[#E2BD75]/50 whitespace-nowrap"
              >
                {copiedKey === 'md' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#E2BD75]" />
                    已复制当前笔记
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    复制当前笔记
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={handleDownloadAllMarkdown}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E2BD75] text-[#0D0E14] text-xs font-semibold hover:bg-[#F3D99F] whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              导出完整 Markdown 合集
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/8 max-h-[340px] overflow-y-auto p-3 space-y-1 bg-[#0C0E15]">
            {vaultFiles.map((file, idx) => (
              <button
                key={file.filename}
                type="button"
                onClick={() => setSelectedMdIndex(idx)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-mono-data transition-colors ${
                  idx === selectedMdIndex
                    ? 'bg-[#1D2132] text-[#F3D99F]'
                    : 'text-[#A9A6AF] hover:bg-white/5 hover:text-[#FFFDF8]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0 opacity-75" />
                <span className="truncate">{file.filename}</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 p-4 sm:p-5 bg-[#090A0F]">
            {activeMdFile ? (
              <pre className="text-xs font-mono-data text-[#DCD8CE] whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                {activeMdFile.content}
              </pre>
            ) : (
              <div className="text-xs text-[#8F8C96] py-12 text-center">
                暂无可预览的笔记内容。
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 3: Local Backup, Print Lookbook & Archive Utilities */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 print:hidden">
        {/* Backup & Print */}
        <div className="rounded-2xl bg-[#11131C] border border-white/10 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#E2BD75]">
            <FolderArchive className="w-4 h-4" />
            <span>本地档案备份与画册打印</span>
          </div>
          <p className="text-xs text-[#A9A6AF] leading-relaxed">
            所有已抽卡牌、自制扩展卡与保存的组合配方均保存在当前浏览器本地。你可以随时导出 JSON 备份文件用于换机恢复，或直接打印本页画册。
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1B1F2E] border border-white/12 text-xs text-[#FFFDF8] hover:border-[#E2BD75]/50 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-[#E2BD75]" />
              导出 JSON 备份
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1B1F2E] border border-white/12 text-xs text-[#FFFDF8] hover:border-[#E2BD75]/50 whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5 text-[#E2BD75]" />
              导入恢复备份
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1B1F2E] border border-white/12 text-xs text-[#FFFDF8] hover:border-[#E2BD75]/50 whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5 text-[#E2BD75]" />
              打印角色设定集
            </button>
          </div>

          {importFeedback && (
            <div
              className={`text-xs px-3 py-2 rounded-lg border ${
                importFeedback.ok
                  ? 'bg-[#E2BD75]/10 border-[#E2BD75]/40 text-[#F3D99F]'
                  : 'bg-[#F4A6A6]/10 border-[#F4A6A6]/40 text-[#F4A6A6]'
              }`}
            >
              {importFeedback.message}
            </div>
          )}
        </div>

        {/* Sandbox / Creator Fast Controls */}
        <div className="rounded-2xl bg-[#11131C] border border-white/10 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#E2BD75]">
            <Unlock className="w-4 h-4" />
            <span>创作者快速体验工具</span>
          </div>
          <p className="text-xs text-[#A9A6AF] leading-relaxed">
            想直接浏览并混搭全部 6 大主题卡包与 8 大分类素材，无需逐包抽取？可一键解锁全素材库，或随时重置回初始新手卡包状态。
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={onUnlockAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E2BD75]/18 border border-[#E2BD75]/50 text-xs font-medium text-[#F3D99F] hover:bg-[#E2BD75]/28 whitespace-nowrap"
            >
              <Unlock className="w-3.5 h-3.5" />
              一键解锁全素材库体验
            </button>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0C0E15] border border-white/10 text-xs text-[#A9A6AF] hover:text-[#F4A6A6] hover:border-[#F4A6A6]/40 whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                重置为初始素材包
              </button>
            ) : (
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onResetProgress();
                    setConfirmReset(false);
                  }}
                  className="px-3 py-2 rounded-lg bg-[#8E3232] text-xs font-medium text-white hover:bg-[#A63A3A] whitespace-nowrap"
                >
                  确认重置
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-2 rounded-lg bg-[#1B1F2E] text-xs text-[#B8B4BD] whitespace-nowrap"
                >
                  取消
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Print-Only Summary Roster */}
      <section className="hidden print:block pt-6 border-t border-gray-300 space-y-4">
        <h2 className="text-xl font-bold">MONO Style Archive · 已收录素材清单</h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {ownedCards.map((c) => (
            <div key={c.card_id} className="p-2 border border-gray-300 rounded">
              <div className="font-semibold">
                [{c.rarity}] {c.name}（{CARD_TYPE_META[c.card_type].label}）
              </div>
              <div className="text-gray-600 mt-0.5">{c.description}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
