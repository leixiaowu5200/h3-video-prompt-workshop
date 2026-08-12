/**
 * H3 AI 视频提示词工坊 - 核心数据库
 * 基于 MiniMax H3 开源模型官方提示词规范
 * 包含专业影视编导知识库
 */

// ========== 视频类型定义 ==========
const VIDEO_TYPES = {
  corporate: {
    name: '企业宣传片',
    nameEn: 'Corporate Film',
    icon: '🏛',
    desc: '全面展示企业实力、文化底蕴与发展愿景',
    sceneCount: 8,
    defaultDuration: 5
  },
  product: {
    name: '产品广告',
    nameEn: 'Product Ad',
    icon: '📦',
    desc: '聚焦产品核心卖点，驱动购买转化',
    sceneCount: 5,
    defaultDuration: 5
  },
  brand: {
    name: '品牌形象片',
    nameEn: 'Brand Film',
    icon: '✨',
    desc: '传递品牌价值观，建立情感连接',
    sceneCount: 5,
    defaultDuration: 5
  },
  ecommerce: {
    name: '电商短视频',
    nameEn: 'E-commerce Video',
    icon: '🛒',
    desc: '短平快的产品种草与转化引导',
    sceneCount: 4,
    defaultDuration: 5
  },
  event: {
    name: '活动宣传片',
    nameEn: 'Event Promo',
    icon: '🎉',
    desc: '营造活动氛围，激发参与期待',
    sceneCount: 5,
    defaultDuration: 5
  },
  recruitment: {
    name: '招聘宣传',
    nameEn: 'Recruitment Video',
    icon: '👥',
    desc: '展现企业魅力，吸引优秀人才',
    sceneCount: 5,
    defaultDuration: 5
  }
};

// ========== 行业领域 ==========
const INDUSTRIES = {
  tech: {
    name: '科技互联网',
    environments: ['modern tech campus with glass facades', 'server room with blue LED lights', 'open-plan office with multiple monitors', 'futuristic laboratory with holographic displays'],
    keywords: ['innovation', 'digital transformation', 'cutting-edge technology', 'data-driven'],
    productContext: 'software platform and AI solutions',
    colorPalette: 'cool blue and cyan tones with white highlights'
  },
  finance: {
    name: '金融保险',
    environments: ['modern financial district skyline', 'trading floor with multiple screens', 'elegant banking hall with marble columns', 'glass-walled conference room overlooking the city'],
    keywords: ['trust', 'stability', 'wealth management', 'security'],
    productContext: 'financial services and investment solutions',
    colorPalette: 'deep navy blue with gold accents'
  },
  manufacturing: {
    name: '制造工业',
    environments: ['automated production line with robotic arms', 'vast factory floor with precision machinery', 'quality control laboratory', 'warehouse with automated guided vehicles'],
    keywords: ['precision', 'craftsmanship', 'industrial innovation', 'scale'],
    productContext: 'industrial products and manufacturing solutions',
    colorPalette: 'industrial steel gray with warm orange highlights'
  },
  healthcare: {
    name: '医疗健康',
    environments: ['modern hospital corridor with soft lighting', 'research laboratory with microscopes', 'clean room with medical equipment', 'wellness center with natural light'],
    keywords: ['care', 'innovation', 'wellness', 'precision medicine'],
    productContext: 'medical devices and health services',
    colorPalette: 'clean white with soft teal accents'
  },
  education: {
    name: '教育培训',
    environments: ['modern university campus', 'interactive classroom with digital boards', 'library with floor-to-ceiling bookshelves', 'laboratory with student experiments'],
    keywords: ['knowledge', 'growth', 'future-ready', 'excellence'],
    productContext: 'educational programs and learning platforms',
    colorPalette: 'warm amber with deep green accents'
  },
  retail: {
    name: '零售消费',
    environments: ['flagship store with elegant product displays', 'bustling shopping mall', 'boutique with warm accent lighting', 'warehouse-style retail space'],
    keywords: ['lifestyle', 'quality', 'experience', 'value'],
    productContext: 'consumer products and retail services',
    colorPalette: 'warm neutral tones with vibrant accent colors'
  },
  food: {
    name: '餐饮食品',
    environments: ['modern restaurant kitchen', 'artisanal food workshop', 'farm-to-table scene with fresh ingredients', 'elegant dining room'],
    keywords: ['freshness', 'craftsmanship', 'taste', 'quality'],
    productContext: 'food and beverage products',
    colorPalette: 'warm appetizing tones with fresh green accents'
  },
  automotive: {
    name: '汽车出行',
    environments: ['sleek showroom with dramatic lighting', 'wind tunnel testing facility', 'scenic mountain road', 'automated assembly line'],
    keywords: ['performance', 'design', 'innovation', 'freedom'],
    productContext: 'vehicles and mobility solutions',
    colorPalette: 'metallic silver with deep red accents'
  },
  realestate: {
    name: '房地产',
    environments: ['luxury apartment interior with panoramic city views', 'construction site with cranes', 'landscaped garden community', 'modern architectural building exterior'],
    keywords: ['luxury', 'comfort', 'community', 'lifestyle'],
    productContext: 'real estate developments',
    colorPalette: 'warm earth tones with golden highlights'
  },
  fashion: {
    name: '时尚美妆',
    environments: ['high-end fashion studio', 'runway with dramatic spotlight', 'boutique with elegant mirrors', 'cosmetics laboratory'],
    keywords: ['elegance', 'beauty', 'trend', 'sophistication'],
    productContext: 'fashion and beauty products',
    colorPalette: 'soft pink with rose gold accents'
  },
  wellness: {
    name: '养生健康',
    environments: ['tranquil tea ceremony space with warm wood and soft natural light', 'modern wellness center with arranged herbs, essential oils and bamboo', 'serene yoga studio at sunrise with floor-to-ceiling windows', 'traditional medicine cabinet with neatly arranged wooden drawers'],
    keywords: ['balance', 'vitality', 'natural wellness', 'mind-body harmony'],
    productContext: 'health supplements, herbal teas and wellness products',
    colorPalette: 'soft jade green and warm beige with earthy tones'
  },
  lighting: {
    name: '灯具照明',
    environments: ['modern showroom with designer pendant lights and chandeliers', 'cozy living room warmly lit by smart ambient lighting', 'minimalist studio displaying LED strip and lamp collections', 'architectural building exterior at dusk with dramatic landscape lighting'],
    keywords: ['ambiance', 'illumination', 'design', 'warmth'],
    productContext: 'designer lamps, smart lighting systems and LED fixtures',
    colorPalette: 'warm amber glow with deep charcoal and brass accents'
  },
  ticketing: {
    name: '票务代购',
    environments: ['concert stage with dynamic spotlights and a cheering crowd', 'a person rapidly tapping on a smartphone screen to secure tickets', 'a wall of physical event tickets beside e-ticket QR codes glowing on a screen', 'an excited fan holding a phone with a booking confirmation and a glowing screen'],
    keywords: ['convenience', 'instant access', 'trustworthy service', 'excitement'],
    productContext: 'concert and event ticket proxy purchasing service',
    colorPalette: 'energetic purple and neon pink with deep night-sky tones'
  },
  hydro: {
    name: '巨晴水疗·养生调理',
    nameEn: 'Juqing Hydrotherapy Wellness',
    environments: [
      'an elegant home bathroom transformed into a private spa, warm steam rising from a freestanding bathtub with gentle streams of fine bubbles',
      'a person soaking their feet in a home foot-bath basin, soft warm lamplight and a calm evening mood',
      'an extreme close-up of millions of tiny bubbles surging and bursting through warm water with a soft ultrasonic shimmer',
      'a serene wellness nook with natural wood, smooth pebbles and soft amber lighting, evoking a tranquil hot-spring retreat'
    ],
    keywords: ['hydrotherapy', 'gentle warmth', 'deep relaxation', 'qi and blood circulation', 'meridian warming', 'home spa ritual', 'natural wellness', 'essential oils and mineral bath salts', 'warm meridian conditioning', 'lower-limb meridian warming', 'daily home wellness ritual', 'Kangfu foot-bath barrel', 'one-machine dual use (foot bath + bath)', 'four-season foot bath (spring lift-yang, summer dispel dampness, autumn moisten lungs, winter warm dantian)', 'spine-warming pearl sweat', 'dispelling cold and dampness', 'shockwave home spa', 'wellness for all ages and busy urbanites'],
    productContext: 'Juqing MOYA ultrasonic hydrotherapy equipment (GSPA home spa machine, e.g. GO-800 and Kangfu foot-bath barrel) for foot baths and full-body soaking — one machine with two uses by swapping the bubble pad and hose; paired with German-imported MOYA essential oils and mineral bath salts (chamomile, pine needle, juniper, lavender, eucalyptus); 32-year brand now popularized as a home appliance for a warm meridian-conditioning daily ritual',
    colorPalette: 'warm water tones with soft amber, jade green and clean white accents',
    industryNarrative: 'This scene frames water therapy as a gentle daily wellness ritual — part of a lifestyle where people take charge of their own well-being rather than waiting for illness. A few drops of imported essential oil and a scoop of mineral bath salt melt into warm water; fine ultrasonic bubbles embrace the feet and body, helping one relax and unwind. Warmth reaches deep into the spine and limbs, encouraging a soft "pearl-sweat" that releases cold and dampness; after stepping out the body stays gently warm for a while, refreshed rather than drained. The four seasons guide the foot bath: spring lifts yang and consolidates, summer dispels damp-heat, autumn moistens lungs and bowels, winter warms the dantian. The whole experience is framed as a soothing home self-care ritual — supporting the body\'s natural balance, with no outcome promises of any kind.',
    industryNarrativeZh: '本场戏将水疗呈现为一种温和的日常养生仪式——是人们主动为自己的健康负责、把调理融入生活方式的一部分，而非被动等待疾病到来。德国进口精油与矿物浴盐在温水中慢慢化开，细密气泡包裹双足与全身，帮助身心放松。暖意由脊柱与四肢深处透出，引出温润的「珍珠汗」，把体内寒湿轻轻排散；出水后身体仍持续温热片刻，越泡越精神而非疲惫。四季泡脚各有讲究：春升阳固脱、夏祛暑湿、秋肺润肠濡、冬丹田温灼。全程仅以「调理、舒缓、温通、放松、居家养生」的方式呈现——辅助身体回到自然平衡状态，绝不作任何医学上的承诺或暗示。',

    // ========== 健康观念背书库（源自张大春《健康观念治疗》、黄帝内经等；
    //   已做合规改写：调理不治疗、不作功效承诺、不替代医学） ==========
    healthKnowledge: {
      coreIdea: '健康不是治出来的，是养出来的。把治病的钱花在养生上，把去医院的路拦在厨房门口——主动调理、改善生活方式、让身体回到自然平衡态。',
      coreIdeaEn: 'Health is not cured, it is cultivated. Invest what would have gone to hospital bills into daily self-care instead — bring the path to the hospital back to the kitchen door by adjusting lifestyle early.',
      threeDoors: '健康三道门——第一道门：西医救死扶伤、治急症，不可替代（踩刹车）；第二道门：健康行业辅助调理、改善血液环境（踩油门+刹车并行）；第三道门：个人日常饮食起居调理、把生病拦在去医院的路上（只踩油门）。',
      threeDoorsEn: 'Three doors of health — door one: Western medicine saves lives in emergencies (the brake); door two: the wellness industry supports circulation, blood quality and lifestyle (brake plus accelerator together); door three: the individual keeps daily rhythms of diet, rest and conditioning so illness never starts (accelerator only).',
      cureVsCondition: '治是医生的事——手术、消炎、扩张血管，处理的是「结果」；调是健康行业的事——清理血液、改善循环、排出寒湿，处理的是「原因」。谁管果没结果，谁管因能去根。',
      cureVsConditionEn: 'Treating is the doctor\'s job — surgery, anti-inflammation, dilating vessels — handling the visible result. Conditioning is the wellness industry\'s job — clearing the blood, improving circulation, releasing cold and dampness — handling the root cause. Managing only the result never ends; managing the cause removes the root.',
      elevenFish: '五脏六腑好比 11 条鱼，鱼养得好不好由水质决定，水质就是血液。给病鱼撒药、扔掉病鱼，都不解决水质问题；真正有效的是「换水」——清理血液、改善循环，五脏六腑的环境自然变好。',
      elevenFishEn: 'The internal organs are like 11 fish in a pond. Whether the fish thrive depends on the water quality — and that water is the blood. Sprinkling medicine on a sick fish or removing the sick fish does not fix the water. What works is changing the water — clearing the blood and improving circulation so the whole internal environment recovers.',
      temperature: '寒凉是百病之源——冷饮、空调、寒凉食物导致血管变窄、循环变差、毒素堆积。提高温度（泡脚、热水浴、温通经络）能协助排出寒湿、改善循环。冬吃萝卜夏吃姜，厨房门口把好关。',
      temperatureEn: 'Cold is the seed of most chronic issues — iced drinks, air conditioning and cold foods narrow the vessels, slow circulation and trap waste. Raising the temperature (foot bath, warm soak, meridian warming) helps release cold and dampness and restores flow. Keep the kitchen door well-guarded.',
      causeAndEffect: '所有疾病都有「因」——错误生活习惯（熬夜、寒凉、情绪郁结、久坐不动）；不解决因就会反复发作、转移、扩散。找因者内观自悟自度——不要恐惧果，要害怕因。',
      causeAndEffectEn: 'Every condition has a cause — wrong lifestyle habits (late nights, cold food, suppressed emotion, long sitting). Without changing the cause, the result keeps returning or shows up somewhere new. Look inward for the cause rather than fear the result.',
      huangDi: '黄帝内经有云：「上古之人，春秋皆度百岁而动作不衰」。气血不足时，身体先保躯干后舍四肢——手脚冰凉、关节不灵便，是身体发出的早期信号，提示我们要早早调理、改善循环。',
      huangDiEn: 'The Yellow Emperor\'s Classic of Internal Medicine notes that the people of high antiquity lived past a hundred with steady movement. When qi and blood are insufficient, the body protects the trunk first and lets the limbs go cold — cold hands and feet are an early signal to begin conditioning and improve circulation early.',
      warningSignals: '身体的五大求救信号——肾脏：脚肿眼肿；肝脏：脸色发黑；大脑：突然头晕；血脂：黄色瘤、掌纹改变、耳褶；早衰：头发稀疏、体形发胖、性欲下降。这些都是身体在提醒我们——该改变生活方式、加强日常调理。',
      warningSignalsEn: 'Five body alarm signals — kidney: swollen feet and eyes; liver: darkened face; brain: sudden dizziness; blood lipids: xanthomas, changed palm creases, ear creases; premature aging: thinning hair, weight gain, reduced vitality. The body is reminding us to change habits and reinforce daily conditioning.',
      boundaries: '调理 ≠ 治疗。调理是辅助改善生活方式的一部分，是日常养生、协助身体回到平衡态。任何急重症（胸痛、呕血、意识丧失）必须立即就医；慢性不适应在专业医师指导下配合日常调理；纯物理疗法对正常人群无副作用、无伤害，但孕妇、儿童、重大疾病者需在医师指导下使用；调理期间身体可能出现的暖意、放松、困倦、排汗等现象，是身体自我调整的信号，不必恐惧。',
      boundariesEn: 'Conditioning is not treatment. Conditioning is part of a self-care lifestyle that supports the body\'s natural balance. Acute symptoms (chest pain, vomiting blood, loss of consciousness) require immediate medical care; chronic discomforts should combine professional guidance with daily conditioning. Pure physical therapy has no side effects for healthy adults — but pregnant women, children and people with serious illness should use it under medical supervision. Sensations during conditioning — warmth, relaxation, sleepiness, gentle sweat — are normal signs of the body rebalancing, not a cause for alarm.'
    },

    // ========== 调理方向与好转反应（合规措辞） ==========
    conditioningPoints: [
      '温通足底经络',
      '协助下肢气血运行',
      '促进身体放松与舒缓',
      '暖意由脊柱与四肢深处透出',
      '引出温润的「珍珠汗」、协助排出寒湿',
      '出水后身体仍持续温热片刻',
      '四季不同侧重——春升阳、夏祛湿、秋润肺、冬温丹田',
      '可与德国进口精油、矿物浴盐搭配增强体感',
      '居家场景容易坚持、家人可共用',
      '调理期间身体可能出现暖意、放松、困倦、轻微排汗——这是身体自我调整的正常现象，不必恐惧',
      '调理后注意保暖、适量饮水、避免立即吹冷风'
    ],

    // ========== 生活方式建议（饮食/起居/情绪/运动） ==========
    lifestyleTips: {
      diet: [
        '冬吃萝卜夏吃姜，少吃冰镇冷饮',
        '少喝冰啤酒、冰咖啡，常温饮用更护肠胃',
        '少吃生冷寒凉食物（冰激凌、生鱼片、寒性水果过量）',
        '彩虹饮食：蔬菜水果多样化，补充蛋白质与微量元素',
        '定时定量进食、不暴饮暴食'
      ],
      rest: [
        '不要长时间吹空调，尤其睡觉时',
        '晚上泡脚或热水浴有助改善循环',
        '保证 7-8 小时睡眠、不熬夜',
        '注意颈部、腰部、足部保暖'
      ],
      emotion: [
        '情绪郁结易导致气滞血瘀，保持心情舒畅',
        '适度宣泄压力、与家人朋友多沟通',
        '家庭关系直接影响身心健康'
      ],
      exercise: [
        '每天 30 分钟有氧运动（快走、慢跑、游泳、太极）',
        '久坐每隔 1 小时起身活动',
        '拉伸、瑜伽有助改善循环'
      ]
    }
  }
};

// ========== 视觉风格预设 ==========
const STYLES = {
  cinematic: {
    name: '电影质感',
    nameEn: 'Cinematic',
    keywords: 'cinematic, anamorphic lens, shallow depth of field, film grain texture',
    colorGrading: 'teal and orange color grading with deep contrast',
    lighting: 'dramatic directional lighting with strong shadows',
    mood: 'epic and aspirational',
    musicStyle: 'cinematic orchestral score with a swelling crescendo'
  },
  modern: {
    name: '现代简约',
    nameEn: 'Modern Minimal',
    keywords: 'clean, minimal, bright, contemporary, sleek',
    colorGrading: 'bright neutral tones with subtle blue tint',
    lighting: 'soft diffused lighting with even exposure',
    mood: 'fresh and confident',
    musicStyle: 'modern electronic with clean beats'
  },
  warm: {
    name: '温暖人文',
    nameEn: 'Warm Human',
    keywords: 'warm, intimate, natural, documentary-style',
    colorGrading: 'warm golden tones with soft contrast',
    lighting: 'natural window light with warm bounce',
    mood: 'genuine and heartfelt',
    musicStyle: 'acoustic guitar with gentle piano'
  },
  tech: {
    name: '科技未来',
    nameEn: 'Tech Futuristic',
    keywords: 'futuristic, high-tech, digital, sleek, glowing',
    colorGrading: 'cool cyan and deep blue with neon highlights',
    lighting: 'LED accent lighting with blue-cyan glow',
    mood: 'innovative and forward-looking',
    musicStyle: 'electronic synth with deep bass pulse'
  },
  luxury: {
    name: '高端奢华',
    nameEn: 'Luxury Premium',
    keywords: 'luxurious, elegant, sophisticated, premium',
    colorGrading: 'rich gold and deep black with soft highlights',
    lighting: 'low-key dramatic lighting with golden rim light',
    mood: 'exclusive and prestigious',
    musicStyle: 'elegant strings with subtle piano'
  },
  vibrant: {
    name: '年轻活力',
    nameEn: 'Vibrant Youth',
    keywords: 'vibrant, energetic, dynamic, colorful, bold',
    colorGrading: 'saturated vivid colors with high contrast',
    lighting: 'bright colorful lighting with neon accents',
    mood: 'energetic and exciting',
    musicStyle: 'upbeat electronic pop with driving rhythm'
  },
  documentary: {
    name: '纪实风格',
    nameEn: 'Documentary',
    keywords: 'documentary, handheld, authentic, raw, natural',
    colorGrading: 'natural realistic colors with mild contrast',
    lighting: 'available natural light, no artificial augmentation',
    mood: 'authentic and trustworthy',
    musicStyle: 'minimal ambient with subtle percussion'
  },
  artistic: {
    name: '艺术创意',
    nameEn: 'Artistic Creative',
    keywords: 'artistic, surreal, creative, painterly, dreamlike',
    colorGrading: 'stylized color palette with artistic tonal shifts',
    lighting: 'creative lighting with colored gels and dramatic shadows',
    mood: 'imaginative and inspiring',
    musicStyle: 'ambient electronic with ethereal textures'
  },
  comedy: {
    name: '搞笑喜剧',
    nameEn: 'Comedy',
    keywords: 'comedic, playful, exaggerated, slapstick, lighthearted, whimsical',
    colorGrading: 'bright saturated colors with high-key cheerful tones',
    lighting: 'bright even lighting with playful colored accent lights',
    mood: 'funny and entertaining',
    musicStyle: 'upbeat quirky comedic music with bouncy rhythms and cartoonish sound effects',
    narrativeFlavor: 'The scene leans into comedic timing and exaggerated physical reactions — playful visual gags, funny facial expressions, and absurd little mishaps that make the audience laugh out loud.',
    narrativeFlavorZh: '本场戏强化喜剧节奏与夸张的肢体反应——俏皮的视觉噱头、搞笑表情，以及让人捧腹的荒诞小意外。'
  },
  twist: {
    name: '剧情反转',
    nameEn: 'Plot Twist',
    keywords: 'suspenseful, mysterious, dramatic irony, cinematic tension, unexpected',
    colorGrading: 'moody low-key color grading with deep shadows and a cold color cast',
    lighting: 'low-key dramatic lighting with hard shadows and a single key light',
    mood: 'suspenseful with a dramatic reversal',
    musicStyle: 'tense suspenseful score with slow-building strings, a held silence, then a sharp dramatic sting at the reveal',
    narrativeFlavor: 'The scene plants a misdirection (a red herring) and builds suspense, setting up a dramatic twist reversal that subverts the audience\'s expectation at the reveal — the payoff lands as a surprising turn.',
    narrativeFlavorZh: '本场戏先埋下误导（红鲱鱼）并积累悬念，最终在揭晓时来一记颠覆观众预期的剧情反转——高潮落在出人意料的转折上。'
  },
  // ===== MiniMax 官方风格技能接入（来自 MiniMax-AI/MiniMax-H3 skills）=====
  minimalistAd: {
    name: '极简产品',
    nameEn: 'Minimalist Product',
    keywords: 'minimalist, clean studio, premium product film, sleek negative space, precise lighting, uncluttered composition',
    colorGrading: 'clean neutral tones with subtle contrast and bright whites',
    lighting: 'soft even studio light with a single hero rim light',
    mood: 'premium, refined and understated',
    musicStyle: 'minimal ambient with sparse piano and airy silence'
  },
  cg3d: {
    name: '3D动画',
    nameEn: '3D Animation',
    keywords: '3D CG animation, stylized character, vibrant rendered, smooth motion, Pixar-like polish',
    colorGrading: 'vibrant saturated 3D-rendered palette with clean highlights',
    lighting: 'three-point CG lighting with soft ambient fill',
    mood: 'playful, polished and imaginative',
    musicStyle: 'upbeat animated score with bright orchestral pops'
  },
  papercraft: {
    name: '纸艺定格',
    nameEn: 'Papercraft Stop-Motion',
    keywords: 'papercraft, handmade paper, layered diorama, tactile cut-paper, stop-motion, miniature sets',
    colorGrading: 'warm paper tones with soft matte finish',
    lighting: 'soft frontal light that reveals paper texture and gentle shadows',
    mood: 'whimsical, handcrafted and warm',
    musicStyle: 'gentle acoustic guitar with subtle paper foley'
  },
  paperCollage: {
    name: '纸拼贴解说',
    nameEn: 'Paper Collage',
    keywords: 'paper collage, halftone, tactile mixed-media, cut-out layering, editorial explainer',
    colorGrading: 'layered collage tones with printed-paper warmth',
    lighting: 'flat even light with no harsh shadows',
    mood: 'creative, educational and approachable',
    musicStyle: 'light quirky percussion with soft woodwind'
  },
  mvSubtitle: {
    name: 'MV字幕',
    nameEn: 'Music Video Subtitle',
    keywords: 'music video, beat-synced typography, lyric subtitles, stylized MV, rhythmic editing',
    colorGrading: 'high-contrast music-video palette with neon accents',
    lighting: 'concert and studio mixed lighting with dynamic color washes',
    mood: 'emotional, rhythmic and energetic',
    musicStyle: 'driving MV track with strong beat and synth leads'
  },
  gameIntro: {
    name: '游戏开场',
    nameEn: 'Game Intro',
    keywords: 'game intro, two-player menu, stylized game UI, character-led, coordinated UI motion',
    colorGrading: 'vibrant game palette with neon and glow',
    lighting: 'stylized game lighting with rim glow and bloom',
    mood: 'energetic, playful and immersive',
    musicStyle: 'game OST with pulse-pounding synths'
  },
  handdrawnLive: {
    name: '手绘实景',
    nameEn: 'Hand-drawn Live',
    keywords: 'hand-drawn animation over live action, glowing rough strokes, surreal morphing, tactile sketch',
    colorGrading: 'live-action base with hand-drawn overlay accents',
    lighting: 'natural live-action setting with sketched light streaks',
    mood: 'surreal, creative and dreamlike',
    musicStyle: 'whimsical acoustic with playful pencil textures'
  },
  brandAnthem: {
    name: '品牌 anthem',
    nameEn: 'Brand Anthem',
    keywords: 'brand film, premium lifestyle, aspirational, polished camera language, emotional payoff',
    colorGrading: 'warm cinematic brand palette with golden highlights',
    lighting: 'soft beauty light with gentle flares',
    mood: 'aspirational, confident and uplifting',
    musicStyle: 'brand anthem with soaring strings'
  }
};

