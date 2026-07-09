/* GRP — логика сайта и эффекты */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)").matches;

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* Год */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Hero: пофакельное появление букв ---------- */
  const heroTitle = $(".title-grp");
  if (heroTitle && !prefersReduced) {
    const text = heroTitle.textContent.trim();
    heroTitle.textContent = "";
    heroTitle.setAttribute("aria-label", text);
    text.split("").forEach((ch, i) => {
      const span = document.createElement("span");
      span.className = "ch";
      span.textContent = ch;
      span.style.setProperty("--d", (0.15 + i * 0.1).toFixed(2) + "s");
      span.setAttribute("aria-hidden", "true");
      heroTitle.appendChild(span);
    });
  }

  /* ---------- Карточки подразделений ---------- */
  const grid = $("#branchesGrid");
  const modal = $("#branchModal");
  const modalIcon = $("#modalIcon");
  const modalAbbr = $("#modalAbbr");
  const modalFull = $("#modalFull");
  const modalStory = $("#modalStory");

  function addTilt(card) {
    if (!finePointer || prefersReduced) return;
    card.addEventListener("mouseenter", () => card.classList.add("is-tilting"));
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty("--mx", x + "px");
      card.style.setProperty("--my", y + "px");
      const rx = (y / r.height - 0.5) * -7;
      const ry = (x / r.width - 0.5) * 7;
      card.style.transform =
        "perspective(720px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-4px)";
    });
    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-tilting");
      card.style.transform = "";
    });
  }

  function renderBranches() {
    if (!grid || typeof BRANCHES === "undefined") return;

    grid.innerHTML = BRANCHES.map((b, i) => {
      const icon = (typeof ICONS !== "undefined" && ICONS[b.icon]) || "";
      return (
        '<button class="branch-card" type="button" data-id="' + b.id + '"' +
        ' style="--delay: ' + (i % 8) * 0.06 + 's"' +
        ' aria-label="' + b.abbr + ": " + b.full + '">' +
        '<span class="branch-num">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<div class="branch-icon">' + icon + "</div>" +
        '<h3 class="branch-abbr">' + b.abbr + "</h3>" +
        '<p class="branch-full">' + b.full + "</p>" +
        '<span class="branch-hint">История <span class="branch-hint-arrow">→</span></span>' +
        "</button>"
      );
    }).join("");

    $$(".branch-card", grid).forEach((card) => {
      card.addEventListener("click", () => openModal(card.dataset.id));
      addTilt(card);
    });
  }

  function openModal(id) {
    const branch = (typeof BRANCHES !== "undefined" ? BRANCHES : []).find((b) => b.id === id);
    if (!branch || !modal) return;

    modalIcon.innerHTML = (typeof ICONS !== "undefined" && ICONS[branch.icon]) || "";
    modalAbbr.textContent = branch.abbr;
    modalFull.textContent = branch.full;
    modalStory.innerHTML = branch.story;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $(".modal-close", modal)?.focus({ preventScroll: true });
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  modal?.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("is-open")) closeModal();
  });

  /* ---------- Мобильное меню ---------- */
  const navToggle = $("#navToggle");
  const nav = $("#siteNav");

  navToggle?.addEventListener("click", () => {
    const open = nav?.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", !!open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle?.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Шапка, прогресс-бар, кнопка наверх ---------- */
  const header = $(".site-header");
  const progressBar = $("#progressBar");
  const toTop = $("#toTop");

  function onScroll() {
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 40);
    toTop?.classList.toggle("is-visible", y > 600);
    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" })
  );

  /* ---------- Активный пункт меню (scrollspy) ---------- */
  const navLinks = $$(".nav a");
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = "#" + en.target.id;
        navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === id));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  ["hero", "about", "branches", "tree", "contact"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });

  /* ---------- Плавное появление секций ---------- */
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  $$(".section").forEach((s) => revealObs.observe(s));

  /* ---------- Анимированные счётчики ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count || "0");
    const dur = 1400;
    const t0 = performance.now();
    function step(t) {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = String(Math.round(target * e));
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const cntObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          animateCount(en.target);
          cntObs.unobserve(en.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  $$(".stat-num[data-count]").forEach((el) => {
    if (prefersReduced) el.textContent = el.dataset.count;
    else cntObs.observe(el);
  });

  /* ---------- Бегущая строка ---------- */
  $$(".marquee-track").forEach((track) => {
    if (typeof BRANCHES === "undefined") return;
    const items = ["GRP"].concat(BRANCHES.map((b) => b.abbr));
    const chunk = items
      .map((t) => '<span class="marquee-item">' + t + '</span><span class="marquee-sep">✦</span>')
      .join("");
    track.innerHTML = chunk + chunk;
  });

  /* ---------- Магнитные кнопки ---------- */
  if (finePointer && !prefersReduced) {
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = "translate(" + (x * 0.22).toFixed(1) + "px, " + (y * 0.22).toFixed(1) + "px)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ---------- Кастомный курсор ---------- */
  const dot = $(".cursor-dot");
  const ring = $(".cursor-ring");
  if (finePointer && !prefersReduced && dot && ring) {
    document.body.classList.add("has-cursor");
    let mx = -100, my = -100, rx = -100, ry = -100;
    let visible = false;

    window.addEventListener(
      "mousemove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!visible) {
          visible = true;
          rx = mx; ry = my;
          dot.classList.add("is-visible");
          ring.classList.add("is-visible");
        }
        dot.style.transform = "translate(" + mx + "px, " + my + "px) translate(-50%, -50%)";
      },
      { passive: true }
    );

    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = "translate(" + rx.toFixed(1) + "px, " + ry.toFixed(1) + "px) translate(-50%, -50%)";
      requestAnimationFrame(loop);
    })();

    const hoverSel = "a, button, .branch-card, [data-magnetic]";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverSel)) ring.classList.add("is-active");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverSel)) ring.classList.remove("is-active");
    });
    document.addEventListener("mousedown", () => ring.classList.add("is-down"));
    document.addEventListener("mouseup", () => ring.classList.remove("is-down"));
    document.documentElement.addEventListener("mouseleave", () => {
      dot.classList.remove("is-visible");
      ring.classList.remove("is-visible");
      visible = false;
    });
  }

  /* ---------- Золотые частицы (canvas) ---------- */
  const canvas = $("#fxCanvas");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1;
    let parX = 0, parY = 0, tX = 0, tY = 0;
    const P = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.floor(window.innerWidth * dpr);
      h = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    }
    resize();
    window.addEventListener("resize", resize);

    function spawn(anywhere) {
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 12 * dpr,
        r: (Math.random() * 1.5 + 0.4) * dpr,
        s: (Math.random() * 0.35 + 0.08) * dpr,
        a: Math.random() * Math.PI * 2,
        tw: Math.random() * 0.02 + 0.006,
        o: Math.random() * 0.5 + 0.15,
        drift: (Math.random() - 0.5) * 0.15 * dpr,
      };
    }

    const COUNT = Math.max(40, Math.min(110, Math.floor(window.innerWidth / 12)));
    for (let i = 0; i < COUNT; i++) P.push(spawn(true));

    if (finePointer) {
      window.addEventListener(
        "mousemove",
        (e) => {
          tX = e.clientX / window.innerWidth - 0.5;
          tY = e.clientY / window.innerHeight - 0.5;
        },
        { passive: true }
      );
    }

    (function tick() {
      parX += (tX - parX) * 0.03;
      parY += (tY - parY) * 0.03;
      ctx.clearRect(0, 0, w, h);
      for (const p of P) {
        p.y -= p.s;
        p.x += p.drift + Math.sin(p.a) * 0.1 * dpr;
        p.a += p.tw;
        if (p.y < -12 * dpr || p.x < -20 * dpr || p.x > w + 20 * dpr) Object.assign(p, spawn(false));
        const twinkle = 0.55 + Math.sin(p.a * 3) * 0.45;
        ctx.beginPath();
        ctx.arc(p.x + parX * 30 * dpr, p.y + parY * 20 * dpr, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(232, 200, 106, " + (p.o * twinkle).toFixed(3) + ")";
        ctx.fill();
      }
      requestAnimationFrame(tick);
    })();
  }

  /* ---------- Древо: запасная интерактивная карта ---------- */
  const treeImg = $("#treeImage");
  const treeFallback = $("#treeFallback");

  function buildTreeFallback() {
    if (!treeFallback || treeFallback.dataset.built || typeof BRANCHES === "undefined") return;
    treeFallback.dataset.built = "1";
    $(".tree-frame")?.classList.add("is-hidden");
    treeFallback.hidden = false;
    treeFallback.innerHTML =
      '<div class="tree-core"><span class="tree-core-abbr">GRP</span><span class="tree-core-sub">GlebRomanovichProduction</span></div>' +
      '<div class="tree-connector" aria-hidden="true"></div>' +
      '<div class="tree-chips">' +
      BRANCHES.map(
        (b) => '<span class="tree-chip" title="' + b.full + '">' + b.abbr + "</span>"
      ).join("") +
      "</div>";
  }

  if (treeImg) {
    treeImg.addEventListener("error", buildTreeFallback);
    if (treeImg.complete && treeImg.naturalWidth === 0) buildTreeFallback();
  }

  renderBranches();
})();
