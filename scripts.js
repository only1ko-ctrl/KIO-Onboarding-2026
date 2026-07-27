// ─── NAVIGATION ───────────────────────────────────────────────
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  // Dropdown: hover to open, click to toggle (works on both desktop and touch)
  document.querySelectorAll('.nav-dropdown').forEach(li => {
    const btn = li.querySelector('.dropdown-toggle');

    li.addEventListener('mouseenter', () => li.classList.add('open'));
    li.addEventListener('mouseleave', () => li.classList.remove('open'));

    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        li.classList.toggle('open');
      });
    }
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown.open').forEach(el => el.classList.remove('open'));
  });

  // Active link highlighting
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Week day nav locks — applied immediately since DOM is ready at script load
  document.querySelectorAll('.nav-day-item[data-unlock-key]').forEach(function (item) {
    var key = item.getAttribute('data-unlock-key');
    var val = item.getAttribute('data-unlock-val') || 'done';
    if (localStorage.getItem(key) !== val) {
      item.classList.add('locked');
    }
  });
})();

// ─── DAY COMPLETION MODAL ──────────────────────────────────────
function showDayCompleteModal(dayKey) {
  const DAY_NAMES = {
    'w1d1': 'Day 1 — Who is Kontakt.io?',
    'w1d2': 'Day 2 — The Hospital Crisis',
    'w1d3': 'Day 3 — Platform & Use Cases',
    'w1d4': 'Day 4 — Persona Mastery',
    'w1d5': 'Day 5 — KIO Beyond RTLS',
    'w2d6': 'Day 6 — Selling into Healthcare',
    'w2d7': 'Day 7 — Strategic Conversations',
    'w2d8': 'Day 8 — Enabling Your Buyers',
    'w2d9': 'Day 9 — AI Orchestration',
    'w2d10': 'Day 10 — Sales Processes'
  };
  if (!DAY_NAMES[dayKey]) return;
  const existing = document.getElementById('kio-day-complete-modal');
  if (existing) existing.remove();
  const dateStr = new Date().toLocaleDateString('en-US', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
  const modal = document.createElement('div');
  modal.id = 'kio-day-complete-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:16px;max-width:440px;width:100%;box-shadow:0 25px 60px rgba(0,0,0,0.35);overflow:hidden;font-family:inherit;">
      <div style="background:linear-gradient(135deg,#3d2646 0%,#5a3668 100%);padding:2rem 2rem 1.75rem;text-align:center;">
        <div style="width:64px;height:64px;background:rgba(255,255,255,0.18);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="#fff" style="width:34px;height:34px;"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
        </div>
        <div style="color:#fff;font-size:1.45rem;font-weight:700;margin:0 0 0.2rem;letter-spacing:-0.01em;">Day Complete!</div>
        <div style="color:rgba(255,255,255,0.65);font-size:0.82rem;">Kontakt.io Revenue Enablement</div>
      </div>
      <div style="padding:1.75rem 2rem 2rem;">
        <p style="font-size:1.05rem;font-weight:600;color:#3d2646;margin:0 0 0.25rem;text-align:center;">${DAY_NAMES[dayKey]}</p>
        <p style="font-size:0.82rem;color:#9ca3af;text-align:center;margin:0 0 1.5rem;">Completed on ${dateStr}</p>
        <div style="background:#faf8fc;border:1.5px dashed #c4b5ce;border-radius:10px;padding:1rem 1.25rem;margin-bottom:1.5rem;">
          <p style="font-size:0.83rem;color:#6b7280;margin:0;line-height:1.65;text-align:center;">
            &#128247;&nbsp;<strong style="color:#3d2646;">Screenshot this screen</strong> and send it to your enablement leader as confirmation that you've completed this day's content.
          </p>
        </div>
        <button id="kio-modal-close-btn" style="width:100%;background:#3d2646;color:#fff;border:none;border-radius:8px;padding:0.8rem;font-size:0.95rem;font-weight:700;cursor:pointer;font-family:inherit;">Got It — Continue</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  document.getElementById('kio-modal-close-btn').addEventListener('click', () => modal.remove());
}

// ─── DAY LOCKING ──────────────────────────────────────────────
function recheckDayLocks() {
  document.querySelectorAll('.tabs-container .tab-btn[data-unlock-key]').forEach(function(btn) {
    var key = btn.getAttribute('data-unlock-key');
    var val = btn.getAttribute('data-unlock-val') || 'done';
    if (localStorage.getItem(key) === val) {
      btn.classList.remove('locked');
      btn.disabled = false;
      btn.title = '';
    }
  });
  document.querySelectorAll('[data-continue-from]').forEach(function(btn) {
    var key = btn.getAttribute('data-continue-from');
    if (localStorage.getItem('kontakt-' + key) === 'done') {
      btn.disabled = false;
      btn.style.opacity = '';
      btn.style.cursor = '';
      btn.title = '';
    }
  });
}

function initDayLocking() {
  document.querySelectorAll('.tabs-container .tab-btn[data-unlock-key]').forEach(function(btn) {
    var key = btn.getAttribute('data-unlock-key');
    var val = btn.getAttribute('data-unlock-val') || 'done';
    if (localStorage.getItem(key) !== val) {
      btn.classList.add('locked');
      btn.disabled = true;
      btn.title = 'Complete and pass the previous day\'s quiz to unlock.';
    }
  });
  document.querySelectorAll('[data-continue-from]').forEach(function(btn) {
    var key = btn.getAttribute('data-continue-from');
    if (localStorage.getItem('kontakt-' + key) !== 'done') {
      btn.disabled = true;
      btn.style.opacity = '0.4';
      btn.style.cursor = 'not-allowed';
      btn.title = 'Pass this day\'s quiz to continue.';
    }
  });
}

// ─── AUTO STATUS HELPER ────────────────────────────────────────
// Advances a day panel's status toggle to `target` only if it's currently behind that level.
function autoAdvanceStatus(panel, target) {
  if (!panel) return;
  const toggle = panel.querySelector('.status-toggle');
  if (!toggle) return;
  const order = ['not-started', 'in-progress', 'complete'];
  const labels = { 'not-started': 'Not Started', 'in-progress': 'In Progress', 'complete': 'Complete' };
  const current = toggle.dataset.status || 'not-started';
  if (order.indexOf(current) >= order.indexOf(target)) return; // already at or past target
  toggle.dataset.status = target;
  toggle.textContent = labels[target];
  const key = toggle.dataset.storageKey;
  if (key) localStorage.setItem('kontakt-' + key, target);
  if (target === 'complete') showDayCompleteModal(key || '');
  recheckDayLocks();
}

// ─── TABS ──────────────────────────────────────────────────────
function initTabs(containerSelector) {
  const containers = document.querySelectorAll(containerSelector || '.tabs-container');
  containers.forEach(container => {
    const buttons = container.querySelectorAll('.tab-btn');
    const panels = container.querySelectorAll('.tab-panel');

    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (panels[i]) panels[i].classList.add('active');
        // Switching to a day marks it in-progress automatically
        autoAdvanceStatus(panels[i], 'in-progress');
        updateDayNavBtn();
      });
    });

    // Activate first tab by default
    if (buttons[0]) buttons[0].classList.add('active');
    if (panels[0]) panels[0].classList.add('active');
  });
}

