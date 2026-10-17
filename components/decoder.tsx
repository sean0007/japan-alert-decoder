"use client";

import { useState } from "react";
import { CardDisclaimer } from "@/components/card-disclaimer";
import { ShareBar } from "@/components/share-bar";
import { LANGS, SITUATIONS, SITUATION_LABEL, decodeAlert, getAlert, type Lang, type Situation } from "@/lib/alerts";
import { COLOR_HEX, PUBLIC_URL, resultPath, type Shared } from "@/lib/share";

const field = "mt-2 w-full rounded-xl border border-line bg-black/40 px-3 py-2 text-sm text-foreground focus:border-amber";

const QUICK: { id: string; label: string }[] = [
  { id: "eew-warning", label: "緊急地震速報 EEW" },
  { id: "eew-cancel", label: "EEW cancelled" },
  { id: "major-tsunami-warning", label: "大津波警報" },
  { id: "tsunami-warning", label: "津波警報" },
  { id: "tsunami-advisory", label: "津波注意報" },
  { id: "l5-heavy-rain", label: "レベル5 大雨特別警報" },
  { id: "l4-landslide", label: "レベル4 土砂災害危険警報" },
  { id: "l4-flood", label: "レベル4 氾濫危険警報" },
  { id: "l3-heavy-rain", label: "レベル3 大雨警報" },
  { id: "l2-heavy-rain", label: "レベル2 大雨注意報" },
  { id: "evac-l4", label: "避難指示" },
  { id: "evac-l3", label: "高齢者等避難" },
  { id: "bulletin-linear-rainband", label: "線状降水帯" },
  { id: "nankai-megaquake-advisory", label: "南海トラフ 巨大地震注意" },
  { id: "missile", label: "Jアラート ミサイル" },
  { id: "storm-warning", label: "暴風警報" },
  { id: "heat-alert", label: "熱中症警戒アラート" },
  { id: "volcano-l3", label: "噴火警戒レベル3" },
];

const LANG_LABEL: Record<string, string> = { ja: "日本語", en: "English", "zh-CN": "简体中文", "zh-TW": "繁體中文", ko: "한국어", pt: "Português", es: "Español", id: "Bahasa Indonesia", vi: "Tiếng Việt", tl: "Tagalog", th: "ไทย", ne: "नेपाली", km: "ខ្មែរ", my: "မြန်မာ", mn: "Монгол" };

const URGENCY_TONE: Record<string, string> = {
  act_now: "border-rose-400 bg-rose-500/15 text-rose-100",
  evacuate_now: "border-fuchsia-400 bg-fuchsia-500/15 text-fuchsia-100",
  evacuate_if_vulnerable: "border-red-400 bg-red-500/10 text-red-100",
  prepare: "border-amber bg-amber/10 text-amber-100",
  stay_alert: "border-line bg-white/5 text-foreground",
  info: "border-teal-400/60 bg-teal-500/10 text-teal-100",
};

