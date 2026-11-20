import { CARD_TYPE_META, RARITY_META } from '../data/catalog';
import { CombineRecipe, OutputMedium, SavedCreation, StyleCard } from '../types/card';

export interface GeneratedEcosystemOutput {
  imagePrompt: string;
  imagePromptModules: { label: string; value: string }[];
  comfyJson: string;
  videoScript: string;
  socialPost: string;
}

const MEDIUM_ANCHOR: Record<OutputMedium, { cn: string; prompt: string }> = {
  photography: {
    cn: '写真摄影（Photography）',
    prompt:
      'photorealistic editorial fashion portrait photography, Canon EOS R5 85mm f/1.4, natural skin texture, refined color grading, magazine lookbook quality',
  },
  illustration: {
    cn: '精品插画（Illustration）',
    prompt:
      'refined semi-realistic digital fashion illustration, luminous painterly brushwork, soft atmospheric depth, Japanese artbook cover aesthetic',
  },
  animation: {
    cn: '电影级动画（Animation）',
    prompt:
      'cinematic anime film still, Makoto Shinkai atmospheric lighting, delicate cel-shaded detail with glowing highlights, 2.35:1 cinema composition',
  },
};

export function buildEcosystemOutput(
  recipe: CombineRecipe,
  cardMap: Map<string, StyleCard>
): GeneratedEcosystemOutput {
  const char = recipe.characterId ? cardMap.get(recipe.characterId) : undefined;
  const costume = recipe.costumeId ? cardMap.get(recipe.costumeId) : undefined;
  const hair = recipe.hairstyleId ? cardMap.get(recipe.hairstyleId) : undefined;
  const makeup = recipe.makeupId ? cardMap.get(recipe.makeupId) : undefined;
  const pose = recipe.poseId ? cardMap.get(recipe.poseId) : undefined;
  const scene = recipe.sceneId ? cardMap.get(recipe.sceneId) : undefined;
  const prop = recipe.propId ? cardMap.get(recipe.propId) : undefined;
  const effect = recipe.effectId ? cardMap.get(recipe.effectId) : undefined;

  const mediumMeta = MEDIUM_ANCHOR[recipe.medium];

  const modules: { label: string; value: string }[] = [
    {
      label: '角色本体 Character',
      value: char ? char.prompt_hint.visual : 'graceful East Asian virtual muse',
    },
    {
      label: '服装造型 Costume',
      value: costume ? costume.prompt_hint.visual : 'minimalist modern tailored outfit',
    },
    {
      label: '发型设计 Hairstyle',
      value: hair ? hair.prompt_hint.visual : 'natural softly styled hair',
    },
    {
      label: '妆容质感 Makeup',
      value: makeup ? makeup.prompt_hint.visual : 'clean luminous natural editorial makeup',
    },
    {
      label: '姿态镜头 Pose',
      value: pose ? pose.prompt_hint.visual : 'natural relaxed three-quarter portrait stance',
    },
    {
      label: '环境场景 Scene',
      value: scene ? scene.prompt_hint.visual : 'soft twilight architectural window interior',
    },
    {
      label: '随身道具 Prop',
      value: prop ? prop.prompt_hint.visual : 'no extra props, clean minimalist framing',
    },
    {
      label: '风格特效 Effect',
      value: effect ? effect.prompt_hint.visual : 'subtle natural rim light and shallow depth of field',
    },
    {
      label: `成片介质 ${mediumMeta.cn}`,
      value: mediumMeta.prompt,
    },
  ];

  const imagePrompt = [
    char?.prompt_hint.visual,
    costume?.prompt_hint.visual,
    hair?.prompt_hint.visual,
    makeup?.prompt_hint.visual,
    pose?.prompt_hint.visual,
    scene?.prompt_hint.visual,
    prop?.prompt_hint.visual,
    effect?.prompt_hint.visual,
    mediumMeta.prompt,
  ]
    .filter(Boolean)
    .join(', ');

  const comfyJson = JSON.stringify(
    {
      archive: 'MONO Style Archive · Combine & Create',
      title: recipe.title,
      output_medium: recipe.medium,
      positive_prompt: imagePrompt,
      negative_prompt:
        'lowres, blurry face, distorted hands, extra fingers, watermark, text, oversaturated plastic skin',
      recipe_cards: {
        character: char?.card_id ?? null,
        costume: costume?.card_id ?? null,
        hairstyle: hair?.card_id ?? null,
        makeup: makeup?.card_id ?? null,
        pose: pose?.card_id ?? null,
        scene: scene?.card_id ?? null,
        prop: prop?.card_id ?? null,
        effect: effect?.card_id ?? null,
      },
    },
    null,
    2
  );

  const charName = char ? char.name.split(' · ')[0] : '虚拟主角';
  const sceneName = scene ? scene.name : '暮色窗边';
  const costumeName = costume ? costume.name : '日常穿搭';
  const hairName = hair ? hair.name : '自然发型';
  const propName = prop ? prop.name : '手边小物';
  const effectName = effect ? effect.name : '电影光斑';

  const videoScript = [
    `# 短影音 / 角色企划脚本：${recipe.title || '新角色视觉短片'}`,
    `介质定位：${mediumMeta.cn} · 建议时长 18–25 秒（9:16 竖屏）`,
    '',
    `## 镜头 01（0:00–0:04）· 环境空镜建立`,
    `- 画面：慢速推镜头展示「${sceneName}」，叠加「${effectName}」氛围光影。`,
    `- 声音：轻柔环境音 + 钢琴单音切入。`,
    '',
    `## 镜头 02（0:04–0:10）· 造型细节扫过`,
    `- 画面：浅景深局部特写——依次掠过「${costumeName}」的织物纹理、「${hairName}」的发丝光影，以及「${propName}」。`,
    `- 字幕：「今天，换一种方式遇见自己。」`,
    '',
    `## 镜头 03（0:10–0:18）· 角色主视觉定格`,
    `- 画面：「${charName}」以「${pose?.name ?? '自然回眸'}」姿态缓缓抬头望向镜头，突出「${makeup?.name ?? '清透妆感'}」的眼眸神采。`,
    `- 情绪基调：${char?.prompt_hint.tone ?? '温柔松弛、电影叙事感'}。`,
    '',
    `## 镜头 04（0:18–0:24）· 尾帧收束与卡牌配方展示`,
    `- 画面：画面微微柔焦定格，底部浮现本次 8 槽卡牌搭配配方卡片，引导评论区互动下一套造型投票。`,
    recipe.customNote ? `\n> 创作者企划备注：${recipe.customNote}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const tags = Array.from(
    new Set([
      '#虚拟角色创作',
      '#MONOStyleArchive',
      ...(char?.style_tags ?? []).map((t) => `#${t}`),
      ...(costume?.style_tags ?? []).slice(0, 1).map((t) => `#${t}`),
      ...(scene?.style_tags ?? []).slice(0, 1).map((t) => `#${t}`),
      '#AI写真灵感',
    ])
  ).join(' ');

  const socialPost = [
    `【标题备选】`,
    `1. 把「${costumeName}」和「${hairName}」拼在一起，${charName}的新造型也太出片了`,
    `2. ${sceneName}限定企划｜用卡牌素材库搭出我的虚拟角色新皮肤`,
    `3. 今日造型配方公开：${charName} × ${scene?.theme_name ?? '风格企划'}`,
    '',
    `【正文文案（适配小红书 / Instagram / X）】`,
    `这次在 MONO 素材库里试了一组很心水的搭配：用「${charName}」作为角色基底，换上「${costumeName}」与「${hairName}」，再配一点「${makeup?.name ?? '清透妆容'}」和「${effectName}」。`,
    `站在「${sceneName}」的光影里拿起「${propName}」的那一刻，整个人的故事感一下就立住了。`,
    '',
    `下一期想看哪一组主题卡包混搭？（日常 / 校园 / 旅行 / 哥德 / 赛博 / 职业）评论区点单～`,
    '',
    tags,
  ].join('\n');

  return {
    imagePrompt,
    imagePromptModules: modules,
    comfyJson,
    videoScript,
    socialPost,
  };
}

