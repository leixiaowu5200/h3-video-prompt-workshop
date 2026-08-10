/**
 * H3 AI 视频提示词工坊 - 应用逻辑
 */

// ========== 应用状态 ==========
const state = {
  selectedVideoType: 'corporate',
  selectedIndustry: '',
  selectedStyle: 'cinematic',
  selectedRatio: '16:9',
  genMode: 't2v', // 't2v' 文生视频 | 'i2v' 图生视频
  referenceImages: [], // [{ type, desc, scope:'all'|number }]
  scenes: [],
  formData: {},
  fullRefZh: '',
  fullRefEn: '',
  lang: 'zh' // 'zh' | 'en'  默认中文，照顾国内用户
};

// ========== 初始化 ==========
function init() {
  renderVideoTypes();
  renderIndustries();
  renderStyles();
  renderRatios();
  // 同步语言切换高亮
  document.querySelectorAll('#langToggle button').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === state.lang);
  });
  bindEvents();
  bindGenMode();
  bindInfoCards();
  // 主题切换初始化（恢复已选主题 + 绑定切换面板）
  initTheme();
  // 初始化优化次数显示
  updateOptCountUI(getOptimizeCount());
}

// ========== 渲染视频类型 ==========
function renderVideoTypes() {
  const grid = document.getElementById('videoTypeGrid');
  grid.innerHTML = Object.entries(VIDEO_TYPES).map(([key, type]) => `
    <div class="type-card ${key === state.selectedVideoType ? 'active' : ''}" data-type="${key}">
      <div class="icon">${type.icon}</div>
      <div class="name">${type.name}</div>
      <div class="desc">${type.desc}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.type-card').forEach(card => {
    card.addEventListener('click', () => {
      grid.querySelectorAll('.type-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.selectedVideoType = card.dataset.type;
    });
  });
}

// ========== 渲染行业 ==========
// 常用行业置顶：养生健康、灯具照明、票务代购，以及用户自有业务「巨晴水疗·养生调理」
const INDUSTRY_ORDER = ['wellness', 'lighting', 'ticketing', 'hydro'];
function renderIndustries() {
  const select = document.getElementById('industry');
  const ordered = [
    ...INDUSTRY_ORDER.filter(k => INDUSTRIES[k]).map(k => [k, INDUSTRIES[k]]),
    ...Object.keys(INDUSTRIES).filter(k => !INDUSTRY_ORDER.includes(k)).map(k => [k, INDUSTRIES[k]])
  ];
  select.innerHTML = '<option value="">请选择行业</option>' +
    ordered.map(([key, ind]) =>
      `<option value="${key}">${ind.name}</option>`
    ).join('');
}

// ========== 主题切换 ==========
const THEMES = [
  { id: 'amber',  name: '暗夜金', swatch: 'linear-gradient(135deg,#d4a44c,#8a6d30)' },
  { id: 'light',  name: '极简白', swatch: 'linear-gradient(135deg,#ffffff,#e2e2e8)' },
  { id: 'blue',   name: '深空蓝', swatch: 'linear-gradient(135deg,#4a9eff,#2f6fbf)' },
  { id: 'green',  name: '森林绿', swatch: 'linear-gradient(135deg,#4ade80,#2f9d5a)' },
  { id: 'pink',   name: '樱花粉', swatch: 'linear-gradient(135deg,#f06fa3,#c43b72)' },
  { id: 'orange', name: '黄昏橙', swatch: 'linear-gradient(135deg,#ff8c42,#cc6a28)' }
];
const THEME_KEY = 'h3_theme';

function applyTheme(id) {
  if (!THEMES.some(t => t.id === id)) id = 'amber';
  if (id === 'amber') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', id);
  }
  try { localStorage.setItem(THEME_KEY, id); } catch (e) {}
  // 同步面板高亮
  const list = document.getElementById('themeList');
  if (list) {
    list.querySelectorAll('.theme-swatch').forEach(el => {
      el.classList.toggle('active', el.dataset.theme === id);
    });
  }
}

function initTheme() {
  let saved = 'amber';
  try { saved = localStorage.getItem(THEME_KEY) || 'amber'; } catch (e) {}
  applyTheme(saved);

  const btn = document.getElementById('themeBtn');
  const panel = document.getElementById('themePanel');
  const list = document.getElementById('themeList');
  if (!btn || !panel || !list) return;

  // 渲染主题色块
  list.innerHTML = THEMES.map(t =>
    `<button type="button" class="theme-swatch ${t.id === saved ? 'active' : ''}" data-theme="${t.id}" role="menuitem">
       <span class="dot" style="background:${t.swatch}"></span>${t.name}
     </button>`
  ).join('');

  list.querySelectorAll('.theme-swatch').forEach(el => {
    el.addEventListener('click', () => {
      applyTheme(el.dataset.theme);
      panel.classList.remove('show');
    });
  });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('show');
  });
  // 点击面板内部不关闭
  panel.addEventListener('click', (e) => e.stopPropagation());
  // 点击外部关闭
  document.addEventListener('click', () => panel.classList.remove('show'));
}

// ========== 渲染风格 ==========
function renderStyles() {
  const grid = document.getElementById('styleGrid');
  grid.innerHTML = Object.entries(STYLES).map(([key, style]) => `
    <div class="style-card ${key === state.selectedStyle ? 'active' : ''}" data-style="${key}">
      ${style.name}
    </div>
  `).join('');

  grid.querySelectorAll('.style-card').forEach(card => {
    card.addEventListener('click', () => {
      grid.querySelectorAll('.style-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.selectedStyle = card.dataset.style;
    });
  });
}

// ========== 渲染画幅 ==========
function renderRatios() {
  const grid = document.getElementById('ratioGrid');
  grid.innerHTML = Object.entries(ASPECT_RATIOS).map(([key, ratio]) => `
    <div class="ratio-card ${key === state.selectedRatio ? 'active' : ''}" data-ratio="${key}" title="${ratio.desc}">
      ${key}
    </div>
  `).join('');

  grid.querySelectorAll('.ratio-card').forEach(card => {
    card.addEventListener('click', () => {
      grid.querySelectorAll('.ratio-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.selectedRatio = card.dataset.ratio;
    });
  });
}

// ========== 绑定事件 ==========
function bindEvents() {
  // 高级选项切换
  const advToggle = document.getElementById('advancedToggle');
  const advSection = document.getElementById('advancedSection');
  advToggle.addEventListener('click', () => {
    advToggle.classList.toggle('open');
    advSection.classList.toggle('open');
  });

  // 生成按钮
  document.getElementById('generateBtn').addEventListener('click', handleGenerate);

  // 导出按钮
  document.getElementById('copyAllBtn').addEventListener('click', handleCopyAll);
  document.getElementById('copyFullRefZhBtn').addEventListener('click', () => {
    if (!state.fullRefZh) return;
    copyToClipboard(state.fullRefZh, document.getElementById('copyFullRefZhBtn'));
  });
  document.getElementById('copyFullRefEnBtn').addEventListener('click', () => {
    if (!state.fullRefEn) return;
    copyToClipboard(state.fullRefEn, document.getElementById('copyFullRefEnBtn'));
  });
  document.getElementById('exportWordBtn').addEventListener('click', handleExportWord);
  document.getElementById('printBtn').addEventListener('click', () => window.print());

  // 弹窗
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') closeModal();
  });
  document.getElementById('copyWordBtn').addEventListener('click', () => {
    const content = document.getElementById('wordPreview').dataset.html || '';
    copyToClipboard(content);
  });
  document.getElementById('downloadWordBtn').addEventListener('click', handleDownloadWord);

  // 语言切换（中文 / English）
  document.querySelectorAll('#langToggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      state.lang = btn.dataset.lang;
      document.querySelectorAll('#langToggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (state.scenes.length) renderStoryboard();
    });
  });

  // 通义千问优化按钮（key 已内嵌，浏览器直连 DashScope，无需设置）
  document.getElementById('qwenBtn').addEventListener('click', openOptimizeDialog);
  // 优化方向弹窗
  document.getElementById('optDialogClose').addEventListener('click', closeOptimizeDialog);
  document.getElementById('optDialogCancel').addEventListener('click', closeOptimizeDialog);
  document.getElementById('optDialogOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'optDialogOverlay') closeOptimizeDialog();
  });
  document.getElementById('optDialogStart').addEventListener('click', () => {
    const direction = document.getElementById('optDirection').value.trim();
    closeOptimizeDialog();
    handleQwenOptimize(direction);
  });
  // 优化方向快捷标签（点击在文本框内切换）
  document.querySelectorAll('#optChips .opt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const dir = chip.dataset.dir;
      const ta = document.getElementById('optDirection');
      const cur = ta.value;
      if (cur.includes(dir)) {
        ta.value = cur.split(dir).join('').replace(/、{2,}/g, '、').replace(/^、+|、+$/g, '').trim();
        chip.classList.remove('active');
      } else {
        ta.value = (cur.trim() ? cur.trim() + '、' : '') + dir;
        chip.classList.add('active');
      }
    });
  });

  // 回到顶部按钮
  bindBackToTop();

  // 主动收藏（保存到历史）
  document.getElementById('saveHistoryBtn').addEventListener('click', () => {
    if (!state.scenes || !state.scenes.length) {
      showToast('请先生成提示词再收藏', 'warn');
      return;
    }
    addHistory({
      id: 'rec_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      time: new Date().toISOString(),
      formData: state.formData,
      scenes: state.scenes
    });
    showToast('✅ 已收藏，可在 📚历史 查看');
  });

  // 历史记录
  document.getElementById('historyBtn').addEventListener('click', openHistory);
  document.getElementById('historyClose').addEventListener('click', closeHistory);
  document.getElementById('historyClose2').addEventListener('click', closeHistory);
  document.getElementById('historyOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'historyOverlay') closeHistory();
  });
  document.getElementById('historyClear').addEventListener('click', () => {
    if (confirm('确定清空全部历史记录？此操作不可撤销。')) {
      clearHistory();
      renderHistoryList();
      showToast('已清空历史记录');
    }
  });
}

// ========== 生成模式（文生视频 / 图生视频）+ 参考图 ==========
// 参考图默认类型（按顺序轮换，仅作建议，用户可自行编辑）
const REF_TYPE_DEFAULTS = ['人物', '产品/设备', '场景'];
function getNextRefDefaultType() {
  const idx = state.referenceImages.length;
  return (idx >= 0 && idx < REF_TYPE_DEFAULTS.length) ? REF_TYPE_DEFAULTS[idx] : '参考';
}

function bindGenMode() {
  const grid = document.getElementById('genModeGrid');
  if (!grid) return;
  grid.querySelectorAll('.genmode-card').forEach(card => {
    card.addEventListener('click', () => {
      grid.querySelectorAll('.genmode-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.genMode = card.dataset.mode;
      const sec = document.getElementById('refImagesSection');
      if (sec) sec.style.display = state.genMode === 'i2v' ? 'block' : 'none';
      if (state.genMode === 'i2v' && state.referenceImages.length === 0) {
        state.referenceImages.push({ type: getNextRefDefaultType(), desc: '', scope: 'all' });
        renderRefImageRows();
      }
    });
  });

  const addBtn = document.getElementById('addRefImageBtn');
  if (addBtn) addBtn.addEventListener('click', () => {
    state.referenceImages.push({ type: getNextRefDefaultType(), desc: '', scope: 'all' });
    renderRefImageRows();
  });

  const list = document.getElementById('refImageList');
  if (list) {
    // 输入即时写入 state
    list.addEventListener('input', (e) => {
      const row = e.target.closest('.ref-row');
      if (!row) return;
      const idx = parseInt(row.dataset.idx, 10);
      const field = e.target.dataset.field;
      if (field === 'type') state.referenceImages[idx].type = e.target.value;
      else if (field === 'desc') state.referenceImages[idx].desc = e.target.value;
      else if (field === 'scope') state.referenceImages[idx].scope = (e.target.value === 'all') ? 'all' : parseInt(e.target.value, 10);
    });
    // 删除
    list.addEventListener('click', (e) => {
      if (e.target.classList.contains('ref-del')) {
        const idx = parseInt(e.target.dataset.idx, 10);
        state.referenceImages.splice(idx, 1);
        renderRefImageRows();
      }
    });
  }
}

function renderRefImageRows() {
  const list = document.getElementById('refImageList');
  if (!list) return;
  list.innerHTML = state.referenceImages.map((r, i) => {
    const idx = i + 1;
    const scopeOpts = '<option value="all"' + ((r.scope === 'all' || r.scope === undefined) ? ' selected' : '') + '>全部镜头</option>' +
      Array.from({ length: 12 }, (_, k) =>
        '<option value="' + k + '"' + (r.scope === k ? ' selected' : '') + '>仅镜头' + (k + 1) + '</option>'
      ).join('');
    return '<div class="ref-row" data-idx="' + i + '">' +
      '<div class="ref-idx">图' + idx + '</div>' +
      '<div class="ref-fields">' +
        '<input class="ref-type" data-field="type" value="' + escapeHtml(r.type || '') + '" placeholder="类型（默认建议，可改）">' +
        '<input class="ref-desc" data-field="desc" value="' + escapeHtml(r.desc || '') + '" placeholder="描述，如：主角，穿蓝色西装的中年男性">' +
        '<select class="ref-scope" data-field="scope">' + scopeOpts + '</select>' +
      '</div>' +
      '<button class="ref-del" data-idx="' + i + '" title="删除">✕</button>' +
    '</div>';
  }).join('');
}

// ========== 底部 H3 信息卡片点击展开/收起 ==========
function bindInfoCards() {
  document.querySelectorAll('.h3-info-card').forEach(card => {
    const toggle = (e) => {
      // 避免点链接或按钮冒泡误触
      if (e && e.target.tagName === 'A') return;
      const expanded = card.getAttribute('aria-expanded') === 'true';
      card.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      card.classList.toggle('expanded', !expanded);
      const tip = card.querySelector('.h3-info-toggle');
      if (tip) tip.textContent = !expanded ? '点击收起 ▴' : '点击展开 ▾';
    };
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle(e);
      }
    });
  });
}

// ========== 收集表单数据 ==========
function collectFormData() {
  return {
    videoType: state.selectedVideoType,
    industry: document.getElementById('industry').value,
    brandName: document.getElementById('brandName').value.trim(),
    productDesc: document.getElementById('productDesc').value.trim(),
    slogan: document.getElementById('slogan').value.trim(),
    style: state.selectedStyle,
    aspectRatio: state.selectedRatio,
    voiceoverText: document.getElementById('voiceoverText').value.trim(),
    audience: document.getElementById('audience').value.trim(),
    ctaText: document.getElementById('ctaText').value.trim(),
    sellingPoint1: document.getElementById('sellingPoint1').value.trim(),
    sellingPoint2: document.getElementById('sellingPoint2').value.trim(),
    sellingPoint3: document.getElementById('sellingPoint3').value.trim(),
    eventName: document.getElementById('eventName').value.trim(),
    eventDate: document.getElementById('eventDate').value.trim(),
    eventLocation: document.getElementById('eventLocation').value.trim(),
    genMode: state.genMode || 't2v',
    referenceImages: state.referenceImages || [],
    dialogue: (document.getElementById('dialogue') ? document.getElementById('dialogue').value : '') || '',
    totalDuration: parseInt((document.getElementById('totalDuration') && document.getElementById('totalDuration').value), 10) || 40
  };
}

// ========== 生成处理 ==========
function handleGenerate() {
  const formData = collectFormData();

  // 验证必填项
  if (!formData.brandName) {
    showToast('请填写企业/品牌名称', 'warn');
    document.getElementById('brandName').focus();
    return;
  }

  if (!formData.industry) {
    showToast('请选择行业领域', 'warn');
    document.getElementById('industry').focus();
    return;
  }

  // 按钮加载状态
  const btn = document.getElementById('generateBtn');
  btn.classList.add('loading');
  btn.querySelector('span').textContent = '生成中...';

  // 模拟异步生成（给UI一个渲染时机）
  setTimeout(() => {
    state.formData = formData;
    state.scenes = generateStoryboard(formData);
    renderStoryboard();
    btn.classList.remove('loading');
    btn.querySelector('span').textContent = '重新生成';
    // 自动保存为一条历史记录
    addHistory({
      id: 'rec_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      time: new Date().toISOString(),
      formData: formData,
      scenes: state.scenes
    });
    showToast('分镜脚本生成完成！已自动保存到历史（也可点 📌收藏 手动保存）');
  }, 600);
}

// ========== 渲染分镜 ==========
function renderStoryboard() {
  const lang = state.lang;
  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('storyboardContent').style.display = 'block';

  // 项目摘要
  renderProjectSummary();

  const scenes = state.scenes;
  const n = scenes.length;
  const total = scenes.reduce((s, x) => s + x.duration, 0);

  // 计算各镜头起始时间码
  const starts = [];
  let acc = 0;
  for (let i = 0; i < n; i++) { starts.push(acc); acc += scenes[i].duration; }

  // 构建整片六段式提示词（Full-Reference）—— 中英文双份
  const fullRefZh = buildFullReference(scenes, state.formData, 'zh');
  const fullRefEn = buildFullReference(scenes, state.formData, 'en');
  state.fullRefZh = fullRefZh;
  state.fullRefEn = fullRefEn;
  const zhEl = document.getElementById('fullRefZhContent');
  const enEl = document.getElementById('fullRefEnContent');
  if (zhEl) zhEl.textContent = fullRefZh;
  if (enEl) enEl.textContent = fullRefEn;
  const metaEl = document.getElementById('fullRefMeta');
  if (metaEl) {
    const minShot = Math.min.apply(null, scenes.map(s => s.duration));
    let warn = '';
    if (minShot < 4) {
      warn = ' · ⚠ H3 单段最少 4 秒，当前有镜头仅 ' + minShot + ' 秒，建议总时长≥' + (n * 4) + ' 秒，或在剪辑中裁剪/减少镜头数';
    }
    const modeLabel = (state.formData.genMode === 'i2v')
      ? ('图生视频 · ' + (state.formData.referenceImages ? state.formData.referenceImages.length : 0) + ' 张参考图')
      : '文生视频';
    metaEl.textContent = n + ' 个镜头 · 总时长 ' + total + ' 秒 · 画幅 ' + (state.formData.aspectRatio || '16:9') + ' · ' + modeLabel + warn;
  }

  // 场景数量
  document.getElementById('sceneCount').textContent = n + ' 个场景 · ' + total + '秒';

  // 场景列表
  const list = document.getElementById('sceneList');
  list.innerHTML = '';
  scenes.forEach((scene, index) => {
    list.appendChild(createSceneCard(scene, index, starts[index]));
  });
}

// ========== 渲染项目摘要 ==========
function renderProjectSummary() {
  const f = state.formData;
  const vt = VIDEO_TYPES[f.videoType];
  const ind = INDUSTRIES[f.industry];
  const st = STYLES[f.style];

  const summary = document.getElementById('projectSummary');
  summary.innerHTML = `
    <div class="summary-item"><span class="label">类型</span><span class="value">${vt.name}</span></div>
    <div class="divider"></div>
    <div class="summary-item"><span class="label">品牌</span><span class="value">${f.brandName}</span></div>
    <div class="divider"></div>
    <div class="summary-item"><span class="label">行业</span><span class="value">${ind?.name || '-'}</span></div>
    <div class="divider"></div>
    <div class="summary-item"><span class="label">风格</span><span class="value">${st?.name || '-'}</span></div>
    <div class="divider"></div>
    <div class="summary-item"><span class="label">画幅</span><span class="value">${f.aspectRatio}</span></div>
    ${f.slogan ? `<div class="divider"></div><div class="summary-item"><span class="label">Slogan</span><span class="value">${f.slogan}</span></div>` : ''}
  `;
}

// ========== 创建场景卡片 ==========
function createSceneCard(scene, index, startSec) {
  const card = document.createElement('div');
  card.className = 'scene-card';
  card.style.animationDelay = (index * 0.08) + 's';

  const lang = state.lang;
  const isZh = lang === 'zh';
  const langTag = isZh ? '（中文）' : '(English)';
  const timecodeLabel = index === 0 ? '0:00 起' : fmtTimecode(startSec) + ' 起';
  const refImages = (state.formData && state.formData.genMode === 'i2v' && Array.isArray(state.formData.referenceImages))
    ? state.formData.referenceImages : [];
  const refNote = refImages.length ? buildRefNoteForShot(refImages, index, isZh) : '';
  const shotBlock = buildShotBrief(scene, index, startSec, lang, refNote, refImages);

  card.innerHTML = `
    <div class="scene-header">
      <div class="scene-number">${index + 1}</div>
      <div class="scene-title">
        <div class="name">${scene.name}</div>
        <div class="nameEn">${scene.nameEn}</div>
      </div>
      <div class="scene-tags">
        <span class="scene-tag duration">${scene.duration}s</span>
        <span class="scene-tag timecode">${timecodeLabel}</span>
        <span class="scene-tag ratio">${scene.aspectRatio}</span>
        <span class="scene-tag shot">${scene.shotType}</span>
      </div>
    </div>
    <div class="scene-body">
      <div class="director-note">
        <span class="label">导演笔记</span>
        <span>${scene.directorNote}</span>
      </div>
      <div class="tech-grid">
        <div class="tech-item"><div class="t-label">运镜</div><div class="t-value">${scene.cameraMovement}</div></div>
        <div class="tech-item"><div class="t-label">光影</div><div class="t-value">${scene.lighting}</div></div>
        <div class="tech-item"><div class="t-label">色彩</div><div class="t-value">${scene.colorGrading}</div></div>
        <div class="tech-item"><div class="t-label">画面文字</div><div class="t-value">${scene.textOverlay ? '有' : '无'}</div></div>
      </div>
      ${scene.dialogueLine ? `<div class="dialogue-box"><span class="label">台词 / 配音</span><span class="dialogue-text">${escapeHtml(scene.dialogueLine)}</span></div>` : ''}
      <div class="prompt-section">
        <div class="prompt-label">
          <span class="pname"><span class="dot" style="background:var(--accent)"></span>直投提示词 [Shot ${index + 1}] ${langTag}（可直接粘贴到海螺 H3）</span>
          <button class="btn-copy" data-copy="${index}-shot">复制本镜头</button>
        </div>
        <div class="prompt-content">${escapeHtml(shotBlock)}</div>
      </div>
    </div>
  `;

  card.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const [sceneIdx, field] = btn.dataset.copy.split('-');
      let text = '';
      if (field === 'shot') text = shotBlock;
      copyToClipboard(text, btn);
    });
  });

  return card;
}

// ========== 复制全部提示词 ==========
function handleCopyAll() {
  if (!state.scenes.length) return;
  const combined = (state.fullRefZh || '') + '\n\n========== English ==========\n\n' + (state.fullRefEn || '');
  copyToClipboard(combined);
}

// ========== 导出 Word ==========
function handleExportWord() {
  if (!state.scenes.length) return;
  const html = exportToWord(state.scenes, state.formData);
  // 在 iframe 里渲染预览（所见即所得）
  const iframe = document.getElementById('wordPreview');
  iframe.srcdoc = html;
  // 同时把 HTML 存到 dataset，供下载 / 复制使用
  iframe.dataset.html = html;
  document.getElementById('modalOverlay').classList.add('show');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}

// ========== 下载 Word 文件（HTML-as-.doc，零依赖，Word/WPS 直接打开） ==========
function handleDownloadWord() {
  const html = document.getElementById('wordPreview').dataset.html || '';
  if (!html) return;
  const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `H3_${state.formData.videoType}_${state.formData.brandName || 'storyboard'}_分镜脚本.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Word 文件已下载');
}

// ========== 复制到剪贴板 ==========
function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = '✓ 已复制';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('copied');
      }, 2000);
    } else {
      showToast('已复制到剪贴板');
    }
  }).catch(() => {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    if (btn) {
      btn.textContent = '✓ 已复制';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = '复制';
        btn.classList.remove('copied');
      }, 2000);
    } else {
      showToast('已复制到剪贴板');
    }
  });
}

