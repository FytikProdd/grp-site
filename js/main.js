/* GRP — логика сайта */
(function () {
  const grid = document.getElementById("branchesGrid");
  const modal = document.getElementById("branchModal");
  const modalIcon = document.getElementById("modalIcon");
  const modalAbbr = document.getElementById("modalAbbr");
  const modalFull = document.getElementById("modalFull");
  const modalStory = document.getElementById("modalStory");
  const navToggle = document.getElementById("navToggle");
  const nav = document.querySelector(".nav");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Карточки подразделений */
  function renderBranches() {
    if (!grid || typeof BRANCHES === "undefined") return;

    grid.innerHTML = BRANCHES.map((b, i) => {
      const icon = (typeof ICONS !== "undefined" && ICONS[b.icon]) || "";
      return `
        <button
          class="branch-card"
          type="button"
          data-id="${b.id}"
          style="--delay: ${i * 0.04}s"
          aria-label="${b.abbr}: ${b.full}"
        >
          <div class="branch-icon">${icon}</div>
          <h3 class="branch-abbr">${b.abbr}</h3>
          <p class="branch-full">${b.full}</p>
          <span class="branch-hint">История →</span>
        </button>
      `;
    }).join("");

    grid.querySelectorAll(".branch-card").forEach((card) => {
      card.addEventListener("click", () => openModal(card.dataset.id));
    });
  }

  function openModal(id) {
    const branch = BRANCHES.find((b) => b.id === id);
    if (!branch) return;

    modalIcon.innerHTML = (ICONS && ICONS[branch.icon]) || "";
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

  /* Мобильное меню */
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

  /* Шапка при скролле */
  const header = document.querySelector(".site-header");
  window.addEventListener(
    "scroll",
    () => {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    },
    { passive: true }
  );

  /* Плавное появление секций */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".section").forEach((s) => observer.observe(s));

  renderBranches();
})();
