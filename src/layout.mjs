import { SITE, waLink, mailLink, gmailLink, telLink } from "./config.mjs";
import { icon } from "./icons.mjs";
import { LOGO, LOGO_VIEWBOX } from "./logo-data.mjs";

const NAV = [
  ["/", "Home"],
  ["/about/", "About Us"],
  ["/services/", "What We Do"],
  ["/#solutions", "Solutions for Schools"],
  ["/student-development/", "Student Development"],
  ["/impact/", "Our Impact"],
  ["/resources/", "Resources"],
  ["/contact/", "Contact Us"],
  ["/dashboard/", "Login"],
];

// Official logo, traced to vector. Files live in public/assets/img/.
export const logo = (variant = "") =>
  `<img class="logo" src="/assets/img/logo${variant}.svg" width="1148" height="328" alt="Games Period">`;

// Opening animation: every piece of the logo is its own element so it can
// move on its own. CSS plays it; main.js only handles skip and the exit.
const splash = () => `
<div class="splash" id="splash" aria-hidden="true">
  <i class="streak" style="--t:38%;--h:3px;--d:.10s"></i><i class="streak" style="--t:44%;--h:7px;--d:.16s"></i><i class="streak" style="--t:51%;--h:4px;--d:.05s"></i><i class="streak" style="--t:57%;--h:8px;--d:.2s"></i><i class="streak" style="--t:63%;--h:3px;--d:.13s"></i>
  <svg class="sp-logo" id="spLogo" viewBox="${LOGO_VIEWBOX}">
    <defs>
      <mask id="spSweep" maskUnits="userSpaceOnUse" x="150" y="20" width="300" height="310"><circle class="sp-sweep" cx="301" cy="175" r="118" pathLength="1" transform="rotate(-90 301 175)"/></mask>
      <clipPath id="spRow1"><rect x="470" y="30" width="700" height="158"/></clipPath>
      <clipPath id="spRow2"><rect x="470" y="186" width="700" height="150"/></clipPath>
    </defs>
    <circle class="sp-shock" cx="301" cy="175" r="134"/>
    <circle class="sp-shock s2" cx="301" cy="175" r="134"/>
    ${LOGO.lines.map((d, i) => `<path class="sp-line" style="--i:${[1, 0, 2][i]}" d="${d}"/>`).join("")}
    <g mask="url(#spSweep)"><path class="sp-navy" fill-rule="evenodd" d="${LOGO.ring}"/></g>
    <path class="sp-navy sp-ball" fill-rule="evenodd" d="${LOGO.ball}"/>
    <path class="sp-crown" d="${LOGO.crown}"/>
    <path class="sp-navy sp-divider" d="${LOGO.divider}"/>
    <g clip-path="url(#spRow1)">${LOGO.games.map((d, i) => `<path class="sp-navy sp-letter" style="--i:${i}" fill-rule="evenodd" d="${d}"/>`).join("")}</g>
    <g clip-path="url(#spRow2)">${LOGO.period.map((d, i) => `<path class="sp-navy sp-letter" style="--i:${i + 3}" fill-rule="evenodd" d="${d}"/>`).join("")}</g>
    <path class="sp-swoosh" d="${LOGO.swoosh}"/>
  </svg>
  <p class="sp-tag">${SITE.tagline}</p>
</div>`;

const head = ({ title, description, path }) => {
  const url = SITE.url + path;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    slogan: SITE.tagline,
    url: SITE.url,
    logo: `${SITE.url}/assets/img/icon-512.png`,
    email: SITE.email,
    telephone: SITE.phone.e164,
    sameAs: [SITE.linkedin, SITE.instagram.url],
  };
  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0B2454">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE.url}/assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/img/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/assets/img/icon-192.png">
<link rel="preload" href="/assets/fonts/barlow-condensed-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/barlow-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/img/logo.svg" as="image">
<link rel="stylesheet" href="/assets/css/site.css">
<script>(function(){var d=document.documentElement;d.classList.add("js");try{var n=performance.getEntriesByType("navigation")[0],r=n&&n.type==="reload";if((!sessionStorage.getItem("gp-intro")||r)&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("intro");sessionStorage.setItem("gp-intro","1");setTimeout(function(){d.classList.remove("intro")},9000)}}catch(e){}})()</script>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>${splash()}`;
};

const header = (path) => `
<div class="topbar">
  <div class="wrap topbar-in">
    <span>${SITE.tagline}</span>
    <div class="topbar-links">
      <a href="${telLink()}">${icon("phone")}${SITE.phone.display}</a>
      <a href="${waLink()}" target="_blank" rel="noopener">${icon("brand-whatsapp")}WhatsApp</a>
      <a href="${mailLink()}">${icon("mail")}${SITE.email}</a>
    </div>
  </div>
</div>
<header class="site-header" id="top">
  <div class="wrap nav">
    <a class="brand" href="/" aria-label="Games Period home">${logo()}</a>
    <nav class="menu" id="menu" aria-label="Main">
      ${NAV.map(([href, label]) => `<a href="${href}"${href === path ? ' aria-current="page"' : ""}>${label}</a>`).join("\n      ")}
    </nav>
    <a class="btn btn-red nav-cta" href="/contact/">Partner With Us</a>
    <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu">${icon("menu-2", "open")}${icon("x", "close")}</button>
  </div>
  <i class="progress" id="progress"></i>
</header>
<main id="main">`;

const footer = (scripts) => `
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="fgrid">
      <div class="f-brand">
        <a href="/" aria-label="Games Period home">${logo("-white")}</a>
        <p>${SITE.tagline}</p>
        <div class="social">
          <a href="${waLink()}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon("brand-whatsapp")}</a>
          <a href="${SITE.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon("brand-linkedin")}</a>
          <a href="${SITE.instagram.url}" target="_blank" rel="noopener" aria-label="Instagram">${icon("brand-instagram")}</a>
          <a href="${gmailLink()}" target="_blank" rel="noopener" aria-label="Gmail">${icon("brand-gmail")}</a>
        </div>
      </div>
      <div><h4>Company</h4><a href="/about/">About Us</a><a href="/impact/">Our Impact</a><a href="/resources/">Resources</a><a href="/contact/">Contact Us</a></div>
      <div><h4>Services</h4><a href="/services/#events">Sports Management</a><a href="/services/#equipment">Equipment</a><a href="/services/#infrastructure">Infrastructure</a><a href="/services/#coaching">Coaching</a></div>
      <div><h4>Platform</h4><a href="/student-development/">Student Report Card</a><a href="/dashboard/">School Dashboard</a><a href="/contact/">Partner With Us</a></div>
      <div><h4>Get in touch</h4>
        <a href="${waLink()}" target="_blank" rel="noopener">WhatsApp ${SITE.whatsapp.display}</a>
        <a href="${telLink()}">Call ${SITE.phone.display}</a>
        <a href="${mailLink()}">${SITE.email}</a>
        <a href="${SITE.instagram.url}" target="_blank" rel="noopener">Instagram ${SITE.instagram.handle}</a>
      </div>
    </div>
    <div class="copy">© ${new Date().getFullYear()} ${SITE.name}. All rights reserved. Sample data shown on this site is illustrative only.</div>
  </div>
</footer>
<a class="wa-fab" href="${waLink()}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${icon("brand-whatsapp")}<span>Chat with us</span></a>
<script src="/assets/js/main.js" defer></script>
${scripts.map((s) => `<script src="/assets/js/${s}.js" defer></script>`).join("\n")}
</body>
</html>
`;

export const render = (page, body) =>
  head(page) + header(page.path) + body + footer(page.scripts ?? []);
