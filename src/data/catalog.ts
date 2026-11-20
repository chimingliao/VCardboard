import {
  BoosterPackDef,
  CardType,
  NarrativeCard,
  Rarity,
  RarityGroup,
  SeriesId,
} from '../types/card';

export const ART_ASSETS = {
  mili: '/src/assets/images/hero_mili_portrait_1795132808117.jpg',
  cangyuan: '/src/assets/images/hero_cangyuan_portrait_1795132807324.jpg',
  xiyin: '/src/assets/images/hero_xiyin_portrait_1795132806049.jpg',
  jinyu: '/src/assets/images/hero_jinyu_portrait_1795132807161.jpg',
  relationMiliCangyuan: '/src/assets/images/relation_mili_cangyuan_chr_1795132806812.jpg',
  sceneStardust: '/src/assets/images/scene_stardust_rooftop_1795132806951.jpg',
  sceneDeepsea: '/src/assets/images/scene_deepsea_library_1795132807743.jpg',
  sceneWasteland: '/src/assets/images/scene_wasteland_station_1795132807537.jpg',
} as const;

export const CARD_TYPE_META: Record<
  CardType,
  { label: string; short: string; mountRule: string; aiContribution: string }
> = {
  hero: {
    label: 'Hero 人物卡',
    short: '人物本体',
    mountRule: '角色根基，必须优先持有。服装、专属道具、专属写真均依附此卡。',
    aiContribution: '姓名、身世、性格、口头禅、弱点、外貌特征与基础世界观锚点',
  },
  photo: {
    label: '写真卡',
    short: '角色写真',
    mountRule: '依附指定 Hero。可单独收藏，也可作为图生图的画风与光影参考。',
    aiContribution: '画风、构图、神态与光影参考',
  },
  outfit: {
    label: '服装包',
    short: '外观模组',
    mountRule: '绑定单一 Hero。同一编组内，一个角色同一时间启用一套服装。',
    aiContribution: '服饰款式、材质、配色与配饰细节',
  },
  item: {
    label: '道具包',
    short: '物件模组',
    mountRule: '分为角色专属道具与通用道具，可多件同时挂载于同一角色。',
    aiContribution: '手持物、随身信物与装饰小物描述',
  },
  motion: {
    label: '动作包',
    short: '姿态模组',
    mountRule: '单人动作绑定 1 名 Hero；双人 / 多人动作自动校验所需角色数量。',
    aiContribution: '姿态、肢体关系、镜头角度与构图',
  },
  scene: {
    label: '场景包',
    short: '环境氛围',
    mountRule: '全局资源，不绑定角色。一个编组内同一时间启用一个场景。',
    aiContribution: '背景、时间、光影、天气与空间氛围词',
  },
  story: {
    label: '剧情包',
    short: '叙事碎片',
    mountRule: '分常驻片段与节点碎片，永久收藏不消耗，可在剧本编辑器自由拼接。',
    aiContribution: '台词、旁白、事件、情绪基调与冲突核',
  },
  relation: {
    label: '关系包',
    short: '羁绊模组',
    mountRule: '需同时选中 2 名及以上对应 Hero 才可启用，定义既有角色之间的关系性质。',
    aiContribution: '关系类型、专属对白、互动情绪与羁绊张力',
  },
  voice: {
    label: '语音包',
    short: '音色台词',
    mountRule: '扩展感官模块，依附指定 Hero，提供角色音色与语气参考。',
    aiContribution: '音色描述、语气台词与配音表演提示',
  },
  bgm: {
    label: 'BGM 氛围包',
    short: '听觉氛围',
    mountRule: '扩展感官模块，配对场景使用，定义短片与阅读时的听觉氛围。',
    aiContribution: '配器、节拍、环境白噪音与听觉情绪',
  },
};

export const RARITY_META: Record<
  Rarity,
  {
    name: string;
    cnName: string;
    group: RarityGroup;
    spec: string;
    dropWeight: number;
    rateLabel: string;
  }
> = {
  C: {
    name: 'Common',
    cnName: '普通',
    group: 'base',
    spec: '基础素材 · 标准版式',
    dropWeight: 28,
    rateLabel: '28.0%',
  },
  U: {
    name: 'Uncommon',
    cnName: '进阶',
    group: 'base',
    spec: '质感提升 · 常规构图',
    dropWeight: 24,
    rateLabel: '24.0%',
  },
  R: {
    name: 'Rare',
    cnName: '稀有',
    group: 'base',
    spec: '完整成品模组',
    dropWeight: 18,
    rateLabel: '18.0%',
  },
  RR: {
    name: 'Double Rare',
    cnName: '双重稀有',
    group: 'base',
    spec: 'Hero 人物本体标准档案卡',
    dropWeight: 10,
    rateLabel: '10.0%',
  },
  AR: {
    name: 'Art Rare',
    cnName: '艺术插画',
    group: 'chase',
    spec: '宽幅环境叙事 · 空间与氛围为主角',
    dropWeight: 6,
    rateLabel: '6.0%',
  },
  SR: {
    name: 'Super Rare',
    cnName: '超稀有',
    group: 'chase',
    spec: '去边框满版全图 · 主体铺满卡面',
    dropWeight: 5,
    rateLabel: '5.0%',
  },
  SAR: {
    name: 'Special Art Rare',
    cnName: '特殊艺术稀有',
    group: 'chase',
    spec: '独立名场面分镜 · 电影感叙事原画',
    dropWeight: 3,
    rateLabel: '3.0%',
  },
  UR: {
    name: 'Ultra Rare',
    cnName: '至臻稀有',
    group: 'chase',
    spec: '同设定文本 · 鎏金暗纹工艺变体',
    dropWeight: 2,
    rateLabel: '2.0%',
  },
  CHR: {
    name: 'Character Rare',
    cnName: '角色联动稀有',
    group: 'chase',
    spec: '关系包专属 · 2-3 人同框羁绊插画',
    dropWeight: 2.5,
    rateLabel: '2.5%',
  },
  CSR: {
    name: 'Character Super Rare',
    cnName: '角色联动超稀有',
    group: 'chase',
    spec: '宏大群像构图 · 多人关系顶级形态',
    dropWeight: 1.5,
    rateLabel: '1.5%',
  },
};

export const HERO_REGISTRY: Record<
  string,
  { id: string; name: string; title: string; series: string; portrait: string; color: string }
> = {
  mili: {
    id: 'mili',
    name: '蜜梨',
    title: '全息夜行歌姬',
    series: '星尘序章',
    portrait: ART_ASSETS.mili,
    color: '#B8A8D8',
  },
  cangyuan: {
    id: 'cangyuan',
    name: '苍渊',
    title: '雨夜星盘档案员',
    series: '星尘序章',
    portrait: ART_ASSETS.cangyuan,
    color: '#7FA3C7',
  },
  xiyin: {
    id: 'xiyin',
    name: '汐音',
    title: '深海声学潜录者',
    series: '深海回响',
    portrait: ART_ASSETS.xiyin,
    color: '#6BB8BE',
  },
  jinyu: {
    id: 'jinyu',
    name: '烬羽',
    title: '荒野高架信使',
    series: '荒野纪元',
    portrait: ART_ASSETS.jinyu,
    color: '#D69F5C',
  },
};

