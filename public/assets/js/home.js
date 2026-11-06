// Sport selector: swaps the court drawing and how we support that sport.
const NOTES = {
  football: "Sport-specific coaching, goal and ball inventory, and full-size or five-a-side ground maintenance planning.",
  basketball: "Court conversion from unused space, hoop and ball management, and inter-school league scheduling.",
  badminton: "Indoor court development for halls and corridors, racquet and shuttle inventory, and beginner to advanced coaching.",
  athletics: "Track marking, fitness assessments for speed and endurance, and inter-school meet planning.",
  volleyball: "Low-cost court layouts on open ground, net and ball kits, and inter-house tournament organisation.",
};

const tabs = [...document.querySelectorAll(".court-tabs button")];
const courts = [...document.querySelectorAll("[data-court]")];
const note = document.getElementById("courtNote");

tabs.forEach((tab) => tab.addEventListener("click", () => {
  tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
  // SVG elements have no .hidden property, so set the attribute directly.
  courts.forEach((c) => c.toggleAttribute("hidden", c.dataset.court !== tab.dataset.s));
  note.textContent = NOTES[tab.dataset.s];
}));

// Timetable leans gently towards the cursor.
const tt = document.getElementById("tt");
const hero = document.querySelector(".hero");
if (matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) {
  hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    tt.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg) rotate(1.2deg)`;
  });
  hero.addEventListener("mouseleave", () => { tt.style.transform = ""; });
}
