import { JMA_NAMES, NAME_LANGS, type NameLang } from "./alert-names";

/**
 * Japan Alert Decoder: what a Japanese emergency alert means and what to do.
 * Data as of 2026-10-17, from official JMA / Cabinet Office / Cabinet Secretariat / Ministry of the Environment pages
 * (snapshots in money-research/japan-alert-sources). No live data: this decodes the alert you already have.
 */
export const RULES_AS_OF = "2026-10-17";
export const NEW_WEATHER_INFO_SINCE = "2026-05-29";

export const S = {
  jmaNew: "https://www.jma.go.jp/jma/kishou/know/bosai/keiho-update2026/index.html",
  jmaNewEn: "https://www.jma.go.jp/jma/kishou/know/bosai/keiho-update2026/pdf/english_info2026.pdf",
  jmaNewOutline: "https://www.jma.go.jp/jma/kishou/know/bosai/keiho-update2026/pdf/outline_info2026.pdf",
  jmaNewLeaflet: "https://www.jma.go.jp/jma/kishou/know/bosai/keiho-update2026/pdf/info2026_english_leaflet.pdf",
  jmaWxinfo: "https://www.jma.go.jp/jma/kishou/know/bosai/keiho-update2026/pdf/wxinfo_info2026.pdf",
  jmaStart: "https://www.jma.go.jp/jma/press/2604/14b/20260414_taikeiseiri.html",
  jmaAlertLevel: "https://www.jma.go.jp/jma/kishou/know/bosai/alertlevel.html",
  jmaEmergencyEn: "https://www.jma.go.jp/jma/en/Emergency_Warning/ew_index.html",
  jmaEew: "https://www.jma.go.jp/jma/kishou/know/jishin/eew/index.html",
  jmaEewCriteria: "https://www.jma.go.jp/jma/kishou/know/jishin/eew/shikumi/shousai.html",
  jmaEewActions: "https://www.jma.go.jp/jma/kishou/know/jishin/eew/koudou/koudou.html",
  jmaEewEn: "https://www.jma.go.jp/jma/en/Activities/eew1.html",
  jmaEewFalse: "https://www.jma.go.jp/jma/press/2610/16c/202610161730.html",
  jmaEewFix: "https://www.jma.go.jp/jma/press/2610/16d/kaisetsu202610162240.pdf",
  jmaShindo: "https://www.jma.go.jp/jma/en/Activities/inttable.html",
  jmaTsunami: "https://www.data.jma.go.jp/eqev/data/joho/tsunamiinfo.html",
  jmaQuakeEn: "https://www.jma.go.jp/jma/en/Activities/earthquake.html",
  jmaNankai: "https://www.jma.go.jp/jma/kishou/know/jishin/nteq/index.html",
  jmaHokkaido: "https://www.jma.go.jp/jma/kishou/know/jishin/nceq_info_criterion.html",
  jmaMultilingual: "https://www.data.jma.go.jp/developer/multilingual.html",
  jmaTagengo: "https://www.jma.go.jp/jma/kishou/know/jishin/tagengo/tagengo.html",
  caoNankai: "https://www.bousai.go.jp/jishin/nankai/rinji/index4.html",
  caoHokkaido: "https://www.bousai.go.jp/jishin/nihonkaiko_chishima/hokkaido/index3.html",
  caoEvac: "https://www.bousai.go.jp/oukyu/hinanjouhou/r3_hinanjouhou_guideline/",
  caoEvacEn: "https://www.bousai.go.jp/kyoiku/gaikoku/pdf/02_training_material_EN.pdf",
  jAlert: "https://www.kokuminhogo.go.jp/en/pc-index_e.html",
  jAlertActions: "https://www.kokuminhogo.go.jp/en/pdf/action(English).pdf",
  heat: "https://www.wbgt.env.go.jp/en/",
  volcano: "https://www.data.jma.go.jp/vois/data/tokyo/STOCK/kaisetsu/English/level.html",
} as const;

export const SOURCES: string[] = [...new Set(Object.values(S))];

export const LIVE_LINKS = [
  { label: "JMA warnings map (English)", url: "https://www.jma.go.jp/bosai/map.html#contents=warning&lang=en" },
  { label: "JMA earthquake information (English)", url: "https://www.jma.go.jp/bosai/map.html#contents=earthquake_map&lang=en" },
  { label: "JMA tsunami information (English)", url: "https://www.jma.go.jp/bosai/map.html#contents=tsunami&lang=en" },
  { label: "KIKIKURU risk map (English)", url: "https://www.jma.go.jp/bosai/risk/#lang=en" },
  { label: "Safety tips app (Japan Tourism Agency)", url: "https://www.jnto.go.jp/safety-tips/eng/app.html" },
] as const;

export type Family = "earthquake" | "tsunami" | "megaquake" | "weather-level" | "weather" | "weather-bulletin" | "evacuation" | "volcano" | "missile" | "heat";
export type Urgency = "act_now" | "evacuate_now" | "evacuate_if_vulnerable" | "prepare" | "stay_alert" | "info";
export type Color = "white" | "yellow" | "red" | "purple" | "black";

export const URGENCY_RANK: Record<Urgency, number> = { act_now: 6, evacuate_now: 5, evacuate_if_vulnerable: 4, prepare: 3, stay_alert: 2, info: 1 };
export const URGENCY_LABEL: Record<Urgency, string> = {
  act_now: "Act now: protect yourself",
  evacuate_now: "Evacuate now from dangerous places",
  evacuate_if_vulnerable: "Elderly / slow evacuees go now; others get ready",
  prepare: "Prepare and check your route",
  stay_alert: "Stay alert and check updates",
  info: "Information",
};

export type Alert = {
  id: string;
  family: Family;
  nameJa: string;
  nameEn: string;
  /** Key in the JMA multilingual dictionary, when it has this term. */
  dictJa?: string;
  aliases: string[];
  /** 警戒レベル (alert level) equivalent 1-5 for weather / evacuation, or the volcanic alert level. */
  level: number | null;
  levelKind: "alert-level" | "volcanic-alert-level" | null;
  color: Color | null;
  urgency: Urgency;
  issuedBy: string;
  meaning: string;
  doNow: string[];
  dont?: string[];
  howLong?: string;
  note?: string;
  since?: string;
  sources: string[];
};

export type Legacy = { nameJa: string; aliases: string[]; replacedBy: string[]; note: string };

// ───────────────────────── Earthquake ─────────────────────────
const EARTHQUAKE: Alert[] = [
  {
    id: "eew-warning",
    family: "earthquake",
    nameJa: "緊急地震速報（警報）",
    nameEn: "Earthquake Early Warning (EEW)",
    dictJa: "緊急地震速報",
    aliases: ["緊急地震速報", "緊急地震速報(警報)", "強い揺れに警戒", "強い揺れに備えて", "earthquake early warning", "eew", "strong shaking is expected", "strong tremors are expected", "jishin sokuho"],
    level: null,
    levelKind: null,
    color: null,
    urgency: "act_now",
    issuedBy: "Japan Meteorological Agency (JMA); pushed to every phone in the area by the carriers (loud buzzer), plus TV and radio",
    meaning:
      "An earthquake has just started and strong shaking (seismic intensity 5-lower or more, or long-period ground motion class 3+) is predicted. JMA sends it when two or more seismometers detect the quake; the areas named expect intensity 4 or more. You have seconds to tens of seconds, or none if you are near the epicentre. It is a prediction: real shaking can be stronger or weaker, and it does not say exactly when shaking arrives.",
    doNow: [
      "Protect yourself first: take cover under a sturdy table or desk and protect your head.",
      "Stay away from windows, shelves, TVs and anything that can fall.",
      "Do not rush outside and do not try to put out fires until the shaking stops.",
      "Tell people around you.",
      "When the shaking stops: if you are near the coast, check for a tsunami warning; then check for fire and gas.",
    ],
    dont: ["Don't run outside during shaking (falling glass, signs, tiles).", "Don't use elevators.", "Don't brake suddenly while driving."],
    howLong: "Shaking lasts seconds to minutes. Aftershocks are common for days, and strong ones can follow.",
    note:
      "On 2026-10-16 at 12:40 JST JMA issued an EEW (warning) from Hokkaido to Chubu after over-estimating a distant quake as M9.9 near the Kuril Islands; it was later cancelled. JMA says a filter that ignores stations more than 700 km away had not worked; it fixed it at about 21:30 that day and apologised. False alarms are rare, so act on every EEW.",
    sources: [S.jmaEew, S.jmaEewCriteria, S.jmaEewActions, S.jmaEewEn, S.jmaEewFalse, S.jmaEewFix, S.jmaTagengo],
  },
  {
    id: "eew-forecast",
    family: "earthquake",
    nameJa: "緊急地震速報（予報）",
    nameEn: "Earthquake Early Warning (forecast)",
    aliases: ["緊急地震速報(予報)", "eew forecast", "eew (forecast)"],
    level: null,
    levelKind: null,
    color: null,
    urgency: "stay_alert",
    issuedBy: "JMA (used by some apps and devices; not the phone-wide emergency alert)",
    meaning:
      "A lower-level early estimate (issued for about M3.5+ or predicted intensity 3+). Phones in Japan sound the area-wide alarm only for the warning version; a forecast in an app means weaker shaking is likely.",
    doNow: ["Be ready to protect yourself if shaking starts.", "Stay away from things that can fall."],
    sources: [S.jmaEewCriteria, S.jmaEew],
  },
  {
    id: "eew-cancel",
    family: "earthquake",
    nameJa: "緊急地震速報の取消し",
    nameEn: "EEW cancelled",
    dictJa: "先ほど発表した緊急地震速報を取り消します",
    aliases: ["先ほど発表した緊急地震速報を取り消します", "緊急地震速報を取り消します", "緊急地震速報の取消", "緊急地震速報の取り消し", "緊急地震速報を取り消", "eew cancelled", "eew canceled", "jma has cancelled the eew", "cancelled the earthquake early warning"],
    level: null,
    levelKind: null,
    color: null,
    urgency: "info",
    issuedBy: "JMA",
    meaning:
      "JMA has withdrawn the Earthquake Early Warning: it was triggered by something that was not the predicted quake (noise, or a mis-located or over-estimated event). The warned strong shaking is not expected. If you actually felt strong shaking, treat it as a real earthquake.",
    doNow: ["You can stop sheltering if you felt no strong shaking.", "Check JMA's earthquake information for what actually happened.", "Keep your phone's emergency alerts on: the next one may be real."],
    note: "Example: the 2026-10-16 12:40 JST warning (estimated M9.9) was cancelled; JMA fixed the cause at about 21:30 that day.",
    sources: [S.jmaEewFalse, S.jmaEewFix, S.jmaTagengo],
  },
  {
    id: "shindo-report",
    family: "earthquake",
    nameJa: "震度速報・震源・震度に関する情報",
    nameEn: "Seismic intensity information",
    dictJa: "震源・震度に関する情報",
    aliases: ["震度速報", "震源・震度に関する情報", "震源・震度情報", "震度情報", "地震情報", "seismic intensity information", "information on hypocenter and seismic intensity", "earthquake information"],
    level: null,
    levelKind: null,
    color: null,
    urgency: "info",
    issuedBy: "JMA",
    meaning:
      "A report after a quake: where it was, how big (magnitude) and the seismic intensity (shindo, 0-7) measured in each area. Shindo is how strongly the ground shook where you are, not the size of the quake. It also says whether there is a tsunami risk (この地震による津波の心配はありません = no tsunami risk).",
    doNow: ["Check the intensity for your area (see the shindo scale).", "If a tsunami warning or advisory is in effect and you are near the coast, move away from the coast now.", "Expect aftershocks."],
    sources: [S.jmaQuakeEn, S.jmaShindo, S.jmaTagengo],
  },
];