// ========== Toast提示 ==========
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const text = document.getElementById('toastText');
  text.textContent = message;

  if (type === 'warn') {
    toast.style.borderColor = 'var(--accent)';
    toast.style.color = 'var(--accent-bright)';
  } else {
    toast.style.borderColor = 'var(--green)';
    toast.style.color = 'var(--green)';
  }

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ========== HTML转义 ==========
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ========== 启动 ==========
init();

// ========== 通义千问 API（直接浏览器→DashScope） ==========
// 阿里云百炼 DashScope 的 OpenAI 兼容端点开放 CORS（access-control-allow-origin: *），
// 因此无需任何后端代理，把 key 内嵌到静态页里就行。
// 注意：任何人查看页面源码都能拿到这个 key，请把它视作"团队共享 token"。

const QWEN_CONFIG = {
  apiKey: 'sk-ws-H.ERYMXDH.iPtV.MEUCIQDU8gDQ5vzO68S-mNeQTrciFNeSr5L1fe4oLan1VCpvhwIgYMgRTYzt3gsUVB9KTQfAY4FOAJUjSawUjYJg9VZHTNg',
  model: 'qwen-plus',
  endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
};

async function callQwen(system, user) {
  const resp = await fetch(QWEN_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + QWEN_CONFIG.apiKey
    },
    body: JSON.stringify({
      model: QWEN_CONFIG.model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    })
  });
  if (!resp.ok) {
    let msg = 'HTTP ' + resp.status;
    try {
      const e = await resp.json();
      if (e && e.error && e.error.message) msg = e.error.message;
    } catch (_) {}
    throw new Error(msg);
  }
  const data = await resp.json();
  if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
    return data.choices[0].message.content;
  }
  if (data && data.error && data.error.message) throw new Error(data.error.message);
  throw new Error('返回格式无法解析');
}

