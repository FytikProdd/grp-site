/* GRP — логика сайта */
(function () {
  const grid = document.getElementById("branchesGrid");
  const modal = document.getElementById("branchModal");
  const modalMedia = document.getElementById("modalMedia");
  const modalAbbr = document.getElementById("modalAbbr");
  const modalFull = document.getElementById("modalFull");
  const modalStory = document.getElementById("modalStory");
  const navToggle = document.getElementById("navToggle");
  const nav = document.querySelector(".nav");
  const yearEl = document.getElementById("year");
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");

  if (yearEl) yearEl.textContent = "2026";

  /* Custom cursor */
  if (cursorDot && cursorRing && window.matchMedia("(pointer: fine)").matches) {
    document.body.classList.add("has-cursor");
    let rx = 0, ry = 0, dx = 0, dy = 0;

    window.addEventListener(
      "mousemove",
      (e) => {
        dx = e.clientX;
        dy = e.clientY;
        cursorDot.style.transform = `translate(${dx}px, ${dy}px)`;
      },
      { passive: true }
    );

    (function follow() {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      cursorRing.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(follow);
    })();

    document.querySelectorAll("a, button, .branch-card, canvas").forEach((el) => {
      el.addEventListener("mouseenter", () => document.body.classList.add("cursor-grow"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-grow"));
    });
  }

  function renderBranches() {
    if (!grid || typeof BRANCHES === "undefined") return;

    grid.innerHTML = BRANCHES.map((b, i) => {
      const icon = (typeof ICONS !== "undefined" && ICONS[b.icon]) || "";
      const media = b.image
        ? `<div class="branch-photo"><img src="${b.image}" alt="${b.abbr}" loading="lazy" /></div>`
        : `<div class="branch-icon">${icon}</div>`;

      return `
        <button
          class="branch-card${b.image ? " branch-card--photo" : ""}"
          type="button"
          data-id="${b.id}"
          style="--delay: ${i * 0.03}s"
          aria-label="${b.abbr}: ${b.full}"
        >
          ${media}
          <h3 class="branch-abbr">${b.abbr}</h3>
          <p class="branch-full">${b.full}</p>
          <span class="branch-hint">История →</span>
        </button>
      `;
    }).join("");

    grid.querySelectorAll(".branch-card").forEach((card) => {
      card.addEventListener("click", () => openModal(card.dataset.id));
      card.addEventListener("mouseenter", () => document.body.classList.add("cursor-grow"));
      card.addEventListener("mouseleave", () => document.body.classList.remove("cursor-grow"));
    });
  }

  function openModal(id) {
    const branch = BRANCHES.find((b) => b.id === id);
    if (!branch) return;

    if (branch.image) {
      modalMedia.innerHTML = `<img src="${branch.image}" alt="${branch.abbr}" class="modal-logo-img" />`;
    } else {
      const icon = (ICONS && ICONS[branch.icon]) || "";
      modalMedia.innerHTML = `<div class="modal-icon">${icon}</div>`;
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

  modal?.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("is-open")) closeModal();
  });

  navToggle?.addEventListener("click", () => {
    nav?.classList.toggle("is-open");
    navToggle.classList.toggle("is-open");
  });

  nav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle?.classList.remove("is-open");
    });
  });

  const header = document.querySelector(".site-header");
  window.addEventListener(
    "scroll",
    () => {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    },
    { passive: true }
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".section").forEach((s) => observer.observe(s));

  renderBranches();
})();