// ========== 风格预设中文翻译（避免中英混杂） ==========
// 与 STYLES 一一对应，为 zhdata.js 中文模板提供纯中文的 光线/色调/风格关键词/配乐描述
const STYLE_ZH = {
  cinematic: { lightingDescZh: '戏剧性方向性强光与深沉阴影', colorGradingZh: '青橙色调搭配深邃反差', styleKeywordsZh: '电影感、变形镜头、浅景深、胶片颗粒纹理', musicStyleZh: '电影管弦配乐，渐强高潮' },
  modern: { lightingDescZh: '柔和漫射光，均匀曝光', colorGradingZh: '明亮中性基调带微妙冷蓝调', styleKeywordsZh: '干净、极简、明亮、当代、利落', musicStyleZh: '现代电子乐，清爽节拍' },
  warm: { lightingDescZh: '自然窗光带暖色反光', colorGradingZh: '暖金色调，柔和反差', styleKeywordsZh: '温暖、亲密、自然、纪实感', musicStyleZh: '原声吉他配轻柔钢琴' },
  tech: { lightingDescZh: 'LED 亮点光带青蓝辉光', colorGradingZh: '冷青与深蓝底色配霓虹高光', styleKeywordsZh: '未来感、高科技、数字感、流线型、发光', musicStyleZh: '电子合成器配深沉低频脉冲' },
  luxury: { lightingDescZh: '低调戏剧光带金色轮廓光', colorGradingZh: '深黑与富金搭配柔和高光', styleKeywordsZh: '奢华、优雅、精致、高端', musicStyleZh: '优雅弦乐配微妙钢琴' },
  vibrant: { lightingDescZh: '明亮彩色光配霓虹点缀', colorGradingZh: '饱和鲜艳色彩配高反差', styleKeywordsZh: '活力、动感、鲜明、多彩、大胆', musicStyleZh: ' upbeat 电子流行乐，驱动节奏' },
  documentary: { lightingDescZh: '自然可用光，无人工补光', colorGradingZh: '自然真实色彩配温和反差', styleKeywordsZh: '纪实、手持、真实、原始、自然', musicStyleZh: '极简环境音配轻微打击乐' },
  artistic: { lightingDescZh: '创意灯光配彩色滤片与戏剧阴影', colorGradingZh: '艺术化调色板配创意色调变化', styleKeywordsZh: '艺术、超现实、创意、绘画感、梦幻', musicStyleZh: '环境电子乐配空灵质感' },
  comedy: { lightingDescZh: '明亮均匀光配俏皮彩色点缀光', colorGradingZh: '明亮饱和色彩配高调欢快基调', styleKeywordsZh: '喜剧、俏皮、夸张、滑稽、轻松、异想天开', musicStyleZh: '轻快诙谐喜剧音乐，弹跳节奏与卡通音效' },
  twist: { lightingDescZh: '低调戏剧光配硬阴影与单一主光', colorGradingZh: '低调情绪化调色配深沉阴影与冷色偏移', styleKeywordsZh: '悬疑、神秘、戏剧反讽、电影张力、出人意料', musicStyleZh: '紧张悬疑配乐，缓慢攀升弦乐，静默后骤然刺音揭露' },
  minimalistAd: { lightingDescZh: '柔和均匀影棚光带单一英雄轮廓光', colorGradingZh: '干净中性基调配微妙反差与亮白', styleKeywordsZh: '极简、干净影棚、高级产品电影感、利落负空间、精准布光', musicStyleZh: '极简环境音配稀疏钢琴与空灵静寂' },
  cg3d: { lightingDescZh: '三点 CG 布光配柔和环境补光', colorGradingZh: '生动饱和 3D 渲染调色板配干净高光', styleKeywordsZh: '3D CG 动画、风格化角色、生动渲染、流畅动作、皮克斯级打磨', musicStyleZh: '轻快动画配乐，明亮管弦弹跳' },
  papercraft: { lightingDescZh: '柔和正面光展现纸张纹理与柔和阴影', colorGradingZh: '暖纸色调配柔哑光表面', styleKeywordsZh: '纸艺、手工纸、层叠立体场景、触感剪纸、定格动画', musicStyleZh: '轻柔原声吉他配细微纸拟音' },
  paperCollage: { lightingDescZh: '平坦均匀光无生硬阴影', colorGradingZh: '层叠拼贴色调配印刷纸品温暖感', styleKeywordsZh: '纸拼贴、半调、触感混合媒材、剪贴层叠、编辑解说', musicStyleZh: '轻盈俏皮打击乐配柔和木管' },
  mvSubtitle: { lightingDescZh: '演唱会与影棚混光配动态色彩洗换', colorGradingZh: '高反差 MV 调色板配霓虹点缀', styleKeywordsZh: 'MV、节拍同步字体排印、歌词字幕、风格化 MV、节奏剪辑', musicStyleZh: '驱动 MV 曲目，强拍与合成器主奏' },
  gameIntro: { lightingDescZh: '风格化游戏布光配轮廓辉光与泛光', colorGradingZh: '生动游戏调色板配霓虹与发光', styleKeywordsZh: '游戏开场、双人菜单、风格化游戏 UI、角色驱动、协调 UI 动效', musicStyleZh: '游戏 OST，脉动合成器' },
  handdrawnLive: { lightingDescZh: '自然实景环境配手绘光线条纹', colorGradingZh: '实景基底配手绘叠加点缀', styleKeywordsZh: '手绘动画叠在实拍上、发光粗糙笔触、超现实变形、触感速写', musicStyleZh: '异想天开原声配俏皮铅笔质感' },
  brandAnthem: { lightingDescZh: '柔和美人光配温柔镜头光晕', colorGradingZh: '暖电影品牌调色板配金色调高光', styleKeywordsZh: '品牌电影、高级生活方式、向往感、精良镜头语言、情感回报', musicStyleZh: '品牌颂歌，激昂弦乐' }
};

// ========== 画幅比例 ==========
const ASPECT_RATIOS = {
  '16:9': { name: '16:9 横屏', desc: '标准宽屏，适合宣传片、广告', h3Value: '16:9', pixels: '1920×1080（1080p）、1280×720（720p）、3840×2160（4K）' },
  '9:16': { name: '9:16 竖屏', desc: '手机短视频，适合抖音/快手', h3Value: '9:16', pixels: '1080×1920、720×1280、2160×3840' },
  '21:9': { name: '21:9 超宽', desc: '电影级宽幅，适合大屏展示', h3Value: '21:9', pixels: '2560×1080、3440×1440（带鱼屏）、3840×1600' },
  '1:1': { name: '1:1 方形', desc: '社交媒体方图视频', h3Value: '1:1', pixels: '1080×1080、720×720、1440×1440' },
  '4:3': { name: '4:3 传统', desc: '传统电视比例', h3Value: '4:3', pixels: '1440×1080、960×720、1920×1440' },
  '3:4': { name: '3:4 竖版', desc: '海报式竖版视频', h3Value: '3:4', pixels: '1080×1440、810×1080、1440×1920' }
};

// ========== 镜头运动词汇库 ==========
const SHOT_TYPES = {
  extremeWide: 'extreme wide shot',
  wide: 'wide shot',
  mediumWide: 'medium-wide shot',
  medium: 'medium shot',
  mediumClose: 'medium close-up shot',
  closeUp: 'close-up shot',
  extremeClose: 'extreme close-up shot',
  aerial: 'aerial establishing shot',
  overhead: 'overhead top-down shot',
  lowAngle: 'low-angle shot',
  highAngle: 'high-angle shot',
  dutch: 'Dutch angle shot',
  pov: 'POV shot',
  tracking: 'tracking shot',
  twoShot: 'two-shot'
};

const CAMERA_MOVEMENTS = [
  'The camera pushes in with small amplitude at slow speed',
  'The camera pulls out with small amplitude at slow speed',
  'The camera pans right with small amplitude at slow speed',
  'The camera trucks left with small amplitude at slow speed',
  'The camera tilts up slowly',
  'The camera arcs around the subject at slow speed',
  'The camera holds a static shot throughout',
  'The camera slowly descends while pushing forward',
  'The camera slowly rises while pulling back',
  'The camera tracks the subject from the side at moderate speed',
  'The camera pushes in with large amplitude at slow speed toward the subject',
  'The camera performs a slow 360-degree orbit around the subject'
];

// ========== 场景模板库 ==========
// 每个视频类型对应一组场景模板
// 模板函数接收 ctx 上下文对象，返回场景数据

