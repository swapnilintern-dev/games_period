// Interactive sample report card. All values are illustrative.
const METRICS = [
  ["end", "Endurance", 72], ["spd", "Speed", 68], ["agi", "Agility", 75], ["fle", "Flexibility", 60],
  ["str", "Strength", 64], ["bal", "Balance", 70], ["coo", "Coordination", 78],
  ["spo", "Sports performance", 74], ["ski", "Skill development", 70],
  ["att", "Attendance & participation", 90], ["imp", "Improvement since last test", 65],
];
const FIT = ["end", "spd", "agi", "fle", "str", "bal", "coo"];
const WEIGHTS = [
  ["fit", "Physical fitness", 30], ["spo", "Sports performance", 25], ["ski", "Skill development", 20],
  ["att", "Participation & consistency", 15], ["imp", "Improvement over time", 10],
];

const $ = (id) => document.getElementById(id);
const slider = (attr, key, label, value, max) =>
  `<label for="${attr}_${key}">${label} <output id="o_${attr}_${key}">${value}</output></label>` +
  `<input type="range" id="${attr}_${key}" min="0" max="${max}" value="${value}" data-${attr}="${key}">`;

$("sliders").innerHTML = METRICS.map(([k, l, v]) => slider("k", k, l, v, 100)).join("");
$("wts").innerHTML = WEIGHTS.map(([k, l, v]) => slider("w", k, l, v, 60)).join("");

const val = (k) => +$(`k_${k}`).value;
const weight = (k) => +$(`w_${k}`).value;
const label = (k) => METRICS.find((m) => m[0] === k)[1];
const gradeOf = (s) =>
  s >= 90 ? ["A+", "Exceptional"] : s >= 80 ? ["A", "Excellent"] : s >= 70 ? ["B+", "Very Good"]
  : s >= 60 ? ["B", "Good"] : s >= 50 ? ["C", "Developing"] : ["D", "Needs Improvement"];

function recalc() {
  document.querySelectorAll(".rc-inputs input[type=range]").forEach((i) => { $(`o_${i.id}`).textContent = i.value; });

  const total = WEIGHTS.reduce((sum, [k]) => sum + weight(k), 0);
  $("wtotal").textContent = total === 100 ? "Weights total 100%." : `Weights total ${total}%. Adjust to reach 100%.`;
  $("wtotal").style.color = total === 100 ? "" : "var(--red-d)";

  const fit = FIT.reduce((sum, k) => sum + val(k), 0) / FIT.length;
  const parts = { fit, spo: val("spo"), ski: val("ski"), att: val("att"), imp: val("imp") };
  const overall = WEIGHTS.reduce((sum, [k]) => sum + parts[k] * weight(k), 0) / (total || 1);
  const [grade, band] = gradeOf(overall);

  $("ovScore").textContent = overall.toFixed(0);
  $("ovGrade").textContent = grade;
  $("ovLabel").textContent = band;
  $("fitScore").textContent = fit.toFixed(0);

  $("bars").innerHTML = FIT.map((k) =>
    `<div class="bar rbar"><span>${label(k)}</span><span class="track"><i style="width:${val(k)}%"></i></span><span>${val(k)}</span></div>`).join("");

  const h = +$("ht").value / 100, w = +$("wt").value;
  if (h > 0 && w > 0) {
    const b = w / (h * h);
    const cat = b < 18.5 ? "below the typical range" : b < 25 ? "within the typical adult range" : "above the typical range";
    $("bmi").textContent = `BMI ${b.toFixed(1)}: ${cat}. Indicative only; for under-18s use age and sex-based percentiles.`;
  }

  const weakest = [...FIT].sort((a, b) => val(a) - val(b)).slice(0, 2).map(label);
  $("recs").innerHTML =
    `<li>Add two focused ${weakest[0]} and ${weakest[1]} drills to each training session.</li>` +
    `<li>Maintain attendance above 85% to keep the participation score strong.</li>` +
    `<li>Pair with the coach for one skill session a week on first touch under pressure.</li>`;
}

document.querySelector(".rc-inputs").addEventListener("input", recalc);
$("printBtn").addEventListener("click", () => window.print());
recalc();
