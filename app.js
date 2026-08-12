/**
 * H3 AI 视频提示词工坊 - 应用逻辑
 */

// ========== 应用状态 ==========
const state = {
  selectedVideoType: 'corporate',
  selectedIndustry: '',
  selectedStyle: 'cinematic',
  marketingStyle: 'none', // 'none' | 'xiaohongshu' | 'douyin' —— 营销优化层（小红书/抖音种草）
  flow: 'auto', // 'auto' 通用 | 'wen' 文戏 | 'action' 武戏 | 'grid' 九宫格（贴合 H3 三流程总模板）
  relationFrom: '', relationTo: '', coreProp: '', dialogueLang: '中文', // 文戏专属
  opponent: '', equipBound: '', // 武戏专属
  story: '', gridCells: [], // 九宫格专属
  selectedRatio: '16:9',
  shotDur: 15, // 单镜头时长（5 / 10 / 15 秒）
  genMode: 't2v', // 't2v' 文生视频 | 'i2v' 图生视频
  referenceImages: [], // [{ type, desc, scope:'all'|number }]
  scenes: [],
  formData: {},
  fullRefZh: '',
  fullRefEn: '',
  lang: 'en', // 'zh' | 'en'  默认英文 —— H3 主要识别英文，用户点「中文」切换查看
  productFlow: { preset: 'standard', steps: PRODUCT_FLOW_PRESETS.standard.steps.slice() }
};

// ========== 初始化 ==========
function init() {
  renderVideoTypes();
  onVideoTypeChange();
  renderIndustries();
  renderStyles();
  renderMarketingStyles();
  renderRatios();
  renderDurations();
  // 同步语言切换高亮
  document.querySelectorAll('#langToggle button').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === state.lang);
  });
  bindEvents();
  bindGenMode();
  bindFlowSelector();
  applyFlowUI(state.flow);
  bindInfoCards();
  // 主题切换初始化（恢复已选主题 + 绑定切换面板）
  initTheme();
  // 初始化优化次数显示
  updateOptCountUI(getOptimizeCount());
}

// ========== 通用点击展开选择器 ==========
function makeFieldSelect(mountId, opts) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  const items = opts.items;
  const activeItem = items.find(i => i.value === opts.activeValue) || items[0];
  mount.className = 'field-select';
  mount.innerHTML =
    '<button type="button" class="field-select-trigger" aria-expanded="false">' +
      (activeItem.icon ? '<span class="fs-trigger-icon">' + activeItem.icon + '</span>' : '') +
      '<span class="fs-trigger-text">' +
        '<span class="fs-trigger-label"></span>' +
        (activeItem.desc ? '<span class="fs-trigger-desc"></span>' : '') +
      '</span>' +
      '<span class="fs-trigger-chevron">▾</span>' +
    '</button>' +
    '<div class="field-select-panel">' +
      items.map(i =>
        '<button type="button" class="fs-option ' + (i.value === opts.activeValue ? 'active' : '') + '" data-value="' + i.value + '">' +
          (i.icon ? '<span class="fs-opt-icon">' + i.icon + '</span>' : '') +
          '<span class="fs-opt-text">' +
            '<span class="fs-opt-name"></span>' +
            (i.desc ? '<span class="fs-opt-desc"></span>' : '') +
          '</span>' +
          (i.extra ? '<span class="fs-opt-extra"></span>' : '') +
          '<span class="fs-opt-check">✓</span>' +
        '</button>'
      ).join('') +
    '</div>';

  // 填充文本（避免 innerHTML 注入风险）
  const trigger = mount.querySelector('.field-select-trigger');
  const panel = mount.querySelector('.field-select-panel');
  mount.querySelector('.fs-trigger-label').textContent = activeItem.name;
  if (activeItem.desc) mount.querySelector('.fs-trigger-desc').textContent = activeItem.desc;
  panel.querySelectorAll('.fs-option').forEach((opt, idx) => {
    const item = items[idx];
    opt.querySelector('.fs-opt-name').textContent = item.name;
    if (item.desc) opt.querySelector('.fs-opt-desc').textContent = item.desc;
    if (item.extra) opt.querySelector('.fs-opt-extra').textContent = item.extra;
  });

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = mount.classList.toggle('open');
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      document.querySelectorAll('.field-select.open').forEach(f => {
        if (f !== mount) {
          f.classList.remove('open');
          const t = f.querySelector('.field-select-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  panel.querySelectorAll('.fs-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = opt.dataset.value;
      panel.querySelectorAll('.fs-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const item = items.find(i => String(i.value) === String(val));
      const iconEl = mount.querySelector('.fs-trigger-icon');
      const labelEl = mount.querySelector('.fs-trigger-label');
      const descEl = mount.querySelector('.fs-trigger-desc');
      if (iconEl) iconEl.textContent = item.icon || '';
      if (labelEl) labelEl.textContent = item.name;
      if (descEl) descEl.textContent = item.desc || '';
      mount.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      if (typeof opts.onSelect === 'function') opts.onSelect(val);
    });
  });
}

