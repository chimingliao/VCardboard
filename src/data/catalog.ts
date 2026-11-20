import {
  CardType,
  CombineRecipe,
  Rarity,
  StyleCard,
  ThemePackDef,
  ThemePackId,
} from '../types/card';

import charLinxiImg from '../assets/images/mono_char_linxi_1795160060111.jpg';
import charShiyueImg from '../assets/images/mono_char_shiyue_1795160059733.jpg';
import charChenyuImg from '../assets/images/mono_char_chenyu_1795160061481.jpg';
import costumeSchoolImg from '../assets/images/mono_costume_school_1795160060108.jpg';
import hairBraidsImg from '../assets/images/mono_hair_braids_1795160060079.jpg';
import makeupWarmTeaImg from '../assets/images/mono_makeup_warmtea_1795160060555.jpg';
import poseSeatedImg from '../assets/images/mono_pose_seated_1795160059980.jpg';
import sceneSakuraFujiImg from '../assets/images/mono_scene_sakura_fuji_1795160059734.jpg';
import propCameraImg from '../assets/images/mono_prop_camera_1795160060674.jpg';
import effectButterflyImg from '../assets/images/mono_effect_butterfly_1795160060460.jpg';
import resultSchoolLinxiImg from '../assets/images/mono_result_school_linxi_1795160059670.jpg';
import sceneGothicHallImg from '../assets/images/mono_scene_gothic_hall_1795160060275.jpg';
import sceneCyberRooftopImg from '../assets/images/scene_stardust_rooftop_1795132806951.jpg';
import sceneTravelRailwayImg from '../assets/images/scene_wasteland_station_1795132807537.jpg';
import sceneDeepseaLibraryImg from '../assets/images/scene_deepsea_library_1795132807743.jpg';
import heroMiliImg from '../assets/images/hero_mili_portrait_1795132808117.jpg';

export const MONO_ASSETS = {
  charLinxi: charLinxiImg,
  charShiyue: charShiyueImg,
  charChenyu: charChenyuImg,
  charMili: heroMiliImg,
  costumeSchool: costumeSchoolImg,
  hairBraids: hairBraidsImg,
  makeupWarmTea: makeupWarmTeaImg,
  poseSeated: poseSeatedImg,
  sceneSakuraFuji: sceneSakuraFujiImg,
  sceneGothicHall: sceneGothicHallImg,
  sceneCyberRooftop: sceneCyberRooftopImg,
  sceneTravelRailway: sceneTravelRailwayImg,
  sceneDeepseaLibrary: sceneDeepseaLibraryImg,
  propCamera: propCameraImg,
  effectButterfly: effectButterflyImg,
  resultSchoolLinxi: resultSchoolLinxiImg,
} as const;

export const CARD_TYPE_ORDER: CardType[] = [
  'character',
  'costume',
  'hairstyle',
  'makeup',
  'pose',
  'scene',
  'prop',
  'effect',
];

export const CARD_TYPE_META: Record<
  CardType,
  {
    label: string;
    en: string;
    desc: string;
    slotHint: string;
    sampleCardId: string;
  }
> = {
  character: {
    label: '角色卡',
    en: 'Character',
    desc: '不同风格的人物影像与角色设定',
    slotHint: '确定面部气质与基础身份锚点',
    sampleCardId: 'char_linxi_sr',
  },
  costume: {
    label: '服装卡',
    en: 'Costume',
    desc: '日常、制服、潮流、古典、职业等造型',
    slotHint: '决定人物穿搭风格与材质轮廓',
    sampleCardId: 'costume_school_blazer_r',
  },
  hairstyle: {
    label: '发型卡',
    en: 'Hairstyle',
    desc: '长短发、编发、卷发、染色与风格变化',
    slotHint: '塑造发丝轮廓、发色与发饰细节',
    sampleCardId: 'hair_twin_braids_r',
  },
  makeup: {
    label: '妆容卡',
    en: 'Makeup',
    desc: '眼妆、唇妆、肤色与整体妆面风格调整',
    slotHint: '微调眼唇色彩与肌肤质感',
    sampleCardId: 'makeup_warm_tea_r',
  },
  pose: {
    label: '动作卡',
    en: 'Pose',
    desc: '站、坐、走、跳、表情与肢体动作',
    slotHint: '定义肢体动态、手势与镜头景别',
    sampleCardId: 'pose_seated_studio_r',
  },
  scene: {
    label: '场景卡',
    en: 'Scene',
    desc: '室内、街道、旅行、自然、未来、奇幻等',
    slotHint: '确立环境空间、时间与自然光影',
    sampleCardId: 'scene_sakura_fuji_r',
  },
  prop: {
    label: '道具卡',
    en: 'Prop',
    desc: '相机、书籍、乐器、生活用品与特殊道具',
    slotHint: '增添手持物件与画面叙事线索',
    sampleCardId: 'prop_vintage_camera_r',
  },
  effect: {
    label: '风格特效卡',
    en: 'Effect',
    desc: '光影、滤镜、氛围、特效与视觉风格',
    slotHint: '叠加光斑、粒子、胶片颗粒或圣光',
    sampleCardId: 'effect_blue_butterfly_r',
  },
};

export const RARITY_META: Record<
  Rarity,
  {
    label: string;
    cn: string;
    spec: string;
    weight: number;
    rate: string;
    glow: string;
    textColor: string;
  }