export const BOOSTER_PACKS: BoosterPackDef[] = [
  {
    pack_id: 'pack_stardust_heroes',
    series_id: 'stardust_prelude',
    series_name: '星尘序章',
    title: '星尘序章 · 角色本体包',
    subtitle: 'Hero 本体池 · 蜜梨 / 苍渊',
    pool_kind: 'hero_pool',
    world_tags: ['赛博都市', '全息', '近未来'],
    cover_art: ART_ASSETS.mili,
    foil_accent: '#B8A8D8',
    description: '收录「星尘序章」核心角色本体档案、满版立绘海报与独立美术写真切片，确保先拥有挂载主体。',
    guaranteed_note: '每包必含 1 张 Hero 本体或专属写真，与配件池严格分离',
    milestone_threshold: 10,
    hidden_reward_card_id: 'story_hidden_stardust_epilogue',
  },
  {
    pack_id: 'pack_stardust_modules',
    series_id: 'stardust_prelude',
    series_name: '星尘序章',
    title: '星尘序章 · 叙事配件包',
    subtitle: '服饰 / 动作 / 场景 / 剧情 / 关系',
    pool_kind: 'accessory_pool',
    world_tags: ['赛博都市', '全息', '雨夜'],
    cover_art: ART_ASSETS.sceneStardust,
    foil_accent: '#D8B467',
    description: '涵盖雨夜全息天台场景、建筑风服饰、随身信物、单双人姿态与「蜜梨 × 苍渊」CHR 羁绊插画。',
    guaranteed_note: '包含 AR 全景场景、UR 鎏金变体与 CHR 联动追逐位',
    milestone_threshold: 10,
    hidden_reward_card_id: 'story_hidden_stardust_epilogue',
  },
  {
    pack_id: 'pack_deepsea_complete',
    series_id: 'deepsea_echo',
    series_name: '深海回响',
    title: '深海回响 · 沉没档案包',
    subtitle: '汐音本体 + 深海图书馆全域素材',
    pool_kind: 'hero_pool',
    world_tags: ['深海遗迹', '声学', '秘境'],
    cover_art: ART_ASSETS.sceneDeepsea,
    foil_accent: '#6BB8BE',
    description: '探索海底沉没玻璃图书馆，收集声学潜录者「汐音」、珍珠斗篷服饰、音叉发饰与跨系列羁绊碎片。',
    guaranteed_note: '含汐音 RR/SR 档案与深海图书馆 AR 宽幅环境卡',
    milestone_threshold: 6,
    hidden_reward_card_id: 'scene_hidden_deepsea_tide',
  },
  {
    pack_id: 'pack_wasteland_complete',
    series_id: 'wasteland_era',
    series_name: '荒野纪元',
    title: '荒野纪元 · 日落铁道包',
    subtitle: '烬羽本体 + 废土高架站旅途素材',
    pool_kind: 'hero_pool',
    world_tags: ['废土铁路', '黄昏', '旅途'],
    cover_art: ART_ASSETS.sceneWasteland,
    foil_accent: '#D69F5C',
    description: '沿废弃高架铁路前行，收集信使「烬羽」、风化赭色斗篷、旧磁带信物与金色草海日落场景。',
    guaranteed_note: '含烬羽 RR/SAR 名场面与日落高架站 AR 场景卡',
    milestone_threshold: 6,
    hidden_reward_card_id: 'story_hidden_wasteland_letter',
  },
  {
    pack_id: 'pack_bond_resonance',
    series_id: 'bond_resonance',
    series_name: '羁绊回响篇',
    title: '羁绊回响篇 · 联动企划包',
    subtitle: '双人关系 / 多人动作 / 群像 CSR 专池',
    pool_kind: 'bond_special',
    world_tags: ['跨宇宙联动', '群像', '记忆'],
    cover_art: ART_ASSETS.relationMiliCangyuan,
    foil_accent: '#E9CF90',
    description: '专注人物关系与故事交汇点的独立企划包。高概率产出 CHR 双人羁绊、双人姿态与群像 CSR。',
    guaranteed_note: '每包必含 1 张关系包、双人动作包或时间线节点碎片',
    milestone_threshold: 5,
    hidden_reward_card_id: 'relation_hidden_quartet_csr',
  },
];

