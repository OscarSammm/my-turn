// script.js

document.addEventListener("DOMContentLoaded", () => {
  // 1) Theme toggle: save + load preference
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  // Load saved theme ("light" or "dark")
  const savedTheme = localStorage.getItem("toro_theme");
  if (savedTheme === "light") themeToggle.checked = true;
  if (savedTheme === "dark") themeToggle.checked = false;

  // Save theme whenever user toggles
  themeToggle.addEventListener("change", () => {
    localStorage.setItem("toro_theme", themeToggle.checked ? "light" : "dark");
  });

  // 2) Small “spy” interaction: press "/" to focus the first nav link (quick jump)
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !isTypingInInput()) {
      e.preventDefault();
      const firstNavLink = document.querySelector(".nav a");
      firstNavLink?.focus();
    }
  });

  // 3) Subtle header effect when scrolling (adds a class)
  const topbar = document.querySelector(".topbar");
  window.addEventListener("scroll", () => {
    if (!topbar) return;
    topbar.classList.toggle("topbar--scrolled", window.scrollY > 10);
  }, { passive: true });
});

// Helper: don’t trigger shortcuts while typing
function isTypingInInput() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || el.isContentEditable;
}

// script.js — adds interactivity WITHOUT changing your HTML

document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector(".app");
  const topbar = document.querySelector(".topbar");
  const themeToggle = document.getElementById("themeToggle");
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));

  // ---------- 1) Theme toggle: save + load ----------
  if (themeToggle) {
    const savedTheme = localStorage.getItem("toro_theme"); // "light" | "dark"
    if (savedTheme === "light") themeToggle.checked = true;
    if (savedTheme === "dark") themeToggle.checked = false;

    themeToggle.addEventListener("change", () => {
      localStorage.setItem("toro_theme", themeToggle.checked ? "light" : "dark");
      toast(themeToggle.checked ? "Light mode armed." : "Dark mode armed.");
    });
  }

  // ---------- 2) Topbar scroll effect (adds class) ----------
  if (topbar) {
    const onScroll = () => {
      topbar.classList.toggle("topbar--scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---------- 3) Smooth scroll for nav links ----------
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId) return;

      const target = document.querySelector(targetId);

      // If the section doesn't exist yet, show a clean warning (no code changes needed)
      if (!target) {
        e.preventDefault();
        pulse(link);
        toast(`Section ${targetId} not found yet. Add it later and this will work.`);
        return;
      }

      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    });
  });

  // ---------- 4) Active nav highlight while scrolling (only if sections exist) ----------
  const sections = Array.from(document.querySelectorAll('section[id], main[id], div[id]'))
    .filter((el) => el.id && navLinks.some((a) => a.getAttribute("href") === `#${el.id}`));

  if (sections.length > 0 && navLinks.length > 0) {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((x) => x.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        navLinks.forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === `#${visible.target.id}`);
        });
      },
      { threshold: [0.25, 0.4, 0.55] }
    );

    sections.forEach((s) => obs.observe(s));
  }

  // ---------- 5) Cursor spotlight (spy/noir vibe) ----------
  // Injects an overlay element + styles at runtime (no HTML edit needed)
  if (app) {
    injectStyles();
    const spot = document.createElement("div");
    spot.className = "toro-spotlight";
    app.appendChild(spot);

    let raf = null;
    window.addEventListener("mousemove", (e) => {
      if (prefersReducedMotion()) return;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        spot.style.setProperty("--x", `${e.clientX}px`);
        spot.style.setProperty("--y", `${e.clientY}px`);
      });
    }, { passive: true });
  }

  // ---------- 6) Keyboard shortcuts (clean + useful) ----------
  //  /  focuses the first nav link
  //  g + a / w / s / c jumps to About/Work/Skills/Contact (if exists)
  //  Ctrl/Cmd + K opens command panel
  let awaitingG = false;

  document.addEventListener("keydown", (e) => {
    if (isTyping()) return;

    // Command panel
    const isCmdK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
    if (isCmdK) {
      e.preventDefault();
      openCommandPanel(navLinks);
      return;
    }

    if (e.key === "/") {
      e.preventDefault();
      navLinks[0]?.focus();
      toast("Nav focus.");
      return;
    }

    // g then letter navigation
    if (e.key.toLowerCase() === "g") {
      awaitingG = true;
      toast("Go to: a / w / s / c", 900);
      setTimeout(() => (awaitingG = false), 1000);
      return;
    }

    if (awaitingG) {
      awaitingG = false;
      const map = { a: "#about", w: "#work", s: "#skills", c: "#contact" };
      const id = map[e.key.toLowerCase()];
      if (!id) return;

      const target = document.querySelector(id);
      if (!target) {
        toast(`Section ${id} not found yet.`);
        return;
      }
      target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      toast(`Going to ${id}.`);
    }
  });

  // ---------- 7) First load message ----------
  toast("Systems online.", 900);
});

