// script.js (FULL UPDATED - CLEAN)

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const topbar = document.querySelector(".topbar");
  const hero = document.querySelector(".hero");

  // You use .mininav in HTML (not .nav)
  const navLinks = Array.from(document.querySelectorAll('.mininav a[href^="#"]'));

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

  // ---------- 3) Cadence topbar behavior ----------
  // Transparent over hero, turns solid after you scroll past hero
  const updateTopbar = () => {
    if (!topbar) return;

    // If no hero exists, just solid after a tiny scroll
    if (!hero) {
      topbar.classList.toggle("topbar--solid", window.scrollY > 10);
      return;
    }

    const heroBottom = hero.getBoundingClientRect().bottom;
    const makeSolid = heroBottom <= 80;

    topbar.classList.toggle("topbar--solid", makeSolid);

    // Make icons/text dark when solid, white when on hero
    topbar.style.color = makeSolid ? "#1f1f1f" : "#ffffff";
  };

  window.addEventListener("scroll", updateTopbar, { passive: true });
  updateTopbar();

  // ---------- 4) Smooth scroll for nav links ----------
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId) return;

      const target = document.querySelector(targetId);
      if (!target) return; // if section doesn't exist, do nothing

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

// Flip cards: tap to flip + Back button
document.querySelectorAll(".flipCard").forEach((card) => {
  card.addEventListener("click", (e) => {
    // Back button flips back
    if (e.target.classList.contains("flipBack__close")) {
      e.preventDefault();
      card.classList.remove("is-flipped");
      return;
    }

    // Clicking links should NOT toggle flip
    if (e.target.closest("a")) return;

    // Toggle flip
    card.classList.toggle("is-flipped");
  });
});