// 从通义千问回复中解析 H3 三字段提示词
function parseH3Reply(text) {
  if (!text) return null;
  const get = (key) => {
    const re = new RegExp(key + '\\s*:\\s*([\\s\\S]*?)(?=\\n\\s*(?:integrated_multimodal_description|overall_soundscape|non_diegetic_music)\\s*:|$)', 'i');
    const m = text.match(re);
    return m ? m[1].trim() : '';
  };
  const visual = get('integrated_multimodal_description');
  const soundscape = get('overall_soundscape');
  const music = get('non_diegetic_music');
  if (!visual && !soundscape && !music) return null;
  return { visual: visual || '', soundscape: soundscape || '', music: music || '' };
}

// ========== 优化提示词方向弹窗 + 软计数 ==========
const OPTIMIZE_COUNT_KEY = 'h3_optimize_count';

function getOptimizeCount() {
  const n = parseInt(localStorage.getItem(OPTIMIZE_COUNT_KEY) || '0', 10);
  return isNaN(n) ? 0 : n;
}

function updateOptCountUI(n) {
  const a = document.getElementById('optCount');
  const b = document.getElementById('optCountInline');
  const text = '已优化 ' + n + ' 次';
  if (a) a.textContent = text;
  if (b) b.textContent = text;
}