// ───────────────────────── Tsunami ─────────────────────────
const TSUNAMI: Alert[] = [
  {
    id: "major-tsunami-warning",
    family: "tsunami",
    nameJa: "大津波警報",
    nameEn: "Major Tsunami Warning",
    dictJa: "大津波警報",
    aliases: ["大津波警報", "major tsunami warning"],
    level: null,
    levelKind: null,
    color: "purple",
    urgency: "evacuate_now",
    issuedBy: "JMA (a special-warning class alert)",
    meaning:
      "A tsunami higher than 3 m is expected. Heights are announced as 5 m, 10 m or over 10 m; right after a huge quake JMA may only say 巨大 (huge). Near the source, waves can arrive within minutes.",
    doNow: [
      "Evacuate immediately to high ground or a tsunami evacuation building (津波避難ビル), as high as you can.",
      "Go on foot unless you must drive; leave the coast and river mouths.",
      "Don't go back: tsunami waves repeat for hours and later waves can be bigger.",
    ],
    dont: ["Don't go to the shore to look.", "Don't wait to confirm the height."],
    howLong: "Stay evacuated until the warning is lifted (解除), often many hours.",
    sources: [S.jmaTsunami, S.jmaQuakeEn, S.jmaTagengo],
  },
  {
    id: "tsunami-warning",
    family: "tsunami",
    nameJa: "津波警報",
    nameEn: "Tsunami Warning",
    dictJa: "津波警報",
    aliases: ["津波警報", "tsunami warning"],
    level: null,
    levelKind: null,
    color: "red",
    urgency: "evacuate_now",
    issuedBy: "JMA",
    meaning: "A tsunami of 1-3 m is expected (announced as 3 m, or 高い = high). That is enough to sweep people away and flood low coastal areas.",
    doNow: ["Evacuate immediately from coastal and riverside areas to high ground or an evacuation building.", "Stay there until the warning is lifted."],
    dont: ["Don't go to the shore to look.", "Don't return when the first wave passes."],
    howLong: "Stay away until it is lifted (解除); waves repeat.",
    sources: [S.jmaTsunami, S.jmaTagengo],
  },
  {
    id: "tsunami-advisory",
    family: "tsunami",
    nameJa: "津波注意報",
    nameEn: "Tsunami Advisory",
    dictJa: "津波注意報",
    aliases: ["津波注意報", "tsunami advisory"],
    level: null,
    levelKind: null,
    color: "yellow",
    urgency: "evacuate_now",
    issuedBy: "JMA",
    meaning: "A tsunami of 0.2-1 m is expected (announced as 1 m). Strong currents can knock people over and sweep them away even at this height.",
    doNow: ["Get out of the water and leave the beach, harbour and river mouths now.", "Stay away from the coast until the advisory is lifted."],
    howLong: "Until it is lifted (解除).",
    sources: [S.jmaTsunami, S.jmaTagengo],
  },
  {
    id: "tsunami-forecast",
    family: "tsunami",
    nameJa: "津波予報（若干の海面変動）",
    nameEn: "Tsunami Forecast (slight sea-level change)",
    dictJa: "津波予報",
    aliases: ["津波予報", "若干の海面変動", "tsunami forecast", "slight sea level change", "slight sea-level change"],
    level: null,
    levelKind: null,
    color: null,
    urgency: "info",
    issuedBy: "JMA",
    meaning: "Sea level may change slightly (under 0.2 m). No damage is expected; take care if you are fishing or swimming.",
    doNow: ["No evacuation needed. Take care at the water's edge."],
    sources: [S.jmaTsunami],
  },
  {
    id: "no-tsunami",
    family: "tsunami",
    nameJa: "津波の心配なし",
    nameEn: "No tsunami risk",
    aliases: ["この地震による津波の心配はありません", "津波の心配はありません", "津波の心配なし", "no tsunami risk", "poses no tsunami risk", "no threat of tsunami", "no tsunami threat"],
    level: null,
    levelKind: null,
    color: null,
    urgency: "info",
    issuedBy: "JMA",
    meaning: "This earthquake will not cause a damaging tsunami.",
    doNow: ["No need to evacuate for a tsunami. Expect aftershocks."],
    sources: [S.jmaTagengo, S.jmaTsunami],
  },
];