export const INITIAL_CATALOG: NarrativeCard[] = [
  // ==================== 系列 1：星尘序章 ====================
  {
    card_id: 'hero_mili_001',
    card_type: 'hero',
    rarity: 'RR',
    name: '蜜梨',
    subtitle: '全息夜行歌姬 · 标准本体档案',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['赛博都市', '全息', '近未来'],
    bind_hero: ['mili'],
    relation_targets: [],
    content: {
      summary: '在雨夜城市天台广播残缺旋律的半全息歌姬，习惯用哼唱替代解释。',
      profile: '出身于旧纪元声纹档案库的虚拟歌姬，夜间信号最稳定，常在蓝调时刻现身于高空露台与玻璃穹顶之下。',
      appearance: '银白长发、发梢泛着月光般的冷白微光，淡紫建筑感风衣配深炭色长裙。',
      traits: ['温柔', '略带任性', '夜行性'],
      catchphrase: '「别急着关掉频道，副歌还没落下来呢。」',
      weakness: '强正午日照会让她的投影边缘出现轻微噪点，讨厌过于喧闹的白昼。',
    },
    assets: ['hero_mili_poster.jpg'],
    artwork_url: ART_ASSETS.mili,
    artwork_focal: '50% 18%',
    accent_hex: '#B8A8D8',
    prompt_hint: {
      visual:
        'young woman virtual singer, long silver-white hair with subtly luminescent moonlit tips, composed gentle gaze, delicate holographic rim light',
      tone: 'gentle, slightly playful, nocturnal, poetic restraint',
    },
  },
  {
    card_id: 'photo_mili_sr_001',
    card_type: 'photo',
    rarity: 'SR',
    name: '蜜梨 · 蓝调露台满版海报',
    subtitle: '去边框全图 · 光影参考切片',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['赛博都市', '全息', '雨夜'],
    bind_hero: ['mili'],
    relation_targets: [],
    content: {
      summary: '去边框满版立绘海报，确立蜜梨在雨夜玻璃栏杆前的核心冷暖光影锚点。',
      profile: '适合直接作为图生图或角色一致性参考的基准美术切片，冷蓝雨云与暖金街灯在湿润地砖上形成柔和对比。',
    },
    assets: ['photo_mili_sr.jpg'],
    artwork_url: ART_ASSETS.mili,
    artwork_focal: '50% 25%',
    accent_hex: '#C4B5E6',
    prompt_hint: {
      visual:
        'full-bleed editorial anime poster framing, blue hour rain reflections on wet stone terrace, crisp cool-warm light contrast, painterly brush texture',
      tone: 'serene, atmospheric, iconic poster presence',
    },
  },
  {
    card_id: 'photo_mili_c_002',
    card_type: 'photo',
    rarity: 'C',
    name: '蜜梨 · 发梢微光半身切片',
    subtitle: '基础神态参考',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['全息', '近未来'],
    bind_hero: ['mili'],
    relation_targets: [],
    content: {
      summary: '聚焦侧颜与微光发梢的基础半身参考，便于稳定人物面部特征。',
    },
    assets: ['photo_mili_half.jpg'],
    artwork_url: ART_ASSETS.mili,
    artwork_focal: '52% 14%',
    accent_hex: '#B8A8D8',
    prompt_hint: {
      visual:
        'three-quarter bust portrait, soft side profile, translucent silver strands catching ambient twilight glow, clean anime linework',
      tone: 'quiet, intimate, understated',
    },
  },
  {
    card_id: 'hero_cangyuan_001',
    card_type: 'hero',
    rarity: 'RR',
    name: '苍渊',
    subtitle: '雨夜星盘档案员 · 标准本体档案',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['赛博都市', '观测塔', '近未来'],
    bind_hero: ['cangyuan'],
    relation_targets: [],
    content: {
      summary: '驻守旧观测塔的失眠档案员，用黄铜星盘校准城市里消失的频率。',
      profile: '表面是城市气象与信号档案管理员，暗中记录所有「不该存在的回声」。说话克制，只在提及星历与旧唱片时会放慢语速。',
      appearance: '微乱深灰蓝短发，琥珀色眼眸，结构感深靛蓝毛呢长外套配黄铜扣饰。',
      traits: ['克制冷静', '执着记录', '慢热守信'],
      catchphrase: '「频率没有消失，只是换了一层雨幕藏起来。」',
      weakness: '不擅长表达关怀，往往用修好一件旧物件来代替安慰。',
    },
    assets: ['hero_cangyuan_poster.jpg'],
    artwork_url: ART_ASSETS.cangyuan,
    artwork_focal: '50% 18%',
    accent_hex: '#7FA3C7',
    prompt_hint: {
      visual:
        'calm young man archivist, tousled dark slate-blue hair, warm amber eyes, reserved thoughtful expression, moody rain-streaked window lighting',
      tone: 'composed, melancholic, observant, quietly dependable',
    },
  },
  {
    card_id: 'photo_cangyuan_ar_001',
    card_type: 'photo',
    rarity: 'AR',
    name: '苍渊 · 观测窗畔的守夜',
    subtitle: '人物置身故事现场 · 宽幅氛围切片',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['观测塔', '雨夜'],
    bind_hero: ['cangyuan'],
    relation_targets: [],
    content: {
      summary: '高耸雨窗与案头星图构成的空间叙事画面，突出角色与观测环境的共生关系。',
    },
    assets: ['photo_cangyuan_ar.jpg'],
    artwork_url: ART_ASSETS.cangyuan,
    artwork_focal: '48% 36%',
    accent_hex: '#7FA3C7',
    prompt_hint: {
      visual:
        'environmental narrative anime illustration, character framed by tall rain-streaked observatory glass windows, hand-drawn star charts on wooden desk, deep indigo dusk',
      tone: 'contemplative, solitary, cinematic stillness',
    },
  },
  {
    card_id: 'outfit_mili_lavender_r',
    card_type: 'outfit',
    rarity: 'R',
    name: '淡紫建筑风衣套装',
    subtitle: '蜜梨常服 · 完整服饰模组',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['赛博都市', '近未来'],
    bind_hero: ['mili'],
    relation_targets: [],
    content: {
      summary: '高腰剪裁淡紫双排扣风衣，内搭炭黑百褶长裙与哑光短靴，兼具都市轻礼服感。',
      outfit_detail: '翻领处嵌有极细银丝折线，风衣下摆随高空夜风轻扬，肩扣带微弱全息折射。',
    },
    assets: ['outfit_mili_lavender.jpg'],
    artwork_url: ART_ASSETS.mili,
    artwork_focal: '50% 56%',
    accent_hex: '#B8A8D8',
    prompt_hint: {
      visual:
        'tailored pale lavender double-breasted architectural trench coat, belted waist, dark charcoal pleated midi dress underneath, matte black ankle boots, silver collar pin',
      tone: 'refined urban silhouette, understated futurism',
    },
  },
  {
    card_id: 'outfit_mili_concert_sr',
    card_type: 'outfit',
    rarity: 'SR',
    name: '星尘残响 · 透明纱礼服',
    subtitle: '蜜梨演出服 · 满版设计稿',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['全息', '星尘'],
    bind_hero: ['mili'],
    relation_targets: [],
    content: {
      summary: '由半透明星轨薄纱叠织而成的夜间演出长裙，行走时会落下细微光尘。',
      outfit_detail: '不对称披肩采用冷银欧根纱，腰间悬有极简频率刻度垂链，适合高光舞台或雨夜独唱场面。',
    },
    assets: ['outfit_mili_concert.jpg'],
    accent_hex: '#D8B467',
    prompt_hint: {
      visual:
        'layered translucent midnight-silver organza performance dress, asymmetrical gossamer capelet, delicate frequency-scale metallic waist chain, faint starlight sheen',
      tone: 'ethereal, ceremonial, luminous stage aura',
    },
  },
  {
    card_id: 'outfit_cangyuan_indigo_u',
    card_type: 'outfit',
    rarity: 'U',
    name: '深靛蓝黄铜扣大衣',
    subtitle: '苍渊常服 · 质感进阶模组',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['观测塔', '雨夜'],
    bind_hero: ['cangyuan'],
    relation_targets: [],
    content: {
      summary: '厚实深靛蓝立领毛呢长外套，搭配做旧黄铜盘扣与炭黑马甲，耐雨夜寒风。',
      outfit_detail: '袖口有轻微粉笔与星图墨渍细节，内袋刚好容下一枚袖珍星盘。',
    },
    assets: ['outfit_cangyuan_indigo.jpg'],
    artwork_url: ART_ASSETS.cangyuan,
    artwork_focal: '55% 60%',
    accent_hex: '#7FA3C7',
    prompt_hint: {
      visual:
        'structured deep indigo wool trench coat with standing collar, antique brass frog clasps, charcoal vest and black collared shirt underneath',
      tone: 'scholarly, weathered, nocturnal elegance',
    },
  },
  {
    card_id: 'item_brass_astrolabe_r',
    card_type: 'item',
    rarity: 'R',
    name: '旧纪元黄铜星盘',
    subtitle: '苍渊专属信物 · 核心物件',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['观测塔', '星尘'],
    bind_hero: ['cangyuan'],
    relation_targets: [],
    content: {
      summary: '刻有双层频段刻度的黄铜怀表星盘，每当接近全息残响时会自行轻颤。',
      item_note: '背面刻着早已失效的旧城经纬度，是苍渊追踪蜜梨信号的关键信物。',
    },
    assets: ['item_astrolabe.jpg'],
    artwork_url: ART_ASSETS.cangyuan,
    artwork_focal: '38% 54%',
    accent_hex: '#D8B467',
    prompt_hint: {
      visual:
        'holding an intricate antique brass pocket astrolabe with engraved celestial rings and fine mechanical dial, subtle warm metallic reflection',
      tone: 'tactile heirloom, quiet mystery',
    },
  },
  {
    card_id: 'item_transparent_umbrella_c',
    card_type: 'item',
    rarity: 'C',
    name: '雨滴折射透明长伞',
    subtitle: '通用道具 · 可挂载任意角色',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['雨夜', '赛博都市'],
    bind_hero: [],
    relation_targets: [],
    content: {
      summary: '一把沾满细密雨珠的透明长柄伞，能自然接住天台与街道的冷暖灯光折射。',
      item_note: '通用道具，可挂载给任意角色用于雨夜过场与双人共伞构图。',
    },
    assets: ['item_umbrella.svg'],
    accent_hex: '#9BB7D4',
    prompt_hint: {
      visual:
        'holding a clear raindrop-speckled umbrella with matte charcoal handle, refracting warm streetlamp bokeh and cool blue twilight',
      tone: 'intimate rainy atmosphere, delicate realism',
    },
  },
  {
    card_id: 'item_holo_earpiece_u',
    card_type: 'item',
    rarity: 'U',
    name: '月光单耳监听耳挂',
    subtitle: '蜜梨专属道具 · 物件模组',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['全息', '赛博都市'],
    bind_hero: ['mili'],
    relation_targets: [],
    content: {
      summary: '银丝镂空单耳监听耳挂，边缘随声波亮起极细的淡紫指示线。',
      item_note: '蜜梨只有在认真倾听某个人说话时才会摘下它。',
    },
    assets: ['item_earpiece.svg'],
    accent_hex: '#B8A8D8',
    prompt_hint: {
      visual:
        'delicate silver filigree single-ear acoustic earpiece with a hair-thin pale lavender light pulse tucked behind silver hair',
      tone: 'subtle high-tech elegance, intimate detail',
    },
  },
  {
    card_id: 'motion_solo_railing_c',
    card_type: 'motion',
    rarity: 'C',
    name: '倚栏远望 · 侧身半景',
    subtitle: '单人姿态 · 需 1 名 Hero',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['赛博都市', '雨夜'],
    bind_hero: [],
    relation_targets: [],
    motion_seats: 1,
    content: {
      summary: '角色轻倚玻璃栏杆，微侧过头望向远方城市天际线，发丝与衣角随夜风向右侧轻扬。',
      pose_camera: '中景三分法构图，机位略低于视线 10°，50mm 镜头浅景深，留出 40% 城市夜空呼吸感。',
    },
    assets: ['motion_railing.svg'],
    accent_hex: '#B8A8D8',
    prompt_hint: {
      visual:
        'medium three-quarter shot, leaning lightly beside glass railing, head turned gently toward distant city skyline, hair and coat hem swept by evening breeze, 50mm lens shallow depth of field',
      tone: 'wistful stillness, breathing negative space',
    },
  },
  {
    card_id: 'motion_duo_backtoback_r',
    card_type: 'motion',
    rarity: 'R',
    name: '穹顶下背身错肩',
    subtitle: '双人姿态 · 需同时选中 2 名 Hero',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['雨夜', '跨宇宙联动'],
    bind_hero: [],
    relation_targets: [],
    motion_seats: 2,
    content: {
      summary: '两名角色在开阔拱形空间内背身错肩而立，视线望向相反方向，却被中央飘浮的光尘隐秘相连。',
      pose_camera: '对称广角中全身构图，人物分居黄金分割左右两侧，中央保留光影与空间张力。',
    },
    assets: ['motion_duo_back.svg'],
    artwork_url: ART_ASSETS.relationMiliCangyuan,
    artwork_focal: '50% 42%',
    accent_hex: '#D8B467',
    prompt_hint: {
      visual:
        'symmetrical two-character cinematic framing, two figures standing back-to-back slightly offset in center space, gazing in opposite directions with glowing particles drifting between them, wide 35mm theatrical composition',
      tone: 'unspoken tension, dramatic symmetry, fateful distance',
    },
  },
  {
    card_id: 'scene_stardust_rooftop_r',
    card_type: 'scene',
    rarity: 'R',
    name: '雨夜全息天台',
    subtitle: '标准场景模组 · 全局可用',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['赛博都市', '全息', '雨夜'],
    bind_hero: [],
    relation_targets: [],
    content: {
      summary: '蓝调时刻刚下过小雨的高空观测天台，积水倒映着远处暖金色灯火与淡淡星轨投影。',
      scene_atmosphere: '时间：蓝调黄昏转夜｜天气：微雨初歇｜光影：冷蓝天光配暖金城市反射。',
    },
    assets: ['scene_stardust.jpg'],
    artwork_url: ART_ASSETS.sceneStardust,
    artwork_focal: '50% 50%',
    accent_hex: '#8FA5C9',
    prompt_hint: {
      visual:
        'rain-slicked futuristic rooftop observatory at blue hour twilight, wet concrete puddles reflecting warm champagne-gold skyline lights, faint lavender holographic constellations in misty night sky',
      tone: 'poetic blue-hour solitude, crisp rainy air',
    },
  },
  {
    card_id: 'scene_stardust_rooftop_ar',
    card_type: 'scene',
    rarity: 'AR',
    name: '雨夜全息天台 · 苍穹全景',
    subtitle: '艺术插画规格 · 场景成为叙事主角',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['赛博都市', '全息', '雨夜'],
    bind_hero: [],
    relation_targets: [],
    content: {
      summary: '宽幅拉远的雨夜观测台全景，人物缩小为空间中的一笔，让星轨、雨雾与整座城市的沉默成为绝对主角。',
      scene_atmosphere: '超广角电影镜头，强调建筑线条延伸感与云层之下悬浮的星座连线。',
    },
    assets: ['scene_stardust_ar.jpg'],
    artwork_url: ART_ASSETS.sceneStardust,
    artwork_focal: '50% 35%',
    accent_hex: '#D8B467',
    prompt_hint: {
      visual:
        'panoramic ultra-wide cinematic anime landscape of a rain-washed rooftop observatory overlooking a vast misty metropolis, luminous constellations woven across twilight clouds, architectural depth, atmospheric perspective',
      tone: 'vast, contemplative, widescreen cinema grandeur',
    },
  },
  {
    card_id: 'scene_stardust_rooftop_ur',
    card_type: 'scene',
    rarity: 'UR',
    name: '雨夜全息天台 · 鎏金典藏版',
    subtitle: '至臻工艺变体 · 同设定文本',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['赛博都市', '全息', '雨夜'],
    bind_hero: [],
    relation_targets: [],
    content: {
      summary: '蓝调时刻刚下过小雨的高空观测天台，积水倒映着远处暖金色灯火与淡淡星轨投影。（UR 工艺版：设定文本完全一致，升级鎏金暗纹与柔光收藏呈现。）',
      scene_atmosphere: '时间：蓝调黄昏转夜｜天气：微雨初歇｜光影：冷蓝天光配暖金城市反射。',
    },
    assets: ['scene_stardust_ur.jpg'],
    artwork_url: ART_ASSETS.sceneStardust,
    artwork_focal: '50% 45%',
    accent_hex: '#E9CF90',
    prompt_hint: {
      visual:
        'rain-slicked futuristic rooftop observatory at blue hour twilight, wet concrete puddles reflecting warm champagne-gold skyline lights, faint lavender holographic constellations in misty night sky',
      tone: 'poetic blue-hour solitude, crisp rainy air',
    },
  },
  {
    card_id: 'story_mili_monologue_u',
    card_type: 'story',
    rarity: 'U',
    name: '零点前的试音独白',
    subtitle: '常驻片段 · 蜜梨个人桥段',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['赛博都市', '全息'],
    bind_hero: ['mili'],
    relation_targets: [],
    story_kind: 'recurring',
    content: {
      summary: '每晚十一点五十分，蜜梨都会在空无一人的天台对着风声试唱三小节，确认这座城市还有人醒着。',
      dialogue_or_excerpt: '「信号格只剩一格也没关系，反正真正想听见这首歌的人，不会靠信号强度来找我。」',
    },
    assets: ['story_mili_01.txt'],
    accent_hex: '#B8A8D8',
    prompt_hint: {
      visual: 'soft close-up on parted lips humming into rainy twilight breeze, faint luminous breath',
      tone: 'intimate soliloquy, bittersweet anticipation',
    },
  },
  {
    card_id: 'story_node_prologue_r',
    card_type: 'story',
    rarity: 'R',
    name: '节点 01 · 未登记的午夜频段',
    subtitle: '时间线节点碎片 · 序章',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['赛博都市', '观测塔'],
    bind_hero: [],
    relation_targets: [],
    story_kind: 'node',
    timeline_order: 1,
    node_phase: '序章',
    content: {
      summary: '观测塔的频谱仪在凌晨一点捕获到一段不存在于任何公开频道的银色和弦，所有故事由此启动。',
      dialogue_or_excerpt: '记录员在值班日志空白处写下日期：今日无风，雨量微量，但在第 17 号频段听见了像是人的呼吸声。',
    },
    assets: ['story_node_01.txt'],
    accent_hex: '#7FA3C7',
    prompt_hint: {
      visual: 'glowing analog frequency trace flickering softly in a dim midnight archive room',
      tone: 'inciting mystery, quiet prelude',
    },
  },
  {
    card_id: 'story_node_turning_sar',
    card_type: 'story',
    rarity: 'SAR',
    name: '节点 03 · 玻璃穹顶下的信号断流',
    subtitle: '电影感名场面分镜 · 重大转折',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['赛博都市', '雨夜', '全息'],
    bind_hero: ['mili', 'cangyuan'],
    relation_targets: [],
    story_kind: 'node',
    timeline_order: 3,
    node_phase: '转折',
    content: {
      summary: '整座城区的全息基站突然断电三分钟，蜜梨的轮廓开始消散，苍渊却第一次在没有仪器的情况下记住了她的频率。',
      dialogue_or_excerpt: '「如果明天重启后我忘了这段旋律怎么办？」「没关系，我抄在纸上了——纸不会断电。」',
    },
    assets: ['story_sar_turning.jpg'],
    artwork_url: ART_ASSETS.relationMiliCangyuan,
    artwork_focal: '50% 35%',
    accent_hex: '#E9CF90',
    prompt_hint: {
      visual:
        'dramatic cinematic anime keyframe, city lights flickering out behind towering arched glass dome, warm lantern rim light illuminating drifting luminous fragments between two silhouettes',
      tone: 'high emotional stakes, fragile turning point, cinematic crescendo',
    },
  },
  {
    card_id: 'relation_mili_cangyuan_r',
    card_type: 'relation',
    rarity: 'R',
    name: '跨频共振 · 观测者与歌声',
    subtitle: '基础关系设定 · 蜜梨 × 苍渊',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['赛博都市', '全息', '观测塔'],
    bind_hero: ['mili', 'cangyuan'],
    relation_targets: ['mili', 'cangyuan'],
    content: {
      summary: '一个是游走于失真频段的虚拟歌姬，一个是执着校准失落频率的档案员；两人互为彼此存在的唯一佐证。',
      relation_type: '宿命共振 / 记录者与被记录者',
      tension_note: '越靠近真实频率，越容易察觉彼此属于不同时间层的脆弱距离。',
      dialogue_or_excerpt: '蜜梨：「你每次都只看着星盘，到底有没有在听我唱歌？」苍渊：「星盘的指针，一直都在跟着你的节拍走。」',
    },
    assets: ['relation_mc_base.txt'],
    accent_hex: '#C4B5E6',
    prompt_hint: {
      visual: 'subtle visual harmony between pale lavender luminescence and deep indigo shadow, quiet emotional pull',
      tone: 'restrained longing, quiet mutual anchor, unspoken devotion',
    },
  },
  {
    card_id: 'relation_mili_cangyuan_chr',
    card_type: 'relation',
    rarity: 'CHR',
    name: '跨频共振 · 玻璃穹顶的雨夜',
    subtitle: '角色联动稀有 · 蜜梨 × 苍渊双人同框插画',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['赛博都市', '雨夜', '全息'],
    bind_hero: ['mili', 'cangyuan'],
    relation_targets: ['mili', 'cangyuan'],
    content: {
      summary: '高耸玻璃拱顶车站下，两人背身错肩而立，悬浮于雨幕中的金色与淡蓝光片串联起一段尚未说破的约定。',
      relation_type: '宿命共振 · 双人羁绊名画',
      tension_note: '人潮在站台尽头远去，唯独他们之间留出一道缓慢流动的光尘带。',
      dialogue_or_excerpt: '「下一班电车开走之前，把你的星盘借我听一分钟吧。」',
    },
    assets: ['relation_mc_chr.jpg'],
    artwork_url: ART_ASSETS.relationMiliCangyuan,
    artwork_focal: '50% 34%',
    accent_hex: '#E9CF90',
    prompt_hint: {
      visual:
        'two-character narrative illustration under a soaring arched glass station dome at twilight rain, silver-haired woman in pale lavender coat and dark-haired man in deep indigo coat standing back-to-back with warm gold and cyan floating holographic fragments drifting between them',
      tone: 'bittersweet resonance, cinematic tenderness, fateful bond',
    },
  },
  {
    card_id: 'voice_mili_soft_c',
    card_type: 'voice',
    rarity: 'C',
    name: '蜜梨 · 气声低吟音色卡',
    subtitle: '语音扩展模块 · 依附蜜梨',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['全息'],
    bind_hero: ['mili'],
    relation_targets: [],
    content: {
      summary: '略带电流颗粒感的轻柔气声女声，语尾习惯上扬半音，仿佛隔着雨夜玻璃轻声说话。',
      audio_cue: '语速偏慢，带极细微的老式麦克风温暖底噪与轻声哼唱停顿。',
    },
    assets: ['voice_mili.wav'],
    accent_hex: '#B8A8D8',
    prompt_hint: {
      visual: 'gentle soft-spoken expression, relaxed posture',
      tone: 'breathy, velvety soprano with delicate vintage broadcast warmth',
    },
  },
  {
    card_id: 'bgm_stardust_rain_u',
    card_type: 'bgm',
    rarity: 'U',
    name: '蓝调雨滴与弱音钢琴',
    subtitle: 'BGM 氛围扩展 · 配对雨夜场景',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['雨夜', '赛博都市'],
    bind_hero: [],
    relation_targets: [],
    content: {
      summary: '以毛毡弱音钢琴为主线，叠入玻璃穹顶外稀疏雨点与远处高架轻轨的低频回响。',
      audio_cue: '68 BPM · D 小调 · 留白克制，适合独白与双人慢镜头对话。',
    },
    assets: ['bgm_stardust_rain.mp3'],
    accent_hex: '#8FA5C9',
    prompt_hint: {
      visual: 'tranquil nocturnal pacing, lingering cinematic frames',
      tone: 'felt piano minimalism, distant rain percussion, wistful calm',
    },
  },

  // ==================== 系列 2：深海回响 ====================
  {
    card_id: 'hero_xiyin_001',
    card_type: 'hero',
    rarity: 'RR',
    name: '汐音',
    subtitle: '深海声学潜录者 · 标准本体档案',
    series: '深海回响',
    series_id: 'deepsea_echo',
    world_tags: ['深海遗迹', '声学', '秘境'],
    bind_hero: ['xiyin'],
    relation_targets: [],
    content: {
      summary: '长年独居沉没玻璃图书馆的声学潜录者，用音叉采集海底洋流与失落书页的共振。',
      profile: '相信大海会保存陆地上所有被遗忘的对话。她习惯赤足走过回廊，听见细微水压变化便能分辨季节更迭。',
      appearance: '深青绿色长发在微光中浮散，身披半透明珍珠白兜帽海纹披风，发间别有银色微缩音叉。',
      traits: ['沉静敏锐', '好奇纯粹', '擅长倾听'],
      catchphrase: '「别出声，这一层玻璃外面有群鱼正在经过。」',
      weakness: '对陆地上的匆忙节奏感到眩晕，在干燥环境里总想靠近水源。',
    },
    assets: ['hero_xiyin_poster.jpg'],
    artwork_url: ART_ASSETS.xiyin,
    artwork_focal: '50% 22%',
    accent_hex: '#6BB8BE',
    prompt_hint: {
      visual:
        'serene young woman acoustic diver, flowing dark teal hair, gentle luminous eyes, silver tuning-fork hair ornament, underwater sunbeams and cobalt caustics',
      tone: 'translucent serenity, contemplative wonder, aqueous stillness',
    },
  },
  {
    card_id: 'photo_xiyin_sr_001',
    card_type: 'photo',
    rarity: 'SR',
    name: '汐音 · 水光穹顶满版立绘',
    subtitle: '去边框全图 · 海洋水色光影参考',
    series: '深海回响',
    series_id: 'deepsea_echo',
    world_tags: ['深海遗迹', '声学'],
    bind_hero: ['xiyin'],
    relation_targets: [],
    content: {
      summary: '水彩与透明光影交织的满版立绘，捕捉汐音在沉没穹顶中以指尖拨动声波涟漪的瞬间。',
    },
    assets: ['photo_xiyin_sr.jpg'],
    artwork_url: ART_ASSETS.xiyin,
    artwork_focal: '50% 28%',
    accent_hex: '#6BB8BE',
    prompt_hint: {
      visual:
        'full-bleed watercolor anime artbook illustration, translucent aqua light shafts through domed conservatory roof, subtle glowing musical wave lines around raised fingertips',
      tone: 'luminous, hushed, dreamlike marine sanctuary',
    },
  },
  {
    card_id: 'outfit_xiyin_pearl_r',
    card_type: 'outfit',
    rarity: 'R',
    name: '珍珠薄纱潜录披风',
    subtitle: '汐音常服 · 完整外观模组',
    series: '深海回响',
    series_id: 'deepsea_echo',
    world_tags: ['深海遗迹', '秘境'],
    bind_hero: ['xiyin'],
    relation_targets: [],
    content: {
      summary: '半透明珍珠白连帽短披风，边缘以银线绣出海藻与声纹折线，内搭深海蓝功能潜录服。',
      outfit_detail: '在透射水光下会呈现出类似贝母内壁的柔和虹彩，既轻盈又具备耐压实用感。',
    },
    assets: ['outfit_xiyin_pearl.jpg'],
    artwork_url: ART_ASSETS.xiyin,
    artwork_focal: '50% 58%',
    accent_hex: '#6BB8BE',
    prompt_hint: {
      visual:
        'translucent pearl-white hooded marine cape with delicate silver wave embroidery worn over a fitted deep-navy acoustic diving suit, subtle mother-of-pearl sheen',
      tone: 'graceful utilitarian, luminous marine craft',
    },
  },
  {
    card_id: 'item_tuning_fork_u',
    card_type: 'item',
    rarity: 'U',
    name: '银制 432Hz 沉海音叉',
    subtitle: '汐音专属信物 · 声学物件',
    series: '深海回响',
    series_id: 'deepsea_echo',
    world_tags: ['声学', '深海遗迹'],
    bind_hero: ['xiyin'],
    relation_targets: [],
    content: {
      summary: '敲击后会释放极长余韵的纯银音叉，可在深海玻璃回廊中唤醒沉睡的旧语音胶囊。',
      item_note: '平时作为发饰别在兜帽侧缘，需要记录时取下轻敲掌心。',
    },
    assets: ['item_fork.svg'],
    accent_hex: '#6BB8BE',
    prompt_hint: {
      visual: 'holding a slender engraved silver tuning fork emitting subtle concentric acoustic light ripples',
      tone: 'crystalline resonance, delicate ritual',
    },
  },
  {
    card_id: 'motion_solo_listening_u',
    card_type: 'motion',
    rarity: 'U',
    name: '指尖触波 · 仰望穹顶',
    subtitle: '单人姿态 · 需 1 名 Hero',
    series: '深海回响',
    series_id: 'deepsea_echo',
    world_tags: ['深海遗迹', '声学'],
    bind_hero: [],
    relation_targets: [],
    motion_seats: 1,
    content: {
      summary: '微仰起头望向穹顶透下的天光，双手轻抬于胸前，宛如在空气中轻触无形的波纹。',
      pose_camera: '低角度仰拍中近景，突出头顶穹顶几何结构与指尖微光层次。',
    },
    assets: ['motion_listening.svg'],
    accent_hex: '#6BB8BE',
    prompt_hint: {
      visual:
        'low-angle medium shot looking slightly upward, head tilted gently toward overhead dome light, both hands lifted delicately as if sensing invisible ripples in air',
      tone: 'reverent curiosity, weightless grace',
    },
  },
  {
    card_id: 'scene_deepsea_library_r',
    card_type: 'scene',
    rarity: 'R',
    name: '沉没玻璃图书馆',
    subtitle: '标准场景模组 · 全局可用',
    series: '深海回响',
    series_id: 'deepsea_echo',
    world_tags: ['深海遗迹', '秘境'],
    bind_hero: [],
    relation_targets: [],
    content: {
      summary: '建于海底裂谷之上的古典拱形玻璃图书馆，木质书架在深蓝海水折射的柔和光柱里静默矗立。',
      scene_atmosphere: '时间：深海午后透光｜天气：静谧洋流｜光影：天顶青蓝光束与壁灯暖光交错。',
    },
    assets: ['scene_deepsea.jpg'],
    artwork_url: ART_ASSETS.sceneDeepsea,
    artwork_focal: '50% 50%',
    accent_hex: '#6BB8BE',
    prompt_hint: {
      visual:
        'sunken arched glass cathedral library beneath calm sapphire ocean, towering dark wood bookshelves, warm small brass wall sconces contrasting with translucent pale aqua sunlight shafts from above',
      tone: 'hushed sanctuary, timeless underwater majesty',
    },
  },
  {
    card_id: 'scene_deepsea_library_ar',
    card_type: 'scene',
    rarity: 'AR',
    name: '沉没玻璃图书馆 · 深渊透光全景',
    subtitle: '艺术插画规格 · 宏大空间叙事',
    series: '深海回响',
    series_id: 'deepsea_echo',
    world_tags: ['深海遗迹', '秘境'],
    bind_hero: [],
    relation_targets: [],
    content: {
      summary: '对称宏阔的穹顶全景构图，数层走廊与深海鱼群剪影在弧形玻璃外缓缓游弋。',
      scene_atmosphere: '24mm 广角建筑透视，强调人类文明遗迹与深海自然力量的庄严静谧。',
    },
    assets: ['scene_deepsea_ar.jpg'],
    artwork_url: ART_ASSETS.sceneDeepsea,
    artwork_focal: '50% 30%',
    accent_hex: '#8EDCE2',
    prompt_hint: {
      visual:
        'grand symmetrical wide-angle architectural anime illustration of an underwater glass cathedral library, soaring ribbed dome bathed in oceanic sunbeams, tiny glowing fish beyond curved glass',
      tone: 'monumental silence, awe-inspiring serenity',
    },
  },
  {
    card_id: 'story_node_deepsea_r',
    card_type: 'story',
    rarity: 'R',
    name: '节点 02 · 漂流瓶中的旧星历',
    subtitle: '时间线节点碎片 · 相遇',
    series: '深海回响',
    series_id: 'deepsea_echo',
    world_tags: ['深海遗迹', '观测塔'],
    bind_hero: ['xiyin'],
    relation_targets: [],
    story_kind: 'node',
    timeline_order: 2,
    node_phase: '相遇',
    content: {
      summary: '汐音在图书馆第三排防水书柜后，拾到了一枚封存着陆地观测塔频率图谱的铜管胶囊。',
      dialogue_or_excerpt: '「上面的字迹被海盐洇开了，但我听得出来——写下它的人，一直在等某个不会回信的夜晚。」',
    },
    assets: ['story_node_02.txt'],
    accent_hex: '#6BB8BE',
    prompt_hint: {
      visual: 'delicate brass cylinder resting on a dry oak reading table under cool turquoise dome light',
      tone: 'serendipitous discovery, quiet bridge across worlds',
    },
  },
  {
    card_id: 'bgm_deepsea_hum_c',
    card_type: 'bgm',
    rarity: 'C',
    name: '玻璃穹顶下的洋流低鸣',
    subtitle: 'BGM 氛围扩展 · 配对深海场景',
    series: '深海回响',
    series_id: 'deepsea_echo',
    world_tags: ['深海遗迹', '声学'],
    bind_hero: [],
    relation_targets: [],
    content: {
      summary: '大提琴泛音与远方低沉水压回响交融，偶有一声清脆银色音叉泛音划过寂静。',
      audio_cue: '自由节拍 · 空间混响宽阔 · 极致沉静。',
    },
    assets: ['bgm_deepsea.mp3'],
    accent_hex: '#6BB8BE',
    prompt_hint: {
      visual: 'slow drifting dust motes and undulating water-light caustics',
      tone: 'ambient cello harmonics, deep oceanic hush',
    },
  },

  // ==================== 系列 3：荒野纪元 ====================
  {
    card_id: 'hero_jinyu_001',
    card_type: 'hero',
    rarity: 'RR',
    name: '烬羽',
    subtitle: '荒野高架信使 · 标准本体档案',
    series: '荒野纪元',
    series_id: 'wasteland_era',
    world_tags: ['废土铁路', '黄昏', '旅途'],
    bind_hero: ['jinyu'],
    relation_targets: [],
    content: {
      summary: '沿着停运高架铁路往返各处遗迹的独立信使，背包里永远留着一格装「地址已消失的信件」。',
      profile: '性格坦率温和，相信哪怕城市沉没或搬迁，写给某人的话语也值得被送到风能吹到的尽头。',
      appearance: '被夕阳晚风吹散的栗色短发，目光笃定清澈，披着磨损修补过的赭黄色麻布旅人斗篷，斜挎厚实旧皮革邮差包。',
      traits: ['坦率温暖', '脚步笃定', '念旧重诺'],
      catchphrase: '「只要铁轨还在往前面伸，信就还没算投递失败。」',
      weakness: '经常为了帮素昧平生的路人绕远路，导致自己的地图永远比别人晚一季。',
    },
    assets: ['hero_jinyu_poster.jpg'],
    artwork_url: ART_ASSETS.jinyu,
    artwork_focal: '50% 24%',
    accent_hex: '#D69F5C',
    prompt_hint: {
      visual:
        'resolute young courier with windswept chestnut-amber hair, warm steady gaze, weathered ochre travel cloak and worn leather satchel, golden sunset rim lighting',
      tone: 'warm resilience, nostalgic freedom, earnest humanity',
    },
  },
  {
    card_id: 'photo_jinyu_sar_001',
    card_type: 'photo',
    rarity: 'SAR',
    name: '烬羽 · 最后一班日落专列',
    subtitle: '特殊艺术稀有 · 电影感高光名场面',
    series: '荒野纪元',
    series_id: 'wasteland_era',
    world_tags: ['废土铁路', '黄昏'],
    bind_hero: ['jinyu'],
    relation_targets: [],
    content: {
      summary: '夕阳沉入金色草海地平线的刹那，锈迹斑斑的旧列车缓缓驶过她身后的高架轨道，风衣在余晖中猎猎扬起。',
    },
    assets: ['photo_jinyu_sar.jpg'],
    artwork_url: ART_ASSETS.jinyu,
    artwork_focal: '50% 34%',
    accent_hex: '#E9CF90',
    prompt_hint: {
      visual:
        'cinematic anime film keyframe, golden hour sun sinking over endless amber grassland, rusted elevated desert express train gliding behind a cloaked courier on weathered concrete platform, dust motes glowing in warm breeze',
      tone: 'epic warmth, nostalgic departure, cinema scope',
    },
  },
  {
    card_id: 'outfit_jinyu_cloak_r',
    card_type: 'outfit',
    rarity: 'R',
    name: '风化赭色麻布旅篷',
    subtitle: '烬羽常服 · 完整外观模组',
    series: '荒野纪元',
    series_id: 'wasteland_era',
    world_tags: ['废土铁路', '旅途'],
    bind_hero: ['jinyu'],
    relation_targets: [],
    content: {
      summary: '带有手工补丁针脚的厚麻布赭色斗篷，内搭深灰耐磨工装与皮质护腕，适合长途荒野徒步。',
      outfit_detail: '下摆沾着草籽与微尘，肩扣挂有不同站台的旧车票金属扣。',
    },
    assets: ['outfit_jinyu_cloak.jpg'],
    artwork_url: ART_ASSETS.jinyu,
    artwork_focal: '50% 62%',
    accent_hex: '#D69F5C',
    prompt_hint: {
      visual:
        'weathered ochre linen hooded travel cloak with stitched patches, charcoal scarf, utilitarian olive-grey tunic, leather fingerless gloves and sturdy cross-body courier bag',
      tone: 'lived-in craftsmanship, warm earthy palette',
    },
  },
  {
    card_id: 'item_cassette_bundle_c',
    card_type: 'item',
    rarity: 'C',
    name: '未寄出的贴标旧磁带',
    subtitle: '通用道具 · 记忆信物',
    series: '荒野纪元',
    series_id: 'wasteland_era',
    world_tags: ['旅途', '记忆'],
    bind_hero: [],
    relation_targets: [],
    content: {
      summary: '一盘手写标签已经泛黄的 60 分钟空白磁带，A 面只录了三分钟雨声与一段模糊歌声。',
      item_note: '通用道具，可作为串联荒野与赛博都市时间线的关键伏笔信物。',
    },
    assets: ['item_cassette.svg'],
    accent_hex: '#D69F5C',
    prompt_hint: {
      visual: 'holding a vintage translucent amber cassette tape with handwritten paper label and slightly worn edges',
      tone: 'tangible nostalgia, analog memory',
    },
  },
  {
    card_id: 'scene_wasteland_station_r',
    card_type: 'scene',
    rarity: 'R',
    name: '日落高架电车站',
    subtitle: '标准场景模组 · 全局可用',
    series: '荒野纪元',
    series_id: 'wasteland_era',
    world_tags: ['废土铁路', '黄昏', '旅途'],
    bind_hero: [],
    relation_targets: [],
    content: {
      summary: '矗立在无垠金秋草海之上的废弃高架月台，生锈信号灯与长椅被落日镀上一层温柔的玫瑰金色。',
      scene_atmosphere: '时间：日落前二十分钟｜天气：晴朗有微风｜光影：低角度暖琥珀逆光。',
    },
    assets: ['scene_wasteland.jpg'],
    artwork_url: ART_ASSETS.sceneWasteland,
    artwork_focal: '50% 50%',
    accent_hex: '#D69F5C',
    prompt_hint: {
      visual:
        'abandoned elevated railway platform overlooking an endless ocean of golden autumn grass at sunset, rusted steel beams and signal lamps catching warm amber and rose dusk light',
      tone: 'nostalgic warmth, serene open horizon',
    },
  },
  {
    card_id: 'scene_wasteland_station_ar',
    card_type: 'scene',
    rarity: 'AR',
    name: '日落高架电车站 · 草海地平线全景',
    subtitle: '艺术插画规格 · 宽幅空间主角',
    series: '荒野纪元',
    series_id: 'wasteland_era',
    world_tags: ['废土铁路', '黄昏', '旅途'],
    bind_hero: [],
    relation_targets: [],
    content: {
      summary: '蜿蜒铁轨向炽热云霞深处无限延伸的宽幅画卷，空荡木长椅仿佛仍在等待某场迟到的重逢。',
      scene_atmosphere: '电影级 16:9 远景纵深，云层与草浪形成舒展的水平构图张力。',
    },
    assets: ['scene_wasteland_ar.jpg'],
    artwork_url: ART_ASSETS.sceneWasteland,
    artwork_focal: '50% 42%',
    accent_hex: '#E6AE67',
    prompt_hint: {
      visual:
        'panoramic anime cinema landscape of curving rusted railway tracks stretching into a luminous golden sunset above rolling fields of autumn reeds, empty weathered station bench, dramatic rose-gold clouds',
      tone: 'sweeping nostalgia, luminous solitude',
    },
  },
  {
    card_id: 'story_node_farewell_r',
    card_type: 'story',
    rarity: 'R',
    name: '节点 04 · 没有终点的月台告别',
    subtitle: '时间线节点碎片 · 告别',
    series: '荒野纪元',
    series_id: 'wasteland_era',
    world_tags: ['废土铁路', '黄昏'],
    bind_hero: ['jinyu'],
    relation_targets: [],
    story_kind: 'node',
    timeline_order: 4,
    node_phase: '告别',
    content: {
      summary: '信件全部投递完毕的那天黄昏，烬羽把最后一枚未拆封的录音磁带放在长椅上，迎着风走向下一段铁轨。',
      dialogue_or_excerpt: '「不用送我啦。如果下一次起风时你又听见旋律，就当是我从东边发来的回信。」',
    },
    assets: ['story_node_04.txt'],
    accent_hex: '#D69F5C',
    prompt_hint: {
      visual: 'warm backlit silhouette waving gently before turning down a sunlit elevated track',
      tone: 'hopeful parting, lingering golden glow',
    },
  },

  // ==================== 系列 4：羁绊回响篇（联动专池） ====================
  {
    card_id: 'relation_cangyuan_xiyin_chr',
    card_type: 'relation',
    rarity: 'CHR',
    name: '旧谱共鸣 · 观测塔与深海回廊',
    subtitle: '角色联动稀有 · 苍渊 × 汐音',
    series: '羁绊回响篇',
    series_id: 'bond_resonance',
    world_tags: ['跨宇宙联动', '声学', '观测塔'],
    bind_hero: ['cangyuan', 'xiyin'],
    relation_targets: ['cangyuan', 'xiyin'],
    content: {
      summary: '一个在陆地高塔仰望星轨，一个在海底穹顶倾听洋流；同一套旧纪元频谱把两位素未谋面的记录者连接在同一页档案里。',
      relation_type: '隔空同僚 / 档案共鸣',
      tension_note: '两人隔着千米海水与云层交换批注，始终不知道对方的真实姓名，却最懂彼此字迹里的沉默。',
      dialogue_or_excerpt: '汐音：「你在第 14 页画的波形，和海底退潮前十秒的回声一模一样。」',
    },
    assets: ['relation_cx_chr.jpg'],
    artwork_url: ART_ASSETS.sceneDeepsea,
    artwork_focal: '50% 40%',
    accent_hex: '#6BB8BE',
    prompt_hint: {
      visual:
        'dual-character narrative composition contrasting deep indigo observatory rain glass with luminous sapphire underwater library arches, brass astrolabe and silver tuning fork resonating in parallel',
      tone: 'intellectual tenderness, quiet kinship across distance',
    },
  },
  {
    card_id: 'relation_mili_jinyu_chr',
    card_type: 'relation',
    rarity: 'CHR',
    name: '未寄出的磁带 · 夜色与日落',
    subtitle: '角色联动稀有 · 蜜梨 × 烬羽',
    series: '羁绊回响篇',
    series_id: 'bond_resonance',
    world_tags: ['跨宇宙联动', '旅途', '记忆'],
    bind_hero: ['mili', 'jinyu'],
    relation_targets: ['mili', 'jinyu'],
    content: {
      summary: '蜜梨曾在全息电台录下一首无人签收的歌，数十年后却被荒野信使烬羽当作旅途护身符随身携带。',
      relation_type: '跨时代回响 / 歌者与听众',
      tension_note: '从未处于同一白昼的两人，借由一盘磨损的旧磁带完成了跨越纪元的初次问候。',
      dialogue_or_excerpt: '烬羽：「原来磁带里那位怕晒太阳的歌姬，就是你啊。」',
    },
    assets: ['relation_mj_chr.jpg'],
    artwork_url: ART_ASSETS.sceneWasteland,
    artwork_focal: '50% 45%',
    accent_hex: '#D69F5C',
    prompt_hint: {
      visual:
        'poetic two-character illustration bridging twilight pale-lavender holographic light with warm amber sunset grassland, silver-haired singer and chestnut-haired courier sharing an antique cassette tape',
      tone: 'warm discovery, time-bridging friendship',
    },
  },
  {
    card_id: 'motion_duo_earphones_u',
    card_type: 'motion',
    rarity: 'U',
    name: '并肩分戴一副监听耳机',
    subtitle: '双人姿态 · 需同时选中 2 名 Hero',
    series: '羁绊回响篇',
    series_id: 'bond_resonance',
    world_tags: ['跨宇宙联动', '记忆'],
    bind_hero: [],
    relation_targets: [],
    motion_seats: 2,
    content: {
      summary: '两名角色并排坐在长椅或台阶上，微倾肩膀共享同一段音频，视线落在前方同一处光影。',
      pose_camera: '平视中近景，轻微浅景深虚化前景雨帘或草穗，呈现安静亲近的呼吸感。',
    },
    assets: ['motion_earphones.svg'],
    accent_hex: '#E9CF90',
    prompt_hint: {
      visual:
        'eye-level intimate two-character shot, sitting side by side on a weathered bench sharing a wired acoustic earpiece, shoulders slightly inclined toward each other, peaceful shared gaze',
      tone: 'unhurried closeness, quiet warmth',
    },
  },
  {
    card_id: 'motion_ensemble_convergence_sr',
    card_type: 'motion',
    rarity: 'SR',
    name: '群像交汇 · 四向星轨站位',
    subtitle: '多人姿态 · 需同时选中 3 名及以上 Hero',
    series: '羁绊回响篇',
    series_id: 'bond_resonance',
    world_tags: ['跨宇宙联动', '群像'],
    bind_hero: [],
    relation_targets: [],
    motion_seats: 3,
    content: {
      summary: '三至四名来自不同篇章的角色在开阔建筑空间内错落分布，形成电影海报级的多层次前后景站位。',
      pose_camera: '广角群像分层构图，前景侧影、中景主位与远景守望者构成完整叙事张力。',
    },
    assets: ['motion_ensemble.svg'],
    accent_hex: '#E9CF90',
    prompt_hint: {
      visual:
        'layered ensemble cinematic poster composition featuring three or more distinct characters positioned across foreground, midground, and architectural background, cohesive directional rim lighting',
      tone: 'grand convergence, ensemble storytelling',
    },
  },
  {
    card_id: 'relation_ensemble_csr',
    card_type: 'relation',
    rarity: 'CSR',
    name: '四重奏 · 越界频率',
    subtitle: '角色联动超稀有 · 宏大群像羁绊',
    series: '羁绊回响篇',
    series_id: 'bond_resonance',
    world_tags: ['跨宇宙联动', '群像', '记忆'],
    bind_hero: ['mili', 'cangyuan', 'xiyin', 'jinyu'],
    relation_targets: ['mili', 'cangyuan', 'xiyin'],
    content: {
      summary: '当全息歌声、黄铜星盘、深海音叉与荒野磁带在同一时刻共鸣，三个原本孤立的世界观在黄昏交界处短暂停泊。',
      relation_type: '跨宇宙群像羁绊 · 终章合奏',
      tension_note: '每个人都只握有一块残缺拼图，唯独同框时才能听见完整的世界原声。',
      dialogue_or_excerpt: '「原来我们一直都在同一个宇宙里，只是各自守着不同的天色。」',
    },
    assets: ['relation_quartet_csr.jpg'],
    artwork_url: ART_ASSETS.relationMiliCangyuan,
    artwork_focal: '50% 25%',
    accent_hex: '#E9CF90',
    prompt_hint: {
      visual:
        'epic multi-character anime artbook spread uniting four travelers beneath an expansive twilight sky where city constellations, ocean caustics, and golden sunset dust harmonize in one sweeping frame',
      tone: 'transcendent convergence, culminating symphony',
    },
  },

  // ==================== 系列集齐隐藏解锁内容（新增叙事，非数值） ====================
  {
    card_id: 'story_hidden_stardust_epilogue',
    card_type: 'story',
    rarity: 'SAR',
    name: '隐藏终章 · 天亮后的第二遍副歌',
    subtitle: '星尘序章集齐解锁 · 新增隐藏剧情',
    series: '星尘序章',
    series_id: 'stardust_prelude',
    world_tags: ['赛博都市', '全息', '记忆'],
    bind_hero: ['mili', 'cangyuan'],
    relation_targets: [],
    story_kind: 'node',
    timeline_order: 5,
    node_phase: '隐藏尾声',
    hidden_unlock: true,
    content: {
      summary: '星尘序章补全达到里程碑后解锁的隐藏篇章：清晨第一缕阳光穿过观测塔，蜜梨第一次没有在白昼消散。',
      dialogue_or_excerpt: '「你看，你抄在纸上的旋律，真的替我留住了早上的风。」',
    },
    assets: ['story_hidden_stardust.txt'],
    artwork_url: ART_ASSETS.sceneStardust,
    artwork_focal: '50% 40%',
    accent_hex: '#E9CF90',
    prompt_hint: {
      visual: 'first pale gold dawn rays breaking over a rain-washed observatory terrace, shimmering silver hair catching morning light',
      tone: 'cathartic dawn, earned quiet miracle',
    },
  },
  {
    card_id: 'scene_hidden_deepsea_tide',
    card_type: 'scene',
    rarity: 'UR',
    name: '隐藏秘境 · 潮汐归零时的水面穹顶',
    subtitle: '深海回响集齐解锁 · 新增隐藏场景',
    series: '深海回响',
    series_id: 'deepsea_echo',
    world_tags: ['深海遗迹', '秘境'],
    bind_hero: [],
    relation_targets: [],
    hidden_unlock: true,
    content: {
      summary: '百年一遇的大退潮之夜，沉没玻璃图书馆的穹顶短暂浮出海面，繁星与深海荧光倒映在同一片水面。',
      scene_atmosphere: '时间：星夜退潮｜光影：海面镜反射星穹，鎏金与钴蓝辉映。',
    },
    assets: ['scene_hidden_deepsea.jpg'],
    artwork_url: ART_ASSETS.sceneDeepsea,
    artwork_focal: '50% 20%',
    accent_hex: '#E9CF90',
    prompt_hint: {
      visual: 'mythic glass cathedral dome emerging halfway above a mirror-still starlit ocean at low tide, bioluminescent water below and clear constellations above',
      tone: 'breathtaking wonder, rare celestial tide',
    },
  },
  {
    card_id: 'story_hidden_wasteland_letter',
    card_type: 'story',
    rarity: 'SAR',
    name: '隐藏手札 · 寄给未来站台的回执',
    subtitle: '荒野纪元集齐解锁 · 新增隐藏剧情',
    series: '荒野纪元',
    series_id: 'wasteland_era',
    world_tags: ['废土铁路', '记忆'],
    bind_hero: ['jinyu'],
    relation_targets: [],
    story_kind: 'node',
    timeline_order: 6,
    node_phase: '隐藏回执',
    hidden_unlock: true,
    content: {
      summary: '在荒野终点站的旧邮筒深处，烬羽发现了一封寄给自己的感谢信——落款日期竟然来自十年之后。',
      dialogue_or_excerpt: '「谢谢你当年没有扔掉那盘没有地址的磁带，我们终于在同一班列车上重逢了。」',
    },
    assets: ['story_hidden_wasteland.txt'],
    artwork_url: ART_ASSETS.sceneWasteland,
    artwork_focal: '50% 50%',
    accent_hex: '#E9CF90',
    prompt_hint: {
      visual: 'weathered envelope sealed with warm amber wax resting beside a rusty station timetable at sunset',
      tone: 'moving closure, timeless loop',
    },
  },
  {
    card_id: 'relation_hidden_quartet_csr',
    card_type: 'relation',
    rarity: 'CSR',
    name: '隐藏群像 · 全宇宙编年合册',
    subtitle: '羁绊回响篇集齐解锁 · 终极群像羁绊',
    series: '羁绊回响篇',
    series_id: 'bond_resonance',
    world_tags: ['跨宇宙联动', '群像', '记忆'],
    bind_hero: ['mili', 'cangyuan', 'xiyin', 'jinyu'],
    relation_targets: ['mili', 'cangyuan', 'xiyin', 'jinyu'],
    hidden_unlock: true,
    content: {
      summary: '四位主角的全部设定线在此收束，所有未寄出的磁带、星盘刻度与深海录音汇聚成可供长篇连载的完整大宇宙。',
      relation_type: '全宇宙同框 · 终极群像编年',
      tension_note: '不再存在孤立节点，每一次编组都能衍生出跨越三座世界的全新章回。',
      dialogue_or_excerpt: '「星尘、深海与荒野——现在，它们都写在同一本设定集里了。」',
    },
    assets: ['relation_hidden_quartet.jpg'],
    artwork_url: ART_ASSETS.relationMiliCangyuan,
    artwork_focal: '50% 30%',
    accent_hex: '#E9CF90',
    prompt_hint: {
      visual: 'masterpiece four-character anime exhibition spread combining twilight skyline, underwater glass dome, and golden sunset tracks into one seamless poetic horizon',
      tone: 'complete narrative fulfillment, archival elegance',
    },
  },
];

