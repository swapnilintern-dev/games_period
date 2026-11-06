// Single source of truth for every contact detail on the site.
// Change a value here, run `npm run build`, and every page updates.

export const SITE = {
  name: "Games Period",
  tagline: "Beyond Classrooms. Into Champions.",
  domain: "gamesperiod.live",
  url: "https://gamesperiod.live",
  email: "gamesperiod02@gmail.com",
  phone: { e164: "+917061911575", display: "+91 70619 11575" },
  whatsapp: { digits: "918893872107", display: "+91 88938 72107" },
  linkedin: "https://www.linkedin.com/company/games-period/",
  instagram: { url: "https://www.instagram.com/gamesperiodlive/", handle: "@gamesperiodlive" },
  hours: "Mon to Sat, 9:30 AM – 6:00 PM IST",
};

const DEFAULT_WA = "Hello Games Period, I would like to know more about your school sports programme.";
const DEFAULT_SUBJECT = "School sports partnership enquiry";

export const waLink = (text = DEFAULT_WA) =>
  `https://wa.me/${SITE.whatsapp.digits}?text=${encodeURIComponent(text)}`;

export const mailLink = (subject = DEFAULT_SUBJECT) =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;

export const gmailLink = (subject = DEFAULT_SUBJECT) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SITE.email)}&su=${encodeURIComponent(subject)}`;

export const telLink = () => `tel:${SITE.phone.e164}`;