const SCENE_TEMPLATES = {

  // ===== 企业宣传片 (8 scenes) =====
  corporate: [
    {
      id: 'hook', name: '开篇引子', nameEn: 'Opening Hook', duration: 5,
      shotType: 'aerial establishing shot',
      cameraMovement: 'The camera slowly descends with small amplitude at slow speed while pushing forward',
      lighting: 'golden hour, warm directional sunlight creating long shadows',
      colorGrading: null, // 使用风格预设
      textOverlay: true,
      voiceover: true,
      directorNote: '航拍城市天际线或企业建筑外观，建立宏大的开篇基调。黄金时刻光影，营造雄心壮志感。',
      generate(ctx) {
        const env = ctx.industryData.environments[0];
        const vo = ctx.voiceoverText || `Since its founding, ${ctx.brand} has been driven by a single vision: to shape the future of ${ctx.industryName}.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, an aerial establishing shot frames ${env} at golden hour. ${ctx.cameraMovement} as warm sunlight bathes the architecture, casting long dramatic shadows. The scene establishes scale and ambition. A large elegant text overlay reading "${ctx.brand}" fades in at the center-bottom of the frame in a clean serif font with a subtle glow effect. The narrator (S1) says in an off-screen voiceover with a warm, confident tone: <d>[English] ${vo}</d> while no character's lips are visible on screen.`,
          soundscape: `Distant urban ambiance with a gentle breeze at altitude, layered with a subtle low-frequency hum that builds gradually as the camera descends.`,
          music: `${ctx.musicStyle}, beginning with sustained strings at a slow tempo, gradually building with a rising piano motif and deep resonant bass.`
        };
      }
    },
    {
      id: 'origin', name: '企业起源', nameEn: 'Origin Story', duration: 5,
      shotType: 'close-up shot',
      cameraMovement: 'The camera pushes in with small amplitude at slow speed',
      lighting: 'warm amber practical lighting, nostalgic atmosphere',
      textOverlay: false,
      voiceover: true,
      directorNote: '特写镜头展示企业起源——手翻阅旧文件、老照片、签名笔迹等。暖色调营造怀旧感。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `What began as a small team with a big dream has grown into a force of innovation.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a close-up shot frames a pair of hands carefully turning the pages of a leather-bound notebook on a wooden desk. ${ctx.cameraMovement} toward the handwritten notes and sketches. Warm amber light from a desk lamp creates a nostalgic atmosphere. Old photographs and blueprints are scattered across the surface. Dust particles float in the beam of light. The narrator (S1) continues in an off-screen voiceover with a reflective, warm tone: <d>[English] ${vo}</d> while no lips are visible on screen.`,
          soundscape: `The soft rustle of paper pages turning, a faint scratch of pen on paper, and the gentle creak of the wooden desk chair, all under a quiet room tone.`,
          music: `A solo piano melody at a slow, contemplative tempo, with sparse notes and a simple repeating motif.`
        };
      }
    },
    {
      id: 'strength', name: '核心实力', nameEn: 'Core Capabilities', duration: 5,
      shotType: 'wide tracking shot',
      cameraMovement: 'The camera tracks forward at moderate speed through the space',
      lighting: 'bright professional lighting with cool tones',
      textOverlay: false,
      voiceover: true,
      directorNote: '宽幅移动镜头穿越企业核心场景——生产线、实验室、办公区。展示规模和专业实力。',
      generate(ctx) {
        const env = ctx.industryData.environments[1];
        const vo = ctx.voiceoverText || `Today, ${ctx.brand} operates at the forefront of ${ctx.industryName}, powered by world-class teams and technology.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a wide tracking shot moves through ${env}. ${ctx.cameraMovement}, revealing row after row of activity and precision. Workers in professional attire operate advanced equipment with focused expertise. ${ctx.lightingDesc}. The camera captures the scale and sophistication of the operation. The narrator (S1) says in an off-screen voiceover with a confident, authoritative tone: <d>[English] ${vo}</d> while the on-screen workers' lips remain closed.`,
          soundscape: `The rhythmic hum of machinery and equipment, overlapping with the subtle clicks of keyboards, footsteps on polished floors, and the ambient buzz of a busy professional environment.`,
          music: `A driving electronic pulse at a moderate tempo with layered synth pads and a steady bass rhythm.`
        };
      }
    },
    {
      id: 'product', name: '产品展示', nameEn: 'Product Showcase', duration: 5,
      shotType: 'medium close-up shot',
      cameraMovement: 'The camera performs a slow 360-degree arc around the subject',
      lighting: 'dramatic studio lighting with rim light highlighting product edges',
      textOverlay: true,
      voiceover: false,
      directorNote: '弧线运镜环绕产品/服务核心成果，影棚级布光突出产品质感。可叠加产品名称文字。',
      generate(ctx) {
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a medium close-up shot frames ${ctx.product || ctx.industryData.productContext} displayed on a minimalist pedestal. ${ctx.cameraMovement}. Dramatic studio lighting with a rim light traces the edges of the product, creating a premium hero shot. ${ctx.colorGrading}. A clean text overlay reading "${ctx.brand}" appears in the upper-right corner in a modern sans-serif font. The surface beneath the product reflects subtle light patterns.`,
          soundscape: `A quiet studio atmosphere with the faint hum of studio lighting equipment and a barely audible electronic tone that complements the visual precision.`,
          music: `A sleek, modern electronic composition at a moderate tempo, featuring clean synth arpeggios and a steady bass line that builds slightly in intensity.`
        };
      }
    },
    {
      id: 'team', name: '团队风采', nameEn: 'Team Spirit', duration: 5,
      shotType: 'medium shot',
      cameraMovement: 'The camera trucks right with small amplitude at slow speed',
      lighting: 'natural bright office lighting with soft window light',
      textOverlay: false,
      voiceover: true,
      directorNote: '中景镜头展示团队协作场景——会议讨论、头脑风暴、协作工作。自然光，温暖氛围。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `Our greatest strength is our people — diverse, passionate, and united by a shared purpose.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a medium shot captures a diverse team of professionals collaborating around a large table in a bright, modern office. ${ctx.cameraMovement}, revealing engaged faces, animated discussions, and creative energy. Natural light streams through floor-to-ceiling windows. Team members point at screens, share ideas, and smile at each other. The narrator (S1) says in an off-screen voiceover with a warm, inspiring tone: <d>[English] ${vo}</d> while all on-screen characters' lips remain closed.`,
          soundscape: `The murmur of animated conversation mixed with the tapping of laptop keys, shuffling of papers, and occasional laughter, all under a bright room ambience.`,
          music: `An acoustic arrangement at a moderate tempo, featuring bright guitar strumming, light percussion, and a clear melodic piano line.`
        };
      }
    },
    {
      id: 'responsibility', name: '社会责任', nameEn: 'Social Responsibility', duration: 5,
      shotType: 'wide shot',
      cameraMovement: 'The camera slowly rises while pulling back',
      lighting: 'soft natural daylight with warm golden tones',
      textOverlay: false,
      voiceover: true,
      directorNote: '宽景镜头展示企业社会责任——社区活动、环保举措、公益项目。升降镜头拉升，视野开阔。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `Beyond business, we believe in giving back — to our communities and to the planet we share.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a wide shot shows a community initiative scene — volunteers in branded t-shirts planting trees, children laughing, a solar panel installation gleaming in the background. ${ctx.cameraMovement}, revealing the full scope of the community project. ${ctx.lightingDesc}. The scene radiates warmth and genuine care. The narrator (S1) says in an off-screen voiceover with a sincere, gentle tone: <d>[English] ${vo}</d> while on-screen participants' lips remain closed.`,
          soundscape: `Birds singing in the background, the rustle of leaves, children's laughter, and the soft sounds of digging and planting, all under a gentle outdoor ambiance.`,
          music: `A gentle string arrangement at a slow tempo, with a soft melody that swells in volume, accompanied by light acoustic guitar.`
        };
      }
    },
    {
      id: 'future', name: '未来展望', nameEn: 'Future Vision', duration: 5,
      shotType: 'medium-wide shot',
      cameraMovement: 'The camera pushes in with large amplitude at slow speed toward a bright light source',
      lighting: 'bright forward-looking lighting with lens flare',
      textOverlay: false,
      voiceover: true,
      directorNote: '推进镜头朝向光明/远方，象征未来无限可能。可使用抽象或科幻元素，营造前瞻感。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `The future is not something we wait for. It is something we build — together.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a medium-wide shot looks toward a horizon where a modern cityscape meets a brilliant sunrise. ${ctx.cameraMovement}. The light grows brighter, creating a lens flare that fills the frame with possibility. Abstract digital elements — flowing data streams and light particles — drift across the scene, symbolizing innovation and the digital future. The narrator (S1) says in an off-screen voiceover with an inspiring, forward-looking tone: <d>[English] ${vo}</d> while no character's lips are visible.`,
          soundscape: `A building electronic resonance that grows in intensity, layered with ethereal wind-like sounds and a subtle high-frequency shimmer that evokes a sense of limitless possibility.`,
          music: `A powerful, building orchestral-electronic hybrid at a slow but rising tempo, featuring layered strings, deep synth bass, and a rising brass motif that crescendos toward the end.`
        };
      }
    },
    {
      id: 'closing', name: '品牌收尾', nameEn: 'Brand Closing', duration: 5,
      shotType: 'static shot',
      cameraMovement: 'The camera holds a static shot throughout',
      lighting: 'clean studio lighting with subtle gradient background',
      textOverlay: true,
      voiceover: true,
      directorNote: '品牌LOGO定格动画+企业Slogan。简洁有力，给人留下深刻印象。配乐达到高潮后完美收束。',
      generate(ctx) {
        const vo = ctx.voiceoverText || ctx.slogan || `${ctx.brand}. Building tomorrow, today.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a static shot holds on a clean, dark gradient background. The "${ctx.brand}" logo animates into view — materializing particle by particle with a subtle light effect, settling into its final form at center frame. Below the logo, the text "${ctx.slogan || 'Building tomorrow, today.'}" fades in beneath it in an elegant, clean sans-serif font. ${ctx.colorGrading}. The narrator (S1) says in an off-screen voiceover with a confident, closing tone: <d>[English] ${vo}</d> while no character's lips are visible on screen.`,
          soundscape: `A clean, quiet studio atmosphere with a subtle electronic chime that coincides with the logo materialization, followed by a gentle fade to near-silence.`,
          music: `A resolving orchestral chord at a slow, sustained tempo, with rich strings and a final piano note that lingers and gradually fades to silence.`
        };
      }
    }
  ],

  // ===== 产品广告 (5 scenes) =====
  product: [
    {
      id: 'problem', name: '痛点引入', nameEn: 'Problem Scene', duration: 5,
      shotType: 'medium shot',
      cameraMovement: 'The camera holds a static shot with a slight handheld shake',
      lighting: 'slightly dim, muted lighting to convey frustration',
      textOverlay: false,
      voiceover: false,
      directorNote: '展示用户痛点场景——使用竞品时的困扰、生活中的不便。略微暗淡的光线和手持晃动传达焦虑感。',
      generate(ctx) {
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a medium shot shows a person in their ${ctx.usageScenario || 'everyday environment'} clearly experiencing frustration with ${ctx.problemContext || 'an inefficient traditional solution'}. ${ctx.cameraMovement}, capturing their expression of mild frustration. The lighting is slightly dim and muted, conveying a sense of limitation. The person sets down the inadequate product and looks at the camera with a questioning expression.`,
          soundscape: `A heavy sigh followed by the thud of an object being set down on a table, overlaid with a muted room tone that conveys a sense of everyday frustration.`,
          music: `A minimal, slightly tense electronic drone at a slow tempo, with dissonant undertones and a low pulsing rhythm.`
        };
      }
    },
    {
      id: 'reveal', name: '产品亮相', nameEn: 'Product Reveal', duration: 5,
      shotType: 'close-up shot',
      cameraMovement: 'The camera performs a slow 360-degree arc around the subject',
      lighting: 'dramatic studio lighting with bright rim light and dark background',
      textOverlay: true,
      voiceover: true,
      directorNote: '产品英雄镜头！360度环绕拍摄，影棚级灯光打出产品轮廓光。黑底+亮光，高级感拉满。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `Introducing ${ctx.product || ctx.brand} — redefining what's possible.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a close-up shot frames ${ctx.product || ctx.industryData.productContext} against a pure black background. ${ctx.cameraMovement}. Dramatic studio lighting with a bright rim light traces every edge and contour of the product, creating a stunning hero shot. Light reflects off the premium surface materials. A bold text overlay reading "${ctx.product || ctx.brand}" appears at the center of the frame in a sleek modern font with a metallic finish. The narrator (S1) says in an off-screen voiceover with an exciting, reveal tone: <d>[English] ${vo}</d>`,
          soundscape: `A sharp, clean whoosh sound as the product is revealed, followed by a subtle electronic hum that conveys premium quality and technological sophistication.`,
          music: `An energetic electronic build-up at a moderate tempo, featuring a rising synth sweep that peaks at the moment of product reveal, followed by a firm, punchy beat.`
        };
      }
    },
    {
      id: 'features', name: '功能展示', nameEn: 'Feature Demo', duration: 5,
      shotType: 'extreme close-up shot',
      cameraMovement: 'The camera pushes in with small amplitude at slow speed',
      lighting: 'bright, clean lighting highlighting product details',
      textOverlay: true,
      voiceover: true,
      directorNote: '微距特写展示产品细节和功能——材质、接口、操作。每个细节都要清晰可见，叠加功能名称。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `Every detail engineered to perfection. Every feature designed for you.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, an extreme close-up shot captures the fine details of ${ctx.product || ctx.industryData.productContext}. ${ctx.cameraMovement} across the surface, revealing premium materials, precise craftsmanship, and refined textures. A finger gently interacts with the product, demonstrating a key feature. Clean text overlays appear sequentially: "Precision Crafted", then "Smart Technology", in a minimal sans-serif font at the lower third of the frame. The narrator (S1) says in an off-screen voiceover with an informative, confident tone: <d>[English] ${vo}</d>`,
          soundscape: `The crisp tactile sound of a finger touching a smooth surface, a subtle click of a button, and the faint whir of a mechanism, all under a clean studio ambience.`,
          music: `A modern, rhythmic electronic piece at a moderate tempo, with crisp percussion hits synchronized with the feature reveal moments and a steady, firm bass line.`
        };
      }
    },
    {
      id: 'lifestyle', name: '使用场景', nameEn: 'Lifestyle Scene', duration: 5,
      shotType: 'medium-wide shot',
      cameraMovement: 'The camera tracks the subject from the side at moderate speed',
      lighting: 'bright natural lighting, warm and inviting',
      textOverlay: false,
      voiceover: true,
      directorNote: '展示产品在真实生活场景中的使用——用户愉悦地使用产品，生活因产品而更美好。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `See how ${ctx.product || ctx.brand} fits seamlessly into your life.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a medium-wide shot shows a person using ${ctx.product || ctx.industryData.productContext} in a beautiful real-world setting. ${ctx.cameraMovement} as the person moves through their day with ease and joy. ${ctx.lightingDesc}. The person smiles, clearly enjoying the experience. The product integrates naturally into the scene, enhancing the moment rather than dominating it. The narrator (S1) says in an off-screen voiceover with a warm, relatable tone: <d>[English] ${vo}</d> while the on-screen person's lips remain closed.`,
          soundscape: `Natural environmental sounds — gentle footsteps, ambient outdoor or indoor sounds, the subtle operation of the product, and a faint sound of contentment from the user.`,
          music: `A composition at a moderate tempo, featuring bright acoustic guitar, light percussion, and a clear melodic synth line.`
        };
      }
    },
    {
      id: 'cta', name: '购买引导', nameEn: 'Call to Action', duration: 5,
      shotType: 'static shot',
      cameraMovement: 'The camera holds a static shot throughout',
      lighting: 'clean, bright studio lighting with gradient background',
      textOverlay: true,
      voiceover: true,
      directorNote: '产品+品牌LOGO+促销信息+CTA按钮。直接有力，驱动行动。配乐在高潮中收尾。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `${ctx.brand}. Available now. Experience the difference.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a static shot holds on ${ctx.product || ctx.industryData.productContext} displayed prominently against a clean gradient background. The "${ctx.brand}" logo appears at the top of the frame. Below the product, bold text overlays read: "${ctx.ctaText || 'Available Now'}" and "${ctx.slogan || 'Experience the Difference'}" in a clean, modern sans-serif font. A subtle shimmer effect passes across the text. ${ctx.colorGrading}.`,
          soundscape: `A clean, bright studio atmosphere with a satisfying chime sound as the text appears, followed by a subtle ambient electronic bed.`,
          music: `An energetic, firm electronic outro at a moderate tempo, with a strong final beat and a bright, resolved chord that fades cleanly to end.`
        };
      }
    }
  ],

  // ===== 品牌形象片 (5 scenes) =====
  brand: [
    {
      id: 'emotional', name: '情感共鸣', nameEn: 'Emotional Hook', duration: 5,
      shotType: 'close-up shot',
      cameraMovement: 'The camera pushes in with small amplitude at slow speed',
      lighting: 'soft natural light with warm golden tones',
      textOverlay: false,
      voiceover: true,
      directorNote: '情感开场——特写人物表情、眼神，或一个富有情感的场景细节。建立情感连接，引发共鸣。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `What do we really want? Not more things. But more meaning.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a close-up shot frames a person's face in a moment of quiet reflection. ${ctx.cameraMovement} as warm natural light catches their eyes. The expression conveys depth, hope, and a search for something more. The background is softly blurred, drawing full attention to the human emotion. The narrator (S1) says in an off-screen voiceover with a warm, intimate tone: <d>[English] ${vo}</d> while the on-screen person's lips remain gently closed.`,
          soundscape: `A soft, intimate room tone with the faint sound of breathing, a distant bird call through an open window, and the subtle rustle of fabric.`,
          music: `A delicate piano melody at a slow tempo, with sparse, resonant notes that build gradually, joined by soft sustained strings.`
        };
      }
    },
    {
      id: 'story', name: '品牌故事', nameEn: 'Brand Story', duration: 5,
      shotType: 'medium shot',
      cameraMovement: 'The camera slowly trucks left with small amplitude at slow speed',
      lighting: 'cinematic warm lighting with practical light sources',
      textOverlay: false,
      voiceover: true,
      directorNote: '讲述品牌故事——创立初心、发展历程。可用蒙太奇手法，多个场景片段拼接。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `${ctx.brand} was born from a simple belief: that everyone deserves something better.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a medium shot shows a craftsman or creator at work — hands shaping, building, or designing with passion and precision. ${ctx.cameraMovement}, revealing the dedication in every gesture. Warm practical lighting from a nearby lamp creates an intimate, authentic atmosphere. Tools, materials, and work-in-progress fill the frame with texture and story. The narrator (S1) says in an off-screen voiceover with a storytelling, warm tone: <d>[English] ${vo}</d> while the on-screen person's lips remain closed.`,
          soundscape: `The authentic sounds of craftsmanship — tools meeting materials, the scrape of a blade, the tap of a hammer, or the hum of a machine — all under a warm workshop ambiance.`,
          music: `A storytelling acoustic arrangement at a slow tempo, featuring a bright guitar fingerpicking pattern and a gentle, melodic piano line.`
        };
      }
    },
    {
      id: 'values', name: '价值传递', nameEn: 'Value Proposition', duration: 5,
      shotType: 'wide shot',
      cameraMovement: 'The camera slowly rises while pulling back',
      lighting: 'bright, inspiring lighting with natural warmth',
      textOverlay: true,
      voiceover: true,
      directorNote: '大远景展示品牌价值——人群、社区、影响力。镜头升起，视野扩大，象征格局与胸怀。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `We believe in quality without compromise. In people over profit. In building things that last.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a wide shot shows a vibrant scene of people and community — a bustling marketplace, a group of friends sharing a moment, or a diverse crowd moving through a beautiful public space. ${ctx.cameraMovement}, expanding the view to reveal the full scope of human connection. ${ctx.lightingDesc}. A subtle text overlay reading "${ctx.brand}" fades in briefly at the lower third. The narrator (S1) says in an off-screen voiceover with a passionate, values-driven tone: <d>[English] ${vo}</d>`,
          soundscape: `The rich ambiance of human life — overlapping conversations, footsteps, laughter, and the gentle sounds of a living community, all layered naturally.`,
          music: `An orchestral arrangement at a moderate tempo, featuring rich strings, a melodic woodwind line, and a gentle percussion that builds with a swelling crescendo.`
        };
      }
    },
    {
      id: 'lifestyle', name: '生活方式', nameEn: 'Lifestyle', duration: 5,
      shotType: 'medium-wide shot',
      cameraMovement: 'The camera tracks the subject from behind at moderate speed',
      lighting: 'golden hour natural lighting, warm and cinematic',
      textOverlay: false,
      voiceover: true,
      directorNote: '跟随镜头展示品牌所代表的生活方式——运动、旅行、工作、休闲。黄金时刻光影。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `This is not just a product. It's a way of living. A way of being.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a medium-wide shot follows a person moving through a beautiful, aspirational setting — a coastal path at sunset, a mountain trail, or a vibrant city street. ${ctx.cameraMovement}. Golden hour light bathes everything in warmth. The person moves with confidence and joy, embodying the lifestyle that ${ctx.brand} represents. The narrator (S1) says in an off-screen voiceover with an aspirational, warm tone: <d>[English] ${vo}</d> while the on-screen person's lips remain closed.`,
          soundscape: `Natural environmental sounds — waves, wind through trees, or city ambiance — layered with footsteps and the subtle sounds of movement and activity.`,
          music: `A cinematic arrangement at a moderate tempo, featuring bright acoustic guitar, driving percussion, and a soaring melodic line.`
        };
      }
    },
    {
      id: 'brandFrame', name: '品牌定格', nameEn: 'Brand Frame', duration: 5,
      shotType: 'static shot',
      cameraMovement: 'The camera holds a static shot throughout',
      lighting: 'clean, elegant lighting with soft gradient',
      textOverlay: true,
      voiceover: true,
      directorNote: '品牌LOGO+Slogan定格。简洁优雅，留白充分。最后的情感余韵和品牌印象。',
      generate(ctx) {
        const vo = ctx.voiceoverText || ctx.slogan || `${ctx.brand}. Live more.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a static shot holds on a clean, elegant background with a soft gradient. The "${ctx.brand}" logo appears at center frame with a refined animation — a gentle light sweep passes across it. Below the logo, the text "${ctx.slogan || 'Live more.'}" fades in in an elegant serif font. The composition is minimal, with generous negative space. ${ctx.colorGrading}. The narrator (S1) says in an off-screen voiceover with a warm, closing tone: <d>[English] ${vo}</d>`,
          soundscape: `A quiet, clean atmosphere with a single, resonant chime as the logo appears, followed by a gentle fade to near-silence.`,
          music: `A final, sustained orchestral chord at a slow tempo, with full strings and a single piano note that resonates and gradually fades.`
        };
      }
    }
  ],

  // ===== 电商短视频 (4 scenes) =====
  ecommerce: [
    {
      id: 'closeup', name: '产品特写', nameEn: 'Product Close-up', duration: 5,
      shotType: 'extreme close-up shot',
      cameraMovement: 'The camera pushes in with large amplitude at slow speed',
      lighting: 'bright studio lighting with colorful accent lights',
      textOverlay: true,
      voiceover: false,
      directorNote: '极特写产品开箱/展示——材质、颜色、细节。快节奏，视觉冲击力强。叠加产品名称。',
      generate(ctx) {
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, an extreme close-up shot captures ${ctx.product || ctx.industryData.productContext} being unboxed or revealed. ${ctx.cameraMovement} across the product surface, showcasing premium textures, vibrant colors, and fine details. Bright studio lighting with colorful accent lights creates an eye-catching, social-media-ready look. A bold text overlay reading "${ctx.product || ctx.brand}" pops in at center frame with a dynamic animation. ${ctx.colorGrading}.`,
          soundscape: `The satisfying sound of unboxing — paper crinkling, a box opening, the tap of fingernails on the product surface, and a subtle electronic pop as text appears.`,
          music: `An upbeat, trendy electronic track at a fast tempo, with punchy beats, bright synth stabs, and a catchy rhythm suited to short-form video pacing.`
        };
      }
    },
    {
      id: 'selling', name: '卖点展示', nameEn: 'Key Selling Points', duration: 5,
      shotType: 'medium close-up shot',
      cameraMovement: 'The camera performs quick cuts between different angles',
      lighting: 'bright, vibrant lighting with dynamic color shifts',
      textOverlay: true,
      voiceover: true,
      directorNote: '快切镜头展示核心卖点——每个卖点一个镜头，叠加卖点文字。节奏紧凑，信息密度高。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `Three reasons you'll love it.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a medium close-up shot shows ${ctx.product || ctx.industryData.productContext} from angle one, highlighting Feature 1. A bold text overlay reads "${ctx.sellingPoint1 || 'Premium Quality'}" with a dynamic entrance animation. [Shot 2] At 00:01.500, the shot cuts to a different angle showing Feature 2. Text overlay reads "${ctx.sellingPoint2 || 'Smart Design'}". [Shot 3] At 00:03.000, the shot cuts to a third angle showing Feature 3. Text overlay reads "${ctx.sellingPoint3 || 'Great Value'}". Each cut reveals a new benefit with energetic visual transitions. ${ctx.colorGrading}. The narrator (S1) says in an off-screen voiceover with an energetic, sales-oriented tone: <d>[English] ${vo}</d>`,
          soundscape: `Quick swoosh sounds synchronized with each cut, the tactile sounds of product interaction, and bright electronic pop sounds as text overlays appear.`,
          music: `A high-energy electronic track at a fast tempo, with punchy drops synchronized with each cut, driving beats, and a catchy melodic hook suited to the fast-cut pacing.`
        };
      }
    },
    {
      id: 'results', name: '使用效果', nameEn: 'Results Demo', duration: 5,
      shotType: 'medium shot',
      cameraMovement: 'The camera tracks the subject from the side at moderate speed',
      lighting: 'bright, natural lighting with warm tones',
      textOverlay: false,
      voiceover: true,
      directorNote: '展示使用前/后效果或使用过程中的体验。真实用户场景，展示产品带来的改变。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `See the difference for yourself.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a medium shot shows a person using ${ctx.product || ctx.industryData.productContext} in a real-life scenario. ${ctx.cameraMovement} as the person demonstrates the product in action, clearly showing positive results and satisfaction. The before-and-after or in-use effect is visually compelling. ${ctx.lightingDesc}. The person's expression transitions from neutral to delighted. The narrator (S1) says in an off-screen voiceover with an enthusiastic tone: <d>[English] ${vo}</d> while the on-screen person's lips remain closed.`,
          soundscape: `Natural environmental sounds, the sounds of product usage, and a subtle sound of delight from the user, all under a bright ambient background.`,
          music: `An upbeat, lively electronic track at a moderate tempo, with bright melodies, clapping rhythms, and an energetic but not overwhelming arrangement.`
        };
      }
    },
    {
      id: 'cta', name: '行动召唤', nameEn: 'Call to Action', duration: 5,
      shotType: 'static shot',
      cameraMovement: 'The camera holds a static shot throughout',
      lighting: 'bright, attention-grabbing lighting',
      textOverlay: true,
      voiceover: true,
      directorNote: '产品+限时优惠+购买按钮+倒计时感。紧迫感驱动行动，配乐在高潮中结束。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `Shop now — limited time offer!`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a static shot shows ${ctx.product || ctx.industryData.productContext} prominently displayed with bold text overlays: "${ctx.brand}" at top, "${ctx.ctaText || 'Limited Time Offer'}" in large text at center, and "${ctx.slogan || 'Shop Now'}" in a button-style graphic at bottom. A subtle countdown timer or "limited stock" indicator adds urgency. ${ctx.colorGrading}. The composition is designed for maximum visual impact and conversion.`,
          soundscape: `A clean, bright studio sound with attention-grabbing chime sounds as each text element appears, and a final satisfying pop sound.`,
          music: `An energetic, urgency-driven electronic track at a fast tempo, with a driving beat, rising tension, and a punchy final drop that closes abruptly.`
        };
      }
    }
  ],

  // ===== 活动宣传片 (5 scenes) =====
  event: [
    {
      id: 'teaser', name: '活动预热', nameEn: 'Event Teaser', duration: 5,
      shotType: 'medium shot',
      cameraMovement: 'The camera pushes in with small amplitude at slow speed',
      lighting: 'dramatic low-key lighting with spotlights',
      textOverlay: true,
      voiceover: true,
      directorNote: '悬念式预热——暗调、聚光灯、若隐若现的活动元素。叠加活动名称和日期，制造期待感。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `Something extraordinary is coming.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a medium shot shows a dramatic, partially lit stage or venue space. ${ctx.cameraMovement} as spotlights sweep across the scene, revealing glimpses of the event setup. Dramatic low-key lighting creates mystery and anticipation. A bold text overlay reading "${ctx.eventName || ctx.brand + ' Event'}" appears with a dynamic reveal animation, followed by "${ctx.eventDate || 'Coming Soon'}" beneath it. ${ctx.colorGrading}. The narrator (S1) says in an off-screen voiceover with an exciting, mysterious tone: <d>[English] ${vo}</d>`,
          soundscape: `A deep, resonant bass rumble building in intensity, layered with the sweep of spotlight motors and an electronic riser that creates tension and anticipation.`,
          music: `A cinematic electronic build at a slow but rising tempo, featuring deep bass, atmospheric synth pads, and a rising tension that peaks without resolution.`
        };
      }
    },
    {
      id: 'highlights', name: '活动亮点', nameEn: 'Event Highlights', duration: 5,
      shotType: 'wide shot',
      cameraMovement: 'The camera tracks forward at moderate speed through the venue',
      lighting: 'vibrant, colorful stage lighting with dynamic effects',
      textOverlay: true,
      voiceover: true,
      directorNote: '展示活动核心亮点——嘉宾、表演、展区。快速切换不同亮点，每个叠加亮点名称。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `World-class speakers. Unforgettable performances. One incredible experience.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a wide shot moves through a vibrant event venue filled with activity. ${ctx.cameraMovement}, revealing different zones — a main stage with massive LED screens, an exhibition area with interactive displays, and a networking lounge. Colorful stage lighting creates dynamic, exciting atmosphere. Bold text overlays appear sequentially: "${ctx.highlight1 || 'Keynote Speakers'}", "${ctx.highlight2 || 'Live Performances'}", "${ctx.highlight3 || 'Interactive Expo'}" in a modern, energetic font. The narrator (S1) says in an off-screen voiceover with an energetic, promotional tone: <d>[English] ${vo}</d>`,
          soundscape: `The energetic buzz of a large venue — crowd chatter, music from different zones, the rumble of bass from the main stage, and the excitement of a live event atmosphere.`,
          music: `An energetic, festival-style electronic track at a fast tempo, with driving beats, bright synth melodies, and dynamic drops that build with the live event's momentum.`
        };
      }
    },
    {
      id: 'atmosphere', name: '现场氛围', nameEn: 'Atmosphere', duration: 5,
      shotType: 'medium-wide shot',
      cameraMovement: 'The camera arcs around the crowd at slow speed',
      lighting: 'dynamic stage lighting with color washes and laser effects',
      textOverlay: false,
      voiceover: true,
      directorNote: '弧线运镜环绕人群，展示现场热烈氛围——观众欢呼、互动、合影。灯光秀效果。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `Join thousands of passionate people, all in one place.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a medium-wide shot captures a crowd of enthusiastic attendees at a live event. ${ctx.cameraMovement}, showing people cheering, taking photos, and engaging with exhibits. Dynamic stage lighting with color washes and laser effects creates an electric atmosphere. The energy is palpable — smiles, excitement, and connection everywhere. The narrator (S1) says in an off-screen voiceover with an enthusiastic, inviting tone: <d>[English] ${vo}</d>`,
          soundscape: `The roar of an excited crowd, cheers and applause, the thump of bass from stage speakers, and the ambient energy of a live event in full swing.`,
          music: `A high-energy electronic track at a fast tempo, with soaring melodies, driving percussion, and a building drop that rises with the crowd.`
        };
      }
    },
    {
      id: 'info', name: '参与方式', nameEn: 'How to Join', duration: 5,
      shotType: 'medium shot',
      cameraMovement: 'The camera holds a static shot throughout',
      lighting: 'clean, bright lighting with professional background',
      textOverlay: true,
      voiceover: true,
      directorNote: '展示活动信息——日期、地点、报名方式。清晰的信息展示，叠加关键信息。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `Mark your calendar. ${ctx.eventDate || 'This fall'}. ${ctx.eventLocation || 'At the convention center'}.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a static shot holds on a clean, professional background. Text overlays appear in sequence with smooth animations: "${ctx.eventName || ctx.brand + ' Event'}" as the main title, "${ctx.eventDate || 'Date TBA'}" and "${ctx.eventLocation || 'Location TBA'}" as key information, and "${ctx.ctaText || 'Register Now'}" as a prominent call-to-action button. The layout is clean, modern, and information-focused. ${ctx.colorGrading}. The narrator (S1) says in an off-screen voiceover with a clear, informative tone: <d>[English] ${vo}</d>`,
          soundscape: `A clean, professional studio atmosphere with subtle electronic chimes as each information element appears on screen.`,
          music: `A modern, clean electronic track at a moderate tempo, with crisp beats, a steady rhythm, and a firm melody.`
        };
      }
    },
    {
      id: 'cta', name: '行动召唤', nameEn: 'Call to Action', duration: 5,
      shotType: 'static shot',
      cameraMovement: 'The camera holds a static shot throughout',
      lighting: 'bright, energetic lighting with gradient background',
      textOverlay: true,
      voiceover: true,
      directorNote: '活动LOGO+报名按钮+倒计时/限量信息。紧迫感驱动报名行动。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `Tickets are limited. Don't miss out — register today!`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a static shot displays the "${ctx.eventName || ctx.brand + ' Event'}" logo prominently at center frame. Below it, a bold "${ctx.ctaText || 'Register Now'}" button-style text overlay pulses gently. A "Limited Spots Available" indicator adds urgency. The background features an energetic gradient with subtle animated elements. ${ctx.colorGrading}. The narrator (S1) says in an off-screen voiceover with an urgent, exciting tone: <d>[English] ${vo}</d>`,
          soundscape: `A bright, attention-grabbing studio sound with a satisfying chime as the CTA appears and a subtle urgency-building electronic bed.`,
          music: `An energetic, urgency-driven electronic track at a fast tempo, with a driving beat, rising tension, and a powerful final hit that lands abruptly.`
        };
      }
    }
  ],

  // ===== 招聘宣传 (5 scenes) =====
  recruitment: [
    {
      id: 'workplace', name: '企业环境', nameEn: 'Workplace', duration: 5,
      shotType: 'wide tracking shot',
      cameraMovement: 'The camera tracks forward at moderate speed through the office',
      lighting: 'bright natural lighting from large windows',
      textOverlay: true,
      voiceover: true,
      directorNote: '穿越式移动镜头展示办公环境——开放工位、休闲区、会议室。自然光，明亮舒适。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `This is where ideas come to life. Welcome to ${ctx.brand}.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a wide tracking shot moves through a modern, bright office space. ${ctx.cameraMovement}, passing open workstations, collaborative areas, and glass-walled meeting rooms. Natural light floods through floor-to-ceiling windows. Plants, modern furniture, and thoughtful design create an inviting work environment. A subtle text overlay reading "${ctx.brand}" appears in the upper corner. The narrator (S1) says in an off-screen voiceover with a warm, welcoming tone: <d>[English] ${vo}</d>`,
          soundscape: `The ambient sounds of a modern office — keyboards clicking, soft conversations, the hum of air conditioning, and occasional laughter, all under a bright, productive atmosphere.`,
          music: `A bright electronic track at a moderate tempo, with clean melodies, light percussion, and a steady forward-moving pulse.`
        };
      }
    },
    {
      id: 'culture', name: '团队文化', nameEn: 'Team Culture', duration: 5,
      shotType: 'medium shot',
      cameraMovement: 'The camera trucks right with small amplitude at slow speed',
      lighting: 'warm, natural office lighting',
      textOverlay: false,
      voiceover: true,
      directorNote: '中景展示团队文化——团建活动、头脑风暴、午餐交流。温暖自然，展现人文关怀。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `We don't just work together. We grow together, celebrate together, and win together.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a medium shot captures a team enjoying a collaborative moment — laughing around a whiteboard filled with ideas, sharing a meal in a bright break room, or celebrating a project milestone. ${ctx.cameraMovement}, revealing genuine connection and camaraderie. The atmosphere is warm, energetic, and authentic. The narrator (S1) says in an off-screen voiceover with a warm, genuine tone: <d>[English] ${vo}</d> while all on-screen characters' lips remain closed.`,
          soundscape: `The warm sounds of team interaction — animated conversation, laughter, the clink of coffee cups, and the rustle of shared food, all under a lively office ambiance.`,
          music: `An acoustic arrangement at a moderate tempo, featuring bright guitar, light percussion, and a clear melodic line.`
        };
      }
    },
    {
      id: 'growth', name: '成长机会', nameEn: 'Growth Opportunities', duration: 5,
      shotType: 'medium close-up shot',
      cameraMovement: 'The camera pushes in with small amplitude at slow speed',
      lighting: 'bright, motivational lighting',
      textOverlay: true,
      voiceover: true,
      directorNote: '展示成长路径——培训、晋升、技能提升。叠加职业发展关键词，激励人心。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `Your potential has no limits here. We invest in your growth, every step of the way.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a medium close-up shot shows a professional engaged in learning — attending a workshop, presenting to colleagues, or working with a mentor. ${ctx.cameraMovement}, capturing the focus and determination in their expression. Text overlays appear sequentially: "Mentorship Programs", "Career Advancement", "Continuous Learning" in a clean, motivational font. The narrator (S1) says in an off-screen voiceover with an inspiring, motivational tone: <d>[English] ${vo}</d> while the on-screen person's lips remain closed.`,
          soundscape: `The focused sounds of learning — a marker on a whiteboard, the tap of a keyboard, murmured discussions, and the ambient energy of a productive learning environment.`,
          music: `A track at a moderate tempo, featuring rising piano, building strings, and a steady rhythm.`
        };
      }
    },
    {
      id: 'testimonials', name: '员工故事', nameEn: 'Employee Stories', duration: 5,
      shotType: 'close-up shot',
      cameraMovement: 'The camera holds a static shot with subtle, natural movement',
      lighting: 'soft, warm portrait lighting',
      textOverlay: false,
      voiceover: true,
      directorNote: '员工特写——真实的眼神和表情。画外音讲述员工的真实感受和成长故事。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `I've grown more in two years here than I ever thought possible. This is where I belong.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a close-up shot frames an employee's face in warm, soft portrait lighting. ${ctx.cameraMovement}. Their expression is genuine — a mix of pride, contentment, and authenticity. The background is softly blurred, drawing complete focus to the human story. The narrator (S1) says in an off-screen voiceover with a sincere, personal tone: <d>[English] ${vo}</d> while the on-screen person's lips remain gently closed, their eyes conveying emotion.`,
          soundscape: `A quiet, intimate atmosphere with a soft room tone, the faint ambient sounds of an office in the background, and a subtle warmth in the air.`,
          music: `A piano piece at a slow tempo, with sparse, resonant notes and gentle sustained strings.`
        };
      }
    },
    {
      id: 'join', name: '加入我们', nameEn: 'Join Us', duration: 5,
      shotType: 'static shot',
      cameraMovement: 'The camera holds a static shot throughout',
      lighting: 'clean, bright lighting with gradient background',
      textOverlay: true,
      voiceover: true,
      directorNote: '品牌LOGO+"加入我们"CTA+招聘网站。简洁有力，激发行动。',
      generate(ctx) {
        const vo = ctx.voiceoverText || `Your future starts here. Join ${ctx.brand}.`;
        return {
          visual: `[Shot 1] ${ctx.styleKeywords}, a static shot displays the "${ctx.brand}" logo at center frame with a clean, modern animation. Below it, bold text reads "Join Our Team" in a welcoming font, followed by "${ctx.ctaText || 'Apply Now at ' + ctx.brand + '.com/careers'}" as a clear call-to-action. The background features a bright, optimistic gradient. ${ctx.colorGrading}. The narrator (S1) says in an off-screen voiceover with a warm, inviting, closing tone: <d>[English] ${vo}</d>`,
          soundscape: `A clean, bright atmosphere with a welcoming chime as the text appears, followed by a gentle ambient fade.`,
          music: `A bright outro at a moderate tempo, with open chords, a clear melody, and a final resolved note.`
        };
      }
    }
  ]
};