function bumpOptimizeCount() {
  const n = getOptimizeCount() + 1;
  localStorage.setItem(OPTIMIZE_COUNT_KEY, String(n));
  updateOptCountUI(n);
  return n;
}

function openOptimizeDialog() {
  if (!state.scenes.length) {
    showToast('请先生成提示词', 'warn');
    return;
  }
  // 重置输入与标签状态
  const ta = document.getElementById('optDirection');
  ta.value = '';
  document.querySelectorAll('#optChips .opt-chip').forEach(c => c.classList.remove('active'));
  updateOptCountUI(getOptimizeCount());
  document.getElementById('optDialogOverlay').classList.add('show');
  setTimeout(() => ta.focus(), 50);
}

function closeOptimizeDialog() {
  document.getElementById('optDialogOverlay').classList.remove('show');
}

// 用通义千问把中文提示词润色为更地道的英文 H3 提示词
async function handleQwenOptimize(direction) {
  if (!state.scenes.length) {
    showToast('请先生成提示词', 'warn');
    return;
  }

  const btn = document.getElementById('qwenBtn');
  const original = btn.innerHTML;
  btn.classList.add('loading');
  btn.disabled = true;
  btn.innerHTML = '✨ 优化中...';

  let system = '你是 MiniMax H3 视频提示词专家，严格遵循官方 H3 Prompt Writing Guide。请把用户的中文 H3 提示词改写为地道、专业的英文提示词，并保留三字段结构。\n\n【强制格式规则】\n1. 字段顺序固定为 integrated_multimodal_description → overall_soundscape → non_diegetic_music，每段一字段、段间空一行，不要输出任何多余说明文字或 Markdown。\n2. integrated_multimodal_description 以 [Shot 1] 开头描述起始风格与构图；如需多镜头，后续用 [Shot 2] At 00:03.500, 这样的时间码（MM:SS.mmm，落在视频时长内）标记切镜；普通切镜用 the camera cuts to / the shot transitions to。\n3. 运镜写成自然英文动作，包含「运动类型 + 幅度 + 速度」三维度，例如 The camera pushes in with small amplitude at slow speed；幅度/速度仅在有意义时加（中幅度、常速通常省略）。\n4. 说话人用稳定 ID 如 (S1) / (S2)；对白与歌词用 <d>[English] ... </d> 包裹并原文照抄不翻译；画外音注明 says in an off-screen voiceover 并说明对应角色嘴唇闭合。\n5. 屏幕上真实可见的文字（标语/招牌/字幕）用英文双引号包裹，原文照抄不翻译。\n6. overall_soundscape：用 1–4 句英文概括全片环境声、物理动作声、非语言人声（风/雨/脚步/布料/呼吸/笑声等）；对话与剧情音已在前字段，不要重复；整片完全静音才用 N/A。\n7. non_diegetic_music：用 1–3 句英文描述只有观众能听到、角色听不到的配乐，聚焦乐器、速度、节奏与动态变化；不要用抽象情绪词，也不要解释音乐的情绪功能；无配乐用 N/A。';

  // 水疗养生行业：追加「调理不治疗」合规铁律，约束千问优化输出
  if (state.formData.industry === 'hydro') {
    system += '\n\n【本片合规铁律·水疗养生类】\n- 仅可用「调理、舒缓、温通、促进气血运行、放松筋骨、帮助维持平衡」等温和表述；\n- 严禁出现「治疗、治愈、医治、根治、防病、抗癌、消炎、替代药物、医疗功效」等任何医疗宣称或疗效承诺；\n- 不可暗示可预防、诊断或治疗任何疾病；如涉及注意事项，仅可沿用「本品不能代替药物；孕妇、儿童及重大疾病者慎用」等安全提示。';
  }

  // 若用户填了方向，拼进 user 提示词引导千问
  const directionSuffix = (direction && direction.trim())
    ? ('\n\n优化方向（请据此调整风格与侧重）：' + direction.trim())
    : '';

  let okCount = 0;
  try {
    for (let i = 0; i < state.scenes.length; i++) {
      const scene = state.scenes[i];
      btn.innerHTML = '✨ 优化中 ' + (i + 1) + '/' + state.scenes.length + '...';
      const user = '请把以下中文 H3 提示词翻译并润色为英文，保持三字段格式：\n\n' + scene.promptZh + directionSuffix;
      const reply = await callQwen(system, user);
      const parsed = parseH3Reply(reply);
      if (parsed) {
        scene.visualEn = parsed.visual;
        scene.soundscapeEn = parsed.soundscape;
        scene.musicEn = parsed.music;
        scene.promptEn = `integrated_multimodal_description: ${parsed.visual}\n\noverall_soundscape: ${parsed.soundscape}\n\nnon_diegetic_music: ${parsed.music}`;
        okCount++;
      }
    }
    renderStoryboard();
    if (okCount === state.scenes.length) {
      // 软计数：每次成功优化整体 +1（注意：纯前端计数，清 localStorage 即可重置，仅作提示用）
      bumpOptimizeCount();
      showToast('✨ 通义千问已优化全部 ' + state.scenes.length + ' 个场景');
    } else {
      showToast('✨ 已优化 ' + okCount + '/' + state.scenes.length + ' 个场景', 'warn');
    }
  } catch (e) {
    showToast('通义千问调用失败：' + (e.message || e), 'warn');
  } finally {
    btn.classList.remove('loading');
    btn.disabled = false;
    btn.innerHTML = original;
  }
}

