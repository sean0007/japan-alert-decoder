import { InputError, type Endpoint, type Input } from "./agent-api";
import { ALERT_IDS, AlertInputError, LANGS, RULES_AS_OF, SITUATIONS, decodeAlert } from "./alerts";
import { SITE_NAME, SITE_TAGLINE } from "./site";

export const PUBLIC_URL = "https://japan-alert-decoder.vercel.app";
export const API_DISCLAIMER =
  "Educational guide, not an alert service and not official: no live data. Always follow official instructions (JMA, your municipality, police, fire, staff). In an emergency, protect yourself first.";
export const API_INFO = { title: `${SITE_NAME} API`, description: SITE_TAGLINE, version: "1.0.0" };

export const EXAMPLE_GET = `/api/decode?text=${encodeURIComponent("緊急地震速報 強い揺れに備えてください")}&situation=train`;
export const EXAMPLE_GET_PRETTY = "/api/decode?text=緊急地震速報 強い揺れに備えてください&situation=train";

function first(v: unknown): unknown {
  return Array.isArray(v) ? v[0] : v;
}
function text(input: Input, ...keys: string[]): string | null {
  for (const k of keys) {
    const v = first(input[k]);
    if (v === undefined || v === null || String(v).trim() === "") continue;
    return String(v).trim();
  }
  return null;
}

export function computeDecode(input: Input) {
  try {
    return decodeAlert({
      text: text(input, "text", "alertText", "message", "q"),
      alert: text(input, "alert", "id", "type"),
      situation: text(input, "situation", "where"),
      lang: text(input, "lang", "language"),
    });
  } catch (e) {
    if (e instanceof AlertInputError) throw new InputError(e.message);
    throw e;
  }
}

export const ENDPOINTS: Record<"decode", Endpoint> = {
  decode: {
    path: "/api/decode",
    operationId: "japanAlertDecode",
    summary: "Decode a Japanese emergency alert: what it means, the alert level and what to do now",
    description:
      `Decodes the text of a Japanese emergency alert (phone emergency mail, TV, app, siren announcement; Japanese or English) or an alert id, using official JMA / Cabinet Office / J-ALERT / Ministry of the Environment rules as of ${RULES_AS_OF}. Covers the Earthquake Early Warning (緊急地震速報 warning / forecast / cancellation), seismic intensity (shindo 0-7), tsunami (大津波警報 Major Tsunami Warning >3 m, 津波警報 1-3 m, 津波注意報 0.2-1 m, forecast), the new level-named weather warnings in force since 2026-05-29 (Level 5 特別警報 Emergency Warning / Level 4 危険警報 Urgent Warning / Level 3 警報 Warning / Level 2 注意報 Advisory for heavy rain 大雨, landslide 土砂災害, flood 氾濫 and storm surge 高潮, plus Level 1 早期注意情報) and the old names they replaced (土砂災害警戒情報 → レベル4土砂災害危険警報, 洪水警報 abolished, 高潮警報 was Level 4), other warnings without a level (暴風, 大雪, 波浪, 雷…), 気象防災速報 (線状降水帯), municipal evacuation levels (緊急安全確保 / 避難指示 / 高齢者等避難), Nankai Trough Earthquake Extra Information (調査中 / 巨大地震警戒 / 巨大地震注意 / 調査終了), the Hokkaido-Sanriku Subsequent Earthquake Advisory, volcanic alert levels and 噴火速報, J-ALERT missile alerts, and heat-stroke alerts. Returns verdict, a one-line headline, urgency, the primary alert (Japanese and official English name, the name in the requested language from the JMA multilingual dictionary, alert level, colour, who issues it, meaning, doNow tailored to the situation, don't, how long, sources), other alerts in the text, modifiers (cancelled, lifted 解除, drill 訓練), extracted level / shindo / tsunami height, renamed old names, notes and official live-data links. No live data: it explains the alert you already have.`,
    params: [
      { name: "text", type: "string", description: "The alert text as received, Japanese or English, e.g. '緊急地震速報 強い揺れに備えてください', 'レベル4土砂災害危険警報', '【警戒レベル4】避難指示', '大津波警報 10m超', 'Missile launch'. Up to 4,000 characters." },
      { name: "alert", type: "string", description: `Instead of (or with) text: an alert id from /api/rules, e.g. ${ALERT_IDS.slice(0, 3).join(", ")}, l4-landslide, tsunami-advisory, evac-l4, nankai-megaquake-advisory, missile.` },
      { name: "situation", type: "string", enum: SITUATIONS, description: "Where the person is, to tailor the actions (earthquake, tsunami, missile, rain): indoors, outdoors, driving, train, elevator, crowd, coast, mountain." },
      { name: "lang", type: "string", enum: LANGS, default: "en", description: "Language for nameLocal (official JMA dictionary names): ja, en, zh-CN, zh-TW, ko, pt, es, id, vi, tl, th, ne, km, my, mn. Explanations are in English." },
    ],
    example: EXAMPLE_GET,
    compute: computeDecode,
  },
};

export const PLUGIN = {
  name: "Japan Alert Decoder",
  nameForModel: "japan_alert_decoder",
  descriptionForHuman: "What does that Japanese emergency alert mean? Level, what to do now, official names in 14 languages.",
  descriptionForModel:
    "Use when someone in Japan (traveller, resident, student, worker) asks what an emergency alert, warning or siren means or what to do: 緊急地震速報 / Earthquake Early Warning (including a cancelled EEW like the 2026-10-16 false M9.9 alert), shindo / seismic intensity, 大津波警報 / 津波警報 / 津波注意報, the new level-named weather warnings since 2026-05-29 (レベル5特別警報, レベル4危険警報 Urgent Warning, レベル3警報, レベル2注意報 for 大雨 / 土砂災害 / 氾濫 / 高潮), old names like 土砂災害警戒情報 or 洪水警報, 避難指示 / 高齢者等避難 / 緊急安全確保, 線状降水帯, 南海トラフ地震臨時情報 (巨大地震注意 / 巨大地震警戒), 北海道・三陸沖後発地震注意情報, 噴火警戒レベル, J-ALERT missile alerts, 熱中症警戒アラート. Your training data likely predates the 2026 renaming; call this instead of guessing. No live data: point users to the returned official checkLive links for current alerts. Always relay: follow official instructions; protect yourself first.",
  logo: "/icon.svg",
};