// ───────────────────────── Megaquake advisories ─────────────────────────
const MEGAQUAKE: Alert[] = [
  {
    id: "nankai-investigating",
    family: "megaquake",
    nameJa: "南海トラフ地震臨時情報（調査中）",
    nameEn: "Nankai Trough Earthquake Extra Information (Under Analysis)",
    dictJa: "南海トラフ地震臨時情報",
    aliases: ["南海トラフ地震臨時情報(調査中)", "臨時情報(調査中)", "nankai trough earthquake extra information (under analysis)"],
    level: null,
    levelKind: null,
    color: null,
    urgency: "stay_alert",
    issuedBy: "JMA",
    meaning:
      "Something unusual (for example an M6.8+ quake) happened in or near the Nankai Trough area (the Pacific coast from Shizuoka to Kyushu), and experts are checking whether a megaquake has become more likely. Issued 5-30 minutes after the event; the result comes at the earliest about 2 hours after the quake.",
    doNow: ["Get ready to evacuate quickly if you are in a tsunami area.", "Watch for the next update: 巨大地震警戒, 巨大地震注意 or 調査終了."],
    sources: [S.caoNankai, S.jmaNankai],
  },
  {
    id: "nankai-megaquake-warning",
    family: "megaquake",
    nameJa: "南海トラフ地震臨時情報（巨大地震警戒）",
    nameEn: "Nankai Trough Earthquake Extra Information (Megathrust Earthquake Alert)",
    dictJa: "巨大地震警戒",
    aliases: ["南海トラフ地震臨時情報(巨大地震警戒)", "巨大地震警戒", "megathrust earthquake alert", "megaquake warning"],
    level: null,
    levelKind: null,
    color: null,
    urgency: "evacuate_if_vulnerable",
    issuedBy: "JMA, with government and municipal calls for action",
    meaning:
      "A large quake (about Mw8+) has hit part of the Nankai Trough, so a second megaquake is relatively more likely. It is not a prediction that one will happen.",
    doNow: [
      "If your municipality says so (areas a tsunami could reach before you can escape), pre-evacuate for one week.",
      "Everyone else: re-check your emergency kit, furniture fixing and evacuation route, and be ready to evacuate at once if a quake hits.",
    ],
    howLong: "About one week of pre-evacuation, then another week of heightened caution.",
    sources: [S.caoNankai, S.jmaNankai],
  },
  {
    id: "nankai-megaquake-advisory",
    family: "megaquake",
    nameJa: "南海トラフ地震臨時情報（巨大地震注意）",
    nameEn: "Nankai Trough Earthquake Extra Information (Megathrust Earthquake Attention)",
    dictJa: "巨大地震注意",
    aliases: ["南海トラフ地震臨時情報(巨大地震注意)", "巨大地震注意", "megathrust earthquake attention", "megaquake advisory"],
    level: null,
    levelKind: null,
    color: null,
    urgency: "prepare",
    issuedBy: "JMA, with government calls for action",
    meaning:
      "A quake of about M7+ (or unusual slow slip) occurred in the Nankai Trough area, so a megaquake is relatively more likely than usual. No pre-evacuation. It was first issued in August 2024.",
    doNow: ["Live normally but re-check your preparations (water, food, furniture, evacuation route).", "Be ready to evacuate immediately if you feel a quake, especially near the coast."],
    howLong: "About one week of heightened caution.",
    sources: [S.caoNankai, S.jmaNankai],
  },
  {
    id: "nankai-investigation-ended",
    family: "megaquake",
    nameJa: "南海トラフ地震臨時情報（調査終了）",
    nameEn: "Nankai Trough Earthquake Extra Information (Analysis Complete)",
    dictJa: "調査終了",
    aliases: ["南海トラフ地震臨時情報(調査終了)", "調査終了", "analysis complete"],
    level: null,
    levelKind: null,
    color: null,
    urgency: "info",
    issuedBy: "JMA",
    meaning: "Experts found the event did not raise the megaquake risk enough for an alert or attention call.",
    doNow: ["Go back to normal life. A large earthquake can still happen at any time, so keep your usual preparations."],
    sources: [S.caoNankai, S.jmaNankai],
  },
  {
    id: "hokkaido-sanriku-advisory",
    family: "megaquake",
    nameJa: "北海道・三陸沖後発地震注意情報",
    nameEn: "Off the coast of Hokkaido and Sanriku Subsequent Earthquake Advisory",
    dictJa: "北海道・三陸沖後発地震注意情報",
    aliases: ["北海道・三陸沖後発地震注意情報", "後発地震注意情報", "subsequent earthquake advisory"],
    level: null,
    levelKind: null,
    color: null,
    urgency: "prepare",
    issuedBy: "JMA and the Cabinet Office",
    meaning:
      "An Mw7.0+ earthquake happened off Hokkaido / Sanriku (Japan Trench / Kuril Trench), so a following megaquake is relatively more likely for about a week. Issued about 2 hours after the first quake for Pacific coast areas from Hokkaido to Chiba. It is not a prediction.",
    doNow: ["Keep daily life, but sleep in clothes you can evacuate in and keep shoes and an emergency bag by the door.", "Be ready to evacuate at once if you feel shaking or get a tsunami warning."],
    howLong: "About one week (168 hours).",
    sources: [S.caoHokkaido, S.jmaHokkaido],
  },
];

// ───────────────────────── Weather: level-named (since 2026-05-29) ─────────────────────────
type Hazard = { id: string; ja: string; en: string; area: string; avoid: string; extra?: Partial<Record<2 | 3 | 4 | 5, string>> };
const HAZARDS: Hazard[] = [
  {
    id: "heavy-rain",
    ja: "大雨",
    en: "Heavy Rain",
    area: "flooding of low-lying land, underpasses, basements and small rivers (since 2026-05-29 this also covers the river flooding the old 洪水警報 warned about)",
    avoid: "low-lying areas, underpasses, basements and small rivers or channels",
  },
  {
    id: "landslide",
    ja: "土砂災害",
    en: "Landslide",
    area: "landslides, debris flows and slope collapses",
    avoid: "steep slopes, cliffs and valleys (streams coming out of mountains)",
    extra: { 3: "The new Level 3 landslide warning is issued much less often than the old 大雨警報（土砂災害）; when you see it, a Level 4 Urgent Warning is likely soon." },
  },
  {
    id: "flood",
    ja: "氾濫",
    en: "Flood",
    area: "a named major river overflowing (the alert names the river)",
    avoid: "riverbanks and land near the named river",
    extra: { 5: "Level 5 for a river means it has already overflowed (old name: 氾濫発生情報)." },
  },
  {
    id: "storm-surge",
    ja: "高潮",
    en: "Storm Surge",
    area: "sea water flooding the coast during a typhoon or deep low",
    avoid: "the coast, harbours and low coastal land",
    extra: {
      5: "Since 2026-05-29 the Level 5 storm-surge warning is issued when flooding is happening or imminent.",
      3: "Careful: before 2026-05-29 a plain 高潮警報 was Level 4 equivalent; now レベル3高潮警報 is Level 3 and Level 4 is レベル4高潮危険警報.",
    },
  },
];

type LevelClass = { level: 2 | 3 | 4 | 5; ja: string; en: string; color: Color; urgency: Urgency; meaning: string; doNow: string[] };
const LEVEL_CLASSES: LevelClass[] = [
  {
    level: 5,
    ja: "特別警報",
    en: "Emergency Warning",
    color: "black",
    urgency: "act_now",
    meaning: "Black, Alert Level 5 equivalent: a disaster is probably already happening or imminent. Your life is in danger.",
    doNow: [
      "Take the safest action you can right now; it may be too late to go to a shelter.",
      "If going outside is dangerous: go to an upper floor (flooding, storm surge) or a room on the side away from the slope (landslide).",
      "Evacuation should already have happened at Level 4; don't wait for Level 5.",
    ],
  },
  {
    level: 4,
    ja: "危険警報",
    en: "Urgent Warning",
    color: "purple",
    urgency: "evacuate_now",
    meaning: "Purple, Alert Level 4 equivalent (a new class since 2026-05-29): a disaster could happen at any time. Everyone in a dangerous area should evacuate now (\"evacuate by Level 4\"). Municipalities issue 避難指示 (Evacuation Instruction) at this level.",
    doNow: [
      "Evacuate now from dangerous areas to a shelter, or to a safe friend's house or hotel outside the danger zone.",
      "If it is already dangerous outside, move to a higher floor or a room away from slopes.",
      "Follow your municipality's evacuation instruction.",
    ],
  },
  {
    level: 3,
    ja: "警報",
    en: "Warning",
    color: "red",
    urgency: "evacuate_if_vulnerable",
    meaning: "Red, Alert Level 3 equivalent: danger is rising. People who need time to evacuate (elderly, disabled, small children) should start evacuating; everyone else gets ready.",
    doNow: ["Elderly people and those who need help: evacuate now.", "Everyone else: check the hazard map, pack, and be ready to leave.", "Check KIKIKURU and your municipality's notices."],
  },
  {
    level: 2,
    ja: "注意報",
    en: "Advisory",
    color: "yellow",
    urgency: "prepare",
    meaning: "Yellow, Alert Level 2 equivalent: conditions may worsen. Check the hazard map and how you would evacuate.",
    doNow: ["Check the hazard map for your area and your evacuation route.", "Talk with family or travel companions about where to go.", "Watch for updates."],
  },
];

function levelAlert(h: Hazard, c: LevelClass): Alert {
  const nameJa = `レベル${c.level}${h.ja}${c.ja}`;
  const nameEn = `Level ${c.level} ${c.en} (${h.en})`;
  const dictJa = `レベル${"０１２３４５"[c.level]}${h.ja}${c.ja}`;
  const aliases = [nameJa, `${h.ja}${c.ja}`, `level ${c.level} ${h.en.toLowerCase()} ${c.en.toLowerCase()}`, `${h.en.toLowerCase()} ${c.en.toLowerCase()}`];
  // A plain 高潮警報 / storm surge warning is ambiguous (old = Level 4); LEGACY handles it.
  if (h.id === "storm-surge" && c.level === 3) {
    aliases.splice(1, 1);
    aliases.pop();
  }
  return {
    id: `l${c.level}-${h.id}`,
    family: "weather-level",
    nameJa,
    nameEn,
    dictJa: JMA_NAMES[dictJa] ? dictJa : undefined,
    aliases,
    level: c.level,
    levelKind: "alert-level",
    color: c.color,
    urgency: c.urgency,
    issuedBy: h.id === "flood" ? "JMA with MLIT or the prefecture (river flood forecasts)" : "JMA",
    meaning: `${c.meaning} Hazard: ${h.area}.${h.extra?.[c.level] ? ` ${h.extra[c.level]}` : ""}`,
    doNow: [...c.doNow, `Stay away from ${h.avoid}.`],
    since: NEW_WEATHER_INFO_SINCE,
    sources: [S.jmaNew, S.jmaNewEn, S.jmaNewOutline, S.jmaNewLeaflet],
  };
}

const WEATHER_LEVEL: Alert[] = [
  ...LEVEL_CLASSES.flatMap((c) => HAZARDS.map((h) => levelAlert(h, c))),
  {
    id: "l1-early-advisory",
    family: "weather-level",
    nameJa: "早期注意情報（警報級の可能性）",
    nameEn: "Level 1 Early Advisory",
    aliases: ["早期注意情報", "警報級の可能性", "early advisory", "level 1 early advisory"],
    level: 1,
    levelKind: "alert-level",
    color: "white",
    urgency: "stay_alert",
    issuedBy: "JMA",
    meaning: "White, Alert Level 1: warning-level weather is possible in the coming days (up to 5 days ahead). Nothing to do yet except plan.",
    doNow: ["Watch the forecast and plan around it.", "Know where your nearest shelter is."],
    since: NEW_WEATHER_INFO_SINCE,
    sources: [S.jmaNewOutline, S.jmaNewLeaflet],
  },
];