> = {
  N: {
    label: 'N',
    cn: '基础素材',
    spec: '高频百搭日常组件',
    weight: 26,
    rate: '26%',
    glow: 'rgba(241, 238, 232, 0.14)',
    textColor: '#D0CEC8',
  },
  R: {
    label: 'R',
    cn: '精选造型',
    spec: '完整风格单品与经典场景',
    weight: 40,
    rate: '40%',
    glow: 'rgba(139, 182, 248, 0.36)',
    textColor: '#B5D2FF',
  },
  SR: {
    label: 'SR',
    cn: '主视觉珍藏',
    spec: '高质感人物核心与标志造型',
    weight: 22,
    rate: '22%',
    glow: 'rgba(226, 189, 117, 0.45)',
    textColor: '#F3D99F',
  },
  SSR: {
    label: 'SSR',
    cn: '主题限定',
    spec: '氛围大师级特写与奇幻特效',
    weight: 9,
    rate: '9%',
    glow: 'rgba(232, 162, 186, 0.5)',
    textColor: '#F8C6D8',
  },
  UR: {
    label: 'UR',
    cn: '典藏鎏金',
    spec: '极光工艺视觉规格 · 同素材顶级呈现',
    weight: 3,
    rate: '3%',
    glow: 'rgba(243, 217, 159, 0.65)',
    textColor: '#FFF1C7',
  },
};

export const THEME_PACKS: ThemePackDef[] = [
  {
    pack_id: 'daily',
    code: 'DAILY',
    title: '日常生活',
    en_title: 'Daily Life',
    tagline: '暖灯咖啡馆 · 胶片日常美学',
    description: '收录林溪暖光人像、燕麦针织穿搭、暖茶清透妆、复古旁轴相机与暮色散景特效。',
    cover_art: MONO_ASSETS.charLinxi,
    foil_from: '#52263C',
    foil_to: '#1A1320',
    foil_edge: '#E59BB7',
    featured_tags: ['暖灯咖啡馆', '胶片感', '松弛日常'],
  },
  {
    pack_id: 'school',
    code: 'SCHOOL',
    title: '校园青春',
    en_title: 'School Life',
    tagline: '樱粉西装制服 · 红丝带编发',
    description: '打造日韩系青春写真的核心卡包：樱粉学院西装、红丝带双麻花编发、樱花飘落光效与校园姿态。',
    cover_art: MONO_ASSETS.costumeSchool,
    foil_from: '#203659',
    foil_to: '#101522',
    foil_edge: '#8BB6F8',
    featured_tags: ['学院制服', '青春写真', '樱花季'],
  },
  {
    pack_id: 'travel',
    code: 'TRAVEL',
    title: '旅行风景',
    en_title: 'Travel',
    tagline: '富士山樱湖 · 日落铁道旅拍',
    description: '涵盖樱花富士山湖畔、黄金日落高架站、胶片旅拍色调与漫步回眸姿态。',
    cover_art: MONO_ASSETS.sceneSakuraFuji,
    foil_from: '#5C3B22',
    foil_to: '#1A1410',
    foil_edge: '#E2BD75',
    featured_tags: ['日本旅拍', '日落余晖', '电影感'],
  },
  {
    pack_id: 'gothic',
    code: 'GOTHIC',
    title: '哥德风格',
    en_title: 'Gothic',
    tagline: '教堂彩窗圣光 · 幽蓝光蝶',
    description: '收录冷感高定角色诗月、哥德教堂彩窗长廊、暗夜蕾丝礼服与幽蓝星尘光蝶特效。',
    cover_art: MONO_ASSETS.sceneGothicHall,
    foil_from: '#2A254B',
    foil_to: '#11101C',
    foil_edge: '#A99CF0',
    featured_tags: ['古典暗黑', '彩窗圣光', '幻想特效'],
  },
  {
    pack_id: 'cyber',
    code: 'CYBER',
    title: '赛博未来',
    en_title: 'Cyber',
    tagline: '蓝调全息天台 · 未来机能',
    description: '融合近未来都市雨夜天台、银发全息歌姬、透明冷感机能穿搭与霓虹轮廓光效。',
    cover_art: MONO_ASSETS.sceneCyberRooftop,
    foil_from: '#1B3A4B',
    foil_to: '#0E1520',
    foil_edge: '#79D2E6',
    featured_tags: ['近未来', '蓝调雨夜', '全息光影'],
  },
  {
    pack_id: 'occupation',
    code: 'LIFE',
    title: '职业角色',
    en_title: 'Occupation',
    tagline: '建筑师 · 摄影师 · 工作室日常',
    description: '收录温润系男主辰宇、毛呢建筑师大衣、雕塑坐姿参考与文艺工作室道具。',
    cover_art: MONO_ASSETS.charChenyu,
    foil_from: '#4B3E25',
    foil_to: '#181510',
    foil_edge: '#DFC58E',
    featured_tags: ['职业穿搭', '工作室', '杂志质感'],
  },
];

