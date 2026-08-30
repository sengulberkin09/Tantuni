/* ==========================================================================
   Hisarönü Tantuni Yakup Usta — Ortak Script
   Bağımlılık yok, vanilla JS.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  initOrderDropdowns();
  initOrderBranchSteps();
  initPageTransitions();
  initMenuTabs();
  initGalleryLightbox();
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

/* ---------- Sipariş Ver menüsü: şube seç -> platform seç ---------- */
function initOrderBranchSteps() {
  var menus = document.querySelectorAll(".order-menu");

  function resetMenu(menu) {
    var branchPanel = menu.querySelector('[data-panel="branch"]');
    var platformPanels = menu.querySelectorAll('[data-panel="platform"]');
    if (branchPanel) branchPanel.hidden = false;
    platformPanels.forEach(function (panel) {
      panel.hidden = true;
    });
  }

  menus.forEach(function (menu) {
    var branchPanel = menu.querySelector('[data-panel="branch"]');
    if (!branchPanel) return;

    branchPanel.querySelectorAll(".order-branch-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var branch = btn.getAttribute("data-branch");
        var targetPanel = menu.querySelector('[data-panel="platform"][data-branch="' + branch + '"]');
        if (!targetPanel) return;
        branchPanel.hidden = true;
        menu.querySelectorAll('[data-panel="platform"]').forEach(function (panel) {
          panel.hidden = panel !== targetPanel;
        });
      });
    });

    menu.querySelectorAll(".order-back-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        resetMenu(menu);
      });
    });
  });

  // Menü her kapandığında (dropdown aç/kapa mantığı) şube seçim ekranına dön
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      var menu = mutation.target;
      if (!menu.classList.contains("open")) resetMenu(menu);
    });
  });
  menus.forEach(function (menu) {
    observer.observe(menu, { attributes: true, attributeFilter: ["class"] });
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

/* ---------- Galeri lightbox (görsele tıklayınca büyüt) ---------- */
function initGalleryLightbox() {
  var lightbox = document.getElementById("lightbox");
  var images = document.querySelectorAll(".gallery-tile img");
  if (!lightbox || !images.length) return;

  var lightboxImg = lightbox.querySelector(".lightbox-img");
  var lightboxCaption = lightbox.querySelector(".lightbox-caption");
  var closeBtn = lightbox.querySelector(".lightbox-close");

  function open(img) {
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    var caption = img.closest(".gallery-tile").querySelector(".gallery-caption");
    lightboxCaption.textContent = caption ? caption.textContent : img.alt;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  images.forEach(function (img) {
    img.addEventListener("click", function () { open(img); });
  });

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
}

/* ---------- Menü sayfası sekmeleri (QR menü) ---------- */
function initMenuTabs() {
  var tablist = document.querySelector(".menu-tabs");
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".menu-tab"));
  if (!tablist || !tabs.length) return;

  var panels = document.querySelectorAll(".menu-panel");

  function activate(tab, setFocus) {
    tabs.forEach(function (t) {
      var isActive = t === tab;
      t.setAttribute("aria-selected", isActive ? "true" : "false");
      t.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    var targetId = tab.getAttribute("aria-controls");
    panels.forEach(function (panel) {
      panel.classList.toggle("active", panel.id === targetId);
    });

    // Aktif sekmeyi yatay kaydırılabilir barda görünür kıl
    tablist.scrollLeft = Math.max(0, tab.offsetLeft - 24);

    if (setFocus) tab.focus();
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      activate(tab, false);
    });

    tab.addEventListener("keydown", function (e) {
      var next;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = tabs[(index + 1) % tabs.length];
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = tabs[(index - 1 + tabs.length) % tabs.length];
      else if (e.key === "Home") next = tabs[0];
      else if (e.key === "End") next = tabs[tabs.length - 1];
      else return;
      e.preventDefault();
      activate(next, true);
    });
  });
}