export function buildObsidianVaultMarkdown(
  ownedCards: StyleCard[],
  creations: SavedCreation[]
): { filename: string; content: string }[] {
  const files: { filename: string; content: string }[] = [];

  ownedCards.forEach((card) => {
    const md = [
      '---',
      `card_id: "${card.card_id}"`,
      `card_type: "${card.card_type}"`,
      `rarity: "${card.rarity}"`,
      `theme: "${card.theme_name}"`,
      `style_tags: [${card.style_tags.map((t) => `"${t}"`).join(', ')}]`,
      '---',
      '',
      `# ${card.name}`,
      '',
      `> ${CARD_TYPE_META[card.card_type].label}（${CARD_TYPE_META[card.card_type].en}） · ${card.rarity}（${RARITY_META[card.rarity].cn}） · [[主题_${card.theme_name}]]`,
      '',
      '## 素材说明',
      card.description,
      card.detail_note ? `\n${card.detail_note}` : '',
      '',
      '## 提示词片段（Prompt Hint）',
      `- **Visual**: \`${card.prompt_hint.visual}\``,
      `- **Tone**: \`${card.prompt_hint.tone}\``,
      '',
    ].join('\n');

    files.push({
      filename: `${card.card_type}_${card.card_id}.md`,
      content: md,
    });
  });

  creations.forEach((item) => {
    const md = [
      '---',
      `creation_id: "${item.id}"`,
      `medium: "${item.recipe.medium}"`,
      `created_at: "${item.created_at}"`,
      '---',
      '',
      `# 角色组合作品：${item.title}`,
      '',
      item.summary_line,
      '',
      `- 角色卡：${item.recipe.characterId ? `[[${item.recipe.characterId}]]` : '未指定'}`,
      `- 服装卡：${item.recipe.costumeId ? `[[${item.recipe.costumeId}]]` : '未指定'}`,
      `- 发型卡：${item.recipe.hairstyleId ? `[[${item.recipe.hairstyleId}]]` : '未指定'}`,
      `- 妆容卡：${item.recipe.makeupId ? `[[${item.recipe.makeupId}]]` : '未指定'}`,
      `- 动作卡：${item.recipe.poseId ? `[[${item.recipe.poseId}]]` : '未指定'}`,
      `- 场景卡：${item.recipe.sceneId ? `[[${item.recipe.sceneId}]]` : '未指定'}`,
      `- 道具卡：${item.recipe.propId ? `[[${item.recipe.propId}]]` : '未指定'}`,
      `- 风格特效卡：${item.recipe.effectId ? `[[${item.recipe.effectId}]]` : '未指定'}`,
      '',
    ].join('\n');

    files.push({
      filename: `creation_${item.id}.md`,
      content: md,
    });
  });

  return files;
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch(() => fallbackCopy(text));
  }
  return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text: string): boolean {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function downloadTextFile(
  filename: string,
  content: string,
  mime = 'text/plain;charset=utf-8'
): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
