const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-menu a");
const dialog = document.querySelector("#match-dialog");
const openQuizButtons = document.querySelectorAll("[data-open-quiz]");
const revealTargets = Array.from(document.querySelectorAll([
  ".section-kicker",
  ".split-heading h2",
  ".split-heading p",
  ".feature",
  ".image-band",
  ".band-copy h2",
  ".band-copy p",
  ".product-card",
  ".sleep-match > div",
  ".quiz-panel",
  ".editorial-grid > div",
  ".editorial-grid img",
  ".base-list article",
  ".offer-wall",
  ".offer-wall li",
  ".mini-locations article",
  ".review-heading",
  ".review-grid figure",
].join(","))).filter((target) => !target.closest(".match-dialog"));

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const updateScrollState = () => {
  document.body.classList.toggle("has-scrolled", window.scrollY > 240);
};

updateScrollState();
window.addEventListener("scroll", updateScrollState, { passive: true });

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.14 },
  );

  revealTargets.forEach((target, index) => {
    target.classList.add("reveal");
    target.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => {
    target.classList.add("is-visible");
  });
}

openQuizButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!dialog) return;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  });
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (!target.matches("[data-result]")) return;

  const group = target.closest(".quiz-panel, .match-dialog");
  const output = group?.querySelector("output");

  group?.querySelectorAll("[data-result]").forEach((option) => {
    option.setAttribute("aria-pressed", String(option === target));
  });

  if (output) {
    output.value = target.dataset.result || "";
    output.textContent = target.dataset.result || "";
  }
});

if (dialog) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}