// ========== 提示词生成辅助函数 ==========

/**
 * 生成完整的H3提示词
 * @param {Object} ctx - 上下文对象
 * @param {Object} scene - 场景模板
 * @returns {Object} { prompt, sceneData }
 */
// ========== 品牌选填：未填品牌时清理残留的空品牌文字 ==========
// 当未填写企业/品牌名称时，画面文字与画外音中不应出现任何假名（如 YourBrand）。
// 仅在不填品牌时调用：移除含空品牌名的画面文字片段，并清理因品牌为空产生的多余空格。
function stripInactiveBrandVisual(text) {
  if (!text) return text;
  // —— 英文：整句/整段移除含空品牌名（""）的画面文字 ——
  const en = [
    /A large elegant text overlay reading ""[^.]*\./g,
    /A clean text overlay reading ""[^.]*\./g,
    /A subtle text overlay reading ""[^.]*\./g,
    /A bold text overlay reading ""[^.]*\./g,
    /The "" logo animates into view[^.]*\./g,
    /The "" logo appears at [^.]*\./g,
    /On-screen, a plain, understated title reads ""\./g,
    /Bold on-screen text reads ""[^.]*\./g,
    /bold text overlays: ""[^.]*\./g,
    / — ""/g // 仅去掉空品牌名，保留其后的 slogan / tagline
  ];
  // —— 中文：移除含空品牌名（""）的画面文字片段 ——
  const zh = [
    /[^，。、]*品牌名""，/g,
    /[^，。、]*品牌名""。/g,
    /[^，。、]*""标志[^，。]*[。，]/g,
    /[^，。、]*出现""标志[。，]?/g,
    /[^，。、]*呈现""标志[。，]?/g,
    /[^，。、]*显示""[。，]?/g,
    /[^，。、]*打出""，/g,
    /——""/g
  ];
  en.forEach(function (p) { text = text.replace(p, ''); });
  zh.forEach(function (p) { text = text.replace(p, ''); });
  // 收尾：清理残留空格、重复标点（含 <d> 画外音内因空品牌产生的多余空格）
  text = text
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+\./g, '.')
    .replace(/\.{2,}/g, '.')
    .replace(/\s+,/g, ',')
    .replace(/,\s*\./g, '.')
    .replace(/\s+，/g, '，')
    .replace(/，\s*。/g, '。')
    .replace(/\s+。/g, '。')
    .replace(/“\s*”/g, '“”') // 兜底：空中文引号
    .trim();
  return text;
}

function generateScenePrompt(ctx, scene) {
  const result = scene.generate(ctx);

  // 品牌选填：未填品牌时，清理画面/画外音中残留的空品牌文字与多余空格
  if (!ctx.hasBrand) {
    result.visual = stripInactiveBrandVisual(result.visual);
  }

  // 风格叙事DNA：搞笑/剧情反转等风格会在每场戏注入专属叙事 flavor
  // （纯净版：未追加 flavor，供整片六段式只注入一次使用）
  let visualEn = result.visual;
  const visualEnBase = result.visual;
  if (ctx.narrativeFlavor) {
    visualEn += ' ' + ctx.narrativeFlavor;
  }
  // 行业叙事DNA：水疗养生等行业会在每场戏注入合规语境（调理不治疗）
  if (ctx.industryNarrative) {
    visualEn += ' ' + ctx.industryNarrative;
  }

  // 中文版提示词（来自 zhdata.js，与英文一一对应）
  let visualZh = '';
  let visualZhBase = '';
  let soundscapeZh = '';
  let musicZh = '';
  const zhTpl = (typeof ZH_SCENES !== 'undefined' && ZH_SCENES[ctx.videoType] && ZH_SCENES[ctx.videoType][scene.id])
    || (typeof ZH_TWIST_SCENES !== 'undefined' && ZH_TWIST_SCENES[scene.id]);
  if (zhTpl) {
    visualZh = zhTpl.visual(ctx);
    if (!ctx.hasBrand) visualZh = stripInactiveBrandVisual(visualZh);
    visualZhBase = visualZh;
    soundscapeZh = zhTpl.soundscape(ctx);
    musicZh = zhTpl.music(ctx);
    if (ctx.narrativeFlavorZh) visualZh += ' ' + ctx.narrativeFlavorZh;
    if (ctx.industryNarrativeZh) visualZh += ' ' + ctx.industryNarrativeZh;
  } else {
    // 兜底：没有中文模板时使用英文
    visualZh = visualEn;
    visualZhBase = visualEnBase;
    soundscapeZh = result.soundscape;
    musicZh = result.music;
  }

  // 构建完整的H3格式提示词（字段名保持英文，内容分别中/英）
  const promptEn = `integrated_multimodal_description: ${visualEn}\n\noverall_soundscape: ${result.soundscape}\n\nnon_diegetic_music: ${result.music}`;
  const promptZh = `integrated_multimodal_description: ${visualZh}\n\noverall_soundscape: ${soundscapeZh}\n\nnon_diegetic_music: ${musicZh}`;

  // 构建场景数据（用于UI显示）
  const sceneData = {
    id: scene.id,
    name: scene.name,
    nameEn: scene.nameEn,
    duration: scene.duration,
    shotType: scene.shotType,
    cameraMovement: scene.cameraMovement,
    lighting: scene.lighting || ctx.lightingDesc,
    directorNote: scene.directorNote,
    textOverlay: scene.textOverlay,
    voiceover: scene.voiceover,
    // 英文
    visualEn: visualEn,
    visualEnBase: visualEnBase,
    soundscapeEn: result.soundscape,
    musicEn: result.music,
    promptEn: promptEn,
    // 中文
    visualZh: visualZh,
    visualZhBase: visualZhBase,
    soundscapeZh: soundscapeZh,
    musicZh: musicZh,
    promptZh: promptZh,
    aspectRatio: ctx.aspectRatio,
    colorGrading: ctx.colorGrading
  };

  return sceneData;
}

/**
 * 构建上下文对象
 * @param {Object} formData - 用户输入的表单数据
 * @returns {Object} 完整的上下文对象
 */
function buildContext(formData) {
  const stylePreset = STYLES[formData.style] || STYLES.cinematic;
  const industryData = INDUSTRIES[formData.industry] || INDUSTRIES.tech;

  return {
    // 基本信息
    videoType: formData.videoType || 'corporate',
    brand: formData.brandName || '',
    hasBrand: !!formData.brandName,
    product: formData.productDesc || '',
    slogan: formData.slogan || '',
    audience: formData.audience || '',

    // 行业信息
    industry: formData.industry,
    industryName: industryData.name,
    industryData: industryData,
    industryNarrative: industryData.industryNarrative || '',
    industryNarrativeZh: industryData.industryNarrativeZh || '',

    // 健康观念背书库（仅 hydro 行业存在；千问优化器与场景提示词可引用）
    healthKnowledge: industryData.healthKnowledge || null,
    conditioningPoints: industryData.conditioningPoints || [],
    lifestyleTips: industryData.lifestyleTips || null,

    // 风格信息
    style: formData.style,
    styleKeywords: stylePreset.keywords,
    colorGrading: stylePreset.colorGrading,
    lightingDesc: stylePreset.lighting,
    mood: stylePreset.mood,
    musicStyle: stylePreset.musicStyle,
    narrativeFlavor: stylePreset.narrativeFlavor || '',
    narrativeFlavorZh: stylePreset.narrativeFlavorZh || '',

    // 风格信息（中文版，供 zhdata.js 中文模板使用，避免英文泄漏）
    styleKeywordsZh: (STYLE_ZH[formData.style] || STYLE_ZH.cinematic).styleKeywordsZh,
    colorGradingZh: (STYLE_ZH[formData.style] || STYLE_ZH.cinematic).colorGradingZh,
    lightingDescZh: (STYLE_ZH[formData.style] || STYLE_ZH.cinematic).lightingDescZh,
    musicStyleZh: (STYLE_ZH[formData.style] || STYLE_ZH.cinematic).musicStyleZh,

    // 技术参数
    aspectRatio: formData.aspectRatio || '16:9',
    totalDuration: formData.totalDuration || 40,

    // 台词 / 配音脚本（每行对应一个镜头，按顺序分配）
    dialogueLines: (formData.dialogue || '')
      .split('\n').map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; }),

    // 自定义文案
    voiceoverText: formData.voiceoverText || '',
    usageScenario: formData.usageScenario || '',
    problemContext: formData.problemContext || '',
    ctaText: formData.ctaText || '',
    sellingPoint1: formData.sellingPoint1 || '',
    sellingPoint2: formData.sellingPoint2 || '',
    sellingPoint3: formData.sellingPoint3 || '',
    highlight1: formData.highlight1 || '',
    highlight2: formData.highlight2 || '',
    highlight3: formData.highlight3 || '',
    eventName: formData.eventName || '',
    eventDate: formData.eventDate || '',
    eventLocation: formData.eventLocation || '',

    // 相机运动（从场景模板中获取，这里提供默认值）
    cameraMovement: ''
  };
}

/**
 * 剧情反转风格专用分镜模板
 * 一条完整的"误导→反转"叙事弧：假象建立 → 反常细节 → 误导升级 → 假高潮 → 反转揭晓 → 真相收尾
 * 与“普通风格 + 一句 flavor”不同，这里每一场的叙事角色都被重新编排，反转结构更强。
 */
function twistReveal(ctx) {
  switch (ctx.videoType) {
    case 'product':
    case 'ecommerce':
      return {
        line: `The ${ctx.product || 'product'} from ${ctx.brand} was quietly working the whole time — solving exactly what looked broken.`,
        vo: `But ${ctx.brand} had it handled from the very first second.`
      };
    case 'corporate':
      return {
        line: `${ctx.brand} was never the underdog. The "ordinary" scene was the setup — their real strength was hidden in plain sight.`,
        vo: `Turns out ${ctx.brand} was in control the entire time.`
      };
    case 'brand':
      return {
        line: `The brand you underestimated, ${ctx.brand}, was the one thing that made it all right.`,
        vo: `${ctx.brand} was the answer you almost missed.`
      };
    case 'event':
      return {
        line: `The "disaster" was just the pre-show — ${ctx.eventName || ctx.brand} was about to begin, bigger than anyone expected.`,
        vo: `Then the lights hit. ${ctx.eventName || 'The event'} was only getting started.`
      };
    case 'recruitment':
      return {
        line: `The "boring office" was a trick of the light — ${ctx.brand} is where the most unexpected careers take off.`,
        vo: `The job you doubted? It's the best move you'll make.`
      };
    default:
      return {
        line: `${ctx.brand} was never what it appeared to be — and that changes everything.`,
        vo: `Turns out ${ctx.brand} had the real answer all along.`
      };
  }
}

// 反转揭晓——中文版（按视频类型定制）
function twistRevealZh(ctx) {
  switch (ctx.videoType) {
    case 'product':
    case 'ecommerce':
      return {
        line: `其实，来自${ctx.brand}的${ctx.product || '产品'}从头到尾都在默默发力——它解决的就是那个看似崩盘的问题。`,
        vo: `但${ctx.brand}从第一秒起就早有准备。`
      };
    case 'corporate':
      return {
        line: `${ctx.brand}从来不是"弱势方"——那个"普通"的场景只是铺垫，实力其实就藏在最显眼处。`,
        vo: `原来${ctx.brand}始终掌握着全局。`
      };
    case 'brand':
      return {
        line: `你低估的品牌——${ctx.brand}——恰恰是让一切回归正轨的关键。`,
        vo: `${ctx.brand}，就是那个你差点错过的答案。`
      };
    case 'event':
      return {
        line: `这场"翻车"只是开场前的预热——${ctx.eventName || ctx.brand}才正要登场，比任何人想的都要炸。`,
        vo: `灯亮的那一刻，${ctx.eventName || '活动'}才真正开始。`
      };
    case 'recruitment':
      return {
        line: `那个"无聊的办公室"只是光线错觉——${ctx.brand}，正是那些最出人意料的职业起飞的地方。`,
        vo: `你曾犹豫的那份工作？会是你最对的一次选择。`
      };
    default:
      return {
        line: `${ctx.brand}从来不是表面看起来的样子——这一点，彻底改变了结果。`,
        vo: `原来${ctx.brand}从一开始就有真正的答案。`
      };
  }
}

const TWIST_SCENE_TEMPLATES = [
  {
    id: 'twist_setup',
    name: '假象建立',
    nameEn: 'The False Premise',
    duration: 6,
    shotType: 'Establishing Wide',
    cameraMovement: 'slow calm push-in',
    lighting: 'soft naturalistic',
    textOverlay: true,
    voiceover: true,
    directorNote: '用最平常的开场让观众放松警惕，建立"普通广告"的假象，为反转蓄力。',
    generate(ctx) {
      const env = ctx.industryData.environments[0];
      return {
        visual: `[Shot 1] ${ctx.styleKeywords}, an establishing wide shot opens on a completely ordinary, mundane scene — ${env} — as if this were just another typical advertisement. The camera performs a slow, calm push-in with small amplitude. Soft naturalistic lighting, nothing dramatic. On-screen, a plain, understated title reads "${ctx.brand}". The narrator (S1) says in a flat, matter-of-fact off-screen voiceover: <d>[English] You've seen this story a hundred times before.</d>`,
        soundscape: `Everyday ambient sound of the ordinary scene, deliberately unremarkable, like a generic commercial.`,
        music: `${ctx.musicStyle}, but held at a calm, almost boring volume.`
      };
    }
  },
  {
    id: 'twist_anomaly',
    name: '反常细节',
    nameEn: 'The Anomaly',
    duration: 4,
    shotType: 'Extreme Close-up',
    cameraMovement: 'slow zoom in',
    lighting: 'single motivated light',
    textOverlay: false,
    voiceover: true,
    directorNote: '埋下看似无关紧要、却决定反转的"线索"细节。越不起眼越好，让观众先忽略它。',
    generate(ctx) {
      return {
        visual: `[Shot 1] ${ctx.styleKeywords}, an extreme close-up slowly zooms in on one small, seemingly trivial detail that does not quite fit the ordinary scene — a subtle anomaly the audience is meant to dismiss. A single motivated light isolates it; the camera holds on it a beat too long. On-screen, nothing is labeled, keeping it ambiguous. The narrator (S1) barely acknowledges it, almost whispering: <d>[English] Almost nobody notices the small thing in the corner.</d>`,
        soundscape: `A faint, slightly out-of-place sound cue draws subtle attention to the anomaly, then fades.`,
        music: `${ctx.musicStyle}, a single low dissonant note hints at something off, then silence.`
      };
    }
  },
  {
    id: 'twist_misdirect',
    name: '误导升级',
    nameEn: 'Escalating Misdirection',
    duration: 5,
    shotType: 'Medium Shot',
    cameraMovement: 'restless handheld',
    lighting: 'shifting, uncertain',
    textOverlay: false,
    voiceover: true,
    directorNote: '把观众往错误的方向带——看似要出问题/走老套路，张力渐起但仍是假象。',
    generate(ctx) {
      return {
        visual: `[Shot 1] ${ctx.styleKeywords}, a restless medium shot follows the expected, familiar path — the kind of moment where everything seems headed for the obvious, predictable outcome everyone assumes. Handheld, slightly unstable camera builds quiet unease; ${ctx.colorGrading}. The narrator (S1) narrates with false confidence, deliberately leading the audience astray: <d>[English] So naturally, you think you know how this ends.</d>`,
        soundscape: `The ordinary scene begins to fracture — a small mistake, a missed beat, the sound of things going slightly wrong.`,
        music: `${ctx.musicStyle}, tension slowly rising as the familiar path seems to fail.`
      };
    }
  },
  {
    id: 'twist_falseclimax',
    name: '假高潮',
    nameEn: 'The False Climax',
    duration: 5,
    shotType: 'Tight Close-up',
    cameraMovement: 'rapid snap-zoom',
    lighting: 'harsh, high-contrast',
    textOverlay: true,
    voiceover: true,
    directorNote: '伪危机/伪失败——让观众确信最坏结果要发生，把张力推到顶，这是反转前的" deepest 低谷"。',
    generate(ctx) {
      return {
        visual: `[Shot 1] ${ctx.styleKeywords}, a tight close-up snaps in as everything appears to go disastrously wrong — the worst possible version of the story seems inevitable. Rapid snap-zoom and harsh, high-contrast lighting spike the tension to its peak. A stark intertitle reads "Everything falls apart." The narrator (S1) sounds defeated: <d>[English] It looks like it's over. Like it was never going to work.</d>`,
        soundscape: `A harsh sound hit, a sharp record-scratch, the unmistakable sound of failure landing.`,
        music: `${ctx.musicStyle}, crashing to a sudden, crushing low — the false end.`
      };
    }
  },
  {
    id: 'twist_reveal',
    name: '反转揭晓',
    nameEn: 'The Twist Reveal',
    duration: 6,
    shotType: 'Wide-to-Hero',
    cameraMovement: 'pull-back reveal',
    lighting: 'dramatic key-light flip',
    textOverlay: true,
    voiceover: true,
    directorNote: '全片高潮：真相翻转，场景2的"小细节"成为关键，品牌/产品才是隐藏主角。',
    generate(ctx) {
      const r = twistReveal(ctx);
      return {
        visual: `[Shot 1] ${ctx.styleKeywords}, the camera pulls back to reveal the truth that flips everything — the small anomaly from earlier was the whole point. ${r.line} A dramatic key light flips the mood; the color grade brightens and warms. Bold on-screen text reads "${ctx.brand}" with a single word beneath it: "Always." The narrator (S1) delivers the reversal with a knowing smile: <d>[English] ${r.vo}</d>`,
        soundscape: `A heartbeat of absolute silence, then the anomaly clicks into place with a crisp, satisfying sound.`,
        music: `${ctx.musicStyle}, a sharp dramatic sting resolves into a soaring, rising theme.`
      };
    }
  },
  {
    id: 'twist_payoff',
    name: '真相收尾',
    nameEn: 'Truth & Brand Payoff',
    duration: 5,
    shotType: 'Logo Lockup',
    cameraMovement: 'slow settle',
    lighting: 'clean, confident',
    textOverlay: true,
    voiceover: true,
    directorNote: '用反转后的新认知重新收束，品牌LOGO+Slogan+CTA，落版有力。',
    generate(ctx) {
      const cta = ctx.ctaText || (ctx.hasBrand ? ('Discover the truth at ' + ctx.brand) : 'Discover the truth');
      const slogan = ctx.slogan || 'Look closer. The truth was there all along.';
      return {
        visual: `[Shot 1] ${ctx.styleKeywords}, a clean logo lockup settles center frame — "${ctx.brand}" with the tagline "${slogan}" beneath it — now charged with new meaning after the twist. Slow, confident settle; ${ctx.colorGrading}. On-screen CTA reads "${cta}". The narrator (S1) closes with the slogan: <d>[English] ${slogan}</d>`,
        soundscape: `A confident, resolved ambience settles around the logo.`,
        music: `${ctx.musicStyle}, a clean resolved final chord that lands the twist.`
      };
    }
  }
];