// ───────────────────────── Other weather warnings (no alert level) ─────────────────────────
const OTHER_WEATHER_ROWS: [string, string, string, Urgency, string, string][] = [
  // id, ja, en (JMA official English), urgency, meaning, action
  ["storm-emergency", "暴風特別警報", "Storm Emergency Warning", "act_now", "Once-in-decades storm winds (typically a very strong typhoon).", "Stay inside a sturdy building away from windows; don't go out."],
  ["snowstorm-emergency", "暴風雪特別警報", "Snowstorm Emergency Warning", "act_now", "Once-in-decades storm winds with snow and whiteouts.", "Don't travel; stay in a heated, sturdy building."],
  ["heavy-snow-emergency", "大雪特別警報", "Heavy Snow Emergency Warning", "act_now", "Once-in-decades heavy snowfall.", "Don't travel by car; don't clear roof snow alone; stock food and heating."],
  ["high-wave-emergency", "波浪特別警報", "High Wave Emergency Warning", "act_now", "Once-in-decades high waves.", "Stay well away from the coast."],
  ["storm-warning", "暴風警報", "Storm Warning", "prepare", "Winds strong enough to cause serious damage.", "Avoid going out; secure loose items; expect train and flight disruption."],
  ["snowstorm-warning", "暴風雪警報", "Snowstorm Warning", "prepare", "Strong winds with snow; whiteouts and drifts are likely.", "Avoid driving; expect road and rail closures."],
  ["heavy-snow-warning", "大雪警報", "Heavy Snow Warning", "prepare", "Heavy snow likely to cause serious disruption or damage.", "Avoid unnecessary travel; watch for snow falling from roofs."],
  ["high-wave-warning", "波浪警報", "High Wave Warning", "prepare", "High waves likely to cause serious damage on the coast.", "Stay away from the coast and breakwaters; ferries may stop."],
  ["gale-advisory", "強風注意報", "Gale Advisory", "stay_alert", "Strong winds may cause damage.", "Take care outdoors; trains and ferries may be delayed."],
  ["gale-snow-advisory", "風雪注意報", "Gale and Snow Advisory", "stay_alert", "Strong winds with snow; poor visibility.", "Drive carefully or avoid driving."],
  ["heavy-snow-advisory", "大雪注意報", "Heavy Snow Advisory", "stay_alert", "Snow may cause disruption.", "Allow extra travel time; wear grippy shoes."],
  ["high-wave-advisory", "波浪注意報", "High Wave Advisory", "stay_alert", "High waves may cause damage.", "Avoid the shoreline and rock fishing."],
  ["thunderstorm-advisory", "雷注意報", "Thunderstorm Advisory", "stay_alert", "Lightning, sudden heavy rain, gusts or hail are possible.", "If you hear thunder, go inside a building or car; stay away from trees and open fields."],
  ["dense-fog-advisory", "濃霧注意報", "Dense Fog Advisory", "stay_alert", "Thick fog reducing visibility.", "Drive slowly with lights on; flights and ferries may be delayed."],
  ["dry-air-advisory", "乾燥注意報", "Dry Air Advisory", "stay_alert", "Very dry air; fires spread easily.", "Be careful with fire and cigarettes."],
  ["avalanche-advisory", "なだれ注意報", "Avalanche Advisory", "stay_alert", "Avalanches are possible on snowy slopes.", "Avoid backcountry and steep snowy slopes."],
  ["ice-accretion-advisory", "着氷注意報", "Ice Accretion Advisory", "stay_alert", "Ice may build up on power lines and ships.", "Expect possible power and communication outages."],
  ["snow-accretion-advisory", "着雪注意報", "Snow Accretion Advisory", "stay_alert", "Wet snow may stick to wires and trees.", "Watch for power cuts and falling branches."],
  ["snow-melting-advisory", "融雪注意報", "Snow Melting Advisory", "stay_alert", "Melting snow may cause flooding or landslides.", "Stay away from slopes and swollen streams."],
  ["frost-advisory", "霜注意報", "Frost Advisory", "info", "Frost may damage crops.", "Mainly for farmers."],
  ["low-temperature-advisory", "低温注意報", "Low Temperature Advisory", "stay_alert", "Unusually low temperatures; pipes may freeze.", "Keep warm; protect water pipes."],
];
const OTHER_WEATHER: Alert[] = OTHER_WEATHER_ROWS.map(([id, ja, en, urgency, meaning, action]) => ({
  id,
  family: "weather" as const,
  nameJa: ja,
  nameEn: en,
  dictJa: JMA_NAMES[ja] ? ja : undefined,
  aliases: [ja, en.toLowerCase()],
  level: null,
  levelKind: null,
  color: (ja.includes("特別警報") ? "black" : ja.endsWith("警報") ? "red" : "yellow") as Color,
  urgency,
  issuedBy: "JMA",
  meaning: `${meaning} This one has no 警戒レベル number (it is not an evacuation-level alert) and its name did not change on 2026-05-29.`,
  doNow: [action],
  sources: [S.jmaNewEn, S.jmaEmergencyEn],
}));

// ───────────────────────── Weather bulletins (気象防災速報) ─────────────────────────
const BULLETINS: Alert[] = [
  {
    id: "bulletin-linear-rainband",
    family: "weather-bulletin",
    nameJa: "気象防災速報（線状降水帯発生）",
    nameEn: "Weather disaster bulletin: linear rainband occurring",
    aliases: ["気象防災速報(線状降水帯発生)", "線状降水帯発生", "線状降水帯", "linear rainband", "linear precipitation band", "senjo kousuitai"],
    level: null,
    levelKind: null,
    color: null,
    urgency: "evacuate_now",
    issuedBy: "JMA (prefecture level)",
    meaning: "A line of thunderstorms (線状降水帯) is dropping very heavy rain on the same place for hours. Life-threatening floods and landslides can happen quickly. Formerly 顕著な大雨に関する気象情報.",
    doNow: ["Check your area on KIKIKURU and evacuate early if you are in a danger area.", "If it is dark or roads are already flooded, move to a higher floor instead."],
    since: NEW_WEATHER_INFO_SINCE,
    sources: [S.jmaWxinfo, S.jmaNewOutline],
  },
  {
    id: "bulletin-linear-rainband-forecast",
    family: "weather-bulletin",
    nameJa: "気象防災速報（線状降水帯直前予測）",
    nameEn: "Weather disaster bulletin: linear rainband likely within about 3 hours",
    aliases: ["気象防災速報(線状降水帯直前予測)", "線状降水帯直前予測"],
    level: null,
    levelKind: null,
    color: null,
    urgency: "prepare",
    issuedBy: "JMA (new in FY2026)",
    meaning: "A linear rainband may form within about 2-3 hours. Heavy-rain disasters may follow quickly.",
    doNow: ["Get ready to evacuate now while it is still safe, especially near slopes or rivers."],
    since: NEW_WEATHER_INFO_SINCE,
    sources: [S.jmaWxinfo],
  },
  {
    id: "bulletin-record-rain",
    family: "weather-bulletin",
    nameJa: "気象防災速報（記録的短時間大雨）",
    nameEn: "Weather disaster bulletin: record short-duration heavy rain",
    aliases: ["気象防災速報(記録的短時間大雨)", "記録的短時間大雨", "record short-duration heavy rain", "record short-term heavy rain"],
    level: null,
    levelKind: null,
    color: null,
    urgency: "evacuate_now",
    issuedBy: "JMA (prefecture level)",
    meaning: "Rain of a once-in-several-years intensity has been observed within about an hour. Disasters may be happening nearby. Formerly 記録的短時間大雨情報.",
    doNow: ["Check KIKIKURU; if your area is purple or black, take safety action now.", "Avoid underpasses, basements and rivers."],
    since: NEW_WEATHER_INFO_SINCE,
    sources: [S.jmaWxinfo],
  },
  {
    id: "bulletin-tornado",
    family: "weather-bulletin",
    nameJa: "気象防災速報（竜巻注意／竜巻目撃）",
    nameEn: "Weather disaster bulletin: tornado caution / tornado sighted",
    aliases: ["気象防災速報(竜巻注意)", "気象防災速報(竜巻目撃)", "竜巻注意", "竜巻目撃", "hazardous wind watch", "tornado"],
    level: null,
    levelKind: null,
    color: null,
    urgency: "stay_alert",
    issuedBy: "JMA (prefecture level)",
    meaning: "Conditions are right for tornadoes or violent gusts (竜巻目撃 = one has been sighted). Formerly 竜巻注意情報.",
    doNow: ["If the sky darkens suddenly or you hear thunder or a roar, go inside a sturdy building, away from windows."],
    since: NEW_WEATHER_INFO_SINCE,
    sources: [S.jmaWxinfo],
  },
  {
    id: "bulletin-heavy-snow",
    family: "weather-bulletin",
    nameJa: "気象防災速報（短時間大雪）",
    nameEn: "Weather disaster bulletin: heavy snow in a short time",
    aliases: ["気象防災速報(短時間大雪)", "短時間大雪"],
    level: null,
    levelKind: null,
    color: null,
    urgency: "prepare",
    issuedBy: "JMA (prefecture level)",
    meaning: "Very heavy snow is falling in a short time; cars can get stuck even on main roads. Formerly 顕著な大雪に関する気象情報.",
    doNow: ["Avoid driving; if you are stuck, keep the exhaust pipe clear of snow."],
    since: NEW_WEATHER_INFO_SINCE,
    sources: [S.jmaWxinfo],
  },
];

