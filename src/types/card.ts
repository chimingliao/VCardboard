export type CardType =
  | 'character'
  | 'costume'
  | 'hairstyle'
  | 'makeup'
  | 'pose'
  | 'scene'
  | 'prop'
  | 'effect';

export type Rarity = 'N' | 'R' | 'SR' | 'SSR' | 'UR';

export type ThemePackId =
  | 'daily'
  | 'school'
  | 'travel'
  | 'cyber'
  | 'gothic'
  | 'occupation';

export type EffectVisualKind =
  | 'butterfly'
  | 'golden_bokeh'
  | 'film_grain'
  | 'gothic_rays'
  | 'cyber_rim'
  | 'sakura_mist';

export interface StyleCard {
  card_id: string;
  card_type: CardType;
  rarity: Rarity;
  name: string;
  en_name: string;
  theme_id: ThemePackId;
  theme_name: string;
  style_tags: string[];
  description: string;
  detail_note?: string;
  artwork_url?: string;
  artwork_focal?: string;
  accent_hex: string;
  effect_kind?: EffectVisualKind;
  prompt_hint: {
    visual: string;
    tone: string;
  };
  is_custom?: boolean;
  acquired_at?: string;
}

export interface ThemePackDef {
  pack_id: ThemePackId;
  code: string;
  title: string;
  en_title: string;
  tagline: string;
  description: string;
  cover_art: string;
  foil_from: string;
  foil_to: string;
  foil_edge: string;
  featured_tags: string[];
}

export type OutputMedium = 'photography' | 'illustration' | 'animation';

export interface CombineRecipe {
  title: string;
  characterId: string | null;
  costumeId: string | null;
  hairstyleId: string | null;
  makeupId: string | null;
  poseId: string | null;
  sceneId: string | null;
  propId: string | null;
  effectId: string | null;
  medium: OutputMedium;
  customNote: string;
}

export interface SavedCreation {
  id: string;
  title: string;
  created_at: string;
  recipe: CombineRecipe;
  preview_url: string;
  summary_line: string;
}

export type AppSection = 'packs' | 'combine' | 'library' | 'creations';
