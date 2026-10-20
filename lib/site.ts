export const SITE_NAME = "Japan Alert Decoder";

export const SITE_TAGLINE =
  "What does that Japanese emergency alert mean, and what do you do? Paste the alert (Japanese or English): Earthquake Early Warning (緊急地震速報), tsunami warnings, the new level-named weather warnings since 2026-05-29 (レベル4土砂災害危険警報 and more), evacuation levels (避難指示), Nankai Trough information, J-ALERT missile alerts, volcano and heat alerts. Get the level, what to do now and the official name in 14 languages.";

export const DISCLAIMER_SHORT =
  "Educational guide, not an alert service: no live data. Always follow official instructions from JMA, your municipality, police, fire and staff. In an emergency, protect yourself first.";

export const HONESTY =
  "Data as of 2026-10-17 from official JMA, Cabinet Office, Cabinet Secretariat (J-ALERT) and Ministry of the Environment pages, with official names from the JMA multilingual dictionary (2026-03-26). Not affiliated with JMA or any government agency.";

export const SIBLING_TOOLS = [
  { href: "https://japan-tax-free-refund.vercel.app", label: "Japan Tax-Free Refund" },
  { href: "https://japan-customs-allowance.vercel.app", label: "Japan Customs Allowance" },
  { href: "https://japan-luggage.vercel.app", label: "Japan Luggage Check" },
  { href: "https://kyushu-travel-discount.vercel.app", label: "Kyushu Travel Discount" },
  { href: "https://japan-visa-fee.vercel.app", label: "Japan Visa Fee Calculator" },
  { href: "https://japan-tb-screening.vercel.app", label: "Japan TB Screening (JPETS)" },
  { href: "https://japan-dual-pricing.vercel.app", label: "Japan Dual Pricing Check" },
  { href: "https://japan-pr-check.vercel.app", label: "Japan PR Guideline Check" },
  { href: "https://japan-intl-postage.vercel.app", label: "Japan International Postage 2027" },
  { href: "https://japan-trip-brain.vercel.app", label: "Japan Trip Brain" },
  { href: "https://free-agent-tools.vercel.app", label: "Free Agent Tools MCP" },
] as const;

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production.replace(/^https?:\/\//, "")}`;
  return "https://japan-alert-decoder.vercel.app";
}
