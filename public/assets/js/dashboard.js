// Dashboard preview. Sample data only; each role sees only its own tabs.
const EVENTS = [
  ["12 Nov 2026", "Inter-house football league, Round 1", "Inter-house", "Scheduled"],
  ["21 Nov 2026", "Inter-school badminton trial", "Inter-school", "Registration open"],
  ["05 Dec 2026", "Annual sports day planning review", "Planning", "In progress"],
];
const STUDENTS = [
  { name: "Aarav Sharma", id: "GP-0142", cls: "VIII-B", sport: "Football", score: 74, att: 90 },
  { name: "Diya Patel", id: "GP-0157", cls: "VII-A", sport: "Badminton", score: 81, att: 95 },
  { name: "Rohan Singh", id: "GP-0163", cls: "IX-C", sport: "Basketball", score: 66, att: 78 },
  { name: "Ananya Gupta", id: "GP-0171", cls: "VIII-A", sport: "Athletics", score: 88, att: 97 },
  { name: "Kabir Das", id: "GP-0180", cls: "X-A", sport: "Football", score: 59, att: 72 },
  { name: "Meera Nair", id: "GP-0192", cls: "VI-B", sport: "Athletics", score: 77, att: 88 },
  { name: "Arjun Mehta", id: "GP-0198", cls: "IX-A", sport: "Basketball", score: 70, att: 84 },
  { name: "Saanvi Reddy", id: "GP-0205", cls: "VII-C", sport: "Badminton", score: 63, att: 80 },
];
const EQUIPMENT = [
  ["Football (size 5)", "Football", 40, 28, 4, 8, "Damaged"],
  ["Badminton racquets", "Badminton", 30, 18, 2, 10, "Available"],
  ["Basketballs", "Basketball", 20, 6, 2, 12, "Required"],
  ["Hurdles set", "Athletics", 12, 10, 0, 2, "Available"],
  ["Volleyball nets", "Volleyball", 4, 1, 1, 2, "Required"],
  ["Cones (set of 20)", "Football", 10, 4, 0, 6, "Allocated"],
];
const TAB_LABELS = {
  "p-cal": "Sports calendar", "p-stu": "Student database", "p-me": "My report card", "p-coach": "Coaches",
  "p-eq": "Equipment", "p-inf": "Infrastructure", "p-an": "Analytics",
};
const needsAction = EQUIPMENT.filter((r) => r[6] !== "Available").length;
const ROLES = {
  admin: { name: "School Administrator", tabs: ["p-cal", "p-stu", "p-coach", "p-eq", "p-inf", "p-an"],
    kpis: [[412, "Students (sample)"], [6, "Coaches assigned"], [needsAction, "Equipment items needing action"], [3, "Upcoming events (30 days)"]] },
  coach: { name: "Sports Coach", tabs: ["p-cal", "p-stu", "p-eq"],
    kpis: [[STUDENTS.length, "Students in my groups"], [3, "Upcoming events (30 days)"], [needsAction, "Equipment items needing action"]] },
  student: { name: "Student", tabs: ["p-me", "p-cal"],
    kpis: [[73, "My overall score"], ["90%", "My attendance"], [14, "Matches played"]] },
  parent: { name: "Parent", tabs: ["p-me", "p-cal"],
    kpis: [[73, "Aarav's overall score"], ["90%", "Aarav's attendance"], [3, "Upcoming events (30 days)"]] },
};

const $ = (id) => document.getElementById(id);
const COLOURS = { Scheduled: "var(--navy)", "Registration open": "var(--ok)", "In progress": "var(--warn)", Available: "var(--ok)", Damaged: "var(--red)", Allocated: "var(--navy-2)", Required: "var(--warn)" };
const pill = (text) => `<span class="pill" style="--c:${COLOURS[text]}">${text}</span>`;

function showTab(id) {
  document.querySelectorAll("#tabs button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.p === id)));
  document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("on", p.id === id));
}

function enter(roleKey) {
  const role = ROLES[roleKey];
  $("roleName").textContent = role.name;
  $("kpis").innerHTML = role.kpis.map(([v, k]) => `<div class="kpi"><b>${v}</b><span>${k}</span></div>`).join("");
  $("tabs").innerHTML = role.tabs.map((p) => `<button role="tab" data-p="${p}">${TAB_LABELS[p]}</button>`).join("");
  showTab(role.tabs[0]);
  $("gate").hidden = true;
  $("dash").hidden = false;
}

document.querySelectorAll(".roles button").forEach((b) => b.addEventListener("click", () => enter(b.dataset.role)));
$("signOut").addEventListener("click", () => { $("dash").hidden = true; $("gate").hidden = false; });
$("tabs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) showTab(b.dataset.p); });

$("calBody").innerHTML = EVENTS.map((e) => `<tr><td>${e[0]}</td><td><b>${e[1]}</b></td><td>${e[2]}</td><td>${pill(e[3])}</td></tr>`).join("");

let sort = { key: "name", dir: 1 };
function renderStudents() {
  const q = $("stuSearch").value.toLowerCase();
  const sport = $("stuSport").value;
  const rows = STUDENTS
    .filter((s) => `${s.name} ${s.id} ${s.sport}`.toLowerCase().includes(q) && (!sport || s.sport === sport))
    .sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : -1) * sort.dir);
  $("stuBody").innerHTML = rows.length
    ? rows.map((s) => `<tr><td><b>${s.name}</b><br><small>${s.id}</small></td><td>${s.cls}</td><td>${s.sport}</td><td>${s.score}</td><td>${s.att}%</td></tr>`).join("")
    : `<tr><td colspan="5">No students match your search.</td></tr>`;
}
document.querySelectorAll("[data-sort]").forEach((b) => b.addEventListener("click", () => {
  const key = b.dataset.sort;
  sort = { key, dir: sort.key === key ? -sort.dir : 1 };
  renderStudents();
}));
$("stuSearch").addEventListener("input", renderStudents);
$("stuSport").addEventListener("change", renderStudents);
renderStudents();

function renderEquipment() {
  const status = $("eqFilter").value;
  const rows = EQUIPMENT.filter((r) => !status || r[6] === status);
  $("eqBody").innerHTML = rows.length
    ? rows.map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td>${pill(r[6])}</td></tr>`).join("")
    : `<tr><td colspan="7">No items with this status.</td></tr>`;
}
$("eqFilter").addEventListener("change", renderEquipment);
renderEquipment();

const counts = {};
STUDENTS.forEach((s) => { counts[s.sport] = (counts[s.sport] ?? 0) + 1; });
const max = Math.max(...Object.values(counts));
$("anBars").innerHTML = Object.entries(counts).map(([k, v]) =>
  `<div class="bar rbar"><span>${k}</span><span class="track"><i style="width:${(v / max) * 100}%"></i></span><span>${v}</span></div>`).join("");