// ========== 回到顶部按钮 ==========
function bindBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;
  // 节流：每 100ms 检查一次滚动位置
  let ticking = false;
  const check = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const threshold = Math.min(350, document.documentElement.scrollHeight * 0.3);
      if (window.scrollY > threshold) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
      ticking = false;
    });
  };
  window.addEventListener('scroll', check, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  // 初次进入页面时也要判断（比如刷新在底部）
  check();
}

// ========== 生成历史（浏览器本地存储） ==========
const HISTORY_KEY = 'h3_history_records';
const HISTORY_MAX = 50; // 最多保留 50 条，防止 localStorage 撑爆

function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    }
  } catch (e) { /* 解析失败当作空 */ }
  return [];
}

function setHistory(list) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch (e) {
    showToast('本地存储已满，无法保存更多历史', 'warn');
  }
}

function addHistory(record) {
  const list = getHistory();
  // 去掉循环引用：deep copy 后只保留需要的字段
  const safe = {
    id: record.id,
    time: record.time,
    formData: {
      videoType: record.formData.videoType,
      industry: record.formData.industry,
      brandName: record.formData.brandName,
      style: record.formData.style,
      ratio: record.formData.ratio,
      duration: record.formData.duration,
      coreMessage: record.formData.coreMessage,
      targetAudience: record.formData.targetAudience,
      genMode: record.formData.genMode,
      referenceImages: record.formData.referenceImages,
      dialogue: record.formData.dialogue
    },
    scenes: record.scenes.map(s => ({ ...s }))
  };
  list.unshift(safe);
  if (list.length > HISTORY_MAX) list.length = HISTORY_MAX;
  setHistory(list);
}