/**
 * 生成完整的分镜脚本
 * @param {Object} formData - 用户输入
 * @returns {Array} 场景数据数组
 */
// ========== 产品广告：流程步骤库 + 预设流程 ==========
// 解决"产品广告永远 痛点→亮相→购买"的固定套路：把每个环节拆成可自由组合/排序的独立步骤。
// 选一个预设快速套用，再按需增删、拖拽排序，每段即一个镜头。
const PRODUCT_FLOW_STEPS = {};
SCENE_TEMPLATES.product.forEach(function (s) { PRODUCT_FLOW_STEPS[s.id] = s; });

PRODUCT_FLOW_STEPS.health_awareness = {
  id: 'health_awareness', name: '健康重要性', nameEn: 'Health Awareness', duration: 5,
  shotType: 'medium shot',
  cameraMovement: 'The camera holds a slow, empathetic push-in',
  lighting: 'soft, natural light with a slightly cool, weary tone',
  textOverlay: false,
  voiceover: true,
  directorNote: '不卖货，先共鸣：现代人忙碌中忽视身体，引出"日常养护很重要"。语气真诚、唤醒，不制造焦虑。',
  generate(ctx) {
    const vo = ctx.voiceoverText || 'We take care of everything — yet so often forget the body that carries us through all of it.';
    return {
      visual: `[Shot 1] ${ctx.styleKeywords}, a medium shot follows a busy modern person moving through a packed day — long hours, tense shoulders, a body quietly overdrawn. ${ctx.cameraMovement}. The light is soft but slightly cool, hinting at quiet fatigue. They pause, lift a hand to the back of the neck or lower back, a small moment of realizing the body needs care too. ${ctx.colorGrading}. The narrator (S1) says in an off-screen voiceover with a calm, awakening tone: <d>[English] ${vo}</d> while the on-screen person's lips remain closed.`,
      soundscape: `The muffled rush of a busy day — distant typing, a soft sigh, the faint hum of city life — settling into a calmer, more intimate room tone.`,
      music: `A gentle, reflective piano melody at a slow tempo, sparse and warm, with a single sustained string note that opens space for thought.`
    };
  }
};

PRODUCT_FLOW_STEPS.benefits = {
  id: 'benefits', name: '设备好处', nameEn: 'Product Benefits', duration: 5,
  shotType: 'close-up shot',
  cameraMovement: 'The camera performs a slow 360-degree arc around the subject',
  lighting: 'warm, inviting studio lighting',
  textOverlay: true,
  voiceover: true,
  directorNote: '讲清设备带来的"体验/好处"而非硬广：居家养生仪式、放松舒缓、暖意通达。合规：只讲调理舒缓，绝不作功效承诺（中医/水疗行业由行业叙事自动注入具体语境）。',
  generate(ctx) {
    const subject = ctx.product || ctx.industryData.productContext || ctx.brand;
    const vo = ctx.voiceoverText || 'Small daily rituals add up — a few quiet minutes that help the body relax, unwind, and feel cared for.';
    return {
      visual: `[Shot 1] ${ctx.styleKeywords}, a close-up shot frames ${subject} in real home use, showing the everyday experience it brings. ${ctx.cameraMovement}. Warm, inviting light wraps the scene; the person looks visibly more at ease, the day's tension softening. Clean text overlays read: "Everyday Ease", then "Gentle Care" in a minimal sans-serif font. ${ctx.colorGrading}. The narrator (S1) says in an off-screen voiceover with a warm, benefit-led tone: <d>[English] ${vo}</d>`,
      soundscape: `The soft trickle of water and a faint, soothing hum under a calm home ambience.`,
      music: `A warm, mellow acoustic piece at a moderate tempo, with soft pads and a gentle, reassuring rhythm.`
    };
  }
};

PRODUCT_FLOW_STEPS.audience = {
  id: 'audience', name: '适合人群', nameEn: 'Who It’s For', duration: 5,
  shotType: 'medium-wide shot',
  cameraMovement: 'The camera tracks gently across a sequence of everyday people',
  lighting: 'warm, inclusive lighting',
  textOverlay: false,
  voiceover: true,
  directorNote: '展示适合的人群：久坐上班族、注重日常养护者、全家人等。包容、温暖，不制造焦虑。',
  generate(ctx) {
    const subject = ctx.product || ctx.industryData.productContext || 'the product';
    const vo = ctx.voiceoverText || 'From busy professionals to parents and elders at home — a gentle daily ritual that fits wherever you are.';
    return {
      visual: `[Shot 1] ${ctx.styleKeywords}, a medium-wide shot presents a gentle cross-section of everyday people — a desk-bound professional, a parent, an elder — each stealing a quiet moment of relaxation with ${subject}. ${ctx.cameraMovement}. Warm, inclusive lighting makes everyone feel seen. ${ctx.colorGrading}. The narrator (S1) says in an off-screen voiceover with a warm, welcoming tone: <d>[English] ${vo}</d> while the on-screen person's lips remain closed.`,
      soundscape: `Soft, relatable everyday sounds — a chair rolling, a kettle, gentle footsteps — blended into a calm, unhurried bed.`,
      music: `A bright, friendly acoustic theme at a moderate tempo, light and welcoming.`
    };
  }
};

PRODUCT_FLOW_STEPS.reaction = {
  id: 'reaction', name: '好转反应', nameEn: 'Adjustment Reactions', duration: 5,
  shotType: 'close-up shot',
  cameraMovement: 'The camera holds a slow, reassuring static shot',
  lighting: 'soft, warm, reassuring light',
  textOverlay: false,
  voiceover: true,
  directorNote: '科普"调理期间的好转反应"：身体自我调整时可能出现的温暖、放松、困倦、排寒等正常现象。合规铁律：绝不宣称治疗/疗效，仅为温和居家养生体验，如有不适请咨询专业人士。',
  generate(ctx) {
    const vo = ctx.voiceoverText || 'As the body gently rebalances, you may notice small signs of adjustment — a warm flush, a long sigh of release, a moment of drowsiness. These are the body tending to itself — just your body finding its rhythm again, never a promise of results.';
    return {
      visual: `[Shot 1] ${ctx.styleKeywords}, a calm close-up shot shows a person during a home wellness session — a gentle sheen of warmth on the skin, a relaxed exhale, perhaps a moment of drowsiness as the body adjusts and lets go. ${ctx.cameraMovement}. Soft, reassuring light. ${ctx.colorGrading}. The narrator (S1) says in an off-screen voiceover with a gentle, informative tone: <d>[English] ${vo}</d> while the on-screen person's lips remain closed.`,
      soundscape: `A slow, even breath, the faint trickle of water, and a hushed, calming room tone.`,
      music: `A very soft, minimal ambient pad at a slow tempo, breathing with the scene.`
    };
  }
};

PRODUCT_FLOW_STEPS.brand_story = {
  id: 'brand_story', name: '品牌故事', nameEn: 'Brand Story', duration: 5,
  shotType: 'medium shot',
  cameraMovement: 'The camera slowly trucks left with small amplitude at slow speed',
  lighting: 'cinematic warm lighting with practical light sources',
  textOverlay: false,
  voiceover: true,
  directorNote: '讲品牌初心/理念：专注于居家养生调理，陪伴家庭日常。温和、真诚。',
  generate(ctx) {
    const vo = ctx.voiceoverText || `${ctx.brand} began with a simple belief: that gentle daily care belongs in every home.`;
    return {
      visual: `[Shot 1] ${ctx.styleKeywords}, a medium shot shows the origin of ${ctx.brand} — a warm, hands-on moment of crafting or caring, conveying dedication to everyday wellness. ${ctx.cameraMovement}, revealing authenticity in every gesture. Warm practical lighting from a nearby lamp creates an intimate atmosphere. ${ctx.colorGrading}. The narrator (S1) says in an off-screen voiceover with a warm, storytelling tone: <d>[English] ${vo}</d> while the on-screen person's lips remain closed.`,
      soundscape: `The authentic, comforting sounds of a workshop or home at peace — soft footsteps, a kettle, gentle handling.`,
      music: `A tender piano and strings theme at a slow tempo, sincere and founding.`
    };
  }
};

// 预设流程：选一个快速套用，之后再自由增删 / 排序
const PRODUCT_FLOW_PRESETS = {
  standard: {
    name: '标准转化流',
    desc: '痛点引入 → 产品亮相 → 功能展示 → 使用场景 → 购买引导（经典带货结构）',
    steps: ['problem', 'reveal', 'features', 'lifestyle', 'cta']
  },
  educate: {
    name: '种草科普流',
    desc: '健康重要性 → 设备好处 → 使用场景 → 适合人群 → 好转反应（无购买引导）',
    steps: ['health_awareness', 'benefits', 'lifestyle', 'audience', 'reaction']
  },
  trust: {
    name: '品牌信任流',
    desc: '品牌故事 → 产品亮相 → 功能展示 → 适合人群 → 购买引导',
    steps: ['brand_story', 'reveal', 'features', 'audience', 'cta']
  },
  minimal: {
    name: '极简种草流',
    desc: '产品亮相 → 设备好处 → 使用场景（三镜说完）',
    steps: ['reveal', 'benefits', 'lifestyle']
  }
};

// 流程步骤在面板中的展示顺序（含全部可选项）
const PRODUCT_FLOW_STEP_ORDER = [
  'problem', 'reveal', 'features', 'lifestyle', 'cta',
  'health_awareness', 'benefits', 'audience', 'reaction', 'brand_story'
];

function generateStoryboard(formData) {
  const ctx = buildContext(formData);
  // 图生视频：按镜头自动设计参考图所需上下文
  const isZh = (typeof state !== 'undefined' && state.lang === 'zh');
  const globalFixed = (formData.referenceImages || []).filter(function (r) { return !r.scope || r.scope === 'all'; });
  const hasGlobalFixed = globalFixed.length > 0;
  // 产品广告：若用户选择了「流程」，则按所选步骤组装（自由组合 / 排序）；剧情反转风格仍走专用模板
  const isProductFlow = (formData.videoType === 'product' && formData.style !== 'twist'
    && Array.isArray(formData.flowSteps) && formData.flowSteps.length > 0);
  let templates;
  if (formData.style === 'twist') {
    // 剧情反转风格使用专用反转结构模板，并关闭通用 flavor 叠加（避免重复）
    templates = TWIST_SCENE_TEMPLATES;
    ctx.narrativeFlavor = '';
    ctx.narrativeFlavorZh = '';
  } else if (isProductFlow) {
    // 产品广告：按用户所选「流程」组装步骤（自由组合 / 排序）
    templates = formData.flowSteps
      .map(function (id) { return PRODUCT_FLOW_STEPS[id]; })
      .filter(Boolean);
  } else {
    const videoType = formData.videoType || 'corporate';
    templates = SCENE_TEMPLATES[videoType] || SCENE_TEMPLATES.corporate;
  }

  // 镜头数量：产品广告流程 = 所选步骤数（每个步骤即一段）；其它类型 = 用户指定的段数（默认 5，范围 2–10），超出模板长度时环绕复用
  const shotCount = isProductFlow
    ? templates.length
    : Math.min(10, Math.max(2, parseInt(formData.shotCount, 10) || 5));
  // 单镜头时长：每段 = 一次 H3 生成（默认 15 秒，可选 5/10 秒），每段独立成片
  const shotDur = [5, 10, 15].includes(formData.shotDur) ? formData.shotDur : 15;

  // 按 shotCount 取镜头模板（环绕），每段统一为 shotDur 秒
  const scenes = [];
  for (let i = 0; i < shotCount; i++) {
    const scene = templates[i % templates.length];
    const sceneCtx = {
      ...ctx,
      cameraMovement: scene.cameraMovement,
      lightingDesc: scene.lighting || ctx.lightingDesc,
      dialogueLine: ctx.dialogueLines[i] || ''
    };
    const data = generateScenePrompt(sceneCtx, scene);
    data.duration = shotDur; // 每段固定时长（H3 单次生成上限 15 秒）
    data.dialogueLine = sceneCtx.dialogueLine; // 透传台词，供 buildShotBlock 使用
    data.shotIndex = i; // 记录序号，供参考图 scope 等使用
    data.marketingStyle = formData.marketingStyle || 'none'; // 营销优化层（小红书/抖音），供 buildShotBrief 注入种草调性
    data.flow = formData.flow || 'auto'; // 流程：auto 通用 | wen 文戏 | action 武戏 | grid 九宫格
    data.relationFrom = formData.relationFrom || '';
    data.relationTo = formData.relationTo || '';
    data.coreProp = formData.coreProp || '';
    data.dialogueLang = formData.dialogueLang || '中文';
    data.opponent = formData.opponent || '';
    data.equipBound = formData.equipBound || '';
    // 图生视频：按镜头自动设计本镜头所需参考图（用户无需预先选择，生成后按清单上传）
    data.refPlan = designateShotReferences(data, i, ctx, isZh, hasGlobalFixed);
    scenes.push(data);
  }
  return scenes;
}

// ========== 图生视频：按镜头自动设计参考图（用户无需预先选择，生成后按清单上传）==========
// 设计原则：每个镜头独立在 H3 生成后再拼接；主体图建议全程复用同一张以保证一致；
// 场景图随镜头变化；风格图仅在首镜定调（后续可复用同图）。若用户提供了「全局固定图」，则主体由固定图承担，本函数只补充场景图。
function buildSubjectRefDesc(ctx, scene, isZh) {
  const p = (ctx.product || '').trim();
  const b = (ctx.brand || '').trim();
  const ind = (ctx.industryName || '').trim();
  const core = p || b || ind || (isZh ? '主体' : 'the main subject');
  if (isZh) {
    return core + '（实拍或高清渲染，正面 45° 视角，纯色/渐变背景，材质与轮廓清晰，无文字水印）';
  }
  return core + ' (real photo or clean render, 45-degree front view, solid or gradient background, clear material and silhouette, no watermark)';
}
function buildSceneRefDesc(scene, ctx, isZh) {
  // 优先用本镜头真实画面描述的首句，告诉用户这张场景图应拍什么（可操作性强）
  let vis = (scene.visualZhBase || scene.visualZh || scene.visualEnBase || scene.visualEn || '');
  vis = (' ' + vis).replace(/\s*\[(?:Shot|镜头)\s*\d+\]\s*/gi, ' ').trim();
  const firstSentence = vis.split(/[。.\n]/).map(function (s) { return s.trim(); }).filter(Boolean)[0] || '';
  const light = isZh ? (ctx.lightingDescZh || ctx.lightingDesc || '自然光') : (ctx.lightingDesc || 'natural light');
  if (isZh) {
    const base = firstSentence
      ? ('即：「' + firstSentence.slice(0, 48) + (firstSentence.length > 48 ? '…' : '') + '」')
      : ('与「' + (scene.name || '本镜头') + '」匹配的实景');
    return '本镜头实景环境参考（' + light + '）：' + base + '，机位与背景布局明确，供 H3 参照生成该镜头场景';
  }
  const baseEn = firstSentence
    ? ('i.e. "' + firstSentence.slice(0, 90) + (firstSentence.length > 90 ? '…' : '') + '"')
    : ('matching "' + (scene.name || 'this shot') + '"');
  return 'A real-environment image for this shot (' + light + '): ' + baseEn + ', with clear camera angle and background layout for H3 to reference this shot’s scene';
}
function buildStyleRefDesc(ctx, isZh) {
  const cg = isZh ? (ctx.colorGradingZh || ctx.colorGrading || '精致调色') : (ctx.colorGrading || 'refined color grading');
  const light = isZh ? (ctx.lightingDescZh || ctx.lightingDesc || '动机光') : (ctx.lightingDesc || 'motivated lighting');
  if (isZh) return '整体风格/光影定调参考：' + cg + '，' + light + '，电影质感、低饱和、浅景深';
  return 'Overall style/lighting reference: ' + cg + ', ' + light + ', cinematic, low-saturation, shallow depth of field';
}
// 按镜头设计本镜头所需参考图。hasGlobalFixed=true 时，主体由全局固定图承担，本函数只补场景图。
function designateShotReferences(scene, index, ctx, isZh, hasGlobalFixed) {
  const refs = [];
  if (!hasGlobalFixed) {
    refs.push({ type: isZh ? '主体/产品' : 'product', role: 'subject', reuse: true,
      desc: buildSubjectRefDesc(ctx, scene, isZh) });
  }
  refs.push({ type: isZh ? '场景/环境' : 'scene', role: 'scene', reuse: false,
    desc: buildSceneRefDesc(scene, ctx, isZh) });
  if (index === 0) {
    refs.push({ type: isZh ? '风格/光影' : 'style', role: 'style', reuse: false,
      desc: buildStyleRefDesc(ctx, isZh) });
  }
  return refs;
}
// 有效参考图：全局固定图（scope all/未设）在前，本镜头设计图在后；用于 @image#N 前缀编号
function getEffectiveRefs(globalRefs, shotPlan) {
  const fixed = (globalRefs || []).filter(function (r) { return r.scope === undefined || r.scope === null || r.scope === 'all'; });
  const perShot = (shotPlan || []).map(function (p) { return { type: p.type, desc: p.desc, role: p.role, reuse: !!p.reuse }; });
  return { fixed: fixed, perShot: perShot, all: fixed.concat(perShot) };
}

// ========== 时长与时间码工具 ==========
function distributeDurations(total, n) {
  total = Math.max(1, Math.floor(total || 0));
  n = Math.max(1, n);
  const base = Math.floor(total / n);
  const rem = total - base * n;
  const arr = [];
  for (let i = 0; i < n; i++) arr.push(base + (i < rem ? 1 : 0));
  return arr;
}

function fmtTimecode(totalSec) {
  totalSec = Math.max(0, Math.floor(totalSec));
  const mm = Math.floor(totalSec / 60);
  const ss = totalSec % 60;
  return String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0') + '.000';
}

// ========== 镜头美学控制中文翻译（景别 / 运镜 / 光线） ==========
// 中文模式一律只显示中文；匹配不到的英文技术词回退为空（绝不回退成英文，避免中英混杂）
const SHOT_TYPE_ZH = {
  'medium shot': '中景', 'close-up shot': '特写', 'static shot': '固定镜头',
  'medium close-up shot': '中近景', 'Establishing Wide': '大远景/建立镜头',
  'Extreme Close-up': '大特写', 'Medium Shot': '中景', 'Tight Close-up': '紧凑特写',
  'Wide-to-Hero': '全景转英雄镜头', 'Logo Lockup': 'Logo 定格',
  'aerial establishing shot': '航拍建立镜头', 'extreme close-up shot': '大特写',
  'medium-wide shot': '中远景', 'wide shot': '全景', 'wide tracking shot': '宽幅跟拍'
};
const CAM_ZH = {
  'The camera holds a static shot with a slight handheld shake': '固定机位略带手持晃动',
  'The camera pushes in with small amplitude at slow speed': '缓慢小幅推进',
  'The camera holds a static shot throughout': '全程固定机位',
  'slow calm push-in': '缓慢平稳推进', 'slow zoom in': '缓慢推近',
  'restless handheld': '不安定的手持跟拍', 'rapid snap-zoom': '快速急推',
  'pull-back reveal': '拉远揭示', 'slow settle': '缓慢稳定',
  'The camera arcs around the crowd at slow speed': '镜头缓慢环绕人群',
  'The camera holds a static shot with subtle, natural movement': '固定机位伴随细微自然运动',
  'The camera performs a slow 360-degree arc around the subject': '镜头缓慢 360 度环绕主体',
  'The camera performs quick cuts between different angles': '快速多角度切换',
  'The camera pushes in with large amplitude at slow speed': '缓慢大幅推进',
  'The camera pushes in with large amplitude at slow speed toward a bright light source': '缓慢大幅推向明亮光源',
  'The camera slowly descends with small amplitude at slow speed while pushing forward': '缓慢小幅下降并向前推进',
  'The camera slowly rises while pulling back': '缓慢上升同时拉远',
  'The camera slowly trucks left with small amplitude at slow speed': '缓慢小幅向左横移',
  'The camera tracks forward at moderate speed through the office': '中等速度向前跟拍穿过办公室',
  'The camera tracks forward at moderate speed through the space': '中等速度向前跟拍穿过空间',
  'The camera tracks forward at moderate speed through the venue': '中等速度向前跟拍穿过场馆',
  'The camera tracks the subject from behind at moderate speed': '中等速度从背后跟拍主体',
  'The camera tracks the subject from the side at moderate speed': '中等速度从侧面跟拍主体',
  'The camera trucks right with small amplitude at slow speed': '缓慢小幅向右横移'
};
const LIGHT_ZH = {
  'slightly dim, muted lighting to convey frustration': '略暗沉闷',
  'bright, motivational lighting': '明亮激励', 'soft, warm portrait lighting': '柔和暖调人像光',
  'clean, bright lighting with gradient background': '干净明亮渐变背景光',
  'soft naturalistic': '柔和自然光', 'single motivated light': '单一主光',
  'shifting, uncertain': '游移不定', 'harsh, high-contrast': '硬调高反差',
  'dramatic key-light flip': '戏剧性主光翻转', 'clean, confident': '干净自信'
};

// 清理镜头文本中的残留噪声（无论用户是否填台词，都应执行）
// 1. <d>[中文/English]...</d> 模板画外音标签
// 2. (Shot type: ...; Camera: ...; Lighting: ...; Duration: ...) 英文美学控制括号
// 3. 画外音引导语 + 嘴唇描述残留
// 4. 多余空格与标点
function cleanVisualForSpeech(body) {
  let s = body || '';
  // 去掉 <d>[语言]...</d> 标签及内容（模板默认画外音）
  s = s.replace(/<d>\[[^\]]*\][\s\S]*?<\/d>/g, '');
  // 去掉英文美学控制括号 (Shot type: ...; Camera: ...; Lighting: ...; Duration: ...)
  s = s.replace(/\s*\(Shot type:\s*[^)]+\)\s*/g, ' ');
  // 中文引导语残留
  s = s.replace(/画外音（S1）[^，。：]*说道：/g, '');
  s = s.replace(/，?画面中[^。]*嘴唇[^。]*。?/g, '');
  // 英文引导语+台词残留
  s = s.replace(/The narrator \(S1\)[\s\S]*?(?:says|sounds|whispers|delivers|closes|continues|acknowledges|leads|states|narrates|speaks)[^.]*\./g, '');
  s = s.replace(/,\s*while the on-screen person[^.]*/g, '');
  // 收尾清理
  s = s.replace(/\s{2,}/g, ' ').trim();
  s = s.replace(/^[\s，,：:]+/, '');
  return s;
}

