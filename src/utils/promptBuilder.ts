import { CARD_TYPE_META, RARITY_META } from '../data/catalog';
import { NarrativeCard, StorySnapshot, WorkbenchAssembly } from '../types/card';

export interface VisualPromptModules {
  subject: string;
  outfitAndItems: string;
  poseAndCamera: string;
  sceneAndLighting: string;
  styleAnchor: string;
  combined: string;
  comfyPayload: string;
}

export interface ValidationIssue {
  level: 'warning' | 'info';
  message: string;
}

export function validateAssembly(
  assembly: WorkbenchAssembly,
  cardMap: Map<string, NarrativeCard>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const activeHeroIds = assembly.heroLoadouts.map((h) => h.heroId);

  if (activeHeroIds.length === 0) {
    issues.push({
      level: 'info',
      message: '尚未挂载 Hero 人物卡：当前编组将以空镜场景或纯世界观设定导出。',
    });
  }

  if (assembly.motionCardId) {
    const motion = cardMap.get(assembly.motionCardId);
    const seats = motion?.motion_seats ?? 1;
    if (activeHeroIds.length < seats) {
      issues.push({
        level: 'warning',
        message: `动作包「${motion?.name}」为 ${seats} 人姿态，当前编组仅有 ${activeHeroIds.length} 名 Hero，建议补充角色以完整生效。`,
      });
    }
  }

  if (assembly.relationCardId) {
    const rel = cardMap.get(assembly.relationCardId);
    if (rel && rel.relation_targets.length > 0) {
      const missing = rel.relation_targets.filter((id) => !activeHeroIds.includes(id));
      if (missing.length > 0) {
        issues.push({
          level: 'warning',
          message: `关系包「${rel.name}」需要同时选中对应角色（仍缺少：${missing.join('、')}），悬而未决的羁绊等待补齐。`,
        });
      }
    } else if (activeHeroIds.length < 2) {
      issues.push({
        level: 'warning',
        message: '关系包需至少选中 2 名 Hero 才可完整触发双人互动张力。',
      });
    }
  }

  return issues;
}

export function buildVisualPromptPack(
  assembly: WorkbenchAssembly,
  cardMap: Map<string, NarrativeCard>
): VisualPromptModules {
  const subjectLines: string[] = [];
  const outfitLines: string[] = [];
  const styleRefs: string[] = [];

  assembly.heroLoadouts.forEach((slot, idx) => {
    const heroCard = Array.from(cardMap.values()).find(
      (c) => c.card_type === 'hero' && c.bind_hero.includes(slot.heroId)
    );
    if (heroCard) {
      subjectLines.push(
        `[Character ${idx + 1}: ${heroCard.name}] ${heroCard.prompt_hint.visual}`
      );
    }
    if (slot.outfitCardId) {
      const outfit = cardMap.get(slot.outfitCardId);
      if (outfit) {
        outfitLines.push(`[${heroCard?.name ?? slot.heroId} Outfit] ${outfit.prompt_hint.visual}`);
      }
    }
    slot.itemCardIds.forEach((itemId) => {
      const item = cardMap.get(itemId);
      if (item) {
        outfitLines.push(`[${heroCard?.name ?? slot.heroId} Prop] ${item.prompt_hint.visual}`);
      }
    });
    if (slot.photoCardId) {
      const photo = cardMap.get(slot.photoCardId);
      if (photo) {
        styleRefs.push(photo.prompt_hint.visual);
      }
    }
  });

  const motion = assembly.motionCardId ? cardMap.get(assembly.motionCardId) : undefined;
  const relation = assembly.relationCardId ? cardMap.get(assembly.relationCardId) : undefined;
  const scene = assembly.sceneCardId ? cardMap.get(assembly.sceneCardId) : undefined;

  const poseParts: string[] = [];
  if (motion) poseParts.push(motion.prompt_hint.visual);
  if (relation) poseParts.push(relation.prompt_hint.visual);

  const scenePart = scene
    ? scene.prompt_hint.visual
    : 'minimalist quiet atmospheric background, balanced natural rim light';

  const styleAnchor = [
    ...styleRefs,
    'refined Japanese editorial anime illustration, painterly shading, cohesive color grading, crisp linework, museum artbook composition',
  ].join(', ');

  const subject = subjectLines.join(' ; ') || 'scenic atmospheric establishing shot, no characters';
  const outfitAndItems = outfitLines.join(' ; ') || 'default character styling';
  const poseAndCamera = poseParts.join(' ; ') || 'natural poised stance, balanced 50mm framing';
  const sceneAndLighting = scenePart;

  const combined = [
    subjectLines.map((l) => l.replace(/^\[.*?\]\s*/, '')).join(', '),
    outfitLines.map((l) => l.replace(/^\[.*?\]\s*/, '')).join(', '),
    poseAndCamera,
    sceneAndLighting,
    styleAnchor,
  ]
    .filter(Boolean)
    .join(', ');

  const comfyPayload = JSON.stringify(
    {
      workflow_target: 'ComfyUI / Flux / SDXL Narrative Block Input',
      assembly_title: assembly.title,
      positive_prompt: combined,
      negative_prompt:
        'lowres, distorted anatomy, watermark, text overlay, oversaturated neon clutter, plastic 3d render',
      modules: {
        subjects: subjectLines,
        outfits_and_props: outfitLines,
        composition: poseAndCamera,
        environment: sceneAndLighting,
        style_anchor: styleAnchor,
      },
      reference_assets: assembly.heroLoadouts
        .map((s) => (s.photoCardId ? cardMap.get(s.photoCardId)?.assets[0] : null))
        .filter(Boolean),
    },
    null,
    2
  );

  return {
    subject,
    outfitAndItems,
    poseAndCamera,
    sceneAndLighting,
    styleAnchor,
    combined,
    comfyPayload,
  };
}