/* ------------------- Helpers ------------------- */

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isTyping() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || el.isContentEditable;
}

function pulse(el) {
  el.classList.add("toro-pulse");
  setTimeout(() => el.classList.remove("toro-pulse"), 550);
}

function toast(message, ms = 1400) {
  let box = document.querySelector(".toro-toast");
  if (!box) {
    box = document.createElement("div");
    box.className = "toro-toast";
    document.body.appendChild(box);
  }
  box.textContent = message;
  box.classList.add("show");
  clearTimeout(box._t);
  box._t = setTimeout(() => box.classList.remove("show"), ms);
}

function injectStyles() {
  if (document.getElementById("toro-js-styles")) return;

  const style = document.createElement("style");
  style.id = "toro-js-styles";
  style.textContent = `
    /* Added by script.js (no HTML edits needed) */

    /* Topbar scrolled look (works if your CSS doesn't have it yet) */
    .topbar--scrolled{
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 30px rgba(0,0,0,.20);
    }

    /* Active nav highlight */
    .nav a.active{
      border: 1px solid rgba(216,184,106,.35);
      box-shadow: 0 0 0 6px rgba(216,184,106,.10);
      border-radius: 999px;
    }

    /* Pulse animation for missing sections */
    .toro-pulse{
      animation: toroPulse .55s ease;
    }
    @keyframes toroPulse{
      0%{transform: translateY(0)}
      30%{transform: translateY(-2px)}
      60%{transform: translateY(0)}
      100%{transform: translateY(0)}
    }

    /* Toast */
    .toro-toast{
      position: fixed;
      left: 50%;
      bottom: 18px;
      transform: translateX(-50%) translateY(10px);
      padding: .7rem 1rem;
      border-radius: 999px;
      border: 1px solid rgba(34,48,74,.9);
      background: rgba(10,14,22,.80);
      color: #e9eef7;
      font-weight: 800;
      letter-spacing: .02em;
      opacity: 0;
      pointer-events: none;
      transition: opacity .2s ease, transform .2s ease;
      z-index: 9999;
      max-width: min(92vw, 560px);
      text-align: center;
    }
    .toro-toast.show{
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    /* Cursor spotlight overlay */
    .toro-spotlight{
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      --x: 50vw;
      --y: 30vh;
      background:
        radial-gradient(240px 240px at var(--x) var(--y),
          rgba(216,184,106,.12),
          transparent 60%),
        radial-gradient(380px 380px at var(--x) var(--y),
          rgba(124,182,255,.08),
          transparent 65%);
      mix-blend-mode: screen;
      opacity: .85;
    }

    /* Command panel */
    .toro-cmd-backdrop{
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.55);
      backdrop-filter: blur(8px);
      z-index: 9998;
      display: grid;
      place-items: center;
      padding: 18px;
    }
    .toro-cmd{
      width: min(640px, 96vw);
      border-radius: 18px;
      border: 1px solid rgba(34,48,74,.9);
      background: rgba(12,16,26,.92);
      color: #e9eef7;
      box-shadow: 0 22px 60px rgba(0,0,0,.55);
      overflow: hidden;
    }
    .toro-cmd header{
      padding: 14px 14px 10px;
      border-bottom: 1px solid rgba(34,48,74,.65);
      font-weight: 900;
      letter-spacing: .12em;
      text-transform: uppercase;
      font-size: .8rem;
      color: rgba(216,184,106,.9);
    }
    .toro-cmd ul{
      list-style: none;
      margin: 0;
      padding: 8px;
      display: grid;
      gap: 8px;
    }
    .toro-cmd li{
      border: 1px solid rgba(34,48,74,.7);
      border-radius: 14px;
      padding: 12px;
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: center;
      background: rgba(15,20,34,.7);
      cursor: pointer;
    }
    .toro-cmd kbd{
      padding: .25rem .5rem;
      border-radius: 10px;
      border: 1px solid rgba(34,48,74,.9);
      background: rgba(0,0,0,.25);
      font-weight: 900;
    }

    @media (prefers-reduced-motion: reduce){
      .toro-spotlight{display:none}
    }
  `;
  document.head.appendChild(style);
}