// ───────────────────────── Municipal evacuation information ─────────────────────────
const EVACUATION: Alert[] = [
  {
    id: "evac-l5",
    family: "evacuation",
    nameJa: "【警戒レベル5】緊急安全確保",
    nameEn: "Alert Level 5: Emergency Safety Measures",
    aliases: ["緊急安全確保", "emergency safety measures"],
    level: 5,
    levelKind: "alert-level",
    color: "black",
    urgency: "act_now",
    issuedBy: "Your city, town or village (municipality)",
    meaning: "A disaster is happening or imminent. Going to a shelter may already be dangerous. It is not always issued, so don't wait for it.",
    doNow: ["Take the safest action immediately: go to the highest floor or the room furthest from a slope.", "Only move outside if that is safer than staying."],
    sources: [S.caoEvac, S.caoEvacEn],
  },
  {
    id: "evac-l4",
    family: "evacuation",
    nameJa: "【警戒レベル4】避難指示",
    nameEn: "Alert Level 4: Evacuation Instruction",
    aliases: ["避難指示", "evacuation instruction", "evacuation order"],
    level: 4,
    levelKind: "alert-level",
    color: "purple",
    urgency: "evacuate_now",
    issuedBy: "Your city, town or village (municipality)",
    meaning: "Everyone in the named danger area must evacuate now. Since 2021 there is no separate 避難勧告 (evacuation advisory); 避難指示 is the one to act on.",
    doNow: ["Evacuate now to a designated shelter or a safe place outside the danger area (a friend's house or a hotel counts).", "If it is already dangerous outside, move up to a higher floor."],
    sources: [S.caoEvac, S.caoEvacEn],
  },
  {
    id: "evac-l3",
    family: "evacuation",
    nameJa: "【警戒レベル3】高齢者等避難",
    nameEn: "Alert Level 3: Evacuation of the Elderly, etc.",
    dictJa: "高齢者等避難",
    aliases: ["高齢者等避難", "evacuation of the elderly", "evacuation of elderly"],
    level: 3,
    levelKind: "alert-level",
    color: "red",
    urgency: "evacuate_if_vulnerable",
    issuedBy: "Your city, town or village (municipality)",
    meaning: "Elderly people, people with disabilities and anyone who needs time should evacuate now. Others prepare, and may evacuate voluntarily.",
    doNow: ["If you or someone with you needs time: go now.", "Everyone else: get ready and check your route."],
    sources: [S.caoEvac, S.caoEvacEn],
  },
];

// ───────────────────────── Volcano ─────────────────────────
const VOLCANO_ROWS: [number, string, string, string, Urgency, string][] = [
  [5, "噴火警戒レベル5（避難）", "Level 5 (Evacuation)", "レベル５（避難）", "evacuate_now", "Evacuation from residential areas at risk is necessary."],
  [4, "噴火警戒レベル4（高齢者等避難）", "Level 4 (Evacuation of the elderly, etc.)", "レベル４（高齢者等避難）", "evacuate_if_vulnerable", "Elderly people and others needing help in residential areas at risk evacuate; residents prepare to evacuate."],
  [3, "噴火警戒レベル3（入山規制）", "Level 3 (Restriction on proximity to the volcano)", "レベル３（入山規制）", "prepare", "Climbing and entry to dangerous parts of the mountain are banned."],
  [2, "噴火警戒レベル2（火口周辺規制）", "Level 2 (Restriction on proximity to the crater)", "レベル２（火口周辺規制）", "stay_alert", "Entry near the crater is restricted."],
  [1, "噴火警戒レベル1（活火山であることに留意）", "Level 1 (Potential for increased activity)", "", "info", "Normal for an active volcano; the crater itself may be off limits."],
];
const VOLCANO: Alert[] = [
  ...VOLCANO_ROWS.map(([lv, ja, en, dict, urgency, meaning]): Alert => ({
    id: `volcano-l${lv}`,
    family: "volcano",
    nameJa: ja,
    nameEn: `Volcanic Alert ${en}`,
    dictJa: dict && JMA_NAMES[dict] ? dict : undefined,
    aliases: [ja, `噴火警戒レベル${lv}`, `volcanic alert level ${lv}`, `volcanic alert level: ${lv}`],
    level: lv,
    levelKind: "volcanic-alert-level",
    color: null,
    urgency,
    issuedBy: "JMA (with the local volcano disaster council)",
    meaning: `${meaning} The restricted area depends on the volcano; check the municipality's notice.`,
    doNow: lv >= 4 ? ["Follow the municipality's evacuation instructions for the named areas."] : lv >= 2 ? ["Do not enter the restricted zone; hiking routes and ropeways may be closed."] : ["Follow local signs near the crater."],
    sources: [S.volcano, S.jmaMultilingual],
  })),
  {
    id: "eruption-notice",
    family: "volcano",
    nameJa: "噴火速報",
    nameEn: "Eruption notice",
    dictJa: "噴火速報",
    aliases: ["噴火速報", "eruption notice"],
    level: null,
    levelKind: null,
    color: null,
    urgency: "act_now",
    issuedBy: "JMA",
    meaning: "A volcano has just erupted. It is sent so people on or near the mountain can act at once.",
    doNow: ["On the mountain: get away from the crater immediately and shelter behind rocks or in a hut; protect your head from falling rocks.", "Downwind: stay indoors and avoid breathing ash."],
    sources: [S.volcano, S.jmaMultilingual],
  },
];

// ───────────────────────── Missile (J-ALERT) ─────────────────────────
const MISSILE: Alert[] = [
  {
    id: "missile",
    family: "missile",
    nameJa: "ミサイル発射情報（Jアラート）",
    nameEn: "Missile launch (J-ALERT)",
    aliases: ["ミサイル発射", "ミサイル通過", "ミサイル", "jアラート", "j-alert", "j alert", "missile launch", "missile", "国民保護に関する情報", "建物の中、又は地下に避難"],
    level: null,
    levelKind: null,
    color: null,
    urgency: "act_now",
    issuedBy: "Government of Japan via J-ALERT (Cabinet Secretariat), with sirens and phone emergency alerts",
    meaning: "A ballistic missile may fly over or land in Japan. It can arrive in under 10 minutes. Follow-up messages say whether it passed over or landed.",
    doNow: [
      "Outdoors: go into a nearby sturdy building or underground (subway station, underground mall) right away.",
      "No building nearby: take cover behind something, or lie flat on the ground and protect your head.",
      "Indoors: move away from windows or into a room without windows.",
    ],
    note: "If something lands nearby: cover your mouth and nose, move away and upwind, and seal yourself in a building (close windows, turn off ventilation).",
    sources: [S.jAlert, S.jAlertActions],
  },
];

// ───────────────────────── Heat ─────────────────────────
const HEAT: Alert[] = [
  {
    id: "heat-special-alert",
    family: "heat",
    nameJa: "熱中症特別警戒アラート",
    nameEn: "Special Heat Stroke Alert",
    aliases: ["熱中症特別警戒アラート", "熱中症特別警戒情報", "special heat stroke alert"],
    level: null,
    levelKind: null,
    color: "black",
    urgency: "act_now",
    issuedBy: "Ministry of the Environment (with JMA)",
    meaning: "Extreme heat (a WBGT of 35+ forecast at every station in the prefecture) that could seriously harm anyone's health.",
    doNow: ["Stay in air-conditioned places (local cooling shelters, クーリングシェルター, open).", "Drink water and take salt regularly; cancel strenuous outdoor plans.", "Check on elderly people and children."],
    sources: [S.heat],
  },
  {
    id: "heat-alert",
    family: "heat",
    nameJa: "熱中症警戒アラート",
    nameEn: "Heat Stroke Alert",
    dictJa: "熱中症警戒アラート",
    aliases: ["熱中症警戒アラート", "熱中症警戒情報", "heat stroke alert", "heatstroke alert"],
    level: null,
    levelKind: null,
    color: "red",
    urgency: "prepare",
    issuedBy: "Ministry of the Environment (with JMA)",
    meaning: "Very high heat-stroke risk today or tomorrow (a WBGT of 33+ forecast).",
    doNow: ["Avoid exercise and long outdoor walks in the hottest hours.", "Use air conditioning, drink water often and rest in the shade."],
    sources: [S.heat],
  },
];

export const ALERTS: Alert[] = [...EARTHQUAKE, ...TSUNAMI, ...MEGAQUAKE, ...WEATHER_LEVEL, ...OTHER_WEATHER, ...BULLETINS, ...EVACUATION, ...VOLCANO, ...MISSILE, ...HEAT];
const BY_ID = new Map(ALERTS.map((a) => [a.id, a]));
export const ALERT_IDS = ALERTS.map((a) => a.id);
export const getAlert = (id: string) => BY_ID.get(id);

