import type { Metadata } from "next";
import { RULES_AS_OF, SOURCES } from "@/lib/alerts";
import { DISCLAIMER_SHORT, HONESTY } from "@/lib/site";

export const metadata: Metadata = { title: "Disclaimer", description: DISCLAIMER_SHORT };

export default function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Read this</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">Disclaimer</h1>
      <p className="mt-4 text-lg text-foreground">{DISCLAIMER_SHORT}</p>
      <p className="mt-2 text-muted">{HONESTY}</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-semibold text-foreground">What this is</h2>
          <p className="mt-2">
            A free, unofficial educational decoder. It matches the text of a Japanese emergency alert you paste (or an alert type you pick) against a dated copy (as of {RULES_AS_OF}) of the official alert system published by the Japan Meteorological Agency (JMA), the Cabinet Office, the Cabinet Secretariat (J-ALERT) and the Ministry of the Environment, and shows the general meaning, the alert level and the general actions those agencies recommend. Official names in other languages come from JMA&apos;s multilingual dictionary. It is not affiliated with any of these agencies.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">What it is not</h2>
          <p className="mt-2">
            It is not an alert or warning service, it has no live data, and it cannot tell you whether an alert is in effect for your location right now or how dangerous your exact spot is. Text matching can be wrong or incomplete; a recognised name does not mean the rest of the message was understood. The general actions shown do not replace the instructions of JMA, your municipality, police, fire services, transport or venue staff. In an emergency, protect yourself first and follow official instructions; check JMA&apos;s live maps, your phone&apos;s emergency alerts, local radio or TV and your municipality&apos;s announcements.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Rules change</h2>
          <p className="mt-2">
            Japan renamed its heavy-rain, flood, landslide and storm-surge warnings on 2026-05-29, and agencies adjust criteria and wording over time. This page reflects the sources below as of {RULES_AS_OF} and may lag behind later changes.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Sources</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 break-all">
            {SOURCES.map((s) => (
              <li key={s}>
                <a href={s} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Your data</h2>
          <p className="mt-2">Text you paste is decoded in your browser (or by the API if you call it) and is not stored. No login, no database. Anonymous page-view analytics only.</p>
        </section>
      </div>
    </div>
  );
}