function openCommandPanel(navLinks) {
  // Build a quick command panel (no HTML edits)
  const backdrop = document.createElement("div");
  backdrop.className = "toro-cmd-backdrop";
  backdrop.tabIndex = -1;

  const panel = document.createElement("div");
  panel.className = "toro-cmd";
  panel.innerHTML = `
    <header>Command Panel</header>
    <ul>
      <li data-cmd="theme"><span>Toggle theme</span><kbd>T</kbd></li>
      <li data-cmd="focus"><span>Focus navigation</span><kbd>/</kbd></li>
      <li data-cmd="about"><span>Go to About</span><kbd>g a</kbd></li>
      <li data-cmd="work"><span>Go to Work</span><kbd>g w</kbd></li>
      <li data-cmd="skills"><span>Go to Skills</span><kbd>g s</kbd></li>
      <li data-cmd="contact"><span>Go to Contact</span><kbd>g c</kbd></li>
      <li data-cmd="close"><span>Close</span><kbd>Esc</kbd></li>
    </ul>
  `;

  backdrop.appendChild(panel);
  document.body.appendChild(backdrop);

  const close = () => {
    backdrop.remove();
    toast("Panel closed.", 900);
  };

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });

  document.addEventListener("keydown", onKey);

  function onKey(e) {
    if (e.key === "Escape") {
      document.removeEventListener("keydown", onKey);
      close();
      return;
    }
    if (e.key.toLowerCase() === "t") {
      const toggle = document.getElementById("themeToggle");
      if (toggle) toggle.checked = !toggle.checked;
      toggle?.dispatchEvent(new Event("change"));
    }
  }

  panel.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", () => {
      const cmd = li.getAttribute("data-cmd");

      if (cmd === "close") {
        document.removeEventListener("keydown", onKey);
        close();
        return;
      }

      if (cmd === "theme") {
        const toggle = document.getElementById("themeToggle");
        if (toggle) toggle.checked = !toggle.checked;
        toggle?.dispatchEvent(new Event("change"));
      }

      if (cmd === "focus") {
        navLinks[0]?.focus();
      }

      const map = { about: "#about", work: "#work", skills: "#skills", contact: "#contact" };
      const targetId = map[cmd];
      if (targetId) {
        const target = document.querySelector(targetId);
        if (!target) {
          toast(`Section ${targetId} not found yet.`);
        } else {
          target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
        }
      }

      document.removeEventListener("keydown", onKey);
      close();
    });
  });

  toast("Ctrl/Cmd + K to open. Esc to close.", 1200);
}
