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
    industryNarrative: 'The scene treats hydrotherapy as a gentle daily wellness ritual — a few drops of imported essential oil and a scoop of mineral bath salt melt into warm water while fine ultrasonic bubbles embrace the feet and body, helping the body relax and unwind. Warmth reaches deep into the spine and limbs, encouraging a soft "pearl-sweat" that releases cold and dampness; after stepping out the body stays gently warm for a while, leaving one refreshed rather than drained. The four seasons guide the foot bath: spring to lift yang and consolidate, summer to dispel damp-heat, autumn to moisten lungs and bowels, winter to warm the dantian. It is framed strictly as a soothing home wellness ritual.',
    industryNarrativeZh: '本场戏将水疗呈现为一种温和的日常养生仪式——滴入德国进口精油、撒入矿物浴盐，温水与细密气泡包裹双足与全身，帮助放松舒缓。暖意由脊柱与四肢深处透出，引出温润的「珍珠汗」，把体内的寒湿轻轻排散；出水后身体仍持续温热片刻，越泡越精神而非疲惫。四季泡脚各有讲究：春升阳固脱、夏祛暑湿、秋肺润肠濡、冬丹田温灼。全程仅以「调理、舒缓、温通、居家养生与放松」的方式呈现，绝不作任何功效承诺。'
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

