/**
 * H3 AI 视频提示词工坊 - 中文提示词库
 * 与 data.js 的英文提示词一一对应，供「中文 / English」双语切换使用。
 * 每个场景返回 { visual, soundscape, music } 三段中文描述，
 * 可直接作为 MiniMax H3 的中文提示词（字段名仍用英文，内容用中文）。
 */

const ZH_SCENES = {

  /* ===================== 企业宣传片 (8 scenes) ===================== */
  corporate: {
    hook: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `自创立以来，${ctx.brand}始终被一个愿景驱动：塑造${ctx.industryName}的未来。`;
        return `[镜头1] 电影感画面，航拍全景镜头在黄金时刻缓缓下降并向前推进，俯瞰${ctx.brand}所在的${ctx.industryName}地标建筑。暖阳洒在建筑表面，投下长长的戏剧性阴影，奠定宏大而雄心勃勃的开篇基调。画面中央偏下淡入一行优雅衬线字体的品牌名"${ctx.brand}"，带柔和光晕。画外音（S1）以温暖自信的语气说道：<d>[中文] ${voZh}</d>，画面中不出现人物嘴唇。`;
      },
      soundscape(ctx) {
        return `高空里遥远的城市环境音，夹杂着轻柔的高空微风，随着镜头下降，一层低频嗡鸣逐渐增强。`;
      },
      music(ctx) {
        return `管弦乐风格配乐，以缓慢速度的持续弦乐起头，逐渐加入上行的钢琴动机与深沉共鸣的低音。`;
      }
    },
    origin: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `从一个怀揣梦想的小团队，成长为如今的创新力量。`;
        return `[镜头1] 特写镜头，一双手在木质书桌上小心地翻动一本皮质笔记本。镜头缓缓推进，对准手写的笔记与草图。台灯投下暖琥珀色光线，营造怀旧氛围。桌面上散落着老照片与蓝图，光束中浮动的尘埃清晰可见。画外音（S1）以反思、温暖的语气继续说道：<d>[中文] ${voZh}</d>，画面中不出现人物嘴唇。`;
      },
      soundscape(ctx) {
        return `纸张翻动的轻柔沙沙声、钢笔划过纸面的轻微摩擦声，以及木椅安静的吱呀声，全部笼罩在安静的房间底噪中。`;
      },
      music(ctx) {
        return `缓慢而沉思的钢琴独奏，音符稀疏，带着简单反复的动机。`;
      }
    },
    strength: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `今天，${ctx.brand}立足于${ctx.industryName}前沿，由世界级团队与技术驱动。`;
        return `[镜头1] 宽幅跟拍镜头穿过${ctx.brand}所在的专业作业场景。镜头以中等速度向前推移，依次展现一排排有序而精准的活动。身着职业装的工作人员专注地操作先进设备。${ctx.lightingDescZh}。镜头捕捉到这一作业的规模与专业度。画外音（S1）以自信、权威的语气说道：<d>[中文] ${voZh}</d>，画面中工作人员嘴唇保持闭合。`;
      },
      soundscape(ctx) {
        return `机器设备有节奏的嗡鸣，叠加键盘轻响、抛光地面上的脚步声，以及繁忙专业环境的 ambient  buzz。`;
      },
      music(ctx) {
        return `中等速度的驱动型电子脉冲，叠加合成器铺底与稳定低音节奏。`;
      }
    },
    product: {
      visual(ctx) {
        return `[镜头1] 中近景镜头，将${ctx.product || ctx.brand}呈现在极简展台上。镜头以缓慢速度做 360 度环绕。影棚戏剧光打出的轮廓光勾出产品边缘，形成高级英雄镜头。${ctx.colorGradingZh}。右上角以现代无衬线字体淡入清爽的品牌名"${ctx.brand}"。产品下方的表面反射出微妙的光纹。`;
      },
      soundscape(ctx) {
        return `安静的影棚氛围，伴着影棚灯具的微弱电流声，以及一缕几乎听不见、与画面精度相呼应的电子音。`;
      },
      music(ctx) {
        return `中等速度、利落的现代电子曲，清脆的合成器琶音与逐渐加强的稳定低音线。`;
      }
    },
    team: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `我们最大的优势是人——多元、热情，因共同目标而凝聚。`;
        return `[镜头1] 中景镜头，捕捉一支多元团队在明亮现代办公室的长桌旁协作。镜头以缓慢速度向右横移，展现专注的神情、热烈的讨论与创意能量。自然光透过落地窗洒入。成员指向屏幕、分享想法、相视而笑。画外音（S1）以温暖、鼓舞的语气说道：<d>[中文] ${voZh}</d>，画面中人物嘴唇保持闭合。`;
      },
      soundscape(ctx) {
        return `热烈交谈的低语，混合笔记本敲击声、纸张翻动声与偶尔的笑声，全部笼罩在明亮的房间底噪中。`;
      },
      music(ctx) {
        return `中等速度的原声编曲，明亮吉他扫弦、轻打击乐与清晰的钢琴旋律线。`;
      }
    },
    responsibility: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `除了商业，我们更相信回馈——回馈社区，也回馈我们共享的地球。`;
        return `[镜头1] 宽景镜头展现社区公益场景——身着品牌 T 恤的志愿者种树、孩童欢笑、背景里太阳能板熠熠生辉。镜头缓慢上升并向后拉开，展现公益项目的全貌。${ctx.lightingDescZh}。画面洋溢温暖与真挚关怀。画外音（S1）以真诚、温柔的语气说道：<d>[中文] ${voZh}</d>，画面中参与者嘴唇保持闭合。`;
      },
      soundscape(ctx) {
        return `背景里的鸟鸣、树叶沙沙、孩童笑声，以及挖掘与种植的微声，全部笼罩在温柔的户外氛围中。`;
      },
      music(ctx) {
        return `缓慢的弦乐编排，旋律柔软地涌起音量，辅以轻原声吉他。`;
      }
    },
    future: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `未来不是等待而来的，而是我们亲手建造的——一起。`;
        return `[镜头1] 中宽景镜头望向天际线，现代城市与绚烂日出相接。镜头以大振幅缓慢推进一处明亮光源。光线越来越亮，镜头光晕充满画面，象征无限可能。流动的數據流与光粒子等抽象数字元素飘过场景，寓意创新与数字未来。画外音（S1）以鼓舞、前瞻的语气说道：<d>[中文] ${voZh}</d>，画面中不出现人物嘴唇。`;
      },
      soundscape(ctx) {
        return `逐渐增强的电子共振，叠加空灵如风之声，以及一丝高频微鸣，唤起无限可能的感觉。`;
      },
      music(ctx) {
        return `缓慢却上扬的管弦乐与电子混合，层层弦乐、深沉合成低音，以及结尾渐强的上扬铜管动机。`;
      }
    },
    closing: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || ctx.slogan || `${ctx.brand}。今天，共建明日。`;
        return `[镜头1] 固定镜头，定格在干净的暗色渐变背景上。"${ctx.brand}"标志以粒子聚合的方式带微光浮现，落定在画面中央。标志下方，文字"${ctx.slogan || '今天，共建明日。'}"以优雅清爽的无衬线字体淡入。${ctx.colorGradingZh}。画外音（S1）以自信、收束的语气说道：<d>[中文] ${voZh}</d>，画面中不出现人物嘴唇。`;
      },
      soundscape(ctx) {
        return `干净安静的影棚氛围，标志浮现时一声细微电子轻响，随后轻柔淡出至近乎无声。`;
      },
      music(ctx) {
        return `缓慢持续的解决式和弦，饱满弦乐与最后一记 lingering 的钢琴音，渐弱至无声。`;
      }
    }
  },

  /* ===================== 产品广告 (5 scenes) ===================== */
  product: {
    problem: {
      visual(ctx) {
        return `[镜头1] 中景镜头，展现一个人身处${ctx.usageScenario || '日常环境'}，正明显受困于${ctx.problemContext || '低效的传统方案'}。镜头以略带手持晃动固定拍摄，捕捉其轻微沮丧的神情。光线略暗、沉闷，传达受限感。此人放下不称手的产物，带着疑问看向镜头。`;
      },
      soundscape(ctx) {
        return `一声沉重的叹息，随后物体被放在桌上的闷响，叠加传达日常挫败感的沉闷房间底噪。`;
      },
      music(ctx) {
        return `缓慢、略带紧张的电子长音，不和谐底色与低沉的脉动节奏。`;
      }
    },
    reveal: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `隆重推出 ${ctx.product || ctx.brand}——重新定义可能。`;
        return `[镜头1] 特写镜头，${ctx.product || ctx.brand}置于纯黑背景前。镜头以缓慢速度做 360 度环绕。戏剧影棚光打出明亮轮廓光，勾出产品每一处边缘与轮廓，形成惊艳英雄镜头。光在高级材质表面反射。画面中央以金属质感现代字体弹出醒目的品牌名"${ctx.product || ctx.brand}"。画外音（S1）以兴奋、揭晓的语气说道：<d>[中文] ${voZh}</d>`;
      },
      soundscape(ctx) {
        return `产品揭晓时一道干净利落的 whoosh，随后一缕传达高级质感与科技感的电子嗡鸣。`;
      },
      music(ctx) {
        return `中等速度的 energetic 电子 build-up，上升的合成器扫频在产品揭晓瞬间达到峰值，随后一记坚定有力的节拍。`;
      }
    },
    features: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `每一处细节，皆臻于至善。每一项功能，皆为你而生。`;
        return `[镜头1] 极特写镜头捕捉${ctx.product || ctx.brand}的精细细节。镜头以缓慢速度小幅推进扫过表面，展现高级材质、精密工艺与细腻纹理。一根手指轻轻与产品互动，演示一项关键功能。画面下方三分之一处依次淡入极简无衬线文字："精工制造"，随后"智能科技"。画外音（S1）以信息感、自信的语气说道：<d>[中文] ${voZh}</d>`;
      },
      soundscape(ctx) {
        return `指尖触碰光滑表面的清脆触感声、按钮的轻微咔哒、机械的细微嗡鸣，全部笼罩在干净影棚底噪中。`;
      },
      music(ctx) {
        return `中等速度、现代的节奏电子曲，清脆打击乐与功能揭晓瞬间同步，稳定的坚定低音线。`;
      }
    },
    lifestyle: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `看 ${ctx.product || ctx.brand} 如何无缝融入你的生活。`;
        return `[镜头1] 中宽景镜头，展现一个人于美好的真实场景中使用${ctx.product || ctx.brand}。镜头以中等速度从侧方跟拍，此人轻松愉悦地度过一天。${ctx.lightingDescZh}。此人微笑，显然享受其中。产品自然地融入场景，升华此刻而非喧宾夺主。画外音（S1）以温暖、有共鸣的语气说道：<d>[中文] ${voZh}</d>，画面中人物嘴唇保持闭合。`;
      },
      soundscape(ctx) {
        return `自然环境声——轻柔脚步、室内外环境音、产品细微运转声，以及使用者满足的低声。`;
      },
      music(ctx) {
        return `中等速度的编曲，明亮原声吉他、轻打击乐与清晰的旋律合成线。`;
      }
    },
    cta: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `${ctx.brand}。现已上市。感受不同。`;
        return `[镜头1] 固定镜头，${ctx.product || ctx.brand}醒目地呈现在干净渐变背景前。画面顶部出现"${ctx.brand}"标志。产品下方粗体文字叠层："${ctx.ctaText || '立即购买'}"与"${ctx.slogan || '感受不同'}"以清爽现代无衬线字体呈现。一道微光掠过文字。${ctx.colorGradingZh}。`;
      },
      soundscape(ctx) {
        return `干净明亮的影棚氛围，文字出现时一声满意轻响，随后微电子铺底。`;
      },
      music(ctx) {
        return `中等速度、energetic 坚定的电子收尾，强收尾拍与明亮解决和弦干净淡出。`;
      }
    },
    health_awareness: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `我们总在照顾一切，却常常忘了照顾承载这一切的身体。`;
        return `[镜头1] 中景镜头，跟拍一个忙碌的现代人穿梭于紧凑的一天——长时间伏案、肩颈紧绷、身体悄悄透支。镜头以缓慢、共情的推进，光线柔和却略带清冷，透出隐约的疲惫。此人停顿，抬手扶向后颈或后腰，一个"身体也需要被照顾"的微小醒觉。${ctx.colorGradingZh}。画外音（S1）以平静、唤醒的语气说道：<d>[中文] ${voZh}</d>，画面中人物嘴唇保持闭合。`;
      },
      soundscape(ctx) {
        return `忙碌一天的闷响底噪——远处键盘声、一声轻叹、城市微鸣，逐渐沉淀为更安静、私密的空间感。`;
      },
      music(ctx) {
        return `缓慢、内省的钢琴旋律，稀疏温暖，一记持续的弦音留出思考空间。`;
      }
    },
    benefits: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `每天一点小小的仪式，累积成身体得以放松、舒展与被照顾的安心。`;
        const subject = ctx.product || ctx.brand;
        return `[镜头1] 特写镜头，${subject}在真实居家使用中，展现它带来的日常体验。镜头以缓慢速度做 360 度环绕。暖意包裹画面，人物明显松弛下来，一天的紧绷悄然软化。画面下方三分之一处依次淡入极简无衬线文字："日常轻松"，随后"温和养护"。${ctx.colorGradingZh}。画外音（S1）以温暖、讲好处的语气说道：<d>[中文] ${voZh}</d>`;
      },
      soundscape(ctx) {
        return `水流的轻柔潺潺与安稳、舒缓的居家底噪下的细微嗡鸣。`;
      },
      music(ctx) {
        return `中等速度、温暖柔和的木吉他曲，柔软铺底与温和安心的节奏。`;
      }
    },
    audience: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `从久坐的上班族，到家中的父母与长辈——一份温和的日常仪式，落到哪里都合适。`;
        const subject = ctx.product || ctx.brand;
        return `[镜头1] 中远景镜头，呈现一组温和的人群剪影——伏案的上班族、操劳的父母、安享晚年的长辈——各自在${subject}中偷得片刻松弛。镜头以中等速度横向轻移，温暖包容的光线让人人都被看见。${ctx.colorGradingZh}。画外音（S1）以温暖、欢迎的语气说道：<d>[中文] ${voZh}</d>，画面中人物嘴唇保持闭合。`;
      },
      soundscape(ctx) {
        return `柔软、有共鸣的日常声——椅子滚动、水壶、轻脚步，融入平静不慌的空间。`;
      },
      music(ctx) {
        return `中等速度、明亮友好的原声主题，轻盈而欢迎。`;
      }
    },
    reaction: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `当身体悄悄重新找回平衡，你可能会察觉一些"调整的信号"——一阵暖意、一声释然的呼气、片刻的困倦。那是身体在照顾自己，只是它重新找回自己的节奏。`;
        return `[镜头1] 特写镜头，定格一个人在居家养生时刻——皮肤上泛起温润的光泽、一次放松的呼气，或许是身体在调整、在松开时浮现的片刻困倦。镜头以缓慢、安抚的固定机位。柔和安抚的光。${ctx.colorGradingZh}。画外音（S1）以轻柔、科普的语气说道：<d>[中文] ${voZh}</d>，画面中人物嘴唇保持闭合。`;
      },
      soundscape(ctx) {
        return `缓慢均匀的呼吸、水流的细微潺潺，以及安静、令人安心的房间底噪。`;
      },
      music(ctx) {
        return `极轻柔、极简的环境铺底，缓慢呼吸般与画面同频。`;
      }
    },
    brand_story: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `${ctx.brand}始于一个简单的信念：温和的日常养护，理应走进每一个家。`;
        return `[镜头1] 中景镜头，展现${ctx.brand}的初心——一个温暖、亲手付出的养护瞬间，传递对日常健康的用心。镜头以缓慢小幅向左横移，每一处手势都透出真诚。附近灯具的暖光营造亲密氛围。${ctx.colorGradingZh}。画外音（S1）以温暖、讲故事的语气说道：<d>[中文] ${voZh}</d>，画面中人物嘴唇保持闭合。`;
      },
      soundscape(ctx) {
        return `工坊或安宁居家真实的抚慰之声——轻柔脚步、水壶、温柔的触碰。`;
      },
      music(ctx) {
        return `缓慢、真挚的钢琴与弦乐主题，诚恳而有开创感。`;
      }
    }
  },

  /* ===================== 品牌形象片 (5 scenes) ===================== */
  brand: {
    emotional: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `我们真正想要的，不是更多东西，而是更多意义。`;
        return `[镜头1] 特写镜头，捕捉一张安静反思中的人脸。镜头以缓慢速度小幅推进，暖自然光落在眼中。神情透出深沉、希望与对更多的探寻。背景柔焦，将全部注意力引向人物情绪。画外音（S1）以温暖、亲密的语气说道：<d>[中文] ${voZh}</d>，画面中人物嘴唇轻轻闭合。`;
      },
      soundscape(ctx) {
        return `安静亲密的房间底噪，伴着轻微呼吸声、窗外远处的鸟鸣，以及衣料细微的沙沙声。`;
      },
      music(ctx) {
        return `缓慢、细腻的钢琴旋律，音符稀疏共鸣，逐渐加入柔软的持续弦乐。`;
      }
    },
    story: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `${ctx.brand}诞生于一个简单的信念：每个人都值得更好的。`;
        return `[镜头1] 中景镜头，展现一位匠人或创作者在劳作——双手以热情与精准塑造、建造或设计。镜头以缓慢速度小幅向左横移，展现每个动作里的专注。附近灯具投出的暖色实用光，营造亲密真实的氛围。工具、材料与半成品填满画面，富有质感与故事。画外音（S1）以叙事、温暖的语气说道：<d>[中文] ${voZh}</d>，画面中人物嘴唇保持闭合。`;
      },
      soundscape(ctx) {
        return `真实匠作之声——工具触碰材料、刀刃刮擦、锤子轻敲或机器嗡鸣，全部笼罩在温暖工坊氛围中。`;
      },
      music(ctx) {
        return `缓慢的叙事原声编曲，明亮吉他指弹与清晰的旋律钢琴线。`;
      }
    },
    values: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `我们相信：品质，绝不妥协。人，高于利润。做经得起时间的东西。`;
        return `[镜头1] 宽景镜头展现充满人气与社区的生动场景——喧闹市集、朋友共享一刻、或人群穿过美好公共空间。镜头缓慢上升并向后拉开，视野扩大，展现人际连接的全貌。${ctx.lightingDescZh}。画面下方三分之一处淡入一行简洁的品牌名"${ctx.brand}"。画外音（S1）以热情、价值驱动的语气说道：<d>[中文] ${voZh}</d>`;
      },
      soundscape(ctx) {
        return `丰富的人声环境——交叠的谈话、脚步、笑声，以及鲜活社区的轻柔声响，自然层叠。`;
      },
      music(ctx) {
        return `中等速度的管弦乐编排，rich 弦乐、旋律木管与轻微渐强的打击乐。`;
      }
    },
    lifestyle: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `这不止是一件产品。这是一种活法，一种存在方式。`;
        return `[镜头1] 中宽景镜头，从背后以中等速度跟拍一个人穿过美好的、令人向往的场景——日落海岸小径、山间步道或活力都市街头。镜头缓慢推进。黄金时刻的光为一切镀上温暖。此人自信愉悦地行走，诠释${ctx.brand}所代表的生活方式。画外音（S1）以向往、温暖的语气说道：<d>[中文] ${voZh}</d>，画面中人物嘴唇保持闭合。`;
      },
      soundscape(ctx) {
        return `自然环境声——海浪、林间风声或都市氛围——叠加脚步声与活动移动的细微声响。`;
      },
      music(ctx) {
        return `中等速度的电影感编排，明亮原声吉他、驱动打击乐与高扬旋律线。`;
      }
    },
    brandFrame: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || ctx.slogan || `${ctx.brand}。活出更多。`;
        return `[镜头1] 固定镜头，定格在干净优雅的柔渐变背景上。"${ctx.brand}"标志以精致动画出现在画面中央——一道柔光扫过。标志下方，文字"${ctx.slogan || '活出更多。'}"以优雅衬线字体淡入。构图极简，留白充足。${ctx.colorGradingZh}。画外音（S1）以温暖、收束的语气说道：<d>[中文] ${voZh}</d>`;
      },
      soundscape(ctx) {
        return `安静干净的氛围，标志出现时一声共鸣轻响，随后轻柔淡出至近乎无声。`;
      },
      music(ctx) {
        return `缓慢持续的收尾和弦，饱满弦乐与一记 lingering 的钢琴音，渐弱收束。`;
      }
    }
  },

  /* ===================== 电商短视频 (4 scenes) ===================== */
  ecommerce: {
    closeup: {
      visual(ctx) {
        return `[镜头1] 极特写镜头，捕捉${ctx.product || ctx.brand}被拆箱或揭晓的瞬间。镜头以大振幅缓慢推进扫过产品表面，展现高级质感、鲜亮色彩与精细细节。明亮影棚光搭配彩色点缀光，营造吸睛、适合社媒的观感。画面中央以动态动画弹出醒目的品牌名"${ctx.product || ctx.brand}"。${ctx.colorGradingZh}。`;
      },
      soundscape(ctx) {
        return `拆箱满足感——纸张窸窣、盒子打开、指甲轻敲产品表面，以及文字出现时的细微电子 pop。`;
      },
      music(ctx) {
        return `快节奏、时髦的 upbeat 电子曲，punchy 节拍、明亮合成器重音与适合短视频节奏的抓耳节奏。`;
      }
    },
    selling: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `你会爱上它的三个理由。`;
        return `[镜头1] 中近景镜头，从角度一展现${ctx.product || ctx.brand}，突出卖点一。粗体文字"${ctx.sellingPoint1 || '高级品质'}"以动态入场动画弹出。[镜头2] 00:01.500 处切到不同角度展示卖点二，文字"${ctx.sellingPoint2 || '智能设计'}""。[镜头3] 00:03.000 处切到第三角度展示卖点三，文字"${ctx.sellingPoint3 || '超值之选'}"。每次切换揭晓一项新利益，配以 energetic 视觉转场。${ctx.colorGradingZh}。画外音（S1）以 energetic、销售导向的语气说道：<d>[中文] ${voZh}</d>`;
      },
      soundscape(ctx) {
        return `每次切换同步的 quick swoosh、产品互动的触觉声，以及文字叠层出现时的明亮电子 pop。`;
      },
      music(ctx) {
        return `快节奏高能电子曲，与每次切换同步的 punchy drop、驱动节拍与抓耳旋律 hook。`;
      }
    },
    results: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `亲眼见证改变。`;
        return `[镜头1] 中景镜头，展现一个人于真实场景中使用${ctx.product || ctx.brand}。镜头以中等速度从侧方跟拍，此人演示产品使用过程，清晰展现积极结果与满意感。使用前后的效果在视觉上令人信服。${ctx.lightingDescZh}。此人神情由平静转为欣喜。画外音（S1）以热情的语气说道：<d>[中文] ${voZh}</d>，画面中人物嘴唇保持闭合。`;
      },
      soundscape(ctx) {
        return `自然环境声、产品使用声，以及使用者满意的细微声响，全部笼罩在明亮氛围底噪中。`;
      },
      music(ctx) {
        return `中等速度的 upbeat 电子曲，明亮旋律、击掌声与不过分张扬的 energetic 编排。`;
      }
    },
    cta: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `立即选购——限时优惠！`;
        return `[镜头1] 固定镜头，${ctx.product || ctx.brand}醒目呈现，粗体文字叠层：顶部"${ctx.brand}"，中央大字号"${ctx.ctaText || '限时优惠'}"，底部按钮式"${ctx.slogan || '立即选购'}"。倒计时或"库存有限"提示增添紧迫感。${ctx.colorGradingZh}。构图以最大视觉冲击与转化为目标。`;
      },
      soundscape(ctx) {
        return `干净明亮的影棚声，每个文字元素出现时一声吸睛轻响，以及最后满足的 pop。`;
      },
      music(ctx) {
        return `快节奏、紧迫感驱动的电子曲，驱动节拍、渐强张力，以及戛然而止的有力收尾 drop。`;
      }
    }
  },

  /* ===================== 活动宣传片 (5 scenes) ===================== */
  event: {
    teaser: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `非凡之事，正在到来。`;
        return `[镜头1] 中景镜头，展现一处戏剧性、局部打光的舞台或场地空间。镜头以缓慢速度小幅推进，聚光灯扫过场景，露出活动布置的惊鸿一瞥。戏剧性低调光营造神秘与期待。动态揭晓动画弹出粗体文字"${ctx.eventName || ctx.brand + ' 活动'}"，其下"${ctx.eventDate || '敬请期待'}"。${ctx.colorGradingZh}。画外音（S1）以兴奋、神秘的语气说道：<d>[中文] ${voZh}</d>`;
      },
      soundscape(ctx) {
        return `深沉共鸣的低频 rumble 逐渐增强，叠加聚光灯电机的扫动声与制造张力期待的电子 riser。`;
      },
      music(ctx) {
        return `缓慢却上扬的电影感电子 build，深沉低音、氛围合成铺底，以及未解决的渐强张力。`;
      }
    },
    highlights: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `世界级嘉宾。难忘演出。一段不可思议的体验。`;
        return `[镜头1] 宽景镜头穿过充满活力的活动场地。镜头以中等速度向前推移，依次展现不同区域——主舞台巨型 LED 屏、互动展位的展区、 networking 休息区。多彩舞台光营造动态兴奋氛围。粗体文字依次弹出："${ctx.highlight1 || '主题演讲'}"、"${ctx.highlight2 || '现场演出'}"、"${ctx.highlight3 || '互动展区'}"，现代 energetic 字体。画外音（S1）以 energetic、推广的语气说道：<d>[中文] ${voZh}</d>`;
      },
      soundscape(ctx) {
        return `大型场地的 energetic buzz——人群嘈杂、各区域音乐、主舞台低频轰鸣，以及 live 活动的兴奋感。`;
      },
      music(ctx) {
        return `快节奏、节日风电子曲，驱动节拍、明亮合成旋律与随现场推进的动态 drop。`;
      }
    },
    atmosphere: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `加入数千名同路人，齐聚一堂。`;
        return `[镜头1] 中宽景镜头，捕捉 live 活动现场热情的参会人群。镜头以缓慢速度环绕人群，展现人们欢呼、拍照、与展位互动。动态舞台光搭配色彩洗光与激光效果，营造电流般氛围。能量扑面而来——笑容、兴奋与处处连接。画外音（S1）以热情、邀请的语气说道：<d>[中文] ${voZh}</d>`;
      },
      soundscape(ctx) {
        return `兴奋人群的 roar、欢呼掌声、舞台音箱低频 thump，以及全面展开的 live 活动 ambient 能量。`;
      },
      music(ctx) {
        return `快节奏的高能电子曲，高扬旋律、驱动打击乐，以及随人群上扬的 building drop。`;
      }
    },
    info: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `记在日历上。${ctx.eventDate || '今年秋天'}。${ctx.eventLocation || '会展中心'}。`;
        return `[镜头1] 固定镜头，定格在干净专业的背景上。文字叠层以流畅动画依次出现：主标题"${ctx.eventName || ctx.brand + ' 活动'}"，关键信息"${ctx.eventDate || '日期待定'}"与"${ctx.eventLocation || '地点待定'}"，以及醒目行动召唤按钮"${ctx.ctaText || '立即报名'}"。布局干净现代、以信息为导向。${ctx.colorGradingZh}。画外音（S1）以清晰、信息感的语气说道：<d>[中文] ${voZh}</d>`;
      },
      soundscape(ctx) {
        return `干净专业的影棚氛围，每个信息元素出现时的细微电子轻响。`;
      },
      music(ctx) {
        return `中等速度、现代干净的电子曲，清脆节拍、稳定节奏与坚定的旋律。`;
      }
    },
    cta: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `门票有限。别错过——今天就报名！`;
        return `[镜头1] 固定镜头，画面中央醒目呈现"${ctx.eventName || ctx.brand + ' 活动'}"标志。其下，粗体"${ctx.ctaText || '立即报名'}"按钮式文字叠层轻轻脉动。"名额有限"提示增添紧迫感。背景为带微妙动态元素的 energetic 渐变。${ctx.colorGradingZh}。画外音（S1）以紧迫、兴奋的语气说道：<d>[中文] ${voZh}</d>`;
      },
      soundscape(ctx) {
        return `明亮吸睛的影棚声，CTA 出现时一声满意轻响，以及微妙渐强紧迫感的电子铺底。`;
      },
      music(ctx) {
        return `快节奏、紧迫感驱动的电子曲，驱动节拍、渐强张力，以及骤然收束的有力收尾 hit。`;
      }
    }
  },

  /* ===================== 招聘宣传 (5 scenes) ===================== */
  recruitment: {
    workplace: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `这里是想法成真的地方。欢迎来到 ${ctx.brand}。`;
        return `[镜头1] 宽幅跟拍镜头穿过现代明亮的办公空间。镜头以中等速度向前推移，经过开放工位、协作区与玻璃幕墙会议室。自然光倾泻而入，透过落地窗。绿植、现代家具与用心设计营造宜人工作环境。角落淡入简洁品牌名"${ctx.brand}"。画外音（S1）以温暖、欢迎的语气说道：<d>[中文] ${voZh}</d>`;
      },
      soundscape(ctx) {
        return `现代办公室的 ambient 声——键盘敲击、轻柔交谈、空调嗡鸣与偶尔笑声，全部笼罩在明亮高效氛围中。`;
      },
      music(ctx) {
        return `中等速度、明亮的电子曲，干净旋律、轻打击乐与稳定前行的脉冲节奏。`;
      }
    },
    culture: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `我们不只是共事。我们一同成长、庆祝，也一同取胜。`;
        return `[镜头1] 中景镜头，捕捉团队享受协作时刻——围着写满创意的白板大笑、在明亮休息室共餐、或庆祝项目里程碑。镜头以缓慢速度小幅向右横移，展现真切的连接与默契。氛围温暖、有能量、真实。画外音（S1）以温暖、真挚的语气说道：<d>[中文] ${voZh}</d>，画面中人物嘴唇保持闭合。`;
      },
      soundscape(ctx) {
        return `团队互动的温暖声——热烈交谈、欢笑、咖啡杯轻碰与共享食物沙沙，全部笼罩在 lively 办公氛围中。`;
      },
      music(ctx) {
        return `中等速度的原声编排，明亮吉他、轻打击乐与清晰的旋律线。`;
      }
    },
    growth: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `你的潜力在这里没有上限。我们一路投资你的成长。`;
        return `[镜头1] 中近景镜头，展现一位职场人专注学习——参加工作坊、向同事演讲，或与导师协作。镜头以缓慢速度小幅推进，捕捉其神情中的专注与笃定。文字叠层依次出现："导师计划"、"职业晋升"、"持续学习"，干净励志字体。画外音（S1）以鼓舞、激励的语气说道：<d>[中文] ${voZh}</d>，画面中人物嘴唇保持闭合。`;
      },
      soundscape(ctx) {
        return `学习的专注声——白板马克笔、键盘轻敲、低声讨论，以及高效学习环境的 ambient 能量。`;
      },
      music(ctx) {
        return `中等速度、上扬的曲子，上扬钢琴、渐强弦乐与稳定的节奏。`;
      }
    },
    testimonials: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `在这里两年，我的成长超出想象。这里，就是我的归属。`;
        return `[镜头1] 特写镜头，暖色柔光人像打光下框住一位员工面孔。镜头以细微自然运动固定拍摄。神情真切——混合骄傲、满足与真实。背景柔焦，将焦点完全引向人物故事。画外音（S1）以真诚、私人的语气说道：<d>[中文] ${voZh}</d>，画面中人物嘴唇轻轻闭合，眼神传递情绪。`;
      },
      soundscape(ctx) {
        return `安静亲密的氛围，柔和房间底噪，背景里办公室的细微 ambient 声，以及空气中一丝温暖。`;
      },
      music(ctx) {
        return `缓慢、细腻的钢琴曲，稀疏共鸣的音符与柔软的持续弦乐。`;
      }
    },
    join: {
      visual(ctx) {
        const voZh = ctx.voiceoverText || `你的未来，由此启程。加入 ${ctx.brand}。`;
        return `[镜头1] 固定镜头，以干净现代动画在画面中央呈现"${ctx.brand}"标志。其下粗体"加入我们"以欢迎字体呈现，随后清晰的行动召唤"${ctx.ctaText || '立即应聘 ' + ctx.brand + '.com/careers'}"。背景为明亮乐观的渐变。${ctx.colorGradingZh}。画外音（S1）以温暖、邀请、收束的语气说道：<d>[中文] ${voZh}</d>`;
      },
      soundscape(ctx) {
        return `干净明亮的氛围，文字出现时一声欢迎轻响，随后轻柔 ambient 淡出。`;
      },
      music(ctx) {
        return `中等速度、明亮的收尾，开放和弦、清晰的旋律与最终解决音。`;
      }
    }
  }
};