// 点击空白处关闭所有展开的选择器
document.addEventListener('click', () => {
  document.querySelectorAll('.field-select.open').forEach(f => {
    f.classList.remove('open');
    const t = f.querySelector('.field-select-trigger');
    if (t) t.setAttribute('aria-expanded', 'false');
  });
});

// ========== 渲染视频类型 ==========
function renderVideoTypes() {
  const items = Object.entries(VIDEO_TYPES).map(([key, t]) => ({
    value: key, icon: t.icon, name: t.name, desc: t.desc
  }));
  makeFieldSelect('videoTypeField', {
    items,
    activeValue: state.selectedVideoType,
    onSelect: (val) => { state.selectedVideoType = val; onVideoTypeChange(); }
  });
}

// ========== 产品广告流程面板 ==========
function renderFlowSection() {
  const presetWrap = document.getElementById('flowPresets');
  const stepsWrap = document.getElementById('flowSteps');
  const tip = document.getElementById('flowTip');
  if (!presetWrap || !stepsWrap) return;

  // 预设按钮
  presetWrap.innerHTML = Object.entries(PRODUCT_FLOW_PRESETS).map(function (entry) {
    const id = entry[0], p = entry[1];
    return `<button type="button" class="flow-preset-btn ${state.productFlow.preset === id ? 'active' : ''}" data-preset="${id}" title="${p.desc}">${p.name}</button>`;
  }).join('');

  // 步骤列表：已选在前（按当前顺序），未选在后
  const steps = state.productFlow.steps;
  stepsWrap.innerHTML = PRODUCT_FLOW_STEP_ORDER.map(function (id) {
    const step = PRODUCT_FLOW_STEPS[id];
    if (!step) return '';
    const idx = steps.indexOf(id);
    const selected = idx !== -1;
    const isFirst = idx <= 0;
    const isLast = idx === steps.length - 1;
    return `<div class="flow-step-row ${selected ? 'selected' : ''}">
      <label class="flow-step-label">
        <input type="checkbox" data-step="${id}" ${selected ? 'checked' : ''}>
        <span class="fs-name">${step.name}</span>
        <span class="fs-name-en">${step.nameEn}</span>
      </label>
      <div class="flow-step-actions">
        <button type="button" class="fs-btn" data-up="${id}" ${!selected || isFirst ? 'disabled' : ''} title="上移">↑</button>
        <button type="button" class="fs-btn" data-down="${id}" ${!selected || isLast ? 'disabled' : ''} title="下移">↓</button>
      </div>
    </div>`;
  }).join('');

  if (tip) {
    const names = steps.map(function (id) { return (PRODUCT_FLOW_STEPS[id] || {}).name || id; });
    tip.textContent = names.length ? ('当前流程：' + names.join(' → ')) : '请至少勾选一个环节';
  }

  // 绑定预设按钮
  presetWrap.querySelectorAll('.flow-preset-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const id = btn.dataset.preset;
      state.productFlow.preset = id;
      state.productFlow.steps = (PRODUCT_FLOW_PRESETS[id].steps || []).slice();
      renderFlowSection();
    });
  });
  // 绑定勾选
  stepsWrap.querySelectorAll('input[data-step]').forEach(function (cb) {
    cb.addEventListener('change', function () {
      const id = cb.dataset.step;
      const arr = state.productFlow.steps;
      const i = arr.indexOf(id);
      if (cb.checked && i === -1) { arr.push(id); state.productFlow.preset = 'custom'; }
      else if (!cb.checked && i !== -1) { arr.splice(i, 1); state.productFlow.preset = 'custom'; }
      renderFlowSection();
    });
  });
  // 绑定上移 / 下移
  stepsWrap.querySelectorAll('button[data-up]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const id = btn.dataset.up;
      const arr = state.productFlow.steps;
      const i = arr.indexOf(id);
      if (i > 0) { const t = arr[i - 1]; arr[i - 1] = arr[i]; arr[i] = t; state.productFlow.preset = 'custom'; }
      renderFlowSection();
    });
  });
  stepsWrap.querySelectorAll('button[data-down]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const id = btn.dataset.down;
      const arr = state.productFlow.steps;
      const i = arr.indexOf(id);
      if (i !== -1 && i < arr.length - 1) { const t = arr[i + 1]; arr[i + 1] = arr[i]; arr[i] = t; state.productFlow.preset = 'custom'; }
      renderFlowSection();
    });
  });
}