// ========== 画幅比例 ==========
const ASPECT_RATIOS = {
  '16:9': { name: '16:9 横屏', desc: '标准宽屏，适合宣传片、广告', h3Value: '16:9' },
  '9:16': { name: '9:16 竖屏', desc: '手机短视频，适合抖音/快手', h3Value: '9:16' },
  '21:9': { name: '21:9 超宽', desc: '电影级宽幅，适合大屏展示', h3Value: '21:9' },
  '1:1': { name: '1:1 方形', desc: '社交媒体方图视频', h3Value: '1:1' },
  '4:3': { name: '4:3 传统', desc: '传统电视比例', h3Value: '4:3' },
  '3:4': { name: '3:4 竖版', desc: '海报式竖版视频', h3Value: '3:4' }
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
function generateScenePrompt(ctx, scene) {
  const result = scene.generate(ctx);

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
    brand: formData.brandName || 'YourBrand',
    product: formData.productDesc || '',
    slogan: formData.slogan || '',
    audience: formData.audience || '',

    // 行业信息
    industry: formData.industry,
    industryName: industryData.name,
    industryData: industryData,
    industryNarrative: industryData.industryNarrative || '',
    industryNarrativeZh: industryData.industryNarrativeZh || '',

    // 风格信息
    style: formData.style,
    styleKeywords: stylePreset.keywords,
    colorGrading: stylePreset.colorGrading,
    lightingDesc: stylePreset.lighting,
    mood: stylePreset.mood,
    musicStyle: stylePreset.musicStyle,
    narrativeFlavor: stylePreset.narrativeFlavor || '',
    narrativeFlavorZh: stylePreset.narrativeFlavorZh || '',

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
      const cta = ctx.ctaText || ('Discover the truth at ' + ctx.brand);
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
function generateStoryboard(formData) {
  const ctx = buildContext(formData);
  let templates;
  if (formData.style === 'twist') {
    // 剧情反转风格使用专用反转结构模板，并关闭通用 flavor 叠加（避免重复）
    templates = TWIST_SCENE_TEMPLATES;
    ctx.narrativeFlavor = '';
    ctx.narrativeFlavorZh = '';
  } else {
    const videoType = formData.videoType || 'corporate';
    templates = SCENE_TEMPLATES[videoType] || SCENE_TEMPLATES.corporate;
  }

  // 按"目标总时长"在镜头间均分秒数（末镜头补余数），让时间码连续
  const total = formData.totalDuration || (templates.length * 5);
  const durations = distributeDurations(total, templates.length);

  return templates.map((scene, index) => {
    // 为每个场景设置特定的相机运动和光影，并分配对应镜头的台词
    const sceneCtx = {
      ...ctx,
      cameraMovement: scene.cameraMovement,
      lightingDesc: scene.lighting || ctx.lightingDesc,
      dialogueLine: ctx.dialogueLines[index] || ''
    };
    const data = generateScenePrompt(sceneCtx, scene);
    data.duration = durations[index]; // 应用均分后的目标时长
    data.dialogueLine = sceneCtx.dialogueLine; // 透传台词，供 buildShotBlock 使用
    return data;
  });
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
const SHOT_TYPE_ZH = {
  'medium shot': '中景', 'close-up shot': '特写', 'static shot': '固定镜头',
  'medium close-up shot': '中近景', 'Establishing Wide': '大远景/建立镜头',
  'Extreme Close-up': '大特写', 'Medium Shot': '中景', 'Tight Close-up': '紧凑特写',
  'Wide-to-Hero': '全景转英雄镜头', 'Logo Lockup': 'Logo 定格'
};
const CAM_ZH = {
  'The camera holds a static shot with a slight handheld shake': '固定机位略带手持晃动',
  'The camera pushes in with small amplitude at slow speed': '缓慢小幅推进',
  'The camera holds a static shot throughout': '全程固定机位',
  'slow calm push-in': '缓慢平稳推进', 'slow zoom in': '缓慢推近',
  'restless handheld': '不安定的手持跟拍', 'rapid snap-zoom': '快速急推',
  'pull-back reveal': '拉远揭示', 'slow settle': '缓慢稳定'
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
// 例：@参考图1作为人物视觉参考@参考图2作为产品视觉参考@参考图3作为场景视觉参考
function buildImageRefLine(refImages, isZh) {
  if (!refImages || !refImages.length) return '';
  const parts = refImages.map((r, i) => {
    const num = i + 1;
    const t = (r.type || '参考');
    return isZh
      ? '@参考图' + num + '作为' + t + '视觉参考'
      : '@Image' + num + ' as ' + refTypeEn(t) + ' reference';
  });
  return parts.join('') + (isZh ? '' : ' ');
}

// 单镜头的结构化自然语言简报核心（时间线 + 镜头运动 + 视觉风格 + 声音设计）
// 用于让每个镜头的提示词填满其时长，符合 H3「时间段无缺口覆盖完整时长、全正向描述」的要求
function buildShotBriefCore(scene, lang) {
  const isZh = lang === 'zh';
  const dur = scene.duration || 5;
  const cam = isZh ? (CAM_ZH[(scene.cameraMovement || '').trim()] || scene.cameraMovement || '')
                   : (scene.cameraMovement || '');
  const shot = isZh ? (SHOT_TYPE_ZH[(scene.shotType || '').trim()] || scene.shotType || '')
                    : (scene.shotType || '');
  const light = isZh ? (LIGHT_ZH[(scene.lighting || '').trim()] || scene.lighting || '')
                     : (scene.lighting || '');
  const color = scene.colorGrading || '';

  // 时间分段（三等分，覆盖完整时长，无缺口）
  const seg = dur / 3;
  const t1 = fmtDurLocal(seg);
  const t2 = fmtDurLocal(seg * 2);

  // 从镜头正文抽取首句作为铺设、次句作为推进，让时间线落到真实内容而非空话
  let body = (isZh ? (scene.visualZhBase || scene.visualZh) : (scene.visualEnBase || scene.visualEn)) || '';
  // 去掉模板自带的 [Shot N] / [镜头N] 前缀，避免泄漏进时间线
  body = (' ' + body).replace(/\s*\[(?:Shot|镜头)\s*\d+\]\s*/gi, ' ').trim();
  const clauses = body.split(/[，。；,.\n]/).map(s => s.trim()).filter(Boolean);
  // 抽取有意义的铺设句：首句若过短则顺延拼接下一句，避免英文只剩 "cinematic" 之类
  const limit = isZh ? 12 : 24;
  let setup = clauses[0] || (isZh ? '主体进入画面' : 'the subject enters frame');
  let ci = 1;
  while (setup.length < limit && ci < clauses.length) { setup += (isZh ? '，' : ' ') + clauses[ci]; ci++; }
  const mid = clauses[ci] || clauses[1] || (isZh ? '动作持续推进，情绪逐步积累' : 'action continues, emotion builds');

  const sound = isZh
    ? (scene.soundscapeZh || '贴合画面节奏的自然环境底噪')
    : (scene.soundscapeEn || 'natural ambient sound matching the scene');

  const closing = isZh
    ? (scene.textOverlay ? ('画面以文字「' + scene.textOverlay + '」收束')
                          : (shot + '稳定落定，主体外观与参考图保持一致，动作达成明确结果'))
    : (scene.textOverlay ? ('closes on the on-screen text "' + scene.textOverlay + '"')
                         : (shot + ' settles, subject stays consistent with the reference, action lands on a clear result'));

  const beats = isZh
    ? [
        '0—' + t1 + '秒：' + shot + '建立，画面呈现「' + setup + '」，' + light + '。',
        t1 + '—' + t2 + '秒：' + mid + '，主体神态与姿态发生可见变化，情绪逐步积累。',
        t2 + '—' + dur + '秒：' + closing + '，' + light + '收束，主体一致，画面定格于明确结果。'
      ]
    : [
        '0-' + t1 + 's: ' + shot + ' establishes — ' + setup + '. ' + light + '.',
        t1 + '-' + t2 + 's: ' + mid + '; the subject’s expression and posture shift visibly as emotion builds.',
        t2 + '-' + dur + 's: ' + closing + '; ' + light + ' settles, subject consistent, frame locks on a clear result.'
      ];

  const timeline = (isZh ? '【时间线 · 共 ' + dur + ' 秒】\n' : '【Timeline · ' + dur + 's total】\n') + beats.join('\n');
  const cameraLine = isZh
    ? '【镜头运动】景别·' + shot + '；运镜·' + cam + '。'
    : '【Camera】Shot size: ' + shot + '; Movement: ' + cam + '.';
  const visualLine = isZh
    ? '【视觉风格与材质】' + light + (color ? ('，' + color) : '') + '。'
    : '【Visual style & material】' + light + (color ? (', ' + color) : '') + '.';
  const soundLine = isZh
    ? '【声音设计】' + sound + '。'
    : '【Sound design】' + sound + '.';

  return '\n' + timeline + '\n' + cameraLine + '\n' + visualLine + '\n' + soundLine;
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
  out += buildShotBriefCore(scene, lang);
  return out;
}

// 分镜卡片「直投提示词」专用：H3 标准开头 + 参考图前缀 + 结构化简报（不含 [Shot N] 标记）
function buildShotBrief(scene, index, startSec, lang, refNote, refImages) {
  const isZh = lang === 'zh';
  const dur = scene.duration || 5;
  const imgRefs = buildImageRefLine(refImages, isZh);
  const article = (String(dur).charAt(0) === '8') ? 'an' : 'a';
  const opening = isZh
    ? ('生成一段 ' + dur + ' 秒、16:9、2K、原生立体声、MiniMax H3 的视频：\n')
    : ('Generate ' + article + ' ' + dur + '-second, 16:9, 2K, native stereo, MiniMax H3 video:\n');
  const block = buildShotBlock(scene, index, startSec, lang, refNote, { includeMarker: false });
  return imgRefs + opening + block;
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
  const brand = formData.brandName || 'YourBrand';
  const product = formData.productDesc || '';
  const slogan = formData.slogan || '';
  const ratio = formData.aspectRatio || '16:9';
  const n = scenes.length;
  const total = scenes.reduce((s, x) => s + x.duration, 0);

  // 图生视频模式：读取参考图
  const refImages = (formData.genMode === 'i2v' && Array.isArray(formData.referenceImages) && formData.referenceImages.length)
    ? formData.referenceImages : [];
  const isI2V = refImages.length > 0;

  // 计算各镜头起始时间码
  const starts = [];
  let acc = 0;
  for (let i = 0; i < n; i++) { starts.push(acc); acc += scenes[i].duration; }
  const shotRange = n > 1 ? '[Shot 1] to [Shot ' + n + ']' : '[Shot 1]';

  // ---- subject_definitions ----
  let subjects = '<Subject 1> is the brand protagonist representing "' + brand + '", whose brand identity, wardrobe, on-screen logo and tagline (' +
    (slogan ? '"' + slogan + '"' : 'as specified by user') + ') must remain fully consistent and unchanged across every shot.\n';
  if (product) {
    subjects += '<Subject 2> is the core product/service: ' + product + '. Its geometry, material, label text, logo placement and structural details remain fully preserved across every angle.\n';
  }
  if (isI2V) {
    refImages.forEach((r, k) => {
      const num = k + 1;
      const typeZh = r.type || '参考';
      const desc = r.desc || (isZh ? '用户提供的参考图' : 'user-provided reference image');
      if (isZh) {
        subjects += '<参考图' + num + '> 是用户提供的参考图（类型：' + typeZh + '）：' + desc + '。作为视觉参考，用于在全片中保持对应主体/元素外观与参考图一致。\n';
      } else {
        subjects += '<Reference Image ' + num + '> is a user-provided reference image (type: ' + refTypeEn(r.type) + '): ' + desc + '. Used as the visual reference to keep the corresponding subject/element consistent with this image throughout the video.\n';
      }
    });
  }

  // ---- summary ----
  let summary;
  if (isI2V) {
    const refDescZh = refImages.map((r, k) => '图' + (k + 1) + (r.type ? '（' + r.type + '）' : '')).join('、');
    const refDescEn = refImages.map((r, k) => 'Image ' + (k + 1) + (r.type ? ' (' + refTypeEn(r.type) + ')' : '')).join(', ');
    if (isZh) {
      summary = '[图生视频生成] 目标视频基于用户提供的 ' + refImages.length + ' 张参考图（' + refDescZh + '）生成，是一部 ' + vt.name + '（品牌 ' + brand + '，' + st.name + ' 风格，' + ratio + ' 画幅，总 ' + total + ' 秒，由 ' + n + ' 个连续镜头 ' + shotRange + ' 组成）。以参考图为准保持主体外观一致，生成后于后期拼接成片。\n';
    } else {
      summary = '[image-to-video generation] The target video is generated from ' + refImages.length + ' user-provided reference images (' + refDescEn + '), as a ' + vt.nameEn + ' for ' + brand + ' in ' + st.nameEn +
        ' style, ' + ratio + ' aspect ratio, total ' + total + ' seconds, composed of ' + n + ' continuous shots (' + shotRange +
        '). Visual identity must match the reference images; generated as one connected storyboard and edited together in post-production.\n';
    }
  } else {
    summary = '[reference generation] The target video is a ' + (isZh ? vt.name : vt.nameEn) + ' for ' + brand + ' in ' + (isZh ? st.name : st.nameEn) +
      ' style, ' + ratio + ' aspect ratio, total ' + total + ' seconds, composed of ' + n + ' continuous shots (' + shotRange +
      '). Primary reference is the user-specified brand, product and visual style, to be generated as one connected storyboard and edited together in post-production.\n';
  }

  // ---- retention_analysis ----
  let retention = '<Subject 1> (appears in ' + shotRange + '): fully_preserved - brand identity, wardrobe, logo and on-screen text stable as specified by user.\n';
  if (product) {
    retention += '<Subject 2> (appears in ' + shotRange + '): fully_preserved - product geometry, label and logo consistent.\n';
  }
  if (isI2V) {
    refImages.forEach((r, k) => {
      const num = k + 1;
      if (isZh) {
        retention += '<参考图' + num + '> (appears in ' + shotRange + '): fully_preserved - 画面中的' + (r.type || '对应元素') + '外观、姿态与细节严格参照参考图' + num + '，保持完全一致。\n';
      } else {
        retention += '<Reference Image ' + num + '> (appears in ' + shotRange + '): fully_preserved - the ' + refTypeEn(r.type) + ' appearance, pose and details strictly match reference image ' + num + ' and stay fully consistent.\n';
      }
    });
  }

  // ---- detailed_description ----
  const styleLine = 'The target video uses ' + st.name + ' cinematic language with ' + (scenes[0].colorGrading || 'refined color grading') +
    ', ' + (scenes[0].lighting || 'motivated lighting') + ', and physically plausible camera movement.';
  let dd = styleLine + '\n';
  if (isI2V) {
    const refsZh = refImages.map((r, k) => '[参考图' + (k + 1) + ']（' + (r.type || '参考') + '）').join('、');
    const refsEn = refImages.map((r, k) => '[Reference Image ' + (k + 1) + '] (' + refTypeEn(r.type) + ')').join(', ');
    if (isZh) {
      dd += '全片严格参照以下参考图保持主体一致：' + refsZh + '。\n';
    } else {
      dd += 'Throughout the video, strictly use the following reference images to keep subjects consistent: ' + refsEn + '.\n';
    }
  }
  // 风格叙事DNA + 行业叙事DNA（整片只写一次，统一作用于全片，避免每个镜头重复）
  if (isZh) {
    if (globalZh) dd += globalZh + '\n';
  } else {
    if (globalEn) dd += globalEn + '\n';
  }
  scenes.forEach((s, i) => {
    const refNote = buildRefNoteForShot(refImages, i, isZh);
    dd += buildShotBlock(s, i, starts[i], lang, refNote) + '\n';
  });

  // ---- overall_soundscape / non_diegetic_music ----
  let sound = '';
  scenes.forEach((s) => { sound += (isZh ? s.soundscapeZh : s.soundscapeEn) + ' '; });
  sound = sound.trim() || (isZh ? '自然环境声与动作音效，随画面同步。' : 'Natural ambient sound and physical action sound, synchronized with the picture.');

  let music = '';
  scenes.forEach((s) => { music += (isZh ? s.musicZh : s.musicEn) + ' '; });
  music = music.trim() || 'N/A';

  return 'subject_definitions:\n' + subjects +
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