/** Old names (stopped on 2026-05-29, or in 2021 for evacuation info), mapped to today's alerts. */
export const LEGACY: Legacy[] = [
  { nameJa: "大雨特別警報（土砂災害）", aliases: ["大雨特別警報(土砂災害)"], replacedBy: ["l5-landslide"], note: "大雨特別警報（土砂災害） is now レベル5土砂災害特別警報." },
  { nameJa: "大雨特別警報（浸水害）", aliases: ["大雨特別警報(浸水害)"], replacedBy: ["l5-heavy-rain"], note: "大雨特別警報（浸水害） is now レベル5大雨特別警報." },
  { nameJa: "大雨警報（土砂災害）", aliases: ["大雨警報(土砂災害)", "heavy rain warning (landslide)"], replacedBy: ["l3-landslide"], note: "大雨警報（土砂災害） is now レベル3土砂災害警報 (issued less often; Level 4 likely soon)." },
  { nameJa: "大雨警報（浸水害）", aliases: ["大雨警報(浸水害)", "heavy rain warning (inundation)"], replacedBy: ["l3-heavy-rain"], note: "大雨警報（浸水害） is now レベル3大雨警報." },
  { nameJa: "土砂災害警戒情報", aliases: ["土砂災害警戒情報", "landslide alert information"], replacedBy: ["l4-landslide"], note: "土砂災害警戒情報 is now レベル4土砂災害危険警報 (Level 4: evacuate)." },
  { nameJa: "洪水警報", aliases: ["洪水警報", "flood warning"], replacedBy: ["l3-heavy-rain", "l3-flood"], note: "洪水警報 is no longer issued: small-river flooding moved into the 大雨 (heavy rain) warnings, and named major rivers use 氾濫 (flood) warnings." },
  { nameJa: "洪水注意報", aliases: ["洪水注意報", "flood advisory"], replacedBy: ["l2-heavy-rain", "l2-flood"], note: "洪水注意報 is no longer issued; see 大雨注意報 / 氾濫注意報." },
  { nameJa: "氾濫発生情報", aliases: ["氾濫発生情報", "information on flooding"], replacedBy: ["l5-flood"], note: "For flood-forecast rivers 氾濫発生情報 is now レベル5氾濫特別警報." },
  { nameJa: "氾濫危険情報", aliases: ["氾濫危険情報", "information on potential flood hazards"], replacedBy: ["l4-flood"], note: "For flood-forecast rivers 氾濫危険情報 is now レベル4氾濫危険警報; smaller 'water-level notification' rivers still use 氾濫危険情報 as a Level 4 equivalent." },
  { nameJa: "氾濫警戒情報", aliases: ["氾濫警戒情報"], replacedBy: ["l3-flood"], note: "氾濫警戒情報 is now レベル3氾濫警報." },
  { nameJa: "氾濫注意情報", aliases: ["氾濫注意情報"], replacedBy: ["l2-flood"], note: "氾濫注意情報 is now レベル2氾濫注意報." },
  { nameJa: "高潮警報", aliases: ["高潮警報", "storm surge warning"], replacedBy: ["l4-storm-surge", "l3-storm-surge"], note: "Before 2026-05-29 a plain 高潮警報 was Level 4 equivalent (now レベル4高潮危険警報); since then レベル3高潮警報 is Level 3. Check the level number in the alert." },
  { nameJa: "高潮注意報", aliases: ["高潮注意報", "storm surge advisory"], replacedBy: ["l2-storm-surge", "l3-storm-surge"], note: "The old 高潮注意報 was Level 3 when likely to be upgraded, otherwise Level 2; now レベル3高潮警報 / レベル2高潮注意報." },
  { nameJa: "避難勧告", aliases: ["避難勧告", "evacuation advisory", "evacuation recommendation"], replacedBy: ["evac-l4"], note: "避難勧告 was abolished in 2021; act on 避難指示 (Evacuation Instruction, Level 4)." },
  { nameJa: "避難準備・高齢者等避難開始", aliases: ["避難準備・高齢者等避難開始", "避難準備"], replacedBy: ["evac-l3"], note: "避難準備・高齢者等避難開始 was renamed 高齢者等避難 (Level 3) in 2021." },
  { nameJa: "顕著な大雨に関する気象情報", aliases: ["顕著な大雨に関する気象情報", "顕著な大雨に関する"], replacedBy: ["bulletin-linear-rainband"], note: "顕著な大雨に関する気象情報 is now 気象防災速報（線状降水帯発生）." },
  { nameJa: "記録的短時間大雨情報", aliases: ["記録的短時間大雨情報"], replacedBy: ["bulletin-record-rain"], note: "記録的短時間大雨情報 is now 気象防災速報（記録的短時間大雨）." },
  { nameJa: "竜巻注意情報", aliases: ["竜巻注意情報"], replacedBy: ["bulletin-tornado"], note: "竜巻注意情報 is now 気象防災速報（竜巻注意／竜巻目撃）." },
  { nameJa: "顕著な大雪に関する気象情報", aliases: ["顕著な大雪に関する気象情報", "顕著な大雪に関する"], replacedBy: ["bulletin-heavy-snow"], note: "顕著な大雪に関する気象情報 is now 気象防災速報（短時間大雪）." },
];

// ───────────────────────── Shindo (seismic intensity) ─────────────────────────
export type ShindoKey = "0" | "1" | "2" | "3" | "4" | "5-" | "5+" | "6-" | "6+" | "7";
export const SHINDO: { key: ShindoKey; ja: string; en: string; felt: string }[] = [
  { key: "0", ja: "震度0", en: "Intensity 0", felt: "Imperceptible to people, but recorded by seismometers." },
  { key: "1", ja: "震度1", en: "Intensity 1", felt: "Felt slightly by some people keeping quiet in buildings." },
  { key: "2", ja: "震度2", en: "Intensity 2", felt: "Felt by many people keeping quiet in buildings; hanging lamps swing slightly." },
  { key: "3", ja: "震度3", en: "Intensity 3", felt: "Felt by most people in buildings; dishes in cupboards may rattle." },
  { key: "4", ja: "震度4", en: "Intensity 4", felt: "Most people are startled; hanging objects swing a lot and unstable ornaments may fall." },
  { key: "5-", ja: "震度5弱", en: "Intensity 5-lower", felt: "Many people are frightened and hold onto something; dishes and books may fall and unsecured furniture may move." },
  { key: "5+", ja: "震度5強", en: "Intensity 5-upper", felt: "Walking is difficult without holding on; TVs and unsecured furniture may topple; unreinforced block walls may collapse." },
  { key: "6-", ja: "震度6弱", en: "Intensity 6-lower", felt: "It is difficult to remain standing; much unsecured furniture topples; doors may jam." },
  { key: "6+", ja: "震度6強", en: "Intensity 6-upper", felt: "Impossible to stand or move without crawling; most unsecured furniture topples." },
  { key: "7", ja: "震度7", en: "Intensity 7", felt: "The top of the scale: furniture topples or is thrown, and buildings with low earthquake resistance are likely to collapse." },
];
const SHINDO_ORDER = SHINDO.map((s) => s.key);

// ───────────────────────── Situations ─────────────────────────
export const SITUATIONS = ["indoors", "outdoors", "driving", "train", "elevator", "crowd", "coast", "mountain"] as const;
export type Situation = (typeof SITUATIONS)[number];
export const SITUATION_LABEL: Record<Situation, string> = { indoors: "At home / indoors", outdoors: "On the street", driving: "Driving", train: "On a train or bus", elevator: "In an elevator", crowd: "In a store, station or venue", coast: "Near the sea", mountain: "Hiking / near slopes" };
const EEW_SITUATION: Record<Situation, string[]> = {
  indoors: ["Protect your head and get under a sturdy table.", "Don't rush outside; don't try to put out fires during shaking."],
  outdoors: ["Watch for collapsing block walls, falling signs and broken glass.", "If you are next to a sturdy building, go inside."],
  driving: ["Don't slow down abruptly or brake hard; turn on your hazard lights and slow down gradually.", "When strong shaking starts, stop on the left side of the road (Japan drives on the left)."],
  train: ["Hold the strap or handrail firmly: the train or bus may brake hard."],
  elevator: ["Stop at the nearest floor (press every button) and get out immediately."],
  crowd: ["Follow staff instructions; stay calm and don't run for the exit.", "Protect your head and stay away from shelves and hanging lights."],
  coast: ["After the shaking: if it was strong or long, move to high ground at once; don't wait for a tsunami warning."],
  mountain: ["Watch for rockfalls and landslides; move away from cliffs and steep slopes."],
};
const OTHER_SITUATION: Partial<Record<Family, Partial<Record<Situation, string[]>>>> = {
  tsunami: { coast: ["Leave the beach now and go to high ground or an evacuation building."], driving: ["Head inland and uphill; if traffic stops you, leave the car and go on foot."], train: ["Follow crew instructions; staff guide passengers to high ground."] },
  missile: { driving: ["Stop the car somewhere safe and go into a nearby building or underground; if there is none, get out, lie flat away from the car and protect your head."], train: ["Follow crew instructions; stay low and away from windows."] },
  "weather-level": { driving: ["Avoid underpasses and flooded roads: even shallow moving water can stall or float a car."], mountain: ["Leave valleys and slopes; check trail closures."] },
};

// ───────────────────────── Decoder ─────────────────────────
export type Lang = NameLang | "ja";
export const LANGS: readonly Lang[] = ["ja", ...NAME_LANGS];

export class AlertInputError extends Error {}

