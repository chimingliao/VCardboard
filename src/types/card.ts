export type CardType =
  | 'hero'
  | 'photo'
  | 'outfit'
  | 'item'
  | 'motion'
  | 'scene'
  | 'story'
  | 'relation'
  | 'voice'
  | 'bgm';

export type Rarity =
  | 'C'
  | 'U'
  | 'R'
  | 'RR'
  | 'AR'
  | 'SR'
  | 'SAR'
  | 'UR'
  | 'CHR'
  | 'CSR';

export type RarityGroup = 'base' | 'chase';

export type SeriesId =
  | 'stardust_prelude'
  | 'deepsea_echo'
  | 'wasteland_era'
  | 'bond_resonance';

export interface CardContent {
  summary: string;
  profile?: string;
  appearance?: string;
  traits?: string[];
  catchphrase?: string;
  weakness?: string;
  outfit_detail?: string;
  item_note?: string;
  pose_camera?: string;
  scene_atmosphere?: string;
  dialogue_or_excerpt?: string;
  relation_type?: string;
  tension_note?: string;
  audio_cue?: string;
}

export interface PromptHint {
  visual: string;
  tone: string;
}

export interface NarrativeCard {
  card_id: string;
  card_type: CardType;
  rarity: Rarity;
  name: string;
  subtitle?: string;
  series: string;
  series_id: SeriesId;
  world_tags: string[];
  /** Bound Hero IDs. Empty array = global resource (scene, universal item, etc.) */
  bind_hero: string[];
  /** Only for relation cards: required Hero IDs */
  relation_targets: string[];
  /** Only for motion cards: required number of Heroes (1 = solo, 2 = duo, 3+ = ensemble) */
  motion_seats?: number;
  /** Only for story cards: recurring fragment vs chronicle node */
  story_kind?: 'recurring' | 'node';
  /** Chronological order for story node fragments */
  timeline_order?: number;
  /** Milestone label e.g. 序章 / 相遇 / 转折 / 告别 */
  node_phase?: string;
  content: CardContent;
  assets: string[];
  artwork_url?: string;
  artwork_focal?: string;
  /** Visual accent color strictly for subtle card print trim / diagram line */
  accent_hex?: string;
  prompt_hint: PromptHint;
  /** Whether this card is unlocked by completing a series milestone rather than random draw */
  hidden_unlock?: boolean;
  /** Custom user-authored card flag */
  is_custom?: boolean;
  acquired_at?: string;
}

export type PackPoolKind = 'hero_pool' | 'accessory_pool' | 'bond_special';

export interface BoosterPackDef {
  pack_id: string;
  series_id: SeriesId;
  series_name: string;
  title: string;
  subtitle: string;
  pool_kind: PackPoolKind;
  world_tags: string[];
  cover_art: string;
  foil_accent: string;
  description: string;
  guaranteed_note: string;
  milestone_threshold: number;
  hidden_reward_card_id?: string;
}

export interface HeroSlotLoadout {
  heroId: string;
  outfitCardId: string | null;
  itemCardIds: string[];
  photoCardId: string | null;
  voiceCardId: string | null;
}

export interface ScriptBlock {
  id: string;
  kind: 'card' | 'narration';
  cardId?: string;
  text?: string;
}

export interface WorkbenchAssembly {
  title: string;
  heroLoadouts: HeroSlotLoadout[];
  motionCardId: string | null;
  relationCardId: string | null;
  sceneCardId: string | null;
  bgmCardId: string | null;
  scriptBlocks: ScriptBlock[];
  narrativeFormat: 'chapter' | 'storyboard' | 'social';
}

export interface StorySnapshot {
  id: string;
  title: string;
  chapter_label: string;
  note: string;
  saved_at: string;
  assembly: WorkbenchAssembly;
}

export type AppSection = 'shelf' | 'workbench' | 'atlas' | 'snapshots';
