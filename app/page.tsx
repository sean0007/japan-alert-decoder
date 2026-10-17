import type { Metadata } from "next";
import Link from "next/link";
import { Decoder } from "@/components/decoder";
import { FaqSection, type FaqItem } from "@/components/faq-section";
import { LEGACY, RULES_AS_OF, getAlert, rules } from "@/lib/alerts";
import { COLOR_HEX, PUBLIC_URL } from "@/lib/share";

const title = "Japan emergency alert decoder: what does this alert mean and what do I do? (EEW, tsunami, Level 4 warnings)";
const description =
  "Free decoder for Japanese emergency alerts: 緊急地震速報 (Earthquake Early Warning) and cancellations, tsunami warnings, the new level-named weather warnings since May 29, 2026 (レベル4土砂災害危険警報 Urgent Warning and more), 避難指示, 線状降水帯, Nankai Trough information, J-ALERT missile alerts, volcano and heat alerts. Level, what to do now, official names in 14 languages. Free API for AI agents. Not an alert service.";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Japan Alert Decoder",
  alternateName: ["Japanese emergency alert translator", "緊急速報 解説", "Japan warning level explainer"],
  url: PUBLIC_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  inLanguage: ["en", "ja"],
  description:
    "Unofficial, free decoder of Japanese emergency alerts (earthquake, tsunami, weather warnings, evacuation, J-ALERT) with official sources, official names in 14 languages and a keyless JSON API. Educational guide, not an alert service.",
};