// ─── ACCORDION ─────────────────────────────────────────────────
function initAccordions() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      // Optionally close siblings
      const siblings = item.closest('.accordion')?.querySelectorAll('.accordion-item');
      if (siblings) siblings.forEach(s => s.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ─── STATUS TOGGLE ─────────────────────────────────────────────
function initStatusToggles() {
  const statuses = ['not-started', 'in-progress', 'complete'];
  const labels = { 'not-started': 'Not Started', 'in-progress': 'In Progress', 'complete': 'Complete' };

  document.querySelectorAll('.status-toggle').forEach(btn => {
    // Restore persisted state
    const key = btn.dataset.storageKey;
    if (key) {
      const saved = localStorage.getItem('kontakt-' + key);
      if (saved && labels[saved]) {
        btn.dataset.status = saved;
        btn.textContent = labels[saved];
      }
    }

    btn.addEventListener('click', () => {
      const current = btn.dataset.status || 'not-started';
      const nextIndex = (statuses.indexOf(current) + 1) % statuses.length;
      const next = statuses[nextIndex];
      btn.dataset.status = next;
      btn.textContent = labels[next];
      if (key) localStorage.setItem('kontakt-' + key, next);
      if (next === 'complete') showDayCompleteModal(key || '');
      recheckDayLocks();
    });
  });
}

// ─── DAY NAV BUTTON ────────────────────────────────────────────
function initDayNav() {
  const btn = document.getElementById('day-nav-btn');
  if (!btn) return;

  function getTabs() { return Array.from(document.querySelectorAll('.tabs-container .tab-btn')); }
  function getPanels() { return Array.from(document.querySelectorAll('.tabs-container .tab-panel')); }

  function update() {
    const tabs = getTabs();
    if (!tabs.length) return;
    const currentIdx = tabs.findIndex(t => t.classList.contains('active'));
    if (currentIdx < tabs.length - 1) {
      btn.textContent = 'Next: ' + tabs[currentIdx + 1].textContent + ' →';
      btn.dataset.action = 'next-day';
    } else {
      btn.textContent = btn.dataset.nextLabel || 'Continue →';
      btn.dataset.action = 'next-week';
    }
  }

  document.querySelectorAll('.tabs-container .tab-btn').forEach(tab => {
    tab.addEventListener('click', () => setTimeout(update, 0));
  });

  update();

  btn.addEventListener('click', () => {
    if (btn.dataset.action === 'next-week') {
      // Mark the active day as complete before leaving the week
      const tabs = getTabs();
      const panels = getPanels();
      const currentIdx = tabs.findIndex(t => t.classList.contains('active'));
      autoAdvanceStatus(panels[currentIdx], 'complete');

      const completeKey = btn.dataset.completeKey;
      const nextUrl = btn.dataset.nextUrl;
      if (completeKey) localStorage.setItem('kontakt-' + completeKey, 'true');
      if (nextUrl) window.location.href = nextUrl;
    } else {
      const tabs = getTabs();
      const panels = getPanels();
      const currentIdx = tabs.findIndex(t => t.classList.contains('active'));
      const nextIdx = currentIdx + 1;
      if (nextIdx < tabs.length) {
        // Mark current day complete, advance to next
        autoAdvanceStatus(panels[currentIdx], 'complete');
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tabs[nextIdx].classList.add('active');
        if (panels[nextIdx]) panels[nextIdx].classList.add('active');
        // Mark next day in-progress
        autoAdvanceStatus(panels[nextIdx], 'in-progress');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        update();
      }
    }
  });
}

// ─── WEEK LOCK ─────────────────────────────────────────────────
function initWeekLock(requiredKey, priorWeekUrl, priorWeekLabel) {
  if (localStorage.getItem('kontakt-' + requiredKey)) return;
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(61,38,70,0.96);z-index:9999;display:flex;align-items:center;justify-content:center;';
  overlay.innerHTML = '<div style="background:#fff;border-radius:12px;padding:2.5rem 3rem;max-width:420px;text-align:center;">' +
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#3d2646" style="width:48px;height:48px;margin:0 auto 1rem;display:block;"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>' +
    '<h2 style="color:#3d2646;margin:0 0 0.75rem;font-size:1.3rem;">This week is locked</h2>' +
    '<p style="color:#6b7280;margin:0 0 1.5rem;font-size:0.9rem;">Complete ' + priorWeekLabel + ' before moving on.</p>' +
    '<a href="' + priorWeekUrl + '" style="display:inline-block;background:#3d2646;color:#fff;padding:0.65rem 1.5rem;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">← Go to ' + priorWeekLabel + '</a>' +
    '</div>';
  document.body.appendChild(overlay);
}

// ─── FLIP CARDS ─────────────────────────────────────────────────
function initFlipCards() {
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      const panel = card.closest('.tab-panel');
      if (panel) autoAdvanceStatus(panel, 'in-progress');
    });
  });
}