// 视频类型切换：产品广告显示流程面板并隐藏"镜头数量"，其它类型反之
function onVideoTypeChange() {
  const isProduct = state.selectedVideoType === 'product';
  const flowSec = document.getElementById('flowSection');
  const shotGroup = document.getElementById('shotCountGroup');
  if (flowSec) flowSec.style.display = isProduct ? 'block' : 'none';
  if (shotGroup) shotGroup.style.display = isProduct ? 'none' : 'block';
  if (isProduct && (!state.productFlow || !state.productFlow.steps.length)) {
    state.productFlow = { preset: 'standard', steps: PRODUCT_FLOW_PRESETS.standard.steps.slice() };
  }
  if (isProduct) renderFlowSection();
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
  const items = Object.entries(STYLES).map(([key, s]) => ({
    value: key, name: s.name, desc: s.nameEn
  }));
  makeFieldSelect('styleField', {
    items,
    activeValue: state.selectedStyle,
    onSelect: (val) => { state.selectedStyle = val; }
  });
}

// ========== 渲染营销优化（小红书/抖音种草）==========
function renderMarketingStyles() {
  const items = Object.entries(MARKETING_STYLES).map(([key, m]) => ({
    value: key, name: m.name, desc: m.nameEn
  }));
  makeFieldSelect('marketingField', {
    items,
    activeValue: state.marketingStyle,
    onSelect: (val) => { state.marketingStyle = val; }
  });
}

// ========== 渲染画幅 ==========
function renderRatios() {
  const items = Object.entries(ASPECT_RATIOS).map(([key, r]) => ({
    value: key, name: key, desc: r.desc, extra: r.pixels
  }));
  makeFieldSelect('ratioField', {
    items,
    activeValue: state.selectedRatio,
    onSelect: (val) => { state.selectedRatio = val; }
  });
}

// 单镜头时长选择（5 / 10 / 15 秒）
function renderDurations() {
  const items = [
    { value: 5, name: '5 秒', desc: '短镜头，适合快节奏 / 信息密集' },
    { value: 10, name: '10 秒', desc: '适中，平衡信息与节奏' },
    { value: 15, name: '15 秒（推荐）', desc: 'H3 单次生成上限，内容最完整' }
  ];
  makeFieldSelect('durationField', {
    items,
    activeValue: state.shotDur,
    onSelect: (val) => { state.shotDur = parseInt(val, 10); }
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

  // H3 说明书折叠手风琴（侧边栏底部）
  const helpDrawerToggle = document.getElementById('helpDrawerToggle');
  const helpDrawerBody = document.getElementById('helpDrawerBody');
  if (helpDrawerToggle && helpDrawerBody) {
    // 恢复上次展开状态
    const helpOpen = sessionStorage.getItem('h3_help_open') === 'true';
    if (helpOpen) {
      helpDrawerToggle.setAttribute('aria-expanded', 'true');
      helpDrawerBody.classList.add('open');
    }
    helpDrawerToggle.addEventListener('click', () => {
      const isOpen = helpDrawerToggle.getAttribute('aria-expanded') === 'true';
      helpDrawerToggle.setAttribute('aria-expanded', String(!isOpen));
      helpDrawerBody.classList.toggle('open', !isOpen);
      sessionStorage.setItem('h3_help_open', String(!isOpen));
    });
    // 手风琴条目
    document.querySelectorAll('.help-item-head').forEach(head => {
      head.addEventListener('click', () => {
        const item = head.closest('.help-item');
        const wasActive = item.classList.contains('active');
        // 关闭同层其他条目
        item.closest('.help-accordion').querySelectorAll('.help-item').forEach(i => i.classList.remove('active'));
        if (!wasActive) item.classList.add('active');
      });
    });
  }

  // 生成按钮
  document.getElementById('generateBtn').addEventListener('click', handleGenerate);

  // 本地重新生成（保持预选条件不变，仅调用本地资料库，不消耗千问 token）
  const regenBtn = document.getElementById('regenBtn');
  if (regenBtn) regenBtn.addEventListener('click', regeneratePrompts);

  // 导出按钮
  document.getElementById('copyAllBtn').addEventListener('click', handleCopyAll);
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
  document.getElementById('qwenBtn').addEventListener('click', () => {
    try {
      openOptimizeDialog();
    } catch(e) {
      console.error('[H3] 打开优化弹窗失败:', e);
      showToast('打开优化弹窗失败：' + (e.message || '未知错误'), 'warn');
    }
  });
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
    try {
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
    } catch(e) {
      console.error('[H3] 收藏失败:', e);
      showToast('收藏失败：' + (e.message || '未知错误'), 'warn');
    }
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
      // 注意：图生视频不再强制预选参考图——生成后系统按每个镜头自动设计「本镜头参考图清单」，
      // 用户按需上传即可；如需统一的品牌/产品主图全程复用，可在此可选添加（scope 全为「全部镜头」）。
    });
  });

  // 参考图添加/删除/编辑事件
  const addBtn = document.getElementById('addRefImageBtn');
  if (addBtn) addBtn.addEventListener('click', () => {
    state.referenceImages.push({ type: getNextRefDefaultType(), desc: '', scope: 'all' });
    renderRefImageRows();
  });

  const list = document.getElementById('refImageList');
  if (list) {
    list.addEventListener('input', (e) => {
      const row = e.target.closest('.ref-row');
      if (!row) return;
      const idx = parseInt(row.dataset.idx, 10);
      const field = e.target.dataset.field;
      if (field === 'type') state.referenceImages[idx].type = e.target.value;
      else if (field === 'desc') state.referenceImages[idx].desc = e.target.value;
      else if (field === 'scope') state.referenceImages[idx].scope = (e.target.value === 'all') ? 'all' : parseInt(e.target.value, 10);
    });
    list.addEventListener('click', (e) => {
      if (e.target.classList.contains('ref-del')) {
        const idx = parseInt(e.target.dataset.idx, 10);
        state.referenceImages.splice(idx, 1);
        renderRefImageRows();
      }
    });
  }
}

