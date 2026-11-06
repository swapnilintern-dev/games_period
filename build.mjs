// Zero-dependency static build: src/pages/*.html + layout -> dist/
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { SITE, waLink, mailLink, gmailLink, telLink } from "./src/config.mjs";
import { render, logo } from "./src/layout.mjs";
import { icon } from "./src/icons.mjs";

const PAGES = [
  { src: "home", path: "/", scripts: ["home"],
    title: `${SITE.name} | ${SITE.tagline}`,
    description: "Games Period helps Indian schools build structured sports programmes, develop student talent, improve fitness and create opportunities for the next generation of athletes." },
  { src: "about", path: "/about/",
    title: `About Us | ${SITE.name}`,
    description: "Games Period is an Indian sports development and school management company. Built for schools, driven by sport." },
  { src: "services", path: "/services/",
    title: `What We Do | ${SITE.name}`,
    description: "Event management, equipment, infrastructure, coaching and student development: five connected services for Indian schools." },
  { src: "students", path: "/student-development/", scripts: ["report"],
    title: `Student Sports Report Card | ${SITE.name}`,
    description: "An individual digital fitness and sports profile for every student. Try the interactive sample report card." },
  { src: "impact", path: "/impact/",
    title: `Our Impact | ${SITE.name}`,
    description: "What Games Period measures in every partner school, and the five-stage roadmap that gets a school there." },
  { src: "resources", path: "/resources/",
    title: `Resources | ${SITE.name}`,
    description: "Practical guides and templates for principals, sports teachers and parents." },
  { src: "contact", path: "/contact/", scripts: ["contact"],
    title: `Contact Us | ${SITE.name}`,
    description: "Talk to Games Period on WhatsApp, phone, email, LinkedIn or Instagram, or send a partnership request." },
  { src: "dashboard", path: "/dashboard/", scripts: ["dashboard"],
    title: `School Dashboard | ${SITE.name}`,
    description: "Preview the Games Period management platform: calendar, students, coaches, equipment, infrastructure and analytics." },
  { src: "404", path: "/404.html", out: "404.html", noindex: true,
    title: `Page not found | ${SITE.name}`,
    description: "This page could not be found." },
];

// Tokens: {{wa}} {{wa|message}} {{mail}} {{mail|subject}} {{gmail}} {{gmail|subject}}
//         {{tel}} {{icon:name}} {{logo}} {{site.key}}
const expand = (html) =>
  html.replace(/\{\{([^}]+)\}\}/g, (token, inner) => {
    const [key, arg] = inner.split("|");
    if (key === "wa") return waLink(arg);
    if (key === "mail") return mailLink(arg);
    if (key === "gmail") return gmailLink(arg);
    if (key === "tel") return telLink();
    if (key === "logo") return logo();
    if (key.startsWith("icon:")) return icon(key.slice(5));
    if (key.startsWith("site.")) {
      const value = key.slice(5).split(".").reduce((o, k) => o?.[k], SITE);
      if (value !== undefined) return value;
    }
    throw new Error(`Unknown token ${token}`);
  });

rmSync("dist", { recursive: true, force: true });
cpSync("public", "dist", { recursive: true });

for (const page of PAGES) {
  const body = expand(readFileSync(`src/pages/${page.src}.html`, "utf8"));
  const out = join("dist", page.out ?? join(page.path, "index.html"));
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, render(page, body));
}

const urls = PAGES.filter((p) => !p.noindex).map((p) => `  <url><loc>${SITE.url}${p.path}</loc></url>`);
writeFileSync("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
writeFileSync("dist/robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE.url}/sitemap.xml\n`);
console.log(`Built ${PAGES.length} pages into dist/`);
