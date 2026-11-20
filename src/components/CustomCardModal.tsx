import React, { useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { CARD_TYPE_META, CARD_TYPE_ORDER, RARITY_META, THEME_PACKS } from '../data/catalog';
import { CardType, Rarity, StyleCard, ThemePackId } from '../types/card';

interface CustomCardModalProps {
  open: boolean;
  onClose: () => void;
  onCreateCard: (card: StyleCard) => void;
}

export const CustomCardModal: React.FC<CustomCardModalProps> = ({
  open,
  onClose,
  onCreateCard,
}) => {
  const [mode, setMode] = useState<'form' | 'json'>('form');
  const [name, setName] = useState('');
  const [enName, setEnName] = useState('');
  const [cardType, setCardType] = useState<CardType>('costume');
  const [rarity, setRarity] = useState<Rarity>('SR');
  const [themeId, setThemeId] = useState<ThemePackId>('daily');
  const [tagsText, setTagsText] = useState('原创造型, 高级感');
  const [description, setDescription] = useState('');
  const [visualHint, setVisualHint] = useState('');
  const [toneHint, setToneHint] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!open) return null;

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setErrorMsg('请至少填写素材卡名称与造型/场景描述。');
      return;
    }

    const pack = THEME_PACKS.find((p) => p.pack_id === themeId) || THEME_PACKS[0];
    const cleanId = `custom_${cardType}_${Date.now().toString(36)}`;
    const tags = tagsText
      .split(/[,，、\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const card: StyleCard = {
      card_id: cleanId,
      card_type: cardType,
      rarity,
      name: name.trim(),
      en_name: enName.trim() || `${CARD_TYPE_META[cardType].en} · Custom`,
      theme_id: pack.pack_id,
      theme_name: pack.title,
      style_tags: tags.length > 0 ? tags : ['自制素材'],
      description: description.trim(),
      accent_hex: pack.foil_edge,
      prompt_hint: {
        visual: visualHint.trim() || `${name.trim()}, refined fashion editorial detail`,
        tone: toneHint.trim() || 'cohesive editorial mood',
      },
      is_custom: true,
      acquired_at: new Date().toISOString(),
    };

    onCreateCard(card);
    setName('');
    setEnName('');
    setDescription('');
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
      const pack =
        THEME_PACKS.find((p) => p.pack_id === parsed.theme_id || p.title === parsed.theme) ||
        THEME_PACKS[0];

      const card: StyleCard = {
        card_id: parsed.card_id || `import_${Date.now().toString(36)}`,
        card_type: parsed.card_type,
        rarity: parsed.rarity || 'R',
        name: parsed.name,
        en_name: parsed.en_name || parsed.name,
        theme_id: pack.pack_id,
        theme_name: pack.title,
        style_tags: Array.isArray(parsed.style_tags) ? parsed.style_tags : ['导入素材'],
        description: parsed.description || '本地导入的角色创作素材卡。',
        accent_hex: pack.foil_edge,
        prompt_hint: {
          visual: parsed.prompt_hint?.visual || parsed.name,
          tone: parsed.prompt_hint?.tone || 'editorial aesthetic',
        },
        is_custom: true,
        acquired_at: new Date().toISOString(),
      };
      onCreateCard(card);
      setJsonInput('');
      setErrorMsg('');
      onClose();
    } catch {
      setErrorMsg('JSON 解析失败，请检查语法是否正确。');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#12141D] border border-white/12 p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/8">
          <div>
            <h2 className="font-editorial text-2xl font-semibold text-[#FFFDF8]">
              自制角色素材卡
            </h2>
            <p className="mt-1 text-xs text-[#9E9BA3]">
              将你设计的服装、发型、妆容、动作、场景、道具或风格特效封装为标准素材卡，立即参与自由组合。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭弹窗"
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[#9E9BA3] hover:text-[#F1EEE8] hover:bg-white/6"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-1 p-1 bg-[#0B0C11] rounded-lg w-fit">
          <button
            type="button"
            onClick={() => {
              setMode('form');
              setErrorMsg('');
            }}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              mode === 'form' ? 'bg-[#1D2130] text-[#FFFDF8]' : 'text-[#9E9BA3] hover:text-[#F1EEE8]'
            }`}
          >
            可视化创建
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('json');
              setErrorMsg('');
            }}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              mode === 'json' ? 'bg-[#1D2130] text-[#FFFDF8]' : 'text-[#9E9BA3] hover:text-[#F1EEE8]'
            }`}
          >
            粘贴 JSON 导入
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-400/35 text-xs text-amber-200">
            {errorMsg}
          </div>
        )}

        {mode === 'form' ? (
          <form onSubmit={handleSubmitForm} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#9E9BA3] mb-1.5">素材名称 *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：焦糖风衣秋日穿搭"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0C11] border border-white/10 text-sm text-[#FFFDF8] focus:outline-none focus:border-[#E2BD75]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9E9BA3] mb-1.5">卡牌类型（8 大类型）</label>
                <select
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value as CardType)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0C11] border border-white/10 text-sm text-[#FFFDF8] focus:outline-none focus:border-[#E2BD75]"
                >
                  {CARD_TYPE_ORDER.map((t) => (
                    <option key={t} value={t}>
                      {CARD_TYPE_META[t].label} · {CARD_TYPE_META[t].en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-[#9E9BA3] mb-1.5">稀有度规格</label>
                <select
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value as Rarity)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0C11] border border-white/10 text-sm text-[#FFFDF8] focus:outline-none focus:border-[#E2BD75]"
                >
                  {(['N', 'R', 'SR', 'SSR', 'UR'] as Rarity[]).map((r) => (
                    <option key={r} value={r}>
                      {r} · {RARITY_META[r].cn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#9E9BA3] mb-1.5">归属主题卡包</label>
                <select
                  value={themeId}
                  onChange={(e) => setThemeId(e.target.value as ThemePackId)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0C11] border border-white/10 text-sm text-[#FFFDF8] focus:outline-none focus:border-[#E2BD75]"
                >
                  {THEME_PACKS.map((p) => (
                    <option key={p.pack_id} value={p.pack_id}>
                      {p.title}（{p.code}）
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#9E9BA3] mb-1.5">风格标签</label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0C11] border border-white/10 text-sm text-[#FFFDF8] focus:outline-none focus:border-[#E2BD75]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#9E9BA3] mb-1.5">造型 / 场景说明 *</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="描述材质、配色、光影或妆发特点……"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0C11] border border-white/10 text-sm text-[#FFFDF8] focus:outline-none focus:border-[#E2BD75]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#9E9BA3] mb-1.5">
                  Visual Prompt（用于影像生成）
                </label>
                <input
                  type="text"
                  value={visualHint}
                  onChange={(e) => setVisualHint(e.target.value)}
                  placeholder="caramel belted wool trench coat, warm autumn light"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0C11] border border-white/10 text-xs font-mono-data text-[#FFFDF8] focus:outline-none focus:border-[#E2BD75]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9E9BA3] mb-1.5">
                  Tone / 氛围关键词
                </label>
                <input
                  type="text"
                  value={toneHint}
                  onChange={(e) => setToneHint(e.target.value)}
                  placeholder="cozy autumn film lookbook"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0C11] border border-white/10 text-xs font-mono-data text-[#FFFDF8] focus:outline-none focus:border-[#E2BD75]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/8">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm text-[#9E9BA3] hover:text-[#F1EEE8]"
              >
                取消
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#E2BD75] text-[#0D0E14] text-sm font-semibold hover:bg-[#F3D99F] transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                加入我的素材库
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-5 space-y-4">
            <textarea
              rows={10}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`{\n  "card_type": "costume",\n  "rarity": "SR",\n  "name": "焦糖风衣秋日穿搭",\n  "theme_id": "daily",\n  "style_tags": ["秋日", "风衣"],\n  "description": "经典双排扣焦糖长风衣配米白针织。",\n  "prompt_hint": { "visual": "caramel trench coat, ivory knit", "tone": "warm autumn editorial" }\n}`}
              className="w-full p-3.5 rounded-lg bg-[#0B0C11] border border-white/10 text-xs font-mono-data text-[#FFFDF8] focus:outline-none focus:border-[#E2BD75]"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm text-[#9E9BA3] hover:text-[#F1EEE8]"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleImportJson}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#E2BD75] text-[#0D0E14] text-sm font-semibold hover:bg-[#F3D99F] transition-colors whitespace-nowrap"
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
