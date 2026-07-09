/* GRP — логика сайта · 2026 redesign */
(function () {
  var grid = document.getElementById("branchesGrid");
  var modal = document.getElementById("branchModal");
  var modalMedia = document.getElementById("modalMedia");
  var modalAbbr = document.getElementById("modalAbbr");
  var modalFull = document.getElementById("modalFull");
  var modalStory = document.getElementById("modalStory");
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");
  var yearEl = document.getElementById("year");
  var cursorDot = document.getElementById("cursorDot");
  var cursorRing = document.getElementById("cursorRing");
  var preloader = document.getElementById("preloader");
  var preloaderFill = document.getElementById("preloaderFill");
  var scrollProgress = document.getElementById("scrollProgress");
  var header = document.getElementById("siteHeader");
  var heroContent = document.getElementById("heroContent");

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (yearEl) yearEl.textContent = "2026";

  /* ================= PRELOADER ================= */
  (function initPreloader() {
    if (!preloader) return;
    var progress = 0;
    var done = false;

    var tick = setInterval(function () {
      progress = Math.min(progress + 6 + Math.random() * 14, done ? 100 : 88);
      if (preloaderFill) preloaderFill.style.width = progress + "%";
      if (progress >= 100) {
        clearInterval(tick);
        setTimeout(function () {
          preloader.classList.add("is-done");
        }, 250);
      }
    }, 110);

    window.addEventListener("load", function () { done = true; });
    /* safety: never lock the page */
    setTimeout(function () { done = true; }, 3000);
  })();

  /* ================= CUSTOM CURSOR ================= */
  if (cursorDot && cursorRing && window.matchMedia("(pointer: fine)").matches && !prefersReduced) {
    document.body.classList.add("has-cursor");
    var rx = 0, ry = 0, dx = 0, dy = 0;

    window.addEventListener("mousemove", function (e) {
      dx = e.clientX;
      dy = e.clientY;
      cursorDot.style.transform = "translate(" + dx + "px, " + dy + "px)";
    }, { passive: true });

    (function follow() {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      cursorRing.style.transform = "translate(" + rx + "px, " + ry + "px)";
      requestAnimationFrame(follow);
    })();

    document.addEventListener("mouseover", function (e) {
      if (e.target.closest("a, button, .branch-card, canvas, .tree-frame")) {
        document.body.classList.add("cursor-grow");
      } else {
        document.body.classList.remove("cursor-grow");
      }
    }, { passive: true });
  }

  /* ================= SPLIT SECTION TITLES ================= */
  document.querySelectorAll(".section-title[data-split]").forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w, i) {
      return '<span class="st-word"><span style="transition-delay:' + (i * 0.08) + 's">' + w + "</span></span>";
    }).join(" ");
  });

  /* ================= TICKER ================= */
  (function initTicker() {
    var track = document.getElementById("tickerTrack");
    if (!track || typeof BRANCHES === "undefined") return;
    var html = BRANCHES.map(function (b) {
      return '<span class="ticker-item"><b>' + b.abbr + "</b> " + b.full + " <i>⟡</i></span>";
    }).join("");
    /* duplicate for seamless loop */
    track.innerHTML = html + html;
  })();

  /* ================= BRANCH CARDS ================= */
  function renderBranches() {
    if (!grid || typeof BRANCHES === "undefined") return;

    grid.innerHTML = BRANCHES.map(function (b, i) {
      var icon = (typeof ICONS !== "undefined" && ICONS[b.icon]) || "";
      var media = b.image
        ? '<div class="branch-photo"><img src="' + b.image + '" alt="' + b.abbr + '" loading="lazy" /></div>'
        : '<div class="branch-icon">' + icon + "</div>";
      var num = (i + 1 < 10 ? "0" : "") + (i + 1);

      return (
        '<button class="branch-card' + (b.image ? " branch-card--photo" : "") + '" type="button" data-id="' + b.id + '" style="--delay: ' + (i * 0.04) + 's" aria-label="' + b.abbr + ": " + b.full + '">' +
        '<span class="branch-glare" aria-hidden="true"></span>' +
        '<span class="branch-index" aria-hidden="true">' + num + " / 22</span>" +
        media +
        '<h3 class="branch-abbr">' + b.abbr + "</h3>" +
        '<p class="branch-full">' + b.full + "</p>" +
        '<span class="branch-hint">История →</span>' +
        "</button>"
      );
    }).join("");

    grid.querySelectorAll(".branch-card").forEach(function (card) {
      card.addEventListener("click", function () { openModal(card.dataset.id); });
      attachTilt(card, 10, true);
    });
  }

  /* ================= 3D TILT ================= */
  function attachTilt(el, maxDeg, withGlare) {
    if (prefersReduced || !window.matchMedia("(pointer: fine)").matches) return;
    var max = maxDeg || parseFloat(el.dataset.tiltMax) || 8;
    var raf = null;
    var state = { rx: 0, ry: 0 };

    function apply() {
      raf = null;
      el.style.transform =
        "perspective(900px) rotateX(" + state.rx + "deg) rotateY(" + state.ry + "deg)";
    }

    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      state.ry = (px - 0.5) * 2 * max;
      state.rx = -(py - 0.5) * 2 * max;
      if (withGlare) {
        el.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
        el.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
      }
      if (!raf) raf = requestAnimationFrame(apply);
    });

    el.addEventListener("mouseleave", function () {
      state.rx = 0;
      state.ry = 0;
      el.style.transform = "";
    });
  }

  document.querySelectorAll(".tilt").forEach(function (el) { attachTilt(el); });

  /* ================= MAGNETIC BUTTONS ================= */
  if (!prefersReduced && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".magnetic").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        el.style.transform = "translate(" + mx * 0.18 + "px, " + my * 0.24 + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
      });
    });
  }

  /* ================= HERO PARALLAX LETTERS ================= */
  if (heroContent && !prefersReduced && window.matchMedia("(pointer: fine)").matches) {
    var letters = heroContent.querySelectorAll(".hero-letter");
    window.addEventListener("mousemove", function (e) {
      var nx = (e.clientX / window.innerWidth - 0.5) * 2;
      var ny = (e.clientY / window.innerHeight - 0.5) * 2;
      letters.forEach(function (l) {
        var d = parseFloat(l.dataset.depth) || 3;
        l.style.translate = (nx * d * 2.4) + "px " + (ny * d * 1.6) + "px";
        l.style.rotate = "y " + (nx * d * 1.2) + "deg";
      });
    }, { passive: true });
  }

  /* ================= MODAL ================= */
  function openModal(id) {
    var branch = (BRANCHES || []).find(function (b) { return b.id === id; });
    if (!branch) return;

    if (branch.image) {
      modalMedia.innerHTML = '<img src="' + branch.image + '" alt="' + branch.abbr + '" class="modal-logo-img" />';
    } else {
      var icon = (typeof ICONS !== "undefined" && ICONS[branch.icon]) || "";
      modalMedia.innerHTML = '<div class="modal-icon">' + icon + "</div>";
    }

    modalAbbr.textContent = branch.abbr;
    modalFull.textContent = branch.full;
    modalStory.innerHTML = branch.story;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (modal) {
    modal.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
  }

  /* ================= TREE LIGHTBOX ================= */
  var treeFrame = document.getElementById("treeFrame");
  var lightbox = document.getElementById("treeLightbox");

  function openLightbox() {
    if (!lightbox) return;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (treeFrame) {
    treeFrame.addEventListener("click", openLightbox);
    treeFrame.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(); }
    });
  }
  if (lightbox) {
    lightbox.querySelectorAll("[data-lb-close]").forEach(function (el) {
      el.addEventListener("click", closeLightbox);
    });
    lightbox.querySelector(".lightbox-img").addEventListener("click", closeLightbox);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (modal && modal.classList.contains("is-open")) closeModal();
    if (lightbox && lightbox.classList.contains("is-open")) closeLightbox();
  });

  /* ================= NAV ================= */
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open");
    });
  }
  if (nav) {
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        if (navToggle) navToggle.classList.remove("is-open");
      });
    });
  }

  /* ================= SCROLL: header, progress, active link ================= */
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll("a")) : [];

  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 40);

    if (scrollProgress) {
      var max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollProgress.style.width = (y / max) * 100 + "%";
    }

    var currentId = "hero";
    sections.forEach(function (s) {
      if (y >= s.offsetTop - window.innerHeight * 0.4) currentId = s.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + currentId);
    });
  }, { passive: true });

  /* ================= SECTION REVEAL ================= */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(".section").forEach(function (s) { observer.observe(s); });

  /* ================= ANIMATED COUNTERS ================= */
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      counterObserver.unobserve(el);
      var target = parseInt(el.dataset.count, 10) || 0;
      var dur = 1400;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll(".stat-num[data-count]").forEach(function (el) {
    if (prefersReduced) {
      el.textContent = el.dataset.count;
    } else {
      counterObserver.observe(el);
    }
  });

  renderBranches();
})();
