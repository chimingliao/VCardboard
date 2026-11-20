import React, { useEffect, useState } from 'react';
import { Check, Code2, Copy, Layers, X } from 'lucide-react';
import { CARD_TYPE_META, RARITY_META } from '../data/catalog';
import { StyleCard } from '../types/card';
import { copyToClipboard } from '../utils/promptBuilder';
import { CardVisual } from './CardVisual';

interface CardDetailModalProps {
  card: StyleCard | null;
  owned: boolean;
  onClose: () => void;
  onEquipToCombine: (card: StyleCard) => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  owned,
  onClose,
  onEquipToCombine,
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

  const typeInfo = CARD_TYPE_META[card.card_type];
  const rarityInfo = RARITY_META[card.rarity];

  const cleanJson = JSON.stringify(
    {
      card_id: card.card_id,
      card_type: card.card_type,
      rarity: card.rarity,
      name: card.name,
      en_name: card.en_name,
      theme: card.theme_name,
      style_tags: card.style_tags,
      description: card.description,
      prompt_hint: card.prompt_hint,
    },
    null,
    2
  );

  const handleCopyJson = () => {
    void copyToClipboard(cleanJson);
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 backdrop-blur-sm p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#12141D] border border-white/12 p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭素材详情"
          className="absolute top-5 right-5 w-10 h-10 rounded-lg flex items-center justify-center text-[#9E9BA3] hover:text-[#F1EEE8] hover:bg-white/6 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 flex flex-col items-center">
            <div
              className="w-full max-w-[290px] card-perspective"
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
            <div className="mt-4 text-center text-xs text-[#9E9BA3]">
              <span>{card.rarity} · {rarityInfo.cn}</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span>{rarityInfo.spec}</span>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col gap-5">
            <div>
              <div className="text-xs text-[#E2BD75]">
                {typeInfo.label}（{typeInfo.en}） · {card.theme_name}主题包
              </div>
              <h2 className="mt-1.5 font-editorial text-2xl md:text-3xl font-semibold text-[#FFFDF8]">
                {card.name}
              </h2>
              <div className="mt-1 text-xs font-mono-data text-[#9E9BA3]">{card.en_name}</div>
              <div className="mt-3 text-xs text-[#C6C2BA]">
                风格标签：{card.style_tags.join(' · ')}
              </div>
            </div>

            <div className="border-t border-white/8 pt-4 space-y-4">
              <div>
                <div className="text-xs font-medium text-[#9E9BA3] mb-1.5">素材说明</div>
                <p className="text-sm leading-relaxed text-[#F1EEE8]">{card.description}</p>
                {card.detail_note && (
                  <p className="mt-2 text-xs leading-relaxed text-[#E2BD75]/90">
                    搭配建议：{card.detail_note}
                  </p>
                )}
              </div>

              <div className="border-t border-white/8 pt-4">
                <div className="text-xs font-medium text-[#9E9BA3] mb-2">
                  结构化提示词容器（自动融入组合生成）
                </div>
                <div className="space-y-2 text-xs font-mono-data">
                  <div className="p-3 rounded-lg bg-[#0B0C11] border border-white/8">
                    <div className="text-[11px] text-[#9E9BA3] mb-1">visual prompt</div>
                    <div className="text-[#F1EEE8] leading-relaxed">{card.prompt_hint.visual}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0B0C11] border border-white/8">
                    <div className="text-[11px] text-[#9E9BA3] mb-1">atmosphere / tone</div>
                    <div className="text-[#E2BD75] leading-relaxed">{card.prompt_hint.tone}</div>
                  </div>
                </div>
              </div>
            </div>

            {showJson && (
              <div className="rounded-lg bg-[#090A0F] border border-white/10 p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono-data text-[#9E9BA3]">素材 JSON 数据</span>
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="inline-flex items-center gap-1.5 text-xs text-[#E2BD75] hover:text-[#F3D99F] whitespace-nowrap"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? '已复制' : '复制 JSON'}
                  </button>
                </div>
                <pre className="text-[11px] font-mono-data text-[#C6C2BA] overflow-x-auto max-h-48 leading-relaxed">
                  {cleanJson}
                </pre>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {owned ? (
                <button
                  type="button"
                  onClick={() => {
                    onEquipToCombine(card);
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E2BD75] text-[#0D0E14] text-sm font-semibold hover:bg-[#F3D99F] transition-colors whitespace-nowrap"
                >
                  <Layers className="w-4 h-4" />
                  装入自由组合槽位
                </button>
              ) : (
                <span className="text-xs text-[#E2BD75]">
                  暂未持有此素材 · 前往「主题卡包」抽取「{card.theme_name}」主题包即可解锁
                </span>
              )}

              <button
                type="button"
                onClick={() => setShowJson((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1A1D29] border border-white/10 text-sm text-[#F1EEE8] hover:border-white/25 transition-colors whitespace-nowrap"
              >
                <Code2 className="w-4 h-4" />
                {showJson ? '收起 JSON' : '查看 JSON'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