/**
 * Starter cards granted on first visit so the Workbench, Prompt Export,
 * and Bond Graph (showing Mili as an isolated node waiting for Cangyuan!)
 * work immediately out of the box.
 */
export const STARTER_CARD_IDS: string[] = [
  'hero_mili_001',
  'outfit_mili_lavender_r',
  'item_transparent_umbrella_c',
  'motion_solo_railing_c',
  'scene_stardust_rooftop_r',
  'story_mili_monologue_u',
];

export const ALL_WORLD_TAGS: string[] = Array.from(
  new Set(INITIAL_CATALOG.flatMap((c) => c.world_tags))
);

/**
 * Returns the fixed drawable pool for a specific booster pack,
 * strictly separating Hero pools from Accessory pools as defined in Section 06.
 */
export function getPackDrawablePool(
  pack: BoosterPackDef,
  catalog: NarrativeCard[]
): NarrativeCard[] {
  const nonHidden = catalog.filter((c) => !c.hidden_unlock);
  if (pack.pack_id === 'pack_stardust_heroes') {
    return nonHidden.filter(
      (c) =>
        c.series_id === 'stardust_prelude' &&
        (c.card_type === 'hero' || c.card_type === 'photo' || c.card_type === 'voice')
    );
  }
  if (pack.pack_id === 'pack_stardust_modules') {
    return nonHidden.filter(
      (c) =>
        c.series_id === 'stardust_prelude' &&
        c.card_type !== 'hero'
    );
  }
  if (pack.pack_id === 'pack_bond_resonance') {
    return nonHidden.filter(
      (c) =>
        c.series_id === 'bond_resonance' ||
        c.card_type === 'relation' ||
        (c.card_type === 'motion' && (c.motion_seats ?? 1) >= 2) ||
        (c.card_type === 'story' && c.story_kind === 'node')
    );
  }
  return nonHidden.filter((c) => c.series_id === pack.series_id);
}

