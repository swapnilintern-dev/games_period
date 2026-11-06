// Shared behaviour: opening animation, mobile menu, scroll effects.
const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- opening logo animation ----------
// CSS plays the sequence. This only ends it: the logo flies into the header
// while the page fades in underneath, then the splash is removed.
const splash = document.getElementById("splash");
if (root.classList.contains("intro")) {
  const INTRO_MS = 3250;
  const logo = document.getElementById("spLogo");
  const target = document.querySelector(".brand .logo");
  let leaving = false;

  const leave = () => {
    if (leaving) return;
    leaving = true;
    clearTimeout(timer);
    removeEventListener("keydown", leave);
    const from = logo.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);

    splash.classList.add("done", "leaving");
    root.classList.add("landing");
    root.classList.remove("intro");
    const flight = logo.animate(
      [{ transform: "none" }, { transform: `translate(${dx}px, ${dy}px) scale(${to.width / from.width})` }],
      { duration: 820, easing: "cubic-bezier(.72,0,.18,1)", fill: "forwards" },
    );
    flight.finished.finally(() => {
      root.classList.remove("landing");
      splash.remove();
    });
  };

  const timer = setTimeout(leave, INTRO_MS);
  splash.addEventListener("click", leave);
  addEventListener("keydown", leave);
} else {
  splash?.remove();
}

// ---------- mobile menu ----------
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
const setMenu = (open) => {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// ---------- header shadow + reading progress ----------
const header = document.querySelector(".site-header");
const progress = document.getElementById("progress");
const onScroll = () => {
  header.classList.toggle("scrolled", scrollY > 40);
  const max = root.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- count-up numbers ----------
const countUp = (el) => {
  const end = +el.dataset.count;
  if (reduced || end < 2) return;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / 900, 1);
    el.textContent = Math.round(end * (1 - (1 - t) ** 3));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

// ---------- scroll reveal ----------
document.querySelectorAll(".stagger").forEach((list) => {
  [...list.children].forEach((child, i) => child.style.setProperty("--n", i));
});
const items = document.querySelectorAll(".rv");
const show = (el) => {
  el.classList.add("in");
  el.querySelectorAll("[data-count]").forEach(countUp);
};
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.05, rootMargin: "0px 0px 12% 0px" });
  items.forEach((el) => io.observe(el));
} else {
  items.forEach(show);
}