export const INITIAL_CATALOG: StyleCard[] = [
  // ==================== 1. 角色卡 Character ====================
  {
    card_id: 'char_linxi_sr',
    card_type: 'character',
    rarity: 'SR',
    name: '林溪 · 暖光暮色人像',
    en_name: 'Linxi · Twilight Muse',
    theme_id: 'daily',
    theme_name: '日常生活',
    style_tags: ['日系写真', '温柔亲和', '自然骨相'],
    description: '标志性柔和栗棕发色与明亮琥珀棕双眸，笑容松弛自然，适配日常、校园与旅拍全系列造型。',
    detail_note: '面部一致性极佳的基础角色卡，与校园制服或旅拍长裙组合时画面辨识度极高。',
    artwork_url: MONO_ASSETS.charLinxi,
    artwork_focal: '50% 24%',
    accent_hex: '#E2BD75',
    prompt_hint: {
      visual:
        'graceful East Asian young woman in her early 20s, delicate natural features, warm brown eyes, gentle effortless smile, luminous natural skin texture',
      tone: 'warm, approachable, refined magazine editorial',
    },
  },
  {
    card_id: 'char_shiyue_ssr',
    card_type: 'character',
    rarity: 'SSR',
    name: '诗月 · 清冷月光模特',
    en_name: 'Shiyue · Moonlight Editorial',
    theme_id: 'gothic',
    theme_name: '哥德风格',
    style_tags: ['高定冷感', '东方清冷', 'Vogue风'],
    description: '黑直长发配极简银饰，眼神克制深邃，天然驾驭哥德、高定暗黑与赛博都市主题。',
    detail_note: '强光影对比下立体感突出，适合短片大片与艺术写真封面。',
    artwork_url: MONO_ASSETS.charShiyue,
    artwork_focal: '50% 20%',
    accent_hex: '#A99CF0',
    prompt_hint: {
      visual:
        'poised East Asian fashion model woman, sleek raven-black hair, sculpted cheekbones, serene cool gaze, minimal silver ear cuff, high-fashion editorial poise',
      tone: 'cool, enigmatic, haute couture minimalism',
    },
  },
  {
    card_id: 'char_chenyu_sr',
    card_type: 'character',
    rarity: 'SR',
    name: '辰宇 · 午后建筑师',
    en_name: 'Chenyu · Atelier Architect',
    theme_id: 'occupation',
    theme_name: '职业角色',
    style_tags: ['温润绅士', '职业人设', '暖阳人像'],
    description: '干净清爽的青年男性角色卡，气场沉稳温柔，擅长演绎职业剧场、书店邂逅与城市旅拍。',
    artwork_url: MONO_ASSETS.charChenyu,
    artwork_focal: '50% 22%',
    accent_hex: '#DFC58E',
    prompt_hint: {
      visual:
        'refined young East Asian man in his mid-20s, naturally styled dark hair, calm warm eyes, understated gentleman aura, natural daylight portrait',
      tone: 'composed, intelligent, sunlit warmth',
    },
  },
  {
    card_id: 'char_mili_ur',
    card_type: 'character',
    rarity: 'UR',
    name: '蜜梨 · 星尘全息歌姬',
    en_name: 'Mili · Holographic Vocalist',
    theme_id: 'cyber',
    theme_name: '赛博未来',
    style_tags: ['二次元插画', '银发微光', '近未来'],
    description: '跨次元插画风虚拟歌姬角色卡，发梢自带微弱月光辉彩，适合二次元插画与动画短片企划。',
    artwork_url: MONO_ASSETS.charMili,
    artwork_focal: '50% 18%',
    accent_hex: '#79D2E6',
    prompt_hint: {
      visual:
        'stylized anime editorial virtual singer, long silver-white hair with soft luminescent tips, poised dreamy expression, refined Makoto Shinkai artbook shading',
      tone: 'ethereal, lyrical, nocturnal futurism',
    },
  },

  // ==================== 2. 服装卡 Costume ====================
  {
    card_id: 'costume_school_blazer_r',
    card_type: 'costume',
    rarity: 'R',
    name: '樱粉学院西装制服',
    en_name: 'Dusty-Pink Preppy Blazer',
    theme_id: 'school',
    theme_name: '校园青春',
    style_tags: ['学院风', '制服', '日韩青春'],
    description: '雾粉羊毛西装外套搭挺括白衬衫、酒红斜纹领带与深灰百褶短裙，经典青春校园视觉标配。',
    detail_note: '与「红丝带双麻花编发」及「林溪」组合可触发完整校园写真联动效果。',
    artwork_url: MONO_ASSETS.costumeSchool,
    artwork_focal: '50% 35%',
    accent_hex: '#E59BB7',
    prompt_hint: {
      visual:
        'tailored dusty-pink preppy school blazer jacket with gold buttons, crisp white collared shirt, burgundy necktie, dark charcoal pleated skirt',
      tone: 'youthful, crisp, refined campus aesthetic',
    },
  },
  {
    card_id: 'costume_oatmeal_knit_n',
    card_type: 'costume',
    rarity: 'N',
    name: '燕麦羊绒针织日常装',
    en_name: 'Oatmeal Cashmere Knit',
    theme_id: 'daily',
    theme_name: '日常生活',
    style_tags: ['松弛感', '秋冬日常', '温柔穿搭'],
    description: '软糯燕麦色圆领羊绒针织衫配极细金色锁骨链，自带柔和高级的居家与咖啡馆氛围。',
    artwork_url: MONO_ASSETS.charLinxi,
    artwork_focal: '50% 78%',
    accent_hex: '#E2BD75',
    prompt_hint: {
      visual:
        'soft oatmeal-beige cashmere crewneck knit sweater with relaxed cuffs, delicate thin gold chain necklace, cozy understated everyday elegance',
      tone: 'cozy, tactile, quiet luxury',
    },
  },
  {
    card_id: 'costume_architect_coat_r',
    card_type: 'costume',
    rarity: 'R',
    name: '炭灰毛呢建筑师大衣',
    en_name: 'Charcoal Atelier Overcoat',
    theme_id: 'occupation',
    theme_name: '职业角色',
    style_tags: ['职业穿搭', '利落剪裁', '老钱风'],
    description: '挺括炭灰人字纹毛呢大衣叠穿苔绿细针织与白衬衫领，凸显专业沉稳的都会职业气质。',
    artwork_url: MONO_ASSETS.charChenyu,
    artwork_focal: '50% 72%',
    accent_hex: '#DFC58E',
    prompt_hint: {
      visual:
        'structured charcoal herringbone wool overcoat layered over an olive-moss fine knit sweater and crisp white shirt collar, classic wristwatch',
      tone: 'tailored, intellectual, timeless professional',
    },
  },
  {
    card_id: 'costume_gothic_velvet_sr',
    card_type: 'costume',
    rarity: 'SR',
    name: '暗夜丝绒蕾丝高定礼服',
    en_name: 'Nocturne Velvet Lace Gown',
    theme_id: 'gothic',
    theme_name: '哥德风格',
    style_tags: ['哥德华丽', '丝绒蕾丝', '礼服'],
    description: '午夜黑丝绒收腰立领礼服，袖口饰以精致手工黑蕾丝与银质纽扣，在烛光下自带华贵暗影层次。',
    accent_hex: '#A99CF0',
    prompt_hint: {
      visual:
        'haute-couture midnight-black velvet gothic dress with delicate Victorian lace collar, sculpted corset waist, silver filigree buttons',
      tone: 'dramatic, aristocratic, nocturnal splendor',
    },
  },
  {
    card_id: 'costume_cyber_trench_sr',
    card_type: 'costume',
    rarity: 'SR',
    name: '淡紫机能建筑感风衣',
    en_name: 'Lavender Tech-Minimal Trench',
    theme_id: 'cyber',
    theme_name: '赛博未来',
    style_tags: ['未来机能', '建筑剪裁', '冷光面料'],
    description: '哑光淡紫防风建筑剪裁长风衣，内搭炭黑百褶裙与极简短靴，在雨夜霓虹下呈现柔和微光折面。',
    artwork_url: MONO_ASSETS.charMili,
    artwork_focal: '50% 58%',
    accent_hex: '#79D2E6',
    prompt_hint: {
      visual:
        'architectural pale lavender double-breasted futuristic trench coat over matte charcoal midi skirt, clean metallic fasteners, subtle iridescent sheen',
      tone: 'sleek urban futurism, clean silhouette',
    },
  },

  // ==================== 3. 发型卡 Hairstyle ====================
  {
    card_id: 'hair_twin_braids_r',
    card_type: 'hairstyle',
    rarity: 'R',
    name: '红丝带双麻花编发',
    en_name: 'Burgundy Ribbon Twin Braids',
    theme_id: 'school',
    theme_name: '校园青春',
    style_tags: ['编发', '丝带发饰', '甜美学院'],
    description: '光泽栗棕双股法式麻花编发，尾端以酒红缎面蝴蝶结收束，背面与正面均具极高辨识度。',
    artwork_url: MONO_ASSETS.hairBraids,
    artwork_focal: '50% 42%',
    accent_hex: '#E59BB7',
    prompt_hint: {
      visual:
        'glossy chestnut-brown twin Dutch braids neatly woven and tied with slender burgundy satin ribbon bows, soft face-framing wisps',
      tone: 'romantic, youthful, delicate salon craft',
    },
  },
  {
    card_id: 'hair_loose_updo_n',
    card_type: 'hairstyle',
    rarity: 'N',
    name: '慵懒空气感盘发',
    en_name: 'Effortless Textured Updo',
    theme_id: 'daily',
    theme_name: '日常生活',
    style_tags: ['日常丸子头', '空气刘海', '温柔'],
    description: '松散微卷的高位空气感盘发，双颊自然垂落微弯碎发，尽显午后与暮色的轻松氛围。',
    artwork_url: MONO_ASSETS.charLinxi,
    artwork_focal: '50% 18%',
    accent_hex: '#E2BD75',
    prompt_hint: {
      visual:
        'warm chestnut hair gathered in a soft effortless textured updo with loose wispy curls framing the cheeks and neckline',
      tone: 'breezy, intimate, natural beauty',
    },
  },
  {
    card_id: 'hair_sleek_raven_r',
    card_type: 'hairstyle',
    rarity: 'R',
    name: '中分镜面黑长直',
    en_name: 'Sleek Mirror-Black Long Hair',
    theme_id: 'gothic',
    theme_name: '哥德风格',
    style_tags: ['清冷长直发', '极简高定', '质感'],
    description: '一丝不苟的中分黑亮顺滑长直发，将耳侧线条与耳骨夹完美勾勒，增强冷冽高级气场。',
    artwork_url: MONO_ASSETS.charShiyue,
    artwork_focal: '50% 16%',
    accent_hex: '#A99CF0',
    prompt_hint: {
      visual:
        'sleek center-parted mirror-gloss midnight-black long straight hair tucked neatly behind one ear',
      tone: 'sharp, minimalist, high-fashion clarity',
    },
  },
  {
    card_id: 'hair_silver_wave_sr',
    card_type: 'hairstyle',
    rarity: 'SR',
    name: '月光微卷银白长发',
    en_name: 'Moonlit Silver Flowing Waves',
    theme_id: 'cyber',
    theme_name: '赛博未来',
    style_tags: ['漂染银发', '微光发梢', '幻想风'],
    description: '如月光倾斜般的冷银白及腰长发，在夜风与背光下自带轻盈半透明发丝边缘光。',
    artwork_url: MONO_ASSETS.charMili,
    artwork_focal: '55% 18%',
    accent_hex: '#79D2E6',
    prompt_hint: {
      visual:
        'flowing waist-length silver-white hair with wind-swept tips catching soft pale-blue rim light',
      tone: 'dreamlike, futuristic elegance',
    },
  },

  // ==================== 4. 妆容卡 Makeup ====================
  {
    card_id: 'makeup_warm_tea_r',
    card_type: 'makeup',
    rarity: 'R',
    name: '暖茶清透伪素颜妆',
    en_name: 'Warm Milk-Tea Satin Makeup',
    theme_id: 'daily',
    theme_name: '日常生活',
    style_tags: ['清透底妆', '奶茶眼影', '日常百搭'],
    description: '哑光暖奶茶色大地眼影配极细深棕微挑眼线与自然根根分明睫毛，水光缎面肌理通透自然。',
    artwork_url: MONO_ASSETS.makeupWarmTea,
    artwork_focal: '50% 50%',
    accent_hex: '#E2BD75',
    prompt_hint: {
      visual:
        'natural warm milk-tea matte brown eyeshadow, fine dark-brown winged eyeliner, wispy natural curled lashes, luminous satin skin glow, soft rose-nude lip tint',
      tone: 'clean beauty, authentic editorial skin',
    },
  },
  {
    card_id: 'makeup_sakura_blush_n',
    card_type: 'makeup',
    rarity: 'N',
    name: '樱雾元气眼下腮红妆',
    en_name: 'Sakura Flush Youth Makeup',
    theme_id: 'school',
    theme_name: '校园青春',
    style_tags: ['日系透明感', '嫩粉腮红', '水光唇'],
    description: '清透眼下微醺淡粉腮红配水蜜桃玻璃唇釉，阳光下呈现极具生命力的青春透明感。',
    accent_hex: '#E59BB7',
    prompt_hint: {
      visual:
        'dewy translucent complexion, soft sakura-pink under-eye blush, delicate shimmer on inner eye corner, glossy peach-rose lips',
      tone: 'fresh, radiant, spring youthfulness',
    },
  },
  {
    card_id: 'makeup_velvet_rose_sr',
    card_type: 'makeup',
    rarity: 'SR',
    name: '暗夜丝绒玫瑰哥德妆',
    en_name: 'Velvet Rose Nocturne Makeup',
    theme_id: 'gothic',
    theme_name: '哥德风格',
    style_tags: ['丝绒红唇', '烟熏眼尾', '白瓷肌'],
    description: '哑光白瓷底妆配深玫瑰烟熏眼尾与酒红丝绒雾面唇妆，极具戏剧张力与电影高级感。',
    accent_hex: '#A99CF0',
    prompt_hint: {
      visual:
        'porcelain matte skin finish, subtle plum-smoke wing shading, defined brows, rich deep-rose velvet matte lipstick',
      tone: 'alluring, dramatic, couture gothic',
    },
  },

  // ==================== 5. 动作卡 Pose ====================
  {
    card_id: 'pose_seated_studio_r',
    card_type: 'pose',
    rarity: 'R',
    name: '石台优雅交叉腿坐姿',
    en_name: 'Sculptural Cross-Legged Seated Pose',
    theme_id: 'occupation',
    theme_name: '职业角色',
    style_tags: ['坐姿参考', '杂志构图', '修长线条'],
    description: '单手轻撑石台、双腿自然交叠的雕塑感全身坐姿，肩颈微倾，适合棚拍大片与全身造型展示。',
    artwork_url: MONO_ASSETS.poseSeated,
    artwork_focal: '50% 42%',
    accent_hex: '#8BB6F8',
    prompt_hint: {
      visual:
        'full-body seated pose on a minimalist plinth, legs gracefully crossed, one hand resting gently on knee and the other supporting lightly on edge, slight relaxed head tilt',
      tone: 'poised, gallery lookbook balance',
    },
  },
  {
    card_id: 'pose_chin_rest_r',
    card_type: 'pose',
    rarity: 'R',
    name: '窗畔托腮微笑近景',
    en_name: 'Windowside Chin-Rest Smile',
    theme_id: 'daily',
    theme_name: '日常生活',
    style_tags: ['近景特写', '眼神互动', '温柔叙事'],
    description: '手肘轻搁木桌、指尖轻托下颌望向镜头微笑，85mm 浅景深天然拉近观看者距离。',
    artwork_url: MONO_ASSETS.charLinxi,
    artwork_focal: '50% 35%',
    accent_hex: '#E2BD75',
    prompt_hint: {
      visual:
        'intimate 85mm close-up portrait pose, leaning lightly on a wooden cafe counter with chin resting delicately on one hand, warm eye contact with camera',
      tone: 'intimate, engaging, cinematic closeness',
    },
  },
  {
    card_id: 'pose_sakura_gentle_n',
    card_type: 'pose',
    rarity: 'N',
    name: '双手轻叠迎风正侧站姿',
    en_name: 'Gentle Clasped-Hands Stance',
    theme_id: 'school',
    theme_name: '校园青春',
    style_tags: ['半身站姿', '青春自然', '写真标配'],
    description: '身体微侧 15 度、双手在身前自然轻叠，肩线松弛舒展，是校园与旅行外拍的万能出片动作。',
    artwork_url: MONO_ASSETS.resultSchoolLinxi,
    artwork_focal: '50% 50%',
    accent_hex: '#E59BB7',
    prompt_hint: {
      visual:
        'relaxed three-quarter medium portrait stance, hands gently clasped in front of waist, shoulders angled softly, natural joyful smile toward camera',
      tone: 'authentic, breezy, candid film feel',
    },
  },
  {
    card_id: 'pose_arms_crossed_r',
    card_type: 'pose',
    rarity: 'R',
    name: '冷感抱臂回眸特写',
    en_name: 'Editorial Arms-Folded Gaze',
    theme_id: 'gothic',
    theme_name: '哥德风格',
    style_tags: ['杂志封面', '气场构图', '冷冽眼神'],
    description: '侧身抱臂、微转下颌直视镜头的时尚杂志封面级姿态，强调眼神压迫感与肩颈轮廓。',
    artwork_url: MONO_ASSETS.charShiyue,
    artwork_focal: '50% 40%',
    accent_hex: '#A99CF0',
    prompt_hint: {
      visual:
        'confident high-fashion three-quarter portrait, arms loosely folded, head turned cleanly over shoulder with steady magnetic gaze into lens',
      tone: 'editorial authority, poised restraint',
    },
  },

  // ==================== 6. 场景卡 Scene ====================
  {
    card_id: 'scene_sakura_fuji_r',
    card_type: 'scene',
    rarity: 'R',
    name: '樱花富士山湖畔晨景',
    en_name: 'Sakura & Mt. Fuji Lakeside',
    theme_id: 'travel',
    theme_name: '旅行风景',
    style_tags: ['日本旅拍', '樱花前景', '晴空湖面倒影'],
    description: '盛放淡粉樱枝作为前景画框，远望雪顶富士山与湛蓝湖面倒影，明媚治愈的顶级外拍胜地。',
    artwork_url: MONO_ASSETS.sceneSakuraFuji,
    artwork_focal: '50% 50%',
    accent_hex: '#E59BB7',
    prompt_hint: {
      visual:
        'blooming pale-pink cherry blossom branches framing snow-capped Mount Fuji across a mirror-calm sapphire lake at crisp morning sunlight',
      tone: 'serene, luminous, iconic Japanese travel postcard',
    },
  },
  {
    card_id: 'scene_gothic_hall_sr',
    card_type: 'scene',
    rarity: 'SR',
    name: '哥德大教堂彩窗长廊',
    en_name: 'Gothic Cathedral Stained-Glass Hall',
    theme_id: 'gothic',
    theme_name: '哥德风格',
    style_tags: ['欧洲古堡', '彩窗圣光', '烛火深影'],
    description: '高耸尖拱石柱与摇曳烛台交错，斜射穿透彩色玻璃窗的金色光束将石板铺满古典戏剧光影。',
    artwork_url: MONO_ASSETS.sceneGothicHall,
    artwork_focal: '50% 45%',
    accent_hex: '#E2BD75',
    prompt_hint: {
      visual:
        'grand European Gothic cathedral corridor with soaring stone ribbed arches, warm flickering candelabra and dramatic golden shafts of sun streaming through stained glass',
      tone: 'solemn grandeur, painterly chiaroscuro',
    },
  },
  {
    card_id: 'scene_cyber_rooftop_sr',
    card_type: 'scene',
    rarity: 'SR',
    name: '蓝调雨夜全息观测天台',
    en_name: 'Blue-Hour Holographic Rooftop',
    theme_id: 'cyber',
    theme_name: '赛博未来',
    style_tags: ['都市夜景', '雨后倒影', '近未来'],
    description: '微雨初歇的高空混凝土天台，积水倒映远处城市暖金灯火与天际漂浮的微弱全息星轨。',
    artwork_url: MONO_ASSETS.sceneCyberRooftop,
    artwork_focal: '50% 50%',
    accent_hex: '#79D2E6',
    prompt_hint: {
      visual:
        'rain-slicked futuristic rooftop observatory at blue-hour twilight, wet puddles reflecting warm city lights and subtle lavender constellations in misty sky',
      tone: 'cinematic nocturnal solitude, sleek sci-fi realism',
    },
  },
  {
    card_id: 'scene_sunset_railway_r',
    card_type: 'scene',
    rarity: 'R',
    name: '黄金草海日落高架站',
    en_name: 'Golden Sunset Elevated Station',
    theme_id: 'travel',
    theme_name: '旅行风景',
    style_tags: ['废土铁道', '日落逆光', '公路感'],
    description: '被晚霞镀成玫瑰金的旧高架站台与随风起伏的金秋草海，自带公路电影般的怀旧叙事张力。',
    artwork_url: MONO_ASSETS.sceneTravelRailway,
    artwork_focal: '50% 50%',
    accent_hex: '#E2BD75',
    prompt_hint: {
      visual:
        'nostalgic weathered elevated railway station overlooking endless golden autumn grass fields at amber sunset, warm backlit clouds',
      tone: 'bittersweet wanderlust, analog cinema warmth',
    },
  },
  {
    card_id: 'scene_deepsea_library_ssr',
    card_type: 'scene',
    rarity: 'SSR',
    name: '深海玻璃穹顶图书馆',
    en_name: 'Sunken Glass Dome Library',
    theme_id: 'gothic',
    theme_name: '哥德风格',
    style_tags: ['奇幻建筑', '深海水光', '秘境'],
    description: '沉没于蔚蓝海底的巨型古典拱形玻璃图书馆，水波光束穿透穹顶洒在古老木书架之上。',
    artwork_url: MONO_ASSETS.sceneDeepseaLibrary,
    artwork_focal: '50% 45%',
    accent_hex: '#79D2E6',
    prompt_hint: {
      visual:
        'monumental sunken glass cathedral library beneath calm sapphire ocean waters, shafts of aqua sunlight streaming through ribbed dome onto dark wooden bookshelves',
      tone: 'otherworldly serenity, fantasy architectural awe',
    },
  },

  // ==================== 7. 道具卡 Prop ====================
  {
    card_id: 'prop_vintage_camera_r',
    card_type: 'prop',
    rarity: 'R',
    name: '银黑复古旁轴胶片相机',
    en_name: 'Classic 35mm Rangefinder Camera',
    theme_id: 'daily',
    theme_name: '日常生活',
    style_tags: ['摄影道具', '金属质感', '文艺旅拍'],
    description: '经典拉丝银顶与荔枝纹黑皮机械旁轴相机，挂在颈间或轻握手中瞬间赋予角色故事感与文艺气质。',
    artwork_url: MONO_ASSETS.propCamera,
    artwork_focal: '50% 50%',
    accent_hex: '#E2BD75',
    prompt_hint: {
      visual:
        'holding a classic brushed-silver and black-leather 35mm vintage rangefinder film camera with woven leather strap',
      tone: 'tactile analog craft, storytelling accessory',
    },
  },
  {
    card_id: 'prop_leather_satchel_n',
    card_type: 'prop',
    rarity: 'N',
    name: '手工焦糖皮质学院书包',
    en_name: 'Caramel Leather School Satchel',
    theme_id: 'school',
    theme_name: '校园青春',
    style_tags: ['学院配饰', '复古皮具', '百搭'],
    description: '温润焦糖色做旧牛皮单肩书包，搭配黄铜搭扣，自然融入校园与城市街拍。',
    accent_hex: '#DFC58E',
    prompt_hint: {
      visual:
        'carrying a structured vintage caramel-brown leather satchel bag with brushed brass buckles',
      tone: 'classic preppy detail, warm leather texture',
    },
  },
  {
    card_id: 'prop_arch_blueprints_n',
    card_type: 'prop',
    rarity: 'N',
    name: '建筑手稿卷筒与钢笔',
    en_name: 'Architectural Sketchbook & Pen',
    theme_id: 'occupation',
    theme_name: '职业角色',
    style_tags: ['职业道具', '工作室', '知性'],
    description: '米白棉纸素描本与黄铜钢笔，在窗边咖啡桌或工作室场景中强化创作者人设细节。',
    accent_hex: '#8BB6F8',
    prompt_hint: {
      visual:
        'resting beside an open linen-bound architectural sketchbook and a slender brass fountain pen on a sunlit wooden table',
      tone: 'cultured, creative studio mood',
    },
  },

  // ==================== 8. 风格特效卡 Effect ====================
  {
    card_id: 'effect_blue_butterfly_r',
    card_type: 'effect',
    rarity: 'R',
    name: '幽蓝星尘光蝶特效',
    en_name: 'Luminous Sapphire Butterfly',
    theme_id: 'gothic',
    theme_name: '哥德风格',
    style_tags: ['奇幻粒子', '蓝紫微光', '氛围杀器'],
    description: '半透明冰蓝与淡紫流光蝴蝶携细碎星尘环绕画面，瞬间将写实人像推向唯美幻想维度。',
    artwork_url: MONO_ASSETS.effectButterfly,
    artwork_focal: '50% 50%',
    accent_hex: '#8BB6F8',
    effect_kind: 'butterfly',
    prompt_hint: {
      visual:
        'ethereal translucent sapphire-blue glowing crystal butterflies drifting around the subject with delicate floating golden stardust motes',
      tone: 'magical luminescence, refined fantasy highlight',
    },
  },
  {
    card_id: 'effect_golden_bokeh_r',
    card_type: 'effect',
    rarity: 'R',
    name: '暮色暖金电影散景',
    en_name: 'Twilight Golden Cinema Bokeh',
    theme_id: 'daily',
    theme_name: '日常生活',
    style_tags: ['奶油散景', '暖调人像', '85mm镜头感'],
    description: '柔和如蜂蜜般的城市夜灯大光圈散景光斑，令人物肤色通透温润，充满日剧电影感。',
    accent_hex: '#E2BD75',
    effect_kind: 'golden_bokeh',
    prompt_hint: {
      visual:
        'creamy warm amber-gold circular city bokeh lights at f/1.4 shallow depth of field, soft golden hour rim glow',
      tone: 'cinematic romance, velvety warmth',
    },
  },
  {
    card_id: 'effect_sakura_mist_sr',
    card_type: 'effect',
    rarity: 'SR',
    name: '樱瓣微风与柔光日晕',
    en_name: 'Drifting Sakura Petals & Sunflare',
    theme_id: 'school',
    theme_name: '校园青春',
    style_tags: ['飘落花瓣', '逆光发丝', '日系胶片'],
    description: '前景虚化飘落的樱花花瓣与柔和逆光日晕交织，为校园与旅行写真注入流动呼吸感。',
    accent_hex: '#E59BB7',
    effect_kind: 'sakura_mist',
    prompt_hint: {
      visual:
        'delicate pale-pink cherry blossom petals drifting softly in foreground blur, warm natural lens bloom and backlit hair shimmer',
      tone: 'poetic spring nostalgia, airy brightness',
    },
  },
  {
    card_id: 'effect_kodak_film_n',
    card_type: 'effect',
    rarity: 'N',
    name: '35mm 复古胶片颗粒滤镜',
    en_name: '35mm Analog Film Grain',
    theme_id: 'travel',
    theme_name: '旅行风景',
    style_tags: ['柯达色调', '胶片颗粒', '自然纪实'],
    description: '微细胶片颗粒配合低对比青暖暗部调色，去除数码锐利感，呈现经典旅拍杂志质感。',
    accent_hex: '#DFC58E',
    effect_kind: 'film_grain',
    prompt_hint: {
      visual:
        'authentic Kodak Portra 400 35mm analog film color grading, subtle fine film grain, organic halation highlights',
      tone: 'nostalgic editorial documentary, organic texture',
    },
  },
  {
    card_id: 'effect_gothic_rays_ssr',
    card_type: 'effect',
    rarity: 'SSR',
    name: '教堂丁达尔圣光光柱',
    en_name: 'Cathedral Tyndall Light Shafts',
    theme_id: 'gothic',
    theme_name: '哥德风格',
    style_tags: ['丁达尔效应', '宗教感', '油画光影'],
    description: '从侧上方斜洒而下的浓郁暖金丁达尔光柱，空气中浮尘微亮，赋予画面油画般的神圣史诗感。',
    accent_hex: '#F3D99F',
    effect_kind: 'gothic_rays',
    prompt_hint: {
      visual:
        'dramatic volumetric golden Tyndall light beams cutting diagonally through shadowed air with glowing atmospheric dust motes, chiaroscuro lighting',
      tone: 'sacred theatricality, museum oil-painting light',
    },
  },
  {
    card_id: 'effect_cyber_rim_sr',
    card_type: 'effect',
    rarity: 'SR',
    name: '蓝紫全息边缘光效',
    en_name: 'Holographic Cyan-Violet Rim Light',
    theme_id: 'cyber',
    theme_name: '赛博未来',
    style_tags: ['冷暖撞色', '棱镜折射', '未来氛围'],
    description: '细腻克制的冰蓝与淡紫边缘轮廓光，沿发丝与肩线勾勒出精致的近未来科技氛围。',
    accent_hex: '#79D2E6',
    effect_kind: 'cyber_rim',
    prompt_hint: {
      visual:
        'subtle prismatic cyan and pale-violet rim lighting along hair and coat silhouette, crisp cool-warm nocturnal contrast',
      tone: 'sleek modern sci-fi, refined luminosity',
    },
  },
];