export type DecodeInput = { text?: string | null; alert?: string | null; situation?: string | null; lang?: string | null };

export function normalize(s: string): string {
  return s.normalize("NFKC").toLowerCase().replace(/[\u3000\s]+/g, " ").trim();
}
const squash = (s: string) => s.replace(/ /g, "").replace(/[【】「」『』［］[\]〈〉<>]/g, "").replace(/[／]/g, "/");
const isAscii = (s: string) => /^[\x00-\x7f]+$/.test(s);

type Hit = { kind: "alert" | "legacy"; key: string; start: number; end: number; len: number; space: "ja" | "en"; hasLevel: boolean };

const ALIAS_INDEX: { alias: string; kind: "alert" | "legacy"; key: string }[] = [
  ...ALERTS.flatMap((a) => [a.nameJa, a.nameEn, ...a.aliases].map((x) => ({ alias: normalize(x), kind: "alert" as const, key: a.id }))),
  ...LEGACY.flatMap((l, i) => [l.nameJa, ...l.aliases].map((x) => ({ alias: normalize(x), kind: "legacy" as const, key: String(i) }))),
].map((e) => ({ ...e, alias: isAscii(e.alias) ? e.alias : squash(e.alias) }));

function findHits(text: string): Hit[] {
  const en = normalize(text);
  const ja = squash(en);
  const raw: Hit[] = [];
  for (const e of ALIAS_INDEX) {
    if (!e.alias) continue;
    const ascii = isAscii(e.alias);
    const hay = ascii ? en : ja;
    let from = 0;
    for (;;) {
      const at = hay.indexOf(e.alias, from);
      if (at < 0) break;
      const end = at + e.alias.length;
      const okBoundary = !ascii || ((at === 0 || !/[a-z0-9]/.test(hay[at - 1])) && (end === hay.length || !/[a-z0-9]/.test(hay[end])));
      if (okBoundary) raw.push({ kind: e.kind, key: e.key, start: at, end, len: e.alias.length, space: ascii ? "en" : "ja", hasLevel: /[1-5]/.test(e.alias) });
      from = at + 1;
    }
  }
  raw.sort((a, b) => b.len - a.len || a.start - b.start);
  const kept: Hit[] = [];
  for (const h of raw) {
    if (kept.some((k) => k.space === h.space && h.start < k.end && k.start < h.end)) continue;
    kept.push(h);
  }
  return kept.sort((a, b) => a.start - b.start);
}

function shindoKey(n: string, upper: boolean): ShindoKey {
  return (n === "5" || n === "6" ? `${n}${upper ? "+" : "-"}` : n) as ShindoKey;
}

export function extractShindo(text: string): ShindoKey | null {
  const t = normalize(text);
  const found: ShindoKey[] = [];
  for (const m of t.matchAll(/震度\s*([0-7])\s*(弱|強|\+|-)?/g)) found.push(shindoKey(m[1], m[2] === "強" || m[2] === "+"));
  for (const m of t.matchAll(/(?:shindo|seismic intensity(?: of)?|intensity)\s*([0-7])(?:\s*[- ]?\s*(lower|upper|weak|strong|\+|-))?/g)) found.push(shindoKey(m[1], m[2] === "upper" || m[2] === "strong" || m[2] === "+"));
  if (!found.length) return null;
  return found.sort((a, b) => SHINDO_ORDER.indexOf(b) - SHINDO_ORDER.indexOf(a))[0];
}

export function extractTsunamiHeight(text: string): string | null {
  const t = normalize(text);
  if (!/津波|tsunami/.test(t)) return null;
  if (/巨大|huge/.test(t)) return "huge (巨大, over 3 m)";
  if (/10\s*m\s*超|over 10 ?m|more than 10 ?m|exceed(?:ing)? 10 ?m/.test(t)) return "over 10 m";
  const h = t.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:m|メートル)(?![a-z])/);
  if (h) return `${h[1]} m`;
  if (/高い|high/.test(t) && /津波警報|tsunami warning/.test(t)) return "high (高い, up to 3 m)";
  return null;
}

export function extractLevel(text: string): number | null {
  const t = normalize(text);
  const m = t.match(/(?:警戒レベル|レベル|alert level|level)\s*([1-5])/);
  return m ? Number(m[1]) : null;
}

const HAZARD_WORDS: [string, RegExp][] = [
  ["landslide", /土砂|landslide|debris/],
  ["storm-surge", /高潮|storm surge/],
  ["flood", /氾濫|river|flood/],
  ["heavy-rain", /大雨|heavy rain|rain/],
];

export function resolveAlertId(raw: string): string {
  const v = raw.trim();
  if (BY_ID.has(v)) return v;
  const n = normalize(v);
  if (BY_ID.has(n)) return n;
  const hits = findHits(v);
  const a = hits.filter((h) => h.kind === "alert").sort((x, y) => y.len - x.len)[0];
  if (a) return a.key;
  const l = hits.find((h) => h.kind === "legacy");
  if (l) return LEGACY[Number(l.key)].replacedBy[0];
  throw new AlertInputError(`Unknown alert '${raw.slice(0, 60)}'. Use an id from /api/rules (e.g. eew-warning, tsunami-warning, l4-landslide) or paste the alert text in 'text'.`);
}

export function resolveSituation(raw?: string | null): Situation | null {
  if (!raw) return null;
  const v = normalize(raw);
  if ((SITUATIONS as readonly string[]).includes(v)) return v as Situation;
  const map: Record<string, Situation> = { home: "indoors", inside: "indoors", indoor: "indoors", 屋内: "indoors", 家: "indoors", 自宅: "indoors", outside: "outdoors", outdoor: "outdoors", street: "outdoors", 屋外: "outdoors", 外: "outdoors", car: "driving", drive: "driving", 運転: "driving", 車: "driving", bus: "train", subway: "train", 電車: "train", バス: "train", lift: "elevator", エレベーター: "elevator", store: "crowd", mall: "crowd", station: "crowd", stadium: "crowd", 駅: "crowd", 店: "crowd", beach: "coast", sea: "coast", 海: "coast", 海岸: "coast", hiking: "mountain", hike: "mountain", 山: "mountain" };
  if (map[v]) return map[v];
  throw new AlertInputError(`Unknown situation '${raw.slice(0, 30)}'. Use one of: ${SITUATIONS.join(", ")}.`);
}

export function resolveLang(raw?: string | null): Lang {
  if (!raw) return "en";
  const low = raw.trim().toLowerCase();
  const found = LANGS.find((l) => l.toLowerCase() === low);
  if (found) return found;
  const aliases: Record<string, Lang> = { zh: "zh-CN", "zh-hans": "zh-CN", "zh-hant": "zh-TW", "pt-br": "pt", fil: "tl", jp: "ja", np: "ne" };
  if (aliases[low]) return aliases[low];
  throw new AlertInputError(`Unsupported lang '${raw.slice(0, 12)}'. Use one of: ${LANGS.join(", ")}.`);
}

export type AlertView = ReturnType<typeof view>;
function view(a: Alert, lang: Lang, situation: Situation | null) {
  const names = a.dictJa ? JMA_NAMES[a.dictJa] : undefined;
  const situational = situation ? ((a.id === "eew-warning" || a.id === "shindo-report" ? EEW_SITUATION[situation] : OTHER_SITUATION[a.family]?.[situation]) ?? []) : [];
  return {
    id: a.id,
    family: a.family,
    nameJa: a.nameJa,
    nameEn: a.nameEn,
    nameLocal: lang === "ja" ? a.nameJa : lang === "en" ? a.nameEn : (names?.[lang] ?? null),
    officialNames: names ?? null,
    level: a.level,
    levelKind: a.levelKind,
    color: a.color,
    urgency: a.urgency,
    urgencyLabel: URGENCY_LABEL[a.urgency],
    issuedBy: a.issuedBy,
    meaning: a.meaning,
    doNow: [...situational, ...a.doNow.filter((d) => !situational.includes(d))],
    dont: a.dont ?? [],
    howLong: a.howLong ?? null,
    note: a.note ?? null,
    since: a.since ?? null,
    sources: a.sources,
  };
}

export type DecodeResult = ReturnType<typeof decodeAlert>;