function pickWeighted(cards: NarrativeCard[], ownedIds: Set<string>, biasNew = true): NarrativeCard {
  const weights = cards.map((card) => {
    const base = RARITY_META[card.rarity].dropWeight;
    // Gentle discovery bias toward unowned cards to support "宇宙补全" without rigged gacha
    const discoveryBoost = biasNew && !ownedIds.has(card.card_id) ? 1.85 : 0.7;
    return base * discoveryBoost;
  });
  const total = weights.reduce((sum, w) => sum + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < cards.length; i++) {
    r -= weights[i];
    if (r <= 0) return cards[i];
  }
  return cards[cards.length - 1];
}

export type PackOpenSpec = 'single' | 'ten' | 'box';

export function openBoosterPack(
  pack: BoosterPackDef,
  spec: PackOpenSpec,
  catalog: NarrativeCard[],
  ownedIds: Set<string>
): NarrativeCard[] {
  const pool = getPackDrawablePool(pack, catalog);
  if (pool.length === 0) return [];

  const count = spec === 'single' ? 5 : spec === 'ten' ? 10 : 18;
  const results: NarrativeCard[] = [];
  const tempOwned = new Set(ownedIds);

  const chasePool = pool.filter((c) => RARITY_META[c.rarity].group === 'chase');
  const heroPool = pool.filter((c) => c.card_type === 'hero');
  const relationPool = pool.filter((c) => c.card_type === 'relation');

  // Guaranteed slot 1: Hero pool guarantees a Hero or Photo; Bond pool guarantees a Relation
  if (pack.pool_kind === 'hero_pool' && heroPool.length > 0) {
    const picked = pickWeighted(heroPool, tempOwned, true);
    results.push(picked);
    tempOwned.add(picked.card_id);
  } else if (pack.pool_kind === 'bond_special' && relationPool.length > 0) {
    const picked = pickWeighted(relationPool, tempOwned, true);
    results.push(picked);
    tempOwned.add(picked.card_id);
  }

  // Box spec guarantees at least 2 chase cards; ten-pull guarantees 1 chase card
  const guaranteedChase = spec === 'box' ? 2 : spec === 'ten' ? 1 : 0;
  for (let i = 0; i < guaranteedChase && chasePool.length > 0; i++) {
    const picked = pickWeighted(chasePool, tempOwned, true);
    results.push(picked);
    tempOwned.add(picked.card_id);
  }

  while (results.length < count) {
    const picked = pickWeighted(pool, tempOwned, true);
    results.push(picked);
    tempOwned.add(picked.card_id);
  }

  // Order cards like a real booster pack: base cards first, highest visual spec at the climax
  const rankOrder: Record<Rarity, number> = {
    C: 1,
    U: 2,
    R: 3,
    RR: 4,
    AR: 5,
    SR: 6,
    UR: 7,
    CHR: 8,
    SAR: 9,
    CSR: 10,
  };
  return results.sort((a, b) => rankOrder[a.rarity] - rankOrder[b.rarity]);
}