/**
 * Starter collection so all 8 Card Types and the flagship "Linxi + School Blazer + Twin Braids"
 * Combine & Create showcase work immediately on first visit!
 */
export const STARTER_CARD_IDS: string[] = [
  'char_linxi_sr',
  'costume_school_blazer_r',
  'costume_oatmeal_knit_n',
  'hair_twin_braids_r',
  'hair_loose_updo_n',
  'makeup_warm_tea_r',
  'pose_chin_rest_r',
  'pose_sakura_gentle_n',
  'scene_sakura_fuji_r',
  'prop_vintage_camera_r',
  'effect_golden_bokeh_r',
  'effect_sakura_mist_sr',
];

export const DEFAULT_RECIPE: CombineRecipe = {
  title: '樱花季 · 学院林溪写真企划',
  characterId: 'char_linxi_sr',
  costumeId: 'costume_school_blazer_r',
  hairstyleId: 'hair_twin_braids_r',
  makeupId: 'makeup_warm_tea_r',
  poseId: 'pose_sakura_gentle_n',
  sceneId: 'scene_sakura_fuji_r',
  propId: 'prop_vintage_camera_r',
  effectId: 'effect_sakura_mist_sr',
  medium: 'photography',
  customNote: '准备用于春季虚拟角色小红书与 IG 首套图文连载。',
};

