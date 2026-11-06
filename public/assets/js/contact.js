// Partnership form. There is no server: a valid form becomes a ready-to-send
// message in WhatsApp, Gmail or the visitor's email app.
const WA_NUMBER = "918893872107";
const EMAIL = "gamesperiod02@gmail.com";

const form = document.getElementById("leadForm");
const sent = document.getElementById("sent");
const svcErr = document.getElementById("svcErr");

function validate() {
  let firstBad = null;
  form.querySelectorAll(".field input:not([type=checkbox])").forEach((input) => {
    const value = input.value.trim();
    let msg = "";
    if (input.required && !value) msg = "This field is required.";
    else if (input.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = "Enter a valid email address.";
    else if (input.type === "tel" && value && !/^[+\d\s-]{7,15}$/.test(value)) msg = "Enter a valid phone number.";
    input.closest(".field").querySelector(".err").textContent = msg;
    input.setAttribute("aria-invalid", String(Boolean(msg)));
    if (msg && !firstBad) firstBad = input;
  });
  const hasService = form.querySelector("input[name=svc]:checked");
  svcErr.textContent = hasService ? "" : "Select at least one service.";
  if (!hasService && !firstBad) firstBad = form.querySelector("input[name=svc]");
  if (firstBad) firstBad.focus();
  return !firstBad;
}

function message() {
  const data = new FormData(form);
  const line = (label, key) => {
    const value = String(data.get(key) ?? "").trim();
    return value ? `${label}: ${value}` : null;
  };
  return [
    "Hello Games Period, we would like to partner with you.",
    "",
    line("School", "school"),
    line("Principal", "principal"),
    line("Contact designation", "designation"),
    line("Email", "email"),
    line("Phone", "phone"),
    `Location: ${data.get("city").trim()}, ${data.get("state").trim()}`,
    line("Students", "students"),
    line("Facilities", "facilities"),
    `Services: ${data.getAll("svc").join(", ")}`,
    line("Notes", "notes"),
  ].filter((l) => l !== null).join("\n");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  sent.hidden = true;
  if (!validate()) return;

  const body = encodeURIComponent(message());
  const subject = encodeURIComponent(`Partnership request: ${form.school.value.trim()}`);
  const via = e.submitter?.dataset.via ?? "whatsapp";

  if (via === "email") {
    location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  } else {
    const url = via === "gmail"
      ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}&su=${subject}&body=${body}`
      : `https://wa.me/${WA_NUMBER}?text=${body}`;
    window.open(url, "_blank", "noopener");
  }
  sent.hidden = false;
});