function bindFlowSelector() {
  const grid = document.getElementById('flowGrid');
  if (!grid) return;
  grid.querySelectorAll('.genmode-card').forEach(card => {
    card.addEventListener('click', () => {
      applyFlowUI(card.dataset.flow);
    });
  });
}

// 统一设置流程并同步 UI（卡片高亮 + 专属面板 + 九宫格输入框）
function applyFlowUI(flow) {
  state.flow = flow || 'auto';
  const grid = document.getElementById('flowGrid');
  if (grid) grid.querySelectorAll('.genmode-card').forEach(c => c.classList.toggle('active', c.dataset.flow === state.flow));
  updateFlowPanels();
}

function updateFlowPanels() {
  const f = state.flow || 'auto';
  const map = { wen: 'wenPanel', action: 'actionPanel', grid: 'gridPanel' };
  ['wenPanel', 'actionPanel', 'gridPanel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (map[f] === id) ? 'block' : 'none';
  });
  if (f === 'grid') renderGridCells();
}

function renderGridCells() {
  const mount = document.getElementById('gridCells');
  if (!mount) return;
  const labels = ['①建立', '②触发', '③升级', '④第一次变化', '⑤中段', '⑥第二次升级', '⑦高潮', '⑧接近完成', '⑨最终画面'];
  mount.innerHTML = labels.map((lb, i) => {
    const val = (Array.isArray(state.gridCells) && state.gridCells[i]) ? state.gridCells[i] : '';
    return '<div class="grid-cell"><span class="gc-label">' + lb + '</span><input type="text" data-gc="' + i + '" value="' + escapeHtml(val) + '" placeholder="第' + (i + 1) + '格画面描述"></div>';
  }).join('');
  mount.querySelectorAll('input[data-gc]').forEach(inp => {
    inp.addEventListener('input', () => {
      const i = parseInt(inp.dataset.gc, 10);
      state.gridCells[i] = inp.value;
    });
  });
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
    flowSteps: (state.productFlow ? state.productFlow.steps.slice() : []),
    industry: document.getElementById('industry').value,
    brandName: document.getElementById('brandName').value.trim(),
    productDesc: document.getElementById('productDesc').value.trim(),
    slogan: document.getElementById('slogan').value.trim(),
    style: state.selectedStyle,
    marketingStyle: state.marketingStyle,
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
    shotCount: parseInt((document.getElementById('shotCount') && document.getElementById('shotCount').value), 10) || 5,
    shotDur: state.shotDur || 15,
    flow: state.flow || 'auto',
    relationFrom: (document.getElementById('relationFrom') ? document.getElementById('relationFrom').value.trim() : '') || '',
    relationTo: (document.getElementById('relationTo') ? document.getElementById('relationTo').value.trim() : '') || '',
    coreProp: (document.getElementById('coreProp') ? document.getElementById('coreProp').value.trim() : '') || '',
    dialogueLang: (document.getElementById('dialogueLang') ? document.getElementById('dialogueLang').value : '中文') || '中文',
    opponent: (document.getElementById('opponent') ? document.getElementById('opponent').value.trim() : '') || '',
    equipBound: (document.getElementById('equipBound') ? document.getElementById('equipBound').value.trim() : '') || '',
    story: (document.getElementById('story') ? document.getElementById('story').value.trim() : '') || '',
    gridCells: (Array.isArray(state.gridCells) ? state.gridCells.slice() : [])
  };
}

// ========== 生成处理 ==========
function handleGenerate() {
  const formData = collectFormData();

  // 验证必填项（企业/品牌名称已改为选填：填了会用于画面文字与画外音宣传，不填则围绕其他选项生成）
  if (!formData.industry) {
    showToast('请选择行业领域', 'warn');
    document.getElementById('industry').focus();
    return;
  }

  // 校验：添加了参考图却仍是「文生视频」模式 → 图片不会被写进提示词、海螺也不会参考
  if (formData.genMode !== 'i2v' && Array.isArray(formData.referenceImages) && formData.referenceImages.length > 0) {
    showToast('⚠️ 你添加了 ' + formData.referenceImages.length + ' 张参考图，但当前是「文生视频」模式，图片不会被使用。请先把生成模式切到「图生视频」，并在海螺 H3 里按相同顺序上传这些图。', 'warn');
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
    btn.querySelector('span').textContent = '🎬 再次生成';
    // 自动保存为一条历史记录
    try {
      addHistory({
        id: 'rec_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        time: new Date().toISOString(),
        formData: formData,
        scenes: state.scenes
      });
    } catch(e) {
      console.error('[H3] 自动保存历史失败:', e);
      // 不阻断主流程，静默失败
    }
    showToast('分镜脚本生成完成！已自动保存到历史（也可点 📌收藏 手动保存）');
  }, 600);
}