/**
 * Resolves the best composite preview image for a CombineRecipe!
 * When Linxi is paired with the School Blazer or Twin Braids, uses our matched
 * composite lookbook photograph (mono_result_school_linxi)!
 */
export function resolveCompositePreviewUrl(
  recipe: CombineRecipe,
  cardMap: Map<string, StyleCard>
): { primaryUrl: string; sceneBackdropUrl?: string; isMatchedComposite: boolean } {
  const charCard = recipe.characterId ? cardMap.get(recipe.characterId) : undefined;
  const sceneCard = recipe.sceneId ? cardMap.get(recipe.sceneId) : undefined;

  const isLinxiSchoolCombo =
    recipe.characterId === 'char_linxi_sr' &&
    (recipe.costumeId === 'costume_school_blazer_r' ||
      recipe.hairstyleId === 'hair_twin_braids_r');

  if (isLinxiSchoolCombo) {
    return {
      primaryUrl: MONO_ASSETS.resultSchoolLinxi,
      sceneBackdropUrl: sceneCard?.artwork_url,
      isMatchedComposite: true,
    };
  }

  return {
    primaryUrl:
      charCard?.artwork_url ||
      sceneCard?.artwork_url ||
      MONO_ASSETS.charLinxi,
    sceneBackdropUrl: sceneCard?.artwork_url,
    isMatchedComposite: false,
  };
}

