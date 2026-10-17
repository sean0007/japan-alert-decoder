import { ALERT_IDS, LANGS, SITUATIONS, decodeAlert, getAlert, type Lang, type Situation } from "./alerts";

export const PUBLIC_URL = "https://japan-alert-decoder.vercel.app";

/** Share links: /r?a=<alert id>[&s=<situation>][&l=<lang>] */
type Params = URLSearchParams | Record<string, string | string[] | undefined>;
function one(p: Params, key: string): string | undefined {
  if (p instanceof URLSearchParams) return p.get(key) ?? undefined;
  const v = p[key];
  return Array.isArray(v) ? v[0] : v;
}

export type Shared = { alert: string; situation: Situation | null; lang: Lang | null };

export const EXAMPLE_SHARED: Shared = { alert: "eew-warning", situation: "train", lang: null };
export const EXAMPLE_LANDSLIDE: Shared = { alert: "l4-landslide", situation: null, lang: null };
export const EXAMPLE_TSUNAMI: Shared = { alert: "tsunami-warning", situation: "coast", lang: null };

const IDS = new Set(ALERT_IDS);

export function parseShared(p: Params): Shared | null {
  const a = one(p, "a") ?? one(p, "alert");
  if (!a || !IDS.has(a)) return null;
  const s = one(p, "s");
  if (s && !(SITUATIONS as readonly string[]).includes(s)) return null;
  const l = one(p, "l");
  if (l && !(LANGS as readonly string[]).includes(l)) return null;
  return { alert: a, situation: (s as Situation) ?? null, lang: l && l !== "en" ? (l as Lang) : null };
}

export function sharedQuery(s: Shared): string {
  const q = new URLSearchParams();
  q.set("a", s.alert);
  if (s.situation) q.set("s", s.situation);
  if (s.lang) q.set("l", s.lang);
  return q.toString();
}

export function sharedResult(s: Shared) {
  return decodeAlert({ alert: s.alert, situation: s.situation, lang: s.lang });
}

export const resultPath = (s: Shared) => `/r?${sharedQuery(s)}`;
export const ogPath = (s: Shared) => `/og?${sharedQuery(s)}`;
/** Plain alert pages (no situation / language) are indexable: one canonical page per alert type. */
export const isIndexable = (s: Shared) => !s.situation && !s.lang && !!getAlert(s.alert);

export const COLOR_HEX: Record<string, string> = { white: "#e5e7eb", yellow: "#facc15", red: "#ef4444", purple: "#a855f7", black: "#111111" };
