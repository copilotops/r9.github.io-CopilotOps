(function() {
  'use strict';
  
  // Theme Toggle (persisted in localStorage; falls back to OS preference)
  const toggleBtn = document.getElementById('themeToggle');
  const root = document.documentElement;
  const THEME_KEY = 'copilotops-theme';

  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      root.setAttribute('data-theme', savedTheme);
    }
  } catch (e) {
    // localStorage unavailable (private browsing, etc.) — OS preference via CSS still applies
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
})();