// ========== 本地重新生成（不消耗千问 token） ==========
// 复用当前已生成的 formData（保持用户所有预选条件不变），仅调用本地 generateStoryboard 重新出提示词，
// 不发起任何 LLM / 千问请求，因此零 token 消耗。常用于对同一配置换一套表达 / 镜头组合。
function regeneratePrompts() {
  if (!state.formData || !Object.keys(state.formData).length) {
    showToast('请先点击「生成提示词与分镜」生成一次', 'warn');
    return;
  }
  const btn = document.getElementById('regenBtn');
  if (!btn) return;
  btn.classList.add('loading');
  const origText = btn.textContent;
  btn.textContent = '🔄 生成中...';
  // 纯本地重排：setTimeout 仅给 UI 一个渲染时机，内部不做任何网络请求
  setTimeout(() => {
    try {
      // 保持当前语言（state.lang）不变，复用已有 formData
      state.scenes = generateStoryboard(state.formData);
      renderStoryboard();
      showToast('已本地重新生成（未调用千问，0 token 消耗）');
    } catch (e) {
      console.error('[H3] 本地重新生成失败:', e);
      showToast('重新生成失败：' + (e.message || '未知错误'), 'warn');
    } finally {
      btn.classList.remove('loading');
      btn.textContent = origText;
    }
  }, 300);
}

// ========== 渲染分镜 ==========
function renderStoryboard() {
  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('storyboardContent').style.display = 'block';
  renderProjectSummary();
  // 九宫格模式：直接输出「3×3出图提示词 + 派生视频提示词」，不走逐镜头分镜
  if ((state.formData.flow || 'auto') === 'grid') {
    renderNineGridOutput();
    return;
  }
  const lang = state.lang;

  const scenes = state.scenes;
  const n = scenes.length;
  const total = scenes.reduce((s, x) => s + x.duration, 0);
  const totalChars = scenes.reduce((s, sc) => s + [...(sc['prompt' + (state.lang === 'zh' ? 'Zh' : 'En')] || '')].length, 0);

  // 计算各镜头起始时间码
  const starts = [];
  let acc = 0;
  for (let i = 0; i < n; i++) { starts.push(acc); acc += scenes[i].duration; }

  // 分镜数量 / 总时长标题
  const modeLabel = (state.formData.genMode === 'i2v')
    ? ' · 图生视频（按镜头自动设计参考图）'
    : ' · 文生视频';
  document.getElementById('sceneCount').textContent = n + ' 个镜头 · 每段 ' + (scenes[0] ? scenes[0].duration : 15) + ' 秒 · 共 ' + total + ' 秒' + modeLabel + ' · 提示词约 ' + totalChars + ' 字';

  // 场景列表
  const list = document.getElementById('sceneList');
  list.innerHTML = '';
  scenes.forEach((scene, index) => {
    list.appendChild(createSceneCard(scene, index, starts[index]));
  });
}