const faq: FaqItem[] = [
  {
    q: "My phone in Japan made a loud alarm and said 緊急地震速報. What do I do?",
    a: "That is the Earthquake Early Warning (EEW): strong shaking is expected within seconds. Protect your head and get under a sturdy table, stay away from windows and things that can fall, and don't run outside. On a train hold the strap; driving, turn on hazard lights and slow down gradually; in an elevator stop at the nearest floor and get out. After the shaking, if you are near the coast, check for a tsunami warning.",
  },
  {
    q: "Why was the October 16, 2026 earthquake early warning cancelled?",
    a: "At 12:40 JST on October 16, 2026 JMA issued an EEW (warning) from Hokkaido to Chubu after its system over-estimated a distant quake near the Kuril Islands as M9.9. It was later cancelled (先ほど発表した緊急地震速報を取り消します = 'JMA has cancelled the EEW'). JMA said a filter that ignores stations more than 700 km away had not worked, fixed it at about 21:30 that day and apologised. False alarms are rare; keep acting on every EEW.",
  },
  {
    q: "What are Japan's new Level 4 'Urgent Warnings' (危険警報)?",
    a: "Since May 29, 2026 Japan's heavy-rain, flood, landslide and storm-surge warnings carry the alert level in their name. Level 5 特別警報 Emergency Warning (black), Level 4 危険警報 Urgent Warning (purple, new), Level 3 警報 Warning (red), Level 2 注意報 Advisory (yellow) and Level 1 早期注意情報 Early Advisory (white). For example 土砂災害警戒情報 became レベル4土砂災害危険警報 (Level 4 Urgent Warning (Landslide)). Evacuate from dangerous areas by Level 4.",
  },
  {
    q: "What is the difference between 避難指示 and 高齢者等避難?",
    a: "They come from your city or town. 【警戒レベル4】避難指示 (Evacuation Instruction): everyone in the named danger area evacuates now. 【警戒レベル3】高齢者等避難 (Evacuation of the Elderly, etc.): elderly people and anyone who needs time go now; others prepare. 【警戒レベル5】緊急安全確保: a disaster is happening; take the safest action immediately. 避難勧告 was abolished in 2021.",
  },
  {
    q: "What do 大津波警報, 津波警報 and 津波注意報 mean?",
    a: "大津波警報 Major Tsunami Warning: over 3 m expected (announced as 5 m, 10 m, over 10 m or 'huge'). 津波警報 Tsunami Warning: 1-3 m. Evacuate immediately to high ground or an evacuation building for both. 津波注意報 Tsunami Advisory: 0.2-1 m; get out of the water and leave the coast. Waves repeat for hours; stay away until the warning is lifted (解除).",
  },
  {
    q: "What is the 線状降水帯 (linear rainband) alert?",
    a: "Since May 29, 2026 it is sent as 気象防災速報（線状降水帯発生）, a weather disaster bulletin: a line of thunderstorms is dropping very heavy rain on the same place for hours, so floods and landslides can come fast. Check your area on JMA's KIKIKURU map and evacuate early from slopes and low ground. A new 線状降水帯直前予測 gives about 2-3 hours' notice.",
  },
  {
    q: "What does 南海トラフ地震臨時情報（巨大地震注意） mean?",
    a: "Nankai Trough Earthquake Extra Information (Megathrust Earthquake Attention): a quake of about M7+ in the Nankai Trough area means a megaquake is relatively more likely than usual for about a week. It is not a prediction. Live normally, re-check water, food and your evacuation route, and be ready to evacuate at once if you feel a quake near the coast. 巨大地震警戒 (Alert) is stronger: some coastal residents pre-evacuate for a week.",
  },
  {
    q: "What do I do if I get a J-ALERT missile alert?",
    a: "Outdoors, go into a sturdy building or underground (a subway station) right away; with no building nearby, take cover or lie flat and protect your head. Indoors, move away from windows. A missile can arrive in under 10 minutes. Follow-up messages say whether it passed over or landed.",
  },
  {
    q: "Is this an alert app? Does it show live alerts?",
    a: "No. It has no live data and sends no alerts. It explains an alert you already received, using dated official rules. For current alerts use JMA's warnings and earthquake maps (linked in every result), your phone's emergency alerts and the Japan Tourism Agency's Safety tips app. Always follow official instructions.",
  },
  {
    q: "Is there a free API for AI agents to decode Japanese alerts?",
    a: `Yes. Free, no key, CORS open: GET ${PUBLIC_URL}/api/decode?text=レベル4土砂災害危険警報 returns the alert, level, colour, urgency, meaning, what to do, official names in 14 languages and sources. All alert types at ${PUBLIC_URL}/api/rules, OpenAPI at ${PUBLIC_URL}/openapi.json, and the japan_emergency_alert_decode tool on https://free-agent-tools.vercel.app/mcp.`,
  },
  {
    q: "スマホに届いた緊急速報の意味を英語で知るには？",
    a: "警報の文面をそのまま貼り付けると、何の情報か、警戒レベル、今すぐ取るべき行動、気象庁の多言語辞書による公式名称（英語・中国語・韓国語・ベトナム語など14言語）を表示します。2026年5月29日からの新しい防災気象情報（レベル4土砂災害危険警報など）と旧名称（土砂災害警戒情報、洪水警報など）の対応にも対応しています。",
  },
  {
    q: "「危険警報」とは何ですか？",
    a: "2026年5月29日から始まった新しい防災気象情報で、警戒レベル4相当の情報です（紫）。大雨・土砂災害・氾濫・高潮の4つがあり、例えば土砂災害警戒情報はレベル4土砂災害危険警報になりました。危険な場所にいる人は全員避難します（レベル4までに必ず避難）。",
  },
];

