// script.js (FULL UPDATED - CLEAN)

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const topbar = document.querySelector(".topbar");
  const hero = document.querySelector(".hero");

  // nav links
  const navLinks = Array.from(
    document.querySelectorAll('.mininav a[href^="#"]')
  );

  // ---------- 1) Theme toggle (save + load) ----------
  if (themeToggle) {
    const savedTheme = localStorage.getItem("toro_theme"); // "light" | "dark"
    themeToggle.checked = savedTheme === "light";

    themeToggle.addEventListener("change", () => {
      localStorage.setItem("toro_theme", themeToggle.checked ? "light" : "dark");
    });
  }

  // ---------- 2) Footer year ----------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- 3) Topbar scroll behavior ----------
  const updateTopbar = () => {
    if (!topbar) return;

    // If hero exists: become solid after leaving hero
    if (hero) {
      const heroBottom = hero.getBoundingClientRect().bottom;
      const makeSolid = heroBottom <= 80;
      topbar.classList.toggle("topbar--solid", makeSolid);
      return;
    }

    // If no hero: become solid after small scroll
    topbar.classList.toggle("topbar--solid", window.scrollY > 40);
  };

  window.addEventListener("scroll", updateTopbar, { passive: true });
  updateTopbar();

  // ---------- 4) Smooth scroll ----------
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    });
  });

  // ---------- 5) Keyboard shortcut: "/" focuses first nav link ----------
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !isTypingInInput()) {
      e.preventDefault();
      navLinks[0]?.focus();
    }
  });

  // ---------- 6) Flip cards ----------
  document.querySelectorAll(".flipCard").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("flipBack__close")) {
        e.preventDefault();
        card.classList.remove("is-flipped");
        return;
      }
      if (e.target.closest("a")) return;
      card.classList.toggle("is-flipped");
    });
  });
});

// helpers
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isTypingInInput() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || el.isContentEditable;
}

const toggle = document.getElementById("navToggle");
const menu = document.getElementById("mobileMenu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // close menu when clicking a link
  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
} else {
  console.log("Missing navToggle or mobileMenu in HTML");
}
