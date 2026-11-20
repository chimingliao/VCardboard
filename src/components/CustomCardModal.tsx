import React, { useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { CARD_TYPE_META, HERO_REGISTRY, RARITY_META } from '../data/catalog';
import { CardType, NarrativeCard, Rarity, SeriesId } from '../types/card';

interface CustomCardModalProps {
  open: boolean;
  onClose: () => void;
  onCreateCard: (card: NarrativeCard) => void;
}

const SERIES_OPTIONS: { id: SeriesId; name: string }[] = [
  { id: 'stardust_prelude', name: '星尘序章' },
  { id: 'deepsea_echo', name: '深海回响' },
  { id: 'wasteland_era', name: '荒野纪元' },
  { id: 'bond_resonance', name: '羁绊回响篇' },
];

export const CustomCardModal: React.FC<CustomCardModalProps> = ({
  open,
  onClose,
  onCreateCard,
}) => {
  const [mode, setMode] = useState<'form' | 'json'>('form');
  const [name, setName] = useState('');
  const [cardType, setCardType] = useState<CardType>('story');
  const [rarity, setRarity] = useState<Rarity>('R');
  const [seriesId, setSeriesId] = useState<SeriesId>('stardust_prelude');
  const [worldTags, setWorldTags] = useState('赛博都市, 原创扩展');
  const [selectedHeroes, setSelectedHeroes] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [visualHint, setVisualHint] = useState('');
  const [toneHint, setToneHint] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!open) return null;

  const toggleHero = (heroId: string) => {
    setSelectedHeroes((prev) =>
      prev.includes(heroId) ? prev.filter((id) => id !== heroId) : [...prev, heroId]
    );
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !summary.trim()) {
      setErrorMsg('请至少填写卡牌名称与设定正文。');
      return;
    }
    const seriesObj = SERIES_OPTIONS.find((s) => s.id === seriesId) || SERIES_OPTIONS[0];
    const cleanId = `custom_${cardType}_${Date.now().toString(36)}`;
    const tags = worldTags
      .split(/[,，、\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const newCard: NarrativeCard = {
      card_id: cleanId,
      card_type: cardType,
      rarity,
      name: name.trim(),
      subtitle: `创作者自制 · ${CARD_TYPE_META[cardType].short}`,
      series: seriesObj.name,
      series_id: seriesObj.id,
      world_tags: tags.length > 0 ? tags : ['自制扩展'],
      bind_hero: cardType === 'hero' ? [cleanId] : selectedHeroes,
      relation_targets: cardType === 'relation' ? selectedHeroes : [],
      motion_seats: cardType === 'motion' ? Math.max(1, selectedHeroes.length || 1) : undefined,
      story_kind: cardType === 'story' ? 'recurring' : undefined,
      content: {
        summary: summary.trim(),
        dialogue_or_excerpt: excerpt.trim() || undefined,
      },
      assets: [],
      accent_hex: '#D8B467',
      prompt_hint: {
        visual: visualHint.trim() || `${name.trim()}, editorial anime concept art`,
        tone: toneHint.trim() || 'expressive, cohesive narrative mood',
      },
      is_custom: true,
      acquired_at: new Date().toISOString(),
    };

    onCreateCard(newCard);
    setName('');
    setSummary('');
    setExcerpt('');
    setVisualHint('');
    setToneHint('');
    setErrorMsg('');
    onClose();
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.name || !parsed.card_type) {
        setErrorMsg('JSON 缺少必填字段 name 或 card_type。');
        return;
      }
      const imported: NarrativeCard = {
        card_id: parsed.card_id || `import_${Date.now().toString(36)}`,
        card_type: parsed.card_type,
        rarity: parsed.rarity || 'R',
        name: parsed.name,
        subtitle: parsed.subtitle || '本地导入卡牌',
        series: parsed.series || '星尘序章',
        series_id: parsed.series_id || 'stardust_prelude',
        world_tags: Array.isArray(parsed.world_tags) ? parsed.world_tags : ['本地导入'],
        bind_hero: Array.isArray(parsed.bind_hero) ? parsed.bind_hero : [],
        relation_targets: Array.isArray(parsed.relation_targets) ? parsed.relation_targets : [],
        content: {
          summary:
            parsed.content?.summary ||
            parsed.content?.profile ||
            '通过 JSON 导入的叙事设定条目。',
          ...parsed.content,
        },
        assets: Array.isArray(parsed.assets) ? parsed.assets : [],
        accent_hex: '#D8B467',
        prompt_hint: {
          visual: parsed.prompt_hint?.visual || parsed.name,
          tone: parsed.prompt_hint?.tone || 'narrative editorial',
        },
        is_custom: true,
        acquired_at: new Date().toISOString(),
      };
      onCreateCard(imported);
      setJsonInput('');
      setErrorMsg('');
      onClose();
    } catch {
      setErrorMsg('JSON 格式解析失败，请检查引号与括号是否完整。');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#141720] border border-white/10 p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/8">
          <div>
            <h2 className="font-editorial text-2xl font-semibold text-[#FAF8F2]">
              自制或导入叙事卡牌
            </h2>
            <p className="mt-1 text-xs text-[#9A9892]">
              路线 A 本地单机扩展：将你自己的角色设定、剧情碎片或关系卡封装为结构化卡牌入库。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭弹窗"
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[#9A9892] hover:text-[#ECE9E1] hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-1 p-1 bg-[#0D0F14] rounded-lg w-fit">
          <button
            type="button"
            onClick={() => {
              setMode('form');
              setErrorMsg('');
            }}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              mode === 'form' ? 'bg-[#1D2230] text-[#FAF8F2]' : 'text-[#9A9892] hover:text-[#ECE9E1]'
            }`}
          >
            表单创建
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('json');
              setErrorMsg('');
            }}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              mode === 'json' ? 'bg-[#1D2230] text-[#FAF8F2]' : 'text-[#9A9892] hover:text-[#ECE9E1]'
            }`}
          >
            粘贴 JSON 导入
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-400/30 text-xs text-amber-200">
            {errorMsg}
          </div>
        )}

        {mode === 'form' ? (
          <form onSubmit={handleSubmitForm} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#9A9892] mb-1.5">卡牌名称 *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：雨停后的车站告别"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D0F14] border border-white/10 text-sm text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9A9892] mb-1.5">功能类型（与稀有度解耦）</label>
                <select
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value as CardType)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D0F14] border border-white/10 text-sm text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                >
                  {(Object.keys(CARD_TYPE_META) as CardType[]).map((t) => (
                    <option key={t} value={t}>
                      {CARD_TYPE_META[t].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-[#9A9892] mb-1.5">叙事规格（稀有度）</label>
                <select
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value as Rarity)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D0F14] border border-white/10 text-sm text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                >
                  {(Object.keys(RARITY_META) as Rarity[]).map((r) => (
                    <option key={r} value={r}>
                      {r} · {RARITY_META[r].cnName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#9A9892] mb-1.5">所属系列</label>
                <select
                  value={seriesId}
                  onChange={(e) => setSeriesId(e.target.value as SeriesId)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D0F14] border border-white/10 text-sm text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                >
                  {SERIES_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#9A9892] mb-1.5">世界观标签（逗号分隔）</label>
                <input
                  type="text"
                  value={worldTags}
                  onChange={(e) => setWorldTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D0F14] border border-white/10 text-sm text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#9A9892] mb-1.5">
                绑定角色（留空 = 全局资源；关系包请选择 2 名以上角色）
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(HERO_REGISTRY).map((h) => {
                  const active = selectedHeroes.includes(h.id);
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => toggleHero(h.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs border transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-[#D8B467]/20 border-[#D8B467] text-[#FAF8F2]'
                          : 'bg-[#0D0F14] border-white/10 text-[#9A9892] hover:text-[#ECE9E1]'
                      }`}
                    >
                      {h.name} · {h.series}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#9A9892] mb-1.5">设定正文（给人看）*</label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="描述这段服装、剧情碎片、道具或人物关系的完整设定……"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D0F14] border border-white/10 text-sm text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#9A9892] mb-1.5">台词或摘录（可选）</label>
              <input
                type="text"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="例如：「下一班列车开走之前，把星盘借我一分钟吧。」"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D0F14] border border-white/10 text-sm text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#9A9892] mb-1.5">
                  Visual Prompt Hint（给文生图模型）
                </label>
                <input
                  type="text"
                  value={visualHint}
                  onChange={(e) => setVisualHint(e.target.value)}
                  placeholder="silver hair, rain reflections, warm rim light"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D0F14] border border-white/10 text-xs font-mono-data text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9A9892] mb-1.5">
                  Tone Prompt Hint（给叙事模型）
                </label>
                <input
                  type="text"
                  value={toneHint}
                  onChange={(e) => setToneHint(e.target.value)}
                  placeholder="gentle, wistful, poetic restraint"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D0F14] border border-white/10 text-xs font-mono-data text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/8">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm text-[#9A9892] hover:text-[#ECE9E1]"
              >
                取消
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#D8B467] text-[#111318] text-sm font-semibold hover:bg-[#E9CF90] transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                封装并加入收藏库
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-5 space-y-4">
            <p className="text-xs text-[#9A9892] leading-relaxed">
              粘贴符合结构化卡牌规范的 JSON 条目（支持直接粘贴文档第 9 节示例结构）：
            </p>
            <textarea
              rows={11}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`{\n  "card_id": "story_custom_001",\n  "card_type": "story",\n  "rarity": "SAR",\n  "name": "黎明前的最后一首歌",\n  "series": "星尘序章",\n  "world_tags": ["赛博都市", "全息"],\n  "bind_hero": ["mili"],\n  "content": { "summary": "在黎明微光中完成的清唱桥段。" },\n  "prompt_hint": { "visual": "soft dawn rim light, silver hair", "tone": "cathartic, gentle" }\n}`}
              className="w-full p-3.5 rounded-lg bg-[#0D0F14] border border-white/10 text-xs font-mono-data text-[#FAF8F2] focus:outline-none focus:border-[#D8B467]"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm text-[#9A9892] hover:text-[#ECE9E1]"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleImportJson}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#D8B467] text-[#111318] text-sm font-semibold hover:bg-[#E9CF90] transition-colors whitespace-nowrap"
              >
                <Upload className="w-4 h-4" />
                解析并入库
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