export function buildNarrativePromptPack(
  assembly: WorkbenchAssembly,
  cardMap: Map<string, NarrativeCard>
): string {
  const formatGuide: Record<WorkbenchAssembly['narrativeFormat'], string> = {
    chapter:
      '请以「轻小说 / 文学章回」形式续写 800-1200 字：注重动作细节、环境光影与未说出口的情绪留白，严格保持角色口癖与关系张力。',
    storyboard:
      '请输出「60 秒短片分镜脚本」：按镜头编号列出【景别/运镜】【画面内容】【角色台词/旁白】【环境声与 BGM 情绪】。',
    social:
      '请输出「社交平台图文发布包」：包含 1 条极具氛围感的主正文（180-280 字）、3 组备选短标题与 5 个世界观话题标签。',
  };

  const lines: string[] = [];
  lines.push(`# 叙事创作指令包：${assembly.title || '未命名创作编组'}`);
  lines.push('');

  // 1. Characters
  lines.push('## 一、出场角色设定（共享底层档案）');
  if (assembly.heroLoadouts.length === 0) {
    lines.push('- （未指定角色，本篇为空镜世界观描写）');
  } else {
    assembly.heroLoadouts.forEach((slot) => {
      const hero = Array.from(cardMap.values()).find(
        (c) => c.card_type === 'hero' && c.bind_hero.includes(slot.heroId)
      );
      if (!hero) return;
      const outfit = slot.outfitCardId ? cardMap.get(slot.outfitCardId) : undefined;
      const items = slot.itemCardIds
        .map((id) => cardMap.get(id))
        .filter((x): x is NarrativeCard => Boolean(x));
      const voice = slot.voiceCardId ? cardMap.get(slot.voiceCardId) : undefined;

      lines.push(`### ${hero.name}（${hero.series}）`);
      if (hero.content.profile) lines.push(`- 档案：${hero.content.profile}`);
      if (hero.content.traits?.length) lines.push(`- 性格关键词：${hero.content.traits.join(' / ')}`);
      if (hero.content.catchphrase) lines.push(`- 标志口吻：${hero.content.catchphrase}`);
      if (hero.content.weakness) lines.push(`- 弱点与留白：${hero.content.weakness}`);
      if (outfit) lines.push(`- 当前着装：${outfit.name}（${outfit.content.summary}）`);
      if (items.length > 0) {
        lines.push(`- 随身物件：${items.map((i) => `${i.name}（${i.content.summary}）`).join('；')}`);
      }
      if (voice) lines.push(`- 音色参考：${voice.content.summary}`);
      lines.push(`- 叙事语调锚点：${hero.prompt_hint.tone}`);
      lines.push('');
    });
  }

  // 2. Relation
  if (assembly.relationCardId) {
    const rel = cardMap.get(assembly.relationCardId);
    if (rel) {
      lines.push('## 二、人物羁绊与关系张力');
      lines.push(`- 关系卡：${rel.name}（${rel.rarity} · ${rel.content.relation_type ?? '核心羁绊'}）`);
      lines.push(`- 关系定义：${rel.content.summary}`);
      if (rel.content.tension_note) lines.push(`- 情绪张力：${rel.content.tension_note}`);
      if (rel.content.dialogue_or_excerpt) lines.push(`- 参考对白：${rel.content.dialogue_or_excerpt}`);
      lines.push('');
    }
  }

  // 3. Scene & Atmosphere
  const scene = assembly.sceneCardId ? cardMap.get(assembly.sceneCardId) : undefined;
  const motion = assembly.motionCardId ? cardMap.get(assembly.motionCardId) : undefined;
  const bgm = assembly.bgmCardId ? cardMap.get(assembly.bgmCardId) : undefined;
  if (scene || motion || bgm) {
    lines.push('## 三、空间场景、构图与感官氛围');
    if (scene) {
      lines.push(`- 场景：${scene.name} — ${scene.content.summary}`);
      if (scene.content.scene_atmosphere) lines.push(`- 环境参数：${scene.content.scene_atmosphere}`);
    }
    if (motion) {
      lines.push(`- 动作与构图：${motion.name} — ${motion.content.summary}`);
      if (motion.content.pose_camera) lines.push(`- 镜头示意：${motion.content.pose_camera}`);
    }
    if (bgm) {
      lines.push(`- 听觉氛围（BGM）：${bgm.name} — ${bgm.content.summary}（${bgm.content.audio_cue ?? ''}）`);
    }
    lines.push('');
  }

  // 4. Story Sequence
  lines.push('## 四、剧情碎片与自定义旁白编排');
  if (assembly.scriptBlocks.length === 0) {
    lines.push('- （未编排剧情碎片，请根据角色与场景自由展开当下片刻）');
  } else {
    assembly.scriptBlocks.forEach((block, idx) => {
      if (block.kind === 'narration') {
        lines.push(`${idx + 1}. [创作者自定义旁白] ${block.text || '（空旁白）'}`);
      } else if (block.cardId) {
        const sc = cardMap.get(block.cardId);
        if (sc) {
          const kindLabel = sc.story_kind === 'node' ? `时间线节点·${sc.node_phase ?? '节点'}` : '常驻片段';
          lines.push(`${idx + 1}. [${kindLabel} · ${sc.name}] ${sc.content.summary}`);
          if (sc.content.dialogue_or_excerpt) {
            lines.push(`   > 节选：${sc.content.dialogue_or_excerpt}`);
          }
        }
      }
    });
  }
  lines.push('');

  // 5. Output Directive
  lines.push('## 五、输出形式要求');
  lines.push(formatGuide[assembly.narrativeFormat]);

  return lines.join('\n');
}

