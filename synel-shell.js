/* ═══════════════════════════════════════════════════════════════
   synel-shell.js — הרכיבים הקבועים של כל התבניות המוכנות
   אותם רכיבים, אותו מקום, בכל תבנית. החלק הייחודי של כל תבנית לא משתנה.

   עורך:   למעלה "פרטי הטופס" · באמצע התוכן הייחודי · למטה "סיום ותהליך" · פוטר
   מילוי:  למעלה חזרה + שלב + התקדמות · כותרת · תוכן ייחודי · אישורים + כפתור + קישורים
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // תבניות שנטענות בלי קובצי העזר החיצוניים — כדי שהתצוגה לא תישבר
  if (typeof window.SYNEL_DB_FIELDS === 'undefined') window.SYNEL_DB_FIELDS = [];
  if (typeof window.updateConfirmType === 'undefined') window.updateConfirmType = function () { };

  var PAGE = (location.pathname.split('/').pop() || '').replace('.html', '');

  /* ── הגדרות לכל תבנית: איפה השדות הקבועים הישנים, ומה להסתיר ── */
  var CFG = {
    'template-questionnaire': {
      ids: { name: 'fName', icon: 'fNameIcon', sub: 'fSub', time: 'fTime', btn: 'fBtn', stepCur: 'fStepCur', stepTotal: 'fStepTotal' },
      hideSec: ['fName', 'fSub', 'fTime', 'fBtn', 'fProcess', 'fStepCur', 'fOwner', 'fRoles', 'tSig'],
      off: function () { if (window.fm && fm.confirm && (fm.confirm.signature || fm.confirm.checkbox)) { fm.confirm.signature = false; fm.confirm.checkbox = false; if (typeof window.render === 'function') window.render(); } },
      header: '.form-title,.form-subtitle,.time-badge',
      content: '#phoneContent',
      get: function () { return JSON.parse(JSON.stringify(window.fm)); },
      set: function (d) { window.loadForm(d); }
    },
    'template-list': {
      ids: { name: 'fName', sub: 'fSub', time: 'fTime', stepCur: 'fStepCur', stepTotal: 'fStepTotal' },
      hideSec: ['fName', 'fSub', 'fTime', 'fProcess'],
      hideRow: ['hasRC', 'rcText', 'hasSig'],
      offIds: ['hasRC', 'hasSig'],
      header: '.pv-title,.pv-sub,.pv-time',
      content: '#pvContent',
      get: function () { return window.getData(); },
      set: function (d) { window.loadForm(d); }
    },
    'template-info-db': {
      ids: { name: 'fName', icon: 'fIcon', sub: 'fSub', time: 'fTime', btn: 'fBtn', stepCur: 'fStepCur', stepTotal: 'fStepTotal' },
      hideSec: ['fName', 'fSub', 'fTime', 'fBtn', 'fProcess', 'fOwner', 'hasReadConfirm', 'hasSigOpt'],
      hideRow: ['fStepCur', 'assignSummary'],
      offIds: ['hasReadConfirm', 'hasSignature', 'hasDocBtn', 'hasSigOpt', 'hasCheckOpt'],
      header: '.pv-title,.pv-sub,.pv-time,.ph-title,.ph-sub,.ph-time,.form-title,.form-sub,.time-badge',
      content: '#phoneContent',
      fullDoc: true,
      get: function () { return window.getData(); },
      set: function (d) { window.loadForm(d); }
    },
    'template-highlights': {
      ids: { name: 'fName', sub: 'fSub', time: 'fTime', btn: 'fBtn', stepCur: 'fStepCur', stepTotal: 'fStepTotal' },
      hideSec: ['fName', 'fSub', 'fTime', 'fBtn', 'fProcess', 'fOwner', 'hasRC'],
      offIds: ['hasRC', 'hasSig'],
      header: '.pv-title,.pv-sub,.pv-time',
      content: '#phoneScroll',
      get: function () { return window.getData(); },
      set: function (d) { window.loadForm(d); }
    },
    'template-quiz': {
      ids: { name: 'fName', icon: 'fIcon', sub: 'fSub', time: 'fTime', btn: 'fBtn', stepCur: 'fStepCur', stepTotal: 'fStepTotal' },
      hideSec: ['fName', 'fSub', 'fTime', 'fBtn', 'fProcess', 'fOwner', 'hasSigOpt'],
      hideRow: ['hasRC', 'rcText', 'fStepCur', 'assignSummary'],
      offIds: ['hasRC', 'hasSigOpt', 'hasCheckOpt'],
      header: '.pv-title,.pv-sub,.pv-time',
      content: '#pvContent',
      fullDoc: true,
      get: function () { return window.getData(); },
      set: function (d) { window.loadForm(d); }
    },
    'template-pension': {
      flow: true,
      ids: { name: 'fName', sub: 'fSub', time: 'fTime', stepCur: 'fStepCur', stepTotal: 'fStepTotal' },
      own: { consent: 'hasCheckOpt', consentText: 'confirmOptText', sig: 'hasSigOpt' },
      hideSec: ['fName', 'fProcess', 'fOwner', 'hasSigOpt', 'roleListInput'],
      header: '#screen1 .fs-title,#screen1 .fs-sub,#screen1 .fs-time',
      content: '.flow-screen',
      flowBtn: '.flow-screen .action-btn',
      get: function () { return window.getData(); },
      set: function (d) { window.loadForm(d); }
    },
    'template-101': {
      flow: true,
      ids: { btn: 'btnText' },
      defaults: { name: 'טופס 101', icon: '🪪', sub: 'במקום למלא טופס ארוך – נצלם את הת"ז והספח שלך ונמלא הכל אוטומטית.', time: '4' },
      own: { consent: 'hasConfirm', consentText: 'confirmText', sig: 'hasSig' },
      hideSec: ['hasSig', 'fProcess', 'btnText'],
      hideSel: ['.phone > .top-bar', '.phone > .progress'],
      content: '.phone > .progress',
      get: function () { return window.getData101(); },
      set: function (d) { window.loadForm(d); }
    }
  };

  var cfg = CFG[PAGE];
  if (!cfg) return;

  /* ── מצב הרכיבים הקבועים ── */
  var S = {
    name: '', icon: '', sub: '', time: '', btn: 'אישור והמשך ←',
    consent: true, consentText: 'קראתי והבנתי', sig: false, fullDoc: !!cfg.fullDoc,
    stepCur: '1', stepTotal: '1', progress: true, back: true, later: true, backList: true
  };
  var STORE = 'synel_form::' + PAGE + '::';

  function $(id) { return id ? document.getElementById(id) : null; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fire(el, type) { if (el) el.dispatchEvent(new Event(type, { bubbles: true })); }

  /* ── CSS ── */
  var css = ''
    + '.sh-block{background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:14px 14px 12px;margin:0 0 14px;display:flex;flex-direction:column;gap:10px}'
    + '.sh-block.sh-bottom{margin:14px 0 0}'
    + '.sh-h{font-size:12px;font-weight:700;color:#1E1B4B;display:flex;align-items:center;gap:6px;letter-spacing:.02em}'
    + '.sh-h small{font-weight:500;color:#6B7280;font-size:11px}'
    + '.sh-f{display:flex;flex-direction:column;gap:4px}'
    + '.sh-f>span{font-size:11px;font-weight:600;color:#6B7280}'
    + '.sh-in{width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid #E5E7EB;border-radius:8px;font:inherit;font-size:13px;background:#FAFAF9;color:#111827}'
    + '.sh-in:focus{outline:none;border-color:#4F46E5;background:#fff}'
    + '.sh-row{display:flex;gap:8px;align-items:center}'
    + '.sh-ico{width:40px;height:36px;border:1px solid #E5E7EB;border-radius:8px;background:#FAFAF9;font-size:18px;cursor:pointer;flex:none}'
    + '.sh-num{width:64px;text-align:center}'
    + '.sh-mini{font-size:11px;color:#6B7280}'
    + '.sh-tog{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:13px;color:#111827;min-height:30px}'
    + '.sh-sw{position:relative;width:36px;height:20px;flex:none}'
    + '.sh-sw input{opacity:0;width:0;height:0;position:absolute}'
    + '.sh-sw i{position:absolute;inset:0;background:#D1D5DB;border-radius:20px;transition:.15s;cursor:pointer}'
    + '.sh-sw i:before{content:"";position:absolute;width:16px;height:16px;top:2px;right:2px;background:#fff;border-radius:50%;transition:.15s;box-shadow:0 1px 2px rgba(0,0,0,.2)}'
    + '.sh-sw input:checked+i{background:#4F46E5}'
    + '.sh-sw input:checked+i:before{transform:translateX(-16px)}'
    + '.sh-sub{padding:0 0 2px 0}'
    + '.sh-sep{height:1px;background:#F0F0EE;margin:2px 0}'
    + '.sh-foot{display:grid !important;grid-template-columns:1fr 1fr;gap:8px}'
    + '.sh-fb{padding:9px 8px;border:1px solid #E5E7EB;border-radius:9px;background:#fff;font:inherit;font-size:12px;font-weight:600;color:#1E1B4B;cursor:pointer}'
    + '.sh-fb:hover{background:#F5F5F4}'
    + '.sh-fb.sh-pub{grid-column:1/-1;background:#4F46E5;border-color:#4F46E5;color:#fff}'
    + '.sh-fb.sh-pub:hover{background:#4338CA}'
    /* תצוגת מילוי */
    + '.sh-bar{display:flex !important;align-items:center;gap:8px;padding:10px 16px !important;border-bottom:1px solid #F0F0EE;min-height:40px;box-sizing:border-box}'
    + '.sh-back{width:28px;height:28px;border-radius:50%;border:1px solid #E5E7EB;background:#fff;color:#374151;font-size:14px;line-height:1;cursor:pointer;flex:none}'
    + '.sh-step{font-size:12px;color:#6B7280;font-weight:600}'
    + '.sh-prog{height:4px;background:#EEF0F3;border-radius:2px;overflow:hidden;flex:1}'
    + '.sh-prog b{display:block;height:100%;background:#4F46E5;border-radius:2px}'
    + '.sh-head{padding:16px 18px 6px;display:flex;flex-direction:column;gap:6px;text-align:right}'
    + '.sh-head h1{margin:0;font-size:19px;line-height:1.3;color:#111827;font-weight:700}'
    + '.sh-head p{margin:0;font-size:13px;color:#4B5563;line-height:1.55}'
    + '.sh-chip{align-self:flex-start;font-size:11.5px;color:#374151;background:#F5F5F0;border:1px solid #E5E7EB;border-radius:20px;padding:3px 10px}'
    + '.phone-wrap{height:auto !important;min-height:500px}.sh-pfoot{display:flex !important;flex-direction:column;gap:10px;padding:12px 16px 14px !important;border-top:1px solid #F0F0EE}'
    + '.sh-doc{align-self:flex-start;background:none;border:0;padding:0;color:#4F46E5;font:inherit;font-size:13px;font-weight:600;cursor:pointer}'
    + '.sh-cons{display:flex;align-items:center;gap:8px;font-size:13px;color:#111827;cursor:pointer}'
    + '.sh-cons input{width:18px;height:18px;accent-color:#4F46E5}'
    + '.sh-sigbox{border:1.5px dashed #C7D2FE;border-radius:10px;padding:14px;text-align:center;font-size:12.5px;color:#4F46E5;background:#F8F8FF}'
    + '.sh-links{display:flex;justify-content:center;gap:18px}'
    + '.sh-link{background:none;border:0;padding:4px;font:inherit;font-size:12.5px;color:#6B7280;cursor:pointer}'
    + '.sh-hide{display:none !important}'
    + '.sh-pick{position:fixed;z-index:9999;background:#fff;border:1px solid #E5E7EB;border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,.15);padding:10px;display:grid;grid-template-columns:repeat(8,30px);gap:4px}'
    + '.sh-pick button{width:30px;height:30px;border:0;background:none;font-size:18px;cursor:pointer;border-radius:6px}'
    + '.sh-pick button:hover{background:#F3F4F6}'
    + '.sh-ov{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:9998;display:flex;align-items:center;justify-content:center}'
    + '.sh-modal{background:#fff;border-radius:14px;padding:20px;width:360px;max-width:92vw;display:flex;flex-direction:column;gap:12px;direction:rtl}'
    + '.sh-modal h3{margin:0;font-size:15px}'
    + '.sh-item{display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid #F0F0EE;border-radius:9px;font-size:13px}'
    + '.sh-item span{flex:1}'
    + '.sh-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1E1B4B;color:#fff;padding:9px 16px;border-radius:10px;font-size:13px;z-index:10000}';
  if (cfg.header) css += cfg.header + '{display:none !important}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ── חיבור לשדות הישנים (כדי שהתבנית עצמה תמשיך לעבוד) ── */
  function push() {
    var ids = cfg.ids || {};
    ['name', 'icon', 'sub', 'time', 'btn', 'stepCur', 'stepTotal'].forEach(function (k) {
      var el = $(ids[k]); if (!el) return;
      if (el.value !== String(S[k])) { el.value = S[k]; fire(el, 'input'); fire(el, 'change'); }
    });
    if (cfg.own) {
      var c = $(cfg.own.consent), t = $(cfg.own.consentText), g = $(cfg.own.sig);
      if (c && c.checked !== S.consent) { c.checked = S.consent; fire(c, 'change'); }
      if (t && t.value !== S.consentText) { t.value = S.consentText; fire(t, 'input'); }
      if (g && g.checked !== S.sig) { g.checked = S.sig; fire(g, 'change'); }
    }
  }
  function pull() {
    var ids = cfg.ids || {};
    ['name', 'icon', 'sub', 'time', 'btn', 'stepCur', 'stepTotal'].forEach(function (k) {
      var el = $(ids[k]); if (el && el.value !== '') S[k] = el.value;
    });
  }
  function silenceOld() {
    (cfg.offIds || []).forEach(function (id) { var el = $(id); if (el && el.checked) { el.checked = false; fire(el, 'change'); } });
    if (cfg.off) cfg.off();
  }

  /* ── הסתרת הרכיבים הקבועים הישנים ── */
  function hideOld() {
    (cfg.hideSec || []).forEach(function (id) {
      var el = $(id); if (!el) return;
      var t = el.closest('.ep-sec,.ep-section');
      (t || el).classList.add('sh-hide');
    });
    (cfg.hideRow || []).forEach(function (id) {
      var el = $(id); if (!el) return;
      var t = el.closest('.tog-row') || (el.parentElement && el.parentElement.parentElement && el.parentElement.parentElement.classList.contains('ep-body') ? el.parentElement : null) || el;
      t.classList.add('sh-hide');
    });
    (cfg.hideSel || []).forEach(function (sel) { document.querySelectorAll(sel).forEach(function (e) { e.classList.add('sh-hide'); }); });
    // מחיצות כפולות שנשארו אחרי ההסתרה
    var body = document.querySelector('.ep-body');
    if (body) {
      var prevDiv = true;
      Array.prototype.forEach.call(body.children, function (ch) {
        if (ch.classList.contains('sh-hide') || getComputedStyle(ch).display === 'none') return;
        var isDiv = ch.classList.contains('divider');
        if (isDiv && prevDiv) ch.classList.add('sh-hide');
        prevDiv = isDiv;
      });
    }
  }

  /* ── בלוקים בעורך ── */
  function tog(key, label) {
    return '<label class="sh-tog"><span>' + label + '</span><span class="sh-sw"><input type="checkbox" data-k="' + key + '"><i></i></span></label>';
  }
  function buildEditor() {
    var body = document.querySelector('.ep-body');
    var panel = document.querySelector('.editor-panel,.ep');
    var foot = panel && panel.querySelector('.ep-footer');
    if (!body || !panel) return;

    var top = document.createElement('div');
    top.className = 'sh-block sh-top';
    top.innerHTML =
      '<div class="sh-h">פרטי הטופס</div>'
      + '<div class="sh-f"><span>שם הטופס</span><div class="sh-row">'
      + '<button type="button" class="sh-ico" data-pick aria-label="בחירת אייקון"></button>'
      + '<input class="sh-in" data-k="name" placeholder="שם הטופס"></div></div>'
      + '<div class="sh-f"><span>כותרת משנה</span><input class="sh-in" data-k="sub" placeholder="משפט קצר שמסביר לעובד מה לעשות"></div>'
      + '<div class="sh-f"><span>זמן משוער</span><div class="sh-row"><input class="sh-in sh-num" data-k="time" type="number" min="1"><span class="sh-mini">דקות</span></div></div>';
    body.insertBefore(top, body.firstChild);

    var bot = document.createElement('div');
    bot.className = 'sh-block sh-bottom';
    bot.innerHTML =
      '<div class="sh-h">סיום ותהליך</div>'
      + '<div class="sh-f"><span>טקסט כפתור</span><input class="sh-in" data-k="btn"></div>'
      + '<div class="sh-sep"></div>'
      + tog('consent', 'קראתי והבנתי')
      + '<div class="sh-sub" data-show="consent"><input class="sh-in" data-k="consentText"></div>'
      + tog('sig', 'חתימה דיגיטלית')
      + (cfg.fullDoc ? tog('fullDoc', 'צפייה במסמך המלא') : '')
      + '<div class="sh-sep"></div>'
      + '<div class="sh-f"><span>שלב בתהליך</span><div class="sh-row"><input class="sh-in sh-num" data-k="stepCur" type="number" min="1"><span class="sh-mini">מתוך</span><input class="sh-in sh-num" data-k="stepTotal" type="number" min="1"></div></div>'
      + tog('progress', 'הצגת התקדמות')
      + '<div class="sh-sep"></div>'
      + tog('back', 'כפתור חזרה')
      + tog('later', 'המשך מאוחר יותר')
      + tog('backList', 'חזרה לרשימה');
    // סעיפים שיושבים מחוץ לאזור הגלילה של העורך עוברים פנימה, והבלוק התחתון תמיד אחרון
    Array.prototype.slice.call(panel.children).forEach(function (ch) {
      if (ch === body || ch === foot || ch.classList.contains('ep-head') || ch.classList.contains('editor-head') || ch.tagName === 'SCRIPT') return;
      if (body.compareDocumentPosition(ch) & Node.DOCUMENT_POSITION_FOLLOWING) body.appendChild(ch);
    });
    body.appendChild(bot);

    if (foot) {
      foot.innerHTML =
        '<button type="button" class="sh-fb" data-act="save">💾 שמור</button>'
        + '<button type="button" class="sh-fb" data-act="saveas">📋 שמור בשם</button>'
        + '<button type="button" class="sh-fb" data-act="load" style="grid-column:1/-1">📂 טפסים שמורים</button>'
        + '<button type="button" class="sh-fb sh-pub" data-act="publish">פרסם בהרמוני</button>';
      foot.classList.add('sh-foot');
      foot.addEventListener('click', function (e) {
        var b = e.target.closest('[data-act]'); if (!b) return;
        ({ save: save, saveas: saveAs, load: openSaved, publish: publish })[b.getAttribute('data-act')]();
      });
    }

    [top, bot].forEach(function (blk) {
      blk.addEventListener('input', onEdit);
      blk.addEventListener('change', onEdit);
    });
    top.querySelector('[data-pick]').addEventListener('click', function (e) { openPicker(e.currentTarget); });
    fillEditor();
  }
  function onEdit(e) {
    var k = e.target.getAttribute('data-k'); if (!k) return;
    S[k] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    if (k === 'consent') syncShow();
    push(); later();
  }
  function fillEditor() {
    document.querySelectorAll('.sh-block [data-k]').forEach(function (el) {
      var k = el.getAttribute('data-k');
      if (el.type === 'checkbox') el.checked = !!S[k]; else el.value = S[k] == null ? '' : S[k];
    });
    var ico = document.querySelector('.sh-ico'); if (ico) ico.textContent = S.icon || '😀';
    syncShow();
  }
  function syncShow() {
    document.querySelectorAll('[data-show]').forEach(function (el) { el.style.display = S[el.getAttribute('data-show')] ? '' : 'none'; });
  }

  /* ── בורר אייקונים ── */
  var ICONS = ['📄', '📝', '📋', '🧠', '⭐', '💰', '🪪', '🚀', '👋', '🎉', '📚', '🔒', '⚖️', '🛡️', '💼', '🏢', '📅', '⏰', '✅', '📌', '💡', '🎯', '🤝', '👤', '📧', '📞', '💻', '🔑', '🏥', '🚪', '🏆', '❤️'];
  function openPicker(btn) {
    var ex = document.querySelector('.sh-pick'); if (ex) { ex.remove(); return; }
    var p = document.createElement('div'); p.className = 'sh-pick';
    p.innerHTML = ICONS.map(function (i) { return '<button type="button">' + i + '</button>'; }).join('');
    var r = btn.getBoundingClientRect(); p.style.top = (r.bottom + 6) + 'px'; p.style.left = Math.max(8, r.left - 200) + 'px';
    p.addEventListener('click', function (e) {
      if (e.target.tagName !== 'BUTTON') return;
      S.icon = e.target.textContent; btn.textContent = S.icon; p.remove(); push(); later();
    });
    document.body.appendChild(p);
    setTimeout(function () { document.addEventListener('click', function h(ev) { if (!p.contains(ev.target) && ev.target !== btn) { p.remove(); document.removeEventListener('click', h); } }); }, 0);
  }

  /* ── תצוגת המילוי ── */
  var bar, head, pfoot;
  function buildPreview() {
    var phone = document.querySelector('.phone-wrap') || document.querySelector('.phone');
    if (!phone) return;
    var oldBar = phone.querySelector('.phone-bar');
    bar = document.createElement('div'); bar.className = 'sh-bar';
    if (oldBar) { oldBar.classList.add('sh-hide'); phone.insertBefore(bar, oldBar); } else phone.insertBefore(bar, phone.firstChild);

    head = document.createElement('div'); head.className = 'sh-head';
    var anchor = phone.querySelector(cfg.content);
    if (cfg.flow && PAGE === 'template-101' && anchor) anchor = anchor.nextElementSibling;
    if (anchor && anchor.parentElement === phone) phone.insertBefore(head, anchor);
    else if (anchor) anchor.parentElement.insertBefore(head, anchor);
    else phone.insertBefore(head, bar.nextSibling);

    var oldFoot = phone.querySelector('.phone-footer');
    pfoot = document.createElement('div'); pfoot.className = 'sh-pfoot';
    var action = $('actionBtn');
    if (oldFoot && !cfg.flow) { oldFoot.classList.add('sh-hide'); oldFoot.parentElement.insertBefore(pfoot, oldFoot.nextSibling); }
    else phone.appendChild(pfoot);
    // בתבניות זרימה ההתקדמות הקבועה מחליפה את פס ההתקדמות הפנימי
    phone.querySelectorAll('.flow-screen .progress-bar').forEach(function (e) { e.classList.add('sh-hide'); });
    pfoot.innerHTML = '<div data-z="doc"></div><div data-z="cons"></div><div data-z="sig"></div><div data-z="btn"></div><div class="sh-links" data-z="links"></div>';
    if (action && !cfg.flow) pfoot.querySelector('[data-z="btn"]').appendChild(action);
  }
  function renderPreview() {
    if (!bar) return;
    var cur = Math.max(1, parseInt(S.stepCur, 10) || 1), tot = Math.max(cur, parseInt(S.stepTotal, 10) || 1);
    bar.innerHTML =
      (S.back ? '<button type="button" class="sh-back" aria-label="חזרה">→</button>' : '')
      + '<span class="sh-step">שלב ' + cur + ' מתוך ' + tot + '</span>'
      + (S.progress ? '<div class="sh-prog"><b style="width:' + Math.round(cur / tot * 100) + '%"></b></div>' : '');

    head.innerHTML =
      '<h1>' + (S.icon ? esc(S.icon) + ' ' : '') + esc(S.name || 'שם הטופס') + '</h1>'
      + (S.sub ? '<p>' + esc(S.sub) + '</p>' : '')
      + (S.time ? '<span class="sh-chip">⏱ זמן משוער: ~' + esc(S.time) + ' דק\'</span>' : '');

    var z = function (n) { return pfoot.querySelector('[data-z="' + n + '"]'); };
    z('doc').innerHTML = (cfg.fullDoc && S.fullDoc) ? '<button type="button" class="sh-doc">📄 צפייה במסמך המלא</button>' : '';
    z('cons').innerHTML = (!cfg.own && S.consent) ? '<label class="sh-cons"><input type="checkbox"> ' + esc(S.consentText || 'קראתי והבנתי') + '</label>' : '';
    z('sig').innerHTML = (!cfg.own && S.sig) ? '<div class="sh-sigbox">✍️ חתימה דיגיטלית — לחצו כדי לחתום</div>' : '';
    z('links').innerHTML =
      (S.later ? '<button type="button" class="sh-link">המשך מאוחר יותר</button>' : '')
      + (S.backList ? '<button type="button" class="sh-link">חזרה לרשימה</button>' : '');

    var a = $('actionBtn'); if (a && !cfg.flow && S.btn) a.textContent = S.btn;
    if (cfg.flowBtn && S.btn) {
      var fb = document.querySelectorAll(cfg.flowBtn); if (fb.length) fb[fb.length - 1].textContent = S.btn;
    }
    // תגיות זמן שקבועות בתוך תוכן התבנית
    var phone = document.querySelector('.phone-wrap') || document.querySelector('.phone');
    if (phone) phone.querySelectorAll('div,span').forEach(function (el) {
      if (el.children.length === 0 && /^\s*⏱\s*זמן משוער/.test(el.textContent) && !el.classList.contains('sh-chip')) el.classList.add('sh-hide');
    });
    // כפילויות של רכיבים קבועים בתוך תוכן התבנית (חזרה לרשימה, כותרת משנה)
    if (phone) phone.querySelectorAll('div,span,a,button,p').forEach(function (el) {
      if (el.closest('.sh-bar,.sh-head,.sh-pfoot') || el.children.length) return;
      var t = el.textContent.trim();
      if (t === 'חזרה לרשימה' || (S.sub && t === S.sub.trim())) el.classList.add('sh-hide');
    });
  }
  var tmr; function later() { clearTimeout(tmr); tmr = setTimeout(function () { silenceOld(); renderPreview(); }, 30); }

  /* ── שמירה / שמור בשם / טפסים שמורים / פרסום ── */
  function toast(m) {
    var t = document.createElement('div'); t.className = 'sh-toast'; t.textContent = m; document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 1800);
  }
  function snapshot() { var tpl = null; try { tpl = cfg.get(); } catch (e) { } S.savedAt = new Date().toISOString(); return { tpl: tpl, shell: JSON.parse(JSON.stringify(S)), savedAt: S.savedAt }; }
  function save() {
    if (!S.name) { toast('צריך לתת שם לטופס'); return; }
    localStorage.setItem(STORE + S.name, JSON.stringify(snapshot())); toast('נשמר ✓');
  }
  function modal(html) {
    var ov = document.createElement('div'); ov.className = 'sh-ov';
    ov.innerHTML = '<div class="sh-modal">' + html + '</div>';
    ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
    document.body.appendChild(ov); return ov;
  }
  function saveAs() {
    var ov = modal('<h3>📋 שמור בשם</h3><input class="sh-in" placeholder="שם הטופס החדש"><div class="sh-row" style="justify-content:flex-end"><button type="button" class="sh-fb" data-x>ביטול</button><button type="button" class="sh-fb sh-pub" style="grid-column:auto" data-ok>שמירה</button></div>');
    var inp = ov.querySelector('input'); inp.value = (S.name || '') + ' — עותק'; setTimeout(function () { inp.select(); }, 30);
    var ok = function () {
      var n = inp.value.trim(); if (!n) return;
      S.name = n; fillEditor(); push(); later();
      localStorage.setItem(STORE + n, JSON.stringify(snapshot())); ov.remove(); toast('נשמר בשם "' + n + '" ✓');
    };
    ov.querySelector('[data-ok]').onclick = ok; ov.querySelector('[data-x]').onclick = function () { ov.remove(); };
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') ok(); });
  }
  function openSaved() {
    var names = [];
    for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k.indexOf(STORE) === 0) names.push(k.slice(STORE.length)); }
    var ov = modal('<h3>📂 טפסים שמורים</h3><div class="sh-list" style="display:flex;flex-direction:column;gap:6px"></div><button type="button" class="sh-fb" data-x>סגירה</button>');
    var list = ov.querySelector('.sh-list');
    if (!names.length) list.innerHTML = '<span class="sh-mini">אין עדיין טפסים שמורים בתבנית הזו.</span>';
    names.sort().forEach(function (n) {
      var row = document.createElement('div'); row.className = 'sh-item';
      row.innerHTML = '<span>' + esc(n) + '</span><button type="button" class="sh-fb">טעינה</button><button type="button" class="sh-fb">מחיקה</button>';
      row.children[1].onclick = function () { load(n); ov.remove(); };
      row.children[2].onclick = function () { localStorage.removeItem(STORE + n); row.remove(); };
      list.appendChild(row);
    });
    ov.querySelector('[data-x]').onclick = function () { ov.remove(); };
  }
  function load(n) {
    var raw = localStorage.getItem(STORE + n); if (!raw) return;
    try {
      var d = JSON.parse(raw);
      if (d.tpl) { try { cfg.set(d.tpl); } catch (e) { } }
      Object.assign(S, d.shell || {});
      fillEditor(); push(); hideOld(); later(); toast('נטען: ' + n);
    } catch (e) { toast('שגיאה בטעינה'); }
  }
  function publish() {
    if (!S.name) { toast('צריך לתת שם לטופס'); return; }
    save(); toast('"' + S.name + '" פורסם בהרמוני ✓');
  }

  /* ── הפעלה ── */
  function init() {
    pull();
    if (cfg.defaults) Object.keys(cfg.defaults).forEach(function (k) { if (!S[k]) S[k] = cfg.defaults[k]; });
    if (cfg.own) {
      var c = $(cfg.own.consent), t = $(cfg.own.consentText), g = $(cfg.own.sig);
      if (c) S.consent = c.checked; if (t && t.value) S.consentText = t.value; if (g) S.sig = g.checked;
    } else {
      // ערכי האישורים הישנים עוברים לרכיבים הקבועים
      var oc = ['hasRC', 'hasReadConfirm', 'hasCheckOpt'].map($).filter(Boolean)[0];
      var ot = ['rcText', 'readConfirmText', 'confirmOptText'].map($).filter(Boolean)[0];
      var os = ['hasSig', 'hasSignature', 'hasSigOpt'].map($).filter(Boolean)[0];
      if (PAGE === 'template-questionnaire' && window.fm && fm.confirm) { S.consent = !!fm.confirm.checkbox; S.sig = !!fm.confirm.signature; if (fm.confirm.checkboxText) S.consentText = fm.confirm.checkboxText; }
      else { if (oc) S.consent = oc.checked; if (ot && ot.value) S.consentText = ot.value; if (os) S.sig = os.checked; }
      if ($('hasDocBtn')) S.fullDoc = $('hasDocBtn').checked;
    }
    if (!S.icon && cfg.ids && !cfg.ids.icon) S.icon = { 'template-list': '📋', 'template-highlights': '⭐', 'template-pension': '💰' }[PAGE] || '';
    hideOld();
    buildEditor();
    buildPreview();
    push(); silenceOld();
    var panel = document.querySelector('.editor-panel,.ep');
    if (panel) { panel.addEventListener('input', later); panel.addEventListener('change', later); panel.addEventListener('click', later); }
    document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.phone-wrap,.phone')) later(); });
    renderPreview(); later();
    // פתיחה מתוך "שמורים" בגלריה
    var q = new URLSearchParams(location.search).get('sh'); if (q) load(q);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 0); });
  else setTimeout(init, 0);
})();
