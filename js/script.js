/* ==========================================================================
   Hisarönü Tantuni Yakup Usta — Ortak Script
   Bağımlılık yok, vanilla JS.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  initOrderDropdowns();
  initPageTransitions();
  initMenuTabs();
});

/* ---------- Mobil hamburger menü ---------- */
function initNavToggle() {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", function () {
    var isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  links.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Sipariş Ver dropdown'ları (nav / hero / floating) ---------- */
function initOrderDropdowns() {
  var triggers = document.querySelectorAll("[data-order-trigger]");

  function closeAll(except) {
    triggers.forEach(function (trigger) {
      if (trigger === except) return;
      var menu = trigger.parentElement.querySelector(".order-menu");
      if (menu) menu.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    });
  }

  triggers.forEach(function (trigger) {
    var wrap = trigger.closest(".order-trigger");
    var menu = wrap ? wrap.querySelector(".order-menu") : null;
    if (!menu) return;

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var willOpen = !menu.classList.contains("open");
      closeAll(trigger);
      menu.classList.toggle("open", willOpen);
      trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

  document.addEventListener("click", function () {
    closeAll(null);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAll(null);
  });
}

/* ---------- Sayfa geçiş animasyonu (fade) ---------- */
function initPageTransitions() {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  var links = document.querySelectorAll('a[href$=".html"]');

  links.forEach(function (link) {
    var isExternal = link.target === "_blank" || link.hasAttribute("download");
    if (isExternal) return;

    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");
      if (!href || href.indexOf("#") === 0) return;

      e.preventDefault();
      document.body.classList.add("page-exit");
      window.setTimeout(function () {
        window.location.href = href;
      }, 220);
    });
  });
}

/* ---------- Menü sayfası sekmeleri ---------- */
function initMenuTabs() {
  var tabs = document.querySelectorAll(".menu-tab");
  if (!tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var targetId = tab.getAttribute("aria-controls");

      tabs.forEach(function (t) {
        t.setAttribute("aria-selected", "false");
      });
      tab.setAttribute("aria-selected", "true");

      document.querySelectorAll(".menu-panel").forEach(function (panel) {
        panel.classList.toggle("active", panel.id === targetId);
      });
    });
  });
}