/**
 * Generates Obsidian-compatible Markdown notes with YAML frontmatter and [[bidirectional links]].
 */
export function buildObsidianVaultMarkdown(
  ownedCards: NarrativeCard[],
  snapshots: StorySnapshot[]
): { filename: string; content: string }[] {
  const files: { filename: string; content: string }[] = [];

  ownedCards.forEach((card) => {
    const links: string[] = [];
    card.bind_hero.forEach((h) => links.push(`[[hero_${h}]]`));
    card.relation_targets.forEach((t) => links.push(`[[hero_${t}]]`));
    links.push(`[[系列_${card.series}]]`);

    const md = [
      '---',
      `card_id: "${card.card_id}"`,
      `card_type: "${card.card_type}"`,
      `rarity: "${card.rarity}"`,
      `series: "${card.series}"`,
      `world_tags: [${card.world_tags.map((t) => `"${t}"`).join(', ')}]`,
      `acquired_at: "${card.acquired_at ?? new Date().toISOString()}"`,
      '---',
      '',
      `# ${card.name}`,
      '',
      `> ${CARD_TYPE_META[card.card_type].label} · ${card.rarity}（${RARITY_META[card.rarity].spec}）`,
      '',
      '## 设定正文',
      card.content.summary,
      card.content.profile ? `\n${card.content.profile}` : '',
      card.content.appearance ? `\n- **外貌特征**：${card.content.appearance}` : '',
      card.content.dialogue_or_excerpt ? `\n> ${card.content.dialogue_or_excerpt}` : '',
      '',
      '## 提示词锚点（Prompt Hint）',
      `- **Visual**: \`${card.prompt_hint.visual}\``,
      `- **Tone**: \`${card.prompt_hint.tone}\``,
      '',
      '## 双向链接',
      Array.from(new Set(links)).join(' · '),
      '',
    ]
      .filter((line) => line !== undefined)
      .join('\n');

    files.push({
      filename: `${card.card_type}_${card.card_id}.md`,
      content: md,
    });
  });

  snapshots.forEach((snap) => {
    const md = [
      '---',
      `snapshot_id: "${snap.id}"`,
      `chapter: "${snap.chapter_label}"`,
      `saved_at: "${snap.saved_at}"`,
      '---',
      '',
      `# 故事快照：${snap.title}`,
      '',
      snap.note || '（无备注）',
      '',
      `- 参演角色：${snap.assembly.heroLoadouts.map((h) => `[[hero_${h.heroId}]]`).join('、') || '空镜'}`,
      `- 启用场景：${snap.assembly.sceneCardId ? `[[${snap.assembly.sceneCardId}]]` : '无'}`,
      `- 启用关系：${snap.assembly.relationCardId ? `[[${snap.assembly.relationCardId}]]` : '无'}`,
      '',
    ].join('\n');

    files.push({
      filename: `snapshot_${snap.id}.md`,
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

export function downloadTextFile(filename: string, content: string, mime = 'text/plain;charset=utf-8'): void {
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