// ========== 九宫格模式输出（阶段A出图提示词 + 阶段B派生视频提示词）==========
function renderNineGridOutput() {
  const res = buildNineGrid(state.formData);
  const list = document.getElementById('sceneList');
  list.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'ninegrid-output';
  wrap.innerHTML =
    '<div class="ng-block">' +
      '<div class="ng-head">阶段 A · 九宫格出图提示词（无出图工具时输出文本，请用图像模型生成 3×3 故事板）</div>' +
      '<div class="prompt-content">' + escapeHtml(res.stageA) + '</div>' +
      '<button class="btn-copy" data-copy="ngA">复制九宫格出图提示词</button>' +
    '</div>' +
    '<div class="ng-block">' +
      '<div class="ng-head">阶段 B · 派生 H3 视频提示词（据实际九宫格生成）</div>' +
      '<div class="prompt-content">' + escapeHtml(res.stageB) + '</div>' +
      '<button class="btn-copy" data-copy="ngB">复制视频提示词</button>' +
    '</div>';
  list.appendChild(wrap);
  wrap.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy === 'ngA' ? res.stageA : res.stageB;
      copyToClipboard(text, btn);
    });
  });
  document.getElementById('sceneCount').textContent = '九宫格模式 · 生成 3×3 出图提示词 + 派生视频提示词';
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
    <div class="summary-item"><span class="label">品牌</span><span class="value">${f.brandName || '（选填·未填）'}</span></div>
    <div class="divider"></div>
    <div class="summary-item"><span class="label">行业</span><span class="value">${ind?.name || '-'}</span></div>
    <div class="divider"></div>
    <div class="summary-item"><span class="label">风格</span><span class="value">${st?.name || '-'}</span></div>
    <div class="divider"></div>
    <div class="summary-item"><span class="label">流程</span><span class="value">${{ auto: '通用', wen: '文戏', action: '武戏', grid: '九宫格' }[f.flow || 'auto'] || '通用'}</span></div>
    <div class="divider"></div>
    <div class="summary-item"><span class="label">画幅</span><span class="value ratio-px" data-pixels="${((ASPECT_RATIOS[f.aspectRatio] || {}).pixels || '').replace(/、/g, ' · ')}">${f.aspectRatio}</span></div>
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
  const nextScene = (index < state.scenes.length - 1) ? state.scenes[index + 1] : null;
  const shotBlock = buildShotBrief(scene, index, startSec, lang, refNote, refImages, nextScene);

  // 图生视频：按镜头自动设计的参考图清单（全局固定图 + 本镜头设计图），供用户在 H3 按此上传
  const eff = getEffectiveRefs(refImages, scene.refPlan);
  const showRefPlan = (state.formData.genMode === 'i2v' && eff.all.length > 0);
  const refPlanHtml = showRefPlan ? (
    '<div class="ref-plan">' +
      '<div class="rp-head">📷 本镜头参考图（图生视频 · 在 H3 按此顺序上传）</div>' +
      '<ul class="rp-list">' +
        eff.all.map(function (r, i) {
          const num = i + 1;
          const isFixed = i < eff.fixed.length;
          let tag = isFixed ? '固定复用' : (r.role === 'subject' ? '主体·建议全程同图' : (r.role === 'style' ? '首镜定调' : '场景'));
          return '<li><span class="rp-num">图' + num + '</span><span class="rp-tag' + (isFixed ? ' fixed' : '') + '">' + tag + '</span><span class="rp-desc">' + escapeHtml(r.desc || r.type || '参考图') + '</span></li>';
        }).join('') +
      '</ul>' +
      '<div class="rp-note">每个镜头独立在 H3 生成后拼接成片；主体图建议全程用同一张，保证主体一致。</div>' +
    '</div>'
  ) : '';

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
        <span class="scene-tag ratio ratio-px" data-pixels="${((ASPECT_RATIOS[scene.aspectRatio] || {}).pixels || '').replace(/、/g, ' · ')}">${scene.aspectRatio}</span>
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
      ${refPlanHtml}
      <div class="prompt-section">
        <div class="prompt-label">
          <span class="pname"><span class="dot" style="background:var(--accent)"></span>直投提示词 [Shot ${index + 1}] ${langTag}（可直接粘贴到海螺 H3）</span>
          <span class="char-count" title="当前镜头提示词字数">${[...shotBlock].length} 字</span>
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
  const lang = state.lang;
  const isZh = lang === 'zh';
  const refImages = (state.formData && state.formData.genMode === 'i2v' && Array.isArray(state.formData.referenceImages))
    ? state.formData.referenceImages : [];
  const parts = state.scenes.map((scene, index) => {
    const refNote = refImages.length ? buildRefNoteForShot(refImages, index, isZh) : '';
    const nextScene = (index < state.scenes.length - 1) ? state.scenes[index + 1] : null;
    return buildShotBrief(scene, index, 0, lang, refNote, refImages, nextScene);
  });
  copyToClipboard(parts.join('\n\n==========\n\n'));
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

// ========== 通义千问 API 配置 + 优化计数 Key（必须在 init() 之前声明，避免 TDZ） ==========
const QWEN_CONFIG = {
  apiKey: 'sk-ws-H.ERYMXDH.iPtV.MEUCIQDU8gDQ5vzO68S-mNeQTrciFNeSr5L1fe4oLan1VCpvhwIgYMgRTYzt3gsUVB9KTQfAY4FOAJUjSawUjYJg9VZHTNg',
  model: 'qwen-plus',
  endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
};

const OPTIMIZE_COUNT_KEY = 'h3_optimize_count';

// ========== 启动 ==========
try {
  init();
} catch(e) {
  console.error('[H3] 初始化失败:', e);
  alert('H3 工坊初始化失败，请按 F12 打开控制台查看错误信息。');
}

// ========== 通义千问 API 函数（直接浏览器→DashScope） ==========

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