// ─── AUTO STATUS ON INTERACTION ────────────────────────────────
// On the first scroll or meaningful click, mark the active day as in-progress.
function initAutoStatus() {
  let triggered = false;
  function onInteract(e) {
    if (triggered) return;
    // Ignore clicks that are on nav, status-toggle, flip-card, or tab buttons —
    // those have their own status logic.
    if (e.type === 'click') {
      const t = e.target;
      if (t.closest('.main-nav') || t.closest('.status-toggle') ||
          t.closest('.flip-card') || t.closest('.tab-btn')) return;
    }
    triggered = true;
    const activePanel = document.querySelector('.tabs-container .tab-panel.active') ||
                        document.querySelector('.tab-panel.active');
    autoAdvanceStatus(activePanel, 'in-progress');
    document.removeEventListener('scroll', onInteract, { passive: true });
    document.removeEventListener('click', onInteract);
  }
  document.addEventListener('scroll', onInteract, { passive: true });
  document.addEventListener('click', onInteract);
}

// ─── HASH-BASED TAB DEEP LINKING ───────────────────────────────
function activateTabFromHash() {
  var hash = window.location.hash;
  if (!hash) return;
  var tabMap = {
    '#day1': 0, '#day2': 1, '#day3': 2, '#day4': 3, '#day5': 4,
    '#day6': 0, '#day7': 1, '#day8': 2, '#day9': 3, '#day10': 4
  };
  var idx = tabMap[hash];
  if (idx === undefined) return;
  var tabs = document.querySelectorAll('.tabs-container .tab-btn');
  if (tabs[idx]) {
    tabs[idx].click();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
window.addEventListener('hashchange', activateTabFromHash);

// ─── INIT ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initDayLocking();
  activateTabFromHash();
  initAccordions();
  initStatusToggles();
  initDayNav();
  initFlipCards();
  initAutoStatus();
});