export function Decoder({ initial }: { initial?: Shared }) {
  const startAlert = initial ? getAlert(initial.alert) : undefined;
  const [text, setText] = useState<string>(startAlert ? startAlert.nameJa : "緊急地震速報 千葉県北西部で地震 強い揺れに備えてください（気象庁）");
  const [situation, setSituation] = useState<Situation | "">(initial?.situation ?? "");
  const [lang, setLang] = useState<Lang>(initial?.lang ?? "en");

  const result = (() => {
    try {
      return text.trim() ? decodeAlert({ text, situation: situation || null, lang }) : null;
    } catch {
      return null;
    }
  })();
  const p = result?.primary ?? null;
  const shared: Shared | null = p ? { alert: p.id, situation: situation || null, lang: lang === "en" ? null : lang } : null;
  const shareUrl = shared ? `${PUBLIC_URL}${resultPath(shared)}` : PUBLIC_URL;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="rounded-3xl border border-line bg-panel/60 p-5 sm:p-6">
        <label className="block">
          <span className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">Paste the alert (Japanese or English)</span>
          <textarea
            data-testid="alert-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            maxLength={4000}
            placeholder="e.g. レベル4土砂災害危険警報 / 【警戒レベル4】避難指示 / 大津波警報 / Missile launch"
            className={`${field} font-[inherit] leading-relaxed`}
          />
        </label>

        <div className="mt-4">
          <p className="text-sm font-medium text-foreground">Or tap one</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {QUICK.map((q) => (
              <button
                key={q.id}
                type="button"
                data-alert={q.id}
                onClick={() => setText(getAlert(q.id)?.nameJa ?? q.label)}
                className={`rounded-full border px-2.5 py-1 text-xs ${p?.id === q.id ? "border-amber bg-amber/15 text-foreground" : "border-line text-muted hover:text-foreground"}`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-medium text-foreground">Where are you? (optional)</legend>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SITUATIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSituation(situation === s ? "" : s)}
                className={`rounded-full border px-2.5 py-1 text-xs ${situation === s ? "border-amber bg-amber/15 text-foreground" : "border-line text-muted hover:text-foreground"}`}
              >
                {SITUATION_LABEL[s]}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mt-5 block">
          <span className="text-sm font-medium text-foreground">Official name in</span>
          <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} className={field}>
            {LANGS.map((l) => (
              <option key={l} value={l}>
                {LANG_LABEL[l] ?? l}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col overflow-hidden rounded-3xl border border-line bg-black/40">
        <div className="flex-1 p-5 sm:p-7">
          {result && p ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                {p.level ? (
                  <span
                    className="rounded-full px-3 py-1 font-mono text-xs font-semibold"
                    style={{ background: p.color ? COLOR_HEX[p.color] : "#334155", color: p.color === "black" || p.color === "purple" || p.color === "red" ? "#fff" : "#000", border: p.color === "black" ? "1px solid #666" : undefined }}
                  >
                    {p.levelKind === "volcanic-alert-level" ? "Volcanic level" : "Level"} {p.level}
                  </span>
                ) : null}
                {result.urgency ? <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${URGENCY_TONE[result.urgency]}`}>{result.urgencyLabel}</span> : null}
                {result.modifiers.drill ? <span className="rounded-full border border-line px-3 py-1 text-xs">Drill / test</span> : null}
                {result.modifiers.lifted ? <span className="rounded-full border border-teal-400/60 px-3 py-1 text-xs text-teal-100">Lifted 解除</span> : null}
              </div>
              <p className="mt-4 font-mono text-[11px] tracking-[0.22em] text-muted uppercase">{p.nameJa}</p>
              <h2 data-testid="alert-name" className="mt-1 text-2xl font-semibold leading-snug text-foreground">
                {p.nameEn}
              </h2>
              {p.nameLocal && lang !== "en" && lang !== "ja" ? <p className="mt-1 text-base text-amber">{p.nameLocal}</p> : null}
              <p data-testid="headline" className="mt-3 text-sm leading-relaxed text-muted">
                {p.meaning}
              </p>

              <h3 className="mt-5 text-sm font-semibold text-foreground">What to do now</h3>
              <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground">
                {p.doNow.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ol>
              {p.dont.length ? (
                <>
                  <h3 className="mt-4 text-sm font-semibold text-foreground">Don&apos;t</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                    {p.dont.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              {p.howLong ? <p className="mt-4 text-sm text-muted"><span className="text-foreground">How long:</span> {p.howLong}</p> : null}
              {result.extracted.shindo ? (
                <p className="mt-3 text-sm text-muted">
                  <span className="text-foreground">{result.extracted.shindo.ja} · {result.extracted.shindo.en}:</span> {result.extracted.shindo.felt}
                </p>
              ) : null}
              {result.extracted.tsunamiHeight ? <p className="mt-2 text-sm text-muted"><span className="text-foreground">Tsunami height in the text:</span> {result.extracted.tsunamiHeight}</p> : null}
              {result.notes.length ? (
                <ul className="mt-4 space-y-1.5 text-xs leading-relaxed text-amber/90">
                  {result.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              ) : null}
              {p.note ? <p className="mt-3 text-xs leading-relaxed text-muted">{p.note}</p> : null}
              {result.also.length ? (
                <div className="mt-4 rounded-2xl border border-line p-3 text-xs text-muted">
                  <p className="text-foreground">Also in this text</p>
                  <ul className="mt-1 space-y-1">
                    {result.also.map((a) => (
                      <li key={a.id}>
                        {a.nameJa} · {a.nameEn}: {a.doNow[0]}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <p className="mt-4 text-xs text-muted">
                Issued by: {p.issuedBy}. Live status:{" "}
                {result.checkLive.slice(0, 3).map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="mr-2 underline underline-offset-2 hover:text-foreground">
                    {l.label}
                  </a>
                ))}
              </p>
              <p className="mt-1 text-xs">
                {p.sources.slice(0, 3).map((s, i) => (
                  <a key={s} href={s} target="_blank" rel="noopener noreferrer" className="mr-3 text-muted underline underline-offset-2 hover:text-foreground">
                    source {i + 1}
                  </a>
                ))}
              </p>
              <div className="mt-5">
                <ShareBar url={shareUrl} text={`${p.nameJa} = ${p.nameEn}. What it means and what to do:`} />
              </div>
            </>
          ) : (
            <p className="text-muted">
              {text.trim() ? "Not recognised. Paste the alert's title line (e.g. 緊急地震速報, 津波警報, レベル4土砂災害危険警報, 避難指示) or tap one of the buttons." : "Paste an alert or tap one of the buttons."}
            </p>
          )}
        </div>
        <CardDisclaimer />
      </div>
    </div>
  );
}