const r = rules();
const renamedRows = LEGACY.filter((l) => !l.nameJa.startsWith("避難")).slice(0, 14);

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <section className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Free · Japan · 緊急速報 · data {RULES_AS_OF}</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">What does this Japanese alert mean?</h1>
        <p className="mt-4 max-w-2xl text-lg font-medium text-foreground sm:text-xl">Japan emergency alert decoder: earthquake, tsunami, Level 1-5 warnings, evacuation, J-ALERT</p>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Paste the alert your phone, TV or app showed (Japanese or English). Get what it is, the alert level, what to do right now where you are, and its official name in 14 languages. Includes the new level-named warnings that started on May 29, 2026.
        </p>
      </section>

      <section className="mt-8">
        <Decoder />
      </section>

      <section className="mt-16 max-w-4xl">
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Japan&apos;s 5 alert levels (since 2026-05-29)</h2>
        <div className="mt-5 overflow-x-auto rounded-3xl border border-line">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="bg-panel/80 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Level</th>
                <th className="px-4 py-3 font-medium">Weather warning (JMA)</th>
                <th className="px-4 py-3 font-medium">Evacuation info (your city)</th>
                <th className="px-4 py-3 font-medium">What to do</th>
              </tr>
            </thead>
            <tbody>
              {r.alertLevels.map((l) => (
                <tr key={l.level} className="border-t border-line align-top">
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold" style={{ background: COLOR_HEX[l.color], color: ["black", "purple", "red"].includes(l.color) ? "#fff" : "#000", border: l.color === "black" ? "1px solid #666" : undefined }}>
                      {l.level} · {l.color}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground">{l.weather}</td>
                  <td className="px-4 py-3 text-muted">{l.municipality ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{l.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 font-display text-3xl tracking-tight sm:text-4xl">Old name → new name</h2>
        <div className="mt-5 overflow-x-auto rounded-3xl border border-line">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-panel/80 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Before 2026-05-29</th>
                <th className="px-4 py-3 font-medium">Now</th>
              </tr>
            </thead>
            <tbody>
              {renamedRows.map((l) => (
                <tr key={l.nameJa} className="border-t border-line align-top">
                  <td className="px-4 py-3 text-foreground">{l.nameJa}</td>
                  <td className="px-4 py-3 text-muted">
                    {l.replacedBy.map((id) => {
                      const a = getAlert(id)!;
                      return (
                        <Link key={id} href={`/r?a=${id}`} className="mr-3 underline underline-offset-2 hover:text-foreground">
                          {a.nameJa} ({a.nameEn})
                        </Link>
                      );
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted">
          Main sources:{" "}
          <a className="underline underline-offset-2 hover:text-foreground" href="https://www.jma.go.jp/jma/kishou/know/bosai/keiho-update2026/index.html" target="_blank" rel="noopener noreferrer">
            JMA new disaster weather information (2026)
          </a>
          ,{" "}
          <a className="underline underline-offset-2 hover:text-foreground" href="https://www.jma.go.jp/jma/kishou/know/jishin/eew/index.html" target="_blank" rel="noopener noreferrer">
            JMA Earthquake Early Warning
          </a>
          ,{" "}
          <a className="underline underline-offset-2 hover:text-foreground" href="https://www.data.jma.go.jp/developer/multilingual.html" target="_blank" rel="noopener noreferrer">
            JMA multilingual dictionary
          </a>
          , Cabinet Office and J-ALERT pages; every source in{" "}
          <a className="underline underline-offset-2 hover:text-foreground" href="/api/rules">
            /api/rules
          </a>
          .
        </p>
      </section>

      <section className="mt-12 max-w-3xl rounded-3xl border border-line bg-panel/40 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground">For AI agents and developers</h2>
        <p className="mt-2 text-sm text-muted">
          Keyless JSON, CORS open, GET or POST:{" "}
          <a className="font-mono text-foreground underline underline-offset-2 break-all" href="/api/decode?text=%E3%83%AC%E3%83%99%E3%83%AB4%E5%9C%9F%E7%A0%82%E7%81%BD%E5%AE%B3%E5%8D%B1%E9%99%BA%E8%AD%A6%E5%A0%B1&lang=vi">
            /api/decode?text=レベル4土砂災害危険警報&amp;lang=vi
          </a>
          . All alert types: <a className="font-mono text-foreground underline underline-offset-2" href="/api/rules">/api/rules</a>. Docs: <a className="underline underline-offset-2" href="/openapi.json">OpenAPI</a>,{" "}
          <a className="underline underline-offset-2" href="/llms.txt">llms.txt</a>, MCP tool <span className="font-mono text-foreground">japan_emergency_alert_decode</span> on{" "}
          <a className="underline underline-offset-2" href="https://free-agent-tools.vercel.app" target="_blank" rel="noopener noreferrer">
            free-agent-tools
          </a>
          .
        </p>
      </section>

      <FaqSection items={faq} heading="Japan alert questions" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}