function removeHistory(id) {
  const list = getHistory().filter(r => r.id !== id);
  setHistory(list);
}

function clearHistory() {
  setHistory([]);
}

function openHistory() {
  renderHistoryList();
  document.getElementById('historyOverlay').classList.add('show');
}

function closeHistory() {
  document.getElementById('historyOverlay').classList.remove('show');
}

function formatTime(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso || '';
  const pad = n => (n < 10 ? '0' + n : n);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
    + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function getTypeName(key) {
  return (typeof VIDEO_TYPES !== 'undefined' && VIDEO_TYPES[key] && VIDEO_TYPES[key].name) || key;
}
function getStyleName(key) {
  return (typeof STYLES !== 'undefined' && STYLES[key] && STYLES[key].name) || key;
}
function getIndustryName(key) {
  return (typeof INDUSTRIES !== 'undefined' && INDUSTRIES[key] && INDUSTRIES[key].name) || key;
}

function renderHistoryList() {
  const list = getHistory();
  const wrap = document.getElementById('historyList');
  if (!list.length) {
    wrap.innerHTML = '<div class="history-empty">📭 暂无历史记录<br><span>生成提示词后会自动保存，或点操作栏的 📌收藏 主动保存</span></div>';
    return;
  }
  wrap.innerHTML = list.map(r => {
    const title = (r.formData && r.formData.brandName) || (r.formData && r.formData.coreMessage) || '未命名项目';
    const meta = [
      getTypeName(r.formData && r.formData.videoType),
      getIndustryName(r.formData && r.formData.industry),
      getStyleName(r.formData && r.formData.style)
    ].filter(Boolean).join(' · ');
    return '<div class="history-item" data-id="' + r.id + '">' +
      '<div class="history-item-head">' +
        '<div class="history-item-title">' + escapeHtml(title) + '</div>' +
        '<div class="history-item-time">' + formatTime(r.time) + '</div>' +
      '</div>' +
      '<div class="history-item-meta">' + escapeHtml(meta) + ' · ' + (r.scenes ? r.scenes.length : 0) + ' 个场景</div>' +
      '<div class="history-item-actions">' +
        '<button class="btn-ghost" data-action="load" data-id="' + r.id + '">📂 加载</button>' +
        '<button class="btn-ghost" data-action="delete" data-id="' + r.id + '">🗑 删除</button>' +
      '</div>' +
    '</div>';
  }).join('');
  // 事件委托：加载/删除
  wrap.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === 'load') {
        loadHistoryRecord(id);
        closeHistory();
      } else if (action === 'delete') {
        removeHistory(id);
        renderHistoryList();
        showToast('已删除一条记录');
      }
    });
  });
}

