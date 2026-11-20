import React, { useEffect, useState } from 'react';
import { Check, Code2, Copy, Layers, X } from 'lucide-react';
import { CARD_TYPE_META, HERO_REGISTRY, RARITY_META } from '../data/catalog';
import { NarrativeCard } from '../types/card';
import { CardVisual } from './CardVisual';

interface CardDetailModalProps {
  card: NarrativeCard | null;
  owned: boolean;
  onClose: () => void;
  onMountToWorkbench: (card: NarrativeCard) => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  owned,
  onClose,
  onMountToWorkbench,
}) => {
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!card) return null;

  const rarityInfo = RARITY_META[card.rarity];
  const typeInfo = CARD_TYPE_META[card.card_type];

  const cleanJson = JSON.stringify(
    {
      card_id: card.card_id,
      card_type: card.card_type,
      rarity: card.rarity,
      name: card.name,
      series: card.series,
      world_tags: card.world_tags,
      bind_hero: card.bind_hero,
      relation_targets: card.relation_targets,
      content: card.content,
      assets: card.assets,
      prompt_hint: card.prompt_hint,
      acquired_at: card.acquired_at ?? '未入库',
    },
    null,
    2
  );

  const handleCopyJson = () => {
    navigator.clipboard.writeText(cleanJson).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -py * 10, y: px * 12 });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#13161F] border border-white/10 p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭卡牌详情"
          className="absolute top-5 right-5 w-10 h-10 rounded-lg flex items-center justify-center text-[#9A9892] hover:text-[#ECE9E1] hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive 3D-tilt Collectible Card */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div
              className="w-full max-w-[300px] card-perspective"
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setTilt({ x: 0, y: 0 })}
            >
              <div
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transition: 'transform 160ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <CardVisual card={card} size="lg" owned={owned} />
              </div>
            </div>
            <div className="mt-4 text-center text-xs text-[#9A9892]">
              <span>{rarityInfo.name}</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span>{rarityInfo.spec}</span>
            </div>
          </div>

          {/* Right: Structured Content + Prompt Hint + JSON */}
          <div className="md:col-span-7 flex flex-col gap-6">
            <div>
              <div className="text-xs text-[#D8B467]">
                {typeInfo.label} · {card.series} · 规格 {card.rarity}（{rarityInfo.cnName}）
              </div>
              <h2 className="mt-1.5 font-editorial text-2xl md:text-3xl font-semibold text-[#FAF8F2]">
                {card.name}
              </h2>
              {card.subtitle && (
                <p className="mt-1 text-sm text-[#9A9892]">{card.subtitle}</p>
              )}
              <div className="mt-3 text-xs text-[#9A9892] flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>世界观标签：{card.world_tags.join(' / ')}</span>
                <span aria-hidden="true">·</span>
                <span>
                  绑定主体：
                  {card.bind_hero.length > 0
                    ? card.bind_hero.map((id) => HERO_REGISTRY[id]?.name ?? id).join('、')
                    : '全局可用'}
                </span>
              </div>
            </div>

            <div className="border-t border-white/8 pt-5 space-y-4">
              <div>
                <div className="text-xs font-medium text-[#9A9892] mb-1.5">
                  设定正文（给人阅读与故事创作）
                </div>
                <p className="text-sm leading-relaxed text-[#ECE9E1]">{card.content.summary}</p>
                {card.content.profile && (
                  <p className="mt-2 text-sm leading-relaxed text-[#C6C2B8]">{card.content.profile}</p>
                )}
                {card.content.appearance && (
                  <p className="mt-2 text-xs text-[#C6C2B8]">外貌特征：{card.content.appearance}</p>
                )}
                {card.content.outfit_detail && (
                  <p className="mt-2 text-xs text-[#C6C2B8]">细节工艺：{card.content.outfit_detail}</p>
                )}
                {card.content.item_note && (
                  <p className="mt-2 text-xs text-[#C6C2B8]">物件注记：{card.content.item_note}</p>
                )}
                {card.content.pose_camera && (
                  <p className="mt-2 text-xs text-[#C6C2B8]">镜头与构图：{card.content.pose_camera}</p>
                )}
                {card.content.scene_atmosphere && (
                  <p className="mt-2 text-xs text-[#C6C2B8]">环境氛围：{card.content.scene_atmosphere}</p>
                )}
                {card.content.tension_note && (
                  <p className="mt-2 text-xs text-[#D8B467]/90">羁绊张力：{card.content.tension_note}</p>
                )}
                {card.content.dialogue_or_excerpt && (
                  <blockquote className="mt-3 p-3.5 rounded-lg bg-[#1A1E29] border border-white/8 text-sm italic text-[#E9DFC9]">
                    {card.content.dialogue_or_excerpt}
                  </blockquote>
                )}
                {card.content.catchphrase && (
                  <p className="mt-2 text-xs text-[#E9CF90]">口头禅：{card.content.catchphrase}</p>
                )}
              </div>

              <div className="border-t border-white/8 pt-4">
                <div className="text-xs font-medium text-[#9A9892] mb-2">
                  结构化提示词容器（Prompt Hint · 供工作台自动拼装）
                </div>
                <div className="space-y-2 text-xs font-mono-data">
                  <div className="p-3 rounded-lg bg-[#0D0F14] border border-white/8">
                    <div className="text-[11px] text-[#9A9892] mb-1">visual</div>
                    <div className="text-[#ECE9E1] leading-relaxed">{card.prompt_hint.visual}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0D0F14] border border-white/8">
                    <div className="text-[11px] text-[#9A9892] mb-1">tone</div>
                    <div className="text-[#D8B467] leading-relaxed">{card.prompt_hint.tone}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/8 pt-4 text-xs text-[#9A9892]">
                挂载规则：{typeInfo.mountRule}
              </div>
            </div>

            {showJson && (
              <div className="rounded-lg bg-[#0B0D12] border border-white/10 p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono-data text-[#9A9892]">底层 JSON 条目</span>
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="inline-flex items-center gap-1.5 text-xs text-[#D8B467] hover:text-[#E9CF90] whitespace-nowrap"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? '已复制' : '复制 JSON'}
                  </button>
                </div>
                <pre className="text-[11px] font-mono-data text-[#C6C2B8] overflow-x-auto max-h-52 leading-relaxed">
                  {cleanJson}
                </pre>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {owned ? (
                <button
                  type="button"
                  onClick={() => {
                    onMountToWorkbench(card);
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D8B467] text-[#111318] text-sm font-semibold hover:bg-[#E9CF90] transition-colors whitespace-nowrap"
                >
                  <Layers className="w-4 h-4" />
                  装配至叙事工作台
                </button>
              ) : (
                <div className="text-xs text-[#D8B467]">
                  尚未收藏此卡 · 前往「卡包货架」开启「{card.series}」卡包获取
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowJson((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1B202C] border border-white/10 text-sm text-[#ECE9E1] hover:border-white/25 transition-colors whitespace-nowrap"
              >
                <Code2 className="w-4 h-4" />
                {showJson ? '收起 JSON 数据' : '查看底层 JSON'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