// 时间（秒）格式化：整数不带小数，否则保留 1 位
function fmtDurLocal(d) {
  const v = Math.round(d * 10) / 10;
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

// 图生视频：按 H3 模板规则，在绝对开头输出连续的图片引用前缀
// 例：@参考图1作为人物视觉参考（描述：主角，穿蓝色西装的中年男性）@参考图2作为产品视觉参考（…）
function buildImageRefLine(refImages, isZh) {
  if (!refImages || !refImages.length) return '';
  const parts = refImages.map((r, i) => {
    const num = i + 1;
    const t = (r.type || '参考');
    const d = (r.desc || '').trim();
    if (isZh) {
      return '@参考图' + num + '作为' + t + '视觉参考' + (d ? ('（描述：' + d + '）') : '');
    }
    return '@Image' + num + ' as ' + refTypeEn(t) + ' reference' + (d ? (' (description: ' + d + ')') : '');
  });
  return parts.join('') + (isZh ? '' : ' ');
}

// 把单镜头时长切成若干时间线小段（非均匀，尾部略长），保证画面持续有内容、不空镜
function splitDuration(dur) {
  dur = Math.max(4, Math.floor(dur));
  let bounds;
  if (dur <= 6) {
    bounds = [0, Math.round(dur / 2), dur];
  } else if (dur <= 10) {
    bounds = [0, Math.round(dur * 0.34), Math.round(dur * 0.67), dur];
  } else {
    // 13–15 秒切成 4 段（如 15 → 0,3,7,11,15），比示例更细
    bounds = [0, Math.round(dur * 0.2), Math.round(dur * 0.45), Math.round(dur * 0.7), dur];
  }
  // 去重并夹紧，确保严格递增
  const cleaned = [];
  for (const b of bounds) {
    const v = Math.max(0, Math.min(dur, b));
    if (!cleaned.length || v > cleaned[cleaned.length - 1]) cleaned.push(v);
  }
  if (cleaned[cleaned.length - 1] !== dur) cleaned.push(dur);
  return cleaned; // [0, b1, b2, ..., dur]
}

// 单镜头的结构化自然语言简报核心（细分时间线 + 镜头运动 + 视觉风格 + 声音设计）
// 用于让每个镜头的提示词填满其时长，符合 H3「时间段无缺口覆盖完整时长、全正向描述」的要求
// 中文模式：技术词一律取中文翻译，匹配不到则留空（绝不回退英文，避免中英混杂）
// 单镜头的结构化自然语言简报核心（遵循海螺/MiniMax 官方指南）：
//   1) 先描述整体场景（地点 + 人物 + 正在发生的事）——取镜头正文首句
//   2) 再按时间拆分为多段，每段合并「镜头 + 相机运动」
//   3) 声音（台词/音效/音乐）在块内只描述一次，避免逐段重复啰嗦
// ---- 主体类型识别（角色 / 产品 / 场景），决定一致性锁定的正确措辞 ----
function detectSubject(scene, lang) {
  const t = (lang === 'zh'
    ? (scene.visualZh || scene.visualZhBase || '')
    : (scene.visualEn || scene.visualEnBase || '')).toLowerCase();
  const hasPerson = /人|角色|主角|顾客|使用者|消费者|用户|她|他|模特/.test(t) ||
    /person|character|protagonist|customer|user|model/.test(t);
  const hasProduct = /产品|设备|商品|品牌|浴缸|装置|机器|水疗|摩雅|巨晴|仪器/.test(t) ||
    /product|device|brand|machine|equipment|appliance|bathtub|tub|hydrotherapy|gadget|tool/.test(t);
  return { character: hasPerson, product: hasProduct, scene: (!hasPerson && !hasProduct) };
}

function lockClauseZh(subject) {
  const p = [];
  if (subject.character) p.push('角色一致性：画面中人物五官、发型、服装、身材比例保持完全一致，不换脸、不变装、不融合人物特征');
  if (subject.product) p.push('主体一致性：设备造型、材质、标识与结构细节保持完全一致，无变形、无多余元素增减');
  if (subject.scene || p.length === 0) p.push('场景一致性：空间陈设与光影基调保持统一稳定');
  return p.join('；') + '。';
}
function lockClauseEn(subject) {
  const p = [];
  if (subject.character) p.push('Character consistency: preserve face, hairstyle, costume and body proportions; no face-swap, wardrobe change or feature blending');
  if (subject.product) p.push('Subject consistency: product geometry, material, logo and structural details stay fully consistent - no deformation, no added or removed elements');
  if (subject.scene || p.length === 0) p.push('Scene consistency: space, set dressing and lighting base stay uniform and stable');
  return p.join('; ') + '.';
}

// 渐进式镜头微运动（每段不同，避免全程同一句运镜）
var CAM_MOVES_ZH = ['镜头平滑下移，切至细节特写', '稳定推进至特写，突出主体', '镜头缓移环绕，展现层次', '匀速拉回半全景，均衡收束'];
var CAM_MOVES_EN = ['the camera glides down to a detail close-up', 'the camera pushes in steadily to a close-up', 'the camera drifts around to reveal layers', 'the camera pulls back smoothly to a balanced half-wide'];

// 中段渐进模板（去掉首尾，中间段依次取用，保证每段内容不同、有推进）
function midBeatsZh(subject) {
  if (subject.product) return ['推进至材质与工艺细节特写，突出产品精致质感', '展现核心功能运行瞬间，功能可视化、可感知', '产品自然融入使用场景，与环境或人物呼应', '局部光影扫过主体，强化材质与轮廓'];
  if (subject.character) return ['人物执行核心动作，情绪渐起', '近景捕捉神态与肢体细节，情绪自然流露', '人物与产品/环境互动，关系明确', '光影勾勒人物轮廓，气质凸显'];
  return ['环境细节渐次展开，空间层次丰富', '光影流动，氛围自然递进', '前景与背景关系明确，画面有纵深'];
}
function midBeatsEn(subject) {
  if (subject.product) return ['push in to a detail close-up highlighting the product craftsmanship', 'reveal the core function in motion, making it visible and tangible', 'let the product sit naturally in its use scene, echoing people or environment', 'sweep light across the subject to emphasize material and contour'];
  if (subject.character) return ['the character performs the key action, emotion rising', 'a close shot captures facial expression and body detail, emotion natural', 'the character interacts with product/environment, relation clear', 'light sculpts the character silhouette, temperament highlighted'];
  return ['environment details unfold gradually, space gains depth', 'light flows, atmosphere builds naturally', 'foreground and background relate clearly, frame has depth'];
}
function closeBeatZh(subject) {
  if (subject.product) return '镜头匀速拉回，产品稳定运行/静置，画面均衡定格，强化产品视觉记忆点';
  if (subject.character) return '人物状态稳定收束，表情与姿态自然定格';
  return '镜头稳定落定，空间与氛围完整呈现';
}
function closeBeatEn(subject) {
  if (subject.product) return 'the camera pulls back smoothly, the product runs/idles stably, frame locks balanced, reinforcing the product memory point';
  if (subject.character) return 'the character settles steadily, expression and posture naturally locked';
  return 'the camera settles, space and atmosphere fully presented';
}

// 生成每段（运镜 + 画面）的渐进、不重复内容
function genBeats(scene, lang, segs, subject) {
  const isZh = lang === 'zh';
  let body = (isZh ? (scene.visualZhBase || scene.visualZh) : (scene.visualEnBase || scene.visualEn)) || '';
  body = cleanVisualForSpeech((' ' + body).replace(/\s*\[(?:Shot|镜头)\s*\d+\]\s*/gi, ' ').trim());
  const CAM_RE = /^\s*the camera\b/i;
  const CAM_RE2 = /\bcamera (slowly|moves|trucks|pans|tilts|zooms|dollies|tracks|orbits|rotates|continues|holds|stays)\b/i;
  const sentences = body.split(isZh ? /[。.\n]/ : /(?<=[.。])\s+/).map(function (s) { return s.trim(); }).filter(Boolean);
  const nonCam = sentences.filter(function (s) { return !CAM_RE.test(s) && !CAM_RE2.test(s); });
  const overview = nonCam[0] || sentences[0] || (isZh
    ? (subject.product ? '主体静置于画面中，开始展现细节' : (subject.character ? '主体进入画面，建立场景' : '空间铺陈，氛围建立'))
    : (subject.product ? 'the subject sits in frame, revealing initial details' : (subject.character ? 'the subject enters frame, establishing the scene' : 'space is laid out, atmosphere is established')));
  const userClauses = nonCam.slice(1);
  const tpl = isZh ? midBeatsZh(subject) : midBeatsEn(subject);
  const camMoves = isZh ? CAM_MOVES_ZH : CAM_MOVES_EN;
  const out = [];
  for (let i = 0; i < segs.length; i++) {
    let visual, camera;
    if (i === 0) {
      visual = overview;
      camera = isZh ? (CAM_ZH[(scene.cameraMovement || '').trim()] || '自然运镜') : (scene.cameraMovement || 'the camera moves naturally');
    } else if (i === segs.length - 1) {
      visual = isZh ? closeBeatZh(subject) : closeBeatEn(subject);
      camera = camMoves[Math.min(camMoves.length - 1, i - 1)];
    } else {
      let c = userClauses[i - 1];
      if (!c || c === overview || (out.length && c === out[out.length - 1].visual)) c = tpl[(i - 1) % tpl.length];
      visual = c;
      camera = camMoves[(i - 1) % camMoves.length];
    }
    out.push({ camera: camera, visual: visual });
  }
  return out;
}

// ========== 结构化分镜简报核心（V2 · 四段式分层输出）==========
// 遵循 H3 官方指南 + 逐帧实测优化：
//   每段输出 4 个独立子字段：运镜（完整句）| 画面（含角色细节锁定）| 台词（带说话人标记）| 声音层（三层分离）
//   声音三层：环境音（角色能听到的）> 配乐（仅观众听到的BGM）> 人声（台词主体）
//   中文模式：技术词一律取中文翻译，匹配不到则留空（绝不回退英文）
function buildShotBriefCore(scene, lang, shotIndex) {
  const isZh = lang === 'zh';
  const dur = scene.duration || 5;
  const idx = (shotIndex || 0) + 1;

  // 运镜翻译（中文完整句式，非标签）
  const camZh = isZh ? (CAM_ZH[(scene.cameraMovement || '').trim()] || '自然运镜') : '';
  const camEn = scene.cameraMovement || '';

  // 声音素材
  const sound = isZh
    ? (scene.soundscapeZh || '贴合画面的自然环境底噪')
    : (scene.soundscapeEn || 'natural ambient sound');
  const music = isZh ? (scene.musicZh || '') : (scene.musicEn || '');
  const dialogue = scene.dialogueLine || '';

  // 镜头正文（已清理噪声）
  let body = (isZh ? (scene.visualZhBase || scene.visualZh) : (scene.visualEnBase || scene.visualEn)) || '';
  body = cleanVisualForSpeech((' ' + body).replace(/\s*\[(?:Shot|镜头)\s*\d+\]\s*/gi, ' ').trim());

  // 按句拆分：首句作"整体场景/画面概要"，其余句作为时间线推进内容
  const sentences = body.split(/[。.\n]/).map(function(s){ return s.trim(); }).filter(Boolean);
  const CAM_RE = /^\s*the camera\b/i;
  const CAM_RE2 = /\bcamera (slowly|moves|trucks|pans|tilts|zooms|dollies|tracks|orbits|rotates|continues|holds|stays)\b/i;
  const nonCam = sentences.filter(function(s){ return !CAM_RE.test(s) && !CAM_RE2.test(s); });
  const visualOverview = nonCam[0] || sentences[0] || (isZh
    ? (subject.product ? '主体静置于画面中，开始展现细节' : (subject.character ? '主体进入画面，建立场景' : '空间铺陈，氛围建立'))
    : (subject.product ? 'the subject sits in frame, revealing initial details' : (subject.character ? 'the subject enters frame, establishing the scene' : 'space is laid out, atmosphere is established')));
  const prog = nonCam.slice(1);

  // 细分时间线（覆盖完整时长，无缺口）
  const bounds = splitDuration(dur);
  const segs = [];
  for (let i = 0; i < bounds.length - 1; i++) segs.push([bounds[i], bounds[i + 1]]);

  // 主体类型 + 渐进节拍 + 一致性锁定（修复：纯产品镜头误用“角色锁定”、时间线各段内容重复）
  const subject = detectSubject(scene, lang);
  const beats = genBeats(scene, lang, segs, subject);
  const lock = isZh ? lockClauseZh(subject) : lockClauseEn(subject);

  // ---- 构建每段的四字段输出 ----
  var parts = [];

  // 时间范围格式化
  function fmtSeg(s, e) {
    var ss = String(Math.floor(s / 60)).padStart(2,'0') + ':' + String(s % 60).padStart(2,'0');
    var ee = String(Math.floor(e / 60)).padStart(2,'0') + ':' + String(e % 60).padStart(2,'0');
    return isZh ? (ss + ' \u2014 ' + ee) : (ss + '-' + ee);
  }

  for (var si = 0; si < segs.length; si++) {
    var seg = segs[si], s = seg[0], e = seg[1];
    var range = fmtSeg(s, e);
    var content = beats[si].visual;

    var block = '';
    // --- 运镜（每段用渐进式微运动，避免全程同一句运镜）---
    block += isZh ? ('\u8fd0\u955c\uff1a' + beats[si].camera + '\u3002') : ('Camera: ' + beats[si].camera + '.');
    if (segs.length > 1) { block += isZh ? ('\u672c\u6bb5\u65f6\u95f4\u8303\u56f4\u4e3a ' + range + '\uff0c') : (' Time range: ' + range + '.'); }
    block += '\n\n';

    // --- 画面（本段推进；一致性锁定见全局头部，避免每段重复）---
    if (isZh) {
      block += '\u753b\u9762\uff1a' + content + '\u3002';
    } else {
      block += 'Visual: ' + content + '.';
    }
    block += '\n\n';

    // --- 台词（带说话人标记 + 情绪指导）---
    if (dialogue && si === Math.floor(segs.length / 2)) {
      if (isZh) {
        block += '\u53f0\u8bcd\u2014\u2014' + dialogue;
        block += '\n\uff08\u89d2\u8272\u6e05\u6670\u8bf4\u51fa\uff0c\u8bed\u901f\u9002\u4e2d\uff0c\u53e3\u578b\u4e0e\u4e2d\u6587\u53f0\u8bcd\u51c6\u786e\u540c\u6b65\uff0c\u5305\u542b\u81ea\u7136\u7684\u505c\u987f\u3001\u547c\u5438\u548c\u60c5\u7eea\u6ce2\u52a8\u3002\uff09';
      } else {
        block += 'Dialogue: "' + dialogue + '"';
        block += '\n(Clear speech, natural pace, lipsync with natural pauses, breathing and emotional nuance.)';
      }
      block += '\n\n';
    }

    // --- 声音层（三层分离）---
    if (isZh) {
      block += '\u58f0\u97f3\u5c42\uff08\u672c\u6bb5\uff09\uff1a\n';
      block += '- \u73af\u5883\u97f3\uff1a' + sound + '\u3002\n';
      if (music) { block += '- \u914d\u4e50\uff1a' + music + '\u3002\uff08\u914d\u4e50\u97f3\u91cb\u6c38\u8fdc\u4e0d\u8d85\u8fc7\u4eba\u58f0\u768440%\uff0c\u5728\u53f0\u8bcd\u51fa\u73b0\u65f6\u4e3b\u52a8\u8ba9\u4f4d\u964d\u97f3\u91cf\u6216\u6682\u505c\uff09\n'; }
      else { block += '- \u914d\u4e50\uff1a\u65e0\uff08N/A\uff09\n'; }
      if (dialogue && si === Math.floor(segs.length / 2)) {
        block += '- \u4eba\u58f0\uff1a\u53f0\u8bcd\u58f0\u97f3\u6e05\u6670\u4e3b\u4f53\uff0c\u547c\u5438\u58f0\u548c\u60c5\u7eea\u8868\u8fbe\u81ea\u7136\u53ef\u95fb\u3002\n';
      } else {
        block += '- \u4eba\u58f0\uff1a\u4ee5\u73af\u5883\u97f3\u548c\u914d\u4e50\u4e3b\u4f53\uff08\u672c\u6bb5\u65e0\u53f0\u8bcd\uff09\u3002\n';
      }
    } else {
      block += 'Sound design (this segment):\n';
      block += '- Ambient: ' + sound + '.\n';
      if (music) { block += '- Music: ' + music + '. (Music volume never exceeds 40% of dialogue; duck or pause during spoken lines)\n'; }
      else { block += '- Music: N/A\n'; }
      if (dialogue && si === Math.floor(segs.length / 2)) {
        block += '- Voice: Dialogue is clear and prominent; breathing and emotional expression audible.\n';
      } else {
        block += '- Voice: Ambient and music only (no dialogue in this segment).\n';
      }
    }

    parts.push(block);
  }

  // 组装：段标题 + 四字段内容
  var header = isZh
    ? ('### \u7b2c ' + idx + ' \u6bb5 | ' + fmtSeg(0, dur) + '\n')
    : ('### Segment ' + idx + ' | ' + fmtSeg(0, dur) + '\n');

  return '\n' + header + parts.join('\n---\n\n') + '\n';
}

// 从下一镜抽取简短"开头画面"，用于衔接指令
function deriveOpening(scene, lang) {
  const isZh = lang === 'zh';
  let body = (isZh ? (scene.visualZhBase || scene.visualZh) : (scene.visualEnBase || scene.visualEn)) || '';
  body = (' ' + body).replace(/\s*\[(?:Shot|镜头)\s*\d+\]\s*/gi, ' ').trim();
  const clauses = body.split(/[，。；,.\n]/).map(s => s.trim()).filter(Boolean);
  let opening = clauses[0] || (isZh ? '主体以一个明确的动作/姿态开场' : 'the subject opens with a clear action or pose');
  // 截断到合适长度，避免衔接指令过长
  const limit = isZh ? 28 : 60;
  if (opening.length > limit) opening = opening.slice(0, limit) + (isZh ? '…' : '...');
  return opening;
}

// 单个镜头在 detailed_description 中的段落（[Shot N] + 时间码 + 描述 + 美学控制 + 台词 + 结构化简报）
// refNote：可选，图生视频时本镜头所用参考图备注（已带前导空格）
// opts.includeMarker：是否保留 [Shot N] 标记（detailed_description 用 true；分镜卡片单独成片用 false）
function buildShotBlock(scene, index, startSec, lang, refNote, opts) {
  const isZh = lang === 'zh';
  const dialogueLine = scene.dialogueLine || '';
  // 使用纯净版（未追加 per-shot flavor），避免整片六段式里风格/行业语境被每个镜头重复一遍
  let body = (isZh ? (scene.visualZhBase || scene.visualZh) : (scene.visualEnBase || scene.visualEn)) || '';
  // 全局去掉模板自带的 [Shot N] / [镜头N] 前缀，避免嵌套
  body = (' ' + body).replace(/\s*\[(?:Shot|镜头)\s*\d+\]\s*/gi, ' ').trim();
  // ★ 无论是否提供台词，始终清理 <d> 标签、英文括号、引导语等噪声
  body = cleanVisualForSpeech(body);
  // 剔除正文中自带的纯运镜句，避免与下方结构化简报的 Camera 行重复、也避免运镜被写多遍
  if (!isZh) {
    const CAM_REb = /^\s*the camera\b/i;
    const CAM_RE2b = /\bcamera (slowly|moves|trucks|pans|tilts|zooms|dollies|tracks|orbits|rotates|continues|holds|stays)\b/i;
    const clausesB = body.split(/(?<=[.。])\s+/).map(function(s){ return s.trim(); }).filter(Boolean);
    const nonCamB = clausesB.filter(function(s){ return !CAM_REb.test(s) && !CAM_RE2b.test(s); });
    if (nonCamB.length) body = nonCamB.join('. ') + '.';
  }

  const tc = index === 0 ? '' : (fmtTimecode(startSec) + ', ');
  const includeMarker = !(opts && opts.includeMarker === false);
  const marker = includeMarker ? ('[Shot ' + (index + 1) + '] ' + tc) : '';

  // 美学控制（仅当景别/运镜/光线均能翻译为中文时才显示，避免回退成英文造成中英混杂）
  let ctrl = '';
  if (isZh && includeMarker) {
    const st = SHOT_TYPE_ZH[(scene.shotType || '').trim()] || '';
    const cam = CAM_ZH[(scene.cameraMovement || '').trim()] || '';
    const light = LIGHT_ZH[(scene.lighting || '').trim()] || '';
    if (st && cam && light) {
      ctrl = '（美学控制：景别·' + st + '；运镜·' + cam + '；光线·' + light + '）';
    }
  }

  // 台词（显式、可读，避免海螺发音糊成乱语）
  let dl = '';
  if (dialogueLine) {
    if (isZh) {
      dl = ' 台词：「' + dialogueLine + '」（角色清晰说出，普通话，语速适中，口型与台词同步）';
    } else {
      dl = ' Spoken line: "' + dialogueLine + '" (clear speech, natural pace, lipsync).';
    }
  }

  let out = marker + body + ctrl + dl;
  if (refNote) out += refNote;
  // 追加结构化自然语言简报（时间线 + 镜头运动 + 视觉风格 + 声音设计），让单镜填满时长
  out += buildShotBriefCore(scene, lang, index);
  return out;
}

// 分镜卡片「直投提示词」专用：H3 标准开头 + 参考图前缀 + 结构化简报（不含 [Shot N] 标记）
// nextScene：下一镜（用于生成"衔接下一镜开头"指令；末镜传 null 表示收尾）
// ========== 英文 H3 标准格式（I2VA / T2VA） ==========
// 严格遵循 MiniMax 官方 h3-prompt-writing Skill：
//   - 图生视频(I2VA) 正文前加指令行：For the target video, at 0.00 seconds..., <Picture 1> (from [Shot 1]) is fully referenced.
//   - 三字段：integrated_multimodal_description / overall_soundscape / non_diegetic_music
//   - integrated_multimodal_description 用 [Shot 1] 开头（无时间码），后续用 At MM:SS.mmm 内联时间码描述运镜推进
//   - 运镜写成 运动类型+幅度+速度 的自然英文句
//   - 中文台词用 <d>[Chinese] ... </d> 原样保留（H3 用中文音素读，避免乱码）
//   - 本地生成，不依赖千问 API（重新生成不耗 token）
//   - 质量原则融合 script-writing-studio（导演内部 V2.0）：衔接写"可见画面状态"而非管理语言、台词时长闸门（中文 3-5 字/秒）
function buildShotBriefEn(scene, index, startSec, refNote, refImages, nextScene) {
  const dur = scene.duration || 5;
  const genMode = (typeof state !== 'undefined' && state.formData && state.formData.genMode) || 't2v';
  const isI2V = genMode === 'i2v';
  // 图生视频：有效参考图 = 全局固定图 + 本镜头设计图（每镜头独立编号）
  const eff = getEffectiveRefs(refImages, scene.refPlan);
  const imgs = (isI2V && eff.all.length) ? eff.all : [];

  // I2VA：在绝对开头输出「@Image1 as 人物参考@Image2 as 产品参考@Image3 as 场景参考」前缀，
  // 明确告诉 H3 每一张参考图是什么，强锚定主体/产品/环境，避免生成结果与参考图无关
  const imgRefLine = imgs.length ? (buildImageRefLine(imgs, false) + '\n') : '';

  // ---- 指令行（仅 I2VA）----
  let instruction = '';
  if (isI2V) {
    let line = 'For the target video, at 0.00 seconds into the target video, <Picture 1> (from [Shot 1]) is fully referenced.';
    const partial = [];
    for (let i = 1; i < imgs.length; i++) partial.push('<Picture ' + (i + 1) + '>');
    if (partial.length) line += ' ' + partial.join(' and ') + ' are partially referenced to establish the product and environment.';
    instruction = line + '\n\n';
  }

  // ---- 取英文正文并清理（去掉 [Shot N] 前缀、英文对白整句、残留 <d> 标签）----
  let body = (scene.visualEnBase || scene.visualEn || '') + '';
  body = body.replace(/\s*\[Shot\s*\d+\]\s*/gi, ' ').trim();
  body = body.replace(/The narrator \(S1\)[\s\S]*?lips remain closed\.?/gi, '').trim();
  body = body.replace(/\(S1\) says[\s\S]*?lips remain closed\.?/gi, '').trim();
  body = body.replace(/<d>\[English\][\s\S]*?<\/d>/gi, '').trim();
  body = body.replace(/\s{2,}/g, ' ').trim();

  const sentences = body.split(/(?<=[.。])\s+/).map(function(s){ return s.trim(); }).filter(Boolean);
  // 剔除正文中自带、与 camSentence 重复的纯运镜句，避免「camera slowly trucks left」被写 4 遍 / 首尾重复加倍
  const CAM_RE = /^\s*the camera\b/i;
  const CAM_RE2 = /\bcamera (slowly|moves|trucks|pans|tilts|zooms|dollies|tracks|orbits|rotates|continues|holds|stays)\b/i;
  const nonCam = sentences.filter(function(s){ return !CAM_RE.test(s) && !CAM_RE2.test(s); });
  const opening = nonCam[0] || sentences[0] || 'Live-action, cinematic, a medium shot frames the subject, establishing the scene';
  const prog = nonCam.slice(1);

  // ---- 时间线分段 ----
  const bounds = splitDuration(dur);
  const segs = [];
  for (let i = 0; i < bounds.length - 1; i++) segs.push([bounds[i], bounds[i + 1]]);

  // 主体类型 + 渐进节拍（修复：各段内容重复；纯产品镜头误用角色锁定）
  const enSubject = detectSubject(scene, 'en');
  const enBeats = genBeats(scene, 'en', segs, enSubject);
  const enGlobal = '=== Global Style & Consistency ===\n' +
    'Resolution: 1080p+ (2K), 16:9 aspect ratio.\n' +
    lockClauseEn(enSubject) + '\n' +
    'Negative constraints: cartoon/anime/chibi/infantile; modern clothing or architecture; plastic skin or over-smoothing; blurred faces or distorted features; wrong lip-sync; simultaneous speech or wrong speaker; irrelevant characters speaking; character fusion/face-swap/wardrobe change; extra people or limbs; overacting or cheap effects; camera shake or flickering; subtitles/text/watermarks on screen.\n\n';

  const camEn = scene.cameraMovement || 'the camera moves naturally';
  const camSentence = camEn.charAt(0).toLowerCase() + camEn.slice(1);
  const dialogue = (scene.dialogueLine || '').trim();
  const dialogueSeg = segs.length > 1 ? Math.floor(segs.length / 2) : 0;

  // ---- 组装 integrated_multimodal_description（运镜在开头声明一次，后续段用渐进式画面推进）----
  const openingClean = opening.replace(/[.\u3002\s]+$/, '');
  let imd = '[Shot 1] ' + openingClean + '. ' + camSentence + '.';

  const extra = [];
  for (let si = 1; si < segs.length; si++) {
    const s = segs[si][0];
    const content = enBeats[si].visual;
    const contentClean = String(content).replace(/[.\u3002\s]+$/, '');
    extra.push('At ' + fmtTimecode(s) + ', ' + contentClean + '.');
  }

  // 对白（中文，<d>[Chinese] ... </d>）
  if (dialogue) {
    const dlgClause = ' The off-screen narrator (S1) says in a calm, reassuring voice: <d>[Chinese] ' + dialogue + '</d> while the subject’s lips remain closed.';
    if (extra.length) {
      const pos = Math.min(dialogueSeg, extra.length - 1);
      extra[pos] += dlgClause;
    } else {
      imd += dlgClause;
    }
  }

  let imdFull = imd;
  if (extra.length) imdFull += ' ' + extra.join(' ');

  // 衔接 / 收尾（可见画面状态，非管理语言）
  if (nextScene) {
    const nextOpening = deriveOpening(nextScene, 'en');
    imdFull += ' The shot leads seamlessly into the next shot without a cut: "' + nextOpening + '".';
  } else {
    imdFull += ' The shot ends on a stable, readable frame that naturally closes the film.';
  }
  if (refNote && !isI2V) imdFull += refNote;

  // ---- 三字段组装 ----
  const sound = scene.soundscapeEn || 'soft ambient sound continues throughout';
  const music = scene.musicEn || 'N/A';
  let out = enGlobal + imgRefLine + instruction;
  out += 'integrated_multimodal_description: ' + imdFull + '\n\n';
  out += 'overall_soundscape: ' + sound + '\n\n';
  out += 'non_diegetic_music: ' + (/N\/A/i.test(music) ? 'N/A' : music);
  return out;
}

// ========== 营销优化风格（小红书种草 / 抖音快节奏）==========
// 与行业、视觉风格正交：作为「发布平台调性」叠加层，只改提示词的营销表达（钩子/调性/互动引导），不动画面与合规铁律。
const MARKETING_STYLES = {
  none: { name: '无（纯展示）', nameEn: 'None' },
  xiaohongshu: {
    name: '小红书种草',
    nameEn: 'Xiaohongshu Seeding',
    toneZh: '种草调性：第一人称真实分享，口语化、有生活温度，像朋友安利好物；画面重真实生活感，不刻意摆拍。',
    hookZh: '开场钩子：前 3 秒用一句扎心 / 反差 / 好奇抓住注意力（如"每天累到只想瘫着？""后悔没早点知道"），引发共鸣后再展开。',
    ctaZh: '种草收尾：主角微笑面向镜头，自然口播互动引导：「觉得有用就点个收藏，关注我，带你把日常过成养生局。」口型与台词严格同步。',
    ctaNoPersonZh: '种草收尾：结尾以引导互动收束，可叠加「收藏 · 关注」类字幕感，自然不突兀，不强行加人物。'
  },
  douyin: {
    name: '抖音快节奏',
    nameEn: 'Douyin Fast-paced',
    toneZh: '抖音调性：节奏明快、信息密度高，强情绪、强代入；前 3 秒黄金钩子直给，不铺垫。',
    hookZh: '开场钩子：前 3 秒用强反差或悬念直击痛点（如"用了 7 天，我后悔没早买""别再花冤枉钱"），立刻抓住注意力。',
    ctaZh: '引流收尾：主角看向镜头，干脆利落地口播：「喜欢点赞，关注我，下次不迷路。」口型与台词严格同步。',
    ctaNoPersonZh: '引流收尾：结尾以强引导收束，可叠加「点赞 · 关注」类字幕感，节奏干脆不拖沓。'
  }
};

// 分镜卡片「直投提示词」中文路径：七段式导演简报（贴合 MiniMax H3 三流程总模板）
// 七段：①影片目标与核心概念 ②人物/主体与一致性锁定 ③0-dur时间线(无缺口) ④摄影/表演/动作规则 ⑤视觉风格与材质 ⑥声音设计 ⑦收束
// 关键原则：①保留 @image#N = 描述（H3 可解析的参考图绑定，勿改成 @图片N作为XX）；②台词用 <d>[Chinese] ... </d>；
// ③全正向描述；④营销层（小红书/抖音）仅叠加钩子/调性/CTA；⑤flow 决定各段内容侧重（auto/wen/action，grid 走 buildNineGrid）
// nextScene：下一镜（用于生成"衔接下一镜开头"指令；末镜传 null 表示收尾）
// ========== 中文「导演简报」七段式（贴合 MiniMax H3 三流程总模板）==========
// 七段：①影片目标与核心概念 ②人物/主体与一致性锁定 ③0-dur时间线(无缺口) ④摄影/表演/动作规则 ⑤视觉风格与材质 ⑥声音设计 ⑦收束
// flow: 'auto' 通用 | 'wen' 文戏 | 'action' 武戏（'grid' 九宫格由 buildNineGrid 专有处理）
function fmtRange(s, e) {
  const a = fmtTimecode(s).replace(/\.\d+$/, '');
  const b = fmtTimecode(e).replace(/\.\d+$/, '');
  return a + '–' + b;
}

// 文戏各段时间线阶段标签
function wenLabels(n) {
  const all = ['建立关系与空间', '核心证据/道具出现', '对方回应与消化', '主角决定', '行为结果与情绪余波'];
  const out = [];
  for (let i = 0; i < n; i++) out.push(all[Math.min(i, all.length - 1)]);
  return out;
}

// 武戏：高密度攻防因果链（默认 14 个有效动作，可被表单 opponent/equipBound/environment 参数化）
function actionBeatsZh(scene, subject) {
  const opp = (typeof scene.opponent === 'string' && scene.opponent.trim()) || '对手';
  const eq = (typeof scene.equipBound === 'string' && scene.equipBound.trim()) || '近身装备';
  const envWord = (typeof scene.environment === 'string' && scene.environment.trim()) || '场景';
  return [
    '起势：主角重心下沉，' + eq + '横置胸前，眼神锁定' + opp,
    '先手试探：一个小幅虚刺逼出' + opp + '第一反应',
    '第一次交换：格挡相抵、火花迸发，双方各退半步重整',
    opp + '升级攻势，连续两记重斩压迫主线',
    '主角借力旋身，以' + envWord + '中障碍物为支点翻越',
    '环境互动：撞落' + envWord + '器物，碎片改变走位',
    '主角受困：被逼至墙角，护架出现裂痕',
    '脱困反制：贴墙反弹，一记低位扫踢夺回控制权',
    '追击：顺势突进，' + eq + '划过' + opp + '装备连接处',
    opp + '失衡后撤，撞上' + envWord + '结构',
    '终结动作：主角上前一步，精准命中并借势卸力',
    opp + '物理反应：受力后撤、失衡倒地',
    '结果落地：主角稳住身形，' + eq + '归位，胜负明确',
    '余势：镜头掠过' + envWord + '中静止的碎片，确认局面'
  ];
}

// ① 核心概念（按 flow 侧重）
function buildConceptZh(scene, subject, flow, mk, index) {
  const dur = scene.duration || 15;
  const subj = (typeof scene.subject === 'string' && scene.subject.trim()) || (subject.character ? '主角' : subject.product ? '产品主体' : '场景主体');
  const env = (typeof scene.environment === 'string' && scene.environment.trim()) || '';
  let c = '影片目标与核心概念：';
  if (flow === 'wen') {
    c += '本次讲述一次清楚的关系变化——从「' + (scene.relationFrom || '关系现状') + '」走向「' + (scene.relationTo || '关系转折') + '」，由画面中的核心证据/道具（' + (scene.coreProp || '关键物件') + '）触发，并在 ' + dur + ' 秒内完成一次可被摄影机看懂的情绪转折。';
  } else if (flow === 'action') {
    c += (subject.character ? '主角' : '主体') + '对阵' + (scene.opponent || '对手') + '，以' + (scene.equipBound || '现有装备与空间') + '构建完整战斗因果链；每一招都改变距离、姿态、控制权或环境，而非装饰性堆叠。';
  } else {
    c += subj + (env ? ('于' + env) : '') + '中，完成一段信息清晰、主体一致的' + (subject.product ? '产品展示' : '叙事片段') + '。';
  }
  if (mk !== 'none' && index === 0) {
    const M = MARKETING_STYLES[mk];
    c += '\n' + M.toneZh + '\n' + M.hookZh;
  }
  return c;
}

// ② 一致性锁定
function buildLockZh(scene, subject, flow) {
  let s = '人物/主体与一致性锁定：';
  const subj = (typeof scene.subject === 'string' && scene.subject.trim()) || '';
  const act = (typeof scene.action === 'string' && scene.action.trim()) || '';
  const env = (typeof scene.environment === 'string' && scene.environment.trim()) || '';
  if (subj) s += '固定主体：' + subj + '；';
  if (act) s += '核心动作：' + act + '；';
  if (env) s += '固定场景：' + env + '；';
  s += lockClauseZh(subject);
  if (flow === 'action') s += ' 双方轮廓、尺寸、装备、惯用手与空间位置全程一致，面孔与体型不漂移。';
  else if (flow === 'wen') s += ' 人物身份、服装、关系距离与关键道具在 ' + (scene.duration || 15) + ' 秒内保持连贯，微表情前后连续。';
  return s;
}

// ③ 时间线（无缺口覆盖全程；武戏高密度，文戏分阶段）
function buildTimelineZh(scene, subject, dur, flow) {
  const bounds = splitDuration(dur);
  const segs = [];
  for (let i = 0; i < bounds.length - 1; i++) segs.push([bounds[i], bounds[i + 1]]);
  const lines = ['0—' + dur + '秒时间线（无缺口覆盖全程）：'];
  if (flow === 'action') {
    const beats = actionBeatsZh(scene, subject);
    const per = Math.ceil(beats.length / segs.length);
    let k = 0;
    for (const seg of segs) {
      const slice = beats.slice(k, k + per);
      k += per;
      if (!slice.length) break;
      lines.push(fmtRange(seg[0], seg[1]) + '：' + slice.join('；') + '。');
    }
  } else {
    const beats = genBeats(scene, 'zh', segs, subject);
    const labels = (flow === 'wen') ? wenLabels(segs.length) : null;
    for (let i = 0; i < segs.length; i++) {
      let v = (beats[i] && beats[i].visual) ? beats[i].visual : '动作持续推进';
      if (labels && labels[i]) v = labels[i] + '——' + v;
      lines.push(fmtRange(segs[i][0], segs[i][1]) + '：' + v + '。');
    }
  }
  return lines.join('\n');
}

// ④ 摄影/表演/动作规则
function buildRulesZh(scene, subject, flow) {
  let s = '摄影/表演/动作规则：';
  if (flow === 'wen') {
    s += '中近景与特写只保留 2–3 个协同表演信号（目光停顿、呼吸变化、未完成的手部动作、身体重心变化），微表情前后连续；每次切镜由新信息、说话权变化、视线目标或距离变化触发，不按每句台词机械正反打；对白语言为' + (scene.dialogueLang || '中文') + '，口型与台词严格同步。';
  } else if (flow === 'action') {
    s += '上一招未完全收回时下一招已启动；格挡后的受力直接转化为翻越、旋转、位移或反斩；环境互动必须改变战斗局面而非背景特效；允许硬切，切点落在接触、遮挡、落地或方向匹配处；每组连招保持一个主要运动方向，仅真实换向或借墙反弹时改变摄影轴线；火花与碎片只强化已发生的攻击。';
  } else {
    const cam = (typeof CAM_ZH !== 'undefined' && CAM_ZH[(scene.cameraMovement || '').trim()]) ? CAM_ZH[(scene.cameraMovement || '').trim()] : '自然运镜';
    s += '默认允许硬切、匹配剪辑与尺度跳切，连续感来自主体、空间轴线、色彩母题与声音桥；运镜以「' + cam + '」为基础渐进变化，不每镜重复同一句；镜头始终清晰呈现主体与动作。';
  }
  return s;
}

// ⑤ 视觉风格与材质
const COLOR_ZH = { 'warm': '暖调', 'cool': '冷调', 'teal-orange': '青橙调', 'monochrome': '单色调', 'neutral': '中性调', 'high-contrast': '高反差', 'golden': '金调', 'sepia': '复古褐调' };
function buildVisualZh(scene, subject, flow) {
  const vs = (scene.visualStyle || '').trim();
  const light = (scene.lighting || '').trim();
  const cg = (scene.colorGrading || '').trim();
  const parts = [];
  if (vs) parts.push(vs);
  if (light && typeof LIGHT_ZH !== 'undefined' && LIGHT_ZH[light]) parts.push(LIGHT_ZH[light]);
  else if (light) parts.push(light);
  if (cg) {
    if (/^[a-z]/i.test(cg) && typeof COLOR_ZH !== 'undefined' && COLOR_ZH[cg]) parts.push(COLOR_ZH[cg]);
    else if (!/^[a-z]/i.test(cg)) parts.push(cg + '色调');
  }
  if (!parts.length) parts.push('写实质感');
  let s = '视觉风格与材质：' + parts.join('、') + '；';
  if (subject.product) s += '产品材质、结构与标识清晰可辨，表面质感写实，无塑料感或过度磨皮。';
  else if (subject.character) s += '人物皮肤与服装材质写实，光影塑造体积感。';
  else s += '空间材质与光影基调统一，画面有纵深。';
  return s;
}

// ⑥ 声音设计
function buildSoundZh(scene, subject, flow) {
  const ss = (typeof scene.soundscapeZh === 'string' && scene.soundscapeZh.trim()) ? scene.soundscapeZh.trim().replace(/[。.,，；！？]+$/, '') : '贴合画面的自然环境底噪';
  const music = (typeof scene.musicZh === 'string' && scene.musicZh.trim()) ? scene.musicZh.trim() : '';
  const dlg = (typeof scene.dialogueLine === 'string' && scene.dialogueLine.trim()) ? scene.dialogueLine.trim() : '';
  let s = '声音设计：环境音：' + ss + '；';
  if (music) s += '配乐：' + music + '（音量永不超过人声 40%，台词出现时主动让位或暂停）；';
  else s += '配乐：无；';
  if (dlg) s += '人声：主体清晰口播 <d>[' + (scene.dialogueLang === '英文' ? 'English' : 'Chinese') + '] ' + dlg + ' </d>，口型与台词严格同步。';
  else s += '人声：以环境音与配乐为主（本段无台词）。';
  return s;
}

// ⑦ 收束（含营销 CTA）
function buildEndingZh(scene, subject, flow, nextScene, mk) {
  if (nextScene) {
    const nx = deriveOpening(nextScene, 'zh');
    return '收束：镜头结尾自然衔接下一镜「' + nx + '」，不加黑场。';
  }
  let s = '收束：';
  if (flow === 'wen') s += '保留 0.5–1.2 秒呈现行为后果或表情余波，让最后一秒继续提供新的情绪信息，关系变化明确落地。';
  else if (flow === 'action') s += '终结动作包含命中、对手的物理反应、主角卸力与明确结果，不在命中瞬间直接跳到胜利姿势；画面稳定定格，胜负清晰。';
  else s += (subject.product ? '产品稳定运行/静置，构图均衡定格，强化视觉记忆点。' : subject.character ? '人物状态稳定收束，表情与姿态自然定格。' : '镜头稳定落定，画面自然收束。');
  if (mk !== 'none') {
    const M = MARKETING_STYLES[mk];
    s += '\n\n' + (subject.character ? M.ctaZh : M.ctaNoPersonZh);
  }
  return s;
}

// 中文「导演简报」七段式主函数
function buildShotBriefZh(scene, index, startSec, refImages, nextScene) {
  const subject = detectSubject(scene, 'zh');
  const dur = scene.duration || 15;
  const flow = scene.flow || 'auto';
  const mk = (typeof scene.marketingStyle === 'string' && MARKETING_STYLES[scene.marketingStyle]) ? scene.marketingStyle : 'none';

  // 图生视频：有效参考图 = 全局固定图 + 本镜头设计图（每镜头独立编号，便于用户按镜头上传后拼接）
  const eff = getEffectiveRefs(refImages, scene.refPlan);
  let header = '生成一段 ' + dur + ' 秒、16:9、2K、原生立体声、MiniMax H3 的视频。\n';
  if (eff.all.length) {
    eff.all.forEach(function (r, i) {
      const num = i + 1;
      const t = r.type || (i === 0 ? '主体' : '参考');
      header += '@image#' + num + ' = ' + (r.desc || t) + '\n';
    });
  }

  const concept = buildConceptZh(scene, subject, flow, mk, index);
  const lock = buildLockZh(scene, subject, flow);
  const timeline = buildTimelineZh(scene, subject, dur, flow);
  const rules = buildRulesZh(scene, subject, flow);
  const visual = buildVisualZh(scene, subject, flow);
  const sound = buildSoundZh(scene, subject, flow);
  const tail = buildEndingZh(scene, subject, flow, nextScene, mk);

  return [header, concept, lock, timeline, rules, visual, sound, tail].filter(Boolean).join('\n\n') + '\n';
}

// 分镜卡片「直投提示词」入口：英文保留旧版，中文走七段式导演简报
function buildShotBrief(scene, index, startSec, lang, refNote, refImages, nextScene) {
  if (lang === 'en') {
    return buildShotBriefEn(scene, index, startSec, refNote, refImages, nextScene);
  }
  return buildShotBriefZh(scene, index, startSec, refImages, nextScene);
}

// ========== 九宫格模式（阶段A出图提示词 + 阶段B派生H3视频提示词）==========
function buildNineGrid(formData) {
  const dur = [5, 10, 15].includes(formData.shotDur) ? formData.shotDur : 15;
  const subject = ((formData.productDesc || formData.brandName || '').trim()) || '主体';
  const story = (typeof formData.story === 'string' ? formData.story : '').trim();
  const cells = Array.isArray(formData.gridCells) ? formData.gridCells : [];

  // 阶段A：3×3 故事板出图提示词（无图像工具时输出文本，不谎称已经生成）
  const stageA = '【九宫格出图提示词】生成一张整体 16:9、2048×1152 的 3×3 故事板：九个等大宽银幕画格，使用细而整洁的中性分隔线。'
    + '稳定主体「' + subject + '」的身份、服装、装备、材质与关键配色贯穿九格；镜位、景别、姿态与动作必须明显变化，九格不重复同一种构图。'
    + (story ? ('故事线：' + story + '。') : '')
    + '九格从左到右、从上到下依次承担：①建立 ②触发 ③升级 ④第一次变化 ⑤中段主体状态 ⑥第二次升级 ⑦高潮形成 ⑧接近完成 ⑨最终画面。';

  // 阶段B：依据九格描述派生 H3 视频提示词
  let stageB = '【九宫格派生 H3 视频提示词】生成一段 ' + dur + ' 秒、16:9、2K、原生立体声、MiniMax H3 的视频。\n';
  const refImages = (formData.genMode === 'i2v' && Array.isArray(formData.referenceImages) && formData.referenceImages.length)
    ? formData.referenceImages : [];
  if (refImages.length) {
    refImages.forEach(function (r, i) {
      stageB += '@image#' + (i + 1) + ' = ' + (r.desc || r.type || '参考图') + '\n';
    });
  }
  stageB += '九宫格依据：按从左到右、从上到下对应 1—9 镜/状态，九格全部出现在视频中，中间格不被形变过程吞掉。\n';
  const bounds = splitDuration(dur);
  const segs = [];
  for (let i = 0; i < bounds.length - 1; i++) segs.push([bounds[i], bounds[i + 1]]);
  const per = Math.max(1, Math.ceil(9 / segs.length));
  let k = 0;
  for (const seg of segs) {
    const slice = cells.slice(k, k + per);
    k += per;
    if (!slice.length) break;
    const desc = slice.map(function (c, j) {
      const idx = (k - per + j + 1);
      return '图' + idx + '：' + ((typeof c === 'string' && c.trim()) ? c.trim() : '对应关键画面');
    }).join('；');
    stageB += fmtRange(seg[0], seg[1]) + '：' + desc + '。\n';
  }
  stageB += '每一格写出进入方式、画面中的主动作与离开方式，前后格通过动作方向、形状、颜色、道具、遮挡或声音关联；允许硬切，不强制一镜到底。\n';
  stageB += '声音设计：贴合画面的自然环境底噪；若含台词，使用 <d>[Chinese] ... </d> 并口型同步。\n';
  stageB += '收束：最终画面稳定定格，九格叙事完整落地。';

  return { stageA: stageA, stageB: stageB };
}

// 参考图类型 → 英文（用于英文提示词）
function refTypeEn(type) {
  const t = (type || '').trim();
  const map = {
    '人物': 'person', '角色': 'character', '主角': 'protagonist', '模特': 'model',
    '产品': 'product', '商品': 'product', '场景': 'scene', '环境': 'environment',
    '风格': 'style', 'logo': 'logo', '图标': 'icon', '其他': 'reference', '背景': 'background'
  };
  return map[t] || t || 'reference';
}

// 图生视频：计算第 shotIndex 个镜头所用参考图备注（中/英）
function buildRefNoteForShot(refImages, shotIndex, isZh) {
  if (!refImages || !refImages.length) return '';
  const used = refImages.filter(r => {
    const scope = r.scope;
    if (scope === undefined || scope === null || scope === 'all') return true;
    if (typeof scope === 'number') return scope === shotIndex;
    if (Array.isArray(scope)) return scope.indexOf(shotIndex) >= 0;
    return false;
  });
  if (!used.length) return '';
  const parts = used.map(r => {
    const num = refImages.indexOf(r) + 1;
    return isZh
      ? '[参考图' + num + ']（' + (r.type || '参考') + '）'
      : '[Reference Image ' + num + '] (' + refTypeEn(r.type) + ')';
  });
  return isZh
    ? ' 本镜头使用：' + parts.join('、') + '，保持与参考图一致。'
    : ' This shot uses: ' + parts.join(', ') + ' — keep consistent with the reference images.';
}

// ========== Full-Reference 全参考模式：整片六段式提示词 ==========
function buildFullReference(scenes, formData, lang) {
  const isZh = lang === 'zh';
  const vt = (typeof VIDEO_TYPES !== 'undefined' && VIDEO_TYPES[formData.videoType]) || { name: formData.videoType || 'video', nameEn: formData.videoType || 'video' };
  const st = (typeof STYLES !== 'undefined' && STYLES[formData.style]) || { name: formData.style || 'cinematic', nameEn: formData.style || 'cinematic' };
  const industryData = (typeof INDUSTRIES !== 'undefined' && INDUSTRIES[formData.industry]) || null;
  // 风格叙事DNA + 行业叙事DNA：整片只注入一次（置于 detailed_description 顶部），避免每个镜头重复
  const globalZh = [st.narrativeFlavorZh, industryData && industryData.industryNarrativeZh].filter(Boolean).join(' ');
  const globalEn = [st.narrativeFlavor, industryData && industryData.industryNarrative].filter(Boolean).join(' ');
  const hasBrand = !!formData.brandName;
  const brand = formData.brandName || '';
  const product = formData.productDesc || '';
  const slogan = formData.slogan || '';
  const ratio = formData.aspectRatio || '16:9';
  const n = scenes.length;
  const total = scenes.reduce((s, x) => s + x.duration, 0);

  // 图生视频模式：读取参考图（仅全局固定图参与整片六段式；按镜头设计的参考图见各 [Shot N] 的「本镜头参考图」）
  const globalRefs = (formData.genMode === 'i2v' && Array.isArray(formData.referenceImages)) ? formData.referenceImages : [];
  const globalFixed = globalRefs.filter(function (r) { return r.scope === undefined || r.scope === null || r.scope === 'all'; });
  const isI2V = formData.genMode === 'i2v';

  // 计算各镜头起始时间码
  const starts = [];
  let acc = 0;
  for (let i = 0; i < n; i++) { starts.push(acc); acc += scenes[i].duration; }
  const shotRange = n > 1 ? '[Shot 1] to [Shot ' + n + ']' : '[Shot 1]';

  // ---- subject_definitions ----（对齐豆包 Ref2VA：明确把参考图绑定到主体/产品/首帧构图）
  let subjects;
  if (hasBrand) {
    subjects = '<Subject 1> is the brand protagonist representing "' + brand + '", whose brand identity, wardrobe, on-screen logo and tagline (' +
      (slogan ? '"' + slogan + '"' : 'as specified by user') + ') must remain fully consistent and unchanged across every shot.';
  } else {
    // 未填品牌：主体围绕产品/行业/参考图，不写任何假名
    const subjLabel = product || (industryData && industryData.name) || 'the main subject';
    subjects = '<Subject 1> is the main subject of the video — ' + subjLabel +
      (slogan ? (', with the on-screen tagline "' + slogan + '"') : '') +
      ' — whose appearance, wardrobe and on-screen text must remain fully consistent and unchanged across every shot.';
  }
  if (isI2V && globalFixed.length >= 1) {
    subjects += ' Facial identity, hairstyle, wardrobe and body proportions come from <Reference Image 1>.';
  }
  subjects += '\n';
  if (product) {
    let prodLine = '<Subject 2> is the core product/service: ' + product + '. Its geometry, material, label text, logo placement and structural details remain fully preserved across every angle.';
    if (isI2V && globalFixed.length >= 2) {
      prodLine += ' Geometric structure, logo and surface material come from <Reference Image 2>.';
    }
    subjects += prodLine + '\n';
  }
  if (isI2V && globalFixed.length === 0) {
    // 无全局固定图：主体图由用户按镜头准备并全程复用，场景图每镜头单独准备
    const firstPlan = (scenes[0] && scenes[0].refPlan) || [];
    const subj = firstPlan.find(function (p) { return p.role === 'subject'; });
    subjects += 'This is an image-to-video film: prepare ONE subject reference image (e.g. ' + (subj ? subj.desc : 'the main subject') + ') and reuse it across all shots to keep the subject consistent; prepare one scene-environment image per shot (see each [Shot N]’s “本镜头参考图 / shot reference images”).\n';
  }
  if (isI2V && globalFixed.length > 0) {
    globalFixed.forEach((r, k) => {
      const num = k + 1;
      const desc = r.desc || (isZh ? '用户提供的参考图' : 'user-provided reference image');
      if (isZh) {
        let note = '<参考图' + num + '> 是用户提供的参考图（类型：' + (r.type || '参考') + '）：' + desc + '。';
        if (num === 1) note += '作为人物/角色外观锚点（面孔、发型、服装、身材比例），<Subject 1> 身份与外观来自此图。';
        else if (num === 2 && product) note += '作为产品/设备几何与材质锚点（结构、Logo、文字、表面材质），<Subject 2> 来自此图。';
        else note += '作为首帧构图与环境锚点（景别、机位、背景布局）。';
        subjects += note + '\n';
      } else {
        let note = '<Reference Image ' + num + '> is a user-provided reference image (type: ' + refTypeEn(r.type) + '): ' + desc + '. ';
        if (num === 1) note += 'It is the appearance anchor for <Subject 1> (face, hairstyle, wardrobe, body proportions). ';
        else if (num === 2 && product) note += 'It is the geometry/material anchor for <Subject 2> (structure, logo, text, surface material). ';
        else note += 'It is the first-frame composition and environment anchor for [Shot 1] (shot size, camera angle, background layout). ';
        subjects += note + '\n';
      }
    });
  }

  // ---- summary ----
  let summary;
  if (isI2V) {
    const refDescZh = globalFixed.map((r, k) => '图' + (k + 1) + (r.type ? '（' + r.type + '）' : '')).join('、');
    const refDescEn = globalFixed.map((r, k) => 'Image ' + (k + 1) + (r.type ? ' (' + refTypeEn(r.type) + ')' : '')).join(', ');
    if (isZh) {
      const brandSegZh = hasBrand ? ('品牌 ' + brand + '，') : '';
      if (globalFixed.length > 0) {
        summary = '[图生视频生成] 目标视频基于用户提供的 ' + globalFixed.length + ' 张固定参考图（' + refDescZh + '）生成，是一部 ' + vt.name + '（' + brandSegZh + st.name + ' 风格，' + ratio + ' 画幅，总 ' + total + ' 秒，由 ' + n + ' 个连续镜头 ' + shotRange + ' 组成）。以参考图为准保持主体外观一致，生成后于后期拼接成片。\n';
      } else {
        summary = '[图生视频生成] 目标视频按每个镜头自动设计的参考图生成（每镜头独立上传主体图+场景图，详见各 [Shot N] 的「本镜头参考图」），是一部 ' + vt.name + '（' + brandSegZh + st.name + ' 风格，' + ratio + ' 画幅，总 ' + total + ' 秒，由 ' + n + ' 个连续镜头 ' + shotRange + ' 组成）。主体图建议全程复用同一张以保证一致，生成后于后期拼接成片。\n';
      }
    } else {
      const brandSegEn = hasBrand ? (' for ' + brand) : '';
      if (globalFixed.length > 0) {
        summary = '[image-to-video generation] The target video is generated from ' + globalFixed.length + ' user-provided reference images (' + refDescEn + '), as a ' + vt.nameEn + brandSegEn + ' in ' + st.nameEn +
          ' style, ' + ratio + ' aspect ratio, total ' + total + ' seconds, composed of ' + n + ' continuous shots (' + shotRange +
          '). Visual identity must match the reference images; generated as one connected storyboard and edited together in post-production.\n';
      } else {
        summary = '[image-to-video generation] The target video is generated from per-shot reference images (one subject image reused across all shots plus one scene image per shot — see each [Shot N]’s “shot reference images”), as a ' + vt.nameEn + brandSegEn + ' in ' + st.nameEn +
          ' style, ' + ratio + ' aspect ratio, total ' + total + ' seconds, composed of ' + n + ' continuous shots (' + shotRange +
          '). Keep the subject identical by reusing the same subject image; edited together in post-production.\n';
      }
    }
  } else {
    const brandSegRef = hasBrand ? (' for ' + brand) : '';
    summary = '[reference generation] The target video is a ' + (isZh ? vt.name : vt.nameEn) + brandSegRef + ' in ' + (isZh ? st.name : st.nameEn) +
      ' style, ' + ratio + ' aspect ratio, total ' + total + ' seconds, composed of ' + n + ' continuous shots (' + shotRange +
      '). Primary reference is the user-specified brand, product and visual style, to be generated as one connected storyboard and edited together in post-production.\n';
  }

  // ---- retention_analysis ----
  let retention = '<Subject 1> (appears in ' + shotRange + '): fully_preserved - brand identity, wardrobe, logo and on-screen text stable as specified by user.\n';
  if (product) {
    retention += '<Subject 2> (appears in ' + shotRange + '): fully_preserved - product geometry, label and logo consistent.\n';
  }
  if (isI2V) {
    if (globalFixed.length > 0) {
      globalFixed.forEach((r, k) => {
        const num = k + 1;
        if (isZh) {
          retention += '<参考图' + num + '> (appears in ' + shotRange + '): fully_preserved - 画面中的' + (r.type || '对应元素') + '外观、姿态与细节严格参照参考图' + num + '，保持完全一致。\n';
        } else {
          retention += '<Reference Image ' + num + '> (appears in ' + shotRange + '): fully_preserved - the ' + refTypeEn(r.type) + ' appearance, pose and details strictly match reference image ' + num + ' and stay fully consistent.\n';
        }
      });
    } else {
      if (isZh) {
        retention += '<主体参考图> (appears in ' + shotRange + '): fully_preserved - 主体图全程复用同一张，外观、姿态与细节保持完全一致。\n';
        retention += '<场景参考图> (per shot): fully_preserved - 各镜头按「本镜头参考图」上传的场景图，画面环境与布局严格参照对应镜头。\n';
      } else {
        retention += '<Subject reference image> (appears in ' + shotRange + '): fully_preserved - the same subject image is reused across all shots; appearance, pose and details stay fully consistent.\n';
        retention += '<Scene reference image> (per shot): fully_preserved - each shot uses its own scene image from that shot’s “shot reference images”; environment and layout strictly match the corresponding shot.\n';
      }
    }
  }

  // ---- detailed_description ----
  const styleLine = 'The target video uses ' + st.name + ' cinematic language with ' + (scenes[0].colorGrading || 'refined color grading') +
    ', ' + (scenes[0].lighting || 'motivated lighting') + ', and physically plausible camera movement.';
  let dd = styleLine + '\n';
  if (isI2V) {
    if (globalFixed.length > 0) {
      const refsZh = globalFixed.map((r, k) => '[参考图' + (k + 1) + ']（' + (r.type || '参考') + '）').join('、');
      const refsEn = globalFixed.map((r, k) => '[Reference Image ' + (k + 1) + '] (' + refTypeEn(r.type) + ')').join(', ');
      if (isZh) {
        dd += '全片严格参照以下固定参考图保持主体一致：' + refsZh + '。\n';
      } else {
        dd += 'Throughout the video, strictly use the following reference images to keep subjects consistent: ' + refsEn + '.\n';
      }
    } else {
      if (isZh) {
        dd += '图生视频·按镜头设计参考图：每镜头独立上传主体图（全程复用同一张）+ 场景图（详见各 [Shot N] 的「本镜头参考图」），严格参照以保证主体与场景一致。\n';
      } else {
        dd += 'Image-to-video, per-shot reference images: each shot uses its own subject image (reused across all shots) plus a scene image (see each [Shot N]’s “shot reference images”); strictly reference them to keep subject and scene consistent.\n';
      }
    }
  }
  // 风格叙事DNA + 行业叙事DNA（整片只写一次，统一作用于全片，避免每个镜头重复）
  if (isZh) {
    if (globalZh) dd += globalZh + '\n';
  } else {
    if (globalEn) dd += globalEn + '\n';
  }
  scenes.forEach((s, i) => {
    const refNote = buildRefNoteForShot(globalFixed, i, isZh);
    dd += buildShotBlock(s, i, starts[i], lang, refNote) + '\n';
  });

  // ---- overall_soundscape / non_diegetic_music ----
  let sound = '';
  scenes.forEach((s) => { sound += (isZh ? s.soundscapeZh : s.soundscapeEn) + ' '; });
  sound = sound.trim() || (isZh ? '自然环境声与动作音效，随画面同步。' : 'Natural ambient sound and physical action sound, synchronized with the picture.');

  let music = '';
  scenes.forEach((s) => { music += (isZh ? s.musicZh : s.musicEn) + ' '; });
  music = music.trim() || 'N/A';

  // I2VA：绝对开头用 @Image1 as 角色@Image2 as 产品@Image3 as 场景 绑定上传的参考图（仅全局固定图参与整片前缀；按镜头设计的图见各镜头「本镜头参考图」）
  const i2vPrefix = (isI2V && globalFixed.length) ? (buildImageRefLine(globalFixed, false) + '\n') : '';
  return i2vPrefix + 'subject_definitions:\n' + subjects +
    '\nsummary:\n' + summary +
    '\nretention_analysis:\n' + retention +
    '\ndetailed_description:\n' + dd +
    '\noverall_soundscape:\n' + sound +
    '\n\nnon_diegetic_music:\n' + music;
}

/**
 * 导出分镜脚本为Markdown
 * @param {Array} scenes - 场景数组
 * @param {Object} formData - 表单数据
 * @returns {String} Markdown文本
 */
function exportToMarkdown(scenes, formData) {
  const videoType = VIDEO_TYPES[formData.videoType];
  let md = `# ${videoType.name} - 分镜脚本\n\n`;
  md += `**品牌/企业**: ${formData.brandName || '未填写'}\n`;
  md += `**行业**: ${INDUSTRIES[formData.industry]?.name || '未指定'}\n`;
  md += `**视觉风格**: ${STYLES[formData.style]?.name || '未指定'}\n`;
  md += `**画幅比例**: ${formData.aspectRatio || '16:9'}\n`;
  md += `**核心Slogan**: ${formData.slogan || '未填写'}\n`;
  md += `**总场景数**: ${scenes.length}\n`;
  md += `**总时长**: ${scenes.reduce((sum, s) => sum + s.duration, 0)}秒\n\n`;
  md += `---\n\n`;

  md += `## Full-Reference 整片六段式提示词（中文）\n\n`;
  md += '```\n';
  md += buildFullReference(scenes, formData, 'zh');
  md += '\n```\n\n';
  md += `## Full-Reference 整片六段式提示词（English）\n\n`;
  md += '```\n';
  md += buildFullReference(scenes, formData, 'en');
  md += '\n```\n\n';
  md += `---\n\n`;

  scenes.forEach((scene, i) => {
    md += `## 场景 ${i + 1} - ${scene.name} (${scene.nameEn})\n\n`;
    md += `**时长**: ${scene.duration}秒 | **画幅**: ${scene.aspectRatio} | **镜头类型**: ${scene.shotType}\n\n`;
    md += `**运镜**: ${scene.cameraMovement}\n\n`;
    md += `**光影**: ${scene.lighting}\n\n`;
    md += `**导演笔记**: ${scene.directorNote}\n\n`;
    md += `### 中文提示词\n\n`;
    md += '```\n';
    md += scene.promptZh;
    md += '\n```\n\n';
    md += `### English Prompt\n\n`;
    md += '```\n';
    md += scene.promptEn;
    md += '\n```\n\n';
    md += `---\n\n`;
  });

  md += `\n> 本分镜脚本由 H3 AI 视频提示词工坊生成，基于 MiniMax H3 开源模型提示词规范。\n`;
  md += `> 每个场景对应一次独立的 H3 视频生成（4-15秒），最终成片需在后期剪辑中拼接。\n`;
  md += `> 已附中文 / English 双语提示词，可直接复制使用。\n`;

  return md;
}

/**
 * 导出分镜脚本为 Word 文档（HTML-as-.doc，零依赖，Word/WPS 直接打开）
 * @param {Array} scenes - 场景数组
 * @param {Object} formData - 表单数据
 * @returns {String} Word 兼容的 HTML 字符串（可直接保存为 .doc）
 */
function exportToWord(scenes, formData) {
  const videoType = VIDEO_TYPES[formData.videoType];
  const industry = INDUSTRIES[formData.industry];
  const style = STYLES[formData.style];
  const totalSec = scenes.reduce((s, x) => s + x.duration, 0);
  const now = new Date().toLocaleString('zh-CN');

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  let html = '';
  html += `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">`;
  html += `<head>`;
  html += `<meta charset="utf-8">`;
  html += `<title>${esc(videoType ? videoType.name : 'H3 分镜脚本')}</title>`;
  // Word XML hint
  html += `<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->`;
  html += `<style>`;
  html += `body{font-family:"Microsoft YaHei","PingFang SC","Helvetica Neue",Arial,sans-serif;font-size:11pt;color:#222;line-height:1.6;}`;
  html += `h1{font-size:22pt;color:#d4a437;text-align:center;border-bottom:2px solid #d4a437;padding-bottom:8px;margin-bottom:18px;}`;
  html += `h2{font-size:15pt;color:#fff;background:#1a1a1a;padding:8px 14px;margin:24px 0 12px 0;}`;
  html += `h3{font-size:12pt;color:#d4a437;margin:16px 0 6px 0;}`;
  html += `table.meta{border-collapse:collapse;width:100%;margin-bottom:18px;}`;
  html += `table.meta td{padding:6px 10px;border:1px solid #ddd;font-size:10pt;}`;
  html += `table.meta td.k{background:#f6f1e3;color:#7a5a18;font-weight:bold;width:18%;}`;
  html += `table.scene{border-collapse:collapse;width:100%;margin-bottom:8px;}`;
  html += `table.scene td{padding:5px 10px;border:1px solid #ddd;font-size:10pt;vertical-align:top;}`;
  html += `table.scene td.k{background:#f6f1e3;color:#7a5a18;font-weight:bold;width:15%;}`;
  html += `.box{background:#fafafa;border-left:4px solid #d4a437;padding:10px 14px;margin:8px 0;font-family:Consolas,"Courier New",monospace;font-size:9.5pt;white-space:pre-wrap;word-wrap:break-word;color:#333;}`;
  html += `.box-zh{border-left-color:#1a7f37;}`;
  html += `.box-en{border-left-color:#4a9eff;}`;
  html += `.note{font-size:9.5pt;color:#666;font-style:italic;margin-top:4px;}`;
  html += `.footer{font-size:9pt;color:#888;text-align:center;margin-top:28px;border-top:1px solid #ddd;padding-top:10px;}`;
  html += `</style>`;
  html += `</head><body>`;

  // 标题
  html += `<h1>${esc(videoType ? videoType.name : 'H3 分镜脚本')}</h1>`;

  // 元信息表
  html += `<table class="meta">`;
  html += `<tr><td class="k">品牌/企业</td><td>${esc(formData.brandName || '未填写')}</td></tr>`;
  html += `<tr><td class="k">行业</td><td>${esc(industry ? industry.name : '未指定')}</td></tr>`;
  html += `<tr><td class="k">视觉风格</td><td>${esc(style ? style.name : '未指定')}</td></tr>`;
  html += `<tr><td class="k">画幅比例</td><td>${esc(formData.aspectRatio || '16:9')}</td></tr>`;
  html += `<tr><td class="k">核心 Slogan</td><td>${esc(formData.slogan || '未填写')}</td></tr>`;
  html += `<tr><td class="k">场景数 / 总时长</td><td>${scenes.length} 场 / ${totalSec} 秒</td></tr>`;
  html += `<tr><td class="k">生成时间</td><td>${esc(now)}</td></tr>`;
  html += `</table>`;

  // Full-Reference 整片六段式提示词（置顶，可直接粘贴给 H3）—— 中英文双份
  html += `<h2>Full-Reference 全参考模式 · 整片六段式提示词（中文）</h2>`;
  html += `<div class="box box-zh">${esc(buildFullReference(scenes, formData, 'zh'))}</div>`;
  html += `<h2>Full-Reference 全参考模式 · 整片六段式提示词（English）</h2>`;
  html += `<div class="box box-en">${esc(buildFullReference(scenes, formData, 'en'))}</div>`;
  html += `<div class="note">该六段式提示词为整片连续脚本，每个镜头对应 [Shot N]；逐镜头独立生成后用剪映/PR 按时间码拼接成片。</div>`;

  // 每个场景
  scenes.forEach((scene, i) => {
    html += `<h2>场景 ${i + 1} - ${esc(scene.name)} <span style="font-size:10pt;color:#bbb;font-weight:normal;">(${esc(scene.nameEn)})</span></h2>`;
    html += `<table class="scene">`;
    html += `<tr><td class="k">时长</td><td>${scene.duration} 秒</td><td class="k">画幅</td><td>${esc(scene.aspectRatio)}</td></tr>`;
    html += `<tr><td class="k">镜头类型</td><td colspan="3">${esc(scene.shotType)}</td></tr>`;
    html += `<tr><td class="k">运镜</td><td colspan="3">${esc(scene.cameraMovement)}</td></tr>`;
    html += `<tr><td class="k">光影</td><td colspan="3">${esc(scene.lighting)}</td></tr>`;
    html += `<tr><td class="k">色彩</td><td colspan="3">${esc(scene.colorGrading)}</td></tr>`;
    html += `<tr><td class="k">导演笔记</td><td colspan="3">${esc(scene.directorNote)}</td></tr>`;
    html += `</table>`;

    html += `<h3>中文提示词（可直接使用）</h3>`;
    html += `<div class="box box-zh">${esc(scene.promptZh)}</div>`;

    html += `<h3>English Prompt</h3>`;
    html += `<div class="box box-en">${esc(scene.promptEn)}</div>`;
  });

  // 页脚
  html += `<div class="footer">`;
  html += `本分镜脚本由 H3 AI 视频提示词工坊生成，基于 MiniMax H3 开源模型提示词规范。<br>`;
  html += `每个场景对应一次独立的 H3 视频生成（4-15秒），最终成片需在后期剪辑中拼接。<br>`;
  html += `已附中文 / English 双语提示词，可直接复制使用。`;
  html += `</div>`;

  html += `</body></html>`;
  return html;
}