export function decodeAlert(input: DecodeInput) {
  const text = (input.text ?? "").toString().slice(0, 4000);
  const lang = resolveLang(input.lang);
  const situation = resolveSituation(input.situation);
  if (!text.trim() && !input.alert) throw new AlertInputError("Give 'text' (the alert as you received it, Japanese or English) or 'alert' (an id from /api/rules).");

  const ids: string[] = [];
  const legacy: { oldName: string; replacedBy: string[]; note: string }[] = [];
  if (input.alert) ids.push(resolveAlertId(String(input.alert)));

  const level = extractLevel(text);
  for (const h of text ? findHits(text) : []) {
    const a = h.kind === "alert" ? getAlert(h.key) : undefined;
    // "Level 4 ... landslide warning": a level number next to a level-less name decides the level.
    if (a && a.family === "weather-level" && !h.hasLevel && level && level >= 2 && a.level !== level && BY_ID.has(a.id.replace(/^l[1-5]-/, `l${level}-`))) ids.push(a.id.replace(/^l[1-5]-/, `l${level}-`));
    else if (h.kind === "alert") ids.push(h.key);
    else {
      const l = LEGACY[Number(h.key)];
      if (!legacy.some((x) => x.oldName === l.nameJa)) legacy.push({ oldName: l.nameJa, replacedBy: l.replacedBy, note: l.note });
    }
  }
  const norm = normalize(text);
  // Old names: add the replacement (by level number when an old name maps to two).
  for (const l of legacy) {
    const pick = l.replacedBy.length > 1 && level ? l.replacedBy.filter((id) => getAlert(id)?.level === level) : [];
    // Ambiguous old name with no level number: show every candidate (the most severe becomes primary).
    ids.push(...(pick.length ? pick : l.replacedBy));
  }
  // Informal "Level 4 landslide warning" phrasing → the level-named weather alert.
  if (!ids.some((id) => getAlert(id)?.family === "weather-level") && level && level >= 2) {
    const hz = HAZARD_WORDS.find(([, re]) => re.test(norm));
    if (hz && /警報|注意報|warning|advisory/.test(norm)) ids.push(`l${level}-${hz[0]}`);
  }
  // A bare "警戒レベル4" / "Alert Level 4" → the municipal evacuation level.
  if (!ids.length && level && level >= 3 && /警戒レベル|alert level/.test(norm)) ids.push(`evac-l${level}`);

  const shindoFound = extractShindo(text);
  if (shindoFound && !ids.some((id) => getAlert(id)?.family === "earthquake")) ids.unshift("shindo-report");
  let unique = [...new Set(ids)].filter((id) => BY_ID.has(id));
  if (unique.includes("eew-cancel")) unique = unique.filter((id) => id !== "eew-warning" && id !== "eew-forecast");
  if (unique.includes("eew-forecast")) unique = unique.filter((id) => id !== "eew-warning");
  if (/南海トラフ|nankai/.test(norm) && !unique.some((id) => id.startsWith("nankai-"))) unique.push("nankai-investigating");
  if (unique.some((id) => id.startsWith("nankai-") && id !== "nankai-investigating") && !/調査中|under analysis/.test(norm)) unique = unique.filter((id) => id !== "nankai-investigating");
  if (unique.includes("no-tsunami") && unique.some((id) => ["major-tsunami-warning", "tsunami-warning", "tsunami-advisory"].includes(id))) unique = unique.filter((id) => id !== "no-tsunami");

  const lifted = /解除|lifted|no longer in effect/.test(norm);
  const drill = /訓練|テスト|drill|test message|これは試験|this is a test/.test(norm);
  const cancelled = unique.includes("eew-cancel") || /取り?消し?|取消|cancell?ed|withdrawn/.test(norm);

  const views = unique.map((id) => view(BY_ID.get(id)!, lang, situation));
  views.sort((a, b) => URGENCY_RANK[b.urgency] - URGENCY_RANK[a.urgency] || (b.level ?? 0) - (a.level ?? 0));
  const primary = views[0] ?? null;

  const notes: string[] = [];
  if (drill) notes.push("This looks like a drill or test (訓練 / テスト). Real alerts don't say 訓練; act as practice.");
  if (lifted && primary) notes.push("The text says the alert was lifted (解除). That danger has passed, but stay careful: aftershocks, swollen rivers and loose slopes can remain, and other alerts may still be in effect.");
  if (cancelled && !unique.includes("eew-cancel") && primary) notes.push("The text mentions a cancellation (取消し).");
  if (legacy.length) notes.push(`Old name used. Japan renamed these warnings on ${NEW_WEATHER_INFO_SINCE} (evacuation info in 2021): ${legacy.map((l) => l.note).join(" ")}`);
  if (primary?.levelKind === "alert-level" && primary.level && primary.level >= 4 && !lifted) notes.push("Japan's rule of thumb: evacuate by Level 4 (purple). Don't wait for Level 5.");
  const shindoInfo = shindoFound ? SHINDO.find((s) => s.key === shindoFound)! : null;
  if (shindoInfo && SHINDO_ORDER.indexOf(shindoInfo.key) >= SHINDO_ORDER.indexOf("5-") && !unique.some((id) => id.includes("tsunami"))) notes.push("Strong shaking near the coast? Move to high ground without waiting for a tsunami warning.");
  const tsunamiHeight = extractTsunamiHeight(text);

  const urgency: Urgency | null = primary ? (drill || lifted ? "info" : primary.urgency) : null;
  const tag = `${drill ? "[Drill] " : ""}${lifted ? "[Lifted] " : ""}`;
  const lvl = primary?.level && primary.levelKind === "alert-level" ? ` (Alert Level ${primary.level}${primary.color ? `, ${primary.color}` : ""})` : "";
  const headline = primary
    ? `${tag}${primary.nameEn}${lvl}: ${lifted ? "the alert has been lifted; stay careful and check for other alerts." : primary.id === "shindo-report" && shindoInfo ? `${shindoInfo.ja} (${shindoInfo.en}). ${shindoInfo.felt}` : primary.doNow[0]}`
    : "Not recognised. Paste the alert's title line (e.g. 緊急地震速報, 津波警報, レベル4土砂災害危険警報, 避難指示) or pick an alert id.";

  return {
    verdict: primary ? ("decoded" as const) : ("not_recognized" as const),
    headline,
    urgency,
    urgencyLabel: urgency ? URGENCY_LABEL[urgency] : null,
    primary,
    also: views.slice(1).map((v) => ({ id: v.id, nameJa: v.nameJa, nameEn: v.nameEn, nameLocal: v.nameLocal, level: v.level, urgency: v.urgency, doNow: v.doNow.slice(0, 2) })),
    modifiers: { cancelled, lifted, drill },
    extracted: { level, shindo: shindoInfo, tsunamiHeight },
    renamed: legacy,
    notes,
    checkLive: LIVE_LINKS,
    input: { text: text || null, alert: input.alert ?? null, situation, lang },
    dataAsOf: RULES_AS_OF,
    sources: primary ? [...new Set(views.flatMap((v) => v.sources))] : [S.jmaNew, S.jmaTsunami, S.jmaEew],
  };
}

export function rules() {
  return {
    dataAsOf: RULES_AS_OF,
    newWeatherInfoSince: NEW_WEATHER_INFO_SINCE,
    summary:
      "Since 2026-05-29 Japan's heavy-rain, flood, landslide and storm-surge warnings carry the alert level in their name: Level 5 特別警報 Emergency Warning (black), Level 4 危険警報 Urgent Warning (purple, new), Level 3 警報 Warning (red), Level 2 注意報 Advisory (yellow), Level 1 早期注意情報 Early Advisory (white). Evacuate by Level 4. Earthquake Early Warnings, tsunami warnings, Nankai Trough information, J-ALERT and the other weather warnings keep their names.",
    alertLevels: [
      { level: 5, color: "black", weather: "特別警報 Emergency Warning", municipality: "緊急安全確保 Emergency Safety Measures", action: "Take the safest action immediately; a disaster is happening or imminent." },
      { level: 4, color: "purple", weather: "危険警報 Urgent Warning", municipality: "避難指示 Evacuation Instruction", action: "Everyone in danger areas evacuates now." },
      { level: 3, color: "red", weather: "警報 Warning", municipality: "高齢者等避難 Evacuation of the Elderly, etc.", action: "Elderly and slow evacuees go now; others prepare." },
      { level: 2, color: "yellow", weather: "注意報 Advisory", municipality: null, action: "Check the hazard map and your route." },
      { level: 1, color: "white", weather: "早期注意情報 Early Advisory", municipality: null, action: "Stay alert." },
    ],
    alerts: ALERTS.map((a) => ({ id: a.id, family: a.family, nameJa: a.nameJa, nameEn: a.nameEn, level: a.level, levelKind: a.levelKind, color: a.color, urgency: a.urgency, issuedBy: a.issuedBy, meaning: a.meaning, doNow: a.doNow, since: a.since ?? null, officialNames: a.dictJa ? JMA_NAMES[a.dictJa] : null, sources: a.sources })),
    renamed: LEGACY.map((l) => ({ oldName: l.nameJa, replacedBy: l.replacedBy, note: l.note })),
    shindo: SHINDO,
    tsunami: [
      { id: "major-tsunami-warning", height: "over 3 m (announced as 5 m / 10 m / over 10 m, or 巨大 huge)", action: "Evacuate immediately to high ground or an evacuation building." },
      { id: "tsunami-warning", height: "1-3 m (announced as 3 m, or 高い high)", action: "Evacuate immediately from coastal and riverside areas." },
      { id: "tsunami-advisory", height: "0.2-1 m (announced as 1 m)", action: "Get out of the water and leave the coast." },
      { id: "tsunami-forecast", height: "under 0.2 m", action: "No evacuation; take care at the water's edge." },
    ],
    eewCriteria:
      "Warning (警報): two or more stations detect the quake and a maximum intensity of 5-lower+ (or long-period ground motion class 3+) is predicted; areas expecting intensity 4+ are named. Intensity 6-lower+ (or LPGM class 4) is special-warning class but is sent the same way. Forecast (予報): about M3.5+ or intensity 3+.",
    situations: SITUATIONS,
    languages: LANGS,
    languageSource: `${S.jmaMultilingual} (JMA multilingual dictionary, updated 2026-03-26)`,
    checkLive: LIVE_LINKS,
    sources: SOURCES,
  };
}