// 从通义千问回复中解析 H3 三字段提示词（宽松版：容忍多余文字、Markdown、大小写变化）
function parseH3Reply(text) {
  if (!text) return null;
  // 先剥离可能的 Markdown 代码块包裹
  let cleaned = text.replace(/```[\s\S]*?```/g, function(m) { return m.replace(/```\w*\n?/g, '').replace(/```/g, ''); }).trim();
  if (!cleaned && text.trim()) cleaned = text.trim();
  const get = function(key) {
    // 宽松匹配：允许冒号中英文、前后空格、大小写差异
    var re = new RegExp(key + '\\s*[:：]\\s*([\\s\\S]*?)(?=\\n\\s*(?:integrated_multimodal_description|overall_soundscape|non_diegetic_music)\\s*[:：]|$)', 'i');
    var m = cleaned.match(re);
    // 再尝试无空格紧贴格式
    if (!m) {
      re = new RegExp(key + '\\s*[:：]\\s*([\\s\\S]*)', 'i');
      m = cleaned.match(re);
    }
    return m ? m[1].trim() : '';
  };
  var visual = get('integrated_multimodal_description') || get('integrated multimodal description') || get('visual') || get('integrated_multimodal');
  var soundscape = get('overall_soundscape') || get('overall soundscape') || get('soundscape') || get('overall_soundscape');
  var music = get('non_diegetic_music') || get('non diegetic music') || get('music') || get('non_diegetic_music');
  // 至少有 visual 就算有效（部分返回也接受）
  if (!visual && !soundscape && !music) return null;
  return { visual: visual || '', soundscape: soundscape || '', music: music || '' };
}

// ========== 优化提示词方向弹窗 + 软计数（OPTIMIZE_COUNT_KEY 已在文件顶部声明） ==========

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

  let system = '你是 MiniMax H3 视频提示词专家，严格遵循官方 H3 Prompt Writing Guide。请把用户的中文 H3 提示词改写为地道、专业的英文提示词，并保留三字段结构。\n\n【强制格式规则】\n1. 字段顺序固定为 integrated_multimodal_description → overall_soundscape → non_diegetic_music，每段一字段、段间空一行，不要输出任何多余说明文字或 Markdown。\n2. integrated_multimodal_description 以 [Shot 1] 开头描述起始风格与构图；如需多镜头，后续用 [Shot 2] At 00:03.500, 这样的时间码（MM:SS.mmm，落在视频时长内）标记切镜；普通切镜用 the camera cuts to / the shot transitions to。\n3. 运镜写成自然英文动作，包含「运动类型 + 幅度 + 速度」三维度，例如 The camera pushes in with small amplitude at slow speed；幅度/速度仅在有意义时加（中幅度、常速通常省略）。\n4. 说话人用稳定 ID 如 (S1) / (S2)；对白与歌词保留原始语言并用对应语言标签包裹——中文用 <d>[Chinese] ... </d>、英文用 <d>[English] ... </d>，原文照抄不翻译；画外音注明 says in an off-screen voiceover 并说明对应角色嘴唇闭合。严禁把中文对白标成 [English]（否则海螺会用英语音素读中文，导致咬字不清）；语言标签必须与对白实际语言一致。\n5. 屏幕上真实可见的文字（标语/招牌/字幕）用英文双引号包裹，原文照抄不翻译。\n6. overall_soundscape：用 1–4 句英文概括全片环境声、物理动作声、非语言人声（风/雨/脚步/布料/呼吸/笑声等）；对话与剧情音已在前字段，不要重复；整片完全静音才用 N/A。\n7. non_diegetic_music：用 1–3 句英文描述只有观众能听到、角色听不到的配乐，聚焦乐器、速度、节奏与动态变化；不要用抽象情绪词，也不要解释音乐的情绪功能；无配乐用 N/A。';

  // 水疗养生行业：追加「调理不治疗」合规铁律 + 健康观念背书库
  if (state.formData.industry === 'hydro') {
    system += '\n\n【本片合规铁律·水疗养生类】\n- 仅可用「调理、舒缓、温通、促进气血运行、放松筋骨、帮助维持平衡」等温和表述；\n- 严禁出现「治疗、治愈、医治、根治、防病、抗癌、消炎、替代药物、医疗功效」等任何医疗宣称或疗效承诺；\n- 不可暗示可预防、诊断或治疗任何疾病；如涉及注意事项，仅可沿用「本品不能代替药物；孕妇、儿童及重大疾病者慎用」等安全提示。';

    // 注入健康观念背书库（来自张大春《健康观念治疗》、黄帝内经等用户知识库）
    const ind = (typeof INDUSTRIES !== 'undefined') ? INDUSTRIES.hydro : null;
    const knowledge = ind && ind.healthKnowledge ? ind.healthKnowledge : null;
    if (knowledge) {
      system += '\n\n【水疗养生行业知识库·健康观念背书（须自然嵌入提示词，体现行业背书与文化厚度）】\n' +
        '核心观念：' + knowledge.coreIdea + '\n' +
        '健康三道门：' + knowledge.threeDoors + '\n' +
        '治与调：' + knowledge.cureVsCondition + '\n' +
        '十一鱼：' + knowledge.elevenFish + '\n' +
        '温度解百病：' + knowledge.temperature + '\n' +
        '因果：' + knowledge.causeAndEffect + '\n' +
        '黄帝内经：' + knowledge.huangDi + '\n' +
        '求救信号：' + knowledge.warningSignals + '\n' +
        '调理边界：' + knowledge.boundaries + '\n\n' +
        '【使用指引】这些背书用于在科普镜头（健康重要性/设备好处/好转反应/适合人群）中自然出现 1-2 句，体现行业洞察；不要堆砌、不要逐条搬运；切勿与上方合规铁律冲突——遇到冲突以合规铁律为准。';
    }
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
      try {
        var user = '请把以下中文 H3 提示词翻译并润色为英文，保持三字段格式：\n\n' + scene.promptZh + directionSuffix;
        var reply = await callQwen(system, user);
        console.log('[H3] Qwen 场景 ' + (i+1) + ' 原始回复:', reply);
        var parsed = parseH3Reply(reply);
        if (parsed && (parsed.visual || parsed.soundscape || parsed.music)) {
          scene.visualEn = parsed.visual;
          scene.soundscapeEn = parsed.soundscape;
          scene.musicEn = parsed.music;
          scene.promptEn = 'integrated_multimodal_description: ' + parsed.visual + '\n\noverall_soundscape: ' + parsed.soundscape + '\n\nnon_diegetic_music: ' + parsed.music;
          okCount++;
          console.log('[H3] Qwen 场景 ' + (i+1) + ' 解析成功');
        } else {
          console.warn('[H3] Qwen 场景 ' + (i+1) + ' 解析失败，回复内容:', reply);
        }
      } catch (sceneErr) {
        // 单镜头失败不中断整体，继续下一个
        console.error('[H3] Qwen 场景 ' + (i+1) + ' 调用异常:', sceneErr);
      }
    }
    renderStoryboard();
    if (okCount > 0) {
      bumpOptimizeCount();
      if (okCount === state.scenes.length) {
        showToast('✨ 通义千问已优化全部 ' + state.scenes.length + ' 个场景');
      } else {
        showToast('✨ 已优化 ' + okCount + '/' + state.scenes.length + ' 个场景（部分镜头 API 无响应或返回格式异常）', 'warn');
      }
    } else {
      showToast('✨ 所有场景均未优化成功，请检查网络或稍后重试', 'warn');
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
  try {
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
      scenes: (record.scenes || []).map(s => {
        try { return { ...s }; }
        catch(e) { return { name: s.name, nameEn: s.nameEn }; }
      })
    };
    list.unshift(safe);
    if (list.length > HISTORY_MAX) list.length = HISTORY_MAX;
    setHistory(list);
  } catch(e) {
    console.error('[H3] addHistory 失败:', e);
    throw e; // 向上抛出，让调用方显示提示
  }
}