/* ===================== 剧情反转 (6 scenes) =====================
 * 剧情反转风格的中文提示词，由 TWIST_SCENE_TEMPLATES 直接按 scene.id 查找。
 * 与其它场景无关，不按 videoType 分组。
 */
const ZH_TWIST_SCENES = {
  twist_setup: {
    visual(ctx) {
      const voZh = '这类故事，你已经看过一百遍了。';
      const env = ctx.industryData.environments[0];
      return `[镜头1] ${ctx.styleKeywordsZh}，一段建立性的全景镜头，缓缓铺开一个再普通不过的场景——${env}——仿佛只是一支寻常的广告。镜头以小幅度缓慢推近。柔和自然的灯光，毫无戏剧性。画面中，一行朴素克制的标题淡入，显示"${ctx.brand}"。画外音（S1）以平淡、就事论事的语气说道：<d>[中文] ${voZh}</d>，画面中不出现人物嘴唇。`;
    },
    soundscape() {
      return `日常的环境底噪，故意平淡无奇，像一支普通广告的标配。`;
    },
    music(ctx) {
      return `${ctx.musicStyleZh}，但音量压得很低、几乎无聊。`;
    }
  },
  twist_anomaly: {
    visual(ctx) {
      const voZh = '角落里那个小细节，几乎没人注意到。';
      return `[镜头1] ${ctx.styleKeywordsZh}，一个极特写镜头缓缓推进，落在某个看似微不足道、与周围格格不入的小细节上——这是要观众主动忽略的"反常点"。一束动机光把它单独照亮；镜头多停留了半秒。画面中不加任何标注，保持暧昧。画外音（S1）几乎是在耳边低语：<d>[中文] ${voZh}</d>，画面中不出现人物嘴唇。`;
    },
    soundscape() {
      return `一声极轻、稍显违和的音效，把观众的余光引向那个细节，然后迅速淡去。`;
    },
    music(ctx) {
      return `${ctx.musicStyleZh}，只剩一个低沉的离调和音，暗示哪里不对，紧接着是沉默。`;
    }
  },
  twist_misdirect: {
    visual(ctx) {
      const voZh = '所以你自然觉得，结局你已经猜到了。';
      return `[镜头1] ${ctx.styleKeywordsZh}，一个略显躁动的手持中景，循着大家熟悉、最容易猜到的套路往下走——事情似乎正奔向那个"理所当然"的结局。镜头略带晃动，悄悄营造不安；${ctx.colorGradingZh}。画外音（S1）带着一种刻意的、错误的自信，把观众带偏：<d>[中文] ${voZh}</d>，画面中不出现人物嘴唇。`;
    },
    soundscape() {
      return `日常场景开始"裂开"——一个小失误、一个错拍的节奏、一声细微的"出事了"的声音。`;
    },
    music(ctx) {
      return `${ctx.musicStyleZh}，张力随熟悉的剧情显得要崩而缓慢上升。`;
    }
  },
  twist_falseclimax: {
    visual(ctx) {
      const voZh = '看起来，要完了。好像从来就没戏。';
      return `[镜头1] ${ctx.styleKeywordsZh}，一个紧绷的特写镜头骤然推近，仿佛一切正以最坏的方式崩溃——故事似乎注定要走向最糟糕的版本。急促的 snap-zoom 与生硬的高对比光把张力顶到极限。画面中，一行刺眼的字幕打出"全都崩了"。画外音（S1）听上去像是认输：<d>[中文] ${voZh}</d>，画面中不出现人物嘴唇。`;
    },
    soundscape() {
      return `一声刺耳的撞击、一记明显的"唱片卡带"声、一声无可置疑的"失败落地"声。`;
    },
    music(ctx) {
      return `${ctx.musicStyleZh}，急坠至一个猝不及防的低谷——假象的终点。`;
    }
  },
  twist_reveal: {
    visual(ctx) {
      const voZh = '你注意到那个细节了吗？它一直在。';
      const r = (typeof twistRevealZh === 'function') ? twistRevealZh(ctx) : { line: '真相此刻被揭开。', vo: voZh };
      return `[镜头1] ${ctx.styleKeywordsZh}，镜头拉远，揭示那个翻转一切的真相——前面那个看似不起眼的细节，才是整件事的全部答案。${r.line} 戏剧性的主光骤然翻转，冷调色调瞬间变暖、变亮。画面中央打出"${ctx.brand}"，下方落下一行简短的字："一直都在。"画外音（S1）带着会心一笑念出反转：<d>[中文] ${r.vo}</d>，画面中不出现人物嘴唇。`;
    },
    soundscape() {
      return `一瞬间绝对的静默，紧接着那个"细节"咔哒一声落定，发出一声清脆、令人满足的音效。`;
    },
    music(ctx) {
      return `${ctx.musicStyleZh}，一声干脆的戏剧性 sting，随后升腾为上扬、开阔的主题。`;
    }
  },
  twist_payoff: {
    visual(ctx) {
      const slogan = ctx.slogan || '看仔细点。真相一直都在。';
      const cta = ctx.ctaText || (ctx.hasBrand ? ('到 ' + ctx.brand + ' 看见真相') : '看见真相');
      return `[镜头1] ${ctx.styleKeywordsZh}，一个干净的 logo lockup 居中定格——"${ctx.brand}"下方一行 slogan"${slogan}"——反转之后，这行字被赋予了全新含义。镜头缓慢、自信地落定；${ctx.colorGradingZh}。画面下方打出 CTA："${cta}"。画外音（S1）以 slogan 收尾：<d>[中文] ${slogan}</d>，画面中不出现人物嘴唇。`;
    },
    soundscape() {
      return `一层自信、笃定的氛围环绕 logo 落定。`;
    },
    music(ctx) {
      return `${ctx.musicStyleZh}，最终以一个干净、圆满、让反转稳稳落地的解决和弦结束。`;
    }
  }
};
