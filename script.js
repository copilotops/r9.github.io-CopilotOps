(function() {
  'use strict';
  
  // Theme Toggle (persisted in localStorage; falls back to OS preference)
  const toggleBtn = document.getElementById('themeToggle');
  const root = document.documentElement;
  const THEME_KEY = 'copilotops-theme';

  // Dark is the default theme now. A visitor's explicit choice (light or
  // dark) is always remembered and respected; only a first-ever visit with
  // no saved preference falls back to dark.
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    root.setAttribute('data-theme', (savedTheme === 'light') ? 'light' : 'dark');
  } catch (e) {
    root.setAttribute('data-theme', 'dark');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {
        // ignore storage failures
      }
    });
  }

  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Architecture Card Expander
  document.querySelectorAll('.arch-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.agent-card');
      if (!card) return;
      const expanded = card.classList.toggle('is-expanded');
      btn.textContent = expanded ? 'Hide architecture' : 'Show architecture';
    });
  });

  // Operating Model Modal
  // Populated entirely from data already present in the clicked card's own
  // DOM (title, input bullets, rail caption, agent/action steps, body copy)
  // rather than any separately authored content.
  const modelModal = document.getElementById('modelModal');
  if (modelModal) {
    const modalTag = document.getElementById('modelModalTag');
    const modalTitle = document.getElementById('modelModalTitle');
    const modalContext = document.getElementById('modelModalContext');
    const modalInput = document.getElementById('modelModalInput');
    const modalSignal = document.getElementById('modelModalSignal');
    const modalSteps = document.getElementById('modelModalSteps');
    const modalOutcome = document.getElementById('modelModalOutcome');
    let lastFocused = null;

    function openModal(card) {
      const tag = card.querySelector('.agent-card__tag');
      const title = card.querySelector('h3');
      const meta = card.querySelector('.agent-card__meta');
      const body = card.querySelector('.agent-card__body');
      const rail = card.querySelector('.arch__rail');
      const inputItems = card.querySelectorAll('.stage--source li');
      const moveItems = card.querySelectorAll('.stage--agent li, .stage--action li');

      modalTag.textContent = tag ? tag.textContent : '';
      modalTitle.textContent = title ? title.textContent : '';
      modalContext.textContent = meta ? meta.textContent : '';
      modalInput.textContent = Array.from(inputItems).map(li => li.textContent).join(', ');
      modalSignal.textContent = rail ? rail.textContent : '';
      modalOutcome.textContent = body ? body.textContent : '';

      modalSteps.innerHTML = '';
      moveItems.forEach(li => {
        const stepEl = document.createElement('li');
        stepEl.textContent = li.textContent;
        modalSteps.appendChild(stepEl);
      });

      lastFocused = document.activeElement;
      modelModal.hidden = false;
      document.body.style.overflow = 'hidden';
      modelModal.querySelector('.model-modal__close').focus();
    }

    function closeModal() {
      modelModal.hidden = true;
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll('.arch-view-model').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.agent-card');
        if (card) openModal(card);
      });
    });

    modelModal.querySelectorAll('[data-close-modal]').forEach(el => {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modelModal.hidden) closeModal();
    });
  }

  // Copilot Modes Explorer (Home / Code / Autopilot / Today)
  // Content here is the same copy already written for this section —
  // restructured into tabs, not reworded.
  const modesRoot = document.querySelector('.modes');
  if (modesRoot) {
    const MODES = [
      {
        icon: '\u2302',
        meta: 'HOME \u00b7 UNIFIED STARTING POINT',
        title: 'The front door',
        desc: 'Brings Chat and Cowork into a single starting point, with Word, Excel, and PowerPoint built directly into Copilot. Rolling out through the Microsoft Frontier program in the coming weeks.',
        checks: [
          'Chat and Cowork merged into one starting point',
          'Word, Excel, and PowerPoint built directly in',
          'Rolling out via Microsoft Frontier in the coming weeks'
        ]
      },
      {
        icon: '</>',
        meta: 'CODE \u00b7 NATURAL-LANGUAGE APPS',
        title: 'Build inside your tenant',
        desc: 'Lets teams describe a small app in plain language and host it inside their own tenant, built on the same underlying technology as GitHub Copilot. A preview is promised later this year for Microsoft 365 Premium and Pro subscribers.',
        checks: [
          'Describe a small app in plain language',
          'Hosted inside your own tenant',
          'Built on the same technology as GitHub Copilot',
          'Preview promised later this year for M365 Premium and Pro'
        ]
      },
      {
        icon: '\u26A1',
        meta: 'AUTOPILOT \u00b7 PERSISTENT AGENT',
        title: 'The persistent operator',
        desc: 'A persistent, proactive agent \u2014 previously called Scout \u2014 that keeps working toward an objective without a new prompt for every step, and can pick a project back up days later. Entered private preview at the end of September 2026.',
        checks: [
          'Previously called Scout',
          'Keeps working without a new prompt for every step',
          'Can pick a project back up days later',
          'Entered private preview end of September 2026'
        ]
      },
      {
        icon: '\u25C9',
        meta: 'TODAY \u00b7 PROACTIVE COMMAND CENTER',
        title: 'What needs attention',
        desc: 'A proactive command center surfacing what needs attention across mail, calendar, Teams threads, meetings, and tasks. Enters private preview in October 2026, later coming to Outlook and Teams.',
        checks: [
          'Surfaces what needs attention across mail and calendar',
          'Covers Teams threads, meetings, and tasks',
          'Enters private preview in October 2026',
          'Later coming to Outlook and Teams'
        ]
      }
    ];

    const modeTabs = modesRoot.querySelectorAll('.modes__tab');
    const panel = modesRoot.querySelector('.modes__panel');
    const panelIcon = panel.querySelector('.modes__icon');
    const panelMeta = panel.querySelector('.modes__meta');
    const panelTitle = panel.querySelector('.modes__title');
    const panelDesc = panel.querySelector('.modes__desc');
    const panelChecks = panel.querySelector('.modes__checks');

    function renderMode(i) {
      const m = MODES[i];
      panelIcon.textContent = m.icon;
      panelMeta.textContent = m.meta;
      panelTitle.textContent = m.title;
      panelDesc.textContent = m.desc;
      panelChecks.innerHTML = '';
      m.checks.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        panelChecks.appendChild(li);
      });
    }

    modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        modeTabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        renderMode(Number(tab.dataset.mode));
      });
    });
  }

  // Hero orbital visual — subtle mouse-parallax on top of the existing
  // ambient rotation/float animations (which stay on the child elements
  // and are untouched; this only translates the whole layer).
  const heroVisual = document.getElementById('heroVisual');
  const heroVisualLayer = document.getElementById('heroVisualLayer');
  if (heroVisual && heroVisualLayer && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    const MAX_SHIFT = 14; // px
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      heroVisualLayer.style.transform = 'translate(' + (relX * MAX_SHIFT * -1) + 'px, ' + (relY * MAX_SHIFT * -1) + 'px)';
    });
    heroVisual.addEventListener('mouseleave', () => {
      heroVisualLayer.style.transform = 'translate(0, 0)';
    });
  }

  // Tracked Updates feed — reads data/updates.json, which a human updates
  // after reviewing the weekly GitHub Action's findings. No API keys, no
  // build step: just a JSON file the page fetches at load time.
  const updatesList = document.getElementById('updatesFeedList');
  const updatesCount = document.getElementById('updatesFeedCount');
  if (updatesList) {
    fetch('data/updates.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load updates');
        return res.json();
      })
      .then(items => {
        if (!Array.isArray(items) || items.length === 0) {
          updatesList.innerHTML = '<li class="updates-feed__empty">No tracked updates yet.</li>';
          return;
        }
        items.sort((a, b) => new Date(b.date) - new Date(a.date));
        updatesList.innerHTML = '';
        items.forEach(item => {
          const li = document.createElement('li');
          const dateObj = new Date(item.date);
          const dateLabel = isNaN(dateObj) ? item.date : dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
          li.innerHTML =
            '<span class="updates-feed__date">' + dateLabel + '</span>' +
            (item.tag ? '<span class="updates-feed__tag">' + item.tag + '</span>' : '') +
            '<strong class="updates-feed__title">' + item.title + '</strong>' +
            '<p class="updates-feed__summary">' + item.summary + '</p>' +
            (item.source ? '<a class="updates-feed__link" href="' + item.source + '" target="_blank" rel="noopener">Source &#8599;</a>' : '');
          updatesList.appendChild(li);
        });
        if (updatesCount) updatesCount.textContent = '(' + items.length + ')';
      })
      .catch(() => {
        updatesList.innerHTML = '<li class="updates-feed__empty">Updates feed unavailable right now.</li>';
      });
  }

  // Interactive Architecture Flows
  // Reuses the exact Input/Agent/Action diagram markup already built for
  // each agent card (cloned, not rebuilt), so every color, label and bullet
  // stays in sync with the single source of truth in the Agents section.
  const flowTabsEl = document.getElementById('flowTabs');
  const flowDiagramEl = document.getElementById('flowDiagram');
  const flowDetailEl = document.getElementById('flowDetail');
  if (flowTabsEl && flowDiagramEl && flowDetailEl) {
    const sourceCards = document.querySelectorAll('#agents .agent-card');
    const flowDetailEyebrow = document.getElementById('flowDetailEyebrow');
    const flowDetailTitle = document.getElementById('flowDetailTitle');
    const flowDetailList = document.getElementById('flowDetailList');
    const flowDetailStat = document.getElementById('flowDetailStat');

    const STAGE_LABELS = {
      'stage--source': 'Input',
      'stage--agent': 'Agent',
      'stage--action': 'Action'
    };

    function showStageDetail(stageEl, card) {
      flowDiagramEl.querySelectorAll('.arch__stage').forEach(s => s.classList.remove('is-selected'));
      stageEl.classList.add('is-selected');

      const stageClass = Object.keys(STAGE_LABELS).find(c => stageEl.classList.contains(c));
      const label = STAGE_LABELS[stageClass] || 'Stage';
      const items = Array.from(stageEl.querySelectorAll('li')).map(li => li.textContent);
      const meta = card.querySelector('.agent-card__meta');

      flowDetailEyebrow.textContent = label;
      flowDetailTitle.textContent = card.querySelector('h3').textContent;
      flowDetailList.innerHTML = '';
      items.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        flowDetailList.appendChild(li);
      });
      flowDetailStat.textContent = meta ? meta.textContent : '';
    }

    function renderFlow(card) {
      const archRow = card.querySelector('.arch__row');
      if (!archRow) return;

      flowDiagramEl.innerHTML = '';
      const figure = document.createElement('figure');
      figure.className = 'arch';
      const clonedRow = archRow.cloneNode(true);
      figure.appendChild(clonedRow);
      flowDiagramEl.appendChild(figure);

      const stages = clonedRow.querySelectorAll('.arch__stage');
      stages.forEach(stageEl => {
        stageEl.addEventListener('click', () => showStageDetail(stageEl, card));
      });

      if (stages.length) showStageDetail(stages[0], card);
    }

    function renderTabs() {
      flowTabsEl.innerHTML = '';
      sourceCards.forEach((card, i) => {
        const tagEl = card.querySelector('.agent-card__tag');
        const titleEl = card.querySelector('h3');
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'flow-tab' + (i === 0 ? ' is-active' : '');
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');

        const dot = document.createElement('span');
        dot.className = 'flow-tab__dot';
        if (tagEl) dot.style.background = getComputedStyle(tagEl).color;
        tab.appendChild(dot);
        tab.appendChild(document.createTextNode(titleEl ? titleEl.textContent : 'Agent'));

        tab.addEventListener('click', () => {
          flowTabsEl.querySelectorAll('.flow-tab').forEach(t => {
            t.classList.remove('is-active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('is-active');
          tab.setAttribute('aria-selected', 'true');
          renderFlow(card);
        });

        flowTabsEl.appendChild(tab);
      });

      if (sourceCards.length) renderFlow(sourceCards[0]);
    }

    renderTabs();
  }

  // Agent Category Filters
  const filterButtons = document.querySelectorAll('.agent-filter');
  const agentCards = document.querySelectorAll('.agent-card');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      agentCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-filtered-out', !match);
      });
    });
  });

  // Chatbot
  const launcher = document.getElementById('chatLauncher');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const log = document.getElementById('chatLog');
  const prompts = document.getElementById('chatPrompts');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatText');

  if (launcher && panel) {
    launcher.addEventListener('click', () => {
      panel.hidden = false;
      launcher.style.display = 'none';
      if (log && !log.children.length) {
        appendMsg('bot', 'Welcome to CopilotOps. How can we help you structure your enterprise AI agents?');
        renderPrompts();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        panel.hidden = true;
        launcher.style.display = 'inline-flex';
      });
    }

    function appendMsg(role, text) {
      const div = document.createElement('div');
      div.className = `msg msg--${role}`;
      div.textContent = text;
      log.appendChild(div);
      log.scrollTop = log.scrollHeight;
    }

    function renderPrompts() {
      prompts.innerHTML = '';
      const qList = ['What agents have you built?', 'Tell me about Governance', 'How do you work with Copilot Studio?'];
      qList.forEach(q => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = q;
        b.onclick = () => {
          appendMsg('user', q);
          setTimeout(() => appendMsg('bot', 'CopilotOps delivers governed Copilot Studio solutions, DevOps harnesses, and M365 declarative agents designed for zero drift and enterprise compliance.'), 400);
        };
        prompts.appendChild(b);
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = input.value.trim();
        if (!val) return;
        appendMsg('user', val);
        input.value = '';
        setTimeout(() => {
          appendMsg('bot', 'Thank you for reaching out. Please email copilotops@gmail.com with your project specifications.');
        }, 500);
      });
    }
  }

  // ============ Business Case Builder ============
  const bcbRoot = document.getElementById('business-case');
  if (bcbRoot) {
    const STORAGE_KEY = 'copilotops-bcb';

    // ---- Tabs ----
    const tabs = bcbRoot.querySelectorAll('.bcb-tab');
    const panels = bcbRoot.querySelectorAll('.bcb-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
        panels.forEach(p => { p.classList.remove('is-active'); p.hidden = true; });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        const panel = document.getElementById('bcb-' + tab.dataset.tab);
        if (panel) { panel.classList.add('is-active'); panel.hidden = false; }
        if (tab.dataset.tab === 'summary') renderSummary();
      });
    });

    // ---- Calculator ----
    const teamSizeInput = document.getElementById('bcbTeamSize');
    const hourlyRateInput = document.getElementById('bcbHourlyRate');
    const hoursWeekInput = document.getElementById('bcbHoursWeek');
    const teamSizeValue = document.getElementById('bcbTeamSizeValue');
    const hourlyRateValue = document.getElementById('bcbHourlyRateValue');
    const hoursWeekValue = document.getElementById('bcbHoursWeekValue');
    const outHours = document.getElementById('bcbOutHours');
    const outSavings = document.getElementById('bcbOutSavings');
    const outPayback = document.getElementById('bcbOutPayback');

    const AUTOMATION_RATE = 0.6;
    const PLATFORM_FEE_PER_USER_MONTH = 30;
    const IMPLEMENTATION_COST = 15000;

    function formatCurrency(n) {
      return '$' + Math.round(n).toLocaleString('en-US');
    }
    function formatNumber(n) {
      return Math.round(n).toLocaleString('en-US');
    }

    function calcResults() {
      const teamSize = Number(teamSizeInput.value);
      const hourlyRate = Number(hourlyRateInput.value);
      const hoursWeek = Number(hoursWeekInput.value);

      const annualHoursSaved = teamSize * hoursWeek * AUTOMATION_RATE * 52;
      const annualCostSavings = annualHoursSaved * hourlyRate;
      const annualPlatformFee = teamSize * PLATFORM_FEE_PER_USER_MONTH * 12;
      const monthlyNetSavings = (annualCostSavings - annualPlatformFee) / 12;

      let paybackLabel = 'Not reached within 24 months';
      if (monthlyNetSavings > 0) {
        const months = IMPLEMENTATION_COST / monthlyNetSavings;
        if (months <= 24) {
          paybackLabel = months < 1
            ? 'Under 1 month'
            : Math.round(months) + (Math.round(months) === 1 ? ' month' : ' months');
        }
      }

      return { teamSize, hourlyRate, hoursWeek, annualHoursSaved, annualCostSavings, paybackLabel };
    }

    function updateCalculator() {
      teamSizeValue.textContent = teamSizeInput.value;
      hourlyRateValue.textContent = '$' + hourlyRateInput.value + '/hr';
      hoursWeekValue.textContent = hoursWeekInput.value + ' hrs';

      const r = calcResults();
      outHours.textContent = formatNumber(r.annualHoursSaved);
      outSavings.textContent = formatCurrency(r.annualCostSavings);
      outPayback.textContent = r.paybackLabel;
    }

    if (teamSizeInput && hourlyRateInput && hoursWeekInput) {
      [teamSizeInput, hourlyRateInput, hoursWeekInput].forEach(el => {
        el.addEventListener('input', updateCalculator);
      });
      updateCalculator();
    }

    // ---- Comparison tier selection ----
    let selectedTier = null;
    const selectedTierLabel = document.getElementById('bcbSelectedTier');
    bcbRoot.querySelectorAll('.bcb-select').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedTier = btn.dataset.tier;
        if (selectedTierLabel) selectedTierLabel.textContent = 'Selected tier: ' + selectedTier;
      });
    });

    // ---- Readiness checklist (persisted) ----
    const checklistItems = bcbRoot.querySelectorAll('#bcbChecklist input[type="checkbox"]');
    const progressFill = document.getElementById('bcbProgressFill');
    const progressLabel = document.getElementById('bcbProgressLabel');

    function loadChecklistState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }
    function saveChecklistState(state) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        // ignore storage failures
      }
    }

    function updateProgress() {
      const total = checklistItems.length;
      const checked = Array.from(checklistItems).filter(c => c.checked).length;
      const pct = total ? Math.round((checked / total) * 100) : 0;
      if (progressFill) progressFill.style.width = pct + '%';
      if (progressLabel) progressLabel.textContent = checked + ' of ' + total;
    }

    const savedState = loadChecklistState();
    checklistItems.forEach(cb => {
      if (savedState[cb.dataset.item]) cb.checked = true;
      cb.addEventListener('change', () => {
        const state = loadChecklistState();
        state[cb.dataset.item] = cb.checked;
        saveChecklistState(state);
        updateProgress();
      });
    });
    updateProgress();

    // ---- Executive summary generator ----
    const summaryOutput = document.getElementById('bcbSummaryOutput');

    function renderSummary() {
      if (!summaryOutput) return;
      const r = calcResults();
      const checked = Array.from(checklistItems).filter(c => c.checked);
      const unchecked = Array.from(checklistItems).filter(c => !c.checked);
      const getLabel = (cb) => cb.closest('label').querySelector('span').textContent.trim();

      let text = 'CopilotOps — AI Business Case Summary\n';
      text += '========================================\n\n';
      text += 'Team profile\n';
      text += '  Team size: ' + r.teamSize + '\n';
      text += '  Average hourly rate: $' + r.hourlyRate + '/hr\n';
      text += '  Manual-task hours per week: ' + r.hoursWeek + '\n\n';
      text += 'Projected impact\n';
      text += '  Annual hours saved: ' + formatNumber(r.annualHoursSaved) + '\n';
      text += '  Projected annual cost savings: ' + formatCurrency(r.annualCostSavings) + '\n';
      text += '  Estimated payback period: ' + r.paybackLabel + '\n';
      text += '  (Assumes 60% automation of flagged manual hours, $30/user/month platform fee, $15,000 implementation cost. Adjust for your own environment.)\n\n';
      text += 'Recommended service tier\n';
      text += '  ' + (selectedTier ? selectedTier : 'Not yet selected — see Comparison Matrix tab') + '\n\n';
      text += 'Governance readiness (' + checked.length + ' of ' + checklistItems.length + ' confirmed)\n';
      checked.forEach(cb => { text += '  [x] ' + getLabel(cb) + '\n'; });
      unchecked.forEach(cb => { text += '  [ ] ' + getLabel(cb) + '\n'; });
      text += '\nGenerated by the CopilotOps Business Case Builder. Review all figures before sharing externally.';

      summaryOutput.textContent = text;
    }

    // ---- Copilot Credits / FinOps calculator ----
    const creditUsersInput = document.getElementById('bcbCreditUsers');
    const creditTasksInput = document.getElementById('bcbCreditTasks');
    const creditPerTaskInput = document.getElementById('bcbCreditPerTask');
    const creditUsersValue = document.getElementById('bcbCreditUsersValue');
    const creditTasksValue = document.getElementById('bcbCreditTasksValue');
    const creditPerTaskValue = document.getElementById('bcbCreditPerTaskValue');
    const creditMonthlyOut = document.getElementById('bcbCreditMonthly');
    const creditSpendOut = document.getElementById('bcbCreditSpend');
    const creditMultipleOut = document.getElementById('bcbCreditMultiple');

    const CREDIT_COST_PER_UNIT = 0.01; // derived from Microsoft's published example: 20,000 credits ≈ $200
    const FLAT_SEAT_COST = 30;
    const WORKDAYS_PER_MONTH = 20;

    function updateCreditCalculator() {
      const users = Number(creditUsersInput.value);
      const tasksPerDay = Number(creditTasksInput.value);
      const creditsPerTask = Number(creditPerTaskInput.value);

      creditUsersValue.textContent = users;
      creditTasksValue.textContent = tasksPerDay;
      creditPerTaskValue.textContent = creditsPerTask;

      const monthlyCreditsPerUser = tasksPerDay * creditsPerTask * WORKDAYS_PER_MONTH;
      const totalMonthlyCredits = monthlyCreditsPerUser * users;
      const monthlySpend = totalMonthlyCredits * CREDIT_COST_PER_UNIT;
      const spendPerUser = monthlyCreditsPerUser * CREDIT_COST_PER_UNIT;
      const multiple = spendPerUser / FLAT_SEAT_COST;

      creditMonthlyOut.textContent = formatNumber(totalMonthlyCredits);
      creditSpendOut.textContent = formatCurrency(monthlySpend);
      creditMultipleOut.textContent = multiple >= 1
        ? multiple.toFixed(1) + '\u00d7 per user'
        : 'Within seat cost';
    }

    if (creditUsersInput && creditTasksInput && creditPerTaskInput) {
      [creditUsersInput, creditTasksInput, creditPerTaskInput].forEach(el => {
        el.addEventListener('input', updateCreditCalculator);
      });
      updateCreditCalculator();
    }

    // ---- Copilot Credits readiness checklist (persisted separately) ----
    const CREDITS_STORAGE_KEY = 'copilotops-bcb-credits';
    const creditsChecklistItems = bcbRoot.querySelectorAll('#bcbCreditsChecklist input[type="checkbox"]');
    const creditsProgressFill = document.getElementById('bcbCreditsProgressFill');
    const creditsProgressLabel = document.getElementById('bcbCreditsProgressLabel');

    function loadCreditsState() {
      try {
        const raw = localStorage.getItem(CREDITS_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }
    function saveCreditsState(state) {
      try {
        localStorage.setItem(CREDITS_STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        // ignore storage failures
      }
    }
    function updateCreditsProgress() {
      const total = creditsChecklistItems.length;
      const checked = Array.from(creditsChecklistItems).filter(c => c.checked).length;
      const pct = total ? Math.round((checked / total) * 100) : 0;
      if (creditsProgressFill) creditsProgressFill.style.width = pct + '%';
      if (creditsProgressLabel) creditsProgressLabel.textContent = checked + ' of ' + total;
    }

    const savedCreditsState = loadCreditsState();
    creditsChecklistItems.forEach(cb => {
      if (savedCreditsState[cb.dataset.item]) cb.checked = true;
      cb.addEventListener('change', () => {
        const state = loadCreditsState();
        state[cb.dataset.item] = cb.checked;
        saveCreditsState(state);
        updateCreditsProgress();
      });
    });
    updateCreditsProgress();

    // ---- Summary actions ----
    const copyBtn = document.getElementById('bcbCopyBtn');
    const downloadBtn = document.getElementById('bcbDownloadBtn');
    const printBtn = document.getElementById('bcbPrintBtn');

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        renderSummary();
        const original = copyBtn.textContent;
        try {
          await navigator.clipboard.writeText(summaryOutput.textContent);
          copyBtn.textContent = 'Copied!';
        } catch (e) {
          copyBtn.textContent = 'Copy failed — select text manually';
        }
        setTimeout(() => { copyBtn.textContent = original; }, 2000);
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        renderSummary();
        const blob = new Blob([summaryOutput.textContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'copilotops-business-case.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        renderSummary();
        window.print();
      });
    }
  }
})();