function removeHistory(id) {
  const list = getHistory().filter(r => r.id !== id);
  setHistory(list);
}

function clearHistory() {
  setHistory([]);
}

function openHistory() {
  try {
    renderHistoryList();
    document.getElementById('historyOverlay').classList.add('show');
  } catch(e) {
    console.error('[H3] 打开历史失败:', e);
    showToast('打开历史失败：' + (e.message || '未知错误'), 'warn');
  }
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
  console.log('[H3] 历史记录数:', list.length);
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
    state.marketingStyle = rec.formData.marketingStyle || 'none';
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
    // 恢复叙事流程与专属字段
    state.flow = rec.formData.flow || 'auto';
    state.relationFrom = rec.formData.relationFrom || '';
    state.relationTo = rec.formData.relationTo || '';
    state.coreProp = rec.formData.coreProp || '';
    state.dialogueLang = rec.formData.dialogueLang || '中文';
    state.opponent = rec.formData.opponent || '';
    state.equipBound = rec.formData.equipBound || '';
    state.story = rec.formData.story || '';
    state.gridCells = Array.isArray(rec.formData.gridCells) ? rec.formData.gridCells.slice() : [];
    applyFlowUI(state.flow);
    const rf = document.getElementById('relationFrom'); if (rf) rf.value = state.relationFrom;
    const rt = document.getElementById('relationTo'); if (rt) rt.value = state.relationTo;
    const cp = document.getElementById('coreProp'); if (cp) cp.value = state.coreProp;
    const dl = document.getElementById('dialogueLang'); if (dl) dl.value = state.dialogueLang;
    const op = document.getElementById('opponent'); if (op) op.value = state.opponent;
    const eb = document.getElementById('equipBound'); if (eb) eb.value = state.equipBound;
    const st = document.getElementById('story'); if (st) st.value = state.story;
    // 重新渲染网格高亮
    renderVideoTypes();
    renderIndustries();
    renderStyles();
    renderMarketingStyles();
    renderRatios();
    const dlgEl = document.getElementById('dialogue');
    if (dlgEl) dlgEl.value = rec.formData.dialogue || '';
  }
  renderStoryboard();
  // 滚到顶部看效果
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast('已加载历史记录：' + ((rec.formData && rec.formData.brandName) || '未命名项目'));
}
