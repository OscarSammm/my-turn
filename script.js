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