function loadHistoryRecord(id) {
  const rec = getHistory().find(r => r.id === id);
  if (!rec) {
    showToast('记录不存在或已被删除', 'warn');
    return;
  }
  // 恢复表单与分镜
  state.formData = rec.formData;
  state.scenes = rec.scenes;
  // 同步左侧表单 UI
  if (rec.formData) {
    state.selectedVideoType = rec.formData.videoType || state.selectedVideoType;
    document.getElementById('industry').value = rec.formData.industry || '';
    document.getElementById('brandName').value = rec.formData.brandName || '';
    document.getElementById('style').value = rec.formData.style || '';
    document.getElementById('ratio').value = rec.formData.ratio || '';
    document.getElementById('duration').value = rec.formData.duration || '';
    document.getElementById('coreMessage').value = rec.formData.coreMessage || '';
    document.getElementById('targetAudience').value = rec.formData.targetAudience || '';
    // 恢复生成模式与参考图
    state.genMode = rec.formData.genMode || 't2v';
    state.referenceImages = Array.isArray(rec.formData.referenceImages) ? rec.formData.referenceImages.map(r => ({ ...r })) : [];
    document.querySelectorAll('#genModeGrid .genmode-card').forEach(c => c.classList.toggle('active', c.dataset.mode === state.genMode));
    const refSec = document.getElementById('refImagesSection');
    if (refSec) refSec.style.display = state.genMode === 'i2v' ? 'block' : 'none';
    renderRefImageRows();
    // 重新渲染网格高亮
    renderVideoTypes();
    renderIndustries();
    renderStyles();
    renderRatios();
    const dlgEl = document.getElementById('dialogue');
    if (dlgEl) dlgEl.value = rec.formData.dialogue || '';
  }
  renderStoryboard();
  // 滚到顶部看效果
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast('已加载历史记录：' + ((rec.formData && rec.formData.brandName) || '未命名项目'));
}

// HTML 转义，防止用户输入的主题/标题里出现 < > & 破坏弹窗
function escapeHtml(s) {
  if (s === undefined || s === null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