export function getPackPool(packId: ThemePackId, catalog: StyleCard[]): StyleCard[] {
  const themed = catalog.filter((c) => c.theme_id === packId);
  // Ensure every pack always has a rich cross-theme pull experience while prioritizing its own theme
  const others = catalog.filter((c) => c.theme_id !== packId);
  return themed.length >= 4 ? themed : [...themed, ...others.slice(0, 4)];
}

export type PackOpenSpec = 'single' | 'multi' | 'box';

export function openThemePack(
  packId: ThemePackId,
  spec: PackOpenSpec,
  catalog: StyleCard[],
  ownedIds: Set<string>
): StyleCard[] {
  const count = spec === 'single' ? 5 : spec === 'multi' ? 10 : 18;
  const themePool = catalog.filter((c) => c.theme_id === packId);
  const fullPool = catalog;
  const results: StyleCard[] = [];
  const tempOwned = new Set(ownedIds);

  const pickFrom = (pool: StyleCard[], minHighRarity = false): StyleCard => {
    const filtered = minHighRarity
      ? pool.filter((c) => c.rarity === 'SR' || c.rarity === 'SSR' || c.rarity === 'UR')
      : pool;
    const candidates = filtered.length > 0 ? filtered : pool;
    const weights = candidates.map((c) => {
      const base = RARITY_META[c.rarity].weight;
      const newBoost = !tempOwned.has(c.card_id) ? 2.1 : 0.65;
      return base * newBoost;
    });
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < candidates.length; i++) {
      r -= weights[i];
      if (r <= 0) return candidates[i];
    }
    return candidates[candidates.length - 1];
  };

  // Guarantee at least 1 SR+ on multi (10) and 2 SR+ on box (18)
  const guaranteedHigh = spec === 'box' ? 2 : spec === 'multi' ? 1 : 0;
  for (let i = 0; i < guaranteedHigh; i++) {
    const picked = pickFrom(themePool.length > 0 ? themePool : fullPool, true);
    results.push(picked);
    tempOwned.add(picked.card_id);
  }

  while (results.length < count) {
    // 75% from the chosen theme pack, 25% cross-theme discovery so any 8 types can drop
    const useTheme = themePool.length > 0 && Math.random() < 0.78;
    const picked = pickFrom(useTheme ? themePool : fullPool, false);
    results.push(picked);
    tempOwned.add(picked.card_id);
  }

  const order: Record<Rarity, number> = { N: 1, R: 2, SR: 3, SSR: 4, UR: 5 };
  return results.sort((a, b) => order[a.rarity] - order[b.rarity]);
}
